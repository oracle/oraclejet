/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojmessaging', 'ojs/ojpagingtabledatasource'], function(oj, $, Message)
{
  "use strict";


/**
 * @class oj.PagingCellSet
 * @classdesc A CellSet represents a collection of cells.  The CellSet is an object returned by the success callback
 * of the fetchCells method on DataGridDataSource.  The PagingCellSet is a paging specific
 * implementation of methods on CellSet.
 * @param {Object} cellSet an cellSet object
 * @param {number} startIndex the true start row index of the cellSet
 * @constructor
 * @since 1.1
 * @export
 * @hideconstructor
 * @ojtsignore
 * @see oj.PagingDataGridDataSource
 */
oj.PagingCellSet = function (cellSet, startIndex) {
  this.m_cellSet = cellSet;
  this.m_startIndex = startIndex;
};
/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available
 * 2) the index specified is out of bounds.
 * @param {Object} indexes the index of each axis in which we want to retrieve the data from.
 * @property {number} indexes.row the index of the row axis.
 * @property {number} indexes.column the index of the column axis.
 * @return {Object} the data object for the specified index.
 * @export
 * @expose
 * @method
 * @instance
 * @memberof! oj.PagingCellSet
 */


oj.PagingCellSet.prototype.getData = function (indexes) {
  var pagedIndexes = {
    column: indexes.column,
    row: indexes.row + this.m_startIndex
  };
  return this.m_cellSet.getData(pagedIndexes);
};
/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available
 * 2) the index specified is out of bounds.
 * @param {Object} indexes the index of each axis in which we want to retrieve the metadata from.
 * @property {number} indexes.row the index of the row axis.
 * @property {number} indexes.column the index of the column axis.
 * @return the metadata object for the specific index.  The metadata that the DataGrid supports are:
 *         1) keys - the key (of each axis) of the cell.
 * @export
 * @expose
 * @memberof oj.PagingCellSet
 * @method
 * @instance
 */


oj.PagingCellSet.prototype.getMetadata = function (indexes) {
  var pagedIndexes = {
    column: indexes.column,
    row: indexes.row + this.m_startIndex
  };
  return this.m_cellSet.getMetadata(pagedIndexes);
};
/**
 * Gets the actual count of the result set for the specified axis.  Valid values are "row" and "column".
 * @param {string} axis the axis in which to inquire the actual count of the result set.
 * @return {number} the actual count of the result set for the specified axis.
 * @export
 * @expose
 * @method
 * @instance
 * @memberof! oj.PagingCellSet
 */


oj.PagingCellSet.prototype.getCount = function (axis) {
  return this.m_cellSet.getCount(axis);
};
/**
 * For internal testing purposes. Gets the underlying cellSet.
 * @return {Object} the underlying cellSet
 * @export
 * @ignore
 */


oj.PagingCellSet.prototype.getCellSet = function () {
  return this.m_cellSet;
};
/**
 * For internal testing purposes. Gets the start index.
 * @return {number} the start index
 * @export
 * @ignore
 */


oj.PagingCellSet.prototype.getStartIndex = function () {
  return this.m_startIndex;
};
/**
 * Gets the extent of a particular row/column index within the context of the cellSet.
 * Extent is defined as the number of indexes along the appropriate axis spanned by the cell.
 * If the extent extends beyond the start and end of the requested cell range the extent should be trimmed to the edge of the requested cell range and the object for {'more': {'before', 'after'}} should have the value appropriate boolean set.
 * @param {Object} indexes the index of each axis in which we want to retrieve the data from.
 * @property {number} indexes.row the index of the row axis.
 * @property {number} indexes.column the index of the column axis.
 * @return {Object} an object containing two properties row and column. Each of those properties has two sub properties:
 *              extent: the number of absolute indexes spanned by the cell at this index
 *                      bounded by the edges of the result set for the specified axis.
 *              more: object with keys 'before'/'after' and boolean values true/false representing whether
 *                       there are more indexes before/after what is available in the cellSet
 * @example <caption>In this example the cell spans 5 row indexes and 2 column indexes and there are more column indexes spanned by the cell that
 *              aren't included in this cellSet:</caption>
 * {
 *  'row': {'extent':5, 'more': {'before':false, 'after':false}},
 *  'column': {'extent':2, 'more': {'before':false, 'after':true}}
 * }
 * @export
 * @expose
 * @method
 * @instance
 * @memberof! oj.PagingCellSet
 * @since 4.0.0
 */


