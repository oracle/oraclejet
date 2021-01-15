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
declare class ListItemLayoutProps {
    children?: ElementVComponent.Children;
    overline?: ElementVComponent.Slot;
    selector?: ElementVComponent.Slot;
    leading?: ElementVComponent.Slot;
    secondary?: ElementVComponent.Slot;
    tertiary?: ElementVComponent.Slot;
    metadata?: ElementVComponent.Slot;
    trailing?: ElementVComponent.Slot;
    action?: ElementVComponent.Slot;
    quaternary?: ElementVComponent.Slot;
    navigation?: ElementVComponent.Slot;
}
export declare class ListItemLayout extends ElementVComponent<ListItemLayoutProps> {
    private _hasContent;
    private _getWrappedSlotContent;
    private _getWrappedSlotContentWithClickThroughDisabled;
    protected render(): any;
    protected _vprops?: VListItemLayoutProps;
}
// Custom Element interfaces
export interface ListItemLayoutElement extends JetElement<ListItemLayoutElementSettableProperties>, ListItemLayoutElementSettableProperties {
  addEventListener<T extends keyof ListItemLayoutElementEventMap>(type: T, listener: (this: HTMLElement, ev: ListItemLayoutElementEventMap[T]) => any, options?: (boolean|AddEventListenerOptions)): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean|AddEventListenerOptions)): void;
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
export interface ListItemLayoutProperties extends Partial<ListItemLayoutElementSettableProperties>, GlobalAttributes {
}
export interface VListItemLayoutProps extends ListItemLayoutProps, GlobalAttributes {
}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-list-item-layout": ListItemLayoutProperties;
    }
  }
}
