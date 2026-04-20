/**
 * Telegram Bot notification utility for PsarPulse.
 *
 * Required environment variables:
 *   TELEGRAM_BOT_TOKEN  - Token from @BotFather
 *   TELEGRAM_CHAT_ID    - Your personal chat ID or group chat ID
 *   NEXT_PUBLIC_APP_URL - Your production URL (e.g. https://psar-pulse.vercel.app)
 */

const TELEGRAM_API = "https://api.telegram.org";

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping notification."
    );
    return false;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Telegram] Send failed:", err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Telegram] Network error:", err);
    return false;
  }
}

function esc(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Called when a vendor clicks "I Have Dispatched Payment" */
export async function notifyPaymentSubmitted(p: {
  transactionId: string;
  vendorName: string;
  email: string;
  planCode: string;
  billingCycle: string;
  amount: string;
  currency: string;
  method: string;
}) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://psar-pulse.vercel.app";
  const dashboardUrl = `${appUrl}/superadmin/transactions`;

  const text = [
    `🔔 <b>New Payment Submitted</b>`,
    ``,
    `👤 <b>Vendor:</b> ${esc(p.vendorName)}`,
    `📧 <b>Email:</b> ${esc(p.email)}`,
    `📦 <b>Plan:</b> ${esc(p.planCode.toUpperCase())} · ${esc(p.billingCycle)}`,
    `💰 <b>Amount:</b> ${esc(p.currency)} ${esc(p.amount)}`,
    `🏦 <b>Method:</b> ${esc(p.method.toUpperCase())} KHQR`,
    `🆔 <b>TX ID:</b> <code>${esc(p.transactionId)}</code>`,
    ``,
    `⏳ Waiting for your verification.`,
    ``,
    `👉 <a href="${dashboardUrl}">Open Transactions Dashboard →</a>`,
  ].join("\n");

  return sendTelegramMessage(text);
}

/** Called when superadmin approves a transaction */
export async function notifyPaymentApproved(p: {
  transactionId: string;
  vendorName: string;
  planCode: string;
}) {
  const text = [
    `✅ <b>Payment Approved</b>`,
    ``,
    `👤 <b>Vendor:</b> ${esc(p.vendorName)}`,
    `📦 <b>Plan:</b> ${esc(p.planCode.toUpperCase())} activated`,
    `🆔 <b>TX ID:</b> <code>${esc(p.transactionId)}</code>`,
  ].join("\n");

  return sendTelegramMessage(text);
}

/** Called when superadmin rejects a transaction */
export async function notifyPaymentRejected(p: {
  transactionId: string;
  vendorName: string;
  planCode: string;
}) {
  const text = [
    `❌ <b>Payment Rejected</b>`,
    ``,
    `👤 <b>Vendor:</b> ${esc(p.vendorName)}`,
    `📦 <b>Plan:</b> ${esc(p.planCode.toUpperCase())}`,
    `🆔 <b>TX ID:</b> <code>${esc(p.transactionId)}</code>`,
  ].join("\n");

  return sendTelegramMessage(text);
}
