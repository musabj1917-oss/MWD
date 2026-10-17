import { SITE, telHref, mailHref, telegramHref } from '@/lib/site';

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const nl2br = (s: string) => escapeHtml(s).replace(/\r?\n/g, '<br>');

const BLACK = '#0A0A0A';
const RED = '#E02020';
const MUTED = '#6B6B6B';
const LINE = '#E6E6E6';
const SOFT = '#F7F7F7';

export type QuoteEmailData = {
  reference: string;
  inquiryId?: number;
  name: string;
  email: string;
  phone?: string | null;
  telegram?: string | null;
  serviceOfInterest?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  projectDescription: string;
  photoCids: string[]; // cid values of images attached to the email, in order
  photoCount: number;
  submittedAt: Date;
};

function siteUrl() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  if (!raw) return '';
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
}

export function normalizeTelegram(value?: string | null) {
  if (!value) return null;
  const cleaned = value.trim().replace(/^https?:\/\/t\.me\//i, '').replace(/^@/, '');
  return /^[A-Za-z0-9_]{3,64}$/.test(cleaned) ? cleaned : null;
}

/** Best-effort wa.me link for a customer's phone number (Ethiopian local numbers start with 0). */
export function whatsappLinkFor(phone?: string | null) {
  if (!phone) return null;
  let digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = `251${digits.slice(1)}`;
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Addis_Ababa' });

const formatTime = (d: Date) =>
  d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Addis_Ababa' }) + ' (EAT)';

function row(label: string, value: string | null | undefined, opts: { html?: boolean } = {}) {
  if (!value) return '';
  return `<tr>
    <td style="padding:10px 14px;border-bottom:1px solid ${LINE};width:38%;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 14px;border-bottom:1px solid ${LINE};font-size:15px;color:${BLACK};vertical-align:top;">${opts.html ? value : escapeHtml(value)}</td>
  </tr>`;
}

function sectionTitle(title: string) {
  return `<h2 style="margin:28px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:19px;color:${BLACK};border-bottom:2px solid ${BLACK};padding-bottom:6px;">${escapeHtml(title)}</h2>`;
}

function button(href: string, label: string, bg = BLACK) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;background:${bg};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(label)}</a>`;
}

function photoStrip(cids: string[], total: number) {
  if (cids.length === 0) return '';
  const imgs = cids
    .map(
      (cid, i) =>
        `<img src="cid:${cid}" alt="Photo ${i + 1}" width="140" height="140" style="width:140px;height:140px;object-fit:cover;border:1px solid ${LINE};margin:0 8px 8px 0;display:inline-block;">`,
    )
    .join('');
  const extra = total > cids.length ? `<p style="margin:4px 0 0;font-size:13px;color:${MUTED};">+ ${total - cids.length} more attached to this email.</p>` : '';
  return `<div style="padding:14px;">${imgs}${extra}</div>`;
}

function shell(preheader: string, inner: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EFEFEF;font-family:Arial,Helvetica,sans-serif;color:${BLACK};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEFEF;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;">
${inner}
</table>
<p style="font-size:12px;color:${MUTED};margin:16px 0 0;">&copy; ${new Date().getFullYear()} ${escapeHtml(SITE.name)} &middot; ${escapeHtml(SITE.location)}</p>
</td></tr></table></body></html>`;
}

function header(kicker: string, title: string, reference: string, issued: Date) {
  return `<tr><td style="background:${BLACK};padding:26px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:bold;color:#ffffff;letter-spacing:-.02em;">${escapeHtml(SITE.name)}<span style="color:${RED};">.</span></td>
      <td align="right" style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#bdbdbd;">${escapeHtml(kicker)}</td>
    </tr></table>
  </td></tr>
  <tr><td style="height:4px;background:${RED};font-size:0;line-height:0;">&nbsp;</td></tr>
  <tr><td style="padding:30px 32px 6px;">
    <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.25;color:${BLACK};">${escapeHtml(title)}</h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="background:${SOFT};border-left:4px solid ${RED};width:100%;"><tr>
      <td style="padding:12px 16px;font-size:13px;color:${MUTED};">Reference<br><strong style="font-size:17px;color:${BLACK};letter-spacing:.04em;">${escapeHtml(reference)}</strong></td>
      <td style="padding:12px 16px;font-size:13px;color:${MUTED};">Date issued<br><strong style="font-size:15px;color:${BLACK};">${escapeHtml(formatDate(issued))}</strong></td>
      <td style="padding:12px 16px;font-size:13px;color:${MUTED};">Status<br><strong style="font-size:15px;color:${RED};">Received</strong></td>
    </tr></table>
  </td></tr>`;
}

