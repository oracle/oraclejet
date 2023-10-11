import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { Action, Bubbles, ExtendGlobalProps, ObservedGlobalProps } from 'ojs/ojvcomponent';
import { Component, ComponentChildren } from 'preact';
type Props = ObservedGlobalProps<'tabIndex' | 'role'> & {
    children?: ComponentChildren;
    onOjAction?: Action<ActionDetail> & Bubbles;
};
type State = {
    active?: boolean;
    focus?: boolean;
};
type ActionDetail = {
    originalEvent: Event;
};
export declare class ActionCard extends Component<ExtendGlobalProps<Props>, State> {
    private readonly _rootRef;
    constructor(props: Readonly<Props>);
    render(props: ExtendGlobalProps<Props>, state: Readonly<State>): import("preact").JSX.Element;
    componentDidMount(): void;
    private _isFromActiveSource;
    private _handleOjAction;
    private readonly _handleStart;
    private readonly _handleUpEnd;
    private readonly _handleClick;
    private readonly _handleTouchcancel;
    private readonly _handleMove;
    private readonly _handleKeydown;
    private readonly _handleKeyup;
    private readonly _handleFocusin;
    private readonly _handleFocusout;
}
export {};
export interface ActionCardElement extends JetElement<ActionCardElementSettableProperties>, ActionCardElementSettableProperties {
    addEventListener<T extends keyof ActionCardElementEventMap>(type: T, listener: (this: HTMLElement, ev: ActionCardElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ActionCardElementSettableProperties>(property: T): ActionCardElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ActionCardElementSettableProperties>(property: T, value: ActionCardElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ActionCardElementSettableProperties>): void;
    setProperties(properties: ActionCardElementSettablePropertiesLenient): void;
}
export namespace ActionCardElement {
    interface ojAction extends CustomEvent<ActionDetail & {}> {
    }
}
export interface ActionCardElementEventMap extends HTMLElementEventMap {
    'ojAction': ActionCardElement.ojAction;
}
export interface ActionCardElementSettableProperties extends JetSettableProperties {
}
export interface ActionCardElementSettablePropertiesLenient extends Partial<ActionCardElementSettableProperties> {
    [key: string]: any;
}
export interface ActionCardIntrinsicProps extends Partial<Readonly<ActionCardElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojAction?: (value: ActionCardElementEventMap['ojAction']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-action-card': ActionCardIntrinsicProps;
        }
    }
}
