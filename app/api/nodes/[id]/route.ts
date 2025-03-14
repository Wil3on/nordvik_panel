import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET /api/nodes/[id] - Get a specific node
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

    // Get node with server count
    const node = await prisma.node.findUnique({
      where: { id },
      include: {
        _count: {
          select: { servers: true },
        },
      },
    });

    if (!node) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...nodeWithoutPassword } = node;

    // Fetch real stats from the node's health endpoint
    let nodeStats = {
      cpuUsage: 0,
      ramUsage: 0,
      diskUsage: 0,
      uptime: "Unknown"
    };

    // Initialize system info with default values
    let systemInfo = {
      cpuModel: "Unknown",
      cpuCores: 0,
      cpuSpeed: 0,
      ramTotal: 0,
      diskTotal: 0,
      diskFree: 0,
      platform: "Unknown",
      architecture: "Unknown"
    };

    // Initialize SteamCMD configuration
    let steamCmdConfig = {
      steamCmdPath: "Unknown",
      installDir: "Unknown",
      isInstalled: false,
      platform: "Unknown"
    };

    try {
      // Prepare authentication headers
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': node.uid // Use node UID as API key for authentication
      };

      // Try the system health endpoint - this has all the metrics we need
      const url = `http://${node.ipAddress}:${node.port}/api/system/health`;
      
      console.log(`Checking node health at ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
      }).catch(err => {
        console.log(`Error fetching from ${url}:`, err.message);
        return null;
      });
      
      // Default status is OFFLINE until we confirm it's online
      let status = "OFFLINE";
      
      if (response && response.ok) {
        const healthData = await response.json();
        
        console.log("Health data response:", JSON.stringify(healthData, null, 2));
        
        // Get metrics directly from the health response
        if (healthData && healthData.metrics) {
          // Extract CPU, RAM and disk usage from metrics object
          nodeStats.cpuUsage = parseFloat(healthData.metrics.cpu?.usage) || 0;
          nodeStats.ramUsage = parseFloat(healthData.metrics.memory?.usedPercentage) || 0;
          nodeStats.diskUsage = parseFloat(healthData.metrics.disk?.usedPercentage) || 0;
          
          // Format node uptime using nodeUptime from system object
          const uptimeSeconds = healthData.system?.nodeUptime || 0;
          if (uptimeSeconds > 0) {
            const days = Math.floor(uptimeSeconds / (3600 * 24));
            const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            nodeStats.uptime = `${days} days, ${hours} hours, ${minutes} minutes`;
          }
          
          // Update node status to ONLINE since we got a successful response
          status = "ONLINE";
        }
        
        // Update node status
        await prisma.node.update({
          where: { id },
          data: { status },
        });

        // Try to get detailed system information
        try {
          const osUrl = `http://${node.ipAddress}:${node.port}/api/system/os`;
          const osResponse = await fetch(osUrl, {
            method: 'GET',
            headers,
            cache: 'no-store',
            signal: AbortSignal.timeout(5000)
          });

          if (osResponse && osResponse.ok) {
            const osData = await osResponse.json();
            
            // Extract system information
            if (osData) {
              // Get CPU information
              if (osData.cpus && osData.cpus.length > 0) {
                systemInfo.cpuModel = osData.cpus[0].model || "Unknown";
                systemInfo.cpuCores = osData.cpus.length || 0;
                systemInfo.cpuSpeed = osData.cpus[0].speed || 0;
              }
              
              // Get RAM information
              if (osData.totalmem) {
                systemInfo.ramTotal = Math.round(osData.totalmem / (1024 * 1024)); // Convert to MB
              }
              
              // Get platform and architecture
              systemInfo.platform = osData.platform || "Unknown";
              systemInfo.architecture = osData.arch || "Unknown";
            }
          }
        } catch (osError) {
          console.error('Error fetching system OS data:', osError);
        }

        // Try to get disk information
        try {
          const metricsUrl = `http://${node.ipAddress}:${node.port}/api/system/metrics`;
          console.log(`Fetching metrics from: ${metricsUrl}`);
          
          const metricsResponse = await fetch(metricsUrl, {
            method: 'GET',
            headers,
            cache: 'no-store',
            signal: AbortSignal.timeout(5000)
          });

          if (metricsResponse && metricsResponse.ok) {
            const metricsData = await metricsResponse.json();
            console.log('Metrics data received:', JSON.stringify(metricsData, null, 2));
            
            // Extract disk information
            if (metricsData && metricsData.disk) {
              // The disk values are already in GB from the node-app, no need to convert
              systemInfo.diskTotal = Math.round(metricsData.disk.total) || 0;
              systemInfo.diskFree = Math.round(metricsData.disk.free) || 0;
              
              console.log('Disk metrics data:', JSON.stringify(metricsData.disk, null, 2));
              console.log(`Processed disk info - Total: ${systemInfo.diskTotal} GB, Free: ${systemInfo.diskFree} GB`);
            } else {
              console.log('No disk data found in metrics response');
            }
          } else {
            console.log(`Failed to fetch metrics: ${metricsResponse?.status} ${metricsResponse?.statusText}`);
          }
        } catch (metricsError) {
          console.error('Error fetching system metrics data:', metricsError);
        }

        // Try to get SteamCMD configuration
        try {
          const steamCmdUrl = `http://${node.ipAddress}:${node.port}/api/system/steamcmd/status`;
          console.log(`Fetching SteamCMD status from: ${steamCmdUrl}`);
          
          const steamCmdResponse = await fetch(steamCmdUrl, {
            method: 'GET',
            headers,
            cache: 'no-store',
            signal: AbortSignal.timeout(5000)
          });

          if (steamCmdResponse && steamCmdResponse.ok) {
            const steamCmdData = await steamCmdResponse.json();
            console.log('SteamCMD status received:', JSON.stringify(steamCmdData, null, 2));
            
            steamCmdConfig.steamCmdPath = steamCmdData.steamCmdPath || "Unknown";
            steamCmdConfig.installDir = steamCmdData.installDir || "Unknown";
            steamCmdConfig.isInstalled = steamCmdData.isInstalled || false;
            steamCmdConfig.platform = steamCmdData.platform || "Unknown";
          } else {
            console.log(`Failed to fetch SteamCMD status: ${steamCmdResponse?.status} ${steamCmdResponse?.statusText}`);
          }
        } catch (steamCmdError) {
          console.error('Error fetching SteamCMD configuration:', steamCmdError);
        }
      } else {
        // Update node status to OFFLINE since the request failed
        await prisma.node.update({
          where: { id },
          data: { status: 'OFFLINE' }
        });
      }
    } catch (error) {
      console.error('Error fetching node health data:', error);
      // Update node status to OFFLINE due to error
      await prisma.node.update({
        where: { id },
        data: { status: 'OFFLINE' }
      });
    }

    const nodeWithStats = {
      ...nodeWithoutPassword,
      stats: nodeStats,
      systemInfo,
      steamCmdConfig
    };

    return NextResponse.json({ node: nodeWithStats });
  } catch (error) {
    console.error("Error fetching node:", error);
    return NextResponse.json(
      { error: "Failed to fetch node" },
      { status: 500 }
    );
  }
}

