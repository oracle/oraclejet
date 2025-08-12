/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Component } from 'preact';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
import { KeySet, KeySetImpl } from 'ojs/ojkeyset';
import { DataProvider } from 'ojs/ojdataprovider';
import 'ojs/ojtreedataprovider';
type Props<Key, Data> = ObservedGlobalProps<'aria-label' | 'aria-labelledby' | 'aria-describedby'> & {
    /**
     * @description
     * The data for StreamList. Must be of type <a href="DataProvider.html">DataProvider</a> or <a href="TreeDataProvider.html">TreeDataProvider</a>
     *
     * @ojmetadata description "Specifies the data for the component. See the Help documentation for more information."
     * @ojmetadata displayName "Data"
     * @ojmetadata help "#data"
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
    data?: DataProvider<Key, Data> | null;
    /**
     * @description
     * Specifies the key set containing the keys of the items that should be expanded.
     * Use the <a href="KeySetImpl.html">KeySetImpl</a> class to specify items to expand.
     * Use the <a href="AllKeySetImpl.html">AllKeySetImpl</a> class to expand all items.
     *
     * @ojmetadata description "Specifies the key set containing the keys of the items that should be expanded."
     * @ojmetadata displayName "Expanded"
     * @ojmetadata help "#expanded"
     */
    expanded?: KeySet<Key>;
    onExpandedChanged?: PropertyChanged<KeySet<Key> | null>;
    /**
     * @description
     * <p>The <code class="prettyprint">groupTemplate</code> slot is used to specify the template for rendering each non-leaf item in the list. The slot content must be a &lt;template> element.
     * <p>If a <code class="prettyprint">groupTemplate</code> is not specified the <code class="prettyprint">itemTemplate</code> will be used as a fallback.
     * <p>The content inside the template must have a single <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a> as the root node. It cannot have multiple root nodes,
     *    incluidng Text and Comment nodes.  The root node also cannot be a <a href="BindingOverview.html">JET Binding Element</a>, you must wrap it with an Element node.
     *    If the content do contain multiple nodes, StreamList will take the first Element node it encountered and ignore the rest.</p>
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See [oj.ojStreamList.ItemTemplateContext]{@link oj.ojStreamList.ItemTemplateContext})</li>
     * </ul>
     * @ojmetadata description "The groupTemplate slot is used to specify the template for rendering each item in the component. See the Help documentation for more information."
     * @ojmetadata help "#groupTemplate"
     * @ojmetadata maxItems 1
     */
    groupTemplate?: TemplateSlot<ItemTemplateContext<Key, Data>>;
    /**
     * @description
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the list. The slot content must be a &lt;template> element.
     * <p>This slot is required or there will be no default rendering. If a <code class="prettyprint">groupTemplate</code> is not specified the <code class="prettyprint">itemTemplate</code> will be used as a fallback.
     * <p>The content inside the template must have a single <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a> as the root node. It cannot have multiple root nodes,
     *    incluidng Text and Comment nodes.  The root node also cannot be a <a href="BindingOverview.html">JET Binding Element</a>, you must wrap it with an Element node.
     *    If the content do contain multiple nodes, StreamList will take the first Element node it encountered and ignore the rest.</p>
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See [oj.ojStreamList.ItemTemplateContext]{@link oj.ojStreamList.ItemTemplateContext})</li>
     * </ul>
     *
     * @ojmetadata description "The itemTemplate slot is used to specify the template for rendering each item in the component. See the Help documentation for more information."
     * @ojmetadata help "#itemTemplate"
     * @ojmetadata maxItems 1
     */
    itemTemplate?: TemplateSlot<ItemTemplateContext<Key, Data>>;
    /**
     * @description
     * Specifies the mechanism used to scroll the data inside the StreamList. Possible values are: "loadMoreOnScroll", and "loadAll".
     * When "loadMoreOnScroll" is specified, additional data is fetched when the user scrolls to the bottom of the StreamList.  Note that
     * the component must have a height specified or inside a height constraint element so that the component element is scrollable.
     * When "loadAll" is specified, StreamList will fetch all the data when it is initially rendered.
     *
     * @ojmetadata description "Specifies how data are fetched as user scrolls towards the bottom of the list."
     * @ojmetadata displayName "Scroll Policy"
     * @ojmetadata help "#scrollPolicy"
     * @ojmetadata propertyEditorValues {
     *     "loadAll": {
     *       "description": "Fetch and render all data.",
     *       "displayName": "Load All"
     *     },
     *     "loadMoreOnScroll": {
     *       "description": "Additional data is fetched when the user scrolls towards the bottom of the list.",
     *       "displayName": "Load More On Scroll"
     *     }
     *   }
     */
    scrollPolicy?: 'loadAll' | 'loadMoreOnScroll';
    /**
     * @description
     * The following options are supported:
     * <ul>
     *   <li>fetchSize: The number of items fetched each time when scroll to the end.</li>
     *   <li>maxCount: Maximum rows which will be displayed before fetching more rows will be stopped.</li>
     *   <li>scroller: The element which StreamList uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the oj-stream-list element is used.</li>
     * </ul>
     * When scrollPolicy is loadMoreOnScroll, the next block of rows is fetched
     * when the user scrolls to the end of the component. The fetchSize option
     * determines how many rows are fetched in each block.
     *
     * @ojmetadata description "Specifies fetch options for scrolling behaviors that trigger data fetches. See the Help documentation for more information."
     * @ojmetadata displayName "Scroll Policy Options"
     * @ojmetadata help "#scrollPolicyOptions"
     */
    scrollPolicyOptions?: {
        /**
         * @ojmetadata description "The number of items to fetch in each block."
         * @ojmetadata displayName "Fetch Size"
         * @ojmetadata help "#scrollPolicyOptions.fetchSize"
         */
        fetchSize?: number;
        /**
         * @ojmetadata description "The maximum total number of items to fetch."
         * @ojmetadata displayName "Max Count"
         * @ojmetadata help "#scrollPolicyOptions.maxCount"
         */
        maxCount?: number;
        /**
         * @ojmetadata description "The element or a CSS selector string to an element used to determine the scroll position as well as the maximum scroll position. See the Help documentation for more information."
         * @ojmetadata displayName "Scroller"
         * @ojmetadata help "#scrollPolicyOptions.scroller"
         */
        scroller?: Element | QuerySelector | null;
    };
    /**
     * @description
     * The current scroll position of StreamList. The scroll position is updated when the vertical scroll position
     * (or its scroller, as specified in scrollPolicyOptions.scroller) has changed.  The value contains the y scroll position, the key of
     * the item closest to the top of the viewport, as well as vertical offset from the position of the item to the actual scroll position.
     * <p>
     * The default value contains just the scroll position.  Once data is fetched the 'key' and 'offsetY' sub-properties will be added.
     * If there is no data then the 'key' sub-properties will not be available.
     * </p>
     * <p>
     * When setting the scrollPosition property, applications can change any combination of the sub-properties.
     * If both key and y sub-properties are set at once then key will take precedent.
     * If offsetY is specified, it will be used to adjust the scroll position from the position where the key of the item is located.
     * </p>
     * <p>
     * If a sparse object is set the other sub-properties will be populated and updated once StreamList has scrolled to that position.
     * </p>
     * <p>
     * Also, if <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll' and the scrollPosition is set to a value outside
     * of the currently rendered region, then the value of scrollPosition will be ignored.
     * </p>
     * Lastly, when a re-rendered is triggered by a <a href="DataProviderRefreshEvent.html">refresh event</a> from the DataProvider,
     * or if the value for <a href="#data">data</a> attribute has changed, then the scrollPosition will by default remain at the top.
     * </p>
     *
     * @ojmetadata description "Specifies the current scroll position of the StreamList. See the Help documentation for more information."
     * @ojmetadata displayName "Scroll Position"
     * @ojmetadata help "#scrollPosition"
     */
    scrollPosition?: ScrollPositionType<Key>;
    onScrollPositionChanged?: PropertyChanged<{
        y?: number;
        key?: Key;
        offsetY?: number;
        parentKey?: Key;
    }>;
};
type QuerySelector = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string;
type State<K> = {
    renderedData: any;
    outOfRangeData: any;
    initialSkeleton: boolean;
    initialSkeletonCount: number;
    expandedToggleKeys: KeySetImpl<K>;
    expandedSkeletonKeys: KeySetImpl<K>;
    expandingKeys: KeySetImpl<K>;
    toCollapse: Array<K>;
    lastExpanded: KeySet<K>;
};
type ScrollPositionType<Key> = {
    /**
     * @ojmetadata description "The vertical position in pixels."
     */
    y?: number;
    /**
     * @ojmetadata description "The key of the item. If DataProvider is used for data and the key does not exist in the DataProvider or if the item has not been fetched yet, then the value is ignored."
     */
    key?: Key;
    /**
     * @ojmetadata description "The vertical offset in pixels relative to the item identified by key."
     */
    offsetY?: number;
    /**
     * @ojmetadata description "The key of the parent if tree data."
     */
    parentKey?: Key;
};
interface ItemTemplateContext<Key, Data> {
    /**
     * @ojmetadata description "The data for the current item being rendered"
     */
    data: Data;
    /**
     * @ojmetadata description "The key of the current item being rendered"
     */
    key: Key;
    /**
     * @ojmetadata description "If the current item has children, null if not a TreeDataProvider"
     */
    leaf?: boolean;
    /**
     * @ojmetadata description "The key of the parent current item being rendered, null if not a TreeDataProvider"
     */
    parentKey?: Key;
    /**
     * @ojmetadata description "The zero-based depth of the current item, null if not a TreeDataProvider"
     */
    depth?: number;
}
/**
 * @classdesc
 * <h3 id="streamListOverview-section">
 *   JET StreamList
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#streamListOverview-section"></a>
 * </h3>
 * <p>Description: The JET StreamList displays data in an activity stream feed.</p>
 * <pre class="prettyprint">
 * <code>//StreamList with a DataProvider
 * &lt;oj-stream-list data="[[dataProvider]]">
 * &lt;/oj-stream-list>
 * </code></pre>
 *  <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 *  </h3>
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
 *       <td>Item</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Focus on the item.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
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
 *       <td rowspan="6" nowrap>Item</td>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move focus to the previous item according to the data order.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus to the next item according to the data order.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>F2</kbd></td>
 *       <td>Enters Actionable mode. This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item. It can also be used to exit actionable mode if already in actionable mode.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Exits Actionable mode.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>When in Actionable Mode, navigates to next focusable element within the item.  If the last focusable element is reached, shift focus back to the first focusable element.
 *           When not in Actionable Mode, navigates to next focusable element on the page (outside of the component).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Tab</kbd></td>
 *       <td>When in Actionable Mode, navigates to previous focusable element within the item.  If the first focusable element is reached, shift focus back to the last focusable element.
 *           When not in Actionable Mode, navigates to previous focusable element on the page (outside of the component).</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2" nowrap>Group Item</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Collapse the current item if it is expanded and is collapsible.  For non-hierarchical data, do nothing.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Expand the current item if it has children and is expandable.  For non-hierarchical data, do nothing.</td>
 *     </tr>
 *   </tbody>
 *   </tbody>
 * </table>
 *
 * @typeparam {object} K Type of key of the dataprovider
 * @typeparam {object} D Type of data from the dataprovider
 * @ojmetadata description "A stream list displays data in an activity stream feed."
 * @ojmetadata displayName "Stream List"
 * @ojmetadata main "ojs/ojstreamlist"
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-tables-basic",
 *     "uxSpecs": ["activity-stream"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojstreamlist"
 *   },
 *   "themes": {
 *     "unsupportedThemes": [
 *       "Alta"
 *     ]
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojStreamList.html"
 * @ojmetadata since "9.0.0"
 */
