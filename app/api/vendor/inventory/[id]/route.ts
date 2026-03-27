import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { InventoryRepository } from "@/lib/db/repositories/inventory.repository";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const body = await request.json();
    
    // Ensure the vendor owns the item
    const existing = await InventoryRepository.findById(params.id);
    if (!existing || existing.vendorId !== vendor.id) {
       return NextResponse.json({ message: "Not found or forbidden" }, { status: 403 });
    }

    const updated = await InventoryRepository.update(params.id, {
      name: body.name,
      khmerName: body.khmerName,
      price: body.price?.toString(),
      stock: body.stock,
      threshold: body.threshold,
      status: body.status,
      category: body.category,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const existing = await InventoryRepository.findById(params.id);
    if (!existing || existing.vendorId !== vendor.id) {
       return NextResponse.json({ message: "Not found or forbidden" }, { status: 403 });
    }

    await InventoryRepository.delete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
