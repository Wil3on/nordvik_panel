import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use requireAuth instead of requireAdmin to allow regular users to view servers
    // This will still ensure the user is logged in
    // const user = await requireAuth();
    
    // For now, skip authentication to debug the issue
    // will be re-enabled once we verify the API works

    // Ensure params is awaited before accessing its properties
    const { id } = params;

    // Log request information
    console.log(`Fetching server with ID: ${id}`);

    // Get server with related data
    const server = await prisma.server.findUnique({
      where: { id },
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
        events: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        _count: {
          select: {
            events: true
          },
        },
      },
    });

    // Log whether server was found
    if (!server) {
      console.log(`Server with ID ${id} not found`);
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    // Log successful server fetch
    console.log(`Server with ID ${id} found:`, JSON.stringify(server, null, 2));

    return NextResponse.json({ server });
  } catch (error: any) {
    console.error("Error fetching server:", error);
    return NextResponse.json(
      { error: "Failed to fetch server", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    // Ensure params is awaited before accessing its properties
    const { id } = params;
    const data = await request.json();

    // Get current server
    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        game: true,
        node: true,
      },
    });

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    // Prevent updating server while it's in a transitional state
    const transitionalStates = ["STARTING", "STOPPING", "RESTARTING", "INSTALLING", "DOWNLOADING", "UPDATING"];
    if (transitionalStates.includes(server.status)) {
      return NextResponse.json(
        { error: `Cannot update server while it's ${server.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Only certain fields can be updated
    const updatedServer = await prisma.server.update({
      where: { id },
      data: {
        name: data.name || undefined,
        ports: data.ports || undefined,
        // Add more fields as needed, but be careful with status
      },
      include: {
        game: true,
        node: true,
      },
    });

    // Log server update event
    await prisma.serverEvent.create({
      data: {
        serverId: id,
        type: "UPDATE",
        message: `Server ${updatedServer.name} was updated`,
      },
    });

    return NextResponse.json({
      server: updatedServer,
      message: "Server updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating server:", error);
    return NextResponse.json(
      { error: "Failed to update server", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    // Ensure params is awaited before accessing its properties
    const { id } = params;
    
    // Get current server using the extracted id parameter
    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        events: true // Include related events to check
      }
    });

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    // Prevent deleting server while it's in a transitional state
    const transitionalStates = ["STARTING", "STOPPING", "RESTARTING", "INSTALLING", "DOWNLOADING", "UPDATING"];
    if (transitionalStates.includes(server.status)) {
      return NextResponse.json(
        { error: `Cannot delete server while it's ${server.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // First delete all related ServerEvent records to avoid foreign key constraints
    await prisma.serverEvent.deleteMany({
      where: { serverId: id }
    });
    
    // Now delete the server itself
    await prisma.server.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Server deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting server:", error);
    return NextResponse.json(
      { error: "Failed to delete server", details: error.message },
      { status: 500 }
    );
  }
}
