import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MicIcon from '@mui/icons-material/Mic';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { Box, Fade, IconButton, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { AuthUser } from '@shared/types';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { DictationButton } from './components/DictationPanel';
import { LoginPanel } from './components/LoginPanel';
import { NotificationBadge } from './components/NotificationPanel';
import { Sidebar } from './components/Sidebar';
import { useColorMode } from './main';
import { DictationPage } from './pages/DictationPage';
import { HelpPage } from './pages/HelpPage';
import { SettingsPage } from './pages/SettingsPage';

type Page = 'dictation' | 'settings' | 'help';

export const App: React.FC = () => {
  const { toggleColorMode, modePref } = useColorMode();
  const theme = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const colorModeTooltip =
    modePref === 'light'
      ? 'Light mode — click for dark'
      : modePref === 'dark'
        ? 'Dark mode — click for system'
        : 'System preference — click for light';

  const ColorModeIcon =
    modePref === 'light'
      ? LightModeIcon
      : modePref === 'dark'
        ? DarkModeIcon
        : SettingsBrightnessIcon;
  const [currentPage, setCurrentPage] = useState<Page>('dictation');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'change'>('login');
  const [restoringSession, setRestoringSession] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hotkeyLabel, setHotkeyLabel] = useState('Loading...');
  const [dictationCommand, setDictationCommand] = useState<{
    action: 'start' | 'stop';
    nonce: number;
  } | null>(null);

  useEffect(() => {
    const restoreUserSession = async () => {
      try {
        const user = await window.api.getCurrentUser();
        setCurrentUser(user ?? null);
      } catch {
        setCurrentUser(null);
      } finally {
        setRestoringSession(false);
      }
    };

    void restoreUserSession();
  }, []);

  useEffect(() => {
    const loadHotkey = async () => {
      try {
        const settings = await window.api.getMachineSettings();
        if (settings.globalDictationHotkey) {
          setHotkeyLabel(settings.globalDictationHotkey);
        }
      } catch {
        setHotkeyLabel('Unavailable');
      }
    };

    void loadHotkey();
  }, []);

  useEffect(() => {
    const cleanup = window.api.onNavigate((page: string) => {
      if (page === 'settings' || page === 'dictation' || page === 'help') {
        setCurrentPage(page);
      }
    });
    return cleanup;
  }, []);

  const handleLogout = async () => {
    await window.api.logoutUser();
    setCurrentUser(null);
    setCurrentPage('dictation');
    setAuthMode('login');
  };

  const handleOpenChangePassword = async () => {
    await window.api.logoutUser();
    setCurrentUser(null);
    setCurrentPage('dictation');
    setAuthMode('change');
  };

  const handleGlobalDictationStart = () => {
    setDictationCommand({ action: 'start', nonce: Date.now() });
  };

  const handleGlobalDictationStop = () => {
    setDictationCommand({ action: 'stop', nonce: Date.now() });
  };

  if (restoringSession) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #111827 0%, #1F2937 100%)'
              : 'linear-gradient(135deg, #D1FAE5 0%, #EEF4F1 100%)',
          color: 'text.primary',
          fontSize: '1rem',
        }}
      >
        Restoring session...
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #111827 0%, #1F2937 100%)'
              : 'linear-gradient(135deg, #D1FAE5 0%, #EEF4F1 50%, #F0FDF4 100%)',
        }}
      >
        <LoginPanel
          initialMode={authMode}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setAuthMode('login');
          }}
        />
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          newestOnTop
          pauseOnFocusLoss={false}
          theme={theme.palette.mode}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header — full width */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
          px: 2,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Logo mark */}
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              flexShrink: 0,
              background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MicIcon sx={{ fontSize: 17, color: '#fff' }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '-0.01em',
              ...(theme.palette.mode === 'dark'
                ? {
                    background: 'linear-gradient(90deg, #34D399 0%, #6EE7B7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }
                : { color: 'primary.dark' }),
            }}
          >
            STD
          </Typography>
          {/* Sidebar toggle */}
          <Tooltip title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} arrow>
            <IconButton
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              sx={{
                color: 'text.secondary',
                width: 36,
                height: 36,
                '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="2"
                  width="16"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <line x1="6" y1="2" x2="6" y2="16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip
            title={hotkeyLabel === 'Loading...' ? 'Loading hotkey...' : `Hotkey: ${hotkeyLabel}`}
            arrow
          >
            <Box sx={{ display: 'flex' }}>
              <DictationButton
                onStart={handleGlobalDictationStart}
                onStop={handleGlobalDictationStop}
                isRecording={isRecording}
                isProcessing={isProcessing}
              />
            </Box>
          </Tooltip>
          <NotificationBadge />
          <Tooltip title={colorModeTooltip} arrow>
            <IconButton
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
              sx={{
                color: 'text.secondary',
                width: 42,
                height: 42,
                '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
              }}
            >
              <ColorModeIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Body: sidebar + content side-by-side, below header */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar Navigation */}
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          currentUser={currentUser}
          onChangePassword={handleOpenChangePassword}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
        />

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: 'calc(100vh - 67px)',
          }}
        >
          <Box
            sx={{
              py: 4,
              px: { xs: 2, sm: 3 },
              overflowY: 'auto',
              flex: 1,
            }}
          >
            <Box sx={{ display: currentPage === 'dictation' ? 'block' : 'none' }}>
              <Fade in={currentPage === 'dictation'} timeout={220}>
                <div>
                  <DictationPage
                    externalCommand={dictationCommand}
                    onRecordingStateChange={setIsRecording}
                    onProcessingStateChange={setIsProcessing}
                  />
                </div>
              </Fade>
            </Box>
            <Box sx={{ display: currentPage === 'settings' ? 'block' : 'none' }}>
              <Fade in={currentPage === 'settings'} timeout={220}>
                <div>
                  <Box sx={{ maxWidth: 860, mx: 'auto' }}>
                    <SettingsPage />
                  </Box>
                </div>
              </Fade>
            </Box>
            <Box sx={{ display: currentPage === 'help' ? 'block' : 'none' }}>
              <Fade in={currentPage === 'help'} timeout={220}>
                <div>
                  <Box sx={{ maxWidth: 860, mx: 'auto' }}>
                    <HelpPage />
                  </Box>
                </div>
              </Fade>
            </Box>
          </Box>
        </Box>
      </Box>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        newestOnTop
        pauseOnFocusLoss={false}
        theme={theme.palette.mode}
      />
    </Box>
  );
};

export default App;
