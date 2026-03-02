import z from "zod";
import { Alliance, MatchID, PositiveInt } from "./common";
import { PitsData } from "./api";

export const DBAnnoucenment = z.object({
  ID: z.string(),
  Time: PositiveInt.optional(),
  Message: z.ostring(),
});
export type DBAnnoucenment = z.infer<typeof DBAnnoucenment>;

export const DBPartsRequest = z.object({
  ID: z.string(),
  Time: PositiveInt.optional(),
  Team: PositiveInt.optional(),
  Parts: z.ostring(),
});
export type DBPartsRequest = z.infer<typeof DBPartsRequest>

export const DBTeam = z.object({
  TeamNumber: PositiveInt,
  PitsData: PitsData.optional(),
});
export type DBTeam = z.infer<typeof DBTeam>;

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
export type DBMatch = z.infer<typeof DBMatch>;

const TeamIndex = PositiveInt.min(0).max(2);

export const TeamToMatch = z.object({
  TeamNumber: PositiveInt,
  MatchID: MatchID,
  Alliance: Alliance,
  TeamIndex: TeamIndex,
  MatchData: z.ostring(),
});
export type TeamToMatch = z.infer<typeof TeamToMatch>;

export const ScouterToMatch = z.object({
  StudentNumber: PositiveInt,
  MatchID: MatchID,
  Alliance: Alliance,
  TeamIndex: TeamIndex,
});

