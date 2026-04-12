import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPayment } from "@/lib/payments/transaction-store";
import crypto from "crypto";

// Force this function to run in Singapore (closest to Cambodia)
// instead of default US East — Bakong WAF blocks US cloud IPs
export const preferredRegion = "sin1";
export const dynamic = "force-dynamic";

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
      // If already completed or failed, return immediately
      if (payment.status !== "pending") {
        return NextResponse.json({
          transactionId: payment.transactionId,
          status: payment.status,
          updatedAt: payment.updatedAt,
        });
      }

      // Try checking with Bakong API
      let _debug: any = null;
      const bakongKey = process.env.BAKONG_API_KEY;
      const bakongUrl = (process.env.BAKONG_API_URL || "https://api-bakong.nbc.gov.kh/v1").trim();

      if (payment.qrString && bakongKey) {
        const md5Str = crypto.createHash("md5").update(payment.qrString).digest("hex");

        try {
          const res = await fetch(`${bakongUrl}/check_transaction_by_md5`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${bakongKey}`,
            },
            body: JSON.stringify({ md5: md5Str }),
          });

          if (res.ok) {
            const data = await res.json();
            _debug = data;

            // Bakong confirms payment was received
            if (data?.responseCode === 0 || data?.errorCode === 0) {
              // Trigger webhook to activate subscription
              const proto = request.headers.get("x-forwarded-proto") || "https";
              const host = request.headers.get("host") || "localhost:3000";

              await fetch(`${proto}://${host}/api/bakong/webhook`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  transactionId: payment.transactionId,
                  status: "SUCCESS",
                }),
              });

              return NextResponse.json({
                transactionId: payment.transactionId,
                status: "completed",
                updatedAt: new Date(),
              });
            }
          } else {
            _debug = {
              httpStatus: res.status,
              region: process.env.VERCEL_REGION || "unknown",
            };
          }
        } catch (e: any) {
          _debug = {
            error: e?.message,
            region: process.env.VERCEL_REGION || "unknown",
          };
        }
      }

      return NextResponse.json({
        transactionId: payment.transactionId,
        status: payment.status,
        updatedAt: payment.updatedAt,
        _debug,
      });
    }
  } catch (dbError) {
    console.warn("Payment status DB read warning:", dbError);
  }

  const payment = getPayment(transactionId);
  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json({
    transactionId: payment.transactionId,
    status: payment.status,
    updatedAt: payment.updatedAt,
  });
}