/**
 * This export corresponds to the StreamList Preact component. For the oj-stream-list custom element, import StreamListElement instead.
 */
export declare class StreamList<K extends string | number, D> extends Component<ExtendGlobalProps<Props<K, D>>, State<K>> {
    private root;
    private contentHandler;
    private _ticking;
    private currentItem;
    private currentKey;
    private restoreFocus;
    private actionableMode;
    private _focusoutTimeout;
    private skeletonHeight;
    private resizeObserver;
    private defaultOptions;
    private lastInternalScrollPositionUpdate;
    private height;
    private focusInHandler;
    private focusOutHandler;
    constructor(props: Readonly<Props<K, D>>);
    static defaultProps: Partial<Props<any, any>>;
    private static readonly debounceThreshold;
    private readonly _handleFocusIn;
    private readonly _handleFocusOut;
    _clearFocusoutTimeout(): void;
    private readonly _handleClick;
    private _handleToggleExpanded;
    private readonly _handleKeyDown;
    private _touchStartHandler;
    render(): import("preact").JSX.Element;
    private _doBlur;
    /**
     * Determine whether the event is triggered by interaction with element inside ListView
     * Note that Firefox 48 does not support relatedTarget on blur event, see
     * _supportRelatedTargetOnBlur method
     * @param {Event} event the focus or blur event
     * @return {boolean} true if focus/blur is triggered by interaction with element within listview, false otherwise.
     */
    private _isFocusBlurTriggeredByDescendent;
    private _renderInitialSkeletons;
    private renderSkeletons;
    /**
     * Renders a single skeleton item
     * @private
     */
    private _renderSkeleton;
    private _applySkeletonExitAnimation;
    private _isTreeData;
    private instanceOfTreeDataProvider;
    private _postRender;
    private _getScrollPolicyOptions;
    private _debounce;
    componentDidMount(): void;
    private getSkeletonHeight;
    private outerHeight;
    componentWillUnmount(): void;
    private _delayShowSkeletons;
    private _getOptionDefaults;
    private _getShowSkeletonsDelay;
    private getRootElement;
    componentDidUpdate(oldProps: Readonly<Props<K, D>>, oldState: Readonly<State<K>>): void;
    shouldComponentUpdate(nextProps: Readonly<ExtendGlobalProps<Props<K, D>>>, nextState: Readonly<State<K>>): boolean;
    static getDerivedStateFromProps<K, D>(props: Readonly<Props<K, D>>, state: Readonly<State<K>>): Partial<State<K>> | null;
    private static readonly collapse;
    private static _findIndex;
    private readonly setRootElement;
    private _unregisterScrollHandler;
    private _registerScrollHandler;
    private readonly scrollListener;
    private _updateScrollPosition;
    private _syncScrollTopWithProps;
    private _getParentKey;
    private _getItemByKey;
    private _getScrollEventElement;
    private _getScroller;
    private _findClosestElementToTop;
    private isAvailable;
    private getCurrentItem;
    private setCurrentItem;
    private getData;
    private setData;
    private updateData;
    private getExpanded;
    private setExpanded;
    private updateExpand;
    private getExpandingKeys;
    private setExpandingKeys;
    private updateExpandingKeys;
    private getSkeletonKeys;
    private setSkeletonKeys;
    private updateSkeletonKeys;
    private getOutOfRangeData;
    private setOutOfRangeData;
    private getItemRenderer;
    private getItemStyleClass;
    private getGroupRenderer;
    private getGroupStyleClass;
    addBusyState(description: string): Function;
    handleItemRemoved(key: K): void;
    private _handleTouchOrClickEvent;
    private _isFocusable;
    private _isInputElement;
    private _isInsideFocusableElement;
    private _isInFocusableElementsList;
    private _resetFocus;
    private _setFocus;
    private _updateCurrentItemAndFocus;
    /**
     * Checks whether the item is in the viewport
     * @param item
     */
    private _isInViewport;
    /**
     * Restore the current item
     * @param items an array of rendered items
     */
    private _restoreCurrentItem;
    /**
     * Update all tabbable elements within each item so they are no longer tabbable
     */
    private _disableAllTabbableElements;
    /**
     * Enter the actionable mode where user can tab through all tabbable elements within the current item
     */
    private _enterActionableMode;
    /**
     * Exit the actionable mode
     */
    private _exitActionableMode;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-stream-list custom element. For the StreamList Preact component, import StreamList instead.
 */
export interface StreamListElement<K extends string | number, D> extends JetElement<StreamListElementSettableProperties<K, D>>, StreamListElementSettableProperties<K, D> {
    addEventListener<T extends keyof StreamListElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: StreamListElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof StreamListElementSettableProperties<K, D>>(property: T): StreamListElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof StreamListElementSettableProperties<K, D>>(property: T, value: StreamListElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, StreamListElementSettableProperties<K, D>>): void;
    setProperties(properties: StreamListElementSettablePropertiesLenient<K, D>): void;
}
declare namespace _StreamListElementTypes {
    type _ItemTemplateContext<K extends string | number, D> = ItemTemplateContext<K, D>;
}
export namespace StreamListElement {
    type dataChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['data']>;
    type expandedChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['expanded']>;
    type scrollPolicyChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['scrollPolicy']>;
    type scrollPolicyOptionsChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['scrollPolicyOptions']>;
    type scrollPositionChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['scrollPosition']>;
    type GroupTemplateContext<K extends string | number, D> = ItemTemplateContext<K, D>;
    type RenderGroupTemplate<K extends string | number, D> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
    type ItemTemplateContext<K extends string | number, D> = _StreamListElementTypes._ItemTemplateContext<K, D>;
    type RenderItemTemplate<K extends string | number, D> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
}
export interface StreamListElementEventMap<K extends string | number, D> extends HTMLElementEventMap {
    'dataChanged': JetElementCustomEventStrict<StreamListElement<K, D>['data']>;
    'expandedChanged': JetElementCustomEventStrict<StreamListElement<K, D>['expanded']>;
    'scrollPolicyChanged': JetElementCustomEventStrict<StreamListElement<K, D>['scrollPolicy']>;
    'scrollPolicyOptionsChanged': JetElementCustomEventStrict<StreamListElement<K, D>['scrollPolicyOptions']>;
    'scrollPositionChanged': JetElementCustomEventStrict<StreamListElement<K, D>['scrollPosition']>;
}
export interface StreamListElementSettableProperties<Key, Data> extends JetSettableProperties {
    /**
     * The data for StreamList. Must be of type <a href="DataProvider.html">DataProvider</a> or <a href="TreeDataProvider.html">TreeDataProvider</a>
     */
    data?: Props<Key, Data>['data'];
    /**
     * Specifies the key set containing the keys of the items that should be expanded.
     * Use the <a href="KeySetImpl.html">KeySetImpl</a> class to specify items to expand.
     * Use the <a href="AllKeySetImpl.html">AllKeySetImpl</a> class to expand all items.
     */
    expanded?: Props<Key, Data>['expanded'];
    /**
     * Specifies the mechanism used to scroll the data inside the StreamList. Possible values are: "loadMoreOnScroll", and "loadAll".
     * When "loadMoreOnScroll" is specified, additional data is fetched when the user scrolls to the bottom of the StreamList.  Note that
     * the component must have a height specified or inside a height constraint element so that the component element is scrollable.
     * When "loadAll" is specified, StreamList will fetch all the data when it is initially rendered.
     */
    scrollPolicy?: Props<Key, Data>['scrollPolicy'];
    /**
     * The following options are supported:
     * <ul>
     *   <li>fetchSize: The number of items fetched each time when scroll to the end.</li>
     *   <li>maxCount: Maximum rows which will be displayed before fetching more rows will be stopped.</li>
     *   <li>scroller: The element which StreamList uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the oj-stream-list element is used.</li>
     * </ul>
     * When scrollPolicy is loadMoreOnScroll, the next block of rows is fetched
     * when the user scrolls to the end of the component. The fetchSize option
     * determines how many rows are fetched in each block.
     */
    scrollPolicyOptions?: Props<Key, Data>['scrollPolicyOptions'];
    /**
     * The current scroll position of StreamList. The scroll position is updated when the vertical scroll position
     * (or its scroller, as specified in scrollPolicyOptions.scroller) has changed.  The value contains the y scroll position, the key of
     * the item closest to the top of the viewport, as well as vertical offset from the position of the item to the actual scroll position.
     * <p>
     * The default value contains just the scroll position.  Once data is fetched the 'key' and 'offsetY' sub-properties will be added.
     * If there is no data then the 'key' sub-properties will not be available.
     * </p>
     * <p>
     * When setting the scrollPosition property, applications can change any combination of the sub-properties.
     * If both key and y sub-properties are set at once then key will take precedent.
     * If offsetY is specified, it will be used to adjust the scroll position from the position where the key of the item is located.
     * </p>
     * <p>
     * If a sparse object is set the other sub-properties will be populated and updated once StreamList has scrolled to that position.
     * </p>
     * <p>
     * Also, if <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll' and the scrollPosition is set to a value outside
     * of the currently rendered region, then the value of scrollPosition will be ignored.
     * </p>
     * Lastly, when a re-rendered is triggered by a <a href="DataProviderRefreshEvent.html">refresh event</a> from the DataProvider,
     * or if the value for <a href="#data">data</a> attribute has changed, then the scrollPosition will by default remain at the top.
     * </p>
     */
    scrollPosition?: Props<Key, Data>['scrollPosition'];
}
export interface StreamListElementSettablePropertiesLenient<Key, Data> extends Partial<StreamListElementSettableProperties<Key, Data>> {
    [key: string]: any;
}
export interface StreamListIntrinsicProps extends Partial<Readonly<StreamListElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    ondataChanged?: (value: StreamListElementEventMap<any, any>['dataChanged']) => void;
    onexpandedChanged?: (value: StreamListElementEventMap<any, any>['expandedChanged']) => void;
    onscrollPolicyChanged?: (value: StreamListElementEventMap<any, any>['scrollPolicyChanged']) => void;
    onscrollPolicyOptionsChanged?: (value: StreamListElementEventMap<any, any>['scrollPolicyOptionsChanged']) => void;
    onscrollPositionChanged?: (value: StreamListElementEventMap<any, any>['scrollPositionChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-stream-list': StreamListIntrinsicProps;
        }
    }
}
