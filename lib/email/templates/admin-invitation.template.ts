import { escapeHtml, renderMjmlTemplate } from "./mjml-layout";

export const getAdminInvitationEmailTemplate = (link: string): string => {
  const safeLink = escapeHtml(link);

  const content = `
  <mj-section padding="20px 24px 0">
    <mj-column>
      <mj-text align="center" font-size="22px" font-weight="700">Admin Invitation</mj-text>
      <mj-text align="center" color="#555555">You have been invited to join the PsarPulse KH administrative team.</mj-text>
    </mj-column>
  </mj-section>

  <mj-section padding="8px 24px">
    <mj-column>
      <mj-button href="${safeLink}">Accept Invitation</mj-button>
      <mj-text align="center" color="#666666" font-size="12px">This link expires in 24 hours.</mj-text>
    </mj-column>
  </mj-section>
  `;

  return renderMjmlTemplate({
    subject: "Admin Invitation",
    content,
  });
};

export const getVipVendorInvitationEmailTemplate = (link: string): string => {
  const safeLink = escapeHtml(link);

  const content = `
  <mj-section padding="20px 24px 0">
    <mj-column>
      <mj-text align="center" font-size="22px" font-weight="700">VIP Vendor Invitation</mj-text>
      <mj-text align="center" color="#555555">You have been invited to join PsarPulse KH as a VIP Vendor.</mj-text>
    </mj-column>
  </mj-section>

  <mj-section padding="8px 24px">
    <mj-column>
      <mj-button href="${safeLink}">Complete Setup</mj-button>
      <mj-text align="center" color="#666666" font-size="12px">This link expires in 24 hours.</mj-text>
    </mj-column>
  </mj-section>
  `;

  return renderMjmlTemplate({
    subject: "VIP Vendor Invitation",
    content,
  });
};
