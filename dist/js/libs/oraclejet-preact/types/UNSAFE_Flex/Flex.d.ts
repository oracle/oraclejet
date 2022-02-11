/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h, ComponentChildren } from "preact";
import type { DimensionProps } from "@oracle/oraclejet-preact/utils/interpolations/dimensions";
import type { FlexboxProps } from "./flexbox";
declare type StyleProps = DimensionProps & FlexboxProps;
declare type Props = StyleProps & {
    children?: ComponentChildren;
};
export declare const Flex: ({ children, ...props }: Props) => h.JSX.Element;
export {};
