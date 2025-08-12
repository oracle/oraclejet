/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * This proxy is used by JET's test adapters to access runtime modules that are needed to perform
 * testing actions.
 */
const TEST_OBJ_NAME = '__ojwebdrivertest_proxy';
const modules = {
    BusyContext: () => import('ojs/ojcontext').then(({ default: Context }) => Context.getPageContext().getBusyContext()),
    Chai: () => import('chai').then(({ default: Chai }) => Chai),
    Core: () => import('ojs/ojcore-base').then(({ default: Core }) => Core),
    CspExpressionEvaluator: () => import('ojs/ojcspexpressionevaluator').then(({ default: CspExpressionEvaluator }) => CspExpressionEvaluator),
    CustomElementUtils: () => import('ojs/ojcustomelement-utils').then(({ CustomElementUtils }) => CustomElementUtils),
    KeySet: () => import('ojs/ojkeyset'),
    KeyUtils: () => import('ojs/ojcore-base').then(({ default: { KeyUtils } }) => KeyUtils),
    Knockout: () => import('knockout')
};
const cachedModules = {};
/**
 * Get the modules defined by names. Modules will be returned in a Promise.
 * await getProxy('ModuleA', 'ModuleB', ...).then(modules => ...)
 * @param moduleNames The module names to fetch
 * @returns {Promise<object[]>} A Promise resolving to all of the requested modules
 */
function getProxy(...moduleNames) {
    return Promise.all(moduleNames.map((name) => {
        if (!modules[name]) {
            throw Error(`module "${name}" does not exist in test proxy`);
        }
        const cache = cachedModules[name];
        if (cache) {
            return Promise.resolve(cache);
        }
        else {
            // call the getter for each module to invoke its dynamic import.
            console.log(`getProxy importing ${name}`);
            return modules[name]().then((result) => {
                cachedModules[name] = result;
                return result;
            });
        }
    }));
}
/**
 * Get the modules defined by names.  Assumes that getProxy has been previously called.
 * This function simply looks up previously imported modules from the cache.
 * @param moduleNames The module names to fetch
 * @returns {object[]} The requested modules
 */
function getCachedModules(...moduleNames) {
    return moduleNames.map((name) => cachedModules[name]);
}
// Guard for webworkers w/o window access
typeof window !== 'undefined' && (window[TEST_OBJ_NAME] = { getProxy, getCachedModules });

export { getCachedModules, getProxy };
