import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { OperatingSystem } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

// GET /api/nodes - Get all nodes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const os = searchParams.get("os") || undefined;
    
    // Build filter conditions
    const where: any = {};
    
    // If search term is provided, add text search filters
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { ipAddress: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (os) {
      where.os = os;
    }

    // Get all nodes with filtering
    const nodes = await prisma.node.findMany({
      where,
      include: {
        _count: {
          select: { servers: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ nodes });
  } catch (error) {
    console.error("Error fetching nodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch nodes" },
      { status: 500 }
    );
  }
}

// POST /api/nodes - Create a new node
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { name, uid, os, ipAddress, port, username, password } = body;
    
    if (!name || !uid || !os || !ipAddress || !port || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if node with the same UID already exists
    const existingNode = await prisma.node.findFirst({
      where: { uid },
    });

    if (existingNode) {
      return NextResponse.json(
        { error: "A node with this UID already exists" },
        { status: 400 }
      );
    }

    // Generate a secure auth token for the node
    const authToken = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');

    // Create the node
    const node = await prisma.node.create({
      data: {
        name,
        uid,
        os: os as OperatingSystem,
        ipAddress,
        port,
        // Add explicit type casting for Prisma to recognize these fields
        ...(username && { username }),
        ...(password && { password }),
        description: body.description || "",
        status: "OFFLINE", // Default status
        authToken, // Add the generated auth token
      },
    });

    // Remove password from response for security but include authToken
    const nodeResponse = {
      ...node,
      password: undefined
    };

    return NextResponse.json(
      { node: nodeResponse, message: "Node created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating node:", error);
    return NextResponse.json(
      { error: "Failed to create node" },
      { status: 500 }
    );
  }
}
