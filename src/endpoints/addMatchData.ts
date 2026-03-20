import { AppContext, MatchData, TimedReqHeader } from "@/types/api";
import { generateSchema, verifySession } from "@/utils/api";
import { getAssigned, isNull, prepUpdate } from "@/utils/db";
import { OpenAPIRoute, UnprocessableEntityException } from "chanfana";

export class AddMatchData extends OpenAPIRoute {
  schema = generateSchema({
    reqHeader: TimedReqHeader,
    reqBody: MatchData
  });

  async handle(con: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const studentNumber = await verifySession(data.headers.token);

    const match = data.body;
    const verify = await getAssigned(studentNumber, match.matchID);
    if (isNull(verify)) throw new UnprocessableEntityException("You are not set to scout this match");
    if (verify.TeamNumber !== match.team) throw new UnprocessableEntityException("Wrong team");

    const { auton, teleop, beachedReason, brokenReason, ...matchRest } = match;
    const { climbSuccess, climbFailReason, ...autonRest } = auton;
    const { rolesOther, cycling, scoringSpeed, scoringAccuracy, feeding, defense, climbLevel, ...teleopRest } = teleop;
    const roles = teleop.roles;

    const pruned: MatchData = {
      auton: {
        ...autonRest
      },
      teleop: {
        ...teleopRest
      },
      ...matchRest
    }
    if (match.beached) pruned.beachedReason = beachedReason;
    if (match.botBroke) pruned.brokenReason = brokenReason;
    if (auton.climbAttempted) {
      pruned.auton.climbSuccess = climbSuccess;
      if (!climbSuccess) pruned.auton.climbFailReason = climbFailReason;
    }
    if (roles.other) pruned.teleop.rolesOther = rolesOther;
    if (roles.cycling) pruned.teleop.cycling = cycling;
    if (roles.scoring) {
      pruned.teleop.scoringSpeed = scoringSpeed;
      pruned.teleop.scoringAccuracy = scoringAccuracy;
    }
    if (roles.feeding) pruned.teleop.feeding = feeding;
    if (roles.defense) pruned.teleop.defense = defense;

    await prepUpdate("TeamToMatch", {
      MatchID: match.matchID,
      Alliance: match.alliance,
      TeamIndex: verify.TeamIndex,
      MatchData: JSON.stringify(pruned),
      ServerScoutedTime: Date.now(),
      UserScoutedTime: data.headers.timeStamp,
    }).run();

    return con.text("OK");
  }
}
