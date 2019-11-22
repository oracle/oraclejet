/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['ojs/ojcore', 'jquery', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $)
{
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PagingDataProviderView =
/*#__PURE__*/
function () {
  function PagingDataProviderView(dataProvider) {
    _classCallCheck(this, PagingDataProviderView);

    this.dataProvider = dataProvider;
    this._KEY = 'key';
    this._KEYS = 'keys';
    this._STARTINDEX = 'startIndex';
    this._PAGESIZE = 'pageSize';
    this._OFFSET = 'offset';
    this._SIZE = 'size';
    this._PAGE = 'page';
    this._PAGECOUNT = 'pageCount';
    this._TOTALSIZE = 'totalsize';
    this._PREVIOUSPAGE = 'previousPage';
    this._BEFOREPAGE = 'beforePage';
    this._DONE = 'done';
    this._VALUE = 'value';
    this._DATA = 'data';
    this._REFRESH = 'refresh';
    this._MUTATE = 'mutate';
    this._SORTCRITERIA = 'sortCriteria';
    this._FILTERCRITERION = 'filterCriterion';
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

    this.FetchListParameters =
    /*#__PURE__*/
    function () {
      function _class5(_parent, size, sortCriteria, filterCriterion) {
        _classCallCheck(this, _class5);

        this._parent = _parent;
        this.size = size;
        this.sortCriteria = sortCriteria;
        this.filterCriterion = filterCriterion;
        this[_parent._SIZE] = size;
        this[_parent._SORTCRITERIA] = sortCriteria;
        this[_parent._FILTERCRITERION] = filterCriterion;
      }

      return _class5;
    }();

    this.FetchListResult =
    /*#__PURE__*/
    function () {
      function _class6(_parent, fetchParameters, data, metadata) {
        _classCallCheck(this, _class6);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.data = data;
        this.metadata = metadata;
        this[_parent._FETCHPARAMETERS] = fetchParameters;
        this[_parent._DATA] = data;
        this[_parent._METADATA] = metadata;
      }

      return _class6;
    }();

    this.FetchByOffsetParameters =
    /*#__PURE__*/
    function () {
      function _class7(_parent, offset, size, sortCriteria, filterCriterion) {
        _classCallCheck(this, _class7);

        this._parent = _parent;
        this.offset = offset;
        this.size = size;
        this.sortCriteria = sortCriteria;
        this.filterCriterion = filterCriterion;
        this[_parent._SIZE] = size;
        this[_parent._SORTCRITERIA] = sortCriteria;
        this[_parent._OFFSET] = offset;
        this[_parent._FILTERCRITERION] = filterCriterion;
      }

      return _class7;
    }();

    this.FetchByOffsetResults =
    /*#__PURE__*/
    function () {
      function _class8(_parent, fetchParameters, results, done) {
        _classCallCheck(this, _class8);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.results = results;
        this.done = done;
        this[_parent._FETCHPARAMETERS] = fetchParameters;
        this[_parent._RESULTS] = results;
        this[_parent._DONE] = done;
      }

      return _class8;
    }();

    this.FetchByKeysResults =
    /*#__PURE__*/
    function () {
      function _class9(_parent, fetchParameters, results) {
        _classCallCheck(this, _class9);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.results = results;
        this[_parent._FETCHPARAMETERS] = fetchParameters;
        this[_parent._RESULTS] = results;
      }

      return _class9;
    }();

    this.ContainsKeysResults =
    /*#__PURE__*/
    function () {
      function _class10(_parent, containsParameters, results) {
        _classCallCheck(this, _class10);

        this._parent = _parent;
        this.containsParameters = containsParameters;
        this.results = results;
        this[_parent._CONTAINSPARAMETERS] = containsParameters;
        this[_parent._RESULTS] = results;
      }

      return _class10;
    }();

    this.ItemMetadata =
    /*#__PURE__*/
    function () {
      function _class11(_parent, key) {
        _classCallCheck(this, _class11);

        this._parent = _parent;
        this.key = key;
        this[_parent._KEY] = key;
      }

      return _class11;
    }();

    this.DataProviderMutationEventDetail =
    /*#__PURE__*/
    function () {
      function _class12(_parent, add, remove, update) {
        _classCallCheck(this, _class12);

        this._parent = _parent;
        this.add = add;
        this.remove = remove;
        this.update = update;
        this[_parent._ADD] = add;
        this[_parent._REMOVE] = remove;
        this[_parent._UPDATE] = update;
      }

      return _class12;
    }();

    this.DataProviderOperationEventDetail =
    /*#__PURE__*/
    function () {
      function _class13(_parent, keys, metadata, data, indexes) {
        _classCallCheck(this, _class13);

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

      return _class13;
    }();

    this.DataProviderAddOperationEventDetail =
    /*#__PURE__*/
    function () {
      function _class14(_parent, keys, afterKeys, addBeforeKeys, metadata, data, indexes) {
        _classCallCheck(this, _class14);

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

      return _class14;
    }();

    var self = this;

    this._addEventListeners(dataProvider);

    this._currentPage = -1;
    this._pageSize = -1;
    this._pageCount = -1;
    this._offset = 0;
    this._totalSize = -1;
    this._skipCriteriaCheck = false; // set up initialize promise check to make sure setPage is called before 
    // fetching data

    this._isInitialized = new Promise(function (resolve) {
      self._resolveFunc = resolve;
    }); // set up initialize data promise check to make sure data is loaded 
    // before View fetch calls are allowed to continue

    this._isInitialDataLoaded = new Promise(function (resolve) {
      self._dataResolveFunc = resolve;
    });
    this._hasMutated = false;
    this._mustRefetch = false;
    this._isFetchingForMutation = false;
    this._mutationEventQueue = [];
    this._isMutating = null;
    this._mutationFunc = null;
    this._doRefreshEvent = false;
    this._mutatingTotalSize = null;
    this._fetchMore = false;
    this._isUnknownRowCount = false;
  }

  _createClass(PagingDataProviderView, [{
    key: "containsKeys",
    value: function containsKeys(params) {
      var self = this;
      return this._checkIfDataInitialized(function () {
        // if containsKeys exists, use that and filter out extra keys
        return self.dataProvider[self._CONTAINSKEYS](params).then(function (value) {
          var keys = value.results;

          if (!self._isGlobal(params)) {
            var currentPageResults = new Set();

            var currentPageKeys = self._getCurrentPageKeys();

            keys.forEach(function (key) {
              if (currentPageKeys.indexOf(key) != -1) {
                currentPageResults.add(key);
              }
            });
            return new self.ContainsKeysResults(self, params, currentPageResults);
          } else {
            return new self.ContainsKeysResults(self, params, keys);
          }
        });
      });
    }
  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      var self = this;
      return this._checkIfDataInitialized(function () {
        var requestedKeys = params.keys;

        if (!self._isGlobal(params)) {
          // use the cached fetch data to get values by keys.
          return self._fetchByOffset(new self.FetchByOffsetParameters(self, self._offset, self._pageSize, self._currentSortCriteria, self._currentFilterCriteria)).then(function (results) {
            var result = results['results'];
            var mappedResultMap = new Map();
            var filteredResults = result.map(function (value) {
              if (requestedKeys.has(value[self._METADATA][self._KEY])) {
                return value;
              }
            });
            filteredResults.forEach(function (value) {
              if (value) {
                mappedResultMap.set(value[self._METADATA][self._KEY], value);
              }
            });
            return new self.FetchByKeysResults(self, params, mappedResultMap);
          });
        } else {
          // fetching globally so need to use the dataprovider.
          if (self.dataProvider[self._FETCHBYKEYS]) {
            return self.dataProvider[self._FETCHBYKEYS](params);
          } else {
            // doesn't exist so need to throw an error
            throw new Error("Global scope not supported for this dataprovider");
          }
        }
      });
    }
  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      var self = this;
      return this._checkIfDataInitialized(function () {
        var offset = params != null ? params[self._OFFSET] > 0 ? params[self._OFFSET] : 0 : 0;
        params = new self.FetchByOffsetParameters(self, self._offset, self._pageSize, self._currentSortCriteria, self._currentFilterCriteria);
        return self._fetchByOffset(params).then(function (results) {
          var newResult = results['results'].filter(function (value, index) {
            return index >= offset;
          });
          return new self.FetchByOffsetResults(self, self._getLocalParams(params), newResult, results['done']);
        });
      });
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      var self = this; // set up iterator variables

      var sortCriteria = params != null ? params[self._SORTCRITERIA] : null;
      var filterCriterion = params != null ? params[self._FILTERCRITERION] : null;
      var payload = {}; // we can force a criteria check skip if we know that we shouldn't check

      if (self._skipCriteriaCheck) {
        self._skipCriteriaCheck = false;
      } else {
        // check criteria. If different, reset page to 0
        if (!self._isSameCriteria(sortCriteria, filterCriterion)) {
          self._currentSortCriteria = sortCriteria;
          self._currentFilterCriteria = filterCriterion;
          self._offset = 0;

          if (self._currentPage != 0) {
            payload[self._PREVIOUSPAGE] = self._currentPage;
            self._currentPage = 0;
            payload[self._PAGE] = self._currentPage;
          }
        }
      }

      var offset = self._offset;
      var size = self._pageSize; // this fetchFirst applies the offset properties on the this.

      return new self.AsyncIterable(self, new self.AsyncIterator(self, function () {
        return function () {
          var updatedParams = new self.FetchByOffsetParameters(self, offset, size, self._currentSortCriteria, self._currentFilterCriteria);
          return self._checkIfDataInitialized(function () {
            return self._fetchByOffset(updatedParams).then(function (result) {
              var results = result['results'];
              var data = results.map(function (value) {
                return value[self._DATA];
              });
              var metadata = results.map(function (value) {
                return value[self._METADATA];
              });
              offset = offset + metadata.length; // fire page change event in the case of sort operation resetting the page to 0

              if (payload[self._PAGE] != null) {
                self.dispatchEvent(new CustomEvent(self._PAGE, {
                  "detail": payload
                }));
                payload = {};
              } // Datagrid triggers fetchfirst before setPage, so we need to clear this parameter here


              self._skipCriteriaCheck = false;
              var resultsParam = new self.FetchByOffsetParameters(self, result['fetchParameters']['offset'], self._pageSize, self._currentSortCriteria); // if the dataprovider supports fetchByOffset then we use that to do an offset based fetch

              if (result[self._DONE]) {
                return Promise.resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, resultsParam, data, metadata)));
              }

              return Promise.resolve(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, resultsParam, data, metadata)));
            });
          });
        };
      }(), params));
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      return this.dataProvider.getCapability(capabilityName);
    }
  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      var self = this;
      return this._checkIfInitialized(function () {
        return new Promise(function (resolve) {
          resolve(self._pageSize);
        });
      });
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.dataProvider.isEmpty();
    } // Start PagingModel APIs

  }, {
    key: "getPage",
    value: function getPage() {
      return this._currentPage;
    }
  }, {
    key: "setPage",
    value: function setPage(value, options) {
      var self = this; // make sure mutation events are complete before starting

      return this._mutationBusyContext(function () {
        value = parseInt(value, 10);
        var payload = {};
        payload[self._PAGE] = value;
        payload[self._PREVIOUSPAGE] = self._currentPage;
        self.dispatchEvent(new CustomEvent(self._BEFOREPAGE, payload));

        if (options[self._PAGESIZE] != null) {
          self._pageSize = options[self._PAGESIZE];
        }

        self._offset = parseInt(value, 10) * self._pageSize;
        self._currentPage = value; // Handle initialization confirmation

        if (self._isInitialized != null) {
          self._resolveFunc(true);

          self._updateTotalSize();
        }

        var params = new self.FetchByOffsetParameters(self, self._offset, self._pageSize, self._currentSortCriteria, self._currentFilterCriteria);
        return self._fetchByOffset(params).then(function (results) {
          var data = results['results'];

          if (data.length !== 0) {
            self._endItemIndex = self._offset + data.length - 1;
            self._skipCriteriaCheck = true;
            self.dispatchEvent(new CustomEvent(self._PAGE, {
              detail: payload
            }));

            self._updateTotalSize();
          } else if (self._currentPage !== 0) {
            // reset to previous page if no data and not on page 1
            // since it means we were done last page
            self._currentPage = payload[self._PREVIOUSPAGE];
            self._offset = self._currentPage * self._pageSize;
            self.dispatchEvent(new CustomEvent(self._PAGECOUNT, {
              detail: {
                "previousValue": value,
                "value": value
              }
            })); // skip refresh

            self._doRefreshEvent = false;
          } else {
            // no data and page 0 means empty data set
            self._offset = 0;
            self._endItemIndex = 0;
          } // skip initial refresh so that view doesn't
          // double fetch. Also confirm that initial data has been loaded


          if (self._doRefreshEvent) {
            self._hasMutated = true;
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
          } else {
            self._dataResolveFunc(true);

            self._doRefreshEvent = true;
          }
        });
      });
    }
  }, {
    key: "getStartItemIndex",
    value: function getStartItemIndex() {
      return this._offset;
    }
  }, {
    key: "getEndItemIndex",
    value: function getEndItemIndex() {
      return this._endItemIndex;
    }
  }, {
    key: "getPageCount",
    value: function getPageCount() {
      return this._pageCount;
    }
  }, {
    key: "totalSize",
    value: function totalSize() {
      return this._totalSize;
    }
  }, {
    key: "totalSizeConfidence",
    value: function totalSizeConfidence() {
      if (this._totalSizeConfidence) {
        return this._totalSizeConfidence;
      } else {
        if (this._totalSize === -1) {
          return 'unknown';
        }

        return 'actual';
      }
    } // End PagingModel APIs
    // Start Paging DataProvider View Helper API
    // helper method for the view to get the global offset

  }, {
    key: "getGlobalIndex",
    value: function getGlobalIndex(value) {
      return this._offset + value;
    } // helper method for the view to get the local offset

  }, {
    key: "getLocalIndex",
    value: function getLocalIndex(value) {
      return value - this._offset;
    } // End Paging DataProvider View Helper API
    // helper method to get local params

  }, {
    key: "_getLocalParams",
    value: function _getLocalParams(params) {
      return new this.FetchByOffsetParameters(this, this.getLocalIndex(params.offset), params.size, params.sortCriteria, params.filterCriterion);
    } // helper method to update total size and fire events if necessary

  }, {
    key: "_updateTotalSize",
    value: function _updateTotalSize() {
      var self = this; // fire pagecount/totalsize change events if applicable

      var previousTotalSize = self._totalSize;
      var previousPageCount = self._pageCount;
      return this._checkIfInitialized(function () {
        return self.dataProvider.getTotalSize().then(function (totalSize) {
          self._totalSize = totalSize; // Reset page count;

          self._pageCount = -1;

          if (self._totalSize !== -1) {
            if (self._isUnknownRowCount) {
              // unknown row count flag means that we should be in
              // partial row count mode now
              self._isUnknownRowCount = false;
              self._totalSizeConfidence = 'atLeast';
            }

            self._pageCount = Math.ceil(self._totalSize / self._pageSize); // update offsets and currentpage if needed

            if (self._offset >= self._totalSize) {
              self._offset = self._totalSize - self._totalSize % self._pageSize;
              self._endItemIndex = self._totalSize - 1;
              var newPage = Math.floor(self._totalSize / self._pageSize);

              if (self._currentPage != newPage) {
                var payload = {};
                payload[self._PAGE] = newPage;
                payload[self._PREVIOUSPAGE] = self._currentPage;
                self.dispatchEvent(new CustomEvent(self._PAGE, {
                  detail: payload
                }));
                self._currentPage = newPage;
              }
            }

            if (previousPageCount != self._pageCount) {
              self.dispatchEvent(new CustomEvent(self._PAGECOUNT, {
                detail: {
                  "previousValue": previousPageCount,
                  "value": self._pageCount
                }
              }));
            } else if (previousTotalSize != self._totalSize) {
              self.dispatchEvent(new CustomEvent(self._TOTALSIZE, {
                detail: {
                  "previousValue": previousTotalSize,
                  "value": self._totalSize
                }
              }));
            }
          }

          return self._pageSize;
        });
      });
    } // busy context for mutation event handling. 
    // should block setPage calls until done

  }, {
    key: "_mutationBusyContext",
    value: function _mutationBusyContext(callback) {
      var self = this;

      if (this._isMutating) {
        return self._isMutating.then(function () {
          self._isMutating = null;
          return callback();
        });
      } else {
        return callback();
      }
    } // setup the mutation busyContext

  }, {
    key: "_setupMutationBusyContext",
    value: function _setupMutationBusyContext() {
      var self = this;
      this._isMutating = new Promise(function (resolve) {
        self._mutationFunc = resolve;
      });
    } // helper method to check if paging control dataprovider view is initialized with currentpage

  }, {
    key: "_checkIfInitialized",
    value: function _checkIfInitialized(callback) {
      var self = this;

      if (this._isInitialized) {
        return self._isInitialized.then(function (value) {
          // make sure currentPage is set
          if (!value || self._currentPage == -1) {
            self._isInitialized = null;
            throw new Error("Paging DataProvider View incorrectly initialized");
          } else {
            self._isInitialized = null;
            return callback();
          }
        });
      } else {
        return callback();
      }
    } // helper method to check if paging control dataprovider view is initialized with data  

  }, {
    key: "_checkIfDataInitialized",
    value: function _checkIfDataInitialized(callback) {
      var self = this;

      if (this._isInitialDataLoaded) {
        return self._isInitialDataLoaded.then(function (value) {
          // make sure currentPage is set
          if (!value || self._currentPage == -1) {
            self._isInitialDataLoaded = null;
            throw new Error("Paging DataProvider View incorrectly initialized");
          } else {
            self._isInitialDataLoaded = null;
            return callback();
          }
        });
      } else {
        return callback();
      }
    } // helper method to determine if a row is in the current page.

  }, {
    key: "_getCurrentPageKeys",
    value: function _getCurrentPageKeys() {
      var self = this;

      var currentPageKeys = this._currentResults.map(function (value) {
        return value[self._METADATA][self._KEY];
      });

      return currentPageKeys;
    } // helper method to check that all params for the current fetched data are still the same

  }, {
    key: "_isSameParams",
    value: function _isSameParams(params) {
      if (this._currentParams[this._SIZE] === params[this._SIZE] && this._currentParams[this._OFFSET] === params[this._OFFSET] && this._currentParams[this._SORTCRITERIA] === params[this._SORTCRITERIA] && this._currentParams[this._FILTERCRITERION] === params[this._FILTERCRITERION]) {
        return true;
      } else {
        return false;
      }
    } // helper method to determine if the criteria is the same

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
    key: "_isGlobal",
    value: function _isGlobal(params) {
      return params.scope != undefined && params.scope === "global";
    } // helper method to get current page data

  }, {
    key: "_getCurrentPageData",
    value: function _getCurrentPageData() {
      var self = this; // if params haven't changed, just return what we already have
      // Also need to check that offset and page size are properly set

      if (self._currentParams && self._currentParams['offset'] === self._offset && self._currentParams['size'] === self._pageSize) {
        if (self._currentResults && !self._hasMutated) {
          return new Promise(function (resolve) {
            resolve(new self.FetchByOffsetResults(self, self._getLocalParams(self._currentParams), self._currentResults, self._currentIsDone));
          });
        } else {
          return self._fetchByOffset(self._currentParams).then(function (result) {
            return result;
          });
        }
      } else {
        return self._fetchByOffset(new self.FetchByOffsetParameters(self, self._offset, self._pageSize, self._currentSortCriteria, self._currentFilterCriteria)).then(function (result) {
          return result;
        });
      }
    } // internal fetch by offset method to get page data based on offset

  }, {
    key: "_fetchByOffset",
    value: function _fetchByOffset(params) {
      var self = this;
      return this._checkIfInitialized(function () {
        // if params haven't changed, just return what we already have
        if (self._currentParams && self._isSameParams(params) && !self._hasMutated) {
          return new Promise(function (resolve) {
            resolve(new self.FetchByOffsetResults(self, self._getLocalParams(self._currentParams), self._currentResults, self._currentIsDone));
          });
        }

        params = self._cleanFetchParams(params); // If size is 0, then we have hit the end of the data and we should be
        // returning empty results with done = true

        if (params.size === 0) {
          self._currentIsDone = true;
          self._currentResults = [];
          self._currentParams = params;
          return new Promise(function (resolve) {
            resolve(new self.FetchByOffsetResults(self, self._getLocalParams(params), [], self._currentIsDone));
          });
        }

        return self._fetchByOffsetHelper(params);
      });
    }
  }, {
    key: "_fetchByOffsetHelper",
    value: function _fetchByOffsetHelper(params) {
      var self = this; // perform a fetch by offset using the available params.

      return self.dataProvider[self._FETCHBYOFFSET](params).then(function (result) {
        // store results locally. If fetchMore is true, we should append instead of replace
        self._currentIsDone = result['done'];

        if (self._fetchMore) {
          self._currentResults = self._currentResults.concat(result['results']);
        } else {
          self._currentResults = result['results'];
          self._currentParams = params;
        }

        self._fetchMore = false; // check if we are at the end of the available data

        var resultSize = self._currentResults.length;
        var newSize = self._offset + resultSize;

        if (result['done']) {
          self._pageCount = Math.ceil(newSize / self._pageSize); // if partial, can change back to exact.

          if (self._totalSizeConfidence) {
            self._totalSizeConfidence = null;
          }
        } else if (!result['done'] && newSize >= self._totalSize && self._totalSize > -1 && params.size === self._pageSize) {
          // we have more data than we expect given the totalSize, so we should be in partial mode
          self._totalSizeConfidence = 'atLeast';
          self._pageCount = self._pageCount + 1;
        } else if (!result['done'] && resultSize < self._pageSize) {
          // we are not done and we have less data than we expected.
          // need to refetch with new params since the underlying dataprovider
          // fetchSize is smaller than pageSize
          self._fetchMore = true;
          var newParams = new self.FetchByOffsetParameters(self, newSize, self._pageSize - resultSize, self._currentSortCriteria, self._currentFilterCriteria);
          return self._fetchByOffsetHelper(newParams);
        } else if (!result['done'] && self._totalSize === -1) {
          // either we haven't initialized total size yet, 
          // or we are in unknown row count mode
          self._isUnknownRowCount = true;
        } // check if pageSize matches length or if length and offset hits total size.


        if (self._pageSize == self._currentResults.length || newSize >= self._totalSize && self._totalSize > -1) {
          self._currentIsDone = true;
        } // updated data so set mutated flag to false;


        self._hasMutated = false;
        return new self.FetchByOffsetResults(self, self._getLocalParams(self._currentParams), self._currentResults, self._currentIsDone);
      }).catch(function (reject) {
        // if fetch is rejected, set all current records to null and reject.
        self._hasMutated = false;
        self._fetchMore = false;
        self._currentIsDone = null;
        self._currentResults = null;
        self._currentParams = null;
        return Promise.reject(reject);
      });
    } // Sanity Check helper method to correct any issues with the params for fetch by offset.

  }, {
    key: "_cleanFetchParams",
    value: function _cleanFetchParams(params) {
      var self = this; // Sanity Check that the offset is within acceptable range

      var newOffset = params.offset;

      if (newOffset >= self._offset + self._pageSize || newOffset < self._offset) {
        newOffset = self._offset;
      } // Sanity Check that the pageSize is positive


      var newSize = params.size;

      if (newSize <= 0) {
        newSize = self._pageSize;
      } // Sanity Check that the size and offset are both within the context of the current Page limits.


      if (newOffset + newSize > self._offset + self._pageSize) {
        newSize = self._offset + self._pageSize - newOffset;
      }

      var totalSize = self._mutatingTotalSize === null ? self._totalSize : self._mutatingTotalSize;

      if (totalSize > 0 && self._totalSizeConfidence !== 'atLeast') {
        // Sanity Check that the size and offset combined are within bounds of the total page size
        if (newOffset + newSize > totalSize) {
          newSize = totalSize - newOffset;
        }
      }

      return new self.FetchByOffsetParameters(self, newOffset, newSize, params.sortCriteria, params.filterCriterion);
    } // helper method to fetch data from dataprovider
    // needs to make sure that no new mutation events have 
    // occurred while fetching to prevent mistakes.

  }, {
    key: "_mutationEventDataFetcher",
    value: function _mutationEventDataFetcher(callback) {
      var self = this;
      this.dataProvider.getTotalSize().then(function (totalSize) {
        if (totalSize > 0) {
          self._mutatingTotalSize = totalSize;

          if (self._offset >= totalSize) {
            self._offset = totalSize - (totalSize - 1) % self._pageSize - 1;
            self._endItemIndex = totalSize - 1;
          }
        }

        self._getCurrentPageData().then(function (result) {
          if (self._mustRefetch) {
            self._mustRefetch = false;
            self._hasMutated = true;

            self._mutationEventDataFetcher(callback);
          } else {
            callback(result);
          }
        }).catch(function (reject) {
          // try again if must refetch is true
          if (self._mustRefetch) {
            self._mustRefetch = false;
            self._hasMutated = true;

            self._mutationEventDataFetcher(callback);
          } else {
            return Promise.reject(reject);
          }
        });
      });
    } // helper method to handle mutation events with index

  }, {
    key: "_processMutationEventsByKey",
    value: function _processMutationEventsByKey(result) {
      var self = this;
      var removeMetadataArray = [];
      var removeDataArray = [];
      var removeIndexArray = [];
      var removeKeySet = new Set();
      var addMetadataArray = [];
      var addDataArray = [];
      var addIndexArray = [];
      var addKeySet = new Set();
      var updateMetadataArray = [];
      var updateDataArray = [];
      var updateIndexArray = [];
      var updateKeySet = new Set(); //TODO iterate through previous page data vs current page data 
      // and generate the mutation event detail

      var previousPageData = self._currentResultsForMutation.map(function (item, index) {
        return {
          item: item,
          index: index
        };
      });

      var updatedPageData = result['results'].map(function (item, index) {
        return {
          item: item,
          index: index
        };
      });
      var previousPageDataKeys = previousPageData.map(function (item) {
        return item.item.metadata.key;
      });
      var updatedPageDataKeys = updatedPageData.map(function (item) {
        return item.item.metadata.key;
      });
      var removedItems = previousPageData.filter(function (item) {
        return updatedPageDataKeys.indexOf(item.item.metadata.key) < 0;
      });
      var addedItems = updatedPageData.filter(function (item) {
        return previousPageDataKeys.indexOf(item.item.metadata.key) < 0;
      }); // Use filtered mutation event queue to track update events

      var updateMutationsIndices = self._mutationEventQueue.filter(function (item) {
        return !item.detail.add && !item.detail.remove && item.detail.update;
      }).map(function (item) {
        return item.detail.update.indexes;
      }); // flatten array so we can check for duplicates


      updateMutationsIndices = updateMutationsIndices.reduce(function (a, b) {
        return a.concat(b);
      }, []); // remove duplicate update entries

      updateMutationsIndices = updateMutationsIndices.filter(function (item, index) {
        return updateMutationsIndices.indexOf(item) === index;
      }); // Use tracked update event items to check whether or not
      // existing items in the previous page data that are in the
      // same place in the current page date have updated.

      var updateItems = previousPageData.filter(function (item) {
        var updatedIndex = updatedPageDataKeys.indexOf(item.item.metadata.key);

        if (updateMutationsIndices.indexOf(updatedIndex) > -1) {
          return true;
        }

        return false;
      }); // clear mutation event queue

      self._mutationEventQueue = [];

      if (addedItems.length > 0) {
        addedItems.forEach(function (item) {
          addMetadataArray.push(updatedPageData[item.index].item.metadata);
          addDataArray.push(updatedPageData[item.index].item.data);
          addIndexArray.push(item.index);
        });
        addMetadataArray.map(function (metadata) {
          addKeySet.add(metadata.key);
        });
      }

      if (removedItems.length > 0) {
        removedItems.forEach(function (item) {
          removeMetadataArray.push(previousPageData[item.index].item.metadata);
          removeDataArray.push(previousPageData[item.index].item.data);
          removeIndexArray.push(item.index);
        });
        removeMetadataArray.map(function (metadata) {
          removeKeySet.add(metadata.key);
        });
      }

      if (updateItems.length > 0) {
        updateItems.forEach(function (item) {
          updateMetadataArray.push(previousPageData[item.index].item.metadata);
          updateDataArray.push(previousPageData[item.index].item.data);
          updateIndexArray.push(item.index);
        });
        updateMetadataArray.map(function (metadata) {
          updateKeySet.add(metadata.key);
        });
      } // build mutation event detail and fire if not null


      var operationAddEventDetail = null;
      var operationRemoveEventDetail = null;
      var operationUpdateEventDetail = null;

      if (addIndexArray.length > 0) {
        operationAddEventDetail = new self.DataProviderAddOperationEventDetail(self, addKeySet, null, null, addMetadataArray, addDataArray, addIndexArray);
      }

      if (removeIndexArray.length > 0) {
        operationRemoveEventDetail = new self.DataProviderOperationEventDetail(self, removeKeySet, removeMetadataArray, removeDataArray, removeIndexArray);
      }

      if (updateIndexArray.length > 0) {
        operationUpdateEventDetail = new self.DataProviderOperationEventDetail(self, updateKeySet, updateMetadataArray, updateDataArray, updateIndexArray);
      }

      if (operationAddEventDetail != null || operationRemoveEventDetail != null || operationUpdateEventDetail != null) {
        var mutationEventDetail = new self.DataProviderMutationEventDetail(self, operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail);
        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
      }
    }
  }, {
    key: "_addEventListeners",
    value: function _addEventListeners(dataprovider) {
      var self = this;
      dataprovider.addEventListener(this._REFRESH, function (event) {
        // Treat it as a set page to 0 and refresh if not
        // directly after a mutation b/c mutation event trigger
        // refresh naturally. Natural refreshes need to update 
        // totalSize and force fetching. 
        if (!self._hasMutated) {
          self._hasMutated = true;

          self._updateTotalSize().then(function () {
            self.setPage(0, {
              pageSize: self._pageSize
            }).then(function () {
              // if no data, set page skips refresh event dispatch,
              // so we need to fire it off here to update the view with no data.
              if (self._endItemIndex === 0) {
                self.dispatchEvent(new oj.DataProviderRefreshEvent());
              }
            });
          });
        }
      });
      dataprovider.addEventListener(this._MUTATE, function (event) {
        self._mutationEventQueue.push(event);

        self._setupMutationBusyContext();

        if (self._isFetchingForMutation) {
          // if new mutation has come in, we need to refetch. Otherwise, we may have stale data.
          self._mustRefetch = true;
        } else {
          self._isFetchingForMutation = true;
          self._currentResultsForMutation = self._currentResults; // kick off new data fetch

          self._hasMutated = true;

          self._mutationEventDataFetcher(function (result) {
            // finish fetching updated data
            self._isFetchingForMutation = false;

            self._updateTotalSize().then(function () {
              self._mutatingTotalSize = null;

              if (result['results'].length === 0) {
                // no results so need to refresh since page has changed
                self._mutationFunc(true);

                self.setPage(self._currentPage, {
                  pageSize: self._pageSize
                });
              } else {
                self._processMutationEventsByKey(result);

                self._mutationFunc(true);
              }
            });
          });
        }
      });
    }
  }]);

  return PagingDataProviderView;
}();

