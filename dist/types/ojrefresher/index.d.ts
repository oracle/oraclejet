import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojRefresher extends baseComponent<ojRefresherSettableProperties> {
    refreshContent: (() => Promise<any>);
    target: Element;
    text: string;
    threshold: number;
    translations: {
        ariaRefreshCompleteLink?: string;
        ariaRefreshLink?: string;
        ariaRefreshingLink?: string;
    };
    addEventListener<T extends keyof ojRefresherEventMap>(type: T, listener: (this: HTMLElement, ev: ojRefresherEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojRefresherSettableProperties>(property: T): ojRefresher[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojRefresherSettableProperties>(property: T, value: ojRefresherSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojRefresherSettableProperties>): void;
    setProperties(properties: ojRefresherSettablePropertiesLenient): void;
}
export namespace ojRefresher {
    // tslint:disable-next-line interface-over-type-literal
    type refreshContentChanged = JetElementCustomEvent<ojRefresher["refreshContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type targetChanged = JetElementCustomEvent<ojRefresher["target"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textChanged = JetElementCustomEvent<ojRefresher["text"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdChanged = JetElementCustomEvent<ojRefresher["threshold"]>;
}
export interface ojRefresherEventMap extends baseComponentEventMap<ojRefresherSettableProperties> {
    'refreshContentChanged': JetElementCustomEvent<ojRefresher["refreshContent"]>;
    'targetChanged': JetElementCustomEvent<ojRefresher["target"]>;
    'textChanged': JetElementCustomEvent<ojRefresher["text"]>;
    'thresholdChanged': JetElementCustomEvent<ojRefresher["threshold"]>;
}
export interface ojRefresherSettableProperties extends baseComponentSettableProperties {
    refreshContent: (() => Promise<any>);
    target: Element;
    text: string;
    threshold: number;
    translations: {
        ariaRefreshCompleteLink?: string;
        ariaRefreshLink?: string;
        ariaRefreshingLink?: string;
    };
}
export interface ojRefresherSettablePropertiesLenient extends Partial<ojRefresherSettableProperties> {
    [key: string]: any;
}
export type RefresherElement = ojRefresher;
export namespace RefresherElement {
    // tslint:disable-next-line interface-over-type-literal
    type refreshContentChanged = JetElementCustomEvent<ojRefresher["refreshContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type targetChanged = JetElementCustomEvent<ojRefresher["target"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textChanged = JetElementCustomEvent<ojRefresher["text"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdChanged = JetElementCustomEvent<ojRefresher["threshold"]>;
}
export interface RefresherIntrinsicProps extends Partial<Readonly<ojRefresherSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onrefreshContentChanged?: (value: ojRefresherEventMap['refreshContentChanged']) => void;
    ontargetChanged?: (value: ojRefresherEventMap['targetChanged']) => void;
    ontextChanged?: (value: ojRefresherEventMap['textChanged']) => void;
    onthresholdChanged?: (value: ojRefresherEventMap['thresholdChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-refresher": RefresherIntrinsicProps;
        }
    }
}
