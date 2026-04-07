import { NodemailerProvider } from "../../email/providers/nodemailer.provider";
import { getVerificationEmailTemplate } from "../../email/templates/verification.template";
import { getPasswordResetEmailTemplate } from "@/lib/email/templates/password-reset.template";
import {
  getClassInvitationEmailTemplate,
  ClassInvitationData,
} from "@/lib/email/templates/class-invitation.template";
import { getTeacherInvitationEmailTemplate } from "@/lib/email/templates/teacher-invitation.template";
import { getVendorApprovedEmailTemplate } from "@/lib/email/templates/vendor-approved.template";
import { getVendorRejectedEmailTemplate } from "@/lib/email/templates/vendor-rejected.template";
import {
  getAdminInvitationEmailTemplate,
  getVipVendorInvitationEmailTemplate,
} from "@/lib/email/templates/admin-invitation.template";

export class EmailService {
  private static provider = new NodemailerProvider();

  static async sendPasswordResetEmail(
    email: string,
    code: string,
    userName?: string,
  ): Promise<void> {
    const html = getPasswordResetEmailTemplate(code, userName);
    await this.provider.sendEmail(email, "Password Reset", html);
  }

  static async sendVerificationEmail(
    email: string,
    code: string,
    userName?: string,
  ): Promise<void> {
    const html = getVerificationEmailTemplate(code, userName);
    await this.provider.sendEmail(email, "Email Verification", html);
  }
  static async sendClassInvitationEmail(
    email: string,
    data: ClassInvitationData,
  ): Promise<void> {
    const html = getClassInvitationEmailTemplate(data);
    const subject = `You've been invited to join ${data.className}`;
    await this.provider.sendEmail(email, subject, html);
  }
  static async sendInvitationEmail(
    email: string,
    link: string,
    options?: { role?: string; name?: string },
  ): Promise<void> {
    const roleLabel = options?.role
      ? options.role.charAt(0).toUpperCase() + options.role.slice(1)
      : "Teacher";
    const displayName = options?.name || "there";

    const html = getTeacherInvitationEmailTemplate(
      link,
      roleLabel,
      displayName,
    );

    const subject = `You're invited as a ${roleLabel} on Watmean`;
    await this.provider.sendEmail(email, subject, html);
  }
  static async sendAdminInvitationEmail(
    email: string,
    token: string,
    origin?: string,
  ): Promise<void> {
    const baseUrl =
      origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const link = `${baseUrl}/admin/register?token=${token}`;
    const subject = `You're invited to be an Admin on PsarPulse KH`;
    const html = getAdminInvitationEmailTemplate(link);
    await this.provider.sendEmail(email, subject, html);
  }

  static async sendVipVendorInvitationEmail(
    email: string,
    token: string,
    origin?: string,
  ): Promise<void> {
    const baseUrl =
      origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const link = `${baseUrl}/vendor/vip?token=${token}`;
    const subject = `You're invited as a VIP Vendor on PsarPulse KH`;
    const html = getVipVendorInvitationEmailTemplate(link);
    await this.provider.sendEmail(email, subject, html);
  }

  static async sendVendorApprovedEmail(
    email: string,
    activationLink: string,
    businessName: string,
  ): Promise<void> {
    const html = getVendorApprovedEmailTemplate(businessName, activationLink);
    await this.provider.sendEmail(
      email,
      "🎉 Your Vendor Application is Approved — Activate Your Account",
      html,
    );
  }

  static async sendVendorRejectedEmail(
    email: string,
    businessName: string,
    reason?: string,
  ): Promise<void> {
    const html = getVendorRejectedEmailTemplate(businessName, reason);
    await this.provider.sendEmail(
      email,
      "Update on Your PsarPulse Vendor Application",
      html,
    );
  }
}
