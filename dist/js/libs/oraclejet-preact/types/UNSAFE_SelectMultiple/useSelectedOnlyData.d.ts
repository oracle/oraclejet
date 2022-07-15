/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { DataState } from 'src/UNSAFE_Collection';
import { Item } from '../utils/UNSAFE_dataProvider';
declare type Props<K, D> = {
    isDropdownSelectedOnlyView?: boolean;
    valueItems?: Item<K, D>[];
};
/**
 * Get the data to show in the dropdown for the selected-only view.
 * @param isDropdownSelectedOnlyView Whether the component is showing only selected
 * values in the dropdown: true if so, false if not.
 * @param valueItems The keys, data, and optional metadata for the selected values.
 * @returns An object with data and onLoadRange properties that can be passed on to the
 * list in the dropdown.
 */
export declare function useSelectedOnlyData<K, D>({ isDropdownSelectedOnlyView, valueItems }: Props<K, D>): {
    data: DataState<K, D> | undefined;
    onLoadRange: undefined;
};
export {};
