/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojSwitch extends editableValue<boolean, ojSwitchSettableProperties> {
    disabled: boolean;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
    readonly: boolean;
    value: boolean;
    addEventListener<T extends keyof ojSwitchEventMap>(type: T, listener: (this: HTMLElement, ev: ojSwitchEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojSwitchSettableProperties>(property: T): ojSwitch[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSwitchSettableProperties>(property: T, value: ojSwitchSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSwitchSettableProperties>): void;
    setProperties(properties: ojSwitchSettablePropertiesLenient): void;
}
export namespace ojSwitch {
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
    type disabledChanged = JetElementCustomEvent<ojSwitch["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojSwitch["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojSwitch["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = JetElementCustomEvent<ojSwitch["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojSwitch["value"]>;
}
export interface ojSwitchEventMap extends editableValueEventMap<boolean, ojSwitchSettableProperties> {
    'ojAnimateEnd': ojSwitch.ojAnimateEnd;
    'ojAnimateStart': ojSwitch.ojAnimateStart;
    'disabledChanged': JetElementCustomEvent<ojSwitch["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojSwitch["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojSwitch["labelledBy"]>;
    'readonlyChanged': JetElementCustomEvent<ojSwitch["readonly"]>;
    'valueChanged': JetElementCustomEvent<ojSwitch["value"]>;
}
export interface ojSwitchSettableProperties extends editableValueSettableProperties<boolean> {
    disabled: boolean;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
    readonly: boolean;
    value: boolean;
}
export interface ojSwitchSettablePropertiesLenient extends Partial<ojSwitchSettableProperties> {
    [key: string]: any;
}
