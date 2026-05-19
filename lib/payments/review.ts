import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  paymentTransactions,
  users,
  vendorPlans,
  vendorRequests,
  vendors,
  vendorSubscriptions,
} from "@/lib/db/schema";
import {
  notifyPaymentApproved,
  notifyPaymentRejected,
} from "@/lib/notifications/telegram";

type ReviewAction = "approve" | "reject";

export type ReviewResultCode =
  | "updated"
  | "not_found"
  | "already_completed"
  | "already_failed";

export type ReviewResult = {
  success: boolean;
  code: ReviewResultCode;
  action: ReviewAction;
  transactionId: string;
  message: string;
  vendorName?: string;
  planCode?: string;
};

function buildResult(
  action: ReviewAction,
  transactionId: string,
  code: ReviewResultCode,
  vendorName?: string,
  planCode?: string,
): ReviewResult {
  const actionLabel = action === "approve" ? "approved" : "rejected";

  if (code === "updated") {
    return {
      success: true,
      code,
      action,
      transactionId,
      message: `Payment ${actionLabel} successfully.`,
      vendorName,
      planCode,
    };
  }

  if (code === "not_found") {
    return {
      success: false,
      code,
      action,
      transactionId,
      message: "Payment not found.",
    };
  }

  if (code === "already_completed") {
    return {
      success: false,
      code,
      action,
      transactionId,
      message: "Payment is already approved.",
      vendorName,
      planCode,
    };
  }

  return {
    success: false,
    code,
    action,
    transactionId,
    message: "Payment is already rejected.",
    vendorName,
    planCode,
  };
}

async function getTxDisplayData(transactionId: string) {
  const fullTx = await db.query.paymentTransactions.findFirst({
    where: eq(paymentTransactions.transactionId, transactionId),
    with: {
      vendor: { columns: { businessName: true } },
      user: { columns: { fullName: true } },
    },
  });

  return {
    vendorName:
      fullTx?.vendor?.businessName || fullTx?.user?.fullName || "Unknown",
    planCode: fullTx?.planCode || "unknown",
  };
}

