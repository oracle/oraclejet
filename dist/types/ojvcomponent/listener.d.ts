/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export declare function listener(options?: {
    capture?: boolean;
    passive?: boolean;
}): (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
