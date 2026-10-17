import Link from 'next/link';
import { desc, eq, sql } from 'drizzle-orm';
import { ImageIcon } from 'lucide-react';
import { db } from '@/db';
import { inquiries, inquiryAttachments } from '@/db/schema';
import { Card, PageHeader, STATUS_STYLES, StatusBadge } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = status && status in STATUS_STYLES ? status : undefined;

  const [rows, counts] = await Promise.all([
    db
      .select({
        id: inquiries.id,
        reference: inquiries.reference,
        name: inquiries.name,
        email: inquiries.email,
        serviceOfInterest: inquiries.serviceOfInterest,
        budgetRange: inquiries.budgetRange,
        status: inquiries.status,
        createdAt: inquiries.createdAt,
        photos: sql<number>`(select count(*)::int from ${inquiryAttachments} where ${inquiryAttachments.inquiryId} = ${inquiries.id})`,
      })
      .from(inquiries)
      .where(filter ? eq(inquiries.status, filter) : undefined)
      .orderBy(desc(inquiries.createdAt)),
    db.select({ status: inquiries.status, count: sql<number>`count(*)::int` }).from(inquiries).groupBy(inquiries.status),
  ]);

  const countOf = (s: string) => counts.find((c) => c.status === s)?.count ?? 0;
  const total = counts.reduce((n, c) => n + c.count, 0);

  const tabs = [{ key: undefined as string | undefined, label: 'All', n: total }, ...Object.entries(STATUS_STYLES).map(([key, v]) => ({ key, label: v.label, n: countOf(key) }))];

  return (
    <div>
      <PageHeader kicker="Customers" title="Quote requests" subtitle="Open a request to see the full details, the customer's photos and contact buttons." />

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.key === filter;
          return (
            <Link
              key={t.label}
              href={t.key ? `/admin/inquiries?status=${t.key}` : '/admin/inquiries'}
              className={`border px-3 py-1.5 text-sm ${active ? 'border-black bg-black' : 'border-gray-300 bg-white hover:border-red-600'}`}
              style={{ color: active ? '#fff' : 'inherit' }}
            >
              {t.label} <span className={active ? 'text-gray-300' : 'text-gray-500'}>{t.n}</span>
            </Link>
          );
        })}
      </div>

      <Card className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Service</th>
              <th className="px-5 py-3 font-semibold">Budget</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <Link href={`/admin/inquiries/${r.id}`} className="font-semibold hover:underline" style={{ color: 'inherit' }}>
                    {r.name}
                  </Link>
                  <div className="text-xs text-gray-600">{r.email}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    {r.reference}
                    {r.photos > 0 && (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <ImageIcon size={12} aria-hidden /> {r.photos}
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-700">{r.serviceOfInterest || '—'}</td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-700">{r.budgetRange || '—'}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={r.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-600">{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                  No requests {filter ? 'with this status' : 'yet'}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
