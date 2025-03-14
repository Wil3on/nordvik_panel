import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST handler to stop a specific server
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await requireAdmin();

    // Get the server ID from the route parameters
    const { id } = context.params;
    
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

    // Check if server is in a valid state to stop
    if (server.status !== "ONLINE") {
      return NextResponse.json(
        { error: "Server must be online to stop" },
        { status: 400 }
      );
    }

    // Update server status to OFFLINE (we'll skip the "STOPPING" state since it's not in the enum)
    await prisma.server.update({
      where: { id },
      data: {
        status: "OFFLINE",
        events: {
          create: {
            type: "STOP",
            message: `Stopping server ${server.name}`,
          },
        },
      },
    });

    // Create a server stop event
    await prisma.event.create({
      data: {
        type: "SERVER_STOP",
        message: `Server ${server.name} was stopped`,
        serverId: id,
      },
    });
    
    // In a real application, here you would trigger the actual server stop process
    // For example, sending a message to a queue or calling an external API

    return NextResponse.json({ 
      message: "Server stop completed",
      status: "OFFLINE"
    });
    
  } catch (error) {
    console.error("Error stopping server:", error);
    return NextResponse.json(
      { error: "Failed to stop server" },
      { status: 500 }
    );
  }
}
