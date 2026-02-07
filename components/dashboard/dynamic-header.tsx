"use client";

import { usePathname } from "next/navigation";

export function DynamicHeader() {
    const pathname = usePathname();

    // Logic to transform "/dashboard/products" into "Products"
    const getTitle = () => {
        const segments = pathname.split("/");
        const lastSegment = segments[segments.length - 1];

        if (lastSegment === "dashboard") return "Overview";

        // Capitalize and replace hyphens with spaces (e.g., "design-store" -> "Design Store")
        return lastSegment
            .charAt(0)
            .toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");
    };

    return (
        <div className="flex items-center gap-3">
            {/* Subtle Divider between Sidebar and Title */}
            <div className="h-4 w-[1px] bg-slate-200 hidden md:block mr-2" />
            <h2 className="text-lg font-semibold tracking-tight text-slate-700 font-jakarta">
                {getTitle()}
            </h2>
        </div>
    );
}