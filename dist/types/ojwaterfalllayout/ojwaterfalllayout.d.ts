/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from 'ojs/index';
import { GlobalAttributes } from 'ojs/oj-jsx-interfaces';
import { DataProvider } from 'ojs/ojdataprovider';
import { VComponent } from 'ojs/ojvcomponent';
declare class Props<Key, Data> {
    data?: DataProvider<Key, Data> | null;
    itemTemplate?: VComponent.Slot<ItemTemplateContext<Key, Data>>;
    scrollPolicy?: 'loadAll' | 'loadMoreOnScroll';
    scrollPolicyOptions?: {
        fetchSize?: number;
        maxCount?: number;
        scroller?: Element | null;
    };
    scrollPosition?: {
        y?: number;
        key?: Key;
        offsetY?: number;
    };
}
declare type State = {
    renderedData: any;
    outOfRangeData: any;
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
export declare class WaterfallLayout<K extends string | number, D> extends VComponent<Props<K, D>, State> {
    private root;
    private contentHandler;
    private currentItem;
    private currentKey;
    private skeletonWidth;
    private restoreFocus;
    private actionableMode;
    private resizeObserver;
    private ticking;
    private defaultOptions;
    constructor(props: Readonly<Props<K, D>>);
    private static readonly gutterWidth;
    private _handleFocusIn;
    private _handleFocusOut;
    private _handleClick;
    private _handlePointerDown;
    private _handleKeyDown;
    private _touchStartHandler;
    protected render(): any;
    protected mounted(): void;
    protected updated(oldProps: Readonly<Props<K, D>>, oldState: Readonly<State>): void;
    protected unmounted(): void;
    private _delayShowSkeletons;
    private _getOptionDefaults;
    private _getShowSkeletonsDelay;
    private _addBusyState;
    private _findSkeletons;
    private getRootElement;
    private setRootElement;
    private isAvailable;
    private getCurrentItem;
    private setCurrentItem;
    private getData;
    private setData;
    private updateData;
    private getOutOfRangeData;
    private setOutOfRangeData;
    private getSkeletonPositions;
    private setSkeletonPositions;
    private getPositions;
    private setPositions;
    private setContentHeight;
    private getItemRenderer;
    private getItemStyleClass;
    private getItemElementStyleClass;
    private getExpanded;
    private _applySkeletonExitAnimation;
    private _applyExitAnimation;
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
    private renderSkeletonsForLoadMore;
    private _renderSkeleton;
    protected _vprops?: VProps<K, D>;
}
// Custom Element interfaces
export interface WaterfallLayoutElement<Key,Data> extends JetElement<WaterfallLayoutElementSettableProperties<Key,Data>> {
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
  addEventListener<T extends keyof WaterfallLayoutElementEventMap<Key,Data>>(type: T, listener: (this: HTMLElement, ev: WaterfallLayoutElementEventMap<Key,Data>[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof WaterfallLayoutElementSettableProperties<Key,Data>>(property: T): WaterfallLayoutElement<Key,Data>[T];
  getProperty(property: string): any;
  setProperty<T extends keyof WaterfallLayoutElementSettableProperties<Key,Data>>(property: T, value: WaterfallLayoutElementSettableProperties<Key,Data>[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, WaterfallLayoutElementSettableProperties<Key,Data>>): void;
  setProperties(properties: WaterfallLayoutElementSettablePropertiesLenient<Key,Data>): void;
}
export namespace WaterfallLayoutElement {
  // tslint:disable-next-line interface-over-type-literal
  type dataChanged<Key,Data> = JetElementCustomEvent<WaterfallLayoutElement<Key,Data>["data"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPolicyChanged<Key,Data> = JetElementCustomEvent<WaterfallLayoutElement<Key,Data>["scrollPolicy"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPolicyOptionsChanged<Key,Data> = JetElementCustomEvent<WaterfallLayoutElement<Key,Data>["scrollPolicyOptions"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPositionChanged<Key,Data> = JetElementCustomEvent<WaterfallLayoutElement<Key,Data>["scrollPosition"]>;
}
export interface WaterfallLayoutElementEventMap<Key,Data> extends HTMLElementEventMap {
  'dataChanged': JetElementCustomEvent<WaterfallLayoutElement<Key,Data>["data"]>;
  'scrollPolicyChanged': JetElementCustomEvent<WaterfallLayoutElement<Key,Data>["scrollPolicy"]>;
  'scrollPolicyOptionsChanged': JetElementCustomEvent<WaterfallLayoutElement<Key,Data>["scrollPolicyOptions"]>;
  'scrollPositionChanged': JetElementCustomEvent<WaterfallLayoutElement<Key,Data>["scrollPosition"]>;
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
export declare type ojWaterfallLayout<Key,Data> = WaterfallLayoutElement<Key,Data>;
export declare type ojWaterfallLayoutEventMap<Key,Data> = WaterfallLayoutElementEventMap<Key,Data>;
export declare type ojWaterfallLayoutSettableProperties<Key,Data> = WaterfallLayoutElementSettableProperties<Key,Data>;
export declare type ojWaterfallLayoutSettablePropertiesLenient<Key,Data> = WaterfallLayoutElementSettablePropertiesLenient<Key,Data>;
export interface WaterfallLayoutProperties<Key,Data> extends Partial<WaterfallLayoutElementSettableProperties<Key,Data>>, GlobalAttributes {}
export interface VProps<Key,Data> extends Props<Key,Data>, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-waterfall-layout": WaterfallLayoutProperties<any,any>;
    }
  }
}
