/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Teams } from './Teams';
export type Match = {
    /**
     * The human-friendly label for a match. Examples: `Practice 1`, `Qualification 24`, `Qualification 24 Replay`, `Playoff 8`, `Final 1`
     */
    label?: string;
    /**
     * The current queuing status of this match. Typically, matches transition from `Queuing soon` -> `Now queuing` -> `On deck` -> `On field`. However, any state transition is possible and some events skip the `Now queuing` state entirely.
     */
    status?: Match.status;
    redTeams?: Teams;
    blueTeams?: Teams;
    /**
     * Timestamps for key match status changes based on lead queuer input.
     */
    times?: {
        /**
         * The timestamp (Unix time in milliseconds) at which this match was originally scheduled to start. Not set for playoffs and whenever scheduled match times are not available.
         */
        scheduledStartTime?: number | null;
        /**
         * The timestamp (Unix time in milliseconds) at which this match is estimated to be `Now queuing`. If the status of this match is not `Queuing soon`, then this timestamp is equivalent to `actualQueueTime`.
         */
        estimatedQueueTime?: number | null;
        /**
         * The timestamp (Unix time in milliseconds) at which this match is estimated to be `On deck`. If the status of this match is `On deck` or `On field`, then this timestamp is equivalent to `actualOnDeckTime`.
         */
        estimatedOnDeckTime?: number | null;
        /**
         * The timestamp (Unix time in milliseconds) at which this match is estimated to be `On field`. If the status of this match is `On field`, then this timestamp is equivalent to `actualOnFieldTime`.
         */
        estimatedOnFieldTime?: number | null;
        /**
         * The timestamp (Unix time in milliseconds) at which this match is estimated to start ("3 - 2 - 1 - Go!").
         */
        estimatedStartTime?: number | null;
        /**
         * The timestamp (Unix time in milliseconds) at which the status of this match was set to `Now queuing`. If the status of this match is `Queuing soon`, then this is null.
         */
        actualQueueTime?: number | null;
        /**
         * The timestamp (Unix time in milliseconds) at which the status of this match was set to `On deck`. If the status of this match is `Queuing soon` or `Now queuing`, then this is null.
         */
        actualOnDeckTime?: number | null;
        /**
         * The timestamp (Unix time in milliseconds) at which the status of this match was set to `On field`. If the status of this match is not `On field`, then this is null.
         */
        actualOnFieldTime?: number | null;
    };
    /**
     * The label for a break that begins after this match is played. Null if there is no break after this match.
     */
    breakAfter?: Match.breakAfter;
    /**
     * The match this match is a replay of. Null if this match is not a replay
     */
    replayOf?: string | null;
};
export namespace Match {
    /**
     * The current queuing status of this match. Typically, matches transition from `Queuing soon` -> `Now queuing` -> `On deck` -> `On field`. However, any state transition is possible and some events skip the `Now queuing` state entirely.
     */
    export enum status {
        QUEUING_SOON = 'Queuing soon',
        NOW_QUEUING = 'Now queuing',
        ON_DECK = 'On deck',
        ON_FIELD = 'On field',
    }
    /**
     * The label for a break that begins after this match is played. Null if there is no break after this match.
     */
    export enum breakAfter {
        BREAK = 'Break',
        LUNCH = 'Lunch',
        END_OF_DAY = 'End of day',
        ALLIANCE_SELECTION = 'Alliance selection',
        AWARDS_BREAK = 'Awards break',
    }
}

