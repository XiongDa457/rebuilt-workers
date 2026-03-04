import { AppContext, LoginData, ReqHeader } from "@/types/api";
import { generateSchema, generateToken, hashString } from "@/utils/api";
import { checkItem, prepInsert } from "@/utils/db";
import { InputValidationException, OpenAPIRoute } from "chanfana";

const threeDays = 1000 * 60 * 60 * 24 * 3;
export class GetToken extends OpenAPIRoute {
  schema = generateSchema({
    reqBody: LoginData,
    resBody: ReqHeader
  });

  async handle(con: AppContext) {
    const data = (await this.getValidatedData()).body;

    if (!await checkItem("Scouters", {
      StudentNumber: data.studentNumber,
      NameHash: await hashString(data.name),
    })) throw new InputValidationException("Invalid login data");

    const token = generateToken();
    await prepInsert("ScouterSessions", {
      StudentNumber: data.studentNumber,
      TokenHash: await hashString(token),
      ExpiresAt: Date.now() + threeDays,
    }).run()

    return con.json({ token: token });
  }
}
