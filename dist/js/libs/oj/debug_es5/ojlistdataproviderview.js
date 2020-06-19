/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovider', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, __DataProvider)
{
  "use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * Class which provides list based optimizations
 */
var ListDataProviderView = /*#__PURE__*/function () {
  function ListDataProviderView(dataProvider, options) {
    _classCallCheck(this, ListDataProviderView);

    this.dataProvider = dataProvider;
    this.options = options;
    this._noFilterSupport = false;

    this.AsyncIterable = /*#__PURE__*/function () {
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

    this.AsyncIterator = /*#__PURE__*/function () {
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

    this.AsyncIteratorYieldResult = /*#__PURE__*/function () {
      function _class3(_parent, value) {
        _classCallCheck(this, _class3);

        this._parent = _parent;
        this.value = value;
        this[ListDataProviderView._VALUE] = value;
        this[ListDataProviderView._DONE] = false;
      }

      return _class3;
    }();

    this.AsyncIteratorReturnResult = /*#__PURE__*/function () {
      function _class4(_parent, value) {
        _classCallCheck(this, _class4);

        this._parent = _parent;
        this.value = value;
        this[ListDataProviderView._VALUE] = value;
        this[ListDataProviderView._DONE] = true;
      }

      return _class4;
    }();

    this.FetchListResult = /*#__PURE__*/function () {
      function _class5(_parent, fetchParameters, data, metadata) {
        _classCallCheck(this, _class5);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.data = data;
        this.metadata = metadata;
        this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
        this[ListDataProviderView._DATA] = data;
        this[ListDataProviderView._METADATA] = metadata;
      }

      return _class5;
    }();

    this.Item = /*#__PURE__*/function () {
      function _class6(_parent, metadata, data) {
        _classCallCheck(this, _class6);

        this._parent = _parent;
        this.metadata = metadata;
        this.data = data;
        this[ListDataProviderView._METADATA] = metadata;
        this[ListDataProviderView._DATA] = data;
      }

      return _class6;
    }();

    this.ItemMetadata = /*#__PURE__*/function () {
      function _class7(_parent, key) {
        _classCallCheck(this, _class7);

        this._parent = _parent;
        this.key = key;
        this[ListDataProviderView._KEY] = key;
      }

      return _class7;
    }();

    this.FetchListParameters = /*#__PURE__*/function () {
      function _class8(_parent, params, size, sortCriteria, filterCriterion, attributes) {
        _classCallCheck(this, _class8);

        this._parent = _parent;
        this.params = params;
        this.size = size;
        this.sortCriteria = sortCriteria;
        this.filterCriterion = filterCriterion;
        this.attributes = attributes;
        var self = this;

        if (params) {
          Object.keys(params).forEach(function (prop) {
            self[prop] = params[prop];
          });
        }

        this[ListDataProviderView._SIZE] = size;

        if (sortCriteria) {
          this[ListDataProviderView._SORTCRITERIA] = sortCriteria;
        }

        if (filterCriterion) {
          this[ListDataProviderView._FILTERCRITERION] = filterCriterion;
        }

        if (attributes) {
          this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
        }
      }

      return _class8;
    }();

    this.FetchByKeysParameters = /*#__PURE__*/function () {
      function _class9(_parent, keys, params, attributes) {
        _classCallCheck(this, _class9);

        this._parent = _parent;
        this.keys = keys;
        this.params = params;
        this.attributes = attributes;
        var self = this;

        if (params) {
          Object.keys(params).forEach(function (prop) {
            self[prop] = params[prop];
          });
        }

        if (keys) {
          this[ListDataProviderView._KEYS] = keys;
        }

        if (attributes) {
          this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
        }
      }

      return _class9;
    }();

    this.FetchByOffsetParameters = /*#__PURE__*/function () {
      function _class10(_parent, offset, params, size, sortCriteria, filterCriterion, attributes) {
        _classCallCheck(this, _class10);

        this._parent = _parent;
        this.offset = offset;
        this.params = params;
        this.size = size;
        this.sortCriteria = sortCriteria;
        this.filterCriterion = filterCriterion;
        this.attributes = attributes;
        var self = this;

        if (params) {
          Object.keys(params).forEach(function (prop) {
            self[prop] = params[prop];
          });
        }

        if (size) {
          this[ListDataProviderView._SIZE] = size;
        }

        if (sortCriteria) {
          this[ListDataProviderView._SORTCRITERIA] = sortCriteria;
        }

        if (offset) {
          this[ListDataProviderView._OFFSET] = offset;
        }

        if (filterCriterion) {
          this[ListDataProviderView._FILTERCRITERION] = filterCriterion;
        }

        if (attributes) {
          this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
        }
      }

      return _class10;
    }();

    this.FetchByKeysResults = /*#__PURE__*/function () {
      function _class11(_parent, fetchParameters, results) {
        _classCallCheck(this, _class11);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.results = results;
        this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
        this[ListDataProviderView._RESULTS] = results;
      }

      return _class11;
    }();

    this.ContainsKeysResults = /*#__PURE__*/function () {
      function _class12(_parent, containsParameters, results) {
        _classCallCheck(this, _class12);

        this._parent = _parent;
        this.containsParameters = containsParameters;
        this.results = results;
        this[ListDataProviderView._CONTAINSPARAMETERS] = containsParameters;
        this[ListDataProviderView._RESULTS] = results;
      }

      return _class12;
    }();

    this.FetchByOffsetResults = /*#__PURE__*/function () {
      function _class13(_parent, fetchParameters, results, done) {
        _classCallCheck(this, _class13);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.results = results;
        this.done = done;
        this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
        this[ListDataProviderView._RESULTS] = results;
        this[ListDataProviderView._DONE] = done;
      }

      return _class13;
    }();

    this[ListDataProviderView._FROM] = this.options == null ? null : this.options[ListDataProviderView._FROM];
    this[ListDataProviderView._OFFSET] = this.options == null ? 0 : this.options[ListDataProviderView._OFFSET] > 0 ? this.options[ListDataProviderView._OFFSET] : 0;
    this[ListDataProviderView._SORTCRITERIA] = this.options == null ? null : this.options[ListDataProviderView._SORTCRITERIA];
    this[ListDataProviderView._DATAMAPPING] = this.options == null ? null : this.options[ListDataProviderView._DATAMAPPING];
    this[ListDataProviderView._FETCHATTRIBUTES] = this.options == null ? null : this.options[ListDataProviderView._FETCHATTRIBUTES];
    this[ListDataProviderView._FILTERCRITERION] = this.options == null ? null : this.options[ListDataProviderView._FILTERCRITERION];

    this._addEventListeners(dataProvider);

    if (dataProvider.getCapability && !dataProvider.getCapability('filter')) {
      this._noFilterSupport = true;
    }
  }

  _createClass(ListDataProviderView, [{
    key: "containsKeys",
    value: function containsKeys(params) {
      var self = this;

      if (this.dataProvider[ListDataProviderView._CONTAINSKEYS]) {
        return this.dataProvider[ListDataProviderView._CONTAINSKEYS](params);
      } else {
        return this.fetchByKeys(params).then(function (fetchByKeysResult) {
          var results = new Set();

          params[ListDataProviderView._KEYS].forEach(function (key) {
            if (fetchByKeysResult[ListDataProviderView._RESULTS].get(key) != null) {
              results.add(key);
            }
          });

          return Promise.resolve(new self.ContainsKeysResults(self, params, results));
        });
      }
    }
  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      var self = this;
      var keys = params != null ? params[ListDataProviderView._KEYS] : null;
      var fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;

      if (fetchAttributes == null) {
        fetchAttributes = this[ListDataProviderView._FETCHATTRIBUTES];
      }

      var updatedParams = new self.FetchByKeysParameters(self, keys, params, fetchAttributes);

      if (this.dataProvider[ListDataProviderView._FETCHBYKEYS]) {
        return this.dataProvider[ListDataProviderView._FETCHBYKEYS](updatedParams).then(function (value) {
          var resultMap = value[ListDataProviderView._RESULTS];
          var mappedResultMap = new Map();
          resultMap.forEach(function (value, key) {
            var mappedItem = self._getMappedItems([value]);

            mappedResultMap.set(key, mappedItem[0]);
          });
          return new self.FetchByKeysResults(self, updatedParams, mappedResultMap);
        });
      } else {
        var options = new this.FetchListParameters(this, null, ListDataProviderView._DEFAULT_SIZE, null, null, fetchAttributes);
        var resultMap = new Map();

        var dataProviderAsyncIterator = this.dataProvider[ListDataProviderView._FETCHFIRST](options)[Symbol.asyncIterator]();

        return this._fetchNextSet(params, dataProviderAsyncIterator, resultMap).then(function (resultMap) {
          var mappedResultMap = new Map();
          resultMap.forEach(function (value, key) {
            var mappedItem = self._getMappedItems([value]);

            mappedResultMap.set(key, mappedItem[0]);
          });
          return new self.FetchByKeysResults(self, updatedParams, mappedResultMap);
        });
      }
    }
  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      var self = this;
      var offset = params != null ? params[ListDataProviderView._OFFSET] : null;
      var size = params != null ? params[ListDataProviderView._SIZE] : null;
      var fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;

      if (fetchAttributes == null) {
        fetchAttributes = this[ListDataProviderView._FETCHATTRIBUTES];
      }

      var sortCriteria = params != null ? params[ListDataProviderView._SORTCRITERIA] : null;

      if (sortCriteria == null) {
        sortCriteria = this[ListDataProviderView._SORTCRITERIA];
      }

      var mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);

      var filterCriterion = params != null ? params[ListDataProviderView._FILTERCRITERION] : null;

      var mappedFilterCriterion = this._getMappedFilterCriterion(filterCriterion);

      var updatedParams = new self.FetchByOffsetParameters(self, offset, params, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
      return this.dataProvider[ListDataProviderView._FETCHBYOFFSET](updatedParams).then(function (value) {
        var resultArray = value[ListDataProviderView._RESULTS];
        var done = value[ListDataProviderView._DONE];
        var mappedResultArray = new Array();
        resultArray.forEach(function (value) {
          var mappedItem = self._getMappedItems([value]);

          mappedResultArray.push(mappedItem[0]);
        });
        return new self.FetchByOffsetResults(self, updatedParams, mappedResultArray, done);
      });
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      // this fetchFirst applies the offset and from properties on the this.
      // If fetchByOffset is supported by the underlying dataprovider then that is used for offset.
      // Otherwise, fetches are made in chunks until from and offset are fulfilled.
      var cachedData = {};
      cachedData[ListDataProviderView._ITEMS] = [];
      cachedData[ListDataProviderView._DONE] = false;
      cachedData[ListDataProviderView._STARTINDEX] = 0;
      var size = params != null ? params[ListDataProviderView._SIZE] : null;
      var sortCriteria = params != null ? params[ListDataProviderView._SORTCRITERIA] : null;

      if (sortCriteria == null) {
        sortCriteria = this[ListDataProviderView._SORTCRITERIA];
      }

      var mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);

      var filterCriterion = params != null ? params[ListDataProviderView._FILTERCRITERION] : null;

      if (filterCriterion == null) {
        filterCriterion = this[ListDataProviderView._FILTERCRITERION];
      }

      var mappedFilterCriterion = this._getMappedFilterCriterion(filterCriterion);

      var fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;

      if (fetchAttributes == null) {
        fetchAttributes = this[ListDataProviderView._FETCHATTRIBUTES];
      }

      var self = this;

      if (self[ListDataProviderView._FROM] == null && self[ListDataProviderView._OFFSET] > 0) {
        var offset = self[ListDataProviderView._OFFSET];
        return new this.AsyncIterable(this, new this.AsyncIterator(this, function (cachedData) {
          return function () {
            var updatedParams = new self.FetchByOffsetParameters(self, offset, null, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
            return self.dataProvider[ListDataProviderView._FETCHBYOFFSET](updatedParams).then(function (result) {
              var results = result['results'];
              offset = offset + results.length;

              var mappedResult = self._getMappedItems(results);

              self._cacheResult(cachedData, mappedResult);

              cachedData[ListDataProviderView._DONE] = result[ListDataProviderView._DONE];
              var data = mappedResult.map(function (value) {
                return value[ListDataProviderView._DATA];
              });
              var metadata = mappedResult.map(function (value) {
                return value[ListDataProviderView._METADATA];
              });
              var resultFetchParams = result[ListDataProviderView._FETCHPARAMETERS];
              var resultSortCriteria = resultFetchParams != null ? resultFetchParams[ListDataProviderView._SORTCRITERIA] : null;
              var resultFilterCriterion = resultFetchParams != null ? resultFetchParams[ListDataProviderView._FILTERCRITERION] : null;

              var unmappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);

              var unmappedResultFilterCriterion = self._getUnmappedFilterCriterion(resultFilterCriterion);

              var resultParams = new self.FetchByOffsetParameters(self, self[ListDataProviderView._OFFSET], null, size, unmappedResultSortCriteria, unmappedResultFilterCriterion); // if the dataprovider supports fetchByOffset then we use that to do an offset based fetch

              if (cachedData[ListDataProviderView._DONE]) {
                return Promise.resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, resultParams, data, metadata)));
              }

              return Promise.resolve(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, resultParams, data, metadata)));
            });
          };
        }(cachedData), params));
      } else {
        var updatedParams = new this.FetchListParameters(this, params, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);

        var cachedAsyncIterator = this.dataProvider[ListDataProviderView._FETCHFIRST](updatedParams)[Symbol.asyncIterator]();

        return new this.AsyncIterable(this, new this.AsyncIterator(this, function (cachedData, cachedAsyncIterator) {
          return function () {
            return cachedAsyncIterator.next().then(function (result) {
              var data = result[ListDataProviderView._VALUE][ListDataProviderView._DATA];
              var metadata = result[ListDataProviderView._VALUE][ListDataProviderView._METADATA];
              var items = data.map(function (value, index) {
                return new self.Item(self, metadata[index], data[index]);
              });

              if (self._noFilterSupport) {
                self._filterResult(mappedFilterCriterion, items);
              } // apply any mapping defined in the DataMapping parameter


              var mappedResult = self._getMappedItems(items);

              self._cacheResult(cachedData, mappedResult);

              cachedData[ListDataProviderView._DONE] = result[ListDataProviderView._DONE];
              var size = params != null ? params[ListDataProviderView._SIZE] : null;
              var offset = params != null ? params[ListDataProviderView._OFFSET] : null;
              var resultFetchParams = result[ListDataProviderView._VALUE][ListDataProviderView._FETCHPARAMETERS];
              var resultSortCriteria = resultFetchParams != null ? resultFetchParams[ListDataProviderView._SORTCRITERIA] : null;
              var resultFilterCriterion = resultFetchParams != null ? resultFetchParams[ListDataProviderView._FILTERCRITERION] : null;

              var unmappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);

              var unmappedResultFilterCriterion = self._getUnmappedFilterCriterion(resultFilterCriterion);

              var resultParams = new self.FetchListParameters(self, params, size, unmappedResultSortCriteria, unmappedResultFilterCriterion);
              return self._fetchUntilKey(resultParams, self[ListDataProviderView._FROM], cachedData, cachedAsyncIterator).then(function () {
                return self._fetchUntilOffset(resultParams, self[ListDataProviderView._OFFSET] + cachedData[ListDataProviderView._STARTINDEX], data.length, cachedData, cachedAsyncIterator);
              });
            });
          };
        }(cachedData, cachedAsyncIterator), params));
      }
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      return this.dataProvider.getCapability(capabilityName);
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
    /**
     * Fetches the next block
     */

  }, {
    key: "_fetchNextSet",
    value: function _fetchNextSet(params, dataProviderAsyncIterator, resultMap) {
      var self = this;
      return dataProviderAsyncIterator.next().then(function (result) {
        var value = result[ListDataProviderView._VALUE];
        var data = value[ListDataProviderView._DATA];
        var metadata = value[ListDataProviderView._METADATA];
        var keys = metadata.map(function (metadata) {
          return metadata[ListDataProviderView._KEY];
        });
        var foundAllKeys = true;

        params[ListDataProviderView._KEYS].forEach(function (findKey) {
          if (!resultMap.has(findKey)) {
            keys.map(function (key, index) {
              if (oj.Object.compareValues(key, findKey)) {
                resultMap.set(findKey, new self.Item(self, metadata[index], data[index]));
              }
            });
          }

          if (!resultMap.has(findKey)) {
            foundAllKeys = false;
          }
        });

        if (!foundAllKeys && !result[ListDataProviderView._DONE]) {
          return self._fetchNextSet(params, dataProviderAsyncIterator, resultMap);
        } else {
          return resultMap;
        }
      });
    }
    /**
     * Fetches until we find the key
     */

  }, {
    key: "_fetchUntilKey",
    value: function _fetchUntilKey(params, key, cachedData, cachedAsyncIterator) {
      var self = this;

      if (key != null) {
        // first check if the key is in our cache
        var resultItems = cachedData[ListDataProviderView._ITEMS].filter(function (resultItem) {
          if (oj.KeyUtils.equals(resultItem[ListDataProviderView._METADATA][ListDataProviderView._KEY], key)) {
            return true;
          }
        });

        if (resultItems.length > 0) {
          // if the key is in our cache, then trim the cache so that it starts from the key
          var itemIndex = cachedData[ListDataProviderView._ITEMS].indexOf(resultItems[0]);

          cachedData[ListDataProviderView._ITEMS] = cachedData[ListDataProviderView._ITEMS].slice(itemIndex, cachedData[ListDataProviderView._ITEMS].length);
        } else if (!cachedData[ListDataProviderView._DONE]) {
          // if the key is not in our cache and we are not done then fetch the next block and call _fetchUntilKey again.
          return cachedAsyncIterator.next().then(function (nextResult) {
            var data = nextResult[ListDataProviderView._VALUE][ListDataProviderView._DATA];
            var metadata = nextResult[ListDataProviderView._VALUE][ListDataProviderView._METADATA];
            var items = data.map(function (value, index) {
              return new self.Item(self, metadata[index], data[index]);
            });

            var mappedResult = self._getMappedItems(items);

            self._cacheResult(cachedData, mappedResult);

            cachedData[ListDataProviderView._DONE] = nextResult[ListDataProviderView._DONE];
            return self._fetchUntilKey(nextResult[ListDataProviderView._FETCHPARAMETERS], mappedResult[ListDataProviderView._KEYS], cachedData, cachedAsyncIterator);
          });
        } else {
          // if we are done then this means that the key is not in the entire data set
          cachedData[ListDataProviderView._ITEMS] = [];
        }
      }

      return Promise.resolve(null);
    }
    /**
     * Fetches until we fulfill the offset
     */

  }, {
    key: "_fetchUntilOffset",
    value: function _fetchUntilOffset(params, offset, resultSize, cachedData, cachedAsyncIterator) {
      var self = this;
      var fetchSize = params != null ? params[ListDataProviderView._SIZE] > 0 ? params[ListDataProviderView._SIZE] : resultSize : resultSize;
      offset = offset > 0 ? offset : 0;

      var cachedItems = cachedData[ListDataProviderView._ITEMS].slice(offset, offset + fetchSize);

      if (this._noFilterSupport) {
        var mappedFilterCriterion = this._getMappedFilterCriterion(params[ListDataProviderView._FILTERCRITERION]);

        this._filterResult(mappedFilterCriterion, cachedItems);
      }

      if (cachedItems.length < fetchSize) {
        if (!cachedData[ListDataProviderView._DONE]) {
          return cachedAsyncIterator.next().then(function (nextResult) {
            var data = nextResult[ListDataProviderView._VALUE][ListDataProviderView._DATA];
            var metadata = nextResult[ListDataProviderView._VALUE][ListDataProviderView._METADATA];
            var items = data.map(function (value, index) {
              return new self.Item(self, metadata[index], data[index]);
            });

            if (self._noFilterSupport) {
              var _mappedFilterCriterion = self._getMappedFilterCriterion(params[ListDataProviderView._FILTERCRITERION]);

              self._filterResult(_mappedFilterCriterion, items);
            }

            var mappedResult = self._getMappedItems(items);

            self._cacheResult(cachedData, mappedResult);

            cachedData[ListDataProviderView._DONE] = nextResult[ListDataProviderView._DONE];
            return self._fetchUntilOffset(nextResult[ListDataProviderView._VALUE][ListDataProviderView._FETCHPARAMETERS], offset, data.length, cachedData, cachedAsyncIterator);
          });
        } else {
          cachedData[ListDataProviderView._STARTINDEX] = cachedData[ListDataProviderView._STARTINDEX] + cachedItems.length;
          var data = cachedItems.map(function (item) {
            return item[ListDataProviderView._DATA];
          });
          var metadata = cachedItems.map(function (item) {
            return item[ListDataProviderView._METADATA];
          });
          return Promise.resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, params, data, metadata)));
        }
      } else {
        cachedData[ListDataProviderView._STARTINDEX] = cachedData[ListDataProviderView._STARTINDEX] + cachedItems.length;

        var _data = cachedItems.map(function (item) {
          return item[ListDataProviderView._DATA];
        });

        var _metadata = cachedItems.map(function (item) {
          return item[ListDataProviderView._METADATA];
        });

        if (cachedData[ListDataProviderView._DONE]) {
          return Promise.resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, params, _data, _metadata)));
        }

        return Promise.resolve(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, params, _data, _metadata)));
      }
    }
    /**
     * Cache the data and keys
     */

  }, {
    key: "_cacheResult",
    value: function _cacheResult(cachedData, items) {
      var self = this;
      items.map(function (value) {
        cachedData[ListDataProviderView._ITEMS].push(value);
      });
    }
  }, {
    key: "_filterResult",
    value: function _filterResult(filterCriterion, items) {
      var filter;

      if (filterCriterion) {
        if (!filterCriterion.filter) {
          filterCriterion = __DataProvider.FilterFactory.getFilter({
            filterDef: filterCriterion
          });
        }

        var i = items.length - 1;

        while (i >= 0) {
          if (!filterCriterion.filter(items[i][ListDataProviderView._DATA])) {
            items.splice(i, 1);
          }

          i--;
        }
      }
    }
    /**
     * Apply DataMapping to the items
     */

  }, {
    key: "_getMappedItems",
    value: function _getMappedItems(items) {
      var self = this;

      if (this[ListDataProviderView._DATAMAPPING] != null) {
        var mapFields = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._MAPFIELDS];

        if (mapFields != null) {
          if (items != null && items.length > 0) {
            var mappedItems = new Array();
            mappedItems = items.map(function (value) {
              return mapFields.bind(self)(value);
            });
            return mappedItems;
          }
        }
      }

      return items;
    }
    /**
     * Apply mapping to the filterCriterion
     */

  }, {
    key: "_getMappedFilterCriterion",
    value: function _getMappedFilterCriterion(filterCriterion) {
      if (this[ListDataProviderView._DATAMAPPING] != null) {
        var mappedFilterCriterion = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._MAPFILTERCRITERION];

        if (mappedFilterCriterion != null) {
          if (filterCriterion != null) {
            return mappedFilterCriterion(filterCriterion);
          }
        }
      }

      return filterCriterion;
    }
    /**
     * Apply mapping to the sortCriteria
     */

  }, {
    key: "_getMappedSortCriteria",
    value: function _getMappedSortCriteria(sortCriteria) {
      if (this[ListDataProviderView._DATAMAPPING] != null) {
        var mapSortCriteria = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._MAPSORTCRITERIA];

        if (mapSortCriteria != null) {
          if (sortCriteria != null && sortCriteria.length > 0) {
            return mapSortCriteria(sortCriteria);
          }
        }
      }

      return sortCriteria;
    }
    /**
     * Unmapping the sortCriteria
     */

  }, {
    key: "_getUnmappedSortCriteria",
    value: function _getUnmappedSortCriteria(sortCriteria) {
      if (this[ListDataProviderView._DATAMAPPING] != null) {
        var unmapSortCriteria = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._UNMAPSORTCRITERIA];

        if (unmapSortCriteria != null) {
          if (sortCriteria != null && sortCriteria.length > 0) {
            return unmapSortCriteria(sortCriteria);
          }
        }
      }

      return sortCriteria;
    }
    /**
     * Unmapping the FilterCriterion
     */

  }, {
    key: "_getUnmappedFilterCriterion",
    value: function _getUnmappedFilterCriterion(filter) {
      if (this[ListDataProviderView._DATAMAPPING] != null) {
        var unmapFilterCriterion = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._UNMAPFILTERCRITERION];

        if (unmapFilterCriterion != null) {
          if (filter != null) {
            return unmapFilterCriterion(filter);
          }
        }
      }

      return filter;
    }
    /**
     * Add event listeners
     */

  }, {
    key: "_addEventListeners",
    value: function _addEventListeners(dataprovider) {
      var self = this;

      dataprovider[ListDataProviderView._ADDEVENTLISTENER](ListDataProviderView._REFRESH, function (event) {
        self.dispatchEvent(event);
      });

      dataprovider[ListDataProviderView._ADDEVENTLISTENER](ListDataProviderView._MUTATE, function (event) {
        self.dispatchEvent(event);
      });
    }
  }]);

  return ListDataProviderView;
}();

