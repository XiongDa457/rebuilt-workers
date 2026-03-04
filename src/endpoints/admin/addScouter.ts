import { ScouterInfo } from "@/types/admin";
import { AppContext, ReqHeader } from "@/types/api";
import { generateSchema, hashString } from "@/utils/api";
import { checkItem, prepInsert } from "@/utils/db";
import { InputValidationException, OpenAPIRoute, UnauthorizedException } from "chanfana";
import { env } from "cloudflare:workers";

export class AddScouter extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: ReqHeader,
    reqBody: ScouterInfo,
    extraResponses: {
      "401": {
        description: "Scouter already exists"
      }
    }
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    if (data.headers.token !== env.ADMIN_TOKEN) throw new UnauthorizedException("Wrong admin token");

    const scouter = data.body;
    if (await checkItem("Scouters", {
      StudentNumber: scouter.studentNumber
    })) throw new InputValidationException("Student already exists");

    await prepInsert("Scouters", {
      StudentNumber: scouter.studentNumber,
      NameHash: await hashString(scouter.name)
    }).run()

    return con.text("")
  }
}