oj.PagingCellSet.prototype.getExtent = function (indexes) {
  var pagedIndexes = {
    column: indexes.column,
    row: indexes.row + this.m_startIndex
  };
  return this.m_cellSet.getExtent(pagedIndexes);
};



/* global Promise:false, Message:false */

/**
 * @export
 * @class oj.PagingDataGridDataSource
 * @classdesc A paging based implementation of the DataGridDataSource.
 * @param {oj.DataGridDataSource|null} dataSource
 * @param {Object|null} options Options for the PagingControlDataSource
 * @extends oj.DataGridDataSource
 * @implements oj.PagingModel
 * @constructor
 * @final
 * @since 1.0
 * @ojtsignore
 */
// eslint-disable-next-line no-unused-vars
oj.PagingDataGridDataSource = function (dataSource, options) {
  // Initialize
  if (!(dataSource instanceof oj.DataGridDataSource)) {
    // we only support Array, oj.Collection, or ko.observableArray. To
    // check for observableArray, we can't do instanceof check because it's
    // a function. So we just check if it contains a subscribe function.
    throw new Message('Not a datagridatasource', 'Not a datagridatasource', Message.SEVERITY_LEVEL.ERROR);
  }

  this.dataSource = dataSource;
  this._startIndex = 0;
  this.Init();
}; // Subclass from oj.DataSource


oj.Object.createSubclass(oj.PagingDataGridDataSource, oj.DataGridDataSource, 'oj.PagingDataGridDataSource');
/**
 * Initializes the instance.
 * @instance
 * @override
 * @protected
 * @memberof oj.PagingDataGridDataSource
 */

oj.PagingDataGridDataSource.prototype.Init = function () {
  oj.PagingDataGridDataSource.superclass.Init.call(this);

  this._registerEventListeners();
};
/**
 * Register event handlers on the underlying datasource.
 * @private
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype._registerEventListeners = function () {
  this.dataSource.on('change', this._handleChange.bind(this));
};
/**
 * Get the current page
 * @return {number} The current page
 * @export
 * @expose
 * @instance
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype.getPage = function () {
  return this._page;
};
/**
 * Set the current page
 * @param {number} value The current page
 * @param {Object=} options Options<p>
 *                  pageSize: The page size.<p>
 * @returns {Promise} resolves if page is set
 * @export
 * @expose
 * @instance
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype.setPage = function (value, options) {
  // eslint-disable-next-line no-param-reassign
  options = options || {}; // eslint-disable-next-line no-param-reassign

  value = parseInt(value, 10);

  try {
    oj.PagingDataGridDataSource.superclass.handleEvent.call(this, oj.PagingModel.EventType.BEFOREPAGE, {
      page: value,
      previousPage: this._page
    });
  } catch (err) {
    return Promise.reject(err);
  }

  this._pageSize = options.pageSize != null ? options.pageSize : this._pageSize; // eslint-disable-next-line no-param-reassign

  options.startIndex = value * this._pageSize;
  var previousPage = this._page;
  this._page = value;
  this._startIndex = options.startIndex;
  var self = this;
  return new Promise(function (resolve, reject) {
    self._fetchInternal(options).then(function () {
      resolve(null);
    }, function (err) {
      // restore old page
      self._page = previousPage;
      self._startIndex = self._page * self._pageSize;
      reject(err);
    });
  });
};
/**
 * Calls fetch on the datasource with paging options.
 * @private
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype._fetchInternal = function (options) {
  this._initialized = true;
  this._startIndex = options.startIndex;
  var self = this;
  return new Promise(function (resolve) {
    self.handleEvent('change', {
      operation: 'sync',
      pageSize: self._pageSize
    });
    resolve(undefined);
  });
};
/**
 * Calls fetch on the datasource with paging options.
 * @param {Object=} options Options to control fetch
 * @property {number} options.startIndex The index at which to start fetching records.
 * @property {boolean} options.silent If set, do not fire a sync event.
 * @return {Promise} Promise object resolves when done
 * @export
 * @expose
 * @memberof oj.PagingDataGridDataSource
 * @instance
 */


