import { NextResponse } from 'next/server';
import { verifyTelegramSecret, processTelegramUpdate, type TelegramUpdate } from '@/lib/telegram';

export async function POST(request: Request) {
  const secretHeader = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error('TELEGRAM_WEBHOOK_SECRET environment variable is missing.');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (!verifyTelegramSecret(secretHeader, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: TelegramUpdate;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  try {
    const result = await processTelegramUpdate(body);
    return NextResponse.json({ ok: true, detail: result.body }, { status: result.status });
  } catch (error) {
    console.error('Unhandled error processing Telegram webhook update:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
