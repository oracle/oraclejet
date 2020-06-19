/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import 'knockout';
import CoreRouter = require('../ojcorerouter');
declare class KnockoutRouterAdapter<D extends {
    [key: string]: any;
} = {
    [key: string]: any;
}, P extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> {
    readonly path: ko.Observable<string>;
    readonly state: ko.Observable<CoreRouter.CoreRouterState<D, P>>;
    constructor(router: CoreRouter<D, P>);
    destroy(): any;
}
export = KnockoutRouterAdapter;
