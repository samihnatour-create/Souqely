"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] p-0">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6 shrink-0">
            <Link className="flex items-center gap-2 font-semibold" href="/dashboard" onClick={() => setOpen(false)}>
              <span className="text-lg tracking-tight">Souqely</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-4 text-sm font-medium gap-2">
              {sidebarLinks.map((link) => {
                const isActive = link.exact 
                  ? pathname === link.href 
                  : pathname.startsWith(link.href);
                
                return (
                  <Link
                    key={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 transition-all",
                      isActive 
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                    )}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t shrink-0">
            <form action={signOut}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
