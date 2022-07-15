/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'id' | 'class' | 'children'>;
declare type Props = {
    /**
     * Specifies the id of the progress bar.  If the progress bar is being used to describe the loading process of a particular region
     * of the page, then the aria-describedby attribute of the region must point to the id of the ProgressBar
     */
    id?: IntrinsicProps['id'];
    /**
     * The value of the progress bar.  If the value is 'indeterminate', an indeterminate progress bar will be shown.
     */
    value?: 'indeterminate' | number;
    /**
     * Whether the progress bar is positioned at the top edge of a container or not.
     * If set to 'top', the curved borders will be removed.
     */
    edge?: 'none' | 'top';
    /**
     * The maximum value of the progress bar.
     */
    max?: number;
    /**
     * The width of the progress bar.  This will use the CSS lengths styling.
     */
    width?: string;
    /**
     * A label to be used for accessibility purposes when value is set to 'indeterminate'.
     */
    accessibleLabel?: string;
};
export declare function ProgressBar({ value, max, ...otherProps }: Props): JSX.Element;
export {};
