import { Phone, Mail, MessageCircle } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { SITE, telHref, mailHref, whatsappHref } from '@/lib/site';

export const metadata = {
  title: 'Contact MWD — Digital Agency',
  description: 'Contact MWD for website design, e-commerce, digital menu, and growth-focused digital projects.',
};

export default function ContactPage() {
  return (
    <div className="container py-20">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <p className="text-red-600 font-semibold uppercase tracking-[0.2em] text-xs">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Let&rsquo;s talk about your next move.</h1>
          <p className="text-gray-700 mb-8">
            We&rsquo;d love to hear what you are building. Use the form or message us directly. We usually respond within one business day.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded px-4 py-3 font-semibold" style={{ background: '#25D366', color: '#fff' }}>
              <MessageCircle size={20} aria-hidden /> Chat on WhatsApp
            </a>
            <a href={telHref} className="btn-ghost inline-flex items-center gap-2">
              <Phone size={18} aria-hidden /> Call {SITE.phoneDisplay}
            </a>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <h2 className="font-semibold text-lg mb-1">Email</h2>
              <p><a href={mailHref} className="inline-flex items-center gap-2"><Mail size={16} aria-hidden /> {SITE.email}</a></p>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">Phone</h2>
              <p><a href={telHref}>{SITE.phoneDisplay}</a></p>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">GitHub</h2>
              <p><a href={SITE.github} target="_blank" rel="noopener noreferrer">github.com/musabj1917-oss</a></p>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">Location</h2>
              <p>{SITE.location}</p>
            </div>
          </div>
        </div>

        <div className="border p-8 bg-white">
          <h2 className="text-2xl font-semibold mb-6">Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
