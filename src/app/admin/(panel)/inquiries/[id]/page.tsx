import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, desc, eq } from 'drizzle-orm';
import { ArrowLeft, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { db } from '@/db';
import { inquiries, inquiryAttachments, inquiryNotes } from '@/db/schema';
import { addInquiryNote, updateInquiryStatus } from '@/server/actions/admin';
import { Card, CardTitle, PageHeader, STATUS_STYLES, StatusBadge, inputClass } from '@/components/admin/ui';
import { normalizeTelegram, whatsappLinkFor } from '@/lib/email-templates';

export const dynamic = 'force-dynamic';

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="grid gap-1 border-b border-gray-200 px-5 py-3 sm:grid-cols-[10rem_1fr]">
      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiryId = Number(id);
  if (!Number.isInteger(inquiryId)) notFound();

  const [inq] = await db.select().from(inquiries).where(eq(inquiries.id, inquiryId)).limit(1);
  if (!inq) notFound();

  const [photos, notes] = await Promise.all([
    db
      .select({ id: inquiryAttachments.id, filename: inquiryAttachments.filename, size: inquiryAttachments.size })
      .from(inquiryAttachments)
      .where(eq(inquiryAttachments.inquiryId, inquiryId))
      .orderBy(asc(inquiryAttachments.id)),
    db.select().from(inquiryNotes).where(eq(inquiryNotes.inquiryId, inquiryId)).orderBy(desc(inquiryNotes.createdAt)),
  ]);

  const tg = normalizeTelegram(inq.telegram);
  const wa = whatsappLinkFor(inq.phone);
  const btn = 'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:opacity-90';

  return (
    <div>
      <Link href="/admin/inquiries" className="mb-4 inline-flex items-center gap-1 text-sm underline" style={{ color: 'inherit' }}>
        <ArrowLeft size={14} aria-hidden /> All requests
      </Link>

      <PageHeader kicker={inq.reference} title={inq.name} subtitle={`Received ${new Date(inq.createdAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}`} action={<StatusBadge status={inq.status} />} />

      <div className="mb-6 flex flex-wrap gap-3">
        <a href={`mailto:${inq.email}?subject=${encodeURIComponent(`Your quotation ${inq.reference}`)}`} className={`${btn} bg-red-600`} style={{ color: '#fff' }}>
          <Mail size={16} aria-hidden /> Reply by email
        </a>
        {tg && (
          <a href={`https://t.me/${tg}`} target="_blank" rel="noopener noreferrer" className={btn} style={{ background: '#229ED9', color: '#fff' }}>
            <Send size={16} aria-hidden /> Telegram
          </a>
        )}
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={btn} style={{ background: '#25D366', color: '#fff' }}>
            <MessageCircle size={16} aria-hidden /> WhatsApp
          </a>
        )}
        {inq.phone && (
          <a href={`tel:${inq.phone.replace(/\s+/g, '')}`} className={`${btn} bg-black`} style={{ color: '#fff' }}>
            <Phone size={16} aria-hidden /> Call
          </a>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardTitle>Request details</CardTitle>
            <dl>
              <Detail label="Email">{inq.email}</Detail>
              <Detail label="Phone">{inq.phone}</Detail>
              <Detail label="Telegram">{inq.telegram ? (tg ? `@${tg}` : inq.telegram) : null}</Detail>
              <Detail label="Service">{inq.serviceOfInterest}</Detail>
              <Detail label="Budget">{inq.budgetRange}</Detail>
              <Detail label="Timeline">{inq.timeline}</Detail>
              <Detail label="Description">
                <p className="whitespace-pre-wrap leading-relaxed">{inq.projectDescription}</p>
              </Detail>
            </dl>
          </Card>

          <Card>
            <CardTitle>Customer photos ({photos.length})</CardTitle>
            {photos.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">The customer did not attach any photos.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
                {photos.map((p) => (
                  <a key={p.id} href={`/api/admin/attachments/${p.id}`} target="_blank" rel="noopener noreferrer" className="block border border-gray-300 bg-gray-50 hover:border-red-600">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/admin/attachments/${p.id}`} alt={p.filename ?? 'Customer photo'} className="aspect-square w-full object-cover" />
                  </a>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardTitle>Status</CardTitle>
            <form
              className="space-y-3 p-5"
              action={async (formData: FormData) => {
                'use server';
                await updateInquiryStatus(inquiryId, String(formData.get('status')));
              }}
            >
              <select name="status" defaultValue={inq.status} className={inputClass}>
                {Object.entries(STATUS_STYLES).map(([key, v]) => (
                  <option key={key} value={key}>
                    {v.label}
                  </option>
                ))}
              </select>
              <button type="submit" className="w-full bg-black px-4 py-2.5 text-sm font-semibold hover:bg-red-600" style={{ color: '#fff' }}>
                Update status
              </button>
            </form>
          </Card>

          <Card>
            <CardTitle>Private notes</CardTitle>
            <form
              className="space-y-3 border-b border-gray-200 p-5"
              action={async (formData: FormData) => {
                'use server';
                await addInquiryNote(inquiryId, formData);
              }}
            >
              <textarea name="note" rows={3} required placeholder="Price discussed, follow-up date…" className={inputClass} />
              <button type="submit" className="w-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white">
                Add note
              </button>
            </form>
            <ul className="divide-y divide-gray-200">
              {notes.map((n) => (
                <li key={n.id} className="p-5 text-sm">
                  <p className="whitespace-pre-wrap">{n.note}</p>
                  <p className="mt-2 text-xs text-gray-500">{new Date(n.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </li>
              ))}
              {notes.length === 0 && <li className="p-5 text-sm text-gray-500">No notes yet.</li>}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
