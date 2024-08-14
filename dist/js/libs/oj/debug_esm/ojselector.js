/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component } from 'preact';
import { recentPointer } from 'ojs/ojdomutils';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let Selector = class Selector extends Component {
    constructor(props) {
        super(props);
        this._handleFocusin = (event) => {
            this.setState({ focus: true });
        };
        this._handleFocusout = (event) => {
            this.setState({ focus: false });
        };
        this._checkboxListener = (event) => {
            const { selectedKeys, rowKey, selectionMode, indeterminate } = this.props;
            let newSelectedKeys;
            if (selectedKeys != null) {
                if (event.target.checked) {
                    if (selectionMode === 'multiple') {
                        newSelectedKeys = selectedKeys.add([rowKey]);
                    }
                    else if (selectionMode === 'all') {
                        newSelectedKeys = selectedKeys.addAll();
                    }
                    else if (selectionMode === 'single' && !selectedKeys.has(rowKey)) {
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
                this.props.onIndeterminateChanged?.(false);
            }
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
        if (state.focus && !recentPointer()) {
            spanClass += ' oj-focus-highlight';
        }
        const ariaLabelledby = props['aria-labelledby'] || null;
        const ariaLabel = props['aria-label'] || null;
        return (jsx(Root, { class: "oj-selector", children: jsx("span", { class: spanClass, children: jsx("input", { type: "checkbox", class: "oj-selectorbox", "data-oj-clickthrough": "disabled", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, checked: isSelected, onfocusin: this._handleFocusin, onfocusout: this._handleFocusout, onClick: this._checkboxListener }) }) }));
    }
    _isSelected(rowKey) {
        const { selectedKeys, selectionMode } = this.props;
        if (!selectedKeys) {
            return false;
        }
        return selectionMode === 'all' ? selectedKeys.isAddAll() : selectedKeys.has(rowKey);
    }
};
Selector.defaultProps = {
    rowKey: null,
    indeterminate: false,
    selectedKeys: null,
    selectionMode: 'multiple'
};
Selector._metadata = { "properties": { "rowKey": { "type": "any" }, "indeterminate": { "type": "boolean", "writeback": true }, "selectedKeys": { "type": "object", "writeback": true }, "selectionMode": { "type": "string", "enumValues": ["all", "multiple", "single"] } }, "extension": { "_WRITEBACK_PROPS": ["selectedKeys", "indeterminate"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby"] } };
Selector = __decorate([
    customElement('oj-selector')
], Selector);

export { Selector };
