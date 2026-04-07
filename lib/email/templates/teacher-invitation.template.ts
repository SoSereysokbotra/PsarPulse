import { escapeHtml, renderMjmlTemplate } from "./mjml-layout";

export const getTeacherInvitationEmailTemplate = (
  inviteLink: string,
  roleLabel?: string,
  displayName?: string,
): string => {
  const role = escapeHtml(roleLabel || "Teacher");
  const name = escapeHtml(displayName || "there");
  const safeInviteLink = escapeHtml(inviteLink);

  const content = `
  <mj-section padding="20px 24px 0">
    <mj-column>
      <mj-text align="center" font-size="22px" font-weight="700">Welcome, ${name}!</mj-text>
      <mj-text align="center" color="#555555">You have been invited to join as a ${role}. Use the button below to create your account.</mj-text>
    </mj-column>
  </mj-section>

  <mj-section padding="8px 24px">
    <mj-column>
      <mj-button href="${safeInviteLink}">Create Account</mj-button>
      <mj-text align="center" color="#666666" font-size="12px">This invitation expires in 30 days.</mj-text>
    </mj-column>
  </mj-section>
  `;

  return renderMjmlTemplate({
    subject: "Teacher Invitation",
    content,
  });
};
