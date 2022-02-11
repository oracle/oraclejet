import { Component, VNode, ComponentType, RenderableProps } from 'preact';
import { ExtendGlobalProps } from './metadataTypes';
export declare function customElement(tagName: string): <T extends new (props?: P, context?: any) => Component<P, S>, P = any, S = any>(constructor: T) => void;
export declare function registerCustomElement<P>(tagName: string, fcomp: (props: RenderableProps<P>) => VNode<any> | null): ComponentType<ExtendGlobalProps<P>>;
