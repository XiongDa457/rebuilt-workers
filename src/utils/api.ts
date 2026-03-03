import { getItem, prepDelete } from "./db";

export function generateToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function hashString(str: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest("SHA-256", data);
}

type VerifyRet = "invalid" | number
export async function verifySession(token: string): Promise<VerifyRet> {
  const tokenHash = await hashString(token);
  const session = await getItem("ScouterSessions", {
    TokenHash: tokenHash,
  });
  if (!session) return "invalid";

  if (session.ExpiresAt < Date.now()) {
    await prepDelete("ScouterSessions", { TokenHash: tokenHash }).run();
    return "invalid";
  }

  return session.StudentNumber;
}
