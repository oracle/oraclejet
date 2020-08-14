/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from 'ojs/index';
import { GlobalAttributes } from 'ojs/oj-jsx-interfaces';
import 'ojs/ojlistdataproviderview';
import * as CommonTypes from 'ojs/ojcommontypes';
import { DataProvider, ItemMetadata } from 'ojs/ojdataprovider';
import { VComponent } from 'ojs/ojvcomponent';
declare class Props<Key, Data> {
    suggestions?: DataProvider<Key, Data> | null;
    suggestionItemText?: string | ((itemContext: CommonTypes.ItemContext<Key, Data>) => string);
    placeholder?: string;
    rawValue?: string | null;
    value?: string | null;
    'aria-label'?: string;
    onOjValueAction?: VComponent.Action<ValueDetail<Key, Data>>;
    suggestionItemTemplate?: VComponent.Slot<SuggestionItemTemplateContext<Key, Data>>;
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
};
declare type ValueDetail<Key, Data> = {
    value?: string;
    itemContext?: CommonTypes.ItemContext<Key, Data>;
};
interface SuggestionItemTemplateContext<Key, Data> {
    data: Data;
    key: Key;
    metadata: ItemMetadata<Key>;
    index: number;
    searchText?: string | null;
}
export declare class InputSearch<K, D> extends VComponent<Props<K, D>, State<K, D>> {
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
    protected _vprops?: VProps<K, D>;
}
// Custom Element interfaces
export interface InputSearchElement<Key,Data> extends JetElement<InputSearchElementSettableProperties<Key,Data>> {
  /**
   * A short hint that can be displayed before user selects or enters a value.
   */
  placeholder?: Props<Key,Data>['placeholder'];
  /**
   * Read-only property used for retrieving the current value from the input field in string form.
   */
  readonly rawValue?: Props<Key,Data>['rawValue'];
  /**
   * Specifies the text string to render for a suggestion.
   */
  suggestionItemText?: Props<Key,Data>['suggestionItemText'];
  /**
   * The suggestions data for the InputSearch.
   */
  suggestions?: Props<Key,Data>['suggestions'];
  /**
   * The value of the element.
   */
  value?: Props<Key,Data>['value'];
  addEventListener<T extends keyof InputSearchElementEventMap<Key,Data>>(type: T, listener: (this: HTMLElement, ev: InputSearchElementEventMap<Key,Data>[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof InputSearchElementSettableProperties<Key,Data>>(property: T): InputSearchElement<Key,Data>[T];
  getProperty(property: string): any;
  setProperty<T extends keyof InputSearchElementSettableProperties<Key,Data>>(property: T, value: InputSearchElementSettableProperties<Key,Data>[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, InputSearchElementSettableProperties<Key,Data>>): void;
  setProperties(properties: InputSearchElementSettablePropertiesLenient<Key,Data>): void;
}
export namespace InputSearchElement {
  interface ojValueAction<Key,Data> extends CustomEvent<ValueDetail<Key, Data> & {
    [propName: string]: any;
  }>{}
  // tslint:disable-next-line interface-over-type-literal
  type placeholderChanged<Key,Data> = JetElementCustomEvent<InputSearchElement<Key,Data>["placeholder"]>;
  // tslint:disable-next-line interface-over-type-literal
  type rawValueChanged<Key,Data> = JetElementCustomEvent<InputSearchElement<Key,Data>["rawValue"]>;
  // tslint:disable-next-line interface-over-type-literal
  type suggestionItemTextChanged<Key,Data> = JetElementCustomEvent<InputSearchElement<Key,Data>["suggestionItemText"]>;
  // tslint:disable-next-line interface-over-type-literal
  type suggestionsChanged<Key,Data> = JetElementCustomEvent<InputSearchElement<Key,Data>["suggestions"]>;
  // tslint:disable-next-line interface-over-type-literal
  type valueChanged<Key,Data> = JetElementCustomEvent<InputSearchElement<Key,Data>["value"]>;
}
export interface InputSearchElementEventMap<Key,Data> extends HTMLElementEventMap {
  'ojValueAction': InputSearchElement.ojValueAction<Key,Data>;
  'placeholderChanged': JetElementCustomEvent<InputSearchElement<Key,Data>["placeholder"]>;
  'rawValueChanged': JetElementCustomEvent<InputSearchElement<Key,Data>["rawValue"]>;
  'suggestionItemTextChanged': JetElementCustomEvent<InputSearchElement<Key,Data>["suggestionItemText"]>;
  'suggestionsChanged': JetElementCustomEvent<InputSearchElement<Key,Data>["suggestions"]>;
  'valueChanged': JetElementCustomEvent<InputSearchElement<Key,Data>["value"]>;
}
export interface InputSearchElementSettableProperties<Key,Data> extends JetSettableProperties {
  /**
   * A short hint that can be displayed before user selects or enters a value.
   */
  placeholder?: Props<Key,Data>['placeholder'];
  /**
   * Read-only property used for retrieving the current value from the input field in string form.
   */
  readonly rawValue?: Props<Key,Data>['rawValue'];
  /**
   * Specifies the text string to render for a suggestion.
   */
  suggestionItemText?: Props<Key,Data>['suggestionItemText'];
  /**
   * The suggestions data for the InputSearch.
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
export declare type ojInputSearch<Key,Data> = InputSearchElement<Key,Data>;
export declare type ojInputSearchEventMap<Key,Data> = InputSearchElementEventMap<Key,Data>;
export declare type ojInputSearchSettableProperties<Key,Data> = InputSearchElementSettableProperties<Key,Data>;
export declare type ojInputSearchSettablePropertiesLenient<Key,Data> = InputSearchElementSettablePropertiesLenient<Key,Data>;
export interface InputSearchProperties<Key,Data> extends Partial<InputSearchElementSettableProperties<Key,Data>>, GlobalAttributes {}
export interface VProps<Key,Data> extends Props<Key,Data>, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-input-search": InputSearchProperties<any,any>;
    }
  }
}
