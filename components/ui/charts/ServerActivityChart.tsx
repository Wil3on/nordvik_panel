"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { format } from "date-fns";

// Sample data structure
interface ServerActivityData {
  date: string;
  online: number;
  total: number;
}

// Generate sample data for the past 7 days
const generateSampleData = (): ServerActivityData[] => {
  const data: ServerActivityData[] = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate random but realistic numbers
    const total = Math.floor(Math.random() * 5) + 8; // 8-12 total servers
    const online = Math.floor(Math.random() * (total - 2)) + 2; // 2 to (total-1) servers online
    
    data.push({
      date: format(date, "yyyy-MM-dd"),
      online,
      total,
    });
  }
  
  return data;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
        <p className="text-gray-300 text-sm mb-1">{format(new Date(label), "MMM dd, yyyy")}</p>
        <p className="text-blue-400 text-sm">
          <span className="font-medium">Online Servers:</span> {payload[0].value}
        </p>
        <p className="text-gray-400 text-sm">
          <span className="font-medium">Total Servers:</span> {payload[1].value}
        </p>
      </div>
    );
  }
  
  return null;
};

export default function ServerActivityChart() {
  // In a real app, this would come from an API or database
  const data = generateSampleData();
  
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickFormatter={(value) => format(new Date(value), "MMM dd")}
          />
          <YAxis 
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            domain={[0, 'dataMax + 1']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#9CA3AF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
          <Area
            type="monotone"
            dataKey="online"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOnline)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
