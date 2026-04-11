import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";
import { InventoryRepository } from "@/lib/db/repositories/inventory.repository";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) {
      console.log("Sales GET: Invalid token payload");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) {
      console.log("Sales GET: Vendor not found for user", payload.id);
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 },
      );
    }

    const sales = await SalesRepository.findByVendorId(vendor.id);
    console.log(
      `Sales GET: Found ${sales.length} sales for vendor ${vendor.id}`,
    );
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error("Sales GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor)
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 },
      );

    const body = await request.json();
    console.log("Sales POST: Creating sale for vendor", vendor.id, body);

    if (body.inventoryItemId) {
      const inventoryItem = await InventoryRepository.findById(
        body.inventoryItemId,
      );
      if (!inventoryItem || inventoryItem.vendorId !== vendor.id) {
        return NextResponse.json(
          { success: false, message: "Inventory item not found" },
          { status: 404 },
        );
      }

      const qty = Number.parseInt(String(body.quantity ?? 1), 10);
      if (!Number.isFinite(qty) || qty <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid quantity" },
          { status: 400 },
        );
      }

      const currentStock = Number(inventoryItem.stock ?? 0);
      if (currentStock <= 0 || inventoryItem.status === "out") {
        return NextResponse.json(
          { success: false, message: "Item is out of stock" },
          { status: 400 },
        );
      }

      if (qty > currentStock) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock. Available: ${currentStock}`,
          },
          { status: 400 },
        );
      }

      const newStock = currentStock - qty;
      let newStatus: "good" | "low" | "out" | null = inventoryItem.status as "good" | "low" | "out" | null;
      if (newStock === 0) newStatus = "out";
      else if (newStock <= inventoryItem.threshold) newStatus = "low";
      else newStatus = "good";

      await InventoryRepository.update(inventoryItem.id, {
        stock: newStock,
        status: newStatus,
      });
      console.log(
        `Sales POST: Deducted ${qty} stock from item ${inventoryItem.id}. New stock: ${newStock}`,
      );
    }

    const sale = await SalesRepository.create({
      vendorId: vendor.id,
      amount: body.amount.toString(), // Ensure string for decimal
      method: body.method || "Cash",
      items: body.items,
      category: body.category,
    });

    console.log("Sales POST: Created sale", sale.id);
    return NextResponse.json({ success: true, data: sale });
  } catch (error) {
    console.error("Sales POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor)
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 },
      );

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing sale ID" },
        { status: 400 },
      );
    }

    const deleted = await SalesRepository.delete(id, vendor.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Sale not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Sales DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
