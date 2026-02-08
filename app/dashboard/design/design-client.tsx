"use client";

import { useState, useRef } from "react";
import { Palette, Save, Layout, Copy, ShieldCheck, Grid, Zap, List, Gem, Star, Upload, X, Check, Image as ImageIcon, Smartphone, Eye, Edit3, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateStoreDesign } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-browser";

const FONTS = {
    "Inter": "Inter, sans-serif",
    "Playfair Display": "'Playfair Display', serif",
    "Roboto Mono": "'Roboto Mono', monospace",
    "Lobster": "'Lobster', cursive"
};

const DEFAULT_BADGES = [
    { icon: "Truck", title: "Fast Delivery", desc: "2-3 days delivery" },
    { icon: "ShieldCheck", title: "Secure Payment", desc: "Cash on Delivery" },
    { icon: "Star", title: "Top Quality", desc: "Premium products" }
];

export default function DesignPageClient({ store }: { store: any }) {
    // 🟢 MOBILE STATE
    const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

    const [design, setDesign] = useState({
        template: store.template || "modern",
        logo_url: store.logo_url || "",
        hero_image_url: store.hero_image_url || "",
        primary_color: store.primary_color || "#2563eb",
        background_color: store.background_color || "#ffffff",
        text_color: store.text_color || "#0f172a",
        font_family: store.font_family || "Inter",
        button_radius: store.button_radius || "12px",
        card_style: store.card_style || "shadow",
        header_name: store.header_name || store.name,
        hero_title: store.hero_title || "Step into the Future",
        hero_subtitle: store.hero_subtitle || "Premium footwear curated for you.",
        hero_align: store.hero_align || "center",
        announcement_text: store.announcement_text || "Free Delivery in Lebanon",
        hero_badge_text: store.hero_badge_text || "New Collection 2026",
        trust_badges: store.trust_badges || DEFAULT_BADGES
    });

    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 1. Get the domain from the environment (Localhost OR Production)
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

    // 2. Determine Protocol (HTTP for local, HTTPS for prod)
    const protocol = rootDomain.includes("localhost") ? "http" : "https";

    // 3. Build the URL dynamically
    const previewUrl = `${protocol}://${store.slug}.${rootDomain}`;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);

    const updateField = (field: string, value: string) => {
        setDesign(prev => ({ ...prev, [field]: value }));
    };

    const updateBadge = (index: number, key: 'title' | 'desc', value: string) => {
        const newBadges = [...design.trust_badges];
        newBadges[index] = { ...newBadges[index], [key]: value };
        setDesign(prev => ({ ...prev, trust_badges: newBadges }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo_url' | 'hero_image_url') => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `${fieldName}-${Date.now()}.${fileExt}`;
            const filePath = `${store.id}/${fileName}`;
            const bucketName = fieldName === 'hero_image_url' ? 'hero-images' : 'store-logos';

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            updateField(fieldName, publicUrl);
            toast.success("Image uploaded!");
        } catch (error: any) {
            console.error(error);
            toast.error("Upload failed. Check bucket permissions.");
        } finally {
            setUploading(false);
        }
    };

    async function handleSave() {
        setIsSaving(true);
        try {
            const result = await updateStoreDesign(store.id, design);
            if (result.success) {
                toast.success("Design saved!");
                const iframe = document.querySelector('iframe');
                if (iframe) iframe.src = iframe.src;
            } else {
                toast.error("Error: " + result.error);
            }
        } catch (err) {
            console.error("Client Error:", err);
            toast.error("Failed to connect to server");
        } finally {
            setIsSaving(false);
        }
    }

    const copyLink = () => {
        const liveUrl = `http://${store.slug}.souqely.com`;
        navigator.clipboard.writeText(liveUrl);
        toast.success("Store URL copied!");
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-60px)] bg-slate-50 overflow-hidden relative">

            {/* 🟢 MOBILE TABS (Mobile Only) */}
            <div className="md:hidden flex items-center justify-between p-2 bg-white border-b z-50 shrink-0">
                <div className="flex bg-slate-100 p-1 rounded-lg w-full">
                    <button
                        onClick={() => setMobileTab('editor')}
                        className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all", mobileTab === 'editor' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}
                    >
                        <Edit3 className="w-4 h-4" /> Editor
                    </button>
                    <button
                        onClick={() => setMobileTab('preview')}
                        className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all", mobileTab === 'preview' ? "bg-white shadow-sm text-blue-600" : "text-slate-500")}
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                </div>
            </div>

            {/* =====================================================================================
                EDITOR SIDEBAR
            ===================================================================================== */}
            <div className={cn(
                "flex-col bg-white border-r shadow-xl z-20 transition-transform duration-300 md:translate-x-0 md:w-[420px] md:flex",
                mobileTab === 'editor' ? "flex w-full h-full absolute inset-0 md:static pt-14 md:pt-0" : "hidden"
            )}>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 md:space-y-10 pb-24 md:pb-6 custom-scrollbar">

                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-slate-900">STORE EDITOR</h1>
                        <p className="text-xs text-slate-500">Customize every pixel of your brand.</p>
                    </div>

                    {/* 0. TEMPLATE SELECTOR */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                            <Layout className="w-3 h-3" /> Layout & Theme
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            {[
                                { id: 'modern-grid', name: 'Modern Grid', icon: Grid, desc: 'Fashion' },
                                { id: 'tech-cyber', name: 'Tech Cyber', icon: Zap, desc: 'Electronics' },
                                { id: 'classic-list', name: 'Classic List', icon: List, desc: 'Grocery' },
                                { id: 'minimalist-bold', name: 'Luxury', icon: Gem, desc: 'Jewelry' },
                                { id: 'vibrant-pop', name: 'Vibrant Pop', icon: Star, desc: 'Gifts' },
                            ].map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => updateField('template', tpl.id)}
                                    className={cn(
                                        "relative flex flex-col text-left p-3 rounded-xl border-2 transition-all hover:bg-slate-50",
                                        design.template === tpl.id ? "border-blue-600 bg-blue-50/50" : "border-slate-100 bg-white"
                                    )}
                                >
                                    {design.template === tpl.id && (
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                    <div className={cn("aspect-video rounded-lg flex items-center justify-center mb-2", design.template === tpl.id ? "bg-blue-100" : "bg-slate-100")}>
                                        <tpl.icon className={cn("w-6 h-6", design.template === tpl.id ? "text-blue-600" : "text-slate-400")} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">{tpl.name}</span>
                                    <span className="text-[9px] text-slate-400 font-medium">{tpl.desc}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 1. BRANDING & COLORS */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                            <Palette className="w-3 h-3" /> Branding
                        </div>

                        <div className="space-y-6">
                            {/* LOGO */}
                            <div className="space-y-3">
                                <Label>Store Logo</Label>
                                <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'logo_url')} accept="image/*" className="hidden" />

                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative shrink-0">
                                        {design.logo_url ? (
                                            <img src={design.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-slate-300" />
                                        )}
                                        {design.logo_url && (
                                            <button onClick={() => updateField('logo_url', "")} className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm hover:text-red-500">
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Button variant="outline" size="sm" disabled={uploading} onClick={() => fileInputRef.current?.click()} className="w-full h-9 font-medium">
                                            {uploading ? "Uploading..." : <><Upload className="w-4 h-4 mr-2" /> Upload Logo</>}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* HEADER NAME (Restored) */}
                            <div>
                                <Label>Header Brand Name</Label>
                                <Input value={design.header_name} onChange={(e) => updateField('header_name', e.target.value)} className="mt-2 font-bold" />
                            </div>

                            {/* FONT FAMILY (Restored) */}
                            <div>
                                <Label>Font Family</Label>
                                <Select value={design.font_family} onValueChange={(val) => updateField('font_family', val)}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(FONTS).map(font => (
                                            <SelectItem key={font} value={font}>{font}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* COLORS */}
                            <div className="space-y-3">
                                <Label>Color Palette</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[{ label: 'Brand', key: 'primary_color' }, { label: 'Bg', key: 'background_color' }, { label: 'Text', key: 'text_color' }].map((col) => (
                                        <div key={col.key} className="p-3 border rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50">
                                            <input type="color" value={(design as any)[col.key]} onChange={(e) => updateField(col.key, e.target.value)} className="w-8 h-8 rounded-full cursor-pointer p-0 border-none" />
                                            <span className="text-[10px] uppercase font-mono text-slate-400">{col.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 2. HERO SECTION */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                            <Layout className="w-3 h-3" /> Hero Section
                        </div>

                        {/* HERO IMAGE */}
                        <div className="space-y-3">
                            <Label>Hero Background</Label>
                            <input type="file" ref={heroInputRef} onChange={(e) => handleImageUpload(e, 'hero_image_url')} accept="image/*" className="hidden" />
                            <div
                                className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors text-center cursor-pointer relative overflow-hidden h-32 flex items-center justify-center group"
                                onClick={() => heroInputRef.current?.click()}
                            >
                                {design.hero_image_url ? (
                                    <>
                                        <img src={design.hero_image_url} className="w-full h-full object-cover absolute inset-0 opacity-50 group-hover:opacity-40" />
                                        <span className="relative z-10 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Change Image</span>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                                        <p className="text-xs text-slate-500 font-medium">Click to upload hero image</p>
                                    </div>
                                )}
                            </div>
                            {design.hero_image_url && (
                                <Button variant="ghost" size="sm" onClick={() => updateField('hero_image_url', "")} className="w-full text-red-500 h-8 text-xs">
                                    Remove Hero Image
                                </Button>
                            )}
                        </div>

                        {/* ALIGNMENT (Restored) */}
                        <div>
                            <Label>Alignment</Label>
                            <div className="flex gap-2 mt-2 bg-slate-100 p-1 rounded-lg w-fit">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => updateField('hero_align', align)}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${design.hero_align === align ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* TEXT FIELDS (Restored All) */}
                        <div className="space-y-4">
                            <div>
                                <Label>Badge Text</Label>
                                <Input value={design.hero_badge_text} onChange={(e) => updateField('hero_badge_text', e.target.value)} className="mt-2 font-bold text-blue-600" placeholder="e.g. SUMMER SALE" />
                            </div>
                            <div>
                                <Label>Headline</Label>
                                <Textarea value={design.hero_title} onChange={(e) => updateField('hero_title', e.target.value)} className="mt-2 font-bold min-h-[80px]" />
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input value={design.hero_subtitle} onChange={(e) => updateField('hero_subtitle', e.target.value)} className="mt-2" />
                            </div>
                            <div>
                                <Label>Announcement Bar</Label>
                                <Input value={design.announcement_text} onChange={(e) => updateField('announcement_text', e.target.value)} className="mt-2" />
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 3. TRUST SIGNALS (Restored) */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> Trust Signals
                        </div>

                        <div className="space-y-4">
                            {design.trust_badges.map((badge: any, index: number) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border text-[10px] font-bold text-slate-400">{index + 1}</div>
                                        <span className="text-xs font-bold uppercase text-slate-400">Badge {index + 1}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-[10px] uppercase text-slate-400">Title</Label>
                                            <Input value={badge.title} onChange={(e) => updateBadge(index, 'title', e.target.value)} className="h-8 mt-1 text-xs" />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] uppercase text-slate-400">Description</Label>
                                            <Input value={badge.desc} onChange={(e) => updateBadge(index, 'desc', e.target.value)} className="h-8 mt-1 text-xs" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Footer Actions */}
                <div className="p-4 md:p-6 border-t bg-slate-50 space-y-3 shrink-0">
                    <Button onClick={handleSave} disabled={isSaving} className="w-full h-12 bg-slate-900 font-bold rounded-xl text-white shadow-xl hover:bg-slate-800">
                        {isSaving ? "Publishing..." : <span className="flex gap-2 items-center"><Save className="w-4 h-4" /> Save Changes</span>}
                    </Button>
                    <Button onClick={copyLink} variant="outline" className="w-full h-12 font-bold rounded-xl border-slate-200 hover:bg-white hover:text-blue-600 transition-colors">
                        <Copy className="w-4 h-4 mr-2" /> Copy Store Link
                    </Button>
                </div>
            </div>

            {/* =====================================================================================
                PREVIEW AREA
            ===================================================================================== */}
            <div className={cn(
                "flex-1 bg-slate-200/50 flex flex-col items-center justify-center p-4 md:p-8 relative transition-opacity duration-300",
                mobileTab === 'preview' ? "flex h-full pt-14 md:pt-8" : "hidden md:flex"
            )}>
                {/* Desktop "Live" Badge */}
                <div className="hidden md:flex absolute top-6 right-6 items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-200 z-10">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Preview</span>
                </div>

                <div className="w-full h-full md:max-w-[1200px] bg-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border border-slate-300/50 transition-all flex flex-col">
                    {/* Fake Browser Bar */}
                    <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white h-6 rounded-md flex items-center px-3 text-[10px] text-slate-400 font-mono truncate mx-4">
                            {previewUrl}
                        </div>
                    </div>

                    <iframe
                        src={previewUrl}
                        className="w-full flex-1 border-none bg-white"
                        title="Store Preview"
                        key={Date.now()} // Force refresh on re-render if needed, though mostly handled by iframe.src reset in save
                    />
                </div>

                {/* Mobile Refresh Hint */}
                <div className="md:hidden mt-2 text-[10px] text-slate-400 font-medium">
                    Preview updates automatically on save
                </div>
            </div>

        </div>
    );
}