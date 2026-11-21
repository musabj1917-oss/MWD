import { Phone, Mail, MessageCircle, Send, MapPin, Clock, Sparkles } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { SITE, telHref, mailHref, whatsappHref, telegramHref } from '@/lib/site';

export const metadata = {
  title: 'Contact MWD — Direct Engineering Consultation',
  description: 'Connect directly with Musab Web Development for high-performance websites, e-commerce stores, and digital menus in Ethiopia.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-4">
            <Sparkles size={14} className="text-red-600" />
            Direct Communication
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Let’s talk about your next digital release.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Have a clear vision or just exploring possibilities? We reply directly to every inquiry in under 2 hours during active business hours.
          </p>
        </header>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">

          {/* Left Column: Direct channels & Studio Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Instant Action Channels */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md p-6 sm:p-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4">
                Instant Chat Channels
              </h2>
              <div className="flex flex-col gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold text-white shadow-sm transition hover:opacity-95"
                  style={{ background: '#25D366' }}
                >
                  <span className="flex items-center gap-2.5 text-sm">
                    <MessageCircle size={19} /> Chat on WhatsApp
                  </span>
                  <span className="text-xs font-normal opacity-90">Instant</span>
                </a>

                <a
                  href={telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold text-white shadow-sm transition hover:opacity-95"
                  style={{ background: '#229ED9' }}
                >
                  <span className="flex items-center gap-2.5 text-sm">
                    <Send size={18} /> Telegram @{SITE.telegramUsername}
                  </span>
                  <span className="text-xs font-normal opacity-90">Active</span>
                </a>

                <a
                  href={telHref}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white hover:border-red-600 transition text-sm font-semibold"
                >
                  <span className="flex items-center gap-2.5">
                    <Phone size={17} className="text-red-600" /> Direct Call
                  </span>
                  <span className="text-xs font-mono text-neutral-500">{SITE.phoneDisplay}</span>
                </a>
              </div>
            </div>

            {/* Studio Information */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md p-6 sm:p-8 space-y-5 text-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                Studio Details
              </h2>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-950 dark:text-white">Studio Location</p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-0.5">{SITE.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-950 dark:text-white">Response Guarantee</p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-0.5">Under 2 hours during Addis Ababa business hours (Mon – Sat)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-950 dark:text-white">Direct Email</p>
                  <a href={mailHref} className="text-xs text-red-600 hover:underline mt-0.5 block font-mono">
                    {SITE.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-[#121215]/90 backdrop-blur-md p-7 sm:p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2">
              Send us a direct message
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Fill out the form below and we will get back to you with ideas, initial scope, and pricing.
            </p>
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}
