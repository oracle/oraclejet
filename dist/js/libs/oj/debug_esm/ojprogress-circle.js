/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { Root, customElement } from 'ojs/ojvcomponent';
import { Component } from 'preact';
import { getTranslatedString } from 'ojs/ojtranslation';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let ProgressCircle = class ProgressCircle extends Component {
    render(props) {
        return props.value === -1
            ? this._renderIndeterminateCircle(props)
            : this._renderDeterminateCircle(props);
    }
    _renderIndeterminateCircle(props) {
        return (jsx(Root, Object.assign({ class: 'oj-progress-circle oj-progress-circle-' + props.size, role: "progressbar", "aria-valuetext": getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText') }, { children: jsx("div", Object.assign({ class: "oj-progress-circle-indeterminate" }, { children: jsx("div", { class: "oj-progress-circle-indeterminate-inner" }) })) })));
    }
    _renderDeterminateCircle(props) {
        let max = props.max;
        let value = props.value;
        if (max < 0) {
            max = 0;
        }
        if (value < 0 && value !== -1) {
            value = 0;
        }
        const percentage = max === 0 ? 0 : value > max ? 1 : value / max;
        const clipPath = this._getClipPath(percentage);
        return (jsxs(Root, Object.assign({ class: 'oj-progress-circle oj-progress-circle-' + props.size, role: "progressbar", "aria-valuemin": "0", "aria-valuemax": max, "aria-valuenow": value }, { children: [jsx("div", { class: "oj-progress-circle-tracker" }), jsx("div", { class: "oj-progress-circle-value", style: { clipPath } })] })));
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
ProgressCircle.defaultProps = {
    max: 100,
    value: 0,
    size: 'md'
};
ProgressCircle._metadata = { "properties": { "max": { "type": "number" }, "value": { "type": "number" }, "size": { "type": "string", "enumValues": ["lg", "md", "sm"] } } };
ProgressCircle = __decorate([
    customElement('oj-progress-circle')
], ProgressCircle);

export { ProgressCircle };
