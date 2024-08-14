/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['require', 'exports'], function (require, exports) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) { return e; } else {
            var n = {};
            if (e) {
                Object.keys(e).forEach(function (k) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                });
            }
            n['default'] = e;
            return n;
        }
    }

    const TEST_OBJ_NAME = '__ojwebdrivertest_proxy';
    const modules = {
        BusyContext: () => new Promise(function (resolve, reject) { require(['ojs/ojcontext'], function (m) { resolve(_interopNamespace(m)); }, reject) }).then(({ default: Context }) => Context.getPageContext().getBusyContext()),
        Chai: () => new Promise(function (resolve, reject) { require(['chai'], function (m) { resolve(_interopNamespace(m)); }, reject) }).then(({ default: Chai }) => Chai),
        CspExpressionEvaluator: () => new Promise(function (resolve, reject) { require(['ojs/ojcspexpressionevaluator'], function (m) { resolve(_interopNamespace(m)); }, reject) }).then(({ default: CspExpressionEvaluator }) => CspExpressionEvaluator),
        CustomElementUtils: () => new Promise(function (resolve, reject) { require(['ojs/ojcustomelement-utils'], function (m) { resolve(_interopNamespace(m)); }, reject) }).then(({ CustomElementUtils }) => CustomElementUtils),
        KeySet: () => new Promise(function (resolve, reject) { require(['ojs/ojkeyset'], function (m) { resolve(_interopNamespace(m)); }, reject) }),
        KeyUtils: () => new Promise(function (resolve, reject) { require(['ojs/ojcore-base'], function (m) { resolve(_interopNamespace(m)); }, reject) }).then(({ default: { KeyUtils } }) => KeyUtils),
        Knockout: () => new Promise(function (resolve, reject) { require(['knockout'], function (m) { resolve(_interopNamespace(m)); }, reject) })
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

    exports.getCachedModules = getCachedModules;
    exports.getProxy = getProxy;

    Object.defineProperty(exports, '__esModule', { value: true });

});
