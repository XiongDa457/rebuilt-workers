import { AppContext, PitsData, TimedReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { checkItem, prepUpdate } from "@/utils/db";
import { InputValidationException, OpenAPIRoute } from "chanfana";

export class AddPitsData extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: TimedReqHeader,
    reqBody: PitsData,
    extraResponses: {
      "401": {
        description: "Invalid team number"
      }
    }
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const studentNumber = await verifySession(data.headers.token);

    const pits = data.body;
    if (!await checkItem("Teams", {
      TeamNumber: pits.team,
      ScoutedBy: studentNumber
    })) throw new InputValidationException("You shouldn't scout this team");

    await prepUpdate("Teams", {
      TeamNumber: pits.team,
      PitsData: JSON.stringify(pits),
      PitsDataTime: data.headers.timeStamp,
    }).run()
    return con.text("");
  }
}
