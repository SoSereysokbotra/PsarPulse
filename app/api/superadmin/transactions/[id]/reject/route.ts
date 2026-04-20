import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { paymentTransactions } from "@/lib/db/schema";

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

    return NextResponse.json({ success: true });
  } catch (dbError) {
    console.error("Payment reject error:", dbError);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
