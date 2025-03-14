import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// Helper function to generate valid Node API URL
const getNodeApiUrl = (nodeIpAddress: string, nodePort: number, serverId: string, path: string = '/') => {
  return `http://${nodeIpAddress}:${nodePort}/api/files/${serverId}/list?path=${encodeURIComponent(path)}`;
};

// Helper function to log API requests (for debugging)
const logApiRequest = (method: string, url: string, headers: HeadersInit) => {
  console.log(`[API Request] ${method} ${url}`);
  console.log(`[API Headers] X-API-Key: ${headers['X-API-Key' as keyof HeadersInit] ? 'PRESENT' : 'MISSING'}`);
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serverId = params.id;
    
    // Extract path from URL
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    
    console.log(`Getting files for server ${serverId} at path ${path}`);
    
    // Find the server and associated node in the database
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        node: true
      }
    });
    
    if (!server || !server.node) {
      console.error(`Server ${serverId} or its node not found`);
      return NextResponse.json({ error: "Server or node not found" }, { status: 404 });
    }
    
    const node = server.node;
    console.log("Node details:", {
      id: node.id,
      name: node.name,
      uid: node.uid || "MISSING",
      authToken: node.authToken ? "PRESENT" : "MISSING" 
    });
    
    // Generate the Node API URL using node details from the database
    const nodeApiUrl = getNodeApiUrl(node.ipAddress, node.port, serverId, path);
    console.log(`Node API URL: ${nodeApiUrl}`);
    
    // Use the same authentication approach as in server-utils.ts
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': 'nordvik-api-key',
      'Authorization': `Bearer dev-token`
    };
    
    console.log(`Making fetch request to Node API with standard auth headers`);
    
    const response = await fetch(nodeApiUrl, {
      method: 'GET',
      headers,
    });
    
    // Log response status
    console.log(`Node API responded with status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage = `Node API returned status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, just use the status text
        errorMessage = `${errorMessage}: ${response.statusText}`;
      }
      console.error(`Error from Node API: ${errorMessage}`);
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }
    
    const data = await response.json();
    console.log(`Successfully fetched files from node ${node.name} for server ${serverId}`);
    
    // Make sure we return a consistent format that the frontend expects
    // The daemon might return { items: [...] } but our frontend expects { files: [...] }
    const responseData = {
      files: data.items || data.files || [],
      path: path,
      server: {
        id: serverId,
        nodeId: node.id
      }
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in server files route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    const { action, path: filePath, content, type } = data;
    
    console.log(`File action ${action} for server ${id} at path: ${filePath}`);
    
    // Check if server exists in database
    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        node: true,
      }
    });
    
    if (!server || !server.node) {
      return NextResponse.json(
        { error: "Server or node not found" },
        { status: 404 }
      );
    }
    
    const node = server.node;
    
    // Use the same authentication approach as in server-utils.ts
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': 'nordvik-api-key',
      'Authorization': `Bearer dev-token`,
      'Accept': 'application/json'
    };
    
    console.log(`Using authentication with node: ${node.name}`);
    
    console.log(`Making fetch request to Node API with standard auth headers`);
    
    // Map the action to the appropriate Node API endpoint
    let nodeApiUrl: string;
    let nodeMethod = 'POST';
    let nodeBody: Record<string, any> = {};
    
    // Base URL for the node API
    const nodeBaseUrl = `http://${node.ipAddress}:${node.port}/api`;
    
    switch (action) {
      case 'read':
        nodeApiUrl = `${nodeBaseUrl}/files/${id}/read?path=${encodeURIComponent(filePath)}`;
        nodeMethod = 'GET';
        break;
        
      case 'write':
        nodeApiUrl = `${nodeBaseUrl}/files/${id}/write`;
        nodeBody = { path: filePath, content };
        break;
        
      case 'create':
        if (type === 'directory') {
          nodeApiUrl = `${nodeBaseUrl}/files/${id}/mkdir`;
          nodeBody = { path: filePath };
        } else {
          nodeApiUrl = `${nodeBaseUrl}/files/${id}/write`;
          nodeBody = { path: filePath, content: content || '' };
        }
        break;
        
      case 'delete':
        nodeApiUrl = `${nodeBaseUrl}/files/${id}/delete`;
        nodeBody = { 
          path: filePath,
          recursive: true, // Add recursive flag to ensure directories can be deleted too
          type: type || 'file' // Include the type if provided by the frontend
        };
        console.log(`Sending delete request with body:`, nodeBody);
        break;
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
    
    try {
      console.log(`Forwarding ${action} request to Node API: ${nodeApiUrl}`);
      
      // Set up request options
      const requestOptions: RequestInit = {
        method: nodeMethod,
        headers,
        cache: 'no-store' as RequestCache
      };
      
      // Add body for POST requests
      if (nodeMethod === 'POST') {
        requestOptions.body = JSON.stringify(nodeBody);
      }
      
      // Make request to Node API
      const nodeResponse = await fetch(nodeApiUrl, requestOptions);
      
      console.log(`Node API response status for ${action}: ${nodeResponse.status}`);
      console.log(`Node API response headers:`, Object.fromEntries([...nodeResponse.headers.entries()]));
      
      // Handle response
      if (!nodeResponse.ok) {
        let errorMessage = `Error performing ${action} operation via server node`;
        let responseText = '';
        
        // First try to get the raw text of the response
        try {
          responseText = await nodeResponse.text();
          console.error(`Node API error response body: ${responseText}`);
        } catch (e) {
          console.error(`Could not read response text: ${(e as Error).message}`);
        }
        
        // Then try to parse it as JSON if possible
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
            console.error(`Node API error JSON: ${JSON.stringify(errorData)}`);
          } catch (parseError) {
            // If it's not valid JSON, use the text directly
            if (responseText.length > 0 && !responseText.includes('<!DOCTYPE html>')) {
              errorMessage += `: ${responseText}`;
            }
            console.error(`Failed to parse error response as JSON: ${(parseError as Error).message}`);
          }
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: nodeResponse.status }
        );
      }
      
      // Parse and return successful response
      const responseData = await nodeResponse.json();
      return NextResponse.json(responseData);
      
    } catch (error) {
      const apiError = error as Error;
      console.error(`Failed to connect to Node API for ${action}: ${apiError.message}`);
      return NextResponse.json(
        { 
          error: "Failed to connect to server node",
          details: apiError.message,
          suggestion: "Please ensure the node server is running and accessible"
        },
        { status: 503 }
      );
    }
    
  } catch (error) {
    const serverError = error as Error;
    console.error("Unexpected error in file manager API:", serverError);
    return NextResponse.json(
      { error: "Failed to process file action", details: serverError.message },
      { status: 500 }
    );
  }
}
