import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Token is required." },
        { status: 400 },
      );
    }

    const result = await AuthService.activateVendor(token);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Vendor activation error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during activation." },
      { status: 500 },
    );
  }
}
