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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Verify server exists
    const server = await prisma.server.findUnique({
      where: { id },
      select: { id: true, name: true }
    });

    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    // Build filter
    const filter: any = {
      serverId: id,
    };

    // Add search if provided
    if (search) {
      filter.OR = [
        { type: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
        { status: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.serverEvent.count({
      where: filter,
    });

    // Get events with pagination
    const events = await prisma.serverEvent.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching server events:", error);
    return NextResponse.json(
      { error: "Failed to fetch server events", details: error.message },
      { status: 500 }
    );
  }
}
