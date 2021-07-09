import { Component } from 'preact';
export declare function customElement(tagName: string): <T extends new (props?: P, context?: any) => Component<P, S>, P = any, S = any>(constructor: T) => void;
