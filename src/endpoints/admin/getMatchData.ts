import { AppContext, MatchData, ReqHeader } from "@/types/api";
import { generateSchema } from "@/utils/api";
import { getAllMatchData } from "@/utils/db";
import { OpenAPIRoute } from "chanfana";
import { env } from "cloudflare:workers";
import z from "zod";

export class GetMatchData extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: ReqHeader,
    reqBody: z.array(MatchData)
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    if (data.headers.token !== env.ADMIN_TOKEN) return con.text("", 400);
    return con.json(await getAllMatchData())
  }
}
