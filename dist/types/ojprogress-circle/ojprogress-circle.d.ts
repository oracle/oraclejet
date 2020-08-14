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
    size?: 'sm' | 'md' | 'lg';
    'aria-valuemin'?: string;
    'aria-valuemax'?: string;
    'aria-valuetext'?: string;
    'aria-valuenow'?: string;
    'role'?: string;
}
export declare class ProgressCircle extends VComponent<Props> {
    protected render(): any;
    private _renderIndeterminateCircle;
    private _renderDeterminateCircle;
    private _getClipPath;
    private _calculateTangent;
    protected _vprops?: VProps;
}
// Custom Element interfaces
export interface ProgressCircleElement extends JetElement<ProgressCircleElementSettableProperties> {
  /**
   * The maximum allowed value.
   */
  max?: Props['max'];
  /**
   * Specifies the size of the progress circle.
   */
  size?: Props['size'];
  /**
   * The value of the Progress Circle.
   */
  value?: Props['value'];
  addEventListener<T extends keyof ProgressCircleElementEventMap>(type: T, listener: (this: HTMLElement, ev: ProgressCircleElementEventMap[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof ProgressCircleElementSettableProperties>(property: T): ProgressCircleElement[T];
  getProperty(property: string): any;
  setProperty<T extends keyof ProgressCircleElementSettableProperties>(property: T, value: ProgressCircleElementSettableProperties[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ProgressCircleElementSettableProperties>): void;
  setProperties(properties: ProgressCircleElementSettablePropertiesLenient): void;
}
export namespace ProgressCircleElement {
  // tslint:disable-next-line interface-over-type-literal
  type maxChanged = JetElementCustomEvent<ProgressCircleElement["max"]>;
  // tslint:disable-next-line interface-over-type-literal
  type sizeChanged = JetElementCustomEvent<ProgressCircleElement["size"]>;
  // tslint:disable-next-line interface-over-type-literal
  type valueChanged = JetElementCustomEvent<ProgressCircleElement["value"]>;
}
export interface ProgressCircleElementEventMap extends HTMLElementEventMap {
  'maxChanged': JetElementCustomEvent<ProgressCircleElement["max"]>;
  'sizeChanged': JetElementCustomEvent<ProgressCircleElement["size"]>;
  'valueChanged': JetElementCustomEvent<ProgressCircleElement["value"]>;
}
export interface ProgressCircleElementSettableProperties extends JetSettableProperties {
  /**
   * The maximum allowed value.
   */
  max?: Props['max'];
  /**
   * Specifies the size of the progress circle.
   */
  size?: Props['size'];
  /**
   * The value of the Progress Circle.
   */
  value?: Props['value'];
}
export interface ProgressCircleElementSettablePropertiesLenient extends Partial<ProgressCircleElementSettableProperties> {
  [key: string]: any;
}
export declare type ojProgressCircle = ProgressCircleElement;
export declare type ojProgressCircleEventMap = ProgressCircleElementEventMap;
export declare type ojProgressCircleSettableProperties = ProgressCircleElementSettableProperties;
export declare type ojProgressCircleSettablePropertiesLenient = ProgressCircleElementSettablePropertiesLenient;
export interface ProgressCircleProperties extends Partial<ProgressCircleElementSettableProperties>, GlobalAttributes {}
export interface VProps extends Props, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-progress-circle": ProgressCircleProperties;
    }
  }
}
