import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPayment } from "@/lib/payments/transaction-store";
import crypto from "crypto";

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

      if (payment.status === "pending" && payment.qrString && process.env.BAKONG_API_URL && process.env.BAKONG_API_KEY) {
        try {
          const md5Str = crypto.createHash("md5").update(payment.qrString).digest("hex");
          
          const cleanApiUrl = process.env.BAKONG_API_URL.trim();
          const cleanApiKey = process.env.BAKONG_API_KEY.trim();

          const bkRes = await fetch(`${cleanApiUrl}/check-transaction-by-md5`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${cleanApiKey}`
            },
            body: JSON.stringify({ md5: md5Str }),
            cache: "no-store"
          });

          if (bkRes.ok) {
            const bkData = await bkRes.json();
            _debugBakong = bkData; // For network tab inspection during pending attempts
            
            if (bkData?.responseCode === 0 || bkData?.errorCode === 0 || bkData?.responseMessage?.includes("Success")) {
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
                 _debugBakong.webhookError = await webhookRes.text();
              }
            }
          } else {
            _debugBakong = { status: bkRes.status, text: await bkRes.text() };
          }
        } catch (e: any) {
          console.error("Bakong REAL Check Error:", e);
          _debugBakong = { error: e?.message };
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
