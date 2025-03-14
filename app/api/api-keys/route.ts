import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// GET /api/api-keys - Get all API keys for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        permissions: true,
        lastUsed: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
        // Don't include the actual key for security
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { name, permissions, expiresAt } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "API key name is required" },
        { status: 400 }
      );
    }

    // Generate a secure API key
    const apiKeyString = crypto.randomBytes(32).toString('hex');
    
    // Default permissions if not provided
    const defaultPermissions = { read: true, write: false };
    
    // Create the API key
    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key: apiKeyString,
        userId: user.id,
        permissions: permissions || defaultPermissions,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    // Return the API key only once (it won't be retrievable later)
    return NextResponse.json({
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKeyString, // Only returned once
        permissions: apiKey.permissions,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      },
      message: "API key created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}

// DELETE /api/api-keys?id=<api-key-id> - Revoke an API key
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get the API key ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const apiKeyId = searchParams.get("id");
    
    if (!apiKeyId) {
      return NextResponse.json(
        { error: "API key ID is required" },
        { status: 400 }
      );
    }

    // Check if the API key exists and belongs to the user
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        userId: user.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not found or does not belong to the user" },
        { status: 404 }
      );
    }

    // Delete the API key
    await prisma.apiKey.delete({
      where: { id: apiKeyId },
    });

    return NextResponse.json({
      message: "API key revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking API key:", error);
    return NextResponse.json(
      { error: "Failed to revoke API key" },
      { status: 500 }
    );
  }
}
