// Mark this file as server-only to prevent it from being bundled with client code
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Server-side auth utilities
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  return user;
}

// These utility functions don't use any server-only features and can be safely used
// in both server and client components
export function isAdmin(role?: string | null) {
  return role === "ADMIN";
}

export function isUser(role?: string | null) {
  return role === "USER";
}
