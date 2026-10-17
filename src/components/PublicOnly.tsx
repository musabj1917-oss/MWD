'use client';

import { usePathname } from 'next/navigation';

/** Renders children everywhere except the admin area, which has its own chrome. */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <>{children}</>;
}
