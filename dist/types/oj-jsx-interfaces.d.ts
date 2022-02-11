/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
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
  }
}
