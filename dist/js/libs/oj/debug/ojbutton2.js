/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdomutils', 'ojs/ojgestureutils', 'ojs/ojvcomponent-element', 'ojs/ojvmenu', 'ojs/ojvcomponent-binding', 'ojs/ojthemeutils'], function (exports, DomUtils, GestureUtils, ojvcomponentElement, ojvmenu, ojvcomponentBinding, ThemeUtils) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var Button2_1;
    class Props {
        constructor() {
            this.disabled = false;
            this.display = 'all';
            this.translations = {};
        }
    }
    __decorate([
        ojvcomponentElement.dynamicDefault(getChromingDefault)
    ], Props.prototype, "chroming", void 0);
    function getChromingDefault() {
        return ((ThemeUtils.parseJSONFromFontFamily('oj-button-option-defaults') || {}).chroming || 'solid');
    }
    exports.Button2 = Button2_1 = class Button2 extends ojvcomponentElement.ElementVComponent {
        constructor(props) {
            super(props);
            this._handleContextMenuGesture = (event, eventType) => {
                const contextMenuEvent = {
                    event: event,
                    eventType: eventType
                };
                event.preventDefault();
                this.updateState({ contextMenuTriggerEvent: contextMenuEvent });
            };
            this._onCloseCallback = (event) => {
                if (this.state.contextMenuTriggerEvent) {
                    this.updateState({ contextMenuTriggerEvent: null });
                }
            };
            this.state = {};
        }
        render() {
            const props = this.props;
            const defaultSlot = props.children;
            const startIconContent = this._processIcon(props.startIcon, 'oj-button-icon oj-start');
            const endIconContent = this._processIcon(props.endIcon, 'oj-button-icon oj-end');
            let ariaLabel = this.props['aria-label'];
            let ariaLabelledBy = this.props['aria-labelledby'];
            const hasDefaultAriaAttribute = ariaLabel || ariaLabelledBy;
            let title = props.title;
            let defaultContent = null;
            let clickHandler = null;
            let ariaLabelledById = null;
            const buttonLabel = props.label || defaultSlot;
            if (buttonLabel) {
                title = title || props.label || this.state.derivedTitle;
                if (props.display === 'icons' && (startIconContent || endIconContent)) {
                    if (props.label) {
                        if (!hasDefaultAriaAttribute) {
                            ariaLabel = props.label;
                        }
                    }
                    else {
                        if (!hasDefaultAriaAttribute) {
                            ariaLabelledById = this.uniqueId() + '|text';
                            ariaLabelledBy = ariaLabelledById;
                        }
                        defaultContent = (ojvcomponentElement.h("span", { class: 'oj-button-text oj-helper-hidden-accessible', id: ariaLabelledById }, buttonLabel));
                    }
                }
                else {
                    if (!hasDefaultAriaAttribute) {
                        ariaLabelledById = this.uniqueId() + '|text';
                        ariaLabelledBy = ariaLabelledById;
                    }
                    defaultContent = (ojvcomponentElement.h("span", { class: 'oj-button-text', id: ariaLabelledById }, buttonLabel));
                }
            }
            defaultContent = (ojvcomponentElement.h("span", { ref: (elem) => (this._defaultSlotRef = elem) }, defaultContent));
            const labelContent = (ojvcomponentElement.h("div", { class: 'oj-button-label' },
                startIconContent,
                defaultContent,
                endIconContent));
            let buttonContent;
            if (props.disabled) {
                buttonContent = (ojvcomponentElement.h("button", { class: 'oj-button-button', "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, disabled: true }, labelContent));
            }
            else {
                clickHandler = this._handleClick;
                buttonContent = (ojvcomponentElement.h("button", { class: 'oj-button-button', ref: (elem) => (this._buttonRef = elem), "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, onTouchstart: this._handleTouchstart, onTouchend: this._handleTouchend, onTouchcancel: this._handleTouchend, onMouseenter: this._handleMouseenter, onMouseleave: this._handleMouseleave, onMousedown: this._handleMousedown, onMouseup: this._handleMouseup, onKeydown: this._handleKeydown, onKeyup: this._handleKeyup, onFocusin: this._handleFocusin, onFocusout: this._handleFocusout, onFocus: this._handleFocus, onBlur: this._handleBlur }, labelContent));
            }
            const rootClasses = this._getRootClasses(startIconContent, endIconContent);
            return (ojvcomponentElement.h("oj-button", { class: rootClasses, title: title, onClick: clickHandler, ref: (elem) => (this._rootRef = elem) },
                buttonContent,
                this._renderContextMenu()));
        }
        _renderContextMenu() {
            if (!this.state.contextMenuTriggerEvent || !this.props.contextMenu) {
                return null;
            }
            return (ojvcomponentElement.h(ojvmenu.VMenu, { eventObj: this.state.contextMenuTriggerEvent, launcherElement: this._buttonRef, onCloseCallback: this._onCloseCallback }, [this.props.contextMenu]));
        }
        _processIcon(icon, slotClass) {
            let iconContent;
            if (Array.isArray(icon)) {
                iconContent = icon.map((elem) => {
                    return this._processIcon(elem, slotClass);
                });
            }
            else if (icon) {
                iconContent = ojvcomponentElement.h("span", { class: slotClass }, icon);
            }
            return iconContent;
        }
        _getRootClasses(startIconContent, endIconContent) {
            let defaultState = true;
            let classList = 'oj-button ' + Button2_1._chromingMap[this.props.chroming];
            classList += ' ' + this._getDisplayOptionClass(startIconContent, endIconContent);
            if (this.props.disabled) {
                defaultState = false;
                classList += ' oj-disabled';
            }
            else {
                classList += ' oj-enabled';
                if (this.state.hover) {
                    defaultState = false;
                    classList += ' oj-hover';
                }
                if (this.state.active) {
                    defaultState = false;
                    classList += ' oj-active';
                }
                if (this.state.focus) {
                    if (defaultState) {
                        classList += ' oj-focus-only';
                    }
                    defaultState = false;
                    classList += ' oj-focus';
                    if (!DomUtils.recentPointer()) {
                        classList += ' oj-focus-highlight';
                    }
                }
            }
            if (defaultState) {
                classList += ' oj-default';
            }
            return classList;
        }
        _getDisplayOptionClass(startIconContent, endIconContent) {
            const multipleIcons = startIconContent && endIconContent;
            const atLeastOneIcon = startIconContent || endIconContent;
            const displayIsIcons = this.props.display === 'icons';
            let buttonClass;
            if (atLeastOneIcon) {
                if (displayIsIcons) {
                    if (multipleIcons) {
                        buttonClass = 'oj-button-icons-only';
                    }
                    else {
                        buttonClass = 'oj-button-icon-only';
                    }
                }
                else if (multipleIcons) {
                    buttonClass = 'oj-button-text-icons';
                }
                else if (startIconContent) {
                    buttonClass = 'oj-button-text-icon-start';
                }
                else {
                    buttonClass = 'oj-button-text-icon-end';
                }
            }
            else {
                buttonClass = 'oj-button-text-only';
            }
            return buttonClass;
        }
        _addMutationObserver() {
            if (this._mutationObserver) {
                return;
            }
            const config = {
                subtree: true,
                characterData: true
            };
            const callback = () => {
                const title = this._getTextContent();
                if (title != this.state.derivedTitle) {
                    this.updateState({ derivedTitle: title });
                }
            };
            this._mutationObserver = new MutationObserver(callback);
            this._mutationObserver.observe(this._defaultSlotRef, config);
        }
        _needsContextMenuDetection(props) {
            return props.contextMenu && !props.disabled;
        }
        mounted() {
            this._updateDerivedTitle();
            if (this._needsContextMenuDetection(this.props)) {
                GestureUtils.startDetectContextMenuGesture(this._rootRef, this._handleContextMenuGesture);
            }
        }
        updated(oldProps) {
            this._updateDerivedTitle();
            this._updateContextMenuDetection(oldProps);
        }
        _updateDerivedTitle() {
            const props = this.props;
            let title;
            if (props.display === 'icons' &&
                (props.startIcon || props.endIcon) &&
                !props.label &&
                !props.title) {
                title = this._getTextContent();
                this._addMutationObserver();
            }
            if (title != this.state.derivedTitle) {
                this.updateState({ derivedTitle: title });
            }
        }
        _updateContextMenuDetection(oldProps) {
            const oldNeedsDetect = this._needsContextMenuDetection(oldProps);
            const newNeedsDetect = this._needsContextMenuDetection(this.props);
            if (oldNeedsDetect != newNeedsDetect) {
                if (newNeedsDetect) {
                    GestureUtils.startDetectContextMenuGesture(this._rootRef, this._handleContextMenuGesture);
                }
                else {
                    GestureUtils.stopDetectContextMenuGesture(this._rootRef);
                }
            }
        }
        static updateStateFromProps(props) {
            if (props.disabled) {
                return { contextMenuTriggerEvent: null };
            }
            return null;
        }
        _getTextContent() {
            let content = this._defaultSlotRef.textContent;
            content = content.trim();
            if (content !== '') {
                return content;
            }
            return null;
        }
        unmounted() {
            if (this._mutationObserver) {
                this._mutationObserver.disconnect();
                this._mutationObserver = null;
            }
            GestureUtils.stopDetectContextMenuGesture(this._rootRef);
        }
        _handleTouchstart(event) {
            this.updateState({ active: true });
        }
        _handleTouchend(event) {
            this.updateState({ active: false });
        }
        _handleMouseenter(event) {
            if (!DomUtils.recentTouchEnd()) {
                if (this === Button2_1._lastActive) {
                    this.updateState({ active: true });
                }
                this.updateState({ hover: true });
            }
        }
        _handleMouseleave(event) {
            this.updateState({ hover: false, active: false });
        }
        _handleMousedown(event) {
            if (event.which === 1 && !DomUtils.recentTouchEnd()) {
                this.updateState({ active: true });
                Button2_1._lastActive = this;
                const docMouseupListener = () => {
                    Button2_1._lastActive = null;
                    document.removeEventListener('mouseup', docMouseupListener, true);
                };
                document.addEventListener('mouseup', docMouseupListener, true);
            }
        }
        _handleMouseup(event) {
            this.updateState({ active: false });
        }
        _handleClick(event) {
            var _a, _b;
            if (event.detail <= 1) {
                (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, { originalEvent: event });
            }
        }
        _handleKeydown(event) {
            if (event.keyCode === 32 || event.keyCode === 13) {
                this.updateState({ active: true });
            }
        }
        _handleKeyup(event) {
            this.updateState({ active: false });
        }
        _handleFocusin(event) {
            this.updateState({ focus: true });
        }
        _handleFocusout(event) {
            this.updateState({ focus: false });
        }
        _handleFocus(event) {
            var _a;
            (_a = this._rootRef) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new FocusEvent('focus', { relatedTarget: event.relatedTarget }));
        }
        _handleBlur(event) {
            var _a;
            this.updateState({ active: false });
            (_a = this._rootRef) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new FocusEvent('blur', { relatedTarget: event.relatedTarget }));
        }
        refresh() {
            this.render();
        }
        focus() {
            var _a;
            (_a = this._buttonRef) === null || _a === void 0 ? void 0 : _a.focus();
        }
        blur() {
            var _a;
            (_a = this._buttonRef) === null || _a === void 0 ? void 0 : _a.blur();
        }
    };
    exports.Button2._chromingMap = {
        solid: 'oj-button-full-chrome',
        outlined: 'oj-button-outlined-chrome',
        borderless: 'oj-button-half-chrome',
        full: 'oj-button-full-chrome',
        half: 'oj-button-half-chrome',
        callToAction: 'oj-button-cta-chrome'
    };
    exports.Button2.metadata = { "extension": { "_DEFAULTS": Props, "_ROOT_PROPS_MAP": { "title": 1, "aria-label": 1, "aria-labelledby": 1 } }, "slots": { "": {}, "startIcon": {}, "endIcon": {}, "contextMenu": {} }, "properties": { "disabled": { "type": "boolean", "value": false }, "display": { "type": "string", "enumValues": ["all", "icons"], "value": "all" }, "label": { "type": "string" }, "translations": { "type": "object|null", "value": {} }, "chroming": { "type": "string", "enumValues": ["borderless", "callToAction", "full", "half", "outlined", "solid"], "binding": { "consume": { "name": "containerChroming" } } } }, "events": { "ojAction": { "bubbles": true } }, "methods": { "refresh": {}, "focus": {}, "blur": {} } };
    __decorate([
        ojvcomponentElement.listener({ passive: true })
    ], exports.Button2.prototype, "_handleTouchstart", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleTouchend", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleMouseenter", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleMouseleave", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleMousedown", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleMouseup", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleClick", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleKeydown", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleKeyup", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleFocusin", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleFocusout", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleFocus", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.Button2.prototype, "_handleBlur", null);
    exports.Button2 = Button2_1 = __decorate([
        ojvcomponentElement.customElement('oj-button')
    ], exports.Button2);

    Object.defineProperty(exports, '__esModule', { value: true });

});
