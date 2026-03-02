import { fromHono } from "chanfana";
import { Hono } from "hono";
import { NexusWebhook } from "./endpoints/nexusWebhook";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

app.post("/nexus-webhook", NexusWebhook);

// Export the Hono app
export default app;
