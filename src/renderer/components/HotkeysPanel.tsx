import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { DEFAULT_MACHINE_SETTINGS } from '@shared/constants';
import type { AppMachineSettings } from '@shared/types';
import React, { useEffect, useState } from 'react';

export const HotkeysPanel: React.FC = () => {
  const [settings, setSettings] = useState<AppMachineSettings>(DEFAULT_MACHINE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [capturingHotkey, setCapturingHotkey] = useState(false);
  const hotkeyInputRef = React.useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const normalizeKeyForAccelerator = (key: string): string | null => {
    const trimmed = key.trim();
    if (!trimmed) {
      return null;
    }

    const lowered = trimmed.toLowerCase();

    // Ignore modifier-only key presses; wait for a non-modifier main key.
    if (
      lowered === 'control' ||
      lowered === 'ctrl' ||
      lowered === 'shift' ||
      lowered === 'alt' ||
      lowered === 'option' ||
      lowered === 'meta' ||
      lowered === 'command' ||
      lowered === 'cmd' ||
      lowered === 'os'
    ) {
      return null;
    }

    if (lowered === ' ') {
      return 'space';
    }

    return lowered;
  };

  const normalizeCodeForAccelerator = (_code: string): string | null => {
    // Prefer `event.key`; `event.code` can produce physical key names like `metaleft`.
    return null;
  };

  const buildAcceleratorFromEvent = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): string | null => {
    const modifiers: string[] = [];
    if (event.ctrlKey || event.metaKey) {
      modifiers.push('commandorcontrol');
    }
    if (event.shiftKey) {
      modifiers.push('shift');
    }
    if (event.altKey) {
      modifiers.push('alt');
    }

    // Build using logical key names; do not use physical key codes as main key names.
    let mainKey = normalizeCodeForAccelerator(event.code);
    if (!mainKey) {
      mainKey = normalizeKeyForAccelerator(event.key);
    }
    if (!mainKey) {
      return null;
    }

    return [...modifiers, mainKey].join('+');
  };

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

  useEffect(() => {
    if (capturingHotkey) {
      hotkeyInputRef.current?.focus();
    }
  }, [capturingHotkey]);

  const updateField = (key: keyof AppMachineSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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

  const handleHotkeyCapture = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!capturingHotkey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.key === 'Escape') {
      setCapturingHotkey(false);
      setFeedback({
        type: 'success',
        message: 'Hotkey capture canceled.',
      });
      return;
    }

    const nextHotkey = buildAcceleratorFromEvent(event);
    if (!nextHotkey) {
      // Ignore modifier-only presses while capturing.
      return;
    }

    updateField('globalDictationHotkey', nextHotkey);
    setCapturingHotkey(false);
    setFeedback({
      type: 'success',
      message: `Captured hotkey: ${nextHotkey}`,
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Hotkey Settings
        </Typography>

        {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Global Dictation Hotkey
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Set a keyboard shortcut to start/stop dictation
          </Typography>

          <TextField
            label="Hotkey"
            value={settings.globalDictationHotkey}
            onChange={(event) => updateField('globalDictationHotkey', event.target.value)}
            onKeyDown={handleHotkeyCapture}
            helperText={
              capturingHotkey
                ? 'Press any key combination (Esc to cancel). Use any key on your keyboard.'
                : 'Hold this hotkey to record, release to stop. Click "Record Hotkey" to detect keys automatically. Examples: ctrl+d, cmd+shift+d, fn, fn+d, space, etc.'
            }
            disabled={loading || saving}
            InputProps={{ readOnly: false }}
            inputRef={hotkeyInputRef}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant={capturingHotkey ? 'contained' : 'outlined'}
              color={capturingHotkey ? 'warning' : 'primary'}
              onClick={() => {
                setCapturingHotkey((previous) => !previous);
                setFeedback(null);
              }}
              disabled={loading || saving}
              size="small"
            >
              {capturingHotkey ? 'Capturing...' : 'Record Hotkey'}
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() =>
                updateField('globalDictationHotkey', DEFAULT_MACHINE_SETTINGS.globalDictationHotkey)
              }
              disabled={loading || saving}
            >
              Use Default Hotkey
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
