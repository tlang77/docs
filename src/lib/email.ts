import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Mountain Retreat Realty <noreply@mountainretreatrealty.com>'
const LEADS_EMAIL = process.env.INQUIRY_NOTIFICATION_EMAIL ?? 'leads@mountainretreatrealty.com'

interface InquiryNotificationParams {
  agentName: string
  agentEmail: string
  contactName: string
  contactEmail: string
  contactPhone?: string | null
  propertyAddress: string
  propertyId: string
  message: string
}

export async function sendInquiryNotification(params: InquiryNotificationParams) {
  await resend.emails.send({
    from: FROM,
    to: [params.agentEmail, LEADS_EMAIL],
    subject: `New Inquiry: ${params.propertyAddress}`,
    html: `
      <h2>New Property Inquiry</h2>
      <p><strong>Property:</strong> ${params.propertyAddress}</p>
      <hr />
      <p><strong>From:</strong> ${params.contactName}</p>
      <p><strong>Email:</strong> ${params.contactEmail}</p>
      ${params.contactPhone ? `<p><strong>Phone:</strong> ${params.contactPhone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <blockquote>${params.message}</blockquote>
      <hr />
      <p><a href="${process.env.NEXTAUTH_URL}/admin/inquiries">View in CRM</a></p>
    `,
  })
}

export async function sendInquiryConfirmation(params: {
  contactName: string
  contactEmail: string
  propertyAddress: string
  agentName: string
  agentPhone: string
}) {
  await resend.emails.send({
    from: FROM,
    to: params.contactEmail,
    subject: `We received your inquiry about ${params.propertyAddress}`,
    html: `
      <h2>Thank you, ${params.contactName}!</h2>
      <p>We received your inquiry about <strong>${params.propertyAddress}</strong>.</p>
      <p>Your agent, <strong>${params.agentName}</strong>, will be in touch shortly.</p>
      <p>You can also reach them directly at ${params.agentPhone}.</p>
      <br />
      <p>— Mountain Retreat Realty</p>
    `,
  })
}
