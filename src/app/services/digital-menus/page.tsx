import Link from 'next/link';
import { UtensilsCrossed, CheckCircle2, ArrowRight, Sparkles, QrCode, Smartphone, Sliders, Globe } from 'lucide-react';

export const metadata = {
  title: 'Digital Restaurant QR Menus — MWD',
  description: 'Fast, interactive QR-code digital menus for restaurants, cafes, and lounges in Ethiopia. Zero app downloads, real-time price updates.',
};

export default function DigitalMenusPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb & Header */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500">
          <Link href="/services" className="hover:text-red-600">Services</Link>
          <span>/</span>
          <span className="text-red-600">Digital Menus</span>
        </div>

        <header className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-4">
            <Sparkles size={14} className="text-red-600" />
            Modern Hospitality Tech
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Transform dining with instant QR menus.
          </h1>
          <p className="mt-5 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Eliminate recurring paper reprint costs and delight diners with high-definition digital menus that open instantly on any phone without app installation.
          </p>
        </header>

        {/* Feature Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white mb-6">Key Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <QrCode size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Zero-App Instant Access</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Guests simply point their phone camera and the menu opens in under a second. No downloads, no signups.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <Sliders size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Real-Time Price & Item Updates</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Update prices, mark sold-out specials, or introduce seasonal drinks in seconds from any smartphone.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <Globe size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Bilingual Menu Switching</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Seamless one-tap language switching between English and Amharic with full dietary & allergen tags.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <Smartphone size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Print-Ready Table Stands</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                We deliver high-resolution vector print assets branded specifically with your venue logo and QR code.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-600/10 via-transparent to-red-600/5 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h3 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2">Upgrade your dining experience</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Launch in as few as 2 business days.</p>
          </div>
          <Link href="/request-quote?service=menu" className="btn-primary whitespace-nowrap px-8 py-3.5">
            Request Menu Setup <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
