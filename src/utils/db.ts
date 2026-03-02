import { MatchID } from "@/types/common";
import { DBAnnoucenment, DBMatch, DBPartsRequest, DBTeam, TeamToMatch } from "@/types/db";
import { env } from "cloudflare:workers";
import { ZodTypeAny } from "zod";

function prepareSQL(sqlQuery: string, ...values: any[]): D1PreparedStatement {
  return env.DB.prepare(sqlQuery).bind(...values.map((val) => JSON.stringify(val)));
}

function bindSQL(stmt: D1PreparedStatement, ...values: any[]): D1PreparedStatement {
  return stmt.bind(...values.map((val) => JSON.stringify(val)));
}

async function execSQL(stmt: string | D1PreparedStatement, ...values: any[]) {
  if (typeof stmt === "string") return prepareSQL(stmt, ...values).run();
  else return bindSQL(stmt, ...values).run();
}

async function getItem(table: string, idName: string, id: any, ret: ZodTypeAny) {
  const res = await execSQL(`SELECT 1 FROM ${table} WHERE ${idName} = ?`, id);
  if (res.results.length === 0)
    return undefined;
  return ret.parse(res.results[0]);
}

function prepInsert(table: string, item: any) {
  const vals = Object.values(item);
  return prepareSQL(`INSERT INTO ${table} (${Object.keys(item).join(", ")}) VALUES (${Array(vals.length).fill('?').join(", ")})`, ...vals);
}

export async function getAnnouncement(id: string) {
  return getItem("Announcements", "ID", id, DBAnnoucenment)
}

export function prepInsertAnnouncement(announcement: DBAnnoucenment) {
  return prepInsert("Announcements", announcement);
}

export async function getPartsRequest(id: string) {
  return getItem("PartsRequest", "ID", id, DBPartsRequest);
}

export function prepInsertPartsRequest(partsRequest: DBPartsRequest) {
  return prepInsert("PartsRequest", partsRequest);
}

export async function getTeam(teamNumber: number) {
  return getItem("Teams", "TeamNumber", teamNumber, DBTeam);
}

export function prepInsertTeam(team: DBTeam) {
  return prepInsert("Teams", team);
}

export async function getMatch(matchID: string) {
  return getItem("Matches", "MatchID", matchID, MatchID);
}

export function prepInsertMatch(match: DBMatch) {
  return prepInsert("Matches", match);
}

export function prepInsertTeamToMatch(teamToMatch: TeamToMatch) {
  return prepInsert("TeamToMatch", teamToMatch)
}

