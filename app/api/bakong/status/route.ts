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
      if (payment.status === "pending" && payment.qrString && process.env.BAKONG_API_URL && process.env.BAKONG_API_KEY) {
        try {
          const md5 = crypto.createHash("md5").update(payment.qrString).digest("hex");
          
          const bkRes = await fetch(`${process.env.BAKONG_API_URL}/check-transaction-by-md5`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.BAKONG_API_KEY}`
            },
            body: JSON.stringify({ md5 }),
            cache: "no-store"
          });

          if (bkRes.ok) {
            const bkData = await bkRes.json();
            
            if (bkData?.responseCode === 0) {
              const protoStr = request.headers.get("x-forwarded-proto") || "http";
              const hostStr = request.headers.get("host") || "localhost:3000";
              const localWebhookUrl = `${protoStr}://${hostStr}/api/bakong/webhook`;

              await fetch(localWebhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  transactionId: payment.transactionId,
                  status: "SUCCESS"
                })
              });

              return NextResponse.json(
                {
                  transactionId: payment.transactionId,
                  status: "completed",
                  updatedAt: new Date(),
                },
                { status: 200 }
              );
            }
          }
        } catch (e) {
          console.error("Bakong REAL Check Error:", e);
        }
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
