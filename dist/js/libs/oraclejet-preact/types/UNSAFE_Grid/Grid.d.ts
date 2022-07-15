/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import type { GridProps } from '../utils/UNSAFE_interpolations/grid';
import type { BoxAlignmentProps } from '../utils/UNSAFE_interpolations/boxalignment';
declare type Props = GridProps & BoxAlignmentProps & {
    /**
     * The children to put in the grid.
     */
    children?: ComponentChildren;
};
/**
 * An implicit grid. Resize your browser to see how items reflow.
 */
export declare const Grid: ({ children, ...props }: Props) => import("preact").JSX.Element;
export {};
