"use client";

import React, { useState } from "react";
import { DashboardCard } from "./DashboardCard";
import { TestTube2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/client-auth";

export default function TestNotificationsPanel() {
  const { data: session } = useSession();
  const [type, setType] = useState<"INFO" | "SUCCESS" | "WARNING" | "ERROR">("INFO");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // If the user is not an admin, don't render this component
  if (!isAdmin(session?.user?.role)) {
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          message,
          link: link || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`Notification sent successfully!`);
        // Clear form
        setMessage("");
        setLink("");
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardCard 
      title="Test Notifications" 
      icon={<TestTube2 className="h-5 w-5" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Notification Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            required
          >
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Message
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Enter notification message"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Link (optional)
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="e.g., /servers/1"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? "Sending..." : "Send Test Notification"}
          </button>
        </div>
        
        {result && (
          <div className={`p-3 rounded-md ${result.startsWith("Error") ? "bg-red-900/30 text-red-400" : "bg-green-900/30 text-green-400"}`}>
            {result}
          </div>
        )}
      </form>
    </DashboardCard>
  );
}
