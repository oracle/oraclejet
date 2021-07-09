import CoreRouter = require('../ojcorerouter');
declare class UrlPathParamAdapter<P extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> {
    constructor(baseUrl?: string);
    getRoutesForUrl(routePathParams?: {
        offset: number;
        pathParams: string[];
    }, url?: string): Array<CoreRouter.CoreRouterState<P>>;
    getUrlForRoutes(states: Array<CoreRouter.CoreRouterState<P>>): string;
}
export = UrlPathParamAdapter;
