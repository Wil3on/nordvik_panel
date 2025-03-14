import React from "react";
import { 
  LayoutDashboard, 
  Server, 
  Users, 
  Activity,
  Cpu,
  HardDrive,
  MemoryStick
} from "lucide-react";
import { DashboardCard, StatCard, ProgressBar } from "@/components/ui/DashboardCard";
import ServerActivityChart from "@/components/ui/charts/ServerActivityChart";
import ServersByGameChart from "@/components/ui/charts/ServersByGameChart";
import RecentActivityList from "@/components/ui/RecentActivityList";
import { 
  getServerStats, 
  getUserStats, 
  getSystemStats, 
  getRecentActivity 
} from "@/lib/dashboard";
import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  // Ensure user is authenticated
  await requireAuth();
  
  // Fetch dashboard data
  const serverStats = await getServerStats();
  const userStats = await getUserStats();
  const systemStats = await getSystemStats();
  const recentActivity = await getRecentActivity(5);
  
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-800/50">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome to your Nordvik Panel dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Servers" 
          value={serverStats.total} 
          icon={<Server className="h-5 w-5 text-blue-400" />}
          trend={{ value: 12, isPositive: true }}
          className="bg-gray-900/80 border-gray-800/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        />
        <StatCard 
          title="Online Servers" 
          value={serverStats.online} 
          icon={<Activity className="h-5 w-5 text-green-400" />}
          trend={{ value: 5, isPositive: true }}
          className="bg-gray-900/80 border-gray-800/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        />
        <StatCard 
          title="Total Users" 
          value={userStats.total} 
          icon={<Users className="h-5 w-5 text-purple-400" />}
          trend={{ value: 8, isPositive: true }}
          className="bg-gray-900/80 border-gray-800/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        />
        <StatCard 
          title="New Users" 
          value={userStats.newUsersThisWeek} 
          icon={<Users className="h-5 w-5 text-indigo-400" />}
          trend={{ value: 3, isPositive: true }}
          className="bg-gray-900/80 border-gray-800/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        />
      </div>
      
      {/* System Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900/80 rounded-xl border border-gray-800/60 shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">System Resource Usage</h2>
            <div className="text-sm text-gray-400">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-gray-300">CPU Usage</span>
                </div>
                <span className="font-semibold text-white">{systemStats.cpuUsage}%</span>
              </div>
              <ProgressBar value={systemStats.cpuUsage} color="blue" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <MemoryStick className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-gray-300">Memory Usage</span>
                </div>
                <span className="font-semibold text-white">{systemStats.memoryUsage}%</span>
              </div>
              <ProgressBar value={systemStats.memoryUsage} color="green" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 mr-2 text-purple-400" />
                  <span className="text-gray-300">Disk Usage</span>
                </div>
                <span className="font-semibold text-white">{systemStats.diskUsage}%</span>
              </div>
              <ProgressBar value={systemStats.diskUsage} color="purple" />
            </div>
          </div>
          <div className="mt-8">
            <ServerActivityChart />
          </div>
        </div>
        
        <div className="bg-gray-900/80 rounded-xl border border-gray-800/60 shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6 text-white">Recent Activity</h2>
          <RecentActivityList activities={recentActivity} />
        </div>
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard 
          title="Servers by Game" 
          icon={<LayoutDashboard className="h-5 w-5 text-indigo-400" />}
          className="bg-gray-900/80 border-gray-800/60"
        >
          <ServersByGameChart data={serverStats.byGame} />
        </DashboardCard>
        
        <DashboardCard 
          title="System Information" 
          icon={<Activity className="h-5 w-5 text-amber-400" />}
          className="bg-gray-900/80 border-gray-800/60"
        >
          <div className="space-y-3">
            {/* System info cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start p-3 bg-gray-800/60 rounded-lg">
                <div className="rounded-full p-2 mr-3 flex-shrink-0 bg-blue-500/20 text-blue-400">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">CPU Usage</p>
                  <p className="text-xs text-gray-400 mt-1">{systemStats.cpuUsage}%</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-gray-800/60 rounded-lg">
                <div className="rounded-full p-2 mr-3 flex-shrink-0 bg-purple-500/20 text-purple-400">
                  <MemoryStick className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">Memory</p>
                  <p className="text-xs text-gray-400 mt-1">{systemStats.memoryUsage}%</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-gray-800/60 rounded-lg">
                <div className="rounded-full p-2 mr-3 flex-shrink-0 bg-green-500/20 text-green-400">
                  <HardDrive className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">Disk</p>
                  <p className="text-xs text-gray-400 mt-1">{systemStats.diskUsage}%</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-gray-800/60 rounded-lg">
                <div className="rounded-full p-2 mr-3 flex-shrink-0 bg-amber-500/20 text-amber-400">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">Uptime</p>
                  <p className="text-xs text-gray-400 mt-1">{systemStats.uptime} days</p>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
