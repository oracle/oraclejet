import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ModuleElementAnimation {
    animate(context: {
        node: Node;
        isInitial: boolean;
        oldViewModel: ModuleViewModel;
        newViewModel: ModuleViewModel;
        newViewParent: Node;
        oldViewParent: Node;
        removeOldView: () => undefined;
        insertNewView: () => undefined;
        oldDomNodes: any[];
    }): Promise<any>;
    canAnimate(context: {
        node: Node;
        isInitial: boolean;
        oldViewModel: ModuleViewModel;
        newViewModel: ModuleViewModel;
    }): boolean;
    prepareAnimation(context: {
        node: Node;
        isInitial: boolean;
        oldViewModel: ModuleViewModel;
        newViewModel: ModuleViewModel;
    }): null | {
        newViewParent?: Node;
        oldViewParent?: Node;
    };
}
export interface ModuleViewModel {
    canExit?(): Promise<void>;
    connected?(view: Node[]): void;
    disconnected?(view: Node[]): void;
    parametersChanged?(params: any): void;
    transitionCompleted?(view: Node[]): void;
}
export interface ojModule extends JetElement<ojModuleSettableProperties> {
    animation: ModuleElementAnimation;
    config: {
        cleanupMode?: 'onDisconnect' | 'none';
        view: Node[];
        viewModel?: ModuleViewModel | null;
    };
    addEventListener<T extends keyof ojModuleEventMap>(type: T, listener: (this: HTMLElement, ev: ojModuleEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojModuleSettableProperties>(property: T): ojModule[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojModuleSettableProperties>(property: T, value: ojModuleSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojModuleSettableProperties>): void;
    setProperties(properties: ojModuleSettablePropertiesLenient): void;
}
export namespace ojModule {
    interface ojTransitionEnd extends CustomEvent<{
        viewModel: ModuleViewModel;
        [propName: string]: any;
    }> {
    }
    interface ojTransitionStart extends CustomEvent<{
        viewModel: ModuleViewModel;
        [propName: string]: any;
    }> {
    }
    interface ojViewConnected extends CustomEvent<{
        viewModel: ModuleViewModel;
        [propName: string]: any;
    }> {
    }
    interface ojViewDisconnected extends CustomEvent<{
        view: Node[];
        viewModel: ModuleViewModel;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationChanged = JetElementCustomEvent<ojModule["animation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type configChanged = JetElementCustomEvent<ojModule["config"]>;
}
export interface ojModuleEventMap extends HTMLElementEventMap {
    'ojTransitionEnd': ojModule.ojTransitionEnd;
    'ojTransitionStart': ojModule.ojTransitionStart;
    'ojViewConnected': ojModule.ojViewConnected;
    'ojViewDisconnected': ojModule.ojViewDisconnected;
    'animationChanged': JetElementCustomEvent<ojModule["animation"]>;
    'configChanged': JetElementCustomEvent<ojModule["config"]>;
}
export interface ojModuleSettableProperties extends JetSettableProperties {
    animation: ModuleElementAnimation;
    config: {
        cleanupMode?: 'onDisconnect' | 'none';
        view: Node[];
        viewModel?: ModuleViewModel | null;
    };
}
export interface ojModuleSettablePropertiesLenient extends Partial<ojModuleSettableProperties> {
    [key: string]: any;
}
export type ModuleElement = ojModule;
export namespace ModuleElement {
    interface ojTransitionEnd extends CustomEvent<{
        viewModel: ModuleViewModel;
        [propName: string]: any;
    }> {
    }
    interface ojTransitionStart extends CustomEvent<{
        viewModel: ModuleViewModel;
        [propName: string]: any;
    }> {
    }
    interface ojViewConnected extends CustomEvent<{
        viewModel: ModuleViewModel;
        [propName: string]: any;
    }> {
    }
    interface ojViewDisconnected extends CustomEvent<{
        view: Node[];
        viewModel: ModuleViewModel;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationChanged = JetElementCustomEvent<ojModule["animation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type configChanged = JetElementCustomEvent<ojModule["config"]>;
}
export interface ModuleIntrinsicProps extends Partial<Readonly<ojModuleSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojTransitionEnd?: (value: ojModuleEventMap['ojTransitionEnd']) => void;
    onojTransitionStart?: (value: ojModuleEventMap['ojTransitionStart']) => void;
    onojViewConnected?: (value: ojModuleEventMap['ojViewConnected']) => void;
    onojViewDisconnected?: (value: ojModuleEventMap['ojViewDisconnected']) => void;
    onanimationChanged?: (value: ojModuleEventMap['animationChanged']) => void;
    onconfigChanged?: (value: ojModuleEventMap['configChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-module": ModuleIntrinsicProps;
        }
    }
}
