/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojdatasource-common'], function(oj, $)
{
  "use strict";


/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* global Promise:false */

/* jslint browser: true,devel:true*/
/**
 * @export
 * @class oj.FlattenedTreeTableDataSource
 * @extends oj.TableDataSource
 * @ojtsignore
 * @classdesc Object representing data used by Table with RowExpander.<br><br>
 *            See the <a href="../jetCookbook.html?component=rowExpander&demo=tableRowExpander">Row Expander - Table</a> demo for an example.<br><br>
 *            Refer to {@link oj.TableDataSource} for other data sources that represent tabular data.
 * @param {Object} data
 * @param {Object|null} options Options for the FlattenedTreeTableDataSource
 * @param {string} options.startFetch Control whether to start initial fetch when the TableDataSource is bound to a component.  Valid values are:<br><br>
 *                                    <b>"enabled"</b> (default) - Start initial fetch automatically when the TableDataSource is bound to a component.<br>
 *                                    <b>"disabled"</b> - Do not start initial fetch automatically.  Application will call the <a href="#fetch">fetch()</a> method to
 *                                                        start the first fetch.
 * @constructor
 * @final
 * @since 1.0
 */
oj.FlattenedTreeTableDataSource = function (data, options) {
  // Initialize
  var _options = options || {};

  if (!(data instanceof oj.FlattenedTreeDataSource)) {
    var errSummary = oj.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_SUMMARY;
    var errDetail = oj.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_DETAIL;
    throw new Error(errSummary + '\n' + errDetail);
  }

  this._data = data;
  this._eventHandlers = [];
  this._startIndex = 0;
  this._nodeSetList = [];
  this._hasMore = true;

  // override the fetchSize with -1 if not already specified.
  if (this._data.getOption('fetchSize') == null) {
    this._data.getFetchSize = function () {
      return -1;
    };
  }
  var self = this;
  // override the insert/removeRows function
  this._data.insertRows = function (insertAtIndex, insertAtKey, nodeSet) {
    var rowArray = [];
    var keyArray = [];
    var indexArray = [];
    for (var i = 0; i < nodeSet.getCount(); i++) {
      var row = nodeSet.getData(i);
      var rowKey = nodeSet.getMetadata(i).key;
      var rowIdx = insertAtIndex + i;
      self._nodeSetList.splice(rowIdx, 0, {});
      self._nodeSetList[rowIdx].nodeSet = nodeSet;
      self._nodeSetList[rowIdx].startIndex = insertAtIndex;

      // update the startIndex of the shifted rows
      for (var j = rowIdx + 1; j < self._nodeSetList.length; j++) {
        self._nodeSetList[j].startIndex += 1;
      }
      rowArray.push(self._wrapWritableValue(row));
      keyArray.push(rowKey);
      indexArray.push(rowIdx);
      self._rows.data.splice(rowIdx, 0, row);
      self._rows.keys.splice(rowIdx, 0, rowKey);
      self._rows.indexes.splice(rowIdx, 0, rowIdx);
    }
    self._realignRowIndices();
    self._hasMore = true;
    oj.TableDataSource.superclass.handleEvent
      .call(self, oj.TableDataSource.EventType.ADD,
            { data: rowArray, keys: keyArray, indexes: indexArray });
  };
  this._data.removeRows = function (rowKeys) {
    var rowArray = [];
    var keyArray = [];
    var indexArray = [];
    for (var i = rowKeys.length - 1; i >= 0; i--) {
      var rowIdx = rowKeys[i].index;
      // just create a dummy row for deletion
      rowArray.push('');
      keyArray.push(rowKeys[i].key);
      indexArray.push(rowIdx);
      self._nodeSetList.splice(rowIdx, 1);
      // update the startIndex of the shifted rows
      for (var j = rowIdx; j < self._nodeSetList.length; j++) {
        self._nodeSetList[j].startIndex -= 1;
      }
      self._rows.data.splice(rowIdx, 1);
      self._rows.keys.splice(rowIdx, 1);
      self._rows.indexes.splice(rowIdx, 1);
    }
    // The index array must be sorted ascending
    function sortNumber(a, b) {
      return a - b;
    }
    indexArray = indexArray.sort(sortNumber);
    self._realignRowIndices();
    self._hasMore = true;
    oj.TableDataSource.superclass.handleEvent
      .call(self, oj.TableDataSource.EventType.REMOVE,
            { data: rowArray, keys: keyArray, indexes: indexArray });
  };

  this.Init();

  if ((_options != null && (_options.startFetch === 'enabled' || _options.startFetch == null))
    || _options == null) {
    this._startFetchEnabled = true;
  }
};

// Subclass from oj.DataSource
oj.Object.createSubclass(oj.FlattenedTreeTableDataSource,
                         oj.TableDataSource,
                         'oj.FlattenedTreeTableDataSource');

/**
 * Initializes the instance.
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 * @override
 * @protected
 */
oj.FlattenedTreeTableDataSource.prototype.Init = function () {
  oj.FlattenedTreeTableDataSource.superclass.Init.call(this);
};

/**
 * Determines whether this FlattenedTreeTableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
// eslint-disable-next-line no-unused-vars
oj.FlattenedTreeTableDataSource.prototype.getCapability = function (feature) {
  return 'full';
};

/**
 * Retrieves the underlying DataSource.
 * @return {Object} the underlying oj.DataSource.
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.getWrappedDataSource = function () {
  return this._data;
};

/**
 * Fetch the row data.
 * @param {Object=} options Options to control fetch
 * @param {number} options.startIndex The index at which to start fetching records.
 * @param {boolean} options.silent If set, do not fire a sync event.
 * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of ids, and the startIndex triggering done when complete.<p>
 *         The structure of the resolved compound object is:<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
 * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
 * <tr><td><b>startIndex</b></td><td>The startIndex for the returned set of rows</td></tr>
 * </tbody>
 * </table>
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.fetch = function (options) {
  var _options = options || {};
  var self = this;
  var fetchType = _options.fetchType;

  if (fetchType === 'init' && !this._startFetchEnabled) {
    return Promise.resolve();
  }

  return self._fetchInternal(_options);
};


/** ** start delegated functions ****/

/**
 * Return the row data found at the given index.
 *
 * @param {number} index Index for which to return the row data.
 * @param {Object=} options Options to control the at.
 * @return {Promise} Promise resolves to a compound object which has the structure below. If the index is out of range, Promise resolves to null.<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>The raw row data</td></tr>
 * <tr><td><b>index</b></td><td>The index for the row</td></tr>
 * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
 * </tbody>
 * </table>
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
// eslint-disable-next-line no-unused-vars
oj.FlattenedTreeTableDataSource.prototype.at = function (index, options) {
  var row;

  if (index < 0 || index >= this._rows.data.length) {
    row = null;
  } else {
    row = { data: this._rows.data[index], index: index, key: this._rows.keys[index] };
  }

  return new Promise(function (resolve) {
    resolve(row);
  });
};

/**
 * Collapse the specified row.
 * @param {Object} rowKey the key of the row to collapse
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.collapse = function (rowKey) {
  this._data.collapse(rowKey);
};


/**
 * Expand the specified row.
 * @param {Object} rowKey the key of the row to expand
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.expand = function (rowKey) {
  this._data.expand(rowKey);
};

/**
 * Return the first row data whose id value is the given id
 * @param {string} id ID for which to return the row data, if found.
 * @param {Object=} options Options to control the get.
 * @return {Promise} Promise which resolves to a compound object which has the structure below where the id matches the given id. If none are found, resolves to null.<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>The raw row data</td></tr>
 * <tr><td><b>index</b></td><td>The index for the row</td></tr>
 * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
 * </tbody>
 * </table>
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
// eslint-disable-next-line no-unused-vars
oj.FlattenedTreeTableDataSource.prototype.get = function (id, options) {
  // only works for expanded keys
  var result = null;
  var rowIdx = this._data.getIndex(id);
  var row = this._rows.data[rowIdx];
  if (row != null) {
    result = { data: this._wrapWritableValue(row), key: id, index: rowIdx };
  }

  return Promise.resolve(result);
};

/**
 * Attach an event handler to the datasource
 *
 * @param {string} eventType eventType supported by the datasource
 * @param {function(Object)} eventHandler event handler function
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.on = function (eventType, eventHandler) {
  if (eventType === 'expand' ||
      eventType === 'collapse') {
    // expand/collapse listeners should be passed through to the FlattenedTreeDatasource
    this._data.on(eventType, eventHandler);
  } else {
    oj.FlattenedTreeTableDataSource.superclass.on.call(this, eventType, eventHandler);
  }
};

/**
 * Detach an event handler from the datasource
 *
 * @param {string} eventType eventType supported by the datasource
 * @param {function(Object)} eventHandler event handler function
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.off = function (eventType, eventHandler) {
  if (eventType === 'expand' ||
      eventType === 'collapse') {
    // expand/collapse listeners should be passed through to the FlattenedTreeDatasource
    this._data.off(eventType, eventHandler);
  } else {
    oj.FlattenedTreeTableDataSource.superclass.off.call(this, eventType, eventHandler);
  }
};

/**
 * Performs a sort on the data source.
 * @param {Object} criteria the sort criteria.
 * @param {Object} criteria.key The key that identifies which field to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @return {Promise} promise object triggering done when complete.
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.sort = function (criteria) {
  if (criteria == null) {
    // eslint-disable-next-line no-param-reassign
    criteria = this.sortCriteria;
  } else {
    this.sortCriteria = criteria;
  }

  var self = this;
  // eslint-disable-next-line no-param-reassign
  criteria.axis = 'column';
  return new Promise(function (resolve, reject) {
    self._data.getWrappedDataSource().sort(criteria,
      { success: function () {
        setTimeout(function () {
          self._data.refresh();
          self._rows = null;
          var result = { header: criteria.key, direction: criteria.direction };
          // We need to dispatch a RESET event because after a sort the data needs to be completely
          // refetched and we need to start from page 1 again if paging.
          oj.TableDataSource.superclass.handleEvent.call(self,
                                                         oj.TableDataSource.EventType.RESET,
                                                         null);
          resolve(result);
        }, 0);
      },
        error: function (status) {
          // this._handleFetchRowsError(status, {'start': rowStart, 'count': rowCount}, callbacks, callbackObjects);
          reject(status);
        }
      });
  });
};

/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.totalSize = function () {
  if (!this._hasMore) {
    return this._rows.data.length;
  }
  return -1;
};

/**
 * Returns the confidence for the totalSize value.
 * @return {string} "actual" if the totalSize is the time of the fetch is an exact number
 *                  "estimate" if the totalSize is an estimate
 *                  "atLeast" if the totalSize is at least a certain number
 *                  "unknown" if the totalSize is unknown
 * @export
 * @expose
 * @memberof oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.totalSizeConfidence = function () {
  if (!this._hasMore) {
    return 'actual';
  }
  return 'unknown';
};

/** ** end delegated functions ****/

oj.FlattenedTreeTableDataSource.prototype._getMetadata = function (index) {
  var nodeSetStart = this._nodeSetList[index].nodeSet.getStart();
  return this._nodeSetList[index].nodeSet.getMetadata((nodeSetStart + index) -
                                                      this._nodeSetList[index].startIndex);
};

oj.FlattenedTreeTableDataSource.prototype._fetchInternal = function (_options) {
  var options = _options || {};
  this._startFetch(options);
  this._startIndex = options.startIndex == null ? this._startIndex : options.startIndex;

  // if pageSize is not specified then fetch everything
  var rangeCount = Number.MAX_VALUE;

  this._pageSize = options.pageSize == null ? this._pageSize : options.pageSize;
  if (this._pageSize != null) {
    rangeCount = this._pageSize;
  }

  var startIndex = this._startIndex;
  if (this._rows != null) {
    if (this._pageSize != null) {
      var endIndex = this._rows.data.length - 1;

      if (this._startIndex + (this._pageSize - 1) <= endIndex) {
        endIndex = oj.FlattenedTreeTableDataSource._getEndIndex(this._rows,
                                                                this._startIndex,
                                                                this._pageSize);
        var rowArray = [];
        var keyArray = [];

        for (var i = this._startIndex; i <= endIndex; i++) {
          var key = this._rows.keys[i];
          rowArray[i - this._startIndex] = this._wrapWritableValue(this._rows.data[i]);
          keyArray[i - this._startIndex] = key;
        }
        var result = { data: rowArray, keys: keyArray, startIndex: this._startIndex };
        this._endFetch(options, result, null);
        return Promise.resolve(result);
      } else if (this._startIndex <= endIndex) {
        startIndex = endIndex + 1;
      }
    } else {
      // we are fetching everything again so clear out the existing cached rows
      this._data.refresh();
      this._rows = null;
    }
  } else {
    // if we don't have any cached rows then we always need to fetch from the start
    startIndex = 0;
  }

  var rangeOption = { start: startIndex, count: rangeCount };
  var self = this;
  return new Promise(function (resolve, reject) {
    self._data.fetchRows(rangeOption,
      {
        success: function (nodeSet) {
          self._handleFetchRowsSuccess(nodeSet);
          // eslint-disable-next-line no-param-reassign
          options.refresh = true;
          var _endIndex = oj.FlattenedTreeTableDataSource._getEndIndex(self._rows,
                                                                       self._startIndex,
                                                                       self._pageSize);
          var _rowArray = [];
          var _keyArray = [];

          for (var j = self._startIndex; j <= _endIndex; j++) {
            var _key = self._rows.keys[j];
            _rowArray[j - self._startIndex] = self._wrapWritableValue(self._rows.data[j]);
            _keyArray[j - self._startIndex] = _key;
          }
          // if there are results then we potentially have more
          if (_rowArray.length > 0) {
            if (self._pageSize != null &&
                _rowArray.length < self._pageSize) {
              // if we are paged and we return less than the page size
              // then we don't have any more rows
              self._hasMore = false;
            } else {
              self._hasMore = true;
            }
          } else {
            self._hasMore = false;
          }
          var _result = { data: _rowArray, keys: _keyArray, startIndex: self._startIndex };
          self._endFetch(options, _result, null);
          resolve(_result);
        },
        error: function (error) {
          self._endFetch(options, null, error);
          reject(error);
        }
      });
  });
};

oj.FlattenedTreeTableDataSource.prototype._handleFetchRowsSuccess = function (nodeSet) {
  var startIndex = nodeSet.getStart();

  for (var i = 0; i < nodeSet.getCount(); i++) {
    var rowIdx = startIndex + i;
    this._nodeSetList[rowIdx] = {};
    this._nodeSetList[rowIdx].nodeSet = nodeSet;
    this._nodeSetList[rowIdx].startIndex = startIndex;
  }

  if (!this._rows) {
    this._rows = {};
    this._rows.data = [];
    this._rows.keys = [];
    this._rows.indexes = [];
  }
  oj.FlattenedTreeTableDataSource._getRowArray(nodeSet, this, this._rows, startIndex);
};

/**
 * Indicate starting fetch
 * @param {Object} options
 * @private
 */
oj.FlattenedTreeTableDataSource.prototype._startFetch = function (options) {
  if (!options.silent) {
    oj.TableDataSource.superclass.handleEvent.call(this,
                                                   oj.TableDataSource.EventType.REQUEST,
                                                   { startIndex: options.startIndex });
  }
};

/**
 * Indicate ending fetch
 * @param {Object} options
 * @param {Object} result Result object
 * @param {Object} error Error
 * @private
 */
oj.FlattenedTreeTableDataSource.prototype._endFetch = function (options, result, error) {
  if (error != null) {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType.ERROR, error);
  } else if (!options.silent) {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType.SYNC, result);
  }
};

