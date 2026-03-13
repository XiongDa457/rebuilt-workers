import { AppContext, MatchID, ReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { checkItem, prepDelete } from "@/utils/db";
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

    if (!await checkItem("ScouterToMatch", {
      StudentNumber: studentNumber,
      MatchID: data.body.matchID,
    })) throw new UnprocessableEntityException("You do not have thise match in your schedule");

    await prepDelete("ScouterToMatch", {
      StudentNumber: studentNumber,
      MatchID: data.body.matchID,
    }).run();

    return con.text("OK");
  }
}
