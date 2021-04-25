/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojvcomponent-element', 'ojs/ojdomutils', 'ojs/ojdatacollection-common'], function (exports, ojvcomponentElement, DomUtils, DataCollectionUtils) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class Props {
    }
    exports.ActionCard = class ActionCard extends ojvcomponentElement.ElementVComponent {
        constructor(props) {
            super(props);
            this.state = {
                active: false,
                focus: false
            };
            this._rootElemRef = (element) => {
                this._rootElem = element;
            };
        }
        render() {
            var _a;
            const classNameObj = {
                'oj-actioncard': true,
                'oj-active': this.state.active,
                'oj-focus-highlight': this.state.focus && !DomUtils.recentPointer()
            };
            const tabIndex = (_a = this.props.tabIndex) !== null && _a !== void 0 ? _a : 0;
            return (ojvcomponentElement.h("oj-action-card", { tabIndex: tabIndex, class: classNameObj, role: 'button', onKeyup: this._handleKeyup, onMouseup: this._handleMouseup, onKeydown: this._handleKeydown, onMousedown: this._handleMousedown, onMousemove: this._handleMousemove, onTouchstart: this._handleTouchstart, onTouchend: this._handleTouchend, onTouchcancel: this._handleTouchcancel, onTouchmove: this._handleTouchmove, onFocusin: this._handleFocusin, onFocusout: this._handleFocusout, onOjAction: this._handleOjAction, ref: this._rootElemRef }, this.props.children));
        }
        _isFromActiveSource(event) {
            return DataCollectionUtils.isEventClickthroughDisabled(event, this._rootElem);
        }
        _handleOjAction(event) {
            if (this._isFromActiveSource(event)) {
                event.stopPropagation();
            }
        }
        _handleTouchstart(event) {
            if (!this._isFromActiveSource(event)) {
                this.updateState({ active: true });
            }
        }
        _handleTouchend(event) {
            var _a, _b;
            if (!this._isFromActiveSource(event)) {
                if (this.state.active) {
                    this.updateState({ active: false });
                    (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, { originalEvent: event });
                }
            }
        }
        _handleTouchcancel(event) {
            if (!this._isFromActiveSource(event)) {
                this.updateState({ active: false });
            }
        }
        _handleTouchmove(event) {
            if (this.state.active) {
                if (!this._isFromActiveSource(event)) {
                    this.updateState({ active: false });
                }
            }
        }
        _handleKeydown(event) {
            if (!this._isFromActiveSource(event)) {
                if (!event.repeat && (event.key === 'Enter' || event.key === ' ')) {
                    this.updateState({ active: true });
                }
            }
        }
        _handleKeyup(event) {
            var _a, _b;
            if (!this._isFromActiveSource(event)) {
                if (event.key === 'Enter' || event.key === ' ') {
                    this.updateState({ active: false });
                    (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, { originalEvent: event });
                }
            }
        }
        _handleMousedown(event) {
            if (!this._isFromActiveSource(event)) {
                this.updateState({ active: true });
            }
        }
        _handleMouseup(event) {
            var _a, _b;
            if (!this._isFromActiveSource(event)) {
                if (this.state.active) {
                    this.updateState({ active: false });
                    (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, { originalEvent: event });
                }
            }
        }
        _handleMousemove(event) {
            if (this.state.active) {
                if (!this._isFromActiveSource(event)) {
                    this.updateState({ active: false });
                }
            }
        }
        _handleFocusin(event) {
            this.updateState({ focus: true });
        }
        _handleFocusout(event) {
            this.updateState({ focus: false });
        }
    };
    exports.ActionCard.metadata = { "extension": { "_DEFAULTS": Props, "_ROOT_PROPS_MAP": { "tabIndex": 1, "role": 1 } }, "slots": { "": {} }, "events": { "ojAction": { "bubbles": true } } };
    __decorate([
        ojvcomponentElement.listener({ passive: false })
    ], exports.ActionCard.prototype, "_handleOjAction", null);
    __decorate([
        ojvcomponentElement.listener({ passive: true })
    ], exports.ActionCard.prototype, "_handleTouchstart", null);
    __decorate([
        ojvcomponentElement.listener({ passive: false })
    ], exports.ActionCard.prototype, "_handleTouchend", null);
    __decorate([
        ojvcomponentElement.listener({ passive: true })
    ], exports.ActionCard.prototype, "_handleTouchcancel", null);
    __decorate([
        ojvcomponentElement.listener({ passive: true })
    ], exports.ActionCard.prototype, "_handleTouchmove", null);
    __decorate([
        ojvcomponentElement.listener({ passive: true })
    ], exports.ActionCard.prototype, "_handleKeydown", null);
    __decorate([
        ojvcomponentElement.listener({ passive: false })
    ], exports.ActionCard.prototype, "_handleKeyup", null);
    __decorate([
        ojvcomponentElement.listener({ passive: true })
    ], exports.ActionCard.prototype, "_handleMousedown", null);
    __decorate([
        ojvcomponentElement.listener({ passive: false })
    ], exports.ActionCard.prototype, "_handleMouseup", null);
    __decorate([
        ojvcomponentElement.listener({ passive: true })
    ], exports.ActionCard.prototype, "_handleMousemove", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.ActionCard.prototype, "_handleFocusin", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.ActionCard.prototype, "_handleFocusout", null);
    exports.ActionCard = __decorate([
        ojvcomponentElement.customElement('oj-action-card')
    ], exports.ActionCard);

    Object.defineProperty(exports, '__esModule', { value: true });

});
