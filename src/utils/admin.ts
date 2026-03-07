import { UnauthorizedException } from "chanfana";
import { env } from "cloudflare:workers";

export function veryfyAdminToken(token: string) {
  if (token !== env.ADMIN_TOKEN) throw new UnauthorizedException("Wrong admin token");
}
