/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'promise', 'ojs/ojcomponentcore', 'ojs/ojdatasource-common', 'ojs/ojdatacollection-utils', 'ojs/ojinputnumber', 'ojs/ojmenu', 'ojs/ojdialog'], function(oj, $)
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
 * @ignore
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
    this.styles['endheader'] = "oj-datagrid-end-header";                    
    this.styles['groupingcontainer'] = "oj-datagrid-header-grouping";                
    this.styles['headercell'] = "oj-datagrid-header-cell";
    this.styles['headercelltext'] = "oj-datagrid-header-cell-text";
    this.styles['headercellcontent'] = "oj-datagrid-header-cell-content";
    this.styles['rowheader'] = "oj-datagrid-row-header";
    this.styles['colheader'] = "oj-datagrid-column-header";
    this.styles['colheadercell'] = "oj-datagrid-column-header-cell";
    this.styles['rowheadercell'] = "oj-datagrid-row-header-cell";
    this.styles['endheadercell'] = "oj-datagrid-end-header-cell";
    this.styles['endheadercelltext'] = "oj-datagrid-end-header-cell-text";
    this.styles['endheadercellcontent'] = "oj-datagrid-end-header-cell-content";
    this.styles['rowendheader'] = "oj-datagrid-row-end-header";
    this.styles['colendheader'] = "oj-datagrid-column-end-header";
    this.styles['colendheadercell'] = "oj-datagrid-column-end-header-cell";
    this.styles['rowendheadercell'] = "oj-datagrid-row-end-header-cell";    
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
    this.styles['readOnly'] = "oj-read-only";
    this.styles['editable'] = "oj-datagrid-editable";
    this.styles['cellEdit'] = "oj-datagrid-cell-edit";
    this.styles['draggable'] = "oj-draggable";
    this.styles['drag'] = "oj-drag";
    this.styles['drop'] = "oj-drop";
    this.styles['activedrop'] = "oj-active-drop";
    this.styles['validdrop'] = "oj-valid-drop";
    this.styles['invaliddrop'] = "oj-invalid-drop";
    this.styles['formcontrol'] = "oj-form-control-inherit";
    this.styles['borderHorizontalNone'] = "oj-datagrid-border-horizontal-none";
    this.styles['borderVerticalNone'] = "oj-datagrid-border-vertical-none";
    this.styles['borderHorizontalSmall'] = "oj-datagrid-small-content-border-horizontal";
    this.styles['borderVerticalSmall'] = "oj-datagrid-small-content-border-vertical";
    this.styles['offsetOutline'] = "oj-datagrid-focus-offset";
    
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
 * Creates a new DataGrid
 * @constructor
 * @private
 */
var DvtDataGrid = function()
{
    this.MAX_COLUMN_THRESHOLD = 20;
    this.MAX_ROW_THRESHOLD = 30;

    this.m_utils = new DvtDataGridUtils(this);

    this.m_discontiguousSelection = false;

    this.m_sizingManager = new DvtDataGridSizingManager();

    this.m_keyboardHandler = new DvtDataGridKeyboardHandler(this);

    this.m_rowHeaderWidth = null;
    this.m_rowEndHeaderWidth = null;
    this.m_colHeaderHeight = null;
    this.m_colEndHeaderHeight = null;

    // a mapping of style class+inline style combo to a dimension
    // to reduce the need to do excessive offsetWidth/offsetHeight
    this.m_styleClassDimensionMap = {};

    // cached whether row/column count are unknown
    this.m_isEstimateRowCount = undefined;
    this.m_isEstimateColumnCount = undefined;
    this.m_stopRowFetch = false;
    this.m_stopRowHeaderFetch = false;
    this.m_stopRowEndHeaderFetch = false;
    this.m_stopColumnFetch = false;
    this.m_stopColumnHeaderFetch = false;
    this.m_stopColumnEndHeaderFetch = false;

    // not done initializing until initial headers/cells are fetched
    this.m_initialized = false;
    this.m_shouldFocus = true;

    this.callbacks = {};
    
    this._setupActions();
    
    this.m_readinessStack = [];
    this.m_modelEvents = [];    
};

// keyCodes for data grid keyboard 
DvtDataGrid.keyCodes = 
{
    TAB_KEY : 9,
    ENTER_KEY : 13,
    SHIFT_KEY : 16,
    CTRL_KEY : 17,
    ALT_KEY : 18,
    ESC_KEY : 27,
    SPACE_KEY : 32,
    PAGEUP_KEY : 33,
    PAGEDOWN_KEY : 34,
    END_KEY : 35,
    HOME_KEY : 36,
    LEFT_KEY : 37,
    UP_KEY : 38,
    RIGHT_KEY : 39,
    DOWN_KEY : 40,
    NUM5_KEY : 53,
    V_KEY : 86,
    X_KEY : 88,
    F2_KEY : 113,
    F8_KEY : 119,
    F10_KEY : 121
};

// constants for update animation
DvtDataGrid.UPDATE_ANIMATION_FADE_INOUT = 1;
DvtDataGrid.UPDATE_ANIMATION_SLIDE_INOUT = 2;
DvtDataGrid.UPDATE_ANIMATION_DURATION = 250;

// constants for expand/collapse animation
DvtDataGrid.EXPAND_ANIMATION_DURATION = 500;
DvtDataGrid.COLLAPSE_ANIMATION_DURATION = 400;

// swipe gesture constants
DvtDataGrid.MAX_OVERSCROLL_PIXEL = 50;
DvtDataGrid.BOUNCE_ANIMATION_DURATION = 500;
DvtDataGrid.DECELERATION_FACTOR = 0.0006;
DvtDataGrid.TAP_AND_SCROLL_RESET = 300;
// related to timing and x/y position of events       
DvtDataGrid.MIN_SWIPE_DURATION = 200;
DvtDataGrid.MAX_SWIPE_DURATION = 400;
DvtDataGrid.MIN_SWIPE_DISTANCE = 10;
// for the actual transition animation
DvtDataGrid.MIN_SWIPE_TRANSITION_DURATION = 100;
DvtDataGrid.MAX_SWIPE_TRANSITION_DURATION = 500;

// constants for touch gestures
DvtDataGrid.CONTEXT_MENU_TAP_HOLD_DURATION = 750;
DvtDataGrid.HEADER_TAP_SHORT_HOLD_DURATION = 300;

// when filling viewport fetch when this close to the edge
DvtDataGrid.FETCH_PIXEL_THRESHOLD = 5;

//visibility constants
/**
 * @export
 */
DvtDataGrid.VISIBILITY_STATE_HIDDEN = 'hidden';
/**
 * @export
 */
DvtDataGrid.VISIBILITY_STATE_REFRESH = 'refresh';
/**
 * @export
 */
DvtDataGrid.VISIBILITY_STATE_RENDER = 'render';
/**
 * @export
 */
DvtDataGrid.VISIBILITY_STATE_VISIBLE = 'visible';

/**
 * Sets options on DataGrid
 * @export
 * @param {Object} options - the options to set on the data grid
 */
DvtDataGrid.prototype.SetOptions = function(options)
{
    this.m_options = new DvtDataGridOptions(options);
};

/**
 * Update options on DataGrid
 * @export
 * @param {Object} options - the options to set on the data grid
 * @param {Object=} flags - contains modified subkey
 */
DvtDataGrid.prototype.UpdateOptions = function(options, flags)
{
    var candidate;

    //We should check each updated option (candidate) from the list of updated options (first loop)
    //against options already presented in the internal DvtDataGridOptions (this.m_options) object in
    //purpose to keep them in sync.
    for (candidate in options)
    {
        if (candidate in this.m_options['options'])
        {
            if (this.m_options['options'][candidate] != options[candidate])
            {
                this.m_options['options'][candidate] = options[candidate];
            }
        }
    }
    //now update it
    for (candidate in options)
    {
        if (!this._updateDataGrid(candidate, flags))
        {
            this.empty();
            this.refresh(this.m_root);
            break;
        }
    }
};

/**
 * Partial update for DataGrid
 * @private
 * @param {string} option - the option to update the data grid based on
 * @param {Object=} flags - contains modified subKey if applicable
 * @return {boolean} true if redraw is not required otherwise return false
 */
DvtDataGrid.prototype._updateDataGrid = function(option, flags)
{
    var obj;

    switch (option)
    {
        // updates the data grid can make without refresh
        case "bandingInterval":
            this._removeBanding();
            this.updateColumnBanding();
            this.updateRowBanding();
            break;        
        case "currentCell":
            obj = this.m_options.getCurrentCell();
            this._updateActive(obj, true);
            break;        
        case "editMode":
            this.m_editMode = this.m_options.getEditMode();     
            break;
        case "gridlines":
            this._updateGridlines();
            break;
        case "header":
            obj = this.m_options['options']['header'];
            this._updateHeaderOptions(obj, flags);
            break;                
        case "scrollPosition":
            this.setInitialScrollPosition();
            break;
        case "selection":
            obj = this.m_options.getSelection();
            this._updateSelection(obj);
            break;
        
        // just refresh
        default:
            return false;
    }
    return true;
};

/**
 * Update selection from option
 * @private
 * @param {Object} selection the selection from options
 */
DvtDataGrid.prototype._updateSelection = function(selection)
{
    // selection should not be null
    if (selection == null)
    {
        return;
    }

    // check whether selection is enabled
    if (this._isSelectionEnabled())
    {
        // don't clear the selection so the old one can be passed in
        // sets the new selection
        this.SetSelection(selection);
    }
    else
    {
        // selection is not enable, still need to clear the selection in options
        selection.length = 0;
    }
};

/**
 * Update header resizable and sortable options, all others refresh the grid for now
 * @private
 * @param {Object} headerObject
 * @param {Object=} flags
 */
DvtDataGrid.prototype._updateHeaderOptions = function(headerObject, flags)
{
    var subKey, subKeyArray, axis, option, headers, header, headerContext, i, hasSortContainer, sortIcon;
    if (flags == null || flags['subkey'] == null)
    {
        return;
    }
    subKey = flags['subkey'];
    subKeyArray = subKey.split('.');
    axis = subKeyArray[0];
    option = subKeyArray[1];
    
    if (axis == 'column' && this.m_colHeader != null && this.m_colHeader['firstChild'] != null)
    {
        headers = this.m_colHeader['firstChild']['childNodes'];
    }
    else if (axis == 'row' && this.m_rowHeader != null && this.m_rowHeader['firstChild'] != null)
    {
        headers = this.m_rowHeader['firstChild']['childNodes'];        
    }
    else if (axis == 'columnEnd' && this.m_colEndHeader != null && this.m_colEndHeader['firstChild'] != null)
    {
        headers = this.m_colEndHeader['firstChild']['childNodes'];
    }
    else if (axis == 'rowEnd' && this.m_rowEndHeader != null && this.m_rowEndHeader['firstChild'] != null)
    {
        headers = this.m_rowEndHeader['firstChild']['childNodes'];        
    }
    
    if (headers != null)
    {
        for (i = 0; i < headers.length; i++)
        {
            header = headers[i];
            headerContext = header[this.getResources().getMappedAttribute('context')];
            headerContext['index'] = this.getHeaderCellIndex(header);
            
            if (option == 'resizable')
            {
                if (this._isHeaderResizeEnabled(axis, headerContext))
                {
                    this._setAttribute(header, option, 'true');
                }
                else
                {
                    this._setAttribute(header, option, 'false');                    
                }
            }
            else if (option == 'sortable')
            {
                hasSortContainer = this.m_utils.containsCSSClassName(header['lastChild'], this.getMappedStyle('sortcontainer'));
                if (this._isSortEnabled(axis, headerContext))
                {
                    if (!hasSortContainer)
                    {
                        sortIcon = this._buildSortIcon(headerContext);
                        header.appendChild(sortIcon); //@HTMLUpdateOK   
                    }
                    this._setAttribute(header, option, 'true');
                }      
                else
                {
                    if (hasSortContainer)
                    {
                        this._remove(header['lastChild']);
                    }
                    this._setAttribute(header, option, 'false');                    
                }
            }
        }
    }
};

/**
 * Update gridlines
 * @private
 */
DvtDataGrid.prototype._updateGridlines = function()
{
    var i, j, row, rowCount, horizontalGridlines, verticalGridlines, rows, dir;

    horizontalGridlines = this.m_options.getHorizontalGridlines();
    verticalGridlines = this.m_options.getVerticalGridlines();
    rows = this.m_databody['firstChild']['childNodes'];
    rowCount = rows.length;
    dir = this.getResources().isRTLMode() ? "right" : "left";
    for (i = 0; i < rowCount; i += 1)
    {
        row = rows[i]['childNodes'];
        for (j = 0; j < row.length; j += 1)
        {
            if (verticalGridlines === 'hidden' || (this._isLastColumn(j + this.m_startCol) && this.getRowHeaderWidth() + this.getElementDir(row[j], dir) + this.calculateColumnWidth(row[j]) >= this.getWidth()))
            {
                this.m_utils.addCSSClassName(row[j], this.getMappedStyle('borderVerticalNone'));
            }
            else
            {
                this.m_utils.removeCSSClassName(row[j], this.getMappedStyle('borderVerticalNone'));
            }
            
            if (horizontalGridlines === 'hidden' || (this._isLastRow(i + this.m_startRow) && this.getRowBottom(rows[i], null) >= this.getHeight()))
            {
                this.m_utils.addCSSClassName(row[j], this.getMappedStyle('borderHorizontalNone'));
            }
            else
            {
                this.m_utils.removeCSSClassName(row[j], this.getMappedStyle('borderHorizontalNone'));
            }
        }
    }
};

/**
 * 
 * @param {string=} activeValue
 * @param {string=} prevValue
 */
DvtDataGrid.prototype._updateEdgeCellBorders = function(activeValue, prevValue)
{
    var activeCell, prevActiveCell;
    if (this.m_active != null && this.m_active['type'] != 'header')
    {
        activeCell = this._getActiveElement();
        if (activeCell != null)
        {
            if (this._isLastRow(this.m_active['indexes']['row']))
            {
                if (activeValue == 'none')
                {
                    this.m_utils.addCSSClassName(activeCell, this.getMappedStyle('borderHorizontalNone'));
                }
                else
                {
                    this.m_utils.removeCSSClassName(activeCell, this.getMappedStyle('borderHorizontalNone'));
                }
            }
            
            if (this._isLastColumn(this.m_active['indexes']['column']))
            {
                if (activeValue == 'none')
                {
                    this.m_utils.addCSSClassName(activeCell, this.getMappedStyle('borderVerticalNone'));
                }
                else
                {
                    this.m_utils.removeCSSClassName(activeCell, this.getMappedStyle('borderVerticalNone'));
                }                
            }
        }
    }
    
    if (prevValue != null && this.m_prevActive != null && this.m_prevActive['type'] != 'header')
    {
        prevActiveCell = this._getElementFromActiveObject(this.m_prevActive);           
        if (prevActiveCell != null)
        {
            if (this._isLastRow(this.m_prevActive['indexes']['row']))
            {
                if (prevValue == 'none')
                {
                    this.m_utils.addCSSClassName(prevActiveCell, this.getMappedStyle('borderHorizontalNone'));
                }
                else
                {
                    this.m_utils.removeCSSClassName(prevActiveCell, this.getMappedStyle('borderHorizontalNone'));
                }      
            }                
            if (this._isLastColumn(this.m_prevActive['indexes']['column']))
            {
                if (prevValue == 'none')
                {
                    this.m_utils.addCSSClassName(prevActiveCell, this.getMappedStyle('borderVerticalNone'));
                }
                else
                {
                    this.m_utils.removeCSSClassName(prevActiveCell, this.getMappedStyle('borderVerticalNone'));
                }                    
            }       
        }
    }
};

/**
 * Gets options on DataGrid
 * @return {Object} the options set on the data grid
 */
DvtDataGrid.prototype.GetOptions = function()
{
    if (this.m_options == null)
    {
        this.m_options = new DvtDataGridOptions();
    }

    return this.m_options;
};

/**
 * Sets resources on DataGrid
 * @export
 * @param {Object} resources - the resources to set on the data grid
 */
DvtDataGrid.prototype.SetResources = function(resources)
{
    this.m_resources = resources;
};

/**
 * Gets resources from DataGrid
 * @export
 * @return {Object} the resources set on the data grid
 */
DvtDataGrid.prototype.getResources = function()
{
    return this.m_resources;
};

/**
 * Gets start row index from DataGrid
 * @export
 * @return {number} the start row index
 */
DvtDataGrid.prototype.getStartRow = function()
{
    return this.m_startRow;
};

/**
 * Gets start row header index from DataGrid
 * @export
 * @return {number} the start row header index
 */
DvtDataGrid.prototype.getStartRowHeader = function()
{
    return this.m_startRowHeader;
};

/**
 * Gets start column index from DataGrid
 * @export
 * @return {number} the start column index
 */
DvtDataGrid.prototype.getStartColumn = function()
{
    return this.m_startCol;
};

/**
 * Gets start column header index from DataGrid
 * @export
 * @return {number} the start column header index
 */
DvtDataGrid.prototype.getStartColumnHeader = function()
{
    return this.m_startColHeader;
};

/**
 * Gets start row end header index from DataGrid
 * @export
 * @return {number} the start row end header index
 */
DvtDataGrid.prototype.getStartRowEndHeader = function()
{
    return this.m_startRowEndHeader;
};

/**
 * Gets start column end header index from DataGrid
 * @export
 * @return {number} the start column end header index
 */
DvtDataGrid.prototype.getStartColumnEndHeader = function()
{
    return this.m_startColEndHeader;
};

/**
 * Gets mapped style from the resources
 * @private
 * @param {string} key the key to get style on
 * @return {string} the style from the resources
 */
DvtDataGrid.prototype.getMappedStyle = function(key)
{
    return this.getResources().getMappedStyle(key);
};

/**
 * Sets the data source on DataGrid
 * @export
 * @param {Object} dataSource - the data source to set on the data grid
 */
DvtDataGrid.prototype.SetDataSource = function(dataSource)
{
    this._removeDataSourceEventListeners();
    // if we are setting a new data source be sure to clear out any old
    // model events
    this.m_modelEvents = [];
    
    if (dataSource != null)
    {
        this.m_handleModelEventListener = this.handleModelEvent.bind(this);
        this.m_handleExpandEventListener = this.handleExpandEvent.bind(this);
        this.m_handleCollapseEventListener = this.handleCollapseEvent.bind(this);

        dataSource.on("change", this.m_handleModelEventListener, this);
        // if it's not flattened datasource, these will be ignored
        dataSource.on("expand", this.m_handleExpandEventListener, this);
        dataSource.on("collapse", this.m_handleCollapseEventListener, this);
    }
    this.m_dataSource = dataSource;
};

/**
 * Gets the data source from the DataGrid
 * @export
 * @return {Object} the data source set on the data grid
 */
DvtDataGrid.prototype.getDataSource = function()
{
    return this.m_dataSource;
};

/**
 * Set the internal visibility of datagrid
 * @param {string} state a string for the visibility
 * @export
 */
DvtDataGrid.prototype.setVisibility = function(state)
{
    this.m_visibility = state;
};

/**
 * Get the internal visibility of datagrid
 * @return {string} visibility
 * @export
 */
DvtDataGrid.prototype.getVisibility = function()
{
    if (this.m_visibility == null)
    {
        if (this.m_root.offsetParent != null)
        {
            this.setVisibility(DvtDataGrid.VISIBILITY_STATE_VISIBLE);
        }
        else
        {
            this.setVisibility(DvtDataGrid.VISIBILITY_STATE_HIDDEN);
        }
    }
    return this.m_visibility;
};

/**
 * Set the callback for remove
 * @param {Function} callback a callback for the remove function
 * @export
 */
DvtDataGrid.prototype.SetOptionCallback = function(callback)
{
    this.m_setOptionCallback = callback;
};

/**
 * Set the callback for remove
 * @param {Function} callback a callback for the remove function
 * @export
 */
DvtDataGrid.prototype.SetRemoveCallback = function(callback)
{
    this.m_removeCallback = callback;
};

/**
 * Remove an element from the DOM, if it is not being reattached
 * @param {Element} element the element to remove
 * @export
 */
DvtDataGrid.prototype._remove = function(element)
{
    // check if there is a callback set for remove
    // callback allows jQuery to clean the node on a remove
    if (this.m_removeCallback != null)
    {
        this.m_removeCallback.call(null, element);
    }
    else
    {
        element['parentNode'].removeChild(element);
    }
};

/**
 * Set the callback for creating a when ready promise
 * @param {Function} callback a callback for the remove function
 * @export
 */
DvtDataGrid.prototype.SetCreateReadyPromiseCallback = function(callback)
{
    this.m_createReadyPromise = callback;
};

/**
 * Set the callback for resolving a ready promise
 * @param {Function} callback a callback for the remove function
 * @export
 */
DvtDataGrid.prototype.SetResolveReadyPromiseCallback = function(callback)
{
    this.m_resolveReadyPromise = callback;
};

/**
  * Invoke whenever a task is started. Moves the component out of the ready state if necessary.
  */
DvtDataGrid.prototype._signalTaskStart = function()
{
    if (this.m_readinessStack)
    {
        if (this.m_readinessStack.length == 0)
        {
            this.m_createReadyPromise();
        }
        this.m_readinessStack.push(1);
    }
};

/**
 * Invoke whenever a task finishes. Resolves the readyPromise if component is ready to move into ready state.
 */
DvtDataGrid.prototype._signalTaskEnd = function()
{
    if (this.m_readinessStack && this.m_readinessStack.length > 0)
    {
        this.m_readinessStack.pop();
        if (this.m_readinessStack.length == 0)
        {
            this.m_resolveReadyPromise();
        }
    }
};

/**
 * Get the indexes from the data source and call back to a function once they are available.
 * The callback should be a function(keys, indexes)
 * @param {Object} keys the keys to find the index of with properties row, column
 * @param {Function} callback the callback to pass the keys back to
 * @private
 */
DvtDataGrid.prototype._indexes = function(keys, callback)
{
    var self = this, indexes;
    indexes = this.getDataSource().indexes(keys);
    if (typeof indexes['then'] === 'function')
    {
        // start async indexes call
        self._signalTaskStart();
        indexes.then(function(obj) {
            callback.call(self, obj, keys);
            // end async indexes call
            self._signalTaskEnd();
        }, function()
        {
            callback.call(self, {'row': -1, 'column': -1}, keys);
            // end async indexes call
            self._signalTaskEnd();
        });
    }
    else
    {
        callback.call(self, indexes, keys);
    }
};

/**
 * Get the keys from the data source and call back to a function once they are available.
 * The callback should be a function(indexes, keys)
 * @param {Object} indexes the indexes to find the keys of with properties row, column
 * @param {Function} callback the callback to pass the indexes back to
 * @private
 */
DvtDataGrid.prototype._keys = function(indexes, callback)
{
    var self = this, keys;
    keys = this.getDataSource().keys(indexes);
    if (typeof keys['then'] === 'function')
    {
        // start async call
        self._signalTaskStart();
        keys.then(function(obj) {
            callback.call(self, obj, indexes);
            // end async indexes call
            self._signalTaskEnd();
        }, function()
        {
            callback.call(self, {'row': null, 'column': null}, indexes);
            // end async indexes call
            self._signalTaskEnd();
        });
    }
    else
    {
        callback.call(self, keys, indexes);
    }
};

/**
 * Helper method to get keys from the DOM rather than the data source.
 * If the indexes do not exist in the DOM the key will be null for the row/column
 * @param {Object} indexes the indexes to find the keys of with properties row, column
 * @private
 * @return {Object} the keys in an object with row/column
 */
DvtDataGrid.prototype._getLocalKeys = function(indexes)
{
    var keys = {'row': null, 'column': null};

    if (indexes['row'] != null)
    {
        keys['row'] = this._getKey(this.m_databody['firstChild']['childNodes'][indexes['row'] - this.m_startRow]);
    }

    if (indexes['column'] != null)
    {
        keys['column'] = this._getKey(this._getHeaderByIndex(indexes['column'], this.m_columnHeaderLevelCount - 1, this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader));
    }
    return keys;
};

/**
 * Register a callback when creating the header context or cell context.
 * @param {function(Object)} callback the callback function to inject addition or modify
 *        properties in the context.
 * @export
 */
DvtDataGrid.prototype.SetCreateContextCallback = function(callback)
{
    this.m_createContextCallback = callback;
};

/**
 * Register the focusable callbacks for handling focus classNames
 * @param {function()} focusInHandler
 * @param {function()} focusOutHandler
 * @export
 */
DvtDataGrid.prototype.SetFocusableCallback =  function(focusInHandler, focusOutHandler) 
{
    this.m_focusInHandler = focusInHandler;
    this.m_focusOutHandler = focusOutHandler;
};

/**
 * Whether high watermark scrolling is used
 * @return {boolean} true if high watermark scrolling is used, false otherwise
 * @private
 */
DvtDataGrid.prototype._isHighWatermarkScrolling = function()
{
    return (this.m_options.getScrollPolicy() != "scroll");
};

/**
 * Destructor method that should be called when the widget is destroyed. Removes event
 * listeners on the document.
 * @export
 */
DvtDataGrid.prototype.destroy = function()
{
    delete this.m_fetching;
    this._removeDataSourceEventListeners();
    this._removeDomEventListeners();
    delete this.m_styleClassDimensionMap;
    this.m_styleClassDimensionMap = {};
};

/**
 * Remove data source event listeners
 * @private
 */
DvtDataGrid.prototype._removeDataSourceEventListeners = function()
{
    if (this.m_dataSource != null)
    {
        this.m_dataSource.off("change", this.m_handleModelEventListener);
        this.m_dataSource.off("expand", this.m_handleExpandEventListener);
        this.m_dataSource.off("collapse", this.m_handleCollapseEventListener);
    }
};

/**
 * Remove dom event listeners
 * @private
 */
DvtDataGrid.prototype._removeDomEventListeners = function()
{
    document.removeEventListener("mousemove", this.m_docMouseMoveListener, false);
    document.removeEventListener("mouseup", this.m_docMouseUpListener, false);
    // unregister all listeners

    if (this.m_root != null)
    {
        if (this.m_handleDatabodyKeyDown)
        {
            this.m_root.removeEventListener("keydown", this.m_handleDatabodyKeyDown, false);
        }
        if (this.m_handleRootFocus)
        {
            this.m_root.removeEventListener("focus", this.m_handleRootFocus, false);
        }
        if (this.m_handleRootBlur)
        {
            this.m_root.removeEventListener("blur", this.m_handleRootBlur, false);
        }
    }
};

/**
 * Get the DataGrid root element
 * @return {Element} the root element
 */
DvtDataGrid.prototype.getRootElement = function()
{
    return this.m_root;
};

/**
 * Get the cached width of the root element. If not cached, sets the cached width.
 * @return {number} the cached width of the root element
 * @protected
 */
DvtDataGrid.prototype.getWidth = function()
{
    if (this.m_width == null)
    {
        //clientWidth since we use border box and care about the content of our root div
        this.m_width = this.getRootElement()['clientWidth'];
    }

    return this.m_width;
};

/**
 * Get the cached height of the root element. If not cached, sets the cached height.
 * @return {number} the cached height of the root element
 * @protected
 */
DvtDataGrid.prototype.getHeight = function()
{
    if (this.m_height == null)
    {
        //clientHeight since we use border box and care about the content of our root div
        this.m_height = this.getRootElement()['clientHeight'];
    }

    return this.m_height;
};

/**
 * Gets the scrollable width of the grid.
 * @return {number} the scrollable width of the grid
 * @protected
 */
DvtDataGrid.prototype.getScrollableWidth = function()
{
    var scrollerContent = this.m_databody['firstChild'];
    return this.getElementWidth(scrollerContent);
};

/**
 * Get the viewport width, which is defined as 1.5 the size of the width of Grid
 * @return {number} the viewport width
 */
DvtDataGrid.prototype.getViewportWidth = function()
{
    var width = this.getWidth();
    return Math.round(width * 1.5);
};

/**
 * Get the viewport height, which is defined as 1.5 the size of the height of Grid
 * @return {number} the viewport height
 */
DvtDataGrid.prototype.getViewportHeight = function()
{
    var height = this.getHeight();
    return Math.round(height * 1.5);
};

/**
 * Get viewport top
 * @return {number} the viewport top
 */
DvtDataGrid.prototype._getViewportTop = function()
{
    return this.m_currentScrollTop;
};

/**
 * Get viewport bottom
 * @return {number} the viewport bottom
 */
DvtDataGrid.prototype._getViewportBottom = function()
{
    var top = this._getViewportTop();
    var databodyHeight = this.getElementHeight(this.m_databody);
    var scrollbarSize = this.m_utils.getScrollbarSize();
    
    return this.m_hasHorizontalScroller ? top + databodyHeight - scrollbarSize : top + databodyHeight;    
};

/**
 * Get viewport left
 * @return {number} the viewport left
 */
DvtDataGrid.prototype._getViewportLeft = function()
{
    return this.m_currentScrollLeft;
};

/**
 * Get viewport right
 * @return {number} the viewport right
 */
DvtDataGrid.prototype._getViewportRight = function()
{
    var left = this._getViewportLeft();
    var databodyWidth = this.getElementWidth(this.m_databody);
    var scrollbarSize = this.m_utils.getScrollbarSize();
    
    return this.m_hasVerticalScroller ? left + databodyWidth - scrollbarSize : left + databodyWidth;    
};

/**
 * Calculate the fetch size for rows or columns
 * @param {string} axis - the axis 'row'/'column' to get fetch size on
 * @return {number} the fetch size
 */
DvtDataGrid.prototype.getFetchSize = function(axis)
{
    // get the cached fetch size, this should be clear when the size changes
    if (axis == "row")
    {
        if (this.m_rowFetchSize == null)
        {
            this.m_rowFetchSize = Math.max(1, Math.round(this.getViewportHeight() / this.getDefaultRowHeight()));
        }

        return this.m_rowFetchSize;
    }
    if (axis == "column")
    {
        if (this.m_columnFetchSize == null)
        {
            this.m_columnFetchSize = Math.max(1, Math.round(this.getViewportWidth() / this.getDefaultColumnWidth()));
        }
        return this.m_columnFetchSize;
    }

    return 0;
};

/**
 * If the empty text option is 'default' return default empty translated text,
 * otherwise return the emptyText set in the options
 * @return {string} the empty text
 */
DvtDataGrid.prototype.getEmptyText = function()
{
    var emptyText, resources;
    emptyText = this.m_options.getEmptyText();
    if (emptyText == null)
    {
        resources = this.getResources();
        emptyText = resources.getTranslatedText("msgNoData");
    }
    return emptyText;
};

/**
 * Build an empty text div and populate it with empty text
 * @return {Element} the empty text element
 * @private
 */
DvtDataGrid.prototype._buildEmptyText = function()
{
    var emptyText, empty, height, dir, left;
    emptyText = this.getEmptyText();
    empty = document.createElement("div");
    empty['id'] = this.createSubId("empty");
    empty['className'] = this.getMappedStyle("emptytext");
    height = this.m_endColHeader >= 0 ? this.getColumnHeaderHeight() : 0;
    this.setElementDir(empty, height, 'top');
    dir = this.getResources().isRTLMode() ? "right" : "left";    
    left = this.m_endRowHeader >= 0 ? this.getRowHeaderWidth() : 0;
    this.setElementDir(empty, left, dir);    
    empty.textContent = emptyText;
    this.m_empty = empty;
    return  empty;
};

/**
 * Determine the size of the buffer that triggers fetching of rows. For example,
 * if the size of the buffer is zero, then the fetch will be triggered when the
 * scroll position reached the end of where the current range ends
 * @return {number} the row threshold
 */
DvtDataGrid.prototype.getRowThreshold = function()
{
    return 0;
};

/**
 * Determine the size of the buffer that triggers fetching of columns. For example,
 * if the size of the buffer is zero, then the fetch will be triggered when the
 * scroll position reached the end of where the current range ends.
 * @return {number} the column threshold
 */
DvtDataGrid.prototype.getColumnThreshold = function()
{
    return 0;
};


/*
 * Caches the default datagrid dimensions located in the style sheet, creates
 * just one div to reduce createElement calls. This function should get called once on create.
 * Values found in style are:
 *  column width
 *  row height
 */
DvtDataGrid.prototype.setDefaultDimensions = function()
{
    var div, resources;
    div = document.createElement('div');
    div['style']['visibilty'] = 'hidden';

    resources = this.getResources();
    // we can avoid a repaint by using both row and headercell here because this isn't where the col height and row width are set
    div['className'] = resources.getMappedStyle("row") + " " + resources.getMappedStyle("colheadercell") + " " + resources.getMappedStyle("headercell");
    document.body.appendChild(div); //@HTMLUpdateOK
    // Not using offsetWidth/Height due to 
    this.m_defaultColumnWidth = Math.round(div.getBoundingClientRect()['width']);
    this.m_defaultRowHeight = Math.round(div.getBoundingClientRect()['height']);

    document.body.removeChild(div);
};

/**
 * Get the default row height which comes from the style sheet
 * @return {number} the default row height
 */
DvtDataGrid.prototype.getDefaultRowHeight = function()
{
    if (this.m_defaultRowHeight == null)
    {
        this.setDefaultDimensions();
    }
    return this.m_defaultRowHeight;
};

/**
 * Get the default column width which comes from the stylesheet
 * @return {number} the default column width
 */
DvtDataGrid.prototype.getDefaultColumnWidth = function()
{
    if (this.m_defaultColumnWidth == null)
    {
        this.setDefaultDimensions();
    }
    return this.m_defaultColumnWidth;
};

/**
 * Get the default dimension on an axis
 * @param {string} axis
 * @returns {number|undefined}
 */
DvtDataGrid.prototype._getDefaultDimension = function(axis)
{
    if (axis == 'row')
    {
         return this.getDefaultRowHeight();
    }
    else if (axis == 'column')
    {
        return this.getDefaultColumnWidth();
    }
    return;
};

/**
 * Gets the header dimension for an axis, for rows this would be height, for columns, width
 * @param {Element} elem the header element to get dimension of
 * @param {string} key the row or column key
 * @param {string} axis row or column
 * @param {string} dimension width ro height
 * @returns {number}
 */
DvtDataGrid.prototype._getHeaderDimension = function(elem, key, axis, dimension)
{
    var value, className;

    value = this.m_sizingManager.getSize(axis, key);
    if (value != null)
    {
        return value;
    }

    // check if inline style set on element
    if (elem['style'][dimension] != '')
    {
        value = this.getElementDir(elem, dimension);
        //in the event that row height is set via an additional style only on row header store the value
        this.m_sizingManager.setSize(axis, key, value);
        return value;
    }

    // check style class mapping, mapping prevents multiple offsetHeight calls on headers with the same class name
    className = elem['className'];
    value = this.m_styleClassDimensionMap[className];
    if (value == null)
    {
        // exhausted all options, use offsetHeight then, remove element in the case of shim element
        value = this.getElementDir(elem, dimension);
    }

    //the value isn't the default the cell will use meaning it's from an external
    //class, so store it in the sizing manager cell can pick it up
    if (value != this._getDefaultDimension(axis))
    {
        this.m_sizingManager.setSize(axis, key, value);
    }

    this.m_styleClassDimensionMap[className] = value;
    return value;
};

/**
 * Helper method to create subid based on the root element's id
 * @param {string} subId - the id to append to the root element id
 * @return {string} the subId to append to the root element id
 */
DvtDataGrid.prototype.createSubId = function(subId)
{
    var id = this.getRootElement()['id'];
    if (id == null)
    {
        id = "";
    }

    return [id, subId].join(":");
};

/**
 * Checks whether header fetching is completed
 * @return {boolean} true if header fetching completed, else false
 */
DvtDataGrid.prototype.isHeaderFetchComplete = function()
{
    return (this.m_fetching['row'] === false && this.m_fetching['column'] === false);
};

/**
 * Checks whether header AND cell fetching is completed
 * @return {boolean} true if header AND cell fetching completed, else false
 */
DvtDataGrid.prototype.isFetchComplete = function()
{
    return (this.isHeaderFetchComplete() && this.m_fetching['cells'] === false);
};

/**
 * Checks whether the index is the last row
 * @param {number} index
 * @return {boolean} true if it's the last row, false otherwise
 */
DvtDataGrid.prototype._isLastRow = function(index)
{
    if (this._isCountUnknown("row"))
    {
        // if row count is unknown, then the last row is if the index is before the last row fetched
        // and there's no more rows from datasource
        return (index === this.m_endRow && this.m_stopRowFetch);
    }
    else
    {
        // if column count is known, then just check the index with the total column count
        return (index + 1 === this.getDataSource().getCount("row"));
    }
};

/**
 * Checks whether the index is the last column
 * @param {number} index
 * @return {boolean} true if it's the last column, false otherwise
 */
DvtDataGrid.prototype._isLastColumn = function(index)
{
    if (this._isCountUnknown("column"))
    {
        // if column count is unknown, then the last column is if the index is the last column fetched
        // and there's no more columns from datasource
        return (index === this.m_endCol && this.m_stopColumnFetch);
    }
    else
    {
        // if column count is known, then just check the index with the total column count
        return (index + 1 === this.getDataSource().getCount("column"));
    }
};

/**
 * Removes all of the datagrid children built by DvtDataGrid, this excludes context menus/popups
 */
DvtDataGrid.prototype.empty = function()
{
    //remove everything that will be rebuilt
    if (this.m_empty)
    {
        this.m_root.removeChild(this.m_empty);
    }
    if (this.m_corner)
    {
        this.m_root.removeChild(this.m_corner);
    }
    if (this.m_bottomCorner)
    {
        this.m_root.removeChild(this.m_bottomCorner);
    }
    if (this.m_columnHeaderScrollbarSpacer)
    {
        this.m_root.removeChild(this.m_columnHeaderScrollbarSpacer);
    }
    if (this.m_rowHeaderScrollbarSpacer)
    {
        this.m_root.removeChild(this.m_rowHeaderScrollbarSpacer);
    }

    this.m_root.removeChild(this.m_placeHolder);
    this.m_root.removeChild(this.m_status);
    this.m_root.removeChild(this.m_accSummary);
    this.m_root.removeChild(this.m_accInfo);
    this.m_root.removeChild(this.m_stateInfo);
    this.m_root.removeChild(this.m_contextInfo);
    // elements that may contain other components
    this._remove(this.m_colHeader);
    this._remove(this.m_rowHeader);
    this._remove(this.m_colEndHeader);
    this._remove(this.m_rowEndHeader);
    this._remove(this.m_databody);
};

/**
 * Re-renders the data grid. Resets all the necessary properties.
 * @param {Element} root - the root dom element for the DataGrid.
 * @export
 */
DvtDataGrid.prototype.refresh = function(root)
{
    this._removeDomEventListeners();
    this.resetInternal();
    this.render(root);
};

/**
 * Resets internal state of data grid.
 * @private
 */
DvtDataGrid.prototype.resetInternal = function()
{
    this.m_initialized = false;
    this.m_readinessStack = [];
    this._signalTaskStart();
    this._signalTaskEnd();

    //cursor
    this.m_cursor = null;

    //dom elements
    this.m_corner = null;
    this.m_bottomCorner = null;
    this.m_columnHeaderScrollbarSpacer = null;
    this.m_rowHeaderScrollbarSpacer = null;
    this.m_colHeader = null;
    this.m_colEndHeader = null;
    this.m_rowHeader = null;
    this.m_rowEndHeader = null;
    this.m_databody = null;
    this.m_empty = null;
    this.m_accInfo = null;
    this.m_accSummary = null;
    this.m_contextInfo = null;
    this.m_placeHolder = null;
    this.m_stateInfo = null;
    this.m_status = null;

    //fetching
    this.m_isEstimateRowCount = undefined;
    this.m_isEstimateColumnCount = undefined;
    this.m_stopRowFetch = false;
    this.m_stopRowHeaderFetch = false;
    this.m_stopRowEndHeaderFetch = false;
    this.m_stopColumnFetch = false;
    this.m_stopColumnHeaderFetch = false;
    this.m_stopColumnEndHeaderFetch = false;
    this.m_rowFetchSize = null;
    this.m_columnFetchSize = null;
    this.m_fetching = null;
    this.m_processingModelEvent = false;
    this.m_processingEventQueue = false;
    this.m_animating = false;

    //dimensions
    this.m_sizingManager.clear();
    this.m_styleClassDimensionMap = {};
    this.m_height = null;
    this.m_width = null;
    this.m_scrollHeight = null;
    this.m_scrollWidth = null;
    this.m_avgRowHeight = undefined;
    this.m_avgColWidth = undefined;
    this.m_defaultColumnWidth = null;
    this.m_defaultRowHeight = null;
    this.m_colHeaderHeight = null;
    this.m_colEndHeaderHeight = null;
    this.m_rowHeaderWidth = null;
    this.m_rowEndHeaderWidth = null;
    this.m_rowHeaderLevelWidths = [];
    this.m_rowEndHeaderLevelWidths = [];
    this.m_columnHeaderLevelHeights = [];
    this.m_columnEndHeaderLevelHeights = [];

    //active
    this.m_active = null;
    this.m_prevActive = null;

    //dnd
    this.m_databodyDragState = false;
    this.m_databodyMove = false;
    this.m_moveRow = null;
    this.m_moveRowHeader = null;
    this.m_dropTarget = null;
    this.m_dropTargetHeader = null;

    //selection
    this.m_discontiguousSelection = false;

    //event listeners
    this.m_docMouseMoveListener = null;
    this.m_docMouseUpListener = null;
    this.m_handleDatabodyKeyDown = null;
    this.m_handleRootFocus = null;
    this.m_handleRootBlur = null;
    this.m_modelEvents = [];

    //scrolling
    this.m_hasHorizontalScroller = null;
    this.m_hasVerticalScroller = null;
    this.m_currentScrollLeft = null;
    this.m_currentScrollTop = null;
    this.m_prevScrollLeft = null;
    this.m_prevScrollTop = null;
    
    //resizing
    this.m_resizing = false;
    this.m_resizingElement = null;
    this.m_resizingElementMin = null;

    //data states
    this.m_startRow = null;
    this.m_startCol = null;
    this.m_endRow = null;
    this.m_endCol = null;
    this.m_startRowPixel = null;
    this.m_startColPixel = null;
    this.m_endRowPixel = null;
    this.m_endColPixel = null;
    this.m_startRowHeader = null;
    this.m_startColHeader = null;
    this.m_endRowHeader = null;
    this.m_endColHeader = null;
    this.m_startRowHeaderPixel = null;
    this.m_startColHeaderPixel = null;
    this.m_endRowHeaderPixel = null;
    this.m_endColHeaderPixel = null;
    this.m_rowHeaderLevelCount = null;
    this.m_columnHeaderLevelCount = null;
    this.m_startRowEndHeader = null;
    this.m_startColEndHeader = null;
    this.m_endRowEndHeader = null;
    this.m_endColEndHeader = null;
    this.m_startRowEndHeaderPixel = null;
    this.m_startColEndHeaderPixel = null;
    this.m_endRowEndHeaderPixel = null;
    this.m_endColEndHeaderPixel = null;
    this.m_rowEndHeaderLevelCount = null;
    this.m_columnEndHeaderLevelCount = null;
    this.m_sortInfo = null;
    this.m_resizeRequired = null;
    this.m_externalFocus = null;
    this.m_currentMode = null;
    this.m_editMode = null;

    this.m_hasCells = null;
    this.m_hasRowHeader = null;
    this.m_hasRowEndHeader = null;
    this.m_hasColHeader = null;
    this.m_hasColEndHeader = null;    
    this.m_isLongScroll = null;
    
    this.m_addBorderBottom = null;
    this.m_addBorderRight = null;
};

/**
 * DataGrid should initialize if there's no outstanding fetch, it is unitialized
 * and the databody is attached to the root.
 * @private
 * @returns {boolean} true if we have the properties that signify an end to initialize
 */
DvtDataGrid.prototype._shouldInitialize = function()
{
    return (this.isFetchComplete() && !this.m_initialized && this.m_databody.parentNode != null);
};

/**
 * Handle the end of datagrid initialization whether at the end of rendering or fetching
 * @private
 * @param {boolean=} hasData false if there is no data and thus should skip resizing
 */
DvtDataGrid.prototype._handleInitialization = function(hasData)
{
    if (hasData == true)
    {
        this.resizeGrid();
        this.setInitialScrollPosition();
        this.fillViewport();

        if (this.isFetchComplete())
        {
            this._updateActive(this.m_options.getCurrentCell(), false);
            this.m_initialized = true;
            this.fireEvent('ready', {});
            this._runModelEventQueue();
        }
    }
    else
    {
        this.m_initialized = true;
        this.fireEvent('ready', {});
        this._runModelEventQueue();
    }
};

/**
 * Run the events in the model event list
 * @private
 */
DvtDataGrid.prototype._runModelEventQueue = function()
{
    var i, event;

    if (this.m_processingEventQueue)
    {
        return;
    }

    this.m_processingEventQueue = true;

    // check the model event queue to see if there are outstanding events
    if (this.m_modelEvents != null)
    {
        for (i = 0; i < this.m_modelEvents.length; i++)
        {
            event = this.m_modelEvents[i];
            if (event['operation'] == 'expand')
            {
                this.handleExpandEvent(event, true);
            }
            else if (event['operation'] == 'collapse')
            {
                this.handleCollapseEvent(event, true);
            }
            else
            {
                this.handleModelEvent(event, true);
            }
        }
        // empty the queue
        this.m_modelEvents.length = 0;
    }

    this.m_processingEventQueue = false;
};

/**
 * Renders the DataGrid, initializes DataGrid properties.
 * @param {Element} root - the root dom element for the DataGrid.
 * @export
 */
DvtDataGrid.prototype.render = function(root)
{
    // if this is the same instance and state wasn't clear out from last time
    if (this.m_databody != null)
    {
        this.destroy();
        this.resetInternal();
    }

    this.m_timingStart = new Date();
    this.m_fetching = {
    };

    // since headers and cells are independently fetched, they could be returned
    // at a different time, therefore we'll need var to keep track the current range
    // for each one of them
    this.m_startRow = 0;
    this.m_startCol = 0;
    this.m_endRow = -1;
    this.m_endCol = -1;
    this.m_startRowPixel = 0;
    this.m_startColPixel = 0;
    this.m_endRowPixel = 0;
    this.m_endColPixel = 0;

    this.m_startRowHeader = 0;
    this.m_startColHeader = 0;
    this.m_endRowHeader = -1;
    this.m_endColHeader = -1;
    this.m_startRowHeaderPixel = 0;
    this.m_startColHeaderPixel = 0;
    this.m_endRowHeaderPixel = 0;
    this.m_endColHeaderPixel = 0;

    this.m_startRowEndHeader = 0;
    this.m_startColEndHeader = 0;
    this.m_endRowEndHeader = -1;
    this.m_endColEndHeader = -1;
    this.m_startRowEndHeaderPixel = 0;
    this.m_startColEndHeaderPixel = 0;
    this.m_endRowEndHeaderPixel = 0;
    this.m_endColEndHeaderPixel = 0;

    this.m_currentScrollLeft = 0;
    this.m_currentScrollTop = 0;
    this.m_prevScrollLeft = 0;
    this.m_prevScrollTop = 0;       
    
    this.m_rowHeaderLevelWidths = [];
    this.m_rowEndHeaderLevelWidths = [];
    this.m_columnHeaderLevelHeights = [];
    this.m_columnEndHeaderLevelHeights = [];

    this.buildGrid(root);
};

/**
 * Builds the DataGrid, adds root children (headers, databody, corners),
 * initializes event listeners, and sets inital scroll position.
 * @param {Element} root - the root dom element for the DataGrid.
 */
DvtDataGrid.prototype.buildGrid = function(root)
{
    var status, accSummary, accInfo, stateInfo, rtl, colHeader, rowHeader,
            databody, empty, contextInfo, placeHolder, colEndHeader, rowEndHeader, returnObj, mousewheelEvent;
    this.m_root = root;
    //class name set on component create
    this.m_root.setAttribute("role", "application");
    if (this._isCellEditable())
    {
        this.m_utils.addCSSClassName(this.m_root, this.getMappedStyle('editable'));
    }
    else
    {
        this.m_utils.addCSSClassName(this.m_root, this.getMappedStyle('readOnly'));
    }    
    //this.m_root.setAttribute("aria-describedby", this.createSubId("summary"));

    // set a tab index so it can be focus and keyboard navigation to work
    root.tabIndex = 0;

    status = this.buildStatus();
    root.appendChild(status); //@HTMLUpdateOK
    this.m_status = status;

    accSummary = this.buildAccSummary();
    root.appendChild(accSummary); //@HTMLUpdateOK
    this.m_accSummary = accSummary;

    accInfo = this.buildAccInfo();
    root.appendChild(accInfo); //@HTMLUpdateOK
    this.m_accInfo = accInfo;

    stateInfo = this.buildStateInfo();
    root.appendChild(stateInfo); //@HTMLUpdateOK
    this.m_stateInfo = stateInfo;

    contextInfo = this.buildContextInfo();
    root.appendChild(contextInfo); //@HTMLUpdateOK
    this.m_contextInfo = contextInfo;

    placeHolder = this.buildPlaceHolder();
    root.appendChild(placeHolder); //@HTMLUpdateOK
    this.m_placeHolder = placeHolder;

    if (this.getDataSource() != null)
    {
        //in the event that the empty text was set when there was no datasource
        this.m_empty = null;

        rtl = this.getResources().isRTLMode();
        
        returnObj = this.buildHeaders("column", this.getMappedStyle("colheader"), this.getMappedStyle("colendheader"));
        colHeader = returnObj.root;
        colEndHeader = returnObj.endRoot;
        root.insertBefore(colHeader, status); //@HTMLUpdateOK
        root.insertBefore(colEndHeader, status); //@HTMLUpdateOK
        
        returnObj = this.buildHeaders("row", this.getMappedStyle("rowheader"), this.getMappedStyle("rowendheader"));
        rowHeader = returnObj.root;
        rowEndHeader = returnObj.endRoot;
        root.insertBefore(rowHeader, status); //@HTMLUpdateOK
        root.insertBefore(rowEndHeader, status); //@HTMLUpdateOK
        
        databody = this.buildDatabody();
        root.insertBefore(databody, status); //@HTMLUpdateOK  

        if (rtl)
        {
            colHeader['style']['direction'] = "rtl";
            databody['style']['direction'] = "rtl";
        }

        this.m_isResizing = false;
        this.m_resizingElement = null;
        this.m_resizingElementMin = null;
        this.m_databodyDragState = false;

        // store the listeners so we can remove them later (bind creates a new function)
        this.m_handleDatabodyKeyDown = this.handleDatabodyKeyDown.bind(this);
        this.m_handleRootFocus = this.handleRootFocus.bind(this);
        this.m_handleRootBlur = this.handleRootBlur.bind(this);
        this.m_docMouseMoveListener = this.handleMouseMove.bind(this);
        this.m_docMouseUpListener = this.handleMouseUp.bind(this);

        //touch event handling
        if (this.m_utils.isTouchDevice())
        {
            //databody touch listeners
            databody.addEventListener("touchstart", this.handleTouchStart.bind(this), false);
            databody.addEventListener("touchmove", this.handleTouchMove.bind(this), false);
            databody.addEventListener("touchend", this.handleTouchEnd.bind(this), false);
            databody.addEventListener("touchcancel", this.handleTouchCancel.bind(this), false);

            //column header listeners
            colHeader.addEventListener("touchstart", this.handleHeaderTouchStart.bind(this), false);
            colHeader.addEventListener("touchmove", this.handleHeaderTouchMove.bind(this), false);
            colHeader.addEventListener("touchend", this.handleHeaderTouchEnd.bind(this), false);
            colHeader.addEventListener("touchcancel", this.handleHeaderTouchCancel.bind(this), false);

            //row header listeners
            rowHeader.addEventListener("touchstart", this.handleHeaderTouchStart.bind(this), false);
            rowHeader.addEventListener("touchmove", this.handleHeaderTouchMove.bind(this), false);
            rowHeader.addEventListener("touchend", this.handleHeaderTouchEnd.bind(this), false);
            rowHeader.addEventListener("touchcancel", this.handleHeaderTouchCancel.bind(this), false);

            //column end header listeners
            colEndHeader.addEventListener("touchstart", this.handleHeaderTouchStart.bind(this), false);
            colEndHeader.addEventListener("touchmove", this.handleHeaderTouchMove.bind(this), false);
            colEndHeader.addEventListener("touchend", this.handleHeaderTouchEnd.bind(this), false);
            colEndHeader.addEventListener("touchcancel", this.handleHeaderTouchCancel.bind(this), false);

            //row end header listeners
            rowEndHeader.addEventListener("touchstart", this.handleHeaderTouchStart.bind(this), false);
            rowEndHeader.addEventListener("touchmove", this.handleHeaderTouchMove.bind(this), false);
            rowEndHeader.addEventListener("touchend", this.handleHeaderTouchEnd.bind(this), false);
            rowEndHeader.addEventListener("touchcancel", this.handleHeaderTouchCancel.bind(this), false);

            //root listeners
            root.addEventListener('focus', this.m_handleRootFocus, true);
            root.addEventListener('blur', this.m_handleRootBlur, true);
            
            root.addEventListener("keydown", this.m_handleDatabodyKeyDown, false);            
        }
        else
        {
            //non-touch event listening
            
            //root level listeners
            root.addEventListener("keydown", this.m_handleDatabodyKeyDown, false);
            root.addEventListener('focus', this.m_handleRootFocus, true);
            root.addEventListener('blur', this.m_handleRootBlur, true);

            mousewheelEvent = this.m_utils.getMousewheelEvent();
            //databody listeners
            databody.addEventListener(mousewheelEvent, this.handleDatabodyMouseWheel.bind(this), false);
            databody.addEventListener("mousedown", this.handleDatabodyMouseDown.bind(this), false);
            databody.addEventListener("mousemove", this.handleDatabodyMouseMove.bind(this), false);
            databody.addEventListener("mouseup", this.handleDatabodyMouseUp.bind(this), false);
            databody.addEventListener("mouseout", this.handleDatabodyMouseOut.bind(this), false);
            databody.addEventListener("mouseover", this.handleDatabodyMouseOver.bind(this), false);
            databody.addEventListener("dblclick", this.handleDatabodyDoubleClick.bind(this), false);
            
            //header listeners
            rowHeader.addEventListener(mousewheelEvent, this.handleDatabodyMouseWheel.bind(this), false);
            rowHeader.addEventListener("mousedown", this.handleHeaderMouseDown.bind(this), false);
            colHeader.addEventListener("mousedown", this.handleHeaderMouseDown.bind(this), false);
            rowHeader.addEventListener("mouseover", this.handleHeaderMouseOver.bind(this), false);
            colHeader.addEventListener("mouseover", this.handleHeaderMouseOver.bind(this), false);
            rowHeader.addEventListener("mousemove", this.handleRowHeaderMouseMove.bind(this), false);
            colHeader.addEventListener("mousemove", this.handleColumnHeaderMouseMove.bind(this), false);            
            rowHeader.addEventListener("mouseup", this.handleHeaderMouseUp.bind(this), false);
            rowHeader.addEventListener("mouseout", this.handleHeaderMouseOut.bind(this), false);
            colHeader.addEventListener("mouseout", this.handleHeaderMouseOut.bind(this), false);
            rowHeader.addEventListener("click", this.handleHeaderClick.bind(this), false);
            colHeader.addEventListener("click", this.handleHeaderClick.bind(this), false);

            //end header listeners
            rowEndHeader.addEventListener(mousewheelEvent, this.handleDatabodyMouseWheel.bind(this), false);
            rowEndHeader.addEventListener("mousedown", this.handleHeaderMouseDown.bind(this), false);
            colEndHeader.addEventListener("mousedown", this.handleHeaderMouseDown.bind(this), false);
            rowEndHeader.addEventListener("mouseover", this.handleHeaderMouseOver.bind(this), false);
            colEndHeader.addEventListener("mouseover", this.handleHeaderMouseOver.bind(this), false);
            rowEndHeader.addEventListener("mousemove", this.handleRowHeaderMouseMove.bind(this), false);
            colEndHeader.addEventListener("mousemove", this.handleColumnHeaderMouseMove.bind(this), false);            
            rowEndHeader.addEventListener("mouseup", this.handleHeaderMouseUp.bind(this), false);
            rowEndHeader.addEventListener("mouseout", this.handleHeaderMouseOut.bind(this), false);
            colEndHeader.addEventListener("mouseout", this.handleHeaderMouseOut.bind(this), false);
            rowEndHeader.addEventListener("click", this.handleHeaderClick.bind(this), false);
            colEndHeader.addEventListener("click", this.handleHeaderClick.bind(this), false);
        }

        // check if data is fetched and size the grid
        if (this._shouldInitialize())
        {
            this._handleInitialization(true);
        }
    }
    else
    {
        //if no datasource render empty text
        empty = this._buildEmptyText();
        this.m_root.appendChild(empty); //@HTMLUpdateOK
        this._handleInitialization(false);
    }
};

/**
 * Handle resize of grid to a new width and height.
 * @param {number} width the new width
 * @param {number} height the new height
 * @export
 */
DvtDataGrid.prototype.HandleResize = function(width, height)
{
    //can either get the client width or subtract the border width.
    width = this.getRootElement()['clientWidth'];
    height = this.getRootElement()['clientHeight'];
    // don't do anything if nothing has changed
    if (width != this.m_width || height != this.m_height)
    {
        // assign new width and height
        this.m_width = width;
        this.m_height = height;

        this.m_rowFetchSize = null;
        this.m_columnFetchSize = null;

        // if it's not initialize (or fetching), then just skip now
        // handleCellsFetchSuccess will attempt to fill the viewport
        if (this.m_initialized)
        {
            // call resize logic
            this.resizeGrid();
            if (this.isFetchComplete())
            {
                this.m_resizeRequired = true;                
                // check viewport
                this.fillViewport();
            }
        }
    }
};

/**
 * Size the headers, scroller, databody based on current width and height.
 * @private
 */
DvtDataGrid.prototype.resizeGrid = function()
{
    var width, height, colHeader, rowHeader, databody, columnHeaderWidth,
            colHeaderHeight, rowHeaderWidth, rowHeaderHeight, databodyContentWidth, databodyWidth, databodyContentHeight, databodyHeight,
            isTouchDevice, isDatabodyHorizontalScrollbarRequired, isDatabodyVerticalScrollbarRequired, scrollbarSize,
            dir, empty, endTime, colEndHeader, rowEndHeader, colEndHeaderHeight, rowEndHeaderWidth, emptyHeight, emptyWidth,
            availableHeight, availableWidth, rowEndHeaderDir, columnEndHeaderDir, isEmpty, databodyScroller;


    width = this.getWidth();
    height = this.getHeight();
    colHeader = this.m_colHeader;
    colEndHeader = this.m_colEndHeader;
    rowHeader = this.m_rowHeader;
    rowEndHeader = this.m_rowEndHeader;
    databody = this.m_databody;
    databodyScroller = databody['firstChild'];
    
    // cache these since they will be used in multiple places and we want to minimize reflow
    colHeaderHeight = this.getColumnHeaderHeight();
    colEndHeaderHeight = this.getColumnEndHeaderHeight();
    rowHeaderWidth = this.getRowHeaderWidth();
    rowEndHeaderWidth = this.getRowEndHeaderWidth();
    
    //adjusted to make the databody wrap the databody content, and the scroller to fill the remaing part of the grid
    //this way our scrollbars are always at the edges of our viewport
    availableHeight = height - colHeaderHeight - colEndHeaderHeight;
    availableWidth = width - rowHeaderWidth - rowEndHeaderWidth;
    
    isTouchDevice = this.m_utils.isTouchDevice();
    scrollbarSize = this.m_utils.getScrollbarSize();
    
    isEmpty = this._databodyEmpty();   
    
    // check if there's no data
    if (isEmpty)
    {
        //could be getting here in the handle resize of an empty grid
        if (this.m_empty == null)
        {
            empty = this._buildEmptyText();
            this.m_root.appendChild(empty); //@HTMLUpdateOK
        }
        else
        {
            empty = this.m_empty;
        }
        emptyHeight = this.getElementHeight(empty);
        emptyWidth = this.getElementWidth(empty);
        
        if (emptyHeight > this.getElementHeight(databodyScroller))
        {
            this.setElementHeight(databodyScroller, emptyHeight);
        }
        if (emptyWidth > this.getElementWidth(databodyScroller))
        {
            this.setElementWidth(databodyScroller, emptyWidth);
        }     
    }
    
    databodyContentWidth = this.getElementWidth(databody['firstChild']);
    databodyContentHeight = this.getElementHeight(databody['firstChild']);
    //determine which scrollbars are required, if needing one forces need of the other, allows rendering within the root div
    isDatabodyHorizontalScrollbarRequired = this.isDatabodyHorizontalScrollbarRequired(availableWidth);
    if (isDatabodyHorizontalScrollbarRequired)
    {
        isDatabodyVerticalScrollbarRequired = this.isDatabodyVerticalScrollbarRequired(availableHeight - scrollbarSize);
        databody['style']['overflow'] = "auto";
    }
    else
    {
        isDatabodyVerticalScrollbarRequired = this.isDatabodyVerticalScrollbarRequired(availableHeight);
        if (isDatabodyVerticalScrollbarRequired)
        {
            isDatabodyHorizontalScrollbarRequired = this.isDatabodyHorizontalScrollbarRequired(availableWidth - scrollbarSize);
            databody['style']['overflow'] = "auto";
        }
        else
        {
            // for an issue where same size child causes scrollbars (similar code used in resizing already)
            databody['style']['overflow'] = "hidden";
        }        
    }  
    
    this.m_hasHorizontalScroller = isDatabodyHorizontalScrollbarRequired;
    this.m_hasVerticalScroller = isDatabodyVerticalScrollbarRequired;          
    
    if (this.m_endColEndHeader != -1)
    {
        databodyHeight = Math.min(databodyContentHeight + (isDatabodyHorizontalScrollbarRequired ? scrollbarSize : 0), availableHeight);
        rowHeaderHeight = isDatabodyHorizontalScrollbarRequired ? databodyHeight - scrollbarSize : databodyHeight;
    }
    else
    {
        databodyHeight = availableHeight;
        rowHeaderHeight = Math.min(databodyContentHeight, isDatabodyHorizontalScrollbarRequired ? databodyHeight - scrollbarSize : databodyHeight);
    }

    if (this.m_endRowEndHeader != -1)
    {
        databodyWidth = Math.min(databodyContentWidth + (isDatabodyVerticalScrollbarRequired ? scrollbarSize : 0), availableWidth);
        columnHeaderWidth = isDatabodyVerticalScrollbarRequired ? databodyWidth - scrollbarSize : databodyWidth;
    }
    else
    {
        databodyWidth = availableWidth;
        columnHeaderWidth = Math.min(databodyContentWidth, isDatabodyVerticalScrollbarRequired ? databodyWidth - scrollbarSize : databodyWidth);
    }

    rowEndHeaderDir = rowHeaderWidth + columnHeaderWidth + (isDatabodyVerticalScrollbarRequired ? scrollbarSize : 0);
    columnEndHeaderDir = colHeaderHeight + rowHeaderHeight + (isDatabodyHorizontalScrollbarRequired ? scrollbarSize : 0); 

    dir = this.getResources().isRTLMode() ? "right" : "left";

    this.setElementDir(rowHeader, 0, dir);
    this.setElementDir(rowHeader, colHeaderHeight, 'top');
    this.setElementHeight(rowHeader, rowHeaderHeight);

    this.setElementDir(rowEndHeader, rowEndHeaderDir, dir);
    this.setElementDir(rowEndHeader, colHeaderHeight, 'top');
    this.setElementHeight(rowEndHeader, rowHeaderHeight);

    this.setElementDir(colHeader, rowHeaderWidth, dir);
    this.setElementWidth(colHeader, columnHeaderWidth);

    this.setElementDir(colEndHeader, rowHeaderWidth, dir);
    this.setElementDir(colEndHeader, columnEndHeaderDir, 'top');
    this.setElementWidth(colEndHeader, columnHeaderWidth);

    this.setElementDir(databody, colHeaderHeight, 'top');
    this.setElementDir(databody, rowHeaderWidth, dir);
    this.setElementWidth(databody, databodyWidth);
    this.setElementHeight(databody, databodyHeight);

    // cache the scroll width and height to minimize reflow
    this.m_scrollWidth = databodyContentWidth - columnHeaderWidth;
    this.m_scrollHeight = databodyContentHeight - rowHeaderHeight;

    this.buildCorners();

    // check if we need to remove border on the last column header/add borders to headers
    this._adjustHeaderBorders();

    // now we do not need to resize
    this.m_resizeRequired = false;

    endTime = new Date();
};

/**
 * Size the databody scroller based on whatever dimensions are available.
 * @private
 */
DvtDataGrid.prototype._sizeDatabodyScroller = function()
{
    var databody, scroller, isEmpty, isHWS, maxHeight, maxWidth, rowCount, colCount, totalHeight, totalWidth,
            endRowPixel, endColPixel;
    databody = this.m_databody;
    scroller = databody.firstChild;
    isEmpty = this._databodyEmpty();   
    isHWS = this._isHighWatermarkScrolling();
    maxHeight = this.m_utils._getMaxDivHeightForScrolling();
    maxWidth = this.m_utils._getMaxDivWidthForScrolling();
    rowCount = this.getDataSource().getCount('row');
    colCount = this.getDataSource().getCount('column');
    totalHeight = 0;
    totalWidth = 0;
    endRowPixel = 0;
    endColPixel = 0;
    
    if (isEmpty)
    {
        // min is 1 so that the scrollbars show up
        endRowPixel = Math.max(Math.max(this.m_endRowHeaderPixel, this.m_endRowEndHeaderPixel), 1);
        endColPixel = Math.max(Math.max(this.m_endColHeaderPixel, this.m_endColEndHeaderPixel), 1);     
    }
    else
    {
        endRowPixel = this.m_endRowPixel;
        endColPixel = this.m_endColPixel;
    }

    totalHeight = (rowCount != -1 && !isHWS) ? rowCount * this.m_avgRowHeight : endRowPixel;
    totalWidth = (colCount != -1 && !isHWS) ? colCount * this.m_avgColWidth : endColPixel;

    this.setElementHeight(scroller, Math.min(maxHeight, totalHeight));
    this.setElementWidth(scroller, Math.min(maxWidth, totalWidth));
    
    if (this.m_initialized)
    {
        this.m_scrollWidth = this.getElementWidth(scroller) - this.getElementWidth(databody) + (this.m_hasVerticalScroller ?  this.m_utils.getScrollbarSize() : 0);
        this.m_scrollHeight = this.getElementHeight(scroller) - this.getElementHeight(databody) + (this.m_hasHorizontalScroller ?  this.m_utils.getScrollbarSize() : 0);
    }
};

/**
 * Adjust the last header on specific axis properties
 * @private
 * @param {number} headerIndex
 * @param {number} headerLevels
 * @param {Element} container
 * @param {number} startIndex
 * @param {string} className
 * @param {boolean} remove
 */
DvtDataGrid.prototype._adjustLastHeadersAlongAxis = function(headerIndex, headerLevels, container, startIndex, className, remove)
{
    var i, lastHeader;
    i = 0;
    while (i < headerLevels)
    {
        lastHeader = this._getHeaderByIndex(headerIndex, i, container, headerLevels, startIndex);
        remove ? this.m_utils.removeCSSClassName(lastHeader, className) : this.m_utils.addCSSClassName(lastHeader, className);
        i += this.getHeaderCellDepth(lastHeader);
    }
};

/**
 * Adjust the last header and the spacer along a given axis
 * 
 * @param {Element} container
 * @param {Function} lastFunction
 * @param {number} endHeaderIndex
 * @param {boolean} dimensionCheck
 * @param {Element} spacer
 * @param {string} className
 * @param {number} headerLevels
 * @param {number} startIndex
 */
DvtDataGrid.prototype._adjustHeaderBordersAlongAxis = function(container, lastFunction, endHeaderIndex, dimensionCheck, spacer, className, headerLevels, startIndex)
{
    if (container != null && endHeaderIndex >= 0)
    {
        dimensionCheck ? this.m_utils.addCSSClassName(spacer, className): this.m_utils.removeCSSClassName(spacer, className);
        if (lastFunction(endHeaderIndex))
        {
            this._adjustLastHeadersAlongAxis(endHeaderIndex, headerLevels, container, startIndex, className, dimensionCheck);
        }
    }
};

/**
 * Adjust the border style/width setting on the headers using classNames so that they can be overwritten
 * @private
 */
DvtDataGrid.prototype._adjustHeaderBorders = function()
{
    var colHeaderHeight, colHeaderWidth, widthCheck, heightCheck, scrollbarSize, style,
            colEndHeaderHeight, rowHeaderWidth, rowHeaderHeight, rowEndHeaderWidth, width, height, i, tags, bw, lastFunction;

    scrollbarSize = this.m_utils.getScrollbarSize();    
    width = this.getWidth();
    height = this.getHeight();
    colHeaderHeight = this.getColumnHeaderHeight();
    colHeaderWidth = this.getElementWidth(this.m_colHeader);
    colEndHeaderHeight = this.getElementHeight(this.m_colEndHeader);
    rowHeaderWidth = this.getRowHeaderWidth();
    rowHeaderHeight = this.getElementHeight(this.m_rowHeader);    
    rowEndHeaderWidth = this.getElementWidth(this.m_rowEndHeader);    
    
    widthCheck = rowHeaderWidth + colHeaderWidth + rowEndHeaderWidth + (this.m_hasVerticalScroller ? scrollbarSize : 0) < width;
    heightCheck = colHeaderHeight + rowHeaderHeight + colEndHeaderHeight + (this.m_hasHorizontalScroller ? scrollbarSize : 0) < height;
    
    if (widthCheck && this.m_endRowEndHeader >= 0 )
    {
        bw = true;
        this.m_addBorderRight = true;
    }
    else if (this.m_addBorderRight == true)
    {
        bw = false;
    }
    
    if (bw != null)
    {
        style = this.getMappedStyle('borderVerticalSmall');        
        if (this.m_columnHeaderScrollbarSpacer != null)
        {
            bw ? this.m_utils.addCSSClassName(this.m_columnHeaderScrollbarSpacer, style) : this.m_utils.removeCSSClassName(this.m_columnHeaderScrollbarSpacer, style);                
        }
        if (this.m_bottomCorner != null)
        {
            bw ? this.m_utils.addCSSClassName(this.m_bottomCorner, style) : this.m_utils.removeCSSClassName(this.m_bottomCorner, style);            
        }
        tags = this.m_rowEndHeader.firstChild.childNodes;
        for (i = 0; i < tags.length; i++) 
        {
            bw ? this.m_utils.addCSSClassName(tags[i], style) : this.m_utils.removeCSSClassName(tags[i], style);                        
        }    
    }
    else
    {
        style = this.getMappedStyle('borderVerticalNone');
        lastFunction = this._isLastColumn.bind(this);    
        this._adjustHeaderBordersAlongAxis(this.m_colHeader, lastFunction, this.m_endColHeader, widthCheck, this.m_columnHeaderScrollbarSpacer, style, 
                this.m_columnHeaderLevelCount, this.m_startColHeader);
        this._adjustHeaderBordersAlongAxis(this.m_colEndHeader, lastFunction, this.m_endColEndHeader, widthCheck, this.m_bottomCorner, style, 
                this.m_columnEndHeaderLevelCount, this.m_startColEndHeader);           
    }
    
    bw = null;
    
    if (heightCheck && this.m_endColEndHeader >= 0)
    {
        this.m_addBorderBottom = true;
        bw = true;
    }
    else if (this.m_addBorderBottom == true)
    {
        bw = false;
    }
    
    if (bw != null)
    {
        style = this.getMappedStyle('borderHorizontalSmall');
        if (this.m_rowHeaderScrollbarSpacer != null)
        {
            bw ? this.m_utils.addCSSClassName(this.m_rowHeaderScrollbarSpacer, style) : this.m_utils.removeCSSClassName(this.m_rowHeaderScrollbarSpacer, style);    
        }             
        if (this.m_bottomCorner != null)
        {
            bw ? this.m_utils.addCSSClassName(this.m_bottomCorner, style) : this.m_utils.removeCSSClassName(this.m_bottomCorner, style);
        }        
        tags = this.m_colEndHeader.firstChild.childNodes;
        for (i = 0; i < tags.length; i++) 
        {
            bw ? this.m_utils.addCSSClassName(tags[i], style) : this.m_utils.removeCSSClassName(tags[i], style);            
        }
    }
    else
    {
        style = this.getMappedStyle('borderHorizontalNone');    
        lastFunction = this._isLastRow.bind(this);
        this._adjustHeaderBordersAlongAxis(this.m_rowHeader, lastFunction, this.m_endRowHeader, heightCheck, this.m_rowHeaderScrollbarSpacer, style, 
                this.m_rowHeaderLevelCount, this.m_startRowHeader);
        this._adjustHeaderBordersAlongAxis(this.m_rowEndHeader, lastFunction, this.m_endRowEndHeader, heightCheck, this.m_bottomCorner, style, 
                this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader);        
    }
};

/**
 * Build the corners of the grid. If they exist, removes them and rebuilds them.
 * @private
 */
DvtDataGrid.prototype.buildCorners = function()
{
    var scrollbarSize, colHeaderHeight, rowHeaderWidth, bottomCorner,
            corner, dir, rowHeaderScrollbarSpacer, columnHeaderScrollbarSpacer,
            colHeaderWidth, rowHeaderHeight, colEndHeaderHeight,
            rowEndHeaderWidth, width, height;

    scrollbarSize = this.m_utils.getScrollbarSize();
    width = this.getWidth();
    height = this.getHeight();
    colHeaderHeight = this.getColumnHeaderHeight();
    colHeaderWidth = this.getElementWidth(this.m_colHeader);
    colEndHeaderHeight = this.getColumnEndHeaderHeight();
    rowHeaderWidth = this.getRowHeaderWidth();
    rowEndHeaderWidth = this.getRowEndHeaderWidth();
    rowHeaderHeight = this.getElementHeight(this.m_rowHeader);
    dir = this.getResources().isRTLMode() ? "right" : "left";

    //rather than removing and appending the nodes every time just adjust the live ones

    if (this.m_endRowHeader != -1 && this.m_endColHeader != -1)
    {
        // render corner
        if (this.m_corner != null)
        {
            corner = this.m_corner;
        }
        else
        {
            corner = document.createElement("div");
            corner['id'] = this.createSubId("corner");
            corner['className'] = this.getMappedStyle("topcorner");
        }

        this.setElementWidth(corner, rowHeaderWidth);
        this.setElementHeight(corner, colHeaderHeight);

        if (this.m_corner == null)
        {
            this.m_root.appendChild(corner); //@HTMLUpdateOK
            this.m_corner = corner;
        }
    }
    if (this.m_corner != null && corner == null)
    {
        this.m_root.removeChild(this.m_corner);
        this.m_corner = null;
    }

    //no bottom left corner if there are no row headers
    if (this.m_endRowHeader != -1)
    {
        if (this.m_hasHorizontalScroller || this.m_endColEndHeader != -1)
        {
            if (this.m_rowHeaderScrollbarSpacer != null)
            {
                rowHeaderScrollbarSpacer = this.m_rowHeaderScrollbarSpacer;
            }
            else
            {
                rowHeaderScrollbarSpacer = document.createElement("div");
                rowHeaderScrollbarSpacer['id'] = this.createSubId("rhSbSpacer");
                rowHeaderScrollbarSpacer['className'] = this.getMappedStyle("rowheaderspacer");
            }

            this.setElementDir(rowHeaderScrollbarSpacer, (rowHeaderHeight + colHeaderHeight), 'top');
            this.setElementDir(rowHeaderScrollbarSpacer, 0, dir);
            this.setElementWidth(rowHeaderScrollbarSpacer, rowHeaderWidth);
            if (this.m_endColEndHeader != -1)
            {
                this.setElementHeight(rowHeaderScrollbarSpacer, colEndHeaderHeight + (this.m_hasHorizontalScroller ? scrollbarSize : 0));
            }
            else
            {
                this.setElementHeight(rowHeaderScrollbarSpacer, height - rowHeaderHeight - colHeaderHeight);
            }

            if (this.m_rowHeaderScrollbarSpacer == null)
            {
                this.m_root.appendChild(rowHeaderScrollbarSpacer); //@HTMLUpdateOK
                this.m_rowHeaderScrollbarSpacer = rowHeaderScrollbarSpacer;
            }
        }
        else
        {
            if (this.m_rowHeaderScrollbarSpacer != null)
            {
                this.m_root.removeChild(this.m_rowHeaderScrollbarSpacer);
            }
            this.m_rowHeaderScrollbarSpacer = null;
        }
    }

    //no top right corner if there are no col headers
    if (this.m_endColHeader != -1)
    {
        if (this.m_hasVerticalScroller || this.m_endRowEndHeader != -1)
        {
            if (this.m_columnHeaderScrollbarSpacer != null)
            {
                columnHeaderScrollbarSpacer = this.m_columnHeaderScrollbarSpacer;
            }
            else
            {
                columnHeaderScrollbarSpacer = document.createElement("div");
                columnHeaderScrollbarSpacer['id'] = this.createSubId("chSbSpacer");
                columnHeaderScrollbarSpacer['className'] = this.getMappedStyle("colheaderspacer");
            }

            this.setElementDir(columnHeaderScrollbarSpacer, (rowHeaderWidth + colHeaderWidth), dir);
            this.setElementDir(columnHeaderScrollbarSpacer, 0, 'top');
            if (this.m_endRowEndHeader != -1)
            {
                this.setElementWidth(columnHeaderScrollbarSpacer, rowEndHeaderWidth + (this.m_hasVerticalScroller ? scrollbarSize : 0));
            }
            else
            {
                this.setElementWidth(columnHeaderScrollbarSpacer, width - colHeaderWidth - rowHeaderWidth);
            }
            this.setElementHeight(columnHeaderScrollbarSpacer, colHeaderHeight);

            if (this.m_columnHeaderScrollbarSpacer == null)
            {
                this.m_root.appendChild(columnHeaderScrollbarSpacer); //@HTMLUpdateOK
                this.m_columnHeaderScrollbarSpacer = columnHeaderScrollbarSpacer;
            }
        }
        else
        {
            if (this.m_columnHeaderScrollbarSpacer != null)
            {
                this.m_root.removeChild(this.m_columnHeaderScrollbarSpacer);
            }
            this.m_columnHeaderScrollbarSpacer = null;
        }
    }

    if ((this.m_hasHorizontalScroller && this.m_hasVerticalScroller) ||
        (this.m_hasVerticalScroller && this.m_endColEndHeader != -1) ||
        (this.m_hasHorizontalScroller && this.m_endRowEndHeader != -1) ||
        (this.m_endRowEndHeader != -1 && this.m_endColEndHeader != -1))
    {
    // render bottom corner (for both scrollbars) if needed
        if (this.m_bottomCorner != null)
        {
            bottomCorner = this.m_bottomCorner;
        }
        else
        {
            bottomCorner = document.createElement("div");
            bottomCorner['id'] = this.createSubId("bcorner");
            bottomCorner['className'] = this.getMappedStyle("bottomcorner");
        }

        this.setElementDir(bottomCorner, (rowHeaderHeight + colHeaderHeight), 'top');
        this.setElementDir(bottomCorner, (rowHeaderWidth + colHeaderWidth), dir);
        if (this.m_endRowEndHeader != -1)
        {
            this.setElementWidth(bottomCorner, rowEndHeaderWidth + (this.m_hasVerticalScroller ? scrollbarSize : 0));
        }
        else
        {
            this.setElementWidth(bottomCorner, width - colHeaderWidth - rowHeaderWidth);
        }

        if (this.m_endColEndHeader != -1)
        {
            this.setElementHeight(bottomCorner, colEndHeaderHeight + (this.m_hasHorizontalScroller ? scrollbarSize : 0));
        }
        else
        {
            this.setElementHeight(bottomCorner, height - rowHeaderHeight - colHeaderHeight);
        }

        if (this.m_bottomCorner == null)
        {
            this.m_root.appendChild(bottomCorner); //@HTMLUpdateOK
            this.m_bottomCorner = bottomCorner;
        }
    }
	// remove bottom corner on resize if not neccessary
    if (this.m_bottomCorner != null && bottomCorner == null)
    {
        this.m_root.removeChild(this.m_bottomCorner);
        this.m_bottomCorner = null;
    }   
};

/**
 * Sets the inital scroller postion. If initial scroll is set via key, will find the indexes from the data source
 * and call back to _intialScrollPositionCallback, otherwise will just call _intialScrollPositionCallback with the indexes
 * provided.
 */
DvtDataGrid.prototype.setInitialScrollPosition = function()
{
    var scrollMode, columnScrollPosition, rowScrollPosition, databody, firstRow, firstCell;
    scrollMode = this.m_options.getScrollPositionMode();
    if (this.m_databody != undefined)
    {
        if (scrollMode != null)
        {
            columnScrollPosition = this.m_options.getColumnScrollPosition();
            rowScrollPosition = this.m_options.getRowScrollPosition();

            if (columnScrollPosition == null && rowScrollPosition == null)
            {
                // no information provided in the scrollPosition option so bail
                return;
            }

            if (scrollMode === 'key')
            {
                // if they specify only 1 key, get the other key that dataSource.indexes requires
                // from the first row or cell locally
                if (rowScrollPosition == null || columnScrollPosition == null)
                {
                    databody = this.m_databody;
                    firstRow = databody != null ? databody['firstChild']['firstChild'] : null;                    
                    firstCell = firstRow != null ? databody['firstChild']['firstChild']['firstChild'] : null;

                    if (rowScrollPosition == null && firstCell != null)
                    {
                        rowScrollPosition = firstCell[this.getResources().getMappedAttribute('context')]['keys']['row'];
                    }
                    else if (columnScrollPosition == null && firstCell != null)
                    {
                        columnScrollPosition = firstCell[this.getResources().getMappedAttribute('context')]['keys']['column'];
                    }
                }

                if (rowScrollPosition != null && columnScrollPosition != null)
                {
                    // need to use _indexes because the row/column could be off screen
                    // get the indexes of the given keys and pass in a callback to kick off a scroller event
                    this._indexes({'row': rowScrollPosition, 'column': columnScrollPosition}, this._intialScrollPositionCallback);
                }
            }
            else
            {
                // if they specify only 1 index, set the other index to 0
                if (rowScrollPosition == null)
                {
                    rowScrollPosition = 0;
                }
                else if (columnScrollPosition == null)
                {
                    columnScrollPosition = 0;
                }

                this._intialScrollPositionCallback({'row': rowScrollPosition, 'column': columnScrollPosition});
            }
        }
    }
};

/**
 * Sets the inital scroller postion, based on average column width and height
 * @param {Object} indexes the indexes to scroll to with property row and column, values are numbers
 * @private
 */
DvtDataGrid.prototype._intialScrollPositionCallback = function(indexes)
{
    //scroll to index puts the desired index at the bottom of the viewport
    var columnScrollPosition, rowScrollPosition, initialScrollLeft, initialScrollTop = 0;
    columnScrollPosition = indexes['column'] === -1 ? 0 : indexes['column'];
    rowScrollPosition = indexes['row'] === -1 ? 0 : indexes['row'];

    initialScrollLeft = columnScrollPosition * this.m_avgColWidth;
    initialScrollTop = rowScrollPosition * this.m_avgRowHeight;

    this._initiateScroll(initialScrollLeft, initialScrollTop);
};

/**
 * Determine if horizontal scrollbar is needed
 * @param {number|null=} expectedWidth - databody width
 * @return {boolean} true if horizontal scrollbar required
 */
DvtDataGrid.prototype.isDatabodyHorizontalScrollbarRequired = function(expectedWidth)
{
    var databody, scroller, expected;
    // if expected width of the databody is not specified, extract from style
    databody = this.m_databody;
    if (expectedWidth == null)
    {
        expected = this.getElementWidth(databody);
    }
    else
    {
        expected = expectedWidth;
    }

    scroller = databody['firstChild'];
    if (this.getElementWidth(scroller) > expected)
    {
        return true;
    }
    return false;
};

/**
 * Determine if vertical scrollbar is needed
 * @param {number|null=} expectedHeight - databody height
 * @return {boolean} true if vertical scrollbar required
 * @private
 */
DvtDataGrid.prototype.isDatabodyVerticalScrollbarRequired = function(expectedHeight)
{
    var databody, scroller, expected;
    // if expected height of the databody is not specified, extract from style
    databody = this.m_databody;
    if (expectedHeight == null)
    {
        expected = this.getElementHeight(databody);
    }
    else
    {
        expected = expectedHeight;
    }

    scroller = databody['firstChild'];
    if (this.getElementHeight(scroller) > expected)
    {
        return true;
    }
    return false;
};

/**
 * todo: merge with buildAccInfo, we just need one status role div.
 * Build a status bar div
 * @return {Element} the root of the status bar
 * @private
 */
DvtDataGrid.prototype.buildStatus = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("status");
    root['className'] = this.getMappedStyle("status");
    root.setAttribute("role", "status");

    return root;
};

/**
 * Build the offscreen div used by screenreader for action such as sort
 * @return {Element} the root of the accessibility info div
 */
DvtDataGrid.prototype.buildAccInfo = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("info");
    root['className'] = this.getMappedStyle("info");
    root.setAttribute("role", "status");

    return root;
};

/**
 * Build the offscreen div used by screenreader for summary description
 * @return {Element} the root of the accessibility summary div
 */
DvtDataGrid.prototype.buildAccSummary = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("summary");
    root['className'] = this.getMappedStyle("info");

    return root;
};

/**
 * Build the offscreen div used by screenreader for state information
 * @return {Element} the root of the accessibility state info div
 */
DvtDataGrid.prototype.buildStateInfo = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("state");
    root['className'] = this.getMappedStyle("info");

    return root;
};

/**
 * Build the offscreen div used by screenreader for cell context information
 * @return {Element} the root of the accessibility context info div
 */
DvtDataGrid.prototype.buildContextInfo = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("context");
    root['className'] = this.getMappedStyle("info");

    return root;
};

/**
 * Build the offscreen div used by screenreader used for reading current cell context information
 * @return {Element} the root of the accessibility current cell context info div
 */
DvtDataGrid.prototype.buildPlaceHolder = function()
{
    var root = document.createElement("div");
    root['id'] = this.createSubId("placeHolder");
    root['className'] = this.getMappedStyle("info");

    return root;
};

/**
 * Sets the text on the offscreen div.  The text contains a summary text describing the grid
 * including structure information
 * @private
 */
DvtDataGrid.prototype.populateAccInfo = function()
{
    var summary, summaryExpanded;

    summary = this.getResources().getTranslatedText('accessibleSummaryExact', {'rownum': (this.m_endRow + 1), 'colnum': (this.m_endCol + 1)});

    // if it's hierarchical, then include specific accessible info about what's expanded
    if (this.getDataSource().getExpandedKeys)
    {
        summaryExpanded = this.getResources().getTranslatedText('accessibleSummaryExpanded', {'num': this.getDataSource().getExpandedKeys().length});
        summary = summary + ". " + summaryExpanded;
    }

    // add instruction text
    summary += ". ";

    // set the summary text on the screen reader div
    this.m_accSummary.textContent = summary;
};

/**
 * Implements Accessible interface.
 * Sets accessible information on the DataGrid.
 * This is currently used by the Row Expander to alert screenreader of such
 * information as depth, expanded state, index etc
 * @param {Object} context an object containing attribute context or state to set m_accessibleContext/state
 * @export
 */
DvtDataGrid.prototype.SetAccessibleContext = function(context)
{
    var label, ancestors, col, i, parent, row, cell, text;

    if (context != null)
    {
        // got row context info
        if (context['context'] != null)
        {
            // save it for updateContextInfo to consume later
            this.m_accessibleContext = context['context'];
        }

        // got disclosure state info
        if (context['state'] != null)
        {
            this.m_stateInfo.textContent = context['state'];
        }

        // got ancestors info
        if (context['ancestors'] != null && this._isDatabodyCellActive())
        {
            label = '';
            ancestors = context['ancestors'];
            col = this.m_active['indexes']['column'];
            if (col != null && col >= 0)
            {
                // constructs the appropriate parent context info text
                for (i = 0; i < ancestors.length; i++)
                {
                    if (i > 0)
                    {
                        label = label.concat(', ');
                    }
                    parent = ancestors[i];
                    row = this._findRowByKey(parent['key']);
                    if (row != null)
                    {
                        cell = row.childNodes[col - this.m_startCol];
                        // we are just going to extract any text content (or find first aria-label if null?)
                        text = cell.textContent;
                        // remove any carriage return, tab etc.
                        if (text != null)
                        {
                            text = text.replace(/\n|<br\s*\/?>/gi, '').trim();
                        }
                        else
                        {
                            text = '';
                        }
                        label = label.concat(parent['label']).concat(' ').concat(text);
                    }
                }
            }

            // prepend to existing context info
            this.m_accessibleContext = label.concat(', ').concat(this.m_accessibleContext);
        }
    }
};

/**
 * Sets the accessibility state info text
 * @param {string} key the message key
 * @param {Object=} args the optional arguments passed to bundle
 * @private
 */
DvtDataGrid.prototype._updateStateInfo = function(key, args)
{
    var text = this.getResources().getTranslatedText(key, args);
    if (text != null)
    {
        this.m_stateInfo.textContent = text;
    }
};

/**
 * Sets the accessibility context info text
 * @param {Object} context the context info about the cell
 * @param {number=} context.row the row index
 * @param {number=} context.column the column index
 * @param {number=} context.level the level of the header if there is one
 * @param {number=} context.rowHeader the rowHeader index
 * @param {number=} context.columnHeader the rowHeader index
 * @param {string=} skip whether to skip row or column
 * @private
 */
DvtDataGrid.prototype._updateContextInfo = function(context, skip)
{
    var row, column, info, text, level, rowHeader, rowEndHeader, columnHeader, columnEndHeader;

    row = context['row'];
    column = context['column'];
    level = context['level'];
    rowHeader = context['rowHeader'];
    rowEndHeader = context['rowEndHeader'];
    columnHeader = context['columnHeader'];
    columnEndHeader = context['columnEndHeader'];
    info = "";

    // row context.  Skip if there is an outstanding accessible row context
    if (this.m_accessibleContext == null && !isNaN(row) && skip != 'row')
    {
        text = this.getResources().getTranslatedText('accessibleRowContext', {'index': row + 1});
        if (text != null)
        {
            info = text;
        }
    }

    // column context
    if (!isNaN(column) && skip != 'column')
    {
        text = this.getResources().getTranslatedText('accessibleColumnContext', {'index': column + 1});
        if (text != null)
        {
            if (info.length === 0)
            {
                info = text;
            }
            else
            {
                info = info + ' ' + text;
            }
        }
    }

    // rowHeader context
    if (!isNaN(rowHeader) && skip != 'rowHeader')
    {
        text = this.getResources().getTranslatedText('accessibleRowHeaderContext', {'index': rowHeader + 1});
        if (text != null)
        {
            info = info.length === 0 ? text : info + ' ' + text;
        }
    }

    // columHeader context
    if (!isNaN(columnHeader) && skip != 'columnHeader')
    {
        text = this.getResources().getTranslatedText('accessibleColumnHeaderContext', {'index': columnHeader + 1});
        if (text != null)
        {
            info = info.length === 0 ? text : info + ' ' + text;
        }
    }

    // rowHeader context
    if (!isNaN(rowEndHeader) && skip != 'rowEndHeader')
    {
        text = this.getResources().getTranslatedText('accessibleRowEndHeaderContext', {'index': rowEndHeader + 1});
        if (text != null)
        {
            info = info.length === 0 ? text : info + ' ' + text;
        }
    }

    // columHeader context
    if (!isNaN(columnEndHeader) && skip != 'columnEndHeader')
    {
        text = this.getResources().getTranslatedText('accessibleColumnEndHeaderContext', {'index': columnEndHeader + 1});
        if (text != null)
        {
            info = info.length === 0 ? text : info + ' ' + text;
        }
    }

    // level context
    if (!isNaN(level) && skip != 'level')
    {
        text = this.getResources().getTranslatedText('accessibleLevelContext', {'level': level + 1});
        if (text != null)
        {
            info = info.length === 0 ? text : info + ' ' + text;
        }
    }

    // merge with accesssible context (from row expander)
    if (this.m_accessibleContext != null)
    {
        info = info + ', ' + this.m_accessibleContext;
        // reset
        this.m_accessibleContext = null;
    }

    this.m_contextInfo.textContent = info;
};

/**
 * Determine whether the row/column count is unknown.
 * @param {string} axis the row/column axis
 * @return {boolean|undefined} true if the count for the axis is unknown, false otherwise
 * @private
 */
DvtDataGrid.prototype._isCountUnknown = function(axis)
{
    var datasource, rowPrecision, colPrecision, rowCount, colCount;

    datasource = this.getDataSource();
    if (axis === 'row' || axis === 'rowEnd')
    {
        if (this.m_isEstimateRowCount === undefined)
        {
            rowPrecision = datasource.getCountPrecision('row');
            rowCount = datasource.getCount('row');
            if (rowPrecision === 'estimate' || rowCount < 0)
            {
                this.m_isEstimateRowCount = true;
            }
            else
            {
                this.m_isEstimateRowCount = false;
            }
        }

        return this.m_isEstimateRowCount;
    }
    else if (axis === 'column' || axis === 'columnEnd')
    {
        if (this.m_isEstimateColumnCount === undefined)
        {
            colPrecision = datasource.getCountPrecision('column');
            colCount = datasource.getCount('column');
            if (colPrecision === 'estimate' || colCount < 0)
            {
                this.m_isEstimateColumnCount = true;
            }
            else
            {
                this.m_isEstimateColumnCount = false;
            }
        }

        return this.m_isEstimateColumnCount;
    }

    // unrecognize axis, just assume the count is known
    return false;
};

/**
 * Convenient method which returns true if row count is unknown or high watermark scrolling is used.
 * @param {string} axis the row/column axis
 * @return {boolean} true if count is unknown or high watermark scrolling is used, false otherwise.
 * @private
 */
DvtDataGrid.prototype._isCountUnknownOrHighwatermark = function(axis)
{
    return (this._isCountUnknown(axis) || this._isHighWatermarkScrolling());
};

/**
 * Set display to none
 * @param {Element} root
 * @private
 */
DvtDataGrid.prototype._hideHeader = function(root)
{
    root['style']['display'] = 'none';
};

/**
 * Set display
 * @param {Element} root
 * @private
 */
DvtDataGrid.prototype._showHeader = function(root)
{
    root['style']['display'] = '';
};

/**
 * Build a header div
 * @param {string} axis - 'row' or 'column'
 * @param {string} styleClass - class to set on the header
 * @param {string} endStyleClass - class to set on the end header
 * @return {Object} contains the root and endRoot of the header axis
 */
DvtDataGrid.prototype.buildHeaders = function(axis, styleClass, endStyleClass)
{
    var root, endRoot, scroller, endScroller, scrollerClassName;

    scrollerClassName =  this.getMappedStyle("scroller") + (this.m_utils.isTouchDevice() ? " " + this.getMappedStyle("scroller-mobile") : "");

    root = document.createElement("div");
    root['id'] = this.createSubId(axis + "Header");
    root['className'] = styleClass + " " + this.getMappedStyle("header");
    scroller = document.createElement("div");
    scroller['className'] = scrollerClassName;
    root.appendChild(scroller); //@HTMLUpdateOK

    endRoot = document.createElement("div");
    endRoot['id'] = this.createSubId(axis + "EndHeader");
    endRoot['className'] = endStyleClass + " " + this.getMappedStyle("endheader");
    endScroller = document.createElement("div");
    endScroller['className'] = scrollerClassName;
    endRoot.appendChild(endScroller); //@HTMLUpdateOK

    if (axis === 'column')
    {
        this.m_colHeader = root;
        this.m_colEndHeader = endRoot;
    }
    else if (axis === 'row')
    {
        this.m_rowHeader = root;
        this.m_rowEndHeader = endRoot;
    }

    this.fetchHeaders(axis, 0, root, endRoot, null, null);

    return {root: root, endRoot:endRoot};
};

/**
 * Fetch the headers by calling the fetch headers method on the data source. Pass
 * callbacks for success and error to the data source.
 * @param {string} axis - 'row' or 'column'
 * @param {number} start - index to start fetching at
 * @param {Element|DocumentFragment} header - the root element of the axis header
 * @param {Element|DocumentFragment} endHeader - the root element of the axis endHeader
 * @param {number|null=} fetchSize - number of headers to fetch
 * @param {Object=} callbacks - the optional callbacks to invoke when the fetch success or fail
 * @protected
 */
DvtDataGrid.prototype.fetchHeaders = function(axis, start, header, endHeader, fetchSize, callbacks)
{
    var headerRange, successCallback;
    // check if we are already fetching
    if (this.m_fetching[axis])
    {
        return;
    }

    // fetch size could be explicitly specified.  If not, use the calculated one.
    if (fetchSize == undefined)
    {
        fetchSize = this.getFetchSize(axis);
    }

    headerRange = {
        "axis": axis, "start": start, "count": fetchSize, "header": header, "endHeader": endHeader
    };

    this.m_fetching[axis] = headerRange;

    // check if overriding callbacks are specified
    if (callbacks != null && callbacks['success'] != null)
    {
        successCallback = callbacks['success'];
    }
    else
    {
        successCallback = this.handleHeadersFetchSuccess;
    }

    this.showStatusText();
    // start fetch
    this._signalTaskStart();
    this.getDataSource().fetchHeaders(headerRange, {
        "success": successCallback, "error": this.handleHeadersFetchError
    }, {'success': this, 'error': this});
};

/**
 * Checks whether header fetch result match the request
 * @param {Object} headerRange the header range for the response
 * @protected
 */
DvtDataGrid.prototype.isHeaderFetchResponseValid = function(headerRange)
{
    var axis, responseCount;

    axis = headerRange['axis'];
    responseCount = this.m_fetching[axis]['count'];
    
    // do object reference check, imagine fetching 20 2 consecutive times but 
    // the data changed in bewteeen and we accidentally accept the first because 
    // the counts are the same
    return (headerRange == this.m_fetching[axis]);
};

/**
 * Checks whether the result is within the current viewport
 * @param {Object} headerRange
 * @private
 */
DvtDataGrid.prototype.isHeaderFetchResponseInViewport = function(headerRange)
{
    var start, returnVal, axis;
    
    if (!this.m_initialized)
    {
        // initial scroll these are not defined so just return true, or if not inited or if no databody
        return true;
    }

    // the goal of this method is to make sure we haven't scrolled further since the last fetch
    // so our request is still valid, we run a massive risk of running loops if our logic is wrong otherwise
    // as in we continue to request the same thing but it is never valid.
    axis = headerRange['axis'];
    start = headerRange['start'];
    
    if (axis == 'row')
    {
        returnVal = this._getLongScrollStart(this.m_currentScrollTop, this.m_prevScrollTop, axis);
    }
    else
    {
        returnVal = this._getLongScrollStart(this.m_currentScrollLeft, this.m_prevScrollLeft, axis);
    }

    // return true if the viewport fits inside the fetched range
    return (returnVal['start'] == start);
};

/**
 * Handle a successful call to the data source fetchHeaders
 * @param {Object} startResults a headerSet object returned from the data source
 * @param {Object} headerRange {"axis":,"start":,"count":,"header":}
 * @param {Object} endResults a headerSet object returned from the data source
 * @param {boolean} rowInsert if this is triggered by a row insert event
 * @protected
 */
DvtDataGrid.prototype.handleHeadersFetchSuccess = function(startResults, headerRange, endResults, rowInsert)
{
    var axis, root, endRoot, start, count;

    // validate result matches what we currently asks for
    if (!this.isHeaderFetchResponseValid(headerRange))
    {
        // end fetch
        this._signalTaskEnd();
        // not valid, so ignore result
        return;
    }

    axis = headerRange["axis"];

    // checks if the response covers the viewport
    if (this.isLongScroll() && !this.isHeaderFetchResponseInViewport(headerRange))
    {
        // clear cells fetching flag
        this.m_fetching[axis] = false;
        // store that the header is invalid for the case when there are no cells
        this.m_headerInvalid = true;
        // end fetch
        this._signalTaskEnd();
        return;
    }

    // remove fetching message
    this.m_fetching[axis] = false;

    root = headerRange["header"];
    endRoot = headerRange["endHeader"];
    start = headerRange["start"];
    count = this.getDataSource().getCount(axis);

    if (axis === "column")
    {
        if (startResults != null)
        {
            this.buildColumnHeaders(root, startResults, start, count, false, false);
            if (startResults.getCount() < headerRange['count'])
            {
                this.m_stopColumnHeaderFetch = true;
            }
        }
        if (this.m_endColHeader < 0)
        {
            this._hideHeader(root);
            this.m_stopColumnHeaderFetch = true;
        }
        else
        {
            this.m_hasColHeader = true;
        }
        
        if (endResults != null)
        {
            this.buildColumnEndHeaders(endRoot, endResults, start, count, false, false);
            if (endResults.getCount() < headerRange['count'])
            {
                this.m_stopColumnEndHeaderFetch = true;
            }
        }
        if (this.m_endColEndHeader < 0)
        {
            this._hideHeader(endRoot);
            this.m_stopColumnEndHeaderFetch = true;
        }
        else
        {
            this.m_hasColEndHeader = true;
        }        
    }
    else if (axis === "row")
    {
        if (startResults != null)
        {
            this.buildRowHeaders(root, startResults, start, count, rowInsert, false);
            if (startResults.getCount() < headerRange['count'])
            {
                this.m_stopRowHeaderFetch = true;
            }
        }
        if (this.m_endRowHeader < 0)
        {
            this._hideHeader(root);
            this.m_stopRowHeaderFetch = true;
        }
        else
        {
            this.m_hasRowHeader = true;
        }        

        if (endResults != null)
        {
            this.buildRowEndHeaders(endRoot, endResults, start, count, rowInsert, false);
            if (endResults.getCount() < headerRange['count'])
            {
                this.m_stopRowEndHeaderFetch = true;
            }
        }
        if (this.m_endRowEndHeader < 0)
        {
            this._hideHeader(endRoot);
            this.m_stopRowEndHeaderFetch = true;
        }
        else
        {
            this.m_hasRowEndHeader = true;
        }
    }

    if (this.isFetchComplete())
    {
        this.hideStatusText();
        if (this._shouldInitialize() && !rowInsert)
        {
            this._handleInitialization(true);
        }     
    }

    if (this.m_initialized)
    {
        //if there are no cells and we are initialized then size the scroller
        this._sizeDatabodyScroller();
        
        // we cannot syncScroller here. On touch this will trigger a refetch before the fetchCells has been called and will
        // cause an infinite loop. We always call fetchCells after fetchHeaders which calls syncScroller
        // check if we need to sync header scroll position
    }

    // end fetch
    this._signalTaskEnd();
};

/**
 * Handle an unsuccessful call to the data source fetchHeaders
 * @param {Error} error - the error returned from the data source
 * @param {Object} headerRange - keys of {axis,start,count,header}
 */
DvtDataGrid.prototype.handleHeadersFetchError = function(error, headerRange)
{
    // remove fetching message
    var axis = headerRange["axis"];
    this.m_fetching[axis] = false;
    // end fetch
    this._signalTaskEnd();
};

/**
 * Build a header context object for a header and return it
 * The header elem and the data can be set to null for cases where there are no headers
 * but varying height and width are desired
 * @param {string} axis - 'row' or 'column'
 * @param {number} index - the index of the header
 * @param {Object|null} data - the data the cell contains
 * @param {Object} metadata - the metadata the cell contains
 * @param {Element|null} elem - the header element
 * @param {number} level - the header level
 * @param {number} extent - the header extent
 * @param {number} depth - the header depth
 * @return {Object} the header context object, keys of {axis,index,data,key,datagrid}
 */
DvtDataGrid.prototype.createHeaderContext = function(axis, index, data, metadata, elem, level, extent, depth)
{
    var headerContext, key, prop;
    headerContext = {
    };
    headerContext['axis'] = axis;
    headerContext['index'] = index;
    headerContext['data'] = data;
    headerContext['component'] = this;
    headerContext['datasource'] = this.getDataSource();
    headerContext['level'] = level;
    headerContext['depth'] = depth;
    headerContext['extent'] = extent;

    //set the parent element to the content div
    if (elem != null)
    {
        headerContext['parentElement'] = elem['firstChild'];
    }

    key = metadata['key'];
    if (key != null && elem != null)
    {
        // store the key in the header element for fast retrieval
        this._setKey(elem, key);
    }

    // merge properties from metadata into cell context
    // the properties in metadata would have precedence
    for (prop in metadata)
    {
        if (metadata.hasOwnProperty(prop))
        {
            headerContext[prop] = metadata[prop];
        }
    }

    // invoke callback to allow ojDataGrid to change datagrid reference
    if (this.m_createContextCallback != null)
    {
        this.m_createContextCallback.call(this, headerContext);
    }

    return headerContext;
};

/**
 * Construct the column headers
 * @param {Element} headerRoot
 * @param {Object} headerSet
 * @param {number} start
 * @param {number} totalCount
 * @param {boolean} insert
 * @param {boolean} returnAsFragment
 * @returns {DocumentFragment|Object|undefined}
 */
DvtDataGrid.prototype.buildColumnHeaders = function(headerRoot, headerSet, start, totalCount, insert, returnAsFragment)
{
    var returnObj, axis, count, isAppend, reference, atPixel, currentEnd, levelCount, rootClassName, cellClassName, totalColumnWidth, totalColumnHeight;
    if (this.m_columnHeaderLevelCount == null)
    {
        this.m_columnHeaderLevelCount = headerSet.getLevelCount();
    }
    if (this.m_columnHeaderLevelCount == 0)
    {
        return;
    }
    
    axis = 'column';
    count = headerSet.getCount();
    isAppend = start > this.m_endColHeader;
    insert = false;
    reference = null;
    atPixel = isAppend ? this.m_endColHeaderPixel : this.m_startColHeaderPixel;
    currentEnd = this.m_endColHeader;
    levelCount = this.m_columnHeaderLevelCount;
    rootClassName = this.getMappedStyle('colheader') + ' ' + this.getMappedStyle('header');
    cellClassName = this.getMappedStyle('headercell') + ' ' + this.getMappedStyle('colheadercell');
    returnAsFragment = false;

    returnObj = this.buildAxisHeaders(headerRoot, headerSet, axis, start, count, isAppend, insert, reference, atPixel, currentEnd, levelCount, rootClassName, cellClassName, returnAsFragment);

    if (returnAsFragment)
    {
        return returnObj;
    }

    totalColumnWidth = returnObj.totalHeaderDimension;
    totalColumnHeight = returnObj.totalLevelDimension;
    
    if (totalColumnWidth != 0 && (this.m_avgColWidth == 0 || this.m_avgColWidth == undefined))
    {
        // the average column width should only be set once, it will only change when the column width varies between columns, but
        // in such case the new average column width would not be any more precise than previous one.
        this.m_avgColWidth = totalColumnWidth / count;
    }
    
    if (!this.m_colHeaderHeight)
    {
        this.m_colHeaderHeight = totalColumnHeight;
        this.setElementHeight(headerRoot, this.m_colHeaderHeight);
    }

    // whether this is adding columns to the left or right
    if (!isAppend)
    {
        // to the left
        this.m_startColHeader = this.m_startColHeader - count;
        this.m_startColHeaderPixel = this.m_startColHeaderPixel - totalColumnWidth;
    }
    else
    {
        // to the right, in case of long scroll this should alwats be the end header of the set
        this.m_endColHeader = start + count - 1;
        this.m_endColHeaderPixel = this.m_endColHeaderPixel + totalColumnWidth;
    }

    if (totalCount == -1)
    {
        totalCount = this.m_endColHeader;
    }

    // stop subsequent fetching if highwatermark scrolling is used and we have reach the last row, flag it.
    if (!this._isCountUnknown('column') && this._isHighWatermarkScrolling() && this.m_endColHeader + 1 >= totalCount)
    {
        this.m_stopColumnHeaderFetch = true;
    }
    else
    {
        this.m_stopColumnHeaderFetch = returnObj.stopFetch;
    }
    
    // if virtual scrolling may have to adjust at the beginning
    if (this.m_startColHeader == 0 && this.m_startColHeaderPixel != 0)
    {
        this._shiftHeadersAlongAxisInContainer(headerRoot['firstChild'], 0, this.m_startColHeaderPixel * -1, this.getResources().isRTLMode() ? "right" : "left", this.getMappedStyle('colheadercell'));
        this.m_startColHeaderPixel = 0;
    }
};

/**
 * Construct the column end headers
 * @param {Element} headerRoot
 * @param {Object} headerSet
 * @param {number} start
 * @param {number} totalCount
 * @param {boolean} insert
 * @param {boolean} returnAsFragment
 * @returns {DocumentFragment|Object|undefined}
 */
DvtDataGrid.prototype.buildColumnEndHeaders = function(headerRoot, headerSet, start, totalCount, insert, returnAsFragment)
{
    var returnObj, axis, count, isAppend, reference, atPixel, currentEnd, levelCount, rootClassName, cellClassName, totalColumnWidth, totalColumnHeight;
    if (this.m_columnEndHeaderLevelCount == null)
    {
        this.m_columnEndHeaderLevelCount = headerSet.getLevelCount(); 
    }
    if (this.m_columnEndHeaderLevelCount == 0)
    {
        return;
    }
    
    axis = 'columnEnd';
    count = headerSet.getCount();
    isAppend = start > this.m_endColEndHeader;
    insert = false;
    reference = null;
    atPixel = isAppend ? this.m_endColEndHeaderPixel : this.m_startColEndHeaderPixel;
    currentEnd = this.m_endColEndHeader;
    levelCount = this.m_columnEndHeaderLevelCount;
    rootClassName = this.getMappedStyle('colendheader') + ' ' + this.getMappedStyle('endheader');
    cellClassName = this.getMappedStyle('endheadercell') + ' ' + this.getMappedStyle('colendheadercell');
    returnAsFragment = false;

    returnObj = this.buildAxisHeaders(headerRoot, headerSet, axis, start, count, isAppend, insert, reference, atPixel, currentEnd, levelCount, rootClassName, cellClassName, returnAsFragment);

    if (returnAsFragment)
    {
        return returnObj;
    }

    totalColumnWidth = returnObj.totalHeaderDimension;
    totalColumnHeight = returnObj.totalLevelDimension;

    if (totalColumnWidth != 0 && (this.m_avgColWidth == 0 || this.m_avgColWidth == undefined))
    {
        // the average column width should only be set once, it will only change when the column width varies between columns, but
        // in such case the new average column width would not be any more precise than previous one.
        this.m_avgColWidth = totalColumnWidth / count;
    }
    
    if (!this.m_colEndHeaderHeight)
    {
        this.m_colEndHeaderHeight = totalColumnHeight;
        this.setElementHeight(headerRoot, this.m_colEndHeaderHeight);
    }

    // whether this is adding columns to the left or right
    if (!isAppend)
    {
        // to the left
        this.m_startColEndHeader = this.m_startColEndHeader - count;
        this.m_startColEndHeaderPixel = this.m_startColEndHeaderPixel - totalColumnWidth;
    }
    else
    {
        // to the right, in case of long scroll this should alwats be the end header of the set
        this.m_endColEndHeader = start + count - 1;
        this.m_endColEndHeaderPixel = this.m_endColEndHeaderPixel + totalColumnWidth;
    }

    if (totalCount == -1)
    {
        totalCount = this.m_endColEndHeader;
    }

    // stop subsequent fetching if highwatermark scrolling is used and we have reach the last row, flag it.
    if (!this._isCountUnknown('column') && this._isHighWatermarkScrolling() && this.m_endColEndHeader + 1 >= totalCount)
    {
        this.m_stopColumnEndHeaderFetch = true;
    }
    else
    {
        this.m_stopColumnEndHeaderFetch = returnObj.stopFetch;
    }

    // if virtual scrolling may have to adjust at the beginning
    if (this.m_startColEndHeader == 0 && this.m_startColEndHeaderPixel != 0)
    {
        this._shiftHeadersAlongAxisInContainer(headerRoot['firstChild'], 0, this.m_startColEndHeaderPixel * -1, this.getResources().isRTLMode() ? "right" : "left", this.getMappedStyle('colendheadercell'));
        this.m_startColEndHeaderPixel = 0;
    }
};

/**
 * Construct the row headers
 * @param {Element} headerRoot
 * @param {Object} headerSet
 * @param {number} start
 * @param {number} totalCount
 * @param {boolean} insert
 * @param {boolean} returnAsFragment
 * @returns {DocumentFragment|Object|undefined}
 */
DvtDataGrid.prototype.buildRowHeaders = function(headerRoot, headerSet, start, totalCount, insert, returnAsFragment)
{
    var returnObj, axis, count, isAppend, reference, atPixel, currentEnd, levelCount, rootClassName, cellClassName, totalRowHeight, totalRowWidth, prev;
    if (this.m_rowHeaderLevelCount == null)
    {
        this.m_rowHeaderLevelCount = headerSet.getLevelCount();
    }
    if (this.m_rowHeaderLevelCount == 0)
    {
        return;
    }
    
    axis = 'row';
    count = headerSet.getCount();
    isAppend = start > this.m_endRowHeader;
    atPixel = isAppend ? this.m_endRowHeaderPixel : this.m_startRowHeaderPixel;
    if (insert)
    {
        reference = headerRoot['firstChild']['childNodes'][start - this.m_startRowHeader];
        atPixel = this.getElementDir(reference, 'top');
    }
    else
    {
        reference = null;
    }
    currentEnd = this.m_endRowHeader;
    levelCount = this.m_rowHeaderLevelCount;
    rootClassName = this.getMappedStyle('rowheader') + ' ' + this.getMappedStyle('header');
    cellClassName = this.getMappedStyle('row') + ' ' + this.getMappedStyle('headercell') + ' ' + this.getMappedStyle('rowheadercell');

    returnObj = this.buildAxisHeaders(headerRoot, headerSet, axis, start, count, isAppend, insert, reference, atPixel, currentEnd, levelCount, rootClassName, cellClassName, returnAsFragment);

    totalRowHeight = returnObj.totalHeaderDimension;
    totalRowWidth = returnObj.totalLevelDimension;

    if (returnAsFragment)
    {
        return returnObj;
    }

    if (totalRowHeight != 0 && (this.m_avgRowHeight == 0 || this.m_avgRowHeight == undefined))
    {
        // the average row height should only be set once, it will only change when the row height varies between rows, but
        // in such case the new average row height would not be any more precise than previous one.
        this.m_avgRowHeight = totalRowHeight / count;
    }

    if (!this.m_rowHeaderWidth)
    {
        this.m_rowHeaderWidth = totalRowWidth;
        this.setElementWidth(headerRoot, this.m_rowHeaderWidth);
    }

    if (isAppend)
    {
        //if appending a row header, make sure the previous fragment has a bottom border if it was the last
        if (this.m_endRowHeader != -1 && count != 0)
        {
            //get the last header in the scroller
            prev = headerRoot['firstChild']['childNodes'][this.m_endRowHeader - this.m_startRowHeader];
            if (prev != null)
            {
                this.m_utils.removeCSSClassName(prev, this.getMappedStyle('borderHorizontalNone'));
            }
        }
        //in case of a long scroll the end should always be the start plus the count - 1 for 0 indexing
        this.m_endRowHeader = start + count - 1;
        this.m_endRowHeaderPixel = this.m_endRowHeaderPixel + totalRowHeight;
    }
    else if (insert)
    {
        if (start < this.m_startRowHeader)
        {
            // added before the start
            this.m_startRowHeader = start;
            this.m_startRowHeaderPixel = Math.max(0, this.m_startRowHeaderPixel - totalRowHeight);
        }
        //update the endRowHeader and endRowheaderPixel no matter where we insert
        this.m_endRowHeader = this.m_endRowHeader + count;
        this.m_endRowHeaderPixel = Math.max(0, this.m_endRowHeaderPixel + totalRowHeight);
        this.pushRowHeadersDown(reference, totalRowHeight);
    }
    else
    {
        this.m_startRowHeader = Math.max(0, this.m_startRowHeader - count);
        // zero maximum is handled below by realigning when appropriate
        this.m_startRowHeaderPixel = this.m_startRowHeaderPixel - totalRowHeight;
    }

    if (totalCount == -1)
    {
        totalCount = this.m_endRowHeader;
    }

    // stop subsequent fetching if highwatermark scrolling is used and we have reach the last row, flag it.
    if (!this._isCountUnknown('row') && this._isHighWatermarkScrolling() && this.m_endRowHeader + 1 >= totalCount)
    {
        this.m_stopRowHeaderFetch = true;
    }
    else
    {
        this.m_stopRowHeaderFetch = returnObj.stopFetch;
    }
    
    // if virtual scrolling may have to adjust at the beginning
    if (this.m_startRowHeader == 0 && this.m_startRowHeaderPixel != 0)
    {
        this._shiftHeadersAlongAxisInContainer(headerRoot['firstChild'], 0, this.m_startRowHeaderPixel * -1, "top", this.getMappedStyle('rowheadercell'));
        this.m_startRowHeaderPixel = 0;
    }    
};

/**
 * Construct the row end headers
 * @param {Element} headerRoot
 * @param {Object} headerSet
 * @param {number} start
 * @param {number} totalCount
 * @param {boolean} insert
 * @param {boolean} returnAsFragment
 * @returns {DocumentFragment|Object|undefined}
 */
DvtDataGrid.prototype.buildRowEndHeaders = function(headerRoot, headerSet, start, totalCount, insert, returnAsFragment)
    {
    var returnObj, axis, count, isAppend, reference, atPixel, currentEnd, levelCount, rootClassName, cellClassName, totalRowHeight, totalRowWidth, prev;
    if (this.m_rowEndHeaderLevelCount == null)
    {
        this.m_rowEndHeaderLevelCount = headerSet.getLevelCount();
    }
    if (this.m_rowEndHeaderLevelCount == 0)
    {
        return;
    }
    
    axis = 'rowEnd';
    count = headerSet.getCount();
    isAppend = start > this.m_endRowEndHeader;
    atPixel = isAppend ? this.m_endRowEndHeaderPixel : this.m_startRowEndHeaderPixel;
    if (insert)
    {
        reference = headerRoot['firstChild']['childNodes'][start - this.m_startRowEndHeader];
        atPixel = this.getElementDir(reference, 'top');
    }
    else
    {
        reference = null;
    }
    currentEnd = this.m_endRowEndHeader;
    levelCount = this.m_rowEndHeaderLevelCount;
    rootClassName = this.getMappedStyle('rowendheader') + ' ' + this.getMappedStyle('endheader');
    cellClassName = this.getMappedStyle('row') + ' ' + this.getMappedStyle('endheadercell') + ' ' + this.getMappedStyle('rowendheadercell');

    returnObj = this.buildAxisHeaders(headerRoot, headerSet, axis, start, count, isAppend, insert, reference, atPixel, currentEnd, levelCount, rootClassName, cellClassName, returnAsFragment);

    if (returnAsFragment)
    {
        return returnObj;
    }

    totalRowHeight = returnObj.totalHeaderDimension;
    totalRowWidth = returnObj.totalLevelDimension;

    if (returnAsFragment)
    {
        return returnObj;
    }
    
    if (totalRowHeight != 0 && (this.m_avgRowHeight == 0 || this.m_avgRowHeight == undefined))
    {
        // the average row height should only be set once, it will only change when the row height varies between rows, but
        // in such case the new average row height would not be any more precise than previous one.
        this.m_avgRowHeight = totalRowHeight / count;
    }
    
    if (!this.m_rowEndHeaderWidth)
    {
        this.m_rowEndHeaderWidth = totalRowWidth;
        this.setElementWidth(headerRoot, this.m_rowEndHeaderWidth);
    }

    if (isAppend)
    {
        //if appending a row header, make sure the previous fragment has a bottom border if it was the last
        if (this.m_endRowEndHeader != -1 && count != 0)
        {
            //get the last header in the scroller
            prev = headerRoot['firstChild']['childNodes'][this.m_endRowEndHeader - this.m_startRowEndHeader];
            if (prev != null)
            {
                this.m_utils.removeCSSClassName(prev, this.getMappedStyle('borderHorizontalNone'));
            }
        }
        //in case of a long scroll the end should always be the start plus the count - 1 for 0 indexing
        this.m_endRowEndHeader = start + count - 1;
        this.m_endRowEndHeaderPixel = this.m_endRowEndHeaderPixel + totalRowHeight;
    }
    else if (insert)
    {
        if (start < this.m_startRowEndHeader)
        {
            // added before the start
            this.m_startRowEndHeader = start;
            this.m_startRowEndHeaderPixel = Math.max(0, this.m_startRowEndHeaderPixel - totalRowHeight);

        }
        //update the endRowEndHeader and endRowEndHeaderPixel no matter where we insert
        this.m_endRowEndHeader = this.m_endRowEndHeader + count;
        this.m_endRowEndHeaderPixel = Math.max(0, this.m_endRowEndHeaderPixel + totalRowHeight);
        this.pushRowHeadersDown(reference, totalRowHeight);
    }
    else
    {
        this.m_startRowEndHeader = Math.max(0, this.m_startRowEndHeader - count);
        // zero maximum is handled below by realigning     
        this.m_startRowEndHeaderPixel = this.m_startRowEndHeaderPixel - totalRowHeight;
    }

    if (totalCount == -1)
    {
        totalCount = this.m_endRowEndHeader;
    }

    // stop subsequent fetching if highwatermark scrolling is used and we have reach the last row, flag it.
    if (!this._isCountUnknown('row') && this._isHighWatermarkScrolling() && this.m_endRowEndHeader + 1 >= totalCount)
    {
        this.m_stopRowEndHeaderFetch = true;
    }
    else
    {
        this.m_stopRowEndHeaderFetch = returnObj.stopFetch;
    }
    
    
    // if virtual scrolling may have to adjust at the beginning
    if (this.m_startRowEndHeader == 0 && this.m_startRowEndHeaderPixel != 0)
    {
        this._shiftHeadersAlongAxisInContainer(headerRoot['firstChild'], 0, this.m_startRowEndHeaderPixel * -1, "top", this.getMappedStyle('rowendheadercell'));
        this.m_startRowEndHeaderPixel = 0;
    }
};

/**
 * Build headers from the axis info provided
 * @param {Element} headerRoot
 * @param {Object} headerSet
 * @param {string} axis
 * @param {number} start
 * @param {number} count
 * @param {boolean} isAppend
 * @param {boolean} insert
 * @param {Element|null|undefined} reference
 * @param {number} atPixel
 * @param {number} currentEnd
 * @param {number} levelCount
 * @param {string} rootClassName
 * @param {string} cellClassName
 * @param {boolean} returnAsFragment
 * @returns {Object}
 */
DvtDataGrid.prototype.buildAxisHeaders = function(headerRoot, headerSet, axis, start, count, isAppend, insert, reference, atPixel, currentEnd, levelCount, rootClassName, cellClassName, returnAsFragment)
{
    var scroller, stopFetch, renderer, totalHeaderDimension, totalLevelDimension, fragment, x, styleDir, index, returnVal, top, left, columns;
    columns = axis.indexOf('column') != -1;
    styleDir = columns ? 'height': 'width';
    stopFetch = false;
    totalHeaderDimension = 0;
    totalLevelDimension = 0;
	left = 0;
	top = 0;

    if (!returnAsFragment)
    {
        // if unknown count and there's no more column, mark it so we won't try to fetch again
        if (count == 0 && this._isCountUnknown(axis))
        {
            stopFetch = true;
            return {totalHeaderDimension:totalHeaderDimension, totalLevelDimension:totalLevelDimension, stopFetch:stopFetch};
        }
        scroller = headerRoot['firstChild'];
        //add class name back if header populated later
        if (currentEnd == -1 && headerRoot['className'] == '')
        {
            headerRoot['className'] = rootClassName;
            headerRoot['style'][styleDir] = '';
            scroller['style'][styleDir] = '';
        }
    }

    renderer = this.m_options.getRenderer(axis);
    fragment = document.createDocumentFragment();
    x = 0;
    while (count - x > 0)
    {
        if (isAppend)
        {
            index = start + x;
            left = columns ? atPixel + totalHeaderDimension : 0;
            top = columns ? 0 : atPixel + totalHeaderDimension;
        }
        else
        {
            index = start + (count - 1 - x);
            left = columns ? atPixel - totalHeaderDimension : 0;
            top = columns ? 0 : atPixel - totalHeaderDimension;
        }

        returnVal = this.buildLevelHeaders(fragment, index, 0, left, top, isAppend, insert, renderer, headerSet, axis, cellClassName, levelCount);
        //increment the count over the extent of the header
        x += returnVal.count;
        totalHeaderDimension += returnVal.totalHeaderDimension;
        totalLevelDimension = returnVal.totalLevelDimension;
    }

    if (returnAsFragment)
    {
        return fragment;
    }

    if (isAppend)
    {
        scroller.appendChild(fragment); //@HTMLUpdateOK
    }
    else if (insert)
    {
        scroller.insertBefore(fragment, reference); //@HTMLUpdateOK
    }
    else
    {
        scroller.insertBefore(fragment, scroller['firstChild']); //@HTMLUpdateOK
    }

    if (!headerRoot.hasChildNodes() && !insert)
    {
        headerRoot.appendChild(scroller); //@HTMLUpdateOK
    }

    return {totalHeaderDimension:totalHeaderDimension, totalLevelDimension:totalLevelDimension, stopFetch:stopFetch};
};

/**
 * This method is used to call the renderer
 * @param {Function|undefined|null} renderer
 * @param {Object} context cellContext or headerContext
 * @param {Element} cellContent cell or header to append content to
 * @param {Object|string} data data for the cell
 * @param {string} className default class to apply to span
 * @private
 */
DvtDataGrid.prototype._renderContent = function(renderer, context, cellContent, data, className)
{
    var content, textWrapper;
    if (renderer != null)
    {
        content = renderer.call(this, context);
        if (content != null)
        {
            // allow return of document fragment from jquery create/js document.createDocumentFragment
            if (content['parentNode'] === null || content['parentNode'] instanceof DocumentFragment)
            {
                cellContent.appendChild(content); //@HTMLUpdateOK
            }
            else if (content['parentNode'] != null)
            {
                // parent node exists, do nothing
            }
            else if (content.toString)
            {
                textWrapper = document.createElement("span");
                textWrapper['className'] = className;
                textWrapper.appendChild(document.createTextNode(content.toString())); //@HTMLUpdateOK
                cellContent.appendChild(textWrapper); //@HTMLUpdateOK
            }
        }
        
        // make all focusable elements non-focusable, since we want to manage tab stops
        this._disableAllFocusableElements(cellContent); 
    }
    else
    {
        if (data != null && typeof data === 'object' && data.hasOwnProperty('data'))
        {
            data = data['data'];
        }
        if (data == null)
        {
            data = "";
        }
        textWrapper = document.createElement("span");
        textWrapper['className'] = className;
        textWrapper.appendChild(document.createTextNode(data.toString())); //@HTMLUpdateOK
        cellContent.appendChild(textWrapper); //@HTMLUpdateOK
    }
};

/**
 * Build headers along an axis recursively building them within the set
 * @param {DocumentFragment|Element|undefined} fragment the fragment to append the headers to
 * @param {number} index the index to begin rendering at
 * @param {number} level the level of the header to build at
 * @param {number} left the left value of the headers
 * @param {number} top the top value to start at
 * @param {boolean} isAppend is appending after
 * @param {boolean|undefined|null} insert is row or column insert
 * @param {Function|undefined|null} renderer header renderer
 * @param {Object} headerSet object
 * @param {string} axis column or row
 * @param {string} className string of the class names to be applied to the headers
 * @param {number} totalLevels the number of levels on the header
 * @returns {Object}
 */
DvtDataGrid.prototype.buildLevelHeaders = function(fragment, index, level, left, top, isAppend, insert, renderer, headerSet, axis, className, totalLevels)
{
    var levelDimension, headerDimension, dimensionToAdjust, dimensionToAdjustValue, dimensionSecond, dimensionSecondValue,
            start, end, extentInfo, headerExtent, patchBefore, patchAfter, groupingContainer, levelDimensionCache,
            header, returnVal, i, levelDimensionValue, headerDimensionValue, totalHeaderDimensionValue, headerCount, headerData, headerMetadata, headerContext,
            headerContent, headerDepth, inlineStyle, styleClass, nextIndex, totalLevelDimensionValue, returnObj, sortIcon, d, groupingRoot, dimensionAxis;

    levelDimensionValue = 0;
    totalLevelDimensionValue = 0;
    totalHeaderDimensionValue = 0;
    headerCount = 0;

    if (axis === 'row')
    {
        dimensionAxis = 'row';
        groupingRoot = this.m_rowHeader;
        levelDimension = 'width';
        levelDimensionCache = this.m_rowHeaderLevelWidths;
        headerDimension = 'height';
        dimensionToAdjust = 'top';
        dimensionToAdjustValue = top;
        dimensionSecond = this.getResources().isRTLMode() ? "right" : "left";
        dimensionSecondValue = left;
        start = this.m_startRowHeader;
        end = this.m_endRowHeader;
    }
    else if (axis == 'rowEnd')
    {
        dimensionAxis = 'row';
        groupingRoot = this.m_rowEndHeader;
        levelDimension = 'width';
        levelDimensionCache = this.m_rowEndHeaderLevelWidths;
        headerDimension = 'height';
        dimensionToAdjust = 'top';
        dimensionToAdjustValue = top;
        dimensionSecond = this.getResources().isRTLMode() ? "left" : "right";
        dimensionSecondValue = left;
        start = this.m_startRowEndHeader;
        end = this.m_endRowEndHeader;
    }
    else if (axis == 'column')
    {
        dimensionAxis = 'column';
        groupingRoot = this.m_colHeader;
        levelDimension = 'height';
        levelDimensionCache = this.m_columnHeaderLevelHeights;
        headerDimension = 'width';
        dimensionToAdjust = this.getResources().isRTLMode() ? "right" : "left";
        dimensionToAdjustValue = left;
        dimensionSecond = 'top';
        dimensionSecondValue = top;
        start = this.m_startColHeader;
        end = this.m_endColHeader;
    }
    else
    {
        dimensionAxis = 'column';
        groupingRoot = this.m_colEndHeader;
        levelDimension = 'height';
        levelDimensionCache = this.m_columnEndHeaderLevelHeights;
        headerDimension = 'width';
        dimensionToAdjust = this.getResources().isRTLMode() ? "right" : "left";
        dimensionToAdjustValue = left;
        dimensionSecond = 'bottom';
        dimensionSecondValue = top;
        start = this.m_startColEndHeader;
        end = this.m_endColEndHeader;
    }

    //get the extent info
    extentInfo = headerSet.getExtent(index, level);
    headerExtent = extentInfo['extent'];
    patchBefore = extentInfo['more']['before'];
    patchAfter = extentInfo['more']['after'];
    headerDepth = headerSet.getDepth(index, level);

    // if the data source says to patch before this header
    // and the index is 1 more than what is currently in the viewport
    // get the groupingContainer and add to it
    if (patchBefore && index === end + 1)
    {
        // get the grouping of the container at the previous index
        groupingContainer = this._getHeaderContainer(index - 1, level, 0, null, groupingRoot, totalLevels);
        // increment the extent stored in the grouping container
        this._setAttribute(groupingContainer, 'extent', this._getAttribute(groupingContainer, 'extent', true) + headerExtent);
        header = groupingContainer['firstChild'];
        levelDimensionValue = this.getElementDir(header, levelDimension);
        // add columns to that grouping container
        for (i = 0; i < headerExtent;)
        {
            if (axis === 'column' || axis === 'columnEnd')
            {
                returnVal = this.buildLevelHeaders(groupingContainer, index + i, level + headerDepth, dimensionToAdjustValue, dimensionSecondValue + levelDimensionValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
            }
            else
            {
                returnVal = this.buildLevelHeaders(groupingContainer, index + i, level + headerDepth, dimensionSecondValue + levelDimensionValue, dimensionToAdjustValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
            }
            // increment the left and total and count and skip ahead to the next header
            dimensionToAdjustValue += returnVal.totalHeaderDimension;
            totalHeaderDimensionValue += returnVal.totalHeaderDimension;
            headerCount += returnVal.count;
            i += returnVal.count;
        }
        // adjust the header size based on the total of the new sizes passed back
        this.setElementDir(header, this.getElementDir(header, headerDimension) + totalHeaderDimensionValue, headerDimension);
    }
    // if the data source says to patch after this header
    // and the index is 1 less than what is currently in the viewport
    // get the groupingContainer and add to it
    else if (patchAfter && index === start - 1)
    {
        // get the grouping of the container at the previous index
        groupingContainer = this._getHeaderContainer(index + 1, level, 0, null, groupingRoot, totalLevels);
        // increment the extent stored in the grouping container
        this._setAttribute(groupingContainer, 'extent', this._getAttribute(groupingContainer, 'extent', true) + headerExtent);
        // decrement the start stored in the grouping container, since inserting before
        this._setAttribute(groupingContainer, 'start', this._getAttribute(groupingContainer, 'start', true) - headerExtent);
        header = groupingContainer['firstChild'];
        levelDimensionValue = this.getElementDir(header, levelDimension);
        for (i = 0; i < headerExtent;)
        {
            if (axis === 'column' || axis === 'columnEnd')
            {
                returnVal = this.buildLevelHeaders(groupingContainer, index - i, level + headerDepth, dimensionToAdjustValue, dimensionSecondValue + levelDimensionValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
            }
            else
            {
                returnVal = this.buildLevelHeaders(groupingContainer, index - i, level + headerDepth, dimensionSecondValue + levelDimensionValue, dimensionToAdjustValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
            }
            dimensionToAdjustValue -= returnVal.totalHeaderDimension;
            totalHeaderDimensionValue += returnVal.totalHeaderDimension;
            headerCount += returnVal.count;
            i += returnVal.count;
        }
        this.setElementDir(header, this.getElementDir(header, headerDimension) + totalHeaderDimensionValue, headerDimension);
        this.setElementDir(header, dimensionToAdjustValue, dimensionToAdjust);
    }
    else
    {
        //get the information from the headers
        headerData = headerSet.getData(index, level);
        headerMetadata = headerSet.getMetadata(index, level);

        //create the header content area
        headerContent = document.createElement("div");
        headerContent['className'] = this.getMappedStyle("headercellcontent");

        //create the header element and append the content to it
        header = document.createElement("div");
        header.appendChild(headerContent); //@HTMLUpdateOK

        //build headerContext to pass to renderer
        headerContext = this.createHeaderContext(axis, index, headerData, headerMetadata, header, level, headerExtent, headerDepth);
        header['id'] = this._createHeaderId(axis, headerContext['key']);
        header[this.getResources().getMappedAttribute('context')] = headerContext;
        inlineStyle = this.m_options.getInlineStyle(axis, headerContext);
        styleClass = this.m_options.getStyleClass(axis, headerContext);

        //add inline styles to the column header cell
        if (inlineStyle != null)
        {
            header['style']['cssText'] = inlineStyle;
        }

        //add class names to the column header cell
        header['className'] = className;
        if (styleClass != null)
        {
            header['className'] += " " + styleClass;
        }

        // iterate over all levels to determine the dimension value for depth greater than 1
        for (d = 0; d < headerDepth; d++)
        {
            levelDimensionValue += this._getHeaderLevelDimension(level + d, header, levelDimensionCache, levelDimension);
        }
        this.setElementDir(header, dimensionToAdjustValue, dimensionToAdjust);
        this.setElementDir(header, dimensionSecondValue, dimensionSecond);
        this.setElementDir(header, levelDimensionValue, levelDimension);

        //find the size in case it depends on the classes, will be set in the appropriate case
        headerDimensionValue = this._getHeaderDimension(header, headerContext['key'], dimensionAxis, headerDimension);
        this._setAttribute(header, 'depth', headerDepth);

        //if this is an outer level then add a groupingContainer around it
        if (level != totalLevels - 1)
        {
            groupingContainer = document.createElement("div");
            groupingContainer['className'] = this.getMappedStyle('groupingcontainer');
            groupingContainer.appendChild(header); //@HTMLUpdateOK
            this._setAttribute(groupingContainer, 'start', isAppend ? index : index - headerExtent + 1);
            this._setAttribute(groupingContainer, 'extent', headerExtent);
            this._setAttribute(groupingContainer, 'level', level);
        }

        if (level + headerDepth == totalLevels)
        {
            // set the px width on the header regardless of unit type currently on it
            this.setElementDir(header, headerDimensionValue, headerDimension);
            totalHeaderDimensionValue += headerDimensionValue;
            headerCount++;
            totalLevelDimensionValue = levelDimensionValue;
            if (!(isAppend || insert))
            {
                dimensionToAdjustValue -= headerDimensionValue;
                this.setElementDir(header, dimensionToAdjustValue, dimensionToAdjust);
            }
        }
        else
        {
            for (i = 0; i < headerExtent; i++)
            {
                nextIndex = isAppend ? index + i : index - i;
                if (axis === 'column' || axis === 'columnEnd')
                {
                    returnVal = this.buildLevelHeaders(groupingContainer, nextIndex, level + headerDepth, dimensionToAdjustValue, dimensionSecondValue + levelDimensionValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
                }
                else
                {
                    returnVal = this.buildLevelHeaders(groupingContainer, nextIndex, level + headerDepth, dimensionSecondValue + levelDimensionValue, dimensionToAdjustValue, isAppend, insert, renderer, headerSet, axis, className, totalLevels);
                }
                headerDimensionValue = returnVal.totalHeaderDimension;
                dimensionToAdjustValue = isAppend ? dimensionToAdjustValue + headerDimensionValue : dimensionToAdjustValue - headerDimensionValue;
                totalHeaderDimensionValue += headerDimensionValue;
                headerCount += returnVal.count;
                i += returnVal.count - 1;
            }
            totalLevelDimensionValue = levelDimensionValue + returnVal.totalLevelDimension;
            if (!(isAppend || insert))
            {
                this.setElementDir(header, dimensionToAdjustValue, dimensionToAdjust);
            }
            this.setElementDir(header, totalHeaderDimensionValue, headerDimension);
        }

        if (axis == 'columnEnd' && this.m_addBorderBottom)
        {
            this.m_utils.addCSSClassName(header, this.getMappedStyle('borderHorizontalSmall'));
        }

        if (axis == 'rowEnd' && this.m_addBorderRight)
        {
            this.m_utils.addCSSClassName(header, this.getMappedStyle('borderVerticalSmall'));
        }

        //add resizable attribute if resize enabled
        if (this._isHeaderResizeEnabled(axis, headerContext))
        {
            this._setAttribute(header, 'resizable', "true");
        }

        // Temporarily add groupingContainer or header into this.m_root to have them in active DOM before rendering contents
        if (groupingContainer != null)
        {
            this.m_root.appendChild(groupingContainer); //@HTMLUpdateOK
        }
        else
        {
            this.m_root.appendChild(header); //@HTMLUpdateOK
        }

        this._renderContent(renderer, headerContext, headerContent, headerData, this.getMappedStyle("headercelltext"));

        if (axis === 'column')
        {
            // check if we need to render sort icons
            if (this._isSortEnabled(axis, headerContext))
            {
                if (headerMetadata['sortDirection'] != null && this.m_sortInfo == null)
                {
                    this.m_sortInfo = {};
                    this.m_sortInfo['key'] = headerMetadata['key'];
                    this.m_sortInfo['direction'] = headerMetadata['sortDirection'];
                    this.m_sortInfo['axis'] = axis;
                }

                sortIcon = this._buildSortIcon(headerContext);
                header.appendChild(sortIcon); //@HTMLUpdateOK
                this._setAttribute(header, 'sortable', "true");
            }
        }

        if (isAppend) // Moves groupingContainer/header from this.m_root to fragment
        {
            // if we are appending to the end, if there is a grouping container append that, if not just append the row header
            if (groupingContainer != null)
            {
                fragment.appendChild(groupingContainer); //@HTMLUpdateOK
            }
            else
            {
                fragment.appendChild(header); //@HTMLUpdateOK
            }
        }
        else
        {
            // if we are not appending to the end
            // if there is a grouping container append that to the fragment
            if (groupingContainer != null)
            {
                // if the fragment already has a firstChild we want to insert before it
                if (fragment['firstChild'])
                {
                    //if the firstChild is a groupingContainer just insert before it
                    if (this.m_utils.containsCSSClassName(fragment['firstChild'], this.getMappedStyle('groupingcontainer')))
                    {
                        fragment.insertBefore(groupingContainer, fragment['firstChild']); //@HTMLUpdateOK
                    }
                    //if the firstChild is a cell need to insert after it
                    else if (this.m_utils.containsCSSClassName(fragment['firstChild'], this.getMappedStyle('headercell')) ||
                        this.m_utils.containsCSSClassName(fragment['firstChild'], this.getMappedStyle('endheadercell')))
                    {
                        fragment.insertBefore(groupingContainer, fragment['firstChild']['nextSibling']); //@HTMLUpdateOK
                    }
                }
                else
                {
                    fragment.appendChild(groupingContainer); //@HTMLUpdateOK
                }
            }
            // if the fragment itself is a grouping container insert before the other grouping containers
            else if (this.m_utils.containsCSSClassName(fragment, this.getMappedStyle('groupingcontainer')))
            {
                fragment.insertBefore(header, fragment['firstChild']['nextSibling']); //@HTMLUpdateOK
            }
            // otherwise just insert the header at the beginning of the fragment
            else
            {
                fragment.insertBefore(header, fragment['firstChild']); //@HTMLUpdateOK
            }
        }
    }

    // do not put borders on last header cell, treat the index as the index + extent
    // needs to be here and not in loop in case of pactching nested headers
    if (axis === 'column' || axis === 'columnEnd')
    {
        if (this._isLastColumn(index + headerExtent - 1))
        {
            this.m_utils.addCSSClassName(header, this.getMappedStyle('borderVerticalNone'));
        }
    }
    //do not put bottom border on last row, pass the index + extent to see if it's the last index
    else if (this._isLastRow(index + headerExtent - 1) && !insert)
    {
            this.m_utils.addCSSClassName(header, this.getMappedStyle('borderHorizontalNone'));
    }
    
    // return value is the totalHeight of the rendered headers at this level,
    // the total count of headers rendered at that level,
    // and the totalWidth of the levels underneath it
    returnObj = {};
    returnObj.totalLevelDimension = totalLevelDimensionValue;
    returnObj.totalHeaderDimension = totalHeaderDimensionValue;
    returnObj.count = headerCount;
    return returnObj;
};

/**
 * Get the header dimension at a particular level, which will be cached if set once at that level
 * This permits the user to set the level width on the first row header at that width using renderers.
 * If it is not cached get the width
 * @param {number} level the level to get the dimension of
 * @param {Element} element the row header to get the dimension of if not cached
 * @param {Object} cache the  cache to look in
 * @param {string} dimension width/height
 * @returns {number} the dimension of that level
 * @private
 */
DvtDataGrid.prototype._getHeaderLevelDimension = function(level, element, cache, dimension)
{
    var width;

    width = cache[level];
    if (width != null)
    {
        return width;
    }

    width = this.getElementDir(element, dimension);
    cache[level] = width;
    return width;
};

/**
 * Get the header container surrounding the headers.
 * The structure of a container is as follows:
 * firstChild: header at that level
 * subsequent children: grouping containers except at the innermost level
 * @param {number|string} index
 * @param {number|string} level
 * @param {number|string} currentLevel
 * @param {Element|Array} headers
 * @param {Element} root
 * @param {number} levelCount
 * @returns {Element|null}
 * @private
 */
DvtDataGrid.prototype._getHeaderContainer = function(index, level, currentLevel, headers, root, levelCount)
{
    var headerIndex, headerExtent, headerDepth, i;
    if (headers == null)
    {
        headers = root['firstChild']['childNodes'];
        // if we are on the scroller children there is no first header so start at the first header in the list
        i = 0;
    }
    else
    {
        // if we are on a groupingContainer skip the first header which should be a row header at that level
        i = 1;
    }
    // if at the innermost level just return the parent
    if (currentLevel === levelCount - 1)
    {
        return headers[0]['parentNode'];
    }

    // loop over all headers skipping firstChild of groups
    while (i < headers.length)
    {
        // if the index is between that header start and start+extent dig deeper
        headerIndex = this._getAttribute(headers[i], 'start', true);
        headerExtent = this._getAttribute(headers[i], 'extent', true);
        headerDepth = this._getAttribute(headers[i]['firstChild'], 'depth', true);
        if (index >= headerIndex && index < headerIndex + headerExtent)
        {
            if (level < currentLevel + headerDepth)
            {
                return headers[i];
            }
            return this._getHeaderContainer(index, level, currentLevel + headerDepth, headers[i]['childNodes'], root, levelCount);
        }
        i++;
    }
    return null;
};

/**
 * Get the header at a particular index and level for a root
 * @param {number|string} index
 * @param {number|string} level
 * @param {Element} root
 * @param {number} totalLevels
 * @param {number} startIndex for that level
 * @returns {Element|null}
 * @private
 */
DvtDataGrid.prototype._getHeaderByIndex = function(index, level, root, totalLevels, startIndex)
{
    var relativeIndex, headerContent, headerContainer, start;
    if (level < 0)
    {
        return null;
    }
    // if there is only one level just get the header by index in the row ehader
    if (totalLevels === 1)
    {
        headerContent = root['firstChild']['childNodes'];
        relativeIndex = index - startIndex;
        return headerContent[relativeIndex];
    }
    // otherwise get the column header container
    headerContainer = this._getHeaderContainer(index, level, 0, null, root, totalLevels);
    if (headerContainer == null)
    {
        return null;
    }

    if (level <= (this._getAttribute(headerContainer, 'level', true) + this._getAttribute(headerContainer['firstChild'], 'depth', true) - 1))
    {
        return headerContainer['firstChild'];
    }

    // if the innermost level then get the child of the container at the index
    start = this._getAttribute(headerContainer, 'start', true);
    relativeIndex = index - start + 1;
    return headerContainer['childNodes'][relativeIndex];
};

/**
 * Get the column header height at a particulat level, which will be cached if set once at that level
 * This permits the user to set the level height on the first column header at that height using renderers.
 * If it is not cached get the height
 * @param {number} level the level to get the height of
 * @param {Element} element the column header to get the height of if not cached
 * @returns {number} the height of that level
 * @private
 */
DvtDataGrid.prototype._getColumnHeaderLevelHeight = function(level, element)
{
    var height;
    if (this.m_columnHeaderLevelHeights == null)
    {
        this.m_columnHeaderLevelHeights = [];
    }

    height = this.m_columnHeaderLevelHeights[level];
    if (height != null)
    {
        return height;
    }
    height = this.getElementHeight(element);
    this.m_columnHeaderLevelHeights[level] = height;
    return height;
};

/**
 * Get the attribute value that we have set in our mapping attribute
 * @param {Element} element
 * @param {string} attributeKey
 * @param {boolean} parse
 * @returns {number|string}
 */
DvtDataGrid.prototype._getAttribute = function(element, attributeKey, parse)
{
    var value = element.getAttribute(this.getResources().getMappedAttribute(attributeKey));
    if (parse)
    {
        return parseInt(value, 10);
    }
    return value;
};

/**
 * Set a mapped attribute
 * @param {Element} element
 * @param {string} attributeKey
 * @param {string|number|boolean} value
 */
DvtDataGrid.prototype._setAttribute = function(element, attributeKey, value)
{
    element.setAttribute(this.getResources().getMappedAttribute(attributeKey), value);
};

/**
 * Build the databody, fetching cells as well
 * @return {Element} the root of databody
 */
DvtDataGrid.prototype.buildDatabody = function()
{
    var root, scroller;
    root = document.createElement("div");
    root['id'] = this.createSubId("databody");
    root['className'] = this.getMappedStyle("databody");
    // workaround for mozilla bug 616594, where overflow div would make it focusable    
    root['tabIndex'] = '-1';
    this.m_databody = root;
    if (!root.addEventListener)
    {
        root.attachEvent("onscroll", this.handleScroll.bind(this));
    }
    else
    {
        root.addEventListener("scroll", this.handleScroll.bind(this), false);
    }

    scroller = document.createElement("div");
    scroller['className'] = this.getMappedStyle("scroller") + (this.m_utils.isTouchDevice() ? " " + this.getMappedStyle("scroller-mobile") : "");
    root.appendChild(scroller); //@HTMLUpdateOK          
    
    this.fetchCells(root, 0, 0);

    return root;
};

/**
 * Fetch cells to put in the databody. Calls fetch cells on the data source,
 * setting callbacks for success and failure.
 * @param {Element} databody - the root of the databody element
 * @param {number} rowStart - the row to start fetching at
 * @param {number} colStart - the column to start fetching at
 * @param {number|null=} rowCount - the total number of rows in the data source, if undefined then calculated
 * @param {number|null=} colCount - the total number of columns in the data source, if undefined then calculated
 * @param {Object=} callbacks - specifies success and error callbacks.  If undefined then default callbacks are used
 * @protected
 */
DvtDataGrid.prototype.fetchCells = function(databody, rowStart, colStart, rowCount, colCount, callbacks)
{
    var rowRange, columnRange, successCallback;

    // checks if we are already fetching cells
    if (this.m_fetching['cells'])
    {
        return;
    }

    if (rowCount == null)
    {
        rowCount = this.getFetchSize("row");
    }

    if (colCount == null)
    {
        colCount = this.getFetchSize("column");
    }

    rowRange = {
        "axis": "row", "start": rowStart, "count": rowCount
    };
    columnRange = {
        "axis": "column", "start": colStart, "count": colCount, "databody": databody
    };
    
    this.m_fetching['cells'] = {'rowRange': rowRange, 'columnRange': columnRange};

    // if there is a override success callback specified, use it, otherwise use default one
    if (callbacks != null && callbacks['success'] != null)
    {
        successCallback = callbacks['success'];
    }
    else
    {
        successCallback = this.handleCellsFetchSuccess;
    }

    this.showStatusText();
    // start fetch
    this._signalTaskStart();
    this.getDataSource().fetchCells([rowRange, columnRange], {
        "success": successCallback, "error": this.handleCellsFetchError
    }, {'success': this, 'error': this});
};

/**
 * Checks whether the response matches the current request
 * @param {Object} cellRange the cell range of the response
 * @protected
 */
DvtDataGrid.prototype.isCellFetchResponseValid = function(cellRange)
{
    var responseRowRange, responseColumnRange, requestCellRanges;

    responseRowRange = cellRange[0];
    responseColumnRange = cellRange[1];
    
    requestCellRanges = this.m_fetching['cells'];
    
    // do object reference check, imagine fetching 20 2 consecutive times but 
    // the data changed in bewteeen and we accidentally accept the first because 
    // the counts are the same
    return (responseRowRange == requestCellRanges['rowRange'] && responseColumnRange == requestCellRanges['columnRange']);
};

/**
 * Returns true if this is a long scroll (or initial scroll)
 * @return {boolean} true if it is a long or initial scroll, false otherwise
 */
DvtDataGrid.prototype.isLongScroll = function()
{
    return this.m_isLongScroll;
};

/**
 * Checks whether the result is within the current viewport
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 * @private
 */
DvtDataGrid.prototype.isCellFetchResponseInViewport = function(cellSet, cellRange)
{
    var rowRange, rowStart, columnRange, columnStart,  rowReturnVal, columnReturnVal;

    if (isNaN(this.m_avgRowHeight) || isNaN(this.m_avgColWidth) || this.m_empty != null || !this.m_initialized)
    {
        // initial scroll these are not defined so just return true, or if not inited or if no databody
        return true;
    }

    // the goal of this method is to make sure we haven't scrolled further since the last fetch
    // so our request is still valid, we run a massive risk of running loops if our logic is wrong otherwise
    // as in we continue to request the same thing but it is never valid.

    rowRange = cellRange[0];
    rowStart = rowRange['start'];

    columnRange = cellRange[1];
    columnStart = columnRange['start'];

    rowReturnVal = this._getLongScrollStart(this.m_currentScrollTop, this.m_prevScrollTop, 'row');
    columnReturnVal = this._getLongScrollStart(this.m_currentScrollLeft, this.m_prevScrollLeft, 'column');

    // return true if the viewport fits inside the fetched range
    return (rowReturnVal['start'] == rowStart && columnReturnVal['start'] == columnStart);
};

/**
 * Handle a successful call to the data source fetchCells. Create new row and
 * cell DOM elements when necessary and then insert them into the databody.
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":}]
 * @param {boolean=} rowInsert - if this is triggered by a row insert event
 * @protected
 */
DvtDataGrid.prototype.handleCellsFetchSuccess = function(cellSet, cellRange, rowInsert)
{
    var totalRowCount, totalColumnCount, defaultHeight, rowRange, rowStart, rowCount,
            rowRangeNeedsUpdate, columnRange, columnStart, columnCount, columnRangeNeedsUpdate,
            databody, top, referenceRow, databodyContent, cleanDirection,
            isAppend, fragment, totalRowHeight, i, avgHeight, avgWidth, duration, self,
            rows, prev, addResult;
    totalRowCount = this.getDataSource().getCount("row");
    totalColumnCount = this.getDataSource().getCount("column");

    self = this;
    duration = DvtDataGrid.EXPAND_ANIMATION_DURATION;

    // if rowInsert is specified we can skip a couple of checks
    if (rowInsert === undefined)
    {
        rowInsert = false;

        // checks whether result matches what we requested
        if (!this.isCellFetchResponseValid(cellRange))
        {
            // end fetch
            this._signalTaskEnd();
            // ignore result if it is not valid
            return;
        }

        // checks if the response covers the viewport or the headers were invalid
        if (this.isLongScroll() && (!this.isCellFetchResponseInViewport(cellSet, cellRange) || this.m_headerInvalid))
        {
            // clear cells fetching flag
            this.m_fetching['cells'] = false;
            this.m_headerInvalid = false;

            // ignore the response and fetch another set for the current viewport
            this.handleLongScroll(this.m_currentScrollLeft, this.m_currentScrollTop);
            
            // end fetch
            this._signalTaskEnd();
            return;
        }
        else
        {
            this.m_isLongScroll = false;            
        }
    }

    defaultHeight = this.getDefaultRowHeight();

    rowRange = cellRange[0];
    rowStart = rowRange['start'];
    rowCount = cellSet.getCount("row");

    // for short fetch it would be equal for long fetch it would be > (bottom) or < (top)
    rowRangeNeedsUpdate = rowCount > 0 && (rowStart > this.m_endRow || rowStart + rowCount <= this.m_startRow);

    // if no results returned and count is unknown, flag it so we won't try to fetch again
    // OR if highwater mark scrolling is used and count is known and we have reach the last row, stop fetching
    // OR if result set is less than what's requested, then assumes we have fetched the last row
    if ((rowCount == 0 && this._isCountUnknown('row') && rowRange['count'] > 0) ||
            (rowRangeNeedsUpdate && this._isHighWatermarkScrolling() && !this._isCountUnknown('row') && (this.m_endRow + rowCount + 1 >= totalRowCount)) ||
            (rowCount < rowRange['count']))
    {
        this.m_stopRowFetch = true;
    }

    columnRange = cellRange[1];
    columnStart = columnRange['start'];
    columnCount = cellSet.getCount("column");

    columnRangeNeedsUpdate = columnCount > 0 && (columnStart > this.m_endCol || columnStart + columnCount == this.m_startCol);

    // if no results returned and count is unknown, flag it so we won't try to fetch again
    // OR if highwater mark scrolling is used and count is known and we have reach the last column, stop fetching
    // OR if result set is less than what's requested, then assumes we have fetched the last column
    if ((columnCount == 0 && this._isCountUnknown('column') && columnRange['count'] > 0) ||
            (columnRangeNeedsUpdate && this._isHighWatermarkScrolling() && !this._isCountUnknown('column') && (this.m_endCol + columnCount + 1 >= totalColumnCount)) ||
            (columnCount < columnRange['count']))
    {
        this.m_stopColumnFetch = true;
    }

    databody = this.m_databody;
    if (databody == null)
    {
        // try to search for it in the param
        databody = columnRange['databody'];
    }

    databodyContent = databody['firstChild'];

    // if these are new rows (append or insert in the middle)
    if (rowRangeNeedsUpdate || rowInsert)
    {
        // whether this is adding rows to bottom (append) or top (insert)
        isAppend = !rowInsert && rowStart >= this.m_startRow ? true : false;

        if (isAppend)
        {
            referenceRow = databodyContent['childNodes'][rowStart - this.m_startRow];
            top = this.m_endRowPixel;
        }
        else
        {
            if (rowInsert)
            {
                referenceRow = databodyContent['childNodes'][rowStart - this.m_startRow];
                top = this.getElementDir(referenceRow, 'top');
            }
            else
            {
                top = this.m_startRowPixel;
            }
        }

        fragment = document.createDocumentFragment();
        addResult = this._addRows(fragment, (isAppend || rowInsert), top, rowStart, rowCount, columnStart, columnRangeNeedsUpdate, cellSet);
        totalRowHeight = addResult['totalRowHeight'];
        avgWidth = addResult['avgWidth'];
        avgHeight = totalRowHeight / rowCount;

        if (isAppend)
        {
            databodyContent.appendChild(fragment); //@HTMLUpdateOK
            // make sure there is a bottom border if adding a row to the bottom
            if (this.m_endRow != -1 && rowCount != 0)
            {
                //get the previous last row
                prev = databodyContent['childNodes'][this.m_endRow - this.m_startRow];
                if (prev != null)
                {
                    prev = prev['childNodes'];
                    for (i = 0; i < prev.length; i += 1)
                    {
                        this.m_utils.removeCSSClassName(prev, this.getMappedStyle('borderHorizontalNone'));
                    }
                }
            }
            // update row range info if neccessary
            this.m_endRow = rowStart + rowCount - 1;
            this.m_endRowPixel = this.m_endRowPixel + totalRowHeight;
        }
        else if (rowInsert)
        {
            // find the row in which the new row will be inserted
            databodyContent.insertBefore(fragment, referenceRow); //@HTMLUpdateOK

            // update row range info if neccessary
            if (rowStart < this.m_startRow)
            {
                // added in the middle
                this.m_startRow = rowStart;
                this.m_startRowPixel = Math.max(0, this.m_startRowPixel - totalRowHeight);
            }
            //update the endRow and endRowPixel no matter where we insert
            this.m_endRow = this.m_endRow + rowCount;
            this.m_endRowPixel = this.m_endRowPixel + totalRowHeight;
            this.pushRowsDown(referenceRow, totalRowHeight);
        }
        else
        {
            databodyContent.insertBefore(fragment, databodyContent['firstChild']); //@HTMLUpdateOK

            // update row range info if neccessary
            this.m_startRow = this.m_startRow - rowCount;
            // zero maximum is handled by realigning
            this.m_startRowPixel = this.m_startRowPixel - totalRowHeight;
        }
    }
    else if (columnRangeNeedsUpdate)
    {
        // no new rows, but new columns
        rows = databodyContent['childNodes'];
        // assert number of rows is the same as what's in the databody
        if (rowCount == rows.length)
        {
            avgWidth = this._addColumns(rows, rowStart, rowCount, columnStart, cellSet);
        }
    }
            
    // added to only do this on initialization
    // check to see if the average width and height has change and update the canvas and the scroller accordingly
    if (avgWidth != undefined && (this.m_avgColWidth == 0 || this.m_avgColWidth == undefined))
    {
        // the average column width should only be set once, it will only change when the column width varies between columns, but
        // in such case the new average column width would not be any more precise than previous one.
        this.m_avgColWidth = avgWidth;
    }

    if (avgHeight != undefined && (this.m_avgRowHeight == 0 || this.m_avgRowHeight == undefined))
    {
        // the average row height should only be set once, it will only change when the row height varies between rows, but
        // in such case the new average row height would not be any more precise than previous one.
        this.m_avgRowHeight = avgHeight;
    }

    this._sizeDatabodyScroller();

    // update column range info if neccessary
    if (columnRangeNeedsUpdate)
    {
        // add to left or to right
        if (columnStart < this.m_startCol)
        {
            this.m_startCol = this.m_startCol - columnCount;
        }
        else
        {
            //in virtual fetch end should always be set to last
            this.m_endCol = columnStart + columnCount - 1;
        }
    }
    
    if (this.m_endCol >= 0 && this.m_endRow >= 0)
    {
        this.m_hasCells = true;
    }    

    // if virtual scrolling we may need to adjust when the user hits the beginning
    if (this.m_startCol == 0 && this.m_startColPixel != 0)
    {
        this._shiftCellsInRows(-1 * this.m_startColPixel, false, null, 0, this.m_endCol, null, this.getResources().isRTLMode() ? "right" : "left")
        this.m_startColPixel = 0;
    }
    if (this.m_startRow == 0 && this.m_startRowPixel != 0)
    {
        this.pushRowsDown(this.m_databody['firstChild']['firstChild'], -this.m_startRowPixel);
        this.m_startRowPixel = 0;
    }

    // fetch is done
    this.m_fetching['cells'] = false;
    if (this.m_initialized)
    {
        // check if we need to sync header and databody scroll position
        this._syncScroller();
    }

    // size the grid if fetch is done
    if (this.isFetchComplete())
    {
        this.hideStatusText();

        // highlight focus cell or header if specified
        if (this.m_scrollIndexAfterFetch != null)
        {
            this.scrollToIndex(this.m_scrollIndexAfterFetch);
            //wait for the scroll event to be fired to avoid using cell.focus() to bring into view, the case where it's in the viewport but hasn't been scrolled to yet
        }
        else if (this.m_scrollHeaderAfterFetch != null)
        {
            // if the there is a header that needs to be scrolled to after fetch scroll to the header
            this.scrollToHeader(this.m_scrollHeaderAfterFetch);
        }
        else if (!this.isActionableMode() && this._getActiveElement() != null && !this.m_utils.containsCSSClassName(this._getActiveElement(), this.getMappedStyle('focus')))
        {
            //highliht the active cell if we are virtualized scroll and scrolled away from the active and came back
            //also on a move event insert this will preserve the active cell
            this.m_shouldFocus = false;            
            this._highlightActive();
        }

        // apply current selection range to newly fetched cells
        // this is more efficient than looping over ranges when rendering cell
        if (this._isSelectionEnabled())
        {
            this.applySelection(rowStart, rowStart + rowCount, columnStart, columnStart + columnCount);
        }

        // update accessibility info
        this.populateAccInfo();

        // force bitmap (to GPU) to be generated now rather than when doing actual 3d translation to minimize
        // the delay
        if (this.m_utils.isTouchDevice() && window.hasOwnProperty('WebKitCSSMatrix'))
        {
            databody.style.webkitTransform = "translate3d(0, 0, 0)";
            if (this.m_rowHeader != null)
            {
                this.m_rowHeader.style.webkitTransform = "translate3d(0, 0, 0)";
            }
            if (this.m_colHeader != null)
            {
                this.m_colHeader.style.webkitTransform = "translate3d(0, 0, 0)";
            }
            if (this.m_rowEndHeader != null)
            {
                this.m_rowEndHeader.style.webkitTransform = "translate3d(0, 0, 0)";
        }
            if (this.m_colEndHeader != null)
            {
                this.m_colEndHeader.style.webkitTransform = "translate3d(0, 0, 0)";
            }
        }

        // initialize/resize/fillViewport/trigger ready event
        if (this._shouldInitialize())
        {
            this._handleInitialization(true);
        }
        else if (this.m_initialized)
        {
            if (this.m_resizeRequired == true ||
                    //the case where a delete brought down the size of the databody and the fillViewport made it larger than the scroller again
                        // also the case when a resize of the entire grid made the databody bigger than it was before
                        (this.m_endRowHeaderPixel > this.getElementHeight(databody) && (this.getHeight() - this.getElementHeight(this.m_colHeader) - this.getElementHeight(this.m_colEndHeader)) > this.getElementHeight(databody)) ||
                        (this.m_endColHeaderPixel > this.getElementWidth(databody) && (this.getWidth() - this.getElementWidth(this.m_rowHeader) - this.getElementWidth(this.m_rowEndHeader)) > this.getElementWidth(databody)))
            {
                this.resizeGrid();
            }
            
            // clean up rows outside of viewport (for non-highwatermark scrolling only)
            if (rowRangeNeedsUpdate)
            {
                if (isAppend)
                {
                    cleanDirection = 'top';
                }
                else if (!rowInsert)
                {
                    cleanDirection = 'bottom';                    
                }
            }
            else if (columnRangeNeedsUpdate)
            {
                // add to left or to right
                if (columnStart == this.m_startCol)
                {
                    cleanDirection = 'right';
                }
                else
                {
                    cleanDirection = 'left';                    
                }
            }            
            this._cleanupViewport(cleanDirection);        
            
            this.fillViewport();
            if (this.isFetchComplete())
            {
                this.fireEvent('ready', {});
            }
        }
    }

    // end fetch
    this._signalTaskEnd();
    //this.dumpRanges();
};

/**
 * Insert rows with animation.
 * @param {DocumentFragment|undefined} rowFragment
 * @param {DocumentFragment|undefined} rowHeaderFragment
 * @param {number} rowStart the starting row index
 * @private
 */
DvtDataGrid.prototype._insertRowsWithAnimation = function(rowFragment, rowHeaderFragment, rowEndHeaderFragment, rowStart, totalRowHeight)
{
    var self, isAppend, databodyContent, rowHeaderSupport, rowHeaderContent, referenceRow, referenceRowHeader, referenceRowTop,
            insertStartPixel, i, row, rowHeader, newTop, deltaY, lastAnimatedElement, transitionListener, rowEndHeaderSupport, rowEndHeaderContent,
            referenceRowEndHeader, rowEndHeader, duration;

    self = this;
    // animation start
    self._signalTaskStart();
    isAppend = rowStart > this.m_endRow;
    databodyContent = this.m_databody['firstChild'];
    rowHeaderSupport = rowHeaderFragment == null ? false : true;
    rowEndHeaderSupport = rowEndHeaderFragment == null ? false : true;

    // row to be inserted after is the reference row
    referenceRow = databodyContent['childNodes'][rowStart - this.m_startRow - 1];
    referenceRowTop = this.getElementDir(referenceRow, 'top');
    insertStartPixel = referenceRowTop + this.getElementHeight(referenceRow);
    this.changeStyleProperty(referenceRow, this.getCssSupport('z-index'), 10);

    if (rowHeaderSupport)
    {
        rowHeaderContent = this.m_rowHeader['firstChild'];
        referenceRowHeader = rowHeaderContent['childNodes'][rowStart - this.m_startRow - 1];
        this.changeStyleProperty(referenceRowHeader, this.getCssSupport('z-index'), 10);
    }

    if (rowEndHeaderSupport)
    {
        rowEndHeaderContent = this.m_rowEndHeader['firstChild'];
        referenceRowEndHeader = rowEndHeaderContent['childNodes'][rowStart - this.m_startRow - 1];
        this.changeStyleProperty(referenceRowEndHeader, this.getCssSupport('z-index'), 10);
    }

    // loop over the fragment and assign proper top values to the fragment and then hide them
    // with transform behind the reference row
    for (i = 0; i < rowFragment.childNodes.length; i++)
    {
        row = rowFragment.childNodes[i];
        newTop = insertStartPixel + this.getElementDir(row, 'top');
        deltaY = referenceRowTop - newTop;

        // move row to actual new position
        this.setElementDir(row, newTop, 'top');

        // move row to behind reference row
        this.addTransformMoveStyle(row, 0, 0, 'linear', 0, deltaY, 0);

        if (rowHeaderSupport)
        {
            rowHeader = rowHeaderFragment.childNodes[i];
            this.setElementDir(rowHeader, newTop, 'top');
            this.addTransformMoveStyle(rowHeader, 0, 0, 'linear', 0, deltaY, 0);
        }
        if (rowEndHeaderSupport)
        {
            rowEndHeader = rowEndHeaderFragment.childNodes[i];
            this.setElementDir(rowEndHeader, newTop, 'top');
            this.addTransformMoveStyle(rowEndHeader, 0, 0, 'linear', 0, deltaY, 0);
        }
    }

    // loop over the row after the insert point, assign new top values, but keep
    // them where they are using transforms
    for (i = rowStart - this.m_startRow; i < databodyContent.childNodes.length; i++)
    {
        row = databodyContent.childNodes[i];
        newTop = totalRowHeight + this.getElementDir(row, 'top');
        deltaY = -totalRowHeight;

        // move row to actual new position
        this.setElementDir(row, newTop, 'top');

        // move row to original position
        this.addTransformMoveStyle(row, 0, 0, 'linear', 0, deltaY, 0);

        if (rowHeaderSupport)
        {
            rowHeader = rowHeaderContent.childNodes[i];
            this.setElementDir(rowHeader, newTop, 'top');
            this.addTransformMoveStyle(rowHeader, 0, 0, 'linear', 0, deltaY, 0);
        }
        if (rowEndHeaderSupport)
        {
            rowEndHeader = rowEndHeaderContent.childNodes[i];
            this.setElementDir(rowEndHeader, newTop, 'top');
            this.addTransformMoveStyle(rowEndHeader, 0, 0, 'linear', 0, deltaY, 0);
        }
    }

    // need to resize first in order to ensure visible region is big enough to handle new rows
    this.m_endRow += rowFragment.childNodes.length;
    this.m_endRowPixel += totalRowHeight;
    if (rowHeaderSupport)
    {
        this.m_endRowHeader += rowHeaderFragment.childNodes.length;
        this.m_endRowHeaderPixel += totalRowHeight;
    }
    if (rowEndHeaderSupport)
    {
        this.m_endRowEndHeader += rowHeaderFragment.childNodes.length;
        this.m_endRowEndHeaderPixel += totalRowHeight;
    }

    // find the row in which the new rows will be inserted and insert
    if (isAppend)
    {
        databodyContent.appendChild(rowFragment); //@HTMLUpdateOK
        if (rowHeaderSupport)
        {
            rowHeaderContent.appendChild(rowHeaderFragment); //@HTMLUpdateOK
        }
        if (rowEndHeaderSupport)
        {
            rowEndHeaderContent.appendChild(rowEndHeaderFragment); //@HTMLUpdateOK
        }
    }
    else
    {
        databodyContent.insertBefore(rowFragment, referenceRow['nextSibling']); //@HTMLUpdateOK
        if (rowHeaderSupport)
        {
            rowHeaderContent.insertBefore(rowHeaderFragment, referenceRowHeader['nextSibling']); //@HTMLUpdateOK
        }
        if (rowEndHeaderSupport)
        {
            rowEndHeaderContent.insertBefore(rowEndHeaderFragment, referenceRowEndHeader['nextSibling']); //@HTMLUpdateOK
        }
    }
    this.setElementHeight(databodyContent, this.m_endRowPixel - this.m_startRowPixel);
    this.resizeGrid();    
    this.updateRowBanding();

    lastAnimatedElement = databodyContent['lastChild'];
    transitionListener = function()
    {
        self._handleAnimationEnd();
        lastAnimatedElement.removeEventListener('transitionend', transitionListener, false);
    };

    lastAnimatedElement.addEventListener('transitionend', transitionListener, false);

    this.m_animating = true;

    // must grab duration outside of timeout otherwise processingEventQueue flag would have been reset already
    // note we set the animation duration to 1 instead of 0 because some browsers don't invoke transition end listener if duration is 0
    duration = self.m_processingEventQueue ? 1 : DvtDataGrid.EXPAND_ANIMATION_DURATION;
    setTimeout(function()
    {
        var i, timing;
        duration = DvtDataGrid.EXPAND_ANIMATION_DURATION;
        timing = 'ease-out';
        //add animation rules to the inserted rows
        for (i = databodyContent.childNodes.length - 1; i >= rowStart - self.m_startRow; i--)
        {
            self.addTransformMoveStyle(databodyContent.childNodes[i], duration + "ms", 0, timing, 0, 0, 0);
            if (rowHeaderSupport)
            {
                self.addTransformMoveStyle(rowHeaderContent.childNodes[i], duration + "ms", 0, timing, 0, 0, 0);
            }
            if (rowEndHeaderSupport)
            {
                self.addTransformMoveStyle(rowEndHeaderContent.childNodes[i], duration + "ms", 0, timing, 0, 0, 0);
            }
        }
    }, 0);
};

/**
 * Add columns to existing rows.
 * @param {Array} rows an array of existing row elements
 * @param {number} rowStart the start row index of the cell set
 * @param {number} rowCount the row count of the cell set
 * @param {number} columnStart the start row index of the cell set
 * @param {Object} cellSet the result cell set from fetch operation
 * @return {number} the average width of the columns
 * @private
 */
DvtDataGrid.prototype._addColumns = function(rows, rowStart, rowCount, columnStart, cellSet)
{
    var renderer, columnBandingInterval, horizontalGridlines, verticalGridlines, row, avgWidth, i, returnVal;

    renderer = this.m_options.getRenderer("cell");
    columnBandingInterval = this.m_options.getColumnBandingInterval();
    horizontalGridlines = this.m_options.getHorizontalGridlines();
    verticalGridlines = this.m_options.getVerticalGridlines();

    for (i = 0; i < rowCount; i += 1)
    {
        row = rows[i];

        // add the cells into existing row
        returnVal = this.addCellsToRow(cellSet, row, rowStart + i, renderer, false, columnStart, (i == rowCount - 1), columnBandingInterval, horizontalGridlines, verticalGridlines);
        avgWidth = returnVal['avgWidth'];
    }

    return avgWidth;
};

/**
 * Add rows to the specified document element.
 * @param {DocumentFragment} fragment the element in which the rows are added to
 * @param {boolean} isAppendOrInsert true if this is insert row to bottom or in the middle
 * @param {number} top the top pixel position of the first row to be add
 * @param {number} rowStart the start row index of the cell set
 * @param {number} rowCount the row count of the cell set
 * @param {number} columnStart the start row index of the cell set
 * @param {boolean} columnRangeNeedsUpdate true if column range needs update, false otherwise
 * @param {Object} cellSet the result cell set from fetch operation
 * @return {Object}
 * @private
 */
DvtDataGrid.prototype._addRows = function(fragment, isAppendOrInsert, top, rowStart, rowCount, columnStart, columnRangeNeedsUpdate, cellSet)
{
    var renderer, columnBandingInterval, rowBandingInterval, horizontalGridlines, verticalGridlines, row,
            avgWidth, totalRowHeight, index, height, i, returnVal;

    renderer = this.m_options.getRenderer("cell");
    columnBandingInterval = this.m_options.getColumnBandingInterval();
    rowBandingInterval = this.m_options.getRowBandingInterval();
    horizontalGridlines = this.m_options.getHorizontalGridlines();
    verticalGridlines = this.m_options.getVerticalGridlines();

    totalRowHeight = 0;
    for (i = 0; i < rowCount; i += 1)
    {
        if (isAppendOrInsert)
        {
            index = rowStart + i;
        }
        else
        {
            index = rowStart + (rowCount - 1 - i);
        }
        row = document.createElement("div");
        row['className'] = this.getMappedStyle("row");
        if ((Math.floor(index / rowBandingInterval) % 2 === 1))
        {
            row['className'] += " " + this.getMappedStyle("banded");
        }
        this.m_root.appendChild(row); //@HTMLUpdateOK

        // add the cells into the new row
        returnVal = this.addCellsToRow(cellSet, row, index, renderer, true, columnStart, (i == rowCount - 1 && columnRangeNeedsUpdate), columnBandingInterval, horizontalGridlines, verticalGridlines, top);

        avgWidth = returnVal['avgWidth'];
        height = returnVal['height'];
        totalRowHeight = totalRowHeight + height;

        if (isAppendOrInsert)
        {
            row['style']['top'] = top + 'px';
            top = top + height;
            fragment.appendChild(row); //@HTMLUpdateOK
        }
        else
        {
            top = top - height;
            row['style']['top'] = top + 'px';
            fragment.insertBefore(row, fragment['firstChild']); //@HTMLUpdateOK
        }
    }

    return {"avgWidth": avgWidth, "totalRowHeight": totalRowHeight, "top": top};
};

/**
 * Push the row and all of its next siblings down.
 * @param {Element} row the starting row to push down.
 * @param {number} adjustment the amount in pixel to push down.
 * @private
 */
DvtDataGrid.prototype.pushRowsDown = function(row, adjustment)
{
    while (row)
    {
        var top = this.getElementDir(row, 'top') + adjustment;
        row['style']['top'] = top + 'px';
        row = row['nextSibling'];
    }
};

/**
 * Push the row header and all of its next siblings up.
 * @param {Element} row the starting row to push up.
 * @param {number} adjustment the amount in pixel to push up.
 * @private
 */
DvtDataGrid.prototype.pushRowsUp = function(row, adjustment)
{
    this.pushRowsDown(row, -adjustment);
};

/**
 * Push the row header and all of its next siblings down.
 * @param {Element} rowHeader the starting rowHeader to push down.
 * @param {number} adjustment the amount in pixel to push down.
 * @private
 */
DvtDataGrid.prototype.pushRowHeadersDown = function(rowHeader, adjustment)
{
    while (rowHeader)
    {
        var top = this.getElementDir(rowHeader, 'top') + adjustment;
        rowHeader['style']['top'] = top + 'px';
        rowHeader = rowHeader['nextSibling'];
    }
};

/**
 * Push the row and all of its next siblings up.
 * @param {Element} rowHeader the starting rowHeader to push up.
 * @param {number} adjustment the amount in pixel to push up.
 * @private
 */
DvtDataGrid.prototype.pushRowHeadersUp = function(rowHeader, adjustment)
{
    this.pushRowsDown(rowHeader, -adjustment);
};

/**
 * Build a cell context object for a cell and return it
 * @param {Object} indexes - the row and column index of the cell
 * @param {Object} data - the data the cell contains
 * @param {Object} metadata - the metadata the cell contains
 * @param {Element} elem - the cell element
 * @return {Object} the cell context object, keys of {indexes,data,keys,datagrid}
 */
DvtDataGrid.prototype.createCellContext = function(indexes, data, metadata, elem)
{
    var cellContext, prop;

    cellContext = {};
    
    //set the parent to the cell content div
    cellContext['parentElement'] = elem['firstChild'];
    cellContext['indexes'] = indexes;
    cellContext['cell'] = data;
    cellContext['data'] = (data != null && typeof data === 'object' && data.hasOwnProperty('data')) ? data['data']:data;
    cellContext['component'] = this;
    cellContext['datasource'] = this.getDataSource();
    cellContext['mode'] = 'navigation';

    // merge properties from metadata into cell context
    // the properties in metadata would have precedence
    for (prop in metadata)
    {
        if (metadata.hasOwnProperty(prop))
        {
            cellContext[prop] = metadata[prop];
        }
    }

    // invoke callback to allow ojDataGrid to change datagrid reference
    if (this.m_createContextCallback != null)
    {
        this.m_createContextCallback.call(this, cellContext);
    }

    return cellContext;
};

/**
 * Creates the cell id from the keys
 * @param {Object} keys the row and colunmn key of the cell
 * @private
 */
DvtDataGrid.prototype._createCellId = function(keys)
{
    return this.createSubId('r' + keys['row'] + 'c' + keys['column']);
};

/**
 * Creates the header id from the axis and key
 * @param {string} axis row/column
 * @param {string} key the header key
 * @private
 */
DvtDataGrid.prototype._createHeaderId = function(axis, key)
{
    var prefix;
    if (axis == 'columnEnd')
    {
        prefix = 'ce';
    }
    else if (axis == 'rowEnd')
    {
        prefix = 're';
    }
    else
    {
        prefix = axis.charAt(0);
    }
    return this.createSubId(prefix + key);
};

/**
 * Creates the cell element
 * @param {Object} metadata the metadata for the cell
 * @protected
 */
DvtDataGrid.prototype.createCellElement = function(metadata)
{
    return document.createElement("div");
};

/**
 * Gets the width of the row header
 * @return {number} the width of the row header in pixel.
 * @protected
 */
DvtDataGrid.prototype.getRowHeaderWidth = function()
{
    if (this.m_endRowHeader === -1)
    {
        // check if there's no row header
        return 0;
    }
    return this.m_rowHeaderWidth;
};

/**
 * Gets the height of the column header
 * @return {number} the height of the column header in pixel.
 * @protected
 */
DvtDataGrid.prototype.getColumnHeaderHeight = function()
{
    if (this.m_endColHeader === -1)
    {
        // check if there's no column header
        return 0;
    }
    return this.m_colHeaderHeight;
};

/**
 * Gets the width of the row end header
 * @return {number} the width of the row end header in pixel.
 * @protected
 */
DvtDataGrid.prototype.getRowEndHeaderWidth = function()
{
    if (this.m_endRowEndHeader === -1)
    {
        // check if there's no row header
        return 0;
    }
    return this.m_rowEndHeaderWidth;
};

/**
 * Gets the height of the column end header
 * @return {number} the height of the column end header in pixel.
 * @protected
 */
DvtDataGrid.prototype.getColumnEndHeaderHeight = function()
{
    if (this.m_endColEndHeader === -1)
    {
        // check if there's no column header
        return 0;
    }
    return this.m_colEndHeaderHeight;
};

/**
 * Gets the bottom value relative to the datagrid in pixel.
 * @param {Element} row the row element
 * @param {number|undefined|null} bottom the bottom value in pixel relative to the databody
 * @return {number} the bottom value relative to the datagrid in pixels.
 * @private
 */
DvtDataGrid.prototype.getRowBottom = function(row, bottom)
{
    var colHeaderHeight, top, height;

    // gets the height of the column header, if any
    colHeaderHeight = this.getColumnHeaderHeight();
    // if a bottom value is specified use that
    if (bottom != null)
    {
        return colHeaderHeight + bottom;
    }
    else
    {
        // otherwise try find it from the row element
        top = this.getElementDir(row, 'top');
        height = this.calculateRowHeight(row);
        if (!isNaN(top) && !isNaN(height))
        {
            return colHeaderHeight + top + height;
        }
    }

    return colHeaderHeight;
};

/**
 * Adds cells to a row. Iterate over the cells passed in, create new div elements
 * for them settign appropriate styles, and append or prepend them to the row based on the start column.
 * @param {Object} cellSet - the result set of cell data
 * @param {Element} row - the row element to add cells to
 * @param {number} rowIndex - the index of the row element
 * @param {function(Object)} renderer - the cell renderer
 * @param {boolean} isRowFetch - true if we fetched this row
 * @param {number} columnStart - the index to start start adding at
 * @param {boolean} updateColumnRangeInfo - true if we want to return average width
 * @param {number} columnBandingInterval - the column banding interval
 * @param {string=} horizontalGridlines - true if horizontal lines visible
 * @param {string=} verticalGridlines - true if vertical lines visible
 * @param {number=} bottom - the bottom of the last row in databody in pixels
 * @return {Object} an object containing avgWidth if updateColumnRange is true and height of the row
 */
DvtDataGrid.prototype.addCellsToRow = function(cellSet, row, rowIndex, renderer, isRowFetch, columnStart, updateColumnRangeInfo, columnBandingInterval, horizontalGridlines, verticalGridlines, bottom)
{
    var isAppend, cellContent, firstColumn, inlineStyleClass, cellStyleClass, currentLeft, dir, totalWidth, columnCount, indexes,
            cellData, cellMetadata, cellContext, j, cell, inlineStyle, width, columnIndex, selectionAffordanceAppend,
            shimHeaderContext, styleClass, height, rowKey, shimHeader;
    // appending columns to the right? todo: > or >=
    isAppend = (columnStart >= this.m_startCol);

    firstColumn = row['firstChild'];

    // if this is new row fetch or not appending column
    if (isRowFetch || !isAppend)
    {
        currentLeft = this.m_startColPixel;
    }
    else
    {
        currentLeft = this.m_endColPixel;
    }

    //if on a  touch device and the row has the selection icons in it, want to insert the cells before the selection affordances (there can be one or two per row)
    if (this.m_utils.isTouchDevice())
    {
        if (this.m_utils.containsCSSClassName(row['lastChild'], this.getMappedStyle('toucharea')))
        {
            if (this.m_utils.containsCSSClassName(row['children'][row['children']['length'] - 2], this.getMappedStyle('toucharea')))
            {
                selectionAffordanceAppend = row['children'][row['children']['length'] - 2];
            }
            else
            {
                selectionAffordanceAppend = row['lastChild'];
            }
        }
    }
    dir = this.getResources().isRTLMode() ? "right" : "left";
    totalWidth = 0;
    columnCount = cellSet.getCount("column");
    for (j = 0; j < columnCount; j += 1)
    {
        if (isAppend || isRowFetch)
        {
            columnIndex = columnStart + j;
        }
        else
        {
            columnIndex = columnStart + (columnCount - 1 - j);
        }

        indexes = {"row": rowIndex, "column": columnIndex};
        cellData = cellSet.getData(indexes);
        cellMetadata = cellSet.getMetadata(indexes);

        cell = this.createCellElement(cellMetadata);
        cell.setAttribute("tabIndex", -1);

        cellContent = document.createElement("div");
        cellContent['className'] = this.getMappedStyle("cellcontent");
        cell.appendChild(cellContent); //@HTMLUpdateOK

        cellContext = this.createCellContext(indexes, cellData, cellMetadata, cell);
        cell['id'] = this._createCellId(cellContext['keys']);
        cell[this.getResources().getMappedAttribute('context')] = cellContext;

        // on initial render of the row, cache the row key and the height of the row
        if (this._getKey(row) == null)
        {
            rowKey = cellContext['keys']['row'];
            this._setKey(row, rowKey);

            //if there's no headers, check to make sure we get the row height correct,
            //by getting it from the row header options, should happen once per row
            if (this.m_endRowHeader == -1)
            {
                shimHeaderContext = this.createHeaderContext('row', rowIndex, null, {'key': rowKey}, null, 0, 0, 1);
                inlineStyle = this.m_options.getInlineStyle('row', shimHeaderContext);
                styleClass = this.m_options.getStyleClass('row', shimHeaderContext);
                shimHeader = document.createElement('div');
                shimHeader['style']['cssText'] = inlineStyle;
                shimHeader['className'] = this.getMappedStyle('row') + ' ' + styleClass;
                //sets height in the sizing manager if necessary
                height = this._getHeaderDimension(shimHeader, rowKey, 'row', 'height');
            }
            else
            {
                height = this._getHeaderDimension(row, rowKey, 'row', 'height');
            }
            // set the px height on the row regardless of unit type currently on it
            this.setElementHeight(row, height);
        }

        //before setting our own styles, else we will overwrite them
        inlineStyle = this.m_options.getInlineStyle("cell", cellContext);
        if (inlineStyle != null)
        {
            cell['style']['cssText'] = inlineStyle;
        }

        //don't want developer setting height or width through inline styles on cell
        //should be done through header styles, or through the stylesheet
        if (cell['style']['height'] != '')
        {
            cell['style']['height'] = '';
        }
        if (cell['style']['width'] != '')
        {
            cell['style']['width'] = '';
        }

        //determine if the newly fetched row should be banded
        if ((Math.floor(columnIndex / columnBandingInterval) % 2 === 1))
        {
            cellStyleClass = this.getMappedStyle("cell") + " " + this.getMappedStyle("banded") + " " + this.getMappedStyle("formcontrol");
        }
        else
        {
            cellStyleClass = this.getMappedStyle("cell") + " " + this.getMappedStyle("formcontrol");
        }
        inlineStyleClass = this.m_options.getStyleClass("cell", cellContext);
        if (inlineStyleClass != null)
        {
            cell['className'] = cellStyleClass + " " + inlineStyleClass;
        }
        else
        {
            cell['className'] = cellStyleClass;
        }

        //use a shim element so that we don't have to manage class name ordering
        //in the case of no headers this gets called everytime, so added rowIndex=0 to make sure it's only the first time
        if (this.m_endColHeader == -1 && rowIndex == 0 && !this.m_initialized)
        {
            shimHeaderContext = this.createHeaderContext('column', columnIndex, null, {'key': cellContext['keys']['column']}, null, 0, 0, 1);
            inlineStyle = this.m_options.getInlineStyle('column', shimHeaderContext);
            styleClass = this.m_options.getStyleClass('column', shimHeaderContext);
            shimHeader = document.createElement('div');
            shimHeader['style']['cssText'] = inlineStyle;
            shimHeader['className'] = this.getMappedStyle('colheadercell') + ' ' + this.getMappedStyle('headercell') + ' ' + styleClass;
            //will set it in the sizing manager so the cells can fetch it
            width = this._getHeaderDimension(shimHeader, cellContext['keys']['column'], 'column', 'width');
        }
        else
        {
            width = this._getHeaderDimension(cell, cellContext['keys']['column'], 'column', 'width');
        }
        // set the px width on the cell regardless of unit type currently on it
        this.setElementWidth(cell, width);

        //do not put borders on far edge column, edge row, turn off gridlines
        if (verticalGridlines === 'hidden' || (this._isLastColumn(columnIndex) && ((this.getRowHeaderWidth() + currentLeft + width >= this.getWidth()) || this.m_endRowEndHeader != -1)))
        {
            this.m_utils.addCSSClassName(cell, this.getMappedStyle('borderVerticalNone'));
        }

        if (horizontalGridlines === 'hidden')
        {
            this.m_utils.addCSSClassName(cell, this.getMappedStyle('borderHorizontalNone'));
        }
        else if (this._isLastRow(rowIndex))
        {
            // bottom is an optional parameter that is the bottom of the previous row
            // add the height of this row (once per row) to get the bottom pixel val
            if (bottom != null && columnIndex == columnStart)
            {
                bottom += this.getElementHeight(row);
            }
            if (this.getRowBottom(row, bottom) >= this.getHeight() || this.m_endColEndHeader != -1)
            {
                this.m_utils.addCSSClassName(cell, this.getMappedStyle('borderHorizontalNone'));
            }
        }

        if (isAppend || isRowFetch)
        {
            this.setElementDir(cell, currentLeft, dir);
        }
        else
        {
            this.setElementDir(cell, currentLeft - width, dir);
        }

        //add cell to live DOM while rendering, row is now in live DOM so do this first
        if (isAppend || isRowFetch)
        {
            //if on a  touch device and the row has the selection icons in it, want do do an insert before
            if (selectionAffordanceAppend)
            {
                row.insertBefore(cell, selectionAffordanceAppend); //@HTMLUpdateOK
                currentLeft = currentLeft + width;
            }
            else
            {
                row.appendChild(cell); //@HTMLUpdateOK
                currentLeft = currentLeft + width;
            }
        }
        else
        {
            row.insertBefore(cell, firstColumn); //@HTMLUpdateOK
            firstColumn = cell;
            currentLeft = currentLeft - width;
        }
        
        this._renderContent(renderer, cellContext, cellContent, cellData, this.getMappedStyle("celltext"));

        // update column range info if neccessary
        if (updateColumnRangeInfo)
        {
            if (isAppend || isRowFetch)
            {
                this.m_endColPixel = this.m_endColPixel + width;
            }
            else
            {
                this.m_startColPixel = this.m_startColPixel - width;
            }
            totalWidth = totalWidth + width;
        }
    }

    if (updateColumnRangeInfo && columnCount > 0)
    {
        return {'avgWidth': (totalWidth / columnCount), 'height': height};
    }
    return {'avgWidth': null, 'height': height};
};

/**
 * Handle an unsuccessful call to the data source fetchCells
 * @param {Error} errorStatus - the error returned from the data source
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 */
DvtDataGrid.prototype.handleCellsFetchError = function(errorStatus, cellRange)
{
    var rowRange, columnRange;

    // remove fetch message
    this.m_fetching['cells'] = false;

    // hide status message
    this.hideStatusText();

    // update datagrid in responds to failed fetch
    if (this.m_databody['firstChild'] == null)
    {
        // if it's initial fetch, then show no data
        if (this._shouldInitialize())
        {
            this._handleInitialization(true);
        }
    }
    else
    {
        // failed while fetching more data.  stop any future fetching
        rowRange = cellRange[0];
        columnRange = cellRange[1];

        if (columnRange['start'] + columnRange['count'] - 1 > this.m_endCol)
        {
            this.m_stopColumnFetch = true;
            // stop header fetch as well
            this.m_stopColumnHeaderFetch = true;
            this.m_stopColumnEndHeaderFetch = true;            
        }

        if (rowRange['start'] + rowRange['count'] - 1 > this.m_endRow)
        {
            this.m_stopRowFetch = true;
            // stop header fetch as well
            this.m_stopRowHeaderFetch = true;
            this.m_stopRowEndHeaderFetch = true;            
        }
    }
};

/**
 * Display the 'fetching' status message
 */
DvtDataGrid.prototype.showStatusText = function()
{
    var left, msg;
    msg = this.getResources().getTranslatedText("msgFetchingData");

    if (this.m_status['style']['display'] == "block")
    {
        return;
    }

    this.m_status.textContent = msg;
    this.m_status['style']['display'] = "block";

    left = this.getWidth() / 2 - this.m_status['offsetWidth'] / 2;
    this.m_status['style']['left'] = left + 'px';
};

/**
 * Hide the 'fetching' status message
 */
DvtDataGrid.prototype.hideStatusText = function()
{
    this.m_status['style']['display'] = "none";
};

/********************* focusable/editable element related methods *****************/
/**
 * Finds all the focusable elements in a node
 * @param {Element|undefined|null} node
 * @param {boolean=} skipTabIndexCheck
 * @return {Array} An array of all of the focusable elements in a node
 */
DvtDataGrid.prototype.getFocusableElementsInNode = function(node, skipTabIndexCheck)
{
    var inputElems, nodes, elem, nodeCount, i, attr;
    inputElems = [];
    attr = this.getResources().getMappedAttribute('tabMod');

    if (document.evaluate)
    {
        // FF and IE are not case sensitive with x-path, but webkit browser are (GoogleChrome and Safari only recognize lower case)
        // to be safe, we check for both lower and upper case
        nodes = document.evaluate(".//*[@tabindex>=0]|.//*[@" + attr + ">=0]|.//input|.//select|.//textarea|.//button|.//a|.//INPUT|.//SELECT|.//TEXTAREA|.//BUTTON|.//A",
                node, null, XPathResult.ANY_TYPE, null);
        elem = nodes.iterateNext();
        while (elem)
        {
            if (!elem.disabled && elem.style.display != 'none' && (skipTabIndexCheck || !elem.tabIndex || elem.tabIndex > 0 || parseInt(elem.getAttribute(attr), 10) >= 0))
            {
                inputElems.push(elem);
            }

            elem = nodes.iterateNext();
        }
    }
    else
    {
        // use the same query as above which has proven to work on non-ie browsers
        nodes = node.querySelectorAll("input, select, button, a, textarea, [tabIndex], [" + attr + "]");
        nodeCount = nodes.length;
        // we don't want to use AdfDhtmlPivotTablePeer._INPUT_REGEXP because it has OPTION in the regexp
        // in IE, each 'option' after 'select' elem will be counted as an input element(and cause duplicate input elems returned)
        // this will cause problem with TAB/Shift-TAB (recognizing whether to go to next cell or to tab within the current cell
        for (i = 0; i < nodeCount; i += 1)
        {
            elem = nodes[i];
            if (!elem.disabled && elem.style.display != 'none' && (skipTabIndexCheck || !elem.tabIndex || elem.tabIndex >= 0 || parseInt(elem.getAttribute(attr), 10) >= 0))
            {
                inputElems.push(elem);
            }
        }
    }
    return inputElems;
};

/**
 * Whether an element is visible
 * @param {Element|undefined|null} elem
 * @param {Element|undefined|null} node
 * @private
 */
DvtDataGrid.prototype.isElementVisible = function(elem, node)
{
    return true;
};

/**
 * Make all focusable elements within the specified cell unfocusable
 * @param {Element} cell
 * @private
 */
DvtDataGrid.prototype._disableAllFocusableElements = function(cell)
{
    var focusElems, i, tabIndex, attr;
    attr = this.getResources().getMappedAttribute('tabMod');

    // make all focusable elements non-focusable, since we want to manage tab stops
    focusElems = this.getFocusableElementsInNode(cell);
    for (i = 0; i < focusElems.length; i++)
    {
        tabIndex = parseInt(focusElems[i].tabIndex, 10);
        if (isNaN(tabIndex) || tabIndex >= 0)
        {
            // store the tabindex as an attribute
            focusElems[i].setAttribute(attr, isNaN(tabIndex) ? -1 : tabIndex);
            focusElems[i].setAttribute('tabIndex', -1);
        }
    }
};

/**
 * Make all focusable elements within the specified cell that were made unfocusable before focusable again
 * @param {Element|undefined|null} cell
 * @private
 */
DvtDataGrid.prototype._enableAllFocusableElements = function(cell)
{
    var focusElems, i, tabIndex, attr;
    attr = this.getResources().getMappedAttribute('tabMod');

    // make all non-focusable elements focusable again
    focusElems = this.getFocusableElementsInNode(cell, false);
    for (i = 0; i < focusElems.length; i++)
    {
        tabIndex = parseInt(focusElems[i].getAttribute(attr), 10);
        focusElems[i].removeAttribute(attr);
        // restore tabIndex as needed
        if (tabIndex == -1)
        {
            focusElems[i].removeAttribute("tabIndex");
        }
        else
        {
            focusElems[i].setAttribute("tabIndex", tabIndex);
        }
    }
};

/**
 * Determine whether the element is a focusable element.
 * @param {Element} elem the element to check
 * @return {boolean} true if element is a focusable element, false otherwise.
 * @private
 */
DvtDataGrid.prototype._isFocusableElement = function(elem)
{
    var tagName = elem.tagName;
    return (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || tagName === 'BUTTON' || tagName === 'A' || (elem.getAttribute("tabIndex") != null && parseInt(elem.getAttribute("tabIndex"), 10) >= 0 && this.findCell(elem) != elem));
};

DvtDataGrid.prototype._isFocusableElementBeforeCell = function(elem)
{
    // if element is null or if we reach the root of DataGrid or if it is the cell
    if (elem == null || elem == this.getRootElement() || this.m_utils.containsCSSClassName(elem, this.getMappedStyle('cell')))
    {
        return false;
    }    
    
    var tagName = elem.tagName;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || tagName === 'BUTTON' || tagName === 'A' || this.m_utils.containsCSSClassName(elem, this.getMappedStyle('active')) || (elem.getAttribute("tabIndex") != null && parseInt(elem.getAttribute("tabIndex"), 10) >= 0 && this.findCell(elem) != elem))
    {
        return true;
    }
    return this._isFocusableElementBeforeCell(elem['parentNode']);
};

/**
 * Sets focus on first focusable element contained by an element
 * @param {Element|undefined|null} elem
 * @return {boolean} true if focus is set successfully, false otherwise
 */
DvtDataGrid.prototype._setFocusToFirstFocusableElement = function(elem)
{
    var elems, firstElement;
    elems = this.getFocusableElementsInNode(elem, true);
    if (elems.length > 0)
    {
        firstElement = elems[0];
        firstElement.focus();
        if (firstElement.setSelectionRange && firstElement.value)
        {
            try 
            {
                // ensure focus at the end
                firstElement.setSelectionRange(firstElement.value.length, firstElement.value.length);
            }
            catch (e)
            {
                // invalid state error   
            }
        }        
        if (this._overwriteFlag === true && typeof elems[0].select === 'function')
        {
            firstElement.select();
        }
        return true;
    }

    return false;
};

/************************************** scrolling/virtualization ************************************/

/**
 * Handle a scroll event calling scrollTo
 * @param {Event} event - the scroll event triggering the method
 */
DvtDataGrid.prototype.handleScroll = function(event)
{
    // scroll on touch is handled directly by touch handlers
    if (this.m_utils.isTouchDevice())
    {
        return;
    }

    if (this.m_silentScroll == true)
    {
        this.m_silentScroll = false;
        return;
    }

    var scrollLeft, scrollTop, scroller;
    if (!event)
    {
        event = window['event'];
    }

    if (!event['target'])
    {
        scroller = event['srcElement'];
    }
    else
    {
        scroller = event['target'];
    }

    scrollLeft = this.m_utils.getElementScrollLeft(scroller);
    scrollTop = scroller['scrollTop'];

    this.scrollTo(scrollLeft, scrollTop);
};

/**
 * Retrieve the maximum scrollable width.
 * @return {number} the maximum scrollable width.  Returns MAX_VALUE
 *         if canvas size is unknown.
 * @private
 */
DvtDataGrid.prototype._getMaxScrollWidth = function()
{
    if (this._isCountUnknownOrHighwatermark('column') && !this.m_stopColumnFetch)
    {
        return Number.MAX_VALUE;
    }
    return this.m_scrollWidth;
};

/**
 * Retrieve the maximum scrollable height.
 * @return {number} the maximum scrollable width.  Returns MAX_VALUE
 *         if canvas size is unknown.
 * @private
 */
DvtDataGrid.prototype._getMaxScrollHeight = function()
{
    if (this._isCountUnknownOrHighwatermark('row') && !this.m_stopRowFetch)
    {
        return Number.MAX_VALUE;
    }
    return this.m_scrollHeight;
};

/**
 * Handle a programtic scroll
 * @export
 * @param {Object} options an object containing the scrollTo information
 * @param {Object} options.position scroll to an x,y location which is relative to the origin of the grid
 * @param {Object} options.position.scrollX the x position of the scrollable region, this should always be positive
 * @param {Object} options.position.scrollY the Y position of the scrollable region, this should always be positive
 *
 */
DvtDataGrid.prototype.scroll = function(options)
{
    var scrollLeft, scrollTop;
    if (options['position'] != null)
    {
        scrollLeft = Math.max(0, Math.min(this._getMaxScrollWidth(), options['position']['scrollX']));
        scrollTop = Math.max(0, Math.min(this._getMaxScrollHeight(), options['position']['scrollY']));
        this._initiateScroll(scrollLeft, scrollTop);
    }
};

/**
 * Used by mouse wheel and touch scrolling to set the scroll position,
 * since the deltas are obtained instead of new scroll position.
 * @param {number} deltaX - the change in X position
 * @param {number} deltaY - the change in Y position
 */
DvtDataGrid.prototype.scrollDelta = function(deltaX, deltaY)
{
    var scrollLeft, scrollTop;
    // prevent 'diagonal' scrolling
    if (deltaX != 0 && deltaY != 0)
    {
        // direction depends on which way moves the most
        if (Math.abs(deltaX) > Math.abs(deltaY))
        {
            deltaY = 0;
            this.m_extraScrollOverY = null;
        }
        else
        {
            deltaX = 0;
            this.m_extraScrollOverX = null;
        }
    }

    scrollLeft = Math.max(0, Math.min(this._getMaxScrollWidth(), this.m_currentScrollLeft - deltaX));
    scrollTop = Math.max(0, Math.min(this._getMaxScrollHeight(), this.m_currentScrollTop - deltaY));
    this._initiateScroll(scrollLeft, scrollTop);
};

/**
 * Initiate a scroll, this will differentiate between scrolling on touch vs desktop
 * @param {number} scrollLeft
 * @param {number} scrollTop
 */
DvtDataGrid.prototype._initiateScroll = function(scrollLeft, scrollTop)
{
    if (!this.m_utils.isTouchDevice())
    {
        this.m_utils.setElementScrollLeft(this.m_databody, scrollLeft);
        this.m_databody['scrollTop'] = scrollTop;
    }
    else
    {
        // for touch we'll call scrollTo directly instead of relying on scroll event to fire due to performance
        // or if the scroll position of the databody was already set properly from mousewheel etc, then just sync everything up
        // in scrollTo
        this.scrollTo(scrollLeft, scrollTop);
    }
};

/**
 * Disable touch scroll animation by setting durations to 0
 * @private
 */
DvtDataGrid.prototype._disableTouchScrollAnimation = function()
{
    this.m_databody['firstChild'].style.webkitTransitionDuration = '0ms';
    this.m_rowHeader['firstChild'].style.webkitTransitionDuration = '0ms';
    this.m_colHeader['firstChild'].style.webkitTransitionDuration = '0ms';
};

/**
 * Should the datagrid long scroll using appropriate params if no databody but headers.
 * @param {number} scrollLeft - the position the scroller left should be
 * @param {number} scrollTop - the position the scroller top should be
 * @returns {boolean} true if long scroll should init
 */
DvtDataGrid.prototype._shouldLongScroll = function(scrollLeft, scrollTop)
{
    // only long scroll if virtual scrolling    
    if (this._isHighWatermarkScrolling())
    {
        return false;        
    }
    
    return ((scrollLeft + this.getViewportWidth()) < this._getMaxLeftPixel() ||
            (scrollTop + this.getViewportHeight()) < this._getMaxTopPixel() ||
            scrollLeft > this._getMaxRightPixel() ||
            scrollTop > this._getMaxBottomPixel());        
};


/**
 * Set the scroller position, using translate3d when permitted
 * @param {number} scrollLeft - the position the scroller left should be
 * @param {number} scrollTop - the position the scroller top should be
 */
DvtDataGrid.prototype.scrollTo = function(scrollLeft, scrollTop)
{  
    if (scrollLeft != this.m_currentScrollLeft)
    {
        this.m_prevScrollLeft = this.m_currentScrollLeft;
        this.m_currentScrollLeft = scrollLeft;
    }
    if (scrollTop != this.m_currentScrollTop)
    {
        this.m_prevScrollTop = this.m_currentScrollTop;
        this.m_currentScrollTop = scrollTop;
    }

    // check if this is a long scroll
    // don't do this for touch, the check must be done AFTER transition ends otherwise
    // animation will become sluggish, see _syncScroller
    if (!this.m_utils.isTouchDevice())
    {
        if (this._shouldLongScroll(scrollLeft, scrollTop))
        {
            this.handleLongScroll(scrollLeft, scrollTop);
        }
        else
        {
            this.fillViewport();
        }
    }

    // update header and databody scroll position
    this._syncScroller();

    if (!this.m_utils.isTouchDevice())
    {
        // If detect an actual scroll, fire scroll event
        if (this.m_prevScrollTop !== scrollTop || this.m_prevScrollLeft !== scrollLeft)
        {
            this.fireEvent('scroll', {'event': null, 'ui':{'scrollX': scrollLeft, 'scrollY': scrollTop}});
        }
    }
    
    // check if we need to adjust scroller dimension
    this._adjustScrollerSize();

    // check if there's a cell to focus
    if (this.m_cellToFocus != null)
    {
        this._setActive(this.m_cellToFocus, null, false);
        this.m_cellToFocus = null;
    }

    //if there's an index we wanted to sctoll to after fetch it has now been scrolled to by scrollToIndex, so highlight it
    if (this.m_scrollIndexAfterFetch != null)
    {
        if (this._isInViewport(this.m_scrollIndexAfterFetch) === DvtDataGrid.INSIDE)
        {
            if (this._isDatabodyCellActive() &&
                    this.m_scrollIndexAfterFetch['row'] == this.m_active['indexes']['row'] &&
                    this.m_scrollIndexAfterFetch['column'] == this.m_active['indexes']['column'])
            {
                this._highlightActive();
            }
            //should be able to scroll to index without highlighting it
            this.m_scrollIndexAfterFetch = null;
        }
    }
    
    // do the same for headers
    if (this.m_scrollHeaderAfterFetch != null)
    {
        if (!this._isDatabodyCellActive() &&
                this.m_scrollHeaderAfterFetch['axis'] == this.m_active['axis'] &&
                this.m_scrollHeaderAfterFetch['index'] == this.m_active['index'] &&
                this.m_scrollHeaderAfterFetch['level'] == this.m_active['level'])
        {
            this._highlightActive();
        }
        //should be able to scroll to index without highlighting it
        this.m_scrollHeaderAfterFetch = null;
    }       
};

/**
 * Callback to run when the final transition ends
 * @private
 */
DvtDataGrid.prototype._scrollTransitionEnd = function()
{
    var databody;

    if (this.m_scrollTransitionEnd != null)
    {
        databody = this.m_databody['firstChild'];

        // remove existing listener
        databody.removeEventListener("webkitTransitionEnd", this.m_scrollTransitionEnd);
    }

    //center touch affordances if row selection multiple
    if (this._isSelectionEnabled())
    {
        this._scrollTouchSelectionAffordance();
    }

    // Fire scroll event after physical scrolling finishes     
    this.fireEvent('scroll', {'event': null, 'ui':{'scrollX': this.m_currentScrollLeft, 'scrollY': this.m_currentScrollTop}});

    // check how the viewport needs to be filled, through long scroll or HWS fillViewport.
    // This should be replaced once we optimize sort going to the newly sorted location.
    if (this._shouldLongScroll(this.m_currentScrollLeft, this.m_currentScrollTop))
    {
        this.handleLongScroll(this.m_currentScrollLeft, this.m_currentScrollTop);
    }
    else
    {
        this.fillViewport();
    }
};

/**
 * Perform the bounce back animation when a swipe gesture causes over scrolling
 * @private
 */
DvtDataGrid.prototype._bounceBack = function()
{
    var scrollLeft, scrollTop, databody, colHeader, rowHeader, colEndHeader, rowEndHeader;

    scrollLeft = this.m_currentScrollLeft;
    scrollTop = this.m_currentScrollTop;

    databody = this.m_databody['firstChild'];
    colHeader = this.m_colHeader['firstChild'];
    rowHeader = this.m_rowHeader['firstChild'];
    colEndHeader = this.m_colEndHeader['firstChild'];
    rowEndHeader = this.m_rowEndHeader['firstChild'];

    // remove existing listener
    databody.removeEventListener("webkitTransitionEnd", this.m_bounceBack);

    databody.style.webkitTransitionDuration = DvtDataGrid.BOUNCE_ANIMATION_DURATION + 'ms';
    rowHeader.style.webkitTransitionDuration = DvtDataGrid.BOUNCE_ANIMATION_DURATION + 'ms';
    rowEndHeader.style.webkitTransitionDuration = DvtDataGrid.BOUNCE_ANIMATION_DURATION + 'ms';
    colHeader.style.webkitTransitionDuration = DvtDataGrid.BOUNCE_ANIMATION_DURATION + 'ms';
    colEndHeader.style.webkitTransitionDuration = DvtDataGrid.BOUNCE_ANIMATION_DURATION + 'ms';

    // process to run after bounce back animation ends
    if (this.m_scrollTransitionEnd == null)
    {
        this.m_scrollTransitionEnd = this._scrollTransitionEnd.bind(this);
    }
    databody.addEventListener("webkitTransitionEnd", this.m_scrollTransitionEnd);

    // scroll back to actual scrollLeft/scrollTop positions
    if (this.getResources().isRTLMode())
    {
        databody.style.webkitTransform = "translate3d(" + scrollLeft + "px, " + (-scrollTop) + "px, 0)";
        colHeader.style.webkitTransform = "translate3d(" + scrollLeft + "px, 0, 0)";
        colEndHeader.style.webkitTransform = "translate3d(" + scrollLeft + "px, 0, 0)";
    }
    else
    {
        databody.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, " + (-scrollTop) + "px, 0)";
        colHeader.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, 0, 0)";
        colEndHeader.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, 0, 0)";
    }
    rowHeader.style.webkitTransform = "translate3d(0, " + (-scrollTop) + "px, 0)";
    rowEndHeader.style.webkitTransform = "translate3d(0, " + (-scrollTop) + "px, 0)";

    // reset
    this.m_extraScrollOverX = null;
    this.m_extraScrollOverY = null;
};

/**
 * Make sure the databody/headers and the scroller are in sync, which could happen when scrolling
 * stopped awaiting fetch to complete.
 * @private
 */
DvtDataGrid.prototype._syncScroller = function()
{
    var scrollLeft, scrollTop, databody, colHeader, rowHeader, dir, colEndHeader, rowEndHeader;

    scrollLeft = this.m_currentScrollLeft;
    scrollTop = this.m_currentScrollTop;

    databody = this.m_databody['firstChild'];
    colHeader = this.m_colHeader['firstChild'];
    rowHeader = this.m_rowHeader['firstChild'];
    colEndHeader = this.m_colEndHeader['firstChild'];
    rowEndHeader = this.m_rowEndHeader['firstChild'];

    // use translate3d for smoother scrolling
    // this checks determine whether this is webkit and translated3d is supported
    if (this.m_utils.isTouchDevice() && window.hasOwnProperty('WebKitCSSMatrix'))
    {
        // check if the swipe gesture causes over scrolling of scrollable area
        if (this.m_extraScrollOverX != null || this.m_extraScrollOverY != null)
        {
            // swipe horizontal or vertical
            if (this.m_extraScrollOverX != null)
            {
                scrollLeft = scrollLeft + this.m_extraScrollOverX;
            }
            else
            {
                scrollTop = scrollTop + this.m_extraScrollOverY;
            }

            // bounce back animation function
            if (this.m_bounceBack == null)
            {
                this.m_bounceBack = this._bounceBack.bind(this);
            }

            databody.addEventListener("webkitTransitionEnd", this.m_bounceBack);
        }
        else
        {
            if (databody.style.webkitTransitionDuration == '0ms')
            {
                // no transition, just call the handler directly
                this._scrollTransitionEnd();
            }
            else
            {
                if (this.m_scrollTransitionEnd == null)
                {
                    this.m_scrollTransitionEnd = this._scrollTransitionEnd.bind(this);
                }
                databody.addEventListener("webkitTransitionEnd", this.m_scrollTransitionEnd);
            }
        }

        // actual scrolling of databody and headers
        if (this.getResources().isRTLMode())
        {
            databody.style.webkitTransform = "translate3d(" + scrollLeft + "px, " + (-scrollTop) + "px, 0)";
            colHeader.style.webkitTransform = "translate3d(" + scrollLeft + "px, 0, 0)";
            colEndHeader.style.webkitTransform = "translate3d(" + scrollLeft + "px, 0, 0)";
        }
        else
        {
            databody.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, " + (-scrollTop) + "px, 0)";
            colHeader.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, 0, 0)";
            colEndHeader.style.webkitTransform = "translate3d(" + (-scrollLeft) + "px, 0, 0)";
        }
        rowHeader.style.webkitTransform = "translate3d(0, " + (-scrollTop) + "px, 0)";
        rowEndHeader.style.webkitTransform = "translate3d(0, " + (-scrollTop) + "px, 0)";
    }
    else
    {
        dir = this.getResources().isRTLMode() ? "right" : "left";
        this.setElementDir(colHeader, -scrollLeft, dir);
        this.setElementDir(colEndHeader, -scrollLeft, dir);
        this.setElementDir(rowHeader, -scrollTop, 'top');
        this.setElementDir(rowEndHeader, -scrollTop, 'top');
    }
};

/**
 * Adjust the scroller when we scroll to the ends of the scroller.  The scroller dimension might
 * need adjustment due to 1) variable column width or row height due to custom sizing 2) the row
 * or column count is not exact.
 * @private
 */
DvtDataGrid.prototype._adjustScrollerSize = function()
{
    var scrollerContent, scrollerContentHeight, scrollerContentWidth;
    scrollerContent = this.m_databody['firstChild'];
    scrollerContentHeight = this.getElementHeight(scrollerContent);
    scrollerContentWidth = this.getElementWidth(scrollerContent);

    // if (1) actual content is higher than scroller (regardless of the current position) OR
    //    (2) we have reached the last row and the actual content is shorter than scroller
    if ((this._getMaxBottomPixel() > scrollerContentHeight) ||
            (this.getDataSource().getCount('row') == (this._getMaxBottom() + 1) && !this._isCountUnknown('row') && this._getMaxBottom() > -1))
    {
        this.setElementHeight(scrollerContent, this._getMaxBottomPixel());
    }

    // if (1) actual content is wider than scroller (regardless of the current position) OR
    //    (2) we have reached the last column and the actual content is narrower than scroller
    if ((this._getMaxRightPixel() > scrollerContentWidth) ||
            (this.getDataSource().getCount('column') == (this._getMaxRight() + 1) && !this._isCountUnknown('column') && this._getMaxRight() > -1))
    {
        this.setElementWidth(scrollerContent, this._getMaxRightPixel());
    }
};

/**
 * Get the starting position based on scroll
 * @param {number} scrollDir
 * @param {number} prevScrollDir
 * @param {string} axis
 * @returns {Object} contains start and startPixel
 */
DvtDataGrid.prototype._getLongScrollStart = function(scrollDir, prevScrollDir, axis)
{
    var start, startPixel, oversizeRatio, fetchSize, total, scrollerDimension, maxDimension, maxScroll, avgDimension, scrollbarSize;
        
    // totals must be 0 or higher for long scroll
    if (prevScrollDir != scrollDir)
    {
        if (axis == 'row')
        {
            scrollerDimension = this.getElementHeight(this.m_databody.firstChild);
            maxDimension = this.m_utils._getMaxDivHeightForScrolling();
            maxScroll = this._getMaxScrollHeight();
            avgDimension = this.m_avgRowHeight;
            scrollbarSize = this.m_hasHorizontalScroller ?  this.m_utils.getScrollbarSize() : 0;
        }
        else if (axis == 'column')
        {
            scrollerDimension = this.getElementWidth(this.m_databody.firstChild);
            maxDimension = this.m_utils._getMaxDivWidthForScrolling();
            maxScroll = this._getMaxScrollWidth();
            avgDimension = this.m_avgColWidth;
            scrollbarSize = this.m_hasVerticalScroller ?  this.m_utils.getScrollbarSize() : 0;
        }

        oversizeRatio =  Math.max(Math.min(scrollDir / scrollerDimension, 1), 0);
        total = this.getDataSource().getCount(axis);
        fetchSize = this.getFetchSize(axis);
        start = Math.floor(total * oversizeRatio);
        startPixel = maxDimension <= scrollerDimension ? Math.min(scrollDir, maxScroll) : start * avgDimension;
        
        if (oversizeRatio == 1 || (scrollDir + (fetchSize * avgDimension)) > (scrollerDimension - scrollbarSize))
        {
            start = Math.max(total - fetchSize, 0);
            startPixel = Math.max(scrollerDimension - (fetchSize * avgDimension), 0);
        }
    }
    else
    {
        if (axis == 'row')
        {
            start = this.m_startRow;
            startPixel = this.m_startRowPixel;
        }    
        else if (axis == 'column')
        {
            start = this.m_startCol;
            startPixel = this.m_startColPixel;
        }
    }

    return {'start': start, 'startPixel': startPixel};
};

/**
 * Handle scroll to position that is completely outside of the current row/column range
 * For example, in Chrome it is possible to cause a "jump" back to the start position
 * This might also be needed if we decide to use delay scroll (to detect long scroll) to avoid
 * excessive fetching.
 * @param {number} scrollLeft - the position the scroller left should be
 * @param {number} scrollTop - the position the scroller top should be
 */
DvtDataGrid.prototype.handleLongScroll = function(scrollLeft, scrollTop)
{
    var startRow, startCol, startRowPixel, startColPixel, rowReturnVal, columnReturnVal;

    this.m_isLongScroll = true;

    if (this.isFetchComplete())
    {
        rowReturnVal = this._getLongScrollStart(scrollTop, this.m_prevScrollTop, 'row');
        startRow = rowReturnVal['start'];
        startRowPixel = rowReturnVal['startPixel'];

        columnReturnVal = this._getLongScrollStart(scrollLeft, this.m_prevScrollLeft, 'column');
        startCol = columnReturnVal['start'];
        startColPixel = columnReturnVal['startPixel'];

        // reset ranges, just cleaned up to only set if the header is present
        if (this.m_hasCells)
        {
            this.m_startRow = startRow;
            this.m_endRow = -1;    
            this.m_startRowPixel = startRowPixel;
            this.m_endRowPixel = startRowPixel;
            this.m_startCol = startCol;
            this.m_endCol = -1;
            this.m_startColPixel = startColPixel;
            this.m_endColPixel = startColPixel;
        }
        
        if (this.m_hasRowHeader)
        {
            this.m_startRowHeader = startRow;
            this.m_endRowHeader = -1;        
            this.m_startRowHeaderPixel = startRowPixel;
            this.m_endRowHeaderPixel = startRowPixel;
        }
        if (this.m_hasRowEndHeader)
        {
            this.m_startRowEndHeader = startRow;
            this.m_endRowEndHeader = -1;   
            this.m_startRowEndHeaderPixel = startRowPixel;
            this.m_endRowEndHeaderPixel = startRowPixel;
        }
        if (this.m_hasColHeader)
        {
            this.m_startColHeader = startCol;
            this.m_endColHeader = -1;     
            this.m_startColHeaderPixel = startColPixel;
            this.m_endColHeaderPixel = startColPixel;
        }        
        if (this.m_hasColEndHeader)
        {
            this.m_startColEndHeader = startCol;
            this.m_endColEndHeader = -1; 
            this.m_startColEndHeaderPixel = startColPixel;
            this.m_endColEndHeaderPixel = startColPixel;
        }

        this.m_stopRowFetch = false;
        this.m_stopRowHeaderFetch = false;
        this.m_stopRowEndHeaderFetch = false;
        this.m_stopColumnFetch = false;
        this.m_stopColumnHeaderFetch = false;
        this.m_stopColumnEndHeaderFetch = false;

        // custom success callback so that we can reset all ranges and fields
        // initiate fetch of headers and cells
        this.fetchHeaders("row", startRow, this.m_rowHeader, this.m_rowEndHeader, undefined, {'success': function(headerSet, headerRange, endHeaderSet)
            {
                this.handleRowHeadersFetchSuccessForLongScroll(headerSet, headerRange, endHeaderSet);
            }});
        this.fetchHeaders("column", startCol, this.m_colHeader, this.m_colEndHeader, undefined, {'success': function(headerSet, headerRange, endHeaderSet)
            {
                this.handleColumnHeadersFetchSuccessForLongScroll(headerSet, headerRange, endHeaderSet);
            }});
        this.fetchCells(this.m_databody, startRow, startCol, null, null, {'success': function(cellSet, cellRange)
            {
                this.handleCellsFetchSuccessForLongScroll(cellSet, cellRange, startRow, startCol, startRowPixel, startColPixel);
            }});
    }
};

/**
 * Handle a successful call to the data source fetchHeaders for long scroll
 * @param {Object} headerSet - the result of the fetch
 * @param {Object} headerRange - {"axis":,"start":,"count":,"header":}
 * @param {Object} endHeaderSet - the result of the fetch
 * @protected
 */
DvtDataGrid.prototype.handleRowHeadersFetchSuccessForLongScroll = function(headerSet, headerRange, endHeaderSet)
{
    var headerContent, endHeaderContent;
    headerContent = this.m_rowHeader['firstChild'];
    endHeaderContent = this.m_rowEndHeader['firstChild'];
    if (headerContent != null)
    {
        this.m_utils.empty(headerContent);
    }
    if (endHeaderContent != null)
    {
        this.m_utils.empty(endHeaderContent);
    }
    this.handleHeadersFetchSuccess(headerSet, headerRange, endHeaderSet, false);
};

/**
 * Handle a successful call to the data source fetchHeaders for long scroll
 * @param {Object} headerSet - the result of the fetch
 * @param {Object} headerRange - {"axis":,"start":,"count":,"header":}
 * @param {Object} endHeaderSet - the result of the fetch
 * @protected
 */
DvtDataGrid.prototype.handleColumnHeadersFetchSuccessForLongScroll = function(headerSet, headerRange, endHeaderSet)
{
    var headerContent, endHeaderContent;
    headerContent = this.m_colHeader['firstChild'];
    endHeaderContent = this.m_colEndHeader['firstChild'];
    if (headerContent != null)
    {
        this.m_utils.empty(headerContent);
    }
    if (endHeaderContent != null)
    {
        this.m_utils.empty(endHeaderContent);
    }
    this.handleHeadersFetchSuccess(headerSet, headerRange, endHeaderSet, false);
};
/**
 * Handle a successful call to the data source fetchCells. Create new row and
 * cell DOM elements when necessary and then insert them into the databody.
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 * @param {number} startRow the row to start insert at
 * @param {number} startCol the col to start insert at
 * @param {number} startRowPixel the row pixel to start insert at
 * @param {number} startColPixel the col pixel to start insert at
 * @protected
 */
DvtDataGrid.prototype.handleCellsFetchSuccessForLongScroll = function(cellSet, cellRange, startRow, startCol, startRowPixel, startColPixel)
{
    var databodyContent = this.m_databody['firstChild'];
    if (databodyContent != null)
    {
        this.m_utils.empty(databodyContent);
    }

    // now calls fetch success proc
    this.handleCellsFetchSuccess(cellSet, cellRange);
};

/**
 * Method to clean up the viewport in one direction, left cleans the first columns, top the first rows etc.
 * This is seperate from fill viewport so that in both the synchronus and asynchronus
 * fetch case the cleanuo happens after we get the data fpor the next area.
 * @param {string|null|undefined} direction left/right/top/bottom
 */
DvtDataGrid.prototype._cleanupViewport = function(direction)
{
    var viewportLeft, viewportRight, viewportTop, viewportBottom;   

    if (this._isHighWatermarkScrolling() || !this._isScrollBackToEditable())
    {
        return;
    }
    
    //the viewport is the scroller, width and height
    viewportLeft = this._getViewportLeft();
    viewportRight = this._getViewportRight();
    viewportTop = this._getViewportTop();
    viewportBottom = this._getViewportBottom();
    
    if (direction == 'top' && viewportTop > this._getMaxTopPixel())
    {
        this.removeRowsFromTop(this.m_databody);
        this.removeRowHeadersFromTop();
    }
    else if (direction == 'bottom' && viewportBottom < this._getMaxBottomPixel())
    {
        this.removeRowsFromBottom(this.m_databody);
        this.removeRowHeadersFromBottom();
    }
    else if (direction == 'left' && viewportLeft > this._getMaxLeftPixel())
    {
        this.removeColumnsFromLeft(this.m_databody);
        this.removeColumnHeadersFromLeft();
    }
    else if (direction == 'right' && viewportRight < this._getMaxRightPixel())
    {
        this.removeColumnsFromRight(this.m_databody);
        this.removeColumnHeadersFromRight();        
    }
};

/**
 * Make sure the viewport is filled of cells, this method has been modified to just fill
 * and so that it will always follow a fetchHeaders call with a fetchCells call to keep them in sync.
 */
DvtDataGrid.prototype.fillViewport = function()
{
    var viewportLeft, viewportRight, viewportTop, viewportBottom, fetchStart, fetchSize;   

    if (this.isFetchComplete())
    {
        //the viewport is the scroller, width and height
        // fetch slightly before the edge for the zoomed browser case as the pixel mapping isn't perfect
        viewportLeft = this._getViewportLeft();
        viewportRight = this._getViewportRight() + DvtDataGrid.FETCH_PIXEL_THRESHOLD;
        viewportTop = this._getViewportTop();
        viewportBottom = this._getViewportBottom() + DvtDataGrid.FETCH_PIXEL_THRESHOLD;

        if (this._getMaxBottomPixel() <= viewportBottom)
        {           
            if (!this.m_stopRowHeaderFetch || !this.m_stopRowEndHeaderFetch || !this.m_stopRowFetch)
            {
                fetchStart = Math.max(0, this._getMaxBottom() + 1);
                fetchSize = Math.max(0, this.getFetchSize("row"));                
                this.fetchHeaders("row", fetchStart, this.m_rowHeader, this.m_rowEndHeader, fetchSize);
                this.fetchCells(this.m_databody, fetchStart, this.m_startCol, fetchSize, this.m_endCol - this.m_startCol + 1);
                return;
            }
        }
        
        if (this._getMaxTopPixel() > viewportTop)
        {
            fetchStart = Math.max(0, this._getMaxTop() - this.getFetchSize("row"));
            fetchSize = Math.max(0, this._getMaxTop() - fetchStart);             
            this.fetchHeaders("row", fetchStart, this.m_rowHeader, this.m_rowEndHeader, fetchSize);
            this.fetchCells(this.m_databody, fetchStart, this.m_startCol, fetchSize, this.m_endCol - this.m_startCol + 1);
            return;
        }
        
        if (this._getMaxRightPixel() <= viewportRight)
        {
            if (!this.m_stopColumnHeaderFetch || !this.m_stopColumnEndHeaderFetch || !this.m_stopColumnFetch)
            {  
                fetchStart = Math.max(0, this._getMaxRight() + 1);
                fetchSize = Math.max(0, this.getFetchSize("column"));          
                this.fetchHeaders("column", fetchStart, this.m_colHeader, this.m_colEndHeader, fetchSize);
                this.fetchCells(this.m_databody, this.m_startRow, fetchStart, this.m_endRow - this.m_startRow + 1, fetchSize);
                return;
            }
        }
        
        if (this._getMaxLeftPixel() > viewportLeft)
        {
            fetchStart = Math.max(0, this._getMaxLeft() - this.getFetchSize("column"));
            fetchSize = Math.max(0, this._getMaxLeft() - fetchStart);                        
            this.fetchHeaders("column", fetchStart, this.m_colHeader, this.m_colEndHeader, fetchSize);
            this.fetchCells(this.m_databody, this.m_startRow, fetchStart, this.m_endRow - this.m_startRow + 1, fetchSize);
            return;
        }
    }
};

/**
 * @returns {number} last column or column start or end header
 */
DvtDataGrid.prototype._getMaxRight = function()
{
    return Math.max(Math.max(this.m_endCol, this.m_endColHeader), this.m_endColEndHeader);
};

/**
 * @returns {number} first column or column start or end header
 */
DvtDataGrid.prototype._getMaxLeft = function()
{
    return Math.max(Math.max(this.m_startCol, this.m_startColHeader), this.m_startColEndHeader);
};

/**
 * @returns {number} last column or column start or end header pixel
 */
DvtDataGrid.prototype._getMaxRightPixel = function()
{
    return Math.max(Math.max(this.m_endColPixel, this.m_endColHeaderPixel), this.m_endColEndHeaderPixel);
};

/**
 * @returns {number} first column or column start or end header pixel
 */
DvtDataGrid.prototype._getMaxLeftPixel = function()
{
    return Math.max(Math.max(this.m_startColPixel, this.m_startColHeaderPixel), this.m_startColEndHeaderPixel);
};

/**
 * @returns {number} last row or row start or end header
 */
DvtDataGrid.prototype._getMaxBottom = function()
{
    return Math.max(Math.max(this.m_endRow, this.m_endRowHeader), this.m_endRowEndHeader);
};

/**
 * @returns {number} first row or row start or end header
 */
DvtDataGrid.prototype._getMaxTop = function()
{
    return Math.max(Math.max(this.m_startRow, this.m_startRowHeader), this.m_startRowEndHeader);
};

/**
 * @returns {number} last row or row start or end header pixel
 */
DvtDataGrid.prototype._getMaxBottomPixel = function()
{
    return Math.max(Math.max(this.m_endRowPixel, this.m_endRowHeaderPixel), this.m_endRowEndHeaderPixel);
};

/**
 * @returns {number} first row or row start or end header pixel
 */
DvtDataGrid.prototype._getMaxTopPixel = function()
{
    return Math.max(Math.max(this.m_startRowPixel, this.m_startRowHeaderPixel), this.m_startRowEndHeaderPixel);
};

/**
 * If we are about to remove a cell that is being edited, try to handle it first
 * @private
 */
DvtDataGrid.prototype._isScrollBackToEditable = function()
{
    var currentMode = this._getCurrentMode();    
    var cell = this._getActiveElement();
    if (currentMode == 'edit' && this._isCellGoingToBeRemoved(cell))
    {
        return this._handleExitEdit(null, cell);
    }
    return true;
};

/**
 * Check if the cell is supposed to be removed
 * @private
 * @param {Element|null} cell
 */
DvtDataGrid.prototype._isCellGoingToBeRemoved = function(cell)
{    
    var height, width, left, top;
    if (!this._isHighWatermarkScrolling())
    {
        if((this.m_endRow - this.m_startRow) > this.MAX_ROW_THRESHOLD)
        {
            top = this.getElementDir(cell['parentNode'], 'top');
            height = this.getElementHeight(cell);
            if (top + height < this.m_currentScrollTop || top < this.m_currentScrollTop + this.getViewportHeight())
            {
                return true;
            }
        }
        if ((this.m_endCol - this.m_startCol) > this.MAX_COLUMN_THRESHOLD)
        {
            left = this.getElementDir(cell, 'left');
            width = this.getElementWidth(cell);
            if (left + width < this.m_currentScrollLeft || left < this.m_currentScrollLeft + this.getViewportHeight())
            {
                return true;
            }
        }    
    }

};

/**
 * Fetch cells and append results to the bottom
 * @protected
 */
DvtDataGrid.prototype.fetchCellsToBottom = function()
{
    this.fetchCells(this.m_databody, this.m_endRow + 1, this.m_startCol, null, this.m_endCol - this.m_startCol + 1);
};

/**
 * Fetch cells and insert results to the top
 * @protected
 */
DvtDataGrid.prototype.fetchCellsToTop = function()
{
    var fetchSize, fetchStartRow;
    // add rows to top
    fetchStartRow = Math.max(0, this.m_startRow - this.getFetchSize("row"));
    fetchSize = Math.max(0, this.m_startRow - fetchStartRow);
    this.fetchCells(this.m_databody, fetchStartRow, this.m_startCol, fetchSize, this.m_endCol - this.m_startCol + 1);
};

/**
 * Removes all of the headers in the containing div up until the right value is less than the scroll position minus the threshold.
 * It is recuresively called on inner levels in the multi-level header case.
 * @param {Element} headersContainer
 * @param {Element|null} firstChild
 * @param {number} startPixel
 * @param {number} threshold
 * @param {string} className
 * @param {string} dimension
 * @param {string} dir
 * @param {number} scrollPosition
 * @returns {Object} object with keys extentChange, which denotes how many header
 *      indexes were removed under the parent and dimensionChange which is the
 *      total dimensions of the headers removed
 */
DvtDataGrid.prototype.removeHeadersFromStartOfContainer = function(headersContainer, firstChild, startPixel, threshold, className, dimension, dir, scrollPosition)
{
    var headers, element, header, isHeader, dimensionValue, removedHeaders = 0, removedDimensionValue = 0, returnVal;

    headers = headersContainer['childNodes'];
    element = firstChild == null ? headersContainer['firstChild'] : firstChild['nextSibling'];
    if (element == null)
    {
        return {extentChange: 0, dimensionChange: 0};
    }
    isHeader = this.m_utils.containsCSSClassName(element, className);
    header = isHeader ? element : element['firstChild'];
    dimensionValue = this.getElementDir(header, dimension);

    while (startPixel + dimensionValue < scrollPosition - threshold)
    {
        this._remove(element);
        removedDimensionValue += dimensionValue;
        removedHeaders += isHeader ? 1 : this._getAttribute(element, 'extent', true);
        startPixel += dimensionValue;

        element = firstChild == null ? headersContainer['firstChild'] : firstChild['nextSibling'];
        if (element == null)
        {
            return {extentChange: removedHeaders, dimensionChange: removedDimensionValue};
        }
        isHeader = this.m_utils.containsCSSClassName(element, className);
        header = isHeader ? element : element['firstChild'];
        dimensionValue = this.getElementDir(header, dimension);
    }

    if (!isHeader)
    {
        returnVal = this.removeHeadersFromStartOfContainer(element, element['firstChild'], startPixel, threshold, className, dimension, dir, scrollPosition);
        this._setAttribute(element, 'start', this._getAttribute(element, 'start', true) + returnVal.extentChange);
        this._setAttribute(element, 'extent', this._getAttribute(element, 'extent', true) - returnVal.extentChange);
        this.setElementDir(header, this.getElementDir(header, dir) + returnVal.dimensionChange, dir);
        this.setElementDir(header, this.getElementDir(header, dimension) - returnVal.dimensionChange, dimension);

        removedHeaders += returnVal.extentChange;
        removedDimensionValue += returnVal.dimensionChange;
    }

    return {extentChange: removedHeaders, dimensionChange: removedDimensionValue};
};

/**
 * Removes all of the headers in the containing div up until the right value is less than the specified threshold.
 * It is recuresively called on inner levels in the multi-level header case.
 * @param {Element} headersContainer
 * @param {number} endPixel
 * @param {number} threshold
 * @param {string} className
 * @param {string} dimension
 * @returns {Object} object with keys extentChange, which denotes how many header
 *      indexes were removed under the parent and dimensionChange which is the
 *      total width of the headers removed
 */
DvtDataGrid.prototype.removeHeadersFromEndOfContainer = function(headersContainer, endPixel, threshold, className, dimension)
{
    var element, header, isHeader, dimensionValue, removedHeaders = 0, removedHeadersDimension = 0, returnVal;

    element = headersContainer['lastChild'];
    isHeader = this.m_utils.containsCSSClassName(element, className);
    header = isHeader ? element : element['firstChild'];
    dimensionValue = this.getElementDir(header, dimension);

    while (endPixel - dimensionValue > threshold)
    {
        this._remove(element);

        removedHeadersDimension += dimensionValue;
        removedHeaders += isHeader ? 1 : this._getAttribute(element, 'extent', true);

        endPixel -= dimensionValue;

        element = headersContainer['lastChild'];
        isHeader = this.m_utils.containsCSSClassName(element, className);
        header = isHeader ? element : element['firstChild'];
        dimensionValue = this.getElementDir(header, dimension);
    }

    if (!isHeader)
    {
        returnVal = this.removeHeadersFromEndOfContainer(element, endPixel, threshold, className, dimension);

        this._setAttribute(element, 'extent', this._getAttribute(element, 'extent', true) - returnVal.extentChange);
        this.setElementDir(header, this.getElementDir(header, dimension) - returnVal.dimensionChange, dimension);

        removedHeaders += returnVal.extentChange;
        removedHeadersDimension += returnVal.dimensionChange;
    }

    return {extentChange: removedHeaders, dimensionChange: removedHeadersDimension};
};

/**
 * Remove column start and end headers to the left of the current viewport
 */
DvtDataGrid.prototype.removeColumnHeadersFromLeft = function()
        {
    var colHeaderContent, colThreshold, returnVal, colEndHeaderContent;
    // clean up left column headers
    if ((this.m_endColHeader - this.m_startColHeader) > this.MAX_COLUMN_THRESHOLD)
    {
        colHeaderContent = this.m_colHeader['firstChild'];
        colThreshold = this.getColumnThreshold();
        if (this.m_startColHeaderPixel <= this.m_currentScrollLeft - colThreshold)
        {
            returnVal = this.removeHeadersFromStartOfContainer(colHeaderContent, null, this.m_startColHeaderPixel, colThreshold, this.getMappedStyle('colheadercell'), 'width', this.getResources().isRTLMode() ? "right" : "left", this.m_currentScrollLeft);

            this.m_startColHeaderPixel += returnVal.dimensionChange;
            this.m_startColHeader += returnVal.extentChange;
        }
    }

    if ((this.m_endColEndHeader - this.m_startColEndHeader) > this.MAX_COLUMN_THRESHOLD)
    {
        colEndHeaderContent = this.m_colEndHeader['firstChild'];
        colThreshold = this.getColumnThreshold();
        if (this.m_startColEndHeaderPixel < this.m_currentScrollLeft - colThreshold)
        {
            returnVal = this.removeHeadersFromStartOfContainer(colEndHeaderContent, null, this.m_startColEndHeaderPixel, colThreshold, this.getMappedStyle('colendheadercell'), 'width', this.getResources().isRTLMode() ? "right" : "left", this.m_currentScrollLeft);

            this.m_startColEndHeaderPixel += returnVal.dimensionChange;
            this.m_startColEndHeader += returnVal.extentChange;
    }
    }
};

/**
 * Remove cells to the left of the current viewport
 * @param {Element} databody - the root of the databody
 */
DvtDataGrid.prototype.removeColumnsFromLeft = function(databody)
{
    var databodyContent, rows, indexToRemove, left, colThreshold, columns, i, column, prevLeft, j, row, k;
    // clean up right column headers
    if ((this.m_endCol - this.m_startCol) > this.MAX_COLUMN_THRESHOLD)
    {  
        databodyContent = databody['firstChild'];
        rows = databodyContent['childNodes'];
        indexToRemove = 0;
        left = 0;
        colThreshold = this.getColumnThreshold();

        // no rows in databody, nothing to remove
        if (rows.length < 1)
        {
            return;
        }

        // just use the first row to find the cut off point
        columns = rows[0]['childNodes'];
        for (i = 0; i < columns.length; i += 1)
        {
            column = columns[i];
            prevLeft = left;
            left = this.getElementDir(column, 'left');
            if (left > (this.m_currentScrollLeft - colThreshold))
            {
                indexToRemove = i - 1;
                this.m_startCol = this.m_startCol + indexToRemove;
                this.m_startColPixel = prevLeft;

                break;
            }
        }

        for (j = 0; j < rows.length; j += 1)
        {
            row = rows[j];
            for (k = 0; k < indexToRemove; k += 1)
            {
                this._remove(row['firstChild']);
            }
        }
    }
};

/**
 * Remove column start and end headers to the right of the current viewport
 */
DvtDataGrid.prototype.removeColumnHeadersFromRight = function()
{
    var colHeaderContent, colThreshold, returnVal;
    colThreshold = this.m_currentScrollLeft + this.getViewportWidth() + this.getColumnThreshold();

    // clean up right column headers
    if ((this.m_endColHeader - this.m_startColHeader) > this.MAX_COLUMN_THRESHOLD)
    {
        colHeaderContent = this.m_colHeader['firstChild'];
        // don't clean up if end of row header is not below the bottom of viewport
        if (this.m_endColHeaderPixel > colThreshold)
        {
            if (this.m_stopColumnHeaderFetch)
            {
                this.m_stopColumnHeaderFetch = false;
            }

            returnVal = this.removeHeadersFromEndOfContainer(colHeaderContent, this.m_endColHeaderPixel, colThreshold, this.getMappedStyle('colheadercell'), 'width');

            this.m_endColHeaderPixel -= returnVal.dimensionChange;
            this.m_endColHeader -= returnVal.extentChange;
        }
    }

    // clean up right column end headers
    if ((this.m_endColEndHeader - this.m_startColEndHeader) > this.MAX_COLUMN_THRESHOLD)
    {
        colHeaderContent = this.m_colEndHeader['firstChild'];
        // don't clean up if end of row header is not below the bottom of viewport
        if (this.m_endColEndHeaderPixel > colThreshold)
        {
            if (this.m_stopColumnEndHeaderFetch)
            {
                this.m_stopColumnEndHeaderFetch = false;
            }

            returnVal = this.removeHeadersFromEndOfContainer(colHeaderContent, this.m_endColEndHeaderPixel, colThreshold, this.getMappedStyle('colendheadercell'), 'width');

            this.m_endColEndHeaderPixel -= returnVal.dimensionChange;
            this.m_endColEndHeader -= returnVal.extentChange;
        }
    }
};

/**
 * Remove cells to the right of the current viewport
 * @param {Element} databody - the root of the databody
 */
DvtDataGrid.prototype.removeColumnsFromRight = function(databody)
{
    var databodyContent, threshold, columns, column, width, rows, j, row;
    // clean up right column headers
    if ((this.m_endCol - this.m_startCol) > this.MAX_COLUMN_THRESHOLD)
    {    
        databodyContent = databody['firstChild'];
        rows = databodyContent['childNodes'];
        threshold = this.m_currentScrollLeft + this.getViewportWidth() + this.getColumnThreshold();

        // don't clean up if end of row header is not below the bottom of viewport
        // no rows in databody, nothing to remove    
        if (this.m_endColPixel <= threshold || rows.length < 1)
        {
            return;
        }

        if (this.m_stopColumnFetch)
        {
            this.m_stopColumnFetch = false;
        }

        columns = rows[0];
        column = columns['lastChild'];
        width = this.getElementWidth(column);
        while (this.m_endColPixel - width > threshold)
        {
            for (j = 0; j < rows.length; j += 1)
            {
                row = rows[j];
                this._remove(row['lastChild']);
            }
            this.m_endColPixel = this.m_endColPixel - width;
            this.m_endCol -= 1;

            column = columns['lastChild'];
            width = this.getElementWidth(column);
        }
    }
};

/**
 * Remove row start and end headers above the current viewport
 */
DvtDataGrid.prototype.removeRowHeadersFromTop = function()
{
    var rowHeaderContent, rowThreshold, returnVal, rowEndHeaderContent;
    if ((this.m_endRowHeader - this.m_startRowHeader) > this.MAX_ROW_THRESHOLD)
    {
        rowHeaderContent = this.m_rowHeader['firstChild'];
        rowThreshold = this.getRowThreshold();
        if (!(this.m_startRowHeaderPixel >= this.m_currentScrollTop - rowThreshold))
        {
            returnVal = this.removeHeadersFromStartOfContainer(rowHeaderContent, null, this.m_startRowHeaderPixel, rowThreshold, this.getMappedStyle('rowheadercell'), 'height', 'top', this.m_currentScrollTop);

            this.m_startRowHeaderPixel += returnVal.dimensionChange;
            this.m_startRowHeader += returnVal.extentChange;
        }
    }

    if ((this.m_endRowEndHeader - this.m_startRowEndHeader) > this.MAX_ROW_THRESHOLD)
{
        rowEndHeaderContent = this.m_rowEndHeader['firstChild'];
        rowThreshold = this.getRowThreshold();
        if (!(this.m_startRowEndHeaderPixel >= this.m_currentScrollTop - rowThreshold))
        {
            returnVal = this.removeHeadersFromStartOfContainer(rowEndHeaderContent, null, this.m_startRowEndHeaderPixel, rowThreshold, this.getMappedStyle('rowendheadercell'), 'height', 'top', this.m_currentScrollTop);

            this.m_startRowEndHeaderPixel += returnVal.dimensionChange;
            this.m_startRowEndHeader += returnVal.extentChange;
        }
    }
};

/**
 * Remove rows/cells above the current viewport
 * @param {Element} databody - the root of the databody
 */
DvtDataGrid.prototype.removeRowsFromTop = function(databody)
{
    var databodyContent, rowThreshold, row, height;
    if ((this.m_endRow - this.m_startRow) > this.MAX_ROW_THRESHOLD)
    {    
        databodyContent = databody['firstChild'];
        rowThreshold = this.getRowThreshold();
        if (this.m_startRowPixel >= this.m_currentScrollTop - rowThreshold)
        {
            return;
        }

        row = databodyContent['firstChild'];
        height = this.getElementHeight(row);
        // remove all rows from top until the threshold is reached
        while (this.m_startRowPixel + height < this.m_currentScrollTop - rowThreshold)
        {
            this._remove(row);

            this.m_startRowPixel = this.m_startRowPixel + height;
            this.m_startRow += 1;

            row = databodyContent['firstChild'];
            // if there's no more rows to remove from the databody
            if (row == null)
            {
                break;
            }
            height = this.getElementHeight(row);
        }
    }
};

/**
 * Remove row start and end headers below the current viewport
 */
DvtDataGrid.prototype.removeRowHeadersFromBottom = function()
{
    var rowHeaderContent, rowThreshold, returnVal, rowEndHeaderContent;
    rowThreshold = this.m_currentScrollTop + this.getViewportHeight() + this.getRowThreshold();

    // clean up bottom row headers
    if ((this.m_endRowHeader - this.m_startRowHeader) > this.MAX_ROW_THRESHOLD)
    {
        rowHeaderContent = this.m_rowHeader['firstChild'];
        // don't clean up if end of row header is not below the bottom of viewport
        if (!(this.m_endRowHeaderPixel <= rowThreshold))
        {
            if (this.m_stopRowHeaderFetch)
            {
                this.m_stopRowHeaderFetch = false;
            }

            returnVal = this.removeHeadersFromEndOfContainer(rowHeaderContent, this.m_endRowHeaderPixel, rowThreshold, this.getMappedStyle('rowheadercell'), 'height');

            this.m_endRowHeaderPixel -= returnVal.dimensionChange;
            this.m_endRowHeader -= returnVal.extentChange;
        }
    }

    // clean up bottom row headers
    if ((this.m_endRowEndHeader - this.m_startRowEndHeader) > this.MAX_ROW_THRESHOLD)
    {
        rowEndHeaderContent = this.m_rowEndHeader['firstChild'];
        // don't clean up if end of row header is not below the bottom of viewport
        if (!(this.m_endRowEndHeaderPixel <= rowThreshold))
        {
            if (this.m_stopRowEndHeaderFetch)
            {
                this.m_stopRowEndHeaderFetch = false;
            }

            returnVal = this.removeHeadersFromEndOfContainer(rowEndHeaderContent, this.m_endRowEndHeaderPixel, rowThreshold, this.getMappedStyle('rowendheadercell'), 'height');

            this.m_endRowEndHeaderPixel -= returnVal.dimensionChange;
            this.m_endRowEndHeader -= returnVal.extentChange;
        }
    }
};

/**
 * Remove rows/cells below the current viewport
 * @param {Element} databody - the root of the databody
 */
DvtDataGrid.prototype.removeRowsFromBottom = function(databody)
{
    var databodyContent, threshold, row, height;
    if ((this.m_endRow - this.m_startRow) > this.MAX_ROW_THRESHOLD)
    {    
        databodyContent = databody['firstChild'];
        threshold = this.m_currentScrollTop + this.getViewportHeight() + this.getRowThreshold();

        // don't clean up if end of row header is not below the bottom of viewport
        if (this.m_endRowPixel <= threshold)
        {
            return;
        }

        if (this.m_stopRowFetch)
        {
            this.m_stopRowFetch = false;
        }

        row = databodyContent['lastChild'];
        height = this.getElementHeight(row);
        while (this.m_endRowPixel - height > threshold)
        {
            this._remove(row);

            this.m_endRowPixel = this.m_endRowPixel - height;
            this.m_endRow -= 1;

            row = databodyContent['lastChild'];
            height = this.getElementHeight(row);
        }
    }
};

/**
 * Debugging method to dump out current range info
 */
DvtDataGrid.prototype.dumpRanges = function()
{
    if (console != undefined && console.log)
    {
        console.log("=================");
        console.log("Start Row: " + this.m_startRow);
        console.log("  End Row: " + this.m_endRow);
        console.log("Start Column: " + this.m_startCol);
        console.log("  End Column: " + this.m_endCol);
        console.log("=================");
    }
};
/*********************************** end scrolling/virtualization ************************************/

/*********************************** start dom event handling ***************************************/
/**
 * Handle the context menu gesture
 * @param {Event} event the event of the context menu gesture
 * @param {string} eventType keyboard/touch/mouse
 * @param {Function} callback where to pass the data back
 * @export
 */
DvtDataGrid.prototype.handleContextMenuGesture = function(event, eventType, callback)
{
    var index, element, capabilities, launcher, target;
    // if we are on a touch device and in a cell we need to set the correct active
    // and call focus before triggering the context menu to open. headers take
    // care of this by setting active in the 300ms callback for tap+short hold
    target = /** @type {Element} */ (event['originalEvent'].target);
    element = this.findCell(target);
    if (eventType === 'touch' && element != null)
    {
        index = {"row": this.getRowIndex(element['parentNode']), "column": this.getCellIndex(element)};
        // if right click and inside multiple selection or current active do not change anything
        if ((!this.isMultipleSelection() || !this._isContainSelection(index)) ||
                (this._isDatabodyCellActive() && index['row'] != this.m_active['indexes']['row'] && index['column'] != this.m_active['indexes']['column']))
        {
            if (this._isSelectionEnabled())
            {
                this.handleDatabodyClickSelection(event['originalEvent']);
            }
            else
            {
                //activate on a tap
                this.handleDatabodyClickActive(event['originalEvent']);
            }
        }
    }

    // first check if we are invoking on an editable or clickable element, if so bail
    if (this.m_utils._isNodeEditableOrClickable(target, this.m_root))
    {
        return;
    }

    // enable and disable context menu items depending on capability of the datasource and options
    // if the action was performed on a cell
    if (element != null)
    {
        index = {"row": this.getRowIndex(element['parentNode']), "column": this.getCellIndex(element)};         
        // if fired from inside a multiple selection
        if (this.isMultipleSelection() && this._isContainSelection(index))
        {
            launcher = this._getActiveElement();
            // if there is an active cell we want that to be the launcher of the context menu so
            // that focus can be restored to it. If it fired form the keyboard open with launcher and context
            // of the active cell, if right click or touch open with the context of the clicked cell
            if (this._isDatabodyCellActive())
            {
                capabilities = eventType === 'keyboard' ? this._getCellCapability(launcher) : this._getCellCapability(launcher, element);
            }
            // there is the case where header is active and entire row/column selected
            else
            {
                // the launcher will be the active header, and the context of the menu will be relative to the active header
                capabilities = this._getHeaderCapability(launcher, element);
            }
        }
        else
        {
            // open on the cell with its context
            launcher = element;
            capabilities = this._getCellCapability(launcher);
        }
    }
    else
    {
        element = this.findHeader(target);
        if (element == null)
        {
            // not a header or cell don't do anything
            return;
        }
        capabilities = this._getHeaderCapability(element);
        launcher = element;
    }

    callback.call(null, {'capabilities': capabilities, 'launcher': launcher}, event, eventType);
};

/**
 * Get the capabilities for context menu opened on a cell
 * @param {Element} cell the cell whose context we want
 * @param {Element=} actualCell the cell with context menu opened on it
 * @return {Object} capabilities object with props resize, resizeWidth, resizeHeight, sortRow, sortCol, cut, paste
 * @private
 */
DvtDataGrid.prototype._getCellCapability = function(cell, actualCell)
{
    var capabilities, rowHeader, columnHeader, resizable, sortable,
            sameColumn = true, sameRow = true, disable, enable, sorted;
    disable = 'disable';
    enable = 'enable';
    capabilities = {'resize': disable, 'resizeWidth': disable, 'resizeHeight': disable,
        'sortRow': disable, 'sortCol': disable, 'cut': disable, 'paste': disable,
        'sortColAsc': disable, 'sortColDsc': disable};

    // if there is an actual cell that means we want the context relative to that cell,
    // so if it is the same column, our column operations (resize width, sort column) can
    // be utilized. If it's in the same row the row operations (resize height, sort row, cut, paste)
    // can be utilized
    if (actualCell != null)
    {
        sameColumn = this.getCellIndex(cell) === this.getCellIndex(actualCell);
        sameRow = cell.parentNode === actualCell.parentNode;
        if (sameRow === false && sameColumn === false)
        {
            return capabilities;
        }
    }
    rowHeader = this.getHeaderFromCell(cell, 'row');
    columnHeader = this.getHeaderFromCell(cell, 'column');
    resizable = this.getResources().getMappedAttribute('resizable');
    sortable = this.getResources().getMappedAttribute('sortable');
    if (columnHeader != null && sameColumn)
    {
        if (columnHeader.getAttribute(resizable) === 'true')
        {
            capabilities['resize'] = enable;
            capabilities['resizeWidth'] = enable;
        }
        if (columnHeader.getAttribute(sortable) === 'true')
        {
            capabilities['sortCol'] = enable;
            capabilities['sortColAsc'] = enable;
            capabilities['sortColDsc'] = enable;
            sorted = columnHeader.getAttribute(this.getResources().getMappedAttribute('sortDir'));
            if (sorted === 'ascending')
            {
                capabilities['sortColAsc'] = disable;
            }
            else if (sorted === 'descending')
            {
                capabilities['sortColDsc'] = disable;
            }
        }
    }
    if (sameRow)
    {
        if (this._isMoveEnabled('row'))
        {
            capabilities['cut'] = enable;
            capabilities['paste'] = enable;
        }
        if (rowHeader != null)
        {
            if (rowHeader.getAttribute(resizable) === 'true')
            {
                capabilities['resize'] = enable;
                capabilities['resizeHeight'] = enable;
            }
            if (rowHeader.getAttribute(sortable) === 'true')
            {
                capabilities['sortRow'] = enable;
            }
        }
    }
    return capabilities;
};

/**
 * Get the capabilities for context menu opened on a header
 * @param {Element} header the header whose context we want
 * @param {Element=} actualCell the cell that we are actually opening on
 * @return {Object} capabilities object with props resizeWidth, resizeHeight, sortRow, sortCol
 * @private
 */
DvtDataGrid.prototype._getHeaderCapability = function(header, actualCell)
{
    var capabilities, resizable, sortable, sameColumn = true, sameRow = true, disable, enable, sorted, axis;
    disable = 'disable';
    enable = 'enable';
    capabilities = {'resize': disable, 'resizeWidth': disable, 'resizeHeight': disable,
        'sortRow': disable, 'sortCol': disable, 'cut': disable, 'paste': disable,
        'sortColAsc': disable, 'sortColDsc': disable};

    // if there is an actual cell that means we want the context relative to that cell,
    // so if it is the same column, our column operations (resize width, sort column) can
    // be utilized. If it's in the same row the row operations (resize height, sort row, cut, paste)
    // can be utilized
    if (actualCell != null)
    {
        sameColumn = this.getHeaderCellIndex(header) === this.getCellIndex(actualCell);
        sameRow = this._getKey(header) === this._getKey(actualCell.parentNode);
        if (sameRow === false && sameColumn === false)
        {
            return capabilities;
        }
    }

    axis = this.getHeaderCellAxis(header);
    resizable = this.getResources().getMappedAttribute('resizable');
    sortable = this.getResources().getMappedAttribute('sortable');
    if (header !== null)
    {
        if ((axis == 'column' || axis =='columnEnd') && sameColumn)
        {
            if (header.getAttribute(resizable) === 'true')
            {
                capabilities['resizeWidth'] = enable;
                capabilities['resize'] = enable;
            }
            capabilities['resizeHeight'] = this.m_options.isResizable(axis, 'height');
            if (header.getAttribute(sortable) === 'true')
            {
                capabilities['sortCol'] = enable;
                capabilities['sortColAsc'] = enable;
                capabilities['sortColDsc'] = enable;
                sorted = header.getAttribute(this.getResources().getMappedAttribute('sortDir'));
                if (sorted === 'ascending')
                {
                    capabilities['sortColAsc'] = disable;
                }
                else if (sorted === 'descending')
                {
                    capabilities['sortColDsc'] = disable;
                }
            }
        }
        else if (sameRow)
        {
            if (this._isMoveEnabled('row'))
            {
                capabilities['cut'] = enable;
                capabilities['paste'] = enable;
            }
            if (header.getAttribute(resizable) === 'true')
            {
                capabilities['resize'] = enable;
                capabilities['resizeHeight'] = enable;
            }
            capabilities['resizeWidth'] = this.m_options.isResizable(axis, 'width');
            if (header.getAttribute(sortable) === 'true')
            {
                capabilities['sortRow'] = enable;
            }
        }
    }
    capabilities['resize'] = capabilities['resizeHeight'] === enable ||
            capabilities['resizeWidth'] === enable ? enable : disable;

    return capabilities;
};

/**
 * Handle the callback from the widget to resize or sort.
 * @export
 * @param {Event} event - the original contextmenu event
 * @param {string} id - the id returned from the context menu
 * @param value - the value set in the dialog on resizing
 */
DvtDataGrid.prototype.handleContextMenuReturn = function(event, id, value)
{
    var target, direction;

    // the target is the active element at all times
    if (this.m_active != null)
    {
        target = this._getActiveElement();
    }

    if (id === this.m_resources.getMappedCommand('resizeHeight') || id === this.m_resources.getMappedCommand('resizeWidth'))
    {
        if ((this.isResizeEnabled()))
        {
            // target may not be (event.target)
            this.handleContextMenuResize(event, id, value, target);
        }
    }
    else if (id === this.m_resources.getMappedCommand('sortColAsc') || id === this.m_resources.getMappedCommand('sortColDsc'))
    {
        direction = id === this.m_resources.getMappedCommand('sortColAsc') ? 'ascending' : 'descending';
        if (this.m_utils.containsCSSClassName(target, this.getMappedStyle('cell')))
        {
            target = this.getHeaderFromCell(target, 'column');
        }
        if (this._isDOMElementSortable(target))
        {
            this._handleCellSort(event, direction, target);
        }
    }
    else if (id === this.m_resources.getMappedCommand('sortRowAsc') || id === this.m_resources.getMappedCommand('sortRowDsc'))
    {
        direction = id === this.m_resources.getMappedCommand('sortRowAsc') ? 'ascending' : 'descending';
        if (this.m_utils.containsCSSClassName(target, this.getMappedStyle('cell')))
        {
            target = this.getHeaderFromCell(target, 'row');
        }
        if (this._isDOMElementSortable(target))
        {
            this._handleCellSort(event, direction, target);
        }
    }
    else if (id === this.m_resources.getMappedCommand('cut'))
    {
        this._handleCut(event, target);
    }
    else if (id === this.m_resources.getMappedCommand('paste'))
    {
        this._handlePaste(event, target);
    }
    else if (id === this.m_resources.getMappedCommand('discontiguousSelection'))
    {
        // handle discontiguous selection context menu
        this.setDiscontiguousSelectionMode(value);
    }
};

/**
 * Determined if sort is supported for the specified axis.
 * @param {string} axis the axis which we check whether sort is supported.
 * @param {Object} headerContext the header context object
 * @private
 */
DvtDataGrid.prototype._isSortEnabled = function(axis, headerContext)
{
    var capability, sortable;
    capability = this.getDataSource().getCapability("sort");
    sortable = this.m_options.isSortable(axis, headerContext);
    if ((sortable === "enable" || sortable === "auto") && (capability === "full" || capability === axis))
    {
        return true;
    }

    return false;
};

/**
 * Determined if sort is supported for the specified element.
 * @param {Element|undefined} element to check if sorting should be on
 * @private
 */
DvtDataGrid.prototype._isDOMElementSortable = function(element)
{
    if (element == null)
    {
        return false;
    }    
    var header = this.findHeader(element);
    if (header == null)
    {
        return false;
    }
    return header.getAttribute(this.getResources().getMappedAttribute('sortable')) == "true";
};

/**
 * Check if selection enabled by options on the grid
 * @return {boolean} true if selection enabled
 * @private
 */
DvtDataGrid.prototype._isSelectionEnabled = function()
{
    return (this.m_options.getSelectionCardinality() != "none");
};

/**
 * Check whether multiple row/cell selection is allowed by options on the grid
 * @return {boolean} true if multipl selection enabled
 */
DvtDataGrid.prototype.isMultipleSelection = function()
{
    return (this.m_options.getSelectionCardinality() == "multiple");
};

/**
 * Check if resizing enabled on any header by options on the grid
 * @return {boolean} true if resize enabled
 */
DvtDataGrid.prototype.isResizeEnabled = function()
{
    return (this.m_options.isResizable('row', 'width') || this.m_options.isResizable('row', 'height') || 
            this.m_options.isResizable('column', 'width') || this.m_options.isResizable('column', 'height')|| 
            this.m_options.isResizable('rowEnd', 'width') || this.m_options.isResizable('rowEnd', 'height')|| 
            this.m_options.isResizable('columnEnd', 'width') || this.m_options.isResizable('columnEnd', 'height'));
};

/**
 * Check if resizing enabled on a specific header
 * @param {string} axis the axis which we check whether sort is supported.
 * @param {Object} headerContext the header context object
 * @return {boolean} true if resize enabled
 */
DvtDataGrid.prototype._isHeaderResizeEnabled = function(axis, headerContext)
{
    var resizable;
    if (axis == 'column' || axis == 'columnEnd')
    {
        resizable = this.m_options.isResizable(axis, 'width', headerContext);
        return resizable == 'enable' ? true : false;
    }
    else if (axis == 'row' || axis == 'rowEnd')
    {
        resizable = this.m_options.isResizable(axis, 'height', headerContext);
        return resizable == 'enable' ? true : false;
    }
    return false;
};

/**
 * Handle mousemove events on the document
 * @param {Event} event - mousemove event on the document
 */
DvtDataGrid.prototype.handleMouseMove = function(event)
{
    if (this.isResizeEnabled() && (this.m_databodyDragState == false))
    {
        this.handleResize(event);
    }
};

/**
 * Handle row header mousemove events on the document
 * @param {Event} event - mousemove event on the document
 */
DvtDataGrid.prototype.handleRowHeaderMouseMove = function(event)
{
    if (this.m_databodyMove)
    {
        this._handleMove(event);
    }
    // if it is resizing use the mouse move on the document    
    else if (!this.m_isResizing)
    {
        this.handleMouseMove(event);
    }
};

/**
 * Handle row header mousemove events on the document
 * @param {Event} event - mousemove event on the document
 */
DvtDataGrid.prototype.handleColumnHeaderMouseMove = function(event)
{
    // if it is resizing use the mouse move on the document
    if (!this.m_isResizing)
    {
        this.handleMouseMove(event);
    }
};

/**
 * Handle mousedown events on the headers
 * @param {Event} event - mousedown event on the headers
 */
DvtDataGrid.prototype.handleHeaderMouseDown = function(event)
{
    var cell, row, processed, target;

    this._exitActionableMode();
    target = /** @type {Element} */ (event.target);
    
    if (this._isEditOrEnter())
    {
        cell = this._getActiveElement();
        if (this._leaveEditing(event, cell, false) == false)
        {
            return;
        }
    }    
    
    //only perform events on left mouse, (right in rtl culture)
    if (event.button === 0)
    {
        //if mousedown in an icon it the click event will handle mousedown/up
        if ((this.m_utils.containsCSSClassName(target, this.getMappedStyle('sortascending')) ||
                this.m_utils.containsCSSClassName(target, this.getMappedStyle('sortdescending')))
                && this._isDOMElementSortable(target))
        {
            event.preventDefault();
            this._handleSortIconMouseDown(target);
            return;
        }

        //handle resize movements first if we're on the border
        if (this.isResizeEnabled())
        {
            processed = this.handleResizeMouseDown(event);
        }

        row = this.findRow(target);
        //if our move is enabled make sure our row has the active cell in it
        if (!this.m_isResizing && this._isMoveOnRowEnabled(row))
        {
            this.m_databodyMove = true;
            this.m_currentX = event['pageX'];
            this.m_currentY = event['pageY'];
            processed = true;
        }
    }

    // activate header on click or right click
    // this will also clear the selection
    if (!this.m_isResizing)
    {
        if (!this.m_root.contains(document.activeElement) || document.activeElement === this.m_root)
        {
            this.m_externalFocus = true;
        }
        this.handleHeaderClickActive(event);
    }

    if (processed === true)
    {
        event.preventDefault();
    }
};

/**
 * Handle mouseup events on the document
 * @param {Event} event - mouseup event on the document
 */
DvtDataGrid.prototype.handleMouseUp = function(event)
{
    //if we mouseup outside the grid we want to cancel the selection and return the row
    if (this.m_databodyMove)
    {
        this._handleMoveMouseUp(event, false);
    }
    else if (this.isResizeEnabled())
    {
        this.handleResizeMouseUp(event);
    }
    this.m_databodyMove = false;
};

DvtDataGrid.prototype.handleHeaderMouseOver = function(event)
{
    var target = /** @type {Element} */ (event.target);
    this.m_utils.addCSSClassName(this.findHeader(target), this.getMappedStyle('hover'));
    if (this._isDOMElementSortable(target))
    {
        this._handleSortMouseOver(event);
    }
};

DvtDataGrid.prototype.handleHeaderMouseOut = function(event)
{
    var target = /** @type {Element} */ (event.target);    
    this.m_utils.removeCSSClassName(this.findHeader(target), this.getMappedStyle('hover'));
    if (this._isDOMElementSortable(target))
    {
        this._handleSortMouseOut(event);
    }
};

DvtDataGrid.prototype.handleHeaderMouseUp = function(event)
{
    if (this.m_databodyMove)
    {
        this._handleMoveMouseUp(event, true);
    }
};

/**
 * Event handler for when row/column header is clicked
 * @protected
 * @param {Event} event - click event on the headers
 */
DvtDataGrid.prototype.handleHeaderClick = function(event)
{
    var target = /** @type {Element} */ (event.target);        
    if ((this.m_utils.containsCSSClassName(target, this.getMappedStyle('sortascending')) ||
            this.m_utils.containsCSSClassName(target, this.getMappedStyle('sortdescending')))
            && this._isDOMElementSortable(target))
    {
        this._handleHeaderSort(event);
        event.preventDefault();
    }
};

/**
 * Event handler for when mouse down anywhere in the databody
 * @protected
 * @param {Event} event - mousedown event on the databody
 */
DvtDataGrid.prototype.handleDatabodyMouseDown = function(event)
{
    var cell, activeCell, target;
    target = /** @type {Element} */ (event.target);
    cell = this.findCell(target);
    if (cell == null)
    {
        this.m_scrollbarFocus = true;
        return;
    }
    
    if (this._isEditOrEnter())
    {
        activeCell = this._getActiveElement();
        if (cell != activeCell)
        {
            if (this._leaveEditing(event, activeCell, false) == false)
            {
                return;
            }
        }
        else
        {
            return;
        }
    }
    else
    {
        // reset actionable mode whenever user clicks in the databody
        this._exitActionableMode();   
    }

    //only perform events on left mouse, (right in rtl culture)
    if (event.button === 0)
    {
        if (this._isMoveOnRowEnabled(this.find(target, 'row')))
        {
            this.m_databodyMove = true;
            this.m_currentX = event['pageX'];
            this.m_currentY = event['pageY'];
        }
    }

    if (!this.m_root.contains(document.activeElement) || document.activeElement === this.m_root)
    {
        this.m_externalFocus = true;
    }

    if (this._isGridEditable())
    {
        this.m_shouldFocus = !this._isFocusableElementBeforeCell(target);
    }

    // if click or right click we want to adjust the selction
    // no else so that we can select a cell in the same row as long as no drag
    // check if selection is enabled
    if (this._isSelectionEnabled())
    {
        this.handleDatabodyClickSelection(event);

        // only allow drag on left click
        if (this.isMultipleSelection() && event.button === 0)
        {
            this.m_databodyDragState = true;
        }
    }
    else
    {
        // if selection is disable, we'll still need to highlight the active cell
        this.handleDatabodyClickActive(event);
    }
};

DvtDataGrid.prototype.handleDatabodyMouseOut = function(event)
{
    var row, selectionMode, target;
    if (!this.m_databodyMove)
    {
        selectionMode = this.m_options.getSelectionMode();
        target = /** @type {Element} */ (event.target);    
        row = this.findRow(target);
        if (selectionMode === 'cell')
        {
            this.m_utils.removeCSSClassName(this.findCell(target), this.getMappedStyle('hover'));
        }
        else if (selectionMode === 'row')
        {
            this.m_utils.removeCSSClassName(row, this.getMappedStyle('hover'));
        }
    }
};

DvtDataGrid.prototype.handleDatabodyMouseOver = function(event)
{
    var row, selectionMode, target;
    if (!this.m_databodyMove)
    {
        selectionMode = this.m_options.getSelectionMode();
        target = /** @type {Element} */ (event.target);            
        row = this.findRow(target);
        if (selectionMode === 'cell')
        {
            this.m_utils.addCSSClassName(this.findCell(target), this.getMappedStyle('hover'));
        }
        else if (selectionMode === 'row')
        {
            this.m_utils.addCSSClassName(row, this.getMappedStyle('hover'));
        }
    }
};

DvtDataGrid.prototype.handleDatabodyDoubleClick = function(event)
{
    var target, cell, currentMode;
    if (this._isGridEditable())
    {
        target = event.target;
        cell = this.findCell(target);
        currentMode = this._getCurrentMode();
        if (currentMode == 'edit')
        {
            this._handleExitEdit(event, cell);
        }
        this._handleEditable(event, cell);
        this._handleEdit(event, cell);
    }
};

/**
 * Event handler for when mouse move anywhere in the databody
 * @protected
 * @param {Event} event - mousemove event on the databody
 */
DvtDataGrid.prototype.handleDatabodyMouseMove = function(event)
{
    //handle move first because it should happen first on the second click
    if (this.m_databodyMove)
    {
        this._handleMove(event);
    }
    else if (this.m_databodyDragState)
    {
        this.handleDatabodySelectionDrag(event);
    }
};

/**
 * Event handler for when mouse down anywhere in the databody
 * @protected
 * @param {Event} event - mouseup event on the databody
 */
DvtDataGrid.prototype.handleDatabodyMouseUp = function(event)
{
    this.m_databodyDragState = false;
    if (this.m_databodyMove)
    {
        this._handleMoveMouseUp(event, true);
    }
};

/**
 * Event handler for when user press down a key in the databody
 * @protected
 * @param {Event} event - keydown event on the databody
 */
DvtDataGrid.prototype.handleDatabodyKeyDown = function(event)
{
    var action, element, target;
    target = /** @type {Element} */ (event.target);

    // fire key down event (internal.  Used only by row expander for now)
    if (this._fireKeyDownEvent(event))
    {
        // check if header is active
        if (this.m_active != null && this.m_active['type'] == 'header')
        {
            action = this._getActionFromKeyDown(event, this.m_active['axis']);
        }
        else
        {
            action = this._getActionFromKeyDown(event, 'cell');
        }
        
        element = this._getActiveElement();

        if (action != null)
        {
            if (action.call(this, event, element))
            {
                event.preventDefault();            
            }
        }  
    }
};

/**
 * Handles when a key down is pressed on the databody or headers
 * @param {Event} event the DOM event
 * @private
 */
DvtDataGrid.prototype._fireKeyDownEvent = function(event)
{
    var rowKey, details;
    // keydown always acts on the active cell
    rowKey = this._getActiveRowKey();
    
    // the event contains the context info
    details = {
        'event': event, 'ui': {
            'rowKey': rowKey
        }
    };

    return this.fireEvent('keydown', details);
};

/**
 * Find top and left offset of an element relative to the (0,0) point on the page
 * @param {Element} element - the element to find left and top offset of
 * @return {Array.<number>} - [leftOffset, topOffset]
 */
DvtDataGrid.prototype.findPos = function(element)
{
    var parentPos, transform;
    if (element)
    {
        parentPos = this.findPos(element['offsetParent']);
        transform = this.getElementTranslationXYZ(element['offsetParent']);
        return [
            parseInt(parentPos[0], 10) + parseInt(element['offsetLeft'], 10) + transform[0],
            parseInt(parentPos[1], 10) + parseInt(element['offsetTop'], 10) + transform[1]
        ];
    }
    return [0, 0];
};

/**
 * Get an elements transform3d X,Y,Z
 * @param {Element} element - the element to find transform3d X,Y,Z of
 * @return {Array.<number>} - [transformX, transformY, transformZ]
 */
DvtDataGrid.prototype.getElementTranslationXYZ = function(element)
{
    var cs, transform, matrixArray, transformX, transformY, transformZ;
    if (element)
    {
        cs = document.defaultView.getComputedStyle(element, null);
        transform = cs.getPropertyValue("-webkit-transform") ||
                cs.getPropertyValue("-moz-transform") ||
                cs.getPropertyValue("-ms-transform") ||
                cs.getPropertyValue("-o-transform") ||
                cs.getPropertyValue("transform");
        matrixArray = transform.substr(7, transform.length - 8).split(', ');
        transformX = isNaN(parseInt(matrixArray[4], 10)) ? 0 : parseInt(matrixArray[4], 10);
        transformY = isNaN(parseInt(matrixArray[5], 10)) ? 0 : parseInt(matrixArray[5], 10);
        transformZ = isNaN(parseInt(matrixArray[6], 10)) ? 0 : parseInt(matrixArray[6], 10);
        return [transformX, transformY, transformZ];
    }
    return [0, 0, 0];
};



/**
 * Event handler for when mouse wheel is used on the databody
 * @param {Event} event - mousewheel event on the databody
 */
DvtDataGrid.prototype.handleDatabodyMouseWheel = function(event)
{
    var delta, deltaX, deltaY;
    // prevent scrolling of the page
    event.preventDefault();

    delta = this.m_utils.getMousewheelScrollDelta(event);

    deltaX = delta['deltaX'];
    deltaY = delta['deltaY'];

    this.scrollDelta(deltaX, deltaY);
};

/**************** touch related methods ********************/

/**
 * Event handler for when touch is started on the databody
 * @param {Event} event - touchstart event on the databody
 */
DvtDataGrid.prototype.handleTouchStart = function(event)
{
    var fingerCount, dir, selection, target;

    fingerCount = event.touches.length;
    target = /** @type {Element} */ (event.touches[0].target);
    
    // move = one finger swipe (or two?)
    if (fingerCount == 1)
    {
        // get the coordinates of the touch
        this.m_startX = event.touches[0].pageX;
        this.m_startY = event.touches[0].pageY;

        // need these to detect whether touch is hold and move vs. swipe
        this.m_currentX = this.m_startX;
        this.m_currentY = this.m_startY;
        this.m_prevX = this.m_startX;
        this.m_prevY = this.m_startY;
        this.m_startTime = (new Date()).getTime();

        // flag it
        this.m_touchActive = true;

        //if multiple select enabled check to see if the touch start was on a select affordance
        if (this.isMultipleSelection())
        {
            //if the target is not the container, but rather the icon itself, choose the container instead
            if (target['className'] === this.getMappedStyle("selectaffordancetop") || target['className'] === this.getMappedStyle("selectaffordancebottom"))
            {
                target = target['parentNode'];
            }

            //determine which icon was clicked on
            dir = target === this.m_topSelectIconContainer ? 'top' : target === this.m_bottomSelectIconContainer ? 'bottom' : null;

            if (dir)
            {
                //keeps track of multiple select mode
                this.m_touchMultipleSelect = true;
                selection = this.GetSelection();
                if (dir === 'top')
                {
                    //anchor is bottom right of selection for selecting top affordance
                    this.m_touchSelectAnchor = selection[selection.length - 1]['endIndex'];
                }
                else
                {
                    //anchor is top left of selection for selecting bottom affordance
                    this.m_touchSelectAnchor = selection[selection.length - 1]['startIndex'];
                }
            }
        }

        //if not multiple select, check for row reorder
        if (!this.m_touchMultipleSelect && this._isMoveOnRowEnabled(this.find(target, 'row')))
        {
            this.m_databodyMove = true;
        }
    }
    else
    {
        // more than one finger touched so cancel
        this.handleTouchCancel(event);
    }
};

/**
 * Event handler for when touch moves on the databody
 * @param {Event} event - touchmove event on the databody
 */
DvtDataGrid.prototype.handleTouchMove = function(event)
{
    var diffX, diffY, target;
    target = /** @type {Element} */ (event.target);
    
    if (this.m_touchActive)
    {
        event.preventDefault();
        this.m_currentX = event.touches[0].pageX;
        this.m_currentY = event.touches[0].pageY;

        diffX = this.m_currentX - this.m_prevX;
        diffY = this.m_currentY - this.m_prevY;
        if (this.getResources().isRTLMode())
        {
            diffX = diffX * -1;
        }

        if (this.m_touchMultipleSelect)
        {
            this.handleDatabodySelectionDrag(event);
        }
        else if (this.m_databodyMove)
        {
            this._removeTouchSelectionAffordance();
            this._handleMove(event);
        }
        else
        {
            if (this._isEditOrEnter())
            {
                var cell = this._getActiveElement();
                if (this.findCell(target) != cell)
                {
                    this._handleNonSwipeScroll(diffX, diffY);
                }
            }    
            else
            {
                this._handleNonSwipeScroll(diffX, diffY);
            }
        }

        this.m_prevX = this.m_currentX;
        this.m_prevY = this.m_currentY;
    }
    else
    {
        this.handleTouchCancel(event);
    }
};

/**
 * Event handler for when touch ends on the databody
 * @param {Event} event - touchend event on the databody
 */
DvtDataGrid.prototype.handleTouchEnd = function(event)
{
    var duration, cell, target;
    target = /** @type {Element} */ (event.target);

    if (this._isEditOrEnter())
    {
        cell = this._getActiveElement();
        if (this.findCell(target) != cell)
        {
            this._leaveEditing(event, cell, false);
        }
        else
        {
            this.handleTouchCancel(event);
            return;
        }
    }    
    else
    {
        // reset actionable mode whenever user clicks in the databody
        this._exitActionableMode();   
    }    
    
    if (this.m_lastTapTime != null && (this.m_startTime - this.m_lastTapTime) < 250 && this.m_lastTapTarget === target)
    {
        this.m_lastTapTime = null;
        this.m_lastTapTarget = null;   
        cell = this.findCell(target);
        if (cell != null)
        {
            this._handleEditable(event, cell);
            this._handleEdit(event, cell);
            event.preventDefault();
        }
    }       
    else
    {
        this.m_lastTapTarget = event.target;    
        this.m_lastTapTime = (new Date()).getTime();    
    }
    
    if (this.m_touchActive && !event.defaultPrevented)
    {
        if (this.m_touchMultipleSelect)
        {
            event.preventDefault();
            this.m_touchMultipleSelect = false;
        }
        else
        {
            duration = this.m_lastTapTime - this.m_startTime;
            if (this.m_currentX == this.m_startX && this.m_currentY == this.m_startY)
            {
                // this means we performed a tap within the row with the active cell
                // and it wasn't actually a move, also only change selection on a tap
                // outside of the current selection, if it was longer than context menu the
                // handleContextMenuGesture will have changed this
                this.m_databodyMove = false;
                if (this._isSelectionEnabled() && duration < DvtDataGrid.CONTEXT_MENU_TAP_HOLD_DURATION)
                {
                    this.handleDatabodyClickSelection(event);
                    return;
                }
                else
                {
                    //activate on a tap
                    this.handleDatabodyClickActive(event);
                    return;
                }
            }

            if (this.m_databodyMove)
            {
                event.preventDefault();
                this.m_databodyMove = false;
                this._handleMoveMouseUp(event, true);
                return;
            }

            this._handleSwipe(event);
        }

    }

    this.handleTouchCancel(event);
};

/**
 * Calculate the momentum based on the distance and duration of the swipe
 * @param {number} current the current touch position
 * @param {number} start the start touch position
 * @param {number} time the duration of the swipe
 * @param {number} currentScroll the current scroll position
 * @param {number} maxScroll the maximum scroll position
 * @param {boolean=} rtl true if right to left, false if left to right, undefined if determining momentum in Y direction
 * @return {Object} an object with three keys:
 *                      destination - the point to scroll to with the momentum
 *                      overScroll - the pixel amount that is scrolled beyond the scrollable region
 *                      duration - the duration of the scroll to that destination
 * @private
 */
DvtDataGrid.prototype._calculateMomentum = function(current, start, time, currentScroll, maxScroll, rtl)
{
    var distance, speed, destination, duration, overScroll;

    distance = current - start;
    speed = Math.abs(distance) / time;
    destination = (speed * speed) / (2 * DvtDataGrid.DECELERATION_FACTOR) * (distance < 0 ? -1 : 1);
    duration = speed / DvtDataGrid.DECELERATION_FACTOR;

    if (rtl)
    {
        destination = destination * -1;
    }

    // if the distance overshoots, then we'll have to adjust and recalculate the duration
    if (currentScroll - destination > maxScroll)
    {
        // too far bottom/right
        overScroll = Math.max(DvtDataGrid.MAX_OVERSCROLL_PIXEL * -1, destination);
        destination = currentScroll - maxScroll;
        distance = maxScroll - currentScroll;
        duration = distance / speed;
    }
    else if (currentScroll - destination < 0)
    {
        // too far top/left
        overScroll = Math.min(DvtDataGrid.MAX_OVERSCROLL_PIXEL, destination);
        destination = currentScroll;
        distance = currentScroll;
        duration = distance / speed;
    }

    return {
        destination: Math.round(destination),
        // durations can be up to 4s currently let's cap them at 500ms
        duration: Math.min(Math.max(DvtDataGrid.MIN_SWIPE_TRANSITION_DURATION, duration), DvtDataGrid.MAX_SWIPE_TRANSITION_DURATION),
        overScroll: overScroll
    };
};

/**
 * Event handler for when touch is cancelled on the databody
 * @param {Event} event - touchcancel event on the databody
 */
DvtDataGrid.prototype.handleTouchCancel = function(event)
{
    if (this.m_databodyMove)
    {
        this._handleMoveMouseUp(event, false);
        this.m_databodyMove = false;
    }
    this.m_touchSelectAnchor = null;
    this.m_touchMultipleSelect = false;
    // reset the variables back to default values
    this.m_touchActive = false;
    this.m_startX = 0;
    this.m_startY = 0;
    this.m_prevX = 0;
    this.m_prevY = 0;
    this.m_currentX = 0;
    this.m_currentY = 0;
    this.m_startTime = 0;
};

/**
 * Event handler for when touch is started on the header
 * @param {Event} event - touchstart event on the header
 */
DvtDataGrid.prototype.handleHeaderTouchStart = function(event)
{
    var header, fingerCount, target;

    //store start time of touch
    this.m_touchStart = (new Date()).getTime();

    fingerCount = event.touches.length;
    target = /** @type {Element} */ (event.target);
    
    // move = one finger swipe (or two?)
    if (fingerCount == 1)
    {
        // get the coordinates of the touch
        this.m_startX = event.touches[0].pageX;
        this.m_startY = event.touches[0].pageY;

        // need these to detect whether touch is hold and move vs. swipe
        this.m_currentX = this.m_startX;
        this.m_currentY = this.m_startY;
        this.m_prevX = this.m_startX;
        this.m_prevY = this.m_startY;

        // flag it
        this.m_touchActive = true;
        header = this.findHeader(target);

        //after 300ms set the header active color as feedback if finger still down and not resizing
        //Jim suggested the change to a shorter value and it looks much cleaner and easier to use
        //No longer remove after 1000ms because we are setting active if context menu is brought up
        //Don't change the active on an in header scroll either
        setTimeout(function() {
            if (this.m_touchActive && !this.m_isResizing &&
                    this.m_currentX == this.m_startX && this.m_currentY == this.m_startY)
            {
                this._removeTouchSelectionAffordance();
                //tap and hold sets header active
                this._setActive(header, event, true);
            }
        }.bind(this), DvtDataGrid.HEADER_TAP_SHORT_HOLD_DURATION);

        if (this.isResizeEnabled())
        {
            this.handleResize(event);
            this.handleResizeMouseDown(event);
        }

        //allow row reorder on headers if our move is enabled make sure our row has the active cell in it
        if (!this.m_isResizing && this._isMoveOnRowEnabled(this.findRow(target)))
        {
            this.m_databodyMove = true;
        }
    }
    else
    {
        // more than one finger touched so cancel
        this.handleHeaderTouchCancel(event);
    }
};


/**
 * Event handler for when touch moves on the header
 * @param {Event} event - touchmove event on the header
 */
DvtDataGrid.prototype.handleHeaderTouchMove = function(event)
{
    var diffX, diffY, header, target, axis;

    if (this.m_touchActive)
    {
        event.preventDefault();

        this.m_currentX = event.touches[0].pageX;
        this.m_currentY = event.touches[0].pageY;

        diffX = this.m_currentX - this.m_prevX;
        diffY = this.m_currentY - this.m_prevY;

        if (this.m_isResizing && this.isResizeEnabled())
        {
            this.handleResize(event);
        }
        else if (this.m_databodyMove)
        {
            this._removeTouchSelectionAffordance();
            this._handleMove(event);
        }
        else
        {
            target = /** @type {Element} */ (event.target);
            // can't swipe column headers in Y and row headers in X
            header = this.findHeader(target);
            axis = this.getHeaderCellAxis(header);
            if (axis == 'column' || axis == 'columnEnd')
            {
                this._handleNonSwipeScroll(diffX, 0);
            }
            else
            {
                this._handleNonSwipeScroll(0, diffY);
            }
        }

        this.m_prevX = this.m_currentX;
        this.m_prevY = this.m_currentY;
    }
    else
    {
        this.handleTouchCancel(event);
    }
};

/**
 * Event handler for when touch ends on the header
 * @param {Event} event - touchend event on the header
 */
DvtDataGrid.prototype.handleHeaderTouchEnd = function(event)
{
    var touchEnd, touchLength, tapMax = DvtDataGrid.HEADER_TAP_SHORT_HOLD_DURATION, header, target;

    //calculate the end of touch time for tap and hold
    touchEnd = (new Date()).getTime();
    touchLength = touchEnd - this.m_touchStart;

    if (this.m_touchActive && !event.defaultPrevented)
    {
        target = /** @type {Element} */ (event.target);
        
        // if resizing handle resize first so that we don't conflict and forget to end
        if (this.m_isResizing && this.isResizeEnabled())
        {
            this.handleResizeMouseUp(event);
            if (this.m_currentX != this.m_startX && this.m_currentY != this.m_startY)
            {
                event.preventDefault();
            }
        }
        // if a short tap sort
        else if (this.m_currentX == this.m_startX && this.m_currentY == this.m_startY && touchLength < tapMax)
        {
            if (this._isDOMElementSortable(target))
            {
                event.preventDefault();
                this._handleHeaderSort(event);
                this._removeTouchSelectionAffordance();
            }
        }
        // if reordering a row
        else if (this.m_databodyMove)
        {
            event.preventDefault();
            this.m_databodyMove = false;
            this._handleMoveMouseUp(event, true);
        }
        //handle potential swipe
        else
        {
            header = this.findHeader(target);
            this._handleSwipe(event, this.getHeaderCellAxis(header));
        }
        //tap and long hold shows context menu, through the wrapper layer
    }
    this.handleHeaderTouchCancel(event);
};

/**
 * Event handler for when touch is cancelled on the header
 * @param {Event} event - touchcancel event on the header
 */
DvtDataGrid.prototype.handleHeaderTouchCancel = function(event)
{
    if (this.m_databodyMove)
    {
        this._handleMoveMouseUp(event, false);
        this.m_databodyMove = false;
    }
    // reset the variables back to default values
    this.m_touchActive = false;
    this.m_startX = 0;
    this.m_startY = 0;
    this.m_prevX = 0;
    this.m_prevY = 0;
    this.m_currentX = 0;
    this.m_currentY = 0;
};

/**
 * Handle a touch scroll that is a slow drag
 * @param {number} diffX
 * @param {number} diffY
 */
DvtDataGrid.prototype._handleNonSwipeScroll = function(diffX, diffY)
{
    var time = (new Date()).getTime();
    // for non-swipe scroll use 0ms to prevent jiggling
    this._disableTouchScrollAnimation();

    this.scrollDelta(diffX, diffY);

    // reset start position if this is a tap and scroll, so that we can handle
    // user doing a swipe at the end
    if (time - this.m_startTime > DvtDataGrid.TAP_AND_SCROLL_RESET)
    {
        this.m_startX = this.m_currentX;
        this.m_startY = this.m_currentY;
        this.m_startTime = (new Date()).getTime();
    }
};

/**
 * Event handler for when touch swipe may have been detected
 * @param {Event} event - touchcancel event on the header
 * @param {string|null=} axis - if a header the header axis so we don't swipe in the direction
 */
DvtDataGrid.prototype._handleSwipe = function(event, axis)
{
    var duration, rtl, diffX, diffY, momentumX, momentumY, transitionDuration;
    duration = (new Date()).getTime() - this.m_startTime;
    rtl = this.getResources().isRTLMode();
    diffX = this.m_currentX - this.m_startX;
    diffY = this.m_currentY - this.m_startY;
    // if right to left the difference is the opposite on swipe
    if (rtl)
    {
        diffX = diffX * -1;
    }
    // detect whether this is a swipe
    if (Math.abs(diffX) < DvtDataGrid.MIN_SWIPE_DISTANCE && Math.abs(diffY) < DvtDataGrid.MIN_SWIPE_DISTANCE && duration < DvtDataGrid.MIN_SWIPE_DURATION)
    {
        event.preventDefault();
        //center touch affordances if row selection multiple
        if (this._isSelectionEnabled())
        {
            this._scrollTouchSelectionAffordance();
        }
    }
    // swipe case
    else if (duration < DvtDataGrid.MAX_SWIPE_DURATION)
    {
        event.preventDefault();
        if (axis != 'row' && axis != 'rowEnd')
        {
            // calculate momentum
            momentumX = this._calculateMomentum(this.m_currentX, this.m_startX, duration, this.m_currentScrollLeft, this.m_scrollWidth, rtl);
            if (!isNaN(momentumX.overScroll))
            {
                // don't overscroll if there's more rows to fetch
                if (momentumX.overScroll > 0 || this.m_stopColumnFetch)
                {
                    this.m_extraScrollOverX = momentumX.overScroll * -1;
                }
            }
        }
        else
        {
            momentumX = {duration: 0, destination: 0};
            diffX = 0;
        }

        if (axis != 'column' && axis != 'columnEnd')
        {
            momentumY = this._calculateMomentum(this.m_currentY, this.m_startY, duration, this.m_currentScrollTop, this.m_scrollHeight);
            if (!isNaN(momentumY.overScroll))
            {
                // don't overscroll if there's more rows to fetch
                if (momentumY.overScroll > 0 || this.m_stopRowFetch)
                {
                    this.m_extraScrollOverY = momentumY.overScroll * -1;
                }
            }
        }
        else
        {
            momentumY = {duration: 0, destination: 0};
            diffY = 0;
        }

        transitionDuration = Math.max(momentumX.duration, momentumY.duration);
        this.m_databody['firstChild'].style.webkitTransitionDuration = transitionDuration + 'ms';
        this.m_rowHeader['firstChild'].style.webkitTransitionDuration = transitionDuration + 'ms';
        this.m_colHeader['firstChild'].style.webkitTransitionDuration = transitionDuration + 'ms';
        this.m_rowEndHeader['firstChild'].style.webkitTransitionDuration = transitionDuration + 'ms';
        this.m_colEndHeader['firstChild'].style.webkitTransitionDuration = transitionDuration + 'ms';
        this.scrollDelta(diffX + momentumX.destination, diffY + momentumY.destination);
    }
};

/************* end touch related methods ********************/

/**
 * Callback on a widget listener
 * @param {string} functionName - the function name to look up in the callbacks
 * @param {Object} details - the object to pass into the callback function
 * @return {boolean|undefined} true if event passes, false if vetoed
 */
DvtDataGrid.prototype.fireEvent = function(functionName, details)
{
    var callback;
    if (functionName == null || details == null)
    {
        return;
    }

    callback = this.callbacks[functionName];
    if (callback != null)
    {
        return callback(details);
    }
    return true;
};

/**
 * Add a callback function to the callbacks object
 * @param {string} functionName - the function name to callback on
 * @param {Object.<Function>} handler - the function to callback to
 * @export
 */
DvtDataGrid.prototype.addListener = function(functionName, handler)
{
    this.callbacks[functionName] = handler;
};
/*********************************** end dom event handling ***************************************/

/**
 * Set the style height on an element in pixels
 * @param {Element} elem - the element to set height on
 * @param {number} height - the pixel height to set the element to
 */
DvtDataGrid.prototype.setElementHeight = function(elem, height)
{
    elem['style']['height'] = height + "px";
};

/**
 * Get a number of the style height of an element
 * @param {Element|undefined|null} elem - the element to get height on
 * @return {number} the style height of the element
 */
DvtDataGrid.prototype.getElementHeight = function(elem)
{
    return this.getElementDir(elem, 'height');
};

/**
 * Set the style width on an element in pixels
 * @param {Element} elem - the element to set width on
 * @param {number} width - the pixel width to set the element to
 */
DvtDataGrid.prototype.setElementWidth = function(elem, width)
{
    elem['style']['width'] = width + "px";
};

/**
 * Get a number of the style pixel width of an element
 * @param {Element|undefined|null} elem - the element to get width on
 * @return {number} the style width of the element
 */
DvtDataGrid.prototype.getElementWidth = function(elem)
{
    return this.getElementDir(elem, 'width');
};

/**
 * Set the style left/right/top/bottom on an element in pixels
 * @param {Element|undefined|null} elem - the element to set width on
 * @param {number} pix - the pixel width to set the element to
 * @param {string} dir - 'left','right','top,'bottom'
 * */
DvtDataGrid.prototype.setElementDir = function(elem, pix, dir)
{
    elem['style'][dir] = pix + "px";
};

/**
 * Get a number of the style left/right/top/bottom of an element
 * @param {Element|undefined|null} elem - the element to get style left/right/top/bottom on
 * @param {string} dir - 'left','right','top,'bottom'
 * @return {number} the style left/right/top/bottom of the element
 */
DvtDataGrid.prototype.getElementDir = function(elem, dir)
{
    var value;
    if (elem['style'][dir].indexOf('px') > -1 && elem['style'][dir].indexOf('e') == -1)
    {
        // parseFloat does better with big numbers
        return parseFloat(elem['style'][dir]);
    }
    
    if (!document.body.contains(elem))
    {
        elem['style']['visibility'] = "hidden";
        document.body.appendChild(elem); //@HTMLUpdateOK
        // Started using offset again because of how it handles large numbers and limits on BoundingClient
        value = Math.round(elem['offset' + dir.charAt(0).toUpperCase() + dir.slice(1)]);
        document.body.removeChild(elem);        
        elem['style']['visibility'] = "";
    }
    else
    {
        value = Math.round(elem['offset' + dir.charAt(0).toUpperCase() + dir.slice(1)]);
    }
    return value;
};

/************************* Model change event *****************************************/
/**
 * @private
 */
DvtDataGrid.BEFORE = 1;

/**
 * @private
 */
DvtDataGrid.AFTER = 2;

/**
 * @private
 */
DvtDataGrid.INSIDE = 3;

/**
 * Checks whether an index (row/column) is within the range of the current viewport.
 * @param {Object} indexes the row and column indexes
 * @return {number} BEFORE if the index is before the current viewport, AFTER if the index is after
 *         the current viewport, INSIDE if the index is within the current viewport
 * @private
 */
DvtDataGrid.prototype._isInViewport = function(indexes)
{
    var rowIndex, columnIndex;

    rowIndex = indexes['row'];
    columnIndex = indexes['column'];

    if (rowIndex === -1 && columnIndex === -1)
    {
        // actually, this is an invalid index... should throw an error?
        return -1;
    }

    // if row index wasn't specified, just verify the column range
    if (rowIndex === -1)
    {
        if (columnIndex < this.m_startCol)
        {
            return DvtDataGrid.BEFORE;
        }

        if (columnIndex > this.m_endCol)
        {
            return DvtDataGrid.AFTER;
        }

        // if it's not before or after, it must be inside
        return DvtDataGrid.INSIDE;
    }

    // if column index wasn't specified, just verify the row range
    if (columnIndex === -1)
    {
        if (rowIndex < this.m_startRow)
        {
            return DvtDataGrid.BEFORE;
        }

        if (rowIndex > this.m_endRow)
        {
            return DvtDataGrid.AFTER;
        }

        // if it's not before or after, it must be inside
        return DvtDataGrid.INSIDE;
    }

    // both row and column index are defined, then check both ranges
    if (columnIndex >= this.m_startCol && columnIndex <= this.m_endCol && rowIndex >= this.m_startRow && rowIndex <= this.m_endRow)
    {
        return DvtDataGrid.INSIDE;
    }

    // undefined
    return -1;
};

/**
 * @param {Object} event the model event
 * @return {boolean} true if event is queued, false otherwise
 * @private
 */
DvtDataGrid.prototype.queueModelEvent = function(event)
{
    // in case if the model event arrives before the grid is fully rendered or the event arrives during processing
    // of model queue or we are in the middle of processing/animation model event, queue the event and handle it later
    if (!this.m_initialized || this.m_processingEventQueue || this.m_animating || this.m_processingModelEvent)
    {
        if (this.m_modelEvents == null)
        {
            this.m_modelEvents = [];
        }
        this.m_modelEvents.push(event);
        return true;
    }

    return false;
};

/**
 * Model event handler
 * @param {Object} event the model change event
 * @param {boolean} fromQueue whether this is invoked from model queue processing, optional
 * @protected
 */
DvtDataGrid.prototype.handleModelEvent = function(event, fromQueue)
{
    var operation, keys, cellSet, headerSet, endHeaderSet, indexes, source, silent;

    // in case if the model event arrives before the grid is fully rendered,
    // queue the event and handle it later
    if (fromQueue === undefined && this.queueModelEvent(event))
    {
        return;
    }

    operation = event['operation'];
    keys = event['keys'];
    source = event['source'];
    indexes = event['indexes'];
    cellSet = event['result'];
    headerSet = event['header'];
    endHeaderSet = event['endheader'];
    silent = event['silent'];

    this.m_processingModelEvent = true;

    if (operation === 'insert')
    {
        this._adjustActive(operation, indexes);
        this._adjustSelectionOnModelChange(operation, keys, indexes);

        if (cellSet != null)
        {
            // range insert event with cellset returned
            this._handleModelInsertRangeEvent(cellSet, headerSet, endHeaderSet);
            }
            else
            {
            this._handleModelInsertEvent(indexes, keys);
        }
    }
    else if (operation === 'update')
    {
        this._handleModelUpdateEvent(indexes, keys);
    }
    else if (operation === 'delete')
    {
        // adjust selection if neccessary
        // do this before the rows in the databody is mutate
        // (easier this way because of animation delays, plus the selection is immediately updated
        // to reflect the updated state)
        this._adjustActive(operation, indexes);
        this._adjustSelectionOnModelChange(operation, keys, indexes);

        if (source && oj.FlattenedTreeDataGridDataSource && source instanceof oj.FlattenedTreeDataGridDataSource && this.m_utils.supportsTransitions())
        {
            this._handleModelDeleteEventWithAnimation(keys);
        }
        else
        {
            this._handleModelDeleteEvent(indexes, keys, silent);
        }
    }
    else if (operation === 'refresh' || operation === 'reset')
    {
        this._handleModelRefreshEvent();
    }
    else if (operation === 'sync')
    {
        this._handleModelSyncEvent(event);
    }

    this.m_processingModelEvent = false;
};

/**
 * Adjust selection ranges if neccessary on insert or delete.
 * @param {string} operation the model event operation which triggers selection adjustment.
 * @param {Object} indexes the indexes that identify the rows that got inserted/deleted.
 * @private
 */
DvtDataGrid.prototype._adjustActive = function(operation, indexes)
{
    var activeRowIndex, i, rowIndex, activeHeader, adjustment = 0;

    if (this.m_active != null)
    {
        if(this.m_active['type'] == 'cell')
        {
            activeHeader = false;
            activeRowIndex = this.m_active['indexes']['row'];
        }
        else if (this.m_active['axis'] === 'row')
        {
            activeHeader = true;
            activeRowIndex = this.m_active['index'];
        }
        else
        {
            return;
        }
    }
    else
    {
        return;
    }

    if (!Array.isArray(indexes))
    {
        indexes = new Array(indexes);
    }

    //if we are getting this from a move event
    if (this.m_moveActive === true)
    {
        if (operation === 'insert')
        {
            if (!activeHeader)
            {
                this.m_active['indexes']['row'] = indexes[0]['row'];
            }
            else
            {
                this.m_active['index'] = indexes[0]['row'];
            }
            return;
        }
        else if (operation === 'delete' && indexes[0]['row'] === activeRowIndex)
        {
            // do not clear the active since we know the active should be the
            // same once the moved row is returned via insert
            return;
        }
    }

    adjustment = operation === 'insert' ? 1 : -1;

    for (i = 0; i < indexes.length; i++)
    {
        rowIndex = indexes[i]['row'];
        if (rowIndex < activeRowIndex)
        {
            if (!activeHeader)
            {
                this.m_active['indexes']['row'] += adjustment;
            }
            else
            {
                this.m_active['index'] += adjustment;
            }
        }
        else if (rowIndex === activeRowIndex && operation === 'delete')
        {
            this._setActive(null);
        }
    }
};

/**
 * Adjust selection ranges if neccessary on insert or delete.
 * @param {string} operation the model event operation which triggers selection adjustment.
 * @param {Object} keys the keys that identify the rows that got inserted/deleted.
 * @param {Object} indexes the indexes that identify the rows that got inserted/deleted.
 * @private
 */
DvtDataGrid.prototype._adjustSelectionOnModelChange = function(operation, keys, indexes)
{
    var selection, i, rowKey, rowIndex, j, range, startRowKey, endRowKey, startRowIndex, endRowIndex, newRowKey, adjustment, movedRow;

    // make it an array if it's a single entry event
    if (!Array.isArray(keys))
    {
        keys = new Array(keys);
    }

    if (!Array.isArray(indexes))
    {
        indexes = new Array(indexes);
    }

    selection = this.GetSelection();

    if (keys == null || indexes == null || keys.length != indexes.length || selection.length == 0)
    {
        // on a move reset the selection
        if (this.m_moveActive && operation == 'insert')
        {
            if (this._isSelectionEnabled() && this._isDatabodyCellActive())
            {
                if (this.m_options.getSelectionMode() == 'cell')
                {
                    movedRow = this.createRange(this.m_active['indexes'], this.m_active['indexes'], keys[0], keys[0]);
                }
                else
                {
                    movedRow = this.createRange(indexes[0], indexes[0], keys[0], keys[0]);
                }
                this.m_selectionFrontier = this.m_active['indexes'];
                selection.push(movedRow);
            }
            this.m_moveActive = false;
        }
        // we are done
        return;
    }

    adjustment = operation === 'insert' ? 1 : -1;

    for (i = 0; i < keys.length; i++)
    {
        rowKey = keys[i]['row'];
        rowIndex = indexes[i]['row'];

        // have to do this backwards since we'll be mutating the array at the same time
        j = selection.length;
        while (j--)
        {
            range = selection[j];
            startRowKey = range['startKey']['row'];
            endRowKey = range['endKey']['row'];
            startRowIndex = range['startIndex']['row'];
            endRowIndex = range['endIndex']['row'];

            if (startRowKey == rowKey)
            {
                if (endRowKey == rowKey)
                {
                    // single row in range, and it has been deleted, so remove from selection
                    if (operation == 'delete')
                    {
                        selection.splice(j, 1);
                        continue;
                    }
                }

                // adjust start key, index stays the same
                // adjust end index, end key stays the same
                // get the key of the next row, which will become the new start key
                newRowKey = this._getKey(this.m_databody['firstChild']['childNodes'][range['startIndex']['row'] + 1 - this.m_startRow]);
                range['startKey']['row'] = newRowKey;
                range['endIndex']['row'] += adjustment;
            }
            else if (endRowKey == rowKey)
            {
                // adjust end key and end index
                // get the key of the next row, which will become the new start key
                newRowKey = this._getKey(this.m_databody['firstChild']['childNodes'][range['endIndex']['row'] - 1 - this.m_startRow]);
                range['endKey']['row'] = newRowKey;
                range['endIndex']['row'] += adjustment;
            }
            else if (rowIndex < startRowIndex)
            {
                // before start index, so adjust both start and end index
                range['startIndex']['row'] += adjustment;
                range['endIndex']['row'] += adjustment;
            }
            else if (rowIndex < endRowIndex)
            {
                // something in between start and end selection, adjust the end index
                range['endIndex']['row'] += adjustment;
            }
        }
    }
};

/**
 * Handles model insert event
 * @param {Object} indexes the indexes that identifies the row that got updated.
 * @param {Object} keys the key that identifies the row that got updated.
 * @private
 */
DvtDataGrid.prototype._handleModelInsertEvent = function(indexes, keys)
{
    var flag, row, rowHeader, rowEndHeader;
    // checks if the new row/column is in the viewport
    flag = this._isInViewport(indexes);
    //If the model inserted is just the next model fetch it
    if (flag === DvtDataGrid.INSIDE || (flag === DvtDataGrid.AFTER && indexes['row'] == (this.m_endRow + 1)))
    {
        // an insert can only be a insert new row or new column.  A cell insert is
        // automatically treated as row insert, keys['row'/'column'] can be the number 0
        if (keys['row'] != null)
        {
            //if we have added to an empty grid just refresh, so we can fetch all headers
            if (this._databodyEmpty())
            {
                this.empty();
                this.refresh(this.m_root);
            }
            else
            {
                this.fetchHeaders("row", indexes['row'], this.m_rowHeader, this.m_rowEndHeader, 1, {"success": this._handleHeaderInsertsFetchSuccess});
                this.fetchCells(this.m_databody, indexes['row'], this.m_startCol, 1, this.m_endCol - this.m_startCol + 1, {"success": this._handleCellInsertsFetchSuccess});
            }
        }
        //else if (keys['column'] != null)
        //{
            // todo: handle column insert
        //}
    }
    else
    {
        if (flag === DvtDataGrid.BEFORE)
        {
            this.m_startRow++;
            this.m_startRowHeader++;
            this.m_endRow++;
            this.m_endRowHeader++;
            this.m_startRowPixel += this.m_avgRowHeight;
            this.m_startRowHeaderPixel += this.m_avgRowHeight;
            this.m_endRowPixel += this.m_avgRowHeight;
            this.m_endRowHeaderPixel += this.m_avgRowHeight;
            row = this.m_databody['firstChild']['firstChild'];
            if (row != null)
            {
                this.pushRowsDown(row, this.m_avgRowHeight);
            }
            rowHeader = this.m_rowHeader['firstChild']['firstChild'];
            if (rowHeader != null)
            {
                this.pushRowsDown(rowHeader, this.m_avgRowHeight);
            }
            rowEndHeader = this.m_rowEndHeader['firstChild']['firstChild'];
            if (rowEndHeader != null)
            {
                this.pushRowsDown(rowEndHeader, this.m_avgRowHeight);
        }
        }

        this.scrollToIndex(indexes);
    }
};

/**
 * Handle a successful call to the data source fetchCells. Update the row and
 * cell DOM elements when necessary.
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRanges - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 */
DvtDataGrid.prototype._handleCellInsertsFetchSuccess = function(cellSet, cellRanges)
{
    var rowStart;

    // so that grid will be resize
    this.m_initialized = false;

    // insert the row
    this.handleCellsFetchSuccess(cellSet, cellRanges, this.m_endRow >= cellRanges[0]['start']);

    // make sure the new row is in range
    rowStart = cellRanges[0]['start'];
    this._scrollRowIntoViewport(rowStart);

    // clean up rows outside of viewport (for non-highwatermark scrolling only)
    if (!this._isHighWatermarkScrolling())
    {
        this._cleanupViewport('top');
    }
    this.updateRowBanding();
    this.m_stopRowFetch = false;
    if (this.m_endRowHeader != -1)
    {
        this.m_stopRowHeaderFetch = false;
    }
    if (this.m_endRowEndHeader != -1)
    {
        this.m_stopRowEndHeaderFetch = false;
    }
    // Need to fill viewport in the case of a silent delete of multiple records with an insert following.
    // i.e. a splice of the data which removes 2 models silently and adds 1 back in, need to add the last model to fill view
    this.fillViewport();
};

/**
 * Handle a successful call to the data source fetchHeaderss. Update the row header DOM elements when necessary.
 * @param {Object} headerSet - a HeaderSet object which encapsulates the result set of cells
 * @param {Object} headerRanges - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 */
DvtDataGrid.prototype._handleHeaderInsertsFetchSuccess = function(headerSet, headerRanges, endHeaderSet)
{
    // so that grid will be resize
    this.m_resizeRequired = true;
    // insert the row
    this.handleHeadersFetchSuccess(headerSet, headerRanges, endHeaderSet, this.m_endRowHeader >= headerRanges['start']);
};

/**
 * Scrolls the row with index into the viewport
 * @param {number} index the row index
 * @private
 */
DvtDataGrid.prototype._scrollRowIntoViewport = function(index)
{
    var absIndex, databodyContent, row, viewportTop, viewportBottom, rowTop, diff;

    absIndex = index - this.m_startRow;
    databodyContent = this.m_databody['firstChild'];
    row = databodyContent['childNodes'][absIndex];
    if (row == null)
    {
        // something is wrong the newly inserted row does not exists
        return;
    }

    viewportTop = this._getViewportTop();
    viewportBottom = this._getViewportBottom();

    rowTop = row.offsetTop;
    diff = viewportTop - rowTop;
    if (diff > 0)
    {
        // row added to top, scroll up
        this.scrollDelta(0, diff);
    }
    else
    {
        diff = viewportBottom - rowTop;
        if (diff < 0)
        {
            // row added to bottom, scroll down
            this.scrollDelta(0, diff);
        }
    }
};

/**
 * Handles model range insert event
 * @param {Object} cellSet the range of cells inserted.
 * @param {Object=} headerSet the row headers.
 * @param {Object=} endHeaderSet the row end headers.
 * @private
 */
DvtDataGrid.prototype._handleModelInsertRangeEvent = function(cellSet, headerSet, endHeaderSet)
{
    var rowStart, rowCount, columnStart, columnCount, rowHeaderFragment, rowFragment,
            headerCount, c, index, totalRowHeight, returnVal, className, renderer, rowRange,
            columnRange, headerRange, rowEndHeaderFragment, headerEndCount;

    // reconstruct the cell ranges from result
    rowStart = cellSet.getStart("row");
    rowCount = cellSet.getCount("row");
    columnStart = cellSet.getStart("column");
    columnCount = cellSet.getCount("column");

    // if it should animate
    if (this.m_utils.supportsTransitions())
    {
        //create  a fragment with all of the row headers
        if (headerSet != null)
        {
            rowHeaderFragment = document.createDocumentFragment();
            headerCount = headerSet.getCount();
            // add the headers to the row header
            totalRowHeight = 0;
            c = 0;
            className = this.getMappedStyle("row") + " " + this.getMappedStyle("headercell") + " " + this.getMappedStyle("rowheadercell");
            renderer = this.m_options.getRenderer("row");
            while (headerCount - c > 0)
            {
                index = rowStart + c;
                returnVal = this.buildLevelHeaders(rowHeaderFragment, index, 0, 0, this.m_startRowPixel + totalRowHeight, true, (rowStart != this.m_endRowHeader + 1 && c != rowCount - 1), renderer, headerSet, 'row', className, this.m_rowHeaderLevelCount);
                c += returnVal['count'];
                totalRowHeight += returnVal['totalHeight'];
            }
        }

        //create  a fragment with all of the row headers
        if (endHeaderSet != null)
        {
            rowEndHeaderFragment = document.createDocumentFragment();
            headerEndCount = endHeaderSet.getCount();
            // add the headers to the row header
            totalRowHeight = 0;
            c = 0;
            className = this.getMappedStyle("row") + " " + this.getMappedStyle("endheadercell") + " " + this.getMappedStyle("rowendheadercell");
            renderer = this.m_options.getRenderer("rowEnd");
            while (headerEndCount - c > 0)
            {
                index = rowStart + c;
                returnVal = this.buildLevelHeaders(rowEndHeaderFragment, index, 0, 0, this.m_startRowPixel + totalRowHeight, true, (rowStart != this.m_endRowEndHeader + 1 && c != rowCount - 1), renderer, endHeaderSet, 'rowEnd', className, this.m_rowEndHeaderLevelCount);
                c += returnVal['count'];
                totalRowHeight += returnVal['totalHeight'];
            }
        }

        rowFragment = document.createDocumentFragment();
        returnVal = this._addRows(rowFragment, true, this.m_startRowPixel, rowStart, rowCount, columnStart, false, cellSet);

        this._insertRowsWithAnimation(rowFragment, rowHeaderFragment, rowEndHeaderFragment, rowStart, returnVal['totalRowHeight']);
    }
    else
    {
        rowRange = {"axis": "row", "start": rowStart, "count": rowCount};
        columnRange = {"axis": "column", "start": columnStart, "count": columnCount};
        if (headerSet != null)
        {
            headerRange = {'axis': 'row', 'header': this.m_rowHeader, 'endHeader':this.m_rowEndHeader, 'start': rowStart, 'count': headerSet.getCount()};
            this.m_fetching['row'] = headerRange;
            this._handleHeaderInsertsFetchSuccess(headerSet, headerRange, endHeaderSet);
        }
        // insert the rows
        this._handleCellInsertsFetchSuccess(cellSet, [rowRange, columnRange]);
    }
};

/**
 * Handles model update event
 * @param {Object} indexes the indexes that identifies the row that got updated.
 * @param {Object} keys the key that identifies the row that got updated.
 * @private
 */
DvtDataGrid.prototype._handleModelUpdateEvent = function(indexes, keys)
{
    var flag;

    // if the new row/column is in the viewport
    flag = this._isInViewport(indexes);
    if (flag === DvtDataGrid.INSIDE)
    {
        //if there is a row header update it
        if (this.m_endRowHeader != -1)
        {
            // fetch the updated row header and row
            this.fetchHeaders("row", indexes['row'], this.m_rowHeader, this.m_rowEndHeader, 1, {
                "success": this._handleHeaderUpdatesFetchSuccess,
                "error": this.handleHeadersFetchError
            });
        }

        this.fetchCells(this.m_databody, indexes['row'], this.m_startCol, 1, this.m_endCol - this.m_startCol + 1, {
            "success": this._handleCellUpdatesFetchSuccess,
            "error": this.handleCellsFetchError
        });
    }

    // if it's not in range then do nothing
};

/**
 * Handle a successful call to the data source fetchHeaderss. Update the row header DOM elements when necessary.
 * @param {Object} headerSet - a HeaderSet object which encapsulates the result set of cells
 * @param {Array.<Object>} headerRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 * @param {Object} endHeaderSet - a HeaderSet object which encapsulates the result set of cells
 * @private
 */
DvtDataGrid.prototype._handleHeaderUpdatesFetchSuccess = function(headerSet, headerRange, endHeaderSet)
{
    var axis, rowStart, row;

    axis = headerRange["axis"];
    this.m_fetching[axis] = false;
    rowStart = headerRange["start"];

    this._replaceHeaders(this.buildRowHeaders.bind(this), headerSet, this.m_rowHeader, rowStart - this.m_startRowHeader);
    this._replaceHeaders(this.buildRowEndHeaders.bind(this), endHeaderSet, this.m_rowEndHeader, rowStart - this.m_startRowEndHeader);

    row = this.m_rowHeader.firstChild.childNodes[rowStart - this.m_startRowHeader];

    if (this.m_active != null && this.m_active['type'] === 'header' && (this.m_active['axis'] === 'row' || this.m_active['axis'] === 'rowEnd') && this._getKey(row) === this.m_active['key'])
    {
        this._highlightActive();
    }
    // end fetch
    this._signalTaskEnd();
    // should animate the fragment in the future like updateCells
};

/**
 * Replace the headers on update
 * @param {Function} buildFunction
 * @param {Object|null|undefined} headerSet
 * @param {Element} root
 * @param {number} index
 * @private
 */
DvtDataGrid.prototype._replaceHeaders = function(buildFunction, headerSet, root, index)
{
    var headerContent, fragment, row;
    if (headerSet != null)
    {
        fragment = buildFunction(root, headerSet, index, 1, true, true);
        headerContent = root['firstChild'];
        row = headerContent.childNodes[index];
        headerContent.replaceChild(fragment, row); //@HTMLUpdateOK
    }
};

/**
 * Handle a successful call to the data source fetchCells. Update the row and
 * cell DOM elements when necessary.
 * @param {Object} cellSet - a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange - [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 * @private
 */
DvtDataGrid.prototype._handleCellUpdatesFetchSuccess = function(cellSet, cellRange)
{
    var rowStart, databodyContent, renderer, columnBandingInterval, rowBandingInterval, rowIndex, row;

    //fetch complete
    this.m_fetching['cells'] = false;

    rowStart = cellRange[0]['start'];
    databodyContent = this.m_databody['firstChild'];

    renderer = this.m_options.getRenderer("cell");
    columnBandingInterval = this.m_options.getColumnBandingInterval();
    rowBandingInterval = this.m_options.getRowBandingInterval();

    // gets the relative index to the dom
    rowIndex = rowStart - this.m_startRow;
    row = databodyContent.childNodes[rowIndex];

    // update the cells in the row
    this._updateCellsInRow(cellSet, row, rowIndex, renderer, this.m_startCol, columnBandingInterval);

    // end fetch
    this._signalTaskEnd();
};

/**
 * Retrieves the type of update animation to use.
 * @return {number} the type of update animation.  See constants.
 * @private
 */
DvtDataGrid.prototype._getUpdateAnimation = function()
{
    return DvtDataGrid.UPDATE_ANIMATION_SLIDE_INOUT;
};

/**
 * Retrieves the update animation duration.
 * @return {number} the animation duration.
 * @private
 */
DvtDataGrid.prototype._getUpdateAnimationDuration = function()
{
    return DvtDataGrid.UPDATE_ANIMATION_DURATION;
};

/**
 * Adds cells to a row. Iterate over the cells passed in, create new div elements
 * for them settign appropriate styles, and append or prepend them to the row based on the start column.
 * @param {Object} cellSet - the result set of cell data
 * @param {Element} row - the row element to update cells
 * @param {number} rowIndex - the index of the row element
 * @param {function(Object)} renderer - the cell renderer
 * @param {number} columnStart - the index to start start adding at
 * @param {number} columnBandingInterval - the column banding interval
 * @private
 */
DvtDataGrid.prototype._updateCellsInRow = function(cellSet, row, rowIndex, renderer, columnStart, columnBandingInterval)
{
    var animationDuration, self, width, listener;

    animationDuration = this._getUpdateAnimationDuration();

    // check whether animation should be used
    if (animationDuration === 0 || !this.m_utils.supportsTransitions())
    {
        // clear the content of the row first
        this.m_utils.empty(row);

        // calls addCellsToRow
        this.addCellsToRow(cellSet, row, rowIndex, renderer, true, columnStart, false, columnBandingInterval);

        // re-apply selection and active cell since content changed
        if (this._isSelectionEnabled())
        {
            this.applySelection();
        }
        this._highlightActive();
    }
    else
    {
        self = this;
        // animation start
        self._signalTaskStart();
        listener = function()
        {
            row['style']['left'] = '';
            self.removeTransformMoveStyle(row);
            row.removeEventListener('transitionend', listener, false);
            // re-apply selection and active cell since content changed
            if (self._isSelectionEnabled())
            {
                self.applySelection();
            }
            self._highlightActive();

            // end animation
            self._signalTaskEnd();
        };
        row.addEventListener('transitionend', listener);

        //hide the row
        width = this.getElementWidth(this.m_databody);
        this.setElementDir(row, width, 'left');

        // clear the content of the row and refill it with new data
        this.m_utils.empty(row);
        this.addCellsToRow(cellSet, row, rowIndex, renderer, true, columnStart, false, columnBandingInterval);

        // hide fetching text now that we are done
        this.hideStatusText();

        //kick off animation
        this.addTransformMoveStyle(row, animationDuration + 'ms', 0, 'linear', -1 * width, 0, 0);
    }
};

/**
 * Handles model delete event
 * @param {Array|Object} indexes the indexes that identifies the row that got deleted.
 * @param {Array|Object} keys the key that identifies the row that got deleted.
 * @param {boolean} silent true if the datagrid should not fill the databody
 * @private
 */
DvtDataGrid.prototype._handleModelDeleteEvent = function(indexes, keys, silent)
{
    var key, i, rowKey, row, height, referenceRow, databodyContent, beforeRowsHeight, insideRowsHeight, afterRowsHeight,
            databodyContentHeight, rowHeader, flag, index, beforeRowsDeleted, insideRowsDeleted, totalHeight, scrollerContent,
            rowEndHeader;

    // make it an array if it's a single entry event
    if (!Array.isArray(keys))
    {
        keys = new Array(keys);
        indexes = new Array(indexes);
    }

    beforeRowsHeight = 0;
    insideRowsHeight = 0;
    afterRowsHeight = 0;
    beforeRowsDeleted = 0;
    insideRowsDeleted = 0;
    for (i = 0; i < keys.length; i++)
    {
        key = keys[i];
        index = indexes[i];
        if (key['row'] != null)
        {
            height = 0;
            rowKey = key['row'];
            flag = this._isInViewport(index);
            if (flag === DvtDataGrid.BEFORE)
            {
                //should only happen in virtual scrolling
                beforeRowsDeleted++;
                beforeRowsHeight += this.m_avgRowHeight;
                this.m_startRowPixel -= this.m_avgRowHeight;
                this.m_endRowPixel -= this.m_avgRowHeight;
                if (this.m_endRowHeader != -1)
                {
                    this.m_startRowHeaderPixel -= this.m_avgRowHeight;
                    this.m_endRowHeaderPixel -= this.m_avgRowHeight;
                }
                row = this.m_databody['firstChild']['firstChild'];
                if (row != null)
                {
                    this.pushRowsUp(row, this.m_avgRowHeight);
                }
                rowHeader = this.m_rowHeader['firstChild']['firstChild'];
                if (rowHeader != null)
                {
                    this.pushRowsUp(rowHeader, this.m_avgRowHeight);
                }
                rowEndHeader = this.m_rowEndHeader['firstChild']['firstChild'];
                if (rowEndHeader != null)
                {
                    this.pushRowsUp(rowEndHeader, this.m_avgRowHeight);
            }
            }
            else if (flag === DvtDataGrid.INSIDE)
            {
                insideRowsDeleted++;
                row = this._findRowByKey(rowKey);
                if (row != null)
                {
                    height = this.calculateRowHeight(row);
                    referenceRow = row['nextSibling'];
                    this._remove(row);
                    this.pushRowsUp(referenceRow, height);
                    this.m_endRowPixel -= height;
                }
                rowHeader = this._findHeaderByKey(rowKey, this.m_rowHeader, this.getMappedStyle('rowheadercell'));
                if (rowHeader != null)
                {
                    height = this.calculateRowHeaderHeight(rowHeader);
                    referenceRow = rowHeader['nextSibling'];
                    this._remove(rowHeader);
                    this.pushRowHeadersUp(referenceRow, height);
                    this.m_endRowHeaderPixel -= height;
                }
                rowEndHeader = this._findHeaderByKey(rowKey, this.m_rowEndHeader, this.getMappedStyle('rowendheadercell'));
                if (rowEndHeader != null)
                {
                    height = this.calculateRowHeaderHeight(rowEndHeader);
                    referenceRow = rowEndHeader['nextSibling'];
                    this._remove(rowEndHeader);
                    this.pushRowHeadersUp(referenceRow, height);
                    this.m_endRowEndHeaderPixel -= height;
                }
                insideRowsHeight = insideRowsHeight + height;
            }
            else //flag === DvtDataGrid.AFTER
            {
                //only include after rows if virtual scroll
                if (this.m_options.getScrollPolicy() === 'scroll')
                {
                    afterRowsHeight += this.m_avgRowHeight;
                }
            }
        }
    }

    this.m_startRow -= beforeRowsDeleted;
    this.m_endRow = this.m_endRow - beforeRowsDeleted - insideRowsDeleted;
    if (this.m_endRowHeader != -1)
    {
        this.m_startRowHeader -= beforeRowsDeleted;
        this.m_endRowHeader = this.m_endRowHeader - beforeRowsDeleted - insideRowsDeleted;
    }
    if (this.m_endRowEndHeader != -1)
    {
        this.m_startRowEndHeader -= beforeRowsDeleted;
        this.m_endRowEndHeader = this.m_endRowEndHeader - beforeRowsDeleted - insideRowsDeleted;
    }
    totalHeight = beforeRowsHeight + insideRowsHeight + afterRowsHeight;

    // adjust the databody height
    databodyContent = this.m_databody['firstChild'];
    databodyContentHeight = this.getElementHeight(databodyContent) - totalHeight;
    this.setElementHeight(databodyContent, databodyContentHeight);
    this.resizeGrid();

    if (!silent && this.m_moveActive != true)
    {
        // so that grid will be resize
        this.m_resizeRequired = true;
        // check viewport to see if we need to fetch because of deleted row causing empty spaces
        this.m_stopRowFetch = false;
        if (this.m_endRowHeader != -1)
        {
            this.m_stopRowHeaderFetch = false;
        }
        if (this.m_endRowEndHeader != -1)
        {
            this.m_stopRowEndHeaderFetch = false;
        }
        this.fillViewport();
    }
    this.updateRowBanding();
};

/**
 * Handles model delete event with animation
 * @param {Array} keys the key that identifies the row that got deleted.
 * @private
 */
DvtDataGrid.prototype._handleModelDeleteEventWithAnimation = function(keys)
{
    this._collapseRowsWithAnimation(keys);
};

/**
 * Helper function to calculate gaps in the selection if any.
 * @param {Array.<number>} indices indices that identifies rows that got deleted.
 * @return {Array.<Array.<number>>} idxs.
 * @private
 */
DvtDataGrid.prototype._getSelectionGaps = function(indices)
{
    var i, idx, idxs, first;

    idx = [];
    idxs = [];
    first = true;

    for (i = 0; i < indices.length - 1; i++)
    {
        if (indices[i + 1] - indices[i] == 1)
        {
            idx.push(indices[i]);
            first = false;
        }
        else
        {
            if (first)
            {
                idx.push(indices[i]);
            }
            else
            {
                idx.push(indices[i]);
            }
            idxs.push(idx);
            idx = [];
            first = true;
        }
    }
    idx.push(indices[indices.length - 1]);
    idxs.push(idx);

    return idxs;
};

/**
 * Helper method to get row by it's local position.
 * @param {number} pos the local position of the row.
 * @return {Element} row
 * @private
 */
DvtDataGrid.prototype._getRowByLocalPosition = function(pos)
{
    var rowKey;
    rowKey = this._getLocalKeys({'row': pos}).row;
    return this._findRowByKey(rowKey);
};

/**
 * Helper method to process animated rows in responce on the model delete event
 * @param {Object} keys the key that identifies the row that got deleted.
 * @param {Array} indices
 * @private
 */
DvtDataGrid.prototype._removeRowsWithAnimation = function(keys, indices)
{
    var self, key, i, j, k, rowKey, row, totalHeight, height, referenceRow, databodyContent,
            rowHeader, duration, lastTopRow, start, firstRowCase,
            duration_slide, duration_del, delay_slide, delay_del, easing, gaps,
            transition_duration, transition_delay, transition_timing_function, opacity, transform,
            rwn, adjustment, rwp, gap_size, listener;

    self = this;
    // animation start
    self._signalTaskStart();

    gaps = self._getSelectionGaps(indices);
    row = self._getRowByLocalPosition(indices[indices.length - 1]);
    referenceRow = row['nextSibling'];
    gap_size = 0;

    duration_slide = 600;
    duration_del = 400;
    delay_slide = 150;
    delay_del = 0;
    easing = "Cubic-bezier(0.70,0.00,0.51,1.29)";

    transition_duration = self.getCssSupport('transition-duration');
    transition_delay = self.getCssSupport('transition-delay');
    transition_timing_function = self.getCssSupport('transition-timing-function');
    opacity = self.getCssSupport('opacity');
    transform = self.getCssSupport('transform');

    duration = DvtDataGrid.COLLAPSE_ANIMATION_DURATION;
    firstRowCase = true;
    databodyContent = self.m_databody['firstChild'];
    lastTopRow = self._getRowByLocalPosition(indices[0]);
    if (lastTopRow['previousSibling'].childElementCount != 0)
    {
        lastTopRow = lastTopRow['previousSibling'];
        firstRowCase = false;
    }

    for (i = 0; i < keys.length; i++)
    {
        key = keys[i];

        // delete row or column
        if (key['row'])
        {
            rowKey = key['row'];
            // find the row locally, we can't ask the datasource for its index since
            // it's already removed.
            row = self._findRowByKey(rowKey);
            if (row != null)
            {
                height = self.calculateRowHeight(row);
                //add animation CSS rules to each row's style
                self.changeStyleProperty(row, transition_duration, duration_del + "ms");
                self.changeStyleProperty(row, transition_delay, delay_del + "ms");
                self.changeStyleProperty(row, transition_timing_function, easing);
                self.changeStyleProperty(row, opacity, 0);
            }
            else
            {
                // outside of viewport
                height = self.m_avgRowHeight;
            }

            rowHeader = self._findHeaderByKey(rowKey, this.m_rowHeader, this.getMappedStyle('rowheadercell'));
            if (rowHeader != null)
            {
                //TODO implement collapse animation for rowHeaders here

                height = self.calculateRowHeaderHeight(rowHeader);
                referenceRow = rowHeader['nextSibling'];
                self.pushRowHeadersUp(referenceRow, height);
                self._remove(rowHeader);
                rowHeader['style']['display'] = 'none';
                self.m_endRowHeader = self.m_endRowHeader - 1;
                self.m_endRowHeaderPixel = self.m_endRowHeaderPixel - height;
            }

            // adjust range
            self.m_endRow = self.m_endRow - 1;
            self.m_endRowPixel = self.m_endRowPixel - height;

            totalHeight = totalHeight + height;
        }
        //else if (keys['column'])
        //{
            // todo: handle remove column
        //}
    }

    //slide up rest of rows if required
    if (gaps.length > 1)
    {
        for (i = 0; i < gaps.length - 1; i++)
        {
            gap_size += gaps[i].length;
            adjustment = height * gap_size;
            for (j = gaps[i][gaps[i].length - 1] + 1; j < gaps[i + 1][0]; j++)
            {
                row = self._getRowByLocalPosition(j);
                self.addTransformMoveStyle(row, duration_slide + "ms", delay_slide + "ms", easing, 0, "-" + adjustment, 0);
            }
        }
    }

    rwn = referenceRow;
    adjustment = height * keys.length;

    while (rwn)
    {
        rwp = rwn['previousSibling'];
        self.addTransformMoveStyle(rwn, duration_slide + "ms", delay_slide + "ms", easing, 0, "-" + adjustment, 0);
        rwn = rwn['nextSibling'];
        if (!rwn)
        {
            listener = function()
            {
                //delete all required rows at the end of the animation process
                for (j = 0; j < keys.length; j++)
                {
                    if (keys[j]['row'])
                    {
                        row = self._findRowByKey(keys[j]['row']);
                        self._remove(row);
                        row['style']['display'] = 'none';
                    }
                }
                start = -1;
                for (k = 1; k < databodyContent.childElementCount; k++)
                {
                    row = databodyContent.childNodes[k];
                    if (self._getKey(lastTopRow))
                    {
                        if (self._getKey(lastTopRow) == self._getKey(databodyContent.childNodes[k]))
                        {
                            start = k + 1;
                        }
                    }
                    //clean all animation (transition) parameters for each animated row if required
                    self.changeStyleProperty(row, self.getCssSupport('z-index'), 0, "remove");
                    self.removeTransformMoveStyle(row);

                    //and assign correct top values instead
                    if (start > 0)
                    {
                        databodyContent.childNodes[k].style.top = lastTopRow.offsetTop + height * (k - start + 1) + 'px';
                    }
                    else
                    {
                        if (firstRowCase)
                        {
                            databodyContent.childNodes[k].style.top = lastTopRow.offsetTop + height * (k - 1) + 'px';
                        }
                    }
                }

                // adjust the databody height
                self.setElementHeight(databodyContent, self.getElementHeight(databodyContent) - totalHeight);

                // now resize the grid
                self.resizeGrid();

                // check viewport to see if we need to fetch because of deleted row causing empty spaces
                self.m_stopRowFetch = false;
                self.fillViewport();
                self.updateRowBanding();
                this.removeEventListener('transitionend', listener, false);
            };
            rwp.addEventListener('transitionend', listener, false);
        }
    }
};

/**
 * Helper method to process animated rows in responce on the model delete event
 * @param {Object} keys set of keys that identifies rows that got deleted.
 * @private
 */
DvtDataGrid.prototype._collapseRowsWithAnimation = function(keys)
{
    var self, duration, databodyContent, referenceRow, referenceRowHeader, referenceRowEndHeader, lastAnimationElement,
            i, rowKey, row, rowsToRemove, rowHeadersToRemove, rowEndHeadersToRemove, totalRowHeight, rowHeader, rowEndHeader,
            tranisitionListener, referenceRowTop, referenceRowHeaderTop, rowHeaderSupport, referenceRowEndHeaderTop, rowEndHeaderSupport;

    self = this;
    // animation start
    self._signalTaskStart();
    // note we set the duration to 1 instead of 0 because some browsers do not invoke transition end listener if duration is 0
    duration = this.m_processingEventQueue ? 1 : DvtDataGrid.COLLAPSE_ANIMATION_DURATION;
    rowsToRemove = [];
    totalRowHeight = 0;
    rowHeaderSupport = this.m_endRowHeader == -1 ? false : true;
    rowEndHeaderSupport = this.m_endRowEndHeader == -1 ? false : true;
    databodyContent = this.m_databody['firstChild'];

    referenceRow = this._findRowByKey(keys[0]['row'])['previousSibling'];
    referenceRowTop = this.getElementDir(referenceRow, 'top');

    //all inherited animated rows should be hidden under previous rows in view
    row = referenceRow;
    while (row)
    {
        if (this.getElementDir(row, 'top') < this.m_currentScrollTop)
        {
            break;
        }
        this.changeStyleProperty(row, this.getCssSupport('z-index'), 10);
        row = row['previousSibling'];
    }

    if (rowHeaderSupport)
    {
        rowHeadersToRemove = [];
        referenceRowHeader = this._findHeaderByKey(keys[0]['row'], this.m_rowHeader, this.getMappedStyle('rowheadercell'))['previousSibling'];
        referenceRowHeaderTop = this.getElementDir(referenceRowHeader, 'top');
        row = referenceRowHeader;
        while (row)
        {
            if (this.getElementDir(row, 'top') < this.m_currentScrollTop)
            {
                break;
            }
            this.changeStyleProperty(row, this.getCssSupport('z-index'), 10);
            row = row['previousSibling'];
        }
    }

    if (rowEndHeaderSupport)
    {
        rowEndHeadersToRemove = [];
        referenceRowEndHeader = this._findHeaderByKey(keys[0]['row'], this.m_rowEndHeader, this.getMappedStyle('rowendheadercell'))['previousSibling'];
        referenceRowEndHeaderTop = this.getElementDir(referenceRowEndHeader, 'top');
        row = referenceRowEndHeader;
        while (row)
        {
            if (this.getElementDir(row, 'top') < this.m_currentScrollTop)
            {
                break;
            }
            this.changeStyleProperty(row, this.getCssSupport('z-index'), 10);
            row = row['previousSibling'];
        }
    }

    // get the rows we need to remove and set the new top to align row bottom with
    // the reference row bottom, but keep it where it is for the time being
    for (i = 0; i < keys.length; i++)
    {
        rowKey = keys[i]['row'];
        row = this._findRowByKey(rowKey);
        if (row != null)
        {
            rowsToRemove.push(row);
            totalRowHeight += this.getElementHeight(row);
            this.setElementDir(row, this.getElementDir(row, 'top') - totalRowHeight, 'top');
            this.addTransformMoveStyle(row, 0, 0, 'linear', 0, totalRowHeight, 0);
        }
        if (rowHeaderSupport)
        {
            rowHeader = this._findHeaderByKey(rowKey, this.m_rowHeader, this.getMappedStyle('rowheadercell'));
            if (rowHeader != null)
            {
                rowHeadersToRemove.push(rowHeader);
                this.setElementDir(rowHeader, this.getElementDir(rowHeader, 'top') - totalRowHeight, 'top');
                this.addTransformMoveStyle(rowHeader, 0, 0, 'linear', 0, totalRowHeight, 0);
            }
        }
        if (rowEndHeaderSupport)
        {
            rowEndHeader = this._findHeaderByKey(rowKey, this.m_rowEndHeader, this.getMappedStyle('rowendheadercell'));
            if (rowEndHeader != null)
            {
                rowEndHeadersToRemove.push(rowEndHeader);
                this.setElementDir(rowEndHeader, this.getElementDir(rowEndHeader, 'top') - totalRowHeight, 'top');
                this.addTransformMoveStyle(rowEndHeader, 0, 0, 'linear', 0, totalRowHeight, 0);
            }
        }
    }

    // for all the rows after the collapse change the top values appropriately
    while (row['nextSibling'])
    {
        // change the row top but keep it where it is
        row = row['nextSibling'];
        this.setElementDir(row, this.getElementDir(row, 'top') - totalRowHeight, 'top');
        this.addTransformMoveStyle(row, 0, 0, 'linear', 0, totalRowHeight, 0);
        if (rowHeaderSupport)
        {
            rowHeader = rowHeader['nextSibling'];
            this.setElementDir(rowHeader, this.getElementDir(rowHeader, 'top') - totalRowHeight, 'top');
            this.addTransformMoveStyle(rowHeader, 0, 0, 'linear', 0, totalRowHeight, 0);
        }
        if (rowEndHeaderSupport)
        {
            rowEndHeader = rowEndHeader['nextSibling'];
            this.setElementDir(rowEndHeader, this.getElementDir(rowEndHeader, 'top') - totalRowHeight, 'top');
            this.addTransformMoveStyle(rowEndHeader, 0, 0, 'linear', 0, totalRowHeight, 0);
        }
    }

    // listen to the last rows transition end
    lastAnimationElement = databodyContent['lastChild'];
    tranisitionListener = function()
    {
        var i;
        for (i = 0; i < rowsToRemove.length; i++)
        {
            self._remove(rowsToRemove[i]);
            if (rowHeaderSupport)
            {
                self._remove(rowHeadersToRemove[i]);
            }
            if (rowEndHeaderSupport)
            {
                self._remove(rowEndHeadersToRemove[i]);
            }
        }

        self.setElementHeight(databodyContent, self.m_endRowPixel - self.m_startRowPixel);
        self.resizeGrid();
        self.updateRowBanding();
        self.fillViewport();
        self._handleAnimationEnd();
        lastAnimationElement.removeEventListener('transitionend', tranisitionListener, false);
    };

    lastAnimationElement.addEventListener('transitionend', tranisitionListener, false);

    // clean up the variables in the event they are needed before animation end
    this.m_endRow -= rowsToRemove.length;
    this.m_endRowPixel -= totalRowHeight;
    this.m_stopRowFetch = false;
    if (rowHeaderSupport)
    {
        this.m_endRowHeader -= rowHeadersToRemove.length;
        this.m_endRowHeaderPixel -= totalRowHeight;
        this.m_stopRowHeaderFetch = false;
    }
    if (rowEndHeaderSupport)
    {
        this.m_endRowEndHeader -= rowHeadersToRemove.length;
        this.m_endRowEndHeaderPixel -= totalRowHeight;
        this.m_stopRowEndHeaderFetch = false;
    }

    // animate all rows
    this.m_animating = true;
    row = referenceRow['nextSibling'];
    if (rowHeaderSupport)
    {
        rowHeader = referenceRowHeader['nextSibling'];
    }
    if (rowEndHeaderSupport)
    {
        rowEndHeader = referenceRowEndHeader['nextSibling'];
    }
    setTimeout(function() {
        while (row)
        {
            // change the row top but keep it where it is
            self.addTransformMoveStyle(row, duration + "ms", 0, 'ease-out', 0, 0, 0);
            row = row['nextSibling'];
            if (rowHeaderSupport)
            {
                self.addTransformMoveStyle(rowHeader, duration + "ms", 0, 'ease-out', 0, 0, 0);
                rowHeader = rowHeader['nextSibling'];
            }
            if (rowEndHeaderSupport)
            {
                self.addTransformMoveStyle(rowEndHeader, duration + "ms", 0, 'ease-out', 0, 0, 0);
                rowEndHeader = rowEndHeader['nextSibling'];
            }
        }
    }, 0);
};

/**
 * Clean up the datagrid animations by resetting transform vars and z-index
 * @private
 */
DvtDataGrid.prototype._handleAnimationEnd = function()
{
    var i, databodyContent, rowHeaderContent, rowEndHeaderContent;
    // cleanRows
    databodyContent = this.m_databody['firstChild'];
    rowHeaderContent = this.m_rowHeader['firstChild'];
    rowEndHeaderContent = this.m_rowEndHeader['firstChild'];
    for (i = 0; i < databodyContent.childNodes.length; i++)
    {
        this.removeTransformMoveStyle(databodyContent.childNodes[i]);
        this.changeStyleProperty(databodyContent.childNodes[i], this.getCssSupport('z-index'), null, 'remove');
        if (this.m_endRowHeader != -1)
        {
            this.removeTransformMoveStyle(rowHeaderContent.childNodes[i]);
            this.changeStyleProperty(rowHeaderContent.childNodes[i], this.getCssSupport('z-index'), null, 'remove');
        }
        if (this.m_endRowEndHeader != -1)
        {
            this.removeTransformMoveStyle(rowEndHeaderContent.childNodes[i]);
            this.changeStyleProperty(rowEndHeaderContent.childNodes[i], this.getCssSupport('z-index'), null, 'remove');
        }
    }
    // end animation
    this.m_animating = false;
    this._signalTaskEnd();

    // check event queue for outstanding model events
    this._runModelEventQueue();
};

/**
 * Find the row element by row key
 * @param {string|null} key the row key
 * @return {Element|null} the row element
 * @private
 */
DvtDataGrid.prototype._findRowByKey = function(key)
{
    var databodyContent, rows, row, i, rowKey;

    if (this.m_databody == null || this.m_databody['firstChild'] == null)
    {
        return null;
    }

    databodyContent = this.m_databody['firstChild'];
    rows = databodyContent['childNodes'];
    for (i = 0; i < rows.length; i++)
    {
        row = rows[i];
        rowKey = this._getKey(row);
        if (rowKey == key)
        {
            return row;
        }
    }

    // can't find it, the row is not in viewport
    return null;
};

/**
 * Find the header element by key inside a given root and className
 * @param {string|null} key the key
 * @param {Element} root
 * @param {string} className
 * @return {Element|null} the row element
 * @private
 */
DvtDataGrid.prototype._findHeaderByKey = function(key, root, className)
{
    var headers, header, i, headerKey;

    if (root == null)
    {
        return null;
    }

    //getElementsByClassName support is IE9 and up
    headers = root.getElementsByClassName(className);
    for (i = 0; i < headers.length; i++)
    {
        header = headers[i];
        headerKey = this._getKey(header);
        if (headerKey == key)
        {
            return header;
        }
    }

    // can't find it, the row is not in viewport
    return null;
};

/**
 * Handles model refresh event
 * @private
 */
DvtDataGrid.prototype._handleModelRefreshEvent = function()
{
    var visibility = this.getVisibility();

    // if we are visible, make sure we are visible, and just refresh the datagrid
    // if we are hidden we want to change the state to refresh so the wrapper know to call refresh when we are shown.
    // if we are already in state refresh we do not need to update.
    // if we are in state render we do not want to update that.
    if (visibility === DvtDataGrid.VISIBILITY_STATE_VISIBLE)
    {
        this.empty();
        // if the app developer doesn't notify the grid that it has become hidden
        // check to make sure, if it isn't hidden, refresh if it is
        // supported in IE9+
        if (this.m_root.offsetParent != null)
        {
            this.refresh(this.m_root);
        }
        else
        {
            this.setVisibility(DvtDataGrid.VISIBILITY_STATE_REFRESH);
        }

    }
    else if (visibility === DvtDataGrid.VISIBILITY_STATE_HIDDEN)
    {
        this.empty();
        this.setVisibility(DvtDataGrid.VISIBILITY_STATE_REFRESH);
    }
};

/**
 * Handles data source fetch end (model sync) event
 * @param {Object} event the model event
 * @private
 */
DvtDataGrid.prototype._handleModelSyncEvent = function(event)
{
    var startRow, pageSize, startRowPixel, startCol, startColPixel;
    //Currently these are set to zero for now, may come from the event later
    startRow = 0;
    startRowPixel = 0;
    startCol = 0;
    startColPixel = 0;
    pageSize = event['pageSize'];

    //cancel previous fetch calls
    this.m_fetching = {};

    // reset ranges
    this.m_startRow = startRow;
    this.m_endRow = -1;
    this.m_startRowHeader = startRow;
    this.m_endRowHeader = -1;
    this.m_startRowEndHeader = startRow;
    this.m_endRowEndHeader = -1;
    this.m_startRowPixel = startRowPixel;
    this.m_endRowPixel = startRowPixel;
    this.m_startRowHeaderPixel = startRowPixel;
    this.m_endRowHeaderPixel = startRowPixel;
    this.m_startRowEndHeaderPixel = startRowPixel;
    this.m_endRowEndHeaderPixel = startRowPixel;
    this.m_startCol = startCol;
    this.m_endCol = -1;

    this.m_startColHeader = startCol;
    this.m_endColHeader = -1;
    this.m_startColEndHeader = startCol;
    this.m_endColEndHeader = -1;

    this.m_startColPixel = startColPixel;
    this.m_endColPixel = startColPixel;

    this.m_startColHeaderPixel = startColPixel;
    this.m_endColHeaderPixel = startColPixel;

    this.m_startColEndHeaderPixel = startColPixel;
    this.m_endColEndHeaderPixel = startColPixel;

    this.m_rowHeaderLevelCount = undefined;
    this.m_columnHeaderLevelCount = undefined;
    this.m_rowEndHeaderLevelCount = undefined;
    this.m_columnEndHeaderLevelCount = undefined;

    this.m_avgRowHeight = undefined;
    this.m_avgColWidth = undefined;

    this.m_isEstimateRowCount = undefined;
    this.m_isEstimateColumnCount = undefined;
    this.m_stopRowFetch = false;
    this.m_stopRowHeaderFetch = false;
    this.m_stopRowEndHeaderFetch = false;
    this.m_stopColumnFetch = false;
    this.m_stopColumnHeaderFetch = false;
    this.m_stopColumnEndHeaderFetch = false;

    //clear selections
    this.m_selection = null;
    this.m_active = null;
    this.m_prevActive = null;

    if (this.m_empty != null)
    {
        this.m_root.removeChild(this.m_empty);
        this.m_empty = null;
    }
    
    this._showHeader(this.m_rowHeader);
    this._showHeader(this.m_colHeader);
    this._showHeader(this.m_rowEndHeader);
    this._showHeader(this.m_colEndHeader);
    
    this.m_initialized = false;
    this.fetchHeaders("row", startRow, this.m_rowHeader, this.m_rowEndHeader, pageSize, {'success': function(headerSet, headerRange, endHeaderSet)
        {
            this.handleRowHeadersFetchSuccessForLongScroll(headerSet, headerRange, endHeaderSet);
        }});
    this.fetchHeaders("column", startCol, this.m_colHeader, this.m_colEndHeader, undefined, {'success': function(headerSet, headerRange, endHeaderSet)
        {
            this.handleColumnHeadersFetchSuccessForLongScroll(headerSet, headerRange, endHeaderSet);
        }});

    this.fetchCells(this.m_databody, startRow, startCol, pageSize, null, {'success': function(cellSet, cellRange)
        {
            this.handleCellsFetchSuccessForLongScroll(cellSet, cellRange);
        }});
    this.setInitialScrollPosition();
};

/************************************ active cell navigation ******************************/
/**
 * Sets the active cell by index
 * @param {Object} index row and column index
 * @param {Event=} event the DOM event causing the active cell change
 * @param {boolean=} clearSelection true if we should clear the selection on active change
 * @private
 * @return {boolean} true if active was changed, false if not
 */
DvtDataGrid.prototype._setActiveByIndex = function(index, event, clearSelection)
{
    return this._setActive(this._getCellByIndex(index), event, clearSelection);
};

/**
 * Updates the active cell based on external set, do not fire events
 * @param {Object} activeObject set by application could be sparse
 * @param {boolean} shouldFocus 
 * @private
 */
DvtDataGrid.prototype._updateActive = function(activeObject, shouldFocus)
{
    //the activeObject is potentially sparse, try to get an element from it
    var level, newActiveElement;
    if (activeObject == null)
    {
        this._setActive(null, null, null, true);
    }
    else if (activeObject['keys'] != null)
    {
       newActiveElement = this._getCellByKeys(activeObject['keys']);
    }
    else if (activeObject['indexes'] != null)
    {
        newActiveElement = this._getCellByIndex(activeObject['indexes']);
    }
    else if (activeObject['axis'] != null)
    {
        level = activeObject['level'] == null ? 0 : activeObject['level'];
        if (activeObject['axis'] == 'column')
        {
            if (activeObject['key'] != null)
            {
                newActiveElement = this._findHeaderByKey(activeObject['key'], this.m_colHeader, this.getMappedStyle('colheadercell'));
            }
            else if (activeObject['index'] != null)
            {
                newActiveElement = this._getHeaderByIndex(activeObject['index'], level, this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader);
            }
        }
        else if (activeObject['axis'] == 'row')
        {
            if (activeObject['key'] != null)
            {
                newActiveElement = this._findHeaderByKey(activeObject['key'], this.m_rowHeader, this.getMappedStyle('rowheadercell'));
            }
            else if (activeObject['index'] != null)
            {
                newActiveElement = this._getHeaderByIndex(activeObject['index'], level, this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader);
            }
        }
        else if (activeObject['axis'] == 'columnEnd')
        {
            if (activeObject['key'] != null)
            {
                newActiveElement = this._findHeaderByKey(activeObject['key'], this.m_colEndHeader, this.getMappedStyle('colendheadercell'));
            }
            else if (activeObject['index'] != null)
            {
                newActiveElement = this._getHeaderByIndex(activeObject['index'], level, this.m_colEndHeader, this.m_columnEndHeaderLevelCount, this.m_startColEndHeader);
            }
        }
        else if (activeObject['axis'] == 'rowEnd')
        {
            if (activeObject['key'] != null)
            {
                newActiveElement = this._findHeaderByKey(activeObject['key'], this.m_rowEndHeader, this.getMappedStyle('rowendheadercell'));
            }
            else if (activeObject['index'] != null)
            {
                newActiveElement = this._getHeaderByIndex(activeObject['index'], level, this.m_rowEndHeader, this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader);
            }
        }
    }

    if (newActiveElement != null)
    {
        if (!shouldFocus)
        {
            this.m_shouldFocus = false;
        }
        this._setActive(newActiveElement, null, null, true);
    }
};

/**
 * Sets the active cell or header by element
 * @param {Element|null} element to set active to
 * @param {Event|null=} event the DOM event causing the active cell change
 * @param {boolean|null=} clearSelection true if we should clear the selection on active change
 * @param {boolean|null=} silent true if we should not fire events
 * @returns {boolean} true if active was changed, false if not
 */
DvtDataGrid.prototype._setActive = function(element, event, clearSelection, silent)
{
    if (element != null)
    {
        var active = this._createActiveObject(element);
        // see if the active cell is actually changing
        if (this._compareActive(active, this.m_active))
        {
            // fire vetoable beforeCurrentCell event
            if (silent || this._fireBeforeCurrentCellEvent(active, this.m_active, event))
            {
                this.m_prevActive = this.m_active;
                this.m_active = active;
                if (this.m_shouldFocus)
                {
                    this._scrollToActive(active);
                }
                if (clearSelection && this._isSelectionEnabled())
                {
                    this._clearSelection(event);
                }
                this._unhighlightActiveObject(this.m_prevActive);
                this._highlightActiveObject(this.m_active, this.m_prevActive);
                this._manageMoveCursor();
                if (this._isGridEditable())
                {
                    this._updateEdgeCellBorders('');    
                }
                if (!silent)
                {
                    this._fireCurrentCellEvent(active, event);
                }
                return true;
            }
        }
    }
    else if (!this.m_scrollIndexAfterFetch && !this.m_scrollHeaderAfterFetch)
    {
        if (silent || this._fireBeforeCurrentCellEvent(active, this.m_active, event))
        {
            this.m_prevActive = this.m_active;
            this.m_active = null;
            this._unhighlightActiveObject(this.m_prevActive);
            if (!silent)
            {
                this._fireCurrentCellEvent(active, event);
            }
        }
        return true;
    }
    return false;
};

/**
 * Create an active object from an element active object contains:
 * For header: type, axis, index, key, level
 * For cell: indexes, keys
 * @param {Element} element - the element to create an active object from
 * @return {Object} an active object
 */
DvtDataGrid.prototype._createActiveObject = function(element)
{
    var context = element[this.getResources().getMappedAttribute('context')];
    if (this.m_utils.containsCSSClassName(element, this.getMappedStyle('headercell')) ||
        this.m_utils.containsCSSClassName(element, this.getMappedStyle('endheadercell')))
    {
        return {
            'type': 'header',
            'axis': context['axis'],
            'index': this.getHeaderCellIndex(element),
            'key': context['key'],
            'level': context['level']
        };
    }
    else
    {
        return {
            'type': 'cell',
            'indexes': {
                'row': this.getRowIndex(element['parentNode']),
                'column': this.getCellIndex(element)
            },
            'keys': {
                'row': context['keys']['row'],
                'column': context['keys']['column']
            }
        };
    }
};

/**
 * Retrieve the active element.
 * @return {Element|null} the active cell or header cell
 * @private
 */
DvtDataGrid.prototype._getActiveElement = function()
{
    return this._getElementFromActiveObject(this.m_active);
};

/**
 * Retrieve the element based on an active object.
 * @param {Object} active the object to get the element of
 * @return {Element|null} the active cell or header cell
 * @private
 */
DvtDataGrid.prototype._getElementFromActiveObject = function(active)
{
    var elements;
    if (active != null)
    {
        if (active['type'] == 'header')
        {
            if (active['axis'] === 'row')
            {
                return this._findHeaderByKey(active['key'], this.m_rowHeader, this.getMappedStyle('rowheadercell'));
            }
            else if (active['axis'] === 'column')
            {
                return this._findHeaderByKey(active['key'], this.m_colHeader, this.getMappedStyle('colheadercell'));
            }
            else if (active['axis'] === 'rowEnd')
            {
                return this._findHeaderByKey(active['key'], this.m_rowEndHeader, this.getMappedStyle('rowendheadercell'));
        }
            else if (active['axis'] === 'columnEnd')
            {
                return this._findHeaderByKey(active['key'], this.m_colEndHeader, this.getMappedStyle('colendheadercell'));
            }
        }
        else
        {
            elements = this.getElementsInRange(this.createRange(active['indexes']))
            if (elements != null)
            {
                return elements[0];
            }
        }
    }
    return null;
};

/**
 * Compare two active objects to see if they are equal
 * @param {Object} active1 an active object
 * @param {Object} active2 a comparison active object
 * @return {boolean} true if not equal
 */
DvtDataGrid.prototype._compareActive = function(active1, active2)
{
    if (active1 == null && active2 == null)
    {
        return false;
    }
    else if ((active1 == null && active2 != null) || (active1 != null && active2 == null))
    {
        return true;
    }
    else if (active1['type'] == active2['type'])
    {
        if (active1['type'] == 'header')
        {
            if (active1['index'] != active2['index'] ||
                    active1['key'] != active2['key'] ||
                    active1['axis'] != active2['axis'] ||
                    active1['level'] != active2['level'])
            {
                return true;
            }
        }
        else
        {
            if (active1['indexes']['row'] != active2['indexes']['row'] ||
                    active1['indexes']['column'] != active2['indexes']['column'] ||
                    active1['keys']['row'] != active2['keys']['row'] ||
                    active1['keys']['column']!= active2['keys']['column'])
            {
                return true;
            }
        }
    }
    else
    {
        return true;
    }
    return false;
};

/**
 * Fires an event before the current cell changes
 * @param {Object|undefined} newActive the new active information
 * @param {Object} oldActive the new active information
 * @param {Event|undefined} event the DOM event
 * @private
 * @return {boolean|undefined} true if event should continue
 */
DvtDataGrid.prototype._fireBeforeCurrentCellEvent = function(newActive, oldActive, event)
{
    // the event contains the context info
    var details =
    {
        'event': event,
        'ui':
        {
            'currentCell': newActive,
            'previousCurrentCell': oldActive
        }
    };

    return this.fireEvent('beforeCurrentCell', details);
};

/**
 * Fires an event to tell the datagrid to update the currentCell option
 * @param {Object|undefined} active the new active information
 * @param {Event|undefined} event the DOM event
 * @private
 */
DvtDataGrid.prototype._fireCurrentCellEvent = function(active, event)
{
    // the event contains the context info
    var details =
    {
        'event': event,
        'ui': active
    };

    return this.fireEvent('currentCell', details);
};

/**
 * Is the databody cell active
 * @return {boolean} true if active element is a cell
 * @private
 */
DvtDataGrid.prototype._isDatabodyCellActive = function()
{
    return (this.m_active != null && this.m_active['type'] == 'cell');
};

/**
 * Update the context info based on active changess
 * @param {Object} activeObject
 * @param {Object} prevActiveObject
 */
DvtDataGrid.prototype._updateActiveContext = function(activeObject, prevActiveObject)
{
    var axis, index, level, contextObj, skip;
    if (activeObject['type'] === 'header')
    {
        axis = activeObject['axis'];
        index = activeObject['index'];
        level = activeObject['level'];

        contextObj = {};
        if (activeObject['axis'] === 'row')
        {
            if (this.m_rowHeaderLevelCount > 1)
            {
                if (prevActiveObject == null ? true : !(level === prevActiveObject['level'] && axis === prevActiveObject['axis']))
                {
                    contextObj['level'] = level;
                }
            }
            if (prevActiveObject == null ? true : !(index === prevActiveObject['index'] && axis === prevActiveObject['axis']))
            {
                contextObj['rowHeader'] = index;
            }
        }
        else if (axis === 'column')
        {
            if (this.m_columnHeaderLevelCount > 1)
            {
                if (prevActiveObject == null ? true : !(level === prevActiveObject['level'] && axis === prevActiveObject['axis']))
                {
                    contextObj['level'] = level;
                }
            }
            if (prevActiveObject == null ? true : !(index === prevActiveObject['index'] && axis === prevActiveObject['axis']))
            {
                contextObj['columnHeader'] = index;
            }
        }
        else if (activeObject['axis'] === 'rowEnd')
        {
            if (this.m_rowEndHeaderLevelCount > 1)
            {
                if (prevActiveObject == null ? true : !(level === prevActiveObject['level'] && axis === prevActiveObject['axis']))
                {
                    contextObj['level'] = level;
                }
            }
            if (prevActiveObject == null ? true : !(index === prevActiveObject['index'] && axis === prevActiveObject['axis']))
            {
                contextObj['rowEndHeader'] = index;
            }
        }
        else if (axis === 'columnEnd')
        {
            if (this.m_columnEndHeaderLevelCount > 1)
            {
                if (prevActiveObject == null ? true : !(level === prevActiveObject['level'] && axis === prevActiveObject['axis']))
                {
                    contextObj['level'] = level;
                }
            }
            if (prevActiveObject == null ? true : !(index === prevActiveObject['index'] && axis === prevActiveObject['axis']))
            {
                contextObj['columnEndHeader'] = index;
            }
        }
        // update context info
        this._updateContextInfo(contextObj, skip);
    }
    else
    {
        // check whether the prev and current active cell is in the same row/column so that we can
        // skip row/column header info in aria-labelledby (to make the description more brief)
        if (prevActiveObject != null && prevActiveObject['type'] == 'cell' && activeObject != null && !this.m_externalFocus)
        {
           if (activeObject['indexes']['row'] === prevActiveObject['indexes']['row'])
           {
               skip = "row";
           }
           else if (activeObject['indexes']['column'] === prevActiveObject['indexes']['column'])
           {
               skip = "column";
           }
        }
        // update context info
        this._updateContextInfo(activeObject['indexes'], skip);
    }
};

/**
 * Handles click to make a cell active
 * @param {Event} event
 * @private
 */
DvtDataGrid.prototype.handleDatabodyClickActive = function(event)
{
    var cell, target;
    target = /** @type {Element} */ (event.target);
    cell = this.findCell(target);
    if (cell != null)
    {
        this._setActive(cell, event);
    }
};

/**
 * Handles click to select a header
 * @param {Event} event
 */
DvtDataGrid.prototype.handleHeaderClickActive = function(event)
{
    var target, header;
    target = /** @type {Element} */ (event.target);    
    header = this.findHeader(target);
    if (header != null)
    {
        if (this._isSelectionEnabled())
        {
            this._clearSelection(event);
        }
        this._setActive(header, event);
    }
};

/**
 * Scroll to the active object
 * @param {Object} activeObject
 */
DvtDataGrid.prototype._scrollToActive = function(activeObject)
{
    if (activeObject['type'] === 'header')
    {
        this.scrollToHeader(activeObject);
    }
    else
    {
        this.scrollToIndex(activeObject['indexes']);
    }
};

/**
 * Retrieve the active cell.
 * @return {Element|null} the active cell
 * @private
 */
DvtDataGrid.prototype._getCellByIndex = function(indexes)
{
    var elements = this.getElementsInRange(this.createRange(indexes))
    if (elements != null)
    {
        return elements[0];
    }
    return null;
};

/**
 * Retrieve cell by keys
 * @param {Object} keys
 * @return {Element|null} the active cell
 * @private
 */
DvtDataGrid.prototype._getCellByKeys = function(keys)
{
    var row = this._findRowByKey(keys['row']);
    if (row != null)
    {
        var cells = row['childNodes'];
        for (var i=0; i<cells.length; i++)
        {
            if (cells[i][this.getResources().getMappedAttribute('context')]['keys']['column'] === keys['column'])
            {
                return cells[i];
            }
        }
    }
    return null;
};

/**
 * Retrieve the index of a row
 * @param {Element} row
 * @return {number}
 */
DvtDataGrid.prototype.getRowIndex = function(row)
{
    var index = this.m_startRow;
    while (row['previousSibling'])
    {
        index += 1;
        row = row['previousSibling'];
    }
    return index;
};

/**
 * Retrieve the (column) index of a cell
 * @param {Element} cell
 * @return {number}
 */
DvtDataGrid.prototype.getCellIndex = function(cell)
{
    var index = this.m_startCol;
    while (cell['previousSibling'])
    {
        index += 1;
        cell = cell['previousSibling'];
    }
    return index;
};

/**
 * Retrieve the index of a header cell
 * @param {Element} header header cell element
 * @return {number|string}
 */
DvtDataGrid.prototype.getHeaderCellIndex = function(header)
{
    var axis, levelCount, start, index;
    axis = this.getHeaderCellAxis(header);
    switch (axis)
    {
        case 'column':
            levelCount = this.m_columnHeaderLevelCount;
            start = this.m_startColHeader;
            break;
        case 'row':
            levelCount = this.m_rowHeaderLevelCount;
            start = this.m_startRowHeader;
            break;
        case 'columnEnd':
            levelCount = this.m_columnEndHeaderLevelCount;
            start = this.m_startColEndHeader;
            break;
        case 'rowEnd':
            levelCount = this.m_rowEndHeaderLevelCount;
            start = this.m_startRowEndHeader;
            break;
        default:
            return -1;
            }

        // if there are multiple levels on the row header
    if (levelCount > 1)
        {
            // get the groupingContainer's start value and set thtat to the index
            index = this._getAttribute(header['parentNode'], 'start', true);
            //if this is the groupingContainer's first child rturn that value
            if (header === header['parentNode']['firstChild'])
            {
                return index;
            }
            //decrement the index by one for the first header element at the level above it
            index--;
        }
        else
        {
        index = start;
        }

    while (header['previousSibling'])
    {
        index += 1;
        header = header['previousSibling'];
    }

    return index;
};

/**
 * Retrieve the axis of a header cell
 * @param {Element|undefined|null} header header cell element
 * @return {string|null} row or column
 */
DvtDataGrid.prototype.getHeaderCellAxis = function(header)
{
    if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('colheadercell')))
    {
        return 'column';
    }
    else if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('rowheadercell')))
    {
        return 'row';
    }
    else if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('rowendheadercell')))
    {
        return 'rowEnd';
    }
    else if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('colendheadercell')))
    {
        return 'columnEnd';
    }
    return null;
};

/**
 * Retrieve the level of a header cell
 * @param {Element} header header cell element
 * @return {number|string} row or column
 */
DvtDataGrid.prototype.getHeaderCellLevel = function(header)
{
    var level;
    if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('colheadercell')))
    {
        if (this.m_columnHeaderLevelCount === 1)
        {
            return 0;
        }

    }
    else if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('rowheadercell')))
    {
        if (this.m_rowHeaderLevelCount === 1)
        {
            return 0;
        }
    }
    else if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('colendheadercell')))
    {
        if (this.m_columnEndHeaderLevelCount === 1)
        {
            return 0;
        }
    }
    else if (this.m_utils.containsCSSClassName(header, this.getMappedStyle('rowendheadercell')))
    {
        if (this.m_rowEndHeaderLevelCount === 1)
        {
            return 0;
        }
    }

    level = this._getAttribute(header['parentNode'], 'level', true);
    if (header === header['parentNode']['firstChild'])
    {
        return level;
    }
    // plus one case is if we are on the innermost level the headers do not have their own
    // grouping containers so if it is the first child it is the level of the grouping container
    // but all subsequent children are the next level in
    return level + this.getHeaderCellDepth(header['parentNode']['firstChild']);
};

/**
 * Retrieve the depth of a header cell
 * @param {Element} header header cell element
 * @return {string|number|null} row or column depth
 */
DvtDataGrid.prototype.getHeaderCellDepth = function(header)
{
    return this._getAttribute(header, 'depth', true);
};

/**
 * Find the cell element (recursively if needed)
 * @private
 * @param {Element} elem
 * @return {Element|undefined|null}
 */
DvtDataGrid.prototype.findCell = function(elem)
{
    return this.find(elem, "cell");
};

/**
 * Find the cell element (recursively if needed)
 * @param {Element|undefined|null} elem
 * @param {string} key
 * @param {string=} className
 * @return {Element|undefined|null}
 */
DvtDataGrid.prototype.find = function(elem, key, className)
{
    // if element is null or if we reach the root of DataGrid
    if (elem == null || elem == this.getRootElement())
    {
        return null;
    }

    // recursively walk up the element and find the class name that matches the cell class name
    if (className == undefined)
    {
        className = this.getMappedStyle(key);
    }

    if (className == null)
    {
        return null;
    }

    // if the element contains the cell class name, then it's a cell, otherwise go up
    if (this.m_utils.containsCSSClassName(elem, className))
    {
        return elem;
    }
    return this.find(elem['parentNode'], key, className);
};

/**
 * Highlight the current active element
 * @param {Array=} classNames string of classNames to add to active element
 * @private
 */
DvtDataGrid.prototype._highlightActive = function(classNames)
{
    this._highlightActiveObject(this.m_active, this.m_prevActive, classNames);
};


/**
 * Unhighlight the current active element
 * @param {Array=} classNames string of classNames to remove from active element
 * @private
 */
DvtDataGrid.prototype._unhighlightActive = function(classNames)
{
    this._unhighlightActiveObject(this.m_active, classNames);
};

/**
 * Highlight the specified object
 * @param {Object} activeObject active to unhighlight
 * @param {Object} prevActiveObject last active to base aria properties on
 * @param {Array=} classNames string of classNames to add to active element
 * @private
 */
DvtDataGrid.prototype._highlightActiveObject = function(activeObject, prevActiveObject, classNames)
{
    if (classNames == null && this.m_utils.shouldOffsetOutline())
    {
        classNames = ['offsetOutline'];
    }    
    if (activeObject != null)
    {
        var element = this._getElementFromActiveObject(activeObject);
        //possible in the virtual case
        if (element != null)
        {
            this.m_focusInHandler(element);
            if (classNames != null)
            {            
                this._highlightElement(element, classNames);
            }
            this._setAriaProperties(activeObject, prevActiveObject, element);
        }
    }
};

/**
 * Unhighlight the specified object
 * @param {Object} activeObject to unhighlight
 * @param {Array=} classNames string of classNames to remove from active element
 * @private
 */
DvtDataGrid.prototype._unhighlightActiveObject = function(activeObject, classNames)
{
    if (classNames == null && this.m_utils.shouldOffsetOutline())
    {
        classNames = ['offsetOutline'];
    }    
    if (activeObject != null)
    {
        var element = this._getElementFromActiveObject(activeObject);
        if (element != null)
        {        
            this.m_focusOutHandler(element);      
            if (classNames != null)
            {
                this._unhighlightElement(element, classNames);
            }
            this._unsetAriaProperties(element);
        }
    }
};

/**
 * Highlight an element adding classes in the provided array
 * @param {Element} element
 * @param {Array} classNames
 */
DvtDataGrid.prototype._highlightElement = function(element, classNames)
{
    var className, i;
    for (i = 0; i < classNames.length; i++)
    {
        className = this.getMappedStyle(classNames[i]);
        this.m_utils.addCSSClassName(element, className);
    }
};

/**
 * Unhighlight an element removing classes in the provided array
 * @param {Element} element
 * @param {Array} classNames
 */
DvtDataGrid.prototype._unhighlightElement = function(element, classNames)
{
    var className, i;
    for (i = 0; i < classNames.length; i++)
    {
        className = this.getMappedStyle(classNames[i]);
        this.m_utils.removeCSSClassName(element, className);
    }
};

/**
 * Reset all wai-aria properties on a cell or header.
 * @param {Object} activeObject active to unhighlight
 * @param {Object} prevActiveObject last active to base aria properties on
 * @param {Element} element the element to reset all wai-aria properties
 * @private
 */
DvtDataGrid.prototype._setAriaProperties = function(activeObject, prevActiveObject, element)
{
    var label;
    label = this.getLabelledBy(activeObject, prevActiveObject, element);
    this._updateActiveContext(activeObject, prevActiveObject);

    element.setAttribute("tabIndex", 0);
    element.setAttribute("aria-labelledby", label);

    // check to see if we should focus on the cell later
    if ((this.m_cellToFocus == null || this.m_cellToFocus != element) && this.m_shouldFocus)
    {
        element.focus();
    }
    this.m_shouldFocus = true;
};

/**
 * Reset all wai-aria properties on a cell or header.
 * @param {Element} element the element to reset all wai-aria properties.
 */
DvtDataGrid.prototype._unsetAriaProperties = function(element)
{
    if (element != null)
    {
        // reset focus index
        element.setAttribute("tabIndex", -1);
        // remove aria related attributes
        element.removeAttribute("aria-labelledby");
    }
};

/**
 * Returns the wai-aria labelled by property for a cell
 * @param {Object} activeObject
 * @param {Object} prevActiveObject 
 * @param {Element} element
 * @return {string} the wai-aria labelled by property for the cell
 */
DvtDataGrid.prototype.getLabelledBy = function(activeObject, prevActiveObject, element)
{
    var label, previousElement, direction, key, previousRowIndex, previousColumnIndex, row, rowEnd, column, columnEnd;
    label = "";

    if (activeObject['type'] == 'header')
    {
        // get the previous active header to compare what the screen reader needs to read for parent Ids,
        // should only need this if multi level header
        if (prevActiveObject != null && prevActiveObject['type'] == 'header' && !this.m_externalFocus)
        {
            if (prevActiveObject['axis'] === 'row' && this.m_rowHeaderLevelCount > 1)
            {
                previousElement = this._getHeaderByIndex(prevActiveObject['index'], prevActiveObject['level'], this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader);
            }
            else if (prevActiveObject['axis'] === 'column' && this.m_columnHeaderLevelCount > 1)
            {
                previousElement = this._getHeaderByIndex(prevActiveObject['index'], prevActiveObject['level'], this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader);
            }
            else if (prevActiveObject['axis'] === 'rowEnd' && this.m_rowEndHeaderLevelCount > 1)
            {
                previousElement = this._getHeaderByIndex(prevActiveObject['index'], prevActiveObject['level'], this.m_rowEndHeader, this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader);
        }
            else if (prevActiveObject['axis'] === 'columnEnd' && this.m_columnEndHeaderLevelCount > 1)
            {
                previousElement = this._getHeaderByIndex(prevActiveObject['index'], prevActiveObject['level'], this.m_colEndHeader, this.m_columnEndHeaderLevelCount, this.m_startColEndHeader);
            }
        }

        label = [this.createSubId("context"), this._getHeaderAndParentIds(element, previousElement)].join(" ");
        direction = element.getAttribute(this.getResources().getMappedAttribute('sortDir'));
        if (direction === "ascending")
        {
            key = "accessibleSortAscending";
            label = label + " " + this.createSubId("state");
        }
        else if (direction === "descending")
        {
            key = "accessibleSortDescending";
            label = label + " " + this.createSubId("state");
        }

        if (this.m_externalFocus === true)
        {
            label = [this.createSubId("summary"), label].join(" ");
            this.m_externalFocus = false;
        }

        if (key != null)
        {
            this._updateStateInfo(key, {'id': ''});
        }

        element.setAttribute("tabIndex", 0);
    }
    else
    {
        if (prevActiveObject != null)
        {
            if (prevActiveObject['type'] === 'header')
            {
                previousRowIndex = prevActiveObject['axis'] === 'row' ? prevActiveObject['index'] : null;
                previousColumnIndex = prevActiveObject['axis'] === 'column' ? prevActiveObject['index'] : null;
            }
            else
            {
                previousRowIndex = prevActiveObject['indexes']['row'];
                previousColumnIndex = prevActiveObject['indexes']['column'];
            }
        }

        // Add the header labels
        row = this._getHeaderLabel('row', this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader, this.m_endRowHeader, activeObject['indexes']['row'], previousRowIndex, element);
        rowEnd = this._getHeaderLabel('rowEnd', this.m_rowEndHeader, this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader, this.m_endRowEndHeader, activeObject['indexes']['row'], previousRowIndex, element);
        column = this._getHeaderLabel('column', this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader, this.m_endColHeader, activeObject['indexes']['column'], previousColumnIndex, element);
        columnEnd = this._getHeaderLabel('columnEnd', this.m_colEndHeader, this.m_columnEndHeaderLevelCount, this.m_startColEndHeader, this.m_endColEndHeader, activeObject['indexes']['column'], previousColumnIndex, element);

        label = [this.createSubId("context"), row, rowEnd, column, columnEnd, element['id'], this.createSubId("state")].join(" ");
        // remove double spaces rather than check everytime
        label = label.replace(/ +(?= )/g,'');

        if (this.m_externalFocus)
        {
            label = [this.createSubId("summary"), label].join(" ");
            this.m_externalFocus = false;
        }
    }
    return label;
};

/**
 * Returns the header that is in line with a cell along an axis.
 * Key Note: in the case of row, we return the row not the headercell
 * @param {Element|undefined|null} cell the element for the cell
 * @param {string} axis the axis along which to find the header, 'row', 'column'
 * @return {Element} the header Element along the axis
 */
DvtDataGrid.prototype.getHeaderFromCell = function(cell, axis)
{
    var row, rowIndex, colIndex;
    if (axis === 'row')
    {
        if (this.m_rowHeader != null)
        {
            row = cell['parentNode'];
            rowIndex = this.findIndexOf(row) + this.m_startRow;
            if (rowIndex > -1)
            {
                return this._getHeaderByIndex(rowIndex, this.m_rowHeaderLevelCount - 1, this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader);
            }
        }
    }
    else if (axis === 'column')
    {
        if (this.m_colHeader != null)
        {
            colIndex = this.findIndexOf(cell) + this.m_startCol;
            if (colIndex > -1)
            {
                return this._getHeaderByIndex(colIndex, this.m_columnHeaderLevelCount - 1, this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader);
            }
        }
    }
    else if (axis === 'rowEnd')
    {
        if (this.m_rowEndHeader != null)
        {
            row = cell['parentNode'];
            rowIndex = this.findIndexOf(row) + this.m_startRow;
            if (rowIndex > -1)
            {
                return this._getHeaderByIndex(rowIndex, this.m_rowEndHeaderLevelCount - 1, this.m_rowEndHeader, this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader);
            }
        }
    }
    else if (axis === 'columnEnd')
    {
        if (this.m_colEndHeader != null)
        {
            colIndex = this.findIndexOf(cell) + this.m_startCol;
            if (colIndex > -1)
            {
                return this._getHeaderByIndex(colIndex, this.m_columnEndHeaderLevelCount - 1, this.m_colEndHeader, this.m_columnEndHeaderLevelCount, this.m_startColEndHeader);
            }
        }
    }
    return null;
};

/**
 * Helper method to find the index of a child from its parent
 * @param {Element|undefined|null} elem an HTML element
 * @return {number} the index of the element relative to its parent
 */
DvtDataGrid.prototype.findIndexOf = function(elem)
{
    var child, children, index, i;

    children = elem['parentNode']['childNodes'];
    index = -1;
    for (i = 0; i < children.length; i += 1)
    {
        child = children[i];
        if (child === elem)
        {
            return index + 1;
        }

        if (child.nodeName == 'DIV')
        {
            index++;
        }
    }

    return index;
};

/**
 * Creates a range object given the start and end index, will add in keys if they are passed in
 * @param {Object} startIndex - the start index of the range
 * @param {Object=} endIndex - the end index of the range.  Optional, if not specified it represents a single cell/row
 * @param {Object=} startKey - the start key of the range.  Optional, if not specified it represents a single cell/row
 * @param {Object=} endKey - the end key of the range.  Optional, if not specified it represents a single cell/row
 * @return {Object} a range object representing the start and end index, along with the start and end key.
 */
DvtDataGrid.prototype.createRange = function(startIndex, endIndex, startKey, endKey)
{
    var startRow, endRow, startColumn, endColumn, startRowKey, endRowKey, startColumnKey, endColumnKey;
    if (endIndex)
    {
        // -1 means unbound
        if (startIndex['row'] < endIndex['row'] || endIndex['row'] == -1)
        {
            startRow = startIndex['row'];
            endRow = endIndex['row'];
            if (startKey)
            {
                startRowKey = startKey['row'];
                endRowKey = endKey['row'];
            }
        }
        else
        {
            startRow = endIndex['row'];
            endRow = startIndex['row'];
            if (startKey)
            {
                startRowKey = endKey['row'];
                endRowKey = startKey['row'];
            }
        }

        // row based selection does not have column specified for range
        if (!isNaN(startIndex['column']) && !isNaN(endIndex['column']))
        {
            // -1 means unbound
            if (startIndex['column'] < endIndex['column'] || endIndex['column'] == -1)
            {
                startColumn = startIndex['column'];
                endColumn = endIndex['column'];
                if (startKey)
                {
                    startColumnKey = startKey['column'];
                    endColumnKey = endKey['column'];
                }
            }
            else
            {
                startColumn = endIndex['column'];
                endColumn = startIndex['column'];
                if (startKey)
                {
                    startColumnKey = endKey['column'];
                    endColumnKey = startKey['column'];
                }
            }

            startIndex = {
                "row": startRow, "column": startColumn
            };
            endIndex = {
                "row": endRow, "column": endColumn
            };
            if (startKey)
            {
                startKey = {
                    "row": startRowKey, "column": startColumnKey
                };
                endKey = {
                    "row": endRowKey, "column": endColumnKey
                };
            }
        }
        else
        {
            startIndex = {
                "row": startRow
            };
            endIndex = {
                "row": endRow
            };
            if (startKey)
            {
                startKey = {
                    "row": startRowKey, "column": startColumnKey
                };
                endKey = {
                    "row": endRowKey, "column": endColumnKey
                };
            }
        }
    }

    if (startKey)
    {
        return {"startIndex": startIndex, "endIndex": endIndex, "startKey": startKey, "endKey": endKey};
    }

    return {"startIndex": startIndex, "endIndex": endIndex};
};


/**
 * Creates a range object given the start and end index
 * @param {Object} startIndex - the start index of the range
 * @param {Object|undefined|null} endIndex - the end index of the range.
 * @param {Function} callback - the callback for the range to call when its fully fetched
 * @private
 */
DvtDataGrid.prototype._createRangeWithKeys = function(startIndex, endIndex, callback)
{
    this._keys(startIndex, this._createRangeStartKeyCallback.bind(this, endIndex, callback));
};

/**
 * Creates a range object given the start and end index
 * @param {Object|null|undefined} endIndex - the end index of the range.
 * @param {Function} callback - the callback for the range to call when its fully fetched
 * @param {Object} startKey - the start key of the range
 * @param {Object} startIndex - the start index of the range
 * @private
 */
DvtDataGrid.prototype._createRangeStartKeyCallback = function(endIndex, callback, startKey, startIndex)
{
    //keys will be the same
    if (endIndex === startIndex)
    {
        this._createRangeEndKeyCallback(startKey, startIndex, callback, startKey, startIndex);
    }
    //new keys needed
    else if (endIndex)
    {
        this._keys(endIndex, this._createRangeEndKeyCallback.bind(this, startKey, startIndex, callback));
    }
    //create range from single key
    else
    {
        callback.call(this, {"startIndex": startIndex, "endIndex": startIndex, "startKey": startKey, "endKey": startKey});
    }
};

/**
 * Creates a range object given the start and end index
 * @param {Object} startKey - the start key of the range
 * @param {Object} startIndex - the start index of the range
 * @param {Function} callback - the callback for the range to call when its fully fetched
 * @param {Object} endKey - the end key of the range.
 * @param {Object} endIndex - the end index of the range.
 * @private
 */
DvtDataGrid.prototype._createRangeEndKeyCallback = function(startKey, startIndex, callback, endKey, endIndex)
{
    callback.call(this, this.createRange(startIndex, endIndex, startKey, endKey));
};

/**
 * Retrieve the end index of the range, return start index if end index is undefined
 * @param {Object} range
 * @return {Object}
 */
DvtDataGrid.prototype.getEndIndex = function(range)
{
    return (range['endIndex'] == null) ? range['startIndex'] : range['endIndex'];
};

/**
 * Grabs all the elements in the databody which are within the specified range.
 * @param {Object} range - the range in which to get the elements
 * @param {number=} startRow
 * @param {number=} endRow
 * @param {number=} startCol
 * @param {number=} endCol
 * @return {Array}
 */
DvtDataGrid.prototype.getElementsInRange = function(range, startRow, endRow, startCol, endCol)
{
    var startIndex, endIndex, rangeStartRow, rangeEndRow, rangeStartColumn, rangeEndColumn, nodes, databodyContent, rows, i, columns, j, cell, row;
    if (startRow == undefined)
    {
        startRow = this.m_startRow;
    }
    if (endRow == undefined)
    {
        endRow = this.m_endRow + 1;
    }

    startIndex = range['startIndex'];
    endIndex = this.getEndIndex(range);

    rangeStartRow = startIndex['row'];
    rangeEndRow = endIndex['row'];
    // index = -1 means unbounded index
    if (rangeEndRow == -1)
    {
        rangeEndRow = Number.MAX_VALUE;
    }

    // check if in the rendered range
    if (endRow < rangeStartRow || rangeEndRow < startRow)
    {
        return null;
    }

    if (!isNaN(startIndex['column']) && !isNaN(endIndex['column']))
    {
        rangeStartColumn = startIndex['column'];
        rangeEndColumn = endIndex['column'];
        // index = -1 means unbounded index
        if (rangeEndColumn == -1)
        {
            rangeEndColumn = Number.MAX_VALUE;
        }

        // check if in the rendered range
        if ((this.m_endCol + 1) < rangeStartColumn || rangeEndColumn < this.m_startCol)
        {
            return null;
        }
    }

    nodes = [];
    // now walk the databody to find the nodes in range
    databodyContent = this.m_databody['firstChild'];
    if (databodyContent == null)
    {
        return null;
    }
    rows = databodyContent['childNodes'];

    // the range is within the databody, calculate the relative position
    rangeStartRow = Math.max(0, rangeStartRow - this.m_startRow);
    rangeEndRow = Math.min(rows.length, rangeEndRow - this.m_startRow + 1);

    // cell case
    if (!isNaN(rangeStartColumn) && !isNaN(rangeEndColumn))
    {
        if (startCol == undefined)
        {
            startCol = this.m_startCol;
        }

        rangeStartColumn = Math.max(0, rangeStartColumn - this.m_startCol);
        rangeEndColumn = rangeEndColumn - this.m_startCol + 1;
        for (i = rangeStartRow; i < rangeEndRow; i += 1)
        {
            columns = rows[i]['childNodes'];
            for (j = rangeStartColumn; j < Math.min(columns.length, rangeEndColumn); j += 1)
            {
                cell = columns[j];
                nodes.push(cell);
            }
        }
    }
    else
    {// row case
        for (i = rangeStartRow; i < rangeEndRow; i += 1)
        {
            row = rows[i];
            nodes.push(row);
        }
    }

    return nodes;
};

/**
 * Read the full content of the active cell (or frontier cell) to the screen reader
 * @protected
 * @returns {boolean} true if there is content to read out
 */
DvtDataGrid.prototype.readCurrentContent = function()
{
    var current, range, cell, currentCell, subid, needToModify, labelledBy;

    if (this.m_active == null)
    {
        return false;
    }

    if (this.m_active['type'] == 'header')
    {
        current = {};
        if (this.m_active['axis'] === 'row')
        {
            if (this.m_rowHeaderLevelCount > 1)
            {
                current['level'] = this.m_active['level'];
            }
            current['rowHeader'] = this.m_active['index'];
        }
        else
        {
            if (this.m_columnHeaderLevelCount > 1)
            {
                current['level'] = this.m_active['level'];
            }
            current['columnHeader'] = this.m_active['index'];
        }
        currentCell = this._getActiveElement();
    }
    else
    {
        current = this.m_active['indexes'];
        if (this._isSelectionEnabled() && this.isMultipleSelection())
        {
            if (this.m_selectionFrontier != null)
            {
                current = this.m_selectionFrontier;
            }
        }
        // make sure there is an active cell or frontier cell
        if (current == null)
        {
            return false;
        }

        // find the cell div
        range = this.createRange(current);
        cell = this.getElementsInRange(range);
        if (cell == null || cell.length == 0)
        {
            return false;
        }

        currentCell = cell[0];
    }

    // update aria properties with full context reference, don't focus it yet
    this._setAriaProperties(this. _createActiveObject(currentCell), null, currentCell);

    // the aria-labelledby needs to be different from last time
    // when it's read otherwise the screenreader will not read it
    // therefore, toggle the aria-labelledby with a dummy reference
    subid = this.createSubId("placeHolder");
    needToModify = true;
    labelledBy = currentCell.getAttribute("aria-labelledby");
    if (labelledBy != null && labelledBy.indexOf(subid) != -1)
    {
        needToModify = false;
    }

    // add the reference to dummy subid if needed (see comment above)
    if (needToModify)
    {
        // the dummy div needs to have something (i.e. space or empty string doesn't work)
        this.m_placeHolder.textContent = "&nbsp";
        labelledBy = currentCell.getAttribute("aria-labelledby");
        currentCell.setAttribute("aria-labelledby", labelledBy + ' ' + subid);
    }
    else
    {
        this.m_utils.empty(this.m_placeHolder);
    }

    // focus active cell so the content is read
    currentCell.focus();
    return true;
};

/**
 * Enter actionable mode
 * @param {Element|undefined|null} element to set actionable
 * @returns {boolean} false
 */
DvtDataGrid.prototype._enterActionableMode = function(element)
{
    // enable all focusable elements
    this._enableAllFocusableElements(element);
        
    // focus on first focusable item in the cell
    if (this._setFocusToFirstFocusableElement(element))
    {
        this.m_focusOutHandler(element);        
        this.setActionableMode(true);
    }
    return false;
};

/**
 * Exit actionable mode on the active cell if in actionable mode
 */
DvtDataGrid.prototype._exitActionableMode = function()
{
    var elem;
    if (this.isActionableMode())
    {
        elem = this._getActiveElement();
        this.setActionableMode(false);
        this._disableAllFocusableElements(elem);
        this.m_focusInHandler(elem);                
    }
};

/**
 * Re render a cell
 * @param {Element|undefined|null} cell
 * @param {string} mode
 * @param {string} classToToggle class to toggle on or off before rerendering
 */
DvtDataGrid.prototype._reRenderCell = function(cell, mode, classToToggle)
{
    var renderer, cellContext;
    renderer = this.m_options.getRenderer('cell');   
    cellContext = cell[this.getResources().getMappedAttribute("context")];
    cellContext['mode'] = mode;
            
    // empty the cell
    this.m_utils.empty(cell['firstChild']);   
    
    // now that the cell is empty toggle the appropraite edit classes so that alignment never has to shift
    if (this.m_utils.containsCSSClassName(cell, classToToggle))
    {
        this.m_utils.removeCSSClassName(cell, classToToggle);        
    }
    else
    {
        this.m_utils.addCSSClassName(cell, classToToggle);        
    }

    this._renderContent(renderer, cellContext, cell['firstChild'], cellContext['data'], this.getMappedStyle("celltext"));
};

/**
 *
 * @param {number} keyCode
 * @return {boolean}
 */
DvtDataGrid.prototype.isNavigationKey = function(keyCode)
{
    return (this.isArrowKey(keyCode) || keyCode == DvtDataGrid.keyCodes.HOME_KEY || keyCode == DvtDataGrid.keyCodes.END_KEY || keyCode == DvtDataGrid.keyCodes.PAGEUP_KEY || keyCode == DvtDataGrid.keyCodes.PAGEDOWN_KEY);
};

/**
 *
 * @param {number} keyCode
 * @return {boolean}
 */
DvtDataGrid.prototype.isArrowKey = function(keyCode)
{
    return (keyCode == DvtDataGrid.keyCodes.UP_KEY || keyCode == DvtDataGrid.keyCodes.DOWN_KEY || keyCode == DvtDataGrid.keyCodes.LEFT_KEY || keyCode == DvtDataGrid.keyCodes.RIGHT_KEY);
};

/**
 * Creates an index object for the cell/row
 * @param {number|string=} row - the start index of the range
 * @param {number|string=} column - the end index of the range.  Optional, if not specified it represents a single cell/row
 * @return {Object} an index object
 */
DvtDataGrid.prototype.createIndex = function(row, column)
{
    if (row != null)
    {
        if (column != null)
        {
            return {"row": row, "column": column};
        }
        return {"row": row};
    }

    return null;
};

/**
 * Handles arrow keys navigation on header
 * @param {number} keyCode description
 * @param {Event} event the DOM event that caused the arrow key
 * @param {boolean} jumpToHeaders jump to opposite headers if possible
 * @return  boolean true if the event was processed
 */
DvtDataGrid.prototype.handleHeaderFocusChange = function(keyCode, event, jumpToHeaders)
{
    var axis, index, level, elem, newCellIndex, newElement, newIndex, newLevel, depth,
            root, start, end, levelCount, stopFetch;

    // ensure that there's no outstanding fetch requests
    if (!this.isFetchComplete())
    {
        //act like it's processed until we finish the fetch
        return true;
    }

    if (this.getResources().isRTLMode())
    {
        if (keyCode == DvtDataGrid.keyCodes.LEFT_KEY)
        {
            keyCode = DvtDataGrid.keyCodes.RIGHT_KEY;
        }
        else if (keyCode == DvtDataGrid.keyCodes.RIGHT_KEY)
        {
            keyCode = DvtDataGrid.keyCodes.LEFT_KEY;
        }
    }

    axis = this.m_active['axis'];
    index = this.m_active['index'];
    level = this.m_active['level'];
    elem = this._getActiveElement();
    depth = elem != null ? this._getAttribute(elem, 'depth', true) : 1;

    if (axis == 'column')
    {
        root = this.m_colHeader;
        start = this.m_startColHeader;
        end = this.m_endColHeader;
        levelCount = this.m_columnHeaderLevelCount;
        stopFetch = this.m_stopColumnHeaderFetch;
    }
    else if (axis == 'row')
    {
        root = this.m_rowHeader;
        start = this.m_startRowHeader;
        end = this.m_endRowHeader;
        levelCount = this.m_rowHeaderLevelCount;
        stopFetch = this.m_stopRowHeaderFetch;
    }
    if (axis == 'columnEnd')
    {
        // treat up and down keys opposite of column Headers
        if (keyCode == DvtDataGrid.keyCodes.DOWN_KEY)
        {
            keyCode = DvtDataGrid.keyCodes.UP_KEY;
        }
        else if (keyCode == DvtDataGrid.keyCodes.UP_KEY)
        {
            keyCode = DvtDataGrid.keyCodes.DOWN_KEY;
        }
        root = this.m_colEndHeader;
        start = this.m_startColEndHeader;
        end = this.m_endColEndHeader;
        levelCount = this.m_columnEndHeaderLevelCount;
        stopFetch = this.m_stopColumnEndHeaderFetch;
   }
    if (axis == 'rowEnd')
    {
        // treat right and left oppostie of row headers
        if (keyCode == DvtDataGrid.keyCodes.LEFT_KEY)
        {
            keyCode = DvtDataGrid.keyCodes.RIGHT_KEY;
        }
        else if (keyCode == DvtDataGrid.keyCodes.RIGHT_KEY)
        {
            keyCode = DvtDataGrid.keyCodes.LEFT_KEY;
        }
        root = this.m_rowEndHeader;
        start = this.m_startRowEndHeader;
        end = this.m_endRowEndHeader;
        levelCount = this.m_rowEndHeaderLevelCount;
        stopFetch = this.m_stopRowEndHeaderFetch;
    }

    switch (keyCode)
    {
        case DvtDataGrid.keyCodes.LEFT_KEY:
            if ((axis === 'column' || axis === 'columnEnd') && index > 0)
            {
                if (levelCount === 1)
                {
                    newIndex = index - 1;
                    newElement = elem != null ? elem['previousSibling'] : null;
                    newLevel = level;
                }
                else
                {
                    newElement = this._getHeaderByIndex(index - 1, level, root, levelCount, start);
                    newIndex = newElement != null ? this._getAttribute(newElement['parentNode'], 'start', true) : index - 1;
                    newLevel = newElement != null ? this.getHeaderCellLevel(newElement) : level;
                    if (newIndex < 0)
                    {
                        break;
                    }
                }

                this.scrollToHeader({'axis': axis, 'index': newIndex, 'level':newLevel});
                this._setActive(newElement, event);
            }
            else if ((axis === 'row' || axis === 'rowEnd') && level > 0)
            {
                //moving down a level in the header
                newElement = this._getHeaderByIndex(index, level - 1, root, levelCount, start);
                newIndex = this._getAttribute(newElement['parentNode'], 'start', true);
                newLevel = this.getHeaderCellLevel(newElement);
                this.scrollToHeader({'axis': axis, 'index': newIndex, 'level':newLevel});
                this._setActive(newElement, event);
            }
            break;
        case DvtDataGrid.keyCodes.RIGHT_KEY:
            if (axis == 'rowEnd' && jumpToHeaders && this.m_endRowHeader != -1)
            {
                newElement = this._getHeaderByIndex(index, this.m_rowHeaderLevelCount, this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader);
                this.scrollToHeader({'axis': 'row', 'index': index, 'level':0});
                this._setActive(newElement, event);
            }
            else if (axis == 'row' && jumpToHeaders && this.m_endRowEndHeader != -1)
                {
                newElement = this._getHeaderByIndex(index, this.m_rowEndHeaderLevelCount, this.m_rowEndHeader, this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader);
                this.scrollToHeader({'axis': 'rowEnd', 'index': index, 'level':0});
                this._setActive(newElement, event);
            }
            else if (axis === 'row' || axis === 'rowEnd')
            {
                if (level + depth >= levelCount)
                {
                    // row header, move to databody
                    // make the first cell of the current row active
                    // no need to scroll since it will be in the viewport
                    if (axis == 'row')
                    {
                    newCellIndex = this.createIndex(index, 0);
                    }
                    else if (this._isHighWatermarkScrolling())
                    {
                        newCellIndex = this.createIndex(index, this.m_endCol);
                    }
                    else
                    {
                        newCellIndex = this.createIndex(index, this.getDataSource().getCount("column") - 1);
                    }

                    this.scrollToIndex(newCellIndex);
                    if (this._isSelectionEnabled())
                    {
                        this.selectAndFocus(newCellIndex, event);
                    }
                    else
                    {
                        this._setActiveByIndex(newCellIndex, event);
                    }
                }
                else
                {
                    //moving down a level in the header
                    newElement = this._getHeaderByIndex(index, level + depth, root, levelCount, start);
                    newIndex = this._getAttribute(newElement['parentNode'], 'start', true);
                    newLevel = this.getHeaderCellLevel(newElement);
                    this.scrollToHeader({'axis': axis, 'index': newIndex, 'level':newLevel});
                    this._setActive(newElement, event);
                }
            }
            else
            {
                if (levelCount === 1)
                {
                    newIndex = index + 1;
                    newElement = elem != null ? elem['nextSibling'] : null;
                    newLevel = level;
                }
                else
                {
                    if (level === levelCount - 1)
                    {
                        newIndex = index + 1;
                        newElement = this._getHeaderByIndex(newIndex, level, root, levelCount, start);
                    }
                    else
                    {
                        newIndex = elem != null ? this._getAttribute(elem['parentNode'], 'start', true) + this._getAttribute(elem['parentNode'], 'extent', true) : index + 1;
                        newElement = this._getHeaderByIndex(newIndex, level, root, levelCount, start);
                    }
                    newLevel = newElement != null ? this.getHeaderCellLevel(newElement) : level;
                }

                if (!(newIndex > end && stopFetch) && (this._isCountUnknown("column") || newIndex < this.getDataSource().getCount("column")))
                {
                    this.scrollToHeader({'axis': axis, 'index': newIndex, 'level':newLevel});
                    this._setActive(newElement, event);
                }
            }
            break;
        case DvtDataGrid.keyCodes.UP_KEY:
            if ((axis === 'row' || axis === 'rowEnd') && index > 0)
            {
                if (levelCount === 1)
                {
                    newIndex = index - 1;
                    newElement = elem != null ? elem['previousSibling'] : null;
                    newLevel = level;
                }
                else
                {
                    if (level === levelCount - 1)
                    {
                        newIndex = index - 1;
                        newElement = this._getHeaderByIndex(newIndex, level, root, levelCount, start);
                    }
                    else
                    {
                        newElement = this._getHeaderByIndex(this._getAttribute(elem['parentNode'], 'start', true) - 1, level, root, levelCount, start);
                        newIndex = newElement != null ? this._getAttribute(newElement['parentNode'], 'start', true) : index - 1;
                    }
                    newLevel = newElement != null ? this.getHeaderCellLevel(newElement) : level;
                    if (newIndex < 0)
                    {
                        break;
                    }
                }
                this.scrollToHeader({'axis': axis, 'index': newIndex, 'level':newLevel});
                this._setActive(newElement, event);
            }
            else if ((axis === 'column' || axis === 'columnEnd') && level > 0)
            {
                //moving down a level in the header
                newElement = this._getHeaderByIndex(index, level - 1, root, levelCount, start);
                newIndex = this._getAttribute(newElement['parentNode'], 'start', true);
                newLevel = this.getHeaderCellLevel(newElement);
                this.scrollToHeader({'axis': axis, 'index': newIndex, 'level':newLevel});
                this._setActive(newElement, event);
            }
            break;
        case DvtDataGrid.keyCodes.DOWN_KEY:
            if (axis == 'columnEnd' && jumpToHeaders && this.m_endColHeader != -1)
            {
                newElement = this._getHeaderByIndex(index, this.m_columnHeaderLevelCount, this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader);
                this.scrollToHeader({'axis': 'column', 'index': index, 'level':0});
                this._setActive(newElement, event);
            }
            else if (axis == 'column' && jumpToHeaders && this.m_endColEndHeader != -1)
                {
                newElement = this._getHeaderByIndex(index, this.m_columnEndHeaderLevelCount, this.m_colEndHeader, this.m_columnEndHeaderLevelCount, this.m_startColEndHeader);
                this.scrollToHeader({'axis': 'columnEnd', 'index': index, 'level':0});
                this._setActive(newElement, event);
            }
            else if (axis === 'column' || axis === 'columnEnd')
            {
                if (level + depth >= levelCount)
                {
                    // column header, move to databody
                    // make the cell of the first row and current column active
                    // no need to scroll since it will be in the viewport
                    if (axis == 'column')
                    {
                        newCellIndex = this.createIndex(0, index);
                    }
                    else if (this._isHighWatermarkScrolling())
                    {
                        newCellIndex = this.createIndex(this.m_endRow, index);
                    }
                    else
                    {
                        newCellIndex = this.createIndex(this.getDataSource().getCount("row") - 1, index);
                    }

                    this.scrollToIndex(newCellIndex);
                    if (this._isSelectionEnabled())
                    {
                        this.selectAndFocus(newCellIndex, event);
                    }
                    else
                    {
                        this._setActiveByIndex(newCellIndex, event);
                    }
                }
                else
                {
                    //moving down a level in the header
                    newElement = this._getHeaderByIndex(index, level + depth, root, levelCount, start);
                    newIndex = this._getAttribute(newElement['parentNode'], 'start', true);
                    newLevel = this.getHeaderCellLevel(newElement);
                    this.scrollToHeader({'axis': axis, 'index': newIndex, 'level':newLevel});
                    this._setActive(newElement, event);
                }
            }
            else
            {
                if (levelCount === 1)
                {
                    newIndex = index + 1;
                    newElement = elem != null ?  elem['nextSibling'] : null;
                    newLevel = level;
                }
                else
                {
                    if (level === levelCount - 1)
                    {
                        newIndex = index + 1;
                        newElement = this._getHeaderByIndex(newIndex, level, root, levelCount, start);
                    }
                    else
                    {
                        newIndex = elem != null ? this._getAttribute(elem['parentNode'], 'start', true) + this._getAttribute(elem['parentNode'], 'extent', true) : index + 1;
                        newElement = this._getHeaderByIndex(newIndex, level, root, levelCount, start);
                    }
                    newLevel = newElement != null ? this.getHeaderCellLevel(newElement) : level;
                }

                if (!(newIndex > end && stopFetch) && (this._isCountUnknown("row") || newIndex < this.getDataSource().getCount("row")))
                {
                    this.scrollToHeader({'axis': axis, 'index': newIndex, 'level':newLevel});
                    this._setActive(newElement, event);
                }
            }
            break;            
        case DvtDataGrid.keyCodes.PAGEUP_KEY:
            if (axis === 'row' || axis === 'rowEnd')
            {
                // selects the first available row header
                elem = this._getHeaderByIndex(0, level, root, levelCount, start);
                this.scrollToHeader({'axis': axis, 'index': 0, 'level':level});                                
                this._setActive(elem, event);
            }
            break;            
        case DvtDataGrid.keyCodes.PAGEDOWN_KEY:
            if (axis === 'row' || axis === 'rowEnd')
            {
                // selects the last available row header
                if (!this._isCountUnknown("row") && !this._isHighWatermarkScrolling())
                {
                    index = Math.max(0, this.getDataSource().getCount("row") - 1);
                }
                else
                {
                    index = Math.max(0, end);
                }
                elem = this._getHeaderByIndex(index, level, root, levelCount, start);
                this.scrollToHeader({'axis': axis, 'index': index, 'level':level});                                
                this._setActive(elem, event);
            }
            break;
        case DvtDataGrid.keyCodes.HOME_KEY:
            if (axis === 'column' || axis === 'columnEnd')
            {
                // selects the first cell of the current row
                elem = this._getHeaderByIndex(0, level, root, levelCount, start);
                this.scrollToHeader({'axis': axis, 'index': 0, 'level':level});                                
                this._setActive(elem, event);
            }
            break;
        case DvtDataGrid.keyCodes.END_KEY:
            if (axis === 'column' || axis === 'columnEnd')
            {
                // selects the last cell of the current row
                if (!this._isCountUnknown("column") && !this._isHighWatermarkScrolling())
                {
                    index = Math.max(0, this.getDataSource().getCount("column") - 1);
                }
                else
                {
                    index = Math.max(0, end);
                }
                // selects the first cell of the current row
                elem = this._getHeaderByIndex(index, level, root, levelCount, start);
                this.scrollToHeader({'axis': axis, 'index': index, 'level':level});                
                this._setActive(elem, event);
            }                
            break;
    }
    return true;
};

/**
 * Get the label of the header
 * @param {string} axis
 * @param {Element} root
 * @param {number} levelCount
 * @param {number} start
 * @param {number} end
 * @param {number} currentIndex
 * @param {number} previousIndex
 * @param {Element} element
 * @returns {string}
 */
DvtDataGrid.prototype._getHeaderLabel = function(axis, root, levelCount, start, end, currentIndex, previousIndex, element)
{
    var columnEndHeader, previousElement;
    if (end != -1 && (currentIndex != previousIndex || this.m_externalFocus))
    {
        columnEndHeader = this.getHeaderFromCell(element, axis);
        if (previousIndex != null)
        {
            previousElement = this._getHeaderByIndex(previousIndex, levelCount - 1, root, levelCount, start);
        }
        return this._getHeaderAndParentIds(columnEndHeader, previousElement);
    }
    return '';
};

/**
 * Get the Id's in a string to put in the accessibility labelledby
 * @param {Element=} header
 * @param {Element=} previousHeader
 * @returns {string}
 */
DvtDataGrid.prototype._getHeaderAndParentIds = function(header, previousHeader)
{
    var i, parents, idString = '', previousParents = [];
    if (header == null)
    {
        // header not rendered
        return '';
    }

    parents = this._getHeaderAndParents(header);
    if (previousHeader != null)
    {
        previousParents = this._getHeaderAndParents(previousHeader);
    }
    for (i = 0; i < parents.length; i++)
    {
        // always add the header that we are focusing
        if (previousParents[i] != parents[i] || i === parents.length - 1)
        {
            idString += (idString == '' ? '':' ') + parents[i]['id'];
        }
    }
    return idString;
};

/**
 * Get the nested headers above the header and including the header.
 * Puts them in an array starting with the outermost.
 * @param {Element} header
 * @returns {Array}
 */
DvtDataGrid.prototype._getHeaderAndParents = function(header)
{
    var axis, level, headerLevels, headers = [header];
    axis = this.getHeaderCellAxis(header);
    level = this.getHeaderCellLevel(header);
    if (axis === 'row')
    {
        headerLevels = this.m_rowHeaderLevelCount;
    }
    else if (axis === 'column')
    {
        headerLevels = this.m_columnHeaderLevelCount;
    }
    else if (axis === 'rowEnd')
    {
        headerLevels = this.m_rowEndHeaderLevelCount;
    }
    else if (axis === 'columnEnd')
    {
        headerLevels = this.m_columnEndHeaderLevelCount;
    }

    if (headerLevels === 1)
    {
        return headers;
    }
    else if (level === headerLevels - 1)
    {
        header = header['parentNode']['firstChild'];
        headers.unshift(header);
        level -= 1;
    }

    while (level > 0)
    {
        header = header['parentNode']['parentNode']['firstChild'];
        headers.unshift(header);
        level -= 1;
    }
    return headers;
};

/**
 * Handles arrow keys navigation on cell
 * @param {number} keyCode description
 * @param {boolean} isExtend
 * @param {Event} event the DOM event causing the arrow keys
 * @param {boolean} changeRegions
 * @param {boolean} jumpToHeaders jump to headers if possible
 */
DvtDataGrid.prototype.handleFocusChange = function(keyCode, isExtend, event, changeRegions, jumpToHeaders)
{
    var currentCellIndex, row, column, newCellIndex, focusFunc;

    // ensure that there's no outstanding fetch requests
    if (!this.isFetchComplete())
    {
        //act as if processed to prevent page scrolling before fetch done
        return true;
    }

    if (isExtend)
    {
        currentCellIndex = this.m_selectionFrontier;
    }
    else
    {
        currentCellIndex = this.m_active['indexes'];
    }

    if (currentCellIndex == null)
    {
        return;
    }

    if (this.getResources().isRTLMode())
    {
        if (keyCode == DvtDataGrid.keyCodes.LEFT_KEY)
        {
            keyCode = DvtDataGrid.keyCodes.RIGHT_KEY;
        }
        else if (keyCode == DvtDataGrid.keyCodes.RIGHT_KEY)
        {
            keyCode = DvtDataGrid.keyCodes.LEFT_KEY;
        }
    }

    // invoke different function for handling focusing on active cell depending on whether selection is enabled
    focusFunc = this._isSelectionEnabled() ? this.selectAndFocus.bind(this) : this._setActiveByIndex.bind(this);
    row = currentCellIndex['row'];
    column = currentCellIndex['column'];

    // navigation to cell using arrow keys.  We are using index instead of dom element
    // because the dom element might not be there in all cases
    switch (keyCode)
    {
        case DvtDataGrid.keyCodes.LEFT_KEY:
            if (column > 0 && !(jumpToHeaders && this.m_endRowHeader != -1))
            {
                // for left and right key in row selection mode, we'll be only shifting active cell and
                // selection will not be affected
                if (this.m_options.getSelectionMode() == "row")
                {
                    // ensure active cell index is used for row since it might use frontier if extended
                    newCellIndex = this.createIndex(this.m_active['indexes']['row'], column - 1);
                    this.scrollToIndex(newCellIndex, isExtend);
                    this._setActiveByIndex(newCellIndex, event);
                }
                else
                {
                    newCellIndex = this.createIndex(row, column - 1);
                    this.scrollToIndex(newCellIndex, isExtend);
                    if (isExtend)
                    {
                        this.extendSelection(newCellIndex, event);
                    }
                    else
                    {
                        focusFunc(newCellIndex, event);
                    }

                    // announce to screen reader that we have reached first column
                    if (column - 1 === 0)
                    {
                        this._setAccInfoText('accessibleFirstColumn');
                    }
                }
            }
            else if (!isExtend && changeRegions)
            {
                    this.scrollToHeader({'axis': 'row', 'index': row, 'level':this.m_rowHeaderLevelCount - 1});
                    // reached the first column, go to row header if available
                this._setActive(this._getHeaderByIndex(row, this.m_rowHeaderLevelCount - 1, this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader), event, true);
                }
            break;
        case DvtDataGrid.keyCodes.RIGHT_KEY:
            // if condition for unknown count and known count cases on whether we have reached the end
            if (!this._isLastColumn(column) && !(jumpToHeaders && this.m_endRowEndHeader != -1))
            {
                // for left and right key in row selection mode, we'll be only shifting active cell and
                // selection will not be affected
                if (this.m_options.getSelectionMode() == "row")
                {
                    // ensure active cell index is used for row since it might use frontier if extended
                    newCellIndex = this.createIndex(this.m_active['indexes']['row'], column + 1);
                    this.scrollToIndex(newCellIndex, isExtend);
                    this._setActiveByIndex(newCellIndex, event);
                }
                else
                {
                    newCellIndex = this.createIndex(row, column + 1);
                    this.scrollToIndex(newCellIndex, isExtend);
                    if (isExtend)
                    {
                        this.extendSelection(newCellIndex, event);
                    }
                    else
                    {
                        focusFunc(newCellIndex, event);
                    }

                    // announce to screen reader that we have reached last column
                    if (this._isLastColumn(column + 1))
                    {
                        this._setAccInfoText('accessibleLastColumn');
                    }
                }
            }
            else if (this.m_endRowEndHeader != -1 && changeRegions)
            {
                this.scrollToHeader({'axis': 'rowEnd', 'index': row, 'level':this.m_rowEndHeaderLevelCount - 1});
                // reached the last column, go to row end header if available
                this._setActive(this._getHeaderByIndex(row, this.m_rowEndHeaderLevelCount - 1, this.m_rowEndHeader, this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader), event, true);
            }
            else if (!isExtend)
            {
                // if anchor cell is in the last column, and they arrow right (without Shift), then collapse the range to just the focus cell.  (Matches Excel and intuition.)
                focusFunc(currentCellIndex, event);
                this.scrollToIndex(currentCellIndex);
            }
            break;
        case DvtDataGrid.keyCodes.UP_KEY:
            if (row > 0 && !(jumpToHeaders && this.m_endColHeader != -1))
            {
                newCellIndex = this.createIndex(row - 1, column);
                this.scrollToIndex(newCellIndex, isExtend);
                if (isExtend)
                {
                    this.extendSelection(newCellIndex, event);
                }
                else
                {
                    focusFunc(newCellIndex, event);
                }

                // announce to screen reader that we have reached first row
                if (row - 1 === 0)
                {
                    this._setAccInfoText('accessibleFirstRow');
                }
            }
            else
            {
                //if in multiple selection don't clear the selection
                if (!isExtend && changeRegions)
                {
                    this.scrollToHeader({'axis': 'column', 'index': column, 'level':this.m_columnHeaderLevelCount - 1});
                    // reached the first row, go to column header if available
                    this._setActive(this._getHeaderByIndex(column, this.m_columnHeaderLevelCount - 1, this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader), event, true);
                }
            }
            break;
        case DvtDataGrid.keyCodes.DOWN_KEY:
            if (!this._isLastRow(row) && !(jumpToHeaders && this.m_endColEndHeader != -1))
            {
                newCellIndex = this.createIndex(row + 1, column);
                this.scrollToIndex(newCellIndex, isExtend);
                if (isExtend)
                {
                    this.extendSelection(newCellIndex, event);
                }
                else
                {
                    focusFunc(newCellIndex, event);
                }

                // announce to screen reader that we have reached last row
                if (this._isLastRow(row + 1))
                {
                    this._setAccInfoText('accessibleLastRow');
                }
            }
            else if (this.m_endColEndHeader != -1 && changeRegions)
            {
                this.scrollToHeader({'axis': 'columnEnd', 'index': column, 'level':this.m_columnEndHeaderLevelCount - 1});
                // reached the last column, go to row end header if available
                this._setActive(this._getHeaderByIndex(column, this.m_columnEndHeaderLevelCount - 1, this.m_colEndHeader, this.m_columnEndHeaderLevelCount, this.m_startColEndHeader), event, true);
            }
            else if (!isExtend)
            {
                // if anchor cell is in the last row, and they arrow down (without Shift), then collapse the range to just the focus cell.  (Matches Excel and intuition.)
                focusFunc(currentCellIndex, event);
                this.scrollToIndex(currentCellIndex);
            }
            break;
        case DvtDataGrid.keyCodes.HOME_KEY:
            // selects the first cell of the current row
            newCellIndex = this.createIndex(row, 0);
            this.scrollToIndex(newCellIndex);
            focusFunc(newCellIndex, event);
            break;
        case DvtDataGrid.keyCodes.END_KEY:
            // selects the last cell of the current row
            if (!this._isCountUnknown("column") && !this._isHighWatermarkScrolling())
            {
                newCellIndex = this.createIndex(row, Math.max(0, this.getDataSource().getCount("column") - 1));
            }
            else
            {
                newCellIndex = this.createIndex(row, Math.max(0, this.m_endCol));
            }
            this.scrollToIndex(newCellIndex);
            focusFunc(newCellIndex, event);
            break;
        case DvtDataGrid.keyCodes.PAGEUP_KEY:
            // selects the first cell of the current column
            newCellIndex = this.createIndex(0, column);
            this.scrollToIndex(newCellIndex);
            focusFunc(newCellIndex, event);
            break;
        case DvtDataGrid.keyCodes.PAGEDOWN_KEY:
            // selects the last cell of the current column
            if (!this._isCountUnknown("column") && !this._isHighWatermarkScrolling())
            {
                newCellIndex = this.createIndex(Math.max(0, this.getDataSource().getCount("row") - 1), column);
            }
            else
            {
                newCellIndex = this.createIndex(Math.max(0, this.m_endRow), column);
            }
            this.scrollToIndex(newCellIndex);
            focusFunc(newCellIndex, event);
            break;
    }

    return true;
};

/**
 * Scrolls to an  index
 * @param {Object} index - the end index of the selection.
 * @param {boolean|null=} isExtend - true if we should not focus the the new index
 */
DvtDataGrid.prototype.scrollToIndex = function(index, isExtend)
{
    var row, column, deltaX, deltaY, scrollTop, databodyContent, rowElem, viewportTop, viewportBottom, dir,
            rowTop, rowHeight, scrollLeft, cell, cellLeft, cellWidth, viewportLeft, viewportRight, scrollRows;
    row = index['row'];
    column = index['column'];
    dir = this.getResources().isRTLMode() ? "right" : "left";

    deltaX = 0;
    deltaY = 0;
    viewportTop = this._getViewportTop();
    viewportBottom = this._getViewportBottom();
    viewportLeft = this._getViewportLeft();
    viewportRight = this._getViewportRight();    
    
    // check if index is completely outside of rendered
    if (row < this.m_startRow || row > this.m_endRow)
    {
        if (row < this.m_startRow)
        {
            scrollTop = this.m_avgRowHeight * row;
        }
        else
        {
            scrollTop = this.m_avgRowHeight * (row + 1) - viewportBottom + viewportTop;
        }
        deltaY = this.m_currentScrollTop - scrollTop;

        // remember to focus on the row after fetch
        this.m_scrollIndexAfterFetch = index;
        scrollRows = true;
    }
    else
    {
        // it's rendered, find location and scroll to it
        databodyContent = this.m_databody['firstChild'];
        rowElem = databodyContent['childNodes'][row - this.m_startRow];

        rowTop = this.getElementDir(rowElem, 'top');
        rowHeight = this.calculateRowHeight(rowElem);
        if (rowTop + rowHeight > viewportBottom)
        {
            deltaY = viewportBottom - (rowTop + rowHeight);
        }
        else if (rowTop < viewportTop)
        {
            deltaY = viewportTop - rowTop;
        }
    }

    // if column is defined and it's not already a fetch outside of rendered
    // use scrollRows to know it was not pre-defined
    if (!isNaN(column) && scrollRows != true)
    {
        // check if index is completely outside of rendered
        // approximate scroll position
        if (column < this.m_startCol || column > this.m_endCol)
        {
            if (column < this.m_startCol)
            {
                scrollLeft = this.m_avgColWidth * column;
            }
            else
            {
                scrollLeft = this.m_avgColWidth * (column + 1) - viewportRight + viewportLeft;
            }
            deltaX = this.m_currentScrollLeft - scrollLeft;

            // remember to focus on the cell after fetch
            this.m_scrollIndexAfterFetch = index;
        }
        else
        {
            // it's rendered, find location and scroll to it
            databodyContent = this.m_databody['firstChild'];
            rowElem = databodyContent['childNodes'][row - this.m_startRow];
            cell = rowElem['childNodes'][column - this.m_startCol];
            cellLeft = this.getElementDir(cell, dir);
            cellWidth = this.getElementWidth(cell);

            if (cellLeft < viewportLeft)
            {
                deltaX = viewportLeft - cellLeft;
            }
            else if (cellLeft + cellWidth > viewportRight)
            {
                deltaX = viewportRight - (cellLeft + cellWidth);
            }
        }
    }

    // scroll if either horiz or vert scroll pos has changed
    if (deltaX != 0 || deltaY != 0)
    {
        if (cell != null && isExtend !== true)
        {
            // delay focus on cell until databody has scrolled (by the scroll event handler)
            this.m_cellToFocus = cell;
        }
        this.scrollDelta(deltaX, deltaY);
    }//if there's an index we wanted to scroll to after fetch it has now been scrolled to by scrollToIndex, so highlight it
    else if (this.m_scrollIndexAfterFetch != null)
    {
        if (this._setActiveByIndex(this.m_scrollIndexAfterFetch))
        {
            this.m_scrollIndexAfterFetch = null;
        }
    }
};

/**
 * Scrolls to an  index
 * @param {Object} headerInfo
 * @param {string} headerInfo.axis
 * @param {number} headerInfo.index
 * @param {number} headerInfo.level
 */
DvtDataGrid.prototype.scrollToHeader = function(headerInfo)
{
    var delta, startIndex, endIndex, averageDiff, currentScroll, newScroll, headerMin, headerDiff,
            header, viewportMin, viewportMax, viewportDiff, axis, index, level;
    axis = headerInfo['axis'];
    index = headerInfo['index'];
    level = headerInfo['level'];
    delta = 0;  
    
    if (axis === 'row')
    {
        startIndex = this.m_startRowHeader;
        endIndex = this.m_endRowHeader;
        averageDiff = this.m_avgRowHeight;
        currentScroll = this.m_currentScrollTop;
        viewportMin = this._getViewportTop();
        viewportMax = this._getViewportBottom();
    }
    else if (axis === 'column')
    {
        startIndex = this.m_startColHeader;
        endIndex = this.m_endColHeader;
        averageDiff = this.m_avgColWidth;
        currentScroll = this.m_currentScrollLeft;
        viewportMin = this._getViewportLeft();
        viewportMax = this._getViewportRight();
    }
    else if (axis === 'rowEnd')
    {
        startIndex = this.m_startRowEndHeader;
        endIndex = this.m_endRowEndHeader;
        averageDiff = this.m_avgRowHeight;
        currentScroll = this.m_currentScrollTop;
        viewportMin = this._getViewportTop();
        viewportMax = this._getViewportBottom();
    }
    else if (axis === 'columnEnd')
    {
        startIndex = this.m_startColEndHeader;
        endIndex = this.m_endColEndHeader;
        averageDiff = this.m_avgColWidth;
        currentScroll = this.m_currentScrollLeft;
        viewportMin = this._getViewportLeft();
        viewportMax = this._getViewportRight();
    }
    
    viewportDiff = viewportMax - viewportMin;   

    // check if index is completely outside of rendered
    if (index < startIndex || index > endIndex)
    {
        if (index < startIndex)
        {
            newScroll = averageDiff * index;
        }
        else
        {
            newScroll = averageDiff * (index + 1) - viewportDiff;
        }
        delta = currentScroll - newScroll;

        // remember to focus on the row after fetch
        this.m_scrollHeaderAfterFetch = headerInfo;
    }
    else
    {
        if (axis === 'row' || axis === 'rowEnd')
        {
            if (axis === 'row')
            {
                header = this._getHeaderByIndex(index, level, this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader);
            }
            else
            {
                header = this._getHeaderByIndex(index, level, this.m_rowEndHeader, this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader);
            }
            headerMin = this.getElementDir(header, 'top');
            headerDiff = this.getElementHeight(header);
        }
        else if (axis === 'column' || axis === 'columnEnd')
        {
            if (axis === 'column')
            {
                header = this._getHeaderByIndex(index, level, this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader);
            }
            else
            {
                header = this._getHeaderByIndex(index, level, this.m_colEndHeader, this.m_columnEndHeaderLevelCount, this.m_startColEndHeader);
            }
            headerMin = this.getElementDir(header, this.getResources().isRTLMode() ? "right" : "left");
            headerDiff = this.getElementWidth(header);
        }

        if (viewportDiff > headerDiff)
        {
            if (headerMin + headerDiff > viewportMax)
            {
                delta = viewportMax - (headerMin + headerDiff);
            }
            else if (headerMin < viewportMin)
            {
                delta = viewportMin - headerMin;
            }
        }
        else
        {
            delta = viewportMin - headerMin;
        }
    }

    // scroll if either horiz or vert scroll pos has changed
    if (delta != 0)
    {
        if (header != null)
        {
            // delay focus on cell until databody has scrolled (by the scroll event handler)
            this.m_cellToFocus = header;
        }
        (axis === 'row' || axis === 'rowEnd') ? this.scrollDelta(0, delta) : this.scrollDelta(delta, 0);
    }
    //if there's an index we wanted to sctoll to after fetch it has now been scrolled to by scrollToIndex, so highlight it
    else if (this.m_scrollHeaderAfterFetch != null)
    {
        this._updateActive(headerInfo, true);
        this.m_scrollHeaderAfterFetch = null;
    }
};

/**
 * Locate the header element.  Look up recursively from its parent if neccessary.
 * @param {Element|undefined|null} elem the starting point to locate the header element
 * @param {string=} headerCellClassName the name of the header cell class name
 * @param {string=} endHeaderCellClassName the name of the header cell class name
 * @return {Element|null|undefined} the header element
 * @private
 */
DvtDataGrid.prototype.findHeader = function(elem, headerCellClassName, endHeaderCellClassName)
{
    if (headerCellClassName == null)
    {
        headerCellClassName = this.getMappedStyle("headercell");
    }

    if (endHeaderCellClassName == null)
    {
        endHeaderCellClassName = this.getMappedStyle("endheadercell");
    }

    if (headerCellClassName != null)
    {
        if (this.m_utils.containsCSSClassName(elem, headerCellClassName) ||
            this.m_utils.containsCSSClassName(elem, endHeaderCellClassName))
        {
            // found header element
            return elem;
        }
        else if (elem['parentNode'])
        {
            // recursive call with parent node
            return this.findHeader(elem['parentNode'], headerCellClassName, endHeaderCellClassName);
        }
        else if (elem === this.m_root)
        {
            // short circuit to terminal when root is reached
            return null;
        }
    }

    // all other case returns null
    return null;
};

/**
 * Ensures row banding is set on the proper rows
 * @private
 */
DvtDataGrid.prototype.updateRowBanding = function()
{
    var rowBandingInterval, rows, i, index, bandingClass;
    rowBandingInterval = this.m_options.getRowBandingInterval();
    if (rowBandingInterval > 0)
    {
        rows = this.m_databody['firstChild']['childNodes'];
        bandingClass = this.getMappedStyle("banded");
        for (i = 0; i < rows.length; i++)
        {
            index = this.m_startRow + i;
            if ((Math.floor(index / rowBandingInterval) % 2 === 1))
            {
                if (!this.m_utils.containsCSSClassName(rows[i], bandingClass))
                {
                    this.m_utils.addCSSClassName(rows[i], bandingClass);
                }
            }
            else
            {
                if (this.m_utils.containsCSSClassName(rows[i], bandingClass))
                {
                    this.m_utils.removeCSSClassName(rows[i], bandingClass);
                }
            }
        }
    }
};

/**
 * Ensures column banding is set on the proper rows
 * @private
 */
DvtDataGrid.prototype.updateColumnBanding = function()
{
    var columnBandingInterval, rows, i, index, bandingClass, j, row;
    columnBandingInterval = this.m_options.getColumnBandingInterval();
    if (columnBandingInterval > 0)
    {
        rows = this.m_databody['firstChild']['childNodes'];
        bandingClass = this.getMappedStyle("banded");
        for (i = 0; i < rows.length; i += 1)
        {
            row = rows[i]['childNodes'];
            for (j = 0; j < row.length; j += 1)
            {
                index = this.m_startCol + j;
                if ((Math.floor(index / columnBandingInterval) % 2 === 1))
                {
                    if (!this.m_utils.containsCSSClassName(row[j], bandingClass))
                    {
                        this.m_utils.addCSSClassName(row[j], bandingClass);
                    }
                }
                else
                {
                    if (this.m_utils.containsCSSClassName(row[j], bandingClass))
                    {
                        this.m_utils.removeCSSClassName(rows[j], bandingClass);
                    }
                }
            }
        }
    }
};

/**
 * Remove banding (both row and column)
 * @private
 */
DvtDataGrid.prototype._removeBanding = function()
{
    var rows, row, i, j, bandingClass;
    rows = this.m_databody['firstChild']['childNodes'];
    bandingClass = this.getMappedStyle("banded");
    for (i = 0; i < rows.length; i++)
    {
        if (this.m_utils.containsCSSClassName(rows[i], bandingClass))
        {
            this.m_utils.removeCSSClassName(rows[i], bandingClass);
        }
        row = rows[i]['childNodes'];
        for (j = 0; j < row.length; j += 1)
        {
            if (this.m_utils.containsCSSClassName(row[j], bandingClass))
            {
                this.m_utils.removeCSSClassName(row[j], bandingClass);
            }
        }
    }
};

/**
 * Sets the accessibility status text
 * @param {string} key the message key
 * @param {Object|Array|null=} args to pass into the translator
 * @private
 */
DvtDataGrid.prototype._setAccInfoText = function(key, args)
{
    var text = this.getResources().getTranslatedText(key, args);
    if (text != null)
    {
        this.m_accInfo.textContent = text;
    }
};

/**
 * Handles expand event from the flattened datasource.
 * @param {Object} event the expand event
 * @param {boolean} fromQueue whether this is invoked from processing the model event queue, optional.
 * @private
 */
DvtDataGrid.prototype.handleExpandEvent = function(event, fromQueue)
{
    var row, rowKey;

    if (fromQueue === undefined && this.queueModelEvent(event))
    {
        // tag the event for discovery later
        event['operation'] = 'expand';
        return;
    }

    rowKey = event['rowKey'];
    row = this._findRowByKey(rowKey);
    row.setAttribute("aria-expanded", true);

    // update screen reader alert
    this._setAccInfoText("accessibleRowExpanded");
    this.populateAccInfo();
};

/**
 * Handles collapse event from the flattened datasource.
 * @param {Object} event the collapse event
 * @param {boolean} fromQueue whether this is invoked from processing the model event queue, optional.
 * @private
 */
DvtDataGrid.prototype.handleCollapseEvent = function(event, fromQueue)
{
    var row, rowKey;

    if (fromQueue === undefined && this.queueModelEvent(event))
    {
        // tag the event for discovery later
        event['operation'] = 'collapse';
        return;
    }

    rowKey = event['rowKey'];
    row = this._findRowByKey(rowKey);
    row.setAttribute("aria-expanded", false);

    // update screen reader alert
    this._setAccInfoText("accessibleRowCollapsed");
    this.populateAccInfo();
};

/**
 * Set the key on an element.
 * @param {Element} element the element to get key of
 * @param {Object|string|number} key the key to set
 * @private
 */
DvtDataGrid.prototype._setKey = function(element, key)
{
    if (element != null)
    {
        element[this.getResources().getMappedAttribute('key')] = key;
    }
};

/**
 * Retrieve the key from an element.
 * @param {Element|Node|undefined} element the element to retrieve the key from.
 * @return {string|null} the key of the element
 * @private
 */
DvtDataGrid.prototype._getKey = function(element)
{
    if (element != null)
    {
        return element[this.getResources().getMappedAttribute('key')];
    }
    return null;
};

/**
 * Retrieve the active row key.
 * @param {boolean=} prev if we want the previous row key instead
 * @return {string|null} the key of the active row
 * @private
 */
DvtDataGrid.prototype._getActiveRowKey = function(prev)
{
    if (prev && this.m_prevActive != null)
    {
        if (this.m_prevActive['type'] == 'header' && (this.m_prevActive['axis'] === 'row' || this.m_prevActive['axis'] === 'rowEnd'))
        {
            return this.m_prevActive['key'];
        }
        else if (this.m_prevActive['type'] == 'cell')
        {
            return this.m_prevActive['keys']['row'];
        }
    }
    else if (this.m_active != null)
    {
        if (this.m_active['type'] == 'header' && (this.m_active['axis'] === 'row' || this.m_active['axis'] === 'rowEnd'))
        {
            return this.m_active['key'];
        }
        else if (this.m_active['type'] == 'cell')
        {
            return this.m_active['keys']['row'];
        }
    }
    return null;
};

/**
 * Retrieve the active row.
 * @return {Element|null} the active row
 * @private
 */
DvtDataGrid.prototype._getActiveRow = function()
{
    if (this.m_active != null)
    {
        return this._findRowByKey(this.m_active['keys']['row']);
    }
    return null;
};

///////////////////// move methods////////////////////////
/**
 * Handles cut event from the flattened datasource.
 * @param {Event} event the cut event
 * @param {Element=} target the target element
 * @return {boolean} true if the event was processed here
 * @private
 */
DvtDataGrid.prototype._handleCut = function(event, target)
{
    var rowKey;
    if (target == null)
    {
        target = /** @type {Element} */ (event.target);
    }
    if (this._isMoveOnRowEnabled(this.findRow(target)))
    {    
        if (this.m_cutRow != null)
        {
            this.m_utils.removeCSSClassName(this.m_cutRow, this.getMappedStyle('cut'));
        }
        rowKey = this._getKey(this.find(target, 'row'));
        //cut row header with row
        this.m_cutRow = this._findRowByKey(rowKey);
        this.m_cutRowHeader = this._findHeaderByKey(rowKey, this.m_rowHeader, this.getMappedStyle('rowheadercell'));
        this.m_cutRowEndHeader = this._findHeaderByKey(rowKey, this.m_rowEndHeader, this.getMappedStyle('rowendheadercell'));
        this.m_utils.addCSSClassName(this.m_cutRow, this.getMappedStyle('cut'));
        if (this.m_cutRowHeader !== null)
        {
            this.m_utils.addCSSClassName(this.m_cutRowHeader, this.getMappedStyle('cut'));
        }
        return true;
    }
    return false;
};

/**
 * Handles cut event from the flattened datasource.
 * @param {Event} event the cut event
 * @param {Element=} target the target element
 *
 * @private
 */
DvtDataGrid.prototype._handlePaste = function(event, target)
{
    var row;
    if (target == null)
    {
        target = /** @type {Element} */ (event.target);
    }
    if (this.m_cutRow != null)
    {
        this.m_utils.removeCSSClassName(this.m_cutRow, this.getMappedStyle('cut'));
        if (this.m_cutRowHeader !== null)
        {
            //remove css from row header too
            this.m_utils.removeCSSClassName(this.m_cutRowHeader, this.getMappedStyle('cut'));
            this.m_cutRowHeader = null;
        }
        if (this.m_cutRowEndHeader !== null)
        {
            //remove css from row header too
            this.m_utils.removeCSSClassName(this.m_cutRowEndHeader, this.getMappedStyle('cut'));
            this.m_cutRowEndHeader = null;
        }
        row = this.find(target, 'row');
        if (this.m_cutRow !== row)
        {
            if (this._isSelectionEnabled())
            {
                // unhighlight and clear selection
                this._clearSelection(event);
            }
            if (this._isDatabodyCellActive())
            {
                this._unhighlightActive();
            }
            this.m_moveActive = true;
            this.getDataSource().move(this._getKey(this.m_cutRow), this._getKey(row));
        }
        this.m_cutRow = null;
        return true;
    }
    return false;
};

/**
 * Handles canceling a reorder
 * @param {Object} event the cut event
 * @param {Element=} target the target element
 *
 * @private
 */
DvtDataGrid.prototype._handleCancelReorder = function(event, target)
{
    if (this.m_cutRow != null)
    {
        this.m_utils.removeCSSClassName(this.m_cutRow, this.getMappedStyle('cut'));
        this.m_cutRow = null;
        if (this.m_cutRowHeader !== null)
        {
            this.m_utils.removeCSSClassName(this.m_cutRowHeader, this.getMappedStyle('cut'));
            this.m_cutRowHeader = null;
        }
        if (this.m_cutRowEndHeader !== null)
        {
            this.m_utils.removeCSSClassName(this.m_cutRowEndHeader, this.getMappedStyle('cut'));
            this.m_cutRowEndHeader = null;
        }
        return true;
    }
};

/**
 * Handles cut event from the flattened datasource.
 * @param {Object} event the cut event
 * @private
 */
DvtDataGrid.prototype._handleMove = function(event)
{
    var deltaY, height, rowKey, target;
    //initialize the move
    if (this.m_moveRow == null)
    {
        target = /** @type {Element} */ (event.target);
        //get the move row key to set the move row/rowHeader
        rowKey = this._getKey(this.find(target, 'row'));
        this.m_moveRow = this._findRowByKey(rowKey);
        this.m_moveRowHeader = this._findHeaderByKey(rowKey, this.m_rowHeader, this.getMappedStyle('rowheadercell'));
        this.m_moveRowEndHeader = this._findHeaderByKey(rowKey, this.m_rowEndHeader, this.getMappedStyle('rowendheadercell'));

        //need to store the height inline if not already because top values will be changing
        if (this.m_moveRow['style']['height'] != null)
        {
            this.setElementHeight(this.m_moveRow, this.calculateRowHeight(this.m_moveRow));
        }

        //add the move style class to the css
        this.m_utils.addCSSClassName(this.m_moveRow, this.getMappedStyle('drag'));
        this.m_originalTop = this.getElementDir(this.m_moveRow, 'top');

        this.m_dropTarget = document.createElement("div");
        this.m_utils.addCSSClassName(this.m_dropTarget, this.getMappedStyle('drop'));
        this.setElementHeight(this.m_dropTarget, this.calculateRowHeight(this.m_moveRow));
        this.setElementDir(this.m_dropTarget, this.m_originalTop, 'top');
        this.m_databody['firstChild'].appendChild(this.m_dropTarget); //@HTMLUpdateOK

        this._addHeaderDropTarget(this.m_moveRowHeader, this.m_rowHeader, false);
        this._addHeaderDropTarget(this.m_moveRowEndHeader, this.m_rowEndHeader, true);
            }

    //calculate the change in Y direction
    if (!this.m_utils.isTouchDevice())
    {
        this.m_prevY = this.m_currentY;
        this.m_currentY = event['pageY'];
    }
    deltaY = this.m_currentY - this.m_prevY;
    height = this.calculateRowHeight(this.m_moveRow);

    //adjust the top height of the moveRow and moveRowHeader
    this.setElementDir(this.m_moveRow, (this.getElementDir(this.m_moveRow, 'top') + deltaY), 'top');
    if (this.m_moveRowHeader !== null)
    {
        this.setElementDir(this.m_moveRowHeader, (this.getElementDir(this.m_moveRowHeader, 'top') + deltaY), 'top');
    }
    if (this.m_moveRowEndHeader !== null)
    {
        this.setElementDir(this.m_moveRowEndHeader, (this.getElementDir(this.m_moveRowEndHeader, 'top') + deltaY), 'top');
    }

    //see if the element has crossed the halfway point of the nextSibling
    if (this.m_moveRow['nextSibling'] != null && this.m_moveRow['nextSibling'] != this.m_dropTarget &&
            this.getElementDir(this.m_moveRow['nextSibling'], 'top') < (this.getElementDir(this.m_moveRow, 'top') + (height / 2)))
    {
        this._moveDropRows('nextSibling');
    }
    else if (this.m_moveRow['previousSibling'] != null &&
            this.getElementDir(this.m_moveRow['previousSibling'], 'top') > (this.getElementDir(this.m_moveRow, 'top') - (height / 2)))
    {
        this._moveDropRows('previousSibling');
    }
};

/**
 * Add drop header target
 * @param {Element|null|undefined} moveHeader
 * @param {boolean} isEnd
 * @private
 */
DvtDataGrid.prototype._addHeaderDropTarget = function(moveHeader, root, isEnd)
{
    var dropTarget;
    if (moveHeader !== null)
    {
        //need to store the height inline if not already because top values will be changing
        if (moveHeader['style']['height'] == null)
        {
            this.setElementHeight(moveHeader, this.calculateRowHeight(moveHeader));
        }        
        this.m_utils.addCSSClassName(moveHeader, this.getMappedStyle('drag'));
        dropTarget = document.createElement("div");
        this.m_utils.addCSSClassName(dropTarget, this.getMappedStyle('drop'));
        this.setElementHeight(dropTarget, this.calculateRowHeight(moveHeader));
        this.setElementDir(dropTarget, this.m_originalTop, 'top');
        root['firstChild'].appendChild(dropTarget); //@HTMLUpdateOK        

        if (isEnd)
        {
            this.m_dropTargetEndHeader = dropTarget;            
        }
        else
        {
            this.m_dropTargetHeader = dropTarget;
        }
    }
};

/**
 * Determined if move is supported for the specified axis.
 * @param {string} sibling nextSibling/previosusSibling
 * @private
 */
DvtDataGrid.prototype._moveDropRows = function(sibling)
{
    var newTop, databodyScroller, newSiblingTop, headerScroller, endHeaderScroller;
    databodyScroller = this.m_moveRow['parentNode'];
    //move the drop target and the adjacent row
    if (sibling == 'nextSibling')
    {
        newTop = this.m_originalTop + this.calculateRowHeight(this.m_moveRow[sibling]);
        newSiblingTop = this.m_originalTop;
    }
    else
    {
        newTop = this.getElementDir(this.m_moveRow[sibling], 'top');
        newSiblingTop = newTop + this.calculateRowHeight(this.m_moveRow);
    }

    this.setElementDir(this.m_dropTarget, newTop, 'top');
    this.setElementDir(this.m_moveRow[sibling], newSiblingTop, 'top');
    if (this.m_moveRowHeader !== null)
    {
        headerScroller = this.m_moveRowHeader['parentNode'];
        this.setElementDir(this.m_dropTargetHeader, newTop, 'top');
        this.setElementDir(this.m_moveRowHeader[sibling], newSiblingTop, 'top');
    }
    if (this.m_moveRowEndHeader !== null)
    {
        endHeaderScroller = this.m_moveRowEndHeader['parentNode'];
        this.setElementDir(this.m_dropTargetEndHeader, newTop, 'top');
        this.setElementDir(this.m_moveRowEndHeader[sibling], newSiblingTop, 'top');
    }
    //store the new top value
    this.m_originalTop = newTop;

    this.m_utils.removeCSSClassName(this.m_moveRow['previousSibling'], this.getMappedStyle('activedrop'));

    //move the moveRow and rowHeader so we can continue to pull the adjacent header
    if (sibling === 'nextSibling')
    {
        databodyScroller.insertBefore(this.m_moveRow, this.m_moveRow[sibling][sibling]); //@HTMLUpdateOK
        if (this.m_moveRowHeader !== null)
        {
            headerScroller.insertBefore(this.m_moveRowHeader, this.m_moveRowHeader[sibling][sibling]); //@HTMLUpdateOK
        }
        if (this.m_moveRowEndHeader !== null)
        {
            endHeaderScroller.insertBefore(this.m_moveRowEndHeader, this.m_moveRowEndHeader[sibling][sibling]); //@HTMLUpdateOK
    }
    }
    else
    {
        databodyScroller.insertBefore(this.m_moveRow, this.m_moveRow[sibling]); //@HTMLUpdateOK
        if (this.m_moveRowHeader !== null)
        {
            headerScroller.insertBefore(this.m_moveRowHeader, this.m_moveRowHeader[sibling]); //@HTMLUpdateOK
        }
        if (this.m_moveRowEndHeader !== null)
        {
            endHeaderScroller.insertBefore(this.m_moveRowEndHeader, this.m_moveRowEndHeader[sibling]); //@HTMLUpdateOK
    }
    }
    this.m_utils.addCSSClassName(this.m_moveRow['previousSibling'], this.getMappedStyle('activedrop'));
};

/**
 * Determined if move is supported for the specified axis.
 * @param {string} axis the axis which we check whether move is supported.
 * @private
 */
DvtDataGrid.prototype._isMoveEnabled = function(axis)
{
    var capability, moveable;
    capability = this.getDataSource().getCapability("move");
    moveable = this.m_options.isMoveable('row');
    if (moveable === "enable" && (capability === "full" || capability === axis))
    {
        return true;
    }

    return false;
};

/**
 * Handles a mouse up after move
 * @param {Event} event MouseUp Event
 * @param {boolean} validUp true if in the databody or rowHeader
 * @private
 */
DvtDataGrid.prototype._handleMoveMouseUp = function(event, validUp)
{
    if (this.m_moveRow != null)
    {
        //remove the the drop target div from the databody/rowHeader
        this._remove(this.m_dropTarget);
        this.m_moveRow['style']['zIndex'] = '';
        if (this.m_moveRowHeader !== null)
        {
            this._remove(this.m_dropTargetHeader);
            this.m_moveRowHeader['style']['zIndex'] = '';
        }
        if (this.m_moveRowEndHeader !== null)
        {
            this._remove(this.m_dropTargetEndHeader);
            this.m_moveRowEndHeader['style']['zIndex'] = '';
        }
        if (this.m_active != null && this.m_active['axis'] != 'column')
        {
            this.m_moveActive = true;
        }

        //clear selection
        if (this._isSelectionEnabled())
        {
            // unhighlight and clear selection
            this._clearSelection(event);
        }

        //if the mousup was in the rowHeader or databody
        if (validUp == true)
        {
            this.getDataSource().move(this._getKey(this.m_moveRow), this.m_moveRow['nextSibling'] === null ? null : this._getKey(this.m_moveRow['nextSibling']));
        }
        else
        {
            this.getDataSource().move(this._getKey(this.m_moveRow), this._getKey(this.m_moveRow));
        }
        this.m_moveRow = null;
    }
    this.m_databodyMove = false;
};

/**
 * Check if a row can be moved, meaning it is the active row and move is enabled
 * @param {Element|null|undefined} row the row to move
 * @returns {boolean} true if the row can be moved
 */
DvtDataGrid.prototype._isMoveOnRowEnabled = function(row)
{
    //make sure it is not row in the column header/null
    if (row == null || this.m_utils.containsCSSClassName(row['parentNode'], this.getMappedStyle('colheader')))
    {
        return false;
    }
    if (this._isMoveEnabled('row'))
    {
        if (this._getActiveRowKey() === this._getKey(row))
        {
            return true;
        }
    }
    return false;
};

/**
 * Applies the draggable class to the new active row and row header, removes it if the active has changed
 */
DvtDataGrid.prototype._manageMoveCursor = function()
{
    var className, activeKey, prevActiveKey, activeRow, prevActiveRow, activeRowHeader, 
            prevActiveRowHeader, activeRowEndHeader, rowHederStyle, rowEndHeaderStyle;
    className = this.getMappedStyle('draggable');
    activeKey = this._getActiveRowKey();
    prevActiveKey = this._getActiveRowKey(true);
    activeRow = this._findRowByKey(activeKey);
    prevActiveRow = this._findRowByKey(prevActiveKey);
    rowHederStyle = this.getMappedStyle('rowheadercell');
    rowEndHeaderStyle = this.getMappedStyle('rowendheadercell');

    //remove draggable class name
    if (this.m_utils.containsCSSClassName(prevActiveRow, className))
    {
        this.m_utils.removeCSSClassName(prevActiveRow, className);
        prevActiveRowHeader = this._findHeaderByKey(prevActiveKey, this.m_rowHeader, rowHederStyle);
        if (this.m_utils.containsCSSClassName(prevActiveRowHeader, className))
        {
            this.m_utils.removeCSSClassName(prevActiveRowHeader, className);
        }

        prevActiveRowHeader = this._findHeaderByKey(prevActiveKey, this.m_rowEndHeader, rowEndHeaderStyle);
        if (this.m_utils.containsCSSClassName(prevActiveRowHeader, className))
        {
            this.m_utils.removeCSSClassName(prevActiveRowHeader, className);
    }
    }

    //if move enabled and draggable class name
    if (this._isMoveOnRowEnabled(activeRow))
    {
        activeRowHeader = this._findHeaderByKey(activeKey, this.m_rowHeader, rowHederStyle);
        activeRowEndHeader = this._findHeaderByKey(activeKey, this.m_rowEndHeader, rowEndHeaderStyle);
        this.m_utils.addCSSClassName(activeRow, className);
        this.m_utils.addCSSClassName(activeRowHeader, className);
        this.m_utils.addCSSClassName(activeRowEndHeader, className);
    }
};

/**
 * Handles focus on the root and its children by setting focus class on the root
 * @param {Event} event
 */
DvtDataGrid.prototype.handleRootFocus = function(event)
{
    var newCellIndex, selection;
    this.m_utils.addCSSClassName(this.m_root, this.getMappedStyle('focus'));

    // if nothing is active, and came from the outside of the datagrid, activate first cell
    if (!this.m_root.contains(document.activeElement) || (document.activeElement === this.m_root && this.m_root.tabIndex == 0)
            || (document.activeElement === this.m_databody && this.m_scrollbarFocus && this.m_root.tabIndex == 0))
    {
        this.m_externalFocus = true;
        
        if (this._isCellEditable())
        {
            this._setAccInfoText('accessibleEditableMode');                    
        }        
        else if (this._isGridEditable())
        {
            this._setAccInfoText('accessibleNavigationMode');                                
        }
        
        if (this.m_active == null && !this._databodyEmpty())
        {
            newCellIndex = this.createIndex(0, 0);

            if (this.m_scrollbarFocus == true)
            {
                this.m_shouldFocus = false;
                this.m_scrollbarFocus = false;
            }
            else
            {
                // make sure it's visible
                this.scrollToIndex(newCellIndex);
            }

            selection = this.GetSelection();
            // select or focus it
            if (this._isSelectionEnabled() && (selection == null || selection.length == 0))
            {
                this.selectAndFocus(newCellIndex, event);
            }
            else
            {
                this._setActiveByIndex(newCellIndex);
            }
        }
        else if (this.m_active != null)
        {
            this._highlightActive();
        }
    }
    this.m_root.tabIndex = -1;
};

/**
 * Handles blur on the root and its children by removing focus class on the root
 * @param {Event} event
 */
DvtDataGrid.prototype.handleRootBlur = function(event)
{
    var active;
    // There is no cross-browser way to tell if the whole grid is out of focus on blur today.
    // document.activeElement returns null in chrome and firefox on blur events.
    // relatedTarget doesn't return a value in firefox and IE though there a tickets to fix.
    // We could implement a non-timeout solution that exiting and re-entering
    // the grid via tab key would not read the summary text upon re-entry (initial would work)
    setTimeout(function(){
        if (!this.m_root.contains(document.activeElement))
        {
            this.m_root.tabIndex = 0;
            active = this._getActiveElement();
            if (active != null)
            {
                this._unsetAriaProperties(active);
            }
        }
    }.bind(this), 100);

    //don't change the color on move
    if (this.m_moveRow == null)
    {
        this.m_utils.removeCSSClassName(this.m_root, this.getMappedStyle('focus'));
    }
};

/**
 * Calculate the a row's height using top or endRowPixel
 * @param {Element|undefined|null} row the row to calculate height on
 * @return {number} the row height
 */
DvtDataGrid.prototype.calculateRowHeight = function(row)
{
    if (row['style']['height'] != '')
    {
        return this.getElementHeight(row);
    }
    if (row['nextSibling'] != null)
    {
        return this.getElementDir(row['nextSibling'], 'top') - this.getElementDir(row, 'top');
    }
    return this.m_endRowPixel - this.getElementDir(row, 'top');
};

/**
 * Calculate the a row headers's height using top or endRowHeaderPixel
 * @param {Element|undefined|null} rowHeader the rowHeader to calculate height on
 * @return {number} the rowHeader height
 */
DvtDataGrid.prototype.calculateRowHeaderHeight = function(rowHeader)
{
    if (rowHeader['style']['height'] != '')
    {
        return this.getElementHeight(rowHeader);
    }
    if (rowHeader['nextSibling'] != null)
    {
        return this.getElementDir(rowHeader['nextSibling'], 'top') - this.getElementDir(rowHeader, 'top');
    }
    return this.m_endRowHeaderPixel - this.getElementDir(rowHeader, 'top');
};

/**
 * Calculate the a column's width using left/right or endColumnPixel
 * @param {Element|undefined|null} cell the cell to calculate width on
 * @return {number} the cell width
 */
DvtDataGrid.prototype.calculateColumnWidth = function(cell)
{
    if (cell['style']['width'] != '')
    {
        return this.getElementWidth(cell);
    }
    var dir = this.getResources().isRTLMode() ? "right" : "left";
    if (cell['nextSibling'] != null)
    {
        return this.getElementDir(cell['nextSibling'], dir) - this.getElementDir(cell, dir);
    }
    return this.m_endColPixel - this.getElementDir(cell, dir);
};

/**
 * Calculate the a column headers's width using left/right or endColumnHeaderPixel
 * @param {Element|undefined|null} columnHeader the columnHeader to calculate width on
 * @return {number} the columnHeader width
 */
DvtDataGrid.prototype.calculateColumnHeaderWidth = function(columnHeader)
{
    if (columnHeader['style']['width'] != '')
    {
        return this.getElementWidth(columnHeader);
    }
    var dir = this.getResources().isRTLMode() ? "right" : "left";
    if (columnHeader['nextSibling'] != null)
    {
        return this.getElementDir(columnHeader['nextSibling'], dir) - this.getElementDir(columnHeader, dir);
    }
    return this.m_endColHeaderPixel - this.getElementDir(columnHeader, dir);
};

/**
 * @return {boolean} true if the databody is empty
 */
DvtDataGrid.prototype._databodyEmpty = function()
{
    if (this.m_databody['firstChild'] == null || this.m_databody['firstChild']['firstChild'] == null)
    {
        return true;
    }
    return false;
};

/**
 * Change or add CSS property of element
 * @param {Element} target the element to which css property will be added
 * @param {string|undefined} prop the style property name
 * @param {string|number|null} value the value of css property
 * @param {string=} action the flag variable if it is require to remove css property
 * @private
 */
DvtDataGrid.prototype.changeStyleProperty = function(target, prop, value, action)
{
    if (typeof prop != "undefined")
    {
        target.style[prop] = (action == "remove") ? "" : value;
    }
};

/**
 * Add set of required animation rules to the element
 * @param {Element} target the element to which animation rules will be added
 * @param {number|string} duration the duration of animation
 * @param {number|string} delay the delay of animation
 * @param {string} timing the easing function
 * @param {number|string} x the final position (in pixels) of the current animation
 * @param {number|string} y the final position (in pixels) of the current animation
 * @param {number|string} z the final position (in pixels) of the current animation
 * @private
 */
DvtDataGrid.prototype.addTransformMoveStyle = function(target, duration, delay, timing, x, y, z)
{
    this.changeStyleProperty(target, this.getCssSupport('transition-delay'), delay);
    this.changeStyleProperty(target, this.getCssSupport('transition-timing-function'), timing);
    this.changeStyleProperty(target, this.getCssSupport('transition-duration'), duration);
    this.changeStyleProperty(target, this.getCssSupport('transform'), 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)');
};

/**
 * Add set of required animation rules to the element
 * @param {Element} target the element to which animation rules will be added
 * @private
 */
DvtDataGrid.prototype.removeTransformMoveStyle = function(target)
{
    this.changeStyleProperty(target, this.getCssSupport('transition-delay'), null, 'remove');
    this.changeStyleProperty(target, this.getCssSupport('transition-timing-function'), null, 'remove');
    this.changeStyleProperty(target, this.getCssSupport('transition-duration'), null, 'remove');
    this.changeStyleProperty(target, this.getCssSupport('transform'), null, 'remove');
};

/**
 * Check if CSS property is supported by appropriate vendors
 * @param {string} cssprop css property
 * @return {string|undefined} css property with appropiate vendor's prefix
 * @private
 */
DvtDataGrid.prototype.getCssSupport = function(cssprop)
{
    var vendors, root, i, css3mc;

    vendors = ['', '-moz-', '-webkit-', '-o-', '-ms-', '-khtml-'];
    root = document.documentElement;

    function toCamel(str)
    {
        return str.replace(/\-([a-z])/gi, function(match, val)
        {
            // convert first letter after "-" to uppercase
            return val.toUpperCase();
        });
    }

    for (i = 0; i < vendors.length; i++)
    {
        css3mc = toCamel(vendors[i] + cssprop);
        // if property starts with 'Ms'
        if (css3mc.substr(0, 2) == 'Ms')
        {
            // Convert 'M' to lowercase
            css3mc = 'm' + css3mc.substr(1);
        }
        if (css3mc in root.style)
        {
            return css3mc;
        }
    }

    return undefined;
};

/**
 * @preserve Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Checks whether there are any focusable element inside a cell
 * @param {Element|undefined|null} elem the element to check focus inside
 * @return {boolean}
 */
DvtDataGrid.prototype._isContainFocusableElement = function(elem)
{
    var elems = this.getFocusableElementsInNode(elem);
    return (elems.length > 0);
};

/**
 * Unhighlights the selection.  Does not change selection, focus cell, anchor, or frontier
 */
DvtDataGrid.prototype.unhighlightSelection = function()
{
    var i, ranges;
    ranges = this.GetSelection();
    for (i = 0; i < ranges.length; i += 1)
    {
        this.unhighlightRange(ranges[i]);
    }
};

/**
 * Unhighlights the range.
 * @param {Object} range
 */
DvtDataGrid.prototype.unhighlightRange = function(range)
{
    var elems = this.getElementsInRange(range);
    this.unhighlightElems(elems);
};

/**
 * Highlights the range.
 * @param {Object} range
 * @param {boolean=} updateAccInfo
 */
DvtDataGrid.prototype.highlightRange = function(range, updateAccInfo)
{
    var elems, count;

    elems = this.getElementsInRange(range);
    this.highlightElems(elems);

    if (updateAccInfo)
    {
        // if there's islands of cells, then we'll have to count them
        if (this.GetSelection().length == 1)
        {
            count = elems.length;
        }
        else
        {
            count = this._getCurrentSelectionCellCount();
        }
        this._setAccInfoText('accessibleMultiCellSelected', {'num': count});
    }
};

/**
 * Calculate the total number of cells within the current selection ranges.
 * @private
 */
DvtDataGrid.prototype._getCurrentSelectionCellCount = function()
{
    var total, selection, elems, i;

    total = 0;
    selection = this.GetSelection();
    for (i = 0; i < selection.length; i++)
    {
        // count the number of elements in each selection range
        elems = this.getElementsInRange(selection[i]);
        total = total + elems.length;
    }

    return total;
};

/**
 * Unhighlight elements
 * @param {Array} elems
 */
DvtDataGrid.prototype.unhighlightElems = function(elems)
{
    var i, elem;
    if (elems == null || elems.length == 0)
    {
        return;
    }

    for (i = 0; i < elems.length; i += 1)
    {
        elem = elems[i];
        this._unhighlightElement(elem, ['selected']);
    }
};

/**
 * Highlight elements
 * @param {Array} elems
 */
DvtDataGrid.prototype.highlightElems = function(elems)
{
    var i, elem;
    if (elems == null || elems.length == 0)
    {
        return;
    }

    for (i = 0; i < elems.length; i += 1)
    {
        elem = elems[i];
        this._highlightElement(elem, ['selected']);
    }
};

/**
 * Apply current selection to a range.  This is called when a newly set of cells are
 * rendered and selection needs to be applied on them.
 * @param {number=} startRow
 * @param {number=} endRow
 * @param {number=} startCol
 * @param {number=} endCol
 */
DvtDataGrid.prototype.applySelection = function(startRow, endRow, startCol, endCol)
{
    var i, ranges, elems;
    ranges = this.GetSelection();
    for (i = 0; i < ranges.length; i += 1)
    {
        elems = this.getElementsInRange(ranges[i], startRow, endRow, startCol, endCol);
        this.highlightElems(elems);
    }
};

/**
 * Handles click and drag to select multiple cells/rows
 * @param {Event} event
 */
DvtDataGrid.prototype.handleDatabodySelectionDrag = function(event)
{
    var index, cell, target;

    if (this.m_utils.isTouchDevice())
    {
        cell = this.findCell(document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY));
    }
    else
    {
        target = /** @type {Element} */ (event.target);        
        cell = this.findCell(target);
    }

    if (cell != null)
    {
        index = {
            "row": this.getRowIndex(cell['parentNode']), "column": this.getCellIndex(cell)
        };
        this.extendSelection(index, event);
    }

};

/**
 * Checks whether a cell is selected.  This is used in touch logic in handleDatabodyClickSelection.
 * @param {Element} cell the cell element
 * @return {boolean} true if the cell is selected, false otherwise.
 * @private
 */
DvtDataGrid.prototype._isSelected = function(cell)
{
    var selectedClassName = this.getMappedStyle("selected");
    //if row selection, selection is set on the row, not the cell
    if (this.m_options.getSelectionMode() == "row" && selectedClassName != null)
    {
        return this.m_utils.containsCSSClassName(this.findRow(cell), selectedClassName);
    }
    if (selectedClassName != null)
    {
        return this.m_utils.containsCSSClassName(cell, selectedClassName);
    }

    // should not end up here
    return false;
};

/**
 * Deselect a cell/row.  This is used in touch logic in handleDatabodyClickSelection.
 * @param {Object} index the cell index of the cell/row to deselect
 * @private
 */
DvtDataGrid.prototype._deselect = function(index)
{
    var rowIndex, columnIndex, indexToRemove, ranges, i, range, startIndex, endIndex, rangeStartRow,
            rangeEndRow, rangeStartColumn, rangeEndColumn;

    if (this.m_options.getSelectionMode() == "row")
    {
        // drop the column index
        index = this.createIndex(index['row']);
    }

    rowIndex = index['row'];
    columnIndex = index['column'];

    // find the range in current selection
    indexToRemove = -1;
    ranges = this.GetSelection();
    for (i = 0; i < ranges.length; i += 1)
    {
        range = ranges[i];
        startIndex = range['startIndex'];
        endIndex = this.getEndIndex(range);

        rangeStartRow = startIndex['row'];
        rangeEndRow = endIndex['row'];

        if (rangeStartRow != rowIndex || rangeEndRow != rowIndex)
        {
            continue;
        }

        if (!isNaN(startIndex['column']) && !isNaN(endIndex['column']))
        {
            rangeStartColumn = startIndex['column'];
            rangeEndColumn = endIndex['column'];

            if (rangeStartColumn != columnIndex || rangeEndColumn != columnIndex)
            {
                continue;
            }

            // both row and column index matches, we are done
            indexToRemove = i;
            break;
        }
        else
        {
            // if column index is defined in index, skip this range
            if (!isNaN(columnIndex))
            {
                continue;
            }

            // no column index, and row matches
            indexToRemove = i;
            break;
        }
    }

    // unhighlight index and remove from selection
    if (indexToRemove != -1)
    {
        this.unhighlightRange(ranges[indexToRemove]);
        ranges.splice(indexToRemove, 1);
    }
};

/**
 * Handles click to select multiple cells/rows
 * @param {Event} event
 */
DvtDataGrid.prototype.handleDatabodyClickSelection = function(event)
{
    var index, cell, ctrlKey, shiftKey, target;
    target = /** @type {Element} */ (event.target);
    cell = this.findCell(target);
    if (cell != null)
    {
        index = {
            "row": this.getRowIndex(cell['parentNode']), "column": this.getCellIndex(cell)
        };
    }

    if (index != null && index != undefined)
    {
        if (this.isMultipleSelection() && event.button === 2 && this._isContainSelection(index))
        {
            //if right click and inside multiple selection do not change anything
            return;
        }

        ctrlKey = this.m_utils.ctrlEquivalent(event);
        shiftKey = event.shiftKey;
        if (this.isMultipleSelection())
        {
            if (this.m_utils.isTouchDevice())
            {
                //remove the touch affordance on a new tap, unhighlight the active cell, and select the new one
                this._removeTouchSelectionAffordance();
                if (this.m_active != null)
                {
                    this._unhighlightActive();
                }
                this.selectAndFocus(index, event, false);
            }
            else
            {
                if (!ctrlKey && !shiftKey)
                {
                    this.selectAndFocus(index, event, false);
                }
                else if (!ctrlKey && shiftKey)
                {
                    this.extendSelection(index, event);
                    // active cell doesn't change in this case
                }
                else
                {
                    this.selectAndFocus(index, event, true);
                }
            }
        }
        else
        {
            this.selectAndFocus(index, event, false);
        }
    }
};

/**
 * Determine if the specified cell index is inside the current selection.
 * @param {Object} index the cell index
 * @param {Array=} ranges the selection to see if the index is in, allows us to check old ranges
 * @return {boolean} true is the cell index specified is inside the selection, false otherwise
 * @private
 */
DvtDataGrid.prototype._isContainSelection = function(index, ranges)
{
    var range, startIndex, endIndex, rangeStartRow, rangeEndRow, rangeStartColumn, rangeEndColumn, i;
    if (ranges == null)
    {
        ranges = this.GetSelection();
    }
    for (i = 0; i < ranges.length; i += 1)
    {
        range = ranges[i];
        startIndex = range['startIndex'];
        endIndex = this.getEndIndex(range);

        rangeStartRow = startIndex['row'];
        rangeEndRow = endIndex['row'];

        // checks if row outside of range
        if (index['row'] < rangeStartRow || (rangeEndRow != -1 && index['row'] > rangeEndRow))
        {
            // skip
            continue;
        }

        if (!isNaN(startIndex['column']) && !isNaN(endIndex['column']))
        {
            rangeStartColumn = startIndex['column'];
            rangeEndColumn = endIndex['column'];

            // checks if row outside of range
            if (index['column'] < rangeStartColumn || (rangeEndColumn != -1 && index['column'] > rangeEndColumn))
            {
                // skip
                continue;
            }

            // within range return immediately
            return true;
        }
        else
        {
            // no column specified, meaning all columns
            return true;
        }
    }

    return false;
};

/**
 * Compare the two selection to see if they are identical.
 * @param {Object} selection1 the first selection
 * @param {Object} selection2 the seonc selection
 * @return {boolean} true if the selections are identical, false otherwise
 * @private
 */
DvtDataGrid.prototype._compareSelections = function(selection1, selection2)
{
    var i, j, foundMatch;

    // currently assumes all selections will be the same if old and new selection are equal
    // now allows not to fire on every drag event
    // todo: needs to handle discontigous selection case

    if (selection1.length !== selection2.length)
    {
        return false;
    }

    for (i = 0; i < selection1.length; i += 1)
    {
        foundMatch = false;
        for (j = 0; j < selection2.length; j += 1)
        {
            if (selection1[i]['startIndex']['row'] === selection2[j]['startIndex']['row'] &&
                    selection1[i]['startIndex']['column'] === selection2[j]['startIndex']['column'] &&
                    selection1[i]['endIndex']['row'] === selection2[j]['endIndex']['row'] &&
                    selection1[i]['endIndex']['column'] === selection2[j]['endIndex']['column'])
            {
                foundMatch = true;
            }
        }
        if (foundMatch === false)
        {
            return false;
        }
    }

    return true;
};

/**
 * Find the row element (recursively if needed)
 * @private
 * @param {Element} elem
 * @return {Element|undefined|null}
 */
DvtDataGrid.prototype.findRow = function(elem)
{
    // recursively walk up the element and find the class name that matches the row class name
    return this.find(elem, "row");
};

/**
 * Unhighlight and clear the current selection. If you are modifying the selection
 * object you should not call this method. It should only be used in the case of a
 * true clear where the selection winds up empty. This fires an event that the selection
 * has changed if it contained values beforehand.
 * @private
 * @param {Event=} event the event triggering the clear
 */
DvtDataGrid.prototype._clearSelection = function(event)
{
    var previous;

    // unhighlight previous selection
    this.unhighlightSelection();
    this._removeTouchSelectionAffordance();

    // clear the selection and fire the
    previous = this.GetSelection();
    this.m_selection = [];

    this._compareSelectionAndFire(event, previous);
};

/************************* key handler methods ************************************/
/**
 * Sets whether the data grid is in discontiguous selection mode
 * @param {boolean} flag true to set grid to discontiguous selection mode
 * @private
 */
DvtDataGrid.prototype.setDiscontiguousSelectionMode = function(flag)
{
    this.m_discontiguousSelection = flag;

    // announce to screen reader
    this._setAccInfoText(flag ? "accessibleRangeSelectModeOn" : "accessibleRangeSelectModeOff");
};

/**
 * Selects the entire row of cells
 * @param {number} rowStart the end row index
 * @param {number} rowEnd the start row index
 * @param {Event} event the dom event that triggers the selection
 * @private
 */
DvtDataGrid.prototype._selectEntireRow = function(rowStart, rowEnd, event)
{
    var startIndex, endIndex;

    // create the start and end index then selects the range
    startIndex = this.createIndex(rowStart, 0);
    endIndex = this.createIndex(rowEnd, -1);

    this._selectRange(startIndex, endIndex, event);
};

/**
 * Selects the entire column of cells
 * @param {number} columnStart the column start index
 * @param {number} columnEnd the column end index
 * @param {Event} event the dom event that triggers the selection
 * @private
 */
DvtDataGrid.prototype._selectEntireColumn = function(columnStart, columnEnd, event)
{
    var startIndex, endIndex;

    // create the start and end index then selects the range
    startIndex = this.createIndex(0, columnStart);
    endIndex = this.createIndex(-1, columnEnd);

    this._selectRange(startIndex, endIndex, event);
};

/**
 * Selects a range of cells.
 * @param {Object} startIndex the start row/column indexes
 * @param {Object} endIndex the end row/column indexes
 * @param {Event} event the dom event that triggers the selection
 * @private
 */
DvtDataGrid.prototype._selectRange = function(startIndex, endIndex, event)
{
    // no longer clear selection, if it is cleared here we can't return anything for previous selection
    this.unhighlightSelection();
    this._createRangeWithKeys(startIndex, endIndex, this._selectRangeCallback.bind(this, event));
};

/**
 * Callback for once the new range is constructed
 * @param {Event} event the dom event that triggers the selection
 * @param {Object} newRange the new range to be selected
 * @private
 */
DvtDataGrid.prototype._selectRangeCallback = function(event, newRange)
{
    var selection, previous;

    // We need to pass the option change event the previous selection.
    // We also need to overwrite the old selection instance with a new one
    // so clone the old one, update, and then replace so that the object passed
    // as the previous matches the old reference and the new selection is a new
    // reference, create a brand new selection
    previous = this.GetSelection();
    selection = [];
    selection.push(newRange);
    this.m_selection = selection;

    this.highlightRange(newRange);

    if (this._isDatabodyCellActive())
    {
        // reset frontier to be the same as active
        this.m_selectionFrontier = this.m_active['indexes'];

        this._highlightActive();
    }

    // fire selection event if the selection has changed
    this._compareSelectionAndFire(event, previous);
};

/**
 * Retrieve the current selection
 * @return {Array} an array of ranges
 * @export
 */
DvtDataGrid.prototype.GetSelection = function()
{
    if (this.m_selection == null)
    {
        this.m_selection = [];
    }
    return this.m_selection;
};

/**
 * Sets a range of selections
 * @param {Object} selection
 * @export
 */
DvtDataGrid.prototype.SetSelection = function(selection)
{
    var previous;

    // it can be null but cannot be undefined
    if (selection != undefined)
    {
        if (selection == null)
        {
            selection = [];
        }

        //if we set the selection we should ungihlight the old one
        this.unhighlightSelection();

        previous = this.GetSelection();
        this.m_selection = selection;

        // if it's not render yet, don't apply selection
        if (this.m_databody != null)
        {
            this.applySelection(this.m_startRow, this.m_endRow, this.m_startCol, this.m_endCol);
        }
        // do not fire selection event when set on us externally, it will be taken
        // care of in the wrappers option layer
    }
};

/**
 * Fires selection event
 * @param {Event|undefined} event the dom event that triggers the selection
 * @param {Object} previousSelection
 * @protected
 */
DvtDataGrid.prototype.fireSelectionEvent = function(event, previousSelection)
{
    var details = {
        'event': event, 'ui': {
            'selection': this.GetSelection(),
            'previousSelection': previousSelection
        }
    };
    this.fireEvent('select', details);
};

/**
 * Shift+click to extend the selection
 * @param {Object} index - the end index of the selection.
 * @param {Event=} event - the DOM event causing the selection to to be extended
 */
DvtDataGrid.prototype.extendSelection = function(index, event)
{
    var anchor;
    // find the the top left index
    if (this.m_utils.isTouchDevice())
    {
        anchor = this.m_touchSelectAnchor;
    }
    else
    {
        anchor = this.m_active['indexes'];
    }
    if (anchor == null)
    {
        return;
    }

    // reset focus on previous selection frontier
    this._resetSelectionFrontierFocus();

    // assign frontier before we change index;
    this.m_selectionFrontier = index;

    if (this.m_options.getSelectionMode() == "row")
    {
        // drop the column index
        index = this.createIndex(index['row']);
    }
    this._createRangeWithKeys(anchor, index, this._extendSelectionCallback.bind(this, event));
};

/**
 * Once the range is created from the index continue to extend the selection
 * @param {Event|null|undefined} event - the DOM event causing the selection to to be extended
 * @param {Object} newRange - the new range of the selection.
 * @private
 */
DvtDataGrid.prototype._extendSelectionCallback = function(event, newRange)
{
    var selection, previous, currentRange, startIndexesMatch, endIndexesMatch;

    previous = this.GetSelection();
    currentRange = previous[previous.length - 1];

    // checks if selection has changed
    startIndexesMatch = (currentRange['startIndex']['row'] == newRange['startIndex']['row']);
    if (currentRange['startIndex']['column'] != null && newRange['startIndex']['column'] != null)
    {
        startIndexesMatch = startIndexesMatch && (currentRange['startIndex']['column'] == newRange['startIndex']['column']);
    }

    endIndexesMatch = (currentRange['endIndex']['row'] == newRange['endIndex']['row']);
    if (currentRange['endIndex']['column'] != null && newRange['endIndex']['column'] != null)
    {
        endIndexesMatch = endIndexesMatch && (currentRange['endIndex']['column'] == newRange['endIndex']['column']);
    }

    if (startIndexesMatch && endIndexesMatch)
    {
        return;
    }

    // We also need to overwrite the old selection instance with a new one
    // so clone the old one, update, and then replace so that the object passed
    // as the previous matches the old reference and the new selection is a new
    // reference
    selection = previous.slice(0);
    // replace the current range
    selection.pop();
    selection.push(newRange);
    this.m_selection = selection;

    this.unhighlightRange(currentRange);
    this.highlightRange(newRange, true);

    // focus on the frontier cell
    this._makeSelectionFrontierFocus();

    this._compareSelectionAndFire(event, previous);

    // per excel, user have to hit shift+f8 again to create another discontiguous selection
    // unless is discontiguous selection mode through touch
    if (this.m_discontiguousSelection && !this.m_utils.isTouchDevice())
    {
        this.setDiscontiguousSelectionMode(false);
    }
};

/**
 * Reset focus on selection frontier
 * @private
 */
DvtDataGrid.prototype._resetSelectionFrontierFocus = function()
{
    var range, cell;

    // make sure there is a selection frontier and it's not the same as the active cell
    if (this.m_selectionFrontier == null || (this._isDatabodyCellActive() && this.m_selectionFrontier['row'] == this.m_active['indexes']['row'] && this.m_selectionFrontier['column'] == this.m_active['indexes']['column']))
    {
        return;
    }

    range = this.createRange(this.m_selectionFrontier);
    cell = this.getElementsInRange(range);

    if (cell != null && cell.length > 0)
    {
        this._unsetAriaProperties(cell[0]);
    }
};

/**
 * Make the selection frontier focusable.
 * @private
 */
DvtDataGrid.prototype._makeSelectionFrontierFocus = function()
{
    var range, rowOrCell, cell;

    // make sure there is a selection frontier and it's not the same as the active cell
    if (this.m_selectionFrontier == null || (this._isDatabodyCellActive() && this.m_selectionFrontier['row'] == this.m_active['indexes']['row'] && this.m_selectionFrontier['column'] == this.m_active['indexes']['column']))
    {
        return;
    }

    // unset focus properties on active cell first
    if (this._isDatabodyCellActive())
    {
        range = this.createRange(this.m_active['indexes']);
        cell = this.getElementsInRange(range);

        if (cell != null && cell.length > 0)
        {
            this._unsetAriaProperties(cell[0]);
        }
    }

    range = this.createRange(this.m_selectionFrontier);
    rowOrCell = this.getElementsInRange(range);
    if (rowOrCell == null || rowOrCell.length == 0)
    {
        return;
    }

    // update context info
    this._updateContextInfo(this.m_selectionFrontier);

    // focus on the cell (or first cell in the row)
    cell = this.m_utils.containsCSSClassName(rowOrCell[0], this.getMappedStyle('row')) ? rowOrCell[0]['firstChild'] : rowOrCell[0];
    this._setAriaProperties(this._createActiveObject(cell), null, cell);

};

/**
 * Selects the focus on the specified element, if ctrl+click to add cell/row to the current selection,
 * set the augment flag
 * Select and focus is an asynchronus call
 * @param {Object} index - the end index of the selection.
 * @param {Event=} event - the event causing the selection and setting active
 * @param {boolean=} augment - true if we are augmenting the selecition, default to false
 */
DvtDataGrid.prototype.selectAndFocus = function(index, event, augment)
{
    if (augment == null)
    {
        augment = false
    }

    // reset any focus properties set on frontier cell
    this._resetSelectionFrontierFocus();

    // update active cell
    // if virtual we will still want the new selection to be applied
    this._setActiveByIndex(index, event);
    
    // need the selection frontier maintained until final callback

    // update selection model
    if (this.m_options.getSelectionMode() == "row")
    {
        // drop the column index
        index = this.createIndex(index['row']);
    }
    // ensure end index is specified when push to selection
    this._createRangeWithKeys(index, index, this._selectAndFocusRangeCallback.bind(this, index, event, augment));
};

/**
 * Continue to selectAndFocus and _selectAndFocusActiveCallback
 * @param {Object} index - the end index of the selection.
 * @param {Event|undefined} event - the event causing the selection to to be changed
 * @param {boolean} augment - true if selection being augmented
 * @param {Object} range - the range of the selection.
 * @private
 */
DvtDataGrid.prototype._selectAndFocusRangeCallback = function(index, event, augment, range)
{
    var selection, previous;

    previous = this.GetSelection();
    selection = previous.slice(0);
    if (!augment)
    {
        // if we are not augmenting the selection modify the old one appropriately
        if (!this.m_discontiguousSelection)
        {
            this.unhighlightSelection();
            // this should be a new selection
            selection = [];
        }
        // this is for the Shift + F8 navigate case, we are adding to the selection on every arrow,
        // but if the user is trying to navigate away we are always popping the last selection off because
        // it was just used to navigate away, do not do this on touch because their is no navigation concept
        else if (this._isDatabodyCellActive() && this.m_prevActive != null && this.m_prevActive['type'] == 'cell' &&
                this.m_selectionFrontier['row'] == this.m_prevActive['indexes']['row'] &&
                this.m_selectionFrontier['column'] == this.m_prevActive['indexes']['column'] &&
                !this.m_utils.isTouchDevice())
        {
            // remove the last selection
            selection.pop();

            // unhighlight previous (active and selection)
            // only if it's not in an existing selection
            if (!this._isContainSelection(this.m_prevActive['indexes'], selection))
            {
                this._unhighlightElement(this._getCellByIndex(this.m_prevActive['indexes']), ['selected']);
            }
        }
    }

    this.m_selectionFrontier = index;

    // We need to overwrite the old selection instance with a new one
    // so clone the old one, update, and then replace so that the object passed
    // as the previous matches the old reference and the new selection is a new
    // reference
    selection.push(range);
    this.m_selection = selection;

    // highlight index
    this._highlightElement(this._getCellByIndex(index), ['selected']);

    this._compareSelectionAndFire(event, previous);
};

/********************* end key handler methods ************************************/

/********************* focusable/editable element related methods *****************/
/**
 * Compare the selection to a clone and fire selection event if it has changed
 * @param {Event|undefined} event the DOM event to pass off in the selection event
 * @param {Object} clone the old selection object
 * @private
 */
DvtDataGrid.prototype._compareSelectionAndFire = function(event, clone)
{
    var selection = this.GetSelection();
    //only deal with touch affordances if multiple selection on touch
    if (this.m_utils.isTouchDevice() && this.isMultipleSelection() && selection.length > 0)
    {
        this._addTouchSelectionAffordance(event);
        this._moveTouchSelectionAffordance();
    }

    // fire event if selection has changed
    if (!this._compareSelections(selection, clone))
    {
        this.fireSelectionEvent(event, clone);
    }
};

/**
 * Add the touch affordance to the grid. It will be added to the row containing the active cell in row/cell selection mode.
 * Sets the position of the affordance to be on the corner of a cell in cell selection or the center of the viewport in row
 * selection.
 * @param {Event|undefined} event the event that drives the need for touch affordance
 * @private
 */
DvtDataGrid.prototype._addTouchSelectionAffordance = function(event)
{
    //icon in the corner
    var cell, iconSize, topIcon, bottomIcon, row, selectionMode, left, dir, target;
    if (this.m_topSelectIconContainer == null && this.m_bottomSelectIconContainer == null)
    {
        dir = this.getResources().isRTLMode() ? "right" : "left";
        iconSize = this._getTouchSelectionAffordanceSize();

        //cache the containers so we always know where they are since selection object isn't always current
        //wrap the icon in a container so the touch area is larger than the icon
        this.m_topSelectIconContainer = document.createElement('div');
        this.m_topSelectIconContainer['className'] = this.getMappedStyle('toucharea');
        this.setElementDir(this.m_topSelectIconContainer, -iconSize / 2, 'top');
        topIcon = document.createElement('div');
        topIcon['className'] = this.getMappedStyle('selectaffordancetop');
        topIcon.setAttribute('role', 'button');
        topIcon.setAttribute('aria-label', this.getResources().getTranslatedText('accessibleSelectionAffordanceTop'));
        this.m_topSelectIconContainer.appendChild(topIcon); //@HTMLUpdateOK

        this.m_bottomSelectIconContainer = document.createElement('div');
        this.m_bottomSelectIconContainer['className'] = this.getMappedStyle('toucharea');
        this.setElementDir(this.m_bottomSelectIconContainer, -1 * iconSize / 2, 'bottom');
        bottomIcon = document.createElement('div');
        bottomIcon['className'] = this.getMappedStyle('selectaffordancebottom');
        bottomIcon.setAttribute('role', 'button');
        bottomIcon.setAttribute('aria-label', this.getResources().getTranslatedText('accessibleSelectionAffordanceBottom'));
        this.m_bottomSelectIconContainer.appendChild(bottomIcon); //@HTMLUpdateOK

        selectionMode = this.m_options.getSelectionMode();
        if (selectionMode === 'row')
        {
            left = (this.getElementWidth(this.m_databody) / 2) + this.m_currentScrollLeft - (iconSize / 2);
            this.setElementDir(this.m_topSelectIconContainer, left, dir);
            this.setElementDir(this.m_bottomSelectIconContainer, left, dir);
        }
        else
        {
            target = /** @type {Element} */ (event.target);
            cell = this.findCell(target);
            left = this.getElementDir(cell, dir) - (iconSize / 2);
            this.setElementDir(this.m_topSelectIconContainer, left, dir);
            this.setElementDir(this.m_bottomSelectIconContainer, left + this.calculateColumnWidth(cell), dir);
        }

        row = this.getElementsInRange(this.createRange(this.m_active['indexes']))[0]['parentNode'];
        row.appendChild(this.m_topSelectIconContainer); //@HTMLUpdateOK
        row.appendChild(this.m_bottomSelectIconContainer); //@HTMLUpdateOK
    }
};

/**
 * Finds and removes the touch selection icons from the DOM
 * @private
 */
DvtDataGrid.prototype._removeTouchSelectionAffordance = function()
{
    if (this._isDatabodyCellActive() && this.m_topSelectIconContainer && this.m_topSelectIconContainer['parentNode'])
    {
        this.m_topSelectIconContainer['parentNode'].removeChild(this.m_topSelectIconContainer);
        this.m_bottomSelectIconContainer['parentNode'].removeChild(this.m_bottomSelectIconContainer);
    }
};

/**
 * Finds and moves the touch selection affordances based on the old and new selection
 * @private
 */
DvtDataGrid.prototype._moveTouchSelectionAffordance = function()
{
    var selection, topRow, bottomRow, selectionMode, topIconCell, bottomIconCell, elementsInRange, dir;

    selection = this.GetSelection();
    if (selection.length > 0)
    {
        selectionMode = this.m_options.getSelectionMode();

        topRow = this._findRowByKey(selection[selection.length - 1]['startKey']['row']);
        bottomRow = this._findRowByKey(selection[selection.length - 1]['endKey']['row']);

        if (this.m_topSelectIconContainer != null && this.m_bottomSelectIconContainer != null)
        {
            if (selectionMode === 'row')
            {
                topRow.appendChild(this.m_topSelectIconContainer); //@HTMLUpdateOK
                bottomRow.appendChild(this.m_bottomSelectIconContainer); //@HTMLUpdateOK
            }
            else
            {
                dir = this.getResources().isRTLMode() ? "right" : "left";

                //get the cells for left/right alignment
                elementsInRange = this.getElementsInRange(selection[selection.length - 1]);
                topIconCell = elementsInRange[0];
                bottomIconCell = elementsInRange[elementsInRange.length - 1];

                topRow.appendChild(this.m_topSelectIconContainer); //@HTMLUpdateOK
                bottomRow.appendChild(this.m_bottomSelectIconContainer); //@HTMLUpdateOK

                this.setElementDir(this.m_topSelectIconContainer, this.getElementDir(topIconCell, dir) - (this._getTouchSelectionAffordanceSize() / 2), dir);
                this.setElementDir(this.m_bottomSelectIconContainer, this.getElementDir(bottomIconCell, dir) + this.calculateColumnWidth(bottomIconCell) - (this._getTouchSelectionAffordanceSize() / 2), dir);
            }
        }
    }
};

/**
 * Moves the touch selection affordances horizontally in the row to ensure they are in the viewport.
 * Only moved in row selection.
 * @private
 */
DvtDataGrid.prototype._scrollTouchSelectionAffordance = function()
{
    var selectionMode, newLeft, dir;
    selectionMode = this.m_options.getSelectionMode();
    if (selectionMode === 'row')
    {
        if (this.m_topSelectIconContainer != null)
        {
            dir = this.getResources().isRTLMode() ? "right" : "left";
            newLeft = (this.getElementWidth(this.m_databody) / 2) + this.m_currentScrollLeft;
            this.setElementDir(this.m_topSelectIconContainer, newLeft, dir);
            this.setElementDir(this.m_bottomSelectIconContainer, newLeft, dir);
        }
    }
};

/**
 * Get the touch affordance icon size
 * @return {number} the touch affordance icon size
 * @private
 */
DvtDataGrid.prototype._getTouchSelectionAffordanceSize = function()
{
    var div, divWidth;
    if (this.m_touchSelectionAffordanceSize == null)
    {
        div = document.createElement('div');
        div['className'] = this.getMappedStyle('toucharea');
        div['style']['visibilty'] = 'hidden';
        div['style']['top'] = '0px';
        div['style']['visibilty'] = '0px';
        this.m_root.appendChild(div); //@HTMLUpdateOK
        divWidth = div['offsetWidth'];
        this.m_root.removeChild(div);
        this.m_touchSelectionAffordanceSize = divWidth;
    }
    return this.m_touchSelectionAffordanceSize;
};

/**
 * @preserve Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

DvtDataGrid.SORT_ANIMATION_DURATION = 800;

/**
 * Event handler for handling mouse over event on headers.
 * @param {Event} event the DOM event
 * @private
 */
DvtDataGrid.prototype._handleSortMouseOver = function(event)
{
    var target, header;
    if (!this._databodyEmpty())
    {
        // checks if the mouse out is trigger by leaving the sort icons
        // the event can now enter the sort container
        target = /** @type {Element} */ (event.target);
        header = this.findHeader(target);
        if (header)
        {
            this._showOrHideSortIcon(header, false);
        }

        //if we are hovering the icon add hover class
        if (this.m_utils.containsCSSClassName(target, this.getMappedStyle("sortascending"))
                || this.m_utils.containsCSSClassName(target, this.getMappedStyle("sortdescending")))
        {
            this.m_utils.addCSSClassName(target, this.getMappedStyle("hover"));
        }
    }
};

/**
 * Event handler for handling mouse out event on headers.
 * @param {Event} event the DOM event
 * @private
 */
DvtDataGrid.prototype._handleSortMouseOut = function(event)
{
    var header, target, relatedTarget;
    if (!this._databodyEmpty())
    {
        target = /** @type {Element} */ (event.target);  
        relatedTarget = /** @type {Element} */ (event.relatedTarget);
        header = this.findHeader(target);
        //if there is no header or we didn't just exit the content of the header
        if (header == null || relatedTarget == null ? true : header !== this.findHeader(relatedTarget))
        {
            this._showOrHideSortIcon(header, true);
        }

        //if we are done hovering the icon remove hover class
        if (this.m_utils.containsCSSClassName(target, this.getMappedStyle("sortascending"))
                || this.m_utils.containsCSSClassName(target, this.getMappedStyle("sortdescending")))
        {
            this.m_utils.removeCSSClassName(target, this.getMappedStyle("hover"));
            this.m_utils.removeCSSClassName(target, this.getMappedStyle("selected"));
        }
    }
};

/**
 * Add the selcted color on mousedown
 * @param {Element} icon the icon to set selected on
 * @private
 */
DvtDataGrid.prototype._handleSortIconMouseDown = function(icon)
{
    if (!this._databodyEmpty())
    {
        this.m_utils.addCSSClassName(icon, this.getMappedStyle("selected"));
    }
};

/**
 * Show or hide the sort indicator icons.
 * @param {Element} header the dom element of the header to switch icon direction in
 * @param {string} direction asecnding or descending to switch to
 * @private
 */
DvtDataGrid.prototype._toggleSortIconDirection = function(header, direction)
{
    var icon;
    if (header != null)
    {
        // shows the sort indicator
        icon = this._getSortIcon(header);
        if (direction === 'descending' && this.m_utils.containsCSSClassName(icon, this.getMappedStyle("sortascending")))
        {
            this.m_utils.removeCSSClassName(icon, this.getMappedStyle("sortascending"));
            this.m_utils.addCSSClassName(icon, this.getMappedStyle("sortdescending"));
        }
        else if (direction === 'ascending' && this.m_utils.containsCSSClassName(icon, this.getMappedStyle("sortdescending")))
        {
            this.m_utils.removeCSSClassName(icon, this.getMappedStyle("sortdescending"));
            this.m_utils.addCSSClassName(icon, this.getMappedStyle("sortascending"));
        }
    }
};

/**
 * Show or hide the sort indicator icons.
 * @param {Element|undefined|null} header the dom event
 * @param {boolean} hide true if hide the icons, false to show the icons
 * @private
 */
DvtDataGrid.prototype._showOrHideSortIcon = function(header, hide)
{
    var icon, sorted = false;
    // shows the sort indicator
    if (header != null)
    {
        icon = this._getSortIcon(header);
        if (this.m_sortInfo != null)
        {
            sorted = this.m_sortInfo['key'] === this._getKey(header);
        }
        if (hide === false && !sorted)
        {
            this.m_utils.removeCSSClassName(icon, this.getMappedStyle("disabled"));
            this.m_utils.addCSSClassName(icon, this.getMappedStyle("default"));
        }
        else if (hide === true && !sorted)
        {
            this.m_utils.removeCSSClassName(icon, this.getMappedStyle("default"));
            this.m_utils.addCSSClassName(icon, this.getMappedStyle("disabled"));
        }
    }
};

/**
 * Creates the sort indicator icons and the panel around them.
 * @param {Object} headerContext a header context object, contianing key
 * @return {Element} the sort indicator icons panel
 * @private
 */
DvtDataGrid.prototype._buildSortIcon = function(headerContext)
{
    var sortIcon, iconClassString, key, direction, sortContainer;
    //sort container is used to create fade effect
    sortContainer = document.createElement("div");
    sortContainer['className'] = this.getMappedStyle("sortcontainer");

    sortIcon = document.createElement("div");
    iconClassString = this.getMappedStyle("icon") + " " + this.getMappedStyle("clickableicon");
    key = this.m_sortInfo != null ? this.m_sortInfo['key'] : null;

    //handles the case where we scroll the header which was sorted on, off screen and come back to them
    if (headerContext['key'] === key)
    {
        direction = this.m_sortInfo != null ? this.m_sortInfo['direction'] : null;
        if (direction === 'ascending')
        {
            sortIcon['className'] = this.getMappedStyle("sortascending") + " " + iconClassString + " " + this.getMappedStyle("default");
        }
        else if (direction === 'descending')
        {
            sortIcon['className'] = this.getMappedStyle("sortdescending") + " " + iconClassString + " " + this.getMappedStyle("default");
        }
    }
    else
    {
        iconClassString += " " + this.getMappedStyle("disabled");
        sortIcon['className'] = this.getMappedStyle("sortascending") + " " + iconClassString;
    }
    sortContainer.appendChild(sortIcon); //@HTMLUpdateOK
    return sortContainer;
};

/**
 * Handles sorting using keyboard (enter key while focus on header).  See HandleHeaderKeyDown.
 * @param {Element} header header being sorted on
 * @param {Event} event DOM keyboard event triggering sort
 * @private
 */
DvtDataGrid.prototype._handleKeyboardSort = function(header, event)
{
    if (!this._databodyEmpty())
    {
        var direction = header.getAttribute(this.getResources().getMappedAttribute('sortDir'));
        if (direction == null || direction === "descending")
        {
            direction = "ascending";
        }
        else
        {
            direction = "descending";
        }

        this._doHeaderSort(event, header, direction);
    }
};

/**
 * Handles click on the header, this would perform the sort operation.
 * @param {Event} event the DOM event
 * @param {string=} direction asecnding or descending to sort on
 * @private
 */
DvtDataGrid.prototype._handleHeaderSort = function(event, direction)
{
    var target, header;
    if (!this._databodyEmpty())
    {
        target = /** @type {Element} */ (event.target);  

        header = this.findHeader(target);
        if (header != null)
        {
            // use the class name to determine if it's asecnding or descending
            if (direction == null)
            {
                if (this.m_sortInfo != null && this.m_sortInfo['key'] === this._getKey(header))
                {
                    if (this.m_sortInfo['direction'] === 'ascending')
                    {
                        direction = 'descending';
                    }
                    else
                    {
                        direction = 'ascending';
                    }
                }
                else
                {
                    //we should get here on inital touch sort only
                    direction = 'ascending';
                }
            }
            this._doHeaderSort(event, header, direction);
        }
    }
};

/**
 * Handles click on the header, this would perform the sort operation.
 * @param {Event} event the DOM event
 * @param {string} direction asecnding or descending to switch to
 * @param {Element|undefined} header the header to sort on
 * @private
 */
DvtDataGrid.prototype._handleCellSort = function(event, direction, header)
{
    var target;
    target = /** @type {Element} */ (event.target);  
    if (header != null && !this._databodyEmpty())
    {
        this._doHeaderSort(event, header, direction);
    }
};

/**
 * Handles click on the header, this would perform the sort operation.
 * @param {Event} event the DOM event
 * @param {Element} header the header element
 * @param {string} direction the sort direction
 * @private
 */
DvtDataGrid.prototype._doHeaderSort = function(event, header, direction)
{
    var key, axis, criteria;
    if (this.m_isSorting != true)
    {
        this.m_delayedSort = null;

        // get the key and axis
        key = this._getKey(header);
        axis = this._getAxis(header);

        this._removeSortSelection();

        // needed for toggle and screenreader
        header.setAttribute(this.getResources().getMappedAttribute('sortDir'), direction);
        this.m_sortInfo = {'event': event, 'key': key, 'axis': axis, 'direction': direction};

        //flip the icon direction
        this._toggleSortIconDirection(header, direction);
        this._addSortSelection();

        // creates the criteria object and invoke sort on the data source
        if (direction != null && key != null && axis != null)
        {
            this.m_isSorting = true;
            // show status message
            this.showStatusText();

            // invoke sort
            criteria = {"axis": axis, "key": key, "direction": direction};
            this.getDataSource().sort(criteria, {"success": this._handleSortSuccess.bind(this), "error": this._handleSortError.bind(this)});
        }

        // update screen reader alert
        this._setAccInfoText(direction === 'ascending' ? 'accessibleSortAscending' : 'accessibleSortDescending', {'id': key});
    }
    else
    {
        this.m_delayedSort = {'event': event, 'header': header, 'direction': direction};
    }
};

/**
 * Callback method invoked when the sort operation failed.
 * @private
 */
DvtDataGrid.prototype._handleSortError = function()
{
    this.hideStatusText();
};

/**
 * Remove the selected style class from the previous sorted sort icon, and add disabled back to it
 * @private
 */
DvtDataGrid.prototype._removeSortSelection = function()
{
    var oldSortedHeader, oldsortIcon;
    if (this.m_sortInfo != null)
    {
        //get the header that was sorted on and the icon within it based on the values stored in this.m_sortInfo
        oldSortedHeader = this._findHeaderByKey(this.m_sortInfo['key'], this.m_colHeader, this.getMappedStyle('colheadercell'));
        oldSortedHeader.removeAttribute(this.getResources().getMappedAttribute('sortDir'));
        oldsortIcon = this._getSortIcon(oldSortedHeader);
        //flip icon back to ascending
        this._toggleSortIconDirection(oldSortedHeader, 'ascending');
        if (this.m_sortInfo['direction'] === 'descending')
        {
            //switch back to the default ascending icon
            this.m_utils.removeCSSClassName(oldsortIcon, this.getMappedStyle("sortdescending"));
            this.m_utils.addCSSClassName(oldsortIcon, this.getMappedStyle("sortascending"));
        }
        //disable the icon to hide it, remove the selected style
        this.m_utils.addCSSClassName(oldsortIcon, this.getMappedStyle('disabled'));
        this.m_utils.removeCSSClassName(oldsortIcon, this.getMappedStyle('default'));
        this.m_utils.removeCSSClassName(this._getSortContainer(oldSortedHeader), this.getMappedStyle('enabled'));
    }
};

/**
 * Add the selected style class to the newly sorted sort icon and remove disabled from it
 * @private
 */
DvtDataGrid.prototype._addSortSelection = function()
{
    var sortedHeader, sortIcon;
    if (this.m_sortInfo != null)
    {
        //get the header that is sorted on and the icon within it based on the values stored in this.m_sortInfo
        sortedHeader = this._findHeaderByKey(this.m_sortInfo['key'], this.m_colHeader, this.getMappedStyle('colheadercell'));
        sortIcon = this._getSortIcon(sortedHeader);

        //select the icon to show it, remove the disabled style
        this.m_utils.addCSSClassName(sortIcon, this.getMappedStyle('default'));
        this.m_utils.removeCSSClassName(sortIcon, this.getMappedStyle('disabled'));
        this.m_utils.removeCSSClassName(sortIcon, this.getMappedStyle('selected'));
        this.m_utils.addCSSClassName(this._getSortContainer(sortedHeader), this.getMappedStyle('enabled'));
    }
};

/**
 * Determine the axis of the header.
 * @param {Element} header the header to determine the axis, returns either "row" or "column".
 * @return {string|null} the axis of the header
 * @private
 */
DvtDataGrid.prototype._getAxis = function(header)
{
    var columnHeaderCellClassName, rowHeaderCellClassName;

    columnHeaderCellClassName = this.getMappedStyle("colheadercell");
    rowHeaderCellClassName = this.getMappedStyle("rowheadercell");

    if (this.m_utils.containsCSSClassName(header, columnHeaderCellClassName))
    {
        return "column";
    }

    if (this.m_utils.containsCSSClassName(header, rowHeaderCellClassName))
    {
        return "row";
    }

    return null;
};

/**
 * Callback method invoked when the sort operation completed successfully.
 * @private
 */
DvtDataGrid.prototype._handleSortSuccess = function()
{
    // hide the message
    this.hideStatusText();

    // sort is completed successfully, now fetch the sorted data
    if (this._isDatabodyCellActive())
    {
        // scroll position should go to the new active cell location if virtual
        this._indexes({'row': this.m_active['keys']['row'], 'column': this.m_active['keys']['column']}, this._handlePreSortScrolling);
    }
    else
    {
        // scroll position should remain unchanged if high watermark or virtual without an active cell
        this._fetchForSort(this.m_startRow, this.m_endRow - this.m_startRow + 1, false);
    }
};

/**
 * Handle scrolling of the datagrid before fetching the data
 * @param {Object} indexes index of the new location of the active cell
 */
DvtDataGrid.prototype._handlePreSortScrolling = function(indexes)
{
    var rowIndex, startRow, cellTop, cellBottom, startRowPixel, isInRenderedRange, isHighWatermark, isInVisibleRange;
    rowIndex = indexes['row'] === -1 ? 0 : indexes['row'];
    cellTop = rowIndex * this.m_avgRowHeight;
    cellBottom = cellTop + this.m_avgRowHeight

    isHighWatermark = this._isHighWatermarkScrolling();
    isInRenderedRange = this._isInViewport(indexes) != -1;
    isInVisibleRange = this.m_currentScrollTop <= cellTop && cellBottom <= this.m_currentScrollTop + this.getElementHeight(this.m_databody);

    // cell is in rendered range and visible, or high watermark regardless of visibilty,
    // do a refetch of the current viewport and no scrolling
    if (isInVisibleRange || (isHighWatermark)) //&& !isInRenderedRange))
    {
        this._fetchForSort(this.m_startRow, this.m_endRow - this.m_startRow + 1, false);
    }

    // we have deceided not to prescroll on high watermark because the active cell
    // was hard to follow through the animation, if we wanted that behavior in the
    // future simlpy follow the format commented out below and above
    // cell is in rendered range but not visible on high watermak,
    // do a scroll to the new position with a refresh of the whole viewport
    //else if (isHighWatermark && isInRenderedRange)
    //{
    //    // set a new scrollTop to the top of that cell or the closest it can be
    //    this.m_currentScrollTop = Math.min(cellTop, this.m_scrollHeight);
    //    this._fetchForSort(this.m_startRow, this.m_endRow - this.m_startRow + 1, true);
    //}
    //
    // in virtual scrolling and not outside of the visible range scroll to the new location and refresh
    else
    {
        // get the scroll top that it will need to be
        this.m_currentScrollTop = Math.min(cellTop, this._getMaxScrollHeight());

        //find the start row we need to fetch at that scroll position
        startRow = Math.floor(this.m_currentScrollTop / this.m_avgRowHeight);

        startRowPixel = startRow * this.m_avgRowHeight;
        // reset ranges on rows
        this.m_startRow = startRow;
        this.m_endRow = -1;
        this.m_startRowHeader = startRow;
        this.m_endRowHeader = -1;
        this.m_startRowPixel = startRowPixel;
        this.m_endRowPixel = startRowPixel;
        this.m_startRowHeaderPixel = startRowPixel;
        this.m_endRowHeaderPixel = startRowPixel;

        this._fetchForSort(startRow, null, true);
    }
};

/**
 * A method to fetch data with the correct sort callbacks
 * @param {number} startRow
 * @param {number|null} rowCount
 * @param {boolean} scroll true if we need to pre scroll the datagrid
 */
DvtDataGrid.prototype._fetchForSort = function(startRow, rowCount, scroll)
{
    var rowHeaderFragment = document.createDocumentFragment();
    var endRowHeaderFragment = document.createDocumentFragment();
    this.fetchHeaders("row", startRow, rowHeaderFragment, endRowHeaderFragment, rowCount, {"success": this.handleHeadersFetchSuccessForSort.bind(this), "error": this.handleCellsFetchError});
    this.fetchCells(this.m_databody, startRow, this.m_startCol, rowCount, this.m_endCol - this.m_startCol + 1, {"success": this.handleCellsFetchSuccessForSort.bind(this, rowHeaderFragment, endRowHeaderFragment, scroll), "error": this.handleCellsFetchError});
};

/**
 * Handle a successful call to the data source fetchHeaders for sorting. Used to populate the new headers fragment.
 * @param {Object} headerSet - an array of headers returned from the dataSource
 * @param {Object} headerRange - {"axis":,"start":,"count":,"header":}
 * @param {boolean} rowInsert - if this is triggered by a row insert event
 * @protected
 */
DvtDataGrid.prototype.handleHeadersFetchSuccessForSort = function(headerSet, headerRange, endHeaderSet, rowInsert)
{
    var axis, headerFragment, start, headerCount, c, index, totalRowHeight, returnVal, className, renderer, endHeaderFragment;
    axis = headerRange["axis"];
    start = headerRange["start"];
    headerFragment = headerRange["header"];
    endHeaderFragment = headerRange["endHeader"];

    // remove fetching message
    this.m_fetching[axis] = false;
    
    if (headerSet != null)
    {
        // add the headers to the row header
        headerCount = headerSet.getCount();
        totalRowHeight = 0;
        c = 0;
        className = this.getMappedStyle("row") + " " + this.getMappedStyle("headercell") + " " + this.getMappedStyle("rowheadercell");
        renderer = this.m_options.getRenderer("row");
        while (headerCount - c > 0)
        {
            index = start + c;
            returnVal = this.buildLevelHeaders(headerFragment, index, 0, 0, this.m_startRowPixel + totalRowHeight, true, rowInsert, renderer, headerSet, 'row', className, this.m_rowHeaderLevelCount);
            c += returnVal.count;
            totalRowHeight += returnVal.totalHeaderDimension;
        }
        this.m_endRowHeader = this.m_startRowHeader + headerCount - 1;
        this.m_endRowHeaderPixel = this.m_startRowHeaderPixel + totalRowHeight;
    }

    if (endHeaderSet != null)
    {
        headerCount = endHeaderSet.getCount();
        totalRowHeight = 0;
        c = 0;
        className = this.getMappedStyle("row") + " " + this.getMappedStyle("endheadercell") + " " + this.getMappedStyle("rowendheadercell");
        renderer = this.m_options.getRenderer("rowEnd");
        while (headerCount - c > 0)
        {
            index = start + c;
            returnVal = this.buildLevelHeaders(endHeaderFragment, index, 0, 0, this.m_startRowPixel + totalRowHeight, true, rowInsert, renderer, endHeaderSet, 'rowEnd', className, this.m_rowEndHeaderLevelCount);
            c += returnVal.count;
            totalRowHeight += returnVal.totalHeaderDimension;
        }
        this.m_endRowEndHeader = this.m_startRowEndHeader + headerCount - 1;
        this.m_endRowEndHeaderPixel = this.m_startRowEndHeaderPixel + totalRowHeight;
    }
    
    // end fetch
    this._signalTaskEnd();
};

/**
 * Handle a successful call to the data source fetchCells after sort.
 * @param {DocumentFragment|Element} newRowHeaderElements a document fragment containing the row headers and the fragment
 * @param {boolean|null} scroll true if we need to pre scroll
 * @param {Object} cellSet a CellSet object which encapsulates the result set of cells
 * @param {Array.<Object>} cellRange [rowRange, columnRange] - [{"axis":,"start":,"count":},{"axis":,"start":,"count":,"databody":,"scroller":}]
 */
DvtDataGrid.prototype.handleCellsFetchSuccessForSort = function(newRowHeaderElements, newRowEndHeaderElements, scroll, cellSet, cellRange)
{
    var rowRange, rowStart, rowCount, columnRange, columnStart, columnCount, newRowElements, oldRowElements,
            oldRowHeaderElements, oldRowEndHeaderElements, duration, returnVal, animate;

    this.m_fetching['cells'] = false;

    duration = DvtDataGrid.SORT_ANIMATION_DURATION;

    // size the grid if fetch is done
    if (this.isFetchComplete())
    {
        this.hideStatusText();
    }

    // obtain params for _addRows
    rowRange = cellRange[0];
    rowStart = rowRange['start'];
    rowCount = cellSet.getCount("row");

    columnRange = cellRange[1];
    columnStart = columnRange['start'];
    columnCount = cellSet.getCount("column");

    // the rows AFTER sort should be inside the newRowElements fragment
    newRowElements = document.createDocumentFragment();

    returnVal = this._addRows(newRowElements, true, this.m_startRowPixel, rowStart, rowCount, columnStart, false, cellSet);
    this.m_endRow = this.m_startRowHeader + rowCount - 1;
    this.m_endRowPixel = this.m_startRowPixel + returnVal['totalRowHeight'];

    oldRowElements = this.m_databody['firstChild'];
    oldRowHeaderElements = this.m_rowHeader['firstChild'];
    oldRowEndHeaderElements = this.m_rowEndHeader['firstChild'];

    if (scroll == true)
    {
        // disable animation on virtual scrolling
        animate = this._isHighWatermarkScrolling();

        // scroll the databody
        if (!this.m_utils.isTouchDevice())
        {
            this.m_silentScroll = true;
            this.m_databody['scrollTop'] = this.m_currentScrollTop;
            this._syncScroller();
        }
        else
        {
            // for touch we'll call scrollTo directly instead of relying on scroll event to fire due to performance
            this._disableTouchScrollAnimation();
            this.scrollTo(this.m_currentScrollLeft, this.m_currentScrollTop);
        }
    }

    // if there's only one row we don't need to animate
    // don't animate on multi-level headers
    if (!duration || duration == 0 || !this.m_utils.supportsTransitions() || rowCount === 1 ||
            (this.m_rowHeaderLevelCount > 1 && this.m_rowHeaderLevelCount != null) || animate === false)
    {
        // start task since both animation/non use handle sort end
        this._signalTaskStart();
        this._handleSortEnd(newRowElements, newRowHeaderElements, newRowEndHeaderElements);
    }
    else
    {
        this.processSortAnimationToPosition(duration, 0, "ease-in", oldRowHeaderElements, newRowHeaderElements, oldRowElements, newRowElements, oldRowEndHeaderElements, newRowEndHeaderElements);
    }

    // end fetch
    this._signalTaskEnd();
};

/**
 * Handles a sort complete by replacing the dom with the new headers and cells,
 * restoring active and firing a sort event
 * @param {DocumentFragment} newRowElements
 * @param {DocumentFragment|Element} newRowHeaderElements
 */
DvtDataGrid.prototype._handleSortEnd = function(newRowElements, newRowHeaderElements, newRowEndHeaderElements)
{
    var headerContent, databodyContent;
    if (newRowHeaderElements.childNodes.length > 1)
    {
        headerContent = this.m_rowHeader['firstChild'];
        this.m_utils.empty(headerContent);
        headerContent.appendChild(newRowHeaderElements); //@HTMLUpdateOK
    }

    if (newRowEndHeaderElements.childNodes.length > 1)
    {
        headerContent = this.m_rowEndHeader['firstChild'];
        this.m_utils.empty(headerContent);
        headerContent.appendChild(newRowEndHeaderElements); //@HTMLUpdateOK
    }
    
    databodyContent = this.m_databody['firstChild'];
    this.m_utils.empty(databodyContent);
    databodyContent.appendChild(newRowElements); //@HTMLDUpdateOK

    // restore active cell
    this._restoreActive();
    this.m_isSorting = false;
    this._fireSortEvent();
    this._doDelayedSort();

    // end animation/sort
    this.m_animating = false;
    this._signalTaskEnd();

    // check event queue for outstanding model events
    this._runModelEventQueue();
};

/**
 * The main method for animation of the DataGrid rows from before-sort to the after-sort potitions
 * @param {number} duration the duration of animation
 * @param {number} delay_offset the initial delay of animation
 * @param {string} timing the easing function
 * @param {Element} oldRowHeaderElements the DOM structure on which the animation will be performed. Initially contains DOM elements in before sorting order
 * @param {DocumentFragment|Element} newRowHeaderElements the element that contains set of sub-elements in "after-sorting" order
 * @param {Object} oldElementSet the DOM structure on which the animation will be performed. Initially contains DOM elements in before sorting order
 * @param {DocumentFragment} newElementSet the element that contains set of sub-elements in "after-sorting" order
 * @private
 */
DvtDataGrid.prototype.processSortAnimationToPosition = function(duration, delay_offset, timing, oldRowHeaderElements, newRowHeaderElements, oldElementSet, newElementSet, oldRowEndHeaderElements, newRowEndHeaderElements)
{
    var self, rowKey, animationInformation, oldTop, newTop, rowsForAppend, rowHeadersForAppend, i, child,
            rowHeaderSupport, oldBottom, newBottom, newElementSetClone, newRowHeaderElementsClone,
            viewportTop, viewportBottom, lastAnimationElement, rowEndHeaderSupport, newRowEndHeaderElementsClone,
            rowEndHeadersForAppend;

    // initialize variables
    self = this;
    // animation start
    this._signalTaskStart();
    rowsForAppend = [];
    rowHeadersForAppend = [];
    rowEndHeadersForAppend = [];
    rowHeaderSupport = newRowHeaderElements.childNodes.length > 1 ? true : false;
    rowEndHeaderSupport = newRowEndHeaderElements.childNodes.length > 1 ? true : false;
    viewportTop = this._getViewportTop();
    viewportBottom = this._getViewportBottom();

    // clone the rows/headers
    newElementSetClone = newElementSet.cloneNode(true);
    newRowHeaderElementsClone = newRowHeaderElements ? newRowHeaderElements.cloneNode(true) : null;
    newRowEndHeaderElementsClone = newRowEndHeaderElements ? newRowEndHeaderElements.cloneNode(true) : null;

    //animation information will be an object of objects as follows {key:{oldTop:val, newTop:val}}
    animationInformation = {};

    // loop over the old elements and set their old and new tops
    for (i = 0; i < oldElementSet.childNodes.length; i++)
    {
        child = oldElementSet.childNodes[i];
        rowKey = this._getKey(child);
        oldTop = this.getElementDir(child, 'top');
        oldBottom = oldTop + this.getElementHeight(child);
        // if the row is not visible at all, it will not need to move
        if (oldBottom < viewportTop || oldTop > viewportBottom)
        {
            newTop = oldTop;
        }
        // if the row is visible at all, set the newTop to be off screen for now
        else
        {
            newTop = viewportBottom;
        }
        animationInformation[rowKey] = {oldTop: oldTop, newTop: newTop};
    }

    // loop over the new elements and set their old and new tops
    for (i = 0; i < newElementSet.childNodes.length; i++)
    {
        child = newElementSet.childNodes[i];
        rowKey = this._getKey(child);
        newTop = this.getElementDir(child, 'top');

        //the new keys aren't cloned so make sure they clone
        this._setKey(newElementSetClone.childNodes[i], rowKey);
        this._setKey(newRowHeaderElementsClone.childNodes[i], rowKey);
        this._setKey(newRowEndHeaderElementsClone.childNodes[i], rowKey);

        // if in the old elements, just replace its newTop value
        if (animationInformation.hasOwnProperty(rowKey))
        {
            animationInformation[rowKey].newTop = newTop;
        }
        // if not in the old elements, create an entry for it with oldTop just outside of view
        else
        {
            oldTop = viewportBottom;
            newBottom = newTop + this.getElementHeight(child);
            animationInformation[rowKey] = {oldTop: oldTop, newTop: newTop};

            // if new element will be in view at all, we will need to add it to the live DOM
            // for animation, and set the top to the bottom of the viewport
            if (newBottom >= viewportTop && newTop < viewportBottom)
            {
                child = newElementSetClone.childNodes[i];
                this.setElementDir(child, animationInformation[rowKey].oldTop, 'top');
                rowsForAppend.push(child);
                if (rowHeaderSupport)
                {
                    child = newRowHeaderElementsClone.childNodes[i ];
                    this.setElementDir(child, animationInformation[rowKey].oldTop, 'top');
                    rowHeadersForAppend.push(child);
                }
                if (rowEndHeaderSupport)
                {
                    child = newRowEndHeaderElementsClone.childNodes[i ];
                    this.setElementDir(child, animationInformation[rowKey].oldTop, 'top');
                    rowEndHeadersForAppend.push(child);
                }                
            }
        }
    }

    // append the old elements now, couldn't do it before because as we append we
    // lose proper indexing in the clone set
    for (i = 0; i < rowsForAppend.length; i++)
    {
        oldElementSet.appendChild(rowsForAppend[i]); //@HTMLUpdateOK
        if (rowHeaderSupport)
        {
            oldRowHeaderElements.appendChild(rowHeadersForAppend[i]); //@HTMLUpdateOK
        }
        if (rowEndHeaderSupport)
        {
            oldRowEndHeaderElements.appendChild(rowEndHeadersForAppend[i]); //@HTMLUpdateOK
        }        
    }

    // find out which element is the last to actually animate
    for (i = oldElementSet.childNodes.length - 1; i >= 0; i--)
    {
        child = oldElementSet.childNodes[i];
        rowKey = this._getKey(child);
        if (animationInformation[rowKey].newTop - animationInformation[rowKey].oldTop != 0)
        {
            lastAnimationElement = child;
            break;
        }
    }

    // if nothing is animated which could happen, we can just bail and not animate
    if (lastAnimationElement != null)
    {
        //register transitionend listener on the last row transitioning before applying the transition
        lastAnimationElement.addEventListener('transitionend', this._handleSortEnd.bind(this, newElementSet, newRowHeaderElements, newRowEndHeaderElements), false);

        this.m_animating = true;

        setTimeout(function()
        {
            var deltaY, delay, animationInfo, i;
            //main animation loop
            for (i = 0; i < oldElementSet.childNodes.length; i++)
            {
                delay = delay_offset * i + "ms";
                child = oldElementSet.childNodes[i];
                //animate rows added to the old set from the new one to its original positions
                animationInfo = animationInformation[self._getKey(child)];
                deltaY = animationInfo.newTop - animationInfo.oldTop;
                //only animate if there is a change in position
                if (deltaY != 0)
                {
                    self.addTransformMoveStyle(child, duration / 2 + "ms", delay, timing, 0, deltaY, 0);
                    if (rowHeaderSupport)
                    {
                        self.addTransformMoveStyle(oldRowHeaderElements.childNodes[i], duration / 2 + "ms", delay, timing, 0, deltaY, 0);
                    }
                    if (rowEndHeaderSupport)
                    {
                        self.addTransformMoveStyle(oldRowEndHeaderElements.childNodes[i], duration / 2 + "ms", delay, timing, 0, deltaY, 0);
                    }                    
                }
            }
        }, 0);
    }
    else
    {
        this._handleSortEnd(newElementSet, newRowHeaderElements, newRowEndHeaderElements);
    }
};

/**
 * Restore the active cell after sort.
 * @private
 */
DvtDataGrid.prototype._restoreActive = function()
{
    var row, columnHeader, cellIndex, axis, root, className;
    if (this.m_active != null)
    {
        axis = this.m_active['axis'];        
        if (this.m_active['type'] == 'cell')
        {
            row = this._findRowByKey(this.m_active['keys']['row']);
            columnHeader = this._findHeaderByKey(this.m_active['keys']['column'], this.m_colHeader, this.getMappedStyle('colheadercell'));
            if (row != null && columnHeader != null)
            {
                cellIndex = this.createIndex(this.getRowIndex(row), this.getHeaderCellIndex(columnHeader));

                // make sure it's visible
                this.scrollToIndex(cellIndex);

                // select it if selection enabled
                if (this._isSelectionEnabled())
                {
                    // this will clear the selection if there's multiple selection before sort
                    // this is the behavior we want since the ranges in the previous selection
                    // will in most cases be invalid after sort.  The only one we can maintain and
                    // make sense to do is the active cell
                    this.selectAndFocus(cellIndex);
                }
                else
                {
                    // make it active
                    this._setActiveByIndex(cellIndex);
                }
            }
            else
            {
                this._setActive(null, null, true);
                // clear selection it if selection enabled
                if (this._isSelectionEnabled())
                {
                    this._clearSelection(this.m_sortInfo['event']);
                }
            }
        }
        else if (axis == 'row' || axis == 'rowEnd')
        {
            root = axis == 'row' ? this.m_rowHeader : this.m_rowEndHeader;
            className = axis == 'row' ?  this.getMappedStyle('rowheadercell') : this.getMappedStyle('rowendheadercell');
            row = this._findHeaderByKey(this.m_active['key'], root, className);
            if (row != null)
            {
                // make it active
                this._setActive(row);
            }
            else
            {
                this._setActive(null);
            }
        }
    }
};

/**
 * Get the default sort icon size
 * @return {number} the default sort icon size
 */
DvtDataGrid.prototype.getSortIconSize = function()
{
    var div, divWidth;
    if (this.m_sortIconSize == null)
    {
        div = document.createElement('div');
        div['className'] = this.getMappedStyle("sortascending") + " " + this.getMappedStyle("icon") + " " + this.getMappedStyle("clickableicon");
        div['style']['visibilty'] = 'hidden';
        div['style']['top'] = '0px';
        div['style']['visibilty'] = '0px';
        this.m_root.appendChild(div); //@HTMLUpdateOK
        divWidth = div['offsetWidth'];
        this.m_root.removeChild(div);
        this.m_sortIconSize = divWidth;
    }
    return this.m_sortIconSize;
};

/**
 * Gets the sort icon froma  header Element
 * @param {Element} header the header to get sort icon for
 * @private
 */
DvtDataGrid.prototype._getSortIcon = function(header)
{
    //presently guaranteed to be the first child of the last child of the parent
    return header['lastChild']['firstChild'];
};

/**
 * Gets the sort container froma  header Element
 * @param {Element} header the header to get sort container for
 * @private
 */
DvtDataGrid.prototype._getSortContainer = function(header)
{
    //presently guaranteed to be thethe last child of the parent
    return header['lastChild'];
};

/**
 * Fire Sort event
 * @private
 */
DvtDataGrid.prototype._fireSortEvent = function()
{
    var details = {
        'event': this.m_sortInfo['event'], 'ui': {
            'header': this.m_sortInfo['key'],
            'direction': this.m_sortInfo['direction']
        }
    };
    this.fireEvent("sort", details);
};

/**
 * Start a delayed sort
 * @private
 */
DvtDataGrid.prototype._doDelayedSort = function()
{
    if (this.m_delayedSort != null)
    {
        this._doHeaderSort(this.m_delayedSort['event'], this.m_delayedSort['header'], this.m_delayedSort['direction']);
    }
    else
    {
        // no pending sort so cleanup
        this.fillViewport();
    }
};
/**
 * @preserve Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
DvtDataGrid.RESIZE_OFFSET = 5;
DvtDataGrid.RESIZE_TOUCH_OFFSET = 8;

/**
 * Handles what to do when the mouse moves. Sets the cursor based on .manageHeaderCursor(),
 * If this.m_isResizing is set to true, treats movement as resizing, calling .handleResizeMouseMove()
 * @param {Event} event - a mousemove event
 */
DvtDataGrid.prototype.handleResize = function(event)
{
    var header;
    //if not resizing, monitor the cursor position, otherwise handle resizing
    if (this.m_isResizing === false)
    {
        header = this.find(event['target'], 'header');
        if (header == null)
        {
            header = this.find(event['target'], 'endheader');
        }
        //only if we are inside our grid's headers, multiple grid case
        if (header != null && (header == this.m_rowHeader || header == this.m_colHeader || header == this.m_rowEndHeader || header == this.m_colEndHeader))
        {
            this.m_cursor = this.manageHeaderCursor(event);
            if (this.m_resizingElement != null)
            {
                if (this.m_cursor == 'default')
                {
                    this.m_resizingElement['style']['cursor'] = '';
                    if (this.m_resizingElementSibling != null)
                    {
                        this.m_resizingElementSibling['style']['cursor'] = '';
                    }
                }
                else
                {
                    this.m_resizingElement['style']['cursor'] = this.m_cursor;
                    if (this.m_resizingElementSibling != null)
                    {
                        this.m_resizingElementSibling['style']['cursor'] = this.m_cursor;
                    }
                }
            }
        }
    }
    else
    {
        this.handleResizeMouseMove(event);
    }
};

/**
 * On mousedown, if the cursor was set to row/col -resize, set the required resize values.
 * @param {Event} event - a mousedown event
 * @return {boolean} true if event processed
 */
DvtDataGrid.prototype.handleResizeMouseDown = function(event)
{
    if (this.m_cursor === 'col-resize' || this.m_cursor === 'row-resize')
    {
        this.m_isResizing = true;
        if (this.m_utils.isTouchDevice())
        {
            this.m_lastMouseX = event.touches[0]['pageX'];
            this.m_lastMouseY = event.touches[0]['pageY'];
        }
        else
        {
            document.addEventListener("mousemove", this.m_docMouseMoveListener, false);
            document.addEventListener("mouseup", this.m_docMouseUpListener, false);
            this.m_lastMouseX = event['pageX'];
            this.m_lastMouseY = event['pageY'];
        }

        this.m_overResizeLeft = 0;
        this.m_overResizeMinLeft = 0;
        this.m_overResizeTop = 0;
        this.m_overResizeMinTop = 0;
        this.m_overResizeRight = 0;
        this.m_overResizeBottom = 0;
        
        this.m_orginalResizeDimensions = {
            'width': this.getElementWidth(this.m_resizingElement),
            'height': this.getElementHeight(this.m_resizingElement)                            
        };
        
        return true;
    }
    return false;
};

/**
 * On mouseup, if we were resizing, handle cursor and callback firing.
 * @param {Event} event - a mouseup event
 */
DvtDataGrid.prototype.handleResizeMouseUp = function(event)
{
    var size, details, newHeight, newWidth;
    if (this.m_isResizing === true)
    {
        newWidth = this.getElementWidth(this.m_resizingElement);     
        newHeight = this.getElementHeight(this.m_resizingElement);        
        if (newWidth != this.m_orginalResizeDimensions['width'] || newHeight != this.m_orginalResizeDimensions['height'])
        {
            //set the information we want to callback with in the resize event and callback
            size = (this.m_cursor === 'col-resize') ? this.m_resizingElement['style']['width'] : this.m_resizingElement['style']['height'];
            details = {
                'event': event, 
                'ui': {
                    'header': this._getKey(this.m_resizingElement), 
                    'oldDimensions' : {
                        'width': this.m_orginalResizeDimensions['width'],
                        'height': this.m_orginalResizeDimensions['height']
                    },
                    'newDimensions' : {
                        'width': this.getElementWidth(this.m_resizingElement),
                        'height': this.getElementHeight(this.m_resizingElement)       
                    },
                    // deprecating this part in 2.1.0
                    'size': size
                }
            };
            this.fireEvent('resize', details);
        }
        //no longer resizing
        this.m_isResizing = false;
        this.m_cursor = 'default';
        this.m_resizingElement['style']['cursor'] = '';
        if (this.m_resizingElementSibling != null)
        {
            this.m_resizingElementSibling['style']['cursor'] = '';
        }

        this.m_resizingElement = null;        
        this.m_resizingElementMin = null;        
        this.m_resizingElementSibling = null;
        this.m_orginalResizeDimensions = null;
        
        document.removeEventListener("mousemove", this.m_docMouseMoveListener, false);
        document.removeEventListener("mouseup", this.m_docMouseUpListener, false);
        // unregister all listeners     
    }
};

/**
 * Check if has data-resizable attribute is set to 'true' on a header
 * @param {Element|undefined|null} element - element to check if has data-resizable true
 * @return {boolean} true if data-resizable attribute is 'true'
 */
DvtDataGrid.prototype._isDOMElementResizable = function(element)
{
    if (element == null)
    {
        return false;
    }
    return element.getAttribute(this.getResources().getMappedAttribute('resizable')) === "true";
};

/**
 * Determine what the document cursor should be for header cells.
 * @param {Event} event - a mousemove event
 * @return {string} the cursor type for a given mouse location
 */
DvtDataGrid.prototype.manageHeaderCursor = function(event)
{
    var elem = event['target'], resizeHeaderMode, edges, cursorX, cursorY, offsetPixel,
            widthResizable, heightResizable, siblingResizable, rtl, index, level, sibling, parent,
            leftEdgeCheck, rightEdgeCheck, topEdgeCheck, bottomEdgeCheck, end;
    //determine the element/header type that should be used for resizing if applicable
    elem = this.find(event['target'], 'headercell');
    if (!elem)
    {
        elem = this.find(event['target'], 'endheadercell');        
    }

    if (!elem)
    {
        return 'default';
    }
    
    resizeHeaderMode = this.getHeaderCellAxis(elem);
    index = this.getHeaderCellIndex(elem);
    level = this.getHeaderCellLevel(elem);

    if (resizeHeaderMode === 'column')
    {
        heightResizable = this.m_options.isResizable(resizeHeaderMode, 'height') === "enable" ? true : false;
        widthResizable = this._isDOMElementResizable(elem);
        // previous is the previous index same level
        sibling = this._getHeaderByIndex(index - 1, level, this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader);
        siblingResizable = this._isDOMElementResizable(sibling);
        // parent is the previous level the same index
        parent = this._getHeaderByIndex(index, level - 1, this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader);
    }
    else if (resizeHeaderMode === 'row')
    {
        widthResizable = this.m_options.isResizable(resizeHeaderMode, 'width') === "enable" ? true : false;
        heightResizable = this._isDOMElementResizable(elem);
        // previous is the previous index same level
        sibling = this._getHeaderByIndex(index - 1, level, this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader);
        siblingResizable = this._isDOMElementResizable(sibling);
        // parent is the previous level the same index
        parent = this._getHeaderByIndex(index, level - 1, this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader);
    }
    else if (resizeHeaderMode === 'columnEnd')
    {
        heightResizable = this.m_options.isResizable(resizeHeaderMode)['height'] === "enable" ? true : false;
        widthResizable = this._isDOMElementResizable(elem);
        // previous is the previous index same level
        sibling = this._getHeaderByIndex(index - 1, level, this.m_colEndHeader, this.m_columnEndHeaderLevelCount, this.m_startColEndHeader);
        siblingResizable = this._isDOMElementResizable(sibling);
        // parent is the previous level the same index
        parent = this._getHeaderByIndex(index, level - 1, this.m_colEndHeader, this.m_columnEndHeaderLevelCount, this.m_startColEndHeader);
    }
    else if (resizeHeaderMode === 'rowEnd')
    {
        widthResizable = this.m_options.isResizable(resizeHeaderMode)['width'] === "enable" ? true : false;
        heightResizable = this._isDOMElementResizable(elem);
        // previous is the previous index same level
        sibling = this._getHeaderByIndex(index - 1, level, this.m_rowEndHeader, this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader);
        siblingResizable = this._isDOMElementResizable(sibling);
        // parent is the previous level the same index
        parent = this._getHeaderByIndex(index, level - 1, this.m_rowEndHeader, this.m_rowEndHeaderLevelCount, this.m_startRowEndHeader);
    }
    
    //touch requires an area 24px for touch gestures
    if (this.m_utils.isTouchDevice())
    {
        cursorX = event.touches[0]['pageX'];
        cursorY = event.touches[0]['pageY'];
        offsetPixel = DvtDataGrid.RESIZE_TOUCH_OFFSET;
    }
    else
    {
        cursorX = event['pageX'];
        cursorY = event['pageY'];
        offsetPixel = DvtDataGrid.RESIZE_OFFSET;
    }
    edges = this.getHeaderEdgePixels(elem);
    rtl = this.getResources().isRTLMode();
    end = (resizeHeaderMode === 'columnEnd' || resizeHeaderMode === 'rowEnd');

    leftEdgeCheck = cursorX < edges[0] + offsetPixel;
    topEdgeCheck = cursorY < edges[1] + offsetPixel;
    rightEdgeCheck = cursorX > edges[2] - offsetPixel;
    bottomEdgeCheck = cursorY > edges[3] - offsetPixel;

    //check to see if resizable was enabled on the grid and then check the position of the cursor to the element border
    //we always choose the element preceding the border (so for rows the header before the bottom border)
    if (resizeHeaderMode === 'column' || resizeHeaderMode === 'columnEnd')
    {
        // can we resize the width of this header
        if (widthResizable && (rtl ? leftEdgeCheck : rightEdgeCheck))
        {
            this.m_resizingElement = elem;
            return 'col-resize';
        }
        // can we resize the width of the previous header
        else if (siblingResizable && (rtl ? rightEdgeCheck : leftEdgeCheck))
        {
            this.m_resizingElement = sibling;
            this.m_resizingElementSibling = elem;
            if (this.m_resizingElement !== null)
            {
                return 'col-resize';
            }
        }
        else if (heightResizable)
        {
            // can we resize the height of this header
            if ((!end && bottomEdgeCheck) || (end && topEdgeCheck))
            {
                this.m_resizingElement = elem;
                return 'row-resize';
            }
            // can we resize the height of the parent header
            else if ((!end && topEdgeCheck) || (end && bottomEdgeCheck))
            {
                this.m_resizingElement = parent;
                this.m_resizingElementSibling = elem;
                return 'row-resize';
            }
        }
    }
    else if (resizeHeaderMode === 'row' || resizeHeaderMode === 'rowEnd')
    {
        if (heightResizable && bottomEdgeCheck)
        {
            this.m_resizingElement = elem;
            return 'row-resize';
        }
        else if (siblingResizable && topEdgeCheck)
        {
            this.m_resizingElement = sibling;
            this.m_resizingElementSibling = elem;
            if (this.m_resizingElement !== null)
            {
                return 'row-resize';
            }
        }
        if (widthResizable)
        {
            if ((!end && (rtl ? leftEdgeCheck : rightEdgeCheck)) || (end && (rtl ? rightEdgeCheck : leftEdgeCheck)))
            {
                this.m_resizingElement = elem;
                return 'col-resize';
            }
            else if ((!end && (rtl ? rightEdgeCheck : leftEdgeCheck)) || (end && (rtl ? leftEdgeCheck : rightEdgeCheck)))
            {
                this.m_resizingElement = parent;
                this.m_resizingElementSibling = elem;
                if (this.m_resizingElement !== null)
                {
                    return 'col-resize';
                }
            }
        }
    }
    return 'default';
};

/**
 * On mousemove see which type of resizing we are doing and call the appropriate resizer after calculating
 * the new elements width based on current and last X and Y page coordinates.
 * @param {Event} event - a mousemove event
 */
DvtDataGrid.prototype.handleResizeMouseMove = function(event)
{
    var resizeHeaderMode, oldElementWidth, newElementWidth, oldElementHeight, newElementHeight, end;
    //update stored mouse position
    this.m_currentMouseX = event['pageX'];
    this.m_currentMouseY = event['pageY'];

    if (this.m_utils.isTouchDevice())
    {
        this.m_currentMouseX = event.touches[0]['pageX'];
        this.m_currentMouseY = event.touches[0]['pageY'];
    }
    else
    {
        this.m_currentMouseX = event['pageX'];
        this.m_currentMouseY = event['pageY'];
    }

    //check to see if we are resizing a column or row
    if (this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('colheadercell')) ||
        this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('colendheadercell')))
    {
        resizeHeaderMode = 'column';
    }
    else
    {
        resizeHeaderMode = 'row';
    }
    
    end = this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('endheadercell'));

    //handle width resizing for columns/rows
    if (this.m_cursor === 'col-resize')
    {
        if (resizeHeaderMode === 'column')
        {
            oldElementWidth = this.calculateColumnHeaderWidth(this.m_resizingElement);
            newElementWidth = this.getNewElementWidth('column', oldElementWidth, end);
            this.resizeColWidth(oldElementWidth, newElementWidth);
        }
        else if (resizeHeaderMode === 'row')
        {
            oldElementWidth = this.getElementWidth(this.m_resizingElement);
            newElementWidth = this.getNewElementWidth('row', oldElementWidth, end);
            this.resizeRowWidth(newElementWidth, newElementWidth - oldElementWidth, end);
        }
    }
    //handle height resizing for columns/rows
    else if (this.m_cursor === 'row-resize')
    {
        if (resizeHeaderMode === 'row')
        {
            oldElementHeight = this.calculateRowHeaderHeight(this.m_resizingElement);
            newElementHeight = this.getNewElementHeight('row', oldElementHeight, end);
            this.resizeRowHeight(oldElementHeight, newElementHeight);
        }
        else if (resizeHeaderMode === 'column')
        {
            oldElementHeight = this.getElementHeight(this.m_resizingElement);
            newElementHeight = this.getNewElementHeight('column', oldElementHeight, end);
            this.resizeColHeight(newElementHeight, newElementHeight - oldElementHeight, end);
        }
    }

    //rebuild the corners
    this.buildCorners();

    // re-align touch affordances
    if (this.m_utils.isTouchDevice())
    {
        this._moveTouchSelectionAffordance();
    }

    //update the last mouse X/Y
    this.m_lastMouseX = this.m_currentMouseX;
    this.m_lastMouseY = this.m_currentMouseY;
};

/**
 * Resize the width of column headers, and the column cells. Also resize the
 * scroller and databody accordingly. Set the left(or right) style value on all
 * cells/columns following(preceeding) the resizing element. Update the end
 * column pixel as well.
 * @param {number} oldElementWidth - the elements width prior to resizing
 * @param {number} newElementWidth - the elements width after resizing
 */
DvtDataGrid.prototype.resizeColWidth = function(oldElementWidth, newElementWidth)
{
    var widthChange, oldScrollerWidth, newScrollerWidth;
    widthChange = newElementWidth - oldElementWidth;
    if (widthChange != 0)
    {
        if (this.m_databody['firstChild'] != null)
        {        
            oldScrollerWidth = this.getElementWidth(this.m_databody['firstChild']);
            newScrollerWidth = oldScrollerWidth + widthChange;
            this.setElementWidth(this.m_databody['firstChild'], newScrollerWidth);
        }

        //helper to update all elements this effects
        this.resizeColumnWidthAndShift(widthChange);

        this.m_endColPixel += widthChange;
        this.m_endColHeaderPixel += widthChange;
        this.m_endColEndHeaderPixel += widthChange;
        this.m_avgColWidth = newScrollerWidth / this.getDataSource().getCount('column');

        this.manageResizeScrollbars();
    }
};

/**
 * Resize the height of row headers, and the rows cells. Also resize the
 * scroller and databody accordingly. Update the end row pixel as well.
 * @param {number} oldElementHeight - the elements height prior to resizing
 * @param {number} newElementHeight - the elements height after resizing
 */
DvtDataGrid.prototype.resizeRowHeight = function(oldElementHeight, newElementHeight)
{
    var heightChange, oldScrollerHeight, newScrollerHeight;
    heightChange = newElementHeight - oldElementHeight;
    if (heightChange != 0)
    {
        if (this.m_databody['firstChild'] != null)
        {
            oldScrollerHeight = this.getElementHeight(this.m_databody['firstChild']);
            newScrollerHeight = oldScrollerHeight + heightChange;
            this.setElementHeight(this.m_databody['firstChild'], newScrollerHeight);
        }
        
        //set row height on the appropriate databody row, set the new value in the sizingManager
        this.resizeRowHeightAndShift(heightChange);

        this.m_endRowPixel += heightChange;
        this.m_endRowHeaderPixel += heightChange;
        this.m_endRowEndHeaderPixel += heightChange;        
        this.m_avgRowHeight = newScrollerHeight / this.getDataSource().getCount('row');

        this.manageResizeScrollbars();
    }
};

/**
 * Resize the height of column headers. Also resize the scroller and databody
 * accordingly.
 * @param {number} newElementHeight - the column header height after resizing
 * @param {number} heightChange - the change in height
 * @param {boolean} end
 */
DvtDataGrid.prototype.resizeColHeight = function(newElementHeight, heightChange, end)
{
    if (heightChange != 0)
    {
        var level = this.getHeaderCellLevel(this.m_resizingElement) + this.getHeaderCellDepth(this.m_resizingElement) - 1;
        end ? this.m_columnEndHeaderLevelHeights[level] += heightChange : this.m_columnHeaderLevelHeights[level] += heightChange;
        this.resizeColumnHeightsAndShift(heightChange, level, end);

        if (!end)
        {
            this.m_colHeaderHeight += heightChange;
            this.setElementHeight(this.m_colHeader, this.m_colHeaderHeight);
        }
        else
        {
            this.m_colEndHeaderHeight += heightChange;
            this.setElementHeight(this.m_colEndHeader, this.m_colEndHeaderHeight);           
        }
        this.manageResizeScrollbars();
    }
};

/**
 * Resize the width of row headers. Also resize the scroller and databody
 * accordingly.
 * @param {number} newElementWidth - the row header width after resizing
 * @param {number} widthChange - the change in width
 * @param {boolean} end
 */
DvtDataGrid.prototype.resizeRowWidth = function(newElementWidth, widthChange, end)
{
    var level;
    if (widthChange != 0)
    {
        level = this.getHeaderCellLevel(this.m_resizingElement) + this.getHeaderCellDepth(this.m_resizingElement) - 1;

        end ? this.m_rowEndHeaderLevelWidths[level] += widthChange : this.m_rowHeaderLevelWidths[level] += widthChange;
        this.resizeRowWidthsAndShift(widthChange, level, end);
        
        if (!end)
        {
            this.m_rowHeaderWidth += widthChange;
            this.setElementWidth(this.m_rowHeader, this.m_rowHeaderWidth);
        }
        else
        {
            this.m_rowEndHeaderWidth += widthChange;
            this.setElementWidth(this.m_rowEndHeader, this.m_rowEndHeaderWidth);            
        }
        this.manageResizeScrollbars();
    }
};

/**
 * Determine what the new element width should be based on minimum values.
 * Accounts for the overshoot potential of passing up the boundries set.
 * @param {string} axis - the axis along which we need a new width
 * @param {number} oldElementWidth - the element width prior to resizing
 * @param {boolean} end 
 * @return {number} the element width after resizing
 */
DvtDataGrid.prototype.getNewElementWidth = function(axis, oldElementWidth, end)
{
    var minWidth, databodyWidth, deltaWidth, newElementWidth, halfGridWidth;
    //to account for the 24px resing width
    minWidth = this._getMinValue('width', axis);
    databodyWidth = this.getElementWidth(this.m_databody);
    deltaWidth = this.getResources().isRTLMode() ? this.m_lastMouseX - this.m_currentMouseX : this.m_currentMouseX - this.m_lastMouseX;
    if (end && axis == 'row')
    {
        deltaWidth = deltaWidth * -1;
    }    
    newElementWidth = oldElementWidth + deltaWidth + this.m_overResizeLeft + this.m_overResizeMinLeft + this.m_overResizeRight;
    halfGridWidth = Math.round(this.getWidth() / 2);

    //check to make sure the element exceeds the minimum width
    if (newElementWidth < minWidth)
    {
        this.m_overResizeMinLeft += deltaWidth - minWidth + oldElementWidth;
        newElementWidth = minWidth;
    }
    else
    {
        this.m_overResizeMinLeft = 0;
        this.m_overResizeLeft = 0;
    }
    //check to make sure row header width don't exceed half of the grid width
    if (axis === 'row')
    {
        if (newElementWidth > halfGridWidth)
        {
            this.m_overResizeRight += deltaWidth - halfGridWidth + oldElementWidth;
            newElementWidth = halfGridWidth;
        }
        else
        {
            this.m_overResizeRight = 0;
        }
    }
    return newElementWidth;
};

/**
 * Determine what the new element height should be based on minimum values.
 * Accounts for the overshoot potential of passing up the boundries set.
 * @param {string} axis - the axis along which we need a new width
 * @param {number} oldElementHeight - the element height prior to resizing
 * @param {boolean} end
 * @return {number} the element height after resizing
 */
DvtDataGrid.prototype.getNewElementHeight = function(axis, oldElementHeight, end)
{
    var databodyHeight, minHeight, deltaHeight, newElementHeight, halfGridHeight;
    minHeight = this._getMinValue('height', axis);
    databodyHeight = this.getElementHeight(this.m_databody);
    deltaHeight = this.m_currentMouseY - this.m_lastMouseY;
    if (end && axis == 'column')
    {
        deltaHeight = deltaHeight * -1;
    }
    newElementHeight = oldElementHeight + deltaHeight + this.m_overResizeTop + this.m_overResizeMinTop + this.m_overResizeBottom;
    halfGridHeight = Math.round(this.getHeight() / 2);

    //Check to make sure the element height exceeds the minimum height
    if (newElementHeight < minHeight)
    {
        this.m_overResizeMinTop += deltaHeight - minHeight + oldElementHeight;
        newElementHeight = minHeight;
    }
    else
    {
        this.m_overResizeMinTop = 0;
        this.m_overResizeTop = 0;
    }
    //check to make sure column header width don't exceed half of the grid height
    if (axis === 'column')
    {
        if (newElementHeight > halfGridHeight)
        {
            this.m_overResizeBottom += deltaHeight - halfGridHeight + oldElementHeight;
            newElementHeight = halfGridHeight;
        }
        else
        {
            this.m_overResizeBottom = 0;
        }
    }
    return newElementHeight;
};

/**
 * Determine what the minimum value for the resizing element is
 * @param {string} dimension - the width or height
 * @param {string} axis - the axis
 * @return {number} the minimum height for the element
 * @private
 */
DvtDataGrid.prototype._getMinValue = function(dimension, axis)
{
    var index, level, elem, minValue, extent, currentDimensionValue, inner, innerDimensionValue, depth, paddingBorder;
    elem = this.m_resizingElement;
    level = this.getHeaderCellLevel(elem);
    depth = this.getHeaderCellDepth(elem);
    paddingBorder = this._getCellPaddingBorder(dimension, elem);
    minValue = Math.max((this.m_utils.isTouchDevice() ? 2 * DvtDataGrid.RESIZE_TOUCH_OFFSET : 2 * DvtDataGrid.RESIZE_OFFSET), paddingBorder);
    if ((axis === 'column' && (this.m_columnHeaderLevelCount === 1 || (dimension === 'width' && this.m_columnHeaderLevelCount === level + 1) || (dimension === 'height' && depth === 1))) ||
            (axis === 'row' && (this.m_rowHeaderLevelCount === 1 || (dimension === 'height' && this.m_rowHeaderLevelCount === level + 1) || (dimension === 'width' && depth === 1))))
    {
        return minValue;
    }
    index = this.getHeaderCellIndex(elem);
    extent = this._getAttribute(this.m_resizingElement['parentNode'], 'extent', true);
    currentDimensionValue = this.getElementDir(elem, dimension);

    if (axis === 'column')
    {
        if (dimension === 'width')
        {
            inner = this._getHeaderByIndex(index + extent - 1, this.m_columnHeaderLevelCount - 1, this.m_colHeader, this.m_columnHeaderLevelCount, this.m_startColHeader);
            innerDimensionValue = this.getElementDir(inner, dimension);
        }
        else
        {
            innerDimensionValue = this._getColumnHeaderLevelHeight(level + depth - 1, elem);
        }
    }
    else if (axis === 'row')
    {
        if (dimension === 'height')
        {
            inner = this._getHeaderByIndex(index + extent - 1, this.m_rowHeaderLevelCount - 1, this.m_rowHeader, this.m_rowHeaderLevelCount, this.m_startRowHeader);
            innerDimensionValue = this.getElementDir(inner, dimension);
        }
        else
        {
            innerDimensionValue = this._getHeaderLevelDimension(level + depth - 1, elem, this.m_rowHeaderLevelWidths, 'width');
        }
    }
    return currentDimensionValue - (innerDimensionValue - minValue);
};

/**
 * Get the cell padding + border size along a certain dimenison
 * @param {string} dimension
 * @param {Element} elem
 * @returns {Number}
 */
DvtDataGrid.prototype._getCellPaddingBorder = function(dimension, elem)
{
    var cssExpand, i, val, style;
    if (this.m_resizingElementMin == null)
    {
        cssExpand = [ "top", "right", "bottom", "left" ];
        i = dimension === "width" ? 1 : 0;
        val = 0;
        style = window.getComputedStyle(elem);
        for ( ; i < 4; i += 2 ) {
            val += parseFloat(style.getPropertyValue("padding-" + cssExpand[ i ]));
            val += parseFloat(style.getPropertyValue("border-" + cssExpand[ i ] + "-width"));
        }
        this.m_resizingElementMin = Math.round(val);
    }
    return this.m_resizingElementMin;
};

/**
 * Manages the databody and scroller sizing when the scrollbars are added and
 * removed scrollbars from the grid. This allows the grid container to maintain
 * size as it renders scrollbars inside rahther than out. Method mimics resizeGrid
 */
DvtDataGrid.prototype.manageResizeScrollbars = function()
{
    var width, height, colHeader, rowHeader, databody, colHeaderHeight, columnHeaderWidth, rowHeaderWidth, rowHeaderHeight, 
            databodyContentWidth, databodyWidth, databodyContentHeight, databodyHeight, isDatabodyHorizontalScrollbarRequired,
            isDatabodyVerticalScrollbarRequired, scrollbarSize, dir, rowEndHeaderDir, columnEndHeaderDir, isEmpty,
            deltaX = 0, deltaY = 0, colEndHeader, rowEndHeader, availableHeight, availableWidth, colEndHeaderHeight, rowEndHeaderWidth,
            databodyScroller, empty, emptyWidth, emptyHeight;


    width = this.getWidth();
    height = this.getHeight();
    colHeader = this.m_colHeader;
    colEndHeader = this.m_colEndHeader;
    rowHeader = this.m_rowHeader;
    rowEndHeader = this.m_rowEndHeader;
    databody = this.m_databody;
    databodyScroller = databody['firstChild'];
    
    // cache these since they will be used in multiple places and we want to minimize reflow
    colHeaderHeight = this.getColumnHeaderHeight();
    colEndHeaderHeight = this.getColumnEndHeaderHeight();
    rowHeaderWidth = this.getRowHeaderWidth();
    rowEndHeaderWidth = this.getRowEndHeaderWidth();
    
    //adjusted to make the databody wrap the databody content, and the scroller to fill the remaing part of the grid
    //this way our scrollbars are always at the edges of our viewport
    availableHeight = height - colHeaderHeight - colEndHeaderHeight;
    availableWidth = width - rowHeaderWidth - rowEndHeaderWidth;
    
    scrollbarSize = this.m_utils.getScrollbarSize();
    dir = this.getResources().isRTLMode() ? "right" : "left";
    isEmpty = this._databodyEmpty();   
    
    // check if there's no data
    if (isEmpty)
    {
        //could be getting here in the handle resize of an empty grid
        if (this.m_empty == null)
        {
            empty = this._buildEmptyText();
            this.m_root.appendChild(empty); //@HTMLUpdateOK
        }
        else
        {
            empty = this.m_empty;
        }
        emptyHeight = this.getElementHeight(empty);
        emptyWidth = this.getElementWidth(empty);
        
        if (emptyHeight > this.getElementHeight(databodyScroller))
        {
            this.setElementHeight(databodyScroller, emptyHeight);
        }
        if (emptyWidth > this.getElementWidth(databodyScroller))
        {
            this.setElementWidth(databodyScroller, emptyWidth);
        }     
    }

    databodyContentWidth = this.getElementWidth(databody['firstChild']);
    databodyContentHeight = this.getElementHeight(databody['firstChild']);
    //determine which scrollbars are required, if needing one forces need of the other, allows rendering within the root div
    isDatabodyHorizontalScrollbarRequired = this.isDatabodyHorizontalScrollbarRequired(availableWidth);
    if (isDatabodyHorizontalScrollbarRequired)
    {
        isDatabodyVerticalScrollbarRequired = this.isDatabodyVerticalScrollbarRequired(availableHeight - scrollbarSize);
        databody['style']['overflow'] = "auto";
    }
    else
    {
        isDatabodyVerticalScrollbarRequired = this.isDatabodyVerticalScrollbarRequired(availableHeight);
        if (isDatabodyVerticalScrollbarRequired)
        {
            isDatabodyHorizontalScrollbarRequired = this.isDatabodyHorizontalScrollbarRequired(availableWidth - scrollbarSize);
            databody['style']['overflow'] = "auto";
        }
        else
        {
            // for an issue where same size child causes scrollbars (similar code used in resizing already)
            databody['style']['overflow'] = "hidden";
        }        
    }
    
    this.m_hasHorizontalScroller = isDatabodyHorizontalScrollbarRequired;
    this.m_hasVerticalScroller = isDatabodyVerticalScrollbarRequired;          
    
    if (this.m_endColEndHeader != -1)
    {
        databodyHeight = Math.min(databodyContentHeight + (isDatabodyHorizontalScrollbarRequired ? scrollbarSize : 0), availableHeight);
        rowHeaderHeight = isDatabodyHorizontalScrollbarRequired ? databodyHeight - scrollbarSize : databodyHeight;
    }
    else
    {
        databodyHeight = availableHeight;
        rowHeaderHeight = Math.min(databodyContentHeight, isDatabodyHorizontalScrollbarRequired ? databodyHeight - scrollbarSize : databodyHeight);
    }

    if (this.m_endRowEndHeader != -1)
    {
        databodyWidth = Math.min(databodyContentWidth + (isDatabodyVerticalScrollbarRequired ? scrollbarSize : 0), availableWidth);
        columnHeaderWidth = isDatabodyVerticalScrollbarRequired ? databodyWidth - scrollbarSize : databodyWidth;
    }
    else
    {
        databodyWidth = availableWidth;
        columnHeaderWidth = Math.min(databodyContentWidth, isDatabodyVerticalScrollbarRequired ? databodyWidth - scrollbarSize : databodyWidth);
    }

    rowEndHeaderDir = rowHeaderWidth + columnHeaderWidth + (isDatabodyVerticalScrollbarRequired ? scrollbarSize : 0);
    columnEndHeaderDir = colHeaderHeight + rowHeaderHeight + (isDatabodyHorizontalScrollbarRequired ? scrollbarSize : 0); 

    this.setElementDir(rowHeader, 0, dir);
    this.setElementDir(rowHeader, colHeaderHeight, 'top');
    this.setElementHeight(rowHeader, rowHeaderHeight);

    this.setElementDir(rowEndHeader, rowEndHeaderDir, dir);
    this.setElementDir(rowEndHeader, colHeaderHeight, 'top');
    this.setElementHeight(rowEndHeader, rowHeaderHeight);

    this.setElementDir(colHeader, rowHeaderWidth, dir);
    this.setElementWidth(colHeader, columnHeaderWidth);

    this.setElementDir(colEndHeader, rowHeaderWidth, dir);
    this.setElementDir(colEndHeader, columnEndHeaderDir, 'top');
    this.setElementWidth(colEndHeader, columnHeaderWidth);

    this.setElementDir(databody, colHeaderHeight, 'top');
    this.setElementDir(databody, rowHeaderWidth, dir);
    this.setElementWidth(databody, databodyWidth);
    this.setElementHeight(databody, databodyHeight);

    // cache the scroll width and height to minimize reflow
    this.m_scrollWidth = databodyContentWidth - columnHeaderWidth;
    this.m_scrollHeight = databodyContentHeight - rowHeaderHeight;

    this.buildCorners();

    // check if we need to remove border on the last column header/add borders to headers
    this._adjustHeaderBorders();
    
    // on touch devices the scroller doesn't automatically scroll into view when resizing the last columns or rows to be smaller
    if (this.m_utils.isTouchDevice())
    {
        // if the visible window plus the scrollLeft is bigger than the scrollable region maximum, rescroll the window
        if (this.m_currentScrollLeft > this.m_scrollWidth)
        {
            deltaX = this.m_scrollWidth - this.m_currentScrollLeft;
        }

        if (this.m_currentScrollTop > this.m_scrollHeight)
        {
            deltaY = this.m_scrollHeight - this.m_currentScrollTop;
        }

        if (deltaX != 0 || deltaY != 0)
        {
            // eliminate bounce back for touch scroll
            this._disableTouchScrollAnimation();
            this.scrollDelta(deltaX, deltaY);
        }
    }
};

/**
 * Resizes all cell in the resizing element's column, and updates the left(right)
 * postion on the cells and column headers that follow(preceed) that column.
 * @param {number} widthChange - the change in width of the resizing element
 */
DvtDataGrid.prototype.resizeColumnWidthAndShift = function(widthChange)
{
    var dir, databodyRows, i, newStart, j, index, cells, cell, newWidth, colHeaderDisplay, colEndHeaderDisplay;
    dir = this.getResources().isRTLMode() ? "right" : "left";

    colHeaderDisplay = this.m_colHeader['style']['display'];
    colEndHeaderDisplay = this.m_colEndHeader['style']['display'];
    
    // hide the databody and col header for performance
    this.m_databody['style']['display'] = 'none';
    this.m_colHeader['style']['display'] = 'none';
    this.m_colEndHeader['style']['display'] = 'none';

    //get the index of the header, if it is a nested header make it the last child index
    index = this.getHeaderCellIndex(this.m_resizingElement);
    if (this.m_columnHeaderLevelCount > 1
            && this.m_resizingElement === this.m_resizingElement['parentNode']['firstChild']
            && this.m_resizingElement['nextSibling'] != null) // has children
    {
        index += this._getAttribute(this.m_resizingElement['parentNode'], 'extent', true) - 1;
    }

    // move column headers within the container and adjust the widths appropriately
    this._shiftHeadersAlongAxisInContainer(this.m_colHeader['firstChild'], index, widthChange, dir, this.getMappedStyle('colheadercell'), 'column');

    // move column headers within the container and adjust the widths appropriately
    this._shiftHeadersAlongAxisInContainer(this.m_colEndHeader['firstChild'], index, widthChange, dir, this.getMappedStyle('colendheadercell'), 'column');

    // shift the cells widths and left/right values in the databody
    this._shiftCellsInRows(widthChange, true, newWidth, index - this.m_startCol + 1, this.m_endCol - this.m_startCol + 1, index - this.m_startCol, dir);

    //restore visibility
    this.m_databody['style']['display'] = '';
    this.m_colHeader['style']['display'] = colHeaderDisplay;
    this.m_colEndHeader['style']['display'] = colEndHeaderDisplay;
};

/**
 * Moves cells inside of all rows starting at a certain column index, will also resize a given column.
 * @param {number} delta
 * @param {boolean} shouldChangeWidth
 * @param {number|undefined|null} newWidth
 * @param {number} startCol
 * @param {number} endCol
 * @param {number|undefined|null} changeWidthCol
 * @param {string} dir
 */
DvtDataGrid.prototype._shiftCellsInRows = function(delta, shouldChangeWidth, newWidth, startCol, endCol, changeWidthCol, dir)
{
    var i, j,databodyRows, cells, cell, newStart;
    // shift the cells widths and left/right values in the databody
    if (this.m_databody['firstChild'] != null)
    {
        databodyRows = this.m_databody['firstChild']['childNodes'];
        for (i = 0; i < databodyRows.length; i++)
        {
            cells = databodyRows[i]['childNodes'];
            
            if (shouldChangeWidth)
            {
                // set the new width on the appropriate column
                cell = cells[changeWidthCol];                
                if (newWidth == null)
                {
                    newWidth = this.getElementWidth(cell) + delta;
                }
                this.setElementWidth(cell, newWidth);
            }

            // move the columns within the data body to account for width change
            for (j = startCol; j < endCol; j += 1)
            {
                cell = cells[j];
                newStart = this.getElementDir(cell, dir) + delta;
                this.setElementDir(cell, newStart, dir);
            }
        }
    }
};

/**
 * Resizes the resizing elements row, and updates the top
 * postion on the rows and row headers that follow that column.
 * @param {number} heightChange - the change in width of the resizing element
 */
DvtDataGrid.prototype.resizeRowHeightAndShift = function(heightChange)
{
    var databodyRows, i, newStart, index, row, newHeight, rowHeaderDisplay, rowEndHeaderDisplay;

    rowHeaderDisplay = this.m_rowHeader['style']['display'];
    rowEndHeaderDisplay = this.m_rowEndHeader['style']['display'];;

    // hide the databody and row header for performance
    this.m_databody['style']['display'] = 'none';
    this.m_rowHeader['style']['display'] = 'none';
    this.m_rowEndHeader['style']['display'] = 'none';

    //get the index of the header, if it is a nested header make it the last child index
    index = this.getHeaderCellIndex(this.m_resizingElement);
    if (this.m_rowHeaderLevelCount > 1
            && this.m_resizingElement === this.m_resizingElement['parentNode']['firstChild']
            && this.m_resizingElement['nextSibling'] != null) // has children)
    {
        index += this._getAttribute(this.m_resizingElement['parentNode'], 'extent', true) - 1;
    }

    // move row headers within the container
    this._shiftHeadersAlongAxisInContainer(this.m_rowHeader['firstChild'], index, heightChange, 'top', this.getMappedStyle('rowheadercell'), 'row');

    // move row headers within the container
    this._shiftHeadersAlongAxisInContainer(this.m_rowEndHeader['firstChild'], index, heightChange, 'top', this.getMappedStyle('rowendheadercell'), 'row');

    // shift the rows in the databody
    if (this.m_databody['firstChild'] != null)
    {
        databodyRows = this.m_databody['firstChild']['childNodes'];
        row = databodyRows[index - this.m_startRow];
        if (row != null)
        {
            newHeight = this.getElementHeight(row) + heightChange;
            this.setElementHeight(row, newHeight);
            // +1 for the header we just did
            for (i = index - this.m_startRow + 1; i < databodyRows.length; i++)
            {
                row = databodyRows[i];
                newStart = this.getElementDir(row, 'top') + heightChange;
                this.setElementDir(row, newStart, 'top');
            }
        }
    }

    this.m_databody['style']['display'] = '';
    this.m_rowHeader['style']['display'] = rowHeaderDisplay;
    this.m_rowEndHeader['style']['display'] = rowEndHeaderDisplay;    
};

/**
 * This method recursively shifts a group over until it reaches the index where the group width/height needs to be adjusted
 * @param {Element} headersContainer the header grouping or scroller
 * @param {number|string} index the index that is being adjusted
 * @param {number} dimensionChange the change in width or height
 * @param {string} dir top, left, or right the appropriate value to adjust along the axis
 * @param {string} className the header cell className along that axis
 * @param {string=} axis the axis we are shifting on
 * @private
 */
DvtDataGrid.prototype._shiftHeadersAlongAxisInContainer = function(headersContainer, index, dimensionChange, dir, className, axis)
{
    var element, header, isHeader, groupingContainer, headerStart, headers, i, newStart, newVal = 0;

    // get the last element in the container
    element = headersContainer['lastChild'];
    if (element == null)
    {
        return;
    }
    
    // is the last element a header or a group
    isHeader = this.m_utils.containsCSSClassName(element, className);
    // what is the index of the container/header
    if (isHeader)
    {
        groupingContainer = element['parentNode'];
        header = element;
        headerStart = this.getHeaderCellIndex(header);
    }
    else
    {
        groupingContainer = element;
        header = element['firstChild'];
        headerStart = this._getAttribute(groupingContainer, 'start', true);
    }

    // if the group is after the specified index move all the dir values under that group
    while (index < headerStart)
    {
        if (isHeader)
        {
            //move this header to the right left up down
            newStart = this.getElementDir(header, dir) + dimensionChange;
            this.setElementDir(header, newStart, dir);

            element = element['previousSibling'];
            isHeader = this.m_utils.containsCSSClassName(element, className);
            groupingContainer = element['parentNode'];
            header = element;
            headerStart = this.getHeaderCellIndex(header);
        }
        else
        {
            //move all children of a group
            headers = groupingContainer.getElementsByClassName(className);
            for (i = 0; i < headers.length; i++)
            {
                newStart = this.getElementDir(headers[i], dir) + dimensionChange;
                this.setElementDir(headers[i], newStart, dir);
            }

            element = element['previousSibling'];
            isHeader = this.m_utils.containsCSSClassName(element, className);
            groupingContainer = element;
            header = element['firstChild'];
            headerStart = this._getAttribute(groupingContainer, 'start', true);
        }
    }

    if (axis == 'column')
    {
        //the last header we moved to should be the one that needs its width updated
        newVal = this.getElementWidth(header) + dimensionChange;
        this.setElementWidth(header, newVal);
    }
    else if (axis == 'row')
    {
        newVal = this.getElementHeight(header) + dimensionChange;
        this.setElementHeight(header, newVal);
    }
    else if (axis == null)
    {
        newStart = this.getElementDir(header, dir) + dimensionChange;
        this.setElementDir(header, newStart, dir); 
    }

    // if we aren't innermost then repeat for its children
    if (!isHeader && header['nextSibling'] != null) // has children
    {
        this._shiftHeadersAlongAxisInContainer(element, index, dimensionChange, dir, className, axis);
    }
    else if (axis != null)
    {
        //store the width/height change in the sizing manager, only care about innermost
        this.m_sizingManager.setSize(axis, this._getKey(header), newVal);
    }
};

/**
 * Resizes all cell in the resizing element's column, and updates the left(right)
 * postion on the cells and column headers that follow(preceed) that column.
 * @param {number} heightChange - the change in width of the resizing element
 * @param {number} level - the level we are resizing
 * @param {boolean} end
 */
DvtDataGrid.prototype.resizeColumnHeightsAndShift = function(heightChange, level, end)
{
    var root, className, axis, dir;
    if (!end)
    {    
       root = this.m_colHeader;
       className = this.getMappedStyle('colheadercell');
       axis  = 'column';
       dir = 'top';
    }
    else
    {
       root = this.m_colEndHeader;
       className = this.getMappedStyle('colendheadercell');
       axis  = 'columnEnd';
       dir = 'bottom';
    }
    
    root['style']['display'] = 'none';
    this.m_databody['style']['display'] = 'none';    
    // move column headers within the container
    this._shiftHeadersDirInContainer(root['firstChild'], heightChange, level, dir, className, axis);
    root['style']['display'] = '';      
    this.m_databody['style']['display'] = '';    
};

/**
 * Resizes all cell in the resizing element's column, and updates the left(right)
 * postion on the cells and column headers that follow(preceed) that column.
 * @param {number} widthChange - the change in width of the resizing element
 * @param {number} level - the level we are resizing
 * @param {boolean} end
 */
DvtDataGrid.prototype.resizeRowWidthsAndShift = function(widthChange, level, end)
{
    var root, className, axis, dir;
    
    if (!end)
    {    
       root = this.m_rowHeader;
       className = this.getMappedStyle('rowheadercell');
       axis  = 'row';
       dir = this.getResources().isRTLMode() ? "right" : "left"; 
    }
    else
    {
       root = this.m_rowEndHeader;
       className = this.getMappedStyle('rowendheadercell');
       axis  = 'rowEnd';
       dir = this.getResources().isRTLMode() ? "left" : "right"; 
    }
    
    root['style']['display'] = 'none';
    this.m_databody['style']['display'] = 'none';
    // move column headers within the container
    this._shiftHeadersDirInContainer(root['firstChild'], widthChange, level, dir, className, axis);
    root['style']['display'] = '';    
    this.m_databody['style']['display'] = '';

};

/**
 * Shifts the headers after a particular level over and adjusts the dimension of that level across the whole container
 * @param {Element} headersContainer
 * @param {number} dimensionChange
 * @param {number} level
 * @param {string} dir
 * @param {string} className
 * @param {string} axis
 * @private
 */
DvtDataGrid.prototype._shiftHeadersDirInContainer = function(headersContainer, dimensionChange, level, dir, className, axis)
{
    var groupings, i, grouping, isHeader, headerLevel, headers, newDir, j, headerDepth;
    groupings = headersContainer['childNodes'];
    // for all children in the group
    for (i = 0; i < groupings.length; i++)
    {
        grouping = groupings[i];
        isHeader = this.m_utils.containsCSSClassName(grouping, className);
        //if it is a group
        if (!isHeader)
        {
            headerLevel = this._getAttribute(grouping, 'level', true);
            // if before or on the level we need to go deeper into the grouping
            if (headerLevel <= level)
            {
                this._shiftHeadersDirInContainer(grouping, dimensionChange, level, dir, className, axis);
            }
            else
            {
                // if level is higher then we need to adjust the dir of all the headers under that group
                headers = grouping.getElementsByClassName(className);
                for (j = 0; j < headers.length; j++)
                {
                    newDir = this.getElementDir(headers[j], dir) + dimensionChange;
                    this.setElementDir(headers[j], newDir, dir);
                }
            }
        }
        else
        {
            headerLevel = this.getHeaderCellLevel(grouping);
            headerDepth = this.getHeaderCellDepth(grouping);

            // if we have a header at that level adjust it's value
            if (headerLevel <= level && level < headerLevel + headerDepth)
            {
                if (axis === 'column' || axis === 'columnEnd')
                {
                    newDir = this.getElementHeight(grouping) + dimensionChange;
                    this.setElementHeight(grouping, newDir);
                }
                else
                {
                    newDir = this.getElementWidth(grouping) + dimensionChange;
                    this.setElementWidth(grouping, newDir);
                }
            }
            // if we have a header inside the group then adjust its dimension
            else if (headerLevel > level)
            {
                newDir = this.getElementDir(grouping, dir) + dimensionChange;
                this.setElementDir(grouping, newDir, dir);
            }
        }
    }
};

/**
 * Takes the original target of the context menu and maps it to the appropriate
 * column/row header to resize and selects the right resize function.
 * @param {Event} event - the event that spawned context menu
 * @param {string} id - 'width' or 'height'
 * @param {string} val - new width or height to resize to
 * @param {Element|undefined} target - the target element
 */
DvtDataGrid.prototype.handleContextMenuResize = function(event, id, val, target)
{
    var initialWidth, initialHeight, newWidth, newHeight, value, details, end;
    value = parseInt(val, 10);
    if (this.m_utils.containsCSSClassName(target, this.getMappedStyle('cell')))
    {
        if (id === this.m_resources.getMappedCommand('resizeHeight'))
        {
            target = this.getHeaderFromCell(target, 'row');
        }
        else
        {
            target = this.getHeaderFromCell(target, 'column');
        }
    }

    this.m_resizingElement = target;
    initialWidth = this.getElementWidth(target);
    initialHeight = this.getElementHeight(target);
    end = this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('endheadercell'));

    if (id === this.m_resources.getMappedCommand('resizeWidth'))
    {
        if (initialWidth !== value)
        {
            if (this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('colheadercell')) ||
                this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('colendheadercell')))
            {
                if (this._isDOMElementResizable(this.m_resizingElement))
                {
                    this.resizeColWidth(initialWidth, value);
                }
            }
            else
            {
                this.resizeRowWidth(value, value - initialWidth, end);
            }
        }
    }
    else if (id === this.m_resources.getMappedCommand('resizeHeight'))
    {
        initialHeight = this.getElementHeight(target);
        if (initialHeight !== value)
        {
            if (this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('colheadercell')) ||
                this.m_utils.containsCSSClassName(this.m_resizingElement, this.getMappedStyle('colendheadercell')))
            {
                this.resizeColHeight(value, value - initialHeight, end);
            } else
            {
                if (this._isDOMElementResizable(this.m_resizingElement))
                {
                    this.resizeRowHeight(initialHeight, value);
                }
            }
        }
    }
    
    newWidth = this.getElementWidth(target);
    newHeight = this.getElementHeight(target);
    if (newWidth != initialWidth || newHeight != initialHeight)
    {
        //set the information we want to callback with in the resize event and callback
        details = {
            'event': event, 
            'ui': {
                'header': this._getKey(this.m_resizingElement), 
                'oldDimensions' : {
                    'width': initialWidth,
                    'height': initialHeight
                },
                'newDimensions' : {
                    'width': newWidth,
                    'height': newHeight           
                },
                // deprecating this part in 2.1.0
                'size': value
            }
        };    
        this.fireEvent('resize', details);
        
        this.buildCorners();
        // re-align touch affordances
        if (this.m_utils.isTouchDevice())
        {
            this._moveTouchSelectionAffordance();
        }        
    }
    
    this.m_resizingElement = null;
    this.m_resizingElementMin = null;    
};

/**
 * Get the edges (left,right,top,bottom) pixel locations relative to the page
 * @param {Element} elem - the element to find edges of
 * @return {Array.<number>} An array of numbers [leftEdge, topEdge, rightEdge, bottomEdge]
 */
DvtDataGrid.prototype.getHeaderEdgePixels = function(elem)
{
    var elementXY, leftEdge, topEdge, rightEdge, bottomEdge, targetWidth, targetHeight;
    elementXY = this.findPos(elem);
    leftEdge = elementXY[0];
    topEdge = elementXY[1];
    if (this.m_utils.containsCSSClassName(elem, this.getMappedStyle('colheadercell')))
    {
        targetWidth = this.calculateColumnHeaderWidth(elem);
        targetHeight = this.getElementHeight(elem);
    }
    else
    {
        targetWidth = this.getElementWidth(elem);
        targetHeight = this.calculateRowHeaderHeight(elem);
    }
    rightEdge = leftEdge + targetWidth;
    bottomEdge = topEdge + targetHeight;
    return [leftEdge, topEdge, rightEdge, bottomEdge];
};
/**
 * Class used to keep track of whcih elements have been resized, has an object
 * containing two objects 'row' and 'column', which should have objects of
 * index:{size}. this.sizes = {axis:{index:{size}}}
 * @constructor
 * @private
 */
var DvtDataGridSizingManager = function()
{
    this.sizes = {'column': {}, 'row': {}};
};

/**
 * Set a size in the sizes object in the sizing manager
 * @param {string} axis - column/row
 * @param {number|string|null} headerKey - key of the element
 * @param {number} size - the size to put in the object
 */
DvtDataGridSizingManager.prototype.setSize = function(axis, headerKey, size)
{
    this.sizes[axis][headerKey] = size;
};

/**
 * Get a size from the sizing manager for a given axis and index,
 * @param {string} axis - column/row
 * @param {number|string|null} headerKey - key of the element
 * @return {number|null} a size if it exists
 */
DvtDataGridSizingManager.prototype.getSize = function(axis, headerKey)
{
    if (this.sizes[axis].hasOwnProperty(headerKey)) {
        return this.sizes[axis][headerKey];
    }
    return null;
};

/**
 * Empty the sizing manager sizes
 */
DvtDataGridSizingManager.prototype.clear = function()
{
    this.sizes = {'column': {}, 'row': {}};
};
/**
 * @preserve Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * This class contains all utility methods used by the Grid.
 * @param {Object} dataGrid the dataGrid using the utils
 * @constructor
 * @private
 */
var DvtDataGridUtils = function(dataGrid)
{
    this.scrollbarSize = -1;
    this.dataGrid = dataGrid;

    var userAgent = (navigator && navigator.userAgent) ? navigator.userAgent.toLowerCase() : null;

    this.os = this._determineOS(userAgent);
    this.platform = this._determinePlatform(userAgent);
};

// Platform Constants
DvtDataGridUtils.IE_PLATFORM = "ie";
DvtDataGridUtils.GECKO_PLATFORM = "gecko";
DvtDataGridUtils.WEBKIT_PLATFORM = "webkit";
DvtDataGridUtils.UNKNOWN_PLATFORM = "unknown";
DvtDataGridUtils.EDGE_PLATFORM = "edge";

// OS Constants
DvtDataGridUtils.WINDOWS_OS = "Windows";
DvtDataGridUtils.SOLARIS_OS = "Solaris";
DvtDataGridUtils.MAC_OS = "Mac";
DvtDataGridUtils.UNKNOWN_OS = "Unknown";

/**
 * Get the maximum scrollable browser height
 * @returns {Number}
 */
DvtDataGridUtils.prototype._getMaxDivHeightForScrolling = function()
{
    if (this.m_maxDivHeightForScrolling == null)
    {        
        this._setMaxValuesForScrolling();
    }
    return this.m_maxDivHeightForScrolling;
};

/**
 * Get the maximum scrollable browser width
 * @returns {Number}
 */
DvtDataGridUtils.prototype._getMaxDivWidthForScrolling = function() 
{
    if (this.m_maxDivWidthForScrolling == null)
    {        
        this._setMaxValuesForScrolling();
    }
    return this.m_maxDivWidthForScrolling;
};

/**
 * Set the maximum scrollable browser height
 */
DvtDataGridUtils.prototype._setMaxValuesForScrolling = function() 
{
    var div;
    // ie lets the value go forever without actual support, so we hard cap it at 1 million pixels
    if (this.platform === DvtDataGridUtils.IE_PLATFORM || this.platform === DvtDataGridUtils.EDGE_PLATFORM)
    {
        this.m_maxDivHeightForScrolling = 1000000;
        this.m_maxDivWidthForScrolling = 1000000;        
        return;
    }
    
    div = document.createElement("div");    
    div.style.cssText = "width:1000000000px;height:1000000000px;display:none;"; 
    document.body.appendChild(div); //@HTMLUpdateOK
    // for some reason chrome stops rendering absolutely positioned content at half the value on osx
    this.m_maxDivHeightForScrolling = parseInt(parseFloat(window.getComputedStyle(div)['height'])/2, 10);
    this.m_maxDivWidthForScrolling =  parseInt(parseFloat(window.getComputedStyle(div)['width'])/2, 10);
    document.body.removeChild(div); //@HTMLUpdateOK
    return;
};

DvtDataGridUtils.prototype.calculateScrollbarSize = function()
{
    // Create the measurement node
    var scrollDiv = document.createElement("div");
    scrollDiv.style.cssText = "width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;";
    document.body.appendChild(scrollDiv); //@HTMLUpdateOK

    // Get the scrollbar width/height
    this.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // Delete the DIV
    document.body.removeChild(scrollDiv);
};

/**
 * Gets the size of the native scrollbar
 */
DvtDataGridUtils.prototype.getScrollbarSize = function()
{
    if (this.scrollbarSize == -1)
    {
        this.calculateScrollbarSize();
    }
    return this.scrollbarSize;
};

/**
 * Determine if the current agent is touch device
 */
DvtDataGridUtils.prototype.isTouchDevice = function()
{
    if (this.isTouch == undefined)
    {
        var agentName = navigator.userAgent.toLowerCase();
        if (agentName.indexOf("mobile") != -1 || agentName.indexOf("android") != -1)
        {
            this.isTouch = true;
        }
        else
        {
            this.isTouch = false;
        }
    }
    return this.isTouch;
};

/**
 * Copied from AdfDhtmlCommonUtils used in Faces
 * Adds a CSS className to the dom node if it doesn't already exist in the classNames list and
 * returns <code>true</code> if the class name was added.
 * @param {Element|Node|null|undefined} domElement DOM Element to add style class name to
 * @param {string|null} className Name of style class to add
 * @return {boolean|null} <code>true</code> if the style class was added
 */
DvtDataGridUtils.prototype.addCSSClassName = function(domElement, className)
{
    var added, currentClassName, classNameIndex, newClassName;
    added = false;

    if (className != null && domElement != null)
    {
        currentClassName = domElement.className;

        // get the current location of the className to add in the classNames list
        classNameIndex = DvtDataGridUtils._getCSSClassNameIndex(currentClassName, className);

        // the className doesn't exist so add it
        if (classNameIndex == -1)
        {
            newClassName = currentClassName
                    ? className + " " + currentClassName
                    : className;

            domElement.className = newClassName;

            added = true;
        }
    }

    return added;
};

/**
 * Copied from AdfDhtmlCommonUtils used in Faces
 * Removes a CSS className to the dom node if it existd in the classNames list and
 * returns <code>true</code> if the class name was removed.
 * @param {Element|Node|null|undefined} domElement DOM Element to remove style class name from
 * @param {string|null} className Name of style class to remove
 * @return {boolean|null} <code>true</code> if the style class was removed
 */
DvtDataGridUtils.prototype.removeCSSClassName = function(domElement, className)
{
    var removed, currentClassName, classNameIndex, classNameEndIndex, beforestring, afterstring, newClassName;
    removed = false;

    if (className != null && domElement != null)
    {
        currentClassName = domElement.className;

        classNameIndex = DvtDataGridUtils._getCSSClassNameIndex(currentClassName, className);

        // only need to do work if CSS class name is present
        if (classNameIndex != -1)
        {
            classNameEndIndex = classNameIndex + className.length;

            // the new classNames string is the string before our className and leading whitespace plus
            // the string after our className and trailing whitespace
            beforestring = (classNameIndex == 0)
                    ? null
                    : currentClassName.substring(0, classNameIndex);
            afterstring = (classNameEndIndex == currentClassName.length)
                    ? null
                    : currentClassName.substring(classNameEndIndex + 1); // skip space

            if (beforestring == null)
            {
                if (afterstring == null)
                {
                    newClassName = "";
                }
                else
                {
                    newClassName = afterstring;
                }
            }
            else
            {
                if (afterstring == null)
                {
                    newClassName = beforestring;
                }
                else
                {
                    newClassName = beforestring + afterstring;
                }
            }

            domElement.className = newClassName;

            removed = true;
        }
    }

    return removed;
};

/**
 * @param {Element|Node|null|undefined} domElement DOM Element to check for the style <code>className</code>
 * @param {string} className the CSS className to check for
 * @return {boolean} <code>true</code> if the className is in the element's list of classes
 */
DvtDataGridUtils.prototype.containsCSSClassName = function(domElement, className)
{
    if (className != null && domElement != null)
    {
        return DvtDataGridUtils._getCSSClassNameIndex(domElement.className, className) != -1;
    }
    return false;
};

/**
 * Copied from AdfDhtmlCommonUtils used in Faces
 * Returns the index at which <code>className</code> appears within <code>currentClassName</code>
 * with either a space or the beginning or end of <code>currentClassName</code> on either side.
 * This function optimizes the runtime speed by not creating objects in most cases and assuming
 * 1) It is OK to only check for spaces as whitespace characters
 * 2) It is rare for the searched className to be a substring of another className, therefore
 *    if we get a hit on indexOf, we have almost certainly found our className
 * 3) It is even rarer for the searched className to be a substring of more than one className,
 *    therefore, repeating the search from the end of the string should almost always either return
 *    our className or the original search hit from indexOf
 * @param {string} currentClassName Space-separated class name string to search
 * @param {string} className string to search for within currentClassName
 * @return {number} index of className in currentClassName, or -1 if it doesn't exist
 */
DvtDataGridUtils._getCSSClassNameIndex = function(currentClassName, className)
{
    var classNameLength, currentClassNameLength, nameIndex, hasStart, endIndex, hasEnd, lastNameIndex;
    // if no current class
    // SVG element className property is not of type string
    if (!currentClassName || !currentClassName.indexOf)
    {
        return -1;
    }

    // if the strings are equivalent, then the start index is the beginning of the string
    if (className === currentClassName)
    {
        return 0;
    }

    classNameLength = className.length;
    currentClassNameLength = currentClassName.length;

    // check if our substring exists in the string at all
    nameIndex = currentClassName.indexOf(className);

    // if our substring exists then our class exists if either:
    // 1) It is at the beginning of the classNames string and has a following space
    // 2) It is at the end of the classNames string and has a leading space
    // 3) It has a space on either side
    if (nameIndex >= 0)
    {
        hasStart = (nameIndex == 0) || (currentClassName.charAt(nameIndex - 1) == " ");
        endIndex = nameIndex + classNameLength;
        hasEnd = (endIndex == currentClassNameLength) || (currentClassName.charAt(endIndex) == " ");

        //one of the three condition above has been met so our string is in the parent string
        if (hasStart && hasEnd)
        {
            return nameIndex;
        }

        // our substring exists in the parent string but didn't meet the above conditions,  Were
        // going to be lazy and retest, searchig for our substring from the back of the classNames
        // string
        lastNameIndex = currentClassName.lastIndexOf(className);

        // if we got the same index as the search from the beginning then we aren't in here
        if (lastNameIndex != nameIndex)
        {
            // recheck the three match cases
            hasStart = currentClassName.charAt(lastNameIndex - 1);
            endIndex = lastNameIndex + classNameLength;
            hasEnd = (endIndex == currentClassNameLength) || (currentClassName.charAt(endIndex) == " ");

            if (hasStart && hasEnd)
            {
                return lastNameIndex;
            }

            // this should only happen if the searched for className is a substring of more
            // than one className in the classNames list, so it is OK for this to be slow.  We
            // also know at this point that we definitely didn't get a match at either the very
            // beginning or very end of the classNames string, so we can safely append spaces
            // at either end
            return currentClassName.indexOf(" " + className + " ");

        }
    }


    // no match
    return -1;


};

/**
 * Returns either the ctrl key or the command key in Mac OS
 * @param {Event} event
 */
DvtDataGridUtils.prototype.ctrlEquivalent = function(event)
{
    var isMac = (this.os === DvtDataGridUtils.MAC_OS);
    return (isMac ? event.metaKey : event.ctrlKey);
};

/**
 * Gets the scroll left of an element.  This method abstracts the inconsistency of scrollLeft
 * behavior in RTL mode between browsers.
 * @param {Element} element the dom element to retrieve scroll left
 * @private
 */
DvtDataGridUtils.prototype.getElementScrollLeft = function(element)
{
    var width, elemWidth;
    if (this.dataGrid.getResources().isRTLMode())
    {
        // see mozilla Bug 383026 scrollLeft property now returns negative values in rtl environment
        if (this.platform == DvtDataGridUtils.GECKO_PLATFORM || this.platform == DvtDataGridUtils.IE_PLATFORM || this.platform == DvtDataGridUtils.EDGE_PLATFORM)
        {
            return Math.abs(element['scrollLeft']);
        }
        else
        {
            // webkit browser
            width = this.dataGrid.getScrollableWidth();
            elemWidth = element['clientWidth'];
            return Math.max(0, width - elemWidth - element['scrollLeft']);
        }
    }

    return element['scrollLeft'];

};

/**
 * Sets the scroll left of an element.  This method abstracts the inconsistency of scrollLeft
 * behavior in RTL mode between browsers.
 * @param {Element} element the dom element to set scroll left
 * @param {number} scrollLeft the scroll left of the dom element
 * @private
 */
DvtDataGridUtils.prototype.setElementScrollLeft = function(element, scrollLeft)
{
    var width, elemWidth, newPos;
    if (this.dataGrid.getResources().isRTLMode())
    {
        if (this.platform === DvtDataGridUtils.GECKO_PLATFORM)
        {
            // see mozilla Bug 383026 scrollLeft property now returns negative values in rtl environment
            element['scrollLeft'] = -scrollLeft;
        }
        else if (this.platform == DvtDataGridUtils.IE_PLATFORM || this.platform == DvtDataGridUtils.EDGE_PLATFORM)
        {
            element['scrollLeft'] = scrollLeft;
        }
        else
        {
            // webkit based browsers
            width = this.dataGrid.getScrollableWidth();
            elemWidth = element['clientWidth'];
            newPos = width - elemWidth - scrollLeft;
            element['scrollLeft'] = newPos;
        }
    }
    else
    {
        element['scrollLeft'] = scrollLeft;
    }
};

/**
 * Determines the operating system. This value should be cached to prevent costly calculations. This value should be
 * treated as a guess, as this code is copied from AdfAgent.guessOS().
 * @param {string|null} userAgent The lowercase user agent string, if available.
 * @return {string} The DvtDataGridUtils.***_OS constant describing the platform.
 * @private
 */
DvtDataGridUtils.prototype._determineOS = function(userAgent)
{
    if (userAgent)
    {
        if (userAgent.indexOf('win') != -1)
        {
            return DvtDataGridUtils.WINDOWS_OS;
        }
        else if (userAgent.indexOf('mac') != -1)
        {
            return DvtDataGridUtils.MAC_OS;
        }
        else if (userAgent.indexOf('sunos') != -1)
        {
            return DvtDataGridUtils.SOLARIS_OS;
        }
    }

    return DvtDataGridUtils.UNKNOWN_OS;
};

/**
 * Determines the name of the platform. This value should be cached to prevent costly calculations.
 * Copied from DvtAgent (which itself is copied from AdfAgent)
 * @param {string|null} userAgent The lowercase user agent string, if available.
 * @return {string} The DvtDataGridUtils.***_PLATFORM constant describing the platform.
 * @private
 */
DvtDataGridUtils.prototype._determinePlatform = function(userAgent)
{
    if (userAgent)
    {
        if (userAgent.indexOf("opera") != -1) // check opera first, since it mimics other browsers
        {
            return DvtDataGridUtils.UNKNOWN_PLATFORM;
        }
        else if (userAgent.indexOf("trident") != -1 || userAgent.indexOf("msie") != -1)
        {
            return DvtDataGridUtils.IE_PLATFORM;
        }
        else if (userAgent.indexOf("edge") != -1)
        {
            return DvtDataGridUtils.EDGE_PLATFORM;            
        }
        else if ((userAgent.indexOf("applewebkit") != -1) || (userAgent.indexOf("safari") != -1))
        {
            return DvtDataGridUtils.WEBKIT_PLATFORM;
        }
        else if (userAgent.indexOf("gecko/") != -1)
        {
            return DvtDataGridUtils.GECKO_PLATFORM;
        }
    }

    return DvtDataGridUtils.UNKNOWN_PLATFORM;
};

/**
 * Determines the what mousewheel event the browser recognizes
 * All modern browsers support wheel event
 * @return {string} The event which the browser uses to track mosuewheel events
 * @private
 */
DvtDataGridUtils.prototype.getMousewheelEvent = function()
{
    return "wheel";
};

/**
 * The standard wheel event and WheelEvent API now uses deltaMode and just deltaX and deltaY as the
 * properties for determining scroll.
 * @param {Event} event the mousewheel scroll event
 * @return {Object} change in X and Y if applicable through a mousewheel event, properties are deltaX, deltaY
 * @private
 */
DvtDataGridUtils.prototype.getMousewheelScrollDelta = function(event)
{
    var deltaX = 0, deltaY = 0, deltaMode, scrollConstant;
    deltaMode = event['deltaMode'];
    if (deltaMode == event['DOM_DELTA_PIXEL'])
    {
         scrollConstant = -1;
    }
    else if (deltaMode == event['DOM_DELTA_LINE'] || deltaMode == event['DOM_DELTA_PAGE'])
    {
        // only on firefox now, we will scroll 40 times the number of lines they
        // they want to scroll
         scrollConstant = -40;
    }        
    deltaX = event['deltaX'] * scrollConstant;
    deltaY = event['deltaY'] * scrollConstant;        

    return {"deltaX": deltaX, "deltaY": deltaY};
};

/**
 * Empty out (clear all children and attributes) from an element
 * @param {Element} elem the dom element to empty out
 * @private
 */
DvtDataGridUtils.prototype.empty = function(elem)
{
    while (elem.firstChild)
    {
        this.dataGrid._remove(elem.firstChild);
    }
};

/**
 * Does the browser support transitions
 * @private
 */
DvtDataGridUtils.prototype.supportsTransitions = function() {
    var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition',
            ieBefore11 = /MSIE \d/.test(navigator.userAgent) &&
            (document.documentMode == null || document.documentMode < 11);

    if (ieBefore11)
    {
        return false;
    }

    if (typeof s[p] == 'string') {
        return true;
    }

    // Tests for vendor specific prop
    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (var i = 0; i < v.length; i++)
    {
        if (typeof s[v[i] + p] == 'string') {
            return true;
        }
    }

    return false;
};

/**
 * Return whether the node is editable or clickable
 * @param {Node|Element} node Node
 * @param {Element} databody Databody
 * @return {boolean} true or false
 * @private
 */
DvtDataGridUtils.prototype._isNodeEditableOrClickable = function(node, databody)
{
    var nodeName, tabIndex, origTabIndex;
    while (null != node && node != databody)
    {
        nodeName = node.nodeName;

        // If the node is a text node, move up the hierarchy to only operate on elements
        // (on at least the mobile platforms, the node may be a text node)
        if (node.nodeType == 3) // 3 is Node.TEXT_NODE
        {
            node = node.parentNode;
            continue;
        }

        tabIndex = parseInt(node.getAttribute('tabIndex'), 10);
        // datagrid overrides the tab index, so we should check if the data-oj-tabindex is populated
        origTabIndex = parseInt(node.getAttribute(this.dataGrid.getResources().getMappedAttribute('tabindex')), 10);

        if (tabIndex != null && tabIndex >= 0)
        {
            if (this.containsCSSClassName(node, this.dataGrid.getResources().getMappedStyle('cell'))
                    || this.containsCSSClassName(node, this.dataGrid.getResources().getMappedStyle('headercell'))
                    || this.containsCSSClassName(node, this.dataGrid.getResources().getMappedStyle('endheadercell')))
            {
                // this is the cell element
                return false;
            }
            else
            {
                return true;
            }
        }
        else if (nodeName.match(/^INPUT|SELECT|OPTION|BUTTON|^A\b|TEXTAREA/))
        {
            // ignore elements with tabIndex == -1
            if (tabIndex != -1 || origTabIndex != -1)
            {
                return true;
            }
        }
        node = node.parentNode;
    }
    return false;
};

/**
 * On certain browser the outline is postioned differently and requires offset. Chrome/Safari on Mac.
 * @return {boolean} true if the outline needs to be offset
 * @private
 */
DvtDataGridUtils.prototype.shouldOffsetOutline = function()
{
    if (this.os == DvtDataGridUtils.MAC_OS && this.platform == DvtDataGridUtils.WEBKIT_PLATFORM)
    {
        return true;
    }
    return false;
};
/**
 * The DvtDataGridOptions object provides convenient methods to access the options passed to the Grid.
 * @param {Object=} options -options set on the grid.
 * @constructor
 * @private
 */
var DvtDataGridOptions = function(options)
{
    this.options = options;
};

/**
 * Helper method to extract properties
 * @param {string=} arg1 - key to extract in object
 * @param {string=} arg2 - key to extract in the value of object[arg1]
 * @param {string=} arg3 - key to extract in the value of object[arg1][arg2]
 * @param {string=} arg4 - key to extract in the value of object[arg1][arg2][arg3]
 * @return {string|number|Object|boolean|null}
 */
DvtDataGridOptions.prototype.extract = function(arg1, arg2, arg3, arg4)
{
    var val1, val2, val3;
    if (arg1 != null)
    {
        val1 = this.options[arg1];
        if (arg2 != null && val1 != null)
        {
            val2 = val1[arg2];
            if (arg3 != null && val2 != null)
            {
                val3 = val2[arg3];
                if (arg4 != null && val3 != null)
                {
                    return val3[arg4];
                }
                return val3;
            }
            return val2;
        }
        return val1;
    }
    return null;
};

/**
 * Evaluate the a function, if it is a constant return it
 * @param {string|number|Object|boolean|null} value - function or string of the raw property
 * @param {Object} obj - object to pass into value if it is a function
 * @return {string|number|Object|boolean|null} the evaluated value(obj) if value a function, else return value
 */
DvtDataGridOptions.prototype.evaluate = function(value, obj)
{
    if (typeof value == 'function')
    {
        return value.call(this, obj);
    }
    return value;
};

/**
 * Get the property that was set on the option
 * @param {string} prop - the property to get from options
 * @param {string|undefined} axis - subobject to get row/column/cell/rowEnd/columnEnd
 * @return {string|number|Object|boolean|null} the raw value of the property
 */
DvtDataGridOptions.prototype.getRawProperty = function(prop, axis)
{
    var arg1, arg2, arg3;
    if (axis == "row" || axis == "column" || axis == "rowEnd" || axis == "columnEnd")
    {
        arg1 = "header";
        arg2 = axis;
        arg3 = prop;
    }
    else if (axis == "cell")
    {
        arg1 = "cell";
        arg2 = prop;
    }

    return this.extract(arg1, arg2, arg3);
};

/**
 * Get the evaluated property of the options
 * @param {string} prop - the property to get from options
 * @param {string=} axis - subobject to get row/column/cell
 * @param {Object=} obj - object to pass into property if it is a function
 * @return the evaluated property
 */
DvtDataGridOptions.prototype.getProperty = function(prop, axis, obj)
{
    if (obj === undefined)
    {
        return this.extract(prop, axis);
    }
    else
    {
        return this.evaluate(this.getRawProperty(prop, axis), obj);
    }
};

/**
 * Get the null or default value if no value set
 * @param {string|number|Object|boolean|null} value - the value of the property
 * @param {boolean|null} defValue - the default value of the property
 * @return {string|number|Object|boolean|null} - value if not null, defValue if value is null, null if neither null
 */
DvtDataGridOptions.prototype.nullOrDefault = function(value, defValue)
{
    if (value != null)
    {
        return value;
    }
    if (defValue != null)
    {
        return defValue;
    }
    return null;
};

////////////////////////// Grid options /////////////////////////////////

/**
 * Get the row banding interval from the grid options
 * @return {string|number|Object|boolean} the row banding interval
 */
DvtDataGridOptions.prototype.getRowBandingInterval = function()
{
    var bandingInterval = this.getProperty("bandingInterval", "row");
    if (bandingInterval != null)
    {
        return bandingInterval;
    }
    return 0;
};

/**
 * Get the column banding interval from the grid options
 * @return {string|number|Object|boolean} the column banding interval
 */
DvtDataGridOptions.prototype.getColumnBandingInterval = function()
{
    var bandingInterval = this.getProperty("bandingInterval", "column");
    if (bandingInterval != null)
    {
        return bandingInterval;
    }
    return 0;
};

/**
 * Get the empty text from the grid options
 * @return {string|number|Object|boolean|null} the empty text
 */
DvtDataGridOptions.prototype.getEmptyText = function()
{
    return this.getProperty("emptyText");
};

/**
 * Get the horizontal gridlines from the grid options
 * @return {string|number|Object|boolean|null} horizontal gridlines visible/hidden
 */
DvtDataGridOptions.prototype.getHorizontalGridlines = function()
{
    var horizontalGridlines;
    horizontalGridlines = this.extract("gridlines", "horizontal");
    if (horizontalGridlines != null)
    {
        return horizontalGridlines;
    }
    return "visible";
};

/**
 * Get the vertical gridlines from the grid options
 * @return {string|number|Object|boolean|null} vertical gridlines visible/hidden
 */
DvtDataGridOptions.prototype.getVerticalGridlines = function()
{
    var verticalGridlines;
    verticalGridlines = this.extract("gridlines", "vertical");
    if (verticalGridlines != null)
    {
        return verticalGridlines;
    }
    return "visible";
};

/**
 * Get the inital row scroll position from the grid options
 * @return {string|number|Object|boolean|null} index or key of the row to show
 */
DvtDataGridOptions.prototype.getRowScrollPosition = function()
{
    var rowScrollPosition;
    rowScrollPosition = this.extract("scrollPosition", "key", "row");
    if (rowScrollPosition != null)
    {
        return rowScrollPosition;
    }
    return this.extract("scrollPosition", "index", "row");
};

/**
 * Get the inital column scroll position from the grid options
 * @return {string|number|Object|boolean|null} index or key of the column to show
 */
DvtDataGridOptions.prototype.getColumnScrollPosition = function()
{
    var columnScrollPosition;
    columnScrollPosition = this.extract("scrollPosition", "key", "column");
    if (columnScrollPosition != null)
    {
        return columnScrollPosition;
    }
    return this.extract("scrollPosition", "index", "column");
};

/**
 * Get the inital column scroll position from the grid options
 * @return {string|number|Object|boolean|null} index or key of the column to show
 */
DvtDataGridOptions.prototype.getScrollPositionMode = function()
{
    var scrollPosition;
    scrollPosition = this.getProperty("scrollPosition");
    if (scrollPosition == undefined)
    {
        return null;
    }
    if (scrollPosition['key'] != undefined)
    {
        return 'key';
    }
    if (scrollPosition['index'] != undefined)
    {
        return 'index';
    }
    return null;
};

/**
 * Get the selection mode cardinality (none, single multiple)
 * @return {string|number|Object|boolean|null} none/single/multiple
 */
DvtDataGridOptions.prototype.getSelectionCardinality = function()
{
    var mode, key, val;
    mode = this.getProperty("selectionMode");
    if (mode == undefined)
    {
        return "none";
    }

    key = this.getSelectionMode();
    val = mode[key];
    if (val != null)
    {
        return val;
    }
    return "none";
};

/**
 * Get the selection mode (row,cell)
 * @return {string|number|Object|boolean|null} row/cell
 */
DvtDataGridOptions.prototype.getSelectionMode = function()
{
    var mode, cardinality;
    mode = this.getProperty("selectionMode");
    if (mode == undefined)
    {
        return "cell";
    }

    cardinality = mode['row'];
    if (cardinality != null && cardinality != "none")
    {
        return "row";
    }
    return "cell";
};

/**
 * Get the current selection from the grid options
 * @return {Array|null} the current selection from options
 */
DvtDataGridOptions.prototype.getSelection = function()
{
    return this.getProperty("selection");
};

/**
 * Get the current cell from the grid options
 * @return {Object|null} the current cell from options
 */
DvtDataGridOptions.prototype.getCurrentCell = function()
{
    return this.getProperty("currentCell");
};

/**
 * Get the editMode (none,cell)
 * @return {string|number|Object|boolean|null} default/enter
 */
DvtDataGridOptions.prototype.getEditMode = function()
{
    return this.getProperty("editMode");
};
////////////////////////// Grid header/cell options /////////////////////////////////
/**
 * Is the given header sortable
 * @param {string} axis - axis to check if sort enabled
 * @param {Object} obj - header context
 * @return {string|number|Object|boolean|null} default or null
 */
DvtDataGridOptions.prototype.isSortable = function(axis, obj)
{
    return this.nullOrDefault(this.getProperty("sortable", axis, obj), false);
};

/**
 * Is the given header resizable
 * @param {string} axis - axis to check if resizing enabled
 * @param {string} dir - width/height
 * @return {string|number|Object|boolean|null} enable, disable, or null
 */
DvtDataGridOptions.prototype.isResizable = function(axis, dir, obj)
{
    var v = this.extract('header', axis, 'resizable', dir);
    if (obj != undefined)
    {
        return this.evaluate(v, obj);
    }
    return v;
};

/**
 * Gets the dnd rorderable option
 * @param {string} axis the axis to get the reorder property from
 * @return {string|number|Object|boolean|null} enable, disable, or null
 */
DvtDataGridOptions.prototype.isMoveable = function(axis)
{
    return this.nullOrDefault(this.extract("dnd", "reorder", axis), false);
};

/**
 * Get the inline style property on an object
 * @param {string} axis - axis to get style of
 * @param {Object} obj - context
 * @return {string|number|Object|boolean|null} inline style
 */
DvtDataGridOptions.prototype.getInlineStyle = function(axis, obj)
{
    return this.getProperty("style", axis, obj);
};

/**
 * Get the style class name property on an object
 * @param {string} axis - axis to get class name of
 * @param {Object} obj - context
 * @return {string|number|Object|boolean|null} class name
 */
DvtDataGridOptions.prototype.getStyleClass = function(axis, obj)
{
    return this.getProperty("className", axis, obj);
};

/**
 * Get the renderer of an axis
 * @param {string} axis - axis to get style of
 * @return {string|number|Object|boolean|null} axis renderer
 */
DvtDataGridOptions.prototype.getRenderer = function(axis)
{
    // return type expected to be function, so just return without further
    // evaluation
    return this.getRawProperty("renderer", axis);
};

/**
 * Get the scroll mode
 * @return {string} the scroll mode, which can be either "scroll", "loadMoreOnScroll", "auto".
 */
DvtDataGridOptions.prototype.getScrollPolicy = function()
{
    var mode = this.getProperty("scrollPolicy");
    if (mode == null)
    {
        mode = "auto";
    }

    return mode;
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
 *       <td>The axis of the header.  Possible values are 'row', 'column', 'rowEnd', and 'columnEnd'.</td>
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
 *       <td><kbd>cell</kbd></td>
 *       <td>An object containing attribute data which should be used to reference the data in the cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>data</kbd></td>
 *       <td>The plain data for the cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>parentElement</kbd></td>
 *       <td>The data cell element.  The renderer can use this to directly append content to the data cell element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>mode</kbd></td>
 *       <td>The current mode of the datagrid. Values are navigation and edit.</td>
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
 * 
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class(es)</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-datagrid-cell-text, oj-datagrid-header-cell-text</td>
 *       <td><p>Used to style databody and header cell text respectively stamped in the datagrid using a custom renderer or template.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the stamped text element.</li>
 *           </ul>
 *     </tr>
 *     <tr>
 *       <td>oj-datagrid-cell-no-padding</td>
 *       <td><p>Used to style a datagrid cell so that it has no padding. An app developer would likely use
 *       this in the case of editable datagrids when an editable cell content does not need the default cell padding.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the datagrid cell.</li>
 *           </ul>
 *     </tr>
 *     <tr>
 *       <td>oj-datagrid-cell-padding</td>
 *       <td><p>Used to style a datagrid cell so that it has the default padding. An app developer would likely use
 *       this in the case of editable datagrids when an editable cell content needs to maintain default cell padding.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the datagrid cell.</li>
 *           </ul>
 *     </tr>
 *   </tbody>
 * </table> 
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
                * Determine if the grid is read only or editable. 
                * Use 'none' if the grid is strictly read only.
                * 
                * Use 'cellNavigation' if you want editable cells, but the grid is currently read only and a single tab stop on the page.
                * Pressing F2 or double click while in this mode will switch to 'cellEdit' mode.
                * 
                * Use 'cellEdit' if you want editable cells, and tab navigates to the next cell behavior.
                * Pressing ESC while in this mode will switch to 'cellNavigation' mode.
                *
                * @expose
                * @memberof! oj.ojDataGrid
                * @instance 
                * @type {string}
                * @default <code class="prettyprint">"none"</code>
                * @ojvalue {string} "none" the grid is read only
                * @ojvalue {string} "cellNavigation" the grid is a single tab stop and editable at the cell level, but currently read only
                * @ojvalue {string} "cellEdit" the grid cells are indivdually tabbable and editable
                *
                * @example <caption>Initialize the data grid with cell editing enabled:</caption>
                * $( ".selector" ).ojDataGrid({ "data":data, "editMode": "cell"});
                *
                */
                editMode: "none",                
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
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "header.row.renderer" );
                         *
                         * // set the renderer function
                         * $( ".selector" ).ojDataGrid( "option", "header.row.renderer", myFunction});
                         */
                        renderer: null,
                        /**
                         * Enable or disable width or height resize along the row headers. Note
                         * that for row header, a function cannot be used with "width".
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
                     * The header column option contains a subset of options for column headers.
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
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "header.column.renderer" );
                         *
                         * // set the renderer function
                         * $( ".selector" ).ojDataGrid( "option", "header.column.renderer", myFunction});
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
                    },
                    /**
                     * The header columnEnd option contains a subset of options for column end headers.
                     *
                     * @expose
                     * @alias header.columnEnd
                     * @memberof! oj.ojDataGrid
                     * @instance
                     */
                    columnEnd: {
                        /**
                         * The CSS style class to apply to column end headers in the data grid. If a string is specified
                         * the class will be added to all column end header cells.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string to be set as a className.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.columnEnd.className
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with column end header style calss set to 'chstyle':</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "columnEnd": {"className":"chstyle"} } });
                         *
                         * @example <caption>Get or set the <code class="prettyprint">className</code> option, after initialization:</caption>
                         * // get the className string
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "header.columnEnd.className" );
                         *
                         * // set the className string to a function of the headerContext
                         * $( ".selector" ).ojDataGrid( "option", "header.columnEnd.className", function(headerContext){return headerContext['index'] % 2 == 0 ? 'even':'odd'}});
                         */
                        className: null,
                        /**
                         * The renderer function that renders the content of the column end header. See <a href="#context-section">headerContext</a>
                         * in the introduction to see the object passed into the column end header renderer function.
                         * The function returns either a String or a DOM element of the content inside the column end header.
                         * If the developer chooses to manipulate the column end header element directly, the function should return
                         * nothing. If no renderer is specified, the Grid will treat the header data as a String.
                         *
                         * @expose
                         * @alias header.columnEnd.renderer
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with column end header renderer that capitalizes each character in the column end header cells:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "columnEnd": {"renderer": function(headerContext) {
                         *                                            return headerContext['key'].toUpperCase();}}}});
                         *
                         * @example <caption>Get or set the <code class="prettyprint">renderer</code> option, after initialization:</caption>
                         * // get the renderer function
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "header.columnEnd.renderer" );
                         *
                         * // set the renderer function
                         * $( ".selector" ).ojDataGrid( "option", "header.columnEnd.renderer", myFunction});
                         */
                        renderer: null,
                        /**
                         * Enable or disable width or height resize along the column end headers. Note
                         * that for column end header, a function cannot be used with "height".
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string of enable or disable.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.columnEnd.resizable
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {Object.<string, string>|Object.<string, function(Object)>|null}
                         * @default <code class="prettyprint">{"width": "disable", "height": "disable"}</code>
                         * @property {string} width column end header width resizable valid values are: "enable", "disable"
                         * @property {string} height column end header height resizable valid values are: "enable", "disable"
                         *
                         * @example <caption>Initialize the data grid with column end header width resizable only:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "columnEnd": {"resizable": {"width":"enable"}}}});
                         *
                         * @example <caption>Initialize the data grid with every other column end header width resizable:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "columnEnd": {"resizable": {"width":function(headerContext){ return headerContext['index'] % 2 === 0 ? 'enable':'disable'; }}}}});
                         */
                        resizable: {'width': 'disable', 'height': 'disable'},
                        /**
                         * The inline style to apply to column end headers in the data grid. If a string is specified
                         * the class will be added to all column end header cells.  Note that % width/height value is not supported.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.columnEnd.style
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with column end headers to have green backgrounds:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "columnEnd": {style: "background-color: green"}}});
                         *
                         * @example <caption>Initialize the data grid with every other columnEnd header to have a green background:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "columnEnd": {style: function(headerContext) {
                         *                                            if (headerContext['index'] % 2 === 0)
                         *                                               return "background-color: green";
                         *                                            return;}}}});
                         */
                        style: null
                        /**
                         * The knockout template used to render the content of the column end header.
                         *
                         * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
                         * component option.
                         *
                         * @ojbindingonly
                         * @name header.columnEnd.template
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Specify the column end header <code class="prettyprint">template</code> when initializing DataGrid:</caption>
                         * // set the template
                         * &lt;ul id="datagrid" data-bind="ojComponent: {component: 'ojDataGrid', data: dataSource, header: { columnEnd: {template: 'my_template'}}}"&gt;&lt;/ul&gt;
                         */
                    },
                    /**
                     * The header rowEnd option contains a subset of options for row end headers.
                     *
                     * @expose
                     * @alias header.rowEnd
                     * @memberof! oj.ojDataGrid
                     * @instance
                     */
                    rowEnd: {
                        /**
                         * The CSS style class to apply to row end headers in the data grid. If a string is specified
                         * the class will be added to all row end header cells.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string to be set as a className.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.rowEnd.className
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with row end header style calss set to 'chstyle':</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "rowEnd": {"className":"chstyle"} } });
                         *
                         * @example <caption>Get or set the <code class="prettyprint">className</code> option, after initialization:</caption>
                         * // get the className string
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "header.rowEnd.className" );
                         *
                         * // set the className string to a function of the headerContext
                         * $( ".selector" ).ojDataGrid( "option", "header.rowEnd.className", function(headerContext){return headerContext['index'] % 2 == 0 ? 'even':'odd'}});
                         */
                        className: null,
                        /**
                         * The renderer function that renders the content of the row end header. See <a href="#context-section">headerContext</a>
                         * in the introduction to see the object passed into the row end header renderer function.
                         * The function returns either a String or a DOM element of the content inside the row end header.
                         * If the developer chooses to manipulate the row end header element directly, the function should return
                         * nothing. If no renderer is specified, the Grid will treat the header data as a String.
                         *
                         * @expose
                         * @alias header.rowEnd.renderer
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with row end header renderer that capitalizes each character in the row end header cells:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "rowEnd": {"renderer": function(headerContext) {
                         *                                            return headerContext['key'].toUpperCase();}}}});
                         *
                         * @example <caption>Get or set the <code class="prettyprint">renderer</code> option, after initialization:</caption>
                         * // get the renderer function
                         * var bandingInterval = $( ".selector" ).ojDataGrid( "option", "header.rowEnd.renderer" );
                         *
                         * // set the renderer function
                         * $( ".selector" ).ojDataGrid( "option", "header.rowEnd.renderer", myFunction});
                         */
                        renderer: null,
                        /**
                         * Enable or disable width or height resize along the row end headers. Note
                         * that for row end header, a function cannot be used with "width".
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string of enable or disable.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.rowEnd.resizable
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {Object.<string, string>|Object.<string, function(Object)>|null}
                         * @default <code class="prettyprint">{"width": "disable", "height": "disable"}</code>
                         * @property {string} width row end header width resizable valid values are: "enable", "disable"
                         * @property {string} height row end header height resizable valid values are: "enable", "disable"
                         *
                         * @example <caption>Initialize the data grid with row end header height resizable only:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "rowEnd": {"resizable": {"height":"enable"}}}});
                         *
                         * @example <caption>Initialize the data grid with every other row end header height resizable:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "rowEnd": {"resizable": {"height":function(headerContext){ return headerContext['index'] % 2 === 0 ? 'enable':'disable'; }}}}});
                         */
                        resizable: {'width': 'disable', 'height': 'disable'},
                        /**
                         * The inline style to apply to row end headers in the data grid. If a string is specified
                         * the class will be added to all row end header cells.  Note that % width/height value is not supported.
                         * A function can be specified with this option.  The function would take a single parameter, headerContext, and must return
                         * a string.  See <a href="#context-section">headerContext</a> for details.
                         *
                         * @expose
                         * @alias header.rowEnd.style
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {function(Object)|string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Initialize the data grid with row end headers to have green backgrounds:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "rowEnd": {style: "background-color: green"}}});
                         *
                         * @example <caption>Initialize the data grid with every other rowEnd header to have a green background:</caption>
                         * $( ".selector" ).ojDataGrid({ "data":data, "header": { "rowEnd": {style: function(headerContext) {
                         *                                            if (headerContext['index'] % 2 === 0)
                         *                                               return "background-color: green";
                         *                                            return;}}}});
                         */
                        style: null
                        /**
                         * The knockout template used to render the content of the row end header.
                         *
                         * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
                         * component option.
                         *
                         * @ojbindingonly
                         * @name header.rowEnd.template
                         * @memberof! oj.ojDataGrid
                         * @instance
                         * @type {string|null}
                         * @default <code class="prettyprint">null</code>
                         *
                         * @example <caption>Specify the row end header <code class="prettyprint">template</code> when initializing DataGrid:</caption>
                         * // set the template
                         * &lt;ul id="datagrid" data-bind="ojComponent: {component: 'ojDataGrid', data: dataSource, header: { rowEnd: {template: 'my_template'}}}"&gt;&lt;/ul&gt;
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
                     * $( ".selector" ).ojDataGrid( "option", "cell.className", function(cellContext){return cellContext['indexes']['row'] % 2 == 0 ? 'even':'odd'}});
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
                     *                                            return cellContext['cell']['data'].toUpperCase();}}});
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
                     *                                            if (cellContext['indexes']['column'] % 2 === 0)
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
                     * @type {function(Object)|string|null}
                     * @default <code class="prettyprint">null</code>
                     *
                     * @example <caption>Specify the cell <code class="prettyprint">template</code> when initializing DataGrid:</caption>
                     * $( ".selector" ).ojDataGrid({ "data":data, "cell": {"template": 'my_template' }});
                     * 
                     * @example <caption>Initialize the data grid with a edit and a navigation template:</caption>
                     * $( ".selector" ).ojDataGrid({ "data":data, "cell": {"template": function(cellContext){return (cellContext['mode'] === 'edit') ? 'editTemplate' : 'navigationTemplate';} }});
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
                 * $( ".selector" ).on( "ojresize", function( event, ui ) {
                 *      // verify that the component firing the event is a component of interest 
                 *      if ($(event.target).is(".mySelector"))
                 * });
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
                 * $( ".selector" ).on( "ojsort", function( event, ui ) {
                 *      // verify that the component firing the event is a component of interest 
                 *      if ($(event.target).is(".mySelector"))
                 * });
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
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojoptionchange</code> event:</caption>
                 * $( ".selector" ).on( "ojoptionchange", function( event, ui ) {
                 *      // verify that the component firing the event is a component of interest 
                 *      if ($(event.target).is(".mySelector"))
                 * });
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
                 * $( ".selector" ).on( "ojready", function( event, ui ) {
                 *      // verify that the component firing the event is a component of interest 
                 *      if ($(event.target).is(".mySelector"))
                 * });
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
                 * $( ".selector" ).on( "ojscroll", function( event, ui ) {
                 *      // verify that the component firing the event is a component of interest 
                 *      if ($(event.target).is(".mySelector"))
                 * });
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
                 * $( ".selector" ).on( "ojbeforecurrentcell", function( event, ui ) {
                 *      // verify that the component firing the event is a component of interest 
                 *      if ($(event.target).is(".mySelector"))
                 * });
                */
                beforeCurrentCell: null, 
                 
                /**
                 * Triggered before the data grid is going to enter edit mode. To prevent editing the cell return false.
                 *
                 * @expose
                 * @event
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @property {Event} event <code class="prettyprint">jQuery</code> event object that caused the edit
                 * @property {Object} ui Parameters
                 * @property {Object} ui.cellContext the cellContext of the cell that editing is going to be performed on  
                 *
                 * @example <caption>Initialize the data grid with the <code class="prettyprint">beforeEdit</code> callback specified:</caption>
                 * $( ".selector" ).ojDataGrid({
                 *     "beforeEdit": function( event, ui ) {}
                 * });
                 *
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeedit</code> event:</caption>
                 * $( ".selector" ).on( "ojbeforeedit", function( event, ui ) {
                 *      // verify that the component firing the event is a component of interest 
                 *      if ($(event.target).is(".mySelector"))
                 * });
                 */
                beforeEdit: null,
                
                /**
                 * Triggered before the data grid is going to exit edit mode. To prevent exit editing the return false.
                 * There is a provided beforeEditEnd function,  oj.DataCollectionEditUtils.basicHandleEditEnd, which can be specified.
                 * This function will handle canceling edits as well as invoking validation on input components.
                 *
                 * @expose
                 * @event
                 * @memberof! oj.ojDataGrid
                 * @instance
                 * @property {Event} event <code class="prettyprint">jQuery</code> event object that caused the edit
                 * @property {Object} ui Parameters
                 * @property {Object} ui.cellContext the cellContext of the cell that editing is going to be performed on  
                 * @property {boolean} ui.cancelEdit true if the edit should be negated based on actions (i.e. escape key)
                 *
                 * @example <caption>Initialize the data grid with the <code class="prettyprint">beforeEditEnd</code> callback specified:</caption>
                 * $( ".selector" ).ojDataGrid({
                 *     "beforeEditEnd": function( event, ui ) {}
                 * });
                 *
                 * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeeditend</code> event:</caption>
                 * $( ".selector" ).on( "ojbeforeeditend", function( event, ui ) {
                 *      // verify that the component firing the event is a component of interest 
                 *      if ($(event.target).is(".mySelector"))
                 * });
                 */
                beforeEditEnd: null
                
                //////////////////     CONTEXT MENU DOC     //////////////////
                /**
                 * {@ojinclude "name":"contextMenuDoc"}
                 * 
                 * <p>The DataGrid has a default context menu for accessibly performing operations such as header resize and sort. 
                 * If no context menu is specified on the data grid, the default value that is set on the <code class="prettyprint">contextMenu</code> 
                 * option is guaranteed to be something accepted by $(). Developers can also specify their own context menu by using 
                 * the <code class="prettyprint">contextMenu</code> option. When defining a context menu, ojDataGrid allows the app 
                 * to use the built-in behavior for operations such as header resize and sort by specifying menu list items as follows.</p>
                 *
                 * <ul><li> &lt;li data-oj-command="oj-datagrid-['commandname']" /&gt;</li></ul>
                 *
                 * <p>Note that if no &lt;a&gt; element is specified inside of a list item with a command, 
                 * the translated text from the default menu will be supplied in an anchor tag.</p>
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
                 *       <td><kbd>Sort Row menu</kbd> (contains ascending and descending sort)</td>
                 *       <td>oj-datagrid-sortRow</td>
                 *      </tr>
                 *     <tr>
                 *        <td><kbd>Sort Column menu</kbd> (contains ascending and descending sort)</td>
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
                 *
                 * @expose
                 * @member
                 * @name contextMenu
                 * @memberof oj.ojDataGrid
                 * @instance
                 * @type {Element|Array.<Element>|string|jQuery|NodeList}
                 * @default <code class="prettyprint">null|Element</code>
                 *
                 * @example <caption>Initialize a JET component with a context menu:</caption>
                 * // via recommended HTML5 syntax:
                 * &lt;div id="myComponent" contextmenu="myMenu" data-bind="ojComponent: { ... }>
                 *
                 * // via JET initializer (less preferred) :
                 * // Foo is the component, e.g., InputText, InputNumber, Select, etc.
                 * $( ".selector" ).ojFoo({ "contextMenu": "#myMenu" });
                 *
                 * @example <caption>Get or set the <code class="prettyprint">contextMenu</code> option, after initialization:</caption>
                 * // getter
                 * // Foo is the component, e.g., InputText, InputNumber, Select, etc.
                 * var menu = $( ".selector" ).ojFoo( "option", "contextMenu" );
                 *
                 * // setter
                 * // Foo is the component, e.g., InputText, InputNumber, Select, etc.
                 * $( ".selector" ).ojFoo( "option", "contextMenu", ".my-marker-class" );
                 *
                 * @example <caption>Set a JET context menu on an ordinary HTML element:</caption>
                 * &lt;a href="#" id="myAnchor" contextmenu="myMenu" data-bind="ojContextMenu: {}">Some text</a>
                 */                
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
        $(this.root).attr(oj.Components._OJ_CONTAINER_ATTR, this['widgetName']);        
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
        this.grid.SetOptionCallback(this.option.bind(self));
        
        this._focusable({
            'applyHighlight': true,
            'setupHandlers': function(focusInHandler, focusOutHandler) {
                var noJQFocusInHandler = function(element) {
                    return focusInHandler($(element))
                };
                
                var noJQFocusOutHandler = function(element) {
                    return focusOutHandler($(element))
                };                
                
                self.grid.SetFocusableCallback.call(self.grid, noJQFocusInHandler, noJQFocusOutHandler);
            }
        });            
        
        this._registerEventListeners();
       
        //attempt to render the grid if visible and atatched
        this._possiblyRenderOrRefresh();

        // register a resize listener
        if (this.datasource != null)
        {
            this._registerResizeListener(this.root);
        }
    },
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
            return self._trigger('keydown', details['event'], details['ui']);
        });
        this.grid.addListener('ready', function(details)
        {
            self._trigger('ready', null, {});
        });
        this.grid.addListener('scroll', function(details)
        {
            self._trigger('scroll', details['event'], details['ui']);
        });
        this.grid.addListener('beforeEdit', function(details)
        {
            return self._trigger('beforeEdit', details['event'], details['ui']);
        });    
        this.grid.addListener('beforeEditEnd', function(details)
        {
            return self._trigger('beforeEditEnd', details['event'], details['ui']);
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
            if (oj.FlattenedTreeDataGridDataSource && this.datasource instanceof oj.FlattenedTreeDataGridDataSource)
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
        $(this.root).removeAttr(oj.Components._OJ_CONTAINER_ATTR);        

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
    _setOptions: function( options, flags )
    {
	var handleUpdate;

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
            // check whether a full refresh from the wrapper layer is needed
            handleUpdate = this._handleOptionUpdate(options, flags);
            // update options
            this._super(options, flags);

            if (handleUpdate == 'refresh')
            {
                //redraw whole grid if required
                this.refresh();
            }
            else if (handleUpdate == 'pass')
            {
                // or process updated option(s) through the DvtDataGrid
                this.grid.UpdateOptions(options, flags);
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
     * @param {Object|null} flags may contain subkey option
     * @return {string} 'refresh'/'pass'/'ignore'
     * @private
     */
    _handleOptionUpdate: function(options, flags)
    {
        var key, returnVal = 'ignore', subKey, subKeyArray;
        for (key in options)
        {
            switch (key)
            {
                // pass to underlying grid to handle
                case "bandingInterval":
                case "currentCell":
                case "editMode":
                case "gridlines":
                case "scrollPosition":
                case "selection":
                    // just set returnVal in case another option is refresh at
                    // the wrapper level
                    returnVal = 'pass';
                    break;

                // do nothing for event listeners
                case "beforeCurrentCell":
                case "beforeEdit":
                case "beforeEditEnd":
                case "create":
                case "disabled":
                case "dnd":
                case "optionChange":
                case "ready":
                case "resize":
                case "rootAttributes":
                case "scroll":
                case "selectionMode":
                case "sort":
                    break;

                // refresh at wrapper level
                case "cell":
                case "header":
                    // we will only not do a full refresh if it's just updating one of the following options specifed using the
                    // dot notation like $('#datagrid').ojDataGrid('option', 'header.column.resizable', {'height': 'enable'}); if they
                    // use something like $('#datagrid').ojDataGrid('option', 'header', {'column': {'resizable': {'height': 'enable'}}});
                    // we are going to do a hard refresh because tracing down the changes across axis isn't trivial
                    subKey = flags['subkey'];
                    if (subKey != null)
                    {
                        subKeyArray = subKey.split('.');
                        if (subKeyArray[1] == 'resizable' || subKeyArray[1] == 'sortable')
                        {
                            returnVal = 'pass';
                            break;
                        }
                    }
                case "contextMenu":
                case "data":
                case "scrollPolicy":
                default:
                    return 'refresh';
                    break;
            }
        }

        return returnVal;
    },

    /**
     * Checks if resize is enabled along a given axis width/height
     * @private
     * @param {string} axis column/row/columnEnd/rowEnd
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
     * @param {string} axis column/row/columnEnd/rowEnd
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

                    this._setOption("contextMenu", menuContainer.get(0));
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
            dialog.ojDialog({initialVisibility:'show', title: title, position:{my: "center center", at: "center center", collision:"none", of:$(this.root)}});
        }
        else
        {
            dialog = $('#' + this.rootId + 'dialog');
            spinner.ojInputNumber('option', 'value', initialSize);
            dialog.ojDialog('option', 'title', title);
            dialog.ojDialog("open");
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
            if (parent.length == 0)
            {
                parent = $(this.contextMenuEvent['target']).closest('.' + this._getMappedStyle('endheadercell'));
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
     * <li><b>axis</b>: 'column'/'row'/'columnEnd'/'rowEnd'</li>
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
            else if (axis === 'columnEnd')
            {
                header = this._getHeaderByIndex(index, level, $('#' + this.rootId + '\\:columnEndHeader'), this.grid.getStartColumnEndHeader());
            }
            else if (axis === 'rowEnd')
            {
                header = this._getHeaderByIndex(index, level, $('#' + this.rootId + '\\:rowEndHeader'), this.grid.getStartRowEndHeader());
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
        if (header.length == 0)
        {
            header = $(node).closest('.' + this._getMappedStyle('endheadercell'));
        }
        
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
                'cell': context['cell'],
                'data': context['data'],
                'datasource': context['datasource'],                        
                'indexes': {
                    'row': index['rowIndex'] + this.grid.getStartRow(),
                    'column': index['columnIndex'] + this.grid.getStartColumn()
                },
                'keys': {
                    'row': context['keys']['row'],
                    'column': context['keys']['column']
                },
                'mode': context['mode']
            };
        }

        header = $(node).closest('.' + this._getMappedStyle('headercell'));
        if (header.length == 0)
        {
            header = $(node).closest('.' + this._getMappedStyle('endheadercell'));
        }
        
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

        if (lastHeader.hasClass(this._getMappedStyle('endheadercell')))
        {
            //if the first header is just a cell there is only one level, get the cell by just index
            return headerContainer.children().first().children('.' + this._getMappedStyle('endheadercell')).eq(index - start);
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
        if(headers.eq(1) == null || headers.eq(1).hasClass(this._getMappedStyle('headercell')) || headers.eq(1).hasClass(this._getMappedStyle('endheadercell')))
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
        if (headerRoot.hasClass(this._getMappedStyle('header')) || headerRoot.hasClass(this._getMappedStyle('endheader')))
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
        else if (header.hasClass(this._getMappedStyle('colheadercell')))
        {
            index = this.grid.getStartColumnHeader();
        }
        else if (header.hasClass(this._getMappedStyle('colendheadercell')))
        {
            index = this.grid.getStartColumnEndHeader();
        }
        else
        {
            index = this.grid.getStartRowEndHeader();
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
     *       <td rowspan="3">Cell</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Focus on the cell.  If <code class="prettyprint">selectionMode</code> for cells is enabled, selects the cell as well.
     *       If multiple selection is enabled the selection handles will appear. Tapping a different cell will deselect the previous selection.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Double Tap</kbd></td>
     *       <td>Enter edit mode if <code class="prettyprint">editMode</code> is enabled.</td>
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
     *       <td rowspan="25">Cell</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td>The first Tab into the DataGrid moves focus to the first cell of the first row.  The second Tab moves focus to the next focusable element outside of the DataGrid. If <code class="prettyprint">editMode</code> is cellEdit, then it submits the value and moves focus the cell of the next column within the current row. There is no wrapping at the end of the rows.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Tab</kbd></td>
     *       <td>The first Shift + Tab into the DataGrid moves focus to the first cell of the first row.  The second Shift + Tab moves focus to the previous focusable element outside of the DataGrid. If <code class="prettyprint">editMode</code> is cellEdit, then it submits the value and moves focus the cell of the previous column within the current row. There is no wrapping at the beginning of the rows.</td>
     *     </tr>     
     *     <tr>
     *       <td><kbd>Enter</kbd></td>
     *       <td>If <code class="prettyprint">editMode</code> is cellEdit, then it submits the value and moves focus the cell of the next row within the current column. There is no wrapping at the end of the columns.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Enter</kbd></td>
     *       <td>If <code class="prettyprint">editMode</code> is cellEdit, then it submits the value and moves focus the cell of the previous row within the current column. There is no wrapping at the beginning of the columns.</td>
     *     </tr>    
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves focus to the cell of the previous column within the current row.  There is no wrapping at the beginning or end of the columns.  If a row header is present, then the row header next to the first column of the current row will gain focus. Does not change focus if <code class="prettyprint">editMode</code> is cellEdit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves focus to the cell of the next column within the current row.  There is no wrapping at the beginning or end of the columns. Does not change focus if <code class="prettyprint">editMode</code> is cellEdit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Moves focus to the cell of the previous row within the current column.  There is no wrapping at the beginning or end of the rows.  If a column header is present, then the column header above the first row of the current column will gain focus. Does not change focus if <code class="prettyprint">editMode</code> is cellEdit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves focus to the cell of the next row within the current column.  There is no wrapping at the beginning or end of the rows. Does not change focus if <code class="prettyprint">editMode</code> is cellEdit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Home</kbd></td>
     *       <td>Moves focus to the first (available) cell of the current row. Does not change focus if <code class="prettyprint">editMode</code> is cellEdit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>End</kbd></td>
     *       <td>Moves focus to the last (available) cell of the current row. Does not change focus if <code class="prettyprint">editMode</code> is cellEdit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageUp</kbd></td>
     *       <td>Moves focus to the first (available) cell in the current column. Does not change focus if <code class="prettyprint">editMode</code> is cellEdit.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageDown</kbd></td>
     *       <td>Moves focus to the last (available) cell in the current column. Does not change focus if <code class="prettyprint">editMode</code> is cellEdit.</td>
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
     *       <td><kbd>Ctrl + Arrow</kbd></td>
     *       <td>Move focus to level 0 of the active index of the header in the arrow direction if it exists.</td>
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
     *       <td><kbd>F2</kbd></td>
     *       <td>If <code class="prettyprint">editMode</code> is cellNavigation it switches to cellEdit. If <code class="prettyprint">editMode</code> is cellEdit it begins editing the cell keeping the cursor at the end of the input. If the cells are not editable it makes the content of the cell actionable, such as a link.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Alt + Enter</kbd></td>
     *       <td>If <code class="prettyprint">editMode</code> is cellNavigation it switches to cellEdit. If <code class="prettyprint">editMode</code> is cellEdit it begins editing the cell keeping the cursor at the end of the input. If the cells are not editable it makes the content of the cell actionable, such as a link.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Esc</kbd></td>
     *       <td>If <code class="prettyprint">editMode</code> is cellEdit it switches to cellNavigation. If the cell is being edited it cancels the edit. If the cell is actionable it exits actionable mode.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Other Keystrokes</kbd></td>
     *       <td>If <code class="prettyprint">editMode</code> is cellEdit it will begin an edit, overwriting the contents of the cell.</td>
     *     </tr>     
     *     <tr>
     *       <td rowspan="9">Column Header Cell</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves focus to the previous column header.  There is no wrapping at the beginning or end of the column headers.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves focus to the next column header.  There is no wrapping at the beginning or end of the column headers.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves focus to the cell of the first row directly below the column header. If using nested headers will move focus up a level.</td>
     *     </tr>
     *     <tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>If using nested headers will move focus down a level.</td>
     *     </tr>
     *     <tr> 
     *       <td><kbd>Ctrl + UpArrow</kbd></td>
     *       <td>If in the column end header, move focus to level 0 of the active index in the column header if it exists.</td>
     *     </tr>  
     *     <tr>
     *       <td><kbd>Ctrl + DownArrow</kbd></td>
     *       <td>If in the column header, move focus to level 0 of the active index in the column end header if it exists.</td>
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
     *       <td rowspan="7">Row Header Cell</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Moves focus to the previous row header.  There is no wrapping at the beginning or end of the row headers.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Moves focus to the next row header.  There is no wrapping at the beginning or end of the row headers.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Moves focus to the cell of the first column directly next to the row header. If using nested headers will move focus up a level.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Moves focus to the cell of the first column directly next to the row header in RTL direction. If using nested headers will move focus down a level.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + LeftArrow</kbd></td>
     *       <td>If in the row end header, move focus to level 0 of the active index in the row header if it exists.</td>
     *     </tr>  
     *     <tr>
     *       <td><kbd>Ctrl + RightArrow</kbd></td>
     *       <td>If in the row header, move focus to level 0 of the active index in the row end header if it exists.</td>
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
     * <li><b>axis</b>: 'column'/'row'/'columnEnd'/'rowEnd'</li>
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
     * @property {string} mode the mode the cell is rendered in
     *
     * @ojnodecontext oj-datagrid-cell
     * @memberof oj.ojDataGrid
     */
    /**
     * <p>Context for the ojDataGrid component's headers.</p>
     *
     * @property {number} axis	the axis of the header, possible values are 'row'/'column'/'columnEnd'/'rowEnd'
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

/**
 * Build the actions object which maps actions to the methods to invoke because of them */
DvtDataGrid.prototype._setupActions = function()
{
    this.actions = {
        'ACTIONABLE': this._handleActionable,
        'EXIT_ACTIONABLE': this._handleExitActionable,
        'TAB_NEXT_IN_CELL': this._handleActionableTab,
        'TAB_PREV_IN_CELL': this._handleActionablePrevTab,
        'EDITABLE': this._handleEditable, // if editable go into edit, if not go into actionable
        'EXIT_EDITABLE': this._handleExitEditable,
        'DATA_ENTRY': this._handleDataEntry,
        'EXIT_DATA_ENTRY': this._handleExitDataEntry,
        'EDIT': this._handleEdit,
        'EXIT_EDIT': this._handleExitEdit,
        'CANCEL_EDIT': this._handleCancelEdit,
        'NO_OP': this._handleNoOp,
        'EAT': this._handleEat, // eat event
        'FOCUS_LEFT': this._handleFocusLeft,
        'FOCUS_RIGHT': this._handleFocusRight,
        'FOCUS_UP': this._handleFocusUp,
        'FOCUS_DOWN': this._handleFocusDown,
        'FOCUS_ROW_FIRST': this._handleFocusRowFirst,
        'FOCUS_ROW_LAST': this._handleFocusRowLast,
        'FOCUS_COLUMN_FIRST': this._handleFocusColumnFirst,
        'FOCUS_COLUMN_LAST': this._handleFocusColumnLast,
        'FOCUS_COLUMN_HEADER': this._handleFocusColumnHeader,
        'FOCUS_COLUMN_END_HEADER': this._handleFocusColumnEndHeader,
        'FOCUS_ROW_HEADER': this._handleFocusRowHeader,
        'FOCUS_ROW_END_HEADER': this._handleFocusRowEndHeader,
        'READ_CELL': this.readCurrentContent,
        'SORT': this._handleSortKey,
        'SELECT_DISCONTIGUOUS': this._handleSelectDiscontiguous,
        'SELECT_EXTEND_LEFT': this._handleExtendSelectionLeft,
        'SELECT_EXTEND_RIGHT': this._handleExtendSelectionRight,
        'SELECT_EXTEND_UP': this._handleExtendSelectionUp,
        'SELECT_EXTEND_DOWN': this._handleExtendSelectionDown,
        'SELECT_ROW': this._handleSelectRow,
        'SELECT_COLUMN': this._handleSelectColumn,
        'CUT': this._handleCut,
        'CANCEL_REORDER': this._handleCancelReorder,
        'PASTE': this._handlePaste
    };
};

/**
 * Get the function for a given keydown event.
 * @param {Event} event
 * @param {string} cellOrHeader 'cell'/'header'
 * @returns {Function|undefined} the function to invoke due to the keydown
 */
DvtDataGrid.prototype._getActionFromKeyDown = function(event, cellOrHeader)
{
    var capabilities = {
        'cellOrHeader': cellOrHeader,
        'readOnly': !this._isCellEditable(),
        'currentMode': this._getCurrentMode(),
        'activeMove': (this.m_cutRow != null),
        'rowMove': this._isMoveEnabled('row'),
        'columnSort': cellOrHeader == 'column' ? this._isDOMElementSortable(this._getActiveElement()) : false,
        'selection': this._isSelectionEnabled(),
        'selectionMode': this.m_options.getSelectionMode(),
        'multipleSelection': this.isMultipleSelection()
    };
    return this.actions[this.m_keyboardHandler.getAction(event, capabilities)];
};

//////////////////////////////////// ACTIONABLE METHODS/////////////////////////
/**
 * Determine if the data grid is in actionable mode.
 * @return returns true if the data grid is in actionable mode, false otherwise.
 * @protected
 */
DvtDataGrid.prototype.isActionableMode = function()
{
    return (this.m_currentMode === "actionable");
};

/**
 * Sets whether the data grid is in actionable mode or reverts it to navigation mode
 * @param {boolean} flag true to set grid to actionable mode, false otherwise
 * @protected
 */
DvtDataGrid.prototype.setActionableMode = function(flag)
{
    if (flag)
    {
        this.m_currentMode = "actionable";
    }
    else
    {
        this.m_currentMode = "navigation";
    }

    // update screen reader alert
    this._setAccInfoText(this.isActionableMode() ? 'accessibleActionableMode' : 'accessibleNavigationMode');
};

/**
 * Enter actionable mode
 * @param {Event} event the event triggering actionable mode
 * @param {Element|undefined|null} element to set actionable
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleActionable = function(event, element)
{
    this._enterActionableMode(element);
    return false;
};

/**
 * Exit actionable mode on the active cell if in actionable mode
 * @param {Event} event the event exiting actionable mode
 * @param {Element|undefined|null} element to unset actionable
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleExitActionable = function(event, element)
{
    this._exitActionableMode();
    this._highlightActive();
    return false;
};

/**
 * Handle a tab that is pressed when in actionable mode
 * @param {Event} event the event causing the actionable tab
 * @param {Element|undefined|null} element to unset actionable
 * @returns {boolean} true if we have shifted focus within the actionable cell
 */
DvtDataGrid.prototype._handleActionableTab = function(event, element)
{
    var focusElems = this.getFocusableElementsInNode(element);
    if (focusElems.length > 0 && event.target == focusElems[focusElems.length - 1])
    {
        // recycle to first focusable element in the cell
        focusElems[0].focus();
        return true;
    }
    // let the tab go to the next item in the cell on its own
    return false;
};

/**
 * Handle a tab that is pressed when in actionable mode
 * @param {Event} event the event causing the actionable tab
 * @param {Element|undefined|null} element to unset actionable
 * @returns {boolean} true if we have shifted focus within the actionable cell
 */
DvtDataGrid.prototype._handleActionablePrevTab = function(event, element)
{
    var focusElems = this.getFocusableElementsInNode(element);
    if (focusElems.length > 0 && event.target == focusElems[0])
    {
        // recycle to last focusable element in the cell
        focusElems[focusElems.length - 1].focus();
        return true;
    }
    // let the tab go to the previous item in the cell on its own
    return false;
};

//////////////////////////////////// EDITING METHODS/////////////////////////
/**
 * Get the edit mode values can be none/cell
 * @returns {string}  none or cell
 * @private
 */
DvtDataGrid.prototype._getEditMode = function()
{
    if (this.m_editMode == null)
    {
         this.m_editMode = this.m_options.getEditMode();
    }
    return this.m_editMode;
};

/**
 * Get the current mode of the datagrid
 * @returns {string} navigation/actionable/enter/edit
 * @private
 */
DvtDataGrid.prototype._getCurrentMode = function()
{
    if (this.m_currentMode == null)
    {
         this.m_currentMode = 'navigation';
    }
    return this.m_currentMode;
};

/**
 * Is the current mode edit or enter
 * @returns {boolean} true if edit or enter
 * @private
 */
DvtDataGrid.prototype._isEditOrEnter = function()
{
    var c = this._getCurrentMode();
    return c === 'edit';
};

/**
 * Can the grid as a whole be editable
 * @returns {boolean} true if the edit mode is cell
 * @private
 */
DvtDataGrid.prototype._isGridEditable = function()
{
    var editMode = this._getEditMode();
    if (editMode === 'cellNavigation' || editMode === 'cellEdit')
    {
        return true;
    }
    return false;
};

/**
 * Is the grid in ediable or readOnly mode
 * @returns {boolean} true if the edit mode is cell and editable enabled
 * @private
 */
DvtDataGrid.prototype._isCellEditable = function()
{
    var editMode = this._getEditMode();
    if (editMode === 'cellEdit')
    {
        return true;
    }
    return false;
};


/**
 * Enter editable mode
 * @param {Event} event the event triggering editable mode
 * @param {Element|undefined|null} element
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleEditable = function(event, element)
{
    if (this._isGridEditable())
    {
        this.m_editMode = null;
        this.m_setOptionCallback("editMode", 'cellEdit', {'_context': {writeback: true, internalSet: true}});
        this.m_utils.removeCSSClassName(this.m_root, this.getMappedStyle('readOnly'));
        this.m_utils.addCSSClassName(this.m_root, this.getMappedStyle('editable'));
        this._updateEdgeCellBorders('');
        this._setAccInfoText('accessibleEditableMode');                    
    }
    else
    {
        this._handleActionable(event, element);
    }
    return false;
};

/**
 * Exit editable mode
 * @param {Event} event the event triggering editable mode
 * @param {Element|undefined|null} element
 */
DvtDataGrid.prototype._handleExitEditable = function(event, element)
{
    this.m_editMode = null;
    this.m_setOptionCallback("editMode", 'cellNavigation', {'_context': {writeback: true, internalSet: true}});
    this.m_utils.addCSSClassName(this.m_root, this.getMappedStyle('readOnly'));
    this.m_utils.removeCSSClassName(this.m_root, this.getMappedStyle('editable'));
    this._updateEdgeCellBorders('none');
    this._setAccInfoText('accessibleNavigationMode');                
};

/**
 * Enter enter mode
 * @param {Event} event the event triggering enter mode
 * @param {Element|undefined|null} element
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleDataEntry = function(event, element)
{
    var details, rerender;
    details = {'event': event, 'ui': {'cell': element, 'cellContext': element[this.getResources().getMappedAttribute("context")]}};
    rerender = this.fireEvent('beforeEdit', details);
    if (rerender)
    {
        this._reRenderCell(element, 'edit', this.getMappedStyle('cellEdit'));
        this._enableAllFocusableElements(element);
        // focus on first focusable item in the cell
        this._overwriteFlag = true;
        if (this._setFocusToFirstFocusableElement(element))
        {
            this.m_currentMode = 'edit';
        }
        else
        {
            // if there was nothing to edit remove the edit class            
            this.m_utils.removeCSSClassName(element, this.getMappedStyle('cellEdit'));            
        }        
        this._overwriteFlag = false;
   }
   return false;
};

/**
 * Exit enter mode
 * @param {Event} event the event triggering exit enter mode
 * @param {Element|undefined|null} element
 * @returns {boolean} true if enter is left successfully
 */
DvtDataGrid.prototype._handleExitDataEntry = function(event, element)
{
    return this._leaveEditing(event, element, false);
};

/**
 * Enter edit mode
 * @param {Event} event the event triggering edit mode
 * @param {Element|undefined|null} element
 * @returns {boolean} true if edit mode entered
 */
DvtDataGrid.prototype._handleEdit = function(event, element)
{
    var details, rerender;
    
    details = {'event': event, 'ui': {'cell': element, 'cellContext': element[this.getResources().getMappedAttribute("context")]}};
    rerender = this.fireEvent('beforeEdit', details);
    if (rerender)
    {
        this._reRenderCell(element, 'edit', this.getMappedStyle('cellEdit'));
        // enable all focusable elements
        this._enableAllFocusableElements(element);

        // focus on first focusable item in the cell
        if (this._setFocusToFirstFocusableElement(element))
        {
            this.m_currentMode = 'edit';
        }
        else
        {
            // if there was nothing to edit remove the edit class
            this.m_utils.removeCSSClassName(element, this.getMappedStyle('cellEdit'));
        }
    }
    else
    {
        rerender = false;
        this._enterActionableMode(element);
    }
    return rerender;
};

/**
 * Exit edit mode
 * @param {Event} event
 * @param {Element|undefined|null} element
 * @returns {boolean} true if editing left successully
 */
DvtDataGrid.prototype._handleExitEdit = function(event, element)
{
    return this._leaveEditing(event, element, false);
};

/**
 * Cancel an edit
 * @param {Event} event
 * @param {Element|undefined|null} element
 * @returns {boolean} true if editing cancelled successully
 */
DvtDataGrid.prototype._handleCancelEdit = function(event, element)
{
    return this._leaveEditing(event, element, true);
};

/**
 * Leave editing
 * @param {Event} event the event triggering actionable mode
 * @param {Element|undefined|null} element
 * @returns {boolean} false
 */
DvtDataGrid.prototype._leaveEditing = function(event, element, cancel)
{
    var details, rerender;
    details = {'event': event, 'ui': {'cell': element, 'cellContext': element[this.getResources().getMappedAttribute("context")], 'cancelEdit': cancel}};
    if (!cancel)
    {
        this._disableAllFocusableElements(element);
        this._highlightActive();
    }
    rerender = this.fireEvent('beforeEditEnd', details);
    if (rerender)
    {
        this.m_currentMode = 'navigation';
        this._disableAllFocusableElements(element);
        this._highlightActive();
        this._reRenderCell(element, 'navigation', this.getMappedStyle('cellEdit'));
    }
    else
    {
        rerender = false;
        this._scrollToActive(this.m_active);                
        this._enableAllFocusableElements(element);
        // focus on first focusable item in the cell
        this._setFocusToFirstFocusableElement(element);
    }
    return rerender;
};

//////////////////////////////////// FOCUS METHODS/////////////////////////
/**
 * Handles all the various focus changes by keystroke
 * @param {Event} event
 * @param {Element} element
 * @param {number} keyCode
 * @param {boolean} isExtend
 * @param {boolean} jumpToHeaders
 * @returns {boolean} true if event processed
 */
DvtDataGrid.prototype._handleFocusKey = function(event, element, keyCode, isExtend, jumpToHeaders)
{
    var changeFocus = true, changeRegions = true, editing, returnVal, oldActive;
    if (this.m_active != null)
    {
        if (this.m_active['type'] == 'cell')
        {
            if (this._isEditOrEnter())
            {
                editing = true;
                changeFocus = this._leaveEditing(event, element, false);
                changeRegions = false;
            }
            else if (this.isActionableMode())
            {
                this._exitActionableMode();
            }

            if (changeFocus)
            {
                oldActive = this.m_active;
                returnVal = this.handleFocusChange(keyCode, isExtend, event, changeRegions, jumpToHeaders);
                if (this.m_utils.isTouchDevice() && editing && oldActive != this.m_active)
                {
                    return this._handleEdit(event, this._getActiveElement());
                }
                return returnVal;
            }
            return true;
        }
        else
        {
            return this.handleHeaderFocusChange(keyCode, event, jumpToHeaders);
        }
    }
    return false;    
};

/**
 * Handle a focus to the left element
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusLeft = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.LEFT_KEY, false, false);
};

/**
 * Handle a focus to the right element
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusRight = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.RIGHT_KEY, false, false);
};

/**
 * Handle a focus to the up element
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusUp = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.UP_KEY, false, false);
};

/**
 * Handle a focus to the down element
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusDown = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.DOWN_KEY, false, false);
};

/**
 * Handle a focus to the first row same column
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusRowFirst = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.PAGEUP_KEY, false, false);
};

/**
 * Handle a focus to the last row same column
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusRowLast = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.PAGEDOWN_KEY, false, false);
};

/**
 * Handle a focus to the first column same row
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusColumnFirst = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.HOME_KEY, false, false);
};

/**
 * Handle a focus to the last column same row
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusColumnLast = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.END_KEY, false, false);
};

/**
 * Handle a focus to the row header
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusRowHeader = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.LEFT_KEY, false, true);
};

/**
 * Handle a focus to the row end header
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusRowEndHeader = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.RIGHT_KEY, false, true);
};

/**
 * Handle a focus to the column header
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusColumnHeader = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.UP_KEY, false, true);
};

/**
 * Handle a focus to the column end header
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleFocusColumnEndHeader = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.DOWN_KEY, false, true);
};
/////////////////////// SELECTION METHODS ////////////////////////////
/**
 * Handle a selection of the whole row
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} true if processed
 */
DvtDataGrid.prototype._handleSelectRow = function(event, element)
{
    var axis, start, end, elem, level, index;
    if  (!this._isSelectionEnabled() || !this.isMultipleSelection())
    {
        return false;
    }

    if (this.m_utils.containsCSSClassName(element, this.getMappedStyle('cell')))
    {
        index = this.m_active['indexes']['row'];
        start = index;
        end  = index;
    }
    else
    {
        if (this.m_active == null || this.m_active['type'] != 'header' || this.m_active['axis'] != 'row')
        {
            return false;
        }
        axis = this.m_active['axis'];
        index = this.m_active['index'];
        level = this.m_active['level'];
        if (this.m_rowHeaderLevelCount - 1 === level)
        {
            start = index;
            end = index;
        }
        else
        {
            elem = this._getActiveElement();
            start = this._getAttribute(elem['parentNode'], 'start', true);
            end = start + this._getAttribute(elem['parentNode'], 'extent', true) - 1;
        }
    }

    //handle the space key in headers
    this._selectEntireRow(start, end, event);

    // announce to screen reader, no need to include context info
    this._setAccInfoText('accessibleRowSelected', {'row': index + 1});
    return true;
};

/**
 * Handle a selection of the whole column
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} true if processed
 */
DvtDataGrid.prototype._handleSelectColumn = function(event, element)
{
    var axis, start, end, elem, level, index;
    if  (!this._isSelectionEnabled() || !this.isMultipleSelection() || this.m_options.getSelectionMode() != 'cell')
    {
        return false;
    }

    if (this.m_utils.containsCSSClassName(element, this.getMappedStyle('cell')))
    {
        index = this.m_active['indexes']['column'];
        start = index;
        end  = index;
    }
    else
    {
        if (this.m_active == null || this.m_active['type'] != 'header' || this.m_active['axis'] != 'column')
        {
            return false;
        }
        axis = this.m_active['axis'];
        index = this.m_active['index'];
        level = this.m_active['level'];
        if (this.m_columnHeaderLevelCount - 1 === level)
        {
            start = index;
            end = index;
        }
        else
        {
            elem = this._getActiveElement();
            start = this._getAttribute(elem['parentNode'], 'start', true);
            end = start + this._getAttribute(elem['parentNode'], 'extent', true) - 1;
        }
    }

    //handle the space key in headers
    this._selectEntireColumn(start, end, event);

    // announce to screen reader, no need to include context info
    this._setAccInfoText('accessibleColumnSelected', {'column': index + 1});
    return true;
};

/**
 * Handle entering discontiguous selection
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} true if processed
 */
DvtDataGrid.prototype._handleSelectDiscontiguous = function(event, element)
{
    this.setDiscontiguousSelectionMode(!this.m_discontiguousSelection);
    return true;
};

/**
 * Handle extend selection left
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} true if processed
 */
DvtDataGrid.prototype._handleExtendSelectionLeft = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.LEFT_KEY, true, false);
};

/**
 * Handle extend selection right
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} true if processed
 */
DvtDataGrid.prototype._handleExtendSelectionRight = function(event, element)
{
    return this._handleFocusKey(event, element,DvtDataGrid.keyCodes.RIGHT_KEY, true, false);
};

/**
 * Handle extend selection up
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} true if processed
 */
DvtDataGrid.prototype._handleExtendSelectionUp = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.UP_KEY, true, false);
};

/**
 * Handle extend selection down
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} true if processed
 */
DvtDataGrid.prototype._handleExtendSelectionDown = function(event, element)
{
    return this._handleFocusKey(event, element, DvtDataGrid.keyCodes.DOWN_KEY, true, false);
};

/**
 * Handle sort key
 * @param {Event} event the event causing the action
 * @param {Element} element target cell or header of the event
 * @returns {boolean} true if processed
 */
DvtDataGrid.prototype._handleSortKey = function(event, element)
{
    // sort, first check if the column is sortable
    if (element.getAttribute(this.getResources().getMappedAttribute("sortable")) == "true")
    {
        this._handleKeyboardSort(element, event);
        return true;
    }
    else
    {
        // enter actionable mode but don't prevent default so the action is taken
        return this._handleActionable(event, element);
    }
};

/**
 * Enter editable mode
 * @param {Event} event the event triggering actionable mode
 * @param {Element} element to set actionable
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleNoOp = function(event, element)
{
    return false;
};

/**
 * Enter editable mode
 * @param {Event} event the event triggering actionable mode
 * @param {Element} element to set actionable
 * @returns {boolean} false
 */
DvtDataGrid.prototype._handleEat = function(event, element)
{
    return true;
};
/**
 * This class contains all utility methods used by the Grid.
 * @param {Object} dataGrid the dataGrid using the utils
 * @constructor
 * @private
 */
var DvtDataGridKeyboardHandler = function(dataGrid)
{
    this.grid = dataGrid;
};

/**
 * Get the action of a particular keydown event given information about the state of the frid
 * @param {Event} event
 * @param {Object} capabilities
 * @returns {string}
 */
DvtDataGridKeyboardHandler.prototype.getAction = function(event, capabilities)
{
    var keyCode, keyCodes, ctrlKey, shiftKey, altKey, cellOrHeader, readOnly,
            currentMode, activeMove, rowMove, columnSort, selection, selectionMode, multipleSelection;
    keyCode = event.keyCode;
    ctrlKey = this.grid.m_utils.ctrlEquivalent(event);
    shiftKey = event.shiftKey;
    altKey = event.altKey;
    keyCodes = DvtDataGrid.keyCodes;

    cellOrHeader = capabilities['cellOrHeader'];
    readOnly = capabilities['readOnly'];
    currentMode = capabilities['currentMode'];
    activeMove = capabilities['activeMove'];
    rowMove = capabilities['rowMove'];
    columnSort = capabilities['columnSort'];
    selection = capabilities['selection'];
    selectionMode = capabilities['selectionMode'];
    multipleSelection = capabilities['multipleSelection'];

    switch (keyCode)
    {
        case keyCodes.TAB_KEY:
            if (currentMode === 'actionable')
            {
                if (shiftKey)
                {
                    return 'TAB_PREV_IN_CELL';
                }
                return 'TAB_NEXT_IN_CELL';
            }
            else if (!readOnly)
            {
                if (shiftKey)
                {
                    return 'FOCUS_LEFT';
                }
                return 'FOCUS_RIGHT';
            }
            break;
        case keyCodes.ENTER_KEY:
            if (cellOrHeader === 'column' && columnSort)
            {
                return 'SORT';
            }
            // enter actionable mode on headers since they cannot be edited
            else if ((!altKey && readOnly && currentMode === 'navigation') || cellOrHeader != 'cell')
            {
                return 'ACTIONABLE';
            }
            else if (!readOnly && !altKey)
            {
                if (shiftKey)
                {
                    return 'FOCUS_UP';
                }
                return 'FOCUS_DOWN';
            }
            else if (altKey && readOnly && currentMode === 'navigation')
            {
                return 'EDITABLE';
            }
            else if (!readOnly)
            {
                if (currentMode == 'navigation' || currentMode === 'edit')
                {
                    return 'EDIT';
                }
            }
            break;
        case keyCodes.ESC_KEY:
            if (currentMode === 'actionable')
            {
                return 'EXIT_ACTIONABLE';
            }
            else if (activeMove)
            {
                return 'CANCEL_REORDER';
            }
            else if (!readOnly)
            {
                if (currentMode === 'navigation')
                {
                    return 'EXIT_EDITABLE';
                }
                else if (currentMode === 'edit')
                {
                    return 'CANCEL_EDIT';
                }
            }
            break;
        case keyCodes.SPACE_KEY:
            if (cellOrHeader === 'row' && selection && ((selectionMode == 'cell' && multipleSelection) || selectionMode == 'row'))
            {
                return 'SELECT_ROW';
            }
            else if (cellOrHeader === 'column' && selection && selectionMode == 'cell' && multipleSelection)
            {
                return 'SELECT_COLUMN';
            }
            else if (cellOrHeader === 'cell')
            {
                if (readOnly && currentMode === 'navigation')
                {
                    if (ctrlKey && selection && selectionMode == 'cell' && multipleSelection)
                    {
                        return 'SELECT_COLUMN';
                    }
                    else if (shiftKey && selection && ((selectionMode == 'cell' && multipleSelection) || selectionMode == 'row'))
                    {
                        return 'SELECT_ROW';
                    }
                }
                else if (currentMode === 'navigation')
                {
                    return 'DATA_ENTRY';
                }
            }
            break;
        case keyCodes.PAGEUP_KEY:
            if (currentMode !== 'edit')
            {
                return 'FOCUS_ROW_FIRST';
            }
            break;
        case keyCodes.PAGEDOWN_KEY:
            if (currentMode !== 'edit')
            {
                return 'FOCUS_ROW_LAST';
            }
            break;
        case keyCodes.END_KEY:
            if (currentMode !== 'edit')
            {
                return 'FOCUS_COLUMN_LAST';
            }
            break;
        case keyCodes.HOME_KEY:
            if (currentMode !== 'edit')
            {
                return 'FOCUS_COLUMN_FIRST';
            }
            break;
        case keyCodes.LEFT_KEY:
            if (currentMode === 'actionable')
            {
                return 'NO_OP';
            }
            else if (currentMode !== 'edit')
            {
                if (shiftKey && selection && selectionMode == 'cell' && multipleSelection)
                {
                    return 'SELECT_EXTEND_LEFT';
                }
                if (ctrlKey && cellOrHeader != 'column')
                {
                    return 'FOCUS_ROW_HEADER';
                }                
                return 'FOCUS_LEFT';
            }
            break;
        case keyCodes.UP_KEY:
            if (currentMode === 'actionable')
            {
                return 'NO_OP';
            }
            else if (currentMode !== 'edit')
            {
                if (shiftKey && selection && multipleSelection)
                {
                    return 'SELECT_EXTEND_UP';
                }
                if (ctrlKey && cellOrHeader != 'row')
                {
                    return 'FOCUS_COLUMN_HEADER';
                }                   
                return 'FOCUS_UP';
            }
            break;
        case keyCodes.RIGHT_KEY:
            if (currentMode === 'actionable')
            {
                return 'NO_OP';
            }
            else if (currentMode !== 'edit')
            {
                if (shiftKey && selection && selectionMode == 'cell' && multipleSelection)
                {
                    return 'SELECT_EXTEND_RIGHT';
                }
                if (ctrlKey && cellOrHeader != 'column')
                {
                    return 'FOCUS_ROW_END_HEADER';
                }                             
                return 'FOCUS_RIGHT';
            }
            break;
        case keyCodes.DOWN_KEY:
            if (currentMode === 'actionable')
            {
                return 'NO_OP';
            }
            else if (currentMode !== 'edit')
            {
                if (shiftKey && selection && multipleSelection)
                {
                    return 'SELECT_EXTEND_DOWN';
                }
                if (ctrlKey && cellOrHeader != 'row')
                {
                    return 'FOCUS_COLUMN_END_HEADER';
                }                
                return 'FOCUS_DOWN';
            }
            break;
        case keyCodes.F2_KEY:
            if (cellOrHeader != 'cell')
            {
                return 'ACTIONABLE';
            }
            else if (readOnly && currentMode === 'navigation')
            {
                return 'EDITABLE';
            }
            else if (!readOnly && currentMode == 'navigation')
            {
                return 'EDIT';
            }
            break;
        case keyCodes.F8_KEY:
            if (shiftKey && selection && multipleSelection)
            {
                return 'SELECT_DISCONTIGUOUS';
            }
            break;
        case keyCodes.F10_KEY:
            if (shiftKey)
            {
                return 'NO_OP';
            }
            break;
        case keyCodes.V_KEY:
            if (currentMode === 'navigation' && ctrlKey  && rowMove)
            {
                return 'PASTE';
            }
            if (!readOnly && currentMode === 'navigation')
            {
                return 'DATA_ENTRY';
            }
            break;
        case keyCodes.X_KEY:
            if (currentMode === 'navigation' && ctrlKey && rowMove)
            {
                return 'CUT';
            }
            if (!readOnly && currentMode === 'navigation')
            {
                return 'DATA_ENTRY';
            }
            break;

        case keyCodes.SHIFT_KEY:
        case keyCodes.CTRL_KEY:
        case keyCodes.ALT_KEY:
            break;
        case keyCodes.NUM5_KEY:
            if (ctrlKey && altKey)
            {
                return 'READ_CELL';
            }
        default:
            if (!readOnly && currentMode === 'navigation' && cellOrHeader == 'cell')
            {
                return 'DATA_ENTRY';
            }
            break;
    }
    return 'NO_OP';
};
(function() {
var ojDataGridMeta = {
  "properties": {
    "bandingInterval": {
      "type": "Object<string, number>"
    },
    "cell": {
      "type": "Object"
    },
    "currentCell": {
      "type": "Object"
    },
    "data": {},
    "dnd": {
      "type": "Object"
    },
    "editMode": {
      "type": "string"
    },
    "gridlines": {
      "type": "Object<string, string>"
    },
    "header": {},
    "scrollPolicy": {
      "type": "string"
    },
    "scrollPosition": {
      "type": "Object<string, Object>"
    },
    "selection": {
      "type": "Array<Object>"
    },
    "selectionMode": {
      "type": "Object<string, string>"
    }
  },
  "methods": {
    "getContextByNode": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {},
    "refresh": {},
    "scrollTo": {},
    "whenReady": {}
  },
  "extension": {
    "_widgetName": "ojDataGrid"
  }
};
oj.Components.registerMetadata('ojDataGrid', 'baseComponent', ojDataGridMeta);
oj.Components.register('oj-data-grid', oj.Components.getMetadata('ojDataGrid'));
})();
});
