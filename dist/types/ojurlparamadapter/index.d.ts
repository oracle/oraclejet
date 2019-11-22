import CoreRouter = require('../ojcorerouter');
declare class UrlParamAdapter implements CoreRouter.UrlAdapter {
    constructor();
    getRoutesForUrl(): CoreRouter.Route[];
    getUrlForRoutes(routes: CoreRouter.Route[]): string;
}
export = UrlParamAdapter;
