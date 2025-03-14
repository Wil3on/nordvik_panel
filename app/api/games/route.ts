import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET handler to fetch all games
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    
    // Build the query
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { gameCode: { contains: search, mode: "insensitive" } },
            { steamAppId: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    
    // Fetch games from database
    const games = await prisma.game.findMany({
      where,
      include: {
        _count: {
          select: { servers: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    
    return NextResponse.json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

// POST handler to create a new game
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Log the request data for debugging
    console.log("Received game data:", JSON.stringify(body));
    
    // Validate required fields
    if (!body.name || !body.gameCode || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if game with the same code already exists
    const existingGame = await prisma.game.findUnique({
      where: { gameCode: body.gameCode },
    });
    
    if (existingGame) {
      return NextResponse.json(
        { error: "A game with this code already exists" },
        { status: 400 }
      );
    }
    
    // Create the game in the database
    try {
      // Ensure that JSON fields are properly formatted
      let supportedOS = { windows: true, linux: false };
      let defaultConfig = {};
      
      // Validate supportedOS format
      if (body.supportedOS) {
        if (typeof body.supportedOS === 'string') {
          try {
            supportedOS = JSON.parse(body.supportedOS);
          } catch (e) {
            console.error("Invalid supportedOS JSON:", e);
          }
        } else {
          supportedOS = body.supportedOS;
        }
      }
      
      // Validate defaultConfig format
      if (body.defaultConfig) {
        if (typeof body.defaultConfig === 'string') {
          try {
            defaultConfig = JSON.parse(body.defaultConfig);
          } catch (e) {
            console.error("Invalid defaultConfig JSON:", e);
          }
        } else {
          defaultConfig = body.defaultConfig;
        }
      }
      
      console.log("Creating game with data:", {
        name: body.name,
        gameCode: body.gameCode,
        steamAppId: body.steamAppId || null,
        description: body.description,
        supportedOS: supportedOS,
        startupCommands: body.startupCommands || null,
        defaultConfig: defaultConfig,
      });
      
      const game = await prisma.game.create({
        data: {
          name: body.name,
          gameCode: body.gameCode,
          steamAppId: body.steamAppId || null,
          description: body.description,
          supportedOS: supportedOS,
          startupCommands: body.startupCommands || null,
          defaultConfig: defaultConfig,
        },
      });
      
      // Log activity is removed since the ActivityLog model doesn't exist in the schema
      
      // Send notification to admins
      if (typeof sendNotification !== 'undefined') {
        sendNotification({
          title: "New Game Added",
          message: `${game.name} has been added to the game library`,
          type: "info",
          role: "admin",
        });
      }
      
      return NextResponse.json({ game }, { status: 201 });
    } catch (dbError: any) {
      console.error("Database error creating game:", dbError);
      return NextResponse.json(
        { error: "Failed to create game in database", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
