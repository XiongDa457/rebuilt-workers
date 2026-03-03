import { DBAnnoucenment, DBMatch, DBPartsRequest, DBScouter, DBTeam, DBScouterToMatch, DBTeamToMatch } from "@/types/db";
import { env } from "cloudflare:workers";
import z from "zod";

export type DBTables = "Announcements" | "PartsRequests" | "Teams" | "Scouters" | "Matches" | "TeamToMatch" | "ScouterToMatch";

const tablePrimaryKeys = {
  Announcements: ["ID"],
  PartsRequests: ["ID"],
  Teams: ["TeamNumber"],
  Matches: ["MatchID"],
  Scouters: ["StudentNumber"],
  TeamToMatch: ["MatchID", "Alliance", "TeamIndex"],
  ScouterToMatch: ["StudentNumber", "MatchID"],
}

const tableRetType = {
  Announcements: DBAnnoucenment,
  PartsRequests: DBPartsRequest,
  Teams: DBTeam,
  Matches: DBMatch,
  Scouters: DBScouter,
  TeamToMatch: DBTeamToMatch,
  ScouterToMatch: DBScouterToMatch,
}

type TableItem<T extends DBTables> = z.infer<typeof tableRetType[T]>;

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

function primaryKeysEqual(table: DBTables) {
  return tablePrimaryKeys[table].map((key) => `${key} = ?`).join(" AND ");
}

export async function getItem(table: DBTables, ...keys: any[]) {
  const res = await execSQL(`SELECT 1 FROM ${table} WHERE ${primaryKeysEqual(table)}`, ...keys);
  if (res.results.length === 0)
    return undefined;
  return tableRetType[table].parse(res.results[0]);
}

export function prepInsert<T extends DBTables>(table: T, item: TableItem<T>) {
  const vals = Object.values(item);
  return prepareSQL(`INSERT INTO ${table} (${Object.keys(item).join(", ")}) VALUES (${Array(vals.length).fill('?').join(", ")})`, ...vals);
}

export function prepUpdate<T extends DBTables>(table: T, item: TableItem<T>, keys: string[] | "all", include: boolean = true) {
  const primaryKey = tablePrimaryKeys[table];
  const upd: string[] = [];
  const queryKeys: any[] = [];
  for (const [key, val] of Object.entries(item)) {
    const keyInKeys = keys === "all" || key in keys;
    if (key in primaryKey) queryKeys.push(val);
    else if (include === keyInKeys) {
      upd.push(`${key} = ${JSON.stringify(val)}`);
    }
  }
  return prepareSQL(`UPDATE ${table} SET ${upd.join(", ")} WHERE ${primaryKeysEqual(table)}`, ...queryKeys);
}

