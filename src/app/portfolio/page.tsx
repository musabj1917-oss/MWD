import Link from 'next/link';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portfolio — MWD',
  description: 'A portfolio of MWD projects across website design, e-commerce, and digital menus.',
};

export default async function PortfolioPage() {
  const projects = await db.select().from(portfolioProjects).where(eq(portfolioProjects.published, true)).orderBy(desc(portfolioProjects.createdAt));

  return (
    <div className="container py-20">
      <header className="max-w-3xl mb-12">
        <p className="text-red-600 font-semibold uppercase tracking-[0.2em] text-xs">Portfolio</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-4">Selected work.</h1>
        <p className="mt-4 text-gray-700">A selection of digital products and business websites designed to make brands more credible, discoverable, and easier to buy from.</p>
      </header>

      {projects.length === 0 ? (
        <div className="border p-12 text-center bg-gray-50">
          <h2 className="text-2xl font-semibold mb-3">Projects coming soon</h2>
          <p className="text-gray-600">We are updating our portfolio with recent client work. Please check back soon or request a quote to discuss a new project.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Link key={project.id} href={`/portfolio/${project.slug}`} className="group block border bg-white hover:border-red-600 transition">
              <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <span>Project image</span>
                )}
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-red-600 mb-2">{project.category}</p>
                <h2 className="text-2xl font-semibold mb-3">{project.title}</h2>
                <p className="text-gray-700">{project.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
