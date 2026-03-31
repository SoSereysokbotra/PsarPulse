import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { CustomersRepository } from "@/lib/db/repositories/customers.repository";

// Shared auth helper
async function getVendor(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return null;
  const payload = TokenUtil.verifyAccessToken(token);
  if (!payload?.id) return null;
  return await VendorRepository.findByUserId(payload.id);
}

// PUT /api/vendor/customers/[id] — update a customer (used by regular vendor page)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await getVendor(request);
    if (!vendor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    const body = await request.json();
    const updated = await CustomersRepository.update(id, vendor.id, {
      name: body.name,
      phone: body.phone ?? null,
      email: body.email ?? null,
      ...(body.totalSpent !== undefined && { totalSpent: body.totalSpent }),
      ...(body.points !== undefined && { points: body.points }),
    });

    if (!updated) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Customers PUT [id] Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PATCH /api/vendor/customers/[id] — partial update (alias for PUT)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await getVendor(request);
    if (!vendor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    const body = await request.json();
    const updated = await CustomersRepository.update(id, vendor.id, body);

    if (!updated) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Customers PATCH [id] Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/vendor/customers/[id] — delete by path param
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await getVendor(request);
    if (!vendor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    await CustomersRepository.delete(id, vendor.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customers DELETE [id] Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// GET /api/vendor/customers/[id] — get single customer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await getVendor(request);
    if (!vendor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const customer = await CustomersRepository.findById(id);

    if (!customer || customer.vendorId !== vendor.id) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    console.error("Customers GET [id] Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
