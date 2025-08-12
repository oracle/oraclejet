import 'ojs/ojlistdataproviderview';
import * as ojcommontypes from 'ojs/ojcommontypes';
import { DataProvider, ItemMetadata } from 'ojs/ojdataprovider';
import { Component, ComponentChild } from 'preact';
import { ExtendGlobalProps, ObservedGlobalProps, Action, PropertyChanged, ReadOnlyPropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
type Props<Key, Data> = ObservedGlobalProps<'aria-label' | 'id'> & {
    /**
     * @description
     * Data for the InputSearch suggestions.  This data is used to populate the list of suggestions
     * in the dropdown.  When a user selects a suggestion from the dropdown, the ojValueAction event
     * will contain the data for that suggestion.  If no suggestions data is provided, then the
     * dropdown will not be shown. Note that the InputSearch only shows up to a maximum of 12 suggestions
     * in the dropdown even if there are more suggestions available in the data.
     *
     * <p>Note that the <code class="prettyprint">suggestion-item-text</code> attribute allows for
     * customizing the rendering of each suggestion.  If it is not specified, then the component will
     * attempt to render as text the 'label' field in the suggestion by default.</p>
     *
     * @ojmetadata description "Data for the InputSearch suggestions."
     * @ojmetadata displayName "Suggestions"
     * @ojmetadata help "#suggestions"
     * @ojmetadata minCapabilities {filter: {textFilter: true}}
     * @ojmetadata extension {
     *  "webelement": {
     *    "exceptionStatus": [
     *      {
     *        "type": "unsupported",
     *        "since": "11.0.0",
     *        "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
     *      }
     *    ]
     *  }
     * }
     */
    suggestions?: DataProvider<Key, Data> | null;
    /**
     * @description
     * Specifies the text string to render for a suggestion.
     * This attribute can be set to either:
     * <ul>
     * <li>a string that specifies the name of a top level data field to render as text, or</li>
     * <li>a callback function that takes a context object and returns the text string to
     * display</li>
     * </ul>
     *
     * <p>By default, the component will attempt to render a 'label' data field as text.</p>
     *
     * <p>This text will be rendered for the selected value of the component.  It will also be
     * rendered for each suggestion in the dropdown if no suggestionItemTemplate is provided.
     * When rendered for the dropdown suggestions, default matching search term highlighting
     * will still be applied.</p>
     *
     * @ojmetadata description "Specifies the text string to render for a suggestion."
     * @ojmetadata displayName "Suggestion Item Text"
     * @ojmetadata help "#suggestionItemText"
     */
    suggestionItemText?: keyof Data | ((itemContext: ojcommontypes.ItemContext<Key, Data>) => string);
    /**
     * @description
     * The placeholder text to set on the element. The placeholder specifies a short hint that can
     * be displayed before the user selects or enters a value.
     *
     * @ojmetadata description "A short hint that can be displayed before user selects or enters a value."
     * @ojmetadata displayName "Placeholder"
     * @ojmetadata help "#placeholder"
     * @ojmetadata translatable
     */
    placeholder?: string;
    /**
     * @description
     * <p>The <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current value from the input field in string form.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
     * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2',
     * ..., and finally '1,200'. Then when the user blurs or presses
     * Enter the <code class="prettyprint">value</code> property gets updated.
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     *
     * @ojmetadata description "Read-only property used for retrieving the current value from the input field in string form."
     * @ojmetadata displayName "Raw Value"
     * @ojmetadata help "#rawValue"
     * @ojmetadata value null
     */
    onRawValueChanged?: ReadOnlyPropertyChanged<string | null>;
    /**
     * @ojmetadata description "The value of the element."
     * @ojmetadata displayName "Value"
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#value"
     */
    value?: string | null;
    onValueChanged?: PropertyChanged<string | null>;
    /**
     * @description
     * Triggered when search text is submitted by the user, even if the text hasn't changed.
     * Submission is triggered by the enter key, either to directly submit text or
     * to select a highlighted value from the suggestions dropdown, or by selecting
     * a value from the dropdown using a mouse or touch gesture.  Note that the
     * <a href="#value">value</a> property is guaranteed to be up-to-date at the time the
     * ojValueAction event is dispatched.
     *
     * @ojmetadata description "Event triggered when search text is submitted by the user, even if the text hasn't changed."
     * @ojmetadata help "#event:valueAction"
     */
    onOjValueAction?: Action<ValueDetail<Key, Data>>;
    /**
     * @description
     * <p>The <code class="prettyprint">suggestionItemTemplate</code> slot is used to specify the
     * template for rendering each suggestion in the dropdown list.
     * The slot must be a &lt;template> element.
     * <p>When the template is executed for each suggestion, it will have access to the binding context
     * containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current suggestion. (See the table
     * below for a list of properties available on $current)</li>
     *  <li>alias - if the data-oj-as attribute was specified on the template, the value will be used
     * to provide an application-named alias for $current.</li>
     * </ul>
     * <p>If no <code class="prettyprint">suggestionItemTemplate</code> is specified, the component
     * will render based on the value of the <code class="prettyprint">suggestionItemText</code>
     * property.</p>
     *
     * @ojmetadata description "The suggestionItemTemplate slot is used to specify the template for rendering each suggestion in the dropdown list."
     * @ojmetadata help "#suggestionItemTemplate"
     * @ojmetadata maxItems 1
     */
    suggestionItemTemplate?: TemplateSlot<SuggestionItemTemplateContext<Key, Data>>;
    /**
     * @ojmetadata displayName "Autocomplete"
     * @ojmetadata description "Specifies whether the component will enable the autocomplete type ahead feature."
     * @ojmetadata help "#autocomplete"
     */
    autocomplete?: 'on' | 'off';
};
type State<Key, Data> = {
    dropdownOpen: boolean;
    dropdownAbove: boolean;
    focus: boolean;
    hover: boolean;
    active: boolean;
    displayValue: string;
    lastFetchedFilterText: string;
    fetchedData: Array<ojcommontypes.ItemContext<Key, Data>>;
    labelIds: Array<string>;
    fetchedInitial: boolean;
    fetching: boolean;
    loading: boolean;
    focusedSuggestionIndex: number;
    activeDescendantId: string;
    scrollFocusedSuggestionIntoView: string;
    filterText: string;
    actionDetail: ojcommontypes.ItemContext<Key, Data>;
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
type ValueDetail<Key, Data> = {
    /**
     * @ojmetadata description "The search text."
     */
    value?: string;
    /**
     * @ojmetadata description "The data provider context for the search text, if available."
     */
    itemContext?: ojcommontypes.ItemContext<Key, Data>;
    /**
     * @ojmetadata description "The previous search text."
     */
    previousValue?: string;
};
interface SuggestionItemTemplateContext<Key, Data> {
    /**
     * @ojmetadata description "The data for the current suggestion"
     */
    data: Data;
    /**
     * @ojmetadata description "The key of the current suggestion"
     */
    key: Key;
    /**
     * @ojmetadata description "The metadata for the current suggestion"
     */
    metadata: ItemMetadata<Key>;
    /**
     * @ojmetadata description "The zero-based index of the current suggestion"
     */
    index: number;
    /**
     * @ojmetadata description "The search text entered by the user"
     */
    searchText?: string | null;
}
/**
 * @classdesc
 * <h3 id="inputSearchOverview-section">
 *   JET Input Search
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputSearchOverview-section"></a>
 * </h3>
 * <p>Description: JET Input Search provides support for entering search text.</p>
 *
 * <p>JET Input Search displays an input field that a user can type into, as well as an optional dropdown list of suggestions.</p>
 *
 * An Input Search that shows only an input field can be created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-input-search aria-label='Search'>
 * &lt;/oj-input-search>
 * </code></pre>
 *
 * <p>An Input Search that shows an input field with a dropdown list of suggestions can be
 * created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-input-search suggestions='[[dataProvider]]'
 *                  aria-label='Search'>
 * &lt;/oj-input-search>
 * </code></pre>
 *
 * <p>Input Search will only show up to a maximum of 12 suggestions in the dropdown list.  The
 * list could show most recently used searches or high confidence suggested results.  It is
 * intended to help the user enter search text in order to conduct a subsequent search.  It is up
 * to the application to conduct the search and display results elsewhere on the page.</p>
 *
 * <p>An application should register a listener for the ojValueAction event in order to be
 * notified when the user submits search text.  The application should then conduct the search and
 * display the results.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-input-search on-oj-value-action='[[handleValueAction]]'
 *                  aria-label='Search'>
 * &lt;/oj-input-search>
 * </code></pre>
 *
 * <p>If an application provides a separate search button, then it may choose to ignore
 * ojValueAction events and instead bind to the value.  When the search button is clicked, the
 * application would conduct a search with the currently set value.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-input-search value='{{searchText}}'
 *                  aria-label='Search'>
 * &lt;/oj-input-search>
 * &lt;oj-button on-oj-action='[[conductSearch]]'>
 *   Search
 * &lt;/oj-button>
 * </code></pre>
 *
 * <p>The <a href="#value">value</a> property is guaranteed to be up-to-date at the time the
 * <a href="#event:valueAction">ojValueAction</a> event is dispatched.</p>
 *
 * <p><b>Note:</b>  Input Search is not a full-fledged form control and does not support some of
 * the common features of form controls.  For example, it is not expected to be used in an
 * <code class="prettyprint">oj-form-layout</code>, it does not support a label, and it does not
 * support assistive text.</p>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Input Field</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td> If the drop down is not open, expand the drop down list. Otherwise, close the drop down list.</td>
 *     </tr>
 *   </tbody>
 *  </table>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Input field</td>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Set the input text as the value.</td>
 *     </tr>
 *     <tr>
 *      <td>Input field</td>
 *       <td><kbd>UpArrow or DownArrow</kbd></td>
 *       <td> If the drop down is not open, expand the drop down list.</td>
 *     </tr>
 *     <tr>
 *      <td>Input field</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td> Collapse the drop down list. If the drop down is already closed, do nothing.</td>
 *     </tr>
 *     <tr>
 *      <td>Input field</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the Input Search.</td>
 *     </tr>
 *   </tbody>
 *  </table>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to set an aria-label on the Input Search.
 * </p>
 * @typeparam {object} K Type of key of the dataprovider
 * @typeparam {object} D Type of data from the dataprovider
 * @ojmetadata description "An Input Search is an input field that the user can type search text into."
 * @ojmetadata displayName "Input Search"
 * @ojmetadata main "ojs/ojinputsearch"
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-input-search",
 *     "uxSpecs": ["input-search"]
 *   },
 *   "themes": {
 *     "unsupportedThemes": ["Alta"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojinputsearch",
 *     "defaultColumns": "6",
 *     "minColumns": "2"
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojInputSearch.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "placeholder"
 *     ]
 *   }
 * ]
 * @ojmetadata styleClasses [
 *   {
 *     "name": "oj-input-search-hero",
 *     "kind": "class",
 *     "displayName": "Hero Search",
 *     "description": "Render a larger search field that is more prominent on the page",
 *     "help": "#oj-input-search-hero",
 *     "extension": {
 *         "jet": {
 *            "example": "&lt;oj-input-search class=\"oj-input-search-hero\">\n &lt;!-- Content -->\n &lt;/oj-input-search>"
 *          }
 *      }
 *   },
 *   {
 *     "name": "form-control-max-width",
 *     "kind": "set",
 *     "displayName": "Max Width",
 *     "description": "In the Redwood theme the default max width of a text field is 100%.  These max width convenience classes are available to create a medium or small field.<br>  The class is applied to the root element.",
 *     "help": "#form-control-max-width",
 *     "styleRelation": "exclusive",
 *     "styleItems": [
 *       {
 *         "name": "oj-form-control-max-width-sm",
 *         "kind": "class",
 *         "displayName": "Small",
 *         "description": "Sets the max width for a small field."
 *       },
 *       {
 *         "name": "oj-form-control-max-width-md",
 *         "kind": "class",
 *         "displayName": "Medium",
 *         "description": "Sets the max width for a medium field."
 *       }
 *     ]
 *   },
 *   {
 *     "name": "form-control-width",
 *     "kind": "set",
 *     "displayName": "Width",
 *     "description": "In the Redwood theme the default width of a text field is 100%.  These width convenience classes are available to create a medium or small field.<br>  The class is applied to the root element.",
 *     "help": "#form-control-width",
 *     "styleRelation": "exclusive",
 *     "styleItems": [
 *       {
 *         "name": "oj-form-control-width-sm",
 *         "kind": "class",
 *         "displayName": "Small",
 *         "description": "Sets the width for a small field."
 *       },
 *       {
 *         "name": "oj-form-control-width-md",
 *         "kind": "class",
 *         "displayName": "Medium",
 *         "description": "Sets the width for a medium field."
 *       }
 *     ]
 *   }
 * ]
 * @ojmetadata since "9.0.0"
 */
/**
 * This export corresponds to the InputSearch Preact component. For the oj-input-search custom element, import InputSearchElement instead.
 */
export declare class InputSearch<K, D> extends Component<ExtendGlobalProps<Props<K, D>>, State<K, D>> {
    static defaultProps: {
        autocomplete: string;
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
    private _abortController?;
    constructor(props: Readonly<Props<K, D>>);
    render(props: ExtendGlobalProps<Props<K, D>>, state: State<K, D>): ComponentChild;
    static getDerivedStateFromProps<K, D>(props: Readonly<Props<K, D>>, state: Readonly<State<K, D>>): Partial<State<K, D>> | null;
    private static _initStateFromProps;
    private static _updateStateFromProps;
    componentDidMount(): void;
    private _updateState;
    componentDidUpdate(oldProps: Readonly<Props<K, D>>, oldState: Readonly<State<K, D>>): void;
    componentWillUnmount(): void;
    /**
     * mouseenter event listener
     */
    private _handleMouseenter;
    /**
     * mouseleave event listener
     */
    private _handleMouseleave;
    /**
     * focusin event listener
     */
    private _handleFocusin;
    /**
     * focusout event listener
     */
    private _handleFocusout;
    /**
     * focusin event listener
     */
    private _handleMobileFilterInputFocusin;
    /**
     * focusout event listener
     */
    private _handleMobileFilterInputFocusout;
    private _handleMobileFilterClear;
    private _handleMobileDropdownBack;
    /**
     * Invoked when the input event happens
     */
    private _handleInputChanged;
    /**
     * @ignore
     */
    focus(): void;
    /**
     * @ignore
     */
    blur(): void;
    /**
     * Invoked when focus is triggered on this.element
     */
    private _handleFocus;
    /**
     * Invoked when blur is triggered on this.element
     */
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
    /**
     * @ojmetadata visible false
     */
    private _testChangeValue;
    /**
     * @ojmetadata visible false
     */
    private _testChangeValueByKey;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-input-search custom element. For the InputSearch Preact component, import InputSearch instead.
 */
export interface InputSearchElement<K, D> extends JetElement<InputSearchElementSettableProperties<K, D>>, InputSearchElementSettableProperties<K, D> {
    /**
     * <p>The <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current value from the input field in string form.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
     * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2',
     * ..., and finally '1,200'. Then when the user blurs or presses
     * Enter the <code class="prettyprint">value</code> property gets updated.
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     */
    readonly rawValue?: Parameters<Required<Props<K, D>>['onRawValueChanged']>[0];
    addEventListener<T extends keyof InputSearchElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: InputSearchElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof InputSearchElementSettableProperties<K, D>>(property: T): InputSearchElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof InputSearchElementSettableProperties<K, D>>(property: T, value: InputSearchElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, InputSearchElementSettableProperties<K, D>>): void;
    setProperties(properties: InputSearchElementSettablePropertiesLenient<K, D>): void;
    _testChangeValue: InputSearch<K, D>['_testChangeValue'];
    _testChangeValueByKey: InputSearch<K, D>['_testChangeValueByKey'];
    blur: InputSearch<K, D>['blur'];
    focus: InputSearch<K, D>['focus'];
}
declare namespace _InputSearchElementTypes {
    type _SuggestionItemTemplateContext<K, D> = SuggestionItemTemplateContext<K, D>;
}
export namespace InputSearchElement {
    interface ojValueAction<K, D> extends CustomEvent<ValueDetail<K, D> & {}> {
    }
    type autocompleteChanged<K, D> = JetElementCustomEventStrict<InputSearchElement<K, D>['autocomplete']>;
    type placeholderChanged<K, D> = JetElementCustomEventStrict<InputSearchElement<K, D>['placeholder']>;
    type rawValueChanged<K, D> = JetElementCustomEventStrict<InputSearchElement<K, D>['rawValue']>;
    type suggestionItemTextChanged<K, D> = JetElementCustomEventStrict<InputSearchElement<K, D>['suggestionItemText']>;
    type suggestionsChanged<K, D> = JetElementCustomEventStrict<InputSearchElement<K, D>['suggestions']>;
    type valueChanged<K, D> = JetElementCustomEventStrict<InputSearchElement<K, D>['value']>;
    type SuggestionItemTemplateContext<K, D> = _InputSearchElementTypes._SuggestionItemTemplateContext<K, D>;
    type RenderSuggestionItemTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<SuggestionItemTemplateContext<K, D>>;
}
export interface InputSearchElementEventMap<K, D> extends HTMLElementEventMap {
    'ojValueAction': InputSearchElement.ojValueAction<K, D>;
    'autocompleteChanged': JetElementCustomEventStrict<InputSearchElement<K, D>['autocomplete']>;
    'placeholderChanged': JetElementCustomEventStrict<InputSearchElement<K, D>['placeholder']>;
    'rawValueChanged': JetElementCustomEventStrict<InputSearchElement<K, D>['rawValue']>;
    'suggestionItemTextChanged': JetElementCustomEventStrict<InputSearchElement<K, D>['suggestionItemText']>;
    'suggestionsChanged': JetElementCustomEventStrict<InputSearchElement<K, D>['suggestions']>;
    'valueChanged': JetElementCustomEventStrict<InputSearchElement<K, D>['value']>;
}
export interface InputSearchElementSettableProperties<Key, Data> extends JetSettableProperties {
    autocomplete?: Props<Key, Data>['autocomplete'];
    /**
     * The placeholder text to set on the element. The placeholder specifies a short hint that can
     * be displayed before the user selects or enters a value.
     */
    placeholder?: Props<Key, Data>['placeholder'];
    /**
     * Specifies the text string to render for a suggestion.
     * This attribute can be set to either:
     * <ul>
     * <li>a string that specifies the name of a top level data field to render as text, or</li>
     * <li>a callback function that takes a context object and returns the text string to
     * display</li>
     * </ul>
     *
     * <p>By default, the component will attempt to render a 'label' data field as text.</p>
     *
     * <p>This text will be rendered for the selected value of the component.  It will also be
     * rendered for each suggestion in the dropdown if no suggestionItemTemplate is provided.
     * When rendered for the dropdown suggestions, default matching search term highlighting
     * will still be applied.</p>
     */
    suggestionItemText?: Props<Key, Data>['suggestionItemText'];
    /**
     * Data for the InputSearch suggestions.  This data is used to populate the list of suggestions
     * in the dropdown.  When a user selects a suggestion from the dropdown, the ojValueAction event
     * will contain the data for that suggestion.  If no suggestions data is provided, then the
     * dropdown will not be shown. Note that the InputSearch only shows up to a maximum of 12 suggestions
     * in the dropdown even if there are more suggestions available in the data.
     *
     * <p>Note that the <code class="prettyprint">suggestion-item-text</code> attribute allows for
     * customizing the rendering of each suggestion.  If it is not specified, then the component will
     * attempt to render as text the 'label' field in the suggestion by default.</p>
     */
    suggestions?: Props<Key, Data>['suggestions'];
    value?: Props<Key, Data>['value'];
}
export interface InputSearchElementSettablePropertiesLenient<Key, Data> extends Partial<InputSearchElementSettableProperties<Key, Data>> {
    [key: string]: any;
}
export interface InputSearchIntrinsicProps extends Partial<Readonly<InputSearchElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    rawValue?: never;
    children?: import('preact').ComponentChildren;
    /**
     * Triggered when search text is submitted by the user, even if the text hasn't changed.
     * Submission is triggered by the enter key, either to directly submit text or
     * to select a highlighted value from the suggestions dropdown, or by selecting
     * a value from the dropdown using a mouse or touch gesture.  Note that the
     * <a href="#value">value</a> property is guaranteed to be up-to-date at the time the
     * ojValueAction event is dispatched.
     */
    onojValueAction?: (value: InputSearchElementEventMap<any, any>['ojValueAction']) => void;
    onautocompleteChanged?: (value: InputSearchElementEventMap<any, any>['autocompleteChanged']) => void;
    onplaceholderChanged?: (value: InputSearchElementEventMap<any, any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: InputSearchElementEventMap<any, any>['rawValueChanged']) => void;
    onsuggestionItemTextChanged?: (value: InputSearchElementEventMap<any, any>['suggestionItemTextChanged']) => void;
    onsuggestionsChanged?: (value: InputSearchElementEventMap<any, any>['suggestionsChanged']) => void;
    onvalueChanged?: (value: InputSearchElementEventMap<any, any>['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-input-search': InputSearchIntrinsicProps;
        }
    }
}
