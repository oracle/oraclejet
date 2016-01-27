/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojdatasource-common'], function(oj, $)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * An array based implementation of the DataGridDataSource.
 * @param {Array|Object} data the data in the form of array or observable array.
 * @param {Object=} options the options specific to this DataGridDataSource.
 * @param {Array=} options.columns an array of columns to return as column headers.
 * 
 * @param {Object|number|string=} options.rowHeader an object representing the default row header, 
 *      if a string is provided it will be used as the key of the header, if a number is provided 
 *      it will be used as the index of the header.
 * @param {string=} options.rowHeader.default disable default row headers or provide them as indexes 'none' or 'index'
 * @param {Object=} options.initialSort the information about the array if it is pre-sorted
 * @param {string|number=} options.initialSort.key the key that the array is sorted on
 * @param {string=} options.initialSort.direction valid values are ascending or descending
 * @export
 * @constructor
 * @extends oj.DataGridDataSource
 */
oj.ArrayDataGridDataSource = function(data, options)
{
    var errSummary, errDetail;
    if (!(data instanceof Array) &&
            (typeof (data) != 'function' &&
                    typeof (data.subscribe) != 'function'))
    {
        // we only support Array or ko.observableArray. To
        // check for observableArray, we can't do instanceof check because it's
        // a function. So we just check if it contains a subscribe function.
        errSummary = '_ERR_DATA_INVALID_TYPE_SUMMARY';
        errDetail = '_ERR_DATA_INVALID_TYPE_DETAIL';
        throw new Error(errSummary + '\n' + errDetail);
    }
    
    this.rowHeaderKey = this._getRowHeaderFromOptions(options);
    
    if (options != null)
    {
        // undefined if no row header, 'm_defaultIndex' if indexed, other strings keys, numbers index of array
        this.columns = options['columns'];
        this._sortInfo = options['initialSort'];        
    }
    oj.ArrayDataGridDataSource.superclass.constructor.call(this, data);
};

// Subclass from oj.DataGridDataSource
oj.Object.createSubclass(oj.ArrayDataGridDataSource, oj.DataGridDataSource, "oj.ArrayDataGridDataSource");

/**
 * Initial the array based data source.
 * @export
 */
oj.ArrayDataGridDataSource.prototype.Init = function()
{
    // suck out the column definition from data
    if (this.columns == null)
    {
        this.columns = this._getColumnsForScaffolding(this.getDataArray());
    }
    this._initializeRowKeys();

    //if the data is an observable array subscribe to array change notifications
    if (typeof (this.data) == 'function')
    {
        this.data['subscribe'](this._subscribe.bind(this), null, 'arrayChange');
    }

    // call super
    oj.ArrayDataGridDataSource.superclass.Init.call(this);
};

/**
 * Extract the row header from the options
 * @param {Object|null=} options the options passed into the data source
 * @private
 */
oj.ArrayDataGridDataSource.prototype._getRowHeaderFromOptions = function(options)
{
    if (options != null && options['rowHeader'] != null)
    {
        var option = options['rowHeader'];
        if (typeof option === 'object')
        {
            if (option['default'] != null)
            {
                if (option['default'] == 'none')
                {
                    return undefined;
                }
                else if (option['default'] == 'index')
                {
                    return 'm_defaultIndex';
                }
            }
        }
        else if (option != null)
        {
            return option;
        }
    }
    
    // nothing set means indexed headers
    return 'm_defaultIndex';
};

/**
 * Initialize the generated row keys.
 * @private
 */
oj.ArrayDataGridDataSource.prototype._initializeRowKeys = function()
{
    var data;
    data = this.getDataArray();
    for (this.lastKey = 0; this.lastKey < data.length; this.lastKey += 1)
    {
        //inject the row key into the object
        data[this.lastKey]['ojKey'] = this.lastKey.toString();
    }
};

/**
 * Get the column headers from the data, if it is an array of arrays with no row header key set,
 * gets the column number as the column header.
 * @param {Object} data the data to extract the column information.
 * @return {Array} the columns extracted from the data.
 * @private
 */
