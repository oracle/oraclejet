/* @oracle/oraclejet-preact: 13.1.0 */
import { createContext } from 'preact';
import { jsx } from 'preact/jsx-runtime';
import { useMemo } from 'preact/hooks';
import { LayerManager } from './UNSAFE_Layer.js';
import 'preact/compat';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
var _a, _b;
/**
 * Default environment created for the application
 */
const DefaultEnvironment = {
    user: {
        locale: document.documentElement.getAttribute('lang') || 'en',
        direction: document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr',
        forcedColors: ((_b = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(forced-colors: active)')) === null || _b === void 0 ? void 0 : _b.matches) ? 'active' : 'none'
    },
    theme: {
        name: 'redwood',
        colorScheme: 'light',
        scale: 'lg'
    }
};
const EnvironmentContext = createContext(DefaultEnvironment);

// Custom merge function
function mergeEnvironment(env1, env2) {
    const userValue = Object.assign({}, env1.user, env2 === null || env2 === void 0 ? void 0 : env2.user);
    const themeValue = Object.assign({}, env1.theme, env2 === null || env2 === void 0 ? void 0 : env2.theme);
    // Merge translation values - one level merge
    const targetTranslations = Object.assign({}, env1.translations);
    const sourceTranslations = (env2 === null || env2 === void 0 ? void 0 : env2.translations) || {};
    Object.keys(sourceTranslations).forEach((key) => {
        let newVal = sourceTranslations[key];
        if (targetTranslations[key]) {
            // merge is needed
            newVal = Object.assign({}, targetTranslations[key], newVal);
        }
        targetTranslations[key] = newVal;
    });
    return { user: userValue, theme: themeValue, translations: targetTranslations };
}
/**
 * The RootEnvironmentProvider is a component that allows an application to setup an environment in one place.
 * In order to use it RootEnvironmentProvider should be added as a root of your application.
 * The component receives the RootEnvironment object that will be merged with the default environment and
 * passed to its children.
 */
function RootEnvironmentProvider({ children, environment }) {
    const mergedEnvironment = useMemo(() => mergeEnvironment(DefaultEnvironment, environment), [environment]);
    return (jsx(EnvironmentContext.Provider, Object.assign({ value: mergedEnvironment }, { children: jsx(LayerManager, { children: children }) })));
}
/**
 * The EnvironmentProvider is a component that should be used by the application when there is a need to overwrite
 * environment values for a subtree.
 * The component receives an Environment object that will be merged into the values provided by the nearest ancestor Provider.
 * The new environment will be passed to the component's children.
 * Note that some environment values cannot be overwritten. See the description of the Environment type for the list of values
 * that can be replaced.
 */
function EnvironmentProvider({ children, environment }) {
    return (jsx(EnvironmentContext.Consumer, { children: (consumerEnv) => {
            const mergedEnvironment = useMemo(() => mergeEnvironment(consumerEnv, environment), [consumerEnv, environment]);
            return (jsx(EnvironmentContext.Provider, Object.assign({ value: mergedEnvironment }, { children: children })));
        } }));
}

export { EnvironmentContext, EnvironmentProvider, RootEnvironmentProvider };
/*  */
//# sourceMappingURL=UNSAFE_Environment.js.map
