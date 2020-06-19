/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojButton<SP extends ojButtonSettableProperties = ojButtonSettableProperties> extends baseComponent<SP> {
    chroming: 'solid' | 'outlined' | 'borderless' | 'callToAction' | 'full' | 'half';
    disabled: boolean;
    display: 'all' | 'icons';
    addEventListener<T extends keyof ojButtonEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: ojButtonEventMap<SP>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojButtonSettableProperties>(property: T): ojButton<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojButtonSettableProperties>(property: T, value: ojButtonSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojButtonSettableProperties>): void;
    setProperties(properties: ojButtonSettablePropertiesLenient): void;
}
export namespace ojButton {
    interface ojAction extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type chromingChanged<SP extends ojButtonSettableProperties = ojButtonSettableProperties> = JetElementCustomEvent<ojButton<SP>["chroming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<SP extends ojButtonSettableProperties = ojButtonSettableProperties> = JetElementCustomEvent<ojButton<SP>["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged<SP extends ojButtonSettableProperties = ojButtonSettableProperties> = JetElementCustomEvent<ojButton<SP>["display"]>;
}
export interface ojButtonEventMap<SP extends ojButtonSettableProperties = ojButtonSettableProperties> extends baseComponentEventMap<SP> {
    'ojAction': ojButton.ojAction;
    'chromingChanged': JetElementCustomEvent<ojButton<SP>["chroming"]>;
    'disabledChanged': JetElementCustomEvent<ojButton<SP>["disabled"]>;
    'displayChanged': JetElementCustomEvent<ojButton<SP>["display"]>;
}
export interface ojButtonSettableProperties extends baseComponentSettableProperties {
    chroming: 'solid' | 'outlined' | 'borderless' | 'callToAction' | 'full' | 'half';
    disabled: boolean;
    display: 'all' | 'icons';
}
export interface ojButtonSettablePropertiesLenient extends Partial<ojButtonSettableProperties> {
    [key: string]: any;
}
export interface ojButtonset<SP extends ojButtonsetSettableProperties = ojButtonsetSettableProperties> extends baseComponent<SP> {
    addEventListener<T extends keyof ojButtonsetEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: ojButtonsetEventMap<SP>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojButtonsetSettableProperties>(property: T): ojButtonset<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojButtonsetSettableProperties>(property: T, value: ojButtonsetSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojButtonsetSettableProperties>): void;
    setProperties(properties: ojButtonsetSettablePropertiesLenient): void;
}
// These interfaces are empty but required to keep the event chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface ojButtonsetEventMap<SP extends ojButtonsetSettableProperties = ojButtonsetSettableProperties> extends baseComponentEventMap<SP> {
}
// These interfaces are empty but required to keep the component chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface ojButtonsetSettableProperties extends baseComponentSettableProperties {
}
export interface ojButtonsetSettablePropertiesLenient extends Partial<ojButtonsetSettableProperties> {
    [key: string]: any;
}
export interface ojButtonsetMany extends ojButtonset<ojButtonsetManySettableProperties> {
    chroming: 'solid' | 'outlined' | 'borderless' | 'full' | 'half';
    describedBy: string | null;
    disabled: boolean;
    display: 'all' | 'icons';
    focusManagement: 'oneTabstop' | 'none';
    labelledBy: string | null;
    value: any[] | null;
    addEventListener<T extends keyof ojButtonsetManyEventMap>(type: T, listener: (this: HTMLElement, ev: ojButtonsetManyEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojButtonsetManySettableProperties>(property: T): ojButtonsetMany[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojButtonsetManySettableProperties>(property: T, value: ojButtonsetManySettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojButtonsetManySettableProperties>): void;
    setProperties(properties: ojButtonsetManySettablePropertiesLenient): void;
}
export namespace ojButtonsetMany {
    // tslint:disable-next-line interface-over-type-literal
    type chromingChanged = JetElementCustomEvent<ojButtonsetMany["chroming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojButtonsetMany["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojButtonsetMany["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged = JetElementCustomEvent<ojButtonsetMany["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type focusManagementChanged = JetElementCustomEvent<ojButtonsetMany["focusManagement"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojButtonsetMany["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojButtonsetMany["value"]>;
}
export interface ojButtonsetManyEventMap extends ojButtonsetEventMap<ojButtonsetManySettableProperties> {
    'chromingChanged': JetElementCustomEvent<ojButtonsetMany["chroming"]>;
    'describedByChanged': JetElementCustomEvent<ojButtonsetMany["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojButtonsetMany["disabled"]>;
    'displayChanged': JetElementCustomEvent<ojButtonsetMany["display"]>;
    'focusManagementChanged': JetElementCustomEvent<ojButtonsetMany["focusManagement"]>;
    'labelledByChanged': JetElementCustomEvent<ojButtonsetMany["labelledBy"]>;
    'valueChanged': JetElementCustomEvent<ojButtonsetMany["value"]>;
}
export interface ojButtonsetManySettableProperties extends ojButtonsetSettableProperties {
    chroming: 'solid' | 'outlined' | 'borderless' | 'full' | 'half';
    describedBy: string | null;
    disabled: boolean;
    display: 'all' | 'icons';
    focusManagement: 'oneTabstop' | 'none';
    labelledBy: string | null;
    value: any[] | null;
}
export interface ojButtonsetManySettablePropertiesLenient extends Partial<ojButtonsetManySettableProperties> {
    [key: string]: any;
}
export interface ojButtonsetOne extends ojButtonset<ojButtonsetOneSettableProperties> {
    chroming: 'solid' | 'outlined' | 'borderless' | 'full' | 'half';
    describedBy: string | null;
    disabled: boolean;
    display: 'all' | 'icons';
    focusManagement: 'oneTabstop' | 'none';
    labelledBy: string | null;
    value: any;
    addEventListener<T extends keyof ojButtonsetOneEventMap>(type: T, listener: (this: HTMLElement, ev: ojButtonsetOneEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojButtonsetOneSettableProperties>(property: T): ojButtonsetOne[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojButtonsetOneSettableProperties>(property: T, value: ojButtonsetOneSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojButtonsetOneSettableProperties>): void;
    setProperties(properties: ojButtonsetOneSettablePropertiesLenient): void;
}
export namespace ojButtonsetOne {
    // tslint:disable-next-line interface-over-type-literal
    type chromingChanged = JetElementCustomEvent<ojButtonsetOne["chroming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojButtonsetOne["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojButtonsetOne["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged = JetElementCustomEvent<ojButtonsetOne["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type focusManagementChanged = JetElementCustomEvent<ojButtonsetOne["focusManagement"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojButtonsetOne["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojButtonsetOne["value"]>;
}
export interface ojButtonsetOneEventMap extends ojButtonsetEventMap<ojButtonsetOneSettableProperties> {
    'chromingChanged': JetElementCustomEvent<ojButtonsetOne["chroming"]>;
    'describedByChanged': JetElementCustomEvent<ojButtonsetOne["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojButtonsetOne["disabled"]>;
    'displayChanged': JetElementCustomEvent<ojButtonsetOne["display"]>;
    'focusManagementChanged': JetElementCustomEvent<ojButtonsetOne["focusManagement"]>;
    'labelledByChanged': JetElementCustomEvent<ojButtonsetOne["labelledBy"]>;
    'valueChanged': JetElementCustomEvent<ojButtonsetOne["value"]>;
}
export interface ojButtonsetOneSettableProperties extends ojButtonsetSettableProperties {
    chroming: 'solid' | 'outlined' | 'borderless' | 'full' | 'half';
    describedBy: string | null;
    disabled: boolean;
    display: 'all' | 'icons';
    focusManagement: 'oneTabstop' | 'none';
    labelledBy: string | null;
    value: any;
}
export interface ojButtonsetOneSettablePropertiesLenient extends Partial<ojButtonsetOneSettableProperties> {
    [key: string]: any;
}
export interface ojMenuButton extends ojButton<ojMenuButtonSettableProperties> {
    chroming: 'solid' | 'outlined' | 'borderless' | 'full' | 'half';
    disabled: boolean;
    display: 'all' | 'icons';
    addEventListener<T extends keyof ojMenuButtonEventMap>(type: T, listener: (this: HTMLElement, ev: ojMenuButtonEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojMenuButtonSettableProperties>(property: T): ojMenuButton[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojMenuButtonSettableProperties>(property: T, value: ojMenuButtonSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojMenuButtonSettableProperties>): void;
    setProperties(properties: ojMenuButtonSettablePropertiesLenient): void;
}
export namespace ojMenuButton {
    interface ojAction extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type chromingChanged = JetElementCustomEvent<ojMenuButton["chroming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojMenuButton["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged = JetElementCustomEvent<ojMenuButton["display"]>;
}
export interface ojMenuButtonEventMap extends ojButtonEventMap<ojMenuButtonSettableProperties> {
    'ojAction': ojMenuButton.ojAction;
    'chromingChanged': JetElementCustomEvent<ojMenuButton["chroming"]>;
    'disabledChanged': JetElementCustomEvent<ojMenuButton["disabled"]>;
    'displayChanged': JetElementCustomEvent<ojMenuButton["display"]>;
}
export interface ojMenuButtonSettableProperties extends ojButtonSettableProperties {
    chroming: 'solid' | 'outlined' | 'borderless' | 'full' | 'half';
    disabled: boolean;
    display: 'all' | 'icons';
}
export interface ojMenuButtonSettablePropertiesLenient extends Partial<ojMenuButtonSettableProperties> {
    [key: string]: any;
}
