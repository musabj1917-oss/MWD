import { NextRequest, NextResponse } from 'next/server';
import { handleRpc } from '@/lib/mcp';
import { checkMcpAuth } from '@/lib/mcp-oauth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // Accepts the static MCP_API_KEY (Claude Code / Desktop) or an OAuth access token (claude.ai / phone app)
  const denied = checkMcpAuth(req);
  if (denied) return denied;

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
