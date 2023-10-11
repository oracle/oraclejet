import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { Component, ComponentChild } from 'preact';
import { ExtendGlobalProps } from 'ojs/ojvcomponent';
type Props = {
    text?: string;
    matchText?: string;
};
export declare class HighlightText extends Component<ExtendGlobalProps<Props>> {
    private _HIGHLIGHT_TOKEN;
    static defaultProps: Partial<Props>;
    render(props: ExtendGlobalProps<Props>): ComponentChild;
    private _highlighter;
    private _escapeRegExp;
}
export {};
export interface HighlightTextElement extends JetElement<HighlightTextElementSettableProperties>, HighlightTextElementSettableProperties {
    addEventListener<T extends keyof HighlightTextElementEventMap>(type: T, listener: (this: HTMLElement, ev: HighlightTextElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof HighlightTextElementSettableProperties>(property: T): HighlightTextElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof HighlightTextElementSettableProperties>(property: T, value: HighlightTextElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, HighlightTextElementSettableProperties>): void;
    setProperties(properties: HighlightTextElementSettablePropertiesLenient): void;
}
export namespace HighlightTextElement {
    type matchTextChanged = JetElementCustomEventStrict<HighlightTextElement['matchText']>;
    type textChanged = JetElementCustomEventStrict<HighlightTextElement['text']>;
}
export interface HighlightTextElementEventMap extends HTMLElementEventMap {
    'matchTextChanged': JetElementCustomEventStrict<HighlightTextElement['matchText']>;
    'textChanged': JetElementCustomEventStrict<HighlightTextElement['text']>;
}
export interface HighlightTextElementSettableProperties extends JetSettableProperties {
    matchText?: Props['matchText'];
    text?: Props['text'];
}
export interface HighlightTextElementSettablePropertiesLenient extends Partial<HighlightTextElementSettableProperties> {
    [key: string]: any;
}
export interface HighlightTextIntrinsicProps extends Partial<Readonly<HighlightTextElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmatchTextChanged?: (value: HighlightTextElementEventMap['matchTextChanged']) => void;
    ontextChanged?: (value: HighlightTextElementEventMap['textChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-highlight-text': HighlightTextIntrinsicProps;
        }
    }
}
