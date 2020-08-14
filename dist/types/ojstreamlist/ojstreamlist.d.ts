/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from 'ojs/index';
import { GlobalAttributes } from 'ojs/oj-jsx-interfaces';
import { VComponent } from 'ojs/ojvcomponent';
import * as KeySet from 'ojs/ojkeyset';
import { DataProvider } from 'ojs/ojdataprovider';
import 'ojs/ojtreedataprovider';
declare class Props<Key, Data> {
    data?: DataProvider<Key, Data> | null;
    expanded?: KeySet.KeySet<Key>;
    groupTemplate?: VComponent.Slot<ItemTemplateContext<Key, Data>>;
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
        parentKey?: Key;
    };
}
declare type State<K> = {
    renderedData: any;
    outOfRangeData: any;
    initialSkeleton: boolean;
    initialSkeletonCount: number;
    expandedToggleKeys: KeySet.KeySetImpl<K>;
    expandedSkeletonKeys: KeySet.KeySetImpl<K>;
    expandingKeys: KeySet.KeySetImpl<K>;
    height: number;
};
interface ItemTemplateContext<Key, Data> {
    data: Data;
    key: Key;
    leaf?: boolean;
    parentKey?: Key;
    depth?: number;
}
export declare class StreamList<K extends string | number, D> extends VComponent<Props<K, D>, State<K>> {
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
    constructor(props: Readonly<Props<K, D>>);
    private _handleFocusIn;
    private _handleFocusOut;
    _clearFocusoutTimeout(): void;
    private _handleClick;
    private _handleToggleExpanded;
    private _handleKeyDown;
    private _touchStartHandler;
    protected render(): any;
    private _doBlur;
    private _isFocusBlurTriggeredByDescendent;
    private _renderInitialSkeletons;
    private renderSkeletons;
    private _renderSkeleton;
    private _applySkeletonExitAnimation;
    private _isTreeData;
    private instanceOfTreeDataProvider;
    private _postRender;
    protected mounted(): void;
    private getSkeletonHeight;
    private outerHeight;
    protected unmounted(): void;
    private getRootElement;
    protected updated(oldProps: Readonly<Props<K, D>>, oldState: Readonly<State<K>>): void;
    protected static initStateFromProps<K, D>(props: Readonly<Props<K, D>>, state: Readonly<State<K>>): Partial<State<K>> | null;
    protected static updateStateFromProps<K, D>(props: Readonly<Props<K, D>>, state: Readonly<State<K>>, oldProps: Readonly<Props<K, D>>): Partial<State<K>> | null;
    private static collapse;
    private static _getLocalDescendentCount;
    private static _findIndex;
    private setRootElement;
    private _unregisterScrollHandler;
    private _registerScrollHandler;
    private scrollListener;
    private _updateScrollPosition;
    private _syncScrollTopWithProps;
    private _getParentKey;
    private _getItemByKey;
    private _getScrollEventElement;
    private _getScroller;
    private _findClosestElementToTop;
    private _getExpandSkeletonsForKey;
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
    private _handleTouchOrClickEvent;
    private _isInputElement;
    private _isInsideInputElement;
    private _resetFocus;
    private _setFocus;
    private _updateCurrentItemAndFocus;
    private _isInViewport;
    private _restoreCurrentItem;
    private _disableAllTabbableElements;
    private _enterActionableMode;
    private _exitActionableMode;
    protected _vprops?: VProps<K, D>;
}
// Custom Element interfaces
export interface StreamListElement<Key,Data> extends JetElement<StreamListElementSettableProperties<Key,Data>> {
  /**
   * Specifies the data for the component. See the Help documentation for more information.
   */
  data?: Props<Key,Data>['data'];
  /**
   * Specifies the key set containing the keys of the items that should be expanded.
   */
  expanded?: Props<Key,Data>['expanded'];
  /**
   * Specifies how data are fetched as user scrolls towards the bottom of the list.
   */
  scrollPolicy?: Props<Key,Data>['scrollPolicy'];
  /**
   * Specifies fetch options for scrolling behaviors that trigger data fetches. See the Help documentation for more information.
   */
  scrollPolicyOptions: Props<Key,Data>['scrollPolicyOptions'];
  /**
   * Specifies the current scroll position of the StreamList. See the Help documentation for more information.
   */
  scrollPosition: Props<Key,Data>['scrollPosition'];
  addEventListener<T extends keyof StreamListElementEventMap<Key,Data>>(type: T, listener: (this: HTMLElement, ev: StreamListElementEventMap<Key,Data>[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof StreamListElementSettableProperties<Key,Data>>(property: T): StreamListElement<Key,Data>[T];
  getProperty(property: string): any;
  setProperty<T extends keyof StreamListElementSettableProperties<Key,Data>>(property: T, value: StreamListElementSettableProperties<Key,Data>[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, StreamListElementSettableProperties<Key,Data>>): void;
  setProperties(properties: StreamListElementSettablePropertiesLenient<Key,Data>): void;
}
export namespace StreamListElement {
  // tslint:disable-next-line interface-over-type-literal
  type dataChanged<Key,Data> = JetElementCustomEvent<StreamListElement<Key,Data>["data"]>;
  // tslint:disable-next-line interface-over-type-literal
  type expandedChanged<Key,Data> = JetElementCustomEvent<StreamListElement<Key,Data>["expanded"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPolicyChanged<Key,Data> = JetElementCustomEvent<StreamListElement<Key,Data>["scrollPolicy"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPolicyOptionsChanged<Key,Data> = JetElementCustomEvent<StreamListElement<Key,Data>["scrollPolicyOptions"]>;
  // tslint:disable-next-line interface-over-type-literal
  type scrollPositionChanged<Key,Data> = JetElementCustomEvent<StreamListElement<Key,Data>["scrollPosition"]>;
}
export interface StreamListElementEventMap<Key,Data> extends HTMLElementEventMap {
  'dataChanged': JetElementCustomEvent<StreamListElement<Key,Data>["data"]>;
  'expandedChanged': JetElementCustomEvent<StreamListElement<Key,Data>["expanded"]>;
  'scrollPolicyChanged': JetElementCustomEvent<StreamListElement<Key,Data>["scrollPolicy"]>;
  'scrollPolicyOptionsChanged': JetElementCustomEvent<StreamListElement<Key,Data>["scrollPolicyOptions"]>;
  'scrollPositionChanged': JetElementCustomEvent<StreamListElement<Key,Data>["scrollPosition"]>;
}
export interface StreamListElementSettableProperties<Key,Data> extends JetSettableProperties {
  /**
   * Specifies the data for the component. See the Help documentation for more information.
   */
  data?: Props<Key,Data>['data'];
  /**
   * Specifies the key set containing the keys of the items that should be expanded.
   */
  expanded?: Props<Key,Data>['expanded'];
  /**
   * Specifies how data are fetched as user scrolls towards the bottom of the list.
   */
  scrollPolicy?: Props<Key,Data>['scrollPolicy'];
  /**
   * Specifies fetch options for scrolling behaviors that trigger data fetches. See the Help documentation for more information.
   */
  scrollPolicyOptions: Props<Key,Data>['scrollPolicyOptions'];
  /**
   * Specifies the current scroll position of the StreamList. See the Help documentation for more information.
   */
  scrollPosition: Props<Key,Data>['scrollPosition'];
}
export interface StreamListElementSettablePropertiesLenient<Key,Data> extends Partial<StreamListElementSettableProperties<Key,Data>> {
  [key: string]: any;
}
export declare type ojStreamList<Key,Data> = StreamListElement<Key,Data>;
export declare type ojStreamListEventMap<Key,Data> = StreamListElementEventMap<Key,Data>;
export declare type ojStreamListSettableProperties<Key,Data> = StreamListElementSettableProperties<Key,Data>;
export declare type ojStreamListSettablePropertiesLenient<Key,Data> = StreamListElementSettablePropertiesLenient<Key,Data>;
export interface StreamListProperties<Key,Data> extends Partial<StreamListElementSettableProperties<Key,Data>>, GlobalAttributes {}
export interface VProps<Key,Data> extends Props<Key,Data>, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-stream-list": StreamListProperties<any,any>;
    }
  }
}
