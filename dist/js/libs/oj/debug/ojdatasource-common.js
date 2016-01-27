/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery'], function(oj, $)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/*jslint browser: true*/

/**
 * @export
 * @class oj.DataSource
 * @extends oj.EventSource
 * @classdesc Object representing data used by table and grid components
 * @property {Object} data data supported by the components
 * @param {Object} data data supported by the components
 * @constructor
 */
oj.DataSource = function(data)
{
    this.data = data;
    this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.DataSource, oj.EventSource, "oj.DataSource");

/**
 * Initializes the instance.
 * @export
 */
oj.DataSource.prototype.Init = function()
{
    oj.DataSource.superclass.Init.call(this);
};

/**
 * Determines whether this DataSource supports the specified feature.
 * @method
 * @name getCapability
 * @memberof! oj.DataSource
 * @instance
 * @param {string} feature the feature in which its capabilities is inquired. 
 * @return {string|null} the capability of the specified feature.  Returns null if the feature is not recognized.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * Base class for all tree structure DataSource.  Implementations must implement all of the functions documented here.

 * @param {Object} data data supported by the component
 * @export
 * @extends oj.DataSource
 * @constructor
 */
oj.TreeDataSource = function(data)
{
    oj.TreeDataSource.superclass.constructor.call(this, data);
};


// Subclass TreeDataSource to DataSource
oj.Object.createSubclass(oj.TreeDataSource, oj.DataSource, "oj.TreeDataSource");

/**
 * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
 * that the child count is unknown.
 * @param {Object} parent the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @method
 * @name getChildCount
 * @memberof! oj.TreeDataSource
 * @instance
 */

/**
 * Fetch the children
 * @param {Object} parent the parent key.  Specify null if fetching children from the root.
 * @param {Object} range information about the range, it must contain the following properties: start, count.
 * @param {number} range.start the start index of the range in which the children are fetched.
 * @param {number} range.count the size of the range in which the children are fetched.  
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.NodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} options optional parameters for this operation.
 * @param {boolean=} options.queueOnly true if this fetch request is to be queued and not execute yet.  The implementation must maintain 
 *        the order of the fetch operations.  When queueOnly is false/null/undefined, any queued fetch operations are then
 *        flushed and executed in the order they are queued.  This flag is ignored if the datasource does not support batching.
 * @method
 * @name fetchChildren
 * @memberof! oj.TreeDataSource
 * @instance
 */

/**
 * Fetch all children and their children recursively from a specified parent.
 * @param {Object} parent the parent key.  Specify null to fetch everything from the root (i.e. expand all)
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.NodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch children failed.
 * @param {Object=} options optional parameters for this operation.
 * @param {number=} options.start the index related to parent in which to begin fetching descendants from.  If this is not specified, then 
 * @param {number=} options.maxCount the maximum number of children to fetch.  If a non-positive number is specified, then the value is ignored and
 *        there is no maximum fetch count.
 * @method
 * @name fetchDescendants
 * @memberof! oj.TreeDataSource
 * @instance
 */

/**
 * Performs a sort operation on the tree data.
 * @param {Object} criteria the sort criteria.  It must contain the following properties: key, direction
 * @param {Object} criteria.key the key identifying the attribute (column) to sort on
 *        {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @param {function()} callbacks.success the callback to invoke when the sort completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when sort failed.
 * @method
 * @name sort
 * @memberof! oj.TreeDataSource
 * @instance
 */

/**
 * Returns the current sort criteria of the tree data.
 * @return {Object} the current sort criteria.  It should contain the following properties: key, direction where
 *         criteria.key the key identifying the attribute (column) to sort on.  Value is null if it's not sorted.
 *         criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @method
 * @name getSortCriteria
 * @memberof! oj.TreeDataSource
 * @instance
 */

/**
 * Moves a row from one location to another (different position within the same parent or a completely different parent)
 * @param {Object} rowToMove the key of the row to move
 * @param {Object} referenceRow the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {number|string} position The position of the moved row relative to the reference row.  
 *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position 
 *        the element at a specific point among the reference row's current children.
 * @param {function()} callbacks.success the callback to invoke when the move completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when move failed.
 * @method
 * @name move
 * @memberof! oj.TreeDataSource
 * @instance
 */ 