oj.PagingDataGridDataSource.prototype.fetch = function (options) {
  this._pageSize = options.pageSize + options.startIndex; // eslint-disable-next-line no-param-reassign

  options.startIndex = 0;
  return this._fetchInternal(options);
};
/**
 * Get the current page start index
 * @return {number} The current page start index
 * @export
 * @expose
 * @instance
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype.getStartItemIndex = function () {
  return this._startIndex;
};
/**
 * Get the current page end index
 * @return {number} The current page end index
 * @export
 * @expose
 * @instance
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype.getEndItemIndex = function () {
  return this._endIndex;
};
/**
 * Get the page count
 * @return {number} The total number of pages
 * @export
 * @expose
 * @instance
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype.getPageCount = function () {
  var totalSize = this.totalSize();
  return totalSize === -1 ? -1 : Math.ceil(totalSize / this._pageSize);
};
/**
 * Handle data grid change events
 * @param {Object} options the options associated with the oj.DataGridDataSource event.
 * @private
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype._handleChange = function (options) {
  var operation;
  operation = options.operation;

  switch (operation) {
    case 'refresh':
      this._startIndex = 0;
      this._page = 0; // pass the refresh event through to the data grid and the paging control

      this.handleEvent('change', {
        operation: 'sync',
        pageSize: this._pageSize
      });
      this.handleEvent(oj.PagingTableDataSource.EventType.REFRESH, null);
      break;

    case 'reset':
      // the paging control will set a new startIndex and kick off a fetch here
      this.handleEvent(oj.PagingTableDataSource.EventType.RESET, null);
      break;

    case 'insert':
      this.handleEvent(oj.PagingTableDataSource.EventType.ADD, {
        index: options.indexes.row
      });
      break;

    case 'delete':
      this.handleEvent(oj.PagingTableDataSource.EventType.REMOVE, null);
      break;

    case 'update':
      // eslint-disable-next-line no-param-reassign
      options.indexes.row = options.indexes.row - this._startIndex >= 0 ? options.indexes.row - this._startIndex : -1;
      this.handleEvent('change', options);
      break;

    default:
      this.handleEvent('change', options);
      this.handleEvent(oj.PagingTableDataSource.EventType.SYNC, null);
  }
};
/** ** start delegated functions ****/

/**
 * Returns the total number of rows or columns.  If the value return is not >= 0 then it is automatically assumed
 * that the total count is unknown. In the case of paging returns the total number of rows/columns on the page.
 * @param {string} axis the axis in which we inquire for the total count.
 * @return {number} the total number of rows/columns.
 * @export
 * @method
 * @instance
 * @memberof oj.PagingDataGridDataSource */


