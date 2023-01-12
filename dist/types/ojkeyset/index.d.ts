export class AllKeySetImpl<K> extends KeySet<K> implements ImmutableKeySet<K> {
    readonly keys: {
        all: true;
        keys?: never;
        deletedKeys: ImmutableKeySet.ImmutableSet<K>;
    } | {
        all: false;
        keys: ImmutableKeySet.ImmutableSet<K>;
        deletedKeys?: never;
    };
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
export interface ImmutableKeySet<K> {
    readonly keys: {
        all: true;
        keys?: never;
        deletedKeys: ImmutableKeySet.ImmutableSet<K>;
    } | {
        all: false;
        keys: ImmutableKeySet.ImmutableSet<K>;
        deletedKeys?: never;
    };
    add(keys: Set<K> | K[]): ImmutableKeySet<K>;
    addAll(): ImmutableKeySet<K>;
    clear(): KeySet<K>;
    delete(keys: Set<K> | K[]): ImmutableKeySet<K>;
    has(key: K): boolean;
    isAddAll(): boolean;
}
export namespace ImmutableKeySet {
    // tslint:disable-next-line interface-over-type-literal
    type ImmutableSet<V> = {
        size: number;
        has(value: V): boolean;
        values(): IterableIterator<V>;
    };
}
export abstract class KeySet<K> {
    abstract add(keys: Set<K> | K[]): KeySet<K>;
    abstract addAll(): KeySet<K>;
    abstract clear(): KeySet<K>;
    abstract delete(keys: Set<K> | K[]): KeySet<K>;
    abstract has(key: K): boolean;
    abstract isAddAll(): boolean;
}
export class KeySetImpl<K> extends KeySet<K> implements ImmutableKeySet<K> {
    readonly keys: {
        all: true;
        keys?: never;
        deletedKeys: ImmutableKeySet.ImmutableSet<K>;
    } | {
        all: false;
        keys: ImmutableKeySet.ImmutableSet<K>;
        deletedKeys?: never;
    };
    constructor(keys?: Set<K> | K[]);
    add(keys: Set<K> | K[]): KeySetImpl<K>;
    addAll(): AllKeySetImpl<K>;
    clear(): KeySetImpl<K>;
    delete(keys: Set<K> | K[]): KeySetImpl<K>;
    has(key: K): boolean;
    isAddAll(): boolean;
    values(): Set<K>;
}
