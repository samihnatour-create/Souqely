"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Update the component to accept 'categories' as a prop
export default function ProductFilter({ categories }: { categories: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get("category") || "all";

    const handleFilterChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete("category");
        } else {
            params.set("category", value);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="w-[200px]">
            <Select value={currentFilter} onValueChange={handleFilterChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.length === 0 ? (
                        <SelectItem value="none" disabled>No categories found</SelectItem>
                    ) : (
                        categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}