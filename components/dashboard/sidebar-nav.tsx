"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Server,
  Settings,
  Users,
  Activity,
  Key,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: "Nodes",
    href: "/nodes",
    icon: <Server size={20} />,
  },
  {
    title: "Monitoring",
    href: "/monitoring",
    icon: <Activity size={20} />,
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users size={20} />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings size={20} />,
    children: [
      {
        title: "General",
        href: "/settings/general",
        icon: <Home size={20} />,
      },
      {
        title: "API Keys",
        href: "/settings/api-keys",
        icon: <Key size={20} />,
      },
    ],
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "/settings": true, // Settings menu is open by default
  });

  const toggleItem = (href: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems[item.href];

    return (
      <div key={item.href} className="mb-1">
        <div
          className={cn(
            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
            active
              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800",
            hasChildren ? "cursor-pointer" : ""
          )}
          onClick={hasChildren ? () => toggleItem(item.href) : undefined}
        >
          {hasChildren ? (
            <>
              <div className="flex items-center flex-1">
                <span className="mr-2">{item.icon}</span>
                <span>{item.title}</span>
              </div>
              {isOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </>
          ) : (
            <Link href={item.href} className="flex items-center w-full">
              <span className="mr-2">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(child.href)
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <span className="mr-2">{child.icon}</span>
                <span>{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <div className="p-6">
        <h1 className="text-xl font-bold">Nordvik Panel</h1>
      </div>
      <div className="px-3 py-2">
        <nav className="space-y-1">
          {navItems.map(renderNavItem)}
        </nav>
      </div>
    </div>
  );
}