oj['PagingDataProviderView'] = PagingDataProviderView;
oj.PagingDataProviderView = PagingDataProviderView;
oj.EventTargetMixin.applyMixin(PagingDataProviderView);



/* jslint browser: true,devel:true*/

/**
 *
 * @export
 * @final
 * @class oj.PagingDataProviderView
 * @implements oj.PagingModel
 * @implements oj.DataProvider
 * @classdesc This class implements {@link oj.DataProvider}.
 *            Wraps a {@link oj.DataProvider} to be used with [PagingControl]{@link oj.PagingControl}.
 *            Supports PagingModel API.
 * @param {oj.DataProvider} dataProvider the {@link oj.DataProvider} to be wrapped.
 *                                      <p>This can be either any DataProvider or a wrapped
 *                                      DataSource with a TableDataSourceAdapter. Paging DataProvider View does
 *                                      not handle DataProviders with unknown total sizes.</p>
 * @ojsignature [{target: "Type",
 *               value: "class PagingDataProviderView<K, D> implements DataProvider<K, D>, PagingModel"},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsimport {module: "ojpagingmodel", type: "AMD", imported: ["PagingModel"]}
 * @ojtsmodule
 */

/**
 * Check if rows are contained by keys (default: local dataset)
 * FetchByKeysParameter scope may be set to "global" to check in global dataset
 *
 *
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by keys (default: local dataset)
 * FetchByKeysParameter scope may be set to "global" to fetch in global dataset
 *
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Fetch rows by offset within context of the current page data.
 *
 *
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 */

