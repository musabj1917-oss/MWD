'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitQuoteRequest, type QuoteState } from '@/server/actions/public';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-70">
      {pending ? 'Sending...' : 'Send enquiry'}
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
      <div className="border border-green-300 bg-green-50 p-6 text-green-900">
        <h2 className="text-2xl font-semibold mb-2">Message sent</h2>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message && !state.success && (
        <div className="border border-red-300 bg-red-50 p-3 text-red-800 text-sm">{state.message}</div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
        <input id="name" name="name" type="text" required defaultValue={v.name} className="w-full border p-3" placeholder="Your name" />
        {state.errors?.name?.[0] && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input id="email" name="email" type="email" required defaultValue={v.email} className="w-full border p-3" placeholder="you@example.com" />
        {state.errors?.email?.[0] && <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>}
      </div>
      <div>
        <label htmlFor="projectDescription" className="block text-sm font-medium mb-1">Project details</label>
        <textarea id="projectDescription" name="projectDescription" rows={5} required defaultValue={v.projectDescription} className="w-full border p-3" placeholder="Tell us about your project" />
        {state.errors?.projectDescription?.[0] && (
          <p className="mt-1 text-sm text-red-600">{state.errors.projectDescription[0]}</p>
        )}
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <SubmitButton />
    </form>
  );
}
