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

    // Check if server is in a valid state to start
    if (server.status !== "OFFLINE" && server.status !== "STOPPED") {
      return NextResponse.json(
        { error: "Server must be offline or stopped to start" },
        { status: 400 }
      );
    }

    // Update server status to STARTING
    await prisma.server.update({
      where: { id },
      data: {
        status: "STARTING",
        events: {
          create: {
            type: "START",
            message: `Starting server ${server.name}`,
          },
        },
      },
    });

    // In a real application, here you would trigger the actual server start process
    // For example, sending a message to a queue or calling an external API

    // Simulate server start (in a real app, this would be done by a background process)
    setTimeout(async () => {
      try {
        // Update server status to ONLINE after "starting"
        await prisma.server.update({
          where: { id },
          data: {
            status: "ONLINE",
            events: {
              create: {
                type: "START",
                message: `Server ${server.name} started successfully`,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error updating server status after starting:", error);
        // If there was an error, set status back to OFFLINE
        try {
          await prisma.server.update({
            where: { id },
            data: {
              status: "OFFLINE",
              events: {
                create: {
                  type: "START",
                  message: `Failed to start server ${server.name}`,
                },
              },
            },
          });
        } catch (innerError) {
          console.error("Error setting server status to OFFLINE after start failure:", innerError);
        }
      }
    }, 5000); // Simulate 5 seconds starting time

    return NextResponse.json({
      message: "Server start initiated",
    });
  } catch (error: any) {
    console.error("Error starting server:", error);
    return NextResponse.json(
      { error: "Failed to start server", details: error.message },
      { status: 500 }
    );
  }
}
