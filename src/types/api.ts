import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

const ClimbLevel = z.enum(["L1", "L2", "L3", "failed"]);

const Rating = z.number().int().min(1).max(5).optional();
export const PositiveInt = z.number().int().nonnegative();

export const MatchID = z.string().regex(/(Practice|Qualifier) [0-9]*( Replay)?/);
const Alliance = z.enum(["red", "blue"]);
export type Alliance = z.infer<typeof Alliance>;

const ClimbEvent = z.object({
  action: z.literal("climb"),
  time: PositiveInt,
  climbAttempted: z.boolean(),
  climbSuccess: z.boolean().optional(),
  climbFailReason: z.string().optional(),
});

const MoveEvent = z.object({
  action: z.literal("move"),
  time: PositiveInt,
  posX: z.number(),
  posY: z.number(),
});

const Route = z.array(z.xor([
  z.object({
    action: z.enum(["shoot", "shoot-stop", "intake", "intake-stop"]),
    time: PositiveInt,
  }), ClimbEvent, MoveEvent
]));

const AutonData = z.object({
  precisionLevel: Rating,

  startX: z.number(),
  startY: z.number(),
  route: Route,
});

const TeleopData = z.object({
  roles: z.array(z.enum(["cycling", "scoring", "feeding", "defense", "immobile", "other"])),
  rolesOther: z.string().optional(),

  movementSpeed: Rating,
  driverSkill: Rating,

  cycling: Rating,

  scoringSpeed: Rating,
  scoringAccuracy: Rating,

  feeding: Rating,

  defense: Rating,

  shootsWhileMoving: z.boolean(),
});

export const MatchData = z.object({
  matchID: MatchID,
  alliance: Alliance,
  team: PositiveInt,

  auton: AutonData,
  teleop: TeleopData,

  canTrench: z.boolean(),

  attemptedClimb: z.boolean(),
  climbLevel: ClimbLevel.optional(),
  climbFailReason: z.string().optional(),

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
})

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
})

export const LoginData = z.object({
  studentNumber: PositiveInt,
  name: z.string(),
});

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
})).openapi("ScoutingSchedule");
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

