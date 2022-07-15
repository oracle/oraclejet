/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { JSX } from 'preact';
export declare const placeholderTypes: ("topPlaceholder" | "bottomPlaceholder")[];
/**
 * Type of placeholder (top which is before the data content and bottom which is after the data content)
 */
export declare type PlaceholderType = typeof placeholderTypes[number];
/**
 * Context object which is pass to the placeholderHeight function callback
 */
export declare type PlaceholderContext = {
    fromIndex: number;
    toIndex: number;
    estimateItemSize: number;
    which: PlaceholderType;
};
export declare const PLACEHOLDER_STYLE_CLASS = "oj-collection-placeholder";
declare type Props = {
    context: PlaceholderContext;
    placeholderHeight?: (context: PlaceholderContext) => number;
};
/**
 * A component that renders placeholder which is used internally by VirtualizeViewportCollection
 */
export declare const Placeholder: ({ context, placeholderHeight }: Props) => JSX.Element;
export {};
