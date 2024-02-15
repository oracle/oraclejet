/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojconfig', '@oracle/oraclejet-preact/utils/UNSAFE_matchTranslationBundle', '@oracle/oraclejet-preact/resources/nls/supportedLocales'], function (exports, ojconfig, UNSAFE_matchTranslationBundle, supportedLocales) { 'use strict';

    supportedLocales = supportedLocales && Object.prototype.hasOwnProperty.call(supportedLocales, 'default') ? supportedLocales['default'] : supportedLocales;

    const SUPPORTED_LOCALES = new Set(supportedLocales);
    const getTranslationBundlePromiseFromLoader = (loader) => {
        return loader(getTranslationBundleLocale());
    };
    const getTranslationBundleLocale = (() => {
        let translationBundleLocale;
        return () => {
            if (translationBundleLocale === undefined) {
                translationBundleLocale = UNSAFE_matchTranslationBundle.matchTranslationBundle([ojconfig.getLocale()], SUPPORTED_LOCALES);
            }
            return translationBundleLocale;
        };
    })();

    exports.getTranslationBundlePromiseFromLoader = getTranslationBundlePromiseFromLoader;

    Object.defineProperty(exports, '__esModule', { value: true });

});
