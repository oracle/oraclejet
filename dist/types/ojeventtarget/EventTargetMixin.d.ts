/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export declare class EventTargetMixin implements EventTarget {
    private _eventListeners;
    addEventListener(eventType: string, listener: EventListener): void;
    removeEventListener(eventType: string, listener: EventListener): void;
    dispatchEvent(evt: Event): boolean;
    static applyMixin(derivedCtor: any): void;
}
