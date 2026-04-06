import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { DEFAULT_MACHINE_SETTINGS } from '@shared/constants';
import type { AppMachineSettings } from '@shared/types';
import React, { useCallback, useEffect, useState } from 'react';

type PermissionState = {
  microphone: 'unknown' | 'granted' | 'denied' | 'not-determined' | 'restricted';
  accessibility: boolean | null;
};

export const PermissionsPanel: React.FC = () => {
  const [settings, setSettings] = useState<AppMachineSettings>(DEFAULT_MACHINE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState<PermissionState>({
    microphone: 'unknown',
    accessibility: null,
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const refreshPermissions = useCallback(async () => {
    try {
      const status = await window.api.getSttReadiness();
      setPermissions({
        microphone: status.microphonePermission,
        accessibility: status.accessibilityGranted,
      });
    } catch {
      // Silently fail — permissions will show as unknown
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const stored = await window.api.getMachineSettings();
        setSettings({ ...DEFAULT_MACHINE_SETTINGS, ...stored });
        await refreshPermissions();
      } catch (error) {
        setFeedback({ type: 'error', message: (error as Error).message });
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, [refreshPermissions]);

  // Poll permissions every 2s so the UI updates after the user toggles them in System Settings
  useEffect(() => {
    const interval = setInterval(() => void refreshPermissions(), 2000);
    return () => clearInterval(interval);
  }, [refreshPermissions]);

  const handleRequestMicrophone = async () => {
    try {
      const result = await window.api.requestMicrophonePermission();
      setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
      await refreshPermissions();
    } catch (error) {
      setFeedback({ type: 'error', message: (error as Error).message });
    }
  };

  const handleOpenMicrophoneSettings = async () => {
    try {
      await window.api.openMicrophonePrivacySettings();
    } catch {
      // Best-effort
    }
  };

  const handleOpenAccessibilitySettings = async () => {
    try {
      await window.api.openAccessibilitySettings();
    } catch {
      // Best-effort
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
      setFeedback({ type: 'error', message: (error as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const micLabel =
    permissions.microphone === 'granted'
      ? 'Granted ✓'
      : permissions.microphone === 'not-determined'
        ? 'Not requested yet'
        : permissions.microphone === 'denied'
          ? 'Denied'
          : permissions.microphone === 'restricted'
            ? 'Restricted'
            : 'Unknown';

  const accLabel =
    permissions.accessibility === true
      ? 'Granted ✓'
      : permissions.accessibility === false
        ? 'Not granted'
        : 'N/A';

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
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Microphone — {micLabel}
          </Typography>
          {permissions.microphone !== 'granted' ? (
            <Stack direction="row" spacing={1}>
              {permissions.microphone === 'not-determined' && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => void handleRequestMicrophone()}
                  disabled={loading}
                >
                  Request Permission
                </Button>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => void handleOpenMicrophoneSettings()}
                disabled={loading}
              >
                Open System Settings
              </Button>
            </Stack>
          ) : (
            <Typography variant="caption" sx={{ color: 'success.main' }}>
              Microphone access is enabled. No action needed.
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Accessibility — {accLabel}
          </Typography>
          {permissions.accessibility !== true ? (
            <Stack spacing={1}>
              <Button
                variant="contained"
                size="small"
                onClick={() => void handleOpenAccessibilitySettings()}
                disabled={loading}
                sx={{ alignSelf: 'flex-start' }}
              >
                Open Accessibility Settings
              </Button>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Enable "Smart Transcription Daemon" in System Settings → Privacy & Security →
                Accessibility. The status updates automatically.
              </Typography>
            </Stack>
          ) : (
            <Typography variant="caption" sx={{ color: 'success.main' }}>
              Accessibility access is enabled. No action needed.
            </Typography>
          )}
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
