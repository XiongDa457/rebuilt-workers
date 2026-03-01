/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PartsRequest = {
    /**
     * A unique identifier for this parts request.
     */
    id?: string;
    /**
     * The parts requested.
     */
    parts?: string;
    /**
     * The team number requesting the parts.
     */
    requestedByTeam?: string;
    /**
     * The timestamp (Unix time in milliseconds) at which this parts request was posted.
     */
    postedTime?: number;
};

