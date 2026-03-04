import { AnyZodObject, ZodTypeAny } from "zod";
import { getItem, prepDelete } from "./db";
import { contentJson } from "chanfana";

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

type SchemaGen<ReqH extends AnyZodObject, ReqB extends ZodTypeAny, ResH extends AnyZodObject, ResB extends ZodTypeAny> = {
  reqHeader?: ReqH,
  reqBody?: ReqB,
  resHeader?: ResH,
  resBody?: ResB,
  extraResponses?: {
    [status: string]: {
      description: string
    }
  }
}

export function generateSchema<ReqH extends AnyZodObject, ReqB extends ZodTypeAny, ResH extends AnyZodObject, ResB extends ZodTypeAny>(
  schemaGen: SchemaGen<ReqH, ReqB, ResH, ResB>
) {
  return {
    request: {
      ...(schemaGen.reqHeader !== undefined ? { headers: schemaGen.reqHeader } : {}),
      ...(schemaGen.reqBody !== undefined ? { body: contentJson(schemaGen.reqHeader) } : {}),
    },
    responses: {
      "200": {
        description: "Request approved",
        ...(schemaGen.resHeader !== undefined ? { headers: schemaGen.resHeader } : {}),
        ...(schemaGen.reqBody !== undefined ? contentJson(schemaGen.resBody) : {}),
      },
      "400": {
        description: "Invalid or expired token"
      },
      ...schemaGen.extraResponses,
    }
  };
}

