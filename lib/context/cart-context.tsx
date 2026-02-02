"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    maxStock?: number;
    variantId?: string;
    variantName?: string;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (cartItemId: string) => void; // Using a unique key
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    openCart: () => void;
    closeCart: () => void; // Added for completeness
    isCartOpen: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

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
        // 🛡️ Ensure quantity is a valid number before doing anything
        const safeQuantity = isNaN(newItem.quantity) || newItem.quantity < 1 ? 1 : newItem.quantity;

        setItems((current) => {
            const existingIndex = current.findIndex(
                (item) => item.id === newItem.id && item.variantId === newItem.variantId
            );

            if (existingIndex > -1) {
                const updatedItems = [...current];
                const existingItem = updatedItems[existingIndex];

                updatedItems[existingIndex] = {
                    ...existingItem,
                    // 🛡️ Add safe quantities together
                    quantity: (existingItem.quantity || 0) + safeQuantity,
                };

                toast.success(`Updated ${newItem.name} quantity`);
                return updatedItems;
            }

            toast.success(`Added ${newItem.name} to cart`);
            // 🛡️ Spread and ensure the new item has the safe quantity
            return [...current, { ...newItem, quantity: safeQuantity }];
        });
    };

    // 🔴 FIX: We need a way to distinguish variants when removing/updating
    // It's best to use a combination of ID and variantId as the key
    const removeItem = (cartItemId: string) => {
        setItems((current) => current.filter((item) => {
            const uniqueKey = item.variantId ? `${item.id}-${item.variantId}` : item.id;
            return uniqueKey !== cartItemId;
        }));
        toast.error("Item removed");
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((current) =>
            current.map((item) => {
                const uniqueKey = item.variantId ? `${item.id}-${item.variantId}` : item.id;
                return uniqueKey === cartItemId ? { ...item, quantity } : item;
            })
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
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                openCart,
                closeCart,
                isCartOpen
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};