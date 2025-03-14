"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { isAdmin, isUser } from "@/lib/client-auth";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ("ADMIN" | "USER")[];
  fallback?: ReactNode;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGuardProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  
  const hasRequiredRole = allowedRoles.some(role => {
    if (role === "ADMIN") return isAdmin(userRole);
    if (role === "USER") return isUser(userRole);
    return false;
  });

  if (!session || !hasRequiredRole) {
    return fallback;
  }

  return <>{children}</>;
}

export function AdminOnly({ 
  children, 
  fallback = null 
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function UserOnly({ 
  children, 
  fallback = null 
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["USER"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
