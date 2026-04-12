import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";
import { generateKhqrPayment } from "@/lib/payments/bakong";
import { savePayment } from "@/lib/payments/transaction-store";
import { authConfig } from "@/lib/auth/config";
import { TokenUtil } from "@/lib/auth/utils/token.util";
import { VendorRepository } from "@/lib/db/repositories/vendor.repository";

type Plan = {
  id: "pro" | "premium";
  name: string;
  monthlyAmount: number;
  annualAmount: number;
  currency: "USD" | "KHR";
};

const plans: Record<"pro" | "premium", Plan> = {
  pro: {
    id: "pro",
    name: "Pro",
    monthlyAmount: 0.01,
    annualAmount: 30,
    currency: "USD",
  },
  premium: {
    id: "premium",
    name: "Premium",
    monthlyAmount: 0.02,
    annualAmount: 70,
    currency: "USD",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const planId = body?.planId as "pro" | "premium";
    const billingCycle =
      (body?.billingCycle as "monthly" | "annual") || "monthly";
    const method = (body?.method as "aba" | "acleda" | "bakong") || "bakong";

    const plan = plans[planId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const amount =
      billingCycle === "annual" ? plan.annualAmount : plan.monthlyAmount;
    const transactionRef = `SUB_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const payment = await generateKhqrPayment({
      amount,
      currency: plan.currency,
      description: `${plan.name} Subscription - ${transactionRef}`,
      merchantId: process.env.BAKONG_MERCHANT_ID || "",
      transactionRef,
    });

    if (!payment.qrString) {
      return NextResponse.json(
        { error: "Failed to generate KHQR payload" },
        { status: 500 },
      );
    }

    const nowMs = Date.now();

    let userId: string | null = null;
    let vendorId: string | null = null;

    try {
      const token = request.cookies.get(authConfig.cookies.accessToken)?.value;
      if (token) {
        const payload = TokenUtil.verifyAccessToken(token);
        if (payload?.id) {
          userId = payload.id;
          const vendor = await VendorRepository.findByUserId(payload.id);
          vendorId = vendor?.id ?? null;
        }
      }
    } catch (authError) {
      console.warn("Payment create auth context warning:", authError);
    }

    try {
      await db.insert(paymentTransactions).values({
        transactionId: payment.transactionId,
        provider: "bakong",
        status: "pending",
        userId,
        vendorId,
        planCode: planId,
        billingCycle,
        method,
        amount: amount.toFixed(2),
        currency: plan.currency,
        description: `${plan.name} Subscription - ${transactionRef}`,
        qrString: payment.qrString,
        createdAt: new Date(nowMs),
        updatedAt: new Date(nowMs),
      });
    } catch (dbError) {
      // Keep fallback path operational if migration is not applied yet.
      console.warn("Payment create DB persistence warning:", dbError);
      savePayment({
        transactionId: payment.transactionId,
        status: "pending",
        planId,
        billingCycle,
        method,
        amount,
        currency: plan.currency,
        createdAt: nowMs,
        updatedAt: nowMs,
      });
    }

    return NextResponse.json(
      {
        transactionId: payment.transactionId,
        qrString: payment.qrString,
        md5: payment.md5,
        amount,
        currency: plan.currency,
        planName: plan.name,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Payment generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
