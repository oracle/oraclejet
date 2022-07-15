/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
declare type Props = {
    /**
     * Specifies the source for the image of the avatar.  Will only be displayed if no icon component is specified as a child.  Image will be rendered as a
     * background image.
     */
    src?: string;
    /**
     * Specifies the initials of the avatar.  Will only be displayed if both the src attribute and the child icon component are not specified.
     */
    initials?: string;
    /**
     * Specifies the background of the avatar.
     */
    background?: 'neutral' | 'orange' | 'green' | 'teal' | 'blue' | 'slate' | 'pink' | 'purple' | 'lilac' | 'gray';
    /**
     * Specifies the size of the avatar.
     */
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    /**
     * Specifies the shape of the avatar. Can be square or circle.  The default value of this
     * property varies by theme.
     */
    shape?: 'square' | 'circle';
    /**
     * Avatar will set the aria-label attribute with accessibleLabel.
     * If the component needs to be accessible, the aria label of the avatar must be populated.
     * The component does not need to be accessible if any associated information (e.g. the name of the person represented by the avatar)
     * is already available to assistive technologies (e.g when the name is rendered in addition to the avatar as part of the page content).
     *
     *  If accessibleLabel  is set, role will internally be set to 'img'.
     */
    accessibleLabel?: string;
} & IntrinsicProps;
export declare function Avatar({ children, src, ...otherProps }: Props): JSX.Element;
export {};
