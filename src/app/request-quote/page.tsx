'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { MessageCircle, Send } from 'lucide-react';
import { submitQuoteRequest, type QuoteState } from '@/server/actions/public';
import { PhotoPicker } from '@/components/PhotoPicker';
import { SITE, telegramHref, whatsappHref } from '@/lib/site';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-3 disabled:opacity-70">
      {pending ? 'Submitting…' : 'Submit request'}
    </button>
  );
}

const field = 'w-full border border-gray-300 bg-white p-3 text-sm focus:border-red-600';
const label = 'block text-sm font-medium text-gray-800 mb-1';

export default function RequestQuotePage() {
  const [state, formAction] = useActionState<QuoteState, FormData>(submitQuoteRequest, { success: false, message: '' });
  const v = state.values ?? {};

  if (state.success) {
    return (
      <div className="container max-w-3xl py-20 text-center">
        <div className="border border-green-300 bg-green-50 p-8 text-green-900">
          <h1 className="text-3xl font-bold mb-4">Request received</h1>
          <p className="text-lg mb-2">{state.message}</p>
          <p className="text-sm text-green-800">
            A detailed confirmation is on its way to your inbox. We will send your quotation {SITE.responseTime}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-16">
      <p className="text-center text-red-600 font-semibold uppercase tracking-[0.2em] text-xs">Request a quote</p>
      <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-center">Tell us about your project.</h1>
      <p className="text-center text-gray-700 mb-8">
        The more detail you give us, the more accurate your quotation. Add photos if they help explain what you need.
      </p>

      <div className="mb-8 flex flex-wrap justify-center gap-3">
        <a href={telegramHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold" style={{ background: '#229ED9', color: '#fff' }}>
          <Send size={16} aria-hidden /> Telegram @{SITE.telegramUsername}
        </a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold" style={{ background: '#25D366', color: '#fff' }}>
          <MessageCircle size={16} aria-hidden /> WhatsApp
        </a>
      </div>

      {state.message && !state.success && (
        <div className="mb-6 border border-red-300 bg-red-50 p-4 text-red-800 text-sm">{state.message}</div>
      )}

      <form action={formAction} className="border bg-white p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className={label}>Name *</label>
            <input type="text" id="name" name="name" required defaultValue={v.name} className={field} />
            {state.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
          </div>
          <div>
            <label htmlFor="email" className={label}>Email *</label>
            <input type="email" id="email" name="email" required defaultValue={v.email} className={field} />
            {state.errors?.email && <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className={label}>Phone / WhatsApp (optional)</label>
            <input type="tel" id="phone" name="phone" defaultValue={v.phone} className={field} />
          </div>
          <div>
            <label htmlFor="telegram" className={label}>Telegram username (optional)</label>
            <input type="text" id="telegram" name="telegram" defaultValue={v.telegram} placeholder="@username" className={field} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="serviceOfInterest" className={label}>Service of interest</label>
            <select id="serviceOfInterest" name="serviceOfInterest" defaultValue={v.serviceOfInterest ?? 'Website Development'} className={field}>
              <option value="Website Development">Website Development</option>
              <option value="E-commerce">E-commerce / Dropshipping</option>
              <option value="Digital Menus">Digital Restaurant Menus</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeline" className={label}>When do you need it? (optional)</label>
            <select id="timeline" name="timeline" defaultValue={v.timeline ?? ''} className={field}>
              <option value="">Select a timeline</option>
              <option value="As soon as possible">As soon as possible</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="1 – 3 months">1 – 3 months</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="budgetRange" className={label}>Approximate budget (optional)</label>
          <select id="budgetRange" name="budgetRange" defaultValue={v.budgetRange ?? ''} className={field}>
            <option value="">Select a range</option>
            <option value="< $1,000">Less than $1,000</option>
            <option value="$1,000 - $5,000">$1,000 - $5,000</option>
            <option value="$5,000 - $10,000">$5,000 - $10,000</option>
            <option value="$10,000+">$10,000+</option>
          </select>
        </div>

        <div>
          <label htmlFor="projectDescription" className={label}>Project description *</label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            rows={6}
            required
            defaultValue={v.projectDescription}
            placeholder="What do you need? Who is it for? Pages or features you want, websites you like, deadlines…"
            className={field}
          />
          {state.errors?.projectDescription && <p className="mt-1 text-sm text-red-600">{state.errors.projectDescription[0]}</p>}
        </div>

        <div>
          <span className={label}>Photos (optional)</span>
          <PhotoPicker />
        </div>

        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <SubmitButton />
      </form>
    </div>
  );
}