/**
 * Checks whether a move operation is valid.
 * @param {Object} rowToMove the key of the row to move
 * @param {Object} referenceRow the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {number|string} position The position of the moved row relative to the reference row.  
 *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position 
 *        the element at a specific point among the reference row's current children.
 * @return {string} returns "valid" if the move is valid, "invalid" otherwise.
 * @method
 * @name moveOK
 * @memberof! oj.TreeDataSource
 * @instance
 */ 

/**
 * Determines whether this TreeDataSource supports the specified feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the valid features "sort", 
 *        "move", "fetchDescendants", "batchFetch"
 * @return {string|null} the name of the feature.  Returns null if the feature is not recognized.
 *         For "sort", the valid return values are: "default", "none".  
 *         For "fetchDescendants", the valid return values are: "enable", "disable", "suboptimal".  
 *         For "move", the valid return values are: "default", "none".  
 *         For "batchFetch", the valid return values are: "enable", "disable".  
 * @method
 * @name getCapability
 * @memberof! oj.TreeDataSource
 * @instance
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/*jslint browser: true,devel:true*/
/**
 * @export
 * @class oj.TableDataSource
 * @classdesc Abstract object representing data used by table component.  Implementations of TableDataSource must implement all of the functions documented here.
 * @param {Object} data data supported by the components
 * @param {Object=} options Options for the TableDataSource
 * @constructor
 */
oj.TableDataSource = function(data, options)
{
  if (this.constructor == oj.TableDataSource)
  {
    // This should only be called by the constructors of the subclasses. If you need
    // to initialize a new TableDataSource then call the constructors of the subclasses such
    // as oj.ArrayTableDataSource or oj.CollectionTableDataSource.
    var errSummary = oj.TableDataSource._LOGGER_MSG._ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY;
    var errDetail = oj.TableDataSource._LOGGER_MSG._ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL;
    throw new Error(errSummary + '\n' + errDetail);
  }
  // Initialize
  this.data = data;
  this.options = options;
  this.isFetching = false;
  this._startIndex = 0;
  this.Init();
};

// Subclass from oj.DataSource 
oj.Object.createSubclass(oj.TableDataSource, oj.DataSource, "oj.TableDataSource");

/**
 * Initializes the instance.
 * @export
 * @expose
 * @memberof! oj.TableDataSource
 * @instance
 */
oj.TableDataSource.prototype.Init = function()
{
  oj.TableDataSource.superclass.Init.call(this);
};

/**
 * Return the row data found at the given index.
 * 
 * @param {number} index Index for which to return the row data. 
 * @param {Object=} options Options to control the at.
 * @param {number} options.fetchSize fetch size to use if the call needs to fetch more records from the server, if virtualized.  Overrides the overall fetchSize setting <p>
 * @return {Promise} Promise resolves to a compound object which has the structure below. If the index is out of range, Promise resolves to null.<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>The raw row data</td></tr>
 * <tr><td><b>index</b></td><td>The index for the row</td></tr>
 * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
 * </tbody>
 * </table>
 * @method
 * @name at
 * @memberof! oj.TableDataSource
 * @instance
 */

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
 * @method
 * @name fetch
 * @memberof! oj.TableDataSource
 * @instance
 */

/**
 * Return the first row data whose id value is the given id
 * @param {string} id ID for which to return the row data, if found. 
 * @param {Object=} options Options to control the get.
 * @param {number} options.fetchSize fetch size to use if the call needs to fetch more records from the server, if virtualized.  Overrides the overall fetchSize setting <p>
 * @return {Promise} Promise which resolves to a compound object which has the structure below where the id matches the given id. If none are found, resolves to null.<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>The raw row data</td></tr>
 * <tr><td><b>index</b></td><td>The index for the row</td></tr>
 * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
 * </tbody>
 * </table>
 * @method
 * @name get
 * @memberof! oj.TableDataSource
 * @instance
 */

/**
 * Determines whether this TableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".  
 *         Returns null if the feature is not recognized.
 * @memberof! oj.TableDataSource
 * @instance
 * @method
 * @name getCapability
 */

