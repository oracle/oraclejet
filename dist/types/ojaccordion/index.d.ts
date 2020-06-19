/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojAccordion extends baseComponent<ojAccordionSettableProperties> {
    expanded: Array<{
        id?: string;
        index?: number;
    }> | null;
    multiple: boolean;
    addEventListener<T extends keyof ojAccordionEventMap>(type: T, listener: (this: HTMLElement, ev: ojAccordionEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojAccordionSettableProperties>(property: T): ojAccordion[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojAccordionSettableProperties>(property: T, value: ojAccordionSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojAccordionSettableProperties>): void;
    setProperties(properties: ojAccordionSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojAccordion {
    interface ojBeforeCollapse extends CustomEvent<{
        toCollapsible: Element;
        fromCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        toCollapsible: Element;
        fromCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        toCollapsible: Element;
        fromCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        toCollapsible: Element;
        fromCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged = JetElementCustomEvent<ojAccordion["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type multipleChanged = JetElementCustomEvent<ojAccordion["multiple"]>;
}
export interface ojAccordionEventMap extends baseComponentEventMap<ojAccordionSettableProperties> {
    'ojBeforeCollapse': ojAccordion.ojBeforeCollapse;
    'ojBeforeExpand': ojAccordion.ojBeforeExpand;
    'ojCollapse': ojAccordion.ojCollapse;
    'ojExpand': ojAccordion.ojExpand;
    'expandedChanged': JetElementCustomEvent<ojAccordion["expanded"]>;
    'multipleChanged': JetElementCustomEvent<ojAccordion["multiple"]>;
}
export interface ojAccordionSettableProperties extends baseComponentSettableProperties {
    expanded: string[] | number[] | Array<{
        id?: string;
        index?: number;
    }> | null;
    multiple: boolean;
}
export interface ojAccordionSettablePropertiesLenient extends Partial<ojAccordionSettableProperties> {
    [key: string]: any;
}
