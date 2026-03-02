import z from "zod";

export const PositiveInt = z.number().int().nonnegative();

export const MatchID = z.string().regex(/(Practice|Qualifier) [0-9]*( Replay)?/);
export const Alliance = z.enum(["red", "blue"]);
