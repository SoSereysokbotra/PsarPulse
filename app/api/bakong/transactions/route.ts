import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";
import {
  listPayments,
  updatePaymentStatus,
} from "@/lib/payments/transaction-store";

type PaymentStatus = "pending" | "completed" | "failed";

function isAuthorized(request: NextRequest): boolean {
  // Allow local development by default for easier debugging.
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const headerKey = request.headers.get("x-payment-debug-key") || "";
  const expectedKey = process.env.PAYMENT_DEBUG_KEY || "";

  return Boolean(expectedKey) && headerKey === expectedKey;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const transactionId = request.nextUrl.searchParams.get("transactionId") || "";
  const statusParam = request.nextUrl.searchParams.get("status") || "";
  const limitParam = Number(request.nextUrl.searchParams.get("limit") || "20");
  const limit = Number.isFinite(limitParam)
    ? Math.max(1, Math.min(limitParam, 100))
    : 20;
  const statusFilter =
    statusParam === "pending" ||
    statusParam === "completed" ||
    statusParam === "failed"
      ? (statusParam as PaymentStatus)
      : null;

  try {
    if (transactionId) {
      const [payment] = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.transactionId, transactionId))
        .limit(1);

      if (!payment) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true, source: "db", data: payment });
    }

    const conditions = [];
    if (statusFilter) {
      conditions.push(eq(paymentTransactions.status, statusFilter));
    }

    const query = db.select().from(paymentTransactions);
    const rows =
      conditions.length > 0
        ? await query
            .where(and(...conditions))
            .orderBy(desc(paymentTransactions.createdAt))
            .limit(limit)
        : await query.orderBy(desc(paymentTransactions.createdAt)).limit(limit);

    return NextResponse.json({ success: true, source: "db", data: rows });
  } catch (dbError) {
    console.warn("Payment debug DB read warning:", dbError);

    if (transactionId) {
      const rows = listPayments({ limit: 100 });
      const payment = rows.find((row) => row.transactionId === transactionId);
      if (!payment) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        source: "memory",
        data: payment,
      });
    }

    const rows = listPayments({
      status: statusFilter ?? undefined,
      limit,
    });

    return NextResponse.json({ success: true, source: "memory", data: rows });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const transactionId = String(body?.transactionId || "");
    const status = String(body?.status || "completed").toLowerCase();

    if (!transactionId) {
      return NextResponse.json(
        { error: "transactionId is required" },
        { status: 400 },
      );
    }

    if (!["pending", "completed", "failed"].includes(status)) {
      return NextResponse.json(
        { error: "status must be pending, completed, or failed" },
        { status: 400 },
      );
    }

    try {
      const [updated] = await db
        .update(paymentTransactions)
        .set({
          status: status as PaymentStatus,
          providerStatus: `DEBUG_${String(status).toUpperCase()}`,
          completedAt: status === "completed" ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(paymentTransactions.transactionId, transactionId))
        .returning();

      if (!updated) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true, source: "db", data: updated });
    } catch (dbError) {
      console.warn("Payment debug DB write warning:", dbError);

      const updated = updatePaymentStatus(
        transactionId,
        status as PaymentStatus,
      );

      if (!updated) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        source: "memory",
        data: updated,
      });
    }
  } catch (error) {
    console.error("Payment debug route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
