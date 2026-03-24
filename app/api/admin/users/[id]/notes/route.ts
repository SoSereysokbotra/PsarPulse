import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supportNotes, admins } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { jwtVerify } from "jose";

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin" && payload.role !== "super_admin") return null;
    return payload.id as string;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await verifyAdmin(request);
  if (!userId)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );

  const resolvedParams = await params;

  try {
    const notes = await db
      .select()
      .from(supportNotes)
      .where(eq(supportNotes.userId, resolvedParams.id))
      .orderBy(desc(supportNotes.createdAt));
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const actorUserId = await verifyAdmin(request);
  if (!actorUserId)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );

  const resolvedParams = await params;

  try {
    const { note } = await request.json();
    if (!note?.trim())
      return NextResponse.json(
        { success: false, message: "Note cannot be empty" },
        { status: 400 },
      );

    const adminRecord = await db.query.admins.findFirst({
      where: eq(admins.userId, actorUserId),
    });
    if (!adminRecord)
      return NextResponse.json(
        { success: false, message: "Admin record not found" },
        { status: 403 },
      );

    const [created] = await db
      .insert(supportNotes)
      .values({
        userId: resolvedParams.id,
        adminId: adminRecord.id,
        note: note.trim(),
      })
      .returning();

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
