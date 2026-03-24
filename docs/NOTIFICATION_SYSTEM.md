# Notification System - Complete Implementation Guide

## Overview

A comprehensive, persistent notification system for the Smart Transcription Daemon Electron app with 3-day expiry, mark-as-read functionality, and deletion capabilities.

## Architecture

### Backend (Main Process)

**Service**: `src/main/services/notification-service.ts`

- Handles persistence using `electron-store`
- Auto-cleanup of expired notifications (>3 days)
- Full CRUD operations

**Key Methods**:

```typescript
addNotification(message: string, type: 'error' | 'warning' | 'info' | 'success'): Notification
getNotifications(): Notification[]
getUnreadCount(): number
markAsRead(id: string): boolean
deleteNotification(id: string): boolean
clearAllNotifications(): number
```

### IPC Handlers (Main Process)

Registered in `src/main/main.ts`:

- `add-notification` → Creates and persists notification
- `get-notifications` → Returns all active notifications + unread count
- `get-notification-unread-count` → Returns unread count as number
- `mark-notification-as-read` → Toggles read flag
- `delete-notification` → Removes single notification
- `clear-all-notifications` → Clears all, returns count deleted

### Renderer API (Preload Bridge)

Exposed via `window.api` in `src/main/preload.ts`:

```typescript
window.api.addNotification(message: string, type?: 'error' | 'warning' | 'info' | 'success'): Promise<NotificationResult>
window.api.getNotifications(): Promise<NotificationsListResult>
window.api.getNotificationUnreadCount(): Promise<number>
window.api.markNotificationAsRead(id: string): Promise<NotificationResult>
window.api.deleteNotification(id: string): Promise<{success: boolean, message: string}>
window.api.clearAllNotifications(): Promise<{success: boolean, message: string}>
```

### UI Components

**NotificationBadge** (`src/renderer/components/NotificationPanel.tsx`)

- Bell icon with unread count badge
- Auto-refreshes every 5 seconds
- Integrated into AppBar header

**NotificationPanel** (`src/renderer/components/NotificationPanel.tsx`)

- Modal displaying all notifications
- Type badges (error=red, warning=orange, info=blue, success=green)
- Timestamps and relative time display
- Delete and Mark as Read buttons
- Clear All button
- Accessible via bell icon click

## Integration Points

### Error Handlers Updated

Notifications automatically created on errors in:

- **DictationPage.tsx**: transcription start/stop failures
- **LoginPanel.tsx**: authentication, password recovery, password change failures
- **LocalSettingsPanel.tsx**: settings loading/saving, model detection failures

## Usage

### Creating a Notification (from Renderer)

```typescript
// Error notification
await window.api.addNotification('Transcription failed: microphone not found', 'error');

// Warning notification
await window.api.addNotification('Whisper model not found, using fallback', 'warning');

// Info notification
await window.api.addNotification('Settings saved successfully', 'info');

// Success notification (optional, most successes use toast)
await window.api.addNotification('Operation completed', 'success');
```

### Creating a Notification (from Main Process)

```typescript
const notification = notificationService.addNotification('Dictation audio file corrupted', 'error');
// Notification persisted automatically
```

### Checking Unread Count (for badge)

```typescript
const count = await window.api.getNotificationUnreadCount();
// Use in UI to show badge number
```

### Retrieving All Notifications

```typescript
const result = await window.api.getNotifications();
// result.success: boolean
// result.notifications: Notification[]
// result.unreadCount: number
```

## Data Model

### Notification Interface

```typescript
interface Notification {
  id: string; // UUID, generated on creation
  message: string; // Error/warning/info text
  type: 'error' | 'warning' | 'info' | 'success';
  isRead: boolean; // Marked as read by user
  createdAt: number; // Timestamp in milliseconds
  expiresAt: number; // Timestamp: createdAt + 3 days
}
```

### Expiry Logic

- Notifications expire 3 days (259200000 ms = 72 hours) after creation
- Auto-cleanup occurs on every read\* operation (no background job needed)
- Expired notifications silently filtered from results

## Storage

Uses `electron-store` with key `notifications`:

```javascript
{
  "notifications": [
    {
      "id": "uuid1",
      "message": "Error message",
      "type": "error",
      "isRead": false,
      "createdAt": 1699564800000,
      "expiresAt": 1699737600000
    }
  ]
}
```

Stored in platform-specific app data directory:

- **macOS**: `~/Library/Application Support/Smart Transcription Daemon/`
- **Linux**: `~/.config/Smart Transcription Daemon/`
- **Windows**: `%APPDATA%\Smart Transcription Daemon\`

## Testing

### Quick Test in Dev Mode

1. Run `pnpm run dev`
2. Click bell icon in AppBar header
3. Create test notification:
   ```javascript
   window.api.addNotification('Test error message', 'error').then(console.log);
   ```
4. Verify:
   - Badge shows unread count
   - Notification appears in panel
   - Timestamps display correctly
   - Delete/Mark Read buttons work
   - Clear All clears all notifications

### Test Error Scenarios

- **Transcription Error**: Start recording and kill Whisper process → should see notification
- **Login Error**: Try logging in with wrong password → should see notification
- **Settings Error**: Try saving invalid settings → should see notification
- **Recovery Error**: Try password recovery with invalid credentials → should see notification

### Test Persistence

1. Create a notification
2. Close and reopen the app
3. Bell badge should still show unread count
4. Notification should be visible in panel

### Test Expiry

1. Create a notification
2. Check electron-store data with: `~/.../Smart Transcription Daemon/...`
3. Verify `expiresAt = createdAt + 259200000`
4. After 3 days, notification should auto-remove (next read operation)

## Files Modified

### New Files

- `src/renderer/components/NotificationPanel.tsx` (208 lines)
- `src/main/services/notification-service.ts` (107 lines)

### Modified Files

- `src/main/main.ts` (+NotificationService import, initialization, 6 IPC handlers)
- `src/main/preload.ts` (+6 API methods)
- `src/shared/types.ts` (+3 interfaces)
- `src/renderer/App.tsx` (+NotificationBadge import & integration)
- `src/renderer/pages/DictationPage.tsx` (+error notifications in 2 catch blocks)
- `src/renderer/components/LoginPanel.tsx` (+error notifications in 3 catch/error blocks)
- `src/renderer/components/LocalSettingsPanel.tsx` (+error notifications in 5 catch blocks)
- `tsconfig.main.json` (+baseUrl, paths config for @shared alias)

## Type Safety

All notification operations are fully typed with TypeScript:

- `Notification` interface validates structure
- `NotificationResult` & `NotificationsListResult` for API returns
- IPC handlers properly typed with `ipcMain.handle<T, R>`
- Preload bridge with Promise returns typed

## Performance Considerations

- **Cleanup**: O(n) on each read operation, filtered during retrieval (lazy cleanup)
- **Storage**: electron-store is synchronous reads/writes (suitable for app data)
- **Badge Refresh**: Every 5 seconds uses lightweight `getUnreadCount()` query
- **Modal**: Lazy-loaded on bell icon click, not at app startup

## Security Considerations

- Notifications stored locally in app data directory
- No sensitive data should be stored (only error messages)
- Timestamps prevent enumeration attacks
- No network transmission (local only)

## Future Enhancements

- Toast-style auto-dismiss after 5-10 seconds
- Sound/notification bell audio on new error
- Desktop notifications using Electron's `Notification` API
- Notification history search/filter
- Category-based grouping (transcription errors, auth errors, etc.)
- Severity-based auto-read (info/success auto-marked as read)
