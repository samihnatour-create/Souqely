"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Palette // Added for the Design Tab
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/design", label: "Design Store", icon: Palette }, // New Tab
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-slate-50/50 lg:block w-64 h-screen font-sans sticky top-0">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6 shrink-0">
          <Link className="flex items-center gap-2" href="/dashboard">
            {/* Using font-bold instead of font-black for a cleaner look */}
            <span className="text-xl font-bold tracking-tighter text-blue-600">Souqely</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid items-start px-4 text-sm font-semibold gap-1">
            {sidebarLinks.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  )}
                  href={link.href}
                >
                  <link.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t shrink-0">
          <form action={signOut}>
            <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}