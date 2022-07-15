/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { Keys } from '../utils/UNSAFE_keys';
import { SelectionDetail, SelectionMode } from '../UNSAFE_Collection';
export declare const ITEM_STYLE_CLASS = "oj-listview-item";
/**
 * Props for the ListViewItem Component
 */
export declare type Props<K> = {
    children: ComponentChildren;
    itemKey: K;
    itemIndex: number;
    currentKey?: K;
    selectedKeys: Keys<K>;
    selectionMode: SelectionMode;
    isFocusRingVisible: boolean;
    isGridlineVisible: boolean;
    suggestion?: 'end' | true;
    onSelectionChange?: (detail: SelectionDetail<K>) => void;
};
/**
 * The internal component used to render a single item in ListView.
 */
export declare function ListViewItem<K extends string | number>({ children, itemKey, itemIndex, currentKey, isFocusRingVisible, isGridlineVisible, suggestion, selectedKeys, selectionMode, onSelectionChange }: Props<K>): import("preact").JSX.Element;
