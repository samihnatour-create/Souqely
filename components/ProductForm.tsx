"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase-browser"; // <--- Correct Browser Client
import { Store } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Plus, X, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import VariantManager, { VariantRow } from "./variant-manager"; // <--- Ensure this file exists

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price_usd: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
  status: z.enum(["active", "draft"]).default("active"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  store: Store;
  initialData?: any;
  initialVariants?: VariantRow[]; // <--- Props for Edit Mode
}

export default function ProductForm({ store, initialData, initialVariants = [] }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(
    initialData?.main_image_url ? [initialData.main_image_url] : []
  );

  // State for Variants (Initialized from DB data if editing)
  const [variants, setVariants] = useState<VariantRow[]>(initialVariants);

  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!initialData;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      price_usd: initialData?.price_usd || 0,
      stock: initialData?.stock || 0,
      status: initialData?.active ? "active" : "draft",
    },
  });

  const price_usd = watch("price_usd");

  // --- IMAGE HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (previews.length + newFiles.length > 5) {
        toast.error("Max 5 images allowed.");
        return;
      }
      setImages([...images, ...newFiles]);
      setPreviews([...previews, ...newFiles.map(file => URL.createObjectURL(file))]);
    }
  };

  const removeImage = (index: number) => {
    const isNewFile = index >= (previews.length - images.length);
    if (isNewFile) {
      const fileIndex = index - (previews.length - images.length);
      const newImages = [...images];
      newImages.splice(fileIndex, 1);
      setImages(newImages);
    }
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  // --- SUBMIT HANDLER ---
  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      let main_image_url = initialData?.main_image_url || null;
      const uploadedImageUrls: string[] = [];

      // 1. Upload Images
      if (images.length > 0) {
        setUploading(true);
        for (const image of images) {
          const fileName = `${Math.random().toString(36).substring(2)}`;
          const filePath = `${store.owner_id}/${fileName}`;
          const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, image);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(filePath);
            uploadedImageUrls.push(publicUrl);
          }
        }
        setUploading(false);
      }

      // Determine Main Image URL
      if (uploadedImageUrls.length > 0) {
        if (!main_image_url || previews.length === images.length) {
          main_image_url = uploadedImageUrls[0];
        }
      }
      if (previews.length === 0) main_image_url = null;

      let productId = initialData?.id;

      // 2. Insert or Update Parent Product
      if (isEditMode) {
        const { error } = await supabase
          .from("products")
          .update({
            name: data.name,
            description: data.description,
            category: data.category,
            price_usd: data.price_usd,
            stock: data.stock,
            active: data.status === "active",
            main_image_url: main_image_url,
          })
          .eq("id", productId);

        if (error) throw error;
      } else {
        const { data: product, error } = await supabase
          .from("products")
          .insert({
            store_id: store.id,
            name: data.name,
            description: data.description,
            category: data.category,
            price_usd: data.price_usd,
            stock: data.stock,
            active: data.status === "active",
            main_image_url: main_image_url,
            currency: "USD",
          })
          .select()
          .single();

        if (error) throw error;
        productId = product.id; // Capture ID for new product
      }

      // 3. HANDLE VARIANTS (Wipe & Replace Strategy)
      if (productId) {
        // A. Delete ALL old variants for this product to prevent duplicates
        const { error: deleteError } = await supabase
          .from("product_variants")
          .delete()
          .eq("product_id", productId);

        if (deleteError) throw deleteError;

        // B. Insert current list of variants
        if (variants.length > 0) {
          const variantsPayload = variants.map(v => ({
            product_id: productId,
            name: v.name,
            attributes: v.attributes,
            price_usd: v.price_usd,
            stock: v.stock
          }));

          const { error: varError } = await supabase
            .from("product_variants")
            .insert(variantsPayload);

          if (varError) throw varError;
        }
      }

      if (isEditMode) {
        toast.success("Product updated!");
        router.refresh();
        router.push("/dashboard/products");
      } else {
        setSuccess(true);
      }

    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error(error.message || "Failed to save.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => window.location.reload();

  if (success && !isEditMode) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
          <h2 className="text-2xl font-bold">Product Created!</h2>
          <Button onClick={() => router.push("/dashboard/products")}>View All Products</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Product" : "Add New Product"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update details & variants." : "Create a new product."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">

            {/* IMAGES */}
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="grid grid-cols-5 gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded border bg-gray-50 group">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center border-2 border-dashed rounded aspect-square hover:bg-slate-50">
                    <Plus className="h-5 w-5 text-gray-400" />
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </div>

            {/* BASIC INFO */}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input {...register("category")} placeholder="e.g. Shirts" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} />
            </div>

            {/* PRICING & STOCK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
              <div className="space-y-2">
                <Label>Base Price (USD)</Label>
                <Input type="number" step="0.01" {...register("price_usd")} />
              </div>
              <div className="space-y-2">
                <Label>Base/Default Stock</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="number" className="pl-9" {...register("stock")} />
                </div>
                <p className="text-[10px] text-muted-foreground">Used if no variants are set.</p>
              </div>
            </div>

            {/* VARIANT MANAGER */}
            <VariantManager
              basePrice={price_usd || 0}
              initialVariants={variants}
              onVariantsChange={setVariants}
            />

            <div className="space-y-2">
              <Label>Status</Label>
              <Select onValueChange={(val: "active" | "draft") => setValue("status", val)} defaultValue={watch("status")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </CardContent>
          <CardFooter className="flex gap-3">
            <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" className="w-full" disabled={isLoading || uploading}>
              {isLoading || uploading ? <Loader2 className="animate-spin" /> : (isEditMode ? "Update" : "Create")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}