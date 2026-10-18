import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { handleRpc } from '@/lib/mcp';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const digest = (s: string) => createHash('sha256').update(s).digest();

function checkAuth(req: NextRequest): 'ok' | 'denied' | 'disabled' {
  const key = process.env.MCP_API_KEY;
  if (!key || key.length < 24) return 'disabled'; // refuse to run with a missing or weak key
  const header = req.headers.get('authorization') ?? '';
  const supplied = /^bearer\s+/i.test(header) ? header.replace(/^bearer\s+/i, '').trim() : req.headers.get('x-api-key') ?? '';
  if (!supplied) return 'denied';
  return timingSafeEqual(digest(supplied), digest(key)) ? 'ok' : 'denied';
}

export async function POST(req: NextRequest) {
  const auth = checkAuth(req);
  if (auth === 'disabled') return NextResponse.json({ error: 'MCP server is not configured.' }, { status: 503 });
  if (auth === 'denied') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, { status: 400 });
  }

  if (Array.isArray(body)) {
    if (body.length === 0 || body.length > 20) {
      return NextResponse.json({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid batch' } }, { status: 400 });
    }
    const replies = (await Promise.all(body.map((m) => handleRpc(m)))).filter(Boolean);
    return replies.length ? NextResponse.json(replies) : new NextResponse(null, { status: 202 });
  }

  const reply = await handleRpc(body as Parameters<typeof handleRpc>[0]);
  return reply ? NextResponse.json(reply) : new NextResponse(null, { status: 202 });
}

// This server only answers POST requests (no streaming)
const notAllowed = () => new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
export const GET = notAllowed;
export const DELETE = notAllowed;
