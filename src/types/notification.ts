export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'status_change' | 'error' | 'success';
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<void>;
  subscribeToNotifications: (userId: string) => () => void;
  requestNotificationPermission: () => Promise<void>;
  unreadCount: number;
}

export interface NotificationPayload {
  new: Notification;
  old: Notification | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}

export interface NotificationResponse {
  data: Notification[] | null;
  error: Error | null;
}
