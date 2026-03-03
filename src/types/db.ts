import z from "zod";
import { Alliance, MatchID, OPositiveInt, PositiveInt } from "./common";

export const DBAnnoucenment = z.object({
  ID: z.string(),
  Time: OPositiveInt,
  Message: z.ostring(),
});

export const DBPartsRequest = z.object({
  ID: z.string(),
  Time: OPositiveInt,
  Team: OPositiveInt,
  Parts: z.ostring(),
});

export const DBTeam = z.object({
  TeamNumber: PositiveInt,
  PitsByScouter: OPositiveInt,
  PitsData: z.ostring(),
  PitsDataTime: OPositiveInt,
});

export const DBScouter = z.object({
  StudentNumber: PositiveInt,
  NameHash: z.instanceof(ArrayBuffer),
});

export const DBScouterSession = z.object({
  StudentNumber: PositiveInt,
  TokenHash: z.instanceof(ArrayBuffer),
  ExpiresAt: PositiveInt,
});

export const DBMatch = z.object({
  MatchID: MatchID,
  Times: z.ostring()
});

const TeamIndex = PositiveInt.min(0).max(2);

export const DBTeamToMatch = z.object({
  TeamNumber: PositiveInt,
  MatchID: MatchID,
  Alliance: Alliance,
  TeamIndex: TeamIndex,
  MatchData: z.ostring(),
  ScoutedTime: OPositiveInt,
});

export const DBScouterToMatch = z.object({
  StudentNumber: PositiveInt,
  MatchID: MatchID,
  Alliance: Alliance,
  TeamIndex: TeamIndex,
});

