/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var UNSAFE_Environment = require('../UNSAFE_Environment.js');
require('preact');
require('preact/jsx-runtime');
require('../UNSAFE_Layer.js');
require('preact/compat');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * useTranslationBundle is a hook to get a translation bundle from the EnvironmentProvider
 * @param bundleId
 * @returns a translation bundle of type T
 */
function useTranslationBundle(bundleId) {
    const translations = hooks.useContext(UNSAFE_Environment.EnvironmentContext).translations;
    const bundle = translations === null || translations === void 0 ? void 0 : translations[bundleId];
    if (!bundle) {
        throw new Error(`Translation bundle ${bundleId} is not loaded.`);
    }
    return bundle;
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useTranslationBundle = useTranslationBundle;
/*  */
//# sourceMappingURL=UNSAFE_useTranslationBundle.js.map
