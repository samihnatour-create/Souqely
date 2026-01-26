"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export type CartItem = {
    id: string; // Product ID
    name: string;
    price: number;
    image: string;
    quantity: number;
    maxStock?: number;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Load Cart from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("souqely_cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // 2. Save Cart to LocalStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("souqely_cart", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    // --- ACTIONS ---

    const addItem = (newItem: CartItem) => {
        setItems((current) => {
            const existing = current.find((item) => item.id === newItem.id);
            if (existing) {
                toast.success("Updated quantity in cart");
                return current.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            toast.success("Added to cart");
            return [...current, newItem];
        });
    };

    const removeItem = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
        toast.error("Item removed");
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem("souqely_cart");
    };

    // --- CALCULATIONS ---
    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};