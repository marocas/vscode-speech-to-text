import HelpIcon from '@mui/icons-material/Help';
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DEFAULT_OLLAMA_PROMPT } from '@shared/constants';
import type { AppLlmSettings } from '@shared/types';
import React, { useEffect, useState } from 'react';

export const LLMPromptManager: React.FC = () => {
  const [settings, setSettings] = useState<AppLlmSettings | null>(null);
  const [downloadModelName, setDownloadModelName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [downloadingModel, setDownloadingModel] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const DEFAULT_PROMPT = DEFAULT_OLLAMA_PROMPT;

  const PROMPT_PRESETS: Record<string, string> = {
    Clean:
      'You are a transcription cleaner. Keep the original meaning exactly. Correct punctuation, capitalization, and obvious speech-to-text mistakes. Do not add facts, do not summarize, and do not include explanations. Return only the cleaned text.',
    Translate:
      'You are a translator for speech-to-text output. Translate the input into Portuguese (Portugal) while preserving tone and meaning. Keep technical terms, code symbols, and product names unchanged when appropriate. Return only the translated text.',
    'Developer Format':
      'You are a developer-focused formatter for transcription output. Preserve technical terms and code tokens. Apply concise structure using short paragraphs or bullet points when helpful. Do not invent information and return only the final formatted text.',
  };

  const loadOllamaModels = async (baseUrl?: string) => {
    try {
      setModelsLoading(true);
      const models = await window.api.getOllamaModels(baseUrl ?? settings?.ollamaBaseUrl);
      setOllamaModels(models);
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to load Ollama models';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      void window.api.addNotification(errorMsg, 'error');
    } finally {
      setModelsLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const stored = await window.api.getLlmSettings();
      setSettings(stored);
      setDownloadModelName(stored.ollamaModel || '');
      const models = await window.api.getOllamaModels(stored.ollamaBaseUrl);
      setOllamaModels(models);
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

  const updateField = (key: keyof AppLlmSettings, value: string) => {
    if (settings) {
      setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const result = await window.api.updateLlmSettings(settings);
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

  const handleResetToDefault = () => {
    if (settings) {
      setSettings((prev) => (prev ? { ...prev, ollamaPrompt: DEFAULT_PROMPT } : null));
    }
  };

  const handleReload = async () => {
    await loadSettings();
  };

  const handleDownloadModel = async () => {
    if (!settings) {
      setFeedback({ type: 'error', message: 'LLM settings are not loaded yet.' });
      return;
    }

    if (!downloadModelName.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a model name to download.' });
      return;
    }

    try {
      setDownloadingModel(true);
      const result = await window.api.downloadOllamaModel(
        downloadModelName.trim(),
        settings.ollamaBaseUrl
      );
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });

      if (result.success) {
        await loadOllamaModels(settings.ollamaBaseUrl);
        updateField('ollamaModel', downloadModelName.trim());
      } else {
        void window.api.addNotification(result.message, 'error');
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to download model';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      void window.api.addNotification(errorMsg, 'error');
    } finally {
      setDownloadingModel(false);
    }
  };

  const applyPromptPreset = (presetName: keyof typeof PROMPT_PRESETS) => {
    updateField('ollamaPrompt', PROMPT_PRESETS[presetName]);
  };

  const handleOpenOllamaInstallGuide = () => {
    try {
      window.open('https://ollama.com/download', '_blank', 'noopener,noreferrer');
      setFeedback({
        type: 'success',
        message: 'Opened Ollama download page in your browser.',
      });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to open Ollama install page';
      setFeedback({ type: 'error', message: errorMsg });
    }
  };

  if (!settings) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          🤖 Configuration
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Configure your LLM (Ollama) server connection and customize the system prompt for text
          processing.
        </Typography>

        {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              🔗 Ollama Connection
            </Typography>
            <Tooltip title="Open Ollama installation page">
              <IconButton
                size="small"
                aria-label="Open Ollama installation guide"
                onClick={handleOpenOllamaInstallGuide}
                disabled={loading || saving}
              >
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack spacing={2}>
            <TextField
              label="Ollama Base URL"
              value={settings.ollamaBaseUrl}
              onChange={(event) => updateField('ollamaBaseUrl', event.target.value)}
              disabled={loading || saving}
              fullWidth
              helperText="e.g., http://127.0.0.1:11434"
            />

            <TextField
              label="Refinement Model"
              value={settings.ollamaModel}
              onChange={(event) => updateField('ollamaModel', event.target.value)}
              select
              disabled={loading || saving || modelsLoading}
              helperText={
                modelsLoading
                  ? 'Loading models from Ollama...'
                  : ollamaModels.length > 0
                    ? 'Model used for STT post-processing (punctuation, grammar, cleanup).'
                    : 'No models found. Check Ollama URL or click Refresh Models.'
              }
              fullWidth
            >
              {ollamaModels.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
              {settings.ollamaModel && !ollamaModels.includes(settings.ollamaModel) && (
                <MenuItem value={settings.ollamaModel}>{settings.ollamaModel} (current)</MenuItem>
              )}
            </TextField>

            <TextField
              label="Translation Model"
              value={settings.ollamaTranslationModel}
              onChange={(event) => updateField('ollamaTranslationModel', event.target.value)}
              select
              disabled={loading || saving || modelsLoading}
              helperText="Model used when translating between languages (e.g., translategemma:4b)."
              fullWidth
            >
              {ollamaModels.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
              {settings.ollamaTranslationModel &&
                !ollamaModels.includes(settings.ollamaTranslationModel) && (
                  <MenuItem value={settings.ollamaTranslationModel}>
                    {settings.ollamaTranslationModel} (current)
                  </MenuItem>
                )}
            </TextField>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                label="Download Ollama Model"
                value={downloadModelName}
                onChange={(event) => setDownloadModelName(event.target.value)}
                disabled={loading || saving || downloadingModel}
                fullWidth
                helperText="Example: qwen2.5:7b, llama3.1:8b"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => void handleDownloadModel()}
                disabled={loading || saving || downloadingModel || !downloadModelName.trim()}
                sx={{ minWidth: { sm: 170 } }}
              >
                {downloadingModel ? 'Downloading...' : 'Download Model'}
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            💬 System Prompt
          </Typography>
          <TextField
            label="System Prompt"
            value={settings.ollamaPrompt}
            onChange={(event) => updateField('ollamaPrompt', event.target.value)}
            multiline
            rows={6}
            disabled={loading || saving}
            fullWidth
            placeholder="Enter the system prompt for your LLM..."
            helperText="This prompt is sent to Ollama before each request. Use it to instruct the model on how to format responses, what tone to use, etc."
          />

          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontStyle: 'italic', mt: 1 }}
          >
            📝 Tip: Include instructions like 'Be concise', 'Use bullet points', 'Respond in
            Portuguese', etc. to customize model behavior.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => applyPromptPreset('Clean')}
              disabled={loading || saving}
              size="small"
            >
              Clean
            </Button>
            <Button
              variant="outlined"
              onClick={() => applyPromptPreset('Translate')}
              disabled={loading || saving}
              size="small"
            >
              Translate
            </Button>
            <Button
              variant="outlined"
              onClick={() => applyPromptPreset('Developer Format')}
              disabled={loading || saving}
              size="small"
            >
              Developer Format
            </Button>
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
            onClick={handleResetToDefault}
            disabled={loading || saving}
            size="small"
          >
            Reset Prompt
          </Button>
          <Button
            variant="text"
            onClick={() => void handleReload()}
            disabled={loading || saving}
            size="small"
          >
            Reload
          </Button>
          <Button
            variant="text"
            onClick={async () => {
              try {
                setSaving(true);
                const result = await window.api.resetLlmSettings();
                setSettings(result.settings);
                setFeedback({
                  type: result.success ? 'success' : 'error',
                  message: result.message,
                });
              } catch (error) {
                setFeedback({
                  type: 'error',
                  message: (error as Error).message || 'Failed to reset LLM settings',
                });
              } finally {
                setSaving(false);
              }
            }}
            disabled={loading || saving}
          >
            Reset All
          </Button>
          <Button
            variant="text"
            onClick={() => void loadOllamaModels()}
            disabled={loading || saving || modelsLoading || downloadingModel}
            size="small"
          >
            Refresh Models
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
