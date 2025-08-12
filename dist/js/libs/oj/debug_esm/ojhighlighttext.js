/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import { Component } from 'preact';
import { Root, customElement } from 'ojs/ojvcomponent';
import oj from 'ojs/ojcore-base';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * @classdesc
 * <h3 id="highlightTextOverview-section">
 *   JET Highlight Text
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#highlightTextOverview-section"></a>
 * </h3>
 * <p>Description: JET Highlight Text renders text with highlighting applied.</p>
 *
 * <p>JET Highlight Text renders a text string with highlighting applied to the given text to match.</p>
 *
 * A Highlight Text can be created with the following markup.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-highlight-text
 *   text='My text to apply highlighting to.'
 *   match-text='igh'>
 * &lt;/oj-highlight-text>
 * </code></pre>
 *
 * <h3 id="migration-section">
 *   Migration
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a>
 * </h3>
 *
 * <p>
 * To migrate from oj-highlight-text to oj-c-highlight-text, you need to revise the import statement
 * and references to oj-c-highlight-text in your app.
 * </p>
 *
 * @ojmetadata description "A Highlight Text renders text with highlighting applied."
 * @ojmetadata displayName "Highlight Text"
 * @ojmetadata main "ojs/ojhighlighttext"
 * @ojmetadata extension {
 *   "vbdt": {
 *     "module": "ojs/ojhighlighttext",
 *     "defaultColumns": "6",
 *     "minColumns": "2"
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-background-color"
 *   }
 * }
 * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojHighlightText.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "text",
 *       "matchText"
 *     ]
 *   }
 * ]
 * @ojmetadata since "9.1.0"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "16.0.0",
 *     "value": ["oj-c-highlight-text"]
 *   }
 * ]
 */
let HighlightText = class HighlightText extends Component {
    constructor() {
        super(...arguments);
        this._HIGHLIGHT_TOKEN = '__@@__';
    }
    render(props) {
        const content = this._highlighter(props.text, props.matchText);
        return jsx(Root, { class: "oj-highlighttext", children: content });
    }
    _highlighter(unhighlightedText, matchText) {
        if (matchText) {
            const escapedMatchText = this._escapeRegExp(matchText);
            const highlightedText = unhighlightedText.replace(new RegExp(escapedMatchText, 'gi'), this._HIGHLIGHT_TOKEN + '$&' + this._HIGHLIGHT_TOKEN);
            const tokens = highlightedText.split(this._HIGHLIGHT_TOKEN);
            const nodes = tokens.map((current, index) => index % 2 == 0 ? current : jsx("span", { class: "oj-highlighttext-highlighter", children: current }));
            // JET-44623 iPhone VoiceOver truncates the typed characters when reading filtered select-single dropdown options.
            // role="text" is not in the spec, but APO agrees this is needed for VoiceOver on iOS.
            if (oj.AgentUtils.getAgentInfo().os === oj.AgentUtils.OS.IOS) {
                // to read the text properly so we need to tell TypeScript to ignore role="text".
                // @ts-ignore
                return jsx("span", { role: "text", children: nodes });
            }
            return jsx("span", { children: nodes });
        }
        return jsx("span", { children: unhighlightedText });
    }
    _escapeRegExp(str) {
        // copied from:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
        return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
};
HighlightText.defaultProps = {
    text: '',
    matchText: ''
};
HighlightText._metadata = { "properties": { "text": { "type": "string" }, "matchText": { "type": "string" } } };
HighlightText = __decorate([
    customElement('oj-highlight-text')
], HighlightText);

export { HighlightText };
