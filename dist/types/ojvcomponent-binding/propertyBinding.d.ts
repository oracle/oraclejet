import { Component } from 'preact';
import { ProvideProperty } from 'ojs/ojmetadata';
export declare function consumedBindings(consumes: {
    [key: string]: {
        name: string;
    };
}): <T extends new (props?: P, context?: any) => Component<P, S>, P = any, S = any>(constructor: T) => void;
export declare function providedBindings(provides: {
    [key: string]: Array<ProvideProperty>;
}): <T extends new (props?: P, context?: any) => Component<P, S>, P = any, S = any>(constructor: T) => void;
