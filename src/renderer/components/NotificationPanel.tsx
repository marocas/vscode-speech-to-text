import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import type { Notification } from '@shared/types';
import React, { useEffect, useState } from 'react';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  onNotificationsChange?: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  open,
  onClose,
  onNotificationsChange,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await window.api.getNotifications();
      if (result.success) {
        setNotifications(result.notifications);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      void loadNotifications();
    }
  }, [open]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const result = await window.api.markNotificationAsRead(notificationId);
      if (result.success) {
        await loadNotifications();
        onNotificationsChange?.();
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const result = await window.api.deleteNotification(notificationId);
      if (result.success) {
        await loadNotifications();
        onNotificationsChange?.();
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      const result = await window.api.clearAllNotifications();
      if (result.success) {
        await loadNotifications();
        onNotificationsChange?.();
      }
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return '#d32f2f';
      case 'warning':
        return '#f57c00';
      case 'info':
        return '#1976d2';
      case 'success':
        return '#388e3c';
      default:
        return '#666';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications ({notifications.length})
          </Typography>
          <IconButton onClick={onClose} size="small">
            ✕
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mb: 2,
          }}
        >
          {loading ? (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
              Loading...
            </Typography>
          ) : notifications.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
              No notifications
            </Typography>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                sx={{
                  p: 1.5,
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                  borderLeft: `4px solid ${getTypeColor(notification.type)}`,
                }}
              >
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={getTypeLabel(notification.type)}
                          size="small"
                          sx={{
                            bgcolor: getTypeColor(notification.type),
                            color: '#fff',
                            height: 20,
                            fontSize: '0.75rem',
                          }}
                        />
                        {!notification.isRead && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        )}
                      </Stack>
                      <Typography sx={{ mt: 0.5, fontSize: '0.95rem' }}>
                        {notification.message}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      {!notification.isRead && (
                        <Button
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(notification.id)}
                        sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            Clear All
          </Button>
          <Button variant="contained" size="small" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

interface NotificationBadgeProps {
  onNotificationsChange?: () => void;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ onNotificationsChange }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  const loadUnreadCount = async () => {
    try {
      const count = await window.api.getNotificationUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to get unread count:', error);
    }
  };

  useEffect(() => {
    void loadUnreadCount();
    const interval = setInterval(() => {
      void loadUnreadCount();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNotificationsChange = () => {
    void loadUnreadCount();
    onNotificationsChange?.();
  };

  return (
    <>
      <Badge
        badgeContent={unreadCount}
        color="error"
        max={9}
        sx={{
          '& .MuiBadge-badge': {
            fontSize: '0.65rem',
            height: 16,
            minWidth: 16,
            fontWeight: 700,
            ...(unreadCount > 0 && {
              animation: 'badge-pulse 2s ease-in-out infinite',
              '@keyframes badge-pulse': {
                '0%, 100%': { transform: 'scale(1) translate(50%, -50%)' },
                '50%': { transform: 'scale(1.2) translate(50%, -50%)' },
              },
            }),
          },
        }}
      >
        <IconButton
          size="small"
          onClick={() => setPanelOpen(true)}
          sx={{
            color: unreadCount > 0 ? 'primary.main' : 'text.secondary',
            width: 42,
            height: 42,
            '&:hover': {
              color: unreadCount > 0 ? 'primary.dark' : 'text.primary',
              bgcolor: 'action.hover',
            },
          }}
          title="Notifications"
        >
          <NotificationsActiveIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Badge>
      <NotificationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onNotificationsChange={handleNotificationsChange}
      />
    </>
  );
};
