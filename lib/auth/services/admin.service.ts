import { VendorRequestRepository } from "@/lib/db/repositories/vendor_requests.repository";
import { InvitationRepository } from "@/lib/db/repositories/invitations.repository";
import { UserRepository } from "@/lib/db/repositories/example.repository";
import { EmailService } from "./email.service";
import { TokenUtil } from "../utils/token.util";
import { db } from "@/lib/db";
import { vendors, vendorPlans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export class AdminService {
  /**
   * Super Admin invites a new Admin
   */
  static async inviteAdmin(email: string, role: "admin", superAdminId: string) {
    // Generate an invitation token
    const token = crypto.randomUUID();
    
    // Create an invitation record
    await InvitationRepository.create({
      email,
      token,
      role,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send the email with the link+token
    await EmailService.sendAdminInvitationEmail(email, token);

    return { success: true, message: "Admin invitation sent successfully." };
  }

  /**
   * Admin approves a Vendor Request
   */
  static async approveVendorRequest(requestId: string, adminId: string) {
    const request = await VendorRequestRepository.findById(requestId);
    if (!request || request.status !== "pending") {
      return { success: false, message: "Invalid or already processed request." };
    }

    // Update the request status
    await VendorRequestRepository.updateStatus(requestId, "approved", adminId);

    // Update user status to active
    const user = await UserRepository.findById(request.userId);
    if (user) {
      await UserRepository.update(user.id, { status: "active", isVerified: true });
      
      // Assign the free plan by default
      const [freePlan] = await db.select().from(vendorPlans).where(eq(vendorPlans.name, "free"));
      
      if (freePlan) {
        // Create the vendor record
        await db.insert(vendors).values({
          userId: user.id,
          businessName: request.businessName,
          businessEmail: request.businessEmail,
          planId: freePlan.id,
          verificationStatus: "approved",
        });
      }
      
      // Generate an invitation/setup token for the vendor to set their password
      const token = crypto.randomUUID();
      
      await InvitationRepository.create({
        email: user.email,
        token,
        role: "vendor",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      // Send approval email with link to complete setup
      await EmailService.sendVendorApprovalEmail(user.email, token);
    }

    return { success: true, message: "Vendor request approved and email sent." };
  }

  /**
   * Admin rejects a Vendor Request
   */
  static async rejectVendorRequest(requestId: string, adminId: string, reason: string) {
    const request = await VendorRequestRepository.findById(requestId);
    if (!request || request.status !== "pending") {
      return { success: false, message: "Invalid or already processed request." };
    }

    // Update the request status
    await VendorRequestRepository.updateStatus(requestId, "rejected", adminId, reason);

    // Update user status
    const user = await UserRepository.findById(request.userId);
    if (user) {
      // We could mark them as deleted or rejected
      await UserRepository.update(user.id, { status: "deleted" });
      
      // Send rejection email
      await EmailService.sendVendorRejectionEmail(user.email, reason);
    }

    return { success: true, message: "Vendor request rejected and email sent." };
  }
}
