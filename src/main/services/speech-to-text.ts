import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import {
  DEFAULT_OLLAMA_BASE_URL,
  DEFAULT_OLLAMA_MODEL,
  DEFAULT_OLLAMA_PROMPT,
  DEFAULT_OLLAMA_TRANSLATION_MODEL,
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_WHISPER_COMMAND,
  getLanguageName,
} from '../../shared/constants';
import { applyDeveloperCorrections } from '../../shared/developer-utils';
import type { AppLlmSettings, DictationHistoryEntry, DictationResult } from '../../shared/types';
import type { DatabaseService } from './database';

export type SpeechMachineSettings = {
  whisperCommand: string;
  whisperModelPath: string;
  sourceLanguage?: string;
};

type OllamaGenerateResponse = {
  response?: string;
};

const execFileAsync = promisify(execFile);

export class SpeechToTextService {
  private customDictionary: Map<string, string> = new Map();
  private currentUserId: string | null = null;
  private targetLanguageForTranslation: string | null = null;
  private ollamaBaseUrl = DEFAULT_OLLAMA_BASE_URL;
  private ollamaModel = DEFAULT_OLLAMA_MODEL;
  private ollamaTranslationModel = DEFAULT_OLLAMA_TRANSLATION_MODEL;
  private ollamaPrompt = DEFAULT_OLLAMA_PROMPT;
  private sourceLanguage = DEFAULT_SOURCE_LANGUAGE;
  private whisperCommand = DEFAULT_WHISPER_COMMAND;
  private whisperModelPath = '';

  constructor(private dbService: DatabaseService) {}

  updateMachineSettings(settings: Partial<SpeechMachineSettings>) {
    if (typeof settings.whisperCommand === 'string') {
      this.whisperCommand = settings.whisperCommand.trim() || this.whisperCommand;
    }
    if (typeof settings.whisperModelPath === 'string') {
      this.whisperModelPath = settings.whisperModelPath.trim();
    }
    if (typeof settings.sourceLanguage === 'string' && settings.sourceLanguage.trim()) {
      this.sourceLanguage = settings.sourceLanguage.trim();
    }
  }

  updateLlmSettings(settings: Partial<AppLlmSettings>) {
    if (typeof settings.ollamaBaseUrl === 'string') {
      this.ollamaBaseUrl = settings.ollamaBaseUrl.trim() || this.ollamaBaseUrl;
    }
    if (typeof settings.ollamaModel === 'string') {
      this.ollamaModel = settings.ollamaModel.trim() || this.ollamaModel;
    }
    if (typeof settings.ollamaTranslationModel === 'string') {
      this.ollamaTranslationModel =
        settings.ollamaTranslationModel.trim() || this.ollamaTranslationModel;
    }
    if (typeof settings.ollamaPrompt === 'string') {
      const nextPrompt = settings.ollamaPrompt.trim();
      this.ollamaPrompt = nextPrompt || this.ollamaPrompt;
    }
  }

  async initialize() {
    // Dictionary loaded per-user in setCurrentUser
  }

  async setCurrentUser(userId: string | null) {
    this.currentUserId = userId;
    this.customDictionary.clear();
    if (userId) {
      const dict = await this.dbService.getDictionary(userId);
      dict.forEach((entry) => {
        this.customDictionary.set(entry.word.toLowerCase(), entry.word);
      });
    }
  }

  async startDictation(targetLanguage: string): Promise<void> {
    this.targetLanguageForTranslation = targetLanguage;
  }

  async stopDictation(finalText?: string): Promise<DictationHistoryEntry | null> {
    if (!finalText || !finalText.trim()) {
      return null;
    }

    if (!this.currentUserId) {
      throw new Error('You must be logged in to save dictations.');
    }

    return this.dbService.addDictation(
      finalText,
      this.targetLanguageForTranslation || 'unknown',
      this.currentUserId
    );
  }

  getDictations(limit = 50): Promise<DictationHistoryEntry[]> {
    if (!this.currentUserId) {
      return Promise.resolve([]);
    }

    return this.dbService.getDictations(this.currentUserId, limit);
  }

  deleteDictation(id: string): Promise<boolean> {
    if (!this.currentUserId) {
      return Promise.resolve(false);
    }

    return this.dbService.deleteDictation(id, this.currentUserId);
  }

  clearDictationHistory(): Promise<number> {
    if (!this.currentUserId) {
      return Promise.resolve(0);
    }

    return this.dbService.deleteAllDictations(this.currentUserId);
  }

  private toWhisperLanguage(language: string): string {
    return (language || 'en').split('-')[0].toLowerCase();
  }

