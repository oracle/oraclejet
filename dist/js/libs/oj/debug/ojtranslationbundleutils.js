/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojconfig', '@oracle/oraclejet-preact/utils/UNSAFE_matchTranslationBundle', '@oracle/oraclejet-preact/resources/nls/supportedLocales'], function (exports, ojconfig, UNSAFE_matchTranslationBundle, supportedLocales) { 'use strict';

    supportedLocales = supportedLocales && Object.prototype.hasOwnProperty.call(supportedLocales, 'default') ? supportedLocales['default'] : supportedLocales;

    const SUPPORTED_LOCALES = new Set(supportedLocales);
    const _loaders = new Map();
    const _promises = new Map();
    /**
     * Registers translation bundle loaders.
     * This function is meant to be called during the registration of the VComponent
     * custom element if that custom element or its dependencies are using V2 translation
     * bundles.
     *
     * @param bundles a JS object with keys representing bundle Ids and values representing loaders
     * @private
     */
    const registerTranslationBundleLoaders = (bundles) => {
        const keys = Object.keys(bundles);
        keys.forEach((key) => {
            if (!_loaders.has(key)) {
                _loaders.set(key, bundles[key]);
            }
        });
    };
    /**
     * Returns a Promise that resolves to a translationBundle for the current locale.
     *
     * @param bundleId - the Id of the bundle
     * @returns a Promise that will resolve to the translation bundle contents
     * @private
     */
    const getTranslationBundlePromise = (bundleId) => {
        let promise = _promises.get(bundleId);
        if (!promise) {
            promise = _loaders.get(bundleId)(getTranslationBundleLocale(bundleId));
            _promises.set(bundleId, promise);
        }
        return promise;
    };
    /**
     * Returns a Promise for all currently registered V2 translation bundles
     *
     * @returns a Promise that will resolve when all pending V2 translation bundles are loaded
     * @private
     */
    const loadAllPendingBundles = () => {
        // We are not caching the Promise because some new components using other bundle Ids may be registered later
        const promises = Array.from(_loaders.keys(), (bundleId) => getTranslationBundlePromise(bundleId));
        return Promise.all(promises);
    };
    /**
     * Finds the best match for a given locale within a set of supported locales.
     * @param {string} locale - user's locale
     * @param {Set} supportedLocales - the set of supported locales
     * @return {string|null} a locale representing the best match for the user's locale, or null if no match was found
     */
    const matchTranslationBundle = (locale, supportedLocales) => UNSAFE_matchTranslationBundle.matchTranslationBundle([locale], supportedLocales);
    /**
     * This is an IIFE which returns a function that returns the best-matching locale amongst the supported
     * locales based on the current RT locale (as indicated by ojconfig).  This matching is done once and the result
     * is stored in closure scope (hence the IIFE).
     *
     * Note that getTranslationBundleLocale() currently handles ONLY '@oracle/oraclejet-preact' translation bundle.
     * However, the rest of the methods in this module are ready to deal with other bundle Ids.
     * To support random bundle Ids, we will most likely have to enhance our custom TSC to inlude the list of supported
     * locales for each entry in the translation bundle map.
     *
     * @private
     */
    const getTranslationBundleLocale = (() => {
        let translationBundleLocale;
        return (bundleId) => {
            if (translationBundleLocale === undefined) {
                translationBundleLocale = UNSAFE_matchTranslationBundle.matchTranslationBundle([ojconfig.getLocale()], SUPPORTED_LOCALES);
            }
            return translationBundleLocale;
        };
    })();

    exports.getTranslationBundlePromise = getTranslationBundlePromise;
    exports.loadAllPendingBundles = loadAllPendingBundles;
    exports.matchTranslationBundle = matchTranslationBundle;
    exports.registerTranslationBundleLoaders = registerTranslationBundleLoaders;

    Object.defineProperty(exports, '__esModule', { value: true });

});
