/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery','ojs/internal-deps/datagrid/DvtDataGrid', 'promise', 'ojs/ojcomponentcore', 'ojs/ojdatasource-common', 'ojs/ojarraydatagriddatasource', 'ojs/ojflattenedtreedatagriddatasource', 'ojs/ojpagingdatagriddatasource' ,'ojs/ojinputnumber', 'ojs/ojmenu', 'ojs/ojdialog', 'ojs/ojpagingcontrol'], function(oj, $, DvtDataGrid)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/*jslint browser: true*/
/**
 * @export    
 * This class captures all translation resources and style classes used by the DataGrid.
 * This should be populated with information extracted through the framework and set on the DataGrid.
 * Internal.  Developers should never use this class.
 * @constructor
 */
oj.DataGridResources = function(rtlMode, translationFunction)
{
    this.rtlMode = rtlMode;
    this.translationFunction = translationFunction;
    this.styles = {};
    this.styles['datagrid'] = "oj-datagrid";
    this.styles['cell'] = "oj-datagrid-cell";
    this.styles['cellcontent'] = "oj-datagrid-cell-content";
    this.styles['celltext'] = "oj-datagrid-cell-text";
    this.styles['banded'] = "oj-datagrid-banded";
    this.styles['row'] = "oj-datagrid-row";
    this.styles['databody'] = "oj-datagrid-databody";
    this.styles['topcorner'] = "oj-datagrid-top-corner";
    this.styles['bottomcorner'] = "oj-datagrid-bottom-corner";
    this.styles['rowheaderspacer'] = "oj-datagrid-row-header-spacer";
    this.styles['colheaderspacer'] = "oj-datagrid-column-header-spacer";
    this.styles['status'] = "oj-datagrid-status";
    this.styles['emptytext'] = "oj-datagrid-empty-text";
    this.styles['header'] = "oj-datagrid-header";                
    this.styles['groupingcontainer'] = "oj-datagrid-header-grouping";                
    this.styles['headercell'] = "oj-datagrid-header-cell";
    this.styles['headercelltext'] = "oj-datagrid-header-cell-text";
    this.styles['headercellcontent'] = "oj-datagrid-header-cell-content";
    this.styles['rowheader'] = "oj-datagrid-row-header";
    this.styles['colheader'] = "oj-datagrid-column-header";
    this.styles['colheadercell'] = "oj-datagrid-column-header-cell";
    this.styles['rowheadercell'] = "oj-datagrid-row-header-cell";
    this.styles['scroller-mobile'] = "oj-datagrid-scroller-touch";
    this.styles['scroller'] = "oj-datagrid-scroller";
    this.styles['scrollers'] = "oj-datagrid-scrollers";
    this.styles['focus'] = "oj-focus";
    this.styles['hover'] = "oj-hover";
    this.styles['active'] = "oj-active";
    this.styles['selected'] = "oj-selected";
    this.styles['disabled'] = "oj-disabled";
    this.styles['enabled'] = "oj-enabled";
    this.styles['default'] = "oj-default";
    this.styles['sortcontainer'] = "oj-datagrid-sort-icon-container";
    this.styles['sortascending'] = "oj-datagrid-sort-ascending-icon";
    this.styles['sortdescending'] = "oj-datagrid-sort-descending-icon";
    this.styles['icon'] = "oj-component-icon";
    this.styles['clickableicon'] = "oj-clickable-icon-nocontext";    
    this.styles['info'] = "oj-helper-hidden-accessible";
    this.styles['rowexpander'] = "oj-rowexpander";
    this.styles['cut'] = "oj-datagrid-cut";
    this.styles['selectaffordancetop'] = "oj-datagrid-touch-selection-affordance-top";
    this.styles['selectaffordancebottom'] = "oj-datagrid-touch-selection-affordance-bottom";
    this.styles['toucharea'] = "oj-datagrid-touch-area";
    
    this.styles['draggable'] = "oj-draggable";
    this.styles['drag'] = "oj-drag";
    this.styles['drop'] = "oj-drop";
    this.styles['activedrop'] = "oj-active-drop";
    this.styles['validdrop'] = "oj-valid-drop";
    this.styles['invaliddrop'] = "oj-invalid-drop";
    
    this.commands = {};
    this.commands['sortCol'] = "oj-datagrid-sortCol";
    this.commands['sortColAsc'] = "oj-datagrid-sortColAsc";
    this.commands['sortColDsc'] = "oj-datagrid-sortColDsc";
    this.commands['sortRow'] = "oj-datagrid-sortRow";
    this.commands['sortRowAsc'] = "oj-datagrid-sortRowAsc";
    this.commands['sortRowDsc'] = "oj-datagrid-sortRowDsc";
    this.commands['resize'] = "oj-datagrid-resize";
    this.commands['resizeWidth'] = "oj-datagrid-resizeWidth";
    this.commands['resizeHeight'] = "oj-datagrid-resizeHeight";
    this.commands['cut'] = "oj-datagrid-cut";
    this.commands['paste'] = "oj-datagrid-paste";
    this.commands['discontiguousSelection'] = "oj-datagrid-discontiguousSelection";
    
    this.attributes = {};
    this.attributes['key'] = "data-oj-key";
    this.attributes['context'] = "data-oj-context";    
    this.attributes['resizable'] = "data-oj-resizable";
    this.attributes['sortable'] = "data-oj-sortable";    
    this.attributes['sortDir'] = "data-oj-sortdir";    
    this.attributes['expander'] = "data-oj-expander";    
    this.attributes['expanderIndex'] = "data-oj-expander-index";    
    this.attributes['container'] = oj.Components._OJ_CONTAINER_ATTR;
    this.attributes['extent'] = "data-oj-extent";
    this.attributes['start'] = "data-oj-start";
    this.attributes['depth'] = "data-oj-depth";
    this.attributes['level'] = "data-oj-level";
    this.attributes['tabMod'] = "data-oj-tabmod";
};

/**
 * Whether the reading direction is right to left.
 * @return {boolean} true if reading direction is right to left, false otherwise.
 * @export
 */
oj.DataGridResources.prototype.isRTLMode = function()
{
    return (this.rtlMode === "rtl") ? true : false;
};

/**
 * Gets the translated text
 * @param {string} key the key to the translated text
 * @param {Array=} args optional arguments to format the translated text
 * @return {string|null} the translated text
 * @export
 */
oj.DataGridResources.prototype.getTranslatedText = function(key, args)
{
    return this.translationFunction(key, args);
};

/**
 * Gets the mapped style class
 * @param {string} key the key to the style class
 * @return {string|null} the style class
 * @export
 */
oj.DataGridResources.prototype.getMappedStyle = function(key)
{
    if (key != null)
    {
        return this.styles[key];
    }
    return null;
};

/**
 * Gets the mapped command class
 * @param {string} key the key to the command class
 * @return {string|null} the command class
 * @export
 */
oj.DataGridResources.prototype.getMappedCommand = function(key)
{
    if (key != null)
    {
        return this.commands[key];
    }
    return null;
};

/**
 * Gets the mapped attribute
 * @param {string} key the key to the attribute
 * @return {string|null} the attribute
 * @export
 */
oj.DataGridResources.prototype.getMappedAttribute = function(key)
{
    if (key != null)
    {
        return this.attributes[key];
    }
    return null;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojDataGrid
 * @augments oj.baseComponent
 * @since 0.6
 *
 * @classdesc
 * <h3 id="datagridOverview-section">
 *   JET DataGrid Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#datagridOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET DataGrid is a themable, WAI-ARIA compliant component that displays data in a cell oriented grid.  Data inside the DataGrid can be associated with row and column headers.  Page authors can customize the content rendered inside cells and headers.</p>
 *
 * <h3 id="data-section">
 *   Data
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
 * </h3>
 * <p>The JET DataGrid gets its data from a DataGridDataSource.  There are several types of DataGridDataSource that are provided out of the box:</p>
 * <ul>
 * <li>{@link oj.ArrayDataGridDataSource} - Use this when the underlying data is a static array.  The ArrayDataGridDataSource supports both single array (in which case each item in the array represents a row of data in the DataGrid) and two dimensional array (in which case each item in the array represents a cell in the DataGrid).  See the documentation for oj.ArrayDataGridDataSource for more details on the available options.</li>
 * <li>{@link oj.CollectionDataGridDataSource} - Use this when oj.Collection is the model for the underlying data.  Note that the DataGrid will automatically react to model event from the underlying oj.Collection.  See the documentation for oj.CollectionDataGridDataSource for more details on the available options.</li>
 * <li>{@link oj.CubeDataGridDataSource} - Use this when aggregating data with oj.Cube. See the documentation for oj.CubeDataGridDataSource for more details on the available options.</li>
 * <li>{@link oj.PagingDataGridDataSource} - Use this when the DataGrid is driven by an associating ojPagingControl.  See the documentation for oj.PagingDataGridDataSource for more details on the available options.</li>
 * <li>{@link oj.FlattenedTreeDataGridDataSource} - Use this when hierarchical data is displayed in the DataGrid.  The FlattenedDataGridDataSource takes an oj.TreeDataSource and adapts that to the DataGridDataSource.  The ojRowExpander works with the FlattenedTreeDataGridDataSource to enable expanding/collapsing of rows.</li>
 * </ul>
 *
 * <p>Developers can also create their own DataSource by extending the oj.DataGridDataSource class.  See the cookbook for an example of a custom DataGridDataSource.</p>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>Since <code class="prettyprint">role="application"</code> is used in the data grid, application should always apply an <code class="prettyprint">aria-label</code> to the data grid element so that it can distinguish from other elements with application role.</p>
 *
 * <h3 id="context-section">
 *   Header Context And Cell Context
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#context-section"></a>
 * </h3>
 *
 * <p>For all header and cell options, developers can specify a function as the return value.  The function takes a single argument, which is an object that contains contextual information about the particular header or cell.  This gives developers the flexibility to return different value depending on the context.</p>
 *
 * <p>For header options, the context paramter contains the following keys:</p>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>axis</kbd></td>
 *       <td>The axis of the header.  Possible values are 'row' and 'column'.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>component</kbd></td>
 *       <td>A reference to the DataGrid widgetConstructor.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>datasource</kbd></td>
 *       <td>A reference to the data source object.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>index</kbd></td>
 *       <td>The index of the header, where 0 is the index of the first header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>key</kbd></td>
 *       <td>The key of the header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>data</kbd></td>
 *       <td>The data object for the header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>parentElement</kbd></td>
 *       <td>The header cell element.  The renderer can use this to directly append content to the header cell element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>level</kbd></td>
 *       <td>The level of the header. The outermost header is level zero.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>depth</kbd></td>
 *       <td>The the number of levels the header spans.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>extent</kbd></td>
 *       <td>The number of indexes the header spans.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <p></p>
 * <p>For cell options, the context paramter contains the following keys:</p>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>component</kbd></td>
 *       <td>A reference to the DataGrid widgetConstructor.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>datasource</kbd></td>
 *       <td>A reference to the data source object.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>indexes</kbd></td>
 *       <td>The object that contains both the zero based row index and column index in which the cell is bound to.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>keys</kbd></td>
 *       <td>The object that contains both the row key and column key which identifies the cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>data</kbd></td>
 *       <td>The data object for the cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>parentElement</kbd></td>
 *       <td>The data cell element.  The renderer can use this to directly append content to the data cell element.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <p></p>
 * <p>If a FlattenedTreeDataGridDataSource is used, the following additional contextual information are available:</p>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>depth</kbd></td>
 *       <td>The depth of the row.  The depth of root row is 0.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>index</kbd></td>
 *       <td>The index of the row relative to its parent.  The index of the first child is 0.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>state</kbd></td>
 *       <td>The state of the row.  Possible values are "expanded", "collapsed", "leaf".</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>parentKey</kbd></td>
 *       <td>The key of the parent row.  For root row the parent key is null.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <p></p>
 * <p>Note that a custom DataGridDataSource can return additional header and cell context information.  Consult the documentation of the DataGridDataSource API for details.</p>
 *
 * <h3 id="context-section">
 *   Selection
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selection-section"></a>
 * </h3>
 *
 * <p>The DataGrid supports both cell based and row based selection mode, which developers can specify using the selectionMode option.  For each mode developers can also specify whether single or multiple cells/rows can be selected.</p>
 * <p>Developers can specify or retrieve selection from the DataGrid using the selection option.  A selection in DataGrid consists of an array of ranges.  Each range contains the following keys: startIndex, endIndex, startKey, endKey.  Each of the keys contains value for 'row' and 'column'.  If endIndex and endKey are not specified, that means the range is unbounded, i.e. the cells of the entire row/column are selected.</p>
 *
 * <h3 id="menu-section">
 *   Context menu
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#menu-section"></a>
 * </h3>
 *
 * <p>The DataGrid has a default context menu for operations such as header resize and sort.  Developers can also specify their own context menu by using the contextMenu option.</p>
 * <p>When defining a contextMenu, ojDataGrid will provide built-in behavior for "edit" style functionality
 *  (e.g. cut/copy/paste) if the following format for menu &lt;li&gt; item's is used (no &lt;a&gt;
 *  elements are required):</p>
 *
 * <ul><li> &lt;li data-oj-command="oj-datagrid-['commandname']" /&gt;</li></ul>
 *
 * <p>The available translated text will be applied to menu items defined this way.</p>
 *
 * <p>The supported commands:</p>
 * <table class="keyboard-table">
 *   <thead>
 *      <tr>
 *       <th>Default Function</th>
 *       <th>data-oj-command value</th>
 *      </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Resize menu</kbd> (contains width and height resize)</td>
 *       <td>oj-datagrid-resize</td>
 *     </tr>
 *     <tr>
 *        <td>Sort Row menu</kbd> (contains ascending and descending sort)</td>
 *       <td>oj-datagrid-sortRow</td>
 *      </tr>
 *     <tr>
 *        <td>Sort Column menu</kbd> (contains ascending and descending sort)</td>
 *       <td>oj-datagrid-sortCol</td>
 *      </tr>
 *     <tr>
 *        <td><kbd>Resize Width</kbd></td>
 *       <td>oj-datagrid-resizeWidth</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Resize Height</kbd></td>
 *       <td>oj-datagrid-resizeHeight</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Sort Row Ascending</kbd></td>
 *       <td>oj-datagrid-sortRowAsc</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Sort Row Descending</kbd></td>
 *       <td>oj-datagrid-sortRowDsc</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Sort Column Ascending</kbd></td>
 *       <td>oj-datagrid-sortColAsc</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Sort Column Descending</kbd></td>
 *       <td>oj-datagrid-sortColDsc</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Cut</kbd></td>
 *       <td>oj-datagrid-cut</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Paste</kbd></td>
 *       <td>oj-datagrid-paste</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Toggle Non-Contiguous Selection on Touch Device</kbd></td>
 *       <td>oj-datagrid-discontiguousSelection</td>
 *     </tr>
 * </tbody></table>
 * <h3 id="geometry-section">
 *   Geometry Management
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#geometry-section"></a>
 * </h3>
 *
 * <p>If the DataGrid is not styled with a fixed size, then it will responds to a change to the size of its container.  Note that unlike Table the content of the cell does not affect the height of the row.  The height of the rows must be pre-determined and specified by the developer or a default size will be used.</p>
 *
 * <p>The DataGrid does not support % width and height values in the header style or style class.</p>
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>The order of the column headers will be rendered in reverse order in RTL reading direction.  The location of the row header will also be different between RTL and LTR direction.  It is up to the developers to ensure that the content of the header and data cell are rendered correctly according to the reading direction.</p>
 * <p>As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the datagrid must be <code class="prettyprint">refresh()</code>ed.
 *
 * <h3 id="rtl-section">
 *   Templating Alignment
 *   <a class="bookmarkable-link" title="Templating Alignment" href="#templating-section"></a>
 * </h3>
 * <p>When using stamped content through templates, it is required to add specific class name's to obtain the default cell content alignment. In the case of header templates, add the class name <code class="prettyprint">oj-datagrid-header-cell-text</code>. In the cell template case add the class name <code class="prettyprint">oj-datagrid-cell-text</code> to obtain default cell alignment. These classes styles and default behavior are themable.</p>
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Data Set Size</h4>
 * <p>As a rule of thumb, it's recommended that applications limit the amount of data to display.  Displaying large
 * number of items in DataGrid makes it hard for users to find what they are looking for, but affects the
 * scrolling performance as well.  If displaying large number of items is neccessary, consider use a paging control with DataGrid
 * to limit the number of items to display at a time.  Also consider setting <code class="prettyprint">scrollPolicy</code> to
 * 'scroll' to enable virtual scrolling to reduce the number of elements in the DOM at any given time .</p>
 *
 * <h4>Cell Content</h4>
 * <p>DataGrid allows developers to specify arbitrary content inside its cells. In order to minimize any negative effect on
 * performance, you should avoid putting a large number of heavy-weight components inside a cell because as you add more complexity
 * to the structure, the effect will be multiplied because there can be many items in the DataGrid.</p>
 */
