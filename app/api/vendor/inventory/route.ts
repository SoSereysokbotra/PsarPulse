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

    // Enforce plan-based limits
    const currentCount = await InventoryRepository.countByVendorId(vendor.id);
    const maxProducts = vendor.plan?.maxProducts;

    if (maxProducts !== null && maxProducts !== undefined && currentCount >= maxProducts) {
      return NextResponse.json({ 
        success: false, 
        message: `Inventory limit reached. Your plan allows up to ${maxProducts} products.`,
        limitReached: true
      }, { status: 403 });
    }

    const body = await request.json();
    
    // Check for active Pro/Premium subscription
    const activeSub = vendor.subscriptions?.find((s: any) => s.status === "active" && s.plan?.name !== "free");
    const isPro = activeSub || vendor.plan?.name !== "free";

    // Enforce 30-item limit ONLY for Free Tier (no active Pro/Premium subscription)
    if (!isPro) {
      const inventory = await InventoryRepository.findByVendorId(vendor.id);
      if (inventory.length >= 30) {
        return NextResponse.json({ 
          success: false, 
          message: "Inventory limit reached (30/30). Please upgrade to Pro for unlimited items." 
        }, { status: 403 });
      }
    }

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
