import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/nodes/[id]/monitor - Get real-time monitoring data for a node
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = context.params;

    // Check if node exists
    const node = await prisma.node.findUnique({
      where: { id },
    });

    if (!node) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }

    // In a real implementation, this would connect to the node and fetch real-time data
    // For now, we'll generate mock monitoring data
    
    // Generate realistic monitoring data
    const cpuUsage = Math.floor(Math.random() * 100);
    const ramUsage = Math.floor(Math.random() * 100);
    const diskUsage = Math.floor(Math.random() * 100);
    
    // Generate realistic uptime
    const days = Math.floor(Math.random() * 30);
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const uptime = `${days} days, ${hours} hours, ${minutes} minutes`;
    
    // Generate network stats
    const networkStats = {
      inbound: Math.floor(Math.random() * 1000),  // KB/s
      outbound: Math.floor(Math.random() * 500),  // KB/s
      totalReceived: Math.floor(Math.random() * 10000),  // GB
      totalSent: Math.floor(Math.random() * 5000),  // GB
    };
    
    // Generate disk stats
    const diskStats = {
      total: 500,  // GB
      used: Math.floor(500 * (diskUsage / 100)),  // GB
      free: Math.floor(500 * (1 - diskUsage / 100)),  // GB
    };
    
    // Generate RAM stats
    const ramStats = {
      total: 16,  // GB
      used: Math.floor(16 * (ramUsage / 100)),  // GB
      free: Math.floor(16 * (1 - ramUsage / 100)),  // GB
    };
    
    // Generate CPU stats
    const cpuStats = {
      cores: 8,
      model: "Intel Xeon E5-2680 v4 @ 2.40GHz",
      loadAverage: [
        (Math.random() * 8).toFixed(2),
        (Math.random() * 6).toFixed(2),
        (Math.random() * 4).toFixed(2)
      ],
    };
    
    // Generate process stats
    const processStats = {
      total: Math.floor(Math.random() * 200) + 50,
      running: Math.floor(Math.random() * 50) + 10,
      sleeping: Math.floor(Math.random() * 150) + 40,
      stopped: Math.floor(Math.random() * 5),
      zombie: Math.floor(Math.random() * 2),
    };
    
    // Generate historical data for charts (last 24 hours, hourly data points)
    const historicalData = {
      cpu: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
      ram: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
      disk: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
      network: {
        inbound: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000)),
        outbound: Array.from({ length: 24 }, () => Math.floor(Math.random() * 500)),
      },
    };
    
    // Combine all monitoring data
    const monitoringData = {
      timestamp: new Date().toISOString(),
      status: node.status,
      uptime,
      cpu: {
        usage: cpuUsage,
        ...cpuStats,
      },
      ram: {
        usage: ramUsage,
        ...ramStats,
      },
      disk: {
        usage: diskUsage,
        ...diskStats,
      },
      network: networkStats,
      processes: processStats,
      historical: historicalData,
    };

    return NextResponse.json({ monitoring: monitoringData });
  } catch (error) {
    console.error("Error fetching node monitoring data:", error);
    return NextResponse.json(
      { error: "Failed to fetch node monitoring data" },
      { status: 500 }
    );
  }
}
