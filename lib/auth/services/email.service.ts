import { NodemailerProvider } from "../../email/providers/nodemailer.provider";
import { getVerificationEmailTemplate } from "@/lib/email/templates/verification.template";
import { getPasswordResetEmailTemplate } from "@/lib/email/templates/password-reset.template";
import {
  getClassInvitationEmailTemplate,
  ClassInvitationData,
} from "@/lib/email/templates/class-invitation.template";
import { getTeacherInvitationEmailTemplate } from "@/lib/email/templates/teacher-invitation.template";

export class EmailService {
  private static provider = new NodemailerProvider();

  static async sendPasswordResetEmail(
    email: string,
    code: string,
  ): Promise<void> {
    const html = getPasswordResetEmailTemplate(code);
    await this.provider.sendEmail(email, "Password Reset", html);
  }

  static async sendVerificationEmail(
    email: string,
    code: string,
  ): Promise<void> {
    const html = getVerificationEmailTemplate(code);
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
  ): Promise<void> {
    const link = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/register?token=${token}`;
    const subject = `You're invited to be an Admin on PsarPulse KH`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Admin Invitation</h2>
        <p>You have been invited to join the administrative team for PsarPulse KH.</p>
        <p>Please click the link below to set up your account.</p>
        <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
          Accept Invitation
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This link will expire in 24 hours.</p>
      </div>
    `;
    await this.provider.sendEmail(email, subject, html);
  }
}
