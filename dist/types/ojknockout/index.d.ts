import { DataProvider } from '../ojdataprovider';
/// <reference types='knockout'/>
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
