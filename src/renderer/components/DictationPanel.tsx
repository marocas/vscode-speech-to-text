import { playStartBell } from '@/utils/audio';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { SUPPORTED_LANGUAGES } from '@shared/constants';
import React from 'react';

export const DictationButton: React.FC<{
  onStart: () => void;
  onStop: () => void;
  isRecording: boolean;
  isProcessing?: boolean;
}> = ({ onStart, onStop, isRecording, isProcessing = false }) => {
  const getButtonState = () => {
    if (isProcessing) {
      return {
        icon: (
          <HourglassTopIcon
            sx={{
              fontSize: 22,
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        ),
        color: 'warning' as const,
        bgColor: 'rgba(255, 152, 0, 0.1)',
      };
    }

    if (isRecording) {
      return {
        icon: <StopIcon sx={{ fontSize: 22 }} />,
        color: 'error' as const,
        bgColor: 'rgba(229, 57, 53, 0.1)',
        pulse: true,
      };
    }

    return {
      icon: <MicIcon sx={{ fontSize: 22 }} />,
      color: 'primary' as const,
      bgColor: 'transparent',
      pulse: false,
    };
  };

  const handleClick = () => {
    if (isRecording && !isProcessing) {
      onStop();
      return;
    }
    playStartBell();
    setTimeout(() => onStart(), 150);
  };

  const state = getButtonState();

  return (
    <IconButton
      onClick={handleClick}
      disabled={isProcessing}
      color={state.color}
      aria-label={
        isProcessing ? 'Processing dictation' : isRecording ? 'Stop dictation' : 'Start dictation'
      }
      sx={{
        width: 42,
        height: 42,
        bgcolor: state.bgColor,
        ...(state.pulse && {
          animation: 'pulse-ring 1.4s ease-in-out infinite',
          '@keyframes pulse-ring': {
            '0%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0.4)' },
            '70%': { boxShadow: '0 0 0 10px rgba(229, 57, 53, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0)' },
          },
        }),
      }}
    >
      {state.icon}
    </IconButton>
  );
};

export const LanguageSelector: React.FC<{
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  label?: string;
}> = ({ currentLanguage, onLanguageChange, label = 'Language' }) => {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        label={label}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
