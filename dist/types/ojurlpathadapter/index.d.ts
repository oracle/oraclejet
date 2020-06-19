/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import CoreRouter = require('../ojcorerouter');
declare class UrlPathAdapter<P extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> {
    constructor(baseUrl?: string);
    getRoutesForUrl(url?: string): Array<CoreRouter.Route<P>>;
    getUrlForRoutes(routes: Array<CoreRouter.Route<P>>): string;
}
export = UrlPathAdapter;
