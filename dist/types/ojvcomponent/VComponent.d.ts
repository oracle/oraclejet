/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export declare abstract class VComponent<P extends object = any, S extends object = any> {
    protected state: Readonly<S>;
    protected props: Readonly<P>;
    protected _vprops?: P;
    private _animation;
    private _ref;
    private _vnode;
    private _callbacks;
    private _uniqueId;
    private _pendingStateUpdaters;
    private _pendingState;
    private _pendingPropsUpdate;
    private _busyStateCallbackForRender;
    private _renderInterrupted;
    constructor(props: Readonly<P>);
    protected abstract render(): VComponent.VNode;
    protected updated(oldProps: Readonly<P>, oldState: Readonly<S>): void;
    protected mounted(): void;
    protected unmounted(): void;
    protected uniqueId(): string;
    protected updateState(state: ((state: Readonly<S>, props: Readonly<P>) => Partial<S>) | Partial<S>): void;
    private mount;
    private patch;
    private notifyMounted;
    private notifyUnmounted;
    private queueRender;
    private _cancelQueuedRender;
    private _cleanupRender;
    private _renderIfNeeded;
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
    type VNode = {};
    type VComponentRefCallback = (ref: VComponent | null) => void;
    type NodeRefCallback = (ref: Node | null) => void;
    type RefCallback = VComponentRefCallback | NodeRefCallback;
    type VComponentClass<P extends object> = new (props: P) => VComponent<P, any>;
    type RenderFunction<P extends object> = (props: P, content: VNode[]) => VNode;
    type VNodeType<P extends object> = string | VComponentClass<P> | RenderFunction<P>;
    type Children = VNode | VNode[];
    type Action<Detail extends object = {}> = (detail?: Detail) => void;
    type CancelableAction<Detail extends object = {}> = (detail?: Detail) => Promise<void>;
}
export declare const h: <P extends object>(type: VComponent.VNodeType<P>, props: P, ...children: VComponent.VNode[]) => VComponent.VNode;
export declare const classPropToObject: (classProp: string | object | null) => Readonly<object>;
