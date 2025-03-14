"use client";

import { Chip, Tooltip } from "@nextui-org/react";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  HelpCircle 
} from "lucide-react";

interface NodeStatusIndicatorProps {
  status: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function NodeStatusIndicator({ 
  status, 
  size = "md",
  showLabel = true,
  className = ""
}: NodeStatusIndicatorProps) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ONLINE":
        return "success";
      case "OFFLINE":
        return "danger";
      case "MAINTENANCE":
        return "warning";
      case "INSTALLING":
      case "UPDATING":
      case "RESTARTING":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "ONLINE":
        return <CheckCircle size={size === "sm" ? 14 : 16} />;
      case "OFFLINE":
        return <XCircle size={size === "sm" ? 14 : 16} />;
      case "MAINTENANCE":
        return <AlertTriangle size={size === "sm" ? 14 : 16} />;
      case "INSTALLING":
      case "UPDATING":
        return <Clock size={size === "sm" ? 14 : 16} />;
      case "RESTARTING":
        return <RefreshCw size={size === "sm" ? 14 : 16} />;
      default:
        return <HelpCircle size={size === "sm" ? 14 : 16} />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status.toUpperCase()) {
      case "ONLINE":
        return "Node is online and operational";
      case "OFFLINE":
        return "Node is currently offline";
      case "MAINTENANCE":
        return "Node is under maintenance";
      case "INSTALLING":
        return "Node is installing software";
      case "UPDATING":
        return "Node is updating software";
      case "RESTARTING":
        return "Node is restarting";
      default:
        return "Unknown node status";
    }
  };

  return (
    <Tooltip content={getStatusDescription(status)}>
      <Chip
        color={getStatusColor(status) as any}
        variant="flat"
        size={size}
        className={className}
      >
        {showLabel ? (
          <div className="flex items-center gap-1">
            {getStatusIcon(status)}
            <span>{status.toUpperCase()}</span>
          </div>
        ) : (
          getStatusIcon(status)
        )}
      </Chip>
    </Tooltip>
  );
}
