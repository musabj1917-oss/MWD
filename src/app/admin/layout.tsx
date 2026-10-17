import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-900 text-white min-h-screen flex-shrink-0">
        <div className="p-4 font-bold text-xl border-b border-gray-800">
          <Link href="/admin">MWD Admin</Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Dashboard</Link>
          <Link href="/admin/inquiries" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Inquiries</Link>
          <Link href="/admin/portfolio" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Portfolio</Link>
        </nav>
      </aside>

      <main className="flex-grow p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
