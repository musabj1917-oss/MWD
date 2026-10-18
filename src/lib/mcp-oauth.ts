import { createHmac, createHash, timingSafeEqual } from "crypto";

export function baseUrl(req: Request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  return (env || new URL(req.url).origin).replace(/\/$/, "");
}

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is missing");
  return "mwd-mcp-oauth:" + s;
}

export function sign(type: string, data: Record<string, unknown>, ttlSec: number) {
  const body = Buffer.from(
    JSON.stringify({ ...data, t: type, exp: Math.floor(Date.now() / 1000) + ttlSec })
  ).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verify(token: string, type: string): any | null {
  const [body, sig] = (token || "").split(".");
  if (!body || !sig) return null;
  const want = createHmac("sha256", secret()).update(body).digest();
  const got = Buffer.from(sig, "base64url");
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (p.t !== type || p.exp < Date.now() / 1000) return null;
    return p;
  } catch {
    return null;
  }
}

export function safeEq(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, authorization, mcp-protocol-version",
};

export function json(data: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...cors, ...extra },
  });
}

/** Returns a Response to send back if auth fails, or null if the caller is allowed. */
export function checkMcpAuth(req: Request): Response | null {
  const apiKey = process.env.MCP_API_KEY;
  if (!apiKey || apiKey.length < 24) {
    return json({ error: "MCP server not configured" }, 503);
  }
  const bearer =
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim() ||
    req.headers.get("x-api-key") ||
    "";
  if (bearer && (safeEq(bearer, apiKey) || verify(bearer, "access"))) return null;
  return json({ error: "unauthorized" }, 401, {
    "www-authenticate": `Bearer resource_metadata="${baseUrl(req)}/.well-known/oauth-protected-resource"`,
  });
}

export function pkceOk(verifier: string, challenge: string) {
  const h = createHash("sha256").update(verifier).digest("base64url");
  return safeEq(h, challenge);
}

export function redirectAllowed(uri: string) {
  try {
    const u = new URL(uri);
    if (u.protocol === "https:" && ["claude.ai", "claude.com"].includes(u.hostname)) return true;
    if (u.protocol === "http:" && ["localhost", "127.0.0.1"].includes(u.hostname)) return true;
  } catch {}
  return false;
}