oj.PagingDataGridDataSource.prototype.getCount = function (axis) {
  var count = this.dataSource.getCount(axis);

  if (axis === 'row' && count >= 0) {
    if (this._startIndex + this._pageSize < count) {
      return this._pageSize;
    }

    return count - this._startIndex;
  }

  return count;
};
/**
 * Returns whether the total count returned in getCount function is an actual or an estimate.
 * @param {string} axis the axis in which we inquire whether the total count is an estimate.  Valid values are
 *        "row" and "column".
 * @return {string} "actual" if the count returned in getCount function is the actual count, "estimate" if the
 *         count returned in getCount function is an estimate.
 * @export
 * @method
 * @instance
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype.getCountPrecision = function (axis) {
  return this.dataSource.getCountPrecision(axis);
};
/**
 * Fetch a range of headers from the data source.
 * @param {Object} headerRange information about the header range, it must contain the following properties:
 *        axis, start, count.
 * @property {string} headerRange.axis the axis of the header that are fetched.  Valid values are "row" and "column".
 * @property {number} headerRange.start the start index of the range in which the header data are fetched.
 * @property {number} headerRange.count the size of the range in which the header data are fetched.
 * @param {Object} callbacks the callbacks to be invoke when fetch headers operation is completed.
 * @property {function({startHeaderSet: Object}, {headerRange: Object}, {endHeaderSet: Object}):undefined} callbacks.success the callback to invoke when fetch headers completed successfully.
 *        The function takes three parameters: HeaderSet object representing start headers, headerRange object passed into the original fetchHeaders call,
 *        and a HeaderSet object representing the end headers along the axis.
 * @property {function({status: Object}):undefined} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.
 * @property {Object=} callbackObjects.success
 * @property {Object=} callbackObjects.error
 * @export
 * @method
 * @instance
 * @memberof oj.PagingDataGridDataSource
 * @return {undefined}
 */


