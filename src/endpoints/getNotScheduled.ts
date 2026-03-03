import { AppContext, ReqHeader, ScoutingSchedule } from "@/types/api";
import { verifySession } from "@/utils/api";
import { getNotScheduled } from "@/utils/db";
import { contentJson, OpenAPIRoute } from "chanfana";

export class GetNotSchedule extends OpenAPIRoute {
  schema = {
    request: {
      headers: ReqHeader
    },
    responses: {
      "200": {
        description: "Request approved",
        ...contentJson(ScoutingSchedule),
      },
      "400": {
        description: "Invalid or expired token"
      }
    }
  };

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const studentNumber = await verifySession(data.headers.token);
    if (studentNumber === "invalid") return con.text("", 400);
    return con.json(await getNotScheduled());
  }
}
