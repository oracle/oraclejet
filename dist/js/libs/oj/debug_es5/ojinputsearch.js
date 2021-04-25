(function() {
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdomutils', 'ojs/ojlistdataproviderview', 'jquery', 'ojs/ojcore-base', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojthemeutils', 'ojs/ojtimerutils', 'ojs/ojhighlighttext', 'ojs/ojvcomponent', 'ojs/ojvcomponent-element', 'ojs/ojpopupcore'], function (exports, DomUtils, ojlistdataproviderview, $, oj, Context, Logger, ThemeUtils, TimerUtils, ojhighlighttext, ojvcomponent, ojvcomponentElement, ojpopupcore) {
  'use strict';

  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

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

    this.focus = false;
    this.formattedText = '';
    this.index = -1;
    this.labelId = '';
    this.searchText = null;
  };

  var InputSearchSuggestion = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(InputSearchSuggestion, _ojvcomponent$VCompon);

    var _super = _createSuper(InputSearchSuggestion);

    function InputSearchSuggestion(props) {
      var _this;

      _classCallCheck(this, InputSearchSuggestion);

      _this = _super.call(this, props);

      _this._fireSuggestionActionEvent = function (text, itemContext) {
        var _a, _b;

        (_b = (_a = _this.props).onOjSuggestionAction) === null || _b === void 0 ? void 0 : _b.call(_a, {
          text: text,
          itemContext: itemContext
        });
      };

      _this.state = {
        hover: false
      };
      return _this;
    }

    _createClass(InputSearchSuggestion, [{
      key: "fireSuggestionAction",
      value: function fireSuggestionAction() {
        this._fireSuggestionActionEvent(this.props.formattedText, this.props.suggestionItemContext);
      }
    }, {
      key: "getFormattedText",
      value: function getFormattedText() {
        return this.props.formattedText;
      }
    }, {
      key: "render",
      value: function render() {
        var props = this.props;
        var rootClasses = {
          'oj-listbox-result': true,
          'oj-listbox-result-selectable': true,
          'oj-hover': this.state.hover,
          'oj-focus': props.focus
        };

        var content = this._renderContent();

        return ojvcomponent.h("li", {
          role: 'presentation',
          class: rootClasses,
          onClick: this._handleClick,
          onMouseenter: this._handleMouseenter,
          onMouseleave: this._handleMouseleave
        }, ojvcomponent.h("div", {
          id: props.labelId,
          class: 'oj-listbox-result-label',
          role: 'option'
        }, content));
      }
    }, {
      key: "_renderContent",
      value: function _renderContent() {
        var _a;

        var props = this.props;
        var renderer = props.suggestionItemTemplate;

        if (renderer) {
          return renderer({
            data: props.suggestionItemContext.data,
            key: props.suggestionItemContext.key,
            metadata: props.suggestionItemContext.metadata,
            index: props.index,
            searchText: props.searchText
          });
        }

        return ojvcomponent.h(ojhighlighttext.HighlightText, {
          "data-oj-internal": true,
          text: this.props.formattedText,
          matchText: (_a = props.searchText) !== null && _a !== void 0 ? _a : ''
        });
      }
    }, {
      key: "_handleMouseenter",
      value: function _handleMouseenter(event) {
        if (!DomUtils.recentTouchEnd()) {
          this.updateState(_defineProperty({}, 'hover', true));
        }
      }
    }, {
      key: "_handleMouseleave",
      value: function _handleMouseleave(event) {
        this.updateState(_defineProperty({}, 'hover', false));
      }
    }, {
      key: "_handleClick",
      value: function _handleClick(event) {
        var mainButton = event.button === 0;

        if (mainButton) {
          this._fireSuggestionActionEvent(this.props.formattedText, this.props.suggestionItemContext);
        }
      }
    }]);

    return InputSearchSuggestion;
  }(ojvcomponent.VComponent);

  InputSearchSuggestion.metadata = {
    "extension": {
      "_DEFAULTS": Props
    }
  };

  __decorate([ojvcomponent.listener()], InputSearchSuggestion.prototype, "_handleMouseenter", null);

  __decorate([ojvcomponent.listener()], InputSearchSuggestion.prototype, "_handleMouseleave", null);

  __decorate([ojvcomponent.listener()], InputSearchSuggestion.prototype, "_handleClick", null);

  var __decorate$1 = null && null.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var InputSearch_1;

  var Props$1 = function Props$1() {
    _classCallCheck(this, Props$1);

    this.suggestions = null;
    this.suggestionItemText = 'label';
    this.placeholder = '';
    this.rawValue = null;
    this.value = null;
  };

  exports.InputSearch = InputSearch_1 = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(InputSearch, _ojvcomponentElement$);

    var _super2 = _createSuper(InputSearch);

    function InputSearch(props) {
      var _this2;

      _classCallCheck(this, InputSearch);

      _this2 = _super2.call(this, props);
      _this2._CLASS_NAMES = 'oj-inputsearch-input';
      _this2._KEYS = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
      };
      _this2._isComposing = false;
      _this2._counter = 0;
      _this2._queryCount = 0;
      _this2._renderedSuggestions = [];

      _this2._handleMousedown = function (event) {
        var mainButton = event.button === 0;

        if (mainButton) {
          _this2.updateState({
            focus: true,
            dropdownOpen: true
          });

          if (event.target !== _this2._inputElem) {
            event.preventDefault();
          } else {
            if (_this2.state.showAutocompleteText) {
              if (!_this2.state.autocompleteFloatingText) {
                _this2.updateState({
                  showAutocompleteText: false,
                  filterText: _this2.state.displayValue
                });
              } else {
                _this2.updateState({
                  showAutocompleteText: false,
                  filterText: _this2.state.autocompleteFloatingText,
                  displayValue: _this2.state.autocompleteFloatingText
                });
              }
            }
          }
        }
      };

      _this2._handleDropdownMousedown = function (event) {
        var mainButton = event.button === 0;

        if (mainButton) {
          _this2.updateState({
            focus: true
          });

          event.preventDefault();
        }
      };

      _this2._handleDropdownMousemove = function (event) {
        _this2.updateState({
          lastEventType: 'mouse'
        });
      };

      _this2._handleDropdownMouseleave = function (event) {
        _this2.updateState({
          lastEventType: null
        });
      };

      _this2._setRootElem = function (element) {
        _this2._rootElem = element;
      };

      _this2._setDropdownElem = function (element) {
        _this2._dropdownElem = element;
      };

      _this2._setInputElem = function (element) {
        _this2._inputElem = element;
      };

      _this2._setInputContainerElem = function (element) {
        _this2._inputContainerElem = element;
      };

      _this2._setRenderedSuggestion = function (index, vnode) {
        _this2._renderedSuggestions[index] = vnode;
      };

      _this2._getRenderedSuggestionsCount = function () {
        var length = _this2._renderedSuggestions.length;

        var nullIndex = _this2._renderedSuggestions.indexOf(null);

        return nullIndex === -1 ? length : nullIndex;
      };

      var cssOptionDefaults = ThemeUtils.parseJSONFromFontFamily('oj-inputsearch-option-defaults') || {};
      var showIndicatorDelay = cssOptionDefaults.showIndicatorDelay;
      showIndicatorDelay = parseInt(showIndicatorDelay, 10);
      showIndicatorDelay = isNaN(showIndicatorDelay) ? 250 : showIndicatorDelay;
      _this2._showIndicatorDelay = showIndicatorDelay;

      if (props.suggestions) {
        _this2._dataProvider = _this2._wrapDataProviderIfNeeded(_this2.props.suggestions);
      }

      _this2.state = {
        dropdownOpen: false,
        dropdownAbove: false,
        valueSubmitted: false,
        focus: false,
        hover: false,
        active: false,
        displayValue: null,
        filterText: null,
        lastFetchedFilterText: null,
        fetchedData: null,
        labelIds: [],
        fetchedInitial: false,
        loading: false,
        focusedSuggestionIndex: -1,
        activeDescendantId: null,
        scrollFocusedSuggestionIntoView: null,
        actionDetail: null,
        lastEventType: null,
        showAutocompleteText: false,
        autocompleteFloatingText: null
      };
      return _this2;
    }

    _createClass(InputSearch, [{
      key: "render",
      value: function render() {
        var state = this.state;
        var rootClasses = {
          'oj-inputsearch': true,
          'oj-form-control': true,
          'oj-text-field': true,
          'oj-component': true,
          'oj-hover': state.hover,
          'oj-active': state.active,
          'oj-focus': state.focus,
          'oj-listbox-dropdown-open': state.dropdownOpen,
          'oj-listbox-drop-above': state.dropdownOpen && state.dropdownAbove
        };
        var inputClasses = this._CLASS_NAMES + ' oj-text-field-input';
        var iconClasses = 'oj-text-field-start-end-icon oj-inputsearch-search-icon oj-component-icon';
        var displayValue = state.displayValue || '';
        return this._renderEnabled(rootClasses, iconClasses, displayValue, inputClasses);
      }
    }, {
      key: "mounted",
      value: function mounted() {
        var _a, _b;

        if (this.props.value !== null) {
          (_b = (_a = this.props).onRawValueChanged) === null || _b === void 0 ? void 0 : _b.call(_a, this.props.value);
        }

        if (this._dataProvider) {
          this._addDataProviderEventListeners(this._dataProvider);
        }
      }
    }, {
      key: "updated",
      value: function updated(oldProps, oldState) {
        var _a, _b, _c, _d, _e, _f;

        if (oldState.focus && !this.state.focus || this.state.valueSubmitted) {
          if (this.props.value !== this.state.displayValue) {
            (_b = (_a = this.props).onValueChanged) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.displayValue);
          }

          if (oldState.focus && !this.state.focus && oldState.filterText !== this.state.displayValue) {
            this.updateState({
              filterText: this.state.displayValue
            });
          }

          if (this.state.valueSubmitted) {
            (_d = (_c = this.props).onOjValueAction) === null || _d === void 0 ? void 0 : _d.call(_c, {
              value: this.state.displayValue,
              itemContext: this.state.actionDetail,
              previousValue: this.props.value
            });
            this.updateState({
              valueSubmitted: false
            });

            if (this._testPromiseResolve) {
              this._testPromiseResolve();

              this._testPromiseResolve = null;
            }
          }
        }

        if (oldState.displayValue != this.state.displayValue) {
          (_f = (_e = this.props).onRawValueChanged) === null || _f === void 0 ? void 0 : _f.call(_e, this.state.displayValue);
        }

        if (oldProps.suggestions != this.props.suggestions) {
          if (oldProps.suggestions) {
            this._removeDataProviderEventListeners(this._dataProvider);
          }

          if (this.props.suggestions) {
            this._dataProvider = this._wrapDataProviderIfNeeded(this.props.suggestions);

            this._addDataProviderEventListeners(this._dataProvider);
          } else {
            this._dataProvider = null;

            this._resolveFetching();
          }
        }

        if (!this.state.dropdownOpen) {
          if (oldState.dropdownOpen) {
            this.updateState({
              focusedSuggestionIndex: -1
            });

            this._resolveFetching();
          }
        } else {
          if (this.state.lastFetchedFilterText != this.state.filterText || !this.state.fetchedInitial) {
            this.updateState({
              lastFetchedFilterText: this.state.filterText
            });

            this._fetchData(this.state.filterText);
          }

          if (!oldState.dropdownOpen || this.state.filterText !== oldState.filterText) {
            this.updateState(function (state, props) {
              var _a;

              return {
                focusedSuggestionIndex: ((_a = state.filterText) === null || _a === void 0 ? void 0 : _a.length) > 0 ? 0 : -1
              };
            });
          } else if (this.state.fetchedData) {
            this.updateState(function (state, props) {
              return {
                focusedSuggestionIndex: Math.min(state.fetchedData.length - 1, state.focusedSuggestionIndex)
              };
            });
          }

          var focusIndex = this._resolveFetchBusyState ? -1 : this.state.focusedSuggestionIndex;

          if (focusIndex >= 0 && this.state.labelIds.length > focusIndex) {
            this.updateState({
              activeDescendantId: this.state.labelIds[focusIndex]
            });
            var filterText = this.state.filterText || '';

            if (focusIndex === 0 && this.state.showAutocompleteText && filterText.length > 0) {
              var firstSuggestionText = this._renderedSuggestions[0].getFormattedText();

              var lowercaseFirstSuggestionText = firstSuggestionText.toLowerCase();
              var lowercaseFilterText = filterText.toLowerCase();

              if (lowercaseFirstSuggestionText.startsWith(lowercaseFilterText)) {
                var selectionStart = filterText.length;
                var autocompleteText = firstSuggestionText.substr(selectionStart);
                this.updateState({
                  displayValue: filterText + autocompleteText,
                  autocompleteFloatingText: null
                });

                this._inputElem.setSelectionRange(selectionStart, selectionStart + autocompleteText.length);
              } else {
                this.updateState({
                  autocompleteFloatingText: firstSuggestionText,
                  displayValue: filterText
                });
              }
            }
          } else {
            this.updateState({
              activeDescendantId: null
            });
          }

          if (!this._resolveFetchBusyState && this.state.labelIds.length === 0) {
            this.updateState({
              dropdownOpen: false
            });
          }
        }

        var scrollFocusedSuggestionIntoView = this.state.scrollFocusedSuggestionIntoView;

        if (scrollFocusedSuggestionIntoView) {
          var activeDescendantId = this.state.activeDescendantId;

          if (activeDescendantId) {
            var alignToTop = scrollFocusedSuggestionIntoView === 'top';

            this._scrollSuggestionIntoView(activeDescendantId, alignToTop);

            this.updateState({
              scrollFocusedSuggestionIntoView: null
            });
          }
        }
      }
    }, {
      key: "unmounted",
      value: function unmounted() {
        if (this._dataProvider) {
          this._removeDataProviderEventListeners(this._dataProvider);
        }

        this._resolveFetching();
      }
    }, {
      key: "_handleMouseenter",
      value: function _handleMouseenter(event) {
        if (!DomUtils.recentTouchEnd()) {
          this.updateState({
            hover: true
          });
        }
      }
    }, {
      key: "_handleMouseleave",
      value: function _handleMouseleave(event) {
        this.updateState({
          hover: false
        });
      }
    }, {
      key: "_handleFocusin",
      value: function _handleFocusin(event) {
        this.updateState({
          focus: true
        });
      }
    }, {
      key: "_handleFocusout",
      value: function _handleFocusout() {
        this.updateState({
          focus: false
        });
      }
    }, {
      key: "_handleCompositionstart",
      value: function _handleCompositionstart(event) {
        this._isComposing = true;
      }
    }, {
      key: "_handleCompositionend",
      value: function _handleCompositionend(event) {
        this._isComposing = false;
        this.updateState({
          filterText: event.target.value,
          displayValue: event.target.value
        });
      }
    }, {
      key: "_handleInput",
      value: function _handleInput(event) {
        if (!this._isComposing) {
          var autocomplete;
          var filterText = this.state.filterText || '';
          var lowercaseFilter = filterText.toLowerCase();
          var lowercaseValue = event.target.value.toLowerCase();

          if (this.state.showAutocompleteText && !this.state.autocompleteFloatingText && filterText === event.target.value) {
            autocomplete = false;
          } else if (!this.state.showAutocompleteText && lowercaseValue.length < lowercaseFilter.length && lowercaseFilter.startsWith(lowercaseValue)) {
            autocomplete = false;
          } else {
            autocomplete = event.target.value.length > 0;
          }

          this.updateState({
            filterText: event.target.value,
            displayValue: event.target.value,
            dropdownOpen: true,
            showAutocompleteText: autocomplete
          });
        }
      }
    }, {
      key: "focus",
      value: function focus() {
        var _a;

        (_a = this._inputElem) === null || _a === void 0 ? void 0 : _a.focus();
      }
    }, {
      key: "blur",
      value: function blur() {
        var _a;

        (_a = this._inputElem) === null || _a === void 0 ? void 0 : _a.blur();
      }
    }, {
      key: "_handleFocus",
      value: function _handleFocus(event) {
        var _a;

        (_a = this._rootElem) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new FocusEvent('focus', {
          relatedTarget: event.relatedTarget
        }));
      }
    }, {
      key: "_handleBlur",
      value: function _handleBlur(event) {
        var _a;

        (_a = this._rootElem) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new FocusEvent('blur', {
          relatedTarget: event.relatedTarget
        }));
      }
    }, {
      key: "_handleKeydown",
      value: function _handleKeydown(event) {
        var _a;

        var updatedState = {
          lastEventType: 'keyboard'
        };
        var keyCode = event.keyCode;

        switch (keyCode) {
          case this._KEYS.ENTER:
            var focusIndex = this.state.focusedSuggestionIndex;

            if (this.state.dropdownOpen && focusIndex >= 0 && this._getRenderedSuggestionsCount() > focusIndex && !this._resolveFetchBusyState) {
              this._renderedSuggestions[focusIndex].fireSuggestionAction();
            } else {
              Object.assign(updatedState, {
                dropdownOpen: false,
                valueSubmitted: true,
                actionDetail: null
              });
            }

            break;

          case this._KEYS.TAB:
            Object.assign(updatedState, {
              dropdownOpen: false,
              focus: false,
              actionDetail: null
            });

            if (this.state.showAutocompleteText) {
              Object.assign(updatedState, {
                showAutocompleteText: false,
                displayValue: this.state.filterText
              });
            }

            break;

          case this._KEYS.ESC:
            if (this.state.dropdownOpen) {
              updatedState.dropdownOpen = false;

              if (this.state.showAutocompleteText) {
                Object.assign(updatedState, {
                  showAutocompleteText: false,
                  displayValue: this.state.filterText
                });
              }

              event.preventDefault();
            }

            break;

          case this._KEYS.UP:
          case this._KEYS.DOWN:
            if (!this.state.dropdownOpen) {
              updatedState.dropdownOpen = true;
            } else if (!this._resolveFetchBusyState && this._getRenderedSuggestionsCount() > 0) {
              var index = this.state.focusedSuggestionIndex;

              if (keyCode === this._KEYS.DOWN || index === -1) {
                index += 1;
                updatedState.scrollFocusedSuggestionIntoView = 'bottom';
              } else if (index > 0) {
                index -= 1;
                updatedState.scrollFocusedSuggestionIntoView = 'top';
              }

              index = Math.min(this._getRenderedSuggestionsCount() - 1, index);
              updatedState.focusedSuggestionIndex = index;
              var autocomplete = index === 0 && ((_a = this.state.filterText) === null || _a === void 0 ? void 0 : _a.length) > 0;
              updatedState.showAutocompleteText = autocomplete;

              if (autocomplete) {
                updatedState.displayValue = this.state.filterText;
              } else if (index > -1) {
                updatedState.displayValue = this._renderedSuggestions[index].getFormattedText();
              }
            }

            break;

          case this._KEYS.LEFT:
          case this._KEYS.RIGHT:
            if (this.state.showAutocompleteText && !this.state.autocompleteFloatingText) {
              Object.assign(updatedState, {
                showAutocompleteText: false,
                filterText: this.state.displayValue
              });
            }

            break;

          default:
            break;
        }

        this.updateState(updatedState);
      }
    }, {
      key: "_getDropdownElemId",
      value: function _getDropdownElemId() {
        return 'searchDropdown_' + this.uniqueId();
      }
    }, {
      key: "_getInputContainerId",
      value: function _getInputContainerId() {
        return 'searchInputContainer_' + this.uniqueId();
      }
    }, {
      key: "_getListboxId",
      value: function _getListboxId() {
        return 'searchSuggestionsListbox_' + this.uniqueId();
      }
    }, {
      key: "_clickAwayHandler",
      value: function _clickAwayHandler(event) {
        var target = event.target;

        if (target.closest('#' + $.escapeSelector(this._getDropdownElemId())) || target.closest('#' + $.escapeSelector(this._getInputContainerId()))) {
          return;
        }

        var updatedState = {
          dropdownOpen: false
        };

        if (this.state.showAutocompleteText) {
          Object.assign(updatedState, {
            showAutocompleteText: false,
            displayValue: this.state.filterText
          });
        }

        this.updateState(updatedState);
      }
    }, {
      key: "_getDropdownPosition",
      value: function _getDropdownPosition() {
        var position = {
          my: 'start top',
          at: 'start bottom',
          of: this._inputContainerElem,
          collision: 'flip',
          using: this._usingHandler.bind(this)
        };
        var isRtl = DomUtils.getReadingDirection() === 'rtl';
        position = oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);
        return position;
      }
    }, {
      key: "_usingHandler",
      value: function _usingHandler(pos, props) {
        if (oj.PositionUtils.isAligningPositionClipped(props)) {
          this.updateState({
            dropdownOpen: false
          });
        } else {
          var dropdownElem = props.element.element;
          dropdownElem.css(pos);
          this.updateState({
            dropdownAbove: props.vertical === 'bottom'
          });
        }
      }
    }, {
      key: "_renderEnabled",
      value: function _renderEnabled(rootClasses, iconClasses, displayValue, inputClasses) {
        var props = this.props;
        var state = this.state;
        var ariaLabel = null;

        if (props['aria-label']) {
          ariaLabel = props['aria-label'];
        }

        var dropdown = state.dropdownOpen ? this._renderDropdown() : null;
        var listboxId = this._dataProvider ? this._getListboxId() : null;
        var agentInfo = oj.AgentUtils.getAgentInfo();
        var isMobile = agentInfo.os === oj.AgentUtils.OS.ANDROID || agentInfo.os === oj.AgentUtils.OS.IOS || agentInfo.os === oj.AgentUtils.OS.WINDOWSPHONE;
        var inputType = isMobile ? 'search' : 'text';
        var autocompleteFloatingElem = state.autocompleteFloatingText ? this._renderAutocompleteFloatingText(state.autocompleteFloatingText, displayValue) : null;
        return ojvcomponentElement.h("oj-input-search", {
          ref: this._setRootElem,
          class: rootClasses,
          onMousedown: this._handleMousedown,
          onMouseenter: this._handleMouseenter,
          onMouseleave: this._handleMouseleave
        }, ojvcomponentElement.h("div", {
          role: 'presentation',
          class: 'oj-text-field-container',
          id: this._getInputContainerId(),
          ref: this._setInputContainerElem
        }, ojvcomponentElement.h("span", {
          class: 'oj-text-field-start'
        }, ojvcomponentElement.h("span", {
          class: iconClasses,
          role: 'presentation'
        })), ojvcomponentElement.h("div", {
          class: 'oj-text-field-middle',
          role: this._dataProvider ? 'combobox' : null,
          "aria-label": this._dataProvider ? ariaLabel : null,
          "aria-owns": listboxId,
          "aria-haspopup": this._dataProvider ? 'listbox' : 'false',
          "aria-expanded": state.dropdownOpen ? 'true' : 'false'
        }, ojvcomponentElement.h("input", {
          type: inputType,
          ref: this._setInputElem,
          value: displayValue,
          class: inputClasses,
          placeholder: props.placeholder,
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          spellcheck: 'false',
          autofocus: 'false',
          "aria-label": ariaLabel,
          "aria-autocomplete": this._dataProvider ? 'list' : null,
          "aria-controls": listboxId,
          "aria-busy": state.dropdownOpen && state.loading,
          "aria-activedescendant": this._dataProvider ? state.activeDescendantId : null,
          onFocusin: this._handleFocusin,
          onFocusout: this._handleFocusout,
          onFocus: this._handleFocus,
          onBlur: this._handleBlur,
          onInput: this._handleInput,
          onCompositionstart: this._handleCompositionstart,
          onCompositionend: this._handleCompositionend,
          onKeydown: this._handleKeydown
        }), autocompleteFloatingElem)), dropdown);
      }
    }, {
      key: "_renderDropdown",
      value: function _renderDropdown() {
        var dropdownPosition = this._getDropdownPosition();

        var minWidth = this._rootElem.offsetWidth;
        var dropdownStyle = {
          minWidth: minWidth + 'px'
        };
        var dropdownContent = this.state.loading ? this._renderDropdownSkeleton() : this._renderDropdownSuggestions(this.state.filterText);
        var state = this.state;
        var dropdownClasses = {
          'oj-listbox-drop': true,
          'oj-listbox-inputsearch': true,
          'oj-listbox-hide-hover': state.lastEventType === 'keyboard',
          'oj-listbox-hide-focus': state.lastEventType === 'mouse',
          'oj-listbox-drop-above': state.dropdownAbove
        };
        return ojvcomponentElement.h(ojpopupcore.VPopup, {
          position: dropdownPosition,
          layerSelectors: 'oj-listbox-drop-layer',
          autoDismiss: this._clickAwayHandler
        }, ojvcomponentElement.h("div", {
          id: this._getDropdownElemId(),
          ref: this._setDropdownElem,
          class: dropdownClasses,
          role: 'presentation',
          style: dropdownStyle,
          onMousedown: this._handleDropdownMousedown,
          onMousemove: this._handleDropdownMousemove,
          onMouseleave: this._handleDropdownMouseleave
        }, dropdownContent));
      }
    }, {
      key: "_renderAutocompleteFloatingText",
      value: function _renderAutocompleteFloatingText(autocompleteFloatingText, displayValue) {
        var hiddenTextStyle = {
          visibility: 'hidden'
        };
        var text = '\xa0- ' + autocompleteFloatingText;
        return ojvcomponentElement.h("div", {
          class: 'oj-inputsearch-autocomplete-floating-container'
        }, ojvcomponentElement.h("span", {
          style: hiddenTextStyle
        }, displayValue), ojvcomponentElement.h("span", {
          class: 'oj-inputsearch-autocomplete-floating-text'
        }, text));
      }
    }, {
      key: "_scrollSuggestionIntoView",
      value: function _scrollSuggestionIntoView(activeDescendantId, alignToTop) {
        var labelElem = document.getElementById(activeDescendantId);
        var suggestionElem = labelElem.closest('.oj-listbox-result');
        var listboxElem = labelElem.closest('.oj-listbox-results');
        var suggestionTop = suggestionElem.offsetTop;
        var suggestionHeight = suggestionElem.offsetHeight;
        var listboxTop = listboxElem.scrollTop;
        var listboxHeight = listboxElem.offsetHeight;

        if (suggestionTop < listboxTop || suggestionTop + suggestionHeight > listboxTop + listboxHeight) {
          listboxElem.scrollTop = alignToTop ? suggestionTop : suggestionTop + suggestionHeight - listboxHeight;
        }
      }
    }, {
      key: "_generateId",
      value: function _generateId() {
        return this.uniqueId() + '-' + this._counter++;
      }
    }, {
      key: "_handleDataProviderRefreshEventListener",
      value: function _handleDataProviderRefreshEventListener(event) {
        this.updateState({
          fetchedInitial: false
        });
      }
    }, {
      key: "_fetchData",
      value: function _fetchData(_searchText) {
        this._queryCount += 1;
        var queryNumber = this._queryCount;
        var searchText = _searchText;

        if (searchText === '') {
          searchText = null;
        }

        var maxFetchCount = 12;
        var fetchParams = {
          size: maxFetchCount
        };

        if (searchText) {
          var filterCapability = this._dataProvider.getCapability('filter');

          if (!filterCapability || !filterCapability.textFilter) {
            Logger.error('InputSearch: DataProvider does not support text filter. ' + 'Filtering results in dropdown may not work correctly.');
          }

          fetchParams['filterCriterion'] = oj.FilterFactory.getFilter({
            filterDef: {
              text: searchText
            }
          });
        }

        if (!this._loadingTimer) {
          var timer = TimerUtils.getTimer(this._showIndicatorDelay);
          timer.getPromise().then(function (pending) {
            this._loadingTimer = null;

            if (pending && this._dataProvider && this.state.dropdownOpen) {
              this.updateState({
                loading: true
              });
            }
          }.bind(this));
          this._loadingTimer = timer;
        }

        var fetchedData = [];

        if (!this._resolveFetchBusyState) {
          this._resolveFetchBusyState = this._addBusyState('InputSearch: fetching suggestions');
        }

        var asyncIterator = this._dataProvider.fetchFirst(fetchParams)[Symbol.asyncIterator]();

        var remainingFetchCount = maxFetchCount;

        var processNextFunc = function (result) {
          if (queryNumber !== this._queryCount) {
            return;
          }

          var done = result.done;
          var value = result.value;
          var data = value.data;
          var metadata = value.metadata;

          for (var i = 0; i < data.length; i++) {
            var itemData = data[i];
            var itemMetadata = metadata[i];
            var itemKey = itemMetadata.key;
            fetchedData.push({
              data: itemData,
              metadata: itemMetadata,
              key: itemKey
            });
            remainingFetchCount -= 1;

            if (remainingFetchCount === 0) {
              done = true;
              break;
            }
          }

          if (done) {
            var labelIds = [];

            for (var _i = 0; _i < fetchedData.length; _i++) {
              labelIds.push('oj-inputsearch-result-label-' + this._generateId());
            }

            this.updateState({
              fetchedInitial: true,
              labelIds: labelIds,
              fetchedData: fetchedData
            });

            this._resolveFetching();
          } else {
            asyncIterator.next().then(processNextFunc);
          }
        }.bind(this);

        asyncIterator.next().then(processNextFunc);
      }
    }, {
      key: "_renderDropdownSkeleton",
      value: function _renderDropdownSkeleton() {
        var numItems = 1;
        var resultsWidth = 0;

        if (this._dropdownElem) {
          var items = this._dropdownElem.querySelectorAll('.oj-listbox-result');

          numItems = Math.max(1, items.length);

          if (items.length > 0) {
            var resultsContainer = this._dropdownElem.querySelector('.oj-listbox-results');

            resultsWidth = resultsContainer.offsetWidth;
          }
        }

        var resultStyle = resultsWidth > 0 ? {
          width: resultsWidth + 'px'
        } : null;
        var skeletonItems = [];

        for (var i = 0; i < numItems; i++) {
          skeletonItems.push(ojvcomponentElement.h("li", {
            role: 'presentation',
            class: 'oj-listbox-result',
            style: resultStyle
          }, ojvcomponentElement.h("div", {
            class: 'oj-listbox-result-label oj-listbox-skeleton-line-height oj-animation-skeleton'
          })));
        }

        return ojvcomponentElement.h("ul", {
          role: 'listbox',
          id: this._getListboxId(),
          class: 'oj-listbox-results oj-inputsearch-results'
        }, skeletonItems);
      }
    }, {
      key: "_renderDropdownSuggestions",
      value: function _renderDropdownSuggestions(searchText) {
        var _a;

        var props = this.props;
        var state = this.state;

        if (((_a = state.fetchedData) === null || _a === void 0 ? void 0 : _a.length) > 0) {
          var suggestions = [];

          for (var i = 0; i < state.fetchedData.length; i++) {
            var focused = i === state.focusedSuggestionIndex;

            var formattedText = InputSearch_1._formatItemText(props.suggestionItemText, state.fetchedData[i]);

            var suggestion = ojvcomponentElement.h(InputSearchSuggestion, {
              ref: this._setRenderedSuggestion.bind(this, i),
              labelId: state.labelIds[i],
              focus: focused,
              index: i,
              formattedText: formattedText,
              searchText: searchText,
              suggestionItemContext: state.fetchedData[i],
              suggestionItemTemplate: props.suggestionItemTemplate,
              onOjSuggestionAction: this._handleSuggestionAction
            });
            suggestions.push(suggestion);
          }

          return ojvcomponentElement.h("ul", {
            role: 'listbox',
            id: this._getListboxId(),
            class: 'oj-listbox-results oj-inputsearch-results'
          }, suggestions);
        }

        return null;
      }
    }, {
      key: "_handleSuggestionAction",
      value: function _handleSuggestionAction(detail) {
        this.updateState({
          filterText: detail.text,
          displayValue: detail.text,
          dropdownOpen: false,
          valueSubmitted: true,
          actionDetail: detail.itemContext
        });
      }
    }, {
      key: "_addBusyState",
      value: function _addBusyState(description) {
        var elem = this._rootElem;
        var desc = 'The component identified by "' + elem.id + '" ' + description;
        var busyStateOptions = {
          description: desc
        };
        var busyContext = Context.getContext(elem).getBusyContext();
        return busyContext.addBusyState(busyStateOptions);
      }
    }, {
      key: "_isDataProvider",
      value: function _isDataProvider(suggestions) {
        return (suggestions === null || suggestions === void 0 ? void 0 : suggestions['fetchFirst']) ? true : false;
      }
    }, {
      key: "_wrapDataProviderIfNeeded",
      value: function _wrapDataProviderIfNeeded(suggestions) {
        if (this._isDataProvider(suggestions)) {
          var wrapper = suggestions;

          if (!(wrapper instanceof oj.ListDataProviderView)) {
            wrapper = new oj.ListDataProviderView(wrapper);
          }

          return wrapper;
        }

        return null;
      }
    }, {
      key: "_addDataProviderEventListeners",
      value: function _addDataProviderEventListeners(dataProvider) {
        dataProvider.addEventListener('mutate', this._handleDataProviderRefreshEventListener);
        dataProvider.addEventListener('refresh', this._handleDataProviderRefreshEventListener);
      }
    }, {
      key: "_removeDataProviderEventListeners",
      value: function _removeDataProviderEventListeners(dataProvider) {
        dataProvider.removeEventListener('mutate', this._handleDataProviderRefreshEventListener);
        dataProvider.removeEventListener('refresh', this._handleDataProviderRefreshEventListener);
      }
    }, {
      key: "_resolveFetching",
      value: function _resolveFetching() {
        if (this._loadingTimer) {
          this._loadingTimer.clear();

          this._loadingTimer = null;
        }

        if (this._resolveFetchBusyState) {
          this._resolveFetchBusyState();

          this._resolveFetchBusyState = null;
        }

        if (this.state.loading) {
          this.updateState({
            loading: false
          });
        }
      }
    }, {
      key: "_testChangeValue",
      value: function _testChangeValue(value) {
        var _this3 = this;

        var promise = new Promise(function (resolve) {
          _this3._testPromiseResolve = resolve;
        });
        this.updateState({
          filterText: value,
          displayValue: value,
          dropdownOpen: false,
          valueSubmitted: true,
          actionDetail: null
        });
        return promise;
      }
    }, {
      key: "_testChangeValueByKey",
      value: function _testChangeValueByKey(key) {
        var _this4 = this;

        var promise = new Promise(function (resolve) {
          _this4._testPromiseResolve = resolve;
        });

        var afterUnsuccessfulFetch = function afterUnsuccessfulFetch() {
          if (this._testPromiseResolve) {
            this._testPromiseResolve();

            this._testPromiseResolve = null;
          }

          throw new Error("oj-input-search: No row found in DataProvider for key: ".concat(key));
        };

        this._dataProvider.fetchByKeys({
          keys: new Set([key])
        }).then(function (fetchResults) {
          var item = fetchResults.results.get(key);

          if (item && item.data != null && item.metadata != null) {
            var itemContext = {
              data: item.data,
              metadata: item.metadata,
              key: item.metadata.key
            };

            var formattedText = InputSearch_1._formatItemText(this.props.suggestionItemText, itemContext);

            this.updateState({
              filterText: formattedText,
              displayValue: formattedText,
              dropdownOpen: false,
              valueSubmitted: true,
              actionDetail: itemContext
            });
          } else {
            afterUnsuccessfulFetch();
          }
        }.bind(this), afterUnsuccessfulFetch);

        return promise;
      }
    }], [{
      key: "initStateFromProps",
      value: function initStateFromProps(props, state) {
        return {
          displayValue: props.value,
          filterText: props.value
        };
      }
    }, {
      key: "updateStateFromProps",
      value: function updateStateFromProps(props, state, oldProps) {
        var updatedState = {};

        if (props.value !== oldProps.value && props.value !== state.displayValue) {
          updatedState.displayValue = props.value;
          updatedState.filterText = props.value;
        }

        if (oldProps.suggestions != props.suggestions) {
          updatedState.fetchedInitial = false;
        }

        if (!props.suggestions) {
          updatedState.dropdownOpen = false;
          updatedState.fetchedData = null;
        }

        if (state.dropdownOpen === false || updatedState.dropdownOpen === false) {
          updatedState.lastEventType = null;
          updatedState.showAutocompleteText = false;
        }

        if (!state.showAutocompleteText || updatedState.showAutocompleteText === false) {
          updatedState.autocompleteFloatingText = null;
        }

        return updatedState;
      }
    }, {
      key: "_formatItemText",
      value: function _formatItemText(suggestionItemText, suggestionItemContext) {
        var _a;

        var formatted;

        if (suggestionItemContext === null || suggestionItemContext === void 0 ? void 0 : suggestionItemContext.data) {
          if (typeof suggestionItemText === 'string') {
            if (!((_a = suggestionItemContext.data) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(suggestionItemText))) {
              Logger.error("oj-input-search: No '".concat(suggestionItemText, "' property found in DataProvider with key: ").concat(suggestionItemContext === null || suggestionItemContext === void 0 ? void 0 : suggestionItemContext.key));
            }

            formatted = suggestionItemContext.data[suggestionItemText];
          } else {
            formatted = suggestionItemText(suggestionItemContext);
          }
        }

        return formatted || '';
      }
    }]);

    return InputSearch;
  }(ojvcomponentElement.ElementVComponent);

  exports.InputSearch.metadata = {
    "extension": {
      "_DEFAULTS": Props$1,
      "_ROOT_PROPS_MAP": {
        "aria-label": 1
      },
      "_WRITEBACK_PROPS": ["rawValue", "value"],
      "_READ_ONLY_PROPS": ["rawValue"]
    },
    "properties": {
      "suggestions": {
        "type": "object|null",
        "value": null
      },
      "suggestionItemText": {
        "type": "string | number|function",
        "value": "label"
      },
      "placeholder": {
        "type": "string",
        "value": ""
      },
      "rawValue": {
        "type": "string|null",
        "value": null,
        "readOnly": true,
        "writeback": true
      },
      "value": {
        "type": "string|null",
        "value": null,
        "writeback": true
      }
    },
    "events": {
      "ojValueAction": {
        "bubbles": false
      }
    },
    "slots": {
      "suggestionItemTemplate": {
        "data": {}
      }
    },
    "methods": {
      "focus": {},
      "blur": {},
      "_testChangeValue": {},
      "_testChangeValueByKey": {}
    }
  };

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleMouseenter", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleMouseleave", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleFocusin", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleFocusout", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleCompositionstart", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleCompositionend", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleInput", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleFocus", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleBlur", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleKeydown", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_clickAwayHandler", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleDataProviderRefreshEventListener", null);

  __decorate$1([ojvcomponentElement.listener()], exports.InputSearch.prototype, "_handleSuggestionAction", null);

  exports.InputSearch = InputSearch_1 = __decorate$1([ojvcomponentElement.customElement('oj-input-search')], exports.InputSearch);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())