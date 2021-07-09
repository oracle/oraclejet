import * as ko from 'knockout';
import { AllKeySetImpl, KeySetImpl } from 'ojs/ojkeyset';
export declare class ObservableKeySet<K> {
    private readonly _proto;
    constructor(initialValue?: KeySetImpl<K> | AllKeySetImpl<K>);
}
export interface ObservableKeySet<K> extends ko.Observable<KeySetImpl<K> | AllKeySetImpl<K>> {
    constructor(initialValue?: KeySetImpl<K> | AllKeySetImpl<K>): any;
    add(keys: Set<K> | K[]): ObservableKeySet<K>;
    addAll(): ObservableKeySet<K>;
    clear(): ObservableKeySet<K>;
    delete(keys: Set<K> | K[]): ObservableKeySet<K>;
}
