/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { JSX, RefObject } from 'preact';
export declare type FocusableComponentHandle = {
    focus: () => boolean;
    contains: (element: HTMLElement) => boolean;
};
declare type FocusableComponentCallbacks = {
    onFocus?: () => void;
};
declare type FocusManagerHandlers = Pick<JSX.HTMLAttributes, 'onfocusin' | 'onfocusout' | 'onKeyDown'>;
/**
 * A custom hook that handles focus management for the messages component.
 * @param ref The custom ref handle for the component
 * @param callbacks Optional callbacks
 * @returns The handlers and a controller
 */
export declare function useMessageFocusManager(ref: RefObject<FocusableComponentHandle>, callbacks?: FocusableComponentCallbacks): {
    handlers: FocusManagerHandlers;
    controller: {
        prioritize: () => void;
        restorePriorFocus: () => boolean;
    };
};
export {};
