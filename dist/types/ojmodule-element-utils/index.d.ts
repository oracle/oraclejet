import { ModuleViewModel } from '../ojmodule-element';
export function createConfig<P>(options: {
    name?: string;
    viewPath?: string;
    viewModelPath?: string;
    params?: P;
    require?: ((module: string) => any) | ((modules: string[], ready?: any, errback?: any) => void);
}): Promise<{
    view: Node[];
    viewModel: ModuleViewModel | null;
}>;
export function createView(options: {
    viewPath: string;
    require?: ((module: string) => any) | ((modules: string[], ready?: any, errback?: any) => void);
}): Promise<Node[]>;
export function createViewModel<P>(options: {
    viewModelPath: string;
    params?: P;
    require?: ((module: string) => any) | ((modules: string[], ready?: any, errback?: any) => void);
    initialize?: 'always' | 'never' | 'ifParams';
}): Promise<ModuleViewModel | Function>;
