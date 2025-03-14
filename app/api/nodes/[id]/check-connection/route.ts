import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import fetch from 'node-fetch';

// POST /api/nodes/[id]/check-connection
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure params is awaited before accessing its properties
    const { id: nodeId } = params;
    
    // Fetch the node details to get IP address and port
    const node = await prisma.node.findUnique({
      where: {
        id: nodeId,
      },
    });

    if (!node) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }

    try {
      // Attempt to connect to the node's health endpoint with the correct path
      // The node app exposes the health endpoint at /health (not at /api/system/health)
      const nodeUrl = `http://${node.ipAddress}:${node.port}/health`;
      
      // Get the authentication token from the node record
      const authToken = node.authToken;
      
      if (!authToken) {
        return NextResponse.json({
          connected: false,
          message: "No authentication token found for this node"
        });
      }
      
      const response = await fetch(nodeUrl, {
        method: 'GET',
        // No authentication needed for health endpoint
        timeout: 5000
      });

      if (response.ok) {
        // If connection is successful, update the node status to ONLINE
        await prisma.node.update({
          where: { id: nodeId },
          data: { status: "ONLINE" }
        });

        return NextResponse.json({
          connected: true,
          message: "Successfully connected to node"
        });
      } else {
        // If connection unsuccessful but we got a response, get the error message
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || "Failed to connect to node";
        } catch (e) {
          errorMessage = "Failed to connect to node";
        }
        
        // Update the node status to OFFLINE
        await prisma.node.update({
          where: { id: nodeId },
          data: { status: "OFFLINE" }
        });
        
        return NextResponse.json({
          connected: false,
          message: errorMessage
        });
      }
    } catch (error: any) {
      console.error("Node connection error:", error);
      
      // Update the node status to OFFLINE
      await prisma.node.update({
        where: { id: nodeId },
        data: { status: "OFFLINE" }
      });

      return NextResponse.json({
        connected: false,
        message: "Failed to connect to node: " + error.message
      });
    }
  } catch (error: any) {
    console.error("Error checking node connection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