export async function approvePaymentTransaction(
  transactionId: string,
): Promise<ReviewResult> {
  const outcomeCode = await db.transaction<ReviewResultCode>(async (tx) => {
    const existing = await tx.query.paymentTransactions.findFirst({
      where: eq(paymentTransactions.transactionId, transactionId),
    });

    if (!existing) {
      return "not_found";
    }

    if (existing.status === "completed") {
      return "already_completed";
    }

    if (existing.status === "failed") {
      return "already_failed";
    }

    const [updated] = await tx
      .update(paymentTransactions)
      .set({
        status: "completed",
        providerStatus: "SUCCESS",
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(paymentTransactions.transactionId, transactionId))
      .returning();

    if (!updated) {
      return "not_found";
    }

    const userId = updated.userId;
    let currentVendorId = updated.vendorId;

    let [plan] = await tx
      .select()
      .from(vendorPlans)
      .where(eq(vendorPlans.name, updated.planCode))
      .limit(1);

    if (!plan) {
      const defaultPrices = {
        pro: { monthly: "2.99", priority: 2 },
        premium: { monthly: "6.99", priority: 3 },
        free: { monthly: "0", priority: 1 },
      };
      const pCode = (updated.planCode as "free" | "pro" | "premium") || "pro";
      const defaults = defaultPrices[pCode] || defaultPrices.pro;

      const [newPlan] = await tx
        .insert(vendorPlans)
        .values({
          name: pCode,
          description: `Auto-generated ${pCode} plan`,
          monthlyPrice: defaults.monthly,
          priority: defaults.priority,
          isActive: true,
        })
        .returning();
      plan = newPlan;
    }

    if (!currentVendorId && userId) {
      const existingVendor = await tx.query.vendors.findFirst({
        where: eq(vendors.userId, userId),
      });

      if (existingVendor) {
        currentVendorId = existingVendor.id;
      } else {
        const user = await tx.query.users.findFirst({
          where: eq(users.id, userId),
        });

        const pendingReq = await tx.query.vendorRequests.findFirst({
          where: and(
            eq(vendorRequests.userId, userId),
            eq(vendorRequests.status, "pending"),
          ),
        });

        const [newVendor] = await tx
          .insert(vendors)
          .values({
            userId,
            businessName:
              pendingReq?.businessName ||
              (user?.fullName ? `${user.fullName}'s Store` : "My Store"),
            businessEmail:
              pendingReq?.businessEmail || user?.email || "vendor@example.com",
            planId: plan.id,
            subscriptionStatus: "active",
            status: "active",
          })
          .returning();

        currentVendorId = newVendor.id;

        await tx
          .update(users)
          .set({ role: "vendor" })
          .where(eq(users.id, userId));

        if (pendingReq) {
          await tx
            .update(vendorRequests)
            .set({ status: "approved", reviewedAt: new Date() })
            .where(eq(vendorRequests.id, pendingReq.id));
        }
      }
    }

    if (plan && currentVendorId) {
      const now = new Date();
      const nextBillingDate = new Date(now);
      if (updated.billingCycle === "annual") {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      } else {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      }

      await tx
        .update(vendorSubscriptions)
        .set({
          status: "cancelled",
          cancelledAt: now,
          updatedAt: now,
        })
        .where(
          and(
            eq(vendorSubscriptions.vendorId, currentVendorId),
            eq(vendorSubscriptions.status, "active"),
          ),
        );

      await tx.insert(vendorSubscriptions).values({
        vendorId: currentVendorId,
        planId: plan.id,
        billingCycle: updated.billingCycle === "annual" ? "yearly" : "monthly",
        amount: updated.amount,
        nextBillingDate,
        isAutoRenew: true,
        status: "active",
        createdAt: now,
        updatedAt: now,
      });

      await tx
        .update(vendors)
        .set({
          planId: plan.id,
          subscriptionStatus: "active",
          subscriptionStartedAt: now,
          subscriptionEndsAt: nextBillingDate,
          updatedAt: now,
        })
        .where(eq(vendors.id, currentVendorId));
    }

    return "updated";
  });

  const txDisplayData =
    outcomeCode === "not_found" ? null : await getTxDisplayData(transactionId);

  if (outcomeCode === "updated" && txDisplayData) {
    notifyPaymentApproved({
      transactionId,
      vendorName: txDisplayData.vendorName,
      planCode: txDisplayData.planCode,
    }).catch(() => {});
  }

  return buildResult(
    "approve",
    transactionId,
    outcomeCode,
    txDisplayData?.vendorName,
    txDisplayData?.planCode,
  );
}

export async function rejectPaymentTransaction(
  transactionId: string,
): Promise<ReviewResult> {
  const existing = await db.query.paymentTransactions.findFirst({
    where: eq(paymentTransactions.transactionId, transactionId),
    with: {
      vendor: { columns: { businessName: true } },
      user: { columns: { fullName: true } },
    },
  });

  if (!existing) {
    return buildResult("reject", transactionId, "not_found");
  }

  const vendorName =
    existing.vendor?.businessName || existing.user?.fullName || "Unknown";
  const planCode = existing.planCode || "unknown";

  if (existing.status === "completed") {
    return buildResult(
      "reject",
      transactionId,
      "already_completed",
      vendorName,
      planCode,
    );
  }

  if (existing.status === "failed") {
    return buildResult(
      "reject",
      transactionId,
      "already_failed",
      vendorName,
      planCode,
    );
  }

  await db
    .update(paymentTransactions)
    .set({
      status: "failed",
      providerStatus: "REJECTED_BY_ADMIN",
      updatedAt: new Date(),
    })
    .where(eq(paymentTransactions.transactionId, transactionId));

  notifyPaymentRejected({
    transactionId,
    vendorName,
    planCode,
  }).catch(() => {});

  return buildResult("reject", transactionId, "updated", vendorName, planCode);
}
