"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function FilterBarWrapper({ type, categories }: { type: "products" | "orders", categories?: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current state from URL
    const view = (searchParams.get("view") as "grid" | "list") || "list";

    const setView = (v: "grid" | "list") => {
        // 🟢 FIX: Use .toString() to create a mutable copy
        const params = new URLSearchParams(searchParams.toString());
        params.set("view", v);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const onSearch = useDebouncedCallback((val: string) => {
        // 🟢 FIX: Use .toString()
        const params = new URLSearchParams(searchParams.toString());
        if (val) params.set("q", val);
        else params.delete("q");
        router.replace(`?${params.toString()}`, { scroll: false });
    }, 300);

    const onFilterChange = (key: string, val: string) => {
        // 🟢 FIX: Use .toString()
        const params = new URLSearchParams(searchParams.toString());
        if (val && val !== "all") params.set(key, val);
        else params.delete(key);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <FilterBar
            view={view}
            setView={setView}
            onSearch={onSearch}
            onFilterChange={onFilterChange}
            type={type}
            categories={categories}
        />
    );
}