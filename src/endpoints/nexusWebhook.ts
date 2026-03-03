import { EventStatus } from "@/nexus";
import { Alliance } from "@/types/common";
import { getItem, prepInsert, prepUpdate } from "@/utils/db";
import { env } from "cloudflare:workers";
import { Context } from "hono";

export async function NexusWebhook(con: Context) {
  const nexusToken = con.req.header("Nexus-Token");
  if (nexusToken !== env.NEXUS_TOKEN) return con.text("Incorrect Nexus-Token.");

  const eventStatus: EventStatus = await con.req.json();
  env.KV.put("LastUpdate", eventStatus.dataAsOfTime.toString());
  env.KV.put("NowQueuing", eventStatus.nowQueuing);

  const upd: D1PreparedStatement[] = []

  const announcements = eventStatus.announcements;
  if (announcements) {
    for (const a of announcements) {
      const dbAnnouncement = await getItem("Announcements", a.id);
      if (dbAnnouncement) continue;
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
      const dbPartsRequest = await getItem("PartsRequests", req.id);
      if (dbPartsRequest) continue;
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
      const dbTeam = await getItem("Teams", team);
      if (dbTeam) continue;
      upd.push(prepInsert("Teams", {
        TeamNumber: team,
      }));
    }
    for (const match of matches) {
      const dbMatch = await getItem("Matches", match.label);
      if (dbMatch) {
        upd.push(prepUpdate("Matches", {
          MatchID: match.label,
          Times: JSON.stringify(match.times),
        }, "all"))
        function updateAlliance(alliance: Alliance, teams: any[]) {
          for (const [i, team] of teams) {
            upd.push(prepUpdate("TeamToMatch", {
              TeamNumber: parseInt(team),
              MatchID: match.label,
              Alliance: alliance,
              TeamIndex: i,
            }, ["TeamNumber"]));
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
              TeamNumber: parseInt(team),
              MatchID: match.label,
              Alliance: alliance,
              TeamIndex: i,
            }));
            upd.push(prepInsert("ScouterToMatch", {
              StudentNumber: 0,
              MatchID: match.label,
              Alliance: alliance,
              TeamIndex: i
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
