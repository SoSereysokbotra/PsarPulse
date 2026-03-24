export const getVendorRejectedEmailTemplate = (
  businessName: string,
  reason?: string
): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vendor Application Verification Unsuccessful</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .wrapper { width: 100%; padding: 48px 0; background-color: #f8fafc; }
    .container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .header {
      padding: 32px 40px 0;
      text-align: center;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 800;
      color: #FF5A36;
      letter-spacing: -0.02em;
    }
    .badge {
      display: inline-block;
      margin-top: 28px;
      padding: 6px 16px;
      background-color: #fef2f2;
      color: #991b1b;
      font-size: 13px;
      font-weight: 600;
      border-radius: 999px;
      letter-spacing: 0.02em;
    }
    .content { padding: 32px 40px 40px; text-align: center; }
    h1 {
      font-size: 26px;
      font-weight: 700;
      color: #111827;
      margin: 16px 0 12px;
    }
    .description { font-size: 15px; color: #64748b; margin-bottom: 24px; line-height: 1.7; }
    .reason-box {
      padding: 16px 20px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      text-align: left;
      margin-bottom: 32px;
    }
    .reason-label {
      font-size: 12px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
      display: block;
    }
    .reason-text { font-size: 14px; color: #475569; margin: 0; }
    .divider { border: none; border-top: 1px solid #f1f5f9; margin: 32px 0 0; }
    .footer { padding: 24px 40px; text-align: center; }
    .footer-text { font-size: 12px; color: #94a3b8; margin: 0; }
    @media only screen and (max-width: 520px) {
      .content { padding: 28px 24px 32px !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <span class="logo-text">PsarPulse</span>
        <br>
        <span class="badge">Verification Unsuccessful</span>
      </div>

      <div class="content">
        <h1>Regarding your application for ${businessName}</h1>
        <p class="description">
          Thank you for your interest in joining the PsarPulse marketplace. At this time, our team has decided not to move forward with your vendor application.
        </p>

        ${reason ? `
        <div class="reason-box">
          <span class="reason-label">Reason for rejection</span>
          <p class="reason-text">${reason}</p>
        </div>
        ` : ""}

        <p class="description" style="margin-bottom: 0;">
          While we cannot approve your current request, you are welcome to apply again in the future if your business details or services change based on our requirements.
        </p>
      </div>

      <hr class="divider">
      <div class="footer">
        <p class="footer-text">
          &copy; ${new Date().getFullYear()} PsarPulse &bull; Phnom Penh, Cambodia<br>
          Have questions? Contact us at support@psarpulse.com
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
