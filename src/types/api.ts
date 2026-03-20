import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

const ClimbLevel = z.enum(["L1", "L2", "L3", "failed"]).openapi("ClimbLevel");

const Rating = z.number().int().min(1).max(5);
export const PositiveInt = z.number().int().nonnegative();

export const MatchID = z.string().regex(/(Practice|Qualification|Playoff) [0-9]*( Replay)?/);
const Alliance = z.enum(["red", "blue"]);
export type Alliance = z.infer<typeof Alliance>;

const ClimbEvent = z.object({
  action: z.literal("climb"),
  time: PositiveInt,
});

const MoveEvent = z.object({
  action: z.literal("move"),
  time: PositiveInt,
  posX: z.number(),
  posY: z.number(),
});

const AutonRoute = z.array(z.xor([
  z.object({
    action: z.enum(["shoot", "shoot-stop", "intake", "intake-stop"]),
    time: PositiveInt,
  }), ClimbEvent, MoveEvent
]).openapi("AutonEvent")).openapi("AutonRoute");

const AutonData = z.object({
  precisionLevel: Rating,

  startX: z.number(),
  startY: z.number(),
  route: AutonRoute,

  climbAttempted: z.boolean(),
  climbSuccess: z.boolean().optional(),
  climbFailReason: z.string().optional(),
}).openapi("AutonData");

const TeleopData = z.object({
  roles: z.object({
    cycling: z.boolean(),
    scoring: z.boolean(),
    feeding: z.boolean(),
    defense: z.boolean(),
    immobile: z.boolean(),
    other: z.boolean(),
  }).openapi("BotRoles"),
  rolesOther: z.string().optional(),

  movementSpeed: Rating,
  driverSkill: Rating,

  cycling: Rating.optional(),

  scoringSpeed: Rating.optional(),
  scoringAccuracy: Rating.optional(),

  feeding: Rating.optional(),

  defense: Rating.optional(),

  shootsWhileMoving: z.boolean(),

  climbAttempted: z.boolean(),
  climbLevel: ClimbLevel.optional(),
  climbFailReason: z.string().optional(),
}).openapi("TeleopData");

export const MatchData = z.object({
  matchID: MatchID,
  alliance: Alliance,
  team: PositiveInt,

  auton: AutonData,
  teleop: TeleopData,

  canTrench: z.boolean(),

  penaltyPoints: PositiveInt,
  penaltyCard: z.enum(["none", "yellow", "red"]),

  beached: z.boolean(),
  beachedReason: z.enum(["on-fuel", "on-bump"]).optional(),
  botBroke: z.boolean(),
  brokenReason: z.string().optional(),

  comments: z.string(),
}).openapi("MatchData");
export type MatchData = z.infer<typeof MatchData>;

export const MatchMetaData = z.object({
  scouter: PositiveInt,
  userScoutedTime: PositiveInt,
  serverScoutedTime: PositiveInt
}).openapi("MatchMetaData");

export const PitsData = z.object({
  team: PositiveInt,
  autoDesc: z.string(),
  trench: z.boolean(),
  hopperCapacity: PositiveInt,
  shooterType: z.string(),
  weight: PositiveInt.optional(),
  comments: z.string(),
}).openapi("PitsData");
export type PitsData = z.infer<typeof PitsData>;

export const PitsMetaData = z.object({
  scouter: PositiveInt,
  scoutedTime: PositiveInt
}).openapi("PitsMetaData")

export const LoginData = z.object({
  studentNumber: PositiveInt,
  name: z.string(),
}).openapi("LoginData");

export const ScoutingSchedule = z.array(z.object({
  times: z.object({
    queueTime: PositiveInt,
    onDeckTime: PositiveInt,
    onFieldTime: PositiveInt,
    startTime: PositiveInt,
  }).partial().optional(),
  matchID: MatchID,
  teamNumber: PositiveInt,
  alliance: Alliance,
  hasData: z.boolean().optional(),
}).openapi("MatchSchedule")).openapi("ScoutingSchedule");
export type ScoutingSchedule = z.infer<typeof ScoutingSchedule>;

export const ListOfTeams = z.array(PositiveInt).openapi("ListOfTeams");
export type ListOfTeams = z.infer<typeof ListOfTeams>;

export const ReqHeader = z.object({
  token: z.string(),
})

export const TimedReqHeader = z.object({
  token: z.string(),
  timeStamp: PositiveInt,
})

export const ResHeader = z.object({
  nowQueuing: MatchID.optional(),
  lastUpdate: z.string(),
})

