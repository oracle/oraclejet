/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
import type { BoxAlignmentProps } from '../utils/UNSAFE_interpolations/boxalignment';
import type { FlexboxProps } from '../utils/UNSAFE_interpolations/flexbox';
import type { FlexitemProps } from '../utils/UNSAFE_interpolations/flexitem';
declare type StyleProps = DimensionProps & FlexboxProps & FlexitemProps & BoxAlignmentProps;
declare type Props = StyleProps & {
    children?: ComponentChildren;
};
export declare const Flex: ({ children, ...props }: Props) => import("preact").JSX.Element;
export {};
