import { sign, verify, json, cors, pkceOk } from "@/lib/mcp-oauth";
export const dynamic = "force-dynamic";

function issue(cid: string) {
  return json({
    access_token: sign("access", { cid }, 3600),
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: sign("refresh", { cid }, 60 * 24 * 3600),
  });
}

export async function POST(req: Request) {
  const f = new URLSearchParams(await req.text());
  const grant = f.get("grant_type");
  if (grant === "authorization_code") {
    const c = verify(f.get("code") || "", "code");
    if (
      !c ||
      c.cid !== f.get("client_id") ||
      c.ru !== f.get("redirect_uri") ||
      !pkceOk(f.get("code_verifier") || "", c.cc)
    )
      return json({ error: "invalid_grant" }, 400);
    return issue(c.cid);
  }
  if (grant === "refresh_token") {
    const r = verify(f.get("refresh_token") || "", "refresh");
    if (!r) return json({ error: "invalid_grant" }, 400);
    return issue(r.cid);
  }
  return json({ error: "unsupported_grant_type" }, 400);
}
export function OPTIONS() { return new Response(null, { status: 204, headers: cors }); }