/**
 * Fetch the first block of data. Limited to scope of the current page data.
 *
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 */

/**
 * Determines whether this DataProvider supports certain feature.
 *
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort".
 * @return {Object} capability information or null if unsupported
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link oj.FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link oj.FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link oj.SortCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName?: string): any"}
 */

/**
 * Gets the total size of the current page data set
 *
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows.
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Return a string that indicates if this data provider is empty
 *
 * @return {"yes"|"no"|"unknown"} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until a fetch is made.
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 *
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name addEventListener
 * @param {string} eventType The event type to listen for.
 * @param {EventListener} listener The callback function that receives the event notification.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Remove a listener previously registered with addEventListener.
 *
 *
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name removeEventListener
 * @param {string} eventType The event type that the listener was registered for.
 * @param {EventListener} listener The callback function that was registered.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Dispatch an event and invoke any registered listeners.
 *
 *
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @instance
 * @method
 * @name dispatchEvent
 * @param {Event} event The event object to dispatch.
 * @return {boolean} Return false if a registered listener has cancelled the event. Return true otherwise.
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

/**
 * Get the current page
 * @return {number} The current page
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @method
 * @name getPage
 * @instance
 */

/**
 * Set the current page. This will trigger a refresh event. During initialization
 * the refresh event is skipped.
 * @param {number} value The current page
 * @param {Object=} options Options<p>
 *                  pageSize: The page size.<p>
 * @return {Promise} promise object triggering done when complete..
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @method
 * @name setPage
 * @instance
 */

