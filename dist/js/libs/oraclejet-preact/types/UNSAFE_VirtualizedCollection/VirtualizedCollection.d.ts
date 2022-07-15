/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { DataState, ListItemContext, Range } from '../UNSAFE_Collection';
import { PlaceholderContext } from './Placeholder';
import { ViewportConfig } from '../hooks/UNSAFE_useViewportIntersect';
/**
 * This information is pass to the rangeExtractor callback to help
 * determine what the rendered range should be.  We can add more information
 * as needed in the future.
 */
export declare type ViewportInfo = {
    scrollOffset?: number;
    itemSize?: number;
    viewportHeight?: number;
    overscan?: number;
};
/**
 * Props for the VirtualizedCollection component
 */
declare type Props<K, D> = {
    /**
     * A DataState object that provide information including data and metadata to the VirtualizedCollection.
     */
    data: DataState<K, D> | null;
    /**
     * Renderer callback used to render each item
     */
    children: (context: ListItemContext<K, D>) => ComponentChildren;
    /**
     * Callback to calculate placeholder height
     */
    placeholderHeight?: (context: PlaceholderContext) => number;
    /**
     * Viewport configuration including specifying the element which is used to determine what range
     * of data to render
     */
    viewportConfig: ViewportConfig;
    /**
     * The selector string to identify the children items
     */
    itemSelector: string;
    /**
     * Callback function to handle when viewport has changed, including the case
     * where user scrolls to the end of the component and there are more items to load.
     * The function should sets a new DataState on the component for the specified range.
     */
    onLoadRange: (range: Range) => void;
    /**
     * The number of additional items to render before and after the current viewport.  This is
     * mainly used for performance tuning.  Increase the overscan will result in less frequent
     * rendering when scroll but at the same time each render will take longer depending on the
     * item content.
     */
    overscan?: number;
    /**
     * Optionally provide a custom callback to return the range to render based on viewport info
     */
    rangeExtractor?: (info: ViewportInfo) => Range;
    /**
     * Optionally specify the custom load more indicator
     */
    loadMoreIndicator?: ComponentChildren;
    /**
     * Optionally provide the suggestion indicator sparkle
     */
    suggestions?: ComponentChildren;
};
/**
 * A function that returns the default range extractor
 * @param fetchSize
 */
export declare function getDefaultRangeExtractor(fetchSize: number): ({ itemSize, viewportHeight, scrollOffset, overscan }: ViewportInfo) => Range;
/**
 * Component that only render items in the specified viewport.
 * @param props
 */
export declare function VirtualizedCollection<K, D>({ data, children, viewportConfig, itemSelector, placeholderHeight, rangeExtractor, overscan, onLoadRange, loadMoreIndicator, suggestions }: Props<K, D>): import("preact").JSX.Element;
export {};
