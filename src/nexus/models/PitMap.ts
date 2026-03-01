/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MapElement } from './MapElement';
export type PitMap = {
    /**
     * The size of the map.
     */
    size?: {
        /**
         * The width of the map. 10 units is approximately 1 foot.
         */
        'x'?: number;
        /**
         * The height of the map. 10 units is approximately 1 foot.
         */
        'y'?: number;
    };
    /**
     * The pits.
     */
    pits?: Record<string, (MapElement & {
        /**
         * The team number assigned to this pit, if any.
         */
        team?: string | null;
    })>;
    /**
     * Notable areas in or near the pit area, such as `Pit admin`.
     */
    areas?: any | null;
    /**
     * Arbitrary text labels.
     */
    labels?: any | null;
    /**
     * Arrows that can indicate entrances, exits, and paths.
     */
    arrows?: any | null;
    /**
     * Walls that may surround or divide pit areas. May also be used to indicate areas that are inaccessible by teams.
     */
    walls?: any | null;
};

