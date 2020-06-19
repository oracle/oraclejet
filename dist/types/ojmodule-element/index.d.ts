/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

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
    connected?(): void;
    disconnected?(): void;
    parametersChanged?(params: any): void;
    transitionCompleted?(): void;
}
export interface ojModule extends JetElement<ojModuleSettableProperties> {
    animation: ModuleElementAnimation;
    config: {
        cleanupMode?: 'onDisconnect' | 'none';
        view: Node[];
        viewModel: ModuleViewModel | null;
    };
    addEventListener<T extends keyof ojModuleEventMap>(type: T, listener: (this: HTMLElement, ev: ojModuleEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
        viewModel: ModuleViewModel;
        view: Node[];
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
        viewModel: ModuleViewModel | null;
    };
}
export interface ojModuleSettablePropertiesLenient extends Partial<ojModuleSettableProperties> {
    [key: string]: any;
}
