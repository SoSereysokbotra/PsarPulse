import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { InventoryRepository } from "@/lib/db/repositories/inventory.repository";

/**
 * PUT /api/vendor/premium/inventory/[id]
 * Update an inventory item.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const body = await request.json();
    console.log("Premium Inventory PUT - Payload:", JSON.stringify(body, null, 2));

    const item = await InventoryRepository.update(id, {
      name: body.name,
      khmerName: body.khmerName || null,
      price: body.price?.toString() || "0",
      stock: parseInt(body.stock?.toString() || "0"),
      threshold: parseInt(body.threshold?.toString() || "10"),
      status: body.status || "good",
      category: body.category || null,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("Premium Inventory PUT Error - Full Stack:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Server error",
      error: error.message || "Unknown error"
    }, { status: 500 });
  }
}

/**
 * DELETE /api/vendor/premium/inventory/[id]
 * Delete an inventory item.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    await InventoryRepository.delete(id);
    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (error) {
    console.error("Premium Inventory DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
