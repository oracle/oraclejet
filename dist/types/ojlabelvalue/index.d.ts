import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojLabelValue extends JetElement<ojLabelValueSettableProperties> {
    colspan: number;
    labelEdge: 'start' | 'top' | 'inherit';
    labelWidth: string;
    onColspanChanged: ((event: JetElementCustomEvent<ojLabelValue["colspan"]>) => any) | null;
    onLabelEdgeChanged: ((event: JetElementCustomEvent<ojLabelValue["labelEdge"]>) => any) | null;
    onLabelWidthChanged: ((event: JetElementCustomEvent<ojLabelValue["labelWidth"]>) => any) | null;
    addEventListener<T extends keyof ojLabelValueEventMap>(type: T, listener: (this: HTMLElement, ev: ojLabelValueEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojLabelValueSettableProperties>(property: T): ojLabelValue[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojLabelValueSettableProperties>(property: T, value: ojLabelValueSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojLabelValueSettableProperties>): void;
    setProperties(properties: ojLabelValueSettablePropertiesLenient): void;
    refresh(): void;
}
export interface ojLabelValueEventMap extends HTMLElementEventMap {
    'colspanChanged': JetElementCustomEvent<ojLabelValue["colspan"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojLabelValue["labelEdge"]>;
    'labelWidthChanged': JetElementCustomEvent<ojLabelValue["labelWidth"]>;
}
export interface ojLabelValueSettableProperties extends JetSettableProperties {
    colspan: number;
    labelEdge: 'start' | 'top' | 'inherit';
    labelWidth: string;
}
export interface ojLabelValueSettablePropertiesLenient extends Partial<ojLabelValueSettableProperties> {
    [key: string]: any;
}
