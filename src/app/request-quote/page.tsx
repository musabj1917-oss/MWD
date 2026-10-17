'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitQuoteRequest } from '@/server/actions/public';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
    >
      {pending ? 'Submitting...' : 'Submit Request'}
    </button>
  );
}

export default function RequestQuotePage() {
  const [state, formAction] = useFormState(submitQuoteRequest, { success: false, message: '' });

  if (state.success) {
      return (
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
              <div className="bg-green-50 text-green-800 p-8 rounded-lg border border-green-200">
                  <h1 className="text-3xl font-bold mb-4">Request Received</h1>
                  <p className="text-lg mb-2">{state.message}</p>
                  <p className="text-sm text-green-700">A confirmation email has been sent to your address.</p>
              </div>
          </div>
      )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">Request a Quote</h1>
      <p className="text-center text-gray-600 mb-10">Fill out the form below and we'll get back to you with a detailed proposal and pricing.</p>
      
      {state.message && !state.success && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded">
              {state.message}
          </div>
      )}

      <form action={formAction} className="bg-white shadow-sm border p-6 md:p-8 rounded-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" id="name" name="name" required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
            {(state.errors as any)?.name && <p className="mt-1 text-sm text-red-600">{(state.errors as any)?.name[0]}</p>}
            </div>
            <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" id="email" name="email" required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
            {(state.errors as any)?.email && <p className="mt-1 text-sm text-red-600">{(state.errors as any)?.email[0]}</p>}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
            <input type="tel" id="phone" name="phone" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
            </div>
            <div>
            <label htmlFor="serviceOfInterest" className="block text-sm font-medium text-gray-700 mb-1">Service of Interest</label>
            <select id="serviceOfInterest" name="serviceOfInterest" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border bg-white">
                <option value="Website Development">Website Development</option>
                <option value="E-commerce">E-commerce / Dropshipping</option>
                <option value="Digital Menus">Digital Restaurant Menus</option>
                <option value="Other">Other</option>
            </select>
            </div>
        </div>

        <div>
            <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-1">Approximate Budget (Optional)</label>
            <select id="budgetRange" name="budgetRange" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border bg-white">
                <option value="">Select a range</option>
                <option value="< $1,000">Less than $1,000</option>
                <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000+">$10,000+</option>
            </select>
        </div>

        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
          <textarea id="projectDescription" name="projectDescription" rows={5} required className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"></textarea>
          {(state.errors as any)?.projectDescription && <p className="mt-1 text-sm text-red-600">{(state.errors as any)?.projectDescription[0]}</p>}
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
