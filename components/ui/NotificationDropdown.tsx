"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, AlertCircle, X, CheckCheck, Clock } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";
import Link from "next/link";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get icon based on notification type
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
      yesterday: [],
      earlier: []
    };

    notifications.forEach(notification => {
      const date = new Date(notification.timestamp);
      if (isToday(date)) {
        groups.today.push(notification);
      } else if (isYesterday(date)) {
        groups.yesterday.push(notification);
      } else {
        groups.earlier.push(notification);
      }
    });

    return groups;
  };

  const notificationGroups = groupNotificationsByDate();

  // Render notification item
  const renderNotificationItem = (notification: Notification) => (
    <li
      key={notification.id}
      className={`px-4 py-3 hover:bg-gray-800 transition-colors ${
        !notification.read ? "bg-gray-800/50" : ""
      }`}
      onClick={() => handleNotificationClick(notification)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm text-gray-300">
            {notification.message}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.timestamp), {
                addSuffix: true,
              })}
            </p>
            {!notification.read && (
              <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-500">
                New
              </span>
            )}
          </div>
        </div>
        {notification.link && (
          <Link
            href={notification.link}
            className="ml-2 text-blue-500 hover:text-blue-400"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">View</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </div>
    </li>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell with animated indicator */}
      <button
        className="relative rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-gray-900 shadow-lg ring-1 ring-gray-800 z-50">
          <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-sm font-medium flex items-center">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                className="text-xs text-blue-500 hover:text-blue-400 flex items-center"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                <div className="flex justify-center mb-2">
                  <Bell className="h-10 w-10 text-gray-600" />
                </div>
                <p>No notifications yet</p>
                <p className="text-xs mt-1">You'll see updates here when they arrive</p>
              </div>
            ) : (
              <div>
                {/* Today's notifications */}
                {notificationGroups.today.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-800/30 text-xs font-medium text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Today
                    </div>
                    <ul className="divide-y divide-gray-800">
                      {notificationGroups.today.map(renderNotificationItem)}
                    </ul>
                  </div>
                )}

                {/* Yesterday's notifications */}
                {notificationGroups.yesterday.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-800/30 text-xs font-medium text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Yesterday
                    </div>
                    <ul className="divide-y divide-gray-800">
                      {notificationGroups.yesterday.map(renderNotificationItem)}
                    </ul>
                  </div>
                )}

                {/* Earlier notifications */}
                {notificationGroups.earlier.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-800/30 text-xs font-medium text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Earlier
                    </div>
                    <ul className="divide-y divide-gray-800">
                      {notificationGroups.earlier.map(renderNotificationItem)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="border-t border-gray-800 px-4 py-2">
              <Link
                href="/notifications"
                className="block text-center text-xs text-blue-500 hover:text-blue-400"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
