/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojvcomponent', 'preact'], function (exports, jsxRuntime, ojvcomponent, preact) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class ListItemLayoutProps {
    }
    exports.ListItemLayout = class ListItemLayout extends preact.Component {
        constructor() {
            super(...arguments);
            this._hasContent = (slotContent) => (Array.isArray(slotContent) && slotContent.length > 0) || slotContent;
        }
        _getWrappedSlotContent(slotContent, wrapperClasses, isAdditionalTabIndexNeeded) {
            if (this._hasContent(slotContent)) {
                let defaultTabIndex = 0;
                if (wrapperClasses && wrapperClasses.length > 0 && isAdditionalTabIndexNeeded) {
                    return (jsxRuntime.jsx("div", Object.assign({ class: wrapperClasses, tabIndex: defaultTabIndex }, { children: slotContent })));
                }
                else if (wrapperClasses && wrapperClasses.length > 0) {
                    return jsxRuntime.jsx("div", Object.assign({ class: wrapperClasses }, { children: slotContent }));
                }
                else if (isAdditionalTabIndexNeeded) {
                    return jsxRuntime.jsx("div", Object.assign({ tabIndex: defaultTabIndex }, { children: slotContent }));
                }
                else {
                    return jsxRuntime.jsx("div", { children: slotContent });
                }
            }
            return null;
        }
        _getWrappedSlotContentWithClickThroughDisabled(slotContent, wrapperClasses, isAdditionalTabIndexNeeded) {
            if (this._hasContent(slotContent)) {
                let defaultTabIndex = 0;
                if (wrapperClasses && wrapperClasses.length > 0 && isAdditionalTabIndexNeeded) {
                    return (jsxRuntime.jsx("div", Object.assign({ "data-oj-clickthrough": "disabled", class: wrapperClasses, tabIndex: defaultTabIndex }, { children: slotContent })));
                }
                else if (wrapperClasses && wrapperClasses.length > 0) {
                    return (jsxRuntime.jsx("div", Object.assign({ "data-oj-clickthrough": "disabled", class: wrapperClasses }, { children: slotContent })));
                }
                else if (isAdditionalTabIndexNeeded) {
                    return (jsxRuntime.jsx("div", Object.assign({ "data-oj-clickthrough": "disabled", tabIndex: defaultTabIndex }, { children: slotContent })));
                }
                else {
                    return jsxRuntime.jsx("div", Object.assign({ "data-oj-clickthrough": "disabled" }, { children: slotContent }));
                }
            }
            return null;
        }
        render(props) {
            const hasExtra = this._hasContent(props.metadata) ||
                this._hasContent(props.action) ||
                this._hasContent(props.trailing);
            let tertiaryClass = '';
            if (this._hasContent(props.secondary) && this._hasContent(props.tertiary)) {
                tertiaryClass = 'oj-listitemlayout-tertiary';
            }
            let leadingClass = 'oj-listitemlayout-leading';
            if (this._hasContent(props.selector) && this._hasContent(props.leading)) {
                leadingClass = leadingClass + ' oj-listitemlayout-start-padding';
            }
            let quaternaryClass = 'oj-listitemlayout-quaternary';
            let textSlotClass = 'oj-listitemlayout-textslots';
            if (this._hasContent(props.selector) || this._hasContent(props.leading)) {
                textSlotClass = textSlotClass + ' oj-listitemlayout-start-padding';
                quaternaryClass = quaternaryClass + ' oj-listitemlayout-start-padding';
            }
            return (jsxRuntime.jsxs("div", Object.assign({ class: "oj-listitemlayout-grid" }, { children: [this._getWrappedSlotContent(props.selector, 'oj-listitemlayout-selector', false), this._getWrappedSlotContent(props.leading, leadingClass, true), jsxRuntime.jsxs("div", Object.assign({ class: textSlotClass }, { children: [this._getWrappedSlotContent(props.overline, null, true), this._getWrappedSlotContent(props.children, null, true), this._getWrappedSlotContent(props.secondary, null, true), this._getWrappedSlotContent(props.tertiary, tertiaryClass, true)] })), hasExtra ? (jsxRuntime.jsxs("div", Object.assign({ class: "oj-listitemlayout-extra" }, { children: [this._getWrappedSlotContent(props.metadata, 'oj-listitemlayout-metadata oj-listitemlayout-start-padding', true), this._getWrappedSlotContent(props.trailing, 'oj-listitemlayout-trailing oj-listitemlayout-image oj-listitemlayout-start-padding', true), this._getWrappedSlotContentWithClickThroughDisabled(props.action, 'oj-listitemlayout-action oj-listitemlayout-start-padding', false)] }))) : null, this._getWrappedSlotContent(props.quaternary, quaternaryClass, true), this._getWrappedSlotContentWithClickThroughDisabled(props.navigation, 'oj-listitemlayout-navigation', false)] })));
        }
    };
    exports.ListItemLayout._metadata = { "slots": { "": {}, "overline": {}, "selector": {}, "leading": {}, "secondary": {}, "tertiary": {}, "metadata": {}, "trailing": {}, "action": {}, "quaternary": {}, "navigation": {} } };
    exports.ListItemLayout = __decorate([
        ojvcomponent.customElement('oj-list-item-layout')
    ], exports.ListItemLayout);

    Object.defineProperty(exports, '__esModule', { value: true });

});
