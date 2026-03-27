  import { NextResponse } from "next/server";
  import { updatePaymentStatus } from "@/lib/payments/transaction-store";
  import { and, eq } from "drizzle-orm";
  import { db } from "@/lib/db";
  import {
    paymentTransactions,
    vendorPlans,
    vendorSubscriptions,
    vendors,
    users,
    vendorRequests,
  } from "@/lib/db/schema";

  export async function POST(request: Request) {
    try {
      const signature = request.headers.get("x-bakong-signature") || "";
      const payload = await request.json();

      // In production validate webhook signature with process.env.BAKONG_WEBHOOK_SECRET.
      void signature;

      const transactionId = String(payload?.transactionId || "");
      const rawStatus = String(payload?.status || "").toUpperCase();

      if (!transactionId) {
        return NextResponse.json(
          { error: "transactionId is required" },
          { status: 400 },
        );
      }

      const normalizedStatus =
        rawStatus === "COMPLETED" || rawStatus === "SUCCESS"
          ? "completed"
          : rawStatus === "FAILED"
            ? "failed"
            : "pending";

      let dbUpdated = null;

      try {
        await db.transaction(async (tx) => {
          const [updatedRow] = await tx
            .update(paymentTransactions)
            .set({
              status: normalizedStatus,
              providerStatus: rawStatus || null,
              webhookPayload: payload,
              completedAt: normalizedStatus === "completed" ? new Date() : null,
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
                `Plan ${dbUpdated.planCode} not found in DB. Auto-creating it...`,
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

            // Handle case where vendorId is null (e.g. customer buying a plan)
            if (!currentVendorId && userId) {
              console.log(`[Webhook] No vendorId in transaction for userId: ${userId}.`);
              
              const existingVendor = await tx.query.vendors.findFirst({
                where: eq(vendors.userId, userId),
              });

              if (existingVendor) {
                currentVendorId = existingVendor.id;
              } else {
                console.log(`[Webhook] Creating new vendor record for userId: ${userId}`);
                
                // Fetch user data to get email if needed
                const user = await tx.query.users.findFirst({
                  where: eq(users.id, userId),
                });

                // Fetch pending vendor request to get business details if available
                const pendingReq = await tx.query.vendorRequests.findFirst({
                  where: and(
                    eq(vendorRequests.userId, userId),
                    eq(vendorRequests.status, "pending")
                  ),
                });

                // Create vendor record
                const [newVendor] = await tx.insert(vendors).values({
                  userId: userId,
                  businessName: pendingReq?.businessName || (user?.fullName ? `${user.fullName}'s Store` : "My Store"),
                  businessEmail: pendingReq?.businessEmail || user?.email || "vendor@example.com",
                  planId: plan.id,
                  subscriptionStatus: "active",
                  status: "active",
                }).returning();
                
                currentVendorId = newVendor.id;

                // Update user role to vendor
                await tx.update(users)
                  .set({ role: "vendor" })
                  .where(eq(users.id, userId));

                // Mark request as approved if it exists
                if (pendingReq) {
                  await tx.update(vendorRequests)
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
                    eq(vendorSubscriptions.status, "active"),
                  ),
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

          if (dbUpdated.status === "completed") {
            console.log(`Payment confirmed: ${transactionId}`);
          }
        });
      } catch (dbError) {
        console.warn("Payment webhook DB persistence warning:", dbError);

        const updated = updatePaymentStatus(transactionId, normalizedStatus);
        if (!updated) {
          return NextResponse.json(
            { error: "Payment not found" },
            { status: 404 },
          );
        }

        if (updated.status === "completed") {
          console.log(`Payment confirmed: ${transactionId}`);
        }
      }

      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
