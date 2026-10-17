import nodemailer from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer';

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

const transporter =
  user && pass
    ? nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
    : null;

export type EmailAttachment = Attachment;

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}) {
  if (!transporter || !user) {
    console.warn('GMAIL_USER / GMAIL_APP_PASSWORD not set. Skipping email to:', to);
    return { success: false, skipped: true };
  }

  try {
    const info = await transporter.sendMail({
      // Gmail always sends from the authenticated account
      from: `"MWD" <${user}>`,
      to,
      replyTo,
      subject,
      html,
      text,
      attachments,
    });
    return { success: true, id: info.messageId };
  } catch (error) {
    console.error('Failed to send email', error);
    return { success: false, error };
  }
}
