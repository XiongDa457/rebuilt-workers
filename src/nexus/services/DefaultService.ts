/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventKey } from '../models/EventKey';
import type { Events } from '../models/Events';
import type { EventStatus } from '../models/EventStatus';
import type { InspectionStatuses } from '../models/InspectionStatuses';
import type { PitAddresses } from '../models/PitAddresses';
import type { PitMap } from '../models/PitMap';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Live event status (pull)
     * @param eventKey The event you want to fetch the status of.
     * @returns EventStatus Live event status
     * @throws ApiError
     */
    public static pullLiveEventStatus(
        eventKey: EventKey,
    ): CancelablePromise<EventStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/{eventKey}',
            path: {
                'eventKey': eventKey,
            },
            errors: {
                401: `Missing API key. Get your API key from [frc.nexus/api](https://frc.nexus/api) and include it in the \`Nexus-Api-Key\` header.`,
                403: `Invalid API key. Ensure the key you're using matches your key at [frc.nexus/api](https://frc.nexus/api). If abuse was detected, your API key may have been disabled. Email contact@frc.nexus for support.`,
                404: `\`eventKey\` does not exist.`,
                500: `An unknown server error occurred. Try again later or email contact@frc.nexus for support.`,
            },
        });
    }
    /**
     * Pit addresses (pull)
     * Get the mapping from team number to pit addresses.
     * @param eventKey The event you want to fetch the pits for.
     * @returns PitAddresses Team number to pit address map
     * @throws ApiError
     */
    public static pullPitAddresses(
        eventKey: EventKey,
    ): CancelablePromise<PitAddresses> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/{eventKey}/pits',
            path: {
                'eventKey': eventKey,
            },
            errors: {
                401: `Missing API key. Get your API key from [frc.nexus/api](https://frc.nexus/api) and include it in the \`Nexus-Api-Key\` header.`,
                403: `Invalid API key. Ensure the key you're using matches your key at [frc.nexus/api](https://frc.nexus/api). If abuse was detected, your API key may have been disabled. Email contact@frc.nexus for support.`,
                404: `\`eventKey\` does not exist.`,
                500: `An unknown server error occurred. Try again later or email contact@frc.nexus for support.`,
            },
        });
    }
    /**
     * Pit map (pull)
     * Get raw map data that can be used to render your own version of a pit map.
     * @param eventKey The event you want to fetch the map for.
     * @returns PitMap Pit map
     * @throws ApiError
     */
    public static pullPitMap(
        eventKey: EventKey,
    ): CancelablePromise<PitMap> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/{eventKey}/map',
            path: {
                'eventKey': eventKey,
            },
            errors: {
                401: `Missing API key. Get your API key from [frc.nexus/api](https://frc.nexus/api) and include it in the \`Nexus-Api-Key\` header.`,
                403: `Invalid API key. Ensure the key you're using matches your key at [frc.nexus/api](https://frc.nexus/api). If abuse was detected, your API key may have been disabled. Email contact@frc.nexus for support.`,
                404: `\`eventKey\` does not exist or does not have a pit map.`,
                500: `An unknown server error occurred. Try again later or email contact@frc.nexus for support.`,
            },
        });
    }
    /**
     * Inspection status (pull)
     * Get the mapping from team number to inspection status.
     * @param eventKey The event you want to fetch inspection status for.
     * @returns InspectionStatuses Team number to inspection status map
     * @throws ApiError
     */
    public static getInspectionStatus(
        eventKey: EventKey,
    ): CancelablePromise<InspectionStatuses> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/{eventKey}/inspection',
            path: {
                'eventKey': eventKey,
            },
            errors: {
                401: `Missing API key. Get your API key from [frc.nexus/api](https://frc.nexus/api) and include it in the \`Nexus-Api-Key\` header.`,
                403: `Invalid API key. Ensure the key you're using matches your key at [frc.nexus/api](https://frc.nexus/api). If abuse was detected, your API key may have been disabled. Email contact@frc.nexus for support.`,
                404: `\`eventKey\` does not exist or the event has not started inspection in Nexus.`,
                500: `An unknown server error occurred. Try again later or email contact@frc.nexus for support.`,
            },
        });
    }
    /**
     * Events (pull)
     * @returns Events Event object
     * @throws ApiError
     */
    public static pullEvents(): CancelablePromise<Events> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events',
            errors: {
                401: `Missing API key. Get your API key from [frc.nexus/api](https://frc.nexus/api) and include it in the \`Nexus-Api-Key\` header.`,
                403: `Invalid API key. Ensure the key you're using matches your key at [frc.nexus/api](https://frc.nexus/api). If abuse was detected, your API key may have been disabled. Email contact@frc.nexus for support.`,
                404: `No events.`,
                500: `An unknown server error occurred. Try again later or email contact@frc.nexus for support.`,
            },
        });
    }
}
