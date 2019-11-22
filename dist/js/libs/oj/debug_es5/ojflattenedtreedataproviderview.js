/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['ojs/ojcore', 'jquery', 'ojs/ojset', 'ojs/ojeventtarget', 'ojs/ojdataprovider', 'ojs/ojkeyset', 'ojs/ojobservable', 'ojs/ojmap'],
function(oj, $, ojSet, eventTarget, DataProvider, KeySet, Observable, ojMap)
{
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * Class which provides list based optimizations
 */
var FlattenedTreeDataProviderView =
/*#__PURE__*/
function () {
  function FlattenedTreeDataProviderView(dataProvider, options) {
    _classCallCheck(this, FlattenedTreeDataProviderView);

    this.dataProvider = dataProvider;
    this.options = options;
    this._DATAPROVIDER = 'dataprovider';
    this._EXPANDED = 'expanded';
    this._KEY = 'key';
    this._PARENTKEY = 'parentKey';
    this._INDEXFROMPARENT = 'indexFromParent';
    this._TREEDEPTH = 'treeDepth';
    this._ISLEAF = 'isLeaf';
    this._KEYS = 'keys';
    this._OFFSET = 'offset';
    this._SIZE = 'size';
    this._DONE = 'done';
    this._VALUE = 'value';
    this._DATA = 'data';
    this._REFRESH = 'refresh';
    this._MUTATE = 'mutate';
    this._SORTCRITERIA = 'sortCriteria';
    this._FILTERCRITERION = 'filterCriterion';
    this._ATTRIBUTES = 'attributes';
    this._METADATA = 'metadata';
    this._RESULTS = 'results';
    this._FETCHPARAMETERS = 'fetchParameters';
    this._CONTAINSPARAMETERS = 'containsParameters';
    this._CONTAINSKEYS = 'containsKeys';
    this._FETCHBYKEYS = 'fetchByKeys';
    this._FETCHBYOFFSET = 'fetchByOffset';
    this._AFTERKEYS = 'afterKeys';
    this._ADDBEFOREKEYS = 'addBeforeKeys';
    this._ADD = 'add';
    this._REMOVE = 'remove';
    this._UPDATE = 'update';
    this._INDEXES = 'indexes';
    this._ADDEVENTLISTENER = 'addEventListener';

    this.AsyncIterable =
    /*#__PURE__*/
    function () {
      function _class(_parent, _asyncIterator) {
        _classCallCheck(this, _class);

        this._parent = _parent;
        this._asyncIterator = _asyncIterator;

        this[Symbol.asyncIterator] = function () {
          return this._asyncIterator;
        };
      }

      return _class;
    }();

    this.AsyncIterator =
    /*#__PURE__*/
    function () {
      function _class2(_parent, _nextFunc, _params) {
        _classCallCheck(this, _class2);

        this._parent = _parent;
        this._nextFunc = _nextFunc;
        this._params = _params;
      }

      _createClass(_class2, [{
        key: 'next',
        value: function next() {
          var result = this._nextFunc(this._params);

          return Promise.resolve(result);
        }
      }]);

      return _class2;
    }();

    this.AsyncIteratorYieldResult =
    /*#__PURE__*/
    function () {
      function _class3(_parent, value) {
        _classCallCheck(this, _class3);

        this._parent = _parent;
        this.value = value;
        this[_parent._VALUE] = value;
        this[_parent._DONE] = false;
      }

      return _class3;
    }();

    this.AsyncIteratorReturnResult =
    /*#__PURE__*/
    function () {
      function _class4(_parent, value) {
        _classCallCheck(this, _class4);

        this._parent = _parent;
        this.value = value;
        this[_parent._VALUE] = value;
        this[_parent._DONE] = true;
      }

      return _class4;
    }();

    this.Item =
    /*#__PURE__*/
    function () {
      function _class5(_parent, metadata, data) {
        _classCallCheck(this, _class5);

        this._parent = _parent;
        this.metadata = metadata;
        this.data = data;
        this[_parent._METADATA] = metadata;
        this[_parent._DATA] = data;
      }

      return _class5;
    }();

    this.FlattenedTreeItemMetadata =
    /*#__PURE__*/
    function () {
      function _class6(_parent, key, parentKey, indexFromParent, treeDepth, isLeaf) {
        _classCallCheck(this, _class6);

        this._parent = _parent;
        this.key = key;
        this.parentKey = parentKey;
        this.indexFromParent = indexFromParent;
        this.treeDepth = treeDepth;
        this.isLeaf = isLeaf;
        this[_parent._KEY] = key;
        this[_parent._PARENTKEY] = parentKey;
        this[_parent._INDEXFROMPARENT] = indexFromParent;
        this[_parent._TREEDEPTH] = treeDepth;
        this[_parent._ISLEAF] = isLeaf;
      }

      return _class6;
    }();

    this.FetchListParameters =
    /*#__PURE__*/
    function () {
      function _class7(_parent, size, sortCriteria, filterCriterion) {
        _classCallCheck(this, _class7);

        this._parent = _parent;
        this.size = size;
        this.sortCriteria = sortCriteria;
        this.filterCriterion = filterCriterion;
        this[_parent._SIZE] = size;
        this[_parent._SORTCRITERIA] = sortCriteria;
        this[_parent._FILTERCRITERION] = filterCriterion;
      }

      return _class7;
    }();

    this.FetchListResult =
    /*#__PURE__*/
    function () {
      function _class8(_parent, fetchParameters, data, metadata) {
        _classCallCheck(this, _class8);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.data = data;
        this.metadata = metadata;
        this[_parent._FETCHPARAMETERS] = fetchParameters;
        this[_parent._DATA] = data;
        this[_parent._METADATA] = metadata;
      }

      return _class8;
    }();

    this.FetchByOffsetParameters =
    /*#__PURE__*/
    function () {
      function _class9(_parent, offset, size, sortCriteria, filterCriterion, attributes) {
        _classCallCheck(this, _class9);

        this._parent = _parent;
        this.offset = offset;
        this.size = size;
        this.sortCriteria = sortCriteria;
        this.filterCriterion = filterCriterion;
        this.attributes = attributes;
        this[_parent._OFFSET] = offset;
        this[_parent._SIZE] = size;
        this[_parent._SORTCRITERIA] = sortCriteria;
        this[_parent._FILTERCRITERION] = filterCriterion;
        this[_parent._ATTRIBUTES] = attributes;
      }

      return _class9;
    }();

    this.FetchByOffsetResults =
    /*#__PURE__*/
    function () {
      function _class10(_parent, fetchParameters, results, done) {
        _classCallCheck(this, _class10);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.results = results;
        this.done = done;
        this[_parent._FETCHPARAMETERS] = fetchParameters;
        this[_parent._RESULTS] = results;
        this[_parent._DONE] = done;
      }

      return _class10;
    }();

    this.FetchByKeysResults =
    /*#__PURE__*/
    function () {
      function _class11(_parent, fetchParameters, results) {
        _classCallCheck(this, _class11);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.results = results;
        this[_parent._FETCHPARAMETERS] = fetchParameters;
        this[_parent._RESULTS] = results;
      }

      return _class11;
    }();

    this.ContainsKeysResults =
    /*#__PURE__*/
    function () {
      function _class12(_parent, containsParameters, results) {
        _classCallCheck(this, _class12);

        this._parent = _parent;
        this.containsParameters = containsParameters;
        this.results = results;
        this[_parent._CONTAINSPARAMETERS] = containsParameters;
        this[_parent._RESULTS] = results;
      }

      return _class12;
    }();

    this.DataProviderMutationEventDetail =
    /*#__PURE__*/
    function () {
      function _class13(_parent, add, remove, update) {
        _classCallCheck(this, _class13);

        this._parent = _parent;
        this.add = add;
        this.remove = remove;
        this.update = update;
        this[_parent._ADD] = add;
        this[_parent._REMOVE] = remove;
        this[_parent._UPDATE] = update;
      }

      return _class13;
    }();

    this.DataProviderOperationEventDetail =
    /*#__PURE__*/
    function () {
      function _class14(_parent, keys, metadata, data, indexes) {
        _classCallCheck(this, _class14);

        this._parent = _parent;
        this.keys = keys;
        this.metadata = metadata;
        this.data = data;
        this.indexes = indexes;
        this[_parent._KEYS] = keys;
        this[_parent._METADATA] = metadata;
        this[_parent._DATA] = data;
        this[_parent._INDEXES] = indexes;
      }

      return _class14;
    }();

    this.DataProviderAddOperationEventDetail =
    /*#__PURE__*/
    function () {
      function _class15(_parent, keys, afterKeys, addBeforeKeys, metadata, data, indexes) {
        _classCallCheck(this, _class15);

        this._parent = _parent;
        this.keys = keys;
        this.afterKeys = afterKeys;
        this.addBeforeKeys = addBeforeKeys;
        this.metadata = metadata;
        this.data = data;
        this.indexes = indexes;
        this[_parent._KEYS] = keys;
        this[_parent._AFTERKEYS] = afterKeys;
        this[_parent._ADDBEFOREKEYS] = addBeforeKeys;
        this[_parent._METADATA] = metadata;
        this[_parent._DATA] = data;
        this[_parent._INDEXES] = indexes;
      }

      return _class15;
    }();

    var self = this;

    if (self.options == null) {
      self.options = {};
    }

    if (!self.options.expanded) {
      self.options.expanded = new KeySet.ExpandedKeySet([]);
    }

    self._expandedObservable = new Observable.BehaviorSubject(self._getExpandedObservableValue(self.options.expanded, Promise.resolve()));
    self.dataProvider.addEventListener('mutate', self._handleUndelryingMutation.bind(self));
    self.dataProvider.addEventListener('refresh', self._handleUndelryingRefresh.bind(self));
    self._cache = []; // not a map of keys so no need for optimized key map

    self._iterators = new ojMap();
    self._done = false;
  }

  _createClass(FlattenedTreeDataProviderView, [{
    key: "_handleUndelryingMutation",
    value: function _handleUndelryingMutation(mutationEventDetail) {
      var self = this;
      var operationAddEventDetail = null;
      var operationRemoveEventDetail = null;
      var operationUpdateEventDetail = null;
      var addEvent = mutationEventDetail.detail.add;

      if (addEvent && addEvent.data && addEvent.data.length) {
        var addMetadataArray = [];
        var addDataArray = [];
        var addIndexArray = [];
        var addBeforeKeys = [];
        var addParentKeys = [];
        var addAfterKeySet = new Set();
        var addKeySet = new Set();
        addEvent.parentKeys.forEach(function (parentKey, index) {
          if (parentKey === null || self._isExpanded(parentKey) && self._getItemByKey(parentKey)) {
            var newIndex;

            if (addEvent.addBeforeKeys != null) {
              var beforeIndex = self._getItemIndexByKey(addEvent.addBeforeKeys[index]);

              newIndex = beforeIndex - 1;
            } else if (addEvent.indexes != null) {
              var parentIndex = self._getItemIndexByKey(parentKey);

              newIndex = parentIndex === -1 ? addEvent.indexes[index] : parentIndex + addEvent.indexes[index];
            } else {
              newIndex = self._getItemIndexByKey(self._getLastItemByParentKey(parentKey).metadata.key) + 1;
            }

            var item = self._updateItemMetadata(new self.Item(self, addEvent.metadata[index], addEvent.data[index]), parentKey, addEvent.indexes[index]);

            self._spliceItemToCache(item, newIndex);

            addDataArray.push(item.data);
            addMetadataArray.push(item.metadata);
            addIndexArray.push(newIndex);
            addBeforeKeys.push(addEvent.addBeforeKeys[index]);
            addParentKeys.push(parentKey);
            addAfterKeySet.add(addEvent.addBeforeKeys[index]);
            addKeySet.add(addEvent.metadata[index].key);

            self._incrementIteratorOffset();
          }
        });
        operationAddEventDetail = new self.DataProviderAddOperationEventDetail(self, addKeySet, addAfterKeySet, addBeforeKeys, addMetadataArray, addDataArray, addIndexArray);
      }

      var removeEvent = mutationEventDetail.detail.remove;

      if (removeEvent && removeEvent.data && removeEvent.data.length) {
        var removeKeys = removeEvent.metadata.map(function (metadata) {
          return metadata.key;
        });
        var removeMetadataArray = [];
        var removeDataArray = [];
        var removeIndexArray = [];
        var removeKeySet = new Set();
        removeKeys.forEach(function (key) {
          var count = self._getLocalDescendentCount(key) + 1;

          var cacheIndex = self._getItemIndexByKey(key);

          var deletedItems = self._cache.splice(cacheIndex, count);

          deletedItems.forEach(function (item, index) {
            removeKeySet.add(item.metadata.key);
            removeMetadataArray.push(item.metadata);
            removeDataArray.push(item.data);
            removeIndexArray.push(cacheIndex + index);

            self._decrementIteratorOffset(cacheIndex);
          });
        });
        operationRemoveEventDetail = new self.DataProviderOperationEventDetail(self, removeKeySet, removeMetadataArray, removeDataArray, removeIndexArray);
      }

      var updateEvent = mutationEventDetail.detail.update;

      if (updateEvent && updateEvent.data && updateEvent.data.length) {
        var updateMetadataArray = [];
        var updateDataArray = [];
        var updateIndexArray = [];
        var updateKeySet = new Set();
        updateEvent.metadata.forEach(function (metadata, index) {
          var item = self._getItemByKey(metadata.key);

          if (item != null) {
            var itemIndex = self._getItemIndexByKey(metadata.key);

            var newData = updateEvent.data[index]; // could have new children

            var newMetadata = new self.FlattenedTreeItemMetadata(self, item.metadata.key, item.metadata.parentKey, item.metadata.indexFromParent, item.metadata.treeDepth, self.getChildDataProvider(item.metadata.key) === null);

            self._cache.splice(itemIndex, 1, new self.Item(self, newMetadata, newData));

            updateKeySet.add(item.metadata.key);
            updateMetadataArray.push(item.metadata);
            updateDataArray.push(item.data);
            updateIndexArray.push(itemIndex);
          }
        });
        operationUpdateEventDetail = new self.DataProviderOperationEventDetail(self, updateKeySet, updateMetadataArray, updateDataArray, updateIndexArray);
      }

      var finalMutationEventDetail = new self.DataProviderMutationEventDetail(self, operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail);
      self.dispatchEvent(new oj.DataProviderMutationEvent(finalMutationEventDetail));
    }
  }, {
    key: "_handleUndelryingRefresh",
    value: function _handleUndelryingRefresh() {
      this._clearCache();

      this.dispatchEvent(new oj.DataProviderRefreshEvent());
    }
  }, {
    key: "_getExpandedObservableValue",
    value: function _getExpandedObservableValue(expanded, completionPromise) {
      return {
        value: expanded,
        completionPromise: completionPromise
      };
    }
  }, {
    key: "getChildDataProvider",
    value: function getChildDataProvider(parentKey, options) {
      return this.dataProvider.getChildDataProvider(parentKey, options);
    }
  }, {
    key: "containsKeys",
    value: function containsKeys(params) {
      return this.dataProvider.containsKeys(params);
    }
  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      var self = this;
      return this.dataProvider.fetchByKeys(params).then(function (byKeysResult) {
        var results = new ojMap();
        byKeysResult.results.forEach(function (value, searchKey) {
          var cachedItem = self._getItemByKey(searchKey);

          if (cachedItem) {
            results.set(searchKey, cachedItem);
          } else {
            results.set(searchKey, value);
          }
        });
        return new self.FetchByKeysResults(self, byKeysResult.fetchParameters, results);
      });
    }
  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      var self = this;
      var size = params != null ? params[this._SIZE] : -1;
      var sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
      var offset = params != null ? params[this._OFFSET] > 0 ? params[this._OFFSET] : 0 : 0;
      var filterCriterion = params != null ? params[this._FILTERCRITERION] : null;
      var fetchAttributes = params != null ? params[this._ATTRIBUTES] : null;
      params = new self.FetchByOffsetParameters(self, offset, size, sortCriteria, filterCriterion, fetchAttributes);

      if (self._isSameCriteria(sortCriteria, filterCriterion)) {
        // same criteria, check to see if we have the results cached
        if (self._checkCacheByOffset(params)) {
          return new Promise(function (resolve) {
            resolve(self._getFetchByOffsetResultsFromCache(params));
          });
        }
      } else {
        // new criteria, refetch from the beginning
        self._clearCache();

        self._currentSortCriteria = sortCriteria;
        self._currentFilterCriteria = filterCriterion;
      }

      return self._fetchByOffset(params);
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      var self = this;
      var size = params != null ? params[this._SIZE] : -1;
      var sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
      var filterCriterion = params != null ? params[this._FILTERCRITERION] : null;
      var fetchAttributes = params != null ? params[this._ATTRIBUTES] : null;

      if (!self._isSameCriteria(sortCriteria, filterCriterion)) {
        self._currentSortCriteria = sortCriteria;
        self._currentFilterCriteria = filterCriterion;

        self._clearCache();
      }

      var newIterator = new self.AsyncIterable(self, new self.AsyncIterator(self, function () {
        return function () {
          var currentOffset = self._iterators.get(newIterator);

          var updatedParams = new self.FetchByOffsetParameters(self, currentOffset, size, sortCriteria, filterCriterion, fetchAttributes);
          return self.fetchByOffset(updatedParams).then(function (result) {
            var results = result['results'];
            var data = results.map(function (value) {
              return value[self._DATA];
            });
            var metadata = results.map(function (value) {
              return value[self._METADATA];
            });
            var done = data.length === 0 || result[self._DONE];

            self._iterators.set(newIterator, currentOffset + metadata.length);

            if (done) {
              return Promise.resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, updatedParams, data, metadata)));
            }

            return Promise.resolve(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, updatedParams, data, metadata)));
          });
        };
      }(), params));

      self._iterators.set(newIterator, 0);

      return newIterator;
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      return this.dataProvider.getCapability(capabilityName);
    }
  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return Promise.resolve(-1);
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.dataProvider.isEmpty();
    }
  }, {
    key: "_isSameCriteria",
    value: function _isSameCriteria(sortCriteria, filterCriterion) {
      if (sortCriteria) {
        if (!this._currentSortCriteria || sortCriteria[0]["attribute"] != this._currentSortCriteria[0]["attribute"] || sortCriteria[0]["direction"] != this._currentSortCriteria[0]["direction"]) {
          return false;
        }
      } else {
        if (this._currentSortCriteria) {
          return false;
        }
      }

      if (filterCriterion) {
        if (!this._currentFilterCriteria || filterCriterion[0]["op"] != this._currentFilterCriteria[0]["op"] || filterCriterion[0]["filter"] != this._currentFilterCriteria[0]["filter"]) {
          return false;
        }
      } else {
        if (this._currentFilterCriteria) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "_checkCacheByOffset",
    value: function _checkCacheByOffset(params) {
      if (params[this._SIZE] === -1 && this._done === true || this._cache.length >= params[this._OFFSET] + params[this._SIZE] && params[this._SIZE] !== -1) {
        return true;
      }

      return false;
    }
  }, {
    key: "_getFetchByOffsetResultsFromCache",
    value: function _getFetchByOffsetResultsFromCache(params) {
      var data = this._cache.slice(params[this._OFFSET], params[this._SIZE] === -1 ? undefined : params[this._OFFSET] + params[this._SIZE]);

      return new this.FetchByOffsetResults(this, params, data, false);
    }
  }, {
    key: "_clearCache",
    value: function _clearCache() {
      this._cache = [];
    }
  }, {
    key: "_fetchByOffset",
    value: function _fetchByOffset(params) {
      var self = this;

      if (self._cache.length === 0) {
        // initial fetch
        var _remainingSize = params[self._SIZE] === -1 ? -1 : params[self._OFFSET] + params[self._SIZE];

        var _newParams = new this.FetchByOffsetParameters(self, 0, _remainingSize, params[self._SORTCRITERIA], params[self._FILTERCRITERION], params[self._ATTRIBUTES]);

        return self._fetchChildrenByOffsetFromDataProvider(_newParams, self.dataProvider, null, params);
      }

      var lastEntry = self._getLastEntry();

      var key = lastEntry.metadata.key;
      var index = 0;

      if (lastEntry.metadata.isLeaf || !self._isExpanded(key)) {
        key = lastEntry.metadata.parentKey;
        index = lastEntry.metadata.indexFromParent + 1;
      }

      var dataProvider = key === null ? self.dataProvider : self.getChildDataProvider(key);

      var remainingSize = self._getRemainingSize(params);

      var newParams = new this.FetchByOffsetParameters(self, index, remainingSize, params[self._SORTCRITERIA], params[self._FILTERCRITERION], params[self._ATTRIBUTES]);
      return self._fetchChildrenByOffsetFromAncestors(newParams, dataProvider, key, params);
    }
  }, {
    key: "_fetchChildrenByOffsetFromAncestors",
    value: function _fetchChildrenByOffsetFromAncestors(params, dataprovider, parentKey, finalParams) {
      var self = this;

      var handleFetchFromAncestors = function handleFetchFromAncestors(lastParentKey, result) {
        var results = result.results;

        if (self._checkCacheByOffset(finalParams) || result[self._DONE] || parentKey === null) {
          return Promise.resolve();
        }

        var lastEntry = self._getItemByKey(lastParentKey);

        var lastEntryParentKey = lastEntry.metadata.parentKey;
        var lastEntryParentIndex = lastEntry.metadata.indexFromParent;
        var childDataProvider = lastEntryParentKey === null ? self.dataProvider : self.getChildDataProvider(lastEntryParentKey);
        var newParams = new self.FetchByOffsetParameters(self, lastEntryParentIndex + 1, self._getRemainingSize(finalParams), params[self._SORTCRITERIA], params[self._FILTERCRITERION], params[self._ATTRIBUTES]);

        var childrenPromise = self._fetchChildrenByOffsetFromDataProvider(newParams, childDataProvider, lastEntryParentKey, finalParams);

        return childrenPromise.then(handleFetchFromAncestors.bind(self, lastEntryParentKey, new self.FetchByOffsetResults(self, params, results, false)));
      };

      return self._fetchChildrenByOffsetFromDataProvider(params, dataprovider, parentKey, finalParams).then(handleFetchFromAncestors.bind(self, parentKey)).then(self._getFetchByOffsetResultsFromCache.bind(self, finalParams));
    }
  }, {
    key: "_fetchChildrenByOffsetFromDataProvider",
    value: function _fetchChildrenByOffsetFromDataProvider(params, dataprovider, parentKey, finalParams) {
      var self = this;

      var handleNextItemInResults = function handleNextItemInResults(result) {
        var results = result.results;

        if (results.length === 0 || self._checkCacheByOffset(finalParams)) {
          return Promise.resolve();
        }

        var item = results.shift();

        var updatedItem = self._updateItemMetadata(item, parentKey);

        self._pushItemToCache(updatedItem, parentKey);

        if (self._isExpanded(updatedItem.metadata.key)) {
          var childDataProvider = self.getChildDataProvider(updatedItem.metadata.key);

          if (childDataProvider != null) {
            var newParams = new self.FetchByOffsetParameters(self, 0, self._getRemainingSize(finalParams), params[self._SORTCRITERIA], params[self._FILTERCRITERION], params[self._ATTRIBUTES]);

            var childrenPromise = self._fetchChildrenByOffsetFromDataProvider(newParams, childDataProvider, updatedItem.metadata.key, finalParams);

            return childrenPromise.then(handleNextItemInResults.bind(self, new self.FetchByOffsetResults(self, params, results, false)));
          }
        }

        return handleNextItemInResults(new self.FetchByOffsetResults(self, params, results, false));
      };

      return dataprovider.fetchByOffset(params).then(handleNextItemInResults).then(self._getFetchByOffsetResultsFromCache.bind(self, finalParams));
    }
  }, {
    key: "_sequence",
    value: function _sequence(a, fn) {
      return a.reduce(function (p, item) {
        return p.then(function () {
          return fn(item);
        });
      }, Promise.resolve());
    }
  }, {
    key: "_getRemainingSize",
    value: function _getRemainingSize(params) {
      if (params[this._SIZE] === -1) {
        return -1;
      }

      return params[this._SIZE] + params[this._OFFSET] - this._cache.length;
    }
  }, {
    key: "_getExpandedKeysFromResults",
    value: function _getExpandedKeysFromResults(results) {
      var self = this;
      var resultsKeys = results.map(function (result) {
        return result.metadata.key;
      });
      return resultsKeys.filter(function (key) {
        return self._isExpanded(key);
      });
    }
  }, {
    key: "_isExpanded",
    value: function _isExpanded(key) {
      var expanded = this.options[this._EXPANDED];
      return expanded.has(key);
    }
  }, {
    key: "setExpanded",
    value: function setExpanded(keySet) {
      var self = this;
      var toExpand = self.createOptimizedKeySet();
      var toCollapse = self.createOptimizedKeySet();
      self._oldExpanded = self.options.expanded;
      self.options.expanded = keySet;
      var oldSet = self._oldExpanded;
      var newSet = self.options.expanded;

      if (!newSet.isAddAll() && !oldSet.isAddAll()) {
        var newValues = newSet.values();
        var oldValues = oldSet.values();
        newValues.forEach(function (value) {
          if (!oldSet.has(value)) {
            toExpand.add(value);
          }
        });
        oldValues.forEach(function (value) {
          if (!newSet.has(value)) {
            toCollapse.add(value);
          }
        });
      } else if (newSet.isAddAll() && oldSet.isAddAll()) {
        var newDeletedValues = newSet.deletedValues();
        var oldDeletedValues = oldSet.deletedValues();
        newDeletedValues.forEach(function (value) {
          if (oldSet.has(value)) {
            toCollapse.add(value);
          }
        });
        oldDeletedValues.forEach(function (value) {
          if (newSet.has(value)) {
            toExpand.add(value);
          }
        });
      } else {
        self._clearCache();

        self.dispatchEvent(new oj.DataProviderRefreshEvent());
        self.getExpandedObservable().next(self._getExpandedObservableValue(this.options.expanded, Promise.resolve()));
        return;
      }

      var expandPromise = self._expand(toExpand);

      var operationRemoveEventDetail = self._collapse(toCollapse);

      var completionPromise = new Promise(function (resolve) {
        expandPromise.then(function (operationAddEventDetail) {
          var mutationEventDetail = new self.DataProviderMutationEventDetail(self, operationAddEventDetail, operationRemoveEventDetail, null);
          self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
          resolve();
        });
      });
      self.getExpandedObservable().next(self._getExpandedObservableValue(this.options.expanded, completionPromise));
    }
  }, {
    key: "getExpandedObservable",
    value: function getExpandedObservable() {
      return this._expandedObservable;
    }
  }, {
    key: "_isExpandAll",
    value: function _isExpandAll() {
      return this.options[this._EXPANDED].isAddAll();
    }
  }, {
    key: "_pushItemToCache",
    value: function _pushItemToCache(item, parentKey) {
      var self = this;

      var lastEntry = self._getLastItemByParentKey(parentKey);

      var index = lastEntry == null ? self._getItemIndexByKey(parentKey) : self._getItemIndexByKey(lastEntry.metadata.key) + self._getLocalDescendentCount(lastEntry.metadata.key);

      self._cache.splice(index + 1, 0, item);
    }
  }, {
    key: "_spliceItemToCache",
    value: function _spliceItemToCache(item, index) {
      this._cache.splice(index + 1, 0, item);
    }
  }, {
    key: "_updateItemMetadata",
    value: function _updateItemMetadata(item, parentKey, indexFromParent) {
      var self = this;
      var treeDepth = 0;

      var lastEntry = self._getLastItemByParentKey(parentKey);

      var parentIndex = lastEntry == null ? 0 : lastEntry.metadata[self._INDEXFROMPARENT] + 1;

      if (indexFromParent != null) {
        parentIndex = indexFromParent;
      }

      if (parentKey != null) {
        var parentItem = this._getItemByKey(parentKey);

        treeDepth = parentItem.metadata.treeDepth + 1;
      }

      return new self.Item(self, new self.FlattenedTreeItemMetadata(self, item.metadata.key, parentKey, parentIndex, treeDepth, self.getChildDataProvider(item.metadata.key) === null), item.data);
    }
  }, {
    key: "_getItemByKey",
    value: function _getItemByKey(key) {
      var returnItem = null;

      this._cache.some(function (item) {
        if (item.metadata.key === key) {
          returnItem = item;
          return true;
        }
      });

      return returnItem;
    }
  }, {
    key: "_getItemIndexByKey",
    value: function _getItemIndexByKey(key) {
      var index = -1;

      this._cache.some(function (item, i) {
        if (item.metadata.key === key) {
          index = i;
          return true;
        }
      });

      return index;
    }
  }, {
    key: "_getLastEntry",
    value: function _getLastEntry() {
      return this._cache[this._getLastIndex()];
    }
  }, {
    key: "_getEntry",
    value: function _getEntry(i) {
      return this._cache[i];
    }
  }, {
    key: "_getLastItemByParentKey",
    value: function _getLastItemByParentKey(parentKey) {
      var returnItem = null;

      this._cache.slice().reverse().some(function (item) {
        if (item.metadata.parentKey === parentKey) {
          returnItem = item;
          return true;
        }
      });

      return returnItem;
    }
  }, {
    key: "_getLastIndex",
    value: function _getLastIndex() {
      return this._cache.length - 1;
    }
  }, {
    key: "_getLocalDescendentCount",
    value: function _getLocalDescendentCount(key) {
      var self = this;

      var item = self._getItemByKey(key);

      var count = 0;

      if (item != null) {
        var cacheIndex = self._getItemIndexByKey(key);

        var depth = item.metadata.treeDepth;

        var lastIndex = self._getLastIndex();

        for (var j = cacheIndex + 1; j <= lastIndex; j++) {
          var newItem = self._getEntry(j);

          var newDepth = newItem.metadata.treeDepth;

          if (newDepth > depth) {
            count += 1;
          } else {
            return count;
          }
        }
      }

      return count;
    }
  }, {
    key: "_expand",
    value: function _expand(keys) {
      var promises = [];
      var self = this;
      keys.forEach(function (key) {
        var params = new self.FetchByOffsetParameters(self, 0, -1, self._currentSortCriteria, self._currentFilterCriteria, null);
        var dataprovider = self.getChildDataProvider(key);
        promises.push(self._fetchChildrenByOffsetFromDataProvider(params, dataprovider, key, params));
      });
      return Promise.all(promises).then(function () {
        var keySet = self.createOptimizedKeySet();
        var afterKeySet = self.createOptimizedKeySet();
        var metadataArray = [];
        var dataArray = [];
        var indexArray = [];
        keys.forEach(function (key) {
          var count = self._getLocalDescendentCount(key);

          if (count > 0) {
            var insertIndex = self._getItemIndexByKey(key) + 1;
            var afterKey = null;

            var addedItems = self._cache.slice(insertIndex, insertIndex + count);

            addedItems.forEach(function (item, index) {
              keySet.add(item.metadata.key);
              afterKeySet.add(afterKey);
              metadataArray.push(item.metadata);
              dataArray.push(item.data);
              indexArray.push(insertIndex + index);
              afterKey = item.metadata.key;

              self._incrementIteratorOffset();
            });
          }
        });
        return new self.DataProviderAddOperationEventDetail(self, keySet, afterKeySet, [], metadataArray, dataArray, indexArray);
      });
    }
  }, {
    key: "_collapse",
    value: function _collapse(keys) {
      var self = this;
      var metadataArray = [];
      var dataArray = [];
      var indexArray = [];
      var keySet = self.createOptimizedKeySet();
      keys.forEach(function (key) {
        var count = self._getLocalDescendentCount(key);

        if (count > 0) {
          var cacheIndex = self._getItemIndexByKey(key);

          var deletedItems = self._cache.splice(cacheIndex + 1, count);

          deletedItems.forEach(function (item, index) {
            keySet.add(item.metadata.key);
            metadataArray.push(item.metadata);
            dataArray.push(item.data);
            indexArray.push(cacheIndex + index + 1);

            self._decrementIteratorOffset(cacheIndex + 1);
          });
        }
      });
      return new self.DataProviderOperationEventDetail(self, keySet, metadataArray, dataArray, indexArray);
    }
  }, {
    key: "_decrementIteratorOffset",
    value: function _decrementIteratorOffset(index) {
      var self = this;

      self._iterators.forEach(function (offset, iterator) {
        if (index < offset) {
          self._iterators.set(iterator, offset - 1);
        }
      });
    }
  }, {
    key: "_incrementIteratorOffset",
    value: function _incrementIteratorOffset() {
      var self = this;

      self._iterators.forEach(function (offset, iterator) {
        self._iterators.set(iterator, offset + 1);
      });
    }
    /**
    * Return an empty Set which is optimized to store keys
    */

  }, {
    key: "createOptimizedKeySet",
    value: function createOptimizedKeySet(initialSet) {
      if (this.dataProvider.createOptimizedKeySet) {
        return this.dataProvider.createOptimizedKeySet(initialSet);
      }

      return new ojSet(initialSet);
    }
    /**
     * Returns an empty Map which will efficiently store Keys returned by the DataProvider
     */

  }, {
    key: "createOptimizedKeyMap",
    value: function createOptimizedKeyMap(initialMap) {
      if (this.dataProvider.createOptimizedKeyMap) {
        return this.dataProvider.createOptimizedKeyMap(initialMap);
      }

      if (initialMap) {
        var map = new ojMap();
        initialMap.forEach(function (value, key) {
          map.set(key, value);
        });
        return map;
      }

      return new ojMap();
    }
  }]);

  return FlattenedTreeDataProviderView;
}();

