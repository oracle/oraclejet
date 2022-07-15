import { Component, VNode, ComponentType, RenderableProps } from 'preact';
import * as Metadata from 'ojs/ojmetadata';
import { ExtendGlobalProps } from './metadataTypes';
export declare function customElement(tagName: string): <T extends new (props?: P, context?: any) => Component<P, S>, P = any, S = any>(constructor: T) => void;
export declare type PropertyBindings<P> = Partial<Record<keyof P, Metadata.PropertyBinding>>;
export declare type Options<P> = {
    bindings?: PropertyBindings<P>;
};
export declare function registerCustomElement<P>(tagName: string, fcomp: (props: RenderableProps<P>) => VNode<any> | null, options?: Options<P>): ComponentType<ExtendGlobalProps<P>>;
