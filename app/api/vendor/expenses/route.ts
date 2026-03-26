import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { ExpensesRepository } from "@/lib/db/repositories/expenses.repository";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const expenses = await ExpensesRepository.findByVendorId(vendor.id);
    console.log(`Expenses GET: Found ${expenses.length} for vendor ${vendor.id}`);
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    console.error("Expenses GET Error:", error);
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
    console.log("Expenses POST: Creating for vendor", vendor.id, body);
    
    const expense = await ExpensesRepository.create({
      vendorId: vendor.id,
      amount: body.amount.toString(),
      category: body.category,
      description: body.description,
      expenseDate: body.expenseDate ? new Date(body.expenseDate) : undefined,
    });

    console.log("Expenses POST: Created", expense.id);
    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    console.error("Expenses POST Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
