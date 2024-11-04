import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { Component } from 'preact';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
import { KeySet, KeySetImpl } from 'ojs/ojkeyset';
import { DataProvider } from 'ojs/ojdataprovider';
import 'ojs/ojtreedataprovider';
type Props<Key, Data> = ObservedGlobalProps<'aria-label' | 'aria-labelledby'> & {
    data?: DataProvider<Key, Data> | null;
    expanded?: KeySet<Key>;
    onExpandedChanged?: PropertyChanged<KeySet<Key> | null>;
    groupTemplate?: TemplateSlot<ItemTemplateContext<Key, Data>>;
    itemTemplate?: TemplateSlot<ItemTemplateContext<Key, Data>>;
    scrollPolicy?: 'loadAll' | 'loadMoreOnScroll';
    scrollPolicyOptions?: {
        fetchSize?: number;
        maxCount?: number;
        scroller?: Element | QuerySelector | null;
    };
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
    y?: number;
    key?: Key;
    offsetY?: number;
    parentKey?: Key;
};
interface ItemTemplateContext<Key, Data> {
    data: Data;
    key: Key;
    leaf?: boolean;
    parentKey?: Key;
    depth?: number;
}
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
    private _isFocusBlurTriggeredByDescendent;
    private _renderInitialSkeletons;
    private renderSkeletons;
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
    private _isInViewport;
    private _restoreCurrentItem;
    private _disableAllTabbableElements;
    private _enterActionableMode;
    private _exitActionableMode;
}
export {};
export interface StreamListElement<K extends string | number, D> extends JetElement<StreamListElementSettableProperties<K, D>>, StreamListElementSettableProperties<K, D> {
    addEventListener<T extends keyof StreamListElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: StreamListElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof StreamListElementSettableProperties<K, D>>(property: T): StreamListElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof StreamListElementSettableProperties<K, D>>(property: T, value: StreamListElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, StreamListElementSettableProperties<K, D>>): void;
    setProperties(properties: StreamListElementSettablePropertiesLenient<K, D>): void;
}
export namespace StreamListElement {
    type dataChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['data']>;
    type expandedChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['expanded']>;
    type scrollPolicyChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['scrollPolicy']>;
    type scrollPolicyOptionsChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['scrollPolicyOptions']>;
    type scrollPositionChanged<K extends string | number, D> = JetElementCustomEventStrict<StreamListElement<K, D>['scrollPosition']>;
    type RenderGroupTemplate<K extends string | number, D> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
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
    data?: Props<Key, Data>['data'];
    expanded?: Props<Key, Data>['expanded'];
    scrollPolicy?: Props<Key, Data>['scrollPolicy'];
    scrollPolicyOptions?: Props<Key, Data>['scrollPolicyOptions'];
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
