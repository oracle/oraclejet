(function() {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojdatacollection-common', 'ojs/ojanimation', 'ojs/ojthemeutils', 'ojs/ojvcomponent-element', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojvcollection', 'ojs/ojdomutils'], function (exports, oj, DataCollectionUtils, AnimationUtils, ThemeUtils, ojvcomponentElement, Context, Logger, ojvcollection, DomUtils) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

  var DefaultLayout = /*#__PURE__*/function () {
    function DefaultLayout(dataProvider, fullWidth, gutterWidth, itemWidth, cache) {
      _classCallCheck(this, DefaultLayout);

      this.dataProvider = dataProvider;
      this.fullWidth = fullWidth;
      this.gutterWidth = gutterWidth;
      this.itemWidth = itemWidth;
      this.cache = cache;
      this.columns = 0;
      this.margin = 0;
      this.columnsInfo = [];
      this.bottom = 0;
      this.keys = [];

      if (dataProvider) {
        this.modelEventHandler = this._handleModelEvent.bind(this);
        dataProvider.addEventListener('mutate', this.modelEventHandler);
      }

      if (this.cache == null) {
        this.cache = new Map();
      }
    }

    _createClass(DefaultLayout, [{
      key: "destroy",
      value: function destroy() {
        if (this.dataProvider && this.modelEventHandler) {
          this.dataProvider.removeEventListener('mutate', this.modelEventHandler);
        }
      }
    }, {
      key: "_initializeColumnsInfo",
      value: function _initializeColumnsInfo() {
        this.columns = Math.max(1, Math.floor(this.fullWidth / (this.itemWidth + this.gutterWidth)));
        this.margin = Math.max(this.gutterWidth, (this.fullWidth - this.columns * (this.itemWidth + this.gutterWidth)) / 2);
        this.columnsInfo.length = this.columns;

        for (var i = 0; i < this.columns; i++) {
          this.columnsInfo[i] = 0;
        }
      }
    }, {
      key: "_populatePositions",
      value: function _populatePositions(arr, startIndex, keyFunc, cacheHitFunc, cacheMissFunc, resultFunc) {
        for (var k = 0; k < arr.length; k++) {
          var key = keyFunc(arr[k]);

          if (key == null) {
            continue;
          }

          var index = k + startIndex;
          var colIndex = index % this.columnsInfo.length;
          var itemHeight = undefined;
          var cachedPos = this.cache.get(key);

          if (cachedPos && !isNaN(cachedPos.height)) {
            itemHeight = cachedPos.height;

            if (cachedPos.valid !== false && !isNaN(cachedPos.top) && !isNaN(cachedPos.left)) {
              cacheHitFunc(index, key, colIndex, cachedPos);
              continue;
            }
          } else {
            itemHeight = cacheMissFunc(arr[k]);
          }

          if (isNaN(itemHeight)) {
            return;
          }

          var left = this.margin;
          var val = void 0;

          if (index < this.columnsInfo.length) {
            left += colIndex * (this.itemWidth + this.gutterWidth);
            val = {
              top: this.gutterWidth,
              left: left,
              height: itemHeight,
              valid: true
            };
            this.columnsInfo[colIndex] = itemHeight + this.gutterWidth * 2;
            this.bottom = Math.max(this.bottom, itemHeight);
          } else {
            var minTop = this.columnsInfo.reduce(function (a, b) {
              return Math.min(a, b);
            });
            var minIndex = this.columnsInfo.indexOf(minTop);
            left += minIndex * (this.itemWidth + this.gutterWidth);
            val = {
              top: minTop,
              left: left,
              height: itemHeight,
              valid: true
            };
            this.columnsInfo[minIndex] = this.columnsInfo[minIndex] + itemHeight + this.gutterWidth;
            this.bottom = Math.max(this.bottom, minTop + itemHeight);
          }

          if (val) {
            if (this.keys.indexOf(key) === -1) {
              this.keys.push(key);
            }

            this.cache.set(key, val);

            if (resultFunc) {
              resultFunc(key, val);
            }
          }
        }
      }
    }, {
      key: "setWidth",
      value: function setWidth(width) {
        if (this.fullWidth === width) {
          return;
        }

        this.fullWidth = width;

        if (this.columnsInfo.length > 0) {
          this._initializeColumnsInfo();

          this._invalidatePositions(0);
        }
      }
    }, {
      key: "getPositionForItems",
      value: function getPositionForItems(items, startIndex) {
        var positions = new Map();

        if (this.itemWidth == null && items.length > 0) {
          this.itemWidth = items[0].element.offsetWidth;
        }

        if (this.columnsInfo.length === 0) {
          this._initializeColumnsInfo();
        }

        this._populatePositions(items, startIndex, function (item) {
          return item.key;
        }, function (index, key, colIndex, cachedPos) {
          positions.set(key, cachedPos);
        }, function (item) {
          return item.element.offsetHeight;
        }, function (key, val) {
          positions.set(key, val);
        });

        var start = 0;
        var posSet = new Set();
        var posArray = Array.from(positions.values());

        for (var i = 0; i < posArray.length; i++) {
          var key = posArray[i].left;

          if (!posSet.has(key)) {
            posSet.add(key);
          }

          start = Math.max(start, posArray[i].top);

          if (posSet.size === this.columnsInfo.length) {
            break;
          }
        }

        posSet.clear();
        var end = Number.MAX_VALUE;

        for (var j = posArray.length - 1; j >= 0; j--) {
          var _key = posArray[j].left;

          if (!posSet.has(_key)) {
            posSet.add(_key);
          }

          end = Math.min(end, posArray[j].top + posArray[j].height);

          if (posSet.size === this.columnsInfo.length) {
            break;
          }
        }

        return {
          start: start,
          end: end,
          positions: positions
        };
      }
    }, {
      key: "getItemWidth",
      value: function getItemWidth() {
        return this.itemWidth;
      }
    }, {
      key: "getPositions",
      value: function getPositions() {
        return this.cache;
      }
    }, {
      key: "getPosition",
      value: function getPosition(key) {
        return this.cache.get(key);
      }
    }, {
      key: "getLastItemPosition",
      value: function getLastItemPosition() {
        return this.bottom;
      }
    }, {
      key: "getColumnsInfo",
      value: function getColumnsInfo() {
        var _this = this;

        return this.columnsInfo.map(function (val, index) {
          return {
            top: val,
            left: _this.margin + index * (_this.itemWidth + _this.gutterWidth)
          };
        });
      }
    }, {
      key: "_handleModelEvent",
      value: function _handleModelEvent(event) {
        if (event.type === 'mutate') {
          var detail = event['detail'];

          if (detail.add) {
            var addBeforeKeys = detail.add.addBeforeKeys;

            if (addBeforeKeys != null) {
              var keys = Array.from(detail.add.keys);

              this._insertKeys(addBeforeKeys, keys);
            }
          }

          if (detail.remove) {
            var _keys = Array.from(detail.remove.keys);

            this._removeKeys(_keys);
          }

          if (detail.update) {
            var _keys2 = Array.from(detail.update.keys);

            this._updateKeys(_keys2);
          }
        }
      }
    }, {
      key: "_insertKeys",
      value: function _insertKeys(beforeKeys, keys) {
        var _this2 = this;

        var minIndex = Number.MAX_VALUE;
        beforeKeys.forEach(function (beforeKey, i) {
          var index = _this2.keys.indexOf(beforeKey);

          var key = keys[i];

          if (index > -1) {
            minIndex = Math.min(minIndex, index);

            _this2.keys.splice(index, 0, key);

            _this2.cache.set(key, {
              top: undefined,
              left: undefined,
              height: undefined,
              valid: false
            });
          }
        });

        this._invalidatePositions(minIndex);
      }
    }, {
      key: "_removeKeys",
      value: function _removeKeys(keys) {
        var _this3 = this;

        var minIndex = Number.MAX_VALUE;
        keys.forEach(function (key) {
          _this3.cache.delete(key);

          var index = _this3.keys.indexOf(key);

          if (index > -1) {
            minIndex = Math.min(minIndex, index);

            _this3.keys.splice(index, 1);
          }
        });

        this._invalidatePositions(minIndex);
      }
    }, {
      key: "_updateKeys",
      value: function _updateKeys(keys) {
        var _this4 = this;

        var minIndex = Number.MAX_VALUE;
        keys.forEach(function (key) {
          var index = _this4.keys.indexOf(key);

          if (index > -1) {
            minIndex = Math.min(minIndex, index + 1);

            var position = _this4.getPosition(key);

            if (position) {
              position.top = undefined;
              position.left = undefined;
              position.height = undefined;
              position.valid = false;
            }
          }
        });

        this._invalidatePositions(minIndex);
      }
    }, {
      key: "_invalidatePositions",
      value: function _invalidatePositions(fromIndex) {
        for (var i = fromIndex; i < this.keys.length; i++) {
          var position = this.cache.get(this.keys[i]);

          if (position != null) {
            position.valid = false;
          }
        }

        for (var j = 0; j < this.columns; j++) {
          this.columnsInfo[j] = 0;
        }

        this.recalculatePositions();
      }
    }, {
      key: "recalculatePositions",
      value: function recalculatePositions() {
        var _this5 = this;

        this._populatePositions(this.keys, 0, function (key) {
          return key;
        }, function (index, key, colIndex, cachedPos) {
          var itemHeight = cachedPos.height;

          if (index < _this5.columnsInfo.length) {
            _this5.columnsInfo[colIndex] = itemHeight + _this5.gutterWidth * 2;
            _this5.bottom = Math.max(_this5.bottom, itemHeight);
          } else {
            var minTop = _this5.columnsInfo.reduce(function (a, b) {
              return Math.min(a, b);
            });

            var minIndex = _this5.columnsInfo.indexOf(minTop);

            _this5.columnsInfo[minIndex] = _this5.columnsInfo[minIndex] + itemHeight + _this5.gutterWidth;
            _this5.bottom = Math.max(_this5.bottom, minTop + itemHeight);
          }
        }, function (item) {
          return undefined;
        });
      }
    }]);

    return DefaultLayout;
  }();

  var WaterfallLayoutContentHandler = /*#__PURE__*/function (_ojvcollection$Iterat) {
    _inherits(WaterfallLayoutContentHandler, _ojvcollection$Iterat);

    var _super = _createSuper(WaterfallLayoutContentHandler);

    function WaterfallLayoutContentHandler(root, dataProvider, callback, scrollPolicyOptions, gutterWidth) {
      var _this6;

      _classCallCheck(this, WaterfallLayoutContentHandler);

      _this6 = _super.call(this, root, dataProvider, callback, scrollPolicyOptions);
      _this6.root = root;
      _this6.dataProvider = dataProvider;
      _this6.callback = callback;
      _this6.scrollPolicyOptions = scrollPolicyOptions;
      _this6.gutterWidth = gutterWidth;

      _this6.postRender = function () {
        var itemsRoot = _this6.root.lastElementChild.firstElementChild;

        if (itemsRoot && _this6.adjustPositionsResolveFunc == null) {
          _this6.adjustPositionsResolveFunc = _this6.addBusyState('adjusting item positions');
          var busyContext = Context.getContext(itemsRoot).getBusyContext();
          busyContext.whenReady().then(function () {
            if (_this6.adjustPositionsResolveFunc) {
              _this6.adjustPositionsResolveFunc();

              _this6.adjustPositionsResolveFunc = null;
            }

            if (_this6.callback) {
              var result = _this6._adjustAllItems();

              if (result.done) {
                _this6.newItemsTracker.clear();

                if (_this6.domScroller && !_this6.domScroller.checkViewport()) {
                  return;
                }

                _this6.callback.renderComplete(result.items);

                _this6.initialFetch = false;
              }
            }
          });
        }
      };

      _this6.newItemsTracker = new Set();
      _this6.vnodesCache = new Map();
      return _this6;
    }

    _createClass(WaterfallLayoutContentHandler, [{
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "destroy", this).call(this);

        if (this.layout) {
          this.layout.destroy();
        }
      }
    }, {
      key: "getLayout",
      value: function getLayout() {
        if (this.layout == null) {
          this.layout = new DefaultLayout(this.dataProvider, this.root.clientWidth, this.gutterWidth, null, null);
        }

        return this.layout;
      }
    }, {
      key: "_adjustAllItems",
      value: function _adjustAllItems() {
        var _this7 = this;

        var adjusted = true;
        var items = Array.from(this.root.querySelectorAll('.oj-waterfalllayout-item')).map(function (elem) {
          if (elem.getAttribute('data-oj-positioned') === 'false') {
            adjusted = false;
          }

          return {
            key: _this7.getKey(elem),
            element: elem
          };
        });

        if (adjusted) {
          return {
            done: true,
            items: items
          };
        }

        var startIndex = this.callback.getData().startIndex;
        var positions = this.getLayout().getPositionForItems(items, isNaN(startIndex) ? 0 : startIndex);
        this.callback.setPositions(positions.positions);
        this.callback.setContentHeight(this.getLayout().getLastItemPosition());

        if (this.domScroller) {
          this.domScroller.setViewportRange(positions.start, positions.end);
        }

        return {
          done: false,
          items: items
        };
      }
    }, {
      key: "handleResizeWidth",
      value: function handleResizeWidth(newWidth) {
        this.initialFetch = false;
        this.getLayout().setWidth(newWidth);
      }
    }, {
      key: "fetchSuccess",
      value: function fetchSuccess(result) {
        if (result != null) {
          this.newItemsTracker.clear();
        }

        this.initialFetch = false;

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "fetchSuccess", this).call(this, result);
      }
    }, {
      key: "beforeFetchByOffset",
      value: function beforeFetchByOffset(startIndex, endIndex) {
        if (this.isRenderingViewportOnly()) {
          this.vnodesCache.clear();
        }

        return _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "beforeFetchByOffset", this).call(this, startIndex, endIndex);
      }
    }, {
      key: "addItem",
      value: function addItem(key, index, data, visible) {
        var x = -1;
        var y = -1;
        var position = this.getLayout().getPosition(key);

        if (position != null) {
          if (!isNaN(position.left) && !isNaN(position.top)) {
            x = position.left;
            y = position.top;
          }
        } else {
          this.newItemsTracker.add(key);
        }

        var initialFetch = this.isInitialFetch();
        var currentItem = this.callback.getCurrentItem();

        if (currentItem == null && initialFetch && index == 0) {
          this.callback.setCurrentItem(key);
        }

        var vnodes = this.renderItem(key, index, data);
        this.decorateItem(vnodes, key, x, y, initialFetch, visible);
        return vnodes;
      }
    }, {
      key: "renderItem",
      value: function renderItem(key, index, data) {
        var node = this.vnodesCache.get(key);

        if (node) {
          if (node.index === index) {
            return node.vnodes;
          } else {
            this.vnodesCache.clear();
          }
        }

        var renderer = this.callback.getItemRenderer();
        var vnodes = renderer({
          data: data,
          index: index,
          key: key
        });
        this.vnodesCache.set(key, {
          index: index,
          vnodes: vnodes
        });
        return vnodes;
      }
    }, {
      key: "decorateItem",
      value: function decorateItem(vnodes, key, x, y, initialFetch, visible) {
        var vnode;
        var contentRoot;

        for (var i = 0; i < vnodes.length; i++) {
          vnode = vnodes[i];
          var node = vnode._node;

          if (node.nodeType === 1) {
            contentRoot = node;
            break;
          }
        }

        if (contentRoot != null) {
          contentRoot.key = key;
          contentRoot.setAttribute('role', 'gridcell');
          contentRoot.setAttribute('tabIndex', '-1');
          contentRoot.setAttribute('data-oj-positioned', x != -1 && y != -1 ? 'true' : 'false');
          var styleClasses = this.getItemStyleClass(visible, x, y, this.newItemsTracker.has(key), initialFetch);
          styleClasses.forEach(function (styleClass) {
            contentRoot.classList.add(styleClass);
          });
          var inlineStyle = this.getItemInlineStyle(visible, x, y, initialFetch);
          Object.keys(inlineStyle).forEach(function (prop) {
            contentRoot.style[prop] = inlineStyle[prop];
          });
        }
      }
    }, {
      key: "getItemInlineStyle",
      value: function getItemInlineStyle(visible, x, y, animate) {
        var style = {};

        if (x === -1 || y === -1) {
          style.top = 0;
          style.left = 0;
        } else {
          style.left = x + 'px';
          style.top = y + 'px';
        }

        if (visible && x != -1 && y != -1 && !animate) {
          style.visibility = 'visible';
        }

        return style;
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass(visible, x, y, isNew, animate) {
        var styleClass = [];

        if (visible) {
          styleClass.push('oj-waterfalllayout-item');

          if (x != -1 && y != -1 && !animate && isNew) {
            styleClass.push('oj-waterfalllayout-new-item');
          }
        }

        return styleClass;
      }
    }, {
      key: "renderSkeletonsForLoadMore",
      value: function renderSkeletonsForLoadMore() {
        var layout = this.getLayout();
        var columnsInfo = layout.getColumnsInfo();
        var itemWidth = layout.getItemWidth();
        var skeletons = [];
        var maxTop = Math.max.apply(Math, _toConsumableArray(columnsInfo.map(function (column) {
          return column.top;
        })));

        if (maxTop > 0) {
          var endPos = maxTop + 100;
          this.callback.setContentHeight(endPos);
          var positions = columnsInfo.map(function (columnInfo) {
            return {
              left: columnInfo.left,
              top: columnInfo.top,
              height: endPos - columnInfo.top,
              width: itemWidth
            };
          });
          skeletons = this.callback.renderSkeletons(positions);
        }

        return skeletons;
      }
    }, {
      key: "handleCurrentRangeItemUpdated",
      value: function handleCurrentRangeItemUpdated(key) {
        var position = this.getLayout().getPosition(key);

        if (position) {
          position.top = undefined;
          position.left = undefined;
        }

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "handleCurrentRangeItemUpdated", this).call(this, key);
      }
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {
        var _this8 = this;

        detail.keys.forEach(function (key) {
          _this8.vnodesCache.delete(key);
        });

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {
        var _this9 = this;

        detail.keys.forEach(function (key) {
          _this9.vnodesCache.delete(key);
        });

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "handleItemsRemoved", this).call(this, detail);
      }
    }, {
      key: "handleModelRefresh",
      value: function handleModelRefresh() {
        this.vnodesCache.clear();

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "handleModelRefresh", this).call(this);
      }
    }, {
      key: "_log",
      value: function _log(msg) {
        Logger.info('[WaterfallLayoutContentHandler]=> ' + msg);
      }
    }]);

    return WaterfallLayoutContentHandler;
  }(ojvcollection.IteratingDataProviderContentHandler);

  var __decorate = null && null.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var WaterfallLayout_1;

  var Props = function Props() {
    _classCallCheck(this, Props);

    this.data = null;
    this.scrollPolicy = 'loadMoreOnScroll';
    this.scrollPolicyOptions = {
      fetchSize: 25,
      maxCount: 500,
      scroller: null
    };
    this.scrollPosition = {
      y: 0
    };
  };

  exports.WaterfallLayout = WaterfallLayout_1 = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(WaterfallLayout, _ojvcomponentElement$);

    var _super2 = _createSuper(WaterfallLayout);

    function WaterfallLayout(props) {
      var _this10;

      _classCallCheck(this, WaterfallLayout);

      _this10 = _super2.call(this, props);
      _this10.restoreFocus = false;
      _this10.actionableMode = false;
      _this10.renderCompleted = false;
      _this10.ticking = false;

      _this10.setRootElement = function (element) {
        _this10.root = element;
      };

      _this10.state = {
        renderedData: null,
        positions: null,
        skeletonPositions: null,
        width: 0,
        height: 0,
        contentHeight: 0
      };
      return _this10;
    }

    _createClass(WaterfallLayout, [{
      key: "_handleFocusIn",
      value: function _handleFocusIn(event) {
        if (this.currentItem) {
          this.focusInHandler(this.currentItem);
        }
      }
    }, {
      key: "_handleFocusOut",
      value: function _handleFocusOut(event) {
        if (this.currentItem) {
          this.focusOutHandler(this.currentItem);
        }
      }
    }, {
      key: "_handleClick",
      value: function _handleClick(event) {
        this._handleTouchOrClickEvent(event);
      }
    }, {
      key: "_handleKeyDown",
      value: function _handleKeyDown(event) {
        if (this.currentItem) {
          var next;

          switch (event.key) {
            case 'ArrowLeft':
            case 'Left':
              {
                next = this.currentItem.previousElementSibling;
                break;
              }

            case 'ArrowRight':
            case 'Right':
              {
                next = this.currentItem.nextElementSibling;
                break;
              }

            case 'F2':
              {
                if (this.actionableMode === false) {
                  this._enterActionableMode();
                }

                break;
              }

            case 'Escape':
            case 'Esc':
              {
                if (this.actionableMode === true) {
                  this._exitActionableMode();
                }

                break;
              }

            case 'Tab':
              {
                if (this.actionableMode === true && this.currentItem) {
                  if (event.shiftKey) {
                    DataCollectionUtils.handleActionablePrevTab(event, this.currentItem);
                  } else {
                    DataCollectionUtils.handleActionableTab(event, this.currentItem);
                  }
                }

                break;
              }
          }

          if (this.actionableMode === false && next != null && next.classList.contains(this.getItemStyleClass())) {
            this._updateCurrentItem(next);
          }
        }
      }
    }, {
      key: "_touchStartHandler",
      value: function _touchStartHandler(event) {
        this._handleTouchOrClickEvent(event);
      }
    }, {
      key: "render",
      value: function render() {
        var content;

        if (this.contentHandler == null) {
          content = this._renderInitialSkeletons(null);
        } else {
          var data = this.getData();
          var positions = this.state.skeletonPositions;

          if (data) {
            if (positions != null && this.contentHandler.isInitialFetch()) {
              content = this._renderInitialSkeletons(positions.positions);
            } else {
              content = this.contentHandler.render();

              if (this.currentItem && this.currentItem.contains(document.activeElement)) {
                this.restoreFocus = true;
              }
            }
          } else if (positions != null) {
            content = this._renderInitialSkeletons(positions.positions);
          }
        }

        return ojvcomponentElement.h("oj-waterfall-layout", {
          ref: this.setRootElement,
          style: this._getRootElementStyle()
        }, ojvcomponentElement.h("div", {
          onClick: this._handleClick,
          onKeydown: this._handleKeyDown,
          onTouchstart: this._touchStartHandler,
          onFocusin: this._handleFocusIn,
          onFocusout: this._handleFocusOut,
          role: 'grid',
          "aria-label": this.props['aria-label'],
          "aria-labelledby": this.props['aria-labelledby']
        }, ojvcomponentElement.h("div", {
          role: 'row',
          style: this._getContentDivStyle(),
          "data-oj-context": true
        }, content)));
      }
    }, {
      key: "_getScrollPolicyOptions",
      value: function _getScrollPolicyOptions() {
        return {
          fetchSize: this.props.scrollPolicyOptions.fetchSize,
          maxCount: this.props.scrollPolicyOptions.maxCount,
          scroller: this._getScroller()
        };
      }
    }, {
      key: "mounted",
      value: function mounted() {
        var _this11 = this;

        var root = this.getRootElement();

        if (this.props.data) {
          this.contentHandler = new WaterfallLayoutContentHandler(root, this.props.data, this, this._getScrollPolicyOptions(), WaterfallLayout_1.gutterWidth);
          this.contentHandler.fetchRows();
        }

        var rootWidth = root.clientWidth;
        var rootHeight = root.clientHeight;
        this.updateState({
          width: rootWidth,
          height: rootHeight
        });
        var skeleton = root.querySelector('.oj-waterfalllayout-skeleton');

        if (skeleton) {
          this.skeletonWidth = skeleton.clientWidth;

          if (this.contentHandler) {
            this._delayShowSkeletons();
          }
        }

        if (window['ResizeObserver']) {
          var resizeObserver = new window['ResizeObserver'](function (entries) {
            entries.forEach(function (entry) {
              if (entry.target === root && entry.contentRect) {
                var currWidth = _this11.state.width;
                var newWidth = Math.round(entry.contentRect.width);

                if (Math.abs(newWidth - currWidth) > WaterfallLayout_1.minResizeWidthThreshold) {
                  _this11.updateState({
                    width: newWidth
                  });

                  if (_this11.getSkeletonPositions() != null) {
                    _this11._updatePositionsForSkeletons(newWidth);
                  } else if (_this11.getPositions() != null && _this11.contentHandler) {
                    _this11.contentHandler.getLayout().setWidth(newWidth);

                    if (_this11.renderCompleted) {
                      _this11.contentHandler.handleResizeWidth(newWidth);
                    }
                  }
                }

                var currHeight = _this11.state.height;
                var newHeight = Math.round(entry.contentRect.height);

                if (Math.abs(newHeight - currHeight) > 1 && newHeight !== _this11.state.contentHeight) {
                  _this11.updateState({
                    height: newHeight
                  });
                }
              }
            });
          });
          resizeObserver.observe(root);
          this.resizeObserver = resizeObserver;
        }

        DomUtils.makeFocusable({
          applyHighlight: true,
          setupHandlers: function setupHandlers(focusInHandler, focusOutHandler) {
            var noJQHandlers = DataCollectionUtils.getNoJQFocusHandlers(focusInHandler, focusOutHandler);
            _this11.focusInHandler = noJQHandlers.focusIn;
            _this11.focusOutHandler = noJQHandlers.focusOut;
          }
        });

        this._getScroller().addEventListener('scroll', this.scrollListener);
      }
    }, {
      key: "_handleNewData",
      value: function _handleNewData() {
        this.updateState({
          renderedData: null,
          positions: null
        });

        if (this.contentHandler) {
          this.contentHandler.destroy();
        }

        this.currentKey = null;
        this.currentItem = null;
        var root = this.getRootElement();
        this.contentHandler = new WaterfallLayoutContentHandler(root, this.props.data, this, this._getScrollPolicyOptions(), WaterfallLayout_1.gutterWidth);
        this.contentHandler.fetchRows();

        this._delayShowSkeletons();
      }
    }, {
      key: "updated",
      value: function updated(oldProps, oldState) {
        var _this12 = this;

        var data = this.getData();

        if (data != null) {
          if (oldState.renderedData == null) {
            var skeletons = this._findSkeletons();

            if (skeletons.length > 0) {
              this._applySkeletonExitAnimation(skeletons).then(function () {
                _this12.updateState({
                  skeletonPositions: null
                });
              });
            } else {
              this.updateState({
                skeletonPositions: null
              });
              this.contentHandler.postRender();
            }
          } else if (this.props.data != oldProps.data) {
            var resolveFunc = this.addBusyState('apply exit animations on existing items');

            this._applyExitAnimation().then(function () {
              resolveFunc();

              _this12._handleNewData();
            });
          } else if (oldState.positions == null && this.state.positions != null) {
            this._applyEntranceAnimation();

            if (!this.renderCompleted && this.contentHandler) {
              this.contentHandler.postRender();
            }
          } else if (oldState.positions != null && this.state.positions != null && oldState.positions.size < this.state.positions.size) {
            this._applyLoadMoreEntranceAnimation();

            if (!this.renderCompleted && this.contentHandler) {
              this.contentHandler.postRender();
            }
          } else if (this.contentHandler) {
            this.contentHandler.postRender();
          }

          if (!oj.Object.compareValues(this.props.scrollPosition, oldProps.scrollPosition) && !oj.Object.compareValues(this.props.scrollPosition, this.lastInternalScrollPositionUpdate)) {
            this._syncScrollTopWithProps();
          }
        } else {
          if (this.props.data && oldProps.data == null) {
            this._handleNewData();
          }
        }
      }
    }, {
      key: "unmounted",
      value: function unmounted() {
        if (this.contentHandler) {
          this.contentHandler.destroy();
        }

        this.contentHandler = null;

        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
        }

        this.resizeObserver = null;

        if (this.scrollListener && this._getScroller() != null) {
          this._getScroller().removeEventListener('scroll', this.scrollListener);
        }
      }
    }, {
      key: "_delayShowSkeletons",
      value: function _delayShowSkeletons() {
        var _this13 = this;

        window.setTimeout(function () {
          var data = _this13.getData();

          if (data == null) {
            _this13._updatePositionsForSkeletons(_this13.state.width);
          }
        }, this._getShowSkeletonsDelay());
      }
    }, {
      key: "_updatePositionsForSkeletons",
      value: function _updatePositionsForSkeletons(width) {
        var positions = this._getPositionsForSkeletons(50, width, this.skeletonWidth);

        this.updateState({
          skeletonPositions: positions
        });
      }
    }, {
      key: "_getOptionDefaults",
      value: function _getOptionDefaults() {
        if (this.defaultOptions == null) {
          this.defaultOptions = ThemeUtils.parseJSONFromFontFamily('oj-waterfalllayout-option-defaults');
        }

        return this.defaultOptions;
      }
    }, {
      key: "_getShowSkeletonsDelay",
      value: function _getShowSkeletonsDelay() {
        var defaultOptions = this._getOptionDefaults();

        var delay = parseInt(defaultOptions.showIndicatorDelay, 10);
        return isNaN(delay) ? 0 : delay;
      }
    }, {
      key: "addBusyState",
      value: function addBusyState(description) {
        var root = this.getRootElement();
        var componentBusyContext = Context.getContext(root).getBusyContext();
        return componentBusyContext.addBusyState({
          description: description
        });
      }
    }, {
      key: "_isReady",
      value: function _isReady() {
        var root = this.getRootElement();
        var componentBusyContext = Context.getContext(root).getBusyContext();
        return componentBusyContext.isReady();
      }
    }, {
      key: "_findSkeletons",
      value: function _findSkeletons() {
        var skeletons = this.getRootElement().querySelectorAll('.oj-waterfalllayout-skeleton');
        return skeletons.length > 1 ? skeletons : [];
      }
    }, {
      key: "getRootElement",
      value: function getRootElement() {
        return this.root;
      }
    }, {
      key: "isAvailable",
      value: function isAvailable() {
        return this.contentHandler != null;
      }
    }, {
      key: "getCurrentItem",
      value: function getCurrentItem() {
        return this.currentKey;
      }
    }, {
      key: "setCurrentItem",
      value: function setCurrentItem(item) {
        this.currentKey = item;
      }
    }, {
      key: "getData",
      value: function getData() {
        return this.state.renderedData;
      }
    }, {
      key: "setData",
      value: function setData(data) {
        if (data != null) {
          this.renderCompleted = false;
        }

        this.updateState({
          renderedData: data
        });

        var skeletons = this._findSkeletons();

        if (data == null || skeletons.length === 0) {
          this.updateState({
            skeletonPositions: null
          });
        }
      }
    }, {
      key: "updateData",
      value: function updateData(updater) {
        this.updateState(function (state) {
          var currentData = state.renderedData;
          var returnVal = updater(currentData);
          return returnVal;
        }.bind(this));
      }
    }, {
      key: "getSkeletonPositions",
      value: function getSkeletonPositions() {
        return this.state.skeletonPositions;
      }
    }, {
      key: "setSkeletonPositions",
      value: function setSkeletonPositions(positions) {
        this.updateState({
          skeletonPositions: positions
        });
      }
    }, {
      key: "getPositions",
      value: function getPositions() {
        return this.state.positions;
      }
    }, {
      key: "setPositions",
      value: function setPositions(positions) {
        this.updateState({
          positions: positions
        });
      }
    }, {
      key: "setContentHeight",
      value: function setContentHeight(height) {
        if (this.props.scrollPolicyOptions.scroller != null) {
          this.updateState({
            contentHeight: height
          });
        }
      }
    }, {
      key: "getItemRenderer",
      value: function getItemRenderer() {
        return this.props.itemTemplate;
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass() {
        return 'oj-waterfalllayout-item';
      }
    }, {
      key: "getExpanded",
      value: function getExpanded() {}
    }, {
      key: "_applySkeletonExitAnimation",
      value: function _applySkeletonExitAnimation(skeletons) {
        var resolveFunc = this.addBusyState('apply skeleton exit animations');
        return new Promise(function (resolve, reject) {
          var promise;
          skeletons.forEach(function (skeleton) {
            promise = AnimationUtils.fadeOut(skeleton);
          });

          if (promise) {
            promise.then(function () {
              resolveFunc();
              resolve(true);
            });
          }
        });
      }
    }, {
      key: "_applyEntranceAnimation",
      value: function _applyEntranceAnimation() {
        var root = this.getRootElement();
        var items = root.querySelectorAll('.' + this.getItemStyleClass());

        if (items.length === 0) {
          return Promise.resolve(true);
        }

        var promises = [];
        items.forEach(function (item, index) {
          var elem = item;
          elem.style.visibility = 'visible';
          var currentTransition = elem.style.transition;
          elem.style.transition = 'none';
          var delay = Math.min(1000, index * 50) + 'ms';
          var duration = '300ms';
          var promise = AnimationUtils.slideIn(item, {
            offsetY: '300px',
            delay: delay,
            duration: duration
          });
          promises.push(promise);
          promises.push(AnimationUtils.fadeIn(item, {
            delay: delay,
            duration: duration
          }));
          promise.then(function () {
            elem.style.transition = currentTransition;
          });
        });
        return Promise.all(promises);
      }
    }, {
      key: "_applyExitAnimation",
      value: function _applyExitAnimation() {
        var root = this.getRootElement();
        var items = root.querySelectorAll('.' + this.getItemStyleClass());

        if (items.length === 0) {
          return Promise.resolve(true);
        }

        var promises = [];
        items.forEach(function (item) {
          var duration = '300ms';
          promises.push(AnimationUtils.slideOut(item, {
            offsetY: '300px',
            duration: duration,
            persist: 'all'
          }));
          promises.push(AnimationUtils.fadeOut(item, {
            duration: duration,
            persist: 'all'
          }));
        });
        return Promise.all(promises);
      }
    }, {
      key: "_applyLoadMoreEntranceAnimation",
      value: function _applyLoadMoreEntranceAnimation() {
        var root = this.getRootElement();
        var items = root.querySelectorAll('.oj-waterfalllayout-new-item');

        if (items.length === 0) {
          return Promise.resolve(true);
        }

        var promises = [];
        items.forEach(function (item) {
          item.classList.remove('oj-waterfalllayout-new-item');
          promises.push(AnimationUtils.fadeIn(item, {
            duration: '150ms'
          }));
        });
        return Promise.all(promises);
      }
    }, {
      key: "scrollListener",
      value: function scrollListener(event) {
        var _this14 = this;

        if (!this.ticking) {
          window.requestAnimationFrame(function () {
            if (_this14.isAvailable()) {
              _this14._updateScrollPosition();
            }

            _this14.ticking = false;
          });
          this.ticking = true;
        }
      }
    }, {
      key: "_updateScrollPosition",
      value: function _updateScrollPosition() {
        var _a, _b;

        var scrollTop = this._getScroller().scrollTop;

        var iterator = this.contentHandler.getLayout().getPositions().entries();
        var result = iterator.next();
        var key;
        var maxTop = 0;

        while (!result.done) {
          var entry = result.value;
          result = iterator.next();
          var top = entry[1].top;

          if (top > scrollTop) {
            if (key === undefined) {
              key = entry[0];
            }

            break;
          } else if (top > maxTop) {
            key = entry[0];
            maxTop = top;
          }
        }

        var offsetY = Math.abs(scrollTop - maxTop);
        var scrollPosition = {
          y: scrollTop,
          key: key,
          offsetY: offsetY
        };
        this.lastInternalScrollPositionUpdate = scrollPosition;
        (_b = (_a = this.props).onScrollPositionChanged) === null || _b === void 0 ? void 0 : _b.call(_a, scrollPosition);
      }
    }, {
      key: "_syncScrollTopWithProps",
      value: function _syncScrollTopWithProps() {
        var scrollPosition = this.props.scrollPosition;
        var scrollTop;
        var key = scrollPosition.key;

        if (key) {
          var pos = this.contentHandler.getLayout().getPosition(key);

          if (pos != null) {
            scrollTop = pos.top;
          } else {
            return;
          }

          var offsetY = scrollPosition.offsetY;

          if (!isNaN(offsetY)) {
            scrollTop = scrollTop + offsetY;
          }
        } else {
          var y = scrollPosition.y;

          if (!isNaN(y)) {
            scrollTop = y;
          } else {
            return;
          }
        }

        if (scrollTop > this._getScroller().scrollHeight) {
          return;
        }

        this._getScroller().scrollTop = scrollTop;
      }
    }, {
      key: "_handleTouchOrClickEvent",
      value: function _handleTouchOrClickEvent(event) {
        var target = event.target;
        var item = target.closest('.' + this.getItemStyleClass());

        this._updateCurrentItem(item);
      }
    }, {
      key: "_resetFocus",
      value: function _resetFocus(elem) {
        this.focusOutHandler(elem);
        elem.tabIndex = -1;
      }
    }, {
      key: "_setFocus",
      value: function _setFocus(elem, focus) {
        elem.tabIndex = 0;

        if (focus) {
          this.focusInHandler(elem);
          elem.focus();
        }
      }
    }, {
      key: "_updateCurrentItem",
      value: function _updateCurrentItem(item) {
        if (this.currentItem) {
          var currentElem = this.currentItem;

          this._resetFocus(currentElem);
        }

        this.currentItem = item;
        var elem = item;
        this.currentKey = elem.key;

        this._setFocus(elem, true);

        this._scrollToVisible(elem);
      }
    }, {
      key: "_scrollToVisible",
      value: function _scrollToVisible(elem) {
        var top = elem.offsetTop;
        var height = elem.offsetHeight;

        var container = this._getScroller();

        var containerScrollTop = container.scrollTop;
        var containerHeight = container.offsetHeight;

        if (top >= containerScrollTop && top + height <= containerScrollTop + containerHeight) {
          return;
        }

        var scrollTop = Math.max(0, Math.min(top, Math.abs(top + height - containerHeight)));
        container.scrollTop = scrollTop;
      }
    }, {
      key: "_getScroller",
      value: function _getScroller() {
        var scroller = this.props.scrollPolicyOptions.scroller;

        if (typeof scroller === 'string') {
          scroller = document.querySelector(scroller);
        }

        return scroller != null ? scroller : this.getRootElement();
      }
    }, {
      key: "_getContentDivStyle",
      value: function _getContentDivStyle() {
        return {
          height: this.state.contentHeight + 'px'
        };
      }
    }, {
      key: "_getRootElementStyle",
      value: function _getRootElementStyle() {
        return this.props.scrollPolicyOptions.scroller != null ? {
          overflow: 'hidden'
        } : null;
      }
    }, {
      key: "_renderInitialSkeletons",
      value: function _renderInitialSkeletons(positions) {
        var scroller = this._getScroller();

        if (scroller != null) {
          scroller.scrollTop = 0;
        }

        if (positions == null) {
          return this._renderSkeleton(null);
        } else {
          var count = positions.size;
          var skeletons = [];

          for (var i = 0; i < count; i++) {
            var position = positions.get(i);
            skeletons.push(this._renderSkeleton(position));
          }

          return ojvcomponentElement.h("div", {
            role: 'row'
          }, skeletons);
        }
      }
    }, {
      key: "_getPositionsForSkeletons",
      value: function _getPositionsForSkeletons(count, rootWidth, skeletonWidth) {
        var items = [];
        var cache = new Map();

        for (var i = 0; i < count; i++) {
          var height = 150 + i % 3 * 100;
          cache.set(i, {
            height: height
          });
          items.push({
            key: i
          });
        }

        var layout = new DefaultLayout(null, rootWidth, WaterfallLayout_1.gutterWidth, skeletonWidth, cache);
        var positions = layout.getPositionForItems(items, 0);
        return positions;
      }
    }, {
      key: "_isInViewport",
      value: function _isInViewport(item) {
        var itemElem = item;
        var top = parseInt(itemElem.style.top, 10);

        var scrollTop = this._getScroller().scrollTop;

        return top >= scrollTop && top <= scrollTop + this.state.height;
      }
    }, {
      key: "_restoreCurrentItem",
      value: function _restoreCurrentItem(items) {
        if (this.currentKey != null) {
          for (var i = 0; i < items.length; i++) {
            if (oj.KeyUtils.equals(items[i].key, this.currentKey)) {
              var elem = items[i].element;

              if (this.restoreFocus && this._isInViewport(elem)) {
                this._updateCurrentItem(elem);
              } else {
                this._setFocus(elem, false);

                this.currentItem = elem;
              }

              break;
            }
          }
        }

        this.restoreFocus = false;
      }
    }, {
      key: "_disableAllTabbableElements",
      value: function _disableAllTabbableElements(items) {
        items.forEach(function (item) {
          DataCollectionUtils.disableAllFocusableElements(item.element, true);
        });
      }
    }, {
      key: "_enterActionableMode",
      value: function _enterActionableMode() {
        this.actionableMode = true;

        if (this.currentItem) {
          var elems = DataCollectionUtils.enableAllFocusableElements(this.currentItem, true);

          if (elems && elems.length > 0) {
            elems[0].focus();
          }
        }
      }
    }, {
      key: "_exitActionableMode",
      value: function _exitActionableMode() {
        this.actionableMode = false;

        if (this.currentItem) {
          DataCollectionUtils.disableAllFocusableElements(this.currentItem, true);

          this._setFocus(this.currentItem, true);
        }
      }
    }, {
      key: "renderComplete",
      value: function renderComplete(items) {
        this.renderCompleted = true;
        this.actionableMode = false;

        this._disableAllTabbableElements(items);

        this._restoreCurrentItem(items);
      }
    }, {
      key: "renderSkeletons",
      value: function renderSkeletons(positions) {
        var _this15 = this;

        var skeletons = [];
        positions.forEach(function (position) {
          skeletons.push(_this15._renderSkeleton(position));
        });
        return skeletons;
      }
    }, {
      key: "_renderSkeleton",
      value: function _renderSkeleton(position) {
        var style;

        if (position == null) {
          style = {
            visibility: 'hidden'
          };
        } else {
          style = {
            top: position.top + 'px',
            left: position.left + 'px',
            height: position.height + 'px'
          };

          if (!isNaN(position.width)) {
            style.width = position.width + 'px';
          }
        }

        return ojvcomponentElement.h("div", {
          class: 'oj-waterfalllayout-skeleton',
          style: style
        }, ojvcomponentElement.h("div", {
          class: 'oj-waterfalllayout-skeleton-content oj-animation-skeleton'
        }));
      }
    }]);

    return WaterfallLayout;
  }(ojvcomponentElement.ElementVComponent);

  exports.WaterfallLayout.gutterWidth = 20;
  exports.WaterfallLayout.minResizeWidthThreshold = 10;
  exports.WaterfallLayout.metadata = {
    "extension": {
      "_DEFAULTS": Props,
      "_ROOT_PROPS_MAP": {
        "aria-label": 1,
        "aria-labelledby": 1
      },
      "_WRITEBACK_PROPS": ["scrollPosition"],
      "_READ_ONLY_PROPS": []
    },
    "properties": {
      "data": {
        "type": "object|null",
        "value": null
      },
      "scrollPolicy": {
        "type": "string",
        "enumValues": ["loadAll", "loadMoreOnScroll"],
        "value": "loadMoreOnScroll"
      },
      "scrollPolicyOptions": {
        "type": "object",
        "properties": {
          "fetchSize": {
            "type": "number",
            "value": 25
          },
          "maxCount": {
            "type": "number",
            "value": 500
          },
          "scroller": {
            "type": "Element|string|null",
            "value": null
          }
        }
      },
      "scrollPosition": {
        "type": "object",
        "properties": {
          "y": {
            "type": "number",
            "value": 0
          },
          "key": {
            "type": "any"
          },
          "offsetY": {
            "type": "number"
          }
        },
        "writeback": true
      }
    },
    "slots": {
      "itemTemplate": {
        "data": {}
      }
    }
  };

  __decorate([ojvcomponentElement.listener()], exports.WaterfallLayout.prototype, "_handleFocusIn", null);

  __decorate([ojvcomponentElement.listener()], exports.WaterfallLayout.prototype, "_handleFocusOut", null);

  __decorate([ojvcomponentElement.listener()], exports.WaterfallLayout.prototype, "_handleClick", null);

  __decorate([ojvcomponentElement.listener()], exports.WaterfallLayout.prototype, "_handleKeyDown", null);

  __decorate([ojvcomponentElement.listener({
    passive: true
  })], exports.WaterfallLayout.prototype, "_touchStartHandler", null);

  __decorate([ojvcomponentElement.listener()], exports.WaterfallLayout.prototype, "scrollListener", null);

  exports.WaterfallLayout = WaterfallLayout_1 = __decorate([ojvcomponentElement.customElement('oj-waterfall-layout')], exports.WaterfallLayout);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())