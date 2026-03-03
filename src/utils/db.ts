import { ScoutingSchedule } from "@/types/api";
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
  ScouterSessions: ["StudentNumber", "TokenHash"],
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
  const possibleQueryKeys = Object.values(tableQueryKeys[table]);
  const queryKeys: string[] = [];
  const queryVals: any[] = [];
  for (const [key, val] of Object.entries(item)) {
    if (possibleQueryKeys.includes(key)) {
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

export async function getAll<T extends DBTables>(table: T, item: TableItem<T>): Promise<TableItem<T>[]> {
  const [stmt, vals] = where(table, item);
  const res = await execSQL(`SELECT * FROM ${table} ${stmt}`, vals);
  const retType = tableRetType[table];
  return res.results.map(r => retType.parse(r));
}

const getScheduleStmt = `
SELECT ttm.MatchID, ttm.Alliance, ttm.TeamNumber, m.Times
FROM TeamToMatch ttm
LEFT JOIN ScouterToMatch stm
  ON ttm.MatchID = stm.MatchID
  AND ttm.Alliance = stm.Alliance
  AND ttm.TeamIndex = stm.TeamIndex
LEFT JOIN Matches m
  ON ttm.MatchID = m.MatchID
WHERE stm.StudentNumber`

function toSchedule(res: D1Result) {
  return res.results.map((r: any) => {
    return {
      times: JSON.parse(r.Times),
      matchID: r.MatchID,
      teamNumber: r.TeamNumber,
      alliance: r.Alliance
    };
  });
}

export async function getSchedule(studentNumber: number): Promise<ScoutingSchedule> {
  const res = await execSQL(`${getScheduleStmt} = ?`, [studentNumber]);
  return toSchedule(res);
}

export async function getNotScheduled(): Promise<ScoutingSchedule> {
  const res = await execSQL(`${getScheduleStmt} IS NULL`, []);
  return toSchedule(res);
}

export function prepInsert<T extends DBTables>(table: T, item: TableItem<T>) {
  const keys: string[] = [];
  const vals: any[] = [];
  for (const [key, value] of Object.entries(item)) {
    if (value === undefined) continue;
    keys.push(key);
    vals.push(value);
  }
  console.log(`INSERT INTO ${table} (${keys.join(", ")}) VALUES (${Array(vals.length).fill('?').join(", ")});`, vals);
  return prepareSQL(`INSERT INTO ${table} (${keys.join(", ")}) VALUES (${Array(vals.length).fill('?').join(", ")});`, vals);
}

export function prepUpdate<T extends DBTables>(table: T, item: TableItem<T>, keys: string[] | "all", include: boolean = true) {
  const possibleQueryKeys = tableQueryKeys[table];
  const upd: string[] = [];
  for (const [key, val] of Object.entries(item)) {
    const keyInKeys = keys === "all" || keys.includes(key);
    if (!(possibleQueryKeys.includes(key)) && include === keyInKeys) {
      upd.push(`${key} = ${JSON.stringify(val)}`);
    }
  }
  const [stmt, vals] = where(table, item);
  return prepareSQL(`UPDATE ${table} SET ${upd.join(", ")} ${stmt};`, vals);
}

export function prepDelete<T extends DBTables>(table: T, item: TableItem<T>) {
  const [stmt, vals] = where(table, item);
  return prepareSQL(`DELETE FROM ${table} ${stmt};`, vals);
}

type DBScouter = z.infer<typeof DBScouter>;
export async function updateScouterName(scouter: DBScouter) {
  await prepDelete("ScouterSessions", { StudentNumber: scouter.StudentNumber }).run();
  await execSQL(`UPDATE Scouters SET NameHash = ? WHERE StudentNumber = ?;`, [scouter.NameHash, scouter.StudentNumber]);
}

