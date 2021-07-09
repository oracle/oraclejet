import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojAccordion extends baseComponent<ojAccordionSettableProperties> {
    expanded: Array<{
        id?: string;
        index?: number;
    }> | null;
    multiple: boolean;
    addEventListener<T extends keyof ojAccordionEventMap>(type: T, listener: (this: HTMLElement, ev: ojAccordionEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojAccordionSettableProperties>(property: T): ojAccordion[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojAccordionSettableProperties>(property: T, value: ojAccordionSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojAccordionSettableProperties>): void;
    setProperties(properties: ojAccordionSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojAccordion {
    interface ojBeforeCollapse extends CustomEvent<{
        fromCollapsible: Element;
        toCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        fromCollapsible: Element;
        toCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        fromCollapsible: Element;
        toCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        fromCollapsible: Element;
        toCollapsible: Element;
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
export type AccordionElement = ojAccordion;
export namespace AccordionElement {
    interface ojBeforeCollapse extends CustomEvent<{
        fromCollapsible: Element;
        toCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        fromCollapsible: Element;
        toCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        fromCollapsible: Element;
        toCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        fromCollapsible: Element;
        toCollapsible: Element;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged = JetElementCustomEvent<ojAccordion["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type multipleChanged = JetElementCustomEvent<ojAccordion["multiple"]>;
}
export interface AccordionIntrinsicProps extends Partial<Readonly<ojAccordionSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojBeforeCollapse?: (value: ojAccordionEventMap['ojBeforeCollapse']) => void;
    onojBeforeExpand?: (value: ojAccordionEventMap['ojBeforeExpand']) => void;
    onojCollapse?: (value: ojAccordionEventMap['ojCollapse']) => void;
    onojExpand?: (value: ojAccordionEventMap['ojExpand']) => void;
    onexpandedChanged?: (value: ojAccordionEventMap['expandedChanged']) => void;
    onmultipleChanged?: (value: ojAccordionEventMap['multipleChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-accordion": AccordionIntrinsicProps;
        }
    }
}
