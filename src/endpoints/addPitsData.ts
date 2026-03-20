import { AppContext, PitsData, TimedReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { getItem, prepUpdate } from "@/utils/db";
import { OpenAPIRoute, UnprocessableEntityException } from "chanfana";

export class AddPitsData extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: TimedReqHeader,
    reqBody: PitsData,
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const studentNumber = await verifySession(data.headers.token);

    const pits = data.body;
    const verify = await getItem("Teams", { TeamNumber: pits.team });
    if (!verify) throw new UnprocessableEntityException("This team is not at the competition");
    if (verify.Scouter && studentNumber != verify.Scouter) throw new UnprocessableEntityException("Someone else scouted this team already");

    await prepUpdate("Teams", {
      Scouter: studentNumber,
      TeamNumber: pits.team,
      PitsData: JSON.stringify(pits),
      PitsDataTime: data.headers.timeStamp,
    }).run()
    return con.text("");
  }
}
