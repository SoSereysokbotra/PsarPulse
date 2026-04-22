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
    if (!isWebhookSecretValid(request)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as TelegramUpdate;
    const callbackQuery = body.callback_query;

    if (!callbackQuery) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const parsed = parsePaymentAction(callbackQuery.data);

    if (!parsed) {
      await answerTelegramCallbackQuery(
        callbackQuery.id,
        "Unsupported action.",
        true,
      );
      return NextResponse.json({ ok: true, skipped: true });
    }

    const expectedChatId = process.env.TELEGRAM_CHAT_ID;
    const callbackChatId = callbackQuery.message?.chat?.id;

    if (
      expectedChatId &&
      callbackChatId !== undefined &&
      String(callbackChatId) !== String(expectedChatId)
    ) {
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

    const result =
      parsed.action === "approve"
        ? await approvePaymentTransaction(parsed.transactionId)
        : await rejectPaymentTransaction(parsed.transactionId);

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

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("[Telegram webhook] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
