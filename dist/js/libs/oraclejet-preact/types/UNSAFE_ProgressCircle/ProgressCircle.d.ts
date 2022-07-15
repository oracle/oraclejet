/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'id' | 'class' | 'children'>;
declare type Props = IntrinsicProps & {
    /**
     * Specifies the id of the progress circle.  If the progress circle is being used to describe the loading process of a particular region
     * of the page, then the aria-describedby attribute of the region must point to the id of the ProgressCircle
     */
    id?: IntrinsicProps['id'];
    /**
     * The value of the progress circle.  If the value is 'indeterminate', an indeterminate progress circle will be shown.
     */
    value?: 'indeterminate' | number;
    /**
     * The maximum value of the progress circle.
     */
    max?: number;
    /**
     * The size of the progress circle.
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * A label to be used for accessibility purposes when value is set to 'indeterminate'.
     */
    accessibleLabel?: string;
};
export declare function ProgressCircle({ value, max, ...otherProps }: Props): JSX.Element;
export {};
