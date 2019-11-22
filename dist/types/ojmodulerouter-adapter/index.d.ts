import CoreRouter = require('../ojcorerouter');
import { ModuleElementAnimation, ModuleViewModel } from '../ojmodule-element';
import ModuleAnimations = require('../ojmoduleanimations');
declare class ModuleRouterAdapter {
    animation: ModuleElementAnimation;
    koObservableConfig: {
        view: Node[];
        viewModel: ModuleViewModel;
    };
    constructor(router: CoreRouter, options?: {
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
}
export = ModuleRouterAdapter;
