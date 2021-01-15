/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export declare function method(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export declare function method(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function rootProperty(target: any, propertyKey: string | Symbol): void;
export declare function rootProperty(): (target: any, propertyKey: string | Symbol) => void;
export declare function readOnly(target: any, propertyKey: string | Symbol): void;
export declare function event({ bubbles: boolean }?: {
    bubbles: boolean;
}): (target: any, propertyKey: string | Symbol) => void;
