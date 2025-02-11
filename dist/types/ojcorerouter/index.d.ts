import 'knockout';
declare class CoreRouter<D extends Record<string, any> = Record<string, any>, P = CoreRouter.Parameters, ParentD extends Record<string, any> = Record<string, any>, ParentP = CoreRouter.Parameters> {
    beforeStateChange: CoreRouter.Observable<CoreRouter.VetoableState<D, P>>;
    childRouter: CoreRouter;
    currentState: CoreRouter.Observable<CoreRouter.ActionableState<D, P>>;
    constructor(routes: Array<CoreRouter.DetailedRouteConfig<D> | CoreRouter.RedirectedRouteConfig>, options?: CoreRouter.CreateOptions<P>, parentRouter?: CoreRouter<ParentD, ParentP>);
    createChildRouter<ChildD extends Record<string, any> = Record<string, any>, ChildP = CoreRouter.Parameters>(routes: Array<CoreRouter.DetailedRouteConfig<ChildD> |
       CoreRouter.RedirectedRouteConfig>, options?: CoreRouter.CreateOptions<ChildP>): CoreRouter<ChildD, ChildP>;
    destroy(): any;
    getUrlForNavigation(...routes: CoreRouter.Route<P>[]): string;
    go(...routes: CoreRouter.Route<P>[]): Promise<CoreRouter.CoreRouterState<D, P>>;
    reconfigure(routeConfigs: Array<(CoreRouter.DetailedRouteConfig | CoreRouter.RedirectedRouteConfig)>, navigateTo?: CoreRouter.Route<P> |
       CoreRouter.Route<P>[]): Promise<CoreRouter.CoreRouterState<D, P>>;
    sync(): Promise<CoreRouter.CoreRouterState<D, P>>;
}
declare namespace CoreRouter {
    // tslint:disable-next-line interface-over-type-literal
    type ActionableState<D extends Record<string, any> = Record<string, any>, P = Parameters> = {
        complete: ((param0: Promise<any>) => void);
        state: CoreRouterState<D, P>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CreateOptions<P = Parameters> = {
        history?: 'skip';
        urlAdapter?: UrlAdapter<P>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DetailedRouteConfig<D extends Record<string, any> = Record<string, any>> = {
        detail?: D;
        path: string | RegExp;
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
    type Parameters = Record<string, bigint | boolean | number | string | undefined>;
    // tslint:disable-next-line interface-over-type-literal
    type RedirectedRouteConfig = {
        path: string | RegExp;
        redirect?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type VetoableState<D extends Record<string, any> = Record<string, any>, P = Parameters> = {
        accept: ((param0: Promise<any>) => void);
        state: CoreRouterState<D, P>;
    };
    interface Route<P = Parameters> {
        params?: P;
        path: string;
    }
    interface CoreRouterState<D extends Record<string, any> = Record<string, any>, P = Parameters> {
        readonly detail: D;
        readonly params: P;
        readonly path: string;
        readonly pathParams: string[];
        readonly redirect?: string;
    }
    interface UrlAdapter<P = Parameters> {
        getRoutesForUrl(routePathParams?: {
            offset: number;
            pathParams: string[];
        }, url?: string): Array<Route<P>>;
        getUrlForRoutes(states: Array<Route<P>>): string;
    }
}
export = CoreRouter;
