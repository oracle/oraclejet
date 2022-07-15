/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import type { BorderProps } from '../utils/UNSAFE_interpolations/borders';
import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
import type { FlexitemProps } from '../utils/UNSAFE_interpolations/flexitem';
import type { ColorProps } from '../utils/UNSAFE_interpolations/colors';
import type { PaddingProps } from '../utils/UNSAFE_interpolations/padding';
import type { AriaProps } from '../utils/UNSAFE_interpolations/aria';
import type { Role } from '../utils/UNSAFE_roles';
declare const elementTypes: ("article" | "aside" | "div" | "main" | "section")[];
declare type ElementType = typeof elementTypes[number];
declare type StyleProps = BorderProps & DimensionProps & FlexitemProps & ColorProps & PaddingProps & AriaProps;
declare type Props = StyleProps & {
    as?: ElementType;
    labelledBy?: string;
    role?: Role;
    children?: ComponentChildren;
};
export declare const View: ({ as, children, ...props }: Props) => import("preact").JSX.Element;
export { elementTypes };
