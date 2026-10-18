import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { portfolioProjects, botMessages } from '@/db/schema';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MWD — Web Design & Digital Solutions',
  description: 'MWD is a creative digital agency delivering high-end websites, e-commerce, and digital menus with editorial design and measurable results.',
};

export default async function Home() {
  // Latest published projects feed the hero image and the "Selected projects" cards
  let projects: (typeof portfolioProjects.$inferSelect)[] = [];
  try {
    projects = await db.select().from(portfolioProjects).where(eq(portfolioProjects.published, true)).orderBy(desc(portfolioProjects.createdAt)).limit(3);
  } catch (error) {
    console.error('Could not load projects for the homepage:', error instanceof Error ? error.message : error);
  }
  const heroImage = projects.find((p) => p.coverImage)?.coverImage ?? null;
  let howToVideo = '';
  try {
    const [row] = await db.select().from(botMessages).where(eq(botMessages.key, 'howto_video')).limit(1);
    howToVideo = row?.value && /^https?:\/\//i.test(row.value) ? row.value : '';
  } catch (error) {
    console.error('Could not load homepage how-to video:', error);
  }
  const videoUrl = (() => {
    if (!howToVideo) return null;
    try {
      const url = new URL(howToVideo);
      const host = url.hostname.toLowerCase();
      if (host === 'youtu.be') return 'https://www.youtube-nocookie.com/embed/' + url.pathname.slice(1).split('/')[0];
      if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
        const id = url.searchParams.get('v') || url.pathname.match(/\/embed\/([^/]+)/)?.[1] || url.pathname.match(/\/shorts\/([^/]+)/)?.[1];
        return id ? 'https://www.youtube-nocookie.com/embed/' + id : null;
      }
      if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
        const id = url.pathname.split('/').filter(Boolean).pop();
        return id && /^\d+$/.test(id) ? 'https://player.vimeo.com/video/' + id : null;
      }
      return /\.(mp4|webm|ogg)$/i.test(url.pathname) ? howToVideo : null;
    } catch { return null; }
  })();

  return (
    <div>
      <header className="bg-white py-20">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="text-sm text-red-600 font-semibold mb-4">Creative agency — Addis Ababa</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              We design distinct digital experiences that sharpen your brand and convert customers.
            </h1>
            <p className="lede mt-6">A small studio focused on elegant websites, scalable e-commerce, and pragmatic digital menus. We combine art-directed design with technical rigor to deliver measurable outcomes.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/request-quote" className="btn-primary">Request a quote</Link>
              <Link href="/portfolio" className="btn-ghost">View portfolio</Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="hero-media bg-gray-100 h-72 md:h-96 flex items-center justify-center overflow-hidden">
              {heroImage ? (
                <img src={heroImage} alt="Recent MWD project" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400" aria-hidden>Project imagery</div>
              )}
            </div>
          </div>
        </div>
      </header>

      {videoUrl && (
        <section id="how-to-video" className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-semibold mb-3">How to use MWD</h2>
            <p className="text-gray-600 mb-8">Watch our quick guide.</p>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-black aspect-video">
              {/\.(mp4|webm|ogg)(\?.*)?$/i.test(videoUrl) ? (
                <video className="h-full w-full" controls playsInline preload="metadata">
                  <source src={videoUrl} />
                  Your browser does not support video playback.
                </video>
              ) : (
                <iframe className="h-full w-full" src={videoUrl} title="How to use MWD" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" />
              )}
            </div>
          </div>
        </section>
      )}

      <div>
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl font-semibold mb-6">Core services</h2>
            <p className="text-gray-600 mb-8">We focus on a small set of services we do exceptionally well.</p>

            <div className="grid md:grid-cols-3 gap-6">
              <article className="border p-6">
                <h3 className="text-2xl font-bold mb-3">Website Development</h3>
                <p className="text-gray-700 mb-4">Custom business websites and landing pages crafted for clarity and performance. Accessible, SEO-friendly, and easy to maintain.</p>
                <Link href="/services/website-development" className="text-red-600 font-medium">Learn more →</Link>
              </article>

              <article className="border p-6">
                <h3 className="text-2xl font-bold mb-3">E-commerce</h3>
                <p className="text-gray-700 mb-4">Scalable storefronts with secure checkout and integrations for payments, inventory, and shipping.</p>
                <Link href="/services/ecommerce" className="text-red-600 font-medium">Learn more →</Link>
              </article>

              <article className="border p-6">
                <h3 className="text-2xl font-bold mb-3">Digital Menus</h3>
                <p className="text-gray-700 mb-4">Mobile-first QR menus that are easy to update and polished to match your brand.</p>
                <Link href="/services/digital-menus" className="text-red-600 font-medium">Learn more →</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl font-semibold mb-6">Selected projects</h2>
            <p className="text-gray-600 mb-8">A curated selection of recent work. Click any project to view details.</p>

            {projects.length === 0 ? (
              <p className="border bg-gray-50 p-8 text-gray-600">Projects are coming soon. <Link href="/request-quote" className="text-red-600">Request a quote</Link> to start yours.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link key={project.id} href={`/portfolio/${project.slug}`} className="group block border p-4 hover:border-red-600 transition">
                    <div className="h-40 bg-gray-100 mb-4 overflow-hidden flex items-center justify-center text-gray-400">
                      {project.coverImage ? (
                        <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <span>Project image</span>
                      )}
                    </div>
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{project.summary}</p>
                    <span className="mt-4 inline-block text-red-600">View case study</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to start?</h2>
            <p className="text-gray-600 mb-6">Tell us about your project and we’ll respond with a clear plan and timetable.</p>
            <Link href="/request-quote" className="btn-primary">Request a quote</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
