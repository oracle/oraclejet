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
* @class oj.ArrayCellSet
* @classdesc A CellSet represents a collection of cells.  The CellSet is an object returned by the success callback
* of the fetchCells method on DataGridDataSource.  This implementation of CellSet is used by the
* array DataGridDataSource.
* @param {number} startRow the start row index of the cell set
* @param {number} endRow the end row index of the cell set
* @param {number} startColumn the start column index of the cell set
* @param {number} endColumn the end column index of the cell set
* @param {Object} callback the callback to invoke on to retrieve data and metadata.
* @constructor
* @since 1.0
* @export
* @hideconstructor
* @ojtsignore
* @see oj.ArrayDataGridDataSource
*/
oj.ArrayCellSet = function (startRow, endRow, startColumn, endColumn, callback) {
  this.m_startRow = startRow;
  this.m_endRow = endRow;
  this.m_startColumn = startColumn;
  this.m_endColumn = endColumn;
  this.m_callback = callback;
};
/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available
 * 2) the index specified is out of bounds.
 * @param {Object} indexes the index of each axis in which we want to retrieve the data from.
 * @param {number} indexes.row the index of the row axis.
 * @param {number} indexes.column the index of the column axis.
 * @return {Object} an object with property data with the data for the specified index.
 * @export
 * @expose
 * @memberof oj.ArrayCellSet
 * @method
 * @instance
 * @memberof oj.ArrayCellSet
 */


oj.ArrayCellSet.prototype.getData = function (indexes) {
  var self = this;
  var rowIndex = indexes.row;
  var columnIndex = indexes.column;
  var returnObj = {};
  Object.defineProperty(returnObj, 'data', {
    enumerable: true,
    get: function get() {
      return self.m_callback._getCellData(rowIndex, columnIndex);
    },
    set: function set(newValue) {
      self.m_callback._setCellData(rowIndex, columnIndex, newValue);
    }
  });
  return returnObj;
};
/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available
 * 2) the index specified is out of bounds.
 * @param {Object} indexes the index of each axis in which we want to retrieve the metadata from.
 * @param {number} indexes.row the index of the row axis.
 * @param {number} indexes.column the index of the column axis.
 * @return {Object} the metadata object for the specific index.  The metadata that the DataGrid supports are:
 *         1) keys - the key (of each axis) of the cell.
 * @export
 * @expose
 * @memberof oj.ArrayCellSet
 * @method
 * @instance
 * @memberof oj.ArrayCellSet
 */


oj.ArrayCellSet.prototype.getMetadata = function (indexes) {
  return this.m_callback._getCellMetadata(indexes.row, indexes.column);
};
/**
 * Gets the start index of the result set for the specified axis.  Valid values are "row" and "column".
 * @param {string} axis the axis in which to inquire the actual count of the result set.
 * @return {number} the start index of the result set for the specified axis.
 * @export
 * @expose
 * @memberof oj.ArrayCellSet
 * @method
 * @instance
 * @memberof oj.ArrayCellSet
 */


oj.ArrayCellSet.prototype.getStart = function (axis) {
  if (axis === 'row') {
    return this.m_startRow;
  } else if (axis === 'column') {
    return this.m_startColumn;
  }

  return -1;
};
/**
 * Gets the actual count of the result set for the specified axis.  Valid values are "row" and "column".
 * @param {string} axis the axis in which to inquire the actual count of the result set.
 * @return {number} the actual count of the result set for the specified axis.
 * @export
 * @expose
 * @memberof oj.ArrayCellSet
 * @method
 * @instance
 * @memberof oj.ArrayCellSet
 */


