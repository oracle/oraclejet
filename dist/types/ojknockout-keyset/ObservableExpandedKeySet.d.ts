import * as ko from 'knockout';
import { ExpandAllKeySet, ExpandedKeySet } from 'ojs/ojkeyset';
export declare class ObservableExpandedKeySet<K> {
    private readonly _proto;
    constructor(initialValue?: ExpandedKeySet<K> | ExpandAllKeySet<K>);
}
export interface ObservableExpandedKeySet<K> extends ko.Observable<ExpandedKeySet<K> | ExpandAllKeySet<K>> {
    constructor(initialValue?: ExpandedKeySet<K> | ExpandAllKeySet<K>): any;
    add(keys: Set<K> | K[]): ObservableExpandedKeySet<K>;
    addAll(): ObservableExpandedKeySet<K>;
    clear(): ObservableExpandedKeySet<K>;
    delete(keys: Set<K> | K[]): ObservableExpandedKeySet<K>;
}
