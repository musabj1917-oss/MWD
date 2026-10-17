import { db } from '@/db';
import { inquiries, portfolioProjects } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const inquiryCountResult = await db.select({ count: sql<number>`count(*)::int` }).from(inquiries);
  const portfolioCountResult = await db.select({ count: sql<number>`count(*)::int` }).from(portfolioProjects);

  const inquiryCount = inquiryCountResult[0].count;
  const portfolioCount = portfolioCountResult[0].count;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Inquiries</h2>
          <p className="text-4xl font-bold text-blue-600">{inquiryCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Portfolio Projects</h2>
          <p className="text-4xl font-bold text-blue-600">{portfolioCount}</p>
        </div>
      </div>
    </div>
  );
}
