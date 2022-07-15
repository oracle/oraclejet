/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Hook for a timer used to determine when to show a loading indicator.
 * After the timer is started, the loading indicator should only be shown after a slight delay,
 * when the timer expires.  A loading indicator should not be shown immediately because that
 * could result in unwanted flashing in the UI.
 * @param isLoading Specifies whether the calling code is in a loading state and the timer
 * should be started: true to start it, false to stop it.
 * @returns True if the timer expires, false if it was stopped before that.
 */
export declare function useLoadingIndicatorTimer(isLoading: boolean): boolean;
