import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { and, asc, eq, like } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { botMessages } from '@/db/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// The browser sends the video in 3 MB pieces (Vercel limits one request to 4.5 MB).
// The pieces wait in the database, then the last request joins them and uploads the video to Telegram,
// which stores it and returns a file_id. Telegram bots can upload up to 50 MB.
const PREFIX = 'howto_up:';
const MAX_CHUNK = 3.5 * 1024 * 1024;
const MAX_CHUNKS = 16;

const fail = (message: string, status = 400) => NextResponse.json({ ok: false, message }, { status });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return fail('Please sign in again.', 401);

  const q = new URL(req.url).searchParams;
  const id = (q.get('id') || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
  const index = Number(q.get('index'));
  const total = Number(q.get('total'));
  const type = (q.get('type') || 'video/mp4').slice(0, 60);
  const name = ((q.get('name') || 'howto.mp4').replace(/[^\w.\-]/g, '_') || 'howto.mp4').slice(0, 80);

  if (!id || !Number.isInteger(index) || !Number.isInteger(total) || total < 1 || total > MAX_CHUNKS || index < 0 || index >= total) {
    return fail('Invalid upload. The video must be 48 MB or smaller.');
  }
  if (!type.startsWith('video/')) return fail('Please choose a video file.');

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return fail('TELEGRAM_BOT_TOKEN is not set.', 500);

  const body = Buffer.from(await req.arrayBuffer());
  if (!body.length || body.length > MAX_CHUNK) return fail('Invalid upload piece.');

  try {
    const [chat] = await db.select().from(botMessages).where(eq(botMessages.key, 'admin_chat_id')).limit(1);
    if (!chat?.value) {
      return fail('One-time setup: open your bot in Telegram, send /admin and your password, then upload again.');
    }

    if (index === 0) {
      // start fresh: remove leftovers from earlier uploads
      await db.delete(botMessages).where(like(botMessages.key, `${PREFIX}%`));
    }

    const key = `${PREFIX}${id}:${String(index).padStart(3, '0')}`;
    await db
      .insert(botMessages)
      .values({ key, value: body.toString('base64') })
      .onConflictDoUpdate({ target: botMessages.key, set: { value: body.toString('base64'), updatedAt: new Date() } });

    if (index < total - 1) return NextResponse.json({ ok: true, message: 'Piece stored.' });

    // last piece: join, send to Telegram, save the file_id
    const rows = await db
      .select()
      .from(botMessages)
      .where(like(botMessages.key, `${PREFIX}${id}:%`))
      .orderBy(asc(botMessages.key));
    if (rows.length !== total) return fail('Some pieces are missing. Please upload again.');

    const video = Buffer.concat(rows.map((r) => Buffer.from(r.value, 'base64')));
    const form = new FormData();
    form.append('chat_id', chat.value);
    form.append('caption', '✅ New how-to video uploaded from the website. It now opens first when someone sends /start.');
    form.append('supports_streaming', 'true');
    form.append('video', new Blob([new Uint8Array(video)], { type }), name);

    const res = await fetch(`https://api.telegram.org/bot${token}/sendVideo`, { method: 'POST', body: form });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; description?: string; result?: { video?: { file_id?: string } } } | null;
    const fileId = data?.result?.video?.file_id;
    if (!data?.ok || !fileId) {
      console.error('Telegram sendVideo failed:', data?.description);
      return fail(`Telegram did not accept the video${data?.description ? `: ${data.description}` : ''}. Try an MP4 file.`);
    }

    await db
      .insert(botMessages)
      .values({ key: 'howto_video', value: fileId })
      .onConflictDoUpdate({ target: botMessages.key, set: { value: fileId, updatedAt: new Date() } });
    await db.delete(botMessages).where(and(like(botMessages.key, `${PREFIX}%`)));

    return NextResponse.json({ ok: true, message: 'Uploaded. The video now opens first when someone sends /start.' });
  } catch (error) {
    console.error('How-to video upload failed:', error instanceof Error ? error.message : error);
    return fail('Upload failed. Please try again.', 500);
  }
}
