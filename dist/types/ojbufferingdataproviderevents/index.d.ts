import BufferingDataProvider = require('../ojbufferingdataprovider');
export class BufferingDataProviderSubmittableChangeEvent<K, D> {
    AT_TARGET: 2;
    BUBBLING_PHASE: 3;
    CAPTURING_PHASE: 1;
    NONE: 0;
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
