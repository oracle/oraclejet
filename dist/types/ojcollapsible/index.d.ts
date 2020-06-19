/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojCollapsible extends baseComponent<ojCollapsibleSettableProperties> {
    disabled: boolean;
    expandArea: 'header' | 'disclosureIcon';
    expanded: boolean;
    addEventListener<T extends keyof ojCollapsibleEventMap>(type: T, listener: (this: HTMLElement, ev: ojCollapsibleEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojCollapsibleSettableProperties>(property: T): ojCollapsible[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojCollapsibleSettableProperties>(property: T, value: ojCollapsibleSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojCollapsibleSettableProperties>): void;
    setProperties(properties: ojCollapsibleSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojCollapsible {
    interface ojBeforeCollapse extends CustomEvent<{
        header: Element;
        content: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        header: Element;
        content: Element;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        header: Element;
        content: Element;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        header: Element;
        content: Element;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojCollapsible["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandAreaChanged = JetElementCustomEvent<ojCollapsible["expandArea"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged = JetElementCustomEvent<ojCollapsible["expanded"]>;
}
export interface ojCollapsibleEventMap extends baseComponentEventMap<ojCollapsibleSettableProperties> {
    'ojBeforeCollapse': ojCollapsible.ojBeforeCollapse;
    'ojBeforeExpand': ojCollapsible.ojBeforeExpand;
    'ojCollapse': ojCollapsible.ojCollapse;
    'ojExpand': ojCollapsible.ojExpand;
    'disabledChanged': JetElementCustomEvent<ojCollapsible["disabled"]>;
    'expandAreaChanged': JetElementCustomEvent<ojCollapsible["expandArea"]>;
    'expandedChanged': JetElementCustomEvent<ojCollapsible["expanded"]>;
}
export interface ojCollapsibleSettableProperties extends baseComponentSettableProperties {
    disabled: boolean;
    expandArea: 'header' | 'disclosureIcon';
    expanded: boolean;
}
export interface ojCollapsibleSettablePropertiesLenient extends Partial<ojCollapsibleSettableProperties> {
    [key: string]: any;
}
