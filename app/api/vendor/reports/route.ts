import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { ReportsRepository } from "@/lib/db/repositories/reports.repository";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const reports = await ReportsRepository.findByVendorId(vendor.id) || [];
    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
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

    const body = await request.json();
    const report = await ReportsRepository.createOrUpdate({
      vendorId: vendor.id,
      reportDate: new Date(body.date),
      totalSales: body.totalSales?.toString() || "0",
      totalExpenses: body.totalExpenses?.toString() || "0",
      netProfit: body.netProfit?.toString() || "0",
      isLocked: body.isLocked ? 1 : 0,
    });

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
