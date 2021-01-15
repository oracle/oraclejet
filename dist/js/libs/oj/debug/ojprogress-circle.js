/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojvcomponent-element', 'ojs/ojtranslation'], function (exports, ojvcomponentElement, Translations) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class Props {
        constructor() {
            this.max = 100;
            this.value = 0;
            this.size = 'md';
        }
    }
    exports.ProgressCircle = class ProgressCircle extends ojvcomponentElement.ElementVComponent {
        render() {
            return this.props.value == -1
                ? this._renderIndeterminateCircle()
                : this._renderDeterminateCircle();
        }
        _renderIndeterminateCircle() {
            return (ojvcomponentElement.h("oj-progress-circle", { class: 'oj-progress-circle oj-progress-circle-' + this.props.size, role: 'progressbar', "aria-valuetext": Translations.getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText') },
                ojvcomponentElement.h("div", { class: 'oj-progress-circle-indeterminate' },
                    ojvcomponentElement.h("div", { class: 'oj-progress-circle-indeterminate-inner' }))));
        }
        _renderDeterminateCircle() {
            const props = this.props;
            let max = props.max;
            let value = props.value;
            if (max < 0) {
                max = 0;
            }
            if (value < 0 && value !== -1) {
                value = 0;
            }
            const percentage = max == 0 ? 0 : value > max ? 1 : value / max;
            const clipPath = this._getClipPath(percentage);
            return (ojvcomponentElement.h("oj-progress-circle", { class: 'oj-progress-circle oj-progress-circle-' + props.size, role: 'progressbar', "aria-valuemin": '0', "aria-valuemax": max, "aria-valuenow": value },
                ojvcomponentElement.h("div", { class: 'oj-progress-circle-tracker' }),
                ojvcomponentElement.h("div", { class: 'oj-progress-circle-value', style: { clipPath: clipPath } })));
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
    exports.ProgressCircle.metadata = { "extension": { "_DEFAULTS": Props, "_ROOT_PROPS_MAP": { "aria-valuemin": 1, "aria-valuemax": 1, "aria-valuetext": 1, "aria-valuenow": 1, "role": 1 } }, "properties": { "max": { "type": "number", "value": 100 }, "value": { "type": "number", "value": 0 }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"], "value": "md" } } };
    exports.ProgressCircle = __decorate([
        ojvcomponentElement.customElement('oj-progress-circle')
    ], exports.ProgressCircle);

    Object.defineProperty(exports, '__esModule', { value: true });

});
