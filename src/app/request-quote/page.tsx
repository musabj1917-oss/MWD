'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { MessageCircle, Send, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { submitQuoteRequest, type QuoteState } from '@/server/actions/public';
import { PhotoPicker } from '@/components/PhotoPicker';
import { SITE, telegramHref, whatsappHref } from '@/lib/site';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-red-600/20"
    >
      {pending ? 'Submitting proposal request…' : 'Submit Project Brief & Request Quote'}
    </button>
  );
}

const inputClass =
  'w-full rounded-xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#18181c] px-4 py-3.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-600 transition';
const labelClass = 'block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2';

export default function RequestQuotePage() {
  const [state, formAction] = useActionState<QuoteState, FormData>(submitQuoteRequest, {
    success: false,
    message: '',
  });
  const v = state.values ?? {};

  if (state.success) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full rounded-2xl border border-green-500/30 bg-green-50/90 dark:bg-green-950/40 backdrop-blur-md p-8 sm:p-12 text-center text-green-900 dark:text-green-200">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-3xl font-extrabold mb-3">Project Brief Received</h1>
          <p className="text-base text-green-800 dark:text-green-300 mb-6 leading-relaxed">
            {state.message || 'Thank you for reaching out to Musab Web Development.'}
          </p>
          <div className="p-4 rounded-xl bg-white/60 dark:bg-black/40 border border-green-200 dark:border-green-800/40 text-sm max-w-md mx-auto mb-8">
            <p className="font-semibold mb-1">What happens next?</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              We review your requirements and reply with a milestone roadmap and transparent quotation within {SITE.responseTime}.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={16} /> Fast-track on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <header className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-4">
            <Sparkles size={14} className="text-red-600" />
            Direct Proposal Builder
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Tell us about your project.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Fill out the scope below. We will analyze your requirements and return an itemized quote within 2 business hours.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition hover:opacity-90"
              style={{ background: '#229ED9' }}
            >
              <Send size={15} /> Quick Chat on Telegram
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={15} /> WhatsApp @ Musab
            </a>
          </div>
        </header>

        {state.message && !state.success && (
          <div className="mb-8 rounded-xl border border-red-500/40 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-800 dark:text-red-300">
            {state.message}
          </div>
        )}

        <form
          action={formAction}
          className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-[#121215]/90 backdrop-blur-md p-6 sm:p-10 space-y-7 shadow-xl"
        >
          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelClass}>Your Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={v.name}
                className={inputClass}
                placeholder="e.g. Samuel Bekele"
              />
              {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Business Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                defaultValue={v.email}
                className={inputClass}
                placeholder="e.g. samuel@company.com"
              />
              {state.errors?.email && <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className={labelClass}>Phone / WhatsApp (optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={v.phone}
                className={inputClass}
                placeholder="+251 9..."
              />
            </div>
            <div>
              <label htmlFor="telegram" className={labelClass}>Telegram username (optional)</label>
              <input
                type="text"
                id="telegram"
                name="telegram"
                defaultValue={v.telegram}
                placeholder="@username"
                className={inputClass}
              />
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="serviceOfInterest" className={labelClass}>Primary Service *</label>
              <select
                id="serviceOfInterest"
                name="serviceOfInterest"
                defaultValue={v.serviceOfInterest ?? 'Website Development'}
                className={inputClass}
              >
                <option value="Website Development">Website Development (Company / Portfolio)</option>
                <option value="E-commerce">E-Commerce & Dropshipping Storefront</option>
                <option value="Digital Menus">Interactive Digital QR Menu System</option>
                <option value="Other">Custom Web Application / Enterprise API</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeline" className={labelClass}>Target Launch Timeline</label>
              <select
                id="timeline"
                name="timeline"
                defaultValue={v.timeline ?? 'Within 2 weeks'}
                className={inputClass}
              >
                <option value="As soon as possible">Immediate (Priority Sprint)</option>
                <option value="Within 2 weeks">Within 2 weeks</option>
                <option value="Within 1 month">Within 1 month</option>
                <option value="Flexible">Flexible / Planning phase</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="budgetRange" className={labelClass}>Estimated Budget Range</label>
            <select
              id="budgetRange"
              name="budgetRange"
              defaultValue={v.budgetRange ?? '$500 - $1,000 / 28k - 55k ETB'}
              className={inputClass}
            >
              <option value="< $500 / < 28,000 ETB">Less than $500 / 28,000 ETB</option>
              <option value="$500 - $1,000 / 28k - 55k ETB">$500 – $1,000 / 28,000 – 55,000 ETB</option>
              <option value="$1,000 - $2,500 / 55k - 140k ETB">$1,000 – $2,500 / 55,000 – 140,000 ETB</option>
              <option value="$2,500+ / 140k+ ETB">$2,500+ / 140,000+ ETB</option>
            </select>
          </div>

          <div>
            <label htmlFor="projectDescription" className={labelClass}>Project Requirements & Goals *</label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              rows={6}
              required
              defaultValue={v.projectDescription}
              placeholder="Tell us what you want to achieve, reference sites you like, pages needed, or existing pain points..."
              className={inputClass}
            />
            {state.errors?.projectDescription && (
              <p className="mt-1 text-xs text-red-600">{state.errors.projectDescription[0]}</p>
            )}
          </div>

          <div>
            <span className={labelClass}>Reference Photos / Wireframes (optional)</span>
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 p-4 bg-neutral-50/50 dark:bg-white/[0.02]">
              <PhotoPicker />
            </div>
          </div>

          {/* Anti-spam trap */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <SubmitButton />

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-2">
            <ShieldCheck size={16} className="text-red-600" />
            <span>Strict NDA & 100% Intellectual Property ownership guaranteed.</span>
          </div>
        </form>

      </div>
    </div>
  );
}
