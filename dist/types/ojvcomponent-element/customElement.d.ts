/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ElementVComponent } from './ElementVComponent';
export declare function customElement(tagName: string): <T extends new (props: P) => ElementVComponent<P, S>, P extends object = any, S extends object = any>(constructor: T) => void;
