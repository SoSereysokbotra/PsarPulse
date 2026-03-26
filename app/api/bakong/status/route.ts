import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPayment } from "@/lib/payments/transaction-store";

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
