/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Context, Component } from 'preact';
export declare function method(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export declare function consumedContexts(contexts: Context<any>[]): <T extends {
    new (props?: P, context?: any): Component<P, S>;
}, P = any, S = any>(constructor: T) => void;
