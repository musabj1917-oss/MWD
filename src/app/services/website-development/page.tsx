import Link from 'next/link';
import { Globe, CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Search, Layout } from 'lucide-react';

export const metadata = {
  title: 'Website Development Services — MWD',
  description: 'Custom corporate websites, landing pages, and web apps engineered for speed, search visibility, and maximum conversions.',
};

export default function WebsiteDevelopmentPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb & Header */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500">
          <Link href="/services" className="hover:text-red-600">Services</Link>
          <span>/</span>
          <span className="text-red-600">Website Development</span>
        </div>

        <header className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-4">
            <Sparkles size={14} className="text-red-600" />
            Next.js & Neon Postgres
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            High-performance websites that outrank and outperform.
          </h1>
          <p className="mt-5 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Your website is your company’s highest-leverage digital asset. We engineer custom web platforms tailored specifically to your audience, eliminating slow load times and generic templates.
          </p>
        </header>

        {/* Feature Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white mb-6">What We Build</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <Globe size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Corporate & Brand Portals</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Establish unshakable authority and trust. Clear service hierarchies, team showcases, and case-study presentations.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">High-Conversion Landing Pages</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Laser-focused single pages engineered to capture leads, launch new products, and convert paid ad traffic.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <Search size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">SEO-Engineered Architecture</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Full schema.org structured data, semantic markup, OpenGraph previews, and Google Lighthouse 95+ score optimization.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <Layout size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Website Redesigns</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Modernize an outdated, slow website into a lightning-fast Next.js application without losing your search rankings.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Highlights */}
        <section className="mb-16 p-8 rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/40">
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white mb-4">Engineering Standards</h2>
          <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-red-600 shrink-0 mt-0.5" />
              <span>Sub-second page transitions powered by Next.js Server Components.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-red-600 shrink-0 mt-0.5" />
              <span>Full mobile optimization tested across iPhone, Samsung Galaxy, and low-end Android viewports.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-red-600 shrink-0 mt-0.5" />
              <span>Direct integrations with Telegram bot and email for instant contact form alerts.</span>
            </li>
          </ul>
        </section>

        {/* Bottom CTA Card */}
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-600/10 via-transparent to-red-600/5 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h3 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2">Ready to launch your website?</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Let’s discuss your vision and deliver an exact proposal.</p>
          </div>
          <Link href="/request-quote?service=website" className="btn-primary whitespace-nowrap px-8 py-3.5">
            Request Proposal <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
