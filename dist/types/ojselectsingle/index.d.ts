/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import CommonTypes = require('../ojcommontypes');
import { KeySet } from '../ojkeyset';
import { DataProvider, ItemMetadata } from '../ojdataprovider';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojSelectSingle<V, D> extends editableValue<V, ojSelectSingleSettableProperties<V, D>> {
    data: DataProvider<V, D>;
    displayOptions: {
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
    };
    itemText: keyof D | ((itemContext: CommonTypes.ItemContext<V, D>) => string);
    labelledBy: string | null;
    placeholder: string;
    readOnly: boolean;
    required: boolean;
    value: V | null;
    valueItem: CommonTypes.ItemContext<V, D>;
    virtualKeyboard: 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
    translations: {
        cancel?: string;
        labelAccClearValue?: string;
        labelAccOpenDropdown?: string;
        multipleMatchesFound?: string;
        nOrMoreMatchesFound?: string;
        noMatchesFound?: string;
        noResultsLine1?: string;
        noResultsLine2?: string;
        oneMatchFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojSelectSingleEventMap<V, D>>(type: T, listener: (this: HTMLElement, ev: ojSelectSingleEventMap<V, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojSelectSingleSettableProperties<V, D>>(property: T): ojSelectSingle<V, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSelectSingleSettableProperties<V, D>>(property: T, value: ojSelectSingleSettableProperties<V, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSelectSingleSettableProperties<V, D>>): void;
    setProperties(properties: ojSelectSingleSettablePropertiesLenient<V, D>): void;
    refresh(): void;
    validate(): Promise<any>;
}
export namespace ojSelectSingle {
    interface ojAnimateEnd extends CustomEvent<{
        action: string;
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: string;
        element: Element;
        endCallback: (() => void);
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemTextChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["itemText"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readOnlyChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["readOnly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueItemChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["valueItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type virtualKeyboardChanged<V, D> = JetElementCustomEvent<ojSelectSingle<V, D>["virtualKeyboard"]>;
    // tslint:disable-next-line interface-over-type-literal
    type CollectionTemplateContext<V, D> = {
        data: DataProvider<V, D>;
        searchText: string;
        selectedItem: CommonTypes.ItemContext<V, D>;
        selected: KeySet<V>;
        currentRow: {
            rowKey: V;
        };
        handleRowAction: ((event: Event, context: CommonTypes.ItemContext<V, D>) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<V, D> = {
        componentElement: Element;
        data: D;
        index: number;
        key: V;
        metadata: ItemMetadata<V>;
        searchText: string;
        depth: number;
        leaf: boolean;
        parentKey: V;
    };
}
export interface ojSelectSingleEventMap<V, D> extends editableValueEventMap<V, ojSelectSingleSettableProperties<V, D>> {
    'ojAnimateEnd': ojSelectSingle.ojAnimateEnd;
    'ojAnimateStart': ojSelectSingle.ojAnimateStart;
    'dataChanged': JetElementCustomEvent<ojSelectSingle<V, D>["data"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojSelectSingle<V, D>["displayOptions"]>;
    'itemTextChanged': JetElementCustomEvent<ojSelectSingle<V, D>["itemText"]>;
    'labelledByChanged': JetElementCustomEvent<ojSelectSingle<V, D>["labelledBy"]>;
    'placeholderChanged': JetElementCustomEvent<ojSelectSingle<V, D>["placeholder"]>;
    'readOnlyChanged': JetElementCustomEvent<ojSelectSingle<V, D>["readOnly"]>;
    'requiredChanged': JetElementCustomEvent<ojSelectSingle<V, D>["required"]>;
    'valueChanged': JetElementCustomEvent<ojSelectSingle<V, D>["value"]>;
    'valueItemChanged': JetElementCustomEvent<ojSelectSingle<V, D>["valueItem"]>;
    'virtualKeyboardChanged': JetElementCustomEvent<ojSelectSingle<V, D>["virtualKeyboard"]>;
}
export interface ojSelectSingleSettableProperties<V, D> extends editableValueSettableProperties<V> {
    data: DataProvider<V, D>;
    displayOptions: {
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
    };
    itemText: keyof D | ((itemContext: CommonTypes.ItemContext<V, D>) => string);
    labelledBy: string | null;
    placeholder: string;
    readOnly: boolean;
    required: boolean;
    value: V | null;
    valueItem: CommonTypes.ItemContext<V, D>;
    virtualKeyboard: 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
    translations: {
        cancel?: string;
        labelAccClearValue?: string;
        labelAccOpenDropdown?: string;
        multipleMatchesFound?: string;
        nOrMoreMatchesFound?: string;
        noMatchesFound?: string;
        noResultsLine1?: string;
        noResultsLine2?: string;
        oneMatchFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface ojSelectSingleSettablePropertiesLenient<V, D> extends Partial<ojSelectSingleSettableProperties<V, D>> {
    [key: string]: any;
}
