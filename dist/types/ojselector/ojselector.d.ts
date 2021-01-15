/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from 'ojs/index';
import { GlobalAttributes } from 'ojs/oj-jsx-interfaces';
import { ElementVComponent } from 'ojs/ojvcomponent-element';
import { KeySet } from 'ojs/ojkeyset';
declare class Props<Key> {
    rowKey?: Key | null;
    indeterminate?: boolean;
    selectedKeys: KeySet<Key> | null;
    onSelectedKeysChanged?: ElementVComponent.PropertyChanged<KeySet<Key> | null>;
    onIndeterminateChanged?: ElementVComponent.PropertyChanged<boolean>;
    selectionMode?: 'all' | 'multiple' | 'single';
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
declare type State = {
    focus?: boolean;
};
export declare class Selector<K> extends ElementVComponent<Props<K>, State> {
    constructor(props: Readonly<Props<K>>);
    protected render(): any;
    private _handleFocusin;
    private _handleFocusout;
    private _checkboxListener;
    private _isSelected;
    protected _vprops?: VProps<K>;
}
// Custom Element interfaces
export interface SelectorElement<K> extends JetElement<SelectorElementSettableProperties<K>>, SelectorElementSettableProperties<K> {
  addEventListener<T extends keyof SelectorElementEventMap<K>>(type: T, listener: (this: HTMLElement, ev: SelectorElementEventMap<K>[T]) => any, options?: (boolean|AddEventListenerOptions)): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean|AddEventListenerOptions)): void;
  getProperty<T extends keyof SelectorElementSettableProperties<K>>(property: T): SelectorElement<K>[T];
  getProperty(property: string): any;
  setProperty<T extends keyof SelectorElementSettableProperties<K>>(property: T, value: SelectorElementSettableProperties<K>[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, SelectorElementSettableProperties<K>>): void;
  setProperties(properties: SelectorElementSettablePropertiesLenient<K>): void;
}
export namespace SelectorElement {
  // tslint:disable-next-line interface-over-type-literal
  type indeterminateChanged<K> = JetElementCustomEvent<SelectorElement<K>["indeterminate"]>;
  // tslint:disable-next-line interface-over-type-literal
  type rowKeyChanged<K> = JetElementCustomEvent<SelectorElement<K>["rowKey"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectedKeysChanged<K> = JetElementCustomEvent<SelectorElement<K>["selectedKeys"]>;
  // tslint:disable-next-line interface-over-type-literal
  type selectionModeChanged<K> = JetElementCustomEvent<SelectorElement<K>["selectionMode"]>;
}
export interface SelectorElementEventMap<K> extends HTMLElementEventMap {
  'indeterminateChanged': JetElementCustomEvent<SelectorElement<K>["indeterminate"]>;
  'rowKeyChanged': JetElementCustomEvent<SelectorElement<K>["rowKey"]>;
  'selectedKeysChanged': JetElementCustomEvent<SelectorElement<K>["selectedKeys"]>;
  'selectionModeChanged': JetElementCustomEvent<SelectorElement<K>["selectionMode"]>;
}
export interface SelectorElementSettableProperties<Key> extends JetSettableProperties {
  /**
  * Visual only state to indicate partial selection
  */
  indeterminate?: Props<Key>['indeterminate'];
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
export interface SelectorProperties<Key> extends Partial<SelectorElementSettableProperties<Key>>, GlobalAttributes {
}
export interface VProps<Key> extends Props<Key>, GlobalAttributes {
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-selector": SelectorProperties<any>;
    }
  }
}
