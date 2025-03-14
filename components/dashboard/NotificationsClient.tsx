"use client";

import React, { useState } from "react";
import { Bell, Check, Info, AlertTriangle, AlertCircle, Filter, Clock, Search, X, ChevronDown } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Link from "next/link";
import RealTimeNotifications from "@/components/ui/RealTimeNotifications";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";

export default function NotificationsClient() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({
    INFO: true,
    SUCCESS: true,
    WARNING: true,
    ERROR: true
  });
  const [showRead, setShowRead] = useState(true);
  const [showUnread, setShowUnread] = useState(true);

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
  
  // Format date for display
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  // Filter notifications based on current filters
  const filteredNotifications = notifications.filter(notification => {
    // Filter by type
    if (!selectedTypes[notification.type]) {
      return false;
    }
    
    // Filter by read/unread status
    if (notification.read && !showRead) {
      return false;
    }
    
    if (!notification.read && !showUnread) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group notifications by date
  const groupNotificationsByDate = () => {
    const groups: { [key: string]: Notification[] } = {};
    
    filteredNotifications.forEach(notification => {
      const date = new Date(notification.timestamp);
      let groupKey: string;
      
      if (isToday(date)) {
        groupKey = 'Today';
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday';
      } else {
        groupKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(notification);
    });
    
    return groups;
  };

  const notificationGroups = groupNotificationsByDate();
  const groupKeys = Object.keys(notificationGroups);

  // Toggle notification type filter
  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTypes({
      INFO: true,
      SUCCESS: true,
      WARNING: true,
      ERROR: true
    });
    setShowRead(true);
    setShowUnread(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-400 mt-1">View and manage your notifications</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`flex items-center space-x-2 px-3 py-2 ${filterOpen ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'} rounded-md text-sm transition-colors`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
          <button 
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition-colors"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        </div>
      </div>
      
      {/* Filter panel */}
      {filterOpen && (
        <div className="bg-gray-800 rounded-md p-4 space-y-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Search notifications..."
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-gray-300" />
                </button>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-md text-xs flex items-center space-x-1 ${
                  selectedTypes.INFO ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => toggleTypeFilter('INFO')}
              >
                <Info className="h-3 w-3" />
                <span>Info</span>
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-xs flex items-center space-x-1 ${
                  selectedTypes.SUCCESS ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => toggleTypeFilter('SUCCESS')}
              >
                <Check className="h-3 w-3" />
                <span>Success</span>
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-xs flex items-center space-x-1 ${
                  selectedTypes.WARNING ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => toggleTypeFilter('WARNING')}
              >
                <AlertTriangle className="h-3 w-3" />
                <span>Warning</span>
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-xs flex items-center space-x-1 ${
                  selectedTypes.ERROR ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => toggleTypeFilter('ERROR')}
              >
                <AlertCircle className="h-3 w-3" />
                <span>Error</span>
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded-md text-xs ${
                  showRead ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => setShowRead(!showRead)}
              >
                Read
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-xs ${
                  showUnread ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => setShowUnread(!showUnread)}
              >
                Unread
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
      
      {/* Real-time notifications component */}
      <RealTimeNotifications />
      
      {/* Test notifications panel has been removed to avoid server-side dependencies */}
      
      {/* Notification list */}
      <DashboardCard 
        title={`Notifications ${filteredNotifications.length > 0 ? `(${filteredNotifications.length})` : ''}`}
        icon={<Bell className="h-5 w-5" />}
      >
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex justify-center mb-3">
              <Bell className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-400">No notifications found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery || !showRead || !showUnread || Object.values(selectedTypes).some(v => !v) ? 
                'Try adjusting your filters' : 
                'You\'re all caught up!'}
            </p>
            {(searchQuery || !showRead || !showUnread || Object.values(selectedTypes).some(v => !v)) && (
              <button
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div>
            {groupKeys.map(groupKey => (
              <div key={groupKey}>
                <div className="px-4 py-2 bg-gray-800/30 text-xs font-medium text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {groupKey}
                </div>
                <div className="divide-y divide-gray-800">
                  {notificationGroups[groupKey].map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`py-4 px-4 ${notification.read ? '' : 'bg-gray-800/30'} hover:bg-gray-800/50 transition-colors cursor-pointer`}
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
                            {formatDate(new Date(notification.timestamp))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
