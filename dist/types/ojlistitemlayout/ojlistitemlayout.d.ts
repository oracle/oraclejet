import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps, Slot } from 'ojs/ojvcomponent';
import { Component, ComponentChildren } from 'preact';
declare class ListItemLayoutProps {
    children?: ComponentChildren;
    overline?: Slot;
    selector?: Slot;
    leading?: Slot;
    secondary?: Slot;
    tertiary?: Slot;
    metadata?: Slot;
    trailing?: Slot;
    action?: Slot;
    quaternary?: Slot;
    navigation?: Slot;
}
export declare class ListItemLayout extends Component<ExtendGlobalProps<ListItemLayoutProps>> {
    private readonly _hasContent;
    private _getWrappedSlotContent;
    private _getWrappedSlotContentWithClickThroughDisabled;
    render(props: ExtendGlobalProps<ListItemLayoutProps>): import("preact").JSX.Element;
}
export {};
export interface ListItemLayoutElement extends JetElement<ListItemLayoutElementSettableProperties>, ListItemLayoutElementSettableProperties {
    addEventListener<T extends keyof ListItemLayoutElementEventMap>(type: T, listener: (this: HTMLElement, ev: ListItemLayoutElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ListItemLayoutElementSettableProperties>(property: T): ListItemLayoutElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ListItemLayoutElementSettableProperties>(property: T, value: ListItemLayoutElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ListItemLayoutElementSettableProperties>): void;
    setProperties(properties: ListItemLayoutElementSettablePropertiesLenient): void;
}
export interface ListItemLayoutElementEventMap extends HTMLElementEventMap {
}
export interface ListItemLayoutElementSettableProperties extends JetSettableProperties {
}
export interface ListItemLayoutElementSettablePropertiesLenient extends Partial<ListItemLayoutElementSettableProperties> {
    [key: string]: any;
}
export interface ListItemLayoutIntrinsicProps extends Partial<Readonly<ListItemLayoutElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-list-item-layout': ListItemLayoutIntrinsicProps;
        }
    }
}
