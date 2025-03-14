import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// GET handler to fetch a specific game by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Get the game ID from the route parameters - properly await the params
    const { id } = context.params;
    
    // Fetch game from database
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        servers: {
          select: {
            id: true,
            name: true,
            status: true,
            ports: true,
          },
        },
      },
    });
    
    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }
    
    // Format server data to include player count (using a placeholder since we don't have actual player data)
    const formattedServers = game.servers.map((server: any) => ({
      ...server,
      players: "0/10", // Using a placeholder for player count
    }));
    
    return NextResponse.json({
      game: {
        ...game,
        servers: formattedServers
      }
    });
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}

// PUT handler to update a specific game
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin privileges
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    if (!isAdmin(session.user?.role)) {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }
    
    const { id } = context.params;
    
    // Check if game exists
    const existingGame = await prisma.game.findUnique({
      where: { id },
    });
    
    if (!existingGame) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.gameCode || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if another game with the same code exists (excluding this game)
    if (body.gameCode !== existingGame.gameCode) {
      const duplicateGame = await prisma.game.findUnique({
        where: { gameCode: body.gameCode },
      });
      
      if (duplicateGame) {
        return NextResponse.json(
          { error: "A game with this code already exists" },
          { status: 400 }
        );
      }
    }
    
    // Update the game in the database
    const game = await prisma.game.update({
      where: { id },
      data: {
        name: body.name,
        gameCode: body.gameCode,
        steamAppId: body.steamAppId || null,
        description: body.description,
        supportedOS: body.supportedOS || { windows: true, linux: false },
        startupCommands: body.startupCommands || "",
        defaultConfig: body.defaultConfig || {},
        updatedAt: new Date(),
      },
    });
    
    // Send notification to admins (if notification function exists)
    if (typeof sendNotification !== 'undefined') {
      sendNotification({
        title: "Game Updated",
        message: `${game.name} has been updated`,
        type: "info",
        role: "admin",
      });
    }
    
    return NextResponse.json({ game });
  } catch (error) {
    console.error("Error updating game:", error);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a specific game
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin privileges
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    if (!isAdmin(session.user?.role)) {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }
    
    const { id } = context.params;
    
    // Check if game exists
    const existingGame = await prisma.game.findUnique({
      where: { id },
      include: {
        servers: true,
      },
    });
    
    if (!existingGame) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }
    
    // Check if there are any servers using this game
    if (existingGame.servers.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete game that has active servers" },
        { status: 400 }
      );
    }
    
    // Delete the game
    await prisma.game.delete({
      where: { id },
    });
    
    // Send notification to admins (if notification function exists)
    if (typeof sendNotification !== 'undefined') {
      sendNotification({
        title: "Game Deleted",
        message: `${existingGame.name} has been deleted`,
        type: "info",
        role: "admin",
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting game:", error);
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    );
  }
}