oj.PagingDataGridDataSource.prototype.fetchHeaders = function (headerRange, callbacks, callbackObjects) {
  if (this._initialized == null) {
    if (callbacks != null && callbacks.success) {
      callbacks.success.call(callbackObjects.success, null, headerRange, null);
    }
  } else if (headerRange.axis === 'row') {
    // eslint-disable-next-line no-param-reassign
    headerRange.start += this._startIndex;

    if (headerRange.start + headerRange.count > this._startIndex + this._pageSize) {
      // eslint-disable-next-line no-param-reassign
      headerRange.count = this._pageSize - headerRange.start;
    }

    this._pendingRowHeaderCallback = {
      headerRange: headerRange,
      callbacks: callbacks,
      callbackObjects: callbackObjects
    };
    this.dataSource.fetchHeaders(headerRange, {
      success: this._handleRowHeaderFetchSuccess.bind(this),
      error: this._handleRowHeaderFetchError.bind(this)
    }, callbackObjects);
  } else {
    this.dataSource.fetchHeaders(headerRange, callbacks, callbackObjects);
  }
};
/**
 * Handle row headers fetch success by adjusting startIndex back to 0 and passing a PagingHeaderSet
 * @param {Object} headerSet a cellSet object
 * @param {Object} headerRange
 * @param {Object} endHeaderSet a headerSet object
 * @private
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype._handleRowHeaderFetchSuccess = function (headerSet, headerRange, endHeaderSet) {
  var pagingHeaderSet;
  var pagingEndHeaderSet; // make sure we only callback when we have the most recent request

  if (this._pendingRowHeaderCallback.headerRange !== headerRange) {
    return;
  } // eslint-disable-next-line no-param-reassign


  headerRange.start -= this._startIndex; // make the datagrid not issue any extra fetches
  // eslint-disable-next-line no-param-reassign

  headerRange.count += 1;

  if (headerSet != null) {
    pagingHeaderSet = new oj.PagingHeaderSet(headerSet, this._startIndex);
  }

  if (endHeaderSet != null) {
    pagingEndHeaderSet = new oj.PagingHeaderSet(endHeaderSet, this._startIndex);
  } // clear callback before calling it because it may issue a refetch


  var callback = this._pendingRowHeaderCallback.callbacks.success;
  var callbackObject = this._pendingRowHeaderCallback.callbackObjects.success;
  this._pendingRowHeaderCallback = null;
  callback.call(callbackObject, pagingHeaderSet, headerRange, pagingEndHeaderSet);
};
/**
 * Handle row header fetch error
 * @param {Object} error error
 * @private
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype._handleRowHeaderFetchError = function (error) {
  // clear callback before calling it because it may issue a refetch
  var callback = this._pendingRowHeaderCallback.callbacks.error;
  var callbackObject = this._pendingRowHeaderCallback.callbackObjects.error;
  this._pendingRowHeaderCallback = null;
  callback.call(callbackObject, error);
};
/**
 * Fetch a range of cells from the data source.
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @property {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid
 *        values are "row" and "column".
 * @property {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @property {number} cellRanges.count the size of the range for this axis in which the cells are fetched.
 * @param {Object} callbacks the callbacks to be invoke when fetch cells operation is completed.
 * @property {function({cellSet: Object}, {cellRanges: Array.<Object>}):undefined} callbacks.success the callback to invoke when fetch cells completed successfully.
 * @property {function({status: Object}):undefined} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.
 * @property {Object=} callbackObjects.success
 * @property {Object=} callbackObjects.error
 * @export
 * @method
 * @instance
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype.fetchCells = function (cellRanges, callbacks, callbackObjects) {
  if (this._initialized == null) {
    var emptyCellSet = {};

    emptyCellSet.getData = function () {
      return null;
    };

    emptyCellSet.getMetaData = function () {
      return null;
    };

    emptyCellSet.getStart = function () {
      return 0;
    };

    emptyCellSet.getCount = function () {
      return 0;
    };

    emptyCellSet.getLevelCount = function () {
      return 0;
    };

    emptyCellSet.getExtent = function () {
      return 0;
    };

    emptyCellSet.getDepth = function () {
      return 1;
    };

    if (callbacks != null && callbacks.success) {
      callbacks.success.call(callbackObjects.success, emptyCellSet, cellRanges);
    }
  } else {
    for (var i = 0; i < cellRanges.length; i += 1) {
      if (cellRanges[i].axis === 'row') {
        // eslint-disable-next-line no-param-reassign
        cellRanges[i].start += this._startIndex;

        if (cellRanges[i].start + cellRanges[i].count > this._startIndex + this._pageSize) {
          // eslint-disable-next-line no-param-reassign
          cellRanges[i].count = this._pageSize - cellRanges[i].start;
        }
      }
    }

    this._pendingCellCallback = {
      cellRanges: cellRanges,
      callbacks: callbacks,
      callbackObjects: callbackObjects
    };
    this.dataSource.fetchCells(cellRanges, {
      success: this._handleCellsFetchSuccess.bind(this),
      error: this._handleCellsFetchError.bind(this)
    }, callbackObjects);
  }
};
/**
 * Handle cell fetch success by adjusting the row startIndex and passing the PagingCellSet
 * @param {Object} cellSet a cellSet object
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @property {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid
 *        values are "row" and "column".
 * @property {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @private
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype._handleCellsFetchSuccess = function (cellSet, cellRanges) {
  // make sure we only callback when we have the most recent request
  if (!this._pendingCellCallback.cellRanges === cellRanges) {
    return;
  }

  for (var i = 0; i < cellRanges.length; i += 1) {
    if (cellRanges[i].axis === 'row') {
      // eslint-disable-next-line no-param-reassign
      cellRanges[i].start -= this._startIndex; // make the datagrid not issue any extra fetches
      // eslint-disable-next-line no-param-reassign

      cellRanges[i].count += 1;
    }
  }

  var pagedCellSet = new oj.PagingCellSet(cellSet, this._startIndex); // clear callback before calling it because it may issue a refetch

  var callback = this._pendingCellCallback.callbacks.success;
  var callbackObject = this._pendingCellCallback.callbackObjects.success;
  this._pendingCellCallback = null;
  this._endIndex = this._startIndex + cellSet.getCount('row') - 1; // tell PC fetchEnd

  this.handleEvent('sync', {
    data: new Array(cellSet.getCount('row')),
    startIndex: this._startIndex
  });
  callback.call(callbackObject, pagedCellSet, cellRanges);
};
/**
 * Handle a cell fetch error
 * @param {Object} error error
 * @private
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype._handleCellsFetchError = function (error) {
  // clear callback before calling it because it may issue a refetch
  var callback = this._pendingCellCallback.callbacks.error;
  var callbackObject = this._pendingCellCallback.callbackObjects.error;
  this._pendingCellCallback = null;
  callback.call(callbackObject, error);
};
/**
 * Returns the keys based on the indexes.
 * @param {Object} indexes the index for each axis
 * @property {number|null} indexes.row the index for the row axis
 * @property {number|null} indexes.column the index for the column axis
 * @return {Promise.<Object>} a Promise object which upon resolution will pass in an object containing the keys for each axis
 * @export
 * @method
 * @instance
 * @memberof oj.ArrayDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype.keys = function (indexes) {
  var pagedIndexes = {
    column: indexes.column,
    row: indexes.row + this._startIndex
  };
  return this.dataSource.keys(pagedIndexes);
};
/**
 * Returns the row and column index based on the keys. In a paging case returns the
 * index on the page, not the absolute index in the array.
 * @param {Object} keys the key for each axis
 * @property {any} keys.row the key for the row axis
 * @property {any} keys.column the key for the column axis
 * @return {Promise.<Object>} a promise object containing the index for each axis
 * @export
 * @method
 * @instance
 * @memberof oj.PagingDataGridDataSource
 */


