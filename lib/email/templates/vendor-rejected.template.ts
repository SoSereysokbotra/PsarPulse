export const getVendorRejectedEmailTemplate = (
  businessName: string,
  reason?: string
): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">        
  <title>Update on Your Vendor Application</title>
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
      background-color: #fee2e2;
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
    .description { font-size: 15px; color: #64748b; margin-bottom: 32px; line-height: 1.7; }
    .reason-box {
      background-color: #f8fafc;
      padding: 16px 20px;
      border-left: 4px solid #ef4444;
      border-radius: 4px;
      text-align: left;
      margin-top: 24px;
      font-size: 14px;
      color: #334155;
    }
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
        <span class="badge">Application Update</span>
      </div>

      <div class="content">
        <h1>Update for ${businessName}</h1>
        <p class="description">
          Thank you for applying to become a vendor on PsarPulse. After careful consideration, we regret to inform you that your application has not been approved at this time.
        </p>

        ${reason ? `
        <div class="reason-box">
          <strong>Reason for decision:</strong><br>
          ${reason}
        </div>
        ` : ''}

        <p class="description" style="margin-top: 24px; margin-bottom: 0;">
          If you have any questions or would like to submit a new application, please feel free to reach out to our support team.
        </p>
      </div>

      <hr class="divider">
      <div class="footer">
        <p class="footer-text">
          &copy; ${new Date().getFullYear()} PsarPulse &bull; Phnom Penh, Cambodia<br>
          Need help? Contact us at support@psarpulse.com
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
