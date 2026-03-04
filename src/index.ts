import { fromHono } from "chanfana";
import { Hono } from "hono";
import { NexusWebhook } from "./endpoints/nexusWebhook";
import { GetToken } from "./endpoints/getToken";
import { GetSchedule } from "./endpoints/getSchedule";
import { GetNotSchedule } from "./endpoints/getNotScheduled";
import { AddPitsData } from "./endpoints/addPitsData";
import { GetNoPitsScouter } from "./endpoints/getNoPitsScouter";
import { AddMatchData } from "./endpoints/addMatchData";
import { AddScouter } from "./endpoints/admin/addScouter";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

openapi.post("/nexus-webhook", NexusWebhook);
openapi.post("/get-token", GetToken);

openapi.post("/get-schedule", GetSchedule);
openapi.post("/get-not-schedule", GetNotSchedule);
openapi.post("/get-no-pits-scouter", GetNoPitsScouter);

openapi.post("/add-match-data", AddMatchData);
openapi.post("/add-pits-data", AddPitsData);

openapi.post("/admin/add-scouter", AddScouter);

// Export the Hono app
export default app;
