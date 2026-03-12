import { AppContext, MatchData, TimedReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { getItem, isNull, prepUpdate } from "@/utils/db";
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
    const verify = await getItem("ScouterToMatch", { StudentNumber: studentNumber, MatchID: match.matchID });
    if (verify === undefined) throw new UnprocessableEntityException("You are not set to scout this match");

    const verify2 = await getItem("TeamToMatch", { MatchID: match.matchID, Alliance: match.alliance, TeamIndex: verify.TeamIndex });
    if (verify2.TeamNumber !== match.team) throw new UnprocessableEntityException("Wrong team number");
    if (!isNull(verify2.MatchData)) console.warn(`${studentNumber} is re-updating '${match.matchID}'`)

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
