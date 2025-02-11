/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { getLocale } from 'ojs/ojconfig';
import { matchTranslationBundle } from '@oracle/oraclejet-preact/utils/UNSAFE_matchTranslationBundle';
import supportedLocales from '@oracle/oraclejet-preact/resources/nls/supportedLocales';

const SUPPORTED_LOCALES = new Set(supportedLocales);
const _loaders = new Map();
const _promises = new Map();
const registerTranslationBundleLoaders = (bundles) => {
    const keys = Object.keys(bundles);
    keys.forEach((key) => {
        if (!_loaders.has(key)) {
            _loaders.set(key, bundles[key]);
        }
    });
};
const getTranslationBundlePromise = (bundleId) => {
    let promise = _promises.get(bundleId);
    if (!promise) {
        promise = _loaders.get(bundleId)(getTranslationBundleLocale(bundleId));
        _promises.set(bundleId, promise);
    }
    return promise;
};
const loadAllPendingBundles = () => {
    const promises = Array.from(_loaders.keys(), (bundleId) => getTranslationBundlePromise(bundleId));
    return Promise.all(promises);
};
const getTranslationBundleLocale = (() => {
    let translationBundleLocale;
    return (bundleId) => {
        if (translationBundleLocale === undefined) {
            translationBundleLocale = matchTranslationBundle([getLocale()], SUPPORTED_LOCALES);
        }
        return translationBundleLocale;
    };
})();

export { getTranslationBundlePromise, loadAllPendingBundles, registerTranslationBundleLoaders };
