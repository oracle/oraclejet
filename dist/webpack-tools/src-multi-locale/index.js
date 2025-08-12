/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Example entry point module
 */
import { loadTranslationBundles } from 'oraclejet/dist/webpack-tools/src-multi-locale/bootstrap';

export const test = async ()=> {
  // Passing no argument toloadTranslationBundles() will result in auto-detection of the preferred locale
  await loadTranslationBundles();
  // Use a dynamic import to load your application startup code here
  // import('./app');
}

