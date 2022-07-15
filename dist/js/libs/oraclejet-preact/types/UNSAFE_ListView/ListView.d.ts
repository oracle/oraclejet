/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { Keys } from '../utils/UNSAFE_keys';
import { CurrentKeyDetail, DataState, ListItemContext, Range, SelectionDetail, SelectionMode } from '../UNSAFE_Collection';
import { ViewportConfig } from '../UNSAFE_VirtualizedCollection';
/**
 * Type for gridlines
 */
export declare const gridlinesValues: ("hidden" | "visible")[];
export declare type Gridlines = typeof gridlinesValues[number];
/**
 * Props for the ListView Component
 */
export declare type Props<K, D> = {
    /**
     * A DataState object that provide information including data and metadata to this ListView.
     * If the value is null, then ListView will show loading indicator until a DataState is set.
     */
    data: DataState<K, D> | null;
    /**
     * A function to render each item
     */
    children: (context: ListItemContext<K, D>) => ComponentChildren;
    /**
     * Callback function to handle when viewport has changed, including the case
     * where user scrolls to the end of the component and there are more items to load.
     * The function should sets a new DataState on the component for the specified range.
     */
    onLoadRange: (range: Range) => void;
    /**
     * A text that provides a summary of this ListView for the purpose of accessibility.
     * This is required in order to make ListView accessible.
     */
    accessibleSummary: string;
    /**
     * The key of the item that currently have keyboard focus. Ignored if the current item is not
     * currently in the viewport.
     */
    currentKey?: K;
    /**
     * Specifies whether the horizontal grid lines should be visible.  By default gridlines
     * are hidden.
     */
    gridlines?: Gridlines;
    /**
     * The keys of the current selected items in the ListView.
     */
    selectedKeys?: Keys<K>;
    /**
     * The type of selection behavior that is enabled on the ListView. This property controls the number
     * of selections that can be made via selection gestures at any given time.
     */
    selectionMode?: SelectionMode;
    /**
     * Callback function to handle when current focused item has changed.  The function should
     * update the currentKey prop with a new current key.
     */
    onCurrentKeyChange?: (detail: CurrentKeyDetail<K>) => void;
    /**
     * Callback function to handle when selection has changed.  The function should update
     * the selectedKeys prop with a new set of selected keys.
     */
    onSelectionChange?: (detail: SelectionDetail<K>) => void;
    /**
     * Viewport configuration which the application can specify the element to determine what range
     * of data to render.
     */
    viewportConfig?: ViewportConfig;
};
/**
 * A sparkle component for smart suggestion indicator in ListView
 * @param sparkleHeight the height of sparkle
 */
export declare function Sparkle({ sparkleHeight }: {
    sparkleHeight: number;
}): import("preact").JSX.Element | null;
/**
 * Component that renders items as a flat list.
 * In order to maximize performance, only items that are visible in the viewport are rendered.
 */
export declare function ListView<K extends string | number, D>({ accessibleSummary, data, children, currentKey, gridlines, selectedKeys, selectionMode, onCurrentKeyChange, onLoadRange, onSelectionChange, viewportConfig }: Props<K, D>): import("preact").JSX.Element;
