"use client";

import React, { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export function DashboardCard({
  title,
  children,
  className = "",
  footer,
  icon,
  action,
}: DashboardCardProps) {
  return (
    <div className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
        {action && <div>{action}</div>}
      </div>
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-950/50 border-t border-gray-800">
          {footer}
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  className = "",
}: StatCardProps) {
  return (
    <div className={`bg-gray-900 rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 text-xs ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-gray-800">{icon}</div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  label?: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function ProgressBar({
  value,
  label,
  color = "blue",
  size = "md",
  showValue = true,
}: ProgressBarProps) {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
  };

  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-400">{label}</span>
          {showValue && (
            <span className="text-sm text-gray-400">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-800 rounded-full ${heights[size]}`}>
        <div
          className={`${colors[color]} ${heights[size]} rounded-full`}
          style={{ width: `${clampedValue}%` }}
        ></div>
      </div>
    </div>
  );
}
