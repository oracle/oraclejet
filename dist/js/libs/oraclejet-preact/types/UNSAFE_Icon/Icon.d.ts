/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { JSX } from 'preact';
declare type IntrinsicProps = JSX.SVGAttributes<SVGSVGElement>;
declare type Props = Pick<IntrinsicProps, 'viewBox' | 'children'> & {
    /**
     * The size of the component. Defaults to '1em', which means the font size of the parent is used.
     */
    size?: keyof typeof sizeStyles;
    /**
     * The color of the component. Defaults to 'currentColor', which behaves like the CSS 'currentColor' value.
     */
    color?: keyof typeof colorStyles;
    /**
     * A label to be used for accessibility purposes.
     */
    accessibleLabel?: string;
};
export declare const Icon: ({ size, color, accessibleLabel, viewBox, children }: Props) => JSX.Element;
declare const sizeStyles: {
    '1em': string;
    '1x': string;
    '2x': string;
    '3x': string;
    '4x': string;
    '5x': string;
    '6x': string;
    '7x': string;
    '8x': string;
    '9x': string;
    '10x': string;
    '11x': string;
    '12x': string;
};
declare const colorStyles: {
    primary: string;
    secondary: string;
    disabled: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
    currentColor: string;
};
export {};
