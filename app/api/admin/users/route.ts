import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";

async function getAdminRole(request: NextRequest): Promise<string | null> {
  const { jwtVerify } = await import("jose");
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role === "admin" || payload.role === "super_admin") return payload.role as string;
    return null;
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const role = await getAdminRole(request);
  if (!role) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const filterRole = searchParams.get("role") || "";
  const filterStatus = searchParams.get("status") || "";

  try {
    let query = db.select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      status: users.status,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    }).from(users);

    const conditions = [];
    if (search) {
      conditions.push(or(
        ilike(users.fullName, `%${search}%`),
        ilike(users.email, `%${search}%`)
      ));
    }
    if (filterRole) conditions.push(eq(users.role, filterRole as any));
    if (filterStatus) conditions.push(eq(users.status, filterStatus as any));

    const results = conditions.length > 0
      ? await query.where(conditions.length === 1 ? conditions[0]! : conditions[0]!)
      : await query.orderBy(desc(users.createdAt));

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
