import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojMenuSelectMany extends JetElement<ojMenuSelectManySettableProperties> {
    disabled: boolean;
    options: ojMenuSelectMany.Option[] | DataProvider<any, any> | null;
    value: any[];
    addEventListener<T extends keyof ojMenuSelectManyEventMap>(type: T, listener: (this: HTMLElement, ev: ojMenuSelectManyEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojMenuSelectManySettableProperties>(property: T): ojMenuSelectMany[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojMenuSelectManySettableProperties>(property: T, value: ojMenuSelectManySettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojMenuSelectManySettableProperties>): void;
    setProperties(properties: ojMenuSelectManySettablePropertiesLenient): void;
}
export namespace ojMenuSelectMany {
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojMenuSelectMany["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged = JetElementCustomEvent<ojMenuSelectMany["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojMenuSelectMany["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        id?: string;
        label: string;
        value: any;
    };
}
export interface ojMenuSelectManyEventMap extends HTMLElementEventMap {
    'disabledChanged': JetElementCustomEvent<ojMenuSelectMany["disabled"]>;
    'optionsChanged': JetElementCustomEvent<ojMenuSelectMany["options"]>;
    'valueChanged': JetElementCustomEvent<ojMenuSelectMany["value"]>;
}
export interface ojMenuSelectManySettableProperties extends JetSettableProperties {
    disabled: boolean;
    options: ojMenuSelectMany.Option[] | DataProvider<any, any> | null;
    value: any[];
}
export interface ojMenuSelectManySettablePropertiesLenient extends Partial<ojMenuSelectManySettableProperties> {
    [key: string]: any;
}
export type MenuSelectManyElement = ojMenuSelectMany;
export namespace MenuSelectManyElement {
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojMenuSelectMany["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged = JetElementCustomEvent<ojMenuSelectMany["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojMenuSelectMany["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        id?: string;
        label: string;
        value: any;
    };
}
export interface MenuSelectManyIntrinsicProps extends Partial<Readonly<ojMenuSelectManySettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondisabledChanged?: (value: ojMenuSelectManyEventMap['disabledChanged']) => void;
    onoptionsChanged?: (value: ojMenuSelectManyEventMap['optionsChanged']) => void;
    onvalueChanged?: (value: ojMenuSelectManyEventMap['valueChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-menu-select-many": MenuSelectManyIntrinsicProps;
        }
    }
}
