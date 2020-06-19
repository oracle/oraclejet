/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ExpandedKeySet, ExpandAllKeySet, KeySetImpl, AllKeySetImpl } from '../ojkeyset';
export class ObservableExpandedKeySet<K> {
    constructor(initialValue?: ExpandedKeySet<K> | ExpandAllKeySet<K>);
    add(keys: Set<K> | K[]): ObservableExpandedKeySet<K>;
    addAll(): ObservableExpandedKeySet<K>;
    clear(): ObservableExpandedKeySet<K>;
    delete(keys: Set<K> | K[]): ObservableExpandedKeySet<K>;
}
export class ObservableKeySet<K> {
    constructor(initialValue?: KeySetImpl<K> | AllKeySetImpl<K>);
    add(keys: Set<K> | K[]): ObservableKeySet<K>;
    addAll(): ObservableKeySet<K>;
    clear(): ObservableKeySet<K>;
    delete(keys: Set<K> | K[]): ObservableKeySet<K>;
}
