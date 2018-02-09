/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
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

/**
 * Subclass from oj.Object 
 * @private
 */
oj.Object.createSubclass(oj.DataSource, oj.EventSource, "oj.DataSource");

/**
 * Initializes the instance.
 * @export
 * @memberof oj.DataSource
 * @return {undefined}
 */
oj.DataSource.prototype.Init = function()
{
    oj.DataSource.superclass.Init.call(this);
};

/**
 * Determines whether this DataSource supports the specified feature.
 * @method
 * @name getCapability
 * @memberof oj.DataSource
 * @instance
 * @param {string} feature the feature in which its capabilities is inquired. 
 * @return {string|null} the capability of the specified feature.  Returns null if the feature is not recognized.
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * @class oj.TreeDataSource
 * @classdesc Abstract class representing hierarchical (tree) data that can be used by different components such as [Indexer]{@link oj.ojIndexer}, [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 * and [TreeView]{@link oj.ojTreeView}.<br><br>
 * This class is not used directly and is used as the base to implement other subclasses.  Implementations of TreeDataSource must implement all of the methods documented here.<br><br>
 * JET provides the following implementations:<br><br>
 * <table class="generic-table">
 *   <thead>
 *     <th>Subclass</th>
 *     <th>When to Use</th>
 *     <th>Use with</th>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>{@link oj.CollectionTreeDataSource}</td>
 *       <td>When the data is available from an {@link oj.Collection} object, such as an external data source.</td>
 *       <td>ListView<br>NavigationList<br>TreeView<br></td>
 *     </tr>
 *     <tr>
 *       <td>{@link oj.IndexerModelTreeDataSource}</td>
 *       <td>When the data has a tree-like structure that is displayed in a ListView with Indexer.</td>
 *       <td>ListView (with Indexer)<br></td>
 *     </tr>
 *     <tr>
 *       <td>{@link oj.JsonTreeDataSource}</td>
 *       <td>When the data is available from an array of JSON objects that represent tree nodes.</td>
 *       <td>ListView<br>NavigationList<br>TreeView<br></td>
 *     </tr>
 *   </tbody>
 * </table>
 * <br>Refer to the documentation and demos of individual components for more information on how to use them with the TreeDataSource subclasses.</br><br>
 * In case specialized behavior is needed, new subclass can be created by using [oj.Object.createSubclass]{@link oj.Object#createSubclass}.  New subclass can be based on 
 * TreeDataSource, in which case all methods must be implemented, or it can be based on an existing subclass, in which case only methods that require different behavior need 
 * to be overridden.
 *            
 * @param {Object} data data supported by the component
 * @export
 * @extends oj.DataSource
 * @constructor
 */
oj.TreeDataSource = function(data)
{
    oj.TreeDataSource.superclass.constructor.call(this, data);
};


/**
 * Subclass TreeDataSource to DataSource
 * @private
 */
oj.Object.createSubclass(oj.TreeDataSource, oj.DataSource, "oj.TreeDataSource");

/**
 * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
 * that the child count is unknown.
 * @param {Object} parent the parent key.  Specify null if inquiring child count of the root.
 * @return {number} the number of children for the specified parent.
 * @method
 * @name getChildCount
 * @memberof oj.TreeDataSource
 * @instance
 */

/**
 * Fetch the children
 * @param {Object} parent the parent key.  Specify null if fetching children from the root.
 * @param {Object} range information about the range, it must contain the following properties: start, count.<p>
 * start: the start index of the range in which the children are fetched.<br>
 * count: the size of the range in which the children are fetched.<br>
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".<p>
 * success: the callback to invoke when fetch completed successfully.<br>
 * error: the callback to invoke when fetch children failed.<br>
 * @param {Object=} options optional parameters for this operation.<p>
 * queueOnly: true if this fetch request is to be queued and not execute yet.  The implementation must maintain 
 *        the order of the fetch operations.  When queueOnly is false/null/undefined, any queued fetch operations are then
 *        flushed and executed in the order they are queued.  This flag is ignored if the datasource does not support batching.<br>
 * @return {Object} children
 * @method
 * @name fetchChildren
 * @memberof oj.TreeDataSource
 * @instance
 */

