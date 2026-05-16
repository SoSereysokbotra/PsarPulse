import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { TrafficRepository } from "@/lib/db/repositories/traffic.repository";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const logs = await TrafficRepository.findByVendorId(vendor.id);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Traffic GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const { count } = await request.json();
    if (!count || typeof count !== "number") {
      return NextResponse.json({ message: "Invalid count" }, { status: 400 });
    }

    const log = await TrafficRepository.create({
      vendorId: vendor.id,
      count,
      status: count >= 5 ? "Peak Traffic" : "Regular",
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error("Traffic POST Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
