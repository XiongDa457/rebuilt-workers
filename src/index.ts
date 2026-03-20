import { fromHono } from "chanfana";
import { Hono } from "hono";
import { NexusWebhook } from "./endpoints/nexusWebhook";
import { GetToken } from "./endpoints/getToken";
import { GetSchedule } from "./endpoints/getSchedule";
import { GetNotScheduled } from "./endpoints/getNotScheduled";
import { AddPitsData } from "./endpoints/addPitsData";
import { GetListOfTeams } from "./endpoints/getListOfTeams";
import { AddMatchData } from "./endpoints/addMatchData";
import { TakeMatch } from "./endpoints/takeMatch";
import { GiveUpMatch } from "./endpoints/giveUpMatch";
import { AddScouter } from "./endpoints/admin/addScouter";
import { ChangeScouterName } from "./endpoints/admin/changeScouterName";
import { GetMatchData } from "./endpoints/admin/getMatchData";
import { GetPitsData } from "./endpoints/admin/getPitsData";

const app = new Hono<{ Bindings: Env }>();
fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "Team 4308 rebuilt scouting app API",
      version: "1.0.0"
    },
    servers: [
      {
        url: "https://rebuilt-workers.the-woodlands-robotics.workers.dev",
        description: "cloudflare workers url",
      }
    ]
  }
})
  .post("/get-token", GetToken)
  .post("/nexus-webhook", NexusWebhook)

  .post("/get-schedule", GetSchedule)
  .post("/get-not-schedule", GetNotScheduled)
  .post("/get-list-of-teams", GetListOfTeams)

  .post("/add-match-data", AddMatchData)
  .post("/add-pits-data", AddPitsData)

  .post("/take-match", TakeMatch)
  .post("/give-up-match", GiveUpMatch)

  .post("/admin/add-scouter", AddScouter)
  .post("/admin/change-scouter-name", ChangeScouterName)
  .post("/admin/get-match-data", GetMatchData)
  .post("/admin/get-pits-data", GetPitsData);

// Export the Hono app
export default app;
