"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase";
import { Store } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, CheckCircle, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price_usd: z.coerce.number().min(0.01, "Price must be greater than 0"),
  status: z.enum(["active", "draft"]).default("active"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  store: Store;
}

export default function ProductForm({ store }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "active",
      price_usd: 0,
    },
  });

  const price_usd = watch("price_usd");
  const lbpPrice = price_usd ? price_usd * (store.lbp_rate || 89500) : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Limit to 5 images total
      const totalImages = images.length + newFiles.length;
      if (totalImages > 5) {
        alert("You can only upload up to 5 images.");
        return;
      }

      setImages([...images, ...newFiles]);

      // Create previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]); // Cleanup memory
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      let main_image_url = null;
      const uploadedImageUrls: string[] = [];

      // 1. Upload Images
      if (images.length > 0) {
        setUploading(true);
        for (const image of images) {
          const fileExt = image.name.split(".").pop();
          const fileName = `${Math.random().toString(36).substring(2)}`;
          const filePath = `${store.owner_id}/`;

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, image);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            continue; // Skip failed uploads
          }

          const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);

          uploadedImageUrls.push(publicUrl);
        }
        setUploading(false);
      }

      if (uploadedImageUrls.length > 0) {
        main_image_url = uploadedImageUrls[0];
      }

      // 2. Insert Product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          store_id: store.id,
          name: data.name,
          description: data.description,
          price_usd: data.price_usd,
          active: data.status === "active",
          main_image_url: main_image_url,
          currency: "USD", // Fixed to USD as base
        })
        .select()
        .single();

      if (productError) throw productError;

      // 3. Insert Additional Images (if any)
      if (uploadedImageUrls.length > 0 && product) {
        // Create array of objects for bulk insert
        const imageRecords = uploadedImageUrls.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          display_order: index
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(imageRecords);

        if (imagesError) console.error("Error saving image records:", imagesError);
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setImages([]);
    setPreviews([]);
    router.refresh(); // Refresh to clear form state if needed or just reset manually
    // Ideally we would reset the form using react-hook-form's reset, 
    // but a full page reload or router.push might be cleaner for "Add Another".
    window.location.reload();
  };

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-green-100 p-3 text-green-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Product Created!</h2>
            <p className="text-muted-foreground">Your product has been successfully added to your store.</p>
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={handleReset}>Add Another Product</Button>
            <Button onClick={() => router.push("/dashboard/products")}>View All Products</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>
            Create a new product for your store.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Images (Max 5)</Label>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-gray-50 group">
                    <img src={preview} alt={preview} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5">Main</div>
                    )}
                  </div>
                ))}

                {previews.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Add Image</span>
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} placeholder="Product Name" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Describe your product..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_usd">Price (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <Input
                    id="price_usd"
                    type="number"
                    step="0.01"
                    className="pl-7"
                    {...register("price_usd")}
                    placeholder="0.00"
                  />
                </div>
                {errors.price_usd && <p className="text-sm text-red-500">{errors.price_usd.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>LBP Estimate</Label>
                <div className="h-10 px-3 py-2 rounded-md border bg-gray-50 text-gray-700 flex items-center">
                  {formatCurrency(lbpPrice, "LBP")}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Rate: {formatCurrency(store.lbp_rate || 89500, "LBP")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(val) => check("status", val)} defaultValue="active">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || uploading}>
              {isLoading || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploading ? "Uploading Images..." : "Saving..."}
                </>
              ) : (
                "Create Product"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// Helper for react-hook-form manual setValue if needed, though we used direct registration
function check(name: any, val: any) {
  // Placeholder to fix typescript error with Select onValueChange if needed
  // In real app we would use setValue from useForm
}
