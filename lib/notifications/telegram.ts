/**
 * Telegram Bot notification utility for PsarPulse.
 *
 * Required environment variables:
 *   TELEGRAM_BOT_TOKEN  - Token from @BotFather
 *   TELEGRAM_CHAT_ID    - Your personal chat ID or group chat ID
 *   NEXT_PUBLIC_APP_URL - Your production URL (e.g. https://psar-pulse.vercel.app)
 */

const TELEGRAM_API = "https://api.telegram.org";

type InlineKeyboardButton = {
  text: string;
  callback_data: string;
};

type SendTelegramMessageOptions = {
  photoUrl?: string;
  inlineKeyboard?: InlineKeyboardButton[][];
};

async function callTelegramApi(
  method: string,
  payload: Record<string, unknown>,
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN not set - skipping request.");
    return { ok: false, rawError: "Missing TELEGRAM_BOT_TOKEN" };
  }

  const res = await fetch(`${TELEGRAM_API}/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[Telegram] ${method} failed:`, err);
    return { ok: false, rawError: err };
  }

  return { ok: true, rawError: null };
}

export async function sendTelegramMessage(
  text: string,
  options?: SendTelegramMessageOptions,
): Promise<boolean> {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId) {
    console.warn(
      "[Telegram] TELEGRAM_CHAT_ID not set - skipping notification.",
    );
    return false;
  }

  try {
    const photoUrl = options?.photoUrl;
    const endpoint = photoUrl ? "sendPhoto" : "sendMessage";
    const body: Record<string, unknown> = {
      chat_id: chatId,
      parse_mode: "HTML",
    };

    if (photoUrl) {
      body.photo = photoUrl;
      body.caption = text;
    } else {
      body.text = text;
      body.disable_web_page_preview = true;
    }

    if (options?.inlineKeyboard?.length) {
      body.reply_markup = {
        inline_keyboard: options.inlineKeyboard,
      };
    }

    const result = await callTelegramApi(endpoint, body);
    return result.ok;
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
  receiptUrl?: string | null;
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

  return sendTelegramMessage(text, {
    photoUrl: p.receiptUrl || undefined,
    inlineKeyboard: [
      [
        { text: "✅ Approve", callback_data: `pay:approve:${p.transactionId}` },
        { text: "❌ Reject", callback_data: `pay:reject:${p.transactionId}` },
      ],
    ],
  });
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

export async function answerTelegramCallbackQuery(
  callbackQueryId: string,
  text: string,
  showAlert = false,
): Promise<boolean> {
  const result = await callTelegramApi("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert,
  });
  return result.ok;
}

export async function clearTelegramInlineKeyboard(
  chatId: string | number,
  messageId: number,
): Promise<boolean> {
  const result = await callTelegramApi("editMessageReplyMarkup", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] },
  });
  return result.ok;
}
