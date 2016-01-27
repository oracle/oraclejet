/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojdatasource-common', 'ojs/ojrowexpander'], function(oj, $)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * A HeaderSet represents a collection of headers.  The HeaderSet is an object returned by the success callback
 * of the fetchHeaders method on DataGridDataSource.  This is an OJ collection specific implementation of the HeaderSet.
 * @param {number} start the start index of header set.
 * @param {number} end the end index of the header set.
 * @param {Array} headers the array of headers.  Required for column headers.
 * @param {Object=} nodeSet the node set containing data about the row header.  Required for row headers.
 * @param {string=} rowHeader the id of the row header column.  Required for row headers.
 * @constructor
 * @export
 */
oj.FlattenedTreeHeaderSet = function(start, end, headers, nodeSet, rowHeader)
{
    oj.Assert.assertArrayOrNull(headers);

    this.m_start = start;
    this.m_end = end;
    this.m_headers = headers;
    this.m_nodeSet = nodeSet;
    this.m_rowHeader = rowHeader;
};

/**
 * Gets the data of the specified index.  An error is throw when 1) the range is not yet available and
 * 2) the index specified is out of bounds. 
 * @param {number} index the absolute index of the header in which we want to retrieve the header from.  
 * @param {number=} level the level of the header, 0 is the outermost header and increments by 1 moving inward
 * @return {Object} the data object for the specific index.
 * @export
 */
