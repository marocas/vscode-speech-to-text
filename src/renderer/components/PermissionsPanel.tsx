import { Alert, Box, FormControlLabel, Paper, Stack, Switch, Typography } from '@mui/material';
import { DEFAULT_MACHINE_SETTINGS } from '@shared/constants';
import type { AppMachineSettings, PermissionActionResult, SttReadinessStatus } from '@shared/types';
import React, { useEffect, useState } from 'react';

export const PermissionsPanel: React.FC = () => {
  const [settings, setSettings] = useState<AppMachineSettings>(DEFAULT_MACHINE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sttReadiness, setSttReadiness] = useState<SttReadinessStatus | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const microphoneStatusLabel = sttReadiness
    ? sttReadiness.microphonePermission === 'granted'
      ? 'Granted'
      : sttReadiness.microphonePermission === 'not-determined'
        ? 'Not requested yet'
        : sttReadiness.microphonePermission
    : 'Unknown';

  const accessibilityStatusLabel = sttReadiness
    ? sttReadiness.accessibilityGranted === true
      ? 'Granted'
      : sttReadiness.accessibilityGranted === false
        ? 'Not granted'
        : 'Not applicable on this platform'
    : 'Unknown';

  const loadSttReadiness = async () => {
    try {
      const status = await window.api.getSttReadiness();
      setSttReadiness(status);
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to check STT readiness';
      setFeedback({ type: 'error', message: errorMsg });
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const stored = await window.api.getMachineSettings();
      setSettings({ ...DEFAULT_MACHINE_SETTINGS, ...stored });
      await loadSttReadiness();
      setFeedback(null);
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to load settings';
      setFeedback({ type: 'error', message: errorMsg });
      void window.api.addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const handleRequestMicrophonePermission = async () => {
    try {
      const result: PermissionActionResult = await window.api.requestMicrophonePermission();
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
      await loadSttReadiness();
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to request microphone permission';
      setFeedback({ type: 'error', message: errorMsg });
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  const handleOpenMicrophonePrivacySettings = async () => {
    try {
      const result = await window.api.openMicrophonePrivacySettings();
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to open microphone privacy settings';
      setFeedback({ type: 'error', message: errorMsg });
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  const handleMicrophoneToggle = async (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (!sttReadiness || sttReadiness.platform !== 'darwin') return;

    if (checked) {
      await handleRequestMicrophonePermission();
      return;
    }

    await handleOpenMicrophonePrivacySettings();
    setFeedback({
      type: 'success',
      message:
        'To disable microphone access, turn off this app in System Settings > Privacy & Security > Microphone.',
    });
  };

  const handleAccessibilityToggle = async (_event: React.ChangeEvent<HTMLInputElement>) => {
    if (!sttReadiness || sttReadiness.platform !== 'darwin') return;

    try {
      const result = await window.api.openAccessibilitySettings();
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });

      if (result.success) {
        let attempts = 0;
        const maxAttempts = 30;
        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const status = await window.api.getSttReadiness();
            setSttReadiness(status);
            if (status.accessibilityGranted === true || attempts >= maxAttempts) {
              clearInterval(pollInterval);
            }
          } catch {
            clearInterval(pollInterval);
          }
        }, 1000);
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to open accessibility settings';
      setFeedback({ type: 'error', message: errorMsg });
      void window.api.addNotification(errorMsg, 'error');
    }
  };

  const handleAutoPasteToggle = async (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const next = { ...settings, autoPasteEnabled: checked };
    setSettings(next);
    try {
      setSaving(true);
      const result = await window.api.updateMachineSettings(next);
      setSettings(result.settings);
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    } catch (error) {
      const errorMsg = (error as Error).message || 'Failed to save settings';
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
          Permissions & Accessibility
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Manage macOS system permissions required for speech-to-text and auto-paste functionality.
        </Typography>

        {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            System Permissions
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            If permissions were skipped or denied during installation, use these toggles to enable
            them now.
          </Typography>

          <Stack spacing={0.5} sx={{ mb: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={sttReadiness?.microphonePermission === 'granted'}
                  onChange={(event, checked) => void handleMicrophoneToggle(event, checked)}
                  disabled={loading || saving || sttReadiness?.platform !== 'darwin'}
                />
              }
              label={`Microphone access (${microphoneStatusLabel})`}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={sttReadiness?.accessibilityGranted === true}
                  onChange={(event) => void handleAccessibilityToggle(event)}
                  disabled={loading || saving || sttReadiness?.platform !== 'darwin'}
                />
              }
              label={`Accessibility access (${accessibilityStatusLabel})`}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              These toggles reflect macOS system permissions. Turning OFF opens System Settings for
              opt-out.
            </Typography>
          </Stack>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Paste Behavior
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={settings.autoPasteEnabled}
                onChange={(event, checked) => void handleAutoPasteToggle(event, checked)}
                disabled={loading || saving}
              />
            }
            label="Auto-paste into focused app"
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            When enabled, transcribed text is automatically pasted into the focused text field
            (requires Accessibility permission). When disabled, text is only copied to the
            clipboard.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
