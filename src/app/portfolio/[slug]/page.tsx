import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.select().from(portfolioProjects).where(and(eq(portfolioProjects.slug, slug), eq(portfolioProjects.published, true))).limit(1);

  if (project.length === 0) {
    return { title: 'Project not found — MWD' };
  }

  return {
    title: `${project[0].title} — MWD Portfolio`,
    description: project[0].summary,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projectResult = await db.select().from(portfolioProjects).where(and(eq(portfolioProjects.slug, slug), eq(portfolioProjects.published, true))).limit(1);

  if (projectResult.length === 0) {
    notFound();
  }

  const project = projectResult[0];

  return (
    <main className="container py-20">
      <article>
        <p className="text-red-600 font-semibold uppercase tracking-[0.2em] text-xs">{project.category}</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">{project.title}</h1>
        <p className="text-xl text-gray-700 max-w-3xl mb-8">{project.summary}</p>

        {project.coverImage && (
          <div className="mb-10 border bg-gray-100 aspect-[16/9] overflow-hidden">
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-3xl text-gray-800 whitespace-pre-wrap leading-relaxed">
          {project.description}
        </div>

        {project.projectUrl && (
          <div className="mt-10">
            <a href={project.projectUrl} target="_blank" rel="noreferrer" className="btn-primary">Visit live project</a>
          </div>
        )}
      </article>
    </main>
  );
}
