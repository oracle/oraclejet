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
     *
     * @ojmetadata description "The maximum allowed value."
     * @ojmetadata displayName "Max"
     * @ojmetadata help "max"
     * @ojmetadata minimum 0
     */
    max?: number;
    /**
     * @description
     * The value of the Progress Circle. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
     * Any other negative value will default to 0.
     *
     * @ojmetadata description "The value of the Progress Circle."
     * @ojmetadata displayName "Value"
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#value"
     * @ojmetadata minimum -1
     */
    value?: number;
    /**
     * @ojmetadata description "Specifies the size of the progress circle."
     * @ojmetadata displayName "Size"
     * @ojmetadata help "#size"
     * @ojmetadata propertyEditorValues {
     *     "sm": {
     *       "description": "small progress circle",
     *       "displayName": "Small"
     *     },
     *     "md": {
     *       "description": "medium progress circle (default, if unspecified)",
     *       "displayName": "Medium"
     *     },
     *     "lg": {
     *       "description": "large progress circle",
     *       "displayName": "Large"
     *     }
     *   }
     */
    size?: 'sm' | 'md' | 'lg';
};
/**
 * @classdesc
 * <h3 id="progressCircleOverview-section">
 *   JET Progress Circle
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressCircleOverview-section"></a>
 * </h3>
 * The JET Progress Circle element allows a user to display progress of an operation with a circular meter.
 * If a developer does not wish to display the exact value, a value of '-1' can be passed in to display an indeterminate value.
 *
 * <pre class="prettyprint"><code>&lt;oj-progress-circle value='{{progressValue}}'>&lt;/oj-progress-circle></code></pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>If this element is being used to describe the loading process of a particular region of a page, then the <code class="prettyprint">aria-describedby</code>
 *    attribute of the region must point to the id of the oj-progress-circle and <code class="prettyprint">aria-busy = "true"</code> must be added to the region until the loading is complete.</p>
 *
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 * To migrate from oj-progress-circle to oj-c-progress-circle, you need to revise the import statement and references to oj-progress-circle in your app.
 * No other changes are needed, as the attributes and methods for the components are the same.
 *
 * @ojmetadata description "A progress circle allows the user to visualize the progression of an extended computer operation."
 * @ojmetadata displayName "Progress Circle"
 * @ojmetadata main "ojs/ojprogress-circle"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "15.0.0",
 *     "value": ["oj-c-progress-circle"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-circular-progress-7",
 *     "uxSpecs": ["progress-bar"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojprogress-circle",
 *     "defaultColumns": "4",
 *     "minColumns": "1"
 *   },
 *   "themes": {
 *     "unsupportedThemes": [
 *       "Alta"
 *     ]
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojProgressCircle.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "size",
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
 * @ojmetadata styleVariableSet {"name": "oj-progress-circle-set1",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-progress-circle-value-bg-color",
 *                                    "description": "Progress circle value background color",
 *                                    "formats": ["color"],
 *                                    "help": "#css-variables"
 *                                  },
 *                                  {
 *                                    "name": "oj-progress-circle-determinate-track-bg-color",
 *                                    "description": "Determinate progress circle track background color",
 *                                    "formats": ["color"],
 *                                    "help": "#css-variables"
 *                                  }
 *                                ]
 *                              }
 * @ojmetadata styleVariableSet {"name": "oj-progress-circle-set2", "displayName": "Small size",
 *                                "description": "CSS variables used by small size progress circles",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-progress-circle-sm-size",
 *                                    "description": "Progress circle size applied to small ones",
 *                                    "formats": ["length"],
 *                                    "help": "#oj-progress-circle-set2"
 *                                  },
 *                                  {
 *                                    "name": "oj-progress-circle-sm-track-width",
 *                                    "description": "Progress circle track width applied to small sizing progress circles",
 *                                    "formats": ["length"],
 *                                    "help": "#oj-progress-circle-set2"
 *                                  }
 *                                ]
 *                              }
 * @ojmetadata styleVariableSet {"name": "oj-progress-circle-set3", "displayName": "Medium size",
 *                                "description": "CSS variables used by medium size progress circles",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-progress-circle-md-size",
 *                                    "description": "Progress circle size applied to medium ones",
 *                                    "formats": ["length"],
 *                                    "help": "#oj-progress-circle-set3"
 *                                  },
 *                                  {
 *                                    "name": "oj-progress-circle-md-track-width",
 *                                    "description": "Progress circle track width applied to medium sizing progress circles",
 *                                    "formats": ["length"],
 *                                    "help": "#oj-progress-circle-set3"
 *                                  }
 *                                ]
 *                              }
 * @ojmetadata styleVariableSet {"name": "oj-progress-circle-set4", "displayName": "Large size",
 *                                "description": "CSS variables used by large size progress circles",
 *                                "styleVariables": [
 *                                  {
 *                                    "name": "oj-progress-circle-lg-size",
 *                                    "description": "Progress circle size applied to large ones",
 *                                    "formats": ["length"],
 *                                    "help": "#oj-progress-circle-set4"
 *                                  },
 *                                  {
 *                                    "name": "oj-progress-circle-lg-track-width",
 *                                    "description": "Progress circle track width applied to large sizing progress circles",
 *                                    "formats": ["length"],
 *                                    "help": "#oj-progress-circle-set4"
 *                                  }
 *                                ]
 *                              }
 */
