/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from 'preact';
declare type StyleProps = {
    /**
     * Specifies the background of the avatar.
     */
    background?: 'neutral' | 'orange' | 'green' | 'teal' | 'blue' | 'slate' | 'pink' | 'purple' | 'lilac' | 'gray';
    /**
     * Specifies the src for the image of the avatar.  Image will be rendered as a
     * background image.
     */
    backgroundImage?: string;
    /**
     * Specifies the size of the avatar.
     */
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    /**
     * Specifies the shape of the avatar. Can be square or circle.The default value of this
     * property varies by theme.
     */
    shape?: 'square' | 'circle';
};
declare type Props = StyleProps & {
    /**
     * Specifies the string that will be rendered in the avatar.
     */
    children?: string;
};
export declare function Avatar({ children, backgroundImage, ...styleProps }: Props): h.JSX.Element;
export {};
