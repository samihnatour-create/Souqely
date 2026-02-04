"use server";

import { createClient } from "@/lib/supabase-server";

export async function getTopProducts(storeId: string) {
    const supabase = createClient();

    // 1. Fetch Order Items with their parent Order status
    const { data: items, error } = await supabase
        .from("order_items")
        .select(`
      quantity,
      price_at_purchase,
      product_id,
      products (
        name,
        main_image_url
      ),
      orders!inner (
        status,
        store_id
      )
    `)
        .eq("orders.store_id", storeId);

    if (error) {
        console.error("Error fetching top products:", error);
        return [];
    }

    if (!items || items.length === 0) return [];

    // 2. Aggregate Data
    const productStats: Record<string, any> = {};

    items.forEach((item: any) => {
        const pid = item.product_id;

        // Initialize if new
        if (!productStats[pid]) {
            productStats[pid] = {
                id: pid,
                // Fallback to "Unknown" if product was deleted but order item remains
                name: item.products?.name || "Unknown Product",
                image: item.products?.main_image_url || null,
                sales: 0,
                revenue: 0,
            };
        }

        // Add stats
        const qty = item.quantity || 0;
        const price = item.price_at_purchase || 0; // 🟢 FIXED COLUMN NAME

        productStats[pid].sales += qty;
        productStats[pid].revenue += price * qty;
    });

    // 3. Sort by Revenue
    return Object.values(productStats)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);
}

export async function getSalesChartData(storeId: string, range: "day" | "week" | "month" | "year") {
    const supabase = createClient();
    const now = new Date();
    let startDate = new Date();

    // Set start dates
    switch (range) {
        case "day":
            startDate.setHours(0, 0, 0, 0);
            break;
        case "week":
            startDate.setDate(now.getDate() - 7);
            break;
        case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
        case "year":
            startDate.setFullYear(now.getFullYear() - 1);
            break;
    }

    // Fetch Orders
    const { data: orders, error } = await supabase
        .from("orders")
        .select("created_at, total_usd") // 🟢 FIXED COLUMN NAME
        .eq("store_id", storeId)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Chart Data Error:", error);
        return [];
    }

    if (!orders || orders.length === 0) return [];

    // Group Data
    const groupedData: Record<string, number> = {};

    orders.forEach((order) => {
        const date = new Date(order.created_at);
        let key = "";

        // Formatting keys based on range
        if (range === "day") {
            key = date.toLocaleTimeString("en-US", { hour: "2-digit", hour12: false });
        } else if (range === "week" || range === "month") {
            key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } else {
            key = date.toLocaleDateString("en-US", { month: "short" });
        }

        groupedData[key] = (groupedData[key] || 0) + (order.total_usd || 0); // 🟢 FIXED COLUMN NAME
    });

    // Convert to Array for Recharts
    return Object.entries(groupedData).map(([name, total]) => ({ name, total }));
}