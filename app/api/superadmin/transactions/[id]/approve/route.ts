import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { and, eq } from "drizzle-orm";
import {
  paymentTransactions,
  vendorPlans,
  vendorSubscriptions,
  vendors,
  users,
  vendorRequests,
} from "@/lib/db/schema";

async function verifySuperAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "super_admin";
  } catch {
    return false;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = await verifySuperAdmin(request);
  if (!ok)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );

  const { id: transactionId } = await params;
  const normalizedStatus = "completed";

  let dbUpdated = null;

  try {
    await db.transaction(async (tx) => {
      const [updatedRow] = await tx
        .update(paymentTransactions)
        .set({
          status: normalizedStatus,
          providerStatus: "SUCCESS",
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(paymentTransactions.transactionId, transactionId))
        .returning();

      dbUpdated = updatedRow ?? null;

      if (!dbUpdated) {
        throw new Error("Payment not found");
      }

      if (dbUpdated.status === "completed") {
        const userId = dbUpdated.userId;
        let currentVendorId = dbUpdated.vendorId;

        // Fetch the plan first
        let [plan] = await tx
          .select()
          .from(vendorPlans)
          .where(eq(vendorPlans.name, dbUpdated.planCode))
          .limit(1);

        if (!plan) {
          console.log(
            `Plan ${dbUpdated.planCode} not found in DB. Auto-creating it...`
          );
          const defaultPrices = {
            pro: { monthly: "0.01", priority: 2 },
            premium: { monthly: "0.02", priority: 3 },
            free: { monthly: "0", priority: 1 },
          };
          const pCode =
            (dbUpdated.planCode as "free" | "pro" | "premium") || "pro";
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

        // Handle case where vendorId is null
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
                eq(vendorRequests.status, "pending")
              ),
            });

            const [newVendor] = await tx
              .insert(vendors)
              .values({
                userId: userId,
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
          if (dbUpdated.billingCycle === "annual") {
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
                eq(vendorSubscriptions.status, "active")
              )
            );

          await tx.insert(vendorSubscriptions).values({
            vendorId: currentVendorId,
            planId: plan.id,
            billingCycle:
              dbUpdated.billingCycle === "annual" ? "yearly" : "monthly",
            amount: dbUpdated.amount,
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
      }
    });

    return NextResponse.json({ success: true });
  } catch (dbError) {
    console.error("Payment approve error:", dbError);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
