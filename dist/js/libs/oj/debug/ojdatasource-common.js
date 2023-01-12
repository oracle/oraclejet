/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojcore'], function (exports, oj$1, oj$2) { 'use strict';

  oj$1 = oj$1 && Object.prototype.hasOwnProperty.call(oj$1, 'default') ? oj$1['default'] : oj$1;
  oj$2 = oj$2 && Object.prototype.hasOwnProperty.call(oj$2, 'default') ? oj$2['default'] : oj$2;

  /**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */

  /* jslint browser: true*/

  /**
   * @export
   * @class DataSource
   * @extends EventSource
   * @classdesc Object representing data used by table and grid components
   * @param {Object} data data supported by the components
   * @constructor
   * @final
   * @since 1.0
   * @abstract
   * @ojdeprecated {since: '5.0.0', description: 'Use DataProvider instead.'}
   * @ojtsignore
   */
  const DataSource = function (data) {
    this.data = data;
    this.Init();
  };
  oj$1._registerLegacyNamespaceProp('DataSource', DataSource);
  /**
   * Subclass from oj.Object
   * @private
   */
  oj$1.Object.createSubclass(DataSource, oj$1.EventSource, 'oj.DataSource');

  /**
   * Initializes the instance.
   * @export
   * @memberof DataSource
   * @return {undefined}
   * @ojtsignore
   */
  DataSource.prototype.Init = function () {
    DataSource.superclass.Init.call(this);
  };

  /**
   * Determines whether this DataSource supports the specified feature.
   * @method
   * @name getCapability
   * @memberof DataSource
   * @instance
   * @param {string} feature the feature in which its capabilities is inquired.
   * @return {string|null} the capability of the specified feature.  Returns null if the feature is not recognized.
   */

  /**
   * @class DataGridDataSource
   * @classdesc The base class for DataGridDataSource.<br>
   * DataGridDataSource implementations must implement all of the functions documented here.
   * @export
   * @extends DataSource
   * @constructor
   * @final
   * @since 1.0
   * @ojtsignore
   */
  const DataGridDataSource = function (data) {
    // DataSource would calls Init
    DataGridDataSource.superclass.constructor.call(this, data);
  };
  oj$2._registerLegacyNamespaceProp('DataGridDataSource', DataGridDataSource);
  /**
   * Subclass DataGridDataSource to DataSource
   * @private
   */
  oj$2.Object.createSubclass(DataGridDataSource, oj$2.DataSource, 'oj.DataGridDataSource');

  /**
   * Returns the total number of rows or columns.  If the value return is not >= 0 then it is automatically assumed
   * that the total count is unknown.
   * @param {string} axis the axis in which we inquire for the total count.  Valid values are "row" and "column".
   * @return {number} the total number of rows/columns.
   * @method
   * @name getCount
   * @memberof DataGridDataSource
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
   * @memberof DataGridDataSource
   * @instance
   */

  /**
   * Fetch a range of headers from the data source.
   * @export
   * @method
   * @name fetchHeaders
   * @memberof DataGridDataSource
   * @instance
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
   * @return {undefined}
   */

  /**
   * Fetch a range of cells from the data source.
   * @method
   * @name fetchCells
   * @memberof DataGridDataSource
   * @instance
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
   * @return {undefined}
   */

  /**
   * Returns the keys based on the indexes.
   * @method
   * @name keys
   * @memberof DataGridDataSource
   * @instance
   * @param {Object} indexes the index for each axis
   * @property {number|null} indexes.row the index for the row axis
   * @property {number|null} indexes.column the index for the column axis
   * @return {Promise.<Object>} a Promise object which when resolved returns an object containing the keys for each axis
   */

  /**
   * Returns the row and column index based on the keys.
   * @method
   * @name indexes
   * @memberof DataGridDataSource
   * @instance
   * @param {Object} keys the key for each axis
   * @property {any} keys.row the key for the row axis
   * @property {any} keys.column the key for the column axis
   * @return {Promise.<Object>} a Promise object which when resolved returns an object containing the index for each axis
   */

  /**
   * Performs a sort on the data source.
   * @method
   * @name sort
   * @memberof DataGridDataSource
   * @instance
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
   * @return {undefined}
   */

  /**
   * Moves a row from one location to another.
   * @method
   * @name move
   * @memberof DataGridDataSource
   * @instance
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
   * @return {undefined}
   */

  /**
   * Checks whether a move operation is valid.
   * @param {any} rowToMove the key of the row to move
   * @param {any} referenceRow the key of the reference row which combined with position are used to determine
   *        the destination of where the row should moved to.
   * @param {string} position the position of the moved row relative to the reference row.
   * @return {string} returns "valid" if the move is valid, "invalid" otherwise.
   * @method
   * @name moveOK
   * @memberof DataGridDataSource
   * @instance
   */

  /**
   * Determines whether this DataGridDataSource supports certain feature.
   * @method
   * @name getCapability
   * @memberof DataGridDataSource
   * @instance
   * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
   * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none", "row", "column".
   *         For "move", the valid return values are: "row", "none".
   *         Returns null if the feature is not recognized.
   */

  /**
   * @class DiagramDataSource
   * @classdesc Base class for Diagram DataSource.  Implementations must implement all of the functions documented here.
   * @param {Object} data data required by the DiagramDataSource implementation
   * @export
   * @extends DataSource
   * @constructor
   * @final
   * @since 3.0
   * @ojtsignore
   * @ojdeprecated {since: '14.0.0', description: 'DiagramDataSource has been deprecated with the oj-diagram data property,
   * use DataProvider on nodeData and linkData oj-diagram attributes instead.'}
   */
  const DiagramDataSource = function (data) {
    DiagramDataSource.superclass.constructor.call(this, data);
  };
  oj$1._registerLegacyNamespaceProp('DiagramDataSource', DiagramDataSource);

  /**
   * Subclass DiagramDataSource to DataSource
   * @private
   */
  oj$1.Object.createSubclass(DiagramDataSource, oj$1.DataSource, 'oj.DiagramDataSource');

  /**
   * Object that defines diagram node. The object might also have additional custom properties that can be
   * mapped to node styles (see {@link oj.ojDiagram#nodeProperties})
   * or used during Diagram layout (see {@link oj.DvtDiagramLayoutContextNode#getData}).
   * @typedef {Object} NodeObject
   * @memberof DiagramDataSource
   * @property {string} id Node id
   * @property {Array.<string>=} categories An optional array of additional category strings corresponding to the node.
   * @property {string=} label The label for the node. If the string contains new line characters, a multi-line label will be rendered.
   * @property {Array.<Object>=} nodes An array of objects with properties for the child nodes.
   *                     Set value to null to indicate leaf node, if child nodes could be fetched on container disclosure.
   *                     Set value to 'undefined' to indicate potential child nodes, if the child nodes should be fetched on container disclosure.
   * @property {string=} selectable Specifies whether or not the node will be selectable. Acceptable values are 'off' and 'auto'. Default value is 'auto'
   * @property {string=} draggable  Specifies whether or not the node will be draggable. Acceptable values are 'off' and 'auto'. Default value is 'auto'
   * @property {string=} shortDesc  The description of the node. This is used for accessibility and also for customizing the tooltip text.
   */

  /**
   * Object that defines diagram link. The object might also have additional custom properties that can be
   * mapped to link styles (see {@link oj.ojDiagram#linkProperties})
   * or used during Diagram layout (see {@link oj.DvtDiagramLayoutContextLink#getData}).
   * @typedef {Object} LinkObject
   * @memberof DiagramDataSource
   * @property {string} id Link id
   * @property {string} startNode Start node id.
   * @property {string} endNode End node id.
   * @property {Array.<string>=} categories An optional array of additional category strings corresponding to the link.
   * @property {string=} label The label for the link. If the string contains new line characters, a multi-line label will be rendered.
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
   * @param {Object|null} parentData An object that contains data for the parent node. See {@link DiagramDataSource.NodeObject} section.
   *                     If parentData is null, the method retrieves data for top level nodes.
   * @return {Promise} Promise resolves to a component object with the following structure:<p>
   * <table>
   * <tbody>
   * <tr><td><b>nodes</b></td><td>An array of objects for the child nodes for the given parent.
   *              See {@link DiagramDataSource.NodeObject} section.</td></tr>
   * <tr><td><b>links</b></td><td>An array of objects for the links for the given parent.
   *              See {@link DiagramDataSource.LinkObject} section.</td></tr>
   * </tbody>
   * </table>
   * @method
   * @name getData
   * @memberof DiagramDataSource
   * @instance
   */

  /**
   * Retrieves number of child nodes
   * @param {Object} nodeData A data object for the node in question.
   *                          See {@link DiagramDataSource.NodeObject} section.
   * @return {number} Number of child nodes if child count is available.
   *                  The method returns 0 for leaf nodes.
   *                  The method returns -1 if the child count is unknown
   *                  (e.g. if the children have not been fetched).
   * @method
   * @name getChildCount
   * @memberof DiagramDataSource
   * @instance
   */

  /**
   * Indicates whether the specified object contains links
   * that should be discovered in order to display promoted links.
   *
   * @param {Object} nodeData A data object for the container node in question.
   *                          See {@link DiagramDataSource.NodeObject} section
   * @return {string} the valid values are "connected", "disjoint", "unknown"
   * @method
   * @name getDescendantsConnectivity
   * @memberof DiagramDataSource
   * @instance
   */

  /**
   * @export
   * Event types
   * @enum {string}
   * @memberof DiagramDataSource
   */
  DiagramDataSource.EventType = {
    /**
     * Triggered when nodes or links are added to DiagramDataSource.<p>
     * The event payload contains.<p>
     *
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>data</b></td><td>Object</td><td>An object with the following properties:
     *  <ul>
     *    <li>nodes: An array of node objects. See {@link DiagramDataSource.NodeObject} section.</li>
     *    <li>links: An array of link objects. See {@link DiagramDataSource.LinkObject} section.</li>
     *  </ul>
     * </td></tr>
     * <tr><td><b>parentId</b></td><td>string</td><td>parent id for nodes and links</td></tr>
     * <tr><td><b>index</b></td><td>number</td><td>An index where the nodes should be added</td></tr>
     * </tbody>
     * </table>
     */
    ADD: 'add',
    /**
     * Triggered when nodes or links are removed from DiagramDataSource.
     * The event payload contains:<p>
     *
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>data</b></td><td>Object</td><td>An object with the following properties:
     *  <ul>
     *    <li>nodes: An array of node objects. See {@link DiagramDataSource.NodeObject} section.</li>
     *    <li>links: An array of link objects. See {@link DiagramDataSource.LinkObject} section.</li>
     *  </ul>
     * </td></tr>
     * <tr><td><b>parentId</b></td><td>string</td><td>parent id for nodes and links</td></tr>
     * </tbody>
     * </table>
     */
    REMOVE: 'remove',
    /**
     * Triggered when nodes or links are removed from DiagramDataSource.
     * The event payload contains:<p>
     *
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>data</b></td><td>Object</td><td>An object with the following properties:
     *  <ul>
     *    <li>nodes: An array of node objects. See {@link DiagramDataSource.NodeObject} section.</li>
     *    <li>links: An array of link objects. See {@link DiagramDataSource.LinkObject} section.</li>
     *  </ul>
     * </td></tr>
     * </tbody>
     * </table>
     */
    CHANGE: 'change'
  };

  /**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */

  /* jslint browser: true,devel:true*/

  /**
   * @export
   * @class TableDataSource
   * @abstract
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
   *       <td>{@link ArrayTableDataSource}</td>
   *       <td>When the data is available from an array.</td>
   *       <td>ListView<br>NavigationList<br>TabBar<br>Table<br></td>
   *     </tr>
   *     <tr>
   *       <td>{@link CollectionTableDataSource}</td>
   *       <td>When the data is available from an {@link Collection} object, such as an external data source.</td>
   *       <td>ListView<br>NavigationList<br>TabBar<br>Table<br></td>
   *     </tr>
   *     <tr>
   *       <td>{@link oj.FlattenedTreeTableDataSource}</td>
   *       <td>When the data has a tree-like structure that is displayed in a Table with RowExpander.</td>
   *       <td>Table (with RowExpander)<br></td>
   *     </tr>
   *     <tr>
   *       <td>{@link PagingTableDataSource}</td>
   *       <td>When paging functionality is needed on top of other TableDataSource implementations.</td>
   *       <td>ListView<br>PagingControl<br>Table<br></td>
   *     </tr>
   *   </tbody>
   * </table>
   * <br>Refer to the documentation and demos of individual components for more information on how to use them with the TableDataSource subclasses.</br><br>
   * In case specialized behavior is needed, new subclass can be created by using [oj.Object.createSubclass]{@link oj.Object.createSubclass}.  New subclass can be based on
   * TableDataSource, in which case all methods must be implemented, or it can be based on an existing subclass, in which case only methods that require different behavior need
   * to be overridden.
   *
   * @extends DataSource
   * @param {Object} data data supported by the components
   * @param {Object=} options Options for the TableDataSource
   * @constructor
   * @final
   * @since 1.0
   * @ojdeprecated {since: '5.0.0', description: 'Use DataProvider instead.'}
   * @ojtsignore
   */
  const TableDataSource = function (data, options) {
    if (this.constructor === TableDataSource) {
      // This should only be called by the constructors of the subclasses. If you need
      // to initialize a new TableDataSource then call the constructors of the subclasses such
      // as oj.ArrayTableDataSource or oj.CollectionTableDataSource.
      var errSummary = TableDataSource._LOGGER_MSG._ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY;
      var errDetail = TableDataSource._LOGGER_MSG._ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL;
      throw new Error(errSummary + '\n' + errDetail);
    }
    // Initialize
    this.data = data;
    this.options = options;
    this.isFetching = false;
    this._startIndex = 0;
    this.Init();
  };
  oj$2._registerLegacyNamespaceProp('TableDataSource', TableDataSource);

  /**
   * Subclass from oj.DataSource
   * @private
   */
  oj$2.Object.createSubclass(TableDataSource, oj$2.DataSource, 'oj.TableDataSource');

  /**
   * Initializes the instance.
   * @memberof TableDataSource
   * @instance
   * @override
   * @protected
   */
  TableDataSource.prototype.Init = function () {
    TableDataSource.superclass.Init.call(this);
  };

  /**
   * @export
   * @expose
   * @memberof TableDataSource
   * @desc The sort criteria. Whenever sort() is called with the criteria parameter, that value is copied to this
   * property. If sort() is called with empty sort criteria then the criteria set in this property is used.
   *
   * @type {Object}
   * @property {any} criteria.key The key that identifies which field to sort
   * @property {'ascending'|'descending'|'none'} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
   */
  TableDataSource.prototype.sortCriteria = null;

  /**
   * Return the row data found at the given index.
   *
   * @param {number} index Index for which to return the row data.
   * @param {Object=} options Options to control the at.
   * @return {Promise.<null|TableDataSource.RowData>} Promise resolves to a compound object which has the structure below. If the index is out of range, Promise resolves to null.<p>
   * <table>
   * <tbody>
   * <tr><td><b>data</b></td><td>The raw row data</td></tr>
   * <tr><td><b>index</b></td><td>The index for the row</td></tr>
   * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
   * </tbody>
   * </table>
   * @method
   * @name at
   * @memberof TableDataSource
   * @instance
   */

  /**
   * Fetch the row data.
   * @param {Object=} options Options to control fetch
   * @property {number} [options.startIndex] The index at which to start fetching records.
   * @property {boolean} [options.silent] If set, do not fire a sync event.
   * @return {Promise.<null|TableDataSource.RowDatas>} Promise object resolves to a compound object which contains an array of row data objects, an array of ids, and the startIndex triggering done when complete.<p>
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
   * @memberof TableDataSource
   * @instance
   */

  /**
   * Return the first row data whose id value is the given id
   * @param {string} id ID for which to return the row data, if found.
   * @param {Object=} options Options to control the get.
   * @return {Promise.<null|TableDataSource.RowData>} Promise which resolves to a compound object which has the structure below where the id matches the given id. If none are found, resolves to null.<p>
   * <table>
   * <tbody>
   * <tr><td><b>data</b></td><td>The raw row data</td></tr>
   * <tr><td><b>index</b></td><td>The index for the row</td></tr>
   * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
   * </tbody>
   * </table>
   * @method
   * @name get
   * @memberof TableDataSource
   * @instance
   */

  /**
   * Determines whether this TableDataSource supports certain feature.
   * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
   * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".
   *         Returns null if the feature is not recognized.
   * @memberof TableDataSource
   * @instance
   * @method
   * @name getCapability
   */

  /**
   * Performs a sort on the data source. Null criteria clears the existing sort.
   * @param {Object} [criteria] the sort criteria.
   * @property {any} criteria.key The key that identifies which field to sort
   * @property {'ascending'|'descending'|'none'} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
   * @return {Promise.<null>} promise object triggering done when complete.
   * @method
   * @name sort
   * @memberof TableDataSource
   * @instance
   */

  /**
   * Return the total size of data available, including server side if not local.
   * @returns {number} total size of data
   * @method
   * @name totalSize
   * @memberof TableDataSource
   * @instance
   */

  /**
   * Returns the confidence for the totalSize value.
   * @return {string} "actual" if the totalSize is the time of the fetch is an exact number
   *                  "estimate" if the totalSize is an estimate
   *                  "atLeast" if the totalSize is at least a certain number
   *                  "unknown" if the totalSize is unknown
   * @ojsignature {target: "Type", for: "returns", value: "'actual'|'estimate'|'atLeast'|'unknown'"}
   * @export
   * @expose
   * @memberof TableDataSource
   * @instance
   */
  TableDataSource.prototype.totalSizeConfidence = function () {
    return 'actual';
  };

  /**
   * Row Data returned by methods like, at/get.
   * @typedef {Object} TableDataSource.RowData
   * @property {Object} data The raw row data.
   * @property {number} index The index for the row.
   * @property {any} key The key value for the row.
   */

  /**
   * Row Datas returned by fetch method.
   * @typedef {Object} TableDataSource.RowDatas
   * @property {Array.<Object>} data An array of raw row data.
   * @property {Array.<any>} keys An array of key values for the rows.
   * @property {number} startIndex The startIndex for the returned set of rows.
   */

  /**
   * Events which are published by TableDataSource. Any custom TableDataSource
   * implementation must publish the corresponding events.
   * @export
   * Event types
   * @enum {string}
   * @memberof TableDataSource
   */
  TableDataSource.EventType = {
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
    ADD: 'add',
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
    REMOVE: 'remove',
    /** Triggered when a TableDataSource has been reset */
    RESET: 'reset',
    /** Triggered when a TableDataSource has been refreshed */
    REFRESH: 'refresh',
    /** Triggered when a TableDataSource has been sorted<p>
     * The event payload contains:<p>
     * <table cellspacing="0" style="border-collapse: collapse;">
     * <tbody>
     * <tr><td><b>header</b></td><td>the key of the header which was sorted on</td></tr>
     * <tr><td><b>direction</b></td><td>the direction of the sort ascending/descending</td></tr>
     * </tbody>
     * </table>
     */
    SORT: 'sort',
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
    CHANGE: 'change',
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
    REQUEST: 'request',
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
    SYNC: 'sync',
    /** Triggered when an error occurred on the TableDataSource */
    ERROR: 'error'
  };

  /**
   * @private
   */
  TableDataSource._LOGGER_MSG = {
    _ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY: 'oj.TableDataSource constructor called.',
    _ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:
      'Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.',
    _ERR_DATA_INVALID_TYPE_SUMMARY: 'Invalid data type.',
    _ERR_DATA_INVALID_TYPE_DETAIL: 'Please specify the appropriate data type.'
  };

  /**
   * @class TreeDataSource
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
   *       <td>{@link CollectionTreeDataSource}</td>
   *       <td>When the data is available from an {@link Collection} object, such as an external data source.</td>
   *       <td>ListView<br>NavigationList<br>TreeView<br></td>
   *     </tr>
   *     <tr>
   *       <td>{@link IndexerModelTreeDataSource}</td>
   *       <td>When the data has a tree-like structure that is displayed in a ListView with Indexer.</td>
   *       <td>ListView (with Indexer)<br></td>
   *     </tr>
   *     <tr>
   *       <td>{@link JsonTreeDataSource}</td>
   *       <td>When the data is available from an array of JSON objects that represent tree nodes.</td>
   *       <td>ListView<br>NavigationList<br>TreeView<br></td>
   *     </tr>
   *   </tbody>
   * </table>
   * <br>Refer to the documentation and demos of individual components for more information on how to use them with the TreeDataSource subclasses.</br><br>
   * In case specialized behavior is needed, new subclass can be created by using [oj.Object.createSubclass]{@link oj.Object.createSubclass}.  New subclass can be based on
   * TreeDataSource, in which case all methods must be implemented, or it can be based on an existing subclass, in which case only methods that require different behavior need
   * to be overridden.
   *
   * @param {Object} data data supported by the component
   * @export
   * @extends DataSource
   * @abstract
   * @constructor
   * @final
   * @since 1.0
   * @ojdeprecated {since: '6.0.0', description: 'Use TreeDataProvider instead.'}
   * @ojtsignore
   */

  const TreeDataSource = function (data) {
    TreeDataSource.superclass.constructor.call(this, data);
  };
  oj$2._registerLegacyNamespaceProp('TreeDataSource', TreeDataSource);
  /**
   * Subclass TreeDataSource to DataSource
   * @private
   */
  oj$2.Object.createSubclass(TreeDataSource, oj$2.DataSource, 'oj.TreeDataSource');

  /**
   * Returns the number of children for a specified parent.  If the value returned is not >= 0 then it is automatically assumed
   * that the child count is unknown.
   * @param {any} parent the parent key.  Specify null if inquiring child count of the root.
   * @return {number} the number of children for the specified parent.
   * @method
   * @name getChildCount
   * @memberof TreeDataSource
   * @instance
   */

  /**
   * Fetch the children
   * @param {any} parent the parent key.  Specify null if fetching children from the root.
   * @param {Object} range information about the range, it must contain the following properties: start, count
   * @property {number} range.start the start index of the range in which the children are fetched
   * @property {number} range.count the size of the range in which the children are fetched
   * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
   *        types are "success" and "error"
   * @property {function(oj.NodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
   * @property {function({status: *})=} callbacks.error the callback to invoke when fetch children failed.
   * @param {Object=} options optional parameters for this operation
   * @property {boolean=} options.queueOnly true if this fetch request is to be queued and not execute yet.  The implementation must maintain
   *        the order of the fetch operations.  When queueOnly is false/null/undefined, any queued fetch operations are then
   *        flushed and executed in the order they are queued.  This flag is ignored if the datasource does not support batching
   * @return {void}
   * @method
   * @name fetchChildren
   * @memberof TreeDataSource
   * @instance
   */

  /**
   * Fetch all children and their children recursively from a specified parent.
   * @param {any} parent the parent key.  Specify null to fetch everything from the root (i.e. expand all)
   * @param {Object} callbacks the callbacks to be invoke when fetch children operation is completed.  The valid callback
   *        types are "success" and "error"
   * @property {function(oj.NodeSet)} callbacks.success the callback to invoke when fetch completed successfully.
   * @property {function({status: *})=} callbacks.error the callback to invoke when fetch children failed.
   * @param {Object=} options optional parameters for this operation
   * @property {number=} options.start the index related to parent in which to begin fetching descendants from.  If this is not specified, then value zero will be used
   * @property {number=} options.maxCount the maximum number of children to fetch.  If a non-positive number is specified, then the value is ignored and
   *        there is no maximum fetch count
   * @return {void}
   * @method
   * @name fetchDescendants
   * @memberof TreeDataSource
   * @instance
   */

  /**
   * Performs a sort operation on the tree data.
   * @param {Object} criteria the sort criteria.  It must contain the following properties: key, direction
   * @property {any} criteria.key the key identifying the attribute (column) to sort on
   * @property {'ascending'|'descending'|'none'} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
   * @param {Object} callbacks callbacks for the sort operation
   * @property {function():void} callbacks.success the callback to invoke when the sort completed successfully
   * @property {function({status: *})=} callbacks.error the callback to invoke when sort failed.
   * @return {void}
   * @method
   * @name sort
   * @memberof TreeDataSource
   * @instance
   */

  /**
   * Returns the current sort criteria of the tree data.
   * @return {Object} the current sort criteria.  It should contain the following properties: key, direction where
   *         criteria.key the key identifying the attribute (column) to sort on.  Value is null if it's not sorted.
   *         criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
   * @ojsignature {target: "Type",
   *               value: "{key: any, direction: 'ascending'|'descending'|'none'}",
   *               for: "returns"}
   * @method
   * @name getSortCriteria
   * @memberof TreeDataSource
   * @instance
   */

  /**
   * Moves a row from one location to another (different position within the same parent or a completely different parent)
   * @param {any} rowToMove the key of the row to move
   * @param {any} referenceRow the key of the reference row which combined with position are used to determine
   *        the destination of where the row should moved to.
   * @param {number|string} position The position of the moved row relative to the reference row.
   *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position
   *        the element at a specific point among the reference row's current children.
   * @param {Object} callbacks the callbacks for the move function
   * @property {function():void} callbacks.success the callback to invoke when the move completed successfully
   * @property {function({status: *})=} callbacks.error the callback to invoke when move failed.
   * @return {void}
   * @method
   * @name move
   * @memberof TreeDataSource
   * @instance
   */

  /**
   * Checks whether a move operation is valid.
   * @param {any} rowToMove the key of the row to move
   * @param {any} referenceRow the key of the reference row which combined with position are used to determine
   *        the destination of where the row should moved to.
   * @param {number|string} position The position of the moved row relative to the reference row.
   *        This can be a string: "before", "after", "inside", "first", "last", or the zero based index to position
   *        the element at a specific point among the reference row's current children.
   * @return {string} returns "valid" if the move is valid, "invalid" otherwise.
   * @ojsignature {target: "Type",
   *               value: "'valid'|'invalid'",
   *               for: "returns"}
   * @method
   * @name moveOK
   * @memberof TreeDataSource
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
   * @memberof TreeDataSource
   * @instance
   */

  // Define a mapping variable that maps the return value of the module to the name used in the callback function of a require call.
  var DataSourceCommon = {};
  DataSourceCommon.DataGridDataSource = oj.DataGridDataSource;

  exports.DataGridDataSource = DataGridDataSource;
  exports.DataSource = DataSource;
  exports.DataSourceCommon = DataSourceCommon;
  exports.DiagramDataSource = DiagramDataSource;
  exports.TableDataSource = TableDataSource;
  exports.TreeDataSource = TreeDataSource;

  Object.defineProperty(exports, '__esModule', { value: true });

});
