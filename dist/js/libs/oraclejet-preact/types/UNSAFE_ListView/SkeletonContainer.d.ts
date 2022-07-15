/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
declare type Props = {
    /**
     * Allows to pass and access the properties from child elements
     **/
    children?: (index: number) => ComponentChildren;
    /**
     * Allows to specify number of skeletons to be rendered on initial load
     **/
    minimumCount?: number;
};
/**
 * SkeletonContainer renders 'minimumCount' number of skeletons
 * of the variant specified from its child element - Skeleton's prop after
 * 'timerValue' ms delay
 **/
export declare function SkeletonContainer({ children, minimumCount }: Props): import("preact").JSX.Element | null;
export {};
