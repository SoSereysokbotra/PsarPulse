import { escapeHtml, renderMjmlTemplate } from "./mjml-layout";

export interface ClassInvitationData {
  className: string;
  inviteLink: string;
}

export const getClassInvitationEmailTemplate = (
  data: ClassInvitationData,
): string => {
  const safeClassName = escapeHtml(data.className);
  const safeInviteLink = escapeHtml(data.inviteLink);

  const content = `
  <mj-section padding="20px 24px 0">
    <mj-column>
      <mj-text align="center" font-size="22px" font-weight="700">You have been invited to a class</mj-text>
      <mj-text align="center" font-size="18px" font-weight="700" color="#29B28D">${safeClassName}</mj-text>
      <mj-text align="center" color="#555555">Accept your invitation to join this class.</mj-text>
    </mj-column>
  </mj-section>

  <mj-section padding="8px 24px">
    <mj-column>
      <mj-button href="${safeInviteLink}">Accept Invitation</mj-button>
      <mj-text align="center" color="#666666" font-size="12px">This invitation expires in 7 days.</mj-text>
    </mj-column>
  </mj-section>
  `;

  return renderMjmlTemplate({
    subject: "Class Invitation",
    content,
  });
};
