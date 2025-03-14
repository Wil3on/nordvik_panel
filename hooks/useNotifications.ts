"use client";

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  userId?: string;
}

export function useNotifications() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();
  
  // Connect to Socket.io server
  useEffect(() => {
    // Create Socket.io connection
    const socketInstance = io({
      path: '/socket.io',
    });
    
    setSocket(socketInstance);
    
    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  
  // Authenticate user with Socket.io
  useEffect(() => {
    if (socket && session?.user?.id) {
      socket.emit('authenticate', session.user.id);
    }
  }, [socket, session]);
  
  // Listen for notifications
  useEffect(() => {
    if (!socket) return;
    
    // Handle initial notifications
    socket.on('notifications', (initialNotifications: Notification[]) => {
      setNotifications(initialNotifications);
      setUnreadCount(initialNotifications.filter(n => !n.read).length);
    });
    
    // Handle new notifications
    socket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    
    // Handle notification updates
    socket.on('notificationUpdate', (updatedNotification: Notification) => {
      setNotifications(prev => 
        prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
      );
      
      // Update unread count
      setUnreadCount(prev => 
        updatedNotification.read ? Math.max(0, prev - 1) : prev
      );
    });
    
    return () => {
      socket.off('notifications');
      socket.off('notification');
      socket.off('notificationUpdate');
    };
  }, [socket]);
  
  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    if (!socket) return;
    
    socket.emit('markAsRead', notificationId);
  }, [socket]);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    if (!socket) return;
    
    notifications.forEach(notification => {
      if (!notification.read) {
        socket.emit('markAsRead', notification.id);
      }
    });
  }, [socket, notifications]);
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
