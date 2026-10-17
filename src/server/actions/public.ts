'use server';

import { z } from 'zod';
import { nanoid } from 'nanoid';
import { db } from '@/db';
import { inquiries, inquiryAttachments } from '@/db/schema';
import { sendEmail, type EmailAttachment } from '@/lib/email';
import { adminQuoteEmail, customerQuoteEmail, normalizeTelegram, type QuoteEmailData } from '@/lib/email-templates';
import { extensionFor, readImageFile, type ImageType } from '@/lib/images';

const MAX_PHOTOS = 5;

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), text(max).optional());

const quoteSchema = z.object({
  name: text(200).min(2, 'Name is required'),
  email: z.string().trim().max(320).email('Invalid email address'),
  phone: optionalText(50),
  telegram: optionalText(100),
  serviceOfInterest: optionalText(100),
  budgetRange: optionalText(100),
  timeline: optionalText(100),
  projectDescription: text(5000).min(10, 'Please provide more details about your project'),
});

export type QuoteState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  reference?: string;
  /** Echoed back so the form does not lose what the visitor typed when validation fails */
  values?: Record<string, string>;
};

const FIELD_NAMES = ['name', 'email', 'phone', 'telegram', 'serviceOfInterest', 'budgetRange', 'timeline', 'projectDescription'] as const;

export async function submitQuoteRequest(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Honeypot: real users never fill this hidden field
  if (formData.get('website')) {
    return { success: true, message: 'Thank you! We will contact you soon.' };
  }

  const values: Record<string, string> = {};
  for (const key of FIELD_NAMES) {
    const v = formData.get(key);
    if (typeof v === 'string') values[key] = v;
  }

  const parsed = quoteSchema.safeParse({
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? undefined,
    telegram: formData.get('telegram') ?? undefined,
    serviceOfInterest: formData.get('serviceOfInterest') ?? undefined,
    budgetRange: formData.get('budgetRange') ?? undefined,
    timeline: formData.get('timeline') ?? undefined,
    projectDescription: formData.get('projectDescription') ?? '',
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
      message: 'Please correct the errors in the form.',
      values,
    };
  }

  // Photos (optional). Validate by file signature, not by the browser-reported type.
  const files = formData
    .getAll('photos')
    .filter((f): f is File => typeof f !== 'string' && f.size > 0);

  if (files.length > MAX_PHOTOS) {
    return { success: false, message: `Please attach at most ${MAX_PHOTOS} photos.`, values };
  }

  const photos: { buffer: Buffer; contentType: ImageType; filename: string }[] = [];
  for (const file of files) {
    const result = await readImageFile(file);
    if (!result.ok) return { success: false, message: result.error, values };
    const ext = extensionFor(result.contentType);
    photos.push({
      buffer: result.buffer,
      contentType: result.contentType,
      filename: `photo-${photos.length + 1}.${ext}`,
    });
  }

  const data = parsed.data;
  const telegram = normalizeTelegram(data.telegram);
  const reference = `REF-${nanoid(8).toUpperCase()}`;

  let inquiryId: number;
  try {
    inquiryId = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(inquiries)
        .values({ reference, ...data, telegram: telegram ?? data.telegram ?? null })
        .returning({ id: inquiries.id });

      if (photos.length > 0) {
        await tx.insert(inquiryAttachments).values(
          photos.map((p) => ({
            inquiryId: row.id,
            filename: p.filename,
            contentType: p.contentType,
            size: p.buffer.length,
            data: p.buffer,
          })),
        );
      }
      return row.id;
    });
  } catch (error) {
    console.error('Failed to save inquiry', error);
    return { success: false, message: 'An unexpected error occurred. Please try again later.', values };
  }

  // Emails are best-effort: never fail the request because of them
  try {
    const attachments: EmailAttachment[] = photos.map((p, i) => ({
      filename: p.filename,
      content: p.buffer,
      contentType: p.contentType,
      cid: `photo${i + 1}`,
    }));

    const emailData: QuoteEmailData = {
      reference,
      inquiryId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      telegram: data.telegram,
      serviceOfInterest: data.serviceOfInterest,
      budgetRange: data.budgetRange,
      timeline: data.timeline,
      projectDescription: data.projectDescription,
      photoCids: attachments.map((a) => a.cid as string),
      photoCount: photos.length,
      submittedAt: new Date(),
    };

    const adminTo = process.env.ADMIN_NOTIFY_EMAIL;

    const customer = customerQuoteEmail(emailData);
    await sendEmail({
      to: data.email,
      replyTo: adminTo || undefined,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
      attachments,
    });

    if (adminTo) {
      const admin = adminQuoteEmail(emailData);
      await sendEmail({
        to: adminTo,
        replyTo: data.email,
        subject: admin.subject,
        html: admin.html,
        text: admin.text,
        attachments,
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
