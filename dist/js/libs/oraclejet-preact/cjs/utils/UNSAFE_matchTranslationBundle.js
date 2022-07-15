/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @returns the best match for user's preferred locale or null if none is found
 * @param preferredLocales - a list of user's preferred locales ordered from the most preferred to the least preferred
 * @param supportedLocales - a set of locales supported by the application
 * @ignore
 */
function matchTranslationBundle(preferredLocales, supportedLocales) {
    let match = null;
    for (let l = 0; match === null && l < preferredLocales.length; l++) {
        const locale = preferredLocales[l];
        if (supportedLocales.has(locale)) {
            match = locale;
        }
        else {
            match = _findPartialMatch(locale, supportedLocales);
        }
    }
    return match;
}
function _findPartialMatch(locale, supportedLocales) {
    let match = null;
    const sep = '-';
    const parts = locale.split(sep);
    while (match === null && parts.length > 1) {
        parts.pop();
        const partial = parts.join(sep);
        if (supportedLocales.has(partial)) {
            match = partial;
        }
    }
    return match;
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.matchTranslationBundle = matchTranslationBundle;
/*  */
//# sourceMappingURL=UNSAFE_matchTranslationBundle.js.map
