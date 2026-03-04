import { AppContext, MatchData, TimedReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { getItem, prepUpdate } from "@/utils/db";
import { InputValidationException, OpenAPIRoute } from "chanfana";

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
    if (verify === undefined) throw new InputValidationException("You do not own this match");

    await prepUpdate("TeamToMatch", {
      MatchID: match.matchID,
      Alliance: match.alliance,
      TeamIndex: verify.TeamIndex,
      MatchData: JSON.stringify(match),
      ServerScoutedTime: Date.now(),
      UserScoutedTime: data.headers.timeStamp,
    }).run();
    return con.text("");
  }
}
