import { signSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Hardcoded admin credentials for personal site
  if (username !== "Jjjewell1" || password !== "Jj4202jj") {
    return new Response(JSON.stringify({ ok: false, error: "Invalid credentials." }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const user = { username: "admin" };
  const token = await signSession({ u: user.username, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });

  const resp = new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  resp.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
  );
  return resp;
}