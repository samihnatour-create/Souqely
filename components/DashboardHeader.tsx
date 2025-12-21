import Link from "next/link";
import MobileSidebar from "@/components/MobileSidebar";

export default function DashboardHeader() {
  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <MobileSidebar />
      <div className="w-full flex-1">
        <h1 className="font-semibold text-lg">Dashboard</h1>
      </div>
    </header>
  );
}
