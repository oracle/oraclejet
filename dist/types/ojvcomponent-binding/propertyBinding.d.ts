/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ProvideProperty } from 'ojs/ojmetadata';
export declare function consumeBinding(consume: {
    name: string;
}): (target: any, propertyKey: string | Symbol) => void;
export declare function provideBinding(provide: ProvideProperty): (target: any, propertyKey: string | Symbol) => void;
