import { fromHono } from "chanfana";
import { Hono } from "hono";
import { NexusWebhook } from "./endpoints/nexusWebhook";
import { GetToken } from "./endpoints/getToken";
import { GetSchedule } from "./endpoints/getSchedule";
import { GetNotScheduled } from "./endpoints/getNotScheduled";
import { AddPitsData } from "./endpoints/addPitsData";
import { GetNoPitsData } from "./endpoints/getNoPitsData";
import { AddMatchData } from "./endpoints/addMatchData";
import { AddScouter } from "./endpoints/admin/addScouter";

const admin = new Hono<{ Bindings: Env }>();
const adminRoute = fromHono(admin)
  .post("/add-scouter", AddScouter)

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
  .post("/get-no-pits-data", GetNoPitsData)

  .post("/add-match-data", AddMatchData)
  .post("/add-pits-data", AddPitsData)

  .post("/admin", adminRoute)

// Export the Hono app
export default app;
