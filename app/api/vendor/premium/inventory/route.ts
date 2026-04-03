import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { InventoryRepository } from "@/lib/db/repositories/inventory.repository";

/**
 * GET /api/vendor/premium/inventory
 * Fetch all inventory items for a premium vendor.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    // Note: We could check if (vendor.plan?.name !== 'premium') here, 
    // but the user wants an "unlimited" backend for this route specifically.
    
    const inventory = await InventoryRepository.findByVendorId(vendor.id);
    return NextResponse.json({ success: true, data: inventory });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/vendor/premium/inventory
 * Add a new inventory item - UNLIMITED (no maxProducts check).
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    // UNLIMITED logging - we intentionally skip the maxProducts check here.
    
    const body = await request.json();
    console.log("Premium Inventory POST - Payload:", JSON.stringify(body, null, 2));

    const item = await InventoryRepository.create({
      vendorId: vendor.id,
      name: body.name,
      khmerName: body.khmerName || null, // Convert empty string to null if needed
      price: body.price?.toString() || "0",
      stock: parseInt(body.stock?.toString() || "0"),
      threshold: parseInt(body.threshold?.toString() || "10"),
      status: body.status || "good",
      category: body.category || null,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("Premium Inventory POST Error - Full Stack:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Server error", 
      error: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
