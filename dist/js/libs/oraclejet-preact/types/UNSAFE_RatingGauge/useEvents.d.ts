/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { Ref, MutableRef } from 'preact/hooks';
export declare type CommitDetail = {
    value: number;
};
export declare type InputDetail = {
    value?: number;
};
export declare const useEvents: (max: number, step: number, value: number, rootRef: Ref<HTMLElement>, dimensionsRef: MutableRef<{
    width: number;
    x: number;
}>, isInteractive: boolean, onCommit?: ((detail: CommitDetail) => void) | undefined, onInput?: ((detail: InputDetail) => void) | undefined) => {
    onPointerUp?: undefined;
    onBlur?: undefined;
    onPointerMove?: undefined;
    onKeyUp?: undefined;
    onKeyDown?: undefined;
    onPointerLeave?: undefined;
    onPointerEnter?: undefined;
} | {
    onPointerUp: (event: PointerEvent) => void;
    onBlur: () => void;
    onPointerMove: (event: PointerEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onPointerLeave: () => void;
    onPointerEnter: () => void;
};
