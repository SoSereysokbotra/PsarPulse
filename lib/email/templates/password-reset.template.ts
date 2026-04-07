import { escapeHtml, renderMjmlTemplate } from "./mjml-layout";

export const getPasswordResetEmailTemplate = (
  code: string,
  userName?: string,
): string => {
  const safeCode = escapeHtml(code);
  const displayName = userName ? escapeHtml(userName) : "User";
  const APP_NAME = "PsarPulse";

  const content = `
  <mj-section padding="0 24px">
    <mj-column>
      <mj-text font-size="20px" font-weight="700" color="#000000" padding-bottom="20px">Reset Your ${APP_NAME} Account Password</mj-text>
      <mj-text padding-bottom="20px">Dear ${displayName},</mj-text>
      <mj-text padding-bottom="10px">We received a request to reset your password for your account on ${APP_NAME}.</mj-text>
      <mj-text padding-bottom="30px">To complete the process, please use the following One Time Password (OTP) on ${APP_NAME} when prompted:</mj-text>
      
      <mj-text align="center" font-size="36px" font-weight="700" letter-spacing="4px" padding-bottom="30px">${safeCode}</mj-text>
      
      <mj-text padding-bottom="25px">This OTP will expire in 10 minutes.</mj-text>
      
      <mj-text font-size="13px" line-height="20px" color="#333333" padding-bottom="20px">
        Don't share this OTP with anyone. ${APP_NAME} takes your account security very seriously. ${APP_NAME} Customer Service will never ask you to disclose or verify your ${APP_NAME} password, OTP, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click on the link, instead, report the email to ${APP_NAME} for investigation.
      </mj-text>
      
      <mj-text padding-bottom="5px">Thank you,</mj-text>
      <mj-text font-weight="700">${APP_NAME}</mj-text>
    </mj-column>
  </mj-section>

  <mj-section padding="30px 24px 0">
    <mj-column>
      <mj-text align="center" font-size="12px" color="#999999" font-style="italic" line-height="18px">
        If you did not request a password reset for your ${APP_NAME} account, please ignore this email. If you are concerned about your account's security, please visit our Help page to contact us.
      </mj-text>
    </mj-column>
  </mj-section>
  `;

  return renderMjmlTemplate({
    subject: `Reset Your ${APP_NAME} Password`,
    content,
  });
};
