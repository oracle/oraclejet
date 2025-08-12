/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Component, ComponentChild } from 'preact';
import { ExtendGlobalProps } from 'ojs/ojvcomponent';
type Props = {
    /**
     * @ojmetadata description "The text string to apply highlighting to."
     * @ojmetadata displayName "Text"
     * @ojmetadata help "#text"
     * @ojmetadata translatable
     */
    text?: string;
    /**
     * @ojmetadata description "The text string to match."
     * @ojmetadata displayName "Match Text"
     * @ojmetadata help "#matchText"
     * @ojmetadata translatable
     */
    matchText?: string;
};
/**
 * @classdesc
 * <h3 id="highlightTextOverview-section">
 *   JET Highlight Text
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#highlightTextOverview-section"></a>
 * </h3>
 * <p>Description: JET Highlight Text renders text with highlighting applied.</p>
 *
 * <p>JET Highlight Text renders a text string with highlighting applied to the given text to match.</p>
 *
 * A Highlight Text can be created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-highlight-text
 *   text='My text to apply highlighting to.'
 *   match-text='igh'>
 * &lt;/oj-highlight-text>
 * </code></pre>
 *
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 *
 * <p>
 * To migrate from oj-highlight-text to oj-c-highlight-text, you need to revise the import statement
 * and references to oj-c-highlight-text in your app.
 * </p>
 *
 * @ojmetadata description "A Highlight Text renders text with highlighting applied."
 * @ojmetadata displayName "Highlight Text"
 * @ojmetadata main "ojs/ojhighlighttext"
 * @ojmetadata extension {
 *   "vbdt": {
 *     "module": "ojs/ojhighlighttext",
 *     "defaultColumns": "6",
 *     "minColumns": "2"
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-background-color"
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojHighlightText.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "text",
 *       "matchText"
 *     ]
 *   }
 * ]
 * @ojmetadata since "9.1.0"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "16.0.0",
 *     "value": ["oj-c-highlight-text"]
 *   }
 * ]
 */
/**
 * This export corresponds to the HighlightText Preact component. For the oj-highlight-text custom element, import HighlightTextElement instead.
 */
export declare class HighlightText extends Component<ExtendGlobalProps<Props>> {
    private _HIGHLIGHT_TOKEN;
    static defaultProps: Partial<Props>;
    render(props: ExtendGlobalProps<Props>): ComponentChild;
    private _highlighter;
    private _escapeRegExp;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-highlight-text custom element. For the HighlightText Preact component, import HighlightText instead.
 */
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
