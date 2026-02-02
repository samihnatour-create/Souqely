"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/context/cart-context";
import { toast } from "sonner";
import { X } from "lucide-react";
import Image from "next/image";

interface VariantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  variants: any[];
  storeColor: string;
}

export default function VariantDrawer({ isOpen, onClose, product, variants, storeColor }: VariantDrawerProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const { addItem, openCart } = useCart();

  // Reset selection when drawer opens
  useEffect(() => {
    if (isOpen) setSelectedVariant(null);
  }, [isOpen]);

  const handleConfirm = () => {
    if (!selectedVariant) return;

    addItem({
      id: product.id,
      name: product.name,
      price: selectedVariant.price_usd || product.price_usd,
      image: product.main_image_url,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      quantity: 1,
    });

    toast.success("Added to cart");
    onClose();
    setTimeout(() => openCart(), 300); // Open cart after a short delay
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent
        // 🛡️ 1. STOP BUBBLING ON THE WHOLE DRAWER
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-h-[90vh]"
      >
        <DrawerHeader className="text-left border-b pb-4 relative">
          <DrawerTitle className="text-2xl font-black">{product.name}</DrawerTitle>
          <p className="text-slate-500 text-sm font-medium">Select an option</p>

          {/* Close Button */}
          <DrawerClose asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <div className="p-6 space-y-6">
          {/* Variant Grid */}
          <div className="grid grid-cols-2 gap-3">
            {variants.map((variant) => (
              <button
                key={variant.id}
                // 🛡️ 2. STOP BUBBLING ON VARIANT CLICKS
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariant(variant);
                }}
                disabled={variant.stock <= 0}
                className={`
                  relative h-14 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center
                  ${selectedVariant?.id === variant.id
                    ? "text-white shadow-md scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-100 hover:border-slate-300"
                  }
                  ${variant.stock <= 0 ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}
                `}
                style={selectedVariant?.id === variant.id ? { backgroundColor: storeColor, borderColor: storeColor } : {}}
              >
                {variant.name}
                {variant.stock <= 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-full z-10">
                    SOLD OUT
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Price Preview */}
          {selectedVariant && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-2">
              <span className="text-3xl font-black text-slate-900">
                ${selectedVariant.price_usd || product.price_usd}
              </span>
            </div>
          )}
        </div>

        <DrawerFooter className="border-t p-6">
          <Button
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg"
            style={{ backgroundColor: storeColor }}
            // 🛡️ 3. STOP BUBBLING ON CONFIRM BUTTON
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleConfirm();
            }}
            disabled={!selectedVariant || selectedVariant.stock <= 0}
          >
            {!selectedVariant
              ? "Select an Option"
              : selectedVariant.stock <= 0
                ? "Out of Stock"
                : "Add to Cart"
            }
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}