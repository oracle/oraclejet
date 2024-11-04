/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren, ClassAttributes, JSX as JSXPreact } from 'preact';

export type LoadIntrinsicElements = {};

declare module 'preact' {
  export namespace JSX {
    export interface DOMAttributes<Target extends EventTarget> {
      onfocusin?: JSXPreact.FocusEventHandler<Target> | undefined;
      onfocusinCapture?: JSXPreact.FocusEventHandler<Target> | undefined;
      onfocusout?: JSXPreact.FocusEventHandler<Target> | undefined;
      onfocusoutCapture?: JSXPreact.FocusEventHandler<Target> | undefined;
    }
    export interface HTMLAttributes<RefType extends EventTarget = EventTarget>
      extends ClassAttributes<RefType>,
        DOMAttributes<RefType>,
        JSXPreact.AriaAttributes {
      render?: RefType extends HTMLTemplateElement ? (context?: any) => ComponentChildren : never;
    }
  }
}
