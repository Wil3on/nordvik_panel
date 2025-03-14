// Global types for the application

export {};

declare global {
  interface Window {
    sendNotification: (notification: NotificationPayload) => void;
  }

  var sendNotification: (notification: NotificationPayload) => NotificationResponse;

  interface NotificationPayload {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    userId?: string;
    role?: 'admin' | 'user' | 'all';
    link?: string;
  }

  interface NotificationResponse {
    id: string;
    title: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: Date;
    read: boolean;
    userId?: string;
    role?: 'admin' | 'user' | 'all';
    link?: string;
  }
}
