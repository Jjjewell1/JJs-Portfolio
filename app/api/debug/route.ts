import { getSession } from "@/lib/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  return new Response(
    JSON.stringify({ hasSession: !!session, sessionPayload: session ?? null }),
    { headers: { "Content-Type": "application/json" } }
  );
}