/**
 * Fetch all children and their children recursively from a specified parent.
 * @param {Object} parent the parent key.  Specify null to fetch everything from the root (i.e. expand all)
 * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
 *        types are "success" and "error".<p>
 * success: the callback to invoke when fetch completed successfully.<br>
 * error: the callback to invoke when fetch children failed.<br>
 * @param {Object=} options optional parameters for this operation.<p>
 * start: the index related to parent in which to begin fetching descendants from.  If this is not specified, then value zero will be used.<br>
 * maxCount: the maximum number of children to fetch.  If a non-positive number is specified, then the value is ignored and
 *        there is no maximum fetch count.<br>
 * @return {Object} descendants
 * @method
 * @name fetchDescendants
 * @memberof oj.TreeDataSource
 * @instance
 */

/**
 * Performs a sort operation on the tree data.
 * @param {Object} criteria the sort criteria.  It must contain the following properties: key, direction.<p>
 * key: the key identifying the attribute (column) to sort on.<br>
 * direction: the sort direction, valid values are "ascending", "descending", "none" (default)<br>
 * @param {Object} callbacks callbacks for the sort operation<p>
 * success: the callback to invoke when the sort completed successfully.<br>
 * error: the callback to invoke when sort failed.<br>
 * @return {undefined}
 * @method
 * @name sort
 * @memberof oj.TreeDataSource
 * @instance
 */

/**
 * Returns the current sort criteria of the tree data.
 * @return {Object} the current sort criteria.  It should contain the following properties: key, direction where
 *         criteria.key the key identifying the attribute (column) to sort on.  Value is null if it's not sorted.
 *         criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @method
 * @name getSortCriteria
 * @memberof oj.TreeDataSource
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
 * @param {Object} callbacks the callbacks for the move function<p>
 * success: the callback to invoke when the move completed successfully.<br>
 * error: the callback to invoke when move failed.<br>
 * @return {undefined}
 * @method
 * @name move
 * @memberof oj.TreeDataSource
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
 * @memberof oj.TreeDataSource
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
 * @memberof oj.TreeDataSource
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
 * @classdesc Abstract class representing tabular data that can be used by different components such as [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 * [PagingControl]{@link oj.ojPagingControl}, [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 * This class is not used directly and is used as the base to implement other subclasses.  Implementations of TableDataSource must implement all of the methods documented here.<br><br>
 * JET provides the following implementations:<br><br>
 * <table class="generic-table">
 *   <thead>
 *     <th>Subclass</th>
 *     <th>When to Use</th>
 *     <th>Use with</th>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>{@link oj.ArrayTableDataSource}</td>
 *       <td>When the data is available from an array.</td>
 *       <td>ListView<br>NavigationList<br>TabBar<br>Table<br></td>
 *     </tr>
 *     <tr>
 *       <td>{@link oj.CollectionTableDataSource}</td>
 *       <td>When the data is available from an {@link oj.Collection} object, such as an external data source.</td>
 *       <td>ListView<br>NavigationList<br>TabBar<br>Table<br></td>
 *     </tr>
 *     <tr>
 *       <td>{@link oj.FlattenedTreeTableDataSource}</td>
 *       <td>When the data has a tree-like structure that is displayed in a Table with RowExpander.</td>
 *       <td>Table (with RowExpander)<br></td>
 *     </tr>
 *     <tr>
 *       <td>{@link oj.PagingTableDataSource}</td>
 *       <td>When paging functionality is needed on top of other TableDataSource implementations.</td>
 *       <td>ListView<br>PagingControl<br>Table<br></td>
 *     </tr>
 *   </tbody>
 * </table>
 * <br>Refer to the documentation and demos of individual components for more information on how to use them with the TableDataSource subclasses.</br><br>
 * In case specialized behavior is needed, new subclass can be created by using [oj.Object.createSubclass]{@link oj.Object#createSubclass}.  New subclass can be based on 
 * TableDataSource, in which case all methods must be implemented, or it can be based on an existing subclass, in which case only methods that require different behavior need 
 * to be overridden.
 *            
 * @extends oj.DataSource
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

/**
 * Subclass from oj.DataSource 
 * @private
 */
oj.Object.createSubclass(oj.TableDataSource, oj.DataSource, "oj.TableDataSource");

/**
 * Initializes the instance.
 * @memberof oj.TableDataSource
 * @instance
 * @override
 * @protected
 */
oj.TableDataSource.prototype.Init = function()
{
  oj.TableDataSource.superclass.Init.call(this);
};

