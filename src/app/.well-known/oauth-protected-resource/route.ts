import { baseUrl, json, cors } from "@/lib/mcp-oauth";
export const dynamic = "force-dynamic";
export function GET(req: Request) {
  const b = baseUrl(req);
  return json({ resource: `${b}/api/mcp`, authorization_servers: [b], bearer_methods_supported: ["header"] });
}
export function OPTIONS() { return new Response(null, { status: 204, headers: cors }); }
