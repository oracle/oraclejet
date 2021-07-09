/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ComponentChildren } from 'preact';

export type LoadIntrinsicElements = {};

type TemplateProperties = Pick<preact.JSX.HTMLAttributes, 'slot' | 'key' | 'ref'> & {
  render?: (context?: any) => ComponentChildren;
};

declare global {
  // Extend the Preact types
  namespace preact.JSX {
    interface IntrinsicElements {
      // Allow template elements in jsx
      template: TemplateProperties;
    }

    interface DOMAttributes<Target extends EventTarget> {
      // Preact does not support onFocusIn/Out events so we must
      // use the lowercase syntax and add in the type.  Once
      // a fix is available for this Preact issue:
      //
      // https://github.com/preactjs/preact/issues/3186
      //
      // We should remove these entries.  We can also
      // remove the import of oj-jsx-interfaces from metadataTypes.
      onfocusin?: preact.JSX.FocusEventHandler<Target>;
      onfocusout?: preact.JSX.FocusEventHandler<Target>;
    }
  }
}
