/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MapElement = {
    /**
     * The position of the center of this element.
     */
    position?: {
        /**
         * The position of the center of this element on the horizontal axis. 10 units is approximately 1 foot.
         */
        'x'?: number;
        /**
         * The position of the center of this element on the vertical axis. 10 units is approximately 1 foot.
         */
        'y'?: number;
    };
    /**
     * The size of this element.
     */
    size?: {
        /**
         * The width of this element. 10 units is approximately 1 foot.
         */
        'x'?: number;
        /**
         * The height of this element. 10 units is approximately 1 foot.
         */
        'y'?: number;
    };
    /**
     * The angle in degrees that this element is rotated about its center.
     */
    angle?: number | null;
};

