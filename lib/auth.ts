const SECRET = process.env.SESSION_SECRET || "insecure-dev-secret";
const SESSION_COOKIE = "jj_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function toB64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

const encoder = new TextEncoder();

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionPayload {
  u: string;
  exp: number;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const data = toB64url(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return `${data}.${toB64url(sig)}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  try {
    const key = await hmacKey();
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      fromB64url(sig) as unknown as BufferSource,
      encoder.encode(data)
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(data))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookie(token: string) {
  const secure = process.env.NODE_ENV === "production";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure ? "; Secure" : ""}`;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;