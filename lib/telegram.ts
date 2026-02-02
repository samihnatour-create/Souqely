export async function sendTelegramNotification(chatId: string, message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN; // The Bot Token stays in .env (It's the same bot for everyone)

    if (!token || !chatId) {
        console.warn("⚠️ Telegram Alert Skipped: Missing Token or Chat ID");
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
            }),
        });

        if (!response.ok) {
            console.error("Telegram API Error:", await response.json());
        }
    } catch (error) {
        console.error("Failed to send Telegram notification:", error);
    }
}