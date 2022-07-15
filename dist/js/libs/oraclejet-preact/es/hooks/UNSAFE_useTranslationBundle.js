/* @oracle/oraclejet-preact: 13.0.0 */
import { useContext } from 'preact/hooks';
import { EnvironmentContext } from '../UNSAFE_Environment.js';
import 'preact';
import 'preact/jsx-runtime';
import '../UNSAFE_Layer.js';
import 'preact/compat';

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
    const translations = useContext(EnvironmentContext).translations;
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

export { useTranslationBundle };
/*  */
//# sourceMappingURL=UNSAFE_useTranslationBundle.js.map
