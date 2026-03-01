/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * High level details of an event that is registered for Nexus. Note: being registered for Nexus does not guarantee the event will use any particular feature of Nexus, if at all. Events will not be listed after they have concluded.
 */
export type EventSummary = {
    /**
     * The name of this event.
     */
    name?: string;
    /**
     * The timestamp (Unix time in milliseconds) at which this event is scheduled to start.
     */
    start?: number;
    /**
     * The timestamp (Unix time in milliseconds) at which this event is scheduled to end.
     */
    end?: number;
};

