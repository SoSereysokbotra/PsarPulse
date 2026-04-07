import mjml2html from "mjml";

type LayoutOptions = {
  subject: string;
  content: string;
};

const APP_NAME = "PsarPulse";
const COMPANY_ADDRESS = "Phnom Penh, Cambodia";

function getWebsiteHref(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL || "https://psarpulse.com";
  if (configured.startsWith("http://") || configured.startsWith("https://")) {
    return configured;
  }
  return `https://${configured}`;
}

function getWebsiteHost(): string {
  return getWebsiteHref()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

function getLogoUrl(): string {
  return `${getWebsiteHref().replace(/\/$/, "")}/icons/icon-192x192.png`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderMjmlTemplate({
  subject,
  content,
}: LayoutOptions): string {
  const year = new Date().getFullYear();
  const websiteHref = getWebsiteHref();
  const websiteHost = getWebsiteHost();
  const logoUrl = getLogoUrl();

  const markup = `
<mjml>
  <mj-head>
    <mj-title>${subject}</mj-title>
    <mj-attributes>
      <mj-all font-family="Inter, Arial, sans-serif" />
      <mj-text color="#1A1A1A" font-size="14px" line-height="24px" />
      <mj-button background-color="#111111" color="#ffffff" border-radius="8px" font-weight="700" />
    </mj-attributes>
    <mj-style>
      .no-link-style img {
        border: 0;
        outline: none;
        text-decoration: none;
      }
    </mj-style>
  </mj-head>
  <mj-body background-color="#ffffff">
    <mj-section padding="40px 24px 20px">
      <mj-column>
        <mj-image href="${websiteHref}" src="${logoUrl}" alt="${APP_NAME}" width="60px" align="center" css-class="no-link-style" />
      </mj-column>
    </mj-section>

    ${content}

    <mj-section padding="40px 24px 20px">
      <mj-column>
        <mj-text font-size="12px" color="#999999" align="center" font-weight="500">
          <a href="${websiteHref}" style="color:#555555; text-decoration:none;">Help</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="${websiteHref}" style="color:#555555; text-decoration:none;">Email security tips</a>
        </mj-text>
        <mj-text font-size="12px" color="#999999" align="center" padding-top="0">
          Copyright &copy; ${year} ${APP_NAME}<br />
          ${COMPANY_ADDRESS}<br />
          <a href="${websiteHref}" style="color:#999999; text-decoration:none;">${websiteHost}</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

  const { html, errors } = mjml2html(markup, { validationLevel: "soft" });
  if (errors.length > 0) {
    console.warn("[email][mjml] Template warnings:", errors);
  }
  return html;
}
