import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { paymentTransactions } from "@/lib/db/schema";
import { notifyPaymentRejected } from "@/lib/notifications/telegram";

async function verifySuperAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "super_admin";
  } catch {
    return false;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await verifySuperAdmin(request);
  if (!ok)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );

  const { id: transactionId } = await params;

  try {
    await db
      .update(paymentTransactions)
      .set({
        status: "failed",
        providerStatus: "REJECTED_BY_ADMIN",
        updatedAt: new Date(),
      })
      .where(eq(paymentTransactions.transactionId, transactionId));

    // Send Telegram notification (fire-and-forget)
    const fullTx = await db.query.paymentTransactions.findFirst({
      where: eq(paymentTransactions.transactionId, transactionId),
      with: {
        vendor: { columns: { businessName: true } },
        user: { columns: { fullName: true } },
      },
    });
    notifyPaymentRejected({
      transactionId,
      vendorName: fullTx?.vendor?.businessName || fullTx?.user?.fullName || "Unknown",
      planCode: fullTx?.planCode || "unknown",
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (dbError) {
    console.error("Payment reject error:", dbError);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
