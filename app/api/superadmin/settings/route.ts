import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { platformSettings, admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

async function verifySuperAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role === "super_admin") return payload.id as string;
    return null;
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const userId = await verifySuperAdmin(request);
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

  try {
    const settings = await db.select().from(platformSettings);
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const userId = await verifySuperAdmin(request);
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

  try {
    const body = await request.json();
    const { key, value, label } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, message: "key and value are required" }, { status: 400 });
    }

    const adminRecord = await db.query.admins.findFirst({ where: eq(admins.userId, userId) });

    const existing = await db.query.platformSettings.findFirst({ where: eq(platformSettings.key, key) });
    if (existing) {
      await db.update(platformSettings).set({
        value: String(value),
        ...(label && { label }),
        updatedById: adminRecord?.id,
        updatedAt: new Date(),
      }).where(eq(platformSettings.key, key));
    } else {
      await db.insert(platformSettings).values({
        key,
        value: String(value),
        label,
        updatedById: adminRecord?.id,
      });
    }

    return NextResponse.json({ success: true, message: "Setting updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
