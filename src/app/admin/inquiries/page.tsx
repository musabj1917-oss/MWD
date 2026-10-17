import { db } from '@/db';
import { inquiries } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { updateInquiryStatus } from '@/server/actions/admin';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const allInquiries = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Inquiries</h1>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allInquiries.map((inq) => (
              <tr key={inq.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inq.reference}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{inq.name}</div>
                  <div className="text-xs">{inq.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inq.serviceOfInterest || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   <form action={async (formData: FormData) => {
                       'use server';
                       await updateInquiryStatus(inq.id, formData.get('status') as string);
                   }}>
                     <select name="status" defaultValue={inq.status}  className="border rounded p-1 text-sm bg-white">
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="quoted">Quoted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                     </select>
                     <button type="submit" className="ml-2 px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
                   </form>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {allInquiries.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No inquiries found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
