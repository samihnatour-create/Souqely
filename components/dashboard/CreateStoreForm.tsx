"use client";

import { useFormState } from "react-dom";
import { createStore } from "@/lib/actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Store, Upload, Loader2, Image as ImageIcon } from "lucide-react";

const STEPS = [
    {
        id: "name",
        label: "Store Name",
        question: "What is the name of your store?",
        type: "text",
        placeholder: "e.g. Beirut Fashion",
    },
    {
        id: "business_stage",
        label: "Business Stage",
        question: "Is this a new business or already running?",
        type: "select",
        options: [
            "Just an idea",
            "Brand new (launching soon)",
            "Already selling (Social Media)",
            "Established Physical Store",
        ],
    },
    {
        id: "product_category",
        label: "Category",
        question: "What type of products do you sell?",
        type: "select",
        options: [
            "Fashion & Apparel",
            "Electronics",
            "Home & Decor",
            "Beauty & Cosmetics",
            "Food & Beverage",
            "Other",
        ],
    },
    {
        id: "catalog_size",
        label: "Catalog Size",
        question: "Roughly how many products will you list?",
        type: "select",
        options: ["1-10", "11-50", "50-100", "100+"],
    },
    {
        id: "social_handle",
        label: "Social Media",
        question: "What is your main Instagram or TikTok handle?",
        type: "text",
        placeholder: "@mybusiness",
        optional: true,
    },
    {
        id: "branding",
        label: "Branding",
        question: "Add your Logo & Brand Color",
        type: "custom_branding",
    }
];

const initialState = { error: "" };

export default function CreateStoreForm() {
    const [state, formAction] = useFormState(createStore, initialState);
    const [currentStep, setCurrentStep] = useState(0);

    // --- COLOR & FILE LOGIC ---
    const [primaryColor, setPrimaryColor] = useState("#2563eb");
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Create a local preview URL
        const objectUrl = URL.createObjectURL(file);
        setLogoPreview(objectUrl);
        setIsExtracting(true);

        // 2. Extract color from the file blob
        try {
            const color = await extractColorFromUrl(objectUrl);
            if (color) setPrimaryColor(color);
        } catch (err) {
            console.log("Could not extract color");
        } finally {
            setIsExtracting(false);
        }
    };
    // -------------------------

    const progress = ((currentStep + 1) / STEPS.length) * 100;

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-lg shadow-xl border-slate-200">
                <form action={formAction}>
                    <CardHeader className="text-center space-y-4 pb-2">
                        {/* Dynamic Logo in Header */}
                        <div className="mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-2 overflow-hidden shadow-sm transition-all duration-500" style={{ backgroundColor: primaryColor }}>
                            {logoPreview ? (
                                <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Store className="w-8 h-8 text-white/90" />
                            )}
                        </div>

                        <CardTitle className="text-2xl font-bold tracking-tight">Setup your Store</CardTitle>
                        <CardDescription>Step {currentStep + 1} of {STEPS.length}</CardDescription>

                        <div className="w-full pt-2">
                            <Progress value={progress} className="h-2" />
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6 min-h-[220px]">
                        {STEPS.map((step, index) => (
                            <div
                                key={step.id}
                                className={index === currentStep ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}
                            >
                                <div className="space-y-6">
                                    <Label className="text-xl font-medium text-gray-900 block mb-2">
                                        {step.question}
                                    </Label>

                                    {/* 1. TEXT INPUTS */}
                                    {step.type === "text" && (
                                        <Input
                                            id={step.id}
                                            name={step.id}
                                            placeholder={step.placeholder}
                                            required={!step.optional}
                                            className="h-12 text-lg"
                                            autoFocus={index === currentStep}
                                        />
                                    )}

                                    {/* 2. SELECT INPUTS */}
                                    {step.type === "select" && (
                                        <Select name={step.id} required={index === currentStep}>
                                            <SelectTrigger className="h-12 text-lg">
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {step.options?.map((option) => (
                                                    <SelectItem key={option} value={option} className="text-base py-3">
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}

                                    {/* 3. CUSTOM BRANDING STEP (Updated for File Upload) */}
                                    {step.type === "custom_branding" && (
                                        <div className="space-y-6">

                                            {/* File Upload Box */}
                                            <div className="space-y-3">
                                                <Label htmlFor="logo" className="text-sm text-muted-foreground">Upload Logo (Optional)</Label>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative flex-1">
                                                        <Input
                                                            id="logo"
                                                            name="logo"
                                                            type="file"
                                                            accept="image/*"
                                                            className="h-12 pt-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                            onChange={handleFileChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Color Picker */}
                                            <div className="space-y-2">
                                                <Label htmlFor="primary_color" className="text-sm text-muted-foreground">Primary Brand Color</Label>
                                                <div className="flex gap-4 items-center p-4 border rounded-lg bg-slate-50/50">
                                                    <div className="relative">
                                                        <Input
                                                            type="color"
                                                            id="primary_color"
                                                            name="primary_color"
                                                            className="w-16 h-12 p-1 cursor-pointer"
                                                            value={primaryColor}
                                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">Brand Theme</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {isExtracting ? (
                                                                <span className="flex items-center gap-1 text-blue-600">
                                                                    <Loader2 className="w-3 h-3 animate-spin" /> Detecting colors...
                                                                </span>
                                                            ) : "Pick manually or use logo color."}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>

                    {state?.error && (
                        <div className="px-6 pb-4">
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex items-center gap-2">
                                <span className="font-bold">Error:</span> {state.error}
                            </div>
                        </div>
                    )}

                    <CardFooter className="flex justify-between border-t pt-6 bg-slate-50/50 rounded-b-xl">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="text-slate-500"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>

                        {currentStep === STEPS.length - 1 ? (
                            <Button
                                type="submit"
                                className="px-8 transition-colors duration-300"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Launch Store
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="px-8 transition-colors duration-300"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Next <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

// --- HELPER FUNCTION (Color Extraction) ---
function extractColorFromUrl(url: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(null);

            canvas.width = 1;
            canvas.height = 1;
            ctx.drawImage(img, 0, 0, 1, 1);

            // Safe data access
            const data = ctx.getImageData(0, 0, 1, 1).data;
            const r = data[0];
            const g = data[1];
            const b = data[2];

            const hex = "#" + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            }).join("");

            resolve(hex);
        };

        img.onerror = () => reject(null);
    });
}