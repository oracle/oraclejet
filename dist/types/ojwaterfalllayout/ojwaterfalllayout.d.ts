/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from 'ojs/index';
import { GlobalAttributes } from 'ojs/oj-jsx-interfaces';
import { DataProvider } from 'ojs/ojdataprovider';
import { ElementVComponent } from 'ojs/ojvcomponent-element';
declare class Props<Key, Data> {
    data?: DataProvider<Key, Data> | null;
    itemTemplate?: ElementVComponent.TemplateSlot<ItemTemplateContext<Key, Data>>;
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
    onScrollPositionChanged?: ElementVComponent.PropertyChanged<{
        y?: number;
        key?: Key;
        offsetY?: number;
    }>;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
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
export declare class WaterfallLayout<K extends string | number, D> extends ElementVComponent<Props<K, D>, State> {
    private root;
    private contentHandler;
    private currentItem;
    private currentKey;
    private skeletonWidth;
    private restoreFocus;
    private actionableMode;
    private renderCompleted;
    private resizeObserver;
    private ticking;
    private defaultOptions;
    private lastInternalScrollPositionUpdate;
    private focusInHandler;
    private focusOutHandler;
    constructor(props: Readonly<Props<K, D>>);
    private static readonly gutterWidth;
    private static readonly minResizeWidthThreshold;
    private _handleFocusIn;
    private _handleFocusOut;
    private _handleClick;
    private _handleKeyDown;
    private _touchStartHandler;
    protected render(): any;
    private _getScrollPolicyOptions;
    protected mounted(): void;
    private _handleNewData;
    protected updated(oldProps: Readonly<Props<K, D>>, oldState: Readonly<State>): void;
    protected unmounted(): void;
    private _delayShowSkeletons;
    private _updatePositionsForSkeletons;
    private _getOptionDefaults;
    private _getShowSkeletonsDelay;
    addBusyState(description: string): Function;
    private _isReady;
    private _findSkeletons;
    private getRootElement;
    private setRootElement;
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
    private scrollListener;
    private _updateScrollPosition;
    private _syncScrollTopWithProps;
    private _handleTouchOrClickEvent;
    private _resetFocus;
    private _setFocus;
    private _updateCurrentItem;
    private _scrollToVisible;
    private _getScroller;
    private _getContentDivStyle;
    private _getRootElementStyle;
    private _renderInitialSkeletons;
    private _getPositionsForSkeletons;
    private _isInViewport;
    private _restoreCurrentItem;
    private _disableAllTabbableElements;
    private _enterActionableMode;
    private _exitActionableMode;
    private renderComplete;
    private renderSkeletons;
    private _renderSkeleton;
    protected _vprops?: VProps<K, D>;
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
  type dataChanged<K extends string | number,D> = JetElementCustomEvent<WaterfallLayoutElement<K,D>["data"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPolicyChanged<K extends string | number,D> = JetElementCustomEvent<WaterfallLayoutElement<K,D>["scrollPolicy"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPolicyOptionsChanged<K extends string | number,D> = JetElementCustomEvent<WaterfallLayoutElement<K,D>["scrollPolicyOptions"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPositionChanged<K extends string | number,D> = JetElementCustomEvent<WaterfallLayoutElement<K,D>["scrollPosition"]>;
}
export interface WaterfallLayoutElementEventMap<K extends string | number,D> extends HTMLElementEventMap {
  'dataChanged': JetElementCustomEvent<WaterfallLayoutElement<K,D>["data"]>;
  'scrollPolicyChanged': JetElementCustomEvent<WaterfallLayoutElement<K,D>["scrollPolicy"]>;
  'scrollPolicyOptionsChanged': JetElementCustomEvent<WaterfallLayoutElement<K,D>["scrollPolicyOptions"]>;
  'scrollPositionChanged': JetElementCustomEvent<WaterfallLayoutElement<K,D>["scrollPosition"]>;
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
  scrollPolicyOptions: Props<Key,Data>['scrollPolicyOptions'];
  /**
  * Specifies the current scroll position of the WaterfallLayout. See the Help documentation for more information.
  */
  scrollPosition: Props<Key,Data>['scrollPosition'];
}
export interface WaterfallLayoutElementSettablePropertiesLenient<Key,Data> extends Partial<WaterfallLayoutElementSettableProperties<Key,Data>> {
  [key: string]: any;
}
export interface WaterfallLayoutProperties<Key,Data> extends Partial<WaterfallLayoutElementSettableProperties<Key,Data>>, GlobalAttributes {
}
export interface VProps<Key,Data> extends Props<Key,Data>, GlobalAttributes {
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-waterfall-layout": WaterfallLayoutProperties<any,any>;
    }
  }
}
