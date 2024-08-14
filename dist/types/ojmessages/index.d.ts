import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { ojMessage } from '../ojmessage';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojMessages extends JetElement<ojMessagesSettableProperties> {
    display: 'general' | 'notification';
    displayOptions: ojMessage.DisplayOptions;
    messages: ojMessage.Message[] | null | DataProvider<any, ojMessage.Message>;
    position: ojMessages.Position | null;
    translations: {
        ariaLiveRegion?: {
            navigationFromKeyboard?: string;
            navigationToKeyboard?: string;
            navigationToTouch?: string;
            newMessage?: string;
            noDetail?: string;
        };
        labelLandmark?: string;
    };
    addEventListener<T extends keyof ojMessagesEventMap>(type: T, listener: (this: HTMLElement, ev: ojMessagesEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojMessagesSettableProperties>(property: T): ojMessages[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojMessagesSettableProperties>(property: T, value: ojMessagesSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojMessagesSettableProperties>): void;
    setProperties(properties: ojMessagesSettablePropertiesLenient): void;
    close(message: ojMessage.Message): void;
    closeAll(closeFilter?: (message: ojMessage.Message) => boolean): void;
}
export namespace ojMessages {
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged = JetElementCustomEvent<ojMessages["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojMessages["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesChanged = JetElementCustomEvent<ojMessages["messages"]>;
    // tslint:disable-next-line interface-over-type-literal
    type positionChanged = JetElementCustomEvent<ojMessages["position"]>;
    // tslint:disable-next-line interface-over-type-literal
    type translationsChanged = JetElementCustomEvent<ojMessages["translations"]>;
    // tslint:disable-next-line interface-over-type-literal
    type MessageTemplateContext = {
        componentElement: Element;
        data: ojMessage.Message;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Position = {
        at?: PositionAlign;
        collision?: 'flip' | 'fit' | 'flipfit' | 'none';
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
    // tslint:disable-next-line interface-over-type-literal
    type RenderMessageTemplate = import('ojs/ojvcomponent').TemplateSlot<MessageTemplateContext>;
}
export interface ojMessagesEventMap extends HTMLElementEventMap {
    'displayChanged': JetElementCustomEvent<ojMessages["display"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojMessages["displayOptions"]>;
    'messagesChanged': JetElementCustomEvent<ojMessages["messages"]>;
    'positionChanged': JetElementCustomEvent<ojMessages["position"]>;
    'translationsChanged': JetElementCustomEvent<ojMessages["translations"]>;
}
export interface ojMessagesSettableProperties extends JetSettableProperties {
    display: 'general' | 'notification';
    displayOptions: ojMessage.DisplayOptions;
    messages: ojMessage.Message[] | null | DataProvider<any, ojMessage.Message>;
    position: ojMessages.Position | null;
    translations: {
        ariaLiveRegion?: {
            navigationFromKeyboard?: string;
            navigationToKeyboard?: string;
            navigationToTouch?: string;
            newMessage?: string;
            noDetail?: string;
        };
        labelLandmark?: string;
    };
}
export interface ojMessagesSettablePropertiesLenient extends Partial<ojMessagesSettableProperties> {
    [key: string]: any;
}
export type MessagesElement = ojMessages;
export namespace MessagesElement {
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged = JetElementCustomEvent<ojMessages["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojMessages["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesChanged = JetElementCustomEvent<ojMessages["messages"]>;
    // tslint:disable-next-line interface-over-type-literal
    type positionChanged = JetElementCustomEvent<ojMessages["position"]>;
    // tslint:disable-next-line interface-over-type-literal
    type translationsChanged = JetElementCustomEvent<ojMessages["translations"]>;
    // tslint:disable-next-line interface-over-type-literal
    type MessageTemplateContext = {
        componentElement: Element;
        data: ojMessage.Message;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Position = {
        at?: ojMessages.PositionAlign;
        collision?: 'flip' | 'fit' | 'flipfit' | 'none';
        my?: ojMessages.PositionAlign;
        of?: string | ojMessages.PositionPoint;
        offset?: ojMessages.PositionPoint;
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
    // tslint:disable-next-line interface-over-type-literal
    type RenderMessageTemplate = import('ojs/ojvcomponent').TemplateSlot<MessageTemplateContext>;
}
export interface MessagesIntrinsicProps extends Partial<Readonly<ojMessagesSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondisplayChanged?: (value: ojMessagesEventMap['displayChanged']) => void;
    ondisplayOptionsChanged?: (value: ojMessagesEventMap['displayOptionsChanged']) => void;
    onmessagesChanged?: (value: ojMessagesEventMap['messagesChanged']) => void;
    onpositionChanged?: (value: ojMessagesEventMap['positionChanged']) => void;
    ontranslationsChanged?: (value: ojMessagesEventMap['translationsChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-messages": MessagesIntrinsicProps;
        }
    }
}