ListDataProviderView._KEY = 'key';
ListDataProviderView._KEYS = 'keys';
ListDataProviderView._DATA = 'data';
ListDataProviderView._STARTINDEX = 'startIndex';
ListDataProviderView._SORT = 'sort';
ListDataProviderView._SORTCRITERIA = 'sortCriteria';
ListDataProviderView._FILTERCRITERION = 'filterCriterion';
ListDataProviderView._METADATA = 'metadata';
ListDataProviderView._ITEMS = 'items';
ListDataProviderView._FROM = 'from';
ListDataProviderView._OFFSET = 'offset';
ListDataProviderView._REFRESH = 'refresh';
ListDataProviderView._MUTATE = 'mutate';
ListDataProviderView._SIZE = 'size';
ListDataProviderView._FETCHPARAMETERS = 'fetchParameters';
ListDataProviderView._VALUE = 'value';
ListDataProviderView._DONE = 'done';
ListDataProviderView._DATAMAPPING = 'dataMapping';
ListDataProviderView._MAPFIELDS = 'mapFields';
ListDataProviderView._MAPSORTCRITERIA = 'mapSortCriteria';
ListDataProviderView._MAPFILTERCRITERION = 'mapFilterCriterion';
ListDataProviderView._UNMAPSORTCRITERIA = 'unmapSortCriteria';
ListDataProviderView._UNMAPFILTERCRITERION = 'unmapFilterCriterion';
ListDataProviderView._RESULTS = 'results';
ListDataProviderView._CONTAINSPARAMETERS = 'containsParameters';
ListDataProviderView._DEFAULT_SIZE = 25;
ListDataProviderView._CONTAINSKEYS = 'containsKeys';
ListDataProviderView._FETCHBYKEYS = 'fetchByKeys';
ListDataProviderView._FETCHBYOFFSET = 'fetchByOffset';
ListDataProviderView._FETCHFIRST = 'fetchFirst';
ListDataProviderView._ADDEVENTLISTENER = 'addEventListener';
ListDataProviderView._FETCHATTRIBUTES = 'attributes';
oj['ListDataProviderView'] = ListDataProviderView;
oj.ListDataProviderView = ListDataProviderView;
oj.EventTargetMixin.applyMixin(ListDataProviderView);



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 *
 * @since 4.1.0
 * @export
 * @final
 * @class ListDataProviderView
 * @ojtsmodule
 * @implements DataProvider
 * @classdesc Provides list based optimizations for DataProvider and adds some support for providing state
 * for certain operations. e.g supports {@link DataProvider#fetchFirst} starting at arbitrary key or index offset, sortCriteria,
 * and field mapping. Please see the select demos for examples of DataMapping [Select]{@link oj.ojSelect}
 * @param {DataProvider} dataProvider the DataProvider.
 * @param {Object=} options Options for the ListDataProviderView
 * @param {any=} options.from key to start fetching from. This will be applied first before offset is applied.
 * @param {number=} options.offset offset to start fetching from.
 * @param {Array.<SortCriterion>=} options.sortCriteria {@link SortCriterion} to apply to the data.
 * @param {DataMapping=} options.dataMapping mapping to apply to the data.
 * @param {Array<string | FetchAttribute>=} options.attributes fetch attributes to apply
 * @param {DataFilter.Filter=} options.filterCriterion filter criterion to apply. If the DataProvider does not support filtering then
 *        ListDataProviderView will do local filtering of the data.
 * @ojsignature [{target: "Type",
 *               value: "class ListDataProviderView<K, D, Kin, Din> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"},
 *                    {"name": "Kin", "description": "Type of input key"}, {"name": "Din", "description": "Type of input data"}]},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "Kin",
 *               for: "options.from"},
 *               {target: "Type",
 *               value: "Array<SortCriterion<D>>",
 *               for: "options.sortCriteria"},
 *               {target: "Type",
 *               value: "DataMapping<K, D, Kin, Din>",
 *               for: "options.dataMapping"},
 *               {target: "Type",
 *               value: "Array<string | FetchAttribute>",
 *               for: "options.attributes"},
 *               {target: "Type",
 *               value: "DataFilter.Filter<D>",
 *               for: "options.filterCriterion"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
 *   "FetchListResult","FetchListParameters", "FetchAttribute", "DataFilter"]}
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof ListDataProviderView
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * Optional key to start fetching from. Used to set on the ListDataProviderView instance instead of through the constructor.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof ListDataProviderView
 * @instance
 * @name from
 * @type {any}
 * @ojsignature {target: "Type",
 *               value: "?Kin"}
 * @ojtsexample <caption>set the key to start fetching from</caption>
 * dataprovider.from = '1234';
 */

