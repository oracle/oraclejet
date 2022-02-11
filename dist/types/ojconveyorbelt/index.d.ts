import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojConveyorBelt extends baseComponent<ojConveyorBeltSettableProperties> {
    arrowVisibility: 'auto' | 'visible' | 'hidden';
    contentParent: string | null;
    orientation: 'horizontal' | 'vertical';
    scrollPosition: number;
    translations: {
        tipArrowNext?: string;
        tipArrowPrevious?: string;
    };
    addEventListener<T extends keyof ojConveyorBeltEventMap>(type: T, listener: (this: HTMLElement, ev: ojConveyorBeltEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojConveyorBeltSettableProperties>(property: T): ojConveyorBelt[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojConveyorBeltSettableProperties>(property: T, value: ojConveyorBeltSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojConveyorBeltSettableProperties>): void;
    setProperties(properties: ojConveyorBeltSettablePropertiesLenient): void;
    refresh(): void;
    scrollElementIntoView(elem: Element): void;
}
export namespace ojConveyorBelt {
    // tslint:disable-next-line interface-over-type-literal
    type arrowVisibilityChanged = JetElementCustomEvent<ojConveyorBelt["arrowVisibility"]>;
    // tslint:disable-next-line interface-over-type-literal
    type contentParentChanged = JetElementCustomEvent<ojConveyorBelt["contentParent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojConveyorBelt["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged = JetElementCustomEvent<ojConveyorBelt["scrollPosition"]>;
}
export interface ojConveyorBeltEventMap extends baseComponentEventMap<ojConveyorBeltSettableProperties> {
    'arrowVisibilityChanged': JetElementCustomEvent<ojConveyorBelt["arrowVisibility"]>;
    'contentParentChanged': JetElementCustomEvent<ojConveyorBelt["contentParent"]>;
    'orientationChanged': JetElementCustomEvent<ojConveyorBelt["orientation"]>;
    'scrollPositionChanged': JetElementCustomEvent<ojConveyorBelt["scrollPosition"]>;
}
export interface ojConveyorBeltSettableProperties extends baseComponentSettableProperties {
    arrowVisibility: 'auto' | 'visible' | 'hidden';
    contentParent: string | null;
    orientation: 'horizontal' | 'vertical';
    scrollPosition: number;
    translations: {
        tipArrowNext?: string;
        tipArrowPrevious?: string;
    };
}
export interface ojConveyorBeltSettablePropertiesLenient extends Partial<ojConveyorBeltSettableProperties> {
    [key: string]: any;
}
export type ConveyorBeltElement = ojConveyorBelt;
export namespace ConveyorBeltElement {
    // tslint:disable-next-line interface-over-type-literal
    type arrowVisibilityChanged = JetElementCustomEvent<ojConveyorBelt["arrowVisibility"]>;
    // tslint:disable-next-line interface-over-type-literal
    type contentParentChanged = JetElementCustomEvent<ojConveyorBelt["contentParent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojConveyorBelt["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged = JetElementCustomEvent<ojConveyorBelt["scrollPosition"]>;
}
export interface ConveyorBeltIntrinsicProps extends Partial<Readonly<ojConveyorBeltSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onarrowVisibilityChanged?: (value: ojConveyorBeltEventMap['arrowVisibilityChanged']) => void;
    oncontentParentChanged?: (value: ojConveyorBeltEventMap['contentParentChanged']) => void;
    onorientationChanged?: (value: ojConveyorBeltEventMap['orientationChanged']) => void;
    onscrollPositionChanged?: (value: ojConveyorBeltEventMap['scrollPositionChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-conveyor-belt": ConveyorBeltIntrinsicProps;
        }
    }
}
