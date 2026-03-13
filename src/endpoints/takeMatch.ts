import { AppContext, MatchID, PositiveInt, ReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { checkScouterToMatch, getUnassigned, prepUpdate } from "@/utils/db";
import { OpenAPIRoute, UnprocessableEntityException } from "chanfana";
import z from "zod";

export class TakeMatch extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: ReqHeader,
    reqBody: z.object({
      matchID: MatchID,
      teamNumber: PositiveInt
    })
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const studentNumber = await verifySession(data.headers.token);

    const body = data.body;

    if (await checkScouterToMatch(studentNumber, body.matchID))
      throw new UnprocessableEntityException("You already have a team to scout in this match");

    const verify = await getUnassigned(body.matchID, body.teamNumber);
    if (!verify) throw new UnprocessableEntityException("This match & team are already assigned");

    await prepUpdate("TeamToMatch", {
      Scouter: studentNumber,
      MatchID: body.matchID,
      Alliance: verify.Alliance,
      TeamIndex: verify.TeamIndex,
    }).run();

    return con.text("OK");
  }
}

