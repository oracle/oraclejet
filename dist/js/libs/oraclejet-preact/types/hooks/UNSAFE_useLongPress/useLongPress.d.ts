/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
declare type LongPressOptions = {
    isDisabled?: boolean;
    minimumTime?: number;
};
declare type LongPressInfo = {
    x: number;
    y: number;
};
export declare function useLongPress(onLongPress: (e: LongPressInfo) => void, { isDisabled, minimumTime }?: LongPressOptions): {
    longPressProps: Record<string, any>;
};
export {};