oj['FlattenedTreeDataProviderView'] = FlattenedTreeDataProviderView;
oj.FlattenedTreeDataProviderView = FlattenedTreeDataProviderView;
oj.EventTargetMixin.applyMixin(FlattenedTreeDataProviderView);



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 *
 * @since 7.0.0
 * @export
 * @final
 * @class oj.FlattenedTreeDataProviderView
 * @ojtsmodule
 * @implements oj.DataProvider
 * @classdesc Provides row expander optimizations for oj.TreeDataProvider by flattening the tree.
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * Consumers can add event listeners to listen for the following event types and respond to data change.
 * <h4 id="event:mutate" class="name">
 *   mutate
 * </h4>
 * This event is fired when items have been added or removed from the data.
 * <p>
 * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link oj.DataProviderMutationEventDetail} interface.
 * </p>
 *
 * <h4 id="event:refresh" class="name">
 *   refresh
 * </h4>
 * This event is fired when the data has been refreshed and components need to re-fetch the data.
 * <p>
 * This event contains no additional event payload.
 * </p>
 *
 * <i>Example of consumer listening for the "mutate" event type:</i>
 * <pre class="prettyprint"><code>var listener = function(event) {
 *   if (event.detail.remove) {
 *     var removeDetail = event.detail.remove;
 *     // Handle removed items
 *   }
 * };
 * dataProvider.addEventListener("mutate", listener);
 * </code></pre>
 *
 * @param {oj.TreeDataProvider} dataProvider the wrapped TreeDataProvider to flatten.
 * @param {Object=} options
 * @param {KeySet=} options.expanded Optional key set to track the expansion state. To monitor the expansion state use the getExpandedObvservable method. To update the
 *   expansion state use the setExpanded method.
 * @ojsignature [{target: "Type",
 *               value: "class FlattenedTreeDataProviderView<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"}]},
 *               {target: "Type",
 *               value: "TreeDataProvider<K, D>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "KeySet<K>",
 *               for: "options.expanded"}]
 * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet", "ExpandedKeySet", "ExpandAllKeySet"]}
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion",
 *   "FetchByKeysParameters","ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters", "FetchByOffsetResults",
 *   "FetchListResult","FetchListParameters"]}
 *
 */

