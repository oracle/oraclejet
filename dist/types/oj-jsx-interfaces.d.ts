/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { VComponent } from 'ojs/ojvcomponent';

/**
 * This list should be kept in sync with HtmlProperty2AttrMapping.js
 */
export interface GlobalAttributes {
  accessKey?: string;
  autocapitalize?: 'on' | 'off' | 'none' | 'sentences' | 'words' | 'characters' | string;
  autofocus?: boolean;
  /**
   * The class JSX attribute supports space delimited class names in
   * addition to an object whose keys are individual style classes and
   * whose values are booleans to determine whether those style classes
   * should be present in the DOM, e.g. className={ { 'oj-hover': isHovered } }.
   */
  class?: string | object;
  contentEditable?: boolean;
  dir?: 'ltr' | 'rtl' | 'auto' | string;
  draggable?: boolean;
  enterKeyHint?: string;
  hidden?: boolean;
  id?: string;
  inputMode?: string;
  is?: string;
  itemid?: string;
  itemprop?: string;
  itemref?: string;
  itemscope?: string;
  itemtype?: string;
  lang?: string;
  role?: string;
  slot?: string;
  spellcheck?: boolean;
  /**
   * Style only supports object values e.g. style={ {color: 'blue', fontSize: '12px'} }.
   */
  style?: object;
  tabIndex?: number;
  title?: string;
  translate?: string;

  // Event Handler JSX Attributes
  onAbort?: (event: Event) => void;
  onAuxclick?: (event: Event) => void;
  onBlur?: (event: Event) => void;
  onCancel?: (event: Event) => void;
  onCanplay?: (event: Event) => void;
  onCanplaythrough?: (event: Event) => void;
  onChange?: (event: Event) => void;
  onClick?: (event: Event) => void;
  onClose?: (event: Event) => void;
  onContextmenu?: (event: Event) => void;
  onCopy?: (event: Event) => void;
  onCuechange?: (event: Event) => void;
  onCut?: (event: Event) => void;
  onDblclick?: (event: Event) => void;
  onDrag?: (event: Event) => void;
  onDragend?: (event: Event) => void;
  onDragenter?: (event: Event) => void;
  onDragexit?: (event: Event) => void;
  onDragleave?: (event: Event) => void;
  onDragover?: (event: Event) => void;
  onDragstart?: (event: Event) => void;
  onDrop?: (event: Event) => void;
  onDurationchange?: (event: Event) => void;
  onEmptied?: (event: Event) => void;
  onEnded?: (event: Event) => void;
  onError?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  onFormdata?: (event: Event) => void;
  onInput?: (event: Event) => void;
  onInvalid?: (event: Event) => void;
  onKeydown?: (event: Event) => void;
  onKeypress?: (event: Event) => void;
  onKeyup?: (event: Event) => void;
  onLoad?: (event: Event) => void;
  onLoadeddata?: (event: Event) => void;
  onLoadedmetadata?: (event: Event) => void;
  onLoadstart?: (event: Event) => void;
  onMousedown?: (event: Event) => void;
  onMouseenter?: (event: Event) => void;
  onMouseleave?: (event: Event) => void;
  onMousemove?: (event: Event) => void;
  onMouseout?: (event: Event) => void;
  onMouseover?: (event: Event) => void;
  onMouseup?: (event: Event) => void;
  onPaste?: (event: Event) => void;
  onPause?: (event: Event) => void;
  onPlay?: (event: Event) => void;
  onPlaying?: (event: Event) => void;
  onProgress?: (event: Event) => void;
  onRatechange?: (event: Event) => void;
  onReset?: (event: Event) => void;
  onResize?: (event: Event) => void;
  onScroll?: (event: Event) => void;
  onSecuritypolicyviolation?: (event: Event) => void;
  onSeeked?: (event: Event) => void;
  onSeeking?: (event: Event) => void;
  onSelect?: (event: Event) => void;
  onSlotchange?: (event: Event) => void;
  onStalled?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
  onSuspend?: (event: Event) => void;
  onTimeupdate?: (event: Event) => void;
  onToggle?: (event: Event) => void;
  onVolumechange?: (event: Event) => void;
  onWaiting?: (event: Event) => void;
  onWheel?: (event: Event) => void;

  [key: string]: any;
  /**
   * The 'className' JSX attribute is not supported. Use the 'class' JSX attribute instead.
   */
  className?: never;
  /**
   * The 'htmlFor' JSX attribute is not supported. Use the 'for' JSX attribute instead.
   */
  htmlFor?: never; // TODO move this to input element properties when we add that support
  /**
   * The 'defaultChecked' JSX attribute is not supported. Use the 'checked' JSX attribute instead.
   */
  defaultChecked?: never;
  /**
   * The 'defaultMuted' JSX attribute is not supported. Use the 'muted' JSX attribute instead.
   */
  defaultMuted?: never;
  /**
   * The 'defaultSelected' JSX attribute is not supported. Use the 'selected' JSX attribute instead.
   */
  defaultSelected?: never;
  /**
   * The 'defaultValue' JSX attribute is not supported. Use the 'value' JSX attribute instead.
   */
  defaultValue?: never;
  /**
   * The 'relList' JSX attribute is not supported. Use the 'rel' JSX attribute instead.
   */
  relList?: never;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // TODO add support for native HTML elements
      [elemName: string]: any;
    }
    interface IntrinsicAttributes extends GlobalAttributes {
      children?: VComponent.VNode[];
      key?: string | number;
      ref?: VComponent.RefCallback;
    }
    interface IntrinsicClassAttributes {
      key?: string | number;
      ref?: VComponent.RefCallback;
    }
    interface ElementAttributesProperty {
      _vprops: {};
    }
    interface ElementClass extends VComponent {}
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
