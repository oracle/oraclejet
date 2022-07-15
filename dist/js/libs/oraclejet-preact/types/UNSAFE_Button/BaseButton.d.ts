/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren, JSX, Ref } from 'preact';
import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
declare type ButtonElementDetails = {
    type: 'button';
} | {
    type: 'a';
    href: string;
    target?: string;
    rel?: string;
};
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLElement>, 'autofocus' | 'title'>;
export declare type Props = IntrinsicProps & DimensionProps & {
    /**
     *The default slot is the button's text label. The oj-c-button element accepts plain text or DOM nodes as children for the default slot."
     */
    children?: ComponentChildren;
    /**
     * Specifies that the button element should be disabled.
     */
    isDisabled?: boolean;
    /**
     * Indicates in what states the button has chrome (background and border).
     *     "borderless"': "Borderless buttons are the least prominent variation.
     * Borderless buttons are useful for supplemental actions that require minimal emphasis.",
     *     "outlined"': "Outlined buttons are salient, but lighter weight than
     * solid buttons. Outlined buttons are useful for secondary actions.",
     *     "solid"': "Solid buttons stand out, and direct the user's attention to the
     *  most important actions in the UI.",
     *     "callToAction"': "A Call To Action (CTA) button guides the user to take or
     * complete the action that is the main goal of the page or page section. There
     * should only be one CTA button on a page at any given time.",
     *     "danger"': "A Danger button alerts the user to a dangerous situation.",
     */
    variant?: 'borderless' | 'outlined' | 'solid' | 'callToAction' | 'danger';
    /**
     * size
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * edge
     */
    edge?: 'none' | 'bottom';
    /**
     * accessibleLabel
     */
    accessibleLabel?: string;
    /**
     * styling
     */
    styling?: 'default' | 'min' | 'unstyled';
    /**
     * Triggered when a button is clicked, whether by keyboard, mouse, or touch events.
     */
    onAction?: () => void;
    /**
     * Indicate element type and associated details
     */
    elementDetails?: ButtonElementDetails;
};
export declare const BaseButton: import("preact").FunctionalComponent<Omit<Props, "ref"> & {
    ref?: Ref<HTMLButtonElement & HTMLAnchorElement> | undefined;
}>;
export {};
