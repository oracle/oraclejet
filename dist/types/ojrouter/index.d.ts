/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import 'signals';
import 'knockout';
import { RouterState } from '../ojrouterstate';
declare class Router {
    readonly currentState: (() => RouterState | undefined);
    readonly currentValue: (() => string | undefined);
    defaultStateId: string | undefined;
    static defaults: {
        urlAdapter?: Router.urlPathAdapter | Router.urlParamAdapter;
        baseUrl?: string;
        rootInstanceName?: string;
    };
    readonly direction: string | undefined;
    readonly moduleConfig: {
        name: ko.Observable<string>;
        params: {
            ojRouter: {
                parentRouter: Router;
                direction: string;
            };
        };
        lifecycleListener: {
            attached: ((param0: any) => void);
        };
    };
    readonly name: string;
    readonly observableModuleConfig: ko.Observable<Router.ModuleConfigType>;
    readonly parent: Router | undefined;
    static readonly rootInstance: Router;
    readonly stateId: ((param0?: string) => string);
    readonly states: RouterState[] | null;
    static readonly transitionedToState: signals.Signal;
    static sync(): Promise<{
        hasChanged: boolean;
    }>;
    configure(option: {
        [key: string]: RouterState.ConfigOptions;
    } | ((id: string) => RouterState | RouterState.ConfigOptions | undefined | null)): Router;
    createChildRouter(name: string, parentStateId?: string): Router;
    dispose(): undefined;
    getChildRouter(name: string): Router | undefined;
    getCurrentChildRouter(): Router | undefined;
    getState(stateId: string): RouterState | undefined;
    go(stateIdPath?: string | string[], options?: {
        historyUpdate: string;
    }): Promise<{
        hasChanged: boolean;
    }>;
    retrieve(): {
        [key: string]: any;
    };
    store(data: {
        [key: string]: any;
    }): undefined;
}
declare namespace Router {
    // tslint:disable-next-line interface-over-type-literal
    type ModuleConfigType = {
        name: ko.Observable<string>;
        params: {
            ojRouter: {
                parentRouter: Router;
                direction: string;
                parameters: {
                    [key: string]: any;
                };
            };
        };
        lifecycleListener: {
            attached: ((param0: any) => void);
        };
    };
    // tslint:disable-next-line no-unnecessary-class
    class urlParamAdapter {
        constructor();
    }
    // tslint:disable-next-line no-unnecessary-class
    class urlPathAdapter {
        constructor();
    }
}
export = Router;
