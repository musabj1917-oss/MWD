import Link from 'next/link';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const metadata = {
  title: 'Our Portfolio | MWD Site',
  description: 'Explore our latest web development, e-commerce, and digital menu projects.',
};


export default async function PortfolioPage() {
  const projects = await db.select().from(portfolioProjects).where(eq(portfolioProjects.published, true)).orderBy(desc(portfolioProjects.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Our Portfolio</h1>
      <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Discover our latest projects and see how we've helped businesses achieve their digital goals.
      </p>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Projects Coming Soon</h2>
          <p className="text-gray-500">We are currently updating our portfolio. Please check back later.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <Link key={project.id} href={`/portfolio/${project.slug}`} className="group block bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="object-cover w-full h-full group-hover:scale-105 transition duration-300" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image provided</div>
                )}
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wide">{project.category}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition">{project.title}</h3>
                <p className="text-gray-600 line-clamp-2">{project.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
