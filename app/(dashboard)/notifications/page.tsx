import React from "react";
import { requireAuth } from "@/lib/auth";
import NotificationsClient from "@/components/dashboard/NotificationsClient";

export default async function NotificationsPage() {
  // Ensure user is authenticated (this runs on the server)
  await requireAuth();
  
  // Render the client component
  return <NotificationsClient />;
}