oj.PagingDataGridDataSource.prototype.indexes = function (keys) {
  var indexes = this.dataSource.indexes(keys);

  if (indexes.row !== -1) {
    indexes.row -= this._startIndex;
  }

  return indexes;
};
/**
 * Determines whether this PagingDataGridDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort" and "move"
 * @return {string|null} the name of the feature.  For sort, the valid return values are: "full", "none".  Returns null if the
 *         feature is not recognized.
 * @export
 * @method
 * @instance
 * @memberof oj.PagingDataGridDataSource
*/


oj.PagingDataGridDataSource.prototype.getCapability = function (feature) {
  return this.dataSource.getCapability(feature);
};
/**
 * @export
 * Return the size of the data locally in the dataSource. -1 if an initial fetch has not been
 * done yet.
 * @returns {number} size of data
 * @method
 * @memberof oj.PagingDataGridDataSource
 * @instance
 */


oj.PagingDataGridDataSource.prototype.size = function () {
  var count;

  if (this._initialized == null) {
    return -1;
  }

  count = this.dataSource.getCount('row');

  if (this.dataSource.getCount('row') > this._pageSize) {
    return this._pageSize;
  }

  return count;
};
/**
 * Performs a sort on the data source.
 * @param {Object|null} criteria the sort criteria.
 * @property {string} criteria.axis The axis in which the sort is performed, valid values are "row", "column"
 * @property {any} criteria.key The key that identifies which header to sort
 * @property {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @param {Object=} callbacks the callbacks to be invoke upon completion of the sort operation.
 * @property {function():undefined=} callbacks.success the callback to invoke when the sort completed successfully.
 * @property {function({status: Object}):undefined=} callbacks.error the callback to invoke when sort failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.
 * @property {Object=} callbackObjects.success
 * @property {Object=} callbackObjects.error
 * @export
 * @method
 * @instance
 * @memberof oj.PagingDataGridDataSource
 * @return {undefined}
 */


oj.PagingDataGridDataSource.prototype.sort = function (criteria, callbacks, callbackObjects) {
  this.dataSource.sort(criteria, callbacks, callbackObjects);
};
/**
 * @export
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @method
 * @memberof oj.PagingDataGridDataSource
 * @instance
 */


oj.PagingDataGridDataSource.prototype.totalSize = function () {
  if (this._initialized == null) {
    return -1;
  }

  return this.dataSource.getCount('row');
};
/**
 * Returns the confidence for the totalSize value.
 * @return {string} "actual" if the totalSize is the time of the fetch is an exact number
 *                  "estimate" if the totalSize is an estimate
 *                  "atLeast" if the totalSize is at least a certain number
 *                  "unknown" if the totalSize is unknown
 * @export
 * @method
 * @memberof oj.PagingDataGridDataSource
 * @instance
 */


