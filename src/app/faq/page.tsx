import Link from 'next/link';
import { HelpCircle, Sparkles, MessageCircle, ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react';
import { whatsappHref } from '@/lib/site';

export const metadata = {
  title: 'FAQ — MWD | Answers to Frequently Asked Questions',
  description: 'Everything you need to know about working with Musab Web Development: timelines, pricing, code ownership, Neon database, and local payments.',
};

const categories = [
  {
    title: 'Timelines & Delivery',
    faqs: [
      {
        q: 'How fast can our project be delivered?',
        a: 'Digital QR menus are delivered in 2 to 4 business days. Business websites typically take 5 to 7 days, and full e-commerce stores take 7 to 14 days. We work in disciplined sprints with clear milestones so deadlines are never missed.',
      },
      {
        q: 'What does the design and revision process look like?',
        a: 'We begin with interactive design wireframes. You review the design layout, typography, and UX flow directly. All standard packages include 2 full rounds of revisions before code implementation to ensure total visual alignment.',
      },
    ],
  },
  {
    title: 'Technology & Hosting',
    faqs: [
      {
        q: 'What technologies do you use, and why not WordPress or Wix?',
        a: 'We build with Next.js 15, Tailwind CSS, TypeScript, and Lakebase Neon PostgreSQL. Unlike WordPress or drag-and-drop builders, our stack delivers instant page loads (< 1s), zero security vulnerabilities from outdated plugins, and perfect mobile responsiveness.',
      },
      {
        q: 'Who actually owns the code and domain after launch?',
        a: 'You own 100% of the intellectual property, full GitHub source code repository, database credentials, and domain name. We never hold your assets hostage or force you into expensive monthly vendor lock-in.',
      },
      {
        q: 'Where will our website and database be hosted?',
        a: 'We deploy frontend applications onto edge CDN networks (such as Vercel) and databases onto Lakebase Neon Postgres. This architecture provides enterprise-grade 99.99% uptime, global DDoS protection, and automated branch backups.',
      },
    ],
  },
  {
    title: 'Pricing & Local Payment',
    faqs: [
      {
        q: 'What payment methods do you accept in Ethiopia and internationally?',
        a: 'We accept local Ethiopian bank transfers via Commercial Bank of Ethiopia (CBE) and Telebirr, as well as international cards, Stripe, and wire transfers. A 50% initial deposit kicks off the project, and the remaining 50% is due only upon final approval and handover.',
      },
      {
        q: 'Are there any hidden or recurring maintenance fees?',
        a: 'None from our side. We provide a transparent one-time project fee. The cloud platforms we deploy to (Vercel & Neon Postgres) have generous free or low-cost tiers (often $0 to $10/month depending on traffic). All projects include a 30-day post-launch technical warranty.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-4">
            <Sparkles size={14} className="text-red-600" />
            Clear Answers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Frequently asked questions.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Straightforward answers about our engineering process, payment terms, database infrastructure, and delivery guarantees.
          </p>
        </header>

        {/* FAQ Categories */}
        <div className="space-y-16 mb-20">
          {categories.map((cat, catIdx) => (
            <section key={catIdx}>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                {cat.title}
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {cat.faqs.map((faq, faqIdx) => (
                  <article
                    key={faqIdx}
                    className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md p-6 sm:p-8 hover:border-red-500/40 transition-colors"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white mb-3">
                      {faq.q}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white mb-3">
            Still have a question?
          </h3>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto mb-8">
            Reach out directly and we’ll answer any technical or pricing questions right away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-bold text-white shadow-sm"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
            <Link href="/request-quote" className="btn-primary w-full sm:w-auto px-6 py-3.5">
              Request Free Quotation
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
