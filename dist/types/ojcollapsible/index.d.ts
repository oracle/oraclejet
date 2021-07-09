import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojCollapsible extends baseComponent<ojCollapsibleSettableProperties> {
    disabled: boolean;
    expandArea: 'header' | 'disclosureIcon';
    expanded: boolean;
    addEventListener<T extends keyof ojCollapsibleEventMap>(type: T, listener: (this: HTMLElement, ev: ojCollapsibleEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojCollapsibleSettableProperties>(property: T): ojCollapsible[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojCollapsibleSettableProperties>(property: T, value: ojCollapsibleSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojCollapsibleSettableProperties>): void;
    setProperties(properties: ojCollapsibleSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojCollapsible {
    interface ojBeforeCollapse extends CustomEvent<{
        content: Element;
        header: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        content: Element;
        header: Element;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        content: Element;
        header: Element;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        content: Element;
        header: Element;
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
export type CollapsibleElement = ojCollapsible;
export namespace CollapsibleElement {
    interface ojBeforeCollapse extends CustomEvent<{
        content: Element;
        header: Element;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeExpand extends CustomEvent<{
        content: Element;
        header: Element;
        [propName: string]: any;
    }> {
    }
    interface ojCollapse extends CustomEvent<{
        content: Element;
        header: Element;
        [propName: string]: any;
    }> {
    }
    interface ojExpand extends CustomEvent<{
        content: Element;
        header: Element;
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
export interface CollapsibleIntrinsicProps extends Partial<Readonly<ojCollapsibleSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojBeforeCollapse?: (value: ojCollapsibleEventMap['ojBeforeCollapse']) => void;
    onojBeforeExpand?: (value: ojCollapsibleEventMap['ojBeforeExpand']) => void;
    onojCollapse?: (value: ojCollapsibleEventMap['ojCollapse']) => void;
    onojExpand?: (value: ojCollapsibleEventMap['ojExpand']) => void;
    ondisabledChanged?: (value: ojCollapsibleEventMap['disabledChanged']) => void;
    onexpandAreaChanged?: (value: ojCollapsibleEventMap['expandAreaChanged']) => void;
    onexpandedChanged?: (value: ojCollapsibleEventMap['expandedChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-collapsible": CollapsibleIntrinsicProps;
        }
    }
}
