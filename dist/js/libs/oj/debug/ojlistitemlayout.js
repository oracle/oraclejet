/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojvcomponent-element'], function (exports, ojvcomponentElement) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class ListItemLayoutProps {
    }
    exports.ListItemLayout = class ListItemLayout extends ojvcomponentElement.ElementVComponent {
        constructor() {
            super(...arguments);
            this._hasContent = (slotContent) => (Array.isArray(slotContent) && slotContent.length > 0) || slotContent;
        }
        _getWrappedSlotContent(slotContent, wrapperClasses) {
            if (this._hasContent(slotContent)) {
                if (wrapperClasses && wrapperClasses.length > 0)
                    return ojvcomponentElement.h("div", { class: wrapperClasses }, slotContent);
                else
                    return ojvcomponentElement.h("div", null, slotContent);
            }
            return null;
        }
        _getWrappedSlotContentWithClickThroughDisabled(slotContent, wrapperClasses) {
            if (this._hasContent(slotContent)) {
                if (wrapperClasses && wrapperClasses.length > 0)
                    return (ojvcomponentElement.h("div", { "data-oj-clickthrough": 'disabled', class: wrapperClasses }, slotContent));
                else
                    return ojvcomponentElement.h("div", { "data-oj-clickthrough": 'disabled' }, slotContent);
            }
            return null;
        }
        render() {
            const props = this.props;
            const hasExtra = this._hasContent(props.metadata) ||
                this._hasContent(props.action) ||
                this._hasContent(props.trailing);
            let tertiaryClass = '';
            if (this._hasContent(props.secondary) && this._hasContent(props.tertiary))
                tertiaryClass = 'oj-listitemlayout-tertiary';
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
            return (ojvcomponentElement.h("oj-list-item-layout", null,
                ojvcomponentElement.h("div", { class: 'oj-listitemlayout-grid' },
                    this._getWrappedSlotContent(props.selector, 'oj-listitemlayout-selector'),
                    this._getWrappedSlotContent(props.leading, leadingClass),
                    ojvcomponentElement.h("div", { class: textSlotClass },
                        this._getWrappedSlotContent(props.overline),
                        this._getWrappedSlotContent(props.children),
                        this._getWrappedSlotContent(props.secondary),
                        this._getWrappedSlotContent(props.tertiary, tertiaryClass)),
                    hasExtra ? (ojvcomponentElement.h("div", { class: 'oj-listitemlayout-extra' },
                        this._getWrappedSlotContent(props.metadata, 'oj-listitemlayout-metadata oj-listitemlayout-start-padding'),
                        this._getWrappedSlotContent(props.trailing, 'oj-listitemlayout-trailing oj-listitemlayout-image oj-listitemlayout-start-padding'),
                        this._getWrappedSlotContentWithClickThroughDisabled(props.action, 'oj-listitemlayout-action oj-listitemlayout-start-padding'))) : null,
                    this._getWrappedSlotContent(props.quaternary, quaternaryClass),
                    this._getWrappedSlotContentWithClickThroughDisabled(props.navigation, 'oj-listitemlayout-navigation'))));
        }
    };
    exports.ListItemLayout.metadata = { "extension": { "_DEFAULTS": ListItemLayoutProps }, "slots": { "": {}, "overline": {}, "selector": {}, "leading": {}, "secondary": {}, "tertiary": {}, "metadata": {}, "trailing": {}, "action": {}, "quaternary": {}, "navigation": {} } };
    exports.ListItemLayout = __decorate([
        ojvcomponentElement.customElement('oj-list-item-layout')
    ], exports.ListItemLayout);

    Object.defineProperty(exports, '__esModule', { value: true });

});
