/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Component } from 'preact';
import { ProvideProperty } from 'ojs/ojmetadata';
/**
 * Class decorator for VComponent. This is a compile time decorator that should add
 * "binding: {consume: {name: value}}" to the specified property's metadata.
 * @ignore
 */
export declare function consumedBindings(consumes: {
    [key: string]: {
        name: string;
    };
}): <T extends {
    new (props?: P, context?: any): Component<P, S>;
}, P = any, S = any>(constructor: T) => void;
/**
 * Class decorator for VComponent. This is a compile time decorator that should add
 * "binding: {provide: Array.[MetadataTypes.ProvideProperty]}" to the specified property's metadata.
 * @ignore
 */
export declare function providedBindings(provides: {
    [key: string]: Array<ProvideProperty>;
}): <T extends {
    new (props?: P, context?: any): Component<P, S>;
}, P = any, S = any>(constructor: T) => void;
