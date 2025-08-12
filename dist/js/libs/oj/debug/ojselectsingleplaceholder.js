/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact', 'ojs/ojvcomponent'], function (exports, jsxRuntime, preact, ojvcomponent) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    /**
     * @classdesc
     * <h3 id="SelectSinglePlaceholderOverview-section">
     *   JET Select Single Placeholder
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#SelectSinglePlaceholderOverview-section"></a>
     * </h3>
     * <p>Description: A custom element that renders a placeholder for a SelectSingle. This should only be used in a data-cell in "Navigation" mode within a DataGrid template.</p>
     * <pre class="prettyprint">
     * <code>// Placeholder for a single select component within an oj-bind-if within a DataGrid template
     * &lt;oj-bind-if test='[[cell.mode=="navigation"]]'>
     *   &lt;oj-select-single-placeholder on-oj-dropdown-icon-action="[[downArrowIconClick]]"
     *     value="[[cell.item.data.data]]">
     *   &lt;/oj-select-single-placeholder>
     * &lt;/oj-bind-if>
     * </code></pre>
     * @ojmetadata description "A custom element that renders a placeholder for a SelectSingle."
     * @ojmetadata displayName "Select Single Placeholder"
     * @ojmetadata main "ojs/ojselectsingleplaceholder"
     * @ojmetadata extension {
     *   "oracle": {
     *     "icon": "oj-ux-ico-select",
     *     "uxSpecs": ["select-single-item"]
     *   },
     *   "vbdt": {
     *     "module": "ojs/ojselectsingleplaceholder",
     *     "defaultColumns": "1",
     *     "minColumns": "1"
     *   }
     * }
     * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojSelectSinglePlaceholder.html"
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "data",
     *     "items": [ "value"]
     *   }
     * ]
     * @ojmetadata preferredParent [{parentInterface: "DataGridElement"}]
     * @ojmetadata since "19.0.0"
     */
    exports.SelectSinglePlaceholder = class SelectSinglePlaceholder extends preact.Component {
        constructor() {
            super(...arguments);
            this._handleIconClick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.props?.onOjDropdownIconAction();
            };
        }
        render(props) {
            return (jsxRuntime.jsxs("div", { class: "oj-select-single-placeholder-container", children: [jsxRuntime.jsx("div", { className: "oj-text-field-middle", children: props.value }), jsxRuntime.jsx("span", { onClick: this._handleIconClick, class: "oj-text-field-end", children: jsxRuntime.jsx("span", { className: "oj-searchselect-arrow oj-searchselect-open-icon oj-component-icon", "aria-hidden": "true" }) })] }));
        }
    };
    exports.SelectSinglePlaceholder.defaultProps = {
        value: null
    };
    exports.SelectSinglePlaceholder._metadata = { "properties": { "value": { "type": "string" } }, "events": { "ojDropdownIconAction": {} } };
    exports.SelectSinglePlaceholder = __decorate([
        ojvcomponent.customElement('oj-select-single-placeholder')
    ], exports.SelectSinglePlaceholder);

    Object.defineProperty(exports, '__esModule', { value: true });

});
