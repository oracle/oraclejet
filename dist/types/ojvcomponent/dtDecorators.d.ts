import { Context, Component } from 'preact';
export declare function method(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export declare function consumedContexts(contexts: Context<any>[]): <T extends new (props?: P, context?: any) => Component<P, S>, P = any, S = any>(constructor: T) => void;
