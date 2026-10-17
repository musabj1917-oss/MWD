import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { ImageIcon, PlusCircle } from 'lucide-react';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { deleteProject, togglePortfolioPublished } from '@/server/actions/admin';
import { Card, PageHeader, PrimaryLink } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminPortfolioPage() {
  const projects = await db.select().from(portfolioProjects).orderBy(desc(portfolioProjects.createdAt));

  return (
    <div>
      <PageHeader
        kicker="Website content"
        title="Portfolio & photos"
        subtitle="Each project has a main photo and a gallery. Publish it to show it on the public portfolio page."
        action={
          <PrimaryLink href="/admin/portfolio/new">
            <PlusCircle size={16} aria-hidden /> Add project
          </PrimaryLink>
        }
      />

      {projects.length === 0 ? (
        <Card className="p-10 text-center">
          <ImageIcon className="mx-auto mb-3 text-gray-400" size={32} aria-hidden />
          <h2 className="text-xl font-semibold">No projects yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">Add your first project and upload its photos. It will appear on the portfolio page once you publish it.</p>
          <div className="mt-5">
            <PrimaryLink href="/admin/portfolio/new">Add your first project</PrimaryLink>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <div className="aspect-video bg-gray-100">
                {p.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">No photo yet</div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-red-600">{p.category || 'Uncategorised'}</p>
                <h2 className="mt-1 text-lg font-semibold leading-snug">{p.title}</h2>
                <p className="mt-1 text-xs text-gray-500">
                  /{p.slug} · {(p.coverImage ? 1 : 0) + (p.gallery?.length ?? 0)} photo(s)
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5 text-sm">
                  <form
                    action={async () => {
                      'use server';
                      await togglePortfolioPublished(p.id, !p.published);
                    }}
                  >
                    <button type="submit" className={`px-2.5 py-1 text-xs font-semibold ${p.published ? 'bg-green-100 text-green-900' : 'bg-gray-200 text-gray-700'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </button>
                  </form>
                  <Link href={`/admin/portfolio/${p.id}`} className="font-semibold underline" style={{ color: 'inherit' }}>
                    Edit
                  </Link>
                  <Link href={`/portfolio/${p.slug}`} target="_blank" className="underline" style={{ color: 'inherit' }}>
                    View
                  </Link>
                  <form
                    className="ml-auto"
                    action={async () => {
                      'use server';
                      await deleteProject(p.id);
                    }}
                  >
                    <button type="submit" className="text-xs text-red-600 underline">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
