export declare class EventTargetMixin implements EventTarget {
    private _eventListeners;
    addEventListener(eventType: string, listener: EventListener): void;
    removeEventListener(eventType: string, listener: EventListener): void;
    dispatchEvent(evt: Event): boolean;
    static applyMixin(derivedCtor: any): void;
}
