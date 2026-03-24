import { LanguageSelector } from '@/components/DictationPanel';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { DEFAULT_MACHINE_SETTINGS, getLanguageName } from '@shared/constants';
import type { AppMachineSettings } from '@shared/types';
import React, { useEffect, useState } from 'react';

export const TranslationSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<AppMachineSettings>(DEFAULT_MACHINE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const outputLanguageName = getLanguageName(settings.defaultDictationLanguage);
  const spokenLanguageName = getLanguageName(settings.sourceLanguage);
  const translationEnabled = settings.defaultDictationLanguage !== settings.sourceLanguage;

  const loadSettings = async () => {
    try {
      setLoading(true);
      const stored = await window.api.getMachineSettings();
      setSettings({ ...DEFAULT_MACHINE_SETTINGS, ...stored });
      setFeedback(null);
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to load translation settings';
      setFeedback({ type: 'error', message: errorMsg });
      void window.api.addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const updateField = (key: 'defaultDictationLanguage' | 'sourceLanguage', value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSwapLanguages = () => {
    setSettings((prev) => ({
      ...prev,
      defaultDictationLanguage: prev.sourceLanguage,
      sourceLanguage: prev.defaultDictationLanguage,
    }));
    setFeedback({
      type: 'success',
      message: 'Spoken and output languages were swapped.',
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await window.api.updateMachineSettings({
        defaultDictationLanguage: settings.defaultDictationLanguage,
        sourceLanguage: settings.sourceLanguage,
      });
      setSettings((prev) => ({ ...prev, ...result.settings }));
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to save translation settings';
      setFeedback({ type: 'error', message: errorMsg });
      void window.api.addNotification(errorMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Translation
        </Typography>

        {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

        <Alert severity={translationEnabled ? 'info' : 'success'}>
          {translationEnabled
            ? `Translation is ON: spoken ${spokenLanguageName} -> output ${outputLanguageName}.`
            : `Translation is OFF: spoken language and output language are both ${outputLanguageName}.`}
        </Alert>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Quick Language Action
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Swap spoken and output languages with one click.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSwapLanguages}
            disabled={loading || saving}
          >
            Swap Languages
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
          }}
        >
          <Stack spacing={1}>
            <LanguageSelector
              label="Spoken language (what you say)"
              currentLanguage={settings.sourceLanguage}
              onLanguageChange={(lang) => updateField('sourceLanguage', lang)}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Set the language you speak into the microphone.
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <LanguageSelector
              label="Output language (sent to VS Code)"
              currentLanguage={settings.defaultDictationLanguage}
              onLanguageChange={(lang) => updateField('defaultDictationLanguage', lang)}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              The final text inserted in VS Code will be in this language.
            </Typography>
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
