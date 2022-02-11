import { ComponentChildren } from "preact"
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import 'ojs/ojlistdataproviderview';
import * as CommonTypes from 'ojs/ojcommontypes';
import { DataProvider, ItemMetadata } from 'ojs/ojdataprovider';
import { Component, ComponentChild } from 'preact';
import { ExtendGlobalProps, ObservedGlobalProps, Action, PropertyChanged, ReadOnlyPropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
declare type Props<Key, Data> = ObservedGlobalProps<'aria-label' | 'id'> & {
    suggestions?: DataProvider<Key, Data> | null;
    suggestionItemText?: keyof Data | ((itemContext: CommonTypes.ItemContext<Key, Data>) => string);
    placeholder?: string;
    onRawValueChanged?: ReadOnlyPropertyChanged<string | null>;
    value?: string | null;
    onValueChanged?: PropertyChanged<string | null>;
    onOjValueAction?: Action<ValueDetail<Key, Data>>;
    suggestionItemTemplate?: TemplateSlot<SuggestionItemTemplateContext<Key, Data>>;
};
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
    fetching: boolean;
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
    initialRender: boolean;
    oldPropsValue: string | null;
    oldPropsSuggestions: DataProvider<Key, Data> | null;
    fullScreenPopup: boolean;
    mobileFilterInputFocus: boolean;
    mobileFilterInputActive: boolean;
    resetFilterInputSelectionRange: boolean;
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
export declare class InputSearch<K, D> extends Component<ExtendGlobalProps<Props<K, D>>, State<K, D>> {
    static defaultProps: {
        suggestions: any;
        suggestionItemText: string;
        placeholder: string;
        value: any;
    };
    private _KEYS;
    private _rootElem;
    private _dropdownElem;
    private _mainInputElem;
    private _mainInputContainerElem;
    private _mobileFilterInputElem;
    private _dataProvider;
    private _counter;
    private _showIndicatorDelay;
    private _loadingTimer;
    private _queryCount;
    private _resolveFetchBusyState;
    private _suggestionsList;
    private _testPromiseResolve;
    private _uniqueId;
    private _dropdownVerticalOffset;
    constructor(props: Readonly<Props<K, D>>);
    render(props: ExtendGlobalProps<Props<K, D>>, state: State<K, D>): ComponentChild;
    static getDerivedStateFromProps<K, D>(props: Readonly<Props<K, D>>, state: Readonly<State<K, D>>): Partial<State<K, D>> | null;
    private static _initStateFromProps;
    private static _updateStateFromProps;
    componentDidMount(): void;
    private _updateState;
    componentDidUpdate(oldProps: Readonly<Props<K, D>>, oldState: Readonly<State<K, D>>): void;
    componentWillUnmount(): void;
    private _handleMouseenter;
    private _handleMouseleave;
    private _handleFocusin;
    private _handleFocusout;
    private _handleMobileFilterInputFocusin;
    private _handleMobileFilterInputFocusout;
    private _handleMobileFilterClear;
    private _handleMobileDropdownBack;
    private _handleInputChanged;
    focus(): void;
    blur(): void;
    private _handleFocus;
    private _handleBlur;
    private _handleFilterInputKeydownEnter;
    private _handleDesktopMainInputKeydown;
    private _handleMobileFilterInputKeydown;
    private _handleMousedown;
    private _handleFilterInputMousedown;
    private _handleDesktopDropdownMousedown;
    private _handleDropdownMousemove;
    private _handleDropdownMouseleave;
    private _setRootElem;
    private _setDropdownElem;
    private _setMainInputElem;
    private _setMainInputContainerElem;
    private _setSuggestionsList;
    private _setMobileFilterInputElem;
    private _getFilterInputElem;
    private _getDropdownElemId;
    private _getMainInputContainerId;
    private _getMobileFilterContainerId;
    private _getListboxId;
    private _clickAwayHandler;
    private _getDesktopDropdownPosition;
    private _getMobileDropdownPosition;
    private _getMobileDropdownStyle;
    private _usingHandler;
    private _renderEnabled;
    private _renderAriaLiveRegion;
    private _renderDesktopMainTextFieldContainer;
    private _renderMobileMainTextFieldContainer;
    private _renderMobileDropdownFilterField;
    private _renderMobileDropdownBackIcon;
    private _renderMobileDropdownClearIcon;
    private _renderDropdown;
    private _renderDesktopDropdown;
    private _renderMobileDropdown;
    private _renderVPopup;
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
}
// Custom Element interfaces
export interface InputSearchElement<K,D> extends JetElement<InputSearchElementSettableProperties<K, D>>, InputSearchElementSettableProperties<K, D> {
  /**
  * Read-only property used for retrieving the current value from the input field in string form.
  */
  readonly rawValue?: Parameters<Required<Props<K, D>>['onRawValueChanged']>[0];
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
  }>{}
  // tslint:disable-next-line interface-over-type-literal
  type placeholderChanged<K,D> = JetElementCustomEventStrict<InputSearchElement<K,D>["placeholder"]>;
  // tslint:disable-next-line interface-over-type-literal
  type rawValueChanged<K,D> = JetElementCustomEventStrict<InputSearchElement<K,D>["rawValue"]>;
  // tslint:disable-next-line interface-over-type-literal
  type suggestionItemTextChanged<K,D> = JetElementCustomEventStrict<InputSearchElement<K,D>["suggestionItemText"]>;
  // tslint:disable-next-line interface-over-type-literal
  type suggestionsChanged<K,D> = JetElementCustomEventStrict<InputSearchElement<K,D>["suggestions"]>;
  // tslint:disable-next-line interface-over-type-literal
  type valueChanged<K,D> = JetElementCustomEventStrict<InputSearchElement<K,D>["value"]>;
}
export interface InputSearchElementEventMap<K,D> extends HTMLElementEventMap {
  'ojValueAction': InputSearchElement.ojValueAction<K, D>;
  'placeholderChanged': JetElementCustomEventStrict<InputSearchElement<K,D>["placeholder"]>;
  'rawValueChanged': JetElementCustomEventStrict<InputSearchElement<K,D>["rawValue"]>;
  'suggestionItemTextChanged': JetElementCustomEventStrict<InputSearchElement<K,D>["suggestionItemText"]>;
  'suggestionsChanged': JetElementCustomEventStrict<InputSearchElement<K,D>["suggestions"]>;
  'valueChanged': JetElementCustomEventStrict<InputSearchElement<K,D>["value"]>;
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
export interface InputSearchIntrinsicProps extends Partial<Readonly<InputSearchElementSettableProperties<any,any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
  rawValue?: never;
  children?: ComponentChildren;
  onojValueAction?: (value: InputSearchElementEventMap<any,any>['ojValueAction']) => void;
  onplaceholderChanged?: (value: InputSearchElementEventMap<any,any>['placeholderChanged']) => void;
  onrawValueChanged?: (value: InputSearchElementEventMap<any,any>['rawValueChanged']) => void;
  onsuggestionItemTextChanged?: (value: InputSearchElementEventMap<any,any>['suggestionItemTextChanged']) => void;
  onsuggestionsChanged?: (value: InputSearchElementEventMap<any,any>['suggestionsChanged']) => void;
  onvalueChanged?: (value: InputSearchElementEventMap<any,any>['valueChanged']) => void;
}
declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "oj-input-search": InputSearchIntrinsicProps;
    }
  }
}
