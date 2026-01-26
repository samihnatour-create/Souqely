"use client";

import { useState } from "react";
import { Palette, Save, Layout, Monitor, Copy, ShieldCheck, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateStoreDesign } from "@/lib/actions";
import { toast } from "sonner";

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
    const [design, setDesign] = useState({
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

        // NEW FIELDS
        hero_badge_text: store.hero_badge_text || "New Collection 2026",
        trust_badges: store.trust_badges || DEFAULT_BADGES
    });

    const [isSaving, setIsSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(`http://${store.slug}.localhost:3000`);

    const updateField = (field: string, value: string) => {
        setDesign(prev => ({ ...prev, [field]: value }));
    };

    const updateBadge = (index: number, key: 'title' | 'desc', value: string) => {
        const newBadges = [...design.trust_badges];
        newBadges[index] = { ...newBadges[index], [key]: value };
        setDesign(prev => ({ ...prev, trust_badges: newBadges }));
    };

    async function handleSave() {
        setIsSaving(true);
        // The type definition in actions.ts now supports trust_badges
        const result = await updateStoreDesign(store.id, design);
        setIsSaving(false);

        if (result.success) {
            toast.success("Design saved!");
            const params = new URLSearchParams({
                ...design,
                trust_badges: JSON.stringify(design.trust_badges),
                t: Date.now().toString()
            });
            setPreviewUrl(`http://${store.slug}.localhost:3000?${params.toString()}`);
        } else {
            toast.error("Error: " + result.error);
        }
    }

    const copyLink = () => {
        const liveUrl = `http://${store.slug}.souqely.com`;
        navigator.clipboard.writeText(liveUrl);
        toast.success("Store URL copied!");
    };

    return (
        <div className="flex h-[calc(100vh-60px)] bg-slate-50 overflow-hidden">

            {/* EDITOR SIDEBAR */}
            <div className="w-[420px] bg-white border-r flex flex-col shadow-xl z-20">
                <div className="flex-1 overflow-y-auto p-6 space-y-10">

                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-slate-900">STORE EDITOR</h1>
                        <p className="text-xs text-slate-500">Customize every pixel of your brand.</p>
                    </div>

                    {/* 1. BRANDING & HEADER */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                            <Palette className="w-3 h-3" /> Branding
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Header Brand Name</Label>
                                <Input
                                    value={design.header_name}
                                    onChange={(e) => updateField('header_name', e.target.value)}
                                    className="mt-2 font-bold"
                                />
                            </div>
                            <div>
                                <Label>Font Family</Label>
                                <Select
                                    value={design.font_family}
                                    onValueChange={(val) => updateField('font_family', val)}
                                >
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
                        </div>

                        <div className="space-y-3">
                            <Label>Color Palette</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 border rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50">
                                    <input type="color" value={design.primary_color} onChange={(e) => updateField('primary_color', e.target.value)} className="w-8 h-8 rounded-full cursor-pointer" />
                                    <span className="text-[10px] uppercase font-mono text-slate-400">Brand</span>
                                </div>
                                <div className="p-3 border rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50">
                                    <input type="color" value={design.background_color} onChange={(e) => updateField('background_color', e.target.value)} className="w-8 h-8 rounded-full cursor-pointer" />
                                    <span className="text-[10px] uppercase font-mono text-slate-400">Back</span>
                                </div>
                                <div className="p-3 border rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50">
                                    <input type="color" value={design.text_color} onChange={(e) => updateField('text_color', e.target.value)} className="w-8 h-8 rounded-full cursor-pointer" />
                                    <span className="text-[10px] uppercase font-mono text-slate-400">Text</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 2. HERO & LAYOUT */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                            <Layout className="w-3 h-3" /> Hero Section
                        </div>

                        <div>
                            <Label>Alignment</Label>
                            <div className="flex gap-2 mt-2 bg-slate-100 p-1 rounded-lg w-fit">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => updateField('hero_align', align)}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${design.hero_align === align ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Badge Text</Label>
                                <Input
                                    value={design.hero_badge_text}
                                    onChange={(e) => updateField('hero_badge_text', e.target.value)}
                                    className="mt-2 font-bold text-blue-600"
                                    placeholder="e.g. SUMMER SALE"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Leave empty to hide badge.</p>
                            </div>

                            <div>
                                <Label>Headline</Label>
                                <Textarea
                                    value={design.hero_title}
                                    onChange={(e) => updateField('hero_title', e.target.value)}
                                    className="mt-2 font-bold min-h-[80px]"
                                />
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input
                                    value={design.hero_subtitle}
                                    onChange={(e) => updateField('hero_subtitle', e.target.value)}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label>Announcement Bar</Label>
                                <Input
                                    value={design.announcement_text}
                                    onChange={(e) => updateField('announcement_text', e.target.value)}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* 3. TRUST SIGNALS (NEW) */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> Trust Signals
                        </div>

                        <div className="space-y-6">
                            {design.trust_badges.map((badge: any, index: number) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border text-xs font-bold text-slate-400">
                                            {index + 1}
                                        </div>
                                        <span className="text-xs font-bold uppercase text-slate-400">Badge {index + 1}</span>
                                    </div>

                                    <div>
                                        <Label className="text-xs">Title</Label>
                                        <Input
                                            value={badge.title}
                                            onChange={(e) => updateBadge(index, 'title', e.target.value)}
                                            className="h-8 mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Description</Label>
                                        <Input
                                            value={badge.desc}
                                            onChange={(e) => updateBadge(index, 'desc', e.target.value)}
                                            className="h-8 mt-1"
                                        />
                                    </div>
                                </div>
                            ))}
                            <p className="text-[10px] text-slate-400 text-center">Empty a title to hide that specific badge.</p>
                        </div>
                    </section>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t bg-slate-50 space-y-3">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full h-12 bg-slate-900 font-bold rounded-xl text-white shadow-xl hover:bg-slate-800"
                    >
                        {isSaving ? "Publishing..." : <span className="flex gap-2 items-center"><Save className="w-4 h-4" /> Save Changes</span>}
                    </Button>

                    <Button
                        onClick={copyLink}
                        variant="outline"
                        className="w-full h-12 font-bold rounded-xl border-slate-200 hover:bg-white hover:text-blue-600 transition-colors"
                    >
                        <Copy className="w-4 h-4 mr-2" /> Copy Store Link
                    </Button>
                </div>
            </div>

            {/* --- LIVE PREVIEW --- */}
            <div className="flex-1 bg-slate-200/50 flex flex-col items-center justify-center p-8 relative">

                {/* Live Badge */}
                <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-200 z-10">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Live Preview
                    </span>
                </div>

                {/* Device Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-xs font-medium text-slate-500">
                    <Monitor className="w-3 h-3" /> Desktop View
                </div>

                <div className="w-full h-full max-w-[1200px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300/50 transition-all">
                    <iframe src={previewUrl} className="w-full h-full border-none" title="Preview" />
                </div>
            </div>
        </div>
    );
}