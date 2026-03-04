import { AppContext, ReqHeader, ScoutingSchedule } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { getSchedule } from "@/utils/db";
import { OpenAPIRoute } from "chanfana";
import { env } from "cloudflare:workers";

export class GetSchedule extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: ReqHeader,
    resBody: ScoutingSchedule
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const studentNumber = await verifySession(data.headers.token);
    if (studentNumber === "invalid") return con.text("", 400);
    return con.json(await getSchedule(studentNumber), 200, {
      lastUpdate: await env.KV.get("LastUpdate"),
      nowQueuing: await env.KV.get("NowQueuing"),
    });
  }
}
