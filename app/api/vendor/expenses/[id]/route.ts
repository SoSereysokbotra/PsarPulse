import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { ExpensesRepository } from "@/lib/db/repositories/expenses.repository";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const { id } = await params;
    const expense = await ExpensesRepository.findById(id);

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    if (expense.vendorId !== vendor.id) {
      return NextResponse.json({ message: "Forbidden: Not your expense" }, { status: 403 });
    }

    await ExpensesRepository.delete(id);
    console.log(`Expense DELETE: Removed ${id} for vendor ${vendor.id}`);

    return NextResponse.json({ success: true, message: "Expense deleted" });
  } catch (error) {
    console.error("Expense DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
