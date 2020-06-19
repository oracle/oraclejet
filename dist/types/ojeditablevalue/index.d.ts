/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import Message = require('../ojmessaging');
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface editableValue<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> extends baseComponent<SP> {
    describedBy: string | null;
    disabled: boolean;
    help: {
        instruction?: string;
    };
    helpHints: {
        definition?: string;
        source?: string;
    };
    labelEdge: 'inside' | 'none' | 'provided';
    labelHint: string;
    messagesCustom: Message[];
    userAssistanceDensity: 'reflow' | 'efficient' | 'compact';
    readonly valid: 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
    value: V | null;
    addEventListener<T extends keyof editableValueEventMap<V, SP, SV, RV>>(type: T, listener: (this: HTMLElement, ev: editableValueEventMap<V, SP, SV, RV>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof editableValueSettableProperties<V, SV, RV>>(property: T): editableValue<V, SP, SV, RV>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof editableValueSettableProperties<V, SV, RV>>(property: T, value: editableValueSettableProperties<V, SV, RV>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, editableValueSettableProperties<V, SV, RV>>): void;
    setProperties(properties: editableValueSettablePropertiesLenient<V, SV, RV>): void;
    refresh(): void;
    reset(): void;
    showMessages(): void;
}
export namespace editableValue {
    interface ojAnimateEnd extends CustomEvent<{
        action: string;
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: string;
        element: Element;
        endCallback: (() => void);
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["help"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["helpHints"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["labelHint"]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["messagesCustom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["userAssistanceDensity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["valid"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<editableValue<V, SP, SV, RV>["value"]>;
}
export interface editableValueEventMap<V, SP extends editableValueSettableProperties<V, SV, RV>, SV = V, RV = V> extends baseComponentEventMap<SP> {
    'ojAnimateEnd': editableValue.ojAnimateEnd;
    'ojAnimateStart': editableValue.ojAnimateStart;
    'describedByChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["disabled"]>;
    'helpChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["valid"]>;
    'valueChanged': JetElementCustomEvent<editableValue<V, SP, SV, RV>["value"]>;
}
export interface editableValueSettableProperties<V, SV = V, RV = V> extends baseComponentSettableProperties {
    describedBy: string | null;
    disabled: boolean;
    help: {
        instruction?: string;
    };
    helpHints: {
        definition?: string;
        source?: string;
    };
    labelEdge: 'inside' | 'none' | 'provided';
    labelHint: string;
    messagesCustom: Message[];
    userAssistanceDensity: 'reflow' | 'efficient' | 'compact';
    readonly valid: 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
    value: SV | null;
}
export interface editableValueSettablePropertiesLenient<V, SV = V, RV = V> extends Partial<editableValueSettableProperties<V, SV, RV>> {
    [key: string]: any;
}
