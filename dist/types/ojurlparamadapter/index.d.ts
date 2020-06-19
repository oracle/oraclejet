/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import CoreRouter = require('../ojcorerouter');
declare class UrlParamAdapter<P extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> {
    constructor();
    getRoutesForUrl(): Array<CoreRouter.Route<P>>;
    getUrlForRoutes(routes: Array<CoreRouter.Route<P>>): string;
}
export = UrlParamAdapter;