/**
 * This export corresponds to the ProgressCircle Preact component. For the oj-progress-circle custom element, import ProgressCircleElement instead.
 */
export declare class ProgressCircle extends Component<ExtendGlobalProps<Props>> {
    static defaultProps: Partial<Props>;
    render(props: ExtendGlobalProps<Props>): ComponentChild;
    private _renderIndeterminateCircle;
    private _renderDeterminateCircle;
    private _getClipPath;
    private _calculateTangent;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-progress-circle custom element. For the ProgressCircle Preact component, import ProgressCircle instead.
 */
export interface ProgressCircleElement extends JetElement<ProgressCircleElementSettableProperties>, ProgressCircleElementSettableProperties {
    addEventListener<T extends keyof ProgressCircleElementEventMap>(type: T, listener: (this: HTMLElement, ev: ProgressCircleElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ProgressCircleElementSettableProperties>(property: T): ProgressCircleElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ProgressCircleElementSettableProperties>(property: T, value: ProgressCircleElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ProgressCircleElementSettableProperties>): void;
    setProperties(properties: ProgressCircleElementSettablePropertiesLenient): void;
}
export namespace ProgressCircleElement {
    type maxChanged = JetElementCustomEventStrict<ProgressCircleElement['max']>;
    type sizeChanged = JetElementCustomEventStrict<ProgressCircleElement['size']>;
    type valueChanged = JetElementCustomEventStrict<ProgressCircleElement['value']>;
}
export interface ProgressCircleElementEventMap extends HTMLElementEventMap {
    'maxChanged': JetElementCustomEventStrict<ProgressCircleElement['max']>;
    'sizeChanged': JetElementCustomEventStrict<ProgressCircleElement['size']>;
    'valueChanged': JetElementCustomEventStrict<ProgressCircleElement['value']>;
}
export interface ProgressCircleElementSettableProperties extends JetSettableProperties {
    /**
     * The maximum allowed value. The element's max attribute is used if it
     * is provided, otherwise the default value of 100 is used.
     */
    max?: Props['max'];
    size?: Props['size'];
    /**
     * The value of the Progress Circle. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
     * Any other negative value will default to 0.
     */
    value?: Props['value'];
}
export interface ProgressCircleElementSettablePropertiesLenient extends Partial<ProgressCircleElementSettableProperties> {
    [key: string]: any;
}
export interface ProgressCircleIntrinsicProps extends Partial<Readonly<ProgressCircleElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmaxChanged?: (value: ProgressCircleElementEventMap['maxChanged']) => void;
    onsizeChanged?: (value: ProgressCircleElementEventMap['sizeChanged']) => void;
    onvalueChanged?: (value: ProgressCircleElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-progress-circle': ProgressCircleIntrinsicProps;
        }
    }
}
