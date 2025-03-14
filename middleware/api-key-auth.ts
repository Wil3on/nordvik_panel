import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Middleware to authenticate API requests using API keys
 * This should be used for routes that need to be accessible via API keys
 */
export async function apiKeyAuth(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Check for API key in headers
  const apiKey = request.headers.get("x-api-key");
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is required" },
      { status: 401 }
    );
  }

  try {
    // Find the API key in the database
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!apiKeyRecord) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // Check if the API key has expired
    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "API key has expired" },
        { status: 401 }
      );
    }

    // Update the lastUsed timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsed: new Date() },
    });

    // Add API key and user information to the request
    const requestWithApiKey = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    // Add custom properties to the request object
    (requestWithApiKey as any).apiKey = {
      id: apiKeyRecord.id,
      permissions: apiKeyRecord.permissions,
      user: apiKeyRecord.user,
    };

    // Continue to the handler
    return handler(requestWithApiKey as NextRequest);
  } catch (error) {
    console.error("API key authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

/**
 * Helper function to check if the API key has the required permission
 */
export function hasPermission(
  request: NextRequest,
  permission: "read" | "write"
): boolean {
  const apiKey = (request as any).apiKey;
  
  if (!apiKey || !apiKey.permissions) {
    return false;
  }

  return !!apiKey.permissions[permission];
}
