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
define(['ojs/ojcore-base', 'ojs/ojdataprovider', 'ojs/ojeventtarget', 'ojs/ojcachediteratorresultsdataprovider', 'ojs/ojcomponentcore'], function (oj, ojdataprovider, ojeventtarget, CachedIteratorResultsDataProvider, ojcomponentcore) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  CachedIteratorResultsDataProvider = CachedIteratorResultsDataProvider && Object.prototype.hasOwnProperty.call(CachedIteratorResultsDataProvider, 'default') ? CachedIteratorResultsDataProvider['default'] : CachedIteratorResultsDataProvider;
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
   * @class DedupDataProvider
   * @implements DataProvider
   * @classdesc This is an internal wrapper class meant to be used by JET collection component to provide de-duping.
   * @param {DataProvider} dataProvider the DataProvider.
   * @ojsignature [{target: "Type",
   *               value: "class DedupDataProvider<K, D> implements DataProvider<K, D>",
   *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
   *               {target: "Type",
   *               value: "DedupDataProvider<K, D> | DataProvider<K, D>",
   *               for: "dataProvider"}]
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
   * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
   * "FetchListResult","FetchListParameters"]}
   * @ojtsmodule
   * @ignore
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name containsKeys
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name createOptimizedKeySet
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name createOptimizedKeyMap
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name fetchFirst
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name fetchByKeys
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name fetchByOffset
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name getCapability
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name getTotalSize
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name isEmpty
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name addEventListener
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name removeEventListener
   */

  /**
   * @inheritdoc
   * @memberof DedupDataProvider
   * @instance
   * @method
   * @name dispatchEvent
   */

  /**
   * End of jsdoc
   */

  var DedupDataProvider = /*#__PURE__*/function () {
    function DedupDataProvider(dataProvider) {
      var _this3 = this;

      _classCallCheck(this, DedupDataProvider);

      this.dataProvider = dataProvider;

      this.DedupAsyncIterable = /*#__PURE__*/function () {
        function _class(_parent, params, dataProviderAsyncIterator, cache) {
          var _this = this;

          _classCallCheck(this, _class);

          this._parent = _parent;
          this.params = params;
          this.dataProviderAsyncIterator = dataProviderAsyncIterator;
          this.cache = cache;

          this[Symbol.asyncIterator] = function () {
            return new _this._parent.DedupAsyncIterator(_this._parent, _this.params, _this.dataProviderAsyncIterator, _this.cache);
          };
        }

        return _class;
      }();

      this.DedupAsyncIterator = /*#__PURE__*/function () {
        function _class2(_parent, params, asyncIterator, cache) {
          _classCallCheck(this, _class2);

          this._parent = _parent;
          this.params = params;
          this.asyncIterator = asyncIterator;
          this.cache = cache;
          this._cachedOffset = 0;
        }

        _createClass(_class2, [{
          key: 'next',
          value: function next() {
            var _this2 = this;

            var self = this;
            var cachedKeys = new Set();

            if (this.params.size > 0) {
              var cachedFetchByOffsetResults = this._parent.cache.getDataByOffset({
                offset: 0,
                size: this._cachedOffset
              });

              cachedFetchByOffsetResults.results.forEach(function (item) {
                cachedKeys.add(item.metadata.key);
              });
            }

            return this.asyncIterator.next().then(function (result) {
              var value = result[DedupDataProvider._VALUE];
              var keys = value.metadata.map(function (value) {
                return value[DedupDataProvider._KEY];
              });
              _this2._cachedOffset = _this2._cachedOffset + keys.length;
              var fetchKeys = new Set();
              keys.forEach(function (key) {
                fetchKeys.add(key);
              });
              var removeKeysArray = [];
              var removeDataArray = [];
              var removeMetadataArray = [];
              fetchKeys.forEach(function (fetchKey, index) {
                if (cachedKeys.has(fetchKey)) {
                  removeKeysArray.push(fetchKey);
                  removeDataArray.push(value.data[index]);
                  removeMetadataArray.push(value.metadata[index]);
                }
              });

              if (removeKeysArray.length > 0) {
                var removekeySet = new Set();
                removeKeysArray.map(function (key) {
                  removekeySet.add(key);
                });
                var operationRemoveEventDetail = new self._parent.DataProviderOperationEventDetail(self._parent, removekeySet, removeMetadataArray, removeDataArray, []);
                var mutationRemoveEventDetail = new self._parent.DataProviderMutationEventDetail(self._parent, null, operationRemoveEventDetail, null);

                self._parent.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationRemoveEventDetail));
              }

              if (!(self._parent.dataProvider instanceof CachedIteratorResultsDataProvider)) {
                self._parent.cache.addListResult(result);
              }

              return result;
            });
          }
        }]);

        return _class2;
      }();

      this.DataProviderMutationEventDetail = /*#__PURE__*/function () {
        function _class3(_parent, add, remove, update) {
          _classCallCheck(this, _class3);

          this._parent = _parent;
          this.add = add;
          this.remove = remove;
          this.update = update;
          this[DedupDataProvider._ADD] = add;
          this[DedupDataProvider._REMOVE] = remove;
          this[DedupDataProvider._UPDATE] = update;
        }

        return _class3;
      }();

      this.DataProviderOperationEventDetail = /*#__PURE__*/function () {
        function _class4(_parent, keys, metadata, data, indexes) {
          _classCallCheck(this, _class4);

          this._parent = _parent;
          this.keys = keys;
          this.metadata = metadata;
          this.data = data;
          this.indexes = indexes;
          this[DedupDataProvider._KEYS] = keys;
          this[DedupDataProvider._METADATA] = metadata;
          this[DedupDataProvider._DATA] = data;
          this[DedupDataProvider._INDEXES] = indexes;
        }

        return _class4;
      }();

      var self = this;

      if (dataProvider instanceof CachedIteratorResultsDataProvider) {
        this.cache = dataProvider.cache;
      } else {
        this.cache = new oj.DataCache();
      }

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

      dataProvider.addEventListener(DedupDataProvider._MUTATE, function (event) {
        if (event.detail && event.detail.add) {
          _this3._processAddMutations(event.detail.add);
        }

        self.dispatchEvent(event);
      });
      dataProvider.addEventListener(DedupDataProvider._REFRESH, function (event) {
        self.cache.reset();
        self.dispatchEvent(event);
      });
    }

    _createClass(DedupDataProvider, [{
      key: "containsKeys",
      value: function containsKeys(params) {
        return this.dataProvider.containsKeys(params);
      }
    }, {
      key: "fetchByKeys",
      value: function fetchByKeys(params) {
        return this.dataProvider.fetchByKeys(params);
      }
    }, {
      key: "fetchByOffset",
      value: function fetchByOffset(params) {
        return this.dataProvider.fetchByOffset(params);
      }
    }, {
      key: "fetchFirst",
      value: function fetchFirst(params) {
        var asyncIterable = this.dataProvider.fetchFirst(params);
        return new this.DedupAsyncIterable(this, params, asyncIterable[Symbol.asyncIterator](), this.cache);
      }
    }, {
      key: "getCapability",
      value: function getCapability(capabilityName) {
        var capability = this.dataProvider.getCapability(capabilityName);

        if (capabilityName === 'dedup') {
          return {
            type: 'iterator'
          };
        }

        return capability;
      }
    }, {
      key: "getTotalSize",
      value: function getTotalSize() {
        return this.dataProvider.getTotalSize();
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        return this.dataProvider.isEmpty();
      }
    }, {
      key: "_processAddMutations",
      value: function _processAddMutations(detail) {
        var self = this;
        var eventDetailKeys = detail[DedupDataProvider._KEYS];

        if (eventDetailKeys && eventDetailKeys.size > 0) {
          var removeKeys = new Set();
          var removeDataArray = [];
          var removeMetadataArray = [];
          var value = this.cache.getDataByKeys({
            keys: eventDetailKeys
          });
          value.results.forEach(function (item, key) {
            removeKeys.add(key);
            removeDataArray.push(item.data);
            removeMetadataArray.push(item.metadata);
          });

          if (removeKeys.size > 0) {
            var operationRemoveEventDetail = new self.DataProviderOperationEventDetail(self, removeKeys, removeMetadataArray, removeDataArray, []);
            var mutationRemoveEventDetail = new self.DataProviderMutationEventDetail(self, null, operationRemoveEventDetail, null);
            self.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationRemoveEventDetail));
          }
        }
      }
    }]);

    return DedupDataProvider;
  }();

  DedupDataProvider._KEY = 'key';
  DedupDataProvider._KEYS = 'keys';
  DedupDataProvider._DATA = 'data';
  DedupDataProvider._METADATA = 'metadata';
  DedupDataProvider._ITEMS = 'items';
  DedupDataProvider._FROM = 'from';
  DedupDataProvider._OFFSET = 'offset';
  DedupDataProvider._REFRESH = 'refresh';
  DedupDataProvider._MUTATE = 'mutate';
  DedupDataProvider._SIZE = 'size';
  DedupDataProvider._FETCHPARAMETERS = 'fetchParameters';
  DedupDataProvider._VALUE = 'value';
  DedupDataProvider._DONE = 'done';
  DedupDataProvider._RESULTS = 'results';
  DedupDataProvider._ADD = 'add';
  DedupDataProvider._UPDATE = 'update';
  DedupDataProvider._REMOVE = 'remove';
  DedupDataProvider._INDEXES = 'indexes';
  ojeventtarget.EventTargetMixin.applyMixin(DedupDataProvider);

  oj._registerLegacyNamespaceProp('DedupDataProvider', DedupDataProvider);

  return DedupDataProvider;
});

}())