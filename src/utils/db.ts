import { ListOfTeams, ScoutingSchedule } from "@/types/api";
import { DBAnnoucenment, DBMatch, DBPartsRequest, DBScouter, DBTeam, DBScouterToMatch, DBTeamToMatch, DBScouterSession } from "@/types/db";
import { env } from "cloudflare:workers";

export function isNull(item: any) {
  return item === undefined || item === null;
}

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

type TableItem = {
  Announcements: DBAnnoucenment,
  PartsRequests: DBPartsRequest,
  Teams: DBTeam,
  Matches: DBMatch,
  Scouters: DBScouter,
  ScouterSessions: DBScouterSession,
  TeamToMatch: DBTeamToMatch,
  ScouterToMatch: DBScouterToMatch,
}

function prepareSQL(sqlQuery: string) {
  return env.DB.prepare(sqlQuery);
}

async function execSQL(stmt: string | D1PreparedStatement, values: any[]) {
  if (typeof stmt === "string") return prepareSQL(stmt).bind(...values).run();
  else return stmt.bind(...values).run();
}

function where<T extends DBTables>(table: T, item: TableItem[T]): [string, any[]] {
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

export async function checkItem<T extends DBTables>(table: T, item: TableItem[T]): Promise<boolean> {
  const [stmt, vals] = where(table, item);
  const res = await execSQL(`SELECT 1 FROM ${table} ${stmt} LIMIT 1`, vals);
  return res.results.length > 0;
}
export async function checkScouter(studentNumber: number) {
  return (await execSQL("SELECT 1 FROM Scouters WHERE StudentNumber = ?", [studentNumber])).results.length > 0;
}

export async function getItem<T extends DBTables>(table: T, item: TableItem[T]): Promise<TableItem[T]> {
  const [stmt, vals] = where(table, item);
  const res = await execSQL(`SELECT * FROM ${table} ${stmt} LIMIT 1`, vals);
  if (res.results.length === 0)
    return undefined;
  return res.results[0] as any;
}

export async function getAll<T extends DBTables>(table: T, item: TableItem[T]): Promise<TableItem[T][]> {
  const [stmt, vals] = where(table, item);
  const res = await execSQL(`SELECT * FROM ${table} ${stmt}`, vals);
  return res.results.map((r: any) => r);
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

export async function getNoPitsScouter(): Promise<ListOfTeams> {
  return (await execSQL("SELECT TeamNumber FROM Teams WHERE ScoutedBy IS NULL", [])).results.map((r: any) => r.TeamNumber);
}

export function prepInsert<T extends DBTables>(table: T, item: TableItem[T]) {
  const keys: string[] = [];
  const vals: any[] = [];
  for (const [key, val] of Object.entries(item)) {
    if (isNull(val)) continue
    keys.push(key);
    vals.push(val);
  }
  return prepareSQL(`INSERT INTO ${table} (${keys.join(", ")}) VALUES (${Array(vals.length).fill('?').join(", ")});`).bind(...vals);
}

export function prepUpdate<T extends DBTables>(table: T, item: TableItem[T]) {
  const possibleQueryKeys = tableQueryKeys[table];
  const upd: string[] = [];
  const updVals: any[] = [];
  for (const [key, val] of Object.entries(item)) {
    if (!(possibleQueryKeys.includes(key))) {
      if (!isNull(val)) {
        upd.push(`${key} = ?`);
        updVals.push(val);
      } else upd.push(`${key} = NULL`);
    }
  }
  const [stmt, vals] = where(table, item);
  return prepareSQL(`UPDATE ${table} SET ${upd.join(", ")} ${stmt};`).bind(...updVals, ...vals);
}

export function prepDelete<T extends DBTables>(table: T, item: TableItem[T]) {
  const [stmt, vals] = where(table, item);
  return prepareSQL(`DELETE FROM ${table} ${stmt};`).bind(vals);
}