/**
 * Performs a sort on the data source. Null criteria clears the existing sort.
 * @param {Object} criteria the sort criteria.
 * @param {Object} criteria.key The key that identifies which field to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @return {Promise} promise object triggering done when complete.
 * @method
 * @name sort
 * @memberof! oj.TableDataSource
 * @instance
 */


/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @method
 * @name totalSize
 * @memberof! oj.TableDataSource
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
 * @memberof! oj.TableDataSource
 * @instance 
 */
oj.TableDataSource.prototype.totalSizeConfidence = function()
{ 
  return "actual";
};

/**
 * @export
 * Event types
 * @enum {string}
 */
oj.TableDataSource.EventType =
  {
    /** Triggered when a Row is added to a TableDataSource<p>
     * The event payload contains:<p>
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
     * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
     * <tr><td><b>indexes</b></td><td>An array of index values for the rows in post-insert sorted order</td></tr>
     * </tbody>
     * </table>
     */
    'ADD': "add",
    /** Triggered when a Row is removed from a TableDataSource<p>
     * The event payload contains:<p>
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
     * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
     * <tr><td><b>indexes</b></td><td>An array of index values for the rows in pre-remove sorted order</td></tr>
     * </tbody>
     * </table>
     */
    'REMOVE': "remove",
    /** Triggered when a TableDataSource is reset */
    'RESET': "reset",
    /** Triggered when a TableDataSource is refreshed */
    'REFRESH': "refresh",
    /** Triggered when a TableDataSource is sorted<p>
     * The event payload contains:<p>
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>header</b></td><td>the key of the header which was sorted on</td></tr>		 
     * <tr><td><b>direction</b></td><td>the direction of the sort ascending/descending</td></tr>
     * </tbody>
     * </table>
     */
    'SORT': "sort",
    /** Triggered when a Row's attributes are changed<p>
     * The event payload contains:<p>
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
     * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
     * <tr><td><b>indexes</b></td><td>An array of index values for the rows</td></tr>
     * </tbody>
     * </table>
     */
    'CHANGE': "change",
    /** Triggered when a TableDataSource has sent a fetch request
     * The event payload contains:<p>
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>startIndex</b></td><td>The start index at which the fetch was invoked</td></tr>
     * </tbody>
     * </table>
     */
    'REQUEST': "request",
    /** Triggered when a TableDataSource has been updated by a fetch<p>
     * The event payload contains:<p>
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
     * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
     * <tr><td><b>startIndex</b></td><td>The start index at which the fetch occurred</td></tr>
     * </tbody>
     * </table>
     */
    'SYNC': "sync",
    /** Triggered when an error occurred on the TableDataSource */
    'ERROR': "error"
  };

oj.TableDataSource._LOGGER_MSG =
  {
    '_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY': 'oj.TableDataSource constructor called.',
    '_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL':  'Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.',
    '_ERR_DATA_INVALID_TYPE_SUMMARY':             'Invalid data type.',
    '_ERR_DATA_INVALID_TYPE_DETAIL':              'Please specify the appropriate data type.'
  };
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * The base class for DataGridDataSource.<br>
 * DataGridDataSource implementations must implement all of the functions documented here.
 * @export
 * @extends oj.DataSource
 * @constructor
 */
oj.DataGridDataSource = function(data)
{
    // oj.DataSource would calls Init
    oj.DataGridDataSource.superclass.constructor.call(this, data);
};

// Subclass DataGridDataSource to DataSource
oj.Object.createSubclass(oj.DataGridDataSource, oj.DataSource, "oj.DataGridDataSource");

/**
 * Returns the total number of rows or columns.  If the value return is not >= 0 then it is automatically assumed
 * that the total count is unknown.
 * @param {string} axis the axis in which we inquire for the total count.  Valid values are "row" and "column".
 * @return {number} the total number of rows/columns.
 * @method
 * @name getCount
 * @memberof! oj.DataGridDataSource
 * @instance
 */

