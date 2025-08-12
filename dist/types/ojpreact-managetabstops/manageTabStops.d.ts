/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
type Props = {
    children?: ComponentChildren;
};
/**
 * The ManageTabStops component is used to provide tabbable mode for legacy components
 * when they are used inside a template slot of a Preact component.
 * See JET-54400 for details.
 * @ignore
 */
export declare function ManageTabStops({ children }: Props): import("preact").JSX.Element;
export {};
