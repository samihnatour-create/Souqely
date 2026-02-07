"use client";

import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StoreTopFilterProps {
    categories: string[];
    activeCategory: string;
    onSelectCategory: (cat: string) => void;
    onSearch: (query: string) => void;
    onSort: (sort: string) => void;
    totalProducts: number;
}

export function StoreTopFilter({
    categories,
    activeCategory,
    onSelectCategory,
    onSearch,
    onSort,
    totalProducts,
}: StoreTopFilterProps) {
    return (
        <div className="w-full flex flex-col gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">

            {/* 🟢 TOP ROW: Search & Controls (Minimalist) */}
            <div className="flex items-center justify-between gap-4">

                {/* Search - Looks like a text field, blends in */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="Search products..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="pl-10 pr-4 h-12 md:h-10 text-base md:text-sm border-0 border-b border-slate-200 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-black transition-all placeholder:text-slate-400 font-medium"
                    />
                </div>

                {/* Sort & Filter Toggle (Desktop) */}
                <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-slate-400">
                        {totalProducts} Items
                    </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-bold hover:opacity-70 transition-opacity outline-none">
                            Sort by <ChevronDown className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onSort("newest")}>Newest Arrivals</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSort("price_asc")}>Price: Low to High</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSort("price_desc")}>Price: High to Low</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* 🟢 BOTTOM ROW: Category Tabs (Scrollable & Clean) */}
            <div className="w-full overflow-x-auto no-scrollbar border-b border-slate-100">
                <div className="flex items-center gap-8 min-w-max pb-[1px]">
                    <button
                        onClick={() => onSelectCategory("all")}
                        className={cn(
                            "text-sm font-bold uppercase tracking-wider pb-3 border-b-2 transition-all",
                            activeCategory === "all"
                                ? "border-black text-black"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                        )}
                    >
                        All
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className={cn(
                                "text-sm font-bold uppercase tracking-wider pb-3 border-b-2 transition-all",
                                activeCategory === cat
                                    ? "border-black text-black"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}