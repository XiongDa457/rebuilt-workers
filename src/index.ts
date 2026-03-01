import { fromHono } from "chanfana";
import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { EventStatus } from "./nexus";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

app.get("/nexus-webhook", async (context) => {
  const nexusToken = context.req.header("Nexus-Token");
  if (nexusToken !== env.NEXUS_TOKEN) return context.text("Incorrect Nexus-Token.");

  const eventStatus: EventStatus = await context.req.json();

  return context.text("OK");
})

// Export the Hono app
export default app;
