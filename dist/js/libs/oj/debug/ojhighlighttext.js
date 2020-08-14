define(['exports', 'ojs/ojvcomponent'], function (exports, ojvcomponent) { 'use strict';

    /**
     * @license
     * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */

    /**
     * @ojcomponent oj.ojHighlightText
     * @ojtsvcomponent
     * @augments oj.baseComponent
     * @since 9.1.0
     * @ojdisplayname Highlight Text
     * @ojshortdesc A Highlight Text renders text with highlighting applied.
     * @ojsignature [{
     *                target: "Type",
     *                value: "class ojHighlightText extends baseComponent<ojHighlightTextSettableProperties>"
     *               },
     *               {
     *                target: "Type",
     *                value: "ojHighlightTextSettableProperties extends baseComponentSettableProperties",
     *                for: "SettableProperties"
     *               }
     *              ]
     *
     * @ojpropertylayout {propertyGroup: "common", items: ["text", "matchText"]}
     * @ojvbdefaultcolumns 6
     * @ojvbmincolumns 2
     *
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
     */

    /**
     * The text string to apply highlighting to.
     *
     * @example <caption>Initialize the Highlight Text with the <code class="prettyprint">text</code> attribute specified:</caption>
     * &lt;oj-highlight-text text="My text to apply highlighting to.">&lt;/oj-highlight-text>
     *
     * @example <caption>Get or set the <code class="prettyprint">text</code> property after initialization:</caption>
     * // getter
     * var textValue = myHighlightText.text;
     *
     * // setter
     * myHighlightText.text = "My text to apply highlighting to.";
     *
     * @expose
     * @member
     * @name text
     * @ojshortdesc The text string to apply highlighting to.
     * @ojtranslatable
     * @access public
     * @instance
     * @memberof oj.ojHighlightText
     * @type {string}
     * @default ''
     */

    /**
     * The text string to match.
     *
     * @example <caption>Initialize the Highlight Text with the <code class="prettyprint">match-text</code> attribute specified:</caption>
     * &lt;oj-highlight-text match-text="igh">&lt;/oj-highlight-text>
     *
     * @example <caption>Get or set the <code class="prettyprint">matchText</code> property after initialization:</caption>
     * // getter
     * var matchTextValue = myHighlightText.matchText;
     *
     * // setter
     * myHighlightText.matchText = "igh";
     *
     * @expose
     * @member
     * @name matchText
     * @ojshortdesc The text string to match.
     * @ojtranslatable
     * @access public
     * @instance
     * @memberof oj.ojHighlightText
     * @type {string}
     * @default ''
     */

    // Superclass Doc Overrides

    /**
     * @ojslot contextMenu
     * @memberof oj.ojHighlightText
     * @ignore
     */

    /**
     * @name refresh
     * @memberof oj.ojHighlightText
     * @instance
     * @ignore
     */

    /**
     * @name translations
     * @memberof oj.ojHighlightText
     * @instance
     * @ignore
     */

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
    exports.HighlightText = class HighlightText extends ojvcomponent.VComponent {
        constructor(props) {
            super(props);
            this._HIGHLIGHT_TOKEN = '__@@__';
        }
        render() {
            const props = this.props;
            const content = this._highlighter(props.text, props.matchText);
            return ojvcomponent.h("oj-highlight-text", { class: 'oj-highlighttext' }, content);
        }
        _highlighter(unhighlightedText, matchText) {
            if (matchText) {
                const escapedMatchText = this._escapeRegExp(matchText);
                const highlightedText = unhighlightedText.replace(new RegExp(escapedMatchText, 'gi'), this._HIGHLIGHT_TOKEN + '$&' + this._HIGHLIGHT_TOKEN);
                const tokens = highlightedText.split(this._HIGHLIGHT_TOKEN);
                const nodes = tokens.map((current, index) => index % 2 == 0 ? current : ojvcomponent.h("span", { class: 'oj-highlighttext-highlighter' }, current));
                return ojvcomponent.h("span", null, nodes);
            }
            return ojvcomponent.h("span", null, unhighlightedText);
        }
        _escapeRegExp(str) {
            return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
        }
    };
    exports.HighlightText.metadata = { "extension": { "_DEFAULTS": Props }, "properties": { "text": { "type": "string", "value": "" }, "matchText": { "type": "string", "value": "" } } };
    exports.HighlightText = __decorate([
        ojvcomponent.customElement('oj-highlight-text')
    ], exports.HighlightText);

    Object.defineProperty(exports, '__esModule', { value: true });

});
