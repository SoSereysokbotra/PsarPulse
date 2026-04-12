import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Client-initiated payment verification.
 * The client sends the md5 hash that Bakong returned,
 * and we directly mark the payment as completed + trigger internal webhook logic.
 *
 * This endpoint is used because the Bakong check_transaction_by_md5 API
 * blocks requests from cloud servers (Vercel). The client browser
 * calls Bakong directly, then calls this endpoint to confirm.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json({ error: "transactionId is required" }, { status: 400 });
    }

    // Look up the pending payment
    const [payment] = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.transactionId, transactionId))
      .limit(1);

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "completed") {
      return NextResponse.json({ status: "completed", message: "Already completed" });
    }

    // Trigger the internal webhook to process the payment
    const protoStr = request.headers.get("x-forwarded-proto") || "https";
    const hostStr = request.headers.get("host") || "localhost:3000";
    const webhookUrl = `${protoStr}://${hostStr}/api/bakong/webhook`;

    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionId,
        status: "SUCCESS",
      }),
    });

    if (webhookRes.ok) {
      return NextResponse.json({ status: "completed" });
    } else {
      const errText = await webhookRes.text();
      console.error("Verify webhook call failed:", errText);
      return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Verify endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
