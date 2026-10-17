import Link from 'next/link';

/** Shared admin building blocks so every page looks like part of the same site. */

export function PageHeader({
  kicker,
  title,
  subtitle,
  action,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-black pb-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">{kicker}</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-gray-600">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`border border-gray-300 bg-white ${className}`}>{children}</section>;
}

export function CardTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
      <h2 className="text-lg font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 bg-red-600 px-4 py-2.5 text-sm font-semibold hover:bg-black" style={{ color: '#fff' }}>
      {children}
    </Link>
  );
}

export const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-red-600 text-white' },
  reviewing: { label: 'Reviewing', className: 'bg-amber-100 text-amber-900' },
  quoted: { label: 'Quoted', className: 'bg-blue-100 text-blue-900' },
  in_progress: { label: 'In progress', className: 'bg-indigo-100 text-indigo-900' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-900' },
  rejected: { label: 'Rejected', className: 'bg-gray-200 text-gray-700' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { label: status, className: 'bg-gray-100 text-gray-800' };
  return <span className={`inline-block px-2.5 py-1 text-xs font-semibold ${s.className}`}>{s.label}</span>;
}

export const inputClass = 'w-full border border-gray-300 bg-white p-3 text-sm focus:border-red-600';
export const labelClass = 'block text-sm font-medium text-gray-800 mb-1';
