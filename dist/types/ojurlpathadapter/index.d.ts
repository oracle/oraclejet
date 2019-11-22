import CoreRouter = require('../ojcorerouter');
declare class UrlPathAdapter implements CoreRouter.UrlAdapter {
    constructor(baseUrl?: string);
    getRoutesForUrl(url?: string): CoreRouter.Route[];
    getUrlForRoutes(routes: CoreRouter.Route[]): string;
}
export = UrlPathAdapter;
