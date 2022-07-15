/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { ItemContext } from './Collection.types';
/**
 * Props for the Collection Component
 */
export declare type Props<D> = {
    /**
     * An array of data
     */
    items: D[];
    /**
     * A function to render each item
     */
    children: (context: ItemContext<D>) => ComponentChildren;
};
/**
 * Component that renders an array of data.
 */
export declare function Collection<D>({ items, children }: Props<D>): import("preact").JSX.Element;
