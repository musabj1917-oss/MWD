import { baseUrl, json, cors } from "@/lib/mcp-oauth";
export const dynamic = "force-dynamic";
export function GET(req: Request) {
  const b = baseUrl(req);
  return json({
    issuer: b,
    authorization_endpoint: `${b}/api/oauth/authorize`,
    token_endpoint: `${b}/api/oauth/token`,
    registration_endpoint: `${b}/api/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
  });
}
export function OPTIONS() { return new Response(null, { status: 204, headers: cors }); }
