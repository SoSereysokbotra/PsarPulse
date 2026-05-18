import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema/reviews.schema";
import { users } from "@/lib/db/schema/users.schema";
import { eq, desc } from "drizzle-orm";
import { jwtVerify } from "jose";

// Admin auth helper
async function isAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin" || payload.role === "super_admin";
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id: vendorId } = await params;

  try {
    // Fetch all reviews with reviewer info
    const rawReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userName: users.fullName,
        userEmail: users.email,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.vendorId, vendorId))
      .orderBy(desc(reviews.createdAt));

    // Compute aggregate stats
    const totalReviews = rawReviews.length;
    const averageRating =
      totalReviews === 0
        ? 0
        : rawReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
          totalReviews;

    // Star breakdown (1–5)
    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of rawReviews) {
      const star = r.rating ?? 0;
      if (star >= 1 && star <= 5) breakdown[star]++;
    }

    const formattedReviews = rawReviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment || "",
      createdAt: r.createdAt,
      userName: r.userName || "Anonymous",
      userEmail: r.userEmail || "",
    }));

    return NextResponse.json({
      success: true,
      data: {
        reviews: formattedReviews,
        stats: {
          total: totalReviews,
          average: Math.round(averageRating * 10) / 10,
          breakdown,
        },
      },
    });
  } catch (error) {
    console.error("[ADMIN_VENDOR_REVIEWS_GET]", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
