/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
declare type PanOptions = {
    threshold?: number;
    minimumTime?: number;
    isDisabled?: boolean;
};
declare type PanInfo = {
    x: number;
    y: number;
    status: 'start' | 'end' | 'move';
};
export declare function usePan(onPan: (e: PanInfo) => void, { threshold, minimumTime, isDisabled }?: PanOptions): {
    panProps: Record<string, any>;
};
export {};