// PUT /api/nodes/[id] - Update a node
export async function PUT(
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

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = context.params;
    const body = await request.json();
    
    // Check if node exists
    const existingNode = await prisma.node.findUnique({
      where: { id },
    });

    if (!existingNode) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    // Only update fields that are provided
    if (body.name !== undefined) updateData.name = body.name;
    if (body.os !== undefined) updateData.os = body.os;
    if (body.ipAddress !== undefined) updateData.ipAddress = body.ipAddress;
    if (body.port !== undefined) updateData.port = body.port;
    if (body.username !== undefined) updateData.username = body.username;
    if (body.password !== undefined) updateData.password = body.password;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;

    // Update the node
    const updatedNode = await prisma.node.update({
      where: { id },
      data: updateData,
    });

    // Remove password from response
    const { password, ...nodeWithoutPassword } = updatedNode;

    // Fetch real stats from the node's health endpoint
    let nodeStats = {
      cpuUsage: 0,
      ramUsage: 0,
      diskUsage: 0,
      uptime: "Unknown"
    };

    try {
      // Prepare authentication headers
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': updatedNode.uid // Use node UID as API key for authentication
      };

      // Try the system health endpoint - this has all the metrics we need
      const url = `http://${updatedNode.ipAddress}:${updatedNode.port}/api/system/health`;
      
      console.log(`Checking node health at ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
      }).catch(err => {
        console.log(`Error fetching from ${url}:`, err.message);
        return null;
      });
      
      // Default status is OFFLINE until we confirm it's online
      let status = "OFFLINE";
      
      if (response && response.ok) {
        const healthData = await response.json();
        
        console.log("Health data response:", JSON.stringify(healthData, null, 2));
        
        // Get metrics directly from the health response
        if (healthData && healthData.metrics) {
          // Extract CPU, RAM and disk usage from metrics object
          nodeStats.cpuUsage = parseFloat(healthData.metrics.cpu?.usage) || 0;
          nodeStats.ramUsage = parseFloat(healthData.metrics.memory?.usedPercentage) || 0;
          nodeStats.diskUsage = parseFloat(healthData.metrics.disk?.usedPercentage) || 0;
          
          // Format node uptime using nodeUptime from system object
          const uptimeSeconds = healthData.system?.nodeUptime || 0;
          if (uptimeSeconds > 0) {
            const days = Math.floor(uptimeSeconds / (3600 * 24));
            const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            nodeStats.uptime = `${days} days, ${hours} hours, ${minutes} minutes`;
          }
          
          // Update node status to ONLINE since we got a successful response
          status = "ONLINE";
        }
        
        // Update node status
        await prisma.node.update({
          where: { id },
          data: { status },
        });
      } else {
        // Update node status to OFFLINE since the request failed
        await prisma.node.update({
          where: { id },
          data: { status: 'OFFLINE' }
        });
      }
    } catch (error) {
      console.error('Error fetching node health data:', error);
      // Update node status to OFFLINE due to error
      await prisma.node.update({
        where: { id },
        data: { status: 'OFFLINE' }
      });
    }

    const nodeWithStats = {
      ...nodeWithoutPassword,
      stats: nodeStats
    };

    return NextResponse.json({
      node: nodeWithStats,
      message: "Node updated successfully",
    });
  } catch (error) {
    console.error("Error updating node:", error);
    return NextResponse.json(
      { error: "Failed to update node" },
      { status: 500 }
    );
  }
}

// DELETE /api/nodes/[id] - Delete a node
export async function DELETE(
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

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = context.params;
    
    // Check if node exists
    const existingNode = await prisma.node.findUnique({
      where: { id },
      include: {
        _count: {
          select: { servers: true },
        },
      },
    });

    if (!existingNode) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }

    // Check if node has servers
    if (existingNode._count.servers > 0) {
      return NextResponse.json(
        { error: "Cannot delete node with active servers. Please delete or move servers first." },
        { status: 400 }
      );
    }

    // Delete the node
    await prisma.node.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Node deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting node:", error);
    return NextResponse.json(
      { error: "Failed to delete node" },
      { status: 500 }
    );
  }
}
