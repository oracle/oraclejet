/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from 'ojs/index';
import { GlobalAttributes } from 'ojs/oj-jsx-interfaces';
import 'ojs/ojlistdataproviderview';
import * as CommonTypes from 'ojs/ojcommontypes';
import { DataProvider, ItemMetadata } from 'ojs/ojdataprovider';
import { ElementVComponent } from 'ojs/ojvcomponent-element';
declare class Props<Key, Data> {
    suggestions?: DataProvider<Key, Data> | null;
    suggestionItemText?: keyof Data | ((itemContext: CommonTypes.ItemContext<Key, Data>) => string);
    placeholder?: string;
    rawValue?: string | null;
    onRawValueChanged?: ElementVComponent.PropertyChanged<string | null>;
    value?: string | null;
    onValueChanged?: ElementVComponent.PropertyChanged<string | null>;
    'aria-label'?: string;
    onOjValueAction?: ElementVComponent.Action<ValueDetail<Key, Data>>;
    suggestionItemTemplate?: ElementVComponent.TemplateSlot<SuggestionItemTemplateContext<Key, Data>>;
}
declare type State<Key, Data> = {
    dropdownOpen: boolean;
    dropdownAbove: boolean;
    focus: boolean;
    hover: boolean;
    active: boolean;
    displayValue: string;
    lastFetchedFilterText: string;
    fetchedData: Array<CommonTypes.ItemContext<Key, Data>>;
    labelIds: Array<string>;
    fetchedInitial: boolean;
    loading: boolean;
    focusedSuggestionIndex: number;
    activeDescendantId: string;
    scrollFocusedSuggestionIntoView: string;
    filterText: string;
    actionDetail: CommonTypes.ItemContext<Key, Data>;
    valueSubmitted: boolean;
    lastEventType: string;
    showAutocompleteText: boolean;
    autocompleteFloatingText: string;
};
declare type ValueDetail<Key, Data> = {
    value?: string;
    itemContext?: CommonTypes.ItemContext<Key, Data>;
    previousValue?: string;
};
interface SuggestionItemTemplateContext<Key, Data> {
    data: Data;
    key: Key;
    metadata: ItemMetadata<Key>;
    index: number;
    searchText?: string | null;
}
export declare class InputSearch<K, D> extends ElementVComponent<Props<K, D>, State<K, D>> {
    private _CLASS_NAMES;
    private _KEYS;
    private _rootElem;
    private _dropdownElem;
    private _inputElem;
    private _inputContainerElem;
    private _isComposing;
    private _dataProvider;
    private _counter;
    private _showIndicatorDelay;
    private _loadingTimer;
    private _queryCount;
    private _resolveFetchBusyState;
    private _renderedSuggestions;
    private _testPromiseResolve;
    constructor(props: Readonly<Props<K, D>>);
    protected render(): any;
    protected static initStateFromProps<K, D>(props: Readonly<Props<K, D>>, state: Readonly<State<K, D>>): Partial<State<K, D>> | null;
    protected static updateStateFromProps<K, D>(props: Readonly<Props<K, D>>, state: Readonly<State<K, D>>, oldProps: Readonly<Props<K, D>>): Partial<State<K, D>> | null;
    protected mounted(): void;
    protected updated(oldProps: Readonly<Props<K, D>>, oldState: Readonly<State<K, D>>): void;
    protected unmounted(): void;
    private _handleMouseenter;
    private _handleMouseleave;
    private _handleFocusin;
    private _handleFocusout;
    private _handleCompositionstart;
    private _handleCompositionend;
    private _handleInput;
    focus(): void;
    blur(): void;
    private _handleFocus;
    private _handleBlur;
    private _handleKeydown;
    private _handleMousedown;
    private _handleDropdownMousedown;
    private _handleDropdownMousemove;
    private _handleDropdownMouseleave;
    private _setRootElem;
    private _setDropdownElem;
    private _setInputElem;
    private _setInputContainerElem;
    private _setRenderedSuggestion;
    private _getRenderedSuggestionsCount;
    private _getDropdownElemId;
    private _getInputContainerId;
    private _getListboxId;
    private _clickAwayHandler;
    private _getDropdownPosition;
    private _usingHandler;
    private _renderEnabled;
    private _renderDropdown;
    private _renderAutocompleteFloatingText;
    private _scrollSuggestionIntoView;
    private _generateId;
    private _handleDataProviderRefreshEventListener;
    private _fetchData;
    private _renderDropdownSkeleton;
    private _renderDropdownSuggestions;
    private _handleSuggestionAction;
    private _addBusyState;
    private _isDataProvider;
    private _wrapDataProviderIfNeeded;
    private _addDataProviderEventListeners;
    private _removeDataProviderEventListeners;
    private _resolveFetching;
    private static _formatItemText;
    private _testChangeValue;
    private _testChangeValueByKey;
    protected _vprops?: VProps<K, D>;
}
// Custom Element interfaces
export interface InputSearchElement<K,D> extends JetElement<InputSearchElementSettableProperties<K, D>>, InputSearchElementSettableProperties<K, D> {
  /**
  * Read-only property used for retrieving the current value from the input field in string form.
  */
  readonly rawValue?: Props<K, D>['rawValue'];
  addEventListener<T extends keyof InputSearchElementEventMap<K,D>>(type: T, listener: (this: HTMLElement, ev: InputSearchElementEventMap<K,D>[T]) => any, options?: (boolean|AddEventListenerOptions)): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean|AddEventListenerOptions)): void;
  getProperty<T extends keyof InputSearchElementSettableProperties<K, D>>(property: T): InputSearchElement<K,D>[T];
  getProperty(property: string): any;
  setProperty<T extends keyof InputSearchElementSettableProperties<K, D>>(property: T, value: InputSearchElementSettableProperties<K, D>[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, InputSearchElementSettableProperties<K, D>>): void;
  setProperties(properties: InputSearchElementSettablePropertiesLenient<K, D>): void;
  _testChangeValue: InputSearch<K,D>['_testChangeValue'];
  _testChangeValueByKey: InputSearch<K,D>['_testChangeValueByKey'];
  blur: InputSearch<K,D>['blur'];
  focus: InputSearch<K,D>['focus'];
}
export namespace InputSearchElement {
  interface ojValueAction<Key,Data> extends CustomEvent<ValueDetail<Key,Data> & {
    [propName: string]: any;
  }>{}
  // tslint:disable-next-line interface-over-type-literal
  type placeholderChanged<K,D> = JetElementCustomEvent<InputSearchElement<K,D>["placeholder"]>;
  // tslint:disable-next-line interface-over-type-literal
  type rawValueChanged<K,D> = JetElementCustomEvent<InputSearchElement<K,D>["rawValue"]>;
  // tslint:disable-next-line interface-over-type-literal
  type suggestionItemTextChanged<K,D> = JetElementCustomEvent<InputSearchElement<K,D>["suggestionItemText"]>;
  // tslint:disable-next-line interface-over-type-literal
  type suggestionsChanged<K,D> = JetElementCustomEvent<InputSearchElement<K,D>["suggestions"]>;
  // tslint:disable-next-line interface-over-type-literal
  type valueChanged<K,D> = JetElementCustomEvent<InputSearchElement<K,D>["value"]>;
}
export interface InputSearchElementEventMap<K,D> extends HTMLElementEventMap {
  'ojValueAction': InputSearchElement.ojValueAction<K, D>;
  'placeholderChanged': JetElementCustomEvent<InputSearchElement<K,D>["placeholder"]>;
  'rawValueChanged': JetElementCustomEvent<InputSearchElement<K,D>["rawValue"]>;
  'suggestionItemTextChanged': JetElementCustomEvent<InputSearchElement<K,D>["suggestionItemText"]>;
  'suggestionsChanged': JetElementCustomEvent<InputSearchElement<K,D>["suggestions"]>;
  'valueChanged': JetElementCustomEvent<InputSearchElement<K,D>["value"]>;
}
export interface InputSearchElementSettableProperties<Key,Data> extends JetSettableProperties {
  /**
  * A short hint that can be displayed before user selects or enters a value.
  */
  placeholder?: Props<Key,Data>['placeholder'];
  /**
  * Specifies the text string to render for a suggestion.
  */
  suggestionItemText?: Props<Key,Data>['suggestionItemText'];
  /**
  * Data for the InputSearch suggestions.
  */
  suggestions?: Props<Key,Data>['suggestions'];
  /**
  * The value of the element.
  */
  value?: Props<Key,Data>['value'];
}
export interface InputSearchElementSettablePropertiesLenient<Key,Data> extends Partial<InputSearchElementSettableProperties<Key,Data>> {
  [key: string]: any;
}
export interface InputSearchProperties<Key,Data> extends Partial<InputSearchElementSettableProperties<Key,Data>>, GlobalAttributes {
  rawValue?: never;
}
export interface VProps<Key,Data> extends Props<Key,Data>, GlobalAttributes {
  rawValue?: never;
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-input-search": InputSearchProperties<any,any>;
    }
  }
}
