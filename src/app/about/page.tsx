import Link from 'next/link';

export const metadata = {
  title: 'About MWD — Crafting High-Performance Digital Solutions | Addis Ababa',
  description:
    'Learn about MWD (Musab Web Development), an independent digital studio in Addis Ababa engineering high-performance websites, e-commerce stores, and digital menus.',
};

export default function AboutPage() {
  return (
    <div className="overflow-x-clip bg-transparent text-neutral-950 dark:text-neutral-100 transition-colors">
      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 bg-transparent border-b border-black/5 dark:border-white/10">
        <div className="container">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAFAFA] dark:bg-[#121215] border border-black/10 dark:border-white/10 rounded-full text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Independent Web Studio • Addis Ababa, Ethiopia
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.12] mb-6 max-w-4xl">
            We build digital experiences with <span className="text-red-600">architectural precision</span> and commercial impact.
          </h1>

          <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed font-normal">
            MWD (Musab Web Development) is an independent engineering and design studio. We reject bloated page builders and cumbersome agency overhead in favor of fast, purpose-built websites that turn visitors into paying customers.
          </p>
        </div>
      </section>

      {/* Studio Story / Dual Pillars */}
      <section className="py-16 lg:py-24 bg-transparent">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white/70 dark:bg-[#121215]/75 backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-red-600 block mb-3">
                  Why We Exist
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white mb-4">
                  Moving Past Fragile Templates & Agency Bloat
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed mb-4">
                  Too many businesses in East Africa and globally end up with slow, broken WordPress sites or cookie-cutter templates that cost a fortune in monthly maintenance without delivering measurable sales.
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
                  MWD was founded to bridge the gap between world-class engineering and pragmatic business execution. We develop lean, modern web applications that load in under a second and don&apos;t require an army of developers to keep alive.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-white/10 text-sm font-semibold text-red-600">
                Built for speed, longevity, and conversion.
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-neutral-950 text-white border border-neutral-800 dark:border-white/15 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-md">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-red-400 block mb-3">
                  Our Commitment
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                  Direct Access, Complete Transparency
                </h3>
                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-4">
                  When you partner with MWD, you speak directly with the developer and designer building your product — not junior account managers or offshore intermediaries.
                </p>
                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                  We provide clear fixed-price proposals, weekly milestone reviews, and 100% intellectual property ownership upon launch. No monthly retainers required to keep your own site online.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 text-sm font-semibold text-white">
                100% Code & Asset Ownership Guaranteed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tangible Metrics Banner */}
      <section className="py-8 bg-white/70 dark:bg-[#121215]/75 backdrop-blur-md border-y border-black/5 dark:border-white/10">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">100%</div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-1">Bespoke Crafted Code</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">&lt; 1s</div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-1">Target Core Web Vitals</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">2–3 Wks</div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-1">Average Turnaround</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">0</div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-1">Hostage Retainer Fees</div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 lg:py-24 bg-transparent">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-red-600 block mb-3">
              Engineering Ethos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white mb-4">
              The Standards Behind Every Build
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">
              Every line of code and visual component is deliberate, tested, and optimized for real-world devices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Principle 1 */}
            <div className="bg-[#FAFAFA] dark:bg-[#121215] border border-neutral-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-red-600/40 transition-all hover:-translate-y-1">
              <div>
                <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Sub-Second Speed</h4>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  Fast sites keep visitors engaged. We optimize assets and queries so pages render instantly on mobile networks.
                </p>
              </div>
            </div>

            {/* Principle 2 */}
            <div className="bg-[#FAFAFA] dark:bg-[#121215] border border-neutral-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-red-600/40 transition-all hover:-translate-y-1">
              <div>
                <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Full Client Autonomy</h4>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  You shouldn&apos;t need a developer for every copy update. We build clean admin panels and hand over the keys completely.
                </p>
              </div>
            </div>

            {/* Principle 3 */}
            <div className="bg-[#FAFAFA] dark:bg-[#121215] border border-neutral-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-red-600/40 transition-all hover:-translate-y-1">
              <div>
                <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Local & Global Flow</h4>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  Support for local Ethiopian options like Telebirr alongside Stripe and PayPal checkouts for international buyers.
                </p>
              </div>
            </div>

            {/* Principle 4 */}
            <div className="bg-[#FAFAFA] dark:bg-[#121215] border border-neutral-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-red-600/40 transition-all hover:-translate-y-1">
              <div>
                <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">Clean, Maintainable Code</h4>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  Engineered with strict TypeScript and PostgreSQL. Any senior developer can inspect or scale the codebase with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Pills */}
      <section className="py-16 bg-[#F4F4F5] dark:bg-[#121215] border-t border-black/5 dark:border-white/10">
        <div className="container text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-red-600 block mb-2">
            Modern Foundations
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white mb-8">
            Battle-Tested Tech Stack
          </h3>
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {['Next.js 16 (App Router)', 'React 19', 'TypeScript', 'PostgreSQL (Neon Cloud)', 'Tailwind CSS', 'Drizzle ORM', 'Stripe Payments', 'Telegram Bot API'].map((tech) => (
              <div
                key={tech}
                className="bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-white/10 rounded-full px-5 py-2 text-sm font-semibold text-neutral-900 dark:text-white shadow-2xs flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-600" />
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Promise */}
      <section className="py-16 lg:py-20 bg-transparent border-t border-black/5 dark:border-white/10">
        <div className="container">
          <div className="max-w-3xl mx-auto border border-neutral-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 bg-[#FAFAFA] dark:bg-[#121215] text-center shadow-xs">
            <div className="inline-flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest mb-3">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              The MWD Promise
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white mb-4">
              Fixed Pricing. Guaranteed Timelines. Zero Surprises.
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
              We don&apos;t start work without a signed scope agreement detailing every deliverable and milestone date. If we say your site will be live in three weeks, it will be live in three weeks.
            </p>
          </div>
        </div>
      </section>

      {/* High-Converting CTA Banner */}
      <section className="py-20 lg:py-24 bg-transparent border-t border-black/5 dark:border-white/10">
        <div className="container">
          <div className="relative bg-neutral-950 text-white rounded-3xl p-10 sm:p-16 text-center overflow-hidden border border-white/10">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Ready to Build Something That Sets Your Brand Apart?
              </h2>
              <p className="text-neutral-300 text-base sm:text-lg mb-8 leading-relaxed">
                Tell us about your project vision. We will deliver a bespoke scope proposal and guaranteed timetable within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/request-quote"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-red-600/30 transition-all hover:-translate-y-0.5"
                >
                  Request a Free Quote
                </Link>
                <a
                  href="https://wa.me/251924502450"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-8 py-4 rounded-xl backdrop-blur-md transition-all hover:-translate-y-0.5"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
