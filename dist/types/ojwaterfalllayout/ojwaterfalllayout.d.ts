/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Component } from 'preact';
import { ExtendGlobalProps, ObservedGlobalProps, TemplateSlot, PropertyChanged } from 'ojs/ojvcomponent';
import { DataProvider } from 'ojs/ojdataprovider';
type Props<Key, Data> = ObservedGlobalProps<'aria-label' | 'aria-labelledby' | 'aria-describedby'> & {
    /**
     * @description
     * Specifies whether the card size stays the same or can change dynamically during runtime.
     * Note that setting the value to 'dynamic' will impact the performance, it is recommended to use this setting only when there are a small number of cards (below 25 cards).
     *
     * @ojmetadata description "Specifies whether the card size stays the same or can change dynamically during runtime. See the Help documentation for more information."
     * @ojmetadata displayName "CardSizing"
     * @ojmetadata help "#cardSizing"
     * @ojmetadata propertyEditorValues {
     *     "fixed": {
     *       "description": "The card size is fixed",
     *       "displayName": "Fixed"
     *     },
     *     "dynamic": {
     *       "description": "The card size could change dynamically",
     *       "displayName": "Dynamic"
     *     }
     *   }
     */
    cardSizing?: 'fixed' | 'dynamic';
    /**
     * @description
     * The data for WaterfallLayout.  Must be of type <a href="DataProvider.html">DataProvider</a>.
     * Please refer to the <a href="#dataprovider-section">DataProvider</a> section for key data type requirement.
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
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the WaterfallLayout. The slot content must be a &lt;template> element.
     * <p>The content inside the template must have a single <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a> as the root node. It cannot have multiple root nodes,
     *    incluidng Text and Comment nodes.  The root node also cannot be a <a href="BindingOverview.html">JET Binding Element</a>, you must wrap it with an Element node.
     *    If the content do contain multiple nodes, WaterfallLayout will take the first Element node it encountered and ignore the rest.</p>
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See [oj.ojWaterfallLayout.ItemTemplateContext]{@link oj.ojWaterfallLayout.ItemTemplateContext})</li>
     * </ul>
     *
     * @ojmetadata description "The itemTemplate slot is used to specify the template for rendering each item in the component. See the Help documentation for more information."
     * @ojmetadata help "#itemTemplate"
     * @ojmetadata maxItems 1
     */
    itemTemplate?: TemplateSlot<ItemTemplateContext<Key, Data>>;
    /**
     * @description
     * Specifies the mechanism used to scroll the data inside the WaterfallLayout. Possible values are: "loadMoreOnScroll", and "loadAll".
     * When "loadMoreOnScroll" is specified, additional data is fetched when the user scrolls to the bottom of the WaterfallLayout.  Note that
     * the component must have a height specified or inside a height constraint element so that the component element is scrollable.
     * When "loadAll" is specified, WaterfallLayout will fetch all the data when it is initially rendered.
     *
     * @ojmetadata description "Specifies how data are fetched as user scrolls towards the bottom of the grid."
     * @ojmetadata displayName "Scroll Policy"
     * @ojmetadata help "#scrollPolicy"
     * @ojmetadata propertyEditorValues {
     *     "loadAll": {
     *       "description": "Fetch and render all data.",
     *       "displayName": "Load All"
     *     },
     *     "loadMoreOnScroll": {
     *       "description": "Additional data is fetched when the user scrolls towards the bottom of the grid.",
     *       "displayName": "Load More On Scroll"
     *     }
     *   }
     */
    scrollPolicy?: 'loadAll' | 'loadMoreOnScroll';
    /**
     * @description
     * <p>
     * The following options are supported:
     * <ul>
     *   <li>fetchSize: The number of items fetched each time when scroll to the end.</li>
     *   <li>maxCount: Maximum rows which will be displayed before fetching more rows will be stopped.</li>
     *   <li>scroller: The element or a CSS selector string to an element which WaterfallLayout uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the oj-waterfall-layout element is used.</li>
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
         * @ojmetadata description "The element or a CSS selector string to an element which WaterfallLayout uses to determine the scroll position as well as the maximum scroll position."
         * @ojmetadata displayName "Scroller"
         * @ojmetadata help "#scrollPolicyOptions.scroller"
         */
        scroller?: Element | QuerySelector | null;
    };
    /**
     * @description
     * The current scroll position of WaterfallLayout. The scroll position is updated when the vertical scroll position
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
     * If a sparse object is set the other sub-properties will be populated and updated once WaterfallLayout has scrolled to that position.
     * </p>
     * <p>
     * Also, if <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll' and the scrollPosition is set to a value outside
     * of the currently rendered region, then the value of scrollPosition will be ignored.
     * </p>
     * Lastly, when a re-rendered is triggered by a <a href="DataProviderRefreshEvent.html">refresh event</a> from the DataProvider,
     * or if the value for <a href="#data">data</a> attribute has changed, then the scrollPosition will by default remain at the top.
     * </p>
     *
     * @ojmetadata description "Specifies the current scroll position of the WaterfallLayout. See the Help documentation for more information."
     * @ojmetadata displayName "Scroll Position"
     * @ojmetadata help "#scrollPosition"
     */
    scrollPosition?: {
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
    };
    onScrollPositionChanged?: PropertyChanged<{
        y?: number;
        key?: Key;
        offsetY?: number;
    }>;
};
type QuerySelector = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string;
type State = {
    renderedData: any;
    positions: any;
    skeletonPositions: any;
    width: number;
    height: number;
    contentHeight: number;
};
interface ItemTemplateContext<Key, Data> {
    /**
     * @ojmetadata description "The data for the current item being rendered"
     */
    data: Data;
    /**
     * @ojmetadata description "The zero-based index of the current item during initial rendering.  Note the index is not updated in response to item additions and removals."
     */
    index: number;
    /**
     * @ojmetadata description "The key of the current item being rendered"
     */
    key: Key;
}
/**
 * @classdesc
 * <h3 id="waterfallLayoutOverview-section">
 *   JET WaterfallLayout
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#waterfallLayoutOverview-section"></a>
 * </h3>
 * <p>Description: The JET WaterfallLayout displays data as cards in a grid layout based on columns.
 * Cards inside WaterfallLayout usually don't have a fixed height but the width of each columns are the
 * same.</p>
 * <pre class="prettyprint">
 *  <code>//WaterfallLayout with a DataProvider
 *  &lt;oj-waterfall-layout data="[[dataProvider]]">
 *  &lt;/oj-waterfall-layout>
 * </code></pre>
 *  <h3 id="dataprovider-section">
 *   DataProvider
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#dataprovider-section"></a>
 *  </h3>
 *  <p>WaterfallLayout can work with any non-hierarchical <a href="DataProvider.html">DataProvider</a> as long as the data type for its key is of type string or number.</p>
 *  <p>An error will be logged and no data will be rendered if the data type for key is not one of the above types.  This requirement enables WaterfallLayout to optimize rendering in all scenarios.</p>
 *
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
 *       <td>Card</td>
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
 *       <td rowspan = "6" nowrap>Card</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus to the previous item according to the data order.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus to the next item according to the data order.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>F2</kbd></td>
 *       <td>Enters Actionable mode.  This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item. It can also be used to exit actionable mode if already in actionable mode.</td>
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
 *   </tbody>
 * </table>
 * @param {string | number} K Type of key of the dataprovider
 * @param {number} D Type of data from the dataprovider
 * @ojmetadata description "A waterfall layout displays heterogeneous data as a grid of cards."
 * @ojmetadata displayName "Waterfall Layout"
 * @ojmetadata main "ojs/ojwaterfalllayout"
 * @ojmetadata extension {
 *   "vbdt": {
 *     "module": "ojs/ojwaterfalllayout"
 *   },
 *   "themes": {
 *     "unsupportedThemes": [
 *       "Alta"
 *     ]
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-waterfall-layout",
 *     "uxSpecs": [
 *       "waterfall-layout"
 *     ]
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojWaterfallLayout.html"
 * @ojmetadata since "9.0.0"
 */
