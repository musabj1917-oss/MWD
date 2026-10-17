import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return <AdminShell email={session?.user?.email}>{children}</AdminShell>;
}
