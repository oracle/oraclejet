import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface dvtTimeComponent<SP extends dvtTimeComponentSettableProperties = dvtTimeComponentSettableProperties> extends dvtBaseComponent<SP> {
    addEventListener<T extends keyof dvtTimeComponentEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: dvtTimeComponentEventMap<SP>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof dvtTimeComponentSettableProperties>(property: T): dvtTimeComponent<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof dvtTimeComponentSettableProperties>(property: T, value: dvtTimeComponentSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, dvtTimeComponentSettableProperties>): void;
    setProperties(properties: dvtTimeComponentSettablePropertiesLenient): void;
}
export namespace dvtTimeComponent {
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<SP extends dvtTimeComponentSettableProperties = dvtTimeComponentSettableProperties> = dvtBaseComponent.trackResizeChanged<SP>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
// These interfaces are empty but required to keep the event chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface dvtTimeComponentEventMap<SP extends dvtTimeComponentSettableProperties = dvtTimeComponentSettableProperties> extends dvtBaseComponentEventMap<SP> {
    'trackResizeChanged': JetElementCustomEvent<dvtTimeComponent<SP>["trackResize"]>;
}
// These interfaces are empty but required to keep the component chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface dvtTimeComponentSettableProperties extends dvtBaseComponentSettableProperties {
}
export interface dvtTimeComponentSettablePropertiesLenient extends Partial<dvtTimeComponentSettableProperties> {
    [key: string]: any;
}
