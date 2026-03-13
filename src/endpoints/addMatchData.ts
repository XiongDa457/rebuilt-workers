import { AppContext, MatchData, TimedReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { getUnassigned, isNull, prepUpdate } from "@/utils/db";
import { OpenAPIRoute, UnprocessableEntityException } from "chanfana";

export class AddMatchData extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: TimedReqHeader,
    reqBody: MatchData
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const studentNumber = await verifySession(data.headers.token);

    const match = data.body;
    const verify = await getUnassigned(studentNumber, match.matchID);
    if (isNull(verify)) throw new UnprocessableEntityException("You are not set to scout this match");
    if (verify.TeamNumber !== match.team) throw new UnprocessableEntityException("Wrong team");
    if (verify.MatchData) throw new UnprocessableEntityException("The data for this match is already filled");

    await prepUpdate("TeamToMatch", {
      MatchID: match.matchID,
      Alliance: match.alliance,
      TeamIndex: verify.TeamIndex,
      MatchData: JSON.stringify(match),
      ServerScoutedTime: Date.now(),
      UserScoutedTime: data.headers.timeStamp,
    }).run();

    return con.text("OK");
  }
}
