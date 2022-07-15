/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
declare type TapOptions = {
    isDisabled?: boolean;
};
declare type TapInfo = {
    x: number;
    y: number;
};
/**
 * Returns event handlers that can make a target element tapable.
 * useTap is used for non-keyboard elements.
 *
 * @param onTap function
 * @param settings object
 * @returns
 */
export declare function useTap(onTap: (e: TapInfo) => void, { isDisabled }?: TapOptions): {
    tapProps: Record<string, any>;
};
export {};
