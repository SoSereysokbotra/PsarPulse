import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { approvePaymentTransaction } from "@/lib/payments/review";

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
  { params }: { params: Promise<{ id: string }> },
) {
  const ok = await verifySuperAdmin(request);
  if (!ok)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 },
    );

  const { id: transactionId } = await params;

  try {
    const result = await approvePaymentTransaction(transactionId);

    if (result.code === "not_found") {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 },
      );
    }

    if (
      result.code === "already_completed" ||
      result.code === "already_failed"
    ) {
      return NextResponse.json(
        {
          success: true,
          alreadyProcessed: true,
          code: result.code,
          message: result.message,
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (dbError) {
    console.error("Payment approve error:", dbError);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
