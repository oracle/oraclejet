/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { MutableRef } from 'preact/hooks';
declare type Props = {
    anchorRef: MutableRef<HTMLElement | null>;
    children?: ComponentChildren;
    dropdownRef: MutableRef<HTMLElement | null>;
    id?: string;
    isOpen?: boolean;
    onAutoDismiss?: (event?: Event) => void;
};
export declare function Dropdown({ anchorRef, children, dropdownRef, id, isOpen, onAutoDismiss }: Props): import("preact").JSX.Element | null;
export {};
