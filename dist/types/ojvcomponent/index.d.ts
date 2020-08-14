/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export declare abstract class VComponent<P extends object = any, S extends object = any> {
    protected state: Readonly<S>;
    protected props: Readonly<P>;
    protected _vprops?: any;
    private _ref;
    private _vnode;
    private _callbacks;
    private _uniqueId;
    private _pendingStateUpdaters;
    private _pendingState;
    private _pendingPropsUpdate;
    private _busyStateCallbackForRender;
    constructor(props: Readonly<P>);
    protected abstract render(): VComponent.VNode;
    protected updated(oldProps: Readonly<P>, oldState: Readonly<S>): void;
    protected mounted(): void;
    protected unmounted(): void;
    protected uniqueId(): string;
    protected _updateProperty(prop: keyof P, value: P[keyof P], shouldRender?: boolean): void;
    protected updateState(state: ((state: Readonly<S>, props: Readonly<P>) => Partial<S>) | Partial<S>): void;
    private mount;
    private patch;
    private notifyMounted;
    private notifyUnmounted;
    private queueRender;
    private _renderForMount;
    private _renderForPatch;
    private _render;
    private _doUpdateState;
    private _areStatesEqual;
    private _getCallback;
    private _getBuiltInCallbacks;
    private _getNewState;
}
export declare namespace VComponent {
    type DynamicSlots<Data = undefined> = Record<string, Slot<Data>>;
    type Slot<Data = undefined> = (data?: Data) => VNode[];
    type VNode = {};
    type RootProps = Record<string, any>;
    type Action<Detail extends object = {}> = (detail?: Detail) => void;
    type CancelableAction<Detail extends object = {}> = (detail?: Detail) => Promise<void>;
    type RefCallback = (ref: Node | VComponent | null) => void;
    type VComponentClass<P extends object> = new (props: P) => VComponent<P, any>;
    type RenderFunction<P extends object> = (props: P, content: VNode[]) => VNode;
    type VNodeType<P extends object> = string | VComponentClass<P> | RenderFunction<P>;
}
export declare const h: <P extends object>(type: VComponent.VNodeType<P>, props: P, ...children: VComponent.VNode[]) => VComponent.VNode;
export declare function customElement(tagName: string): <T extends new (props: P) => VComponent<P, S>, P extends object = any, S extends object = any>(constructor: T) => void;
export declare function listener(options?: {
    capture?: boolean;
    passive?: boolean;
}): (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function dynamicDefault(defaultGetter: () => any): (target: any, propertyKey: string | Symbol) => void;
export declare function method(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export declare function method(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function rootProperty(target: any, propertyKey: string | Symbol): void;
export declare function rootProperty(): (target: any, propertyKey: string | Symbol) => void;
export declare function _writeback({ readOnly: boolean }?: {
    readOnly: boolean;
}): (target: any, propertyKey: string | Symbol) => void;
export declare function event({ bubbles: boolean }?: {
    bubbles: boolean;
}): (target: any, propertyKey: string | Symbol) => void;
export declare const EMPTYO: Readonly<{}>;
export declare function classPropToObject(classProp: string | object | null): Readonly<object>;