oj.ArrayCellSet.prototype.getCount = function (axis) {
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
 * @param {number} indexes.row the index of the row axis.
 * @param {number} indexes.column the index of the column axis.
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
 * @memberof oj.ArrayCellSet
 * @since 4.0.0
 * @export
 * @expose
 * @method
 * @instance
 * @memberof oj.ArrayCellSet
 * @since 4.0.0
 */
// eslint-disable-next-line no-unused-vars


oj.ArrayCellSet.prototype.getExtent = function (indexes) {
  return {
    row: {
      extent: 1,
      more: {
        before: false,
        after: false
      }
    },
    column: {
      extent: 1,
      more: {
        before: false,
        after: false
      }
    }
  };
}; // //// testing methods to get properties //////

/**
 * Gets the start row property for testing
 * @return {number} the start row
 * @export
 * @ignore
 * @method
 * @instance
 * @memberof oj.ArrayCellSet
 */


oj.ArrayCellSet.prototype.getStartRow = function () {
  return this.m_startRow;
};
/**
 * Gets the start column property for testing
 * @return {number} the start column
 * @export
 * @ignore
 * @method
 * @instance
 * @memberof oj.ArrayCellSet
 */


oj.ArrayCellSet.prototype.getStartColumn = function () {
  return this.m_startColumn;
};

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/* global Promise:false */

/**
 * @class oj.ArrayDataGridDataSource
 * @classdesc An array based implementation of the DataGridDataSource.
 * @param {Array|Object} data the data in the form of array or observable array.
 * @param {Object=} options the options specific to this DataGridDataSource.
 * @property {Array<any>=} options.columns an array of columns to return as column headers.
 * @property {any=} options.rowHeader an object representing the default row header,
 *      if a string is provided it will be used as the key of the header, if a number is provided
 *      it will be used as the index of the header.
 * @property {string=} options.rowHeader.default disable default row headers or provide them as indexes 'none' or 'index'
 * @property {Object=} options.initialSort the information about the array if it is pre-sorted
 * @property {string=} options.initialSort.axis the axis that the array is sorted on valid values are 'column', 'row'
 * @property {any=} options.initialSort.key the key that the array is sorted on
 * @property {string=} options.initialSort.direction valid values are ascending or descending
 * @export
 * @constructor
 * @final
 * @since 1.0
 * @extends oj.DataGridDataSource
 * @ojtsignore
 */
oj.ArrayDataGridDataSource = function (data, options) {
  if (!(data instanceof Array) && typeof data !== 'function' && typeof data.subscribe !== 'function') {
    // we only support Array or ko.observableArray. To
    // check for observableArray, we can't do instanceof check because it's
    // a function. So we just check if it contains a subscribe function.
    var errSummary = '_ERR_DATA_INVALID_TYPE_SUMMARY';
    var errDetail = '_ERR_DATA_INVALID_TYPE_DETAIL';
    throw new Error(errSummary + '\n' + errDetail);
  }

  this.rowHeaderKey = this._getRowHeaderFromOptions(options);

  if (options != null) {
    // undefined if no row header, 'm_defaultIndex' if indexed, other strings keys, numbers index of array
    this.columns = options.columns;
    this.sortCriteria = options.initialSort;
  }

  oj.ArrayDataGridDataSource.superclass.constructor.call(this, data);
}; // Subclass from oj.DataGridDataSource


oj.Object.createSubclass(oj.ArrayDataGridDataSource, oj.DataGridDataSource, 'oj.ArrayDataGridDataSource');
/**
 * Initial the array based data source.
 * @memberof oj.ArrayDataGridDataSource
 * @instance
 * @override
 * @protected
 */

oj.ArrayDataGridDataSource.prototype.Init = function () {
  // suck out the column definition from data
  if (this.columns == null) {
    this.columns = this._getColumnsForScaffolding(this.getDataArray());
  }

  this._initializeRowKeys(); // if the data is an observable array subscribe to array change notifications


  if (typeof this.data === 'function') {
    this.data.subscribe(this._subscribe.bind(this), null, 'arrayChange');
  } // call super


  oj.ArrayDataGridDataSource.superclass.Init.call(this);
};
/**
 * @export
 * @memberof oj.ArrayDataGridDataSource
 * @type {Function}
 * @desc If set to a function(row1, row2), then this function is called comparing raw row data (see the
 * JavaScript array.sort() for details)
 */


oj.ArrayDataGridDataSource.prototype.comparator = null;
/**
 * @export
 *
 * @type {Object}
 * @property {string} axis the sort axis valid values are "column", "row"
 * @property {string|number} key The key that identifies which field to sort
 * @property {string} direction the sort direction, valid values are "ascending", "descending", "none" (default)
 *
 * @desc The sort criteria. Whenever sort() is called with the criteria parameter, that value is copied to this
 * property. If sort() is called with empty sort criteria then the criteria set in this property is used.
 * @memberof oj.ArrayDataGridDataSource
 */

oj.ArrayDataGridDataSource.prototype.sortCriteria = null;
/**
 * Extract the row header from the options
 * @param {Object|null=} options the options passed into the data source
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */

oj.ArrayDataGridDataSource.prototype._getRowHeaderFromOptions = function (options) {
  if (options != null && options.rowHeader != null) {
    var option = options.rowHeader;

    if (_typeof(option) === 'object') {
      if (option.default != null) {
        if (option.default === 'none') {
          return undefined;
        } else if (option.default === 'index') {
          return 'm_defaultIndex';
        }
      }
    } else if (option != null) {
      return option;
    }
  } // nothing set means indexed headers


  return 'm_defaultIndex';
};
/**
 * Initialize the generated row keys.
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._initializeRowKeys = function () {
  var data;
  data = this.getDataArray();

  for (this.lastKey = 0; this.lastKey < data.length; this.lastKey += 1) {
    // inject the row key into the object
    data[this.lastKey].ojKey = this.lastKey.toString();
  }
};
/**
 * Get the column headers from the data, if it is an array of arrays with no row header key set,
 * gets the column number as the column header.
 * @param {Object} data the data to extract the column information.
 * @return {Array} the columns extracted from the data.
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._getColumnsForScaffolding = function (data) {
  if (typeof data.length !== 'number' || data.length === 0) {
    return [];
  }

  var columns = [];
  var propertyNames = Object.keys(data[0]);

  for (var i = 0; i < propertyNames.length; i++) {
    var propertyName = propertyNames[i];

    if (!(this.rowHeaderKey !== undefined && propertyName === this.rowHeaderKey)) {
      columns.push(propertyName);
    }
  }

  return columns;
};
/**
 * Returns the total number of rows or columns.  If the value return is not >= 0 then it is automatically assumed
 * that the total count is unknown.
 * @param {string} axis the axis in which we inquire for the total count.  Valid values are "row" and "column".
 * @return {number} the total number of rows/columns.
 * @export
 * @method
 * @instance
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype.getCount = function (axis) {
  if (axis === 'row') {
    return this._size();
  }

  if (axis === 'column') {
    return this.columns.length;
  }

  return 0;
};
/**
 * Returns whether the total count returned in getCount function is an actual or an estimate.
 * @param {string} axis the axis in which we inquire whether the total count is an estimate.  Valid values are
 *        "row" and "column".
 * @return {string} "exact" if the count returned in getCount function is the actual count, "estimate" if the
 *         count returned in getCount function is an estimate. The default value is "exact".
 * @export
 * @method
 * @instance
 * @memberof oj.ArrayDataGridDataSource
 */
// eslint-disable-next-line no-unused-vars


oj.ArrayDataGridDataSource.prototype.getCountPrecision = function (axis) {
  return 'exact';
};
/**
 * Retrieve the data for the header of a specified index.
 * @param {string} axis the axis of the header.  Valid values are "row" and "column".
 * @param {number} index the index in which to get the data.
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._getHeaderData = function (axis, index) {
  if (axis === 'row') {
    if (this.rowHeaderKey === undefined) {
      return null;
    } else if (this.rowHeaderKey === 'm_defaultIndex') {
      // generate data by index
      return this._getRowKeyByIndex(index);
    }

    var data = this.getDataArray();
    return data[index][this.rowHeaderKey];
  } else if (axis === 'column') {
    return this.columns[index];
  }

  return undefined;
};
/**
 * Retrieve the metadata for the header of a specified index.
 * @param {string} axis the axis of the header.  Valid values are "row" and "column".
 * @param {number} index the index in which to get the metadata.
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._getHeaderMetadata = function (axis, index) {
  var key;

  if (axis === 'row') {
    return {
      key: this._getRowKeyByIndex(index)
    };
  } else if (axis === 'column') {
    key = this._getHeaderData(axis, index);

    if (this.sortCriteria != null && this.sortCriteria.key === key) {
      return {
        key: this._getHeaderData(axis, index),
        sortDirection: this.sortCriteria.direction
      };
    }

    return {
      key: key
    };
  }

  return undefined;
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
 * @memberof oj.ArrayDataGridDataSource
 * @return {undefined}
 */


oj.ArrayDataGridDataSource.prototype.fetchHeaders = function (headerRange, callbacks, callbackObjects) {
  var axis = headerRange.axis;
  var start = headerRange.start;
  var end;
  var count = headerRange.count;
  start = Math.max(0, start);

  if (axis === 'column') {
    if (!this.columns.length) {
      this._populateColumns();
    }

    end = Math.min(this.columns.length, start + count);
  } else {
    var data = this.getDataArray(); // check if no row header is available

    if (this.rowHeaderKey === undefined) {
      // header count = 0
      end = start;
    } else {
      end = Math.min(data.length, start + count);
    }
  }

  var headerSet = new oj.ArrayHeaderSet(start, end, axis, this);

  if (callbacks != null && callbacks.success != null) {
    // make sure callbackObjects is not null
    if (callbackObjects == null) {
      // eslint-disable-next-line no-param-reassign
      callbackObjects = {};
    }

    callbacks.success.call(callbackObjects.success, headerSet, headerRange, null);
  }
};
/**
 * Retrieve the data for the cell of a specified indexes.
 * @param {number} row the row index in which to get the data.
 * @param {number} column the column index in which to get the data.
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._getCellData = function (row, column) {
  var col = this.columns[column];
  return this.getDataArray()[row][col];
};
/**
 * Retrieve the data for the cell of a specified indexes.
 * @param {number} row the row index in which to get the data.
 * @param {number} column the column index in which to get the data.
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._setCellData = function (row, column, newValue) {
  this.getDataArray()[row][this.columns[column]] = newValue;
};
/**
 * Retrieve the metadata for the cell of a specified indexes.
 * @param {number} row the row index in which to get the data.
 * @param {number} column the column index in which to get the data.
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._getCellMetadata = function (row, column) {
  var keys = {
    row: this._getRowKeyByIndex(row),
    column: this.columns[column]
  };
  return {
    keys: keys
  };
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
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype.fetchCells = function (cellRanges, callbacks, callbackObjects) {
  var rowStart;
  var rowEnd;
  var colStart;
  var colEnd; // extract the start and end row/column info from cellRanges (there should only be two, one for each axis)

  for (var i = 0; i < cellRanges.length; i += 1) {
    var cellRange = cellRanges[i];

    if (cellRange.axis === 'row') {
      rowStart = cellRange.start;
      rowEnd = Math.min(this._size(), rowStart + cellRange.count);
    } else if (cellRange.axis === 'column') {
      if (!this.columns.length) {
        this._populateColumns();
      }

      colStart = cellRange.start;
      colEnd = Math.min(this.columns.length, colStart + cellRange.count);
    }
  } // check for errors


  if (rowEnd === undefined || colEnd === undefined) {
    if (callbacks != null && callbacks.error != null) {
      // make sure callbackObjects is not null
      if (callbackObjects == null) {
        // eslint-disable-next-line no-param-reassign
        callbackObjects = {};
      }

      callbacks.error.call(callbackObjects.error);
    }

    return;
  }

  var cellSet = new oj.ArrayCellSet(rowStart, rowEnd, colStart, colEnd, this);

  if (callbacks != null && callbacks.success != null) {
    // make sure callbackObjects is not null
    if (callbackObjects == null) {
      // eslint-disable-next-line no-param-reassign
      callbackObjects = {};
    }

    callbacks.success.call(callbackObjects.success, cellSet, cellRanges);
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
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype.keys = function (indexes) {
  var rowIndex = indexes.row;
  var columnIndex = indexes.column;
  return new Promise(function (resolve) {
    resolve({
      row: this._getRowKeyByIndex(rowIndex),
      column: this.columns[columnIndex]
    });
  }.bind(this));
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
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype.indexes = function (keys) {
  var rowKey = keys.row;
  var columnKey = keys.column;
  return new Promise(function (resolve) {
    resolve({
      row: this._getRowIndexByKey(rowKey),
      column: this.columns.indexOf(columnKey)
    });
  }.bind(this));
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
 * @memberof oj.ArrayDataGridDataSource
 * @return {undefined}
 */


oj.ArrayDataGridDataSource.prototype.sort = function (criteria, callbacks, callbackObjects) {
  var sortArray = [];
  var newColumns = []; // make sure callbackObjects is non null

  if (callbacks != null && callbackObjects == null) {
    // eslint-disable-next-line no-param-reassign
    callbackObjects = {};
  } // keep a copy of the original unsorted array.  Both array and observable array have slice method.


  if (this.origData === undefined) {
    this._origSortCriteria = this.sortCriteria;
    this.origData = this.data.slice();
  }

  if (criteria == null) {
    // eslint-disable-next-line no-param-reassign
    criteria = this.sortCriteria;
  } else {
    this.sortCriteria = criteria;
  } // reset sort order if no criteria is set in the call or as a property


  if (criteria == null) {
    this._resetSortOrder(callbacks, callbackObjects);

    return;
  }

  var axis = criteria.axis;
  var headerKey = criteria.key;

  if (axis === 'column') {
    this.getDataArray().sort(this._getComparator());

    if (callbacks != null && callbacks.success != null) {
      callbacks.success.call(callbackObjects.success);
    }
  } else if (axis === 'row') {
    var headerIndex = this._getRowIndexByKey(headerKey); // rebuild the array to sort on


    var i;

    for (i = 0; i < this.columns.length; i += 1) {
      sortArray[i] = this.getDataArray()[headerIndex][this.columns[i]];
    } // sort the given array with no headerKey specified


    sortArray.sort(this._getComparator()); // reorder the columns property

    for (i = 0; i < this.columns.length; i += 1) {
      newColumns[i] = this.columns[sortArray.indexOf(this.getDataArray()[headerIndex][this.columns[i]])];
    } // keep a copy of the original column order.


    this.origColumns = this.columns;
    this.columns = newColumns;

    if (callbacks != null && callbacks.success != null) {
      callbacks.success.call(callbackObjects.success);
    }
  } else if (callbacks !== null && callbacks.error != null) {
    callbacks.error.call(callbackObjects.error, 'Invalid axis value');
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
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._resetSortOrder = function (callbacks, callbackObjects) {
  // reset data to the unsorted array
  if (this.origData !== undefined) {
    this.data = this.origData;
    this.sortCriteria = this._origSortCriteria;
  } // reset column order if row header was sorted before


  if (this.origColumns != null) {
    this.columns = this.origColumns;
  }

  if (callbacks != null && callbacks.success != null) {
    callbacks.success.call(callbackObjects.success);
  }
};
/**
 * Determines whether this ArrayDataGridDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort" and "move"
 * @return {string|null} the name of the feature.  For sort, the valid return values are: "full", "none".  Returns null if the
 *         feature is not recognized.
 * @export
 * @method
 * @instance
 * @memberof oj.ArrayDataGridDataSource
*/


oj.ArrayDataGridDataSource.prototype.getCapability = function (feature) {
  if (feature === 'sort') {
    // array based data source supports column sorting only
    return 'column';
  }

  if (feature === 'move') {
    return 'row';
  }

  return null;
};
/**
 * Get the sort comparator either from the property or the internal one in natural sort
 * @returns {function(Object, Object)|undefined} a comparator function, dependent on direction
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._getComparator = function () {
  var comparator = this.comparator;

  if (comparator == null) {
    var key = this.sortCriteria.key;
    var direction = this.sortCriteria.direction;
    var axis = this.sortCriteria.axis;
    return this._naturalSort(direction, key, axis);
  }

  return comparator;
};
/**
 * Get a comparator function for natural sorting of objects
 * @param {string} direction ascending, descending
 * @param {string|number} key the key or index to perform the sort on
 * @param {string} axis
 * @returns {function(Object, Object)|undefined} a comparator function, dependent on direction
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._naturalSort = function (direction, key, axis) {
  if (direction === 'ascending') {
    return function (_a, _b) {
      var as;
      var bs;
      var a = _a;
      var b = _b; // Get the values the array we're sorting

      if (key != null && axis === 'column') {
        // if the sorting item is an array it will be indexed with strings of ints and needs
        // to be accessed using ints not strings
        if (a instanceof Array) {
          a = a[parseInt(key, 10)];
          b = b[parseInt(key, 10)];
        } else {
          a = a[key];
          b = b[key];
        }
      } // Strings of numbers return false, so we can compare strings of numbers with numbers


      as = isNaN(a);
      bs = isNaN(b); // If they are strings, check to see if they are dates, if they are, turn the string to a sortable date formatted string

      if (a instanceof Date) {
        a = a.toISOString();
        as = true;
      }

      if (b instanceof Date) {
        b = b.toISOString();
        bs = true;
      } // both are string


      if (as && bs) {
        if (a < b) {
          return -1;
        } else if (a === b) {
          return 0;
        }

        return 1;
      } // only a is a string


      if (as) {
        return 1;
      } // only b is a string


      if (bs) {
        return -1;
      } // both are numbers


      return a - b;
    };
  }

  if (direction === 'descending') {
    return function (_a, _b) {
      var as;
      var bs;
      var a = _a;
      var b = _b;

      if (key != null && axis === 'column') {
        // if the sorting item is an array it will be indexed with strings of ints and needs
        // to be accessed using ints not strings
        if (a instanceof Array) {
          a = a[parseInt(key, 10)];
          b = b[parseInt(key, 10)];
        } else {
          a = a[key];
          b = b[key];
        }
      }

      as = isNaN(a);
      bs = isNaN(b);

      if (a instanceof Date) {
        a = a.toISOString();
        as = true;
      }

      if (b instanceof Date) {
        b = b.toISOString();
        bs = true;
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
  } // only if direction is not recognized


  return undefined;
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
 * @memberof oj.ArrayDataGridDataSource
 * @return {undefined}
 */


oj.ArrayDataGridDataSource.prototype.move = function ( // eslint-disable-next-line no-unused-vars
rowToMove, referenceRow, position, callbacks, callbackObjects) {
  var atKeyIndex;
  var event; // remove the data from the array, but hold on to it

  var moveKeyIndex = this._getRowIndexByKey(rowToMove);

  var moveData = this.data.splice(moveKeyIndex, 1)[0]; // fire the delete event to the datagrid

  if (this.data instanceof Array) {
    event = this._getModelEvent('delete', rowToMove, null, moveKeyIndex, -1, true);
    this.handleEvent('change', event);
  } // add the stored data back into the array


  if (referenceRow === null) {
    this.data.push(moveData);
    atKeyIndex = this.data.length - 1;
  } else {
    atKeyIndex = this._getRowIndexByKey(referenceRow);
    this.data.splice(atKeyIndex, 0, moveData);
  } // fire the insert event to the datagrid


  if (this.data instanceof Array) {
    event = this._getModelEvent('insert', rowToMove, null, atKeyIndex, -1);
    this.handleEvent('change', event);
  } // if we keep track of original data, we'll need to update it


  if (this.origData !== undefined) {
    // note that once a row is moved then the current sort order is the new unsorted order
    this.origData = this.data.slice();
  }
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
 * @memberof oj.ArrayDataGridDataSource
*/
// eslint-disable-next-line no-unused-vars


oj.ArrayDataGridDataSource.prototype.moveOK = function (rowToMove, referenceRow, position) {
  return 'valid';
};
/**
 * Gets the data array, if the data property is a function call it, else return data
 * @return {Object|Array} the array of the data
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype.getDataArray = function () {
  if (typeof this.data === 'function') {
    return this.data();
  }

  return this.data;
};
/**
 * Gets the row index of a given row key
 * @param {any} key the key to get row index of
 * @return {number} the index with a certain key, -1 if the key doesn't exist
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._getRowIndexByKey = function (key) {
  var data = this.getDataArray();

  for (var i = 0; i < data.length; i++) {
    if (data[i].ojKey === key) {
      return i;
    }
  }

  return -1;
};
/**
 * Gets the row key stored at a given index
 * @param {number} index the index to get row key of
 * @return {string|number|null} the key at index, null if the index doesn't exist
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._getRowKeyByIndex = function (index) {
  var data = this.getDataArray();

  if (data[index]) {
    if (!data[index].ojKey) {
      this._initializeRowKeys();
    }

    return data[index].ojKey;
  }

  return null;
};
/**
 * Returns an Object for an event
 * @param {string} operation the operation done on the model
 * @param {any} rowKey the key for the row axis
 * @param {any} columnKey the key for the column axis
 * @param {number=} rowIndex the index for the row axis
 * @param {number=} columnIndex the index for the column axis
 * @param {boolean=} silent should the event be silent
 * @return {Object} an object containing the the source, operation, and keys of the event
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._getModelEvent = function (operation, rowKey, columnKey, rowIndex, columnIndex, silent) {
  var event = {};
  event.source = this;
  event.operation = operation;
  event.keys = {
    row: rowKey,
    column: columnKey
  };
  event.indexes = {
    row: rowIndex,
    column: columnIndex
  };
  event.silent = silent;
  return event;
};
/**
 * Subscribe to knockout events
 * @param {Array} changes an array of change objects fired by an observable array
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._subscribe = function (changes) {
  var i;
  var added = false;
  var move = false;
  var change;
  var event; // first loop though the changes,

  for (i = 0; i < changes.length; i++) {
    change = changes[i]; // if a model was moved using a reverseAll or a sort, just refresh the grid

    if (change.moved !== undefined) {
      move = true;
      event = this._getModelEvent('refresh', null, null);
      this.handleEvent('change', event);
      break;
    } // check if there were any adds, this way the delete will know to be fired silently


    if (change.status === 'added') {
      added = true;
    }
  } // if we moved a model we just refreshed


  if (!move) {
    var rowData;
    var rowKey;
    var rowIndex;
    var keys = [];
    var indexes = []; // loop through changes looking for deletes

    for (i = 0; i < changes.length; i++) {
      change = changes[i];

      if (change.status === 'deleted') {
        rowData = change.value;
        rowIndex = change.index;
        rowKey = rowData.ojKey; // collect the deletes to do in one batch delete

        keys.push({
          row: rowKey,
          column: -1
        });
        indexes.push({
          row: rowIndex,
          column: -1
        });
      }
    } // batch delete all deletes


    if (keys.length > 0) {
      event = {
        source: this,
        operation: 'delete',
        keys: keys,
        indexes: indexes,
        silent: added
      };
      this.handleEvent('change', event);
    } // loop through changes looking for adds


    for (i = 0; i < changes.length; i++) {
      change = changes[i];

      if (change.status === 'added') {
        rowData = change.value;
        rowIndex = change.index; // if no key add inject one into the add object based on the last assigned key

        if (rowData.ojKey == null) {
          rowData.ojKey = this.lastKey.toString();
          this.lastKey += 1;
        } // add at the given index and remove from the end of the page silently


        rowKey = rowData.ojKey;
        event = this._getModelEvent('insert', rowKey, null, rowIndex, -1);
        this.handleEvent('change', event);
      }
    }
  } // if we keep track of original data, we'll need to update it


  if (this.origData !== undefined) {
    // note that once the observable array is updated then the current sort order is the new unsorted order
    this.origData = this.data.slice();
  }
};
/**
 * Get the length of the collection. -1 if an initial fetch has not been
 * done yet. Default to the size of the collection. If pageSize is set then
 * limit it.
 * @returns {number} length of the collection
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._size = function () {
  return this.getDataArray().length;
}; // ////// testing methods to get properties /////////

/**
 * Gets the rowHeaderKey property.  This is an internal method for testing and should not be used by application.
 * @return {string|null} the row header key
 * @export
 * @ignore
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype.getRowHeaderKey = function () {
  return this.rowHeaderKey;
};
/**
 * Gets the columns property.  This is an internal method for testing and should not be used by application.
 * @return {Array|null} the keys of the column headers
 * @export
 * @ignore
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype.getColumns = function () {
  return this.columns;
};
/**
 * Gets the data property.  This is an internal method for testing and should not be used by application.
 * @return {Array|Object|null} the underlying array data.
 * @export
 * @ignore
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype.getData = function () {
  return this.data;
};
/**
 * Populate columns from data Array.
 * @private
 * @memberof oj.ArrayDataGridDataSource
 */


oj.ArrayDataGridDataSource.prototype._populateColumns = function () {
  if (this.getDataArray().length) {
    var columnLength = this.getDataArray()[0].length;

    for (var i = 0; i < columnLength; i++) {
      this.columns.push(i.toString());
    }
  }
};



/**
 * @class oj.ArrayHeaderSet
 * @classdesc A HeaderSet represents a collection of headers.  The HeaderSet is an object returned by the success callback
 * of the fetchHeaders method on DataGridDataSource.  This implementation of HeaderSet is used by the
 * ArrayDataGridDataSource.
 * @param {number} start the absolute start index of the header set.
 * @param {number} end the absolute end index of the header set.
 * @param {string} axis the axis of the header, value is either 'row' or 'column'.
 * @param {Object} callback the callback to invoke on to retrieve data and metadata.
 * @constructor
 * @since 1.0
 * @export
 * @hideconstructor
 * @ojtsignore
 * @see oj.ArrayDataGridDataSource
 */
oj.ArrayHeaderSet = function (start, end, axis, callback) {
  this.m_start = start;
  this.m_end = end;
  this.m_axis = axis;
  this.m_callback = callback;
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
 * @memberof oj.ArrayHeaderSet
 */


oj.ArrayHeaderSet.prototype.getData = function (index, level) {
  if (this.m_callback == null) {
    return null;
  } // make sure index/level are valid


  oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds');
  oj.Assert.assert(level == null || level === 0, 'level out of bounds');
  return this.m_callback._getHeaderData(this.m_axis, index);
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
 * @memberof oj.ArrayHeaderSet
 */


oj.ArrayHeaderSet.prototype.getMetadata = function (index, level) {
  if (this.m_callback == null) {
    return null;
  } // make sure index/level are valid


  oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds');
  oj.Assert.assert(level == null || level === 0, 'level out of bounds');
  return this.m_callback._getHeaderMetadata(this.m_axis, index);
};
/**
 * Gets the actual number of levels of the result set for the specified axis. The levels
 * are the counted from the outermost header indexed at 0, and moving inwards toward the
 * databody would increment the level by 1. The Array case only supports level count of 1.
 * @return {number} the number of levels of the result set
 * @export
 * @expose
 * @method
 * @instance
 * @memberof oj.ArrayHeaderSet
 */


oj.ArrayHeaderSet.prototype.getLevelCount = function () {
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
 * @memberof oj.ArrayHeaderSet
 */


oj.ArrayHeaderSet.prototype.getExtent = function (index, level) {
  oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds');
  oj.Assert.assert(level == null || level === 0, 'level out of bounds');
  return {
    extent: 1,
    more: {
      before: false,
      after: false
    }
  };
};
/**
 * Gets the depth of an index starting at a particular level. The depth is the number
 * of levels spanned by the header. The Array case only supports depth of 1.
 * @param {number} index the absolute index of the depth to get
 * @param {number=} level the level of the header, 0 is the outermost header
 * @return {number} the number of levels spanned by the header at the specified position
 * @export
 * @expose
 * @method
 * @instance
 * @memberof oj.ArrayHeaderSet
 */


oj.ArrayHeaderSet.prototype.getDepth = function (index, level) {
  oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds');
  oj.Assert.assert(level == null || level === 0, 'level out of bounds');
  return 1;
};
/**
 * Gets the label for the level along the axis of that header. Specify null to have no header labels.
 * @param {number} level the header level to retrieve the label data for
 * @return {*} the data for the header label
 * @export
 * @expose
 * @method
 * @instance
 * @memberof oj.ArrayHeaderSet
 */


oj.ArrayHeaderSet.prototype.getLabel = function () {
  return null;
};
/**
 * Gets the actual count of the result set, the total indexes spanned by the headerSet
 * along the innermost header.
 * @return {number} the actual count of the result set.
 * @export
 * @expose
 * @method
 * @instance
 * @memberof oj.ArrayHeaderSet
 */


oj.ArrayHeaderSet.prototype.getCount = function () {
  if (this.m_callback == null) {
    return 0;
  }

  return Math.max(0, this.m_end - this.m_start);
};
/**
 * Gets the start index of the result set.
 * @return {number} the start index of the result set.
 * @export
 * @ignore
 * @memberof oj.ArrayHeaderSet
 * @method
 * @instance
 */


oj.ArrayHeaderSet.prototype.getStart = function () {
  return this.m_start;
};


// Define a mapping variable that maps the return value of the module to the name used in the callback function of a require call.
var ArrayDataGridDataSource = {};
ArrayDataGridDataSource.ArrayDataGridDataSource = oj.ArrayDataGridDataSource;
ArrayDataGridDataSource.ArrayHeaderSet = oj.ArrayHeaderSet;
ArrayDataGridDataSource.ArrayCellSet = oj.ArrayCellSet;

  return ArrayDataGridDataSource;
});