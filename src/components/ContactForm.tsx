'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitQuoteRequest, type QuoteState } from '@/server/actions/public';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-60 cursor-pointer"
    >
      {pending ? (
        'Sending inquiry...'
      ) : (
        <>
          <Send size={16} /> Send Direct Message
        </>
      )}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState<QuoteState, FormData>(submitQuoteRequest, {
    success: false,
    message: '',
  });

  const v = state.values ?? {};

  if (state.success) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-50 dark:bg-green-950/40 p-6 text-green-900 dark:text-green-200">
        <div className="flex items-center gap-2.5 mb-2">
          <CheckCircle2 size={22} className="text-green-600 dark:text-green-400" />
          <h3 className="text-xl font-bold">Message Delivered</h3>
        </div>
        <p className="text-sm leading-relaxed text-green-800 dark:text-green-300">
          {state.message || 'Thank you for reaching out. Musab Web Development will review your details and respond within 2 business hours.'}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message && !state.success && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-50 dark:bg-red-950/40 p-4 text-red-800 dark:text-red-300 text-sm">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{state.message}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
          Your Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={v.name}
          className="w-full rounded-lg border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#18181c] px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-600 transition"
          placeholder="e.g. Dawit Tadesse"
        />
        {state.errors?.name?.[0] && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={v.email}
          className="w-full rounded-lg border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#18181c] px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-600 transition"
          placeholder="e.g. dawit@company.et"
        />
        {state.errors?.email?.[0] && <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="projectDescription" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
          Project Brief or Question *
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          rows={5}
          required
          defaultValue={v.projectDescription}
          className="w-full rounded-lg border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#18181c] px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-600 transition resize-y"
          placeholder="Tell us what you are looking to build, any deadlines, or specific features..."
        />
        {state.errors?.projectDescription?.[0] && (
          <p className="mt-1 text-xs text-red-600">{state.errors.projectDescription[0]}</p>
        )}
      </div>

      {/* Honeypot anti-spam */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <SubmitButton />
    </form>
  );
}
