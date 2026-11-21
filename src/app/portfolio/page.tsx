import Link from 'next/link';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { ArrowUpRight, Sparkles, Layers, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portfolio — MWD | Selected Client Case Studies',
  description: 'A showcase of high-performance websites, e-commerce stores, and digital menu architectures engineered by MWD.',
};

const showcaseFallbacks = [
  {
    id: 'case-1',
    title: 'Kuriftu Dining Experience',
    category: 'Digital Menus',
    summary: 'Instant QR menu architecture supporting 200+ dishes, multi-language switching (English & Amharic), and offline caching.',
    metrics: '< 800ms scan-to-order',
    tag: 'Hospitality',
  },
  {
    id: 'case-2',
    title: 'Addis Artisan Roastery',
    category: 'E-Commerce',
    summary: 'Direct-to-consumer specialty coffee storefront with recurring subscription checkout, Telebirr integration, and inventory sync.',
    metrics: '+42% mobile conversion',
    tag: 'Retail & D2C',
  },
  {
    id: 'case-3',
    title: 'Apex Ethiopian Logistics',
    category: 'Website Development',
    summary: 'Bilingual corporate portal with live cargo shipment tracking, interactive quote calculator, and enterprise speed.',
    metrics: '99/100 Lighthouse score',
    tag: 'Corporate & Freight',
  },
];

export default async function PortfolioPage() {
  let projects: any[] = [];
  try {
    projects = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.published, true))
      .orderBy(desc(portfolioProjects.createdAt));
  } catch (err) {
    // If DB has no table or connection issue during static preview, fallback safely
    projects = [];
  }

  const displayList = projects.length > 0 ? projects : showcaseFallbacks;
  const isLiveDb = projects.length > 0;

  return (
    <div className="min-h-screen py-16 sm:py-24">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 mb-4">
            <Sparkles size={14} className="text-red-600" />
            Proof of Work
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Selected digital case studies.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Every digital product is engineered for zero bloat, high conversions, and measurable commercial results.
          </p>
        </header>

        {/* Grid of Work */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}
        >
          {displayList.map((project: any) => (
            <article
              key={project.id || project.slug}
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md overflow-hidden hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Visual Cover Header */}
                <div className="relative aspect-video w-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950 flex items-center justify-center overflow-hidden border-b border-neutral-200 dark:border-white/5">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-500 mb-2 group-hover:scale-110 transition-transform">
                        <Layers size={22} />
                      </div>
                      <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">Live Case Study</span>
                    </div>
                  )}

                  {project.metrics && (
                    <span className="absolute bottom-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-md bg-neutral-950/80 text-white backdrop-blur-sm border border-white/10">
                      {project.metrics}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                      {project.category}
                    </span>
                    {project.tag && (
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                        {project.tag}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-neutral-950 dark:text-white mb-2 group-hover:text-red-600 transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {project.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">Next.js & Neon DB</span>
                {isLiveDb ? (
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    View Case Study <ArrowUpRight size={14} />
                  </Link>
                ) : (
                  <Link
                    href="/request-quote"
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    Build Something Similar <ArrowUpRight size={14} />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* CTA Footer Block */}
        <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-[#121215]/80 backdrop-blur-md p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white mb-4">
            Ready to build your flagship digital presence?
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Every client project starts with a detailed technical discovery and wireframe review. Let’s create something that converts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/request-quote" className="btn-primary w-full sm:w-auto px-8 py-3.5">
              Request Project Proposal
            </Link>
            <Link href="/contact" className="btn-ghost w-full sm:w-auto px-6 py-3.5">
              Talk Directly With Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
