import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { ExpensesRepository } from "@/lib/db/repositories/expenses.repository";
import { PremiumAnalytics } from "@/lib/analytics/premium.analytics";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const expenses = await ExpensesRepository.findByVendorId(vendor.id);
    
    // Map to PremiumAnalytics format
    const formattedExpenses = expenses.map(e => ({
      amount: e.amount,
      category: e.category || "General",
      createdAt: e.expenseDate || e.createdAt
    }));

    const potentialSavings = PremiumAnalytics.calculatePotentialSavings(formattedExpenses);

    return NextResponse.json({ 
      success: true, 
      data: {
        potentialSavings,
        currency: "USD",
        period: "Weekly",
        lastAnalyzed: new Date().toISOString()
      } 
    });
  } catch (error) {
    console.error("AI Savings GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
