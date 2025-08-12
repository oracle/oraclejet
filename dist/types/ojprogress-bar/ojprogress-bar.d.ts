/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps } from 'ojs/ojvcomponent';
import { Component, ComponentChild } from 'preact';
type Props = {
    /**
     * @description
     * The maximum allowed value. The element's max attribute is used if it
     * is provided, otherwise the default value of 100 is used.
     * @ojmetadata description "The maximum allowed value."
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     * @ojmetadata minimum 0
     */
    max?: number;
    /**
     * @description
     * The value of the Progress Bar. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
     * Any other negative value will default to 0.
     *
     * @ojmetadata description "The value of the Progress Bar."
     * @ojmetadata displayName "Value"
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "value"
     * @ojmetadata minimum -1
     */
    value?: number;
};
/**
 * @classdesc
 * <h3 id="progressBarOverview-section">
 *   JET Progress Bar
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressBarOverview-section"></a>
 * </h3>
 * The JET Progress Bar element allows a user to display progress of an operation in a rectangular horizontal meter.
 * If a developer does not wish to display the exact value, a value of '-1' can be passed in to display an indeterminate value.
 *
 * <pre class="prettyprint"><code>&lt;oj-progress-bar value='{{progressValue}}'>&lt;/oj-progress-bar></code></pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>If this element is being used to describe the loading process of a particular region of a page, then the <code class="prettyprint">aria-describedby</code>
 *    attribute of the region must point to the id of the oj-progress-bar and <code class="prettyprint">aria-busy = "true"</code> must be added to the region until the loading is complete.</p>
 *
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 *  </h3>
 *  To migrate from oj-progress-bar to oj-c-progress-bar, you need to revise the import statement and references to oj-progress-bar in your app.  Please note the changes between the two components below.
 *  <h5>oj-progress-bar-embedded class</h5>
 *  <p>To render a progress bar that is attached to a container, set the edge attribute to 'top' instead of using the 'oj-progress-bar-embedded' class.</p>
 *
 * @ojmetadata description "A progress bar allows the user to visualize the progression of an extended computer operation."
 * @ojmetadata displayName "Progress Bar"
 * @ojmetadata main "ojs/ojprogress-bar"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "15.0.0",
 *     "value": ["oj-c-progress-bar"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-progress-linear",
 *     "uxSpecs": ["progress-bar"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojprogress-bar",
 *     "styleClasses": [
 *       {
 *         "styleGroup": [
 *           "oj-progress-bar-embedded"
 *         ],
 *         "description": "Optional class that can be set on a oj-progress bar element to style an embedded progress bar within a web application or dialog."
 *       }
 *     ],
 *     "defaultColumns": "4",
 *     "minColumns": "1"
 *   },
 *   "themes": {
 *     "unsupportedThemes": [
 *       "Alta"
 *     ]
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojProgressBar.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "max"
 *     ]
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "value"
 *     ]
 *   }
 * ]
 * @ojmetadata since "9.0.0"
 * @ojmetadata styleClasses [
 *   {
 *     "name": "oj-progress-bar-embedded",
 *     "kind": "class",
 *     "displayName": "Embedded",
 *     "description": "Optional class that can be set on a oj-progress bar element to style an embedded progress bar within a web application or dialog.",
 *     "help": "#oj-progress-bar-embedded",
 *     "extension": {
 *         "jet": {
 *            "example": "&lt;div class='oj-web-applayout-page'>\n  &lt;header class='oj-web-applayout-header'>\n  &lt;/header>\n  &lt;oj-progress-bar class='oj-progress-bar-embedded' value='{{loadingValue}}'>\n  &lt;/oj-progress-bar>\n&lt;/div>"
 *          }
 *      }
 *   }
 * ]
 * @ojmetadata styleVariableSet {"name": "oj-progress-bar-css-set1",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-progress-bar-height",
 *                                    "description": "Progress bar height",
 *                                    "formats": ["length"],
 *                                    "help": "#css-variables"
 *                                  },
 *                                  {
 *                                    "name": "oj-progress-bar-border-radius",
 *                                    "description": "Progress bar border radius",
 *                                    "formats": ["length","percentage"],
 *                                    "help": "#css-variables"
 *                                  },
 *                                  {
 *                                    "name": "oj-progress-bar-track-bg-color",
 *                                    "description": "Progress bar track background color",
 *                                    "formats": ["color"],
 *                                    "help": "#css-variables"
 *                                  },
 *                                  {
 *                                    "name": "oj-progress-bar-value-bg-color",
 *                                    "description": "Progress bar value background color",
 *                                    "formats": ["color"],
 *                                    "help": "#css-variables"
 *                                  }
 *                                ]
 *                              }
 */
/**
 * This export corresponds to the ProgressBar Preact component. For the oj-progress-bar custom element, import ProgressBarElement instead.
 */
export declare class ProgressBar extends Component<ExtendGlobalProps<Props>> {
    static defaultProps: Partial<Props>;
    render(props: ExtendGlobalProps<Props>): ComponentChild;
    private _renderDeterminateBar;
    private _renderIndeterminateBar;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-progress-bar custom element. For the ProgressBar Preact component, import ProgressBar instead.
 */
export interface ProgressBarElement extends JetElement<ProgressBarElementSettableProperties>, ProgressBarElementSettableProperties {
    addEventListener<T extends keyof ProgressBarElementEventMap>(type: T, listener: (this: HTMLElement, ev: ProgressBarElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ProgressBarElementSettableProperties>(property: T): ProgressBarElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ProgressBarElementSettableProperties>(property: T, value: ProgressBarElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ProgressBarElementSettableProperties>): void;
    setProperties(properties: ProgressBarElementSettablePropertiesLenient): void;
}
export namespace ProgressBarElement {
    type maxChanged = JetElementCustomEventStrict<ProgressBarElement['max']>;
    type valueChanged = JetElementCustomEventStrict<ProgressBarElement['value']>;
}
export interface ProgressBarElementEventMap extends HTMLElementEventMap {
    'maxChanged': JetElementCustomEventStrict<ProgressBarElement['max']>;
    'valueChanged': JetElementCustomEventStrict<ProgressBarElement['value']>;
}
export interface ProgressBarElementSettableProperties extends JetSettableProperties {
    /**
     * The maximum allowed value. The element's max attribute is used if it
     * is provided, otherwise the default value of 100 is used.
     */
    max?: Props['max'];
    /**
     * The value of the Progress Bar. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
     * Any other negative value will default to 0.
     */
    value?: Props['value'];
}
export interface ProgressBarElementSettablePropertiesLenient extends Partial<ProgressBarElementSettableProperties> {
    [key: string]: any;
}
export interface ProgressBarIntrinsicProps extends Partial<Readonly<ProgressBarElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmaxChanged?: (value: ProgressBarElementEventMap['maxChanged']) => void;
    onvalueChanged?: (value: ProgressBarElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-progress-bar': ProgressBarIntrinsicProps;
        }
    }
}
