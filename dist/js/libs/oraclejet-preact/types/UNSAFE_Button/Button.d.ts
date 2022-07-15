/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { JSX, ComponentChildren, ComponentProps, Ref } from 'preact';
import { BaseButton } from './BaseButton';
import { ButtonLayout } from './ButtonLayout';
import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLButtonElement>, 'autofocus'>;
declare type WidthProps = Pick<DimensionProps, 'width'>;
declare type Props = IntrinsicProps & WidthProps & {
    /**
     * The startIcon = is the button's start icon.
     */
    startIcon?: ComponentChildren;
    /**
     * The endIcon is the button's end icon.
     */
    endIcon?: ComponentChildren;
    /**
     * Specifies that the button element should be disabled.
     */
    isDisabled?: boolean;
    /**
     * label - button label, used for accessibility if no override
     */
    label?: string;
    /**
     * accessibleLabel - override label for accessibility
     */
    accessibleLabel?: string;
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
    variant?: ComponentProps<typeof BaseButton>['variant'];
    /**
     * size
     */
    size?: ComponentProps<typeof BaseButton>['size'];
    /**
     * edge
     */
    edge?: ComponentProps<typeof BaseButton>['edge'];
    /**
     * Triggered when a button is clicked, whether by keyboard, mouse, or touch events.
     */
    onAction?: () => void | null;
    /**
     * display
     */
    display?: ComponentProps<typeof ButtonLayout>['display'];
    /**
     * title
     */
    title?: string;
};
export declare const Button: import("preact").FunctionalComponent<Omit<Props, "ref"> & {
    ref?: Ref<HTMLButtonElement> | undefined;
}>;
export {};
