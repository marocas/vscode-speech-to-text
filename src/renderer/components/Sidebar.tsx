import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import DictationIcon from '@mui/icons-material/Mic';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { AuthUser } from '@shared/types';
import React, { useState } from 'react';

interface SidebarProps {
  currentPage: 'dictation' | 'settings' | 'help';
  onPageChange: (page: 'dictation' | 'settings' | 'help') => void;
  currentUser: AuthUser | null;
  onChangePassword: () => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  currentUser,
  onChangePassword,
  onLogout,
  collapsed,
  onToggleCollapsed,
}) => {
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [confirmChangePasswordOpen, setConfirmChangePasswordOpen] = useState(false);

  const handleAccountMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(e.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleLogout = () => {
    handleAccountMenuClose();
    onLogout();
  };

  const handleOpenSettings = () => {
    handleAccountMenuClose();
    onPageChange('settings');
  };

  const handleChangePassword = () => {
    handleAccountMenuClose();
    setConfirmChangePasswordOpen(true);
  };

  const handleCancelChangePassword = () => {
    setConfirmChangePasswordOpen(false);
  };

  const handleConfirmChangePassword = () => {
    setConfirmChangePasswordOpen(false);
    onChangePassword();
  };

  const isAccountMenuOpen = Boolean(accountMenuAnchor);

  const theme = useTheme();

  const navItems = [
    { id: 'dictation', icon: <DictationIcon />, label: 'Dictation', tooltip: 'Dictation' },
    { id: 'settings', icon: <SettingsIcon />, label: 'Settings', tooltip: 'Settings' },
  ];

  const sidebarWidth = collapsed ? 72 : 220;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        py: 1.5,
        gap: 0.5,
        transition:
          'width 0.22s cubic-bezier(0.4,0,0.2,1), min-width 0.22s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}
    >
      {/* Navigation Items */}
      <Stack
        spacing={0.25}
        sx={{ alignItems: collapsed ? 'center' : 'stretch', px: collapsed ? 0 : 1 }}
      >
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const btn = (
            <Box
              key={item.id}
              onClick={() => onPageChange(item.id as 'dictation' | 'settings' | 'help')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: collapsed ? 0 : 1.5,
                py: 1,
                borderRadius: '10px',
                height: 44,
                width: collapsed ? 44 : '100%',
                cursor: 'pointer',
                justifyContent: 'center',
                color: isActive ? 'primary.main' : 'text.secondary',
                backgroundColor: isActive
                  ? theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.07)'
                    : 'rgba(0,0,0,0.06)'
                  : 'transparent',
                transition: 'all 0.12s',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  color: isActive ? 'primary.main' : 'text.primary',
                },
                '& svg': { fontSize: '20px', flexShrink: 0 },
              }}
            >
              {item.icon}
              {!collapsed && (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    textAlign: 'left',
                  }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          );
          return collapsed ? (
            <Tooltip key={item.id} title={item.tooltip} placement="right" arrow>
              {btn}
            </Tooltip>
          ) : (
            btn
          );
        })}
      </Stack>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Bottom Icons */}
      <Stack
        spacing={0.25}
        sx={{ alignItems: collapsed ? 'center' : 'stretch', px: collapsed ? 0 : 1, width: '100%' }}
      >
        <Divider sx={{ mb: 0.25 }} />

        {/* Help */}
        {collapsed ? (
          <Tooltip title="Help" placement="right" arrow>
            <IconButton
              onClick={() => onPageChange('help')}
              sx={{
                color: currentPage === 'help' ? 'primary.main' : 'text.secondary',
                borderRadius: '10px',
                width: 44,
                height: 44,
                mx: 'auto',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  color: currentPage === 'help' ? 'primary.main' : 'text.primary',
                },
                '& svg': { fontSize: '20px' },
              }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Box
            onClick={() => onPageChange('help')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1,
              borderRadius: '10px',
              height: 44,
              cursor: 'pointer',
              color: currentPage === 'help' ? 'primary.main' : 'text.secondary',
              backgroundColor:
                currentPage === 'help'
                  ? theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.07)'
                    : 'rgba(0,0,0,0.06)'
                  : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: currentPage === 'help' ? 'primary.main' : 'text.primary',
              },
              '& svg': { fontSize: '20px', flexShrink: 0 },
            }}
          >
            <HelpIcon />
            <Typography
              variant="body2"
              sx={{ fontWeight: currentPage === 'help' ? 600 : 500, fontSize: '0.875rem' }}
            >
              Help
            </Typography>
          </Box>
        )}

        {/* Account Menu */}
        {collapsed ? (
          <Tooltip title={currentUser?.username || 'Account'} placement="right" arrow>
            <IconButton
              onClick={handleAccountMenuOpen}
              sx={{
                color: 'text.secondary',
                borderRadius: '10px',
                width: 44,
                height: 44,
                mx: 'auto',
                '&:hover': { backgroundColor: theme.palette.action.hover, color: 'text.primary' },
                '& svg': { fontSize: '20px' },
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Box
            onClick={handleAccountMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1,
              borderRadius: '10px',
              height: 44,
              cursor: 'pointer',
              color: 'text.secondary',
              '&:hover': { backgroundColor: theme.palette.action.hover, color: 'text.primary' },
              '& svg': { fontSize: '20px', flexShrink: 0 },
            }}
          >
            <AccountCircleIcon />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentUser?.username ?? 'Account'}
            </Typography>
          </Box>
        )}

        {/* Account Menu Popover */}
        <Popover
          open={isAccountMenuOpen}
          anchorEl={accountMenuAnchor}
          onClose={handleAccountMenuClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 260,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                borderRadius: '14px',
                overflow: 'hidden',
                p: 0,
              },
            },
          }}
        >
          {/* User Info Header */}
          <Box
            sx={{
              px: 2,
              py: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'rgba(255,255,255,0.25)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {currentUser?.username?.charAt(0).toUpperCase() ?? '?'}
              </Avatar>
              <Stack spacing={0.25}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}
                >
                  {currentUser?.username}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.2 }}
                >
                  {currentUser?.email}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ p: 1 }}>
            {/* Menu Items */}
            <MenuItem
              onClick={handleOpenSettings}
              sx={{ borderRadius: 1.5, fontSize: '0.9rem', py: 1, color: 'text.primary' }}
            >
              <SettingsIcon sx={{ mr: 1.5, fontSize: '18px', color: 'text.secondary' }} />
              Settings
            </MenuItem>
            <MenuItem
              onClick={handleChangePassword}
              sx={{ borderRadius: 1.5, fontSize: '0.9rem', py: 1, color: 'text.primary' }}
            >
              <LockResetIcon sx={{ mr: 1.5, fontSize: '18px', color: 'text.secondary' }} />
              Change Password
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {/* Logout */}
            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: 1.5,
                fontSize: '0.9rem',
                py: 1,
                color: 'error.main',
                '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' },
              }}
            >
              <LogoutIcon sx={{ mr: 1.5, fontSize: '18px' }} />
              Logout
            </MenuItem>
          </Box>
        </Popover>

        <Dialog
          open={confirmChangePasswordOpen}
          onClose={handleCancelChangePassword}
          aria-labelledby="confirm-change-password-title"
        >
          <DialogTitle id="confirm-change-password-title">Change Password</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              To change your password, you will be signed out and taken to the Change Password
              screen.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelChangePassword}>Cancel</Button>
            <Button onClick={handleConfirmChangePassword} variant="contained">
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};
