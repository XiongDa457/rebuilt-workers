import { ZodType } from "zod";
import { getItem, prepDelete } from "./db";
import { AnyZodObject, UnauthorizedException } from "chanfana";

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

export async function verifySession(token: string): Promise<number> {
  const tokenHash = await hashString(token);
  const session = await getItem("ScouterSessions", { TokenHash: tokenHash });
  if (!session) throw new UnauthorizedException("Invalid token");

  // if (session.ExpiresAt < Date.now()) {
  //   await prepDelete("ScouterSessions", { TokenHash: tokenHash }).run();
  //   throw new UnauthorizedException("Expired Token");
  // }

  return session.StudentNumber;
}

type SchemaGen<ReqH extends AnyZodObject, ReqB extends ZodType, ResH extends AnyZodObject, ResB extends ZodType> = {
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

function contentJson<T>(schema: T) {
  return {
    content: {
      "application/json": {
        schema: schema
      }
    }
  }
}

export function generateSchema<ReqH extends AnyZodObject, ReqB extends ZodType, ResH extends AnyZodObject, ResB extends ZodType>(
  schemaGen: SchemaGen<ReqH, ReqB, ResH, ResB>
) {
  return {
    request: {
      ...(schemaGen.reqHeader !== undefined ? { headers: schemaGen.reqHeader } : {}),
      ...(schemaGen.reqBody !== undefined ? { body: contentJson(schemaGen.reqBody) } : {}),
    },
    responses: {
      "200": {
        description: "Request approved",
        ...(schemaGen.resHeader !== undefined ? { headers: schemaGen.resHeader } : {}),
        ...(schemaGen.resBody !== undefined ? contentJson(schemaGen.resBody) : {}),
      },
      "400": {
        description: "Invalid request"
      },
      "401": {
        description: "Invalid or expired token"
      },
      ...schemaGen.extraResponses,
    }
  };
}

