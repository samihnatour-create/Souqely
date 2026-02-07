"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, LayoutGrid, List } from "lucide-react";

interface FilterBarProps {
    view: "grid" | "list";
    setView: (view: "grid" | "list") => void;
    onSearch: (val: string) => void;
    onFilterChange: (key: string, value: string) => void;
    categories?: string[];
    type: "products" | "orders";
}

export function FilterBar({ view, setView, onSearch, onFilterChange, categories, type }: FilterBarProps) {
    return (
        <div className="flex flex-col gap-3 mb-6 font-jakarta">
            {/* ROW 1: SEARCH */}
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder={type === "products" ? "Search items..." : "Search orders..."}
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-slate-200 bg-white font-medium shadow-sm"
                />
            </div>

            {/* ROW 2: FILTERS & TOGGLE (Scrollable) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">

                {type === "products" && (
                    <>
                        <Select onValueChange={(v) => onFilterChange("category", v)}>
                            <SelectTrigger className="min-w-[140px] h-10 rounded-lg bg-white font-bold border-slate-200 shadow-sm text-xs md:text-sm">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Items</SelectItem>
                                {categories?.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(v) => onFilterChange("stock", v)}>
                            <SelectTrigger className="min-w-[120px] h-10 rounded-lg bg-white font-bold border-slate-200 shadow-sm text-xs md:text-sm">
                                <SelectValue placeholder="Stock" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stock</SelectItem>
                                <SelectItem value="in_stock">In Stock</SelectItem>
                                <SelectItem value="out_of_stock">Sold Out</SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                )}

                {type === "orders" && (
                    <Select onValueChange={(v) => onFilterChange("status", v)}>
                        <SelectTrigger className="min-w-[150px] h-10 rounded-lg bg-white font-bold border-slate-200 shadow-sm text-xs md:text-sm">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                <div className="flex border rounded-lg p-1 bg-white h-10 items-center ml-auto shrink-0 shadow-sm border-slate-200">
                    <Button
                        variant={view === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setView("grid")}
                        className="rounded-md h-8 w-8 p-0"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={view === "list" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setView("list")}
                        className="rounded-md h-8 w-8 p-0"
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}