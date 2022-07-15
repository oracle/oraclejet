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
export declare function matchTranslationBundle(preferredLocales: Array<string>, supportedLocales: Set<string>): string | null;
