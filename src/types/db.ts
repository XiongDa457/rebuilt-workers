import z from "zod";
import { Alliance, MatchID, PositiveInt } from "./common";
import { PitsData } from "./api";

export const DBAnnoucenment = z.object({
  ID: z.string(),
  Time: PositiveInt.optional(),
  Message: z.ostring(),
});

export const DBPartsRequest = z.object({
  ID: z.string(),
  Time: PositiveInt.optional(),
  Team: PositiveInt.optional(),
  Parts: z.ostring(),
});

export const DBTeam = z.object({
  TeamNumber: PositiveInt,
  PitsData: PitsData.optional(),
});

export const DBScouter = z.object({
  StudentNumber: PositiveInt,
  Name: z.string(),
  Token: z.ostring(),
  TimeGenerated: PositiveInt,
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
  ScoutedTime: PositiveInt.optional(),
});

export const DBScouterToMatch = z.object({
  StudentNumber: PositiveInt,
  MatchID: MatchID,
  Alliance: Alliance,
  TeamIndex: TeamIndex,
});

