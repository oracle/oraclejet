/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact', 'ojs/ojvcomponent'], function (exports, jsxRuntime, preact, ojvcomponent) { 'use strict';

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    exports.HighlightText = class HighlightText extends preact.Component {
        constructor() {
            super(...arguments);
            this._HIGHLIGHT_TOKEN = '__@@__';
        }
        render(props) {
            const content = this._highlighter(props.text, props.matchText);
            return jsxRuntime.jsx(ojvcomponent.Root, Object.assign({ class: "oj-highlighttext" }, { children: content }));
        }
        _highlighter(unhighlightedText, matchText) {
            if (matchText) {
                const escapedMatchText = this._escapeRegExp(matchText);
                const highlightedText = unhighlightedText.replace(new RegExp(escapedMatchText, 'gi'), this._HIGHLIGHT_TOKEN + '$&' + this._HIGHLIGHT_TOKEN);
                const tokens = highlightedText.split(this._HIGHLIGHT_TOKEN);
                const nodes = tokens.map((current, index) => index % 2 == 0 ? current : jsxRuntime.jsx("span", Object.assign({ class: "oj-highlighttext-highlighter" }, { children: current })));
                return jsxRuntime.jsx("span", { children: nodes });
            }
            return jsxRuntime.jsx("span", { children: unhighlightedText });
        }
        _escapeRegExp(str) {
            return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
        }
    };
    exports.HighlightText.defaultProps = {
        text: '',
        matchText: ''
    };
    exports.HighlightText._metadata = { "properties": { "text": { "type": "string" }, "matchText": { "type": "string" } } };
    exports.HighlightText = __decorate([
        ojvcomponent.customElement('oj-highlight-text')
    ], exports.HighlightText);

    Object.defineProperty(exports, '__esModule', { value: true });

});
