// This file contains utility functions for dashboard data
// In a real application, these would fetch data from the database

import { ServerStatus } from "@prisma/client";

export interface ServerStats {
  total: number;
  online: number;
  offline: number;
  installing: number;
  byGame: { [key: string]: number };
}

export interface UserStats {
  total: number;
  admins: number;
  users: number;
  newUsersThisWeek: number;
}

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number; // in days
}

export interface RecentActivity {
  id: string;
  type: "SERVER_START" | "SERVER_STOP" | "SERVER_INSTALL" | "USER_LOGIN" | "USER_REGISTER";
  message: string;
  timestamp: Date;
  userId: string;
  userName: string;
  serverId?: string;
  serverName?: string;
}

// Mock data functions - to be replaced with actual database queries
export async function getServerStats(): Promise<ServerStats> {
  // This would be a database query in a real application
  return {
    total: 12,
    online: 5,
    offline: 6,
    installing: 1,
    byGame: {
      "Counter-Strike 2": 4,
      "Minecraft": 3,
      "ARK: Survival Evolved": 2,
      "Valheim": 2,
      "Rust": 1,
    }
  };
}

export async function getUserStats(): Promise<UserStats> {
  // This would be a database query in a real application
  return {
    total: 24,
    admins: 3,
    users: 21,
    newUsersThisWeek: 5
  };
}

export async function getSystemStats(): Promise<SystemStats> {
  // This would be a system monitoring query in a real application
  return {
    cpuUsage: 32.5,
    memoryUsage: 45.8,
    diskUsage: 68.2,
    uptime: 15.3
  };
}

export async function getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
  // This would be a database query in a real application
  const activities: RecentActivity[] = [
    {
      id: "1",
      type: "SERVER_START",
      message: "Server started successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      userId: "1",
      userName: "Admin",
      serverId: "1",
      serverName: "CS2 Competitive"
    },
    {
      id: "2",
      type: "USER_REGISTER",
      message: "New user registered",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      userId: "5",
      userName: "JohnDoe"
    },
    {
      id: "3",
      type: "SERVER_INSTALL",
      message: "Server installation completed",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      userId: "1",
      userName: "Admin",
      serverId: "3",
      serverName: "Minecraft Survival"
    },
    {
      id: "4",
      type: "SERVER_STOP",
      message: "Server stopped",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      userId: "2",
      userName: "Moderator",
      serverId: "2",
      serverName: "ARK PvP"
    },
    {
      id: "5",
      type: "USER_LOGIN",
      message: "User logged in",
      timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      userId: "3",
      userName: "GameMaster"
    },
    {
      id: "6",
      type: "SERVER_START",
      message: "Server started successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
      userId: "1",
      userName: "Admin",
      serverId: "4",
      serverName: "Valheim Dedicated"
    },
    {
      id: "7",
      type: "SERVER_STOP",
      message: "Server stopped",
      timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
      userId: "3",
      userName: "GameMaster",
      serverId: "5",
      serverName: "Rust Community"
    },
    {
      id: "8",
      type: "USER_LOGIN",
      message: "User logged in",
      timestamp: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
      userId: "4",
      userName: "ServerOwner"
    },
    {
      id: "9",
      type: "SERVER_INSTALL",
      message: "Server installation started",
      timestamp: new Date(Date.now() - 1000 * 60 * 420), // 7 hours ago
      userId: "1",
      userName: "Admin",
      serverId: "6",
      serverName: "CS2 Casual"
    },
    {
      id: "10",
      type: "USER_REGISTER",
      message: "New user registered",
      timestamp: new Date(Date.now() - 1000 * 60 * 480), // 8 hours ago
      userId: "6",
      userName: "NewPlayer"
    }
  ];

  return activities.slice(0, limit);
}
