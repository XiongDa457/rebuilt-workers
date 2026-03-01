/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A team's inspection status.
 */
export type InspectionStatus = {
    /**
     * Whether the team has passed an initial, complete inspection.
     */
    inspected?: boolean;
    /**
     * The current inspection status of the team. Not set for demo events. This value is cached and may be a couple minutes out of date.
     */
    status?: InspectionStatus.status;
    /**
     * The current position of this team in the inspection queue. Not set for demo events. This value is cached and may be a couple minutes out of date.
     */
    queuePosition?: number | null;
};
export namespace InspectionStatus {
    /**
     * The current inspection status of the team. Not set for demo events. This value is cached and may be a couple minutes out of date.
     */
    export enum status {
        HOLD = 'hold',
        IN_PROGRESS = 'in-progress',
        COMPLETE = 'complete',
        REINSPECTION = 'reinspection',
        QUEUED = 'queued',
        NOT_STARTED = 'not-started',
    }
}

