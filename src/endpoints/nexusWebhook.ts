import { EventStatus } from "@/nexus";
import { Alliance } from "@/types/api";
import { generateSchema } from "@/utils/api";
import { checkItem, isNull, prepInsert, prepUpdate } from "@/utils/db";
import { OpenAPIRoute } from "chanfana";
import { env } from "cloudflare:workers";
import { Context } from "hono";
import z from "zod";

export class NexusWebhook extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: z.object({
      "Nexus-Token": z.string()
    }),
    reqBody: z.object({}),
  });

  async handle(con: Context) {
    const nexusToken = con.req.header("Nexus-Token");
    if (nexusToken !== env.NEXUS_TOKEN) return con.text("Incorrect Nexus-Token.");

    const eventStatus: EventStatus = await con.req.json();
    env.KV.put("LastUpdate", eventStatus.dataAsOfTime.toString());
    if (eventStatus.nowQueuing) env.KV.put("NowQueuing", eventStatus.nowQueuing);

    const upd: D1PreparedStatement[] = []

    const announcements = eventStatus.announcements;
    if (announcements) {
      for (const a of announcements) {
        if (await checkItem("Announcements", { ID: a.id })) continue;
        upd.push(prepInsert("Announcements", {
          ID: a.id,
          Time: a.postedTime,
          Message: a.announcement,
        }))
      }
    }
    const partsReqs = eventStatus.partsRequests;
    if (partsReqs) {
      for (const req of partsReqs) {
        if (await checkItem("PartsRequests", { ID: req.id })) continue;
        upd.push(prepInsert("PartsRequests", {
          ID: req.id,
          Time: req.postedTime,
          Team: parseInt(req.requestedByTeam),
          Parts: req.parts,
        }))
      }
    }
    const matches = eventStatus.matches;
    if (matches) {
      const teams = new Set<number>();
      for (const match of matches) {
        for (const team of match.redTeams) teams.add(parseInt(team));
        for (const team of match.blueTeams) teams.add(parseInt(team));
      }
      for (const team of teams) {
        if (!team) continue;
        if (await checkItem("Teams", { TeamNumber: team })) continue;
        upd.push(prepInsert("Teams", {
          TeamNumber: team,
        }));
      }
      for (const match of matches) {
        if (await checkItem("Matches", { MatchID: match.label })) {
          upd.push(prepUpdate("Matches", {
            MatchID: match.label,
            Times: JSON.stringify(match.times),
          }))
          function updateAlliance(alliance: Alliance, teams: any[]) {
            for (const [i, team] of teams.entries()) {
              upd.push(prepUpdate("TeamToMatch", {
                TeamNumber: isNull(team) ? null : parseInt(team),
                MatchID: match.label,
                Alliance: alliance,
                TeamIndex: i,
              }));
            }
          }
          updateAlliance("red", match.redTeams);
          updateAlliance("blue", match.blueTeams);
        } else {
          upd.push(prepInsert("Matches", {
            MatchID: match.label,
            Times: JSON.stringify(match.times)
          }));
          function insertAlliance(alliance: Alliance, teams: any[]) {
            for (const [i, team] of teams.entries()) {
              upd.push(prepInsert("TeamToMatch", {
                TeamNumber: isNull(team) ? null : parseInt(team),
                MatchID: match.label,
                Alliance: alliance,
                TeamIndex: i,
              }));
            }
          }
          insertAlliance("red", match.redTeams);
          insertAlliance("blue", match.blueTeams);
        }
      }
    }

    if (upd.length > 0) await env.DB.batch(upd);
    return con.text("OK");
  }
}
