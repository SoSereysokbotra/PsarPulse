import { NextRequest, NextResponse } from "next/server";
import {
  answerTelegramCallbackQuery,
  clearTelegramInlineKeyboard,
} from "@/lib/notifications/telegram";
import {
  approvePaymentTransaction,
  rejectPaymentTransaction,
} from "@/lib/payments/review";

type TelegramCallbackMessage = {
  message_id: number;
  chat?: {
    id: number | string;
  };
};

type TelegramUpdate = {
  callback_query?: {
    id: string;
    data?: string;
    message?: TelegramCallbackMessage;
  };
};

function parsePaymentAction(data?: string) {
  if (!data) return null;
  const matched = data.match(/^pay:(approve|reject):(.+)$/);
  if (!matched) return null;

  return {
    action: matched[1] as "approve" | "reject",
    transactionId: matched[2],
  };
}

function isWebhookSecretValid(request: NextRequest): boolean {
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!configuredSecret) {
    return true;
  }

  const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
  return headerSecret === configuredSecret;
}

export async function POST(request: NextRequest) {
  try {
    console.log("[Telegram webhook] ========================================");
    console.log("[Telegram webhook] Received request");

    // Validate secret
    if (!isWebhookSecretValid(request)) {
      console.warn("[Telegram webhook] ❌ Invalid secret token");
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.log("[Telegram webhook] ✓ Secret validation passed");

    const body = (await request.json()) as TelegramUpdate;
    const callbackQuery = body.callback_query;

    console.log(
      "[Telegram webhook] Incoming data:",
      JSON.stringify(body, null, 2),
    );

    if (!callbackQuery) {
      console.log("[Telegram webhook] ⓘ No callback_query - skipping");
      return NextResponse.json({ ok: true, skipped: true });
    }

    console.log(
      "[Telegram webhook] Button clicked - Data:",
      callbackQuery.data,
    );

    const parsed = parsePaymentAction(callbackQuery.data);

    if (!parsed) {
      console.warn(
        "[Telegram webhook] ❌ Could not parse action from data:",
        callbackQuery.data,
      );
      await answerTelegramCallbackQuery(
        callbackQuery.id,
        "Unsupported action.",
        true,
      );
      return NextResponse.json({ ok: true, skipped: true });
    }

    console.log(
      "[Telegram webhook] ✓ Parsed action:",
      parsed.action,
      "Transaction:",
      parsed.transactionId,
    );

    const expectedChatId = process.env.TELEGRAM_CHAT_ID;
    const callbackChatId = callbackQuery.message?.chat?.id;

    console.log(
      "[Telegram webhook] Chat validation - Expected:",
      expectedChatId,
      "Got:",
      callbackChatId,
    );

    if (
      expectedChatId &&
      callbackChatId !== undefined &&
      String(callbackChatId) !== String(expectedChatId)
    ) {
      console.warn("[Telegram webhook] ❌ Chat ID mismatch - forbidden");
      await answerTelegramCallbackQuery(
        callbackQuery.id,
        "This chat is not allowed to review payments.",
        true,
      );
      return NextResponse.json(
        { ok: false, error: "Forbidden chat" },
        { status: 403 },
      );
    }

    console.log(
      "[Telegram webhook] ✓ Processing",
      parsed.action,
      "for transaction:",
      parsed.transactionId,
    );

    const result =
      parsed.action === "approve"
        ? await approvePaymentTransaction(parsed.transactionId)
        : await rejectPaymentTransaction(parsed.transactionId);

    console.log("[Telegram webhook] Result:", result);

    const isSuccess = result.code === "updated";
    const callbackText = isSuccess
      ? result.message
      : `Not changed: ${result.message}`;

    await answerTelegramCallbackQuery(
      callbackQuery.id,
      callbackText,
      !isSuccess,
    );

    if (callbackQuery.message?.chat?.id && callbackQuery.message?.message_id) {
      await clearTelegramInlineKeyboard(
        callbackQuery.message.chat.id,
        callbackQuery.message.message_id,
      );
    }

    console.log("[Telegram webhook] ✓ Success - Button action completed");
    console.log("[Telegram webhook] ========================================");
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("[Telegram webhook] ❌ Error:", error);
    console.error(
      "[Telegram webhook] ========================================",
    );
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
