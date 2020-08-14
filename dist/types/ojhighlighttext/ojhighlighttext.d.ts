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
    text?: string;
    matchText?: string;
}
export declare class HighlightText extends VComponent<Props> {
    private _HIGHLIGHT_TOKEN;
    constructor(props: Readonly<Props>);
    protected render(): any;
    private _highlighter;
    private _escapeRegExp;
    protected _vprops?: VProps;
}
// Custom Element interfaces
export interface HighlightTextElement extends JetElement<HighlightTextElementSettableProperties> {
  /**
   * The text string to match.
   */
  matchText?: Props['matchText'];
  /**
   * The text string to apply highlighting to.
   */
  text?: Props['text'];
  addEventListener<T extends keyof HighlightTextElementEventMap>(type: T, listener: (this: HTMLElement, ev: HighlightTextElementEventMap[T]) => any, useCapture?: boolean): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  getProperty<T extends keyof HighlightTextElementSettableProperties>(property: T): HighlightTextElement[T];
  getProperty(property: string): any;
  setProperty<T extends keyof HighlightTextElementSettableProperties>(property: T, value: HighlightTextElementSettableProperties[T]): void;
  setProperty<T extends string>(property: T, value: JetSetPropertyType<T, HighlightTextElementSettableProperties>): void;
  setProperties(properties: HighlightTextElementSettablePropertiesLenient): void;
}
export namespace HighlightTextElement {
  // tslint:disable-next-line interface-over-type-literal
  type matchTextChanged = JetElementCustomEvent<HighlightTextElement["matchText"]>;
  // tslint:disable-next-line interface-over-type-literal
  type textChanged = JetElementCustomEvent<HighlightTextElement["text"]>;
}
export interface HighlightTextElementEventMap extends HTMLElementEventMap {
  'matchTextChanged': JetElementCustomEvent<HighlightTextElement["matchText"]>;
  'textChanged': JetElementCustomEvent<HighlightTextElement["text"]>;
}
export interface HighlightTextElementSettableProperties extends JetSettableProperties {
  /**
   * The text string to match.
   */
  matchText?: Props['matchText'];
  /**
   * The text string to apply highlighting to.
   */
  text?: Props['text'];
}
export interface HighlightTextElementSettablePropertiesLenient extends Partial<HighlightTextElementSettableProperties> {
  [key: string]: any;
}
export interface HighlightTextProperties extends Partial<HighlightTextElementSettableProperties>, GlobalAttributes {}
export interface VProps extends Props, GlobalAttributes {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "oj-highlight-text": HighlightTextProperties;
    }
  }
}
