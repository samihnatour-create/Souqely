"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { StoreTopFilter } from "@/components/shared/store-top-filter";

export function StoreFilterWrapper({
    categories,
    totalProducts
}: {
    categories: string[],
    totalProducts: number
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeCategory = searchParams.get("category") || "all";

    const handleSearch = useDebouncedCallback((query: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (query) params.set("q", query); else params.delete("q");
        router.push(`?${params.toString()}`, { scroll: false });
    }, 300);

    const handleCategory = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (cat === "all") params.delete("category"); else params.set("category", cat);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSort = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", sort);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        // 🟢 ALIGNMENT FIX: Using max-w-7xl to match the standard grid templates
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 md:mt-12">
            <StoreTopFilter
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={handleCategory}
                onSearch={handleSearch}
                onSort={handleSort}
                totalProducts={totalProducts}
            />
        </div>
    );
}