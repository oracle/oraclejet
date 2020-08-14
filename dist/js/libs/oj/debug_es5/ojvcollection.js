(function() {function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

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

define(['exports', 'ojs/ojcore-base', 'ojs/ojlogger', 'ojs/ojdomscroller'], function (exports, oj, Logger, DomScroller) {
  'use strict';

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
    function VirtualizeDomScroller(element, dataProvider, asyncIterator, options) {
      var _this = this;

      _classCallCheck(this, VirtualizeDomScroller);

      this.element = element;
      this.dataProvider = dataProvider;
      this.asyncIterator = asyncIterator;
      this.options = options;

      this._handleScroll = function (event) {
        var target = _this.element;

        var scrollTop = _this._getScrollTop(target);

        var maxScrollTop = target.scrollHeight - target.clientHeight;

        if (maxScrollTop > 0) {
          _this._handleScrollerScrollTop(scrollTop, maxScrollTop);
        }
      };

      this.initialScrollTop = this.element.scrollTop;
      this.scrollListener = this._handleScroll.bind(this);

      this._getScrollEventElement().addEventListener('scroll', this.scrollListener);

      this.fetchSize = options.fetchSize > 0 ? options.fetchSize : 25;
      this.maxCount = options.maxCount > 0 ? options.maxCount : 500;
      this.rowCount = options.initialRowCount > 0 ? options.initialRowCount : 0;
      this.successCallback = options.success;
      this.errorCallback = options.error;
      this.beforeFetchCallback = options.beforeFetchNext;
      this.beforeFetchByOffsetCallback = options.beforeFetchByOffset;
      this.viewportSize = -1;
      this.viewportPixelSize = this.element.offsetHeight;
      this.currentScrollTop = 0;
      this.currentRenderedPoint = {
        startIndex: 0,
        endIndex: isNaN(this.rowCount) ? this.fetchSize : this.rowCount,
        maxCountLimit: false,
        done: false,
        valid: true
      };
      this.renderedPoints = [];
      this.lastFetchTrigger = 0;
    }

    _createClass(VirtualizeDomScroller, [{
      key: "checkViewport",
      value: function checkViewport() {
        if (this.currentRenderedPoint.done || this.currentRenderedPoint.maxCountLimit) {
          return true;
        }

        var flag = this._isRangeValid(0, this.currentRenderedPoint.end);

        if (!flag) {
          this._doFetch();
        }

        return flag;
      }
    }, {
      key: "_isRenderingViewportOnly",
      value: function _isRenderingViewportOnly() {
        return this.options.strategy === exports.VirtualizationStrategy.VIEWPORT_ONLY;
      }
    }, {
      key: "setViewportRange",
      value: function setViewportRange(start, end) {
        if (this.currentRenderedPoint.start == null || this.currentRenderedPoint.end == null) {
          this.currentRenderedPoint.start = start;
          this.currentRenderedPoint.end = end;
          var renderedPoint = Object.assign({}, this.currentRenderedPoint);
          this.renderedPoints.push(renderedPoint);

          this._log('got pixel range: ' + start + ' to ' + end + ' for renderedPoint: ' + this.currentRenderedPoint.startIndex + ' ' + this.currentRenderedPoint.endIndex);
        } else if (this.currentRenderedPoint.valid === false) {
          this._log('current rendered point was previous marked as invalid before: ' + this.currentRenderedPoint.start + ' - ' + this.currentRenderedPoint.end);

          this.currentRenderedPoint.start = start;
          this.currentRenderedPoint.end = end;
          this.currentRenderedPoint.valid = true;

          this._log('... and after: ' + start + ' to ' + end + ' for renderedPoint: ' + this.currentRenderedPoint.startIndex + ' ' + this.currentRenderedPoint.endIndex);

          this._syncRenderedPointsWithCurrent();
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
      value: function _setRangeLocal(startIndex, endIndex, start, end, maxCountLimit, done, valid) {
        var _this2 = this;

        this._log('rendering row: ' + startIndex + ' to ' + endIndex + ' covering range: ' + (start == null ? 'unknown' : start) + ' to ' + (end == null ? 'unknown' : end));

        this.beforeFetchByOffsetCallback(startIndex, endIndex);
        this.currentRenderedPoint = {
          startIndex: startIndex,
          endIndex: endIndex,
          start: start,
          end: end,
          maxCountLimit: maxCountLimit,
          done: done,
          valid: valid
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
            fetchResults.results.forEach(function (result) {
              data.push(result.data);
              metadata.push(result.metadata);
            });
            var ret = {};
            ret.startIndex = startIndex;
            ret.maxCountLimit = maxCountLimit;
            ret.done = done;
            ret.value = {};
            ret.value.data = data;
            ret.value.metadata = metadata;

            _this2.successCallback(ret);
          } else {
            _this2._log('fetchByOffset ' + startIndex + ' to ' + endIndex + ' returned but result is NO LONGER applicable');
          }

          _this2.fetchByOffsetPromise = null;
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

        for (var i = 0; i < this.renderedPoints.length; i++) {
          var renderedPoint = this.renderedPoints[i];

          if (this._isRangeValid(renderedPoint.start, renderedPoint.end)) {
            this._setRangeLocal(renderedPoint.startIndex, renderedPoint.endIndex, renderedPoint.start, renderedPoint.end, renderedPoint.maxCountLimit, renderedPoint.done, renderedPoint.valid);

            return false;
          }
        }

        var scrollTop = this.currentScrollTop;
        this.viewportPixelSize = this.element.offsetHeight;

        for (var _i = 0; _i < this.renderedPoints.length; _i++) {
          var _renderedPoint = this.renderedPoints[_i];

          if (scrollTop >= _renderedPoint.start && _i < this.renderedPoints.length - 1) {
            var nextRenderedPoint = this.renderedPoints[_i + 1];

            if (scrollTop + this.viewportPixelSize <= nextRenderedPoint.end) {
              this._setRangeLocal(_renderedPoint.startIndex, nextRenderedPoint.endIndex, _renderedPoint.start, nextRenderedPoint.end, nextRenderedPoint.maxCountLimit, nextRenderedPoint.done, nextRenderedPoint.valid);

              return false;
            }
          }
        }

        this._log('scroll position is not covered by at most 2 rendered points');

        return true;
      }
    }, {
      key: "_doFetch",
      value: function _doFetch() {
        var _this3 = this;

        this._log('fetching next set of rows from asyncIterator');

        var scrollTop = this.currentScrollTop;
        var minIndex = this._isRenderingViewportOnly() ? this.beforeFetchCallback(scrollTop) : 0;

        if (minIndex > -1) {
          if (this.viewportSize === -1) {
            this.viewportSize = this.currentRenderedPoint.endIndex - this.currentRenderedPoint.startIndex;
          }

          this.fetchPromise = this._fetchMoreRows().then(function (result) {
            var minIndexAfterFetch = _this3._isRenderingViewportOnly() ? _this3.beforeFetchCallback(_this3.currentScrollTop) : 0;

            if (minIndexAfterFetch >= minIndex) {
              if (result.maxCount) {
                _this3._log('reached max count');

                var start = result.size > 0 ? null : _this3.currentRenderedPoint.start;
                var end = result.size > 0 ? null : _this3.currentRenderedPoint.end;

                _this3._setRangeLocal(_this3.currentRenderedPoint.startIndex, _this3.maxCount, start, end, true, false, true);

                _this3.fetchPromise = null;
                _this3.asyncIterator = null;
              } else if (result.size > 0 || result.done === true) {
                var renderedStartIndex = minIndex;
                var renderedEndIndex = _this3.currentRenderedPoint.endIndex + result.size;

                _this3._setRangeLocal(renderedStartIndex, renderedEndIndex, null, null, false, result.done, true);
              }
            } else {
              _this3._checkRenderedPoints();
            }
          }, function (reason) {
            if (_this3.errorCallback) {
              _this3.errorCallback(reason);

              _this3.fetchPromise = null;
              _this3.nextFetchTrigger = undefined;
            }
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
            if (this.asyncIterator) {
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

                  if (status.done || status.maxCountLimit) {
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
      key: "_syncRenderedPointsWithCurrent",
      value: function _syncRenderedPointsWithCurrent() {
        var _this5 = this;

        this.renderedPoints.forEach(function (renderedPoint) {
          if (renderedPoint.startIndex === _this5.currentRenderedPoint.startIndex) {
            renderedPoint.start = _this5.currentRenderedPoint.start;
          }

          if (renderedPoint.endIndex === _this5.currentRenderedPoint.endIndex) {
            renderedPoint.end = _this5.currentRenderedPoint.end;
          }

          if (renderedPoint.startIndex === _this5.currentRenderedPoint.startIndex && renderedPoint.endIndex === _this5.currentRenderedPoint.endIndex) {
            renderedPoint.valid = true;
          }
        });
      }
    }, {
      key: "_updateRenderedPoint",
      value: function _updateRenderedPoint(index, renderedPoint, op) {
        var invalidateCurrentRenderedPoint = false;

        if (index <= renderedPoint.startIndex) {
          if (op === 'added') {
            renderedPoint.startIndex = renderedPoint.startIndex + 1;
            renderedPoint.endIndex = renderedPoint.endIndex + 1;
          } else if (op === 'removed') {
            renderedPoint.startIndex = renderedPoint.startIndex - 1;
            renderedPoint.endIndex = renderedPoint.endIndex - 1;
          }

          invalidateCurrentRenderedPoint = true;
        } else if (index <= renderedPoint.endIndex) {
          if (op === 'added') {
            renderedPoint.endIndex = renderedPoint.endIndex + 1;
          } else if (op === 'removed') {
            renderedPoint.endIndex = renderedPoint.endIndex - 1;
          }

          invalidateCurrentRenderedPoint = true;
        }

        if (invalidateCurrentRenderedPoint) {
          renderedPoint.valid = false;
        }
      }
    }, {
      key: "_updateRenderedPoints",
      value: function _updateRenderedPoints(index, op) {
        var _this6 = this;

        this.renderedPoints.forEach(function (renderedPoint) {
          _this6._updateRenderedPoint(index, renderedPoint, op);
        });
      }
    }, {
      key: "_handleItemsAddedOrRemoved",
      value: function _handleItemsAddedOrRemoved(indexes, op) {
        var _this7 = this;

        indexes.forEach(function (index) {
          _this7._updateRenderedPoint(index, _this7.currentRenderedPoint, op);

          _this7._updateRenderedPoints(index, op);
        });
      }
    }, {
      key: "handleItemsAdded",
      value: function handleItemsAdded(indexes) {
        this._handleItemsAddedOrRemoved(indexes, 'added');

        this.rowCount = this.rowCount + indexes.length;
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(indexes) {
        this._handleItemsAddedOrRemoved(indexes, 'removed');

        this.rowCount = Math.max(0, this.rowCount - indexes.length);
      }
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(indexes) {
        var _this8 = this;

        var invalidateCurrentRenderedPoint = false;
        indexes.forEach(function (index) {
          if (index >= _this8.currentRenderedPoint.startIndex && index <= _this8.currentRenderedPoint.endIndex) {
            invalidateCurrentRenderedPoint = true;
          }
        });

        if (invalidateCurrentRenderedPoint) {
          this.currentRenderedPoint.start = null;
          this.currentRenderedPoint.end = null;
        }
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
      var _this9;

      _classCallCheck(this, IteratingDataProviderContentHandler);

      _this9 = _super.call(this, root, dataProvider, callback);
      _this9.root = root;
      _this9.dataProvider = dataProvider;
      _this9.callback = callback;
      _this9.scrollPolicyOptions = scrollPolicyOptions;

      _this9.fetchRows = function () {
        if (_this9.isReady()) {
          _this9.setFetching(true);

          var options = {
            clientId: _this9._clientId
          };
          options.size = _this9._isLoadMoreOnScroll() ? _this9.getFetchSize() : -1;
          _this9.dataProviderAsyncIterator = _this9.getDataProvider().fetchFirst(options)[Symbol.asyncIterator]();

          var promise = _this9.dataProviderAsyncIterator.next();

          var fetchSize = options.size;

          var helperFunction = function helperFunction(value) {
            if (value.done || fetchSize !== -1 || typeof _this9.getDataProvider().getPageCount === 'function') {
              return value;
            }

            var nextPromise = _this9.dataProviderAsyncIterator.next();

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

          promise.then(function (value) {
            return helperFunction(value);
          }, function (reason) {
            _this9._handleFetchError(reason);
          }).then(function (value) {
            if (_this9.isFetching()) {
              if (_this9.callback == null) {
                return;
              }

              _this9.initialFetch = true;

              _this9.callback.setData(value);
            }
          }, function (reason) {
            _this9._handleFetchError(reason);
          });
        }
      };

      _this9._registerDomScroller = function () {
        var options = {
          fetchSize: _this9.getFetchSize(),
          maxCount: _this9._getMaxCount(),
          initialRowCount: _this9.getFetchSize(),
          strategy: exports.VirtualizationStrategy.HIGH_WATER_MARK,
          success: function success(result) {
            _this9.handleFetchSuccess(result);
          },
          error: function error(reason) {
            _this9._handleFetchError(reason);
          },
          beforeFetchNext: function beforeFetchNext(scrollTop) {
            return _this9.handleBeforeFetchNext(scrollTop);
          },
          beforeFetchByOffset: function beforeFetchByOffset(startIndex, endIndex) {
            _this9.handleBeforeFetchByOffset(startIndex, endIndex);
          }
        };
        _this9.domScroller = new VirtualizeDomScroller(_this9._getScroller(), _this9.getDataProvider(), _this9.dataProviderAsyncIterator, options);
      };

      _this9._clientId = Symbol();
      return _this9;
    }

    _createClass(IteratingDataProviderContentHandler, [{
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

          this.setFetching(false);
          return result;
        }
      }
    }, {
      key: "handleBeforeFetchNext",
      value: function handleBeforeFetchNext(scrollTop) {}
    }, {
      key: "handleBeforeFetchByOffset",
      value: function handleBeforeFetchByOffset(startIndex, endIndex) {}
    }, {
      key: "handleFetchSuccess",
      value: function handleFetchSuccess(result) {
        if (result != null) {
          this.callback.setData(result);
        }
      }
    }, {
      key: "_handleFetchError",
      value: function _handleFetchError(reason) {
        Logger.error('an error occurred during data fetch, reason: ' + reason);
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

        for (var i = 0; i < data.length; i++) {
          if (data[i] == null || metadata[i] == null) {
            continue;
          }

          if (!this.verifyKey(metadata[i].key)) {
            Logger.error('encounted a key with invalid data type.  Acceptable data types for key are: ' + this.validKeyTypes);
            children = [];
            break;
          }

          var child = this.addItem(metadata[i].key, i, data[i], true);

          if (child) {
            children.push(child);
          }
        }

        return children;
      }
    }, {
      key: "_renderOutOfRangeData",
      value: function _renderOutOfRangeData() {
        var _this10 = this;

        var children = [];
        var outOfRangeData = this.callback.getOutOfRangeData();

        if (outOfRangeData != null) {
          outOfRangeData.forEach(function (result) {
            var data = result.data;
            var metadata = result.metadata;

            var child = _this10.addItem(metadata.key, 0, data, false);

            if (child) {
              children.push(child);
            }
          });
        }

        return children;
      }
    }, {
      key: "_handleItemsMutated",
      value: function _handleItemsMutated(detail, keyField, callback, withinRangeDataCallback, handleOutOfRangeData) {
        this.callback.updateData(function (currentData) {
          var _this11 = this;

          var newData = {
            startIndex: currentData.startIndex,
            done: currentData.done,
            value: {
              data: currentData.value.data.slice(0),
              metadata: currentData.value.metadata.slice(0)
            }
          };
          var outOfRangeData = [];
          var indexes = detail.indexes;
          var keys = Array.from(detail[keyField]);

          if (indexes == null) {
            indexes = keys.map(function (key) {
              return _this11._findIndex(currentData.value.metadata, key);
            });
          }

          if (this.domScroller) {
            callback(indexes);
          }

          var startIndex = isNaN(currentData.startIndex) ? 0 : currentData.startIndex;
          var endIndex = Math.max(startIndex + currentData.value.data.length, this.getFetchSize());
          indexes.forEach(function (index, i) {
            var key = keys[i];
            var data = detail.data != null ? detail.data[i] : null;
            var metadata = detail.metadata != null ? detail.metadata[i] : null;

            if (index >= startIndex && index <= endIndex) {
              withinRangeDataCallback(newData, key, index, data, metadata);
            } else if (handleOutOfRangeData) {
              outOfRangeData.push({
                data: data,
                metadata: metadata
              });
            }
          });

          if (handleOutOfRangeData) {
            return {
              outOfRangeData: outOfRangeData,
              renderedData: newData
            };
          }

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
          var outOfRangeData = [];
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

              if (addBeforeKeys != null && addBeforeKeys[i] != null) {
                index = this._findIndex(newData.value.metadata, addBeforeKeys[i]);
              } else if (indexes != null && indexes[i] != null) {
                index = indexes[i];
              }

              if (index > -1 && index <= newData.value.data.length) {
                newData.value.data.splice(index, 0, data);
                newData.value.metadata.splice(index, 0, metadata);
              } else {
                if (newData.done && !newData.maxCountLimit) {
                  newData.value.data.push(data);
                  newData.value.metadata.push(metadata);
                } else {
                  outOfRangeData.push({
                    data: data,
                    metadata: metadata
                  });
                }
              }

              i++;
            }.bind(this));
          }

          if (this.domScroller && this.domScroller.handleItemsAdded) {
            this.domScroller.handleItemsAdded(indexes);
          }

          return {
            renderedData: newData,
            outOfRangeData: outOfRangeData
          };
        }.bind(this));

        _get(_getPrototypeOf(IteratingDataProviderContentHandler.prototype), "handleItemsAdded", this).call(this, detail);
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {
        var _this12 = this;

        this._handleItemsMutated(detail, 'keys', function (indexes) {
          _this12.domScroller.handleItemsRemoved(indexes);
        }, function (newData, key) {
          var index = _this12._findIndex(newData.value.metadata, key);

          if (index > -1) {
            newData.value.data.splice(index, 1);
            newData.value.metadata.splice(index, 1);
          }
        }, false);

        _get(_getPrototypeOf(IteratingDataProviderContentHandler.prototype), "handleItemsRemoved", this).call(this, detail);
      }
    }, {
      key: "handleCurrentRangeItemUpdated",
      value: function handleCurrentRangeItemUpdated(key) {}
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {
        var _this13 = this;

        this._handleItemsMutated(detail, 'keys', function (indexes) {
          _this13.domScroller.handleItemsUpdated(indexes);
        }, function (newData, key, index, data, metadata) {
          newData.value.data.splice(index, 1, data);
          newData.value.metadata.splice(index, 1, metadata);

          _this13.handleCurrentRangeItemUpdated(key);
        }, true);

        _get(_getPrototypeOf(IteratingDataProviderContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }]);

    return IteratingDataProviderContentHandler;
  }(DataProviderContentHandler);

  var IteratingTreeDataProviderContentHandler = /*#__PURE__*/function (_DataProviderContentH2) {
    _inherits(IteratingTreeDataProviderContentHandler, _DataProviderContentH2);

    var _super2 = _createSuper(IteratingTreeDataProviderContentHandler);

    function IteratingTreeDataProviderContentHandler(root, dataProvider, callback, scrollPolicyOptions) {
      var _this14;

      _classCallCheck(this, IteratingTreeDataProviderContentHandler);

      _this14 = _super2.call(this, root, dataProvider, callback);
      _this14.root = root;
      _this14.dataProvider = dataProvider;
      _this14.callback = callback;
      _this14.scrollPolicyOptions = scrollPolicyOptions;

      _this14.fetchRows = function () {
        if (_this14.isReady()) {
          var options = {
            clientId: _this14._clientId
          };
          options.size = _this14._isLoadMoreOnScroll() ? _this14.getFetchSize() : -1;

          var iterator = _this14.getDataProvider().fetchFirst(options)[Symbol.asyncIterator]();

          _this14._cachedIteratorsAndResults['root'] = {
            iterator: iterator,
            cache: null
          };
          var finalResults = {
            value: {
              data: [],
              metadata: []
            }
          };

          _this14._fetchNextFromIterator(iterator, null, options, finalResults).then(_this14._setNewData);
        }
      };

      _this14._fetchNextFromIterator = function (iterator, key, options, finalResults) {
        if (iterator == null) {
          return Promise.resolve();
        }

        _this14.setFetching(true);

        var promise = iterator.next();
        var fetchSize = options.size;

        var helperFunction = function helperFunction(value) {
          if (value.done || fetchSize !== -1 || typeof _this14.getDataProvider().getPageCount === 'function') {
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
          _this14._handleFetchError();
        }).then(function (value) {
          if (_this14.isFetching()) {
            _this14.setFetching(false);

            if (_this14.callback == null || value == null) {
              return;
            }

            _this14.initialFetch = true;

            if (value.done && _this14._cachedIteratorsAndResults[key === null ? 'root' : key]) {
              _this14._cachedIteratorsAndResults[key === null ? 'root' : key].iterator = null;
            }

            return _this14.handleNextItemInResults(options, key, value, finalResults);
          }
        }, function () {
          _this14._handleFetchError();
        });
      };

      _this14._setNewData = function (result) {
        if (_this14.callback == null) {
          return;
        }

        _this14.callback.updateData(function (data) {
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
        }.bind(_assertThisInitialized(_this14)));
      };

      _this14._checkIteratorAndCache = function () {
        var cache = _this14._cachedIteratorsAndResults;
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

      _this14.fetchMoreRows = function () {
        if (_this14.isReady()) {
          var lastEntryMetadata = _this14._getLastEntryMetadata();

          var key = lastEntryMetadata.key;

          if (lastEntryMetadata.isLeaf || !_this14._isExpanded(key)) {
            key = lastEntryMetadata.parentKey;
          }

          var options = {};
          options.size = _this14._isLoadMoreOnScroll() ? _this14.getFetchSize() : -1;
          var cacheInfo = _this14._cachedIteratorsAndResults[key === null ? 'root' : key];
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
          return _this14.handleNextItemInResults(options, key, result, finalResults).then(_this14._fetchFromAncestors.bind(_assertThisInitialized(_this14), options, key, iterator, finalResults));
        }

        return Promise.resolve();
      };

      _this14._fetchFromAncestors = function (options, key, iterator, finalResults) {
        var self = _assertThisInitialized(_this14);

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

        return _this14._fetchNextFromIterator(iterator, key, options, finalResults).then(handleFetchFromAncestors.bind(_assertThisInitialized(_this14), key, finalResults));
      };

      _this14._getLastEntryMetadata = function () {
        var result = _this14.callback.getData();

        if (result && result.value.metadata.length) {
          var metadata = result.value.metadata;
          return metadata[metadata.length - 1];
        }

        return null;
      };

      _this14._isExpanded = function (key) {
        var expanded = _this14.callback.getExpanded();

        return expanded.has(key);
      };

      _this14.getChildDataProvider = function (parentKey) {
        if (parentKey == null) {
          return _this14.dataProvider;
        }

        return _this14.dataProvider.getChildDataProvider(parentKey);
      };

      _this14.handleNextItemInResults = function (options, parentKey, results, finalResults) {
        if (results === null || results.value.data.length === 0 || _this14._checkFinalResults(options, finalResults)) {
          if (results != null && results.value.data.length) {
            if (_this14._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey]) {
              _this14._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache = results;
            }
          } else if (_this14._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey]) {
            _this14._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache = null;
          }

          finalResults.done = _this14._checkIteratorAndCache();
          return Promise.resolve(finalResults);
        }

        var data = results.value.data.shift();
        var metadata = results.value.metadata.shift();

        var updatedMetadata = _this14._updateMetadata(metadata, parentKey, finalResults);

        finalResults.value.data.push(data);
        finalResults.value.metadata.push(updatedMetadata);

        if (_this14._isExpanded(updatedMetadata.key)) {
          var childDataProvider = _this14.getChildDataProvider(updatedMetadata.key);

          if (childDataProvider != null) {
            var _options = {
              clientId: _this14._clientId
            };
            _options.size = _this14._isLoadMoreOnScroll() ? _this14.getFetchSize() : -1;
            var iterator = childDataProvider.fetchFirst(_options)[Symbol.asyncIterator]();
            _this14._cachedIteratorsAndResults[updatedMetadata.key === null ? 'root' : updatedMetadata.key] = {
              iterator: iterator,
              cache: null
            };

            var childrenPromise = _this14._fetchNextFromIterator(iterator, updatedMetadata.key, _options, finalResults);

            return childrenPromise.then(_this14.handleNextItemInResults.bind(_assertThisInitialized(_this14), _options, parentKey, results, finalResults));
          }
        }

        return _this14.handleNextItemInResults(options, parentKey, results, finalResults);
      };

      _this14._checkFinalResults = function (options, finalResults) {
        if (finalResults.value.data.length >= options.size && options.size !== -1) {
          return true;
        }

        return false;
      };

      _this14._updateMetadata = function (metadata, parentKey, finalResults) {
        var treeDepth = 0;

        var lastEntry = _this14._getLastItemByParentKey(parentKey, finalResults);

        var indexFromParent = lastEntry == null ? 0 : lastEntry.metadata.indexFromParent + 1;
        var isLeaf = _this14.getChildDataProvider(metadata.key) === null;

        if (parentKey != null) {
          var parentItem = _this14._getItemByKey(parentKey, finalResults);

          treeDepth = parentItem.metadata.treeDepth + 1;
        }

        var expanded = _this14._isExpanded(metadata.key);

        return {
          key: metadata.key,
          isLeaf: isLeaf,
          parentKey: parentKey,
          indexFromParent: indexFromParent,
          treeDepth: treeDepth,
          expanded: expanded
        };
      };

      _this14._getIndexByKey = function (key, cache) {
        var index = -1;
        cache.some(function (item, i) {
          if (item.key === key) {
            index = i;
            return true;
          }
        });
        return index;
      };

      _this14._getLastItemByParentKey = function (parentKey, finalResults) {
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

        var cache = _this14.callback.getData();

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

      _this14._getItemByKey = function (key, finalResults) {
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

        var cache = _this14.callback.getData();

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

      _this14.expand = function (key) {
        var childDataProvider = _this14.getChildDataProvider(key);

        if (childDataProvider === null) {
          return;
        }

        var showSkeletonTimeout = setTimeout(function () {
          if (this.callback.getExpandingKeys().has(key)) {
            this.callback.updateSkeletonKeys(key);
          }
        }.bind(_assertThisInitialized(_this14)), 250);
        var options = {
          clientId: _this14._clientId,
          size: -1
        };
        var iterator = childDataProvider.fetchFirst(options)[Symbol.asyncIterator]();
        return _this14._fetchNextFromIterator(iterator, key, options, {
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

            if (result) {
              var data = result.value.data;
              var metadata = result.value.metadata;

              var insertIndex = this._getIndexByKey(key, metadata);

              if (insertIndex !== -1) {
                updatedData = {
                  value: {
                    data: data.slice(0, insertIndex + 1).concat(newData, data.slice(insertIndex + 1)),
                    metadata: metadata.slice(0, insertIndex + 1).concat(newMetadata, metadata.slice(insertIndex + 1))
                  },
                  done: result.done
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

            expandingKeys = expandingKeys.delete([key]);
            return {
              expandedSkeletonKeys: skeletonKeys,
              expandingKeys: expandingKeys,
              renderedData: updatedData
            };
          }.bind(this));
        }.bind(_assertThisInitialized(_this14)));
      };

      _this14.collapse = function (key, currentData) {
        var data = currentData.value.data;
        var metadata = currentData.value.metadata;

        var index = _this14._findIndex(metadata, key);

        if (index > -1) {
          var count = _this14._getLocalDescendentCount(metadata, index);

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

      _this14._getLocalDescendentCount = function (metadata, index) {
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

      _this14._registerDomScroller = function () {
        var options = {
          asyncIterator: {
            next: _this14.fetchMoreRows.bind(_assertThisInitialized(_this14))
          },
          fetchSize: _this14.getFetchSize(),
          fetchTrigger: _this14.callback.getSkeletonHeight() * _this14.getLoadMoreCount(),
          maxCount: _this14._getMaxCount(),
          initialRowCount: _this14.getFetchSize(),
          strategy: exports.VirtualizationStrategy.HIGH_WATER_MARK,
          success: function success(result) {
            _this14.handleFetchSuccess(result);
          },
          error: function error() {
            _this14._handleFetchError();
          },
          beforeFetch: function beforeFetch() {
            return _this14.handleBeforeFetchNext();
          },
          beforeFetchByOffset: function beforeFetchByOffset() {
            _this14.handleBeforeFetchByOffset();
          }
        };
        _this14.domScroller = new DomScroller(_this14._getScroller(), _this14.getDataProvider(), options);
      };

      _this14.getLoadMoreCount = function () {
        return 0;
      };

      _this14._cachedIteratorsAndResults = {};
      _this14._clientId = Symbol();
      return _this14;
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
          var _this15 = this;

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
            return _this15._findIndex(currentData.value.metadata, key);
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
        var _this16 = this;

        this._handleItemsMutated(detail, 'keys', function (indexes) {
          if (_this16.domScroller.handleItemsRemoved) {
            _this16.domScroller.handleItemsRemoved(indexes);
          }
        }, function (newData, key) {
          var index = _this16._findIndex(newData.value.metadata, key);

          if (index > -1) {
            var count = _this16._getLocalDescendentCount(newData.value.metadata, index) + 1;
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
        var _this17 = this;

        this._handleItemsMutated(detail, 'keys', function (indexes) {
          if (_this17.domScroller.handleItemsUpdated) {
            _this17.domScroller.handleItemsUpdated(indexes);
          }
        }, function (newData, key, index, data, metadata, expandingKeys) {
          var oldMetadata = newData.value.metadata[index];
          var wasLeaf = oldMetadata.isLeaf;

          var newMetadata = _this17._updateMetadata(metadata, oldMetadata.parentKey, {
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

          _this17.handleCurrentRangeItemUpdated();

          return expandingKeys;
        });

        _get(_getPrototypeOf(IteratingTreeDataProviderContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }, {
      key: "checkViewport",
      value: function checkViewport() {
        if (this.domScroller && this.isReady()) {
          var fetchPromise = this.domScroller.checkViewport();

          if (fetchPromise != null) {
            fetchPromise.then(function (result) {
              if (result != null) {
                this.handleFetchSuccess(result);
              }
            }.bind(this));
          }
        }
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