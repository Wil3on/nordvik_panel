"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check, Info, AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Link from "next/link";
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";
import "@/styles/animations.css";

export default function RealTimeNotifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [newNotifications, setNewNotifications] = useState<string[]>([]);
  
  // Track new notifications for animation
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
      
      setNewNotifications(unreadIds);
      
      // Clear animation state after 3 seconds
      const timer = setTimeout(() => {
        setNewNotifications([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  
  // Get notification icon based on type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "INFO":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "SUCCESS":
        return <Check className="h-5 w-5 text-green-500" />;
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "ERROR":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };
  
  // Group notifications by date
  const groupNotificationsByDate = () => {
    const groups: { [key: string]: Notification[] } = {
      today: [],
      earlier: []
    };
    
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp);
      if (isToday(date)) {
        groups.today.push(notification);
      } else {
        groups.earlier.push(notification);
      }
    });
    
    return groups;
  };
  
  const notificationGroups = groupNotificationsByDate();
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <DashboardCard 
      title="Real-Time Notifications" 
      icon={<Bell className="h-5 w-5" />}
      action={
        <button 
          onClick={markAllAsRead}
          className="text-xs text-blue-500 hover:text-blue-400 flex items-center"
        >
          Mark all as read
        </button>
      }
    >
      <div>
        {/* Today's notifications */}
        {notificationGroups.today.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-800/30 text-xs font-medium text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Today
            </div>
            <div className="divide-y divide-gray-800">
              {notificationGroups.today.map((notification, index) => (
                <div 
                  key={notification.id} 
                  className={`py-4 px-4 ${notification.read ? '' : 'bg-gray-800/30'} hover:bg-gray-800/50 transition-colors cursor-pointer notification-item ${newNotifications.includes(notification.id) ? 'animate-slideIn' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 mt-1 ${newNotifications.includes(notification.id) ? 'animate-pulse-blue' : ''}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        {notification.link ? (
                          <Link 
                            href={notification.link} 
                            className="text-sm text-gray-300 hover:text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {notification.message}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-300">
                            {notification.message}
                          </span>
                        )}
                        {!notification.read && (
                          <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-500">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Earlier notifications */}
        {notificationGroups.earlier.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-800/30 text-xs font-medium text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Earlier
            </div>
            <div className="divide-y divide-gray-800">
              {notificationGroups.earlier.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`py-4 px-4 ${notification.read ? '' : 'bg-gray-800/30'} hover:bg-gray-800/50 transition-colors cursor-pointer notification-item`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        {notification.link ? (
                          <Link 
                            href={notification.link} 
                            className="text-sm text-gray-300 hover:text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {notification.message}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-300">
                            {notification.message}
                          </span>
                        )}
                        {!notification.read && (
                          <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-500">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
