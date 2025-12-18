import Link from "next/link";
import { Package2 } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <Link className="lg:hidden" href="#">
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="w-full flex-1">
        <h1 className="font-semibold text-lg">Dashboard</h1>
      </div>
    </header>
  );
}
