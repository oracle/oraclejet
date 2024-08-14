/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const TEST_OBJ_NAME = '__ojwebdrivertest_proxy';
const modules = {
    BusyContext: () => import('ojs/ojcontext').then(({ default: Context }) => Context.getPageContext().getBusyContext()),
    Chai: () => import('chai').then(({ default: Chai }) => Chai),
    CspExpressionEvaluator: () => import('ojs/ojcspexpressionevaluator').then(({ default: CspExpressionEvaluator }) => CspExpressionEvaluator),
    CustomElementUtils: () => import('ojs/ojcustomelement-utils').then(({ CustomElementUtils }) => CustomElementUtils),
    KeySet: () => import('ojs/ojkeyset'),
    KeyUtils: () => import('ojs/ojcore-base').then(({ default: { KeyUtils } }) => KeyUtils),
    Knockout: () => import('knockout')
};
const cachedModules = {};
function getProxy(...moduleNames) {
    return Promise.all(moduleNames.map((name) => {
        if (!modules[name]) {
            throw Error(`module "${name}" does not exist in test proxy`);
        }
        console.log(`getProxy importing ${name}`);
        const cache = cachedModules[name];
        if (cache) {
            return Promise.resolve(cache);
        }
        else {
            return modules[name]().then((result) => {
                cachedModules[name] = result;
                return result;
            });
        }
    }));
}
function getCachedModules(...moduleNames) {
    return moduleNames.map((name) => cachedModules[name]);
}
typeof window !== 'undefined' && (window[TEST_OBJ_NAME] = { getProxy, getCachedModules });

export { getCachedModules, getProxy };
