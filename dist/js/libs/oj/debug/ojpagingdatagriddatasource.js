/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojpagingtabledatasource'], function(oj, $)
{
/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * A HeaderSet represents a collection of headers. The HeaderSet is an object returned by the success callback
 * of the fetchHeaders method on DataGridDataSource. This is a paging specific implementation of the HeaderSet.
 * @param {Object} headerSet an headerSet object
 * @param {number} startIndex the true startIndex of the headerSet
 * @constructor
 * @export
 */
oj.PagingHeaderSet = function(headerSet, startIndex)
{
    this.m_headerSet = headerSet;
    this.m_startIndex = startIndex;
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds. 
 * @param {number} index the absolute index of the header in which we want to retrieve the header from.  
 * @param {number=} level the level of the header, 0 is the outermost header and increments by 1 moving inward
 * @return {Object} the data object for the specific index.
 * @export
 */
oj.PagingHeaderSet.prototype.getData = function(index, level)
{
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
 */
oj.PagingHeaderSet.prototype.getMetadata = function(index, level)
{
    return this.m_headerSet.getMetadata(index + this.m_startIndex, level);
};

/**
 * Gets the actual count of the result set, the total indexes spanned by the headerSet
 * along the innermost header.
 * @return {number} the actual count of the result set.  
 * @export
 */
oj.PagingHeaderSet.prototype.getCount = function()
{
    return this.m_headerSet.getCount();
};

/**
 * Gets the actual number of levels of the result set for the specified axis. The levels
 * are the counted from the outermost header indexed at 0, and moving inwards toward the 
 * databody would increment the level by 1.
 * @return {number} the number of levels of the result set
 * @export
 */
oj.PagingHeaderSet.prototype.getLevelCount = function()
{
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
 */
oj.PagingHeaderSet.prototype.getExtent = function(index, level)
{
     return this.m_headerSet.getExtent(index + this.m_startIndex, level);
};
 
/**
 * Gets the depth of an index starting at a particular level. The depth is the number 
 * of levels spanned by the header.
 * @param {number} index the absolute index of the depth to get
 * @param {number=} level the level of the header, 0 is the outermost header
 * @return {number} the number of levels spanned by the header at the specified position
 * @export
 */
oj.PagingHeaderSet.prototype.getDepth = function(index, level)
{
     return this.m_headerSet.getDepth(index + this.m_startIndex, level);
};

/**
 * For internal testing purposes. Gets the underlying headerSet.
 * @return {Object} the underlying headerSet
 * @export
 * @ignore
 */
oj.PagingHeaderSet.prototype.getHeaderSet = function()
{
    return this.m_headerSet;
};

/**
 * For internal testing purposes. Gets the start index.
 * @return {number} the start index
 * @export
 * @ignore
 */
oj.PagingHeaderSet.prototype.getStartIndex = function()
{
    return this.m_startIndex;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
/**
 * @export
 * @class oj.PagingDataGridDataSource
 * @classdesc Object representing data used by the paging component
 * @param {oj.DataGridDataSource|null} dataSource
 * @param {Object|null} options Array of options for the PagingControlDataSource
 * @extends oj.DataGridDataSource
 * @implements oj.PagingModel
 * @constructor
 */
oj.PagingDataGridDataSource = function(dataSource, options)
{
    // Initialize
    if (!(dataSource instanceof oj.DataGridDataSource))
    {
        // we only support Array, oj.Collection, or ko.observableArray. To
        // check for observableArray, we can't do instanceof check because it's
        // a function. So we just check if it contains a subscribe function.
        throw new oj.Message('Not a datagridatasource', 'Not a datagridatasource', oj.Message.SEVERITY_LEVEL['ERROR']);
    }
    this.dataSource = dataSource;
    this._startIndex = 0;
    this.Init();
};

// Subclass from oj.DataSource 
oj.Object.createSubclass(oj.PagingDataGridDataSource, oj.DataGridDataSource, "oj.PagingDataGridDataSource");

/**
 * Initializes the instance.
 * @export
 */
oj.PagingDataGridDataSource.prototype.Init = function()
{
    oj.PagingDataGridDataSource.superclass.Init.call(this);
    this._registerEventListeners();
};

/**
 * Register event handlers on the underlying datasource.
 * @private
 */
oj.PagingDataGridDataSource.prototype._registerEventListeners = function()
{
    this.dataSource.on("change", this._handleChange.bind(this));
};

/**
 * Get the current page
 * @return {number} The current page
 * @export
 */
oj.PagingDataGridDataSource.prototype.getPage = function()
{
  return this._page;
};

/**
 * Set the current page
 * @param {number} value The current page
 * @param {Object=} options Options<p>
 *                  pageSize: The page size.<p>
 * @export
 */
oj.PagingDataGridDataSource.prototype.setPage = function(value, options)
{
  options = options || {};
  value = parseInt(value, 10);
  
  try 
  {
    oj.PagingDataGridDataSource.superclass.handleEvent.call(this, oj.PagingModel.EventType['BEFOREPAGE'], {'page' : value, 'previousPage' : this._page});
  }
  catch (err)
  {
    return Promise.reject(null);
  }
  
  this._pageSize = options['pageSize'] != null ? options['pageSize'] : this._pageSize;
  options['startIndex'] = value * this._pageSize;
  var previousPage = this._page;
  this._page = value;
  this._startIndex = options['startIndex'];
  var self = this;
  
  return new Promise(function(resolve, reject)
  {
    self._fetchInternal(options).then(function(result)
    {
      resolve(null);
    }, function (error)
    {
      // restore old page
      self._page = previousPage;
      self._startIndex = self._page * self._pageSize;
      reject(null);  
    });
  });
};

/**
 * Calls fetch on the datasource with paging options.
 * @private
 */
oj.PagingDataGridDataSource.prototype._fetchInternal = function(options)
{
    this._initialized = true;
    this._startIndex = options['startIndex'];
    
    var self = this;
    return new Promise(function(resolve, reject) {
        self.handleEvent("change", {'operation': 'sync', 'pageSize': self._pageSize});  
        resolve(undefined);
    });
};

/**
 * Calls fetch on the datasource with paging options.
 * @param {Object=} options Options to control fetch
 * @param {number} options.startIndex The index at which to start fetching records.
 * @param {boolean} options.silent If set, do not fire a sync event.
 * @return {Promise} Promise object resolves when done
 * @export
 * @expose
 * @memberof! oj.PagingDataGridDataSource
 * @instance
 */
oj.PagingDataGridDataSource.prototype.fetch = function(options)
{
    this._pageSize = options['pageSize'] + options['startIndex'];
    options['startIndex'] = 0;
    return this._fetchInternal(options);
};

/**
 * Get the current page start index
 * @return {number} The current page start index
 * @export
 */
oj.PagingDataGridDataSource.prototype.getStartItemIndex = function()
{
  return this._startIndex;
};

/**
 * Get the current page end index
 * @return {number} The current page end index
 * @export
 */
oj.PagingDataGridDataSource.prototype.getEndItemIndex = function()
{
  return this._endIndex;
};

/**
 * Get the page count
 * @return {number} The total number of pages
 * @export
 */
oj.PagingDataGridDataSource.prototype.getPageCount = function()
{
  var totalSize = this.totalSize();
  return totalSize == -1 ? -1 : Math.ceil(totalSize / this._pageSize);
};

/**
 * Handle data grid change events
 * @param {Object} options the options associated with the oj.DataGridDataSource event.
 * @private
 */
oj.PagingDataGridDataSource.prototype._handleChange = function(options) {
    var operation;
    operation = options['operation'];
    switch(operation)
    {
        case 'refresh':
            this._startIndex = 0;
            // pass the refresh event through to the data grid and the paging control
            this.handleEvent("change", {'operation': 'sync', 'pageSize': this._pageSize});  
            this.handleEvent(oj.PagingTableDataSource.EventType['REFRESH'], null);
            break;
        case 'reset':
            // the paging control will set a new startIndex and kick off a fecth here
            this.handleEvent(oj.PagingTableDataSource.EventType['RESET'], null);
            break;
        case 'insert':
            this.handleEvent(oj.PagingTableDataSource.EventType['ADD'], {'index':options['indexes']['row']});
            break;
        case 'delete':
            this.handleEvent(oj.PagingTableDataSource.EventType['REMOVE'], null);
            break;
        case 'update':
            options['indexes']['row'] = options['indexes']['row'] - this._startIndex >= 0 ? options['indexes']['row'] - this._startIndex : -1;
            this.handleEvent("change", options);
            break;
        default:
            this.handleEvent('change', options);
            this.handleEvent(oj.PagingTableDataSource.EventType['SYNC'], null);
    }
};

/**** start delegated functions ****/
/**
 * Returns the total number of rows or columns.  If the value return is not >= 0 then it is automatically assumed
 * that the total count is unknown. In the case of paging returns the total number of rows/colums on the page.
 * @param {string} axis the axis in which we inquire for the total count.  Valid values are "row" and "column".
 * @return {number} the total number of rows/columns.
 * @export
 */
oj.PagingDataGridDataSource.prototype.getCount = function(axis)
{
    var count = this.dataSource.getCount(axis);
    if (axis === 'row' && count >= 0)
    {
        if (this._startIndex + this._pageSize < count)
        {
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
 *         count returned in getCount function is an estimate.  The default value is "actual".
 * @export
 */
oj.PagingDataGridDataSource.prototype.getCountPrecision = function(axis)
{
    return this.dataSource.getCountPrecision(axis);
};

/**
 * Fetch a range of headers from the data source.
 * @param {Object} headerRange information about the header range, it must contain the following properties:
 *        axis, start, count.
 * @param {string} headerRange.axis the axis of the header that are fetched.  Valid values are "row" and "column".
 * @param {number} headerRange.start the start index of the range in which the header data are fetched.
 * @param {number} headerRange.count the size of the range in which the header data are fetched.  
 * @param {Object} callbacks the callbacks to be invoke when fetch headers operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(HeaderSet)} callbacks.success the callback to invoke when fetch headers completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @export
 */
oj.PagingDataGridDataSource.prototype.fetchHeaders = function(headerRange, callbacks, callbackObjects)
{
    var headerSet;
    if (this._initialized == null)
    {
        headerSet = new oj.ArrayHeaderSet(0, 0, headerRange.axis, null);
        if (callbacks != null && callbacks['success'])
        {
            callbacks['success'].call(callbackObjects['success'], headerSet, headerRange);
        }
    }
    else
    {
        if (headerRange['axis'] === 'row')
        {
            headerRange['start'] += this._startIndex;            
            if (headerRange['start'] + headerRange['count'] > this._startIndex + this._pageSize)
            {
                headerRange['count'] = this._pageSize - headerRange['start'];
            }
            this._pendingRowHeaderCallback = {'callbacks': callbacks, 'callbackObjects': callbackObjects};
            this.dataSource.fetchHeaders(headerRange, {success: this._handleRowHeaderFetchSuccess.bind(this), error: this._handleRowHeaderFetchError.bind(this)}, callbackObjects);
        }
        else
        {
            this.dataSource.fetchHeaders(headerRange, callbacks, callbackObjects);
        }
    }
};

/**
 * Handle row headers fetch success by adjusting startIndex back to 0 and passing a PagingHeaderSet
 * @param {Object} headerSet a cellSet object
 * @param {Object} headerRange
 * @private
 */
oj.PagingDataGridDataSource.prototype._handleRowHeaderFetchSuccess = function(headerSet, headerRange)
{
    var pagingHeaderSet, callback, callbackObject;
    headerRange['start'] -= this._startIndex;
    // make the datagrid not issue any extra fetches
    headerRange['count'] += 1;
    pagingHeaderSet = new oj.PagingHeaderSet(headerSet, this._startIndex);
    
    // clear callback before calling it because it may issue a refetch
    callback = this._pendingRowHeaderCallback['callbacks']['success'];
    callbackObject = this._pendingRowHeaderCallback['callbackObjects']['success'];
    this._pendingRowHeaderCallback = null;
    callback.call(callbackObject, pagingHeaderSet, headerRange);
};

/**
 * Handle row header fetch error
 * @param {Object} error error
 * @private
 */
oj.PagingDataGridDataSource.prototype._handleRowHeaderFetchError = function(error)
{
    var callback, callbackObject;
    // clear callback before calling it because it may issue a refetch
    callback = this._pendingRowHeaderCallback['callbacks']['error'];
    callbackObject = this._pendingRowHeaderCallback['callbackObjects']['error'];
    this._pendingRowHeaderCallback = null;
    callback.call(callbackObject, error);
};

/**
 * Fetch a range of cells from the data source.
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array 
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @param {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid 
 *        values are "row" and "column".
 * @param {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @param {number} cellRanges.count the size of the range for this axis in which the cells are fetched. 
 * @param {Object} callbacks the callbacks to be invoke when fetch cells operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(CellSet)} callbacks.success the callback to invoke when fetch cells completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @export
 */
oj.PagingDataGridDataSource.prototype.fetchCells = function(cellRanges, callbacks, callbackObjects)
{
    var cellSet, i; 
    if (this._initialized == null)
    {
        cellSet = new oj.ArrayCellSet(0, 0, 0, 0, null);
        if (callbacks != null && callbacks['success'])
        {
            callbacks['success'].call(callbackObjects['success'], cellSet, cellRanges);
        }
    }
    else
    {
        for (i=0; i<cellRanges.length; i+=1)
        {
            if (cellRanges[i]['axis'] === 'row')
            {
                cellRanges[i]['start'] += this._startIndex;
                if (cellRanges[i]['start'] + cellRanges[i]['count'] > this._startIndex + this._pageSize)
                {
                    cellRanges[i]['count'] = this._pageSize - cellRanges[i]['start'];
                }
            }        
        }
        this._pendingCellCallback = {'callbacks': callbacks, 'callbackObjects': callbackObjects}
        this.dataSource.fetchCells(cellRanges, {success: this._handleCellsFetchSuccess.bind(this), error: this._handleCellsFetchError.bind(this)}, callbackObjects);
    }
};

/**
 * Handle cell fetch success by adjusting the row startIndex and passing the PagingCellSet
 * @param {Object} cellSet a cellSet object
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array 
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @param {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid 
 *        values are "row" and "column".
 * @param {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @private
 */
oj.PagingDataGridDataSource.prototype._handleCellsFetchSuccess = function(cellSet, cellRanges)
{
    var i, pagedCellSet, callback, callbackObject;
    for (i=0; i<cellRanges.length; i+=1)
    {
        if (cellRanges[i]['axis'] === 'row')
        {
            cellRanges[i]['start'] -= this._startIndex;
            // make the datagrid not issue any extra fetches
            cellRanges[i]['count'] += 1;
        }        
    }
    pagedCellSet = new oj.PagingCellSet(cellSet, this._startIndex);
    
    // clear callback before calling it because it may issue a refetch
    callback = this._pendingCellCallback['callbacks']['success'];
    callbackObject = this._pendingCellCallback['callbackObjects']['success'];
    this._pendingCellCallback = null;    
    
    this._endIndex = this._startIndex + cellSet.getCount('row') - 1;
    // tell PC fetchEnd
    this.handleEvent('sync', {'data': new Array(cellSet.getCount('row')), 'startIndex': this._startIndex});
    
    callback.call(callbackObject, pagedCellSet, cellRanges);
};

/**
 * Handle a cell fetch error
 * @param {Object} error error
 * @private
 */
oj.PagingDataGridDataSource.prototype._handleCellsFetchError = function(error)
{
    var callback, callbackObject;
    // clear callback before calling it because it may issue a refetch
    callback = this._pendingCellCallback['callbacks']['error'];
    callbackObject = this._pendingCellCallback['callbackObjects']['error'];
    this._pendingCellCallback = null;
    callback.call(callbackObject,error);    
};

/**
 * Returns the keys based on the indexes. 
 * @param {Object} indexes the index for each axis
 * @param {Object} indexes.row the index for the row axis
 * @param {Object} indexes.column the index for the column axis
 * @return {Object.<Object, Object>} an object containing the keys for each axis
 * @export
 */
oj.PagingDataGridDataSource.prototype.keys = function(indexes)
{
    var pagedIndexes = {'column': indexes['column'], 'row': indexes['row'] + this._startIndex};
    return this.dataSource.keys(pagedIndexes);
};

/**
 * Returns the row and column index based on the keys.
 * @param {Object} keys the key for each axis
 * @param {Object} keys.row the key for the row axis
 * @param {Object} keys.column the key for the column axis
 * @return {Object.<number, number>} indexes an object containing the index for each axis
 * @export
 */
oj.PagingDataGridDataSource.prototype.indexes = function(keys)
{
    var indexes = this.dataSource.indexes(keys);
    if (indexes['row'] != -1)
    {
        indexes['row'] -= this._startIndex;
    }
    return indexes;
};

/**
 * Determines whether this DataGridDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For sort, the valid return values are: "full", "none".  Returns null if the
 *         feature is not recognized.
 * @export
 */
oj.PagingDataGridDataSource.prototype.getCapability = function(feature)
{
    return this.dataSource.getCapability(feature);
};

/**
 * @export
 * Return the size of the data locally in the dataSource. -1 if an initial fetch has not been
 * done yet.
 * @returns {number} size of data
 * @expose
 * @memberof! oj.PagingDataGridDataSource
 * @instance
 */
oj.PagingDataGridDataSource.prototype.size = function()
{
    var count;
    if (this._initialized == null)
    {
        return -1;
    }
    count = this.dataSource.getCount('row')
    if (this.dataSource.getCount('row') > this._pageSize)
    {
        return this._pageSize;
    }
    return count;
};

/**
 * Performs a sort on the data source.
 * @param {Object} criteria the sort criteria. 
 * @param {string} criteria.axis The axis in which the sort is performed, valid values are "row", "column"
 * @param {Object} criteria.key The key that identifies which header to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @param {Object} callbacks the callbacks to be invoke upon completion of the sort operation.  The callback
 *        properties are "success" and "error".
 * @param {function()} callbacks.success the callback to invoke when the sort completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when sort failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" properties.
 * @export
 */
oj.PagingDataGridDataSource.prototype.sort = function(criteria, callbacks, callbackObjects)
{
    this.dataSource.sort(criteria, callbacks, callbackObjects);
};

/**
 * @export
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @expose
 * @memberof! oj.PagingDataGridDataSource
 * @instance
 */
oj.PagingDataGridDataSource.prototype.totalSize = function()
{
    if (this._initialized == null)
    {
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
 * @expose
 * @memberof! oj.PagingDataGridDataSource
 * @instance 
 */
oj.PagingDataGridDataSource.prototype.totalSizeConfidence = function()
{ 
  return "actual";
};

/**
 * Checks whether a move operation is valid.
 * @param {Object} rowToMove the key of the row to move
 * @param {Object} referenceRow the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {string} position The position of the moved row relative to the reference row.  
 *        Valid values are: "before", "after".
 * @return {string} returns "valid" if the move is valid, "invalid" otherwise.
 * @export
 */ 
oj.PagingDataGridDataSource.prototype.moveOK = function(rowToMove, referenceRow, position)
{
    return this.dataSource.moveOK(rowToMove, referenceRow, position);
};

/**
 * Move a model to a new index in the collection, if atKey is null adds to the end
 * @param {Object} moveKey the key of the model that should be moved
 * @param {Object} atKey the key of the model that the moved model should be inserted before or after
 * @param {string} position The position of the moved row relative to the reference row.  
 *        Valid values are: "before", "after" 
 * @param {function()} callbacks.success the callback to invoke when the move completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when move failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" properties.
 * @export
 */
oj.PagingDataGridDataSource.prototype.move = function(moveKey, atKey, position, callbacks, callbackObjects)
{
    this.dataSource.move(moveKey, atKey, position, callbacks, callbackObjects);
};
/**** end delegated functions ****/

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * A CellSet represents a collection of cells.  The CellSet is an object returned by the success callback
 * of the fetchCells method on DataGridDataSource.  The PagingCellSet is a paging specific 
 * implementation of methods on CellSet. 
 * @param {Object} cellSet an cellSet object
 * @param {number} startIndex the true startIndex of the headerSet
 * @constructor
 * @export
 */
oj.PagingCellSet = function(cellSet, startIndex)
{
    this.m_cellSet = cellSet;
    this.m_startIndex = startIndex;
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available 
 * 2) the index specified is out of bounds. 
 * @param {Object} indexes the index of each axis in which we want to retrieve the data from.  
 * @param {number} indexes.row the index of the row axis.
 * @param {number} indexes.column the index of the column axis.
 * @return {Object} the data object for the specified index.
 * @export
 */
oj.PagingCellSet.prototype.getData = function(indexes)
{
    var pagedIndexes = {'column': indexes['column'], 'row': indexes['row'] + this.m_startIndex};
    return this.m_cellSet.getData(pagedIndexes);
};

/**
 * Gets the metadata of the specified index.  An error is throw when 1) the range is not yet available 
 * 2) the index specified is out of bounds. 
 * @param {Object} indexes the index of each axis in which we want to retrieve the metadata from.  
 * @param {number} indexes.row the index of the row axis.
 * @param {number} indexes.column the index of the column axis.
 * @return the metadata object for the specific index.  The metadata that the DataGrid supports are: 
 *         1) keys - the key (of each axis) of the cell.
 * @export
 */
oj.PagingCellSet.prototype.getMetadata = function(indexes)
{
    var pagedIndexes = {'column': indexes['column'], 'row': indexes['row'] + this.m_startIndex};
    return this.m_cellSet.getMetadata(pagedIndexes);
};

/**
 * Gets the actual count of the result set for the specified axis.  Valid values are "row" and "column".
 * @param {string} axis the axis in which to inquire the actual count of the result set.
 * @return {number} the actual count of the result set for the specified axis.  
 * @export
 */
oj.PagingCellSet.prototype.getCount = function(axis)
{
    return this.m_cellSet.getCount(axis);
};

/**
 * For internal testing purposes. Gets the underlying cellSet.
 * @return {Object} the underlying cellSet
 * @export
 * @ignore
 */
oj.PagingCellSet.prototype.getCellSet = function()
{
    return this.m_cellSet;
};

/**
 * For internal testing purposes. Gets the start index.
 * @return {number} the start index
 * @export
 * @ignore
 */
oj.PagingCellSet.prototype.getStartIndex = function()
{
    return this.m_startIndex;
};
});
