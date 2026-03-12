import { ScouterInfo } from "@/types/admin"; import { AppContext, ReqHeader } from "@/types/api";
import { veryfyAdminToken } from "@/utils/admin";
import { generateSchema, hashString } from "@/utils/api";
import { checkScouter, prepInsert } from "@/utils/db";
import { OpenAPIRoute, UnprocessableEntityException } from "chanfana";

export class AddScouter extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: ReqHeader,
    reqBody: ScouterInfo
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    veryfyAdminToken(data.headers.token)

    const scouter = data.body;
    if (await checkScouter(scouter.studentNumber)) throw new UnprocessableEntityException("Scouter already exists");

    await prepInsert("Scouters", {
      StudentNumber: scouter.studentNumber,
      NameHash: await hashString(scouter.name)
    }).run()

    return con.text("")
  }
}
