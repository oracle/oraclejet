export declare class GenericEvent implements Event {
    readonly type: string;
    readonly options?: any;
    constructor(type: string, options?: any);
    readonly bubbles: boolean;
    readonly cancelable: boolean;
    cancelBubble: boolean;
    readonly composed: boolean;
    readonly currentTarget: EventTarget;
    readonly defaultPrevented: boolean;
    readonly eventPhase: number;
    readonly isTrusted: boolean;
    returnValue: boolean;
    readonly srcElement: Element | null;
    readonly target: EventTarget;
    readonly timeStamp: number;
    readonly scoped: boolean;
    initEvent: (eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean) => void;
    preventDefault: () => void;
    stopImmediatePropagation: () => void;
    stopPropagation: () => void;
    deepPath: () => EventTarget[];
    composedPath: () => EventTarget[];
    readonly NONE: 0;
    readonly CAPTURING_PHASE: 1;
    readonly AT_TARGET: 2;
    readonly BUBBLING_PHASE: 3;
}
