import Link from 'next/link';
import { desc, eq, sql } from 'drizzle-orm';
import { Images, Inbox, PlusCircle } from 'lucide-react';
import { db } from '@/db';
import { inquiries, portfolioProjects } from '@/db/schema';
import { Card, CardTitle, PageHeader, PrimaryLink, StatusBadge } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [statusRows, [projectCounts], recent] = await Promise.all([
    db.select({ status: inquiries.status, count: sql<number>`count(*)::int` }).from(inquiries).groupBy(inquiries.status),
    db
      .select({
        total: sql<number>`count(*)::int`,
        published: sql<number>`count(*) filter (where ${portfolioProjects.published})::int`,
      })
      .from(portfolioProjects),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(6),
  ]);

  const byStatus = Object.fromEntries(statusRows.map((r) => [r.status, r.count])) as Record<string, number>;
  const total = statusRows.reduce((n, r) => n + r.count, 0);

  const stats = [
    { label: 'New requests', value: byStatus.new ?? 0, href: '/admin/inquiries?status=new', accent: true },
    { label: 'All requests', value: total, href: '/admin/inquiries' },
    { label: 'Quotes sent', value: byStatus.quoted ?? 0, href: '/admin/inquiries?status=quoted' },
    { label: 'Published projects', value: `${projectCounts.published}/${projectCounts.total}`, href: '/admin/portfolio' },
  ];

  return (
    <div>
      <PageHeader
        kicker="Overview"
        title="Dashboard"
        subtitle="Quote requests from your website and the projects shown in your portfolio."
        action={
          <PrimaryLink href="/admin/portfolio/new">
            <PlusCircle size={16} aria-hidden /> Add project
          </PrimaryLink>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`block border bg-white p-5 hover:border-red-600 ${s.accent && Number(s.value) > 0 ? 'border-red-600' : 'border-gray-300'}`}
            style={{ color: 'inherit' }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{s.label}</p>
            <p className={`mt-3 text-4xl font-bold ${s.accent && Number(s.value) > 0 ? 'text-red-600' : ''}`} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <Card>
        <CardTitle
          action={
            <Link href="/admin/inquiries" className="text-sm underline">
              View all
            </Link>
          }
        >
          Latest quote requests
        </CardTitle>
        {recent.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">No requests yet. They will appear here as soon as someone submits the quote form.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recent.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/inquiries/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50" style={{ color: 'inherit' }}>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.name}</p>
                    <p className="truncate text-sm text-gray-600">
                      {r.serviceOfInterest || 'No service chosen'} · {r.reference}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    <StatusBadge status={r.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/admin/inquiries" className="flex items-center gap-4 border border-gray-300 bg-white p-5 hover:border-red-600" style={{ color: 'inherit' }}>
          <Inbox className="text-red-600" aria-hidden />
          <div>
            <p className="font-semibold">Answer quote requests</p>
            <p className="text-sm text-gray-600">See customer photos, reply by email, Telegram or WhatsApp.</p>
          </div>
        </Link>
        <Link href="/admin/portfolio" className="flex items-center gap-4 border border-gray-300 bg-white p-5 hover:border-red-600" style={{ color: 'inherit' }}>
          <Images className="text-red-600" aria-hidden />
          <div>
            <p className="font-semibold">Manage portfolio photos</p>
            <p className="text-sm text-gray-600">Upload product and project photos for the public site.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
