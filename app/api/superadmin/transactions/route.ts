import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";

async function verifySuperAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "super_admin";
  } catch { return false; }
}

export async function GET(request: NextRequest) {
  const ok = await verifySuperAdmin(request);
  if (!ok) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

  try {
    const transactions = await db.query.paymentTransactions.findMany({
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            fullName: true,
          }
        },
        vendor: {
          columns: {
            id: true,
            businessName: true,
          }
        }
      },
      orderBy: (tx, { desc }) => [desc(tx.createdAt)]
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Fetch transactions error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
