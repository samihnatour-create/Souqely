"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// Added 'Palette' icon for the Design tab
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  // New Design Tab added here
  { href: "/dashboard/design", label: "Store Design", icon: Palette },
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
      <SheetContent side="left" className="w-[80%] p-0 bg-white">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6 shrink-0">
            <Link className="font-jakarta font-[800] text-blue-600 tracking-tighter text-3xl" href="/dashboard" onClick={() => setOpen(false)}>
              SOUQELY
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
                      "flex items-center gap-3 rounded-lg px-3 py-3 transition-all font-bold",
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    <link.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t shrink-0 bg-slate-50">
            <form action={signOut}>
              <Button variant="outline" className="w-full justify-start gap-2 font-bold border-slate-200 hover:bg-white hover:text-red-600 transition-colors">
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