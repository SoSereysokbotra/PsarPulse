import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const { id: saleId } = await params;
    if (!saleId) return NextResponse.json({ message: "Sale ID required" }, { status: 400 });

    await SalesRepository.delete(saleId, vendor.id);

    return NextResponse.json({ success: true, message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Sales DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
