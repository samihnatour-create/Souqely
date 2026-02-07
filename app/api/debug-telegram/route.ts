import { NextResponse } from "next/server";

export async function GET() {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    // 1. Check if Token Exists
    if (!token) {
        return NextResponse.json({ status: "error", message: "❌ TELEGRAM_BOT_TOKEN is missing from Vercel Env Vars!" });
    }

    // 2. Test a basic fetch to Telegram (getMe checks if the bot is alive)
    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        const data = await res.json();

        if (!data.ok) {
            return NextResponse.json({ status: "error", message: "❌ Token exists but is Invalid", telegram_error: data });
        }

        return NextResponse.json({
            status: "success",
            message: "✅ Bot is Connected!",
            bot_name: data.result.username
        });

    } catch (error: any) {
        return NextResponse.json({ status: "error", message: "❌ Fetch Failed", error: error.message });
    }
}