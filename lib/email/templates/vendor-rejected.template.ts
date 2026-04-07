import { escapeHtml, renderMjmlTemplate } from "./mjml-layout";

export const getVendorRejectedEmailTemplate = (
  businessName: string,
  reason?: string,
): string => {
  const safeBusinessName = escapeHtml(businessName);
  const safeReason = reason ? escapeHtml(reason) : "";

  const reasonBlock = safeReason
    ? `<mj-text align="left" color="#B42318"><strong>Reason for decision:</strong><br />${safeReason}</mj-text>`
    : "";

  const content = `
  <mj-section padding="20px 24px 0">
    <mj-column>
      <mj-text align="center" font-size="13px" font-weight="700" color="#B42318">APPLICATION UPDATE</mj-text>
      <mj-text align="center" font-size="22px" font-weight="700">Update for ${safeBusinessName}</mj-text>
      <mj-text align="center" color="#555555">Thank you for applying. After review, your vendor application was not approved at this time.</mj-text>
      ${reasonBlock}
      <mj-text align="center" color="#666666">You can contact support for help and apply again later.</mj-text>
    </mj-column>
  </mj-section>
  `;

  return renderMjmlTemplate({
    subject: "Update on Your Vendor Application",
    content,
  });
};
