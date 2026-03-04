import { AppContext, ListOfTeams, ReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { getNoPitsScouter } from "@/utils/db";
import { OpenAPIRoute } from "chanfana";

export class GetNoPitsScouter extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: ReqHeader,
    resBody: ListOfTeams
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    await verifySession(data.headers.token);
    return con.json(await getNoPitsScouter());
  }
}
