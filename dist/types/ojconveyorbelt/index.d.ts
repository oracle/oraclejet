import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojConveyorBelt extends baseComponent<ojConveyorBeltSettableProperties> {
    contentParent: string | null;
    orientation: 'horizontal' | 'vertical';
    addEventListener<T extends keyof ojConveyorBeltEventMap>(type: T, listener: (this: HTMLElement, ev: ojConveyorBeltEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojConveyorBeltSettableProperties>(property: T): ojConveyorBelt[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojConveyorBeltSettableProperties>(property: T, value: ojConveyorBeltSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojConveyorBeltSettableProperties>): void;
    setProperties(properties: ojConveyorBeltSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojConveyorBelt {
    // tslint:disable-next-line interface-over-type-literal
    type contentParentChanged = JetElementCustomEvent<ojConveyorBelt["contentParent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojConveyorBelt["orientation"]>;
}
export interface ojConveyorBeltEventMap extends baseComponentEventMap<ojConveyorBeltSettableProperties> {
    'contentParentChanged': JetElementCustomEvent<ojConveyorBelt["contentParent"]>;
    'orientationChanged': JetElementCustomEvent<ojConveyorBelt["orientation"]>;
}
export interface ojConveyorBeltSettableProperties extends baseComponentSettableProperties {
    contentParent: string | null;
    orientation: 'horizontal' | 'vertical';
}
export interface ojConveyorBeltSettablePropertiesLenient extends Partial<ojConveyorBeltSettableProperties> {
    [key: string]: any;
}
