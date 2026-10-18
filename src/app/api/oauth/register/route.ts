import { sign, json, cors, redirectAllowed } from "@/lib/mcp-oauth";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const uris: string[] = Array.isArray(body.redirect_uris) ? body.redirect_uris : [];
  if (!uris.length || !uris.every(redirectAllowed)) {
    return json({ error: "invalid_redirect_uri" }, 400);
  }
  const name = String(body.client_name || "MCP client").slice(0, 80);
  const client_id = sign("client", { ru: uris, n: name }, 10 * 365 * 24 * 3600);
  return json(
    {
      client_id,
      client_name: name,
      redirect_uris: uris,
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
    },
    201
  );
}
export function OPTIONS() { return new Response(null, { status: 204, headers: cors }); }
