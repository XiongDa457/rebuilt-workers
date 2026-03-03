import { DBAnnoucenment, DBMatch, DBPartsRequest, DBScouter, DBTeam, DBScouterToMatch, DBTeamToMatch, DBScouterSession } from "@/types/db";
import { env } from "cloudflare:workers";
import z from "zod";

export type DBTables = "Announcements" | "PartsRequests" | "Teams" | "Scouters" | "ScouterSessions" | "Matches" | "TeamToMatch" | "ScouterToMatch";

const tableQueryKeys = {
  Announcements: ["ID"],
  PartsRequests: ["ID"],
  Teams: ["TeamNumber"],
  Matches: ["MatchID"],
  Scouters: ["StudentNumber", "NameHash"],
  ScouterSessions: ["TokenHash"],
  TeamToMatch: ["MatchID", "Alliance", "TeamIndex"],
  ScouterToMatch: ["StudentNumber", "MatchID"],
}

const tableRetType = {
  Announcements: DBAnnoucenment,
  PartsRequests: DBPartsRequest,
  Teams: DBTeam,
  Matches: DBMatch,
  Scouters: DBScouter,
  ScouterSessions: DBScouterSession,
  TeamToMatch: DBTeamToMatch,
  ScouterToMatch: DBScouterToMatch,
}

type TableItem<T extends DBTables> = z.infer<typeof tableRetType[T]>;

function stringify(val: any) {
  if (val instanceof ArrayBuffer) return val;
  return JSON.stringify(val);
}

function prepareSQL(sqlQuery: string, values: any[]): D1PreparedStatement {
  return env.DB.prepare(sqlQuery).bind(...values.map(stringify));
}

function bindSQL(stmt: D1PreparedStatement, values: any[]): D1PreparedStatement {
  return stmt.bind(...values.map(stringify));
}

async function execSQL(stmt: string | D1PreparedStatement, values: any[]) {
  if (typeof stmt === "string") return prepareSQL(stmt, values).run();
  else return bindSQL(stmt, values).run();
}

function where<T extends DBTables>(table: T, item: TableItem<T>): [string, any[]] {
  const possibleQueryKeys = tableQueryKeys[table];
  const queryKeys: string[] = [];
  const queryVals: any[] = [];
  for (const [key, val] of Object.entries(item)) {
    if (key in possibleQueryKeys) {
      queryKeys.push(key);
      queryVals.push(val);
    }
  }
  return [`WHERE ${queryKeys.map((key) => { return `${key} = ?` }).join(" AND ")}`, queryVals];
}

export async function getItem<T extends DBTables>(table: T, item: TableItem<T>): Promise<TableItem<T>> {
  const [stmt, vals] = where(table, item);
  const res = await execSQL(`SELECT 1 FROM ${table} ${stmt}`, vals);
  if (res.results.length === 0)
    return undefined;
  return tableRetType[table].parse(res.results[0]);
}

const getAllNotScoutedStmt = `
SELECT * FROM TeamToMatch ttm
LEFT JOIN ScouterToMatch stm
  ON ttm.MatchID = stm.MatchID
  AND ttm.Alliance = stm.Alliance
  AND ttm.TeamIndex = stm.TeamIndex
WHERE stm.MatchID IS NULL;
`
export async function getAllNotScouted() {
  const res = await execSQL(getAllNotScoutedStmt, []);
  return res.results.map(r => DBTeamToMatch.parse(r));
}

export function prepInsert<T extends DBTables>(table: T, item: TableItem<T>) {
  const vals = Object.values(item);
  return prepareSQL(`INSERT INTO ${table} (${Object.keys(item).join(", ")}) VALUES (${Array(vals.length).fill('?').join(", ")})`, vals);
}

export function prepUpdate<T extends DBTables>(table: T, item: TableItem<T>, keys: string[] | "all", include: boolean = true) {
  const possibleQueryKeys = tableQueryKeys[table];
  const upd: string[] = [];
  for (const [key, val] of Object.entries(item)) {
    const keyInKeys = keys === "all" || key in keys;
    if (!(key in possibleQueryKeys) && include === keyInKeys) {
      upd.push(`${key} = ${JSON.stringify(val)}`);
    }
  }
  const [stmt, vals] = where(table, item);
  return prepareSQL(`UPDATE ${table} SET ${upd.join(", ")} ${stmt}`, vals);
}

type DBScouter = z.infer<typeof DBScouter>;
export function updateScouterName(scouter: DBScouter) {
  return prepareSQL(`UPDATE Scouters SET NameHash = ? WHERE StudentNumber = ?`, [scouter.NameHash, scouter.StudentNumber]);
}

