import BufferingDataProvider = require('../ojbufferingdataprovider');
export class BufferingDataProviderSubmittableChangeEvent<K, D> {
    AT_TARGET: number;
    BUBBLING_PHASE: number;
    CAPTURING_PHASE: number;
    NONE: number;
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    composed: boolean;
    composedPath: () => EventTarget[];
    currentTarget: EventTarget;
    deepPath: () => EventTarget[];
    defaultPrevented: boolean;
    detail: Array<BufferingDataProvider.EditItem<K, D>>;
    eventPhase: number;
    initEvent: (eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean) => void;
    isTrusted: boolean;
    preventDefault: () => void;
    returnValue: boolean;
    scoped: boolean;
    srcElement: Element | null;
    stopImmediatePropagation: () => void;
    stopPropagation: () => void;
    target: EventTarget;
    timeStamp: number;
    type: string;
    constructor(detail: BufferingDataProvider.EditItem<K, D>);
}
