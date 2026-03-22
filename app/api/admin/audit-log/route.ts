import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditLogs, admins } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

async function verifyAdminOrSuper(request: NextRequest): Promise<string | null> {
  const { jwtVerify } = await import("jose");
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role === "admin" || payload.role === "super_admin") return payload.id as string;
    return null;
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const userId = await verifyAdminOrSuper(request);
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(100);

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