/**
 * Returns whether the total count returned in getCount function is an actual or an estimate.
 * @param {string} axis the axis in which we inquire whether the total count is an estimate.  Valid values are 
 *        "row" and "column".
 * @return {string} "exact" if the count returned in getCount function is the actual count, "estimate" if the 
 *         count returned in getCount function is an estimate.  The default value is "exact".
 * @method
 * @name getCountPrecision
 * @memberof! oj.DataGridDataSource
 * @instance
 */


/**
 * Fetch a range of headers from the data source.
 * 
 * @method
 * @name fetchHeaders
 * @memberof! oj.DataGridDataSource
 * @instance
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
 */


/**
 * Fetch a range of cells from the data source.
 * @method
 * @name fetchCells
 * @memberof! oj.DataGridDataSource
 * @instance
 * @param {Array.<Object>} cellRange Information about the cell range.  A cell range is defined by an array 
 *        of range info for each axis, where each range contains three properties: axis, start, count.
 * @param {string} cellRange.axis the axis associated with this range where cells are fetched.  Valid 
 *        values are "row" and "column".
 * @param {number} cellRange.start the start index of the range for this axis in which the cells are fetched.
 * @param {number} cellRange.count the size of the range for this axis in which the cells are fetched. 
 * @param {Object} callbacks the callbacks to be invoke when fetch cells operation is completed.  The valid callback
 *        types are "success" and "error".
 * @param {function(oj.CellSet)} callbacks.success the callback to invoke when fetch cells completed successfully.
 * @param {function({status: Object})} callbacks.error the callback to invoke when fetch cells failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 */

/**
 * Returns the keys based on the indexes. 
 * @method
 * @name keys
 * @memberof! oj.DataGridDataSource
 * @instance
 * @param {Object} indexes the index for each axis
 * @param {Object} indexes.row the index for the row axis
 * @param {Object} indexes.column the index for the column axis
 * @return {Object} a Promise object which when resolved returns an object containing the keys for each axis
 */

/**
 * Returns the row and column index based on the keys.
 * @method
 * @name indexes
 * @memberof! oj.DataGridDataSource
 * @instance
 * @param {Object} keys the key for each axis
 * @param {Object} keys.row the key for the row axis
 * @param {Object} keys.column the key for the column axis
 * @return {Object} a Promise object which when resolved returns an object containing the index for each axis
 */

/**
 * Performs a sort on the data source.
 * @method
 * @name sort
 * @memberof! oj.DataGridDataSource
 * @instance
* @param {Object} criteria the sort criteria.  Specifies null to reset sort state.
 * @param {string} criteria.axis The axis in which the sort is performed, valid values are "row", "column"
 * @param {Object} criteria.key The key that identifies which header to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @param {Object} callbacks the callbacks to be invoke upon completion of the sort operation.  The callback
 *        properties are "success" and "error".
 * @param {function()} callbacks.success the callback to invoke when the sort completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when sort failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" properties.
 */

/**
 * Moves a row from one location to another.
 * @method
 * @name move
 * @memberof! oj.DataGridDataSource
 * @instance
 * @param {Object} rowToMove the key of the row to move
 * @param {Object} referenceRow the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {string} position The position of the moved row relative to the reference row.  
 *        Valid values are: "before", "after" 
 * @param {function()} callbacks.success the callback to invoke when the move completed successfully.  
 * @param {function({status: Object})} callbacks.error the callback to invoke when move failed.
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" properties.
 */ 

/**
 * Checks whether a move operation is valid.
 * @param {Object} rowToMove the key of the row to move
 * @param {Object} referenceRow the key of the reference row which combined with position are used to determine 
 *        the destination of where the row should moved to.
 * @param {string} position The position of the moved row relative to the reference row.  
 *        Valid values are: "before", "after".
 * @return {string} returns "valid" if the move is valid, "invalid" otherwise.
 * @method
 * @name moveOK
 * @memberof! oj.DataGridDataSource
 * @instance
 */ 

/**
 * Determines whether this DataGridDataSource supports certain feature.
 * @method
 * @name getCapability
 * @memberof! oj.DataGridDataSource
 * @instance
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none", "row", "column".  
 *         For "move", the valid return values are: "row", "none".  
 *         Returns null if the feature is not recognized.
 */

});
