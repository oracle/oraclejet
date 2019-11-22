import CoreRouter = require('../ojcorerouter');
declare class KnockoutRouterAdapter {
    readonly path: ko.Observable<string>;
    readonly state: ko.Observable<CoreRouter.CoreRouterState>;
    constructor(router: CoreRouter);
    destroy(): any;
}
export = KnockoutRouterAdapter;
