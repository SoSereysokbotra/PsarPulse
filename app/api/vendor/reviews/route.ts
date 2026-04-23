import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema/reviews.schema";
import { users } from "@/lib/db/schema/users.schema";
import { vendors } from "@/lib/db/schema/vendor.schema";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(authConfig.cookies.accessToken)?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // Find vendor by userId
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.userId, payload.id),
    });

    if (!vendor) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
    }

    // Get all reviews for this vendor, joined with user for the name
    const vendorReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          fullName: users.fullName,
          avatarUrl: users.avatarUrl,
        }
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.vendorId, vendor.id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ success: true, data: vendorReviews });
  } catch (error) {
    console.error("[VENDOR_REVIEWS_GET]", error);
    return NextResponse.json({ success: false, message: "Internal Error" }, { status: 500 });
  }
}
