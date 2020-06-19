/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export class AllKeySetImpl<K> extends KeySet<K> {
    constructor();
    add(keys: Set<K> | K[]): AllKeySetImpl<K>;
    addAll(): AllKeySetImpl<K>;
    clear(): KeySetImpl<K>;
    delete(keys: Set<K> | K[]): AllKeySetImpl<K>;
    deletedValues(): Set<K>;
    has(key: K): boolean;
    isAddAll(): boolean;
}
export class ExpandAllKeySet<K> extends KeySet<K> {
    constructor();
    add(keys: Set<K> | K[]): ExpandAllKeySet<K>;
    addAll(): ExpandAllKeySet<K>;
    clear(): ExpandedKeySet<K>;
    delete(keys: Set<K> | K[]): ExpandAllKeySet<K>;
    deletedValues(): Set<K>;
    has(key: K): boolean;
    isAddAll(): boolean;
}
export class ExpandedKeySet<K> extends KeySet<K> {
    constructor(keys?: Set<K> | K[]);
    add(keys: Set<K> | K[]): ExpandedKeySet<K>;
    addAll(): ExpandAllKeySet<K>;
    clear(): ExpandedKeySet<K>;
    delete(keys: Set<K> | K[]): ExpandedKeySet<K>;
    has(key: K): boolean;
    isAddAll(): boolean;
    values(): Set<K>;
}
export abstract class KeySet<K> {
    abstract add(keys: Set<K> | K[]): KeySet<K>;
    abstract addAll(): KeySet<K>;
    abstract clear(): KeySet<K>;
    abstract delete(keys: Set<K> | K[]): KeySet<K>;
    abstract has(key: K): boolean;
    abstract isAddAll(): boolean;
}
export class KeySetImpl<K> extends KeySet<K> {
    constructor(keys?: Set<K> | K[]);
    add(keys: Set<K> | K[]): KeySetImpl<K>;
    addAll(): AllKeySetImpl<K>;
    clear(): KeySetImpl<K>;
    delete(keys: Set<K> | K[]): KeySetImpl<K>;
    has(key: K): boolean;
    isAddAll(): boolean;
    values(): Set<K>;
}
