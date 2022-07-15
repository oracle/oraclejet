/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { Environment, RootEnvironment } from './EnvironmentContext';
export declare type ProviderProperties<Env extends RootEnvironment | Environment> = {
    environment?: Env;
    children?: ComponentChildren;
};
/**
 * The RootEnvironmentProvider is a component that allows an application to setup an environment in one place.
 * In order to use it RootEnvironmentProvider should be added as a root of your application.
 * The component receives the RootEnvironment object that will be merged with the default environment and
 * passed to its children.
 */
export declare function RootEnvironmentProvider({ children, environment }: ProviderProperties<RootEnvironment>): import("preact").JSX.Element;
/**
 * The EnvironmentProvider is a component that should be used by the application when there is a need to overwrite
 * environment values for a subtree.
 * The component receives an Environment object that will be merged into the values provided by the nearest ancestor Provider.
 * The new environment will be passed to the component's children.
 * Note that some environment values cannot be overwritten. See the description of the Environment type for the list of values
 * that can be replaced.
 */
export declare function EnvironmentProvider({ children, environment }: ProviderProperties<Environment>): import("preact").JSX.Element;
