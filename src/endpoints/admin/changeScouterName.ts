import { ScouterInfo } from "@/types/admin";
import { AppContext, ReqHeader } from "@/types/api";
import { veryfyAdminToken } from "@/utils/admin";
import { generateSchema, hashString } from "@/utils/api";
import { checkScouter, updateScouter } from "@/utils/db";
import { InputValidationException, OpenAPIRoute } from "chanfana";

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
    veryfyAdminToken(data.headers.token)

    const scouter = data.body;
    if (!await checkScouter(scouter.studentNumber)) throw new InputValidationException("Scouter does not exists");

    await updateScouter({
      StudentNumber: scouter.studentNumber,
      NameHash: await hashString(scouter.name)
    })

    return con.text("");
  }
}
