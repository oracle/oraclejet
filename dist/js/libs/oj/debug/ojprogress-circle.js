/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojvcomponent', 'preact', 'ojs/ojtranslation'], function (exports, jsxRuntime, ojvcomponent, preact, Translations) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
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
     * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojProgressCircle.html"
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
    exports.ProgressCircle = class ProgressCircle extends preact.Component {
        render(props) {
            return props.value === -1
                ? this._renderIndeterminateCircle(props)
                : this._renderDeterminateCircle(props);
        }
        _renderIndeterminateCircle(props) {
            return (jsxRuntime.jsx(ojvcomponent.Root, { class: 'oj-progress-circle oj-progress-circle-' + props.size, role: "progressbar", "aria-valuetext": Translations.getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText'), children: jsxRuntime.jsx("div", { class: "oj-progress-circle-indeterminate", children: jsxRuntime.jsx("div", { class: "oj-progress-circle-indeterminate-inner" }) }) }));
        }
        _renderDeterminateCircle(props) {
            let max = props.max;
            let value = props.value;
            if (max < 0) {
                max = 0;
            }
            if (value < 0 && value !== -1) {
                value = 0;
            }
            const percentage = max === 0 ? 0 : value > max ? 1 : value / max;
            const clipPath = this._getClipPath(percentage);
            return (jsxRuntime.jsxs(ojvcomponent.Root, { class: 'oj-progress-circle oj-progress-circle-' + props.size, role: "progressbar", "aria-valuemin": 0, "aria-valuemax": max, "aria-valuenow": value, children: [jsxRuntime.jsx("div", { class: "oj-progress-circle-tracker" }), jsxRuntime.jsx("div", { class: "oj-progress-circle-value", style: { clipPath } })] }));
        }
        _getClipPath(percentage) {
            let tangent;
            if (percentage < 0.125) {
                tangent = this._calculateTangent(percentage) + 50;
                return `polygon(50% 0, ${tangent}% 0, 50% 50%)`;
            }
            else if (percentage < 0.375) {
                if (percentage < 0.25) {
                    tangent = 50 - this._calculateTangent(0.25 - percentage);
                }
                else {
                    tangent = this._calculateTangent(percentage - 0.25) + 50;
                }
                return `polygon(50% 0, 100% 0, 100% ${tangent}%, 50% 50%)`;
            }
            else if (percentage < 0.625) {
                if (percentage < 0.5) {
                    tangent = 50 + this._calculateTangent(0.5 - percentage);
                }
                else {
                    tangent = 50 - this._calculateTangent(percentage - 0.5);
                }
                return `polygon(50% 0, 100% 0, 100% 100%, ${tangent}% 100%, 50% 50%)`;
            }
            else if (percentage < 0.875) {
                if (percentage < 0.75) {
                    tangent = 50 + this._calculateTangent(0.75 - percentage);
                }
                else {
                    tangent = 50 - this._calculateTangent(percentage - 0.75);
                }
                return `polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% ${tangent}%, 50% 50%)`;
            }
            tangent = 50 - this._calculateTangent(1 - percentage);
            return `polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% 0%, ${tangent}% 0%, 50% 50%)`;
        }
        _calculateTangent(percentage) {
            return 50 * Math.tan(percentage * 2 * Math.PI);
        }
    };
    exports.ProgressCircle.defaultProps = {
        max: 100,
        value: 0,
        size: 'md'
    };
    exports.ProgressCircle._metadata = { "properties": { "max": { "type": "number" }, "value": { "type": "number" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] } } };
    exports.ProgressCircle = __decorate([
        ojvcomponent.customElement('oj-progress-circle')
    ], exports.ProgressCircle);

    Object.defineProperty(exports, '__esModule', { value: true });

});
