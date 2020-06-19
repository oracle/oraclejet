/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export interface ojBindDom<D> extends HTMLElement {
    config: ojBindDom.Config<D> | Promise<ojBindDom.Config<D>>;
}
export namespace ojBindDom {
    // tslint:disable-next-line interface-over-type-literal
    type Config<D> = {
        view: Node[];
        data: D;
    };
}