/**
 * This export corresponds to the WaterfallLayout Preact component. For the oj-waterfall-layout custom element, import WaterfallLayoutElement instead.
 */
export declare class WaterfallLayout<K extends string | number, D> extends Component<ExtendGlobalProps<Props<K, D>>, State> {
    private root;
    private contentHandler;
    private currentItem;
    private currentKey;
    private skeletonWidth;
    private actionableMode;
    private renderCompleted;
    private resizeObserver;
    private cardResizeObserver;
    private ticking;
    private defaultOptions;
    private lastInternalScrollPositionUpdate;
    private focusInHandler;
    private focusOutHandler;
    private delayShowSkeletonsTimeout;
    private prevRootWidth;
    private mouseDownTarget;
    constructor();
    static defaultProps: Partial<Props<any, any>>;
    private gutterWidth;
    private static readonly minResizeWidthThreshold;
    private static readonly debounceThreshold;
    private static readonly _CSS_Vars;
    private readonly _findFocusItem;
    private readonly _handleFocusIn;
    private readonly _handleFocusOut;
    private readonly _handleMouseDownCapture;
    private readonly _handleClick;
    private readonly _handleKeyDown;
    private readonly _touchStartHandler;
    render(): import("preact").JSX.Element;
    private _getScrollPolicyOptions;
    private _debounce;
    /**
     * An optional component lifecycle method called after the
     * virtual component has been initially rendered and inserted into the
     * DOM. Data fetches and global listeners can be added here.
     * This will not be called for reparenting cases.
     * @return {void}
     * @override
     */
    componentDidMount(): void;
    private _handleNewData;
    componentDidUpdate(oldProps: Readonly<Props<K, D>>, oldState: Readonly<State>): void;
    /**
     * An optional component lifecycle method called after the
     * virtual component has been removed from the DOM. This will not
     * be called for reparenting cases. Global listener cleanup can
     * be done here.
     * @return {void}
     * @override
     */
    componentWillUnmount(): void;
    private _isRenderedDataSizeChanged;
    private _delayShowSkeletons;
    private _updatePositionsForSkeletons;
    private _getOptionDefaults;
    private _getStyleValues;
    private _getShowSkeletonsDelay;
    /**
     * Retrieve the animation delay between card entrance animation
     * @return {number} the delay in ms
     * @private
     */
    private _getCardEntranceAnimationDelay;
    addBusyState(description: string): Function;
    private _findSkeletons;
    private getRootElement;
    private readonly setRootElement;
    private isAvailable;
    private getCurrentItem;
    private setCurrentItem;
    private getData;
    private setData;
    private updateData;
    private getSkeletonPositions;
    private setSkeletonPositions;
    private getPositions;
    private setPositions;
    private setContentHeight;
    private getItemRenderer;
    private getItemStyleClass;
    private getExpanded;
    private _applySkeletonExitAnimation;
    private _applyEntranceAnimation;
    private _applyExitAnimation;
    private _applyLoadMoreEntranceAnimation;
    private readonly scrollListener;
    private _updateScrollPosition;
    private _syncScrollTopWithProps;
    handleItemRemoved(key: K): void;
    private _handleTouchOrClickEvent;
    private _resetFocus;
    private _setFocus;
    private _updateCurrentItem;
    private _getScroller;
    private _getContentDiv;
    private _getContentDivStyle;
    private _getRootElementStyle;
    /**
     * Renders the initial skeletons
     * @param positions
     */
    private _renderInitialSkeletons;
    /**
     * Generates the skeletons and calculates their positions
     * @param count
     * @param rootWidth
     * @param skeletonWidth
     * @private
     */
    private _getPositionsForSkeletons;
    /**
     * Restore the current item
     * @param items an array of rendered items
     */
    private _restoreCurrentItem;
    /**
     * Update all tabbable elements within each item so they are no longer tabbable
     * @param items an array of rendered items
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
    /**
     * Invoked when all the items are rendered and positioned
     */
    private renderComplete;
    /**
     * Render skeletons for these specific positions
     * @param positions
     */
    private renderSkeletons;
    /**
     * Renders a single skeleton item
     * @private
     */
    private _renderSkeleton;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-waterfall-layout custom element. For the WaterfallLayout Preact component, import WaterfallLayout instead.
 */
export interface WaterfallLayoutElement<K extends string | number, D> extends JetElement<WaterfallLayoutElementSettableProperties<K, D>>, WaterfallLayoutElementSettableProperties<K, D> {
    addEventListener<T extends keyof WaterfallLayoutElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: WaterfallLayoutElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof WaterfallLayoutElementSettableProperties<K, D>>(property: T): WaterfallLayoutElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof WaterfallLayoutElementSettableProperties<K, D>>(property: T, value: WaterfallLayoutElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, WaterfallLayoutElementSettableProperties<K, D>>): void;
    setProperties(properties: WaterfallLayoutElementSettablePropertiesLenient<K, D>): void;
}
declare namespace _WaterfallLayoutElementTypes {
    type _ItemTemplateContext<K extends string | number, D> = ItemTemplateContext<K, D>;
}
export namespace WaterfallLayoutElement {
    type cardSizingChanged<K extends string | number, D> = JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['cardSizing']>;
    type dataChanged<K extends string | number, D> = JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['data']>;
    type scrollPolicyChanged<K extends string | number, D> = JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['scrollPolicy']>;
    type scrollPolicyOptionsChanged<K extends string | number, D> = JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['scrollPolicyOptions']>;
    type scrollPositionChanged<K extends string | number, D> = JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['scrollPosition']>;
    type ItemTemplateContext<K extends string | number, D> = _WaterfallLayoutElementTypes._ItemTemplateContext<K, D>;
    type RenderItemTemplate<K extends string | number, D> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
}
export interface WaterfallLayoutElementEventMap<K extends string | number, D> extends HTMLElementEventMap {
    'cardSizingChanged': JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['cardSizing']>;
    'dataChanged': JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['data']>;
    'scrollPolicyChanged': JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['scrollPolicy']>;
    'scrollPolicyOptionsChanged': JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['scrollPolicyOptions']>;
    'scrollPositionChanged': JetElementCustomEventStrict<WaterfallLayoutElement<K, D>['scrollPosition']>;
}
export interface WaterfallLayoutElementSettableProperties<Key, Data> extends JetSettableProperties {
    /**
     * Specifies whether the card size stays the same or can change dynamically during runtime.
     * Note that setting the value to 'dynamic' will impact the performance, it is recommended to use this setting only when there are a small number of cards (below 25 cards).
     */
    cardSizing?: Props<Key, Data>['cardSizing'];
    /**
     * The data for WaterfallLayout.  Must be of type <a href="DataProvider.html">DataProvider</a>.
     * Please refer to the <a href="#dataprovider-section">DataProvider</a> section for key data type requirement.
     */
    data?: Props<Key, Data>['data'];
    /**
     * Specifies the mechanism used to scroll the data inside the WaterfallLayout. Possible values are: "loadMoreOnScroll", and "loadAll".
     * When "loadMoreOnScroll" is specified, additional data is fetched when the user scrolls to the bottom of the WaterfallLayout.  Note that
     * the component must have a height specified or inside a height constraint element so that the component element is scrollable.
     * When "loadAll" is specified, WaterfallLayout will fetch all the data when it is initially rendered.
     */
    scrollPolicy?: Props<Key, Data>['scrollPolicy'];
    /**
     * <p>
     * The following options are supported:
     * <ul>
     *   <li>fetchSize: The number of items fetched each time when scroll to the end.</li>
     *   <li>maxCount: Maximum rows which will be displayed before fetching more rows will be stopped.</li>
     *   <li>scroller: The element or a CSS selector string to an element which WaterfallLayout uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the oj-waterfall-layout element is used.</li>
     * </ul>
     * When scrollPolicy is loadMoreOnScroll, the next block of rows is fetched
     * when the user scrolls to the end of the component. The fetchSize option
     * determines how many rows are fetched in each block.
     */
    scrollPolicyOptions?: Props<Key, Data>['scrollPolicyOptions'];
    /**
     * The current scroll position of WaterfallLayout. The scroll position is updated when the vertical scroll position
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
     * If a sparse object is set the other sub-properties will be populated and updated once WaterfallLayout has scrolled to that position.
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
export interface WaterfallLayoutElementSettablePropertiesLenient<Key, Data> extends Partial<WaterfallLayoutElementSettableProperties<Key, Data>> {
    [key: string]: any;
}
export interface WaterfallLayoutIntrinsicProps extends Partial<Readonly<WaterfallLayoutElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    oncardSizingChanged?: (value: WaterfallLayoutElementEventMap<any, any>['cardSizingChanged']) => void;
    ondataChanged?: (value: WaterfallLayoutElementEventMap<any, any>['dataChanged']) => void;
    onscrollPolicyChanged?: (value: WaterfallLayoutElementEventMap<any, any>['scrollPolicyChanged']) => void;
    onscrollPolicyOptionsChanged?: (value: WaterfallLayoutElementEventMap<any, any>['scrollPolicyOptionsChanged']) => void;
    onscrollPositionChanged?: (value: WaterfallLayoutElementEventMap<any, any>['scrollPositionChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-waterfall-layout': WaterfallLayoutIntrinsicProps;
        }
    }
}
