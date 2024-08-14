import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import * as ojcommontypes from 'ojs/ojcommontypes';
import { DataProvider, ItemMetadata } from 'ojs/ojdataprovider';
import { Action, DynamicTemplateSlots, ExtendGlobalProps } from 'ojs/ojvcomponent';
import { Component, ComponentChild } from 'preact';
import 'ojs/ojbutton';
type MessageBannerSeverity = 'error' | 'warning' | 'confirmation' | 'info' | 'none';
export type MessageBannerItem = {
    closeAffordance?: 'on' | 'off';
    detail?: string;
    severity?: MessageBannerSeverity;
    sound?: 'default' | 'none' | string;
    summary?: string;
    timestamp?: string;
};
export type MessageBannerTemplateContext<K, D> = {
    data: D;
    index: number;
    key: K;
    metadata?: ItemMetadata<K>;
};
type CloseActionDetail<K, D> = {
    data: D;
    key: K;
    metadata?: ItemMetadata<K>;
};
type Props<Key, Data> = {
    data: DataProvider<Key, Data>;
    type?: 'page' | 'section';
    detailTemplateValue?: string | ((itemContext: ojcommontypes.ItemContext<Key, Data>) => string | null);
    messageTemplates?: DynamicTemplateSlots<MessageBannerTemplateContext<Key, Data>>;
    onOjClose?: Action<CloseActionDetail<Key, Data>>;
};
type State<K, D> = {
    dataProviderCount: number;
    previousDataProvider: DataProvider<K, D>;
};
export declare class MessageBanner<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> extends Component<ExtendGlobalProps<Props<K, D>>, State<K, D>> {
    static defaultProps: Partial<Props<unknown, unknown>>;
    static getDerivedStateFromProps(props: Readonly<Props<unknown, unknown>>, state: Readonly<State<unknown, unknown>>): {
        dataProviderCount: number;
        previousDataProvider: DataProvider<unknown, unknown>;
    };
    private readonly _rootRef?;
    private readonly WrapperMessagesContainer;
    private readonly _addBusyState;
    private readonly _handleCloseMessage;
    constructor(props: ExtendGlobalProps<Props<K, D>>);
    render(props?: ExtendGlobalProps<Props<K, D>>): ComponentChild;
}
export {};
export interface MessageBannerElement<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> extends JetElement<MessageBannerElementSettableProperties<K, D>>, MessageBannerElementSettableProperties<K, D> {
    addEventListener<T extends keyof MessageBannerElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: MessageBannerElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof MessageBannerElementSettableProperties<K, D>>(property: T): MessageBannerElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof MessageBannerElementSettableProperties<K, D>>(property: T, value: MessageBannerElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, MessageBannerElementSettableProperties<K, D>>): void;
    setProperties(properties: MessageBannerElementSettablePropertiesLenient<K, D>): void;
}
export namespace MessageBannerElement {
    interface ojClose<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> extends CustomEvent<CloseActionDetail<K, D> & {}> {
    }
    type dataChanged<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> = JetElementCustomEventStrict<MessageBannerElement<K, D>['data']>;
    type detailTemplateValueChanged<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> = JetElementCustomEventStrict<MessageBannerElement<K, D>['detailTemplateValue']>;
    type typeChanged<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> = JetElementCustomEventStrict<MessageBannerElement<K, D>['type']>;
    type RenderDetailTemplate<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> = import('ojs/ojvcomponent').TemplateSlot<MessageBannerTemplateContext<K, D>>;
}
export interface MessageBannerElementEventMap<K extends string | number = string | number, D extends MessageBannerItem = MessageBannerItem> extends HTMLElementEventMap {
    'ojClose': MessageBannerElement.ojClose<K, D>;
    'dataChanged': JetElementCustomEventStrict<MessageBannerElement<K, D>['data']>;
    'detailTemplateValueChanged': JetElementCustomEventStrict<MessageBannerElement<K, D>['detailTemplateValue']>;
    'typeChanged': JetElementCustomEventStrict<MessageBannerElement<K, D>['type']>;
}
export interface MessageBannerElementSettableProperties<Key, Data> extends JetSettableProperties {
    data: Props<Key, Data>['data'];
    detailTemplateValue?: Props<Key, Data>['detailTemplateValue'];
    type?: Props<Key, Data>['type'];
}
export interface MessageBannerElementSettablePropertiesLenient<Key, Data> extends Partial<MessageBannerElementSettableProperties<Key, Data>> {
    [key: string]: any;
}
export interface MessageBannerIntrinsicProps extends Partial<Readonly<MessageBannerElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojClose?: (value: MessageBannerElementEventMap<any, any>['ojClose']) => void;
    ondataChanged?: (value: MessageBannerElementEventMap<any, any>['dataChanged']) => void;
    ondetailTemplateValueChanged?: (value: MessageBannerElementEventMap<any, any>['detailTemplateValueChanged']) => void;
    ontypeChanged?: (value: MessageBannerElementEventMap<any, any>['typeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-message-banner': MessageBannerIntrinsicProps;
        }
    }
}
