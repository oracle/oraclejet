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
    // tslint:disable-next-line interface-over-type-literal
    type RenderNoDataTemplate = import('ojs/ojvcomponent').TemplateSlot<{}>;
}
export interface ojBindIf extends HTMLElement {
    test: boolean;
}
export interface ojBindText extends HTMLElement {
    value: string;
}
export interface ojIf extends HTMLElement {
    test: boolean;
}
export type BindForEachElement<K, D> = ojBindForEach<K, D>;
export type BindIfElement = ojBindIf;
export type BindTextElement = ojBindText;
export type IfElement = ojIf;
export namespace BindForEachElement {
    // tslint:disable-next-line interface-over-type-literal
    type DefaultItemContext<D> = {
        data: D;
        index: number;
        observableIndex: ko.Observable<number>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderNoDataTemplate = import('ojs/ojvcomponent').TemplateSlot<{}>;
}
