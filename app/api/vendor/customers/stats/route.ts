import { NextRequest, NextResponse } from "next/server";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { authConfig } from "@/lib/auth/config";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";
import { TrafficRepository } from "@/lib/db/repositories/traffic.repository";
import { CustomersRepository } from "@/lib/db/repositories/customers.repository";
import { SalesRepository } from "@/lib/db/repositories/sales.repository";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = TokenUtil.verifyAccessToken(token);
    if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const vendor = await VendorRepository.findByUserId(payload.id);
    if (!vendor) return NextResponse.json({ message: "Vendor not found" }, { status: 404 });

    const [todayTraffic, weeklyTraffic, prevWeeklyTraffic, peakTime, avgLtv, sales, topCustomers] = await Promise.all([
      TrafficRepository.getTodayTraffic(vendor.id),
      TrafficRepository.getWeeklyTraffic(vendor.id),
      TrafficRepository.getPrevWeeklyTraffic(vendor.id),
      TrafficRepository.getPeakTime(vendor.id),
      CustomersRepository.getAvgLTV(vendor.id),
      SalesRepository.findByVendorId(vendor.id),
      CustomersRepository.findTopCustomers(vendor.id, 3),
    ]);

    // Calculate avg spend: total revenue / total customers (LTV approach)
    const totalRevenue = sales.reduce((sum: number, sale: { amount: string }) => sum + parseFloat(sale.amount), 0);
    const totalWeeklyVisitors = weeklyTraffic || 1;
    const avgSpend = totalRevenue / totalWeeklyVisitors;

    // Weekly change %
    let weeklyChange = "+0% vs last week";
    if (prevWeeklyTraffic > 0) {
      const pct = ((weeklyTraffic - prevWeeklyTraffic) / prevWeeklyTraffic) * 100;
      const sign = pct >= 0 ? "+" : "";
      weeklyChange = `${sign}${pct.toFixed(0)}% vs last week`;
    } else if (weeklyTraffic > 0) {
      weeklyChange = "+100% vs last week";
    }

    return NextResponse.json({
      success: true,
      data: {
        todayCount: todayTraffic.totalCount,
        todayLogs: todayTraffic.logCount,
        avgSpend: `$${avgSpend.toFixed(2)}`,
        weeklyCount: weeklyTraffic,
        weeklyChange,
        weeklyCustomers: `${sales.length} Sales`,
        peakTime: peakTime || "N/A",
        avgLTV: `$${avgLtv.toFixed(2)}`,
        topCustomers,
      },
    });

  } catch (error) {
    console.error("Stats GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
