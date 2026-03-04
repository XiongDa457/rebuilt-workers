import { AppContext, LoginData, ReqHeader } from "@/types/api";
import { generateSchema, generateToken, hashString } from "@/utils/api";
import { getItem, prepInsert } from "@/utils/db";
import { OpenAPIRoute } from "chanfana";

const threeDays = 1000 * 60 * 60 * 24 * 3;
export class GetToken extends OpenAPIRoute {
  schema = generateSchema({
    reqBody: LoginData,
    resBody: ReqHeader
  });

  async handle(con: AppContext) {
    const data = (await this.getValidatedData<typeof this.schema>()).body;
    const scouter = await getItem("Scouters", {
      StudentNumber: data.studentNumber,
      NameHash: await hashString(data.name)
    });
    if (!scouter) return con.text("", 400);

    const token = generateToken();
    prepInsert("ScouterSessions", {
      StudentNumber: data.studentNumber,
      TokenHash: await hashString(token),
      ExpiresAt: Date.now() + threeDays,
    })

    return con.json({ token: token });
  }
}
