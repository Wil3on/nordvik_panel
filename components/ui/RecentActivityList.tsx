"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  PlayCircle, 
  StopCircle, 
  Download, 
  LogIn, 
  UserPlus 
} from "lucide-react";
import { RecentActivity } from "@/lib/dashboard";

interface RecentActivityListProps {
  activities: RecentActivity[];
}

export default function RecentActivityList({ activities }: RecentActivityListProps) {
  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "SERVER_START":
        return <PlayCircle className="h-5 w-5 text-green-500" />;
      case "SERVER_STOP":
        return <StopCircle className="h-5 w-5 text-red-500" />;
      case "SERVER_INSTALL":
        return <Download className="h-5 w-5 text-blue-500" />;
      case "USER_LOGIN":
        return <LogIn className="h-5 w-5 text-yellow-500" />;
      case "USER_REGISTER":
        return <UserPlus className="h-5 w-5 text-purple-500" />;
      default:
        return <div className="h-5 w-5 bg-gray-500 rounded-full" />;
    }
  };

  // Function to format the activity message
  const formatActivityMessage = (activity: RecentActivity) => {
    switch (activity.type) {
      case "SERVER_START":
      case "SERVER_STOP":
      case "SERVER_INSTALL":
        return (
          <>
            <span className="font-medium">{activity.userName}</span> {activity.message.toLowerCase()} <span className="font-medium">{activity.serverName}</span>
          </>
        );
      case "USER_LOGIN":
      case "USER_REGISTER":
        return (
          <>
            <span className="font-medium">{activity.userName}</span> {activity.message.toLowerCase()}
          </>
        );
      default:
        return activity.message;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300">
              {formatActivityMessage(activity)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