oj.PagingDataGridDataSource.prototype.totalSizeConfidence = function () {
  return 'actual';
};
/**
 * Checks whether a move operation is valid.
 * @param {any} rowToMove the key of the row to move
 * @param {any} referenceRow the key of the reference row which combined with position are used to determine
 *        the destination of where the row should moved to.
 * @param {string} position The position of the moved row relative to the reference row.
 *        Valid values are: "before", "after".
 * @return {string} returns "valid" if the move is valid, "invalid" otherwise.
 * @export
 * @method
 * @instance
 * @memberof oj.PagingDataGridDataSource
*/


oj.PagingDataGridDataSource.prototype.moveOK = function (rowToMove, referenceRow, position) {
  return this.dataSource.moveOK(rowToMove, referenceRow, position);
};
/**
 * Moves a row from one location to another.
 * @param {any} rowToMove the key of the row to move
 * @param {any} referenceRow the key of the reference row which combined with position are used to determine
 *        the destination of where the row should moved to.
 * @param {string} position The position of the moved row relative to the reference row.
 *        Valid values are: "before", "after"
 * @param {Object=} callbacks the callbacks to be invoke upon completion of the move operation.
 * @property {function():undefined=} callbacks.success the callback to invoke when the sort completed successfully.
 * @property {function({status: Object}):undefined=} callbacks.error the callback to invoke when sort failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.
 * @property {Object=} callbackObjects.success
 * @property {Object=} callbackObjects.error
 * @export
 * @method
 * @instance
 * @memberof oj.PagingDataGridDataSource
 * @return {undefined}
 */


oj.PagingDataGridDataSource.prototype.move = function (rowToMove, referenceRow, position, callbacks, callbackObjects) {
  this.dataSource.move(rowToMove, referenceRow, position, callbacks, callbackObjects);
};
/** ** end delegated functions ****/



/**
 * @class oj.PagingHeaderSet
 * @classdesc A HeaderSet represents a collection of headers. The HeaderSet is an object returned by the success callback
 * of the fetchHeaders method on DataGridDataSource. This is a paging specific implementation of the HeaderSet.
 * @param {Object} headerSet an headerSet object
 * @param {number} startIndex the true startIndex of the headerSet
 * @constructor
 * @since 1.1
 * @hideconstructor
 * @export
 * @ojtsignore
 * @see oj.PagingDataGridDataSource
 */
oj.PagingHeaderSet = function (headerSet, startIndex) {
  this.m_headerSet = headerSet;
  this.m_startIndex = startIndex;
};
/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * @param {number} index the absolute index of the header in which we want to retrieve the header from.
 * @param {number=} level the level of the header, 0 is the outermost header and increments by 1 moving inward
 * @return {any} the data for the specific index.
 * @export
 * @expose
 * @method
 * @instance
 * @memberof oj.PagingHeaderSet
 */


oj.PagingHeaderSet.prototype.getData = function (index, level) {
  return this.m_headerSet.getData(index + this.m_startIndex, level);
};
/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds.
 * The metadata that the data source can optionally return are:
 *  1) sortDirection - the initial sort direction of the header.  Valid values are "ascending" and "descending".
 *  2) key - the key of the row/column header.
 * @param {number} index the absolute index of the header in which we want to retrieve the metadata from.
 * @param {number=} level the level of the header, 0 is the outermost header and increments by 1 moving inward
 * @return {Object} the metadata object for the specific index.
 * @export
 * @expose
 * @method
 * @instance
 * @memberof! oj.PagingHeaderSet
 */


oj.PagingHeaderSet.prototype.getMetadata = function (index, level) {
  return this.m_headerSet.getMetadata(index + this.m_startIndex, level);
};
/**
 * Gets the actual count of the result set, the total indexes spanned by the headerSet
 * along the innermost header.
 * @return {number} the actual count of the result set.
 * @export
 * @expose
 * @method
 * @instance
 * @memberof! oj.PagingHeaderSet
 */


