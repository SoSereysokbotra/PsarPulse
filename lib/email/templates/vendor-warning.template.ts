import { escapeHtml, renderMjmlTemplate } from "./mjml-layout";

export const getVendorWarningEmailTemplate = (
  businessName: string,
  warningMessage: string,
  subject: string,
): string => {
  const safeBusinessName = escapeHtml(businessName);
  const safeMessage = escapeHtml(warningMessage).replace(/\n/g, "<br />");
  const safeSubject = escapeHtml(subject);

  const content = `
  <mj-section padding="20px 24px 0">
    <mj-column>
      <mj-text align="center" font-size="13px" font-weight="700" color="#b45309">⚠ OFFICIAL WARNING</mj-text>
      <mj-text align="center" font-size="22px" font-weight="700">Notice for ${safeBusinessName}</mj-text>
      <mj-text align="center" color="#555555">This is an official notice from the PsarPulse Admin Team regarding your vendor account.</mj-text>
    </mj-column>
  </mj-section>

  <mj-section padding="8px 24px">
    <mj-column>
      <mj-section padding="16px" border-radius="8px" background-color="#fffbeb">
        <mj-column>
          <mj-text font-size="13px" font-weight="700" color="#92400e" padding-bottom="4px">
            Subject: ${safeSubject}
          </mj-text>
          <mj-text color="#78350f" font-size="14px" line-height="22px">
            ${safeMessage}
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-column>
  </mj-section>

  <mj-section padding="8px 24px 24px">
    <mj-column>
      <mj-divider border-color="#f3f4f6" border-width="1px" />
      <mj-text align="center" color="#888888" font-size="12px">
        If you believe this was sent in error or have questions, please contact our support team.<br />
        — PsarPulse Admin Team
      </mj-text>
    </mj-column>
  </mj-section>
  `;

  return renderMjmlTemplate({
    subject: `[Warning] ${safeSubject}`,
    content,
  });
};
