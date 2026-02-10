"use client";

import { useState } from "react";
import { useCSVReader } from "react-papaparse";
import { importProducts } from "@/lib/actions"; // Ensure this matches your Server Action path
// 🟢 FIX 1: Import from the library you actually have (@supabase/ssr)
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
    Upload,
    FileSpreadsheet,
    Loader2,
    Download,
    CheckCircle2,
    FileDown
} from "lucide-react";

export default function BulkProductUpload() {
    const { CSVReader } = useCSVReader();
    const [uploading, setUploading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // 🟢 FIX 2: Initialize the Browser Client correctly
    // We must pass the URL and Key manually with this library
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleDownloadTemplate = () => {
        const headers = [
            "Name", "Description", "Price", "Stock", "Category", "Image",
            "Variant Name", "Variant Price", "Variant Stock", "Variant Attributes"
        ];

        const row1 = "Summer T-Shirt,Cool cotton shirt,20.00,100,Apparel,https://site.com/img.jpg,Size 40,20.00,50,Size:40;Color:Red";
        const row2 = "Summer T-Shirt,,,,,,Size 41,20.00,50,Size:41;Color:Red";

        const csvContent = [headers.join(","), row1, row2].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "souqely_bulk_template_v2.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Bulk Import
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl bg-white">
                <DialogHeader>
                    <DialogTitle>Import Products via CSV</DialogTitle>
                    <DialogDescription>
                        Add products and variants in bulk. Follow the steps below.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">

                    {/* STEP 1: DOWNLOAD TEMPLATE */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                <span className="bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                                Get the Template
                            </h4>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">
                            Download the template file. <strong>Do not change the header names.</strong>
                            <br />
                            For variants, repeat the <strong>Product Name</strong> in multiple rows.
                        </p>
                        <Button
                            onClick={handleDownloadTemplate}
                            variant="secondary"
                            className="w-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-900"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Template (v2)
                        </Button>
                    </div>

                    {/* STEP 2: UPLOAD */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                            Upload Filled File
                        </h4>

                        <CSVReader
                            onUploadAccepted={async (results: any) => {
                                setUploading(true);
                                try {
                                    // 🟢 FIX 3: Get the Session Token
                                    const { data: { session } } = await supabase.auth.getSession();

                                    if (!session) {
                                        toast.error("You are not logged in. Please refresh.");
                                        setUploading(false);
                                        return;
                                    }

                                    // Filter out empty rows
                                    const validRows = results.data.filter((r: any) => r.Name || r["Variant Name"]);

                                    if (validRows.length === 0) {
                                        toast.error("File appears to be empty.");
                                        setUploading(false);
                                        return;
                                    }

                                    console.log("Uploading rows:", validRows);

                                    // 🟢 FIX 4: Pass the token as the 2nd argument
                                    const result = await importProducts(validRows, session.access_token);

                                    if (result.success) {
                                        toast.success(result.message || "Import successful!");
                                        setIsOpen(false);
                                    } else {
                                        toast.error("Import failed: " + result.error);
                                    }
                                } catch (err) {
                                    console.error(err);
                                    toast.error("Failed to process file. Check console.");
                                } finally {
                                    setUploading(false);
                                }
                            }}
                            config={{
                                header: true,
                                skipEmptyLines: true
                            }}
                        >
                            {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }: any) => (
                                <div className="flex flex-col gap-3">
                                    <div
                                        {...getRootProps()}
                                        className={`
                                            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                            ${acceptedFile ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'}
                                        `}
                                    >
                                        {acceptedFile ? (
                                            <div className="flex flex-col items-center gap-2 animate-in zoom-in-50">
                                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                                                <p className="font-bold text-slate-900">{acceptedFile.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {(acceptedFile.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <FileDown className="w-10 h-10 mb-2 opacity-50" />
                                                <p className="font-medium text-slate-600">Click to Upload CSV</p>
                                                <p className="text-xs">or drag and drop here</p>
                                            </div>
                                        )}

                                        <div className="mt-4 h-1 w-full bg-slate-200 rounded-full overflow-hidden opacity-0 data-[active=true]:opacity-100 transition-opacity">
                                            <ProgressBar className="bg-blue-600" />
                                        </div>
                                    </div>

                                    {acceptedFile && (
                                        <div className="flex gap-2 animate-in slide-in-from-bottom-2">
                                            <Button
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                disabled={uploading}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    "Start Import"
                                                )}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={getRemoveFileProps().onClick}
                                                disabled={uploading}
                                            >
                                                <Upload className="w-4 h-4 rotate-45" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CSVReader>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}