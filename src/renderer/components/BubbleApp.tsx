import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

type BubbleState = 'idle' | 'recording' | 'processing';

const stateStyles: Record<BubbleState, { bg: string; shadow: string; animate?: boolean }> = {
  idle: {
    bg: 'rgba(30, 30, 30, 0.85)',
    shadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  recording: {
    bg: 'rgba(229, 57, 53, 0.92)',
    shadow: '0 0 0 0 rgba(229, 57, 53, 0.5)',
    animate: true,
  },
  processing: {
    bg: 'rgba(255, 152, 0, 0.92)',
    shadow: '0 2px 12px rgba(255, 152, 0, 0.4)',
  },
};

export const BubbleApp: React.FC = () => {
  const [state, setState] = useState<BubbleState>('idle');

  useEffect(() => {
    const api = (window as unknown as Record<string, unknown>).bubbleAPI as
      | { onStateChange: (cb: (s: string) => void) => void }
      | undefined;

    if (api) {
      api.onStateChange((s) => setState(s as BubbleState));
    }
  }, []);

  const style = stateStyles[state];

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        WebkitAppRegion: 'drag',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '2px solid rgba(180, 180, 180, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: style.bg,
          boxShadow: style.shadow,
          transition: 'background 0.25s ease, box-shadow 0.25s ease',
          ...(style.animate && {
            animation: 'pulse 1.4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0.5)' },
              '70%': { boxShadow: '0 0 0 14px rgba(229, 57, 53, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(229, 57, 53, 0)' },
            },
          }),
        }}
      >
        {state === 'idle' && <MicIcon sx={{ fontSize: 24, color: '#fff' }} />}
        {state === 'recording' && <StopIcon sx={{ fontSize: 24, color: '#fff' }} />}
        {state === 'processing' && (
          <HourglassTopIcon
            sx={{
              fontSize: 24,
              color: '#fff',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' },
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};
