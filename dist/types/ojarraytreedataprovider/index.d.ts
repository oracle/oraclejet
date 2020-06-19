/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListResult,
   FetchListParameters } from '../ojdataprovider';
import ArrayDataProvider = require('../ojarraydataprovider');
import TreeDataProvider = require('../ojtreedataprovider');
declare class ArrayTreeDataProvider<K, D> implements TreeDataProvider<K, D> {
    constructor(data: any[] | (() => any[]), options?: {
        sortComparators?: ArrayDataProvider.SortComparators<D>;
        implicitSort?: Array<SortCriterion<D>>;
        keyAttributes?: string | string[];
        keyAttributesScope?: 'global' | 'siblings';
        childrenAttribute?: string;
    });
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getChildDataProvider(parentKey: K): TreeDataProvider<K, D> | null;
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
}
export = ArrayTreeDataProvider;
