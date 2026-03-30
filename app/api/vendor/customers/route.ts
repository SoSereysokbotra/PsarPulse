import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { CustomersRepository } from "@/lib/db/repositories/customers.repository";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const customers = await CustomersRepository.findByVendorId(vendor.id);
    console.log(`Customers GET: Found ${customers.length} for vendor ${vendor.id}`);
    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    console.error("Customers GET Error:", error);
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
    console.log("Customers POST: Creating for vendor", vendor.id, body);
    
    const customer = await CustomersRepository.create({
      vendorId: vendor.id,
      name: body.name,
      phone: body.phone || null,
      email: body.email || null,
      points: body.points || 0,
      totalSpent: body.totalSpent || 0,
    });

    console.log("Customers POST: Created", customer.id);
    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    console.error("Customers POST Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
