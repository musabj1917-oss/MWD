import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { nanoid } from 'nanoid';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { images } from '@/db/schema';
import { readImageFile } from '@/lib/images';

export const runtime = 'nodejs';

// Admin-only photo upload. Returns { url } to store on a project (cover image / gallery).
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file received.' }, { status: 400 });
  }

  const result = await readImageFile(file);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const id = nanoid(16);
  await db.insert(images).values({
    id,
    filename: file.name?.slice(0, 200) || null,
    contentType: result.contentType,
    size: result.buffer.length,
    data: result.buffer,
  });

  return NextResponse.json({ url: `/api/images/${id}` });
}
