import { app } from 'electron';
import { createWriteStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const HF_REPO = 'ggerganov/whisper.cpp';
const HF_API_URL = `https://huggingface.co/api/models/${HF_REPO}`;
const HF_RESOLVE_URL = `https://huggingface.co/${HF_REPO}/resolve/main`;

export interface WhisperModelInfo {
  id: string;
  fileName: string;
  label: string;
  size: string;
  sizeBytes: number;
  multilingual: boolean;
  quality: string;
  recommended?: boolean;
}

/** Quality hints for well-known model tiers — the rest are derived from the file name. */
const QUALITY_HINTS: Record<string, { quality: string; recommended?: boolean }> = {
  'large-v3-turbo': { quality: 'Excellent', recommended: true },
  'large-v3': { quality: 'Excellent' },
  'large-v2': { quality: 'Excellent' },
  'large-v1': { quality: 'Very Good' },
  large: { quality: 'Very Good' },
  medium: { quality: 'Good' },
  small: { quality: 'Fair' },
  base: { quality: 'Basic' },
  tiny: { quality: 'Minimal' },
};

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes >= 1_048_576) return `${Math.round(bytes / 1_048_576)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function parseModelMeta(fileName: string, sizeBytes: number): WhisperModelInfo {
  // Example: ggml-large-v3-turbo-q8_0.bin → id = large-v3-turbo-q8_0
  const stem = fileName.replace(/^ggml-/, '').replace(/\.bin$/, '');
  const isEnglishOnly = stem.includes('.en');
  const multilingual = !isEnglishOnly;

  // Derive human-readable label: "large-v3-turbo-q8_0" → "Large V3 Turbo (Q8_0)"
  const baseName = stem.replace(/\.en/, '');
  const quantMatch = baseName.match(/-?(q\d[\w_]*)$/i);
  const tier = quantMatch ? baseName.replace(quantMatch[0], '') : baseName;
  const quantLabel = quantMatch ? ` (${quantMatch[1].toUpperCase()})` : '';
  const prettyTier = tier
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
  const label = `${prettyTier}${quantLabel}${isEnglishOnly ? ' [EN]' : ''}`;

  // Look up quality from tier
  const tierKey = tier.replace(/-q\d.*$/, '');
  const hints = QUALITY_HINTS[tierKey] ?? { quality: 'Unknown' };

  return {
    id: stem,
    fileName,
    label,
    size: formatBytes(sizeBytes),
    sizeBytes,
    multilingual,
    quality: hints.quality,
    recommended: hints.recommended,
  };
}

interface HfTreeEntry {
  type: string;
  path: string;
  size?: number;
}

/** Fetch the list of available whisper.cpp models from Hugging Face. */
export async function fetchWhisperModelsFromHuggingFace(): Promise<WhisperModelInfo[]> {
  const response = await fetch(`${HF_API_URL}/tree/main`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch model list from Hugging Face: ${response.status}`);
  }

  const entries = (await response.json()) as HfTreeEntry[];

  return entries
    .filter((e) => e.type === 'file' && e.path.startsWith('ggml-') && e.path.endsWith('.bin'))
    .map((e) => parseModelMeta(e.path, e.size ?? 0))
    .sort((a, b) => b.sizeBytes - a.sizeBytes);
}

export interface WhisperModelDownloadProgress {
  modelId: string;
  fileName: string;
  downloadedBytes: number;
  totalBytes: number;
  percent: number;
}

export interface WhisperModelDownloadResult {
  success: boolean;
  message: string;
  modelPath?: string;
}

let _customModelsDir: string | null = null;

/** Set a custom directory for storing downloaded whisper models. */
export function setWhisperModelsDir(dir: string | null): void {
  _customModelsDir = dir && dir.trim() ? dir.trim() : null;
}

function getWhisperModelsDir(): string {
  return _customModelsDir || path.join(app.getPath('userData'), 'whisper-models');
}

export function getWhisperModelPath(fileName: string): string {
  return path.join(getWhisperModelsDir(), fileName);
}