oj.__registerWidget('oj.ojDataGrid', $['oj']['baseComponent'],
{
    widgetEventPrefix: 'oj',
    options:
            {
                /**
                 * Row banding and column banding intervals within the data grid body.
                 *
                 * @expose
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @type {Object.<string, number>}
                 * @default <code class="prettyprint">{ "row":0, "column":0 }</code>
                 * @property {number} row row banding interval
                 * @property {number} column column banding interval
                 *
                 * @example <caption>Initialize the data grid with the row banding interval set to every other row:</caption>
                 * $( ".selector" ).ojDataGrid({ "data":data, "bandingInterval": {"row":1} });
                 *
                 * @example <caption>Get or set the <code class="prettyprint">rowBanding</code> option, after initialization:</caption>
                 * // get the bandingInterval object
                 * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "bandingInterval" );
                 *
                 * // set the bandingInterval to every 2 rows and every other column
                 * $( ".selector" ).ojDataGrid( "option", "bandingInterval", {"row":2, "column":1 } );
                 */
                bandingInterval: {'row': 0, 'column': 0},
                /**
                 * The data source for the DataGrid must be an extension of oj.DataGridDataSource.
                 * See the data source section in the introduction for out of the box data source types.
                 * To specify a row header key or index of an ArrayDataGridDataSource pass in an Object as such:
                 * {"data": oj.DataGridDataSource, "rowHeader":string|number}
                 * If the data attribute is not specified, an empty data grid is displayed.
                 *
                 * @expose
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @type {oj.DataGridDataSource}
                 * @default <code class="prettyprint">null</code>
                 *
                 * @example <caption>Initialize the data grid with a one-dimensional array:</caption>
                 * $( ".selector" ).ojDataGrid({ "data": new oj.ArrayDataGridDataSource([1,2,3])});
                 *
                 * @example <caption>Initialize the data grid with a two-dimensional array:</caption>
                 * $( ".selector" ).ojDataGrid({ "data": new oj.ArrayDataGridDataSource(['X','X','O'],['O','X','O'],['O','O','X'])});
                 *
                 * @example <caption>Initialize the data grid with a two-dimensional array and set an index for row headers:</caption>
                 * $( ".selector" ).ojDataGrid({ "data":{"rowHeader":2 , "data": new oj.ArrayDataGridDataSource(['1','2','Cat'],['1','4','Dog'],['5','1','Bird']) }});
                 *
                 * @example <caption>Initialize the data grid with an oj.Collection:</caption>
                 * $( ".selector" ).ojDataGrid({ "data": new oj.CollectionDataGridDataSource(collection)});
                 *
                 * @example <caption>Initialize the data grid with an oj.Collection and specify a row header:</caption>
                 * $( ".selector" ).ojDataGrid({ "data":{ "data":new oj.CollectionDataGridDataSource(collection), "rowHeader":'key' }});
                 *
                 * @example <caption>Initialize the data grid with a custom data source</caption>
                 * $( ".selector" ).ojDataGrid({ "data":new CustomDataSource()});
                 */
                data: null,
                /**
                 * Display or hide the horizontal or vertical grid lines in the data body. Gridlines are
                 * visible by default, and must be set to 'hidden' in order to be hidden.
                 *
                 * @expose
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @type {Object.<string, string>}
                 * @default <code class="prettyprint">{"horizontal": "visible", "vertical": "visible"}</code>
                 * @property {string} horizontal horizontal gridlines, valid values are: "hidden", "visible"
                 * @property {string} vertical vertical gridlines, valid values are: "hidden", "visible"
                 *
                 * @example <caption>Initialize the data grid with only horizontal gridlines visible:</caption>
                 * $( ".selector" ).ojDataGrid({ "data":data, "gridlines": {"horizontal": "visible", "vertical": "hidden"} });
                 */
                gridlines: {'horizontal': 'visible', 'vertical': 'visible'},
                /**
                 * The index or key of the row and/or column to display initially in the data grid.
                 * Only key or index should be specified, if they both are the grid will scroll initially
                 * to the key values.
                 *
                 * @expose
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @type {Object.<string, Object>|null}
                 * @default <code class="prettyprint">null</code>
                 * @property {Object} index scroll to a given row and column index of the datagrid
                 * @property {number} index.row row index to scroll to
                 * @property {number} index.column column index to scroll to
                 * @property {Object} key scroll to a given row and column key of the datagrid
                 * @property {string} key.row row key to scroll to
                 * @property {string} key.column column key to scroll to
                 *
                 * @example <caption>Initialize the data grid to scroll to row index 5 and column index 7:</caption>
                 * $( ".selector" ).ojDataGrid({ "data":data, "scrollPosition": {"index":{"row": 5, "column": 7}}});
                 *
                 * @example <caption>Initialize the data grid to scroll to row key 'id5' and column key 'id7':</caption>
                 * $( ".selector" ).ojDataGrid({ "data":data, "scrollPosition": {"key":{"row": "id5", "column": "id7"}}});
                 */
                scrollPosition: null,
                /**
                 * Specifies whether row/cell selection can be made and the cardinality
                 * of each (single/multiple/none) selection in the Grid. Only one of the properties, row or column,
		 * should be set at at time. Selection is initially disabled, but setting the value to null will disable
                 * selection.
                 *
                 * @expose
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @type {Object.<string, string>|null}
                 * @default <code class="prettyprint">null</code>
                 * @property {string} row set row selection mode, valid values are: "single", "multiple"
                 * @property {string} cell set cell selection mode, valid values are: "single", "multiple"
                 *
                 * @example <caption>Initialize the data grid to enable single row selection:</caption>
                 * $( ".selector" ).ojDataGrid({ "data":data, "selectionMode": {"row":"single"}});
                 *
                 * @example <caption>Initialize the data grid to enable multiple cell selection:</caption>
                 * $( ".selector" ).ojDataGrid({ "data":data, "selectionMode": {"cell":"multiple"}});
                 */
                selectionMode: null,
                /**
                 * Enables or disables reordering the rows within the same datagrid using drag and drop.</br></br>
                 * Specify an object with the property "reorder" set to <code class="prettyprint">{'row':'enable'}</code> to enable
                 * reordering.  Setting the <code class="prettyprint">"reorder"</code> property to <code class="prettyprint">{'row':'disable'}</code>,
                 * or setting the <code class="prettyprint">"dnd"</code> property to <code class="prettyprint">null</code> (or omitting
                 * it), disables reordering support. There must be move capability on the datasource to support this feature.
                 *
                 * @type {Object}
                 * @property {Object} reorder an object with property row
                 * @property {string} reorder.row row reordering within the datagrid: "enable", "disable"
                 *
                 * @default <code class="prettyprint">{reorder: {row :'disable'}}</code>
                 * @expose
                 * @instance
                 * @memberof! oj.ojDataGrid
                 *
                 * @example <caption>Initialize the data grid to enable single row reorder:</caption>
                 * $( ".selector" ).ojDataGrid({ "data":data, "dnd" : {"reorder":{"row":"enable"}}});
                 */
                dnd : {'reorder': {'row' :'disable'}},
                /**
                 * Specifies the mechanism used to scroll the data inside the data grid. possible values are: auto(datagrid will decide), loadMoreOnScroll, and scroll.
                 * When loadMoreOnScroll is specified, additional data are fetched when the user scrolls to the bottom of the data grid.
                 * When scroll is specified, then virtual scrolling is used meaning only rows/columns visibile in the viewport are fetched.
                 *
                 * @expose
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @type {string|null}
                 * @default <code class="prettyprint">null</code>
                 *
                 * @example <caption>Initialize the data grid to use virtualized scrolling:</caption>
                 * $( ".selector" ).ojDataGrid({ "data":data, "scrollPolicy": "scroll"});
                 */
                scrollPolicy: "auto",
                /**
                 * Specifies the current selections in the data grid.
                 * Returns an array of range objects, or an empty array if there's no selection.
                 *
                 * @expose
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @type {Array.<Object>}
                 * @default <code class="prettyprint">[]</code>
                 *
                 * @example <caption>Get the current selection:</caption>
                 * $( ".selector" ).ojDataGrid("option", "selection");
                 *
                 * @example <caption>Set a row selection on the grid during initialization:</caption>
                 * $(".selector").ojDataGrid({"selection", [{startIndex: {"row":1}, endIndex:{"row":3}}]});
                 *
                 * @example <caption>Set a cell selection on the grid during initialization:</caption>
                 * $(".selector").ojDataGrid({"selection", [{startIndex: {"row":1, "column":2}, endIndex: {"row":3, "column":4}}]});
                 *
                 * @example <caption>Set a row selection on the grid after initialization:</caption>
                 * $(".selector").ojDataGrid("option", "selection", [{startIndex: {"row":1}, endIndex:{"row":3}}]);
                 *
                 * @example <caption>Set a cell selection on the grid after initialization:</caption>
                 * $(".selector").ojDataGrid("option", "selection", [{startIndex: {"row":1, "column":2}, endIndex: {"row":3, "column":4}}]);
                 */
                selection: [],
                /**
                 * The current databody or header cell.  This is typically the item the user navigated to.  Note that if currentCell
                 * is set to an item that is currently not available (not fetched in highwatermark scrolling case or
                 * inside a collapsed parent node) or invalid, then the value is ignored.
                 *
                 * If the currentCell is a databody cell the object will contain the following information: 
                 * {type: 'cell', indexes: {row:0, column:0}, keys: {row:'Apple', column:'Sales'}}.
                 *
                 * If the currentCell is a header cell the object will contain the following information:
                 * {type: 'header', axis:'column', index: 0, key: 'Apple', level:0}.
                 *
                 * If setting the option to a databody cell, either indexes or keys must be specified, if both are specified indexes will be used as a hint.
                 * If setting the option to a header cell, axis and either "index and level" or "key" must be specified, if both are specified "index and level" will be used as a hint. 
                 * If level is not specified it will default to 0.
                 *
                 * @expose
                 * @public
                 * @instance
                 * @memberof! oj.ojDataGrid
                 * @type {Object}
                 * @default <code class="prettyprint">null</code>
                 *
                 * @example <caption>Get the current cell:</caption>
                 * $( ".selector" ).ojDataGrid("option", "currentCell");
                 *
                 * @example <caption>Set the current databody cell based on index on the DataGrid during initialization:</caption>
                 * $(".selector").ojDataGrid({"currentCell", {indexes: {row:0, column:0}}});
                 *
                 * @example <caption>Set the current header cell based on index and level on the DataGrid during initialization:</caption>
                 * $(".selector").ojDataGrid({"currentCell", {axis:'column', index:0, level:0);
                 *
                 * @example <caption>Set the current databody cell based on keys on the DataGrid during initialization:</caption>
                 * $(".selector").ojDataGrid({"currentCell", {keys: {row:'Apple', column:'Sales'}}});
                 *
                 * @example <caption>Set the current header cell based on keys on the DataGrid during initialization:</caption>
                 * $(".selector").ojDataGrid({"currentCell", {axis:'column', key: 'Apple'}});
                */
                currentCell: null,              
                /**
                 * The header option contains a subset of options for row and column headers.
                 *
                 * @expose
                 * @alias header
                 * @memberof! oj.ojDataGrid
                 * @instance
                 */
                header: {
                    /**
                     * The header row option contains a subset of options for row headers.
                     *
                     * @expose
                     * @alias header.row
                     * @memberof! oj.ojDataGrid
                     * @instance
                     */
                    row: {
                        /**
                         * The CSS style class to apply to row headers in the data grid. If a string is specified
                         * the class will be added to all row header cells.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string to be set as a className.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.row.className
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with row header style calss set to 'rhstyle':</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "row": {"className":"rhstyle"} } });
                         *
                         * @example <caption>Get or set the <code class="prettyprint">className</code> option, after initialization:</caption>
                         * // get the className string
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "header.row.className" );
                         *
                         * // set the className string to a function of the headerContext
                         * $( ".selector" ).ojDataGrid( "option", "header.row.className", function(headerContext){return headerContext['index'] % 2 == 0 ? 'even':'odd'}});
                         */
                        className: null,
                        /**
                         * The renderer function that renders the content of the row header. See <a href="#context-section">headerContext</a>
                         * in the introduction to see the object passed into the row header renderer function.
                         * The function returns either a String or a DOM element of the content inside the row header.
                         * If the developer chooses to manipulate the row header element directly, the function should return
                         * nothing. If no renderer is specified, the Grid will treat the header data as a String.
                         *
                         * @expose
                         * @alias header.row.renderer
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with row header renderer that capitalizes each character in the row header cells:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "row": {"renderer": function(headerContext) {
                         *                                            return headerContext['key'].toUpperCase();}}}});
                         *
                         * @example <caption>Get or set the <code class="prettyprint">renderer</code> option, after initialization:</caption>
                         * // get the renderer function
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "row.header.renderer" );
                         *
                         * // set the renderer function
                         * $( ".selector" ).ojDataGrid( "option", "row.header.renderer", myFunction});
                         */
                        renderer: null,
                        /**
                         * Enable or disable width or height resize along the row headers. Note
                         * that for row header, a function cannot be used with "height".
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string of enable or disable.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.row.resizable
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {Object.<string, string>|Object.<string, function(Object)>|null}
                         * @default <code class="prettyprint">{"width": "disable", "height": "disable"}</code>
                         * @property {string} width row width resizable valid values are: "enable", "disable"
                         * @property {string} height row header height resizable valid values are: "enable", "disable"
                         *
                         * @example <caption>Initialize the data grid with row header height resizable only:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "row": {"resizable": {"height":"enable"}}}});
                         *
                         * @example <caption>Initialize the data grid with every other row header height resizable:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "row": {"resizable": {"height":function(headerContext){ return headerContext['index'] % 2 === 0 ? 'enable':'disable'; }}}}});
                         */
                        resizable: {'width': 'disable', 'height': 'disable'},
                        /**
                         * Enable or disable sorting on the field bounded by this header. The
                         * data source associated with the DataGrid must have the sort function defined.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string of auto, enable, or disable.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.row.sortable
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string}
                         * @default <code class="prettyprint">"auto"</code>
                         * @ojvalue {string} "auto" get the sortable property from the data source
                         * @ojvalue {string} "enable" enable sorting on row headers
                         * @ojvalue {string} "disable" disable sorting on row headers
                         *
                         * @example <caption>Initialize the data grid with row header sort disabled:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "row": {"sortable": "disable"}}});
                         *
                         * @example <caption>Initialize the data grid with every other row header sort enabled:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "row": {"sortable": function(headerContext){ return headerContext['index'] % 2 === 0 ? 'auto':'disable'; }}}});
                         *
                         */
                        sortable: 'auto',
                        /**
                         * The inline style to apply to row headers in the data grid. If a string is specified
                         * the class will be added to all row header cells.  Note that % width/height value is not supported.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.row.style
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with row headers to have green backgrounds:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "row": {style: "background-color: green"}}});
                         *
                         * @example <caption>Initialize the data grid with every other row header to have a green background:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "row": {style: function(headerContext) {
                         *                                            if (headerContext['index'] % 2 === 0)
                         *                                               return "background-color: green";
                         *                                            return;}}}});
                         */
                        style: null
                        /**
                         * The knockout template used to render the content of the row header.
                         *
                         * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
                         * component option.
                         *
                         * @ojbindingonly
                         * @name header.row.template
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Specify the row header <code class="prettyprint">template</code> when initializing DataGrid:</caption>
                         * // set the template
                         * &lt;ul id="datagrid" data-bind="ojComponent: {component: 'ojDataGrid', data: dataSource, header: { row: {template: 'my_template'}}}"&gt;&lt;/ul&gt;
                         */
                    },
                    /**
                     * The header column option contains a subset of options for row headers.
                     *
                     * @expose
                     * @alias header.column
                     * @memberof! oj.ojDataGrid
                     * @instance
                     */
                    column: {
                        /**
                         * The CSS style class to apply to column headers in the data grid. If a string is specified
                         * the class will be added to all column header cells.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string to be set as a className.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.column.className
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with column header style calss set to 'chstyle':</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "column": {"className":"chstyle"} } });
                         *
                         * @example <caption>Get or set the <code class="prettyprint">className</code> option, after initialization:</caption>
                         * // get the className string
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "header.column.className" );
                         *
                         * // set the className string to a function of the headerContext
                         * $( ".selector" ).ojDataGrid( "option", "header.column.className", function(headerContext){return headerContext['index'] % 2 == 0 ? 'even':'odd'}});
                         */
                        className: null,
                        /**
                         * The renderer function that renders the content of the column header. See <a href="#context-section">headerContext</a>
                         * in the introduction to see the object passed into the column header renderer function.
                         * The function returns either a String or a DOM element of the content inside the column header.
                         * If the developer chooses to manipulate the column header element directly, the function should return
                         * nothing. If no renderer is specified, the Grid will treat the header data as a String.
                         *
                         * @expose
                         * @alias header.column.renderer
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with column header renderer that capitalizes each character in the column header cells:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "column": {"renderer": function(headerContext) {
                         *                                            return headerContext['key'].toUpperCase();}}}});
                         *
                         * @example <caption>Get or set the <code class="prettyprint">renderer</code> option, after initialization:</caption>
                         * // get the renderer function
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "column.header.renderer" );
                         *
                         * // set the renderer function
                         * $( ".selector" ).ojDataGrid( "option", "column.header.renderer", myFunction});
                         */
                        renderer: null,
                        /**
                         * Enable or disable width or height resize along the column headers. Note
                         * that for column header, a function cannot be used with "height".
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string of enable or disable.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.column.resizable
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {Object.<string, string>|Object.<string, function(Object)>|null}
                         * @default <code class="prettyprint">{"width": "disable", "height": "disable"}</code>
                         * @property {string} width column width resizable valid values are: "enable", "disable"
                         * @property {string} height column header height resizable valid values are: "enable", "disable"
                         *
                         * @example <caption>Initialize the data grid with column header width resizable only:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "column": {"resizable": {"width":"enable"}}}});
                         *
                         * @example <caption>Initialize the data grid with every other column header width resizable:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "column": {"resizable": {"width":function(headerContext){ return headerContext['index'] % 2 === 0 ? 'enable':'disable'; }}}}});
                         */
                        resizable: {'width': 'disable', 'height': 'disable'},
                        /**
                         * Enable or disable sorting on the field bounded by this header. The
                         * data source associated with the DataGrid must have the sort function defined.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string of auto, enable, or disable.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.column.sortable
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string}
                         * @default <code class="prettyprint">"auto"</code>
                         * @ojvalue {string} "auto" get the sortable property from the data source
                         * @ojvalue {string} "enable" enable sorting on column headers
                         * @ojvalue {string} "disable" disable sorting on column headers
                         *
                         * @example <caption>Initialize the data grid with column header sort disabled:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "column": {"sortable": "disable"}}});
                         *
                         * @example <caption>Initialize the data grid with every other column header sort enabled:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "column": {"sortable": function(headerContext){ return headerContext['index'] % 2 === 0 ? 'auto':'disable'; }}}});
                         *
                         */
                        sortable: 'auto',
                        /**
                         * The inline style to apply to column headers in the data grid. If a string is specified
                         * the class will be added to all column header cells.  Note that % width/height value is not supported.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.column.style
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with column headers to have green backgrounds:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "column": {style: "background-color: green"}}});
                         *
                         * @example <caption>Initialize the data grid with every other column header to have a green background:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "column": {style: function(headerContext) {
                         *                                            if (headerContext['index'] % 2 === 0)
                         *                                               return "background-color: green";
                         *                                            return;}}}});
                         */
                        style: null
                        /**
                         * The knockout template used to render the content of the column header.
                         *
                         * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
                         * component option.
                         *
                         * @ojbindingonly
                         * @name header.column.template
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Specify the column header <code class="prettyprint">template</code> when initializing DataGrid:</caption>
                         * // set the template
                         * &lt;ul id="datagrid" data-bind="ojComponent: {component: 'ojDataGrid', data: dataSource, header: { column: {template: 'my_template'}}}"&gt;&lt;/ul&gt;
                         */
                    }
                },
                /**
                 * The cell option contains a subset of options for databody cells.
                 *
                 * @expose
                 * @memberof oj.ojDataGrid
                 * @instance
                 * @type {Object}
                 */
                cell: {
                    /**
                     * The CSS style class to apply to cells in the data grid body. If a string is specified
                     * the class will be added to all cells.
                     * A function can be specified with this option.  The function would take a single parameter, cellContext, and must return
                     * a string to be set as a className.  See <a href="#context-section">cellContext</a> for details.
                     *
                     * @expose
                     * @alias cell.className
                     * @memberof! oj.ojDataGrid
                     * @instance
                     * @type {function(Object)|string|null}
                     * @default <code class="prettyprint">null</code>
                     *
                     * @example <caption>Initialize the data grid with the cell style class set to 'myCellStyle':</caption>
                     * $( ".selector" ).ojDataGrid({ "data":data, "cell":{"className":"myCellStyle"} });
                     *
                     * @example <caption>Get or set the <code class="prettyprint">className</code> option, after initialization:</caption>
                     * // get the className string
                     * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "cell.className" );
                     *
                     * // set the className string to a function of the cellContext
                     * $( ".selector" ).ojDataGrid( "option", "cell.className", function(cellContext){return cellContext['index'] % 2 == 0 ? 'even':'odd'}});
                     */
                    className: null,
                    /**
                     * The renderer function that renders the content of the cell. See <a href="#context-section">cellContext</a>
                     * in the introduction to see the object passed into the cell renderer function.
                     * The function returns either a String or a DOM element of the content inside the data body cell.
                     * If the developer chooses to manipulate the cell element directly, the function should return
                     * nothing. If no renderer is specified, the Grid will treat the cell data as a String.
                     *
                     * @expose
                     * @alias cell.renderer
                     * @memberof! oj.ojDataGrid
                     * @instance
                     * @type {function(Object)|null}
                     * @default <code class="prettyprint">null</code>
                     *
                     * @example <caption>Initialize the data grid with cell renderer that capitalizes each character in the cell:</caption>
                     * $( ".selector" ).ojDataGrid({ "data":data, "cell": {"renderer": function(cellContext) {
                     *                                            return cellContext['key'].toUpperCase();}}});
                     *
                     * @example <caption>Get or set the <code class="prettyprint">renderer</code> option, after initialization:</caption>
                     * // get the renderer function
                     * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "cell.renderer" );
                     *
                     * // set the renderer function
                     * $( ".selector" ).ojDataGrid( "option", "cell.renderer", myFunction});
                     */
                    renderer: null,
                    /**
                     * The CSS style to apply directly to cells in the data grid body. If a string is specified
                     * the style will be added to all cells.
                     * A function can be specified with this option.  The function would take a single parameter, cellContext, and must return
                     * a string.  See <a href="#context-section">cellContext</a> for details.
                     *
                     * @expose
                     * @alias cell.style
                     * @memberof! oj.ojDataGrid
                     * @instance
                     * @type {function(Object)|string|null}
                     * @default <code class="prettyprint">null</code>
                     *
                     * @example <caption>Initialize the data grid with cells to have green backgrounds:</caption>
                     * $( ".selector" ).ojDataGrid({ "data":data, "cell":{style: "background-color: green"}});
                     *
                     * @example <caption>Initialize the data grid with every other cell to have a green background using a function:</caption>
                     * $( ".selector" ).ojDataGrid({ "data":data, "cell": {style: function(cellContext) {
                     *                                            if (cellContext['index'] % 2 === 0)
                     *                                               return "background-color: green";
                     *                                            return;}}});
                     */
                    style: null
                    /**
                     * The knockout template used to render the content of the cell.
                     *
                     * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
                     * component option.
                     *
                     * @ojbindingonly
                     * @name cell.template
                     * @memberof! oj.ojDataGrid
                     * @instance
                     * @type {string|null}
                     * @default <code class="prettyprint">null</code>
                     *
                     * @example <caption>Specify the cell <code class="prettyprint">template</code> when initializing DataGrid:</caption>
                     * // set the template
                     * &lt;ul id="datagrid" data-bind="ojComponent: {component: 'ojDataGrid', data: dataSource, cell: {template: 'my_template'}}"&gt;&lt;/ul&gt;
                     */
                },

                /**
                 * Triggered when a portion of the data grid is resized
                 *
                 * @expose
                 * @event
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @property {Event} event <code class="prettyprint">jQuery</code> event object
                 * @property {Object} ui Parameters
                 * @property {string|number} ui.header the key of the header which was resized
                 * @property {string} ui.size DEPRECATED, please use the ui.oldDimensions and ui.newDimensions properties
                 * @property {Object} ui.oldDimensions
                 * @property {number} ui.oldDimensions.width the old pixel size (ex: '75px' would be 75)
                 * @property {number} ui.oldDimensions.height the old pixel size
                 * @property {Object} ui.newDimensions
                 * @property {number} ui.newDimensions.width the new pixel size (ex: '75px' would be 75)
                 * @property {number} ui.newDimensions.height the new pixel size
                 * 
                 * @example <caption>Initialize the data grid with the <code class="prettyprint">resize</code> callback specified:</caption>
                 * $( ".selector" ).ojDataGrid({
                 *     "resize": function( event, ui ) {}
                 * });
                 *
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojresize</code> event:</caption>
                 * $( ".selector" ).on( "ojresize", function( event, ui ) {} );
                 */
                resize: null,

                /**
                 * Triggered when a sort is performed on the data grid
                 *
                 * @expose
                 * @event
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @property {Event} event <code class="prettyprint">jQuery</code> event object
                 * @property {Object} ui Parameters
                 * @property {Element} ui.header the key of the header which was sorted on
                 * @property {string} ui.direction the direction of the sort ascending/descending
                 *
                 * @example <caption>Initialize the data grid with the <code class="prettyprint">sort</code> callback specified:</caption>
                 * $( ".selector" ).ojDataGrid({
                 *     "sort": function( event, ui ) {}
                 * });
                 *
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojsort</code> event:</caption>
                 * $( ".selector" ).on( "ojsort", function( event, ui ) {} );
                 */
                sort: null,

                /**
                 * Fired whenever a supported component option changes, whether due to user interaction or programmatic
                 * intervention.  If the new value is the same as the previous value, no event will be fired.
                 *
                 * Currently there is one supported option, <code class="prettyprint">"selection"</code>.  Additional
                 * options may be supported in the future, so listeners should verify which option is changing
                 * before taking any action.
                 *
                 * @expose
                 * @event
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @property {Event} event <code class="prettyprint">jQuery</code> event object
                 * @property {Object} ui Parameters
                 * @property {string} ui.option the name of the option that is changing
                 * @property {Object} ui.previousValue the previous value of the option
                 * @property {Object} ui.value the current value of the option
                 * @property {Object} ui.optionMetadata information about the option that is changing
                 * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
                 *           <code class="prettyprint">"shouldNotWrite"</code>.  For use by the JET writeback mechanism.
                 *
                 */
                optionChange: null,

                /**
                 * Triggered after all items in the DataGrid has been rendered.
                 * Note that in the highwatermark or virtual scrolling case this
                 * means all items means the items that are fetched so far.
                 *
                 * @expose
                 * @event
                 * @deprecated Use the <a href="#whenReady">whenReady</a> method instead. 
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @property {Event} event <code class="prettyprint">jQuery</code> event object
                 * @property {Object} ui Parameters
                 *
                 * @example <caption>Initialize the DataGrid with the <code class="prettyprint">ready</code> callback specified:</caption>
                 * $( ".selector" ).ojDataGrid({
                 *     "ready": function( event, ui ) {}
                 * });
                 *
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojready</code> event:</caption>
                 * $( ".selector" ).on( "ojready", function( event, ui ) {} );
                 */
                ready: null,
                
                /**
                 * Triggered after the data grid has been scrolled via the UI or the scrollTo method.
                 * 
                 * @expose
                 * @event
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @property {Event} event event object that caused the scroll
                 * @property {Object} ui Parameters
                 * @property {number} ui.scrollX the x position in pixels of the scrollable region calculated from the origin of the datagrid. In RTL this would be the right of the grid.
                 * @property {number} ui.scrollY the y position in pixels of the scrollable region
                 *
                 * @example <caption>Initialize the DataGrid with the <code class="prettyprint">scroll</code> callback specified:</caption>
                 * $( ".selector" ).ojDataGrid({ "scroll": function( event, ui ) {} }); 
                 * 
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojscroll</code> event:</caption>
                 * $( ".selector" ).on( "ojscroll", function( event, ui ) {} );
                 */
                scroll: null,
                
                /**
                 * Triggered before the current cell is changed via the <code class="prettyprint">currentCell</code> option or via the UI.
                 *
                 * @expose
                 * @event
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @property {Event} event <code class="prettyprint">jQuery</code> event object
                 * @property {Object} ui Parameters
                 * @property {Object} ui.currentCell the new current cell, see currentCell for the object information
                 * @property {Object} ui.previousCurrentCell the previous current cell, see currentCell for the object information
                 *
                 * @example <caption>Initialize the ojDataGrid with the <code class="prettyprint">beforeCurrentCell</code> callback specified:</caption>
                 * $( ".selector" ).ojDataGrid({
                 *     "beforeCurrentCell": function( event, ui ) {}
                 * });
                 *
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforecurrentcell</code> event:</caption>
                 * $( ".selector" ).on( "ojbeforecurrentcell", function( event, ui ) {} );
                */
                beforeCurrentCell: null         
            },
    /**
     * Create the grid
     * @override
     * @memberof! oj.ojDataGrid
     * @protected
     */
    _ComponentCreate: function()
    {
        this._super();
        this.root = this.element[0];
        this.rootId = this.root.getAttribute('id');
                
        // ensure whenReady has a promise associated with it.
        this._createReadyPromise();
        this._resolveReadyPromise();
        
        this.grid = new DvtDataGrid();
        //set the visibility state to render until rendering is completed
        this.grid.setVisibility(DvtDataGrid.VISIBILITY_STATE_RENDER);
        //required classes on init, oj-component-initnode is added by this._super
        $(this.root).addClass("oj-datagrid oj-component");
	this.redrawSet = {'data':'all', 'header':['className','renderer','style','template']}; //vvc
    },
    /**
     * Initialize the grid after creation
     * @protected
     * @override
     * @memberof! oj.ojDataGrid
     */
    _AfterCreate: function ()
    {
        var self = this;

        // unregister existing resize listener before emptying out the root
        this._unregisterResizeListener(this.root);

        $(this.root).empty();
        this._super();
        this.resources = new oj.DataGridResources(this._GetReadingDirection(), this._getTranslation.bind(self));
        this._setDataSource();
        // sets the initial (or default) selection on internal grid
        this._setSelection();

        if (this.datasource != null)
        {
            this._addContextMenu();
            this.grid.SetDataSource(this.datasource);
        }
        this.grid.SetOptions(this.options);
        this.grid.SetResources(this.resources);
        this.grid.SetCreateContextCallback(this._modifyContext.bind(self));
        this.grid.SetRemoveCallback(this._remove.bind(self));
        this.grid.SetCreateReadyPromiseCallback(this._createReadyPromise.bind(self));
        this.grid.SetResolveReadyPromiseCallback(this._resolveReadyPromise.bind(self));
        
        this._registerEventListeners();
       
        //attempt to render the grid if visible and atatched
        this._possiblyRenderOrRefresh();

        // register a resize listener
        if (this.datasource != null)
        {
            this._registerResizeListener(this.root);
        }
    },
    /**
     * Register event listeners
	 * @private	 
     */
    _registerEventListeners: function()
    {       
        var self = this;        
        
        //listen for resizing, selection, sort and trigger relevent events
        this.grid.addListener('resize', function(details)
        {
            self._trigger('resize', details['event'], details['ui']);
        });
        this.grid.addListener('select', function(details)
        {
            self.option("selection", details['ui']['selection'],
                         {'_context': {originalEvent: details['event'], internalSet: true},
                          'changed': true});
        });
        this.grid.addListener('currentCell', function(details)
        {
            self.option("currentCell", details['ui'],
                         {'_context': {originalEvent: details['event'], internalSet: true},
                          'changed': true});
        });
        this.grid.addListener('beforeCurrentCell', function(details)
        {
            return self._trigger('beforeCurrentCell', details['event'], details['ui']);
        });
        this.grid.addListener('sort', function(details)
        {
            self._trigger('sort', details['event'], details['ui']);
        });
        this.grid.addListener('keydown', function(details)
        {
            self._trigger('keydown', details['event'], details['ui']);
        });
        this.grid.addListener('ready', function(details)
        {
            self._trigger('ready', null, {});
        });
        this.grid.addListener('scroll', function(details)
        {
            self._trigger('scroll', details['event'], details['ui']);
        });
    },
    /**
     * Redraw the entire data grid after having made some external modifications.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof! oj.ojDataGrid
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojDataGrid( "refresh" );
     */
    refresh: function()
    {
        this._super();

        // unregister existing resize listener before emptying out the root
        this._unregisterResizeListener(this.root);

        $(this.root).empty();

        // if the context menu is internal we should reset the option so that it
        // gets rebuilt on refresh
        if (this._useDefaultContextMenu === true)
        {
            this.options['contextMenu'] = null;
        }

        this._setDataSource();
        if (this.datasource != null)
        {
            // if it is flattened datasource, we'll need to reinitialize it
            if (this.datasource instanceof oj.FlattenedTreeDataGridDataSource)
            {
                this.datasource.Destroy();
                this.datasource.Init();
            }

            this._addContextMenu();
            this.grid.SetDataSource(this.datasource);
        }
        this.grid.SetOptions(this.options);
        this.grid.SetResources(this.resources);

        // so long as the visibility property is not 'render', overwrite it with
        // a refresh and try to refresh the grid
        if (this.grid.getVisibility() != DvtDataGrid.VISIBILITY_STATE_RENDER)
        {
            this.grid.setVisibility(DvtDataGrid.VISIBILITY_STATE_REFRESH);
        }
        this._possiblyRenderOrRefresh();

        if (this.datasource != null)
        {
            // register a resize listener
            this._registerResizeListener(this.root);
        }
    },
    /**
     * Destroy the grid
     * @memberof! oj.ojDataGrid
     * @private
     */
    _destroy: function()
    {
        // destroy the datasource if neccessary (FlattenedTreeDataSource)
        if (this.datasource != null && this.datasource.Destroy)
        {
            this.datasource.Destroy();
        }
        this.grid.destroy();
        this._unregisterResizeListener(this.root);
        $(this.root).empty();
    },


    /**
     * Sets multiple options
     * @param {Object} options the options object
     * @param {Object} flags additional flags for option
     * @override
     * @private
     */
    _setOptions: function( options, flags ) //vvc
    {
	var isRefresh;

        if(!this.datasource)
        {
            // not initialized yet, just call super
            this._super(options, flags);

            // if datasource is one of the options specified, then re-render the grid
            if (options['data'] != null)
            {
                this.refresh();
            }
        }
        else
        {
            // check whether a full refresh is needed
            isRefresh = this._shouldRefresh(options);
            // update options
            this._super(options, flags);

            if(isRefresh)
            {
                //redraw whole grid if required
                this.refresh();
            }
            else
            {
                //or process updated option(s) through the DvtDataGrid
                this.grid.UpdateOptions(options);
            }
        }
    },

    /**
     * <p>Notifies the component that its subtree has been made visible programmatically after the component has
     * been created.
     *
     * @memberof oj.DataGrid
     * @instance
     * @protected
     */
    _NotifyShown: function()
    {
        this._super();
        // if we are notified the grid is now shown attempt to render or refresh
        this._possiblyRenderOrRefresh();
    },

    /**
     * <p>Notifies the component that its subtree has been made hidden programmatically after the component has
     * been created.
     *
     * @memberof oj.DataGrid
     * @instance
     * @protected
     */
    _NotifyHidden: function()
    {
        this._super();
        if (this.grid.getVisibility() === DvtDataGrid.VISIBILITY_STATE_VISIBLE)
        {
            this.grid.setVisibility(DvtDataGrid.VISIBILITY_STATE_HIDDEN);
        }
    },

    /**
     * <p>Notifies the component that its subtree has been connected to the document programmatically after the component has
     * been created.
     *
     * @memberof oj.DataGrid
     * @instance
     * @protected
     */
    _NotifyAttached: function()
    {
        this._super();
        // if we are notified the grid is now attached attempt to render or refresh
        this._possiblyRenderOrRefresh();
    },

    /**
     * <p>Notifies the component that its subtree has been removed from the document programmatically after the component has
     * been created.
     *
     * @memberof oj.DataGrid
     * @instance
     * @protected
     */
    _NotifyDetached: function()
    {
        this._super();
        if (this.grid.getVisibility() === DvtDataGrid.VISIBILITY_STATE_VISIBLE)
        {
            this.grid.setVisibility(DvtDataGrid.VISIBILITY_STATE_HIDDEN);
        }
    },

    /**
     * Determine if the entire datagrid should refresh based on which options are updated.
     * @param {Object} options the options object
     * @return {boolean} true if datagrid should refresh, false otherwise
     * @private
     */
    _shouldRefresh: function(options)
    {
        var i, key, isRefresh, elm, itm, opt;

        //Traversing through the header object to retreave option value
        //header -> column/row -> resizable -> width/heigh

        isRefresh = false;

        for (key in options)
        {
            if(key in this.redrawSet)
            {
                if (key === "data")
                {
                    isRefresh = true;
                    break;
                }
                //Walk through the header object to retrieve the option value
                else if(key == "header")
                {
                    for(elm in options["header"])
                    {
                        if(elm == "column" || elm == "row" || elm == "cell")
                        {
                            for(itm in options["header"][elm])
                            {
                                //And check this option against the redraw list,
                                //if the option is in it and its value is different from original
                                //then assign 'true' to the isRefresh flag
                                for(i =0; i < this.redrawSet["header"].length; i++)
                                {
                                    if(itm == this.redrawSet["header"][i])
                                    {
                                        for(opt in this.options["header"][elm])
                                        {
                                            if(opt == itm)
                                            {
                                                if(options["header"][elm][itm] != this.options["header"][elm][itm])
                                                {
                                                    isRefresh = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                if(isRefresh)
                                {
                                    break;
                                }
                            }
                        }
                        if(isRefresh)
                        {
                            break;
                        }
                    }
                }
                else
                {
                    for(opt in this.options)
                    {
                        if(opt == key)
                        {
                            if(!oj.Object.compareValues(options[key],this.options[opt]))
                            {
                                isRefresh = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return isRefresh;
    },

    /**
     * Checks if resize is enabled along a given axis width/height
     * @private
     * @param {string} axis column/row
     * @param {string} direction width/height
     * @return {boolean} true if resize is not set to 'disable'
     */
    _isResizeEnabled: function(axis, direction)
    {
        if (this.options['header'][axis] && this.options['header'][axis]['resizable'])
        {
            return this.options['header'][axis]['resizable'][direction] !== 'disable';
        }
        return false;
    },

    /**
     * Checks if sorting is enabled along a given axis
     * @private
     * @param {string} axis column/row
     * @return {boolean} true if sorting is not set to 'disable'
     */
    _isSortEnabled: function(axis)
    {
        if (this.options['header'][axis])
        {
            return this.options['header'][axis]['sortable'] !== 'disable';
        }
        return false;
    },

    /**
     * Add a default context menu to the grid if there is none. If there is
     * a context menu set on the grid options we use that one. Add listeners
     * for context menu before show and select.
     * @private
     */
    _addContextMenu: function()
    {
        var self, menuContainer, rootId, resizeMenu = null, sortMenu = null, selectMenu = null,
                moveMenu = null, listItems, sortCapability, menuItemsSetByGrid;
        self = this;

        if (this.options["contextMenu"] == null)
        {
            if (this.datasource != null)
            {
                menuContainer = $('<ul>');
                menuContainer.css('display', 'none').attr('id', this.rootId + 'contextmenu');
                $(this.root).append(menuContainer); //@HTMLUpdateOK
                if (this._isResizeEnabled('column', 'width') || this._isResizeEnabled('column', 'height') ||
                        this._isResizeEnabled('row', 'width') || this._isResizeEnabled('row', 'height'))
                {
                    resizeMenu = this._buildContextMenuItem('resize');
                }

                sortCapability = this.datasource.getCapability('sort');
                if (this._isSortEnabled('column'))
                {
                    if (sortCapability === 'column' || sortCapability === 'full')
                    {
                        sortMenu = this._buildContextMenuItem('sortCol');
                    }
                }
                if (this._isSortEnabled('row'))
                {
                    if (sortCapability === 'row' || sortCapability === 'full')
                    {
                        if (sortMenu != null)
                        {
                            sortMenu = sortMenu.add(this._buildContextMenuItem('sortRow'));
                        }
                        else
                        {
                            sortMenu = this._buildContextMenuItem('sortRow');
                        }
                    }
                }

                if (this.options['dnd']['reorder']['row'] === 'enable')
                {
                    switch (this.datasource.getCapability('move'))
                    {
                        case 'none':
                            break;
                        default:
                            moveMenu = this._buildContextMenuListItem('cut').add(this._buildContextMenuListItem('paste'));
                    }
                }

				// add the discontiguous selection menu if multiple selection and touch device
                if (this._isMultipleSelection() && oj.DomUtils.isTouchSupported())
                {
                    this._discontiguousSelection = false;
                    selectMenu = this._buildContextMenuListItem('discontiguousSelection');
                }

                if (resizeMenu != null || sortMenu != null || moveMenu != null || selectMenu != null)
                {
                    menuContainer.append(resizeMenu).append(sortMenu).append(moveMenu).append(selectMenu); //@HTMLUpdateOK
                    menuContainer.ojMenu();

                    // keep track of the fact that we're using our own context menu
                    // this way on refresh we know that we should remove the contextMenu option
                    // so that this block is executed since we are removing the old menu by emptying
                    this._useDefaultContextMenu = true;

                    this._setOption("contextMenu", '#' + menuContainer.attr('id'));
                    menuContainer.on("ojselect", this._handleContextMenuSelect.bind(this));
                }
            }
        }
        else
        {
            // this keeps track of which menu items were generated by the data grid dynamically
            // this way on a refresh we know to recreate them in case there was a locale or
            // translations change
            if (this._menuItemsSetByGrid == null)
            {
                this._menuItemsSetByGrid = [];
            }

            menuContainer = $(this.options["contextMenu"]);
            listItems = menuContainer.find('[data-oj-command]');
            menuItemsSetByGrid = [];
            listItems.each(function() {
                var command, anchor, newListItem;
                anchor = $(this).children('a');
                if (anchor.length === 0 || self._menuItemsSetByGrid.indexOf(anchor.get(0)) != -1)
                {
                    command = $(this).attr('data-oj-command').split("-");
                    newListItem = self._buildContextMenuItem(command[command.length - 1]);
                    $(this).replaceWith(newListItem); //@HTMLUpdateOK
                    menuItemsSetByGrid.push(newListItem.children('a').get(0));
                }
            });
            this._menuItemsSetByGrid = menuItemsSetByGrid;
            if (menuContainer.data('oj-ojMenu'))
            {
                menuContainer.ojMenu('refresh');
            }
            menuContainer.on("ojselect", this._handleContextMenuSelect.bind(this));
        }
    },

    /**
     * Builds a menu for a command, takes care of submenus where appropriate
     * @param {string} command the command that the datagrid should build a menu item for
     * @private
     */
    _buildContextMenuItem: function(command)
    {
        if (command === 'resize')
        {
            return this._buildContextMenuListItem('resize').append($('<ul></ul>').append(this._buildContextMenuListItem('resizeWidth')).append(this._buildContextMenuListItem('resizeHeight'))); //@HTMLUpdateOK
        }
        else if(command === 'sortCol')
        {
            return this._buildContextMenuListItem('sortCol').append($('<ul></ul>').append(this._buildContextMenuListItem('sortColAsc')).append(this._buildContextMenuListItem('sortColDsc'))); //@HTMLUpdateOK
        }
        else if(command === 'sortRow')
        {
            return this._buildContextMenuListItem('sortRow').append($('<ul></ul>').append(this._buildContextMenuListItem('sortRowAsc')).append(this._buildContextMenuListItem('sortRowDsc'))); //@HTMLUpdateOK
        }
        else if (Object.keys(this.resources.commands).indexOf(command) != -1)
        {
            return $(this._buildContextMenuListItem(command));
        }
    },

    /**
     * Builds a context menu list item from a command
     * @param {string} command the string to look up command value for as well as translation
     * @return {Object} a jQuery object with HTML containing a list item
     * @private
     */
    _buildContextMenuListItem: function(command)
    {
        var listItem = $('<li></li>');
        listItem.attr('data-oj-command', this._getMappedCommand(command));
        listItem.append(this._buildContextMenuLabel(command)); //@HTMLUpdateOK
        return listItem;
    },
    /**
     * Builds a context menu label by looking up command translation
     * @param {string} command the string to look up translation for
     * @return {jQuery|string} a jQuery object with HTML containing a label
     * @private
     */
    _buildContextMenuLabel: function(command)
    {
        // convert to the translation key convention
        var key = 'label' + command.charAt(0).toUpperCase() + command.slice(1);
        if (command === 'discontiguousSelection')
        {
            // always initialize to enable
            key = 'labelEnableNonContiguous';
        }
        return $('<a href="#"></a>').text(this._getTranslation(key));
    },

    /**
     * Get the context menu from the grid
     * @return {Array.<Element>|Element} the context menu element that is set in the options
     * @private
     */
    _getDataGridContextMenu: function() // named to avoid overriding baseComponent._getContextMenu()
    {
        return $(this.options["contextMenu"]).get(0);
    },
    /**
     * Get a translation from the translation resources or one the user set
     * @param {string} key the key of the translation to look up
     * @param {Array|Object|null} args the arguments to pass into the translated string
     * @return {string} the string returned from the resources
     * @private
     */
    _getTranslation: function(key, args)
    {
        return this.getTranslatedString(key, args);
    },
    /**
     * Callback from the resize dialog box, which sends the results to the grid
     * @param {Event} event the event that triggered the dialog button press
     * @private
     */
    _handleResizeDialog: function(event)
    {
        var value = $('#' + this.rootId + 'spinner').ojInputNumber("option", "value");
        $('#' + this.rootId + 'dialog').ojDialog("close");
        this.grid.handleContextMenuReturn(this.contextMenuEvent, this.menuItemFunction, value);
        this.contextMenuEvent['target'].focus();
    },
    /**
     * Build the html for the resize dialog and add it to the root node
     * @param {string} title the header title for the dialog
     * @param {number} initialSize the initial size to put in the spinner
     * @private
     */
    _buildResizeDialog: function(title, initialSize)
    {
        var dialog, dialogBody, spinner, dialogFooter, dialogOKButton;
        //create the base dialog
        dialog =  $('#' + this.rootId + 'dialog');
        spinner = $('#' + this.rootId + 'spinner');
        if (dialog.length === 0 || spinner.length === 0)
        {
            dialog = $('<div>');
            dialog.attr('id', this.rootId + 'dialog');
            dialog.attr('title', title);
            dialogBody = $('<div class="oj-dialog-body"></div>');
            dialogFooter = $('<div class="oj-dialog-footer"></div>');
            dialog.append(dialogBody).append(dialogFooter); //@HTMLUpdateOK

            //create the dialog content
            spinner = $('<input id="' + this.rootId + 'spinner"/>');
            dialogOKButton = $('<button id="' + this.rootId + 'dialogsubmit"/>');

            dialogBody.append(spinner); //@HTMLUpdateOK
            dialogFooter.append(dialogOKButton); //@HTMLUpdateOK
            $(this.root).append(dialog); //@HTMLUpdateOK

            dialogOKButton.ojButton({component: 'ojButton', label: this._getTranslation('labelResizeDialogSubmit')});
            dialogOKButton.on('click', this._handleResizeDialog.bind(this));
            spinner.ojInputNumber({component: 'ojInputNumber', max:1000, min:20, step:1, value:initialSize});
            dialog.ojDialog({initialVisibility:'show', position:{my: "center center", at: "center center", collision:"none", of:$(this.root)}});
        }
        else
        {
            spinner.ojInputNumber('option', 'value', initialSize);
            $('#' + this.rootId + 'dialog').ojDialog("open");
        }
    },
    /**
     * Handle an ojselect event on a menu item, if sort call the handler on the core.
     * If resize prompt the user with a dialog box
     * @param {Event} event event triggering context menu
     * @param {Object} ui an object containing the menu item that was selected
     * @private
     */
    _handleContextMenuSelect: function(event, ui)
    {
        var initialSize, parent;

        this.menuItemFunction = ui.item.attr('data-oj-command');
        if (this.menuItemFunction === this._getMappedCommand('sortColAsc') || this.menuItemFunction === this._getMappedCommand('sortColDsc')
            || this.menuItemFunction === this._getMappedCommand('cut') || this.menuItemFunction === this._getMappedCommand('paste'))
        {
            this.grid.handleContextMenuReturn(this.contextMenuEvent, this.menuItemFunction, null);
            //this.contextMenuEvent['target'].focus();
        }
        else if (this.menuItemFunction === this._getMappedCommand('resizeWidth') || this.menuItemFunction === this._getMappedCommand('resizeHeight'))
        {
            parent = $(this.contextMenuEvent['target']).closest('.' + this._getMappedStyle('cell'));
            if (parent.length == 0)
            {
                parent = $(this.contextMenuEvent['target']).closest('.' + this._getMappedStyle('headercell'));
            }
            if (parent.length > 0)
            {
                initialSize = this.menuItemFunction === this._getMappedCommand('resizeWidth') ? parent.outerWidth() : parent.outerHeight();
                this._buildResizeDialog(ui.item.text(), initialSize);
            }
        }
        else if (this.menuItemFunction === this._getMappedCommand('discontiguousSelection'))
        {
            this._discontiguousSelection = !this._discontiguousSelection;
            this.grid.handleContextMenuReturn(this.contextMenuEvent, this.menuItemFunction, this._discontiguousSelection);

            // toggle discontigous context menu label text
            var key = this._discontiguousSelection ? 'labelDisableNonContiguous' : 'labelEnableNonContiguous';
            ui.item.children().first().text(this._getTranslation(key)); //@HTMLUpdateOK
        }
    },

   /**
    * @param {Object} menu The JET Menu to open as a context menu
    * @param {Event} event What triggered the menu launch
    * @param {string} eventType "mouse", "touch", "keyboard"
    * @private
    */
    _NotifyContextMenuGesture: function(menu, event, eventType)
    {
        this.grid.handleContextMenuGesture(event, eventType, this._contextMenuGestureCallback.bind(this));
    },

   /**
    * Callback for NotifyContextMenuGesture
    * @param {Object} returnVal Object containing capabilities and launcher
    * @param {Event} event What triggered the menu launch
    * @param {string} eventType "mouse", "touch", "keyboard"
    * @private
    */
    _contextMenuGestureCallback: function(returnVal, event, eventType)
    {
        var launcher, capabilities, openOptions;

        if (returnVal == null)
        {
            return;
        }

        this.contextMenuEvent = event['originalEvent'];
        launcher = returnVal['launcher'];
        capabilities = returnVal['capabilities'];
        this._manageContextMenu(capabilities);

        //setting position relative to the cell/header in the SHIFT+F10 case
        //set here to avoid conflicting with user override in before open event
        openOptions = (eventType === "keyboard")
                ? {"position": {"of": launcher}, "launcher": $(launcher)}
        : {"launcher": $(launcher)};

        this._OpenContextMenu(event, eventType, openOptions);
    },
    /**
     * Add the disabled class to the menu item with a given command
     * @param {string} command the command to add the diabled attribute to
     * @private
     */
    _addContextMenuCapability: function(command)
    {
        var contextMenu;
        contextMenu = $(this._getDataGridContextMenu());
        if (!contextMenu.find("[data-oj-command=" + command + "]").hasClass('oj-disabled'))
        {
            contextMenu.find("[data-oj-command=" + command + "]").addClass('oj-disabled');
        }
    },
    /**
     * Remove the disabled class to the menu item with a given command
     * @param {string} command the command to remove the diabled attribute to
     * @private
     */
    _removeContextMenuCapability: function(command)
    {
        $(this._getDataGridContextMenu()).find("[data-oj-command=" + command + "]").removeClass('oj-disabled');
    },
    /**
     * Based on an object containing the capabilities, add or remove the disable attribute
     * @param {Object} capabilities an object with keys of resizable, sortable
     * @private
     */
    _manageContextMenu: function(capabilities)
    {
        var property, command;
        for (property in capabilities)
        {
            if (capabilities.hasOwnProperty(property))
            {
                command = this.resources.getMappedCommand(property);
                if (capabilities[property] === 'disable')
                {
                    this._addContextMenuCapability(command);
                }
                else
                {
                    this._removeContextMenuCapability(command);
                }
            }
        }
    },

    /**
     * Find the index of a cell
     * @param {Object} element the cell to find the index of
     * @return {Object} an object containing rowIndex and columnIndex
     * @private
     */
    _findCellIndex: function(element)
    {
        var row, rowIndex, columnIndex;
        row = element.parent();
        columnIndex = element.index();
        rowIndex = row.index();
        return {'rowIndex': rowIndex, 'columnIndex': columnIndex};
    },

    /**
     * Find the headers corresponding to a cell indicies
     * @param {Object} index the index to find the headers at
     * @return {Object} an object containing rowHeader and columnHeader
     * @private
     */
    _findHeadersByCellIndex: function(index)
    {
        var rowHeader, columnHeader;
        rowHeader = this._getRowHeader().children().eq(0).children().eq(index['rowIndex'] + 1);
        columnHeader = this._getColumnHeader().children().eq(0).children().eq(index['columnIndex']);
        return {'rowHeader': rowHeader, 'columnHeader': columnHeader};
    },

    /**
     * Get the root grid as a jquery object
     * @private
     */
    _getGrid: function()
    {
        return $(this.root);
    },

    /**
     * Get the column header container as a jquery object
     * @private
     */
    _getColumnHeader: function()
    {
        return $('#' + this.rootId + '\\:columnHeader');
    },

    /**
     * Get the row header container as a jquery object
     * @private
     */
    _getRowHeader: function()
    {
        return $('#' + this.rootId + '\\:rowHeader');
    },

    /**
     * Get the databody rows as a jquery object
     * @private
     */
    _getDatabodyRows: function()
    {
        return $('#' + this.rootId + '\\:databody .'+ this._getMappedStyle('row'));
    },


    /**
     * @private
     */
    _setDataSource: function()
    {
        if (this.options['data'] != null)
        {
            this.datasource = this.options['data'];
        }
        else
        {
            this.datasource = null;
        }
    },

    /**
     * Sets selection on internal grid from options
     * @private
     */
    _setSelection: function()
    {
        var selection = this.options['selection'];
        if (selection != null)
        {
            this.grid.SetSelection(selection);
        }
    },

    /**
     * Modify the header and cell context before passing to the renderer.
     * @param {Object} context the header or cell context.
     * @private
     */
    _modifyContext: function(context)
    {
        context['component'] = oj.Components.getWidgetConstructor(this.element, 'ojDataGrid');
    },

    /**
     * Sets accessible context information about the current active cell.
     * Invoked by row expander to set accessible context info on the datagrid (and
     * the info is then read by the screen reader)
     * @param {Object} context
     * @private
     */
    _setAccessibleContext: function(context)
    {
        this.grid.SetAccessibleContext(context);
    },

    /**
     * Unregister event listeners for resize the container DOM element.
     * @param {Element} element  DOM element
     * @private
     */
    _unregisterResizeListener: function(element)
    {
        if (element && this._resizeHandler)
        {
            // remove existing listener
            oj.DomUtils.removeResizeListener(element, this._resizeHandler);
        }
    },

    /**
     * Register event listeners for resize the container DOM element.
     * @param {Element} element  DOM element
     * @private
     */
    _registerResizeListener: function(element)
    {
        if (element)
        {
            if (this._resizeHandler == null)
            {
                this._resizeHandler = this._handleResize.bind(this);
            }

            oj.DomUtils.addResizeListener(element, this._resizeHandler);
        }
    },

    /**
     * The resize handler.
     * @param {number} width the new width
     * @param {number} height the new height
     * @private
     */
    _handleResize: function(width, height)
    {
        if (width > 0 && height > 0)
        {
            //if we get a resize event make sure there aren't pending refresh or render calls
            this._possiblyRenderOrRefresh();
            this.grid.HandleResize(width, height);
        }
    },

    /**
     * Return the subcomponent node represented by the documented locator attribute values.
     * <p>
     * To lookup a cell the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-datagrid-cell'</li>
     * <li><b>rowIndex</b>: the zero based absolute row index</li>
     * <li><b>columnIndex</b>: the zero based absolute column index</li>
     * </ul>
     *
     * To lookup a header the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-datagrid-header'</li>
     * <li><b>axis</b>: 'column'/'row'</li>
     * <li><b>index</b>: the zero based absolute row/column index.</li>
     * <li><b>level</b>: the zero based header level, 0 is the outer edge, if not specified will default to 0</li>
     * </ul>
     * For nested headers the index increments by the extent of the header. So if the header at index 0 on a level has an extent of 4,
     * the next header on that level will be at index 4.
     *
     * To lookup a sort icon the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-datagrid-sort-ascending'/'oj-datagrid-sort-descending'</li>
     * <li><b>axis</b>: 'column'/'row'</li>
     * <li><b>index</b>: the zero based absolute row/column index</li>
     * <li><b>level</b>: the zero based header level, 0 is the outer edge, if not specified will default to 0</li>
     * </ul>
     *
     * @expose
     * @memberof! oj.ojDataGrid
     * @instance
     * @override
     * @param {Object} locator An Object containing at minimum a subId property
     *        whose value is a string, documented by the component, that allows
     *         the component to look up the subcomponent associated with that
     *        string.  It contains:<p>
     *        component: optional - in the future there may be more than one
     *        component contained within a page element<p>
     *        subId: the string, documented by the component, that the component
     *        expects in getNodeBySubId to locate a particular subcomponent
     * @returns {Array.<(Element|null)>|Element|null} the subcomponent located by the subId string passed
     *          in locator, if found.<p>
     */
    getNodeBySubId: function(locator)
    {
        var subId, header, rowIndex,columnIndex, index, axis, level, returnElement;
        if (locator == null)
        {
          return this.element ? this.element[0] : null;
        }

        subId = locator['subId'];
        if (subId === 'oj-datagrid-cell')
        {
            rowIndex = locator['rowIndex'] -  this.grid.getStartRow();
            columnIndex = locator['columnIndex'] -  this.grid.getStartColumn();
            returnElement = this._getDatabodyRows().eq(rowIndex).children().eq(columnIndex);
        }
        else if (subId === 'oj-datagrid-sort-icon' || subId === 'oj-datagrid-sort-ascending' || subId === 'oj-datagrid-sort-descending' || subId === 'oj-datagrid-header')
        {
            axis = locator['axis'];
            index = locator['index'];
            level = locator['level'] == null ? 0 : locator['level'];
            if (axis === 'column')
            {
                header = this._getHeaderByIndex(index, level, $('#' + this.rootId + '\\:columnHeader'), this.grid.getStartColumnHeader());
            }
            else if (axis === 'row')
            {
                header = this._getHeaderByIndex(index, level, $('#' + this.rootId + '\\:rowHeader'), this.grid.getStartRowHeader());
            }
            if (header == null)
            {
                return null;
            }
            
            // depricated in 1.2 look to remove in the future
            if (subId === 'oj-datagrid-sort-icon')
            {
                return header.children('.' + this._getMappedStyle('sortcontainer')).children().get(0);
            }            
            else if (subId === 'oj-datagrid-sort-ascending')
            {
                returnElement = header.find('.' + this._getMappedStyle('sortascending'));
            }
            else if (subId === 'oj-datagrid-sort-descending')
            {
                returnElement = header.find('.' + this._getMappedStyle('sortdescending'));
            }  
            else
            {
                returnElement = header;
            }
        }

        if (returnElement != null && returnElement.length > 0)
        {
            return returnElement[0];
        }
       // Non-null locators have to be handled by the component subclasses
        return null;
    },

    /**
     * Returns the subId string for the given child DOM node.  For more details, see
     * <a href="#getNodeBySubId">getNodeBySubId</a>.
     *
     * @expose
     * @override
     * @memberof oj.ojDataGrid
     * @instance
     *
     * @param {!Element} node - child DOM node
     * @return {Object|null} The subId for the DOM node, or <code class="prettyprint">null</code> when none is found.
     *
     * @example <caption>Get the subId for a certain DOM node:</caption>
     * var subId = $( ".selector" ).ojDataGrid( "getSubIdByNode", nodeInsideComponent );
     */
    getSubIdByNode: function(node)
    {
        var cell, context, header, subId, indexes;
        cell = $(node).closest('.' + this._getMappedStyle('cell'));
        if (cell.length > 0)
        {
            indexes = this._findCellIndex(cell);                        
            return { 
                'subId': 'oj-datagrid-cell',
                'rowIndex': indexes['rowIndex'] + this.grid.getStartRow(),
                'columnIndex': indexes['columnIndex'] + this.grid.getStartColumn()
            };
        }

        header = $(node).closest('.' + this._getMappedStyle('headercell'));
        if (header.length > 0)
        {
            context = header[0][this._getMappedAttribute('context')];
            if ($(node).hasClass(this._getMappedStyle('sortascending')))
            {
                subId = 'oj-datagrid-sort-ascending';                
            }
            else if ($(node).hasClass(this._getMappedStyle('sortdescending')))
            {
                subId = 'oj-datagrid-sort-descending';
            }
            else
            {
                subId = 'oj-datagrid-header';
            }
            return {
                'subId': subId,
                'axis': context['axis'],
                'index': this._getHeaderIndex(header),
                'level': context['level']
            };            
        }

        return null;
    },
            
    /**
     * Returns an object with context for the given child DOM node. 
     * This will always contain the subid for the node, defined as the 'subId' property on the context object. 
     * Additional component specific information may also be included. For more details on returned objects, see context objects.
     *
     * @param {!Element} node - The child DOM node
     * @returns {Object|null} - The context for the DOM node, or null when none is found.
     *
     * @example  
     * // Foo is ojInputNumber, ojInputDate, etc.
     * // Returns {'subId': oj-foo-subid, 'property1': componentSpecificProperty, ...}
     * var context = $( ".selector" ).ojFoo( "getContextByNode", nodeInsideComponent );
     *
     * @expose
     * @instance
     * @memberof oj.ojDataGrid
     */
    getContextByNode: function(node)
    {
        var cell, header, context, index;
        
        cell = $(node).closest('.' + this._getMappedStyle('cell'));
        if (cell.length > 0)
        {
            context = cell[0][this._getMappedAttribute('context')];
            index = this._findCellIndex(cell);            
            return {
                'subId': 'oj-datagrid-cell',
                'component': context['component'],
                'data': context['data'],
                'datasource': context['datasource'],                        
                'indexes': {
                    'row': index['rowIndex'] + this.grid.getStartRow(),
                    'column': index['columnIndex'] + this.grid.getStartColumn()
                },
                'keys': {
                    'row': context['keys']['row'],
                    'column': context['keys']['column']
                }
            };
        }

        header = $(node).closest('.' + this._getMappedStyle('headercell'));
        if (header.length > 0)
        {
            context = header[0][this._getMappedAttribute('context')];
            return {
                'subId': 'oj-datagrid-header',
                'axis': context['axis'],
                'component': context['component'],
                'data': context['data'],
                'datasource': context['datasource'],
                'depth': context['depth'],
                'extent': context['extent'],
                'index': this._getHeaderIndex(header),
                'key': context['key'],
                'level': context['level']
            };
        }

        return null;
    },             

    /**
     * Get the mapped style from the resources
     * @param {string} key style mapping key
     * @private
     */
    _getMappedStyle: function(key)
    {
        return this.resources.getMappedStyle(key);
    },

    /**
     * Get the mapped attribute from the resources
     * @param {string} key attribute mapping key
     * @private
     */
    _getMappedAttribute: function(key)
    {
        return this.resources.getMappedAttribute(key);
    },

    /**
     * Get the mapped command from the resources
     * @param {string} key command mapping key
     * @private
     */
    _getMappedCommand: function(key)
    {
        return this.resources.getMappedCommand(key);
    },

    /**
     * Checks if sizing is available for the grid
     * @return {boolean} true if the root element is visible and attached to the DOM
     * @private
     */
    _isDataGridSizingAvailable: function()
    {
        if(this.root.offsetParent != null)
        {
            return true;
        }
        return false;
    },

    /**
     * Render or refresh the datagrid depending on the internal visibilty state of the DataGrid
     * If the data grid has sizing information available and is in render or refresh state call
     * the appropriate action and update the visibility property. If sizing is not available leave
     * the visibility property alone
     * @private
     */
    _possiblyRenderOrRefresh: function()
    {
        var visibility = this.grid.getVisibility();
        // If sizing not available yet do not change any flags or render
        if (this._isDataGridSizingAvailable())
        {
            if (visibility === DvtDataGrid.VISIBILITY_STATE_RENDER)
            {
                this.grid.render(this.root);
            }
            else if (visibility === DvtDataGrid.VISIBILITY_STATE_REFRESH)
            {
                this.grid.refresh(this.root);
            }
            //if sizing is available we are visible
            this.grid.setVisibility(DvtDataGrid.VISIBILITY_STATE_VISIBLE);
        }
        else
        {
            // Sizing isn't available, make sure we know the datagrid is hidden
            // should the app developer fail to call notifyHide, handle it here
            if (visibility === DvtDataGrid.VISIBILITY_STATE_VISIBLE)
            {
                this.grid.setVisibility(DvtDataGrid.VISIBILITY_STATE_HIDDEN);
            }
        }
    },

    /**
     * Get a header at a particular index and level
     * @param {number} index the absolute index of the header to get
     * @param {number} level the absolute level
     * @param {Object} headerContainer jQuery object of the row or column header
     * @param {number} start the start index of the headers in the data grid
     * @return {Object|null} jQuery object of the header or null if not found
     * @private
     */
    _getHeaderByIndex: function(index, level, headerContainer, start)
    {
        var lastHeader, grouping, relativeIndex;
        if (level < 0)
        {
            return null;
        }

        //get the last header and make sure it's a grouping or a cell
        lastHeader = headerContainer.children().first().children().last();
        if (lastHeader.hasClass(this._getMappedStyle('headercell')))
        {
            //if the first header is just a cell there is only one level, get the cell by just index
            return headerContainer.children().first().children('.' + this._getMappedStyle('headercell')).eq(index - start);
        }

        //otherwise get the grouping container
        grouping = this._getGroupingContainer(index, level, 0, headerContainer.children().first().children());
        if (grouping == null)
        {
            return null;
        }

        if (level <= (parseInt(grouping.attr(this._getMappedAttribute('level')), 10) + parseInt(grouping.children().eq(0).attr(this._getMappedAttribute('depth')), 10) - 1))
        {
            //otherwise first child of the group is the header
            return grouping.children().eq(0);
        }

        // if the level we want is not the level of the group we wanted the innermost level
        start = parseInt(grouping.attr(this._getMappedAttribute('start')), 10);
        relativeIndex = index - start + 1;
        return grouping.children().eq(relativeIndex);        
    },

    /**
     * Get a header container for nested headers at a particular index and level
     * @param {number} index the absolute index of the header to get
     * @param {number} level the absolute level
     * @param {number} currentLevel the level we are looking on
     * @param {Object} headers a jquery object of headers and groupings at the currentLevel
     * @return {Object|null} jQuery object of the header grouping or null if not found
     * @private
     */
     _getGroupingContainer: function (index, level, currentLevel, headers)
    {
        var headerIndex, headerExtent, i, headerRoot, headerDepth;
        //if the second child is the header cell or there is no second child we have the grouping
        if(headers.eq(1) == null || headers.eq(1).hasClass(this._getMappedStyle('headercell')))
        {
            // if we are on the innermost level
            if (level === currentLevel)
            {
                return headers.eq(0).parent();
            }
            return null;
        }
        headerRoot = headers.parent().parent();
        // avoids skipping the first group on headers
        if (headerRoot.hasClass(this._getMappedStyle('colheader')) || headerRoot.hasClass(this._getMappedStyle('rowheader')))
        {
            i = 0;
        }
        else
        {
            i = 1;
        }

        // loop over all headers skipping firstChild of groups
        for (;i < headers.length; i++)
        {
            // if the index is between that header start and start+extent dig deeper
            headerIndex = parseInt(headers.eq(i).attr(this._getMappedAttribute('start')), 10);
            headerExtent = parseInt(headers.eq(i).attr(this._getMappedAttribute('extent')), 10);
            headerDepth = parseInt(headers.eq(i).children().eq(0).attr(this._getMappedAttribute('depth')), 10);
            if (index >= headerIndex && index < headerIndex + headerExtent)
            {
                if (level < currentLevel + headerDepth)
                {
                    return headers.eq(i);
                }
                return this._getGroupingContainer(index, level, currentLevel + headerDepth, headers.eq(i).children());
            }
        };
        return null;
    },

    /**
     * Get the absolute index of a header
     * @param {Object} header the header
     * @return {number} the absolute index of the header
     * @private
     */
    _getHeaderIndex: function (header)
    {
        var index;

        // if there are multiple levels on the row header
        if (header.parent().hasClass(this._getMappedStyle('groupingcontainer')))
        {
            // get the groupingContainer's start value and set thtat to the index
            index = parseInt(header.parent().attr(this._getMappedAttribute('start')), 10);
            //if this is the groupingContainer's first child rturn that value
            if (header.get(0) === header.parent().children(":first").get(0))
            {
                return index;
            }
            //decrement the index by one for the first header element at the level above it
            index--;
        }
        else if (header.hasClass(this._getMappedStyle('rowheadercell')))
        {
            index = this.grid.getStartRowHeader();
        }
        else
        {
            index = this.grid.getStartColumnHeader();
        }

        index += header.index();
        return index;
    },
    /**
     * Get the level of a header
     * @param {Object} header the header
     * @return {number} the level of the header
     * @private
     */
    _getHeaderLevel: function (header)
    {
        var level;
        // if there are multiple levels on the row header
        if (header.parent().hasClass(this._getMappedStyle('groupingcontainer')))
        {
            level = parseInt(header.parent().attr(this._getMappedAttribute('level')), 10);
            if (header.get(0) === header.parent().children(":first").get(0))
            {
                return level;
            }
            // plus one case is if we are on the innermost level the headers do not have their own
            // grouping containers so if it is the first child it is the level of the grouping container
            // but all subsequent children are the next level in
            return level + 1;
        }
        return 0;
    },
    /**
     * Is multiple selection enabled
     * @return {boolean} true if multiple selection
     * @private
     */
    _isMultipleSelection: function ()
    {
        if (this.options['selectionMode'] != null)
        {
            if (this.options['selectionMode']['row'] === 'multiple' ||
                this.options['selectionMode']['cell'] === 'multiple')
            {
                return true;
            }
        }
        return false;
    },
    /**
     * Callback for datagrid to remove an element and call destroy on anything that is removed
     * @param {Element} element to remove
     * @private
     */
    _remove: function (element)
    {
        $(element).remove();
    },

    /**
     * Scroll the datagrid to an x,y pixel location. 
     * If the x,y point is outside the range of the viewport the grid will scroll to the nearest location.
     * If high-watermark scrolling is used, the grid will scroll within the currently fetched range.
     * 
     * @expose
     * @memberof! oj.ojDataGrid
     * @instance
     * 
     * @param {Object} options an object containing the scrollTo information
     * @param {Object} options.position scroll to an x,y pixel location which is relative to the origin of the grid
     * @param {Object} options.position.scrollX the x position in pixels of the scrollable region relative to the origin of the grid, this should always be positive. If RTL the value is the scroll position from the right of the grid.
     * @param {Object} options.position.scrollY the Y position in pixels of the scrollable region, this should always be positive.
     * 
     * @example <caption>Invoke the <code class="prettyprint">scrollTo</code> method:</caption>
     * $(".selector").ojDataGrid("scrollTo", {"position": {"scrollX": 50, "scrollY":100}});
     */     
    scrollTo: function(options)
    {
        this.grid.scroll(options);
    },
       
    /**
     * Returns a Promise that resolves when the component is ready, i.e. after data fetching, rendering, and animations complete. 
     * Note that in the highwatermark scrolling case, component is ready after data fetching, rendering, and associated animations of items fetched so far are complete.
     *
     * <p>This method does not accept any arguments.
     * 
     * @expose
     * @memberof oj.ojDataGrid
     * @instance
     * @return {Promise} A Promise that resolves when the component is ready.
     */
    whenReady: function()
    {
        return this._readyPromise;
    },            
            
    /**
     * Create a ready promise
	 * @private	 
     */
    _createReadyPromise: function()
    {
        var self = this;
        this._readyPromise = new Promise(function(resolve, reject)
        {
            self._readyResolve = resolve;
        });
    },

    /**
     * resolve the ready promise
	 * @private	 
     */
    _resolveReadyPromise: function()
    {
        this._readyResolve(null);
    }
        
    //////////////////     FRAGMENTS    //////////////////
    /**
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Gesture</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td rowspan="2">Cell</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Focus on the cell.  If <code class="prettyprint">selectionMode</code> for cells is enabled, selects the cell as well.
     *       If multiple selection is enabled the selection handles will appear. Tapping a different cell will deselect the previous selection.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Press & Hold</kbd></td>
     *       <td>Display context menu</td>
     *     </tr>
     *
     *     <tr>
     *       <td rowspan="3">Row</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>If <code class="prettyprint">selectionMode</code> for rows is enabled, selects the row as well.
     *       If multiple selection is enabled the selection handles will appear. Tapping a different row will deselect the previous selection.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Drag</kbd></td>
     *       <td>If the row that is dragged contains the active cell and <code class="prettyprint">dnd reorder row</code> is enabled the row will be moved within the data grid.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Press & Hold</kbd></td>
     *       <td>Display context menu</td>
     *     </tr>
     *
     *     <tr>
     *       <td rowspan="2">Header</td>
     *       <td><kbd>Press & Short Hold</kbd></td>
     *       <td>Focus on the header.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Press & Hold</kbd></td>
     *       <td>Display context menu</td>
     *     </tr>
     *
     *     <tr>
     *       <td>Column Header</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Sorts the column if <code class="prettyprint">sortable</code> enabled.</td>
     *     </tr>
     *
     *     <tr>
     *       <td>Header Gridline</td>
     *       <td><kbd>Drag</kbd></td>
     *       <td>Resizes the header if <code class="prettyprint">resizable</code> enabled along the axis.</td>
     *     </tr>
     *
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch section of classdesc, and standalone gesture doc
     * @memberof oj.ojDataGrid
     */

    /**
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td rowspan="17">Cell</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td>The first Tab into the DataGrid moves focus to the first cell of the first row.  The second Tab moves focus to the next focusable element outside of the DataGrid.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves focus to the cell of the previous column within the current row.  There is no wrapping at the beginning or end of the columns.  If a row header is present, then the row header next to the first column of the current row will gain focus.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves focus to the cell of the next column within the current row.  There is no wrapping at the beginning or end of the columns.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Moves focus to the cell of the previous row within the current column.  There is no wrapping at the beginning or end of the rows.  If a column header is present, then the column header above the first row of the current column will gain focus.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves focus to the cell of the next row within the current column.  There is no wrapping at the beginning or end of the rows.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Home</kbd></td>
     *       <td>Moves focus to the first (available) cell of the current row.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>End</kbd></td>
     *       <td>Moves focus to the last (available) cell of the current row.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageUp</kbd></td>
     *       <td>Moves focus to the first (available) cell in the current column.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageDown</kbd></td>
     *       <td>Moves focus to the last (available) cell in the current column.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + Space</kbd></td>
     *       <td>Selects all the cells of the current column.  This is only available if multiple cell selection mode is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Space</kbd></td>
     *       <td>Selects all the cells of the current row.  This is only available if multiple cell selection mode is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Arrow</kbd></td>
     *       <td>Extends the current selection.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + F8</kbd></td>
     *       <td>Freezes the current selection, therefore allowing user to move focus to another location to add additional cells to the current selection.  This is used to accomplish non-contiguous selection.  Use the Esc key or press Shift+F8 again to exit this mode.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + F10</kbd></td>
     *       <td>Brings up the context menu.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + X</kbd></td>
     *       <td>Marks the current row to move if dnd is enabled and the datasource supports move operation.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + V</kbd></td>
     *       <td>Move the row that is marked to directly under the current row.  If the row with the focused cell is the last row, then it will be move to the row above the current row.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + Alt + 5</kbd></td>
     *       <td>Read the context and content of the current cell to the screen reader.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="5">Column Header Cell</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves focus to the previous column header.  There is no wrapping at the beginning or end of the column headers.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves focus to the next column header.  There is no wrapping at the beginning or end of the column headers.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves focus to the cell of the first row directly below the column header.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Toggle the sort order of the column if the column is sortable.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + F10</kbd></td>
     *       <td>Brings up the context menu.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="5">Row Header Cell</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Moves focus to the previous row header.  There is no wrapping at the beginning or end of the row headers.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves focus to the next row header.  There is no wrapping at the beginning or end of the row headers.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves focus to the cell of the first column directly next to the row header.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves focus to the cell of the first column directly next to the row header in RTL direction.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + F10</kbd></td>
     *       <td>Brings up the context menu.</td>
     *     </tr>
     *   </tbody>
     * </table>
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojDataGrid
     */

    //////////////////     SUB-IDS     //////////////////

    /**
     * <p>Sub-ID for the ojDataGrid component's cells.</p>
     *
     * To lookup a cell the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-datagrid-cell'</li>
     * <li><b>rowIndex</b>: the zero based absolute row index</li>
     * <li><b>columnIndex</b>: the zero based absolute column index</li>
     * </ul>
     *
     * @ojsubid oj-datagrid-cell
     * @memberof oj.ojDataGrid
     *
     * @example <caption>Get the cell at row index 1 and column index 2:</caption>
     * var node = $( ".selector" ).ojDataGrid( "getNodeBySubId", {'subId': 'oj-datagrid-cell', 'rowIndex': 1, 'columnIndex': 2} );
     */

    /**
     * <p>Sub-ID for the ojDataGrid component's headers.</p>
     *
     * To lookup a header the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-datagrid-header'</li>
     * <li><b>axis</b>: 'column'/'row'</li>
     * <li><b>index</b>: the zero based absolute row/column index.</li>
     * <li><b>level</b>: the zero based header level, 0 is the outer edge, if not specified will default to 0</li>
     * </ul>
     *
     * @ojsubid oj-datagrid-header
     * @memberof oj.ojDataGrid
     *
     * @example <caption>Get the header at the specified location:</caption>
     * var node = $( ".selector" ).ojDataGrid( "getNodeBySubId", {'subId': 'oj-datagrid-header', 'axis': 'column', 'index':0, 'level':0} );
     */
    
    /**
     * <p>Sub-ID for the ojDataGrid component's sort ascending icon in column headers.</p>
     *
     * To lookup a sort icon the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-datagrid-sort-ascending'</li>
     * <li><b>axis</b>: 'column'</li>
     * <li><b>index</b>: the zero based absolute column index</li>
     * <li><b>level</b>: the zero based header level, 0 is the outer edge, if not specified will default to 0</li>
     * </ul>
     *
     * @ojsubid oj-datagrid-sort-ascending
     * @memberof oj.ojDataGrid
     *
     * @example <caption>Get the sort icon from the header at the specified location:</caption>
     * var node = $( ".selector" ).ojDataGrid( "getNodeBySubId", {'subId': 'oj-datagrid-sort-ascending', 'axis': 'column', 'index':0, 'level':0} );
     */
    
    /**
     * <p>Sub-ID for the ojDataGrid component's sort descending icon in column headers.</p>
     *
     * To lookup a sort icon the locator object should have the following:
     * <ul>
     * <li><b>subId</b>: 'oj-datagrid-sort-descending'</li>
     * <li><b>axis</b>: 'column'</li>
     * <li><b>index</b>: the zero based absolute column index</li>
     * <li><b>level</b>: the zero based header level, 0 is the outer edge, if not specified will default to 0</li>
     * </ul>
     *
     * @ojsubid oj-datagrid-sort-descending
     * @memberof oj.ojDataGrid
     *
     * @example <caption>Get the descending sort icon from the header at the specified location:</caption>
     * var node = $( ".selector" ).ojDataGrid( "getNodeBySubId", {'subId': 'oj-datagrid-sort-descending', 'axis': 'column', 'index':0, 'level':0} );
     */    
    
    /**
     * @deprecated Use the <a href="#oj-datagrid-sort-descending">oj-datagrid-sort-descending</a> or <a href="#oj-datagrid-sort-ascending">oj-datagrid-sort-ascending</a> instead. 
     * @ojsubid oj-datagrid-sort-icon
     * @memberof oj.ojDataGrid
     */    

    //////////////////     CONTEXTS     //////////////////
    /**
     * <p>Context for the ojDataGrid component's cells.</p>
     * 
     * @property {function} component a reference to the DataGrid widgetConstructor
     * @property {Object} data the data object for the header
     * @property {Object} datasource a reference to the data source object
     * @property {Object} indexes the object that contains both the zero based row index and column index in which the cell is bound to
     * @property {number} indexes.row the zero based absolute row index
     * @property {number} indexes.column the zero based absolute column index
     * @property {Object} keys the object that contains both the row key and column key which identifies the cell
     * @property {number|string} keys.row the row key
     * @property {number|string} keys.column the column key
     *
     * @ojnodecontext oj-datagrid-cell
     * @memberof oj.ojDataGrid
     */
    /**
     * <p>Context for the ojDataGrid component's headers.</p>
     *
     * @property {number} axis	the axis of the header, possible values are 'row' and 'column'
     * @property {function} component a reference to the DataGrid widgetConstructor
     * @property {Object} data the data object for the header
     * @property {Object} datasource a reference to the data source object
     * @property {number} depth the the number of levels the header spans
     * @property {number} extent the number of indexes the header spans
     * @property {number} index the index of the header, where 0 is the index of the first header
     * @property {number|string} key the key of the header
     * @property {number} level the level of the header. The outermost header is level zero
     *
     * @ojnodecontext oj-datagrid-header
     * @memberof oj.ojDataGrid
     */
});

});
