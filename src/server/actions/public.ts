'use server';

import { z } from 'zod';
import { nanoid } from 'nanoid';
import { db } from '@/db';
import { inquiries } from '@/db/schema';
import { sendEmail } from '@/lib/email';

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), text(max).optional());

const quoteSchema = z.object({
  name: text(200).min(2, 'Name is required'),
  email: z.string().trim().max(320).email('Invalid email address'),
  phone: optionalText(50),
  serviceOfInterest: optionalText(100),
  budgetRange: optionalText(100),
  projectDescription: text(5000).min(10, 'Please provide more details about your project'),
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type QuoteState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  reference?: string;
};

export async function submitQuoteRequest(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Honeypot: real users never fill this hidden field
  if (formData.get('website')) {
    return { success: true, message: 'Thank you! We will contact you soon.' };
  }

  const parsed = quoteSchema.safeParse({
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? undefined,
    serviceOfInterest: formData.get('serviceOfInterest') ?? undefined,
    budgetRange: formData.get('budgetRange') ?? undefined,
    projectDescription: formData.get('projectDescription') ?? '',
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
      message: 'Please correct the errors in the form.',
    };
  }

  const data = parsed.data;
  const reference = `REF-${nanoid(8).toUpperCase()}`;

  try {
    await db.insert(inquiries).values({ reference, ...data });
  } catch (error) {
    console.error('Failed to save inquiry', error);
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
  }

  // Emails are best-effort: never fail the request because of them
  try {
    await sendEmail({
      to: data.email,
      subject: `We received your request (${reference})`,
      html: `<p>Hi ${escapeHtml(data.name)},</p><p>Thanks for reaching out. Your reference is <strong>${reference}</strong>. We will get back to you soon.</p>`,
    });
    if (process.env.ADMIN_NOTIFY_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `New inquiry ${reference}`,
        html: `<p><strong>${escapeHtml(data.name)}</strong> (${escapeHtml(data.email)})</p><p>${escapeHtml(data.projectDescription)}</p>`,
      });
    }
  } catch (error) {
    console.error('Failed to send inquiry emails', error);
  }

  return {
    success: true,
    message: `Thank you! Your inquiry reference is ${reference}. We will contact you soon.`,
    reference,
  };
}
