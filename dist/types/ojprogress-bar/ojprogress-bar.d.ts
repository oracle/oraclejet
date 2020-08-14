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
    max?: number;
    value?: number;
    'aria-valuemin'?: string;
    'aria-valuemax'?: string;
    'aria-valuetext'?: string;
    'aria-valuenow'?: string;
    'role'?: string;
}
export declare class ProgressBar extends VComponent<Props> {
    protected render(): any;
    private _renderDeterminateBar;
    private _renderIndeterminateBar;
    protected _vprops?: VProps;
}
// Custom Element interfaces
export interface ProgressBarElement extends JetElement<ProgressBarElementSettableProperties> {
  /**
   * The maximum allowed value.
   */
  max?: Props['max'];
  /**
   * The value of the Progress Bar.
   */
  value?: Props['value'];
  addEventListener<T extends keyof ProgressBarElementEventMap>(type: T, listener: (this: HTMLElement, ev: ProgressBarElementEventMap[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof ProgressBarElementSettableProperties>(property: T): ProgressBarElement[T];
  getProperty(property: string): any;
  setProperty<T extends keyof ProgressBarElementSettableProperties>(property: T, value: ProgressBarElementSettableProperties[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ProgressBarElementSettableProperties>): void;
  setProperties(properties: ProgressBarElementSettablePropertiesLenient): void;
}
export namespace ProgressBarElement {
  // tslint:disable-next-line interface-over-type-literal
  type maxChanged = JetElementCustomEvent<ProgressBarElement["max"]>;
  // tslint:disable-next-line interface-over-type-literal
  type valueChanged = JetElementCustomEvent<ProgressBarElement["value"]>;
}
export interface ProgressBarElementEventMap extends HTMLElementEventMap {
  'maxChanged': JetElementCustomEvent<ProgressBarElement["max"]>;
  'valueChanged': JetElementCustomEvent<ProgressBarElement["value"]>;
}
export interface ProgressBarElementSettableProperties extends JetSettableProperties {
  /**
   * The maximum allowed value.
   */
  max?: Props['max'];
  /**
   * The value of the Progress Bar.
   */
  value?: Props['value'];
}
export interface ProgressBarElementSettablePropertiesLenient extends Partial<ProgressBarElementSettableProperties> {
  [key: string]: any;
}
export declare type ojProgressBar = ProgressBarElement;
export declare type ojProgressBarEventMap = ProgressBarElementEventMap;
export declare type ojProgressBarSettableProperties = ProgressBarElementSettableProperties;
export declare type ojProgressBarSettablePropertiesLenient = ProgressBarElementSettablePropertiesLenient;
export interface ProgressBarProperties extends Partial<ProgressBarElementSettableProperties>, GlobalAttributes {}
export interface VProps extends Props, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-progress-bar": ProgressBarProperties;
    }
  }
}
