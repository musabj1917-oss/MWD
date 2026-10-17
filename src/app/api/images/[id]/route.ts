import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { images } from '@/db/schema';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [img] = await db.select().from(images).where(eq(images.id, id)).limit(1);
  if (!img) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(img.data), {
    headers: {
      'Content-Type': img.contentType,
      'Content-Length': String(img.data.length),
      // ids are random and content never changes, so cache hard
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
