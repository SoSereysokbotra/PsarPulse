import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { CustomersRepository } from "@/lib/db/repositories/customers.repository";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const body = await request.json();
    console.log(`Customers PUT: Updating ${params.id} for vendor ${vendor.id}`, body);

    const customer = await CustomersRepository.findById(params.id);
    if (!customer || customer.vendorId !== vendor.id) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const updated = await CustomersRepository.update(params.id, {
      name: body.name,
      phone: body.phone || null,
      email: body.email || null,
      points: body.points ?? customer.points,
      totalSpent: body.totalSpent ?? customer.totalSpent,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Customers PUT Error:", error);
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

    const customer = await CustomersRepository.findById(params.id);
    if (!customer || customer.vendorId !== vendor.id) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    await CustomersRepository.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customers DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
