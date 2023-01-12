import { Component, Context, ComponentChild, ComponentType, RenderableProps } from 'preact';
import { ExtendGlobalProps } from './metadataTypes';
import * as Metadata from 'ojs/ojmetadata';
export declare function customElement(tagName: string): <T extends new (props?: P, context?: any) => Component<P, S>, P = any, S = any>(constructor: T) => void;
export declare type PropertyBindings<P> = Partial<Record<keyof P, Metadata.PropertyBinding>>;
export declare type Methods<M> = Partial<Record<keyof M, Omit<Metadata.ComponentMetadataMethods, 'internalName' | 'params' | 'return'> & {
    params?: Array<Omit<Metadata.MethodParam, 'type'>>;
    apidocDescription?: string;
    apidocRtnDescription?: string;
}>>;
export declare type Options<P, M extends Record<string, (...args: any[]) => any> = {}> = {
    bindings?: PropertyBindings<P>;
    methods?: Methods<M>;
    contexts?: Record<'consume', Array<Context<any>>>;
};
export declare function registerCustomElement<P, M extends Record<string, (...args: any[]) => any> = {}>(tagName: string, fcomp: (props: RenderableProps<P>) => ComponentChild, options?: Options<P, M>): ComponentType<ExtendGlobalProps<P>>;
