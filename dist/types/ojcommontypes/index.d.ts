/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ItemMetadata } from '../ojdataprovider';
// tslint:disable-next-line no-unnecessary-class
// tslint:disable-next-line interface-over-type-literal
export type ItemContext<K, D> = {
    data: D;
    key: K;
    metadata?: ItemMetadata<K>;
};
