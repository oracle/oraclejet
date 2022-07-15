/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
declare type Props = {
    isStarted: boolean;
    delay?: number;
};
/**
 * Hook for a timer.
 * @param isStarted Specifies whether the timer should be started: true to start it, false to stop
 * it.
 * @param delay Specifies the delay after which the timer should expire.
 * @returns True if the timer expires, false if it was stopped before that.
 *
 */
export declare function useTimer({ isStarted, delay }: Props): boolean;
export {};
