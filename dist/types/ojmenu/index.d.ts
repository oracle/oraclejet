import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojMenu extends baseComponent<ojMenuSettableProperties> {
    disabled: boolean;
    openOptions: ojMenu.OpenOptions;
    translations: {
        ariaFocusSkipLink?: string;
        labelCancel?: string;
    };
    addEventListener<T extends keyof ojMenuEventMap>(type: T, listener: (this: HTMLElement, ev: ojMenuEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
        action: 'open' | 'close';
        element: Element;
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
    interface ojMenuAction extends CustomEvent<{
        selectedValue: any;
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
        at?: PositionAlign;
        collision?: 'flip' | 'fit' | 'flipfit' | 'flipcenter' | 'none';
        my?: PositionAlign;
        of?: string | PositionPoint;
        offset?: PositionPoint;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PositionAlign = {
        horizontal?: 'start' | 'end' | 'left' | 'center' | 'bottom';
        vertical?: 'top' | 'bottom' | 'center';
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
    'ojMenuAction': ojMenu.ojMenuAction;
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
export type MenuElement = ojMenu;
export namespace MenuElement {
    interface ojAction extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojAnimateEnd extends CustomEvent<{
        action: 'open' | 'close';
        element: Element;
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
        openOptions: ojMenu.OpenOptions;
        [propName: string]: any;
    }> {
    }
    interface ojClose extends CustomEvent<{
        event: Event;
        [propName: string]: any;
    }> {
    }
    interface ojMenuAction extends CustomEvent<{
        selectedValue: any;
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
        position?: ojMenu.Position;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Position = {
        at?: ojMenu.PositionAlign;
        collision?: 'flip' | 'fit' | 'flipfit' | 'flipcenter' | 'none';
        my?: ojMenu.PositionAlign;
        of?: string | ojMenu.PositionPoint;
        offset?: ojMenu.PositionPoint;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PositionAlign = {
        horizontal?: 'start' | 'end' | 'left' | 'center' | 'bottom';
        vertical?: 'top' | 'bottom' | 'center';
    };
    // tslint:disable-next-line interface-over-type-literal
    type PositionPoint = {
        x?: number;
        y?: number;
    };
}
export interface MenuIntrinsicProps extends Partial<Readonly<ojMenuSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAction?: (value: ojMenuEventMap['ojAction']) => void;
    onojAnimateEnd?: (value: ojMenuEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojMenuEventMap['ojAnimateStart']) => void;
    onojBeforeOpen?: (value: ojMenuEventMap['ojBeforeOpen']) => void;
    onojClose?: (value: ojMenuEventMap['ojClose']) => void;
    onojMenuAction?: (value: ojMenuEventMap['ojMenuAction']) => void;
    onojOpen?: (value: ojMenuEventMap['ojOpen']) => void;
    ondisabledChanged?: (value: ojMenuEventMap['disabledChanged']) => void;
    onopenOptionsChanged?: (value: ojMenuEventMap['openOptionsChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-menu": MenuIntrinsicProps;
        }
    }
}
