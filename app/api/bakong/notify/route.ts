import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notifyPaymentSubmitted } from "@/lib/notifications/telegram";

/**
 * POST /api/bakong/notify
 * Called when the vendor clicks "I Have Dispatched Payment".
 * Sends a Telegram notification to the superadmin with full transaction details.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, receiptUrl } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: "transactionId is required" },
        { status: 400 }
      );
    }

    // Save receiptUrl if provided
    if (receiptUrl) {
      await db.update(paymentTransactions)
        .set({ receiptUrl, updatedAt: new Date() })
        .where(eq(paymentTransactions.transactionId, transactionId));
    }

    // Fetch transaction with vendor/user details
    const tx = await db.query.paymentTransactions.findFirst({
      where: eq(paymentTransactions.transactionId, transactionId),
      with: {
        vendor: { columns: { businessName: true } },
        user: { columns: { email: true, fullName: true } },
      },
    });

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Only notify for pending transactions (prevent spam on re-clicks)
    if (tx.status !== "pending") {
      return NextResponse.json({ success: true, skipped: true });
    }

    const vendorName =
      tx.vendor?.businessName ||
      tx.user?.fullName ||
      "Unknown Vendor";
    const email = tx.user?.email || "unknown";

    // Send Telegram notification (fire-and-forget)
    notifyPaymentSubmitted({
      transactionId: tx.transactionId,
      vendorName,
      email,
      planCode: tx.planCode,
      billingCycle: tx.billingCycle,
      amount: tx.amount,
      currency: tx.currency,
      method: tx.method,
      receiptUrl: tx.receiptUrl || receiptUrl,
    }).catch((err) => {
      console.error("[Notify] Telegram notification failed:", err);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Notify] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
