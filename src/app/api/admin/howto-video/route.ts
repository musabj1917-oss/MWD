import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { asc, eq, like } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { botMessages } from '@/db/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// The browser sends each file in 3 MB pieces (Vercel limits one request to 4.5 MB).
// The pieces wait in the database, then the last request joins them and uploads the file to Telegram,
// which stores it and returns a file_id. Bots can upload videos up to 50 MB and photos up to 10 MB.
const PREFIX = 'howto_up:';
const MAX_CHUNK = 3.5 * 1024 * 1024;
const MAX_VIDEO_CHUNKS = 16;
const MAX_IMAGE_CHUNKS = 4;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_PHOTOS = 10;

const fail = (message: string, status = 400) => NextResponse.json({ ok: false, message }, { status });

async function save(key: string, value: string) {
  await db
    .insert(botMessages)
    .values({ key, value })
    .onConflictDoUpdate({ target: botMessages.key, set: { value, updatedAt: new Date() } });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return fail('Please sign in again.', 401);

  const q = new URL(req.url).searchParams;
  const id = (q.get('id') || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
  const index = Number(q.get('index'));
  const total = Number(q.get('total'));
  const type = (q.get('type') || '').slice(0, 60);
  const replace = q.get('replace') === '1';
  const isVideo = type.startsWith('video/');
  const isImage = type.startsWith('image/');
  const name = ((q.get('name') || (isImage ? 'photo.jpg' : 'howto.mp4')).replace(/[^\w.\-]/g, '_') || 'upload').slice(0, 80);

  if (!isVideo && !isImage) return fail('Please choose a video or a photo.');
  const maxChunks = isVideo ? MAX_VIDEO_CHUNKS : MAX_IMAGE_CHUNKS;
  if (!id || !Number.isInteger(index) || !Number.isInteger(total) || total < 1 || total > maxChunks || index < 0 || index >= total) {
    return fail(isVideo ? 'Invalid upload. The video must be 48 MB or smaller.' : 'Invalid upload. A photo must be 10 MB or smaller.');
  }

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

    await save(`${PREFIX}${id}:${String(index).padStart(3, '0')}`, body.toString('base64'));
    if (index < total - 1) return NextResponse.json({ ok: true, message: 'Piece stored.' });

    // last piece: join, send to Telegram, save the file_id
    const rows = await db
      .select()
      .from(botMessages)
      .where(like(botMessages.key, `${PREFIX}${id}:%`))
      .orderBy(asc(botMessages.key));
    if (rows.length !== total) return fail('Some pieces are missing. Please upload again.');

    const file = Buffer.concat(rows.map((r) => Buffer.from(r.value, 'base64')));
    if (isImage && file.length > MAX_IMAGE_BYTES) return fail('That photo is too big. The maximum is 10 MB.');

    const form = new FormData();
    form.append('chat_id', chat.value);
    if (isVideo) {
      form.append('caption', '✅ New how-to video uploaded from the website. It now opens first when someone sends /start.');
      form.append('supports_streaming', 'true');
      form.append('video', new Blob([new Uint8Array(file)], { type }), name);
    } else {
      form.append('caption', '✅ Photo added to the how-to guide from the website.');
      form.append('photo', new Blob([new Uint8Array(file)], { type }), name);
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/${isVideo ? 'sendVideo' : 'sendPhoto'}`, { method: 'POST', body: form });
    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      description?: string;
      result?: { video?: { file_id?: string }; photo?: { file_id?: string }[] };
    } | null;
    const fileId = isVideo ? data?.result?.video?.file_id : data?.result?.photo?.[data.result.photo.length - 1]?.file_id;
    if (!data?.ok || !fileId) {
      console.error('Telegram upload failed:', data?.description);
      return fail(`Telegram did not accept the file${data?.description ? `: ${data.description}` : ''}. ${isVideo ? 'Try an MP4 file.' : 'Try a JPG or PNG photo.'}`);
    }

    if (isVideo) {
      await save('howto_video', fileId);
    } else {
      let list: string[] = [];
      if (!replace) {
        const [row] = await db.select().from(botMessages).where(eq(botMessages.key, 'howto_photos')).limit(1);
        try {
          const parsed: unknown = JSON.parse(row?.value ?? '[]');
          if (Array.isArray(parsed)) list = parsed.filter((x): x is string => typeof x === 'string');
        } catch {
          list = [];
        }
      }
      if (list.length >= MAX_PHOTOS) return fail(`You can add up to ${MAX_PHOTOS} photos.`);
      list.push(fileId);
      await save('howto_photos', JSON.stringify(list));
    }

    await db.delete(botMessages).where(like(botMessages.key, `${PREFIX}%`));
    return NextResponse.json({ ok: true, message: isVideo ? 'Video uploaded.' : 'Photo uploaded.' });
  } catch (error) {
    console.error('How-to upload failed:', error instanceof Error ? error.message : error);
    return fail('Upload failed. Please try again.', 500);
  }
}
