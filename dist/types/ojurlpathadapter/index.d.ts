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
