import Link from 'next/link';
import { ShoppingBag, CheckCircle2, ArrowRight, Sparkles, CreditCard, Truck, RefreshCw, BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'E-Commerce & Dropshipping Development — MWD',
  description: 'High-conversion online stores with Telebirr, Stripe, inventory tracking, and seamless checkout engineered for retail brands.',
};

export default function EcommercePage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb & Header */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500">
          <Link href="/services" className="hover:text-red-600">Services</Link>
          <span>/</span>
          <span className="text-red-600">E-Commerce & Dropshipping</span>
        </div>

        <header className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-4">
            <Sparkles size={14} className="text-red-600" />
            Conversion-Engineered Storefronts
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Sell directly to customers without friction.
          </h1>
          <p className="mt-5 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Whether launching a dropshipping brand or scaling an established retail inventory in Ethiopia, we engineer digital storefronts designed to maximize average order value.
          </p>
        </header>

        {/* Feature Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white mb-6">What We Deliver</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <CreditCard size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Local & Global Payments</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Accept Telebirr, CBE, Chapa, and international cards with Stripe without checkout abandonment.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <RefreshCw size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Automated Inventory Sync</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Real-time stock level monitoring with instant notification triggers before products run out.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <ShoppingBag size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Frictionless Cart & Drawer</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Single-click slide-out cart drawers with auto-saved carts and one-page checkout experiences.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 mb-4">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Analytics & Order Tracking</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Comprehensive customer purchase tracking, automated receipts, and courier dispatch logs.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-600/10 via-transparent to-red-600/5 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h3 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2">Ready to launch your online store?</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Get a custom quote with payment gateway integration.</p>
          </div>
          <Link href="/request-quote?service=ecommerce" className="btn-primary whitespace-nowrap px-8 py-3.5">
            Request Proposal <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
