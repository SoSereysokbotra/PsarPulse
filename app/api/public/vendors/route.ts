import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors } from "@/lib/db/schema/vendor.schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasLocation = searchParams.get("location") === "true";

    // Build base query
    let baseQuery = db
      .select({
        id: vendors.id,
        businessName: vendors.businessName,
        businessDescription: vendors.businessDescription,
        businessAddress: vendors.businessAddress,
        businessLogo: vendors.businessLogo,
        latitude: vendors.latitude,
        longitude: vendors.longitude,
        createdAt: vendors.createdAt,
      })
      .from(vendors)
      .where(
        and(
          eq(vendors.isPublic, true),
          eq(vendors.status, "active")
        )
      );

    const publicVendors = await baseQuery;

    // Optional post-filter for valid coordinates
    const filteredVendors = hasLocation
      ? publicVendors.filter((v) => v.latitude !== null && v.longitude !== null)
      : publicVendors;

    return NextResponse.json({
      success: true,
      data: filteredVendors,
    });
  } catch (error) {
    console.error("Error fetching public vendors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}
