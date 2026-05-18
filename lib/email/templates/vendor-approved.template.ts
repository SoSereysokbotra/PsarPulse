import { escapeHtml, renderMjmlTemplate } from "./mjml-layout";

export const getVendorApprovedEmailTemplate = (
  businessName: string,
  activationLink: string,
): string => {
  const safeBusinessName = escapeHtml(businessName);
  const safeActivationLink = escapeHtml(activationLink);

  const content = `
  <mj-section padding="20px 24px 0">
    <mj-column>
      <mj-text align="center" font-size="13px" font-weight="700" color="#067647">APPLICATION APPROVED</mj-text>
      <mj-text align="center" font-size="22px" font-weight="700">Welcome aboard, ${safeBusinessName}!</mj-text>
      <mj-text align="center" color="#555555">Your vendor application was approved. Activate your account to start using your vendor dashboard.</mj-text>
    </mj-column>
  </mj-section>

  <mj-section padding="8px 24px">
    <mj-column>
      <mj-button href="${safeActivationLink}">Activate My Account</mj-button>
      <mj-text align="center" color="#666666" font-size="12px">This link expires in 24 hours.</mj-text>
    </mj-column>
  </mj-section>
  `;

  return renderMjmlTemplate({
    subject: "Your Vendor Application is Approved",
    content,
  });
};