/* ------------------------------------------------------------------ */
/* Customer email: a quotation-style acknowledgement                    */
/* ------------------------------------------------------------------ */
export function customerQuoteEmail(d: QuoteEmailData) {
  const tg = normalizeTelegram(d.telegram);
  const firstName = d.name.split(/\s+/)[0] || d.name;

  const inner = `
  ${header('Quotation request', `Thank you, ${firstName}. We have your request.`, d.reference, d.submittedAt)}
  <tr><td style="padding:8px 32px 32px;">
    <p style="font-size:15px;line-height:1.65;color:#222;margin:16px 0 0;">
      We have received your request for a project quotation and the details are summarised below. A member of the ${escapeHtml(SITE.name)} team will review it
      and send you a priced quotation <strong>${escapeHtml(SITE.responseTime)}</strong>. Please keep your reference number handy when you contact us.
    </p>

    ${sectionTitle('Prepared for')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-bottom:none;">
      ${row('Name', d.name)}
      ${row('Email', d.email)}
      ${row('Phone', d.phone)}
      ${row('Telegram', tg ? `@${tg}` : null)}
    </table>

    ${sectionTitle('Quotation request summary')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-bottom:none;">
      ${row('Service', d.serviceOfInterest)}
      ${row('Budget range', d.budgetRange || 'Not specified')}
      ${row('Desired timeline', d.timeline || 'Not specified')}
      ${row('Photos attached', d.photoCount > 0 ? `${d.photoCount} photo${d.photoCount === 1 ? '' : 's'}` : 'None')}
      ${row('Project description', nl2br(d.projectDescription), { html: true })}
    </table>
    ${photoStrip(d.photoCids, d.photoCount)}

    ${sectionTitle('Your quotation')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};">
      <tr style="background:${BLACK};">
        <td style="padding:10px 14px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#fff;">Item</td>
        <td style="padding:10px 14px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#fff;" align="right">Estimate</td>
      </tr>
      <tr>
        <td style="padding:14px;font-size:15px;border-bottom:1px solid ${LINE};">${escapeHtml(d.serviceOfInterest || 'Project')} &mdash; scope as described above</td>
        <td style="padding:14px;font-size:15px;border-bottom:1px solid ${LINE};color:${RED};font-weight:bold;" align="right">To be confirmed</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:12px 14px;font-size:13px;color:${MUTED};background:${SOFT};">
          Final pricing, deliverables and timeline will be itemised in the quotation we send you after reviewing your request. This email is an acknowledgement, not a price offer.
        </td>
      </tr>
    </table>

    ${sectionTitle('What happens next')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;vertical-align:top;width:34px;"><span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:${RED};color:#fff;font-weight:bold;font-size:13px;">1</span></td>
          <td style="padding:8px 0;font-size:14px;line-height:1.55;"><strong>Review.</strong> We read your brief and look at any photos you sent.</td></tr>
      <tr><td style="padding:8px 0;vertical-align:top;"><span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:${RED};color:#fff;font-weight:bold;font-size:13px;">2</span></td>
          <td style="padding:8px 0;font-size:14px;line-height:1.55;"><strong>Clarify.</strong> If anything is unclear we will contact you by email, phone, WhatsApp or Telegram.</td></tr>
      <tr><td style="padding:8px 0;vertical-align:top;"><span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:${RED};color:#fff;font-weight:bold;font-size:13px;">3</span></td>
          <td style="padding:8px 0;font-size:14px;line-height:1.55;"><strong>Quotation.</strong> You receive a priced proposal with scope and timeline, ${escapeHtml(SITE.responseTime)}.</td></tr>
    </table>

    ${sectionTitle('Need to add something?')}
    <p style="font-size:14px;line-height:1.6;color:#222;margin:0 0 12px;">Reply to this email or message us directly. Quote <strong>${escapeHtml(d.reference)}</strong> and we will attach it to your request.</p>
    <div>
      ${button(telegramHref, 'Telegram @' + SITE.telegramUsername, '#229ED9')}
      ${button(`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Hello ${SITE.name}, my quote reference is ${d.reference}.`)}`, 'WhatsApp', '#25D366')}
      ${button(telHref, 'Call ' + SITE.phoneDisplay)}
      ${button(`${mailHref}?subject=${encodeURIComponent('Quote ' + d.reference)}`, 'Email us')}
    </div>
  </td></tr>`;

  const text = [
    `Thank you, ${firstName}. We received your quotation request.`,
    `Reference: ${d.reference}`,
    `Date: ${formatDate(d.submittedAt)}`,
    '',
    `Service: ${d.serviceOfInterest || '-'}`,
    `Budget: ${d.budgetRange || 'Not specified'}`,
    `Timeline: ${d.timeline || 'Not specified'}`,
    `Photos: ${d.photoCount}`,
    '',
    'Project description:',
    d.projectDescription,
    '',
    `We will send a priced quotation ${SITE.responseTime}.`,
    `Contact: ${SITE.email} | ${SITE.phoneDisplay} | Telegram @${SITE.telegramUsername}`,
  ].join('\n');

  return {
    subject: `Your quotation request ${d.reference} — ${SITE.name}`,
    html: shell(`We received your request ${d.reference}. A priced quotation follows ${SITE.responseTime}.`, inner),
    text,
  };
}

/* ------------------------------------------------------------------ */
/* Admin email: everything needed to reply, with one-tap contact links  */
/* ------------------------------------------------------------------ */
export function adminQuoteEmail(d: QuoteEmailData) {
  const tg = normalizeTelegram(d.telegram);
  const wa = whatsappLinkFor(d.phone);
  const base = siteUrl();
  const adminLink = base && d.inquiryId ? `${base}/admin/inquiries/${d.inquiryId}` : base ? `${base}/admin/inquiries` : '';

  const inner = `
  ${header('New quote request', `New request from ${d.name}`, d.reference, d.submittedAt)}
  <tr><td style="padding:8px 32px 32px;">
    <p style="font-size:14px;color:${MUTED};margin:14px 0 0;">Received ${escapeHtml(formatDate(d.submittedAt))} at ${escapeHtml(formatTime(d.submittedAt))}. Hit reply to answer ${escapeHtml(d.name)} directly.</p>

    ${sectionTitle('Customer')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-bottom:none;">
      ${row('Name', d.name)}
      ${row('Email', `<a href="mailto:${escapeHtml(d.email)}" style="color:${RED};">${escapeHtml(d.email)}</a>`, { html: true })}
      ${row('Phone', d.phone ? `<a href="tel:${escapeHtml(d.phone.replace(/\s+/g, ''))}" style="color:${RED};">${escapeHtml(d.phone)}</a>` : null, { html: true })}
      ${row('Telegram', tg ? `<a href="https://t.me/${tg}" style="color:${RED};">@${escapeHtml(tg)}</a>` : d.telegram ? escapeHtml(d.telegram) + ' (could not be linked)' : null, { html: true })}
    </table>

    ${sectionTitle('Project')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-bottom:none;">
      ${row('Service', d.serviceOfInterest)}
      ${row('Budget range', d.budgetRange || 'Not specified')}
      ${row('Desired timeline', d.timeline || 'Not specified')}
      ${row('Photos', d.photoCount > 0 ? `${d.photoCount} attached` : 'None')}
      ${row('Description', nl2br(d.projectDescription), { html: true })}
    </table>
    ${photoStrip(d.photoCids, d.photoCount)}

    ${sectionTitle('Reply quickly')}
    <div>
      ${button(`mailto:${d.email}?subject=${encodeURIComponent(`Your quotation ${d.reference}`)}`, 'Reply by email', RED)}
      ${tg ? button(`https://t.me/${tg}`, 'Telegram', '#229ED9') : ''}
      ${wa ? button(wa, 'WhatsApp', '#25D366') : ''}
      ${d.phone ? button(`tel:${d.phone.replace(/\s+/g, '')}`, 'Call') : ''}
      ${adminLink ? button(adminLink, 'Open in admin') : ''}
    </div>
  </td></tr>`;

  const text = [
    `New quote request ${d.reference}`,
    `From: ${d.name} <${d.email}>`,
    d.phone ? `Phone: ${d.phone}` : '',
    tg ? `Telegram: @${tg}` : '',
    `Service: ${d.serviceOfInterest || '-'}`,
    `Budget: ${d.budgetRange || 'Not specified'}`,
    `Timeline: ${d.timeline || 'Not specified'}`,
    `Photos: ${d.photoCount}`,
    '',
    d.projectDescription,
    adminLink ? `\nOpen in admin: ${adminLink}` : '',
  ]
    .filter((l) => l !== '')
    .join('\n');

  return {
    subject: `New quote request ${d.reference} — ${d.name}${d.serviceOfInterest ? ` (${d.serviceOfInterest})` : ''}`,
    html: shell(`${d.name} requested a quote${d.serviceOfInterest ? ` for ${d.serviceOfInterest}` : ''}.`, inner),
    text,
  };
}
