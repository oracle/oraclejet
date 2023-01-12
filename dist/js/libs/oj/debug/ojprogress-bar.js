/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'ojs/ojvcomponent', 'preact', 'ojs/ojtranslation'], function (exports, jsxRuntime, ojvcomponent, preact, Translations) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    exports.ProgressBar = class ProgressBar extends preact.Component {
        render(props) {
            return props.value === -1
                ? this._renderIndeterminateBar(props)
                : this._renderDeterminateBar(props);
        }
        _renderDeterminateBar(props) {
            let max = props.max;
            let value = props.value;
            if (max < 0) {
                max = 0;
            }
            if (value < 0) {
                value = 0;
            }
            const percentage = max === 0 ? 0 : value > max ? 1 : value / max;
            return (jsxRuntime.jsx(ojvcomponent.Root, Object.assign({ class: "oj-progress-bar", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(max), "aria-valuenow": String(value) }, { children: jsxRuntime.jsx("div", Object.assign({ class: "oj-progress-bar-track" }, { children: jsxRuntime.jsx("div", { class: "oj-progress-bar-value", style: { width: percentage * 100 + '%' } }) })) })));
        }
        _renderIndeterminateBar(props) {
            return (jsxRuntime.jsx(ojvcomponent.Root, Object.assign({ class: "oj-progress-bar", role: "progressbar", "aria-valuetext": Translations.getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText') }, { children: jsxRuntime.jsx("div", Object.assign({ class: "oj-progress-bar-track" }, { children: jsxRuntime.jsx("div", { class: "oj-progress-bar-value oj-progress-bar-indeterminate" }) })) })));
        }
    };
    exports.ProgressBar.defaultProps = {
        max: 100,
        value: 0
    };
    exports.ProgressBar._metadata = { "properties": { "max": { "type": "number" }, "value": { "type": "number" } } };
    exports.ProgressBar = __decorate([
        ojvcomponent.customElement('oj-progress-bar')
    ], exports.ProgressBar);

    Object.defineProperty(exports, '__esModule', { value: true });

});
