import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { togglePortfolioPublished } from '@/server/actions/admin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPortfolioPage() {
  const projects = await db.select().from(portfolioProjects).orderBy(desc(portfolioProjects.createdAt));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <button disabled className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 opacity-50 cursor-not-allowed">
            Add Project (Demo)
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((proj) => (
              <tr key={proj.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-semibold">{proj.title}</div>
                  <div className="text-xs text-gray-500">/{proj.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proj.category || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   <form action={async () => {
                       'use server';
                       await togglePortfolioPublished(proj.id, !proj.published);
                   }}>
                       <button type="submit" className={`px-2 py-1 rounded text-xs font-semibold ${proj.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                           {proj.published ? 'Published' : 'Draft'}
                       </button>
                   </form>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/portfolio/${proj.slug}`} className="text-blue-600 hover:underline mr-4" target="_blank">View</Link>
                  <button disabled className="text-gray-400 cursor-not-allowed">Edit</button>
                </td>
              </tr>
            ))}
             {projects.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No portfolio projects found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
