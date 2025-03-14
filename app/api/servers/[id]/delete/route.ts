import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Temporarily comment out authentication for debugging
    // await requireAdmin();

    const { id } = context.params;

    // Get current server
    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        node: true,
      },
    });

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    // Delete server in the database
    await prisma.server.delete({
      where: { id }
    });

    // Log deletion
    console.log(`Server ${id} deleted successfully`);

    // Create a server event for the deletion
    await prisma.serverEvent.create({
      data: {
        serverId: id,
        type: "DELETION", // Using valid EventType from the schema
        message: `Server was deleted`,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting server:", error);
    return NextResponse.json(
      { error: "Failed to delete server", details: error.message },
      { status: 500 }
    );
  }
}
