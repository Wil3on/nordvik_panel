import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const profileImage = formData.get("profileImage") as File | null;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
    };

    // If changing password, verify current password
    if (newPassword && currentPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password || ""
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Handle profile image upload
    if (profileImage) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const fileName = `${uuidv4()}_${profileImage.name.replace(/\s/g, "_")}`;
      const publicDir = path.join(process.cwd(), "public");
      const uploadDir = path.join(publicDir, "uploads");
      const filePath = path.join(uploadDir, fileName);
      const relativePath = `/uploads/${fileName}`;

      // Ensure uploads directory exists
      try {
        await writeFile(filePath, buffer);
        updateData.profilePicture = relativePath;
      } catch (error) {
        console.error("Error saving profile image:", error);
        return NextResponse.json(
          { message: "Failed to save profile image" },
          { status: 500 }
        );
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
