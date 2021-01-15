/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojtranslation', 'ojs/ojvcomponent-element', 'ojs/ojdomutils'], function (exports, Translations, ojvcomponentElement, DomUtils) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class Props {
        constructor() {
            this.rowKey = null;
            this.indeterminate = false;
            this.selectedKeys = null;
            this.selectionMode = 'multiple';
        }
    }
    exports.Selector = class Selector extends ojvcomponentElement.ElementVComponent {
        constructor(props) {
            super(props);
            this.state = {
                focus: false
            };
        }
        render() {
            const { rowKey, indeterminate } = this.props;
            const isSelected = this._isSelected(rowKey);
            const spanClassName = {
                'oj-selector-wrapper': true,
                'oj-selected': isSelected && !indeterminate,
                'oj-indeterminate': indeterminate,
                'oj-focus-highlight': this.state.focus && !DomUtils.recentPointer(),
                'oj-component-icon': true
            };
            const ariaLabelledby = this.props['aria-labelledby'] || null;
            const ariaLabel = this.props['aria-label'] ||
                Translations.getTranslatedString('oj-ojSelector.checkboxAriaLabel', {
                    rowKey: rowKey
                });
            return (ojvcomponentElement.h("oj-selector", { class: 'oj-selector' },
                ojvcomponentElement.h("span", { class: spanClassName },
                    ojvcomponentElement.h("input", { type: 'checkbox', class: 'oj-selectorbox oj-clickthrough-disabled', "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, checked: isSelected, onFocusin: this._handleFocusin, onFocusout: this._handleFocusout, onClick: this._checkboxListener }))));
        }
        _handleFocusin(event) {
            this.updateState({ focus: true });
        }
        _handleFocusout(event) {
            this.updateState({ focus: false });
        }
        _checkboxListener(event) {
            var _a, _b, _c, _d;
            const { selectedKeys, rowKey, selectionMode } = this.props;
            let newSelectedKeys;
            if (selectedKeys != null) {
                if (event.target.checked) {
                    if (selectionMode === 'single') {
                        if (!selectedKeys.has(rowKey)) {
                            newSelectedKeys = selectedKeys.clear().add([rowKey]);
                        }
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
                (_b = (_a = this.props).onSelectedKeysChanged) === null || _b === void 0 ? void 0 : _b.call(_a, newSelectedKeys);
                (_d = (_c = this.props).onIndeterminateChanged) === null || _d === void 0 ? void 0 : _d.call(_c, false);
            }
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
    exports.Selector.metadata = { "extension": { "_DEFAULTS": Props, "_ROOT_PROPS_MAP": { "aria-label": 1, "aria-labelledby": 1 }, "_WRITEBACK_PROPS": ["selectedKeys", "indeterminate"], "_READ_ONLY_PROPS": [] }, "properties": { "rowKey": { "type": "any", "value": null }, "indeterminate": { "type": "boolean", "value": false, "writeback": true }, "selectedKeys": { "type": "any", "value": null, "writeback": true }, "selectionMode": { "type": "string", "enumValues": ["all", "multiple", "single"], "value": "multiple" } } };
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Selector.prototype, "_handleFocusin", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Selector.prototype, "_handleFocusout", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Selector.prototype, "_checkboxListener", null);
    exports.Selector = __decorate([
        ojvcomponentElement.customElement('oj-selector')
    ], exports.Selector);

    Object.defineProperty(exports, '__esModule', { value: true });

});
