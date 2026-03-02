import { EventStatus } from "@/nexus";
import { getAnnouncement, getMatch, getPartsRequest, prepInsertAnnouncement, prepInsertMatch, prepInsertPartsRequest, prepInsertTeamToMatch } from "@/utils/db";
import { env } from "cloudflare:workers";
import { Context } from "hono";

export async function NexusWebhook(context: Context) {
  const nexusToken = context.req.header("Nexus-Token");
  if (nexusToken !== env.NEXUS_TOKEN) return context.text("Incorrect Nexus-Token.");

  const eventStatus: EventStatus = await context.req.json();

  const upd: D1PreparedStatement[] = []

  const announcements = eventStatus.announcements;
  if (announcements) {
    for (const a of announcements) {
      const dbAnnouncement = await getAnnouncement(a.id);
      if (dbAnnouncement) continue;
      upd.push(prepInsertAnnouncement({
        ID: a.id,
        Time: a.postedTime,
        Message: a.announcement,
      }))
    }
  }
  const partsReqs = eventStatus.partsRequests;
  if (partsReqs) {
    for (const req of partsReqs) {
      const dbPartsRequest = await getPartsRequest(req.id);
      if (dbPartsRequest) continue;
      upd.push(prepInsertPartsRequest({
        ID: req.id,
        Time: req.postedTime,
        Team: parseInt(req.requestedByTeam),
        Parts: req.parts,
      }))
    }
  }
  const matches = eventStatus.matches
  if (matches) {
    for (const match of matches) {
      const dbMatch = await getMatch(match.label);
      if (dbMatch) {

      } else {
        upd.push(prepInsertMatch({
          MatchID: match.label,
          Times: JSON.stringify(match.times)
        }));
        function insertAlliance(alliance: "red" | "blue", teams: any[]) {
          for (const [i, team] of teams.entries()) {
            upd.push(prepInsertTeamToMatch({
              TeamNumber: parseInt(team),
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

  env.DB.batch(upd);
  return context.text("OK");
}
