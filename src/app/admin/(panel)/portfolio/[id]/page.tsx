import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { PageHeader } from '@/components/admin/ui';
import { ProjectForm } from '@/components/admin/ProjectForm';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId)) notFound();

  const [project] = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, projectId)).limit(1);
  if (!project) notFound();

  return (
    <div>
      <PageHeader kicker="Portfolio" title={`Edit: ${project.title}`} />
      <ProjectForm project={project} />
    </div>
  );
}
