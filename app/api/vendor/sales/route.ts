import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) {
      console.log("Sales GET: Invalid token payload");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) {
      console.log("Sales GET: Vendor not found for user", payload.id);
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    const sales = await SalesRepository.findByVendorId(vendor.id);
    console.log(`Sales GET: Found ${sales.length} sales for vendor ${vendor.id}`);
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error("Sales GET Error:", error);
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
    console.log("Sales POST: Creating sale for vendor", vendor.id, body);
    
    const sale = await SalesRepository.create({
      vendorId: vendor.id,
      amount: body.amount.toString(), // Ensure string for decimal
      method: body.method,
      items: body.items,
    });

    console.log("Sales POST: Created sale", sale.id);
    return NextResponse.json({ success: true, data: sale });
  } catch (error) {
    console.error("Sales POST Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
