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
import { KeySet } from 'ojs/ojkeyset';
declare class Props<Key> {
    rowKey?: Key | null;
    selectedKeys: KeySet<Key> | null;
    selectionMode?: 'all' | 'multiple' | 'single';
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
export declare class Selector<K> extends VComponent<Props<K>> {
    protected render(): any;
    private _checkboxListener;
    private _isSelected;
    protected _vprops?: VProps<K>;
}
// Custom Element interfaces
export interface SelectorElement<Key> extends JetElement<SelectorElementSettableProperties<Key>> {
  /**
   * Specifies the row key of each selector. If the selectionMode property is 'all', rowKey is ignored.
   */
  rowKey?: Props<Key>['rowKey'];
  /**
   * Specifies the selectedKeys, should be hooked into the collection component.
   */
  selectedKeys: Props<Key>['selectedKeys'];
  /**
   * Specifies the selection mode.
   */
  selectionMode?: Props<Key>['selectionMode'];
  addEventListener<T extends keyof SelectorElementEventMap<Key>>(type: T, listener: (this: HTMLElement, ev: SelectorElementEventMap<Key>[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof SelectorElementSettableProperties<Key>>(property: T): SelectorElement<Key>[T];
  getProperty(property: string): any;
  setProperty<T extends keyof SelectorElementSettableProperties<Key>>(property: T, value: SelectorElementSettableProperties<Key>[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, SelectorElementSettableProperties<Key>>): void;
  setProperties(properties: SelectorElementSettablePropertiesLenient<Key>): void;
}
export namespace SelectorElement {
  // tslint:disable-next-line interface-over-type-literal
  type rowKeyChanged<Key> = JetElementCustomEvent<SelectorElement<Key>["rowKey"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectedKeysChanged<Key> = JetElementCustomEvent<SelectorElement<Key>["selectedKeys"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectionModeChanged<Key> = JetElementCustomEvent<SelectorElement<Key>["selectionMode"]>;
}
export interface SelectorElementEventMap<Key> extends HTMLElementEventMap {
  'rowKeyChanged': JetElementCustomEvent<SelectorElement<Key>["rowKey"]>;
  'selectedKeysChanged': JetElementCustomEvent<SelectorElement<Key>["selectedKeys"]>;
  'selectionModeChanged': JetElementCustomEvent<SelectorElement<Key>["selectionMode"]>;
}
export interface SelectorElementSettableProperties<Key> extends JetSettableProperties {
  /**
   * Specifies the row key of each selector. If the selectionMode property is 'all', rowKey is ignored.
   */
  rowKey?: Props<Key>['rowKey'];
  /**
   * Specifies the selectedKeys, should be hooked into the collection component.
   */
  selectedKeys: Props<Key>['selectedKeys'];
  /**
   * Specifies the selection mode.
   */
  selectionMode?: Props<Key>['selectionMode'];
}
export interface SelectorElementSettablePropertiesLenient<Key> extends Partial<SelectorElementSettableProperties<Key>> {
  [key: string]: any;
}
export declare type ojSelector<Key> = SelectorElement<Key>;
export declare type ojSelectorEventMap<Key> = SelectorElementEventMap<Key>;
export declare type ojSelectorSettableProperties<Key> = SelectorElementSettableProperties<Key>;
export declare type ojSelectorSettablePropertiesLenient<Key> = SelectorElementSettablePropertiesLenient<Key>;
export interface SelectorProperties<Key> extends Partial<SelectorElementSettableProperties<Key>>, GlobalAttributes {}
export interface VProps<Key> extends Props<Key>, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-selector": SelectorProperties<any>;
    }
  }
}
