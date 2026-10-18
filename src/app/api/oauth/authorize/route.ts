import { sign, verify, safeEq } from "@/lib/mcp-oauth";
export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type P = { client_id: string; redirect_uri: string; code_challenge: string; state: string };

function check(p: P) {
  const c = verify(p.client_id, "client");
  if (!c || !c.ru.includes(p.redirect_uri) || !p.code_challenge) return null;
  return c as { n: string };
}

function page(p: P, name: string, error = "") {
  const hidden = Object.entries(p)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`)
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>MWD – Connect</title>
<style>body{font-family:system-ui;background:#000;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
form{background:#111;padding:28px;border-radius:16px;width:min(360px,90vw)}
h1{font-size:20px;margin:0 0 8px}p{color:#aaa;font-size:14px}
input[type=password]{width:100%;padding:12px;border-radius:10px;border:1px solid #333;background:#000;color:#fff;box-sizing:border-box;margin:12px 0}
button{width:100%;padding:12px;border:0;border-radius:10px;background:#E02020;color:#fff;font-weight:600;font-size:16px}
.e{color:#ff6b6b}</style></head><body><form method="post">
<h1>Connect to MWD</h1><p>${esc(name)} wants to manage your MWD site (inquiries, portfolio, bot). Enter the admin password to allow it.</p>
${error ? `<p class="e">${esc(error)}</p>` : ""}${hidden}
<input type="password" name="password" placeholder="Admin password" autofocus required>
<button type="submit">Allow</button></form></body></html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const p: P = {
    client_id: q.get("client_id") || "",
    redirect_uri: q.get("redirect_uri") || "",
    code_challenge: q.get("code_challenge") || "",
    state: q.get("state") || "",
  };
  if (q.get("response_type") !== "code" || (q.get("code_challenge_method") || "S256") !== "S256")
    return new Response("Unsupported request", { status: 400 });
  const c = check(p);
  if (!c) return new Response("Invalid client or redirect URI", { status: 400 });
  return page(p, c.n);
}

export async function POST(req: Request) {
  const f = await req.formData();
  const g = (k: string) => String(f.get(k) || "");
  const p: P = {
    client_id: g("client_id"),
    redirect_uri: g("redirect_uri"),
    code_challenge: g("code_challenge"),
    state: g("state"),
  };
  const c = check(p);
  if (!c) return new Response("Invalid client or redirect URI", { status: 400 });
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw || !safeEq(g("password"), pw)) return page(p, c.n, "Wrong password.");
  const code = sign("code", { cid: p.client_id, ru: p.redirect_uri, cc: p.code_challenge }, 300);
  const u = new URL(p.redirect_uri);
  u.searchParams.set("code", code);
  if (p.state) u.searchParams.set("state", p.state);
  return Response.redirect(u.toString(), 302);
}
