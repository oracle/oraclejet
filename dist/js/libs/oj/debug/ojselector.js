/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojvcomponent', 'preact', 'ojs/ojdomutils', 'preact/hooks'], function (exports, jsxRuntime, ojvcomponent, preact, DomUtils, hooks) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    /**
     * @classdesc
     * <h3 id="selectorOverview-section">
     *   JET Selector
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectorOverview-section"></a>
     * </h3>
     * <p>Description: A checkbox to support selection in Collection Components</p>
     * <p>The oj-selector is a component that may be placed within a template for Table, ListView.
     * It presents as a checkbox when the Collection Component is configured for multi-selection.
     * Note that the selector does not prevent click events from bubbling up to the containing element.
     * In cases where an application wishes to prevent the containing element or component from performing
     * a default action based on these click events, the application must ensure the appropriate updates
     * are made (ie. setting the data-oj-clickthrough='disabled' attribute on a selector within an
     * <oj-list-view> that does not include an <oj-list-item-layout>).</p>
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-list-view id="listview"
     *      data="[[dataProvider]]"
     *      selected="{{selectedItems}}"
     *      selection-mode="[[selectedSelectionMode]]"
     *      scroll-policy="loadMoreOnScroll">
     *  &lt;template slot="itemTemplate" data-oj-as="item">
     *    &lt;li>
     *      &lt;div class='oj-flex'>
     *        &lt;div class="oj-flex-item">
     *          &lt;oj-selector selected-keys='{{selectedItems}}'
     *                        selection-mode='[[selectedSelectionMode]]'
     *                        row-key='[[item.key]]'>
     *          &lt;/oj-selector>
     *        &lt;/div>
     *        &lt;div class="oj-flex-item">
     *          &lt;span data-bind="text: 'Name '+ item.data.name">&lt;/span>
     *        &lt;/div>
     *      &lt;/div>
     *    &lt;/li>
     *  &lt;/template>
     * &lt;/oj-list-view>
     * </code></pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>Application must specify a value for the aria-label attribute with a meaningful description of the purpose of this selector in order for this to be accessible.</p>
     *
     * <h3 id="migration-section">
     *   Migration
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
     * </h3>
     * To migrate from oj-selector to oj-c-selector or oj-c-selector-all, you need to revise the import statement and references to oj-selector in your app. Please note the changes between the two components below.
     * <h5 id="dataprovider-key-type-migration"></h5>
     *
     * <h5>selection-mode attribute</h5>
     * <p>For selection-mode="single"|"multiple", please use oj-c-selector; for selection-mode="all", please use oj-c-selector-all.</p>
     *
     *
     * @typeparam {object} K Type of key
     * @ojmetadata description "The selector component renders checkboxes in collections to support selection."
     * @ojmetadata displayName "Selector"
     * @ojmetadata main "ojs/ojselector"
     * @ojmetadata status [
     *   {
     *     "type": "maintenance",
     *     "since": "16.0.0",
     *     "value": ["oj-c-selector", "oj-c-selector-all"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "vbdt": {
     *     "module": "ojs/ojselector"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-check-square"
     *   }
     * }
     * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojSelector.html"
     * @ojmetadata since "9.0.0"
     */
    exports.Selector = class Selector extends preact.Component {
        constructor(props) {
            super(props);
            this.ref = preact.createRef();
            /**
             * focusin event listener
             */
            this._handleFocusin = (event) => {
                this.setState({ focus: true });
            };
            /**
             * focusout event listener
             */
            this._handleFocusout = (event) => {
                this.setState({ focus: false });
            };
            this._checkboxListener = (event) => {
                const { selectedKeys, rowKey, selectionMode, indeterminate } = this.props;
                let newSelectedKeys;
                if (selectedKeys != null) {
                    if (event.target.checked) {
                        if (selectionMode === 'multiple') {
                            // default is multiple
                            newSelectedKeys = selectedKeys.add([rowKey]);
                        }
                        else if (selectionMode === 'all') {
                            newSelectedKeys = selectedKeys.addAll();
                        }
                        else if (selectionMode === 'single' && !selectedKeys.has(rowKey)) {
                            // optimize to prevent rebuilding a new keyset.
                            // If the keyset already has the key value we can ignore the process
                            newSelectedKeys = selectedKeys.clear().add([rowKey]);
                        }
                    }
                    else {
                        if (selectionMode === 'all') {
                            if (indeterminate) {
                                newSelectedKeys = selectedKeys.addAll();
                            }
                            else {
                                newSelectedKeys = selectedKeys.clear();
                            }
                        }
                        else {
                            newSelectedKeys = selectedKeys.delete([rowKey]);
                        }
                    }
                    this.props.onSelectedKeysChanged?.(newSelectedKeys);
                    // if checkbox is triggered, turn off indeterminate state if it is active
                    this.props.onIndeterminateChanged?.(false);
                }
                // block propagation to prevent click from bubbling to container rows
                // Otherwise, this will also trigger the default collection row click.
                // Ex: table will always be in single select mode.
                // event.stopPropagation();
            };
            this.state = {
                focus: false
            };
        }
        render(props, state) {
            const { rowKey, indeterminate } = props;
            const isSelected = this._isSelected(rowKey);
            let spanClass = 'oj-selector-wrapper oj-component-icon';
            if (indeterminate) {
                spanClass += ' oj-indeterminate';
            }
            else if (isSelected) {
                spanClass += ' oj-selected';
            }
            if (state.focus && !DomUtils.recentPointer()) {
                spanClass += ' oj-focus-highlight';
            }
            const ariaLabelledby = props['aria-labelledby'] || null;
            // ariaLabel updated on selection state
            const ariaLabel = props['aria-label'] || null;
            const ariaDescribedby = props['aria-describedby'] || null;
            const ariaChecked = indeterminate ? 'mixed' : isSelected;
            //JET-74142 We need to set 'indeterminate' via javascript
            // as well as have aria-checked for AT voice over to read out properly
            hooks.useEffect(() => {
                const refObj = this.ref;
                if (refObj?.current) {
                    refObj.current.indeterminate = indeterminate;
                }
            }, [this.ref, indeterminate]);
            return (jsxRuntime.jsx(ojvcomponent.Root, { class: "oj-selector", children: jsxRuntime.jsx("span", { class: spanClass, children: jsxRuntime.jsx("input", { ref: this.ref, type: "checkbox", class: "oj-selectorbox", "data-oj-clickthrough": "disabled", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, "aria-describedby": ariaDescribedby, "aria-checked": ariaChecked, checked: isSelected, onfocusin: this._handleFocusin, onfocusout: this._handleFocusout, onClick: this._checkboxListener }) }) }));
        }
        _isSelected(rowKey) {
            const { selectedKeys, selectionMode } = this.props;
            if (!selectedKeys) {
                return false;
            }
            return selectionMode === 'all' ? selectedKeys.isAddAll() : selectedKeys.has(rowKey);
        }
    };
    exports.Selector.defaultProps = {
        rowKey: null,
        indeterminate: false,
        selectedKeys: null,
        selectionMode: 'multiple'
    };
    exports.Selector._metadata = { "properties": { "rowKey": { "type": "any" }, "indeterminate": { "type": "boolean", "writeback": true }, "selectedKeys": { "type": "object", "writeback": true }, "selectionMode": { "type": "string", "enumValues": ["all", "multiple", "single"] } }, "extension": { "_WRITEBACK_PROPS": ["selectedKeys", "indeterminate"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "aria-describedby"] } };
    exports.Selector = __decorate([
        ojvcomponent.customElement('oj-selector')
    ], exports.Selector);

    Object.defineProperty(exports, '__esModule', { value: true });

});
