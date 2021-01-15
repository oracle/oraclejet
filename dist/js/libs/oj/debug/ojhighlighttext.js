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
    class Props {
        constructor() {
            this.text = '';
            this.matchText = '';
        }
    }
    exports.HighlightText = class HighlightText extends ojvcomponentElement.ElementVComponent {
        constructor(props) {
            super(props);
            this._HIGHLIGHT_TOKEN = '__@@__';
        }
        render() {
            const props = this.props;
            const content = this._highlighter(props.text, props.matchText);
            return ojvcomponentElement.h("oj-highlight-text", { class: 'oj-highlighttext' }, content);
        }
        _highlighter(unhighlightedText, matchText) {
            if (matchText) {
                const escapedMatchText = this._escapeRegExp(matchText);
                const highlightedText = unhighlightedText.replace(new RegExp(escapedMatchText, 'gi'), this._HIGHLIGHT_TOKEN + '$&' + this._HIGHLIGHT_TOKEN);
                const tokens = highlightedText.split(this._HIGHLIGHT_TOKEN);
                const nodes = tokens.map((current, index) => index % 2 == 0 ? current : ojvcomponentElement.h("span", { class: 'oj-highlighttext-highlighter' }, current));
                return ojvcomponentElement.h("span", null, nodes);
            }
            return ojvcomponentElement.h("span", null, unhighlightedText);
        }
        _escapeRegExp(str) {
            return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
        }
    };
    exports.HighlightText.metadata = { "extension": { "_DEFAULTS": Props }, "properties": { "text": { "type": "string", "value": "" }, "matchText": { "type": "string", "value": "" } } };
    exports.HighlightText = __decorate([
        ojvcomponentElement.customElement('oj-highlight-text')
    ], exports.HighlightText);

    Object.defineProperty(exports, '__esModule', { value: true });

});