oj.FlattenedTreeTableDataSource._getEndIndex = function (rows, startIndex, pageSize) {
  var endIndex = rows.data.length - 1;

  if (pageSize > 0) {
    endIndex = startIndex + (pageSize - 1);
    endIndex = endIndex > rows.data.length - 1 ? rows.data.length - 1 : endIndex;
  }

  return endIndex;
};

oj.FlattenedTreeTableDataSource._getRowArray = function (nodeSet, rowSet, rows, startIndex) {
  for (var i = 0; i < nodeSet.getCount(); i++) {
    var row = nodeSet.getData(nodeSet.getStart() + i);
    // eslint-disable-next-line no-param-reassign
    rows.data[startIndex + i] = row;
    // eslint-disable-next-line no-param-reassign
    rows.keys[startIndex + i] = nodeSet.getMetadata(nodeSet.getStart() + i).key;
    // eslint-disable-next-line no-param-reassign
    rows.indexes[startIndex + i] = startIndex + i;
  }
};

// Realign all the indices of the rows (after sort for example)
oj.FlattenedTreeTableDataSource.prototype._realignRowIndices = function () {
  for (var i = 0; i < this._rows.data.length; i++) {
    this._rows.indexes[i] = i;
  }
};

oj.FlattenedTreeTableDataSource.prototype._wrapWritableValue = function (m) {
  var clonedRow = $.extend(true, {}, m);
  var props = Object.keys(m);

  for (var i = 0; i < props.length; i++) {
    oj.FlattenedTreeTableDataSource._defineProperty(clonedRow, m, props[i]);
  }

  return clonedRow;
};

oj.FlattenedTreeTableDataSource._defineProperty = function (row, m, prop) {
  Object.defineProperty(row, prop,
    {
      get: function () {
        return m[prop];
      },
      set: function (newValue) {
        // eslint-disable-next-line no-param-reassign
        m[prop] = newValue;
      },
      enumerable: true
    });
};

});