import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MWD — Web Design, E-Commerce & Digital Menus | Addis Ababa',
  description:
    'MWD (Musab Web Development) builds fast, high-converting websites, Stripe-ready online stores, and contactless QR menus for growing businesses.',
};

export default async function Home() {
  let projects: (typeof portfolioProjects.$inferSelect)[] = [];
  try {
    projects = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.published, true))
      .orderBy(desc(portfolioProjects.createdAt))
      .limit(3);
  } catch (error) {
    console.error('Could not load projects for the homepage:', error instanceof Error ? error.message : error);
  }

  return (
    <div className="overflow-x-clip">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-[#FAFAFA] border-b border-black/5">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-black/10 rounded-full text-xs font-semibold text-neutral-800 mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Addis Ababa Studio • Accepting Q4/Q1 Projects
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.12] mb-6">
              We build fast, high-converting websites, stores, and QR menus for{' '}
              <span className="text-red-600">growing businesses.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mb-8 leading-relaxed font-normal">
              From bespoke corporate sites to automated restaurant menus and Stripe-powered online stores — we deliver
              turn-key digital products that win customers and eliminate monthly agency lock-in.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/request-quote"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5"
              >
                Request a Free Quote <span>→</span>
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-semibold px-6 py-3.5 rounded-lg transition-all hover:-translate-y-0.5"
              >
                Explore Our Work
              </Link>
            </div>
          </div>

          {/* Tangible Live Product Mockup */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xl shadow-black/5">
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-neutral-100">
                <span className="text-xs uppercase font-bold tracking-wider text-red-600 flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Live Solution Preview
                </span>
                <span className="text-xs text-neutral-500">Interactive Menu Demo</span>
              </div>

              <div className="bg-neutral-950 text-white rounded-xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base text-white">Specialty Pour-Over Coffee</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Single-origin Yirgacheffe, floral & citrus notes</p>
                  </div>
                  <div className="text-base font-bold text-emerald-400">$4.50</div>
                </div>

                <div className="flex justify-between items-center text-xs text-neutral-400 pt-2 border-t border-white/10">
                  <span>⚡ QR Code Scan Active</span>
                  <span className="text-emerald-400">✓ Instant Update Enabled</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                    <div className="text-xl font-extrabold text-white">&lt; 1s</div>
                    <div className="text-[10px] text-neutral-300 uppercase tracking-wider mt-0.5">Mobile Load Time</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                    <div className="text-xl font-extrabold text-white">+38%</div>
                    <div className="text-[10px] text-neutral-300 uppercase tracking-wider mt-0.5">Average Order Value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tangible Value & Commercial Trust Bar */}
      <section className="py-8 bg-white border-b border-black/5">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950">2-3 Weeks</div>
            <div className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">Typical Turnaround</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950">&lt; 24 Hours</div>
            <div className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">Guaranteed Scope & Quote</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950">Zero Lock-In</div>
            <div className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">100% Code & Asset Ownership</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950">Local & Global</div>
            <div className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">Telebirr, CBE & Stripe Ready</div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-red-600 block mb-3">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mb-4">
              Focused Services Engineered to Drive Revenue
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg">
              We avoid bloated templates. Every digital solution is purpose-built to deliver commercial results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1: Web Development */}
            <article className="group bg-white border border-neutral-200 hover:border-red-600/40 rounded-2xl p-8 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-950 mb-3 group-hover:text-red-600 transition-colors">
                  Website Development
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                  Custom business portals and landing pages designed to establish authority and generate qualified client inquiries.
                </p>
                <ul className="space-y-2.5 mb-8 text-sm text-neutral-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 font-bold shrink-0 leading-tight">✓</span>
                    <span>Next.js architecture with instant sub-second page loads</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 font-bold shrink-0 leading-tight">✓</span>
                    <span>Semantic SEO structure for Google search visibility</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 font-bold shrink-0 leading-tight">✓</span>
                    <span>Custom lead-capture forms with email & Telegram alerts</span>
                  </li>
                </ul>
              </div>
              <Link href="/services/website-development" className="text-red-600 font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                View Website Packages <span>→</span>
              </Link>
            </article>

            {/* Service 2: E-Commerce */}
            <article className="group bg-white border border-neutral-200 hover:border-red-600/40 rounded-2xl p-8 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-950 mb-3 group-hover:text-red-600 transition-colors">
                  E-Commerce Stores
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                  Scalable, conversion-optimized online storefronts with seamless checkouts, automated customer receipts, and inventory tools.
                </p>
                <ul className="space-y-2.5 mb-8 text-sm text-neutral-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 font-bold shrink-0 leading-tight">✓</span>
                    <span>International Stripe checkouts + domestic payment options</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 font-bold shrink-0 leading-tight">✓</span>
                    <span>Mobile-optimized shopping cart with zero friction</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 font-bold shrink-0 leading-tight">✓</span>
                    <span>Simple admin panel for adding products & tracking orders</span>
                  </li>
                </ul>
              </div>
              <Link href="/services/ecommerce" className="text-red-600 font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                View E-Commerce Packages <span>→</span>
              </Link>
            </article>

            {/* Service 3: Digital Menus */}
            <article className="group bg-white border border-neutral-200 hover:border-red-600/40 rounded-2xl p-8 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-950 mb-3 group-hover:text-red-600 transition-colors">
                  Digital QR Menus
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                  Contactless, instant-loading digital menus for restaurants, hotels, and cafes. Eliminate paper reprint expenses entirely.
                </p>
                <ul className="space-y-2.5 mb-8 text-sm text-neutral-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 font-bold shrink-0 leading-tight">✓</span>
                    <span>Scans instantly from camera with zero app download</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 font-bold shrink-0 leading-tight">✓</span>
                    <span>Update dishes, specials, and prices in real-time</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 font-bold shrink-0 leading-tight">✓</span>
                    <span>High-resolution photo galleries and dietary filters</span>
                  </li>
                </ul>
              </div>
              <Link href="/services/digital-menus" className="text-red-600 font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                View QR Menu Packages <span>→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Process: How It Works Section */}
      <section className="py-20 lg:py-24 bg-white border-t border-black/5">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-red-600 block mb-3">Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mb-4">
              A Transparent, Predictable Workflow
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg">
              No unexpected invoices or endless delays. Here is how we take your project from idea to live site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-8">
              <div className="text-3xl font-extrabold text-red-600 mb-3">01</div>
              <h4 className="text-xl font-bold text-neutral-950 mb-2">Discovery & Fixed Quote</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">
                We review your goals, recommend the right technical stack, and deliver a detailed scope breakdown with a
                guaranteed price and deadline.
              </p>
            </div>

            <div className="bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-8">
              <div className="text-3xl font-extrabold text-red-600 mb-3">02</div>
              <h4 className="text-xl font-bold text-neutral-950 mb-2">Design & Rapid Build</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">
                We develop high-fidelity mockups, gather your feedback, and build clean, scalable Next.js code tested
                across all mobile devices.
              </p>
            </div>

            <div className="bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-8">
              <div className="text-3xl font-extrabold text-red-600 mb-3">03</div>
              <h4 className="text-xl font-bold text-neutral-950 mb-2">Launch & Handover</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">
                We configure your custom domain, connect analytics and payment gateways, and hand over 100% of the code
                and credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Projects Showcase */}
      <section className="py-20 lg:py-24 bg-neutral-50 border-t border-black/5">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-red-600 block mb-2">Our Portfolio</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950">Selected Projects</h2>
            </div>
            <Link href="/portfolio" className="text-red-600 font-semibold text-sm hover:underline mt-4 md:mt-0">
              Browse all projects →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center max-w-xl mx-auto">
              <p className="text-neutral-600 mb-6 text-base">Projects are currently being updated in the portfolio.</p>
              <Link href="/request-quote" className="btn-primary">
                Start your project today
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-red-600/40 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col"
                >
                  <div className="aspect-video bg-neutral-100 overflow-hidden relative flex items-center justify-center">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-neutral-400 text-sm font-medium">Project Preview</span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {project.category ? (
                        <span className="text-[11px] uppercase tracking-wider font-bold text-red-600 block mb-1">
                          {project.category}
                        </span>
                      ) : null}
                      <h4 className="text-xl font-bold text-neutral-950 mb-2 group-hover:text-red-600 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-neutral-600 text-sm line-clamp-3 leading-relaxed">{project.summary}</p>
                    </div>
                    <span className="mt-6 text-red-600 text-sm font-semibold inline-flex items-center gap-1">
                      View case study <span>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 lg:py-20 bg-white border-t border-black/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center p-8 sm:p-12 bg-neutral-50 border border-neutral-200 rounded-3xl">
            <div className="text-amber-500 text-xl mb-4">★★★★★</div>
            <blockquote className="text-xl sm:text-2xl font-bold text-neutral-950 leading-relaxed mb-6">
              &ldquo;MWD built our restaurant&apos;s digital menu and website in less than two weeks. It eliminated menu
              printing costs immediately, and updating specials takes our manager under two minutes from a phone.&rdquo;
            </blockquote>
            <div className="font-bold text-neutral-950 text-base">Yonas T.</div>
            <div className="text-xs text-neutral-500 mt-1">Managing Director, Addis Ababa Restaurant Group</div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 lg:py-20 bg-[#FAFAFA] border-t border-black/5">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-red-600 block mb-2">Questions?</span>
            <h2 className="text-3xl font-extrabold text-neutral-950">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h4 className="font-bold text-neutral-950 text-base mb-2">How long does a website take to build?</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Most business websites launch in 2 to 3 weeks. E-commerce platforms and custom portals take 3 to 5 weeks
                depending on catalogue size.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h4 className="font-bold text-neutral-950 text-base mb-2">Can I accept local Ethiopian payments?</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Yes. We integrate local payment options like Telebirr and CBE Birr, as well as international processors
                like Stripe and PayPal.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h4 className="font-bold text-neutral-950 text-base mb-2">Do I own the website after launch?</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Absolutely. You own 100% of the code, domain, database, and assets. We do not lock you into mandatory
                monthly retainers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* High-Converting CTA Banner */}
      <section className="py-20 lg:py-24 bg-white border-t border-black/5">
        <div className="container">
          <div className="relative bg-neutral-950 text-white rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Ready to Build a Website That Drives Real Results?
              </h2>
              <p className="text-neutral-300 text-base sm:text-lg mb-8 leading-relaxed">
                Tell us about your project vision. We will deliver a bespoke scope proposal and guaranteed timetable
                within 24 hours.
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
