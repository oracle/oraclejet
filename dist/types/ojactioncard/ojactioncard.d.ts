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
declare class Props {
    children?: VComponent.VNode[];
    tabIndex?: number;
    'role'?: string;
    onOjAction?: VComponent.Action<ActionDetail>;
}
declare type State = {
    active?: boolean;
    focus?: boolean;
};
declare type ActionDetail = {
    originalEvent: Event;
};
export declare class ActionCard extends VComponent<Props, State> {
    private _classOverlay;
    private _rootElem;
    private readonly _rootElemRef;
    constructor(props: Readonly<Props>);
    protected render(): any;
    private _isFromActiveSource;
    private _handleOjAction;
    private _handleTouchstart;
    private _handleTouchend;
    private _handleTouchcancel;
    private _handleTouchmove;
    private _handleKeydown;
    private _handleKeyup;
    private _handleMousedown;
    private _handleMouseup;
    private _handleMousemove;
    private _handleFocusin;
    private _handleFocusout;
    protected _vprops?: VProps;
}
// Custom Element interfaces
export interface ActionCardElement extends JetElement<ActionCardElementSettableProperties> {
  addEventListener<T extends keyof ActionCardElementEventMap>(type: T, listener: (this: HTMLElement, ev: ActionCardElementEventMap[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof ActionCardElementSettableProperties>(property: T): ActionCardElement[T];
  getProperty(property: string): any;
  setProperty<T extends keyof ActionCardElementSettableProperties>(property: T, value: ActionCardElementSettableProperties[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ActionCardElementSettableProperties>): void;
  setProperties(properties: ActionCardElementSettablePropertiesLenient): void;
}
export namespace ActionCardElement {
  interface ojAction extends CustomEvent<ActionDetail & {
    [propName: string]: any;
  }>{}
}
export interface ActionCardElementEventMap extends HTMLElementEventMap {
  'ojAction': ActionCardElement.ojAction
}
export interface ActionCardElementSettableProperties extends JetSettableProperties {
}
export interface ActionCardElementSettablePropertiesLenient extends Partial<ActionCardElementSettableProperties> {
  [key: string]: any;
}
export interface ActionCardProperties extends Partial<ActionCardElementSettableProperties>, GlobalAttributes {}
export interface VProps extends Props, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-action-card": ActionCardProperties;
    }
  }
}
