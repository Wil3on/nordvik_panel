import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = context.params;

    // Get server details to determine game type
    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        game: true,
      },
    });

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    // In a real app, the server settings would be fetched from a database
    // or from config files on the actual game server
    // Here we're generating mock settings based on the game type
    const settings = generateSettingsForGame(server.game.gameCode);

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("Error fetching server settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch server settings", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = context.params;
    const data = await request.json();

    // Get current server
    const server = await prisma.server.findUnique({
      where: { id },
    });

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    // Check if server is in a valid state to update settings
    if (server.status === "ONLINE" || server.status === "STARTING" || server.status === "RESTARTING") {
      return NextResponse.json(
        { error: "Server must be stopped to update settings" },
        { status: 400 }
      );
    }

    // In a real application, you would validate the settings against a schema
    // and then update the actual configuration files on the game server
    // Here we just record that settings were updated

    // Record settings update event
    await prisma.serverEvent.create({
      data: {
        serverId: id,
        type: "UPDATE",
        message: `Server settings updated for ${server.name}`,
      },
    });

    return NextResponse.json({
      message: "Server settings updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating server settings:", error);
    return NextResponse.json(
      { error: "Failed to update server settings", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to generate settings based on game type
function generateSettingsForGame(gameCode: string) {
  // Base settings common to most game servers
  const baseSettings = [
    {
      name: "General",
      description: "Basic server configuration",
      settings: [
        {
          id: "server_name",
          name: "Server Name",
          description: "Public name of the server",
          type: "text",
          value: "My Awesome Server",
          required: true
        },
        {
          id: "server_password",
          name: "Server Password",
          description: "Password to join the server (leave empty for no password)",
          type: "text",
          value: "",
          required: false
        },
        {
          id: "max_players",
          name: "Max Players",
          description: "Maximum number of players allowed on the server",
          type: "number",
          value: 32,
          min: 1,
          max: 128,
          required: true
        },
        {
          id: "public_visible",
          name: "Publicly Visible",
          description: "Make this server visible in the public server list",
          type: "boolean",
          value: true,
          required: false
        }
      ]
    },
    {
      name: "Performance",
      description: "Settings that affect server performance",
      settings: [
        {
          id: "tick_rate",
          name: "Tick Rate",
          description: "Server tick rate (updates per second)",
          type: "number",
          value: 30,
          min: 10,
          max: 128,
          required: true,
          advanced: true
        },
        {
          id: "max_memory",
          name: "Max Memory (MB)",
          description: "Maximum memory allocation for the server",
          type: "number",
          value: 4096,
          min: 1024,
          max: 16384,
          step: 512,
          required: true,
          advanced: true
        }
      ]
    }
  ];

  // Game-specific settings
  switch (gameCode) {
    case "minecraft":
      return [
        ...baseSettings,
        {
          name: "Minecraft Settings",
          description: "Minecraft-specific configuration options",
          settings: [
            {
              id: "gamemode",
              name: "Game Mode",
              description: "Default game mode for new players",
              type: "text",
              value: "survival"
            },
            {
              id: "difficulty",
              name: "Difficulty",
              description: "Server difficulty",
              type: "text",
              value: "normal"
            },
            {
              id: "spawn_protection",
              name: "Spawn Protection",
              description: "Radius of spawn area protection",
              type: "number",
              value: 16,
              min: 0,
              max: 100
            },
            {
              id: "pvp",
              name: "PvP Enabled",
              description: "Allow players to damage each other",
              type: "boolean",
              value: true
            },
            {
              id: "allow_nether",
              name: "Allow Nether",
              description: "Allow players to access the nether",
              type: "boolean",
              value: true
            },
            {
              id: "spawn_monsters",
              name: "Spawn Monsters",
              description: "Enable monster spawning",
              type: "boolean",
              value: true
            },
            {
              id: "spawn_animals",
              name: "Spawn Animals",
              description: "Enable animal spawning",
              type: "boolean",
              value: true
            },
            {
              id: "server_motd",
              name: "Server MOTD",
              description: "Message of the day shown in the server list",
              type: "textarea",
              value: "Welcome to my Minecraft server!"
            }
          ]
        }
      ];
    case "csgo":
      return [
        ...baseSettings,
        {
          name: "CS:GO Settings",
          description: "Counter-Strike: Global Offensive configuration options",
          settings: [
            {
              id: "rcon_password",
              name: "RCON Password",
              description: "Password for remote console access",
              type: "text",
              value: "",
              advanced: true
            },
            {
              id: "sv_cheats",
              name: "Allow Cheats",
              description: "Enable cheat commands",
              type: "boolean",
              value: false
            },
            {
              id: "mp_friendlyfire",
              name: "Friendly Fire",
              description: "Allow damage to teammates",
              type: "boolean",
              value: false
            },
            {
              id: "mp_autoteambalance",
              name: "Auto Team Balance",
              description: "Automatically balance teams",
              type: "boolean",
              value: true
            },
            {
              id: "mp_roundtime",
              name: "Round Time (minutes)",
              description: "Maximum round duration",
              type: "number",
              value: 1.92,
              min: 1,
              max: 60,
              step: 0.5
            },
            {
              id: "mp_maxrounds",
              name: "Max Rounds",
              description: "Maximum number of rounds before map change",
              type: "number",
              value: 30,
              min: 1,
              max: 60
            },
            {
              id: "sv_gravity",
              name: "Gravity",
              description: "World gravity setting",
              type: "number",
              value: 800,
              min: 100,
              max: 1000
            }
          ]
        }
      ];
    case "gmod":
      return [
        ...baseSettings,
        {
          name: "Garry's Mod Settings",
          description: "Garry's Mod configuration options",
          settings: [
            {
              id: "gamemode",
              name: "Gamemode",
              description: "Default gamemode (e.g., sandbox, darkrp, ttt)",
              type: "text",
              value: "sandbox"
            },
            {
              id: "sv_alltalk",
              name: "All Talk",
              description: "Allow all players to hear each other regardless of team",
              type: "boolean",
              value: true
            },
            {
              id: "sbox_noclip",
              name: "Allow Noclip",
              description: "Allow players to use noclip",
              type: "boolean",
              value: true
            },
            {
              id: "sbox_godmode",
              name: "God Mode",
              description: "Players take no damage",
              type: "boolean",
              value: false
            },
            {
              id: "sbox_maxprops",
              name: "Max Props",
              description: "Maximum number of props per player",
              type: "number",
              value: 100,
              min: 10,
              max: 1000
            },
            {
              id: "sv_gravity",
              name: "Gravity",
              description: "World gravity setting",
              type: "slider",
              value: 600,
              min: 100,
              max: 1000,
              step: 10
            }
          ]
        }
      ];
    default:
      return baseSettings;
  }
}
