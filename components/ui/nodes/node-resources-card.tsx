"use client";

import { Card, CardHeader, CardBody, Divider, Progress } from "@nextui-org/react";
import { HardDrive, Cpu, MemoryStick as Memory, Info } from "lucide-react";

interface NodeResourcesCardProps {
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  className?: string;
  cpuModel?: string;
  cpuCores?: number;
  cpuSpeed?: number;
  ramTotal?: number;
  diskTotal?: number;
  platform?: string;
  architecture?: string;
}

export default function NodeResourcesCard({ 
  cpuUsage, 
  ramUsage, 
  diskUsage,
  className = "",
  cpuModel = "Unknown CPU",
  cpuCores = 0,
  cpuSpeed = 0,
  ramTotal = 0,
  diskTotal = 0,
  platform = "Unknown",
  architecture = "Unknown"
}: NodeResourcesCardProps) {
  const getProgressColor = (value: number) => {
    if (value < 50) return "success";
    if (value < 80) return "warning";
    return "danger";
  };

  const formatSize = (size: number, unit: string = "MB") => {
    if (unit === "MB" && size >= 1024) {
      return `${(size / 1024).toFixed(1)} GB`;
    }
    if (unit === "GB" && size >= 1024) {
      return `${(size / 1024).toFixed(1)} TB`;
    }
    return `${size.toFixed(1)} ${unit}`;
  };

  return (
    <Card className={className}>
      <CardHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          <h3 className="text-lg font-medium">Resource Usage</h3>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="px-6 py-4 space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-1">
              <Cpu size={14} />
              <span className="text-sm">CPU Usage</span>
            </div>
            <span className="text-sm font-medium">{cpuUsage}%</span>
          </div>
          <Progress 
            value={cpuUsage} 
            color={getProgressColor(cpuUsage) as any}
            className="h-2"
            showValueLabel={false}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-1">
              <Memory size={14} />
              <span className="text-sm">RAM Usage</span>
            </div>
            <span className="text-sm font-medium">{ramUsage}%</span>
          </div>
          <Progress 
            value={ramUsage} 
            color={getProgressColor(ramUsage) as any}
            className="h-2"
            showValueLabel={false}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-1">
              <HardDrive size={14} />
              <span className="text-sm">Disk Usage</span>
            </div>
            <span className="text-sm font-medium">{diskUsage}%</span>
          </div>
          <Progress 
            value={diskUsage} 
            color={getProgressColor(diskUsage) as any}
            className="h-2"
            showValueLabel={false}
          />
        </div>
        
        <Divider />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Info size={14} />
            <h4 className="text-md font-medium">System Info</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-default-500">CPU Model:</span>
              <span className="font-medium truncate max-w-[60%] text-right">{cpuModel}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-default-500">CPU Cores:</span>
              <span className="font-medium">{cpuCores}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-default-500">CPU Speed:</span>
              <span className="font-medium">{cpuSpeed} MHz</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-default-500">RAM:</span>
              <span className="font-medium">{formatSize(ramTotal, "MB")}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-default-500">Disk:</span>
              <span className="font-medium">{formatSize(diskTotal, "GB")}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-default-500">Platform:</span>
              <span className="font-medium">{platform}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-default-500">Architecture:</span>
              <span className="font-medium">{architecture}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
