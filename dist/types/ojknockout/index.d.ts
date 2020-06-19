/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import 'knockout';
import { DataProvider } from '../ojdataprovider';
export interface ojBindForEach<K, D> extends HTMLElement {
    data: D[] | DataProvider<K, D>;
}
export namespace ojBindForEach {
    // tslint:disable-next-line interface-over-type-literal
    type DefaultItemContext<D> = {
        data: D;
        index: number;
        observableIndex: ko.Observable<number>;
    };
}
export interface ojBindIf extends HTMLElement {
    test: boolean;
}
export interface ojBindText extends HTMLElement {
    value: string;
}
