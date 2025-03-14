import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Dedicated endpoint for deleting files and directories
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("DELETE FILES API called");
  
  try {
    const { id } = params;
    console.log(`Server ID: ${id}`);
    
    const body = await request.json();
    console.log("Request body:", body);
    
    const { path: filePath, type } = body;
    
    console.log(`Attempting to delete ${type || 'item'} at path: ${filePath} for server ${id}`);
    
    // Check if server exists in database
    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        node: true,
      }
    });
    
    if (!server || !server.node) {
      console.error(`Server ${id} or its node not found`);
      return NextResponse.json(
        { error: "Server or node not found" },
        { status: 404 }
      );
    }
    
    const node = server.node;
    console.log(`Node found: ${node.name}, IP: ${node.ipAddress}, Port: ${node.port}`);
    
    // Set up request headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': 'nordvik-api-key',
      'Authorization': `Bearer dev-token`,
      'Accept': 'application/json'
    };
    
    // Create NodeJS API URL for deletion
    const nodeBaseUrl = `http://${node.ipAddress}:${node.port}/api`;
    const nodeApiUrl = `${nodeBaseUrl}/files/${id}/delete`;
    
    console.log(`Sending delete request to Node API: ${nodeApiUrl}`);
    
    // Create request body
    const nodeBody = {
      path: filePath,
      recursive: true,
      type: type || 'file'
    };
    
    console.log(`Delete request body:`, nodeBody);
    
    // Make request to Node API
    try {
      console.log(`Fetching ${nodeApiUrl} with method DELETE and headers:`, headers);
      
      const nodeResponse = await fetch(nodeApiUrl, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(nodeBody),
        cache: 'no-store' as RequestCache
      });
      
      console.log(`Node API response status: ${nodeResponse.status}`);
      console.log(`Node API response headers:`, Object.fromEntries([...nodeResponse.headers.entries()]));
      
      // Get response as text first
      const responseText = await nodeResponse.text();
      console.log(`Response text from node:`, responseText);
      
      // Handle error response
      if (!nodeResponse.ok) {
        let errorMessage = `Error deleting ${type || 'item'} via server node`;
        
        // Try to parse as JSON if possible
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            console.log("Parsed error data:", errorData);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (parseError) {
            console.error("Failed to parse error response as JSON:", parseError);
            // If not valid JSON, use the text directly
            if (responseText.length > 0 && !responseText.includes('<!DOCTYPE html>')) {
              errorMessage += `: ${responseText}`;
            }
          }
        }
        
        console.error(`Returning error response: ${errorMessage}`);
        return NextResponse.json(
          { error: errorMessage },
          { status: nodeResponse.status }
        );
      }
      
      // Success response
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log("Parsed success response:", responseData);
      } catch (e) {
        console.warn("Response not JSON, creating default success response");
        // If not valid JSON, create a default success response
        responseData = { 
          success: true,
          message: `Successfully deleted ${type || 'item'} at ${filePath}`
        };
      }
      
      console.log("Returning success response:", responseData);
      return NextResponse.json(responseData);
      
    } catch (error) {
      const apiError = error as Error;
      console.error(`Failed to connect to Node API for delete: ${apiError.message}`);
      console.error(`Stack trace:`, apiError.stack);
      return NextResponse.json(
        { 
          error: "Failed to connect to server node",
          details: apiError.message,
          stack: apiError.stack,
          suggestion: "Please ensure the node server is running and accessible"
        },
        { status: 503 }
      );
    }
    
  } catch (error) {
    const serverError = error as Error;
    console.error("Unexpected error in file delete API:", serverError);
    console.error(`Stack trace:`, serverError.stack);
    return NextResponse.json(
      { error: "Failed to process delete action", details: serverError.message, stack: serverError.stack },
      { status: 500 }
    );
  }
}
