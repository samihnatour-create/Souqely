"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

export type VariantRow = {
    id?: string;
    name: string;
    attributes: Record<string, string>;
    price_usd: number;
    stock: number;
};

interface VariantManagerProps {
    basePrice: number;
    onVariantsChange: (variants: VariantRow[]) => void;
    initialVariants?: VariantRow[];
}

export default function VariantManager({ basePrice, onVariantsChange, initialVariants = [] }: VariantManagerProps) {
    // 1. Initialize Options (Reconstruct from existing variants if editing)
    const [options, setOptions] = useState<{ name: string; values: string[] }[]>(() => {
        if (initialVariants.length > 0) {
            const extractedOptions: Record<string, Set<string>> = {};
            initialVariants.forEach(v => {
                Object.entries(v.attributes).forEach(([key, val]) => {
                    if (!extractedOptions[key]) extractedOptions[key] = new Set();
                    extractedOptions[key].add(val);
                });
            });
            return Object.entries(extractedOptions).map(([name, valuesSet]) => ({
                name,
                values: Array.from(valuesSet)
            }));
        }
        return [{ name: "Size", values: [] }];
    });

    const [variants, setVariants] = useState<VariantRow[]>(initialVariants);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        onVariantsChange(variants);
    }, [variants, onVariantsChange]);

    // --- ACTIONS ---

    const addOption = () => {
        setOptions([...options, { name: "", values: [] }]);
    };

    const removeOption = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const updateOptionName = (index: number, name: string) => {
        const newOptions = [...options];
        newOptions[index].name = name;
        setOptions(newOptions);
    };

    const addValue = (index: number, val: string) => {
        if (!val || !val.trim()) return;
        const cleanVal = val.trim();
        const newOptions = [...options];
        if (!newOptions[index].values.includes(cleanVal)) {
            newOptions[index].values.push(cleanVal);
            setOptions(newOptions);
        }
    };

    const removeValue = (optIndex: number, valIndex: number) => {
        const newOptions = [...options];
        newOptions[optIndex].values.splice(valIndex, 1);
        setOptions(newOptions);
    };

    const generateCombinations = () => {
        // Sweep pending inputs
        inputRefs.current.forEach((input, idx) => {
            if (input && input.value.trim() !== "") {
                addValue(idx, input.value);
                input.value = "";
            }
        });

        setTimeout(() => {
            setOptions(currentOptions => {
                const validOptions = currentOptions.filter(o => o.name && o.values.length > 0);

                if (validOptions.length === 0) {
                    toast.error("Please add at least one Option and Value.");
                    return currentOptions;
                }

                const combine = (idx: number, current: { name: string; val: string }[]): any[] => {
                    if (idx === validOptions.length) return [current];
                    let result: any[] = [];
                    const opt = validOptions[idx];
                    for (const val of opt.values) {
                        result = result.concat(combine(idx + 1, [...current, { name: opt.name, val }]));
                    }
                    return result;
                };

                const combinations = combine(0, []);

                const newVariants: VariantRow[] = combinations.map(combo => {
                    const name = combo.map((c: any) => c.val).join(" / ");
                    const attributes = combo.reduce((acc: any, curr: any) => ({ ...acc, [curr.name]: curr.val }), {});

                    const existing = variants.find(v => v.name === name);

                    return {
                        id: existing?.id,
                        name,
                        attributes,
                        price_usd: existing ? existing.price_usd : basePrice,
                        stock: existing ? existing.stock : 0
                    };
                });

                setVariants(newVariants);
                return currentOptions;
            });
        }, 50);
    };

    return (
        <div className="space-y-6 border rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase text-slate-500">Product Variants</h3>
            </div>

            <div className="space-y-4">
                {options.map((opt, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border shadow-sm space-y-3">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Option Name (e.g. Color)"
                                value={opt.name}
                                onChange={(e) => updateOptionName(idx, e.target.value)}
                                className="font-bold bg-transparent border-none shadow-none px-0 h-auto focus-visible:ring-0"
                            />
                            {/* 🔴 FIX: Added type="button" */}
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(idx)} disabled={options.length === 1}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                            {opt.values.map((val, vIdx) => (
                                <div key={vIdx} className="bg-slate-900 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                    {val}
                                    <X
                                        className="w-3 h-3 cursor-pointer hover:text-red-400"
                                        onClick={() => removeValue(idx, vIdx)}
                                    />
                                </div>
                            ))}
                            <Input
                                ref={el => { inputRefs.current[idx] = el }}
                                placeholder="Type value & hit Enter"
                                className="w-60 h-9 text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addValue(idx, e.currentTarget.value);
                                        e.currentTarget.value = "";
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value.trim() !== "") {
                                        addValue(idx, e.target.value);
                                        e.target.value = "";
                                    }
                                }}
                            />
                        </div>
                    </div>
                ))}

                <div className="flex gap-2">
                    {/* 🔴 FIX: Added type="button" */}
                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                        <Plus className="w-4 h-4 mr-2" /> Add Option
                    </Button>
                    {/* 🔴 FIX: Added type="button" */}
                    <Button
                        type="button"
                        size="sm"
                        onClick={generateCombinations}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Combinations
                    </Button>
                </div>
            </div>

            {variants.length > 0 && (
                <div className="rounded-md border bg-white overflow-hidden shadow-sm animate-in slide-in-from-bottom-2">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Variant Name</TableHead>
                                <TableHead className="w-32">Price ($)</TableHead>
                                <TableHead className="w-32">Stock</TableHead>
                                <TableHead className="w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {variants.map((variant, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium text-sm">
                                        <span className="bg-slate-100 px-2 py-1 rounded">{variant.name}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="h-8"
                                            value={variant.price_usd}
                                            step="0.01"
                                            onChange={(e) => {
                                                const newVars = [...variants];
                                                newVars[idx].price_usd = parseFloat(e.target.value);
                                                setVariants(newVars);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="h-8"
                                            value={variant.stock}
                                            onChange={(e) => {
                                                const newVars = [...variants];
                                                newVars[idx].stock = parseInt(e.target.value);
                                                setVariants(newVars);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {/* 🔴 FIX: Added type="button" */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                                            onClick={() => {
                                                const newVars = [...variants];
                                                newVars.splice(idx, 1);
                                                setVariants(newVars);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}