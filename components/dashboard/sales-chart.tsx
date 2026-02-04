"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSalesChartData } from "@/lib/dashboard-data"; // Import the server action
import { Loader2 } from "lucide-react";

export function SalesChart({ storeId }: { storeId: string }) {
    const [filter, setFilter] = useState<"day" | "week" | "month" | "year">("week");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const chartData = await getSalesChartData(storeId, filter);
            setData(chartData);
            setLoading(false);
        }
        fetchData();
    }, [filter, storeId]);

    return (
        <Card className="col-span-4 lg:col-span-3 border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-bold text-slate-900">Sales Overview</CardTitle>
                <Select defaultValue="week" onValueChange={(v: any) => setFilter(v)}>
                    <SelectTrigger className="w-[120px] rounded-lg bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="day">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[300px] w-full flex items-center justify-center">
                    {loading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    ) : data.length === 0 ? (
                        <div className="text-slate-400 text-sm">No sales data for this period</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1a56db" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e4e9", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                    itemStyle={{ color: "#1a56db", fontWeight: "bold" }}
                                    formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                                />
                                <Area type="monotone" dataKey="total" stroke="#1a56db" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}