"use client";

import React from "react";
import { Card, CardBody, Divider, Progress, ProgressProps } from "@nextui-org/react";
import { Users, Power, ClipboardList } from "lucide-react";
import { ReactNode } from "react";

interface Server {
  id: string;
  ipAddress?: string;
  port?: number;
  createdAt: string;
  game: {
    name: string;
  };
  node: {
    name: string;
    ipAddress?: string;
  };
  gameVersion?: string;
  installationPath?: string;
  resources?: {
    cpu: number;
    memory: number;
    disk: number;
  };
  players?: {
    online: number;
    max: number;
    list?: {
      name: string;
      avatar?: string;
      playTime?: number;
    }[];
  };
  status: string;
  statusHistory?: {
    status: string;
    timestamp: string;
  }[];
}

interface ServerDetailsTabProps {
  server: Server;
  onRefresh?: () => void;
}

export function ServerDetailsTab({ server, onRefresh }: ServerDetailsTabProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Server Information</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 space-y-3">
              <div>
                <span className="text-xs text-gray-400">Server ID</span>
                <p className="font-medium">{server?.id || 'Unknown'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">IP Address</span>
                <p className="font-medium">{server?.ipAddress || 'Not assigned'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Port</span>
                <p className="font-medium">{server?.port || 'Not assigned'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Created on</span>
                <p className="font-medium">{server?.createdAt ? new Date(server.createdAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Resource Usage</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">CPU Usage</span>
                  <span className="text-xs font-medium">{server?.resources?.cpu || '0'}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${server?.resources?.cpu || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Memory Usage</span>
                  <span className="text-xs font-medium">{server?.resources?.memory || '0'}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${server?.resources?.memory || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Disk Usage</span>
                  <span className="text-xs font-medium">{server?.resources?.disk || '0'}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${server?.resources?.disk || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Game Information</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 space-y-3">
              <div>
                <span className="text-xs text-gray-400">Game</span>
                <p className="font-medium">{server?.game?.name || 'Unknown Game'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Game Version</span>
                <p className="font-medium">{server?.gameVersion || 'Latest'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Installation Directory</span>
                <p className="font-medium text-sm truncate">{server?.installationPath || 'Not available'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Node Information</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 space-y-3">
              <div>
                <span className="text-xs text-gray-400">Node Name</span>
                <p className="font-medium">{server?.node?.name || 'Unknown Node'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Node IP Address</span>
                <p className="font-medium">{server?.node?.ipAddress || 'Not available'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Player Information</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              {server?.status?.toUpperCase() === 'ONLINE' ? (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm">Active Players</span>
                    <span className="text-sm font-semibold">{server?.players?.online || 0} / {server?.players?.max || 0}</span>
                  </div>
                  {server?.players && server?.players.online > 0 ? (
                    <div className="space-y-2 mt-3">
                      <h4 className="text-xs text-gray-400">Online Players</h4>
                      <div className="max-h-32 overflow-y-auto">
                        {Array.isArray(server?.players?.list) && server?.players?.list.map((player, index) => (
                          <div key={index} className="flex items-center py-1.5 border-b border-gray-700/30 last:border-0">
                            <div className="h-6 w-6 bg-gray-700 rounded-full overflow-hidden mr-2.5 flex-shrink-0">
                              {player?.avatar ? (
                                <img src={player.avatar} alt={player?.name || 'Player'} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-gray-300">
                                  {player?.name ? player.name.charAt(0).toUpperCase() : '?'}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{player?.name || 'Unknown Player'}</div>
                              {player?.playTime && (
                                <div className="text-xs text-gray-400">{player.playTime} minutes</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No players currently online</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <Power className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Server is offline</p>
                  <p className="text-xs mt-1">Player information will be available when server is online</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Server Status History</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
          {server?.statusHistory && server.statusHistory.length > 0 ? (
            <div className="space-y-2">
              {server.statusHistory.map((status, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(status?.status || '')}`}></div>
                    <span className="text-sm">{status?.status ? status.status.toLowerCase() : 'unknown'}</span>
                  </div>
                  <span className="text-xs text-gray-400">{status?.timestamp ? new Date(status.timestamp).toLocaleString() : 'Unknown date'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No status history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusDotColor(status: string) {
  switch (status?.toUpperCase()) {
    case 'ONLINE':
      return 'bg-green-500';
    case 'OFFLINE':
    case 'STOPPED':
      return 'bg-gray-500';
    case 'INSTALLING':
    case 'DOWNLOADING':
      return 'bg-blue-500';
    case 'STARTING':
    case 'RESTARTING':
      return 'bg-yellow-500';
    case 'ERROR':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}
