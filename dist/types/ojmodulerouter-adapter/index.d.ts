import CoreRouter = require('../ojcorerouter');
import { ModuleElementAnimation, ModuleViewModel } from '../ojmodule-element';
import ModuleAnimations = require('../ojmoduleanimations');
declare class ModuleRouterAdapter<D extends Record<string, any> = Record<string, any>, P = CoreRouter.Parameters> {
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
        previousState: any;
        previousViewModel: any;
        state: any;
        viewModel: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ViewModelParameters<D extends Record<string, any>, P = CoreRouter.Parameters> = {
        /** @deprecated since 8.1.0 - Use CoreRouter.CoreRouterState.params instead. */
        params: P;
        /** @deprecated since 8.1.0 - Use router property instead. */
        parentRouter: CoreRouter<D, P>;
        router: CoreRouter<D, P>;
        routerState: CoreRouter.CoreRouterState<D, P>;
    };
}
export = ModuleRouterAdapter;