/**
 * Optional offset to start fetching from. Used to set on the ListDataProviderView instance instead of through the constructor.. Should be greater than or equal to zero.
 * If a negative offset is used then it will be treated as zero.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof ListDataProviderView
 * @instance
 * @name offset
 * @type {number=}
 * @ojsignature {target: "Type",
 *               value: "?number"}
 * @ojtsexample <caption>set the offset to start fetching from</caption>
 * dataprovider.offset = 5;
 */

/**
 * Optional sortCriteria to apply. Used to set on the ListDataProviderView instance instead of through the constructor.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof ListDataProviderView
 * @instance
 * @name sortCriteria
 * @type {Array.<SortCriterion>=}
 * @ojsignature {target: "Type",
 *               value: "?Array<SortCriterion<D>>"}
 * @ojtsexample <caption>set the sortCriteria for fetching</caption>
 * dataprovider.sortCriteria = [{attribute: 'DepartmentName', direction: 'ascending'}];
 */

/**
 * Optional dataMapping to apply. Used to set on the ListDataProviderView instance instead of through the constructor.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof ListDataProviderView
 * @instance
 * @name dataMapping
 * @type {DataMapping=}
 * @ojsignature {target: "Type",
 *               value: "?DataMapping<K, D, Kin, Din>"}
 * @ojtsexample <caption>set the data mapping for fetching</caption>
 * dataprovider.dataMapping = function (item) {
 *   let data = item.data;
 *   let mappedItem = {};
 *   mappedItem.data = {};
 *   mappedItem.data.label = data.name;
 *   mappedItem.data.value = data.id;
 *   mappedItem.metadata = { key: data.id };
 *   return mappedItem;
 * };
 */

