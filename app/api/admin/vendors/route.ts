import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors, users, vendorPlans } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    
    if (payload.role !== "admin" && payload.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const vendorsData = await db
      .select({
        id: vendors.id,
        businessName: vendors.businessName,
        businessPhone: vendors.businessPhone,
        businessEmail: vendors.businessEmail,
        status: vendors.status,
        createdAt: vendors.createdAt,
        ownerName: users.fullName,
        planName: vendorPlans.name,
        latitude: vendors.latitude,
        longitude: vendors.longitude,
        isPublic: vendors.isPublic,
      })
      .from(vendors)
      .leftJoin(users, eq(vendors.userId, users.id))
      .leftJoin(vendorPlans, eq(vendors.planId, vendorPlans.id))
      .orderBy(desc(vendors.createdAt));

    // Map to shape expected by UI
    const formattedVendors = vendorsData.map((v) => ({
      id: v.id,
      name: v.businessName,
      owner: v.ownerName || "Unknown",
      phone: v.businessPhone || v.businessEmail,
      role: "Vendor",
      tier: v.planName || "Unknown",
      status: v.status === "active" ? "Active" : v.status === "blocked" ? "Suspended" : "Pending",
      latitude: v.latitude,
      longitude: v.longitude,
      publicVisible: v.isPublic,
      joined: new Date(v.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      })
    }));

    return NextResponse.json({ success: true, data: formattedVendors });
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
