/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojMenu extends baseComponent<ojMenuSettableProperties> {
    disabled: boolean;
    openOptions: ojMenu.OpenOptions;
    translations: {
        ariaFocusSkipLink?: string;
        labelCancel?: string;
    };
    addEventListener<T extends keyof ojMenuEventMap>(type: T, listener: (this: HTMLElement, ev: ojMenuEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojMenuSettableProperties>(property: T): ojMenu[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojMenuSettableProperties>(property: T, value: ojMenuSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojMenuSettableProperties>): void;
    setProperties(properties: ojMenuSettablePropertiesLenient): void;
    close(): void;
    open(event?: Event, openOptions?: ojMenu.OpenOptions): void;
    refresh(): void;
}
export namespace ojMenu {
    interface ojAction extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojAnimateEnd extends CustomEvent<{
        element: Element;
        action: 'open' | 'close';
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: 'open' | 'close';
        element: Element;
        endCallback: (() => void);
        [propName: string]: any;
    }> {
    }
    interface ojBeforeOpen extends CustomEvent<{
        openOptions: OpenOptions;
        [propName: string]: any;
    }> {
    }
    interface ojClose extends CustomEvent<{
        event: Event;
        [propName: string]: any;
    }> {
    }
    interface ojOpen extends CustomEvent<{
        event: Event;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojMenu["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type openOptionsChanged = JetElementCustomEvent<ojMenu["openOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type OpenOptions = {
        display?: string;
        initialFocus?: string;
        launcher?: string | Element;
        position?: Position;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Position = {
        my?: PositionAlign;
        at?: PositionAlign;
        offset?: PositionPoint;
        of?: string | PositionPoint;
        collision?: 'flip' | 'fit' | 'flipfit' | 'flipcenter' | 'none';
    };
    // tslint:disable-next-line interface-over-type-literal
    type PositionAlign = {
        vertical?: 'top' | 'bottom' | 'center';
        horizontal?: 'start' | 'end' | 'left' | 'center' | 'bottom';
    };
    // tslint:disable-next-line interface-over-type-literal
    type PositionPoint = {
        x?: number;
        y?: number;
    };
}
export interface ojMenuEventMap extends baseComponentEventMap<ojMenuSettableProperties> {
    'ojAction': ojMenu.ojAction;
    'ojAnimateEnd': ojMenu.ojAnimateEnd;
    'ojAnimateStart': ojMenu.ojAnimateStart;
    'ojBeforeOpen': ojMenu.ojBeforeOpen;
    'ojClose': ojMenu.ojClose;
    'ojOpen': ojMenu.ojOpen;
    'disabledChanged': JetElementCustomEvent<ojMenu["disabled"]>;
    'openOptionsChanged': JetElementCustomEvent<ojMenu["openOptions"]>;
}
export interface ojMenuSettableProperties extends baseComponentSettableProperties {
    disabled: boolean;
    openOptions: ojMenu.OpenOptions;
    translations: {
        ariaFocusSkipLink?: string;
        labelCancel?: string;
    };
}
export interface ojMenuSettablePropertiesLenient extends Partial<ojMenuSettableProperties> {
    [key: string]: any;
}
