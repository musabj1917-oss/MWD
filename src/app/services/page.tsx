import Link from 'next/link';
import { ArrowRight, Globe, ShoppingBag, UtensilsCrossed, CheckCircle2, ShieldCheck, Zap, Cpu, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Services — MWD | Web Design, E-Commerce & Digital Menus',
  description: 'Specialized digital engineering for Ethiopian businesses: bespoke business websites, high-conversion e-commerce stores, and instant QR digital menus.',
};

const services = [
  {
    id: 'web-dev',
    slug: 'website-development',
    icon: Globe,
    title: 'Website Development',
    tag: 'Flagship Engineering',
    timeline: '5 – 10 business days',
    description: 'High-speed, SEO-first corporate and business websites crafted with Next.js, Tailwind CSS, and headless content architecture.',
    deliverables: [
      'Tailored UI/UX design (No cookie-cutter templates)',
      'Sub-second page load times with Next.js App Router',
      'Local & international SEO optimization',
      'Accessible semantic HTML adhering to WCAG 2.1',
      'Mobile-first responsive layouts tested across 15+ screen sizes',
      'Contact forms with instant Telegram/email routing',
    ],
    pricing: 'From $490 / 28,000 ETB',
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce',
    icon: ShoppingBag,
    title: 'E-Commerce & Dropshipping',
    tag: 'Revenue Engine',
    timeline: '7 – 14 business days',
    description: 'Frictionless online storefronts built to convert visitors into loyal paying customers with automated inventory and local payment readiness.',
    deliverables: [
      'Custom catalog and product detail architectures',
      'Frictionless multi-step checkout and cart drawer',
      'Payment gateway integrations (Stripe, Telebirr, Chapa)',
      'Automated inventory tracking and low-stock alerts',
      'Order dispatch notifications via email & SMS',
      'Conversion-optimized product copy layout',
    ],
    pricing: 'From $890 / 52,000 ETB',
  },
  {
    id: 'digital-menus',
    slug: 'digital-menus',
    icon: UtensilsCrossed,
    title: 'Digital QR Menus',
    tag: 'Hospitality Tech',
    timeline: '2 – 4 business days',
    description: 'Instant, app-free QR dining menus for restaurants, cafes, and lounges. Zero app downloads, lightning-fast browsing, and real-time dish updates.',
    deliverables: [
      'Scan-and-browse in under 1 second without app install',
      'Owner admin panel for instant price & 86’d item changes',
      'High-resolution imagery showcase with ingredient tags',
      'Multilingual support (English, Amharic, Oromo)',
      'Print-ready high-DPI QR code table stands & graphics',
      'Offline-capable caching for low-connectivity zones',
    ],
    pricing: 'From $350 / 20,000 ETB',
  },
];

const workflow = [
  {
    step: '01',
    title: 'Strategic Discovery',
    description: 'We audit your brand, analyze your direct competitors in Addis Ababa and globally, and define strict commercial KPIs.',
  },
  {
    step: '02',
    title: 'Spatial UI/UX Design',
    description: 'We draft interactive wireframes and design system tokens tailored specifically to your visual identity and customer journey.',
  },
  {
    step: '03',
    title: 'Full-Stack Development',
    description: 'Engineered cleanly in Next.js with Lakebase Neon Postgres, enterprise CDN caching, and automated CI/CD deployments.',
  },
  {
    step: '04',
    title: 'Verification & Launch',
    description: 'Rigorous cross-browser QA, Lighthouse 95+ performance audits, DNS setup, and a 30-day post-launch warranty.',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-4">
            <Sparkles size={14} className="text-red-600" />
            Specialized Engineering
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Services built for speed, conversion, and longevity.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            We don’t do generic bloated templates. Every site we build is handcrafted from source code for unmatched performance, airtight security, and lasting commercial impact.
          </p>
        </header>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}>
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <article
                key={svc.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md p-7 sm:p-8 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-500 group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {svc.timeline}
                    </span>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">{svc.tag}</p>
                  <h2 className="text-2xl font-bold text-neutral-950 dark:text-white mb-3">{svc.title}</h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">{svc.description}</p>

                  <div className="border-t border-neutral-100 dark:border-white/5 pt-5 mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">Key Deliverables</p>
                    <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                      {svc.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 size={15} className="text-red-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-neutral-100 dark:border-white/5 pt-6 mt-2 flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-neutral-400">Starting at</span>
                    <span className="text-base font-bold text-neutral-950 dark:text-white">{svc.pricing}</span>
                  </div>
                  <Link
                    href={`/services/${svc.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition"
                  >
                    Details <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Workflow Section */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Our Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white">
              From whiteboard to production in 4 structured phases.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-[#121215]/60 backdrop-blur-md"
              >
                <div className="text-3xl font-extrabold text-red-600/20 dark:text-red-500/30 mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guarantee Banner */}
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-600/10 via-transparent to-red-600/5 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
              <ShieldCheck size={16} />
              The MWD Guarantee
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white mb-3">
              100% Code Ownership & Zero Lock-in.
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              When we deploy your project, you own the entire repository, database, domain, and assets. No recurring agency retainer traps, no proprietary builders.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/request-quote" className="btn-primary text-center px-8 py-3.5 whitespace-nowrap">
              Request a Proposal
            </Link>
            <Link href="/pricing" className="btn-ghost text-center px-6 py-3.5 whitespace-nowrap">
              Explore Pricing
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
