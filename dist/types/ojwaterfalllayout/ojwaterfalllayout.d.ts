import { ComponentChildren } from "preact"
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { h, Component } from 'preact';
import { ExtendGlobalProps, ObservedGlobalProps, TemplateSlot, PropertyChanged } from 'ojs/ojvcomponent';
import { DataProvider } from 'ojs/ojdataprovider';
declare type Props<Key, Data> = ObservedGlobalProps<'aria-label' | 'aria-labelledby'> & {
    data?: DataProvider<Key, Data> | null;
    itemTemplate?: TemplateSlot<ItemTemplateContext<Key, Data>>;
    scrollPolicy?: 'loadAll' | 'loadMoreOnScroll';
    scrollPolicyOptions?: {
        fetchSize?: number;
        maxCount?: number;
        scroller?: Element | QuerySelector | null;
    };
    scrollPosition?: {
        y?: number;
        key?: Key;
        offsetY?: number;
    };
    onScrollPositionChanged?: PropertyChanged<{
        y?: number;
        key?: Key;
        offsetY?: number;
    }>;
};
declare type QuerySelector = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string;
declare type State = {
    renderedData: any;
    positions: any;
    skeletonPositions: any;
    width: number;
    height: number;
    contentHeight: number;
};
interface ItemTemplateContext<Key, Data> {
    data: Data;
    index: number;
    key: Key;
}
export declare class WaterfallLayout<K extends string | number, D> extends Component<ExtendGlobalProps<Props<K, D>>, State> {
    private root;
    private contentHandler;
    private currentItem;
    private currentKey;
    private skeletonWidth;
    private actionableMode;
    private renderCompleted;
    private resizeObserver;
    private ticking;
    private defaultOptions;
    private lastInternalScrollPositionUpdate;
    private focusInHandler;
    private focusOutHandler;
    private delayShowSkeletonsTimeout;
    constructor();
    static defaultProps: Partial<Props<any, any>>;
    private gutterWidth;
    private static readonly minResizeWidthThreshold;
    private static readonly debounceThreshold;
    private static readonly _CSS_Vars;
    private readonly _handleFocusIn;
    private readonly _handleFocusOut;
    private readonly _handleClick;
    private readonly _handleKeyDown;
    private readonly _touchStartHandler;
    render(): h.JSX.Element;
    private _getScrollPolicyOptions;
    private _debounce;
    componentDidMount(): void;
    private _handleNewData;
    componentDidUpdate(oldProps: Readonly<Props<K, D>>, oldState: Readonly<State>): void;
    componentWillUnmount(): void;
    private _delayShowSkeletons;
    private _updatePositionsForSkeletons;
    private _getOptionDefaults;
    private _getStyleValues;
    private _getShowSkeletonsDelay;
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
    private _renderInitialSkeletons;
    private _getPositionsForSkeletons;
    private _restoreCurrentItem;
    private _disableAllTabbableElements;
    private _enterActionableMode;
    private _exitActionableMode;
    private renderComplete;
    private renderSkeletons;
    private _renderSkeleton;
}
// Custom Element interfaces
export interface WaterfallLayoutElement<K extends string | number,D> extends JetElement<WaterfallLayoutElementSettableProperties<K, D>>, WaterfallLayoutElementSettableProperties<K, D> {
  addEventListener<T extends keyof WaterfallLayoutElementEventMap<K,D>>(type: T, listener: (this: HTMLElement, ev: WaterfallLayoutElementEventMap<K,D>[T]) => any, options?: (boolean|AddEventListenerOptions)): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean|AddEventListenerOptions)): void;
  getProperty<T extends keyof WaterfallLayoutElementSettableProperties<K, D>>(property: T): WaterfallLayoutElement<K,D>[T];
  getProperty(property: string): any;
  setProperty<T extends keyof WaterfallLayoutElementSettableProperties<K, D>>(property: T, value: WaterfallLayoutElementSettableProperties<K, D>[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, WaterfallLayoutElementSettableProperties<K, D>>): void;
  setProperties(properties: WaterfallLayoutElementSettablePropertiesLenient<K, D>): void;
}
export namespace WaterfallLayoutElement {
  // tslint:disable-next-line interface-over-type-literal
  type dataChanged<K extends string | number,D> = JetElementCustomEventStrict<WaterfallLayoutElement<K,D>["data"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPolicyChanged<K extends string | number,D> = JetElementCustomEventStrict<WaterfallLayoutElement<K,D>["scrollPolicy"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPolicyOptionsChanged<K extends string | number,D> = JetElementCustomEventStrict<WaterfallLayoutElement<K,D>["scrollPolicyOptions"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPositionChanged<K extends string | number,D> = JetElementCustomEventStrict<WaterfallLayoutElement<K,D>["scrollPosition"]>;
}
export interface WaterfallLayoutElementEventMap<K extends string | number,D> extends HTMLElementEventMap {
  'dataChanged': JetElementCustomEventStrict<WaterfallLayoutElement<K,D>["data"]>;
  'scrollPolicyChanged': JetElementCustomEventStrict<WaterfallLayoutElement<K,D>["scrollPolicy"]>;
  'scrollPolicyOptionsChanged': JetElementCustomEventStrict<WaterfallLayoutElement<K,D>["scrollPolicyOptions"]>;
  'scrollPositionChanged': JetElementCustomEventStrict<WaterfallLayoutElement<K,D>["scrollPosition"]>;
}
export interface WaterfallLayoutElementSettableProperties<Key,Data> extends JetSettableProperties {
  /**
  * Specifies the data for the component. See the Help documentation for more information.
  */
  data?: Props<Key,Data>['data'];
  /**
  * Specifies how data are fetched as user scrolls towards the bottom of the grid.
  */
  scrollPolicy?: Props<Key,Data>['scrollPolicy'];
  /**
  * Specifies fetch options for scrolling behaviors that trigger data fetches. See the Help documentation for more information.
  */
  scrollPolicyOptions?: Props<Key,Data>['scrollPolicyOptions'];
  /**
  * Specifies the current scroll position of the WaterfallLayout. See the Help documentation for more information.
  */
  scrollPosition?: Props<Key,Data>['scrollPosition'];
}
export interface WaterfallLayoutElementSettablePropertiesLenient<Key,Data> extends Partial<WaterfallLayoutElementSettableProperties<Key,Data>> {
  [key: string]: any;
}
export interface WaterfallLayoutIntrinsicProps extends Partial<Readonly<WaterfallLayoutElementSettableProperties<any,any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
  children?: ComponentChildren;
  ondataChanged?: (value: WaterfallLayoutElementEventMap<any,any>['dataChanged']) => void;
  onscrollPolicyChanged?: (value: WaterfallLayoutElementEventMap<any,any>['scrollPolicyChanged']) => void;
  onscrollPolicyOptionsChanged?: (value: WaterfallLayoutElementEventMap<any,any>['scrollPolicyOptionsChanged']) => void;
  onscrollPositionChanged?: (value: WaterfallLayoutElementEventMap<any,any>['scrollPositionChanged']) => void;
}
declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "oj-waterfall-layout": WaterfallLayoutIntrinsicProps;
    }
  }
}
