import { AppContext, ListOfTeams, ReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { getListOfTeams } from "@/utils/db";
import { OpenAPIRoute } from "chanfana";

export class GetListOfTeams extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: ReqHeader,
    resBody: ListOfTeams
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const studentNumber = await verifySession(data.headers.token);
    return con.json(await getListOfTeams(studentNumber));
  }
}
