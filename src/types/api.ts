import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

const ClimbLevel = z.enum(["L1", "L2", "L3", "failed", "no-attemp"]);

const Rating = z.number().int().min(1).max(5).optional();
export const PositiveInt = z.number().int().nonnegative();

const MatchID = z.string().regex(/(Practice|Qualifier) [0-9]*( Replay)?/);
const Alliance = z.enum(["red", "blue"]);
export type Alliance = z.infer<typeof Alliance>;

const ClimbEvent = z.object({
  action: z.literal("climb"),
  time: PositiveInt,
  climbLevel: ClimbLevel,
  climbFailReason: z.string().optional(),
});

const MoveEvent = z.object({
  action: z.literal("move"),
  time: PositiveInt,
  posX: z.number(),
  posY: z.number(),
});

const PreciseRoute = z.array(z.union([
  z.object({
    action: z.enum(["shoot", "shoot-stop", "intake", "intake-stop"]),
    time: PositiveInt,
  }), ClimbEvent, MoveEvent
]));

const ImpreciseRoute = z.object({
  routing: z.string(),
  climbLevel: ClimbLevel,
  climbFailReason: z.string().optional(),
  depotIntake: z.boolean(),
  neutralIntake: z.boolean(),
});

const AutonData = z.object({
  usePrecise: z.literal(true),
  startX: z.number(),
  startY: z.number(),
  preciseRoute: PreciseRoute,
}).or(z.object({
  usePrecise: z.literal(false),
  impreciseRoute: ImpreciseRoute,
}));

const TeleopData = z.object({
  movementSpeed: Rating,
  driverSkill: Rating,
  scoringSpeed: Rating,
  scoringAccuracy: Rating,
  defense: Rating,
  feeding: Rating,
});

const EndgameData = z.object({
  scoring: Rating,
  climbLevel: ClimbLevel,
  climbFailReason: z.string().optional(),
});

const MatchComments = z.array(z.object({
  category: z.enum(["scoring", "defense", "feeding", "climb", "malfunction", "penalties", "driver", "strategy", "other"]),
  comment: z.string()
}));

export const MatchData = z.object({
  matchID: MatchID,
  alliance: Alliance,
  team: PositiveInt,
  auton: AutonData,
  teleop: TeleopData,
  endgame: EndgameData,
  penaltyPoints: z.number().int().nonnegative(),
  penaltyCard: z.enum(["yellow", "red"]).optional(),
  comments: MatchComments,
});

export const PitsData = z.object({
  team: PositiveInt,
  autoDesc: z.string(),
  trench: z.boolean(),
  hopperCapacity: PositiveInt,
  shooterType: z.string(),
  weight: z.number().nonnegative().optional(),
  comments: z.string(),
});

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
  }),
  matchID: MatchID,
  teamNumber: PositiveInt,
  alliance: Alliance,
}));
export type ScoutingSchedule = z.infer<typeof ScoutingSchedule>;

export const ListOfTeams = z.array(PositiveInt);
export type ListOfTeams = z.infer<typeof ListOfTeams>;

export const ReqHeader = z.object({
  token: z.string(),
})

export const TimedReqHeader = z.object({
  token: z.string(),
  timeStamp: PositiveInt,
})

export const ResHeader = z.object({
  nowQueuing: MatchID,
  lastUpdate: PositiveInt,
})

