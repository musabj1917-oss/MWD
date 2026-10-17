import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { inquiryAttachments } from '@/db/schema';

// Customer photos are private: only a signed-in admin can view them.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return new Response('Not found', { status: 404 });

  const [att] = await db.select().from(inquiryAttachments).where(eq(inquiryAttachments.id, numericId)).limit(1);
  if (!att) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(att.data), {
    headers: {
      'Content-Type': att.contentType,
      'Content-Length': String(att.data.length),
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
