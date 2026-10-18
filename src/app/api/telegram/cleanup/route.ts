import { NextResponse } from 'next/server';
import { sweepIdleChats, verifyTelegramSecret } from '@/lib/telegram';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Called every minute by a scheduler (for example cron-job.org). Deletes the bot's chat messages after 10 idle minutes.
// Authorize with the header "Authorization: Bearer <CRON_SECRET>" or the link parameter ?key=<CRON_SECRET>.
async function handle(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: 'CRON_SECRET is not set' }, { status: 503 });

  const bearer = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const key = new URL(req.url).searchParams.get('key') || '';
  if (!verifyTelegramSecret(bearer, secret) && !verifyTelegramSecret(key, secret)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cleaned = await sweepIdleChats();
    return NextResponse.json({ ok: true, cleaned });
  } catch (error) {
    console.error('Scheduled chat cleanup failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: 'Cleanup failed' }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
