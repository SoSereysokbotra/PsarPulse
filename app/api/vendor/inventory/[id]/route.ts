import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { InventoryRepository } from "@/lib/db/repositories/inventory.repository";

export async function PATCH(
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

    const { id } = await params;
    const existing = await InventoryRepository.findById(id);

    if (!existing || existing.vendorId !== vendor.id) {
      return NextResponse.json({ message: "Item not found or unauthorized" }, { status: 404 });
    }

    const body = await request.json();
    const updated = await InventoryRepository.update(id, {
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
    console.error("Inventory PATCH Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

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

    const { id } = await params;
    const existing = await InventoryRepository.findById(id);

    if (!existing || existing.vendorId !== vendor.id) {
      return NextResponse.json({ message: "Item not found or unauthorized" }, { status: 404 });
    }

    await InventoryRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inventory DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
