import { LoginData } from "@/types/api";
import { OpenAPIRoute } from "chanfana";

export class NexusWebhook extends OpenAPIRoute {
  schema = {
    request: {
      body: {
        content: {
          "application/json": {
            schema: LoginData
          }
        }
      }
    }
  }
}
