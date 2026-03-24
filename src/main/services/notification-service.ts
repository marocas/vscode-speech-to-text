import Store from 'electron-store';
import { APP_STORE_CWD } from '../../shared/constants';
import type { Notification } from '../../shared/types';
const NOTIFICATION_EXPIRY_DAYS = 3;

interface StoredNotification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  isRead: boolean;
  createdAt: number; // timestamp
  expiresAt: number; // timestamp
}

export class NotificationService {
  private store: Store<{ notifications: StoredNotification[] }>;

  constructor() {
    this.store = new Store<{ notifications: StoredNotification[] }>({
      name: 'notifications',
      cwd: APP_STORE_CWD,
      defaults: { notifications: [] },
    });
  }

  private getExpiryTime(): number {
    return Date.now() + NOTIFICATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  }

  private cleanupExpiredNotifications(): void {
    const notifications = this.store.get('notifications', []);
    const now = Date.now();
    const filtered = notifications.filter((n) => n.expiresAt > now);

    if (filtered.length !== notifications.length) {
      this.store.set('notifications', filtered);
    }
  }

  addNotification(
    message: string,
    type: 'error' | 'warning' | 'info' | 'success' = 'error'
  ): Notification {
    this.cleanupExpiredNotifications();

    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const now = Date.now();

    const notification: StoredNotification = {
      id,
      message,
      type,
      isRead: false,
      createdAt: now,
      expiresAt: this.getExpiryTime(),
    };

    const notifications = this.store.get('notifications', []);
    notifications.push(notification);
    this.store.set('notifications', notifications);

    return this.toNotification(notification);
  }

  getNotifications(): Notification[] {
    this.cleanupExpiredNotifications();
    const notifications = this.store.get('notifications', []);
    return notifications.map((n) => this.toNotification(n));
  }

  getUnreadCount(): number {
    this.cleanupExpiredNotifications();
    const notifications = this.store.get('notifications', []);
    return notifications.filter((n) => !n.isRead).length;
  }

  markAsRead(notificationId: string): Notification | null {
    const notifications = this.store.get('notifications', []);
    const index = notifications.findIndex((n) => n.id === notificationId);

    if (index === -1) {
      return null;
    }

    notifications[index].isRead = true;
    this.store.set('notifications', notifications);
    return this.toNotification(notifications[index]);
  }

  deleteNotification(notificationId: string): boolean {
    const notifications = this.store.get('notifications', []);
    const filtered = notifications.filter((n) => n.id !== notificationId);

    if (filtered.length === notifications.length) {
      return false;
    }

    this.store.set('notifications', filtered);
    return true;
  }

  clearAllNotifications(): number {
    const count = this.store.get('notifications', []).length;
    this.store.set('notifications', []);
    return count;
  }

  private toNotification(stored: StoredNotification): Notification {
    return {
      id: stored.id,
      message: stored.message,
      type: stored.type,
      isRead: stored.isRead,
      createdAt: new Date(stored.createdAt),
      expiresAt: new Date(stored.expiresAt),
    };
  }
}
