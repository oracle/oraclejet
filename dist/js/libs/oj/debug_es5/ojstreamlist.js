(function() {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojvcomponent-element', 'ojs/ojdatacollection-common', 'ojs/ojvcollection', 'ojs/ojcore-base', 'ojs/ojkeyset', 'ojs/ojtreedataprovider', 'ojs/ojanimation', 'ojs/ojcontext', 'ojs/ojthemeutils', 'ojs/ojdomutils'], function (exports, ojvcomponentElement, DataCollectionUtils, ojvcollection, oj, ojkeyset, ojtreedataprovider, AnimationUtils, Context, ThemeUtils, DomUtils) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

  var StreamListContentHandler = /*#__PURE__*/function (_ojvcollection$Iterat) {
    _inherits(StreamListContentHandler, _ojvcollection$Iterat);

    var _super = _createSuper(StreamListContentHandler);

    function StreamListContentHandler(root, dataProvider, callback, scrollPolicyOptions) {
      var _this;

      _classCallCheck(this, StreamListContentHandler);

      _this = _super.call(this, root, dataProvider, callback, scrollPolicyOptions);
      _this.root = root;
      _this.dataProvider = dataProvider;
      _this.callback = callback;
      _this.scrollPolicyOptions = scrollPolicyOptions;

      _this.postRender = function () {
        _this.vnodesCache = _this.newVnodesCache;
        _this.newVnodesCache = new Map();

        if (_this.callback) {
          if (_this.domScroller) {
            var itemsRoot = _this.root.lastElementChild;
            var items = itemsRoot.querySelectorAll('.oj-stream-list-item');
            var rootOffsetTop = _this.root.offsetTop;
            var start = items[0].offsetTop - rootOffsetTop;
            var end = items[items.length - 1].offsetTop + items[items.length - 1].offsetHeight - rootOffsetTop;

            _this.domScroller.setViewportRange(start, end);
          }

          if (_this.domScroller && !_this.domScroller.checkViewport()) {
            return;
          }
        }
      };

      _this.newItemsTracker = new Set();
      _this.vnodesCache = new Map();
      _this.newVnodesCache = new Map();
      return _this;
    }

    _createClass(StreamListContentHandler, [{
      key: "fetchSuccess",
      value: function fetchSuccess(result) {
        if (result != null) {
          this.newItemsTracker.clear();
        }

        _get(_getPrototypeOf(StreamListContentHandler.prototype), "fetchSuccess", this).call(this, result);
      }
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {
        detail.keys.forEach(function (key) {
          this.vnodesCache.delete(key);
        }.bind(this));

        _get(_getPrototypeOf(StreamListContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {
        detail.keys.forEach(function (key) {
          this.vnodesCache.delete(key);
        }.bind(this));

        _get(_getPrototypeOf(StreamListContentHandler.prototype), "handleItemsRemoved", this).call(this, detail);
      }
    }, {
      key: "handleModelRefresh",
      value: function handleModelRefresh() {
        this.vnodesCache.clear();

        _get(_getPrototypeOf(StreamListContentHandler.prototype), "handleModelRefresh", this).call(this);
      }
    }, {
      key: "addItem",
      value: function addItem(key, index, data, visible) {
        var initialFetch = this.isInitialFetch();
        var currentItem = this.callback.getCurrentItem();

        if (currentItem == null && initialFetch && index == 0) {
          this.callback.setCurrentItem(key);
        }

        var vnodes = this.renderItem(key, index, data);
        this.decorateItem(vnodes, key, index, initialFetch, visible);
        return vnodes;
      }
    }, {
      key: "renderItem",
      value: function renderItem(key, index, data) {
        var node = this.vnodesCache.get(key);

        if (node) {
          this.newVnodesCache.set(key, {
            vnodes: node.vnodes
          });
          return node.vnodes;
        }

        var renderer = this.callback.getItemRenderer();
        var vnodes = renderer({
          data: data,
          key: key
        });
        var vnode;

        for (var i = 0; i < vnodes.length; i++) {
          var _node = vnodes[i]._node;

          if (_node.nodeType === 1) {
            vnode = vnodes[i];
            break;
          }
        }

        var prunedVnodes = [vnode];
        this.newVnodesCache.set(key, {
          vnodes: prunedVnodes
        });
        return prunedVnodes;
      }
    }, {
      key: "decorateItem",
      value: function decorateItem(vnodes, key, index, initialFetch, visible) {
        var vnode = vnodes[0];
        var contentRoot = vnode._node;

        if (contentRoot != null) {
          vnode.key = key;
          contentRoot.key = key;
          contentRoot.setAttribute('role', 'listitem');
          contentRoot.setAttribute('tabIndex', '-1');
          var styleClasses = this.getItemStyleClass(visible, this.newItemsTracker.has(key), initialFetch);
          styleClasses.forEach(function (styleClass) {
            contentRoot.classList.add(styleClass);
          });
        }
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass(visible, isNew, animate) {
        var styleClass = [];
        styleClass.push('oj-stream-list-item');

        if (animate) {}

        return styleClass;
      }
    }, {
      key: "renderSkeletonsForLoadMore",
      value: function renderSkeletonsForLoadMore() {
        return this.callback.renderSkeletons(3);
      }
    }]);

    return StreamListContentHandler;
  }(ojvcollection.IteratingDataProviderContentHandler);

  var StreamListTreeContentHandler = /*#__PURE__*/function (_ojvcollection$Iterat2) {
    _inherits(StreamListTreeContentHandler, _ojvcollection$Iterat2);

    var _super2 = _createSuper(StreamListTreeContentHandler);

    function StreamListTreeContentHandler(root, dataProvider, callback, scrollPolicyOptions) {
      var _this2;

      _classCallCheck(this, StreamListTreeContentHandler);

      _this2 = _super2.call(this, root, dataProvider, callback, scrollPolicyOptions);
      _this2.root = root;
      _this2.dataProvider = dataProvider;
      _this2.callback = callback;
      _this2.scrollPolicyOptions = scrollPolicyOptions;

      _this2.postRender = function () {
        _this2.vnodesCache = _this2.newVnodesCache;
        _this2.newVnodesCache = new Map();
        var itemsRoot = _this2.root.lastElementChild;

        if (itemsRoot) {
          _this2.checkViewport();
        }
      };

      _this2.getLoadMoreCount = function () {
        return 3;
      };

      _this2.newItemsTracker = new Set();
      _this2.vnodesCache = new Map();
      _this2.newVnodesCache = new Map();
      return _this2;
    }

    _createClass(StreamListTreeContentHandler, [{
      key: "handleFetchSuccess",
      value: function handleFetchSuccess(result) {
        if (result != null) {
          this.newItemsTracker.clear();
        }

        _get(_getPrototypeOf(StreamListTreeContentHandler.prototype), "handleFetchSuccess", this).call(this, result);
      }
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {
        detail.keys.forEach(function (key) {
          this.vnodesCache.delete(key);
        }.bind(this));

        _get(_getPrototypeOf(StreamListTreeContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {
        detail.keys.forEach(function (key) {
          this.vnodesCache.delete(key);
        }.bind(this));

        _get(_getPrototypeOf(StreamListTreeContentHandler.prototype), "handleItemsRemoved", this).call(this, detail);
      }
    }, {
      key: "handleModelRefresh",
      value: function handleModelRefresh() {
        this.vnodesCache.clear();

        _get(_getPrototypeOf(StreamListTreeContentHandler.prototype), "handleModelRefresh", this).call(this);
      }
    }, {
      key: "addItem",
      value: function addItem(metadata, index, data, visible) {
        var initialFetch = this.isInitialFetch();
        var currentItem = this.callback.getCurrentItem();

        if (currentItem == null && initialFetch && index == 0) {
          this.callback.setCurrentItem(metadata.key);
        }

        var vnodes = this.renderItem(metadata, index, data);
        this.decorateItem(vnodes, metadata, index, initialFetch, visible);
        return vnodes;
      }
    }, {
      key: "renderItem",
      value: function renderItem(metadata, index, data) {
        var key = metadata.key;
        var node = this.vnodesCache.get(key);

        if (node) {
          this.newVnodesCache.set(key, {
            vnodes: node.vnodes
          });
          return node.vnodes;
        }

        var renderer;
        var vnodes;

        if (!metadata.isLeaf) {
          renderer = this.callback.getGroupRenderer();
        }

        if (renderer == null) {
          renderer = this.callback.getItemRenderer();
        }

        vnodes = renderer({
          data: data,
          key: metadata.key,
          leaf: metadata.isLeaf,
          parentKey: metadata.parentKey,
          depth: metadata.treeDepth
        });
        var vnode;

        for (var i = 0; i < vnodes.length; i++) {
          var _node2 = vnodes[i]._node;

          if (_node2.nodeType === 1) {
            vnode = vnodes[i];
            break;
          }
        }

        var prunedVnodes = [vnode];
        this.newVnodesCache.set(key, {
          vnodes: prunedVnodes
        });
        return prunedVnodes;
      }
    }, {
      key: "decorateItem",
      value: function decorateItem(vnodes, metadata, index, initialFetch, visible) {
        var vnode = vnodes[0];
        var contentRoot = vnode._node;

        if (contentRoot != null) {
          vnode.key = metadata.key;
          contentRoot.key = metadata.key;
          contentRoot.setAttribute('role', 'listitem');
          contentRoot.setAttribute('tabIndex', '-1');
          var styleClasses = this.getItemStyleClass(metadata, visible, this.newItemsTracker.has(metadata.key), initialFetch);
          styleClasses.forEach(function (styleClass) {
            contentRoot.classList.add(styleClass);
          });

          if (!metadata.isLeaf) {
            var expandedProp = this.callback.getExpanded();
            var expanded = expandedProp && expandedProp.has(metadata.key);

            if (expanded) {
              contentRoot.setAttribute('aria-expanded', 'true');
            } else {
              contentRoot.setAttribute('aria-expanded', 'false');
            }
          }
        }
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass(metadata, visible, isNew, animate) {
        var styleClass = [];

        if (!metadata.isLeaf) {
          styleClass.push('oj-stream-list-group');
        } else {
          styleClass.push('oj-stream-list-item');
        }

        if (animate) {}

        return styleClass;
      }
    }, {
      key: "renderSkeletonsForLoadMore",
      value: function renderSkeletonsForLoadMore() {
        return this.callback.renderSkeletons(3);
      }
    }, {
      key: "renderSkeletonsForExpand",
      value: function renderSkeletonsForExpand(key) {
        return this.callback.renderSkeletons(this.getLoadMoreCount(), true, key);
      }
    }]);

    return StreamListTreeContentHandler;
  }(ojvcollection.IteratingTreeDataProviderContentHandler);

  var __decorate = null && null.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var StreamList_1;

  var Props = function Props() {
    _classCallCheck(this, Props);

    this.data = null;
    this.expanded = new ojkeyset.KeySetImpl();
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

  exports.StreamList = StreamList_1 = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(StreamList, _ojvcomponentElement$);

    var _super3 = _createSuper(StreamList);

    function StreamList(props) {
      var _this3;

      _classCallCheck(this, StreamList);

      _this3 = _super3.call(this, props);
      _this3.restoreFocus = false;
      _this3.actionableMode = false;
      _this3.skeletonHeight = 0;
      _this3.height = 0;

      _this3.setRootElement = function (element) {
        _this3.root = element;
      };

      _this3.state = {
        renderedData: null,
        outOfRangeData: null,
        initialSkeleton: false,
        initialSkeletonCount: 1,
        expandedToggleKeys: new ojkeyset.KeySetImpl(),
        expandedSkeletonKeys: new ojkeyset.KeySetImpl(),
        expandingKeys: new ojkeyset.KeySetImpl(),
        toCollapse: []
      };
      return _this3;
    }

    _createClass(StreamList, [{
      key: "_handleFocusIn",
      value: function _handleFocusIn(event) {
        this._clearFocusoutTimeout();

        var target = event.target;
        var item = target.closest('.oj-stream-list-item, .oj-stream-list-group');

        if (item && this._isFocusable(target, item)) {
          this._enterActionableMode(target);
        } else if (this.currentItem && !this.actionableMode) {
          this.focusInHandler(this.currentItem);
        }
      }
    }, {
      key: "_handleFocusOut",
      value: function _handleFocusOut() {
        this._clearFocusoutTimeout();

        if (this.actionableMode) {
          this._focusoutTimeout = setTimeout(function () {
            this._doBlur();
          }.bind(this), 100);
        } else if (!this._isFocusBlurTriggeredByDescendent(event)) {
          this._doBlur();
        }
      }
    }, {
      key: "_clearFocusoutTimeout",
      value: function _clearFocusoutTimeout() {
        if (this._focusoutTimeout) {
          clearTimeout(this._focusoutTimeout);
          this._focusoutTimeout = null;
        }
      }
    }, {
      key: "_handleClick",
      value: function _handleClick(event) {
        var target = event.target;
        var group = target.closest('.' + this.getGroupStyleClass());

        if (group) {
          var key = group.key;
          var expanded = this.props.expanded.has(key);

          this._handleToggleExpanded(key, expanded);
        }

        this._handleTouchOrClickEvent(event);
      }
    }, {
      key: "_handleToggleExpanded",
      value: function _handleToggleExpanded(key, expanded) {
        this.updateState(function (state, props) {
          var _a, _b;

          var expandedToggleKeys = state.expandedToggleKeys;

          if (!expandedToggleKeys.has(key)) {
            expandedToggleKeys = expandedToggleKeys.add([key]);
            var newExpanded = props.expanded;
            expandedToggleKeys.values().forEach(function (key) {
              if (expanded) {
                newExpanded = newExpanded.delete([key]);
              } else {
                newExpanded = newExpanded.add([key]);
              }
            });
            (_b = (_a = this.props).onExpandedChanged) === null || _b === void 0 ? void 0 : _b.call(_a, newExpanded);
            return {
              expandedToggleKeys: expandedToggleKeys
            };
          }

          return {};
        }.bind(this));
      }
    }, {
      key: "_handleKeyDown",
      value: function _handleKeyDown(event) {
        if (this.currentItem) {
          var next;

          switch (event.key) {
            case DataCollectionUtils.KEYBOARD_KEYS._LEFT:
            case DataCollectionUtils.KEYBOARD_KEYS._LEFT_IE:
            case DataCollectionUtils.KEYBOARD_KEYS._RIGHT:
            case DataCollectionUtils.KEYBOARD_KEYS._RIGHT_IE:
              {
                if (this.currentItem.classList.contains(this.getGroupStyleClass())) {
                  var group = this.currentItem;
                  var key = group.key;
                  var expanded = this.props.expanded.has(key);

                  if ((event.key === DataCollectionUtils.KEYBOARD_KEYS._RIGHT || event.key === DataCollectionUtils.KEYBOARD_KEYS._RIGHT_IE) && !expanded || (event.key === DataCollectionUtils.KEYBOARD_KEYS._LEFT || event.key === DataCollectionUtils.KEYBOARD_KEYS._LEFT_IE) && expanded) {
                    this._handleToggleExpanded(key, expanded);
                  }
                }

                break;
              }

            case DataCollectionUtils.KEYBOARD_KEYS._UP:
            case DataCollectionUtils.KEYBOARD_KEYS._UP_IE:
              {
                if (this.actionableMode === false) {
                  next = this.currentItem.previousElementSibling;

                  while (next && next.previousElementSibling && next.classList.contains('oj-stream-list-skeleton')) {
                    next = next.previousElementSibling;
                  }
                }

                break;
              }

            case DataCollectionUtils.KEYBOARD_KEYS._DOWN:
            case DataCollectionUtils.KEYBOARD_KEYS._DOWN_IE:
              {
                if (this.actionableMode === false) {
                  next = this.currentItem.nextElementSibling;

                  while (next && next.nextElementSibling && next.classList.contains('oj-stream-list-skeleton')) {
                    next = next.nextElementSibling;
                  }
                }

                break;
              }

            case DataCollectionUtils.KEYBOARD_KEYS._F2:
              {
                if (this.actionableMode === false) {
                  this._enterActionableMode();
                }

                break;
              }

            case DataCollectionUtils.KEYBOARD_KEYS._ESCAPE:
            case DataCollectionUtils.KEYBOARD_KEYS._ESCAPE_IE:
              {
                if (this.actionableMode === true) {
                  this._exitActionableMode(true);
                }

                break;
              }

            case DataCollectionUtils.KEYBOARD_KEYS._TAB:
              {
                if (this.actionableMode === true && this.currentItem) {
                  if (event.shiftKey) {
                    if (DataCollectionUtils.handleActionablePrevTab(event, this.currentItem)) {
                      event.preventDefault();
                    }
                  } else {
                    if (DataCollectionUtils.handleActionableTab(event, this.currentItem)) {
                      event.preventDefault();
                    }
                  }
                }

                break;
              }
          }

          if (next != null && (next.classList.contains(this.getItemStyleClass()) || next.classList.contains(this.getGroupStyleClass()))) {
            this._updateCurrentItemAndFocus(next, true);

            event.preventDefault();
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
        var initialSkeleton = this.state.initialSkeleton;
        var initialSkeletonCount = this.state.initialSkeletonCount;
        var content;

        if (this.contentHandler == null && initialSkeleton) {
          content = this._renderInitialSkeletons(initialSkeletonCount);
        } else {
          var data = this.getData();

          if (data != null && initialSkeleton || data == null) {
            content = this._renderInitialSkeletons(initialSkeletonCount, data == null);
          } else if (data != null) {
            content = this.contentHandler.render();

            if (this.currentItem && this.currentItem.contains(document.activeElement) && !this.actionableMode) {
              this.restoreFocus = true;
            }
          }
        }

        return ojvcomponentElement.h("oj-stream-list", {
          ref: this.setRootElement
        }, ojvcomponentElement.h("div", {
          role: 'list',
          "data-oj-context": true,
          onClick: this._handleClick,
          onKeydown: this._handleKeyDown,
          onTouchstart: this._touchStartHandler,
          onFocusin: this._handleFocusIn,
          onFocusout: this._handleFocusOut
        }, content));
      }
    }, {
      key: "_doBlur",
      value: function _doBlur() {
        if (this.actionableMode) {
          this._exitActionableMode(false);
        }

        if (this.currentItem) {
          this.focusOutHandler(this.currentItem);
        }
      }
    }, {
      key: "_isFocusBlurTriggeredByDescendent",
      value: function _isFocusBlurTriggeredByDescendent(event) {
        if (event.relatedTarget === undefined) {
          return true;
        }

        if (event.relatedTarget == null || !this.root.contains(event.relatedTarget)) {
          return false;
        }

        return true;
      }
    }, {
      key: "_renderInitialSkeletons",
      value: function _renderInitialSkeletons(count, shouldScroll) {
        if (shouldScroll) {
          var scroller = this._getScroller();

          if (scroller != null) {
            scroller.scrollTop = 0;
          }
        }

        return this.renderSkeletons(count);
      }
    }, {
      key: "renderSkeletons",
      value: function renderSkeletons(count, indented, key) {
        var skeletons = [];

        var isTreeData = this._isTreeData();

        var skeletonKey;

        for (var i = 0; i < count; i++) {
          var shouldIndent = indented;

          if (!indented && isTreeData && i % 4) {
            shouldIndent = true;
          }

          if (key) {
            skeletonKey = key + '_' + i;
          }

          skeletons.push(this._renderSkeleton(shouldIndent, skeletonKey));
        }

        return skeletons;
      }
    }, {
      key: "_renderSkeleton",
      value: function _renderSkeleton(indented, key) {
        var className = 'oj-stream-list-skeleton';

        if (indented) {
          className += ' oj-stream-list-child-skeleton';
        }

        return ojvcomponentElement.h("div", {
          class: className,
          key: key
        }, ojvcomponentElement.h("div", {
          class: 'oj-stream-list-skeleton-content oj-animation-skeleton'
        }));
      }
    }, {
      key: "_applySkeletonExitAnimation",
      value: function _applySkeletonExitAnimation(skeletons) {
        var resolveFunc = this.addBusyState('apply skeleton exit animations');
        return new Promise(function (resolve, reject) {
          var promises = [];
          skeletons.forEach(function (skeleton) {
            promises.push(AnimationUtils.fadeOut(skeleton));
          });
          Promise.all(promises).then(function () {
            resolveFunc();
            resolve(true);
          });
        });
      }
    }, {
      key: "_isTreeData",
      value: function _isTreeData() {
        var data = this.props.data;
        return data != null && this.instanceOfTreeDataProvider(data);
      }
    }, {
      key: "instanceOfTreeDataProvider",
      value: function instanceOfTreeDataProvider(object) {
        return 'getChildDataProvider' in object;
      }
    }, {
      key: "_postRender",
      value: function _postRender() {
        this._registerScrollHandler();

        var data = this.getData();
        var initialSkeleton = this.state.initialSkeleton;

        if (data != null && initialSkeleton) {
          var skeletons = this.getRootElement().querySelectorAll('.oj-stream-list-skeleton');

          this._applySkeletonExitAnimation(skeletons).then(function () {
            this.updateState({
              initialSkeleton: false
            });
          }.bind(this));
        } else if (data != null) {
          this.contentHandler.postRender();
        }

        var items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');

        this._disableAllTabbableElements(items);

        this._restoreCurrentItem(items);
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
        var _this4 = this;

        var data = this.props.data;

        if (this._isTreeData()) {
          this.contentHandler = new StreamListTreeContentHandler(this.root, data, this, this._getScrollPolicyOptions());
        } else if (data != null) {
          this.contentHandler = new StreamListContentHandler(this.root, data, this, this._getScrollPolicyOptions());
        }

        this.contentHandler.fetchRows();
        this.height = this.root.clientHeight;
        var skeleton = this.root.querySelector('.oj-stream-list-skeleton');

        if (skeleton) {
          this.skeletonHeight = this.outerHeight(skeleton);

          this._delayShowSkeletons();
        }

        if (window['ResizeObserver']) {
          var root = this.root;
          var resizeObserver = new window['ResizeObserver'](function (entries) {
            entries.forEach(function (entry) {
              if (entry.target === root && entry.contentRect) {
                var currHeight = _this4.height;
                var newHeight = Math.round(entry.contentRect.height);

                if (Math.abs(newHeight - currHeight) > 1) {
                  _this4.height = newHeight;

                  if (_this4.contentHandler && _this4.contentHandler.domScroller) {
                    _this4.contentHandler.domScroller.checkViewport();
                  }
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
            _this4.focusInHandler = noJQHandlers.focusIn;
            _this4.focusOutHandler = noJQHandlers.focusOut;
          }
        });

        this._postRender();
      }
    }, {
      key: "getSkeletonHeight",
      value: function getSkeletonHeight() {
        return this.skeletonHeight;
      }
    }, {
      key: "outerHeight",
      value: function outerHeight(el) {
        var height = el.offsetHeight;
        var style = getComputedStyle(el);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
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

        this._unregisterScrollHandler();
      }
    }, {
      key: "_delayShowSkeletons",
      value: function _delayShowSkeletons() {
        var _this5 = this;

        window.setTimeout(function () {
          var data = _this5.getData();

          if (data == null) {
            _this5.updateState(function (state) {
              return {
                initialSkeletonCount: Math.max(1, Math.floor(_this5.height / _this5.skeletonHeight))
              };
            });
          }
        }, this._getShowSkeletonsDelay());
      }
    }, {
      key: "_getOptionDefaults",
      value: function _getOptionDefaults() {
        if (this.defaultOptions == null) {
          this.defaultOptions = ThemeUtils.parseJSONFromFontFamily('oj-streamlist-option-defaults');
        }

        return this.defaultOptions;
      }
    }, {
      key: "_getShowSkeletonsDelay",
      value: function _getShowSkeletonsDelay() {
        var defaultOptions = this._getOptionDefaults();

        if (defaultOptions == null) {
          return 0;
        }

        var delay = parseInt(defaultOptions.showIndicatorDelay, 10);
        return isNaN(delay) ? 0 : delay;
      }
    }, {
      key: "getRootElement",
      value: function getRootElement() {
        return this.root;
      }
    }, {
      key: "updated",
      value: function updated(oldProps, oldState) {
        if (this._isTreeData() && this.contentHandler.collapse) {
          this.contentHandler.collapse(this.state.toCollapse);
        }

        var oldExpandingKeys = oldState.expandingKeys;
        var expandingKeys = this.state.expandingKeys;
        expandingKeys.values().forEach(function (key) {
          if (!oldExpandingKeys.has(key)) {
            this.contentHandler.expand(key);
          }
        }.bind(this));

        if (this.props.data != oldProps.data) {
          if (this.contentHandler) {
            this.contentHandler.destroy();
          }

          this.setCurrentItem(null);
          this.updateState({
            renderedData: null,
            outOfRangeData: null,
            initialSkeleton: true,
            initialSkeletonCount: this.state.initialSkeletonCount,
            expandedToggleKeys: new ojkeyset.KeySetImpl(),
            expandedSkeletonKeys: new ojkeyset.KeySetImpl(),
            expandingKeys: new ojkeyset.KeySetImpl()
          });

          if (this._isTreeData()) {
            this.contentHandler = new StreamListTreeContentHandler(this.root, this.props.data, this, this._getScrollPolicyOptions());
          } else if (this.props.data != null) {
            this.contentHandler = new StreamListContentHandler(this.root, this.props.data, this, this._getScrollPolicyOptions());
          }

          this.contentHandler.fetchRows();

          this._delayShowSkeletons();
        }

        this._postRender();

        if (!oj.Object.compareValues(this.props.scrollPosition, oldProps.scrollPosition) && !oj.Object.compareValues(this.props.scrollPosition, this.lastInternalScrollPositionUpdate)) {
          this._syncScrollTopWithProps();
        }
      }
    }, {
      key: "_unregisterScrollHandler",
      value: function _unregisterScrollHandler() {
        var scrollElement = this._getScrollEventElement();

        scrollElement.removeEventListener('scroll', this.scrollListener);
      }
    }, {
      key: "_registerScrollHandler",
      value: function _registerScrollHandler() {
        var scrollElement = this._getScrollEventElement();

        this._unregisterScrollHandler();

        scrollElement.addEventListener('scroll', this.scrollListener);
      }
    }, {
      key: "scrollListener",
      value: function scrollListener() {
        var self = this;

        if (!this._ticking) {
          window.requestAnimationFrame(function () {
            self._updateScrollPosition();

            self._ticking = false;
          });
          this._ticking = true;
        }
      }
    }, {
      key: "_updateScrollPosition",
      value: function _updateScrollPosition() {
        var _a, _b;

        var scrollPosition = {};

        var scrollTop = this._getScroller().scrollTop;

        var result = this._findClosestElementToTop(scrollTop);

        scrollPosition.y = scrollTop;

        if (result != null) {
          var elem = result.elem;
          scrollPosition.offsetY = result.offsetY;
          scrollPosition.key = elem.key;

          if (this._isTreeData() && elem.classList.contains('oj-stream-list-item')) {
            scrollPosition.parentKey = this._getParentKey(elem);
          } else {
            scrollPosition.parentKey = null;
          }
        }

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
          var parent = scrollPosition.parentKey;

          var item = this._getItemByKey(key, parent);

          if (item != null) {
            var root = this.root;
            scrollTop = item.offsetTop - root.offsetTop;
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
      key: "_getParentKey",
      value: function _getParentKey(item) {
        while (item) {
          if (item.classList.contains('oj-stream-list-group')) {
            return item.key;
          }

          item = item.previousElementSibling;
        }

        return null;
      }
    }, {
      key: "_getItemByKey",
      value: function _getItemByKey(key, parentKey) {
        var items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var itemKey = item.key;

          if (itemKey === key) {
            if (parentKey == null || this._getParentKey(item) === parentKey) {
              return item;
            }
          }
        }
      }
    }, {
      key: "_getScrollEventElement",
      value: function _getScrollEventElement() {
        var scroller = this.props.scrollPolicyOptions.scroller;

        if (scroller != null) {
          if (typeof scroller === 'string') {
            scroller = document.querySelector(scroller);
          }

          if (scroller === document.body || scroller === document.documentElement) {
            return window;
          }

          return scroller;
        }

        return this.getRootElement();
      }
    }, {
      key: "_getScroller",
      value: function _getScroller() {
        var scroller = this.props.scrollPolicyOptions.scroller;

        if (scroller != null) {
          if (typeof scroller === 'string') {
            scroller = document.querySelector(scroller);
          }

          if (scroller === document.documentElement && scroller !== document.scrollingElement) {
            return document.body;
          }

          return scroller;
        }

        return this.getRootElement();
      }
    }, {
      key: "_findClosestElementToTop",
      value: function _findClosestElementToTop(currScrollTop) {
        var items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');

        if (items == null || items.length === 0) {
          return null;
        }

        var root = this.root;
        var rootTop = root.offsetTop;
        var scrollTop = Math.max(currScrollTop, 0);
        var offsetTop = 0 - rootTop;
        var diff = scrollTop;
        var index = 0;
        var elem = items[index];
        var found = false;
        var elementDetail = {
          elem: elem,
          offsetY: diff
        };

        while (!found && index >= 0 && index < items.length) {
          elem = items[index];
          offsetTop = elem.offsetTop - rootTop;
          diff = Math.abs(scrollTop - offsetTop);
          found = diff < 1 || scrollTop <= offsetTop;

          if (found) {
            break;
          }

          elementDetail = {
            elem: elem,
            offsetY: diff
          };
          index += 1;
        }

        return elementDetail;
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
        this.updateState({
          renderedData: data
        });
      }
    }, {
      key: "updateData",
      value: function updateData(updater) {
        this.updateState(function (state) {
          var returnVal = updater(state.renderedData, state.expandingKeys);
          return returnVal;
        }.bind(this));
      }
    }, {
      key: "getExpanded",
      value: function getExpanded() {
        return this.props.expanded;
      }
    }, {
      key: "setExpanded",
      value: function setExpanded(set) {
        var _a, _b;

        (_b = (_a = this.props).onExpandedChanged) === null || _b === void 0 ? void 0 : _b.call(_a, set);
      }
    }, {
      key: "updateExpand",
      value: function updateExpand(updater) {
        this.updateState(function (state, props) {
          return updater(state.renderedData, state.expandedSkeletonKeys, state.expandingKeys, props.expanded);
        }.bind(this));
      }
    }, {
      key: "getExpandingKeys",
      value: function getExpandingKeys() {
        return this.state.expandingKeys;
      }
    }, {
      key: "setExpandingKeys",
      value: function setExpandingKeys(set) {
        this.updateState({
          expandingKeys: set
        });
      }
    }, {
      key: "updateExpandingKeys",
      value: function updateExpandingKeys(key) {
        this.updateState(function (state) {
          return {
            expandingKeys: state.expandingKeys.add([key])
          };
        });
      }
    }, {
      key: "getSkeletonKeys",
      value: function getSkeletonKeys() {
        return this.state.expandedSkeletonKeys;
      }
    }, {
      key: "setSkeletonKeys",
      value: function setSkeletonKeys(set) {
        this.updateState({
          expandedSkeletonKeys: set
        });
      }
    }, {
      key: "updateSkeletonKeys",
      value: function updateSkeletonKeys(key) {
        this.updateState(function (state) {
          return {
            expandedSkeletonKeys: state.expandedSkeletonKeys.add([key])
          };
        });
      }
    }, {
      key: "getOutOfRangeData",
      value: function getOutOfRangeData() {
        return this.state.outOfRangeData;
      }
    }, {
      key: "setOutOfRangeData",
      value: function setOutOfRangeData(data) {
        this.updateState({
          outOfRangeData: data
        });
      }
    }, {
      key: "getItemRenderer",
      value: function getItemRenderer() {
        return this.props.itemTemplate;
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass() {
        return 'oj-stream-list-item';
      }
    }, {
      key: "getGroupRenderer",
      value: function getGroupRenderer() {
        return this.props.groupTemplate;
      }
    }, {
      key: "getGroupStyleClass",
      value: function getGroupStyleClass() {
        return 'oj-stream-list-group';
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
      key: "_handleTouchOrClickEvent",
      value: function _handleTouchOrClickEvent(event) {
        var target = event.target;
        var item = target.closest('.oj-stream-list-item, .oj-stream-list-group');

        if (item) {
          if (this._isFocusable(target, item)) {
            this._updateCurrentItemAndFocus(item, false);

            this._enterActionableMode(target);
          } else {
            this._updateCurrentItemAndFocus(item, true);
          }
        }
      }
    }, {
      key: "_isFocusable",
      value: function _isFocusable(target, item) {
        return this._isInputElement(target) || this._isInsideFocusableElement(target, item);
      }
    }, {
      key: "_isInputElement",
      value: function _isInputElement(target) {
        var inputRegExp = /^INPUT|SELECT|OPTION|TEXTAREA/;
        return target.nodeName.match(inputRegExp) != null && !target.readOnly;
      }
    }, {
      key: "_isInsideFocusableElement",
      value: function _isInsideFocusableElement(target, item) {
        var found = false;

        while (target !== item && target != null) {
          if (target.classList.contains('oj-form-control') || this._isInFocusableElementsList(target, item)) {
            if (!target.readonly && !target.disabled) {
              found = true;
            }

            break;
          }

          target = target.parentNode;
        }

        return found;
      }
    }, {
      key: "_isInFocusableElementsList",
      value: function _isInFocusableElementsList(target, item) {
        var found = false;
        var nodes = DataCollectionUtils.getFocusableElementsIncludingDisabled(item);
        nodes.forEach(function (node) {
          if (node === target) {
            found = true;
          }
        });
        return found;
      }
    }, {
      key: "_resetFocus",
      value: function _resetFocus(item, resetActionable) {
        if (this.actionableMode && resetActionable) {
          this._exitActionableMode(false);
        }

        this.focusOutHandler(item);
        item.tabIndex = -1;
      }
    }, {
      key: "_setFocus",
      value: function _setFocus(item, shouldFocus) {
        item.tabIndex = 0;

        if (shouldFocus) {
          this.focusInHandler(item);
          item.focus();
        }
      }
    }, {
      key: "_updateCurrentItemAndFocus",
      value: function _updateCurrentItemAndFocus(item, shouldFocus) {
        var lastCurrentItem = this.currentItem;
        var newCurrentItem = item;

        this._resetFocus(lastCurrentItem, true);

        this.currentItem = newCurrentItem;
        this.setCurrentItem(newCurrentItem.key);

        this._setFocus(newCurrentItem, shouldFocus);
      }
    }, {
      key: "_isInViewport",
      value: function _isInViewport(item) {
        var itemElem = item;
        var top = itemElem.offsetTop;

        var scrollTop = this._getScroller().scrollTop;

        return top >= scrollTop && top <= scrollTop + this.height;
      }
    }, {
      key: "_restoreCurrentItem",
      value: function _restoreCurrentItem(items) {
        if (this.currentKey != null) {
          for (var i = 0; i < items.length; i++) {
            if (oj.KeyUtils.equals(items[i].key, this.currentKey)) {
              var elem = items[i];

              if (this.restoreFocus && this._isInViewport(elem)) {
                this._updateCurrentItemAndFocus(elem, true);

                return;
              } else {
                this.currentItem = elem;

                this._setFocus(elem, false);
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
          var busyContext = Context.getContext(item).getBusyContext();
          busyContext.whenReady().then(function () {
            DataCollectionUtils.disableAllFocusableElements(item, true);
          });
        });
      }
    }, {
      key: "_enterActionableMode",
      value: function _enterActionableMode(target) {
        this.actionableMode = true;

        if (this.currentItem) {
          var elems = DataCollectionUtils.enableAllFocusableElements(this.currentItem, true);

          if (target == null && elems && elems.length > 0) {
            elems[0].focus();

            this._resetFocus(this.currentItem, false);
          }
        }
      }
    }, {
      key: "_exitActionableMode",
      value: function _exitActionableMode(shouldFocus) {
        this.actionableMode = false;

        if (this.currentItem) {
          DataCollectionUtils.disableAllFocusableElements(this.currentItem, true);

          this._setFocus(this.currentItem, shouldFocus);
        }
      }
    }], [{
      key: "initStateFromProps",
      value: function initStateFromProps(props, state) {
        return StreamList_1.updateStateFromProps(props, state, null);
      }
    }, {
      key: "updateStateFromProps",
      value: function updateStateFromProps(props, state, oldProps) {
        var expandedToggleKeys = state.expandedToggleKeys,
            expandingKeys = state.expandingKeys,
            renderedData = state.renderedData,
            expandedSkeletonKeys = state.expandedSkeletonKeys;
        var toCollapse = [];
        var newExpanded = props.expanded;

        if (oldProps && newExpanded !== oldProps.expanded) {
          var oldExpanded = oldProps.expanded;
          expandedToggleKeys.values().forEach(function (key) {
            if (oldExpanded.has(key) !== newExpanded.has(key)) {
              expandedToggleKeys = expandedToggleKeys.delete([key]);
            }
          });
          renderedData.value.metadata.forEach(function (itemMetadata) {
            var key = itemMetadata.key;
            var itemExpanded = itemMetadata.expanded;
            var isExpanded = newExpanded.has(key);

            if (itemExpanded && !isExpanded) {
              toCollapse.push(key);
              itemMetadata.expanded = false;
            } else if (!itemExpanded && isExpanded) {
              expandingKeys = expandingKeys.add([key]);
              itemMetadata.expanded = true;
            }
          });
          toCollapse.forEach(function (key) {
            renderedData = StreamList_1.collapse(key, renderedData);
            expandingKeys = expandingKeys.delete([key]);
            expandedSkeletonKeys = expandedSkeletonKeys.delete([key]);
          });
          return {
            renderedData: renderedData,
            expandingKeys: expandingKeys,
            expandedToggleKeys: expandedToggleKeys,
            expandedSkeletonKeys: expandedSkeletonKeys,
            toCollapse: toCollapse
          };
        }

        return {
          toCollapse: toCollapse
        };
      }
    }, {
      key: "_findIndex",
      value: function _findIndex(metadata, key) {
        for (var i = 0; i < metadata.length; i++) {
          if (oj.KeyUtils.equals(key, metadata[i].key)) {
            return i;
          }
        }

        return -1;
      }
    }]);

    return StreamList;
  }(ojvcomponentElement.ElementVComponent);

  exports.StreamList.collapse = function (key, currentData) {
    var data = currentData.value.data;
    var metadata = currentData.value.metadata;

    var index = StreamList_1._findIndex(metadata, key);

    if (index > -1) {
      var count = StreamList_1._getLocalDescendentCount(metadata, index);

      data.splice(index + 1, count);
      metadata.splice(index + 1, count);
    }

    return {
      value: {
        data: data,
        metadata: metadata
      },
      done: currentData.done
    };
  };

  exports.StreamList._getLocalDescendentCount = function (metadata, index) {
    var count = 0;
    var depth = metadata[index].treeDepth;
    var lastIndex = metadata.length;

    for (var j = index + 1; j < lastIndex; j++) {
      var newMetadata = metadata[j];
      var newDepth = newMetadata.treeDepth;

      if (newDepth > depth) {
        count += 1;
      } else {
        return count;
      }
    }

    return count;
  };

  exports.StreamList.metadata = {
    "extension": {
      "_DEFAULTS": Props,
      "_WRITEBACK_PROPS": ["expanded", "scrollPosition"],
      "_READ_ONLY_PROPS": []
    },
    "properties": {
      "data": {
        "type": "object|null",
        "value": null
      },
      "expanded": {
        "type": "any",
        "writeback": true
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
          },
          "parentKey": {
            "type": "any"
          }
        },
        "writeback": true
      }
    },
    "slots": {
      "groupTemplate": {
        "data": {}
      },
      "itemTemplate": {
        "data": {}
      }
    }
  };

  __decorate([ojvcomponentElement.listener()], exports.StreamList.prototype, "_handleFocusIn", null);

  __decorate([ojvcomponentElement.listener()], exports.StreamList.prototype, "_handleFocusOut", null);

  __decorate([ojvcomponentElement.listener()], exports.StreamList.prototype, "_handleClick", null);

  __decorate([ojvcomponentElement.listener()], exports.StreamList.prototype, "_handleKeyDown", null);

  __decorate([ojvcomponentElement.listener({
    passive: true
  })], exports.StreamList.prototype, "_touchStartHandler", null);

  __decorate([ojvcomponentElement.listener()], exports.StreamList.prototype, "scrollListener", null);

  exports.StreamList = StreamList_1 = __decorate([ojvcomponentElement.customElement('oj-stream-list')], exports.StreamList);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())