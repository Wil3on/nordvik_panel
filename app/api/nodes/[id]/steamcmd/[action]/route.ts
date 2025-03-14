import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  // Ensure params is awaited before accessing its properties
  const { id, action } = params;

  try {
    // Get node details
    const node = await prisma.node.findUnique({
      where: { id }
    });
    
    if (!node) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }

    // Validate action
    const validActions = ["install", "update", "reinstall", "uninstall"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Build the API URL for the node's SteamCMD endpoint
    const nodeApiUrl = `http://${node.ipAddress}:${node.port}/api/system/steamcmd/${action}`;
    
    console.log(`Sending ${action} request to node at ${nodeApiUrl}`);
    
    // Send request to the node
    const response = await fetch(nodeApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NODE_API_KEY || "nordvik-default-key"}`
      },
      cache: "no-store"
    });

    // Get the response from the node
    const data = await response.json();
    
    // Check if the request was successful
    if (!response.ok) {
      console.error(`Error from node: ${JSON.stringify(data)}`);
      return NextResponse.json(
        { error: data.error || `Failed to ${action} SteamCMD` },
        { status: response.status }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: data.message || `SteamCMD ${action} successful`
    });
  } catch (error) {
    console.error(`Error during SteamCMD ${action}:`, error);
    return NextResponse.json(
      { error: `Error during SteamCMD ${action}` },
      { status: 500 }
    );
  }
}
