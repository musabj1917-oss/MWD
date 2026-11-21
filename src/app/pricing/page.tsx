import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Pricing — MWD | Transparent Packages & Custom Quotes',
  description: 'Predictable, transparent project packages for web design, e-commerce, and digital menus in Ethiopia. Zero hidden fees or proprietary vendor lock-in.',
};

const tiers = [
  {
    name: 'Business Launch',
    badge: 'Popular for Founders',
    highlight: false,
    priceUSD: '$490',
    priceETB: '28,000 ETB',
    description: 'A bespoke, conversion-engineered website for startups, service agencies, and corporate brands establishing authority.',
    turnaround: '5 – 7 business days',
    features: [
      'Up to 5 custom-designed responsive pages',
      'Handcrafted Next.js & Tailwind CSS architecture',
      'Lakebase Neon Postgres database integration',
      'Google Lighthouse 95+ performance optimization',
      'Local & Global SEO setup + Schema.org markup',
      'Interactive contact form with Telegram / Email alerts',
      'Mobile navigation & fluid glassmorphism UI',
      'Full GitHub repository handover + documentation',
      '30 days post-launch technical warranty',
    ],
    ctaText: 'Start Business Build',
    ctaHref: '/request-quote?plan=launch',
  },
  {
    name: 'Growth E-Commerce',
    badge: 'High Conversion',
    highlight: true,
    priceUSD: '$890',
    priceETB: '52,000 ETB',
    description: 'Full-featured online store with seamless checkout, inventory tracking, and payment gateways built for direct sales.',
    turnaround: '7 – 14 business days',
    features: [
      'Full product catalog with category & variant filtering',
      'Fast slide-out shopping cart & frictionless checkout',
      'Payment gateways: Stripe, Telebirr & Chapa readiness',
      'Customer order management & automatic email receipts',
      'Inventory tracking with low-stock email triggers',
      'Promo codes, discount rules & shipping calculator',
      'Sub-second image optimization & CDN caching',
      'Admin dashboard for easy product updates',
      'Full source code ownership + 45 days support',
    ],
    ctaText: 'Launch Online Store',
    ctaHref: '/request-quote?plan=ecommerce',
  },
  {
    name: 'Digital QR Menu',
    badge: 'Hospitality Favorite',
    highlight: false,
    priceUSD: '$350',
    priceETB: '20,000 ETB',
    description: 'Instant, app-free dining menu system for restaurants, cafes, and lounges. Zero app downloads, updated in seconds.',
    turnaround: '2 – 4 business days',
    features: [
      'Lightning-fast QR code scan (< 1 second load)',
      'No app install required for diners',
      'Category tabs (Starters, Mains, Cocktails, Desserts)',
      'Rich food photography & dietary/allergen tags',
      'Owner control panel to change prices & sold-out items',
      'Multilingual interface (English & Amharic)',
      'High-resolution printable QR table tent designs (PDF)',
      'Offline-capable caching for low-signal areas',
      '1 year included hosting & technical support',
    ],
    ctaText: 'Order Digital Menu',
    ctaHref: '/request-quote?plan=menu',
  },
];

