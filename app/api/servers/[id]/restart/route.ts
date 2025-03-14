import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await requireAdmin();

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

    // Check if server is in a valid state to restart
    // We can restart servers that are online or stopped
    if (server.status !== "ONLINE" && server.status !== "STOPPED" && server.status !== "OFFLINE") {
      return NextResponse.json(
        { error: "Server cannot be restarted while in " + server.status.toLowerCase() + " state" },
        { status: 400 }
      );
    }

    // Update server status to RESTARTING
    await prisma.server.update({
      where: { id },
      data: {
        status: "RESTARTING",
        events: {
          create: {
            type: "RESTART",
            message: `Restarting server ${server.name}`,
          },
        },
      },
    });

    // In a real application, here you would trigger the actual server restart process
    // For example, sending a message to a queue or calling an external API

    // Simulate server restart (in a real app, this would be done by a background process)
    setTimeout(async () => {
      try {
        // Update server status to ONLINE after "restarting"
        await prisma.server.update({
          where: { id },
          data: {
            status: "ONLINE",
            events: {
              create: {
                type: "RESTART",
                message: `Server ${server.name} restarted successfully`,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error updating server status after restarting:", error);
        // If there was an error, set status back to previous state
        try {
          await prisma.server.update({
            where: { id },
            data: {
              // Default to OFFLINE if something goes wrong
              status: server.status === "ONLINE" ? "ONLINE" : "OFFLINE",
              events: {
                create: {
                  type: "RESTART",
                  message: `Failed to restart server ${server.name}`,
                },
              },
            },
          });
        } catch (innerError) {
          console.error("Error setting server status after restart failure:", innerError);
        }
      }
    }, 8000); // Simulate 8 seconds restart time

    return NextResponse.json({
      message: "Server restart initiated",
    });
  } catch (error: any) {
    console.error("Error restarting server:", error);
    return NextResponse.json(
      { error: "Failed to restart server", details: error.message },
      { status: 500 }
    );
  }
}
