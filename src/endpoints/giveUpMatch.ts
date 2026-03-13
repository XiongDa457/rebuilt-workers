import { AppContext, MatchID, ReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { checkScouterToMatch, removeScouterToMatch } from "@/utils/db";
import { OpenAPIRoute, UnprocessableEntityException } from "chanfana";
import z from "zod";

export class GiveUpMatch extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: ReqHeader,
    reqBody: z.object({
      matchID: MatchID
    })
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const studentNumber = await verifySession(data.headers.token);

    const matchID = data.body.matchID;
    if (!await checkScouterToMatch(studentNumber, matchID))
      throw new UnprocessableEntityException("You do not have this match in your schedule");

    await removeScouterToMatch(studentNumber, matchID);

    return con.text("OK");
  }
}
