/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
declare type Props = {
    children?: ComponentChildren;
    isLoading?: boolean;
};
export declare function DropdownList({ children, isLoading }: Props): import("preact").JSX.Element;
export {};