  private buildWhisperCommandCandidates(): string[] {
    const candidates = [
      this.whisperCommand,
      'whisper-cli',
      '/opt/homebrew/bin/whisper-cli',
      '/usr/local/bin/whisper-cli',
      '/opt/homebrew/bin/whisper-cpp',
      '/usr/local/bin/whisper-cpp',
    ];

    // In packaged macOS apps, PATH may be minimal. Include common user bins.
    const homeDir = process.env.HOME || os.homedir();
    if (homeDir) {
      candidates.push(path.join(homeDir, '.local', 'bin', 'whisper-cli'));
      candidates.push(path.join(homeDir, '.local', 'bin', 'whisper-cpp'));
    }

    return [...new Set(candidates.map((item) => item.trim()).filter(Boolean))];
  }

  private normalizeTokens(input: string): string[] {
    return input
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  private sanitizeOllamaResponse(raw: string, original: string): string {
    let cleaned = raw.trim();
    if (!cleaned) {
      return original;
    }

    cleaned = cleaned
      .replace(/^```[\w-]*\s*/i, '')
      .replace(/\s*```$/i, '')
      .replace(
        /^(here(?:'|’)s\s+the\s+post-processed\s+transcript:?|note:|explanation:|corrected\s+transcript:?|output:|final\s+transcription:)/i,
        ''
      )
      .trim();

    if (!cleaned) {
      return original;
    }

    const originalTokens = this.normalizeTokens(original);
    const cleanedTokens = this.normalizeTokens(cleaned);

    if (originalTokens.length > 0 && originalTokens.length <= 6 && cleanedTokens.length > 14) {
      const cleanedSet = new Set(cleanedTokens);
      const overlap = originalTokens.filter((token) => cleanedSet.has(token)).length;
      const overlapRatio = overlap / originalTokens.length;

      // For very short inputs, reject long rewritten paragraphs with poor token overlap.
      if (overlapRatio < 0.34) {
        return original;
      }
    }

    const lower = cleaned.toLowerCase();
    const looksLikeAssistantReply =
      /^(sure|certainly|here('|’)s|i can|i will|let me|as an ai|desculpa|claro|posso|aqui está)/i.test(
        cleaned
      ) || /(you should|recomendo|é melhor|como fazer|passos|explica|explanation)/i.test(lower);

    const cleanedSet = new Set(cleanedTokens);
    const overlap = originalTokens.filter((token) => cleanedSet.has(token)).length;
    const overlapRatio = originalTokens.length > 0 ? overlap / originalTokens.length : 1;

    // Reject answers/help text and large semantic drift from dictated content.
    if (looksLikeAssistantReply || (originalTokens.length >= 4 && overlapRatio < 0.3)) {
      return original;
    }

    return cleaned;
  }

  /**
   * Lighter sanitizer for translation output.
   * Skips token-overlap checks — translated text intentionally shares no vocabulary with the source.
   * Only strips markdown fences and obvious assistant-reply prefixes.
   */
  private sanitizeTranslationResponse(raw: string): string | null {
    let cleaned = raw.trim();
    if (!cleaned) return null;

    cleaned = cleaned
      .replace(/^```[\w-]*\s*/i, '')
      .replace(/\s*```$/i, '')
      .replace(/^(here(?:'|')s\s+the\s+translation:?|translation:?|output:|result:?)/i, '')
      .trim();

    if (!cleaned) return null;

    const looksLikeAssistantReply =
      /^(sure|certainly|i can|i will|let me|as an ai|here is|of course)/i.test(cleaned);

    if (looksLikeAssistantReply) return null;

    return cleaned;
  }

  async transcribeWavAudio(audioWavBytes: Buffer, language: string): Promise<string> {
    if (!this.whisperModelPath) {
      throw new Error('Whisper model path is not configured. Set it in app settings.');
    }

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'smart-transcription-daemon-'));
    const wavPath = path.join(tempDir, 'input.wav');
    const outputPrefix = path.join(tempDir, 'transcript');
    const outputTxtPath = `${outputPrefix}.txt`;

    try {
      await fs.writeFile(wavPath, audioWavBytes);

      const whisperArgs = [
        '-m',
        this.whisperModelPath,
        '-f',
        wavPath,
        '-l',
        this.toWhisperLanguage(language),
        '--output-txt',
        '--output-file',
        outputPrefix,
      ];

      let lastExecutionError: NodeJS.ErrnoException | null = null;
      const candidates = this.buildWhisperCommandCandidates();
      for (const commandCandidate of candidates) {
        try {
          await execFileAsync(commandCandidate, whisperArgs);
          lastExecutionError = null;
          break;
        } catch (error) {
          const err = error as NodeJS.ErrnoException;
          if (err.code === 'ENOENT') {
            lastExecutionError = err;
            continue;
          }

          throw new Error(
            `whisper.cpp transcription failed: ${err.message || 'Unknown execution error'}`
          );
        }
      }

      if (lastExecutionError) {
        throw lastExecutionError;
      }

      const transcript = await fs.readFile(outputTxtPath, 'utf8');
      return transcript.trim();
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        throw new Error(
          `whisper.cpp command not found. Tried: ${this.buildWhisperCommandCandidates().join(', ')}. Install whisper.cpp and set an absolute command path in Settings (e.g. /opt/homebrew/bin/whisper-cli).`
        );
      }

      throw new Error(
        `whisper.cpp transcription failed: ${err.message || 'Unknown execution error'}`
      );
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }

  private async enhanceWithOllama(text: string): Promise<string> {
    const targetLanguage = this.targetLanguageForTranslation;
    const sourceLang = this.sourceLanguage;

    const sourceLangName = getLanguageName(sourceLang);
    const targetLangName = targetLanguage ? getLanguageName(targetLanguage) : null;

    const DEBUG_OLLAMA = process.env.DEBUG_OLLAMA === '1';

    if (DEBUG_OLLAMA) {
      console.log(`[Ollama] ─── Starting enhancement ──────────────────────────`);
      console.log(
        `[Ollama] Model: ${this.ollamaModel} | Source: ${sourceLang} (${sourceLangName}) | Target: ${targetLanguage ?? 'none'} (${targetLangName ?? 'n/a'})`
      );
      console.log(`[Ollama] Context: (none)`);
      console.log(`[Ollama] Input: "${text}"`);
    }

    const needsTranslation = Boolean(
      targetLanguage && targetLanguage !== sourceLang && targetLangName
    );

    let prompt: string;

    if (needsTranslation) {
      if (DEBUG_OLLAMA) console.log(`[Ollama] Mode: translate ${sourceLang} → ${targetLanguage}`);
      prompt = [
        `You are a professional ${sourceLangName} (${sourceLang}) to ${targetLangName} (${targetLanguage}) translator.`,
        `Your goal is to accurately convey the meaning and nuances of the original ${sourceLangName} text`,
        `while adhering to ${targetLangName} grammar, vocabulary, and cultural sensitivities.`,
        `Produce only the ${targetLangName} translation, without any additional explanations or commentary.`,
        `Please translate the following ${sourceLangName} text into ${targetLangName}:`,
        '',
        text,
      ].join('\n');
    } else {
      if (DEBUG_OLLAMA) console.log(`[Ollama] Mode: refine in ${sourceLang}`);
      prompt = [
        this.ollamaPrompt,
        '',
        `Keep the response in ${sourceLangName} (${sourceLang}).`,
        `Return only the final corrected transcript, without explanations or extra commentary.`,
        '',
        text,
      ].join('\n');
    }

    if (DEBUG_OLLAMA) {
      console.log(`[Ollama] Prompt:\n${prompt}`);
      console.log(`[Ollama] Sending request to ${this.ollamaBaseUrl}...`);
    }

    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: needsTranslation ? this.ollamaTranslationModel : this.ollamaModel,
          prompt,
          stream: false,
          options: {
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        console.error(`[Ollama] Request failed: HTTP ${response.status} ${response.statusText}`);
        return text;
      }

      const data = (await response.json()) as OllamaGenerateResponse;
      const refined = data.response?.trim();

      // When translating, skip token-overlap sanitization — different languages have near-zero overlap by design.
      const sanitized = refined
        ? needsTranslation
          ? this.sanitizeTranslationResponse(refined)
          : this.sanitizeOllamaResponse(refined, text)
        : null;

      if (DEBUG_OLLAMA) {
        console.log(`[Ollama] Raw response: "${refined ?? '(empty)'}"`);
        console.log(`[Ollama] Sanitized:    "${sanitized ?? '(rejected, using original)'}"`);
      }

      return sanitized || text;
    } catch (error) {
      console.error(`[Ollama] Request exception:`, error);
      return text;
    }
  }

  async processDictationResult(
    text: string,
    overrideTargetLanguage?: string,
    overrideSourceLanguage?: string
  ): Promise<DictationResult> {
    let processedText = text;

    // Apply developer-specific corrections
    processedText = applyDeveloperCorrections(processedText, this.customDictionary);

    // Optional local refinement via Ollama (and optional translation). Fallback is the corrected local text.
    // If overrideTargetLanguage is provided (e.g., from test panel), use it temporarily
    const previousTarget = this.targetLanguageForTranslation;
    const previousSource = this.sourceLanguage;
    if (overrideTargetLanguage) {
      this.targetLanguageForTranslation = overrideTargetLanguage;
    }
    if (overrideSourceLanguage) {
      this.sourceLanguage = overrideSourceLanguage;
    }
    processedText = await this.enhanceWithOllama(processedText);
    // Restore previous languages
    this.targetLanguageForTranslation = previousTarget;
    this.sourceLanguage = previousSource;

    return {
      text: processedText,
      confidence: 0.95,
      isFinal: true,
    };
  }
}
