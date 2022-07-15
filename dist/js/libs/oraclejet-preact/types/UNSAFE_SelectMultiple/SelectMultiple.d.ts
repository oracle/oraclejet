/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps, Ref } from 'preact';
import { FocusableHandle } from '../hooks/UNSAFE_useFocusableTextField';
import { DataState } from '../UNSAFE_Collection';
import { ListView } from '../UNSAFE_ListView';
import { TextField, TextFieldInput } from '../UNSAFE_TextField';
import { InlineUserAssistance } from '../UNSAFE_UserAssistance';
import { Item } from '../utils/UNSAFE_dataProvider';
import { Size } from '../utils/UNSAFE_size';
import { ValueUpdateDetail } from '../utils/UNSAFE_valueUpdateDetail';
import { ItemTextType } from './itemTextUtils';
declare type PickedPropsFromTextField = Pick<ComponentProps<typeof TextField>, 'id'>;
declare type PickedPropsFromTextFieldInput = Pick<ComponentProps<typeof TextFieldInput>, 'placeholder' | 'isRequired' | 'textAlign'>;
declare type PickedPropsFromInlineUserAssistance = Pick<ComponentProps<typeof InlineUserAssistance>, 'assistiveText' | 'helpSourceLink' | 'helpSourceText' | 'isRequiredShown' | 'messages' | 'userAssistanceDensity'>;
declare type Props<K extends string | number, D extends Record<string, any>> = PickedPropsFromTextField & PickedPropsFromTextFieldInput & PickedPropsFromInlineUserAssistance & {
    /**
     * Specifies data for the dropdown list.
     */
    data?: DataState<K, D> | null;
    /**
     * Specifies whether the component is disabled.
     */
    isDisabled?: boolean;
    /**
     * Specifies whether the component is waiting for valueItems to load.
     * While loading, SelectMultiple will show the progressive loading indicator in the text field.
     */
    isLoading?: boolean;
    /**
     * Specifies whether the component is readonly.
     */
    isReadonly?: boolean;
    /**
     * Specifies how to get the text string to render for a data item.
     * This property can be set to either:
     * 1) a string that specifies the name of a top level data attribute to render as text, or
     * 2) a callback function that takes a properties object and returns the text string to
     * display.
     *
     * This text will be rendered for the selected values of the component. It will also be
     * rendered for each data item in the dropdown if no itemRenderer or collectionRenderer is
     * provided. When rendered for the dropdown items, default matching search term highlighting
     * will still be applied.
     */
    itemText: ItemTextType<K, D>;
    /**
     * Specifies the label.
     */
    label?: string;
    /**
     * Specifies where the label is positioned.
     */
    labelEdge?: 'inside' | 'start' | 'top' | 'none';
    /**
     * Specifies the width of the label when labelEdge is 'start'
     */
    labelStartWidth?: Size;
    /**
     * Specifies the keys, data, and optional metadata for the selected values.
     */
    valueItems?: Item<K, D>[];
    /**
     * Specifies the type of soft keyboard to use on mobile.  Has no effect on desktop.
     */
    virtualKeyboard?: 'auto' | 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
    /**
     * Callback invoked when the selected values are committed.
     */
    onCommit: (detail: ValueUpdateDetail<Set<K>>) => void;
    /**
     * Callback function to trigger loading data for the dropdown list, which may or may not be
     * filtered by user entered text.
     */
    onFilter?: ({ searchText }: {
        searchText?: string;
    }) => void;
    /**
     * Callback function to handle when the viewport of the dropdown list has changed,
     * including the case where the user scrolls to the end of the list and there are more
     * items to load.
     * The function should set a new DataState on the component for the specified range.
     */
    onLoadRange?: ComponentProps<typeof ListView>['onLoadRange'];
};
export declare const SelectMultiple: import("preact").FunctionalComponent<Omit<Props<string | number, Record<string, any>>, "ref"> & {
    ref?: Ref<FocusableHandle> | undefined;
}>;
export {};
