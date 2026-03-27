import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { InventoryRepository } from "@/lib/db/repositories/inventory.repository";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const inventory = await InventoryRepository.findByVendorId(vendor.id);
    return NextResponse.json({ success: true, data: inventory });
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
    const item = await InventoryRepository.create({
      vendorId: vendor.id,
      name: body.name,
      khmerName: body.khmerName,
      price: body.price?.toString() || "0",
      stock: body.stock || 0,
      threshold: body.threshold || 10,
      status: body.status || "good",
      category: body.category,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
