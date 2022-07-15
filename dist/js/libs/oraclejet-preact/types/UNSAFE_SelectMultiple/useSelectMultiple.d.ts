/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps } from 'preact';
import { MutableRef } from 'preact/hooks';
import { DataState } from '../UNSAFE_Collection';
import { Item } from '../utils/UNSAFE_dataProvider';
import { ValueUpdateDetail } from '../utils/UNSAFE_valueUpdateDetail';
import { SelectMultiple } from './SelectMultiple';
import { SelectedValuesCount } from './SelectedValuesCount';
declare type PickedPropsFromSelectMultiple = Pick<ComponentProps<typeof SelectMultiple>, 'isDisabled' | 'isReadonly' | 'onFilter' | 'onLoadRange'>;
declare type UseSelectMultipleProps<K, D> = PickedPropsFromSelectMultiple & {
    data?: DataState<K, D> | null;
    inputRef: MutableRef<HTMLInputElement>;
    isFocused?: boolean;
    onCommit: (detail: ValueUpdateDetail<Set<K>>) => void;
    valueItems?: Item<K, D>[];
};
declare type SelectedValuesCountToggleType = ComponentProps<typeof SelectedValuesCount>['onToggle'];
declare type SelectedValuesCountToggleDetailType = Parameters<Exclude<SelectedValuesCountToggleType, undefined>>[0];
/**
 * Hook that manages SelectMultiple state and behavior.  This hook creates state variables and
 * event listeners, returning properties to apply to components internally rendered by
 * SelectMultiple, as well as state information.
 *
 * @param data Specifies data for the dropdown list.
 * @param inputRef Ref to the input element.
 * @param isDisabled Specifies whether the component is disabled.
 * @param isFocused Specifies whether the component has focus.
 * @param isReadonly Specifies whether the component is readonly.
 * @param onCommit Callback invoked when the selected values are committed.
 * @param onFilter Callback function to trigger loading data for the dropdown list,
 * which may or may not be filtered by user entered text.
 * @param onLoadRange Callback function to handle when the viewport of the dropdown list has
 * changed, including the case where the user scrolls to the end of the list and there are more
 * items to load.  The function should set a new DataState on the component for the specified
 * range.
 * @param valueItems Specifies the keys, data, and optional metadata for the selected values.
 *
 * @returns Properties to apply to internal components that SelectMultiple renders, and component
 * state.
 */
export declare function useSelectMultiple<K, D>({ data: propData, inputRef, isDisabled, isFocused, isReadonly, onCommit, onFilter, onLoadRange: propOnLoadRange, valueItems }: UseSelectMultipleProps<K, D>): {
    collectionProps: {
        currentKey: K | undefined;
        onCurrentKeyChange: any;
        onSelectionChange: any;
        selectedKeys: Set<K> | undefined;
    };
    data: DataState<K, D> | null | undefined;
    dropdownArrowEventHandlers: {
        onClick: () => void;
    };
    dropdownEventHandlers: {
        onAutoDismiss: (event?: Event | undefined) => void;
    };
    dropdownRef: import("preact/hooks").Ref<HTMLDivElement>;
    hasSelectedValuesCount: boolean;
    inputEventHandlers: {
        onInput: (detail: ValueUpdateDetail<string>) => void;
        onKeyDown: (event: KeyboardEvent) => void;
        onKeyUp: (event: KeyboardEvent) => void;
    };
    inputRef: MutableRef<HTMLInputElement>;
    isDropdownOpen: boolean;
    isDropdownSelectedOnlyView: boolean;
    isFocused: boolean;
    isUserFiltering: boolean;
    mainFieldRef: import("preact/hooks").Ref<HTMLDivElement>;
    mouseProps: {
        onMouseDown?: undefined;
    } | {
        onMouseDown: (event: MouseEvent) => void;
    };
    onLoadRange: ((range: import("../UNSAFE_Collection").Range) => void) | undefined;
    searchText: string | undefined;
    selectedValuesCountProps: {
        onKeyDown: (event: KeyboardEvent) => void;
        onKeyUp: (event: KeyboardEvent) => void;
        onMouseDown: (event: MouseEvent) => void;
        onToggle: (detail: SelectedValuesCountToggleDetailType) => void;
    };
    userInput: string | undefined;
};
export {};
