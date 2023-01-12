import 'knockout';
declare class CoreRouter<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>, ParentD extends Record<string, any> = Record<string, any>,
   ParentP extends Record<string, any> = Record<string, any>> {
    beforeStateChange: CoreRouter.Observable<CoreRouter.VetoableState<D, P>>;
    childRouter: CoreRouter;
    currentState: CoreRouter.Observable<CoreRouter.ActionableState<D, P>>;
    constructor(routes: Array<CoreRouter.DetailedRouteConfig<D> | CoreRouter.RedirectedRouteConfig>, options?: CoreRouter.CreateOptions<P>, parentRouter?: CoreRouter<ParentD, ParentP>);
    createChildRouter<ChildD extends Record<string, any> = Record<string, any>, ChildP extends Record<string, any> = Record<string, any>>(routes: Array<CoreRouter.DetailedRouteConfig<ChildD> |
       CoreRouter.RedirectedRouteConfig>, options?: CoreRouter.CreateOptions<ChildP>): CoreRouter<ChildD, ChildP>;
    destroy(): any;
    go(...route: CoreRouter.Route<P>[]): Promise<CoreRouter.CoreRouterState<D, P>>;
    reconfigure(routeConfigs: Array<(CoreRouter.DetailedRouteConfig | CoreRouter.RedirectedRouteConfig)>, navigateTo?: CoreRouter.Route<P> |
       CoreRouter.Route<P>[]): Promise<CoreRouter.CoreRouterState<D, P>>;
    sync(): Promise<CoreRouter.CoreRouterState<D, P>>;
}
declare namespace CoreRouter {
    // tslint:disable-next-line interface-over-type-literal
    type ActionableState<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>> = {
        complete: ((param0: Promise<any>) => void);
        state: CoreRouterState<D, P>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CreateOptions<P extends Record<string, any> = Record<string, any>> = {
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
    type RedirectedRouteConfig = {
        path: string | RegExp;
        redirect?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type VetoableState<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>> = {
        accept: ((param0: Promise<any>) => void);
        state: CoreRouterState<D, P>;
    };
    interface Route<P extends Record<string, any> = Record<string, any>> {
        params?: P;
        path: string;
    }
    interface CoreRouterState<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>> {
        readonly detail: D;
        readonly params: P;
        readonly path: string;
        readonly pathParams: string[];
        readonly redirect?: string;
    }
    interface UrlAdapter<P extends Record<string, any> = Record<string, any>> {
        getRoutesForUrl(routePathParams?: {
            offset: number;
            pathParams: string[];
        }, url?: string): Array<Route<P>>;
        getUrlForRoutes(states: Array<Route<P>>): string;
    }
}
export = CoreRouter;
