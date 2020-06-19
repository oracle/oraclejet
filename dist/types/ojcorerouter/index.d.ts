/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import 'knockout';
declare class CoreRouter<D extends {
    [key: string]: any;
} = {
    [key: string]: any;
}, P extends {
    [key: string]: any;
} = {
    [key: string]: any;
}, ParentD extends {
    [key: string]: any;
} = {
    [key: string]: any;
}, ParentP extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> {
    beforeStateChange: CoreRouter.Observable<CoreRouter.VetoableState<D, P>>;
    currentState: CoreRouter.Observable<CoreRouter.ActionableState<D, P>>;
    constructor(routes: Array<CoreRouter.DetailedRouteConfig<D> | CoreRouter.RedirectedRouteConfig>, options?: CoreRouter.CreateOptions<P>, parentRouter?: CoreRouter<ParentD, ParentP>);
    createChildRouter<ChildD extends {
        [key: string]: any;
    } = {
        [key: string]: any;
    }, ChildP extends {
        [key: string]: any;
    } = {
        [key: string]: any;
    }>(routes: Array<CoreRouter.DetailedRouteConfig<ChildD> | CoreRouter.RedirectedRouteConfig>, options?: CoreRouter.CreateOptions<ChildP>): CoreRouter<ChildD, ChildP>;
    destroy(): any;
    go(...route: CoreRouter.Route<P>[]): Promise<CoreRouter.CoreRouterState<D, P>>;
    sync(): Promise<CoreRouter.CoreRouterState<D, P>>;
}
declare namespace CoreRouter {
    // tslint:disable-next-line interface-over-type-literal
    type ActionableState<D = {
        [key: string]: any;
    }, P = {
        [key: string]: any;
    }> = {
        state: CoreRouterState<D, P>;
        complete: ((param0: Promise<any>) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type CreateOptions<P = {
        [key: string]: any;
    }> = {
        history?: 'skip';
        urlAdapter?: UrlAdapter<P>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DetailedRouteConfig<D = {
        [key: string]: any;
    }> = {
        path: string | RegExp;
        detail?: D;
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
    type UrlAdapter<P = {
        [key: string]: any;
    }> = {
        getUrlForRoutes: ((routes: Route<P>[]) => string);
        getRoutesForUrl: (() => Route<P>[]);
    };
    // tslint:disable-next-line interface-over-type-literal
    type VetoableState<D = {
        [key: string]: any;
    }, P = {
        [key: string]: any;
    }> = {
        state: CoreRouterState<D, P>;
        accept: ((param0: Promise<any>) => void);
    };
    interface Route<P extends {
        [key: string]: any;
    } = {
        [key: string]: any;
    }> {
        params?: P;
        path: string;
    }
    interface CoreRouterState<D extends {
        [key: string]: any;
    } = {
        [key: string]: any;
    }, P extends {
        [key: string]: any;
    } = {
        [key: string]: any;
    }> {
        readonly detail: D;
        readonly params: P;
        readonly path: string;
    }
}
export = CoreRouter;