oj.FlattenedTreeHeaderSet.prototype.getData = function(index, level)
{
    var rowData;

    // make sure index are valid
    oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds'); 
    oj.Assert.assert(level == null || level == 0, 'level out of bounds'); 

    // row or column header
    if (this.m_rowHeader != null && this.m_nodeSet != null)
    {
        rowData = this.m_nodeSet.getData(index - this.m_start + this.m_nodeSet.getStart());
        if (rowData != null)
        {
            if (rowData.get)
            {
                return rowData.get(this.m_rowHeader);
            }
            else
            {
                return rowData[this.m_rowHeader];
            }
        }
        else
        {
            return null;
        }
    }
    else
    {
        return this.m_headers[index];
    }
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
oj.FlattenedTreeHeaderSet.prototype.getMetadata = function(index, level)
{
    var data;
    oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds'); 
    oj.Assert.assert(level == null || level == 0, 'level out of bounds'); 
    
    if (this.m_rowHeader != null && this.m_nodeSet != null)
    {
        return this.m_nodeSet.getMetadata(index - this.m_start + this.m_nodeSet.getStart());
    }
    else
    {
        data = this.getData(index);
        return {'key': data};
    }
};

/**
 * Gets the actual count of the result set. The total indexes spanned along the innermost header.
 * @return {number} the actual count of the result set.  
 * @export
 */
oj.FlattenedTreeHeaderSet.prototype.getCount = function()
{
    if (this.m_rowHeader != null && this.m_nodeSet != null)
    {
        return Math.min(this.m_nodeSet.getCount(), this.m_end - this.m_start);
    }
    else
    {
        return Math.max(0, this.m_end - this.m_start);
    }
};

/**
 * Gets the actual number of levels of the result set for the specified axis. The levels
 * are the counted from the outermost header indexed at 0, and moving inwards toward the 
 * databody would increment the level by 1.
 * @return {number} the number of levels of the result set
 * @export
 */
oj.FlattenedTreeHeaderSet.prototype.getLevelCount = function()
{
    if (this.getCount() > 0)
    {
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
 */
oj.FlattenedTreeHeaderSet.prototype.getExtent = function(index, level)
{
    oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds'); 
    oj.Assert.assert(level == null || level == 0, 'level out of bounds'); 
    
    return {'extent': 1, 'more':{'before': false, 'after':false}};
};
 
/**
 * Gets the depth of an index starting at a particular level. The depth is the number 
 * of levels spanned by the header.
 * @param {number} index the absolute index of the depth to get
 * @param {number=} level the level of the header, 0 is the outermost header
 * @return {number} the number of levels spanned by the header at the specified position
 * @export
 */
oj.FlattenedTreeHeaderSet.prototype.getDepth = function(index, level)
{
    oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds'); 
    oj.Assert.assert(level == null || level == 0, 'level out of bounds'); 
    
    return 1;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * A CellSet represents a collection of cells.  The CellSet is an object returned by the success callback
 * of the fetchCells method on DataGridDataSource.  The FlattenedTreeCellSet is a FlattenedDataGridDataSource specific 
 * implementation of methods on CellSet. 
 * @param {number} startRow the start row index of the cell set
 * @param {number} endRow the end row index of the cell set
 * @param {number} startColumn the start column index of the cell set
 * @param {number} endColumn the end column index of the cell set
 * @param {Object} nodeSet the node set in which this cell set wraps around
 * @param {Array|null} columns the set of column keys
 * @constructor
 * @export
 */
oj.FlattenedTreeCellSet = function(startRow, endRow, startColumn, endColumn, nodeSet, columns)
{
    oj.Assert.assertArrayOrNull(columns);

    this.m_startRow = startRow;
    this.m_endRow = endRow;
    this.m_startColumn = startColumn;
    this.m_endColumn = endColumn;
    this.m_nodeSet = nodeSet;
    this.m_columns = columns;
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
oj.FlattenedTreeCellSet.prototype.getData = function(indexes)
{
    var relIndex, row, column, columnKey, rowData;

    // convert to relative index
    relIndex = this._getRelIndexes(indexes);
    if (relIndex == null)
    {
        return null;
    }

    row = relIndex[0];
    column = relIndex[1];

    // make sure index are valid
    oj.Assert.assert(row < this.m_nodeSet.getStart()+this.m_nodeSet.getCount() && column < this.m_columns.length);

    columnKey = this.m_columns[column];
    rowData = this.m_nodeSet.getData(row);
    if (rowData != null)
    {
        if (rowData.get)
        {
            return rowData.get(columnKey);
        }
        else
        {
            return rowData[columnKey];
        }
    }
    return null;
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
oj.FlattenedTreeCellSet.prototype.getMetadata = function(indexes)
{
    var relIndex, row, column, columnKey, metadata, rowKey;

    // convert to relative index
    relIndex = this._getRelIndexes(indexes);
    if (relIndex == null)
    {
        return null;
    }

    row = relIndex[0];
    column = relIndex[1];

    // make sure index are valid
    oj.Assert.assert(row < this.m_nodeSet.getStart()+this.m_nodeSet.getCount() && column < this.m_columns.length);

    columnKey = this.m_columns[column];

    metadata = this.m_nodeSet.getMetadata(row);
    rowKey = metadata['key'];

    metadata['keys'] = {"row": rowKey, "column": columnKey};

    return metadata;
};

/**
 * Helper method to validate and retrieve the relative indexes.
 * @param {Object} indexes the row and column index
 * @param {number} indexes.row the index of the row axis.
 * @param {number} indexes.column the index of the column axis.
 * @return {Object.<number, number>} the relative indexes
 * @private
 */
oj.FlattenedTreeCellSet.prototype._getRelIndexes = function(indexes)
{
    var row, column;

    oj.Assert.assertObject(indexes);

    if (this.m_nodeSet == null || this.m_nodeSet.length == 0)
    {
        return null;
    }

    // map to the index in nodeSet
    row = indexes['row'] - this.m_startRow + this.m_nodeSet.getStart();
    column = indexes['column'];

    // make sure index are valid
    oj.Assert.assertNumber(row, null);
    oj.Assert.assertNumber(column, null);
    oj.Assert.assert(row >= 0 && column >= 0); 

    return [row, column];
};

/**
 * Gets the start index of the result set for the specified axis.
 * @param {string} axis the axis in which to inquire the actual count of the result set.  
 *        Valid values are "row" and "column".
 * @return {number} the start of the index of the result set for the specified axis.  
 * @export
 */
oj.FlattenedTreeCellSet.prototype.getStart = function(axis)
{
    if (axis === "row")
    {
        return this.m_startRow;
    }

    if (axis === "column")
    {
        return this.m_startColumn;
    }

    return 0;
};

/**
 * Gets the actual count of the result set for the specified axis. 
 * @param {string} axis the axis in which to inquire the actual count of the result set.  
 *        Valid values are "row" and "column".
 * @return {number} the actual count of the result set for the specified axis.  
 * @export
 */
oj.FlattenedTreeCellSet.prototype.getCount = function(axis)
{
    if (axis === "row")
    {
        return Math.min(this.m_endRow - this.m_startRow, this.m_nodeSet.getCount());
    }
    
    if (axis === "column")
    {
        return this.m_endColumn - this.m_startColumn;
    }

    return 0;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * The DataGrid specific implementation of the FlattenedTreeDataSource class.
 * @param {Object} treeDataSource the instance of TreeDataSource to flattened
 * @param {Object=} options the options set on this data source.  See documentation for a list
 *        of supported options.
 * @constructor
 * @export
 * @extends oj.FlattenedTreeDataSource
 */
oj.FlattenedTreeDataGridDataSource = function(treeDataSource, options)
{
    oj.FlattenedTreeDataGridDataSource.superclass.constructor.call(this, treeDataSource, options);
};

// Subclass from oj.FlattenedTreeDataSource
oj.Object.createSubclass(oj.FlattenedTreeDataGridDataSource, oj.FlattenedTreeDataSource, "oj.FlattenedTreeDataGridDataSource");

/**
 * Initializes the data source.
 * @export
 */
oj.FlattenedTreeDataGridDataSource.prototype.Init = function()
{
    oj.FlattenedTreeDataGridDataSource.superclass.Init.call(this);

    this.m_columns = oj.FlattenedTreeDataGridDataSource.superclass.getOption.call(this, 'columns');
    this.m_rowHeader = oj.FlattenedTreeDataGridDataSource.superclass.getOption.call(this, 'rowHeader');
};

/**
 * Returns whether the total count returned in getCount function is an actual or an estimate.
 * @param {string} axis the axis in which we inquire whether the total count is an estimate.  Valid values are 
 *        "row" and "column".
 * @return {string} "exact" if the count returned in getCount function is the actual count, "estimate" if the 
 *         count returned in getCount function is an estimate.  The default value is "exact".
 * @export
 */
oj.FlattenedTreeDataGridDataSource.prototype.getCountPrecision = function(axis)
{
    // always returns estimate row count to ensure high watermark scrolling is used.
    if (axis === "row")
    {
        return "estimate";
    }

    return "actual";
};

/**
 * Returns the total number of rows or columns.  If the value return is not >= 0 then it is automatically assumed
 * that the total count is unknown.
 * @param {string} axis the axis in which we inquire for the total count.  Valid values are "row" and "column".
 * @return {number} the total number of rows/columns.
 * @export
 */
oj.FlattenedTreeDataGridDataSource.prototype.getCount = function(axis)
{
    // always returns -1 to ensure high watermark scrolling is used.
    if (axis === "row")
    {
        return -1;
    }

    if (axis === "column")
    {
        return this.m_columns.length;
    }

    return 0;
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
 * @param {function(oj.HeaderSet)} callbacks.success the callback to invoke when fetch headers completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @export
 */
oj.FlattenedTreeDataGridDataSource.prototype.fetchHeaders = function(headerRange, callbacks, callbackObjects)
{
    var axis, headerSet, columnCount;

    axis = headerRange['axis'];
    if (axis === "column")
    {
        columnCount = headerRange['start'] + headerRange['count'];
        if (columnCount > this.getCount('column'))
        {
            columnCount = this.getCount('column') - headerRange['start'];
        }
        headerSet = new oj.FlattenedTreeHeaderSet(headerRange['start'], columnCount, this.m_columns);
    }
    else if (axis === "row")
    {
        if (this.m_rowHeader != null)
        {
            // assumes that a fetch header request is immediately followed by a fetch cells request
            // avoid doing two fetch requests for the same set of data, wait until fetch cells request is available
            // before handling the header request
            // since the two fetches are converge on fetchCell, the range should always be in sync
            this.m_fetchHeaderRequest = {'range': headerRange, 'callbacks': callbacks, 'callbackObjects': callbackObjects};
            return;
        }
        else
        {
            // no row header, return empty result set
            headerSet = new oj.ArrayHeaderSet(headerRange['start'], headerRange['start'], axis, null);
        }
    }

    if (headerSet != null)
    {
        if (callbacks != null && callbacks['success'] != null)
        {
            // todo: get rid of callbackObjects
            if (callbackObjects == null)
            {
                callbackObjects = {};
            }	            
            callbacks['success'].call(callbackObjects['success'], headerSet, headerRange);
        }
    }
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
 * @param {function(oj.CellSet)} callbacks.success the callback to invoke when fetch cells completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @export
 */
oj.FlattenedTreeDataGridDataSource.prototype.fetchCells = function(cellRanges, callbacks, callbackObjects)
{
    var i, cellRange, rowStart, rowCount;

    // extract row range information needed to make the fetchRows call
    for (i=0; i<cellRanges.length; i++)
    {
        cellRange = cellRanges[i];   
        if (cellRange['axis'] == "row")
        {
            rowStart = cellRange['start'];
            rowCount = cellRange['count'];
            break;
        }
    }

    oj.FlattenedTreeDataGridDataSource.superclass.fetchRows.call(this, {'start': rowStart, 'count': rowCount}, {"success": function(nodeSet){this._handleFetchRowsSuccess(nodeSet, cellRanges, callbacks, callbackObjects, 0);}.bind(this), "error": function(status){this._handleFetchRowsError(status, {'start': rowStart, 'count': rowCount}, callbacks, callbackObjects);}.bind(this)}); 
};

/**
 * Returns the keys based on the indexes. 
 * @param {Object} indexes the index for each axis
 * @param {Object} indexes.row the index for the row axis
 * @param {Object} indexes.column the index for the column axis
 * @return {Promise} a Promise object which upon resolution will pass in an object containing the keys for each axis,
 *                   or null if not found
 * @export
 */
oj.FlattenedTreeDataGridDataSource.prototype.keys = function(indexes)
{
    var rowIndex, colIndex;

    rowIndex = indexes['row'];
    colIndex = indexes['column'];

    return new Promise(function(resolve, reject) {
        // if it hasn't been fetched yet or invalid column index, return null
        if (rowIndex > oj.FlattenedTreeDataGridDataSource.superclass.getFetchedRange.call(this)['end'] || colIndex > this.m_columns.length)
        {
            resolve(null);
        }
        else
        {
            resolve({"row": oj.FlattenedTreeDataGridDataSource.superclass.getKey.call(this, rowIndex), "column": this.m_columns[colIndex]});
        }
    }.bind(this));
};

/**
 * Returns the row and column index based on the keys.
 * @param {Object} keys the key for each axis
 * @param {Object} keys.row the key for the row axis
 * @param {Object} keys.column the key for the column axis
 * @return {Promise} a promise object containing the index for each axis, or null if not found
 * @export
 */
oj.FlattenedTreeDataGridDataSource.prototype.indexes = function(keys)
{
    var rowIndex, colIndex, rowKey, colKey, i;

    rowKey = keys['row'];
    colKey = keys['column'];

    return new Promise(function(resolve, reject) {
        // call helper method to find the flattened index
        rowIndex = oj.FlattenedTreeDataGridDataSource.superclass.getIndex.call(this, rowKey);
        // for column index, just search through the column keys array
        for (i=0; i<this.m_columns.length; i++)
        {
            if (this.m_columns[i] === colKey)
            {
                colIndex = i;
                break;
            }
        }

        // make sure at least one of the indexes are valid
        // (at least one, since caller might only have specified one axis)
        if (rowIndex >= 0 || colIndex >= 0)
        {
            resolve({"row": rowIndex, "column": colIndex});
        }
        else
        {
            // can't find it (should it be reject?)
            resolve(null);
        }
    }.bind(this));
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
oj.FlattenedTreeDataGridDataSource.prototype.sort = function(criteria, callbacks, callbackObjects)
{
    var dataSource = oj.FlattenedTreeDataGridDataSource.superclass.getWrappedDataSource.call(this);

    // delegates to the underlying TreeDataSource but intercept the success callback so that we can clear the cache
    return dataSource.sort(criteria, {"success": function(){this._handleSortSuccess(callbacks, callbackObjects);}.bind(this), "error": callbacks['error']});
};

/**
 * Handles sort success callback.
 * @param {Object} callbacks the original callbacks for the sort operation
 * @param {Object} callbackObjects the original callbackObjects for the sort operation
 * @private
 */
oj.FlattenedTreeDataGridDataSource.prototype._handleSortSuccess = function(callbacks, callbackObjects)
{
    // reset state
    this.refresh();

    // invoke original sort success callback
    if (callbacks['success'])
    {
        // todo: get rid of callbackObjects
        if (callbackObjects == null)
        {
            callbackObjects = {};
        }	            
        callbacks['success'].call(callbackObjects['success']);
    }
};

/**
 * Moves a row from one location to another (different position within the same parent or a completely different parent)
 * @param {Object} rowToMove the key of the row to move
 * @param {Object} referenceRow the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {number|string} position The position of the moved row relative to the reference row.  Valid values are: "before", "after".
 * @param {function()} callbacks.success the callback to invoke when the move completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when move failed.
 * @export
 */ 
oj.FlattenedTreeDataGridDataSource.prototype.move = function(rowToMove, referenceRow, position, callbacks)
{
    var dataSource = oj.FlattenedTreeDataGridDataSource.superclass.getWrappedDataSource.call(this);

    // delegates to the underlying TreeDataSource.  TreeDataSource is responsible for firing the appropriate model change
    // event so that the FlattenedTreeDataSource state are updated correctly.
    dataSource.move(rowToMove, referenceRow, position, callbacks);
};

/**
 * Determines whether this DataGridDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none", "row", "column".  
 *         Returns null if the feature is not recognized.
 * @export
 */
oj.FlattenedTreeDataGridDataSource.prototype.getCapability = function(feature)
{
    var dataSource = oj.FlattenedTreeDataGridDataSource.superclass.getWrappedDataSource.call(this);

    // just delegates to the underlying TreeDataSource
    if (dataSource.getCapability(feature) === 'default')
    {
        return 'column';
    }
    else
    {
        return 'none';
    }
};

/**
 * A hook for FlattenedTreeDataSource to inject additional metadata into the NodeSet
 * @param {Object} key the row key identifying the row
 * @param {Object} metadata the existing metadata to inject into
 * @protected
 */
oj.FlattenedTreeDataGridDataSource.prototype.insertMetadata = function(key, metadata)
{
    // just call super
    oj.FlattenedTreeDataGridDataSource.superclass.insertMetadata.call(this, key, metadata);
};

/**
 * Callback method to handle success callback for fetchRows operation on FlattenedTreeDataSource.
 * @param {Object} nodeSet the result node set from the fetchRows called.
 * @param {Array.<Object>} cellRanges Information about the cell range.  A cell range is defined by an array 
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @param {string} cellRanges.axis the axis associated with this range where cells are fetched.  Valid 
 *        values are "row" and "column".
 * @param {number} cellRanges.start the start index of the range for this axis in which the cells are fetched.
 * @param {number} cellRanges.count the size of the range for this axis in which the cells are fetched. 
 * @param {Object} callbacks the callbacks to be invoke when fetch cells operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.CellSet)} callbacks.success the callback to invoke when fetch cells completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @private
 */
oj.FlattenedTreeDataGridDataSource.prototype._handleFetchRowsSuccess = function(nodeSet, cellRanges, callbacks, callbackObjects)
{
    var i, cellRange, rowStart, rowCount, columnStart, columnCount, headerRange, cellSet;

    // extract range information
    for (i=0; i<cellRanges.length; i++)
    {
        cellRange = cellRanges[i];   
        if (cellRange['axis'] == "row")
        {
            rowStart = cellRange['start'];
            rowCount = cellRange['count'];
            
        }
        else if (cellRange['axis'] == "column")
        {
            columnStart = cellRange['start'];
            columnCount = cellRange['count'];
            if (columnStart + columnCount > this.getCount('column'))
            {
                columnCount = this.getCount('column') - columnStart;
            }
        }
    }

    // checks whether there is an outstanding fetch header request with the same range
    if (this.m_fetchHeaderRequest)
    {
        headerRange = this.m_fetchHeaderRequest['range'];
        if (headerRange['start'] == rowStart && headerRange['count'] == rowCount)
        {
            // handle row header request
            this._handleRowHeaderFetchSuccess(nodeSet, headerRange, this.m_fetchHeaderRequest['callbacks'], this.m_fetchHeaderRequest['callbackObjects']);
        }
        this.m_fetchHeaderRequest = null;
    }

    // create wrapper
    cellSet = new oj.FlattenedTreeCellSet(rowStart, rowStart+rowCount, columnStart, columnStart+columnCount, nodeSet, this.m_columns);
    // invoke success callback
    if (callbacks['success'])
    {
        // todo: get rid of callbackObjects
        if (callbackObjects == null)
        {
            callbackObjects = {};
        }            
        callbacks["success"].call(callbackObjects['success'], cellSet, cellRanges);
    }
};

/**
 * Callback method to handle error callback for fetchRows operation on FlattenedTreeDataSource.
 * @param {Object} status the error status.
 * @param {Object} range Information about the row range.  
 * @param {Object} callbacks the callbacks to be invoke when fetch cells operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.CellSet)} callbacks.success the callback to invoke when fetch cells completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @private
 */
oj.FlattenedTreeDataGridDataSource.prototype._handleFetchRowsError = function(status, range, callbacks, callbackObjects)
{
    var headerRange, headerCallbacks, headerCallbackObjects;

    // checks whether there is an outstanding fetch header request with the same range
    if (this.m_fetchHeaderRequest)
    {
        headerRange = this.m_fetchHeaderRequest['range'];
        if (headerRange['start'] == range['start'] && headerRange['count'] == range['count'])
        {
            // invoke error callback on fetch header
            headerCallbacks = this.m_fetchHeaderRequest['callbacks'];
            headerCallbackObjects = this.m_fetchHeaderRequest['callbackObjects'];

            if (headerCallbacks['error'])
            {
                // todo: get rid of callbackObjects
                if (headerCallbackObjects == null)
                {
                    headerCallbackObjects = {};
                }            
                headerCallbacks['error'].call(headerCallbackObjects['error'], status);
            }
        }
        this.m_fetchHeaderRequest = null;
    }

    // invoke error callback
    if (callbacks['error'])
    {
        // todo: get rid of callbackObjects
        if (callbackObjects == null)
        {
            callbackObjects = {};
        }            
        callbacks["success"].call(callbackObjects['error'], status);
    }
};

/**
 * Handles header fetch success request based on results from fetch cell operation.
 * @param {Object} nodeSet the result node set from the fetchRows called.
 * @param {Object} headerRange information about the header range, it must contain the following properties:
 *        axis, start, count.
 * @param {string} headerRange.axis the axis of the header that are fetched.  Valid values are "row" and "column".
 * @param {number} headerRange.start the start index of the range in which the header data are fetched.
 * @param {number} headerRange.count the size of the range in which the header data are fetched.  
 * @param {Object} callbacks the callbacks to be invoke when fetch headers operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.HeaderSet)} callbacks.success the callback to invoke when fetch headers completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @private
 */
oj.FlattenedTreeDataGridDataSource.prototype._handleRowHeaderFetchSuccess = function(nodeSet, headerRange, callbacks, callbackObjects)
{
    // create wrapper
    var headerSet = new oj.FlattenedTreeHeaderSet(headerRange['start'], headerRange['start']+headerRange['count'], this.m_columns, nodeSet, this.m_rowHeader);
    // invoke success callback
    if (callbacks['success'])
    {
        // todo: get rid of callbackObjects
        if (callbackObjects == null)
        {
            callbackObjects = {};
        }            
        callbacks['success'].call(callbackObjects['success'], headerSet, headerRange);
    }
};

/**
 * Implementation of abstract method to insert a set of rows into the DataGrid
 * @param {number} insertAtIndex the flattened index of the node where the rows are inserted.
 * @param {Object} insertAtRowKey the key of the node where the rows are inserted (the parent key)
 * @param {Object} nodeSet the node set containing data/metadata of inserted rows
 * @protected
 */
oj.FlattenedTreeDataGridDataSource.prototype.insertRows = function(insertAtIndex, insertAtRowKey, nodeSet)
{
    var cellSet, headerSet, event, i, keys, indexes;

    headerSet = null;
    if(this.m_rowHeader)
    {
        headerSet = new oj.FlattenedTreeHeaderSet(insertAtIndex, insertAtIndex+nodeSet.getCount(), this.m_columns, nodeSet, this.m_rowHeader);
    }
    // create a CellSet that wraps around a RowSet 
    cellSet = new oj.FlattenedTreeCellSet(insertAtIndex, insertAtIndex+nodeSet.getCount(), 0, this.m_columns.length, nodeSet, this.m_columns);

    keys = [];
    indexes = [];    
    for (i = 0; i < nodeSet.getCount(); i++)
    {
        keys.push({"row": this._getEntry(insertAtIndex + i)['key']});
        indexes.push({"row": insertAtIndex + i, "column": -1});               
    }    

    // construct model insert event with a set of rows to insert
    event = {};
    event['source'] = this;
    event['operation'] = 'insert';
    event['result'] = cellSet;
    if(headerSet)
    {
        event['header'] = headerSet;
    }
    event['keys'] = keys;
    event['indexes'] = indexes;
    
    oj.FlattenedTreeDataGridDataSource.superclass.handleEvent.call(this, "change", event);
};

/**
 * Implementation of bstract method to remove the specified rows in the DataGrid
 * @param {Array.<Object>} rowKeys an array of keys of the rows to be remove.
 * @protected
 */
oj.FlattenedTreeDataGridDataSource.prototype.removeRows = function(rowKeys)
{
    var keys, i, event, indexes;
    
    // extract the keys
    keys = [];
    indexes = [];
    for (i=0; i<rowKeys.length; i++)
    {
        keys.push({"row": rowKeys[i]['key']});
        indexes.push({"row": rowKeys[i]['index'], "column": -1});        
    }

    // construct model delete event with a set of row keys to delete
    event = {};
    event['source'] = this;
    event['operation'] = 'delete';
    event['keys'] = keys;
    event['indexes'] = indexes;

    oj.FlattenedTreeDataGridDataSource.superclass.handleEvent.call(this, "change", event);
};

/**
 * Handles the case when the maximum number of rows have been reached
 * @param {Object} range the range of the fetch request that cause the max count to be reached
 * @param {number} range.start the start index of the range
 * @param {number} range.count the count of the range
 * @protected
 */
oj.FlattenedTreeDataGridDataSource.prototype.handleMaxCountReached = function(range, callbacks)
{
    var empty = new oj.EmptyNodeSet(null, range['start']);
    callbacks["success"].call(null, empty);
};
});
