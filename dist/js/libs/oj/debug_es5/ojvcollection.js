(function() {
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
define(['exports', 'ojs/ojcore-base', 'ojs/ojlogger', 'ojs/ojdatacollection-common', 'ojs/ojcachediteratorresultsdataprovider', 'ojs/ojdomscroller'], function (exports, oj, Logger, DataCollectionUtils, CachedIteratorResultsDataProvider, DomScroller) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  CachedIteratorResultsDataProvider = CachedIteratorResultsDataProvider && Object.prototype.hasOwnProperty.call(CachedIteratorResultsDataProvider, 'default') ? CachedIteratorResultsDataProvider['default'] : CachedIteratorResultsDataProvider;
  DomScroller = DomScroller && Object.prototype.hasOwnProperty.call(DomScroller, 'default') ? DomScroller['default'] : DomScroller;

  var DataProviderContentHandler = /*#__PURE__*/function () {
    function DataProviderContentHandler(root, dataProvider, callback) {
      _classCallCheck(this, DataProviderContentHandler);

      this.root = root;
      this.dataProvider = dataProvider;
      this.callback = callback;
      this.validKeyTypes = ['string', 'number'];
      this.fetching = 0;

      this.getKey = function (element) {
        return element.key;
      };

      if (dataProvider) {
        this.modelEventHandler = this._handleModelEvent.bind(this);
        dataProvider.addEventListener('mutate', this.modelEventHandler);
        dataProvider.addEventListener('refresh', this.modelEventHandler);
      }
    }

    _createClass(DataProviderContentHandler, [{
      key: "setFetching",
      value: function setFetching(fetching) {
        var fetchingValue = fetching ? this.fetching + 1 : this.fetching - 1;
        this.fetching = Math.max(0, fetchingValue);
      }
    }, {
      key: "isFetching",
      value: function isFetching() {
        return this.fetching !== 0;
      }
    }, {
      key: "addBusyState",
      value: function addBusyState(description) {
        if (this.callback != null) {
          return this.callback.addBusyState('DataProviderContentHandler ' + description);
        }

        return function () {};
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.callback = null;

        if (this.dataProvider && this.modelEventHandler) {
          this.dataProvider.removeEventListener('mutate', this.modelEventHandler);
          this.dataProvider.removeEventListener('refresh', this.modelEventHandler);
        }
      }
    }, {
      key: "render",
      value: function render() {
        if (this.callback.getData() == null) {
          this.fetchRows();
        }

        return this.renderFetchedData();
      }
    }, {
      key: "postRender",
      value: function postRender() {}
    }, {
      key: "getDataProvider",
      value: function getDataProvider() {
        return this.dataProvider;
      }
    }, {
      key: "setDataProvider",
      value: function setDataProvider(dataProvider) {
        this.dataProvider = dataProvider;
      }
    }, {
      key: "isReady",
      value: function isReady() {
        return !this.fetching;
      }
    }, {
      key: "verifyKey",
      value: function verifyKey(key) {
        return this.validKeyTypes.indexOf(_typeof(key)) > -1;
      }
    }, {
      key: "handleModelRefresh",
      value: function handleModelRefresh() {
        this.callback.setData(null);
        this.fetchRows();
      }
    }, {
      key: "handleItemsAdded",
      value: function handleItemsAdded(detail) {}
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {}
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {}
    }, {
      key: "_handleModelEvent",
      value: function _handleModelEvent(event) {
        if (event.type === 'refresh') {
          this.handleModelRefresh();
        } else if (event.type === 'mutate') {
          var detail = event['detail'];

          if (detail.add) {
            this.handleItemsAdded(detail.add);
          }

          if (detail.remove) {
            this.handleItemsRemoved(detail.remove);
          }

          if (detail.update) {
            this.handleItemsUpdated(detail.update);
          }
        }
      }
    }]);

    return DataProviderContentHandler;
  }();

  (function (VirtualizationStrategy) {
    VirtualizationStrategy[VirtualizationStrategy["HIGH_WATER_MARK"] = 0] = "HIGH_WATER_MARK";
    VirtualizationStrategy[VirtualizationStrategy["VIEWPORT_ONLY"] = 1] = "VIEWPORT_ONLY";
  })(exports.VirtualizationStrategy || (exports.VirtualizationStrategy = {}));

  var VirtualizeDomScroller = /*#__PURE__*/function () {
    function VirtualizeDomScroller(element, dataProvider, asyncIterator, callback, options) {
      var _this = this;

      _classCallCheck(this, VirtualizeDomScroller);

      this.element = element;
      this.dataProvider = dataProvider;
      this.asyncIterator = asyncIterator;
      this.callback = callback;
      this.options = options;

      this._handleScroll = function (event) {
        var target = _this.element;

        var scrollTop = _this._getScrollTop(target);

        var maxScrollTop = target.scrollHeight - target.clientHeight;

        if (maxScrollTop > 0) {
          _this._handleScrollerScrollTop(scrollTop, maxScrollTop);
        }
      };

      this._handleModelEvent = function (event) {
        if (event.type === 'mutate') {
          var detail = event['detail'];

          if (detail.add) {
            var indexes = detail.add.indexes;
            var addBeforeKeys = detail.add.addBeforeKeys;

            if (addBeforeKeys != null) {
              var keys = Array.from(detail.add.keys);
              indexes = _this._handleModelInsert(addBeforeKeys, keys);
            }

            if (indexes != null) {
              indexes = indexes.sort(function (a, b) {
                return a - b;
              });

              _this._handleItemsAddedOrRemoved(indexes, 'added');

              _this.rowCount = _this.rowCount + indexes.length;
            }
          }

          if (detail.remove) {
            var _keys = Array.from(detail.remove.keys);

            var _indexes = _this._handleModelDelete(_keys);

            _indexes = _indexes.sort(function (a, b) {
              return b - a;
            });

            _this._handleItemsAddedOrRemoved(_indexes, 'removed');

            _this.rowCount = Math.max(0, _this.rowCount - _indexes.length);
          }
        }
      };

      this.initialScrollTop = this.element.scrollTop;
      this.scrollListener = this._handleScroll.bind(this);

      this._getScrollEventElement().addEventListener('scroll', this.scrollListener);

      this.modelEventListener = this._handleModelEvent.bind(this);
      dataProvider.addEventListener('mutate', this.modelEventListener);
      this.fetchSize = options.fetchSize > 0 ? options.fetchSize : 25;
      this.maxCount = options.maxCount > 0 ? options.maxCount : 500;
      this.rowCount = options.keys != null ? options.keys.length : this.fetchSize;
      this.viewportSize = -1;
      this.viewportPixelSize = this.element.offsetHeight;
      this.currentScrollTop = 0;
      this.currentRenderedPoint = {
        startIndex: 0,
        endIndex: isNaN(this.rowCount) ? this.fetchSize : this.rowCount,
        maxCountLimit: false,
        done: false,
        keys: options.keys
      };
      this.lastFetchTrigger = 0;
      this.checkViewportCount = 0;
    }

    _createClass(VirtualizeDomScroller, [{
      key: "checkViewport",
      value: function checkViewport() {
        if (this.currentRenderedPoint.done || this.currentRenderedPoint.maxCountLimit) {
          return true;
        }

        var flag = this._isRangeValid(0, this.currentRenderedPoint.end);

        if (!flag) {
          this.checkViewportCount += 1;

          if (this.checkViewportCount === DataCollectionUtils.CHECKVIEWPORT_THRESHOLD) {
            Logger.warn('Viewport not satisfied after multiple fetch, make sure the component is height constrained or specify a scroller.');
          }

          this._doFetch();
        } else {
          this.checkViewportCount = 0;
        }

        return flag;
      }
    }, {
      key: "_isRenderingViewportOnly",
      value: function _isRenderingViewportOnly(callback) {
        return this.options.strategy === exports.VirtualizationStrategy.VIEWPORT_ONLY && callback.getIndexForRange !== undefined;
      }
    }, {
      key: "setViewportRange",
      value: function setViewportRange(start, end) {
        if (this.currentRenderedPoint.start == null || this.currentRenderedPoint.end == null) {
          this.currentRenderedPoint.start = start;
          this.currentRenderedPoint.end = end;

          this._log('got pixel range: ' + start + ' to ' + end + ' for renderedPoint: ' + this.currentRenderedPoint.startIndex + ' ' + this.currentRenderedPoint.endIndex);
        }

        if (this._checkRenderedPoints()) {
          this.fetchPromise = null;

          if (this.currentScrollTop >= this.lastFetchTrigger) {
            this.nextFetchTrigger = undefined;
          }
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._getScrollEventElement().removeEventListener('scroll', this.scrollListener);

        this.dataProvider.removeEventListener('mutate', this.modelEventListener);
      }
    }, {
      key: "_getScrollEventElement",
      value: function _getScrollEventElement() {
        if (this.element === document.body || this.element === document.documentElement) {
          return window;
        }

        return this.element;
      }
    }, {
      key: "_getScrollTop",
      value: function _getScrollTop(element) {
        var scrollTop = 0;

        if (element === document.documentElement) {
          if (this.useBodyScrollTop === undefined) {
            this.useBodyScrollTop = this.initialScrollTop === element.scrollTop;
          }

          if (this.useBodyScrollTop) {
            return scrollTop + document.body.scrollTop;
          }
        }

        return scrollTop + element.scrollTop;
      }
    }, {
      key: "_setRangeLocal",
      value: function _setRangeLocal(startIndex, endIndex, start, end, maxCountLimit, done) {
        var _this2 = this;

        this._log('rendering row: ' + startIndex + ' to ' + endIndex + ' covering range: ' + (start == null ? 'unknown' : start) + ' to ' + (end == null ? 'unknown' : end));

        this.callback.beforeFetchByOffset(startIndex, endIndex);
        this.currentRenderedPoint = {
          startIndex: startIndex,
          endIndex: endIndex,
          start: start,
          end: end,
          maxCountLimit: maxCountLimit,
          done: done,
          keys: []
        };
        var options = {
          offset: startIndex,
          size: endIndex - startIndex
        };
        this.fetchByOffsetPromise = this.dataProvider.fetchByOffset(options).then(function (fetchResults) {
          var proceed = true;

          if (start != null && end != null) {
            proceed = _this2._isRangeValid(start, end);
          }

          if (proceed) {
            _this2._log('fetchByOffset ' + startIndex + ' to ' + endIndex + ' returned and result is still applicable');

            var data = [];
            var metadata = [];
            var keys = _this2.currentRenderedPoint.keys;
            fetchResults.results.forEach(function (result) {
              data.push(result.data);
              metadata.push(result.metadata);
              keys.push(result.metadata.key);
            });
            var ret = {};
            ret.startIndex = startIndex;
            ret.maxCountLimit = maxCountLimit;
            ret.done = done;
            ret.value = {};
            ret.value.data = data;
            ret.value.metadata = metadata;

            _this2.callback.fetchSuccess(ret);

            _this2.fetchByOffsetPromise = null;
          } else {
            _this2._log('fetchByOffset ' + startIndex + ' to ' + endIndex + ' returned but result is NO LONGER applicable');

            _this2.fetchByOffsetPromise = null;

            _this2.callback.fetchError('notValid');

            _this2._checkRenderedPoints();
          }
        });
      }
    }, {
      key: "_handleScrollerScrollTop",
      value: function _handleScrollerScrollTop(scrollTop, maxScrollTop) {
        this.currentScrollTop = scrollTop;

        if (!this.fetchPromise && this.asyncIterator) {
          if (isNaN(this.nextFetchTrigger) && this.lastMaxScrollTop !== maxScrollTop) {
            this.nextFetchTrigger = Math.max(0, (maxScrollTop - scrollTop) / 2);
            this.lastFetchTrigger = scrollTop;
            this.lastMaxScrollTop = maxScrollTop;

            this._log('next fetch trigger point: ' + Math.round(this.nextFetchTrigger));
          }

          if (this.nextFetchTrigger != null && scrollTop - this.lastFetchTrigger > this.nextFetchTrigger) {
            this._doFetch();

            return;
          }

          if (maxScrollTop - scrollTop < 1) {
            this._doFetch();

            return;
          }
        }

        if (this.fetchPromise && scrollTop > this.lastFetchTrigger) {
          return;
        }

        this._checkRenderedPoints();
      }
    }, {
      key: "_isRangeValid",
      value: function _isRangeValid(start, end) {
        var scrollTop = this.currentScrollTop;
        this.viewportPixelSize = this.element.offsetHeight;

        if (scrollTop >= start && scrollTop + this.viewportPixelSize <= end) {
          return true;
        }

        return false;
      }
    }, {
      key: "_checkRenderedPoints",
      value: function _checkRenderedPoints() {
        if (this.currentRenderedPoint.start == null || this.currentRenderedPoint.end == null) {
          return true;
        }

        if (this._isRangeValid(this.currentRenderedPoint.start, this.currentRenderedPoint.end)) {
          return true;
        }

        if (this._isRenderingViewportOnly(this.callback)) {
          var vCallback = this.callback;
          var start = Math.max(0, this.currentScrollTop - this.viewportPixelSize);
          var end = Math.min(this.currentScrollTop + this.viewportPixelSize * 2);
          var indexRange = vCallback.getIndexForRange(start, end);
          var startIndex = Math.max(0, indexRange.startIndex);
          var endIndex = indexRange.endIndex == null ? this.rowCount : Math.min(this.rowCount, indexRange.endIndex);

          if (startIndex < this.currentRenderedPoint.startIndex || endIndex > this.currentRenderedPoint.endIndex) {
            var done = endIndex === this.lastIndex;
            var maxCountLimit = endIndex === this.maxCount;

            this._setRangeLocal(startIndex, endIndex, start, end, maxCountLimit, done);

            return false;
          }
        }

        return true;
      }
    }, {
      key: "_doFetch",
      value: function _doFetch() {
        var _this3 = this;

        this._log('fetching next set of rows from asyncIterator');

        var beforeFetchCallback = this.callback.beforeFetchNext();

        if (beforeFetchCallback) {
          if (this.viewportSize === -1) {
            this.viewportSize = this.currentRenderedPoint.endIndex - this.currentRenderedPoint.startIndex;
          }

          this.fetchPromise = this._fetchMoreRows().then(function (result) {
            if (result.maxCountLimit) {
              _this3._log('reached max count');

              var start = result.size > 0 ? null : _this3.currentRenderedPoint.start;
              var end = result.size > 0 ? null : _this3.currentRenderedPoint.end;

              _this3._setRangeLocal(_this3.currentRenderedPoint.startIndex, _this3.maxCount, start, end, true, false);

              _this3.fetchPromise = null;
              _this3.asyncIterator = null;
            } else if (result.size > 0 || result.done === true) {
              var minIndex = 0;

              if (_this3._isRenderingViewportOnly(_this3.callback)) {
                minIndex = _this3.callback.getIndexForPosition(_this3.currentScrollTop);
              }

              var renderedStartIndex = minIndex;
              var renderedEndIndex = _this3.currentRenderedPoint.endIndex + result.size;

              if (result.done) {
                _this3.lastIndex = renderedEndIndex;
              }

              _this3._setRangeLocal(renderedStartIndex, renderedEndIndex, null, null, false, result.done);
            }
          }, function (reason) {
            _this3.callback.fetchError(reason);

            _this3.fetchPromise = null;
            _this3.nextFetchTrigger = undefined;
          });
        } else {
          this._log('fetch is aborted due to beforeFetchCallback returning false');

          this.nextFetchTrigger = undefined;
        }
      }
    }, {
      key: "_fetchMoreRows",
      value: function _fetchMoreRows() {
        var _this4 = this;

        if (!this.fetchPromise) {
          var remainingCount = this.maxCount - this.rowCount;

          if (remainingCount > 0) {
            if (!this.currentRenderedPoint.done && this.asyncIterator != null) {
              this.fetchPromise = this.asyncIterator.next().then(function (result) {
                _this4.fetchPromise = null;
                var status;

                if (result != null) {
                  status = {
                    done: result.done,
                    maxCountLimit: result.maxCountLimit
                  };

                  if (result.value != null) {
                    status.size = result.value.data.length;
                    _this4.rowCount += result.value.data.length;

                    if (remainingCount < _this4.fetchSize) {
                      status.maxCountLimit = true;

                      if (result.value.data.length > remainingCount) {
                        status.size = remainingCount;
                      }
                    }
                  }

                  if (status.maxCountLimit) {
                    _this4.asyncIterator = null;
                  }
                }

                return Promise.resolve(status);
              });
              return this.fetchPromise;
            }
          }

          return Promise.resolve({
            maxCount: this.maxCount,
            maxCountLimit: true
          });
        }

        return this.fetchPromise;
      }
    }, {
      key: "_handleModelInsert",
      value: function _handleModelInsert(beforeKeys, keys) {
        var _this5 = this;

        var currentKeys = this.currentRenderedPoint.keys;
        beforeKeys.forEach(function (beforeKey, i) {
          var index = currentKeys.indexOf(beforeKey);
          var key = keys[i];

          if (index > -1) {
            currentKeys.splice(index, 0, key);
          }
        });
        var indexes = [];
        var currentStartIndex = this.currentRenderedPoint.startIndex;
        keys.forEach(function (key) {
          var index = currentKeys.indexOf(key);

          if (index > -1) {
            indexes.push(index + currentStartIndex);
          } else {
            _this5.currentRenderedPoint.done = false;
          }
        });
        return indexes;
      }
    }, {
      key: "_handleModelDelete",
      value: function _handleModelDelete(keys) {
        var indexes = [];
        var currentStartIndex = this.currentRenderedPoint.startIndex;
        var currentKeys = this.currentRenderedPoint.keys;
        var keysToRemove = [];
        keys.forEach(function (key) {
          var index = currentKeys.indexOf(key);

          if (index > -1) {
            indexes.push(currentStartIndex + index);
            keysToRemove.push(key);
          }
        });
        keysToRemove.forEach(function (key) {
          currentKeys.splice(currentKeys.indexOf(key), 1);
        });
        return indexes;
      }
    }, {
      key: "_updateRenderedPoint",
      value: function _updateRenderedPoint(index, renderedPoint, op) {
        if (index < renderedPoint.startIndex) {
          if (op === 'added') {
            renderedPoint.startIndex = renderedPoint.startIndex + 1;
            renderedPoint.endIndex = renderedPoint.endIndex + 1;
          } else if (op === 'removed') {
            renderedPoint.startIndex = renderedPoint.startIndex - 1;
            renderedPoint.endIndex = renderedPoint.endIndex - 1;
          }
        } else if (index <= renderedPoint.endIndex) {
          if (op === 'added') {
            renderedPoint.endIndex = renderedPoint.endIndex + 1;
          } else if (op === 'removed') {
            renderedPoint.endIndex = renderedPoint.endIndex - 1;
          }
        }
      }
    }, {
      key: "_handleItemsAddedOrRemoved",
      value: function _handleItemsAddedOrRemoved(indexes, op) {
        var _this6 = this;

        indexes.forEach(function (index) {
          _this6._updateRenderedPoint(index, _this6.currentRenderedPoint, op);
        });
      }
    }, {
      key: "_log",
      value: function _log(msg) {
        Logger.info('[VirtualizeDomScroller]=> ' + msg);
      }
    }]);

    return VirtualizeDomScroller;
  }();

  var IteratingDataProviderContentHandler = /*#__PURE__*/function (_DataProviderContentH) {
    _inherits(IteratingDataProviderContentHandler, _DataProviderContentH);

    var _super = _createSuper(IteratingDataProviderContentHandler);

    function IteratingDataProviderContentHandler(root, dataProvider, callback, scrollPolicyOptions) {
      var _this7;

      _classCallCheck(this, IteratingDataProviderContentHandler);

      _this7 = _super.call(this, root, dataProvider, callback);
      _this7.root = root;
      _this7.dataProvider = dataProvider;
      _this7.callback = callback;
      _this7.scrollPolicyOptions = scrollPolicyOptions;

      _this7.fetchRows = function () {
        if (_this7.isReady()) {
          _this7.setFetching(true);

          var options = {
            clientId: _this7._clientId
          };
          options.size = _this7._isLoadMoreOnScroll() ? _this7.getFetchSize() : -1;
          _this7.dataProviderAsyncIterator = _this7.getDataProvider().fetchFirst(options)[Symbol.asyncIterator]();

          var busyStateResolveFunc = _this7.addBusyState('call next on iterator');

          var promise = _this7.dataProviderAsyncIterator.next();

          var fetchSize = options.size;

          var helperFunction = function helperFunction(value) {
            if (value.done || fetchSize !== -1 || typeof _this7.getDataProvider().getPageCount === 'function') {
              return value;
            }

            var nextPromise = _this7.dataProviderAsyncIterator.next();

            var fetchMoreData = nextPromise.then(function (nextValue) {
              value.done = nextValue.done;
              value.value.data = value.value.data.concat(nextValue.value.data);
              value.value.metadata = value.value.metadata.concat(value.value.metadata);
              return helperFunction(value);
            }, function (reason) {
              this.fetchError(reason);
            });
            return fetchMoreData;
          };

          promise.then(function (value) {
            return helperFunction(value);
          }, function (reason) {
            busyStateResolveFunc();

            _this7.fetchError(reason);
          }).then(function (value) {
            if (_this7.isFetching()) {
              busyStateResolveFunc();

              if (_this7.callback == null) {
                return;
              }

              _this7.initialFetch = true;

              _this7.callback.setData(value);
            }
          }, function (reason) {
            busyStateResolveFunc();

            _this7.fetchError(reason);
          });
        }
      };

      _this7._registerDomScroller = function (keys) {
        var options = {
          fetchSize: _this7.getFetchSize(),
          maxCount: _this7._getMaxCount(),
          keys: keys,
          strategy: _this7.isRenderingViewportOnly() ? exports.VirtualizationStrategy.VIEWPORT_ONLY : exports.VirtualizationStrategy.HIGH_WATER_MARK
        };
        _this7.domScroller = new VirtualizeDomScroller(_this7._getScroller(), _this7.getDataProvider(), _this7.dataProviderAsyncIterator, _assertThisInitialized(_this7), options);
      };

      _this7._clientId = Symbol();
      return _this7;
    }

    _createClass(IteratingDataProviderContentHandler, [{
      key: "getDataProvider",
      value: function getDataProvider() {
        if (this.wrappedDataProvider == null) {
          var capability = this.dataProvider.getCapability('fetchCapability');

          if (capability == null || capability.caching == null || capability.caching == 'none') {
            this.wrappedDataProvider = new CachedIteratorResultsDataProvider(this.dataProvider);
          } else {
            this.wrappedDataProvider = this.dataProvider;
          }
        }

        return this.wrappedDataProvider;
      }
    }, {
      key: "setDataProvider",
      value: function setDataProvider(dataProvider) {
        this.wrappedDataProvider = null;
        this.dataProvider = dataProvider;
      }
    }, {
      key: "postRender",
      value: function postRender() {
        this.initialFetch = false;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(IteratingDataProviderContentHandler.prototype), "destroy", this).call(this);

        if (this.domScroller) {
          this.domScroller.destroy();
        }
      }
    }, {
      key: "isRenderingViewportOnly",
      value: function isRenderingViewportOnly() {
        return false;
      }
    }, {
      key: "_isLoadMoreOnScroll",
      value: function _isLoadMoreOnScroll() {
        return true;
      }
    }, {
      key: "_getScroller",
      value: function _getScroller() {
        var scroller = this.scrollPolicyOptions.scroller;
        return scroller != null ? scroller : this.root;
      }
    }, {
      key: "getFetchSize",
      value: function getFetchSize() {
        return this.scrollPolicyOptions.fetchSize;
      }
    }, {
      key: "_getMaxCount",
      value: function _getMaxCount() {
        return this.scrollPolicyOptions.maxCount;
      }
    }, {
      key: "isInitialFetch",
      value: function isInitialFetch() {
        return this.initialFetch;
      }
    }, {
      key: "renderSkeletonsForLoadMore",
      value: function renderSkeletonsForLoadMore() {}
    }, {
      key: "renderFetchedData",
      value: function renderFetchedData() {
        if (this.callback == null) {
          return;
        }

        var result = [];
        var dataObj = this.callback.getData();

        if (dataObj == null || dataObj.value == null) {
          return result;
        }

        var data = dataObj.value.data;
        var metadata = dataObj.value.metadata;
        var startIndex = dataObj.startIndex === undefined ? 0 : dataObj.startIndex;

        if (data.length === metadata.length) {
          result.push(this.renderData(data, metadata, startIndex));

          if (this._isLoadMoreOnScroll()) {
            if (!dataObj.done) {
              if (data.length === 0) {
                Logger.info('handleFetchedData: zero data returned while done flag is false');
              }

              if (!dataObj.maxCountLimit) {
                if (this.domScroller == null) {
                  var keys = metadata.map(function (metadata) {
                    return metadata.key;
                  });

                  this._registerDomScroller(keys);
                }

                result.push(this.renderSkeletonsForLoadMore());
              }
            }

            if (dataObj.maxCountLimit) {
              this._handleScrollerMaxRowCount();
            }
          }

          this.setFetching(false);
          return result;
        }
      }
    }, {
      key: "beforeFetchNext",
      value: function beforeFetchNext() {
        if (this.domScrollerFetchResolve != null) {
          return false;
        }

        this.domScrollerFetchResolve = this.addBusyState('dom scroller call next on iterator');
        return true;
      }
    }, {
      key: "beforeFetchByOffset",
      value: function beforeFetchByOffset(startIndex, endIndex) {
        if (this.domScrollerFetchResolve == null) {
          this.domScrollerFetchResolve = this.addBusyState('dom scroller call next on iterator');
        }

        return true;
      }
    }, {
      key: "fetchSuccess",
      value: function fetchSuccess(result) {
        this.domScrollerFetchResolve();
        this.domScrollerFetchResolve = null;

        if (result != null) {
          this.callback.setData(result);
        }
      }
    }, {
      key: "fetchError",
      value: function fetchError(reason) {
        this.domScrollerFetchResolve();
        this.domScrollerFetchResolve = null;

        if (reason !== 'notValid') {
          Logger.error('an error occurred during data fetch, reason: ' + reason);
        }
      }
    }, {
      key: "_handleScrollerMaxRowCount",
      value: function _handleScrollerMaxRowCount() {}
    }, {
      key: "renderData",
      value: function renderData(data, metadata, startIndex) {
        if (this.callback == null) {
          return null;
        }

        var children = [];

        for (var i = 0; i < data.length; i++) {
          if (data[i] == null || metadata[i] == null) {
            continue;
          }

          if (!this.verifyKey(metadata[i].key)) {
            Logger.error('encounted a key with invalid data type.  Acceptable data types for key are: ' + this.validKeyTypes);
            children = [];
            break;
          }

          var child = this.addItem(metadata[i].key, i + startIndex, data[i], true);

          if (child) {
            children.push(child);
          }
        }

        return children;
      }
    }, {
      key: "_handleItemsMutated",
      value: function _handleItemsMutated(detail, keyField, withinRangeDataCallback) {
        this.callback.updateData(function (currentData) {
          var _this8 = this;

          var newData = {
            startIndex: currentData.startIndex,
            done: currentData.done,
            value: {
              data: currentData.value.data.slice(0),
              metadata: currentData.value.metadata.slice(0)
            }
          };
          var indexes = detail.indexes;
          var keys = Array.from(detail[keyField]);

          if (indexes == null) {
            indexes = keys.map(function (key) {
              return _this8._findIndex(currentData.value.metadata, key);
            });
          }

          var startIndex = isNaN(currentData.startIndex) ? 0 : currentData.startIndex;
          var endIndex = Math.max(startIndex + currentData.value.data.length, this.getFetchSize());
          indexes.forEach(function (index, i) {
            var key = keys[i];
            var data = detail.data != null ? detail.data[i] : null;
            var metadata = detail.metadata != null ? detail.metadata[i] : null;

            if (index >= startIndex && index <= endIndex) {
              withinRangeDataCallback(newData, key, index, data, metadata);
            }
          });
          return {
            renderedData: newData
          };
        }.bind(this));
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
    }, {
      key: "handleModelRefresh",
      value: function handleModelRefresh() {
        if (this.domScroller) {
          this.domScroller.destroy();
        }

        this.domScroller = null;

        _get(_getPrototypeOf(IteratingDataProviderContentHandler.prototype), "handleModelRefresh", this).call(this);
      }
    }, {
      key: "handleItemsAdded",
      value: function handleItemsAdded(detail) {
        this.callback.updateData(function (currentData) {
          var newData = {
            startIndex: currentData.startIndex,
            done: currentData.done,
            maxCountLimit: currentData.maxCountLimit,
            value: {
              data: currentData.value.data.slice(0),
              metadata: currentData.value.metadata.slice(0)
            }
          };
          var indexes = detail.indexes;
          var addBeforeKeys = detail.addBeforeKeys;
          var keys = detail.keys;

          if (indexes == null && addBeforeKeys == null) {
            if (newData.done && !newData.maxCountLimit) {
              newData.value.data.push(detail.data);
              newData.value.metadata.push(detail.metadata);
            }
          } else {
            var i = 0;
            keys.forEach(function () {
              var data = detail.data[i];
              var metadata = detail.metadata[i];
              var index = -1;

              if (indexes != null && indexes[i] != null) {
                index = indexes[i];
              } else if (addBeforeKeys != null && addBeforeKeys[i] != null) {
                index = this._findIndex(newData.value.metadata, addBeforeKeys[i]);
              }

              if (index > -1 && index < newData.value.data.length) {
                newData.value.data.splice(index, 0, data);
                newData.value.metadata.splice(index, 0, metadata);
              } else if (newData.done && !newData.maxCountLimit) {
                newData.done = false;
              }

              i++;
            }.bind(this));
          }

          return {
            renderedData: newData
          };
        }.bind(this));

        _get(_getPrototypeOf(IteratingDataProviderContentHandler.prototype), "handleItemsAdded", this).call(this, detail);
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {
        var _this9 = this;

        this._handleItemsMutated(detail, 'keys', function (newData, key) {
          var index = _this9._findIndex(newData.value.metadata, key);

          if (index > -1) {
            newData.value.data.splice(index, 1);
            newData.value.metadata.splice(index, 1);
          }
        });

        _get(_getPrototypeOf(IteratingDataProviderContentHandler.prototype), "handleItemsRemoved", this).call(this, detail);
      }
    }, {
      key: "handleCurrentRangeItemUpdated",
      value: function handleCurrentRangeItemUpdated(key) {}
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {
        var _this10 = this;

        this._handleItemsMutated(detail, 'keys', function (newData, key, index, data, metadata) {
          newData.value.data.splice(index, 1, data);
          newData.value.metadata.splice(index, 1, metadata);

          _this10.handleCurrentRangeItemUpdated(key);
        });

        _get(_getPrototypeOf(IteratingDataProviderContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }]);

    return IteratingDataProviderContentHandler;
  }(DataProviderContentHandler);

  var IteratingTreeDataProviderContentHandler = /*#__PURE__*/function (_DataProviderContentH2) {
    _inherits(IteratingTreeDataProviderContentHandler, _DataProviderContentH2);

    var _super2 = _createSuper(IteratingTreeDataProviderContentHandler);

    function IteratingTreeDataProviderContentHandler(root, dataProvider, callback, scrollPolicyOptions) {
      var _this11;

      _classCallCheck(this, IteratingTreeDataProviderContentHandler);

      _this11 = _super2.call(this, root, dataProvider, callback);
      _this11.root = root;
      _this11.dataProvider = dataProvider;
      _this11.callback = callback;
      _this11.scrollPolicyOptions = scrollPolicyOptions;

      _this11.fetchRows = function () {
        if (_this11.isReady()) {
          var options = {
            clientId: _this11._clientId
          };
          options.size = _this11._isLoadMoreOnScroll() ? _this11.getFetchSize() : -1;

          var iterator = _this11.getDataProvider().fetchFirst(options)[Symbol.asyncIterator]();

          _this11._cachedIteratorsAndResults['root'] = {
            iterator: iterator,
            cache: null
          };
          var finalResults = {
            value: {
              data: [],
              metadata: []
            }
          };

          _this11._fetchNextFromIterator(iterator, null, options, finalResults).then(_this11._setNewData);
        }
      };

      _this11._fetchNextFromIterator = function (iterator, key, options, finalResults) {
        if (iterator == null) {
          return Promise.resolve();
        }

        _this11.setFetching(true);

        var busyStateResolveFunc = _this11.addBusyState('call next on iterator');

        var promise = iterator.next();
        var fetchSize = options.size;

        var helperFunction = function helperFunction(value) {
          if (value.done || fetchSize !== -1 || typeof _this11.getDataProvider().getPageCount === 'function') {
            return value;
          }

          var nextPromise = iterator.next();
          var fetchMoreData = nextPromise.then(function (nextValue) {
            value.done = nextValue.done;
            value.value.data = value.value.data.concat(nextValue.value.data);
            value.value.metadata = value.value.metadata.concat(value.value.metadata);
            return helperFunction(value);
          }, function (reason) {
            this._handleFetchError(reason);
          });
          return fetchMoreData;
        };

        return promise.then(function (value) {
          return helperFunction(value);
        }, function () {
          busyStateResolveFunc();

          _this11._handleFetchError();
        }).then(function (value) {
          if (_this11.isFetching()) {
            busyStateResolveFunc();

            _this11.setFetching(false);

            if (_this11.callback == null || value == null) {
              return;
            }

            _this11.initialFetch = true;

            if (value.done && _this11._cachedIteratorsAndResults[key === null ? 'root' : key]) {
              _this11._cachedIteratorsAndResults[key === null ? 'root' : key].iterator = null;
            }

            return _this11.handleNextItemInResults(options, key, value, finalResults);
          }
        }, function () {
          busyStateResolveFunc();

          _this11._handleFetchError();
        });
      };

      _this11._setNewData = function (result) {
        if (_this11.callback == null) {
          return;
        }

        _this11.callback.updateData(function (data) {
          var final;
          var dataToSet = result.value.data;
          var metadataToSet = result.value.metadata;

          if (data == null) {
            final = {
              value: {
                data: dataToSet,
                metadata: metadataToSet
              },
              done: this._checkIteratorAndCache()
            };
          } else {
            final = {
              value: {
                data: data.value.data.concat(dataToSet),
                metadata: data.value.metadata.concat(metadataToSet)
              },
              done: this._checkIteratorAndCache()
            };
          }

          return {
            renderedData: final
          };
        }.bind(_assertThisInitialized(_this11)));
      };

      _this11._checkIteratorAndCache = function () {
        var cache = _this11._cachedIteratorsAndResults;
        var values = Object.keys(cache).map(function (e) {
          return cache[e];
        });
        var done = true;
        values.forEach(function (value) {
          if (value && (value.iterator != null || value.cache != null)) {
            done = false;
          }
        });
        return done;
      };

      _this11.fetchMoreRows = function () {
        if (_this11.isReady()) {
          var lastEntryMetadata = _this11._getLastEntryMetadata();

          var key = lastEntryMetadata.key;

          if (lastEntryMetadata.isLeaf || !_this11._isExpanded(key)) {
            key = lastEntryMetadata.parentKey;
          }

          var options = {};
          options.size = _this11._isLoadMoreOnScroll() ? _this11.getFetchSize() : -1;
          var cacheInfo = _this11._cachedIteratorsAndResults[key === null ? 'root' : key];
          var result = null;
          var iterator = null;

          if (cacheInfo != null) {
            result = cacheInfo.cache;
            iterator = cacheInfo.iterator;
          }

          var finalResults = {
            value: {
              data: [],
              metadata: []
            }
          };
          return _this11.handleNextItemInResults(options, key, result, finalResults).then(function () {
            var newCacheInfo = this._cachedIteratorsAndResults[key === null ? 'root' : key];
            var newIterator;

            if (newCacheInfo != null) {
              newIterator = newCacheInfo.iterator;
            }

            return this._fetchFromAncestors(options, key, newIterator, finalResults);
          }.bind(_assertThisInitialized(_this11)));
        }

        return Promise.resolve();
      };

      _this11._fetchFromAncestors = function (options, key, iterator, finalResults) {
        var self = _assertThisInitialized(_this11);

        if (self._checkFinalResults(options, finalResults)) {
          finalResults.done = _this11._checkIteratorAndCache();
          return Promise.resolve(finalResults);
        }

        var handleFetchFromAncestors = function handleFetchFromAncestors(lastParentKey, finalResults) {
          if (self._checkFinalResults(options, finalResults) || lastParentKey === null) {
            finalResults.done = this._checkIteratorAndCache();
            return Promise.resolve(finalResults);
          }

          var lastEntry = self._getItemByKey(lastParentKey, finalResults);

          var lastEntryParentKey = lastEntry.metadata.parentKey;
          var cacheInfo = this._cachedIteratorsAndResults[lastEntryParentKey === null ? 'root' : lastEntryParentKey];
          var result = null;
          var parentIterator = null;

          if (cacheInfo != null) {
            result = cacheInfo.cache;
            parentIterator = cacheInfo.iterator;
          }

          return this.handleNextItemInResults(options, lastEntryParentKey, result, finalResults).then(this._fetchFromAncestors.bind(this, options, lastEntryParentKey, parentIterator, finalResults));
        };

        return _this11._fetchNextFromIterator(iterator, key, options, finalResults).then(handleFetchFromAncestors.bind(_assertThisInitialized(_this11), key, finalResults));
      };

      _this11._getLastEntryMetadata = function () {
        var result = _this11.callback.getData();

        if (result && result.value.metadata.length) {
          var metadata = result.value.metadata;
          return metadata[metadata.length - 1];
        }

        return null;
      };

      _this11._isExpanded = function (key) {
        var expanded = _this11.callback.getExpanded();

        return expanded.has(key);
      };

      _this11.getChildDataProvider = function (parentKey) {
        if (parentKey == null) {
          return _this11.dataProvider;
        }

        return _this11.dataProvider.getChildDataProvider(parentKey);
      };

      _this11.handleNextItemInResults = function (options, parentKey, results, finalResults) {
        if (results === null || results.value.data.length === 0 || _this11._checkFinalResults(options, finalResults)) {
          if (results != null && results.value.data.length) {
            if (_this11._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey]) {
              _this11._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache = results;
            }
          } else if (_this11._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey]) {
            _this11._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache = null;
          }

          if (_this11._checkFinalResults(options, finalResults) || _this11._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].iterator == null) {
            finalResults.done = _this11._checkIteratorAndCache();
            return Promise.resolve(finalResults);
          }

          return _this11._fetchNextFromIterator(_this11._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].iterator, parentKey, options, finalResults);
        }

        var data = results.value.data.shift();
        var metadata = results.value.metadata.shift();

        var updatedMetadata = _this11._updateMetadata(metadata, parentKey, finalResults);

        finalResults.value.data.push(data);
        finalResults.value.metadata.push(updatedMetadata);

        if (_this11._isExpanded(updatedMetadata.key)) {
          var childDataProvider = _this11.getChildDataProvider(updatedMetadata.key);

          if (childDataProvider != null) {
            var _options = {
              clientId: _this11._clientId
            };
            _options.size = _this11._isLoadMoreOnScroll() ? _this11.getFetchSize() : -1;
            var iterator = childDataProvider.fetchFirst(_options)[Symbol.asyncIterator]();
            _this11._cachedIteratorsAndResults[updatedMetadata.key === null ? 'root' : updatedMetadata.key] = {
              iterator: iterator,
              cache: null
            };

            var childrenPromise = _this11._fetchNextFromIterator(iterator, updatedMetadata.key, _options, finalResults);

            return childrenPromise.then(_this11.handleNextItemInResults.bind(_assertThisInitialized(_this11), _options, parentKey, results, finalResults));
          }
        }

        return _this11.handleNextItemInResults(options, parentKey, results, finalResults);
      };

      _this11._checkFinalResults = function (options, finalResults) {
        if (finalResults.value.data.length >= options.size && options.size !== -1) {
          return true;
        }

        return false;
      };

      _this11._updateMetadata = function (metadata, parentKey, finalResults) {
        var treeDepth = 0;

        var lastEntry = _this11._getLastItemByParentKey(parentKey, finalResults);

        var indexFromParent = lastEntry == null ? 0 : lastEntry.metadata.indexFromParent + 1;
        var isLeaf = _this11.getChildDataProvider(metadata.key) === null;

        if (parentKey != null) {
          var parentItem = _this11._getItemByKey(parentKey, finalResults);

          treeDepth = parentItem.metadata.treeDepth + 1;
        }

        var expanded = _this11._isExpanded(metadata.key);

        return {
          key: metadata.key,
          isLeaf: isLeaf,
          parentKey: parentKey,
          indexFromParent: indexFromParent,
          treeDepth: treeDepth,
          expanded: expanded
        };
      };

      _this11._getIndexByKey = function (key, cache) {
        var index = -1;
        cache.some(function (item, i) {
          if (item.key === key) {
            index = i;
            return true;
          }
        });
        return index;
      };

      _this11._getLastItemByParentKey = function (parentKey, finalResults) {
        var returnItem = null;

        if (finalResults) {
          finalResults.value.metadata.slice().reverse().some(function (metadata, index) {
            if (metadata.parentKey === parentKey) {
              returnItem = {
                data: finalResults.value.data[index],
                metadata: metadata
              };
              return true;
            }
          });
        }

        if (returnItem) return returnItem;

        var cache = _this11.callback.getData();

        if (cache) {
          cache.value.metadata.slice().reverse().some(function (metadata, index) {
            if (metadata.parentKey === parentKey) {
              returnItem = {
                data: cache.value.data[index],
                metadata: metadata
              };
              return true;
            }
          });
        }

        return returnItem;
      };

      _this11._getItemByKey = function (key, finalResults) {
        var returnItem = null;

        if (finalResults) {
          finalResults.value.metadata.some(function (metadata, index) {
            if (metadata.key === key) {
              returnItem = {
                data: finalResults.value.data[index],
                metadata: metadata
              };
              return true;
            }
          });
        }

        if (returnItem) return returnItem;

        var cache = _this11.callback.getData();

        if (cache) {
          cache.value.metadata.some(function (metadata, index) {
            if (metadata.key === key) {
              returnItem = {
                data: cache.value.data[index],
                metadata: metadata
              };
              return true;
            }
          });
        }

        return returnItem;
      };

      _this11.expand = function (key) {
        var childDataProvider = _this11.getChildDataProvider(key);

        if (childDataProvider === null) {
          return;
        }

        var showSkeletonTimeout = setTimeout(function () {
          if (this.callback.getExpandingKeys().has(key)) {
            this.callback.updateSkeletonKeys(key);
          }
        }.bind(_assertThisInitialized(_this11)), 250);

        var fetchSize = _this11.getFetchSize();

        var options = {
          clientId: _this11._clientId,
          size: fetchSize
        };
        var iterator = childDataProvider.fetchFirst(options)[Symbol.asyncIterator]();
        _this11._cachedIteratorsAndResults[key] = {
          iterator: iterator,
          cache: null
        };
        return _this11._fetchNextFromIterator(iterator, key, options, {
          value: {
            data: [],
            metadata: []
          }
        }).then(function (finalResults) {
          if (this.callback == null) {
            return;
          }

          this.callback.updateExpand(function (result, skeletonKeys, expandingKeys, expanded) {
            if (showSkeletonTimeout) {
              clearTimeout(showSkeletonTimeout);
            }

            if (skeletonKeys.has(key)) {
              skeletonKeys = skeletonKeys.delete([key]);
            }

            if (!expandingKeys.has(key) || !expanded.has(key)) {
              return {
                expandedSkeletonKeys: skeletonKeys
              };
            } else if (finalResults == null) {
              return {
                expandedSkeletonKeys: skeletonKeys,
                expandingKeys: expandingKeys.delete([key])
              };
            }

            var updatedData;
            var newData = finalResults.value.data;
            var newMetadata = finalResults.value.metadata;
            var recacheData;
            var recacheMetadata;

            if (result) {
              var data = result.value.data;
              var metadata = result.value.metadata;

              var insertIndex = this._getIndexByKey(key, metadata);

              if (insertIndex !== -1) {
                var fetchedCount = newData.length;
                var dataToSet = data.slice(0, insertIndex + 1).concat(newData);
                var metadataToSet = metadata.slice(0, insertIndex + 1).concat(newMetadata);
                var done = result.done;

                if (fetchedCount < fetchSize) {
                  dataToSet = dataToSet.concat(data.slice(insertIndex + 1));
                  metadataToSet = metadataToSet.concat(metadata.slice(insertIndex + 1));
                } else {
                  recacheData = data.slice(insertIndex + 1);
                  recacheMetadata = metadata.slice(insertIndex + 1);

                  if (recacheData.length > 0) {
                    done = false;

                    if (this.domScroller != null) {
                      this.domScroller.setAsyncIterator({
                        next: this.fetchMoreRows.bind(this)
                      });
                    }
                  }
                }

                updatedData = {
                  value: {
                    data: dataToSet,
                    metadata: metadataToSet
                  },
                  done: done
                };
              }
            }

            if (updatedData == null) {
              updatedData = {
                value: {
                  data: newData,
                  metadata: newMetadata
                },
                done: true
              };
            }

            if (recacheData != null) {
              this._recacheData(recacheData, recacheMetadata);
            }

            expandingKeys = expandingKeys.delete([key]);
            return {
              expandedSkeletonKeys: skeletonKeys,
              expandingKeys: expandingKeys,
              renderedData: updatedData
            };
          }.bind(this));
        }.bind(_assertThisInitialized(_this11)));
      };

      _this11._recacheData = function (data, metadata) {
        for (var i = data.length - 1; i >= 0; i--) {
          var itemData = data[i];
          var itemMetadata = metadata[i];
          var parentKey = itemMetadata.parentKey;
          var currentParentKeyCache = _this11._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache;

          if (currentParentKeyCache == null) {
            _this11._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache = {
              done: false,
              value: {
                data: [itemData],
                metadata: [itemMetadata]
              }
            };
          } else {
            currentParentKeyCache.value.data.unshift(itemData);
            currentParentKeyCache.value.metadata.unshift(itemMetadata);
          }
        }
      };

      _this11._getLocalDescendentCount = function (metadata, index) {
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

      _this11._registerDomScroller = function () {
        var options = {
          asyncIterator: {
            next: _this11.fetchMoreRows.bind(_assertThisInitialized(_this11))
          },
          fetchSize: _this11.getFetchSize(),
          fetchTrigger: _this11.callback.getSkeletonHeight() * _this11.getLoadMoreCount(),
          maxCount: _this11._getMaxCount(),
          initialRowCount: _this11.getFetchSize(),
          strategy: exports.VirtualizationStrategy.HIGH_WATER_MARK,
          isOverflow: _this11._getOverflowFunc(),
          success: function success(result) {
            _this11.handleFetchSuccess(result);
          },
          error: function error() {
            _this11._handleFetchError();
          },
          beforeFetch: function beforeFetch() {
            return _this11.handleBeforeFetchNext();
          },
          beforeFetchByOffset: function beforeFetchByOffset() {
            _this11.handleBeforeFetchByOffset();
          }
        };
        _this11.domScroller = new DomScroller(_this11._getScroller(), _this11.getDataProvider(), options);
      };

      _this11.getLoadMoreCount = function () {
        return 0;
      };

      _this11._getOverflowFunc = function () {
        var scroller = _this11._getScroller();

        if (scroller !== _this11.root) {
          return _this11._isLastItemInViewport.bind(_assertThisInitialized(_this11));
        }

        return null;
      };

      _this11._isLastItemInViewport = function () {
        var styleClass = '.' + _this11.callback.getItemStyleClass() + ', .' + _this11.callback.getGroupStyleClass();

        var items = _this11.root.querySelectorAll(styleClass);

        var lastItem = items[items.length - 1];

        if (lastItem) {
          var lastItemBounds = lastItem.getBoundingClientRect();

          if (lastItemBounds.top >= 0 && lastItemBounds.bottom <= document.documentElement.clientHeight) {
            return false;
          }
        }

        return true;
      };

      _this11._cachedIteratorsAndResults = {};
      _this11._clientId = Symbol();
      return _this11;
    }

    _createClass(IteratingTreeDataProviderContentHandler, [{
      key: "postRender",
      value: function postRender() {
        this.initialFetch = false;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(IteratingTreeDataProviderContentHandler.prototype), "destroy", this).call(this);

        if (this.domScroller) {
          this.domScroller.destroy();
        }
      }
    }, {
      key: "_isLoadMoreOnScroll",
      value: function _isLoadMoreOnScroll() {
        return true;
      }
    }, {
      key: "_getScroller",
      value: function _getScroller() {
        var scroller = this.scrollPolicyOptions.scroller;
        return scroller != null ? scroller : this.root;
      }
    }, {
      key: "getFetchSize",
      value: function getFetchSize() {
        return this.scrollPolicyOptions.fetchSize;
      }
    }, {
      key: "_getMaxCount",
      value: function _getMaxCount() {
        return this.scrollPolicyOptions.maxCount;
      }
    }, {
      key: "isInitialFetch",
      value: function isInitialFetch() {
        return this.initialFetch;
      }
    }, {
      key: "renderSkeletonsForLoadMore",
      value: function renderSkeletonsForLoadMore() {}
    }, {
      key: "renderSkeletonsForExpand",
      value: function renderSkeletonsForExpand(key) {}
    }, {
      key: "renderFetchedData",
      value: function renderFetchedData() {
        if (this.callback == null) {
          return;
        }

        var result = this._renderOutOfRangeData();

        var dataObj = this.callback.getData();

        if (dataObj == null || dataObj.value == null) {
          return result;
        }

        var data = dataObj.value.data;
        var metadata = dataObj.value.metadata;

        if (data.length === metadata.length) {
          result.push(this.renderData(data, metadata));

          if (this._isLoadMoreOnScroll()) {
            if (!dataObj.done) {
              if (data.length === 0) {
                Logger.info('handleFetchedData: zero data returned while done flag is false');
              }

              if (!dataObj.maxCountLimit) {
                if (this.domScroller == null) {
                  this._registerDomScroller();
                }

                result.push(this.renderSkeletonsForLoadMore());
              }
            }

            if (dataObj.maxCountLimit) {
              this._handleScrollerMaxRowCount();
            }
          }

          return result;
        }
      }
    }, {
      key: "handleBeforeFetchNext",
      value: function handleBeforeFetchNext() {
        return !this.isFetching();
      }
    }, {
      key: "handleBeforeFetchByOffset",
      value: function handleBeforeFetchByOffset() {}
    }, {
      key: "handleFetchSuccess",
      value: function handleFetchSuccess(result) {
        if (result != null) {
          this._setNewData(result);
        }
      }
    }, {
      key: "_handleFetchError",
      value: function _handleFetchError() {
        this.setFetching(false);
      }
    }, {
      key: "_handleScrollerMaxRowCount",
      value: function _handleScrollerMaxRowCount() {}
    }, {
      key: "renderData",
      value: function renderData(data, metadata) {
        if (this.callback == null) {
          return null;
        }

        var children = [];
        var skeletonKeys = this.callback.getSkeletonKeys();

        for (var i = 0; i < data.length; i++) {
          if (data[i] == null || metadata[i] == null) {
            continue;
          }

          if (!this.verifyKey(metadata[i].key)) {
            Logger.error('encounted a key with invalid data type.  Acceptable data types for key are: ' + this.validKeyTypes);
            children = [];
            break;
          }

          var child = this.addItem(metadata[i], i, data[i], true);

          if (child) {
            children.push(child);

            if (skeletonKeys.has(metadata[i].key)) {
              children.push(this.renderSkeletonsForExpand(metadata[i].key));
            }
          }
        }

        return children;
      }
    }, {
      key: "_renderOutOfRangeData",
      value: function _renderOutOfRangeData() {
        var children = [];
        return children;
      }
    }, {
      key: "_handleItemsMutated",
      value: function _handleItemsMutated(detail, keyField, callback, withinRangeDataCallback) {
        if (this.callback == null) {
          return;
        }

        this.callback.updateData(function (currentData, expandingKeys) {
          var _this12 = this;

          var newExpandingKeys = expandingKeys;
          var newData = {
            startIndex: currentData.startIndex,
            done: currentData.done,
            value: {
              data: currentData.value.data.slice(0),
              metadata: currentData.value.metadata.slice(0)
            }
          };
          var keys = Array.from(detail[keyField]);
          var indexes = keys.map(function (key) {
            return _this12._findIndex(currentData.value.metadata, key);
          });

          if (this.domScroller) {
            callback(indexes);
          }

          var startIndex = isNaN(currentData.startIndex) ? 0 : currentData.startIndex;
          var endIndex = Math.max(startIndex + currentData.value.data.length, this.getFetchSize());
          var changeWithinRange = false;
          indexes.forEach(function (index, i) {
            var key = keys[i];
            var data = detail.data != null ? detail.data[i] : null;
            var metadata = detail.metadata != null ? detail.metadata[i] : null;

            if (index >= startIndex && index <= endIndex) {
              var returnVal = withinRangeDataCallback(newData, key, index, data, metadata, newExpandingKeys);

              if (returnVal != null) {
                newExpandingKeys = returnVal;
              }

              changeWithinRange = true;
            }
          });

          if (changeWithinRange) {
            if (newExpandingKeys !== expandingKeys) {
              return {
                renderedData: newData,
                expandingKeys: newExpandingKeys
              };
            }

            return {
              renderedData: newData
            };
          }
        }.bind(this));
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
    }, {
      key: "handleModelRefresh",
      value: function handleModelRefresh() {
        if (this.domScroller) {
          this.domScroller.destroy();
        }

        this.domScroller = null;
        this._cachedIteratorsAndResults = {};

        _get(_getPrototypeOf(IteratingTreeDataProviderContentHandler.prototype), "handleModelRefresh", this).call(this);
      }
    }, {
      key: "handleItemsAdded",
      value: function handleItemsAdded(detail) {
        if (this.callback == null) {
          return;
        }

        this.callback.updateData(function (currentData, expandingKeys) {
          var newData = {
            startIndex: currentData.startIndex,
            done: currentData.done,
            maxCountLimit: currentData.maxCountLimit,
            value: {
              data: currentData.value.data.slice(0),
              metadata: currentData.value.metadata.slice(0)
            }
          };
          var indexes = detail.indexes;
          var addBeforeKeys = detail.addBeforeKeys;
          var parentKeys = detail.parentKeys;
          var keysToExpand = [];
          var newMetadata;

          if (indexes == null && addBeforeKeys == null && parentKeys == null) {
            if (newData.done && !newData.maxCountLimit) {
              newData.value.data.push(detail.data);
              newMetadata = this._updateMetadata(detail.metadata, null, newData);
              newData.value.metadata.push(newMetadata);
            }
          } else if (parentKeys != null) {
            if (indexes == null) {
              indexes = [];
            }

            parentKeys.forEach(function (parentKey, i) {
              var data = detail.data[i];
              var metadata = detail.metadata[i];
              var index = -1;

              if (parentKey === null || this._isExpanded(parentKey) && this._getItemByKey(parentKey)) {
                if (addBeforeKeys != null) {
                  if (addBeforeKeys[i] != null) {
                    var beforeIndex = this._findIndex(newData.value.metadata, addBeforeKeys[i]);

                    index = beforeIndex;
                  } else {
                    index = this._findIndex(newData.value.metadata, this._getLastItemByParentKey(parentKey).metadata.key) + 1;
                  }
                } else if (indexes != null) {
                  var parentIndex = this._findIndex(newData.value.metadata, parentKey);

                  index = parentIndex === -1 ? indexes[i] + 1 : parentIndex + indexes[i] + 1;
                } else {
                  index = this._findIndex(newData.value.metadata, this._getLastItemByParentKey(parentKey).metadata.key) + 1;
                }
              }

              if (index > -1) {
                newData.value.data.splice(index, 0, data);
                newMetadata = this._updateMetadata(metadata, parentKey, newData);
                newData.value.metadata.splice(index, 0, newMetadata);

                if (indexes.indexOf(index) === -1) {
                  indexes.push(index);
                }

                if (this._isExpanded(metadata.key)) {
                  keysToExpand.push(metadata.key);
                }
              } else {
                if (newData.done && !newData.maxCountLimit) {
                  newData.value.data.push(data);
                  newData.value.metadata.push(metadata);
                }
              }
            }.bind(this));
          }

          if (this.domScroller && this.domScroller.handleItemsAdded) {
            this.domScroller.handleItemsAdded(indexes);
          }

          return {
            expandingKeys: expandingKeys.add(keysToExpand),
            renderedData: newData
          };
        }.bind(this));

        _get(_getPrototypeOf(IteratingTreeDataProviderContentHandler.prototype), "handleItemsAdded", this).call(this, detail);
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {
        var _this13 = this;

        this._handleItemsMutated(detail, 'keys', function (indexes) {
          if (_this13.domScroller.handleItemsRemoved) {
            _this13.domScroller.handleItemsRemoved(indexes);
          }
        }, function (newData, key) {
          var index = _this13._findIndex(newData.value.metadata, key);

          if (index > -1) {
            var count = _this13._getLocalDescendentCount(newData.value.metadata, index) + 1;
            newData.value.data.splice(index, count);
            newData.value.metadata.splice(index, count);
          }
        });

        _get(_getPrototypeOf(IteratingTreeDataProviderContentHandler.prototype), "handleItemsRemoved", this).call(this, detail);
      }
    }, {
      key: "handleCurrentRangeItemUpdated",
      value: function handleCurrentRangeItemUpdated() {}
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {
        var _this14 = this;

        this._handleItemsMutated(detail, 'keys', function (indexes) {
          if (_this14.domScroller.handleItemsUpdated) {
            _this14.domScroller.handleItemsUpdated(indexes);
          }
        }, function (newData, key, index, data, metadata, expandingKeys) {
          var oldMetadata = newData.value.metadata[index];
          var wasLeaf = oldMetadata.isLeaf;

          var newMetadata = _this14._updateMetadata(metadata, oldMetadata.parentKey, {
            value: {
              data: [data],
              metadata: [metadata]
            }
          });

          if (wasLeaf && !newMetadata.isLeaf) {
            expandingKeys = expandingKeys.add([newMetadata.key]);
          }

          newData.value.data.splice(index, 1, data);
          newData.value.metadata.splice(index, 1, newMetadata);

          _this14.handleCurrentRangeItemUpdated();

          return expandingKeys;
        });

        _get(_getPrototypeOf(IteratingTreeDataProviderContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }, {
      key: "checkViewport",
      value: function checkViewport() {
        if (this.domScroller && this.isReady()) {
          var fetchPromise = this.domScroller.checkViewport();

          if (fetchPromise != null && this.fetchPromise !== fetchPromise) {
            this.fetchPromise = fetchPromise;
            fetchPromise.then(function (result) {
              this.fetchPromise = null;

              if (result != null) {
                this.handleFetchSuccess(result);
              }
            }.bind(this));
          }
        }
      }
    }, {
      key: "collapse",
      value: function collapse(keys) {
        keys.forEach(function (key) {
          if (this._cachedIteratorsAndResults[key] != null) {
            this._cachedIteratorsAndResults[key].iterator = null;
            this._cachedIteratorsAndResults[key].cache = null;
          }
        }.bind(this));
      }
    }]);

    return IteratingTreeDataProviderContentHandler;
  }(DataProviderContentHandler);

  var KeyedElement = /*#__PURE__*/function (_HTMLElement) {
    _inherits(KeyedElement, _HTMLElement);

    var _super3 = _createSuper(KeyedElement);

    function KeyedElement() {
      _classCallCheck(this, KeyedElement);

      return _super3.apply(this, arguments);
    }

    return KeyedElement;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  exports.IteratingDataProviderContentHandler = IteratingDataProviderContentHandler;
  exports.IteratingTreeDataProviderContentHandler = IteratingTreeDataProviderContentHandler;
  exports.KeyedElement = KeyedElement;
  exports.VirtualizeDomScroller = VirtualizeDomScroller;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())