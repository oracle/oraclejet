/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'ojs/ojconfig', 'ojs/ojtranslation', 
        'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojdatacollection-common', 
        'ojs/ojanimation', 'ojs/ojmessaging', 'ojs/ojlogger', 'ojs/ojkeyset', 
        'ojs/ojvalidator-regexp', 'ojs/ojdomscroller', 'ojdnd', 'ojs/ojeditablevalue', 
        'ojs/ojinputnumber', 'ojs/ojmenu', 'ojs/ojpopup', 'ojs/ojbutton', 'ojs/ojdatasource-common', 
        'ojs/ojdataprovideradapter', 'ojs/ojlistdataproviderview', 'touchr', 'ojs/ojselector'], 
      function(oj, $, Context, Config, Translations, ThemeUtils, Components, DataCollectionUtils, 
        AnimationUtils, Message, Logger, KeySet, RegExpValidator, DomScroller)
{
  "use strict";
var __oj_table_metadata = 
{
  "properties": {
    "accessibility": {
      "type": "object",
      "properties": {
        "rowHeader": {
          "type": "string"
        }
      }
    },
    "as": {
      "type": "string",
      "value": ""
    },
    "columns": {
      "type": "Array<Object>",
      "writeback": true
    },
    "columnsDefault": {
      "type": "object",
      "properties": {
        "className": {
          "type": "string"
        },
        "field": {
          "type": "string"
        },
        "footerClassName": {
          "type": "string"
        },
        "footerRenderer": {
          "type": "function"
        },
        "footerStyle": {
          "type": "string"
        },
        "footerTemplate": {
          "type": "string"
        },
        "headerClassName": {
          "type": "string"
        },
        "headerRenderer": {
          "type": "function"
        },
        "headerStyle": {
          "type": "string"
        },
        "headerTemplate": {
          "type": "string"
        },
        "headerText": {
          "type": "string"
        },
        "renderer": {
          "type": "function"
        },
        "resizable": {
          "type": "string",
          "enumValues": [
            "disabled",
            "enabled"
          ],
          "value": "disabled"
        },
        "sortProperty": {
          "type": "string"
        },
        "sortable": {
          "type": "string",
          "enumValues": [
            "auto",
            "disabled",
            "enabled"
          ],
          "value": "auto"
        },
        "style": {
          "type": "string"
        },
        "template": {
          "type": "string"
        },
        "width": {
          "type": "number"
        }
      }
    },
    "currentRow": {
      "type": "object",
      "writeback": true
    },
    "data": {
      "type": "object"
    },
    "display": {
      "type": "string",
      "enumValues": [
        "grid",
        "list"
      ],
      "value": "list"
    },
    "dnd": {
      "type": "object",
      "properties": {
        "drag": {
          "type": "object",
          "properties": {
            "rows": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragStart": {
                  "type": "function"
                },
                "drag": {
                  "type": "function"
                },
                "dragEnd": {
                  "type": "function"
                }
              }
            }
          }
        },
        "drop": {
          "type": "object",
          "properties": {
            "columns": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragEnter": {
                  "type": "function"
                },
                "dragOver": {
                  "type": "function"
                },
                "dragLeave": {
                  "type": "function"
                },
                "drop": {
                  "type": "function"
                }
              }
            },
            "rows": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragEnter": {
                  "type": "function"
                },
                "dragOver": {
                  "type": "function"
                },
                "dragLeave": {
                  "type": "function"
                },
                "drop": {
                  "type": "function"
                }
              }
            }
          }
        },
        "reorder": {
          "type": "object",
          "properties": {
            "columns": {
              "type": "string",
              "enumValues": [
                "disabled",
                "enabled"
              ],
              "value": "disabled"
            }
          }
        }
      }
    },
    "editMode": {
      "type": "string",
      "enumValues": [
        "none",
        "rowEdit"
      ],
      "value": "none"
    },
    "editRow": {
      "type": "object",
      "writeback": true,
      "value": {
        "rowKey": null,
        "rowIndex": -1
      }
    },
    "firstSelectedRow": {
      "type": "object",
      "writeback": true,
      "readOnly": true,
      "value": {
        "key": null,
        "data": null
      },
      "properties": {
        "key": {
          "type": "any"
        },
        "data": {
          "type": "any"
        }
      }
    },
    "horizontalGridVisible": {
      "type": "string",
      "enumValues": [
        "auto",
        "disabled",
        "enabled"
      ],
      "value": "auto"
    },
    "rowRenderer": {
      "type": "function"
    },
    "scrollPolicy": {
      "type": "string",
      "enumValues": [
        "auto",
        "loadAll",
        "loadMoreOnScroll"
      ],
      "value": "auto"
    },
    "scrollPolicyOptions": {
      "type": "object",
      "properties": {
        "fetchSize": {
          "type": "number",
          "value": 25
        },
        "maxCount": {
          "type": "number",
          "value": 500
        }
      }
    },
    "scrollPosition": {
      "type": "object",
      "writeback": true,
      "value": {
        "x": 0,
        "y": 0
      },
      "properties": {
        "x": {
          "type": "number"
        },
        "y": {
          "type": "number"
        },
        "columnIndex": {
          "type": "number"
        },
        "rowIndex": {
          "type": "number"
        },
        "columnKey": {
          "type": "any"
        },
        "rowKey": {
          "type": "any"
        },
        "offsetX": {
          "type": "number"
        },
        "offsetY": {
          "type": "number"
        }
      }
    },
    "selected": {
      "type": "object",
      "writeback": true,
      "properties": {
        "column": {
          "type": "KeySet",
          "writeback": true
        },
        "row": {
          "type": "KeySet",
          "writeback": true
        }
      }
    },
    "selection": {
      "type": "Array<Object>",
      "writeback": true,
      "value": []
    },
    "selectionMode": {
      "type": "Object<string, string>",
      "properties": {
        "column": {
          "type": "string",
          "enumValues": [
            "multiple",
            "none",
            "single"
          ]
        },
        "row": {
          "type": "string",
          "enumValues": [
            "multiple",
            "none",
            "single"
          ]
        }
      }
    },
    "selectionRequired": {
      "type": "boolean",
      "value": false
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleColumnContext": {
          "type": "string"
        },
        "accessibleColumnHeaderContext": {
          "type": "string"
        },
        "accessibleRowContext": {
          "type": "string"
        },
        "accessibleSortAscending": {
          "type": "string"
        },
        "accessibleSortDescending": {
          "type": "string"
        },
        "accessibleSortable": {
          "type": "string"
        },
        "accessibleStateSelected": {
          "type": "string"
        },
        "labelAccSelectionAffordanceBottom": {
          "type": "string"
        },
        "labelAccSelectionAffordanceTop": {
          "type": "string"
        },
        "labelDisableNonContiguousSelection": {
          "type": "string"
        },
        "labelEditRow": {
          "type": "string"
        },
        "labelEnableNonContiguousSelection": {
          "type": "string"
        },
        "labelResize": {
          "type": "string"
        },
        "labelResizePopupCancel": {
          "type": "string"
        },
        "labelResizePopupSpinner": {
          "type": "string"
        },
        "labelResizePopupSubmit": {
          "type": "string"
        },
        "labelSelectAndEditRow": {
          "type": "string"
        },
        "labelSelectColum": {
          "type": "string"
        },
        "labelSelectRow": {
          "type": "string"
        },
        "labelSort": {
          "type": "string"
        },
        "labelSortAsc": {
          "type": "string"
        },
        "labelSortDsc": {
          "type": "string"
        },
        "msgColumnResizeWidthValidation": {
          "type": "string"
        },
        "msgFetchingData": {
          "type": "string"
        },
        "msgInitializing": {
          "type": "string"
        },
        "msgNoData": {
          "type": "string"
        },
        "msgScrollPolicyMaxCountDetail": {
          "type": "string"
        },
        "msgScrollPolicyMaxCountSummary": {
          "type": "string"
        },
        "msgStatusSortAscending": {
          "type": "string"
        },
        "msgStatusSortDescending": {
          "type": "string"
        }
      }
    },
    "verticalGridVisible": {
      "type": "string",
      "enumValues": [
        "auto",
        "disabled",
        "enabled"
      ],
      "value": "auto"
    }
  },
  "methods": {
    "getContextByNode": {},
    "getDataForVisibleRow": {},
    "refresh": {},
    "refreshRow": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateStart": {},
    "ojAnimateEnd": {},
    "ojBeforeCurrentRow": {},
    "ojBeforeRowEdit": {},
    "ojBeforeRowEditEnd": {},
    "ojRowAction": {},
    "ojSort": {}
  },
  "extension": {}
};


/* global AnimationUtils:false, Components:false, Config:false, Context:false, DataCollectionUtils:false,
          Logger:false, Promise:false, Set:false, Symbol:false, ThemeUtils:false, Translations:false  DomScroller:false */

/**
 * Creates a new Table
 * @constructor
 * @private
 */
var Table = function () {
  this._cacheDomDimensions = {};
};

/**
 * @private
 */
Table._BUNDLE_KEY = {
  _MSG_FETCHING_DATA: 'msgFetchingData',
  _MSG_NO_DATA: 'msgNoData',
  _MSG_INITIALIZING: 'msgInitializing',
  _MSG_STATUS_SORT_ASC: 'msgStatusSortAscending',
  _MSG_STATUS_SORT_DSC: 'msgStatusSortDescending',
  _LABEL_SELECT_COLUMN: 'labelSelectColumn',
  _LABEL_SELECT_ROW: 'labelSelectRow',
  _LABEL_EDIT_ROW: 'labelEditRow',
  _LABEL_SELECT_AND_EDIT_ROW: 'labelSelectAndEditRow'
};

/**
 * @private
 */
Table._LOGGER_MSG = {
  _ERR_PRECURRENTROW_ERROR_SUMMARY: 'Did not change current row due to error.',
  _ERR_PRECURRENTROW_ERROR_DETAIL: 'Error detail: {error}.',
  _ERR_CURRENTROW_UNAVAILABLE_INDEX_SUMMARY:
  'Did not change current row due to unavailable row index.',
  _ERR_CURRENTROW_UNAVAILABLE_INDEX_DETAIL: 'Unavailable row index: {rowIdx}.',
  _ERR_REFRESHROW_INVALID_INDEX_SUMMARY: 'Invalid row index value.',
  _ERR_REFRESHROW_INVALID_INDEX_DETAIL: 'Row index: {rowIdx}.',
  _ERR_DATA_INVALID_TYPE_SUMMARY: 'Invalid data type.',
  _ERR_DATA_INVALID_TYPE_DETAIL: 'Please specify the appropriate data type.',
  _ERR_ELEMENT_INVALID_TYPE_SUMMARY: 'Invalid element type.',
  _ERR_ELEMENT_INVALID_TYPE_DETAIL: 'Only a <table> element can be specified for ojTable.',
  _ERR_WIDTH_INVALID_TYPE_SUMMARY: 'Invalid data type for column width.',
  _ERR_WIDTH_INVALID_TYPE_DETAIL: 'Please specify a valid number (not a string).'
};

/**
 * @private
 * @type {string}
 */
Table._FIELD_ID = 'id';

/**
 * @private
 * @type {string}
 */
Table._CONST_ATTRIBUTE = 'attribute';

/**
 * @private
 * @type {string}
 */
Table._CONST_DATA = 'data';

/**
 * @private
 * @type {string}
 */
Table._CONST_METADATA = 'metadata';

/**
 * @private
 * @type {string}
 */
Table._CONST_INDEXES = 'indexes';

/**
 * @private
 * @type {string}
 */
Table._CONST_INDEX = 'index';

/**
 * @private
 * @type {string}
 */
Table._CONST_KEY = 'key';

/**
 * @private
 * @type {string}
 */
Table._CONST_KEYS = 'keys';

/**
 * @private
 * @type {string}
 */
Table._CONST_AFTERKEYS = 'afterKeys';

/**
 * @private
 * @type {string}
 */
Table._CONST_ADDBEFOREKEYS = 'addBeforeKeys';

/**
 * @private
 * @type {string}
 */
Table._CONST_CLIENTID = 'clientId';

/**
 * @private
 * @type {string}
 */
Table._CONST_STARTINDEX = 'startIndex';

/**
 * @private
 * @type {string}
 */
Table._CONST_ENDINDEX = 'endIndex';

/**
 * @private
 * @type {string}
 */
Table._CONST_PAGESIZE = 'size';

/**
 * @private
 * @type {string}
 */
Table._CONST_OFFSET = 'offset';

/**
 * @private
 * @type {string}
 */
Table._CONST_SILENT = 'silent';

/**
 * @private
 * @type {string}
 */
Table._CONST_COLUMN = 'column';

/**
 * @private
 * @type {string}
 */
Table._CONST_ROW = 'row';

/**
 * @private
 * @type {string}
 */
Table._CONST_VALUE = 'value';

/**
 * @private
 * @type {string}
 */
Table._CONST_SORTCRITERIA = 'sortCriteria';

/**
 * @private
 * @type {string}
 */
Table._COLUMN_HEADER_ID = '_headerColumn';

/**
  * @private
  * @type {string}
  */
Table._COLUMN_HEADER_TEXT_ID = '_headerColumnText';

/**
  * @private
  * @type {string}
  */
Table._COLUMN_HEADER_ASC_ID = '_headerColumnAsc';

/**
  * @private
  * @type {string}
  */
Table._COLUMN_HEADER_DSC_ID = '_headerColumnDsc';

/**
  * @private
  * @type {string}
  */
Table._COLUMN_HEADER_ID_PREFIX = '_hdrCol';

/**
 * @private
 * @type {string}
 */
Table._COLUMN_HEADER_ROW_SELECT_ID = '_hdrColRowSel';

/**
 * @private
 * @type {string}
 */
Table._FOCUS_CALLED = '_focusedCalled';

/**
 * @private
 * @type {string}
 */
Table._ROW_TEMPLATE = 'rowTemplate';

/**
 * @private
 * @type {string}
 */
Table._CELL_TEMPLATE = 'template';

/**
 * @private
 * @type {string}
 */
Table._HEADER_TEMPLATE = 'headerTemplate';

/**
 * @private
 * @type {string}
 */
Table._FOOTER_TEMPLATE = 'footerTemplate';

/**
 * @private
 * @type {string}
 */
Table._OPTION_AUTO = 'auto';

/**
 * @private
 * @type {string}
 */
Table._OPTION_ENABLED = 'enabled';

/**
 * @private
 * @type {string}
 */
Table._OPTION_DISABLED = 'disabled';

/**
 * @private
 */
Table._OPTION_DISPLAY = {
  _LIST: 'list',
  _GRID: 'grid'
};

/**
 * @private
 */
Table._OPTION_EDIT_MODE = {
  _NONE: 'none',
  _ROW_EDIT: 'rowEdit'
};

/**
 * @private
 */
Table._OPTION_SELECTION_MODES = {
  _SINGLE: 'single',
  _MULTIPLE: 'multiple',
  _NONE: 'none'
};

/**
 * @private
 */
Table._OPTION_SCROLL_POLICY = {
  _AUTO: 'auto',
  _LOADMORE_ON_SCROLL: 'loadMoreOnScroll',
  _LOAD_ALL: 'loadAll'
};

/**
 * @private
 */
Table._COLUMN_SORT_ORDER = {
  _ASCENDING: 'ascending',
  _DESCENDING: 'descending'
};

/**
 * @private
 */
Table._DND_REORDER_TABLE_ID_DATA_KEY = 'oj-table-dnd-reorder-table-id';

Table._CURRENT_ROW_STATUS = {
  _UPDATED: 'updated',
  _IGNORED: 'ignored',
  _VETOED: 'vetoed',
  _ERROR: 'error'
};

Table._BATCH_PROCESS_SIZE_WHEN_IDLE = 5;

/**
 * Return whether the node is editable
 * @param {Node} node  DOM Node
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isNodeEditable = function (node) {
  return this._isNodeType(node, /^INPUT|TEXTAREA/);
};

/**
 * Return whether the node is clickable
 * @param {Node} node  DOM Node
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isNodeClickable = function (node) {
  return this._isNodeType(node, /SELECT|OPTION|BUTTON|^A\b/);
};

/**
 * Return whether the node or any of its ancestors is draggable
 * @param {Node} node  DOM Node
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isNodeDraggable = function (node) {
  return this._getFirstAncestor(node, "[draggable='true']", true) != null;
};

/**
 * Return whether the node is editable or clickable
 * @param {Node} node  DOM Node
 * @param {Object} type regex
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isNodeType = function (node, type) {
  var table = this._getTable();
  while (node != null && node !== table) {
    var nodeName = node.nodeName;
    if (nodeName === Table.DOM_ELEMENT._TD || nodeName === Table.DOM_ELEMENT._TH) {
      break;
    }

    // If the node is a text node, move up the hierarchy to only operate on elements
    // (on at least the mobile platforms, the node may be a text node)
    if (node.nodeType !== 3) { // 3 is Node.TEXT_NODE
      if (nodeName.match(type)) {
        var tabIndex = node.getAttribute(Table.DOM_ATTR._TABINDEX);
        // ignore elements with tabIndex == -1
        if (tabIndex !== -1) {
          return true;
        }
      }
    }
    // eslint-disable-next-line no-param-reassign
    node = node.parentNode;
  }
  return false;
};

/**
 * Callback handler for fetch start in the datasource.
 * @param {Object} event
 * @private
 */
Table.prototype._handleDataFetchStart = function () {
  this._setDataWaitingState();
};

/**
 * Set waiting state and show the Fetching Data... status message.
 * @private
 */
Table.prototype._setDataWaitingState = function (showMessage) {
  if (showMessage !== false) {
    this._showStatusMessage();
    this._hideNoDataMessage();
  }
  this._dataFetching = true;
  if (!this._dataResolveFunc) {
    this._dataResolveFunc = this._addComponentBusyState('is waiting for data.');
  }
};

/**
 * Clear waiting state and hide the Fetching Data... status message.
 * @private
 */
Table.prototype._clearDataWaitingState = function () {
  if (this._pendingFetchStale) {
    this._pendingFetchStale = false;
    this._queueTask(function () {
      this._beforeDataRefresh();
      return this._invokeDataFetchRows();
    }.bind(this));
  } else {
    this._hideStatusMessage();
    this._dataFetching = false;
    this._pendingFetchStale = false;
    if (this._dataResolveFunc) {
      this._dataResolveFunc();
      this._dataResolveFunc = null;
    }
  }
};

/**
 * Called by component to declare rendering is not finished. This method currently
 * handles the ready state for the component page level BusyContext
 * @private
 */
Table.prototype._setComponentNotReady = function () {
  // For page level BusyContext
  // If we've already registered a busy state with the page's busy context, don't need to do anything further
  if (!this._readyResolveFunc) {
    this._readyResolveFunc = this._addComponentBusyState('is being loaded.');
  }
};

/**
 * Called by component to declare rendering is finished. This method currently
 * handles the page level BusyContext.
 * @private
 */
Table.prototype._setComponentReady = function () {
  if (this._readyResolveFunc) {
    this._readyResolveFunc();
    this._readyResolveFunc = null;
  }
};

/**
 * Called by component to add a busy state and return the resolve function
 * to call when the busy state can be removed.
 * @param {String} msg the description of the busy state
 * @private
 */
Table.prototype._addComponentBusyState = function (msg) {
  var busyContext = Context.getContext(this.element[0]).getBusyContext();
  var options = {
    description: "The component identified by '" + this._getTableId() +
      "' " + msg
  };
  return busyContext.addBusyState(options);
};

/**
 * Creates a new component busy state, and adds it to the busy state stack.
 * @param {String} msg the description of the busy state
 * @return {Function} the resolve function to call when busy state can be removed.
 * @private
 */
Table.prototype._createComponentBusyState = function (msg) {
  var busyStateResolveFunc = this._addComponentBusyState(msg);
  if (this._busyStateStack == null) {
    this._busyStateStack = [];
  }
  this._busyStateStack.push(busyStateResolveFunc);
  return busyStateResolveFunc;
};

/**
 * Clears the busy state corresponding to the specified resolve function.
 * @param {Function} busyStateResolveFunc the specified resolve function
 * @private
 */
Table.prototype._clearComponentBusyState = function (busyStateResolveFunc) {
  if (this._busyStateStack) {
    var index = this._busyStateStack.indexOf(busyStateResolveFunc);
    if (index !== -1) {
      busyStateResolveFunc();
      this._busyStateStack.splice(index, 1);
    }
  }
};

/**
 * Clears all busy states in the pending busy state stack.
 * @private
 */
Table.prototype._clearBusyStateStack = function () {
  if (this._busyStateStack) {
    for (var i = 0; i < this._busyStateStack.length; i++) {
      this._busyStateStack[i]();
    }
    this._busyStateStack = null;
  }
};

/**
 * Sets the 'delayRefreshTableDimensions' busy state.
 * @private
 */
Table.prototype._setDelayRefreshTableDimensionsBusyState = function () {
  if (!this._delayRefreshTableDimensionsResolveFunc) {
    this._delayRefreshTableDimensionsResolveFunc = this._addComponentBusyState('is waiting to refresh dimensions.');
  }
};

/**
 * Clears the 'delayRefreshTableDimensions' busy state.
 * @private
 */
Table.prototype._clearDelayRefreshTableDimensionsBusyState = function () {
  if (this._delayRefreshTableDimensionsResolveFunc) {
    this._delayRefreshTableDimensionsResolveFunc();
    this._delayRefreshTableDimensionsResolveFunc = null;
  }
};

/**
 * Sets the 'focusout' busy state.
 * @private
 */
Table.prototype._setFocusoutBusyState = function () {
  if (!this._focusoutResolveFunc) {
    this._focusoutResolveFunc = this._addComponentBusyState('is handling focusout.');
  }
};

/**
 * Clears the 'focusout' busy state.
 * @private
 */
Table.prototype._clearFocusoutBusyState = function () {
  if (this._focusoutResolveFunc) {
    this._focusoutResolveFunc();
    this._focusoutResolveFunc = null;
  }
};

/**
 * Sets the 'idleRender' busy state.
 * @private
 */
Table.prototype._setIdleRenderBusyState = function () {
  if (!this._idleRenderResolveFunc) {
    this._idleRenderResolveFunc = this._addComponentBusyState('is waiting for idle rendering.');
  }
};

/**
 * Clears the 'idleRender' busy state.
 * @private
 */
Table.prototype._clearIdleRenderBusyState = function () {
  if (this._idleRenderResolveFunc) {
    this._idleRenderResolveFunc();
    this._idleRenderResolveFunc = null;
  }
};

/**
 * Sets the 'scrollPos' busy state.
 * @private
 */
Table.prototype._setScrollPosBusyState = function () {
  if (!this._scrollPosResolveFunc) {
    this._scrollPosResolveFunc = this._addComponentBusyState('is handling scroll position.');
  }
};

/**
 * Clears the 'scrollPos' busy state.
 * @private
 */
Table.prototype._clearScrollPosBusyState = function () {
  if (this._scrollPosResolveFunc) {
    this._scrollPosResolveFunc();
    this._scrollPosResolveFunc = null;
  }
};

/**
 * Clears all busy states that are currently set on the Table.
 * @private
 */
Table.prototype._clearAllComponentBusyStates = function () {
  this._clearBusyStateStack();
  // clear any pending fetch state to ensure clearing data waiting state below does not queue addition fetches
  this._pendingFetchStale = false;
  this._clearDataWaitingState();
  this._clearDelayRefreshTableDimensionsBusyState();
  this._clearFocusoutBusyState();
  this._clearIdleRenderBusyState();
  this._clearScrollPosBusyState();
  this._setComponentReady();
};

/**
 * Performs the cleanup necessary for 'destroy()' and 'ReleaseResources()' calls.
 * @param {boolean=} isDestroy whether this is a result of a call to 'destroy()'
 * @private
 */
Table.prototype._cleanComponent = function (isDestroy) {
  // cleanup needed for both, 'destroy()' and 'ReleaseResources()' calls

  // clear any pending timeouts
  this._clearAllComponentTimeouts();
  // remove any pending busy states
  this._clearAllComponentBusyStates();
  // clear any pending animation frames
  this._clearIdleCallback();
  // clear any existing DomScroller references
  this._unregisterDomScroller();

  if (isDestroy) {
    // cleanup needed for 'destroy()' call only
    $(this._getTableBody()).removeAttr(Components._OJ_CONTAINER_ATTR);

    this.element.children().remove('.' + Table.CSS_CLASSES._TABLE_HEADER_CLASS);
    this.element.children().remove('.' + Table.CSS_CLASSES._TABLE_BODY_CLASS);
    this.element.children().remove('.' + Table.CSS_CLASSES._TABLE_FOOTER_CLASS);
    this.element.children().remove('.' + Table.CSS_CLASSES._TABLE_STATUS_MESSAGE_CLASS);
    this.element.children().remove('.' + Table.CSS_CLASSES._TABLE_BODY_MESSAGE_ROW_CLASS);

    //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
    oj.DomUtils.unwrap(this.element, $(this._getTableContainer()));

    this.element[0].classList.remove(Table.CSS_CLASSES._TABLE_CLASS);

    // If this._data is a TableDataSourceAdapter, call destroy so that it can remove listeners
    // on the underlying DataSource to avoid stranding memory
    if (this._data instanceof oj.TableDataSourceAdapter) {
      this._data.destroy();
    }

    // If any template is being used, clean up the nodes to avoid memory leak in Knockout
    if (this._hasHeaderTemplate || this._hasCellTemplate ||
      this._hasFooterTemplate || this._hasRowTemplate) {
      this._cleanTemplateNodes(this.element[0]);
    }

    this._componentDestroyed = true;
  } else {
    // cleanup needed for 'ReleaseResources()' call only

    // unregister the listeners on the datasource
    this._unregisterDataSourceEventListeners();
    this._unregisterResizeListener();
  }
};

/**
 * Clears all pending component timeouts.
 * @private
 */
Table.prototype._clearAllComponentTimeouts = function () {
  this._clearFocusoutTimeout();
  this._clearShowStatusTimeout();
};

/**
 * Clears any pending focusout timeout.
 * @private
 */
Table.prototype._clearFocusoutTimeout = function () {
  if (this._focusoutTimeout) {
    clearTimeout(this._focusoutTimeout);
    this._focusoutTimeout = null;
  }
};

/**
 * Clears any pending show status timeout.
 * @private
 */
Table.prototype._clearShowStatusTimeout = function () {
  if (this._showStatusTimeout) {
    clearTimeout(this._showStatusTimeout);
    this._showStatusTimeout = null;
  }
};

/**
 * @private
 */
Table.prototype._setFinalTask = function (task) {
  this._finalTask = (task ? task.bind(this) : undefined);
};

/**
 * @private
 */
Table.prototype._hasPendingTasks = function () {
  return this._taskCount > 1;
};

/**
 * @private
 */
Table.prototype._queueTask = function (task) {
  if (!this._pendingTasks) {
    this._taskCount = 0;
    this._pendingTasks = Promise.resolve();
    this._setComponentNotReady();
  }
  this._taskCount += 1;
  this._pendingTasks = this._pendingTasks.then(function () {
    if (!this._componentDestroyed) {
      return task.bind(this)();
    }
    return undefined;
  }.bind(this)).then(function (value) {
    this._taskCount -= 1;
    if (this._taskCount === 0) {
      this._pendingTasks = undefined;
      try {
        if (!this._componentDestroyed) {
          if (this._finalTask) {
            this._finalTask();
          }
          this._trigger('ready');
        }
      } catch (err) {
        Logger.error(err);
      }
      // Need to remove busy state even if the component is destroyed
      this._setComponentReady();
    }
    return value;
  }.bind(this), function (error) {
    this._taskCount -= 1;
    if (this._taskCount === 0) {
      this._pendingTasks = undefined;
      Logger.error(error);
      this._setComponentReady();
    }

    return Promise.reject(error);
  }.bind(this));

  return this._pendingTasks;
};

/**
 * @override
 * @private
 */
Table.prototype._draw = function () {
  this._setFinalTask(function () {
    // avoid any unneccessarily costly operation that would cause hiccup when scrolling
    // this will be done when scrolling stops
    if (!this._skipRefreshTableDimension || !this._tableDimensionsInitialized) {
      this._syncTableSizing();
    }
    if (this._initialSelectionStateValidated) {
      this._syncSelectionState();
    } else {
      this._validateInitialSelectionState();
    }
    this._skipRefreshTableDimension = false;
    if (this._resetAriaLabel && this._accRowIndex != null && this._accColumnIndex != null) {
      this._updateAccStatusInfo(this._accRowIndex, this._accColumnIndex);
    }
    this._resetAriaLabel = false;
  }.bind(this));

  if (!this.element.is('table')) {
    var errSummary = Table._LOGGER_MSG._ERR_ELEMENT_INVALID_TYPE_SUMMARY;
    var errDetail = Table._LOGGER_MSG._ERR_ELEMENT_INVALID_TYPE_DETAIL;
    throw new RangeError(errSummary + '\n' + errDetail);
  }

  // add css class to element
  this.element[0].classList.add(Table.CSS_CLASSES._TABLE_ELEMENT_CLASS);
  this.element[0].setAttribute(Table.DOM_ATTR._ROLE, 'application'); // @HTMLUpdateOK

  // create the initial table structure
  this._createInitialTable(this._isTableHeaderless(), this._isTableFooterless());
  // style the initial table structure
  this._styleInitialTable();

  this._queueTask(function () {
    // populate the table header DOM with header content
    this._refreshTableHeader();
    // populate the table footer DOM with footer content
    this._refreshTableFooter();
    this._refreshTableBody();
    this._processSlottedChildren();
  }.bind(this));

  if (this.options.disabled) {
    this.disable();
  }
};

/**
 * @private
 */
Table.prototype._refresh = function () {
  var initFetch = false;

  if (this._dataOption !== this.options[Table._CONST_DATA]) {
    this._clearCachedDataMetadata();

    if (this._data == null) {
      // need to do an initial fetch
      initFetch = true;
    }
  }
  var contextMenu = this._GetContextMenu();
  if (contextMenu != null && contextMenu !== this._getContextMenuElement()) {
    this._createContextMenu(this._handleContextMenuSelect.bind(this));
  }
  this._clearCachedDom();
  this._refreshContextMenu();
  this._refreshTableStatusMessage();
  this._clearIdleCallback();

  if (initFetch) {
    return this._initFetch();
  }

  return this._queueTask(function () {
    return this._invokeDataFetchRows();
  }.bind(this));
};

/**
 * @param {Object} resultObject Object containing data array, key array, and index array
 * @param {number} startIndex start index
 * @return {Promise} Promise Return Promise which is resolved when the DOM has been updated and
 * all JET components in it have been resolved.
 * @private
 */
Table.prototype._refreshAll = function (resultObject, startIndex) {
  var promiseArray = [];
  if (this._isColumnMetadataUpdated() ||
      (!this._isTableHeaderColumnsRendered() && !this._isTableHeaderless())) {
    this._clearCachedMetadata();
    promiseArray.push(this._refreshTableHeader());

    // see if we need to clear the sort. If the column we sorted on is no
    // longer there then clear it.
    if (this._sortColumn != null) {
      var foundColumn = false;
      var columns = this._getColumnDefs();
      if (columns != null) {
        var columnsCount = columns.length;
        for (var i = 0; i < columnsCount; i++) {
          var column = columns[i];
          if (oj.Object.compareValues(column, this._sortColumn)) {
            foundColumn = true;
            break;
          }
        }
        if (!foundColumn) {
          this._initFetch(null, true);
        }
      }
    }
  }
  promiseArray.push(this._refreshTableFooter());
  promiseArray.push(this._refreshTableBody(resultObject, startIndex));

  return Promise.all(promiseArray);
};

/**
 * Refresh the table header
 * @private
 */
Table.prototype._refreshTableHeader = function () {
  var self = this;
  var columns = this._getColumnDefs();
  var tableHeader = this._getTableHeader();
  if (!tableHeader) {
    if (this._isTableHeaderless()) {
      return Promise.resolve();
    }

    // metadata could have been updated to add column headers
    tableHeader = this._createTableHeader();
    this._styleTableHeader(tableHeader);
  }

  var tableHeaderRow = this._getTableHeaderRow();
  this._unregisterChildStateListeners(tableHeaderRow);

  if (this._hasHeaderTemplate) {
    this._cleanTemplateNodes(tableHeaderRow);
    this._hasHeaderTemplate = false;
  }

  // remove all the existing column headers
  $(tableHeaderRow).empty();

  if (columns && columns.length > 0) {
    if (this._isDefaultSelectorEnabled()) {
      var tableHeaderSelectorColumn = this._createTableHeaderSelectorColumn();
      tableHeaderRow.appendChild(tableHeaderSelectorColumn); // @HTMLUpdateOK
    }
    var isDefaultHeaderTemplateSlotValid = this._isDefaultHeaderTemplateSlotValid();
    var columnsCount = columns.length;
    for (var i = 0; i < columnsCount; i++) {
      var column = columns[i];
      var headerRenderer = this._getColumnRenderer(i, 'header');
      var headerColumn = this._createTableHeaderColumn(i);

      if (headerRenderer) {
        // if headerRenderer is defined then call that
        var headerContext = this._getRendererContextObject(headerColumn, {});
        // Copy additional properties to top-level context to work with custom element
        var context = {
          headerContext: headerContext,
          columnIndex: i,
          data: column.headerText,
          componentElement: headerContext.componentElement,
          parentElement: headerContext.parentElement
        };

        if (column.sortable === Table._OPTION_ENABLED) {
          // add the sortable icon renderer
          context.columnHeaderSortableIconRenderer = function (options, delegateRenderer) {
            self._columnHeaderSortableIconRenderer(this, delegateRenderer);
          };
        } else {
          context.columnHeaderDefaultRenderer = function (options, delegateRenderer) {
            self._columnHeaderDefaultRenderer(this, delegateRenderer);
          };
        }
        var headerColumnContent = headerRenderer(context);

        if (headerColumnContent != null) {
          // if the renderer returned a value then we set it as the content
          // for the headerColumn
          $(headerColumn).empty();
          // Use jquery append() for this as a convenience because
          // headerColumnContent could be a Node element or arbitrary content and
          // we don't want to write code to convert everything to Node type and call
          // appendChild.
          $(headerColumn).append(headerColumnContent); // @HTMLUpdateOK
        } else {
          // if the renderer didn't return a value then the existing
          // headerColumn was manipulated. So get it and set the required
          // attributes just in case it was replaced or the attributes
          // got removed
          headerColumn = $(tableHeaderRow).children()[i];
          this._setTableHeaderColumnAttributes(i, headerColumn);
          this._styleTableHeaderColumn(i, headerColumn, false);
        }
      } else {
        var headerSlotTemplate = this._getSlotTemplate(column[Table._HEADER_TEMPLATE]);
        if (headerSlotTemplate == null && isDefaultHeaderTemplateSlotValid) {
          headerSlotTemplate = this._getSlotTemplate('headerTemplate');
        }
        if (headerSlotTemplate) {
          var componentElement = this._getRootElement();
          var templateEngine = this._getTemplateEngine();
          if (templateEngine != null) {
            if (headerColumn) {
              $(headerColumn).empty();
            }
            var slotContext = this._getHeaderSlotTemplateContextObject(column.headerText, i);
            var headerContent = templateEngine.execute(
              componentElement, headerSlotTemplate, slotContext, this.options.as);
            if (!(headerContent instanceof Array)) {
              headerContent = [headerContent];
            }

            // eslint-disable-next-line no-loop-func
            headerContent.map(function (content) {
              headerColumn.appendChild(content);
              return undefined;
            });
            this._hasHeaderTemplate = true;
          }
        }
      }
    }
    this._renderedTableHeaderColumns = true;
  }
  return this._finalizeRowRendering([tableHeaderRow]);
};

/**
 * Refresh the table footer
 * @private
 */
Table.prototype._refreshTableFooter = function () {
  var columns = this._getColumnDefs();
  var tableFooter = this._getTableFooter();
  if (!tableFooter) {
    if (this._isTableFooterless()) {
      return Promise.resolve();
    }

    // metadata could have been updated to add column headers
    tableFooter = this._createTableFooter();
    this._styleTableFooter(tableFooter);
  }

  tableFooter.style[Table.CSS_PROP._VISIBILITY] = Table.CSS_VAL._HIDDEN;
  var tableFooterRow = this._getTableFooterRow();

  if (this._hasFooterTemplate) {
    this._cleanTemplateNodes(tableFooterRow);
    this._hasFooterTemplate = false;
  }
  // remove all the existing footer cells
  $(tableFooterRow).empty();

  if (columns && columns.length > 0) {
    var isDefaultFooterTemplateSlotValid = this._isDefaultFooterTemplateSlotValid();
    var columnsCount = columns.length;
    for (var i = 0; i < columnsCount; i++) {
      var column = columns[i];
      var footerRenderer = this._getColumnRenderer(i, 'footer');
      var footerCell = this._createTableFooterCell();
      this._styleTableFooterCell(i, footerCell);
      this._insertTableFooterCell(i, footerCell);

      if (footerRenderer) {
        // if footerRenderer is defined then call that
        var footerContext = this._getRendererContextObject(footerCell, {});
        // Copy additional properties to top-level context to work with custom element
        var context = {
          footerContext: footerContext,
          columnIndex: i,
          componentElement: footerContext.componentElement,
          parentElement: footerContext.parentElement
        };
        var footerCellContent = footerRenderer(context);

        if (footerCellContent != null) {
          // if the renderer returned a value then we set it as the content
          // for the footer cell
          $(footerCell).empty();
          // Use jquery append() for this as a convenience because
          // footerCellContent could be a Node element or arbitrary content and
          // we don't want to write code to convert everything to Node type and call
          // appendChild.
          $(footerCell).append(footerCellContent); // @HTMLUpdateOK
        } else {
          // if the renderer didn't return a value then the existing
          // footer cell was manipulated. So get it and set the required
          // attributes just in case it was replaced or the attributes
          // got removed
          footerCell = $(tableFooterRow).children()[i];
          this._styleTableFooterCell(i, footerCell);
        }
      } else {
        var footerSlotTemplate = this._getSlotTemplate(column[Table._FOOTER_TEMPLATE]);
        if (footerSlotTemplate == null && isDefaultFooterTemplateSlotValid) {
          footerSlotTemplate = this._getSlotTemplate('footerTemplate');
        }
        if (footerSlotTemplate) {
          var componentElement = this._getRootElement();
          var templateEngine = this._getTemplateEngine();
          if (templateEngine != null) {
            var slotContext = this._getSlotTemplateContextObject();
            var footerContent = templateEngine.execute(componentElement, footerSlotTemplate,
                                                       slotContext, this.options.as);
            if (!(footerContent instanceof Array)) {
              footerContent = [footerContent];
            }

            // eslint-disable-next-line no-loop-func
            footerContent.map(function (content) {
              footerCell.appendChild(content);
              return undefined;
            });
            this._hasFooterTemplate = true;
          }
        }
      }
    }
    if (this._isDefaultSelectorEnabled()) {
      var placeholderCell = this._createTableFooterCell();
      tableFooterRow.insertBefore(placeholderCell, tableFooterRow.firstChild);
    }
  }
  return this._finalizeRowRendering([tableFooterRow]);
};

/**
 * Refresh the entire table body with data from the datasource
 * @param {Object} resultObject Object containing data array, key array, and index array
 * @param {number} startIndex start index
 * @return {Promise} Promise Return Promise which is resolved when the DOM has been updated and
 * all JET components in it have been resolved.
 * @private
 */
Table.prototype._refreshTableBody = function (resultObject, startIndex) {
  var tableBody = this._getTableBody();
  if (tableBody == null) {
    return Promise.resolve();
  }

  var rows = this._getRowIdxRowArray(resultObject, startIndex);
  var checkFocus = $.contains(tableBody, document.activeElement);
  var tableBodyRows;
  var tableBodyRow;
  var resetFocus = false;
  var i;

  // Reset _scrollLeft and scrollTop to 0 if undefined to prevent later issues.
  this._scrollLeft = this._scrollLeft === undefined ? 0 : this._scrollLeft;
  this._scrollTop = this._scrollTop === undefined ? 0 : this._scrollTop;

  if (startIndex === 0) {
    if (checkFocus) {
      resetFocus = true;
    }
    this._removeAllTableBodyRows();
  } else {
    tableBodyRows = this._getTableBodyRows();
    if (tableBodyRows.length > 0) {
      var tableBodyRowsCount = tableBodyRows.length;
      for (i = tableBodyRowsCount - 1; i >= startIndex; i--) {
        if (checkFocus) {
          tableBodyRow = this._getTableBodyRow(i);

          if (tableBodyRow != null &&
                $.contains(tableBodyRow, document.activeElement)) {
            resetFocus = true;
            checkFocus = false;
          }
        }
        this._removeTableBodyRow(i);
      }
    }
  }

  if (resetFocus) {
    this._getTable().focus();
  }
  this._clearCachedDomRowData();
  this._hideNoDataMessage();
  tableBodyRows = tableBody.children;

  // if no data then bail
  if (rows.length === 0 && tableBodyRows.length === 0) {
    this._showNoDataMessage();
  } else {
    var tableBodyDocFrag;

    // for the pre-fetching case, we'll render items during idle cycles
    // don't do it when the scroll is caused by handling scroll position
    if (startIndex > 0 && this._isOverflow() && !this._fetchBySyncScroll) {
      return new Promise(function (resolve, reject) {
        this._setIdleRenderBusyState();

        // clone the rows array since we'll manipulate it
        this._renderRowsWhenIdle(rows.slice(0), tableBody, startIndex, resolve, reject,
          resultObject.isMouseWheel);
      }.bind(this));
    }

    tableBody.style[Table.CSS_PROP._VISIBILITY] = Table.CSS_VAL._HIDDEN;
    // clear cached dimensions to ensure table will be fully visible once render cycle completes
    this._cacheDomDimensions = {};
    this._skipRefreshTableDimension = false;

    tableBodyDocFrag = document.createDocumentFragment();
    var rowsCount = rows.length;
    for (i = 0; i < rowsCount; i++) {
      this._renderRow(rows[i], tableBodyDocFrag, startIndex);
    }
    tableBody.appendChild(tableBodyDocFrag); // @HTMLUpdateOK
    return this._afterRowsRendered(tableBody);
  }
  return Promise.resolve();
};

/**
 * Returns whether the selector is enabled
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isDefaultSelectorEnabled = function () {
  if (this._defaultOptions == null) {
    this._defaultOptions = ThemeUtils.parseJSONFromFontFamily('oj-table-option-defaults');
  }
  if (this._defaultOptions.enableSelector === true &&
    this._getRowSelectionMode() === Table._OPTION_SELECTION_MODES._MULTIPLE) {
    return true;
  }
  return false;
};

/**
 * Refresh the row at a particular index with the row data
 * @param {number} rowIdx  row index relative to the start of the table
 * @param {Object} row  row and key object
 * @param {Object} tableBodyRow tr element
 * @param {Object} docFrag  document fragment
 * @param {number} docFragStartIdx  document fragment row start index
 * @return {Element|null} tableBodyRow  DOM element
 * @private
 */
Table.prototype._refreshTableBodyRow = function (rowIdx, row, tableBodyRow, docFrag,
  docFragStartIdx) {
  var rowRenderer = this._getRowRenderer();
  var tableBody = this._getTableBody();

  if (isNaN(rowIdx) || rowIdx < 0) {
    // validate rowIdx value
    Logger.error('Error: Invalid rowIdx value: ' + rowIdx);
  }

  var rowHashCode = this._hashCode(row[Table._CONST_KEY]);

  if (tableBodyRow == null) {
    // check if we already have a <tr> element at that index
    // eslint-disable-next-line no-param-reassign
    tableBodyRow = this._getTableBodyRow(rowIdx);
    if (!tableBodyRow) {
      // if not return
      return null;
    }

    if (this._hasCellTemplate || this._hasRowTemplate) {
      this._cleanTemplateNodes(tableBodyRow);
      // No need to set this._hasCellTemplate to false here since only one row is refreshed
    }
    $(tableBodyRow).empty();
  }

  this._hideNoDataMessage();

  var currentRow = this._getCurrentRow();
  currentRow = currentRow || {};
  var rowContext = this._getRendererContextObject(tableBodyRow, {
    row: row,
    isCurrentRow: currentRow.rowIndex === rowIdx
  });
  // Copy additional properties to top-level context to work with custom element
  var context = {
    rowContext: rowContext,
    row: row[Table._CONST_DATA],
    componentElement: rowContext.componentElement,
    parentElement: rowContext.parentElement,
    data: row[Table._CONST_DATA]
  };

  var columns = this._getColumnDefs();
  if (rowRenderer != null || (this._isDefaultRowTemplateSlotValid() &&
    this._getSlotTemplate('rowTemplate') !== null)) {
    if (rowRenderer != null) {
      var rowContent = rowRenderer(context);
      if (rowContent != null) {
        // if the renderer returned a value then we set it as the content
        // for the row
        tableBodyRow.appendChild(rowContent); // @HTMLUpdateOK
      } else if (docFrag == null) {
        // if the renderer didn't return a value then the existing
        // row was manipulated. So get it and set the required
        // attributes just in case it was replaced or the attributes
        // got removed
        // eslint-disable-next-line no-param-reassign
        tableBodyRow = tableBody.children[rowIdx];
      } else {
        // eslint-disable-next-line no-param-reassign
        docFragStartIdx = docFragStartIdx == null ? 0 : docFragStartIdx;
        if (!docFrag.children) {
          // use jquery children() because documentFragments do not have
          // good browser support for .children
          // eslint-disable-next-line no-param-reassign
          tableBodyRow = $(docFrag).children()[rowIdx - docFragStartIdx];
        } else {
          // eslint-disable-next-line no-param-reassign
          tableBodyRow = docFrag.children[rowIdx - docFragStartIdx];
        }
      }
    } else {
      var rowSlotTemplate = this._getSlotTemplate('rowTemplate');
      var componentElement = this._getRootElement();
      var templateEngine = this._getTemplateEngine();
      if (templateEngine != null) {
        var slotContext = this._getRowSlotTemplateContextObject(context);
        var nodes = templateEngine.execute(componentElement, rowSlotTemplate,
                      slotContext, this.options.as);
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].tagName === 'TR') {
            tableBodyRow.parentNode.replaceChild(nodes[i], tableBodyRow);
            break;
          } else {
            tableBodyRow.appendChild(nodes[i]); // @HTMLUpdateOK
          }
        }
        if (docFrag == null) {
          // eslint-disable-next-line no-param-reassign
          tableBodyRow = tableBody.children[rowIdx];
        } else {
          // eslint-disable-next-line no-param-reassign
          docFragStartIdx = docFragStartIdx == null ? 0 : docFragStartIdx;
          if (!docFrag.children) {
            // use jquery children() because documentFragments do not have
            // good browser support for .children
            // eslint-disable-next-line no-param-reassign
            tableBodyRow = $(docFrag).children()[rowIdx - docFragStartIdx];
          } else {
            // eslint-disable-next-line no-param-reassign
            tableBodyRow = docFrag.children[rowIdx - docFragStartIdx];
          }
        }
        // eslint-disable-next-line no-param-reassign
        this._hasRowTemplate = true;
      }
    }

    this._clearCachedDomRowData();
    this._setTableBodyRowAttributes(row, tableBodyRow);
    this._styleTableBodyRow(tableBodyRow, false);

    // set the cell attributes and styling.
    var tableBodyCells = this._getTableElementsByTagName(tableBodyRow, Table.DOM_ELEMENT._TD);
    var tableBodyCellsCount = tableBodyCells.length;
    var tableBodyCell;
    for (let i = 0; i < tableBodyCellsCount; i++) {
      tableBodyCell = tableBodyCells[i];
      this._setTableBodyCellAttributes(rowIdx, row[Table._CONST_KEY],
                                       rowHashCode, i, tableBodyCell);
      this._styleTableBodyCell(i, tableBodyCell, false);
    }

    // sort the re-ordered columns in place
    if (this._columnsDestMap != null) {
      for (let i = 0; i < this._columnsDestMap.length; i++) {
        if (this._columnsDestMap[i] > i) {
          var moveTableBodyCell = tableBodyCells[this._columnsDestMap[i]];
          var swapTableBodyCell = tableBodyCells[i];
          moveTableBodyCell.parentNode.insertBefore(moveTableBodyCell, swapTableBodyCell); // @HTMLUpdateOK
          tableBodyCells = this._getTableElementsByTagName(tableBodyRow, Table.DOM_ELEMENT._TD);
        }
      }
    }
    if (columns != null && columns.length > 0 && this._isDefaultSelectorEnabled()) {
      this._createTableBodyDefaultSelector(row.key, tableBodyRow);
    }
  } else {
    if (columns != null && columns.length > 0 && this._isDefaultSelectorEnabled()) {
      this._createTableBodyDefaultSelector(row.key, tableBodyRow);
    }
    this._tableBodyRowDefaultRenderer(rowIdx, row, context);
  }
  if (this._hasEditableRow() && this._getEditableRowIdx() === rowIdx) {
    tableBodyRow.classList.add(Table.CSS_CLASSES._TABLE_DATA_ROW_EDIT_CLASS);
  } else {
    tableBodyRow.classList.remove(Table.CSS_CLASSES._TABLE_DATA_ROW_EDIT_CLASS);
  }
  return tableBodyRow;
};

/**
 * Waits for any children components of the given body rows to finish rendering.
 * Disables any and all focusable elements within those rows if not editable.
 * @param {Array<Element>} rowElements the row elements to finalize
 * @returns {Promise}
 * @private
 */
Table.prototype._finalizeBodyRowRendering = function (rowElements) {
  return this._waitForAllBodyElementsToResolve(rowElements).then(function () {
    var editableRowKey = this._hasEditableRow() ? this._getEditableRowKey() : null;
    rowElements.forEach(function (tableBodyRow) {
      var rowKey = this._getRowKey(tableBodyRow);
      // disable all focusable content unless this is the current edit row
      if (!(editableRowKey != null && oj.KeyUtils.equals(rowKey, editableRowKey))) {
        DataCollectionUtils.disableAllFocusableElements(tableBodyRow);
      }
    }.bind(this));
    return Promise.resolve(true);
  }.bind(this));
};

/**
 * Waits for any children components of the given rows to finish rendering.
 * Disables any and all focusable elements within those rows.
 * @param {Array<Element>} rowElements the row elements to finalize
 * @returns {Promise}
 * @private
 */
Table.prototype._finalizeRowRendering = function (rowElements) {
  return this._waitForAllElementsToResolve(rowElements).then(function () {
    rowElements.forEach(function (rowElement) {
      DataCollectionUtils.disableAllFocusableElements(rowElement);
    });
    return Promise.resolve(true);
  });
};

/**
 * Returns a Promise which resolves when all JET elements in the array of rows have resolved
 * @param {Array<Element>} elements Array of DOM elements
 * @return {Promise} Promise which resolves when all child JET elements have resolved
 * @private
 */
Table.prototype._waitForAllBodyElementsToResolve = function (elements) {
  // Only bother checking if there are templates/renderers defined. If not,
  // JET elements can't be embedded in the cells so we can skip the check
  if (elements.length > 0 && this._hasRowOrCellRendererOrTemplate()) {
    return this._waitForAllElementsToResolve(elements);
  }
  return Promise.resolve();
};

/**
 * Returns a Promise which resolves when all JET elements in the array have resolved
 * @param {Array<Element>} elements Array of DOM elements
 * @return {Promise} Promise which resolves when all child JET elements have resolved
 * @private
 */
Table.prototype._waitForAllElementsToResolve = function (elements) {
  var busyContextPromiseArray = [];
  elements.forEach(function (element) {
    // Only wait on busyContext of non-null row elements. Othwerise, busy state lock can occur
    if (element) {
      busyContextPromiseArray.push(Context.getContext(element).getBusyContext().whenReady());
    }
  });
  return Promise.all(busyContextPromiseArray);
};

/**
 * Internal method for refreshRow
 * @param {number} rowIdx  Index of the row to refresh.
 * @param {boolean} resetFocus  true to reset focus if needed; false to ignore focus.
 * @return {Promise.<boolean>} Promise resolves when done to true if refreshed, false if not
 * @private
 */
Table.prototype._refreshRow = function (rowIdx, resetFocus) {
  var dataprovider = this._getData();
  // if no data then bail
  if (!dataprovider) {
    return Promise.resolve(false);
  }

  var tableBodyRows = this._getTableBodyRows();

  if (isNaN(rowIdx) || rowIdx < 0 || rowIdx >= tableBodyRows.length || tableBodyRows.length === 0) {
    // validate rowIdx value
    var errSummary = Table._LOGGER_MSG._ERR_REFRESHROW_INVALID_INDEX_SUMMARY;
    var errDetail = Translations.applyParameters(
      Table._LOGGER_MSG._ERR_REFRESHROW_INVALID_INDEX_DETAIL, { rowIdx: rowIdx.toString() });
    throw new RangeError(errSummary + '\n' + errDetail);
  }

  // get row at rowIdx
  var rowKey = this._getRowKeyForRowIdx(rowIdx);
  return this._queueTask(function () {
    return dataprovider.fetchByKeys({ keys: new Set([rowKey]) }).then(function (keyResult) {
      if (keyResult == null ||
          keyResult.results == null ||
          keyResult.results.size === 0) {
        return Promise.resolve(false);
      }

      // Find out if the row contains the focus element.  Focus will be lost to the document body after refresh.
      var tableBodyRow = this._getTableBodyRow(rowIdx);
      // eslint-disable-next-line no-param-reassign
      resetFocus = resetFocus && $.contains(tableBodyRow, document.activeElement);

      var rowResults = keyResult.results.get(rowKey);
      this._refreshTableBodyRow(rowIdx, {
        data: rowResults.data,
        metadata: rowResults.metadata,
        index: rowIdx,
        key: rowKey
      });

      // Give the focus back to the table if needed.  currentRow is retained after refresh.
      if (resetFocus) {
        this._getTable().focus();
      }

      tableBodyRow = this._getTableBodyRow(rowIdx);
      if (tableBodyRow) {
        return this._finalizeBodyRowRendering([tableBodyRow]);
      }
      // in case of null row, just resolve promise as there is no element to wait on
      return Promise.resolve(true);
    }.bind(this));
  }.bind(this));
};

/**
 * Refresh the status message
 * @private
 */
Table.prototype._refreshTableStatusMessage = function () {
  var tableStatusMessage = this._getTableStatusMessage();
  if (tableStatusMessage != null) {
    $(tableStatusMessage).remove();
  }
  this._createTableStatusMessage();
};

/**
 * Show the Fetching Data... status message.
 * @private
 */
Table.prototype._showStatusMessage = function () {
  if (this._showStatusTimeout) {
    return;
  }
  if (!this._statusMessageShown && !this._tempSkeletonRow) {
    this._showStatusTimeout = setTimeout(function () { // @HTMLUpdateOK
      this._refreshTableStatusPosition(true);
      this._showStatusTimeout = null;
    }.bind(this), this._getShowStatusDelay());
    if (this._isSkeletonSupport()) {
      // clear any exisiting table rows (if a sort for example)
      this._removeAllTableBodyRows();
    }
  }
};

/**
 * @private
 */
Table.prototype._showProgressiveLoading = function () {
  if (this._isSkeletonSupport()) {
    var tableBodyRows = this._getTableBodyRows();
    if (tableBodyRows != null && tableBodyRows.length > 0 && !this._tempSkeletonRow) {
      // add temporary table row for load more on scroll skeleton behavior
      this._tempSkeletonRow = this._createTableBodyRow();
      var tempCell = this._createTableBodyCell();
      tempCell.colSpan = this._getColumnDefs().length;
      for (var i = 0; i < 3; i++) {
        tempCell.appendChild(this._createSkeletonRow()); // @HTMLUpdateOK
      }
      this._tempSkeletonRow.appendChild(tempCell); // @HTMLUpdateOK
      this._getTableBody().appendChild(this._tempSkeletonRow);
      this._skeletonHWMSFadeInEndListener = function () {
        this._tempSkeletonRow.classList.remove('oj-animation-skeleton-fade-in');
        var skeletonRows = this._tempSkeletonRow.querySelectorAll('.oj-table-skeleton-row');
        skeletonRows.forEach(function (row) {
          row.classList.add('oj-animation-skeleton');
        });
        this._tempSkeletonRow.removeEventListener('animationend', this._skeletonHWMSFadeInEndListener);
      }.bind(this);
      this._tempSkeletonRow.addEventListener('animationend', this._skeletonHWMSFadeInEndListener);
      this._tempSkeletonRow.classList.add('oj-animation-skeleton-fade-in');
    }
  }
};

/**
 * Hide the Fetching Data... status message.
 * @private
 */
Table.prototype._hideStatusMessage = function () {
  this._clearShowStatusTimeout();
  if (this._statusMessageShown || this._tempSkeletonRow) {
    var statusMessage = this._getTableStatusMessage();
    statusMessage.style[Table.CSS_PROP._DISPLAY] = Table.CSS_VAL._NONE;

    if (this._isSkeletonSupport()) {
      if (this._tempSkeletonRow != null) {
        this._getTableBody().removeChild(this._tempSkeletonRow);
        this._tempSkeletonRow = null;
      } else {
        var skeletonRows = statusMessage.childNodes;
        for (var i = skeletonRows.length; i > 0; i--) {
          statusMessage.removeChild(skeletonRows[i - 1]);
        }
      }
    }
    this._statusMessageShown = false;
  }
};

/**
 * Return whether the status message is shown
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isStatusMessageShown = function () {
  return this._statusMessageShown;
};

/**
 * @private
 */
Table.prototype._getDefaultOptions = function () {
  if (this._defaultOptions == null) {
    this._defaultOptions = ThemeUtils.parseJSONFromFontFamily('oj-table-option-defaults') || {};
  }
  return this._defaultOptions;
};

/**
 * Retrieve the delay before showing status
 * @return {number} the delay in ms
 * @private
 */
Table.prototype._getShowStatusDelay = function () {
  var delay = parseInt(this._getDefaultOptions().showIndicatorDelay, 10);
  return isNaN(delay) ? 0 : delay;
};

/**
 * Whether or not skeleton loading should be used
 * @private
 */
Table.prototype._isSkeletonSupport = function () {
  return this._getDefaultOptions().loadIndicator === 'skeleton';
};

/**
 * Show the 'No data to display.' or 'Initializing...' message.
 * @private
 */
Table.prototype._showNoDataMessage = function () {
  if (!this._noDataMessageShown) {
    var messageRow = this._getTableBodyMessageRow();
    var dataprovider = this._getData();
    var noDataTemplate = this._getSlotTemplate('noData');
    if (this._isDefaultTemplateSlotValid('noData') &&
      noDataTemplate !== null) {
      var table = this._getTable();
      var tableBody = this._getTableBody();
      table.classList.add(Table.CSS_CLASSES._TABLE_NO_DATA_CONTAINER_CLASS);
      var noDataContentRow = document.createElement(Table.DOM_ELEMENT._TR); // @HTMLUpdateOK
      noDataContentRow.classList.add(Table.CSS_CLASSES._TABLE_NO_DATA_CONTAINER_CLASS);
      var tableContainer = this._getTableContainer();
      if (tableContainer.classList.contains(Table.CSS_CLASSES._TABLE_SCROLL_VERTICAL_CLASS)) {
        noDataContentRow.classList.add(Table.CSS_CLASSES._TABLE_NO_DATA_ROW_CLASS);
      }
      tableBody.appendChild(noDataContentRow); // @HTMLUpdateOK
      var noDataContentCell = document.createElement(Table.DOM_ELEMENT._TD); // @HTMLUpdateOK
      var columnCount = this._getColumnDefs().length;
      if (this._isDefaultSelectorEnabled()) {
        // eslint-disable-next-line no-param-reassign
        columnCount += 1;
      }
      noDataContentCell.setAttribute(Table.DOM_ATTR._COLSPAN, columnCount); // @HTMLUpdateOK
      noDataContentRow.appendChild(noDataContentCell); // @HTMLUpdateOK
      var templateEngine = this._getTemplateEngine();
      if (templateEngine != null) {
        var nodes = templateEngine.execute(this._getRootElement(), noDataTemplate,
          {}, null);
        nodes.forEach(function (node) {
          noDataContentCell.appendChild(node); // @HTMLUpdateOK
        });
      }
    } else {
      var emptyTextMsg = null;
      if (this.options.emptyText != null) {
        emptyTextMsg = this.options.emptyText;
      } else {
        emptyTextMsg = this.getTranslatedString(Table._BUNDLE_KEY._MSG_NO_DATA);
      }
      // if data is null then we are initializing
      var messageText = dataprovider != null ?
          emptyTextMsg : this.getTranslatedString(Table._BUNDLE_KEY._MSG_INITIALIZING);

      if (messageRow == null) {
        this._createTableBodyMessageRow(this._getColumnDefs().length, messageText);
      } else {
        this._setTableBodyMessage(messageText);
      }
    }
    this._noDataMessageShown = true;
  }
};

/**
 * Hide the 'No data to display.' message.
 * @private
 */
Table.prototype._hideNoDataMessage = function () {
  if (this._noDataMessageShown) {
    var tableBodyMessageRow = this._getTableBodyMessageRow();
    if (tableBodyMessageRow != null) {
      $(tableBodyMessageRow).remove();
    } else {
      var table = this._getTable();
      if (table.classList.contains(Table.CSS_CLASSES._TABLE_NO_DATA_CONTAINER_CLASS)) {
        table.classList.remove(Table.CSS_CLASSES._TABLE_NO_DATA_CONTAINER_CLASS);
        var noDataRow = table.querySelector('tr.' +
          Table.CSS_CLASSES._TABLE_NO_DATA_CONTAINER_CLASS);
        if (noDataRow != null) {
          this._cleanTemplateNodes(noDataRow);
          $(noDataRow).remove();
        }
      }
    }
    this._noDataMessageShown = false;
  }
};

/**
 * Callback from the resize popup box
 * @param {Event} event the event that triggered the popup button press
 * @private
 */
Table.prototype._handleContextMenuResizePopup = function () {
  var spinner = document.getElementById(
    this._getTableId() + '_resize_popup_spinner');
  var popup = this._getContextMenuResizePopup();
  var columnIdx = parseInt(popup.getAttribute('data-oj-columnIdx'), 10);
  var widthValue;
  if (this._IsCustomElement()) {
    widthValue = spinner.value;
    popup.close();
  } else {
    widthValue = $(spinner).ojInputNumber('option', 'value');
    $(popup).ojPopup('close');
  }
  var clonedColumnsOption = [];
  var columnsCount = this.options.columns.length;

  for (var i = 0; i < columnsCount; i++) {
    clonedColumnsOption[i] = $.extend({}, {}, this.options.columns[i]);
  }
  clonedColumnsOption[columnIdx].width = widthValue;
  this.option('columns', clonedColumnsOption, {
    _context: {
      writeback: true,
      internalSet: true
    }
  });
  this._clearCachedMetadata();
  this._queueTask(function () {
    // delay the focus to ensure table is fully updated before focus is restored
    setTimeout(function () { // @HTMLUpdateOK
      this._getTable().focus();
    }.bind(this), 0);
  }.bind(this));
};

/**
 * Handle an ojselect event on a menu item, if sort call the handler on the core.
 * If resize prompt the user with a popup
 * @private
 */
Table.prototype._handleContextMenuSelect = function (event, ui) {
  var item;
  if (ui) {
    item = ui.item;
  } else {
    item = $(event.target);
  }
  var menuItemCommand = item.attr('data-oj-command');
  var headerColumn = this._getFirstAncestor(this._contextMenuEvent.target,
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS, true);
  headerColumn = headerColumn == null ? this._contextMenuEventHeaderColumn : headerColumn;
  var tableBodyCell = this._getFirstAncestor(this._contextMenuEvent.target,
    '.' + Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
  var columnIdx = null;

  if (headerColumn != null) {
    columnIdx = this._getElementColumnIdx(headerColumn);
  }
  if (tableBodyCell != null) {
    columnIdx = this._getElementColumnIdx(tableBodyCell);
  }
  if (columnIdx === null) {
    return;
  }
  if (menuItemCommand === 'oj-table-sortAsc') {
    this._handleSortTableHeaderColumn(columnIdx, true, event);
  } else if (menuItemCommand === 'oj-table-sortDsc') {
    this._handleSortTableHeaderColumn(columnIdx, false, event);
  } else if (menuItemCommand === 'oj-table-enableNonContiguousSelection') {
    this._nonContiguousSelection = true;
    this._removeTableBodyRowTouchSelectionAffordance();
    // update to disable command
    item.attr('data-oj-command', 'oj-table-disableNonContiguousSelection');
    item.children().first()
      .text(this.getTranslatedString('labelDisableNonContiguousSelection'));
  } else if (menuItemCommand === 'oj-table-disableNonContiguousSelection') {
    this._nonContiguousSelection = false;
    // update to enable command
    item.attr('data-oj-command', 'oj-table-enableNonContiguousSelection');
    item.children().first()
      .text(this.getTranslatedString('labelEnableNonContiguousSelection'));
  } else if (menuItemCommand === 'oj-table-resize') {
    var popup = this._getContextMenuResizePopup();
    popup.setAttribute('data-oj-columnIdx', columnIdx);

    var target = headerColumn || tableBodyCell;
    var columnWidth = this._getColumnWidthProperty(target);

    var launcher;
    if (headerColumn != null) {
      launcher = headerColumn;
    } else if (tableBodyCell != null) {
      launcher = tableBodyCell;
    } else {
      // this should never happen
      launcher = this._getTable();
    }

    var spinner = document.getElementById(
      this._getTableId() + '_resize_popup_spinner');
    if (this._IsCustomElement()) {
      spinner.value = Math.round(columnWidth);
      popup.open(launcher);
    } else {
      $(spinner).ojInputNumber('option', 'value', Math.round(columnWidth));
      $(popup).ojPopup('open', launcher);
    }
  }
};

/**
 * Register event listeners for resize the container DOM element.
 * @private
 */
Table.prototype._registerResizeListener = function () {
  var element = this._getTableContainer();
  if (!this._resizeListener) {
    this._resizeListener = function () {
      var tableContainer = this._getTableContainer();
      // Check if the width and height values should result in a sizing refresh
      if (this._isSizingRefreshRequired(tableContainer.offsetWidth, tableContainer.offsetHeight)) {
        // refresh dimensions if no tasks are pending since refresh dimensions runs during final task
        if (!this._hasPendingTasks()) {
          // pass in 'true' since we have already completed the '_isSizingRefreshRequired' check above
          this._syncTableSizing(true);
        }
      }
    }.bind(this);
  }
  if (!this._isResizeListenerAdded) {
    oj.DomUtils.addResizeListener(element, this._resizeListener, 50);
    this._isResizeListenerAdded = true;
  }
};

/**
 * Unregister event listeners for resize the container DOM element.
 * @private
 */
Table.prototype._unregisterResizeListener = function () {
  var element = this._getTableContainer();
  oj.DomUtils.removeResizeListener(element, this._resizeListener);
  this._isResizeListenerAdded = false;
};

/**
 * Unregister _focusable(), etc, which were added to the child elements
 * @param {Element} parent div DOM element
 * @private
 */
Table.prototype._unregisterChildStateListeners = function (parent) {
  var elements = parent.querySelectorAll('*');
  for (var i = 0; i < elements.length; i++) {
    this._UnregisterChildNode(elements[i]);
  }
};

/**
 * Is loadMoreOnScroll
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isLoadMoreOnScroll = function () {
  if (this.options.scrollPolicy === Table._OPTION_SCROLL_POLICY._AUTO) {
    // maintain old 'auto' behavior for legacy DataSource
    return !(this._data instanceof oj.TableDataSourceAdapter);
  }
  return this.options.scrollPolicy !== Table._OPTION_SCROLL_POLICY._LOAD_ALL;
};

/**
 * Returns whether the table is headerless
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isTableHeaderless = function () {
  var columns = this._getColumnDefs();
  var columnsCount = columns.length;
  for (var i = 0; i < columnsCount; i++) {
    var headerSlotTemplate = this._getSlotTemplate(columns[i][Table._HEADER_TEMPLATE]);
    if (columns[i].headerText != null || columns[i].headerStyle != null ||
        (columns[i].sortable != null && columns[i].sortable !== Table._OPTION_DISABLED) ||
        columns[i].sortProperty != null || columns[i].headerRenderer != null ||
        headerSlotTemplate != null) {
      return false;
    }
  }
  // check for default slot header template
  if (this._isDefaultHeaderTemplateSlotValid()) {
    var defaultHeaderSlotTemplate = this._getSlotTemplate('headerTemplate');
    if (defaultHeaderSlotTemplate != null) {
      return false;
    }
  }
  return true;
};

/**
 * Returns whether the table is footerless
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isTableFooterless = function () {
  var columns = this._getColumnDefs();
  var columnsCount = columns.length;

  for (var i = 0; i < columnsCount; i++) {
    var footerRenderer = this._getColumnRenderer(i, 'footer');
    var footerSlotTemplate = this._getSlotTemplate(columns[i][Table._FOOTER_TEMPLATE]);

    if (footerRenderer != null) {
      return false;
    }
    if (footerSlotTemplate != null) {
      return false;
    }
  }
  // check for default slot footer template
  if (this._isDefaultFooterTemplateSlotValid()) {
    var defaultFooterSlotTemplate = this._getSlotTemplate('footerTemplate');
    if (defaultFooterSlotTemplate != null) {
      return false;
    }
  }
  return true;
};

/**
 * Returns whether the table header columns were rendered
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isTableHeaderColumnsRendered = function () {
  return this._renderedTableHeaderColumns === true;
};

/**
 * Returns whether the table refresh is needed based on option change
 * @param {string} key option key
 * @param {Object} value option value
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isTableRefreshNeeded = function (key, value) {
  var currentOptions = this._cachedOptions;
  var refresh = false;

  if (key === 'contextMenu' &&
      value === '#' + this._getTableId() + '_contextmenu') {
    refresh = false;
  } else if (key === 'columns' && !this._isColumnMetadataUpdated()) {
    // optimization for columns. Column re-order can change the columns options but we don't need to refresh
    refresh = false;
  } else if (key !== 'selection' && key !== 'currentRow' &&
             !oj.Object.compareValues(value, currentOptions[key])) {
    refresh = true;
  }
  this._cachedOptions = $.extend(true, {}, this.options);

  return refresh;
};

/**
 * Returns whether any of the table columns are sortable
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isTableSortable = function () {
  var columns = this._getColumnDefs();
  var columnsCount = columns.length;
  for (var i = 0; i < columnsCount; i++) {
    if (columns[i].sortable === Table._OPTION_ENABLED) {
      return true;
    }
  }
  return false;
};

/**
 * Returns whether any of the table columns are resizable
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isTableColumnsResizable = function () {
  var columns = this._getColumnDefs();
  var columnsCount = columns.length;
  for (var i = 0; i < columnsCount; i++) {
    if (columns[i].resizable === Table._OPTION_ENABLED) {
      return true;
    }
  }
  return false;
};

Table.prototype._isTouchDevice = function () {
  if (this._isTouch == null) {
    var agentName = navigator.userAgent.toLowerCase();
    if (agentName.indexOf('mobile') !== -1 || agentName.indexOf('android') !== -1) {
      this._isTouch = true;
    } else {
      this._isTouch = false;
    }
  }
  return this._isTouch;
};

/**
 * Placeholder for additional layout support. Initial implementation only supports initial contents sizing.
 * @private
 */
Table.prototype._getLayout = function () {
  return 'initContents';
};

/**
 * Process any slotted children and move them into the correct location
 * @private
 */
Table.prototype._processSlottedChildren = function () {
  var tableBottomSlot = this._getTableBottomSlot();
  if (tableBottomSlot != null) {
    // clear the existing bottom slot
    $(tableBottomSlot).remove();
  }
  var slotMap = oj.BaseCustomElementBridge.getSlotMap(this._getRootElement());

  var slots = Object.keys(slotMap);
  for (var j = 0; j < slots.length; j++) {
    var slot = slots[j];
    if (slot === 'bottom') {
      var slotElements = slotMap[slot];

      if (slotElements != null) {
        tableBottomSlot = this._createTableBottomSlot();
        for (var i = 0; i < slotElements.length; i++) {
          tableBottomSlot.appendChild(slotElements[i]);
        }
      }
    }
  }
};

/**
 * Invoke refreshTableDimensions only after scrolling is finish
 * @private
 */
Table.prototype._delayRefreshTableDimensions = function () {
  this._setDelayRefreshTableDimensionsBusyState();

  var beforeScrollTop = this._scrollTop;
  this._refreshTableDimensionsTimer = setTimeout(function () { // @HTMLUpdateOK
    var currentScrollTop = this._scrollTop;
    if (beforeScrollTop !== currentScrollTop) {
      this._delayRefreshTableDimensions();
    } else {
      this._queueTask(function () {
        this._refreshTableDimensionsTimer = null;
        if (this._getLayout() === 'initContents') {
          // skip final resizing task with load more on scroll
          this._skipRefreshTableDimension = true;
        } else {
          // final task should be fully executed
          this._skipRefreshTableDimension = false;
        }
      }.bind(this));
      this._clearDelayRefreshTableDimensionsBusyState();
    }
  }.bind(this), 250);
};

/**
 * Handler for column sort
 * @param {number} columnIdx  column index
 * @param {boolean} ascending  sort order ascending
 * @param {Object} event
 * @private
 */
Table.prototype._handleSortTableHeaderColumn = function (columnIdx, ascending, event) {
  // clear the sorted indicator on any other column
  this._clearSortedHeaderColumn(columnIdx);
  // get the column metadata
  var column = this._getColumnDefs()[columnIdx];
  // get which field to sort on
  var sortField = column.sortProperty == null ? column.field : column.sortProperty;
  // invoke sort on the data
  this._invokeDataSort(sortField, ascending, event);
  this._sortColumn = column;
  this._refreshSortTableHeaderColumn(sortField, ascending);
};

/**
 * Process any sort from the fetch
 * @param {Object} result result of the fetch
 * @private
 */
Table.prototype._processFetchSort = function (result) {
  try {
    var fetchParameters = result.fetchParameters;
    var columns = this._getColumnDefs();
    var sortCriteria = fetchParameters[Table._CONST_SORTCRITERIA];
    if (sortCriteria != null && sortCriteria.length > 0) {
      var sortAttribute = sortCriteria[0].attribute;
      var sortDirection = sortCriteria[0].direction === Table._COLUMN_SORT_ORDER._ASCENDING;
      this._refreshSortTableHeaderColumn(sortAttribute, sortDirection);

      // set the current row
      this._setCurrentRow(this.options.currentRow, null, false);
      var columnIdx = null;
      var columnsCount = columns.length;

      for (var i = 0; i < columnsCount; i++) {
        var column = columns[i];
        var sortField = column.sortProperty == null ? column.field : column.sortProperty;

        if (sortAttribute === sortField) {
          columnIdx = i;
          break;
        }
      }
      if (columnIdx != null) {
        setTimeout(function () { // @HTMLUpdateOK
          this._scrollColumnIntoViewport(columnIdx);
        }.bind(this), 0);
      }
    } else {
      this._clearSortedHeaderColumn();
    }
  } catch (e) {
    Logger.error(e);
  }
};

/**
 * Callback handler mouse move/enter for column headers.
 * @private
 */
Table.prototype._handleMouseEnterColumnHeader = function (element) {
  if (element) {
    element.classList.add(Table.MARKER_STYLE_CLASSES._HOVER);
    // get the column index of the header element
    var columnIdx = this._getElementColumnIdx(element);

    // add hover class if element is sort icon
    if (element.classList.contains(Table.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS) ||
        element.classList.contains(Table.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS) ||
        element.classList.contains(Table.CSS_CLASSES._COLUMN_HEADER_DEFAULT_SORT_ICON_CLASS)) {
      element.classList.add(Table.MARKER_STYLE_CLASSES._HOVER);
    }
    // show sort icon on hover
    this._showTableHeaderColumnSortIcon(columnIdx);
  }
};

/**
  * Callback handler mouse leave for column headers.
  * @private
  */
Table.prototype._handleMouseLeaveColumnHeader = function (element) {
  if (element) {
    element.classList.remove(Table.MARKER_STYLE_CLASSES._HOVER);
    // get the column index of the header element
    var columnIdx = this._getElementColumnIdx(element);
    // hide the sort icon for the header
    this._hideTableHeaderColumnSortIcon(columnIdx);
  }
};

/**
 * Show the column header sort icon
 * @param {number} columnIdx  column index
 * @private
 */
Table.prototype._showTableHeaderColumnSortIcon = function (columnIdx) {
  if (this._getColumnDefs()[columnIdx].sortable === Table._OPTION_ENABLED) {
    var tableHeaderColumn = this._getTableHeaderColumn(columnIdx);
    if (!tableHeaderColumn) {
      return;
    }
    // we should only show the ascending sort icon if the column is not sorted
    var sorted = $(tableHeaderColumn).data('sorted');
    if (sorted == null) {
      var sortContainer = this._getSortIconContainer(tableHeaderColumn);
      var sortIcon = this._getSortIcon(tableHeaderColumn);
      if (sortContainer != null && sortIcon != null) {
        sortIcon.classList.remove(Table.MARKER_STYLE_CLASSES._DISABLED);
        sortIcon.classList.add(Table.MARKER_STYLE_CLASSES._ENABLED);
        sortIcon.classList.add(Table.MARKER_STYLE_CLASSES._DEFAULT);
      }
    }
  }
};

/**
 * Hide the column header sort icon
 * @param {number} columnIdx  column index
 * @private
 */
Table.prototype._hideTableHeaderColumnSortIcon = function (columnIdx) {
  // check if the column is sortable. If not, then there won't be any sort icons
  if (this._getColumnDefs()[columnIdx].sortable === Table._OPTION_ENABLED) {
    var tableHeaderColumn = this._getTableHeaderColumn(columnIdx);
    // check if the column is currently sorted
    var sorted = $(tableHeaderColumn).data('sorted');
    if (sorted == null) {
      var sortIcon = this._getSortIcon(tableHeaderColumn);
      if (sortIcon != null) {
        sortIcon.classList.remove(Table.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS);
        sortIcon.classList.remove(Table.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
        sortIcon.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_DEFAULT_SORT_ICON_CLASS);
        sortIcon.classList.add(Table.MARKER_STYLE_CLASSES._DISABLED);
        sortIcon.classList.remove(Table.MARKER_STYLE_CLASSES._ENABLED);
        sortIcon.classList.remove(Table.MARKER_STYLE_CLASSES._DEFAULT);
      }
    }
  }
};

/**
 * Handler for column sort
 * @param {string} key sort key
 * @param {boolean} ascending  sort order ascending
 * @private
 */
Table.prototype._refreshSortTableHeaderColumn = function (key, ascending) {
  var columns = this._getColumnDefs();
  var columnIdx = null;
  var columnsCount = columns.length;
  var sortIcon;

  for (var i = 0; i < columnsCount; i++) {
    var column = columns[i];
    var sortField = column.sortProperty == null ? column.field : column.sortProperty;

    if (key === sortField) {
      columnIdx = i;
      break;
    }
  }
  if (columnIdx == null) {
    return;
  }

  // clear the sorted indicator on any other column
  this._clearSortedHeaderColumn(columnIdx);
  // get the column header DOM element
  var tableHeaderColumn = this._getTableHeaderColumn(columnIdx);
  if (tableHeaderColumn == null) {
    return;
  }

  var sorted = $(tableHeaderColumn).data('sorted');
  sortIcon = this._getSortIcon(tableHeaderColumn);
  if (sortIcon != null) {
    sortIcon.classList.add(Table.MARKER_STYLE_CLASSES._DEFAULT);
    sortIcon.classList.remove(Table.MARKER_STYLE_CLASSES._DISABLED);
  }

  if (ascending && sorted !== Table._COLUMN_SORT_ORDER._ASCENDING) {
    // store sort order on the DOM element
    $(tableHeaderColumn).data('sorted', Table._COLUMN_SORT_ORDER._ASCENDING);

    if (sortIcon != null) {
      sortIcon.classList.remove(Table.CSS_CLASSES._COLUMN_HEADER_DEFAULT_SORT_ICON_CLASS);
      sortIcon.classList.remove(Table.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS);
      sortIcon.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
    }
  } else if (!ascending && sorted !== Table._COLUMN_SORT_ORDER._DESCENDING) {
    // store sort order on the DOM element
    $(tableHeaderColumn).data('sorted', Table._COLUMN_SORT_ORDER._DESCENDING);
    if (sortIcon != null) {
      sortIcon.classList.remove(Table.CSS_CLASSES._COLUMN_HEADER_DEFAULT_SORT_ICON_CLASS);
      sortIcon.classList.remove(Table.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
      sortIcon.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS);
    }
  }
};

/**
 * Return the currnetly sorted column index
 * @return {number|null} column index
 * @private
 */
Table.prototype._getSortedTableHeaderColumnIdx = function () {
  var tableHeaderColumns = this._getTableHeaderColumns();
  var tableHeaderColumnsCount = tableHeaderColumns ? tableHeaderColumns.length : 0;

  for (var i = 0; i < tableHeaderColumnsCount; i++) {
    // sorted column will have the sorted data attr
    var sorted = $(tableHeaderColumns[i]).data('sorted');
    if (sorted != null) {
      return i;
    }
  }
  return null;
};

/**
 * Clear the sorted column header indicator. Note this does not affect the order
 * of the data. This is just to clear the UI indication.
 * @param {number|null} columnIdx  column index
 * @private
 */
Table.prototype._clearSortedHeaderColumn = function (columnIdx) {
  var sortedTableHeaderColumnIdx = this._getSortedTableHeaderColumnIdx();
  if (sortedTableHeaderColumnIdx != null) {
    var sortedTableHeaderColumn = this._getTableHeaderColumn(sortedTableHeaderColumnIdx);
    $(sortedTableHeaderColumn).data('sorted', null);

    if (columnIdx == null || sortedTableHeaderColumnIdx !== columnIdx) {
      this._hideTableHeaderColumnSortIcon(sortedTableHeaderColumnIdx);
    } else {
      var sortIcon = this._getSortIcon(sortedTableHeaderColumn);
      if (sortIcon != null) {
        sortIcon.classList.remove(Table.MARKER_STYLE_CLASSES._SELECTED);
      }
    }
  }
};

/**
 * Return the column definitions
 * @return {Array} array of column metadata Objects.
 * @private
 */
Table.prototype._getColumnDefs = function () {
  // cache the columns array in this._columnDefArray
  if (!this._columnDefArray) {
    this._columnDefArray = this._getColumnMetadata();
  }
  return this._columnDefArray;
};

/**
 * Return the column metadata in sorted oder.
 * @return {Array} array of column metadata Objects.
 * @private
 */
Table.prototype._getColumnMetadata = function () {
  // get the columns metadata
  var columns = this.options.columns;
  var columnsDefault = this.options.columnsDefault;

  if ((columns.length === 0 ||
      (columns.length === 1 && columns[0].id == null &&
       columns[0].headerText == null && columns[0].field == null)) &&
      (columnsDefault.headerText == null && columnsDefault.field == null)) {
    return [];
  }

  var i;
  var defaultedColumns = [];
  var columnsCount = columns.length;
  for (i = 0; i < columnsCount; i++) {
    defaultedColumns[i] = $.extend({}, columnsDefault, columns[i]);
  }

  var columnsSortedArray = [];
  // add the rest of the columns in the array
  var defaultedColumnsCount = defaultedColumns.length;
  for (i = 0; i < defaultedColumnsCount; i++) {
    columnsSortedArray.push(defaultedColumns[i]);
  }

  var data = this._getData();
  var sortSupportedData = false;
  if (data != null && data.getCapability('sort') != null) {
    sortSupportedData = true;
  }

  for (i = 0; i < defaultedColumnsCount; i++) {
    // generate ids for columns which don't have it specified
    if (columnsSortedArray[i][Table._FIELD_ID] == null) {
      columnsSortedArray[i][Table._FIELD_ID] = Table._COLUMN_HEADER_ID_PREFIX + i;
    }
    // for the columns which have sortable = 'auto' check the datasource
    // and enable or disable
    if (sortSupportedData && (columnsSortedArray[i].sortable == null ||
        columnsSortedArray[i].sortable === Table._OPTION_AUTO)) {
      columnsSortedArray[i].sortable = Table._OPTION_ENABLED;
    }
  }
  return columnsSortedArray;
};

/**
 * Return the column renderer
 * @param {number} columnIdx  column index
 * @param {String} type  renderer type
 * @return {Object} renderer
 * @private
 */
Table.prototype._getColumnRenderer = function (columnIdx, type) {
  var columns = this._getColumnDefs();
  var column = columns[columnIdx];
  var renderer = null;
  if (type === 'cell') {
    renderer = column.renderer;
  } else if (type === 'footer') {
    renderer = column.footerRenderer;
  } else if (type === 'header') {
    renderer = column.headerRenderer;
  }
  return this._WrapCustomElementRenderer(renderer);
};

/**
 * Return the row renderer
 * @return {Object} renderer
 * @private
 */
Table.prototype._getRowRenderer = function () {
  return this._WrapCustomElementRenderer(this.options.rowRenderer);
};

/**
 * Checks whether content is overflowed
 * @private
 */
Table.prototype._isOverflow = function () {
  return this._isLoadMoreOnScroll() && this._domScroller && this._domScroller.isOverflow();
};

/**
 * @private
 */
Table.prototype._registerDomScroller = function () {
  // clear any existing DomScroller references
  this._unregisterDomScroller();

  this._domScrollerSuccessFunc = function (result) {
    this._clearDataWaitingState();
    if (result != null) {
      this._noMoreData = false;
      if (result.maxCountLimit) {
        this._noMoreData = true;
        this._handleScrollerMaxRowCount();
        this._syncScrollPosition();
      } else {
        var value = result[Table._CONST_VALUE];
        var data = value[Table._CONST_DATA];
        var keys = value.metadata.map(function (_value) {
          return _value[Table._CONST_KEY];
        });
        var metadataArray = value[Table._CONST_METADATA];

        var i;
        // remove any duplicate rows that are already in the DOM
        for (i = keys.length - 1; i >= 0; i--) {
          if (this._getRowIdxForRowKey(keys[i]) !== null) {
            data.splice(i, 1);
            keys.splice(i, 1);
          }
        }

        this._queueTask(function () {
          this._skipRefreshTableDimension = true;
          var tableBodyRows = this._getTableBodyRows();
          var rowCount = tableBodyRows.length;
          var indexArray = [];
          for (i = 0; i < data.length; i++) {
            indexArray[i] = rowCount + i;
          }
          return this._refreshTableBody({
            isMouseWheel: result.isMouseWheel,
            data: data,
            keys: keys,
            metadata: metadataArray,
            indexes: indexArray }, rowCount).then(function () {
              if (result.done) {
                this._noMoreData = true;
                this._syncScrollPosition();
              }
            }.bind(this));
        }.bind(this));
      }
    } else {
      // for case where result != null, the syncPosition would be done in final task
      this._syncScrollPosition();
    }
  }.bind(this);

  var tableBodyRows = this._getTableBodyRows();
  var rowCount = tableBodyRows.length;
  this._requiresDomScrollerRefresh = false;
  this._domScroller = new DomScroller(this._getScroller(), this._getData(), {
    asyncIterator: this._dataProviderAsyncIterator,
    fetchSize: this.options.scrollPolicyOptions.fetchSize,
    maxCount: this.options.scrollPolicyOptions.maxCount,
    initialRowCount: rowCount,
    success: this._domScrollerSuccessFunc.bind(this),
    request: this._handleDataFetchStart.bind(this),
    localKeyValidator: function (key) {
      return (this._findRowElementByKey(key) !== null);
    }.bind(this),
    beforeFetch: function (scrollTop) {
      if (this._idleCallback == null) {
        this._fetchBySyncScroll = (Math.abs(this._scrollY - scrollTop) <= 1);
        this._setDataWaitingState(false);
        this._showProgressiveLoading();
        return true;
      }
      return false;
    }.bind(this),
    onScrollTop: this._clearScrollPosBusyState.bind(this),
    // set fetch trigger to 2px to create a buffer for browser quirks where scrollHeight is
    // greater than clientHeight in some cases. Otherwise, domScroller fetching is broken.
    fetchTrigger: 2
  });
};

/**
 * @private
 */
Table.prototype._unregisterDomScroller = function () {
  if (this._domScroller != null) {
    this._domScroller.destroy();
    this._domScroller = null;
  }
};

/**
 * Callback handler max fetch count.
 * @private
 */
Table.prototype._handleScrollerMaxRowCount = function () {
  var errSummary = this.getTranslatedString('msgScrollPolicyMaxCountSummary');
  var errDetail = this.getTranslatedString('msgScrollPolicyMaxCountDetail');
  Logger.warn(errSummary + '\n' + errDetail);
};

/**
 * Clear idle callback
 * @private
 */
Table.prototype._clearIdleCallback = function () {
  if (this._idleCallback != null) {
    if (!window.requestIdleCallback || !window.cancelIdleCallback) {
      window.cancelAnimationFrame(this._idleCallback);
    } else {
      window.cancelIdleCallback(this._idleCallback);
      // requestAnimationFrame might have been used
      window.cancelAnimationFrame(this._idleCallback);
    }
    this._idleCallback = null;
  }
};

/**
 * Helper for requestIdleCallback and possible fallback
 * @private
 */
Table.prototype._requestIdleCallback = function (isMouseWheel, callback) {
  // IE/Edge/Safari do not support requestIdleCallback, use requestAnimationFrame as fall back
  // also Chrome has an issue with requestIdleCallback when mouse wheel is used, see Chrome :
  // https://bugs.chromium.org/p/chromium/issues/detail?id=822269
  if (isMouseWheel || !window.requestIdleCallback || !window.cancelIdleCallback) {
    this._idleCallback = window.requestAnimationFrame(function () {
      callback();
    });
    return;
  }

  var idleTimeout = window.setTimeout(function () {
    this._idleCallback = window.requestAnimationFrame(function () {
      callback();
    });
    idleTimeout = null;
  }, 250);

  this._idleCallback = window.requestIdleCallback(function (idleDeadline) {
    if (idleTimeout == null) {
      return;
    }
    window.clearTimeout(idleTimeout);
    callback(idleDeadline);
  });
};

/**
 * Renders fetched rows in idle cycle (or animation frame if not supported)
 * @private
 */
Table.prototype._renderRowsWhenIdle = function (rows, tableBody, startIndex, resolve,
  reject, isMouseWheel) {
  if (rows.length === 0) {
    this._idleCallback = null;
    this._afterRowsRendered(tableBody, true).then(
      function (value) {
        resolve(value);
      }, function (reason) {
      reject(reason);
    });
    return;
  }

  var self = this;
  var tableBodyDocFrag;
  var rowProcessed = 0;

  function afterRowsProcessed() {
    window.requestAnimationFrame(function () {
      // force the column width to remain the same
      self._freezeColumnWidths(tableBodyDocFrag);
      tableBody.appendChild(tableBodyDocFrag); // @HTMLUpdateOK
      self._renderRowsWhenIdle(rows, tableBody, startIndex + rowProcessed, resolve,
        reject, isMouseWheel);

      // to resolve an issue where on Firefox scroll with mouse wheel will randomly reset scrolltop
      // after DOM append
      if (isMouseWheel && oj.AgentUtils.getAgentInfo().browser ===
        oj.AgentUtils.BROWSER.FIREFOX && tableBody.scrollTop !== self._scrollTop) {
        // eslint-disable-next-line no-param-reassign
        tableBody.scrollTop = self._scrollTop;
      }
    });
  }

  function renderRowsWithIdleDeadline(idleDeadline) {
    var timeRemaining = idleDeadline.timeRemaining();
    var lastTimeTaken = 0;
    tableBodyDocFrag = document.createDocumentFragment();
    while (timeRemaining > lastTimeTaken) {
      if (rows.length === 0) {
        break;
      }
      if (rowProcessed === 0 && !self._tableWidthConstrained) {
        // eslint-disable-next-line no-param-reassign
        tableBody.style[Table.CSS_PROP._OVERFLOW_X] = 'hidden';
      }
      self._renderRow(rows.shift(), tableBodyDocFrag, startIndex);
      rowProcessed += 1;
      lastTimeTaken = timeRemaining - idleDeadline.timeRemaining();
      timeRemaining = idleDeadline.timeRemaining();
    }
    afterRowsProcessed();
  }

  function renderRowsWithoutIdleDeadline() {
    tableBodyDocFrag = document.createDocumentFragment();
    for (var i = 0; i < Table._BATCH_PROCESS_SIZE_WHEN_IDLE; i++) {
      if (rows.length === 0) {
        break;
      }
      if (rowProcessed === 0 && !self._tableWidthConstrained) {
        // eslint-disable-next-line no-param-reassign
        tableBody.style[Table.CSS_PROP._OVERFLOW_X] = 'hidden';
      }
      self._renderRow(rows.shift(), tableBodyDocFrag, startIndex);
      rowProcessed += 1;
    }
    afterRowsProcessed();
  }

  this._requestIdleCallback(isMouseWheel, function (idleDeadline) {
    if (idleDeadline === undefined) {
      renderRowsWithoutIdleDeadline();
    } else {
      renderRowsWithIdleDeadline(idleDeadline);
    }
  });
};

/**
 * Renders one row of data
 * @private
 */
Table.prototype._renderRow = function (rowData, tableBodyDocFrag, startIndex) {
  var row = rowData.row;
  var rowIdx = rowData.rowIdx;
  if (row != null) {
    var tableBodyRow = this._createTableBodyRow();
    this._styleTableBodyRow(tableBodyRow, true);
    this._insertTableBodyRow(rowIdx, tableBodyRow, row, tableBodyDocFrag);
    this._refreshTableBodyRow(rowIdx, row, tableBodyRow, tableBodyDocFrag, startIndex);
  }
};

/**
 * Invoked after all the rows in a single fetch are rendered
 * @private
 */
Table.prototype._afterRowsRendered = function (tableBody, delayRefresh) {
  this._clearCachedDomRowData();
  // call a forced table size refresh here since we have rendered a bunch of rows

  if (delayRefresh && this._refreshTableDimensionsTimer == null) {
    this._delayRefreshTableDimensions();
  }

  this._clearIdleRenderBusyState();

  // only bother calling subtree attached if there are potentially
  // components in our rows
  if (this._hasRowOrCellRendererOrTemplate()) {
    Components.subtreeAttached(tableBody);
  }

  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length > 0) {
    return this._finalizeBodyRowRendering(tableBodyRows).then(function () {
      if (isNaN(this._rowHeight) && tableBody.rows.length > 1) {
        this._rowHeight = tableBody.rows[1].offsetHeight;
      }
      return Promise.resolve(true);
    }.bind(this));
  }
  return Promise.resolve(true);
};

/**
 * Return all the row indexes for elements with a particular style class
 * @param {string} styleClass  style class
 * @return {Array} Array of row indexes
 * @private
 */
Table.prototype._getRowIdxsForElementsWithStyleClass = function (styleClass) {
  var elements = this._tableQuerySelectorAll(this._getTable(), styleClass);
  var rowIdxs = [];
  if (elements && elements.length > 0) {
    var elementsCount = elements.length;
    for (var i = 0; i < elementsCount; i++) {
      var rowIdx = this._getElementRowIdx(elements[i]);

      var alreadyAdded = false;
      var rowIdxsCount = rowIdxs.length;
      for (var j = 0; j < rowIdxsCount; j++) {
        if (rowIdxs[j] === rowIdx) {
          alreadyAdded = true;
        }
      }
      if (!alreadyAdded) {
        rowIdxs.push(rowIdx);
      }
    }
  }
  return rowIdxs;
};

/**
 * Return all the column indexes for elements with a particular style class
 * @param {string} styleClass  style class
 * @return {Array} Array of column indexes
 * @private
 */
Table.prototype._getColumnIdxsForElementsWithStyleClass = function (styleClass) {
  var elements = this._tableQuerySelectorAll(this._getTable(), styleClass);
  var columnIdxs = [];
  if (elements && elements.length > 0) {
    var elementsCount = elements.length;
    for (var i = 0; i < elementsCount; i++) {
      var columnIdx = this._getElementColumnIdx(elements[i]);
      var alreadyAdded = false;
      if (columnIdx === null &&
        elements[i].classList.contains(Table.CSS_CLASSES._COLUMN_HEADER_SELECTOR_CELL_CLASS)) {
        columnIdx = -1;
      }
      var columnIdxsCount = columnIdxs.length;
      for (var j = 0; j < columnIdxsCount; j++) {
        if (columnIdxs[j] === columnIdx) {
          alreadyAdded = true;
        }
      }
      if (!alreadyAdded) {
        columnIdxs.push(columnIdx);
      }
    }
  }
  return columnIdxs;
};

/**
 * Refreshes the Table's sizing, and ensures the Table's viewport is satisfied.
 * @param {boolean=} skipRequiredCheck flag to pass into 'refreshTableDimensions' call
 * @private
 */
Table.prototype._syncTableSizing = function (skipRequiredCheck) {
  // don't provide a width and height to ensure we resize contents even if overall size is the same
  this._refreshTableDimensions(null, null, skipRequiredCheck);
  // if loadMoreOnScroll then check if we have underflow and do a fetch if we do
  if (this._isLoadMoreOnScroll() && !this._dataFetching && this._domScroller) {
    this._setDataWaitingState(false);
    this._domScroller.checkViewport().then(this._domScrollerSuccessFunc,
                                           this._clearDataWaitingState.bind(this));
    // syncScrollPosition would be invoked after data are fetched and new rows are rendered
  } else {
    // syncScrollPosition must be done after sizing is done (refreshTableDimensions is invoked)
    this._syncScrollPosition();
  }
};

/**
 * Add a new tr and refresh the DOM at the row index and refresh the table
 * dimensions to accomodate the new row
 * @param {number} rowIdx  row index relative to the start of the table
 * @param {Object} row row
 * @param {Object} docFrag  document fragment
 * @param {number} docFragStartIdx  document fragment row start index
 * @return {Element} Returns the added tr
 * @private
 */
Table.prototype._addSingleTableBodyRow = function (rowIdx, row, docFrag, docFragStartIdx) {
  var tableBodyRow = this._createTableBodyRow();
  this._styleTableBodyRow(tableBodyRow, true);
  // insert the <tr> element in to the table body DOM
  this._insertTableBodyRow(rowIdx, tableBodyRow, row, docFrag);
  tableBodyRow =
    this._refreshTableBodyRow(rowIdx, row, tableBodyRow, docFrag, docFragStartIdx);
  if (!docFrag) {
    // call subtreeAttached on individual row if we are not batching in documentFragment
    Components.subtreeAttached(tableBodyRow);
  }
  return tableBodyRow;
};

/**
 * Animate only the visibles in the provided row array
 * @param tableBodyRows Array of tr DOM elements
 * @param rowIdxArray Array of row indexes for the tr elements
 * @param action Animation action
 * @return Promise Return a Promise which resolves when the animation is complete
 * @private
 */
Table.prototype._animateVisibleRows = function (tableBodyRows, rowIdxArray, action) {
  // eslint-disable-next-line no-param-reassign
  action = this._animationActionOverride == null ? action : this._animationActionOverride;

  if (!this._hasPendingTasks()) {
    this._animationActionOverride = null;
    var visibleRowIdxArray = this._getVisibleRowIdxs();
    var nonVisibleRowIdxArray = [];
    var i;
    for (i = 0; i < rowIdxArray.length; i++) {
      if (visibleRowIdxArray.indexOf(rowIdxArray[i]) === -1) {
        nonVisibleRowIdxArray.push(rowIdxArray[i]);
      }
    }
    nonVisibleRowIdxArray.sort(function (a, b) {
      return a - b;
    });
    for (i = nonVisibleRowIdxArray.length - 1; i >= 0; i--) {
      tableBodyRows.splice(nonVisibleRowIdxArray[i], 1);
    }
    // remove resize listeners to prevent triggering resize notifications
    this._unregisterResizeListener();
    return this._animateTableBodyRows(tableBodyRows, action).then(function () {
      this._registerResizeListener();
    }.bind(this));
  }
  this._animationActionOverride = 'update';
  return Promise.resolve();
};

/**
 * Clean descendant nodes created by template
 * @param {Element} rootNode - the root node to clean recursively
 * @private
 */
Table.prototype._cleanTemplateNodes = function (rootNode) {
  var templateEngine = this._getTemplateEngine();
  if (templateEngine != null) {
    templateEngine.clean(rootNode);
  }
};

/**
 * Clear any cached metadata
 * @private
 */
Table.prototype._clearCachedMetadata = function () {
  this._columnDefArray = null;
  this._columnOffsets = null;
  this._setTableActionableMode(false);
};

/**
 * @private
 */
Table.prototype._clearCachedDimensions = function () {
  this._clientWidth = null;
  this._clientHeight = null;
  this._scrollWidth = null;
  this._scrollHeight = null;
};

/**
 * Returns the inline template element inside an oj-table slot
 * @param {string} slotName slot name
 * @return {Element|null} the inline template element
 * @private
 */
Table.prototype._getSlotTemplate = function (slotName) {
  if (this._IsCustomElement() && slotName) {
    var slotMap = oj.BaseCustomElementBridge.getSlotMap(this._getRootElement());
    var slot = slotMap[slotName];
    if (slot && slot.length > 0 && slot[0].tagName.toLowerCase() === 'template') {
      return slot[0];
    }
  }
  return null;
};

/**
 * Returns false if the 'cellTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @return {boolean} false if the 'cellTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @private
 */
Table.prototype._isDefaultCellTemplateSlotValid = function () {
  return this._isDefaultTemplateSlotValid('cellTemplate');
};

/**
 * Returns false if the 'rowTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @return {boolean} false if the 'rowTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @private
 */
Table.prototype._isDefaultRowTemplateSlotValid = function () {
  return this._isDefaultTemplateSlotValid('rowTemplate');
};

/**
 * Returns false if the 'headerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @return {boolean} false if the 'headerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @private
 */
Table.prototype._isDefaultHeaderTemplateSlotValid = function () {
  return this._isDefaultTemplateSlotValid('headerTemplate');
};

/**
 * Returns false if the 'footerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @return {boolean} false if the 'footerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @private
 */
Table.prototype._isDefaultFooterTemplateSlotValid = function () {
  return this._isDefaultTemplateSlotValid('footerTemplate');
};

/**
 * Returns false if the supplied slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @param {String} defaultSlotName the default slot name to validate
 * @return {boolean} false if the 'footerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
 * @private
 */
Table.prototype._isDefaultTemplateSlotValid = function (defaultSlotName) {
  var columns = this._getColumnDefs();
  var columnsCount = columns.length;
  for (var i = 0; i < columnsCount; i++) {
    var cellTemplateName = columns[i][Table._CELL_TEMPLATE];
    var headerTemplateName = columns[i][Table._HEADER_TEMPLATE];
    var footerTemplateName = columns[i][Table._FOOTER_TEMPLATE];
    if (defaultSlotName === cellTemplateName ||
        defaultSlotName === headerTemplateName ||
        defaultSlotName === footerTemplateName) {
      return false;
    }
  }
  return true;
};

/**
 * Return the template engine or null
 * @return {Object|null} template engine
 * @private
 */
Table.prototype._getTemplateEngine = function () {
  return this._templateEngine;
};

/**
 * Return the visible row indexes
 * @return {Array} array of row indexes
 * @private
 */
Table.prototype._getVisibleRowIdxs = function () {
  // return the row indexes of all rows in the viewport
  var visibleRowIdxArray = [];

  var tableBody = this._getTableBody();
  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length > 0 && tableBody.offsetHeight > 0) {
    var windowHeight = $(window).height();
    var tableBodyRect = tableBody.getBoundingClientRect();

    // check if not visible at all
    if (tableBodyRect.top > windowHeight) {
      return visibleRowIdxArray;
    }
    // if the table is fully visible or partially visible, work out which
    // rows are visible

    // find out where the start of the row is
    var tableElemX = tableBodyRect.left >= 0 ? tableBodyRect.left + 1 : tableBodyRect.right - 1;

    // check the first visible row
    var viewportTop = tableBodyRect.top >= 0 ? tableBodyRect.top : 0;
    var tableElemTop = document.elementFromPoint(tableElemX, viewportTop);
    var rowIdx = null;
    if (tableElemTop != null) {
      rowIdx = this._getElementRowIdx(tableElemTop);
    }
    var startRowIdx = rowIdx != null ? rowIdx : 0;
    var lastRowIdx;
    var tableElemBottom;

    if (tableBodyRect.bottom > windowHeight) {
      // the last visible row is at the bottom of the viewport
      tableElemBottom = document.elementFromPoint(tableElemX, windowHeight - 1);
      rowIdx = null;
      if (tableElemBottom != null) {
        lastRowIdx = this._getElementRowIdx(tableElemBottom);
      }
    } else {
      var borderBottomWidth =
        parseInt(window.getComputedStyle(tableBody).borderBottomWidth, 10) || 0;
      var viewportBottom =
        tableBodyRect.bottom >= 0 ? tableBodyRect.bottom - borderBottomWidth - 1 : 0;
      tableElemBottom = document.elementFromPoint(tableElemX, viewportBottom);
      if (tableElemBottom != null) {
        lastRowIdx = this._getElementRowIdx(tableElemBottom);
      }
    }
    if (lastRowIdx == null) {
      lastRowIdx = tableBodyRows.length - 1;
    }
    for (var i = startRowIdx; i <= lastRowIdx; i++) {
      visibleRowIdxArray.push(i);
    }
  }
  return visibleRowIdxArray;
};

/**
 * Has row or cell renderer or template
 * @param {number|null} columnIdx  column index
 * @return {boolean} true or false
 * @private
 */
Table.prototype._hasRowOrCellRendererOrTemplate = function (columnIdx) {
  var rowRenderer = this._getRowRenderer();
  if (rowRenderer != null) {
    return true;
  }

  var cellRenderer = null;
  var cellSlotTemplate = null;
  var columns = this._getColumnDefs();
  if (columnIdx != null) {
    cellRenderer = this._getColumnRenderer(columnIdx, 'cell');
    cellSlotTemplate = this._getSlotTemplate(columns[columnIdx][Table._CELL_TEMPLATE]);
  } else {
    var columnsCount = columns.length;
    for (var i = 0; i < columnsCount; i++) {
      cellRenderer = this._getColumnRenderer(i, 'cell');
      if (cellRenderer != null) {
        break;
      }
      cellSlotTemplate = this._getSlotTemplate(columns[i][Table._CELL_TEMPLATE]);
      if (cellSlotTemplate != null) {
        break;
      }
    }
  }
  if (cellRenderer != null || cellSlotTemplate != null) {
    return true;
  }
  // check for default slot row template
  if (this._isDefaultRowTemplateSlotValid()) {
    var defaultRowSlotTemplate = this._getSlotTemplate('rowTemplate');
    if (defaultRowSlotTemplate != null) {
      return true;
    }
  }
  // check for default slot cell template
  if (this._isDefaultCellTemplateSlotValid()) {
    var defaultCellSlotTemplate = this._getSlotTemplate('cellTemplate');
    if (defaultCellSlotTemplate != null) {
      return true;
    }
  }
  return false;
};

/**
 * Do an initial fetch
 * @param {Object} options options for the fetch
 * @param {boolean} force whether to force fetch
 * @private
 */
Table.prototype._initFetch = function (options, force) {
  var updatedOptions = options || {};
  var dataprovider = this._getData();
  // do an initial fetch if a TableDataSource
  // paging control should do the fetches for PagingTableDataSource
  if (dataprovider != null &&
      oj.DataProviderFeatureChecker.isDataProvider(dataprovider) &&
      (!this._isPagingModelDataProvider() || force)) {
    return this._queueTask(function () {
      // reset the scrollTop when we do an initial fetch
      this._scrollTop = 0;
      this._getScroller().scrollTop = 0;
      if (dataprovider instanceof oj.TableDataSourceAdapter) {
        updatedOptions.fetchType = 'init';
        if (this._isLoadMoreOnScroll()) {
          updatedOptions[Table._CONST_OFFSET] = 0;
        }
      }
      return this._invokeDataFetchRows(updatedOptions);
    }.bind(this));
  } else if (dataprovider == null) {
    return this._queueTask(function () {
      return Promise.resolve();
    });
  }
  return undefined;
};

/**
 * Initialize the template engine
 * @private
 */
Table.prototype._initTemplateEngine = function () {
  // initialize the template engine
  this._queueTask(function () {
    var enginePromise;
    try {
      enginePromise = Config.__getTemplateEngine().then(function (engine) {
        this._templateEngine = engine;
      }.bind(this), function (err) {
        Logger.warn(err);
      });
    } catch (err) {
      Logger.warn(err);
      enginePromise = Promise.resolve(null);
    }
    return enginePromise;
  }.bind(this));
};

/**
 * Creates an updated options object used when calling fetchFirst on the data provider.
 * @param {Object=} options initial options for the fetch.
 * @return {Object} updated options for the fetch.
 * @private
 */
Table.prototype._initializeFetchFirstOptions = function (options) {
  var updatedOptions = options || {};

  // Create a clientId symbol that uniquely identify this consumer so that
  // DataProvider which supports it can optimize resources
  this._clientId = this._clientId || Symbol();
  updatedOptions[Table._CONST_CLIENTID] = this._clientId;

  if (!updatedOptions[Table._CONST_PAGESIZE] && this._isLoadMoreOnScroll()) {
    updatedOptions[Table._CONST_PAGESIZE] = this.options.scrollPolicyOptions.fetchSize;
  } else {
    updatedOptions[Table._CONST_PAGESIZE] = -1;
  }
  // explicitly silence events to keep backward compatibility
  updatedOptions[Table._CONST_SILENT] = true;
  return updatedOptions;
};

/**
 * Fetch rows
 * @param {Object} options options for the fetch
 * @return {Promise} Promise resolves with the result when done.
 * @private
 */
Table.prototype._invokeDataFetchRows = function (options) {
  // reset dimensions flag to ensure rows are made visible once available
  this._tableDimensionsInitialized = false;
  var updatedOptions = this._initializeFetchFirstOptions(options);
  var dataprovider = this._getData();
  if (dataprovider != null) {
    return new Promise(function (resolve) {
      this._noMoreData = false;
      this._setDataWaitingState();
      this._dataProviderAsyncIterator =
        dataprovider.fetchFirst(updatedOptions)[Symbol.asyncIterator]();
      this._dataProviderAsyncIterator.next().then(function (result) {
        var value = result[Table._CONST_VALUE];
        var data = value[Table._CONST_DATA];
        var keys = value.metadata.map(function (_value) {
          return _value[Table._CONST_KEY];
        });

        var offset = 0;
        if (dataprovider instanceof oj.TableDataSourceAdapter) {
          offset = dataprovider[Table._CONST_OFFSET];
        }
        var startIndex = 0;
        if (this._isPagingModelDataProvider()) {
          startIndex = dataprovider.getStartItemIndex();
        }
        var indexArray = [];
        var resultDataCount = data.length;

        for (var i = 0; i < resultDataCount; i++) {
          indexArray[i] = offset + startIndex + i;
        }
        var metadataArray = value[Table._CONST_METADATA];

        // Need to clear DOM scroller before refreshAll potentially triggers
        // additional data fetches when syncing scroll position
        this._unregisterDomScroller();

        if (result.maxCountLimit) {
          this._noMoreData = true;
          this._handleScrollerMaxRowCount();
        } else if (result.done) {
          this._noMoreData = true;
        }

        this._refreshAll({
          data: data,
          metadata: metadataArray,
          keys: keys,
          indexes: indexArray
        }, offset).then(function () {
          this._clearDataWaitingState();
          this._processFetchSort(value);
          if (this._isLoadMoreOnScroll()) {
            this._registerDomScroller();
          }
          resolve(result);
        }.bind(this));
      }.bind(this), function () {
        this._clearDataWaitingState();
        var tableBodyRows = this._getTableBodyRows();
        if (tableBodyRows.length === 0) {
          this._showNoDataMessage();
        }
        resolve(null);
      }.bind(this));
    }.bind(this));
  }
  return Promise.resolve(null);
};

/**
 * Invoke sort on a field. This function is called when a user clicks the
 * column header sort icons
 * @param {string} sortField  field name
 * @param {boolean} ascending  sort order ascending
 * @param {Object} event
 * @private
 */
Table.prototype._invokeDataSort = function (sortField, ascending, event) {
  this._resetAriaLabel = true;
  var dataprovider = this._getData();
  // if no data then bail
  if (!dataprovider) {
    return;
  }

  // show the Fetching Data... message
  this._showStatusMessage();

  var sortCriteria = [];
  var sortCriterion = {};
  sortCriterion[Table._CONST_ATTRIBUTE] = sortField;
  if (ascending) {
    sortCriterion.direction = Table._COLUMN_SORT_ORDER._ASCENDING;
  } else {
    sortCriterion.direction = Table._COLUMN_SORT_ORDER._DESCENDING;
  }
  sortCriteria.push(sortCriterion);
  this._trigger('sort', event, {
    header: sortCriteria[0][Table._CONST_ATTRIBUTE],
    direction: sortCriteria[0].direction
  });
  this._beforeDataRefresh();
  this._initFetch({ sortCriteria: sortCriteria }, true);
};

/**
 * Whether the columns have been updated
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isColumnMetadataUpdated = function () {
  if (this._columnDefArray != null) {
    var columnsMetadata = this._getColumnMetadata();
    if (this._columnDefArray.length !== columnsMetadata.length) {
      return true;
    }
    var columnsMetadataCount = columnsMetadata.length;
    for (var i = 0; i < columnsMetadataCount; i++) {
      var props = Object.keys(columnsMetadata[i]);
      for (var j = 0; j < props.length; j++) {
        var prop = props[j];
        if (columnsMetadata[i][prop] !== this._columnDefArray[i][prop]) {
          if (prop !== 'id' ||
              columnsMetadata[i][prop] == null ||
              columnsMetadata[i][prop].indexOf(Table._COLUMN_HEADER_ID_PREFIX) !== 0 ||
              this._columnDefArray[i][prop] == null ||
              this._columnDefArray[i][prop].indexOf(Table._COLUMN_HEADER_ID_PREFIX) !== 0) {
            // ignore generated ids
            return true;
          }
        }
      }
    }
    return false;
  }
  return true;
};

/**
 * Callback handler for refresh in the datasource. Refresh entire
 * table body DOM and refresh the table dimensions.
 * @param {Object} event
 * @private
 */
Table.prototype._handleDataRefresh = function () {
  try {
    if (this._dataFetching) {
      this._pendingFetchStale = true;
      return;
    }
    this._queueTask(function () {
      this._beforeDataRefresh();
      return this._invokeDataFetchRows();
    }.bind(this));
  } catch (e) {
    Logger.error(e);
  }
};

/**
 * Things to do before data is refresh, this could be due to sort, model refresh event, or data attribute changed.
 * @private
 */
Table.prototype._beforeDataRefresh = function () {
  this._clearIdleCallback();
  this._adjustScrollPositionOnRefresh();
  this._invalidateRangeSelection();
  if (this._lastSelectedRowIdxArray != null) {
    this._lastSelectedRowIdxArray = [];
  }
  // reset selection validation state if data refreshed or changed
  this._initialSelectionStateValidated = false;
};

/**
 * @private
 */
Table.prototype._getColumnKeys = function () {
  var columnKeys = [];
  var columns = this._getColumnDefs();
  if (columns != null) {
    for (var i = 0; i < columns.length; i++) {
      columnKeys.push(columns[i][Table._FIELD_ID]);
    }
  }
  return columnKeys;
};

/**
 * @private
 */
Table.prototype._getLocalRowKeys = function () {
  var rowKeys = [];
  var tableBodyRows = this._getTableBodyRows();
  for (var i = 0; i < tableBodyRows.length; i++) {
    rowKeys.push($(tableBodyRows[i]).data('rowKey'));
  }
  return rowKeys;
};

Table.prototype._hasMoreToFetch = function () {
  if (this._isLoadMoreOnScroll()) {
    return !this._noMoreData;
  }
  return false;
};

/**
 * Clear any cached data metadata
 * @private
 */
Table.prototype._clearCachedDataMetadata = function () {
  if (this._data != null) {
    this._unregisterDataSourceEventListeners();
  }
  this._data = null;
};

/**
 * Add all the rows contained in the event detail.
 * @param {Object} eventDetail Event detail
 * @private
 */
Table.prototype._executeTableBodyRowsAdd = function (eventDetail) {
  var eventDetailKeys = eventDetail[Table._CONST_KEYS];
  if (eventDetailKeys && eventDetailKeys.size > 0) {
    this._queueTask(function () {
      // This function will try to find the row index from the DOM, so it must
      // be called right before we're ready to update the UI.  If we call it
      // outside of this queued task, the DOM may have changed from other
      // data operations, and the row index can be wrong.
      var rows = this._getRowsFromEventDetailAdd(eventDetail);
      if (rows.length === 0) {
        if (this._requiresDomScrollerRefresh) {
          this._registerDomScroller();
        }
        return undefined;
      }

      // see if we should batch add
      // only batch if we are adding a block of contiguous rows
      var batchAdd = false;
      var addedTableBodyRows = [];
      var rowIdxArray = [];
      var i;
      var rowsCount;

      if (rows.length > 1) {
        rowsCount = rows.length;
        var isContiguous = true;
        for (i = 0; i < rowsCount; i++) {
          if (i !== 0) {
            if (rows[i - 1].rowIdx !== rows[i].rowIdx - 1) {
              isContiguous = false;
            }
          }
          rowIdxArray.push(rows[i].rowIdx);
        }

        if (isContiguous) {
          var tableBody = this._getTableBody();
          var tableBodyDocFrag = document.createDocumentFragment();
          rowsCount = rows.length;
          for (i = 0; i < rowsCount; i++) {
            addedTableBodyRows.push(this._addSingleTableBodyRow(rows[i].rowIdx,
                                                                rows[i].row,
                                                                tableBodyDocFrag,
                                                                rows[0].rowIdx));
          }
          if (rows[0].rowIdx === 0) {
            tableBody.insertBefore(tableBodyDocFrag, tableBody.firstChild); // @HTMLUpdateOK
          } else {
            var tableBodyRowBefore = this._getTableBodyRow(rows[0].rowIdx);
            if (tableBodyRowBefore != null) {
              tableBody.insertBefore(tableBodyDocFrag, tableBodyRowBefore);// @HTMLUpdateOK
            } else {
              tableBody.appendChild(tableBodyDocFrag, null);// @HTMLUpdateOK
            }
          }
          this._clearCachedDomRowData();
          Components.subtreeAttached(tableBody);
          batchAdd = true;
        }
      }

      if (!batchAdd) {
        rowsCount = rows.length;
        for (i = 0; i < rowsCount; i++) {
          addedTableBodyRows.push(this._addSingleTableBodyRow(rows[i].rowIdx, rows[i].row));
        }
      }
      this._clearCachedDomRowData();
      // row values may have changed so refresh the footer
      this._refreshTableFooter();

      // for high watermark scrolling, we need to reset the domscroller in case there are more rows to fetch
      if (this._requiresDomScrollerRefresh) {
        this._registerDomScroller();
      }
      if (this._IsCustomElement()) {
        return this._animateVisibleRows(addedTableBodyRows, rowIdxArray, 'add').then(function () {
          return this._finalizeBodyRowRendering(addedTableBodyRows);
        }.bind(this));
      }
      return this._finalizeBodyRowRendering(addedTableBodyRows);
    }.bind(this));
  }
};

/**
  * Change all the rows contained in the event detail.
  * @param {Object} eventDetail Event detail
  * @param {number} startIndex index of first row in the table in the data source
  * @private
  */
// eslint-disable-next-line no-unused-vars
Table.prototype._executeTableBodyRowsChange = function (eventDetail, startIndex) {
  this._queueTask(function () {
    // This function will try to find the row index from the DOM, so it must
    // be called right before we're ready to update the UI.  If we call it
    // outside of this queued task, the DOM may have changed from other
    // data operations, and the row index can be wrong.
    var rows = this._getRowsFromEventDetailChange(eventDetail);
    if (rows.length === 0) {
      return undefined;
    }

    var rowsCount = rows.length;
    var updatedTableBodyRows = [];
    var rowIdxArray = [];

    for (var i = 0; i < rowsCount; i++) {
      var tableBodyRow = this._refreshTableBodyRow(rows[i].rowIdx, rows[i].row);
      if (tableBodyRow) {
        updatedTableBodyRows.push(tableBodyRow);
        rowIdxArray.push(rows[i].rowIdx);
      }
    }
    // row values may have changed so refresh the footer
    this._refreshTableFooter();
    if (this._IsCustomElement()) {
      return this._animateVisibleRows(updatedTableBodyRows, rowIdxArray, 'update').then(function () {
        return this._finalizeBodyRowRendering(updatedTableBodyRows);
      }.bind(this));
    }
    return this._finalizeBodyRowRendering(updatedTableBodyRows);
  }.bind(this));
};

/**
  * Remove all the rows contained in the event detail.
  * @param {Object} eventDetail event detail
  * @param {Object=} addEventDetail optional event detail for subsequent add
  * @private
  */
Table.prototype._executeTableBodyRowsRemove = function (eventDetail, addEventDetail) {
  var self = this;
  var eventDetailKeys = eventDetail[Table._CONST_KEYS];
  if (eventDetailKeys && eventDetailKeys.size > 0) {
    this._queueTask(function () {
      // This function will try to find the row index from the DOM, so it must
      // be called right before we're ready to update the UI.  If we call it
      // outside of this queued task, the DOM may have changed from other
      // data operations, and the row index can be wrong.
      var rows = self._getRowsFromEventDetailRemove(eventDetail);
      if (rows.length === 0) {
        // update selection state based on row removals
        self._updateSelectionStateFromEventDetailRemove(eventDetail, addEventDetail);
        return undefined;
      }

      // sort array
      rows.sort(function (a, b) {
        return b.rowIdx - a.rowIdx;
      });

      var currentRow = self._getCurrentRow();
      var currentRowIndex = currentRow != null ? currentRow.rowIndex : 0;
      var currentRowKey = currentRow != null ? currentRow.rowKey : null;

      // first check if we are removing all rows. If so, we can do a removeAll
      var remainingRowIdxArray = [];
      var rowIdxArray = [];
      var removedTableBodyRows = [];
      var rowsCount = rows.length;
      var removeAll = false;
      var tableBodyRow;
      var tableBodyRows = self._getTableBodyRows();
      var rowIdx;
      var i;

      if (tableBodyRows.length > 0) {
        for (i = 0; i < tableBodyRows.length; i++) {
          remainingRowIdxArray.push(i);
        }
        for (i = 0; i < rowsCount; i++) {
          rowIdx = rows[i].rowIdx;
          rowIdxArray.push(rowIdx);
          for (var j = 0; j < remainingRowIdxArray.length; j++) {
            if (remainingRowIdxArray[j] === rowIdx) {
              tableBodyRow = self._getTableBodyRow(rowIdx);
              removedTableBodyRows.push(tableBodyRow);
              remainingRowIdxArray.splice(j, 1);
              break;
            }
          }
        }

        if (remainingRowIdxArray.length === 0) {
          removeAll = true;
        }
      }

      var tableBody = self._getTableBody();
      var checkFocus = $.contains(tableBody, document.activeElement);
      var resetFocus = false;

      if (removeAll) {
        if (checkFocus) {
          resetFocus = true;
        }
        // Clear out all the existing selection state
        self._clearSelectionState();
      } else {
        for (i = 0; i < rowsCount; i++) {
          rowIdx = rows[i].rowIdx;
          tableBodyRow = self._getTableBodyRow(rowIdx);
          if (checkFocus) {
            if (tableBodyRow != null &&
                $.contains(tableBodyRow, document.activeElement)) {
              resetFocus = true;
              checkFocus = false;
              break;
            }
          }
        }
      }

      function _removeRows() {
        for (var ii = 0; ii < rowsCount; ii++) {
          var _rowIdx = rows[ii].rowIdx;
          self._removeTableBodyRow(_rowIdx);
        }
      }

      function _afterRemoveRows() {
        // update selection state based on row removals
        self._updateSelectionStateFromEventDetailRemove(eventDetail, addEventDetail);
        // row values may have changed so refresh the footer
        self._refreshTableFooter();
        tableBodyRows = self._getTableBodyRows();
        if (tableBodyRows.length === 0) {
          self._showNoDataMessage();
        }

        // set the currentRow to the next row if needed or clear
        if (currentRowKey != null) {
          if (tableBodyRows.length === 0 ||
              removeAll ||
              currentRowIndex >= tableBodyRows.length) {
            self._setCurrentRow(null, null, false);
          } else {
            self._setCurrentRow({ rowIndex: currentRowIndex, rowKey: null }, null, false);
          }
        }

        if (resetFocus) {
          self._getTable().focus();
        }
      }

      if (removeAll) {
        self._removeAllTableBodyRows();
        _afterRemoveRows();
      } else {
        return new Promise(function (resolve) {
          if (self._IsCustomElement()) {
            self._animateVisibleRows(removedTableBodyRows, rowIdxArray, 'remove')
              .then(function () {
                _removeRows();
                _afterRemoveRows();
                resolve(true);
              });
          } else {
            _removeRows();
            _afterRemoveRows();
            resolve(true);
          }
        });
      }
      return undefined;
    });
  }
};

/**
 * Return the column index for column key.
 * @param {Object} columnKey column key
 * @return {number|null} column index
 * @private
 */
Table.prototype._getColumnIdxForColumnKey = function (columnKey) {
  var columns = this._getColumnDefs();
  if (columns != null) {
    var columnsCount = columns.length;
    for (var i = 0; i < columnsCount; i++) {
      var column = columns[i];
      if (oj.KeyUtils.equals(column.id, columnKey)) {
        return i;
      }
    }
  }
  return null;
};

/**
 * Return the column key for column index.
 * @param {number} columnIdx column index
 * @return {Object} column key
 * @private
 */
Table.prototype._getColumnKeyForColumnIdx = function (columnIdx) {
  var columns = this._getColumnDefs();
  if (columns != null && columnIdx < columns.length) {
    return columns[columnIdx][Table._FIELD_ID];
  }
  return null;
};

/**
 * Return the datasource object defined for this table
 * @return {Object} Datasource object.
 * @throws {Error}
 * @private
 */
Table.prototype._getData = function () {
  if (!this._data && this.options.data != null) {
    var dataprovider = this.options.data;
    if ((oj.TableDataSource && dataprovider instanceof oj.TableDataSource) ||
        (oj.PagingTableDataSource && dataprovider instanceof oj.PagingTableDataSource)) {
      this._data = new oj.TableDataSourceAdapter(dataprovider);
    } else if (oj.DataProviderFeatureChecker.isDataProvider(dataprovider)) {
      if (!(dataprovider instanceof oj.ListDataProviderView) &&
        !oj.DataProviderFeatureChecker.isTreeDataProvider(dataprovider)) {
        this._data = new oj.ListDataProviderView(dataprovider);
      } else {
        this._data = dataprovider;
      }
    } else {
      // we only support TableDataSource
      var errSummary = Table._LOGGER_MSG._ERR_DATA_INVALID_TYPE_SUMMARY;
      var errDetail = Table._LOGGER_MSG._ERR_DATA_INVALID_TYPE_DETAIL;
      throw new Error(errSummary + '\n' + errDetail);
    }
    this._dataOption = this.options.data;
    this._registerDataSourceEventListeners();
  }
  return this._data;
};

/**
 * Return an array with row and row indices relative to the table row indices
 * @param {Object} resultObject Object containing data array, key array, and index array
 * @param {number} startIndex start index
 * @return {Array} Array of rows and row index
 * @private
 */
Table.prototype._getRowIdxRowArray = function (resultObject, startIndex) {
  var rowIdxRowArray = [];
  if (resultObject != null) {
    var indexesCount = resultObject[Table._CONST_INDEXES].length;
    for (var i = 0; i < indexesCount; i++) {
      rowIdxRowArray.push({
        row: {
          data: resultObject[Table._CONST_DATA][i],
          metadata: resultObject[Table._CONST_METADATA] ?
            resultObject[Table._CONST_METADATA][i] : null,
          key: resultObject[Table._CONST_KEYS][i],
          index: resultObject[Table._CONST_INDEXES][i]
        },
        rowIdx: startIndex + i });
    }
  }
  return rowIdxRowArray;
};

/**
 * Return the row index for row key. Only loop through displayed rows.
 * @param {Object} rowKey row key
 * @return {number|null} row index
 * @private
 */
Table.prototype._getRowIdxForRowKey = function (rowKey) {
  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length > 0) {
    var tableBodyRowsCount = tableBodyRows.length;
    for (var i = 0; i < tableBodyRowsCount; i++) {
      if (oj.KeyUtils.equals($(tableBodyRows[i]).data('rowKey'), rowKey)) {
        return i;
      }
    }
  }
  return null;
};

/**
 * Return the datasource's row index for the row key.
 * @param {Object} rowKey row key
 * @return {number|null} row index
 * @private
 */
Table.prototype._getDataSourceRowIndexForRowKey = function (rowKey) {
  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length > 0) {
    var tableBodyRowsCount = tableBodyRows.length;
    for (var i = 0; i < tableBodyRowsCount; i++) {
      if (oj.KeyUtils.equals($(tableBodyRows[i]).data('rowKey'), rowKey)) {
        var dataprovider = this._getData();
        var offset = 0;
        if (this._isPagingModelDataProvider()) {
          offset = dataprovider.getStartItemIndex();
        }
        return i + offset;
      }
    }
  }
  return null;
};

/**
 * Return the row key for datasource's row index.
 * @param {number} rowIndex row index
 * @return {any} row key
 * @private
 */
Table.prototype._getRowKeyForDataSourceRowIndex = function (rowIndex) {
  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length > 0) {
    var dataprovider = this._getData();
    var offset = 0;
    if (this._isPagingModelDataProvider()) {
      offset = dataprovider.getStartItemIndex();
    }
    var tableBodyRowsCount = tableBodyRows.length;
    for (var i = 0; i < tableBodyRowsCount; i++) {
      if (offset + i === rowIndex) {
        return $(tableBodyRows[i]).data('rowKey');
      }
    }
  }
  return null;
};

/**
 * Return the row key for row index.
 * @param {number} rowIdx row index
 * @return {any|null} row key
 * @private
 */
Table.prototype._getRowKeyForRowIdx = function (rowIdx) {
  var tableBodyRow = this._getTableBodyRow(rowIdx);
  if (tableBodyRow != null) {
    return $(tableBodyRow).data('rowKey');
  }
  return null;
};

/**
 * Returns the row key for the specified row or index.
 * @param {Element=} tableBodyRow The tr element of the row.
 * @param {number=} index The index of the row.
 * @private
 */
Table.prototype._getRowKey = function (tableBodyRow, index) {
  if (tableBodyRow == null) {
    // eslint-disable-next-line no-param-reassign
    tableBodyRow = this._getTableBodyRow(index);
  }
  if (tableBodyRow != null) {
    return $(tableBodyRow).data('rowKey');
  }
  return null;
};

/**
 * Return row info from add event detail
 * @param {Object} eventDetail event detail
 * @return {Array} Array of row info
 * @private
 */
Table.prototype._getRowsFromEventDetailAdd = function (eventDetail) {
  var dataprovider = this._getData();
  var eventData = eventDetail[Table._CONST_DATA];
  var eventMetadata = eventDetail[Table._CONST_METADATA];
  var eventIndexes = eventDetail[Table._CONST_INDEXES];
  var eventKeys = [];
  eventDetail[Table._CONST_KEYS].forEach(function (key) {
    eventKeys.push(key);
  });
  var eventAfterKeys = [];
  // afterKeys is deprecated, but continue to support it until we can remove it.
  // forEach can be called on both array and set.
  var afterKeyIter = eventDetail[Table._CONST_ADDBEFOREKEYS] ?
    eventDetail[Table._CONST_ADDBEFOREKEYS] : eventDetail[Table._CONST_AFTERKEYS];
  if (afterKeyIter != null) {
    afterKeyIter.forEach(function (key) {
      eventAfterKeys.push(key);
    });
  }
  if (!(eventData instanceof Array)) {
    eventData = [eventData];
  }
  if (!(eventMetadata instanceof Array)) {
    eventMetadata = [eventMetadata];
  }
  var offset = 0;
  if (this._isPagingModelDataProvider()) {
    offset = dataprovider.getStartItemIndex();
  }

  var metadataSource;
  if (dataprovider instanceof oj.TableDataSourceAdapter) {
    if (oj.FlattenedTreeTableDataSource &&
        dataprovider.tableDataSource instanceof oj.FlattenedTreeTableDataSource) {
      metadataSource = dataprovider.tableDataSource;
    } else if (oj.PagingTableDataSource &&
                dataprovider.tableDataSource instanceof oj.PagingTableDataSource &&
                oj.FlattenedTreeTableDataSource &&
                dataprovider.tableDataSource.dataSource instanceof
                oj.FlattenedTreeTableDataSource) {
      metadataSource = dataprovider.tableDataSource.dataSource;
    }
  }

  var rowArray = [];
  var rowIdx;
  var eventIndex;
  var eventAfterKey;
  var metadata = null;
  var tableBodyRows = this._getTableBodyRows();
  var rowCount = tableBodyRows.length;
  var eventDataCount = eventData.length;

  // only used for high watermark scrolling
  var maxRowIndex = rowCount - 1;

  // if specified, afterKeys takes precendence over indexes
  for (var i = 0; i < eventDataCount; i++) {
    eventAfterKey = eventAfterKeys != null ? eventAfterKeys[i] : '';
    rowIdx = this._getRowIdxForRowKey(eventAfterKey);
    if (rowIdx != null &&
        rowIdx >= 0) {
      // insertion is before the afterKey
      eventIndex = rowIdx + offset;
    } else if (eventIndexes && i < eventIndexes.length && eventIndexes[i] >= 0) {
      // if the afterKey is not in the table
      // then use if index has been specified
      eventIndex = eventIndexes[i];
    } else if (i === 0) {
      // afterKey was not found and index was
      // not specified. eventIndex is just set as
      // the previous one + 1. If the first item
      // then just append
      eventIndex = rowCount;
    } else if (!isNaN(eventIndex)) {
      eventIndex += 1;
    }

    if (!isNaN(eventIndex)) {
      rowIdx = eventIndex - offset;
      // for high watermark scrolling, we only care about rows in our currently fetched window
      if (this._isLoadMoreOnScroll()) {
        if (rowIdx <= maxRowIndex) {
          // eslint-disable-next-line no-param-reassign
          maxRowIndex += 1;
        } else {
          if (this._noMoreData) {
            this._requiresDomScrollerRefresh = true;
          }
          this._noMoreData = false;
          // eslint-disable-next-line no-continue
          continue;
        }
      }
      if (metadataSource && metadataSource._getMetadata) {
        metadata = metadataSource._getMetadata(rowIdx);
      } else {
        metadata = eventMetadata[i];
      }
      var row = {
        data: eventData[i],
        metadata: metadata,
        key: eventKeys[i],
        index: eventIndex
      };
      rowArray.push({ row: row, rowIdx: rowIdx });
    }
  }
  return rowArray;
};

/**
 * Callback handler for rows mutations.
 * @param {Object} event
 * @private
 */
Table.prototype._handleDataRowMutate = function (event) {
  if (this._dataFetching) {
    this._pendingFetchStale = true;
    return;
  }
  if (event.detail.remove != null) {
    this._handleDataRowRemove(event.detail.remove, event.detail.add);
  }
  if (event.detail.add != null) {
    this._handleDataRowAdd(event.detail.add);
  }
  if (event.detail.update != null) {
    this._handleDataRowChange(event.detail.update);
  }
};

/**
 * Callback handler for rows added into the datasource. Add a new tr and refresh the DOM
 * at the row index and refresh the table dimensions to accomodate the new
 * row
 * @param {Object} eventDetail event detail
 * @private
 */
Table.prototype._handleDataRowAdd = function (eventDetail) {
  try {
    this._executeTableBodyRowsAdd(eventDetail);
  } catch (e) {
    Logger.error(e);
  } finally {
    this._clearDataWaitingState();
  }
};

/**
 * Callback handler for row change in the datasource. Refresh the changed
 * row.
 * @param {Object} eventDetail event detail
 * @private
 */
Table.prototype._handleDataRowChange = function (eventDetail) {
  try {
    this._executeTableBodyRowsChange(eventDetail);
  } catch (e) {
    Logger.error(e);
  } finally {
    this._clearDataWaitingState();
  }
};

/**
 * Return row info from change event detail
 * @param {Object} eventDetail event detail
 * @return {Array} Array of row info
 * @private
 */
Table.prototype._getRowsFromEventDetailChange = function (eventDetail) {
  var eventData = eventDetail[Table._CONST_DATA];
  var eventMetadata = eventDetail[Table._CONST_METADATA];
  var eventKeys = [];
  eventDetail[Table._CONST_KEYS].forEach(function (key) {
    eventKeys.push(key);
  });
  if (!(eventData instanceof Array)) {
    eventData = [eventData];
  }
  if (!(eventMetadata instanceof Array)) {
    eventMetadata = [eventMetadata];
  }
  var rowArray = [];
  var eventDataCount = eventData.length;
  for (var i = 0; i < eventDataCount; i++) {
    var rowIdx = this._getRowIdxForRowKey(eventKeys[i]);
    if (rowIdx !== undefined) {
      var row = {
        data: eventData[i],
        key: eventKeys[i],
        index: rowIdx,
        metadata: eventMetadata[i] };
      rowArray.push({ row: row, rowIdx: rowIdx });
    }
  }
  return rowArray;
};

/**
 * Callback handler for row removed in the datasource. Remove the row DOM from the
 * table body by searching for the matching rowKey. New rows will have null rowKey.
 * After removing the row, refresh all the remaining row indexes since
 * they will have shifted. Lastly, refresh the table dimensions
 * @param {Object} eventDetail event detail
 * @param {Object=} addEventDetail optional event detail for subsequent add
 * @private
 */
Table.prototype._handleDataRowRemove = function (eventDetail, addEventDetail) {
  try {
    this._executeTableBodyRowsRemove(eventDetail, addEventDetail);
  } catch (e) {
    Logger.error(e);
  } finally {
    this._clearDataWaitingState();
  }
};

/**
 * Return row info from remove event detail
 * @param {Object} eventDetail event detail
 * @return {Array} Array of row info
 * @private
 */
Table.prototype._getRowsFromEventDetailRemove = function (eventDetail) {
  var rowArray = [];
  eventDetail[Table._CONST_KEYS].forEach(function (key) {
    var rowIdx = this._getRowIdxForRowKey(key);
    if (rowIdx !== undefined) {
      var row = { key: key, index: rowIdx };
      rowArray.push({ row: row, rowIdx: rowIdx });
    }
  }.bind(this));
  return rowArray;
};

/**
 * Return whether this is a PagingModel dataprovider
 * @returns {boolean}
 * @private
 */
Table.prototype._isPagingModelDataProvider = function () {
  var dataprovider = this._getData();
  return (dataprovider.getStartItemIndex != null &&
          dataprovider.getStartItemIndex() !== null &&
          dataprovider.getStartItemIndex() >= 0);
};

/**
 * Register event listeners which need to be registered datasource.
 * @private
 */
Table.prototype._registerDataSourceEventListeners = function () {
  // register the listeners on the datasource
  var dataprovider = this._getData();
  if (dataprovider != null) {
    this._unregisterDataSourceEventListeners();

    this._dataProviderEventHandlers = [];
    this._dataProviderEventHandlers.push({
      eventType: 'mutate',
      eventHandler: this._handleDataRowMutate.bind(this)
    });
    this._dataProviderEventHandlers.push({
      eventType: 'refresh',
      eventHandler: this._handleDataRefresh.bind(this)
    });

    var dataProviderEventHandlersCount = this._dataProviderEventHandlers.length;
    for (var i = 0; i < dataProviderEventHandlersCount; i++) {
      var ev = dataprovider.addEventListener(this._dataProviderEventHandlers[i].eventType,
        this._dataProviderEventHandlers[i].eventHandler);
      if (ev) {
        this._dataProviderEventHandlers[i].eventHandler = ev;
      }
    }
  }
};

/**
 * Unregister event listeners which are registered on datasource.
 * @private
 */
Table.prototype._unregisterDataSourceEventListeners = function () {
  var dataprovider = this._getData();
  // unregister the listeners on the datasource
  if (this._dataProviderEventHandlers != null && dataprovider != null) {
    var dataProviderEventHandlersCount = this._dataProviderEventHandlers.length;
    for (var i = 0; i < dataProviderEventHandlersCount; i++) {
      dataprovider.removeEventListener(this._dataProviderEventHandlers[i].eventType,
                                       this._dataProviderEventHandlers[i].eventHandler);
    }
  }
};

/**
 * Animate a tableBodyRow
 * @param {Element} tableBodyRow  DOM element
 * @param {string} action the animation action
 * @return {Promise} Returns a Promise which resolves to true when animation is complete. Will
 * resolve to false if no animations were run.
 * @private
 */
Table.prototype._animateTableBodyRow = function (tableBodyRow, action) {
  if (this._isAnimationDisabled(action)) {
    return Promise.resolve(false);
  }
  return new Promise(function (resolve) {
    this._startAnimation(tableBodyRow, action).then(function () {
      resolve(true);
    });
  }.bind(this));
};

/**
 * Animate an array of tableBodyRows
 * @param {Array} tableBodyRowArray Array of tr DOM elements
 * @param {string} action the animation action
 * @return {Promise} Returns a Promise which resolves when animation is complete.
 * @private
 */
Table.prototype._animateTableBodyRows = function (tableBodyRowArray, action) {
  if (this._isAnimationDisabled(action)) {
    return Promise.resolve(false);
  }
  var animationPromiseArray = [];
  for (var i = 0; i < tableBodyRowArray.length; i++) {
    var tableBodyRow = tableBodyRowArray[i];
    animationPromiseArray.push((function (_tableBodyRow) {
      return this._animateTableBodyRow(_tableBodyRow, action);
    }.bind(this))(tableBodyRow));
  }
  if (animationPromiseArray.length > 0) {
    return Promise.all(animationPromiseArray);
  }
  return Promise.resolve(false);
};

/**
 * Gets the animation effect for the specific action
 * @param {string} action the action to retrieve the effect
 * @return {Object} the animation effect for the action
 * @private
 */
Table.prototype._getAnimationEffect = function (action) {
  if (this.defaultAnimations == null) {
    this.defaultAnimations = this._getDefaultOptions().animation || {};
  }
  return this.defaultAnimations[action];
};

/**
 * Returns whether animation is disabled
 * @param {string} action the animation action
 * @return {boolean} Returns true or false
 * @private
 */
Table.prototype._isAnimationDisabled = function (action) {
  // check if animation effect is null
  var effect = this._getAnimationEffect(action);
  return (effect == null || effect.length === 0);
};

/**
 * Utility method to start animation
 * @param {Element} elem element to animate
 * @param {string} action the animation action
 * @param {Object=} effect optional animation effect, if not specified then it will be derived based on action
 * @return {Promise} the promise which will be resolve when animation ends
 * @private
 */
Table.prototype._startAnimation = function (elem, action, effect) {
  if (effect == null) {
    // eslint-disable-next-line no-param-reassign
    effect = this._getAnimationEffect(action);
  }
  return AnimationUtils.startAnimation(elem, action, effect, this);
};



/* global Table:false */

/**
 * Creates an accessibility-specific child DOM element that contains the
 * current context information for the Table.
 * @private
 */
Table.prototype._createContextInfo = function () {
  var contextInfo = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  contextInfo.id = this.createSubId('context');
  contextInfo.classList.add(Table.CSS_CLASSES._TABLE_ACC_CONTEXT_INFO_CLASS);
  contextInfo.classList.add(Table.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
  this._getTableContainer().appendChild(contextInfo);
  this._contextInfo = contextInfo;

  return contextInfo;
};

/**
 * Creates an accessibility-specific child DOM element that contains the
 * current state information for the Table.
 * @private
 */
Table.prototype._createStateInfo = function () {
  var stateInfo = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  stateInfo.id = this.createSubId('state');
  stateInfo.classList.add(Table.CSS_CLASSES._TABLE_ACC_STATE_INFO_CLASS);
  stateInfo.classList.add(Table.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
  this._getTableContainer().appendChild(stateInfo);
  this._stateInfo = stateInfo;

  return stateInfo;
};

/**
 * Create a div element for the accessibility notifications
 * @return {Element} div DOM element
 * @private
 */
Table.prototype._createTableStatusAccNotification = function () {
  var tableContainer = this._getTableContainer();
  var statusNotification = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  statusNotification.setAttribute(Table.DOM_ATTR._ROLE, 'status'); // @HTMLUpdateOK
  statusNotification.classList.add(Table.CSS_CLASSES._TABLE_STATUS_ACC_NOTIFICATION_CLASS);
  statusNotification.classList.add(Table.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
  tableContainer.appendChild(statusNotification); // @HTMLUpdateOK
  this._cacheDomElement(Table.CSS_CLASSES._TABLE_STATUS_ACC_NOTIFICATION_CLASS,
                        statusNotification);

  this._accStatus = statusNotification;
  return statusNotification;
};

/**
 * @private
 */
Table.prototype._updateAccStatusInfo = function (rowIndex, columnIndex) {
  var i;
  var label = '';
  var stateInfo = '';
  var tableHeaderColumn;

  // include overall Table aria-label if needed
  if (this._accFirstFocus !== false) {
    label += this._getTableContainer().id + ' ';
  }
  if (rowIndex === -1) {
    // update column context information
    this._contextInfo.textContent =
      this.getTranslatedString('accessibleColumnHeaderContext', { index: columnIndex + 1 });
    label += this._contextInfo.id + ' ';

    if (columnIndex === -1) {
      // handle select all column header case
      tableHeaderColumn = this._getTableSelectorColumn();
      this._stateInfo.textContent = '';
    } else {
      // handle normal column header case
      tableHeaderColumn = this._getTableHeaderColumn(columnIndex);
      var selectedColumnsIdxs = this._getSelectedHeaderColumnIdxs();
      for (i = 0; i < selectedColumnsIdxs.length; i++) {
        if (selectedColumnsIdxs[i] === columnIndex) {
          stateInfo += this.getTranslatedString('accessibleStateSelected') + ' ';
          break;
        }
      }
      var column = this._getColumnDefs()[columnIndex];
      var sorted = $(tableHeaderColumn).data('sorted');
      if (sorted != null) {
        if (sorted === Table._COLUMN_SORT_ORDER._ASCENDING) {
          stateInfo += this.getTranslatedString('accessibleSortAscending', { id: '' }) + ' ';
        } else {
          stateInfo += this.getTranslatedString('accessibleSortDescending', { id: '' }) + ' ';
        }
      } else if (column.sortable === Table._OPTION_ENABLED) {
        stateInfo += this.getTranslatedString('accessibleSortable', { id: '' }) + ' ';
      }
      this._stateInfo.textContent = stateInfo;
    }
    label += tableHeaderColumn.id + ' ' + this._stateInfo.id;

    // apply new label
    this._applyAccStatusLabel(label);
  } else {
    // update row / column context information if changed
    this._contextInfo.textContent = '';
    if (rowIndex !== this._accRowIndex) {
      this._contextInfo.textContent +=
        this.getTranslatedString('accessibleRowContext', { index: rowIndex + 1 }) + ' ';
    }
    if (columnIndex !== this._accColumnIndex) {
      this._contextInfo.textContent +=
        this.getTranslatedString('accessibleColumnContext', { index: columnIndex + 1 });
    }
    label += this._contextInfo.id + ' ';

    // populate cell information
    var tableBodyCellElements = this._getTableElementsByClassName(
      this._getTableBodyRow(rowIndex), Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS);
    tableHeaderColumn = this._getTableHeaderColumn(columnIndex);
    if (tableHeaderColumn != null) {
      label += tableHeaderColumn.id + ' ' + tableBodyCellElements[columnIndex].id + ' ';
    }

    // find state of the row
    var selectedRowIdxs = this._getSelectedRowIdxs();
    for (i = 0; i < selectedRowIdxs.length; i++) {
      if (selectedRowIdxs[i] === rowIndex) {
        stateInfo += this.getTranslatedString('accessibleStateSelected') + ' ';
        break;
      }
    }
    this._stateInfo.textContent = stateInfo;
    label += this._stateInfo.id;

    // apply new label
    this._applyAccStatusLabel(label);
  }
  this._accRowIndex = rowIndex;
  this._accColumnIndex = columnIndex;
};

/**
 * @private
 */
Table.prototype._applyAccStatusLabel = function (label) {
  if (this._accFirstFocus !== false) {
    this._accFirstFocus = false;
  } else {
    this._accStatus.setAttribute(Table.DOM_ATTR._ARIA_LABELLEDBY, label); // @HTMLUpdateOK
  }
  this._getTable().setAttribute(Table.DOM_ATTR._ARIA_LABELLEDBY, label); // @HTMLUpdateOK
};

/**
 * Updates the Table's accessibility status to point to the given row.
 * @private
 */
Table.prototype._setRowLabelledBy = function (rowIdx, tableBodyRow) {
  var i;
  this._contextInfo.textContent =
    this.getTranslatedString('accessibleRowContext', { index: rowIdx + 1 });
  var tableBodyCellElements = this._getTableElementsByClassName(tableBodyRow,
    Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS);
  var label = '';
  if (this._accFirstFocus !== false) {
    label += this._getTableContainer().id + ' ';
  }
  label += this._contextInfo.id + ' ';
  for (i = 0; i < tableBodyCellElements.length; i++) {
    label += this._getTableHeaderColumn(i).id + ' ' +
      tableBodyCellElements[i].id + ' ';
  }
  label += this._stateInfo.id;
  var stateInfo = '';
  var selectedRowIdxs = this._getSelectedRowIdxs();
  for (i = 0; i < selectedRowIdxs.length; i++) {
    if (selectedRowIdxs[i] === rowIdx) {
      stateInfo += this.getTranslatedString('accessibleStateSelected') + ' ';
      break;
    }
  }
  this._stateInfo.textContent = stateInfo;

  // apply new label
  this._applyAccStatusLabel(label);
};

/**
 * Updates the Table's accessibility status to point to the given column header.
 * @private
 */
Table.prototype._setHeaderColumnLabelledBy = function (columnIdx) {
  this._contextInfo.textContent =
    this.getTranslatedString('accessibleColumnHeaderContext', { index: columnIdx + 1 });
  var tableHeaderColumn;
  var stateInfo = '';
  // handle select all column header case
  if (columnIdx === -1) {
    tableHeaderColumn = this._getTableSelectorColumn();
    this._stateInfo.textContent = '';
  } else {
    tableHeaderColumn = this._getTableHeaderColumn(columnIdx);
    var selectedColumnsIdxs = this._getSelectedHeaderColumnIdxs();
    for (var i = 0; i < selectedColumnsIdxs.length; i++) {
      if (selectedColumnsIdxs[i] === columnIdx) {
        stateInfo += this.getTranslatedString('accessibleStateSelected') + ' ';
        break;
      }
    }
    var column = this._getColumnDefs()[columnIdx];
    var sorted = $(tableHeaderColumn).data('sorted');
    if (sorted != null) {
      if (sorted === Table._COLUMN_SORT_ORDER._ASCENDING) {
        stateInfo += this.getTranslatedString('accessibleSortAscending', { id: '' }) + ' ';
      } else {
        stateInfo += this.getTranslatedString('accessibleSortDescending', { id: '' }) + ' ';
      }
    } else if (column.sortable === Table._OPTION_ENABLED) {
      stateInfo += this.getTranslatedString('accessibleSortable', { id: '' }) + ' ';
    }
    this._stateInfo.textContent = stateInfo;
  }
  var label = '';
  if (this._accFirstFocus !== false) {
    label += this._getTableContainer().id + ' ';
  }
  label += this._contextInfo.id + ' ' + tableHeaderColumn.id + ' ' + this._stateInfo.id;

  // apply new label
  this._applyAccStatusLabel(label);
};



/* global Components:false, Context:false, DataCollectionUtils:false, Logger:false, RegExpValidator:false, Table:false, Translations:false */

/**
 * Clear any cached DOM
 * @private
 */
Table.prototype._clearCachedDom = function () {
  this._clearCachedDomRowData();
  this._clearDomCache();
};

/**
 * Clear any cached DOM rows
 * @private
 */
Table.prototype._clearCachedDomRowData = function () {
  this._cachedDomTableBodyRows = null;
};

/**
 * Add a default context menu to the table container if there is none. If there is
 * a context menu set on the table options we use that one. Add listeners
 * for context menu before show and select.
 * @param {function(Object)} handleContextMenuSelect function called for menu select
 * @return {Element} ul DOM element
 * @private
 */
Table.prototype._createContextMenu = function (handleContextMenuSelect) {
  var menuContainer = this._GetContextMenu();
  var enableNonContiguousSelectionMenu = this._isTouchDevice() ?
    this._getRowSelectionMode() === Table._OPTION_SELECTION_MODES._MULTIPLE : false;

  if (menuContainer) {
    var listItems = menuContainer.querySelectorAll('[data-oj-command]');
    if (listItems.length > 0) {
      var command;
      var i;
      var newItem;
      for (i = 0; i < listItems.length; i++) {
        if (listItems[i].tagName === 'OJ-OPTION' ||
            listItems[i].getElementsByTagName(Table.DOM_ELEMENT._A).length === 0) {
          command = listItems[i].getAttribute('data-oj-command').split('-');
          newItem = this._createContextMenuItem(command[command.length - 1],
                                                this._IsCustomElement());
          if (listItems[i].tagName === 'OJ-OPTION') {
            listItems[i].innerHTML = newItem.innerHTML; // @HTMLUpdateOK
          } else {
            $(listItems[i]).replaceWith(newItem); // @HTMLUpdateOK
          }
        }
      }
      this._menuContainer = menuContainer;
      if ($(menuContainer).data('oj-ojMenu')) {
        if (this._IsCustomElement()) {
          menuContainer.refresh();
        } else {
          $(menuContainer).ojMenu('refresh');
        }
      }

      if (this._IsCustomElement()) {
        menuContainer.addEventListener('ojAction', handleContextMenuSelect);
      } else {
        $(menuContainer).on('ojselect', handleContextMenuSelect);
      }
    }
  } else if (this._isTableSortable() || enableNonContiguousSelectionMenu ||
             this._isTableColumnsResizable()) {
    if (this._IsCustomElement()) {
      menuContainer = document.createElement('oj-menu');
      menuContainer.setAttribute('data-oj-binding-provider', 'none');
    } else {
      menuContainer = document.createElement(Table.DOM_ELEMENT._UL); // @HTMLUpdateOK
    }
    menuContainer.style[Table.CSS_PROP._DISPLAY] = Table.CSS_VAL._NONE;
    menuContainer.setAttribute(Table.DOM_ATTR._ID, this._getTableId() + '_contextmenu'); // @HTMLUpdateOK
    this._getTableContainer().appendChild(menuContainer); // @HTMLUpdateOK
    if (this._isTableSortable()) {
      var sortMenu = this._createContextMenuItem('sort', this._IsCustomElement());
      menuContainer.appendChild(sortMenu); // @HTMLUpdateOK
    }
    if (enableNonContiguousSelectionMenu) {
      var nonContiguousSelectionMenu = this._createContextMenuItem('enableNonContiguousSelection', this._IsCustomElement());
      menuContainer.appendChild(nonContiguousSelectionMenu); // @HTMLUpdateOK
    }
    if (this._isTableColumnsResizable()) {
      var resizeMenu = this._createContextMenuItem('resize', this._IsCustomElement());
      menuContainer.appendChild(resizeMenu); // @HTMLUpdateOK
    }
    this._menuContainer = menuContainer;
    if (this._IsCustomElement()) {
      menuContainer.addEventListener('ojAction', handleContextMenuSelect);
    } else {
      $(menuContainer).ojMenu();
      $(menuContainer).on('ojselect', handleContextMenuSelect);
    }
    this.option('contextMenu', '#' + menuContainer.getAttribute(Table.DOM_ATTR._ID), {
      _context: {
        internalSet: true
      }
    });
    // fulfill _GetDefaultContextMenu contract
    this._defaultContextMenu = menuContainer;
  }
  return menuContainer;
};

/**
 * Builds a menu for a command, takes care of submenus where appropriate
 * @param {string} command the string to look up command value for as well as translation
 * @param {boolean=} useOjOption whether oj-option tag should be used, which is the case for custom element (except for default menu)
 * @return {Element} li DOM element
 * @private
 */
Table.prototype._createContextMenuItem = function (command, useOjOption) {
  if (command === 'sort') {
    var listElement;
    var sortMenuListItem = this._createContextMenuListItem(command, useOjOption);
    if (this._IsCustomElement()) {
      listElement = document.createElement('oj-menu');
    } else {
      listElement = document.createElement(Table.DOM_ELEMENT._UL); // @HTMLUpdateOK
    }
    sortMenuListItem.appendChild(listElement); // @HTMLUpdateOK
    listElement.appendChild(this._createContextMenuListItem('sortAsc', useOjOption)); // @HTMLUpdateOK
    listElement.appendChild(this._createContextMenuListItem('sortDsc', useOjOption)); // @HTMLUpdateOK
    return sortMenuListItem;
  } else if (command === 'sortAsc') {
    return this._createContextMenuListItem(command, useOjOption);
  } else if (command === 'sortDsc') {
    return this._createContextMenuListItem(command, useOjOption);
  } else if (command === 'enableNonContiguousSelection') {
    return this._createContextMenuListItem(command, useOjOption);
  } else if (command === 'disableNonContiguousSelection') {
    return this._createContextMenuListItem(command, useOjOption);
  } else if (command === 'resize') {
    // create the resize popup too
    this._createContextMenuResizePopup(0);
    return this._createContextMenuListItem(command, useOjOption);
  }
  return null;
};

/**
 * Builds a context menu list item from a command
 * @param {string} command the string to look up command value for as well as translation
 * @param {boolean=} useOjOption whether oj-option tag should be used, which is the case for custom element (except for default menu)
 * @return {Element} DOM element for menu item
 * @private
 */
Table.prototype._createContextMenuListItem = function (command, useOjOption) {
  var contextMenuListItem = document.createElement(useOjOption ? 'oj-option' : 'li');
  contextMenuListItem.setAttribute('data-oj-command', 'oj-table-' + command);
  contextMenuListItem.appendChild(this._createContextMenuLabel(command, useOjOption)); // @HTMLUpdateOK

  return contextMenuListItem;
};

/**
 * Builds a context menu label by looking up command translation
 * @param {string} command the string to look up translation for
 * @param {boolean=} useOjOption whether oj-option tag should be used, which is the case for custom element (except for default menu)
 * @return {Node} a DOM node
 * @private
 */
Table.prototype._createContextMenuLabel = function (command, useOjOption) {
  var commandString = null;
  if (command === 'sort') {
    commandString = this.getTranslatedString('labelSort');
  } else if (command === 'sortAsc') {
    commandString = this.getTranslatedString('labelSortAsc');
  } else if (command === 'sortDsc') {
    commandString = this.getTranslatedString('labelSortDsc');
  } else if (command === 'enableNonContiguousSelection') {
    commandString = this.getTranslatedString('labelEnableNonContiguousSelection');
  } else if (command === 'disableNonContiguousSelection') {
    commandString = this.getTranslatedString('labelDisableNonContiguousSelection');
  } else if (command === 'resize') {
    commandString = this.getTranslatedString('labelResize');
  }

  var textNode = document.createTextNode(commandString);

  // for custom elements, no <a> tag is required
  if (useOjOption) {
    return textNode;
  }

  var contextMenuLabel = document.createElement(Table.DOM_ELEMENT._A); // @HTMLUpdateOK
  contextMenuLabel.setAttribute(Table.DOM_ATTR._HREF, '#'); // @HTMLUpdateOK
  contextMenuLabel.appendChild(textNode); // @HTMLUpdateOK

  return contextMenuLabel;
};

/**
 * Build the html for the resize popup and add it to the root node
 * @param {number} initialSize the initial size to put in the spinner
 * @private
 */
Table.prototype._createContextMenuResizePopup = function (initialSize) {
  // eslint-disable-next-line no-param-reassign
  initialSize = Math.round(initialSize);
  var popup = this._getContextMenuResizePopup();
  var spinner;
  var cancelActionHandler;
  var tableContainer;
  var popupHeader;
  var popupBody;
  var popupFooter;
  var popupCancelButton;
  var popupOKButton;
  var popupTitle;
  var position;

  if (this._IsCustomElement()) {
    // create the base popup
    if (popup == null) {
      tableContainer = this._getTableContainer();
      popup = document.createElement('oj-popup');
      popup.setAttribute('id', this._getTableId() + '_resize_popup');
      popup.setAttribute('data-oj-binding-provider', 'none');
      tableContainer.appendChild(popup); // @HTMLUpdateOK
      popupHeader = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
      popupBody = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
      popupFooter = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
      popupFooter.classList.add(Table.CSS_CLASSES._TEXT_ALIGN_END);
      popup.appendChild(popupHeader); // @HTMLUpdateOK
      popup.appendChild(popupBody); // @HTMLUpdateOK
      popup.appendChild(popupFooter); // @HTMLUpdateOK

      // create the popup content
      popupTitle = document.createElement('h6');
      popupTitle.textContent = this.getTranslatedString('labelResizePopupSpinner');
      popupHeader.appendChild(popupTitle); // @HTMLUpdateOK

      spinner = document.createElement('oj-input-number');
      spinner.setAttribute('id', this._getTableId() + '_resize_popup_spinner');

      popupCancelButton = document.createElement('oj-button');
      popupCancelButton.setAttribute('id', this._getTableId() + '_resize_popup_popupcancel');
      popupCancelButton.style.margin = '5px';
      popupCancelButton.textContent = this.getTranslatedString('labelResizePopupCancel');

      popupOKButton = document.createElement('oj-button');
      popupOKButton.setAttribute('id', this._getTableId() + '_resize_popup_popupsubmit');
      popupOKButton.style.margin = '5px';
      popupOKButton.textContent = this.getTranslatedString('labelResizePopupSubmit');

      popupBody.appendChild(spinner); // @HTMLUpdateOK
      popupFooter.appendChild(popupOKButton); // @HTMLUpdateOK
      popupFooter.appendChild(popupCancelButton); // @HTMLUpdateOK

      cancelActionHandler = function () {
        popupOKButton.disabled = false;
        spinner.value = 0;
        popup.close();
      };

      popupCancelButton.addEventListener('click', cancelActionHandler);
      popupOKButton.addEventListener('click', this._handleContextMenuResizePopup.bind(this));

      spinner.max = 1000;
      spinner.min = 10;
      spinner.step = 1;
      spinner.value = initialSize;
      spinner.displayOptions = {
        messages: ['notewindow']
      };
      spinner.userAssistanceDensity = 'compact';
      spinner.validators = [new RegExpValidator({
        pattern: '^[1-9][0-9]*$',
        messageDetail: this.getTranslatedString('msgColumnResizeWidthValidation')
      })];

      spinner.addEventListener('validChanged', function (event) {
        if (event.detail.value === 'valid') {
          popupOKButton.disabled = false;
        } else {
          popupOKButton.disabled = true;
        }
      });

      position = {
        my: 'start top',
        at: 'start bottom',
        collision: 'flipfit'
      };

      popup.setAttribute('position', JSON.stringify(position));
      this._cacheDomElement(this._getTableId() + '_resize_popup', popup);
    } else {
      spinner = document.getElementById(this._getTableId() + '_resize_popup_spinner');
      spinner.value = initialSize;
    }
  } else {
    tableContainer = this._getTableContainer();
    // create the base popup
    if (popup == null) {
      popup = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
      popup.setAttribute('id', this._getTableId() + '_resize_popup');
      popup.setAttribute('data-oj-context', '');
      tableContainer.appendChild(popup); // @HTMLUpdateOK
      popupHeader = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
      popupBody = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
      popupFooter = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
      popupFooter.classList.add(Table.CSS_CLASSES._TEXT_ALIGN_END);
      popup.appendChild(popupHeader); // @HTMLUpdateOK
      popup.appendChild(popupBody); // @HTMLUpdateOK
      popup.appendChild(popupFooter); // @HTMLUpdateOK

      // create the popup content
      popupTitle = document.createElement('h6');
      popupTitle.textContent = this.getTranslatedString('labelResizePopupSpinner');
      popupHeader.appendChild(popupTitle); // @HTMLUpdateOK

      spinner = document.createElement(Table.DOM_ELEMENT._INPUT); // @HTMLUpdateOK
      spinner.setAttribute('id', this._getTableId() + '_resize_popup_spinner');
      popupCancelButton = document.createElement(Table.DOM_ELEMENT._BUTTON); // @HTMLUpdateOK
      popupCancelButton.setAttribute('id', this._getTableId() + '_resize_popup_popupcancel');
      popupCancelButton.style.margin = '5px';
      popupOKButton = document.createElement(Table.DOM_ELEMENT._BUTTON); // @HTMLUpdateOK
      popupOKButton.setAttribute('id', this._getTableId() + '_resize_popup_popupsubmit');
      popupOKButton.style.margin = '5px';

      popupBody.appendChild(spinner); // @HTMLUpdateOK
      popupFooter.appendChild(popupOKButton); // @HTMLUpdateOK
      popupFooter.appendChild(popupCancelButton); // @HTMLUpdateOK

      $(popupOKButton).ojButton({
        component: 'ojButton',
        label: this.getTranslatedString('labelResizePopupSubmit')
      });
      $(popupCancelButton).ojButton({
        component: 'ojButton',
        label: this.getTranslatedString('labelResizePopupCancel')
      });
      cancelActionHandler = function () {
        $(popupOKButton).ojButton({ disabled: false });
        $(spinner).ojInputNumber({ value: 0 });
        $(popup).ojPopup('close');
      };
      $(popupOKButton).on('click', this._handleContextMenuResizePopup.bind(this));
      $(popupCancelButton).on('click', cancelActionHandler);
      $(spinner).ojInputNumber({
        component: 'ojInputNumber',
        max: 10000,
        min: 10,
        step: 1,
        value: initialSize,
        displayOptions: {
          messages: ['notewindow']
        },
        userAssistanceDensity: 'compact',
        validators: [new RegExpValidator({
          pattern: '^[1-9][0-9]*$',
          messageDetail: this.getTranslatedString('msgColumnResizeWidthValidation')
        })]
      });
      $(popup).ojPopup({
        modality: 'modal',
        position: {
          my: 'start top',
          at: 'start bottom',
          collision: 'flipfit'
        }
      });
      $(spinner).on('change', function () {
        $(popupOKButton).ojButton({ disabled: !$(spinner).ojInputNumber('validate') });
      });
      this._cacheDomElement(this._getTableId() + '_resize_popup', popup);
    } else {
      spinner = document.getElementById(this._getTableId() + '_resize_popup_spinner');
      $(spinner).ojInputNumber('option', 'value', initialSize);
    }
  }
  return popup;
};

/**
 * Create the initial empty table
 * @param {boolean} isTableHeaderless is table headerless
 * @param {boolean} isTableFooterless is table footerless
 * @return {Element} table DOM element
 * @private
 */
Table.prototype._createInitialTable = function (isTableHeaderless, isTableFooterless) {
  var table = this._getTable();
  this._createTableContainer();

  if (!isTableHeaderless) {
    this._createTableHeader();
  }
  if (!isTableFooterless) {
    this._createTableFooter();
  }
  this._createTableBody();
  this._createTableStatusMessage();
  this._createTableStatusAccNotification();
  this._createContextInfo();
  this._createStateInfo();

  return table;
};

/**
 * Create an empty tbody element with appropriate styling
 * @return {Element} tbody DOM element
 * @private
 */
Table.prototype._createTableBody = function () {
  var table = this._getTable();
  var tableBody = document.createElement(Table.DOM_ELEMENT._TBODY); // @HTMLUpdateOK
  table.appendChild(tableBody); // @HTMLUpdateOK
  this._cacheDomElement(Table.CSS_CLASSES._TABLE_BODY_CLASS, tableBody);

  return tableBody;
};

/**
 * Create an empty td element with appropriate styling
 * @param {number} rowIdx  row index
 * @param {number} columnIdx  column index
 * @return {Element} td DOM element
 * @private
 */
Table.prototype._createTableBodyCell = function () {
  return document.createElement(Table.DOM_ELEMENT._TD); // @HTMLUpdateOK
};

/**
 * Create a selector for multiple row selection
 * @param {Object} rowKey  row key
 * @param {Element} tableBodyRow  tr DOM element
 * @return {Element} td DOM element
 * @private
 */
Table.prototype._createTableBodyDefaultSelector = function (rowKey, tableBodyRow) {
  var selectorCell = null;

  selectorCell = document.createElement(Table.DOM_ELEMENT._TD); // @HTMLUpdateOK
  selectorCell.classList.add(Table.CSS_CLASSES._TABLE_SELECTOR_CELL);
  if (this._isVerticalGridEnabled()) {
    selectorCell.classList.add(Table.CSS_CLASSES._TABLE_VGRID_LINES_CLASS);
  }

  var selector = document.createElement('oj-selector');
  selector.id = 'table_selector' + rowKey;
  selector.selectedKeys = this.options.selected.row;
  selector.setAttribute('data-oj-binding-provider', 'none');
  selector.classList.add(Table.CSS_CLASSES._TABLE_DATA_ROW_SELECTOR_CLASS);
  selector.setAttribute('selection-mode', 'multiple');
  selector.rowKey = rowKey;
  selector.addEventListener('selectedKeysChanged', function (event) {
    if (event.detail.updatedFrom === 'internal') {
      this._setSelected({ row: event.detail.value, column: new oj.KeySetImpl() }, false, true);
    }
  }.bind(this));
  selectorCell.appendChild(selector);

  tableBodyRow.insertBefore(selectorCell, tableBodyRow.firstChild); // @HTMLUpdateOK

  return selectorCell;
};

/**
 * Create a th element for default selector
 * @return {Element} th DOM element
 * @private
 */
Table.prototype._createTableHeaderSelectorColumn = function () {
  var headerColumn = document.createElement(Table.DOM_ELEMENT._TH); // @HTMLUpdateOK
  headerColumn.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_SELECTOR_CELL_CLASS);
  if (this._isVerticalGridEnabled()) {
    headerColumn.classList.add(Table.CSS_CLASSES._TABLE_VGRID_LINES_CLASS);
  }

  var selector = document.createElement('oj-selector');
  selector.selectedKeys = this.options.selected.row;
  selector.setAttribute('data-oj-binding-provider', 'none');
  selector.classList.add(Table.CSS_CLASSES._TABLE_HEADER_SELECTOR_CLASS);
  selector.setAttribute('selection-mode', 'all');
  selector.addEventListener('selectedKeysChanged', function (event) {
    if (event.detail.updatedFrom === 'internal') {
      this._setSelected({ row: event.detail.value, column: new oj.KeySetImpl() }, false, true);
    }
  }.bind(this));
  headerColumn.appendChild(selector);

  return headerColumn;
};

/**
 * Create the message td element with appropriate styling and message
 * @param {Element} tableBodyMessageRow tr DOM element
 * @param {number} columnCount  number of visible columns
 * @param {string} message message
 * @return {Element} td DOM element
 * @private
 */
Table.prototype._createTableBodyMessageCell = function (tableBodyMessageRow, columnCount, message) {
  var messageCell = document.createElement(Table.DOM_ELEMENT._TD); // @HTMLUpdateOK
  if (this._isDefaultSelectorEnabled()) {
    // eslint-disable-next-line no-param-reassign
    columnCount += 1;
  }
  messageCell.setAttribute(Table.DOM_ATTR._COLSPAN, columnCount); // @HTMLUpdateOK
  messageCell.classList.add(Table.CSS_CLASSES._TABLE_BODY_MESSAGE_CLASS);
  messageCell.appendChild(document.createTextNode(message)); // @HTMLUpdateOK
  tableBodyMessageRow.appendChild(messageCell); // @HTMLUpdateOK
  return messageCell;
};

/**
 * Create the message row with appropriate styling
 * @param {number} columnCount  number of visible columns
 * @param {string} message message
 * @return {Element} row DOM element
 * @private
 */
Table.prototype._createTableBodyMessageRow = function (columnCount, message) {
  var tableBody = this._getTableBody();
  var tableBodyMessageRow = document.createElement(Table.DOM_ELEMENT._TR); // @HTMLUpdateOK
  tableBodyMessageRow.classList.add(Table.CSS_CLASSES._TABLE_BODY_MESSAGE_ROW_CLASS);
  this._createTableBodyMessageCell(tableBodyMessageRow, columnCount, message);

  tableBody.appendChild(tableBodyMessageRow); // @HTMLUpdateOK
  return tableBodyMessageRow;
};

/**
 * Create an empty tr element with appropriate styling
 * @return {Element} tr DOM element
 * @private
 */
Table.prototype._createTableBodyRow = function () {
  return document.createElement(Table.DOM_ELEMENT._TR); // @HTMLUpdateOK
};

/**
 * Get the touch affordance glass pane.
 * @private
 */
Table.prototype._getTouchAffordanceGlassPane = function () {
  var tableContainer = this._getTableContainer();
  var touchAffordanceGlassPane = this._getTableElementsByClassName(tableContainer,
    Table.CSS_CLASSES._TABLE_TOUCH_AFFORDANCE_GLASS_PANE_CLASS);

  if (touchAffordanceGlassPane.length > 0) {
    return touchAffordanceGlassPane[0];
  }
  return null;
};

/**
 * Create the touch affordance glass pane.
 * @private
 */
Table.prototype._createTouchAffordanceGlassPane = function () {
  var touchAffordanceGlassPane = this._getTouchAffordanceGlassPane();
  if (!touchAffordanceGlassPane) {
    var tableContainer = this._getTableContainer();
    touchAffordanceGlassPane = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
    touchAffordanceGlassPane.classList.add(
      Table.CSS_CLASSES._TABLE_TOUCH_AFFORDANCE_GLASS_PANE_CLASS);
    tableContainer.appendChild(touchAffordanceGlassPane); // @HTMLUpdateOK
    this._refreshTouchAffordanceGlassPanePosition();
  }
  return touchAffordanceGlassPane;
};

/**
 * Add the touch affordance to the table row.
 * @param {number} rowIdx  row index
 * @private
 */
Table.prototype._createTableBodyRowTouchSelectionAffordance = function (rowIdx) {
  var touchAffordanceGlassPane = this._createTouchAffordanceGlassPane();

  var topAffordance = this._getTableBodyRowTouchSelectionAffordanceTop();
  if (!topAffordance) {
    topAffordance = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
    topAffordance.classList.add(
      Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_CLASS);
    topAffordance.classList.add(
      Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOUCH_AREA_CLASS);
    var topIcon = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
    topIcon.classList.add(
      Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_ICON_CLASS);
    topIcon.setAttribute(Table.DOM_ATTR._ROLE, 'button'); // @HTMLUpdateOK
    topIcon.setAttribute(Table.DOM_ATTR._ARIA_LABEL, // @HTMLUpdateOK
      this.getTranslatedString('labelAccSelectionAffordanceTop'));
    topAffordance.appendChild(topIcon); // @HTMLUpdateOK
    touchAffordanceGlassPane.appendChild(topAffordance); // @HTMLUpdateOK
  }

  var bottomAffordance = this._getTableBodyRowTouchSelectionAffordanceBottom();
  if (!bottomAffordance) {
    bottomAffordance = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
    bottomAffordance.classList.add(
      Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_CLASS);
    bottomAffordance.classList.add(
      Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOUCH_AREA_CLASS);
    var bottomIcon = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
    bottomIcon.classList.add(
      Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_ICON_CLASS);
    bottomIcon.setAttribute(Table.DOM_ATTR._ROLE, 'button'); // @HTMLUpdateOK
    bottomIcon.setAttribute(Table.DOM_ATTR._ARIA_LABEL, // @HTMLUpdateOK
      this.getTranslatedString('labelAccSelectionAffordanceBottom'));
    bottomAffordance.appendChild(bottomIcon); // @HTMLUpdateOK
    touchAffordanceGlassPane.appendChild(bottomAffordance); // @HTMLUpdateOK
  }

  // these two methods ensure the rowIdx value is set on the affordances
  this._moveTableBodyRowTouchSelectionAffordanceTop(rowIdx);
  this._moveTableBodyRowTouchSelectionAffordanceBottom(rowIdx);
};

/**
 * Create the bottom slot element with appropriate styling
 * @private
 */
Table.prototype._createTableBottomSlot = function () {
  var tableContainer = this._getTableContainer();
  var tableBottomSlot = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  tableBottomSlot.classList.add(Table.CSS_CLASSES._TABLE_BOTTOM_SLOT_CLASS);
  tableContainer.appendChild(tableBottomSlot); // @HTMLUpdateOK
  this._cacheDomElement(Table.CSS_CLASSES._TABLE_BOTTOM_SLOT_CLASS, tableBottomSlot);

  return tableBottomSlot;
};

/**
 * Create an empty div element with appropriate styling
 * @return {Element} div DOM element
 * @private
 */
Table.prototype._createTableContainer = function () {
  // need to enclose the table in a div to provide horizontal scrolling
  var tableContainer = this.OuterWrapper;
  if (!tableContainer) {
    tableContainer = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
    this.element[0].parentNode.replaceChild(tableContainer, this.element[0]);
    tableContainer.insertBefore(this.element[0], tableContainer.firstChild); // @HTMLUpdateOK
  }
  this._cacheDomElement(Table.CSS_CLASSES._TABLE_CONTAINER_CLASS, tableContainer);

  // add main css class to container
  tableContainer.classList.add(Table.CSS_CLASSES._TABLE_CLASS);
  tableContainer.classList.add(Table.CSS_CLASSES._TABLE_CONTAINER_CLASS);
  tableContainer.classList.add(Table.MARKER_STYLE_CLASSES._WIDGET);

  return tableContainer;
};

/**
 * Create an empty tfoot with appropriate styling
 * @return {Element} tfoot DOM element
 * @private
 */
Table.prototype._createTableFooter = function () {
  var table = this._getTable();
  var tableFooter = document.createElement(Table.DOM_ELEMENT._TFOOT); // @HTMLUpdateOK
  var tableFooterRow = document.createElement(Table.DOM_ELEMENT._TR); // @HTMLUpdateOK

  tableFooter.appendChild(tableFooterRow); // @HTMLUpdateOK

  // check if thead is already there. If so add relative to thead.
  var tableHeader = this._getTableHeader();
  if (tableHeader != null) {
    tableHeader.parentNode.insertBefore(tableFooter, tableHeader.nextSibling); // @HTMLUpdateOK
  } else {
    // check if tbody is already there. If so add relative to tbody.
    var tableBody = this._getTableBody();
    if (tableBody != null) {
      tableBody.parentNode.insertBefore(tableFooter, tableBody); // @HTMLUpdateOK
    } else {
      table.appendChild(tableFooter); // @HTMLUpdateOK
    }
  }
  this._cacheDomElement(Table.CSS_CLASSES._TABLE_FOOTER_CLASS, tableFooter);

  return tableFooter;
};

/**
 * Create an empty td element with appropriate styling
 * @param {number} columnIdx  column index
 * @return {Element} td DOM element
 * @private
 */
Table.prototype._createTableFooterCell = function () {
  return document.createElement(Table.DOM_ELEMENT._TD); // @HTMLUpdateOK
};

/**
 * Create an empty thead & tr element with appropriate styling
 * @return {Element} thead DOM element
 * @private
 */
Table.prototype._createTableHeader = function () {
  var table = this._getTable();
  var tableHeader = document.createElement(Table.DOM_ELEMENT._THEAD); // @HTMLUpdateOK
  var tableHeaderRow = document.createElement(Table.DOM_ELEMENT._TR); // @HTMLUpdateOK
  tableHeader.appendChild(tableHeaderRow); // @HTMLUpdateOK

  // check if tfoot is already there. If so add relative to tfoot.
  var tableFooter = this._getTableFooter();
  if (tableFooter != null) {
    tableFooter.parentNode.insertBefore(tableHeader, tableFooter); // @HTMLUpdateOK
  } else {
    // check if tbody is already there. If so add relative to tbody.
    var tableBody = this._getTableBody();
    if (tableBody != null) {
      tableBody.parentNode.insertBefore(tableHeader, tableBody); // @HTMLUpdateOK
    } else {
      table.appendChild(tableHeader); // @HTMLUpdateOK
    }
  }
  this._cacheDomElement(Table.CSS_CLASSES._TABLE_HEADER_ROW_CLASS, tableHeaderRow);
  this._cacheDomElement(Table.CSS_CLASSES._TABLE_HEADER_CLASS, tableHeader);

  return tableHeader;
};

/**
 * Create a th element with appropriate styling and column content
 * @param {number} columnIdx  column index
 * @return {Element} th DOM element
 * @private
 */
Table.prototype._createTableHeaderColumn = function (columnIdx) {
  var column = this._getColumnDefs()[columnIdx];
  var headerColumnCell = document.createElement(Table.DOM_ELEMENT._TH); // @HTMLUpdateOK
  this._styleTableHeaderColumn(columnIdx, headerColumnCell, true);
  // add abbr for acc
  headerColumnCell.setAttribute('abbr', column.headerText);
  // add title for tooltip
  headerColumnCell.setAttribute(Table.DOM_ATTR._TITLE, column.headerText); // @HTMLUpdateOK
  this._insertTableHeaderColumn(columnIdx, headerColumnCell);
  var headerContext = {
    columnIndex: columnIdx,
    headerContext: {
      component: this,
      parentElement: headerColumnCell
    }
  };
  if (column.resizable === Table._OPTION_ENABLED) {
    headerColumnCell.setAttribute('data-oj-resizable', Table._OPTION_ENABLED);
  }
  if (column.sortable === Table._OPTION_ENABLED) {
    headerColumnCell.setAttribute('data-oj-sortable', Table._OPTION_ENABLED);
    this._columnHeaderSortableIconRenderer(headerContext);
  } else {
    this._columnHeaderDefaultRenderer(headerContext);
  }

  return headerColumnCell;
};

/**
 * Create the drag image for the column
 * @param {number} columnIdx  column index
 * @return {Element} DOM element
 * @private
 */
Table.prototype._createTableHeaderColumnDragImage = function (columnIdx) {
  var headerColumn = this._getTableHeaderColumn(columnIdx);
  var headerColumnDragImage = headerColumn.cloneNode(true);
  headerColumnDragImage.classList.remove(Table.MARKER_STYLE_CLASSES._DRAG);
  headerColumnDragImage.classList.remove(Table.MARKER_STYLE_CLASSES._FOCUS);
  headerColumnDragImage.classList.remove(Table.MARKER_STYLE_CLASSES._FOCUS_HIGHLIGHT);
  headerColumnDragImage.classList.remove(Table.MARKER_STYLE_CLASSES._HOVER);
  headerColumnDragImage.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_DRAG_IMAGE);
  headerColumnDragImage.style[Table.CSS_PROP._POSITION] = Table.CSS_VAL._ABSOLUTE;
  headerColumnDragImage.style[Table.CSS_PROP._TOP] = '0';
  headerColumnDragImage.style[Table.CSS_PROP._LEFT] = '-999em';
  headerColumnDragImage.style[Table.CSS_PROP._ZINDEX] = '-999';

  // The drag image element must be either visible or a child of document.body
  // in order to show on Safari.
  document.body.appendChild(headerColumnDragImage); // @HTMLUpdateOK

  return headerColumnDragImage;
};

/**
 * Create a div element for resize indicator
 * @return {Element} div DOM element
 * @private
 */
Table.prototype._createTableHeaderColumnResizeIndicator = function () {
  var tableHeaderColumnResizeIndicator = this._getTableHeaderColumnResizeIndicator();

  if (!tableHeaderColumnResizeIndicator) {
    var tableContainer = this._getTableContainer();
    tableHeaderColumnResizeIndicator = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
    tableContainer.appendChild(tableHeaderColumnResizeIndicator);
    tableHeaderColumnResizeIndicator.classList.add(
      Table.CSS_CLASSES._COLUMN_HEADER_RESIZE_INDICATOR_CLASS);
    this._cacheDomElement(Table.CSS_CLASSES._COLUMN_HEADER_RESIZE_INDICATOR_CLASS,
                          tableHeaderColumnResizeIndicator);
  }

  return tableHeaderColumnResizeIndicator;
};

/**
 * Helper method to create subid based on the root element's id
 * @param {string} subId - the id to append to the root element id
 * @return {string} the subId to append to the root element id
 */
Table.prototype.createSubId = function (subId) {
  // id empty string if not set, enver null
  var id = this._getRootElement().id;
  return [id, subId].join(':');
};

/**
 * Create a div element for the Fetching Data... status message
 * @return {Element} div DOM element
 * @private
 */
Table.prototype._createTableStatusMessage = function () {
  var tableContainer = this._getTableContainer();
  var statusMessage = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  statusMessage.classList.add(Table.CSS_CLASSES._TABLE_STATUS_MESSAGE_CLASS);
  statusMessage.style[Table.CSS_PROP._DISPLAY] = Table.CSS_VAL._NONE;

  if (!this._isSkeletonSupport()) {
    var statusMessageLoadingIndicator = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
    statusMessageLoadingIndicator.classList.add(Table.CSS_CLASSES._ICON_CLASS);
    statusMessageLoadingIndicator.classList.add(Table.CSS_CLASSES._TABLE_LOADING_ICON_CLASS);
    statusMessageLoadingIndicator.setAttribute(
      'aria-label', this.getTranslatedString(Table._BUNDLE_KEY._MSG_FETCHING_DATA)
    );
    statusMessage.appendChild(statusMessageLoadingIndicator); // @HTMLUpdateOK
  }

  tableContainer.appendChild(statusMessage); // @HTMLUpdateOK
  this._cacheDomElement(Table.CSS_CLASSES._TABLE_STATUS_MESSAGE_CLASS, statusMessage);

  return statusMessage;
};

/**
 * Display the visual indicator for column drag over
 * @param {number} columnIdx  column index
 * @param {boolean} before before the column
 * @private
 */
Table.prototype._displayDragOverIndicatorColumn = function (columnIdx, before) {
  this._removeDragOverIndicatorColumn();
  var tableHeaderRow = this._getTableHeaderRow();
  var tableHeaderColumn = this._getTableHeaderColumn(columnIdx);

  if (tableHeaderColumn != null) {
    if (before) {
      tableHeaderColumn.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS);
    } else {
      tableHeaderColumn.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS);
    }
  } else {
    var columns = this._getColumnDefs();
    if (columns == null || columns.length === 0) {
      if (before) {
        tableHeaderRow.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS);
      } else {
        tableHeaderRow.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS);
      }
    }
  }
};

/**
 * Display the visual indicator for row drag over
 * @param {number} rowIdx  row index
 * @param {boolean} before before the row
 * @param {Element} modelRow tr DOM element
 * @private
 */
Table.prototype._displayDragOverIndicatorRow = function (rowIdx, before, modelRow) {
  this._removeDragOverIndicatorRow();
  var tableBodyRowDragIndicator = document.createElement(Table.DOM_ELEMENT._TR); // @HTMLUpdateOK
  if (before) {
    tableBodyRowDragIndicator.classList.add(
      Table.CSS_CLASSES._TABLE_DATA_ROW_DRAG_INDICATOR_BEFORE_CLASS);
  } else {
    tableBodyRowDragIndicator.classList.add(
      Table.CSS_CLASSES._TABLE_DATA_ROW_DRAG_INDICATOR_AFTER_CLASS);
  }
  if (modelRow) {
    $(tableBodyRowDragIndicator).height(parseInt($(modelRow).height(), 10));
  }

  var tableBodyDragIndicatorCell = document.createElement(Table.DOM_ELEMENT._TD); // @HTMLUpdateOK
  var columnCount = this._getColumnDefs().length;
  if (this._isDefaultSelectorEnabled()) {
    columnCount += 1;
  }
  tableBodyDragIndicatorCell.setAttribute(Table.DOM_ATTR._COLSPAN, columnCount); // @HTMLUpdateOK
  tableBodyRowDragIndicator.appendChild(tableBodyDragIndicatorCell); // @HTMLUpdateOK
  var tableBodyRow = this._getTableBodyRow(rowIdx);

  if (tableBodyRow != null) {
    if (before) {
      tableBodyRow.parentNode.insertBefore(tableBodyRowDragIndicator, tableBodyRow); // @HTMLUpdateOK
    } else {
      tableBodyRow.parentNode.insertBefore(tableBodyRowDragIndicator, tableBodyRow.nextSibling); // @HTMLUpdateOK
    }
  } else {
    var tableBodyRows = this._getTableBodyRows();
    if (tableBodyRows.length === 0) {
      this._hideNoDataMessage();
    }
    this._getTableBody().appendChild(tableBodyRowDragIndicator); // @HTMLUpdateOK
  }
};

/**
 * Get the context menu
 * @return  {Element} menu DOM element
 * @private
 */
Table.prototype._getContextMenuElement = function () {
  return this._menuContainer;
};

/**
 * @private
 */
Table.prototype._getContextMenuResizePopup = function () {
  var popupId = this._getTableId() + '_resize_popup';
  if (!this._isCachedDomElement(popupId)) {
    var popup = document.getElementById(popupId);
    this._cacheDomElement(popupId, popup);
  }

  return this._getCachedDomElement(popupId);
};

/**
 * Get the column index of the DOM element. e.g. pass in the table cell to
 * see which column it's in.
 * @param {Element} element  DOM element
 * @return {number|null} the column index
 * @private
 */
Table.prototype._getElementColumnIdx = function (element) {
  var tableBodyCell =
      this._getFirstAncestor(element, '.' + Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
  if (tableBodyCell != null) {
    return $(tableBodyCell.parentNode)
      .children('.' + Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS)
      .index(tableBodyCell);
  }

  var tableHeaderColumn =
      this._getFirstAncestor(element, '.' + Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS, true);
  if (tableHeaderColumn != null) {
    return $(tableHeaderColumn.parentNode)
      .children('.' + Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS)
      .index(tableHeaderColumn);
  }

  var tableFooterCell =
      this._getFirstAncestor(element, '.' + Table.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS, true);
  if (tableFooterCell != null) {
    return $(tableFooterCell.parentNode)
      .children('.' + Table.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS)
      .index(tableFooterCell);
  }
  return null;
};

/**
 * Get the row index of the DOM element. e.g. pass in the table cell to
 * see which row it's in.
 * @param {Element} element  DOM element
 * @return {number|null} the row index
 * @private
 */
Table.prototype._getElementRowIdx = function (element) {
  var tableBodyRow =
      this._getFirstAncestor(element, '.' + Table.CSS_CLASSES._TABLE_DATA_ROW_CLASS, true);

  if (tableBodyRow != null) {
    var tableBodyRows = this._getTableBodyRows();
    var idx = $(tableBodyRows).index(tableBodyRow);
    return idx > -1 ? idx : null;
  }
  return null;
};

/**
  * Find the first ancestor of an element given a selector
  * @param {Element} element the element to find the nearest class name to
  * @param {string} selector the selector
  * @param {boolean=} tableOwnedOnly whether return element has to be owned by this table. default false
  * @return {Element|null} the element that matches selector, if there is none returns null
  * @private
  */
Table.prototype._getFirstAncestor = function (element, selector, tableOwnedOnly) {
  var parents;

  if (element == null) {
    return null;
  }

  var elementMatches = (this._isIE() && !Element.prototype.matches)
    ? element.msMatchesSelector(selector)
    : element.matches(selector);

  if (elementMatches) {
    if (tableOwnedOnly) {
      if (!this._isTableOwned(element)) {
        return this._getFirstAncestor(element.parentNode, selector, tableOwnedOnly);
      }
    }
    return element;
  }

  parents = $(element).parents(selector);
  if (tableOwnedOnly) {
    for (var i = 0; i < parents.length; i++) {
      if (this._isTableOwned(parents[i])) {
        return parents[i];
      }
    }
    return null;
  }
  return parents.length > 0 ? parents[0] : null;
};

/**
 * Return the scrollbar height
 * @return {number} scrolbar height
 * @private
 */
Table.prototype._getScrollBarHeight = function () {
  return this._tableWidthConstrained ? this._getDefaultScrollBarSize() : 0;
};

/**
 * Return the scrollbar width
 * @return {number} scrolbar width
 * @private
 */
Table.prototype._getScrollBarWidth = function () {
  return (this._tableHeightConstrained && !this._isVerticalScrollBarHidden()) ?
          this._getDefaultScrollBarSize() : 0;
};

/**
 * Returns the default scrollbar size for the table when visible
 * @private
 */
Table.prototype._getDefaultScrollBarSize = function () {
  // cache browser scroll bar width for future sizing of table body element
  if (this._defaultScrollBarSize == null) {
    this._defaultScrollBarSize = DataCollectionUtils.getDefaultScrollBarWidth(this._getScroller());
  }
  return this._defaultScrollBarSize;
};

/**
 * Returns whether or not the vertical scrollbar should be hidden
 * @private
 */
Table.prototype._isVerticalScrollBarHidden = function () {
  return !this._isTouchDevice() &&
    this._getTableContainer().classList.contains(
      Table.MARKER_STYLE_CLASSES._HIDE_VERTICAL_SCROLLBAR);
};

/**
 * Return the table scroller
 * @return {Element} scrolbar
 * @private
 */
Table.prototype._getScroller = function () {
  return this._getTableBody();
};

/**
 * Get the element scrollLeft
 * @param {Element} element DOM element
 * @private
 */
Table.prototype._getScrollLeft = function (element) {
  var scrollLeft = element.scrollLeft;

  if (this._GetReadingDirection() === 'rtl') {
    scrollLeft = Math.abs(scrollLeft);

    if (this._isWebkit()) {
      var maxScrollLeft = element.scrollWidth - element.clientWidth;
      scrollLeft = maxScrollLeft - scrollLeft;
    }
  }
  return scrollLeft;
};

/**
 * Return the table element
 * @return {Element} table DOM element
 * @private
 */
Table.prototype._getTable = function () {
  return this.element[0];
};

/**
 * Return the table body element
 * @return {Element|null} tbody DOM element
 * @private
 */
Table.prototype._getTableBody = function () {
  return this._getTableElementByClassName(Table.CSS_CLASSES._TABLE_BODY_CLASS, true);
};

/**
 * Return the cell element
 * @param {number} rowIdx  row index
 * @param {number} columnIdx  column index
 * @param {Element|null} tableBodyRow  tr DOM element
 * @return {Element|null} td DOM element
 * @private
 */
Table.prototype._getTableBodyCell = function (rowIdx, columnIdx, tableBodyRow) {
  var tableBodyCells = this._getTableBodyCells(rowIdx, tableBodyRow);
  if (!tableBodyCells) {
    return null;
  }

  if (tableBodyCells.length > columnIdx) {
    return tableBodyCells[columnIdx];
  }

  return null;
};

/**
 * Return all the logical cell elements in a row
 * @param {number} rowIdx  row index
 * @param {Element|null} tableBodyRow  tr DOM element
 * @return {Array|null} array of td DOM elements
 * @private
 */
Table.prototype._getTableBodyLogicalCells = function (rowIdx, tableBodyRow) {
  var tableBodyCells = this._getTableBodyCells(rowIdx, tableBodyRow);
  if (!tableBodyCells) {
    return null;
  }

  return this._getColspanLogicalElements(tableBodyCells);
};

/**
 * Return all the cell elements in a row
 * @param {number|null} rowIdx  row index
 * @param {Element|null} tableBodyRow  tr DOM element
 * @return {Array|null} array of td DOM elements
 * @private
 */
Table.prototype._getTableBodyCells = function (rowIdx, tableBodyRow) {
  if (!tableBodyRow) {
    // eslint-disable-next-line no-param-reassign
    tableBodyRow = this._getTableBodyRow(rowIdx);
  }

  if (!tableBodyRow) {
    return null;
  }

  var tableBodyCellElements = this._getTableElementsByClassName(tableBodyRow,
    Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS);

  if (tableBodyCellElements.length > 0) {
    return tableBodyCellElements;
  }

  return null;
};

/**
 * Return the table body message cell element
 * @return {Element|null} tr DOM element
 * @private
 */
Table.prototype._getTableBodyMessageCell = function () {
  var tableBody = this._getTableBody();
  if (tableBody) {
    var messageCell = this._getTableElementsByClassName(tableBody,
      Table.CSS_CLASSES._TABLE_BODY_MESSAGE_CLASS);
    if (messageCell.length > 0) {
      return messageCell[0];
    }
  }
  return null;
};

/**
 * Return the table body message row element
 * @return {Element|null} tr DOM element
 * @private
 */
Table.prototype._getTableBodyMessageRow = function () {
  var tableBody = this._getTableBody();
  if (tableBody) {
    var messageRow = this._getTableElementsByClassName(tableBody,
      Table.CSS_CLASSES._TABLE_BODY_MESSAGE_ROW_CLASS);
    if (messageRow.length > 0) {
      return messageRow[0];
    }
  }
  return null;
};

/**
 * Return table row
 * @param {number|null} rowIdx  row index
 * @return {Element|null} tr DOM element
 * @private
 */
Table.prototype._getTableBodyRow = function (rowIdx) {
  var tableBodyRows = this._getTableBodyRows();
  if (rowIdx != null && tableBodyRows.length > rowIdx) {
    return tableBodyRows[rowIdx];
  }
  return null;
};

/**
 * Return all the table rows
 * @return {Array|null} array of tr DOM elements
 * @private
 */
Table.prototype._getTableBodyRows = function () {
  if (!this._cachedDomTableBodyRows) {
    var tableBody = this._getTableBody();
    if (tableBody != null) {
      this._cachedDomTableBodyRows = this._getTableElementsByClassName(tableBody,
        Table.CSS_CLASSES._TABLE_DATA_ROW_CLASS);
    } else {
      this._cachedDomTableBodyRows = [];
    }
  }
  return this._cachedDomTableBodyRows;
};

/**
 * Get top touch affordance to the table row.
 * @return {Element|null} div DOM element
 * @private
 */
Table.prototype._getTableBodyRowTouchSelectionAffordanceTop = function () {
  var tableContainer = this._getTableContainer();
  var topAffordance = this._getTableElementsByClassName(tableContainer,
    Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_CLASS);
  if (topAffordance.length > 0) {
    return topAffordance[0];
  }
  return null;
};

/**
 * Get bottom touch affordance to the table row.
 * @return {Element|null} div DOM element
 * @private
 */
Table.prototype._getTableBodyRowTouchSelectionAffordanceBottom = function () {
  var tableContainer = this._getTableContainer();
  var bottomAffordance = this._getTableElementsByClassName(tableContainer,
    Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_CLASS);
  if (bottomAffordance.length > 0) {
    return bottomAffordance[0];
  }
  return null;
};

/**
 * Return the bottom slot element
 * @return {Element|null} div DOM element
 * @private
 */
Table.prototype._getTableBottomSlot = function () {
  return this._getTableElementByClassName(Table.CSS_CLASSES._TABLE_BOTTOM_SLOT_CLASS, true);
};

/**
 * Return the table container
 * @return {Element|null} div DOM element
 * @private
 */
Table.prototype._getTableContainer = function () {
  if (!this._isCachedDomElement(Table.CSS_CLASSES._TABLE_CONTAINER_CLASS)) {
    this._cacheDomElement(Table.CSS_CLASSES._TABLE_CONTAINER_CLASS, this.element[0].parentNode);
  }
  return this._getCachedDomElement(Table.CSS_CLASSES._TABLE_CONTAINER_CLASS);
};

/**
 * Return the table footer
 * @return {Element|null} tfoot DOM element
 * @private
 */
Table.prototype._getTableFooter = function () {
  return this._getTableElementByClassName(Table.CSS_CLASSES._TABLE_FOOTER_CLASS, true);
};

/**
 * Return the footer cell element
 * @param {number} columnIdx  column index
 * @return {Element|null} td DOM element
 * @private
 */
Table.prototype._getTableFooterCell = function (columnIdx) {
  var tableFooterCells = this._getTableFooterCells();
  if (tableFooterCells != null && tableFooterCells.length > columnIdx) {
    return tableFooterCells[columnIdx];
  }
  return null;
};

/**
 * Return all footer cells
 * @return {Array|null} array of td DOM elements
 * @private
 */
Table.prototype._getTableFooterCells = function () {
  var tableFooterRow = this._getTableFooterRow();
  var tableFooterCells = tableFooterRow != null ? this._getTableElementsByClassName(tableFooterRow,
    Table.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS) : null;
  if (tableFooterCells != null && tableFooterCells.length > 0) {
    return tableFooterCells;
  }
  return null;
};

/**
 * Return all logical footer cells
 * @return {Array|null} array of td DOM elements
 * @private
 */
Table.prototype._getTableFooterLogicalCells = function () {
  var tableFooterCells = this._getTableFooterCells();
  if (!tableFooterCells) {
    return null;
  }
  return this._getColspanLogicalElements(tableFooterCells);
};

/**
 * Return table footer row
 * @return {Element|null} tr DOM element
 * @private
 */
Table.prototype._getTableFooterRow = function () {
  return this._getTableElementByClassName(Table.CSS_CLASSES._TABLE_FOOTER_ROW_CLASS);
};

/**
 * Return the table header
 * @return {Element|null} thead DOM element
 * @private
 */
Table.prototype._getTableHeader = function () {
  return this._getTableElementByClassName(Table.CSS_CLASSES._TABLE_HEADER_CLASS, true);
};

/**
 * Return table column header
 * @param {number} columnIdx  column index
 * @return {Element|null} th DOM element
 * @private
 */
Table.prototype._getTableHeaderColumn = function (columnIdx) {
  var headerColumns = this._getTableHeaderColumns();
  if (headerColumns && headerColumns.length > columnIdx && columnIdx >= 0) {
    return headerColumns[columnIdx];
  }
  return null;
};

/**
 * Return resize indicator
 * @return {Element} div DOM element
 * @private
 */
Table.prototype._getTableHeaderColumnResizeIndicator = function () {
  return this._getTableElementByClassName(
    Table.CSS_CLASSES._COLUMN_HEADER_RESIZE_INDICATOR_CLASS, true);
};

/**
 * Return all table column headers
 * @return {Array|null} array of th DOM elements
 * @private
 */
Table.prototype._getTableHeaderColumns = function () {
  var tableHeaderRow = this._getTableHeaderRow();
  if (tableHeaderRow != null) {
    var headerColumnElements = this._getTableElementsByClassName(tableHeaderRow,
      Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS);
    if (headerColumnElements.length > 0) {
      return headerColumnElements;
    }
  }
  return null;
};

/**
 * Return all logical table column headers
 * @return {Array|null} array of th DOM elements
 * @private
 */
Table.prototype._getTableHeaderLogicalColumns = function () {
  var tableHeaderColumns = this._getTableHeaderColumns();
  if (!tableHeaderColumns) {
    return null;
  }
  return this._getColspanLogicalElements(tableHeaderColumns);
};

/**
 * Return table header row
 * @return {Element|null} th DOM element
 * @private
 */
Table.prototype._getTableHeaderRow = function () {
  return this._getTableElementByClassName(Table.CSS_CLASSES._TABLE_HEADER_ROW_CLASS);
};

/**
 * Return the table DOM element id.
 * @return {string} Id for table
 * @private
 */
Table.prototype._getTableId = function () {
  if (!this._tableId) {
    // Id for custom element is on the container
    var idElem = this._IsCustomElement() ? this._getTableContainer() : this._getTable();
    this._tableId = idElem.getAttribute(Table.DOM_ATTR._ID);
  }
  return this._tableId;
};

/**
 * Return the table status message element
 * @return {Element|null} div DOM element
 * @private
 */
Table.prototype._getTableStatusMessage = function () {
  return this._getTableElementByClassName(Table.CSS_CLASSES._TABLE_STATUS_MESSAGE_CLASS, true);
};

/**
 * Return the unique identifier for the table. If the DOM element has an id then
 * return that. If not, generate a random UID.
 * @return {string} UID for table
 * @private
 */
Table.prototype._getTableUID = function () {
  if (!this._tableUID) {
    var uid = this._getTableId();
    if (uid == null) {
      uid = (Math.random() * 1e32).toString(36); // @RandomNumberOK -
      // used to generate a unique id. Should not be a security issue.
    }
    this._tableUID = uid;
  }
  return this._tableUID;
};

/**
 * Get a hash code for a string
 * @param {string} str String
 * @return {number} hashCode
 * @private
 */
Table.prototype._hashCode = function (str) {
  // null should never be passed in, but adding this check for a fallback
  if (str == null) {
    return 0;
  } else if ($.type(str) !== 'string') {
    // eslint-disable-next-line no-param-reassign
    str = str.toString();
  }
  // Same hash algorithm as Java's String.hashCode
  var hash = 0;
  if (str.length === 0) {
    return hash;
  }

  var strCount = str.length;
  for (var i = 0; i < strCount; i++) {
    var charVal = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = ((hash << 5) - hash) + charVal;
    // eslint-disable-next-line no-bitwise
    hash &= hash;
  }
  return hash;
};

/**
 * Insert a td element in the appropriate place in the DOM
 * @param {number} rowIdx  row index
 * @param {Object} rowKey  row key
 * @param {Object} rowHashCode  row hash code
 * @param {number} columnIdx  column index
 * @param {Element} tableBodyCell  DOM element
 * @param {Element} tableBodyRow  tr DOM element
 * @param {boolean} isNew is new row
 * @return {Element|null} td DOM element
 * @private
 */
Table.prototype._insertTableBodyCell = function (rowIdx, rowKey, rowHashCode, columnIdx,
  tableBodyCell, tableBodyRow, isNew) {
  this._setTableBodyCellAttributes(rowIdx, rowKey, rowHashCode, columnIdx, tableBodyCell);

  if (isNew) {
    // if it's a new row then the cells are appended in order
    // so don't bother trying to find the position to insert to
    tableBodyRow.appendChild(tableBodyCell); // @HTMLUpdateOK
    return tableBodyCell;
  }

  if (columnIdx === 0) {
    // just prepend it
    tableBodyRow.insertBefore(tableBodyCell, tableBodyRow.firstChild); // @HTMLUpdateOK
  } else {
    var tableBodyCells = this._getTableElementsByClassName(tableBodyRow,
      Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS);

    if (tableBodyCells.length >= columnIdx) {
      var previousCell = tableBodyCells[columnIdx - 1];
      previousCell.parentNode.insertBefore(tableBodyCell, previousCell.nextSibling); // @HTMLUpdateOK
    } else {
      tableBodyRow.appendChild(tableBodyCell); // @HTMLUpdateOK
    }
  }
  return tableBodyCell;
};

/**
 * Insert a tr element in the appropriate place in the DOM
 * @param {number} rowIdx  row index
 * @param {Element} tableBodyRow  DOM element
 * @param {Object} row  row and key object
 * @param {Element} docFrag  document fragment
 * @private
 */
Table.prototype._insertTableBodyRow = function (rowIdx, tableBodyRow, row, docFrag) {
  this._setTableBodyRowAttributes(row, tableBodyRow);

  if (docFrag == null) {
    var tableBody = this._getTableBody();
    var tableBodyRows = this._getTableBodyRows();

    if (rowIdx === 0) {
      tableBody.insertBefore(tableBodyRow, tableBody.firstChild); // @HTMLUpdateOK
    } else if (tableBodyRows.length >= rowIdx) {
      var previousRow = tableBodyRows[rowIdx - 1];
      previousRow.parentNode.insertBefore(tableBodyRow, previousRow.nextSibling); // @HTMLUpdateOK
    } else {
      tableBody.appendChild(tableBodyRow); // @HTMLUpdateOK
    }
  } else {
    docFrag.appendChild(tableBodyRow); // @HTMLUpdateOK
  }
  this._clearCachedDomRowData();
};

/**
 * Insert a td element in the appropriate place in the DOM
 * @param {number} columnIdx  column index
 * @param {Element} tableFooterCell  DOM element
 * @private
 */
Table.prototype._insertTableFooterCell = function (columnIdx, tableFooterCell) {
  var tableFooterRow = this._getTableFooterRow();
  var tableFooterCells = this._getTableElementsByClassName(tableFooterRow,
    Table.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS);

  if (columnIdx === 0) {
    // just prepend it
    tableFooterRow.insertBefore(tableFooterCell, tableFooterRow.firstChild); // @HTMLUpdateOK
  } else if (tableFooterRow.length >= columnIdx) {
    var previousCell = tableFooterCells[columnIdx - 1];
    previousCell.parentNode.insertBefore(tableFooterCell, previousCell.nextSibling); // @HTMLUpdateOK
  } else {
    tableFooterRow.appendChild(tableFooterCell); // @HTMLUpdateOK
  }
  return tableFooterCell;
};

/**
 * Insert a th element in the appropriate place in the DOM
 * @param {number} columnIdx  column index
 * @param {Element} tableHeaderColumn  DOM element
 * @private
 */
Table.prototype._insertTableHeaderColumn = function (columnIdx, tableHeaderColumn) {
  var tableHeaderRow = this._getTableHeaderRow();
  var tableHeaderColumns = this._getTableHeaderColumns();
  // save the column index on the element
  this._setTableHeaderColumnAttributes(columnIdx, tableHeaderColumn);

  // if there is an existing th at the index then replace it
  var oldTableHeaderColumn = this._getTableHeaderColumn(columnIdx);
  if (oldTableHeaderColumn) {
    $(oldTableHeaderColumn).replaceWith($(tableHeaderColumn)); // @HTMLUpdateOK
  } else if (columnIdx !== 0 &&
    tableHeaderColumns && tableHeaderColumns.length >= columnIdx) {
    var previousColumn = tableHeaderColumns[columnIdx - 1];
    previousColumn.parentNode.insertBefore(tableHeaderColumn, previousColumn.nextSibling); // @HTMLUpdateOK
  } else {
    tableHeaderRow.appendChild(tableHeaderColumn); // @HTMLUpdateOK
  }
};

/**
 * Returns an array describing the table container's scrollable state.
 * Index 0 describes the vertical state, while index 1 describeds the horizontal state.
 * Overflow is a 1, underflow is a -1, and properly filled is a 0.
 * @param {number} bottomSlotHeight the height of the Table's bottom slot
 * @return {Array} First element is height boolean, followed by width boolean.
 * @private
 */
Table.prototype._getTableContainerScrollableState = function (bottomSlotHeight) {
  var tableContainer = this._getTableContainer();
  var table = this._getTable();

  var result = [];
  if (tableContainer.clientHeight > 0) {
    var innerHeight = table.offsetHeight + bottomSlotHeight;
    // don't use tableContainer[0].scrollHeight as it may not be accurate
    if (innerHeight > tableContainer.clientHeight) {
      // overflow
      result[0] = 1;
    } else if (tableContainer.clientHeight - innerHeight > 0) {
      // underflow
      result[0] = -1;
    } else {
      result[0] = 0;
    }
  } else {
    result[0] = 0;
  }

  if (tableContainer.clientWidth > 0) {
    if (table.offsetWidth > tableContainer.clientWidth) {
      // overflow
      result[1] = 1;
    } else if (tableContainer.clientWidth - table.offsetWidth > 0) {
      // underflow
      result[1] = -1;
    } else {
      result[1] = 0;
    }
  } else {
    result[1] = 0;
  }
  return result;
};

/**
 * Move the top touch affordance to the table row.
 * @param {number=} rowIdx  row index
 * @private
 */
Table.prototype._moveTableBodyRowTouchSelectionAffordanceTop = function (rowIdx) {
  var topAffordance = this._getTableBodyRowTouchSelectionAffordanceTop();
  if (topAffordance != null) {
    if (rowIdx != null) {
      $(topAffordance).data('rowIdx', rowIdx);
      $(topAffordance.children[0]).data('rowIdx', rowIdx);
    } else {
      // eslint-disable-next-line no-param-reassign
      rowIdx = $(topAffordance).data('rowIdx');
    }
    var tableBody = this._getTableBody();
    var tableBodyRow = this._getTableBodyRow(rowIdx);
    var tableBodyRowRect = tableBodyRow.getBoundingClientRect();
    var touchAffordanceGlassPane = this._getTouchAffordanceGlassPane();
    var touchAffordanceGlassPaneRect = touchAffordanceGlassPane.getBoundingClientRect();
    topAffordance.style[Table.CSS_PROP._TOP] = (tableBodyRowRect.top -
      touchAffordanceGlassPaneRect.top - (topAffordance.clientHeight / 2)) + Table.CSS_VAL._PX;
    topAffordance.style[Table.CSS_PROP._LEFT] = (tableBody.clientWidth / 2) + Table.CSS_VAL._PX;
  }
};

/**
 * Move the bottom touch affordance to the table row.
 * @param {number=} rowIdx  row index
 * @private
 */
Table.prototype._moveTableBodyRowTouchSelectionAffordanceBottom = function (rowIdx) {
  var bottomAffordance = this._getTableBodyRowTouchSelectionAffordanceBottom();
  if (bottomAffordance != null) {
    if (rowIdx != null) {
      $(bottomAffordance).data('rowIdx', rowIdx);
      $(bottomAffordance.children[0]).data('rowIdx', rowIdx);
    } else {
      // eslint-disable-next-line no-param-reassign
      rowIdx = $(bottomAffordance).data('rowIdx');
    }
    var tableBody = this._getTableBody();
    var tableBodyRow = this._getTableBodyRow(rowIdx);
    var tableBodyRowRect = tableBodyRow.getBoundingClientRect();
    var touchAffordanceGlassPane = this._getTouchAffordanceGlassPane();
    var touchAffordanceGlassPaneRect = touchAffordanceGlassPane.getBoundingClientRect();
    bottomAffordance.style[Table.CSS_PROP._TOP] =
      (((tableBodyRowRect.top - touchAffordanceGlassPaneRect.top) + tableBodyRowRect.height) -
       (bottomAffordance.clientHeight / 2)) + Table.CSS_VAL._PX;
    bottomAffordance.style[Table.CSS_PROP._LEFT] = (tableBody.clientWidth / 2) + Table.CSS_VAL._PX;
  }
};

/**
 * Move the column to the destination index. If there is already a column at destIdx,
 * then insert before it.
 * @param {number} columnIdx  column index
 * @param {number} destIdx column index
 * @param {Object} event
 * @return {Array} Array of moved columns map
 * @private
 */
Table.prototype._moveTableHeaderColumn = function (columnIdx, destIdx, event) {
  var columns = this._getColumnDefs();

  var tableHeaderColumn = this._getTableHeaderColumn(columnIdx);
  var tableFooterCell = this._getTableFooterCell(columnIdx);
  var tableBodyCell = null;
  var destTableHeaderColumn = null;
  var destTableFooterCell = null;
  var destTableBodyCell = null;
  var colSpan = null;
  var afterColumn = false;

  if (destIdx === columns.length) {
    // eslint-disable-next-line no-param-reassign
    destIdx -= 1;
    afterColumn = true;
  }
  if (tableHeaderColumn != null) {
    colSpan = tableHeaderColumn.getAttribute(Table.DOM_ATTR._COLSPAN);
    destTableHeaderColumn = this._getTableHeaderColumn(destIdx);
    if (destTableHeaderColumn != null && (colSpan == null || colSpan === 1)) {
      if (afterColumn) {
        destTableHeaderColumn.parentNode.insertBefore(tableHeaderColumn, // @HTMLUpdateOK
                                                      destTableHeaderColumn.nextSibling);
      } else {
        destTableHeaderColumn.parentNode.insertBefore(tableHeaderColumn, // @HTMLUpdateOK
                                                      destTableHeaderColumn);
      }
    }
  }
  if (tableFooterCell != null) {
    colSpan = tableFooterCell.getAttribute(Table.DOM_ATTR._COLSPAN);
    destTableFooterCell = this._getTableFooterCell(destIdx);
    if (destTableFooterCell != null && (colSpan == null || colSpan === 1)) {
      if (afterColumn) {
        destTableFooterCell.parentNode.insertBefore(tableFooterCell, // @HTMLUpdateOK
                                                    destTableFooterCell.nextSibling);
      } else {
        destTableFooterCell.parentNode.insertBefore(tableFooterCell, destTableFooterCell); // @HTMLUpdateOK
      }
    }
  }

  var i;
  var tableBodyRows = this._getTableBodyRows();
  for (i = 0; i < tableBodyRows.length; i++) {
    tableBodyCell = this._getTableBodyCell(i, columnIdx, null);

    if (tableBodyCell != null) {
      destTableBodyCell = this._getTableBodyCell(i, destIdx, null);
      colSpan = tableBodyCell.getAttribute(Table.DOM_ATTR._COLSPAN);

      if (destTableBodyCell != null &&
          (colSpan == null || colSpan === 1)) {
        if (afterColumn) {
          destTableBodyCell.parentNode.insertBefore(tableBodyCell, destTableBodyCell.nextSibling); // @HTMLUpdateOK
        } else {
          destTableBodyCell.parentNode.insertBefore(tableBodyCell, destTableBodyCell); // @HTMLUpdateOK
        }
      }
    }
  }

  // update options
  var clonedColumnsOption = [];
  var columnsCount = this.options.columns.length;
  for (i = 0; i < columnsCount; i++) {
    clonedColumnsOption[i] = $.extend({}, {}, this.options.columns[i]);
  }
  var destColIdx = columnIdx < destIdx && !afterColumn ? destIdx - 1 : destIdx;
  var columnOption = clonedColumnsOption.splice(columnIdx, 1);
  clonedColumnsOption.splice(destColIdx, 0, columnOption[0]);
  // re-order the column definition metadata
  var columnDef = this._columnDefArray.splice(columnIdx, 1);
  this._columnDefArray.splice(destColIdx, 0, columnDef[0]);
  if (!this._columnsDestMap) {
    this._columnsDestMap = [];
    for (i = 0; i < clonedColumnsOption.length; i++) {
      this._columnsDestMap[i] = i;
    }
  }
  var columnsDestMapItem = this._columnsDestMap.splice(columnIdx, 1);
  this._columnsDestMap.splice(destColIdx, 0, columnsDestMapItem[0]);

  // clone the array so we can trigger that it's changed
  this.option('columns', clonedColumnsOption, {
    _context: {
      writeback: true,
      originalEvent: event,
      internalSet: true
    }
  });
  this._queueTask(function () {});

  return this._columnsDestMap;
};

/**
 * Refresh any translated strings in the context menu.
 * @private
 */
Table.prototype._refreshContextMenu = function () {
  var menuContainer = this._menuContainer;
  if (menuContainer) {
    var listItems = menuContainer.querySelectorAll('[data-oj-command]');
    for (var i = 0; i < listItems.length; i++) {
      var contextMenuLabel = $(listItems[i]).children(Table.DOM_ELEMENT._A);
      if (contextMenuLabel.length === 0 && listItems[i].tagName === 'OJ-OPTION') {
        contextMenuLabel = $(listItems[i]);
      }
      if (contextMenuLabel.length > 0) {
        var command = listItems[i].getAttribute('data-oj-command').split('-');
        command = command[command.length - 1];

        var commandString;
        if (command === 'sort') {
          commandString = this.getTranslatedString('labelSort');
        } else if (command === 'sortAsc') {
          commandString = this.getTranslatedString('labelSortAsc');
        } else if (command === 'sortDsc') {
          commandString = this.getTranslatedString('labelSortDsc');
        } else if (command === 'resize') {
          commandString = this.getTranslatedString('labelResize');
        }
        contextMenuLabel.contents().filter(function () {
          return this.nodeType === 3;
        })[0].nodeValue = commandString;
      }
    }
  }
};

/**
 * Remove the visual indicator for column drag over
 * @private
 */
Table.prototype._removeDragOverIndicatorColumn = function () {
  var indicatorElements = this._tableQuerySelectorAll(this._getTable(),
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS + ',' +
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS);

  var indicatorElementsCount = indicatorElements.length;

  for (var i = 0; i < indicatorElementsCount; i++) {
    indicatorElements[i].classList.remove(
      Table.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS);
    indicatorElements[i].classList.remove(
      Table.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS);
  }
};

/**
 * Remove the visual indicator for row drag over
 * @private
 */
Table.prototype._removeDragOverIndicatorRow = function () {
  var tableBody = this._getTableBody();
  var indicatorRowBeforeElements = this._getTableElementsByClassName(tableBody,
    Table.CSS_CLASSES._TABLE_DATA_ROW_DRAG_INDICATOR_BEFORE_CLASS);
  var indicatorRowAfterElements = this._getTableElementsByClassName(tableBody,
    Table.CSS_CLASSES._TABLE_DATA_ROW_DRAG_INDICATOR_AFTER_CLASS);

  var i;
  var indicatorRowBeforeElementsCount = indicatorRowBeforeElements.length;
  for (i = 0; i < indicatorRowBeforeElementsCount; i++) {
    $(indicatorRowBeforeElements[i]).remove();
  }

  var indicatorRowAfterElementsCount = indicatorRowAfterElements.length;
  for (i = 0; i < indicatorRowAfterElementsCount; i++) {
    $(indicatorRowAfterElements[i]).remove();
  }

  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length === 0) {
    this._showNoDataMessage();
  }
};

/**
 * Remove a tr element from the tbody DOM
 * @param {number} rowIdx  row index
 * @private
 */
Table.prototype._removeTableBodyRow = function (rowIdx) {
  var tableBodyRow = this._getTableBodyRow(rowIdx);
  if (tableBodyRow != null) {
    Components.subtreeDetached(tableBodyRow);

    if (this._hasCellTemplate || this._hasRowTemplate) {
      this._cleanTemplateNodes(tableBodyRow);
      // No need to set this._hasCellTemplate to false here since only one row is removed
    }
    $(tableBodyRow).remove();
    this._clearCachedDomRowData();
  }
};

/**
 * Remove all tr elements from the tbody DOM
 * @private
 */
Table.prototype._removeAllTableBodyRows = function () {
  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length > 0) {
    var tableBody = this._getTableBody();
    if (tableBody != null) {
      Components.subtreeDetached(tableBody);

      if (this._hasCellTemplate || this._hasRowTemplate) {
        this._cleanTemplateNodes(tableBody);
        this._hasCellTemplate = false;
        this._hasRowTemplate = false;

        // need to re-register DOM event listeners after cleaning the node
        this._registerDomEventListeners();
      }
      $(tableBody).empty();
    }
    this._clearCachedDomRowData();
  }
};

/**
 * Finds and removes the touch selection icons from the DOM
 * @private
 */
Table.prototype._removeTableBodyRowTouchSelectionAffordance = function () {
  var tableContainer = this._getTableContainer();
  var touchAffordance = this._getTableElementsByClassName(tableContainer,
    Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOUCH_AREA_CLASS);

  for (var i = 0; i < touchAffordance.length; i++) {
    $(touchAffordance[i]).remove();
  }
};

/**
 * Remove the drag image for the column
 * @private
 */
Table.prototype._removeTableHeaderColumnDragImage = function () {
  var tableContainer = this._getTableContainer();
  var headerDragImage = this._getTableElementsByClassName(tableContainer,
    Table.CSS_CLASSES._COLUMN_HEADER_DRAG_IMAGE);

  var headerDragImageCount = headerDragImage.length;
  for (var i = 0; i < headerDragImageCount; i++) {
    $(headerDragImage[i]).remove();
  }
};

/**
 * Remove resize indicator
 * @private
 */
Table.prototype._removeTableHeaderColumnResizeIndicator = function () {
  var tableHeaderColumnResizeIndicator = this._getTableHeaderColumnResizeIndicator();
  if (tableHeaderColumnResizeIndicator) {
    $(tableHeaderColumnResizeIndicator).remove();
    this._clearDomCache(Table.CSS_CLASSES._COLUMN_HEADER_RESIZE_INDICATOR_CLASS);
  }
};

/**
 * Set the element scrollLeft
 * @param {Element} element DOM element
 * @param {number} scrollLeft scrollLeft
 * @private
 */
Table.prototype._setScrollLeft = function (element, scrollLeft) {
  if (this._GetReadingDirection() === 'rtl') {
    // eslint-disable-next-line no-param-reassign
    scrollLeft = Math.abs(scrollLeft);
    if (this._isWebkit()) {
      var maxScrollLeft = element.scrollWidth - element.clientWidth;
      // eslint-disable-next-line no-param-reassign
      scrollLeft = maxScrollLeft - scrollLeft;
    } else if (this._isFF()) {
      // eslint-disable-next-line no-param-reassign
      scrollLeft *= -1;
    }
  }
  if (element.scrollLeft !== scrollLeft) {
    // eslint-disable-next-line no-param-reassign
    element.scrollLeft = scrollLeft;
  }
};

/**
 * Set the attributes on the cell
 * @param {number} rowIdx  row index
 * @param {Object} rowKey  row key
 * @param {Object} rowHashCode  row hash code
 * @param {number} columnIdx  column index
 * @param {Element} tableBodyCell  td DOM element
 * @private
 */
Table.prototype._setTableBodyCellAttributes = function (rowIdx, rowKey, rowHashCode,
  columnIdx, tableBodyCell) {
  // if cell already has an id then bail
  var cellId = tableBodyCell.getAttribute(Table.DOM_ATTR._ID);

  if (cellId != null && cellId.length > 0) {
    return;
  }

  var accessibility = this.options.accessibility;
  var column = this._getColumnDefs()[columnIdx];
  if (column == null) {
    return;
  }

  var rowHeaderColumnId = null;
  var isTableHeaderless = this._isTableHeaderless();

  if (accessibility != null && accessibility.rowHeader != null) {
    rowHeaderColumnId = accessibility.rowHeader;
  } else {
    rowHeaderColumnId = this._getColumnDefs()[0].id;
  }

  var rowKeyStr = rowKey != null ? rowKey.toString() : rowIdx.toString();
  var rowKeyStrHashCode = rowHashCode == null ? this._hashCode(rowKeyStr) : rowHashCode;
  var cellRowHeaderId = this._getTableId() + ':' + rowHeaderColumnId + '_' + rowKeyStrHashCode;

  var headers = this._getTableId() + ':' + column.id;
  if (rowHeaderColumnId === column.id) {
    cellId = cellRowHeaderId;

    if (isTableHeaderless) {
      headers = '';
    }
  } else {
    cellId = cellRowHeaderId + '_' + columnIdx;

    if (!isTableHeaderless) {
      headers = headers + ' ' + cellRowHeaderId;
    } else {
      headers = cellRowHeaderId;
    }
  }
  tableBodyCell.setAttribute(Table.DOM_ATTR._ID, cellId); // @HTMLUpdateOK

  if (!tableBodyCell.getAttribute(Table.DOM_ATTR._HEADERS)) {
    tableBodyCell.setAttribute(Table.DOM_ATTR._HEADERS, headers); // @HTMLUpdateOK
  }
};

/**
 * Set the attributes on the row like rowIdx, etc
 * @param {Object} row row
 * @param {Element} tableBodyRow  tr DOM element
 * @private
 */
Table.prototype._setTableBodyRowAttributes = function (row, tableBodyRow) {
  $(tableBodyRow).data('rowKey', row.key);
  $(tableBodyRow).data('rowData', row.data);
  $(tableBodyRow).data('rowMetadata', row.metadata);
};

/**
 * Set the attributes on the header like columndx, etc
 * @param {number} columnIdx  column index
 * @param {Element} tableHeaderColumn  th DOM element
 * @private
 */
Table.prototype._setTableHeaderColumnAttributes = function (columnIdx, tableHeaderColumn) {
  var column = this._getColumnDefs()[columnIdx];

  if (!tableHeaderColumn.getAttribute(Table.DOM_ATTR._ID)) {
    tableHeaderColumn.setAttribute(Table.DOM_ATTR._ID, this._getTableId() + ':' + column.id); // @HTMLUpdateOK
  }
};

/**
 * Set the css class from all the cells in a column with the styleClass
 * @param {number|null} columnIdx  column index
 * @param {boolean} add add or remove the class
 * @param {string} styleClass style class
 * @private
 */
Table.prototype._setTableColumnCellsClass = function (columnIdx, add, styleClass) {
  var i;
  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length > 0) {
    if (columnIdx === null) {
      var tableBodyCells = null;
      var tableBody = this._getTableBody();
      if (!add) {
        tableBodyCells = this._getTableElementsByClassName(tableBody, styleClass);
      } else {
        tableBodyCells = this._getTableElementsByTagName(tableBody, Table.DOM_ELEMENT._TD);
      }

      if (tableBodyCells != null && tableBodyCells.length > 0) {
        var tableBodyCellsCount = tableBodyCells.length;
        for (i = 0; i < tableBodyCellsCount; i++) {
          if (!add) {
            tableBodyCells[i].classList.remove(styleClass);
          } else {
            tableBodyCells[i].classList.add(styleClass);
          }
        }
      }
    } else {
      var tableBodyRowsCount = tableBodyRows.length;
      for (i = 0; i < tableBodyRowsCount; i++) {
        var tableBodyCell = this._getTableBodyCell(i, columnIdx, null);
        if (!add) {
          tableBodyCell.classList.remove(styleClass);
        } else {
          tableBodyCell.classList.add(styleClass);
        }
      }
    }
  }
};

/**
 * Set the table body message.
 * @param {string} message
 * @private
 */
Table.prototype._setTableBodyMessage = function (message) {
  var tableBodyMessageCell = this._getTableBodyMessageCell();
  $(tableBodyMessageCell).empty();
  tableBodyMessageCell.appendChild(document.createTextNode(message)); // @HTMLUpdateOK
};

/**
 * Style the initial table
 * @private
 */
Table.prototype._styleInitialTable = function () {
  var table = this._getTable();
  var tableHeader = this._getTableElementsByTagName(table, Table.DOM_ELEMENT._THEAD);
  tableHeader = tableHeader.length > 0 ? tableHeader[0] : null;
  var tableFooter = this._getTableElementsByTagName(table, Table.DOM_ELEMENT._TFOOT);
  tableFooter = tableFooter.length > 0 ? tableFooter[0] : null;
  var tableBody = this._getTableElementsByTagName(table, Table.DOM_ELEMENT._TBODY);
  tableBody = tableBody.length > 0 ? tableBody[0] : null;

  // set the tabindex
  var tabIndex = parseInt(this._getRootElement()
    .getAttribute(Table.DOM_ATTR._TABINDEX), 10);
  if (tabIndex !== -1) {
    table.setAttribute(Table.DOM_ATTR._TABINDEX, '0'); // @HTMLUpdateOK
    // set focusable
    this._focusable({
      element: table,
      applyHighlight: true,
      setupHandlers: this._focusSetupHandlers.bind(this)
    });
  } else {
    table.setAttribute(Table.DOM_ATTR._TABINDEX, '-1'); // @HTMLUpdateOK
    var noop = function () {};
    this._focusSetupHandlers(noop, noop);
  }
  table.setAttribute(Table.DOM_ATTR._ARIA_LABELLEDBY, this._getTableContainer().id); // @HTMLUpdateOK
  this._styleTableHeader(tableHeader);
  this._styleTableFooter(tableFooter);
  this._styleTableBody(tableBody);
  this._styleTableContainer(this._getTableContainer());
};

/**
 * Style the tbody element
 * @param {Element} tableBody tbody DOM element
 * @private
 */
Table.prototype._styleTableBody = function (tableBody) {
  tableBody.classList.add(Table.CSS_CLASSES._TABLE_BODY_CLASS);
  // Add a special marker attribute to tell child components that they are container within table
  tableBody.setAttribute(Components._OJ_CONTAINER_ATTR, this.widgetName); // @HTMLUpdateOK
};

/**
 * Style the td element
 * @param {number} columnIdx  column index
 * @param {Element} tableBodyCell  td DOM element
 * @param {boolean} isNew is new cell
 * @private
 */
Table.prototype._styleTableBodyCell = function (columnIdx, tableBodyCell, isNew) {
  var column = this._getColumnDefs()[columnIdx];

  if (isNew ||
      !tableBodyCell.classList.contains(Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS)) {
    tableBodyCell.classList.add(Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS);
    tableBodyCell.classList.add(Table.CSS_CLASSES._TABLE_DATE_CELL_FORM_CONTROL_CLASS);
  }

  // merge styling with existing styling in case it was specified in a custom renderer
  var tableBodyCellStyle = tableBodyCell.getAttribute(Table.DOM_ATTR._STYLE) || {};
  if (column != null && column.style != null && (isNew || tableBodyCellStyle !== column.style)) {
    DataCollectionUtils.applyMergedInlineStyles(tableBodyCell,
                                                tableBodyCellStyle,
                                                column.style);
  }
  // Use jquery hasClass and addClass because column.className can contain multiple classes
  if (column != null && column.className != null &&
      (isNew || !$(tableBodyCell).hasClass(column.className))) {
    $(tableBodyCell).addClass(column.className);
  }

  if (this._isVerticalGridEnabled() && (isNew ||
      !tableBodyCell.classList.contains(Table.CSS_CLASSES._TABLE_VGRID_LINES_CLASS))) {
    tableBodyCell.classList.add(Table.CSS_CLASSES._TABLE_VGRID_LINES_CLASS);
  }
};

/**
 * Style the tr element
 * @param {Element} tableBodyRow  tr DOM element
 * @param {boolean} isNew is new row
 * @private
 */
Table.prototype._styleTableBodyRow = function (tableBodyRow, isNew) {
  tableBodyRow.setAttribute(Context._OJ_CONTEXT_ATTRIBUTE, ''); // @HTMLUpdateOK

  if (isNew || !tableBodyRow.classList.contains(Table.CSS_CLASSES._TABLE_DATA_ROW_CLASS)) {
    tableBodyRow.classList.add(Table.CSS_CLASSES._TABLE_DATA_ROW_CLASS);
  }
};

/**
 * Style the table container
 * @param {Element} tableContainer  div DOM element
 * @private
 */
Table.prototype._styleTableContainer = function (tableContainer) {
  if (this.options.display === Table._OPTION_DISPLAY._GRID) {
    tableContainer.classList.add(Table.CSS_CLASSES._TABLE_COMPACT_CLASS);
  } else {
    tableContainer.classList.remove(Table.CSS_CLASSES._TABLE_COMPACT_CLASS);
  }
  var editMode = this.options.editMode;
  if (editMode != null && editMode !== Table._OPTION_EDIT_MODE._NONE) {
    tableContainer.classList.add(Table.CSS_CLASSES._TABLE_EDIT_CLASS);
  } else {
    tableContainer.classList.remove(Table.CSS_CLASSES._TABLE_EDIT_CLASS);
  }
  if (this._isHorizontalGridEnabled()) {
    tableContainer.classList.add(Table.CSS_CLASSES._TABLE_HGRID_CLASS);
  } else {
    tableContainer.classList.remove(Table.CSS_CLASSES._TABLE_HGRID_CLASS);
  }
};

/**
 * Style the tfoot element
 * @param {Element} tableFooter tfoot DOM element
 * @private
 */
Table.prototype._styleTableFooter = function (tableFooter) {
  if (!tableFooter) {
    return;
  }
  tableFooter.classList.add(Table.CSS_CLASSES._TABLE_FOOTER_CLASS);
  var tableFooterRow = this._getTableElementsByTagName(tableFooter, Table.DOM_ELEMENT._TR)[0];
  tableFooterRow.classList.add(Table.CSS_CLASSES._TABLE_FOOTER_ROW_CLASS);
  tableFooterRow.setAttribute(Context._OJ_CONTEXT_ATTRIBUTE, ''); // @HTMLUpdateOK
};

/**
 * Style the td element
 * @param {number} columnIdx  column index
 * @param {Element} tableFooterCell  td DOM element
 * @private
 */
Table.prototype._styleTableFooterCell = function (columnIdx, tableFooterCell) {
  var column = this._getColumnDefs()[columnIdx];

  // merge styling with existing styling in case it was specified in a custom renderer
  var tableFooterCellStyle = tableFooterCell.getAttribute(Table.DOM_ATTR._STYLE) || {};
  if (column.footerStyle != null && tableFooterCellStyle !== column.footerStyle) {
    DataCollectionUtils.applyMergedInlineStyles(tableFooterCell,
                                                tableFooterCellStyle,
                                                column.footerStyle);
  }
  if (!tableFooterCell.classList.contains(Table.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS)) {
    tableFooterCell.classList.add(Table.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS);
  }
  if (this._isVerticalGridEnabled() &&
      !tableFooterCell.classList.contains(Table.CSS_CLASSES._TABLE_VGRID_LINES_CLASS)) {
    tableFooterCell.classList.add(Table.CSS_CLASSES._TABLE_VGRID_LINES_CLASS);
  }
  if (column.footerClassName) {
    // Use jquery addClass because column.footerClassName can contain multiple classes
    $(tableFooterCell).addClass(column.footerClassName);
  }
};

/**
 * Style the thead element
 * @param {Element} tableHeader thead DOM element
 * @private
 */
Table.prototype._styleTableHeader = function (tableHeader) {
  if (!tableHeader) {
    return;
  }
  tableHeader.classList.add(Table.CSS_CLASSES._TABLE_HEADER_CLASS);
  // eslint-disable-next-line no-param-reassign
  tableHeader.style[Table.CSS_PROP._DISPLAY] = 'table-header-group';
  var tableHeaderRow = this._getTableElementsByTagName(tableHeader, Table.DOM_ELEMENT._TR)[0];
  tableHeaderRow.classList.add(Table.CSS_CLASSES._TABLE_HEADER_ROW_CLASS);
  tableHeaderRow.style[Table.CSS_PROP._POSITION] = Table.CSS_VAL._RELATIVE;
  tableHeaderRow.setAttribute(Context._OJ_CONTEXT_ATTRIBUTE, ''); // @HTMLUpdateOK
};

/**
 * Style the th element
 * @param {number} columnIdx  column index
 * @param {Element} tableHeaderColumn  th DOM element
 * @param {boolean} isNew is new column
 * @private
 */
Table.prototype._styleTableHeaderColumn = function (columnIdx, tableHeaderColumn, isNew) {
  var column = this._getColumnDefs()[columnIdx];

  if (isNew || !tableHeaderColumn.classList.contains(Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS)) {
    tableHeaderColumn.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS);
  }
  if (column.sortable === Table._OPTION_ENABLED) {
    tableHeaderColumn.classList.add(Table.CSS_CLASSES._TABLE_SORT_CLASS);
  }
  if (this._isVerticalGridEnabled()) {
    if (isNew ||
        !tableHeaderColumn.classList.contains(Table.CSS_CLASSES._TABLE_VGRID_LINES_CLASS)) {
      tableHeaderColumn.classList.add(Table.CSS_CLASSES._TABLE_VGRID_LINES_CLASS);
    }
  }
  // merge styling with existing styling in case it was specified in a custom renderer
  var tableHeaderColumnStyle = tableHeaderColumn.getAttribute(Table.DOM_ATTR._STYLE) || {};
  if (column.headerStyle != null && (isNew || tableHeaderColumnStyle !== column.headerStyle)) {
    DataCollectionUtils.applyMergedInlineStyles(tableHeaderColumn,
                                                tableHeaderColumnStyle,
                                                column.headerStyle);
  }
  // Use jquery hasClass and addClass because column.headerClassName can contain multiple classes
  if (column.headerClassName != null &&
      (isNew || !$(tableHeaderColumn).hasClass(column.headerClassName))) {
    $(tableHeaderColumn).addClass(column.headerClassName);
  }
};

/**
 * Return all the colspanned logical elements
 * @param {Array} elementArray array of DOM elements
 * @return {Array|null} array of DOM elements
 * @private
 */
Table.prototype._getColspanLogicalElements = function (elementArray) {
  var indexedElementArrayNum = 0;
  var indexedElementArray = [];
  var elementArrayCount = elementArray.length;
  for (var i = 0; i < elementArrayCount; i++) {
    var colSpan = elementArray[i].getAttribute(Table.DOM_ATTR._COLSPAN);
    if (colSpan != null) {
      colSpan = parseInt(colSpan, 10);
      for (var j = 0; j < colSpan; j++) {
        indexedElementArray[indexedElementArrayNum + j] = elementArray[i];
      }
      indexedElementArrayNum += colSpan;
    } else {
      indexedElementArray[indexedElementArrayNum] = elementArray[i];
      indexedElementArrayNum += 1;
    }
  }
  return indexedElementArray;
};

/**
 * Helper function which returns if the horizontal grid lines are enabled.
 * @return {boolean} enabled
 * @private
 */
Table.prototype._isHorizontalGridEnabled = function () {
  return (this.options.horizontalGridVisible === Table._OPTION_ENABLED ||
          this.options.horizontalGridVisible === Table._OPTION_AUTO);
};

/**
 * Helper function which returns if the vertical grid lines are enabled.
 * @return {boolean} enabled
 * @private
 */
Table.prototype._isVerticalGridEnabled = function () {
  return (this.options.verticalGridVisible === Table._OPTION_ENABLED ||
          (this.options.verticalGridVisible === Table._OPTION_AUTO &&
          this.options.display === Table._OPTION_DISPLAY._GRID));
};

/**
 * Helper function which returns if the browser is FF
 * @return {boolean} FF
 * @private
 */
Table.prototype._isFF = function () {
  return (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
};

/**
 * Helper function which returns if the browser is IE and if so the version.
 * @return {number|null} IE version. null if not IE.
 * @private
 */
Table.prototype._isIE = function () {
  if (typeof this._browserIsIE === 'undefined') {
    var userAgent = navigator.userAgent;
    if (navigator.appName === 'Microsoft Internet Explorer') {
      var resultArray = (new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})')).exec(userAgent);
      if (resultArray != null) {
        this._browserIsIE = parseFloat(resultArray[1]);
      }
    } else if (userAgent.indexOf('Trident') >= 0) {
      this._browserIsIE = 11;
    } else {
      this._browserIsIE = null;
    }
  }
  return this._browserIsIE;
};

/**
 * Helper function which returns if the browser is webkit.
 * @return {boolean} webkit
 * @private
 */
Table.prototype._isWebkit = function () {
  if (typeof this._browserIsWebkit === 'undefined') {
    var ua = navigator.userAgent.toLowerCase();
    this._browserIsWebkit = (/webkit/.test(ua)) && !(/edge/.test(ua));
  }
  return this._browserIsWebkit;
};

/**
 * Determines if the Table's sizing requires a refresh.
 * @param {number=} width table container width
 * @param {number=} height table container height
 * @private
 */
Table.prototype._isSizingRefreshRequired = function (width, height) {
  if (width != null && height != null) {
    // When a width and height are supplied, we need to ensure they are both non-zero,
    // and also that they are not the same as our cached values (if available).
    if (this._cacheDomDimensions != null) {
      return (width > 0 && height > 0 &&
              (width !== this._cacheDomDimensions.tableContainerWidth ||
              height !== this._cacheDomDimensions.tableContainerHeight));
    }
    return width > 0 && height > 0;
  }
  //  Otherwise, we only need to ensure the tableContainer's size is non-zero.
  var tableContainer = this._getTableContainer();
  return tableContainer.offsetWidth > 0 && tableContainer.offsetHeight > 0;
};

/**
 * Refresh the table dimensions
 * @param {number=} width  table container width
 * @param {number=} height  table container height
 * @param {boolean=} skipRequiredCheck true if the '_isSizingRefreshRequired' check should be skipped
 * @private
 */
Table.prototype._refreshTableDimensions = function (width, height, skipRequiredCheck) {
  if (!skipRequiredCheck && !this._isSizingRefreshRequired(width, height)) {
    return;
  }
  var table = this._getTable();
  var tableContainer = this._getTableContainer();
  var tableHeader = this._getTableHeader();
  var tableBody = this._getTableBody();
  var tableFooter = this._getTableFooter();
  var tableBottomSlot = this._getTableBottomSlot();

  // preserve the scrollTop & scrollLeft
  var scrollTop = null;
  var scrollLeft = null;
  if (this._scrollTop != null &&
      this._scrollTop > 0) {
    scrollTop = this._scrollTop;
  }
  if (this._scrollLeft != null &&
      this._scrollLeft > 0) {
    scrollLeft = this._scrollLeft;
  }

  // first remove any styling so that the browser sizes the table
  this._clearCachedDimensions();
  this._removeTableDimensionsStyling();
  this._styleTableContainer(tableContainer);

  // set the forced column widths before checking for scroll state, otherwise we
  // may miss cases where the columns[].width attribute values cause overflow
  this._setForcedColumnWidths();

  // find Table's bottom slot height to use when determining if overflow if present
  var bottomSlotHeight;
  if (tableBottomSlot != null && tableBottomSlot.clientHeight > 0 &&
      tableBottomSlot.style[Table.CSS_PROP._DISPLAY] !== Table.CSS_VAL._NONE) {
    bottomSlotHeight = tableBottomSlot.offsetHeight;
  } else {
    bottomSlotHeight = 0;
  }

  var tableContainerScrollableState = this._getTableContainerScrollableState(bottomSlotHeight);
  if (tableContainerScrollableState[0] === 1) {
    this._tableHeightConstrained = true;
  } else {
    this._tableHeightConstrained = false;
  }
  if (tableContainerScrollableState[1] === 1) {
    this._tableWidthConstrained = true;
  } else {
    this._tableWidthConstrained = false;
  }

  if (tableBody == null) {
    return;
  }

  // calculate table body border height before scrollbars may be present
  var tableBodyBorderHeight = tableBody.offsetHeight - tableBody.clientHeight;

  if (this._tableHeightConstrained || this._tableWidthConstrained) {
    // Add the oj-table-scroll class because some styling only applies to scrollable table.
    tableContainer.classList.add(Table.CSS_CLASSES._TABLE_SCROLL_CLASS);
    var containerClientWidth = tableContainer.clientWidth;
    var containerClientHeight = tableContainer.clientHeight;

    // If there is overflow in only one direction, we need to check if the addition of
    // scrollbars will cause overflow in the other direction as well
    var browserScrollBarSize = this._getDefaultScrollBarSize();
    if (browserScrollBarSize > 0) {
      if (!this._tableWidthConstrained && !this._isVerticalScrollBarHidden()) {
        // determine if width is set on the container by seeing if it adjusts when inner table width increases
        table.style[Table.CSS_PROP._WIDTH] =
          (containerClientWidth + browserScrollBarSize) + Table.CSS_VAL._PX;
        if (tableContainer.clientWidth < containerClientWidth + browserScrollBarSize) {
          containerClientWidth = tableContainer.clientWidth;
          table.style[Table.CSS_PROP._WIDTH] =
            (containerClientWidth - browserScrollBarSize) + Table.CSS_VAL._PX;
          if (containerClientWidth - browserScrollBarSize < table.clientWidth) {
            this._tableWidthConstrained = true;
          }
        } else {
          containerClientWidth = tableContainer.clientWidth;
          table.style[Table.CSS_PROP._WIDTH] = '';
        }
      } else if (!this._tableHeightConstrained) {
        // determine if height is set on the container by seeing if it adjusts when inner table height increases
        table.style[Table.CSS_PROP._HEIGHT] = ((containerClientHeight + browserScrollBarSize) -
          bottomSlotHeight) + Table.CSS_VAL._PX;
        if (tableContainer.clientHeight < containerClientHeight + browserScrollBarSize) {
          containerClientHeight = tableContainer.clientHeight;
          table.style[Table.CSS_PROP._HEIGHT] = (containerClientHeight - browserScrollBarSize -
            bottomSlotHeight) + Table.CSS_VAL._PX;
          if (containerClientHeight - browserScrollBarSize <
              table.clientHeight + bottomSlotHeight) {
            this._tableHeightConstrained = true;
          }
        } else {
          containerClientHeight = tableContainer.clientHeight;
          table.style[Table.CSS_PROP._HEIGHT] = '';
        }
      }
    }

    // hide the vertical scrollbar
    if (this._tableHeightConstrained && this._isVerticalScrollBarHidden()) {
      tableBody.style[Table.CSS_PROP._OVERFLOW_Y] = 'hidden';
    }
    var actualScrollBarWidth = this._getScrollBarWidth();

    // now that overflow is determined, set the column widths
    this._setColumnWidths(actualScrollBarWidth);

    // add in scrolling class for specific vertical or horizontal scrolling
    if (this._tableHeightConstrained) {
      tableContainer.classList.add(Table.CSS_CLASSES._TABLE_SCROLL_VERTICAL_CLASS);
      var noDataRow = table.querySelector('tr.' +
        Table.CSS_CLASSES._TABLE_NO_DATA_CONTAINER_CLASS);
      if (noDataRow != null) {
        noDataRow.classList.add(Table.CSS_CLASSES._TABLE_NO_DATA_ROW_CLASS);
      }
    }
    if (this._tableWidthConstrained) {
      tableContainer.classList.add(Table.CSS_CLASSES._TABLE_SCROLL_HORIZONTAL_CLASS);
    }

    var captionHeight = 0;
    var caption = this._getTableElementsByTagName(table, 'caption');
    if (caption.length > 0) {
      caption = caption[0];
      captionHeight = caption.offsetHeight;
      caption.style[Table.CSS_PROP._DISPLAY] = Table.CSS_VAL._INLINE;
      if (tableHeader != null) {
        var tableContainerStyle = window.getComputedStyle(tableContainer);
        tableHeader.style[Table.CSS_PROP._BORDER_TOP] =
          tableContainerStyle[Table.CSS_PROP._BORDER_TOP];
      }
    }

    // apply the styling which sets the fixed column headers, etc
    var tableHeaderHeight = 0;
    if (tableHeader != null) {
      tableHeaderHeight = tableHeader.offsetHeight;
    }

    tableBody.style[Table.CSS_PROP._WIDTH] = containerClientWidth + Table.CSS_VAL._PX;

    var tableFooterHeight = 0;
    if (tableFooter != null) {
      tableFooterHeight = tableFooter.offsetHeight;
      tableBody.style[Table.CSS_PROP._TOP] = (-1 * tableFooterHeight) + Table.CSS_VAL._PX;
    }

    // Size the table body to fit in the height
    var tableBodyHeight = containerClientHeight - tableHeaderHeight - tableFooterHeight -
      captionHeight - bottomSlotHeight - tableBodyBorderHeight;
    if (tableBodyHeight > 0) {
      tableBody.style[Table.CSS_PROP._HEIGHT] = tableBodyHeight + Table.CSS_VAL._PX;
      tableBody.style[Table.CSS_PROP._MIN_HEIGHT] = tableBodyHeight + Table.CSS_VAL._PX;
    }

    if (this._tableWidthConstrained) {
      var tableBodyRows = this._getTableBodyRows();
      if (tableBodyRows.length === 0) {
        // if we have no data then update width of no data message to enable horizontal scrolling
        var messageCell = this._getTableBodyMessageCell();
        if (messageCell) {
          var bodyWidth = messageCell.offsetWidth;
          if (tableHeader != null) {
            bodyWidth = Math.max(bodyWidth, tableHeader.offsetWidth);
          }
          if (tableFooter != null) {
            bodyWidth = Math.max(bodyWidth, tableFooter.offsetWidth);
          }
          this._applyForcedColumnWidth(messageCell, bodyWidth);
        }
      }
    }
    if (tableHeader != null) {
      tableHeader.style[Table.CSS_PROP._WIDTH] =
        (containerClientWidth - actualScrollBarWidth) + Table.CSS_VAL._PX;
    }

    if (tableFooter != null) {
      tableFooter.style[Table.CSS_PROP._TOP] = tableBodyHeight + Table.CSS_VAL._PX;
      // if we have scrollbars then size the tablefooter to align with the scrollbars
      tableFooter.style[Table.CSS_PROP._WIDTH] =
        (containerClientWidth - actualScrollBarWidth) + Table.CSS_VAL._PX;
    }
  } else {
    if (this._isTableColumnsWidthSet()) {
      // no overflow is present, but column widths still need to be set
      this._setColumnWidths(0);
    }

    // if bottom slot present, ensure bottom slot is pinned to bottom when underflow
    if (bottomSlotHeight > 0) {
      var availableHeight = tableContainer.clientHeight - bottomSlotHeight;
      if (availableHeight !== table.offsetHeight) {
        tableBottomSlot.style[Table.CSS_PROP._BOTTOM] = 0;
        tableBottomSlot.style[Table.CSS_PROP._POSITION] = Table.CSS_VAL._ABSOLUTE;
      }
    }
  }
  if (this._isStatusMessageShown()) {
    this._refreshTableStatusPosition();
  }

  this._refreshTouchAffordanceGlassPanePosition();

  if (scrollTop != null) {
    var maxScrollTop = this._getScroller().scrollHeight - this._getScroller().clientHeight;
    scrollTop = scrollTop > maxScrollTop ? maxScrollTop : scrollTop;
    if (this._isLoadMoreOnScroll() && maxScrollTop === scrollTop) {
      // Do not set to maxScrollTop or we will cause another fetch
      scrollTop -= 1;
    }
    // set flag so that scroll() will not cause an scrollPosition update
    this._skipScrollUpdate = true;
    this._getScroller().scrollTop = scrollTop;
    $(this._getScroller()).scroll();
  }

  if (scrollLeft != null) {
    // set flag so that scroll() will not cause an scrollPosition update
    this._skipScrollUpdate = true;
    this._setScrollLeft(this._getScroller(), scrollLeft);
    $(this._getScroller()).scroll();
  }

  // cache the final dimensions
  this._cacheDomDimensions.tableContainerWidth = tableContainer.offsetWidth;
  this._cacheDomDimensions.tableContainerHeight = tableContainer.offsetHeight;

  this._tableDimensionsInitialized = true;
  if (tableBody) {
    tableBody.style[Table.CSS_PROP._VISIBILITY] = '';
  }
  if (tableFooter) {
    tableFooter.style[Table.CSS_PROP._VISIBILITY] = '';
  }
};

/**
 * Refresh the table touch affordance glass pane position.
 * @private
 */
Table.prototype._refreshTouchAffordanceGlassPanePosition = function () {
  var touchAffordanceGlassPane = this._getTouchAffordanceGlassPane();
  if (touchAffordanceGlassPane) {
    var tableBody = this._getTableBody();
    var tableBodyRect = tableBody.getBoundingClientRect();
    var tableContainer = this._getTableContainer();
    var tableContainerRect = tableContainer.getBoundingClientRect();

    touchAffordanceGlassPane.style[Table.CSS_PROP._TOP] =
      (tableBodyRect.top - tableContainerRect.top) + Table.CSS_VAL._PX;
    touchAffordanceGlassPane.style[Table.CSS_PROP._BOTTOM] =
      (tableBodyRect.bottom - tableContainerRect.bottom) + Table.CSS_VAL._PX;

    this._moveTableBodyRowTouchSelectionAffordanceTop();
    this._moveTableBodyRowTouchSelectionAffordanceBottom();
  }
};

/**
 * Refresh the table status position
 * @param {boolean=} showStatus whether to show the status message
 * @private
 */
Table.prototype._refreshTableStatusPosition = function (showStatus) {
  // if status message is hidden then return

  var tableContainer = this._getTableContainer();
  var tableContainerHeight = tableContainer.clientHeight;
  var tableStatusMessage = this._getTableStatusMessage();

  var statusMessageTop = 0;
  var statusMessageHeight = tableContainerHeight;
  var tableHeader = this._getTableHeader();
  if (tableHeader != null) {
    var headerHeight = tableHeader.offsetHeight;
    statusMessageTop = headerHeight;
    statusMessageHeight -= headerHeight;
  }
  var tableFooter = this._getTableFooter();
  if (tableFooter != null) {
    statusMessageHeight -= tableFooter.offsetHeight;
  }
  var tableBottomSlot = this._getTableBottomSlot();
  if (tableBottomSlot != null) {
    statusMessageHeight -= tableBottomSlot.offsetHeight;
  }

  if (this._isSkeletonSupport()) {
    // render enough skeleton rows to fill viewport
    var count = 0;
    var skeletonDimension = this._getDefaultSkeletonDimension();
    if (skeletonDimension.width > 0 && skeletonDimension.height > 0) {
      count = Math.max(1, Math.ceil(statusMessageHeight / skeletonDimension.height));
    }
    for (var i = 0; i < count; i++) {
      tableStatusMessage.appendChild(this._createSkeletonRow()); // @HTMLUpdateOK
    }
    this._skeletonFadeInEndListener = function () {
      tableStatusMessage.classList.remove('oj-animation-skeleton-fade-in');
      var skeletonRows = tableStatusMessage.querySelectorAll('.oj-table-skeleton-row');
      skeletonRows.forEach(function (row) {
        row.classList.add('oj-animation-skeleton');
      });
      tableStatusMessage.removeEventListener('animationend', this._skeletonFadeInEndListener);
    }.bind(this);
    tableStatusMessage.addEventListener('animationend', this._skeletonFadeInEndListener);
    tableStatusMessage.classList.add('oj-animation-skeleton-fade-in');
  } else if (statusMessageHeight <= 40) {
    // use overall container height if space reserved for table body is too small
    statusMessageTop = 0;
    statusMessageHeight = tableContainerHeight;
  }

  // size the messaging background
  tableStatusMessage.style[Table.CSS_PROP._TOP] = statusMessageTop + Table.CSS_VAL._PX;
  tableStatusMessage.style[Table.CSS_PROP._HEIGHT] = statusMessageHeight + Table.CSS_VAL._PX;
  tableStatusMessage.style[Table.CSS_PROP._WIDTH] = tableContainer.clientWidth + Table.CSS_VAL._PX;

  if (showStatus) {
    tableStatusMessage.style[Table.CSS_PROP._DISPLAY] = Table.CSS_VAL._INLINE;
    this._statusMessageShown = true;
  }

  if (!this._isSkeletonSupport()) {
    // refresh the status message position
    var tableStatusMessageText = tableStatusMessage.children[0];
    tableStatusMessageText.style[Table.CSS_PROP._TOP] =
      ((statusMessageHeight - tableStatusMessageText.offsetHeight) / 2) + Table.CSS_VAL._PX;
  }
};

/**
 * Creates a skeleton representing a single item.
 * @private
 */
Table.prototype._createSkeletonRow = function () {
  var content = document.createElement('div');
  content.className = 'oj-table-skeleton-row-container';
  var innerContent = document.createElement('div');
  innerContent.className = 'oj-table-skeleton-row';
  content.appendChild(innerContent); // @HTMLUpdateOK
  return content;
};

/**
 * Get the dimension of the default skeleton row
 * @private
 */
Table.prototype._getDefaultSkeletonDimension = function () {
  if (this._defaultSkeletonDim == null) {
    var tableContainer = this._getTableContainer();
    var skeleton = this._createSkeletonRow();
    skeleton.style.visibility = 'hidden';
    skeleton.style.display = 'block';
    tableContainer.appendChild(skeleton); // @HTMLUpdateOK
    var dim = { width: skeleton.offsetWidth, height: skeleton.offsetHeight };
    tableContainer.removeChild(skeleton);
    if (dim.height > 0 && dim.width > 0) {
      // cache the value only if it's valid
      this._defaultSkeletonDim = dim;
    }
    return dim;
  }
  return this._defaultSkeletonDim;
};

/**
 * Cache DOM Element
 * @param {string} key key for identifying the element
 * @param {Element} element  DOM element
 * @private
 */
Table.prototype._cacheDomElement = function (key, element) {
  if (!this._domCache) {
    this._domCache = {};
  }
  this._domCache[key] = element;
};

/**
 * Clear the DOM cache
 * @param {string|null} key key for identifying the element
 * @private
 */
Table.prototype._clearDomCache = function (key) {
  if (key && this._domCache) {
    delete this._domCache[key];
  } else {
    this._domCache = {};
  }
  this._cacheDomDimensions = {};
};

/**
 * Get cached DOM Element
 * @param {string} key key for identifying the element
 * @return {Element|null} returns the cached DOM element
 * @private
 */
Table.prototype._getCachedDomElement = function (key) {
  if (this._domCache) {
    return this._domCache[key];
  }
  return null;
};

/**
 * Check cached DOM Element
 * @param {string} key key for identifying the element
 * @return {boolean} returns whether the key is cached
 * @private
 */
Table.prototype._isCachedDomElement = function (key) {
  if (!this._domCache) {
    this._domCache = {};
  }
  return Object.keys(this._domCache).indexOf(key) !== -1;
};

/**
 * Get the DOM element contained in table
 * @param {string} className css class name for the table element
 * @param {boolean=} onlyChildren check only the direct children if true
 * @return {Element|null} returns the DOM element
 * @private
 */
Table.prototype._getTableElementByClassName = function (className, onlyChildren) {
  if (!this._isCachedDomElement(className)) {
    var tableContainer = this._getTableContainer();
    if (tableContainer) {
      this._cacheDomElement(className, null);

      if (!onlyChildren) {
        var domElement = this._getTableElementsByClassName(tableContainer, className);
        if (domElement.length > 0) {
          this._cacheDomElement(className, domElement[0]);
        }
      } else {
        this._cacheDomElement(className,
                              this._getChildElementByClassName(tableContainer, className));

        if (this._getCachedDomElement(className) == null) {
          var table = this._getTable();
          this._cacheDomElement(className, this._getChildElementByClassName(table, className));
        }
      }
    }
  }
  return this._getCachedDomElement(className);
};

/**
 * Get the child DOM element by class name
 * @param {Element} parentElement parent element
 * @param {string} className css class name for the table element
 * @return {Element|null} returns the DOM element
 * @private
 */
Table.prototype._getChildElementByClassName = function (parentElement, className) {
  if (parentElement.childNodes != null && parentElement.childNodes.length > 0) {
    for (var i = 0; i < parentElement.childNodes.length; i++) {
      if (parentElement.childNodes[i].classList != null &&
          parentElement.childNodes[i].classList.contains(className)) {
        return parentElement.childNodes[i];
      }
    }
  }
  return null;
};

/**
 * Get descendant elements by class name. Only those directly owned by this table (or clone of) is included.
 * @param {Element} parentElement parent element
 * @param {string} name css class name to match on
 * @param {boolean=} isClone Whether parentElement is a container clone
 * @return {Array} The matched elements
 * @private
 */
Table.prototype._getTableElementsByClassName = function (parentElement, name, isClone) {
  var elements = parentElement.getElementsByClassName(name);
  return this._filterTableOwnedElements(elements, isClone ? parentElement : null);
};

/**
 * Get descendant elements by tag name. Only those directly owned by this table (or clone of) is included.
 * @param {Element} parentElement parent element
 * @param {string} name tag name to match on
 * @param {boolean=} isClone Whether parentElement is a container clone
 * @return {Array} The matched elements
 * @private
 */
Table.prototype._getTableElementsByTagName = function (parentElement, name, isClone) {
  var elements = parentElement.getElementsByTagName(name);
  return this._filterTableOwnedElements(elements, isClone ? parentElement : null);
};

/**
 * Get descendant elements by selector. Only those directly owned by this table (or clone of) is included.
 * @param {Element} parentElement parent element
 * @param {string} selector selector
 * @param {boolean=} isClone Whether parentElement is a container clone
 * @return {Array} The matched elements
 * @private
 */
Table.prototype._tableQuerySelectorAll = function (parentElement, selector, isClone) {
  var elements = parentElement.querySelectorAll(selector);
  return this._filterTableOwnedElements(elements, isClone ? parentElement : null);
};

/**
 * Return subset of elements directly owned by this table (or clone of) given an array of elements.
 * @param {Element} parentElement The parentElement that initiated this call
 * @param {Array} elements The array of elements
 * @param {Element=} containerClone The cloned container if querying against a table clone.
 * @return {Array} Subset of the given array directly owned by this table (or clone of)
 * @private
 */
Table.prototype._filterTableOwnedElements = function (elements, containerClone) {
  var tableContainer;
  var table;
  if (!containerClone) {
    tableContainer = this._getTableContainer();
    table = this._getTable();
  } else {
    tableContainer = containerClone;
    var tables = containerClone.getElementsByTagName(Table.DOM_ELEMENT._TABLE);
    for (var i = 0; i < tables.length; i++) {
      if (tables[i].parentNode === containerClone) {
        table = tables[i];
        break;
      }
    }
  }
  return Array.prototype.filter.call(elements, function (element) {
    return this._isTableOwned(element, tableContainer, table);
  }.bind(this));
};

/**
 * Checks whether given element is directly owned by this table, or a clone of this table.
 * @param {Element} element The query element
 * @param {Element=} containerClone The cloned container if querying against a table clone.
 * @param {Element=} tableClone The table child of the cloned container.
 * @return {boolean} Whether the element is directly owned by this table (or clone of).
 * @private
 */
Table.prototype._isTableOwned = function (element, containerClone, tableClone) {
  // An element inside this table's container is not directly owned by this table if
  // the element is part of a child oj-table, or part of a child html table
  var tableContainer = containerClone || this._getTableContainer();
  var table = containerClone ? tableClone : this._getTable();
  if (tableContainer) {
    if (table) {
      var elemParentTable = this._getFirstAncestor(element, table.tagName);
      if (elemParentTable === table) {
        return true;
      }
      if (elemParentTable) {
        return false;
      }
    }
    var elemContainer = this._getFirstAncestor(element, '.' + Table.CSS_CLASSES._TABLE_CONTAINER_CLASS);
    if (elemContainer === tableContainer) {
      return true;
    }
    if (elemContainer) {
      return false;
    }
    if (!tableContainer.contains(element)) {
      // element not added to container yet but will be, and if reached here, element has no other table ancestor
      return true;
    }
  }
  return false;
};

/**
  * Focus setup handlers
  * @private
  */
Table.prototype._focusSetupHandlers = function (focusInHandler, focusOutHandler) {
  this._setFocusInHandler(focusInHandler);
  this._setFocusOutHandler(focusOutHandler);
};

/**
  * Iterate through the columns and remove the widths
  * @private
  */
Table.prototype._removeHeaderColumnAndCellColumnWidths = function () {
  var columns = this._getColumnDefs();
  var columnCount = columns.length;

  var i;
  for (i = 0; i < columnCount; i++) {
    var headerColumn = this._getTableHeaderColumn(i);
    if (headerColumn != null) {
      this._applyForcedColumnWidth(headerColumn, '');
      this._styleTableHeaderColumn(i, headerColumn);
    }
  }

  // unfreeze any columns that were frozen due to scrolling
  this._unfreezeColumnWidths();

  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length > 0) {
    for (i = 0; i < columnCount; i++) {
      var tableBodyCell;
      if (this._forcedWidthColumns != null && this._forcedWidthColumns[i] !== false) {
        for (var j = 0; j < tableBodyRows.length; j++) {
          tableBodyCell = this._getTableBodyCell(j, i, null);
          if (tableBodyCell !== null) {
            this._applyForcedColumnWidth(tableBodyCell, '');
            this._styleTableBodyCell(i, tableBodyCell);
          }
        }
      } else {
        tableBodyCell = this._getTableBodyCell(0, i, null);
        if (tableBodyCell != null) {
          this._applyForcedColumnWidth(tableBodyCell, '');
          this._styleTableBodyCell(i, tableBodyCell);
        }
      }
    }
  }

  for (i = 0; i < columnCount; i++) {
    var footerCell = this._getTableFooterCell(i);
    if (footerCell != null) {
      this._applyForcedColumnWidth(footerCell, '');
      this._styleTableFooterCell(i, footerCell);
    }
  }

  // remove styling applied to no data message if present
  var messageCell = this._getTableBodyMessageCell();
  if (messageCell) {
    this._applyForcedColumnWidth(messageCell, '');
  }
};

/**
 * Remove table dimensions styling
 * @private
 */
Table.prototype._removeTableDimensionsStyling = function () {
  var table = this._getTable();
  var tableContainer = this._getTableContainer();
  var tableHeader = this._getTableHeader();
  var tableHeaderRow = this._getTableHeaderRow();
  var tableFooter = this._getTableFooter();
  var tableFooterRow = this._getTableFooterRow();
  var tableBody = this._getTableBody();
  var tableBottomSlot = this._getTableBottomSlot();

  tableContainer.classList.remove(Table.CSS_CLASSES._TABLE_SCROLL_CLASS);
  tableContainer.classList.remove(Table.CSS_CLASSES._TABLE_SCROLL_VERTICAL_CLASS);
  tableContainer.classList.remove(Table.CSS_CLASSES._TABLE_SCROLL_HORIZONTAL_CLASS);

  // first remove any styling so that the browser sizes the table
  table.removeAttribute(Table.DOM_ATTR._STYLE);
  if (tableBody != null) {
    tableBody.removeAttribute(Table.DOM_ATTR._STYLE);
  }
  if (tableHeader != null) {
    tableHeader.removeAttribute(Table.DOM_ATTR._STYLE);
    tableHeaderRow.removeAttribute(Table.DOM_ATTR._STYLE);

    var headerColumnTextDivs = this._getTableElementsByClassName(tableHeaderRow,
      Table.CSS_CLASSES._COLUMN_HEADER_TEXT_CLASS);
    var headerColumnTextDivsCount = headerColumnTextDivs.length;
    for (var i = 0; i < headerColumnTextDivsCount; i++) {
      headerColumnTextDivs[i].style[Table.CSS_PROP._WIDTH] = '';
    }
  }
  if (tableFooter != null) {
    tableFooter.removeAttribute(Table.DOM_ATTR._STYLE);
    tableFooterRow.removeAttribute(Table.DOM_ATTR._STYLE);
  }
  if (tableBottomSlot != null) {
    tableBottomSlot.removeAttribute(Table.DOM_ATTR._STYLE);
  }
  this._removeHeaderColumnAndCellColumnWidths();
};

/**
 * Get style related to box width of an element
 * @param {Object} style - the style of an element
 * @return {Object} An object with boxSizing, borderWidth, and paddingWidth properties
 * @private
 */
Table.prototype._getBoxStyle = function (style) {
  return {
    boxSizing: style[Table.CSS_PROP._BOX_SIZING],
    borderWidth: (parseFloat(style[Table.CSS_PROP._BORDER_RIGHT_WIDTH]) || 0) +
      (parseFloat(style[Table.CSS_PROP._BORDER_LEFT_WIDTH]) || 0),
    paddingWidth: (parseFloat(style[Table.CSS_PROP._PADDING_RIGHT]) || 0) +
      (parseFloat(style[Table.CSS_PROP._PADDING_LEFT]) || 0)
  };
};

/**
 * @private
 */
Table.prototype._applyColumnHeaderHeight = function (headerColumnCell, height) {
  var headerColumnDiv = this._getTableElementsByClassName(headerColumnCell,
    Table.CSS_CLASSES._COLUMN_HEADER_CLASS);
  if (headerColumnDiv.length > 0) {
    headerColumnDiv[0].style[Table.CSS_PROP._MIN_HEIGHT] = height + Table.CSS_VAL._PX;
  }
};

/**
 * @param {Element} cell
 * @private
 */
Table.prototype._getColumnWidthProperty = function (cell) {
  var computedStyle = window.getComputedStyle(cell);
  var boxStyle = this._getBoxStyle(computedStyle);
  if (this._isIE()) {
    // IE 11 has an issue where border-box still returns just the inner content-box width
    return parseFloat(computedStyle.width) + boxStyle.paddingWidth;
  }
  return parseFloat(computedStyle.width) + ((boxStyle.boxSizing === 'border-box') ?
    -boxStyle.borderWidth : boxStyle.paddingWidth);
};

/**
 * @param {Element} cell
 * @param {Object} cellCompStyle
 * @param {number=} columnWidth
 * @private
 */
Table.prototype._getForcedColumnWidth = function (cell, cellCompStyle, columnWidth) {
  // ojtable columns width is interpreted as padding + content width, so we either have to
  // add in the border width or substract the padding width based on the box-sizing style.
  var cellBoxStyle = this._getBoxStyle(cellCompStyle);
  if (columnWidth != null) {
    return columnWidth + ((cellBoxStyle.boxSizing === 'border-box') ?
     cellBoxStyle.borderWidth : -cellBoxStyle.paddingWidth);
  } else if (this._isIE() && cellBoxStyle.boxSizing === 'border-box') {
    // IE 11 has an issue where border-box still returns just the inner content-box width
    return parseFloat(cellCompStyle.width) + cellBoxStyle.paddingWidth + cellBoxStyle.borderWidth;
  }
  // else, this is the actual width of the column, and we need a width value that will match
  return parseFloat(cellCompStyle.width);
};

/**
 * @private
 */
Table.prototype._applyForcedColumnWidth = function (cell, forcedWidth) {
  var columnElement = cell;
  // add 'px' to the end of the value if width is not being cleared
  if (forcedWidth !== '') {
    // eslint-disable-next-line no-param-reassign
    forcedWidth += Table.CSS_VAL._PX;
  }
  columnElement.style[Table.CSS_PROP._MIN_WIDTH] = forcedWidth;
  columnElement.style[Table.CSS_PROP._WIDTH] = forcedWidth;
  columnElement.style[Table.CSS_PROP._MAX_WIDTH] = forcedWidth;
};

/**
 * Iterate through the columns and set any column widths that are defined by the columns[].width attribute
 * @private
 */
Table.prototype._setForcedColumnWidths = function () {
  var headerCell;
  var tableBodyCell;
  var footerCell;
  var errSummary;
  var errDetail;

  var columns = this._getColumnDefs();
  var columnsCount = columns.length;
  var tableBodyRows = this._getTableBodyRows();

  // find and set the widths of the forced width columns, cells, and footers first
  // this allows the browser to adjust the remaining column widths automatically
  this._forcedWidthColumns = [];
  for (var i = 0; i < columnsCount; i++) {
    var columnWidth = columns[i].width;
    if (columnWidth > 0) {
      // reset the default styling and width at the start of each column loop
      var columnCellCompStyle = null;
      var forcedColumnCellWidth = null;
      if (typeof columnWidth !== 'number') {
        // invalid column width property type
        errSummary = Table._LOGGER_MSG._ERR_WIDTH_INVALID_TYPE_SUMMARY;
        errDetail = Translations.applyParameters(
          Table._LOGGER_MSG._ERR_WIDTH_INVALID_TYPE_DETAIL, { width: columnWidth });
        Logger.warn(errSummary + '\n' + errDetail);
        columnWidth = parseFloat(columnWidth);
      }

      // update column header cell width
      headerCell = this._getTableHeaderColumn(i);
      if (headerCell != null) {
        var forcedColumnWidth =
          this._getForcedColumnWidth(headerCell, window.getComputedStyle(headerCell), columnWidth);
        this._applyForcedColumnWidth(headerCell, forcedColumnWidth);
        // store forced column width in case it is needed for scrollbar adjustments later
        this._forcedWidthColumns[i] = forcedColumnWidth;
      } else {
        this._forcedWidthColumns[i] = true;
      }

      // update column table body cell widths
      // if first row is in edit mode then fetching cell style from second row
      if (this._editableRowIdx === 0 && tableBodyRows.length > 1) {
        tableBodyCell = this._getTableBodyCell(1, i, null);
      } else {
        tableBodyCell = this._getTableBodyCell(0, i, null);
      }
      if (tableBodyCell != null) {
        if (!this._hasRowOrCellRendererOrTemplate(i)) {
          columnCellCompStyle = window.getComputedStyle(tableBodyCell);
          forcedColumnCellWidth =
            this._getForcedColumnWidth(tableBodyCell, columnCellCompStyle, columnWidth);
        }
        for (var j = 0; j < tableBodyRows.length; j++) {
          tableBodyCell = this._getTableBodyCell(j, i, null);
          if (tableBodyCell != null) {
            if (columnCellCompStyle == null) {
              var cellCompStyle = window.getComputedStyle(tableBodyCell);
              var forcedCellWidth =
                this._getForcedColumnWidth(tableBodyCell, cellCompStyle, columnWidth);
              this._applyForcedColumnWidth(tableBodyCell, forcedCellWidth);
            } else {
              this._applyForcedColumnWidth(tableBodyCell, forcedColumnCellWidth);
            }
          }
        }
      }

      // update column footer cell width
      footerCell = this._getTableFooterCell(i);
      if (footerCell != null) {
        this._applyForcedColumnWidth(footerCell,
          this._getForcedColumnWidth(footerCell, window.getComputedStyle(footerCell), columnWidth));
      }
    } else {
      this._forcedWidthColumns[i] = false;
    }
  }
};

/**
 * Returns whether any of the table columns have width specified
 * @return {boolean} true if any column widths are set, false otherwise
 * @private
 */
Table.prototype._isTableColumnsWidthSet = function () {
  var columnsCount = this._getColumnDefs().length;
  for (var i = 0; i < columnsCount; i++) {
    if (this._forcedWidthColumns[i] !== false) {
      return true;
    }
  }
  return false;
};

/**
 * Returns whether all of the table columns have width specified
 * @return {boolean} true if all column widths are set, false otherwise
 * @private
 */
Table.prototype._isAllTableColumnsWidthSet = function () {
  var columnsCount = this._getColumnDefs().length;
  for (var i = 0; i < columnsCount; i++) {
    if (this._forcedWidthColumns[i] === false) {
      return false;
    }
  }
  return true;
};

/**
 * Undo _freezeColumnWidths operation
 * @private
 */
Table.prototype._unfreezeColumnWidths = function () {
  if (this._frozenWidthRows) {
    for (var i = 0; i < this._frozenWidthRows.length; i++) {
      var cells = this._getTableBodyCells(null, this._frozenWidthRows[i]);
      for (var j = 0; j < cells.length; j++) {
        var cell = cells[j];
        this._applyForcedColumnWidth(cell, '');
        this._styleTableBodyCell(j, cell);
      }
    }
  }
  this._frozenWidthRows = [];
};

/**
 * Fixed the width of the columns inside a fragment
 * @private
 */
Table.prototype._freezeColumnWidths = function (fragment) {
  var columns = this._getColumnDefs();
  var columnsCount = columns.length;

  var tableBodyCell;
  if (!this._frozenWidthRows) {
    this._frozenWidthRows = [];
  }

  var minWidths = [];
  for (var i = 0; i < columnsCount; i++) {
    tableBodyCell = this._getTableBodyCell(0, i, null);
    var minWidth = parseFloat(tableBodyCell.style[Table.CSS_PROP._MIN_WIDTH]);
    if (!isNaN(minWidth)) {
      minWidths.push(minWidth);
    } else {
      minWidths.push(null);
    }
  }

  // IE does not support children properties in DocumentFragment
  var rows = fragment.childNodes;
  for (var j = 0; j < rows.length; j++) {
    if (rows[j].nodeName === 'TR') {
      var row = rows[j];
      var cells = this._getTableBodyCells(null, row);
      for (var k = 0; k < cells.length; k++) {
        var forcedWidth = minWidths[k];
        if (!isNaN(forcedWidth)) {
          this._applyForcedColumnWidth(cells[k], forcedWidth);
        }
      }
      this._frozenWidthRows.push(row);
    }
  }
};

/**
 * Iterate through the columns and get and then set the widths
 * for the columns and first row this is so that when we re-apply the styling
 * the headers and footers will align with the cells
 * @param {number} scrollBarWidth the width of the current vertical scrollbar
 * @private
 */
Table.prototype._setColumnWidths = function (scrollBarWidth) {
  var i;
  var headerCell;
  var tableBodyCell;
  var footerCell;

  var headerWidths = [];
  var headerHeights = [];
  var cellWidths = [];
  var footerWidths = [];
  var columnsCount = this._getColumnDefs().length;

  // loop through remaining columns to get the remaining column widths
  for (i = 0; i < columnsCount; i++) {
    if (this._forcedWidthColumns[i] !== false) {
      // add placeholders until the next loop is run
      headerWidths[i] = null;
      cellWidths[i] = null;
      footerWidths[i] = null;
    } else {
      // find column header cell width
      headerCell = this._getTableHeaderColumn(i);
      if (headerCell != null) {
        headerWidths[i] =
          this._getForcedColumnWidth(headerCell, window.getComputedStyle(headerCell));

        // also find the column header cell height
        var headerTextDiv = this._getTableElementsByClassName(headerCell,
          Table.CSS_CLASSES._COLUMN_HEADER_TEXT_CLASS);
        if (headerTextDiv.length > 0) {
          headerHeights[i] = headerTextDiv[0].clientHeight;
        }
      }

      // find column table body cell widths
      tableBodyCell = this._getTableBodyCell(0, i, null);
      if (tableBodyCell != null) {
        cellWidths[i] =
          this._getForcedColumnWidth(tableBodyCell, window.getComputedStyle(tableBodyCell));
      }

      // find column footer cell width
      footerCell = this._getTableFooterCell(i);
      if (footerCell != null) {
        footerWidths[i] =
          this._getForcedColumnWidth(footerCell, window.getComputedStyle(footerCell));
      }
    }
  }

  // finally loop through to set the remaining column widths
  for (i = 0; i < columnsCount; i++) {
    if (this._forcedWidthColumns[i] !== false) {
      // update column header cell height
      headerCell = this._getTableHeaderColumn(i);
      if (headerCell != null) {
        this._applyColumnHeaderHeight(headerCell, headerHeights[i]);
        // extend width of last header cell by scrollbar width only when verical scrollbar is present
        if (i === columnsCount - 1 && !this._tableWidthConstrained && scrollBarWidth > 0) {
          this._applyForcedColumnWidth(headerCell, this._forcedWidthColumns[i] + scrollBarWidth);
        }
      }
    } else {
      // update column header cell width
      headerCell = this._getTableHeaderColumn(i);
      if (headerCell != null) {
        // extend width of last header cell by scrollbar width only when verical scrollbar is present
        if (i === columnsCount - 1 && !this._tableWidthConstrained && scrollBarWidth > 0) {
          this._applyForcedColumnWidth(headerCell, headerWidths[i] + scrollBarWidth);
        } else {
          this._applyForcedColumnWidth(headerCell, headerWidths[i]);
        }

        // also update column header cell height
        this._applyColumnHeaderHeight(headerCell, headerHeights[i]);
      }

      // update column table body cell widths
      tableBodyCell = this._getTableBodyCell(0, i, null);
      if (tableBodyCell != null) {
        this._applyForcedColumnWidth(tableBodyCell, cellWidths[i]);
      }

      // update column footer cell width
      footerCell = this._getTableFooterCell(i);
      if (footerCell != null) {
        this._applyForcedColumnWidth(footerCell, footerWidths[i]);
      }
    }
  }
};

/**
 * Gets sort icon container from header
 * @param {Element} header the header to get sort icon container for
 * @return {Element} sort icon container
 * @private
 */
Table.prototype._getSortIconContainer = function (header) {
  return this._getTableElementsByClassName(header,
    Table.CSS_CLASSES._TABLE_SORT_ICON_CONTAINER_CLASS)[0];
};

/**
 * Gets sort icon from header
 * @param {Element} header the header to get sort icon for
 * @return {Element} sort icon
 * @private
 */
Table.prototype._getSortIcon = function (header) {
  var sortContainer = this._getSortIconContainer(header);
  return sortContainer != null ? sortContainer.firstChild : null;
};

/**
 * Get selector cell of particular row
 * @param {Element} tableBodyRow  tr DOM element
 * @return {Element|null} td DOM element
 * @private
 */
Table.prototype._getTableBodySelectorCell = function (tableBodyRow) {
  if (tableBodyRow != null) {
    var selectorCell = this._getTableElementsByClassName(tableBodyRow,
      Table.CSS_CLASSES._TABLE_SELECTOR_CELL);

    if (selectorCell.length > 0) {
      return selectorCell[0];
    }
  }
  return null;
};

/**
 * Get selector column
 * @return {Element|null} th DOM element
 * @private
 */
Table.prototype._getTableSelectorColumn = function () {
  var tableHeaderRow = this._getTableHeaderRow();
  if (tableHeaderRow != null) {
    var selectorHeader = this._getTableElementsByClassName(tableHeaderRow,
      Table.CSS_CLASSES._COLUMN_HEADER_SELECTOR_CELL_CLASS);

    if (selectorHeader.length > 0) {
      return selectorHeader[0];
    }
  }
  return null;
};

/**
 * @private
 */
Table.CSS_CLASSES = {
  _TABLE_CONTAINER_CLASS: 'oj-table-container',
  _TABLE_SCROLLER_CLASS: 'oj-table-scroller',
  _TABLE_CLASS: 'oj-table',
  _TABLE_COMPACT_CLASS: 'oj-table-grid-display',
  _TABLE_HGRID_CLASS: 'oj-table-horizontal-grid',
  _TABLE_EDIT_CLASS: 'oj-table-editable',
  _TABLE_SCROLL_CLASS: 'oj-table-scroll',
  _TABLE_SCROLL_VERTICAL_CLASS: 'oj-table-scroll-vertical',
  _TABLE_SCROLL_HORIZONTAL_CLASS: 'oj-table-scroll-horizontal',
  _TABLE_SORT_CLASS: 'oj-table-sort',
  _TABLE_ELEMENT_CLASS: 'oj-table-element',
  _TABLE_FOOTER_CLASS: 'oj-table-footer',
  _TABLE_FOOTER_ROW_CLASS: 'oj-table-footer-row',
  _TABLE_HEADER_CLASS: 'oj-table-header',
  _TABLE_HEADER_ROW_CLASS: 'oj-table-header-row',
  _TABLE_HEADER_SELECTOR_CLASS: 'oj-table-header-selector',
  _TABLE_BOTTOM_SLOT_CLASS: 'oj-table-slot-bottom',
  _TABLE_SORT_ICON_CONTAINER_CLASS: 'oj-table-sort-icon-container',
  _COLUMN_HEADER_CELL_CLASS: 'oj-table-column-header-cell',
  _COLUMN_HEADER_SELECTOR_CELL_CLASS: 'oj-table-column-header-selector-cell',
  _COLUMN_HEADER_DROP_EMPTY_CELL_CLASS: 'oj-table-column-header-drop-empty-cell',
  _COLUMN_HEADER_CLASS: 'oj-table-column-header',
  _COLUMN_HEADER_TEXT_CLASS: 'oj-table-column-header-text',
  _COLUMN_HEADER_ASC_ICON_CLASS: 'oj-table-column-header-asc-icon',
  _COLUMN_HEADER_DSC_ICON_CLASS: 'oj-table-column-header-dsc-icon',
  _COLUMN_HEADER_DEFAULT_SORT_ICON_CLASS: 'oj-table-column-header-default-sort-icon',
  _COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS: 'oj-table-column-header-drag-indicator-before',
  _COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS: 'oj-table-column-header-drag-indicator-after',
  _COLUMN_HEADER_DRAG_IMAGE: 'oj-table-column-header-cell-drag-image',
  _COLUMN_HEADER_RESIZING_CLASS: 'oj-table-column-header-resizing',
  _COLUMN_HEADER_RESIZE_INDICATOR_CLASS: 'oj-table-column-header-resize-indicator',
  _TABLE_BODY_CLASS: 'oj-table-body',
  _TABLE_DATA_ROW_CLASS: 'oj-table-body-row',
  _TABLE_DATA_ROW_DRAG_INDICATOR_BEFORE_CLASS: 'oj-table-body-row-drag-indicator-before',
  _TABLE_DATA_ROW_DRAG_INDICATOR_AFTER_CLASS: 'oj-table-body-row-drag-indicator-after',
  _TABLE_TOUCH_AFFORDANCE_GLASS_PANE_CLASS: 'oj-table-touch-affordance-glass-pane',
  _TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_CLASS:
  'oj-table-body-row-touch-selection-affordance-top',
  _TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_CLASS:
  'oj-table-body-row-touch-selection-affordance-bottom',
  _TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_ICON_CLASS:
  'oj-table-body-row-touch-selection-affordance-top-icon',
  _TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_ICON_CLASS:
  'oj-table-body-row-touch-selection-affordance-bottom-icon',
  _TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOUCH_AREA_CLASS:
  'oj-table-body-row-touch-selection-affordance-touch-area',
  _TABLE_DATA_ROW_EDIT_CLASS: 'oj-table-body-row-edit',
  _TABLE_DATA_ROW_SELECTOR_CLASS: 'oj-table-body-row-selector',
  _TABLE_SELECTOR_CELL: 'oj-table-selector-cell',
  _TABLE_DATA_CURRENT_ROW_CLASS: 'oj-table-body-current-row',
  _TABLE_DATA_CELL_CLASS: 'oj-table-data-cell',
  _TABLE_DATA_CELL_EDIT_CLASS: 'oj-table-data-cell-edit',
  _TABLE_DATE_CELL_FORM_CONTROL_CLASS: 'oj-form-control-inherit',
  _TABLE_VGRID_LINES_CLASS: 'oj-table-vgrid-lines',
  _TABLE_FOOTER_CELL_CLASS: 'oj-table-footer-cell',
  _TABLE_FOOTER_DROP_EMPTY_CELL_CLASS: 'oj-table-footer-drop-empty-cell',
  _TABLE_STATUS_ACC_NOTIFICATION_CLASS: 'oj-table-status-acc-notification',
  _TABLE_STATUS_MESSAGE_CLASS: 'oj-table-status-message',
  _TABLE_STATUS_MESSAGE_TEXT_CLASS: 'oj-table-status-message-text',
  _TABLE_ACC_CONTEXT_INFO_CLASS: 'oj-table-acc-context-info',
  _TABLE_ACC_STATE_INFO_CLASS: 'oj-table-acc-state-info',
  _TABLE_LOADING_ICON_CLASS: 'oj-table-loading-icon',
  _TABLE_BODY_MESSAGE_CLASS: 'oj-table-body-message',
  _TABLE_BODY_MESSAGE_ROW_CLASS: 'oj-table-body-message-row',
  _TABLE_NO_DATA_CONTAINER_CLASS: 'oj-table-no-data-container',
  _TABLE_NO_DATA_ROW_CLASS: 'oj-table-no-data-row',
  _ICON_CLASS: 'oj-icon',
  _WIDGET_ICON_CLASS: 'oj-component-icon',
  _HIDDEN_CONTENT_ACC_CLASS: 'oj-helper-hidden-accessible',
  _TEXT_ALIGN_END: 'oj-helper-text-align-end'
};

/**
 * @private
 */
Table.CSS_PROP = {
  _DISPLAY: 'display',
  _VISIBILITY: 'visibility',
  _POSITION: 'position',
  _HEIGHT: 'height',
  _WIDTH: 'width',
  _TOP: 'top',
  _BOTTOM: 'bottom',
  _LEFT: 'left',
  _RIGHT: 'right',
  _PADDING_TOP: 'padding-top',
  _PADDING_LEFT: 'padding-left',
  _PADDING_RIGHT: 'padding-right',
  _OVERFLOW: 'overflow',
  _OVERFLOW_X: 'overflow-x',
  _OVERFLOW_Y: 'overflow-y',
  _MIN_WIDTH: 'min-width',
  _MAX_WIDTH: 'max-width',
  _MIN_HEIGHT: 'min-height',
  _FLOAT: 'float',
  _BORDER_TOP: 'border-top',
  _BORDER_BOTTOM_WIDTH: 'border-bottom-width',
  _BORDER_LEFT_WIDTH: 'border-left-width',
  _BORDER_RIGHT_WIDTH: 'border-right-width',
  _BORDER_COLOR: 'border-color',
  _MARGIN_BOTTOM: 'margin-bottom',
  _VERTICAL_ALIGN: 'vertical-align',
  _CURSOR: 'cursor',
  _ZINDEX: 'z-index',
  _BACKGROUND_COLOR: 'background-color',
  _BOX_SIZING: 'box-sizing'
};

/**
 * @private
 */
Table.CSS_VAL = {
  _NONE: 'none',
  _BLOCK: 'block',
  _INLINE_BLOCK: 'inline-block',
  _RELATIVE: 'relative',
  _ABSOLUTE: 'absolute',
  _INLINE: 'inline',
  _AUTO: 'auto',
  _HIDDEN: 'hidden',
  _SCROLL: 'scroll',
  _VISIBLE: 'visible',
  _LEFT: 'left',
  _PX: 'px',
  _MIDDLE: 'middle',
  _MOVE: 'move',
  _FIXED: 'fixed',
  _TRANSPARENT: 'transparent',
  _BORDER_BOX: 'border-box'
};

/**
 * @private
 */
Table.DOM_ATTR = {
  _STYLE: 'style',
  _TABINDEX: 'tabindex',
  _TYPE: 'type',
  _ID: 'id',
  _TITLE: 'title',
  _HREF: 'href',
  _HEADERS: 'headers',
  _COLSPAN: 'colspan',
  _ROLE: 'role',
  _ARIA_LABEL: 'aria-label',
  _ARIA_LABELLEDBY: 'aria-labelledby',
  _ARIA_HIDDEN: 'aria-hidden'
};

/**
 * @private
 */
Table.DOM_ELEMENT = {
  _DIV: 'div',
  _A: 'a',
  _TR: 'tr',
  _TD: 'td',
  _TH: 'th',
  _TABLE: 'table',
  _TBODY: 'tbody',
  _THEAD: 'thead',
  _TFOOT: 'tfoot',
  _INPUT: 'input',
  _UL: 'ul',
  _SPAN: 'span',
  _BUTTON: 'button',
  _LABEL: 'label'
};

/**
 * @private
 */
Table.MARKER_STYLE_CLASSES = {
  _WIDGET: 'oj-component',
  _ACTIVE: 'oj-active',
  _CLICKABLE_ICON: 'oj-clickable-icon-nocontext',
  _DISABLED: 'oj-disabled',
  _ENABLED: 'oj-enabled',
  _FOCUS: 'oj-focus',
  _FOCUS_HIGHLIGHT: 'oj-focus-highlight',
  _HOVER: 'oj-hover',
  _SELECTED: 'oj-selected',
  _DEFAULT: 'oj-default',
  _WARNING: 'oj-warning',
  _DRAGGABLE: 'oj-draggable',
  _DRAG: 'oj-drag',
  _HIDE_VERTICAL_SCROLLBAR: 'oj-table-hide-vertical-scrollbar'
};



/* global DataCollectionUtils:false, Table:false */

/**
 * @override
 * @private
 */
Table.prototype._events = {
  /*
   * Reset the keyboard state on focusout and set the inactive
   * selected rows
   */
  focusout: function (event) {
    this._clearFocusoutTimeout();

    var table = this._getTable();

    // Components that open popups (such as ojSelect, ojCombobox, ojInputDate, etc.) will trigger
    // focusout, but we don't want to change mode in those cases since the user is still editing.
    var popups = oj.ZOrderUtils.findOpenPopups();
    for (var i = 0; i < popups.length; i++) {
      // Get the launcher of the popup.
      // popups[i] is just a wrapper with the real popup as its child.
      var popupElem = popups[i].firstElementChild;
      var launcher = oj.DomUtils.getLogicalParent($(popupElem));

      // Check if the table contains the launcher
      if ($(table).has(launcher.get(0)).length > 0) {
        // only skip focusout handling if the child popup is currently open
        if (oj.ZOrderUtils.getStatus(popupElem) === oj.ZOrderUtils.STATUS.OPEN) {
          return;
        }
      }
    }
    this._setFocusoutBusyState();

    // set timeout to stay in editable/actionable mode if focus comes back into the table
    this._focusoutTimeout = setTimeout(function () { // @HTMLUpdateOK
      this._accFirstFocus = true;
      this._focusOutHandler($(table));
      this._focusOutHandler($(this._getTableContainer()));
      this._clearKeyboardKeys();
      this._clearFocusedHeaderColumn();
      this._clearFocusedRow(false);
      this._clearTableHeaderColumnsResize();
      this._setTableEditable(false, false, 0, true, event, true);

      // clear styling on previous editable data cell if necessary
      if (this._focusEditCell) {
        this._focusEditCell.classList.remove(Table.CSS_CLASSES._TABLE_DATA_CELL_EDIT_CLASS);
        this._focusEditCell = null;
      }
      this._setTableActionableMode(false, true);
      this._clearFocusoutBusyState();
    }.bind(this), 100);
  },

  /*
   * Check the keyboard state on focus
   */
  focus: function (event) {
    this._checkRowOrHeaderColumnFocus(event);
  },

  /*
   * Handle focus on child row elements
   */
  focusin: function (event) {
    // reset focusout timeout and busy state
    this._clearFocusoutTimeout();
    this._clearFocusoutBusyState();

    var table = this._getTable();
    var tableBody = this._getTableBody();
    var tableContainer = this._getTableContainer();

    this._focusInHandler($(table));
    this._focusInHandler($(tableContainer));
    if ($(tableBody).has(event.target).length > 0) {
      var focusedRowIdx = this._getFocusedRowIdx();
      var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();

      if (!this._isNodeEditable(event.target) &&
          !this._isNodeClickable(event.target) && !this._isTableActionableMode() &&
          !this._hasEditableRow() && !this._temporaryTableChildElementFocus &&
          focusedRowIdx == null && focusedHeaderColumnIdx == null) {
        // when table is not in editable/actionable mode there shouldn't be
        // focus to child row elements. Delay the focus to prevent a race
        // condition with menu launcher re-focus
        setTimeout(function () {
          table.focus();
        }, 0);
      }
    } else if (this._isFF() && event.target === tableBody) {
      // workaround for FF. In FF, the tbody is focusable even though it has
      // tabindex -1. So we have to shift focus back to the table itself if
      // focus is set on the tbody (ex. a shift-tab from outside the table)
      setTimeout(function () {
        table.focus();
      }, 0);
    }
  },

  /*
   * Set the cell edit class on cell focus when row is editable.
   */
  'focus .oj-table-data-cell': function (event) {
    var eventTarget = this._getEventTargetElement(event);
    var rowIdx = this._getElementRowIdx(eventTarget);
    if (rowIdx === this._getEditableRowIdx()) {
      // clear styling on previous editable data cell if necessary
      if (this._focusEditCell && this._focusEditCell !== eventTarget &&
          this._focusEditCell.classList.contains(Table.CSS_CLASSES._TABLE_DATA_CELL_EDIT_CLASS)) {
        this._focusEditCell.classList.remove(Table.CSS_CLASSES._TABLE_DATA_CELL_EDIT_CLASS);
      }
      // add styling on new editable data cell
      eventTarget.classList.add(Table.CSS_CLASSES._TABLE_DATA_CELL_EDIT_CLASS);
      this._focusEditCell = eventTarget;
    }
  },

  /*
   * Capture keyboard down events
   */
  keydown: function (event) {
    var key = event.key || event.keyCode;
    this._addKeyboardKey(key);

    // ignore key event on the footer or target is editable
    var keyboardCode1 = this._getKeyboardKeys()[0];

    if (!DataCollectionUtils.isEscapeKeyEvent(keyboardCode1) &&
        !DataCollectionUtils.isEnterKeyEvent(keyboardCode1) &&
        !DataCollectionUtils.isF2KeyEvent(keyboardCode1) &&
        !DataCollectionUtils.isTabKeyEvent(keyboardCode1) &&
        (this._isNodeEditable(event.target) || (this._getTableFooter() != null &&
        $(this._getTableFooter()).has(event.target).length > 0))) {
      return;
    }

    // process single or two key events
    if (this._getKeyboardKeys().length === 1 ||
        (this._getKeyboardKeys().length === 2 && event[Table._KEYBOARD_CODES._MODIFIER_SHIFT])) {
      if (this._isKeyPressMatch(DataCollectionUtils.isArrowUpKeyEvent) ||
          this._isKeyPressMatch(DataCollectionUtils.isArrowDownKeyEvent) ||
          this._isKeyPressMatch(DataCollectionUtils.isHomeKeyEvent) ||
          this._isKeyPressMatch(DataCollectionUtils.isEndKeyEvent)) {
        // need to do this so that these keys don't act on the page. e.g. pressing Down would cause the
        // page to go down as well as the row to change
        event.preventDefault();
        event.stopPropagation();
      }
      var isExtend = event[Table._KEYBOARD_CODES._MODIFIER_SHIFT];

      if (this._isKeyPressMatch(DataCollectionUtils.isArrowUpKeyEvent) ||
          this._isKeyPressMatch(DataCollectionUtils.isArrowDownKeyEvent)) {
        this._handleKeydownUpDown(event, isExtend &&
          this._getRowSelectionMode() === Table._OPTION_SELECTION_MODES._MULTIPLE);
      } else if (this._isKeyPressMatch(DataCollectionUtils.isArrowLeftKeyEvent) ||
                 this._isKeyPressMatch(DataCollectionUtils.isArrowRightKeyEvent)) {
        this._handleKeydownLeftRight(event, isExtend &&
          this._getColumnSelectionMode() === Table._OPTION_SELECTION_MODES._MULTIPLE);
      } else if (this._isKeyPressMatch(DataCollectionUtils.isTabKeyEvent)) {
        this._handleKeydownTab(event);
      } else if (DataCollectionUtils.isF2KeyEvent(keyboardCode1)) {
        this._handleKeydownF2(event);
      } else if (DataCollectionUtils.isSpaceBarKeyEvent(keyboardCode1)) {
        this._handleKeydownSpacebar(event);
      } else if (DataCollectionUtils.isEnterKeyEvent(keyboardCode1)) {
        this._handleKeydownEnter(event);
      } else if (DataCollectionUtils.isHomeKeyEvent(keyboardCode1)) {
        this._handleKeydownHome(event);
      } else if (DataCollectionUtils.isEndKeyEvent(keyboardCode1)) {
        this._handleKeydownEnd(event);
      } else if (DataCollectionUtils.isEscapeKeyEvent(keyboardCode1)) {
        this._handleKeydownEsc(event);
      }
    }
  },

  /*
   * Capture keyboard up events
   */
  keyup: function (event) {
    // process single or 2 key events
    if (this._getKeyboardKeys().length === 1) {
      var keyboardCode1 = this._getKeyboardKeys()[0];

      // ignore key event on the footer or target is editable
      if (this._isNodeEditable(event.target) || (this._getTableFooter() != null &&
          $(this._getTableFooter()).has(event.target).length > 0)) {
        this._removeKeyboardKey(keyboardCode1);
        return;
      }
      this._removeKeyboardKey(keyboardCode1);
    }
    // remove the key from our internal list of pressed keys.
    var key = event.key || event.keyCode;
    this._removeKeyboardKey(key);
  },

  /*
   * Cancel any resize if the mouse leaves the table
   */
  'mouseleave .oj-table-element': function () {
    this._clearTableHeaderColumnsResize();
  },

  /*
   * Keep track of mousedown/mouseup for multiple selection
   */
  'mousedown .oj-table-body': function (event) {
    // perform selection only for left click
    if (event.which !== 1) {
      return;
    }

    // get the row index if the mousedown was on a row
    this._mouseDownRowIdx = this._getElementRowIdx(event.target);
    if (this._mouseDownRowIdx == null) {
      return;
    }

    var tableBodyRow = this._getTableBodyRow(this._mouseDownRowIdx);
    if (tableBodyRow != null && tableBodyRow.draggable) {
      // do not do row selection if we are dragging
      this._mouseDownRowIdx = null;
    }
  },

  /*
   * Keep track of mousedown/mouseup for multiple selection
   */
  'mouseup .oj-table-body': function () {
    this._mouseDownRowIdx = null;
  },

  /*
   * show the row hover when the mouse enters a table row
   */
  'mouseenter .oj-table-body-row': function (event) {
    var eventTarget = this._getEventTargetElement(event);
    var rowIdx = this._getElementRowIdx(eventTarget);
    if (this._isTableOwned(eventTarget)) {
      eventTarget.classList.add(Table.MARKER_STYLE_CLASSES._HOVER);
      this._updateRowStateCellsClass(rowIdx, { hover: true });
      this._handleMouseEnterSelection(event.target);
    } else {
      this._updateRowStateCellsClass(rowIdx, { hover: false });
      event.stopPropagation();
    }
  },

  /*
   * hide the row hover when the mouse leaves a table row
   */
  'mouseleave .oj-table-body-row': function (event) {
    var eventTarget = this._getEventTargetElement(event);
    var rowIdx = this._getElementRowIdx(eventTarget);
    if (this._isTableOwned(eventTarget)) {
      eventTarget.classList.remove(Table.MARKER_STYLE_CLASSES._HOVER);
      this._updateRowStateCellsClass(rowIdx, { hover: false });
    } else {
      this._updateRowStateCellsClass(rowIdx, { hover: true });
      event.stopPropagation();
    }
  },

  /*
   * set the column header focus.
   */
  'mousedown .oj-table-column-header-cell': function (event) {
    this._lastSelectedHeaderIdx = null;
    if (event.which === 1) {
      if (!this._handleHeaderColumnResizeStart(event)) {
        // get the column index
        var columnIdx = this._getElementColumnIdx(
          this._getEventTargetElement(event));
        // set the column focus if shift key is not pressed
        if (!event[Table._KEYBOARD_CODES._MODIFIER_SHIFT]) {
          // skip scrolling column into viewport
          this._setHeaderColumnFocus(columnIdx, true, true);
          $(event.target).data(Table._FOCUS_CALLED, true);
        }
      }
      if (this._isFF() && oj.DomUtils.isMetaKeyPressed(event)) {
        event.preventDefault();
      }
    }
  },

  /*
   * show the sort icon when the mouse enters a column header
   */
  'mouseenter .oj-table-column-header-cell': function (event) {
    if (this._setResizeCursor(event)) {
      return;
    }
    var eventTarget = this._getEventTargetElement(event);
    this._handleMouseEnterColumnHeader(eventTarget);
  },

  /*
   * show the resize cursor
   */
  'mousemove .oj-table-header': function (event) {
    this._setResizeCursor(event);
  },

  /*
   * remove the hover for resize
   */
  'mousemove .oj-table-column-header-cell': function (event) {
    var eventTarget = this._getEventTargetElement(event);
    if (this._setResizeCursor(event)) {
      this._handleMouseLeaveColumnHeader(eventTarget);
      return;
    }
    this._handleMouseEnterColumnHeader(eventTarget);
  },

  /*
   * hide the sort icon when the mouse leaves a column header
   */
  'mouseleave .oj-table-column-header-cell': function (event) {
    var eventTarget = this._getEventTargetElement(event);
    this._handleMouseLeaveColumnHeader(eventTarget);
  },

  /*
   * handle column resizing.
   */
  'mouseup .oj-table-column-header-cell': function (event) {
    this._handleHeaderColumnResizeEnd(event);
  },

  /*
   * set the row focus when the mouse clicks on a cell.
   */
  'mousedown .oj-table-data-cell': function (event) {
    this._lastSelectedRowIdx = null;
    // get the row index of the cell element
    var eventTarget = this._getEventTargetElement(event);
    var rowIdx = this._getElementRowIdx(eventTarget);
    // set row focus only if shift key is not pressed
    if (!event[Table._KEYBOARD_CODES._MODIFIER_SHIFT]) {
      this._setRowFocus(rowIdx, true, true, eventTarget, event);
      $(event.target).data(Table._FOCUS_CALLED, true);
    }
    if (this._isFF() && oj.DomUtils.isMetaKeyPressed(event)) {
      event.preventDefault();
    }
  },

  /*
   * handle column resizing.
   */
  'mouseup .oj-table-data-cell': function (event) {
    this._handleHeaderColumnResizeEnd(event);
  },

  /*
   * invoke a sort on the column data when the mouse clicks the sort icon
   */
  'click .oj-table-sort-icon-container': function (event) {
    var columnIdx = this._getElementColumnIdx(event.target);
    var tableHeaderColumn = this._getTableHeaderColumn(columnIdx);
    if (!tableHeaderColumn) {
      return;
    }

    // check if the column is currently sorted
    var sorted = $(tableHeaderColumn).data('sorted');
    if (sorted === Table._COLUMN_SORT_ORDER._ASCENDING) {
      this._handleSortTableHeaderColumn(columnIdx, false, event);
    } else {
      this._handleSortTableHeaderColumn(columnIdx, true, event);
    }
    event.preventDefault();
    event.stopPropagation();
  },

  /*
   * set the row focus or selection when the mouse clicks on a row.
   * Shift + click results in continuous selection from focused row to target row.
   * Ctrl + click results in selection and focus. Plain click results in focus.
   * Plain click on a selected row removes the selection.
   */
  'click .oj-table-body-row': function (event) {
    // get the row index of the cell element
    var eventTarget = this._getEventTargetElement(event);
    var rowIdx = this._getElementRowIdx(eventTarget);
    var focusCalled = $(event.target).data(Table._FOCUS_CALLED);

    var isShift = event[Table._KEYBOARD_CODES._MODIFIER_SHIFT];
    if (!focusCalled && (!isShift || (isShift && this._getFocusedRowIdx() == null))) {
      var focused = this._setRowFocus(rowIdx, true, true, eventTarget, event);
      $(event.target).data(Table._FOCUS_CALLED, false);

      if (!focused) {
        return;
      }
    }

    this._fireActionEvent(rowIdx, event);

    // check if we are selecting
    if (isShift) {
      var focusedRowIdx = this._getFocusedRowIdx();
      if (focusedRowIdx != null) {
        // remove the selection highlight
        window.getSelection().removeAllRanges();

        if (this._getRowSelectionMode() === Table._OPTION_SELECTION_MODES._MULTIPLE) {
          // shift selection is always from the focused row to the target row
          this._selectRange(focusedRowIdx, rowIdx, true);
          return;
        }
      }
      // otherwise, just do a single row selection
      this._handleSelectionGesture(rowIdx, true, false);
    } else if (oj.DomUtils.isMetaKeyPressed(event)) {
      this._handleSelectionGesture(rowIdx, true, true);

      // ctrl/meta (only) key pressed, update selection anchor
      if (this._lastSelectedRowIdxArray && this._lastSelectedRowIdxArray.indexOf(rowIdx) > -1) {
        this._selectionAnchorIdx = rowIdx;
      }
    } else if (this._getKeyboardKeys().length === 0) {
      var isTouch = this._isTouchDevice();
      this._handleSelectionGesture(rowIdx, true, isTouch && this._nonContiguousSelection);

      // update selection anchor
      if (this._lastSelectedRowIdxArray && this._lastSelectedRowIdxArray.indexOf(rowIdx) > -1) {
        this._selectionAnchorIdx = rowIdx;
      }

      var rowSelected = this._getRowSelection(rowIdx);
      if (isTouch && rowSelected && !this._nonContiguousSelection &&
          this._getRowSelectionMode() === Table._OPTION_SELECTION_MODES._MULTIPLE) {
        this._createTableBodyRowTouchSelectionAffordance(rowIdx);
      }
    }
  },

  /*
   * Set row to editable.
   */
  'dblclick .oj-table-data-cell': function (event) {
    var columnIdx = this._getElementColumnIdx(event.target);
    this._setTableEditable(true, false, columnIdx, true, event);
  },

  /*
   * set current row when the mouse right clicks on a cell.
   */
  'contextmenu .oj-table-data-cell': function (event) {
    // get the row index of the cell element
    var rowIdx = this._getElementRowIdx(this._getEventTargetElement(event));
    var rowKey = this._getRowKeyForRowIdx(rowIdx);
    this._setCurrentRow({ rowKey: rowKey }, event, false);
  },

  /*
   * set the column header selection and focus. Plain click results in
   * focus and selection. If Ctrl is not pressed then we have single column selection.
   */
  'click .oj-table-column-header-cell': function (event) {
    // get the column index
    var eventTarget = this._getEventTargetElement(event);
    if (eventTarget.style.cursor === 'col-resize') {
      return;
    }
    var columnIdx = this._getElementColumnIdx(eventTarget);
    // check if we need to focus
    var focusCalled = $(event.target).data(Table._FOCUS_CALLED);

    var isShift = event[Table._KEYBOARD_CODES._MODIFIER_SHIFT];
    if (!focusCalled && (!isShift || (isShift && this._getFocusedHeaderColumnIdx() == null))) {
      // set the column focus
      this._setHeaderColumnFocus(columnIdx, true, false);
      $(event.target).data(Table._FOCUS_CALLED, false);
    }

    // check if we are selecting
    if (isShift) {
      var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
      if (focusedHeaderColumnIdx != null &&
          this._getColumnSelectionMode() === Table._OPTION_SELECTION_MODES._MULTIPLE) {
        // shift selection is always from the focused column to the target column
        this._selectRange(focusedHeaderColumnIdx, columnIdx, false);
      } else {
        // otherwise, just do a single column selection
        this._handleSelectionGesture(columnIdx, false, true);
      }
    } else if (oj.DomUtils.isMetaKeyPressed(event)) {
      this._handleSelectionGesture(columnIdx, false, true);
    } else if (this._getKeyboardKeys().length === 0) {
      this._handleSelectionGesture(columnIdx, false, false);
      this._getTableDndContext().setTableHeaderColumnDraggable(columnIdx, true);
    }
  },

  /*
   * Set dragstart handler for column DnD.
   */
  'dragstart .oj-table-column-header-cell': function (event) {
    var eventTarget = this._getEventTargetElement(event);
    if (eventTarget.style.cursor !== 'col-resize') {
      return this._getTableDndContext().handleColumnDragStart(event);
    }
    return undefined;
  },

  /*
   * Set dragenter handler for column DnD.
   */
  'dragenter .oj-table-column-header-cell': function (event) {
    return this._getTableDndContext().handleColumnDragEnter(event);
  },

  /*
   * Set dragover handler for column DnD.
   */
  'dragover .oj-table-column-header-cell': function (event) {
    return this._getTableDndContext().handleColumnDragOver(event);
  },

  /*
   * Set dragleave handler for column DnD.
   */
  'dragleave .oj-table-column-header-cell': function (event) {
    return this._getTableDndContext().handleColumnDragLeave(event);
  },

  /*
   * Set drop handler for column DnD.
   */
  'drop .oj-table-column-header-cell': function (event) {
    return this._getTableDndContext().handleColumnDrop(event);
  },

  /*
   * Set dragend handler for column DnD.
   */
  'dragend .oj-table-column-header-cell': function (event) {
    return this._getTableDndContext().handleColumnDragEnd(event);
  },

  /*
   * handle the dragstart event on rows and invoke event callback.
   */
  'dragstart .oj-table-body-row': function (event) {
    return this._getTableDndContext().handleRowDragStart(event);
  },

  /*
   * handle the drag event on rows and invoke event callback.
   */
  'drag .oj-table-body-row': function (event) {
    return this._getTableDndContext().handleRowDrag(event);
  },

  /*
   * handle the dragend event on rows and invoke event callback.
   */
  'dragend .oj-table-body-row': function (event) {
    return this._getTableDndContext().handleRowDragEnd(event);
  },

  /*
   * handle the dragenter event and invoke event callback.
   */
  'dragenter .oj-table-body': function (event) {
    return this._getTableDndContext().handleRowDragEnter(event);
  },

  /*
   * handle the dragover event and invoke event callback.
   */
  'dragover .oj-table-body': function (event) {
    return this._getTableDndContext().handleRowDragOver(event);
  },

  /*
   * handle the dragleave event and invoke event callback.
   */
  'dragleave .oj-table-body': function (event) {
    return this._getTableDndContext().handleRowDragLeave(event);
  },

  /*
   * handle the drop event and invoke event callback.
   */
  'drop .oj-table-body': function (event) {
    return this._getTableDndContext().handleRowDrop(event);
  }
};

/**
 * Fires rowAction event
 * @private
 */
Table.prototype._fireActionEvent = function (rowIdx, event) {
  if (this._isTableActionableMode()) {
    return;
  }

  var tableBodyRow = this._getTableBodyRow(rowIdx);
  if (tableBodyRow != null) {
    this._trigger('rowAction', event, {
      context: {
        key: $(tableBodyRow).data('rowKey'),
        data: $(tableBodyRow).data('rowData'),
        metadata: $(tableBodyRow).data('rowMetadata')
      }
    });
  }
};

/**
 *
 * Get the target element
 * @param {Object} event DOM touch event
 * @return {Element} element  DOM element
 * @private
 */
Table.prototype._getEventTargetElement = function (event) {
  return event.type.indexOf('touch') === 0 ?
    this._getTouchEventTargetElement(event) : event.currentTarget;
};

/**
 *
 * Get the target element at the touch event
 * @param {Object} event DOM touch event
 * @return {Element} element  DOM element
 * @private
 */
Table.prototype._getTouchEventTargetElement = function (event) {
  var eventLocation = event.originalEvent.changedTouches[0];
  return document.elementFromPoint(eventLocation.clientX, eventLocation.clientY);
};

/**
 * Register the events which will be published by the table component.
 * @private
 */
Table.prototype._registerCustomEvents = function () {
  var jqEvent = (/** @type {{special: Object}} */($.event));
  var jqEventSpecial = jqEvent.special;
  // ojtablebeforecurrentrow handlers will be passed an object which contains the
  // old and new current row
  jqEventSpecial.ojtablebeforecurrentrow = {
    /**
     * Handle event
     * @param {{handleObj: {handler: {apply: Function}}}} event
     * @private
     */
    handle: function (event) {
      var handleObj = event.handleObj;
      return handleObj.handler.apply(this, [event, arguments[1]]);
    }
  };
  // ojtablesort handlers will be passed an object which contains the
  // header and direction
  jqEventSpecial.ojtablesort = {
    /**
     * Handle event
     * @param {{handleObj: {handler: {apply: Function}}}} event
     * @private
     */
    handle: function (event) {
      var handleObj = event.handleObj;
      return handleObj.handler.apply(this, [event, arguments[1]]);
    }
  };
};

/**
 * Only process the event handler if it's a double tap
 * @param {Event} event
 * @param {Function} eventHandler
 * @private
 */
Table.prototype._touchEventDoubleTapFunction = function (event, eventHandler) {
  var eventTarget = $(event.target);

  if (this._lastTapTime != null && ((new Date()).getTime() - this._lastTapTime) < 250 &&
      this._lastTapTarget[0] === eventTarget[0]) {
    this._lastTapTime = null;
    this._lastTapTarget = null;
    eventHandler();
  } else {
    this._lastTapTarget = eventTarget;
    this._lastTapTime = (new Date()).getTime();
  }
};

/**
 * @private
 */
Table.prototype._registerTouchEvents = function () {
  const regularTouchEventsAndListeners = {

    /*
     * Keep track of touchend for multiple selection
     */
    touchend: function (event) {
      if (this._mouseDownRowIdx != null) {
        var eventTarget = this._getEventTargetElement(event);
        this._handleMouseEnterSelection(eventTarget, true);
      }
      this._mouseDownRowIdx = null;
      if (this._handleHeaderColumnResizeEnd(event)) {
        event.preventDefault();
      }
    },

    /*
     * Keep track of touchend for edit
     */
    'touchend .oj-table-body': function (evt) {
      this._touchEventDoubleTapFunction(evt, (function (event) {
        return function () {
          var eventTarget = this._getEventTargetElement(event);
          var columnIdx = this._getElementColumnIdx(eventTarget);
          this._setTableEditable(true, false, columnIdx, true, event);
          event.preventDefault();
        }.bind(this);
      }.bind(this)(evt)));
    },

    /*
     * Keep track of touchcancel for multiple selection
     */
    touchcancel: function () {
      this._mouseDownRowIdx = null;
      this._clearTableHeaderColumnsResize();
    }
  };

  const passiveTouchEventsAndListeners = {

    /*
     * Keep track of touchstart on selection affordance
     */
    'touchstart .oj-table-body-row-touch-selection-affordance-touch-area': function (event) {
      var fingerCount = event.originalEvent.touches.length;
      if (fingerCount === 1 &&
          this._getRowSelectionMode() === Table._OPTION_SELECTION_MODES._MULTIPLE) {
        if (event.target.classList.contains(
              Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_CLASS) ||
            event.target.classList.contains(
              Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_ICON_CLASS)) {
          event.preventDefault();
          this._mouseDownRowIdx =
            $(this._getTableBodyRowTouchSelectionAffordanceBottom()).data('rowIdx');
        } else if (event.target.classList.contains(
              Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_CLASS) ||
            event.target.classList.contains(
              Table.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_ICON_CLASS)) {
          event.preventDefault();
          this._mouseDownRowIdx =
            $(this._getTableBodyRowTouchSelectionAffordanceTop()).data('rowIdx');
        }
      }
    },

    /*
     * column resizing
     */
    'touchstart .oj-table-column-header-cell': function (event) {
      var fingerCount = event.originalEvent.touches.length;
      if (fingerCount === 1) {
        if (this._isTableColumnsResizable() && this._handleHeaderColumnResizeStart(event)) {
          event.preventDefault();
        }
      }
    },

    /*
     * Keep track of touchmove for column resize
     */
    'touchmove .oj-table-header': function (event) {
      if (this._isTableColumnsResizable()) {
        this._setResizeCursor(event);
      }
    },

    /*
     * Keep track of touchmove for multiple selection
     */
    'touchmove .oj-table-body-row-touch-selection-affordance-touch-area': function (event) {
      if (this._mouseDownRowIdx != null) {
        event.preventDefault();
        var eventTarget = this._getEventTargetElement(event);
        this._handleMouseEnterSelection(eventTarget, true);
      }
    },
  };

  const tableContainer = this._getTableContainer();

  // register regular touch events
  this._on($(tableContainer), regularTouchEventsAndListeners);

  // register touchstart & touchmove with passive option for custom elements
  if (this._IsCustomElement()) {
    const createDelegatedListener = function (selector, listener) {
      return function (event) {
        const container = event.currentTarget;
        const targetElement = event.target.closest(selector);
        if (targetElement && container.contains(targetElement)) {
          listener($.Event(event, { currentTarget: targetElement }));
        }
      };
    };

    const TOUCHSTART = 'touchstart';
    const TOUCHMOVE = 'touchmove';
    const TABLE_BODY_SELECTOR = '.oj-table-body-row-touch-selection-affordance-touch-area';
    const TOUCHSTART_CELL_HEADER_SELECTOR = '.oj-table-column-header-cell';
    const TOUCHMOVE_TABLE_HEADER_SELECTOR = '.oj-table-header';

    this._delegatedTouchStartTableBodyListener = createDelegatedListener(TABLE_BODY_SELECTOR,
      passiveTouchEventsAndListeners[`${TOUCHSTART} ${TABLE_BODY_SELECTOR}`].bind(this));

    this._delegatedTouchStartCellHeaderListener =
      createDelegatedListener(TOUCHSTART_CELL_HEADER_SELECTOR,
        passiveTouchEventsAndListeners[`${TOUCHSTART} ${TOUCHSTART_CELL_HEADER_SELECTOR}`].bind(this));

    this._delegatedTouchMoveTableHeaderListener =
      createDelegatedListener(TOUCHMOVE_TABLE_HEADER_SELECTOR,
        passiveTouchEventsAndListeners[`${TOUCHMOVE} ${TOUCHMOVE_TABLE_HEADER_SELECTOR}`].bind(this));

    this._delegatedTouchMoveTableBodyListener = createDelegatedListener(TABLE_BODY_SELECTOR,
      passiveTouchEventsAndListeners[`${TOUCHMOVE} ${TABLE_BODY_SELECTOR}`].bind(this));

    tableContainer.addEventListener(TOUCHSTART, this._delegatedTouchStartTableBodyListener, {
      passive: false
    });
    tableContainer.addEventListener(TOUCHSTART, this._delegatedTouchStartCellHeaderListener, {
      passive: false
    });
    tableContainer.addEventListener(TOUCHMOVE, this._delegatedTouchMoveTableHeaderListener, {
      passive: true
    });
    tableContainer.addEventListener(TOUCHMOVE, this._delegatedTouchMoveTableBodyListener, {
      passive: false
    });
  } else {
    this._on($(tableContainer), passiveTouchEventsAndListeners);
  }
};



/* global DataCollectionUtils:false, Logger:false, Promise:false, Set:false, Table:false, Translations:false */

/**
 * Check and set the row or header column focus
 * @private
 */
Table.prototype._checkRowOrHeaderColumnFocus = function (event) {
  var focusedRowIdx = this._getFocusedRowIdx();
  var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
  if (focusedRowIdx == null && focusedHeaderColumnIdx == null) {
    var focusRowIdx = null;
    var currentRow = this._getCurrentRow();
    var currentRowKey = currentRow != null ? currentRow.rowKey : null;
    if (currentRowKey != null) {
      focusRowIdx = this._getRowIdxForRowKey(currentRowKey);
    }

    // if no row or column is focused
    // and currentRow is null then set the focus on the first column or row
    if (focusRowIdx == null) {
      if (this._isTableHeaderless()) {
        this._setRowFocus(0, true, true, null, event);
      } else {
        var visibleIndex = this._getFirstVisibleColumnIndex(0, true);
        this._setHeaderColumnFocus(visibleIndex, true, false);
      }
    } else {
      this._setRowFocus(focusRowIdx, true, true, null, event);
    }
  }
};

/**
 * Clear the focused row
 * @param {boolean} updateCurrentRow  whether to update the currentRow
 * @private
 */
Table.prototype._clearFocusedRow = function (updateCurrentRow) {
  var focusedRowIdx = this._getFocusedRowIdx();
  if (focusedRowIdx != null) {
    this._setRowFocus(-1, true, updateCurrentRow, null, null);
  }
};

/**
 * Clear the focused column header
 * @private
 */
Table.prototype._clearFocusedHeaderColumn = function () {
  var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
  if (focusedHeaderColumnIdx != null) {
    this._setHeaderColumnFocus(focusedHeaderColumnIdx, false, false);
  }
  this._activeColumnIndex = -1;
};

/**
 * Returns the index for the first visible column in the specified direction.
 * @param {number} currentIndex the column index to start the search from
 * @param {boolean} isForward whether to search in the forward direction
 * @private
 */
Table.prototype._getFirstVisibleColumnIndex = function (currentIndex, isForward) {
  var columns = this._getColumnDefs();
  var nextIndex = currentIndex;
  var columnHeader;
  if (isForward) {
    while (nextIndex < columns.length) {
      columnHeader = this._getTableHeaderColumn(nextIndex);
      if (columnHeader && columnHeader.clientWidth > 0) {
        return nextIndex;
      }
      nextIndex += 1;
    }
  } else {
    while (nextIndex > -1) {
      columnHeader = this._getTableHeaderColumn(nextIndex);
      if (columnHeader && columnHeader.clientWidth > 0) {
        return nextIndex;
      }
      nextIndex -= 1;
    }
  }
  return null;
};

/**
 * Returns the index for the next visible column in the specified direction
 * @param {number} currentIndex the column index to start the search from
 * @param {type} isForward whether to search in the forward direction
 * @private
 */
Table.prototype._getNextVisibleColumnIndex = function (currentIndex, isForward) {
  var startIndex;
  if (isForward) {
    startIndex = currentIndex + 1;
  } else {
    startIndex = currentIndex - 1;
  }
  var firstVisibleIndex = this._getFirstVisibleColumnIndex(startIndex, isForward);
  return (firstVisibleIndex !== null) ? firstVisibleIndex : currentIndex;
};

/**
 * Get the current row.
 * @return {Object|null} current row object or null if none.
 * @throws {Error}
 * @private
 */
Table.prototype._getCurrentRow = function () {
  var dataprovider = this._getData();
  // if no data then bail
  if (!dataprovider) {
    return null;
  }
  return this._currentRow;
};

/**
 * Get the focused row index
 * @return {number|null} the row index
 * @private
 */
Table.prototype._getFocusedRowIdx = function () {
  // focused rows have cells with focused style class. There should only be one focused row
  return this._getRowIdxsForElementsWithStyleClass(
    '.' + Table.CSS_CLASSES._TABLE_DATA_ROW_CLASS +
    '.' + Table.MARKER_STYLE_CLASSES._FOCUS_HIGHLIGHT + ',' +
    '.' + Table.CSS_CLASSES._TABLE_DATA_ROW_CLASS +
    '.' + Table.MARKER_STYLE_CLASSES._FOCUS)[0];
};

/**
 * Get the focused column header index
 * @return {number|null} the column index
 * @private
 */
Table.prototype._getFocusedHeaderColumnIdx = function () {
  // focused column headers have the focused style class. There should only be one focused header
  return this._getColumnIdxsForElementsWithStyleClass(
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS +
    '.' + Table.MARKER_STYLE_CLASSES._FOCUS_HIGHLIGHT + ',' +
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS +
    '.' + Table.MARKER_STYLE_CLASSES._FOCUS + ',' +
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_SELECTOR_CELL_CLASS +
    '.' + Table.MARKER_STYLE_CLASSES._FOCUS_HIGHLIGHT + ',' +
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_SELECTOR_CELL_CLASS +
    '.' + Table.MARKER_STYLE_CLASSES._FOCUS)[0];
};

/**
 * Scroll row into viewport
 * @param {number} rowIdx  row index
 * @private
 */
Table.prototype._scrollRowIntoViewport = function (rowIdx) {
  var tableBodyRow = this._getTableBodyRow(rowIdx);
  var scrollbarHeight = this._getScrollBarHeight();
  var rowRect = tableBodyRow.getBoundingClientRect();
  var scrollingElement = this._getScroller();
  var $scrollingElement = $(scrollingElement);
  var scrollingElementRect = scrollingElement.getBoundingClientRect();

  var topOverflowDiff = scrollingElementRect.top - rowRect.top;
  var hasTopOverflow = topOverflowDiff >= 0;
  var bottomOverflowDiff = (rowRect.bottom - scrollingElementRect.bottom) + scrollbarHeight;
  var hasBottomOverflow = bottomOverflowDiff >= 0;

  // don't adjust scroll position if row has overflow in both directions
  if (hasTopOverflow && hasBottomOverflow) {
    return;
  }
  // if row fits fully in viewport, scroll overflow side into view
  // otherwise, scroll the shortest amount to fill viewport with row
  if (hasBottomOverflow) {
    if (Math.abs(topOverflowDiff) > Math.abs(bottomOverflowDiff)) {
      $scrollingElement.scrollTop($scrollingElement.scrollTop() + bottomOverflowDiff);
    } else {
      $scrollingElement.scrollTop($scrollingElement.scrollTop() - topOverflowDiff);
    }
  } else if (hasTopOverflow) {
    if (Math.abs(bottomOverflowDiff) > Math.abs(topOverflowDiff)) {
      $scrollingElement.scrollTop($scrollingElement.scrollTop() - topOverflowDiff);
    } else {
      $scrollingElement.scrollTop($scrollingElement.scrollTop() + bottomOverflowDiff);
    }
  }
};

/**
 * Scroll column into viewport
 * @param {number} columnIdx  row index
 * @private
 */
Table.prototype._scrollColumnIntoViewport = function (columnIdx) {
  var tableHeaderColumn;
  if (columnIdx === -1) {
    tableHeaderColumn = this._getTableSelectorColumn();
  } else {
    tableHeaderColumn = this._getTableHeaderColumn(columnIdx);
  }

  if (!tableHeaderColumn) {
    return;
  }

  var isRTL = (this._GetReadingDirection() === 'rtl');
  var scrollingElement = this._getScroller();
  var $scrollingElement = $(scrollingElement);
  var scrollbarWidth = this._getScrollBarWidth();
  var headerColumnRect = tableHeaderColumn.getBoundingClientRect();
  var scrollingElementRect = scrollingElement.getBoundingClientRect();

  var leftOverflowDiff;
  var hasLeftOverflow;
  var rightOverflowDiff;
  var hasRightOverflow;

  if (isRTL) {
    leftOverflowDiff = (scrollingElementRect.left - headerColumnRect.left) + scrollbarWidth;
    hasLeftOverflow = leftOverflowDiff >= 0;
    rightOverflowDiff = headerColumnRect.right - scrollingElementRect.right;
    hasRightOverflow = rightOverflowDiff >= 0;
    var browser = oj.AgentUtils.getAgentInfo().browser;
    if (browser === oj.AgentUtils.BROWSER.IE || browser === oj.AgentUtils.BROWSER.EDGE) {
      leftOverflowDiff *= -1;
      rightOverflowDiff *= -1;
    }
  } else {
    leftOverflowDiff = scrollingElementRect.left - headerColumnRect.left;
    hasLeftOverflow = leftOverflowDiff >= 0;
    rightOverflowDiff = (headerColumnRect.right - scrollingElementRect.right) + scrollbarWidth;
    hasRightOverflow = rightOverflowDiff >= 0;
  }

  // don't adjust scroll position if column has overflow in both directions
  if (hasLeftOverflow && hasRightOverflow) {
    return;
  }
  // if column fits fully in viewport, scroll overflow side into view
  // otherwise, scroll the shortest amount to fill viewport with column
  if (hasLeftOverflow) {
    if (Math.abs(rightOverflowDiff) > Math.abs(leftOverflowDiff)) {
      $scrollingElement.scrollLeft($scrollingElement.scrollLeft() - leftOverflowDiff);
    } else {
      $scrollingElement.scrollLeft($scrollingElement.scrollLeft() + rightOverflowDiff);
    }
  } else if (hasRightOverflow) {
    if (Math.abs(leftOverflowDiff) > Math.abs(rightOverflowDiff)) {
      $scrollingElement.scrollLeft($scrollingElement.scrollLeft() + rightOverflowDiff);
    } else {
      $scrollingElement.scrollLeft($scrollingElement.scrollLeft() - leftOverflowDiff);
    }
  }
};

/**
 * Update the current row. If called with null then resets the currentRow.
 * If index/key argument is specified then sets the current row. A beforecurrentrow
 * event is fired before the current row is changed. If that event results in
 * an error then the current row will not be changed.
 * @param {Object} currentRow current row
 * @param {Object} event
 * @param {boolean} optionChange whether it was invoked through an optionChange call
 * @return {string} 'updated' if the current row was successful, 'ignored' if key/index
 *                  cannot be set, 'vetoed' if beforeCurrentItem event is vetoed, 'error'
 *                  if the key/index is invalid or other errors.
 * @throws {Error}
 * @private
 */
Table.prototype._setCurrentRow = function (currentRow, event, optionChange) {
  var existingCurrentRow = this._currentRow;
  var errSummary;
  var errDetail;
  var localRowIndex;
  var updatedCurrentRow;

  var isClearCurrentRow = (currentRow == null ||
    (currentRow.rowKey == null && currentRow.rowIndex == null));
  if (!isClearCurrentRow) {
    var dataprovider = this._getData();
    var rowIndex = currentRow.rowIndex;
    var rowKey = currentRow.rowKey;
    if (rowKey == null) {
      rowKey = this._getRowKeyForDataSourceRowIndex(rowIndex);
    }

    rowIndex = this._getDataSourceRowIndexForRowKey(rowKey);
    localRowIndex = this._getRowIdxForRowKey(rowKey);
    updatedCurrentRow = { rowIndex: rowIndex, rowKey: rowKey };
    if (localRowIndex !== -1 &&
        (!dataprovider || localRowIndex < -1 || localRowIndex === null || rowKey === null)) {
      errSummary = Table._LOGGER_MSG._ERR_CURRENTROW_UNAVAILABLE_INDEX_SUMMARY;
      errDetail = Translations.applyParameters(
        Table._LOGGER_MSG._ERR_CURRENTROW_UNAVAILABLE_INDEX_DETAIL, { rowIdx: localRowIndex });
      if (optionChange) {
        // Only throw an Error if the current row was set through option change
        // so that the caller can be notified of the invalid row.
        throw new Error(errSummary + '\n' + errDetail);
      } else {
        Logger.info(errSummary + '\n' + errDetail);
      }
      // do not update the currentRow
      return Table._CURRENT_ROW_STATUS._IGNORED;
    }
  } else {
    localRowIndex = -1;
    updatedCurrentRow = (currentRow != null) ? currentRow : null;
  }
  var currentFocusedRowIdx = this._getFocusedRowIdx();
  var currentRowChanged = !this._compareCurrentRowValues(existingCurrentRow, updatedCurrentRow);
  if (currentRowChanged) {
    var currentRowUpdateAllowed;
    try {
      currentRowUpdateAllowed = this._trigger('beforeCurrentRow', event, {
        currentRow: updatedCurrentRow,
        previousCurrentRow: existingCurrentRow
      });
    } catch (err) {
      // caught an error. Do not change current row
      errSummary = Table._LOGGER_MSG._ERR_PRECURRENTROW_ERROR_SUMMARY;
      errDetail = Translations.applyParameters(
        Table._LOGGER_MSG._ERR_PRECURRENTROW_ERROR_DETAIL, { error: err.toString() });
      Logger.info(errSummary + '\n' + errDetail);
      // do not update the currentRow to the new value if an exception was caught
      return Table._CURRENT_ROW_STATUS._ERROR;
    }

    if (!currentRowUpdateAllowed) {
      // do not update the currentRow to the new value if a listener returned false
      return Table._CURRENT_ROW_STATUS._VETOED;
    }
    this._currentRow = updatedCurrentRow;

    var isExistingCurrentRowClear = (existingCurrentRow == null ||
      (existingCurrentRow.rowKey == null && existingCurrentRow.rowIndex == null));
    if (!isExistingCurrentRowClear) {
      var existingCurrentRowIndex = existingCurrentRow.rowIndex;
      var existingCurrentRowKey = this._getRowKeyForDataSourceRowIndex(existingCurrentRowIndex);
      var existingCurrentRowIdx = this._getRowIdxForRowKey(existingCurrentRowKey);

      var updateEditable = this._setTableEditable(false, false, 0, true, event);
      if (updateEditable === false) {
        this._currentRow = existingCurrentRow;
        var currentFocusElement = document.activeElement;
        var columnIdx = this._getElementColumnIdx(currentFocusElement);
        this._queueTask(function () {
          var focusRowIdx = existingCurrentRowIdx;
          var focusColumnIdx = columnIdx;
          if (focusRowIdx != null && focusColumnIdx != null) {
            setTimeout(function () { // @HTMLUpdateOK
              this._setCellFocus(focusRowIdx, focusColumnIdx);
            }.bind(this), 0);
          } else if (focusRowIdx != null) {
            setTimeout(function () { // @HTMLUpdateOK
              this._setRowFocus(focusRowIdx, true, false);
            }.bind(this), 0);
          }
        }.bind(this));
        // do not update the currentRow to the new value if updateEditable returned false
        return Table._CURRENT_ROW_STATUS._IGNORED;
      }

      var existingBodyRow = this._getTableBodyRow(existingCurrentRowIdx);
      if (existingBodyRow != null) {
        existingBodyRow.classList.remove(Table.CSS_CLASSES._TABLE_DATA_CURRENT_ROW_CLASS);
      }
    }

    this.option('currentRow', this._currentRow, {
      _context: {
        writeback: true,
        originalEvent: event,
        internalSet: true
      }
    });
    if (!isClearCurrentRow) {
      var tableBodyRow = this._getTableBodyRow(localRowIndex);
      if (tableBodyRow != null) {
        tableBodyRow.classList.add(Table.CSS_CLASSES._TABLE_DATA_CURRENT_ROW_CLASS);
      }
    }
  }
  if ((currentRowChanged || currentFocusedRowIdx !== localRowIndex) && event == null) {
    this._setRowFocus(localRowIndex, true, false);
  }
  return Table._CURRENT_ROW_STATUS._UPDATED;
};

/**
 * Compares two 'currentRow' values and rturns true if they represent the same row.
 * @param {Object} currentRowValue1 The first 'currentRow' value.
 * @param {Bbject} currentRowValue2 The second 'currentRow' value.
 * @private
 */
Table.prototype._compareCurrentRowValues = function (currentRowValue1, currentRowValue2) {
  if (currentRowValue1 === currentRowValue2) {
    return true;
  }
  if (currentRowValue1 != null && currentRowValue2 != null) {
    if (currentRowValue1.rowIndex === currentRowValue2.rowIndex &&
        oj.KeyUtils.equals(currentRowValue1.rowKey, currentRowValue2.rowKey)) {
      return true;
    }
  } else if (currentRowValue1 == null && currentRowValue2 == null) {
    return true;
  }
  return false;
};

/**
 * Set focus on a cell
 * @param {number} rowIdx  row index
 * @param {number} columnIdx  column index
 * @return {boolean} whether setting the cell focus was successful
 * @private
 */
Table.prototype._setCellFocus = function (rowIdx, columnIdx) {
  var tableBodyCell = this._getTableBodyCell(rowIdx, columnIdx);
  if (tableBodyCell) {
    var elements = DataCollectionUtils.getFocusableElementsInNode(tableBodyCell);
    if (elements.length > 0) {
      elements[0].focus();
      return true;
    }
  }
  return false;
};

/**
 * Try setting focus in the cell. If unsuccesful, set focus on the first focusable cell in the row
 * if forwardSearch is true. Else try from the last cell in the row.
 * @param {number} rowIdx  row index
 * @param {number} columnIdx  column index
 * @param {boolean} forwardSearch try setting focus starting at the first column
 * @private
 */
Table.prototype._setCellInRowFocus = function (rowIdx, columnIdx, forwardSearch) {
  if (this._setCellFocus(rowIdx, columnIdx)) {
    return;
  }
  var tableBodyCells = this._getTableBodyCells(rowIdx);
  if (!tableBodyCells) {
    return;
  }

  var tableBodyCellsCount = tableBodyCells.length;
  for (var i = 0; i < tableBodyCellsCount; i++) {
    var tableBodyCellIndex = i;
    if (!forwardSearch) {
      tableBodyCellIndex = tableBodyCellsCount - i - 1;
    }
    if (this._setCellFocus(rowIdx, tableBodyCellIndex)) {
      return;
    }
  }
};

/**
 * Set the focus in handler
 * @param {Function} focusHandler focus in handler
 * @private
 */
Table.prototype._setFocusInHandler = function (focusHandler) {
  this._focusInHandler = focusHandler;
};

/**
 * Set the focus out handler
 * @param {Function} focusHandler focus out handler
 * @private
 */
Table.prototype._setFocusOutHandler = function (focusHandler) {
  this._focusOutHandler = focusHandler;
};

/**
 * Set focus on row
 * @param {number} rowIdx  row index
 * @param {boolean} focused  whether it's focused
 * @param {boolean} updateCurrentRow  whether to update the currentRow
 * @param {Element} element  DOM element which triggered the row focus
 * @param {Object} event
 * @return {boolean} whether setting the row focus was successful
 * @private
 */
Table.prototype._setRowFocus = function (rowIdx, focused, updateCurrentRow, element, event) {
  var focusedRowIdx;
  var updateRowFocus;

  if (rowIdx === -1) {
    if (updateCurrentRow) {
      updateRowFocus = this._setCurrentRow(null, event, false);
      if (updateRowFocus !== Table._CURRENT_ROW_STATUS._UPDATED) {
        return false;
      }
    }
    focusedRowIdx = this._getFocusedRowIdx();
    if (focusedRowIdx != null) {
      this._setRowFocus(focusedRowIdx, false, updateCurrentRow, null, null);
    }
    return true;
  }
  var tableBodyRow = this._getTableBodyRow(rowIdx);
  if (!tableBodyRow) {
    return false;
  }

  if (focused) {
    if (updateCurrentRow) {
      var rowKey = this._getRowKeyForRowIdx(rowIdx);
      updateRowFocus = this._setCurrentRow({ rowKey: rowKey }, event, false);
      if (updateRowFocus !== Table._CURRENT_ROW_STATUS._UPDATED) {
        return false;
      }
      if (this._accColumnIndex == null) {
        this._accColumnIndex = 0;
      }
      this._updateAccStatusInfo(rowIdx, this._accColumnIndex);
    }
    focusedRowIdx = this._getFocusedRowIdx();
    if (focusedRowIdx != null && focusedRowIdx !== rowIdx) {
      this._setRowFocus(focusedRowIdx, false, updateCurrentRow, element, null);
    }
    this._focusInHandler($(tableBodyRow));
    this._scrollRowIntoViewport(rowIdx);
    // apply focused style classes
    this._updateRowStateCellsClass(rowIdx, { focused: true });
    // clear any focused column header
    this._clearFocusedHeaderColumn();
    // unset table actionable mode
    this._setTableActionableMode(false);
  } else {
    this._focusOutHandler($(tableBodyRow));
    // update focus style for the cells
    this._updateRowStateCellsClass(rowIdx, { focused: false });
  }
  return true;
};

/**
 * Set focus on column header
 * @param {number} columnIdx  column index
 * @param {boolean} focused  whether it's focused
 * @private
 */
Table.prototype._setHeaderColumnFocus = function (columnIdx, focused, skipScrollColumn) {
  if (columnIdx != null) {
    if (focused) {
      // clear focused row
      this._clearFocusedRow(true);
      var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
      if (focusedHeaderColumnIdx !== null && focusedHeaderColumnIdx !== columnIdx) {
        this._setHeaderColumnFocus(focusedHeaderColumnIdx, false, skipScrollColumn);
      }
      // scroll column into view
      if (!skipScrollColumn) {
        this._scrollColumnIntoViewport(columnIdx);
      }
      this._activeColumnIndex = columnIdx;
      this._updateAccStatusInfo(-1, columnIdx);
    }
    this._setHeaderColumnState(columnIdx, { focused: focused });
  }
};

/**
 * Set the state of the column header. e.g., focused, selected, etc.
 * @param {number} columnIdx  column index
 * @param {Object} state  Object which contains whether it's focused or selected
 * @private
 */
Table.prototype._setHeaderColumnState = function (columnIdx, state) {
  var headerColumn;
  if (columnIdx === -1) {
    headerColumn = this._getTableSelectorColumn();
  } else {
    headerColumn = this._getTableHeaderColumn(columnIdx);
  }

  if (headerColumn) {
    this._applyHeaderColumnState(headerColumn, columnIdx, state);
  }
};

/**
 * Set the state of the column header. e.g., focused, selected, etc.
 * @param {Element} headerColumn column DOM element
 * @param {number} columnIdx  column index
 * @param {Object} state  Object which contains whether it's focused or selected
 * @private
 */
Table.prototype._applyHeaderColumnState = function (headerColumn, columnIdx, state) {
  var focused = state.focused;
  var selected = state.selected;

  if (selected != null) {
    var headerColumnSelected = headerColumn.classList.contains(
      Table.MARKER_STYLE_CLASSES._SELECTED);

    if (headerColumnSelected !== selected) {
      if (!selected) {
        headerColumn.classList.remove(Table.MARKER_STYLE_CLASSES._SELECTED);
      } else {
        headerColumn.classList.add(Table.MARKER_STYLE_CLASSES._SELECTED);
      }
    }
  }
  // todo: can we optimize so that we don't look up the header element all the time with index?
  if (focused != null) {
    if (!focused) {
      this._focusOutHandler($(headerColumn));
      if (columnIdx > -1) {
        this._hideTableHeaderColumnSortIcon(columnIdx);
      }
    } else {
      this._focusInHandler($(headerColumn));
      if (columnIdx > -1) {
        this._showTableHeaderColumnSortIcon(columnIdx);
      }
    }
  }
  if (columnIdx > -1) {
    this._updateHeaderColumnStateCellsClass(columnIdx);
  }
};

/**
 * Update the css class from all the cells in a column according to column state
 * @param {number} columnIdx  column index
 * @param {boolean} blur  true or false
 * @private
 */
Table.prototype._updateHeaderColumnStateCellsClass = function (columnIdx) {
  var selected = this._getHeaderColumnSelection(columnIdx);
  var selectedRowIdxs = this._getSelectedRowIdxs();
  var tableBodyRows = this._getTableBodyRows();
  for (var i = 0; i < tableBodyRows.length; i++) {
    var tableBodyCell = this._getTableBodyCell(i, columnIdx);
    if (tableBodyCell) {
      if (!selected) {
        var rowSelected = false;
        var selectedRowIdxsCount = selectedRowIdxs.length;
        for (var j = 0; j < selectedRowIdxsCount; j++) {
          if (i === selectedRowIdxs[j]) {
            rowSelected = true;
            break;
          }
        }
        if (!rowSelected) {
          tableBodyCell.classList.remove(Table.MARKER_STYLE_CLASSES._SELECTED);
        }
      } else {
        tableBodyCell.classList.add(Table.MARKER_STYLE_CLASSES._SELECTED);
      }
    }
  }
};

/**
 * Update the css class from all the cells in a row according to row state
 * @param {number} rowIdx  row index
 * @param {Object} state  row state
 * @param {boolean} blur  true or false
 * @private
 */
Table.prototype._updateRowStateCellsClass = function (rowIdx, state) {
  var tableBodyCells = this._getTableBodyCells(rowIdx);
  if (!tableBodyCells) {
    return;
  }
  if (this._isDefaultSelectorEnabled()) {
    var tableBodyRow = this._getTableBodyRow(rowIdx);
    var selectorCell = this._getTableBodySelectorCell(tableBodyRow);
    tableBodyCells.unshift(selectorCell);
  }

  var i;
  var focused = state.focused;
  var selected = state.selected;
  var hover = state.hover;
  var tableBodyCellsCount = tableBodyCells.length;
  if (hover != null) {
    for (i = 0; i < tableBodyCellsCount; i++) {
      if (!hover) {
        tableBodyCells[i].classList.remove(Table.MARKER_STYLE_CLASSES._HOVER);
      } else {
        tableBodyCells[i].classList.add(Table.MARKER_STYLE_CLASSES._HOVER);
      }
    }
  }
  if (focused != null) {
    for (i = 0; i < tableBodyCellsCount; i++) {
      if (!focused) {
        this._focusOutHandler($(tableBodyCells[i]));
      } else {
        this._focusInHandler($(tableBodyCells[i]));
      }
    }
  }
  if (selected != null) {
    for (i = 0; i < tableBodyCellsCount; i++) {
      if (!selected) {
        tableBodyCells[i].classList.remove(Table.MARKER_STYLE_CLASSES._SELECTED);
      } else {
        tableBodyCells[i].classList.add(Table.MARKER_STYLE_CLASSES._SELECTED);
      }
    }
  }
};

/**
 * Adjust scrollPosition such that it will scroll to the selection anchor (last selected row)
 * @private
 */
Table.prototype._adjustScrollPositionOnRefresh = function () {
  var scrollPosition = this.options.scrollPosition == null ?
    {} : this.options.scrollPosition;

  if (isNaN(scrollPosition.rowIndex) || scrollPosition.rowKey === undefined) {
    // still adjusting, which could happen because a REQUEST event from TableDataSource
    // results in a Refresh event fired
    return;
  }

  var selectedRowIdxs = this._getSelectedRowIdxs();
  if (selectedRowIdxs != null && selectedRowIdxs.length > 0 && this._isRowSelectionEnabled()) {
    if (!isNaN(this._selectionAnchorIdx) &&
      selectedRowIdxs.indexOf(this._selectionAnchorIdx) > -1) {
      scrollPosition.rowKey = this._getRowKeyForRowIdx(this._selectionAnchorIdx);
    } else {
      // selection is programmatically set
      scrollPosition.rowKey = this._getRowKeyForRowIdx(selectedRowIdxs[0]);
    }
    // row index gets re-computed after refresh
    delete scrollPosition.rowIndex;
  } else {
    // remain at the top
    scrollPosition.y = 0;
    scrollPosition.rowIndex = 0;
    // row key gets re-computed after refresh
    delete scrollPosition.rowKey;
  }

  scrollPosition.x = 0;
  scrollPosition.columnKey = null;
  scrollPosition.columnIndex = 0;
  scrollPosition.offsetX = 0;
  scrollPosition.offsetY = 0;

  // explicitly set changed to false so option change will not be triggered, syncScrollPosition
  // after invoked after rendering will complete the scrollPosition values and fire the option
  // change event
  this.option('scrollPosition', scrollPosition, {
    _context: {
      internalSet: true
    },
    changed: false
  });
};

/**
 * Whether the scrollPosition has been adjusted before data is refresh
 * @private
 */
Table.prototype._isScrollPositionAdjusted = function () {
  var scrollPosition = this.options.scrollPosition;
  if (scrollPosition == null) {
    return false;
  }
  return (scrollPosition.rowIndex === undefined && scrollPosition.rowKey != null);
};

/**
 * Find the row element by the row key
 * @private
 */
Table.prototype._findRowElementByKey = function (rowKey) {
  var tableBodyRows = this._getTableBodyRows();
  for (var i = 0; i < tableBodyRows.length; i++) {
    if (oj.KeyUtils.equals($(tableBodyRows[i]).data('rowKey'), rowKey)) {
      return tableBodyRows[i];
    }
  }
  return null;
};

/**
 * Validate a set of keys
 * @return {Promise|null} a Promise that resolves to true if one of the keys specified is valid, false otherwise.
 *                        Returns null if it cannot validate the keys.
 * @private
 */
Table.prototype._validateKeys = function (keys) {
  for (var i = 0; i < keys.length; i++) {
    // found one of the keys in cache, we are done
    if (this._findRowElementByKey(keys[i]) != null) {
      return Promise.resolve(true);
    }
  }

  // need to verify key if we have a DataProvider that supports containsKeys
  var dataProvider = this._getData();
  if (dataProvider && dataProvider.containsKeys) {
    return new Promise(function (resolve) {
      dataProvider.containsKeys({ keys: new Set(keys) }).then(function (value) {
        resolve(value.results.size > 0);
      }, function () {
        resolve(false);
      });
    });
  }
  // else we can't verify, so just return null and let syncScrollPosition try to fetch and find the row
  return null;
};

/**
 * Synchronize value of scrollPosition attribute with the actual table body scroll position
 * @param {object} position the value of scrollPosition attribute
 * @param {boolean=} skipKeyValidation whether to skip row key validation in position.
 * @return {boolean} true if the scroll position syncing is completed.
 *                   false if the scroll syncing is pending an asynchronous callback.
 * @private
 */
Table.prototype._syncScrollPosition = function (position, skipKeyValidation) {
  // only supported in custom element.  Check whether it's scrollable
  if (!this._IsCustomElement() || this._noDataMessageShown ||
    (!this._isScrollableX() && !this._isScrollableY())) {
    return true;
  }

  if (this._scrollPosition != null) {
    // eslint-disable-next-line no-param-reassign
    position = this._scrollPosition;
  } else if (position === undefined) {
    // eslint-disable-next-line no-param-reassign
    position = this.options.scrollPosition;
  }

  if (!skipKeyValidation && position.rowKey != null) {
    var promise = this._validateKeys([position.rowKey]);
    if (promise) {
      // set scroll position rowKey validation busy state
      var keyValidationResolveFunc = this._createComponentBusyState('is validating scroll position rowKey.');
      promise.then(function (valid) {
        if (!valid) {
          // remove invalid or non-existing key
          // eslint-disable-next-line no-param-reassign
          delete position.rowKey;
        }
        // clear scroll position rowKey validation busy state
        this._clearComponentBusyState(keyValidationResolveFunc);
        // try again
        this._syncScrollPosition(position, true);
      }.bind(this));

      return false;
    }
  }

  // figure out what the final y should be
  var coord = this._getScrollCoordinates(position);
  var x = coord.x;
  var y = coord.y;

  if (isNaN(x) && isNaN(y)) {
    // invalid scroll position
    if (this._scrollPosition != null) {
      // we'll still need to report current scroll position, which could have changed because of scroll and fetch
      this.option('scrollPosition', this._getCurrentScrollPosition(), {
        _context: {
          originalEvent: null,
          internalSet: true
        }
      });
      this._scrollPosition = null;
    }
    this._editRowCallback = null;
    return true;
  }

  var scrollTop = isNaN(this._scrollTop) ? 0 : this._scrollTop;
  var scrollLeft = isNaN(this._scrollLeft) ? 0 : this._scrollLeft;

  // check if only x updated
  if ((!isNaN(x) && isNaN(y)) ||
      (!isNaN(x) && y === scrollTop && x !== scrollLeft)) {
    if (!this._isScrollableX()) {
      return true;
    }

    this._setScrollX(x);
    var scrollPosition = this.options.scrollPosition;
    var newScrollPosition = this._getCurrentHorizontalScrollPosition(x);
    newScrollPosition.y = scrollPosition.y;
    newScrollPosition.rowIndex = scrollPosition.rowIndex;
    newScrollPosition.rowKey = scrollPosition.rowKey;
    newScrollPosition.offsetY = scrollPosition.offsetY;

    this.option('scrollPosition', newScrollPosition, {
      _context: {
        originalEvent: null,
        internalSet: true
      }
    });
  } else if (y !== scrollTop) {
    if (!this._isScrollableY()) {
      // if x has changed, remove y and try again
      if (!isNaN(x) && x !== scrollLeft) {
        // eslint-disable-next-line no-param-reassign
        delete position.y;
        return this._syncScrollPosition(position, skipKeyValidation);
      }
      return true;
    }

    // flag it so that handleScroll won't do anything
    var handlingScrollY = this._setScrollY(y);
    if (!isNaN(x) && x !== scrollLeft) {
      this._setScrollX(x);
    }

    // check if further scrolling is needed
    if (y === -1) {
      // yes, save the scrollPosition to set and bail
      // syncScrollPosition will be invoked again once fetch is done
      this._scrollPosition = position;
      return handlingScrollY;
    }

    // ok to update scrollPosition option
    this.option('scrollPosition', this._getCurrentScrollPosition(x, y), {
      _context: {
        originalEvent: null,
        internalSet: true
      }
    });
  } else if (position && (position.rowKey == null || isNaN(position.rowIndex))) {
    // if x and y is present, but position value is not complete, get it
    // ok to update scrollPosition option
    this.option('scrollPosition', this._getCurrentScrollPosition(x, y), {
      _context: {
        originalEvent: null,
        internalSet: true
      }
    });
  }

  if (this._scrollPosition != null) {
    this._scrollPosition = null;
  }
  if (this._editRowCallback) {
    // if need to set edit row after fetch
    this._editRowCallback();
    this._editRowCallback = null;
  }
  return true;
};

/**
 * Whether table can scroll horizontally
 * @private
 */
Table.prototype._isScrollableX = function () {
  return Math.abs(this._getScrollWidth() - this._getClientWidth()) > 1;
};

/**
 * Whether table can scroll vertically
 * @private
 */
Table.prototype._isScrollableY = function () {
  return Math.abs(this._getScrollHeight() - this._getClientHeight()) > 1;
};

/**
 * @private
 */
Table.prototype._getScrollWidth = function () {
  if (this._scrollWidth == null) {
    this._scrollWidth = this._getScroller().scrollWidth;
  }
  return this._scrollWidth;
};

/**
 * @private
 */
Table.prototype._getScrollHeight = function () {
  if (this._scrollHeight == null) {
    this._scrollHeight = this._getScroller().scrollHeight;
  }
  return this._scrollHeight;
};

/**
 * @private
 */
Table.prototype._getClientWidth = function () {
  if (this._clientWidth == null) {
    this._clientWidth = this._getScroller().clientWidth;
  }
  return this._clientWidth;
};

/**
 * @private
 */
Table.prototype._getClientHeight = function () {
  if (this._clientHeight == null) {
    this._clientHeight = this._getScroller().clientHeight;
  }
  return this._clientHeight;
};

/**
 * @private
 */
Table.prototype._setScrollX = function (x) {
  var scroller = this._getScroller();

  // flag it so that handleScroll won't do anything
  this._skipScrollUpdate = true;

  oj.DomUtils.setScrollLeft(scroller, x);
};

/**
 * @return {boolean} true if this led to a change in scroller scrollTop position
 *                   false otherwise
 * @private
 */
Table.prototype._setScrollY = function (y) {
  var scroller = this._getScroller();

  // flag it so that handleScroll won't do anything
  this._skipScrollUpdate = true;
  var initialScrollTop = scroller.scrollTop;
  scroller.scrollTop = y === -1 ? this._getScrollHeight() - this._getClientHeight() : y;

  // only set scroll pos busy state if a scroll was triggered
  if (initialScrollTop !== scroller.scrollTop) {
    this._setScrollPosBusyState();
    return true;
  }
  return false;
};

/**
 * Retrieve the scroll top value based on row index
 * @return {number|undefined} the scroll top of the row with the specified index,
 *         or -1 if the row is not yet fetched, or undefined if the index is invalid
 * @private
 */
Table.prototype._getScrollTopByIndex = function (rowIndex) {
  // avoid doing offsetTop
  if (rowIndex === 0) {
    return 0;
  }
  // check to ensure max count is not reached
  if (this._isLoadMoreOnScroll() && rowIndex > this.options.scrollPolicyOptions.maxCount) {
    return undefined;
  }
  var tableBodyRows = this._getTableBodyRows();
  var elem = tableBodyRows[rowIndex];
  if (elem != null) {
    return elem.offsetTop;
  }
  // we got here because one of the following happened:
  // 1) item has not been fetched yet
  // 2) index is large than the number of items, including reaching maxCount
  if (this._hasMoreToFetch()) {
    return -1;
  }
  return undefined;
};

/**
 * Retrieve the scroll top value based on row key
 * @return {number|undefined} the scroll top of the row with the specified key,
 *         or -1 if the row is not yet fetched, or undefined if the key is invalid
 * @private
 */
Table.prototype._getScrollTopByKey = function (rowKey) {
  var row = this._findRowElementByKey(rowKey);
  if (row != null) {
    var rows = this._getTableBodyRows();
    if (rows.length > 0) {
      return Math.max(0, row.offsetTop - rows[0].offsetTop);
    }
    // should not happen
    return undefined;
  }
  // we got here because one of the following happened:
  // 1) item has not been fetched yet
  // 2) key does not exists or invalid
  if (this._hasMoreToFetch()) {
    return -1;
  }
  return undefined;
};

/**
 * @private
 */
Table.prototype._getScrollLeftByIndex = function (columnIndex) {
  if (columnIndex === 0) {
    return 0;
  }
  var tableHeaderColumn = this._getTableHeaderColumn(columnIndex);
  if (tableHeaderColumn != null) {
    return tableHeaderColumn.offsetLeft;
  }
  // invalid column index
  return undefined;
};

/**
 * @private
 */
Table.prototype._getScrollLeftByKey = function (columnKey) {
  var index = this._getColumnIdxForColumnKey(columnKey);
  return this._getScrollLeftByIndex(index);
};

/**
 * Determine the scroll x and y based on value of scrollPosition
 * @return {object} contains x and y which is the horizontal and vertical scroll
 *         position.  If x/y is undefined, that implies the value is invalid.  If
 *         x/y is -1, that implies there are more data to fetch so the value is
 *         not final.
 * @private
 */
Table.prototype._getScrollCoordinates = function (scrollPosition) {
  var y;
  var x;

  // key first
  var rowKey = scrollPosition.rowKey;
  if (isNaN(y) && rowKey != null) {
    y = this._getScrollTopByKey(rowKey);
  }
  var columnKey = scrollPosition.columnKey;
  if (isNaN(x) && columnKey != null) {
    x = this._getScrollLeftByKey(columnKey);
  }

  // then index
  var rowIndex = scrollPosition.rowIndex;
  if (isNaN(y) && !isNaN(rowIndex)) {
    y = this._getScrollTopByIndex(rowIndex);
  }
  var columnIndex = scrollPosition.columnIndex;
  if (isNaN(x) && !isNaN(columnIndex)) {
    x = this._getScrollLeftByIndex(columnIndex);
  }

  // apply offset
  var offsetX = scrollPosition.offsetX;
  if (!isNaN(x) && !isNaN(offsetX) && x >= 0) {
    x += offsetX;
  }
  var offsetY = scrollPosition.offsetY;
  if (!isNaN(y) && !isNaN(offsetY) && y >= 0) {
    y += offsetY;
  }

  // then pixel position last
  if (isNaN(x) && !isNaN(scrollPosition.x)) {
    x = Math.max(0, scrollPosition.x);
  }
  if (isNaN(y) && !isNaN(scrollPosition.y)) {
    if (scrollPosition.y > this._getScrollHeight()) {
      // if there's more data to fetch, returns -1, otherwise returns the max scrollTop
      y = this._hasMoreToFetch() ? -1 : this._getScrollHeight() - this._getClientHeight();
    } else {
      y = Math.max(0, scrollPosition.y);
    }
  }
  return { x: x, y: y };
};

Table.prototype._getCurrentHorizontalScrollPosition = function (scrollLeft) {
  var scrollPosition = {};
  scrollPosition.x = scrollLeft === undefined ? this._scrollLeft : scrollLeft;
  var prevScrollPosition = this.option('scrollPosition');
  var diff = Math.abs(prevScrollPosition.x - scrollPosition.x);
  if (diff < 1 && prevScrollPosition.columnKey != null && !isNaN(prevScrollPosition.columnIndex)) {
    scrollPosition.columnKey = prevScrollPosition.columnKey;
    scrollPosition.columnIndex = prevScrollPosition.columnIndex;
    scrollPosition.offsetX = prevScrollPosition.offsetX + diff;
    return scrollPosition;
  }

  // loop through the cached header values
  var columnLocations = this._getColumnLocations();
  if (columnLocations && columnLocations.length > 0) {
    var i;
    var index = columnLocations.length - 1;
    for (i = 0; i < columnLocations.length - 1; i++) {
      if (scrollPosition.x >= columnLocations[i] && scrollPosition.x < columnLocations[i + 1]) {
        index = i;
        break;
      }
    }
    scrollPosition.columnKey = this._getColumnDefs()[index].id;
    scrollPosition.columnIndex = index;
    scrollPosition.offsetX = scrollPosition.x - columnLocations[index];
  }
  return scrollPosition;
};

Table.prototype._getCurrentVerticalScrollPosition = function (scrollTop) {
  var scrollPosition = {};
  scrollPosition.y = scrollTop === undefined ? this._scrollTop : scrollTop;

  // precheck for row Height in case it wasn't set earlier.
  var tableBody = this._getTableBody();
  if (isNaN(this._rowHeight) && tableBody.rows.length > 1) {
    this._rowHeight = tableBody.rows[1].offsetHeight;
  }

  // we used the row height to approximate where to begin the search
  // for the top most item.  This var should be populated in renderComplete
  // if there's no data then we should skip
  if (!isNaN(this._rowHeight) && this._rowHeight > 0) {
    var result = this._findClosestElementToTop(scrollPosition, scrollTop);
    if (result != null) {
      scrollPosition.rowIndex = result.index;
      scrollPosition.rowKey = this._getRowKeyForRowIdx(result.index);
      scrollPosition.offsetY = result.offset;
    }
  }
  return scrollPosition;
};

/**
  * Calculate the scrollPosition based on scrollLeft and scrollTop
  * @private
  */
Table.prototype._getCurrentScrollPosition = function (scrollLeft, scrollTop) {
  var scrollPosition = this._getCurrentHorizontalScrollPosition(scrollLeft);
  var scrollPositionY = this._getCurrentVerticalScrollPosition(scrollTop);
  Object.keys(scrollPositionY).forEach(function (prop) {
    scrollPosition[prop] = scrollPositionY[prop];
  });
  return scrollPosition;
};

/**
  * Retrieve the location in pixels of each column and cache it
  * @private
  */
Table.prototype._getColumnLocations = function () {
  if (this._columnOffsets == null) {
    this._columnOffsets = [];
    var headerColumns = this._getTableHeaderColumns();
    if (headerColumns && headerColumns.length > 0) {
      // depending on browser, offsetLeft of first column might not be 0
      var firstColumnOffset = 0;
      firstColumnOffset = headerColumns[0].offsetLeft;
      this._columnOffsets.push(0);
      for (var i = 1; i < headerColumns.length; i++) {
        this._columnOffsets.push(headerColumns[i].offsetLeft - firstColumnOffset);
      }
    }
  }
  return this._columnOffsets;
};

/**
  * Find the element closest to the top of the viewport
  * @param {object} scrollPosition the current scrollPosition
  * @param {number} currScrollTop the current scrolltop
  * @private
  */
Table.prototype._findClosestElementToTop = function (scrollPosition, currScrollTop) {
  var rows = this._getTableBodyRows();
  if (rows.length === 0) {
    return null;
  }

  // if the previous scroll position is relatively close to the current one
  // we'll use the previous index as the starting point
  var index;
  var prevScrollPosition = this.option('scrollPosition');
  if (Math.abs(prevScrollPosition.y - currScrollTop) < this._rowHeight &&
      prevScrollPosition.rowKey != null && !isNaN(prevScrollPosition.rowIndex)) {
    index = prevScrollPosition.rowIndex;
  }
  // otherwise we'll need to approximate the index
  if (isNaN(index)) {
    index = Math.floor(scrollPosition.y / this._rowHeight);
  }
  // ensure estimated index is valid
  index = Math.min(Math.max(index, 0), rows.length - 1);

  var offsetTop;
  var elem = rows[index];
  if (index === 0) {
    offsetTop = 0;
  } else {
    offsetTop = elem.offsetTop - rows[0].offsetTop;
  }
  var scrollTop = scrollPosition.y;
  var diff = scrollTop - offsetTop;
  var result = { index: index, elem: elem, offsetTop: offsetTop, offset: diff };

  // scroll position perfectly line up with the top of item (take sub-pixels into account), we are done
  if (Math.abs(diff) < 1) {
    return result;
  }

  // go forward or backward to find the row, keep that fix to avoid
  // potentially going back and forth (shouldn't happen)
  var forward = diff > 0;
  if (forward) {
    index += 1;
  } else {
    index -= 1;
  }

  var found = false;
  while (!found && index >= 0 && index < rows.length) {
    var prevOffsetTop = offsetTop;
    elem = rows[index];
    offsetTop = elem.offsetTop;
    diff = Math.abs(scrollTop - offsetTop);

    found = (diff < 1) || (forward ? scrollTop <= offsetTop : scrollTop >= offsetTop);
    if (found) {
      // perfect match (diff < 1 due to subpixel) or if we are walking backwards
      if (diff < 1 || !forward) {
        result = { index: index, elem: elem, offsetTop: offsetTop, offset: diff };
      } else {
        // going forward, use the previous one
        result = { index: index - 1,
          elem: rows[index - 1],
          offsetTop: prevOffsetTop,
          offset: scrollTop - prevOffsetTop };
      }
      break;
    }
    if (forward) {
      index += 1;
    } else {
      index -= 1;
    }
  }
  return result;
};

/**
 * Handle scrollLeft on scroller
 * @private
 */
Table.prototype._handleScrollerScrollLeft = function (scrollLeft) {
  this._scrollLeft = scrollLeft;
  var tableHeaderRow = this._getTableHeaderRow();
  if (tableHeaderRow) {
    oj.DomUtils.setScrollLeft(tableHeaderRow.parentNode, scrollLeft);
  }
  var tableFooterRow = this._getTableFooterRow();
  if (tableFooterRow) {
    oj.DomUtils.setScrollLeft(tableFooterRow.parentNode, scrollLeft);
  }
};

/**
 * Handle scrollTop on scroller
 * @private
 */
Table.prototype._handleScrollerScrollTop = function (scrollTop) {
  // if no domScroller is set, make sure scroll pos busy state is cleared here
  if (!this._domScroller) {
    this._clearScrollPosBusyState();
  }
  if (scrollTop < 0) {
    // eslint-disable-next-line no-param-reassign
    scrollTop = 0;
  }
  this._scrollTop = scrollTop;
  // keep track when scrollTop is triggered internally (syncScrollPosition)
  this._scrollY = this._skipScrollUpdate ? scrollTop : null;

  // update mobile touch selection affordance if present
  this._moveTableBodyRowTouchSelectionAffordanceTop();
  this._moveTableBodyRowTouchSelectionAffordanceBottom();
};

/**
 * Register event listeners which need to be registered directly on the DOM element.
 * @private
 */
Table.prototype._registerDomEventListeners = function () {
  var scroller = this._getScroller();
  if (scroller != null) {
    // if width or height is defined then we can have scrollbars so register scroll event listeners
    if (this._scrollEventListener == null) {
      this._scrollEventListener = (function (event) {
        var newScrollLeft = this._getScrollLeft(event.target);
        var newScrollTop = event.target.scrollTop;
        if (newScrollLeft === this._scrollLeft && newScrollTop === this._scrollTop) {
          // discard bogus scroll event
          return;
        }

        this._handleScrollerScrollLeft(newScrollLeft);
        this._handleScrollerScrollTop(newScrollTop);

        // do not update scrollPosition if we are already adjusting
        if (this._isScrollPositionAdjusted()) {
          return;
        }

        if (!this._skipScrollUpdate && !this._ticking) {
          window.requestAnimationFrame(function () {
            // scrollPosition could have been adjusted or a new value is set while waiting for animation frame
            if (!this._isScrollPositionAdjusted() && !this._skipScrollUpdate) {
              this.option('scrollPosition', this._getCurrentScrollPosition(), {
                _context: {
                  originalEvent: event,
                  internalSet: true
                }
              });
            }
            this._ticking = false;
          }.bind(this));
          this._ticking = true;
        }
        this._skipScrollUpdate = false;
      }.bind(this));
    }
    // remove the event listener before adding to make sure only one is active at a time
    scroller.removeEventListener('scroll', this._scrollEventListener);
    scroller.addEventListener('scroll', this._scrollEventListener, false);
  }

  // although header region does not contain scrollbars, browser may auto-scroll when contents gain focus
  var tableHeaderRow = this._getTableHeaderRow();
  if (tableHeaderRow != null) {
    var tableHeader = tableHeaderRow.parentNode;
    if (this._headerScrollEventListener == null) {
      this._headerScrollEventListener = (function (event) {
        var scrollLeft = this._getScrollLeft(event.target);
        if (this._scrollLeft !== scrollLeft) {
          this._setScrollX(scrollLeft);
        }
      }.bind(this));
    }
    // remove the event listener before adding to make sure only one is active at a time
    tableHeader.removeEventListener('scroll', this._headerScrollEventListener);
    tableHeader.addEventListener('scroll', this._headerScrollEventListener, false);
  }
};

/**
 * Return whether the component is in table actionable mode
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isTableActionableMode = function () {
  return this._tableActionableMode;
};

/**
 * Returns whether the table is editabe mode
 * @return {boolean} true or false
 * @private
 */
Table.prototype._isTableEditMode = function () {
  var editMode = this.options.editMode;
  return (editMode === Table._OPTION_EDIT_MODE._ROW_EDIT);
};

/**
 * Toggles table actionable mode
 * @private
 */
Table.prototype._toggleTableActionableMode = function () {
  if (this._isTableActionableMode()) {
    this._setTableActionableMode(false);
  } else {
    this._setTableActionableMode(true);
  }
};

/**
 * Set whether the component is in table actionable mode
 * @param {boolean} value true or false
 * @param {boolean=} skipFocusReset whether to skip resetting focus on the table
 * @private
 */
Table.prototype._setTableActionableMode = function (value, skipFocusReset) {
  // don't do anything if actionable mode was not updated
  if ((this._tableActionableMode != null && this._tableActionableMode === value) ||
      (this._tableActionableMode == null && value === false)) {
    return;
  }

  if (value) {
    var focusedElement = null;
    var focusedBoundaryElement = null;
    var focusedRowIdx = this._getFocusedRowIdx();
    if (focusedRowIdx != null) {
      focusedElement = this._getTableBodyRow(focusedRowIdx);
      focusedBoundaryElement = focusedElement;
    }
    if (focusedElement == null) {
      var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
      if (focusedHeaderColumnIdx != null) {
        focusedElement = this._getTableHeaderColumn(focusedHeaderColumnIdx);
        focusedBoundaryElement = this._getTableHeaderRow();
      }
    }
    if (focusedElement != null) {
      // enable all focusable elements
      DataCollectionUtils.enableAllFocusableElements(focusedBoundaryElement);
      var tabbableElementsInFocusedElement = this._getTabbableElements(focusedElement);
      // only set actionable mode if there are any tabbable elements in the row
      if (tabbableElementsInFocusedElement != null &&
          tabbableElementsInFocusedElement.length > 0) {
        this._tableActionableMode = value;
        this._tableActionableElement = focusedElement;
        this._tableActionableBoundaryElement = focusedBoundaryElement;
        this._focusOutHandler($(focusedElement));
        // set focus on the first tabbable element
        tabbableElementsInFocusedElement[0].focus();
      }
    }
  } else {
    this._tableActionableMode = false;
    var resetFocus = $.contains(this._getTableBody(), document.activeElement);
    // disable all focusable elements
    if (this._tableActionableElement != null) {
      DataCollectionUtils.disableAllFocusableElements(this._tableActionableBoundaryElement);
    }
    if (resetFocus && !skipFocusReset) {
      this._getTable().focus();
      this._focusInHandler($(this._tableActionableElement));
    }
    this._tableActionableElement = null;
    this._tableActionableBoundaryElement = null;
  }
};

/**
 * Return the editable row index if there is one
 * @return {number|null} row index
 * @private
 */
Table.prototype._getEditableRowIdx = function () {
  if (this._getEditableRowKey() != null) {
    var rowIdx = this._getRowIdxForRowKey(this._getEditableRowKey());
    if (rowIdx !== null) {
      return rowIdx;
    }
  }
  return this._editableRowIdx;
};

/**
 * Return the editable row key if there is one
 * @return {Object|null} row key
 * @private
 */
Table.prototype._getEditableRowKey = function () {
  return this._editableRowKey;
};

/**
 * Return whether the table currently has an editable row
 * @return {boolean} true or false
 * @private
 */
Table.prototype._hasEditableRow = function () {
  if (!this._isTableEditMode()) {
    return false;
  }
  return this._getEditableRowIdx() !== null;
};

/**
 * Sets a row to be editable
 * @private
 */
Table.prototype._setEditRow = function (editRow) {
  if (!this._isTableEditMode()) {
    return;
  }
  var rowKey = editRow.rowKey;
  var rowIndex = editRow.rowIndex;
  if (rowKey != null || rowIndex > -1) {
    // an editable row has to be current also
    var changed = this._setCurrentRow({ rowKey: rowKey, rowIndex: rowIndex }, null, false);
    if (changed === Table._CURRENT_ROW_STATUS._UPDATED) {
      this._setTableEditable(true, false, 0, true, null);
    } else if (changed === Table._CURRENT_ROW_STATUS._IGNORED) {
      // try to scroll to it
      var _scrollTop = this._scrollTop;
      if (!this._syncScrollPosition({ rowKey: rowKey, rowIndex: rowIndex })) {
        // this will be invoked after scroll and fetch is done
        this._editRowCallback = function () {
          // try again after scroll and fetch
          if (this._scrollTop !== _scrollTop) {
            this._setEditRow(editRow);
          }
        }.bind(this);
      }
    }
  } else {
    this._setTableEditable(false, false, 0, true, null);
  }
};

/**
 * Set the editable row index
 * @param {number} rowIdx  row index
 * @private
 */
Table.prototype._setEditableRowIdx = function (rowIdx) {
  // store the rowKey so we can restore easily after sort
  this._editableRowKey = this._getRowKeyForRowIdx(rowIdx);
  this._editableRowIdx = rowIdx;
};

/**
 * Set the next row to editable
 * @param {number} columnIdx  column index
 * @param {Object} event
 * @throws {Error}
 * @private
 */
Table.prototype._setNextRowEditable = function (columnIdx, event) {
  var tableBodyRows = this._getTableBodyRows();
  var rowCount = tableBodyRows.length;
  var editableRowIdx = this._getEditableRowIdx();
  if (editableRowIdx >= 0 && editableRowIdx < rowCount - 1) {
    var updateEditable = this._setTableEditable(false, false, columnIdx, true, event);
    if (updateEditable === false) {
      this._queueTask(function () {
        setTimeout(function () { // @HTMLUpdateOK
          this._setCellFocus(editableRowIdx, columnIdx);
        }.bind(this), 0);
      }.bind(this));
    } else {
      this._setCurrentRow({ rowIndex: editableRowIdx + 1 }, event, false);
      this._setTableEditable(true, false, columnIdx, true, event);
    }
  } else if (editableRowIdx === rowCount - 1) {
    this._setTableEditable(false, false, columnIdx, true, event);
    this._getTable().focus();
  }
};

/**
 * Set the previous row to editable
 * @param {number} columnIdx  column index
 * @param {Object} event
 * @throws {Error}
 * @private
 */
Table.prototype._setPreviousRowEditable = function (columnIdx, event) {
  var editableRowIdx = this._getEditableRowIdx();
  if (editableRowIdx >= 1) {
    var updateEditable = this._setTableEditable(false, false, columnIdx, false, event);
    if (updateEditable === false) {
      this._queueTask(function () {
        setTimeout(function () { // @HTMLUpdateOK
          this._setCellFocus(editableRowIdx, columnIdx);
        }.bind(this), 0);
      }.bind(this));
    } else {
      this._setCurrentRow({ rowIndex: editableRowIdx - 1 }, event, false);
      this._setTableEditable(true, false, columnIdx, false, event);
    }
  } else if (editableRowIdx === 0) {
    this._setTableEditable(false, false, columnIdx, false, event);
    this._getTable().focus();
  }
};

/**
 * Fire editRow property change event
 * @private
 */
Table.prototype._fireEditRowChangeEvent = function (newValue, event) {
  // use _queueTask as _isSettingProperty is preventing writeback
  // as we are updating editRow option which is triggered by application updating it
  this._queueTask(function () {
    this.option('editRow', newValue, {
      _context: {
        originalEvent: event,
        internalSet: true,
        writeback: true,
      }
    });
  }.bind(this));
};

/**
 * Set the table editable
 * @param {boolean} editable true if editable, false otherwise
 * @param {boolean} cancelled true if edit was cancelled
 * @param {number} columnIdx  column index
 * @param {boolean} forwardSearch try setting focus starting at the first column
 * @param {Object} event
 * @param {boolean=} skipFocusReset whether to skip resetting focus on the table
 * @private
 */
Table.prototype._setTableEditable = function (editable, cancelled, columnIdx, forwardSearch, event,
  skipFocusReset) {
  if (!this._isTableEditMode()) {
    return undefined;
  }
  var currentRow = this._getCurrentRow();
  if (currentRow != null) {
    var rowKey = currentRow.rowKey;
    var rowIdx = this._getRowIdxForRowKey(rowKey);
    var tableBodyRow;
    var rowContext;
    var updateEditMode;
    var newEditRowValue;

    try {
      if (editable && !this._hasEditableRow()) {
        // fire the beforeEdit event if there are no existing editable rows
        // and we are starting edit on a row
        tableBodyRow = this._getTableBodyRow(rowIdx);
        rowContext = this._getRendererContextObject(tableBodyRow, {
          row: {
            key: rowKey,
            index: currentRow.rowIndex
          },
          isCurrentRow: true
        });
        updateEditMode = this._trigger('beforeRowEdit', event, { rowContext: rowContext });
        if (updateEditMode) {
          newEditRowValue = { rowKey: rowKey, rowIndex: rowIdx };
        }
      } else if (!editable && this._hasEditableRow()) {
        // only trigger the beforeRowEditEnd if we are actually ending an edit
        // fire on the edited row
        tableBodyRow = this._getTableBodyRow(this._getEditableRowIdx());
        rowKey = this._getRowKeyForRowIdx(this._getEditableRowIdx());
        rowContext = this._getRendererContextObject(tableBodyRow, {
          row: {
            key: rowKey,
            index: this._getDataSourceRowIndexForRowKey(rowKey)
          },
          isCurrentRow: true
        });
        updateEditMode = this._trigger('beforeRowEditEnd', event, {
          rowContext: rowContext,
          cancelEdit: cancelled
        });

        if (updateEditMode) {
          newEditRowValue = { rowKey: null, rowIndex: -1 };
        }
      } else {
        // No updates so just exit
        return undefined;
      }
    } catch (err) {
      return false;
    }
    if (!updateEditMode) {
      return false;
    }
    // update editRow option
    if (newEditRowValue) {
      this._fireEditRowChangeEvent(newEditRowValue, event);
    }

    // save the old editable row index
    var prevEditableRowIdx = this._getEditableRowIdx();
    if (editable) {
      // set the editable row index
      this._setEditableRowIdx(rowIdx);
      this._getTable().setAttribute(Table.DOM_ATTR._ARIA_LABELLEDBY, ''); // @HTMLUpdateOK
      this._accStatus.setAttribute(Table.DOM_ATTR._ARIA_LABELLEDBY, ''); // @HTMLUpdateOK
      // re-render the newly editable row
      this._queueTask(function () {
        this._refreshRow(rowIdx, true).then(function () {
          // set focus on the column in the row
          this._setRowFocus(rowIdx, true, false);
          this._setCellInRowFocus(rowIdx, columnIdx, forwardSearch);
        }.bind(this));
      }.bind(this));
    } else {
      this._focusEditCell = null;
      this._setEditableRowIdx(null);
      if (!skipFocusReset) {
        this._getTable().focus();
      }
    }
    // clear out the old editable row
    if (prevEditableRowIdx != null) {
      // make sure the row still exists before we refresh it
      var prevEditableTableBodyRow = this._getTableBodyRow(prevEditableRowIdx);
      if (prevEditableTableBodyRow != null) {
        // re-render the previously editable row, which will be read-only now
        this._refreshRow(prevEditableRowIdx, false);
      }
    }
  }
  return undefined;
};



/* global DataCollectionUtils:false, Table:false */

/**
 * @private
 */
Table._KEYBOARD_CODES = {
  _MODIFIER_SHIFT: 'shiftKey'
};

/**
 * Return the currently pressed keyboard keys
 * @return {Array} Array of keys
 * @private
 */
Table.prototype._getKeyboardKeys = function () {
  if (!this._keyboardKeys) {
    this._keyboardKeys = [];
  }
  // reverse the array since we want the keybaord keys to be a LIFO stack
  return this._keyboardKeys.reverse();
};

/**
 * Add a key to internally track pressed keys. keys should be added on
 * key down and then later removed on key up.
 * @param {number} key  Key of the keyboard key.
 * @private
 */
Table.prototype._addKeyboardKey = function (key) {
  var i;
  var foundCode = false;
  var props = Object.keys(DataCollectionUtils.KEYBOARD_KEYS);
  for (i = 0; i < props.length; i++) {
    var prop = props[i];
    if (DataCollectionUtils.KEYBOARD_KEYS[prop] === key) {
      foundCode = true;
      break;
    }
  }
  if (!foundCode) {
    // only add keys we are interested in
    return;
  }
  var keyboardKeys = this._getKeyboardKeys();
  var found = false;
  var keyboardKeysCount = keyboardKeys.length;
  for (i = 0; i < keyboardKeysCount; i++) {
    if (keyboardKeys[i] === key) {
      found = true;
      break;
    }
  }
  if (!found) {
    keyboardKeys.push(key);
  }
};

/**
 * Determines if a key in the set of currently pressed keyboard keys is a match
 * for the key check function provided.
 * @private
 */
Table.prototype._isKeyPressMatch = function (keyCheckFunction) {
  var keyboardKeys = this._getKeyboardKeys();
  for (var i = 0; i < keyboardKeys.length; i++) {
    if (keyCheckFunction(keyboardKeys[i])) {
      return true;
    }
  }
  return false;
};

/**
 * Remove a key from our internal list of pressed keys. This is done on keyup.
 * @private
 */
Table.prototype._removeKeyboardKey = function (key) {
  var keyboardKeys = this._getKeyboardKeys();
  var keyboardKeysCount = keyboardKeys.length;
  for (var i = 0; i < keyboardKeysCount; i++) {
    if (keyboardKeys[i] === key) {
      keyboardKeys.splice(i, 1);
    }
  }
};

/**
 * Clear any keyboard keys
 * @private
 */
Table.prototype._clearKeyboardKeys = function () {
  this._keyboardKeys = [];
};

/**
 * Handler for Left/Right keydown.
 * @param {Object} event
 * @private
 */
Table.prototype._handleKeydownLeftRight = function (event, isExtend) {
  if (this._isTableActionableMode() || this._hasEditableRow()) {
    // ignore in actionable and editable mode
    return;
  }
  var isRTL = this._GetReadingDirection() === 'rtl';
  var isLeft = this._isKeyPressMatch(DataCollectionUtils.isArrowLeftKeyEvent);
  var focusNext = (isRTL && isLeft) || (!isRTL && !isLeft);
  var current;
  var target;

  // pressing left/right navigates the column headers
  var focusedHeaderIndex = this._getFocusedHeaderColumnIdx();
  if (focusedHeaderIndex != null) {
    if (!isExtend || this._isNavigate || this._lastSelectedHeaderIdx == null) {
      current = focusedHeaderIndex;
    } else {
      current = this._lastSelectedHeaderIdx;
    }
    target = this._getNextVisibleColumnIndex(current, focusNext);
    if (isExtend) {
      this._isNavigate = false;
      // select all columns between focusedHeaderIndex and target
      this._selectRange(focusedHeaderIndex, target, false);
      this._scrollColumnIntoViewport(target);
    } else {
      this._isNavigate = true;
      if (current === 0 && focusNext === false && this._isDefaultSelectorEnabled()) {
        target = -1;
      }
      if (target !== focusedHeaderIndex) {
        this._setHeaderColumnFocus(target, true, false);
      }
    }
  } else {
    // update acc label information for screen reader users
    current = this._accColumnIndex;
    target = this._getNextVisibleColumnIndex(current, focusNext);
    this._updateAccStatusInfo(this._accRowIndex, target);
  }
};

/**
 * Handler for Up/Down keydown.
 * @param {Object} event
 * @private
 */
Table.prototype._handleKeydownUpDown = function (event, isExtend) {
  if (this._isTableActionableMode() || this._hasEditableRow()) {
    // ignore in actionable and editable mode
    return;
  }
  var focusedRowIdx = this._getFocusedRowIdx();
  if (focusedRowIdx != null) {
    var tableBodyRows = this._getTableBodyRows();
    var rowCount = tableBodyRows.length;
    var current;
    if (!isExtend || this._isNavigate || this._lastSelectedRowIdx == null) {
      current = focusedRowIdx;
    } else {
      current = this._lastSelectedRowIdx;
    }
    var target;
    if (this._isKeyPressMatch(DataCollectionUtils.isArrowUpKeyEvent)) {
      target = current > 0 ? current - 1 : current;
    } else if (this._isKeyPressMatch(DataCollectionUtils.isArrowDownKeyEvent)) {
      target = current < rowCount - 1 ? current + 1 : current;
    }
    if (isExtend) {
      this._isNavigate = false;
      // select all rows between focusedRowIdx and target
      this._selectRange(focusedRowIdx, target, true);
      this._scrollRowIntoViewport(target);
    } else {
      this._isNavigate = true;
      // if row is focused then up/down navigates the rows
      if (target !== focusedRowIdx) {
        if (!this._setRowFocus(target, true, true, null, event)) {
          return;
        }
        this._getTable().focus();
      } else if (target === 0 && this._isKeyPressMatch(DataCollectionUtils.isArrowUpKeyEvent)) {
        // if user is on the first row and presses up the focus on the first visible column header
        var visibleIndex = this._getFirstVisibleColumnIndex(0, true);
        this._setHeaderColumnFocus(visibleIndex, true, false);
      }
    }
  } else if (this._isKeyPressMatch(DataCollectionUtils.isArrowDownKeyEvent)) {
    var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
    if (focusedHeaderColumnIdx != null) {
      // if user is on a column header and pressed down then focus on the first row
      this._setRowFocus(0, true, true, null, event);
    }
  }
};

/**
 * Get tabbable elements within the element
 * @param {Element} element  DOM element
 * @param {boolean=} ignoreHidden ignore accessibility hidden elements
 * @return {Array|null} Array of DOM elements
 * @private
 */
Table.prototype._getTabbableElements = function (element, ignoreHidden) {
  var tabbableElements = null;
  if (ignoreHidden) {
    tabbableElements = $(element).find(':tabbable');
  } else {
    tabbableElements = $(element).find(':tabbable').not('.oj-helper-hidden-accessible');
  }
  if (tabbableElements != null && tabbableElements.length > 0) {
    return tabbableElements.toArray();
  }
  return null;
};

/**
 * Handler for Tab keydown.
 * @param {Object} event
 * @private
 */
Table.prototype._handleKeydownTab = function (event) {
  // if Tab is pressed while a row has focus and we are in actionable/editable
  // mode then want to Tab within that row until Esc or F2 is pressed
  var tabHandled = false;
  var focusedRowIdx = this._getFocusedRowIdx();
  var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
  var tabbableElementsInFocusedElement;
  var focusedElement;

  if (this._isTableActionableMode() || this._hasEditableRow()) {
    var currentFocusElement = document.activeElement;
    var tableBody = this._getTableBody();
    var tableHeader = this._getTableHeader();

    if (focusedRowIdx != null && this._getEditableRowIdx() === focusedRowIdx) {
      // If we are on an editable row and there are no more editable
      // elements to focus to then go to the next row
      var tableBodyRow = this._getTableBodyRow(focusedRowIdx);
      var tabbableElementsInRow = this._getTabbableElements(tableBodyRow);
      var tabbableElementsInRowCount =
        tabbableElementsInRow != null ? tabbableElementsInRow.length : 0;
      var rowElementTabIndex = $(tabbableElementsInRow).index(currentFocusElement);

      if (rowElementTabIndex === tabbableElementsInRowCount - 1 &&
          !event[Table._KEYBOARD_CODES._MODIFIER_SHIFT]) {
        // last tabbable element in row so go to the next row
        this._setNextRowEditable(0, event);
        event.preventDefault();
        event.stopPropagation();
        return;
      } else if (rowElementTabIndex === 0 && event[Table._KEYBOARD_CODES._MODIFIER_SHIFT]) {
        // first tabbable element in row and Shift+Tab so go to the previous row
        var tableHeaderColumns = this._getTableHeaderColumns();
        if (tableHeaderColumns) {
          var tableHeaderColumnsCount = tableHeaderColumns.length;
          this._setPreviousRowEditable(tableHeaderColumnsCount - 1, event);
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      } else {
        return;
      }
    } else if (this._tableActionableBoundaryElement) {
      focusedElement = this._tableActionableBoundaryElement;
      tabbableElementsInFocusedElement = this._getTabbableElements(focusedElement);

      // If only one tabbable element then stay on it
      if (tabbableElementsInFocusedElement.length > 1) {
        var i;
        if (!event[Table._KEYBOARD_CODES._MODIFIER_SHIFT]) {
          // Tabbing on the last tabbable element will wrap back
          var lastTabbableElementFocusedElement =
              tabbableElementsInFocusedElement[tabbableElementsInFocusedElement.length - 1];

          if (currentFocusElement === lastTabbableElementFocusedElement) {
            $(tabbableElementsInFocusedElement[0]).focus();
            event.preventDefault();
            event.stopPropagation();
          } else {
            // find which element it is
            for (i = 0; i < tabbableElementsInFocusedElement.length; i++) {
              if (currentFocusElement === tabbableElementsInFocusedElement[i]) {
                tabbableElementsInFocusedElement[i + 1].focus();
                event.preventDefault();
                event.stopPropagation();
                break;
              }
            }
          }
        } else {
          // Shift+Tabbing on the first tabbable element in a row will wrap back
          var firstTabbableElementFocusedElement = tabbableElementsInFocusedElement[0];

          if (currentFocusElement === firstTabbableElementFocusedElement) {
            $(tabbableElementsInFocusedElement[tabbableElementsInFocusedElement.length - 1])
              .focus();
            event.preventDefault();
            event.stopPropagation();
          } else {
            // find which element it is
            for (i = 0; i < tabbableElementsInFocusedElement.length; i++) {
              if (currentFocusElement === tabbableElementsInFocusedElement[i]) {
                tabbableElementsInFocusedElement[i - 1].focus();
                event.preventDefault();
                event.stopPropagation();
                break;
              }
            }
          }
        }
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if ((focusedRowIdx != null && !this._hasEditableRow()) || focusedHeaderColumnIdx != null) {
      if (!event[Table._KEYBOARD_CODES._MODIFIER_SHIFT]) {
        tabHandled = true;
        focusedElement = null;
        if (focusedRowIdx != null) {
          focusedElement = this._getTableBodyRow(focusedRowIdx);
        } else if (focusedHeaderColumnIdx != null) {
          focusedElement = this._getTableHeaderColumn(focusedHeaderColumnIdx);
        }
        tabbableElementsInFocusedElement = this._getTabbableElements(focusedElement);

        if (tabbableElementsInFocusedElement != null) {
          $(tabbableElementsInFocusedElement[0]).focus();
        } else if (focusedRowIdx != null) {
          // if there are no tabbable elements
          // in the row then focus on the first
          // tabbable element in the body
          var tabbableElementsInBody = this._getTabbableElements(tableBody);
          $(tabbableElementsInBody[0]).focus();
        } else if (focusedHeaderColumnIdx != null) {
          // if there are no tabbable elements
          // in the column then focus on the first
          // tabbable element in the thead
          var tabbableElementsInHeader = this._getTabbableElements(tableHeader);
          $(tabbableElementsInHeader[0]).focus();
        }
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  if (!tabHandled) {
    // tab out of the component to the next tabbable element on the page
    var table = this._getTable();
    var tabbableElementsInTable = this._getTabbableElements(table, true);
    var tabbableElementsInTableCount =
      tabbableElementsInTable != null ? tabbableElementsInTable.length : 0;

    // Table should not set focus to elements outside of itself because
    // ancestor such as modal dialog may want to confine the focus.  It
    // should just set focus to itself in backward tabbing or to its last
    // tabbable descendant in forward tabbing.  Then allow the ancestors
    // to handle the event and determine the next tabstop.
    var temporaryFocus = table;

    if (!event[Table._KEYBOARD_CODES._MODIFIER_SHIFT]) {
      // If we are tabbing forward and the table contains tabbable
      // elements, focus on the last tabbable element.
      if (this._isFF()) {
        // workaround for FF. In FF, the tbody is focusable even though it has
        // tabindex -1. So we have to create a temporary focusable element
        // as the last element in the table container and focus on that one.
        temporaryFocus = document.createElement(Table.DOM_ELEMENT._A); // @HTMLUpdateOK
        temporaryFocus.setAttribute(Table.DOM_ATTR._TABINDEX, '0'); // @HTMLUpdateOK
        temporaryFocus.setAttribute(Table.DOM_ATTR._HREF, '#'); // @HTMLUpdateOK
        temporaryFocus.classList.add(Table.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
        table.insertAdjacentElement('afterend', temporaryFocus);
        this._temporaryFocusForFF = temporaryFocus;
      } else if (tabbableElementsInTableCount > 0) {
        temporaryFocus = tabbableElementsInTable[tabbableElementsInTableCount - 1];
      }
    }

    // Need to set this variable because the focus() call will
    // trigger a focusin which we do not want to handle.
    this._temporaryTableChildElementFocus = true;
    temporaryFocus.focus();
    setTimeout(function () { // @HTMLUpdateOK
      this._temporaryTableChildElementFocus = false;
      if (this._temporaryFocusForFF) {
        $(this._temporaryFocusForFF).remove();
        this._temporaryFocusForFF = null;
      }
    }.bind(this), 0);

    return;
  }
  // we need to remove Tab on keydown because we may not
  // get a keyup for it if focus moves
  // outside of table
  var key = event.key || event.keyCode;
  this._removeKeyboardKey(key);
};

/**
 * Handler for Enter keydown.
 * @param {Object} event
 * @private
 */
Table.prototype._handleKeydownEnter = function (event) {
  if (this._isTableActionableMode()) {
    // ignore in actionable mode
    return;
  }
  // pressing enter does sort on the focused column header
  var focusedColumnIdx = this._getFocusedHeaderColumnIdx();
  if (focusedColumnIdx != null &&
      this._getColumnDefs()[focusedColumnIdx].sortable === Table._OPTION_ENABLED) {
    var tableHeaderColumn = this._getTableHeaderColumn(focusedColumnIdx);
    var sorted = $(tableHeaderColumn).data('sorted');
    // if not already sorted then sort ascending. If already sorted
    // ascending then do descending sort and vice versa.
    if (sorted == null || sorted === Table._COLUMN_SORT_ORDER._DESCENDING) {
      this._handleSortTableHeaderColumn(focusedColumnIdx, true, event);
    } else {
      this._handleSortTableHeaderColumn(focusedColumnIdx, false, event);
    }
  } else {
    var currentRow = this._getCurrentRow();
    currentRow = currentRow || {};
    var currentRowIdx = currentRow.rowIndex;
    if (currentRowIdx >= 0) {
      if (this._isTableEditMode()) {
        if (!this._hasEditableRow()) {
          this._setTableEditable(true, false, 0, true, event);
          return;
        }
        var columnIdx = this._getElementColumnIdx(event.target);

        if (!event[Table._KEYBOARD_CODES._MODIFIER_SHIFT]) {
          this._setNextRowEditable(columnIdx, event);
        } else {
          this._setPreviousRowEditable(columnIdx, event);
        }
      } else {
        this._fireActionEvent(currentRowIdx, event);
        this._setTableActionableMode(true);
      }
    }
  }
};

/**
 * Handler for Spacebar keydown.
 * @param {Object} event
 * @private
 */
Table.prototype._handleKeydownSpacebar = function (event) {
  if (this._isTableActionableMode() || this._hasEditableRow()) {
    // ignore in actionable and editable mode
    return;
  }
  // need to do this so that these keys don't act on the page. e.g. pressing Down would cause the
  // page to go down as well as the row to change
  event.preventDefault();
  event.stopPropagation();

  // pressing spacebar selects the focused row/column
  var focusedRowIdx = this._getFocusedRowIdx();
  if (focusedRowIdx != null) {
    this._handleSelectionGesture(focusedRowIdx, true, true);
  } else {
    var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
    if (focusedHeaderColumnIdx != null) {
      this._handleSelectionGesture(focusedHeaderColumnIdx, false, true);
    }
  }
};

/**
 * Handler for F2 keydown.
 * @param {Object} event
 * @private
 */
Table.prototype._handleKeydownF2 = function (event) {
  event.preventDefault();
  event.stopPropagation();
  if (this._isTableEditMode()) {
    // pressing F2 toggles between editable modes.
    if (!this._hasEditableRow()) {
      this._setTableEditable(true, false, 0, true, event);
      if (!this._hasEditableRow()) {
        this._toggleTableActionableMode();
      }
    } else {
      this._setTableEditable(false, false, 0, true, event);
    }
  } else {
    this._toggleTableActionableMode();
  }
};

/**
 * Handler for Esc keydown.
 * @param {Object} event
 * @private
 */
Table.prototype._handleKeydownEsc = function (event) {
  // pressing Esc always returns focus back to the table.
  if (this._hasEditableRow()) {
    event.preventDefault();
    event.stopPropagation();
    this._setTableEditable(false, true, 0, true, event);
    this._getTable().focus();
  } else if (this._isTableActionableMode()) {
    event.preventDefault();
    event.stopPropagation();
    this._setTableActionableMode(false);
    this._getTable().focus();
  }
  this._clearTableHeaderColumnsResize();
};

/**
 * Handler for Home keydown.
 * @param {Object} event
 * @private
 */
Table.prototype._handleKeydownHome = function (event) {
  if (this._isTableActionableMode() || this._hasEditableRow()) {
    // ignore in actionable and editable mode
    return;
  }
  // pressing Home focuses on first column
  var focusedColumnIdx = this._getFocusedHeaderColumnIdx();
  if (focusedColumnIdx != null && focusedColumnIdx !== 0) {
    var visibleIndex = this._getFirstVisibleColumnIndex(0, true);
    this._setHeaderColumnFocus(visibleIndex, true, false);
  } else {
    var focusedRowIdx = this._getFocusedRowIdx();
    if (focusedRowIdx != null && focusedRowIdx !== 0) {
      this._setRowFocus(0, true, true, null, event);
    }
  }
};

/**
 * Handler for End keydown.
 * @param {Object} event
 * @private
 */
Table.prototype._handleKeydownEnd = function (event) {
  if (this._isTableActionableMode() || this._hasEditableRow()) {
    // ignore in actionable and editable mode
    return;
  }
  // pressing End focuses on last column
  var focusedColumnIdx = this._getFocusedHeaderColumnIdx();
  if (focusedColumnIdx != null && focusedColumnIdx !== this._getColumnDefs().length - 1) {
    var visibleIndex = this._getFirstVisibleColumnIndex(this._getColumnDefs().length - 1, false);
    this._setHeaderColumnFocus(visibleIndex, true, false);
  } else {
    var focusedRowIdx = this._getFocusedRowIdx();
    if (focusedRowIdx != null) {
      var tableBodyRows = this._getTableBodyRows();
      var rowCount = tableBodyRows.length;
      if (focusedRowIdx !== rowCount - 1 && rowCount > 0) {
        this._setRowFocus(rowCount - 1, true, true, null, event);
      }
    }
  }
};



/* global Components:false, Table:false */

/**
 * Column Header Renderer
 * @param {Object} context renderer context
 * @param {function(Object)|null} delegateRenderer delegate renderer
 * @private
 */
Table.prototype._columnHeaderDefaultRenderer = function (context, delegateRenderer) {
  var parentElement = context.headerContext.parentElement;
  var headerColumnDiv = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  headerColumnDiv.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_CLASS);
  $(parentElement).empty();
  parentElement.appendChild(headerColumnDiv); // @HTMLUpdateOK

  // call the delegateRenderer
  var headerContentDiv = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  headerContentDiv.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_TEXT_CLASS);
  headerColumnDiv.insertBefore(headerContentDiv, headerColumnDiv.firstChild); // @HTMLUpdateOK

  if (delegateRenderer != null) {
    delegateRenderer($(headerContentDiv));
  } else {
    this._columnHeaderDefaultTextRenderer(headerContentDiv, context);
  }
};

/**
 * Column Header with Sort Icons Renderer
 * @param {Object} context renderer context
 * @param {function(Object)|null} delegateRenderer delegate renderer
 * @private
 */
Table.prototype._columnHeaderSortableIconRenderer = function (context, delegateRenderer) {
  var parentElement = context.headerContext.parentElement;
  var headerColumnDiv = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  headerColumnDiv.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_CLASS);
  $(parentElement).empty();
  parentElement.appendChild(headerColumnDiv); // @HTMLUpdateOK

  var sortContainer = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  sortContainer.classList.add(Table.CSS_CLASSES._TABLE_SORT_ICON_CONTAINER_CLASS);
  this._AddHoverable($(sortContainer));
  headerColumnDiv.appendChild(sortContainer); // @HTMLUpdateOK
  var sortIcon = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  sortIcon.classList.add(Table.CSS_CLASSES._WIDGET_ICON_CLASS);
  sortIcon.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_DEFAULT_SORT_ICON_CLASS);
  sortIcon.classList.add(Table.MARKER_STYLE_CLASSES._DISABLED);
  sortIcon.classList.add(Table.MARKER_STYLE_CLASSES._CLICKABLE_ICON);
  this._AddHoverable($(sortIcon));
  sortContainer.appendChild(sortIcon); // @HTMLUpdateOK

  // call the delegateRenderer
  var headerContentDiv = document.createElement(Table.DOM_ELEMENT._DIV); // @HTMLUpdateOK
  headerContentDiv.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_TEXT_CLASS);
  headerColumnDiv.insertBefore(headerContentDiv, headerColumnDiv.firstChild); // @HTMLUpdateOK

  if (delegateRenderer != null) {
    delegateRenderer($(headerContentDiv));
  } else {
    this._columnHeaderDefaultTextRenderer(headerContentDiv, context);
  }
};

/**
 * Default column header context text renderer
 * @param {Element} headerContentDiv header content div
 * @param {Object} context context object
 * @private
 */
Table.prototype._columnHeaderDefaultTextRenderer = function (headerContentDiv, context) {
  var columnIdx = context.columnIndex;
  var column = this._getColumnDefs()[columnIdx];
  var textValue = column.headerText == null ? '' : column.headerText;
  headerContentDiv.appendChild(document.createTextNode(textValue)); // @HTMLUpdateOK
};

/**
 * Default table body row renderer
 * @param {number} rowIdx  row index
 * @param {Object} row row
 * @param {Object} context context object
 * @private
 */
Table.prototype._tableBodyRowDefaultRenderer = function (rowIdx, row, context) {
  var tableBodyRow = context.rowContext.parentElement;
  var rowHashCode = this._hashCode(row.key);
  var columns = this._getColumnDefs();
  this._setTableBodyRowAttributes(row, tableBodyRow);
  var columnsCount = columns.length;
  for (var j = 0; j < columnsCount; j++) {
    // set the cells in the inserted row with values from the row
    this._tableBodyCellDefaultRenderer(rowIdx, j, row, rowHashCode, context);
  }
};

/**
 * Default table body cell renderer
 * @param {number} rowIdx  row index
 * @param {number} columnIdx  column index
 * @param {Object} row row
 * @param {number} rowHashCode  row hash code
 * @param {Object} context context object
 * @private
 */
Table.prototype._tableBodyCellDefaultRenderer = function (rowIdx, columnIdx,
  row, rowHashCode, context) {
  var tableBodyRow = context.rowContext.parentElement;
  var columns = this._getColumnDefs();
  var column = columns[columnIdx];

  var tableBodyCell = this._createTableBodyCell();
  this._styleTableBodyCell(columnIdx, tableBodyCell, true);
  this._insertTableBodyCell(rowIdx, row.key, rowHashCode, columnIdx,
                            tableBodyCell, tableBodyRow, true);

  var data = null;

  if (column.field != null) {
    data = this._getObjectPath(row.data, column.field);
  }

  var cellRenderer = this._getColumnRenderer(columnIdx, 'cell');
  var cellSlotTemplate = this._getSlotTemplate(column.template);
  if (cellSlotTemplate == null && this._isDefaultCellTemplateSlotValid()) {
    cellSlotTemplate = this._getSlotTemplate('cellTemplate');
  }

  if (!cellRenderer && !cellSlotTemplate) {
    data = this._getVal(data);
    var textValue = data == null ? '' : data;
    tableBodyCell.appendChild(document.createTextNode(textValue)); // @HTMLUpdateOK
  } else {
    var cellContext = this._getRendererContextObject(tableBodyCell, { row: row });
    // Copy additional properties to top-level context to work with custom element
    var rendererContext = {
      cellContext: cellContext,
      columnIndex: columnIdx,
      data: data,
      row: row.data,
      componentElement: cellContext.componentElement,
      parentElement: cellContext.parentElement
    };

    if (cellRenderer) {
      var cellColumnContent = cellRenderer(rendererContext);

      if (cellColumnContent != null) {
        // if the renderer returned a value then we set it as the content
        // for the cell. Use jquery append() for this as a convenience because
        // cellColumnContent could be a Node element or arbitrary content and
        // we don't want to write code to convert everything to Node type and call
        // appendChild.
        $(tableBodyCell).append(cellColumnContent); // @HTMLUpdateOK
      } else {
        // if the renderer didn't return a value then the existing
        // cell was manipulated. So get it and set the required
        // attributes just in case it was replaced or the attributes
        // got removed
        if (this._isDefaultSelectorEnabled()) {
          tableBodyCell = $(tableBodyRow).children()[columnIdx + 1];
        } else {
          tableBodyCell = $(tableBodyRow).children()[columnIdx];
        }
        this._setTableBodyCellAttributes(rowIdx, row.key, rowHashCode, columnIdx, tableBodyCell);
        this._styleTableBodyCell(columnIdx, tableBodyCell, false);
      }
    } else {
      var componentElement = this._getRootElement();
      var templateEngine = this._getTemplateEngine();
      if (templateEngine != null) {
        var slotContext = this._getCellSlotTemplateContextObject(rendererContext);
        var cellContent =
            templateEngine.execute(componentElement, cellSlotTemplate,
                                   slotContext, this.options.as);
        if (!(cellContent instanceof Array)) {
          cellContent = [cellContent];
        }
        cellContent.map(function (content) {
          tableBodyCell.appendChild(content);
          return undefined;
        });
        // eslint-disable-next-line no-param-reassign
        this._hasCellTemplate = true;
      }
    }
  }
};

/**
  * Get the context object to pass into the renderer
  * @param {Object} parentElement element
  * @param {Object} options options
  * @private
  */
Table.prototype._getRendererContextObject = function (parentElement, options) {
  var context = {};
  context.component = Components.__GetWidgetConstructor(this.element, 'ojTable');
  var dataSource = this.options.data;
  // unwrap the datasource if we have a PagingTableDataSource
  if (oj.PagingTableDataSource && dataSource instanceof oj.PagingTableDataSource) {
    dataSource = dataSource.getWrappedDataSource();
  }
  context.datasource = dataSource;
  context.parentElement = parentElement;

  if (options.row != null) {
    var row = options.row;
    var rowKey = row.key;
    context.status = this._getRendererStatusObject(row);

    if (this._hasEditableRow()) {
      // Check using the editable row key
      var editableRowKey = this._getEditableRowKey();

      // only set to edit mode for the editable row
      if (oj.Object.compareValues(rowKey, editableRowKey)) {
        context.mode = 'edit';
      } else {
        context.mode = 'navigation';
      }
    } else {
      context.mode = 'navigation';
    }

    this._copyMetadata(context, row, dataSource);
  }

  // Fix up context to work with custom element
  return this._FixRendererContext(context);
};

/**
 * Get the status object to pass into the renderer
 * @param {Object} row row instance
 * @return {Object} status object
 * @private
 */
Table.prototype._getRendererStatusObject = function (row) {
  return {
    rowIndex: row.index,
    rowKey: row.key,
    currentRow: $.extend({}, this._getCurrentRow())
  };
};

/**
  * Get the context object for inline cell templates
  * @param {Object} context renderer context
  * @private
  */
Table.prototype._getCellSlotTemplateContextObject = function (context) {
  var slotContext = this._getSlotTemplateContextObject();
  var rowIndex = context.cellContext.status.rowIndex;
  var rowKey = context.cellContext.status.rowKey;
  var columnIndex = context.columnIndex;
  slotContext[Table._CONST_DATA] = context.data;
  slotContext.row = context.row;
  slotContext[Table._CONST_INDEX] = rowIndex;
  slotContext.columnIndex = columnIndex;
  slotContext.mode = context.cellContext.mode;
  slotContext[Table._CONST_KEY] = rowKey;

  return slotContext;
};

/**
  * Get the context object for inline row templates
  * @param {Object} context renderer context
  * @private
  */
Table.prototype._getRowSlotTemplateContextObject = function (context) {
  var slotContext = this._getSlotTemplateContextObject();
  slotContext[Table._CONST_DATA] = context.data;
  slotContext[Table._CONST_INDEX] = context.rowContext.status.rowIndex;
  slotContext.rowContext = context.rowContext;
  slotContext.mode = context.rowContext.mode;
  slotContext[Table._CONST_KEY] = context.rowContext.status.rowKey;

  return slotContext;
};

/**
  * Get the context object for inline header templates
  * @param {Object} data data
  * @param {number} columnIdx  column index
  * @private
  */
Table.prototype._getHeaderSlotTemplateContextObject = function (data, columnIdx) {
  var slotContext = this._getSlotTemplateContextObject();
  slotContext[Table._CONST_DATA] = data;
  slotContext.columnIndex = columnIdx;

  return slotContext;
};

/**
  * Get the context object for inline templates
  * @private
  */
Table.prototype._getSlotTemplateContextObject = function () {
  return { componentElement: this._getRootElement() };
};

/**
 * @private
 */
Table.prototype._copyMetadata = function (context, row, dataSource) {
  var metadataContext = row.metadata;
  if (dataSource._getMetadata) {
    metadataContext = dataSource._getMetadata(row.index);
  }

  if (metadataContext) {
    var keys = Object.keys(metadataContext);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // eslint-disable-next-line no-param-reassign
      context[key] = metadataContext[key];
    }
  }
};

/**
 * @private
 */
Table.prototype._getObjectPath = function (obj, path) {
  if (obj != null &&
    (typeof path === 'string' || path instanceof String) &&
    (path.indexOf('.') !== -1 ||
    (path.indexOf('[') !== -1 &&
    path.indexOf(']') !== -1))) {
    var currentObj = obj;
    var foundPath = false;
    var pathArray = path.split('.');
    pathArray.map(function (pathSegment) {
      if (currentObj != null &&
        pathSegment.indexOf('[') !== -1 &&
        pathSegment.indexOf(']') !== -1) {
        var basePathSegment = pathSegment.substr(0, pathSegment.indexOf('['));
        var pathSegmentIndex =
            parseInt(pathSegment.substr(pathSegment.indexOf('[') + 1,
                                        pathSegment.indexOf(']') - pathSegment.indexOf('[') - 1),
                     10);
        currentObj = currentObj[basePathSegment][pathSegmentIndex];
        foundPath = true;
      } else if (currentObj !== null &&
        currentObj[pathSegment] !== undefined) {
        currentObj = currentObj[pathSegment];
        foundPath = true;
      }
      return undefined;
    });
    if (foundPath) {
      return currentObj;
    }
  } else if (obj == null) {
    return null;
  }
  return obj[path];
};

/**
 * @private
 */
Table.prototype._getVal = function (val) {
  if (typeof (val) === 'function') {
    return val();
  }
  return val;
};



/* global Table:false */

/**
 * @private
 */
Table.RESIZE_OFFSET = 10;

/**
 * Set resize cursor
 * @param {Event} event Event
 * @private
 */
Table.prototype._setResizeCursor = function (event) {
  var eventTarget = this._getEventTargetElement(event);
  var columnIdx = this._getElementColumnIdx(eventTarget);

  if (columnIdx == null) {
    return false;
  }

  var column = this._getColumnDefs()[columnIdx];

  if (column.resizable === Table._OPTION_DISABLED &&
    this._resizeStartColumnIdx !== columnIdx - 1 &&
    this._resizeStartColumnIdx !== columnIdx + 1) {
    return false;
  }

  if (this._resizeStartColumnIdx == null) {
    if (this._isHeaderColumnResizeStart(event) !== null) {
      eventTarget.style.cursor = 'col-resize';
      return true;
    }
    eventTarget.style.cursor = '';
    return false;
  }

  var headerColumns = this._getTableHeaderColumns();
  if (!headerColumns) {
    return false;
  }

  // move the indicator
  if (columnIdx === this._resizeStartColumnIdx ||
      (this._resizeColumnStart && columnIdx === this._resizeStartColumnIdx - 1) ||
      (!this._resizeColumnStart && columnIdx === this._resizeStartColumnIdx + 1)) {
    var tableHeaderColumnResizeIndicator = this._getTableHeaderColumnResizeIndicator();
    if (tableHeaderColumnResizeIndicator != null) {
      var table = this._getTable();
      var tableRect = table.getBoundingClientRect();
      tableHeaderColumnResizeIndicator.style.left = (this._getPageX(event) - tableRect.left) + 'px';
      return true;
    }
  }
  return false;
};

/**
  * Handle header column resize start
  * @param {Event} event Event
  * @return {boolean} Return whether column resize started
  * @private
  */
Table.prototype._handleHeaderColumnResizeStart = function (event) {
  var eventTarget = this._getEventTargetElement(event);
  var columnIdx = this._getElementColumnIdx(eventTarget);

  if (columnIdx != null) {
    var column = this._getColumnDefs()[columnIdx];
    this._resizeColumnStart = this._isHeaderColumnResizeStart(event);

    if (column.resizable === Table._OPTION_ENABLED &&
      this._resizeColumnStart !== null) {
      this._resizeStartColumnIdx = columnIdx;
      this._resizeStartPageX = this._getPageX(event);
      this._setTableHeaderColumnsResizeStyling();
      this._setTableHeaderColumnResizeIndicator(columnIdx);
      return true;
    }
  }
  this._resizeStartColumnIdx = null;
  this._resizeStartPageX = null;
  return false;
};

/**
  * Handle header column resize end
  * @param {Event} event Event
  * @return {boolean} Return whether column resize ended
  * @private
  */
Table.prototype._handleHeaderColumnResizeEnd = function (event) {
  var columnsCount = this.options.columns.length;
  var eventTarget = this._getEventTargetElement(event);
  var columnIdx = this._getElementColumnIdx(eventTarget);

  // only resize if we end the resize on the same column or adjacent columns
  if ((columnIdx !== null && columnIdx === this._resizeStartColumnIdx) ||
      (this._resizeColumnStart && columnIdx === this._resizeStartColumnIdx - 1) ||
      (!this._resizeColumnStart && columnIdx === this._resizeStartColumnIdx + 1)) {
    var headerColumn = this._getTableHeaderColumn(this._resizeStartColumnIdx);
    if (headerColumn != null) {
      var headerColumnRect = headerColumn.getBoundingClientRect();
      var headerColumnWidth = headerColumnRect.width;
      // when scrollbar is present, reduce last column width by scrollbar width
      if (this._resizeStartColumnIdx === columnsCount - 1 && this._tableHeightConstrained) {
        headerColumnWidth -= this._getScrollBarWidth();
      }
      var widthChange;
      if ((this._GetReadingDirection() === 'rtl' && this._resizeColumnStart) ||
          (this._GetReadingDirection() === 'ltr' && !this._resizeColumnStart)) {
        widthChange = this._getPageX(event) - this._resizeStartPageX;
      } else {
        widthChange = this._resizeStartPageX - this._getPageX(event);
      }
      if (Math.abs(widthChange) > 2) {
        var updatedWidth = headerColumnWidth + widthChange;
        var clonedColumnsOption = [];
        for (var i = 0; i < columnsCount; i++) {
          clonedColumnsOption[i] = $.extend({}, {}, this.options.columns[i]);
        }
        clonedColumnsOption[this._resizeStartColumnIdx].width = updatedWidth;

        // a resize operation should increase one column and decrease the other
        var headerColumnAdjacentIdx = this._resizeColumnStart ?
          this._resizeStartColumnIdx - 1 : this._resizeStartColumnIdx + 1;
        // when scrollbar is present, reduce last column width by scrollbar width
        if (headerColumnAdjacentIdx === columnsCount - 1 && this._tableHeightConstrained) {
          widthChange += this._getScrollBarWidth();
        }
        var headerColumnAdjacent = this._getTableHeaderColumn(headerColumnAdjacentIdx);
        if (headerColumnAdjacent) {
          var headerColumnAdjacentRect = headerColumnAdjacent.getBoundingClientRect();
          var headerColumnAdjacentWidth = headerColumnAdjacentRect.width;
          clonedColumnsOption[headerColumnAdjacentIdx].width =
            headerColumnAdjacentWidth - widthChange;
        }

        this.option('columns', clonedColumnsOption, {
          _context: {
            writeback: true,
            internalSet: true
          }
        });
        this._clearCachedMetadata();
        this._queueTask(function () {
          // delay the focus to ensure table resize information is not cleared before 'click' handling occurs
          // otherwise, column resizing will lead to selection handling as well
          setTimeout(function () { // @HTMLUpdateOK
            this._clearTableHeaderColumnsResize();
          }.bind(this), 0);
        }.bind(this));
        return true;
      }
    }
  }
  this._clearTableHeaderColumnsResize();
  return false;
};

/**
  * Clear any column resize
  * @private
  */
Table.prototype._clearTableHeaderColumnsResize = function () {
  this._resizeStartColumnIdx = null;
  this._resizeColumnStart = null;
  this._resizeStartPageX = null;
  this._clearTableHeaderColumnsResizeStyling();
  this._removeTableHeaderColumnResizeIndicator();
};

/**
 * @private
 */
Table.prototype._getPageX = function (event) {
  if (event.pageX !== undefined) {
    // MouseEvent has pageX on event itself
    return event.pageX;
  } else if (event.changedTouches !== undefined) {
    // TouchEvent has pageX on changedTouches, targetTouches, and touches.
    // For one-finger drag, they contain the same value on all touch events
    // except for touchend, in which only changedTouches has the point at
    // which the finger leaves the touch surface.
    return event.changedTouches[0].pageX;
  }

  // We shouldn't get here unless event is neither MouseEvent nor TouchEvent
  return 0;
};

/**
 * @private
 */
Table.prototype._isHeaderColumnResizeStart = function (event) {
  var resizeColumnStart = null;
  var columnsCount = this.options.columns.length;
  var columnIdx = this._getElementColumnIdx(event.target);
  var headerColumn = this._getTableHeaderColumn(columnIdx);
  if (headerColumn !== null) {
    var readingDir = this._GetReadingDirection();
    var columnRect = headerColumn.getBoundingClientRect();
    var distFromLeft = Math.abs(this._getPageX(event) - columnRect.left);
    var distFromRight = Math.abs(this._getPageX(event) - columnRect.right);

    // don't show resize cursor for column dividers at the start and end of the table
    if (distFromLeft <= Table.RESIZE_OFFSET) {
      if (readingDir === 'rtl' && columnIdx !== columnsCount - 1) {
        resizeColumnStart = false;
      } else if (readingDir === 'ltr' && columnIdx !== 0) {
        resizeColumnStart = true;
      }
    } else if (distFromRight <= Table.RESIZE_OFFSET) {
      if (readingDir === 'ltr' && columnIdx !== columnsCount - 1) {
        resizeColumnStart = false;
      } else if (readingDir === 'rtl' && columnIdx !== 0) {
        resizeColumnStart = true;
      }
    }
  }
  return resizeColumnStart;
};

/**
 * @private
 */
Table.prototype._setTableHeaderColumnResizeIndicator = function (columnIdx) {
  var tableHeaderColumnResizeIndicator = this._getTableHeaderColumnResizeIndicator();
  if (tableHeaderColumnResizeIndicator == null) {
    tableHeaderColumnResizeIndicator = this._createTableHeaderColumnResizeIndicator();
  }
  var table = this._getTable();
  var tableRect = table.getBoundingClientRect();
  var headerColumn = this._getTableHeaderColumn(columnIdx);
  var headerColumnRect = headerColumn.getBoundingClientRect();
  tableHeaderColumnResizeIndicator.style.height = tableRect.height + 'px';

  if (this._resizeColumnStart) {
    if (this._GetReadingDirection() === 'rtl') {
      tableHeaderColumnResizeIndicator.style.left =
        ((headerColumnRect.left + headerColumnRect.width) - tableRect.left) + 'px';
    } else {
      tableHeaderColumnResizeIndicator.style.left =
        (headerColumnRect.left - tableRect.left) + 'px';
    }
    tableHeaderColumnResizeIndicator.style.borderLeftWidth = '2px';
    tableHeaderColumnResizeIndicator.style.borderRightWidth = '0';
  } else {
    if (this._GetReadingDirection() === 'rtl') {
      tableHeaderColumnResizeIndicator.style.left =
        (headerColumnRect.left - tableRect.left) + 'px';
    } else {
      tableHeaderColumnResizeIndicator.style.left =
        ((headerColumnRect.left + headerColumnRect.width) - tableRect.left) + 'px';
    }
    tableHeaderColumnResizeIndicator.style.borderRightWidth = '2px';
    tableHeaderColumnResizeIndicator.style.borderLeftWidth = '0';
  }
};

/**
 * @private
 */
Table.prototype._setTableHeaderColumnsResizeStyling = function () {
  var table = this._getTable();
  table.classList.add(Table.CSS_CLASSES._COLUMN_HEADER_RESIZING_CLASS);
};

/**
 * @private
 */
Table.prototype._clearTableHeaderColumnsResizeStyling = function () {
  var headerColumns = this._getTableHeaderColumns();
  if (headerColumns) {
    for (var i = 0; i < headerColumns.length; i++) {
      headerColumns[i].style.cursor = '';
    }
  }
  var table = this._getTable();
  table.classList.remove(Table.CSS_CLASSES._COLUMN_HEADER_RESIZING_CLASS);
};



/* global DataCollectionUtils:false, Logger:false, Promise:false, Set:false, Table:false */

/**
 * Return the row selection mode
 * @return {string|null} single, multiple, none, or null
 * @private
 */
Table.prototype._getRowSelectionMode = function () {
  var rowSelectionMode = this.options.selectionMode == null ?
    null : this.options.selectionMode[Table._CONST_ROW];
  return rowSelectionMode;
};

/**
 * Returns whether or not row selection is enabled
 * @return {boolean} whether row selection is enabled
 * @private
 */
Table.prototype._isRowSelectionEnabled = function () {
  var rowSelectionMode = this._getRowSelectionMode();
  return (rowSelectionMode === Table._OPTION_SELECTION_MODES._SINGLE ||
          rowSelectionMode === Table._OPTION_SELECTION_MODES._MULTIPLE);
};

/**
 * Return the column selection mode
 * @return {string|null} single, multiple, none, or null
 * @private
 */
Table.prototype._getColumnSelectionMode = function () {
  var columnSelectionMode = this.options.selectionMode == null ?
    null : this.options.selectionMode[Table._CONST_COLUMN];
  return columnSelectionMode;
};

/**
 * Returns whether or not column selection is enabled
 * @return {boolean} whether column selection is enabled
 * @private
 */
Table.prototype._isColumnSelectionEnabled = function () {
  var colSelectionMode = this._getColumnSelectionMode();
  return (colSelectionMode === Table._OPTION_SELECTION_MODES._SINGLE ||
          colSelectionMode === Table._OPTION_SELECTION_MODES._MULTIPLE);
};

/**
 * @private
 */
Table.prototype._syncSelectionState = function () {
  var selected = this.option('selected');
  var selection = this.option('selection');

  // generate new selected value from existing selection value if required
  if (this._selectionSet) {
    // recreate 'selected' option in case selection ranges need to be applied
    selected = this._getSelectedEquivalent(selection);
    // update row index/key values in the 'selection' option
    this._syncRangeSelection();
  }
  if (!this._isSelectionRequiredSatisfied(selected)) {
    this._selectFirstRowOrColumn();
  } else {
    this._setSelected(selected, this._selectionSet);
  }
};

/**
 * Updates the Table's selection state based on the rows being removed
 */
Table.prototype._updateSelectionStateFromEventDetailRemove = function (eventDetail,
                                                                       addEventDetail) {
  var selected = this.option('selected');
  var rowKeySet = selected.row;
  if (rowKeySet) {
    eventDetail[Table._CONST_KEYS].forEach(function (key) {
      if (addEventDetail == null || !addEventDetail[Table._CONST_KEYS].has(key)) {
        // remove rowKey reference from the existing selection state
        if (!rowKeySet.isAddAll()) {
          rowKeySet = rowKeySet.delete([key]);
        } else if (!rowKeySet.has(key)) {
          rowKeySet = rowKeySet.add([key]);
        }
      }
    });
    // only update selection if this led to a new selection state
    if (selected.row !== rowKeySet) {
      selected = { row: rowKeySet, column: selected.column };
      // ensure selectionRequired is satisfied
      if (!this._isSelectionRequiredSatisfied(selected)) {
        this._selectFirstRowOrColumn();
      } else {
        this._setSelected(selected);
      }
    }
  }
};

/**
 * @param {boolean=} isOptionUpdate
 * @private
 */
Table.prototype._validateInitialSelectionState = function (isOptionUpdate) {
  var useSelection;
  var validateSelectedResult;
  var selection = this.option('selection');
  var selected = this.option('selected');
  var rowKeySet = selected.row;
  var columnKeySet = selected.column;
  this._validatedSelectedRowKeyData = null;

  // generate new selected value from existing selection value if required
  if (this._selectionSet || (!isOptionUpdate && selection != null &&
      selection.length !== 0 && rowKeySet === rowKeySet.clear() &&
      columnKeySet === columnKeySet.clear())) {
    // recreate 'selected' option in case selection ranges need to be applied
    selected = this._getSelectedEquivalent(selection);
    useSelection = true;
  }
  if (this._isSelectionRequired()) {
    validateSelectedResult = this._validateSelected(selected);
    if (!validateSelectedResult.isLocal) {
      // set selection-required rowKey validation busy state
      var validationResolveFunc = this._createComponentBusyState('is validating selection-required keys.');
      validateSelectedResult.result.then(function (validSelected) {
        this._enforceSelectionRequired(selected, validSelected, useSelection);
        // clear selection-required rowKey validation busy state
        this._clearComponentBusyState(validationResolveFunc);
      }.bind(this));
    } else {
      this._enforceSelectionRequired(selected, validateSelectedResult.result, useSelection);
    }
  } else {
    if (useSelection) {
      // update row index/key values in the 'selection' option
      this._syncRangeSelection();
    }
    this._setSelected(selected, useSelection);
  }
  this._initialSelectionStateValidated = true;
};

/**
 * @private
 */
Table.prototype._isSelectionRequired = function () {
  return ((String(this.options.selectionRequired)).toLowerCase() === 'true');
};

/**
 * @param {Object=} selected
 * @private
 */
Table.prototype._hasSelected = function (selected) {
  if (selected == null) {
    // eslint-disable-next-line no-param-reassign
    selected = this.option('selected');
  }
  var rowKeySet = selected.row;
  var columnKeySet = selected.column;
  return (rowKeySet.isAddAll() || rowKeySet.values().size > 0 ||
          columnKeySet.isAddAll() || columnKeySet.values().size > 0);
};

/**
 * @param {Object} selected
 * @private
 */
Table.prototype._isSelectionRequiredSatisfied = function (selected) {
  if (this._isSelectionRequired()) {
    return this._hasSelected(selected);
  }
  return true;
};

/**
 * @private
 */
Table.prototype._enforceSelectionRequired = function (selected, validSelected, useSelection) {
  if (useSelection) {
    if (this._hasSelected(validSelected)) {
      if (validSelected.row === selected.row && validSelected.column === selected.column) {
        // update row index/key values in the 'selection' option
        this._syncRangeSelection();
        this._setSelected(validSelected, true);
      } else {
        // override selection option as it was not fully valid
        this._setSelected(validSelected);
      }
    } else {
      // selection state does not satisfy selection-required, override to valid state
      this._selectFirstRowOrColumn();
    }
  } else if (this._hasSelected(validSelected)) {
    this._setSelected(validSelected);
  } else {
    // selection state does not satisfy selection-required, override to valid state
    this._selectFirstRowOrColumn();
  }
};

/**
 * @private
 */
Table.prototype._selectFirstRowOrColumn = function () {
  var newKeySet;
  var key;
  if (this._isRowSelectionEnabled()) {
    key = this._getRowKeyForRowIdx(0);
    if (key != null) {
      newKeySet = new oj.KeySetImpl([key]);
      this._setSelected({ row: newKeySet, column: new oj.KeySetImpl() });
      return;
    }
  }
  if (this._isColumnSelectionEnabled()) {
    key = this._getColumnKeyForColumnIdx(0);
    if (key != null) {
      newKeySet = new oj.KeySetImpl([key]);
      this._setSelected({ row: new oj.KeySetImpl(), column: newKeySet });
    }
  }
};

/**
 * @param {Object} selected
 * @private
 */
Table.prototype._validateSelected = function (selected) {
  var columnKeySet = selected.column;
  var validatedColumnKeySet = columnKeySet;
  if (!columnKeySet.isAddAll()) {
    var columnKeys = this._getColumnKeys();
    var invalidColumnKeys = [];
    var pendingColumnKeys = columnKeySet.values();
    pendingColumnKeys.forEach(function (key) {
      if (columnKeys.indexOf(key) === -1) {
        invalidColumnKeys.push(key);
      }
    });
    if (invalidColumnKeys.length > 0) {
      validatedColumnKeySet = validatedColumnKeySet.delete(invalidColumnKeys);
    }
  }

  var rowKeySet = selected.row;
  var validatedRowKeySet = rowKeySet;
  if (!rowKeySet.isAddAll()) {
    var localRowKeys = this._getLocalRowKeys();
    var invalidLocalRowKeys = [];
    var pendingRowKeys = rowKeySet.values();
    pendingRowKeys.forEach(function (key) {
      if (localRowKeys.indexOf(key) === -1) {
        invalidLocalRowKeys.push(key);
      }
    });
    // if any keys are not locally available, attempt to validate keys in the data provider
    if (invalidLocalRowKeys.length > 0) {
      var validRowKeyDataPromise = this._fetchValidRowKeyData(invalidLocalRowKeys);
      if (validRowKeyDataPromise) {
        var validateSelectedPromise = validRowKeyDataPromise.then(function (validRowKeyData) {
          // save validatedSelectedRowKeyData for 'firstSelectedRow' updates
          this._validatedSelectedRowKeyData = validRowKeyData;
          validRowKeyData.forEach(function (rowKeyData) {
            invalidLocalRowKeys.splice(invalidLocalRowKeys.indexOf(rowKeyData.key), 1);
          });
          validatedRowKeySet = validatedRowKeySet.delete(invalidLocalRowKeys);
          return { row: validatedRowKeySet, column: validatedColumnKeySet };
        }.bind(this));
        return { isLocal: false, result: validateSelectedPromise };
      }
      validatedRowKeySet = validatedRowKeySet.delete(invalidLocalRowKeys);
    }
  }
  return { isLocal: true, result: { row: validatedRowKeySet, column: validatedColumnKeySet } };
};

/**
 * Validate keys in selected
 * @private
 */
Table.prototype._fetchValidRowKeyData = function (keys) {
  // need to verify keys if we have a DataProvider that supports non-iteration 'fetchByKeys'
  var dataProvider = this._getData();
  if (dataProvider && dataProvider.getCapability) {
    var capability = dataProvider.getCapability('fetchByKeys');
    if (capability && capability.implementation === 'lookup') {
      return new Promise(function (resolve) {
        dataProvider.fetchByKeys({ keys: new Set(keys), scope: 'global' }).then(function (fetchResult) {
          var validKeyData = [];
          var validKeysResult = fetchResult.results;
          validKeysResult.forEach(function (value, key) {
            validKeyData.push({ key: key, data: value.data });
          });
          resolve(validKeyData);
        }, function () {
          // something bad happened, treat keys as invalid
          resolve([]);
        });
      });
    }
  }
  // if we can't validate, return null
  return null;
};

/**
 * Update the row/column index of each selection range
 * @private
 */
Table.prototype._syncRangeSelection = function (selection) {
  if (selection === undefined) {
    // eslint-disable-next-line no-param-reassign
    selection = this.option('selection');
  }
  if (selection == null) {
    return;
  }

  var selectionCount = selection.length;
  for (var i = 0; i < selectionCount; i++) {
    var rangeObj = selection[i];

    var startRowKey;
    var startRowIndex;
    if (rangeObj.startKey != null && rangeObj.startKey[Table._CONST_ROW] != null) {
      startRowKey = rangeObj.startKey[Table._CONST_ROW];
      startRowIndex = this._getDataSourceRowIndexForRowKey(startRowKey);
      rangeObj.startIndex = {};
      rangeObj.startIndex[Table._CONST_ROW] = startRowIndex;
    } else if (rangeObj.startIndex != null && rangeObj.startIndex[Table._CONST_ROW] != null) {
      startRowIndex = rangeObj.startIndex[Table._CONST_ROW];
      startRowKey = this._getRowKeyForDataSourceRowIndex(startRowIndex);
      if (startRowKey != null) {
        rangeObj.startKey = {};
        rangeObj.startKey[Table._CONST_ROW] = startRowKey;
      }
    }
    var endRowKey;
    var endRowIndex;
    if (rangeObj.endKey != null && rangeObj.endKey[Table._CONST_ROW] != null) {
      endRowKey = rangeObj.endKey[Table._CONST_ROW];
      endRowIndex = this._getDataSourceRowIndexForRowKey(endRowKey);
      rangeObj.endIndex = {};
      rangeObj.endIndex[Table._CONST_ROW] = endRowIndex;
    } else if (rangeObj.endIndex != null && rangeObj.endIndex[Table._CONST_ROW] != null) {
      endRowIndex = rangeObj.endIndex[Table._CONST_ROW];
      endRowKey = this._getRowKeyForDataSourceRowIndex(endRowIndex);
      if (endRowKey != null) {
        rangeObj.endKey = {};
        rangeObj.endKey[Table._CONST_ROW] = endRowKey;
      }
    }
  }
};

/**
 * Process the selected rows defined in the range object.
 * @return {Object} returns an object that contains the following:
 *         status: true if the range is processed, false if the range is not processed, undefined if the range is partially processed.
 *         rowKeySet: updated KeySet for row.
 *         columnKeySet: updated KeySet for column.
 * @private
 */
Table.prototype._processRowRangeSelection = function (rangeObj, rowKeySet, columnKeySet) {
  var startRowIndex;
  var endRowIndex;
  var startRowIdx;
  var endRowIdx;
  var startRowKey;
  var endRowKey;
  var status = true;

  // if keys are specified, we get the index from the key
  if (rangeObj.startKey != null && rangeObj.startKey[Table._CONST_ROW] != null) {
    startRowKey = rangeObj.startKey[Table._CONST_ROW];
    startRowIndex = this._getDataSourceRowIndexForRowKey(startRowKey);
    if (isNaN(startRowIndex)) {
      // start key is outside of range
      status = undefined;
    }
  } else if (rangeObj.startIndex != null && rangeObj.startIndex[Table._CONST_ROW] != null) {
    startRowIndex = rangeObj.startIndex[Table._CONST_ROW];
  }
  if (rangeObj.endKey != null && rangeObj.endKey[Table._CONST_ROW] != null) {
    endRowKey = rangeObj.endKey[Table._CONST_ROW];
    endRowIndex = this._getDataSourceRowIndexForRowKey(endRowKey);
    if (endRowIndex === null && this._isLoadMoreOnScroll()) {
      // we'll still need to process range selection next time
      endRowIndex = this._getDataSourceLastFetchedRowIndex();
      status = undefined;
    }
  } else if (rangeObj.endIndex != null && rangeObj.endIndex[Table._CONST_ROW] != null) {
    endRowIndex = rangeObj.endIndex[Table._CONST_ROW];
    var lastRowIndex = this._getDataSourceLastFetchedRowIndex();
    if (this._isLoadMoreOnScroll() && endRowIndex > lastRowIndex) {
      // we'll still need to process range selection next time
      endRowIndex = lastRowIndex;
      status = undefined;
    }
  }

  if (startRowIndex === undefined && endRowIndex === undefined) {
    // there's no row range set
    status = false;
  } else if (startRowIndex != null && endRowIndex != null && startRowIndex <= endRowIndex) {
    // this is a row based selection
    startRowKey = this._getRowKeyForDataSourceRowIndex(startRowIndex);
    endRowKey = this._getRowKeyForDataSourceRowIndex(endRowIndex);
    startRowIdx = this._getRowIdxForRowKey(startRowKey);
    endRowIdx = this._getRowIdxForRowKey(endRowKey);
    for (var i = startRowIdx; i <= endRowIdx; i++) {
      // update keySet
      var rowKey = this._getRowKeyForRowIdx(i);
      // eslint-disable-next-line no-param-reassign
      rowKeySet = rowKeySet.add([rowKey]);
    }
    // eslint-disable-next-line no-param-reassign
    columnKeySet = columnKeySet.clear();
  } else {
    // use warn instead of error because the start/end key could be out of range
    Logger.warn('Error: Cannot resolve row range in selection - \n start row key: ' +
      startRowKey + '\n end row key: ' + endRowKey + '\n start row index: ' +
      startRowIndex + '\n end row index: ' + endRowIndex);

    // although row keys are possibly out of range, we still need to update our keyset
    if (startRowKey != null && endRowKey != null) {
      // eslint-disable-next-line no-param-reassign
      rowKeySet = rowKeySet.add([startRowKey]);
      // eslint-disable-next-line no-param-reassign
      rowKeySet = rowKeySet.add([endRowKey]);
      // eslint-disable-next-line no-param-reassign
      columnKeySet = columnKeySet.clear();
    }
  }
  return { status: status, rowKeySet: rowKeySet, columnKeySet: columnKeySet };
};

/**
 * Returns the index of the last fetched row in table.
 * @private
 */
Table.prototype._getDataSourceLastFetchedRowIndex = function () {
  var tableBodyRows = this._getTableBodyRows();
  if (tableBodyRows.length > 0) {
    var dataprovider = this._getData();
    var offset = 0;
    if (this._isPagingModelDataProvider()) {
      offset = dataprovider.getStartItemIndex();
    }
    return (tableBodyRows.length + offset) - 1;
  }
  return 0;
};

/**
 * Process the selected columns defined in the range object.
 * @return {Object} returns an object that contains the following:
 *         status: true if the range is processed, false if the range is not processed.
 *         rowKeySet: updated KeySet for row.
 *         columnKeySet: updated KeySet for column.
 * @private
 */
Table.prototype._processColumnRangeSelection = function (rangeObj, rowKeySet, columnKeySet) {
  var startColumnKey;
  var endColumnKey;
  var startColumnIndex;
  var endColumnIndex;
  var status = true;

  if (rangeObj.startKey != null && rangeObj.startKey[Table._CONST_COLUMN] != null) {
    startColumnKey = rangeObj.startKey[Table._CONST_COLUMN];
    startColumnIndex = this._getColumnIdxForColumnKey(startColumnKey);
  } else if (rangeObj.startIndex != null &&
             rangeObj.startIndex[Table._CONST_COLUMN] != null) {
    startColumnIndex = rangeObj.startIndex[Table._CONST_COLUMN];
  }
  if (rangeObj.endKey != null && rangeObj.endKey[Table._CONST_COLUMN] != null) {
    endColumnKey = rangeObj.endKey[Table._CONST_COLUMN];
    endColumnIndex = this._getColumnIdxForColumnKey(endColumnKey);
  } else if (rangeObj.endIndex != null && rangeObj.endIndex[Table._CONST_COLUMN] != null) {
    endColumnIndex = rangeObj.endIndex[Table._CONST_COLUMN];
  }

  if (startColumnIndex === undefined && endColumnIndex === undefined) {
    // column range wasn't specified
    status = false;
  } else if (startColumnIndex != null && endColumnIndex != null && !isNaN(startColumnIndex) &&
             !isNaN(endColumnIndex) && startColumnIndex <= endColumnIndex) {
    // this is a column based selection
    for (var i = startColumnIndex; i <= endColumnIndex; i++) {
      // update keySet
      var columnKey = this._getColumnKeyForColumnIdx(i);
      // eslint-disable-next-line no-param-reassign
      columnKeySet = columnKeySet.add([columnKey]);
    }
    // eslint-disable-next-line no-param-reassign
    rowKeySet = rowKeySet.clear();
  } else {
    Logger.error('Error: Cannot resolve column range in selection - \n start column key: ' +
      startColumnKey + '\n end column key: ' + endColumnKey + '\n start column index: ' +
      startColumnIndex + '\n end column index: ' + endColumnIndex);
  }
  return { status: status, rowKeySet: rowKeySet, columnKeySet: columnKeySet };
};

/**
 * When data change occurs (sort, refresh etc.), invalidate any remaining selection range by
 * syncing the value with what's stored in the selected row KeySet
 * @private
 */
Table.prototype._invalidateRangeSelection = function () {
  var selection = this.option('selection');
  if (selection == null) {
    return;
  }
  for (var i = 0; i < selection.length; i++) {
    var startRowKey;
    var endRowKey;
    var rangeObj = selection[i];
    if (rangeObj.startKey != null) {
      startRowKey = rangeObj.startKey[Table._CONST_ROW];
    }
    if (rangeObj.endKey != null) {
      endRowKey = rangeObj.endKey[Table._CONST_ROW];
    }

    // all the ranges should be converted to keyset already
    // the only exception is if there are un-resolved ranges, in which case
    // we will invalidate them by syncing up with what's stored in the KeySet
    if (startRowKey !== endRowKey || startRowKey === undefined) {
      var keySet = this.option('selected.row');
      var newSelection = this._getRowSelectionFromKeySet(keySet);
      this.option('selection', newSelection, {
        _context: {
          writeback: true,
          internalSet: true
        }
      });
      break;
    }
  }
};

/**
 * Sets selected keyset
 * @param {Object} selected
 * @param {boolean=} skipSelectionUpdate
 * @private
 */
Table.prototype._setSelected = function (selected, skipSelectionUpdate) {
  this._selectionSet = skipSelectionUpdate;
  if (selected != null) {
    var updateSelected;
    var currentSelected = this.option('selected');
    if (this._selectionSet) {
      // when selection is set, we need to check if selected key sets are equivalent
      if (!DataCollectionUtils.areKeySetsEqual(currentSelected.row, selected.row) ||
          !DataCollectionUtils.areKeySetsEqual(currentSelected.column, selected.column)) {
        updateSelected = true;
      }
    } else if (currentSelected.row !== selected.row || currentSelected.column !== selected.column) {
      updateSelected = true;
    }
    // only update selected option if it has changed
    if (updateSelected) {
      this.option('selected', selected, {
        _context: {
          writeback: true,
          internalSet: true
        }
      });

      // update local rowKeyData storage when selected value is updated
      if (this._isSelectionRequired() && this._validatedSelectedRowKeyData) {
        for (var i = this._validatedSelectedRowKeyData.length - 1; i >= 0; i--) {
          var rowKeyData = this._validatedSelectedRowKeyData[i];
          // if the key is no longer in the selected value, remove it from the local storage
          if (!selected.row.has(rowKeyData.key)) {
            this._validatedSelectedRowKeyData.splice(i, 1);
          }
        }
      }
    }
    if (this._isDefaultSelectorEnabled()) {
      this._updateSelector(selected.row);
    }
    this._applySelected(selected);

    // update firstSelectedRow option
    var newKey = null;
    var rowSelection = this._getRowSelectionFromKeySet(selected.row);
    if (rowSelection != null && rowSelection.length > 0) {
      var range = rowSelection[0];
      if (range.startKey != null) {
        newKey = range.startKey[Table._CONST_ROW];
      }
    }
    this._setFirstSelectedRow(newKey);

    // sync selection option with new selected value
    if (!skipSelectionUpdate) {
      var selection = this._getSelectionEquivalent(selected);
      this.option('selection', selection, {
        _context: {
          writeback: true,
          internalSet: true
        }
      });
    }
  }
};

/**
 * @private
 */
Table.prototype._setFirstSelectedRow = function (newKey) {
  // only update the firstSelectedRow option if it has changed
  var currentFirstSelectedRow = this.option('firstSelectedRow');
  if (!oj.KeyUtils.equals(newKey, currentFirstSelectedRow.key)) {
    var newData = null;
    if (newKey != null) {
      var row = this.getDataForVisibleRow(this._getRowIdxForRowKey(newKey));
      if (row != null) {
        newData = row[Table._CONST_DATA];
      } else if (this._validatedSelectedRowKeyData) {
        for (var i = 0; i < this._validatedSelectedRowKeyData.length; i++) {
          var rowKeyData = this._validatedSelectedRowKeyData[i];
          if (oj.KeyUtils.equals(newKey, rowKeyData.key)) {
            newData = rowKeyData.data;
            break;
          }
        }
      }
    }
    this.option('firstSelectedRow', { key: newKey, data: newData }, {
      _context: {
        writeback: true,
        internalSet: true
      }
    });
  }
};

/**
 * @private
 */
Table.prototype._getSelectedEquivalent = function (selection) {
  var selected;
  if (selection != null) {
    selected = { row: new oj.KeySetImpl(), column: new oj.KeySetImpl() };
    var rowKeySet = selected.row;
    var columnKeySet = selected.column;

    var selectionCount = selection.length;
    for (var i = 0; i < selectionCount; i++) {
      var rangeObj = selection[i];
      if ((rangeObj.startKey == null && rangeObj[Table._CONST_STARTINDEX] == null) ||
          (rangeObj.endKey == null && rangeObj[Table._CONST_ENDINDEX] == null)) {
        Logger.error('Error: Invalid range object in selection. Both start and end objects must be specified');
        // eslint-disable-next-line no-continue
        continue;
      }

      var retObj = this._processRowRangeSelection(rangeObj, rowKeySet, columnKeySet);
      rowKeySet = retObj.rowKeySet;
      columnKeySet = retObj.columnKeySet;
      // it's not a row range, proceed to process column ranges
      if (retObj.status === false) {
        retObj = this._processColumnRangeSelection(rangeObj, rowKeySet, columnKeySet);
        if (retObj.status === false) {
          Logger.error('Error: Invalid range object');
        }
        rowKeySet = retObj.rowKeySet;
        columnKeySet = retObj.columnKeySet;
      }
    }

    // update if the keyset has actually changed as a result of processing range selection
    // note that since KeySet is immutable, the only time when it will return the same
    // instance is if nothing has changed, so using !== is fine.
    if (selected.row !== rowKeySet || selected.column !== columnKeySet) {
      selected = { row: rowKeySet, column: columnKeySet };
    }
  } else {
    // pre-7.0.0, null was handled without issue even though it wasn't part of the doc
    selected = { row: new oj.KeySetImpl(), column: new oj.KeySetImpl() };
  }
  return selected;
};

/**
 * @private
 */
Table.prototype._getSelectionEquivalent = function (selected) {
  var selection = this._getRowSelectionFromKeySet(selected.row);
  // if there is a row selection, return that selection as it takes precedence over column selection
  if (selection.length > 0 || selection.inverted) {
    return selection;
  }
  selection = this._getColumnSelectionFromKeySet(selected.column);
  // otherwise, if there is a column selection, return that selection
  if (selection.length > 0 || selection.inverted) {
    return selection;
  }
  // if there is no row or column selection, return an empty selection state
  return [];
};

/**
 * Derive the value of row selection (ranges) from selected row KeySet
 * @private
 */
Table.prototype._getRowSelectionFromKeySet = function (keySet) {
  var selection = [];
  var iterator = keySet.isAddAll() ? keySet.deletedValues() : keySet.values();
  iterator.forEach(function (key) {
    var range = { startKey: { row: key }, endKey: { row: key } };
    var index = this._getDataSourceRowIndexForRowKey(key);
    if (!isNaN(index) && index >= 0) {
      range.startIndex = { row: index };
      range.endIndex = { row: index };
    }
    selection.push(range);
  }, this);
  selection.inverted = keySet.isAddAll();
  return selection;
};

/**
 * Derive the value of column selection (ranges) from selected column KeySet
 * @private
 */
Table.prototype._getColumnSelectionFromKeySet = function (keySet) {
  var selection = [];
  var iterator = keySet.isAddAll() ? keySet.deletedValues() : keySet.values();
  iterator.forEach(function (key) {
    var range = { startKey: { column: key }, endKey: { column: key } };
    var index = this._getColumnIdxForColumnKey(key);
    if (index >= 0) {
      range.startIndex = { column: index };
      range.endIndex = { column: index };
    }
    selection.push(range);
  }, this);
  selection.inverted = keySet.isAddAll();
  return selection;
};

/**
 * Applies the 'selected' state on the Table
 * @param {Object} selected The selected state.
 * @private
 */
Table.prototype._applySelected = function (selected) {
  var rowKeySet = selected.row;
  var columnKeySet = selected.column;

  // remove selection state from previously selected rows that are no longer selected
  var prevSelectedRows = this._getSelectedRowIdxs();
  prevSelectedRows.forEach(function (rowIndex) {
    var row = this._getTableBodyRow(rowIndex);
    if (!rowKeySet.has(this._getRowKey(row))) {
      this._applyRowSelection(rowIndex, row, false);
      this._setLastRowSelection(rowIndex, false);
    }
  }, this);

  if (this._isRowSelectionEnabled()) {
    // apply selection state to selected rows
    if (rowKeySet.isAddAll()) {
      var rows = this._getTableBodyRows();
      rows.forEach(function (row, index) {
        if (rowKeySet.has(this._getRowKey(row))) {
          this._applyRowSelection(index, row, true);
        }
      }, this);

      var lastRowIndex = rows.length - 1;
      var lastRowKey = this._getRowKeyForRowIdx(lastRowIndex);
      this._setLastRowSelection(lastRowIndex, rowKeySet.has(lastRowKey));
    } else {
      rowKeySet.values().forEach(function (rowKey) {
        var index = this._getRowIdxForRowKey(rowKey);
        if (index != null && index >= 0) {
          this._applyRowSelection(index, this._getTableBodyRow(index), true);
          this._setLastRowSelection(index, true);
        }
      }, this);
    }
  }

  // cleanup touch selection affordance if present
  var currentSelectedRows = this._getSelectedRowIdxs();
  if (currentSelectedRows.length === 0) {
    this._removeTableBodyRowTouchSelectionAffordance();
  }

  // remove selection state from previously selected columns that are no longer selected
  var prevSelectedColumns = this._getSelectedHeaderColumnIdxs();
  prevSelectedColumns.forEach(function (columnIndex) {
    if (!columnKeySet.has(this._getColumnKeyForColumnIdx(columnIndex))) {
      this._applyColumnSelection(columnIndex, false);
    }
  }, this);

  if (this._isColumnSelectionEnabled()) {
    // apply selection state to selected columns
    if (columnKeySet.isAddAll()) {
      var headers = this._getTableHeaderColumns();
      headers.forEach(function (header, index) {
        if (columnKeySet.has(this._getColumnKeyForColumnIdx(index))) {
          this._applyColumnSelection(index, true);
        }
      }, this);

      var lastColumnIndex = headers.length - 1;
      var lastColumnKey = this._getColumnKeyForColumnIdx(lastColumnIndex);
      this._setLastHeaderColumnSelection(lastColumnIndex, columnKeySet.has(lastColumnKey));
    } else {
      columnKeySet.values().forEach(function (columnKey) {
        var index = this._getColumnIdxForColumnKey(columnKey);
        if (index != null && index >= 0) {
          this._applyColumnSelection(index, true);
        }
      }, this);
    }
  }
};

/**
 * Applies or removes the selection state to the specified row.
 * @param {number} index The row index.
 * @param {Element} tableBodyRow The <tr> element of the row.
 * @param {boolean} selected True if the selection state should be applied, false if it should be removed.
 * @private
 */
Table.prototype._applyRowSelection = function (rowIdx, tableBodyRow, selected) {
  var rowSelected = tableBodyRow.classList.contains(Table.MARKER_STYLE_CLASSES._SELECTED);
  if (rowSelected !== selected) {
    if (!selected) {
      tableBodyRow.classList.remove(Table.MARKER_STYLE_CLASSES._SELECTED);
    } else {
      tableBodyRow.classList.add(Table.MARKER_STYLE_CLASSES._SELECTED);
    }

    // Set the draggable property on the row element if the dnd.drag.rows option is specified
    var dragOption = this.options.dnd.drag;
    if (dragOption && (dragOption === 'rows' || dragOption.rows)) {
      // eslint-disable-next-line no-param-reassign
      tableBodyRow.draggable = selected;
    }
  }

  // if selection was set then we want to override the default style precedence
  if (selected) {
    this._updateRowStateCellsClass(rowIdx, {
      hover: false,
      focused: false,
      selected: true
    });
  } else {
    this._updateRowStateCellsClass(rowIdx, { selected: false });
  }
};

/**
 * Applies or removes the selection state to the specified column.
 * @param {number} index The column index.
 * @param {boolean} selected True if the selection state should be applied, false if it should be removed.
 * @private
 */
Table.prototype._applyColumnSelection = function (columnIdx, selected) {
  this._setHeaderColumnState(columnIdx, { selected: selected });
};

/**
 * Set the last row which was selected (chronologically)
 * @param {number} rowIdx  row index
 * @param {boolean} selected  whether it's selected
 * @private
 */
Table.prototype._setLastRowSelection = function (rowIdx, selected) {
  if (!this._lastSelectedRowIdxArray) {
    this._lastSelectedRowIdxArray = [];
  }
  var lastSelectedRowIdxArrayCount = this._lastSelectedRowIdxArray.length;
  for (var i = 0; i < lastSelectedRowIdxArrayCount; i++) {
    if (this._lastSelectedRowIdxArray[i] === rowIdx) {
      this._lastSelectedRowIdxArray.splice(i, 1);
      break;
    }
  }
  if (selected) {
    this._lastSelectedRowIdxArray.push(rowIdx);
  }
};

/**
 * Set the last column which was selected (chronologically)
 * @param {number} columnIdx  column index
 * @param {boolean} selected  whether it's selected
 * @private
 */
Table.prototype._setLastHeaderColumnSelection = function (columnIdx, selected) {
  if (!this._lastSelectedColumnIdxArray) {
    this._lastSelectedColumnIdxArray = [];
  }
  var lastSelectedColumnIdxArrayCount = this._lastSelectedColumnIdxArray.length;
  for (var i = 0; i < lastSelectedColumnIdxArrayCount; i++) {
    if (this._lastSelectedColumnIdxArray[i] === columnIdx) {
      this._lastSelectedColumnIdxArray.splice(i, 1);
      break;
    }
  }
  if (selected) {
    this._lastSelectedColumnIdxArray.push(columnIdx);
  }
};

/**
 * @private
 */
Table.prototype._handleSelectionGesture = function (index, isRow, isMultiSelectGesture) {
  var selected = this.option('selected');
  var rowKeySet = selected.row;
  var columnKeySet = selected.column;
  if (isRow) {
    columnKeySet = columnKeySet.clear();
    if (this._isRowSelectionEnabled()) {
      var rowSelectionMode = this._getRowSelectionMode();
      var rowKey = this._getRowKeyForRowIdx(index);
      if (!rowKeySet.has(rowKey)) {
        // handle multiple selection gesture
        if (isMultiSelectGesture && rowSelectionMode === Table._OPTION_SELECTION_MODES._MULTIPLE) {
          // add row to the existing selection
          rowKeySet = rowKeySet.add([rowKey]);
        } else {
          // selection is now the new row key
          rowKeySet = new oj.KeySetImpl([rowKey]);
        }
      } else if (!isMultiSelectGesture && this._getSelectedRowIdxs().length > 1 &&
                 rowSelectionMode === Table._OPTION_SELECTION_MODES._MULTIPLE) {
        // selection is now the new row key
        rowKeySet = new oj.KeySetImpl([rowKey]);
      } else {
        // remove row from the existing selection
        rowKeySet = rowKeySet.delete([rowKey]);
      }
    }
  } else if (this._isColumnSelectionEnabled()) {
    rowKeySet = rowKeySet.clear();
    var columnSelectionMode = this._getColumnSelectionMode();
    if (index > -1) {
      var columnKey = this._getColumnKeyForColumnIdx(index);
      if (!columnKeySet.has(columnKey)) {
        // handle multiple selection gesture
        if (isMultiSelectGesture &&
            columnSelectionMode === Table._OPTION_SELECTION_MODES._MULTIPLE) {
          // add column to the existing selection
          columnKeySet = columnKeySet.add([columnKey]);
        } else {
          // selection is now the new column key
          columnKeySet = new oj.KeySetImpl([columnKey]);
        }
      } else if (!isMultiSelectGesture && this._getSelectedHeaderColumnIdxs().length > 1 &&
                columnSelectionMode === Table._OPTION_SELECTION_MODES._MULTIPLE) {
        // selection is now the new column key
        columnKeySet = new oj.KeySetImpl([columnKey]);
      } else {
        // remove column from the existing selection
        columnKeySet = columnKeySet.delete([columnKey]);
      }
    }
  }
  // only update selection if this gesture led to a new selection state
  if (selected.row !== rowKeySet || selected.column !== columnKeySet) {
    selected = { row: rowKeySet, column: columnKeySet };
    if (this._isSelectionRequiredSatisfied(selected)) {
      this._setSelected(selected);
    }
  }
};

/**
 * Callback handler mouse move for selection.
 * @param {Element} element
 * @param {boolean=} isTouchAffordance true if this is from a touch affordance
 * @private
 */
Table.prototype._handleMouseEnterSelection = function (element, isTouchAffordance) {
  // skip selection state updates if row selection is not enabled
  if (!this._isRowSelectionEnabled()) {
    return;
  }
  var rowIdx = this._getElementRowIdx(element);
  if (this._mouseDownRowIdx != null && rowIdx != null && this._mouseDownRowIdx !== rowIdx) {
    if (this._getRowSelectionMode() === Table._OPTION_SELECTION_MODES._MULTIPLE) {
      this._selectRange(this._mouseDownRowIdx, rowIdx, true);
    } else {
      this._selectRange(rowIdx, rowIdx, true);
    }
    if (rowIdx < this._mouseDownRowIdx) {
      this._moveTableBodyRowTouchSelectionAffordanceTop(rowIdx);
    } else {
      this._moveTableBodyRowTouchSelectionAffordanceBottom(rowIdx);
    }
  } else if (rowIdx != null && rowIdx === this._mouseDownRowIdx) {
    if (isTouchAffordance) {
      this._selectRange(rowIdx, rowIdx, true);
      this._moveTableBodyRowTouchSelectionAffordanceTop(rowIdx);
      this._moveTableBodyRowTouchSelectionAffordanceBottom(rowIdx);
    } else {
      this._clearSelectedRows();
    }
  }
};

/**
 * Select range of rows or columns from start to end index
 * @param {number} firstSelctedIndex the first selected index
 * @param {number} lastSelectedIndex the last selected index
 * @param {boolean} isRow whether this is a range of rows
 * @private
 */
Table.prototype._selectRange = function (firstSelectedIndex, lastSelectedIndex, isRow) {
  var selected = this.option('selected');
  var rowKeySet = selected.row;
  var columnKeySet = selected.column;

  var i;
  if (isRow) {
    columnKeySet = columnKeySet.clear();
    if (this._isRowSelectionEnabled()) {
      rowKeySet = rowKeySet.clear();

      // selected rows should be added in the order that they are selected
      if (firstSelectedIndex <= lastSelectedIndex) {
        for (i = firstSelectedIndex; i <= lastSelectedIndex; i++) {
          rowKeySet = rowKeySet.add([this._getRowKeyForRowIdx(i)]);
        }
      } else {
        for (i = firstSelectedIndex; i >= lastSelectedIndex; i--) {
          rowKeySet = rowKeySet.add([this._getRowKeyForRowIdx(i)]);
        }
      }
      // save last selected row, so that selection can be continued using shift+arrow keys(up/down)
      this._lastSelectedRowIdx = lastSelectedIndex;
    }
  } else {
    rowKeySet = rowKeySet.clear();
    if (this._isColumnSelectionEnabled()) {
      columnKeySet = columnKeySet.clear();

      // selected columns should be added in the order that they are selected
      if (firstSelectedIndex <= lastSelectedIndex) {
        for (i = firstSelectedIndex; i <= lastSelectedIndex; i++) {
          columnKeySet = columnKeySet.add([this._getColumnKeyForColumnIdx(i)]);
        }
      } else {
        for (i = firstSelectedIndex; i >= lastSelectedIndex; i--) {
          columnKeySet = columnKeySet.add([this._getColumnKeyForColumnIdx(i)]);
        }
      }
      // save last selected column, so that selection can be continued using shift+arrow keys(left/right)
      this._lastSelectedHeaderIdx = lastSelectedIndex;
    }
  }
  // only update selection if this gesture led to a new selection state
  if (selected.row !== rowKeySet || selected.column !== columnKeySet) {
    selected = { row: rowKeySet, column: columnKeySet };
    if (this._isSelectionRequiredSatisfied(selected)) {
      this._setSelected(selected);
    }
  }
};

/**
 * Return whether the row is selected
 * @param {number} rowIdx  row index
 * @return {boolean} whether the row is selected
 * @private
 */
Table.prototype._getRowSelection = function (rowIdx) {
  return this._getTableBodyRow(rowIdx).classList.contains(Table.MARKER_STYLE_CLASSES._SELECTED);
};

/**
 * Return whether the column header at the index is selected
 * @param {number} columnIdx  column index
 * @return {boolean} whether it's selected
 * @private
 */
Table.prototype._getHeaderColumnSelection = function (columnIdx) {
  var headerColumn = this._getTableHeaderColumn(columnIdx);
  return headerColumn.classList.contains(Table.MARKER_STYLE_CLASSES._SELECTED);
};

/**
 * Return the selected row indexes
 * @return {Array} array of row indexes
 * @private
 */
Table.prototype._getSelectedRowIdxs = function () {
  // selected rows have the selected css class
  return this._getRowIdxsForElementsWithStyleClass(
    '.' + Table.CSS_CLASSES._TABLE_DATA_ROW_CLASS + '.' + Table.MARKER_STYLE_CLASSES._SELECTED);
};

/**
 * Return the selected column header indexes
 * @return {Array} array of column header indexes
 * @private
 */
Table.prototype._getSelectedHeaderColumnIdxs = function () {
  // selected column headers have the selected css class
  return this._getColumnIdxsForElementsWithStyleClass(
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS + '.' + Table.MARKER_STYLE_CLASSES._SELECTED);
};

/**
 * Clear the selected rows
 * @private
 */
Table.prototype._clearSelectedRows = function () {
  this._selectionAnchorIdx = null;
  this._lastSelectedRowIdx = null;
  var rowKeySet = this.option('selected.row');
  var newRowKeySet = rowKeySet.clear();
  if (newRowKeySet !== rowKeySet) {
    var selected = { row: newRowKeySet, column: this.option('selected.column') };
    this._setSelected(selected);
  }
};

/**
 * Clear entire selection state
 * @private
 */
Table.prototype._clearSelectionState = function () {
  this._selectionAnchorIdx = null;
  this._lastSelectedRowIdx = null;
  this._lastSelectedHeaderIdx = null;
  if (this._hasSelected()) {
    var selected = { row: new oj.KeySetImpl(), column: new oj.KeySetImpl() };
    this._setSelected(selected);
  }
};

/**
 * Set selector values
 * @param {Object} selected the selected key set
 * @private
 */
Table.prototype._updateSelector = function (selected) {
  var table = this._getTable();
  var selectors = table.getElementsByClassName(Table.CSS_CLASSES._TABLE_DATA_ROW_SELECTOR_CLASS);
  for (var i = 0; i < selectors.length; i++) {
    selectors[i].selectedKeys = selected;
  }
  var headerSelectorElements =
    table.getElementsByClassName(Table.CSS_CLASSES._TABLE_HEADER_SELECTOR_CLASS);
  if (headerSelectorElements.length > 0) {
    headerSelectorElements[0].selectedKeys = selected;
  }
};



/* global Components:false, DataCollectionUtils:false, Table:false, ThemeUtils:false */

/**
 * @ojcomponent oj.ojTable
 * @augments oj.baseComponent
 *
 * @since 0.6.0
 * @ojshortdesc A table displays data items in a tabular format with highly interactive features.
 * @ojrole application
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
 * @ojtsimport {module: "ojcommontypes", type: "AMD", importName: ["CommonTypes"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojTable<K, D> extends baseComponent<ojTableSettableProperties<K,D>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojTableSettableProperties<K,D> extends baseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["selectionMode.row", "selectionMode.column", "display", "horizontalGridVisible", "verticalGridVisible"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["data", "columns", "selected.row", "selected.column", "firstSelectedRow"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 2
 *
 * @ojuxspecs ['table']
 *
 * @classdesc
 * <h3 id="tableOverview-section">
 *   JET Table
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tableOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Table enhances a HTML table element into one that supports all
 * the features in JET Table.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-table
 *   aria-label="Departments Table"
 *   data='{{datasource}}'
 *   columns='[{"headerText": "Department Id", "field": "DepartmentId"},
 *             {"headerText": "Department Name", "field": "DepartmentName"},
 *             {"headerText": "Location Id", "field": "LocationId"},
 *             {"headerText": "Manager Id", "field": "ManagerId"}]' &gt;
 * &lt;/oj-table>
 * </code>
 * </pre>
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
 * <p>Developers should always either specify the <code class="prettyprint">aria-label</code> attribute or use other alternatives for the table element to conform to accessibility guidelines.</p>
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Data Set Size</h4>
 * <p>As a rule of thumb, it's recommended that applications limit the amount of data to display.  Displaying large
 * numbers of items in Table makes it hard for users to find what they are looking for, but affects the
 * rendering performance as well.  If displaying large numbers of items is neccessary, consider use a paging control with Table
 * to limit the number of items to display at a time.  Also consider setting <code class="prettyprint">scrollPolicy</code> to
 * 'loadMoreOnScroll' to enable high-water mark scrolling to reduce the number of items to display initially .</p>
 *
 * <h4>Cell Content</h4>
 * <p>Table allows developers to specify arbitrary content inside its cells. In order to minimize any negative effect on
 * performance, you should avoid putting a large number of heavy-weight components inside a cell because as you add more complexity
 * to the structure, the effect will be multiplied because there can be many items in the Table.</p>
 *
 * <h3 id="animation-section">
 *   Animation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#animation-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"animationDoc"}
 *
 */

Table.prototype.version = '1.0.0';

Table.prototype.defaultElement = '<table>';

Table.prototype.widgetEventPrefix = 'oj';

Table.prototype.options = {
  /**
   * Accessibility attributes.
   *
   * @expose
   * @name accessibility
   * @public
   * @instance
   * @memberof oj.ojTable
   * @type {Object|null}
   *
   * @example <caption>Initialize the Table, overriding accessibility value:</caption>
   * &lt;!-- Using dot notation -->
   * &lt;oj-table accessibility.row-header='headerColumnId'>&lt;/oj-table>
   *
   * &lt;!-- Using JSON notation -->
   * &lt;oj-table accessibility='{"rowHeader":"headerColumnId"}'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">accessibility</code> property after initialization:</caption>
   * // Get one
   * var value = myTable.accessibility.rowHeader;
   *
   * // Set one. Always use the setProperty API for
   * // subproperties rather than setting a subproperty directly.
   * myTable.setProperty('accessibility.rowHeader', 'headerColumnId');
   *
   * // Get all
   * var values = myTable.accessibility;
   *
   * // Set all.  Must list every accessibility key, as those not listed are lost.
   * myTable.accessibility = {
   *     rowHeader: 'headerColumnId'
   * };
   */
  accessibility: null,

  /**
   * The column id to be used as the row header by screen readers.
   *
   * <p>The td cells in the column specified by this
   * attribute will be assigned an id and then referenced by the
   * headers attribute in the rest of the cells in the row.
   * This is required by screen readers. By default the first column
   * will be taken as the row header.</p>
   * <p>See the <a href="#accessibility">accessibility</a> attribute for usage examples.</p>
   *
   * @expose
   * @name accessibility.rowHeader
   * @ojshortdesc Specifies the column id to be used as the row header by screen readers. See the Help documentation for more information.
   * @memberof! oj.ojTable
   * @instance
   * @public
   * @type {string}
   */
  /**
   * Triggered when the default animation of a particular action is about to start.  The default animation can be cancelled by calling <code class="prettyprint">event.preventDefault</code>.
   * If the event listener calls <code class="prettyprint">event.preventDefault</code> to cancel the default animation, it must call the <code class="prettyprint">event.detail.endCallback</code> function when it finishes its own animation handling.
   * Row animations will only be triggered for rows in the current viewport and an event will be triggered for each cell in the animated row.
   *
   * @expose
   * @event
   * @memberof oj.ojTable
   * @ojshortdesc Triggered when a default animation is about to start.
   * @instance
   * @ojbubbles
   * @ojcancelable
   * @property {"add"|"remove"|"update"} action The action that triggers the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
   * @property {Element} element The target of animation. For row animations this will be the cell contents wrapped in a div.
   * @property {function():void} endCallback If the event listener calls event.preventDefault to cancel the default animation, it must call the endCallback function when it finishes its own animation handling and when any custom animation ends.
   */
  animateStart: null,

  /**
   * Triggered when the default animation of a particular action has ended.  Note this event will not be triggered if application cancelled the default animation on animateStart.
   * Row animations will only be triggered for rows in the current viewport and an event will be triggered for each cell in the animated row.
   *
   * @expose
   * @event
   * @memberof oj.ojTable
   * @ojshortdesc Triggered when a default animation has ended.
   * @instance
   * @ojbubbles
   * @ojcancelable
   * @property {"add"|"remove"|"update"} action The action that triggered the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
   * @property {Element} element The target of animation. For row animations this will be the cell contents wrapped in an HTML div element.
   */
  animateEnd: null,

  /**
   * Table's current row can be on index and/or key value, when both are specified, the index is used as a hint.
   * @typedef {Object} oj.ojTable.CurrentRow
   * @ojsignature [{target:"Type", value:"{rowIndex: number, rowKey?: K}|{rowIndex?: number, rowKey: K}"},
   *               {target:"Type", value:"<K>", for: "genericTypeParameters"}]
   */

  /**
   * An alias for the current context when referenced inside the cell template. This can be especially useful
   * if oj-bind-for-each element is used inside the cell template since it has its own scope of data access.
   *
   * @ojshortdesc An alias for the '$current' context variable passed to the content of the cell template.
   *
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @type {string}
   * @default ''
   * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
   *
   * @example <caption>Initialize the Table with the <code class="prettyprint">as</code> attribute specified:</caption>
   * &lt;oj-table as='cell' columns='[{"headerText": "Department Id",
   *                                   "field": "DepartmentId",
   *                                   "template": "cellTemplate"}]'>
   *   &lt;template slot='cellTemplate'>
   *     &lt;p>&lt;oj-bind-text value='[[cell.data.name]]'>&lt;/oj-bind-text>&lt;/p>
   *   &lt;/template>
   * &lt;/oj-table>
   */
  as: '',

  /**
   * The row that currently has keyboard focus.  Can be an index and/or key value.
   * When both are specified, the index is used as a hint.
   * Returns the current row or null if there is none.
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies the row that currently has keyboard focus. See the Help documentation for more information.
   * @type {Object}
   * @ojsignature {target: "Type", value: "oj.ojTable.CurrentRow<K> | null"}
   * @default null
   * @ojwriteback
   *
   * @example <caption>Initialize the Table with the <code class="prettyprint">current-row</code> attribute specified:</caption>
   * &lt;oj-table current-row='{"rowIndex": 1}'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">currentRow</code> property after initialization:</caption>
   * // getter
   * var value = myTable.currentRow;
   *
   * // setter
   * myTable.currentRow = {rowKey: '123'};
   */
  currentRow: null,

  /**
   * The data to bind to the element.
   * <p>
   * Must be of type oj.DataProvider {@link oj.DataProvider}
   * or type oj.TableDataSource {@link oj.TableDataSource}
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies the data for the table. See the Help documentation for more information.
   * @type {Object|null}
   * @ojsignature [{target: "Type", value: "oj.DataProvider<K, D>|null"},
   *               {target: "Type", value: "oj.DataProvider|oj.TableDataSource|null", consumedBy:"js"}]
   * @default null
   *
   * @example <caption>Initialize the Table with the <code class="prettyprint">data</code> attribute specified:</caption>
   * &lt;oj-table data='{{dataProvider}}'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
   * // getter
   * var dataProvider = myTable.data;
   *
   * // setter
   * myTable.data = dataProvider;
   */
  data: null,

  /**
   * Whether to display table in list or grid mode. Setting a value of grid
   * will cause the table to display in grid mode. The default value of this
   * attribute is set through the theme.
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies whether to display this table in list or grid mode. See the Help documentation for more information.
   * @type {string}
   * @ojvalue {string} "list" Display table in list mode.
   * @ojvalue {string} "grid" Display table in grid mode. This is a more compact look than list mode.
   * @default "list"
   *
   * @example <caption>Initialize the Table with the <code class="prettyprint">display</code> attribute specified:</caption>
   * &lt;oj-table display='grid'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">display</code> property after initialization:</caption>
   * // getter
   * var displayValue = myTable.display;
   *
   * // setter
   * myTable.display = 'grid';
   */
  display: 'list',

  /**
   * Enable drag and drop functionality.<br><br>
   * JET provides support for HTML5 Drag and Drop events.  Please refer to {@link https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop third party documentation}
   * on HTML5 Drag and Drop to learn how to use it.
   *
   * @type {Object}
   * @expose
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies drag and drop features. See the Help documentation for more information.
   *
   * @example <caption>Initialize the table with some dnd functionality:</caption>
   * &lt;!-- Using dot notation -->
   * &lt;oj-table dnd.reorder.columns='enabled' dnd.drag.rows.dataTypes='application/ojtablerows+json'>&lt;/oj-table>
   *
   * &lt;!-- Using JSON notation -->
   * &lt;oj-table dnd='{"reorder":{"columns":"enabled"}, "drag":{"rows":{"dataTypes":"application/ojtablerows+json"}}}'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">dnd</code> property after initialization:</caption>
   * // Get one
   * var value = myTable.dnd.reorder;
   *
   * // Set one, leaving the others intact. Use the setProperty API for
   * // subproperties so that a property change event is fired.
   * myTable.setProperty('dnd.reorder', {"columns":"enabled"});
   *
   * // Get all
   * var values = myTable.dnd;
   *
   * // Set all.  Must list every dnd functionality, as those not listed are lost.
   * myTable.dnd = {
   *     reorder: {"columns":"enabled"},
   *     drag: {"rows":{"dataTypes":"application/ojtablerows+json"}}
   * };
   */
  dnd: {
    /**
     * An object that describes drag functionality.
     *
     * <p>See the <a href="#dnd">dnd</a> attribute for usage examples.
     *
     * @expose
     * @name dnd.drag
     * @ojshortdesc An object that describes drag functionality.
     * @memberof! oj.ojTable
     * @instance
     * @type {Object}
     * @default null
     */
    drag: null,

    /**
     * @typedef {object} oj.ojTable.DragRowContext Context for table DnD on Rows
     * @property {Array<Object>} rows An array of objects, with each object representing the data of one selected row in the structure below.
     * @property {any} rows.data The raw row data.
     * @property {number} rows.index The index for the row.
     * @property {any} rows.key The key value for the row.
     * @ojsignature [{target:"Type", value:"<K,D>", for:"genericTypeParameters"},
     *               {target:"Type", value:"D", for:"rows.data", jsdocOverride:true},
     *               {target:"Type", value:"K", for:"rows.key", jsdocOverride:true}]
     */
    /**
     * If this object is specified, the table will initiate drag operation when the user drags on selected rows.
     *
     * <p>See the <a href="#dnd">dnd</a> attribute for usage examples.
     *
     * @property {string | Array.<string>} [dataTypes] The MIME types to use for the dragged data in the dataTransfer object.  This can be a string if there is only one
     * type, or an array of strings if multiple types are needed.<br><br>
     * For example, if selected rows of employee data are being dragged, dataTypes could be "application/employees+json". Drop targets can examine the data types and decide
     * whether to accept the data. A text input may only accept "text" data type, while a chart for displaying employee data may be configured to accept the "application/employees+json" type.<br><br>
     * For each type in the array, dataTransfer.setData will be called with the specified type and the JSON version of the selected rows data as the value. The selected rows data
     * is an array of objects, with each object representing one selected row in the format returned by TableDataSource.get().<br><br>
     * This property is required unless the application calls setData itself in a dragStart callback function.
     * @property {function(DragEvent, oj.ojTable.DragRowContext<K,D>):void} [dragStart] A callback function that receives the "dragstart" event and context information as its arguments.<br><br>
     * <code class="prettyprint">function(event, context)</code><br><br>
     * Parameters:<br><br>
     * <code class="prettyprint">event</code>: The DOM event object<br><br>
     * <code class="prettyprint">context</code>: {@link oj.ojTable.DragRowContext} object with the following properties:<br>
     * <ul>
     *   <li><code class="prettyprint">rows</code>: An array of objects, with each object representing the data of one selected row in the structure below:
     *     <table>
     *     <tbody>
     *     <tr><td><b>data</b></td><td>The raw row data</td></tr>
     *     <tr><td><b>index</b></td><td>The index for the row</td></tr>
     *     <tr><td><b>key</b></td><td>The key value for the row</td></tr>
     *     </tbody>
     *     </table>
     *   </li>
     * </ul><br><br>
     * This function can set its own data and drag image as needed. If dataTypes is specified, event.dataTransfer is already populated with the default data when this function is invoked.
     * If dataTypes is not specified, this function must call event.dataTransfer.setData to set the data or else the drag operation will be cancelled.  In either case, the drag image is
     * set to an image of the selected rows visible on the table.
     * @property {function(DragEvent):void} [drag] A callback function that receives the "drag" event as its argument.<br><br>
     * <code class="prettyprint">function(event)</code><br><br>
     * Parameters:<br><br>
     * <code class="prettyprint">event</code>: The DOM event object
     * @property {function(DragEvent):void} [dragEnd] A callback function that receives the "dragend" event as its argument.<br><br>
     * <code class="prettyprint">function(event)</code><br><br>
     * Parameters:<br><br>
     * <code class="prettyprint">event</code>: The DOM event object<br>
     *
     * @expose
     * @name dnd.drag.rows
     * @ojshortdesc An object that describes drag functionality for a selected set of rows. See the Help documentation for more information.
     * @memberof! oj.ojTable
     * @instance
     * @type {Object}
     */
    /**
     * An object that describes drop functionality.
     *
     * <p>See the <a href="#dnd">dnd</a> attribute for usage examples.
     *
     * @expose
     * @name dnd.drop
     * @ojshortdesc An object that describes drop functionality.
     * @memberof! oj.ojTable
     * @instance
     * @type {Object}
     * @default null
     */
    drop: null,

    /**
     * @typedef {object} oj.ojTable.DropColumnContext
     * @property {number} columnIndex The index for the column.
     */
    /**
     * An object that specifies callback functions to handle dropping columns<br><br>
     * For all callback functions, the following arguments will be passed:<br><br>
     * <code class="prettyprint">event</code>: The DOM event object<br><br>
     * <code class="prettyprint">context</code>: Context object with the following properties:
     * <ul>
     *   <li><code class="prettyprint">columnIndex</code>: The index of the column being dropped on</li>
     * </ul>
     *
     * <p>See the <a href="#dnd">dnd</a> attribute for usage examples.
     *
     * @property {string | Array.<string>} dataTypes  A data type or an array of data types this element can accept.<br><br>
     * This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
     * @property {function(DragEvent, oj.ojTable.DropColumnContext):void} [dragEnter] A callback function that receives the "dragenter" event and context information as its arguments.<br><br>
     * <code class="prettyprint">function(event, context)</code><br><br>
     * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
     * Calling <code class="prettyprint">event.preventDefault()</code> is required by HTML5 Drag and Drop to indicate acceptance of data.<br><br>
     * If dataTypes is specified, it will be matched against the drag data types to determine if the data is acceptable.  If there is a match, JET will call
     * <code class="prettyprint">event.preventDefault()</code> to indicate that the data can be accepted.
     * @property {function(DragEvent, oj.ojTable.DropColumnContext):void} [dragOver] A callback function that receives the "dragover" event and context information as its arguments.<br><br>
     * <code class="prettyprint">function(event, context)</code><br><br>
     * Similar to dragEnter, this function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.  If dataTypes is specified,
     * it will be matched against the drag data types to determine if the data is acceptable.
     * @property {function(DragEvent, oj.ojTable.DropColumnContext):void} [dragLeave] A callback function that receives the "dragleave" event and context information as its arguments.<br><br>
     * <code class="prettyprint">function(event, context)</code>
     * @property {function(DragEvent, oj.ojTable.DropColumnContext):void} drop A required callback function that receives the "drop" event and context information as its arguments.<br><br>
     * <code class="prettyprint">function(event, context)</code><br><br>
     * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data is accepted.
     *
     * @expose
     * @name dnd.drop.columns
     * @ojshortdesc An object that describes drop functionality for a selected set of columns. See the Help documentation for more information.
     * @memberof! oj.ojTable
     * @instance
     * @type {Object}
     */
    /**
     * @typedef {object} oj.ojTable.DropRowContext
     * @property {number} rowIndex The index for the row.
     */
    /**
     * An object that specifies callback functions to handle dropping rows<br><br>
     * For all callback functions, the following arguments will be passed:<br><br>
     * <code class="prettyprint">event</code>: The DOM event object<br><br>
     * <code class="prettyprint">context</code>: Context object with the following properties:
     * <ul>
     *   <li><code class="prettyprint">rowIndex</code>: The index of the row being dropped on</li>
     * </ul>
     *
     * <p>See the <a href="#dnd">dnd</a> attribute for usage examples.
     *
     * @property {string | Array.<string>} dataTypes  A data type or an array of data types this element can accept.<br><br>
     * This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
     * @property {function(DragEvent, oj.ojTable.DropRowContext):void} [dragEnter] A callback function that receives the "dragenter" event and context information as its arguments.<br><br>
     * <code class="prettyprint">function(event, context)</code><br><br>
     * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
     * Calling <code class="prettyprint">event.preventDefault()</code> is required by HTML5 Drag and Drop to indicate acceptance of data.<br><br>
     * If dataTypes is specified, it will be matched against the drag data types to determine if the data is acceptable.  If there is a match, JET will call
     * <code class="prettyprint">event.preventDefault()</code> to indicate that the data can be accepted.
     * @property {function(DragEvent, oj.ojTable.DropRowContext):void} [dragOver] A callback function that receives the "dragover" event and context information as its arguments.<br><br>
     * <code class="prettyprint">function(event, context)</code><br><br>
     * Similar to dragEnter, this function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.  If dataTypes is specified,
     * it will be matched against the drag data types to determine if the data is acceptable.
     * @property {function(DragEvent, oj.ojTable.DropRowContext):void} [dragLeave] A callback function that receives the "dragleave" event and context information as its arguments.<br><br>
     * <code class="prettyprint">function(event, context)</code>
     * @property {function(DragEvent, oj.ojTable.DropRowContext):void} drop A required callback function that receives the "drop" event and context information as its arguments.<br><br>
     * <code class="prettyprint">function(event, context)</code><br><br>
     * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data is accepted.<br><br>
     * If the application needs to look at the data for the row being dropped on, it can use the getDataForVisibleRow method.
     *
     * @expose
     * @name dnd.drop.rows
     * @ojshortdesc An object that describes drop functionality for a selected set of rows. See the Help documentation for more information.
     * @memberof! oj.ojTable
     * @instance
     * @type {Object}
     */
    /**
     * An object that describes reorder functionality.
     *
     * <p>See the <a href="#dnd">dnd</a> attribute for usage examples.
     *
     * @expose
     * @name dnd.reorder
     * @ojshortdesc An object that describes reorder functionality.
     * @memberof! oj.ojTable
     * @instance
     * @type {Object}
     */
    reorder: {
      /**
       * Enable or disable reordering the columns within the same table using drag and drop.<br><br>
       * Re-ordering is supported one column at a time. In addition, re-ordering will not re-order
       * any cells which have the colspan attribute with value > 1. Such cells will need to be re-ordered manually by listening to
       * the property change event on the columns property.
       *
       * <p>See the <a href="#dnd">dnd</a> attribute for usage examples.
       *
       * @expose
       * @name dnd.reorder.columns
       * @ojshortdesc An object that describes reorder functionality for a selected column. See the Help documentation for more information.
       * @memberof! oj.ojTable
       * @instance
       * @type {string}
       * @ojvalue {string} 'enabled' Enable column reordering.
       * @ojvalue {string} 'disabled' Disable column reordering.
       * @default "disabled"
       */
      columns: 'disabled'
    }
  },

  /**
   * Determine if the table is read-only or editable. Use 'none' if the table is strictly read-only and will be a single Tab stop on the page.
   * Use 'rowEdit' if you want single row at a time editability. The table will initially render with all rows in read-only mode. Pressing Enter/F2 or double click will make the current row editable and pressing Tab navigates to the next cell. Pressing ESC/F2 while in this mode will switch the table back to all rows in read-only mode and will be a single Tab stop the page.
   *
   * @expose
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies if the table is read-only or editable. See the Help documentation for more information.
   * @instance
   * @type {string}
   * @ojvalue {string} "none" The table is read-only and is a single Tab stop.
   * @ojvalue {string} "rowEdit" The table has single row at a time editability and the cells within the editable row are tabbable.
   * @default "none"
   *
   * @example <caption>Initialize the Table with the <code class="prettyprint">edit-mode</code> attribute specified:</caption>
   * &lt;oj-table edit-mode='rowEdit'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">editMode</code> property after initialization:</caption>
   * // getter
   * var value = myTable.editMode;
   *
   * // setter
   * myTable.editMode = 'rowEdit';
   */
  editMode: 'none',

  /**
   * Table's current edit row can be on index and/or key value, when both are specified, the index is used as a hint.
   * @typedef {Object} oj.ojTable.EditRow
   * @ojsignature [{target:"Type", value:"{rowIndex: number, rowKey?: K}|{rowIndex?: number, rowKey: K}"},
   *               {target:"Type", value:"<K>", for: "genericTypeParameters"}]
   */

  /**
   * The information about the row that is currently being edited.  The value of this property contains:
   * <ul>
   * <li>rowKey - The key of the currently edited row.</li>
   * <li>rowIndex - The index of the currently edited row.</li>
   * </ul>
   * Note that the row the is currently being edited is also the current keyboard focus row.  Therefore, when
   * this value is updated, the value of currentRow is updated also.  In addition, editRow update can be cancelled if
   * beforeCurrentRow event is vetoed.
   *
   * @expose
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies the row that is currently being edited. See the Help documentation for more information.
   * @instance
   * @default {'rowKey': null, 'rowIndex': -1}
   * @type {Object}
   * @ojsignature {target: "Type", value: "oj.ojTable.EditRow<K> | null"}
   * @ojwriteback
   *
   * @example <caption>Get the key of the edit row:</caption>
   * // getter
   * var editRowKey = myTable.editRow.rowKey;
   */
  editRow: { rowKey: null, rowIndex: -1 },

  /**
   * The text to display when there are no data in the Table. If it is not defined,
   * then a default empty text is extracted from the resource bundle.
   *
   * @expose
   * @memberof! oj.ojTable
   * @instance
   * @type {string|null}
   * @default null
   * @example <caption>Initialize the table with the <code class="prettyprint">empty-text</code> attribute specified:</caption>
   * &lt;oj-table
   *   aria-label="Departments Table"
   *   data='{{datasource}}'
   *   empty-text='No data'
   *   columns='[{"headerText": "Department Id", "field": "DepartmentId"},
   *             {"headerText": "Department Name", "field": "DepartmentName"}]'&gt;
   * &lt;/oj-table>
   *
   * @ignore
   */
  emptyText: null,

  /**
   * Whether the horizontal gridlines are to be drawn. Can be enabled or disabled.
   * The default value of auto means it's determined by the display attribute.
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies the visibility of the horizontal gridlines. See the Help documentation for more information.
   * @type {string}
   * @ojvalue {string} "auto" Determined by display attribute.
   * @ojvalue {string} "enabled" Horizontal gridlines are enabled.
   * @ojvalue {string} "disabled" Horizontal gridlines are disabled.
   * @default "auto"
   *
   * @example <caption>Initialize the Table with the <code class="prettyprint">horizontal-grid-visible</code> attribute specified:</caption>
   * &lt;oj-table horizontal-grid-visible='disabled'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">horizontalGridVisible</code> property after initialization:</caption>
   * // getter
   * var value = myTable.horizontalGridVisible;
   *
   * // setter
   * myTable.horizontalGridVisible = 'disabled';
   */
  horizontalGridVisible: 'auto',

  /**
   * The row renderer function to use.
   * <p>
   * The renderer function will be passed in an Object which contains the fields:
   * <ul>
   *   <li>componentElement: A reference to the Table root element</li>
   *   <li>data: Key/value pairs of the row</li>
   *   <li>parentElement: Empty rendered TR element</li>
   *   <li>rowContext.datasource: The "data" attribute of the Table</li>
   *   <li>rowContext.mode: The mode of the row.  It can be "edit" or "navigation".</li>
   *   <li>rowContext.status: Contains the rowIndex, rowKey, and currentRow</li>
   * </ul>
   * The function returns either a String or
   * a DOM element of the content inside the row. If the developer chooses
   * to manipulate the row element directly, the function should return
   * nothing.
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc A function that returns row content. The function takes a context argument, provided by the table. See the Help documentation for more information.
   * @type {Function|null}
   * @ojsignature {target: "Type", value: "((context: oj.ojTable.RowRendererContext<K,D>) => string | HTMLElement | void) | null"}
   * @default null
   *
   * @example <caption>Initialize the Table with the <code class="prettyprint">row-renderer</code> attribute specified:</caption>
   * &lt;oj-table row-renderer='{{myRowRenderer}}'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">rowRenderer</code> property after initialization:</caption>
   * // getter
   * var value = myTable.rowRenderer;
   *
   * // setter
   * myTable.rowRenderer = myRowRenderer;
   */
  rowRenderer: null,

  /**
   * @typedef {Object} oj.ojTable.RowRendererContext Context object passed into the rowRenderer callback function.
   * @property {Element} componentElement A reference to the Table root element.
   * @property {any} data Key/value pairs of the row.
   * @property {Element} parentElement Empty rendered TR element.
   * @property {Object} rowContext contex of the row
   * @property {oj.DataProvider<K, D>|null} rowContext.datasource The "data" attribute of the Table
   * @property {"edit"|"navigation"} rowContext.mode The mode of the row.  It can be "edit" or "navigation".
   * @property {oj.ojTable.ContextStatus<K>} rowContext.status Contains the rowIndex, rowKey, and currentRow.
   * @ojsignature [{target:"Type", value:"D", for:"data"},
   *               {target:"Type", value:"<K,D>", for:"genericTypeParameters"}]
   */

  /**
   * @typedef {Object} oj.ojTable.ContextStatus<K>
   * @property {number} rowIndex index of the row
   * @property {any} rowKey key of the row
   * @property {oj.ojTable.CurrentRow<K>} currentRow current row.
   * @ojsignature {target:"Type", value:"K", for:"rowKey", jsdocOverride:true}
   */

  /**
   * Specifies the mechanism used to scroll the data inside the table. Possible values are: "auto", "loadMoreOnScroll", and "loadAll".
   * When "loadMoreOnScroll" is specified, additional data are fetched when the user scrolls to the bottom of the table.
   * When "loadAll" is specified, table will fetch all the data when it is initially rendered.
   * If you are using Paging Control with the Table, please note that "loadMoreOnScroll" scroll-policy is not compatible with
   * Paging Control "loadMore" mode.
   *
   * @expose
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies how data are fetched as user scrolls down the table.
   * @instance
   * @type {string}
   * @ojvalue {string} "auto" Determined by element. The default is to have the same behavior as "loadMoreOnScroll" except when
   *                          legacy TableDataSource is used, in which case the behavior is the same as "loadAll".
   * @ojvalue {string} "loadAll" Fetch and render all data.
   * @ojvalue {string} "loadMoreOnScroll" Additional data are fetched when the user scrolls to the bottom of the table. Should be
   *                                      used with bounded height.
   *                   <br/>Not compatible when used with Paging Control "loadMore" mode.
   * @default "auto"
   *
   * @example <caption>Initialize the Table with the <code class="prettyprint">scroll-policy</code> attribute specified:</caption>
   * &lt;oj-table scroll-policy='loadMoreOnScroll'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">scrollPolicy</code> property after initialization:</caption>
   * // getter
   * var value = myTable.scrollPolicy;
   *
   * // setter
   * myTable.scrollPolicy = 'loadMoreOnScroll';
   */
  scrollPolicy: 'auto',

  /**
   * scrollPolicy options.
   * <p>
   * When scrollPolicy is loadMoreOnScroll, the next block of rows is fetched
   * when the user scrolls to the end of the table. The fetchSize property
   * determines how many rows are fetched in each block.
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies fetch options for scrolling behaviors that trigger data fetches.
   * @type {Object|null}
   *
   * @example <caption>Initialize the component, overriding some scroll-policy-options values and leaving the others intact:</caption>
   * &lt;!-- Using dot notation -->
   * &lt;oj-table scroll-policy-options.some-key='some value' scroll-policy-options.some-other-key='some other value'>&lt;/oj-table>
   *
   * &lt;!-- Using JSON notation -->
   * &lt;oj-table scroll-policy-options='{"someKey":"some value", "someOtherKey":"some other value"}'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">scrollPolicyOptions</code> property after initialization:</caption>
   * // Get one
   * var value = myTable.scrollPolicyOptions.someKey;
   *
   * // Set one, leaving the others intact. Always use the setProperty API for
   * // subproperties rather than setting a subproperty directly.
   * myTable.setProperty('scrollPolicyOptions.someKey', 'some value');
   *
   * // Get all
   * var values = myTable.scrollPolicyOptions;
   *
   * // Set all.  Must list every scrollPolicyOptions key, as those not listed are lost.
   * myTable.scrollPolicyOptions = {
   *     someKey: 'some value',
   *     someOtherKey: 'some other value'
   * };
   */
  scrollPolicyOptions: {
    /**
     * The number of rows to fetch in each block of rows.
     * <p>See the <a href="#scrollPolicyOptions">scroll-policy-options</a> attribute for usage examples.</p>
     *
     * @expose
     * @name scrollPolicyOptions.fetchSize
     * @ojshortdesc The number of data rows to fetch in each block.
     * @memberof! oj.ojTable
     * @instance
     * @type {number}
     * @default 25
     * @ojmin 1
     */
    fetchSize: 25,

    /**
     * The maximum number of rows which will be displayed before fetching more rows will be stopped.
     * <p>See the <a href="#scrollPolicyOptions">scroll-policy-options</a> attribute for usage examples.</p>
     *
     * @expose
     * @name scrollPolicyOptions.maxCount
     * @ojshortdesc The maximum number of rows to display before fetching more data rows will be stopped.
     * @memberof! oj.ojTable
     * @instance
     * @type {number}
     * @default 500
     * @ojmin 0
     */
    maxCount: 500
  },

  /**
   * The current scroll position of Table. The scroll position is updated when either the vertical or horizontal scroll position
   * (or its scroller, as specified in scrollPolicyOptions.scroller) has changed.  The value contains the x and y scroll position,
   * the index and key information of the item closest to the top of the viewport, as well as horizontal and vertical offset from the
   * position of the item to the actual scroll position.
   * <p>
   * The default value contains just the scroll position.  Once data is fetched the row/column index and key sub-properties will be added.
   * If there is no data then the row/column index and key sub-properties will not be available.
   * </p>
   * <p>
   * When setting the scrollPosition property, applications can change any combination of the sub-properties.
   * If multiple sub-properties are set at once they will be used in key, index, pixel order where the latter serves as hints.
   * If offsetX or offsetY are specified, they will be used to adjust the scroll position from the position where the key or index
   * of the item is located.
   * </p>
   * <p>
   * If a sparse object is set the other sub-properties will be populated and updated once Table has scrolled to that position.
   * </p>
   * <p>
   * Also, if <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll' and the scrollPosition is set to a value outside
   * of the currently rendered region, then Table will attempt to fetch until the specified scrollPosition is satisfied or the end
   * is reached (either at max count or there's no more items to fetch), in which case the scroll position will remain at the end.
   * The only exception to this is when the row key specified does not exists and a DataProvider is specified for <a href="#data">data</a>,
   * then the scroll position will not change (unless other sub-properties like row index or x/y are specified as well).
   * </p>
   * Lastly, when a re-rendered is triggered by a <a href="oj.DataProviderRefreshEvent.html">refresh event</a> from the DataProvider,
   * or if the value for <a href="#data">data</a> attribute has changed, then the scrollPosition will be adjusted such that the selection
   * anchor (typically the last row selected by the user) prior to refresh will appear at the top of the viewport after refresh.  If
   * selection is disabled or if there are no selected rows, then the scrollPosition will remain at the top.
   * </p>
   *
   * @ojshortdesc Specifies the scroll position of the table. See the Help documentation for more information.
   * @expose
   * @memberof! oj.ojTable
   * @instance
   * @type {Object}
   * @default {"x": 0, "y": 0}
   * @property {number=} x The horizontal position in pixels.
   * @property {number=} y The vertical position in pixels.
   * @property {number=} columnIndex The zero-based index of the cell at the origin of the table.
   * @property {number=} rowIndex The zero-based index of the cell at the origin of the table.  If <a href="#scrollPolicy">scrollPolicy</a>
   * is set to 'loadMoreOnScroll and the row index is greater than maxCount set in <a href="#scrollPolicyOptions">scrollPolicyOptions</a>,
   * then it will scroll and fetch until the end of the table is reached and there are no more rows to fetch.
   * @property {any=} columnKey The key of the column.  This corresponds to the identifier of the column specified in <a href="#columns">columns</a>.
   * If the column does not exists then the value is ignored.
   * @property {any=} rowKey The key of the row.  If DataProvider is used for <a href="#data">data</a> and the key does not exists in the
   * DataProvider, then the value is ignored.  If DataProvider is not used then Table will fetch and scroll until the item is found
   * or the end of the table is reached and there's no more items to fetch.
   * @property {number=} offsetX The horizontal offset in pixels relative to the column identified by columnKey/columnIndex.
   * @property {number=} offsetY The vertical offset in pixels relative to the row identified by rowKey/rowIndex.
   *
   * @ojsignature [{target:"Type", value:"K", for:"parent"},
   *               {target:"type", value:"K", for:"key"}]
   * @ojwriteback
   * @example <caption>Initialize the Table with the <code class="prettyprint">scroll-position</code> attribute specified:</caption>
   * &lt;!-- Using dot notation -->
   * &lt;oj-table scroll-position.row-index='10'>&lt;/oj-table>
   *
   * &lt;!-- Using JSON notation -->
   * &lt;oj-table scroll-position='{"rowIndex": 10}'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">scrollPosition</code> property after initialization:</caption>
   * // Get one
   * var scrollPositionValue = myTable.scrollPosition.rowIndex;
   *
   * // Set one, leaving the others intact
   * myTable.setProperty('scrollPosition.rowKey', 'row10key');
   *
   * // Get all
   * var scrollPositionValues = myTable.scrollPosition;
   *
   * // Set all.  Those not listed will be lost until the scroll completes and the remaining fields are populated.
   * myTable.scrollPosition = {x: 0, y: 150};
   */
  scrollPosition: { x: 0, y: 0 },

  /**
   * @typedef {Object} oj.ojTable.RowSelectionStart start of one row selection, can be on index or key or both.
   * @ojsignature [{target:"Type", value:"{startIndex: {row: number}, startKey?:{row: K}}|{startIndex?: {row: number}, startKey:{row: K}}"},
   *               {target:"Type", value:"<K>", for:"genericTypeParameters"}]
   */

  /**
   * @typedef {Object} oj.ojTable.RowSelectionEnd end of one row selection, can be on index or key or both.
   * @ojsignature [{target:"Type", value:"{endIndex: {row: number}, endKey?: {row: K}}|{endIndex?:{row: number}, endKey:{row: K}}"},
   *               {target:"Type", value:"<K>", for:"genericTypeParameters"}]
   */

  /**
   * @typedef {Object} oj.ojTable.ColumnSelectionStart start of one column selection, can be on index or key or both.
   * @ojsignature [{target:"Type", value:"{startIndex:{column:number}, startKey?:{column:K}}|{startIndex?:{column:number}, startKey:{column:K}}"},
   *               {target:"Type", value:"<K>", for:"genericTypeParameters"}]
   */

  /**
   * @typedef {Object} oj.ojTable.ColumnSelectionEnd end of one column selection, can be on index or key or both.
   * @ojsignature [{target:"Type", value:"{endIndex:{column:number},endKey?:{column:K}}|{endIndex?:{column:number}, endKey:{column:K}}"},
   *               {target:"Type", value:"<K>", for:"genericTypeParameters"}]
   */

  /**
   * Gets the key and data of the first selected row.  The first selected row is defined as the first
   * key returned by the <a href="#selection">selection</a> property.  The value of this property contains:
   * <ul>
   * <li>key - the key of the first selected row.</li>
   * <li>data - the data of the first selected row.  If the selected row is not locally available, this will
   *        be null.</li>
   * </ul>
   * If no rows are selected then this property will return an object with both key and data properties set to null.
   *
   * @expose
   * @memberof! oj.ojTable
   * @ojshortdesc Read-only property used for retrieving the key and data of the first selected row. See the Help documentation for more information.
   * @instance
   * @default {'key': null, 'data': null}
   * @type {Object}
   * @ojeventgroup common
   * @property {any} key The key of first selected row.
   * @property {any} data The data for first selected row.
   * @ojsignature {target:"Type", value:"CommonTypes.ItemContext<K,D>", jsdocOverride:true}
   *
   * @ojwriteback
   * @readonly
   *
   * @example <caption>Get the data of the first selected row:</caption>
   * // getter
   * var firstSelectedRowValue = myTable.firstSelectedRow;
   */
  firstSelectedRow: { key: null, data: null },

  /**
   * Specifies the current selections in the table. Can be either an index or key value.
   * When both are specified, the index is used as a hint.
   * Returns an array of range objects, or an empty array if there's no selection.
   *
   * Note that this attribute has been replaced by <a href="#selected">selected</a>, and it is recommended that
   * applications use the selected attribute going forward.
   *
   * <p>Selection range object has following subproperties:
   * <ul>
   * <li>
   * startIndex, startKey - In case of row selection, startIndex and startKey refers to first row(which is near to table header) in range selection.<br/>
   * In case of column selection, startIndex and startKey refers to first column in range selection.
   * </li>
   * <li>
   *  endIndex, endKey - In case of row selection, endIndex and endKey refers to last row(which is far from table header) in range selection.<br/>
   *  In case of column selection, endIndex and endKey refers to last column in range selection.
   * </li>
   * </ul>
   * startIndex, startKey, endIndex and endKey are of type object. In case of row selection, these objects will have 'row' subpropety. In case of column selection, objects will have 'column' subproperty.</p>
   *
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies the current selections in the table. See the Help documentation for more information.
   * @type {Array.<Object>}
   * @ojsignature {target: "Type", value: "Array<oj.ojTable.RowSelectionStart<K> & oj.ojTable.RowSelectionEnd<K>> | Array<oj.ojTable.ColumnSelectionStart<K> & oj.ojTable.ColumnSelectionEnd<K>>"}
   * @default []
   * @ojwriteback
   * @ojdeprecated {since: '7.0.0', description: 'Use selected attribute instead.'}
   *
   * @example <caption>Initialize the table with the <code class="prettyprint">selection</code> attribute specified:</caption>
   * &lt;oj-table selection='[{"startIndex": {"row":1}, "endIndex":{"row":3}}]'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">selection</code> property after initialization:</caption>
   * // Get one
   * var value = myTable.selection[0];
   *
   * // Get all
   * var values = myTable.selection;
   *
   * // Set all (There is no permissible "set one" syntax.)
   * myTable.selection = [{startIndex: {"row":1}, endIndex:{"row":3}},
   *                      {startIndex: {"row":7}, endIndex:{"row":9}}];
   *
   * @example <caption>Set a row selection using index:</caption>
   * myTable.selection = [{startIndex: {"row":1}, endIndex:{"row":3}}];
   *
   * @example <caption>Set a column selection using index:</caption>
   * myTable.selection = [{startIndex: {"column":2}, endIndex: {"column":4}}];
   *
   * @example <caption>Set a row selection using key value:</caption>
   * myTable.selection = [{startKey: {"row":"10"}, endKey:{"row":"30"}}];
   *
   * @example <caption>Set a column selection using key value:</caption>
   * myTable.selection = [{startKey: {"column": "column1"}, endKey: {"column": "column2"}}];
   */
  selection: [],

  /**
   * Specifies the current selected rows and/or columns in the table.
   * Note that property change event for the deprecated selection property will still be fired when
   * selected property has changed. In addition, <a href="AllKeySetImpl.html">AllKeySetImpl</a> set can be used to represent
   * select all state. In this case, the value for selection would have an 'inverted' property set to true,
   * and would contain index/key of the rows that are not selected.
   *
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies the current selected rows and/or columns in the table. See the Help documentation for more information.
   * @type {Object}
   * @ojsignature {target:"Type", value:"{row: oj.KeySet<K>, column: oj.KeySet<K>}"}
   * @default {row: new KeySetImpl(), column: new KeySetImpl()};
   * @ojwriteback
   * @ojeventgroup common
   *
   * @example <caption>Initialize the table with the specific rows selected:</caption>
   * myTable.selected.row = new KeySetImpl(['row1', 'row2', 'row3']);
   *
   * @example <caption>Initialize the table with the specific columns selected:</caption>
   * myTable.selected.column = new KeySetImpl(['col2', 'col4']);
   */
  selected: { row: new oj.KeySetImpl(), column: new oj.KeySetImpl() },

  /**
   * <p>Specifies whether row or column selections can be made, and the cardinality of each (single/multiple/none) selection in the Table.
   *
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies the row and column selection modes.
   * @type {Object.<string, string>|null}
   * @default null
   *
   * @example <caption>Initialize the Table, setting selection modes:</caption>
   * &lt;!-- Using dot notation -->
   * &lt;oj-table selection-mode.row='single' selection-mode.column='multiple'>&lt;/oj-table>
   *
   * &lt;!-- Using JSON notation -->
   * &lt;oj-table selection-mode='{"row":"single", "column":"multiple"}'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">selectionMode</code> property after initialization:</caption>
   * // Get one
   * var value = myTable.selectionMode.row;
   *
   * // Set one. Use the setProperty API for
   * // subproperties so that a property change event is fired.
   * myTable.setProperty('selectionMode.row', 'single');
   *
   * // Get all
   * var values = myTable.selectionMode;
   *
   * // Set all
   * myTable.selectionMode = {
   *     row: 'single',
   *     column: 'multiple'
   * };
   */
  selectionMode: null,

  /**
   * <p>The type of row selection behavior that is enabled on the Table. This attribute controls the number of selections that can be made via selection gestures at any given time.
   *
   * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the Table's selection styling will be applied to all rows specified by the <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes.
   * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the Table's selection styling will not be applied to any rows specified by the <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes.
   *
   * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> or <a href="#selected">selected</a> attributes.
   *
   * <p>See the <a href="#selectionMode">selection-mode</a> attribute for usage examples.
   * By default, this element does not allow any selection.
   *
   * @expose
   * @name selectionMode.row
   * @ojshortdesc Specifies the selection mode for rows. By default, row selection is disabled.
   * @memberof! oj.ojTable
   * @instance
   * @type {string}
   * @ojvalue {string} "none" Selection is disabled.
   * @ojvalue {string} "single" Only a single row can be selected at a time.
   * @ojvalue {string} "multiple" Multiple rows can be selected at the same time.
   */

  /**
   * <p>The type of column selection behavior that is enabled on the Table. This attribute controls the number of selections that can be made via selection gestures at any given time.
   *
   * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the Table's selection styling will be applied to all columns specified by the <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes.
   * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the Table's selection styling will not be applied to any columns specified by the <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes.
   *
   * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> or <a href="#selected">selected</a> attributes.
   *
   * <p>See the <a href="#selectionMode">selection-mode</a> attribute for usage examples.
   * By default, this element does not allow any selection.
   *
   * @expose
   * @name selectionMode.column
   * @ojshortdesc Specifies the selection mode for columns. By default, column selection is disabled.
   * @memberof! oj.ojTable
   * @instance
   * @type {string}
   * @ojvalue {string} "none" Selection is disabled.
   * @ojvalue {string} "single" Only a single column can be selected at a time.
   * @ojvalue {string} "multiple" Multiple columns can be selected at the same time.
   */

  /**
   * <p>Specifies whether selection is required on the Table. When row selection is enabled, this attribute will take effect when at least
   * one row is present. When <code class="prettyprint">true</code>, the Table will ensure that at least one valid row is selected at all
   * times. If no rows are specified by the <a href="#selection">selection</a> or <a href="#selected">selected</a> attributes, the first
   * row in the Table will be added to the selection state during initial render. Additionally, selection gestures that would otherwise
   * leave the Table with no selected rows will be disabled.
   *
   * <p>When <code class="prettyprint">true</code>, the Table will also attempt to validate all rows specified by the
   * <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes. If any rows specified are not immediately
   * available, the Table's underlying <a href="oj.DataProvider.html">DataProvider</a> will be queried. This will only occur if the
   * data provider supports <a href="oj.DataProvider.html#getCapability">getCapability</a>, and returns a
   * <a href="oj.FetchByKeysCapability.html#implementation">fetchByKeys capability implementation</a> of <code class="prettyprint">lookup</code>.
   * Any rows that fail this validation process will be removed from the <a href="#selection">selection</a> and <a href="#selected">selected</a>
   * attributes. This guarantees that the Table's <a href="#firstSelectedRow">firstSelectedRow</a> attribute is populated at all times.
   *
   * <p>Otherwise, when column selection is enabled, this attribute will take effect when at least one column is present. When
   * <code class="prettyprint">true</code>, the Table will ensure that at least one valid column is selected at all times. If no
   * columns are specified by the <a href="#selection">selection</a> or <a href="#selected">selected</a> attributes, the first
   * column in the Table will be added to the selection state during initial render. Additionally, selection gestures that would otherwise
   * leave the Table with no selected columns will be disabled.
   *
   * <p>See <a href="#selectionMode">selectionMode</a> for information on how to enable or disable selection on the Table.
   *
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies whether selection is required on the Table.
   * @type {boolean}
   * @default false
   *
   * @example <caption>Initialize the Table, setting selection required:</caption>
   * &lt;!-- Using dot notation -->
   * &lt;oj-table selection-required='true'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">selectionRequired</code> property after initialization:</caption>
   * // Get one
   * var value = myTable.selectionRequired;
   *
   * // Set one. Use the setProperty API for
   * // subproperties so that a property change event is fired.
   * myTable.setProperty('selectionRequired', 'true');
   */
  selectionRequired: false,

  /**
   * Whether the vertical gridlines are to be drawn. Can be enabled or disabled.
   * The default value of auto means it's determined by the display attribute.
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc Specifies the visibility of the vertical gridlines. See the Help documentation for more information.
   * @type {string}
   * @ojvalue {string} "auto" Determined by display attribute.
   * @ojvalue {string} "enabled" Vertical gridlines are enabled.
   * @ojvalue {string} "disabled" Vertical gridlines are disabled.
   * @default "auto"
   */
  verticalGridVisible: 'auto',

  /**
   * An array of column definitions.
   * <p>If the application change the column definitions after the Table is loaded, it must call the
   * <a href="#refresh"><code class="prettyprint">refresh()</code></a> method to update the Table display.
   *
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @ojshortdesc An array of column definitions. See the Help documentation for more information.
   * @ojwriteback
   * @type {Array.<Object>|null}
   * @default null
   * @example <caption>Initialize the table with the <code class="prettyprint">columns</code> attribute specified:</caption>
   * &lt;oj-table
   *   columns='[{"headerText": "Department Id", "field": "DepartmentId"},
   *             {"headerText": "Department Name", "field": "DepartmentName"}]'&gt;
   * &lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">columns</code> property after initialization:</caption>
   * // Get one
   * var value = myTable.columns[0];
   *
   * // Get all
   * var values = myTable.columns;
   *
   * // Set all (There is no permissible "set one" syntax.)
   * myTable.columns = [{"headerText": "Department Id", "field": "DepartmentId"},
   *                    {"headerText": "Department Name", "field": "DepartmentName"}];
   */
  columns: [{
    /**
     * @typedef {Object} oj.ojTable.ColumnsRendererContext Context object passed into the columns[].renderer callback function.
     * @property {Object} cellContext Context of the cell containing properties.
     * @property {oj.DataProvider<K, D>|null} cellContext.datasource The "data" attribute of the Table.
     * @property {"edit"|"navigation"} cellContext.mode The mode of the row.  It can be "edit" or "navigation".
     * @property {oj.ojTable.ContextStatus<K>} cellContext.status Contains the rowIndex, rowKey, and currentRow.
     * @property {number} columnIndex The column index.
     * @property {Element} componentElement A reference to the Table root element.
     * @property {any} data The cell data.
     * @property {Element} parentElement Empty rendered &lt;td> element.
     * @property {Object} row Key/value pairs of the row.
     * @ojsignature [{target:"Type", value:"D", for:"row", jsdocOverride:true},
     *               {target:"Type", value:"<K,D>", for:"genericTypeParameters"}]
     */

    /**
     * The renderer function that renders the content of the cell.
     * The function will be passed a context object which contains
     * the following objects:
     * <ul>
     *   <li>cellContext.datasource: The "data" attribute of the Table.</li>
     *   <li>cellContext.mode: The mode of the row.  It can be "edit" or "navigation".</li>
     *   <li>cellContext.status: Contains the rowIndex, rowKey, and currentRow.</li>
     *   <li>columnIndex: The column index.</li>
     *   <li>componentElement: A reference to the Table root element.</li>
     *   <li>data: The cell data.</li>
     *   <li>parentElement: Empty rendered <td> element.</li>
     *   <li>row: Key/value pairs of the row.</li>
     * </ul>
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the header.</li></ul>
     *   </li>
     *   <li>undefined: If the developer chooses to manipulate the cell element directly, the function should return undefined.</li>
     * </ul>
     * If no renderer is specified, the Table will treat the cell data as a String.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].renderer
     * @ojshortdesc A function that renders the content of the cell. The function takes a context argument, provided by the table. See the Help documentation for more information.
     * @type {Function|null}
     * @ojsignature {target: "Type", value: "?((context: oj.ojTable.ColumnsRendererContext<K,D>) => {insert: HTMLElement | string} | void) | null"}
     * @default null
     */
    renderer: null,

    /**
     * The CSS class to apply to the column cells.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].className
     * @ojshortdesc The CSS class to apply to the column cells.
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     */
    className: null,

    /**
     * The data field that this column refers to.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].field
     * @ojshortdesc The data field that this column refers to.
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     */
    field: null,

    /**
     * The CSS class to apply to the footer cell.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].footerClassName
     * @ojshortdesc The CSS class to apply to the footer cell.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    footerClassName: null,

    /**
     * @typedef {Object} oj.ojTable.FooterRendererContext Context object passed into the footerRenderer callback function.
     * @property {number} columnIndex The column index.
     * @property {Element} componentElement A reference to the Table root element.
     * @property {Object} footerContext Context of the footer.
     * @property {oj.DataProvider<K, D>|null} footerContext.datasource The "data" attribute of the Table.
     * @property {Element} parentElement Empty rendered <td> element.
     * @ojsignature {target:"Type", value:"<K,D>", for:"genericTypeParameters"}
     */
    /**
     * The renderer function that renders the content of the footer.
     * The function will be passed a context object which contains
     * the following objects:
     * <ul>
     *   <li>columnIndex: The column index</li>
     *   <li>componentElement: A reference to the Table root element</li>
     *   <li>footerContext.datasource: The "data" attribute of the Table</li>
     *   <li>parentElement: Empty rendered <td> element</li>
     * </ul>
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the footer.</li></ul>
     *   </li>
     *   <li>undefined: If the developer chooses to manipulate the footer element directly, the function should return undefined.</li>
     * </ul>
     * If no renderer is specified, the Table will treat the footer data as a String.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].footerRenderer
     * @ojshortdesc A function that renders the content of the footer cell. The function takes a context argument, provided by the table. See the Help documentation for more information.
     * @type {Function|null}
     * @ojsignature {target: "Type", value: "?((context: oj.ojTable.FooterRendererContext<K,D>) => {insert: HTMLElement | string} | void) | null"}
     * @default null
     */
    footerRenderer: null,

    /**
     * The CSS styling to apply to the footer cell.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].footerStyle
     * @ojshortdesc The CSS styling to apply to the footer cell.
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     */
    footerStyle: null,

    /**
     * @typedef {Object} oj.ojTable.FooterTemplateContext Context passed into default and column-specific footer templates.
     * @property {Element} componentElement The &lt;oj-table> custom element.
     */
    /**
     * <p>The name of the slot used to specify the template for rendering the footer cell. The slot content must be a &lt;template> element.
     * The content of the template should not include the &lt;td> element, only what's inside it.
     * When both footerTemplate and footerRenderer are specified, the footerRenderer takes precedence.</p>
     * <p>When the template is executed for each footer, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - An object that contains information for the current footer being rendered. (See the table below for a list of properties available on $current) </li>
     *   <li>alias - If data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].footerTemplate
     * @ojshortdesc The slot name used to specify the template for rendering the footer cell. See the Help documentation for more information.
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     * @ojslotitemprops oj.ojTable.FooterTemplateContext
     */
    footerTemplate: null,

    /**
     * The CSS class to apply to the column header text.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].headerClassName
     * @ojshortdesc The CSS class to apply to the column header text.
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     */
    headerClassName: null,

    /**
     * @typedef {Object} oj.ojTable.HeaderRendererContext Context object passed into the headerRenderer callback function.
     * @property {number} columnIndex The column index.
     * @property {function(Object, function(Element):void):void} [columnHeaderDefaultRenderer]
     *           If the column is not sortable then this function will be included in the context.
     *           The options parameter specifies the options (future use) for the renderer while the
     *           delegateRenderer parameter specifies the function which the developer would
     *           like to be called during rendering of the column header.
     * @property {function(Object, function(Element):void):void} [columnHeaderSortableIconRenderer]
     *           If the column is sortable then this function will be included in the context.
     *           The options parameter specifies the options (future use) for the renderer while the
     *           delegateRenderer parameter specifies the function which the developer would
     *           like to be called during rendering of the sortable column header. Calling the
     *           columnHeaderSortableIconRenderer function enables rendering custom header content
     *           while also preserving the sort icons.
     * @property {Element} componentElement A reference to the Table root element.
     * @property {string} data The header text for the column.
     * @property {Object} headerContext Context for the header.
     * @property {oj.DataProvider<K, D>|null} headerContext.datasource
     *           The "data" attribute of the Table.
     * @property {Element} parentElement Empty rendered TH element.
     * @ojsignature {target:"Type", value:"<K,D>", for:"genericTypeParameters"}
     */
    /**
     * The renderer function that renders the content of the header.
     * The function will be passed a context object which contains
     * the following objects:
     * <ul>
     *   <li>columnIndex: The column index.</li>
     *   <li>columnHeaderDefaultRenderer(options, delegateRenderer): If the column
     *   is not sortable then this function will be included in the context.
     *   The options parameter specifies the options (future use) for the renderer while the
     *   delegateRenderer parameter specifies the function which the developer would
     *   like to be called during rendering of the column header.</li>
     *   <li>columnHeaderSortableIconRenderer(options, delegateRenderer): If the column
     *   is sortable then this function will be included in the context.
     *   The options parameter specifies the options (future use) for the renderer while the
     *   delegateRenderer parameter specifies the function which the developer would
     *   like to be called during rendering of the sortable column header. Calling the
     *   columnHeaderSortableIconRenderer function enables rendering custom header content
     *   while also preserving the sort icons.</li>
     *   <li>componentElement: A reference to the Table root element.</li>
     *   <li>data: The header text for the column.</li>
     *   <li>headerContext.datasource: The "data" attribute of the Table.</li>
     *   <li>parentElement: Empty rendered TH element.</li>
     * </ul>
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the header.</li></ul>
     *   </li>
     *   <li>undefined: If the developer chooses to manipulate the header element directly, the function should return undefined.</li>
     * </ul>
     * If no renderer is specified, the Table will treat the header data as a String.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].headerRenderer
     * @ojshortdesc A function that renders the content of the header. The function takes a context argument, provided by the table. See the Help documentation for more information.
     * @type {Function|null}
     * @ojsignature {target: "Type", value: "?((context: oj.ojTable.HeaderRendererContext<K,D>) => {insert: HTMLElement | string} | void) | null"}
     * @default null
     */
    headerRenderer: null,

    /**
     * The CSS styling to apply to the column header text.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].headerStyle
     * @ojshortdesc The CSS styling to apply to the column header text.
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     */
    headerStyle: null,

    /**
     * @typedef {Object} oj.ojTable.HeaderTemplateContext Context passed into default and column-specific header templates.
     * @property {Element} componentElement The &lt;oj-table> custom element.
     * @property {any} data The data object for the current header.
     */
    /**
     * <p>The name of the slot used to specify the template for rendering the header cell. The slot content must be a &lt;template> element.
     * The content of the template should not include the &lt;th> element, only what's inside it.
     * When both headerTemplate and headerRenderer are specified, the headerRenderer takes precedence.</p>
     * <p>When the template is executed for each header, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current header being rendered. (See the table below for a list of properties available on $current) </li>
     *   <li>alias - if data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].headerTemplate
     * @ojshortdesc The slot name used to specify the template for rendering the header cell. See the Help documentation for more information.
     * @type {string|null}
     * @ojsignature [{target:"Type", value:"?"},
     *               {target:"Type", value:"D", for:"data", jsdocOverride:true}]
     * @default null
     * @ojslotitemprops oj.ojTable.HeaderTemplateContext
     */
    headerTemplate: null,

    /**
     * Text to display in the header of the column.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].headerText
     * @ojshortdesc The text to display in the column header.
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     * @ojtranslatable
     */
    headerText: null,

    /**
     * The identifier for the column.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].id
     * @ojshortdesc The identifier for the column.
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     */
    id: null,

    /**
     * Enable or disable width resizing along the column end headers.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].resizable
     * @type {string}
     * @ojvalue {string} 'enabled'
     * @ojvalue {string} 'disabled'
     * @default "disabled"
     * @ojsignature {target:"Type", value:"?"}
     */
    resizable: 'disabled',

    /**
     * Whether or not the column is sortable.
     * <p>
     * A sortable column has a clickable header that (when clicked)
     * sorts the table by that column's property. Note that
     * in order for a column to be sortable, this attribute
     * must be set to "enabled" and the underlying model must
     * support sorting by this column's property. If this attribute
     * is set to "auto" then the column will be sortable if the
     * underlying model supports sorting. A value of "disabled" will
     * disable sorting on the column.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].sortable
     * @ojshortdesc Specifies whether a column is sortable. See the Help documentation for more information.
     * @type {string}
     * @ojvalue {string} "auto" Column will be sortable if the underlying model supports sorting.
     * @ojvalue {string} "enabled" Sorting is enabled if the underlying model supports sorting.
     * @ojvalue {string} "disabled" Sorting is disabled.
     * @default "auto"
     * @ojsignature {target:"Type", value:"?"}
     */
    sortable: 'auto',

    /**
     * Indicates the row attribute used for sorting when sort is invoked on this
     * column. Useful for concatenated columns, where the sort is done by only a subset
     * of the concatenated items.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].sortProperty
     * @ojshortdesc Specifies the row attribute used for sorting when a sort is invoked on this column. See the Help documentation for more information.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    sortProperty: null,

    /**
     * The CSS styling to apply to the column cells.
     *
     * <p>See the <a href="#columns">columns</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].style
     * @ojshortdesc The CSS styling to apply to the column cells.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    style: null,

    /**
     * @typedef {Object} oj.ojTable.CellTemplateContext Context passed into default and column-specific cell templates.
     * @property {Element} componentElement The &lt;oj-table> custom element.
     * @property {any} data The data for the current cell being rendered.
     * @property {any} row  The data for the row contained the current cell being rendered.
     * @property {number} index The zero-based index of the current row being rendered.
     * @property {number} columnIndex The zero-based index of the current column being rendered.
     * @property {any} key The key of the current cell being rendered.
     * @property {"edit"|"navigation"} mode The mode of the row containing the cell.  It can be "edit" or "navigation".
     */
    /**
     * <p>The name of the slot used to specify the template for rendering the cell. The slot content must be a &lt;template> element.
     * The content of the template should not include the &lt;td> element, only what's inside it.
     * When both cell template and cell renderer are specified, the cell renderer takes precedence.</p>
     * <p>When the template is executed for the cell, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - An object that contains information for the current cell being rendered (See the table below for a list of properties available on $current)</li>
     *   <li>alias - If data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].template
     * @ojshortdesc The slot name used to specify the template for rendering the cell. See the Help documentation for more information.
     * @type {string|null}
     * @ojsignature [{target:"Type", value:"?"},
     *               {target:"Type", value:"D", for:"data", jsdocOverride:true},
     *               {target:"Type", value:"D", for:"row", jsdocOverride:true}]
     * @default null
     * @ojslotitemprops oj.ojTable.CellTemplateContext
     */
    template: null,

    /**
     * The width of the column in pixels.
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columns[].width
     * @type {number|null}
     * @default null
     * @ojunits pixels
     * @ojsignature {target:"Type", value:"?"}
     */
    width: null
    /**
     * The knockout template used to render the content of the column header.
     *
     * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
     * component option. The following
     *   variables are also passed into the template
     *     <ul>
     *       <li>$columnIndex: The column index</li>
     *       <li>$data: The header text</li>
     *       <li>$headerContext: The header context</li>
     *     </ul>
     *   </li>
     *
     * @ojbindingonly
     * @name columns[].headerTemplate
     * @memberof! oj.ojTable
     * @instance
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     *
     * @example <caption>Specify the column header <code class="prettyprint">template</code> when initializing Table:</caption>
     * // set the template
     * &lt;oj-table aria-label="Departments Table"
     *      data='{{dataProvider}}'
     *      columns='[{"headerText": "Department Id", "field": "DepartmentId"},
     *                {"headerText": "Department Name", "field": "DepartmentName"},
     *                {"headerText": "Location Id", "field": "LocationId"},
     *                {"headerText": "Manager Id", "field": "ManagerId"},
     *                {"headerTemplate": "oracle_link_hdr"}]'&gt;
     * &lt;/oj-table&gt;
     *
     * @ignore
     */
    /**
     * The knockout template used to render the content of the column footer.
     *
     * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
     * component option. The following
     *   variables are also passed into the template
     *     <ul>
     *       <li>$columnIndex: The column index</li>
     *       <li>$footerContext: The header context</li>
     *     </ul>
     *   </li>
     *
     * @ojbindingonly
     * @name columns[].footerTemplate
     * @memberof! oj.ojTable
     * @instance
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     *
     * @example <caption>Specify the column footer <code class="prettyprint">template</code> when initializing Table:</caption>
     * // set the template
     * &lt;oj-table aria-label="Departments Table"
     *      data='{{dataProvider}}'
     *      columns-default='[{"headerText": "Department Id", "field": "DepartmentId"},
     *                       {"headerText": "Department Name", "field": "DepartmentName"},
     *                       {"headerText": "Location Id", "field": "LocationId"},
     *                       {"headerText": "Manager Id", "field": "ManagerId"},
     *                       {"footerTemplate": "oracle_link_ftr"}]'&gt;
     * &lt;/oj-table&gt;
     *
     * @ignore
     */
  }],

  /**
   * Default values to apply to all column objects.
   * @expose
   * @public
   * @instance
   * @memberof! oj.ojTable
   * @type {Object}
   *
   * @example <caption>Initialize the component, overriding some columns defaults and leaving the others intact:</caption>
   * &lt;!-- Using dot notation -->
   * &lt;oj-table columns-default.sortable='disabled' columns-default.header-style='text-align: left; white-space:nowrap;'>&lt;/oj-table>
   *
   * &lt;!-- Using JSON notation -->
   * &lt;oj-table columns-default='{"sortable":"disabled", "headerStyle":"text-align: left; white-space:nowrap;"}'>&lt;/oj-table>
   *
   * @example <caption>Get or set the <code class="prettyprint">columnsDefault</code> property after initialization:</caption>
   * // Get one
   * var value = myTable.columnsDefault.headerStyle;
   *
   * // Set one, leaving the others intact. Use the setProperty API for
   * // subproperties so that a property change event is fired.
   * myTable.setProperty('columnsDefault.headerStyle', 'text-align: left; white-space:nowrap;');
   *
   * // Get all
   * var values = myTable.columnsDefault;
   *
   * // Set all.  Must list every default, as those not listed are lost.
   * myTable.columnsDefault = {
   *     sortable: 'disabled',
   *     headerStyle: 'text-align: left; white-space:nowrap;'
   * };
   */
  columnsDefault: {
    /**
     * The renderer function that renders the content of the cell.
     * The function will be passed a context object which contains
     * the following objects:
     * <ul>
     *   <li>cellContext.datasource: The "data" attribute of the Table.</li>
     *   <li>cellContext.mode: The mode of the row.  It can be "edit" or "navigation".</li>
     *   <li>cellContext.status: Contains the rowIndex, rowKey, and currentRow.</li>
     *   <li>columnIndex: The column index.</li>
     *   <li>componentElement: A reference to the Table root element.</li>
     *   <li>data: The cell data.</li>
     *   <li>parentElement: Empty rendered <td> element.</li>
     *   <li>row: Key/value pairs of the row.</li>
     * </ul>
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the header.</li></ul>
     *   </li>
     *   <li>undefined: If the developer chooses to manipulate the cell element directly, the function should return undefined.</li>
     * </ul>
     * If no renderer is specified, the Table will treat the cell data as a String.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.renderer
     * @ojshortdesc A function that renders the content of the cell. The function takes a context argument, provided by the table. See the Help documentation for more information.
     * @type {Function|null}
     * @ojsignature {target: "Type", value: "?((context: oj.ojTable.ColumnsRendererContext<K,D>) => {insert: HTMLElement | string} | void) | null"}
     * @default null
     */
    renderer: null,

    /**
     * The default CSS class for column cells.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.className
     * @ojshortdesc The default CSS class for column cells.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    className: null,

    /**
     * The default data field for the column.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.field
     * @ojshortdesc The default data field for the column.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    field: null,

    /**
     * The default CSS class to apply to the footer cell.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.footerClassName
     * @ojshortdesc The default CSS class to apply to the footer cell.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    footerClassName: null,

    /**
     * The renderer function that renders the content of the footer.
     * The function will be passed a context object which contains
     * the following objects:
     * <ul>
     *   <li>columnIndex: The column index.</li>
     *   <li>componentElement: A reference to the Table root element.</li>
     *   <li>footerContext.datasource: The "data" attribute of the Table.</li>
     *   <li>parentElement: Empty rendered <td> element.</li>
     * </ul>
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the footer.</li></ul>
     *   </li>
     *   <li>undefined: If the developer chooses to manipulate the footer element directly, the function should return undefined.</li>
     * </ul>
     * If no renderer is specified, the Table will treat the footer data as a String.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.footerRenderer
     * @ojshortdesc A function that renders the content of the footer cell. The function takes a context argument, provided by the table. See the Help documentation for more information.
     * @type {Function|null}
     * @ojsignature {target: "Type", value: "?((context: oj.ojTable.FooterRendererContext<K,D>) => {insert: HTMLElement | string} | void) | null"}
     * @default null
     */
    footerRenderer: null,

    /**
     * The default CSS styling to apply to the footer cell.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.footerStyle
     * @ojshortdesc The default CSS styling to apply to the footer cell.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    footerStyle: null,

    /**
     * <p>The name of the slot used to specify the template for rendering the footer cell. The slot content must be a &lt;template> element.
     * The content of the template should not include the &lt;td> element, only what's inside it.
     * When both footerTemplate and footerRenderer are specified, the footerRenderer takes precedence.</p>
     * <p>When the template is executed for each footer, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - An object that contains information for the current footer being rendered. (See the table below for a list of properties available on $current) </li>
     *   <li>alias - If data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.footerTemplate
     * @ojshortdesc The slot name used to specify the template for rendering the footer cell. See the Help documentation for more information.
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     * @ojslotitemprops oj.ojTable.FooterTemplateContext
     * @ojdeprecated {since: "7.0.0", description: "Use the footerTemplate slot instead."}
     */
    footerTemplate: null,

    /**
     * The default CSS class to apply to the column header.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.headerClassName
     * @ojshortdesc The default CSS class to apply to the column header.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    headerClassName: null,

    /**
     * The renderer function that renders the content of the header.
     * The function will be passed a context object which contains
     * the following objects:
     * <ul>
     *   <li>columnIndex: The column index.</li>
     *   <li>columnHeaderDefaultRenderer(options, delegateRenderer): If the column
     *   is not sortable then this function will be included in the context.
     *   The options parameter specifies the options (future use) for the renderer while the
     *   delegateRenderer parameter specifies the function which the developer would
     *   like to be called during rendering of the column header.</li>
     *   <li>columnHeaderSortableIconRenderer(options, delegateRenderer): If the column
     *   is sortable then this function will be included in the context.
     *   The options parameter specifies the options (future use) for the renderer while the
     *   delegateRenderer parameter specifies the function which the developer would
     *   like to be called during rendering of the sortable column header. Calling the
     *   columnHeaderSortableIconRenderer function enables rendering custom header content
     *   while also preserving the sort icons.</li>
     *   <li>componentElement: A reference to the Table root element.</li>
     *   <li>data: The header text for the column.</li>
     *   <li>headerContext.datasource: The "data" attribute of the Table.</li>
     *   <li>parentElement: Empty rendered TH element.</li>
     * </ul>
     * The function should return one of the following:
     * <ul>
     *   <li>An Object with the following property:
     *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the header.</li></ul>
     *   </li>
     *   <li>undefined: If the developer chooses to manipulate the header element directly, the function should return undefined.</li>
     * </ul>
     * If no renderer is specified, the Table will treat the header data as a String.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.headerRenderer
     * @ojshortdesc A function that renders the content of the header. The function takes a context argument, provided by the table. See the Help documentation for more information.
     * @type {Function|null}
     * @ojsignature {target: "Type", value: "?((context: oj.ojTable.HeaderRendererContext<K,D>) => {insert: HTMLElement | string} | void) | null"}
     * @default null
     */
    headerRenderer: null,

    /**
     * The default CSS styling to apply to the column header.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.headerStyle
     * @ojshortdesc The default CSS styling to apply to the column header.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    headerStyle: null,

    /**
     * <p>The name of the slot used to specify the template for rendering the header cell. The slot content must be a &lt;template> element.
     * The content of the template should not include the &lt;th> element, only what's inside it.
     * When both headerTemplate and headerRenderer are specified, the headerRenderer takes precedence.</p>
     * <p>When the template is executed for each header, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - An object that contains information for the current header being rendered. (See the table below for a list of properties available on $current) </li>
     *   <li>alias - If data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.headerTemplate
     * @ojshortdesc The slot name used to specify the template for rendering the header cell. See the Help documentation for more information.
     * @type {string|null}
     * @ojsignature [{target:"Type", value:"?"},
     *               {target:"Type", value:"D", for:"data", jsdocOverride:true}]
     * @default null
     * @ojslotitemprops oj.ojTable.HeaderTemplateContext
     * @ojdeprecated {since: "7.0.0", description: "Use the headerTemplate slot instead."}
     */
    headerTemplate: null,

    /**
     * Default text to display in the header of the column.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.headerText
     * @ojshortdesc The default text to display in the column header.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     * @ojtranslatable
     */
    headerText: null,

    /**
     * Enable or disable width resizing along the column end headers.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.resizable
     * @type {string|null}
     * @ojvalue {string} 'enabled'
     * @ojvalue {string} 'disabled'
     * @default "disabled"
     * @ojsignature {target:"Type", value:"?"}
     */
    resizable: 'disabled',

    /**
     * Whether or not the column is sortable.
     * <p>
     * A sortable column has a clickable header that (when clicked)
     * sorts the table by that column's property. Note that
     * in order for a column to be sortable, this attribute
     * must be set to "enabled" and the underlying model must
     * support sorting by this column's property. If this attribute
     * is set to "auto" then the column will be sortable if the
     * underlying model supports sorting. A value of "disabled" will
     * disable sorting on the column.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.sortable
     * @ojshortdesc Specifies whether a column is sortable. See the Help documentation for more information.
     * @type {string|null}
     * @ojvalue {string} "auto" Column will be sortable if the underlying model supports sorting.
     * @ojvalue {string} "enabled" Sorting is enabled if the underlying model supports sorting.
     * @ojvalue {string} "disabled" Sorting is disabled.
     * @default "auto"
     * @ojsignature {target:"Type", value:"?"}
     */
    sortable: 'auto',

    /**
     * Indicates the row attribute used for sorting when sort is invoked on this
     * column. Useful for concatenated columns, where the sort is done by only a subset
     * of the concatenated items.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.sortProperty
     * @ojshortdesc Specifies the row attribute used for sorting when a sort is invoked on this column. See the Help documentation for more information.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    sortProperty: null,

    /**
     * The default CSS styling to apply to the column cells.
     *
     * <p>See the <a href="#columnsDefault">columns-default</a> attribute for usage examples.
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.style
     * @ojshortdesc The default CSS styling to apply to the column cells.
     * @type {string|null}
     * @default null
     * @ojsignature {target:"Type", value:"?"}
     */
    style: null,

    /**
     * <p>The name of the slot used to specify the template for rendering the cell. The slot content must be a &lt;template> element.
     * The content of the template should not include the &lt;td> element, only what's inside it.
     * When both cell template and cell renderer are specified, the cell renderer takes precedence.</p>
     * <p>When the template is executed for the cell, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - An object that contains information for the current cell being rendered.</li>
     *   <li>alias - If data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.template
     * @ojshortdesc The slot name used to specify the template for rendering the cell. See the Help documentation for more information.
     * @type {string|null}
     * @ojsignature [{target:"Type", value:"?"},
     *               {target:"Type", value:"D", for:"data", jsdocOverride:true},
     *               {target:"Type", value:"D", for:"row", jsdocOverride:true}]
     * @default null
     * @ojslotitemprops oj.ojTable.CellTemplateContext
     * @ojdeprecated {since: "7.0.0", description: "Use the cellTemplate slot instead."}
     */
    template: null,

    /**
     * The default width of the column in pixels.
     * @expose
     * @public
     * @instance
     * @memberof! oj.ojTable
     * @alias columnsDefault.width
     * @type {number|null}
     * @default null
     * @ojunits pixels
     * @ojsignature {target:"Type", value:"?"}
     */
    width: null
    /**
     * The default knockout template used to render the content of the column header.
     *
     * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
     * component option. The following
     *   variables are also passed into the template
     *     <ul>
     *       <li>$columnIndex: The column index.</li>
     *       <li>$data: The header text.</li>
     *       <li>$headerContext: The header context.</li>
     *     </ul>
     *   </li>
     *
     * @ojbindingonly
     * @name columnsDefault.headerTemplate
     * @memberof! oj.ojTable
     * @instance
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     *
     * @example <caption>Specify the column header <code class="prettyprint">template</code> when initializing Table:</caption>
     * // set the template
     * &lt;oj-table aria-label="Departments Table"
     *      data='{{dataProvider}}'
     *      columns-default='[{"headerText": "Department Id", "field": "DepartmentId"},
     *                        {"headerText": "Department Name", "field": "DepartmentName"},
     *                        {"headerText": "Location Id", "field": "LocationId"},
     *                        {"headerText": "Manager Id", "field": "ManagerId"},
     *                        {"headerTemplate": "oracle_link_hdr"}]'&gt;
     * &lt;/oj-table&gt;
     *
     * @ignore
     */
    /**
     * The default knockout template used to render the content of the column footer.
     *
     * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
     * component option. The following
     *   variables are also passed into the template
     *     <ul>
     *       <li>$columnIndex: The column index.</li>
     *       <li>$footerContext: The header context.</li>
     *     </ul>
     *   </li>
     *
     * @ojbindingonly
     * @name columnsDefault.footerTemplate
     * @memberof! oj.ojTable
     * @instance
     * @type {string|null}
     * @ojsignature {target:"Type", value:"?"}
     * @default null
     *
     * @example <caption>Specify the column footer <code class="prettyprint">template</code> when initializing Table:</caption>
     * // set the template
     * &lt;oj-table aria-label="Departments Table"
     *      data='{{dataProvider}}'
     *      columns-default='[{"headerText": "Department Id", "field": "DepartmentId"},
     *                        {"headerText": "Department Name", "field": "DepartmentName"},
     *                        {"headerText": "Location Id", "field": "LocationId"},
     *                        {"headerText": "Manager Id", "field": "ManagerId"},
     *                        {"footerTemplate": "oracle_link_ftr"}]'&gt;
     * &lt;/oj-table&gt;
     *
     * @ignore
     */
  },

  /**
   * Triggered before the current row is changed via the <code class="prettyprint">currentRow</code> property or via the UI.
   *
   * @expose
   * @event
   * @ojbubbles
   * @ojcancelable
   * @memberof oj.ojTable
   * @ojshortdesc Triggered before the current row is changed.
   * @instance
   * @property {Object} currentRow The new current row.
   * @property {Object} previousCurrentRow The previous current row.
   * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
   *               {target:"Type", value:"oj.ojTable.CurrentRow<K>", for:"currentRow", jsdocOverride:true},
   *               {target:"Type", value:"oj.ojTable.CurrentRow<K>", for:"previousCurrentRow", jsdocOverride:true}]
   */
  beforeCurrentRow: null,

  /**
   * Triggered before the table is going to enter edit mode. To prevent editing the row, call <code class="prettyprint">event.preventDefault()</code> in the listener.
   *
   * @expose
   * @event
   * @ojbubbles
   * @ojcancelable
   * @memberof oj.ojTable
   * @ojshortdesc Triggered before the table is going to enter edit mode.
   * @instance
   * @property {Object} rowContext The rowContext of the row that editing is going to be performed on.
   * @property {Element} rowContext.componentElement A reference to the Table root element.
   * @property {Element} rowContext.parentElement Empty rendered TR element.
   * @property {any} rowContext.datasource The "data" attribute of the Table.
   * @property {"edit"|"navigation"} rowContext.mode The mode of the row.  It can be "edit" or "navigation".
   * @property {any} rowContext.status Contains the rowIndex, rowKey, and currentRow
   * @ojsignature [{target:"Type", value:"<K,D>", for:"genericTypeParameters"},
   *                {target:"Type", value:"oj.DataProvider<K, D>|null", for:"rowContext.datasource", jsdocOverride:true},
   *                {target:"Type", value:"oj.ojTable.ContextStatus<K>", for:"rowContext.status", jsdocOverride:true}]
   */
  beforeRowEdit: null,

  /**
   * Triggered before the table is going to exit edit mode. To prevent exit editing, call <code class="prettyprint">event.preventDefault()</code> in the listener.
   * There is a provided beforeRowEditEnd function, oj.DataCollectionEditUtils.basicHandleRowEditEnd, which can be specified.
   * This function will handle canceling edits as well as invoking validation on input elements.
   *
   * @expose
   * @event
   * @ojbubbles
   * @ojcancelable
   * @memberof oj.ojTable
   * @ojshortdesc Triggered before the table is going to exit edit mode. See the Help documentation for more information.
   * @instance
   * @property {Object} rowContext The rowContext of the edited row.
   * @property {Element} rowContext.componentElement A reference to the Table root element.
   * @property {Element} rowContext.parentElement Empty rendered TR element.
   * @property {any} rowContext.datasource The "data" attribute of the Table.
   * @property {"edit"|"navigation"} rowContext.mode The mode of the row.  It can be "edit" or "navigation".
   * @property {any} rowContext.status Contains the rowIndex, rowKey, and currentRow.
   * @property {boolean} cancelEdit true if the edit should be negated based on actions (i.e. escape key).
   * @ojsignature [{target:"Type", value:"<K,D>", for:"genericTypeParameters"},
   *                {target:"Type", value:"oj.DataProvider<K, D>|null", for:"rowContext.datasource", jsdocOverride:true},
   *                {target:"Type", value:"oj.ojTable.ContextStatus<K>", for:"rowContext.status", jsdocOverride:true}]
   */
  beforeRowEditEnd: null,

  /**
   * Triggered when the table has finished rendering.
   *
   * @expose
   * @event
   * @memberof! oj.ojTable
   * @instance
   *
   * @ignore
   */
  ready: null,

  /**
   * Triggered when user performs an action gesture on a row while Table is in navigation mode.  The action gestures include:
   * <ul>
   *   <li>User clicks anywhere in a row</li>
   *   <li>User taps anywhere in a row</li>
   *   <li>User pressed enter key while a row or a cell within the row or content within a cell has focus</li>
   * </ul>
   *
   * @expose
   * @event
   * @ojbubbles
   * @memberof oj.ojTable
   * @ojshortdesc Triggered when user performs an action gesture on a row.
   * @instance
   * @property {Object} context The context information about the row where the action gesture is performed on.
   * @property {Event} originalEvent The DOM event that triggers the action.
   * @ojsignature [{target:"Type", value:"<K,D>", for:"genericTypeParameters"},
   *                {target:"Type", value:"CommonTypes.ItemContext<K,D>", for:"context", jsdocOverride:true}]
   */
  rowAction: null,

  /**
   * Triggered when a sort is performed on the table.
   *
   * @expose
   * @event
   * @ojbubbles
   * @ojcancelable
   * @memberof oj.ojTable
   * @instance
   * @property {Element} header The key of the header which was sorted on.
   * @property {'ascending'|'descending'} direction The direction of the sort.
   */
  sort: null

  /**
   * The knockout template used to render the content of the row.
   *
   * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
   * component option. The following
   *   variables are also passed into the template
   *     <ul>
   *       <li>$rowContext: The row context</li>
   *     </ul>
   *   </li>
   *
   * @ojbindingonly
   * @name rowTemplate
   * @memberof! oj.ojTable
   * @instance
   * @type {string|null}
   * @default null
   *
   * @example <caption>Specify the row <code class="prettyprint">template</code> when initializing Table:</caption>
   * // set the template
   * &lt;oj-table aria-label="Departments Table"
   *   data='{{dataProvider}}' row-template='row_tmpl'&gt;&lt;/oj-table&gt;
   *
   * @ignore
   */
};

/** ** start Public APIs ****/

/**
 * {@ojinclude "name":"nodeContextDoc"}
 * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
 * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
 * @ojsignature {target:"Type", value:"{subId: 'oj-table-cell', rowIndex: number, columnIndex: number, key:string} | {subId: 'oj-table-footer'|'oj-table-header',index: number}",for:"returns"}
 *
 * @example {@ojinclude "name":"nodeContextExample"}
 * @alias getContextByNode
 * @expose
 * @instance
 * @memberof! oj.ojTable
 * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
 */
Table.prototype.getContextByNode = function (node) {
  // context objects are documented with @ojnodecontext
  var context = this.getSubIdByNode(node, true);
  if (context) {
    if (context.subId === 'oj-table-cell') {
      var rowIdx = context.rowIndex;
      var rowKey = this._getRowKeyForRowIdx(rowIdx);
      context.key = rowKey;
    }
  }
  return context;
};

/**
 * Return the row data for a rendered row in the table.
 * @param {number} rowIndex row index
 * @returns {Object | null} a compound object which has the structure below. If the row has not been rendered, returns null.<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>The raw row data</td></tr>
 * <tr><td><b>index</b></td><td>The index for the row</td></tr>
 * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
 * </tbody>
 * </table>
 * @ojsignature {target: "Type", value: "(rowIndex: number) : {data: D, index: number, key: K} | null"}
 * @export
 * @alias getDataForVisibleRow
 * @expose
 * @memberof! oj.ojTable
 * @instance
 * @example <caption>Invoke the <code class="prettyprint">getDataForVisibleRow</code> method:</caption>
 * myTable.getDataForVisibleRow(2);
 */
Table.prototype.getDataForVisibleRow = function (rowIndex) {
  var tableBodyRow = this._getTableBodyRow(rowIndex);
  if (tableBodyRow != null) {
    return {
      key: $(tableBodyRow).data('rowKey'),
      data: $(tableBodyRow).data('rowData'),
      index: rowIndex
    };
  }
  return null;
};

// @inheritdoc
Table.prototype.getNodeBySubId = function (locator) {
  if (locator == null) {
    return this.element ? this.element[0] : null;
  }
  var columnIdx;
  var subId = locator.subId;
  if (subId === 'oj-table-cell') {
    var rowIdx = parseInt(locator.rowIndex, 10);
    columnIdx = parseInt(locator.columnIndex, 10);
    return this._getTableBodyLogicalCells(rowIdx)[columnIdx];
  } else if (subId === 'oj-table-header' ||
              subId === 'oj-table-sort-ascending' ||
              subId === 'oj-table-sort-descending') {
    columnIdx = locator.index;
    var tableHeaderColumn = this._getTableHeaderLogicalColumns()[columnIdx];
    if (tableHeaderColumn != null) {
      if (subId === 'oj-table-header') {
        return tableHeaderColumn;
      } else if (subId === 'oj-table-sort-ascending') {
        var tableHeaderColumnSortAsc =
          this._getTableElementsByClassName(tableHeaderColumn,
            Table.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
        if (tableHeaderColumnSortAsc.length > 0) {
          return tableHeaderColumnSortAsc[0];
        }
      } else {
        var tableHeaderColumnSortDsc =
          this._getTableElementsByClassName(tableHeaderColumn,
            Table.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS);
        if (tableHeaderColumnSortDsc.length > 0) {
          return tableHeaderColumnSortDsc[0];
        }
      }
    }
  } else if (subId === 'oj-table-footer') {
    columnIdx = locator.index;
    var tableFooterCell = this._getTableFooterLogicalCells()[columnIdx];
    if (tableFooterCell != null) {
      return tableFooterCell;
    }
  }

  // Non-null locators have to be handled by the component subclasses
  return null;
};

// @inheritdoc
Table.prototype.getSubIdByNode = function (node, ignoreSortIcons) {
  var cell = this._getFirstAncestor(node,
    '.' + Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
  if (cell != null) {
    return {
      subId: 'oj-table-cell',
      rowIndex: this._getElementRowIdx(cell),
      columnIndex: this._getElementColumnIdx(cell)
    };
  }

  var headerSortAsc = this._getFirstAncestor(node,
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS, true);
  if (headerSortAsc != null) {
    return {
      subId: ignoreSortIcons ? 'oj-table-header' : 'oj-table-sort-ascending',
      index: this._getElementColumnIdx(headerSortAsc)
    };
  }

  var headerSortDsc = this._getFirstAncestor(node,
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS, true);
  if (headerSortDsc != null) {
    return {
      subId: ignoreSortIcons ? 'oj-table-header' : 'oj-table-sort-descending',
      index: this._getElementColumnIdx(headerSortDsc)
    };
  }

  var header = this._getFirstAncestor(node,
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS, true);
  if (header != null) {
    return {
      subId: 'oj-table-header',
      index: this._getElementColumnIdx(header)
    };
  }

  var footer = this._getFirstAncestor(node,
    '.' + Table.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS, true);
  if (footer != null) {
    return {
      subId: 'oj-table-footer',
      index: this._getElementColumnIdx(footer)
    };
  }
  return null;
};

/**
 * Refresh the table.
 * @export
 * @expose
 * @alias refresh
 * @memberof! oj.ojTable
 * @instance
 * @return {void}
 * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
 * myTable.refresh();
 */
Table.prototype.refresh = function () {
  this._super();
  this._refresh();
};

/**
 * Refresh a row in the table.
 * @param {number} rowIdx  Index of the row to refresh.
 * @return {Promise.<boolean>} Promise resolves when done to true if refreshed, false if not
 * @throws {Error}
 * @export
 * @expose
 * @alias refreshRow
 * @memberof! oj.ojTable
 * @instance
 * @example <caption>Invoke the <code class="prettyprint">refreshRow</code> method:</caption>
 * myTable.refreshRow(1);
 */
Table.prototype.refreshRow = function (rowIdx) {
  return this._refreshRow(rowIdx, true);
};

/**
 * Returns a jQuery object containing the root dom element of the table
 *
 * <p>This method does not accept any arguments.
 *
 * @expose
 * @override
 * @memberof oj.ojTable
 * @instance
 * @ignore
 * @return {jQuery} the root DOM element of table
 */
Table.prototype.widget = function () {
  var tableContainer = this._getTableContainer();
  if (tableContainer != null) {
    return $(tableContainer);
  }
  return this.element;
};

/** ** end Public APIs ****/

/** ** start internal widget functions ****/

/**
 * @override
 * @protected
 * @instance
 * @memberof! oj.ojTable
 */
Table.prototype._ComponentCreate = function () {
  this._super();
  this._initTemplateEngine();
  this._draw();
  this._registerCustomEvents();
  this._on(this._events);
  if (this._isTouchDevice()) {
    this._registerTouchEvents();
  }
  this._registerDomEventListeners();
  // cache the options
  this._cachedOptions = $.extend(true, {}, this.options);
  this._setEditableRowIdx(null);

  DataCollectionUtils.disableDefaultBrowserStyling(this.element[0]);
};

/**
 * Initialize the table after creation
 * @protected
 * @override
 * @memberof! oj.ojTable
 */
Table.prototype._AfterCreate = function () {
  this._super();
  // create the context menu
  this._createContextMenu(this._handleContextMenuSelect.bind(this));
  this._isInitFetch = true;
};

/**
 * Sets up needed resources for table, for example, add
 * listeners.
 * @protected
 * @override
 * @memberof! oj.ojTable
 */
Table.prototype._SetupResources = function () {
  this._super();
  this._registerResizeListener();
  // register event listeners for table on the datasource so that the table
  // component is notified when rows are added, deleted, etc from the datasource.
  this._registerDataSourceEventListeners();
  if (this._isInitFetch) {
    this._initFetch();
    this._isInitFetch = false;
  } else {
    this._queueTask(function () {
      return this._invokeDataFetchRows();
    }.bind(this));
  }
};

/**
 * Releases resources for table.
 * @protected
 * @override
 * @memberof! oj.ojTable
 */
Table.prototype._ReleaseResources = function () {
  this._super();
  this._cleanComponent();
};

/**
 * @override
 * @private
 */
Table.prototype._destroy = function () {
  this._cleanComponent(true);
};

/**
   * <p>Notifies the component that its subtree has been connected to the document programmatically after the component has
   * been created.
   *
   * @memberof! oj.ojTable
   * @instance
   * @protected
   * @override
   */
Table.prototype._NotifyAttached = function () {
  this._super();
  // refresh dimensions if no tasks are pending since refresh dimensions runs during final task
  if (!this._hasPendingTasks()) {
    this._syncTableSizing();
  }
};

/**
 * <p>Notifies the component that its subtree has been made visible programmatically after the component has
 * been created.
 *
 * @memberof! oj.ojTable
 * @instance
 * @protected
 * @override
 */
Table.prototype._NotifyShown = function () {
  this._super();
  // refresh dimensions if no tasks are pending since refresh dimensions runs during final task
  if (!this._hasPendingTasks()) {
    this._syncTableSizing();
  }
};

/**
 * Override to do the delay connect/disconnect
 * @memberof oj.ojTable
 * @override
 * @protected
 */
Table.prototype._VerifyConnectedForSetup = function () {
  return true;
};

//* * @inheritdoc */
Table.prototype._GetDefaultContextMenu = function () {
  return this._defaultContextMenu;
};

/**
 * @param {Object} contextMenu The JET Menu to open as a context menu
 * @param {Event} event What triggered the menu launch
 * @param {string} eventType "mouse", "touch", "keyboard"
 * @private
 */
Table.prototype._NotifyContextMenuGesture = function (contextMenu, event, eventType) {
  var openOptions = {};
  this._contextMenuEvent = event.originalEvent;

  // first check if we are invoking on an editable or clickable element, or draggable element on touch event. If so bail
  if (this._isNodeEditable(this._contextMenuEvent.target) ||
      this._isNodeClickable(this._contextMenuEvent.target) ||
      (eventType === 'touch' && this._isNodeDraggable(this._contextMenuEvent.target))) {
    return;
  }

  var headerColumn;
  var tableBodyCell = this._getFirstAncestor(this._contextMenuEvent.target,
    '.' + Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
  if (tableBodyCell != null) {
    var columnIdx = this._getElementColumnIdx(tableBodyCell);
    headerColumn = this._getTableHeaderColumn(columnIdx);
  } else {
    headerColumn = this._getFirstAncestor(this._contextMenuEvent.target,
    '.' + Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS, true);
  }

  if (this._contextMenuEvent.type === 'keydown') {
    var table = this._getTable();
    if (headerColumn == null) {
      headerColumn = this._getTableHeaderColumn(this._activeColumnIndex);
    }
    if (this._contextMenuEvent.target === table) {
      if (headerColumn != null) {
        openOptions.position = {
          my: 'start top',
          at: 'start bottom',
          of: headerColumn
        };
      } else {
        var focusedRowIdx = this._getFocusedRowIdx();
        if (focusedRowIdx >= 0) {
          var tableBodyRow = this._getTableBodyRow(focusedRowIdx);
          openOptions.position = {
            my: 'start top',
            at: 'start bottom',
            of: tableBodyRow
          };
        } else {
          openOptions.position = {
            my: 'start top',
            at: 'start bottom',
            of: this._contextMenuEvent.target
          };
        }
      }
    } else {
      openOptions.position = {
        my: 'start top',
        at: 'start bottom',
        of: this._contextMenuEvent.target
      };
    }
  } else {
    // don't show context menu if gesture triggered outside of Table's data regions
    var footerCell = this._getFirstAncestor(this._contextMenuEvent.target,
      '.' + Table.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS, true);
    if (headerColumn == null && tableBodyCell == null && footerCell == null) {
      return;
    }
  }
  this._contextMenuEventHeaderColumn = headerColumn;

  // for jQuery it's the menu instance, for custom element it's the element node
  var contextMenuNode = contextMenu.element ? contextMenu.element[0] : contextMenu;
  var contextMenuItemAsc = contextMenuNode.querySelectorAll('[data-oj-command=oj-table-sortAsc]');
  if (contextMenuItemAsc.length > 0) {
    contextMenuItemAsc = contextMenuItemAsc[0];
    if (headerColumn && headerColumn.getAttribute('data-oj-sortable') === Table._OPTION_ENABLED) {
      if (contextMenuItemAsc.nodeName === 'OJ-OPTION') {
        contextMenuItemAsc.removeAttribute('disabled');
      } else {
        contextMenuItemAsc.classList.remove('oj-disabled');
      }
    } else if (contextMenuItemAsc.nodeName === 'OJ-OPTION') {
      contextMenuItemAsc.setAttribute('disabled', 'true');
    } else {
      contextMenuItemAsc.classList.add('oj-disabled');
    }
  }
  var contextMenuItemDsc = contextMenuNode.querySelectorAll('[data-oj-command=oj-table-sortDsc]');
  if (contextMenuItemDsc.length > 0) {
    contextMenuItemDsc = contextMenuItemDsc[0];
    if (headerColumn && headerColumn.getAttribute('data-oj-sortable') === Table._OPTION_ENABLED) {
      if (contextMenuItemDsc.nodeName === 'OJ-OPTION') {
        contextMenuItemDsc.removeAttribute('disabled');
      } else {
        contextMenuItemDsc.classList.remove('oj-disabled');
      }
    } else if (contextMenuItemDsc.nodeName === 'OJ-OPTION') {
      contextMenuItemDsc.setAttribute('disabled', 'true');
    } else {
      contextMenuItemDsc.classList.add('oj-disabled');
    }
  }
  var contextMenuItemResize = contextMenuNode.querySelectorAll('[data-oj-command=oj-table-resize]');
  if (contextMenuItemResize.length > 0) {
    contextMenuItemResize = contextMenuItemResize[0];
    if (headerColumn && headerColumn.getAttribute('data-oj-resizable') === Table._OPTION_ENABLED) {
      if (contextMenuItemResize.nodeName === 'OJ-OPTION') {
        contextMenuItemResize.removeAttribute('disabled');
      } else {
        contextMenuItemResize.classList.remove('oj-disabled');
      }
    } else if (contextMenuItemResize.nodeName === 'OJ-OPTION') {
      contextMenuItemResize.setAttribute('disabled', 'true');
    } else {
      contextMenuItemResize.classList.add('oj-disabled');
    }
  }
  this._OpenContextMenu(event, eventType, openOptions);
};

/**
 * @override
 * @private
 */
Table.prototype._setOption = function (key, value) {
  if (key === 'selection') {
    this._selectionSet = true;
    // update row index/key values in the 'selection' option
    this._syncRangeSelection(value);
    this._superApply(arguments);
    // after applying the new selection value, sync the selection state
    this._validateInitialSelectionState(true);
  } else if (key === 'selected') {
    this._selectionSet = false;
    this._superApply(arguments);
    // after applying the new selected value, sync the selection state
    this._validateInitialSelectionState(true);
  } else if (key === 'currentRow') {
    var updated = this._setCurrentRow(value, null, true);
    if (updated === Table._CURRENT_ROW_STATUS._UPDATED) {
      this._superApply(arguments);
    }
  } else if (key === 'scrollPosition') {
    // syncScrollPosition will update with proper value
    this._syncScrollPosition(value);
  } else if (key === 'editRow') {
    // setEditRow will update with all props within value
    this._setEditRow(value);
  } else {
    this._superApply(arguments);
    var shouldRefresh = this._isTableRefreshNeeded(key, value);
    if (shouldRefresh) {
      if (key === 'columns' ||
        (key === 'selectionMode' && value.row !== undefined)) {
        this._clearCachedMetadata();
        this._refreshTableHeader();
      } else if (key === 'data') {
        this._beforeDataRefresh();
      }
      this._refresh();
    }
  }
};

// @inheritdoc
Table.prototype._CompareOptionValues = function (option, value1, value2) {
  switch (option) {
    case 'columns':
    case 'currentRow':
      return oj.Object.compareValues(value1, value2);
    case 'selection':
      if (value1 && value1.inverted === undefined) {
        // eslint-disable-next-line no-param-reassign
        value1.inverted = false;
      }
      if (value2 && value2.inverted === undefined) {
        // eslint-disable-next-line no-param-reassign
        value2.inverted = false;
      }
      if (value1 && value2 && value1.inverted !== value2.inverted) {
        return false;
      }
      return oj.Object.compareValues(value1, value2);
    case 'selected':
      return DataCollectionUtils.areKeySetsEqual(value1.row, value2.row) &&
        DataCollectionUtils.areKeySetsEqual(value1.column, value2.column);
    default:
      return this._super(option, value1, value2);
  }
};

/** ** end internal widget functions ****/

/** ** start internal functions ****/

/**
 * Return table DnD utils instance
 * @return {Object} instance of table DnD utils
 * @private
 */
Table.prototype._getTableDndContext = function () {
  if (!this._tableDndContext) {
    this._tableDndContext = new oj.TableDndContext(this);
  }
  return this._tableDndContext;
};

/* Later when needed
Table.prototype._whenReady = function() {
  if (this._pendingTasks) {
    return this._pendingTasks;
  }
  return Promise.resolve();
}
*/

/** ** end internal functions ****/

// --------------------------------------------------- oj.ojTable Styling Start -----------------------------------------------------------
// ---------------- oj-table-data-cell-no-padding --------------
/**
* Used to style a table cell so that it has no padding. <br/>
* An app developer would likely use this in the case of editable tables when an editable cell content does not need the default cell padding.<br/>
* The class is applied as follows:<br/><br/>
* The class must be applied to the table cell.
* @ojstyleclass oj-table-data-cell-no-padding
* @ojdisplayname No Padding
* @memberof oj.ojTable
* @ojtsexample
* &lt;oj-table id="tableId" class='oj-table-data-cell-no-padding'>
* &lt;/oj-table>
*/
// ---------------- oj-table-data-cell-padding --------------
/**
* Used to style a table cell so that it has default padding. <br/>
* An app developer would likely use this in the case of editable tables when an editable cell content does not need the default cell padding.<br/>
* The class is applied as follows:<br/><br/>
* The class must be applied to the table cell.
* @ojstyleclass oj-table-data-cell-padding
* @ojdisplayname Padding
* @memberof oj.ojTable
* @ojtsexample
* &lt;oj-table id="tableId" class='oj-table-data-cell-padding'>
* &lt;/oj-table>
*/
// ---------------- oj-table-hide-vertical-scrollbar --------------
/**
* Used to explicitly hide the vertical scrollbar when the table body is scrollable.<br/>
* The class is applied as follows:<br/><br/>
* The class must be applied to the oj-table custom element.
* @ojstyleclass oj-table-hide-vertical-scrollbar
* @ojdisplayname Hide Vertical Scrollbar
* @memberof oj.ojTable
* @ojtsexample
* &lt;oj-table id="tableId" class='oj-table-hide-vertical-scrollbar'>
* &lt;/oj-table>
*/
// --------------------------------------------------- oj.ojTable Styling End -----------------------------------------------------------
(function () {
  oj.__registerWidget('oj.ojTable', $.oj.baseComponent, new Table());
}());

Components.setDefaultOptions({
  ojTable: {
    display: Components.createDynamicPropertyGetter(function () {
      return (ThemeUtils.parseJSONFromFontFamily('oj-table-option-defaults') || {}).display;
    })
  }
});



/* global Logger:false, Table:false */

/**
 * @ignore
 * @export
 * @class oj.TableDndContext
 * @classdesc Drag and Drop Utils for ojTable
 * @param {Object} component ojTable instance
 * @constructor
 */
oj.TableDndContext = function (component) {
  this.component = component;
  this.Init();
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.TableDndContext, oj.Object, 'oj.TableDndContext');

/**
 * Initializes the instance.
 * @memberof oj.TableDndContext
 * @export
 */
oj.TableDndContext.prototype.Init = function () {
  oj.TableDndContext.superclass.Init.call(this);
};

/**
 * Add oj-drag marker class to cells in a column
 * @param {number} columnIdx  the index of the column to mark
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._addDragMarkerClass = function (columnIdx) {
  var column = this.component._getTableHeaderColumn(columnIdx);
  column.classList.add(Table.MARKER_STYLE_CLASSES._DRAG);
  this.component._setTableColumnCellsClass(columnIdx, true, Table.MARKER_STYLE_CLASSES._DRAG);
};

/**
 * Remove oj-drag marker class from cells in dragged columns
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._removeDragMarkerClass = function () {
  var dragColumns =
      this.component._getTableElementsByClassName(this.component._getTableHeader(),
        Table.MARKER_STYLE_CLASSES._DRAG);
  if (dragColumns != null && dragColumns.length > 0) {
    var dragColumnsCount = dragColumns.length;
    for (var i = 0; i < dragColumnsCount; i++) {
      dragColumns[i].classList.remove(Table.MARKER_STYLE_CLASSES._DRAG);
    }
  }
  this.component._setTableColumnCellsClass(null, false, Table.MARKER_STYLE_CLASSES._DRAG);
};

/**
 * Clone the table container
 * @param {Element} tableContainer  the div DOM object
 * @return {Element} DOM object for the cloned table container
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._cloneTableContainer = function (tableContainer) {
  var tableContainerClone;
  var tableBody = this.component._getTableElementsByTagName(tableContainer,
    Table.DOM_ELEMENT._TBODY)[0];

  var scrollLeft = $(tableBody).scrollLeft();

  tableContainerClone = tableContainer.cloneNode(true);
  var tableBodyClone = this.component._getTableElementsByTagName(tableContainerClone,
    Table.DOM_ELEMENT._TBODY, true)[0];

  if (this.component._isDefaultSelectorEnabled()) {
    var headerSelectorElements = this.component._getTableElementsByClassName(tableContainerClone,
      Table.CSS_CLASSES._TABLE_HEADER_SELECTOR_CLASS, true);
    if (headerSelectorElements.length > 0) {
      var headerSelector = headerSelectorElements[0];
      headerSelector.selectedKeys = this.component.options.selected.row;
      headerSelector.selectionMode = 'all';
    }

    var selectors = this.component._getTableElementsByClassName(tableContainerClone,
      Table.CSS_CLASSES._TABLE_DATA_ROW_SELECTOR_CLASS, true);

    selectors.forEach(function (selector) {
      // eslint-disable-next-line no-param-reassign
      selector.selectedKeys = this.component.options.selected.row;
    }.bind(this));
  }

  // Use absolute positioning with a large negative top to put it off the screen without
  // affecting the scrollbar.  Fixed positioning does not work on Safari.
  tableContainerClone.style[Table.CSS_PROP._BACKGROUND_COLOR] = Table.CSS_VAL._TRANSPARENT;
  tableContainerClone.style[Table.CSS_PROP._BORDER_COLOR] = Table.CSS_VAL._TRANSPARENT;
  tableContainerClone.style[Table.CSS_PROP._POSITION] = Table.CSS_VAL._ABSOLUTE;

  if (this.component._isTableHeaderless()) {
    tableContainerClone.style[Table.CSS_PROP._HEIGHT] = tableBody.scrollHeight + Table.CSS_VAL._PX;
  } else {
    var tableHeader = this.component._getTableElementsByTagName(tableContainer,
      Table.DOM_ELEMENT._THEAD)[0];
    tableContainerClone.style[Table.CSS_PROP._HEIGHT] =
      (tableBody.scrollHeight + tableHeader.offsetHeight) + Table.CSS_VAL._PX;
  }
  tableContainerClone.style[Table.CSS_PROP._TOP] = -10000 + Table.CSS_VAL._PX;

  // Set both overflow and overflow-x/y because on IE, setting overflow does not
  // affect overflow-x/y that have been explicitly set.
  tableBodyClone.style[Table.CSS_PROP._OVERFLOW] = Table.CSS_VAL._HIDDEN;
  tableBodyClone.style[Table.CSS_PROP._OVERFLOW_X] = Table.CSS_VAL._HIDDEN;
  tableBodyClone.style[Table.CSS_PROP._OVERFLOW_Y] = Table.CSS_VAL._HIDDEN;
  tableBodyClone.style[Table.CSS_PROP._BACKGROUND_COLOR] = Table.CSS_VAL._TRANSPARENT;
  tableBodyClone.style[Table.CSS_PROP._BORDER_COLOR] = Table.CSS_VAL._TRANSPARENT;
  tableBodyClone.style[Table.CSS_PROP._WIDTH] = $(tableBody).width() + Table.CSS_VAL._PX;
  tableBodyClone.style[Table.CSS_PROP._HEIGHT] = tableBody.scrollHeight + Table.CSS_VAL._PX;

  document.body.appendChild(tableContainerClone); // @HTMLUpdateOK

  // scrollLeft must be set after element is appended, or it does not take effect
  $(tableBodyClone).scrollLeft(scrollLeft * 1.0);

  return tableContainerClone;
};

/**
 * Destroy the drag image
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._destroyDragImage = function () {
  if (this._dragImage) {
    $(this._dragImage).remove();
    this._dragImage = null;
  }
};

/**
 * Get the column index of the header target of an event
 * @param {Event} event  jQuery event object
 * @return {number} the column index of the header target
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._getEventColumnIndex = function (event) {
  return this.component._getElementColumnIdx(event.currentTarget);
};

/**
 * Get the index of the row under the pointer
 * @param {Event} event  jQuery event object
 * @return {number} index of the row under the pointer
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._getOverRowIndex = function (event) {
  var newRowIndex;
  var overRow = this.component._getFirstAncestor(event.target, Table.DOM_ELEMENT._TR, true);

  // Find the index from the DOM directly instead of calling this.component._getElementRowIdx.  There was a change in
  // this.component._getElementRowIdx to use cached elements so it's not accurate for dnd purpose.
  var cell = this.component._getFirstAncestor(event.target, '.' + Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
  if (cell != null) {
    var tableBodyRow = this.component._getFirstAncestor(cell, '.' + Table.CSS_CLASSES._TABLE_DATA_ROW_CLASS, true);
    if (tableBodyRow != null) {
      newRowIndex = $(tableBodyRow).index();
    }
  } else if ($(overRow).hasClass(Table.CSS_CLASSES._TABLE_DATA_ROW_DRAG_INDICATOR_BEFORE_CLASS)) {
    newRowIndex = this._dropRowIndex;
  } else {
    // If we are not in a cell and not in the indicator row, we are in an empty part
    // of the table body, so add any new row to the end.
    var tableBodyRows = this.component._getTableBodyRows();
    newRowIndex = tableBodyRows.length;
  }

  return newRowIndex;
};

/**
 * Handle dragstart on column
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragstart, returning false cancel the drag operation.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleColumnDragStart = function (event) {
  if (this._isColumnReorderEnabled()) {
    var columnIdx = this._getEventColumnIndex(event);

    this._dragStartColumnIdx = columnIdx;

    this._setReorderColumnsDataTransfer(event, columnIdx);

    // Remove any row and column selection
    this.component._clearSelectionState();

    // Remove text selection
    // Text selection doesn't get cleared unless we put it in a setTimeout
    setTimeout(function () {
      window.getSelection().removeAllRanges();
    }, 0);

    this._addDragMarkerClass(columnIdx);

    return true;
  }
  return undefined;
};

/**
 * Handle dragend on column
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragend, returning false has no special implication.
 * @memberof oj.TableDndContext
 */
// eslint-disable-next-line no-unused-vars
oj.TableDndContext.prototype.handleColumnDragEnd = function (event) {
  if (this._isColumnReorderEnabled()) {
    this.setTableHeaderColumnDraggable(null, false);
    this._dragStartColumnIdx = null;
    this.component._removeDragOverIndicatorColumn();
    this.component._removeTableHeaderColumnDragImage();

    this._removeDragMarkerClass();
  }
};

/**
 * Handle dragenter on column
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragenter, returning false indicates target can accept the data.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleColumnDragEnter = function (event) {
  if (this._isColumnReordering()) {
    return undefined;
  }

  var columnIdx = this._getEventColumnIndex(event);

  return this._invokeDropCallback('columns', 'dragEnter', event,
                                  { columnIndex: columnIdx });
};

/**
 * Handle dragover on column reordering
 * @param {Event} event  jQuery event object
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleColumnReorderDragOver = function (event) {
  var columnIdx = this._getEventColumnIndex(event);
  var dragStartColumnIdx = this._dragStartColumnIdx;

  if (dragStartColumnIdx != null && dragStartColumnIdx !== columnIdx) {
    this._currentDropColumnBefore = this._isDragOverBeforeColumn(event);

    // Check the current before/after column position against indicator position
    // to see if we need to move the indicator
    if (!(this._currentDropColumnBefore && dragStartColumnIdx === columnIdx - 1) &&
        !(!this._currentDropColumnBefore && dragStartColumnIdx === columnIdx + 1)) {
      this.component._displayDragOverIndicatorColumn(columnIdx, this._currentDropColumnBefore);
    }
    event.preventDefault();
  }
};

/**
 * Handle dragover on column
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragover, returning false indicates target can accept the data.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleColumnDragOver = function (event) {
  if (this._isColumnReordering()) {
    return this.handleColumnReorderDragOver(event);
  }

  var columnIdx = this._getEventColumnIndex(event);
  this._currentDropColumnBefore = this._isDragOverBeforeColumn(event);

  var returnValue = this._invokeDropCallback('columns', 'dragOver', event,
                                             { columnIndex: columnIdx });

  if (returnValue === false || event.isDefaultPrevented()) {
    this.component._displayDragOverIndicatorColumn(columnIdx, this._isDragOverBeforeColumn(event));
  }

  return returnValue;
};

/**
 * Handle dragleave on column
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragleave, returning false has no special implication.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleColumnDragLeave = function (event) {
  if (this._isColumnReordering()) {
    return undefined;
  }

  this.component._removeDragOverIndicatorColumn();

  var columnIdx = this._getEventColumnIndex(event);

  return this._invokeDndCallback('drop', 'columns', 'dragLeave', event,
                                 { columnIndex: columnIdx });
};

/**
 * Handle drop on column reordering
 * @param {Event} event  jQuery event object
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleColumnReorderDrop = function (event) {
  this.component._removeDragOverIndicatorColumn();
  var columnIdx = this._getEventColumnIndex(event);
  if (!this._currentDropColumnBefore) {
    columnIdx += 1;
  }
  this.component._columnsDestMap =
    this.component._moveTableHeaderColumn(this._dragStartColumnIdx, columnIdx, event);
  event.preventDefault();
};

/**
 * Handle drop on column
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of drop, returning false indicates target can accept the data.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleColumnDrop = function (event) {
  if (this._isColumnReordering()) {
    return this.handleColumnReorderDrop(event);
  }

  this.component._removeDragOverIndicatorColumn();
  var columnIdx = this._getEventColumnIndex(event);
  if (!this._currentDropColumnBefore) {
    columnIdx += 1;
  }

  return this._invokeDropCallback('columns', 'drop', event,
                                  { columnIndex: columnIdx });
};

/**
 * Handle dragstart on row
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragstart, returning false cancel the drag operation.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleRowDragStart = function (event) {
  var dragOption = this.component.options.dnd.drag;
  if (dragOption && dragOption.rows) {
    var ui = this._setDragRowsDataTransfer(event, dragOption.rows.dataTypes,
                                           this.component._getSelectedRowIdxs());
    if (ui) {
      return this._invokeDndCallback('drag', 'rows', 'dragStart', event, ui);
    }

    // Return false to cancel the dragstart event if no data
    return false;
  }
  return undefined;
};

/**
 * Handle drag on row
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of drag, returning false has no special implication.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleRowDrag = function (event) {
  return this._invokeDndCallback('drag', 'rows', 'drag', event);
};

/**
 * Handle dragend on row
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragend, returning false has no special implication.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleRowDragEnd = function (event) {
  // Perform any cleanup
  this._destroyDragImage();
  this.component._removeDragOverIndicatorRow();

  return this._invokeDndCallback('drag', 'rows', 'dragEnd', event);
};

/**
 * Handle dragenter on row
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragenter, returning false indicates target can accept the data.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleRowDragEnter = function (event) {
  var newRowIndex = this._getOverRowIndex(event);

  var returnValue = this._invokeDropCallback('rows', 'dragEnter', event,
                                             { rowIndex: newRowIndex });

  if (returnValue === false || event.isDefaultPrevented()) {
    this._updateDragRowsState(event, newRowIndex);
  }

  return returnValue;
};

/**
 * Handle dragover on row
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragover, returning false indicates target can accept the data.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleRowDragOver = function (event) {
  return this._invokeDropCallback('rows', 'dragOver', event,
                                  { rowIndex: this._dropRowIndex });
};

/**
 * Handle dragleave on row
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of dragleave, returning false has no special implication.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleRowDragLeave = function (event) {
  var returnValue = this._invokeDndCallback('drop', 'rows', 'dragLeave', event,
                                            { rowIndex: this._dropRowIndex });

  // Remove the indicator row if we are no longer in table body since
  // this may be the last dnd event we get.
  if (!this._isDndEventInElement(event, event.currentTarget)) {
    this.component._removeDragOverIndicatorRow();
    this._dropRowIndex = null;
  }

  return returnValue;
};

/**
 * Handle drop on row
 * @param {Event} event  jQuery event object
 * @return {boolean|undefined} a value passed back to jQuery.  Returning false will
 *         cause jQuery to call event.preventDefault and event.stopPropagation.
 *         Returning true or other values has no side effect.
 *         In the case of drop, returning false indicates target can accept the data.
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.handleRowDrop = function (event) {
  var dropRowIndex = this._dropRowIndex;

  // Perform any cleanup
  this._destroyDragImage();
  this.component._removeDragOverIndicatorRow();
  this._dropRowIndex = null;

  return this._invokeDropCallback('rows', 'drop', event,
                                  { rowIndex: dropRowIndex });
};

/**
 * Hide unselected rows in a tbody element
 * @param {Element} tableContainerClone  the cloned div DOM object
 * @param {Array.<number>} selArray  array of selected row index
 * @param {Array.<Object>} rowDataArray  array of row data
 * @return {number|null} row index of the first selected row
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._hideUnselectedRows = function (tableContainerClone, selArray,
  rowDataArray) {
  var i;
  var j;
  var firstRow = null;
  var tableBodyRows = this.component._getTableElementsByClassName(tableContainerClone,
    Table.CSS_CLASSES._TABLE_DATA_ROW_CLASS, true);
  for (i = tableBodyRows.length - 1; i >= 0; i--) {
    var row = tableBodyRows[i];
    var selectedRowIndex = selArray.indexOf(i);
    if (selectedRowIndex === -1) {
      row.style[Table.CSS_PROP._VISIBILITY] = Table.CSS_VAL._HIDDEN;
      row.style[Table.CSS_PROP._BORDER_COLOR] = Table.CSS_VAL._TRANSPARENT;
      var cells = this.component._getTableElementsByClassName(row,
        Table.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
      for (j = 0; j < cells.length; j++) {
        cells[j].style[Table.CSS_PROP._BORDER_COLOR] = Table.CSS_VAL._TRANSPARENT;
      }
    } else {
      firstRow = i;
      if (this.component._isDefaultSelectorEnabled()) {
        var selector = row.querySelectorAll('.' + Table.CSS_CLASSES._TABLE_DATA_ROW_SELECTOR_CLASS)[0];
        selector.rowKey = rowDataArray[selectedRowIndex].key;
      }
    }
  }

  // hide thead and tfoot
  var tableHeader = this.component._getTableElementsByTagName(tableContainerClone,
    Table.DOM_ELEMENT._THEAD, true);

  if (tableHeader != null && tableHeader.length > 0) {
    tableHeader[0].style[Table.CSS_PROP._VISIBILITY] = Table.CSS_VAL._HIDDEN;
    tableHeader[0].style[Table.CSS_PROP._BORDER_COLOR] = Table.CSS_VAL._TRANSPARENT;
    var headerCells = this.component._getTableElementsByClassName(tableHeader[0],
      Table.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS, true);
    for (i = 0; i < headerCells.length; i++) {
      headerCells[i].style[Table.CSS_PROP._BORDER_COLOR] = Table.CSS_VAL._TRANSPARENT;
    }
  }

  var tableFooter = this.component._getTableElementsByTagName(tableContainerClone,
    Table.DOM_ELEMENT._TFOOT, true);

  if (tableFooter != null && tableFooter.length > 0) {
    tableFooter[0].style[Table.CSS_PROP._VISIBILITY] = Table.CSS_VAL._HIDDEN;
  }

  return firstRow;
};

/**
 * Invoke user callback function specified in a drag or drop option
 * @param {string} dndType  the dnd option type ('drag' or 'drop')
 * @param {string} itemType  the drag or drop item type such as 'rows'
 * @param {string} callbackType  the callback type such as 'dragStart'
 * @param {Event} event  the jQuery Event object from drag and drop event
 * @param {Object} [ui]  additional properties to pass to callback function
 * @return {boolean} the return value from the callback function
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._invokeDndCallback =
  function (dndType, itemType, callbackType, event, ui) {
    var dndOption = this.component.options.dnd[dndType];
    var returnValue;

    if (dndOption && dndOption[itemType]) {
      // First let the callback decide if data can be accepted
      var callback = dndOption[itemType][callbackType];
      if (callback && typeof callback === 'function') {
        try {
          if (this.component._IsCustomElement()) {
            // For custom element, pass original DOM event and ignore return value.
            callback(event.originalEvent, ui);
          } else {
            // Hoist dataTransfer object from DOM event to jQuery event
            // eslint-disable-next-line no-param-reassign
            event.dataTransfer = event.originalEvent.dataTransfer;

            // Invoke callback function
            returnValue = callback(event, ui);
          }
        } catch (e) {
          Logger.error('Error: ' + e);
        }
      }
    }

    return returnValue;
  };

/**
 * Invoke user callback function specified in a drop option
 * @param {string} itemType  the drag or drop item type such as 'rows'
 * @param {string} callbackType  the callback type such as 'dragStart'
 * @param {Event} event  the jQuery Event object from drag and drop event
 * @param {Object} [ui]  additional properties to pass to callback function
 * @return {boolean} the return value from the callback function
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._invokeDropCallback = function (itemType, callbackType, event, ui) {
  var returnValue = this._invokeDndCallback('drop', itemType, callbackType, event, ui);

  if (returnValue === undefined) {
    if (this._matchDragDataType(event, itemType)) {
      event.preventDefault();
    }
  }

  return returnValue;
};

/**
 * Whether the column reorder is enabled
 * @return {boolean} true or false
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._isColumnReorderEnabled = function () {
  var dndOption = this.component.options.dnd;
  return (dndOption && dndOption.reorder && dndOption.reorder.columns === Table._OPTION_ENABLED);
};

/**
 * Return true if column reorder is in progress
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._isColumnReordering = function () {
  return (this._dragStartColumnIdx != null);
};

/**
 * Return true if the mouse/touch point of a dnd event is in an element
 * @param {Event} event  jQuery event object
 * @param {EventTarget} element  DOM element
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._isDndEventInElement = function (event, element) {
  var rect = element.getBoundingClientRect();
  var domEvent = event.originalEvent;

  // clientX and clientY are only available on the original DOM event.
  // IE returns client rect in non-integer values.  Trim it down to make sure
  // the pointer is really still in the element.
  return (domEvent.clientX >= Math.ceil(rect.left) && domEvent.clientX < Math.floor(rect.right) &&
          domEvent.clientY >= Math.ceil(rect.top) && domEvent.clientY < Math.floor(rect.bottom));
};

/**
 * @param {Object} event event
 * @return {boolean} <code>true</code> if the event is considered before the
 *                   column, <code>false</code> otherwise.
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._isDragOverBeforeColumn = function (event) {
  var columnRect = event.currentTarget.getBoundingClientRect();

  if (event.originalEvent.clientX != null) {
    var cursorPosX = columnRect.right - event.originalEvent.clientX;

    // First figure out whether the pointer is on the left half or right half
    var onRightHalf = (cursorPosX < (columnRect.right - columnRect.left) / 2);

    // Whether we are before/after the column depends on the reading direction
    return (oj.DomUtils.getReadingDirection() === 'rtl') ? onRightHalf : !onRightHalf;
  }
  return false;
};

/**
 * Return true if the data types from dnd event match one of the values in an array
 * @param {Event} event  jQuery event object for a drag and drop event
 * @param {string} itemType  The drop item type such as "rows" or "columns".
 * @return {boolean} true if one of the types in dragDataTypes and allowedTypes matches
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._matchDragDataType = function (event, itemType) {
  var dragDataTypes = event.originalEvent.dataTransfer.types;
  var dndOption = this.component.options.dnd.drop;

  if (dndOption && dndOption[itemType] && dndOption[itemType].dataTypes) {
    var allowedTypes = dndOption[itemType].dataTypes;
    var allowedTypeArray = (typeof allowedTypes === 'string') ? [allowedTypes] : allowedTypes;

    // dragDataTypes can be either an array of strings (Chrome) or a
    // DOMStringList (Firefox and IE).  For cross-browser compatibility, use its
    // length and index to traverse it.
    for (var i = 0; i < dragDataTypes.length; i++) {
      if (allowedTypeArray.indexOf(dragDataTypes[i]) >= 0) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Set the draggable attribute of a header column
 * @param {Element} headerColumn  the header column DOM element
 * @param {boolean} draggable  true if header column is draggable; false otherwise.
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._setHeaderColumnDraggable = function (headerColumn, draggable) {
  // eslint-disable-next-line no-param-reassign
  headerColumn.draggable = draggable;
  if (draggable) {
    // eslint-disable-next-line no-param-reassign
    headerColumn.style[Table.CSS_PROP._CURSOR] = Table.CSS_VAL._MOVE;
    headerColumn.classList.add(Table.MARKER_STYLE_CLASSES._DRAGGABLE);
  }
};

/**
 * Clear the draggable attribute of a header column
 * @param {Element} headerColumn  the header column DOM element
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._clearHeaderColumnDraggable = function (headerColumn) {
  // eslint-disable-next-line no-param-reassign
  headerColumn.draggable = '';
  // eslint-disable-next-line no-param-reassign
  headerColumn.style[Table.CSS_PROP._CURSOR] = Table.CSS_VAL._AUTO;
  headerColumn.classList.remove(Table.MARKER_STYLE_CLASSES._DRAGGABLE);
};

/**
 * Set the data of the selected rows into the dataTransfer object
 * @param {Event} nativeEvent  DOM event object
 * @param {string | Array.<string>} dataTypes  a data type or array of data types
 * @param {Array.<Object>} rowDataArray  array of row data
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._setDragRowsData = function (nativeEvent, dataTypes, rowDataArray) {
  if (dataTypes) {
    var dataTransfer = nativeEvent.dataTransfer;
    var jsonStr = JSON.stringify(rowDataArray);

    if (typeof dataTypes === 'string') {
      dataTransfer.setData(dataTypes, jsonStr);
    } else {
      for (var i = 0; i < dataTypes.length; i++) {
        dataTransfer.setData(dataTypes[i], jsonStr);
      }
    }
  }
};

/**
 * Set the data and drag image of the selected row into the dataTransfer object
 * @param {Event} event  jQuery event object
 * @param {string | Array.<string>} dataTypes  a data type or array of data types
 * @param {Array.<number>} selArray  array of selected row index
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._setDragRowsDataTransfer = function (event, dataTypes, selArray) {
  var rowDataArray = [];

  // Add data for selected rows to an array
  for (var i = 0; i < selArray.length; i++) {
    var row = this.component.getDataForVisibleRow(selArray[i]);
    if (row) {
      rowDataArray.push(row);
    }
  }

  // Use the row data array as drag data and create drag image
  if (rowDataArray.length) {
    this._setDragRowsData(event.originalEvent, dataTypes, rowDataArray);

    // Call _destroyDragImage before creating a new one in case the last drag image was not removed.
    // This could happen sometimes in some versions of Chrome.
    this._destroyDragImage();
    this._dragImage = this._setDragRowsImage(
      event.originalEvent,
      $(this.component._getFirstAncestor(event.currentTarget,
        Table.DOM_ELEMENT._TABLE, true)).parent()[0],
      selArray, rowDataArray);

    return { rows: rowDataArray };
  }

  return null;
};

/**
 * Set a drag image of the selected rows into the dataTransfer object
 * @param {Event} nativeEvent  DOM event object
 * @param {Element} tableContainer  the div DOM object
 * @param {Array.<number>} selArray  array of selected row index
 * @param {Array.<Object>} rowDataArray  array of row data
 * @return {Element} DOM object for the cloned table container
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._setDragRowsImage = function (nativeEvent, tableContainer, selArray,
  rowDataArray) {
  var tableContainerClone = this._cloneTableContainer(tableContainer);
  this._hideUnselectedRows(tableContainerClone, selArray, rowDataArray);
  var rect = tableContainer.getBoundingClientRect();
  var tableBody = this.component._getTableElementsByTagName(tableContainer,
    Table.DOM_ELEMENT._TBODY)[0];
  var scrollLeft = $(tableBody).scrollLeft();
  var scrollTop = $(tableBody).scrollTop();
  var offsetX = (nativeEvent.clientX - rect.left) + scrollLeft;
  var offsetY = (nativeEvent.clientY - rect.top) + scrollTop;
  nativeEvent.dataTransfer.setDragImage(tableContainerClone, offsetX, offsetY);

  return tableContainerClone;
};

/**
 * Set the data and drag image for column reorder into the dataTransfer object
 * @param {Event} event  jQuery event object
 * @param {number} columnIdx  the index of the column being dragged
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._setReorderColumnsDataTransfer = function (event, columnIdx) {
  var dataTransfer = event.originalEvent.dataTransfer;
  var tableIdHashCode = this.component._hashCode(this.component._getTableUID());
  dataTransfer.setData('Text',
                       Table._DND_REORDER_TABLE_ID_DATA_KEY +
                       ':' + tableIdHashCode + ':' + columnIdx);
  var dragImage = this.component._createTableHeaderColumnDragImage(columnIdx);
  try {
    dataTransfer.setDragImage(dragImage, 0, 0);
  } catch (e) {
    // MS Edge doesn't allow calling setDragImage()
  }
};

/**
 * Set the column draggable
 * @param {number|null} columnIdx  column index
 * @param {boolean} draggable true or false
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype.setTableHeaderColumnDraggable = function (columnIdx, draggable) {
  // set draggable only if DnD is enabled
  if (!this._isColumnReorderEnabled()) {
    return;
  }
  var headerColumns = this.component._getTableHeaderColumns();
  if (headerColumns != null && headerColumns.length > 0) {
    var i;

    for (i = 0; i < headerColumns.length; i++) {
      var headerColumn = headerColumns[i];

      if (columnIdx != null && i === columnIdx) {
        this._setHeaderColumnDraggable(headerColumn, draggable);
      } else {
        this._clearHeaderColumnDraggable(headerColumn);
      }
    }
  }
};

/**
 * Update the state of dragging rows
 * @param {Event} event  jQuery event object
 * @param {number} newRowIndex  index of the row that can receive the drop
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._updateDragRowsState = function (event, newRowIndex) {
  if (this._dropRowIndex !== newRowIndex) {
    var overRow = this.component._getFirstAncestor(event.target, Table.DOM_ELEMENT._TR, true);
    this._dropRowIndex = newRowIndex;
    this.component._displayDragOverIndicatorRow(this._dropRowIndex, true, overRow);
  }
};


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
 *       <td>Focus on the row. If <code class="prettyprint">selectionMode</code> for rows is enabled, selects the row as well.
 *       If multiple selection is enabled the selection handles will appear. Tapping a different row will deselect the previous selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Display context menu</td>
 *     </tr>
 *
 *     <tr>
 *       <td rowspan="2">Column Header</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Focus on the header. If <code class="prettyprint">selectionMode</code> for columns is enabled, selects the column as well.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Display context menu</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch section of classdesc, and standalone gesture doc
 * @memberof oj.ojTable
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
 *   <tr>
 *       <td rowspan="13">Cell</td>
 *       <td><kbd>Tab</kbd></td>
 *       <td>The first Tab into the Table moves focus to the first column header. The second Tab moves focus to the next focusable element outside of the Table.
 *           <br>If focus is on a row and the row is actionable then Tab moves focus to the next focusable element within the row. If focus is already on the last focusable element then focus will wrap to the first focusable element in the row.
 *           <br>If <code class="prettyprint">editMode</code> is rowEdit, please see the section 'Cell in EditableRow'.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Tab</kbd></td>
 *       <td>The first Shift+Tab into the Table moves focus to the first column header. The second Shift+Tab moves focus to the previous focusable element outside of the Table.
 *           <br>If focus is on a row and the row is actionable then Shift+Tab moves focus to the previous focusable element within the row. If focus is already on the first focusable element then focus will wrap to the last focusable element in the row.
 *           <br>If <code class="prettyprint">editMode</code> is rowEdit, please see the section 'Cell in EditableRow'.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus to the next row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+DownArrow</kbd></td>
 *       <td>Select and move focus to the next row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move focus to the previous row. If at the first row then move to the column header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+UpArrow</kbd></td>
 *       <td>Select and move focus to the previous row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Do nothing.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Do nothing.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Home</kbd></td>
 *       <td>Move focus to first row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>End</kbd></td>
 *       <td>Move focus to last row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Space</kbd></td>
 *       <td>Select row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>If the table <code class="prettyprint">editMode</code> is rowEdit then make the current row editable.
 *           <br>If the table <code class="prettyprint">editMode</code> is none then toggle the current row to actionable mode if there exists a tabbable element in the row. Once toggled to actionable mode, focus will be moved to be first tabbable element in the row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>F2</kbd></td>
 *       <td>If the table <code class="prettyprint">editMode</code> is none then toggle the current row to actionable mode if there exists a tabbable element in the row. Once toggled to actionable mode, focus will be moved to be first tabbable element in the row.
 *           <br>If the table <code class="prettyprint">editMode</code> is rowEdit then toggle the current row between editable and readonly.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td rowspan="15">Cell in Editable Row</td>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next editable cell or focusable element in the row.
 *           <br>If focus is on the last editable cell or focusable element in the row, make the next row editable and move focus to the first editable cell or focusable element in the next row.
 *           <br>If focus is on the last editable cell or focusable element in the last row, move focus to next focusable element on the page (outside table).
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Tab</kbd></td>
 *       <td>Move focus to previous editable cell or focusable element in the row.
 *           <br>If focus is on the first editable cell or focusable element in the row, make the previous row editable and move focus to the last editable cell or focusable element in the previous row.
 *           <br>If focus is on the first editable cell or focusable element in the first row, move focus to previous focusable element on the page (outside table).
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Handled in the editable cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+DownArrow</kbd></td>
 *       <td>Handled in the editable cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Handled in the editable cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+UpArrow</kbd></td>
 *       <td>Handled in the editable cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Handled in the editable cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Handled by the editable cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Home</kbd></td>
 *       <td>Handled in the editable cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>End</kbd></td>
 *       <td>Handled in the editable cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Space</kbd></td>
 *       <td>Handled in the editable cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Make the next row editable and move focus to the editable cell in current column in the next row.
 *          <br>If last row is editable then make it readonly.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Enter</kbd></td>
 *       <td>Make the previous row editable and move focus to the editable cell in current column in the previous row.
 *          <br>If first row is editable then make it readonly.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>F2</kbd></td>
 *       <td>Toggle the current row between editable and readonly.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Make the current row readonly.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="11">Column Header</td>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Navigate to next focusable element on page (outside table).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Tab</kbd></td>
 *       <td>Navigate to previous focusable element on page (outside table).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus to the first row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Do nothing.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus to previous column header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+LeftArrow</kbd></td>
 *       <td>Select and move focus to previous column header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus to next column header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+RightArrow</kbd></td>
 *       <td>Select and move focus to next column header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Home</kbd></td>
 *       <td>Move focus to first column header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>End</kbd></td>
 *       <td>Move focus to last column header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Space</kbd></td>
 *       <td>Select column.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTable
 */


/**
 * <p>Applications can customize animations triggered by actions in Table by either listening for <code class="prettyprint">animateStart/animateEnd</code>
 *    events or overriding action specific style classes on the animated item. To disable animations for specific table, please call event.preventDefault() from your listener.
 *    To disable animations for all tables, the sass variable values can be modified to specify empty effects. See the documentation of <a href="oj.AnimationUtils.html">oj.AnimationUtils</a>
 *    class for details.</p>
 *
 * <p>The following are actions and their corresponding sass variables in which applications can use to customize animation effects.
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Action</th>
 *       <th>Sass Variable</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>add</kbd></td>
 *       <td>$tableAddAnimation</td>
 *       <td>When a new row is added to the oj.TableDataSource associated with Table.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>remove</kbd></td>
 *       <td>$tableRemoveAnimation</td>
 *       <td>When an existing row is removed from the oj.TableDataSource associated with Table.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>update</kbd></td>
 *       <td>$tableUpdateAnimation</td>
 *       <td>When an existing row is updated in the oj.TableDataSource associated with Table.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment animationDoc - Used in animation section of classdesc
 * @memberof oj.ojTable
 */

/**
 * <p>Named slot for the Table's bottom panel where applications can add content such as a paging control. The Table will render the content provided at the bottom of the Table element.
 * The content specified should not include any styling that may conflict with the Table's positioning. Unsupported styling includes, but is not limited to, margins and absolute positioning.</p>
 *
 * @ojslot bottom
 * @memberof oj.ojTable
 *
 * @example <caption>Initialize the Table with the <code class="prettyprint">bottom</code> slot specified:</caption>
 * &lt;oj-table>
 *   &lt;div slot='bottom'>&lt;oj-paging-control>&lt;/oj-paging-control>&lt;/div>
 * &lt;/oj-table>
 */
/**
 * <p>Named slot for the Table's default cell template. The slot content must be a &lt;template> element. The content of the template should not include the &lt;td> element, only what's inside it.</p>
 *
 * <p>If the value of any column's <code class="prettyprint">template</code>, <code class="prettyprint">headerTemplate</code>, or <code class="prettyprint">footerTemplate</code> property conflicts with this named slot, this slot will only be used for that column.
 * Similarly, if a value is supplied for the deprecated <code class="prettyprint">columns-default.template</code> attribute, that named slot will be used as the default cell template slot instead of this named slot.</p>
 * <p>When the template is executed for the cell, it will have access to the binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - An object that contains information for the current cell being rendered (See the table below for a list of properties available on $current)</li>
 *   <li>alias - If data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 *
 * @ojslot cellTemplate
 * @memberof oj.ojTable
 * @ojslotitemprops oj.ojTable.CellTemplateContext
 *
 * @example <caption>Initialize the Table with the <code class="prettyprint">cellTemplate</code> slot specified:</caption>
 * &lt;oj-table>
 *   &lt;div slot='cellTemplate'>&lt;oj-bind-text>&lt;/oj-bind-text>&lt;/div>
 * &lt;/oj-table>
 */
/**
 * <p>Named slot for the Table's default footer template. The slot content must be a &lt;template> element. The content of the template should not include the &lt;td> element, only what's inside it.</p>
 *
 * <p>If the value of any column's <code class="prettyprint">template</code>, <code class="prettyprint">headerTemplate</code>, or <code class="prettyprint">footerTemplate</code> property conflicts with this named slot, this slot will only be used for that column.
 * Similarly, if a value is supplied for the deprecated <code class="prettyprint">columns-default.footer-template</code> attribute, that named slot will be used as the default footer template slot instead of this named slot.</p>
 *
 * @ojslot footerTemplate
 * @memberof oj.ojTable
 * @ojslotitemprops oj.ojTable.FooterTemplateContext
 *
 * @example <caption>Initialize the Table with the <code class="prettyprint">footerTemplate</code> slot specified:</caption>
 * &lt;oj-table>
 *   &lt;div slot='footerTemplate'>&lt;oj-bind-text>&lt;/oj-bind-text>&lt;/div>
 * &lt;/oj-table>
 */
/**
 * <p>Named slot for the Table's default header template. The slot content must be a &lt;template> element. The content of the template should not include the &lt;td> element, only what's inside it.</p>
 *
 * <p>If the value of any column's <code class="prettyprint">template</code>, <code class="prettyprint">headerTemplate</code>, or <code class="prettyprint">footerTemplate</code> property conflicts with this named slot, this slot will only be used for that column.
 * Similarly, if a value is supplied for the deprecated <code class="prettyprint">columns-default.header-template</code> attribute, that named slot will be used as the default header template slot instead of this named slot.</p>
 *
 * @ojslot headerTemplate
 * @memberof oj.ojTable
 * @ojslotitemprops oj.ojTable.HeaderTemplateContext
 *
 * @example <caption>Initialize the Table with the <code class="prettyprint">headerTemplate</code> slot specified:</caption>
 * &lt;oj-table>
 *   &lt;div slot='headerTemplate'>&lt;oj-bind-text>&lt;/oj-bind-text>&lt;/div>
 * &lt;/oj-table>
 */
/**
 * <p>The <code class="prettyprint">noData</code> slot is used to specify the content to display when the table is empty.
 * The slot content must be a &lt;template> element. If not specified then a default no data message will be displayed.
 *
 * @ojslot noData
 * @memberof oj.ojTable
 *
 * @example <caption>Initialize the Table with the <code class="prettyprint">noData</code> slot specified:</caption>
 * &lt;oj-table>
 *   &lt;template slot='noData'>
 *     &lt;span>&lt;oj-button>Add Data&lt;/span>
 *   &lt;template>
 * &lt;/oj-table>
 */
/**
 * @typedef {Object} oj.ojTable.RowTemplateContext
 * @property {Element} componentElement The &lt;oj-table> custom element.
 * @property {any} data The data for the current row being rendered.
 * @property {number} index The zero-based index of the current row being rendered.
 * @property {any} key The key of the current row being rendered.
 * @property {Object} rowContext Contex of the row.
 * @property {"edit"|"navigation"} mode The mode of the row containing the cell.  It can be "edit" or "navigation".
 */
/**
 * <p>Named slot for the Table's default row template. The slot content must be a &lt;template> element. The content of the template should include the &lt;tr> element.</p>
 *
 * @ojslot rowTemplate
 * @memberof oj.ojTable
 * @ojslotitemprops oj.ojTable.RowTemplateContext
 * @ojunsupportedbrowsers ["IE11"]
 *
 * @example <caption>Initialize the Table with the <code class="prettyprint">rowTemplate</code> slot specified:</caption>
 * &lt;oj-table>
 *   &lt;div slot='rowTemplate'>&lt;oj-bind-text>&lt;/oj-bind-text>&lt;/div>
 * &lt;/oj-table>
 */
// SubId Locators **************************************************************

/**
 * <p>Sub-ID for the Table element's cells.</p>
 * To lookup a cell the locator object should have the following:
 * <ul>
 * <li><b>subId</b>: 'oj-table-cell'</li>
 * <li><b>rowIndex</b>: the zero based absolute row index</li>
 * <li><b>columnIndex</b>: the zero based absolute column index</li>
 * </ul>
 *
 * @ojsubid oj-table-cell
 * @memberof oj.ojTable
 *
 * @example <caption>Get the cell at row index 1 and column index 2:</caption>
 * var node = myTable.getNodeBySubId( {'subId': 'oj-table-cell', 'rowIndex': 1, 'columnIndex': 2} );
 */

/**
 * <p>Sub-ID for the Table element's headers.</p>
 *
 *  To lookup a header the locator object should have the following:
 * <ul>
 * <li><b>subId</b>: 'oj-table-header'</li>
 * <li><b>index</b>: the zero based absolute column index.</li>
 * </ul>
 *
 * @ojsubid oj-table-header
 * @memberof oj.ojTable
 *
 * @example <caption>Get the header at the specified location:</caption>
 * var node = myTable.getNodeBySubId( {'subId': 'oj-table-header', 'index':0} );
 */

/**
 * <p>Sub-ID for the Table element's sort ascending icon in column headers.</p>
 *
 * To lookup a sort icon the locator object should have the following:
 * <ul>
 * <li><b>subId</b>: 'oj-table-sort-ascending'</li>
 * <li><b>index</b>: the zero based absolute column index</li>
 * </ul>
 *
 * @ojsubid oj-table-sort-ascending
 * @memberof oj.ojTable
 *
 * @example <caption>Get the sort ascending icon from the header at the specified location:</caption>
 * var node = myTable.getNodeBySubId( {'subId': 'oj-table-sort-ascending', 'index':0} );
 */

/**
 * <p>Sub-ID for the Table element's sort descending icon in column headers.</p>
 *
 * To lookup a sort icon the locator object should have the following:
 * <ul>
 * <li><b>subId</b>: 'oj-table-sort-descending'</li>
 * <li><b>index</b>: the zero based absolute column index</li>
 * </ul>
 *
 * @ojsubid oj-table-sort-descending
 * @memberof oj.ojTable
 *
 * @example <caption>Get the sort descending icon from the header at the specified location:</caption>
 * var node = myTable.getNodeBySubId( {'subId': 'oj-table-sort-descending', 'index':0} );
 */

/**
 * <p>Sub-ID for the Table element's footers.</p>
 *
 *  To lookup a footer the locator object should have the following:
 * <ul>
 * <li><b>subId</b>: 'oj-table-footer'</li>
 * <li><b>index</b>: the zero based absolute column index.</li>
 * </ul>
 *
 * @ojsubid oj-table-footer
 * @memberof oj.ojTable
 *
 * @example <caption>Get the header at the specified location:</caption>
 * var node = myTable.getNodeBySubId( {'subId': 'oj-table-footer', 'index':0} );
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for the Table element's cells.</p>
 *
 * @property {number} rowIndex the zero based absolute row index
 * @property {number} columnIndex the zero based absolute column index
 * @property {string} key the row key
 *
 * @ojnodecontext oj-table-cell
 * @memberof oj.ojTable
 */

/**
 * <p>Context for the Table element's headers.</p>
 *
 * @property {number} index the zero based absolute column index
 *
 * @ojnodecontext oj-table-header
 * @memberof oj.ojTable
 */

/**
 * <p>Context for the Table element's footers.</p>
 *
 * @property {number} index the zero based absolute column index
 *
 * @ojnodecontext oj-table-footer
 * @memberof oj.ojTable
 */

/**
 * Specifies the current selected rows in the table.
 * @expose
 * @name selected.row
 * @memberof! oj.ojTable
 * @instance
 * @type {KeySet}
 * @default new oj.KeySetImpl();
 * @ojsignature {target:"Type", value:"oj.KeySet<K>"}
 * @ojwriteback
 */

/**
 * Specifies the current selected columns in the table.
 * @expose
 * @name selected.column
 * @memberof! oj.ojTable
 * @instance
 * @type {KeySet}
 * @default new oj.KeySetImpl();
 * @ojsignature {target:"Type", value:"oj.KeySet<K>"}
 * @ojwriteback
 */


/* global __oj_table_metadata:false */

(function () {
  __oj_table_metadata.extension._WIDGET_NAME = 'ojTable';
  __oj_table_metadata.extension._INNER_ELEM = 'table';
  oj.CustomElementBridge.register('oj-table', { metadata: __oj_table_metadata });
}());

});