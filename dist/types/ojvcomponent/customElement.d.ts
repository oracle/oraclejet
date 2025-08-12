/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Component, Context, ComponentChild, ComponentType, RenderableProps } from 'preact';
import { ExtendGlobalProps } from './metadataTypes';
import * as Metadata from 'ojs/ojmetadata';
export declare function customElement(tagName: string): <T extends {
    new (props?: P, context?: any): Component<P, S>;
}, P = any, S = any>(constructor: T) => void;
export type PropertyBindings<P> = Partial<Record<keyof P, Metadata.PropertyBinding>>;
/** @deprecated Use doclet metadata within the type alias that maps method names to function signatures instead. */
export type Methods<M> = Partial<Record<keyof M, Omit<Metadata.ComponentMetadataMethods, 'internalName' | 'params' | 'return'> & {
    params?: Array<Omit<Metadata.MethodParam, 'type'>>;
    apidocDescription?: string;
    apidocRtnDescription?: string;
}>>;
export type Options<P, M extends Record<string, (...args: any[]) => any> = {}> = {
    bindings?: PropertyBindings<P>;
    contexts?: Record<'consume', Array<Context<any>>>;
    /** @deprecated Use doclet metadata within the type alias that maps method names to function signatures instead. */
    methods?: Methods<M>;
};
/**
 * Register a functional component for the custom element
 * @param {string} tagName The element tag name to register
 * @param {function} fcomp The functional component
 * @param {object?} options Additional options for the functional VComponent
 * @returns A Component class which encapsulates the renderer
 */
export declare function registerCustomElement<P, M extends Record<string, (...args: any[]) => any> = {}>(tagName: string, fcomp: (props: RenderableProps<P>) => ComponentChild, options?: Options<P, M>): ComponentType<ExtendGlobalProps<P>>;
