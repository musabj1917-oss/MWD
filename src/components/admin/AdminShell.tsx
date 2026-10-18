'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Bot, ExternalLink, Images, Inbox, LayoutDashboard, LogOut, Video } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/inquiries', label: 'Quote requests', icon: Inbox },
  { href: '/admin/portfolio', label: 'Portfolio & photos', icon: Images },
  { href: '/admin/bot', label: 'Telegram bot', icon: Bot, exact: true },
  { href: '/admin/video', label: 'How-to video', icon: Video },
];

export function AdminShell({ email, children }: { email?: string | null; children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(href + '/'));

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
      active ? 'bg-white text-black border-l-4 border-red-600' : 'text-gray-300 hover:bg-white/10 border-l-4 border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-black lg:flex">
      {/* Sidebar (desktop) / top bar (mobile) */}
      <aside className="bg-black text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:flex-shrink-0 lg:flex lg:flex-col">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6 border-b border-white/10">
          <Link href="/admin" className="block" style={{ color: '#fff' }}>
            <span className="text-2xl font-bold" style={{ fontFamily: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif" }}>
              MWD<span className="text-red-600">.</span>
            </span>
            <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-gray-400 lg:ml-0 lg:block lg:mt-1">Admin</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 text-xs text-gray-300 hover:text-white lg:hidden"
            style={{ color: '#d1d5db' }}
          >
            <LogOut size={16} aria-hidden /> Sign out
          </button>
        </div>

        <nav className="flex overflow-x-auto lg:block lg:flex-1 lg:overflow-visible lg:py-4" aria-label="Admin navigation">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link key={href} href={href} className={`${linkClass(active)} whitespace-nowrap`} style={{ color: active ? '#000' : '#d1d5db' }} aria-current={active ? 'page' : undefined}>
                <Icon size={18} aria-hidden /> {label}
              </Link>
            );
          })}
          <Link href="/" target="_blank" className={`${linkClass(false)} whitespace-nowrap`} style={{ color: '#d1d5db' }}>
            <ExternalLink size={18} aria-hidden /> View website
          </Link>
        </nav>

        <div className="hidden lg:block border-t border-white/10 p-5">
          {email && <p className="mb-3 truncate text-xs text-gray-400">{email}</p>}
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex w-full items-center justify-center gap-2 border border-white/30 px-3 py-2 text-sm hover:bg-white hover:text-black"
            style={{ color: 'inherit' }}
          >
            <LogOut size={16} aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
