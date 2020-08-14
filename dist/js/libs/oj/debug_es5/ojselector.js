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

define(['exports', 'ojs/ojtranslation', 'ojs/ojvcomponent'], function (exports, Translations, ojvcomponent) {
  'use strict';
  /**
   * @license
   * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @ojcomponent oj.ojSelector
   * @ojtsvcomponent
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojSelector<K> extends JetElement<ojSelectorSettableProperties<K>>",
   *                genericParameters: [{"name": "K", "description": "Type of key"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojSelectorSettableProperties<K> extends JetSettableProperties",
   *                genericParameters: [{"name": "K", "description": "Type of key"}],
   *                for: "SettableProperties"
   *               }
   *              ]
   * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet", "ExpandedKeySet", "ExpandAllKeySet", 'AllKeySetImpl']}
   * @since 9.0.0
   *
   * @ojshortdesc The selector component renders checkboxes in collections to support selection.
   *
   * @classdesc
   * <h3 id="selectorOverview-section">
   *   JET Selector
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectorOverview-section"></a>
   * </h3>
   * <p>Description: A checkbox to support selection in Collection Components</p>
   * <p>The oj-selector is a component that may be placed within a template for Table, ListView.
   * It presents as a checkbox when the Collection Component is configured for multi-selection.</p>
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-list-view id="listview"
   *      data="[[dataProvider]]"
   *      selected="{{selectedItems}}"
   *      selection-mode="[[selectedSelectionMode]]"
   *      scroll-policy="loadMoreOnScroll">
   *  &lt;template slot="itemTemplate" data-oj-as="item">
   *    &lt;li>
   *      &lt;div class='oj-flex'>
   *        &lt;div class="oj-flex-item">
   *          &lt;oj-selector selected-keys='{{selectedItems}}'
   *                        selection-mode='[[selectedSelectionMode]]'
   *                        rowKey='[[item.key]]'>
   *          &lt;/oj-selector>
   *        &lt;/div>
   *        &lt;div class="oj-flex-item">
   *          &lt;span data-bind="text: 'Name '+ item.data.name">&lt;/span>
   *        &lt;/div>
   *      &lt;/div>
   *    &lt;/li>
   *  &lt;/template>
   *&lt;/oj-list-view>
   *</code></pre>
   */

  /**
   * Specifies the selectedKeys, should be hooked into the collection component.
   * @expose
   * @ojrequired
   * @name selectedKeys
   * @memberof oj.ojSelector
   * @instance
   * @type {KeySet<K>|null}
   * @default null
   * @ojwriteback
   */

  /**
   * Specifies the row key of each selector. If the selectionMode property is 'all', rowKey is ignored.
   * @expose
   * @name rowKey
   * @memberof oj.ojSelector
   * @instance
   * @type {any}
   * @default null
   * @ojsignature [{target: "Type", value: "K|null", jsdocOverride:true}]
   */

  /**
   * Specifies the selection mode ('single', 'multiple', 'all'). 'all' should only be used for the select all case and will ignore the key property.
   * <code>
   * &lt;oj-selector selected-keys='{{selectedItems}}'
   *          selection-mode='all'>
   * &lt;/oj-selector>
   * </code>
   * @expose
   * @name selectionMode
   * @memberof oj.ojSelector
   * @ojshortdesc Specifies the selection mode.
   * @instance
   * @type {string}
   * @default 'multiple'
   * @ojvalue {string} "single" Only a single item can be selected at a time.
   * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
   * @ojvalue {string} "all" Specifies the select all case (rowKey property is ignored).
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

    this.rowKey = null;
    this.selectedKeys = null;
    this.selectionMode = 'multiple';
  };

  exports.Selector = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(Selector, _ojvcomponent$VCompon);

    var _super = _createSuper(Selector);

    function Selector() {
      _classCallCheck(this, Selector);

      return _super.apply(this, arguments);
    }

    _createClass(Selector, [{
      key: "render",
      value: function render() {
        var rowKey = this.props.rowKey;

        var isSelected = this._isSelected(rowKey);

        var spanClassName = {
          'oj-selector-wrapper': true,
          'oj-selected': isSelected,
          'oj-component-icon': true
        };
        var ariaLabelledby = this.props['aria-labelledby'] || null;
        var ariaLabel = this.props['aria-label'] || Translations.getTranslatedString('oj-ojSelector.checkboxAriaLabel', {
          rowKey: rowKey
        });
        return ojvcomponent.h("oj-selector", {
          class: 'oj-selector'
        }, ojvcomponent.h("span", {
          class: spanClassName
        }, ojvcomponent.h("input", {
          type: 'checkbox',
          class: 'oj-selectorbox oj-clickthrough-disabled',
          "aria-label": ariaLabel,
          "aria-labelledby": ariaLabelledby,
          checked: isSelected,
          onClick: this._checkboxListener
        })));
      }
    }, {
      key: "_checkboxListener",
      value: function _checkboxListener(event) {
        var _this$props = this.props,
            selectedKeys = _this$props.selectedKeys,
            rowKey = _this$props.rowKey,
            selectionMode = _this$props.selectionMode;
        var newSelectedKeys;

        if (event.target.checked) {
          if (selectionMode === 'single') {
            newSelectedKeys = selectedKeys.clear().add([rowKey]);
          } else if (selectionMode === 'all') {
            newSelectedKeys = selectedKeys.addAll();
          } else {
            newSelectedKeys = selectedKeys.add([rowKey]);
          }
        } else {
          if (selectionMode === 'all') {
            newSelectedKeys = selectedKeys.clear();
          } else {
            newSelectedKeys = selectedKeys.delete([rowKey]);
          }
        }

        this._updateProperty('selectedKeys', newSelectedKeys, true);

        event.stopPropagation();
      }
    }, {
      key: "_isSelected",
      value: function _isSelected(rowKey) {
        var _this$props2 = this.props,
            selectedKeys = _this$props2.selectedKeys,
            selectionMode = _this$props2.selectionMode;

        if (!selectedKeys) {
          return false;
        }

        return selectionMode === 'all' ? selectedKeys.isAddAll() : selectedKeys.has(rowKey);
      }
    }]);

    return Selector;
  }(ojvcomponent.VComponent);

  exports.Selector.metadata = {
    "extension": {
      "_DEFAULTS": Props,
      "_ROOT_PROPS_MAP": {
        "aria-label": true,
        "aria-labelledby": true
      }
    },
    "properties": {
      "rowKey": {
        "type": "any",
        "value": null
      },
      "selectedKeys": {
        "type": "object|null",
        "value": null,
        "writeback": true,
        "readOnly": false
      },
      "selectionMode": {
        "type": "string",
        "enumValues": ["all", "multiple", "single"],
        "value": "multiple"
      }
    }
  };

  __decorate([ojvcomponent.listener()], exports.Selector.prototype, "_checkboxListener", null);

  exports.Selector = __decorate([ojvcomponent.customElement('oj-selector')], exports.Selector);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())