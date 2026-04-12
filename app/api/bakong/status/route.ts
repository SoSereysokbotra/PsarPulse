import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPayment } from "@/lib/payments/transaction-store";
import crypto from "crypto";
import axios from "axios";

export async function GET(request: NextRequest) {
  const transactionId = request.nextUrl.searchParams.get("transactionId") || "";

  if (!transactionId) {
    return NextResponse.json(
      { error: "transactionId is required" },
      { status: 400 },
    );
  }

  try {
    const [payment] = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.transactionId, transactionId))
      .limit(1);

    if (payment) {
      let _debugBakong: any = null;

      if (payment.status === "pending" && payment.qrString && process.env.BAKONG_API_KEY) {
        try {
          const md5Str = crypto.createHash("md5").update(payment.qrString).digest("hex");
          const bakongUrl = (process.env.BAKONG_API_URL || "https://api-bakong.nbc.gov.kh/v1").trim();

          // Use axios with browser-like headers to bypass CloudFront WAF
          const bkRes = await axios.post(
            `${bakongUrl}/check_transaction_by_md5`,
            { md5: md5Str },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.BAKONG_API_KEY}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "Origin": "https://bakong.nbc.gov.kh",
                "Referer": "https://bakong.nbc.gov.kh/",
              },
              timeout: 10000,
              validateStatus: () => true, // Don't throw on non-2xx
            }
          );

          _debugBakong = bkRes.data;

          if (bkRes.status === 200 && (bkRes.data?.responseCode === 0 || bkRes.data?.errorCode === 0)) {
            // Payment confirmed by Bakong! Trigger internal webhook.
            const protoStr = request.headers.get("x-forwarded-proto") || "https";
            const hostStr = request.headers.get("host") || "localhost:3000";
            const localWebhookUrl = `${protoStr}://${hostStr}/api/bakong/webhook`;

            const webhookRes = await fetch(localWebhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                transactionId: payment.transactionId,
                status: "SUCCESS"
              })
            });

            if (webhookRes.ok) {
              return NextResponse.json(
                {
                  transactionId: payment.transactionId,
                  status: "completed",
                  updatedAt: new Date(),
                },
                { status: 200 }
              );
            } else {
              _debugBakong = { ..._debugBakong, webhookError: await webhookRes.text() };
            }
          } else if (bkRes.status !== 200) {
            _debugBakong = { status: bkRes.status, statusText: bkRes.statusText, data: typeof bkRes.data === 'string' ? bkRes.data.substring(0, 200) : bkRes.data };
          }
        } catch (e: any) {
          console.error("Bakong check error:", e?.message);
          _debugBakong = { error: e?.message, code: e?.code };
        }
      }

      return NextResponse.json(
        {
          transactionId: payment.transactionId,
          status: payment.status,
          updatedAt: payment.updatedAt,
          _debugBakong,
        },
        { status: 200 },
      );
    }
  } catch (dbError) {
    console.warn("Payment status DB read warning:", dbError);
  }

  const payment = getPayment(transactionId);
  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      transactionId: payment.transactionId,
      status: payment.status,
      updatedAt: payment.updatedAt,
    },
    { status: 200 },
  );
}
