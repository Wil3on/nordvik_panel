"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  Server, 
  GamepadIcon, 
  HardDrive, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  User
} from "lucide-react";
import { isAdmin } from "@/lib/client-auth";
import NotificationDropdown from "@/components/ui/NotificationDropdown";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  // Define navigation items with role requirements
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "USER"] },
    { name: "Servers", href: "/servers", icon: Server, roles: ["ADMIN", "USER"] },
    { name: "Games", href: "/games", icon: GamepadIcon, roles: ["ADMIN", "USER"] },
    { name: "Nodes", href: "/nodes", icon: HardDrive, roles: ["ADMIN"] },
    { name: "Users", href: "/users", icon: Users, roles: ["ADMIN"] },
    { 
      name: "Settings", 
      href: "/settings", 
      icon: Settings, 
      roles: ["ADMIN", "USER"],
      subItems: [
        { name: "General", href: "/settings/general", roles: ["ADMIN", "USER"] },
        { name: "API Keys", href: "/settings/api-keys", roles: ["ADMIN", "USER"] }
      ]
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Nordvik Panel"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold">Nordvik</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col h-[calc(100vh-4rem)] p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              // Check if the user has permission to see this navigation item
              const hasPermission = item.roles.includes(userRole as string);
              
              if (!hasPermission) return null;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                  
                  {/* Render sub-items if they exist and the parent is active */}
                  {item.subItems && isActive && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        // Check if the user has permission for this sub-item
                        const hasSubPermission = subItem.roles.includes(userRole as string);
                        
                        if (!hasSubPermission) return null;
                        
                        return (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                                isSubActive
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                              }`}
                            >
                              <span>{subItem.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-auto">
            <Link
              href="/profile"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors mb-2 ${
                pathname === "/profile"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Empty div to push notification and profile to the right */}
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <div className="relative">
                <Link href="/profile" className="flex items-center space-x-2 rounded-full bg-gray-800 p-1 pr-3 text-sm hover:bg-gray-700 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium overflow-hidden">
                    {session?.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        width={32} 
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{session?.user?.name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span>{session?.user?.name || "User"}</span>
                    <span className="text-xs text-gray-400">
                      {isAdmin(userRole) ? "Administrator" : "User"}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-4 px-4 sm:px-6 text-center text-sm text-gray-500">
          <p> 2024 Nordvik Panel. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
