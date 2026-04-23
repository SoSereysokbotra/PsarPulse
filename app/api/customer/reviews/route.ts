import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema/reviews.schema";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(authConfig.cookies.accessToken)?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { vendorId, rating, comment } = body;

    if (!vendorId || !rating) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const review = await db.insert(reviews).values({
      vendorId,
      userId: payload.id,
      rating,
      comment,
    }).returning();

    return NextResponse.json({ success: true, data: review[0] });
  } catch (error) {
    console.error("[CUSTOMER_REVIEWS_POST]", error);
    return NextResponse.json({ success: false, message: "Internal Error" }, { status: 500 });
  }
}
