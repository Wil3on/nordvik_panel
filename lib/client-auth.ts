"use client";

import { useSession } from "next-auth/react";

// Client-side auth utilities that don't rely on bcrypt
export function useIsAdmin() {
  const { data: session } = useSession();
  return session?.user?.role === "ADMIN";
}

export function useIsUser() {
  const { data: session } = useSession();
  return session?.user?.role === "USER";
}

// These are client-side versions of the server-side functions
export function isAdmin(role?: string | null) {
  return role === "ADMIN";
}

export function isUser(role?: string | null) {
  return role === "USER";
}
