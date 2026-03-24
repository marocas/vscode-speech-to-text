import { createTheme, CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { BubbleApp } from './components/BubbleApp';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

export type ColorModePref = 'light' | 'dark' | 'system';

// ── Colour-mode context ────────────────────────────────────────────────────────
export const ColorModeContext = createContext<{
  toggleColorMode: () => void;
  modePref: ColorModePref;
}>({ toggleColorMode: () => {}, modePref: 'system' });
export const useColorMode = () => useContext(ColorModeContext);

// ── Theme factory ──────────────────────────────────────────────────────────────
function buildTheme(mode: PaletteMode) {
  const light = mode === 'light';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#059669',
        light: '#34D399',
        dark: '#047857',
        contrastText: '#fff',
      },
      secondary: {
        main: '#F59E0B',
        light: '#FCD34D',
        dark: '#D97706',
      },
      background: {
        default: light ? '#EEF4F1' : '#111827',
        paper: light ? '#FFFFFF' : '#1F2937',
      },
      text: {
        primary: light ? '#0F1F17' : '#E2E8F0',
        secondary: light ? '#4B6358' : '#94A3B8',
      },
      divider: light ? '#D4E5DC' : '#374151',
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          containedPrimary: ({ theme }) => ({
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            },
          }),
          outlined: ({ theme }) => ({
            borderColor: theme.palette.divider,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: `${theme.palette.primary.main}0A`,
            },
          }),
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: light ? '#FAFAFA' : theme.palette.background.paper,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          rounded: { borderRadius: 12 },
          elevation1: {
            boxShadow: light
              ? '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)'
              : '0 1px 4px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)',
          },
          elevation4: {
            boxShadow: light ? '0 8px 40px rgba(0,0,0,0.12)' : '0 8px 40px rgba(0,0,0,0.5)',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            minHeight: 40,
            padding: '8px 16px',
            '&.Mui-selected': { fontWeight: 700 },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: ({ theme }) => ({
            height: 3,
            borderRadius: '3px 3px 0 0',
            background: `linear-gradient(0deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 6, fontSize: '0.75rem', height: 24 },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { borderRadius: 6, fontSize: '0.75rem' },
        },
      },
    },
  });
}

function getSystemMode(): PaletteMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ── Root wrapper ───────────────────────────────────────────────────────────────
function AppWithTheme() {
  const stored = (localStorage.getItem('colorMode') as ColorModePref | null) ?? 'system';
  const [modePref, setModePref] = useState<ColorModePref>(stored);
  const [systemMode, setSystemMode] = useState<PaletteMode>(getSystemMode);

  // Listen for OS-level changes when in system mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemMode(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedMode: PaletteMode = modePref === 'system' ? systemMode : modePref;

  const colorMode = useMemo(
    () => ({
      modePref,
      toggleColorMode: () =>
        setModePref((prev) => {
          const next: ColorModePref =
            prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light';
          localStorage.setItem('colorMode', next);
          return next;
        }),
    }),
    [modePref]
  );

  const theme = useMemo(() => buildTheme(resolvedMode), [resolvedMode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const isBubble = window.location.hash === '#bubble';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isBubble ? <BubbleApp /> : <AppWithTheme />}</React.StrictMode>
);