oj.PagingHeaderSet.prototype.getCount = function () {
  return this.m_headerSet.getCount();
};
/**
 * Gets the actual number of levels of the result set for the specified axis. The levels
 * are the counted from the outermost header indexed at 0, and moving inwards toward the
 * databody would increment the level by 1.
 * @return {number} the number of levels of the result set
 * @export
 * @expose
 * @method
 * @instance
 * @memberof! oj.PagingHeaderSet
 */


oj.PagingHeaderSet.prototype.getLevelCount = function () {
  return this.m_headerSet.getLevelCount();
};
/**
 * Gets the extent of an index on a particular level within the context of the headerSet. Extent is defined as the
 * number of indexes covered by the header. If the extent extends beyond the start and end of the requested
 * range the extent should be trimmed to the edge of the requested range and the object for {'more': {before, after}}
 * should have the value appropriate boolean set. For innermost headers the extent will always be 1.
 * @param {number} index the absolute index along the innermost header of the extent to get, 0 is the first header in the data source
 * @param {number=} level the level of the header, 0 is the outermost header and increments by 1 moving inward
 * @return {Object} an object containing two values
 *              extent: the number of absolute indexes spanned by the header at this index
 *                      bounded by the edges of the result set for the specified axis.
 *              more: object with keys 'before'/'after' and boolean values true/false representing whether
 *                       there are more indexes before/after what is in the headerSet
 * @example <caption>In this example the header spans 5 indexes and there are more indexes to cover after the request that
 *              aren't included in this headerSet:</caption>
 * {'extent':5, 'more': {'before':false, 'after':true}}
 * @export
 * @expose
 * @method
 * @instance
 * @memberof! oj.PagingHeaderSet
 */


oj.PagingHeaderSet.prototype.getExtent = function (index, level) {
  return this.m_headerSet.getExtent(index + this.m_startIndex, level);
};
/**
 * Gets the depth of an index starting at a particular level. The depth is the number
 * of levels spanned by the header.
 * @param {number} index the absolute index of the depth to get
 * @param {number=} level the level of the header, 0 is the outermost header
 * @return {number} the number of levels spanned by the header at the specified position
 * @export
 * @expose
 * @method
 * @instance
 * @memberof! oj.PagingHeaderSet
 */


oj.PagingHeaderSet.prototype.getDepth = function (index, level) {
  return this.m_headerSet.getDepth(index + this.m_startIndex, level);
};
/**
 * For internal testing purposes. Gets the underlying headerSet.
 * @return {Object} the underlying headerSet
 * @export
 * @ignore
 */


oj.PagingHeaderSet.prototype.getHeaderSet = function () {
  return this.m_headerSet;
};
/**
 * For internal testing purposes. Gets the start index.
 * @return {number} the start index
 * @export
 * @ignore
 */


oj.PagingHeaderSet.prototype.getStartIndex = function () {
  return this.m_startIndex;
};
/**
 * Gets the label for the level along the axis of that header. Specify null to have no header labels.
 * @param {number} level the header level to retrieve the label data for
 * @return {*} the data for the header label
 * @export
 * @expose
 * @method
 * @instance
 * @memberof! oj.PagingHeaderSet
 */


oj.PagingHeaderSet.prototype.getLabel = function (level) {
  return this.m_headerSet.getLabel(level);
};


// Define a mapping variable that maps the return value of the module to the name used in the callback function of a require call.
var PagingDataGridDataSource = {};
PagingDataGridDataSource.PagingDataGridDataSource = oj.PagingDataGridDataSource;
PagingDataGridDataSource.PagingHeaderSet = oj.PagingHeaderSet;
PagingDataGridDataSource.PagingCellSet = oj.PagingCellSet;

  return PagingDataGridDataSource;
});