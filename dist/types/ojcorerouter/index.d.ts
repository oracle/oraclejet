declare class CoreRouter {
    beforeStateChange: CoreRouter.Observable<CoreRouter.VetoableState>;
    currentState: CoreRouter.Observable<CoreRouter.ActionableState>;
    constructor(routes: Array<(CoreRouter.DetailedRouteConfig | CoreRouter.RedirectedRouteConfig)>, options?: CoreRouter.CreateOptions, parentRouter?: CoreRouter);
    createChildRouter(routes: Array<(CoreRouter.DetailedRouteConfig | CoreRouter.RedirectedRouteConfig)>, options?: CoreRouter.CreateOptions): CoreRouter;
    destroy(): any;
    go(...route: CoreRouter.Route[]): Promise<CoreRouter.CoreRouterState>;
    sync(): Promise<CoreRouter.CoreRouterState>;
}
declare namespace CoreRouter {
    // tslint:disable-next-line interface-over-type-literal
    type ActionableState = {
        state: CoreRouterState;
        complete: ((param0: Promise<any>) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type CreateOptions = {
        history?: 'skip';
        urlAdapter?: UrlAdapter;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DetailedRouteConfig = {
        path: string | RegExp;
        detail?: {
            [key: string]: any;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type Observable<T> = {
        subscribe: ((param0: ((param0: T) => void)) => Observer);
    };
    // tslint:disable-next-line interface-over-type-literal
    type Observer = {
        unsubscribe: (() => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type RedirectedRouteConfig = {
        path: string | RegExp;
        redirect?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type UrlAdapter = {
        getUrlForRoutes: ((param0: Route[]) => string);
        getRoutesForUrl: (() => Route[]);
    };
    // tslint:disable-next-line interface-over-type-literal
    type VetoableState = {
        state: CoreRouterState;
        accept: ((param0: Promise<any>) => void);
    };
    interface Route {
        params?: {
            [key: string]: any;
        };
        path: string;
    }
    interface CoreRouterState {
        readonly detail: {
            [key: string]: any;
        };
        readonly params: {
            [key: string]: any;
        };
        readonly path: string;
    }
}
export = CoreRouter;