oj.ArrayDataGridDataSource.prototype._getColumnsForScaffolding = function(data)
{
    var propertyName, columns;
    if ((typeof data.length !== 'number') || data.length === 0)
    {
        return [];
    }

    columns = [];
    for (propertyName in data[0])
    {
        if (data[0].hasOwnProperty(propertyName))
        {
            if (!(this.rowHeaderKey != undefined && propertyName == this.rowHeaderKey))
            {
                columns.push(propertyName);
            }
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
 */
oj.ArrayDataGridDataSource.prototype.getCount = function(axis)
{
    if (axis === "row")
    {
        return this._size();
    }

    if (axis === "column")
    {
        return this.columns.length;
    }

    return 0;
};

/**
 * Returns whether the total count returned in getCount function is an actual or an estimate.
 * @param {string} axis the axis in which we inquire whether the total count is an estimate.  Valid values are 
 *        "row" and "column".
 * @return {string} "exact" if the count returned in getCount function is the actual count, "estimate" if the 
 *         count returned in getCount function is an estimate.  The default value is "exact".
 * @export
 */
oj.ArrayDataGridDataSource.prototype.getCountPrecision = function(axis)
{
    return "exact";
};

/**
 * Retrieve the data for the header of a specified index.
 * @param {string} axis the axis of the header.  Valid values are "row" and "column".
 * @param {number} index the index in which to get the data.
 * @private
 */
oj.ArrayDataGridDataSource.prototype._getHeaderData = function(axis, index)
{
    var data;
    if (axis === 'row')
    {
        if (this.rowHeaderKey == undefined)
        {
            return null;
        }        
        else if (this.rowHeaderKey == 'm_defaultIndex')
        {            
            // generate data by index
            return this._getRowKeyByIndex(index);
        }        
        else
        {
            data = this.getDataArray();
            return data[index][this.rowHeaderKey];
        }
    }
    else if (axis === 'column')
    {
        return this.columns[index];
    }
};

/**
 * Retrieve the metadata for the header of a specified index.
 * @param {string} axis the axis of the header.  Valid values are "row" and "column".
 * @param {number} index the index in which to get the metadata.
 * @private
 */
oj.ArrayDataGridDataSource.prototype._getHeaderMetadata = function(axis, index)
{
    var key;
    if (axis === 'row')
    {
        return {'key': this._getRowKeyByIndex(index)};
    }
    else if (axis === 'column')
    {
        key = this._getHeaderData(axis, index);
        if (this._sortInfo != null && this._sortInfo['key'] === key)
        {
            return {'key': this._getHeaderData(axis, index), 'sortDirection': this._sortInfo['direction']};
        }

        return {'key': key};
    }
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
oj.ArrayDataGridDataSource.prototype.fetchHeaders = function(headerRange, callbacks, callbackObjects)
{
    var axis, start, count, end, headerSet, data;

    axis = headerRange.axis;
    start = headerRange.start;
    count = headerRange.count;

    start = Math.max(0, start);
    if (axis === "column")
    {
        end = Math.min(this.columns.length, start + count);
    }
    else
    {
        data = this.getDataArray();
        // check if no row header is available
        if (this.rowHeaderKey === undefined)
        {
            // header count = 0
            end = start;
        }
        else
        {
            end = Math.min(data.length, start + count);
        }
    }
    headerSet = new oj.ArrayHeaderSet(start, end, axis, this);

    if (callbacks != null && callbacks['success'] != null)
    {
        // make sure callbackObjects is not null
        if (callbackObjects == null)
        {
            callbackObjects = {};
        }
        callbacks['success'].call(callbackObjects['success'], headerSet, headerRange);
    }
};

/**
 * Retrieve the data for the cell of a specified indexes.
 * @param {number} row the row index in which to get the data.
 * @param {number} column the column index in which to get the data.
 * @private
 */
oj.ArrayDataGridDataSource.prototype._getCellData = function(row, column)
{
    var col = this.columns[column];
    return this.getDataArray()[row][col];
};

/**
 * Retrieve the metadata for the cell of a specified indexes.
 * @param {number} row the row index in which to get the data.
 * @param {number} column the column index in which to get the data.
 * @private
 */
oj.ArrayDataGridDataSource.prototype._getCellMetadata = function(row, column)
{
    var keys = {"row": this._getRowKeyByIndex(row), "column": this.columns[column]};
    return {"keys": keys};
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
oj.ArrayDataGridDataSource.prototype.fetchCells = function(cellRanges, callbacks, callbackObjects)
{
    var i, cellRange, rowStart, rowEnd, cellSet, colStart, colEnd;

    // extract the start and end row/column info from cellRanges (there should only be two, one for each axis)
    for (i = 0; i < cellRanges.length; i += 1)
    {
        cellRange = cellRanges[i];
        if (cellRange['axis'] === "row")
        {
            rowStart = cellRange['start'];
            rowEnd = Math.min(this._size(), rowStart + cellRange['count']);
        }
        else if (cellRange['axis'] === "column")
        {
            colStart = cellRange['start'];
            colEnd = Math.min(this.columns.length, colStart + cellRange['count']);
        }
    }

    // check for errors
    if (rowEnd === undefined || colEnd === undefined)
    {
        if (callbacks != null && callbacks['error'] != null)
        {
            // make sure callbackObjects is not null
            if (callbackObjects == null)
            {
                callbackObjects = {};
            }
            callbacks['error'].call(callbackObjects['error']);
        }
        return;
    }

    cellSet = new oj.ArrayCellSet(rowStart, rowEnd, colStart, colEnd, this);

    if (callbacks != null && callbacks['success'] != null)
    {
        // make sure callbackObjects is not null
        if (callbackObjects == null)
        {
            callbackObjects = {};
        }
        callbacks['success'].call(callbackObjects['success'], cellSet, cellRanges);
    }
};

/**
 * Returns the keys based on the indexes. 
 * @param {Object} indexes the index for each axis
 * @param {string|number|null} indexes.row the index for the row axis
 * @param {string|number|null} indexes.column the index for the column axis
 * @return {Promise} a Promise object which upon resolution will pass in an object containing the keys for each axis
 * @export
 */
oj.ArrayDataGridDataSource.prototype.keys = function(indexes)
{
    var rowIndex = indexes['row'], columnIndex = indexes['column'];
    return new Promise(function(resolve, reject) {
        resolve({"row": this._getRowKeyByIndex(rowIndex), "column": this.columns[columnIndex]});
    }.bind(this));
};

/**
 * Returns the row and column index based on the keys. In a paging case returns the 
 * index on the page, not the absolute index in the array.
 * @param {Object} keys the key for each axis
 * @param {string|number|null} keys.row the key for the row axis
 * @param {string|number|null} keys.column the key for the column axis
 * @return {Promise} a promise object containing the index for each axis
 * @export
 */
oj.ArrayDataGridDataSource.prototype.indexes = function(keys)
{
    var rowKey = keys['row'], columnKey = keys['column'];
    return new Promise(function(resolve, reject) {
        resolve({"row": this._getRowIndexByKey(rowKey), "column": this.columns.indexOf(columnKey)});
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
oj.ArrayDataGridDataSource.prototype.sort = function(criteria, callbacks, callbackObjects)
{
    var sortArray = [], newColumns = [], i, headerIndex, axis, headerKey, direction;

    // make sure callbackObjects is non null
    if (callbacks != null && callbackObjects == null)
    {
        callbackObjects = {};
    }

    // reset sort order if no criteria is specified
    if (criteria == null)
    {
        this._resetSortOrder(callbacks, callbackObjects);
        return;
    }

    axis = criteria['axis'];
    headerKey = criteria['key'];
    direction = criteria['direction'];
    
    if (axis === 'column')
    {
        // keep a copy of the original unsorted array.  Both array and observable array have slice method.
        if (this.origData == undefined)
        {
            this._origSortInfo = this._sortInfo;     
            this.origData = this.data.slice();        
        }
    
        this._sortInfo = {'key': headerKey, 'direction': direction};
        
        this.getDataArray().sort(this._naturalSort(direction, headerKey));

        if (callbacks != null && callbacks['success'] != null)
        {
            callbacks['success'].call(callbackObjects['success']);
        }
    }
    else if (axis === 'row')
    {
        headerIndex = this._getRowIndexByKey(headerKey);
        //rebuild the array to sort on
        for (i = 0; i < this.columns.length; i += 1)
        {
            sortArray[i] = this.getDataArray()[headerIndex][this.columns[i]];
        }

        //sort the given array with no headerKye specified
        sortArray.sort(this._naturalSort(direction));

        //reorder the columns property
        for (i = 0; i < this.columns.length; i += 1)
        {
            newColumns[i] = this.columns[sortArray.indexOf(this.getDataArray()[headerIndex][this.columns[i]])];
        }

        // keep a copy of the original column order.
        this.origColumns = this.columns;
        this.columns = newColumns;
        if (callbacks != null && callbacks['success'] != null)
        {
            callbacks['success'].call(callbackObjects['success']);
        }
    }
    else
    {
        if (callbacks !== null && callbacks['error'] != null)
        {
            callbacks['error'].call(callbackObjects['error'], "Invalid axis value");
        }
    }
};

/**
 * Reset the sort order of the data.
 * @param {Object} callbacks the callbacks to be invoke upon completion of the sort operation.  The callback
 *        properties are "success" and "error".
 * @param {function()} callbacks.success the callback to invoke when the sort completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when sort failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" properties.
 * @private
 */
oj.ArrayDataGridDataSource.prototype._resetSortOrder = function(callbacks, callbackObjects)
{
    // reset data to the unsorted array
    if (this.origData != null)
    {
        this.data = this.origData;
        this._sortInfo = this._origSortInfo;
    }

    // reset column order if row header was sorted before
    if (this.origColumns != null)
    {
        this.columns = this.origColumns;
    }

    if (callbacks != null && callbacks['success'] != null)
    {
        callbacks['success'].call(callbackObjects['success']);
    }
};

/**
 * Determines whether this DataGridDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For sort, the valid return values are: "full", "none".  Returns null if the
 *         feature is not recognized.
 * @export
 */
oj.ArrayDataGridDataSource.prototype.getCapability = function(feature)
{
    if (feature === 'sort')
    {
        // array based data source supports column sorting only
        return 'column';
    }
    if (feature === 'move')
    {
        return 'row';
    }
    return null;
};

/**
 * Get a comparator fuicntion for natural sorting of objects
 * @param {string} direction ascending, descending 
 * @param {string|number=} key the key or index to perform the sort on
 * @returns {function(Object, Object)|undefined} a comapartor function, dependent on direction
 * @private
 */
oj.ArrayDataGridDataSource.prototype._naturalSort = function(direction, key)
{
    if (direction === 'ascending')
    {
        return function(a, b)
        {
            var as, bs;
            //Get the values the array we're sorting
            if (key != undefined)
            {
                //if the sorting item is an array it will be indexed with strings of ints and needs
                //to be accessed using ints not strings
                if (a instanceof Array)
                {
                    a = a[parseInt(key, 10)];
                    b = b[parseInt(key, 10)];
                }
                else
                {
                    a = a[key];
                    b = b[key];
                }
            }
            //Strings of numbers return false, so we can compare strings of numebers with numbers                
            as = isNaN(a);
            bs = isNaN(b);
            //If they are strings, check to see if they are dates, if they are, turn the string to a sortable date formatted string           
            if (a instanceof Date) {
                a = a.toISOString();
                as = true;
            }
            if (b instanceof Date) {
                b = b.toISOString();
                bs = true;
            }
            //both are string
            if (as && bs)
            {
                return a < b ? -1 : a === b ? 0 : 1;
            }
            //only a is a string
            if (as)
            {
                return 1;
            }
            //only b is a string
            if (bs)
            {
                return -1;
            }
            //both are numbers
            return a - b;
        };
    }
    if (direction === 'descending')
    {
        return function(a, b)
        {
            var as, bs;
            if (key != undefined)
            {
                //if the sorting item is an array it will be indexed with strings of ints and needs
                //to be accessed using ints not strings                
                if (a instanceof Array)
                {
                    a = a[parseInt(key, 10)];
                    b = b[parseInt(key, 10)];
                }
                else
                {
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
            if (as && bs)
            {
                return a > b ? -1 : a === b ? 0 : 1;
            }
            if (as)
            {
                return -1;
            }
            if (bs)
            {
                return 1;
            }
            return b - a;
        };
    }

    // only if direction is not recognized
    return;
};

/**
 * Moves a row from one location to another.
 * @param {Object} moveKey the key of the row to move
 * @param {Object} atKey the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {string} position The position of the moved row relative to the reference row.  
 *        Valid values are: "before", "after" 
 * @param {function()} callbacks.success the callback to invoke when the move completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when move failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" properties.
 * @export
 */
oj.ArrayDataGridDataSource.prototype.move = function(moveKey, atKey, position, callbacks, callbackObjects)
{
    var moveKeyIndex, moveData, atKeyIndex, event, data;

    //remove the data from the array, but hold on to it
    moveKeyIndex = this._getRowIndexByKey(moveKey);
    moveData = this.data.splice(moveKeyIndex, 1)[0];

    //fire the delete event to the datagrid
    if (this.data instanceof Array)
    {
        event = this._getModelEvent('delete', moveKey, null, moveKeyIndex, -1, true);
        this.handleEvent("change", event);
    }

    //add the stored data back into the array
    if (atKey === null)
    {
        this.data.push(moveData);
    }
    else
    {
        atKeyIndex = this._getRowIndexByKey(atKey);
        this.data.splice(atKeyIndex, 0, moveData);
    }

    //fire the insert event to the datagrid
    if (this.data instanceof Array)
    {
        event = this._getModelEvent('insert', moveKey, null, atKeyIndex, -1);        
        this.handleEvent("change", event);
    }

    // if we keep track of original data, we'll need to update it
    if (this.origData != null)
    {
       // note that once a row is moved then the current sort order is the new unsorted order
       this.origData = this.data.slice();
    }
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
oj.ArrayDataGridDataSource.prototype.moveOK = function(rowToMove, referenceRow, position)
{
    return "valid";
};

/**
 * Gets the data array, if the data property is a function call it, else return data
 * @return {Object|Array} the array of the data
 * @private
 */
oj.ArrayDataGridDataSource.prototype.getDataArray = function()
{
    if (typeof (this.data) === 'function')
    {
        return this.data();
    }
    return this.data;
};

/**
 * Gets the row index of a given row key
 * @param {string|number|Object|null} key the key to get row index of
 * @return {number} the index with a certain key, -1 if the key doesn't exist
 * @private
 */
oj.ArrayDataGridDataSource.prototype._getRowIndexByKey = function(key)
{
    var i, data = this.getDataArray();
    for (i = 0; i < data.length; i++)
    {
        if (data[i]['ojKey'] === key)
        {
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
 */
oj.ArrayDataGridDataSource.prototype._getRowKeyByIndex = function(index)
{
    var data = this.getDataArray();
    if (data[index])
    {
        return data[index]['ojKey'];
    }
    return null;
};

/**
 * Returns an Object for an event 
 * @param {string} operation the operation done on the model
 * @param {Object|string|number|null} rowKey the key for the row axis
 * @param {Object|string|number|null} columnKey the key for the column axis
 * @param {number=} rowIndex the index for the row axis
 * @param {number=} columnIndex the index for the column axis
 * @param {boolean=} silent should the event be silent
 * @return {Object} an object containing the the source, operation, and keys of the event
 * @private
 */
oj.ArrayDataGridDataSource.prototype._getModelEvent = function(operation, rowKey, columnKey, rowIndex, columnIndex, silent)
{
    var event = {};
    event['source'] = this;
    event['operation'] = operation;
    event['keys'] = {'row': rowKey, 'column': columnKey};
    event['indexes'] = {'row': rowIndex, 'column': columnIndex};
    event['silent'] = silent;
    return event;
};

/**
 * Subscribe to knockout events
 * @param {Array} changes an array of change objects fired by an observable array
 * @private
 */
oj.ArrayDataGridDataSource.prototype._subscribe = function(changes)
{
    var i, rowData, rowKey, rowIndex, added = false, move = false, keys = [], indexes = [], event, beforeDelCount = 0, change;

    // first loop though the changes, 
    for (i = 0; i < changes.length; i++)
    {
        change = changes[i];
        // if a model was moved using a reverseAll or a sort, just refresh the grid
        if (change['moved'] !== undefined)
        {
            move = true;
            event = this._getModelEvent('refresh', null, null);        
            this.handleEvent("change", event);
            break;
        }
        
        // check if there were any adds, this way the delete will know to be fired silently
        if (change['status'] === 'added')
        {
            added = true;
        }
    }
    
    //if we moved a model we just refreshed
    if (!move)
    {        
        //loop through changes looking for deletes
        for (i = 0; i < changes.length; i++)
        {
            change = changes[i];
            if (change['status'] === 'deleted')
            {
                rowData = change['value'];
                rowIndex = change['index'];
                rowKey = rowData['ojKey'];  
                
                //collect the deletes to do in one batch delete
                keys.push({'row': rowKey, 'column': -1});
                indexes.push({'row': rowIndex, 'column': -1});
            }
        }
        
        // batch delete all deletes
        if (keys.length > 0)
        {
            event = {'source': this, 'operation': 'delete', 'keys': keys, 'indexes': indexes, 'silent': added};
            this.handleEvent("change", event);
        }
        
        //loop through changes looking for adds
        for (i = 0; i < changes.length; i++)
        {
            change = changes[i];
            if (change['status'] === 'added')
            {
                rowData = change['value'];   
                rowIndex = change['index'];               
                //if no key add inject one into the add object based on the last assigned key          
                if (rowData['ojKey'] == null)
                {
                    rowData['ojKey'] = this.lastKey.toString();
                    this.lastKey++;
                }
                //add at the given index and remove from the end of the page silently
                rowKey = rowData['ojKey'];
                event = this._getModelEvent('insert', rowKey, null, rowIndex, -1);                            
                this.handleEvent("change", event);
            }
        }
    }    
    
    // if we keep track of original data, we'll need to update it
    if (this.origData != null)
    {
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
 */
oj.ArrayDataGridDataSource.prototype._size = function()
{
    return this.getDataArray()['length'];
};

//////// testing methods to get properties /////////
/**
 * Gets the rowHeaderKey property.  This is an internal method for testing and should not be used by application.
 * @return {string|null} the row header key
 * @export
 * @ignore
 */
oj.ArrayDataGridDataSource.prototype.getRowHeaderKey = function()
{
    return this.rowHeaderKey;
};

/**
 * Gets the columns property.  This is an internal method for testing and should not be used by application.
 * @return {Array|null} the keys of the column headers
 * @export
 * @ignore
 */
oj.ArrayDataGridDataSource.prototype.getColumns = function()
{
    return this.columns;
};

/**
 * Gets the data property.  This is an internal method for testing and should not be used by application.
 * @return {Array|Object|null} the underlying array data.
 * @export
 * @ignore
 */
oj.ArrayDataGridDataSource.prototype.getData = function()
{
    return this.data;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * A HeaderSet represents a collection of headers.  The HeaderSet is an object returned by the success callback
 * of the fetchHeaders method on DataGridDataSource.  This implementation of HeaderSet is used by the
 * ArrayDataGridDataSource.   
 * @param {number} start the absolute start index of the header set.
 * @param {number} end the absolute end index of the header set.
 * @param {string} axis the axis of the header, value is either 'row' or 'column'.
 * @param {Object} callback the callback to invoke on to retrieve data and metadata. 
 * @constructor
 * @export
 */
oj.ArrayHeaderSet = function(start, end, axis, callback)
{
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
 * @return {Object} the data object for the specific index.
 * @export
 */
oj.ArrayHeaderSet.prototype.getData = function(index, level)
{
    if (this.m_callback == null)
    {
        return null;
    }
    
    // make sure index/level are valid
    oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds'); 
    oj.Assert.assert(level == null || level == 0, 'level out of bounds'); 

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
 */
oj.ArrayHeaderSet.prototype.getMetadata = function(index, level)
{
    if (this.m_callback == null)
    {
        return null;
    }
    
    // make sure index/level are valid
    oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds'); 
    oj.Assert.assert(level == null || level == 0, 'level out of bounds'); 

    return this.m_callback._getHeaderMetadata(this.m_axis, index);
};

/**
 * Gets the actual number of levels of the result set for the specified axis. The levels
 * are the counted from the outermost header indexed at 0, and moving inwards toward the 
 * databody would increment the level by 1. The Array case only supports level count of 1.
 * @return {number} the number of levels of the result set
 * @export
 */
oj.ArrayHeaderSet.prototype.getLevelCount = function()
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
oj.ArrayHeaderSet.prototype.getExtent = function(index, level)
{
    oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds'); 
    oj.Assert.assert(level == null || level == 0, 'level out of bounds'); 
    return {'extent': 1, 'more':{'before': false, 'after':false}};
};
 
/**
 * Gets the depth of an index starting at a particular level. The depth is the number 
 * of levels spanned by the header. The Array case only supports depth of 1.
 * @param {number} index the absolute index of the depth to get
 * @param {number=} level the level of the header, 0 is the outermost header
 * @return {number} the number of levels spanned by the header at the specified position
 * @export
 */
oj.ArrayHeaderSet.prototype.getDepth = function(index, level)
{
    oj.Assert.assert(index <= this.m_end && index >= this.m_start, 'index out of bounds'); 
    oj.Assert.assert(level == null || level == 0, 'level out of bounds'); 
    return 1;
};

/**
 * Gets the actual count of the result set, the total indexes spanned by the headerSet
 * along the innermost header.
 * @return {number} the actual count of the result set.  
 * @export
 */
oj.ArrayHeaderSet.prototype.getCount = function()
{
    if (this.m_callback == null)
    {
        return 0;
    }

    return Math.max(0, this.m_end - this.m_start);
};

/**
 * Gets the start index of the result set.
 * @return {number} the start index of the result set.
 * @export
 * @ignore
 */
oj.ArrayHeaderSet.prototype.getStart = function()
{
    return this.m_start;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
 /**
 * A CellSet represents a collection of cells.  The CellSet is an object returned by the success callback
 * of the fetchCells method on DataGridDataSource.  This implementation of CellSet is used by the
 * array DataGridDataSource.   
 * @param {number} startRow the start row index of the cell set
 * @param {number} endRow the end row index of the cell set
 * @param {number} startColumn the start column index of the cell set
 * @param {number} endColumn the end column index of the cell set
 * @param {Object} callback the callback to invoke on to retrieve data and metadata. 
 * @constructor
 * @export
 */
oj.ArrayCellSet = function(startRow, endRow, startColumn, endColumn, callback)
{
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
 * @return {Object} the data object for the specified index.
 * @export
 */
oj.ArrayCellSet.prototype.getData = function(indexes)
{
    return this.m_callback._getCellData(indexes['row'], indexes['column']);
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
 */
oj.ArrayCellSet.prototype.getMetadata = function(indexes)
{
    return this.m_callback._getCellMetadata(indexes['row'], indexes['column']);
};

/**
 * Gets the start index of the result set for the specified axis.  Valid values are "row" and "column".
 * @param {string} axis the axis in which to inquire the actual count of the result set.
 * @return {number} the start index of the result set for the specified axis.  
 * @export
 */
oj.ArrayCellSet.prototype.getStart = function(axis)
{
    if (axis == "row")
    {
        return this.m_startRow;
    }
    else if (axis == "column")
    {
        return this.m_startColumn;
    }

    return -1;
};

/**
 * Gets the actual count of the result set for the specified axis.  Valid values are "row" and "column".
 * @param {string} axis the axis in which to inquire the actual count of the result set.
 * @return {number} the actual count of the result set for the specified axis.  
 * @export
 */
oj.ArrayCellSet.prototype.getCount = function(axis)
{
    if (axis === "row")
    {
        return Math.max(0, this.m_endRow - this.m_startRow);
    }
    
    if (axis === "column")
    {
        return Math.max(0, this.m_endColumn - this.m_startColumn);
    }

    return 0;
};

////// testing methods to get properties //////
/**
 * Gets the start row property for testing
 * @return {number} the start row
 * @export
 * @ignore
 */
oj.ArrayCellSet.prototype.getStartRow = function()
{
    return this.m_startRow;
};

/**
 * Gets the start column property for testing
 * @return {number} the start column
 * @export
 * @ignore
 */
oj.ArrayCellSet.prototype.getStartColumn = function()
{
    return this.m_startColumn;
};
});
