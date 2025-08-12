type Loader = (locale: string | null) => Promise<any>;
/**
 * Registers translation bundle loaders.
 * This function is meant to be called during the registration of the VComponent
 * custom element if that custom element or its dependencies are using V2 translation
 * bundles.
 *
 * @param bundles a JS object with keys representing bundle Ids and values representing loaders
 * @private
 */
export declare const registerTranslationBundleLoaders: (bundles: Record<string, Loader>) => void;
/**
 * Returns a Promise that resolves to a translationBundle for the current locale.
 *
 * @param bundleId - the Id of the bundle
 * @returns a Promise that will resolve to the translation bundle contents
 * @private
 */
export declare const getTranslationBundlePromise: (bundleId: string) => Promise<any>;
/**
 * Returns a Promise for all currently registered V2 translation bundles
 *
 * @returns a Promise that will resolve when all pending V2 translation bundles are loaded
 * @private
 */
export declare const loadAllPendingBundles: () => Promise<any[]>;
/**
 * Finds the best match for a given locale within a set of supported locales.
 * @param {string} locale - user's locale
 * @param {Set} supportedLocales - the set of supported locales
 * @return {string|null} a locale representing the best match for the user's locale, or null if no match was found
 */
export declare const matchTranslationBundle: (locale: string, supportedLocales: Set<string>) => string;
export {};