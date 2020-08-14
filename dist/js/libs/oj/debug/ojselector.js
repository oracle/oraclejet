define(['exports', 'ojs/ojtranslation', 'ojs/ojvcomponent'], function (exports, Translations, ojvcomponent) { 'use strict';

    /**
     * @license
     * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
    /**
     * @ojcomponent oj.ojSelector
     * @ojtsvcomponent
     * @ojsignature [{
     *                target: "Type",
     *                value: "class ojSelector<K> extends JetElement<ojSelectorSettableProperties<K>>",
     *                genericParameters: [{"name": "K", "description": "Type of key"}]
     *               },
     *               {
     *                target: "Type",
     *                value: "ojSelectorSettableProperties<K> extends JetSettableProperties",
     *                genericParameters: [{"name": "K", "description": "Type of key"}],
     *                for: "SettableProperties"
     *               }
     *              ]
     * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet", "ExpandedKeySet", "ExpandAllKeySet", 'AllKeySetImpl']}
     * @since 9.0.0
     *
     * @ojshortdesc The selector component renders checkboxes in collections to support selection.
     *
     * @classdesc
     * <h3 id="selectorOverview-section">
     *   JET Selector
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectorOverview-section"></a>
     * </h3>
     * <p>Description: A checkbox to support selection in Collection Components</p>
     * <p>The oj-selector is a component that may be placed within a template for Table, ListView.
     * It presents as a checkbox when the Collection Component is configured for multi-selection.</p>
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
     *                        rowKey='[[item.key]]'>
     *          &lt;/oj-selector>
     *        &lt;/div>
     *        &lt;div class="oj-flex-item">
     *          &lt;span data-bind="text: 'Name '+ item.data.name">&lt;/span>
     *        &lt;/div>
     *      &lt;/div>
     *    &lt;/li>
     *  &lt;/template>
     *&lt;/oj-list-view>
     *</code></pre>
     */
    /**
     * Specifies the selectedKeys, should be hooked into the collection component.
     * @expose
     * @ojrequired
     * @name selectedKeys
     * @memberof oj.ojSelector
     * @instance
     * @type {KeySet<K>|null}
     * @default null
     * @ojwriteback
     */
    /**
     * Specifies the row key of each selector. If the selectionMode property is 'all', rowKey is ignored.
     * @expose
     * @name rowKey
     * @memberof oj.ojSelector
     * @instance
     * @type {any}
     * @default null
     * @ojsignature [{target: "Type", value: "K|null", jsdocOverride:true}]
     */
    /**
     * Specifies the selection mode ('single', 'multiple', 'all'). 'all' should only be used for the select all case and will ignore the key property.
     * <code>
     * &lt;oj-selector selected-keys='{{selectedItems}}'
     *          selection-mode='all'>
     * &lt;/oj-selector>
     * </code>
     * @expose
     * @name selectionMode
     * @memberof oj.ojSelector
     * @ojshortdesc Specifies the selection mode.
     * @instance
     * @type {string}
     * @default 'multiple'
     * @ojvalue {string} "single" Only a single item can be selected at a time.
     * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
     * @ojvalue {string} "all" Specifies the select all case (rowKey property is ignored).
     */

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class Props {
        constructor() {
            this.rowKey = null;
            this.selectedKeys = null;
            this.selectionMode = 'multiple';
        }
    }
    exports.Selector = class Selector extends ojvcomponent.VComponent {
        render() {
            const { rowKey } = this.props;
            const isSelected = this._isSelected(rowKey);
            const spanClassName = {
                'oj-selector-wrapper': true,
                'oj-selected': isSelected,
                'oj-component-icon': true
            };
            const ariaLabelledby = this.props['aria-labelledby'] || null;
            const ariaLabel = this.props['aria-label'] ||
                Translations.getTranslatedString('oj-ojSelector.checkboxAriaLabel', {
                    rowKey: rowKey
                });
            return (ojvcomponent.h("oj-selector", { class: 'oj-selector' },
                ojvcomponent.h("span", { class: spanClassName },
                    ojvcomponent.h("input", { type: 'checkbox', class: 'oj-selectorbox oj-clickthrough-disabled', "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, checked: isSelected, onClick: this._checkboxListener }))));
        }
        _checkboxListener(event) {
            const { selectedKeys, rowKey, selectionMode } = this.props;
            let newSelectedKeys;
            if (event.target.checked) {
                if (selectionMode === 'single') {
                    newSelectedKeys = selectedKeys.clear().add([rowKey]);
                }
                else if (selectionMode === 'all') {
                    newSelectedKeys = selectedKeys.addAll();
                }
                else {
                    newSelectedKeys = selectedKeys.add([rowKey]);
                }
            }
            else {
                if (selectionMode === 'all') {
                    newSelectedKeys = selectedKeys.clear();
                }
                else {
                    newSelectedKeys = selectedKeys.delete([rowKey]);
                }
            }
            this._updateProperty('selectedKeys', newSelectedKeys, true);
            event.stopPropagation();
        }
        _isSelected(rowKey) {
            const { selectedKeys, selectionMode } = this.props;
            if (!selectedKeys) {
                return false;
            }
            return selectionMode === 'all' ? selectedKeys.isAddAll() : selectedKeys.has(rowKey);
        }
    };
    exports.Selector.metadata = { "extension": { "_DEFAULTS": Props, "_ROOT_PROPS_MAP": { "aria-label": true, "aria-labelledby": true } }, "properties": { "rowKey": { "type": "any", "value": null }, "selectedKeys": { "type": "object|null", "value": null, "writeback": true, "readOnly": false }, "selectionMode": { "type": "string", "enumValues": ["all", "multiple", "single"], "value": "multiple" } } };
    __decorate([
        ojvcomponent.listener()
    ], exports.Selector.prototype, "_checkboxListener", null);
    exports.Selector = __decorate([
        ojvcomponent.customElement('oj-selector')
    ], exports.Selector);

    Object.defineProperty(exports, '__esModule', { value: true });

});
