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
        }
    }
    exports.ProgressBar = class ProgressBar extends ojvcomponentElement.ElementVComponent {
        render() {
            return this.props.value == -1 ? this._renderIndeterminateBar() : this._renderDeterminateBar();
        }
        _renderDeterminateBar() {
            const props = this.props;
            let max = props.max;
            let value = props.value;
            if (max < 0) {
                max = 0;
            }
            if (value < 0) {
                value = 0;
            }
            const percentage = max == 0 ? 0 : value > max ? 1 : value / max;
            return (ojvcomponentElement.h("oj-progress-bar", { class: 'oj-progress-bar', role: 'progressbar', "aria-valuemin": '0', "aria-valuemax": max, "aria-valuenow": value },
                ojvcomponentElement.h("div", { class: 'oj-progress-bar-track' },
                    ojvcomponentElement.h("div", { class: 'oj-progress-bar-value', style: { width: percentage * 100 + '%' } }))));
        }
        _renderIndeterminateBar() {
            return (ojvcomponentElement.h("oj-progress-bar", { class: 'oj-progress-bar', role: 'progressbar', "aria-valuetext": Translations.getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText') },
                ojvcomponentElement.h("div", { class: 'oj-progress-bar-track' },
                    ojvcomponentElement.h("div", { class: 'oj-progress-bar-value oj-progress-bar-indeterminate' }))));
        }
    };
    exports.ProgressBar.metadata = { "extension": { "_DEFAULTS": Props, "_ROOT_PROPS_MAP": { "aria-valuemin": 1, "aria-valuemax": 1, "aria-valuetext": 1, "aria-valuenow": 1, "role": 1 } }, "properties": { "max": { "type": "number", "value": 100 }, "value": { "type": "number", "value": 0 } } };
    exports.ProgressBar = __decorate([
        ojvcomponentElement.customElement('oj-progress-bar')
    ], exports.ProgressBar);

    Object.defineProperty(exports, '__esModule', { value: true });

});
