import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/server-auth";
import { createServerDirectory, updateServerStatus } from "@/lib/server-utils";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const game = searchParams.get("game") || undefined;
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Build filters
    const filters: any = {};
    
    // Add search filter if provided
    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { 
          game: { 
            name: { contains: search, mode: "insensitive" } 
          } 
        },
        { 
          node: { 
            name: { contains: search, mode: "insensitive" } 
          } 
        },
      ];
    }
    
    // Add status filter if provided
    if (status) {
      filters.status = status;
    }
    
    // Add game filter if provided
    if (game) {
      filters.gameId = game;
    }
    
    // If not admin, only show user's servers
    if (user.role !== "ADMIN") {
      filters.userId = user.id;
    }
    
    // Get total count for pagination
    const total = await prisma.server.count({ where: filters });
    
    // Get servers with pagination, sorting, and filtering
    const servers = await prisma.server.findMany({
      where: filters,
      include: {
        game: {
          select: {
            id: true,
            name: true,
            gameCode: true,
          },
        },
        node: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
          },
        },
      },
      orderBy: {
        [sort]: order,
      },
      skip,
      take: limit,
    });
    
    return NextResponse.json({
      servers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching servers:", error);
    return NextResponse.json(
      { error: "Failed to fetch servers", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.gameId || !data.nodeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Get game and node to ensure they exist
    const [game, node] = await Promise.all([
      prisma.game.findUnique({ where: { id: data.gameId } }),
      prisma.node.findUnique({ where: { id: data.nodeId } }),
    ]);
    
    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }
    
    if (!node) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }
    
    // Create server
    const server = await prisma.server.create({
      data: {
        name: data.name,
        status: "INSTALLING",
        os: node.os,
        ports: data.ports || {},
        game: {
          connect: { id: data.gameId },
        },
        node: {
          connect: { id: data.nodeId },
        },
        user: {
          connect: { id: user.id },
        },
        events: {
          create: {
            type: "INSTALLATION",
            message: `Starting server installation for ${data.name}`,
          },
        },
      },
      include: {
        game: true,
        node: true,
        user: true,
      },
    });
    
    // Initiate server installation on the remote node
    try {
      console.log(`Starting remote installation for server ${server.name} (ID: ${server.id}) on node ${server.node.name}`);
      await createServerDirectory(server);
      console.log(`Successfully initiated installation for ${server.name} on node ${server.node.name}`);
    } catch (error: any) {
      console.error("Error initiating server installation on remote node:", error);
      
      // Log the error to the server events
      await prisma.serverEvent.create({
        data: {
          serverId: server.id,
          type: "ERROR",
          message: `Error initiating server installation: ${error.message || 'Unknown error'}`
        }
      });
      
      // We'll continue the process despite the error, but in a production app
      // you might want to fail the server creation or retry the installation
    }
    
    // In a real application, you would also trigger other installation processes
    // For example, sending a message to a queue or calling an external API
    setTimeout(async () => {
      try {
        // Update server status to OFFLINE after "installation"
        // Update server status in database
        await prisma.server.update({
          where: { id: server.id },
          data: {
            status: "OFFLINE",
            events: {
              create: {
                type: "INSTALLATION",
                message: `Server ${server.name} installation completed successfully`,
              },
            },
          },
        });
        
        // Also update the server status in the config file
        await updateServerStatus(server.id, user.id, "OFFLINE");
      } catch (error) {
        console.error("Error updating server status after installation:", error);
      }
    }, 10000); // Simulate 10 seconds installation
    
    return NextResponse.json({
      server,
      message: "Server creation initiated",
    });
  } catch (error: any) {
    console.error("Error creating server:", error);
    return NextResponse.json(
      { error: "Failed to create server", details: error.message },
      { status: 500 }
    );
  }
}
