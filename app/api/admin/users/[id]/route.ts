import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, auditLogs, admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin" && payload.role !== "super_admin") return null;
    return { userId: payload.id as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const actor = await verifyAdmin(request);
  if (!actor)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );

  const resolvedParams = await params;

  try {
    const { status, action } = await request.json();

    if (action === "deactivate") {
      await db
        .update(users)
        .set({ status: "blocked" })
        .where(eq(users.id, resolvedParams.id));
    } else if (action === "reactivate") {
      await db
        .update(users)
        .set({ status: "active" })
        .where(eq(users.id, resolvedParams.id));
    } else if (status) {
      await db.update(users).set({ status }).where(eq(users.id, resolvedParams.id));    
    }

    // Log the action
    const adminRecord = await db.query.admins.findFirst({
      where: eq(admins.userId, actor.userId),
    });
    if (adminRecord) {
      await db.insert(auditLogs).values({
        adminId: adminRecord.id,
        action: action || `update_status_${status}`,
        entityType: "user",
        entityId: resolvedParams.id,
        changes: { action, status },
      });
    }

    return NextResponse.json({ success: true, message: "User updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