const faqs = [
  {
    q: 'Do you charge recurring monthly agency fees?',
    a: 'Never. You pay once for the design and engineering of your project. We host on cost-efficient cloud providers (like Vercel & Neon Postgres) where hosting is either completely free or only a few dollars a month. You retain 100% ownership.',
  },
  {
    q: 'What payment options do you support?',
    a: 'We accept local Ethiopian payments via Telebirr and Commercial Bank of Ethiopia (CBE), as well as international cards, Stripe, and wire transfers.',
  },
  {
    q: 'Can I add custom features not listed in these packages?',
    a: 'Absolutely. We scope custom web apps, customer portals, custom CMS setups, and specialized integrations via a brief discovery chat.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-4">
            <Sparkles size={14} className="text-red-600" />
            Transparent Investment
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Clear scope. Honest pricing. No surprises.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Every quote includes complete source code ownership, zero hidden hosting markups, and a 30-day post-launch warranty.
          </p>
        </header>

        {/* Pricing Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-stretch"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))' }}
        >
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between rounded-2xl p-7 sm:p-8 backdrop-blur-md transition-all duration-300 ${
                tier.highlight
                  ? 'border-2 border-red-600 bg-white/90 dark:bg-[#15151a]/95 shadow-xl md:-translate-y-2'
                  : 'border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 hover:border-red-500/40 shadow-sm'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">{tier.badge}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded">
                    {tier.turnaround}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2">{tier.name}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">{tier.description}</p>

                <div className="mb-6 pb-6 border-b border-neutral-100 dark:border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-neutral-950 dark:text-white">{tier.priceUSD}</span>
                    <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">or {tier.priceETB}</span>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">One-time investment &bull; Fixed price</span>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">What’s included</p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check size={16} className="text-red-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Link
                  href={tier.ctaHref}
                  className={`w-full block text-center py-3.5 rounded-lg text-sm font-bold transition ${
                    tier.highlight
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20'
                      : 'border border-neutral-300 dark:border-white/10 hover:border-red-600 hover:text-red-600 text-neutral-900 dark:text-white'
                  }`}
                >
                  {tier.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <section className="mb-24 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md p-6 sm:p-10 overflow-hidden">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2">Package Comparison</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Direct breakdown of technology, deliverables, and guarantees across all tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  <th className="py-4 pr-6">Feature</th>
                  <th className="py-4 px-4">Business Launch</th>
                  <th className="py-4 px-4 text-red-600">Growth Store</th>
                  <th className="py-4 px-4">Digital Menu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5 text-neutral-700 dark:text-neutral-300">
                <tr>
                  <td className="py-4 pr-6 font-medium text-neutral-950 dark:text-white">Delivery Timeline</td>
                  <td className="py-4 px-4">5 – 7 days</td>
                  <td className="py-4 px-4 font-semibold text-red-600">7 – 14 days</td>
                  <td className="py-4 px-4">2 – 4 days</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-medium text-neutral-950 dark:text-white">Next.js 15 & Tailwind 4</td>
                  <td className="py-4 px-4">Included</td>
                  <td className="py-4 px-4">Included</td>
                  <td className="py-4 px-4">Included</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-medium text-neutral-950 dark:text-white">Neon PostgreSQL Database</td>
                  <td className="py-4 px-4">Included</td>
                  <td className="py-4 px-4">Included</td>
                  <td className="py-4 px-4">Included</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-medium text-neutral-950 dark:text-white">Payment Gateway (Telebirr/Stripe)</td>
                  <td className="py-4 px-4 text-neutral-400">—</td>
                  <td className="py-4 px-4 text-red-600 font-semibold">Included</td>
                  <td className="py-4 px-4 text-neutral-400">—</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-medium text-neutral-950 dark:text-white">Admin Management Portal</td>
                  <td className="py-4 px-4 text-neutral-400">Optional</td>
                  <td className="py-4 px-4">Included</td>
                  <td className="py-4 px-4">Included</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-medium text-neutral-950 dark:text-white">Full Source Code Handover</td>
                  <td className="py-4 px-4">100% Yours</td>
                  <td className="py-4 px-4">100% Yours</td>
                  <td className="py-4 px-4">100% Yours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing FAQs */}
        <section className="mb-20">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">FAQ</p>
            <h3 className="text-3xl font-bold text-neutral-950 dark:text-white">Frequently Asked Pricing Questions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-[#121215]/60 backdrop-blur-md"
              >
                <h4 className="text-base font-bold text-neutral-950 dark:text-white mb-3">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Quote Callout */}
        <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-500 mb-2 block">Enterprise & Custom Work</span>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">Have specific API requirements or a larger scope?</h3>
            <p className="text-neutral-400 text-sm max-w-xl">
              We design custom booking platforms, multi-vendor stores, and internal company tools. Let’s draft an exact scope.
            </p>
          </div>
          <Link href="/request-quote" className="btn-primary whitespace-nowrap px-8 py-3.5 text-center w-full md:w-auto">
            Discuss Custom Scope
          </Link>
        </div>

      </div>
    </div>
  );
}