/**
 * Get the current page start index
 * @return {number} The current page start index
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @method
 * @name getStartItemIndex
 * @instance
 */

/**
 * Get the current page end index
 * @return {number} The current page end index
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @method
 * @name getEndItemIndex
 * @instance
 */

/**
 * Get the page count
 * @return {number} The total number of pages
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @method
 * @name getPageCount
 * @instance
 */

/**
 * @export
 * Return the total number of items. Returns -1 if unknown.
 * @returns {number} total number of items
 * @expose
 * @memberof oj.PagingDataProviderView
 * @method
 * @name totalSize
 * @instance
 */

/**
 * Returns the confidence for the totalSize value.
 * @return {string} "actual" if the totalSize is the time of the fetch is an exact number
 *                  "estimate" if the totalSize is an estimate
 *                  "atLeast" if the totalSize is at least a certain number
 *                  "unknown" if the totalSize is unknown
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @method
 * @name totalSizeConfidence
 * @instance
 */

/**
 * Translates and returns the global index given a local index.
 *
 * @param {number} value The local index to be translated
 * @return {number} The translated global index
 * @export
 * @expose
 * @memberof oj.PagingDataProviderView
 * @method
 * @name getGlobalIndex
 * @instance
 */

/**
 * End of jsdoc
 */

  return PagingDataProviderView;
});