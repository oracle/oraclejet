(function() {
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
define(['ojs/ojcore-base', 'ojs/ojeventtarget', 'ojs/ojcomponentcore', 'ojs/ojdataprovider'], function (oj, ojeventtarget, ojcomponentcore, ojdataprovider) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  /**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * @ignore
   */

  /**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */

  /* jslint browser: true,devel:true*/

  /**
   *
   * @since 9.1.0
   * @export
   * @final
   * @class CachedIteratorResultsDataProvider
   * @implements DataProvider
   * @classdesc This is an internal wrapper class meant to be used by JET collection components to provide highwatermark scrolling optimizations.
   * This wrapper will cache the most results of the most recently invoked fetchFirst by attributes, filterCriterion, and sortCriteria.
   * @param {DataProvider} dataProvider the DataProvider.
   * @ojsignature [{target: "Type",
   *               value: "class CachedIteratorResultsDataProvider<K, D> implements DataProvider<K, D>",
   *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
   *               {target: "Type",
   *               value: "DataProvider<K, D>",
   *               for: "dataProvider"}]
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
   * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
   * "FetchListResult","FetchListParameters"]}
   * @ojtsmodule
   * @ignore
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name containsKeys
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name createOptimizedKeySet
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name createOptimizedKeyMap
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name fetchFirst
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name fetchByKeys
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name fetchByOffset
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name getCapability
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name getTotalSize
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name isEmpty
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name addEventListener
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name removeEventListener
   */

  /**
   * @inheritdoc
   * @memberof CachedIteratorResultsDataProvider
   * @instance
   * @method
   * @name dispatchEvent
   */

  /**
   * End of jsdoc
   */

  var CachedIteratorResultsDataProvider = /*#__PURE__*/function () {
    function CachedIteratorResultsDataProvider(dataProvider) {
      _classCallCheck(this, CachedIteratorResultsDataProvider);

      this.dataProvider = dataProvider;

      this.CacheAsyncIterable = /*#__PURE__*/function () {
        function _class(_parent, dataProviderAsyncIterator, cache) {
          var _this = this;

          _classCallCheck(this, _class);

          this._parent = _parent;
          this.dataProviderAsyncIterator = dataProviderAsyncIterator;
          this.cache = cache;

          this[Symbol.asyncIterator] = function () {
            return new _this._parent.CacheAsyncIterator(_this._parent, _this.dataProviderAsyncIterator, _this.cache);
          };
        }

        return _class;
      }();

      this.CacheAsyncIterator = /*#__PURE__*/function () {
        function _class2(_parent, asyncIterator, cache) {
          _classCallCheck(this, _class2);

          this._parent = _parent;
          this.asyncIterator = asyncIterator;
          this.cache = cache;
          this._cachedOffset = 0;
          this._iteratedOffset = 0;
        }

        _createClass(_class2, [{
          key: 'next',
          value: function next() {
            var _this2 = this;

            var self = this;
            var params = this._parent._lastFetchParams;
            var size = params.size ? params.size : -1;
            var result;

            if (size == -1) {
              if (this.cache.isDone()) {
                result = this.cache.getDataList(params, this._cachedOffset);
                this._cachedOffset = this._cachedOffset + result.data.length;
                return Promise.resolve(new this._parent.CacheAsyncIteratorReturnResult(result));
              }
            } else {
              if (this.cache.getSize() >= this._cachedOffset + size || this.cache.isDone()) {
                result = this.cache.getDataList(params, this._cachedOffset);
                this._cachedOffset = this._cachedOffset + result.data.length;

                if (this._cachedOffset < this.cache.getSize() || !this.cache.isDone()) {
                  return Promise.resolve(new this._parent.CacheAsyncIteratorYieldResult(result));
                }

                return Promise.resolve(new this._parent.CacheAsyncIteratorReturnResult(result));
              } else if (this._cachedOffset > 0) {
                return new Promise(function (resolve, reject) {
                  if (self._iteratedOffset < self._cachedOffset) {
                    var fetchUntilOffset = function fetchUntilOffset() {
                      return self.asyncIterator.next().then(function (result) {
                        self._iteratedOffset = self._iteratedOffset + result.value.data.length;

                        if (self._iteratedOffset >= self._cachedOffset || result.done) {
                          resolve();
                        } else {
                          return fetchUntilOffset();
                        }
                      });
                    };

                    return fetchUntilOffset();
                  } else {
                    resolve();
                  }
                }).then(function () {
                  return _this2.asyncIterator.next().then(function (result) {
                    self._iteratedOffset = self._iteratedOffset + result.value.data.length;
                    self._cachedOffset = self._iteratedOffset;
                    self.cache.addListResult(result);

                    if (result.done) {
                      return new self._parent.CacheAsyncIteratorReturnResult(result.value);
                    } else {
                      return new self._parent.CacheAsyncIteratorYieldResult(result.value);
                    }
                  });
                });
              }
            }

            return this.asyncIterator.next().then(function (result) {
              self._iteratedOffset = self._iteratedOffset + result.value.data.length;
              self._cachedOffset = self._iteratedOffset;
              self.cache.addListResult(result);

              if (size == -1 && !_this2.cache.isDone()) {
                _this2.asyncIterator.next().then(function (result) {
                  self.cache.addListResult(result);
                });
              }

              if (result.done) {
                return new self._parent.CacheAsyncIteratorReturnResult(result.value);
              } else {
                return new self._parent.CacheAsyncIteratorYieldResult(result.value);
              }
            });
          }
        }]);

        return _class2;
      }();

      this.CacheAsyncIteratorYieldResult = /*#__PURE__*/function () {
        function _class3(value) {
          _classCallCheck(this, _class3);

          this.value = value;
          this[CachedIteratorResultsDataProvider._VALUE] = value;
          this[CachedIteratorResultsDataProvider._DONE] = false;
        }

        return _class3;
      }();

      this.CacheAsyncIteratorReturnResult = /*#__PURE__*/function () {
        function _class4(value) {
          _classCallCheck(this, _class4);

          this.value = value;
          this[CachedIteratorResultsDataProvider._VALUE] = value;
          this[CachedIteratorResultsDataProvider._DONE] = true;
        }

        return _class4;
      }();

      var self = this;
      this.cache = new oj.DataCache();
      this._lastFetchParams = null;

      if (dataProvider.createOptimizedKeyMap) {
        this.createOptimizedKeyMap = function (initialMap) {
          return dataProvider.createOptimizedKeyMap(initialMap);
        };
      }

      if (dataProvider.createOptimizedKeySet) {
        this.createOptimizedKeySet = function (initialSet) {
          return dataProvider.createOptimizedKeySet(initialSet);
        };
      }

      dataProvider.addEventListener(CachedIteratorResultsDataProvider._MUTATE, function (event) {
        self.cache.processMutations(event.detail);
        self.dispatchEvent(event);
      });
      dataProvider.addEventListener(CachedIteratorResultsDataProvider._REFRESH, function (event) {
        self.cache.reset();
        self.dispatchEvent(event);
      });
    }

    _createClass(CachedIteratorResultsDataProvider, [{
      key: "containsKeys",
      value: function containsKeys(params) {
        var finalResults = new Set();
        var neededKeys = new Set();
        var cacheResults = this.cache.getDataByKeys(params);
        params.keys.forEach(function (key) {
          var item = cacheResults.results.get(key);

          if (item) {
            finalResults.add(key);
          } else {
            neededKeys.add(key);
          }
        });

        if (neededKeys.size == 0) {
          return Promise.resolve({
            containsParameters: params,
            results: finalResults
          });
        } else {
          var newParams = {
            attributes: params.attributes,
            keys: neededKeys,
            scope: params.scope
          };
          return this.dataProvider.containsKeys(newParams).then(function (containsKeysResults) {
            containsKeysResults.results.forEach(function (key) {
              finalResults.add(key);
            });
            return {
              containsParameters: params,
              results: finalResults
            };
          });
        }
      }
    }, {
      key: "fetchByKeys",
      value: function fetchByKeys(params) {
        var finalResults = new Map();
        var neededKeys = new Set();
        var cacheResults = this.cache.getDataByKeys(params);
        params.keys.forEach(function (key) {
          var item = cacheResults.results.get(key);

          if (item) {
            finalResults.set(key, item);
          } else {
            neededKeys.add(key);
          }
        });

        if (neededKeys.size == 0) {
          return Promise.resolve({
            fetchParameters: params,
            results: finalResults
          });
        } else {
          var newParams = {
            attributes: params.attributes,
            keys: neededKeys,
            scope: params.scope
          };
          return this.dataProvider.fetchByKeys(newParams).then(function (fetchByKeysResults) {
            fetchByKeysResults.results.forEach(function (item, key) {
              finalResults.set(key, item);
            });
            return {
              fetchParameters: params,
              results: finalResults
            };
          });
        }
      }
    }, {
      key: "fetchByOffset",
      value: function fetchByOffset(params) {
        var size = params.size ? params.size : CachedIteratorResultsDataProvider._DEFAULT_SIZE;

        if (this._compareLastFetchParameters(params) && params.offset + size <= this.cache.getSize()) {
          var updatedParams = JSON.parse(JSON.stringify(params));
          updatedParams.size = size;
          var results = this.cache.getDataByOffset(updatedParams);

          if (results) {
            return Promise.resolve(results);
          }
        }

        return this.dataProvider.fetchByOffset(params);
      }
    }, {
      key: "fetchFirst",
      value: function fetchFirst(params) {
        if (!this._compareLastFetchParameters(params)) {
          this.cache.reset();
        }

        this._storeLastFetchParams(params);

        var asyncIterable = this.dataProvider.fetchFirst(params);
        return new this.CacheAsyncIterable(this, asyncIterable[Symbol.asyncIterator](), this.cache);
      }
    }, {
      key: "getCapability",
      value: function getCapability(capabilityName) {
        var capability = this.dataProvider.getCapability(capabilityName);

        if (capabilityName === 'fetchCapability') {
          return {
            attributeFilter: capability === null || capability === void 0 ? void 0 : capability.attributeFilter,
            caching: 'visitedByCurrentIterator'
          };
        }

        return capability;
      }
    }, {
      key: "getTotalSize",
      value: function getTotalSize() {
        if (!this._lastFetchParams.filterDef && this.cache.isDone()) {
          return Promise.resolve(this.cache.getSize());
        }

        return this.dataProvider.getTotalSize();
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        if (!this._lastFetchParams.filterDef && this.cache.isDone()) {
          return this.cache.getSize() === 0 ? 'yes' : 'no';
        }

        return this.dataProvider.isEmpty();
      }
    }, {
      key: "_compareLastFetchParameters",
      value: function _compareLastFetchParameters(params) {
        params = params || {};
        return this._lastFetchParams != null && oj.Object.compareValues(this._lastFetchParams.attributes, params.attributes || null) && oj.Object.compareValues(this._lastFetchParams.filterDef, this._getFilterDef(params.filterCriterion)) && oj.Object.compareValues(this._lastFetchParams.sortCriteria, params.sortCriteria || null);
      }
    }, {
      key: "_storeLastFetchParams",
      value: function _storeLastFetchParams(params) {
        params = params || {};
        this._lastFetchParams = {};
        this._lastFetchParams.size = params.size;
        this._lastFetchParams.attributes = params.attributes ? JSON.parse(JSON.stringify(params.attributes)) : null;
        this._lastFetchParams.filterDef = this._getFilterDef(params.filterCriterion);
        this._lastFetchParams.sortCriteria = params.sortCriteria ? JSON.parse(JSON.stringify(params.sortCriteria)) : null;
      }
    }, {
      key: "_getFilterDef",
      value: function _getFilterDef(filter) {
        if (!filter) {
          return null;
        }

        var filterDef = {};
        Object.keys(filter).forEach(function (property) {
          if (property != 'filter') {
            filterDef[property] = filter[property];
          }
        });
        return filterDef;
      }
    }]);

    return CachedIteratorResultsDataProvider;
  }();

  CachedIteratorResultsDataProvider._KEY = 'key';
  CachedIteratorResultsDataProvider._KEYS = 'keys';
  CachedIteratorResultsDataProvider._DATA = 'data';
  CachedIteratorResultsDataProvider._STARTINDEX = 'startIndex';
  CachedIteratorResultsDataProvider._SORT = 'sort';
  CachedIteratorResultsDataProvider._SORTCRITERIA = 'sortCriteria';
  CachedIteratorResultsDataProvider._FILTERCRITERION = 'filterCriterion';
  CachedIteratorResultsDataProvider._METADATA = 'metadata';
  CachedIteratorResultsDataProvider._ITEMS = 'items';
  CachedIteratorResultsDataProvider._FROM = 'from';
  CachedIteratorResultsDataProvider._OFFSET = 'offset';
  CachedIteratorResultsDataProvider._REFRESH = 'refresh';
  CachedIteratorResultsDataProvider._MUTATE = 'mutate';
  CachedIteratorResultsDataProvider._SIZE = 'size';
  CachedIteratorResultsDataProvider._FETCHPARAMETERS = 'fetchParameters';
  CachedIteratorResultsDataProvider._VALUE = 'value';
  CachedIteratorResultsDataProvider._DONE = 'done';
  CachedIteratorResultsDataProvider._RESULTS = 'results';
  CachedIteratorResultsDataProvider._CONTAINSPARAMETERS = 'containsParameters';
  CachedIteratorResultsDataProvider._DEFAULT_SIZE = 25;
  CachedIteratorResultsDataProvider._CONTAINSKEYS = 'containsKeys';
  CachedIteratorResultsDataProvider._FETCHBYKEYS = 'fetchByKeys';
  CachedIteratorResultsDataProvider._FETCHBYOFFSET = 'fetchByOffset';
  CachedIteratorResultsDataProvider._FETCHFIRST = 'fetchFirst';
  CachedIteratorResultsDataProvider._ADDEVENTLISTENER = 'addEventListener';
  CachedIteratorResultsDataProvider._FETCHATTRIBUTES = 'attributes';
  ojeventtarget.EventTargetMixin.applyMixin(CachedIteratorResultsDataProvider);

  oj._registerLegacyNamespaceProp('CachedIteratorResultsDataProvider', CachedIteratorResultsDataProvider);

  return CachedIteratorResultsDataProvider;
});

}())