/**
 * Optional fetch attributes to apply. Used to set on the ListDataProviderView instance instead of through the constructor.
 *
 *
 * @since 4.1.0
 * @export
 * @expose
 * @memberof ListDataProviderView
 * @instance
 * @name attributes
 * @type {Array<string | FetchAttribute>=}
 * @ojsignature {target: "Type",
 *               value: "?Array<string | FetchAttribute>"}
 * @ojtsexample <caption>set the attribute filter for fetching</caption>
 * dataprovider.attributes = ['!lastName', '@default']; // all attributes except lastName
 */

/**
 * Optional filter criterion to apply. Used to set on the ListDataProviderView instance instead of through the constructor.
 *
 *
 * @since 7.0.0
 * @export
 * @expose
 * @memberof ListDataProviderView
 * @instance
 * @name filterCriterion
 * @type {DataFilter.Filter=}
 * @ojsignature {target: "Type",
 *               value: "?DataFilter.Filter<D>"}
 * @ojtsexample <caption>set the filter criterion for fetching</caption>
 * let filterDef = {op: '$or', criteria: [{op: '$eq', value: {name: 'Bob'}}, {op: '$gt', value: {level: 'Low'}}]};
 * dataprovider.filterCriterion = FilterFactory.getFilter(filterDef); // create a standard filter using the filterFactory.
 */

/**
 * End of jsdoc
 */

  return ListDataProviderView;
});