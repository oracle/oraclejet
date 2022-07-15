/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren, ComponentProps } from 'preact';
import { BaseButton } from './BaseButton';
export declare type ButtonDisplay = 'icons' | 'label' | 'all';
export declare type Props = {
    /**
     *The default slot is the button's text label. The oj-c-button element accepts plain text or DOM nodes as children for the default slot."
     */
    children?: ComponentChildren;
    /**
     * The startIcon = is the button's start icon.
     */
    startIcon?: ComponentChildren;
    /**
     * The endIcon is the button's end icon.
     */
    endIcon?: ComponentChildren;
    /**
     * size
     */
    size?: ComponentProps<typeof BaseButton>['size'];
    /**
     * display
     */
    display?: ButtonDisplay;
};
export declare function ButtonLayout({ size, display, ...props }: Props): import("preact").JSX.Element;
