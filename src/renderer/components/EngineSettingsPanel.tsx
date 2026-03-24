import HelpIcon from '@mui/icons-material/Help';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DEFAULT_MACHINE_SETTINGS } from '@shared/constants';
import type { AppMachineSettings } from '@shared/types';
import React, { useEffect, useState } from 'react';

export const EngineSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<AppMachineSettings>(DEFAULT_MACHINE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

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

  useEffect(() => {
    void loadSettings();
  }, []);

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
