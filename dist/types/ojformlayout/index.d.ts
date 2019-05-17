import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojFormLayout extends JetElement<ojFormLayoutSettableProperties> {
    direction: 'column' | 'row';
    labelEdge: 'start' | 'top';
    labelWidth: string;
    labelWrapping: 'truncate' | 'wrap';
    maxColumns: number;
    addEventListener<T extends keyof ojFormLayoutEventMap>(type: T, listener: (this: HTMLElement, ev: ojFormLayoutEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojFormLayoutSettableProperties>(property: T): ojFormLayout[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojFormLayoutSettableProperties>(property: T, value: ojFormLayoutSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojFormLayoutSettableProperties>): void;
    setProperties(properties: ojFormLayoutSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojFormLayout {
    // tslint:disable-next-line interface-over-type-literal
    type directionChanged = JetElementCustomEvent<ojFormLayout["direction"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = JetElementCustomEvent<ojFormLayout["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelWidthChanged = JetElementCustomEvent<ojFormLayout["labelWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelWrappingChanged = JetElementCustomEvent<ojFormLayout["labelWrapping"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxColumnsChanged = JetElementCustomEvent<ojFormLayout["maxColumns"]>;
}
export interface ojFormLayoutEventMap extends HTMLElementEventMap {
    'directionChanged': JetElementCustomEvent<ojFormLayout["direction"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojFormLayout["labelEdge"]>;
    'labelWidthChanged': JetElementCustomEvent<ojFormLayout["labelWidth"]>;
    'labelWrappingChanged': JetElementCustomEvent<ojFormLayout["labelWrapping"]>;
    'maxColumnsChanged': JetElementCustomEvent<ojFormLayout["maxColumns"]>;
}
export interface ojFormLayoutSettableProperties extends JetSettableProperties {
    direction: 'column' | 'row';
    labelEdge: 'start' | 'top';
    labelWidth: string;
    labelWrapping: 'truncate' | 'wrap';
    maxColumns: number;
}
export interface ojFormLayoutSettablePropertiesLenient extends Partial<ojFormLayoutSettableProperties> {
    [key: string]: any;
}
