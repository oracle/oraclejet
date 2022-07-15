/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
declare type Props = {
    /**
     * Sets the URL that the hyperlink points to.
     */
    href: string;
    /**
     * Sets the variant.
     */
    variant?: 'default' | 'primary' | 'secondary';
    /**
     * Sets the placement.
     */
    placement?: 'standalone' | 'embedded';
    /**
     * Sets the target.
     */
    target?: string;
    /**
     * Triggered when a link is clicked, whether by keyboard, mouse, or touch events.
     */
    onClick?: (event: Event) => void;
    /**
     * Specifies the children
     */
    children?: ComponentChildren;
};
export declare function Link({ href, variant, placement, target, children, onClick }: Props): import("preact").JSX.Element;
export {};
