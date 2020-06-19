/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import CoreRouter = require('../ojcorerouter');
import { ModuleElementAnimation, ModuleViewModel } from '../ojmodule-element';
import ModuleAnimations = require('../ojmoduleanimations');
declare class ModuleRouterAdapter<D extends {
    [key: string]: any;
} = {
    [key: string]: any;
}, P extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> {
    animation: ModuleElementAnimation;
    koObservableConfig: {
        view: Node[];
        viewModel: ModuleViewModel;
    };
    constructor(router: CoreRouter<D, P>, options?: {
        viewPath?: string;
        viewModelPath?: string;
        pathKey?: string;
        require?: ((module: string) => any) | ((modules: string[], ready?: any, errback?: any) => void);
        animationCallback?: (animationContext: ModuleRouterAdapter.AnimationCallbackParameters) => ModuleAnimations.Animations | ModuleElementAnimation;
    });
}
declare namespace ModuleRouterAdapter {
    // tslint:disable-next-line interface-over-type-literal
    type AnimationCallbackParameters = {
        node: Element;
        previousViewModel: any;
        viewModel: any;
        previousState: any;
        state: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ViewModelParameters<D, P> = {
        parentRouter: CoreRouter<D, P>;
        params: P;
        router: CoreRouter<D, P>;
        routerState: CoreRouter.CoreRouterState<D, P>;
    };
}
export = ModuleRouterAdapter;
