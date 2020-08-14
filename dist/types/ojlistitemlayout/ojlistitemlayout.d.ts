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
declare class ListItemLayoutProps {
    selector?: VComponent.Slot;
    leading?: VComponent.Slot;
    overline?: VComponent.Slot;
    children?: VComponent.VNode[];
    secondary?: VComponent.Slot;
    tertiary?: VComponent.Slot;
    link?: VComponent.Slot;
    metadata?: VComponent.Slot;
    trailing?: VComponent.Slot;
    action?: VComponent.Slot;
}
export declare class ListItemLayout extends VComponent<ListItemLayoutProps> {
    private _hasContent;
    private _getWrappedSlotContent;
    protected render(): any;
    protected _vprops?: VListItemLayoutProps;
}
// Custom Element interfaces
export interface ListItemLayoutElement extends JetElement<ListItemLayoutElementSettableProperties> {
  addEventListener<T extends keyof ListItemLayoutElementEventMap>(type: T, listener: (this: HTMLElement, ev: ListItemLayoutElementEventMap[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof ListItemLayoutElementSettableProperties>(property: T): ListItemLayoutElement[T];
  getProperty(property: string): any;
  setProperty<T extends keyof ListItemLayoutElementSettableProperties>(property: T, value: ListItemLayoutElementSettableProperties[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ListItemLayoutElementSettableProperties>): void;
  setProperties(properties: ListItemLayoutElementSettablePropertiesLenient): void;
}
export interface ListItemLayoutElementEventMap extends HTMLElementEventMap {
}
export interface ListItemLayoutElementSettableProperties extends JetSettableProperties {
}
export interface ListItemLayoutElementSettablePropertiesLenient extends Partial<ListItemLayoutElementSettableProperties> {
  [key: string]: any;
}
export declare type ojListItemLayout = ListItemLayoutElement;
export declare type ojListItemLayoutEventMap = ListItemLayoutElementEventMap;
export declare type ojListItemLayoutSettableProperties = ListItemLayoutElementSettableProperties;
export declare type ojListItemLayoutSettablePropertiesLenient = ListItemLayoutElementSettablePropertiesLenient;
export interface ListItemLayoutProperties extends Partial<ListItemLayoutElementSettableProperties>, GlobalAttributes {}
export interface VListItemLayoutProps extends ListItemLayoutProps, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-list-item-layout": ListItemLayoutProperties;
    }
  }
}
