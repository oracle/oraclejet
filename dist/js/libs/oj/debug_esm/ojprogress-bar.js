/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component } from 'preact';
import { getTranslatedString } from 'ojs/ojtranslation';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
 * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojProgressBar.html"
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
let ProgressBar = class ProgressBar extends Component {
    render(props) {
        return props.value === -1
            ? this._renderIndeterminateBar(props)
            : this._renderDeterminateBar(props);
    }
    _renderDeterminateBar(props) {
        let max = props.max;
        let value = props.value;
        if (max < 0) {
            max = 0;
        }
        if (value < 0) {
            value = 0;
        }
        const percentage = max === 0 ? 0 : value > max ? 1 : value / max;
        return (jsx(Root, { class: "oj-progress-bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": max, "aria-valuenow": value, children: jsx("div", { class: "oj-progress-bar-track", children: jsx("div", { class: "oj-progress-bar-value", style: { width: percentage * 100 + '%' } }) }) }));
    }
    _renderIndeterminateBar(props) {
        return (jsx(Root, { class: "oj-progress-bar", role: "progressbar", "aria-valuetext": getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText'), children: jsx("div", { class: "oj-progress-bar-track", children: jsx("div", { class: "oj-progress-bar-value oj-progress-bar-indeterminate" }) }) }));
    }
};
ProgressBar.defaultProps = {
    max: 100,
    value: 0
};
ProgressBar._metadata = { "properties": { "max": { "type": "number" }, "value": { "type": "number" } } };
ProgressBar = __decorate([
    customElement('oj-progress-bar')
], ProgressBar);

export { ProgressBar };
