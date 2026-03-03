import { fromHono } from "chanfana";
import { Hono } from "hono";
import { NexusWebhook } from "./endpoints/nexusWebhook";
import { GetToken } from "./endpoints/getToken";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

openapi.post("/get-token", GetToken);
openapi.post("/nexus-webhook", NexusWebhook);

// Export the Hono app
export default app;
