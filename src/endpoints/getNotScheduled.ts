import { AppContext, ReqHeader, ScoutingSchedule } from "@/types/api";
import { generateSchema } from "@/utils/api";
import { verifySession } from "@/utils/api";
import { getNotScheduled } from "@/utils/db";
import { OpenAPIRoute } from "chanfana";

export class GetNotSchedule extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: ReqHeader,
    resBody: ScoutingSchedule
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    await verifySession(data.headers.token);
    return con.json(await getNotScheduled());
  }
}
