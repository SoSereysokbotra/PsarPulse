import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { JwtPayload } from "@/lib/auth/types";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const jwtPayload = payload as unknown as JwtPayload;

    if (jwtPayload.role !== "admin" && jwtPayload.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, jwtPayload.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        personalInfo: {
          firstName: user.fullName.split(" ")[0] || "",
          lastName: user.fullName.split(" ").slice(1).join(" ") || "",
          fullName: user.fullName,
          email: user.email,
          role: user.role === "super_admin" ? "Super Administrator" : "Administrator",
          language: "English (US)",
          timezone: "(UTC+07:00) Indochina Time",
        }
      }
    });
  } catch (error) {
    console.error("Failed to fetch settings data:" + String(error));
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
