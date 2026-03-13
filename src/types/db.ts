import { Alliance } from "./api";

export type DBAnnoucenment = {
  ID: string,
  Time?: number | null,
  Message?: string | null,
};

export type DBPartsRequest = {
  ID: string,
  Time?: number | null,
  Team?: number | null,
  Parts?: string | null,
};

export type DBTeam = {
  TeamNumber: number,
  Scouter?: number | null,
  PitsData?: string | null,
  PitsDataTime?: number | null,
};

export type DBScouter = {
  StudentNumber: number,
  NameHash: ArrayBuffer,
};

export type DBScouterSession = {
  StudentNumber?: number,
  TokenHash: ArrayBuffer,
  ExpiresAt?: number,
};

export type DBMatch = {
  MatchID: string,
  Times?: string | null
};

export type DBTeamToMatch = {
  TeamNumber?: number | null,
  Scouter?: number | null,
  MatchID: string | null,
  Alliance: Alliance,
  TeamIndex: number,
  MatchData?: string | null,
  UserScoutedTime?: number | null,
  ServerScoutedTime?: number | null,
};

