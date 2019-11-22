/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojmodel', 'ojs/ojlogger', 'ojs/ojdatasource-common'], function(oj, $, Model, Logger)
{
  "use strict";


 /**
 * @export
 * @class oj.CollectionCellSet
 * @classdesc A CellSet represents a collection of cells.  The CellSet is an object returned by the success callback
 * of the fetchCells method on DataGridDataSource.  This implementation of CellSet is used by the
 * CollectionDataGridDataSource.
 * @param {number} startRow the start row index of the cell set
 * @param {number} endRow the end row index of the cell set
 * @param {number} startColumn the start column index of the cell set
 * @param {number} endColumn the end column index of the cell set
 * @param {Array|null} columns the set of column keys
 * @constructor
 * @since 1.0
 * @hideconstructor
 * @ojtsignore
 * @see oj.CollectionDataGridDataSource
 */
oj.CollectionCellSet = function (startRow, endRow, startColumn, endColumn, columns) {
  // assert startRow/startColumn are number
  oj.Assert.assertArrayOrNull(columns);

  this.m_startRow = startRow;
  this.m_endRow = endRow;
  this.m_startColumn = startColumn;
  this.m_endColumn = endColumn;
  this.m_columns = columns;
};

/**
 * Sets the models used in this cell set.
 * @param {Array} models an array of oj model for the cell set
 * @memberof oj.CollectionCellSet
 * @private
 */
oj.CollectionCellSet.prototype.setModels = function (models) {
  oj.Assert.assertArray(models);
  // make sure the array size is valid
  if (models != null && models.length === this.getCount('row')) {
    this.m_models = models;
  }
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available
 * 2) the index specified is out of bounds.
 * @param {Object} indexes the index of each axis in which we want to retrieve the data from.
 * @property {number} indexes.row the index of the row axis.
 * @property {number} indexes.column the index of the column axis.
 * @return {Object} an object with property data for the specified index.
 * @export
 * @expose
 * @instance
 * @memberof oj.CollectionCellSet
 */
oj.CollectionCellSet.prototype.getData = function (indexes) {
  // indexes are validated in _getModel
  var model = this._getModel(indexes);
  if (model == null) {
    return null;
  }

  var columnKey = this.m_columns[indexes.column];
  var returnObj = {};
  Object.defineProperty(returnObj, 'data', {
    enumerable: true,
    get: function () {
      return model.get(columnKey);
    },
    set: function (newValue) {
      model.set(columnKey, newValue, { silent: true });
    }
  });
  return returnObj;
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
 * @method
 * @instance
 * @memberof oj.CollectionCellSet
 */
oj.CollectionCellSet.prototype.getMetadata = function (indexes) {
  // indexes are validated in _getModel
  var model = this._getModel(indexes);
  if (model == null) {
    return null;
  }

    // extract column index
  var column = indexes.column;

  var keys = {
    row: oj.CollectionDataGridUtils._getModelKey(model),
    column: this.m_columns[column]
  };
  return { keys: keys };
};

/**
 * Gets the Model based on indexes.
 * @private
 * @memberof oj.CollectionCellSet
 */
oj.CollectionCellSet.prototype._getModel = function (indexes) {
  // make sure models is populated
  if (this.m_models == null) {
    return null;
  }

  oj.Assert.assertObject(indexes);

    // extract row and column index
  var row = indexes.row;
  var column = indexes.column;

    // make sure index are valid
  oj.Assert.assert(row >= this.m_startRow &&
                   row <= this.m_endRow &&
                   column >= this.m_startColumn &&
                   column <= this.m_endColumn);

  return this.m_models[row - this.m_startRow];
};

/**
 * Gets the actual count of the result set for the specified axis.  Valid values are "row" and "column".
 * @param {string} axis the axis in which to inquire the actual count of the result set.
 * @return {number} the actual count of the result set for the specified axis.
 * @export
 * @expose
 * @method
 * @instance
 * @memberof oj.CollectionCellSet
 */
oj.CollectionCellSet.prototype.getCount = function (axis) {
  if (axis === 'row') {
    return Math.max(0, this.m_endRow - this.m_startRow);
  }

  if (axis === 'column') {
    return Math.max(0, this.m_endColumn - this.m_startColumn);
  }

  return 0;
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
 * @memberof oj.CollectionCellSet
 * @since 4.0.0
 */
// eslint-disable-next-line no-unused-vars
oj.CollectionCellSet.prototype.getExtent = function (indexes) {
  return { row: { extent: 1, more: { before: false, after: false } },
    column: { extent: 1, more: { before: false, after: false } } };
};

/**
 * Gets the m_startRow property for testing
 * @export
 * @ignore
 * @memberof oj.CollectionCellSet
 */
oj.CollectionCellSet.prototype.getStartRow = function () {
  return this.m_startRow;
};

/**
 * Gets the m_endRow property for testing
 * @export
 * @ignore
 * @memberof oj.CollectionCellSet
 */
oj.CollectionCellSet.prototype.getEndRow = function () {
  return this.m_endRow;
};

/**
 * Gets the m_startColumn property for testing
 * @export
 * @ignore
 * @memberof oj.CollectionCellSet
 */
oj.CollectionCellSet.prototype.getStartColumn = function () {
  return this.m_startColumn;
};

/**
 * Gets the m_endColumn property for testing
 * @export
 * @ignore
 * @memberof oj.CollectionCellSet
 */
oj.CollectionCellSet.prototype.getEndColumn = function () {
  return this.m_endColumn;
};

/**
 * Gets the m_columns property for testing
 * @export
 * @ignore
 * @memberof oj.CollectionCellSet
 */
oj.CollectionCellSet.prototype.getColumns = function () {
  return this.m_columns;
};




/* global Promise:false, Logger:false */

/**
 * @class oj.CollectionDataGridDataSource
 * @classdesc An oj.Collection based implementation of the DataGridDataSource.
 * @see oj.Collection
 * @param {Object} collection the oj collection to adapter the DataGridDataSource
 * @param {Object=} options optional settings on this oj collection data source
 * @property {string=} options.rowHeader the key of the attribute designated as the row header
 * @property {Array.<string>=} options.columns explicitly specifies columns to display and in
 *        what order. These columns must be a subset of attributes from Model.
 * @export
 * @constructor
 * @final
 * @since 1.0
 * @extends oj.DataGridDataSource
 * @ojtsignore
 */
oj.CollectionDataGridDataSource = function (collection, options) {
  this.collection = collection;
  if (options != null) {
    this.rowHeader = options.rowHeader;
    this.columns = options.columns;
  }
  this._setSortInfo();

  oj.CollectionDataGridDataSource.superclass.constructor.call(this);
};

// subclass of DataGridDataSource
oj.Object.createSubclass(oj.CollectionDataGridDataSource, oj.DataGridDataSource,
                         'oj.CollectionDataGridDataSource');

/**
 * Initial the OJ collection based data source.
 * @instance
 * @override
 * @protected
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.Init = function () {
  // call super
  oj.CollectionDataGridDataSource.superclass.Init.call(this);

  this.pendingHeaderCallback = {};
  this._registerEventListeners();
};

/**
 * Register event handlers on the underlying OJ collection.
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._registerEventListeners = function () {
  this.collection.on('add', this._handleModelAdded.bind(this));
  this.collection.on('remove', this._handleModelDeleted.bind(this));
  this.collection.on('change', this._handleModelChanged.bind(this));
  this.collection.on('refresh', this._handleCollectionRefresh.bind(this));
  this.collection.on('reset', this._handleCollectionReset.bind(this));
};

/**
 * Determines if data has been fetched if virtual
 * @return {boolean} true if data is locally available, false otherwise.
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._isDataAvailable = function () {
  return (this.data != null);
};

/**
 * Returns the total number of rows or columns.  If the value return is not >= 0 then it is automatically assumed
 * that the total count is unknown. In the case of paging returns the total number of rows/colums on the page.
 * @param {string} axis the axis in which we inquire for the total count.  Valid values are "row" and "column".
 * @return {number} the total number of rows/columns.
 * @export
 * @method
 * @instance
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.getCount = function (axis) {
  if (this.precision === undefined) {
    this.precision = {};
  }

  if (axis === 'row') {
    var totalSize = this._totalSize();
    // 1. totalResults undefined
    // 2. data hasn't been fetched yet and totalResults set to 0 on collection
    // 3. the collection has size but not totalResults, truly unknown count
    if (totalSize === -1 || (totalSize === 0 && (!this._isDataAvailable() || this._size() > 0))) {
      this.precision[axis] = 'estimate';
      return -1;
    }
        // otherwise we will return the size of the collection or the pageSize
    this.precision[axis] = 'exact';
    return this._size();
  }
  if (axis === 'column') {
    // check whether column info are available
    if (this.columns != null) {
      this.precision[axis] = 'exact';
      return this.columns.length;
    }

    this.precision[axis] = 'estimate';
    return -1;
  }

  // should not get here
  return 0;
};
/**
 * Returns whether the total count returned in getCount function is an actual or an estimate.
 * @param {string} axis the axis in which we inquire whether the total count is an estimate.  Valid values are
 *        "row" and "column".
 * @return {string} "actual" if the count returned in getCount function is the actual count, "estimate" if the
 *         count returned in getCount function is an estimate.  The default value is "actual".
 * @export
 * @method
 * @instance
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.getCountPrecision = function (axis) {
    // if precision has not been determine for the axis, invoke getCount
  if (this.precision === undefined || this.precision[axis] === undefined) {
    this.getCount(axis);
  }
  return this.precision[axis];
};

/**
 * Fetch a range of headers from the data source.
 * @param {Object} headerRange information about the header range, it must contain the following properties:
 *        axis, start, count.
 * @property {string} headerRange.axis the axis of the header that are fetched.  Valid values are "row" and "column".
 * @property {number} headerRange.start the start index of the range in which the header data are fetched.
 * @property {number} headerRange.count the size of the range in which the header data are fetched.
 * @param {Object} callbacks the callbacks to be invoke when fetch headers operation is completed.  The valid callback
 *        types are "success" and "error".
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
 * @memberof oj.CollectionDataGridDataSource
 * @return {undefined}
 */
oj.CollectionDataGridDataSource.prototype.fetchHeaders = function (
  headerRange, callbacks, callbackObjects
) {
  // still fetching, just store the callback info
  if (callbacks != null) {
    var axis = headerRange.axis;
    var callback = {};
    callback.headerRange = headerRange;
    callback.callbacks = callbacks;
    callback.callbackObjects = callbackObjects;
    this.pendingHeaderCallback[axis] = callback;
  }
};

/**
 * Handle success fetchHeaders request
 * @param {Object} headerRange information about the header range, it must contain the following properties:
 *        axis, start, count.
 * @property {string} headerRange.axis the axis of the header that are fetched.  Valid values are "row" and "column".
 * @property {number} headerRange.start the start index of the range in which the header data are fetched.
 * @property {number} headerRange.count the size of the range in which the header data are fetched.
 * @param {Object} callbacks the callbacks to be invoke when fetch headers operation is completed.  The valid callback
 *        types are "success" and "error".
 * @property {function({startHeaderSet: Object}, {headerRange: Object}, {endHeaderSet: Object}):undefined} callbacks.success the callback to invoke when fetch headers completed successfully.
 *        The function takes three parameters: HeaderSet object representing start headers, headerRange object passed into the original fetchHeaders call,
 *        and a HeaderSet object representing the end headers along the axis.
 * @property {function({status: Object}):undefined} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @param {Object=} actualRange the count and start returned from the server
 * @property {number} actualRange.start the start index of the data the server returned
 * @property {number} actualRange.count the size of the range the server returned
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._handleHeaderFetchSuccess = function (
  headerRange, callbacks, callbackObjects, actualRange
) {
  var axis = headerRange.axis;
  var start = headerRange.start;
  var count = headerRange.count;
  var end;
  var headerSet;

  if (axis === 'column') {
    // column headers, this.columns should be populated by now
    if (this.columns != null) {
      end = Math.min(this.columns.length, start + count);
      headerSet = new oj.CollectionHeaderSet(start, end, this.columns, undefined, this._sortInfo);
    }
  } else if (axis === 'row') {
    // row headers, return non-empty header set if row header is specified
    if (this.rowHeader != null) {
      // need the actual rows that the server returned to create the header set
      if (actualRange != null) {
        count = actualRange.count;
      }
      end = Math.min(this._size(), start + count);

      headerSet = new oj.CollectionHeaderSet(start, end, this.columns, this.rowHeader);
      // resolve any promises before invoking callbacks
      this._resolveModels(start, end, headerSet, headerRange, callbacks, callbackObjects);

      // resolveModels will invoke callbacks
      return;
    }
  }

  // invoke callback
  if (callbacks != null && callbacks.success) {
    callbacks.success.call(callbackObjects.success, headerSet, headerRange, null);
  }
};

/**
 * Helper method to extract range information from cellRanges
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @property {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid
 *        values are "row" and "column".
 * @property {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @property {number} cellRanges.count the size of the range for this axis in which the cells are fetched.
 * @return {Object} an object containing rowStart, rowCount, colStart, colCount
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._getRanges = function (cellRanges) {
  var rowStart;
  var rowCount;
  var colStart;
  var colCount;

  // extract the start and end row/column info from cellRanges (there should only be two, one for each axis)
  for (var i = 0; i < cellRanges.length; i++) {
    var cellRange = cellRanges[i];
    if (cellRange.axis === 'row') {
      rowStart = cellRange.start;
      rowCount = cellRange.count;
    } else if (cellRange.axis === 'column') {
      colStart = cellRange.start;
      colCount = cellRange.count;
    }
  }

  // return object containing the ranges
  return { rowStart: rowStart, rowCount: rowCount, colStart: colStart, colCount: colCount };
};

/**
 * Handle success fetchCells request
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @property {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid
 *        values are "row" and "column".
 * @property {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @property {number} cellRanges.count the size of the range for this axis in which the cells are fetched.
 * @param {Object} callbacks the callbacks to be invoke when fetch cells operation is completed.  The valid callback
 *        types are "success" and "error".
 * @property {function({cellSet: Object}, {cellRanges: Array.<Object>}):undefined} callbacks.success the callback to invoke when fetch cells completed successfully.
 * @property {function({status: Object}):undefined} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @param {Object=} actualRange the count and start returned from the server
 * @property {number} actualRange.start the start index of the data the server returned
 * @property {number} actualRange.count the size of the range the server returned
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._handleCellFetchSuccess = function (
  cellRanges, callbacks, callbackObjects, actualRange
) {
  // extract the start and end row/column info from cellRanges (there should only be two, one for each axis)
  var ranges = this._getRanges(cellRanges);
  var rowStart = ranges.rowStart;
  var rowEnd;

  // use the actual rows returned by the server
  if (actualRange != null) {
    rowEnd = Math.min(this._size(), rowStart + actualRange.count);
  } else {
    rowEnd = Math.min(this._size(), rowStart + ranges.rowCount);
  }
  var colStart = ranges.colStart;
  // if there are no columns make sure we return an empty cellSet
  var colEnd = Math.min(this.columns == null ? 0 : this.columns.length, colStart + ranges.colCount);

  // resolves models at row range
  var cellSet = new oj.CollectionCellSet(rowStart, rowEnd, colStart, colEnd, this.columns);
  this._resolveModels(rowStart, rowEnd, cellSet, cellRanges, callbacks, callbackObjects);
};

/**
 * Resolves all the promises from Collection before invoking callbacks
 * @param {number} rowStart the start row index in the cell set
 * @param {number} rowEnd the end row index in the cell set
 * @param {Object} set the result HeaderSet or CellSet that is return to callbacks when models are resolved
 * @param {Array.<Object>|Object} ranges Information about the header/cell range.
 * @property {function(Object)} callbacks.success the callback to invoke when fetch headers/cells completed successfully.
 * @property {function({status: Object})} callbacks.error the callback to invoke when fetch headers/cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._resolveModels = function (
  rowStart, rowEnd, set, ranges, callbacks, callbackObjects
) {
  var promises = [];
  for (var i = rowStart; i < rowEnd; i++) {
    promises.push(this.collection.at(i, { deferred: true }));
  }

  // resolves all promises
  Promise.all(promises).then(function (models) {
    // all promises resolved, invoke callback with cell/header set
    set.setModels(models);
    callbacks.success.call(callbackObjects.success, set, ranges);
  });
};

/**
 * Fetch a range of cells from the data source.
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @property {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid
 *        values are "row" and "column".
 * @property {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @property {number} cellRanges.count the size of the range for this axis in which the cells are fetched.
 * @param {Object} callbacks the callbacks to be invoke when fetch cells operation is completed.  The valid callback
 *        types are "success" and "error".
 * @property {function({cellSet: Object}, {cellRanges: Array.<Object>}):undefined} callbacks.success the callback to invoke when fetch cells completed successfully.
 * @property {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.
 * @property {Object=} callbackObjects.success
 * @property {Object=} callbackObjects.error
 * @export
 * @method
 * @instance
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.fetchCells = function (
  cellRanges, callbacks, callbackObjects
) {
  // still fetching, just store the callback info
  if (callbacks != null) {
    this.pendingCellCallback = {};
    this.pendingCellCallback.cellRanges = cellRanges;
    this.pendingCellCallback.callbacks = callbacks;
    this.pendingCellCallback.callbackObjects = callbackObjects;
  }

    // kick start a setRangeLocal call on the collection
  this._fetchCells(cellRanges);
};

/**
 * Processing pending header callbacks.
 * @param {string} axis the axis to check for pending header callbacks.
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._processPendingHeaderCallbacks = function (axis) {
  // check if there's callback remaining for the axis
  var pendingCallback = this.pendingHeaderCallback[axis];
  if (pendingCallback != null) {
    // todo: check whether pending header range matches result
    var headerRange = pendingCallback.headerRange;
    var callbacks = pendingCallback.callbacks;
    var callbackObjects = pendingCallback.callbackObjects;
    var actualRange;
    if (axis === 'row') {
      actualRange = pendingCallback.actualRange;
    }
    this._handleHeaderFetchSuccess(headerRange, callbacks, callbackObjects, actualRange);

    // clear any pending callback
    this.pendingHeaderCallback[axis] = null;
  }
};

/**
 * Processing pending cell callbacks.
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._processPendingCellCallbacks = function () {
  var cellRanges = this.pendingCellCallback.cellRanges;
  var callbacks = this.pendingCellCallback.callbacks;
  var callbackObjects = this.pendingCellCallback.callbackObjects;
  var actualRange = this.pendingCellCallback.actualRange;
  // handles success cell fetch
  this._handleCellFetchSuccess(cellRanges, callbacks, callbackObjects, actualRange);

  this.pendingCellCallback = null;
};

/**
 * Internal method to handle fetching of cells for virtualized collection.
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @property {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid
 *        values are "row" and "column".
 * @property {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @property {number} cellRanges.count the size of the range for this axis in which the cells are fetched.
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._fetchCells = function (cellRanges) {
  var ranges = this._getRanges(cellRanges);
  var rowStart = ranges.rowStart;
  var rowCount = ranges.rowCount;

  // set the range local for the requested range
  this.collection.setRangeLocal(rowStart, rowCount).then(function (actual) {
    // keeps track of whether or not the data source has fetched
    this.data = true;

    this._setActualCallbackRanges(actual.start, actual.count);

    // check if we need to poach columns from row
    if (this.columns === undefined) {
      this.collection.at(rowStart, { deferred: true }).then(function (model) {
        if (model != null) {
          this._setupColumns(model);
        }
        // now we can complete the fetch
        this._fetchCellsComplete(cellRanges);
      }.bind(this));

      // process must be done after columns are discovered
      return;
    }

    this._fetchCellsComplete(cellRanges);
  }.bind(this), function (e) {
    this._fetchCellsError(e);
  }.bind(this));
};

/**
 * Handles error from setRangeLocal call in fetchCells.
 * @param {Object} error the error returned from setRangeLocal error callback.
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._fetchCellsError = function (error) {
  // log the error
  Logger.error(error);

  // invoke any header error callbacks
  if (this.pendingHeaderCallback != null) {
    this._processPendingHeaderErrorCallbacks('column', error);
    this._processPendingHeaderErrorCallbacks('row', error);
  }

  // invoke any cell error callbacks
  if (this.pendingCellCallback != null) {
    this._processPendingCellErrorCallbacks(error);
  }
};

/**
 * Handles any pending header callbacks in the case of error being thrown.
 * @param {string} axis the header axis
 * @param {Object} error the error returned from setRangeLocal error callback
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._processPendingHeaderErrorCallbacks = function (
  axis, error
) {
  var pendingCallback = this.pendingHeaderCallback[axis];
  if (pendingCallback != null) {
    var callbacks = pendingCallback.callbacks;
    var callbackObjects = pendingCallback.callbackObjects;
    var headerRange = pendingCallback.headerRange;

    // invoke error callback
    if (callbacks.error) {
      callbacks.error.call(callbackObjects.error, error, headerRange);
    }

    // clear any pending callback
    this.pendingHeaderCallback[axis] = null;
  }
};

/**
 * Handles any pending cell callbacks in the case of error being thrown.
 * @param {Object} error the error returned from setRangeLocal error callback
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._processPendingCellErrorCallbacks = function (error) {
  var callbacks = this.pendingCellCallback.callbacks;
  var callbackObjects = this.pendingCellCallback.callbackObjects;
  var cellRanges = this.pendingCellCallback.cellRanges;

  // invoke error callback
  if (callbacks.error) {
    callbacks.error.call(callbackObjects.error, error, cellRanges);
  }

  // clear any pending callback
  this.pendingCellCallback = null;
};

/**
 * Finish fetch cells operation
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @property {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid
 *        values are "row" and "column".
 * @property {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @property {number} cellRanges.count the size of the range for this axis in which the cells are fetched.
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._fetchCellsComplete = function (cellRanges) {
  // make sure we only callback when we have the most recent request
  if (this.pendingCellCallback.cellRanges !== cellRanges) {
    return;
  }

  // check outstanding header calls
  if (this.pendingHeaderCallback != null) {
    this._processPendingHeaderCallbacks('column');
    this._processPendingHeaderCallbacks('row');
  }

  // finally process outstanding cell calls
  if (this.pendingCellCallback != null) {
    this._processPendingCellCallbacks();
  }
};

/**
 * Takes the actual result start and count from the server and adds it to the pending callback objects
 * as the attribute actualRange
 * @param {number} start the start index from the server
 * @param {number} count the count of records from the server
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._setActualCallbackRanges = function (start, count) {
  var actualRange = { start: start, count: count };

  if (this.pendingHeaderCallback.row != null) {
    this.pendingHeaderCallback.row.actualRange = actualRange;
  }

  if (this.pendingCellCallback != null) {
    this.pendingCellCallback.actualRange = actualRange;
  }
};

/**
 * @param {Object} model
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._setupColumns = function (model) {
  this.columns = model.keys();
  if (this.columns.indexOf(this.rowHeader) !== -1) {
    this.columns.splice(this.columns.indexOf(this.rowHeader), 1);
  }
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
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.keys = function (indexes) {
  var rowIndex = indexes.row;
  var columnIndex = indexes.column;
  var self = this;

  return new Promise(function (resolve) {
    self.collection.at(rowIndex, { deferred: true }).then(function (rowModel) {
      if (rowModel == null) {
        resolve({ row: null, column: null });
      } else {
        var rowKey = oj.CollectionDataGridUtils._getModelKey(rowModel);
        if (self.columns == null) {
          self._setupColumns(rowModel);
        }
        var columnKey = self.columns[columnIndex];
        resolve({ row: rowKey, column: columnKey });
      }
    });
  });
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
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.indexes = function (keys) {
  var rowKey = keys.row;
  var columnKey = keys.column;
  var self = this;

  return new Promise(function (resolve) {
    self.collection
      .indexOf(rowKey, { deferred: true })
      .then(function (rowIndex) {
        var columnIndex = -1;
        // if the row exists but columns not yet set
        if (rowIndex !== -1 && self.columns == null) {
          self.collection.at(rowIndex, { deferred: true }).then(function (model) {
            self._setupColumns(model);
            columnIndex = self.columns.indexOf(columnKey);
            resolve({ row: rowIndex, column: columnIndex });
          });
        } else {
          // if the row exists or not and columns set
          // can have a case where columns not set yet, and model doesn't exist
          // should return -1, -1 in that case
          if (self.columns != null) {
            columnIndex = self.columns.indexOf(columnKey);
          }
          resolve({ row: rowIndex, column: columnIndex });
        }
      });
  });
};

/**
 * Determines whether this CollectionDataGridDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort" and "move"
 * @return {string|null} the name of the feature.  For sort, the valid return values are: "full", "none".  Returns null if the
 *         feature is not recognized.
 * @export
 * @method
 * @instance
 * @memberof oj.CollectionDataGridDataSource
*/
oj.CollectionDataGridDataSource.prototype.getCapability = function (feature) {
  if (feature === 'sort') {
    // OJ collection based data source supports column sorting only
    return 'column';
  } else if (feature === 'move') {
    // OJ collection based data source supports row moving only
    return 'row';
  }
  return null;
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
 * @memberof oj.CollectionDataGridDataSource
 * @return {undefined}
 */
oj.CollectionDataGridDataSource.prototype.sort = function (criteria, callbacks, callbackObjects) {
  // make sure callbackObjects is not null
  if (callbackObjects == null) {
    // eslint-disable-next-line no-param-reassign
    callbackObjects = {};
  }

  // reset sort order if null is specified
  if (criteria == null) {
    this._resetSortOrder(callbacks, callbackObjects);
    return;
  }

  var direction = criteria.direction;
  var key = criteria.key;
  var axis = criteria.axis;

  if (axis === 'column') {
    // check to see if collection is virtual, if so set the comparator and direction
    if (this.collection.IsVirtual()) {
      this.collection.comparator = key;
      if (direction === 'ascending') {
        this.collection.sortDirection = 1;
      } else {
        this.collection.sortDirection = -1;
      }
    } else {
      // if the collection is local supply a comparator to allow date sorting
      var comparator;
      if (direction === 'ascending') {
        comparator = function (_a, _b) {
          // Get the values from the model objects
          var a = _a.get(key);
          var b = _b.get(key);
          // Strings of numbers return false, so we can compare strings of numbers with numbers
          var as = isNaN(a);
          var bs = isNaN(b);
          // If they dates, turn them into sortable strings
          if (a instanceof Date) {
            a = a.toISOString();
            as = true;
          }
          if (b instanceof Date) {
            b = b.toISOString();
            bs = true;
          }
          // both are string
          if (as && bs) {
            if (a < b) {
              return -1;
            } else if (a === b) {
              return 0;
            }
            return 1;
          }
          // only a is a string
          if (as) {
            return 1;
          }
          // only b is a string
          if (bs) {
            return -1;
          }
          // both are numbers
          return a - b;
        };
      } else if (direction === 'descending') {
        comparator = function (_a, _b) {
          var a = _a.get(key);
          var b = _b.get(key);
          var as = isNaN(a);
          var bs = isNaN(b);
          if (a instanceof Date) {
            a = a.toISOString();
          }
          if (b instanceof Date) {
            b = b.toISOString();
          }
          if (as && bs) {
            if (a > b) {
              return -1;
            } else if (a === b) {
              return 0;
            }
            return 1;
          }
          if (as) {
            return -1;
          }
          if (bs) {
            return 1;
          }
          return b - a;
        };
      }
      this.collection.comparator = comparator;
    }

    this.collection.sort();

    this._setSortInfo(key);

    if (callbacks != null && callbacks.success != null) {
      callbacks.success.call(callbackObjects.success);
    }
  } else if (callbacks != null && callbacks.error != null) {
    callbacks.error.call(callbackObjects.error, 'Axis value not supported');
  }
};

/**
 * Reset the sort order of the data.
 * @param {Object=} callbacks the callbacks to be invoke upon completion of the sort operation.  The callback
 *        properties are "success" and "error".
 * @property {function()} callbacks.success the callback to invoke when the sort completed successfully.
 * @property {function({status: Object})} callbacks.error the callback to invoke when sort failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.
 *        You can specify the callback object for each callbacks using the "success" and "error" properties.
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._resetSortOrder = function (callbacks, callbackObjects) {
  // clear out comparator to reset sort order
  this.collection.comparator = null;
  this.collection.reset();

  if (callbacks != null && callbacks.success != null) {
    callbacks.success.call(callbackObjects.success);
  }
};

/**
 * Get sort info from the collection and setup the original sortInfo
 * @param {string|number=} key the key of the sorted column if we have performed a sort
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._setSortInfo = function (key) {
  var comparator = this.collection.comparator;
  var direction = this.collection.sortDirection === -1 ? 'descending' : 'ascending';

  if (key == null && typeof comparator === 'function') {
    this._sortInfo = {};
    return;
  }

  this._sortInfo = {};
  this._sortInfo.axis = 'column';
  this._sortInfo.direction = direction;
  this._sortInfo.key = key == null ? comparator : null;
};

/**
 * Move a model to a new index in the collection, if referenceRow is null adds to the end
 * @param {any} rowToMove the key of the model that should be moved
 * @param {any} referenceRow the key of the model that the moved model should be inserted before or after
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
 * @memberof oj.CollectionDataGridDataSource
 * @return {undefined}
 */
oj.CollectionDataGridDataSource.prototype.move = function (
  rowToMove, referenceRow, position, callbacks, callbackObjects
) {
  this.collection.get(rowToMove, { deferred: true }).then(function (moveModel) {
    var indexPromise;
    if (referenceRow == null) {
      this.collection.remove(moveModel);
      this.collection.add(moveModel);
      if (callbacks != null && callbacks.success != null) {
        callbacks.success.call(callbackObjects.success);
      }
    } else {
      if (rowToMove === referenceRow) {
        indexPromise = this.collection.indexOf(referenceRow, { deferred: true });
        this.collection.remove(moveModel);
      } else {
        this.collection.remove(moveModel);
        indexPromise = this.collection.indexOf(referenceRow, { deferred: true });
      }

      indexPromise.then(function (newIndex) {
        this.collection.add(moveModel, { at: newIndex, force: true });
        if (callbacks != null && callbacks.success != null) {
          callbacks.success.call(callbackObjects.success);
        }
      }.bind(this));
    }
  }.bind(this));
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
 * @memberof oj.CollectionDataGridDataSource
 */
// eslint-disable-next-line no-unused-vars
oj.CollectionDataGridDataSource.prototype.moveOK = function (rowToMove, referenceRow, position) {
  return 'valid';
};


// ////////////////////////////////// Event listeners /////////////////////////////////////
/**
 * Returns an Object for an event
 * @param {string} operation the operation done on the model
 * @param {any} rowKey the key for the row axis
 * @param {any} columnKey the key for the column axis
 * @param {number=} rowIndex the index for the row axis
 * @param {number=} columnIndex the index for the column axis
 * @return {Object} an object containing the the source, operation, and keys of the event
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._getModelEvent = function (
  operation, rowKey, columnKey, rowIndex, columnIndex
) {
  var event = {};
  event.source = this;
  event.operation = operation;
  event.keys = { row: rowKey, column: columnKey };
  event.indexes = { row: rowIndex, column: columnIndex };
  return event;
};

/**
 * Handle a model add to the collection
 * @param {Object} model The model being added to the collection
 * @param {Object} collection The collection the model was added to
 * @param {Object} args additional params passed by the event
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
// eslint-disable-next-line no-unused-vars
oj.CollectionDataGridDataSource.prototype._handleModelAdded = function (model, collection, args) {
  var rowKey = oj.CollectionDataGridUtils._getModelKey(model);
  var event = this._getModelEvent('insert', rowKey, null, model.index, -1);
  this.handleEvent('change', event);
};

/**
 * Handle a model delete from the collection
 * @param {Object} model The model being deleted from the collection
 * @param {Object} collection The collection the model was added to
 * @param {Object} args additional params passed by the event
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._handleModelDeleted = function (model, collection, args) {
  var rowKey = oj.CollectionDataGridUtils._getModelKey(model);
  var event = this._getModelEvent('delete', rowKey, null, args.index, -1);
  this.handleEvent('change', event);
};

/**
 * Handle a model change in the collection
 * @param {Object} model The model being changed in the collection
 * @param {Object} collection The collection the model was added to
 * @param {Object} args additional params passed by the event
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
// eslint-disable-next-line no-unused-vars
oj.CollectionDataGridDataSource.prototype._handleModelChanged = function (model, collection, args) {
  // pass the indexes into the grid on model change
  var rowKey = oj.CollectionDataGridUtils._getModelKey(model);
  var event = this._getModelEvent('update', rowKey, null, model.index, -1);
  this.handleEvent('change', event);
};

/**
 * Handle a collection refresh, by firing change event with operation refresh
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._handleCollectionRefresh = function () {
  this.data = null;
  var event = this._getModelEvent('refresh', null, null);
  this.handleEvent('change', event);
};

/**
 * Handle a collection reset, by firing change event with operation reset
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._handleCollectionReset = function () {
  this.data = null;
  var event = this._getModelEvent('reset', null, null);
  this.handleEvent('change', event);
};

/**
 * Get the length of the collection. -1 if an initial fetch has not been
 * done yet. Default to the size of the collection. If pageSize is set then
 * limit it.
 * @returns {number} length of the collection
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._size = function () {
  return this.collection.size();
};

/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @private
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype._totalSize = function () {
  return this.collection.totalResults === undefined ? -1 : this.collection.totalResults;
};

// ////////////////////////////////// Property Getters  /////////////////////////////////////
/**
 * Gets the collection property for testing
 * @export
 * @ignore
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.getCollection = function () {
  return this.collection;
};

/**
 * Gets the columns property for testing
 * @export
 * @ignore
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.getColumns = function () {
  return this.columns;
};

/**
 * Gets the rowHeader property for testing
 * @export
 * @ignore
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.getRowHeader = function () {
  return this.rowHeader;
};

/**
 * Gets the data property for testing
 * @export
 * @ignore
 * @memberof oj.CollectionDataGridDataSource
 */
oj.CollectionDataGridDataSource.prototype.getData = function () {
  return this.data;
};



/**
 * This class contains all utility methods used by the data grid collection model.
 * @constructor
 * @private
 */
oj.CollectionDataGridUtils = function () {
};

/**
 * Returns the key of the model. It is the id if one is set otherwise
 * it is the cId
 * @private
 * @param {Object} model the model to check for id and cid
 * @return {string} the id or cid for the model
 */
oj.CollectionDataGridUtils._getModelKey = function (model) {
  var key = model.GetId();
  if (key == null) {
    key = model.GetCid();
  }
  return key;
};



/**
 * @export
 * @class oj.CollectionHeaderSet
 * @classdesc A HeaderSet represents a collection of headers.  The HeaderSet is an object returned by the success callback
 * of the fetchHeaders method on DataGridDataSource.  This implementation of HeaderSet is used by the
 * CollectionDataGridDataSource.
 * @param {number} start the start index of header set.
 * @param {number} end the end index of the header set.
 * @param {Array} headers the array of headers
 * @param {string=} rowHeader the id of the row header column.  Required for row headers.
 * @param {Object=} sortInfo the information about the sort direction and key
 * @constructor
 * @since 1.0
 * @hideconstructor
 * @ojtsignore
 * @see oj.CollectionDataGridDataSource
 */
oj.CollectionHeaderSet = function (start, end, headers, rowHeader, sortInfo) {
  // assert start/end are number
  oj.Assert.assertArrayOrNull(headers);

  this.m_start = start;
  this.m_end = end;
  this.m_headers = headers;
  this.m_rowHeader = rowHeader;
  this.m_sortInfo = sortInfo;
};

/**
 * Sets the models used in this header set.
 * @param {Array} models an array of oj model for the header set
 * @private
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.setModels = function (models) {
  oj.Assert.assertArray(models);
  // make sure the array size is valid
  if (models != null && models.length === this.getCount()) {
    this.m_models = models;
  }
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
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getData = function (index, level) {
  var model;

  // make sure index/level are valid
  oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds');
  oj.Assert.assert(level == null || level === 0, 'level out of bounds');

  // row or column header
  if (this.m_rowHeader != null) {
    if (this.m_models == null) {
      return null;
    }

    model = this.m_models[index - this.m_start];
    return model.get(this.m_rowHeader);
  }

  return this.m_headers[index];
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
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getMetadata = function (index, level) {
  oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds');
  oj.Assert.assert(level == null || level === 0, 'level out of bounds');

  // row header case
  if (this.m_rowHeader != null) {
    if (this.m_models == null) {
      return null;
    }

    var model = this.m_models[index - this.m_start];
    return { key: oj.CollectionDataGridUtils._getModelKey(model) };
  }

  var data = this.getData(index, level);
  if (this.m_sortInfo.key === data) {
    return { key: data, sortDirection: this.m_sortInfo.direction };
  }
  return { key: data };
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
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getLevelCount = function () {
  if (this.getCount() > 0) {
    return 1;
  }
  return 0;
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
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getExtent = function (index, level) {
  oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds');
  oj.Assert.assert(level == null || level === 0, 'level out of bounds');
  return { extent: 1, more: { before: false, after: false } };
};

/**
 * Gets the label for the level along the axis of that header. Specify null to have no header labels.
 * @param {number} level the header level to retrieve the label data for
 * @return {*} the data for the header label
 * @export
 * @expose
 * @method
 * @instance
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getLabel = function () {
  return null;
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
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getDepth = function (index, level) {
  oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds');
  oj.Assert.assert(level == null || level === 0, 'level out of bounds');
  return 1;
};

/**
 * Gets the actual count of the result set, the total indexes spanned by the headerSet
 * along the innermost header.
 * @return {number} the actual count of the result set.
 * @export
 * @expose
 * @method
 * @instance
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getCount = function () {
  return Math.max(0, this.m_end - this.m_start);
};

/**
 * For internal testing purposes. Gets the m_start property
 * @return {number} the start index of the result set.
 * @export
 * @ignore
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getStart = function () {
  return this.m_start;
};

/**
 * For internal testing purposes. Gets the m_end property
 * @export
 * @ignore
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getEnd = function () {
  return this.m_end;
};

/**
 * For internal testing purposes. Gets the m_headers property
 * @export
 * @ignore
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getHeaders = function () {
  return this.m_headers;
};

/**
 * For internal testing purposes. Gets the m_rowHeader property
 * @export
 * @ignore
 * @memberof oj.CollectionHeaderSet
 */
oj.CollectionHeaderSet.prototype.getRowHeader = function () {
  return this.m_rowHeader;
};


// Define a mapping variable that maps the return value of the module to the name used in the callback function of a require call.

var CollectionDataGridDataSource = {};
CollectionDataGridDataSource.CollectionDataGridDataSource = oj.CollectionDataGridDataSource;
CollectionDataGridDataSource.CollectionHeaderSet = oj.CollectionHeaderSet;
CollectionDataGridDataSource.CollectionCellSet = oj.CollectionCellSet;

  return CollectionDataGridDataSource;
});