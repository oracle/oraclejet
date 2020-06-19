/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojFilmStrip extends baseComponent<ojFilmStripSettableProperties> {
    arrowPlacement: 'adjacent' | 'overlay';
    arrowVisibility: 'visible' | 'hidden' | 'hover' | 'auto';
    currentItem: {
        id?: string;
        index?: number;
    };
    looping: 'off' | 'page';
    maxItemsPerPage: number;
    orientation: 'horizontal' | 'vertical';
    translations: {
        labelAccArrowNextPage?: string;
        labelAccArrowPreviousPage?: string;
        labelAccFilmStrip?: string;
        tipArrowNextPage?: string;
        tipArrowPreviousPage?: string;
    };
    addEventListener<T extends keyof ojFilmStripEventMap>(type: T, listener: (this: HTMLElement, ev: ojFilmStripEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojFilmStripSettableProperties>(property: T): ojFilmStrip[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojFilmStripSettableProperties>(property: T, value: ojFilmStripSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojFilmStripSettableProperties>): void;
    setProperties(properties: ojFilmStripSettablePropertiesLenient): void;
    getItemsPerPage(): number;
    refresh(): void;
}
export namespace ojFilmStrip {
    // tslint:disable-next-line interface-over-type-literal
    type arrowPlacementChanged = JetElementCustomEvent<ojFilmStrip["arrowPlacement"]>;
    // tslint:disable-next-line interface-over-type-literal
    type arrowVisibilityChanged = JetElementCustomEvent<ojFilmStrip["arrowVisibility"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentItemChanged = JetElementCustomEvent<ojFilmStrip["currentItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type loopingChanged = JetElementCustomEvent<ojFilmStrip["looping"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxItemsPerPageChanged = JetElementCustomEvent<ojFilmStrip["maxItemsPerPage"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojFilmStrip["orientation"]>;
}
export interface ojFilmStripEventMap extends baseComponentEventMap<ojFilmStripSettableProperties> {
    'arrowPlacementChanged': JetElementCustomEvent<ojFilmStrip["arrowPlacement"]>;
    'arrowVisibilityChanged': JetElementCustomEvent<ojFilmStrip["arrowVisibility"]>;
    'currentItemChanged': JetElementCustomEvent<ojFilmStrip["currentItem"]>;
    'loopingChanged': JetElementCustomEvent<ojFilmStrip["looping"]>;
    'maxItemsPerPageChanged': JetElementCustomEvent<ojFilmStrip["maxItemsPerPage"]>;
    'orientationChanged': JetElementCustomEvent<ojFilmStrip["orientation"]>;
}
export interface ojFilmStripSettableProperties extends baseComponentSettableProperties {
    arrowPlacement: 'adjacent' | 'overlay';
    arrowVisibility: 'visible' | 'hidden' | 'hover' | 'auto';
    currentItem: {
        id?: string;
        index?: number;
    };
    looping: 'off' | 'page';
    maxItemsPerPage: number;
    orientation: 'horizontal' | 'vertical';
    translations: {
        labelAccArrowNextPage?: string;
        labelAccArrowPreviousPage?: string;
        labelAccFilmStrip?: string;
        tipArrowNextPage?: string;
        tipArrowPreviousPage?: string;
    };
}
export interface ojFilmStripSettablePropertiesLenient extends Partial<ojFilmStripSettableProperties> {
    [key: string]: any;
}
