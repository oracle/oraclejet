/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Defines user specific environment
 */
export declare type User = {
    locale: string;
    direction: 'rtl' | 'ltr';
    forcedColors: 'none' | 'active';
};
/**
 * Defines theme specific environment that can be overridden by descendant components
 */
declare type Theme = {
    colorScheme: 'light' | 'dark';
    scale: 'lg' | 'md' | 'sm';
};
/**
 * Defines theme environment on root element
 */
export declare type RootTheme = Theme & {
    name: string;
};
/**
 * Defines translation bundle type.
 */
export declare type TranslationBundle = Record<string, (...args: any[]) => string>;
/**
 * Defines a type for translation property which is an object where
 * - key - string - bundle id
 * - value - object - strings to functions of the type (options?: object)=>string
 *
 * Translation bundle example:
 * const bundle = {
 *  @oracle/oracle-preact-bundle: {
 *      welcome: () => 'bienvenido',
 *      success: () => 'éxito'
 *  }
 * }
 */
declare type Translations = {
    [bundleId: string]: TranslationBundle;
};
/**
 * Environment specified at the root level
 */
export declare type RootEnvironment = {
    user?: Partial<User>;
    theme?: Partial<RootTheme>;
    translations?: Translations;
};
/**
 * Environment specified at the component level
 */
export declare type Environment = {
    theme?: Partial<Theme>;
    translations?: Translations;
};
/**
 * Default environment created for the application
 */
export declare const DefaultEnvironment: {
    user: {
        locale: string;
        direction: string;
        forcedColors: string;
    };
    theme: {
        name: string;
        colorScheme: string;
        scale: string;
    };
};
export declare const EnvironmentContext: import("preact").Context<RootEnvironment>;
export {};