export async function getDownloadedWhisperModels(): Promise<string[]> {
  const modelsDir = getWhisperModelsDir();
  try {
    const entries = await fs.readdir(modelsDir);
    return entries.filter(
      (name) => name.endsWith('.bin') || name.endsWith('.ggml') || name.endsWith('.gguf')
    );
  } catch {
    return [];
  }
}

export async function downloadWhisperModel(
  fileName: string,
  onProgress?: (progress: WhisperModelDownloadProgress) => void,
  abortSignal?: AbortSignal
): Promise<WhisperModelDownloadResult> {
  if (!fileName || !fileName.endsWith('.bin')) {
    return { success: false, message: `Invalid model file name: ${fileName}` };
  }

  const modelsDir = getWhisperModelsDir();
  await fs.mkdir(modelsDir, { recursive: true });

  const destPath = path.join(modelsDir, fileName);

  // Check if already downloaded
  try {
    const stats = await fs.stat(destPath);
    if (stats.isFile() && stats.size > 0) {
      return {
        success: true,
        message: `Model ${fileName} is already downloaded.`,
        modelPath: destPath,
      };
    }
  } catch {
    // File doesn't exist, proceed with download
  }

  const url = `${HF_RESOLVE_URL}/${fileName}`;
  const tempPath = `${destPath}.downloading`;

  try {
    const response = await fetch(url, { redirect: 'follow', signal: abortSignal });

    if (!response.ok) {
      return {
        success: false,
        message: `Download failed: HTTP ${response.status} ${response.statusText}`,
      };
    }

    if (!response.body) {
      return { success: false, message: 'Download failed: empty response body.' };
    }

    const totalBytes = Number(response.headers.get('content-length') || 0);
    let downloadedBytes = 0;

    const reportInterval = 500; // ms
    let lastReport = 0;

    const progressTransform = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        downloadedBytes += chunk.byteLength;
        const now = Date.now();
        if (onProgress && (now - lastReport >= reportInterval || downloadedBytes === totalBytes)) {
          lastReport = now;
          onProgress({
            modelId: fileName,
            fileName,
            downloadedBytes,
            totalBytes,
            percent: totalBytes > 0 ? Math.round((downloadedBytes / totalBytes) * 100) : 0,
          });
        }
        controller.enqueue(chunk);
      },
    });

    const progressStream = response.body.pipeThrough(progressTransform);
    const nodeStream = Readable.fromWeb(progressStream as Parameters<typeof Readable.fromWeb>[0]);
    const fileStream = createWriteStream(tempPath);

    // Destroy the stream if the abort signal fires during piping
    if (abortSignal) {
      const onAbort = () => {
        nodeStream.destroy(new Error('AbortError'));
        fileStream.destroy();
      };
      if (abortSignal.aborted) {
        onAbort();
      } else {
        abortSignal.addEventListener('abort', onAbort, { once: true });
      }
    }

    await pipeline(nodeStream, fileStream);

    // Rename temp file to final path
    await fs.rename(tempPath, destPath);

    return {
      success: true,
      message: `Model ${fileName} downloaded successfully.`,
      modelPath: destPath,
    };
  } catch (error) {
    // Clean up temp file on failure
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }

    if ((error as Error).name === 'AbortError' || (error as Error).message === 'AbortError') {
      return { success: false, message: 'Download cancelled.' };
    }

    return {
      success: false,
      message: `Download failed: ${(error as Error).message || 'Unknown error'}`,
    };
  }
}

export async function deleteWhisperModel(
  fileName: string
): Promise<{ success: boolean; message: string }> {
  if (!fileName) {
    return { success: false, message: 'File name is required.' };
  }

  const modelPath = path.join(getWhisperModelsDir(), fileName);
  try {
    await fs.unlink(modelPath);
    return { success: true, message: `Model ${fileName} deleted.` };
  } catch {
    return { success: false, message: 'Model file not found or already deleted.' };
  }
}
