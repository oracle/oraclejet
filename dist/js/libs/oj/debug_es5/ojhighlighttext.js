(function() {function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

define(['exports', 'ojs/ojvcomponent'], function (exports, ojvcomponent) {
  'use strict';
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

  var __decorate = null && null.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var Props = function Props() {
    _classCallCheck(this, Props);

    this.text = '';
    this.matchText = '';
  };

  exports.HighlightText = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(HighlightText, _ojvcomponent$VCompon);

    var _super = _createSuper(HighlightText);

    function HighlightText(props) {
      var _this;

      _classCallCheck(this, HighlightText);

      _this = _super.call(this, props);
      _this._HIGHLIGHT_TOKEN = '__@@__';
      return _this;
    }

    _createClass(HighlightText, [{
      key: "render",
      value: function render() {
        var props = this.props;

        var content = this._highlighter(props.text, props.matchText);

        return ojvcomponent.h("oj-highlight-text", {
          class: 'oj-highlighttext'
        }, content);
      }
    }, {
      key: "_highlighter",
      value: function _highlighter(unhighlightedText, matchText) {
        if (matchText) {
          var escapedMatchText = this._escapeRegExp(matchText);

          var highlightedText = unhighlightedText.replace(new RegExp(escapedMatchText, 'gi'), this._HIGHLIGHT_TOKEN + '$&' + this._HIGHLIGHT_TOKEN);
          var tokens = highlightedText.split(this._HIGHLIGHT_TOKEN);
          var nodes = tokens.map(function (current, index) {
            return index % 2 == 0 ? current : ojvcomponent.h("span", {
              class: 'oj-highlighttext-highlighter'
            }, current);
          });
          return ojvcomponent.h("span", null, nodes);
        }

        return ojvcomponent.h("span", null, unhighlightedText);
      }
    }, {
      key: "_escapeRegExp",
      value: function _escapeRegExp(str) {
        return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
      }
    }]);

    return HighlightText;
  }(ojvcomponent.VComponent);

  exports.HighlightText.metadata = {
    "extension": {
      "_DEFAULTS": Props
    },
    "properties": {
      "text": {
        "type": "string",
        "value": ""
      },
      "matchText": {
        "type": "string",
        "value": ""
      }
    }
  };
  exports.HighlightText = __decorate([ojvcomponent.customElement('oj-highlight-text')], exports.HighlightText);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())