/**
 * Check if there are rows containing the specified keys
 *
 *
 * @since 6.2.0
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by keys
 *
 *
 * @since 6.2.0
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Fetch rows by offset
 *
 *
 * @since 4.2.0
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 */

/**
 * Fetch the first block of data.
 *
 *
 * @since 6.2.0
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 */

/**
 * Determines whether this DataProvider supports certain feature.
 *
 *
 * @since 6.2.0
 * @param {string} capabilityName capability name. Supported capability names
 *                  are determined by the underlying dataprovider.
 * @return {Object} capability information or null if unsupported
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName: string): any"}
 */

/**
 * Return the total number of rows in this dataprovider. Will return -1 if count cannot be determined.
 *
 *
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Return a string that indicates if this data provider is empty
 *
 *
 * @return {"yes"|"no"|"unknown"} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until a fetch is made.
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name isEmpty
 */

/**
 *
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name addEventListener
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 *
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name removeEventListener
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 *
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name dispatchEvent
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

/**
 * Set a new expanded property on the FlattenedTreeDataProviderView.
 *
 *
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name setExpanded
 * @param {KeySet} keySet the new key set representing expanded
 * @ojsignature {target: "Type",
 *               value: "(keySet: KeySet<K>): void"}
 */

/**
 * Get the observable with information about the expanded state to subscribe to.
 * Consumers can call subscribe and unsubscribe to receive changes to the expanded property.
 * <p>On the first subscribe call, the initial value will be passed to the subscriber.
 * <p>The observed value is an object with the following properties:
 * value: KeySet - new expanded key set
 * completionPromise?: Promise - resolved after all mutations have fired
 *                   relevant to the expand/collapse.
 *
 * <i>Example of consumer listening for the "mutate" event type:</i>
 * <pre class="prettyprint"><code>expandedObserexpandedObservable = dataprovider.getExpandedObservable();
 * subscriber = expandedObservable.subscribe(function(detail){
 *  expanded = detail.value;
 *  promise = detail.completionPromise;
 *  // handle changes
 * });
 * // unsubscribe later
 * subscriber.unsubscribe();
 * </code></pre>
 *
 * @return {Object} an object to call subscribe on to receive changes to the expanded property. The subscribe function returns an object to call unsubscribe on.
 *
 * @export
 * @expose
 * @memberof oj.FlattenedTreeDataProviderView
 * @instance
 * @method
 * @name getExpandedObservable
 * @see {@link https://github.com/tc39/proposal-observable} for further information on Observable and Subscription.
 * @ojsignature {target: "Type",
 *               value: "():{ subscribe( subscriber : ((expanded: {value: KeySet<K>, completionPromise: Promise<any>}) => void) ): {unsubscribe(): void, closed(): boolean}}"}
 */

/**
 * End of jsdoc
 */

  return FlattenedTreeDataProviderView;
});