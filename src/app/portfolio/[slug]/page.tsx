import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await db.select().from(portfolioProjects).where(and(eq(portfolioProjects.slug, params.slug), eq(portfolioProjects.published, true))).limit(1);
  
  if (project.length === 0) {
    return { title: 'Project Not Found | MWD Site' };
  }
  
  return {
    title: `${project[0].title} | Portfolio | MWD Site`,
    description: project[0].summary,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const projectResult = await db.select().from(portfolioProjects).where(and(eq(portfolioProjects.slug, params.slug), eq(portfolioProjects.published, true))).limit(1);

  if (projectResult.length === 0) {
    notFound();
  }

  const project = projectResult[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <span className="text-blue-600 font-semibold uppercase tracking-wider">{project.category}</span>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-gray-900">{project.title}</h1>
        <p className="text-xl text-gray-600">{project.summary}</p>
      </div>

      {project.coverImage && (
        <div className="mb-12 rounded-lg overflow-hidden border shadow-sm aspect-video relative bg-gray-100">
           <img src={project.coverImage} alt={project.title} className="object-cover w-full h-full" />
        </div>
      )}

      <div className="prose max-w-none text-gray-800 text-lg">
        <div className="whitespace-pre-wrap">{project.description}</div>
      </div>
      
      {project.projectUrl && (
          <div className="mt-12">
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition">
              Visit Live Project
            </a>
          </div>
      )}
    </div>
  );
}
