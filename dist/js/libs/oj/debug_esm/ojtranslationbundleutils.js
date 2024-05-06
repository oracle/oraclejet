/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { getLocale } from 'ojs/ojconfig';
import { matchTranslationBundle } from '@oracle/oraclejet-preact/utils/UNSAFE_matchTranslationBundle';
import supportedLocales from '@oracle/oraclejet-preact/resources/nls/supportedLocales';

const SUPPORTED_LOCALES = new Set(supportedLocales);
const getTranslationBundlePromiseFromLoader = (loader) => {
    return loader(getTranslationBundleLocale());
};
const getTranslationBundleLocale = (() => {
    let translationBundleLocale;
    return () => {
        if (translationBundleLocale === undefined) {
            translationBundleLocale = matchTranslationBundle([getLocale()], SUPPORTED_LOCALES);
        }
        return translationBundleLocale;
    };
})();

export { getTranslationBundlePromiseFromLoader };
