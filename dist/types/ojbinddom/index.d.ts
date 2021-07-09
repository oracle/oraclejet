export interface ojBindDom<D> extends HTMLElement {
    config: ojBindDom.Config<D> | Promise<ojBindDom.Config<D>>;
}
export namespace ojBindDom {
    // tslint:disable-next-line interface-over-type-literal
    type Config<D> = {
        data: D;
        view: Node[];
    };
}
export type BindDomElement<D> = ojBindDom<D>;
export namespace BindDomElement {
    // tslint:disable-next-line interface-over-type-literal
    type Config<D> = {
        data: D;
        view: Node[];
    };
}
