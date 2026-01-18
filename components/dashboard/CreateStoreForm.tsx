"use client";

import { useFormState } from "react-dom";
import { createStore } from "@/lib/actions";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Define the shape of our form data
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
        question: "What is your main Instagram or TikTok handle? (Optional)",
        type: "text",
        placeholder: "@mybusiness",
    },
];

const initialState = { error: "" };

export default function CreateStoreForm() {
    const [state, formAction] = useFormState(createStore, initialState);
    const [currentStep, setCurrentStep] = useState(0);

    // Helper to render a specific field
    const renderField = (step: typeof STEPS[0]) => {
        return (
            <div className="space-y-3">
                <label htmlFor={step.id} className="block text-sm font-medium text-gray-700">
                    {step.question}
                </label>

                {step.type === "text" ? (
                    <Input
                        id={step.id}
                        name={step.id}
                        placeholder={step.placeholder}
                        required={step.id !== "social_handle"}
                        className="w-full"
                    />
                ) : (
                    <Select name={step.id} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            {step.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        );
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        // Optional: Add manual validation logic here if needed
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50/50 p-4">
            <Card className="w-full max-w-2xl shadow-xl">
                <form action={formAction}>
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl md:text-3xl">Welcome to Souqely</CardTitle>
                        <CardDescription>Let's set up your store profile</CardDescription>

                        {/* Mobile Progress Bar (Only shows on mobile) */}
                        <div className="md:hidden mt-4">
                            <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                                Step {currentStep + 1} of {STEPS.length}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="min-h-[300px] md:min-h-0">
                        {/* THE FIX: ONE GRID TO RULE THEM ALL 
                           - On Mobile: We hide all items EXCEPT the current step.
                           - On Desktop: We show ALL items in a grid.
                        */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {STEPS.map((step, index) => {
                                // Logic: Is this field visible?
                                // Mobile: Only if it matches currentStep
                                // Desktop: Always visible
                                const isVisibleMobile = index === currentStep;

                                return (
                                    <div
                                        key={step.id}
                                        className={`
                                            ${isVisibleMobile ? "block" : "hidden"} 
                                            md:block 
                                            ${index === 0 ? "md:col-span-2" : "md:col-span-1"}
                                        `}
                                    >
                                        {renderField(step)}
                                    </div>
                                );
                            })}
                        </div>

                        {state?.error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                                ⚠️ {state.error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-6">
                        {/* MOBILE BUTTONS */}
                        <div className="flex w-full gap-3 md:hidden">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className="flex-1"
                            >
                                Back
                            </Button>

                            {currentStep === STEPS.length - 1 ? (
                                <Button type="submit" className="flex-1">
                                    Create Store
                                </Button>
                            ) : (
                                <Button type="button" onClick={handleNext} className="flex-1">
                                    Next
                                </Button>
                            )}
                        </div>

                        {/* DESKTOP BUTTON */}
                        <div className="hidden md:block w-full">
                            <Button type="submit" className="w-full text-lg h-12">
                                Complete Setup & Go to Dashboard
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}