import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import StarIcon from '@mui/icons-material/Star';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DEFAULT_MACHINE_SETTINGS } from '@shared/constants';
import type {
  AppMachineSettings,
  WhisperModelDownloadProgress,
  WhisperModelInfo,
} from '@shared/types';
import React, { useCallback, useEffect, useState } from 'react';

type WhisperModelWithStatus = WhisperModelInfo & { downloaded: boolean };

export const EngineSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<AppMachineSettings>(DEFAULT_MACHINE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [whisperModels, setWhisperModels] = useState<WhisperModelWithStatus[]>([]);
  const [downloadingModelId, setDownloadingModelId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<WhisperModelDownloadProgress | null>(
    null
  );
  const [modelFilter, setModelFilter] = useState('');

  const selectedModelFileName = settings.whisperModelPath
    ? settings.whisperModelPath.split(/[/\\]/).pop() || settings.whisperModelPath
    : '';

  const loadSettings = async () => {
    try {
      setLoading(true);
      const stored = await window.api.getMachineSettings();
      setSettings({ ...DEFAULT_MACHINE_SETTINGS, ...stored });
      setFeedback(null);
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to load settings';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      void window.api.addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadWhisperModels = useCallback(async () => {
    try {
      const models = await window.api.getWhisperAvailableModels();
      setWhisperModels(models);
    } catch {
      // Silently fail — the list will remain empty
    }
  }, []);

  useEffect(() => {
    void loadSettings();
    void loadWhisperModels();
  }, [loadWhisperModels]);

  useEffect(() => {
    const unsubscribe = window.api.onWhisperModelDownloadProgress((progress) => {
      setDownloadProgress(progress);
    });
    return unsubscribe;
  }, []);

  const handleDownloadWhisperModel = async (fileName: string) => {
    try {
      setDownloadingModelId(fileName);
      setDownloadProgress(null);
      const result = await window.api.downloadWhisperModel(fileName);
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
      if (result.success) {
        await loadWhisperModels();
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Download failed';
      setFeedback({ type: 'error', message: errorMsg });
    } finally {
      setDownloadingModelId(null);
      setDownloadProgress(null);
    }
  };

  const handleUseWhisperModel = async (fileName: string) => {
    try {
      const result = await window.api.useWhisperModel(fileName);
      if (result.success && result.modelPath) {
        setSettings((prev) => ({ ...prev, whisperModelPath: result.modelPath! }));
      }
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to select model';
      setFeedback({ type: 'error', message: errorMsg });
    }
  };

  const handleCancelWhisperDownload = async () => {
    try {
      await window.api.cancelWhisperModelDownload();
      setFeedback({ type: 'success', message: 'Download cancelled.' });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to cancel download';
      setFeedback({ type: 'error', message: errorMsg });
    }
  };

  const handleDeleteWhisperModel = async (fileName: string) => {
    try {
      const result = await window.api.deleteWhisperModel(fileName);
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
      if (result.success) {
        await loadWhisperModels();
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to delete model';
      setFeedback({ type: 'error', message: errorMsg });
    }
  };

  const updateField = (key: keyof AppMachineSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickWhisperModelPath = async () => {
    try {
      const selectedPath = await window.api.pickWhisperModelPath();
      if (selectedPath) {
        updateField('whisperModelPath', selectedPath);
        setFeedback({
          type: 'success',
          message: `Selected model: ${selectedPath.split(/[/\\]/).pop() || selectedPath}`,
        });
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to select model file';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  const handleClearWhisperModelPath = () => {
    updateField('whisperModelPath', '');
    setFeedback(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await window.api.updateMachineSettings(settings);
      setSettings(result.settings);
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to save settings';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      void window.api.addNotification(errorMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const result = await window.api.resetMachineSettings();
      setSettings(result.settings);
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to reset settings';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      void window.api.addNotification(errorMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenWhisperInstallGuide = async () => {
    const installGuideUrl = 'https://github.com/ggml-org/whisper.cpp#quick-start';
    try {
      const apiWithOptionalHelp = window.api as typeof window.api & {
        openWhisperInstallGuide?: () => Promise<{ success: boolean; message: string }>;
      };

      if (typeof apiWithOptionalHelp.openWhisperInstallGuide === 'function') {
        const result = await apiWithOptionalHelp.openWhisperInstallGuide();
        setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
        return;
      }

      window.open(installGuideUrl, '_blank', 'noopener,noreferrer');
      setFeedback({
        type: 'success',
        message: 'Opened Whisper install guide in a new tab.',
      });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to open Whisper install guide';
      setFeedback({ type: 'error', message: errorMsg });
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  const handleOpenWhisperModelsPage = async () => {
    const modelsPageUrl = 'https://huggingface.co/ggerganov/whisper.cpp/tree/main';
    try {
      const apiWithOptionalHelp = window.api as typeof window.api & {
        openWhisperModelsPage?: () => Promise<{ success: boolean; message: string }>;
      };

      if (typeof apiWithOptionalHelp.openWhisperModelsPage === 'function') {
        const result = await apiWithOptionalHelp.openWhisperModelsPage();
        setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
        return;
      }

      window.open(modelsPageUrl, '_blank', 'noopener,noreferrer');
      setFeedback({
        type: 'success',
        message: 'Opened Whisper models page in a new tab.',
      });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to open Whisper models page';
      setFeedback({ type: 'error', message: errorMsg });
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Speech-to-Text Engine
        </Typography>

        {feedback && <Alert severity={feedback?.type}>{feedback?.message}</Alert>}

        <FormControlLabel
          control={
            <Switch
              checked={settings.bubbleEnabled}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, bubbleEnabled: e.target.checked }))
              }
              disabled={loading || saving}
            />
          }
          label="Floating Bubble"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
          }}
        >
          <Stack flex={1} spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Whisper Command
              </Typography>
              <Tooltip title="Open installation guide">
                <IconButton
                  size="small"
                  aria-label="Open Whisper installation guide"
                  onClick={() => void handleOpenWhisperInstallGuide()}
                  disabled={loading || saving}
                >
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <TextField
              value={settings.whisperCommand}
              onChange={(event) => updateField('whisperCommand', event.target.value)}
              helperText="Use absolute path when packaged. macOS (Apple Silicon): /opt/homebrew/bin/whisper-cli · Windows: C:\\whisper\\whisper-cli.exe"
              disabled={loading || saving}
              fullWidth
              size="small"
            />
          </Stack>

          <Stack flex={1} spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Whisper Model File
              </Typography>
              <Tooltip title="Open model download page">
                <IconButton
                  size="small"
                  aria-label="Open Whisper models page"
                  onClick={() => void handleOpenWhisperModelsPage()}
                  disabled={loading || saving}
                >
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <TextField
              value={selectedModelFileName}
              helperText={
                settings.whisperModelPath
                  ? `Stored path: ${settings.whisperModelPath}`
                  : 'Choose a local Whisper model file. The full path is stored internally.'
              }
              disabled={loading || saving}
              InputProps={{ readOnly: true }}
              fullWidth
              size="small"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
              <Button
                variant="outlined"
                onClick={() => void handlePickWhisperModelPath()}
                disabled={loading || saving}
                size="small"
              >
                Browse
              </Button>
              <Button
                variant="text"
                onClick={handleClearWhisperModelPath}
                disabled={loading || saving || !settings.whisperModelPath}
                size="small"
              >
                Clear
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Whisper Model Download Section */}
        <Box sx={{ mt: 2 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Models Directory
              </Typography>
            </Stack>
            <TextField
              value={settings.whisperModelsDir || ''}
              onChange={(event) => updateField('whisperModelsDir', event.target.value)}
              placeholder="Default: app data folder"
              helperText={
                settings.whisperModelsDir
                  ? `Models will be stored in: ${settings.whisperModelsDir}`
                  : 'Leave empty to use the default app data folder. Change requires Save.'
              }
              disabled={loading || saving}
              fullWidth
              size="small"
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                disabled={loading || saving}
                onClick={async () => {
                  try {
                    const dir = await window.api.pickWhisperModelsDir();
                    if (dir) {
                      updateField('whisperModelsDir', dir);
                      setFeedback({ type: 'success', message: `Models directory: ${dir}` });
                    }
                  } catch (error) {
                    setFeedback({ type: 'error', message: (error as Error).message });
                  }
                }}
              >
                Browse
              </Button>
              <Button
                variant="text"
                size="small"
                disabled={loading || saving || !settings.whisperModelsDir}
                onClick={() => updateField('whisperModelsDir', '')}
              >
                Reset to Default
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Download Whisper Models
            </Typography>
            <Chip label="Hugging Face" size="small" variant="outlined" />
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Download models directly from Hugging Face. Models are stored in the directory above.
          </Typography>

          <TextField
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            placeholder="Filter models… (e.g. large, turbo, q8)"
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />

          <Box
            sx={{
              maxHeight: 280,
              overflowY: 'auto',
              pr: 0.5,
            }}
          >
            <Stack spacing={1}>
              {whisperModels
                .filter((m) => {
                  if (!modelFilter.trim()) return true;
                  const q = modelFilter.toLowerCase();
                  return (
                    m.fileName.toLowerCase().includes(q) ||
                    m.label.toLowerCase().includes(q) ||
                    m.quality.toLowerCase().includes(q)
                  );
                })
                .map((model) => {
                  const isDownloading = downloadingModelId === model.fileName;
                  const isCurrentModel = settings.whisperModelPath.includes(model.fileName);

                  return (
                    <Paper
                      key={model.fileName}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        bgcolor: isCurrentModel ? 'action.selected' : undefined,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {model.label}
                          </Typography>
                          {model.recommended && (
                            <Tooltip title="Recommended">
                              <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
                            </Tooltip>
                          )}
                          {isCurrentModel && (
                            <Chip label="Active" size="small" color="primary" sx={{ ml: 0.5 }} />
                          )}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {model.size} · {model.quality} ·{' '}
                          {model.multilingual ? 'Multilingual' : 'English only'}
                        </Typography>
                        {isDownloading && downloadProgress && (
                          <Box sx={{ mt: 0.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={downloadProgress.percent}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {downloadProgress.percent}% (
                              {Math.round(downloadProgress.downloadedBytes / 1024 / 1024)} MB
                              {downloadProgress.totalBytes > 0 &&
                                ` / ${Math.round(downloadProgress.totalBytes / 1024 / 1024)} MB`}
                              )
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Stack direction="row" spacing={0.5}>
                        {model.downloaded ? (
                          <>
                            {!isCurrentModel && (
                              <Tooltip title="Use this model">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => void handleUseWhisperModel(model.fileName)}
                                  disabled={saving || !!downloadingModelId}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {!isCurrentModel && (
                              <Tooltip title="Delete model">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => void handleDeleteWhisperModel(model.fileName)}
                                  disabled={saving || !!downloadingModelId}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        ) : isDownloading ? (
                          <Tooltip title="Cancel download">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => void handleCancelWhisperDownload()}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Download model">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => void handleDownloadWhisperModel(model.fileName)}
                              disabled={saving || !!downloadingModelId}
                            >
                              <CloudDownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
            </Stack>
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={() => void handleSave()}
            disabled={loading || saving}
            size="small"
          >
            Save Settings
          </Button>
          <Button
            variant="outlined"
            onClick={() => void handleReset()}
            disabled={loading || saving}
            size="small"
          >
            Reset Defaults
          </Button>
          <Button
            variant="text"
            onClick={() => void loadSettings()}
            disabled={loading || saving}
            size="small"
          >
            Reload
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
