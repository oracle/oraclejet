/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovideradapter-base'], function(oj, $, DataSourceAdapter)
{
  "use strict";
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TableDataSourceAdapter =
/*#__PURE__*/
function (_DataSourceAdapter) {
  _inherits(TableDataSourceAdapter, _DataSourceAdapter);

  function TableDataSourceAdapter(tableDataSource) {
    var _this;

    _classCallCheck(this, TableDataSourceAdapter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TableDataSourceAdapter).call(this, tableDataSource));
    _this.tableDataSource = tableDataSource;

    _this.FetchByKeysResults =
    /*#__PURE__*/
    function () {
      function _class(_parent, fetchParameters, results) {
        _classCallCheck(this, _class);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.results = results;
        this[TableDataSourceAdapter._FETCHPARAMETERS] = fetchParameters;
        this[TableDataSourceAdapter._RESULTS] = results;
      }

      return _class;
    }();

    _this.ContainsKeysResults =
    /*#__PURE__*/
    function () {
      function _class2(_parent, containsParameters, results) {
        _classCallCheck(this, _class2);

        this._parent = _parent;
        this.containsParameters = containsParameters;
        this.results = results;
        this[TableDataSourceAdapter._CONTAINSPARAMETERS] = containsParameters;
        this[TableDataSourceAdapter._RESULTS] = results;
      }

      return _class2;
    }();

    _this.Item =
    /*#__PURE__*/
    function () {
      function _class3(_parent, metadata, data) {
        _classCallCheck(this, _class3);

        this._parent = _parent;
        this.metadata = metadata;
        this.data = data;
        this[TableDataSourceAdapter._METADATA] = metadata;
        this[TableDataSourceAdapter._DATA] = data;
      }

      return _class3;
    }();

    _this.FetchByOffsetResults =
    /*#__PURE__*/
    function () {
      function _class4(_parent, fetchParameters, results, done) {
        _classCallCheck(this, _class4);

        this._parent = _parent;
        this.fetchParameters = fetchParameters;
        this.results = results;
        this.done = done;
        this[TableDataSourceAdapter._FETCHPARAMETERS] = fetchParameters;
        this[TableDataSourceAdapter._RESULTS] = results;
        this[TableDataSourceAdapter._DONE] = done;
      }

      return _class4;
    }();

    _this.FetchListParameters =
    /*#__PURE__*/
    function () {
      function _class5(_parent, size, sortCriteria) {
        _classCallCheck(this, _class5);

        this._parent = _parent;
        this.size = size;
        this.sortCriteria = sortCriteria;
        this[TableDataSourceAdapter._SIZE] = size;
        this[TableDataSourceAdapter._SORTCRITERIA] = sortCriteria;
      }

      return _class5;
    }();

    _this._addTableDataSourceEventListeners();

    _this[TableDataSourceAdapter._OFFSET] = 0;
    _this._ignoreDataSourceEvents = new Array();
    return _this;
  }

  _createClass(TableDataSourceAdapter, [{
    key: "destroy",
    value: function destroy() {
      this._removeTableDataSourceEventListeners();
    }
  }, {
    key: "containsKeys",
    value: function containsKeys(params) {
      var self = this;
      var resultsPromiseArray = [];

      params[TableDataSourceAdapter._KEYS].forEach(function (key) {
        resultsPromiseArray.push(self.tableDataSource.get(key));
      });

      return Promise.all(resultsPromiseArray).then(function (resultsArray) {
        var results = new Set();
        resultsArray.map(function (value) {
          if (value != null) {
            results.add(value[TableDataSourceAdapter._KEY]);
          }
        });
        return Promise.resolve(new self.ContainsKeysResults(self, params, results));
      });
    }
  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      var self = this;
      var resultsPromiseArray = [];

      params[TableDataSourceAdapter._KEYS].forEach(function (key) {
        resultsPromiseArray.push(self.tableDataSource.get(key));
      });

      return Promise.all(resultsPromiseArray).then(function (resultsArray) {
        var results = new Map();
        resultsArray.map(function (value) {
          if (value != null) {
            var key = value[TableDataSourceAdapter._KEY];
            var data = value[TableDataSourceAdapter._DATA];
            results.set(key, new self.Item(self, new self.ItemMetadata(self, key), data));
          }
        });
        return Promise.resolve(new self.FetchByKeysResults(self, params, results));
      });
    }
  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      var self = this;
      var size = params != null ? params[TableDataSourceAdapter._SIZE] : -1;
      var sortCriteria = params != null ? params[TableDataSourceAdapter._SORTCRITERIA] : null;
      var offset = params != null ? params[TableDataSourceAdapter._OFFSET] > 0 ? params[TableDataSourceAdapter._OFFSET] : 0 : 0;
      var fetchParams = new this.FetchListParameters(this, size, sortCriteria);
      this._startIndex = 0;
      return this._getFetchFunc(fetchParams, offset)(fetchParams, true).then(function (iteratorResults) {
        var value = iteratorResults[TableDataSourceAdapter._VALUE];
        var done = iteratorResults[TableDataSourceAdapter._DONE];
        var data = value[TableDataSourceAdapter._DATA];

        var keys = value[TableDataSourceAdapter._METADATA].map(function (value) {
          return value[TableDataSourceAdapter._KEY];
        });

        var resultsArray = new Array();
        data.map(function (value, index) {
          resultsArray.push(new self.Item(self, new self.ItemMetadata(self, keys[index]), data[index]));
        });
        return new self.FetchByOffsetResults(self, params, resultsArray, done);
      });
    }
  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      if (!this._isPagingModelTableDataSource()) {
        this._startIndex = 0;
      }

      return new this.AsyncIterable(new this.AsyncIterator(this._getFetchFunc(params), params));
    }
  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      if (capabilityName == TableDataSourceAdapter._SORT && this.tableDataSource.getCapability(capabilityName) == 'full') {
        return {
          attributes: 'multiple'
        };
      } else if (capabilityName == 'fetchByKeys') {
        return {
          implementation: 'lookup'
        };
      } else if (capabilityName == 'fetchByOffset') {
        return {
          implementation: 'lookup'
        };
      }

      return null;
    }
  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return Promise.resolve(this.tableDataSource.totalSize());
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.tableDataSource.totalSize() > 0 ? 'no' : 'yes';
    } // Start PagingModel APIs

  }, {
    key: "getPage",
    value: function getPage() {
      if (this._isPagingModelTableDataSource()) {
        return this.tableDataSource.getPage();
      }

      return -1;
    }
  }, {
    key: "setPage",
    value: function setPage(value, options) {
      if (this._isPagingModelTableDataSource()) {
        return this.tableDataSource.setPage(value, options);
      }

      return Promise.reject(null);
    }
  }, {
    key: "getStartItemIndex",
    value: function getStartItemIndex() {
      if (this._isPagingModelTableDataSource()) {
        return this.tableDataSource.getStartItemIndex();
      }

      return -1;
    }
  }, {
    key: "getEndItemIndex",
    value: function getEndItemIndex() {
      if (this._isPagingModelTableDataSource()) {
        return this.tableDataSource.getEndItemIndex();
      }

      return -1;
    }
  }, {
    key: "getPageCount",
    value: function getPageCount() {
      if (this._isPagingModelTableDataSource()) {
        return this.tableDataSource.getPageCount();
      }

      return -1;
    }
  }, {
    key: "totalSize",
    value: function totalSize() {
      if (this._isPagingModelTableDataSource()) {
        return this.tableDataSource.totalSize();
      }

      return -1;
    }
  }, {
    key: "totalSizeConfidence",
    value: function totalSizeConfidence() {
      if (this._isPagingModelTableDataSource()) {
        return this.tableDataSource.totalSizeConfidence();
      }

      return null;
    } // End PagingModel APIs

    /**
     * Get the function which performs the fetch
     */

  }, {
    key: "_getFetchFunc",
    value: function _getFetchFunc(params, offset) {
      var self = this;

      if (params != null && params[TableDataSourceAdapter._SORTCRITERIA] != null) {
        var attribute = params[TableDataSourceAdapter._SORTCRITERIA][0][TableDataSourceAdapter._ATTRIBUTE];
        var direction = params[TableDataSourceAdapter._SORTCRITERIA][0][TableDataSourceAdapter._DIRECTION];
        this._ignoreSortEvent = true;

        if (!this._isPagingModelTableDataSource()) {
          this._startIndex = 0;
        }

        return function (attribute, direction) {
          return function (params, fetchFirst) {
            if (fetchFirst) {
              var sortParam = {};
              sortParam[TableDataSourceAdapter._KEY] = attribute;
              sortParam[TableDataSourceAdapter._DIRECTION] = direction;
              self[TableDataSourceAdapter._OFFSET] = 0;
              return self.tableDataSource.sort(sortParam).then(function () {
                self._ignoreSortEvent = false;
                return self._getTableDataSourceFetch(params, offset)(params);
              });
            } else {
              return self._getTableDataSourceFetch(params, offset)(params);
            }
          };
        }(attribute, direction);
      } else {
        return this._getTableDataSourceFetch(params, offset);
      }
    }
    /**
     * Get the function which invokes fetch() on TableDataSource
     */

  }, {
    key: "_getTableDataSourceFetch",
    value: function _getTableDataSourceFetch(params, offset) {
      var self = this;
      return function (params, fetchFirst) {
        var options = {};
        offset = offset > 0 ? offset : 0;

        if (self._startIndex != null) {
          options[TableDataSourceAdapter._STARTINDEX] = self._startIndex + offset;
        }

        options[TableDataSourceAdapter._PAGESIZE] = params != null && params[TableDataSourceAdapter._SIZE] > 0 ? params[TableDataSourceAdapter._SIZE] : null; // to maintain backward compatibility, Table will specify silent flag

        if (!self._isPagingModelTableDataSource() && params[TableDataSourceAdapter._SILENT]) {
          options[TableDataSourceAdapter._SILENT] = params[TableDataSourceAdapter._SILENT];
        }

        if (self.tableDataSource[TableDataSourceAdapter._SORTCRITERIA] != null && params[TableDataSourceAdapter._SORTCRITERIA] == null) {
          params[TableDataSourceAdapter._SORTCRITERIA] = [];
          var sortCriterion = new self.SortCriterion(self, self.tableDataSource[TableDataSourceAdapter._SORTCRITERIA][TableDataSourceAdapter._KEY], self.tableDataSource[TableDataSourceAdapter._SORTCRITERIA][TableDataSourceAdapter._DIRECTION]);

          params[TableDataSourceAdapter._SORTCRITERIA].push(sortCriterion);
        }

        options[TableDataSourceAdapter._FETCHTYPE] = params[TableDataSourceAdapter._FETCHTYPE];
        self._isFetching = true;
        return new Promise(function (resolve, reject) {
          self._fetchResolveFunc = resolve;
          self._fetchRejectFunc = reject;
          self._fetchParams = params;

          if (!self._requestEventTriggered) {
            // set a flag so that we can ignore request and sync events
            if (!self._isPagingModelTableDataSource() && !options[TableDataSourceAdapter._SILENT]) {
              self._ignoreDataSourceEvents.push(true);
            }

            self.tableDataSource.fetch(options).then(function (result) {
              if (!self._isPagingModelTableDataSource() && !options[TableDataSourceAdapter._SILENT]) {
                self._ignoreDataSourceEvents.pop();
              }

              if (result !== null) {
                self._isFetching = false;

                if (result === undefined) {
                  // fetch was not executed due to startFetch='disabled'
                  result = {};
                  result[TableDataSourceAdapter._KEYS] = [];
                  result[TableDataSourceAdapter._DATA] = [];
                }

                var resultMetadata = [];

                if (result[TableDataSourceAdapter._KEYS] != null) {
                  resultMetadata = result[TableDataSourceAdapter._KEYS].map(function (value) {
                    return new self.ItemMetadata(self, value);
                  });
                }

                if (self._startIndex == null) {
                  self._startIndex = 0;
                }

                var done = false;
                self._startIndex = self._startIndex + result[TableDataSourceAdapter._DATA].length;

                if (self.tableDataSource.totalSizeConfidence() == 'actual' && self.tableDataSource.totalSize() > 0 && result.startIndex + result[TableDataSourceAdapter._DATA].length >= self.tableDataSource.totalSize()) {
                  done = true;
                } else if (options[TableDataSourceAdapter._PAGESIZE] > 0 && result[TableDataSourceAdapter._DATA].length < options[TableDataSourceAdapter._PAGESIZE]) {
                  done = true;
                } else if (result[TableDataSourceAdapter._DATA].length == 0) {
                  done = true;
                }

                self._fetchResolveFunc = null;
                self._fetchParams = null;

                if (done) {
                  resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, params, result[TableDataSourceAdapter._DATA], resultMetadata)));
                } else {
                  resolve(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, params, result[TableDataSourceAdapter._DATA], resultMetadata)));
                }
              }
            }, function (error) {
              if (!self._isPagingModelTableDataSource() && !options[TableDataSourceAdapter._SILENT]) {
                self._ignoreDataSourceEvents.pop();
              }

              reject(error);
            });
          }
        });
      };
    }
  }, {
    key: "_handleSync",
    value: function _handleSync(event) {
      var self = this; // checks for sync triggered by own fetch

      if (self._ignoreDataSourceEvents.length > 0) {
        return;
      }

      self._startIndex = null;

      if (event[TableDataSourceAdapter._STARTINDEX] > 0) {
        self._startIndex = event[TableDataSourceAdapter._STARTINDEX];
        self[TableDataSourceAdapter._OFFSET] = self._startIndex;
      }

      if (self._fetchResolveFunc && event[TableDataSourceAdapter._KEYS] != null) {
        self._isFetching = false;

        var resultMetadata = event[TableDataSourceAdapter._KEYS].map(function (value) {
          return new self.ItemMetadata(self, value);
        });

        var done = false;

        if (self.tableDataSource.totalSizeConfidence() == 'actual' && self.tableDataSource.totalSize() > 0 && self._startIndex + event[TableDataSourceAdapter._DATA].length >= self.tableDataSource.totalSize()) {
          done = true;
        }

        if (done) {
          self._fetchResolveFunc(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, self._fetchParams, event[TableDataSourceAdapter._DATA], resultMetadata)));
        } else {
          self._fetchResolveFunc(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, self._fetchParams, event[TableDataSourceAdapter._DATA], resultMetadata)));
        }

        self._fetchResolveFunc = null;
        self._fetchParams = null;
      } else if (!self._requestEventTriggered) {
        self.dispatchEvent(new oj.DataProviderRefreshEvent());
      }

      self._requestEventTriggered = false;
    }
  }, {
    key: "_handleAdd",
    value: function _handleAdd(event) {
      var self = this;

      var metadataArray = event[TableDataSourceAdapter._KEYS].map(function (value) {
        return new self.ItemMetadata(self, value);
      });

      var keySet = new Set();

      event[TableDataSourceAdapter._KEYS].map(function (key) {
        keySet.add(key);
      });

      var operationEventDetail = new self.DataProviderAddOperationEventDetail(self, keySet, null, null, null, metadataArray, event[TableDataSourceAdapter._DATA], event[TableDataSourceAdapter._INDEXES]);
      var mutationEventDetail = new self.DataProviderMutationEventDetail(self, operationEventDetail, null, null);
      self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
  }, {
    key: "_handleRemove",
    value: function _handleRemove(event) {
      var self = this;

      var metadataArray = event[TableDataSourceAdapter._KEYS].map(function (value) {
        return new self.ItemMetadata(self, value);
      });

      var keySet = new Set();

      event[TableDataSourceAdapter._KEYS].map(function (key) {
        keySet.add(key);
      });

      var operationEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, event[TableDataSourceAdapter._DATA], event[TableDataSourceAdapter._INDEXES]);
      var mutationEventDetail = new self.DataProviderMutationEventDetail(self, null, operationEventDetail, null);
      self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
  }, {
    key: "_handleReset",
    value: function _handleReset(event) {
      var self = this; // Dispatch a dataprovider refresh event except for the following situations:
      // 1. If a datasource request event was triggered, a dataprovider refresh event has been dispatched;
      // 2. If the datasource is a paging datasource, the pagingcontrol reset handler will indirectly trigger
      //    a datasource request event, which in turn will dispatch a dataprovider refresh event.
      //

      if (!self._requestEventTriggered && !self._isPagingModelTableDataSource()) {
        self._startIndex = 0;
        self.dispatchEvent(new oj.DataProviderRefreshEvent());
      }
    }
  }, {
    key: "_handleSort",
    value: function _handleSort(event) {
      var self = this;

      if (!self._ignoreSortEvent) {
        self._startIndex = null;
        self.dispatchEvent(new oj.DataProviderRefreshEvent());
      }
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(event) {
      var self = this;

      var metadataArray = event[TableDataSourceAdapter._KEYS].map(function (value) {
        return new self.ItemMetadata(self, value);
      });

      var keySet = new Set();

      event[TableDataSourceAdapter._KEYS].map(function (key) {
        keySet.add(key);
      });

      var operationEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, event[TableDataSourceAdapter._DATA], event[TableDataSourceAdapter._INDEXES]);
      var mutationEventDetail = new self.DataProviderMutationEventDetail(self, null, null, operationEventDetail);
      self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
  }, {
    key: "_handleRefresh",
    value: function _handleRefresh(event) {
      var self = this;

      if (!self._isFetching && !self._requestEventTriggered) {
        if (event[TableDataSourceAdapter._OFFSET] != null) {
          self._startIndex = event[TableDataSourceAdapter._OFFSET];
        } else {
          self._startIndex = null;
        }

        self.dispatchEvent(new oj.DataProviderRefreshEvent());
      }

      self._requestEventTriggered = false;
    }
  }, {
    key: "_handleRequest",
    value: function _handleRequest(event) {
      var self = this; // checks for sync triggered by own fetch

      if (self._ignoreDataSourceEvents.length > 0) {
        return;
      } // to test backward compatibility we still need to be able to access Model from the oj namespace


      if (typeof oj.Model !== "undefined" && event instanceof oj.Model) {
        // ignore request events by oj.Model. Those will be followed by row
        // mutation events anyway
        return;
      }

      if (!self._isFetching) {
        if (event[TableDataSourceAdapter._STARTINDEX] > 0 && self.getStartItemIndex() == 0) {
          self._startIndex = event[TableDataSourceAdapter._STARTINDEX];
        } // dispatch a refresh event which will trigger a the component to
        // do a fetchFirst. However, the fact that we are receiving a request
        // event means that a fetch was already done on the underlying TableDataSource.
        // So we don't need to do another fetch once a fetchFirst comes in, we can
        // just resolve with the results from the paired sync event.


        self._requestEventTriggered = true;
        self.dispatchEvent(new oj.DataProviderRefreshEvent());
      }
    }
  }, {
    key: "_handleError",
    value: function _handleError(event) {
      var self = this;

      if (self._fetchRejectFunc) {
        self._fetchRejectFunc(event);
      }

      self._isFetching = false;
      self._requestEventTriggered = false;
    }
  }, {
    key: "_handlePage",
    value: function _handlePage(event) {
      var self = this;
      self._isFetching = false;
      self._requestEventTriggered = false;
      var options = {};
      options['detail'] = event;
      self.dispatchEvent(new oj.GenericEvent(oj.PagingModel.EventType['PAGE'], options));
    }
    /**
     * Add event listeners to TableDataSource
     */

  }, {
    key: "_addTableDataSourceEventListeners",
    value: function _addTableDataSourceEventListeners() {
      this.removeAllListeners();
      this.addListener('sync', this._handleSync);
      this.addListener('add', this._handleAdd);
      this.addListener('remove', this._handleRemove);
      this.addListener('reset', this._handleReset);
      this.addListener('sort', this._handleSort);
      this.addListener('change', this._handleChange);
      this.addListener('refresh', this._handleRefresh);
      this.addListener('request', this._handleRequest);
      this.addListener('error', this._handleError);
      this.addListener('page', this._handlePage);
    }
    /**
     * Remove event listeners to TableDataSource
     */

  }, {
    key: "_removeTableDataSourceEventListeners",
    value: function _removeTableDataSourceEventListeners() {
      this.removeListener('sync');
      this.removeListener('add');
      this.removeListener('remove');
      this.removeListener('reset');
      this.removeListener('sort');
      this.removeListener('change');
      this.removeListener('refresh');
      this.removeListener('request');
      this.removeListener('error');
      this.removeListener('page');
    }
    /**
     * Check if it's a PagingModel TableDataSource
     */

  }, {
    key: "_isPagingModelTableDataSource",
    value: function _isPagingModelTableDataSource() {
      if (this.tableDataSource['getStartItemIndex'] != null) {
        return true;
      }

      return false;
    }
  }]);

  return TableDataSourceAdapter;
}(DataSourceAdapter);

TableDataSourceAdapter._STARTINDEX = 'startIndex';
TableDataSourceAdapter._SILENT = 'silent';
TableDataSourceAdapter._SORTCRITERIA = 'sortCriteria';
TableDataSourceAdapter._PAGESIZE = 'pageSize';
TableDataSourceAdapter._OFFSET = 'offset';
TableDataSourceAdapter._SIZE = 'size';
TableDataSourceAdapter._CONTAINSPARAMETERS = 'containsParameters';
TableDataSourceAdapter._RESULTS = 'results';
TableDataSourceAdapter._FETCHTYPE = 'fetchType';
oj.EventTargetMixin.applyMixin(TableDataSourceAdapter);
oj['TableDataSourceAdapter'] = TableDataSourceAdapter;
oj.TableDataSourceAdapter = TableDataSourceAdapter;

});