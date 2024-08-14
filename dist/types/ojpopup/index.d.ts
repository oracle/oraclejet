import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojPopup extends baseComponent<ojPopupSettableProperties> {
    autoDismiss: 'none' | 'focusLoss';
    chrome: 'default' | 'none';
    initialFocus: 'auto' | 'none' | 'firstFocusable' | 'popup';
    modality: 'modeless' | 'modal';
    position: ojPopup.Position;
    tail: 'none' | 'simple';
    translations: {
        ariaCloseSkipLink?: string;
        ariaFocusSkipLink?: string;
        ariaLiveRegionInitialFocusFirstFocusable?: string;
        ariaLiveRegionInitialFocusFirstFocusableTouch?: string;
        ariaLiveRegionInitialFocusNone?: string;
        ariaLiveRegionInitialFocusNoneTouch?: string;
    };
    addEventListener<T extends keyof ojPopupEventMap>(type: T, listener: (this: HTMLElement, ev: ojPopupEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojPopupSettableProperties>(property: T): ojPopup[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojPopupSettableProperties>(property: T, value: ojPopupSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojPopupSettableProperties>): void;
    setProperties(properties: ojPopupSettablePropertiesLenient): void;
    close(): void;
    isOpen(): boolean;
    open(launcher: string | Element, position?: ojPopup.Position): void;
    refresh(): void;
}
export namespace ojPopup {
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
    interface ojBeforeClose extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojBeforeOpen extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojClose extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojFocus extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojOpen extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type autoDismissChanged = JetElementCustomEvent<ojPopup["autoDismiss"]>;
    // tslint:disable-next-line interface-over-type-literal
    type chromeChanged = JetElementCustomEvent<ojPopup["chrome"]>;
    // tslint:disable-next-line interface-over-type-literal
    type initialFocusChanged = JetElementCustomEvent<ojPopup["initialFocus"]>;
    // tslint:disable-next-line interface-over-type-literal
    type modalityChanged = JetElementCustomEvent<ojPopup["modality"]>;
    // tslint:disable-next-line interface-over-type-literal
    type positionChanged = JetElementCustomEvent<ojPopup["position"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tailChanged = JetElementCustomEvent<ojPopup["tail"]>;
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
        horizontal?: 'start' | 'end' | 'left' | 'center' | 'right';
        vertical?: 'top' | 'bottom' | 'center';
    };
    // tslint:disable-next-line interface-over-type-literal
    type PositionPoint = {
        x?: number;
        y?: number;
    };
}
export interface ojPopupEventMap extends baseComponentEventMap<ojPopupSettableProperties> {
    'ojAnimateEnd': ojPopup.ojAnimateEnd;
    'ojAnimateStart': ojPopup.ojAnimateStart;
    'ojBeforeClose': ojPopup.ojBeforeClose;
    'ojBeforeOpen': ojPopup.ojBeforeOpen;
    'ojClose': ojPopup.ojClose;
    'ojFocus': ojPopup.ojFocus;
    'ojOpen': ojPopup.ojOpen;
    'autoDismissChanged': JetElementCustomEvent<ojPopup["autoDismiss"]>;
    'chromeChanged': JetElementCustomEvent<ojPopup["chrome"]>;
    'initialFocusChanged': JetElementCustomEvent<ojPopup["initialFocus"]>;
    'modalityChanged': JetElementCustomEvent<ojPopup["modality"]>;
    'positionChanged': JetElementCustomEvent<ojPopup["position"]>;
    'tailChanged': JetElementCustomEvent<ojPopup["tail"]>;
}
export interface ojPopupSettableProperties extends baseComponentSettableProperties {
    autoDismiss: 'none' | 'focusLoss';
    chrome: 'default' | 'none';
    initialFocus: 'auto' | 'none' | 'firstFocusable' | 'popup';
    modality: 'modeless' | 'modal';
    position: ojPopup.Position;
    tail: 'none' | 'simple';
    translations: {
        ariaCloseSkipLink?: string;
        ariaFocusSkipLink?: string;
        ariaLiveRegionInitialFocusFirstFocusable?: string;
        ariaLiveRegionInitialFocusFirstFocusableTouch?: string;
        ariaLiveRegionInitialFocusNone?: string;
        ariaLiveRegionInitialFocusNoneTouch?: string;
    };
}
export interface ojPopupSettablePropertiesLenient extends Partial<ojPopupSettableProperties> {
    [key: string]: any;
}
export type PopupElement = ojPopup;
export namespace PopupElement {
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
    interface ojBeforeClose extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojBeforeOpen extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojClose extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojFocus extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    interface ojOpen extends CustomEvent<{
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type autoDismissChanged = JetElementCustomEvent<ojPopup["autoDismiss"]>;
    // tslint:disable-next-line interface-over-type-literal
    type chromeChanged = JetElementCustomEvent<ojPopup["chrome"]>;
    // tslint:disable-next-line interface-over-type-literal
    type initialFocusChanged = JetElementCustomEvent<ojPopup["initialFocus"]>;
    // tslint:disable-next-line interface-over-type-literal
    type modalityChanged = JetElementCustomEvent<ojPopup["modality"]>;
    // tslint:disable-next-line interface-over-type-literal
    type positionChanged = JetElementCustomEvent<ojPopup["position"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tailChanged = JetElementCustomEvent<ojPopup["tail"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Position = {
        at?: ojPopup.PositionAlign;
        collision?: 'flip' | 'fit' | 'flipfit' | 'flipcenter' | 'none';
        my?: ojPopup.PositionAlign;
        of?: string | ojPopup.PositionPoint;
        offset?: ojPopup.PositionPoint;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PositionAlign = {
        horizontal?: 'start' | 'end' | 'left' | 'center' | 'right';
        vertical?: 'top' | 'bottom' | 'center';
    };
    // tslint:disable-next-line interface-over-type-literal
    type PositionPoint = {
        x?: number;
        y?: number;
    };
}
export interface PopupIntrinsicProps extends Partial<Readonly<ojPopupSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojPopupEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojPopupEventMap['ojAnimateStart']) => void;
    onojBeforeClose?: (value: ojPopupEventMap['ojBeforeClose']) => void;
    onojBeforeOpen?: (value: ojPopupEventMap['ojBeforeOpen']) => void;
    onojClose?: (value: ojPopupEventMap['ojClose']) => void;
    onojFocus?: (value: ojPopupEventMap['ojFocus']) => void;
    onojOpen?: (value: ojPopupEventMap['ojOpen']) => void;
    onautoDismissChanged?: (value: ojPopupEventMap['autoDismissChanged']) => void;
    onchromeChanged?: (value: ojPopupEventMap['chromeChanged']) => void;
    oninitialFocusChanged?: (value: ojPopupEventMap['initialFocusChanged']) => void;
    onmodalityChanged?: (value: ojPopupEventMap['modalityChanged']) => void;
    onpositionChanged?: (value: ojPopupEventMap['positionChanged']) => void;
    ontailChanged?: (value: ojPopupEventMap['tailChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-popup": PopupIntrinsicProps;
        }
    }
}
