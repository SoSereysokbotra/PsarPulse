import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { CustomersRepository } from "@/lib/db/repositories/customers.repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const customers = await CustomersRepository.findByVendorId(vendor.id);
    const trafficLogs = await CustomersRepository.findTrafficLogsByVendorId(vendor.id);

    return NextResponse.json({ 
      success: true, 
      data: {
        customers,
        trafficLogs
      }
    });
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
    
    // Handle Traffic Log
    if (body.count !== undefined) {
      const log = await CustomersRepository.createTrafficLog({
        vendorId: vendor.id,
        count: body.count,
        status: body.count >= 10 ? "Peak Traffic" : "Regular",
      });
      return NextResponse.json({ success: true, data: log });
    }

    // Handle Customer Profile
    if (!body.name) return NextResponse.json({ message: "Name is required for profiles" }, { status: 400 });
    
    const customer = await CustomersRepository.create({
      vendorId: vendor.id,
      name: body.name,
      phone: body.phone || null,
      email: body.email || null,
      totalSpent: body.totalSpent || "0",
      points: body.points || 0,
      lastVisit: new Date(),
    });

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    console.error("Customers POST Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ... PATCH remains mostly same ...

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // 'profile' or 'traffic'
    
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    if (type === "traffic") {
      await CustomersRepository.deleteTrafficLog(id, vendor.id);
    } else {
      await CustomersRepository.delete(id, vendor.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customers DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