/**
 * @export
 * @expose
 * @memberof oj.TableDataSource
 * @desc The sort criteria. Whenever sort() is called with the criteria parameter, that value is copied to this
 * property. If sort() is called with empty sort criteria then the criteria set in this property is used.
 * 
 * @type {Object} 
 * @property {Object} criteria.key The key that identifies which field to sort
 * @property {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 */
oj.TableDataSource.prototype.sortCriteria = null;

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
 * @method
 * @name at
 * @memberof oj.TableDataSource
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
 * @memberof oj.TableDataSource
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
 * @memberof oj.TableDataSource
 * @instance
 */

/**
 * Determines whether this TableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".  
 *         Returns null if the feature is not recognized.
 * @memberof oj.TableDataSource
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
 * @memberof oj.TableDataSource
 * @instance
 */


/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @method
 * @name totalSize
 * @memberof oj.TableDataSource
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
 * @memberof oj.TableDataSource
 * @instance 
 */
oj.TableDataSource.prototype.totalSizeConfidence = function()
{ 
  return "actual";
};

/**
 * Events which are published by TableDataSource. Any custom TableDataSource
 * implementation must publish the corresponding events.
 * @export
 * Event types
 * @enum {string}
 * @memberof oj.TableDataSource
 */
oj.TableDataSource.EventType =
  {
    /** Triggered when a Row has been added to a TableDataSource<p>
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
    /** Triggered when a Row has been removed from a TableDataSource<p>
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
    /** Triggered when a TableDataSource has been reset */
    'RESET': "reset",
    /** Triggered when a TableDataSource has been refreshed */
    'REFRESH': "refresh",
    /** Triggered when a TableDataSource has been sorted<p>
     * The event payload contains:<p>
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>header</b></td><td>the key of the header which was sorted on</td></tr>		 
     * <tr><td><b>direction</b></td><td>the direction of the sort ascending/descending</td></tr>
     * </tbody>
     * </table>
     */
    'SORT': "sort",
    /** Triggered when a Row's attributes have been changed<p>
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
    /** Triggered when a TableDataSource has sent a fetch request. It is expected that
     * a component using TableDataSource will go into a busy state upon receiving
     * this event.
     * The event payload contains:<p>
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>startIndex</b></td><td>The start index at which the fetch was invoked</td></tr>
     * </tbody>
     * </table>
     */
    'REQUEST': "request",
    /** Triggered when a TableDataSource has been updated by a fetch. It is expected that
     * a component using TableDataSource will exit busy state upon completion of rendering
     * after receiving this event.<p>
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

/**
 * @private
 */
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
 * @class oj.DiagramDataSource
 * @classdesc Base class for Diagram DataSource.  Implementations must implement all of the functions documented here.
 * @param {Object} data data required by the DiagramDataSource implementation
 * @export
 * @extends oj.DataSource
 * @constructor
 */
oj.DiagramDataSource = function(data)
{
    oj.DiagramDataSource.superclass.constructor.call(this, data);
};


/**
 * Subclass DiagramDataSource to DataSource
 * @private
 */
oj.Object.createSubclass(oj.DiagramDataSource, oj.DataSource, "oj.DiagramDataSource");

/**
 * Object that defines diagram node. The object might also have additional custom properties that can be 
 * mapped to node styles (see {@link oj.ojDiagram#nodeProperties}) 
 * or used during Diagram layout (see {@link oj.DvtDiagramLayoutContextNode#getData}).
 * @typedef {Object} NodeObject
 * @memberof oj.DiagramDataSource
 * @property {string} id Node id
 * @property {Array.<string>=} categories An optional array of additional category strings corresponding to the node.
 * @property {string=} label Node label
 * @property {Array.<object>=} nodes An array of objects with properties for the child nodes.
 *                     Set value to null to indicate leaf node, if child nodes could be fetched on container disclosure.
 *                     Set value to 'undefined' to indicate potential child nodes, if the child nodes should be fetched on container disclosure.
 * @property {string=} selectable Specifies whether or not the node will be selectable. Acceptable values are 'off' and 'auto'. Default value is 'auto'
 * @property {string=} shortDesc  The description of the node. This is used for accessibility and also for customizing the tooltip text.
 */
 
/**
 * Object that defines diagram link. The object might also have additional custom properties that can be 
 * mapped to link styles (see {@link oj.ojDiagram#linkProperties})
 * or used during Diagram layout (see {@link oj.DvtDiagramLayoutContextLink#getData}).
 * @typedef {Object} LinkObject
 * @memberof oj.DiagramDataSource
 * @property {string} id Link id
 * @property {string} startNode Start node id.
 * @property {string} endNode End node id.
 * @property {Array.<string>=} categories An optional array of additional category strings corresponding to the link.
 * @property {string=} label Link label
 * @property {string=} selectable Specifies whether or not the node will be selectable. Acceptable values are 'off' and 'auto'. Default value is 'auto'
 * @property {string=} shortDesc  The description of the node. This is used for accessibility and also for customizing the tooltip text.
 */

/**
 * Returns child data for the given parent.
 * The data include all immediate child nodes along with links whose endpoints
 * both descend from the current parent node. 
 * If all the links are available upfront, they can be returned as part of the
 * top-level data (since all nodes descend from the diagram root).
 * If lazy-fetching links is desirable, the most
 * optimal way to return links is as part of the data of the
 * nearest common ancestor of the link's endpoints.
 *
 * @param {Object|null} parentData An object that contains data for the parent node. See {@link oj.DiagramDataSource.NodeObject} section.
 *                     If parentData is null, the method retrieves data for top level nodes.
 * @return {Promise} Promise resolves to a component object with the following structure:<p>
 * <table>
 * <tbody>
 * <tr><td><b>nodes</b></td><td>An array of objects for the child nodes for the given parent.
 *              See {@link oj.DiagramDataSource.NodeObject} section.</td></tr>
 * <tr><td><b>links</b></td><td>An array of objects for the links for the given parent.
 *              See {@link oj.DiagramDataSource.LinkObject} section.</td></tr>
 * </tbody>
 * </table>
 * @method
 * @name getData
 * @memberof oj.DiagramDataSource
 * @instance
 */
 
/**
 * Retrieves number of child nodes
 * @param {Object} nodeData A data object for the node in question.
 *                          See {@link oj.DiagramDataSource.NodeObject} section.
 * @return {number} Number of child nodes if child count is available.
 *                  The method returns 0 for leaf nodes.
 *                  The method returns -1 if the child count is unknown
 *                  (e.g. if the children have not been fetched).
 * @method
 * @name getChildCount
 * @memberof oj.DiagramDataSource
 * @instance
 */
 
/**
 * Indicates whether the specified object contains links
 * that should be discovered in order to display promoted links.
 *
 * @param {Object} nodeData A data object for the container node in question.
 *                          See {@link oj.DiagramDataSource.NodeObject} section
 * @return {string} the valid values are "connected", "disjoint", "unknown"
 * @method
 * @name getDescendantsConnectivity
 * @memberof oj.DiagramDataSource
 * @instance
 */
 
 /**
 * @export
 * Event types
 * @enum {string}
 * @memberof oj.DiagramDataSource
 */
oj.DiagramDataSource.EventType =
{
  /** 
   * Triggered when nodes or links are added to DiagramDataSource.<p>
   * The event payload contains.<p>
   *
   * <table cellspacing="0" style="border-collapse: collapse;">
   * <tbody>
   * <tr><td><b>data</b></td><td>Object</td><td>An object with the following properties:
   *  <ul>
   *    <li>nodes: An array of node objects. See {@link oj.DiagramDataSource.NodeObject} section.</li>
   *    <li>links: An array of link objects. See {@link oj.DiagramDataSource.LinkObject} section.</li>
   *  </ul>
   * </td></tr>
   * <tr><td><b>parentId</b></td><td>string</td><td>parent id for nodes and links</td></tr>
   * <tr><td><b>index</b></td><td>number</td><td>An index where the nodes should be added</td></tr>
   * </tbody>
   * </table>
   */
  'ADD': "add",
  /**
   * Triggered when nodes or links are removed from DiagramDataSource.
   * The event payload contains:<p>
   *
   * <table cellspacing="0" style="border-collapse: collapse;">
   * <tbody>
   * <tr><td><b>data</b></td><td>Object</td><td>An object with the following properties:
   *  <ul>
   *    <li>nodes: An array of node objects. See {@link oj.DiagramDataSource.NodeObject} section.</li>
   *    <li>links: An array of link objects. See {@link oj.DiagramDataSource.LinkObject} section.</li>
   *  </ul>
   * </td></tr>
   * <tr><td><b>parentId</b></td><td>string</td><td>parent id for nodes and links</td></tr>
   * </tbody>
   * </table>
   */
  'REMOVE': "remove",
  /**
   * Triggered when nodes or links are removed from DiagramDataSource.
   * The event payload contains:<p>
   *
   * <table cellspacing="0" style="border-collapse: collapse;">
   * <tbody>
   * <tr><td><b>data</b></td><td>Object</td><td>An object with the following properties:
   *  <ul>
   *    <li>nodes: An array of node objects. See {@link oj.DiagramDataSource.NodeObject} section.</li>
   *    <li>links: An array of link objects. See {@link oj.DiagramDataSource.LinkObject} section.</li>
   *  </ul>
   * </td></tr>
   * </tbody>
   * </table>
   */
  'CHANGE': "change"
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * @class oj.DataGridDataSource
 * @classdesc The base class for DataGridDataSource.<br>
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

/**
 * Subclass DataGridDataSource to DataSource
 * @private
 */
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
 *        axis, start, count.<p>
 *        axis: the axis of the header that are fetched.  Valid values are "row" and "column".<br>
 *        start: the start index of the range in which the header data are fetched.<br>
 *        count: count the size of the range in which the header data are fetched.<br>
 * @param {Object} callbacks the callbacks to be invoke when fetch headers operation is completed.  The valid callback
 *        types are "success" and "error".<p>
 *        success: success the callback to invoke when fetch headers completed successfully.<br>
 *        The function takes three paramaters: HeaderSet object representing start headers, headerRange object passed into the original fetchHeaders call,
 *        and a HeaderSet object representing the end headers along the axis.<br>
 *        error: error the callback to invoke when fetch cells failed.<br>
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @return {Object} the range of headers
 */


/**
 * Fetch a range of cells from the data source.
 * @method
 * @name fetchCells
 * @memberof oj.DataGridDataSource
 * @instance
 * @param {Array.<Object>} cellRange Information about the cell range.  A cell range is defined by an array 
 *        of range info for each axis, where each range contains three properties: axis, start, count.<p>
 *        axis: the axis associated with this range where cells are fetched.  Valid 
 *        values are "row" and "column".<br>
 *        start: the start index of the range for this axis in which the cells are fetched.<br>
 *        count: count the size of the range for this axis in which the cells are fetched. <br>
 * @param {Object} callbacks the callbacks to be invoke when fetch cells operation is completed.  The valid callback
 *        types are "success" and "error".<p>
 * success: the callback to invoke when fetch cells completed successfully.<br>
 * error: the callback to invoke when fetch cells failed.<br>
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" keys.
 * @return {Object} the range of cells
 */

/**
 * Returns the keys based on the indexes. 
 * @method
 * @name keys
 * @memberof! oj.DataGridDataSource
 * @instance
 * @param {Object} indexes the index for each axis<p>
 * row: the index for the row axis<br>
 * column: the index for the column axis<br>
 * @return {Object} a Promise object which when resolved returns an object containing the keys for each axis
 */

/**
 * Returns the row and column index based on the keys.
 * @method
 * @name indexes
 * @memberof! oj.DataGridDataSource
 * @instance
 * @param {Object} keys the key for each axis<p>
 * row: row the key for the row axis<br>
 * column: the key for the column axis<br>
 * @return {Object} a Promise object which when resolved returns an object containing the index for each axis
 */

/**
 * Performs a sort on the data source.
 * @method
 * @name sort
 * @memberof! oj.DataGridDataSource
 * @instance
 * @param {Object} criteria the sort criteria.  Specifies null to reset sort state.<p>
 * axis: The axis in which the sort is performed, valid values are "row", "column"<br>
 * key: The key that identifies which header to sort<br>
 * direction: the sort direction, valid values are "ascending", "descending", "none" (default)<br>
 * @param {Object} callbacks the callbacks to be invoke upon completion of the sort operation.  The callback
 *        properties are "success" and "error".<p>
 * success: the callback to invoke when the sort completed successfully.<br>
 * error: the callback to invoke when sort failed.<br>
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" properties.
 * @return {undefined}
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
 * @param {Object} callbacks for the move function
 * success: the callback to invoke when the move completed successfully.<br>
 * error: the callback to invoke when move failed.<br>
 * @param {Object=} callbackObjects the object in which the callback function is invoked on.  This is optional.  
 *        You can specify the callback object for each callbacks using the "success" and "error" properties.
 * @return {undefined}
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
