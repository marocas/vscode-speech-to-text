import MicIcon from '@mui/icons-material/Mic';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import type { AuthUser, LoginResult } from '@shared/types';
import React, { useEffect, useState } from 'react';

interface LoginPanelProps {
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'register' | 'change';
}

export const LoginPanel: React.FC<LoginPanelProps> = ({
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'change'>(initialMode);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (
    field: 'password' | 'currentPassword' | 'newPassword' | 'confirmPassword'
  ) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccessMessage(null);
  }, [initialMode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      if (mode === 'change') {
        if (newPassword.length < 8) {
          setError('New password must have at least 8 characters.');
          return;
        }

        if (newPassword !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }

        const changeResult = await window.api.changePassword(
          username,
          currentPassword,
          newPassword
        );
        if (changeResult.success) {
          setSuccessMessage(changeResult.message);
          setMode('login');
          setPassword('');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          return;
        }

        setError(changeResult.message || 'Password change failed.');
        void window.api.addNotification(changeResult.message || 'Password change failed.', 'error');
        return;
      }

      if (mode === 'register' && password.length < 8) {
        setError('Password must have at least 8 characters.');
        return;
      }

      const result: LoginResult =
        mode === 'login'
          ? await window.api.authenticateUser(username, password)
          : await window.api.registerUser(email, username, password);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
        return;
      }

      setError(result.message || 'Login failed.');
      void window.api.addNotification(result.message || 'Login failed.', 'error');
    } catch (err) {
      const errorMsg = (err as Error).message || 'Login failed.';
      setError(errorMsg);
      void window.api.addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 3, sm: 4 },
        width: '100%',
        maxWidth: 420,
        borderRadius: 4,
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}
      elevation={0}
    >
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        {/* Header */}
        <Stack alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #0F62D2 0%, #38B6FF 100%)',
              boxShadow: '0 4px 14px rgba(15,98,210,0.4)',
            }}
          >
            <MicIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            {mode === 'login'
              ? 'Sign In'
              : mode === 'register'
                ? 'Create Account'
                : 'Change Password'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Smart Transcription Daemon
          </Typography>
        </Stack>

        {/* Mode switcher */}
        <Box
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, val) => {
              if (val) {
                setMode(val);
                setError(null);
                setSuccessMessage(null);
              }
            }}
            fullWidth
            size="small"
            sx={{
              display: 'flex',
              '& .MuiToggleButton-root': {
                flex: 1,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.8rem',
                py: 0.875,
                border: 'none',
                borderRadius: 0,
                whiteSpace: 'nowrap',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'primary.dark' },
                },
                '&:not(:last-of-type)': {
                  borderRight: '1px solid',
                  borderColor: 'divider',
                },
              },
            }}
          >
            <ToggleButton value="login">Sign In</ToggleButton>
            <ToggleButton value="register">Create Account</ToggleButton>
            <ToggleButton value="change">Reset</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Fields */}
        <Stack spacing={2}>
          {mode === 'register' && (
            <TextField
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              fullWidth
              disabled={loading}
              size="small"
            />
          )}

          <TextField
            label={mode === 'login' || mode === 'change' ? 'Email or Username' : 'Username'}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete={mode === 'login' ? 'username' : 'nickname'}
            autoFocus
            fullWidth
            disabled={loading}
            size="small"
          />

          {(mode === 'login' || mode === 'register') && (
            <TextField
              label="Password"
              type={visiblePasswords.password ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              fullWidth
              disabled={loading}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => togglePasswordVisibility('password')}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                      size="small"
                    >
                      {visiblePasswords.password ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {mode === 'change' && (
            <TextField
              label="Current Password"
              type={visiblePasswords.currentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              fullWidth
              disabled={loading}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={() => togglePasswordVisibility('currentPassword')}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                      size="small"
                    >
                      {visiblePasswords.currentPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {mode === 'change' && (
            <TextField
              label="New Password"
              type={visiblePasswords.newPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              fullWidth
              disabled={loading}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                      size="small"
                    >
                      {visiblePasswords.newPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {mode === 'change' && (
            <TextField
              label="Confirm New Password"
              type={visiblePasswords.confirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              fullWidth
              disabled={loading}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                      size="small"
                    >
                      {visiblePasswords.confirmPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            py: 1.25,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #0F62D2 0%, #38B6FF 100%)',
            boxShadow: '0 4px 14px rgba(15,98,210,0.35)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(15,98,210,0.45)',
            },
          }}
        >
          {loading
            ? 'Please wait…'
            : mode === 'login'
              ? 'Sign In'
              : mode === 'register'
                ? 'Create Account'
                : 'Change Password'}
        </Button>
      </Stack>
    </Paper>
  );
};
