/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps } from 'preact';
import { DataState } from '../UNSAFE_Collection';
import { ListView } from '../UNSAFE_ListView';
import { ItemTextType } from './itemTextUtils';
declare type PickedPropsFromListView = Pick<ComponentProps<typeof ListView>, 'accessibleSummary' | 'onCurrentKeyChange' | 'onSelectionChange' | 'viewportConfig'>;
declare type Props<K extends string | number, D extends Record<string, any>> = PickedPropsFromListView & {
    itemText: ItemTextType<K, D>;
    currentKey?: K;
    data?: DataState<K, D> | null;
    onLoadRange?: ComponentProps<typeof ListView>['onLoadRange'];
    searchText?: string;
    selectedKeys?: Set<K>;
};
export declare function DefaultList<K extends string | number, D extends Record<string, any>>({ accessibleSummary, currentKey, data, itemText, onCurrentKeyChange, onLoadRange, onSelectionChange, searchText, selectedKeys }: Props<K, D>): import("preact").JSX.Element;
export {};
