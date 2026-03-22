import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendorPlans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

  const plans = await db.select().from(vendorPlans);
  return NextResponse.json({ success: true, data: plans });
}

export async function POST(request: NextRequest) {
  const ok = await verifySuperAdmin(request);
  if (!ok) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

  try {
    const body = await request.json();
    const [plan] = await db.insert(vendorPlans).values(body).returning();
    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
