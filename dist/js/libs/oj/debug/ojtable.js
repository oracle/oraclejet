/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcontext', 'ojs/ojconfig', 'ojs/ojtranslation', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojdatacollection-common', 'ojs/ojanimation', 'ojs/ojmessaging', 'ojs/ojlogger', 'ojs/ojkeyset', 'ojdnd', 'ojs/ojdomscroller', 'ojs/ojeditablevalue', 'ojs/ojinputnumber', 'ojs/ojmenu', 'ojs/ojpopup', 'ojs/ojbutton', 'ojs/ojdatasource-common', 'ojs/ojdataprovideradapter', 'ojs/ojlistdataproviderview', 'touchr', 'ojs/ojvalidation-base'], 
function(oj, $, Context, Config, Translations, ThemeUtils, Components, DataCollectionUtils, AnimationUtils, Message, Logger, KeySet)
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
        "accessibleSortAscending": {
          "type": "string"
        },
        "accessibleSortDescending": {
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
    "ojSort": {}
  },
  "extension": {}
};


/* global Promise:false, Symbol:false, Components:false, DataCollectionUtils:false, Message:false, Set:false, Logger:false, Context:false, Config:false, Translations:false, ThemeUtils:false, KeySet:false */

/**
 * @ojcomponent oj.ojTable
 * @augments oj.baseComponent
 *
 * @since 0.6.0
 * @ojshortdesc A table displays data items in a tabular format with highly interactive features.
 * @ojrole grid
 * @ojrole gridcell
 * @ojrole rowheader
 * @ojrole columnheader
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
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
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
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
(function () {
  oj.__registerWidget('oj.ojTable', $.oj.baseComponent, {
    version: '1.0.0',
    defaultElement: '<table>',
    widgetEventPrefix: 'oj',
    options: {
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
       * @property {"add"|"remove"|"update"} action the action that starts the animation.  See <a href="#animation-section">animation</a> section for a list of actions.
       * @property {Element} element the target of animation. For row animations this will be the cell contents wrapped in a div.
       * @property {function():void} endCallback if the event listener calls event.preventDefault to cancel the default animation, it must call the endCallback function when it finishes its own animation handling and when any custom animation ends.
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
       * @property {"add"|"remove"|"update"} action the action that started the animation.  See <a href="#animation-section">animation</a> section for a list of actions.
       * @property {Element} element the target of animation. For row animations this will be the cell contents wrapped in an HTML div element.
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
         * @property {Array<Object>} rows An array of objects, with each object representing the data of one selected row in the structure below
         * @property {D} rows.data The raw row data
         * @property {number} rows.index The index for the row
         * @property {K} rows.key The key value for the row
         * @ojsignature {target:"Type", value:"<K,D>", for:"genericTypeParameters"}
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
         * @property {number} columnIndex The index for the column
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
         * @property {number} rowIndex The index for the row
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
           * @ojvalue {string} 'enabled' Enable column reordering
           * @ojvalue {string} 'disabled' Disable column reordering
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
       * <li>rowKey - the key of the currently edited row.</li>
       * <li>rowIndex - the index of the currently edited row.</li>
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
       * @typedef {Object} oj.ojTable.RowRendererContext context object used by rowRenderer callback.
       * @property {Element} componentElement A reference to the Table root element
       * @property {any} data Key/value pairs of the row
       * @property {Element} parentElement Empty rendered TR element
       * @property {Object} rowContext contex of the row
       * @property {oj.DataProvider<K, D>|null} rowContext.datasource The "data" attribute of the Table
       * @property {"edit"|"navigation"} rowContext.mode The mode of the row.  It can be "edit" or "navigation".
       * @property {oj.ojTable.ContextStatus<K>} rowContext.status Contains the rowIndex, rowKey, and currentRow
       * @ojsignature [{target:"Type", value:"{[name: string]: any}", for:"data"},
       *               {target:"Type", value:"<K,D>", for:"genericTypeParameters"}]
       */

      /**
       * @typedef {Object} oj.ojTable.ContextStatus<K>
       * @property {number} rowIndex index of the row
       * @property {K} rowKey key of the row
       * @property {oj.ojTable.CurrentRow<K>} currentRow current row.
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
       * @ojvalue {string} "loadMoreOnScroll" Additional data are fetched when the user scrolls to the bottom of the table.
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
       * @property {number=} x the horizontal position in pixels
       * @property {number=} y the vertical position in pixels
       * @property {number=} columnIndex the zero-based index of the cell at the origin of the table
       * @property {number=} rowIndex the zero-based index of the cell at the origin of the table.  If <a href="#scrollPolicy">scrollPolicy</a>
       * is set to 'loadMoreOnScroll and the row index is greater than maxCount set in <a href="#scrollPolicyOptions">scrollPolicyOptions</a>,
       * then it will scroll and fetch until the end of the table is reached and there are no more rows to fetch.
       * @property {any=} columnKey the key of the column.  This corresponds to the identifier of the column specified in <a href="#columns">columns</a>.
       * If the column does not exists then the value is ignored.
       * @property {any=} rowKey the key of the row.  If DataProvider is used for <a href="#data">data</a> and the key does not exists in the
       * DataProvider, then the value is ignored.  If DataProvider is not used then Table will fetch and scroll until the item is found
       * or the end of the table is reached and there's no more items to fetch.
       * @property {number=} offsetX the horizontal offset in pixels relative to the column identified by columnKey/columnIndex.
       * @property {number=} offsetY the vertical offset in pixels relative to the row identified by rowKey/rowIndex.
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
         * @typedef {Object} oj.ojTable.ColumnsRendererContext context for columns.renderer callback function.
         * @property {Object} cellContext context of the cell containing properties
         * @property {oj.DataProvider<K, D>|null} cellContext.datasource The "data" attribute of the Table
         * @property {"edit"|"navigation"} cellContext.mode The mode of the row.  It can be "edit" or "navigation".
         * @property {oj.ojTable.ContextStatus<K>} cellContext.status Contains the rowIndex, rowKey, and currentRow
         * @property {number} columnIndex The column index
         * @property {Element} componentElement A reference to the Table root element
         * @property {D} data The cell data.
         * @property {Element} parentElement Empty rendered <td> element
         * @property {Object} row Key/value pairs of the row
         * @ojsignature [{target:"Type", value:"{[name: string]: any}", for:"row"},
         *               {target:"Type", value:"<K,D>", for:"genericTypeParameters"}]
         */

        /**
         * The renderer function that renders the content of the cell.
         * The function will be passed a context object which contains
         * the following objects:
         * <ul>
         *   <li>cellContext.datasource: The "data" attribute of the Table</li>
         *   <li>cellContext.mode: The mode of the row.  It can be "edit" or "navigation".</li>
         *   <li>cellContext.status: Contains the rowIndex, rowKey, and currentRow</li>
         *   <li>columnIndex: The column index</li>
         *   <li>componentElement: A reference to the Table root element</li>
         *   <li>data: The cell data</li>
         *   <li>parentElement: Empty rendered <td> element</li>
         *   <li>row: Key/value pairs of the row</li>
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
         * @typedef {Object} oj.ojTable.FooterRendererContext
         * @property {number} columnIndex The column index
         * @property {Element} componentElement A reference to the Table root element
         * @property {Object} footerContext Context of the footer
         * @property {oj.DataProvider<K, D>|null} footerContext.datasource The "data" attribute of the Table
         * @property {Element} parentElement Empty rendered <td> element
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
         * <p>The name of the slot used to specify the template for rendering the footer cell. The slot content must be a &lt;template> element.
         * The content of the template should not include the &lt;td> element, only what's inside it.
         * When both footerTemplate and footerRenderer are specified, the footerRenderer takes precedence.</p>
         * <p>When the template is executed for each footer, it will have access to the binding context containing the following properties:</p>
         * <ul>
         *   <li>$current - an object that contains information for the current footer being rendered. (See the table below for a list of properties available on $current) </li>
         *   <li>alias - if data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
         * </ul>
         *
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojTable
         * @property {Element} componentElement The &lt;oj-table> custom element.
         * @alias columns[].footerTemplate
         * @ojshortdesc The slot name used to specify the template for rendering the footer cell. See the Help documentation for more information.
         * @type {string|null}
         * @ojsignature {target:"Type", value:"?"}
         * @default null
         * @ojtemplateslotname
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
         * @typedef {Object} oj.ojTable.HeaderRendererContext
         * @property {number} columnIndex The column index
         * @property {function(Object, function(object):void):void} [columnHeaderDefaultRenderer]
         *           If the column is not sortable then this function will be included in the context.
         *           The options parameter specifies the options (future use) for the renderer while the
         *           delegateRenderer parameter specifies the function which the developer would
         *           like to be called during rendering of the column header.
         * @property {function(Object, function(Object):void):void} [columnHeaderSortableIconRenderer]
         *           If the column is sortable then this function will be included in the context.
         *           The options parameter specifies the options (future use) for the renderer while the
         *           delegateRenderer parameter specifies the function which the developer would
         *           like to be called during rendering of the sortable column header. Calling the
         *           columnHeaderSortableIconRenderer function enables rendering custom header content
         *           while also preserving the sort icons.
         * @property {Element} componentElement A reference to the Table root element
         * @property {string} data The header text for the column
         * @property {Object} headerContext context for the header
         * @property {oj.DataProvider<K, D>|null} headerContext.datasource
         *           The "data" attribute of the Table
         * @property {Element} parentElement Empty rendered TH element
         * @ojsignature {target:"Type", value:"<K,D>", for:"genericTypeParameters"}
         */
        /**
         * The renderer function that renders the content of the header.
         * The function will be passed a context object which contains
         * the following objects:
         * <ul>
         *   <li>columnIndex: The column index</li>
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
         *   <li>componentElement: A reference to the Table root element</li>
         *   <li>data: The header text for the column</li>
         *   <li>headerContext.datasource: The "data" attribute of the Table</li>
         *   <li>parentElement: Empty rendered TH element</li>
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
         * @property {Element} componentElement The &lt;oj-table> custom element
         * @property {Object} data The data object for the current header
         * @alias columns[].headerTemplate
         * @ojshortdesc The slot name used to specify the template for rendering the header cell. See the Help documentation for more information.
         * @type {string|null}
         * @ojsignature {target:"Type", value:"?"}
         * @default null
         * @ojtemplateslotname
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
         * <p>The name of the slot used to specify the template for rendering the cell. The slot content must be a &lt;template> element.
         * The content of the template should not include the &lt;td> element, only what's inside it.
         * When both cell template and cell renderer are specified, the cell renderer takes precedence.</p>
         * <p>When the template is executed for the cell, it will have access to the binding context containing the following properties:</p>
         * <ul>
         *   <li>$current - An object that contains information for the current cell being rendered (See the table below for a list of properties available on $current)</li>
         *   <li>alias - If data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
         * </ul>
         *
         * @property {Element} componentElement The &lt;oj-table> custom element
         * @property {Object} data The data for the current cell being rendered
         * @property {Object} row  The data for the row contained the current cell being rendered
         * @property {number} index The zero-based index of the current row being rendered
         * @property {number} columnIndex The zero-based index of the current column being rendered.
         * @property {any} key The key of the current cell being rendered.
         * @property {string} mode The mode of the row containing the cell.  It can be "edit" or "navigation".
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojTable
         * @alias columns[].template
         * @ojshortdesc The slot name used to specify the template for rendering the cell. See the Help documentation for more information.
         * @type {string|null}
         * @ojsignature {target:"Type", value:"?"}
         * @default null
         * @ojtemplateslotname
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
         *   <li>cellContext.datasource: The "data" attribute of the Table</li>
         *   <li>cellContext.mode: The mode of the row.  It can be "edit" or "navigation".</li>
         *   <li>cellContext.status: Contains the rowIndex, rowKey, and currentRow</li>
         *   <li>columnIndex: The column index</li>
         *   <li>componentElement: A reference to the Table root element</li>
         *   <li>data: The cell data</li>
         *   <li>parentElement: Empty rendered <td> element</li>
         *   <li>row: Key/value pairs of the row</li>
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
         *   <li>$current - an object that contains information for the current footer being rendered. (See the table below for a list of properties available on $current) </li>
         *   <li>alias - if data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
         * </ul>
         * @property {Element} componentElement The &lt;oj-table> custom element.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojTable
         * @alias columnsDefault.footerTemplate
         * @ojshortdesc The slot name used to specify the template for rendering the footer cell. See the Help documentation for more information.
         * @type {string|null}
         * @ojsignature {target:"Type", value:"?"}
         * @default null
         * @ojtemplateslotname
         * @ojdeprecated {since: '7.0.0'}
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
         *   <li>columnIndex: The column index</li>
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
         *   <li>componentElement: A reference to the Table root element</li>
         *   <li>data: The header text for the column</li>
         *   <li>headerContext.datasource: The "data" attribute of the Table</li>
         *   <li>parentElement: Empty rendered TH element</li>
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
         *   <li>$current - an object that contains information for the current header being rendered. (See the table below for a list of properties available on $current) </li>
         *   <li>alias - if data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
         * </ul>
         *
         * @property {Element} componentElement The &lt;oj-table> custom element
         * @property {Object} data The data object for the current header
         *
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojTable
         * @alias columnsDefault.headerTemplate
         * @ojshortdesc The slot name used to specify the template for rendering the header cell. See the Help documentation for more information.
         * @type {string|null}
         * @ojsignature {target:"Type", value:"?"}
         * @default null
         * @ojtemplateslotname
         * @ojdeprecated {since: '7.0.0'}
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
         *   <li>$current - an object that contains information for the current cell being rendered</li>
         *   <li>alias - if data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
         * </ul>
         *
         * @property {Element} componentElement The &lt;oj-table> custom element
         * @property {Object} data The data for the current cell being rendered
         * @property {Object} row  The data for the row contained the current cell being rendered
         * @property {number} index The zero-based index of the current row being rendered
         * @property {number} columnIndex The zero-based index of the current column being rendered.
         * @property {any} key The key of the current cell being rendered.
         * @property {string} mode The mode of the row containing the cell.  It can be "edit" or "navigation".
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojTable
         * @alias columnsDefault.template
         * @ojshortdesc The slot name used to specify the template for rendering the cell. See the Help documentation for more information.
         * @type {string|null}
         * @ojsignature {target:"Type", value:"?"}
         * @default null
         * @ojtemplateslotname
         * @ojdeprecated {since: '7.0.0'}
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
         *       <li>$columnIndex: The column index</li>
         *       <li>$data: The header text</li>
         *       <li>$headerContext: The header context</li>
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
         *       <li>$columnIndex: The column index</li>
         *       <li>$footerContext: The header context</li>
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
       * @property {Object} currentRow the new current row
       * @property {Object} previousCurrentRow the previous current row
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
       * @property {Object} rowContext the rowContext of the row that editing is going to be performed on.
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
       * @property {Object} rowContext the rowContext of the row that editing is going to be performed on.
       * @property {Object} cancelEdit true if the edit should be negated based on actions (i.e. escape key).
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
       * Triggered when a sort is performed on the table.
       *
       * @expose
       * @event
       * @ojbubbles
       * @ojcancelable
       * @memberof oj.ojTable
       * @instance
       * @property {Element} header the key of the header which was sorted on
       * @property {'ascending'|'descending'} direction the direction of the sort
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
    },

    /**
     * @private
     */
    _BUNDLE_KEY:
    {
      _MSG_FETCHING_DATA: 'msgFetchingData',
      _MSG_NO_DATA: 'msgNoData',
      _MSG_INITIALIZING: 'msgInitializing',
      _MSG_STATUS_SORT_ASC: 'msgStatusSortAscending',
      _MSG_STATUS_SORT_DSC: 'msgStatusSortDescending',
      _LABEL_SELECT_COLUMN: 'labelSelectColumn',
      _LABEL_SELECT_ROW: 'labelSelectRow',
      _LABEL_EDIT_ROW: 'labelEditRow',
      _LABEL_SELECT_AND_EDIT_ROW: 'labelSelectAndEditRow'
    },

    /**
     * @private
     */
    _LOGGER_MSG:
    {
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
    },

    /**
     * @private
     * @type {string}
     */
    _FIELD_ID: 'id',

    /**
     * @private
     * @type {string}
     */
    _CONST_ATTRIBUTE: 'attribute',

    /**
     * @private
     * @type {string}
     */
    _CONST_DATA: 'data',

    /**
     * @private
     * @type {string}
     */
    _CONST_METADATA: 'metadata',

    /**
     * @private
     * @type {string}
     */
    _CONST_INDEXES: 'indexes',

    /**
     * @private
     * @type {string}
     */
    _CONST_INDEX: 'index',

    /**
     * @private
     * @type {string}
     */
    _CONST_KEY: 'key',

    /**
     * @private
     * @type {string}
     */
    _CONST_KEYS: 'keys',

    /**
     * @private
     * @type {string}
     */
    _CONST_AFTERKEYS: 'afterKeys',

    /**
     * @private
     * @type {string}
     */
    _CONST_ADDBEFOREKEYS: 'addBeforeKeys',

    /**
     * @private
     * @type {string}
     */
    _CONST_STARTINDEX: 'startIndex',

    /**
     * @private
     * @type {string}
     */
    _CONST_ENDINDEX: 'endIndex',

    /**
     * @private
     * @type {string}
     */
    _CONST_PAGESIZE: 'size',

    /**
     * @private
     * @type {string}
     */
    _CONST_OFFSET: 'offset',

    /**
     * @private
     * @type {string}
     */
    _CONST_SILENT: 'silent',

    /**
     * @private
     * @type {string}
     */
    _CONST_COLUMN: 'column',

    /**
     * @private
     * @type {string}
     */
    _CONST_ROW: 'row',

    /**
     * @private
     * @type {string}
     */
    _CONST_VALUE: 'value',

    /**
     * @private
     * @type {string}
     */
    _CONST_SORTCRITERIA: 'sortCriteria',

    /**
     * @private
     * @type {string}
     */
    _COLUMN_HEADER_ID: '_headerColumn',

    /**
     * @private
     * @type {string}
     */
    _COLUMN_HEADER_TEXT_ID: '_headerColumnText',

    /**
     * @private
     * @type {string}
     */
    _COLUMN_HEADER_ASC_ID: '_headerColumnAsc',

    /**
     * @private
     * @type {string}
     */
    _COLUMN_HEADER_DSC_ID: '_headerColumnDsc',

    /**
     * @private
     * @type {string}
     */
    _COLUMN_HEADER_ID_PREFIX: '_hdrCol',

    /**
     * @private
     * @type {string}
     */
    _FOCUS_CALLED: '_focusedCalled',

    /**
     * @private
     * @type {string}
     */
    _ROW_TEMPLATE: 'rowTemplate',

    /**
     * @private
     * @type {string}
     */
    _CELL_TEMPLATE: 'template',

    /**
     * @private
     * @type {string}
     */
    _HEADER_TEMPLATE: 'headerTemplate',

    /**
     * @private
     * @type {string}
     */
    _FOOTER_TEMPLATE: 'footerTemplate',

    /**
     * @private
     * @type {string}
     */
    _OPTION_AUTO: 'auto',

    /**
     * @private
     * @type {string}
     */
    _OPTION_ENABLED: 'enabled',

    /**
     * @private
     * @type {string}
     */
    _OPTION_DISABLED: 'disabled',

    /**
     * @private
     */
    _OPTION_EDIT_MODE:
    {
      _NONE: 'none',
      _ROW_EDIT: 'rowEdit'
    },

    /**
     * @private
     */
    _OPTION_SELECTION_MODES:
    {
      _SINGLE: 'single',
      _MULTIPLE: 'multiple',
      _NONE: 'none'
    },

    /**
     * @private
     */
    _OPTION_SCROLL_POLICY:
    {
      _AUTO: 'auto',
      _LOADMORE_ON_SCROLL: 'loadMoreOnScroll',
      _LOAD_ALL: 'loadAll'
    },

    /**
     * @private
     */
    _COLUMN_SORT_ORDER:
    {
      _ASCENDING: 'ascending',
      _DESCENDING: 'descending'
    },

    /**
     * @private
     */
    _DND_REORDER_TABLE_ID_DATA_KEY: 'oj-table-dnd-reorder-table-id',

    /**
     * @private
     */
    _KEYBOARD_CODES:
    {
      _KEYBOARD_CODE_SPACEBAR: 32,
      _KEYBOARD_CODE_ENTER: 13,
      _KEYBOARD_CODE_UP: 38,
      _KEYBOARD_CODE_DOWN: 40,
      _KEYBOARD_CODE_LEFT: 37,
      _KEYBOARD_CODE_RIGHT: 39,
      _KEYBOARD_CODE_HOME: 36,
      _KEYBOARD_CODE_END: 35,
      _KEYBOARD_CODE_TAB: 9,
      _KEYBOARD_CODE_ESC: 27,
      _KEYBOARD_CODE_F2: 113,
      _KEYBOARD_MODIFIER_SHIFT: 'shiftKey'
    },

    _CURRENT_ROW_STATUS:
    {
      _UPDATED: 'updated',
      _IGNORED: 'ignored',
      _VETOED: 'vetoed',
      _ERROR: 'error'
    },

    _BATCH_PROCESS_SIZE_WHEN_IDLE: 5,

    /** ** start Public APIs ****/
    /**
     * {@ojinclude "name":"nodeContextDoc"}
     * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
     * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
     * @ojsignature {target:"Type", value:"{subId: 'oj-table-cell', rowIndex: number, columnIndex: number, key:string} | {subId: 'oj-table-footer'|'oj-table-header',index: number}",for:"returns"}
     *
     * @example {@ojinclude "name":"nodeContextExample"}
     *
     * @expose
     * @instance
     * @memberof oj.ojTable
     * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
     */
    getContextByNode: function (node) {
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
    },

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
     * @expose
     * @memberof oj.ojTable
     * @instance
     * @example <caption>Invoke the <code class="prettyprint">getDataForVisibleRow</code> method:</caption>
     * myTable.getDataForVisibleRow(2);
     */
    getDataForVisibleRow: function (rowIndex) {
      var tableBodyRow = this._getTableDomUtils().getTableBodyRow(rowIndex);

      if (tableBodyRow != null) {
        return {
          key: $(tableBodyRow).data('rowKey'),
          data: $(tableBodyRow).data('rowData'),
          index: rowIndex
        };
      }

      return null;
    },

    // @inheritdoc
    getNodeBySubId: function (locator) {
      if (locator == null) {
        return this.element ? this.element[0] : null;
      }

      var domUtils = this._getTableDomUtils();
      var subId = locator.subId;
      var columnIdx;

      if (subId === 'oj-table-cell') {
        var rowIdx = parseInt(locator.rowIndex, 10);
        columnIdx = parseInt(locator.columnIndex, 10);
        return domUtils.getTableBodyLogicalCells(rowIdx)[columnIdx];
      } else if (subId === 'oj-table-header' ||
                 subId === 'oj-table-sort-ascending' ||
                 subId === 'oj-table-sort-descending') {
        columnIdx = locator.index;
        var tableHeaderColumn = domUtils.getTableHeaderLogicalColumns()[columnIdx];
        if (tableHeaderColumn != null) {
          if (subId === 'oj-table-header') {
            return tableHeaderColumn;
          } else if (subId === 'oj-table-sort-ascending') {
            var tableHeaderColumnSortAsc = domUtils.getTableElementsByClassName(tableHeaderColumn,
              oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
            if (tableHeaderColumnSortAsc.length > 0) {
              return tableHeaderColumnSortAsc[0];
            }
          } else {
            var tableHeaderColumnSortDsc = domUtils.getTableElementsByClassName(tableHeaderColumn,
              oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS);
            if (tableHeaderColumnSortDsc.length > 0) {
              return tableHeaderColumnSortDsc[0];
            }
          }
        }
      } else if (subId === 'oj-table-footer') {
        columnIdx = locator.index;
        var tableFooterCell = domUtils.getTableFooterLogicalCells()[columnIdx];

        if (tableFooterCell != null) {
          return tableFooterCell;
        }
      }

      // Non-null locators have to be handled by the component subclasses
      return null;
    },

    // @inheritdoc
    getSubIdByNode: function (node, ignoreSortIcons) {
      var domUtils = this._getTableDomUtils();
      var cell = domUtils.getFirstAncestor(node,
        '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);

      if (cell != null) {
        return {
          subId: 'oj-table-cell',
          rowIndex: domUtils.getElementRowIdx(cell),
          columnIndex: domUtils.getElementColumnIdx(cell)
        };
      }

      var headerSortAsc = domUtils.getFirstAncestor(node,
        '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS, true);

      if (headerSortAsc != null) {
        return {
          subId: ignoreSortIcons ? 'oj-table-header' : 'oj-table-sort-ascending',
          index: domUtils.getElementColumnIdx(headerSortAsc)
        };
      }

      var headerSortDsc = domUtils.getFirstAncestor(node,
        '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS, true);

      if (headerSortDsc != null) {
        return {
          subId: ignoreSortIcons ? 'oj-table-header' : 'oj-table-sort-descending',
          index: domUtils.getElementColumnIdx(headerSortDsc)
        };
      }

      var header = domUtils.getFirstAncestor(node,
        '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS, true);

      if (header != null) {
        return {
          subId: 'oj-table-header',
          index: domUtils.getElementColumnIdx(header)
        };
      }

      var footer = domUtils.getFirstAncestor(node,
        '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS, true);

      if (footer != null) {
        return {
          subId: 'oj-table-footer',
          index: domUtils.getElementColumnIdx(footer)
        };
      }

      return null;
    },

    /**
     * Refresh the table.
     * @export
     * @expose
     * @memberof oj.ojTable
     * @instance
     * @return {void}
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * myTable.refresh();
     */
    refresh: function () {
      this._super();
      this._refresh();
    },

    /**
     * Refresh a row in the table.
     * @param {number} rowIdx  Index of the row to refresh.
     * @return {Promise.<boolean>} Promise resolves when done to true if refreshed, false if not
     * @throws {Error}
     * @export
     * @expose
     * @memberof oj.ojTable
     * @instance
     * @example <caption>Invoke the <code class="prettyprint">refreshRow</code> method:</caption>
     * myTable.refreshRow(1);
     */
    refreshRow: function (rowIdx) {
      return this._refreshRow(rowIdx, true);
    },

    /**
     * Internal method for refreshRow
     * @param {number} rowIdx  Index of the row to refresh.
     * @param {boolean} resetFocus  true to reset focus if needed; false to ignore focus.
     * @return {Promise.<boolean>} Promise resolves when done to true if refreshed, false if not
     * @private
     */
    _refreshRow: function (rowIdx, resetFocus) {
      var dataprovider = this._getData();
      // if no data then bail
      if (!dataprovider) {
        return Promise.resolve(false);
      }

      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();

      if (isNaN(rowIdx) ||
          rowIdx < 0 ||
          (tableBodyRows != null && rowIdx >= tableBodyRows.length) ||
          tableBodyRows == null ||
          tableBodyRows.length === 0) {
        // validate rowIdx value
        var errSummary = this._LOGGER_MSG._ERR_REFRESHROW_INVALID_INDEX_SUMMARY;
        var errDetail = Translations.applyParameters(
          this._LOGGER_MSG._ERR_REFRESHROW_INVALID_INDEX_DETAIL,
          { rowIdx: rowIdx.toString() });
        throw new RangeError(errSummary + '\n' + errDetail);
      }

      // get row at rowIdx
      var rowKey = this._getRowKeyForRowIdx(rowIdx);
      var self = this;
      return self._queueTask(function () {
        return dataprovider.fetchByKeys({ keys: new Set([rowKey]) }).then(function (keyResult) {
          if (keyResult == null ||
              keyResult.results == null ||
              keyResult.results.size === 0) {
            return Promise.resolve(false);
          }

          // Find out if the row contains the focus element.  Focus will be lost to the document body after refresh.
          var tableBodyRow = self._getTableDomUtils().getTableBodyRow(rowIdx);
          // eslint-disable-next-line no-param-reassign
          resetFocus = resetFocus && $.contains(tableBodyRow, document.activeElement);

          var rowResults = keyResult.results.get(rowKey);
          self._refreshTableBodyRow(rowIdx, {
            data: rowResults.data,
            metadata: rowResults.metadata,
            index: rowIdx,
            key: rowKey
          });

          // Give the focus back to the table if needed.  currentRow is retained after refresh.
          if (resetFocus) {
            self._getTableDomUtils().getTable().focus();
          }

          tableBodyRow = self._getTableDomUtils().getTableBodyRow(rowIdx);
          if (tableBodyRow) {
            return self._finalizeRowRendering([tableBodyRow]);
          }
          // in case of null row, just resolve promise as there is no element to wait on
          return Promise.resolve(true);
        });
      });
    },

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
    widget: function () {
      var tableContainer = this._getTableDomUtils().getTableContainer();

      if (tableContainer != null) {
        return $(tableContainer);
      }
      return this.element;
    },

    /** ** end Public APIs ****/

    /** ** start internal widget functions ****/

    /**
     * @override
     * @protected
     * @instance
     * @memberof! oj.ojTable
     */
    _ComponentCreate: function () {
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
    },

    /**
     * Initialize the table after creation
     * @protected
     * @override
     * @memberof! oj.ojTable
     */
    _AfterCreate: function () {
      this._super();
      // create the context menu
      this._getTableDomUtils().createContextMenu(this._handleContextMenuSelect.bind(this));
      this._isInitFetch = true;
    },

    /**
     * Sets up needed resources for table, for example, add
     * listeners.
     * @protected
     * @override
     * @memberof! oj.ojTable
     */
    _SetupResources: function () {
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
          return this._invokeDataFetchRows(null);
        }.bind(this));
      }
    },

    /**
     * Releases resources for table.
     * @protected
     * @override
     * @memberof! oj.ojTable
     */
    _ReleaseResources: function () {
      this._super();
      this._cleanComponent();
    },

    /**
     * @override
     * @private
     */
    _destroy: function () {
      this._cleanComponent(true);
    },

    /**
     * Performs the cleanup necessary for 'destroy()' and 'ReleaseResources()' calls.
     * @param {boolean=} isDestroy whether this is a result of a call to 'destroy()'
     * @private
     */
    _cleanComponent: function (isDestroy) {
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
        $(this._getTableDomUtils().getTableBody()).removeAttr(Components._OJ_CONTAINER_ATTR);

        this.element.children().remove('.' + oj.TableDomUtils.CSS_CLASSES._TABLE_HEADER_CLASS);
        this.element.children().remove('.' + oj.TableDomUtils.CSS_CLASSES._TABLE_BODY_CLASS);
        this.element.children().remove('.' + oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CLASS);
        this.element.children().remove(
          '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_STATUS_MESSAGE_CLASS);
        this.element.children().remove(
          '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_BODY_MESSAGE_ROW_CLASS);

        //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
        oj.DomUtils.unwrap(this.element, $(this._getTableDomUtils().getTableContainer()));

        this.element[0].classList.remove(oj.TableDomUtils.CSS_CLASSES._TABLE_CLASS);

        // If this._data is a TableDataSourceAdapter, call destroy so that it can remove listeners
        // on the underlying DataSource to avoid stranding memory
        if (this._data instanceof oj.TableDataSourceAdapter) {
          this._data.destroy();
        }

        // If any template is being used, clean up the nodes to avoid memory leak in Knockout
        if (this._hasHeaderTemplate || this._hasCellTemplate || this._hasFooterTemplate) {
          this._cleanTemplateNodes(this.element[0]);
        }

        this._componentDestroyed = true;
      } else {
        // cleanup needed for 'ReleaseResources()' call only

        // unregister the listeners on the datasource
        this._unregisterDataSourceEventListeners();
        this._unregisterResizeListener();
      }
    },

    /**
     * Clears all pending component timeouts.
     * @private
     */
    _clearAllComponentTimeouts: function () {
      this._clearFocusoutTimeout();
      this._clearShowStatusTimeout();
    },

    /**
     * Clears any pending focusout timeout.
     * @private
     */
    _clearFocusoutTimeout: function () {
      if (this._focusoutTimeout) {
        clearTimeout(this._focusoutTimeout);
        this._focusoutTimeout = null;
      }
    },

    /**
     * Clears any pending show status timeout.
     * @private
     */
    _clearShowStatusTimeout: function () {
      if (this._showStatusTimeout) {
        clearTimeout(this._showStatusTimeout);
        this._showStatusTimeout = null;
      }
    },

    /**
       * <p>Notifies the component that its subtree has been connected to the document programmatically after the component has
       * been created.
       *
       * @memberof! oj.ojTable
       * @instance
       * @protected
       * @override
       */
    _NotifyAttached: function () {
      this._super();
      var domUtils = this._getTableDomUtils();
      var tableContainer = domUtils.getTableContainer();
      domUtils.refreshTableDimensions(tableContainer.offsetWidth, tableContainer.offsetHeight);
    },

    /**
     * <p>Notifies the component that its subtree has been made visible programmatically after the component has
     * been created.
     *
     * @memberof! oj.ojTable
     * @instance
     * @protected
     * @override
     */
    _NotifyShown: function () {
      this._super();
      var domUtils = this._getTableDomUtils();
      var tableContainer = domUtils.getTableContainer();
      domUtils.refreshTableDimensions(tableContainer.offsetWidth, tableContainer.offsetHeight);
    },

    /**
     * Override to do the delay connect/disconnect
     * @memberof oj.ojTable
     * @override
     * @protected
     */
    _VerifyConnectedForSetup: function () {
      return true;
    },

    //* * @inheritdoc */
    _GetDefaultContextMenu: function () {
      return this._defaultContextMenu;
    },

    /**
     * @param {Object} contextMenu The JET Menu to open as a context menu
     * @param {Event} event What triggered the menu launch
     * @param {string} eventType "mouse", "touch", "keyboard"
     * @private
     */
    _NotifyContextMenuGesture: function (contextMenu, event, eventType) {
      var openOptions = {};
      this._contextMenuEvent = event.originalEvent;

      // first check if we are invoking on an editable or clickable element, or draggable element on touch event. If so bail
      if (this._isNodeEditable(this._contextMenuEvent.target) ||
          this._isNodeClickable(this._contextMenuEvent.target) ||
          (eventType === 'touch' && this._isNodeDraggable(this._contextMenuEvent.target))) {
        return;
      }

      var headerColumn;
      var domUtils = this._getTableDomUtils();
      var tableBodyCell = domUtils.getFirstAncestor(this._contextMenuEvent.target,
        '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
      if (tableBodyCell != null) {
        var columnIdx = domUtils.getElementColumnIdx(tableBodyCell);
        headerColumn = domUtils.getTableHeaderColumn(columnIdx);
      } else {
        headerColumn = domUtils.getFirstAncestor(this._contextMenuEvent.target,
        '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS, true);
      }

      if (this._contextMenuEvent.type === 'keydown') {
        var table = this._tableDomUtils.getTable();
        if (headerColumn == null) {
          headerColumn = domUtils.getTableHeaderColumn(this._activeColumnIndex);
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
              var tableBodyRow = domUtils.getTableBodyRow(focusedRowIdx);
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
        var footerCell = domUtils.getFirstAncestor(this._contextMenuEvent.target,
        '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS, true);
        if (headerColumn == null && tableBodyCell == null && footerCell == null) {
          return;
        }
      }
      this._contextMenuEventHeaderColumn = headerColumn;

      // for jQuery it's the menu instance, for custom element it's the element node
      var contextMenuNode = contextMenu.element ? contextMenu.element[0] : contextMenu;
      var contextMenuItemAsc;
      var contextMenuItemDsc;
      var contextMenuItemResize;

      if (headerColumn && headerColumn.getAttribute('data-oj-sortable') ===
          this._OPTION_ENABLED) {
        contextMenuItemAsc = contextMenuNode.querySelectorAll(
          '[data-oj-command=oj-table-sortAsc]');
        if (contextMenuItemAsc.length > 0) {
          contextMenuItemAsc = contextMenuItemAsc[0];
          contextMenuItemAsc.classList.remove('oj-disabled');
        }
        contextMenuItemDsc = contextMenuNode.querySelectorAll(
          '[data-oj-command=oj-table-sortDsc]');
        if (contextMenuItemDsc.length > 0) {
          contextMenuItemDsc = contextMenuItemDsc[0];
          contextMenuItemDsc.classList.remove('oj-disabled');
        }
      } else {
        contextMenuItemAsc = contextMenuNode.querySelectorAll(
          '[data-oj-command=oj-table-sortAsc]');
        if (contextMenuItemAsc.length > 0) {
          contextMenuItemAsc = contextMenuItemAsc[0];
          contextMenuItemAsc.classList.add('oj-disabled');
        }
        contextMenuItemDsc = contextMenuNode.querySelectorAll(
          '[data-oj-command=oj-table-sortDsc]');
        if (contextMenuItemDsc.length > 0) {
          contextMenuItemDsc = contextMenuItemDsc[0];
          contextMenuItemDsc.classList.add('oj-disabled');
        }
      }
      if (headerColumn && headerColumn.getAttribute('data-oj-resizable') ===
          this._OPTION_ENABLED) {
        contextMenuItemResize = contextMenuNode.querySelectorAll(
          '[data-oj-command=oj-table-resize]');
        if (contextMenuItemResize.length > 0) {
          contextMenuItemResize = contextMenuItemResize[0];
          contextMenuItemResize.classList.remove('oj-disabled');
        }
      } else {
        contextMenuItemResize = contextMenuNode.querySelectorAll(
          '[data-oj-command=oj-table-resize]');
        if (contextMenuItemResize.length > 0) {
          contextMenuItemResize = contextMenuItemResize[0];
          contextMenuItemResize.classList.add('oj-disabled');
        }
      }
      this._OpenContextMenu(event, eventType, openOptions);
    },

    /**
     * @override
     * @private
     */
    _draw: function () {
      this._setFinalTask(function () {
        // avoid any unneccessarily costly operation that would cause hiccup when scrolling
        // this will be done when scrolling stops
        if (!this._skipRefreshTableDimension) {
          this._syncTableSizing();
        }

        if (this._initialSelectionStateValidated) {
          this._syncSelectionState();
        } else {
          this._validateInitialSelectionState();
        }

        this._skipRefreshTableDimension = false;
      });

      if (!this.element.is('table')) {
        var errSummary = this._LOGGER_MSG._ERR_ELEMENT_INVALID_TYPE_SUMMARY;
        var errDetail = this._LOGGER_MSG._ERR_ELEMENT_INVALID_TYPE_DETAIL;
        throw new RangeError(errSummary + '\n' + errDetail);
      }

      // add css class to element
      this.element[0].classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_ELEMENT_CLASS);
      this.element[0].setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'table');

      // create the initial table structure
      this._getTableDomUtils().createInitialTable(this._isTableHeaderless(),
                                                  this._isTableFooterless());
      // style the initial table structure
      this._getTableDomUtils().styleInitialTable();

      var self = this;
      this._queueTask(function () {
        // populate the table header DOM with header content
        self._refreshTableHeader();
        // populate the table footer DOM with footer content
        self._refreshTableFooter();
        self._refreshTableBody();
        self._processSlottedChildren();
      });

      if (this.options.disabled) {
        this.disable();
      }
    },

    /**
     * @override
     * @private
     */
    _events:
    {
      /*
       * Reset the keyboard state on focusout and set the inactive
       * selected rows
       */
      focusout: function (event) {
        this._clearFocusoutTimeout();

        var domUtils = this._getTableDomUtils();
        var table = domUtils.getTable();

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
        this._focusoutTimeout = setTimeout(function () {
          this._focusOutHandler($(table));
          this._focusOutHandler($(domUtils.getTableContainer()));
          this._clearKeyboardKeys();
          this._clearFocusedHeaderColumn();
          this._clearFocusedRow(false);
          this._getTableResizeUtils().clearTableHeaderColumnsResize();
          this._setTableEditable(false, false, 0, true, event, true);

          // clear styling on previous editable data cell if necessary
          if (this._focusEditCell) {
            this._focusEditCell.classList.remove(
              oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_EDIT_CLASS);
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

        var domUtils = this._getTableDomUtils();
        var table = domUtils.getTable();
        var tableBody = domUtils.getTableBody();
        var tableContainer = domUtils.getTableContainer();

        this._focusInHandler($(table));
        this._focusInHandler($(tableContainer));
        if ($(tableBody).has(event.target).length > 0) {
          var focusedRowIdx = this._getFocusedRowIdx();
          var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();

          if (!this._isNodeEditable(event.target) &&
              !this._isNodeClickable(event.target) &&
              !this._isTableActionableMode() &&
              !this._hasEditableRow() &&
              !this._temporaryTableChildElementFocus &&
              focusedRowIdx == null &&
              focusedHeaderColumnIdx == null) {
            // when table is not in editable/actionable mode there shouldn't be
            // focus to child row elements. Delay the focus to prevent a race
            // condition with menu launcher re-focus
            setTimeout(function () {
              table.focus();
            }, 0);
          }
        }
      },

      /*
       * Check the keyboard state on focus
       */
      'focus .oj-table-column-header-acc-asc-link': function (event) {
        setTimeout(function () {
          // delay the column/row focus just in case a column/row is clicked.
          this._checkRowOrHeaderColumnFocus(event);
        }.bind(this), 0);
      },

      /*
       * Set the cell edit class on cell focus when row is editable.
       */
      'focus .oj-table-data-cell': function (event) {
        var eventTarget = this._getEventTargetElement(event);
        var rowIdx = this._getTableDomUtils().getElementRowIdx(eventTarget);

        if (rowIdx === this._getEditableRowIdx()) {
          // clear styling on previous editable data cell if necessary
          if (this._focusEditCell && this._focusEditCell !== eventTarget &&
              this._focusEditCell.classList.contains(
                oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_EDIT_CLASS)) {
            this._focusEditCell.classList.remove(
              oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_EDIT_CLASS);
          }
          // add styling on new editable data cell
          eventTarget.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_EDIT_CLASS);
          this._focusEditCell = eventTarget;
        }
      },

      /*
       * Capture acc selected column event
       */
      'click .oj-table-checkbox-acc-select-column': function (event) {
        var eventTarget = this._getEventTargetElement(event);
        var columnIdx = this._getTableDomUtils().getElementColumnIdx(eventTarget);
        var selected = $(eventTarget).is(':checked');
        // if selected then focus on the column
        if (selected) {
          this._setHeaderColumnFocus(columnIdx, true, false);
        }
        this._handleSelectionGesture(columnIdx, false, true);
        event.stopPropagation();
      },

      /*
       * Capture acc selected row event
       */
      'click .oj-table-checkbox-acc-select-row': function (event) {
        var eventTarget = this._getEventTargetElement(event);
        var rowIdx = this._getTableDomUtils().getElementRowIdx(eventTarget);
        var selected = $(eventTarget).is(':checked');

        var focused = false;

        // if selected then focus on the row
        if (selected) {
          focused = this._setRowFocus(rowIdx, true, true, null, event, true);
        } else {
          this._setTableEditable(false, false, 0, true, event);
        }

        if (focused) {
          this._handleSelectionGesture(rowIdx, true, true);
          this._setTableEditable(true, false, 0, true, event);
        }
        event.stopPropagation();
      },

      /*
       * Capture keyboard down events
       */
      keydown: function (event) {
        this._addKeyboardKey(event.keyCode);

        // ignore key event on the footer or target is editable
        var keyboardCode1 = this._getKeyboardKeys()[0];

        if (keyboardCode1 !== this._KEYBOARD_CODES._KEYBOARD_CODE_ESC &&
            keyboardCode1 !== this._KEYBOARD_CODES._KEYBOARD_CODE_ENTER &&
            keyboardCode1 !== this._KEYBOARD_CODES._KEYBOARD_CODE_F2 &&
            keyboardCode1 !== this._KEYBOARD_CODES._KEYBOARD_CODE_TAB &&
            (this._isNodeEditable(event.target) ||
             (this._getTableDomUtils().getTableFooter() != null &&
              $(this._getTableDomUtils().getTableFooter()).has(event.target).length > 0))) {
          return;
        }

        // process single or two key events
        if (this._getKeyboardKeys().length === 1 ||
            (this._getKeyboardKeys().length === 2 &&
             event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT])) {
          if (this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_UP) ||
              this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_DOWN) ||
              this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_HOME) ||
              this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_END)) {
            // need to do this so that these keys don't act on the page. e.g. pressing Down would cause the
            // page to go down as well as the row to change
            event.preventDefault();
            event.stopPropagation();
          }
          var isExtend = event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT];

          if (this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_UP) ||
              this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_DOWN)) {
            this._handleKeydownUpDown(event, isExtend &&
              this._getRowSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE);
          } else if (this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_LEFT) ||
                     this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_RIGHT)) {
            this._handleKeydownLeftRight(event, isExtend &&
              this._getColumnSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE);
          } else if (this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_TAB)) {
            this._handleKeydownTab(event);
          } else if (keyboardCode1 === this._KEYBOARD_CODES._KEYBOARD_CODE_F2) {
            this._handleKeydownF2(event);
          } else if (keyboardCode1 === this._KEYBOARD_CODES._KEYBOARD_CODE_SPACEBAR) {
            this._handleKeydownSpacebar(event);
          } else if (keyboardCode1 === this._KEYBOARD_CODES._KEYBOARD_CODE_ENTER) {
            this._handleKeydownEnter(event);
          } else if (keyboardCode1 === this._KEYBOARD_CODES._KEYBOARD_CODE_HOME) {
            this._handleKeydownHome(event);
          } else if (keyboardCode1 === this._KEYBOARD_CODES._KEYBOARD_CODE_END) {
            this._handleKeydownEnd(event);
          } else if (keyboardCode1 === this._KEYBOARD_CODES._KEYBOARD_CODE_ESC) {
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
          if (this._isNodeEditable(event.target) ||
              (this._getTableDomUtils().getTableFooter() != null &&
               $(this._getTableDomUtils().getTableFooter()).has(event.target).length > 0)) {
            this._removeKeyboardKey(keyboardCode1);
            return;
          }
          this._removeKeyboardKey(keyboardCode1);
        }
        // remove the keycode from our internal list of pressed keys.
        this._removeKeyboardKey(event.keyCode);
      },

      /*
       * Cancel any resize if the mouse leaves the table
       */
      'mouseleave .oj-table-element': function () {
        this._getTableResizeUtils().clearTableHeaderColumnsResize();
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
        this._mouseDownRowIdx = this._getTableDomUtils().getElementRowIdx(event.target);

        if (this._mouseDownRowIdx == null) {
          return;
        }

        var tableBodyRow = this._getTableDomUtils().getTableBodyRow(this._mouseDownRowIdx);

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
        var domUtils = this._getTableDomUtils();
        var rowIdx = domUtils.getElementRowIdx(eventTarget);
        if (domUtils.isTableOwned(eventTarget)) {
          eventTarget.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._HOVER);
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
        var domUtils = this._getTableDomUtils();
        var rowIdx = domUtils.getElementRowIdx(eventTarget);
        if (domUtils.isTableOwned(eventTarget)) {
          eventTarget.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._HOVER);
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
          if (!this._getTableResizeUtils().handleHeaderColumnResizeStart(event)) {
            // get the column index
            var columnIdx = this._getTableDomUtils().getElementColumnIdx(
              this._getEventTargetElement(event));
            // set the column focus if shift key is not pressed
            if (!event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT]) {
              // skip scrolling column into viewport
              this._setHeaderColumnFocus(columnIdx, true, true);
              $(event.target).data(this._FOCUS_CALLED, true);
            }
          }
        }
      },

      /*
       * show the ascending/descending links when the mouse
       * enters a column header
       */
      'mouseenter .oj-table-column-header-cell': function (event) {
        if (this._getTableResizeUtils().setResizeCursor(event)) {
          return;
        }
        var eventTarget = this._getEventTargetElement(event);
        this._handleMouseEnterColumnHeader(eventTarget);
      },

      /*
       * show the resize cursor
       */
      'mousemove .oj-table-header': function (event) {
        this._getTableResizeUtils().setResizeCursor(event);
      },

      /*
       * remove the hover for resize
       */
      'mousemove .oj-table-column-header-cell': function (event) {
        var eventTarget = this._getEventTargetElement(event);
        if (this._getTableResizeUtils().setResizeCursor(event)) {
          this._handleMouseLeaveColumnHeader(eventTarget);
          return;
        }
        this._handleMouseEnterColumnHeader(eventTarget);
      },

      /*
       * hide the ascending/descending links when the mouse
       * leaves a column header
       */
      'mouseleave .oj-table-column-header-cell': function (event) {
        var eventTarget = this._getEventTargetElement(event);
        this._handleMouseLeaveColumnHeader(eventTarget);
      },

      /*
       * handle column resizing.
       */
      'mouseup .oj-table-column-header-cell': function (event) {
        this._getTableResizeUtils().handleHeaderColumnResizeEnd(event);
      },

      /*
       * set the row focus when the mouse clicks on a cell.
       */
      'mousedown .oj-table-data-cell': function (event) {
        this._lastSelectedRowIdx = null;
        // get the row index of the cell element
        var eventTarget = this._getEventTargetElement(event);
        var rowIdx = this._getTableDomUtils().getElementRowIdx(eventTarget);
        // set row focus only if shift key is not pressed
        if (!event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT]) {
          this._setRowFocus(rowIdx, true, true, eventTarget, event);
          $(event.target).data(this._FOCUS_CALLED, true);
        }
      },

      /*
       * handle column resizing.
       */
      'mouseup .oj-table-data-cell': function (event) {
        this._getTableResizeUtils().handleHeaderColumnResizeEnd(event);
      },

      /*
       * invoke a sort on the column data when the mouse clicks the ascending link
       */
      'click .oj-table-sort-icon-container': function (event) {
        var columnIdx = this._getTableDomUtils().getElementColumnIdx(event.target);
        var tableHeaderColumn = this._getTableDomUtils().getTableHeaderColumn(columnIdx);

        if (!tableHeaderColumn) {
          return;
        }

        // check if the column is currently sorted
        var sorted = $(tableHeaderColumn).data('sorted');
        if (sorted === this._COLUMN_SORT_ORDER._ASCENDING) {
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
        var rowIdx = this._getTableDomUtils().getElementRowIdx(eventTarget);
        var focusCalled = $(event.target).data(this._FOCUS_CALLED);

        var isShift = event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT];
        if (!focusCalled && (!isShift || (isShift && this._getFocusedRowIdx() == null))) {
          var focused = this._setRowFocus(rowIdx, true, true, eventTarget, event);
          $(event.target).data(this._FOCUS_CALLED, false);

          if (!focused) {
            return;
          }
        }

        // check if we are selecting
        if (isShift) {
          var focusedRowIdx = this._getFocusedRowIdx();
          if (focusedRowIdx != null) {
            // remove the selection highlight
            window.getSelection().removeAllRanges();

            if (this._getRowSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE) {
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
              this._getRowSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE) {
            this._getTableDomUtils().createTableBodyRowTouchSelectionAffordance(rowIdx);
          }
        }
      },

      /*
       * Set row to editable.
       */
      'dblclick .oj-table-data-cell': function (event) {
        var columnIdx = this._getTableDomUtils().getElementColumnIdx(event.target);
        this._setTableEditable(true, false, columnIdx, true, event);
      },

      /*
       * set current row when the mouse right clicks on a cell.
       */
      'contextmenu .oj-table-data-cell': function (event) {
        // get the row index of the cell element
        var rowIdx = this._getTableDomUtils().getElementRowIdx(this._getEventTargetElement(event));
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
        var columnIdx = this._getTableDomUtils().getElementColumnIdx(eventTarget);
        // check if we need to focus
        var focusCalled = $(event.target).data(this._FOCUS_CALLED);

        var isShift = event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT];
        if (!focusCalled && (!isShift || (isShift && this._getFocusedHeaderColumnIdx() == null))) {
          // set the column focus
          this._setHeaderColumnFocus(columnIdx, true, false);
          $(event.target).data(this._FOCUS_CALLED, false);
        }

        // check if we are selecting
        if (isShift) {
          var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
          if (focusedHeaderColumnIdx != null &&
              this._getColumnSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE) {
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
    },

    /**
     * @private
     */
    _refresh: function () {
      var initFetch = false;

      if (this._dataOption !== this.options[this._CONST_DATA]) {
        this._clearCachedDataMetadata();

        if (this._data == null) {
          // need to do an initial fetch
          initFetch = true;
        }
      }
      var contextMenu = this._GetContextMenu();
      if (contextMenu != null && contextMenu !== this._getTableDomUtils().getContextMenu()) {
        this._getTableDomUtils().createContextMenu(this._handleContextMenuSelect.bind(this));
      }
      this._getTableDomUtils().clearCachedDom();
      this._getTableDomUtils().refreshContextMenu();
      this._refreshTableStatusMessage();
      this._clearIdleCallback();

      if (initFetch) {
        return this._initFetch();
      }

      var self = this;
      return this._queueTask(function () {
        var result = self._invokeDataFetchRows(null);
        self = null;

        return result;
      });
    },

    /**
     * @override
     * @private
     */
    _setOption: function (key, value) {
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

        if (updated === this._CURRENT_ROW_STATUS._UPDATED) {
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
          if (key === 'columns') {
            this._clearCachedMetadata();
            this._refreshTableHeader();
          } else if (key === 'data') {
            this._beforeDataRefresh();
          }
          this._refresh();
        }
      }
    },

    /** ** end internal widget functions ****/

    /** ** start internal functions ****/

    /** scroll position functions **/
    /**
     * When data change occurs (sort, refresh etc.), invalidate any remaining selection range by
     * syncing the value with what's stored in the selected row KeySet
     * @private
     */
    _invalidateRangeSelection: function () {
      var selection = this.option('selection');

      if (selection == null) {
        return;
      }
      for (var i = 0; i < selection.length; i++) {
        var startRowKey;
        var endRowKey;

        var rangeObj = selection[i];
        if (rangeObj.startKey != null) {
          startRowKey = rangeObj.startKey[this._CONST_ROW];
        }
        if (rangeObj.endKey != null) {
          endRowKey = rangeObj.endKey[this._CONST_ROW];
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
    },

    /**
     * Things to do before data is refresh, this could be due to sort, model refresh event, or data attribute changed.
     * @private
     */
    _beforeDataRefresh: function () {
      this._clearIdleCallback();
      this._adjustScrollPositionOnRefresh();
      this._invalidateRangeSelection();
      if (this._lastSelectedRowIdxArray != null) {
        this._lastSelectedRowIdxArray = [];
      }
      // reset selection validation state if data refreshed or changed
      this._initialSelectionStateValidated = false;
    },

    /**
     * Adjust scrollPosition such that it will scroll to the selection anchor (last selected row)
     * @private
     */
    _adjustScrollPositionOnRefresh: function () {
      var scrollPosition = this.options.scrollPosition == null ? {} : this.options.scrollPosition;

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
    },

    /**
     * Whether the scrollPosition has been adjusted before data is refresh
     * @private
     */
    _isScrollPositionAdjusted: function () {
      var scrollPosition = this.options.scrollPosition;
      if (scrollPosition == null) {
        return false;
      }

      return (scrollPosition.rowIndex === undefined && scrollPosition.rowKey != null);
    },

    /**
     * Find the row element by the row key
     * @private
     */
    _findRowElementByKey: function (rowKey) {
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();

      if (tableBodyRows != null) {
        for (var i = 0; i < tableBodyRows.length; i++) {
          if (oj.KeyUtils.equals($(tableBodyRows[i]).data('rowKey'), rowKey)) {
            return tableBodyRows[i];
          }
        }
      }
      return null;
    },

    /**
     * @private
     */
    _getColumnKeys: function () {
      var columnKeys = [];
      var columns = this._getColumnDefs();
      if (columns != null) {
        for (var i = 0; i < columns.length; i++) {
          columnKeys.push(columns[i][this._FIELD_ID]);
        }
      }
      return columnKeys;
    },

    /**
     * @private
     */
    _getLocalRowKeys: function () {
      var rowKeys = [];
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
      if (tableBodyRows != null) {
        for (var i = 0; i < tableBodyRows.length; i++) {
          rowKeys.push($(tableBodyRows[i]).data('rowKey'));
        }
      }
      return rowKeys;
    },

    /**
     * Validate a set of keys
     * @return {Promise|null} a Promise that resolves to true if one of the keys specified is valid, false otherwise.
     *                        Returns null if it cannot validate the keys.
     * @private
     */
    _validateKeys: function (keys) {
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
    },

    /**
     * Refreshes the Table's sizing, and ensures the Table's viewport is satisfied.
     * @param {boolean=} skipRequiredCheck flag to pass into 'refreshTableDimensions' call
     * @private
     */
    _syncTableSizing: function (skipRequiredCheck) {
      // don't provide a width and height to ensure we resize contents even if overall size is the same
      this._getTableDomUtils().refreshTableDimensions(null, null, skipRequiredCheck);
      // if loadMoreOnScroll then check if we have underflow and do a fetch if we do
      if (this._isLoadMoreOnScroll() && !this._dataFetching && this._domScroller) {
        this._setDataWaitingState(false);
        this._domScroller.checkViewport().then(this._domScrollerSuccessFunc,
                                               this._clearDataWaitingState);
        // syncScrollPosition would be invoked after data are fetched and new rows are rendered
      } else {
        // syncScrollPosition must be done after sizing is done (refreshTableDimensions is invoked)
        this._syncScrollPosition();
      }
    },

    /**
     * Synchronize value of scrollPosition attribute with the actual table body scroll position
     * @param {object} position the value of scrollPosition attribute
     * @param {boolean=} skipKeyValidation whether to skip row key validation in position.
     * @return {boolean} true if the scroll position syncing is completed.
     *                   false if the scroll syncing is pending an asynchronous callback.
     * @private
     */
    _syncScrollPosition: function (position, skipKeyValidation) {
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
    },

    /**
     * Whether table can scroll horizontally
     * @private
     */
    _isScrollableX: function () {
      return Math.abs(this._getScrollWidth() - this._getClientWidth()) > 1;
    },

    /**
     * Whether table can scroll vertically
     * @private
     */
    _isScrollableY: function () {
      return Math.abs(this._getScrollHeight() - this._getClientHeight()) > 1;
    },

    /**
     * @private
     */
    _getScrollWidth: function () {
      if (this._scrollWidth == null) {
        this._scrollWidth = this._getTableDomUtils().getScroller().scrollWidth;
      }
      return this._scrollWidth;
    },

    /**
     * @private
     */
    _getScrollHeight: function () {
      if (this._scrollHeight == null) {
        this._scrollHeight = this._getTableDomUtils().getScroller().scrollHeight;
      }
      return this._scrollHeight;
    },

    /**
     * @private
     */
    _getClientWidth: function () {
      if (this._clientWidth == null) {
        this._clientWidth = this._getTableDomUtils().getScroller().clientWidth;
      }
      return this._clientWidth;
    },

    /**
     * @private
     */
    _getClientHeight: function () {
      if (this._clientHeight == null) {
        this._clientHeight = this._getTableDomUtils().getScroller().clientHeight;
      }
      return this._clientHeight;
    },

    /**
     * @private
     */
    _setScrollX: function (x) {
      var scroller = this._getTableDomUtils().getScroller();

      // flag it so that handleScroll won't do anything
      this._skipScrollUpdate = true;

      oj.DomUtils.setScrollLeft(scroller, x);
    },

    /**
     * @return {boolean} true if this led to a change in scroller scrollTop position
     *                   false otherwise
     * @private
     */
    _setScrollY: function (y) {
      var scroller = this._getTableDomUtils().getScroller();

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
    },

    /**
     * Retrieve the scroll top value based on row index
     * @return {number|undefined} the scroll top of the row with the specified index,
     *         or -1 if the row is not yet fetched, or undefined if the index is invalid
     * @private
     */
    _getScrollTopByIndex: function (rowIndex) {
      // avoid doing offsetTop
      if (rowIndex === 0) {
        return 0;
      }

      // check to ensure max count is not reached
      if (this._isLoadMoreOnScroll() && rowIndex > this.options.scrollPolicyOptions.maxCount) {
        return undefined;
      }

      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
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
    },

    /**
     * Retrieve the scroll top value based on row key
     * @return {number|undefined} the scroll top of the row with the specified key,
     *         or -1 if the row is not yet fetched, or undefined if the key is invalid
     * @private
     */
    _getScrollTopByKey: function (rowKey) {
      var row = this._findRowElementByKey(rowKey);
      if (row != null) {
        var rows = this._getTableDomUtils().getTableBodyRows();
        if (rows != null && rows.length > 0) {
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
    },

    /**
     * @private
     */
    _getScrollLeftByIndex: function (columnIndex) {
      if (columnIndex === 0) {
        return 0;
      }

      var tableHeaderColumn = this._getTableDomUtils().getTableHeaderColumn(columnIndex);
      if (tableHeaderColumn != null) {
        return tableHeaderColumn.offsetLeft;
      }

      // invalid column index
      return undefined;
    },

    /**
     * @private
     */
    _getScrollLeftByKey: function (columnKey) {
      var index = this._getColumnIdxForColumnKey(columnKey);
      return this._getScrollLeftByIndex(index);
    },

    /**
     * Determine the scroll x and y based on value of scrollPosition
     * @return {object} contains x and y which is the horizontal and vertical scroll
     *         position.  If x/y is undefined, that implies the value is invalid.  If
     *         x/y is -1, that implies there are more data to fetch so the value is
     *         not final.
     * @private
     */
    _getScrollCoordinates: function (scrollPosition) {
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
    },

    _getCurrentHorizontalScrollPosition: function (scrollLeft) {
      var scrollPosition = {};
      scrollPosition.x = scrollLeft === undefined ? this._scrollLeft : scrollLeft;

      var prevScrollPosition = this.option('scrollPosition');

      var diff = Math.abs(prevScrollPosition.x - scrollPosition.x);
      if (diff < 1 && prevScrollPosition.columnKey != null &&
          !isNaN(prevScrollPosition.columnIndex)) {
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
    },

    _getCurrentVerticalScrollPosition: function (scrollTop) {
      var scrollPosition = {};
      scrollPosition.y = scrollTop === undefined ? this._scrollTop : scrollTop;

      // precheck for row Height in case it wasn't set earlier.
      var tableBody = this._getTableDomUtils().getTableBody();
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
    },

    /**
     * Calculate the scrollPosition based on scrollLeft and scrollTop
     * @private
     */
    _getCurrentScrollPosition: function (scrollLeft, scrollTop) {
      var scrollPosition = this._getCurrentHorizontalScrollPosition(scrollLeft);
      var scrollPositionY = this._getCurrentVerticalScrollPosition(scrollTop);

      Object.keys(scrollPositionY).forEach(function (prop) {
        scrollPosition[prop] = scrollPositionY[prop];
      });

      return scrollPosition;
    },

    /**
     * Retrieve the location in pixels of each column and cache it
     * @private
     */
    _getColumnLocations: function () {
      if (this._columnOffsets == null) {
        this._columnOffsets = [];
        var headerColumns = this._getTableDomUtils().getTableHeaderColumns();

        if (headerColumns && headerColumns.length > 0) {
          // depending on browser, offsetLeft of first column might not be 0
          var firstColumnOffset = 0;
          firstColumnOffset = headerColumns[0].offsetLeft;
          this._columnOffsets.push(0);

          var i;
          for (i = 1; i < headerColumns.length; i++) {
            this._columnOffsets.push(headerColumns[i].offsetLeft - firstColumnOffset);
          }
        }
      }
      return this._columnOffsets;
    },

    /**
     * Find the element closest to the top of the viewport
     * @param {object} scrollPosition the current scrollPosition
     * @param {number} currScrollTop the current scrolltop
     * @private
     */
    _findClosestElementToTop: function (scrollPosition, currScrollTop) {
      var rows = this._getTableDomUtils().getTableBodyRows();
      if (rows == null || rows.length === 0) {
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
    },

    _hasMoreToFetch: function () {
      if (this._isLoadMoreOnScroll()) {
        return !this._noMoreData;
      }

      return false;
    },

    /**
     * Add a keyCode to internally track pressed keys. keyCodes should be added on
     * mouse down and then later removed on mouse up.
     * @param {number} keyCode  KeyCode of the keyboard key.
     * @private
     */
    _addKeyboardKey: function (keyCode) {
      var foundCode = false;
      var props = Object.keys(this._KEYBOARD_CODES);
      for (var j = 0; j < props.length; j++) {
        var prop = props[j];
        if (this._KEYBOARD_CODES[prop] === keyCode) {
          foundCode = true;
        }
      }

      if (!foundCode) {
        // only add keys we are interested in
        return;
      }

      var keyboardKeys = this._getKeyboardKeys();
      var found = false;
      var keyboardKeysCount = keyboardKeys.length;
      for (var i = 0; i < keyboardKeysCount; i++) {
        if (keyboardKeys[i] === keyCode) {
          found = true;
          break;
        }
      }
      if (!found) {
        keyboardKeys.push(keyCode);
      }
    },

    /**
     * Called by component to add a busy state and return the resolve function
     * to call when the busy state can be removed.
     * @param {String} msg the description of the busy state
     * @private
     */
    _addComponentBusyState: function (msg) {
      var busyContext = Context.getContext(this.element[0]).getBusyContext();
      var options = {
        description: "The component identified by '" + this._getTableDomUtils().getTableId() +
          "' " + msg
      };
      return busyContext.addBusyState(options);
    },

    /**
     * Creates a new component busy state, and adds it to the busy state stack.
     * @param {String} msg the description of the busy state
     * @return {Function} the resolve function to call when busy state can be removed.
     * @private
     */
    _createComponentBusyState: function (msg) {
      var busyStateResolveFunc = this._addComponentBusyState(msg);
      if (this._busyStateStack == null) {
        this._busyStateStack = [];
      }
      this._busyStateStack.push(busyStateResolveFunc);
      return busyStateResolveFunc;
    },

    /**
     * Clears the busy state corresponding to the specified resolve function.
     * @param {Function} busyStateResolveFunc the specified resolve function
     * @private
     */
    _clearComponentBusyState: function (busyStateResolveFunc) {
      busyStateResolveFunc();
      if (this._busyStateStack) {
        var index = this._busyStateStack.indexOf(busyStateResolveFunc);
        if (index !== -1) {
          this._busyStateStack.splice(index, 1);
        }
      }
    },

    /**
     * Clears all busy states in the pending busy state stack.
     * @private
     */
    _clearBusyStateStack: function () {
      if (this._busyStateStack) {
        for (var i = 0; i < this._busyStateStack.length; i++) {
          this._busyStateStack[i]();
        }
        this._busyStateStack = null;
      }
    },

    /**
     * Sets the 'delayRefreshTableDimensions' busy state.
     * @private
     */
    _setDelayRefreshTableDimensionsBusyState: function () {
      if (!this._delayRefreshTableDimensionsResolveFunc) {
        this._delayRefreshTableDimensionsResolveFunc = this._addComponentBusyState('is waiting to refresh dimensions.');
      }
    },

    /**
     * Clears the 'delayRefreshTableDimensions' busy state.
     * @private
     */
    _clearDelayRefreshTableDimensionsBusyState: function () {
      if (this._delayRefreshTableDimensionsResolveFunc) {
        this._delayRefreshTableDimensionsResolveFunc();
        this._delayRefreshTableDimensionsResolveFunc = null;
      }
    },

    /**
     * Sets the 'focusout' busy state.
     * @private
     */
    _setFocusoutBusyState: function () {
      if (!this._focusoutResolveFunc) {
        this._focusoutResolveFunc = this._addComponentBusyState('is handling focusout.');
      }
    },

    /**
     * Clears the 'focusout' busy state.
     * @private
     */
    _clearFocusoutBusyState: function () {
      if (this._focusoutResolveFunc) {
        this._focusoutResolveFunc();
        this._focusoutResolveFunc = null;
      }
    },

    /**
     * Sets the 'idleRender' busy state.
     * @private
     */
    _setIdleRenderBusyState: function () {
      if (!this._idleRenderResolveFunc) {
        this._idleRenderResolveFunc = this._addComponentBusyState('is waiting for idle rendering.');
      }
    },

    /**
     * Clears the 'idleRender' busy state.
     * @private
     */
    _clearIdleRenderBusyState: function () {
      if (this._idleRenderResolveFunc) {
        this._idleRenderResolveFunc();
        this._idleRenderResolveFunc = null;
      }
    },

    /**
     * Sets the 'scrollPos' busy state.
     * @private
     */
    _setScrollPosBusyState: function () {
      if (!this._scrollPosResolveFunc) {
        this._scrollPosResolveFunc = this._addComponentBusyState('is handling scroll position.');
      }
    },

    /**
     * Clears the 'scrollPos' busy state.
     * @private
     */
    _clearScrollPosBusyState: function () {
      if (this._scrollPosResolveFunc) {
        this._scrollPosResolveFunc();
        this._scrollPosResolveFunc = null;
      }
    },

    /**
     * Clears all busy states that are currently set on the Table.
     * @private
     */
    _clearAllComponentBusyStates: function () {
      this._clearBusyStateStack();
      this._clearDataWaitingState();
      this._clearDelayRefreshTableDimensionsBusyState();
      this._clearFocusoutBusyState();
      this._clearIdleRenderBusyState();
      this._clearScrollPosBusyState();
      this._setComponentReady();
    },

    /**
     * Add a new tr and refresh the DOM at the row index and refresh the table
     * dimensions to accomodate the new row
     * @param {number} rowIdx  row index relative to the start of the table
     * @param {Object} row row
     * @param {Object} docFrag  document fragment
     * @param {number} docFragStartIdx  document fragment row start index
     * @return {Element} Returns the added tr
     *
     * @private
     */
    _addSingleTableBodyRow: function (rowIdx, row, docFrag, docFragStartIdx) {
      var tableBodyRow = this._getTableDomUtils().createTableBodyRow(rowIdx, row[this._CONST_KEY]);
      this._getTableDomUtils().styleTableBodyRow(tableBodyRow, true);
      // insert the <tr> element in to the table body DOM
      this._getTableDomUtils().insertTableBodyRow(rowIdx, tableBodyRow, row, docFrag);
      tableBodyRow =
        this._refreshTableBodyRow(rowIdx, row, tableBodyRow, docFrag, docFragStartIdx, true);
      if (!docFrag) {
        // call subtreeAttached on individual row if we are not batching in documentFragment
        Components.subtreeAttached(tableBodyRow);
      }
      return tableBodyRow;
    },

    /**
     * Animate only the visibles in the provided row array
     * @param tableBodyRows Array of tr DOM elements
     * @param rowIdxArray Array of row indexes for the tr elements
     * @param action Animation action
     * @return Promise Return a Promise which resolves when the animation is complete
     * @private
     */
    _animateVisibleRows: function (tableBodyRows, rowIdxArray, action) {
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
        var self = this;
        return this._getTableAnimationUtils().animateTableBodyRows(tableBodyRows, action).then(
          function () {
            self._registerResizeListener();
          });
      }

      this._animationActionOverride = 'update';
      return Promise.resolve();
    },

    /**
     * Check and set the row or header column focus
     * @private
     */
    _checkRowOrHeaderColumnFocus: function (event) {
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
    },

    /**
     * Clean descendant nodes created by template
     * @param {Element} rootNode - the root node to clean recursively
     * @private
     */
    _cleanTemplateNodes: function (rootNode) {
      var templateEngine = this._getTemplateEngine();
      if (templateEngine != null) {
        templateEngine.clean(rootNode);
      }
    },

    /**
     * Clear any cached metadata
     * @private
     */
    _clearCachedMetadata: function () {
      this._columnDefArray = null;
      this._columnOffsets = null;
      this._setTableActionableMode(false);
    },

    /**
     * Clear any cached data metadata
     * @private
     */
    _clearCachedDataMetadata: function () {
      if (this._data != null) {
        this._unregisterDataSourceEventListeners();
      }
      this._data = null;
    },

    _clearCachedDimensions: function () {
      this._clientWidth = null;
      this._clientHeight = null;
      this._scrollWidth = null;
      this._scrollHeight = null;
    },

    /**
     * Clear waiting state and hide the Fetching Data... status message.
     * @private
     */
    _clearDataWaitingState: function () {
      this._hideStatusMessage();
      this._dataFetching = false;
      if (this._dataResolveFunc) {
        this._dataResolveFunc();
        this._dataResolveFunc = null;
      }
    },

    /**
     * Clear any keyboard keys
     * @private
     */
    _clearKeyboardKeys: function () {
      this._keyboardKeys = [];
    },

    /**
     * Clear the focused column header
     * @private
     */
    _clearFocusedHeaderColumn: function () {
      var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
      if (focusedHeaderColumnIdx != null) {
        this._setHeaderColumnFocus(focusedHeaderColumnIdx, false, false);
      }
      this._activeColumnIndex = -1;
    },

    /**
     * Clear the focused row
     * @param {boolean} updateCurrentRow  whether to update the currentRow
     * @private
     */
    _clearFocusedRow: function (updateCurrentRow) {
      var focusedRowIdx = this._getFocusedRowIdx();

      if (focusedRowIdx != null) {
        this._setRowFocus(-1, true, updateCurrentRow, null, null);
      }
    },

    /**
     * Clear the selected rows
     * @private
     */
    _clearSelectedRows: function () {
      this._selectionAnchorIdx = null;
      this._lastSelectedRowIdx = null;
      var rowKeySet = this.option('selected.row');
      var newRowKeySet = rowKeySet.clear();
      if (newRowKeySet !== rowKeySet) {
        var selected = { row: newRowKeySet, column: this.option('selected.column') };
        this._setSelected(selected);
      }
    },

    /**
     * Clear entire selection state
     * @private
     */
    _clearSelectionState: function () {
      this._selectionAnchorIdx = null;
      this._lastSelectedRowIdx = null;
      this._lastSelectedHeaderIdx = null;
      if (this._hasSelected()) {
        var selected = { row: new oj.KeySetImpl(), column: new oj.KeySetImpl() };
        this._setSelected(selected);
      }
    },

    /**
     * Clear the sorted column header indicator. Note this does not affect the order
     * of the data. This is just to clear the UI indication.
     * @param {number|null} columnIdx  column index
     * @private
     */
    _clearSortedHeaderColumn: function (columnIdx) {
      var sortedTableHeaderColumnIdx = this._getSortedTableHeaderColumnIdx();
      if (sortedTableHeaderColumnIdx != null) {
        var domUtils = this._getTableDomUtils();
        var sortedTableHeaderColumn = domUtils.getTableHeaderColumn(sortedTableHeaderColumnIdx);
        this._sortInfo = null;
        $(sortedTableHeaderColumn).data('sorted', null);

        if (columnIdx == null ||
            sortedTableHeaderColumnIdx !== columnIdx) {
          this._hideTableHeaderColumnSortIcon(sortedTableHeaderColumnIdx);
        } else {
          var sortIcon = domUtils.getSortIcon(sortedTableHeaderColumn);
          if (sortIcon != null) {
            sortIcon.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
          }
        }
      }
    },

    /**
     * Add all the rows contained in the event detail.
     * @param {Object} eventDetail Event detail
     * @private
     */
    _executeTableBodyRowsAdd: function (eventDetail) {
      var self = this;
      var eventDetailKeys = eventDetail[this._CONST_KEYS];
      if (eventDetailKeys && eventDetailKeys.size > 0) {
        this._queueTask(function () {
          // This function will try to find the row index from the DOM, so it must
          // be called right before we're ready to update the UI.  If we call it
          // outside of this queued task, the DOM may have changed from other
          // data operations, and the row index can be wrong.
          var rows = self._getRowsFromEventDetailAdd(eventDetail);
          if (rows.length === 0) {
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
              var tableBody = self._getTableDomUtils().getTableBody();
              var tableBodyDocFrag = document.createDocumentFragment();
              rowsCount = rows.length;
              for (i = 0; i < rowsCount; i++) {
                addedTableBodyRows.push(self._addSingleTableBodyRow(rows[i].rowIdx,
                                                                    rows[i].row,
                                                                    tableBodyDocFrag,
                                                                    rows[0].rowIdx));
              }
              if (rows[0].rowIdx === 0) {
                tableBody.insertBefore(tableBodyDocFrag, tableBody.firstChild); // @HTMLUpdateOK
              } else {
                var tableBodyRowBefore = self._getTableDomUtils().getTableBodyRow(rows[0].rowIdx);
                if (tableBodyRowBefore != null) {
                  tableBody.insertBefore(tableBodyDocFrag, tableBodyRowBefore);// @HTMLUpdateOK
                } else {
                  tableBody.appendChild(tableBodyDocFrag, null);// @HTMLUpdateOK
                }
              }
              self._getTableDomUtils().clearCachedDomRowData();
              Components.subtreeAttached(tableBody);
              batchAdd = true;
            }
          }

          if (!batchAdd) {
            rowsCount = rows.length;
            for (i = 0; i < rowsCount; i++) {
              addedTableBodyRows.push(self._addSingleTableBodyRow(rows[i].rowIdx, rows[i].row));
            }
          }
          self._getTableDomUtils().clearCachedDomRowData();
          // row values may have changed so refresh the footer
          self._refreshTableFooter();

          // for high watermark scrolling, we need to reset the domscroller in case there are more rows to fetch
          if (self._isLoadMoreOnScroll() && self._dataProviderAsyncIterator == null) {
            var dataprovider = self._getData();
            if (dataprovider) {
              var options = self._initializeFetchFirstOptions();
              self._dataProviderAsyncIterator =
                dataprovider.fetchFirst(options)[Symbol.asyncIterator]();
              self._registerDomScroller();
            }
          }
          if (self._IsCustomElement()) {
            return self._animateVisibleRows(addedTableBodyRows, rowIdxArray, 'add').then(function () {
              return self._finalizeRowRendering(addedTableBodyRows);
            });
          }
          return self._finalizeRowRendering(addedTableBodyRows);
        });
      }
    },

    /**
     * Change all the rows contained in the event detail.
     * @param {Object} eventDetail Event detail
     * @param {number} startIndex index of first row in the table in the data source
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _executeTableBodyRowsChange: function (eventDetail, startIndex) {
      var self = this;

      this._queueTask(function () {
        // This function will try to find the row index from the DOM, so it must
        // be called right before we're ready to update the UI.  If we call it
        // outside of this queued task, the DOM may have changed from other
        // data operations, and the row index can be wrong.
        var rows = self._getRowsFromEventDetailChange(eventDetail);
        if (rows.length === 0) {
          return undefined;
        }

        var rowsCount = rows.length;
        var updatedTableBodyRows = [];
        var rowIdxArray = [];

        for (var i = 0; i < rowsCount; i++) {
          var tableBodyRow = self._refreshTableBodyRow(rows[i].rowIdx, rows[i].row);
          if (tableBodyRow) {
            updatedTableBodyRows.push(tableBodyRow);
            rowIdxArray.push(rows[i].rowIdx);
          }
        }
        // row values may have changed so refresh the footer
        self._refreshTableFooter();
        if (self._IsCustomElement()) {
          return self._animateVisibleRows(updatedTableBodyRows, rowIdxArray, 'update').then(function () {
            return self._finalizeRowRendering(updatedTableBodyRows);
          });
        }
        return self._finalizeRowRendering(updatedTableBodyRows);
      });
    },

    /**
     * Remove all the rows contained in the event detail.
     * @param {Object} eventDetail event detail
     * @private
     */
    _executeTableBodyRowsRemove: function (eventDetail) {
      var self = this;
      var eventDetailKeys = eventDetail[this._CONST_KEYS];
      if (eventDetailKeys && eventDetailKeys.size > 0) {
        this._queueTask(function () {
          // This function will try to find the row index from the DOM, so it must
          // be called right before we're ready to update the UI.  If we call it
          // outside of this queued task, the DOM may have changed from other
          // data operations, and the row index can be wrong.
          var rows = self._getRowsFromEventDetailRemove(eventDetail);
          if (rows.length === 0) {
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
          var tableBodyRows = self._getTableDomUtils().getTableBodyRows();
          var rowIdx;
          var i;

          if (tableBodyRows != null && tableBodyRows.length > 0) {
            for (i = 0; i < tableBodyRows.length; i++) {
              remainingRowIdxArray.push(i);
            }
            for (i = 0; i < rowsCount; i++) {
              rowIdx = rows[i].rowIdx;
              rowIdxArray.push(rowIdx);
              for (var j = 0; j < remainingRowIdxArray.length; j++) {
                if (remainingRowIdxArray[j] === rowIdx) {
                  tableBodyRow = this._getTableDomUtils().getTableBodyRow(rowIdx);
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

          var tableBody = this._getTableDomUtils().getTableBody();
          var checkFocus = $.contains(tableBody, document.activeElement);
          var resetFocus = false;

          if (removeAll) {
            if (checkFocus) {
              resetFocus = true;
            }

            // Clear out all the existing selection state
            this._clearSelectionState();
          } else {
            for (i = 0; i < rowsCount; i++) {
              rowIdx = rows[i].rowIdx;
              tableBodyRow = this._getTableDomUtils().getTableBodyRow(rowIdx);
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
              self._getTableDomUtils().removeTableBodyRow(_rowIdx);
            }
          }

          function _afterRemoveRows() {
            // row values may have changed so refresh the footer
            self._refreshTableFooter();
            tableBodyRows = self._getTableDomUtils().getTableBodyRows();
            if (tableBodyRows == null || tableBodyRows.length === 0) {
              self._showNoDataMessage();
            }

            // set the currentRow to the next row if needed or clear
            if (currentRowKey != null) {
              if (tableBodyRows == null ||
                  removeAll ||
                  currentRowIndex >= tableBodyRows.length) {
                self._setCurrentRow(null, null, false);
              } else {
                self._setCurrentRow({ rowIndex: currentRowIndex, rowKey: null }, null, false);
              }
            }

            if (resetFocus) {
              self._getTableDomUtils().getTable().focus();
            }
          }

          if (removeAll) {
            self._getTableDomUtils().removeAllTableBodyRows();
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
    },

    /**
     * Return the column definitions
     * @return {Array} array of column metadata Objects.
     * @private
     */
    _getColumnDefs: function () {
      // cache the columns array in this._columnDefArray
      if (!this._columnDefArray) {
        this._columnDefArray = this._getColumnMetadata();
      }
      return this._columnDefArray;
    },

    /**
     * Return the column metadata in sorted oder.
     * @return {Array} array of column metadata Objects.
     * @private
     */
    _getColumnMetadata: function () {
      // get the columns metadata
      var columns = this.options.columns;
      var columnsDefault = this.options.columnsDefault;

      if ((columns.length === 0 ||
           (columns.length === 1 &&
            columns[0].id == null &&
            columns[0].headerText == null &&
            columns[0].field == null)) &&
          (columnsDefault.headerText == null &&
           columnsDefault.field == null)) {
        return [];
      }

      var defaultedColumns = [];
      var i;
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
        if (columnsSortedArray[i][this._FIELD_ID] == null) {
          columnsSortedArray[i][this._FIELD_ID] = this._COLUMN_HEADER_ID_PREFIX + i;
        }
        // for the columns which have sortable = 'auto' check the datasource
        // and enable or disable
        if ((columnsSortedArray[i].sortable == null ||
             columnsSortedArray[i].sortable === this._OPTION_AUTO)
            && sortSupportedData) {
          columnsSortedArray[i].sortable = this._OPTION_ENABLED;
        }
      }
      return columnsSortedArray;
    },

    /**
     * Return the column index for column key.
     * @param {Object} columnKey column key
     * @return {number|null} column index
     * @private
     */
    _getColumnIdxForColumnKey: function (columnKey) {
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
    },

    /**
     * Return all the column indexes for elements with a particular style class
     * @param {string} styleClass  style class
     * @return {Array} Array of column indexes
     * @private
     */
    _getColumnIdxsForElementsWithStyleClass: function (styleClass) {
      var domUtils = this._getTableDomUtils();
      var elements = domUtils.tableQuerySelectorAll(domUtils.getTable(), styleClass);
      var columnIdxs = [];
      if (elements && elements.length > 0) {
        var elementsCount = elements.length;

        for (var i = 0; i < elementsCount; i++) {
          var columnIdx = domUtils.getElementColumnIdx(elements[i]);

          var alreadyAdded = false;
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
    },

    /**
     * Returns the index for the first visible column in the specified direction.
     * @param {number} currentIndex the column index to start the search from
     * @param {boolean} isForward whether to search in the forward direction
     * @private
     */
    _getFirstVisibleColumnIndex: function (currentIndex, isForward) {
      var columns = this._getColumnDefs();
      var nextIndex = currentIndex;

      var columnHeader;
      if (isForward) {
        while (nextIndex < columns.length) {
          columnHeader = this._getTableDomUtils().getTableHeaderColumn(nextIndex);
          if (columnHeader && columnHeader.clientWidth > 0) {
            return nextIndex;
          }
          nextIndex += 1;
        }
      } else {
        while (nextIndex > -1) {
          columnHeader = this._getTableDomUtils().getTableHeaderColumn(nextIndex);
          if (columnHeader && columnHeader.clientWidth > 0) {
            return nextIndex;
          }
          nextIndex -= 1;
        }
      }
      return null;
    },

    /**
     * Returns the index for the next visible column in the specified direction
     * @param {number} currentIndex the column index to start the search from
     * @param {type} isForward whether to search in the forward direction
     * @private
     */
    _getNextVisibleColumnIndex: function (currentIndex, isForward) {
      var startIndex;
      if (isForward) {
        startIndex = currentIndex + 1;
      } else {
        startIndex = currentIndex - 1;
      }
      var firstVisibleIndex = this._getFirstVisibleColumnIndex(startIndex, isForward);
      return (firstVisibleIndex !== null) ? firstVisibleIndex : currentIndex;
    },

    /**
     * Return the column key for column index.
     * @param {number} columnIdx column index
     * @return {Object} column key
     * @private
     */
    _getColumnKeyForColumnIdx: function (columnIdx) {
      var columns = this._getColumnDefs();

      if (columns != null && columnIdx < columns.length) {
        return columns[columnIdx][this._FIELD_ID];
      }
      return null;
    },

    /**
     * Return the column renderer
     * @param {number} columnIdx  column index
     * @param {String} type  renderer type
     * @return {Object} renderer
     * @private
     */
    _getColumnRenderer: function (columnIdx, type) {
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
    },

    /**
     * Get the current row.
     * @return {Object|null} current row object or null if none.
     * @throws {Error}
     * @private
     */
    _getCurrentRow: function () {
      var dataprovider = this._getData();
      // if no data then bail
      if (!dataprovider) {
        return null;
      }
      return this._currentRow;
    },

    /**
     * Return the datasource object defined for this table
     * @return {Object} Datasource object.
     * @throws {Error}
     * @private
     */
    _getData: function () {
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
          var errSummary = this._LOGGER_MSG._ERR_DATA_INVALID_TYPE_SUMMARY;
          var errDetail = this._LOGGER_MSG._ERR_DATA_INVALID_TYPE_DETAIL;
          throw new Error(errSummary + '\n' + errDetail);
        }
        this._dataOption = this.options.data;
        this._registerDataSourceEventListeners();
      }
      return this._data;
    },

    /**
     * Get the focused column header index
     * @return {number|null} the column index
     * @private
     */
    _getFocusedHeaderColumnIdx: function () {
      // focused column headers have the focused style class. There should only be one focused header
      return this._getColumnIdxsForElementsWithStyleClass(
        '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS +
          '.' + oj.TableDomUtils.MARKER_STYLE_CLASSES._FOCUS_HIGHLIGHT + ',' +
          '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS +
          '.' + oj.TableDomUtils.MARKER_STYLE_CLASSES._FOCUS)[0];
    },

    /**
     * Get the focused row index
     * @return {number|null} the row index
     * @private
     */
    _getFocusedRowIdx: function () {
      // focused rows have cells with focused style class. There should only be one focused row
      return this._getRowIdxsForElementsWithStyleClass(
        '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_CLASS +
          '.' + oj.TableDomUtils.MARKER_STYLE_CLASSES._FOCUS_HIGHLIGHT + ',' +
          '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_CLASS +
          '.' + oj.TableDomUtils.MARKER_STYLE_CLASSES._FOCUS)[0];
    },

    /**
     * Return whether the column header at the index is selected
     * @param {number} columnIdx  column index
     * @return {boolean} whether it's selected
     * @private
     */
    _getHeaderColumnSelection: function (columnIdx) {
      var headerColumn = this._getTableDomUtils().getTableHeaderColumn(columnIdx);
      return headerColumn.classList.contains(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
    },

    /**
     * Return the column selection mode
     * @return {string|null} single, multiple, none, or null
     * @private
     */
    _getColumnSelectionMode: function () {
      var columnSelectionMode = this.options.selectionMode == null ?
          null : this.options.selectionMode[this._CONST_COLUMN];
      return columnSelectionMode;
    },

    /**
     * Returns whether or not column selection is enabled
     * @return {boolean} whether column selection is enabled
     * @private
     */
    _isColumnSelectionEnabled: function () {
      var colSelectionMode = this._getColumnSelectionMode();
      return (colSelectionMode === this._OPTION_SELECTION_MODES._SINGLE ||
              colSelectionMode === this._OPTION_SELECTION_MODES._MULTIPLE);
    },

    /**
     * Return the currently pressed keyboard keys
     * @return {Array} Array of keyCodes
     * @private
     */
    _getKeyboardKeys: function () {
      if (!this._keyboardKeys) {
        this._keyboardKeys = [];
      }

      // reverse the array since we want the keybaord keys to be a LIFO stack
      return this._keyboardKeys.reverse();
    },

    /**
     * Return an array with row and row indices relative to the table row indices
     * @param {Object} resultObject Object containing data array, key array, and index array
     * @param {number} startIndex start index
     * @return {Array} Array of rows and row index
     * @private
     */
    _getRowIdxRowArray: function (resultObject, startIndex) {
      var rowIdxRowArray = [];
      if (resultObject != null) {
        var indexesCount = resultObject[this._CONST_INDEXES].length;
        for (var i = 0; i < indexesCount; i++) {
          rowIdxRowArray.push({
            row: {
              data: resultObject[this._CONST_DATA][i],
              metadata: resultObject[this._CONST_METADATA] ?
                resultObject[this._CONST_METADATA][i] : null,
              key: resultObject[this._CONST_KEYS][i],
              index: resultObject[this._CONST_INDEXES][i]
            },
            rowIdx: startIndex + i });
        }
      }

      return rowIdxRowArray;
    },

    /**
     * Return the row index for row key. Only loop through displayed rows.
     * @param {Object} rowKey row key
     * @return {number|null} row index
     * @private
     */
    _getRowIdxForRowKey: function (rowKey) {
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();

      if (tableBodyRows != null && tableBodyRows.length > 0) {
        var tableBodyRowsCount = tableBodyRows.length;
        for (var i = 0; i < tableBodyRowsCount; i++) {
          if (oj.KeyUtils.equals($(tableBodyRows[i]).data('rowKey'), rowKey)) {
            return i;
          }
        }
      }

      return null;
    },

    /**
     * Return the datasource's row index for the row key.
     * @param {Object} rowKey row key
     * @return {number|null} row index
     * @private
     */
    _getDataSourceRowIndexForRowKey: function (rowKey) {
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();

      if (tableBodyRows != null && tableBodyRows.length > 0) {
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
    },

    /**
     * Return the editable row index if there is one
     * @return {number|null} row index
     * @private
     */
    _getEditableRowIdx: function () {
      var rowIdx = null;

      if (this._getEditableRowKey() != null) {
        rowIdx = this._getRowIdxForRowKey(this._getEditableRowKey());

        if (rowIdx !== null) {
          return rowIdx;
        }
      }
      return this._editableRowIdx;
    },

    /**
     * Return the editable row key if there is one
     * @return {Object|null} row key
     * @private
     */
    _getEditableRowKey: function () {
      return this._editableRowKey;
    },

    /**
     *
     * Get the target element
     * @param {Object} event DOM touch event
     * @return {Element} element  DOM element
     * @private
     */
    _getEventTargetElement: function (event) {
      return event.type.indexOf('touch') === 0 ?
        this._getTouchEventTargetElement(event) : event.currentTarget;
    },

    /**
     * Return all the row indexes for elements with a particular style class
     * @param {string} styleClass  style class
     * @return {Array} Array of row indexes
     * @private
     */
    _getRowIdxsForElementsWithStyleClass: function (styleClass) {
      var domUtils = this._getTableDomUtils();
      var elements = domUtils.tableQuerySelectorAll(domUtils.getTable(), styleClass);
      var rowIdxs = [];
      if (elements && elements.length > 0) {
        var elementsCount = elements.length;
        for (var i = 0; i < elementsCount; i++) {
          var rowIdx = domUtils.getElementRowIdx(elements[i]);

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
    },

    /**
     * Return the row key for datasource's row index.
     * @param {number} rowIndex row index
     * @return {any} row key
     * @private
     */
    _getRowKeyForDataSourceRowIndex: function (rowIndex) {
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();

      if (tableBodyRows != null && tableBodyRows.length > 0) {
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
    },

    /**
     * Return the row key for row index.
     * @param {number} rowIdx row index
     * @return {any|null} row key
     * @private
     */
    _getRowKeyForRowIdx: function (rowIdx) {
      var tableBodyRow = this._getTableDomUtils().getTableBodyRow(rowIdx);

      if (tableBodyRow != null) {
        return $(tableBodyRow).data('rowKey');
      }

      return null;
    },

    /**
     * Returns the row key for the specified row or index.
     * @param {Element=} tableBodyRow The tr element of the row.
     * @param {number=} index The index of the row.
     * @private
     */
    _getRowKey: function (tableBodyRow, index) {
      if (tableBodyRow == null) {
        // eslint-disable-next-line no-param-reassign
        tableBodyRow = this._getTableDomUtils().getTableBodyRow(index);
      }
      if (tableBodyRow != null) {
        return $(tableBodyRow).data('rowKey');
      }
      return null;
    },

    /**
     * Return the row renderer
     * @return {Object} renderer
     * @private
     */
    _getRowRenderer: function () {
      return this._WrapCustomElementRenderer(this.options.rowRenderer);
    },

    /**
     * Return whether the row is selected
     * @param {number} rowIdx  row index
     * @return {boolean} whether the row is selected
     * @private
     */
    _getRowSelection: function (rowIdx) {
      return this._getTableDomUtils().getTableBodyRow(rowIdx).classList.contains(
        oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
    },

    /**
     * Return the row selection mode
     * @return {string|null} single, multiple, none, or null
     * @private
     */
    _getRowSelectionMode: function () {
      var rowSelectionMode = this.options.selectionMode == null ?
          null : this.options.selectionMode[this._CONST_ROW];
      return rowSelectionMode;
    },

    /**
     * Returns whether or not row selection is enabled
     * @return {boolean} whether row selection is enabled
     * @private
     */
    _isRowSelectionEnabled: function () {
      var rowSelectionMode = this._getRowSelectionMode();
      return (rowSelectionMode === this._OPTION_SELECTION_MODES._SINGLE ||
              rowSelectionMode === this._OPTION_SELECTION_MODES._MULTIPLE);
    },

    /**
     * Return the selected column header indexes
     * @return {Array} array of column header indexes
     * @private
     */
    _getSelectedHeaderColumnIdxs: function () {
      // selected column headers have the selected css class
      return this._getColumnIdxsForElementsWithStyleClass(
        '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS +
          '.' + oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
    },

    /**
     * Return the selected row indexes
     * @return {Array} array of row indexes
     * @private
     */
    _getSelectedRowIdxs: function () {
      // selected rows have the selected css class
      return this._getRowIdxsForElementsWithStyleClass(
        '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_CLASS +
          '.' + oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
    },

    /**
     * Returns the inline template element inside an oj-table slot
     * @param {string} slotName slot name
     * @return {Element|null} the inline template element
     * @private
     */
    _getSlotTemplate: function (slotName) {
      if (this._IsCustomElement() && slotName) {
        var slotMap = oj.BaseCustomElementBridge.getSlotMap(this._getRootElement());
        var slot = slotMap[slotName];
        if (slot && slot.length > 0 && slot[0].tagName.toLowerCase() === 'template') {
          return slot[0];
        }
      }
      return null;
    },

    /**
     * Returns false if the 'cellTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
     * @return {boolean} false if the 'cellTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
     * @private
     */
    _isDefaultCellTemplateSlotValid: function () {
      return this._isDefaultTemplateSlotValid('cellTemplate');
    },

    /**
     * Returns false if the 'headerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
     * @return {boolean} false if the 'headerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
     * @private
     */
    _isDefaultHeaderTemplateSlotValid: function () {
      return this._isDefaultTemplateSlotValid('headerTemplate');
    },

    /**
     * Returns false if the 'footerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
     * @return {boolean} false if the 'footerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
     * @private
     */
    _isDefaultFooterTemplateSlotValid: function () {
      return this._isDefaultTemplateSlotValid('footerTemplate');
    },

    /**
     * Returns false if the supplied slot name is specified by a column's template, headerTemplate, or footerTemplate.
     * @param {String} defaultSlotName the default slot name to validate
     * @return {boolean} false if the 'footerTemplate' slot name is specified by a column's template, headerTemplate, or footerTemplate.
     * @private
     */
    _isDefaultTemplateSlotValid: function (defaultSlotName) {
      var columns = this._getColumnDefs();
      var columnsCount = columns.length;

      for (var i = 0; i < columnsCount; i++) {
        var cellTemplateName = columns[i][this._CELL_TEMPLATE];
        var headerTemplateName = columns[i][this._HEADER_TEMPLATE];
        var footerTemplateName = columns[i][this._FOOTER_TEMPLATE];
        if (defaultSlotName === cellTemplateName ||
            defaultSlotName === headerTemplateName ||
            defaultSlotName === footerTemplateName) {
          return false;
        }
      }
      return true;
    },

    /**
     * Return the currnetly sorted column index
     * @return {number|null} column index
     * @private
     */
    _getSortedTableHeaderColumnIdx: function () {
      var tableHeaderColumns = this._getTableDomUtils().getTableHeaderColumns();
      var tableHeaderColumnsCount = tableHeaderColumns ? tableHeaderColumns.length : 0;

      for (var i = 0; i < tableHeaderColumnsCount; i++) {
        // sorted column will have the sorted data attr
        var sorted = $(tableHeaderColumns[i]).data('sorted');

        if (sorted != null) {
          return i;
        }
      }
      return null;
    },

    /**
     * Get tabbable elements within the element
     * @param {Element} element  DOM element
     * @param {boolean=} ignoreHidden ignore accessibility hidden elements
     * @return {Array|null} Array of DOM elements
     * @private
     */
    _getTabbableElements: function (element, ignoreHidden) {
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
    },

    /**
     * Return table animation utils instance
     * @return {Object} instance of table DOM utils
     * @private
     */
    _getTableAnimationUtils: function () {
      if (!this._tableAnimationUtils) {
        this._tableAnimationUtils = new oj.TableAnimationUtils(this);
      }
      return this._tableAnimationUtils;
    },

    /**
     * Return table DnD utils instance
     * @return {Object} instance of table DnD utils
     * @private
     */
    _getTableDndContext: function () {
      if (!this._tableDndContext) {
        this._tableDndContext = new oj.TableDndContext(this);
      }
      return this._tableDndContext;
    },

    /**
     * Return table DOM utils instance
     * @return {Object} instance of table DOM utils
     * @private
     */
    _getTableDomUtils: function () {
      if (!this._tableDomUtils) {
        this._tableDomUtils = new oj.TableDomUtils(this);
      }
      return this._tableDomUtils;
    },

    /**
     * Return table Resize utils instance
     * @return {Object} instance of table Resize utils
     * @private
     */
    _getTableResizeUtils: function () {
      if (!this._tableResizeUtils) {
        this._tableResizeUtils = new oj.TableResizeUtils(this);
      }
      return this._tableResizeUtils;
    },

    /**
     * Return the template engine or null
     * @return {Object|null} template engine
     * @private
     */
    _getTemplateEngine: function () {
      return this._templateEngine;
    },

    /**
     *
     * Get the target element at the touch event
     * @param {Object} event DOM touch event
     * @return {Element} element  DOM element
     * @private
     */
    _getTouchEventTargetElement: function (event) {
      var eventLocation = event.originalEvent.changedTouches[0];
      return document.elementFromPoint(eventLocation.clientX, eventLocation.clientY);
    },

    /**
     * Return the visible row indexes
     * @return {Array} array of row indexes
     * @private
     */
    _getVisibleRowIdxs: function () {
      // return the row indexes of all rows in the viewport
      var visibleRowIdxArray = [];
      var tableBody = this._getTableDomUtils().getTableBody();
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();

      if (tableBodyRows != null && tableBodyRows.length > 0) {
        var windowHeight = $(window).height();
        var tableBodyRect = tableBody.getBoundingClientRect();
        var i;

        // check if not visible at all
        if (tableBodyRect.top > windowHeight) {
          return visibleRowIdxArray;
        }
        // if the table is fully visible or partially visible, work out which
        // rows are visible

        // find out where the start of the row is
        var tableElemX =
            tableBodyRect.left >= 0 ? tableBodyRect.left + 1 : tableBodyRect.right - 1;

        // check the first visible row
        var viewportTop = tableBodyRect.top >= 0 ? tableBodyRect.top : 0;
        var tableElemTop = document.elementFromPoint(tableElemX, viewportTop);
        var rowIdx = null;
        if (tableElemTop != null) {
          rowIdx = this._getTableDomUtils().getElementRowIdx(tableElemTop);
        }
        var startRowIdx = rowIdx != null ? rowIdx : 0;
        var lastRowIdx;
        var tableElemBottom;

        if (tableBodyRect.bottom > windowHeight) {
          // the last visible row is at the bottom of the viewport
          tableElemBottom = document.elementFromPoint(tableElemX, windowHeight - 1);
          rowIdx = null;
          if (tableElemBottom != null) {
            lastRowIdx = this._getTableDomUtils().getElementRowIdx(tableElemBottom);
          }
        } else {
          var borderBottomWidth =
            parseInt(window.getComputedStyle(tableBody).borderBottomWidth, 10);
          var viewportBottom =
            tableBodyRect.bottom >= 0 ? tableBodyRect.bottom - borderBottomWidth - 1 : 0;
          tableElemBottom = document.elementFromPoint(tableElemX, viewportBottom);
          if (tableElemBottom != null) {
            lastRowIdx = this._getTableDomUtils().getElementRowIdx(tableElemBottom);
          }
        }
        if (lastRowIdx == null) {
          lastRowIdx = tableBodyRows.length - 1;
        }

        for (i = startRowIdx; i <= lastRowIdx; i++) {
          visibleRowIdxArray.push(i);
        }
      }
      return visibleRowIdxArray;
    },

    /**
     * Select range of rows or columns from start to end index
     * @param {number} firstSelctedIndex the first selected index
     * @param {number} lastSelectedIndex the last selected index
     * @param {boolean} isRow whether this is a range of rows
     * @private
     */
    _selectRange: function (firstSelectedIndex, lastSelectedIndex, isRow) {
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
    },

    /**
     * Handle an ojselect event on a menu item, if sort call the handler on the core.
     * If resize prompt the user with a popup
     * @private
     */
    _handleContextMenuSelect: function (event, ui) {
      var item;
      if (ui) {
        item = ui.item;
      } else {
        item = $(event.target);
      }
      var menuItemCommand = item.attr('data-oj-command');
      var domUtils = this._getTableDomUtils();
      var headerColumn = domUtils.getFirstAncestor(this._contextMenuEvent.target,
        '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS, true);
      headerColumn = headerColumn == null ? this._contextMenuEventHeaderColumn : headerColumn;
      var tableBodyCell = domUtils.getFirstAncestor(this._contextMenuEvent.target,
        '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
      var columnIdx = null;

      if (headerColumn != null) {
        columnIdx = domUtils.getElementColumnIdx(headerColumn);
      }
      if (tableBodyCell != null) {
        columnIdx = domUtils.getElementColumnIdx(tableBodyCell);
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
        this._getTableDomUtils().removeTableBodyRowTouchSelectionAffordance();
        // update to disable command
        item.attr('data-oj-command', 'oj-table-disableNonContiguousSelection');
        item.children().first()
          .text(this.getTranslatedString('labelDisableNonContiguousSelection')); // @HTMLUpdateOK
      } else if (menuItemCommand === 'oj-table-disableNonContiguousSelection') {
        this._nonContiguousSelection = false;
        // update to enable command
        item.attr('data-oj-command', 'oj-table-enableNonContiguousSelection');
        item.children().first()
          .text(this.getTranslatedString('labelEnableNonContiguousSelection')); // @HTMLUpdateOK
      } else if (menuItemCommand === 'oj-table-resize') {
        var popup = domUtils.getContextMenuResizePopup();
        popup.setAttribute('data-oj-columnIdx', columnIdx);
        var target = headerColumn || tableBodyCell;
        var columnWidth = target.getBoundingClientRect().width;

        // getBoundingClientRect returns the border-box width, while ojtable interprets columns[].width
        // as padding + content width, so we have to substract the border width from the ClientRect.
        var style = window.getComputedStyle(target);
        columnWidth = columnWidth - parseFloat(style['border-left-width']) -
          parseFloat(style['border-right-width']);

        var spinner = document.getElementById(
          domUtils.getTableId() + '_resize_popup_spinner');
        $(spinner).ojInputNumber('option', 'value', Math.round(columnWidth));

        var launcher;
        if (headerColumn != null) {
          launcher = headerColumn;
        } else if (tableBodyCell != null) {
          launcher = tableBodyCell;
        } else {
          launcher = this.getTable();
        }
        $(popup).ojPopup('open', launcher);
      }
    },

    /**
     * Callback from the resize popup box
     * @param {Event} event the event that triggered the popup button press
     * @private
     */
    _handleContextMenuResizePopup: function () {
      var domUtils = this._getTableDomUtils();
      var spinner = document.getElementById(
        domUtils.getTableId() + '_resize_popup_spinner');
      var widthValue = $(spinner).ojInputNumber('option', 'value');
      var popup = domUtils.getContextMenuResizePopup();
      var columnIdx = parseInt(popup.getAttribute('data-oj-columnIdx'), 10);
      $(popup).ojPopup('close');
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
        setTimeout(function () {
          domUtils.getTable().focus();
        }, 0);
      });
    },

    /**
     * Callback handler for fetch start in the datasource.
     * @param {Object} event
     * @private
     */
    _handleDataFetchStart: function () {
      this._setDataWaitingState();
    },

    /**
     * Callback handler for refresh in the datasource. Refresh entire
     * table body DOM and refresh the table dimensions.
     * @param {Object} event
     * @private
     */
    _handleDataRefresh: function () {
      try {
        if (this._dataFetching) {
          return;
        }
        var self = this;
        this._queueTask(function () {
          self._beforeDataRefresh();

          var fetchPromise = self._invokeDataFetchRows();
          self = null;
          return fetchPromise;
        });
      } catch (e) {
        Logger.error(e);
      } finally {
        this._clearDataWaitingState();
      }
    },

    /**
     * Callback handler for rows mutations.
     * @param {Object} event
     * @private
     */
    _handleDataRowMutate: function (event) {
      if (this._dataFetching) {
        return;
      }
      if (event.detail.remove != null) {
        this._handleDataRowRemove(event.detail.remove);
      }
      if (event.detail.add != null) {
        this._handleDataRowAdd(event.detail.add);
      }
      if (event.detail.update != null) {
        this._handleDataRowChange(event.detail.update);
      }
    },

    /**
     * Return row info from add event detail
     * @param {Object} eventDetail event detail
     * @return {Array} Array of row info
     * @private
     */
    _getRowsFromEventDetailAdd: function (eventDetail) {
      var dataprovider = this._getData();
      var eventData = eventDetail[this._CONST_DATA];
      var eventMetadata = eventDetail[this._CONST_METADATA];
      var eventIndexes = eventDetail[this._CONST_INDEXES];
      var eventKeys = [];
      eventDetail[this._CONST_KEYS].forEach(function (key) {
        eventKeys.push(key);
      });
      var eventAfterKeys = [];
      // afterKeys is deprecated, but continue to support it until we can remove it.
      // forEach can be called on both array and set.
      var afterKeyIter = eventDetail[this._CONST_ADDBEFOREKEYS] ?
        eventDetail[this._CONST_ADDBEFOREKEYS] : eventDetail[this._CONST_AFTERKEYS];
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

      var metadataSource = null;

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
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
      var rowCount = tableBodyRows != null ? tableBodyRows.length : 0;
      var i;
      var eventDataCount = eventData.length;

      // only used for high watermark scrolling
      var fetchSize = this.options.scrollPolicyOptions.fetchSize;
      var maxRowIndex = Math.max(fetchSize, rowCount);

      // if specified, afterKeys takes precendence over indexes
      for (i = 0; i < eventDataCount; i++) {
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
          // for high watermark scrolling, we only care about rows in our current viewport
          if (this._isLoadMoreOnScroll()) {
            if (rowIdx > maxRowIndex) {
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
    },

    /**
     * Callback handler for rows added into the datasource. Add a new tr and refresh the DOM
     * at the row index and refresh the table dimensions to accomodate the new
     * row
     * @param {Object} eventDetail event detail
     * @private
     */
    _handleDataRowAdd: function (eventDetail) {
      try {
        this._executeTableBodyRowsAdd(eventDetail);
      } catch (e) {
        Logger.error(e);
      } finally {
        this._clearDataWaitingState();
      }
    },

    /**
     * Return row info from change event detail
     * @param {Object} eventDetail event detail
     * @return {Array} Array of row info
     * @private
     */
    _getRowsFromEventDetailChange: function (eventDetail) {
      var eventData = eventDetail[this._CONST_DATA];
      var eventMetadata = eventDetail[this._CONST_METADATA];
      var eventKeys = [];
      eventDetail[this._CONST_KEYS].forEach(function (key) {
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
    },

    /**
     * Callback handler for row change in the datasource. Refresh the changed
     * row.
     * @param {Object} eventDetail event detail
     * @private
     */
    _handleDataRowChange: function (eventDetail) {
      try {
        this._executeTableBodyRowsChange(eventDetail);
      } catch (e) {
        Logger.error(e);
      } finally {
        this._clearDataWaitingState();
      }
    },

    /**
     * Return row info from remove event detail
     * @param {Object} eventDetail event detail
     * @return {Array} Array of row info
     * @private
     */
    _getRowsFromEventDetailRemove: function (eventDetail) {
      var self = this;
      var rowArray = [];
      eventDetail[this._CONST_KEYS].forEach(function (key) {
        var rowIdx = self._getRowIdxForRowKey(key);
        if (rowIdx !== undefined) {
          var row = { key: key, index: rowIdx };
          rowArray.push({ row: row, rowIdx: rowIdx });
        }
      });

      return rowArray;
    },

    /**
     * Callback handler for row removed in the datasource. Remove the row DOM from the
     * table body by searching for the matching rowKey. New rows will have null rowKey.
     * After removing the row, refresh all the remaining row indexes since
     * they will have shifted. Lastly, refresh the table dimensions
     * @param {Object} eventDetail event detail
     * @private
     */
    _handleDataRowRemove: function (eventDetail) {
      try {
        this._executeTableBodyRowsRemove(eventDetail);
      } catch (e) {
        Logger.error(e);
      } finally {
        this._clearDataWaitingState();
      }
    },

    /**
     * Handler for End keydown.
     * @param {Object} event
     * @private
     */
    _handleKeydownEnd: function (event) {
      if (this._isTableActionableMode()) {
        // ignore in actionable mode
        return;
      }

      // pressing End focuses on last column
      var focusedColumnIdx = this._getFocusedHeaderColumnIdx();

      if (focusedColumnIdx != null &&
          focusedColumnIdx !== this._getColumnDefs().length - 1) {
        var visibleIndex =
          this._getFirstVisibleColumnIndex(this._getColumnDefs().length - 1, false);
        this._setHeaderColumnFocus(visibleIndex, true, false);
      } else if (!this._hasEditableRow()) {
        var focusedRowIdx = this._getFocusedRowIdx();
        var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
        var rowCount = tableBodyRows != null ? tableBodyRows.length : 0;

        if (focusedRowIdx != null && focusedRowIdx !== rowCount - 1 && rowCount > 0) {
          this._setRowFocus(rowCount - 1, true, true, null, event);
        }
      }
    },

    /**
     * Handler for Enter keydown.
     * @param {Object} event
     * @private
     */
    _handleKeydownEnter: function (event) {
      if (this._isTableActionableMode()) {
        // ignore in actionable mode
        return;
      }

      // pressing enter does sort on the focused column header
      var focusedColumnIdx = this._getFocusedHeaderColumnIdx();

      if (focusedColumnIdx != null &&
          this._getColumnDefs()[focusedColumnIdx].sortable === this._OPTION_ENABLED) {
        var tableHeaderColumn = this._getTableDomUtils().getTableHeaderColumn(focusedColumnIdx);
        var sorted = $(tableHeaderColumn).data('sorted');
        // if not already sorted then sort ascending. If already sorted
        // ascending then do descending sort and vice versa.
        if (sorted == null || sorted === this._COLUMN_SORT_ORDER._DESCENDING) {
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
            var columnIdx = this._getTableDomUtils().getElementColumnIdx(event.target);

            if (!event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT]) {
              this._setNextRowEditable(columnIdx, event);
            } else {
              this._setPreviousRowEditable(columnIdx, event);
            }
          } else {
            this._setTableActionableMode(true);
          }
        }
      }
    },

    /**
     * Handler for Esc keydown.
     * @param {Object} event
     * @private
     */
    _handleKeydownEsc: function (event) {
      // pressing Esc always returns focus back to the table.
      if (this._isTableEditMode() && this._hasEditableRow()) {
        event.preventDefault();
        event.stopPropagation();
        this._setTableEditable(false, true, 0, true, event);
        this._getTableDomUtils().getTable().focus();
      } else if (this._isTableActionableMode()) {
        event.preventDefault();
        event.stopPropagation();
        this._setTableActionableMode(false);
        this._getTableDomUtils().getTable().focus();
      }
      this._getTableResizeUtils().clearTableHeaderColumnsResize();
    },

    /**
     * Handler for F2 keydown.
     * @param {Object} event
     * @private
     */
    _handleKeydownF2: function (event) {
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
    },

    /**
     * Handler for Home keydown.
     * @param {Object} event
     * @private
     */
    _handleKeydownHome: function (event) {
      if (this._isTableActionableMode()) {
        // ignore in actionable mode
        return;
      }
      // pressing Home focuses on first column
      var focusedColumnIdx = this._getFocusedHeaderColumnIdx();

      if (focusedColumnIdx != null && focusedColumnIdx !== 0) {
        var visibleIndex = this._getFirstVisibleColumnIndex(0, true);
        this._setHeaderColumnFocus(visibleIndex, true, false);
      } else if (!this._hasEditableRow()) {
        var focusedRowIdx = this._getFocusedRowIdx();

        if (focusedRowIdx != null && focusedRowIdx !== 0) {
          this._setRowFocus(0, true, true, null, event);
        }
      }
    },

    /**
     * Handler for Left/Right keydown.
     * @param {Object} event
     * @private
     */
    _handleKeydownLeftRight: function (event, isExtend) {
      if (this._isTableActionableMode()) {
        // ignore in actionable mode
        return;
      }

      // pressing left/right navigates the column headers
      var focusedHeaderIndex = this._getFocusedHeaderColumnIdx();

      if (focusedHeaderIndex != null) {
        var isRTL = this._GetReadingDirection() === 'rtl';
        var isLeft = this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_LEFT);
        var focusNextHeader = (isRTL && isLeft) || (!isRTL && !isLeft);

        var current = (!isExtend || this._isNavigate) ?
          focusedHeaderIndex : this._lastSelectedHeaderIdx;
        if (current == null) {
          current = focusedHeaderIndex;
        }

        var target = this._getNextVisibleColumnIndex(current, focusNextHeader);

        if (isExtend) {
          this._isNavigate = false;

          // select all columns between focusedHeaderIndex and target
          this._selectRange(focusedHeaderIndex, target, false);
          this._scrollColumnIntoViewport(target);
        } else {
          this._isNavigate = true;
          if (target !== focusedHeaderIndex) {
            this._setHeaderColumnFocus(target, true, false);
          }
        }
      }
    },

    /**
     * Handler for Spacebar keydown.
     * @param {Object} event
     * @private
     */
    _handleKeydownSpacebar: function (event) {
      if (this._isTableActionableMode() || this._isTableEditMode()) {
        // ignore in actionable and edit mode
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
      } else if (!this._hasEditableRow()) {
        var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
        if (focusedHeaderColumnIdx != null) {
          this._handleSelectionGesture(focusedHeaderColumnIdx, false, true);
        }
      }
    },

    /**
     * Handler for Tab keydown.
     * @param {Object} event
     * @private
     */
    _handleKeydownTab: function (event) {
      // if Tab is pressed while a row has focus and we are in actionable/editable
      // mode then want to Tab within that row until Esc or F2 is pressed
      var tabHandled = false;
      var focusedRowIdx = this._getFocusedRowIdx();
      var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
      var tabbableElementsInFocusedElement;
      var focusedElement;

      if ((focusedRowIdx != null ||
           focusedHeaderColumnIdx != null) &&
          (this._isTableActionableMode() ||
           this._hasEditableRow())) {
        var currentFocusElement = document.activeElement;
        var tableBody = this._getTableDomUtils().getTableBody();
        var tableHeader = this._getTableDomUtils().getTableHeader();

        if (this._getEditableRowIdx() === focusedRowIdx) {
          // If we are on an editable row and there are no more editable
          // elements to focus to then go to the next row
          var tableBodyRow = this._getTableDomUtils().getTableBodyRow(focusedRowIdx);
          var tabbableElementsInRow = this._getTabbableElements(tableBodyRow);
          var tabbableElementsInRowCount =
              tabbableElementsInRow != null ? tabbableElementsInRow.length : 0;
          var rowElementTabIndex = $(tabbableElementsInRow).index(currentFocusElement);

          if (rowElementTabIndex === tabbableElementsInRowCount - 1 &&
              !event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT]) {
            // last tabbable element in row so go to the next row
            this._setNextRowEditable(0, event);
            event.preventDefault();
            event.stopPropagation();
            return;
          } else if (rowElementTabIndex === 0
                     && event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT]) {
            // first tabbable element in row and Shift+Tab so go to the previous row
            var tableHeaderColumns = this._getTableDomUtils().getTableHeaderColumns();
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
        } else if ($.contains(tableBody, currentFocusElement) ||
                   $.contains(tableHeader, currentFocusElement)) {
          focusedElement = null;
          var i;

          if ($.contains(tableBody, currentFocusElement)) {
            focusedElement = this._getTableDomUtils().getTableBodyRow(focusedRowIdx);
          } else if ($.contains(tableHeader, currentFocusElement)) {
            focusedElement = this._getTableDomUtils().getTableHeader();
          }
          tabbableElementsInFocusedElement = this._getTabbableElements(focusedElement);

          if (tabbableElementsInFocusedElement.length > 0) {
            // If only one tabbable element then stay on it
            if (tabbableElementsInFocusedElement.length > 1) {
              if (!event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT]) {
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
        }

        if ((focusedRowIdx != null && !this._hasEditableRow()) ||
            focusedHeaderColumnIdx != null) {
          if (!event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT]) {
            tabHandled = true;
            focusedElement = null;
            if (focusedRowIdx != null) {
              focusedElement = this._getTableDomUtils().getTableBodyRow(focusedRowIdx);
            } else if (focusedHeaderColumnIdx != null) {
              focusedElement =
                this._getTableDomUtils().getTableHeaderColumn(focusedHeaderColumnIdx);
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
        var table = this._getTableDomUtils().getTable();
        var tabbableElementsInTable = this._getTabbableElements(table, true);
        var tabbableElementsInTableCount =
          tabbableElementsInTable != null ? tabbableElementsInTable.length : 0;

        // Table should not set focus to elements outside of itself because
        // ancestor such as modal dialog may want to confine the focus.  It
        // should just set focus to itself in backward tabbing or to its last
        // tabbable descendant in forward tabbing.  Then allow the ancestors
        // to handle the event and determine the next tabstop.
        var temporaryFocus = table;

        if (!event[this._KEYBOARD_CODES._KEYBOARD_MODIFIER_SHIFT]) {
          // If we are tabbing forward and the table contains tabbable
          // elements, focus on the last tabbable element.
          if (tabbableElementsInTableCount > 0) {
            if (!this._getTableDomUtils()._isFF()) {
              temporaryFocus = tabbableElementsInTable[tabbableElementsInTableCount - 1];
            } else {
              // workaround for FF. In FF, the tbody is focusable even though it has
              // tabindex -1. So we have to create a temporary focusable element
              // as the last element in the table container and focus on that one.
              temporaryFocus = document.createElement(oj.TableDomUtils.DOM_ELEMENT._A);
              temporaryFocus.setAttribute(oj.TableDomUtils.DOM_ATTR._TABINDEX, '0');
              temporaryFocus.setAttribute(oj.TableDomUtils.DOM_ATTR._HREF, '#');
              temporaryFocus.classList.add(oj.TableDomUtils.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
              table.insertAdjacentElement('afterend', temporaryFocus);
              this._temporaryFocusForFF = temporaryFocus;
            }
          }
        }

        // Need to set this variable because the focus() call will
        // trigger a focusin which we do not want to handle.
        this._temporaryTableChildElementFocus = true;
        temporaryFocus.focus();
        var self = this;
        setTimeout(function () {
          self._temporaryTableChildElementFocus = false;
          if (self._temporaryFocusForFF) {
            $(self._temporaryFocusForFF).remove();
            self._temporaryFocusForFF = null;
          }
        }, 0);

        return;
      }
      // we need to remove Tab on keydown because we may not
      // get a keyup for it if focus moves
      // outside of table
      this._removeKeyboardKey(event.keyCode);
    },

    /**
     * Handler for Up/Down keydown.
     * @param {Object} event
     * @private
     */
    _handleKeydownUpDown: function (event, isExtend) {
      if (this._isTableActionableMode()) {
        // ignore in actionable mode
        return;
      }
      var focusedRowIdx = this._getFocusedRowIdx();
      var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();

      if (focusedRowIdx != null && !this._hasEditableRow()) {
        var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
        var rowCount = tableBodyRows != null ? tableBodyRows.length : 0;
        var current = (!isExtend || this._isNavigate) ? focusedRowIdx : this._lastSelectedRowIdx;
        if (current == null) {
          current = focusedRowIdx;
        }
        var target;
        if (this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_UP)) {
          target = current > 0 ? current - 1 : current;
        } else if (this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_DOWN)) {
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
            var focused = this._setRowFocus(target, true, true, null, event);

            if (!focused) {
              return;
            }
            this._getTableDomUtils().getTable().focus();
          } else if (target === focusedRowIdx &&
                    focusedRowIdx === 0 &&
                    this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_UP)) {
            // if user is on the first row and presses up the focus on the first visible column header
            var visibleIndex = this._getFirstVisibleColumnIndex(0, true);
            this._setHeaderColumnFocus(visibleIndex, true, false);
          }
        }
      } else if (focusedHeaderColumnIdx != null &&
        this._isKeyboardKeyPressed(this._KEYBOARD_CODES._KEYBOARD_CODE_DOWN)) {
        // if user is on a column header and pressed down then focus on the first row
        this._setRowFocus(0, true, true, null, event);
      }
    },

    /**
     * Callback handler mouse move/enter for column headers.
     * @private
     */
    _handleMouseEnterColumnHeader: function (element) {
      if (element) {
        element.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._HOVER);
        // get the column index of the header element
        var columnIdx = this._getTableDomUtils().getElementColumnIdx(element);

        // add hover class if element is sort icon
        if (element.classList.contains(
          oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS) ||
          element.classList.contains(
            oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS)) {
          element.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._HOVER);
        }
        // show sort icon on hover
        this._showTableHeaderColumnSortIcon(columnIdx);
      }
    },

    /**
     * Callback handler mouse leave for column headers.
     * @private
     */
    _handleMouseLeaveColumnHeader: function (element) {
      if (element) {
        element.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._HOVER);
        // get the column index of the header element
        var columnIdx = this._getTableDomUtils().getElementColumnIdx(element);
        // hide the asc/dsc links for the header
        this._hideTableHeaderColumnSortIcon(columnIdx);
        this._hideTableHeaderColumnSortIcon(columnIdx);
      }
    },

    /**
     * Callback handler mouse move for selection.
     * @param {Element} element
     * @param {boolean=} isTouchAffordance true if this is from a touch affordance
     * @private
     */
    _handleMouseEnterSelection: function (element, isTouchAffordance) {
      // skip selection state updates if row selection is not enabled
      if (!this._isRowSelectionEnabled()) {
        return;
      }
      var rowIdx = this._getTableDomUtils().getElementRowIdx(element);
      if (this._mouseDownRowIdx != null && rowIdx != null && this._mouseDownRowIdx !== rowIdx) {
        if (this._getRowSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE) {
          this._selectRange(this._mouseDownRowIdx, rowIdx, true);
        } else {
          this._selectRange(rowIdx, rowIdx, true);
        }
        if (rowIdx < this._mouseDownRowIdx) {
          this._getTableDomUtils().moveTableBodyRowTouchSelectionAffordanceTop(rowIdx);
        } else {
          this._getTableDomUtils().moveTableBodyRowTouchSelectionAffordanceBottom(rowIdx);
        }
      } else if (rowIdx != null && rowIdx === this._mouseDownRowIdx) {
        if (isTouchAffordance) {
          this._selectRange(rowIdx, rowIdx, true);
          this._getTableDomUtils().moveTableBodyRowTouchSelectionAffordanceTop(rowIdx);
          this._getTableDomUtils().moveTableBodyRowTouchSelectionAffordanceBottom(rowIdx);
        } else {
          this._clearSelectedRows();
        }
      }
    },

    /**
     * Callback handler max fetch count.
     * @private
     */
    _handleScrollerMaxRowCount: function () {
      var errSummary = this.getTranslatedString('msgScrollPolicyMaxCountSummary');
      var errDetail = this.getTranslatedString('msgScrollPolicyMaxCountDetail');
      Logger.warn(errSummary + '\n' + errDetail);
    },

    /**
     * Handle scrollLeft on scroller
     * @private
     */
    _handleScrollerScrollLeft: function (scrollLeft) {
      this._scrollLeft = scrollLeft;

      var tableHeaderRow = this._getTableDomUtils().getTableHeaderRow();
      if (tableHeaderRow) {
        if (this._GetReadingDirection() === 'rtl') {
          tableHeaderRow.style[oj.TableDomUtils.CSS_PROP._RIGHT] =
            '-' + scrollLeft + oj.TableDomUtils.CSS_VAL._PX;
        } else {
          tableHeaderRow.style[oj.TableDomUtils.CSS_PROP._LEFT] =
            '-' + scrollLeft + oj.TableDomUtils.CSS_VAL._PX;
        }
      }

      var tableFooterRow = this._getTableDomUtils().getTableFooterRow();
      if (tableFooterRow) {
        if (this._GetReadingDirection() === 'rtl') {
          tableFooterRow.style[oj.TableDomUtils.CSS_PROP._RIGHT] =
            '-' + scrollLeft + oj.TableDomUtils.CSS_VAL._PX;
        } else {
          tableFooterRow.style[oj.TableDomUtils.CSS_PROP._LEFT] =
            '-' + scrollLeft + oj.TableDomUtils.CSS_VAL._PX;
        }
      }
    },

    /**
     * Handle scrollTop on scroller
     * @private
     */
    _handleScrollerScrollTop: function (scrollTop) {
      // if no domScroller is set, make sure scroll pos busy state is cleared here
      if (!this._domScroller) {
        this._clearScrollPosBusyState();
      }
      if (scrollTop < 0) {
        // eslint-disable-next-line no-param-reassign
        scrollTop = 0;
      }
      this._scrollTop = scrollTop;
      // keep track when scrollTop is triggered by self (syncScrollPosition)
      this._scrollY = this._skipScrollUpdate ? scrollTop : null;

      // update mobile touch selection affordance if present
      this._getTableDomUtils().moveTableBodyRowTouchSelectionAffordanceTop();
      this._getTableDomUtils().moveTableBodyRowTouchSelectionAffordanceBottom();
    },

    /**
     * Handler for column sort
     * @param {number} columnIdx  column index
     * @param {boolean} ascending  sort order ascending
     * @param {Object} event
     * @private
     */
    _handleSortTableHeaderColumn: function (columnIdx, ascending, event) {
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
    },

    /**
     * Return whether the table currently has an editable row
     * @return {boolean} true or false
     * @private
     */
    _hasEditableRow: function () {
      if (!this._isTableEditMode()) {
        return false;
      }

      return this._getEditableRowIdx() !== null;
    },

    /**
     * Has row or cell renderer or template
     * @param {number|null} columnIdx  column index
     * @return {boolean} true or false
     * @private
     */
    _hasRowOrCellRendererOrTemplate: function (columnIdx) {
      var rowRenderer = this._getRowRenderer();

      if (rowRenderer != null) {
        return true;
      }

      var cellRenderer = null;
      var cellSlotTemplate = null;
      var columns = this._getColumnDefs();

      if (columnIdx != null) {
        cellRenderer = this._getColumnRenderer(columnIdx, 'cell');
        cellSlotTemplate = this._getSlotTemplate(columns[columnIdx][this._CELL_TEMPLATE]);
      } else {
        var columnsCount = columns.length;

        for (var i = 0; i < columnsCount; i++) {
          cellRenderer = this._getColumnRenderer(i, 'cell');

          if (cellRenderer != null) {
            break;
          }

          cellSlotTemplate = this._getSlotTemplate(columns[i][this._CELL_TEMPLATE]);

          if (cellSlotTemplate != null) {
            break;
          }
        }
      }
      if (cellRenderer != null || cellSlotTemplate != null) {
        return true;
      }
      // check for default slot cell template
      if (this._isDefaultCellTemplateSlotValid()) {
        var defaultCellSlotTemplate = this._getSlotTemplate('cellTemplate');
        if (defaultCellSlotTemplate != null) {
          return true;
        }
      }
      return false;
    },

    /**
     * Hide the 'No data to display.' message.
     * @private
     */
    _hideNoDataMessage: function () {
      if (this._noDataMessageShown) {
        var tableBodyMessageRow = this._getTableDomUtils().getTableBodyMessageRow();
        if (tableBodyMessageRow != null) {
          $(tableBodyMessageRow).remove();
        }
        this._noDataMessageShown = false;
      }
    },

    /**
     * Hide the Fetching Data... status message.
     * @private
     */
    _hideStatusMessage: function () {
      this._clearShowStatusTimeout();

      if (this._statusMessageShown) {
        var statusMessage = this._getTableDomUtils().getTableStatusMessage();
        statusMessage.style[oj.TableDomUtils.CSS_PROP._DISPLAY] = oj.TableDomUtils.CSS_VAL._NONE;
        this._statusMessageShown = false;
      }
    },

    /**
     * Hide the column header sort icon
     * @param {number} columnIdx  column index
     * @private
     */
    _hideTableHeaderColumnSortIcon: function (columnIdx) {
      // check if the column is sortable. If not, then there won't be any sort icons
      if (this._getColumnDefs()[columnIdx].sortable === this._OPTION_ENABLED) {
        var domUtils = this._getTableDomUtils();
        var tableHeaderColumn = domUtils.getTableHeaderColumn(columnIdx);
        // check if the column is currently sorted
        var sorted = $(tableHeaderColumn).data('sorted');
        if (sorted == null) {
          var sortContainer = domUtils.getSortIconContainer(tableHeaderColumn);
          if (sortContainer != null) {
            sortContainer.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._ENABLED);
          }
          var sortIcon = domUtils.getSortIcon(tableHeaderColumn);
          if (sortIcon != null) {
            sortIcon.classList.remove(
              oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS);
            sortIcon.classList.add(
              oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
            sortIcon.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._DISABLED);
            sortIcon.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._DEFAULT);
          }
        }
      }
    },

    /**
     * Do an initial fetch
     * @param {Object} options options for the fetch
     * @param {boolean} force whether to force fetch
     * @private
     */
    _initFetch: function (options, force) {
      // eslint-disable-next-line no-param-reassign
      options = options || {};
      var self = this;
      var dataprovider = this._getData();
      // do an initial fetch if a TableDataSource
      // paging control should do the fetches for PagingTableDataSource
      if (dataprovider != null &&
          oj.DataProviderFeatureChecker.isDataProvider(dataprovider) &&
          (!this._isPagingModelDataProvider()
           || force)) {
        return this._queueTask(function () {
          // reset the scrollTop when we do an initial fetch
          self._scrollTop = 0;
          self._getTableDomUtils().getScroller().scrollTop = 0;
          if (dataprovider instanceof oj.TableDataSourceAdapter) {
            // eslint-disable-next-line no-param-reassign
            options.fetchType = 'init';

            if (self._isLoadMoreOnScroll()) {
              // eslint-disable-next-line no-param-reassign
              options[self._CONST_OFFSET] = 0;
            }
          }
          return self._invokeDataFetchRows(options);
        });
      } else if (dataprovider == null) {
        return this._queueTask(function () {
          return Promise.resolve();
        });
      }
      return undefined;
    },

    /**
     * Initialize the template engine
     * @private
     */
    _initTemplateEngine: function () {
      // initialize the template engine
      var self = this;
      this._queueTask(function () {
        var enginePromise;
        try {
          enginePromise = Config.__getTemplateEngine().then(function (engine) {
            self._templateEngine = engine;
          }, function (err) {
            Logger.warn(err);
          });
        } catch (err) {
          Logger.warn(err);
          enginePromise = Promise.resolve(null);
        }
        return enginePromise;
      });
    },

    /**
     * Creates an updated options object used when calling fetchFirst on the data provider.
     * @param {Object=} options initial options for the fetch.
     * @return {Object} updated options for the fetch.
     * @private
     */
    _initializeFetchFirstOptions: function (options) {
      var updatedOptions = options || {};
      if (!updatedOptions[this._CONST_PAGESIZE] && this._isLoadMoreOnScroll()) {
        updatedOptions[this._CONST_PAGESIZE] = this.options.scrollPolicyOptions.fetchSize;
      } else {
        updatedOptions[this._CONST_PAGESIZE] = -1;
      }
      // explicitly silence events to keep backward compatibility
      updatedOptions[this._CONST_SILENT] = true;
      return updatedOptions;
    },

    /**
     * Fetch rows
     * @param {Object} options options for the fetch
     * @return {Promise} Promise resolves with the result when done.
     * @private
     */
    _invokeDataFetchRows: function (options) {
      // eslint-disable-next-line no-param-reassign
      options = this._initializeFetchFirstOptions(options);
      var dataprovider = this._getData();
      if (dataprovider != null) {
        var self = this;
        return new Promise(function (resolve) {
          self._noMoreData = false;
          self._setDataWaitingState();
          self._dataProviderAsyncIterator =
            dataprovider.fetchFirst(options)[Symbol.asyncIterator]();
          self._dataProviderAsyncIterator.next().then(function (result) {
            var value = result[self._CONST_VALUE];
            var data = value[self._CONST_DATA];
            var keys = value.metadata.map(function (_value) {
              return _value[self._CONST_KEY];
            });

            var offset = 0;
            if (dataprovider instanceof oj.TableDataSourceAdapter) {
              offset = dataprovider[self._CONST_OFFSET];
            }

            var startIndex = 0;
            if (self._isPagingModelDataProvider()) {
              startIndex = dataprovider.getStartItemIndex();
            }

            var indexArray = [];
            var resultDataCount = data.length;

            for (var i = 0; i < resultDataCount; i++) {
              indexArray[i] = offset + startIndex + i;
            }
            var metadataArray = value[self._CONST_METADATA];

            // Need to clear DOM scroller before refreshAll potentially triggers
            // additional data fetches when syncing scroll position
            self._unregisterDomScroller();

            if (result.maxCountLimit) {
              self._noMoreData = true;
              self._handleScrollerMaxRowCount();
              self._dataProviderAsyncIterator = null;
            } else if (result.done) {
              self._noMoreData = true;
              self._dataProviderAsyncIterator = null;
            }

            self._refreshAll({
              data: data,
              metadata: metadataArray,
              keys: keys,
              indexes: indexArray
            }, offset).then(function () {
              self._clearDataWaitingState();
              self._processFetchSort(value);
              if (self._isLoadMoreOnScroll()) {
                self._registerDomScroller();
              }
              self = null;
              resolve(result);
            });
          }, function () {
            self._clearDataWaitingState();
            var tableBodyRows = self._getTableDomUtils().getTableBodyRows();
            if (tableBodyRows == null || tableBodyRows.length === 0) {
              self._showNoDataMessage();
            }
            resolve(null);
          });
        });
      }

      return Promise.resolve(null);
    },

    /**
     * Invoke sort on a field. This function is called when a user clicks the
     * column header sort icons
     * @param {string} sortField  field name
     * @param {boolean} ascending  sort order ascending
     * @param {Object} event
     * @private
     */
    _invokeDataSort: function (sortField, ascending, event) {
      var dataprovider = this._getData();
      // if no data then bail
      if (!dataprovider) {
        return;
      }

      // show the Fetching Data... message
      this._showStatusMessage();

      var sortCriteria = [];
      var sortCriterion = {};
      sortCriterion[this._CONST_ATTRIBUTE] = sortField;
      if (ascending) {
        sortCriterion.direction = this._COLUMN_SORT_ORDER._ASCENDING;
      } else {
        sortCriterion.direction = this._COLUMN_SORT_ORDER._DESCENDING;
      }
      sortCriteria.push(sortCriterion);
      this._trigger('sort', event, {
        header: sortCriteria[0][this._CONST_ATTRIBUTE],
        direction: sortCriteria[0].direction
      });

      this._beforeDataRefresh();
      this._initFetch({ sortCriteria: sortCriteria }, true);
    },

    /**
     * Whether the columns have been updated
     * @return {boolean} true or false
     * @private
     */
    _isColumnMetadataUpdated: function () {
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
                  columnsMetadata[i][prop].indexOf(this._COLUMN_HEADER_ID_PREFIX) !== 0 ||
                  this._columnDefArray[i][prop] == null ||
                  this._columnDefArray[i][prop].indexOf(this._COLUMN_HEADER_ID_PREFIX) !== 0) {
                // ignore generated ids
                return true;
              }
            }
          }
        }

        return false;
      }
      return true;
    },

    /**
     * Is keybaord key pressed
     * @param {number} keyCode  KeyCode of the keyboard key.
     * @return {boolean} true or false
     * @private
     */
    _isKeyboardKeyPressed: function (keyCode) {
      var keyboardKeys = this._getKeyboardKeys();
      var keyboardKeysCount = keyboardKeys.length;
      for (var i = 0; i < keyboardKeysCount; i++) {
        if (keyboardKeys[i] === keyCode) {
          return true;
        }
      }
      return false;
    },

    /**
     * Is loadMoreOnScroll
     * @return {boolean} true or false
     * @private
     */
    _isLoadMoreOnScroll: function () {
      if (this.options.scrollPolicy === this._OPTION_SCROLL_POLICY._AUTO) {
        // maintain old 'auto' behavior for legacy DataSource
        return !(this._data instanceof oj.TableDataSourceAdapter);
      }

      return this.options.scrollPolicy !== this._OPTION_SCROLL_POLICY._LOAD_ALL;
    },

    /**
     * Return whether the node is editable
     * @param {Node} node  DOM Node
     * @return {boolean} true or false
     * @private
     */
    _isNodeEditable: function (node) {
      return this._isNodeType(node, /^INPUT|TEXTAREA/);
    },

    /**
     * Return whether the node is clickable
     * @param {Node} node  DOM Node
     * @return {boolean} true or false
     * @private
     */
    _isNodeClickable: function (node) {
      return this._isNodeType(node, /SELECT|OPTION|BUTTON|^A\b/);
    },

    /**
     * Return whether the node or any of its ancestors is draggable
     * @param {Node} node  DOM Node
     * @return {boolean} true or false
     * @private
     */
    _isNodeDraggable: function (node) {
      return this._getTableDomUtils().getFirstAncestor(node, "[draggable='true']", true) != null;
    },

    /**
     * Return whether the node is editable or clickable
     * @param {Node} node  DOM Node
     * @param {Object} type regex
     * @return {boolean} true or false
     * @private
     */
    _isNodeType: function (node, type) {
      var table = this._getTableDomUtils().getTable();

      while (node != null && node !== table) {
        var nodeName = node.nodeName;
        if (nodeName === oj.TableDomUtils.DOM_ELEMENT._TD ||
            nodeName === oj.TableDomUtils.DOM_ELEMENT._TH) {
          break;
        }

        // If the node is a text node, move up the hierarchy to only operate on elements
        // (on at least the mobile platforms, the node may be a text node)
        if (node.nodeType !== 3) { // 3 is Node.TEXT_NODE
          if (nodeName.match(type)) {
            var tabIndex = node.getAttribute(oj.TableDomUtils.DOM_ATTR._TABINDEX);
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
    },

    /**
     * Return whether this is a PagingModel dataprovider
     * @returns {boolean}
     * @private
     */
    _isPagingModelDataProvider: function () {
      var dataprovider = this._getData();
      if (dataprovider.getStartItemIndex != null &&
          dataprovider.getStartItemIndex() !== null &&
          dataprovider.getStartItemIndex() >= 0) {
        return true;
      }
      return false;
    },

    /**
     * Return whether the status message is shown
     * @return {boolean} true or false
     * @private
     */
    _isStatusMessageShown: function () {
      return this._statusMessageShown;
    },

    /**
     * Return whether the component is in table actionable mode
     * @return {boolean} true or false
     * @private
     */
    _isTableActionableMode: function () {
      return this._tableActionableMode;
    },

    /**
     * Returns whether the table is editabe mode
     * @return {boolean} true or false
     * @private
     */
    _isTableEditMode: function () {
      var editMode = this.options.editMode;

      if (editMode === this._OPTION_EDIT_MODE._ROW_EDIT) {
        return true;
      }
      return false;
    },

    /**
     * Returns whether the table is footerless
     * @return {boolean} true or false
     * @private
     */
    _isTableFooterless: function () {
      var columns = this._getColumnDefs();
      var columnsCount = columns.length;

      for (var i = 0; i < columnsCount; i++) {
        var footerRenderer = this._getColumnRenderer(i, 'footer');
        var footerSlotTemplate = this._getSlotTemplate(columns[i][this._FOOTER_TEMPLATE]);

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
    },

    /**
     * Returns whether the table is headerless
     * @return {boolean} true or false
     * @private
     */
    _isTableHeaderless: function () {
      var columns = this._getColumnDefs();
      var columnsCount = columns.length;

      for (var i = 0; i < columnsCount; i++) {
        var headerSlotTemplate = this._getSlotTemplate(columns[i][this._HEADER_TEMPLATE]);

        if (columns[i].headerText != null ||
            columns[i].headerStyle != null ||
            (columns[i].sortable != null &&
             columns[i].sortable !== this._OPTION_DISABLED) ||
            columns[i].sortProperty != null ||
            columns[i].headerRenderer != null ||
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
    },

    /**
     * Returns whether the table header columns were rendered
     * @return {boolean} true or false
     * @private
     */
    _isTableHeaderColumnsRendered: function () {
      return this._renderedTableHeaderColumns === true;
    },

    /**
     * Returns whether the table refresh is needed based on option change
     * @param {string} key option key
     * @param {Object} value option value
     * @return {boolean} true or false
     * @private
     */
    _isTableRefreshNeeded: function (key, value) {
      var currentOptions = this._cachedOptions;
      var refresh = false;

      if (key === 'contextMenu' &&
          value === '#' + this._getTableDomUtils().getTableId() + '_contextmenu') {
        refresh = false;
      } else if (key === 'columns' && !this._isColumnMetadataUpdated()) {
        // optimization for columns. Column re-order can change the columns options but we don't need to refresh
        refresh = false;
      } else if (key !== 'selection' &&
                 key !== 'currentRow' &&
                 !oj.Object.compareValues(value, currentOptions[key])) {
        refresh = true;
      }

      this._cachedOptions = $.extend(true, {}, this.options);

      return refresh;
    },

    /**
     * Returns whether any of the table columns are sortable
     * @return {boolean} true or false
     * @private
     */
    _isTableSortable: function () {
      var columns = this._getColumnDefs();
      var columnsCount = columns.length;

      for (var i = 0; i < columnsCount; i++) {
        if (columns[i].sortable === this._OPTION_ENABLED) {
          return true;
        }
      }

      return false;
    },

    /**
     * Returns whether any of the table columns are resizable
     * @return {boolean} true or false
     * @private
     */
    _isTableColumnsResizable: function () {
      var columns = this._getColumnDefs();
      var columnsCount = columns.length;

      for (var i = 0; i < columnsCount; i++) {
        if (columns[i].resizable === this._OPTION_ENABLED) {
          return true;
        }
      }

      return false;
    },

    _isTouchDevice: function () {
      if (this._isTouch == null) {
        var agentName = navigator.userAgent.toLowerCase();
        if (agentName.indexOf('mobile') !== -1 || agentName.indexOf('android') !== -1) {
          this._isTouch = true;
        } else {
          this._isTouch = false;
        }
      }
      return this._isTouch;
    },

    /**
     * Process any sort from the fetch
     * @param {Object} result result of the fetch
     * @private
     */
    _processFetchSort: function (result) {
      try {
        var self = this;
        var fetchParameters = result.fetchParameters;
        var columns = this._getColumnDefs();
        var sortCriteria = fetchParameters[this._CONST_SORTCRITERIA];
        if ((sortCriteria != null &&
            sortCriteria.length > 0) || this._sortInfo != null) {
          var sortAttribute;
          var sortDirection;
          if (this._sortInfo) {
            sortAttribute = this._sortInfo.key;
            sortDirection = this._sortInfo.direction === this._COLUMN_SORT_ORDER._ASCENDING;
          } else {
            sortAttribute = sortCriteria[0].attribute;
            sortDirection = sortCriteria[0].direction === this._COLUMN_SORT_ORDER._ASCENDING;
          }

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
            setTimeout(function () {
              self._scrollColumnIntoViewport(columnIdx);
              self = null;
              columnIdx = null;
            }, 0);
          }
        } else {
          this._clearSortedHeaderColumn();
        }
      } catch (e) {
        Logger.error(e);
      }
    },

    /**
     * Process any slotted children and move them into the correct location
     * @private
     */
    _processSlottedChildren: function () {
      var tableBottomSlot = this._getTableDomUtils().getTableBottomSlot();

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
            tableBottomSlot = this._getTableDomUtils().createTableBottomSlot();
            for (var i = 0; i < slotElements.length; i++) {
              tableBottomSlot.appendChild(slotElements[i]);
            }
          }
        }
      }
    },

    /**
     * @param {Object} resultObject Object containing data array, key array, and index array
     * @param {number} startIndex start index
     * @return {Promise} Promise Return Promise which is resolved when the DOM has been updated and
     * all JET components in it have been resolved.
     * @private
     */
    _refreshAll: function (resultObject, startIndex) {
      if (this._isColumnMetadataUpdated() ||
          (!this._isTableHeaderColumnsRendered() &&
           !this._isTableHeaderless())) {
        this._clearCachedMetadata();
        this._refreshTableHeader();

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
      this._refreshTableFooter();
      return this._refreshTableBody(resultObject, startIndex);
    },

    /**
     * Handler for column sort
     * @param {string} key sort key
     * @param {boolean} ascending  sort order ascending
     * @private
     */
    _refreshSortTableHeaderColumn: function (key, ascending) {
      var columns = this._getColumnDefs();
      var columnIdx = null;
      var columnsCount = columns.length;
      var sortIcon;
      var accessibilityText;

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
      var domUtils = this._getTableDomUtils();
      var tableHeaderColumn = domUtils.getTableHeaderColumn(columnIdx);
      if (tableHeaderColumn == null) {
        return;
      }

      var sorted = $(tableHeaderColumn).data('sorted');
      sortIcon = domUtils.getSortIcon(tableHeaderColumn);
      if (sortIcon != null) {
        sortIcon.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._DEFAULT);
        sortIcon.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._DISABLED);
      }
      var sortContainer = domUtils.getSortIconContainer(tableHeaderColumn);

      if (ascending && sorted !== this._COLUMN_SORT_ORDER._ASCENDING) {
        accessibilityText = this.getTranslatedString('accessibleSortAscending', { id: key });
        domUtils.setTableStatusAccNotification(accessibilityText);
        if (sortContainer != null) {
          sortContainer.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._ENABLED);
        }
        // store sort order on the DOM element
        $(tableHeaderColumn).data('sorted', this._COLUMN_SORT_ORDER._ASCENDING);

        this._sortInfo = {
          direction: this._COLUMN_SORT_ORDER._ASCENDING,
          columnIdx: columnIdx,
          key: key
        };

        if (sortIcon != null) {
          sortIcon.classList.remove(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS);
          sortIcon.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
        }
      } else if (!ascending && sorted !== this._COLUMN_SORT_ORDER._DESCENDING) {
        accessibilityText = this.getTranslatedString('accessibleSortDescending', { id: key });
        domUtils.setTableStatusAccNotification(accessibilityText);

        if (sortContainer != null) {
          sortContainer.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._ENABLED);
        }
        // store sort order on the DOM element
        $(tableHeaderColumn).data('sorted', this._COLUMN_SORT_ORDER._DESCENDING);
        this._sortInfo = {
          direction: this._COLUMN_SORT_ORDER._DESCENDING,
          columnIdx: columnIdx,
          key: key
        };
        if (sortIcon != null) {
          sortIcon.classList.remove(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
          sortIcon.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DSC_ICON_CLASS);
        }
      }
    },

    /**
     * Renders one row of data
     * @private
     */
    _renderRow: function (rowData, tableBodyDocFrag, startIndex) {
      var row = rowData.row;
      var rowIdx = rowData.rowIdx;
      if (row != null) {
        var tableBodyRow = this._getTableDomUtils().createTableBodyRow(rowIdx,
                                                                   row[this._CONST_KEY]);
        this._getTableDomUtils().styleTableBodyRow(tableBodyRow, true);
        this._getTableDomUtils().insertTableBodyRow(rowIdx, tableBodyRow, row,
                                                    tableBodyDocFrag);
        this._refreshTableBodyRow(rowIdx, row, tableBodyRow, tableBodyDocFrag,
                                  startIndex, true);
      }
    },

    /**
     * Invoke refreshTableDimensions only after scrolling is finish
     * @private
     */
    _delayRefreshTableDimensions: function () {
      this._setDelayRefreshTableDimensionsBusyState();

      var beforeScrollTop = this._scrollTop;
      var self = this;
      this._refreshTableDimensionsTimer = setTimeout(function () {
        var currentScrollTop = self._scrollTop;
        if (beforeScrollTop !== currentScrollTop) {
          self._delayRefreshTableDimensions();
        } else {
          self._queueTask(function () {
            self._refreshTableDimensionsTimer = null;
            // final task should be fully executed
            self._skipRefreshTableDimension = false;
          });
          self._clearDelayRefreshTableDimensionsBusyState();
        }
      }, 250);
    },

    /**
     * Invoked after all the rows in a single fetch are rendered
     * @private
     */
    _afterRowsRendered: function (tableBody, delayRefresh) {
      this._getTableDomUtils().clearCachedDomRowData();
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

      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
      if (tableBodyRows) {
        return this._finalizeRowRendering(tableBodyRows).then(function () {
          if (isNaN(this._rowHeight) && tableBodyRows.length > 1) {
            this._rowHeight = tableBody.rows[1].offsetHeight;
          }
          return Promise.resolve(true);
        }.bind(this));
      }
      return Promise.resolve(true);
    },

    /**
     * Clear idle callback
     * @private
     */
    _clearIdleCallback: function () {
      if (this.m_idleCallback != null) {
        if (!window.requestIdleCallback || !window.cancelIdleCallback) {
          window.cancelAnimationFrame(this.m_idleCallback);
        } else {
          window.cancelIdleCallback(this.m_idleCallback);
          // requestAnimationFrame might have been used
          window.cancelAnimationFrame(this.m_idleCallback);
        }
        this.m_idleCallback = null;
      }
    },

    /**
     * Helper for requestIdleCallback and possible fallback
     * @private
     */
    _requestIdleCallback: function (isMouseWheel, callback) {
      // IE/Edge/Safari do not support requestIdleCallback, use requestAnimationFrame as fall back
      // also Chrome has an issue with requestIdleCallback when mouse wheel is used, see Chrome :
      // https://bugs.chromium.org/p/chromium/issues/detail?id=822269
      if (isMouseWheel || !window.requestIdleCallback || !window.cancelIdleCallback) {
        this.m_idleCallback = window.requestAnimationFrame(function () {
          callback();
        });
        return;
      }

      var idleTimeout = window.setTimeout(function () {
        this.m_idleCallback = window.requestAnimationFrame(function () {
          callback();
        });
        idleTimeout = null;
      }, 250);

      this.m_idleCallback = window.requestIdleCallback(function (idleDeadline) {
        if (idleTimeout == null) {
          return;
        }

        window.clearTimeout(idleTimeout);
        callback(idleDeadline);
      });
    },

    /**
     * Renders fetched rows in idle cycle (or animation frame if not supported)
     * @private
     */
    _renderRowsWhenIdle: function (rows, tableBody, startIndex, resolve, reject, isMouseWheel) {
      if (rows.length === 0) {
        this.m_idleCallback = null;
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
          self._getTableDomUtils().freezeColumnWidths(tableBodyDocFrag);
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

          if (rowProcessed === 0 && !self._getTableDomUtils()._tableWidthConstrained) {
            // eslint-disable-next-line no-param-reassign
            tableBody.style[oj.TableDomUtils.CSS_PROP._OVERFLOW_X] = 'hidden';
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
        for (var i = 0; i < self._BATCH_PROCESS_SIZE_WHEN_IDLE; i++) {
          if (rows.length === 0) {
            break;
          }

          if (rowProcessed === 0 && !self._getTableDomUtils()._tableWidthConstrained) {
            // eslint-disable-next-line no-param-reassign
            tableBody.style[oj.TableDomUtils.CSS_PROP._OVERFLOW_X] = 'hidden';
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
    },

    /**
     * Checks whether content is overflowed
     * @private
     */
    _isOverflow: function () {
      return this._isLoadMoreOnScroll() && this._domScroller && this._domScroller.isOverflow();
    },

    /**
     * Refresh the entire table body with data from the datasource
     * @param {Object} resultObject Object containing data array, key array, and index array
     * @param {number} startIndex start index
     * @return {Promise} Promise Return Promise which is resolved when the DOM has been updated and
     * all JET components in it have been resolved.
     * @private
     */
    _refreshTableBody: function (resultObject, startIndex) {
      var tableBody = this._getTableDomUtils().getTableBody();

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
        this._getTableDomUtils().removeAllTableBodyRows();
      } else {
        tableBodyRows = this._getTableDomUtils().getTableBodyRows();
        if (tableBodyRows != null && tableBodyRows.length > 0) {
          var tableBodyRowsCount = tableBodyRows.length;
          for (i = tableBodyRowsCount - 1; i >= startIndex; i--) {
            if (checkFocus) {
              tableBodyRow = this._getTableDomUtils().getTableBodyRow(i);

              if (tableBodyRow != null &&
                    $.contains(tableBodyRow, document.activeElement)) {
                resetFocus = true;
                checkFocus = false;
              }
            }
            this._getTableDomUtils().removeTableBodyRow(i);
          }
        }
      }

      if (resetFocus) {
        this._getTableDomUtils().getTable().focus();
      }
      this._getTableDomUtils().clearCachedDomRowData();
      this._hideNoDataMessage();
      tableBodyRows = tableBody.children;

      // if no data then bail
      if (rows.length === 0 && (tableBodyRows == null || tableBodyRows.length === 0)) {
        this._showNoDataMessage();
      } else {
        var tableBodyDocFrag;

        // for the pre-fetching case, we'll render items during idle cycles
        // don't do it when the scroll is caused by handling scroll position
        if (startIndex > 0 && this._isOverflow() && !this._fetchBySyncScroll) {
          var self = this;
          return new Promise(function (resolve, reject) {
            self._setIdleRenderBusyState();

            // clone the rows array since we'll manipulate it
            self._renderRowsWhenIdle(rows.slice(0), tableBody, startIndex, resolve, reject,
              resultObject.isMouseWheel);
          });
        }

        tableBody.style[oj.TableDomUtils.CSS_PROP._VISIBILITY] = oj.TableDomUtils.CSS_VAL._HIDDEN;
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
    },

    /**
     * Refresh the row at a particular index with the row data
     * @param {number} rowIdx  row index relative to the start of the table
     * @param {Object} row  row and key object
     * @param {Object} tableBodyRow tr element
     * @param {Object} docFrag  document fragment
     * @param {number} docFragStartIdx  document fragment row start index
     * @param {boolean} isNew is new row
     * @return {Element|null} tableBodyRow  DOM element
     * @private
     */
    _refreshTableBodyRow: function (rowIdx, row, tableBodyRow, docFrag, docFragStartIdx, isNew) {
      var domUtils = this._getTableDomUtils();
      var rowRenderer = this._getRowRenderer();
      var tableBody = domUtils.getTableBody();

      if (isNaN(rowIdx) || rowIdx < 0) {
        // validate rowIdx value
        Logger.error('Error: Invalid rowIdx value: ' + rowIdx);
      }

      var rowHashCode = domUtils.hashCode(row[this._CONST_KEY]);

      if (tableBodyRow == null) {
        // check if we already have a <tr> element at that index
        // eslint-disable-next-line no-param-reassign
        tableBodyRow = domUtils.getTableBodyRow(rowIdx);
        if (!tableBodyRow) {
          // if not return
          return null;
        }

        if (this._hasCellTemplate) {
          this._cleanTemplateNodes(tableBodyRow);
          // No need to set this._hasCellTemplate to false here since only one row is refreshed
        }
        $(tableBodyRow).empty();
        // eslint-disable-next-line no-param-reassign
        isNew = true;
        domUtils.createTableBodyCellAccSelect(rowIdx, row[this._CONST_KEY],
                                                              rowHashCode, tableBodyRow, isNew);
      }

      this._hideNoDataMessage();

      var currentRow = this._getCurrentRow();
      currentRow = currentRow || {};
      var rowContext = oj.TableRendererUtils.getRendererContextObject(this, tableBodyRow, {
        row: row,
        isCurrentRow: currentRow.rowIndex === rowIdx
      });
      // Copy additional properties to top-level context to work with custom element
      var context = {
        rowContext: rowContext,
        row: row[this._CONST_DATA],
        componentElement: rowContext.componentElement,
        parentElement: rowContext.parentElement,
        data: row[this._CONST_DATA]
      };

      if (rowRenderer != null) {
        var rowContent = rowRenderer(context);
        if (rowContent != null) {
          // if the renderer returned a value then we set it as the content
          // for the row
          tableBodyRow.appendChild(rowContent); // @HTMLUpdateOK
        } else {
          // if the renderer didn't return a value then the existing
          // row was manipulated. So get it and set the required
          // attributes just in case it was replaced or the attributes
          // got removed
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
          domUtils.clearCachedDomRowData();
          domUtils.setTableBodyRowAttributes(row, tableBodyRow);
          domUtils.styleTableBodyRow(tableBodyRow, false);
        }
        domUtils.createTableBodyCellAccSelect(rowIdx, row[this._CONST_KEY],
                                              rowHashCode, tableBodyRow, false);

        // set the cell attributes and styling. Skip the 1st one
        // because it's the acc row select td
        var tableBodyCells = domUtils.getTableElementsByTagName(tableBodyRow,
          oj.TableDomUtils.DOM_ELEMENT._TD);
        var i;
        var tableBodyCellsCount = tableBodyCells.length;
        var tableBodyCell;
        for (i = 1; i < tableBodyCellsCount; i++) {
          tableBodyCell = tableBodyCells[i];
          this._getTableDomUtils().setTableBodyCellAttributes(rowIdx, row[this._CONST_KEY],
                                                              rowHashCode, i - 1, tableBodyCell);
          this._getTableDomUtils().styleTableBodyCell(i - 1, tableBodyCell, false);
        }

        // sort the re-ordered columns in place
        if (this._columnsDestMap != null) {
          for (i = 0; i < this._columnsDestMap.length - 1; i++) {
            if (this._columnsDestMap[i] > i) {
              var moveTableBodyCell = tableBodyCells[this._columnsDestMap[i] + 1];
              var swapTableBodyCell = tableBodyCells[i + 1];
              moveTableBodyCell.parentNode.insertBefore(moveTableBodyCell, swapTableBodyCell); // @HTMLUpdateOK
              tableBodyCells = domUtils.getTableElementsByTagName(tableBodyRow,
                oj.TableDomUtils.DOM_ELEMENT._TD);
            }
          }
        }
      } else {
        oj.TableRendererUtils.tableBodyRowDefaultRenderer(this, rowIdx, row, context);
      }
      if (this._hasEditableRow() && this._getEditableRowIdx() === rowIdx) {
        tableBodyRow.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_EDIT_CLASS);
      } else {
        tableBodyRow.classList.remove(oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_EDIT_CLASS);
      }
      return tableBodyRow;
    },

    /**
     * Refresh the table footer
     * @private
     */
    _refreshTableFooter: function () {
      var columns = this._getColumnDefs();
      var tableFooter = this._getTableDomUtils().getTableFooter();

      if (!tableFooter) {
        if (this._isTableFooterless()) {
          return;
        }

        // metadata could have been updated to add column headers
        tableFooter = this._getTableDomUtils().createTableFooter();
        this._getTableDomUtils().styleTableFooter(tableFooter);
      }

      tableFooter.style[oj.TableDomUtils.CSS_PROP._VISIBILITY] = oj.TableDomUtils.CSS_VAL._HIDDEN;
      var tableFooterRow = this._getTableDomUtils().getTableFooterRow();

      if (this._hasFooterTemplate) {
        this._cleanTemplateNodes(tableFooterRow);
        this._hasFooterTemplate = false;
      }
      // remove all the existing footer cells
      $(tableFooterRow).empty();

      if (columns && columns.length > 0) {
        this._getTableDomUtils().createTableFooterAccSelect(tableFooterRow);
        var isDefaultFooterTemplateSlotValid = this._isDefaultFooterTemplateSlotValid();
        var columnsCount = columns.length;
        for (var i = 0; i < columnsCount; i++) {
          var column = columns[i];
          var footerRenderer = this._getColumnRenderer(i, 'footer');
          var footerCell =
            this._getTableDomUtils().createTableFooterCell(i);
          this._getTableDomUtils().styleTableFooterCell(i, footerCell);
          this._getTableDomUtils().insertTableFooterCell(i, footerCell);

          if (footerRenderer) {
            // if footerRenderer is defined then call that
            var footerContext =
              oj.TableRendererUtils.getRendererContextObject(this, footerCell, {});
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
              footerCell.empty();
              footerCell.appendChild(footerCellContent); // @HTMLUpdateOK
            } else {
              // if the renderer didn't return a value then the existing
              // footer cell was manipulated. So get it and set the required
              // attributes just in case it was replaced or the attributes
              // got removed
              footerCell = $(tableFooterRow).children(
                ':not(.' + oj.TableDomUtils.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS + ')')[i];
              this._getTableDomUtils().styleTableFooterCell(i, footerCell);
            }
          } else {
            var footerSlotTemplate = this._getSlotTemplate(column[this._FOOTER_TEMPLATE]);
            if (footerSlotTemplate == null && isDefaultFooterTemplateSlotValid) {
              footerSlotTemplate = this._getSlotTemplate('footerTemplate');
            }
            if (footerSlotTemplate) {
              var componentElement = this._getRootElement();
              var templateEngine = this._getTemplateEngine();
              if (templateEngine != null) {
                var slotContext = oj.TableRendererUtils.getSlotTemplateContextObject(this);
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
      }
    },

    /**
     * Refresh the table header
     * @private
     */
    _refreshTableHeader: function () {
      var self = this;
      var columns = this._getColumnDefs();
      var tableHeader = this._getTableDomUtils().getTableHeader();

      if (!tableHeader) {
        if (this._isTableHeaderless()) {
          return;
        }

        // metadata could have been updated to add column headers
        tableHeader = this._getTableDomUtils().createTableHeader();
        this._getTableDomUtils().styleTableHeader(tableHeader);
      }

      var tableHeaderRow = this._getTableDomUtils().getTableHeaderRow();
      this._unregisterChildStateListeners(tableHeaderRow);

      if (this._hasHeaderTemplate) {
        this._cleanTemplateNodes(tableHeaderRow);
        this._hasHeaderTemplate = false;
      }

      // remove all the existing column headers
      $(tableHeaderRow).empty();

      if (columns && columns.length > 0) {
        var tableHeaderAccSelectRowColumn =
          this._getTableDomUtils().createTableHeaderAccSelectRowColumn();
        tableHeaderRow.appendChild(tableHeaderAccSelectRowColumn); // @HTMLUpdateOK

        var isDefaultHeaderTemplateSlotValid = this._isDefaultHeaderTemplateSlotValid();
        var columnsCount = columns.length;
        for (var i = 0; i < columnsCount; i++) {
          var column = columns[i];
          var headerRenderer = this._getColumnRenderer(i, 'header');
          var headerColumn =
            this._getTableDomUtils().createTableHeaderColumn(i);

          if (headerRenderer) {
            // if headerRenderer is defined then call that
            var headerContext =
              oj.TableRendererUtils.getRendererContextObject(this, headerColumn, {});
            // Copy additional properties to top-level context to work with custom element
            var context = {
              headerContext: headerContext,
              columnIndex: i,
              data: column.headerText,
              componentElement: headerContext.componentElement,
              parentElement: headerContext.parentElement
            };

            if (column.sortable === oj.TableDomUtils._OPTION_ENABLED) {
              // add the sortable icon renderer
              context.columnHeaderSortableIconRenderer = function (options, delegateRenderer) {
                oj.TableRendererUtils.columnHeaderSortableIconRenderer(self, this, options,
                                                                       delegateRenderer);
              };
            } else {
              context.columnHeaderDefaultRenderer = function (options, delegateRenderer) {
                oj.TableRendererUtils.columnHeaderDefaultRenderer(self, this, options,
                                                                  delegateRenderer);
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
              headerColumn = $(tableHeaderRow).children(
                ':not(.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ACC_SELECT_ROW_CLASS +
                  ')')[i];
              this._getTableDomUtils().setTableHeaderColumnAttributes(i, headerColumn);
              this._getTableDomUtils().styleTableHeaderColumn(
                i, headerColumn, false);
            }
          } else {
            var headerSlotTemplate = this._getSlotTemplate(column[this._HEADER_TEMPLATE]);
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
                var slotContext = oj.TableRendererUtils.getHeaderSlotTemplateContextObject(
                  this, column.headerText, i);
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
          // set the acc column selection checkbox
          this._getTableDomUtils().createTableHeaderColumnAccSelect(
            i, this._getColumnSelectionMode());
        }
        this._renderedTableHeaderColumns = true;
      }
    },

    /**
     * Refresh the status message
     * @private
     */
    _refreshTableStatusMessage: function () {
      var tableStatusMessage = this._getTableDomUtils().getTableStatusMessage();

      if (tableStatusMessage != null) {
        $(tableStatusMessage).remove();
      }
      this._getTableDomUtils().createTableStatusMessage();
    },

    /**
     * Register the events which will be published by the table component.
     * @private
     */
    _registerCustomEvents: function () {
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
    },

    /**
     * Register event listeners which need to be registered datasource.
     * @private
     */
    _registerDataSourceEventListeners: function () {
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
    },

    /**
     * Register event listeners which need to be registered directly on
     * the DOM element.
     * @private
     */
    _registerDomEventListeners: function () {
      var scroller = this._getTableDomUtils().getScroller();
      if (scroller != null) {
        // if width or height is defined then we can have scrollbars so register scroll event listeners
        if (this._scrollEventListener == null) {
          this._scrollEventListener = (function (event) {
            this._handleScrollerScrollLeft(this._getTableDomUtils().getScrollLeft(event.target));
            this._handleScrollerScrollTop(event.target.scrollTop);

            // do not update scrollPosition if we are already adjusting
            if (this._isScrollPositionAdjusted()) {
              return;
            }

            var self = this;
            if (!self._skipScrollUpdate && !self._ticking) {
              window.requestAnimationFrame(function () {
                // scrollPosition could have been adjusted or a new value is set while
                // waiting for animation frame
                if (!self._isScrollPositionAdjusted() && !self._skipScrollUpdate) {
                  self.option('scrollPosition', self._getCurrentScrollPosition(), {
                    _context: {
                      originalEvent: event,
                      internalSet: true
                    }
                  });
                }
                self._ticking = false;
              });

              this._ticking = true;
            }
            this._skipScrollUpdate = false;
          }).bind(this);
        }
        // remove the event listener before adding to make sure only one is active at a time
        $(scroller).off('scroll', this._scrollEventListener);
        $(scroller).on('scroll', this._scrollEventListener);
      }
    },

    /**
     * @private
     */
    _registerDomScroller: function () {
      var i;
      var self = this;

      // clear any existing DomScroller references
      this._unregisterDomScroller();

      this._domScrollerSuccessFunc = function (result) {
        self._clearDataWaitingState();
        if (result != null) {
          self._noMoreData = false;
          if (result.maxCountLimit) {
            self._noMoreData = true;
            self._handleScrollerMaxRowCount();
            self._syncScrollPosition();
          } else {
            var value = result[self._CONST_VALUE];
            var data = value[self._CONST_DATA];
            var keys = value.metadata.map(function (_value) {
              return _value[self._CONST_KEY];
            });
            var metadataArray = value[self._CONST_METADATA];

            // remove any duplicate rows that are already in the DOM
            for (i = keys.length - 1; i >= 0; i--) {
              if (self._getRowIdxForRowKey(keys[i]) !== null) {
                data.splice(i, 1);
                keys.splice(i, 1);
              }
            }

            self._queueTask(function () {
              self._skipRefreshTableDimension = true;
              var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
              var rowCount = tableBodyRows != null ? tableBodyRows.length : 0;
              var indexArray = [];
              for (i = 0; i < data.length; i++) {
                indexArray[i] = rowCount + i;
              }
              return self._refreshAll({
                isMouseWheel: result.isMouseWheel,
                data: data,
                keys: keys,
                metadata: metadataArray,
                indexes: indexArray }, rowCount).then(function () {
                  if (result.done) {
                    self._noMoreData = true;
                    self._syncScrollPosition();
                  }
                });
            });
          }
        } else {
          // for case where result != null, the syncPosition would be done in final task
          self._syncScrollPosition();
        }
      };

      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
      var rowCount = tableBodyRows != null ? tableBodyRows.length : 0;
      this._domScroller = new oj.DomScroller(
        this._getTableDomUtils().getScroller(), this._getData(), {
          asyncIterator: this._dataProviderAsyncIterator,
          fetchSize: this.options.scrollPolicyOptions.fetchSize,
          maxCount: this.options.scrollPolicyOptions.maxCount,
          initialRowCount: rowCount,
          success: this._domScrollerSuccessFunc.bind(this),
          request: this._handleDataFetchStart.bind(this),
          localKeyValidator: function (key) {
            return (self._findRowElementByKey(key) !== null);
          },
          beforeFetch: function (scrollTop) {
            if (self.m_idleCallback == null) {
              self._fetchBySyncScroll = (self._scrollY === scrollTop);
              self._setDataWaitingState(false);
              return true;
            }
            return false;
          },
          onScrollTop: this._clearScrollPosBusyState.bind(this),
          fetchTrigger: 1
        });
    },

    /**
     * @private
     */
    _unregisterDomScroller: function () {
      if (this._domScroller != null) {
        this._domScroller.destroy();
        this._domScroller = null;
      }
    },

    /**
     * Register event listeners for resize the container DOM element.
     * @private
     */
    _registerResizeListener: function () {
      var element = this._getTableDomUtils().getTableContainer();
      if (!this._resizeListener) {
        this._resizeListener = function () {
          var domUtils = this._getTableDomUtils();
          var tableContainer = domUtils.getTableContainer();

          // Check if the width and height values should result in a sizing refresh
          if (domUtils.isSizingRefreshRequired(tableContainer.offsetWidth,
                                               tableContainer.offsetHeight)) {
            // refresh dimensions if no tasks are pending since refresh dimensions runs during final task
            if (!this._hasPendingTasks()) {
              // pass in 'true' since we have already completed the 'isSizingRefreshRequired' check above
              this._syncTableSizing(true);
            }
          }
        }.bind(this);
      }
      if (!this._isResizeListenerAdded) {
        oj.DomUtils.addResizeListener(element, this._resizeListener, 50);
        this._isResizeListenerAdded = true;
      }
    },

    /**
     * Remove a keyCode from our internal list of pressed keys. This is done on keyup.
     * @private
     */
    _removeKeyboardKey: function (keyCode) {
      var keyboardKeys = this._getKeyboardKeys();
      var keyboardKeysCount = keyboardKeys.length;
      for (var i = 0; i < keyboardKeysCount; i++) {
        if (keyboardKeys[i] === keyCode) {
          keyboardKeys.splice(i, 1);
        }
      }
    },

    /**
     * Scroll column into viewport
     * @param {number} columnIdx  row index
     * @private
     */
    _scrollColumnIntoViewport: function (columnIdx) {
      var domUtils = this._getTableDomUtils();
      var tableHeaderColumn = domUtils.getTableHeaderColumn(columnIdx);
      if (!tableHeaderColumn) {
        return;
      }

      var isRTL = (this._GetReadingDirection() === 'rtl');
      var scrollingElement = domUtils.getScroller();
      var $scrollingElement = $(scrollingElement);
      var scrollbarWidth = domUtils.getScrollBarWidth();
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
    },

    /**
     * Scroll row into viewport
     * @param {number} rowIdx  row index
     * @private
     */
    _scrollRowIntoViewport: function (rowIdx) {
      var domUtils = this._getTableDomUtils();
      var tableBodyRow = domUtils.getTableBodyRow(rowIdx);
      var scrollbarHeight = domUtils.getScrollBarHeight();
      var rowRect = tableBodyRow.getBoundingClientRect();
      var scrollingElement = domUtils.getScroller();
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
    },

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
    _setCurrentRow: function (currentRow, event, optionChange) {
      var existingCurrentRow = this._currentRow;
      var tableBodyRow;
      var existingCurrentRowIndex;
      var existingCurrentRowKey;
      var existingCurrentRowIdx;
      var updateCurrentRow = true;
      var errSummary;
      var errDetail;
      var self = this;
      var updateEditable;
      var currentFocusElement;
      var columnIdx;

      if (currentRow == null) {
        if (existingCurrentRow != null) {
          try {
            updateCurrentRow = this._trigger('beforeCurrentRow', event, {
              currentRow: null,
              previousCurrentRow: this._currentRow
            });
          } catch (err) {
            // caught an error. Do not change current row
            errSummary = this._LOGGER_MSG._ERR_PRECURRENTROW_ERROR_SUMMARY;
            errDetail = Translations.applyParameters(
              this._LOGGER_MSG._ERR_PRECURRENTROW_ERROR_DETAIL, { error: err.toString() });
            Logger.info(errSummary + '\n' + errDetail);
            // do not update the currentRow to the new value if an exception was caught
            return this._CURRENT_ROW_STATUS._ERROR;
          }

          if (!updateCurrentRow) {
            // do not update the currentRow to the new value if a listener returned false
            return this._CURRENT_ROW_STATUS._VETOED;
          }

          existingCurrentRowIndex = existingCurrentRow.rowIndex;
          existingCurrentRowKey = this._getRowKeyForDataSourceRowIndex(existingCurrentRowIndex);
          existingCurrentRowIdx = this._getRowIdxForRowKey(existingCurrentRowKey);

          updateEditable = this._setTableEditable(false, false, 0, true, event);

          if (updateEditable === false) {
            this._currentRow = existingCurrentRow;
            currentFocusElement = document.activeElement;
            columnIdx = this._getTableDomUtils().getElementColumnIdx(currentFocusElement);
            this._queueTask(function () {
              var focusRowIdx = existingCurrentRowIdx;
              var focusColumnIdx = columnIdx;
              if (focusRowIdx != null &&
                  focusColumnIdx != null) {
                setTimeout(function () {
                  self._setCellFocus(focusRowIdx, focusColumnIdx);
                }, 0);
              } else if (focusRowIdx != null) {
                setTimeout(function () {
                  self._setRowFocus(focusRowIdx, true, false, null, null);
                }, 0);
              }
            });

            // do not update the currentRow to the new value if updateEditable returned false
            return this._CURRENT_ROW_STATUS._IGNORED;
          }
          this._currentRow = null;
          this.option('currentRow', null, {
            _context: {
              writeback: true,
              originalEvent: event,
              internalSet: true
            }
          });

          if (event == null) {
            this._setRowFocus(-1, true, false, null, event);
          }

          tableBodyRow = this._getTableDomUtils().getTableBodyRow(existingCurrentRowIdx);

          if (tableBodyRow != null) {
            tableBodyRow.classList.remove(
                oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CURRENT_ROW_CLASS);
          }
        }

        return this._CURRENT_ROW_STATUS._UPDATED;
      }

      var dataprovider = this._getData();
      var rowIndex = currentRow.rowIndex;
      var rowKey = currentRow.rowKey;

      if (rowKey == null) {
        rowKey = this._getRowKeyForDataSourceRowIndex(rowIndex);
      }

      rowIndex = this._getDataSourceRowIndexForRowKey(rowKey);
      var rowIdx = this._getRowIdxForRowKey(rowKey);
      // eslint-disable-next-line no-param-reassign
      currentRow = { rowIndex: rowIndex, rowKey: rowKey };

      if (rowIdx !== -1 &&
          (!dataprovider ||
           rowIdx < -1 ||
           rowIdx === null ||
           rowKey === null)) {
        errSummary = this._LOGGER_MSG._ERR_CURRENTROW_UNAVAILABLE_INDEX_SUMMARY;
        errDetail = Translations.applyParameters(
            this._LOGGER_MSG._ERR_CURRENTROW_UNAVAILABLE_INDEX_DETAIL, { rowIdx: rowIdx });
        if (optionChange) {
          // Only throw an Error if the current row was set through option change
          // so that the caller can be notified of the invalid row.
          throw new Error(errSummary + '\n' + errDetail);
        } else {
          Logger.info(errSummary + '\n' + errDetail);
        }
        // do not update the currentRow
        return this._CURRENT_ROW_STATUS._IGNORED;
      }

      var currentFocusedRowIdx = this._getFocusedRowIdx();
      var currentRowChanged = !oj.Object.compareValues(this._currentRow, currentRow);

      if (currentRowChanged) {
        try {
          updateCurrentRow = this._trigger('beforeCurrentRow', event, {
            currentRow: {
              rowIndex: rowIndex,
              rowKey: rowKey
            },
            previousCurrentRow: this._currentRow });
        } catch (err) {
          // caught an error. Do not change current row
          errSummary = this._LOGGER_MSG._ERR_PRECURRENTROW_ERROR_SUMMARY;
          errDetail = Translations.applyParameters(
            this._LOGGER_MSG._ERR_PRECURRENTROW_ERROR_DETAIL, { error: err.toString() });
          Logger.info(errSummary + '\n' + errDetail);
          // do not update the currentRow to the new value if an exception was caught
          return this._CURRENT_ROW_STATUS._ERROR;
        }

        if (!updateCurrentRow) {
          // do not update the currentRow to the new value if a listener returned false
          return this._CURRENT_ROW_STATUS._VETOED;
        }

        this._currentRow = { rowIndex: rowIndex, rowKey: rowKey };

        if (existingCurrentRow != null) {
          existingCurrentRowIndex = existingCurrentRow.rowIndex;
          existingCurrentRowKey = this._getRowKeyForDataSourceRowIndex(existingCurrentRowIndex);
          existingCurrentRowIdx = this._getRowIdxForRowKey(existingCurrentRowKey);
        }

        updateEditable = this._setTableEditable(false, false, 0, true, event);

        if (updateEditable === false) {
          this._currentRow = existingCurrentRow;
          currentFocusElement = document.activeElement;
          columnIdx = this._getTableDomUtils().getElementColumnIdx(currentFocusElement);
          this._queueTask(function () {
            var focusRowIdx = existingCurrentRowIdx;
            var focusColumnIdx = columnIdx;
            if (focusRowIdx != null &&
                  focusColumnIdx != null) {
              setTimeout(function () {
                self._setCellFocus(focusRowIdx, focusColumnIdx);
              }, 0);
            } else if (focusRowIdx != null) {
              setTimeout(function () {
                self._setRowFocus(focusRowIdx, true, false, null, null);
              }, 0);
            }
          });

          // do not update the currentRow to the new value if updateEditable returned false
          return this._CURRENT_ROW_STATUS._IGNORED;
        }

        this.option('currentRow', this._currentRow, {
          _context: {
            writeback: true,
            originalEvent: event,
            internalSet: true
          }
        });
        tableBodyRow = this._getTableDomUtils().getTableBodyRow(rowIdx);

        if (tableBodyRow != null) {
          tableBodyRow.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CURRENT_ROW_CLASS);
        }
        if (existingCurrentRow != null) {
          tableBodyRow = this._getTableDomUtils().getTableBodyRow(existingCurrentRowIdx);

          if (tableBodyRow != null) {
            tableBodyRow.classList.remove(
              oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CURRENT_ROW_CLASS);
          }
        }
      }

      if (currentRowChanged || currentFocusedRowIdx !== currentRow.rowIndex) {
        if (event == null) {
          this._setRowFocus(rowIdx, true, false, null, event);
        }
      }
      return this._CURRENT_ROW_STATUS._UPDATED;
    },

    /**
     * Sets a row to be editable
     * @private
     */
    _setEditRow: function (editRow) {
      if (!this._isTableEditMode()) {
        return;
      }

      var rowKey = editRow.rowKey;
      var rowIndex = editRow.rowIndex;
      if (rowKey != null || rowIndex > -1) {
        // an editable row has to be current also
        var changed = this._setCurrentRow({ rowKey: rowKey, rowIndex: rowIndex }, null, false);
        if (changed === this._CURRENT_ROW_STATUS._UPDATED) {
          this._setTableEditable(true, false, 0, true, null);
        } else if (changed === this._CURRENT_ROW_STATUS._IGNORED) {
          // try to scroll to it
          var _scrollTop = this._scrollTop;
          if (!this._syncScrollPosition({ rowKey: rowKey, rowIndex: rowIndex })) {
            var self = this;
            // this will be invoked after scroll and fetch is done
            this._editRowCallback = function () {
              // try again after scroll and fetch
              if (self._scrollTop !== _scrollTop) {
                self._setEditRow(editRow);
              }
            };
          }
        }
      } else {
        this._setTableEditable(false, false, 0, true, null);
      }
    },

    /**
     * Set waiting state and show the Fetching Data... status message.
     * @private
     */
    _setDataWaitingState: function (showMessage) {
      if (showMessage !== false) {
        this._showStatusMessage();
        this._hideNoDataMessage();
      }
      this._dataFetching = true;
      if (!this._dataResolveFunc) {
        this._dataResolveFunc = this._addComponentBusyState('is waiting for data.');
      }
    },

    /**
     * Set focus on a cell
     * @param {number} rowIdx  row index
     * @param {number} columnIdx  column index
     * @return {boolean} whether setting the cell focus was successful
     * @private
     */
    _setCellFocus: function (rowIdx, columnIdx) {
      var domUtils = this._getTableDomUtils();
      var tableBodyCell = domUtils.getTableBodyCell(rowIdx, columnIdx);
      if (tableBodyCell) {
        var elements = DataCollectionUtils.getFocusableElementsInNode(tableBodyCell);
        if (elements.length > 0) {
          elements[0].focus();
          return true;
        }
      }
      return false;
    },

    /**
     * Try setting focus in the cell. If unsuccesful, set focus on the first focusable cell in the row
     * if forwardSearch is true. Else try from the last cell in the row.
     * @param {number} rowIdx  row index
     * @param {number} columnIdx  column index
     * @param {boolean} forwardSearch try setting focus starting at the first column
     * @private
     */
    _setCellInRowFocus: function (rowIdx, columnIdx, forwardSearch) {
      if (this._setCellFocus(rowIdx, columnIdx)) {
        return;
      }

      var tableBodyCells = this._getTableDomUtils().getTableBodyCells(rowIdx);

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
    },

    /**
     * Called by component to declare rendering is not finished. This method currently
     * handles the ready state for the component page level BusyContext
     * @private
     */
    _setComponentNotReady: function () {
      // For page level BusyContext
      // If we've already registered a busy state with the page's busy context, don't need to do anything further
      if (!this._readyResolveFunc) {
        this._readyResolveFunc = this._addComponentBusyState('is being loaded.');
      }
    },

    /**
     * Called by component to declare rendering is finished. This method currently
     * handles the page level BusyContext.
     * @private
     */
    _setComponentReady: function () {
      if (this._readyResolveFunc) {
        this._readyResolveFunc();
        this._readyResolveFunc = null;
      }
    },

    /**
     * Set the editable row index
     * @param {number} rowIdx  row index
     * @private
     */
    _setEditableRowIdx: function (rowIdx) {
      // store the rowKey so we can restore easily after sort
      this._editableRowKey = this._getRowKeyForRowIdx(rowIdx);
      this._editableRowIdx = rowIdx;
    },

    /**
     * Set the focus in handler
     * @param {Function} focusHandler focus in handler
     * @private
     */
    _setFocusInHandler: function (focusHandler) {
      this._focusInHandler = focusHandler;
    },

    /**
     * Set the focus out handler
     * @param {Function} focusHandler focus out handler
     * @private
     */
    _setFocusOutHandler: function (focusHandler) {
      this._focusOutHandler = focusHandler;
    },

    /**
     * Set focus on column header
     * @param {number} columnIdx  column index
     * @param {boolean} focused  whether it's focused
     * @private
     */
    _setHeaderColumnFocus: function (columnIdx, focused, skipScrollColumn) {
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
        }
        this._setHeaderColumnState(columnIdx, { focused: focused });
      }
    },

    /**
     * Derive the value of column selection (ranges) from selected column KeySet
     * @private
     */
    _getColumnSelectionFromKeySet: function (keySet) {
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
    },

    /**
     * Applies or removes the selection state to the specified column.
     * @param {number} index The column index.
     * @param {boolean} selected True if the selection state should be applied, false if it should be removed.
     * @private
     */
    _applyColumnSelection: function (columnIdx, selected) {
      this._setHeaderColumnState(columnIdx, { selected: selected });

      // update the acc checkbox
      var domUtils = this._getTableDomUtils();
      var accSelectionColumn = domUtils.getTableHeaderColumnAccSelect(columnIdx);
      if (accSelectionColumn) {
        var accSelectCheckbox = domUtils.getTableElementsByClassName(accSelectionColumn,
          oj.TableDomUtils.CSS_CLASSES._CHECKBOX_ACC_SELECT_COLUMN_CLASS)[0];
        accSelectCheckbox.checked = selected;
      }
    },

    /**
     * Set the state of the column header. e.g., focused, selected, etc.
     * @param {number} columnIdx  column index
     * @param {Object} state  Object which contains whether it's focused or selected
     * @private
     */
    _setHeaderColumnState: function (columnIdx, state) {
      var headerColumn = this._getTableDomUtils().getTableHeaderColumn(columnIdx);

      if (!headerColumn) {
        return;
      }
      this._applyHeaderColumnState(headerColumn, columnIdx, state);
    },

    /**
     * Set the state of the column header. e.g., focused, selected, etc.
     * @param {Element} headerColumn column DOM element
     * @param {number} columnIdx  column index
     * @param {Object} state  Object which contains whether it's focused or selected
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _applyHeaderColumnState: function (headerColumn, columnIdx, state) {
      var focused = state.focused;
      var selected = state.selected;

      if (selected != null) {
        var headerColumnSelected = headerColumn.classList.contains(
          oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);

        if (headerColumnSelected !== selected) {
          if (!selected) {
            headerColumn.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
          } else {
            headerColumn.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
          }
        }
      }
      // todo: can we optimize so that we don't look up the header element all the time with index?
      if (focused != null) {
        if (!focused) {
          this._focusOutHandler($(headerColumn));
        } else {
          this._focusInHandler($(headerColumn));
        }
      }
      this._updateHeaderColumnStateCellsClass(columnIdx);
    },

    /**
     * Set the last column which was selected (chronologically)
     * @param {number} columnIdx  column index
     * @param {boolean} selected  whether it's selected
     * @private
     */
    _setLastHeaderColumnSelection: function (columnIdx, selected) {
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
    },

    /**
     * Set the last row which was selected (chronologically)
     * @param {number} rowIdx  row index
     * @param {boolean} selected  whether it's selected
     * @private
     */
    _setLastRowSelection: function (rowIdx, selected) {
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
    },

    /**
     * Set the next row to editable
     * @param {number} columnIdx  column index
     * @param {Object} event
     * @throws {Error}
     * @private
     */
    _setNextRowEditable: function (columnIdx, event) {
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
      var rowCount = tableBodyRows != null ? tableBodyRows.length : 0;
      var editableRowIdx = this._getEditableRowIdx();
      var self = this;

      if (editableRowIdx >= 0 && editableRowIdx < rowCount - 1) {
        var updateEditable = this._setTableEditable(false, false, columnIdx, true, event);
        if (updateEditable === false) {
          this._queueTask(function () {
            setTimeout(function () {
              self._setCellFocus(editableRowIdx, columnIdx);
            }, 0);
          });
        } else {
          this._setCurrentRow({ rowIndex: editableRowIdx + 1 }, event, false);
          this._setTableEditable(true, false, columnIdx, true, event);
        }
      } else if (editableRowIdx === rowCount - 1) {
        this._setTableEditable(false, false, columnIdx, true, event);
        this._getTableDomUtils().getTable().focus();
      }
    },

    /**
     * Set the previous row to editable
     * @param {number} columnIdx  column index
     * @param {Object} event
     * @throws {Error}
     * @private
     */
    _setPreviousRowEditable: function (columnIdx, event) {
      var editableRowIdx = this._getEditableRowIdx();
      var self = this;

      if (editableRowIdx >= 1) {
        var updateEditable = this._setTableEditable(false, false, columnIdx, false, event);
        if (updateEditable === false) {
          this._queueTask(function () {
            setTimeout(function () {
              self._setCellFocus(editableRowIdx, columnIdx);
            }, 0);
          });
        } else {
          this._setCurrentRow({ rowIndex: editableRowIdx - 1 }, event, false);
          this._setTableEditable(true, false, columnIdx, false, event);
        }
      } else if (editableRowIdx === 0) {
        this._setTableEditable(false, false, columnIdx, false, event);
        this._getTableDomUtils().getTable().focus();
      }
    },

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
    _setRowFocus: function (rowIdx, focused, updateCurrentRow, element, event) {
      var focusedRowIdx;
      var updateRowFocus;

      if (rowIdx === -1) {
        if (updateCurrentRow) {
          updateRowFocus = this._setCurrentRow(null, event, false);

          if (updateRowFocus !== this._CURRENT_ROW_STATUS._UPDATED) {
            return false;
          }
        }
        focusedRowIdx = this._getFocusedRowIdx();
        if (focusedRowIdx != null) {
          this._setRowFocus(focusedRowIdx, false, updateCurrentRow, null, null);
        }
        return true;
      }
      var tableBodyRow = this._getTableDomUtils().getTableBodyRow(rowIdx);

      if (!tableBodyRow) {
        return false;
      }

      if (focused) {
        if (updateCurrentRow) {
          var rowKey = this._getRowKeyForRowIdx(rowIdx);
          updateRowFocus = this._setCurrentRow({ rowKey: rowKey }, event, false);

          if (updateRowFocus !== this._CURRENT_ROW_STATUS._UPDATED) {
            return false;
          }
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
    },

    /**
     * Derive the value of row selection (ranges) from selected row KeySet
     * @private
     */
    _getRowSelectionFromKeySet: function (keySet) {
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
    },

    /**
     * Applies or removes the selection state to the specified row.
     * @param {number} index The row index.
     * @param {Element} tableBodyRow The <tr> element of the row.
     * @param {boolean} selected True if the selection state should be applied, false if it should be removed.
     * @private
     */
    _applyRowSelection: function (rowIdx, tableBodyRow, selected) {
      var rowSelected = tableBodyRow.classList.contains(
        oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);

      if (rowSelected !== selected) {
        if (!selected) {
          tableBodyRow.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
        } else {
          tableBodyRow.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
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

      // update the acc checkbox
      var domUtils = this._getTableDomUtils();
      var accSelectionCell = domUtils.getTableBodyCellAccSelect(tableBodyRow);
      if (accSelectionCell) {
        var accSelectCheckbox = domUtils.getTableElementsByClassName(accSelectionCell,
          oj.TableDomUtils.CSS_CLASSES._CHECKBOX_ACC_SELECT_ROW_CLASS)[0];
        accSelectCheckbox.checked = selected;
      }
    },

    /**
     * Returns the index of the last fetched row in table.
     * @private
     */
    _getDataSourceLastFetchedRowIndex: function () {
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();

      if (tableBodyRows != null && tableBodyRows.length > 0) {
        var tableBodyRowsCount = tableBodyRows.length;

        var dataprovider = this._getData();
        var offset = 0;
        if (this._isPagingModelDataProvider()) {
          offset = dataprovider.getStartItemIndex();
        }
        return (tableBodyRowsCount + offset) - 1;
      }

      return 0;
    },

    /**
     * Process the selected rows defined in the range object.
     * @return {Object} returns an object that contains the following:
     *         status: true if the range is processed, false if the range is not processed, undefined if the range is partially processed.
     *         rowKeySet: updated KeySet for row.
     *         columnKeySet: updated KeySet for column.
     * @private
     */
    _processRowRangeSelection: function (rangeObj, rowKeySet, columnKeySet) {
      var startRowIndex;
      var endRowIndex;
      var startRowIdx;
      var endRowIdx;
      var startRowKey;
      var endRowKey;
      var status = true;

      // if keys are specified, we get the index from the key
      if (rangeObj.startKey != null && rangeObj.startKey[this._CONST_ROW] != null) {
        startRowKey = rangeObj.startKey[this._CONST_ROW];
        startRowIndex = this._getDataSourceRowIndexForRowKey(startRowKey);
        if (isNaN(startRowIndex)) {
          // start key is outside of range
          status = undefined;
        }
      } else if (rangeObj.startIndex != null && rangeObj.startIndex[this._CONST_ROW] != null) {
        startRowIndex = rangeObj.startIndex[this._CONST_ROW];
      }

      if (rangeObj.endKey != null && rangeObj.endKey[this._CONST_ROW] != null) {
        endRowKey = rangeObj.endKey[this._CONST_ROW];
        endRowIndex = this._getDataSourceRowIndexForRowKey(endRowKey);
        if (endRowIndex === null && this._isLoadMoreOnScroll()) {
          // we'll still need to process range selection next time
          endRowIndex = this._getDataSourceLastFetchedRowIndex();
          status = undefined;
        }
      } else if (rangeObj.endIndex != null && rangeObj.endIndex[this._CONST_ROW] != null) {
        endRowIndex = rangeObj.endIndex[this._CONST_ROW];
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
      } else {
        var j;
        if (startRowIndex != null && endRowIndex != null && startRowIndex <= endRowIndex) {
          // this is a row based selection
          startRowKey = this._getRowKeyForDataSourceRowIndex(startRowIndex);
          endRowKey = this._getRowKeyForDataSourceRowIndex(endRowIndex);
          startRowIdx = this._getRowIdxForRowKey(startRowKey);
          endRowIdx = this._getRowIdxForRowKey(endRowKey);
          for (j = startRowIdx; j <= endRowIdx; j++) {
            // update keySet
            var rowKey = this._getRowKeyForRowIdx(j);
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
      }

      return { status: status, rowKeySet: rowKeySet, columnKeySet: columnKeySet };
    },

    /**
     * Process the selected columns defined in the range object.
     * @return {Object} returns an object that contains the following:
     *         status: true if the range is processed, false if the range is not processed.
     *         rowKeySet: updated KeySet for row.
     *         columnKeySet: updated KeySet for column.
     * @private
     */
    _processColumnRangeSelection: function (rangeObj, rowKeySet, columnKeySet) {
      var startColumnKey;
      var endColumnKey;
      var startColumnIndex;
      var endColumnIndex;
      var status = true;

      if (rangeObj.startKey != null && rangeObj.startKey[this._CONST_COLUMN] != null) {
        startColumnKey = rangeObj.startKey[this._CONST_COLUMN];
        startColumnIndex = this._getColumnIdxForColumnKey(startColumnKey);
      } else if (rangeObj.startIndex != null && rangeObj.startIndex[this._CONST_COLUMN] != null) {
        startColumnIndex = rangeObj.startIndex[this._CONST_COLUMN];
      }

      if (rangeObj.endKey != null && rangeObj.endKey[this._CONST_COLUMN] != null) {
        endColumnKey = rangeObj.endKey[this._CONST_COLUMN];
        endColumnIndex = this._getColumnIdxForColumnKey(endColumnKey);
      } else if (rangeObj.endIndex != null && rangeObj.endIndex[this._CONST_COLUMN] != null) {
        endColumnIndex = rangeObj.endIndex[this._CONST_COLUMN];
      }

      if (startColumnIndex === undefined && endColumnIndex === undefined) {
        // column range wasn't specified
        status = false;
      } else if (startColumnIndex != null && endColumnIndex != null && !isNaN(startColumnIndex) &&
                 !isNaN(endColumnIndex) && startColumnIndex <= endColumnIndex) {
        // this is a column based selection
        for (var j = startColumnIndex; j <= endColumnIndex; j++) {
          // update keySet
          var columnKey = this._getColumnKeyForColumnIdx(j);
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
    },

    /**
     * Update the row/column index of each selection range
     * @private
     */
    _syncRangeSelection: function (selection) {
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
        if (rangeObj.startKey != null && rangeObj.startKey[this._CONST_ROW] != null) {
          startRowKey = rangeObj.startKey[this._CONST_ROW];
          startRowIndex = this._getDataSourceRowIndexForRowKey(startRowKey);
          rangeObj.startIndex = {};
          rangeObj.startIndex[this._CONST_ROW] = startRowIndex;
        } else if (rangeObj.startIndex != null && rangeObj.startIndex[this._CONST_ROW] != null) {
          startRowIndex = rangeObj.startIndex[this._CONST_ROW];
          startRowKey = this._getRowKeyForDataSourceRowIndex(startRowIndex);
          if (startRowKey != null) {
            rangeObj.startKey = {};
            rangeObj.startKey[this._CONST_ROW] = startRowKey;
          }
        }

        var endRowKey;
        var endRowIndex;
        if (rangeObj.endKey != null && rangeObj.endKey[this._CONST_ROW] != null) {
          endRowKey = rangeObj.endKey[this._CONST_ROW];
          endRowIndex = this._getDataSourceRowIndexForRowKey(endRowKey);
          rangeObj.endIndex = {};
          rangeObj.endIndex[this._CONST_ROW] = endRowIndex;
        } else if (rangeObj.endIndex != null && rangeObj.endIndex[this._CONST_ROW] != null) {
          endRowIndex = rangeObj.endIndex[this._CONST_ROW];
          endRowKey = this._getRowKeyForDataSourceRowIndex(endRowIndex);
          if (endRowKey != null) {
            rangeObj.endKey = {};
            rangeObj.endKey[this._CONST_ROW] = endRowKey;
          }
        }
      }
    },

    /**
     * @private
     */
    _getSelectedEquivalent: function (selection) {
      var selected;
      if (selection != null) {
        selected = { row: new oj.KeySetImpl(), column: new oj.KeySetImpl() };
        var rowKeySet = selected.row;
        var columnKeySet = selected.column;

        var selectionCount = selection.length;
        for (var i = 0; i < selectionCount; i++) {
          var rangeObj = selection[i];

          if ((rangeObj.startKey == null && rangeObj[this._CONST_STARTINDEX] == null) ||
              (rangeObj.endKey == null && rangeObj[this._CONST_ENDINDEX] == null)) {
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
    },

    /**
     * Applies the 'selected' state on the Table
     * @param {Object} selected The selected state.
     * @private
     */
    _applySelected: function (selected) {
      var domUtils = this._getTableDomUtils();
      var rowKeySet = selected.row;
      var columnKeySet = selected.column;

      // remove selection state from previously selected rows that are no longer selected
      var prevSelectedRows = this._getSelectedRowIdxs();
      prevSelectedRows.forEach(function (rowIndex) {
        var row = domUtils.getTableBodyRow(rowIndex);
        if (!rowKeySet.has(this._getRowKey(row))) {
          this._applyRowSelection(rowIndex, row, false);
        }
      }, this);

      if (this._isRowSelectionEnabled()) {
        // apply selection state to selected rows
        if (rowKeySet.isAddAll()) {
          var rows = domUtils.getTableBodyRows();
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
              this._applyRowSelection(index, domUtils.getTableBodyRow(index), true);
            }
          }, this);
        }
      }

      // cleanup touch selection affordance if present
      var currentSelectedRows = this._getSelectedRowIdxs();
      if (currentSelectedRows.length === 0) {
        this._getTableDomUtils().removeTableBodyRowTouchSelectionAffordance();
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
          var headers = domUtils.getTableHeaderColumns();
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
    },

    /**
     * Sets selected keyset
     * @param {Object} selected
     * @param {boolean=} skipSelectionUpdate
     * @private
     */
    _setSelected: function (selected, skipSelectionUpdate) {
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
        } else if (currentSelected.row !== selected.row ||
                    currentSelected.column !== selected.column) {
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
        this._applySelected(selected);

        // update firstSelectedRow option
        var newKey = null;
        var rowSelection = this._getRowSelectionFromKeySet(selected.row);
        if (rowSelection != null && rowSelection.length > 0) {
          var range = rowSelection[0];
          if (range.startKey != null) {
            newKey = range.startKey[this._CONST_ROW];
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
    },

    /**
     * @private
     */
    _setFirstSelectedRow: function (newKey) {
      // only update the firstSelectedRow option if it has changed
      var currentFirstSelectedRow = this.option('firstSelectedRow');
      if (!oj.KeyUtils.equals(newKey, currentFirstSelectedRow.key)) {
        var newData = null;
        if (newKey != null) {
          var row = this.getDataForVisibleRow(this._getRowIdxForRowKey(newKey));
          if (row != null) {
            newData = row[this._CONST_DATA];
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

        this.option('firstSelectedRow', {
          key: newKey,
          data: newData
        }, {
          _context: {
            writeback: true,
            internalSet: true
          }
        });
      }
    },

    /**
     * @private
     */
    _syncSelectionState: function () {
      var selected = this.option('selected');
      var selection = this.option('selection');

      // generate new selected value from existing selection value if required
      if (this._selectionSet) {
        // recreate 'selected' option in case selection ranges need to be applied
        selected = this._getSelectedEquivalent(selection);
        // update row index/key values in the 'selection' option
        this._syncRangeSelection();
      }
      // set selection state
      this._setSelected(selected, this._selectionSet);
    },

    /**
     * @param {boolean=} isOptionUpdate
     * @private
     */
    _validateInitialSelectionState: function (isOptionUpdate) {
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
    },

    /**
     * @private
     */
    _enforceSelectionRequired: function (selected, validSelected, useSelection) {
      if (useSelection) {
        if (this._hasSelected(validSelected)) {
          if (validSelected.row === selected.row &&
              validSelected.column === selected.column) {
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
    },

    /**
     * @private
     */
    _handleSelectionGesture: function (index, isRow, isMultiSelectGesture) {
      var selected = this.option('selected');
      var rowKeySet = selected.row;
      var columnKeySet = selected.column;
      if (isRow) {
        columnKeySet = columnKeySet.clear();
        if (this._isRowSelectionEnabled()) {
          var rowKey = this._getRowKeyForRowIdx(index);
          if (!rowKeySet.has(rowKey)) {
            // handle multiple selection gesture
            if (isMultiSelectGesture &&
                this._getRowSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE) {
              // add row to the existing selection
              rowKeySet = rowKeySet.add([rowKey]);
            } else {
              // selection is now the new row key
              rowKeySet = new oj.KeySetImpl([rowKey]);
            }
          } else if (!isMultiSelectGesture && this._getSelectedRowIdxs().length > 1 &&
                     this._getRowSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE) {
            // selection is now the new row key
            rowKeySet = new oj.KeySetImpl([rowKey]);
          } else {
            // remove row from the existing selection
            rowKeySet = rowKeySet.delete([rowKey]);
          }
        }
      } else {
        rowKeySet = rowKeySet.clear();
        if (this._isColumnSelectionEnabled()) {
          var columnKey = this._getColumnKeyForColumnIdx(index);
          if (!columnKeySet.has(columnKey)) {
            // handle multiple selection gesture
            if (isMultiSelectGesture &&
                this._getColumnSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE) {
              // add column to the existing selection
              columnKeySet = columnKeySet.add([columnKey]);
            } else {
              // selection is now the new column key
              columnKeySet = new oj.KeySetImpl([columnKey]);
            }
          } else if (!isMultiSelectGesture && this._getSelectedHeaderColumnIdxs().length > 1 &&
            this._getColumnSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE) {
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
    },

    /**
     * @param {Object=} selected
     * @private
     */
    _hasSelected: function (selected) {
      if (selected == null) {
        // eslint-disable-next-line no-param-reassign
        selected = this.option('selected');
      }
      var rowKeySet = selected.row;
      var columnKeySet = selected.column;
      return (rowKeySet.isAddAll() || rowKeySet.values().size > 0 ||
              columnKeySet.isAddAll() || columnKeySet.values().size > 0);
    },

    /**
     * @param {Object} selected
     * @private
     */
    _isSelectionRequiredSatisfied: function (selected) {
      if (this._isSelectionRequired()) {
        return this._hasSelected(selected);
      }
      return true;
    },

    _isSelectionRequired: function () {
      return ((String(this.options.selectionRequired)).toLowerCase() === 'true');
    },

    /**
     * @param {Object} selected
     * @private
     */
    _validateSelected: function (selected) {
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
            var validateSelectedPromise = new Promise(function (resolve) {
              validRowKeyDataPromise.then(function (validRowKeyData) {
                // save validatedSelectedRowKeyData for 'firstSelectedRow' updates
                this._validatedSelectedRowKeyData = validRowKeyData;
                validRowKeyData.forEach(function (rowKeyData) {
                  invalidLocalRowKeys.splice(invalidLocalRowKeys.indexOf(rowKeyData.key), 1);
                });
                validatedRowKeySet = validatedRowKeySet.delete(invalidLocalRowKeys);
                resolve({ row: validatedRowKeySet, column: validatedColumnKeySet });
              }.bind(this));
            }.bind(this));
            return { isLocal: false, result: validateSelectedPromise };
          }
          validatedRowKeySet = validatedRowKeySet.delete(invalidLocalRowKeys);
        }
      }
      return { isLocal: true, result: { row: validatedRowKeySet, column: validatedColumnKeySet } };
    },

    /**
     * Validate keys in selected
     * @private
     */
    _fetchValidRowKeyData: function (keys) {
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
    },

    /**
     * @private
     */
    _selectFirstRowOrColumn: function () {
      var newKeySet;
      if (this._isRowSelectionEnabled() || !this._isColumnSelectionEnabled()) {
        newKeySet = new oj.KeySetImpl([this._getRowKeyForRowIdx(0)]);
        this._setSelected({ row: newKeySet, column: new oj.KeySetImpl() });
      } else {
        newKeySet = new oj.KeySetImpl([this._getColumnKeyForColumnIdx(0)]);
        this._setSelected({ row: new oj.KeySetImpl(), column: newKeySet });
      }
    },

    /**
     * @private
     */
    _getSelectionEquivalent: function (selected) {
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
    },

    /**
     * Toggles table actionable mode
     * @private
     */
    _toggleTableActionableMode: function () {
      if (this._isTableActionableMode()) {
        this._setTableActionableMode(false);
      } else {
        this._setTableActionableMode(true);
      }
    },

    /**
     * Set whether the component is in table actionable mode
     * @param {boolean} value true or false
     * @param {boolean=} skipFocusReset whether to skip resetting focus on the table
     * @private
     */
    _setTableActionableMode: function (value, skipFocusReset) {
      // don't do anything if actionable mode was not updated
      if ((this._tableActionableMode != null && this._tableActionableMode === value) ||
          (this._tableActionableMode == null && value === false)) {
        return;
      }

      if (value) {
        var focusedElement = null;
        var focusedRowIdx = this._getFocusedRowIdx();
        if (focusedRowIdx != null) {
          focusedElement = this._getTableDomUtils().getTableBodyRow(focusedRowIdx);
        }
        if (focusedElement == null) {
          var focusedHeaderColumnIdx = this._getFocusedHeaderColumnIdx();
          if (focusedHeaderColumnIdx != null) {
            focusedElement = this._getTableDomUtils().getTableHeaderColumn(focusedHeaderColumnIdx);
          }
        }
        if (focusedElement != null) {
          // enable all focusable elements
          DataCollectionUtils.enableAllFocusableElements(focusedElement);
          var tabbableElementsInFocusedElement = this._getTabbableElements(focusedElement);

          // only set actionable mode if there are any tabbable elements in the row
          if (tabbableElementsInFocusedElement != null &&
              tabbableElementsInFocusedElement.length > 0) {
            this._tableActionableMode = value;
            this._tableActionableElement = focusedElement;
            // set focus on the first tabbable element
            tabbableElementsInFocusedElement[0].focus();
          }
        }
      } else {
        this._tableActionableMode = false;
        if (this._isTableEditMode()) {
          this._tableActionableElement = null;
        } else {
          var tableBody = this._getTableDomUtils().getTableBody();
          var resetFocus = $.contains(tableBody, document.activeElement);

          // disable all focusable elements
          if (this._tableActionableElement != null) {
            DataCollectionUtils.disableAllFocusableElements(this._tableActionableElement);
            this._tableActionableElement = null;
          }
          if (resetFocus && !skipFocusReset) {
            this._getTableDomUtils().getTable().focus();
          }
        }
      }
    },

    /**
     * Fire editRow property change event
     * @private
     */
    _fireEditRowChangeEvent: function (newValue, event) {
      var self = this;
      // use _queueTask as _isSettingProperty is preventing writeback
      // as we are updating editRow option which is triggered by application updating it
      this._queueTask(function () {
        self.option('editRow', newValue, {
          _context: {
            originalEvent: event,
            internalSet: true,
            writeback: true,
          }
        });
      });
    },

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
    _setTableEditable: function (editable, cancelled, columnIdx, forwardSearch, event,
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
            tableBodyRow = this._getTableDomUtils().getTableBodyRow(rowIdx);
            rowContext = oj.TableRendererUtils.getRendererContextObject(this, tableBodyRow, {
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
            tableBodyRow = this._getTableDomUtils().getTableBodyRow(this._getEditableRowIdx());
            rowKey = this._getRowKeyForRowIdx(this._getEditableRowIdx());
            rowContext = oj.TableRendererUtils.getRendererContextObject(this, tableBodyRow, {
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
        var self = this;

        if (editable) {
          // set the editable row index
          this._setEditableRowIdx(rowIdx);
          // re-render the newly editable row

          this._refreshRow(rowIdx, true).then(function () {
            self._queueTask(function () {
              // set focus on the column in the row
              self._setRowFocus(rowIdx, true, false);
              self._setCellInRowFocus(rowIdx, columnIdx, forwardSearch);
            });
          });
        } else {
          this._focusEditCell = null;
          this._setEditableRowIdx(null);
          if (!skipFocusReset) {
            this._getTableDomUtils().getTable().focus();
          }
        }

        // clear out the old editable row
        if (prevEditableRowIdx != null) {
          // make sure the row still exists before we refresh it
          var prevEditableTableBodyRow =
              this._getTableDomUtils().getTableBodyRow(prevEditableRowIdx);
          if (prevEditableTableBodyRow != null) {
            // re-render the previously editable row, which will be read-only now
            this._refreshRow(prevEditableRowIdx, false);
          }
        }
      }
      return undefined;
    },

    /**
     * Show the 'No data to display.' or 'Initializing...' message.
     * @private
     */
    _showNoDataMessage: function () {
      if (!this._noDataMessageShown) {
        var messageRow = this._getTableDomUtils().getTableBodyMessageRow();
        var dataprovider = this._getData();
        var emptyTextMsg = null;
        if (this.options.emptyText != null) {
          emptyTextMsg = this.options.emptyText;
        } else {
          emptyTextMsg = this.getTranslatedString(this._BUNDLE_KEY._MSG_NO_DATA);
        }
        // if data is null then we are initializing
        var messageText = dataprovider != null ?
            emptyTextMsg : this.getTranslatedString(this._BUNDLE_KEY._MSG_INITIALIZING);
        if (messageRow == null) {
          this._getTableDomUtils().createTableBodyMessageRow(this._getColumnDefs().length,
                                                             messageText);
        } else {
          this._getTableDomUtils().setTableBodyMessage(messageText);
        }
        this._noDataMessageShown = true;
      }
    },

    /**
     * Show the Fetching Data... status message.
     * @private
     */
    _showStatusMessage: function () {
      if (this._showStatusTimeout) {
        return;
      }

      if (!this._statusMessageShown) {
        var statusMessage = this._getTableDomUtils().getTableStatusMessage();
        var self = this;
        this._showStatusTimeout = setTimeout(function () {
          statusMessage.style[oj.TableDomUtils.CSS_PROP._DISPLAY] =
            oj.TableDomUtils.CSS_VAL._INLINE;
          self._statusMessageShown = true;
          self._getTableDomUtils().refreshTableStatusPosition();
        }, this._getShowStatusDelay());
      }
    },

    /**
     * Retrieve the delay before showing status
     * @return {number} the delay in ms
     * @private
     */
    _getShowStatusDelay: function () {
      if (this._defaultOptions == null) {
        this._defaultOptions = ThemeUtils.parseJSONFromFontFamily('oj-table-option-defaults');
      }
      var delay = parseInt(this._defaultOptions.showIndicatorDelay, 10);

      return isNaN(delay) ? 0 : delay;
    },

    /**
     * Show the column header sort icon
     * @param {number} columnIdx  column index
     * @private
     */
    _showTableHeaderColumnSortIcon: function (columnIdx) {
      if (this._getColumnDefs()[columnIdx].sortable === this._OPTION_ENABLED) {
        var domUtils = this._getTableDomUtils();
        var tableHeaderColumn = domUtils.getTableHeaderColumn(columnIdx);

        if (!tableHeaderColumn) {
          return;
        }

        // check if the column is currently sorted
        var sorted = $(tableHeaderColumn).data('sorted');

        // we should only show the ascending sort icon if the column is not sorted

        if (sorted == null) {
          var headerColumnAscIcon = domUtils.getTableElementsByClassName(tableHeaderColumn,
            oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
          var sortContainer = domUtils.getSortIconContainer(tableHeaderColumn);
          if (sortContainer != null && headerColumnAscIcon.length > 0) {
            headerColumnAscIcon = headerColumnAscIcon[0];
            sortContainer.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._ENABLED);
            headerColumnAscIcon.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._DISABLED);
            headerColumnAscIcon.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._DEFAULT);
          }
        }
      }
    },

      /**
       * Only process the event handler if it's a double tap
       * @param {Event} event
       * @param {Function} eventHandler
       * @private
       */
    _touchEventDoubleTapFunction: function (event, eventHandler) {
      var eventTarget = $(event.target);

      if (this._lastTapTime != null &&
          ((new Date()).getTime() - this._lastTapTime) < 250 &&
          this._lastTapTarget[0] === eventTarget[0]) {
        this._lastTapTime = null;
        this._lastTapTarget = null;
        eventHandler();
      } else {
        this._lastTapTarget = eventTarget;
        this._lastTapTime = (new Date()).getTime();
      }
    },

    /**
     * Unregister _focusable(), etc, which were added to the child elements
     * @param {Element} parent div DOM element
     * @private
     */
    _unregisterChildStateListeners: function (parent) {
      var self = this;
      var elements = parent.querySelectorAll('*');
      var i;
      for (i = 0; i < elements.length; i++) {
        self._UnregisterChildNode(elements[i]);
      }
      self = null;
    },

    /**
     * Unregister event listeners which are registered on datasource.
     * @private
     */
    _unregisterDataSourceEventListeners: function () {
      var dataprovider = this._getData();
      // unregister the listeners on the datasource
      if (this._dataProviderEventHandlers != null && dataprovider != null) {
        var dataProviderEventHandlersCount = this._dataProviderEventHandlers.length;
        for (var i = 0; i < dataProviderEventHandlersCount; i++) {
          dataprovider.removeEventListener(this._dataProviderEventHandlers[i].eventType,
                                           this._dataProviderEventHandlers[i].eventHandler);
        }
      }
    },

    /**
     * Unregister event listeners for resize the container DOM element.
     * @private
     */
    _unregisterResizeListener: function () {
      var element = this._getTableDomUtils().getTableContainer();
      oj.DomUtils.removeResizeListener(element, this._resizeListener);
      this._isResizeListenerAdded = false;
    },

    /**
     * Update the css class from all the cells in a column according to column state
     * @param {number} columnIdx  column index
     * @param {boolean} blur  true or false
     * @private
     */
    _updateHeaderColumnStateCellsClass: function (columnIdx) {
      var selected = this._getHeaderColumnSelection(columnIdx);
      var selectedRowIdxs = this._getSelectedRowIdxs();
      var tableBodyRows = this._getTableDomUtils().getTableBodyRows();
      if (tableBodyRows != null && tableBodyRows.length > 0) {
        var tableBodyRowsCount = tableBodyRows.length;
        for (var i = 0; i < tableBodyRowsCount; i++) {
          var tableBodyCell = this._getTableDomUtils().getTableBodyCell(i, columnIdx);
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
                tableBodyCell.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
              }
            } else {
              tableBodyCell.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
            }
          }
        }
      }
    },

    /**
     * Update the css class from all the cells in a row according to row state
     * @param {number} rowIdx  row index
     * @param {Object} state  row state
     * @param {boolean} blur  true or false
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _updateRowStateCellsClass: function (rowIdx, state, blur) {
      var tableBodyCells = this._getTableDomUtils().getTableBodyCells(rowIdx);
      var focused = state.focused;
      var selected = state.selected;
      var hover = state.hover;
      var i;

      if (!tableBodyCells) {
        return;
      }

      var tableBodyCellsCount = tableBodyCells.length;

      if (hover != null) {
        for (i = 0; i < tableBodyCellsCount; i++) {
          if (!hover) {
            tableBodyCells[i].classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._HOVER);
          } else {
            tableBodyCells[i].classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._HOVER);
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
            tableBodyCells[i].classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
          } else {
            tableBodyCells[i].classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._SELECTED);
          }
        }
      }
    },

    /**
     * Waits for any children components of the given rows to finish rendering.
     * Disables any and all focusable elements within those rows if not editable.
     * @param {Array<Element>} rowElements the row elements to finalize
     * @returns {Promise}
     * @private
     */
    _finalizeRowRendering: function (rowElements) {
      return this._waitForAllElementsToResolve(rowElements).then(function () {
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
    },

    /**
     * Returns a Promise which resolves when all JET elements in the array have resolved
     * @param {Array<Element>} elements Array of DOM elements
     * @return {Promise} Promise which resolves when all child JET elements have resolved
     * @private
     */
    _waitForAllElementsToResolve: function (elements) {
      // Only bother checking if there are templates/renderers defined. If not,
      // JET elements can't be embedded in the cells so we can skip the check
      if (elements.length > 0 && this._hasRowOrCellRendererOrTemplate()) {
        var busyContextPromiseArray = [];

        elements.forEach(function (element) {
          // Only wait on busyContext of non-null row elements. Othwerise, busy state lock can occur
          if (element) {
            busyContextPromiseArray.push(Context.getContext(element).getBusyContext().whenReady());
          }
        });
        return Promise.all(busyContextPromiseArray);
      }
      return Promise.resolve();
    },

    _setFinalTask: function (task) {
      this._finalTask = (task ? task.bind(this) : undefined);
    },

    _hasPendingTasks: function () {
      return this._taskCount > 1;
    },

    _queueTask: function (task) {
      var self = this;
      if (!this._pendingTasks) {
        this._taskCount = 0;
        this._pendingTasks = Promise.resolve();
        this._setComponentNotReady();
      }
      this._taskCount += 1;
      this._pendingTasks = this._pendingTasks.then(function () {
        if (!self._componentDestroyed) {
          return task.bind(self)();
        }
        return undefined;
      }).then(function (value) {
        self._taskCount -= 1;
        if (self._taskCount === 0) {
          self._pendingTasks = undefined;
          try {
            if (!self._componentDestroyed) {
              if (self._finalTask) {
                self._finalTask();
              }
              self._trigger('ready');
            }
          } catch (err) {
            Logger.error(err);
          }
          // Need to remove busy state even if the component is destroyed
          self._setComponentReady();
          self = null;
        }
        return value;
      }, function (error) {
        self._taskCount -= 1;
        if (self._taskCount === 0) {
          self._pendingTasks = undefined;
          Logger.error(error);
          self._setComponentReady();
          self = null;
        }

        return Promise.reject(error);
      });

      return this._pendingTasks;
    },

    // @inheritdoc
    _CompareOptionValues: function (option, value1, value2) {
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
    },

    /**
     * @private
     */
    _registerTouchEvents: function () {
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
          if (this._getTableResizeUtils().handleHeaderColumnResizeEnd(event)) {
            event.preventDefault();
          }
        },

        /*
         * Keep track of touchend for edit
         */
        'touchend .oj-table-body': function (evt) {
          var self = this;
          this._touchEventDoubleTapFunction(evt, (function (event) {
            return function () {
              var eventTarget = self._getEventTargetElement(event);
              var columnIdx = self._getTableDomUtils().getElementColumnIdx(eventTarget);
              self._setTableEditable(true, false, columnIdx, true, event);
              event.preventDefault();
            };
          }(evt)));
        },

        /*
         * Keep track of touchcancel for multiple selection
         */
        touchcancel: function () {
          this._mouseDownRowIdx = null;
          this._getTableResizeUtils().clearTableHeaderColumnsResize();
        }
      };

      const passiveTouchEventsAndListeners = {

        /*
         * Keep track of touchstart on selection affordance
         */
        'touchstart .oj-table-body-row-touch-selection-affordance-touch-area': function (event) {
          var fingerCount = event.originalEvent.touches.length;

          if (fingerCount === 1 &&
              this._getRowSelectionMode() === this._OPTION_SELECTION_MODES._MULTIPLE) {
            if (event.target.classList.contains(
              oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_CLASS) ||
                event.target.classList.contains(
                  oj.TableDomUtils.CSS_CLASSES
                    ._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_ICON_CLASS)) {
              event.preventDefault();
              this._mouseDownRowIdx =
                $(this._getTableDomUtils()
                  .getTableBodyRowTouchSelectionAffordanceBottom()).data('rowIdx');
            } else if (event.target.classList.contains(
            oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_CLASS) ||
                       event.target.classList.contains(
                         oj.TableDomUtils.CSS_CLASSES
                           ._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_ICON_CLASS)) {
              event.preventDefault();
              this._mouseDownRowIdx =
                $(this._getTableDomUtils()
                  .getTableBodyRowTouchSelectionAffordanceTop()).data('rowIdx');
            }
          }
        },

        /*
         * column resizing
         */
        'touchstart .oj-table-column-header-cell': function (event) {
          var fingerCount = event.originalEvent.touches.length;

          if (fingerCount === 1) {
            if (this._isTableColumnsResizable() &&
                this._getTableResizeUtils().handleHeaderColumnResizeStart(event)) {
              event.preventDefault();
            }
          }
        },

        /*
         * Keep track of touchmove for column resize
         */
        'touchmove .oj-table-header': function (event) {
          if (this._isTableColumnsResizable()) {
            this._getTableResizeUtils().setResizeCursor(event);
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

      const tableContainer = this._getTableDomUtils().getTableContainer();

      // register regular touch events
      this._on($(tableContainer), regularTouchEventsAndListeners);

      // register touchstart & touchmove with passive option for custom elements
      if (this._IsCustomElement()) {
        const createDelegatedListener = function (selector, listener) {
          return function (event) {
            const container = event.currentTarget;
            const targetElement = event.target.closest(selector);
            if (targetElement && container.contains(targetElement)) {
              listener($.Event(event, {
                currentTarget: targetElement
              }));
            }
          };
        };

        const TOUCHSTART = 'touchstart';
        const TOUCHMOVE = 'touchmove';
        const TABLE_BODY_SELECTOR = '.oj-table-body-row-touch-selection-affordance-touch-area';
        const TOUCHSTART_CELL_HEADER_SELECTOR = '.oj-table-column-header-cell';
        const TOUCHMOVE_TABLE_HEADER_SELECTOR = '.oj-table-header';

        this._delegatedTouchStartTableBodyListener = createDelegatedListener(
          TABLE_BODY_SELECTOR,
          passiveTouchEventsAndListeners[`${TOUCHSTART} ${TABLE_BODY_SELECTOR}`].bind(this)
        );

        this._delegatedTouchStartCellHeaderListener = createDelegatedListener(
          TOUCHSTART_CELL_HEADER_SELECTOR,
          passiveTouchEventsAndListeners[`${TOUCHSTART} ${TOUCHSTART_CELL_HEADER_SELECTOR}`].bind(this)
        );

        this._delegatedTouchMoveTableHeaderListener = createDelegatedListener(
          TOUCHMOVE_TABLE_HEADER_SELECTOR,
          passiveTouchEventsAndListeners[`${TOUCHMOVE} ${TOUCHMOVE_TABLE_HEADER_SELECTOR}`].bind(this)
        );

        this._delegatedTouchMoveTableBodyListener = createDelegatedListener(
          TABLE_BODY_SELECTOR,
          passiveTouchEventsAndListeners[`${TOUCHMOVE} ${TABLE_BODY_SELECTOR}`].bind(this)
        );

        tableContainer.addEventListener(
          TOUCHSTART,
          this._delegatedTouchStartTableBodyListener,
          { passive: false }
        );
        tableContainer.addEventListener(
          TOUCHSTART,
          this._delegatedTouchStartCellHeaderListener,
          { passive: false }
        );
        tableContainer.addEventListener(
          TOUCHMOVE,
          this._delegatedTouchMoveTableHeaderListener,
          { passive: true }
        );
        tableContainer.addEventListener(
          TOUCHMOVE,
          this._delegatedTouchMoveTableBodyListener,
          { passive: false }
        );
      } else {
        this._on($(tableContainer), passiveTouchEventsAndListeners);
      }
    }

    /* Later when needed
       _whenReady: function()
       {
       if (this._pendingTasks)
       {
       return this._pendingTasks;
       }
       return Promise.resolve();
       }
    */
    /** ** end internal functions ****/
  });
}());

Components.setDefaultOptions({
  ojTable: {
    display: Components.createDynamicPropertyGetter(function () {
      return (ThemeUtils.parseJSONFromFontFamily('oj-table-option-defaults') || {}).display;
    })
  }
}
                               );



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* global Promise:false, ThemeUtils:false */
/* jslint browser: true,devel:true*/

/**
 * @ignore
 * @export
 * @class oj.TableAnimationUtils
 * @classdesc Animation Utils for ojTable
 * @param {jQuery=} component ojTable instance
 * @constructor
 */
oj.TableAnimationUtils = function (component) {
  this.component = component;
  this.options = component.options;
  this.Init();
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.TableAnimationUtils, oj.Object, 'oj.TableAnimationUtils');

/**
 * Initializes the instance.
 * @export
 * @memberof oj.TableAnimationUtils
 */
oj.TableAnimationUtils.prototype.Init = function () {
  oj.TableAnimationUtils.superclass.Init.call(this);
};

/**
 * Animate a tableBodyRow
 * @param {Element} tableBodyRow  DOM element
 * @param {string} action the animation action
 * @return {Promise} Returns a Promise which resolves to true when animation is complete. Will
 * resolve to false if no animations were run.
 * @memberof oj.TableAnimationUtils
 */
oj.TableAnimationUtils.prototype.animateTableBodyRow = function (tableBodyRow, action) {
  if (this._isAnimationDisabled(action)) {
    return Promise.resolve(false);
  }
  var self = this;
  return new Promise(function (resolve) {
    self._startAnimation(tableBodyRow, action).then(function () {
      resolve(true);
    });
  });
};

/**
 * Animate an array of tableBodyRows
 * @param {Array} tableBodyRowArray Array of tr DOM elements
 * @param {string} action the animation action
 * @return {Promise} Returns a Promise which resolves when animation is complete..
 * @memberof oj.TableAnimationUtils
 */
oj.TableAnimationUtils.prototype.animateTableBodyRows = function (tableBodyRowArray, action) {
  if (this._isAnimationDisabled(action)) {
    return Promise.resolve(false);
  }
  var self = this;
  var animationPromiseArray = [];
  for (var i = 0; i < tableBodyRowArray.length; i++) {
    var tableBodyRow = tableBodyRowArray[i];
    animationPromiseArray.push((function (_tableBodyRow) {
      return self.animateTableBodyRow(_tableBodyRow, action);
    })(tableBodyRow));
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
 * @memberof oj.TableAnimationUtils
 * @private
 */
oj.TableAnimationUtils.prototype._getAnimationEffect = function (action) {
  var defaultOptions;

  if (this.defaultAnimations == null) {
    defaultOptions = ThemeUtils.parseJSONFromFontFamily('oj-table-option-defaults');
    this.defaultAnimations = defaultOptions.animation || {};
  }

  return this.defaultAnimations[action];
};

/**
 * Returns whether animation is disabled
 * @param {string} action the animation action
 * @return {boolean} Returns true or false
 * @private
 * @memberof oj.TableAnimationUtils
 */
oj.TableAnimationUtils.prototype._isAnimationDisabled = function (action) {
  // check if animation effect is null
  var effect = this._getAnimationEffect(action);
  if (effect == null ||
    effect.length === 0) {
    return true;
  }
  return false;
};

/**
 * Utility method to start animation
 * @param {Element} elem element to animate
 * @param {string} action the animation action
 * @param {Object=} effect optional animation effect, if not specified then it will be derived based on action
 * @return {Promise} the promise which will be resolve when animation ends
 * @private
 * @memberof oj.TableAnimationUtils
 */
oj.TableAnimationUtils.prototype._startAnimation = function (elem, action, effect) {
  if (effect == null) {
    // eslint-disable-next-line no-param-reassign
    effect = this._getAnimationEffect(action);
  }
  // eslint-disable-next-line no-undef
  return AnimationUtils.startAnimation(elem, action, effect, this.component);
};



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/* global Logger:false */

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
  this.options = component.options;
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
  var column = this._getTableDomUtils().getTableHeaderColumn(columnIdx);
  column.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._DRAG);
  this._getTableDomUtils().setTableColumnCellsClass(columnIdx, true,
                                                    oj.TableDomUtils.MARKER_STYLE_CLASSES._DRAG);
};

/**
 * Remove oj-drag marker class from cells in dragged columns
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._removeDragMarkerClass = function () {
  var domUtils = this._getTableDomUtils();
  var dragColumns =
      domUtils.getTableElementsByClassName(domUtils.getTableHeader(),
        oj.TableDomUtils.MARKER_STYLE_CLASSES._DRAG);
  if (dragColumns != null && dragColumns.length > 0) {
    var dragColumnsCount = dragColumns.length;
    for (var i = 0; i < dragColumnsCount; i++) {
      dragColumns[i].classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._DRAG);
    }
  }
  domUtils.setTableColumnCellsClass(null, false,
                                                    oj.TableDomUtils.MARKER_STYLE_CLASSES._DRAG);
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
  var domUtils = this._getTableDomUtils();
  var tableBody = domUtils.getTableElementsByTagName(tableContainer,
    oj.TableDomUtils.DOM_ELEMENT._TBODY)[0];

  var scrollLeft = $(tableBody).scrollLeft();

  tableContainerClone = tableContainer.cloneNode(true);
  var tableBodyClone = domUtils.getTableElementsByTagName(tableContainerClone,
    oj.TableDomUtils.DOM_ELEMENT._TBODY, true)[0];

  // Use absolute positioning with a large negative top to put it off the screen without
  // affecting the scrollbar.  Fixed positioning does not work on Safari.
  tableContainerClone.style[oj.TableDomUtils.CSS_PROP._BACKGROUND_COLOR] =
    oj.TableDomUtils.CSS_VAL._TRANSPARENT;
  tableContainerClone.style[oj.TableDomUtils.CSS_PROP._BORDER_COLOR] =
    oj.TableDomUtils.CSS_VAL._TRANSPARENT;
  tableContainerClone.style[oj.TableDomUtils.CSS_PROP._POSITION] =
    oj.TableDomUtils.CSS_VAL._ABSOLUTE;
  tableContainerClone.style[oj.TableDomUtils.CSS_PROP._HEIGHT] =
    tableBody.scrollHeight + oj.TableDomUtils.CSS_VAL._PX;
  tableContainerClone.style[oj.TableDomUtils.CSS_PROP._TOP] =
    -10000 + oj.TableDomUtils.CSS_VAL._PX;

  // Set both overflow and overflow-x/y because on IE, setting overflow does not
  // affect overflow-x/y that have been explicitly set.
  tableBodyClone.style[oj.TableDomUtils.CSS_PROP._OVERFLOW] = oj.TableDomUtils.CSS_VAL._HIDDEN;
  tableBodyClone.style[oj.TableDomUtils.CSS_PROP._OVERFLOW_X] = oj.TableDomUtils.CSS_VAL._HIDDEN;
  tableBodyClone.style[oj.TableDomUtils.CSS_PROP._OVERFLOW_Y] = oj.TableDomUtils.CSS_VAL._HIDDEN;
  tableBodyClone.style[oj.TableDomUtils.CSS_PROP._BACKGROUND_COLOR] =
    oj.TableDomUtils.CSS_VAL._TRANSPARENT;
  tableBodyClone.style[oj.TableDomUtils.CSS_PROP._BORDER_COLOR] =
    oj.TableDomUtils.CSS_VAL._TRANSPARENT;
  tableBodyClone.style[oj.TableDomUtils.CSS_PROP._WIDTH] =
    $(tableBody).width() + oj.TableDomUtils.CSS_VAL._PX;
  tableBodyClone.style[oj.TableDomUtils.CSS_PROP._HEIGHT] =
    tableBody.scrollHeight + oj.TableDomUtils.CSS_VAL._PX;

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
  return this._getTableDomUtils().getElementColumnIdx(event.currentTarget);
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
  var domUtils = this._getTableDomUtils();
  var overRow = domUtils.getFirstAncestor(event.target, oj.TableDomUtils.DOM_ELEMENT._TR, true);

  // Find the index from the DOM directly instead of calling TableDomUtils.getElementRowIdx.  There was a change in
  // TableDomUtils.getElementRowIdx to use cached elements so it's not accurate for dnd purpose.
  var cell = domUtils.getFirstAncestor(event.target, '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
  if (cell != null) {
    var tableBodyRow = domUtils
        .getFirstAncestor(cell, '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_CLASS, true);
    if (tableBodyRow != null) {
      newRowIndex = $(tableBodyRow).index();
    }
  } else if ($(overRow).hasClass(oj.TableDomUtils.CSS_CLASSES
                                ._TABLE_DATA_ROW_DRAG_INDICATOR_BEFORE_CLASS)) {
    newRowIndex = this._dropRowIndex;
  } else {
    // If we are not in a cell and not in the indicator row, we are in an empty part
    // of the table body, so add any new row to the end.
    var tableBodyRows = domUtils.getTableBodyRows();
    newRowIndex = tableBodyRows ? tableBodyRows.length : 0;
  }

  return newRowIndex;
};

/**
 * Get the TableDomUtils object from the ojTable component.
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._getTableDomUtils = function () {
  return this.component._getTableDomUtils();
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
    this._getTableDomUtils().removeDragOverIndicatorColumn();
    this._getTableDomUtils().removeTableHeaderColumnDragImage();

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
      this._getTableDomUtils().displayDragOverIndicatorColumn(columnIdx,
                                                              this._currentDropColumnBefore);
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
    this._getTableDomUtils().displayDragOverIndicatorColumn(columnIdx,
                                                            this._isDragOverBeforeColumn(event));
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

  this._getTableDomUtils().removeDragOverIndicatorColumn();

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
  var domUtils = this._getTableDomUtils();
  domUtils.removeDragOverIndicatorColumn();
  var columnIdx = this._getEventColumnIndex(event);
  if (!this._currentDropColumnBefore) {
    columnIdx += 1;
  }
  this.component._columnsDestMap =
    domUtils.moveTableHeaderColumn(this._dragStartColumnIdx, columnIdx, event);
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

  this._getTableDomUtils().removeDragOverIndicatorColumn();
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
  var dragOption = this.options.dnd.drag;
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
    this._getTableDomUtils().removeDragOverIndicatorRow();
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
  this._getTableDomUtils().removeDragOverIndicatorRow();
  this._dropRowIndex = null;

  return this._invokeDropCallback('rows', 'drop', event,
                                  { rowIndex: dropRowIndex });
};

/**
 * Hide unselected rows in a tbody element
 * @param {Element} tableContainerClone  the cloned div DOM object
 * @param {Array.<number>} selArray  array of selected row index
 * @return {number|null} row index of the first selected row
 * @private
 * @memberof oj.TableDndContext
 */
oj.TableDndContext.prototype._hideUnselectedRows = function (tableContainerClone, selArray) {
  var i;
  var j;
  var firstRow = null;
  var domUtils = this._getTableDomUtils();
  var tableBodyRows = domUtils.getTableElementsByClassName(tableContainerClone,
     oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_CLASS, true);
  for (i = tableBodyRows.length - 1; i >= 0; i--) {
    if (selArray.indexOf(i) === -1) {
      var row = tableBodyRows[i];
      row.style[oj.TableDomUtils.CSS_PROP._VISIBILITY] = oj.TableDomUtils.CSS_VAL._HIDDEN;
      row.style[oj.TableDomUtils.CSS_PROP._BORDER_COLOR] = oj.TableDomUtils.CSS_VAL._TRANSPARENT;
      var cells = row.childNodes;
      for (j = 0; j < cells.length; j++) {
        cells[j].style[oj.TableDomUtils.CSS_PROP._BORDER_COLOR] =
          oj.TableDomUtils.CSS_VAL._TRANSPARENT;
      }
    } else {
      firstRow = i;
    }
  }

  // hide thead and tfoot
  var tableHeader = domUtils.getTableElementsByTagName(tableContainerClone,
    oj.TableDomUtils.DOM_ELEMENT._THEAD, true);

  if (tableHeader != null && tableHeader.length > 0) {
    tableHeader[0].style[oj.TableDomUtils.CSS_PROP._VISIBILITY] = oj.TableDomUtils.CSS_VAL._HIDDEN;
    tableHeader[0].style[oj.TableDomUtils.CSS_PROP._BORDER_COLOR] =
      oj.TableDomUtils.CSS_VAL._TRANSPARENT;
    var headerRow = tableHeader[0].childNodes[0];
    if (headerRow != null) {
      var headerCells = headerRow.childNodes;
      for (i = 0; i < headerCells.length; i++) {
        headerCells[i].style[oj.TableDomUtils.CSS_PROP._BORDER_COLOR] =
          oj.TableDomUtils.CSS_VAL._TRANSPARENT;
      }
    }
  }

  var tableFooter = domUtils.getTableElementsByTagName(tableContainerClone,
    oj.TableDomUtils.DOM_ELEMENT._TFOOT, true);

  if (tableFooter != null && tableFooter.length > 0) {
    tableFooter[0].style[oj.TableDomUtils.CSS_PROP._VISIBILITY] = oj.TableDomUtils.CSS_VAL._HIDDEN;
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
    var dndOption = this.options.dnd[dndType];
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
  var dndOption = this.options.dnd;

  if (dndOption && dndOption.reorder &&
      dndOption.reorder.columns === this.component._OPTION_ENABLED) {
    return true;
  }

  return false;
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
  return (domEvent.clientX >= Math.ceil(rect.left) &&
          domEvent.clientX < Math.floor(rect.right) &&
          domEvent.clientY >= Math.ceil(rect.top) &&
          domEvent.clientY < Math.floor(rect.bottom));
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
  var dndOption = this.options.dnd.drop;

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
    headerColumn.style[oj.TableDomUtils.CSS_PROP._CURSOR] = oj.TableDomUtils.CSS_VAL._MOVE;
    headerColumn.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._DRAGGABLE);
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
  headerColumn.style[oj.TableDomUtils.CSS_PROP._CURSOR] = oj.TableDomUtils.CSS_VAL._AUTO;
  headerColumn.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._DRAGGABLE);
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
      $(this._getTableDomUtils().getFirstAncestor(event.currentTarget,
        oj.TableDomUtils.DOM_ELEMENT._TABLE, true)).parent()[0],
      selArray);

    return { rows: rowDataArray };
  }

  return null;
};

/**
 * Set a drag image of the selected rows into the dataTransfer object
 * @param {Event} nativeEvent  DOM event object
 * @param {Element} tableContainer  the div DOM object
 * @param {Array.<number>} selArray  array of selected row index
 * @return {Element} DOM object for the cloned table container
 * @memberof oj.TableDndContext
 * @private
 */
oj.TableDndContext.prototype._setDragRowsImage = function (nativeEvent, tableContainer, selArray) {
  var tableContainerClone = this._cloneTableContainer(tableContainer);
  this._hideUnselectedRows(tableContainerClone, selArray);
  var rect = tableContainer.getBoundingClientRect();
  var domUtils = this._getTableDomUtils();
  var tableBody = domUtils.getTableElementsByTagName(tableContainer,
    oj.TableDomUtils.DOM_ELEMENT._TBODY)[0];
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
  var tableIdHashCode = this._getTableDomUtils().hashCode(this._getTableDomUtils().getTableUID());
  dataTransfer.setData('Text',
                       this.component._DND_REORDER_TABLE_ID_DATA_KEY +
                       ':' + tableIdHashCode + ':' + columnIdx);
  var dragImage = this._getTableDomUtils().createTableHeaderColumnDragImage(columnIdx);
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

  var headerColumns = this._getTableDomUtils().getTableHeaderColumns();

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
    var domUtils = this._getTableDomUtils();
    var overRow = domUtils.getFirstAncestor(event.target, oj.TableDomUtils.DOM_ELEMENT._TR, true);
    this._dropRowIndex = newRowIndex;
    domUtils.displayDragOverIndicatorRow(this._dropRowIndex, true, overRow);
  }
};



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/* global Components:false, Logger:false, Translations:false, Context:false, DataCollectionUtils:false */
/**
 * @ignore
 * @export
 * @class oj.TableDomUtils
 * @classdesc DOM Utils for ojTable
 * @param {Object} component ojTable instance
 * @constructor
 */
oj.TableDomUtils = function (component) {
  this.component = component;
  this.options = component.options;
  this.element = component.element[0];
  this.OuterWrapper = component.OuterWrapper;
  this.Init();
  this._cacheDomDimensions = {};
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.TableDomUtils, oj.Object, 'oj.TableDomUtils');

/**
 * Initializes the instance.
 * @export
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.Init = function () {
  oj.TableDomUtils.superclass.Init.call(this);
};

/**
 * Clear any cached DOM
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.clearCachedDom = function () {
  this.clearCachedDomRowData();
  this._clearCachedDom(null);
};

/**
 * Clear any cached DOM rows
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.clearCachedDomRowData = function () {
  this._cachedDomTableBodyRows = null;
};

/**
 * Add a default context menu to the table container if there is none. If there is
 * a context menu set on the table options we use that one. Add listeners
 * for context menu before show and select.
 * @param {function(Object)} handleContextMenuSelect function called for menu select
 * @return {Element} ul DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createContextMenu = function (handleContextMenuSelect) {
  var menuContainer = this.component._GetContextMenu();
  var self = this;
  var enableNonContiguousSelectionMenu =
      this.component._isTouchDevice() ?
      this.component._getRowSelectionMode() === this.component._OPTION_SELECTION_MODES._MULTIPLE :
      false;

  if (menuContainer) {
    var listItems = menuContainer.querySelectorAll('[data-oj-command]');
    if (listItems.length > 0) {
      var command;
      var i;
      var newItem;
      for (i = 0; i < listItems.length; i++) {
        if (listItems[i].tagName === 'OJ-OPTION' ||
            listItems[i].getElementsByTagName(oj.TableDomUtils.DOM_ELEMENT._A).length === 0) {
          command = listItems[i].getAttribute('data-oj-command').split('-');
          newItem = self.createContextMenuItem(command[command.length - 1],
                                               this.component._IsCustomElement());
          if (listItems[i].tagName === 'OJ-OPTION') {
            listItems[i].innerHTML = newItem.innerHTML; // @HTMLUpdateOK
          } else {
            $(listItems[i]).replaceWith(newItem); // @HTMLUpdateOK
          }
        }
      }
      this._menuContainer = menuContainer;
      if ($(menuContainer).data('oj-ojMenu')) {
        if (this.component._IsCustomElement()) {
          menuContainer.refresh();
        } else {
          $(menuContainer).ojMenu('refresh');
        }
      }

      if (this.component._IsCustomElement()) {
        menuContainer.addEventListener('ojAction', handleContextMenuSelect);
      } else {
        $(menuContainer).on('ojselect', handleContextMenuSelect);
      }
    }
  } else if (this.component._isTableSortable() ||
    enableNonContiguousSelectionMenu ||
    this.component._isTableColumnsResizable()) {
    menuContainer = document.createElement(oj.TableDomUtils.DOM_ELEMENT._UL);
    menuContainer.style[oj.TableDomUtils.CSS_PROP._DISPLAY] = oj.TableDomUtils.CSS_VAL._NONE;
    menuContainer.setAttribute(oj.TableDomUtils.DOM_ATTR._ID, this.getTableId() + '_contextmenu');
    this.getTableContainer().appendChild(menuContainer); // @HTMLUpdateOK
    if (this.component._isTableSortable()) {
      var sortMenu = this.createContextMenuItem('sort');
      menuContainer.appendChild(sortMenu); // @HTMLUpdateOK
    }
    if (enableNonContiguousSelectionMenu) {
      var nonContiguousSelectionMenu = this.createContextMenuItem('enableNonContiguousSelection');
      menuContainer.appendChild(nonContiguousSelectionMenu); // @HTMLUpdateOK
    }
    if (this.component._isTableColumnsResizable()) {
      var resizeMenu = this.createContextMenuItem('resize');
      menuContainer.appendChild(resizeMenu); // @HTMLUpdateOK
    }
    $(menuContainer).ojMenu();
    this._menuContainer = menuContainer;
    $(menuContainer).on('ojselect', handleContextMenuSelect);

    this.component.option('contextMenu',
                          '#' + menuContainer.getAttribute(oj.TableDomUtils.DOM_ATTR._ID), {
                            _context: {
                              internalSet: true
                            }
                          });

    // fulfill _GetDefaultContextMenu contract
    this.component._defaultContextMenu = menuContainer;
  }

  return menuContainer;
};

/**
 * Builds a menu for a command, takes care of submenus where appropriate
 * @param {string} command the string to look up command value for as well as translation
 * @param {boolean=} useOjOption whether oj-option tag should be used, which is the case for custom element (except for default menu)
 * @return {Element} li DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createContextMenuItem = function (command, useOjOption) {
  if (command === 'sort') {
    var sortMenuListItem = this.createContextMenuListItem(command, useOjOption);
    var listElement = document.createElement(oj.TableDomUtils.DOM_ELEMENT._UL);
    sortMenuListItem.appendChild(listElement); // @HTMLUpdateOK
    listElement.appendChild(this.createContextMenuListItem('sortAsc', useOjOption)); // @HTMLUpdateOK
    listElement.appendChild(this.createContextMenuListItem('sortDsc', useOjOption)); // @HTMLUpdateOK
    return sortMenuListItem;
  } else if (command === 'sortAsc') {
    return this.createContextMenuListItem(command, useOjOption);
  } else if (command === 'sortDsc') {
    return this.createContextMenuListItem(command, useOjOption);
  } else if (command === 'enableNonContiguousSelection') {
    return this.createContextMenuListItem(command, useOjOption);
  } else if (command === 'disableNonContiguousSelection') {
    return this.createContextMenuListItem(command, useOjOption);
  } else if (command === 'resize') {
    // create the resize popup too
    this.createContextMenuResizePopup(0);
    return this.createContextMenuListItem(command, useOjOption);
  }
  return null;
};

/**
 * Builds a context menu list item from a command
 * @param {string} command the string to look up command value for as well as translation
 * @param {boolean=} useOjOption whether oj-option tag should be used, which is the case for custom element (except for default menu)
 * @return {Element} DOM element for menu item
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createContextMenuListItem = function (command, useOjOption) {
  var contextMenuListItem = document.createElement(useOjOption ? 'oj-option' : 'li');
  contextMenuListItem.setAttribute('data-oj-command', 'oj-table-' + command);
  contextMenuListItem.appendChild(this.createContextMenuLabel(command, useOjOption)); // @HTMLUpdateOK

  return contextMenuListItem;
};

/**
 * Builds a context menu label by looking up command translation
 * @param {string} command the string to look up translation for
 * @param {boolean=} useOjOption whether oj-option tag should be used, which is the case for custom element (except for default menu)
 * @return {Node} a DOM node
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createContextMenuLabel = function (command, useOjOption) {
  var commandString = null;
  if (command === 'sort') {
    commandString = this.component.getTranslatedString('labelSort');
  } else if (command === 'sortAsc') {
    commandString = this.component.getTranslatedString('labelSortAsc');
  } else if (command === 'sortDsc') {
    commandString = this.component.getTranslatedString('labelSortDsc');
  } else if (command === 'enableNonContiguousSelection') {
    commandString = this.component.getTranslatedString('labelEnableNonContiguousSelection');
  } else if (command === 'disableNonContiguousSelection') {
    commandString = this.component.getTranslatedString('labelDisableNonContiguousSelection');
  } else if (command === 'resize') {
    commandString = this.component.getTranslatedString('labelResize');
  }

  var textNode = document.createTextNode(commandString);

  // for custom elements, no <a> tag is required
  if (useOjOption) {
    return textNode;
  }

  var contextMenuLabel = document.createElement(oj.TableDomUtils.DOM_ELEMENT._A);
  contextMenuLabel.setAttribute(oj.TableDomUtils.DOM_ATTR._HREF, '#');
  contextMenuLabel.appendChild(textNode); // @HTMLUpdateOK

  return contextMenuLabel;
};

/**
 * Build the html for the resize popup and add it to the root node
 * @param {number} initialSize the initial size to put in the spinner
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createContextMenuResizePopup = function (initialSize) {
  // eslint-disable-next-line no-param-reassign
  initialSize = Math.round(initialSize);
  var popup = this.getContextMenuResizePopup();
  var spinner;

  if (popup == null) {
    // create the base popup
    var tableContainer = this.getTableContainer();
    popup = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    popup.setAttribute('id', this.getTableId() + '_resize_popup');
    popup.setAttribute('data-oj-context', '');
    tableContainer.appendChild(popup); // @HTMLUpdateOK
    var popupBody = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    var popupFooter = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    popupFooter.classList.add(oj.TableDomUtils.CSS_CLASSES._TEXT_ALIGN_END);
    popup.appendChild(popupBody); // @HTMLUpdateOK
    popup.appendChild(popupFooter); // @HTMLUpdateOK

    // create the popup content
    spinner = document.createElement(oj.TableDomUtils.DOM_ELEMENT._INPUT);
    spinner.setAttribute('id', this.getTableId() + '_resize_popup_spinner');
    var spinnerLabel = document.createElement(oj.TableDomUtils.DOM_ELEMENT._LABEL);
    spinnerLabel.setAttribute('for', this.getTableId() + '_resize_popup_spinner');
    spinnerLabel.textContent = this.component.getTranslatedString('labelResizePopupSpinner');
    var popupCancelButton = document.createElement(oj.TableDomUtils.DOM_ELEMENT._BUTTON);
    popupCancelButton.setAttribute('id', this.getTableId() + '_resize_popup_popupcancel');
    popupCancelButton.style.margin = '5px';
    var popupOKButton = document.createElement(oj.TableDomUtils.DOM_ELEMENT._BUTTON);
    popupOKButton.setAttribute('id', this.getTableId() + '_resize_popup_popupsubmit');
    popupOKButton.style.margin = '5px';

    popupBody.appendChild(spinnerLabel); // @HTMLUpdateOK
    popupBody.appendChild(spinner); // @HTMLUpdateOK
    popupFooter.appendChild(popupOKButton); // @HTMLUpdateOK
    popupFooter.appendChild(popupCancelButton); // @HTMLUpdateOK

    $(popupOKButton).ojButton({
      component: 'ojButton',
      label: this.component.getTranslatedString('labelResizePopupSubmit')
    });
    $(popupCancelButton).ojButton({
      component: 'ojButton',
      label: this.component.getTranslatedString('labelResizePopupCancel')
    });
    var cancelActionHandler = function () {
      $(popupOKButton).ojButton({ disabled: false });
      $(spinner).ojInputNumber({ value: 0 });
      $(popup).ojPopup('close');
    };
    $(popupOKButton).on('click',
                        this.component._handleContextMenuResizePopup.bind(this.component));
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
      validators: [{
        type: 'regExp',
        options: {
          pattern: '^[1-9][0-9]*$',
          messageDetail: this.component.getTranslatedString('msgColumnResizeWidthValidation')
        }
      }] });
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
    this._cacheDomElement(this.getTableId() + '_resize_popup', popup);
  } else {
    spinner = document.getElementById(this.getTableId() + '_resize_popup_spinner');
    $(spinner).ojInputNumber('option', 'value', initialSize);
  }
  return popup;
};

/**
 * Create the initial empty table
 * @param {boolean} isTableHeaderless is table headerless
 * @param {boolean} isTableFooterless is table footerless
 * @return {Element} table DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createInitialTable = function (isTableHeaderless, isTableFooterless) {
  var table = this.getTable();
  this.createTableContainer();

  if (!isTableHeaderless) {
    this.createTableHeader();
  }
  if (!isTableFooterless) {
    this.createTableFooter();
  }
  this.createTableBody();
  this.createTableStatusMessage();
  this.createTableStatusAccNotification();

  return table;
};

/**
 * Create an empty tbody element with appropriate styling
 * @return {Element} tbody DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableBody = function () {
  var table = this.getTable();
  var tableBody = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TBODY);
  table.appendChild(tableBody); // @HTMLUpdateOK
  this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_BODY_CLASS, tableBody);

  return tableBody;
};

/**
 * Create an empty td element with appropriate styling
 * @param {number} rowIdx  row index
 * @param {number} columnIdx  column index
 * @return {Element} td DOM element
 * @memberof oj.TableDomUtils
 */
// eslint-disable-next-line no-unused-vars
oj.TableDomUtils.prototype.createTableBodyCell = function (rowIdx, columnIdx) {
  var tableBodyCell = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TD);

  return tableBodyCell;
};

/**
 * Create a checkbox for accessibility row selection
 * @param {number} rowIdx  row index
 * @param {Object} rowKey  row key
 * @param {Object} rowHashCode  row hash code
 * @param {Element} tableBodyRow  tr DOM element
 * @param {boolean} isNew is new row
 * @return {Element} td DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableBodyCellAccSelect =
  function (rowIdx, rowKey, rowHashCode, tableBodyRow, isNew) {
    var accSelectionCell = null;

    if (!isNew) {
      accSelectionCell = this.getTableBodyCellAccSelect(tableBodyRow);
    }

    if (accSelectionCell != null) {
      return accSelectionCell;
    }

    var rowKeyStr = rowKey != null ? rowKey.toString() : rowIdx.toString();
    var rowKeyStrHashCode = rowHashCode == null ? this.hashCode(rowKeyStr) : rowHashCode;

    accSelectionCell = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TD);
    accSelectionCell.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_ACC_SELECT_CLASS);
    accSelectionCell.style.padding = '0';
    accSelectionCell.style.border = '0';

    // ensure proper role is set for wai-aria
    accSelectionCell.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'cell');

    var isTableHeaderless = this.component._isTableHeaderless();

    if (!isTableHeaderless) {
      var accessibility = this.options.accessibility;
      var rowHeaderColumnId = null;

      if (accessibility != null && accessibility.rowHeader != null) {
        rowHeaderColumnId = accessibility.rowHeader;
      } else {
        rowHeaderColumnId = this.component._getColumnDefs()[0].id;
      }
      var cellRowHeaderId = this.getTableId() + ':' +
          rowHeaderColumnId + '_' + rowKeyStrHashCode;
      accSelectionCell.setAttribute(oj.TableDomUtils.DOM_ATTR._HEADERS,
                                    this.getTableId() + ':' +
                                    oj.TableDomUtils._COLUMN_HEADER_ROW_SELECT_ID + ' ' +
                                    cellRowHeaderId);
    }
    var accSelectCheckbox = document.createElement(oj.TableDomUtils.DOM_ELEMENT._INPUT);
    accSelectCheckbox.setAttribute(oj.TableDomUtils.DOM_ATTR._ID,
                                   this.getTableId() + ':acc_sel_row_' + rowKeyStrHashCode);
    accSelectCheckbox.setAttribute(oj.TableDomUtils.DOM_ATTR._TYPE, 'checkbox');
    accSelectCheckbox.setAttribute(oj.TableDomUtils.DOM_ATTR._TABINDEX, '-1');
    var selectRowTitle = null;

    var editMode = this.options.editMode;
    var isRowSelectionEnabled = this.component._isRowSelectionEnabled();

    if (editMode === this.component._OPTION_EDIT_MODE._ROW_EDIT) {
      if (!isRowSelectionEnabled) {
        selectRowTitle =
          this.component.getTranslatedString(this.component._BUNDLE_KEY._LABEL_EDIT_ROW);
      } else {
        selectRowTitle =
          this.component.getTranslatedString(this.component._BUNDLE_KEY._LABEL_SELECT_AND_EDIT_ROW);
      }
    } else {
      selectRowTitle =
        this.component.getTranslatedString(this.component._BUNDLE_KEY._LABEL_SELECT_ROW);
    }
    accSelectCheckbox.setAttribute(oj.TableDomUtils.DOM_ATTR._TITLE, selectRowTitle);
    accSelectCheckbox.classList.add(oj.TableDomUtils.CSS_CLASSES._CHECKBOX_ACC_SELECT_ROW_CLASS);
    accSelectCheckbox.classList.add(oj.TableDomUtils.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);

    if (this.component._getEditableRowIdx() === rowIdx) {
      accSelectCheckbox.checked = true;
    } else {
      accSelectCheckbox.checked = false;
    }
    accSelectionCell.appendChild(accSelectCheckbox); // @HTMLUpdateOK
    tableBodyRow.insertBefore(accSelectionCell, tableBodyRow.firstChild); // @HTMLUpdateOK

    return accSelectionCell;
  };

/**
 * Create the message td element with appropriate styling and message
 * @param {Element} tableBodyMessageRow tr DOM element
 * @param {number} columnCount  number of visible columns
 * @param {string} message message
 * @return {Element} td DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableBodyMessageCell =
  function (tableBodyMessageRow, columnCount, message) {
    var messageCell = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TD);
    messageCell.setAttribute(oj.TableDomUtils.DOM_ATTR._COLSPAN, columnCount + 1);
    messageCell.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_BODY_MESSAGE_CLASS);
    messageCell.appendChild(document.createTextNode(message)); // @HTMLUpdateOK

    tableBodyMessageRow.appendChild(messageCell); // @HTMLUpdateOK
    return messageCell;
  };

/**
 * Create the message row with appropriate styling
 * @param {number} columnCount  number of visible columns
 * @param {string} message message
 * @return {Element} row DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableBodyMessageRow = function (columnCount, message) {
  var tableBody = this.getTableBody();
  var tableBodyMessageRow = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TR);
  tableBodyMessageRow.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_BODY_MESSAGE_ROW_CLASS);
  this.createTableBodyMessageCell(tableBodyMessageRow, columnCount, message);

  tableBody.appendChild(tableBodyMessageRow); // @HTMLUpdateOK
  return tableBodyMessageRow;
};

/**
 * Create an empty tr element with appropriate styling
 * @param {number} rowIdx  row index
 * @param {Object} rowKey  row key
 * @return {Element} tr DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableBodyRow = function (rowIdx, rowKey) {
  var tableBodyRow = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TR);
  this.createTableBodyCellAccSelect(rowIdx, rowKey, null, tableBodyRow, true);

  return tableBodyRow;
};

/**
 * Get the touch affordance glass pane.
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTouchAffordanceGlassPane = function () {
  var tableContainer = this.getTableContainer();
  var touchAffordanceGlassPane = this.getTableElementsByClassName(tableContainer,
    oj.TableDomUtils.CSS_CLASSES._TABLE_TOUCH_AFFORDANCE_GLASS_PANE_CLASS);

  if (touchAffordanceGlassPane.length > 0) {
    return touchAffordanceGlassPane[0];
  }
  return null;
};

/**
 * Create the touch affordance glass pane.
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTouchAffordanceGlassPane = function () {
  var touchAffordanceGlassPane = this.getTouchAffordanceGlassPane();
  if (!touchAffordanceGlassPane) {
    var tableContainer = this.getTableContainer();
    touchAffordanceGlassPane = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    touchAffordanceGlassPane.classList.add(
      oj.TableDomUtils.CSS_CLASSES._TABLE_TOUCH_AFFORDANCE_GLASS_PANE_CLASS);
    tableContainer.appendChild(touchAffordanceGlassPane); // @HTMLUpdateOK
    this.refreshTouchAffordanceGlassPanePosition();
  }
  return touchAffordanceGlassPane;
};

/**
 * Add the touch affordance to the table row.
 * @param {number} rowIdx  row index
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableBodyRowTouchSelectionAffordance = function (rowIdx) {
  var touchAffordanceGlassPane = this.createTouchAffordanceGlassPane();

  var topAffordance = this.getTableBodyRowTouchSelectionAffordanceTop();
  if (!topAffordance) {
    topAffordance = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    topAffordance.classList.add(
      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_CLASS);
    topAffordance.classList.add(
      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOUCH_AREA_CLASS);
    var topIcon = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    topIcon.classList.add(
      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_ICON_CLASS);
    topIcon.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'button');
    topIcon.setAttribute(oj.TableDomUtils.DOM_ATTR._ARIA_LABEL,
                         this.component.getTranslatedString('labelAccSelectionAffordanceTop'));
    topAffordance.appendChild(topIcon); // @HTMLUpdateOK
    touchAffordanceGlassPane.appendChild(topAffordance); // @HTMLUpdateOK
  }

  var bottomAffordance = this.getTableBodyRowTouchSelectionAffordanceBottom();
  if (!bottomAffordance) {
    bottomAffordance = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    bottomAffordance.classList.add(
      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_CLASS);
    bottomAffordance.classList.add(
      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOUCH_AREA_CLASS);
    var bottomIcon = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    bottomIcon.classList.add(
      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_ICON_CLASS);
    bottomIcon.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'button');
    bottomIcon.setAttribute(oj.TableDomUtils.DOM_ATTR._ARIA_LABEL,
                            this.component.getTranslatedString('labelAccSelectionAffordanceBottom'));
    bottomAffordance.appendChild(bottomIcon); // @HTMLUpdateOK
    touchAffordanceGlassPane.appendChild(bottomAffordance); // @HTMLUpdateOK
  }

  // these two methods ensure the rowIdx value is set on the affordances
  this.moveTableBodyRowTouchSelectionAffordanceTop(rowIdx);
  this.moveTableBodyRowTouchSelectionAffordanceBottom(rowIdx);
};

/**
 * Create the bottom slot element with appropriate styling
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableBottomSlot = function () {
  var tableContainer = this.getTableContainer();
  var tableBottomSlot = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
  tableBottomSlot.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_BOTTOM_SLOT_CLASS);
  tableContainer.appendChild(tableBottomSlot); // @HTMLUpdateOK
  this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_BOTTOM_SLOT_CLASS, tableBottomSlot);

  return tableBottomSlot;
};

/**
 * Create an empty div element with appropriate styling
 * @return {Element} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableContainer = function () {
  // need to enclose the table in a div to provide horizontal scrolling
  var tableContainer;
  if (this.OuterWrapper) {
    tableContainer = this.OuterWrapper;
  } else {
    tableContainer = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    this.element.parentNode.replaceChild(tableContainer, this.element);
    tableContainer.insertBefore(this.element, tableContainer.firstChild); // @HTMLUpdateOK
  }
  this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_CONTAINER_CLASS, tableContainer);

  // add main css class to container
  tableContainer.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_CLASS);
  tableContainer.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_CONTAINER_CLASS);
  tableContainer.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._WIDGET);

  return tableContainer;
};

/**
 * Create an empty tfoot with appropriate styling
 * @return {Element} tfoot DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableFooter = function () {
  var table = this.getTable();
  var tableFooter = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TFOOT);
  var tableFooterRow = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TR);
  this.createTableFooterAccSelect(tableFooterRow);

  tableFooter.appendChild(tableFooterRow); // @HTMLUpdateOK

  // check if thead is already there. If so add relative to thead.
  var tableHeader = this.getTableHeader();
  if (tableHeader != null) {
    tableHeader.parentNode.insertBefore(tableFooter, tableHeader.nextSibling); // @HTMLUpdateOK
  } else {
    // check if tbody is already there. If so add relative to tbody.
    var tableBody = this.getTableBody();
    if (tableBody != null) {
      tableBody.parentNode.insertBefore(tableFooter, tableBody); // @HTMLUpdateOK
    } else {
      table.appendChild(tableFooter); // @HTMLUpdateOK
    }
  }
  this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CLASS, tableFooter);

  return tableFooter;
};

/**
 * Create a checkbox for accessibility row selection
 * @param {Element} tableFooterRow  tr DOM element
 * @return {Element} td DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableFooterAccSelect = function (tableFooterRow) {
  var accFooterCell = this.getTableElementsByClassName(tableFooterRow,
    oj.TableDomUtils.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);

  if (accFooterCell.length > 0) {
    return accFooterCell[0];
  }
  accFooterCell = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TD);
  accFooterCell.classList.add(oj.TableDomUtils.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
  accFooterCell.setAttribute(oj.TableDomUtils.DOM_ATTR._TABINDEX, '-1');

  // ensure proper role is set for wai-aria
  accFooterCell.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'cell');

  tableFooterRow.insertBefore(accFooterCell, tableFooterRow.firstChild); // @HTMLUpdateOK

  return accFooterCell;
};

/**
 * Create an empty td element with appropriate styling
 * @param {number} columnIdx  column index
 * @return {Element} td DOM element
 * @memberof oj.TableDomUtils
 */
// eslint-disable-next-line no-unused-vars
oj.TableDomUtils.prototype.createTableFooterCell = function (columnIdx) {
  var tableFooterCell = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TD);

  return tableFooterCell;
};

/**
 * Create an empty thead & tr element with appropriate styling
 * @return {Element} thead DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableHeader = function () {
  var table = this.getTable();
  var tableHeader = document.createElement(oj.TableDomUtils.DOM_ELEMENT._THEAD);
  var tableHeaderRow = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TR);
  tableHeader.appendChild(tableHeaderRow); // @HTMLUpdateOK

  // check if tfoot is already there. If so add relative to tfoot.
  var tableFooter = this.getTableFooter();
  if (tableFooter != null) {
    tableFooter.parentNode.insertBefore(tableHeader, tableFooter); // @HTMLUpdateOK
  } else {
    // check if tbody is already there. If so add relative to tbody.
    var tableBody = this.getTableBody();
    if (tableBody != null) {
      tableBody.parentNode.insertBefore(tableHeader, tableBody); // @HTMLUpdateOK
    } else {
      table.appendChild(tableHeader); // @HTMLUpdateOK
    }
  }
  this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_HEADER_ROW_CLASS, tableHeaderRow);
  this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_HEADER_CLASS, tableHeader);

  return tableHeader;
};

/**
 * Create a th element for accessibility row selection
 * @return {Element} th DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableHeaderAccSelectRowColumn = function () {
  var headerColumn = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TH);
  headerColumn.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ACC_SELECT_ROW_CLASS);
  headerColumn.setAttribute(oj.TableDomUtils.DOM_ATTR._ID,
                            this.getTableId() + ':' +
                            oj.TableDomUtils._COLUMN_HEADER_ROW_SELECT_ID);

  // ensure proper role is set for wai-aria
  headerColumn.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'columnHeader');

  var selectRowTitle;
  var editMode = this.options.editMode;
  var isRowSelectionEnabled = this.component._isRowSelectionEnabled();

  if (editMode === this.component._OPTION_EDIT_MODE._ROW_EDIT) {
    if (!isRowSelectionEnabled) {
      selectRowTitle =
        this.component.getTranslatedString(this.component._BUNDLE_KEY._LABEL_EDIT_ROW);
    } else {
      selectRowTitle =
        this.component.getTranslatedString(this.component._BUNDLE_KEY._LABEL_SELECT_AND_EDIT_ROW);
    }
  } else {
    selectRowTitle =
      this.component.getTranslatedString(this.component._BUNDLE_KEY._LABEL_SELECT_ROW);
  }
  headerColumn.setAttribute(oj.TableDomUtils.DOM_ATTR._TITLE, selectRowTitle);
  headerColumn.style.padding = '0';
  headerColumn.style.border = '0';
  var headerColumnText = document.createElement(oj.TableDomUtils.DOM_ELEMENT._SPAN);
  headerColumnText.appendChild(document.createTextNode(selectRowTitle)); // @HTMLUpdateOK
  headerColumnText.classList.add(oj.TableDomUtils.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
  headerColumn.appendChild(headerColumnText); // @HTMLUpdateOK

  return headerColumn;
};

/**
 * Create a th element with appropriate styling and column content
 * @param {number} columnIdx  column index
 * @return {Element} th DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableHeaderColumn = function (columnIdx) {
  var column = this.component._getColumnDefs()[columnIdx];
  var headerColumnCell = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TH);
  this.styleTableHeaderColumn(columnIdx, headerColumnCell, true);
  // add abbr for acc
  headerColumnCell.setAttribute('abbr', column.headerText);
  // add title for tooltip
  headerColumnCell.setAttribute(oj.TableDomUtils.DOM_ATTR._TITLE, column.headerText);
  this.insertTableHeaderColumn(columnIdx, headerColumnCell);
  var headerContext = {
    columnIndex: columnIdx,
    headerContext: {
      component: this.component,
      parentElement: headerColumnCell
    }
  };
  if (column.resizable === oj.TableDomUtils._OPTION_ENABLED) {
    headerColumnCell.setAttribute('data-oj-resizable', oj.TableDomUtils._OPTION_ENABLED);
  }
  if (column.sortable === oj.TableDomUtils._OPTION_ENABLED) {
    headerColumnCell.setAttribute('data-oj-sortable', oj.TableDomUtils._OPTION_ENABLED);
    oj.TableRendererUtils.columnHeaderSortableIconRenderer(this.component, headerContext,
                                                           null, null);
  } else {
    oj.TableRendererUtils.columnHeaderDefaultRenderer(this.component, headerContext, null, null);
  }

  return headerColumnCell;
};

/**
 * Create the drag image for the column
 * @param {number} columnIdx  column index
 * @return {Element} DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableHeaderColumnDragImage = function (columnIdx) {
  var headerColumn = this.getTableHeaderColumn(columnIdx);
  var headerColumnDragImage = headerColumn.cloneNode(true);
  headerColumnDragImage.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._DRAG);
  headerColumnDragImage.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._FOCUS);
  headerColumnDragImage.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._FOCUS_HIGHLIGHT);
  headerColumnDragImage.classList.remove(oj.TableDomUtils.MARKER_STYLE_CLASSES._HOVER);
  headerColumnDragImage.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_IMAGE);
  headerColumnDragImage.style[oj.TableDomUtils.CSS_PROP._POSITION] =
    oj.TableDomUtils.CSS_VAL._ABSOLUTE;
  headerColumnDragImage.style[oj.TableDomUtils.CSS_PROP._TOP] = '0';
  headerColumnDragImage.style[oj.TableDomUtils.CSS_PROP._LEFT] = '-999em';
  headerColumnDragImage.style[oj.TableDomUtils.CSS_PROP._ZINDEX] = '-999';

  // The drag image element must be either visible or a child of document.body
  // in order to show on Safari.
  document.body.appendChild(headerColumnDragImage); // @HTMLUpdateOK

  return headerColumnDragImage;
};

/**
 * Create a checkbox for accessibility column selection
 * @param {number} columnIdx  column index
 * @param {string} columnSelectionMode  column selection mode
 * @return {Element} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableHeaderColumnAccSelect =
  function (columnIdx, columnSelectionMode) {
    if (columnSelectionMode !== oj.TableDomUtils._OPTION_SELECTION_MODES._SINGLE &&
        columnSelectionMode !== oj.TableDomUtils._OPTION_SELECTION_MODES._MULTIPLE) {
      return null;
    }
    var headerColumn = this.getTableHeaderColumn(columnIdx);
    var accSelectionHeaderColumn = this.getTableHeaderColumnAccSelect(columnIdx);

    if (accSelectionHeaderColumn != null) {
      return accSelectionHeaderColumn;
    }

    accSelectionHeaderColumn = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    accSelectionHeaderColumn.classList.add(
      oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ACC_SELECT_COLUMN_CLASS);
    accSelectionHeaderColumn.classList.add(
      oj.TableDomUtils.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
    var accSelectCheckbox = document.createElement(oj.TableDomUtils.DOM_ELEMENT._INPUT);
    accSelectCheckbox.setAttribute(oj.TableDomUtils.DOM_ATTR._ID,
                                   this.getTableId() + ':acc_sel_col' + columnIdx);
    accSelectCheckbox.setAttribute(oj.TableDomUtils.DOM_ATTR._TYPE, 'checkbox');
    accSelectCheckbox.setAttribute(oj.TableDomUtils.DOM_ATTR._TABINDEX, '-1');
    var selectColumnTitle =
        this.component.getTranslatedString(this.component._BUNDLE_KEY._LABEL_SELECT_COLUMN);
    accSelectCheckbox.setAttribute(oj.TableDomUtils.DOM_ATTR._TITLE, selectColumnTitle);
    accSelectCheckbox.classList.add(oj.TableDomUtils.CSS_CLASSES._CHECKBOX_ACC_SELECT_COLUMN_CLASS);
    accSelectionHeaderColumn.appendChild(accSelectCheckbox); // @HTMLUpdateOK
    headerColumn.insertBefore(accSelectionHeaderColumn, headerColumn.firstChild); // @HTMLUpdateOK

    return accSelectionHeaderColumn;
  };

/**
 * Create a div element for resize indicator
 * @return {Element} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableHeaderColumnResizeIndicator = function () {
  var tableHeaderColumnResizeIndicator = this.getTableHeaderColumnResizeIndicator();

  if (!tableHeaderColumnResizeIndicator) {
    var tableContainer = this.getTableContainer();
    tableHeaderColumnResizeIndicator = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    tableContainer.appendChild(tableHeaderColumnResizeIndicator);
    tableHeaderColumnResizeIndicator.classList.add(
      oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_RESIZE_INDICATOR_CLASS);
    this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_RESIZE_INDICATOR_CLASS,
                          tableHeaderColumnResizeIndicator);
  }

  return tableHeaderColumnResizeIndicator;
};

/**
 * Create a div element for the accessibility notifications
 * @return {Element} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableStatusAccNotification = function () {
  var tableContainer = this.getTableContainer();
  var statusNotification = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
  statusNotification.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'status');
  statusNotification.classList.add(
    oj.TableDomUtils.CSS_CLASSES._TABLE_STATUS_ACC_NOTIFICATION_CLASS);
  statusNotification.classList.add(oj.TableDomUtils.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
  tableContainer.appendChild(statusNotification); // @HTMLUpdateOK
  this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_STATUS_ACC_NOTIFICATION_CLASS,
                        statusNotification);

  return statusNotification;
};

/**
 * Create a div element for the Fetching Data... status message
 * @return {Element} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.createTableStatusMessage = function () {
  var tableContainer = this.getTableContainer();
  var statusMessage = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
  statusMessage.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_STATUS_MESSAGE_CLASS);
  statusMessage.style[oj.TableDomUtils.CSS_PROP._DISPLAY] = oj.TableDomUtils.CSS_VAL._NONE;

  var statusMessageLoadingIndicator = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
  statusMessageLoadingIndicator.classList.add(oj.TableDomUtils.CSS_CLASSES._ICON_CLASS);
  statusMessageLoadingIndicator.classList.add(
    oj.TableDomUtils.CSS_CLASSES._TABLE_LOADING_ICON_CLASS);
  statusMessageLoadingIndicator.setAttribute(
    'aria-label',
    this.component.getTranslatedString(this.component._BUNDLE_KEY._MSG_FETCHING_DATA)
  );
  statusMessage.appendChild(statusMessageLoadingIndicator); // @HTMLUpdateOK
  tableContainer.appendChild(statusMessage); // @HTMLUpdateOK
  this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_STATUS_MESSAGE_CLASS, statusMessage);

  return statusMessage;
};

/**
 * Display the visual indicator for column drag over
 * @param {number} columnIdx  column index
 * @param {boolean} before before the column
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.displayDragOverIndicatorColumn = function (columnIdx, before) {
  this.removeDragOverIndicatorColumn();
  var tableHeaderRow = this.getTableHeaderRow();
  var tableHeaderColumn = this.getTableHeaderColumn(columnIdx);

  if (tableHeaderColumn != null) {
    if (before) {
      tableHeaderColumn.classList.add(
        oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS);
    } else {
      tableHeaderColumn.classList.add(
        oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS);
    }
  } else {
    var columns = this.component._getColumnDefs();

    if (columns == null || columns.length === 0) {
      if (before) {
        tableHeaderRow.classList.add(
          oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS);
      } else {
        tableHeaderRow.classList.add(
          oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS);
      }
    }
  }
};

/**
 * Display the visual indicator for row drag over
 * @param {number} rowIdx  row index
 * @param {boolean} before before the row
 * @param {Element} modelRow tr DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.displayDragOverIndicatorRow = function (rowIdx, before, modelRow) {
  this.removeDragOverIndicatorRow();
  var tableBodyRowDragIndicator = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TR);
  if (before) {
    tableBodyRowDragIndicator.classList.add(
      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_DRAG_INDICATOR_BEFORE_CLASS);
  } else {
    tableBodyRowDragIndicator.classList.add(
      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_DRAG_INDICATOR_AFTER_CLASS);
  }
  if (modelRow) {
    $(tableBodyRowDragIndicator).height(parseInt($(modelRow).height(), 10));
  }

  var tableBodyDragIndicatorCell = document.createElement(oj.TableDomUtils.DOM_ELEMENT._TD);
  var columns = this.component._getColumnDefs();
  tableBodyDragIndicatorCell.setAttribute(oj.TableDomUtils.DOM_ATTR._COLSPAN, columns.length + 1);
  tableBodyRowDragIndicator.appendChild(tableBodyDragIndicatorCell); // @HTMLUpdateOK
  var tableBodyRow = this.getTableBodyRow(rowIdx);

  if (tableBodyRow != null) {
    if (before) {
      tableBodyRow.parentNode.insertBefore(tableBodyRowDragIndicator, tableBodyRow); // @HTMLUpdateOK
    } else {
      tableBodyRow.parentNode.insertBefore(tableBodyRowDragIndicator, tableBodyRow.nextSibling); // @HTMLUpdateOK
    }
  } else {
    var tableBodyRows = this.getTableBodyRows();

    if (tableBodyRows == null || tableBodyRows.length === 0) {
      this.component._hideNoDataMessage();
    }
    this.getTableBody().appendChild(tableBodyRowDragIndicator); // @HTMLUpdateOK
  }
};

/**
 * Get the context menu
 * @return  {Element} menu DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getContextMenu = function () {
  return this._menuContainer;
};

oj.TableDomUtils.prototype.getContextMenuResizePopup = function () {
  var popupId = this.getTableId() + '_resize_popup';
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getElementColumnIdx = function (element) {
  var tableBodyCell =
      this.getFirstAncestor(element, '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS, true);
  if (tableBodyCell != null) {
    return $(tableBodyCell.parentNode)
      .children('.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS)
      .index(tableBodyCell);
  }

  var tableHeaderColumn =
      this.getFirstAncestor(element, '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS, true);
  if (tableHeaderColumn != null) {
    return $(tableHeaderColumn.parentNode)
      .children('.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS)
      .index(tableHeaderColumn);
  }

  var tableFooterCell =
      this.getFirstAncestor(element, '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS, true);
  if (tableFooterCell != null) {
    return $(tableFooterCell.parentNode)
      .children('.' + oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS)
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getElementRowIdx = function (element) {
  var tableBodyRow =
      this.getFirstAncestor(element, '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_CLASS, true);

  if (tableBodyRow != null) {
    var tableBodyRows = this.getTableBodyRows();
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
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype.getFirstAncestor = function (element, selector, tableOwnedOnly) {
  var parents;

  if (element == null) {
    return null;
  }

  var elementMatches = (this._isIE() && !Element.prototype.matches)
    ? element.msMatchesSelector(selector)
    : element.matches(selector);

  if (elementMatches) {
    if (tableOwnedOnly) {
      if (!this.isTableOwned(element)) {
        return this.getFirstAncestor(element.parentNode, selector, tableOwnedOnly);
      }
    }
    return element;
  }

  parents = $(element).parents(selector);
  if (tableOwnedOnly) {
    for (var i = 0; i < parents.length; i++) {
      if (this.isTableOwned(parents[i])) {
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getScrollBarHeight = function () {
  return this._tableWidthConstrained ? this.getDefaultScrollBarSize() : 0;
};

/**
 * Return the scrollbar width
 * @return {number} scrolbar width
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getScrollBarWidth = function () {
  return (this._tableHeightConstrained && !this._isVerticalScrollBarHidden()) ?
           this.getDefaultScrollBarSize() : 0;
};

/**
 * Returns the default scrollbar size for the table when visible
 * @private
 */
oj.TableDomUtils.prototype.getDefaultScrollBarSize = function () {
  // cache browser scroll bar width for future sizing of table body element
  if (this._defaultScrollBarSize == null) {
    this._defaultScrollBarSize = DataCollectionUtils.getDefaultScrollBarWidth(this.getScroller());
  }
  return this._defaultScrollBarSize;
};

/**
 * Returns whether or not the vertical scrollbar should be hidden
 * @private
 */
oj.TableDomUtils.prototype._isVerticalScrollBarHidden = function () {
  return !this.component._isTouchDevice() &&
    this.getTableContainer().classList.contains(
      oj.TableDomUtils.MARKER_STYLE_CLASSES._HIDE_VERTICAL_SCROLLBAR);
};

/**
 * Return the table scroller
 * @return {Element} scrolbar
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getScroller = function () {
  return this.getTableBody();
};

/**
 * Get the element scrollLeft
 * @param {Element} element DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getScrollLeft = function (element) {
  var scrollLeft = element.scrollLeft;

  if (this.component._GetReadingDirection() === 'rtl') {
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTable = function () {
  return this.element;
};

/**
 * Return the table body element
 * @return {Element|null} tbody DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBody = function () {
  return this._getTableElementByClassName(oj.TableDomUtils.CSS_CLASSES._TABLE_BODY_CLASS, true);
};

/**
 * Return the cell element
 * @param {number} rowIdx  row index
 * @param {number} columnIdx  column index
 * @param {Element|null} tableBodyRow  tr DOM element
 * @return {Element|null} td DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyCell = function (rowIdx, columnIdx, tableBodyRow) {
  var tableBodyCells = this.getTableBodyCells(rowIdx, tableBodyRow);
  if (!tableBodyCells) {
    return null;
  }

  if (tableBodyCells.length > columnIdx) {
    return tableBodyCells[columnIdx];
  }

  return null;
};

/**
 * Get checkbox cell for accessibility row selection
 * @param {Element} tableBodyRow  tr DOM element
 * @return {Element|null} td DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyCellAccSelect = function (tableBodyRow) {
  if (tableBodyRow != null) {
    var accSelectionCell = this.getTableElementsByClassName(tableBodyRow,
      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_ACC_SELECT_CLASS);

    if (accSelectionCell.length > 0) {
      return accSelectionCell[0];
    }
  }
  return null;
};

/**
 * Return all the logical cell elements in a row
 * @param {number} rowIdx  row index
 * @param {Element|null} tableBodyRow  tr DOM element
 * @return {Array|null} array of td DOM elements
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyLogicalCells = function (rowIdx, tableBodyRow) {
  var tableBodyCells = this.getTableBodyCells(rowIdx, tableBodyRow);
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyCells = function (rowIdx, tableBodyRow) {
  if (!tableBodyRow) {
    // eslint-disable-next-line no-param-reassign
    tableBodyRow = this.getTableBodyRow(rowIdx);
  }

  if (!tableBodyRow) {
    return null;
  }

  var tableBodyCellElements = this.getTableElementsByClassName(tableBodyRow,
    oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS);

  if (tableBodyCellElements.length > 0) {
    return tableBodyCellElements;
  }

  return null;
};

/**
 * Return the table body message cell element
 * @return {Element|null} tr DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyMessageCell = function () {
  var tableBody = this.getTableBody();
  if (tableBody) {
    var messageCell = this.getTableElementsByClassName(tableBody,
      oj.TableDomUtils.CSS_CLASSES._TABLE_BODY_MESSAGE_CLASS);
    if (messageCell.length > 0) {
      return messageCell[0];
    }
  }
  return null;
};

/**
 * Return the table body message row element
 * @return {Element|null} tr DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyMessageRow = function () {
  var tableBody = this.getTableBody();
  if (tableBody) {
    var messageRow = this.getTableElementsByClassName(tableBody,
      oj.TableDomUtils.CSS_CLASSES._TABLE_BODY_MESSAGE_ROW_CLASS);
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyRow = function (rowIdx) {
  var tableBodyRows = this.getTableBodyRows();

  if (!tableBodyRows) {
    return null;
  }

  if (rowIdx == null) {
    return null;
  }

  if (tableBodyRows.length > rowIdx) {
    return tableBodyRows[rowIdx];
  }

  return null;
};

/**
 * Return all the table rows
 * @return {Array|null} array of tr DOM elements
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyRows = function () {
  if (!this._cachedDomTableBodyRows) {
    var tableBody = this.getTableBody();

    if (tableBody != null) {
      var tableBodyRowElements = this.getTableElementsByClassName(tableBody,
        oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_CLASS);

      if (tableBodyRowElements.length > 0) {
        this._cachedDomTableBodyRows = tableBodyRowElements;
      }
    }
  }

  return this._cachedDomTableBodyRows;
};

/**
 * Get top touch affordance to the table row.
 * @return {Element|null} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyRowTouchSelectionAffordanceTop = function () {
  var tableContainer = this.getTableContainer();
  var topAffordance = this.getTableElementsByClassName(tableContainer,
    oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOP_CLASS);

  if (topAffordance.length > 0) {
    topAffordance = topAffordance[0];

    return topAffordance;
  }
  return null;
};

/**
 * Get bottom touch affordance to the table row.
 * @return {Element|null} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBodyRowTouchSelectionAffordanceBottom = function () {
  var tableContainer = this.getTableContainer();
  var bottomAffordance = this.getTableElementsByClassName(tableContainer,
    oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_BOTTOM_CLASS);

  if (bottomAffordance.length > 0) {
    bottomAffordance = bottomAffordance[0];

    return bottomAffordance;
  }
  return null;
};

/**
 * Return the bottom slot element
 * @return {Element|null} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableBottomSlot = function () {
  return this._getTableElementByClassName(
    oj.TableDomUtils.CSS_CLASSES._TABLE_BOTTOM_SLOT_CLASS, true);
};

/**
 * Return the table container
 * @return {Element|null} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableContainer = function () {
  if (!this._isCachedDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_CONTAINER_CLASS)) {
    this._cacheDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_CONTAINER_CLASS,
                          this.element.parentNode);
  }

  return this._getCachedDomElement(oj.TableDomUtils.CSS_CLASSES._TABLE_CONTAINER_CLASS);
};

/**
 * Return the table footer
 * @return {Element|null} tfoot DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableFooter = function () {
  return this._getTableElementByClassName(
    oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CLASS, true);
};

/**
 * Return the footer cell element
 * @param {number} columnIdx  column index
 * @return {Element|null} td DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableFooterCell = function (columnIdx) {
  var tableFooterCells = this.getTableFooterCells();

  if (tableFooterCells != null && tableFooterCells.length > columnIdx) {
    return tableFooterCells[columnIdx];
  }

  return null;
};

/**
 * Return all footer cells
 * @return {Array|null} array of td DOM elements
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableFooterCells = function () {
  var tableFooterRow = this.getTableFooterRow();
  var tableFooterCells = tableFooterRow != null ?
      this.getTableElementsByClassName(tableFooterRow,
        oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS) : null;

  if (tableFooterCells != null && tableFooterCells.length > 0) {
    return tableFooterCells;
  }

  return null;
};

/**
 * Return all logical footer cells
 * @return {Array|null} array of td DOM elements
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableFooterLogicalCells = function () {
  var tableFooterCells = this.getTableFooterCells();
  if (!tableFooterCells) {
    return null;
  }

  return this._getColspanLogicalElements(tableFooterCells);
};

/**
 * Return table footer row
 * @return {Element|null} tr DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableFooterRow = function () {
  return this._getTableElementByClassName(oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_ROW_CLASS);
};

/**
 * Return the table header
 * @return {Element|null} thead DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableHeader = function () {
  return this._getTableElementByClassName(oj.TableDomUtils.CSS_CLASSES._TABLE_HEADER_CLASS, true);
};

/**
 * Return table column header
 * @param {number} columnIdx  column index
 * @return {Element|null} th DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableHeaderColumn = function (columnIdx) {
  var headerColumns = this.getTableHeaderColumns();

  if (!headerColumns) {
    return null;
  }

  if (headerColumns.length > columnIdx && columnIdx >= 0) {
    return headerColumns[columnIdx];
  }

  return null;
};

/**
 * Get checkbox cell for accessibility column selection
 * @param {number} columnIdx  column index
 * @return {Element|null} td DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableHeaderColumnAccSelect = function (columnIdx) {
  var headerColumn = this.getTableHeaderColumn(columnIdx);

  if (headerColumn != null) {
    var accSelectionCell = this.getTableElementsByClassName(headerColumn,
      oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ACC_SELECT_COLUMN_CLASS);

    if (accSelectionCell.length > 0) {
      return accSelectionCell[0];
    }
  }
  return null;
};

/**
 * Return resize indicator
 * @return {Element} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableHeaderColumnResizeIndicator = function () {
  return this._getTableElementByClassName(
    oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_RESIZE_INDICATOR_CLASS, true);
};

/**
 * Return all table column headers
 * @return {Array|null} array of th DOM elements
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableHeaderColumns = function () {
  var tableHeaderRow = this.getTableHeaderRow();

  if (tableHeaderRow != null) {
    var headerColumnElements = this.getTableElementsByClassName(tableHeaderRow,
      oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS);

    if (headerColumnElements.length > 0) {
      return headerColumnElements;
    }
  }

  return null;
};

/**
 * Return all logical table column headers
 * @return {Array|null} array of th DOM elements
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableHeaderLogicalColumns = function () {
  var tableHeaderColumns = this.getTableHeaderColumns();
  if (!tableHeaderColumns) {
    return null;
  }

  return this._getColspanLogicalElements(tableHeaderColumns);
};

/**
 * Return table header row
 * @return {Element|null} th DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableHeaderRow = function () {
  return this._getTableElementByClassName(oj.TableDomUtils.CSS_CLASSES._TABLE_HEADER_ROW_CLASS);
};

/**
 * Return the table DOM element id.
 * @return {string} Id for table
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableId = function () {
  if (!this._tableId) {
    // Id for custom element is on the container
    var idElem = this.component._IsCustomElement() ? this.getTableContainer() : this.getTable();
    this._tableId = idElem.getAttribute(oj.TableDomUtils.DOM_ATTR._ID);
  }
  return this._tableId;
};

/**
 * Return the table status accessibility notification
 * @return {Element|null} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableStatusAccNotification = function () {
  return this._getTableElementByClassName(
    oj.TableDomUtils.CSS_CLASSES._TABLE_STATUS_ACC_NOTIFICATION_CLASS, true);
};

/**
 * Return the table status message element
 * @return {Element|null} div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableStatusMessage = function () {
  return this._getTableElementByClassName(
    oj.TableDomUtils.CSS_CLASSES._TABLE_STATUS_MESSAGE_CLASS, true);
};

/**
 * Return the unique identifier for the table. If the DOM element has an id then
 * return that. If not, generate a random UID.
 * @return {string} UID for table
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableUID = function () {
  if (!this._tableUID) {
    var uid = this.getTableId();

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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.hashCode = function (str) {
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.insertTableBodyCell =
  function (rowIdx, rowKey, rowHashCode, columnIdx, tableBodyCell, tableBodyRow, isNew) {
    this.setTableBodyCellAttributes(rowIdx, rowKey, rowHashCode, columnIdx, tableBodyCell);

    if (isNew) {
      // if it's a new row then the cells are appended in order
      // so don't bother trying to find the position to insert to
      tableBodyRow.appendChild(tableBodyCell); // @HTMLUpdateOK
      return tableBodyCell;
    }

    if (columnIdx === 0) {
      // insert right after the acc cell
      var accSelectionCell = this.getTableElementsByClassName(tableBodyRow,
        oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_ACC_SELECT_CLASS);

      if (accSelectionCell.length > 0) {
        accSelectionCell = accSelectionCell[0];
        accSelectionCell.parentNode.insertBefore(tableBodyCell, accSelectionCell.nextSibling); // @HTMLUpdateOK
      } else {
        // just prepend it
        tableBodyRow.insertBefore(tableBodyCell, tableBodyRow.firstChild); // @HTMLUpdateOK
      }
    } else {
      var tableBodyCells = this.getTableElementsByClassName(tableBodyRow,
        oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS);

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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.insertTableBodyRow = function (rowIdx, tableBodyRow, row, docFrag) {
  this.setTableBodyRowAttributes(row, tableBodyRow);

  if (docFrag == null) {
    var tableBody = this.getTableBody();
    var tableBodyRows = this.getTableBodyRows(true);

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
  this.clearCachedDomRowData();
};

/**
 * Insert a td element in the appropriate place in the DOM
 * @param {number} columnIdx  column index
 * @param {Element} tableFooterCell  DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.insertTableFooterCell = function (columnIdx, tableFooterCell) {
  var tableFooterRow = this.getTableFooterRow();
  var tableFooterCells = this.getTableElementsByClassName(tableFooterRow,
    oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS);

  if (columnIdx === 0) {
    // insert right after the acc cell
    var accFooterCell = this.getTableElementsByClassName(tableFooterRow,
      oj.TableDomUtils.CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);

    if (accFooterCell.length > 0) {
      accFooterCell = accFooterCell[0];
      accFooterCell.parentNode.insertBefore(tableFooterCell, accFooterCell.nextSibling); // @HTMLUpdateOK
    } else {
      // just prepend it
      tableFooterRow.insertBefore(tableFooterCell, tableFooterRow.firstChild); // @HTMLUpdateOK
    }
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.insertTableHeaderColumn = function (columnIdx, tableHeaderColumn) {
  var tableHeaderRow = this.getTableHeaderRow();
  var tableHeaderColumns = this.getTableHeaderColumns();
  // save the column index on the element
  this.setTableHeaderColumnAttributes(columnIdx, tableHeaderColumn);

  // if there is an existing th at the index then replace it
  var oldTableHeaderColumn = this.getTableHeaderColumn(columnIdx);
  if (oldTableHeaderColumn) {
    $(oldTableHeaderColumn).replaceWith($(tableHeaderColumn)); // @HTMLUpdateOK
  } else if (columnIdx === 0) {
      // insert right after the acc column
    var accSelectionColumn = this.getTableElementsByClassName(tableHeaderRow,
      oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ACC_SELECT_ROW_CLASS);

    if (accSelectionColumn.length > 0) {
      accSelectionColumn = accSelectionColumn[0];
      accSelectionColumn.parentNode.insertBefore(tableHeaderColumn,
                                                 accSelectionColumn.nextSibling); // @HTMLUpdateOK
    } else {
      // just prepend it
      tableHeaderRow.insertBefore(tableHeaderColumn, tableHeaderRow.firstChild); // @HTMLUpdateOK
    }
  } else if (tableHeaderColumns && tableHeaderColumns.length >= columnIdx) {
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
  * @return {Array} First element is height boolean, followed by width boolean.
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype.getTableContainerScrollableState = function () {
  var tableContainer = this.getTableContainer();
  var table = this.getTable();
  var isTableStatusMessageShown = this.component._isStatusMessageShown();
  if (isTableStatusMessageShown) {
    this.component._hideStatusMessage();
  }

  var result = [];
  if (tableContainer.clientHeight > 0) {
    // don't use tableContainer[0].scrollHeight as it may not be accurate
    if (table.clientHeight > tableContainer.clientHeight) {
      // overflow
      result[0] = 1;
    } else if (tableContainer.clientHeight - table.clientHeight > 1) {
      // underflow
      result[0] = -1;
    } else {
      result[0] = 0;
    }
  } else {
    result[0] = 0;
  }

  if (tableContainer.clientWidth > 0) {
    if (table.clientWidth > tableContainer.clientWidth) {
      // overflow
      result[1] = 1;
    } else if (tableContainer.clientWidth - table.clientWidth > 1) {
      // underflow
      result[1] = -1;
    } else {
      result[1] = 0;
    }
  } else {
    result[1] = 0;
  }

  if (isTableStatusMessageShown) {
    this.component._showStatusMessage();
  }
  return result;
};

/**
 * Move the top touch affordance to the table row.
 * @param {number=} rowIdx  row index
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.moveTableBodyRowTouchSelectionAffordanceTop = function (rowIdx) {
  var topAffordance = this.getTableBodyRowTouchSelectionAffordanceTop();

  if (topAffordance != null) {
    if (rowIdx != null) {
      $(topAffordance).data('rowIdx', rowIdx);
      $(topAffordance.children[0]).data('rowIdx', rowIdx);
    } else {
      // eslint-disable-next-line no-param-reassign
      rowIdx = $(topAffordance).data('rowIdx');
    }
    var tableBody = this.getTableBody();
    var tableBodyRow = this.getTableBodyRow(rowIdx);
    var tableBodyRowRect = tableBodyRow.getBoundingClientRect();
    var touchAffordanceGlassPane = this.getTouchAffordanceGlassPane();
    var touchAffordanceGlassPaneRect = touchAffordanceGlassPane.getBoundingClientRect();
    topAffordance.style[oj.TableDomUtils.CSS_PROP._TOP] =
      (tableBodyRowRect.top - touchAffordanceGlassPaneRect.top - (topAffordance.clientHeight / 2)) +
      oj.TableDomUtils.CSS_VAL._PX;
    topAffordance.style[oj.TableDomUtils.CSS_PROP._LEFT] =
      (tableBody.clientWidth / 2) + oj.TableDomUtils.CSS_VAL._PX;
  }
};

/**
 * Move the bottom touch affordance to the table row.
 * @param {number=} rowIdx  row index
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.moveTableBodyRowTouchSelectionAffordanceBottom = function (rowIdx) {
  var bottomAffordance = this.getTableBodyRowTouchSelectionAffordanceBottom();

  if (bottomAffordance != null) {
    if (rowIdx != null) {
      $(bottomAffordance).data('rowIdx', rowIdx);
      $(bottomAffordance.children[0]).data('rowIdx', rowIdx);
    } else {
      // eslint-disable-next-line no-param-reassign
      rowIdx = $(bottomAffordance).data('rowIdx');
    }
    var tableBody = this.getTableBody();
    var tableBodyRow = this.getTableBodyRow(rowIdx);
    var tableBodyRowRect = tableBodyRow.getBoundingClientRect();
    var touchAffordanceGlassPane = this.getTouchAffordanceGlassPane();
    var touchAffordanceGlassPaneRect = touchAffordanceGlassPane.getBoundingClientRect();
    bottomAffordance.style[oj.TableDomUtils.CSS_PROP._TOP] =
      (((tableBodyRowRect.top - touchAffordanceGlassPaneRect.top) + tableBodyRowRect.height) -
       (bottomAffordance.clientHeight / 2)) + oj.TableDomUtils.CSS_VAL._PX;
    bottomAffordance.style[oj.TableDomUtils.CSS_PROP._LEFT] =
      (tableBody.clientWidth / 2) + oj.TableDomUtils.CSS_VAL._PX;
  }
};

/**
 * Move the column to the destination index. If there is already a column at destIdx,
 * then insert before it.
 * @param {number} columnIdx  column index
 * @param {number} destIdx column index
 * @param {Object} event
 * @return {Array} Array of moved columns map
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.moveTableHeaderColumn = function (columnIdx, destIdx, event) {
  var columns = this.component._getColumnDefs();

  var tableHeaderColumn = this.getTableHeaderColumn(columnIdx);
  var tableFooterCell = this.getTableFooterCell(columnIdx);
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
    colSpan = tableHeaderColumn.getAttribute(oj.TableDomUtils.DOM_ATTR._COLSPAN);
    destTableHeaderColumn = this.getTableHeaderColumn(destIdx);

    if (destTableHeaderColumn != null &&
        (colSpan == null || colSpan === 1)) {
      if (afterColumn) {
        destTableHeaderColumn.parentNode.insertBefore(tableHeaderColumn,
                                                      destTableHeaderColumn.nextSibling); // @HTMLUpdateOK
      } else {
        destTableHeaderColumn.parentNode.insertBefore(tableHeaderColumn,
                                                      destTableHeaderColumn); // @HTMLUpdateOK
      }
    }
  }

  if (tableFooterCell != null) {
    colSpan = tableFooterCell.getAttribute(oj.TableDomUtils.DOM_ATTR._COLSPAN);
    destTableFooterCell = this.getTableFooterCell(destIdx);

    if (destTableFooterCell != null &&
        (colSpan == null || colSpan === 1)) {
      if (afterColumn) {
        destTableFooterCell.parentNode.insertBefore(tableFooterCell,
                                                    destTableFooterCell.nextSibling); // @HTMLUpdateOK
      } else {
        destTableFooterCell.parentNode.insertBefore(tableFooterCell, destTableFooterCell); // @HTMLUpdateOK
      }
    }
  }

  var tableBodyRows = this.getTableBodyRows();
  var i;

  if (tableBodyRows != null) {
    for (i = 0; i < tableBodyRows.length; i++) {
      tableBodyCell = this.getTableBodyCell(i, columnIdx, null);

      if (tableBodyCell != null) {
        destTableBodyCell = this.getTableBodyCell(i, destIdx, null);
        colSpan = tableBodyCell.getAttribute(oj.TableDomUtils.DOM_ATTR._COLSPAN);

        if (destTableBodyCell != null &&
            (colSpan == null || colSpan === 1)) {
          if (afterColumn) {
            destTableBodyCell.parentNode.insertBefore(tableBodyCell,
                                                      destTableBodyCell.nextSibling); // @HTMLUpdateOK
          } else {
            destTableBodyCell.parentNode.insertBefore(tableBodyCell, destTableBodyCell); // @HTMLUpdateOK
          }
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
  var columnDef = this.component._columnDefArray.splice(columnIdx, 1);
  this.component._columnDefArray.splice(destColIdx, 0, columnDef[0]);
  if (!this._columnsDestMap) {
    this._columnsDestMap = [];
    for (i = 0; i < clonedColumnsOption.length; i++) {
      this._columnsDestMap[i] = i;
    }
  }
  var columnsDestMapItem = this._columnsDestMap.splice(columnIdx, 1);
  this._columnsDestMap.splice(destColIdx, 0, columnsDestMapItem[0]);

  // clone the array so we can trigger that it's changed
  this.component.option('columns', clonedColumnsOption, {
    _context: {
      writeback: true,
      originalEvent: event,
      internalSet: true
    }
  });
  this.component._queueTask(function () {});

  return this._columnsDestMap;
};

/**
 * Refresh any translated strings in the context menu.
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.refreshContextMenu = function () {
  var self = this;
  var menuContainer = this._menuContainer;

  if (menuContainer) {
    var listItems = menuContainer.querySelectorAll('[data-oj-command]');
    var i;
    for (i = 0; i < listItems.length; i++) {
      var contextMenuLabel = $(listItems[i]).children(oj.TableDomUtils.DOM_ELEMENT._A);
      if (contextMenuLabel.length > 0) {
        var command = listItems[i].getAttribute('data-oj-command').split('-');
        command = command[command.length - 1];

        var commandString;
        if (command === 'sort') {
          commandString = self.component.getTranslatedString('labelSort');
        } else if (command === 'sortAsc') {
          commandString = self.component.getTranslatedString('labelSortAsc');
        } else if (command === 'sortDsc') {
          commandString = self.component.getTranslatedString('labelSortDsc');
        } else if (command === 'resize') {
          commandString = self.component.getTranslatedString('labelResize');
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.removeDragOverIndicatorColumn = function () {
  var table = this.getTable();
  var indicatorElements = this.tableQuerySelectorAll(table,
    '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS + ',' +
      '.' + oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS);

  var i = 0;
  var indicatorElementsCount = indicatorElements.length;

  for (i = 0; i < indicatorElementsCount; i++) {
    indicatorElements[i].classList.remove(
      oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS);
    indicatorElements[i].classList.remove(
      oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS);
  }
};

/**
 * Remove the visual indicator for row drag over
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.removeDragOverIndicatorRow = function () {
  var tableBody = this.getTableBody();
  var indicatorRowBeforeElements = this.getTableElementsByClassName(tableBody,
    oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_DRAG_INDICATOR_BEFORE_CLASS);
  var indicatorRowAfterElements = this.getTableElementsByClassName(tableBody,
    oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_DRAG_INDICATOR_AFTER_CLASS);

  var i;
  var indicatorRowBeforeElementsCount = indicatorRowBeforeElements.length;
  for (i = 0; i < indicatorRowBeforeElementsCount; i++) {
    $(indicatorRowBeforeElements[i]).remove();
  }

  var indicatorRowAfterElementsCount = indicatorRowAfterElements.length;
  for (i = 0; i < indicatorRowAfterElementsCount; i++) {
    $(indicatorRowAfterElements[i]).remove();
  }

  var tableBodyRows = this.getTableBodyRows();

  if (tableBodyRows == null || tableBodyRows.length === 0) {
    this.component._showNoDataMessage();
  }
};

/**
 * Remove a tr element from the tbody DOM
 * @param {number} rowIdx  row index
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.removeTableBodyRow = function (rowIdx) {
  var tableBodyRow = this.getTableBodyRow(rowIdx);
  if (tableBodyRow != null) {
    Components.subtreeDetached(tableBodyRow);

    if (this.component._hasCellTemplate) {
      this.component._cleanTemplateNodes(tableBodyRow);
      // No need to set this.component._hasCellTemplate to false here since only one row is removed
    }

    $(tableBodyRow).remove();
    this.clearCachedDomRowData();
  }
};

/**
 * Remove all tr elements from the tbody DOM
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.removeAllTableBodyRows = function () {
  var tableBodyRows = this.getTableBodyRows();

  if (tableBodyRows != null && tableBodyRows.length > 0) {
    var tableBody = this.getTableBody();
    if (tableBody != null) {
      Components.subtreeDetached(tableBody);

      if (this.component._hasCellTemplate) {
        this.component._cleanTemplateNodes(tableBody);
        this.component._hasCellTemplate = false;

        // need to re-register DOM event listeners after cleaning the node
        this.component._registerDomEventListeners();
      }

      $(tableBody).empty();
    }
    this.clearCachedDomRowData();
  }
};

/**
 * Finds and removes the touch selection icons from the DOM
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.removeTableBodyRowTouchSelectionAffordance = function () {
  var tableContainer = this.getTableContainer();
  var touchAffordance = this.getTableElementsByClassName(tableContainer,
    oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_TOUCH_SELECTION_AFFORDANCE_TOUCH_AREA_CLASS);

  var i;
  for (i = 0; i < touchAffordance.length; i++) {
    $(touchAffordance[i]).remove();
  }
};

/**
 * Remove the drag image for the column
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.removeTableHeaderColumnDragImage = function () {
  var tableContainer = this.getTableContainer();
  var headerDragImage = this.getTableElementsByClassName(tableContainer,
    oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_DRAG_IMAGE);

  var headerDragImageCount = headerDragImage.length;
  for (var i = 0; i < headerDragImageCount; i++) {
    $(headerDragImage[i]).remove();
  }
};

/**
 * Remove resize indicator
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.removeTableHeaderColumnResizeIndicator = function () {
  var tableHeaderColumnResizeIndicator = this.getTableHeaderColumnResizeIndicator();
  if (tableHeaderColumnResizeIndicator) {
    $(tableHeaderColumnResizeIndicator).remove();
    this._clearCachedDom(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_RESIZE_INDICATOR_CLASS);
  }
};

/**
 * Set the element scrollLeft
 * @param {Element} element DOM element
 * @param {number} scrollLeft scrollLeft
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.setScrollLeft = function (element, scrollLeft) {
  if (this.component._GetReadingDirection() === 'rtl') {
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.setTableBodyCellAttributes =
  function (rowIdx, rowKey, rowHashCode, columnIdx, tableBodyCell) {
    // if cell already has an id then bail
    var cellId = tableBodyCell.getAttribute(oj.TableDomUtils.DOM_ATTR._ID);

    if (cellId != null &&
        cellId.length > 0) {
      return;
    }

    var accessibility = this.options.accessibility;
    var column = this.component._getColumnDefs()[columnIdx];

    if (column == null) {
      return;
    }

    var rowHeaderColumnId = null;
    var isTableHeaderless = this.component._isTableHeaderless();

    if (accessibility != null && accessibility.rowHeader != null) {
      rowHeaderColumnId = accessibility.rowHeader;
    } else {
      rowHeaderColumnId = this.component._getColumnDefs()[0].id;
    }

    var rowKeyStr = rowKey != null ? rowKey.toString() : rowIdx.toString();

    var rowKeyStrHashCode = rowHashCode == null ? this.hashCode(rowKeyStr) : rowHashCode;

    var cellRowHeaderId = this.getTableId() + ':' + rowHeaderColumnId + '_' + rowKeyStrHashCode;

    var headers = this.getTableId() + ':' + column.id;
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
    tableBodyCell.setAttribute(oj.TableDomUtils.DOM_ATTR._ID, cellId);

    if (!tableBodyCell.getAttribute(oj.TableDomUtils.DOM_ATTR._HEADERS)) {
      tableBodyCell.setAttribute(oj.TableDomUtils.DOM_ATTR._HEADERS, headers);
    }
  };

/**
 * Set the attributes on the row like rowIdx, etc
 * @param {Object} row row
 * @param {Element} tableBodyRow  tr DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.setTableBodyRowAttributes = function (row, tableBodyRow) {
  $(tableBodyRow).data('rowKey', row.key);
  $(tableBodyRow).data('rowData', row.data);
};

/**
 * Set the attributes on the header like columndx, etc
 * @param {number} columnIdx  column index
 * @param {Element} tableHeaderColumn  th DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.setTableHeaderColumnAttributes =
  function (columnIdx, tableHeaderColumn) {
    var column = this.component._getColumnDefs()[columnIdx];

    if (!tableHeaderColumn.getAttribute(oj.TableDomUtils.DOM_ATTR._ID)) {
      tableHeaderColumn.setAttribute(oj.TableDomUtils.DOM_ATTR._ID,
                                     this.getTableId() + ':' + column.id);
    }
  };

/**
 * Set the css class from all the cells in a column with the styleClass
 * @param {number|null} columnIdx  column index
 * @param {boolean} add add or remove the class
 * @param {string} styleClass style class
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.setTableColumnCellsClass = function (columnIdx, add, styleClass) {
  var i;
  var tableBodyRows = this.getTableBodyRows();
  if (tableBodyRows != null && tableBodyRows.length > 0) {
    if (columnIdx === null) {
      var tableBodyCells = null;
      var tableBody = this.getTableBody();
      if (!add) {
        tableBodyCells = this.getTableElementsByClassName(tableBody, styleClass);
      } else {
        tableBodyCells = this.getTableElementsByTagName(tableBody,
          oj.TableDomUtils.DOM_ELEMENT._TD);
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
        var tableBodyCell = this.getTableBodyCell(i, columnIdx, null);

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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.setTableBodyMessage = function (message) {
  var tableBodyMessageCell = this.getTableBodyMessageCell();
  $(tableBodyMessageCell).empty();
  tableBodyMessageCell.appendChild(document.createTextNode(message)); // @HTMLUpdateOK
};

/**
 * Set the table accessibility notification.
 * @param {string} status
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.setTableStatusAccNotification = function (status) {
  var statusNotification = this.getTableStatusAccNotification();
  $(statusNotification).empty();
  statusNotification.appendChild(document.createTextNode(status)); // @HTMLUpdateOK
};

/**
 * Style the initial table
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.styleInitialTable = function () {
  var table = this.getTable();
  var tableHeader = this.getTableElementsByTagName(table, oj.TableDomUtils.DOM_ELEMENT._THEAD);
  tableHeader = tableHeader.length > 0 ? tableHeader[0] : null;
  var tableFooter = this.getTableElementsByTagName(table, oj.TableDomUtils.DOM_ELEMENT._TFOOT);
  tableFooter = tableFooter.length > 0 ? tableFooter[0] : null;
  var tableBody = this.getTableElementsByTagName(table, oj.TableDomUtils.DOM_ELEMENT._TBODY);
  tableBody = tableBody.length > 0 ? tableBody[0] : null;

  // set the tabindex
  var tabIndex = parseInt(this.component._getRootElement()
    .getAttribute(oj.TableDomUtils.DOM_ATTR._TABINDEX), 10);
  if (tabIndex !== -1) {
    table.setAttribute(oj.TableDomUtils.DOM_ATTR._TABINDEX, '0');
    // set focusable
    this.component._focusable({
      element: table,
      applyHighlight: true,
      setupHandlers: this._focusSetupHandlers.bind(this)
    });
  } else {
    table.setAttribute(oj.TableDomUtils.DOM_ATTR._TABINDEX, '-1');
    var noop = function () {};
    this._focusSetupHandlers(noop, noop);
  }

  this.styleTableHeader(tableHeader);
  this.styleTableFooter(tableFooter);
  this.styleTableBody(tableBody);
};

/**
 * Style the tbody element
 * @param {Element} tableBody tbody DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.styleTableBody = function (tableBody) {
  tableBody.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_BODY_CLASS);
  // Add a special marker attribute to tell child components that they are container within table
  tableBody.setAttribute(Components._OJ_CONTAINER_ATTR, this.component.widgetName);

  // ensure proper role is set for wai-aria
  tableBody.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'rowgroup');
};

/**
 * Style the td element
 * @param {number} columnIdx  column index
 * @param {Element} tableBodyCell  td DOM element
 * @param {boolean} isNew is new cell
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.styleTableBodyCell = function (columnIdx, tableBodyCell, isNew) {
  var column = this.component._getColumnDefs()[columnIdx];

  // ensure proper role is set for wai-aria
  tableBodyCell.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'cell');

  if (isNew ||
      !tableBodyCell.classList.contains(oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS)) {
    tableBodyCell.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_CLASS);
    tableBodyCell.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_DATE_CELL_FORM_CONTROL_CLASS);
  }

  // add the column option stuff in here since we only want to do this once when adding
  // the table data cell class. Column option styling or class can be overridden
  // later in a custom renderer
  if (column != null && column.style != null &&
      (isNew || tableBodyCell.getAttribute(oj.TableDomUtils.DOM_ATTR._STYLE) !== column.style)) {
    tableBodyCell.setAttribute(oj.TableDomUtils.DOM_ATTR._STYLE, column.style);
  }
  // Use jquery hasClass and addClass because column.className can contain multiple classes
  if (column != null && column.className != null &&
      (isNew || !$(tableBodyCell).hasClass(column.className))) {
    $(tableBodyCell).addClass(column.className);
  }

  if (this._isVerticalGridEnabled() && (isNew ||
      !tableBodyCell.classList.contains(oj.TableDomUtils.CSS_CLASSES._TABLE_VGRID_LINES_CLASS))) {
    tableBodyCell.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_VGRID_LINES_CLASS);
  }
};

/**
 * Style the tr element
 * @param {Element} tableBodyRow  tr DOM element
 * @param {boolean} isNew is new row
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.styleTableBodyRow = function (tableBodyRow, isNew) {
  // ensure proper role is set for wai-aria
  tableBodyRow.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'row');
  tableBodyRow.setAttribute(Context._OJ_CONTEXT_ATTRIBUTE, '');

  if (isNew ||
      !tableBodyRow.classList.contains(oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_CLASS)) {
    tableBodyRow.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_ROW_CLASS);
  }
};

/**
 * Style the table container
 * @param {Element} tableContainer  div DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.styleTableContainer = function (tableContainer) {
  if (this.options.display === oj.TableDomUtils._OPTION_DISPLAY._GRID) {
    tableContainer.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_COMPACT_CLASS);
  } else {
    tableContainer.classList.remove(oj.TableDomUtils.CSS_CLASSES._TABLE_COMPACT_CLASS);
  }
  var editMode = this.options.editMode;

  if (editMode != null && editMode !== this.component._OPTION_EDIT_MODE._NONE) {
    tableContainer.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_EDIT_CLASS);
  } else {
    tableContainer.classList.remove(oj.TableDomUtils.CSS_CLASSES._TABLE_EDIT_CLASS);
  }

  if (this._isHorizontalGridEnabled()) {
    tableContainer.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_HGRID_CLASS);
  } else {
    tableContainer.classList.remove(oj.TableDomUtils.CSS_CLASSES._TABLE_HGRID_CLASS);
  }
};

/**
 * Style the tfoot element
 * @param {Element} tableFooter tfoot DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.styleTableFooter = function (tableFooter) {
  if (!tableFooter) {
    return;
  }
  tableFooter.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CLASS);
  var tableFooterRow = this.getTableElementsByTagName(tableFooter,
    oj.TableDomUtils.DOM_ELEMENT._TR)[0];
  tableFooterRow.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_ROW_CLASS);

  // ensure proper role is set for wai-aria
  tableFooter.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'rowgroup');
  tableFooterRow.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'row');
};

/**
 * Style the td element
 * @param {number} columnIdx  column index
 * @param {Element} tableFooterCell  td DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.styleTableFooterCell = function (columnIdx, tableFooterCell) {
  var column = this.component._getColumnDefs()[columnIdx];

  if (column.footerStyle != null) {
    tableFooterCell.setAttribute(oj.TableDomUtils.DOM_ATTR._STYLE, column.footerStyle);
  }
  if (!tableFooterCell.classList.contains(oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS)) {
    tableFooterCell.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_FOOTER_CELL_CLASS);
  }
  if (this._isVerticalGridEnabled() &&
      !tableFooterCell.classList.contains(oj.TableDomUtils.CSS_CLASSES._TABLE_VGRID_LINES_CLASS)) {
    tableFooterCell.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_VGRID_LINES_CLASS);
  }
  if (column.footerClassName) {
    // Use jquery addClass because column.footerClassName can contain multiple classes
    $(tableFooterCell).addClass(column.footerClassName);
  }

  // ensure proper role is set for wai-aria
  tableFooterCell.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'cell');
};

/**
 * Style the thead element
 * @param {Element} tableHeader thead DOM element
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.styleTableHeader = function (tableHeader) {
  if (!tableHeader) {
    return;
  }
  tableHeader.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_HEADER_CLASS);
  // eslint-disable-next-line no-param-reassign
  tableHeader.style[oj.TableDomUtils.CSS_PROP._DISPLAY] = 'table-header-group';
  var tableHeaderRow = this.getTableElementsByTagName(tableHeader,
    oj.TableDomUtils.DOM_ELEMENT._TR)[0];
  tableHeaderRow.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_HEADER_ROW_CLASS);
  tableHeaderRow.style[oj.TableDomUtils.CSS_PROP._POSITION] = oj.TableDomUtils.CSS_VAL._RELATIVE;

  // ensure proper role is set for wai-aria
  tableHeader.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'rowgroup');
  tableHeaderRow.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'row');
};

/**
 * Style the th element
 * @param {number} columnIdx  column index
 * @param {Element} tableHeaderColumn  th DOM element
 * @param {boolean} isNew is new column
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.styleTableHeaderColumn =
  function (columnIdx, tableHeaderColumn, isNew) {
    var column = this.component._getColumnDefs()[columnIdx];

    // ensure proper role is set for wai-aria
    tableHeaderColumn.setAttribute(oj.TableDomUtils.DOM_ATTR._ROLE, 'columnheader');

    if (isNew || !tableHeaderColumn.classList.contains(
      oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS)) {
      tableHeaderColumn.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CELL_CLASS);
      if (this._isVerticalGridEnabled()) {
        if (isNew || !tableHeaderColumn.classList.contains(
          oj.TableDomUtils.CSS_CLASSES._TABLE_VGRID_LINES_CLASS)) {
          tableHeaderColumn.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_VGRID_LINES_CLASS);
        }
      }
      if (column.headerStyle != null &&
          (isNew ||
           tableHeaderColumn.getAttribute(oj.TableDomUtils.DOM_ATTR._STYLE) !==
           column.headerStyle)) {
        tableHeaderColumn.setAttribute(oj.TableDomUtils.DOM_ATTR._STYLE, column.headerStyle);
      }
      // Use jquery hasClass and addClass because column.headerClassName can contain multiple classes
      if (column.headerClassName != null &&
          (isNew || !$(tableHeaderColumn).hasClass(column.headerClassName))) {
        $(tableHeaderColumn).addClass(column.headerClassName);
      }
    }
  };

/**
 * Return all the colspanned logical elements
 * @param {Array} elementArray array of DOM elements
 * @return {Array|null} array of DOM elements
 * @memberof oj.TableDomUtils
 * @private
 */
oj.TableDomUtils.prototype._getColspanLogicalElements = function (elementArray) {
  var indexedElementArrayNum = 0;
  var indexedElementArray = [];
  var elementArrayCount = elementArray.length;
  for (var i = 0; i < elementArrayCount; i++) {
    var colSpan = elementArray[i].getAttribute(oj.TableDomUtils.DOM_ATTR._COLSPAN);
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
  * @private
  * @return {boolean} enabled
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._isHorizontalGridEnabled = function () {
  if (this.options.horizontalGridVisible === oj.TableDomUtils._OPTION_ENABLED ||
      this.options.horizontalGridVisible === oj.TableDomUtils._OPTION_AUTO) {
    return true;
  }
  return false;
};

/**
  * Helper function which returns if the vertical grid lines are enabled.
  * @private
  * @return {boolean} enabled
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._isVerticalGridEnabled = function () {
  if (this.options.verticalGridVisible === oj.TableDomUtils._OPTION_ENABLED ||
      (this.options.verticalGridVisible === oj.TableDomUtils._OPTION_AUTO &&
       this.options.display === oj.TableDomUtils._OPTION_DISPLAY._GRID)) {
    return true;
  }
  return false;
};

/**
  * Helper function which returns if the browser is FF
  * @private
  * @memberof oj.TableDomUtils
  * @return {boolean} FF
  */
oj.TableDomUtils.prototype._isFF = function () {
  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    return true;
  }
  return false;
};

/**
  * Helper function which returns if the browser is IE and if so the version.
  * @private
  * @memberof oj.TableDomUtils
  * @return {number|null} IE version. null if not IE.
  */
oj.TableDomUtils.prototype._isIE = function () {
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
  * @private
  * @memberof oj.TableDomUtils
  * @return {boolean} webkit
  */
oj.TableDomUtils.prototype._isWebkit = function () {
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
oj.TableDomUtils.prototype.isSizingRefreshRequired = function (width, height) {
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
  var tableContainer = this.getTableContainer();
  return tableContainer.offsetWidth > 0 && tableContainer.offsetHeight > 0;
};

/**
 * Refresh the table dimensions
 * @param {number=} width  table container width
 * @param {number=} height  table container height
 * @param {boolean=} skipRequiredCheck true if the 'isSizingRefreshRequired' check should be skipped
 * @memberof oj.TableDomUtils
 * @private
 */
oj.TableDomUtils.prototype.refreshTableDimensions = function (width, height, skipRequiredCheck) {
  if (!skipRequiredCheck && !this.isSizingRefreshRequired(width, height)) {
    return;
  }
  var table = this.getTable();
  var tableContainer = this.getTableContainer();
  var tableHeader = this.getTableHeader();
  var tableBody = this.getTableBody();
  var tableFooter = this.getTableFooter();
  var tableBottomSlot = this.getTableBottomSlot();

  // preserve the scrollTop & scrollLeft
  var scrollTop = null;
  var scrollLeft = null;
  if (this.component._scrollTop != null &&
      this.component._scrollTop > 0) {
    scrollTop = this.component._scrollTop;
  }
  if (this.component._scrollLeft != null &&
      this.component._scrollLeft > 0) {
    scrollLeft = this.component._scrollLeft;
  }

  // first remove any styling so that the browser sizes the table
  this.component._clearCachedDimensions();
  this._removeTableDimensionsStyling();
  this.styleTableContainer(tableContainer);

  // set the forced column widths before checking for scroll state, otherwise we
  // may miss cases where the columns[].width attribute values cause overflow
  this._setForcedColumnWidths();
  var tableContainerScrollableState = this.getTableContainerScrollableState();
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

  if (this._tableHeightConstrained || this._tableWidthConstrained) {
    // Add the oj-table-scroll class because some styling only applies to scrollable table.
    tableContainer.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_SCROLL_CLASS);
    var containerClientWidth = tableContainer.clientWidth;
    var containerClientHeight = tableContainer.clientHeight;

    // If there is overflow in only one direction, we need to check if the addition of
    // scrollbars will cause overflow in the other direction as well
    var browserScrollBarSize = this.getDefaultScrollBarSize();
    if (browserScrollBarSize > 0) {
      if (!this._tableWidthConstrained && !this._isVerticalScrollBarHidden()) {
        // determine if width is set on the container by seeing if it adjusts when inner table width increases
        table.style[oj.TableDomUtils.CSS_PROP._WIDTH] =
          (containerClientWidth + browserScrollBarSize) + oj.TableDomUtils.CSS_VAL._PX;
        if (tableContainer.clientWidth < containerClientWidth + browserScrollBarSize) {
          containerClientWidth = tableContainer.clientWidth;
          table.style[oj.TableDomUtils.CSS_PROP._WIDTH] =
            (containerClientWidth - browserScrollBarSize) + oj.TableDomUtils.CSS_VAL._PX;
          if (containerClientWidth - browserScrollBarSize < table.clientWidth) {
            this._tableWidthConstrained = true;
          }
        } else {
          containerClientWidth = tableContainer.clientWidth;
          table.style[oj.TableDomUtils.CSS_PROP._WIDTH] = '';
        }
      } else if (!this._tableHeightConstrained) {
        // determine if height is set on the container by seeing if it adjusts when inner table height increases
        table.style[oj.TableDomUtils.CSS_PROP._HEIGHT] =
          (containerClientHeight + browserScrollBarSize) + oj.TableDomUtils.CSS_VAL._PX;
        if (tableContainer.clientHeight < containerClientHeight + browserScrollBarSize) {
          containerClientHeight = tableContainer.clientHeight;
          table.style[oj.TableDomUtils.CSS_PROP._HEIGHT] =
            (containerClientHeight - browserScrollBarSize) + oj.TableDomUtils.CSS_VAL._PX;
          if (containerClientHeight - browserScrollBarSize < table.clientHeight) {
            this._tableHeightConstrained = true;
          }
        } else {
          containerClientHeight = tableContainer.clientHeight;
          table.style[oj.TableDomUtils.CSS_PROP._HEIGHT] = '';
        }
      }
    }

    // hide the vertical scrollbar
    if (this._tableHeightConstrained && this._isVerticalScrollBarHidden()) {
      tableBody.style[oj.TableDomUtils.CSS_PROP._OVERFLOW_Y] = 'hidden';
    }
    var actualScrollBarWidth = this.getScrollBarWidth();

    // now that overflow is determined, set the column widths
    this._setColumnWidths(actualScrollBarWidth);

    // add in scrolling class for specific vertical or horizontal scrolling
    if (this._tableHeightConstrained) {
      tableContainer.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_SCROLL_VERTICAL_CLASS);
    }
    if (this._tableWidthConstrained) {
      tableContainer.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_SCROLL_HORIZONTAL_CLASS);
    }

    var captionHeight = 0;
    var caption = this.getTableElementsByTagName(table, 'caption');
    if (caption.length > 0) {
      caption = caption[0];
      captionHeight = $(caption).outerHeight();
      caption.style[oj.TableDomUtils.CSS_PROP._DISPLAY] = oj.TableDomUtils.CSS_VAL._INLINE;
      if (tableHeader != null) {
        var tableContainerStyle = window.getComputedStyle(tableContainer);
        tableHeader.style[oj.TableDomUtils.CSS_PROP._BORDER_TOP] =
          tableContainerStyle[oj.TableDomUtils.CSS_PROP._BORDER_TOP];
      }
    }

    // apply the styling which sets the fixed column headers, etc
    var tableHeaderHeight = 0;
    if (tableHeader != null) {
      tableHeaderHeight = $(tableHeader).outerHeight();
    }

    // calculate table body border height before scrollbars may be present
    var tableBodyBorderHeight = tableBody.offsetHeight - tableBody.clientHeight;
    tableBody.style[oj.TableDomUtils.CSS_PROP._WIDTH] =
      containerClientWidth + oj.TableDomUtils.CSS_VAL._PX;

    var tableFooterHeight = 0;
    if (tableFooter != null) {
      tableFooterHeight = $(tableFooter).outerHeight();
      tableBody.style[oj.TableDomUtils.CSS_PROP._TOP] =
        (-1 * tableFooterHeight) + oj.TableDomUtils.CSS_VAL._PX;
    }

    var tableBottomSlotHeight = 0;
    if (tableBottomSlot != null &&
        tableBottomSlot.style[oj.TableDomUtils.CSS_PROP._DISPLAY] !==
        oj.TableDomUtils.CSS_VAL._NONE &&
        tableBottomSlot.clientHeight > 0) {
      tableBottomSlotHeight = $(tableBottomSlot).outerHeight();
    }

    // Size the table body to fit in the height
    var tableBodyHeight = containerClientHeight - tableHeaderHeight - tableFooterHeight -
      captionHeight - tableBottomSlotHeight - tableBodyBorderHeight;
    if (tableBodyHeight > 0) {
      tableBody.style[oj.TableDomUtils.CSS_PROP._HEIGHT] =
        tableBodyHeight + oj.TableDomUtils.CSS_VAL._PX;
      tableBody.style[oj.TableDomUtils.CSS_PROP._MIN_HEIGHT] =
        tableBodyHeight + oj.TableDomUtils.CSS_VAL._PX;
    }

    if (this._tableWidthConstrained) {
      var tableBodyRows = this.getTableBodyRows();
      if (tableBodyRows != null && tableBodyRows.length > 0) {
        if (tableHeader != null) {
          if (actualScrollBarWidth > 0) {
            // if we have scrollbars then size the tableheader to align with the scrollbars
            tableHeader.style[oj.TableDomUtils.CSS_PROP._WIDTH] =
              (containerClientWidth - actualScrollBarWidth) + oj.TableDomUtils.CSS_VAL._PX;
          } else {
            tableHeader.style[oj.TableDomUtils.CSS_PROP._WIDTH] =
              containerClientWidth + oj.TableDomUtils.CSS_VAL._PX;
          }
        }
      } else {
        // if we have no data then use the tableContainer's horizontal scroller
        tableBody.style[oj.TableDomUtils.CSS_PROP._OVERFLOW_X] =
          oj.TableDomUtils.CSS_VAL._HIDDEN;
      }
    } else if (tableHeader != null) {
      tableHeader.style[oj.TableDomUtils.CSS_PROP._WIDTH] =
        containerClientWidth + oj.TableDomUtils.CSS_VAL._PX;
    }

    if (tableFooter != null) {
      tableFooter.style[oj.TableDomUtils.CSS_PROP._TOP] =
        tableBodyHeight + oj.TableDomUtils.CSS_VAL._PX;
    }
  } else if (this._isTableColumnsWidthSet()) {
    // no overflow is present, but column widths still need to be set
    this._setColumnWidths(0);

    // if all columns have a set width, set overall table width to auto to avoid acc column being shown
    if (this._isAllTableColumnsWidthSet()) {
      table.style[oj.TableDomUtils.CSS_PROP._WIDTH] = oj.TableDomUtils.CSS_VAL._AUTO;
    }
  }
  this._setHeaderColumnOverflowWidths();
  this.refreshTableStatusPosition();
  this.refreshTouchAffordanceGlassPanePosition();

  if (scrollTop != null) {
    var maxScrollTop = this.getScroller().scrollHeight - this.getScroller().clientHeight;
    scrollTop = scrollTop > maxScrollTop ? maxScrollTop : scrollTop;
    if (this.component._isLoadMoreOnScroll() && maxScrollTop === scrollTop) {
      // Do not set to maxScrollTop or we will cause another fetch
      scrollTop -= 1;
    }
    // set flag so that scroll() will not cause an scrollPosition update
    this.component._skipScrollUpdate = true;
    this.getScroller().scrollTop = scrollTop;
    $(this.getScroller()).scroll();
  }

  if (scrollLeft != null) {
    // set flag so that scroll() will not cause an scrollPosition update
    this.component._skipScrollUpdate = true;
    this.setScrollLeft(this.getScroller(), scrollLeft);
    $(this.getScroller()).scroll();
  }

  // cache the final dimensions
  this._cacheDomDimensions.tableContainerWidth = tableContainer.offsetWidth;
  this._cacheDomDimensions.tableContainerHeight = tableContainer.offsetHeight;

  if (tableBody) {
    tableBody.style[oj.TableDomUtils.CSS_PROP._VISIBILITY] = '';
  }
  if (tableFooter) {
    tableFooter.style[oj.TableDomUtils.CSS_PROP._VISIBILITY] = '';
  }
};

/**
 * Refresh the table touch affordance glass pane position.
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.refreshTouchAffordanceGlassPanePosition = function () {
  var touchAffordanceGlassPane = this.getTouchAffordanceGlassPane();
  if (touchAffordanceGlassPane) {
    var tableBody = this.getTableBody();
    var tableBodyRect = tableBody.getBoundingClientRect();
    var tableContainer = this.getTableContainer();
    var tableContainerRect = tableContainer.getBoundingClientRect();

    touchAffordanceGlassPane.style[oj.TableDomUtils.CSS_PROP._TOP] =
      (tableBodyRect.top - tableContainerRect.top) + oj.TableDomUtils.CSS_VAL._PX;
    touchAffordanceGlassPane.style[oj.TableDomUtils.CSS_PROP._BOTTOM] =
      (tableBodyRect.bottom - tableContainerRect.bottom) + oj.TableDomUtils.CSS_VAL._PX;

    this.moveTableBodyRowTouchSelectionAffordanceTop();
    this.moveTableBodyRowTouchSelectionAffordanceBottom();
  }
};

/**
 * Refresh the table status position
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.refreshTableStatusPosition = function () {
  // if status message is hidden then return
  if (!this.component._isStatusMessageShown()) {
    return;
  }

  var tableContainer = this.getTableContainer();
  var tableBody = this.getTableBody();
  var tableStatusMessage = this.getTableStatusMessage();

  var overTableElement = tableContainer;

  if (tableBody.clientHeight > 0) {
    overTableElement = tableBody;
  }

  // size the messaging background
  tableStatusMessage.style[oj.TableDomUtils.CSS_PROP._HEIGHT] =
    tableBody.clientHeight + oj.TableDomUtils.CSS_VAL._PX;
  tableStatusMessage.style[oj.TableDomUtils.CSS_PROP._WIDTH] =
    tableBody.clientWidth + oj.TableDomUtils.CSS_VAL._PX;
  var tableStatusMessageText = tableStatusMessage.children[0];
  // refresh the status message position
  var isRTL = (this.component._GetReadingDirection() === 'rtl');
  // position status in the center
  var options = { my: 'center', at: 'center', collision: 'none', of: overTableElement };
  options = oj.PositionUtils.normalizeHorizontalAlignment(options, isRTL);
  (/** @type {Object} */ ($(tableStatusMessage))).position(options);
  var msgTextOptions = { my: 'center', at: 'center', collision: 'none', of: tableStatusMessage };
  msgTextOptions = oj.PositionUtils.normalizeHorizontalAlignment(msgTextOptions, isRTL);
  (/** @type {Object} */ ($(tableStatusMessageText))).position(msgTextOptions);
};

/**
  * Cache DOM Element
  * @param {string} key key for identifying the element
  * @param {Element} element  DOM element
  * @private
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._cacheDomElement = function (key, element) {
  if (!this._domCache) {
    this._domCache = {};
  }
  this._domCache[key] = element;
};

/**
  * Clear the DOM cache
  * @param {string|null} key key for identifying the element
  * @private
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._clearCachedDom = function (key) {
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
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._getCachedDomElement = function (key) {
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
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._isCachedDomElement = function (key) {
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
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._getTableElementByClassName = function (className, onlyChildren) {
  if (!this._isCachedDomElement(className)) {
    var tableContainer = this.getTableContainer();
    if (tableContainer) {
      this._cacheDomElement(className, null);

      if (!onlyChildren) {
        var domElement = this.getTableElementsByClassName(tableContainer, className);
        if (domElement.length > 0) {
          this._cacheDomElement(className, domElement[0]);
        }
      } else {
        this._cacheDomElement(className,
                              this._getChildElementByClassName(tableContainer, className));

        if (this._getCachedDomElement(className) == null) {
          var table = this.getTable();
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
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._getChildElementByClassName = function (parentElement, className) {
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableElementsByClassName = function (parentElement, name, isClone) {
  var elements = parentElement.getElementsByClassName(name);
  return this._filterTableOwnedElements(elements, isClone ? parentElement : null);
};

/**
 * Get descendant elements by tag name. Only those directly owned by this table (or clone of) is included.
 * @param {Element} parentElement parent element
 * @param {string} name tag name to match on
 * @param {boolean=} isClone Whether parentElement is a container clone
 * @return {Array} The matched elements
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getTableElementsByTagName = function (parentElement, name, isClone) {
  var elements = parentElement.getElementsByTagName(name);
  return this._filterTableOwnedElements(elements, isClone ? parentElement : null);
};

/**
 * Get descendant elements by selector. Only those directly owned by this table (or clone of) is included.
 * @param {Element} parentElement parent element
 * @param {string} selector selector
 * @param {boolean=} isClone Whether parentElement is a container clone
 * @return {Array} The matched elements
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.tableQuerySelectorAll = function (parentElement, selector, isClone) {
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype._filterTableOwnedElements = function (elements, containerClone) {
  var tableContainer;
  var table;
  if (!containerClone) {
    tableContainer = this.getTableContainer();
    table = this.getTable();
  } else {
    tableContainer = containerClone;
    var tables = containerClone.getElementsByTagName(oj.TableDomUtils.DOM_ELEMENT._TABLE);
    for (var i = 0; i < tables.length; i++) {
      if (tables[i].parentNode === containerClone) {
        table = tables[i];
        break;
      }
    }
  }
  var self = this;
  return Array.prototype.filter.call(elements, function (element) {
    return self.isTableOwned(element, tableContainer, table);
  });
};

/**
 * Checks whether given element is directly owned by this table, or a clone of this table.
 * @param {Element} element The query element
 * @param {Element=} containerClone The cloned container if querying against a table clone.
 * @param {Element=} tableClone The table child of the cloned container.
 * @return {boolean} Whether the element is directly owned by this table (or clone of).
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.isTableOwned = function (element, containerClone, tableClone) {
  // An element inside this table's container is not directly owned by this table if
  // the element is part of a child oj-table, or part of a child html table
  var tableContainer = containerClone || this.getTableContainer();
  var table = containerClone ? tableClone : this.getTable();
  if (tableContainer) {
    if (table) {
      var elemParentTable = this.getFirstAncestor(element, table.tagName);
      if (elemParentTable === table) {
        return true;
      }
      if (elemParentTable) {
        return false;
      }
    }
    var elemContainer = this.getFirstAncestor(element, '.' + oj.TableDomUtils.CSS_CLASSES._TABLE_CONTAINER_CLASS);
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
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._focusSetupHandlers = function (focusInHandler, focusOutHandler) {
  this.component._setFocusInHandler(focusInHandler);
  this.component._setFocusOutHandler(focusOutHandler);
};

/**
  * Iterate through the columns and remove the widths
  * @private
  * @memberof oj.TableDomUtils
  */
oj.TableDomUtils.prototype._removeHeaderColumnAndCellColumnWidths = function () {
  var columns = this.component._getColumnDefs();

  var i;
  var columnCount = columns.length;

  for (i = 0; i < columnCount; i++) {
    var headerColumn = this.getTableHeaderColumn(i);
    if (headerColumn != null) {
      this._applyForcedColumnWidth(headerColumn, '');
    }
  }

  // unfreeze any columns that were frozen due to scrolling
  this.unfreezeColumnWidths();

  var tableBodyRows = this.getTableBodyRows();
  if (tableBodyRows != null && tableBodyRows.length > 0) {
    for (i = 0; i < columnCount; i++) {
      var tableBodyCell;
      if (this._forcedWidthColumns != null && this._forcedWidthColumns[i] !== false) {
        for (var j = 0; j < tableBodyRows.length; j++) {
          tableBodyCell = this.getTableBodyCell(j, i, null);
          if (tableBodyCell !== null) {
            this._applyForcedColumnWidth(tableBodyCell, '');
          }
        }
      } else {
        tableBodyCell = this.getTableBodyCell(0, i, null);
        if (tableBodyCell != null) {
          this._applyForcedColumnWidth(tableBodyCell, '');
        }
      }
    }
  }

  for (i = 0; i < columnCount; i++) {
    var footerCell = this.getTableFooterCell(i);
    if (footerCell != null) {
      this._applyForcedColumnWidth(footerCell, '');
    }
  }
};

/**
 * Remove table dimensions styling
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype._removeTableDimensionsStyling = function () {
  var table = this.getTable();
  var tableContainer = this.getTableContainer();
  var tableHeader = this.getTableHeader();
  var tableHeaderRow = this.getTableHeaderRow();
  var tableFooter = this.getTableFooter();
  var tableFooterRow = this.getTableFooterRow();
  var tableBody = this.getTableBody();

  tableContainer.classList.remove(oj.TableDomUtils.CSS_CLASSES._TABLE_SCROLL_CLASS);
  tableContainer.classList.remove(oj.TableDomUtils.CSS_CLASSES._TABLE_SCROLL_VERTICAL_CLASS);
  tableContainer.classList.remove(oj.TableDomUtils.CSS_CLASSES._TABLE_SCROLL_HORIZONTAL_CLASS);
  // first remove any styling so that the browser sizes the table
  if (tableHeader != null) {
    tableHeader.removeAttribute(oj.TableDomUtils.DOM_ATTR._STYLE);
    tableHeaderRow.removeAttribute(oj.TableDomUtils.DOM_ATTR._STYLE);

    var headerColumnTextDivs = this.getTableElementsByClassName(tableHeaderRow,
      oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_TEXT_CLASS);
    var headerColumnTextDivsCount = headerColumnTextDivs.length;
    for (var i = 0; i < headerColumnTextDivsCount; i++) {
      headerColumnTextDivs[i].style[oj.TableDomUtils.CSS_PROP._WIDTH] = '';
    }
  }
  if (tableFooter != null) {
    tableFooter.removeAttribute(oj.TableDomUtils.DOM_ATTR._STYLE);
    tableFooterRow.removeAttribute(oj.TableDomUtils.DOM_ATTR._STYLE);
  }
  table.style[oj.TableDomUtils.CSS_PROP._DISPLAY] = '';
  table.style[oj.TableDomUtils.CSS_PROP._WIDTH] = '';

  if (tableBody != null) {
    tableBody.removeAttribute(oj.TableDomUtils.DOM_ATTR._STYLE);
  }

  this._removeHeaderColumnAndCellColumnWidths();
};

/**
 * Get style related to box width of an element
 * @param {Object} style - the style of an element
 * @return {Object} An object with boxSizing, borderWidth, and paddingWidth properties
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype._getBoxStyle = function (style) {
  return {
    boxSizing: style[oj.TableDomUtils.CSS_PROP._BOX_SIZING],
    borderWidth: (parseFloat(style[oj.TableDomUtils.CSS_PROP._BORDER_RIGHT_WIDTH]) || 0) +
      (parseFloat(style[oj.TableDomUtils.CSS_PROP._BORDER_LEFT_WIDTH]) || 0),
    paddingWidth: (parseFloat(style[oj.TableDomUtils.CSS_PROP._PADDING_RIGHT]) || 0) +
      (parseFloat(style[oj.TableDomUtils.CSS_PROP._PADDING_LEFT]) || 0)
  };
};

/**
 * @private
 */
oj.TableDomUtils.prototype._applyColumnHeaderHeight = function (headerColumnCell, height) {
  var headerColumnDiv = this.getTableElementsByClassName(headerColumnCell,
    oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CLASS);
  if (headerColumnDiv.length > 0) {
    headerColumnDiv[0].style[oj.TableDomUtils.CSS_PROP._MIN_HEIGHT] =
      height + oj.TableDomUtils.CSS_VAL._PX;
  }
};

/**
 * @private
 */
oj.TableDomUtils.prototype._getForcedColumnWidth = function (columnWidth, cellBoxStyle) {
  // ojtable columns width is interpreted as padding + content width, so we either have to
  // add in the border width or substract the padding width based on the box-sizing style.
  var forcedWidth = columnWidth +
    ((cellBoxStyle.boxSizing === 'border-box') ?
     cellBoxStyle.borderWidth : -cellBoxStyle.paddingWidth);
  return forcedWidth;
};

/**
 * @private
 */
oj.TableDomUtils.prototype._applyForcedColumnWidth = function (cell, forcedWidth) {
  var columnElement = cell;
  // add 'px' to the end of the value if width is not being cleared
  if (forcedWidth !== '') {
    // eslint-disable-next-line no-param-reassign
    forcedWidth += oj.TableDomUtils.CSS_VAL._PX;
  }
  columnElement.style[oj.TableDomUtils.CSS_PROP._MIN_WIDTH] = forcedWidth;
  columnElement.style[oj.TableDomUtils.CSS_PROP._WIDTH] = forcedWidth;
  columnElement.style[oj.TableDomUtils.CSS_PROP._MAX_WIDTH] = forcedWidth;
};

/**
 * Iterate through the columns and set any column widths that are defined by the columns[].width attribute
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype._setForcedColumnWidths = function () {
  var headerCell;
  var tableBodyCell;
  var columnCellBoxStyle;
  var forcedColumnCellWidth;
  var footerCell;
  var footerBoxStyle;
  var errSummary;
  var errDetail;

  var columns = this.component._getColumnDefs();
  var columnsCount = columns.length;
  var tableBodyRows = this.getTableBodyRows();

  // find and set the widths of the forced width columns, cells, and footers first
  // this allows the browser to adjust the remaining column widths automatically
  this._forcedWidthColumns = [];
  for (var i = 0; i < columnsCount; i++) {
    var columnWidth = columns[i].width;
    if (columnWidth > 0) {
      if (typeof columnWidth !== 'number') {
        // invalid column width property type
        errSummary = this.component._LOGGER_MSG._ERR_WIDTH_INVALID_TYPE_SUMMARY;
        errDetail = Translations.applyParameters(
          this.component._LOGGER_MSG._ERR_WIDTH_INVALID_TYPE_DETAIL, { width: columnWidth });
        Logger.warn(errSummary + '\n' + errDetail);
        columnWidth = parseFloat(columnWidth);
      }

      // update column header cell width
      headerCell = this.getTableHeaderColumn(i);
      if (headerCell != null) {
        var headerBoxStyle = this._getBoxStyle(window.getComputedStyle(headerCell));
        var forcedColumnWidth = this._getForcedColumnWidth(columnWidth, headerBoxStyle);
        this._applyForcedColumnWidth(headerCell, forcedColumnWidth);
        // store forced column width in case it is needed for scrollbar adjustments later
        this._forcedWidthColumns[i] = forcedColumnWidth;
      } else {
        this._forcedWidthColumns[i] = true;
      }

      // update column table body cell widths
      // if first row is in edit mode then fetching cell style from second row
      if (this.component._editableRowIdx === 0 && tableBodyRows.length > 1) {
        tableBodyCell = this.getTableBodyCell(1, i, null);
      } else {
        tableBodyCell = this.getTableBodyCell(0, i, null);
      }
      if (tableBodyCell != null) {
        if (!this.component._hasRowOrCellRendererOrTemplate(i)) {
          columnCellBoxStyle = this._getBoxStyle(window.getComputedStyle(tableBodyCell));
          forcedColumnCellWidth = this._getForcedColumnWidth(columnWidth, columnCellBoxStyle);
        }
        for (var j = 0; j < tableBodyRows.length; j++) {
          tableBodyCell = this.getTableBodyCell(j, i, null);
          if (tableBodyCell != null) {
            if (columnCellBoxStyle == null) {
              var cellBoxStyle = this._getBoxStyle(window.getComputedStyle(tableBodyCell));
              var forcedCellWidth = this._getForcedColumnWidth(columnWidth, cellBoxStyle);
              this._applyForcedColumnWidth(tableBodyCell, forcedCellWidth);
            } else {
              this._applyForcedColumnWidth(tableBodyCell, forcedColumnCellWidth);
            }
          }
        }
      }

      // update column footer cell width
      footerCell = this.getTableFooterCell(i);
      if (footerCell != null) {
        footerBoxStyle = this._getBoxStyle(window.getComputedStyle(footerCell));
        this._applyForcedColumnWidth(footerCell,
                                     this._getForcedColumnWidth(columnWidth, footerBoxStyle));
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
oj.TableDomUtils.prototype._isTableColumnsWidthSet = function () {
  var columnsCount = this.component._getColumnDefs().length;

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
oj.TableDomUtils.prototype._isAllTableColumnsWidthSet = function () {
  var columnsCount = this.component._getColumnDefs().length;

  for (var i = 0; i < columnsCount; i++) {
    if (this._forcedWidthColumns[i] === false) {
      return false;
    }
  }
  return true;
};

/**
 * Undo freezeColumnWidths operation
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.unfreezeColumnWidths = function () {
  if (this._frozenWidthRows) {
    for (var i = 0; i < this._frozenWidthRows.length; i++) {
      var cells = this.getTableBodyCells(null, this._frozenWidthRows[i]);
      for (var j = 0; j < cells.length; j++) {
        var cell = cells[j];
        this._applyForcedColumnWidth(cell, '');
        this.styleTableBodyCell(j, cell);
      }
    }
  }
  this._frozenWidthRows = [];
};

/**
 * Fixed the width of the columns inside a fragment
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.freezeColumnWidths = function (fragment) {
  var columns = this.component._getColumnDefs();
  var columnsCount = columns.length;

  var tableBodyCell;
  if (!this._frozenWidthRows) {
    this._frozenWidthRows = [];
  }

  var minWidths = [];
  for (var i = 0; i < columnsCount; i++) {
    tableBodyCell = this.getTableBodyCell(0, i, null);
    var minWidth = parseFloat(tableBodyCell.style[oj.TableDomUtils.CSS_PROP._MIN_WIDTH]);
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
      var cells = this.getTableBodyCells(null, row);
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
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype._setColumnWidths = function (scrollBarWidth) {
  var i;
  var headerCell;
  var tableBodyCell;
  var footerCell;

  var headerWidths = [];
  var headerHeights = [];
  var cellWidths = [];
  var footerWidths = [];
  var columnsCount = this.component._getColumnDefs().length;

  // loop through remaining columns to get the remaining column widths
  for (i = 0; i < columnsCount; i++) {
    if (this._forcedWidthColumns[i] !== false) {
      // add placeholders until the next loop is run
      headerWidths[i] = null;
      cellWidths[i] = null;
      footerWidths[i] = null;
    } else {
      // find column header cell width
      headerCell = this.getTableHeaderColumn(i);
      if (headerCell != null) {
        var headerCellBoxStyle = this._getBoxStyle(window.getComputedStyle(headerCell));
        headerWidths[i] = this._getForcedColumnWidth(headerCell.offsetWidth, headerCellBoxStyle);

        // also find the column header cell height
        var headerTextDiv = this.getTableElementsByClassName(headerCell,
          oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_TEXT_CLASS);
        if (headerTextDiv.length > 0) {
          headerHeights[i] = headerTextDiv[0].clientHeight;
        }
      }

      // find column table body cell widths
      tableBodyCell = this.getTableBodyCell(0, i, null);
      if (tableBodyCell != null) {
        var cellBoxStyle = this._getBoxStyle(window.getComputedStyle(tableBodyCell));
        cellWidths[i] = this._getForcedColumnWidth(tableBodyCell.offsetWidth, cellBoxStyle);
      }

      // find column footer cell width
      footerCell = this.getTableFooterCell(i);
      if (footerCell != null) {
        var footerCellBoxStyle = this._getBoxStyle(window.getComputedStyle(footerCell));
        footerWidths[i] = this._getForcedColumnWidth(footerCell.offsetWidth, footerCellBoxStyle);
      }
    }
  }

  // finally loop through to set the remaining column widths
  for (i = 0; i < columnsCount; i++) {
    if (this._forcedWidthColumns[i] !== false) {
      // update column header cell height
      headerCell = this.getTableHeaderColumn(i);
      if (headerCell != null) {
        this._applyColumnHeaderHeight(headerCell, headerHeights[i]);
        // extend width of last header cell by scrollbar width only when verical scrollbar is present
        if (i === columnsCount - 1 && !this._tableWidthConstrained && scrollBarWidth > 0) {
          this._applyForcedColumnWidth(headerCell, this._forcedWidthColumns[i] + scrollBarWidth);
        }
      }
    } else {
      // update column header cell width
      headerCell = this.getTableHeaderColumn(i);
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
      tableBodyCell = this.getTableBodyCell(0, i, null);
      if (tableBodyCell != null) {
        this._applyForcedColumnWidth(tableBodyCell, cellWidths[i]);
      }

      // update column footer cell width
      footerCell = this.getTableFooterCell(i);
      if (footerCell != null) {
        this._applyForcedColumnWidth(footerCell, footerWidths[i]);
      }
    }
  }
};

/**
 * Iterate through the header columns and set widths for those
 * which have overflow so that the text displays an ellipsis
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype._setHeaderColumnOverflowWidths = function () {
  var columns = this.component._getColumnDefs();
  var columnsCount = columns.length;

  for (var i = 0; i < columnsCount; i++) {
    var headerColumnCell = this.getTableHeaderColumn(i);
    if (headerColumnCell != null) {
      // if we have overflow
      var headerColumnDiv = this.getTableElementsByClassName(headerColumnCell,
        oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CLASS);
      if (headerColumnDiv.length > 0) {
        headerColumnDiv = headerColumnDiv[0];
        var headerColumnTextDiv = this.getTableElementsByClassName(headerColumnCell,
          oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_TEXT_CLASS);
        if (headerColumnTextDiv.length > 0) {
          if (headerColumnDiv.clientWidth > 0 &&
              headerColumnTextDiv[0].clientWidth > headerColumnDiv.clientWidth) {
            headerColumnTextDiv[0].style[oj.TableDomUtils.CSS_PROP._WIDTH] = '';
            var headerColumnTextDivWidth = headerColumnTextDiv[0].clientWidth;
            var newHeaderColumnTextDivWidth = headerColumnCell.clientWidth;

            // we only want to constrain the width.
            if (headerColumnTextDivWidth > newHeaderColumnTextDivWidth + 1) {
              headerColumnTextDiv[0].style[oj.TableDomUtils.CSS_PROP._WIDTH] =
                newHeaderColumnTextDivWidth + oj.TableDomUtils.CSS_VAL._PX;
            }
          }
        }
      }
    }
  }
};

/**
 * Gets sort icon container from header
 * @param {Element} header the header to get sort icon container for
 * @return {Element} sort icon container
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getSortIconContainer = function (header) {
  return this.getTableElementsByClassName(header,
    oj.TableDomUtils.CSS_CLASSES._TABLE_SORT_ICON_CONTAINER_CLASS)[0];
};

/**
 * Gets sort icon from header
 * @param {Element} header the header to get sort icon for
 * @return {Element} sort icon
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils.prototype.getSortIcon = function (header) {
  var sortContainer = this.getSortIconContainer(header);
  return sortContainer != null ? sortContainer.firstChild : null;
};

/**
 * @private
 */
oj.TableDomUtils.CSS_CLASSES =
{
  _CHECKBOX_ACC_SELECT_COLUMN_CLASS: 'oj-table-checkbox-acc-select-column',
  _CHECKBOX_ACC_SELECT_ROW_CLASS: 'oj-table-checkbox-acc-select-row',
  _TABLE_CONTAINER_CLASS: 'oj-table-container',
  _TABLE_SCROLLER_CLASS: 'oj-table-scroller',
  _TABLE_CLASS: 'oj-table',
  _TABLE_COMPACT_CLASS: 'oj-table-grid-display',
  _TABLE_HGRID_CLASS: 'oj-table-horizontal-grid',
  _TABLE_EDIT_CLASS: 'oj-table-editable',
  _TABLE_SCROLL_CLASS: 'oj-table-scroll',
  _TABLE_SCROLL_VERTICAL_CLASS: 'oj-table-scroll-vertical',
  _TABLE_SCROLL_HORIZONTAL_CLASS: 'oj-table-scroll-horizontal',
  _TABLE_ELEMENT_CLASS: 'oj-table-element',
  _TABLE_FOOTER_CLASS: 'oj-table-footer',
  _TABLE_FOOTER_ROW_CLASS: 'oj-table-footer-row',
  _TABLE_HEADER_CLASS: 'oj-table-header',
  _TABLE_HEADER_ROW_CLASS: 'oj-table-header-row',
  _TABLE_BOTTOM_SLOT_CLASS: 'oj-table-slot-bottom',
  _TABLE_SORT_ICON_CONTAINER_CLASS: 'oj-table-sort-icon-container',
  _COLUMN_HEADER_CELL_CLASS: 'oj-table-column-header-cell',
  _COLUMN_HEADER_DROP_EMPTY_CELL_CLASS: 'oj-table-column-header-drop-empty-cell',
  _COLUMN_HEADER_ACC_SELECT_COLUMN_CLASS: 'oj-table-column-header-acc-select-column',
  _COLUMN_HEADER_ACC_SELECT_ROW_CLASS: 'oj-table-column-header-acc-select-row',
  _COLUMN_HEADER_ACC_SELECT_ROW_TEXT_CLASS: 'oj-table-column-header-acc-select-row-text',
  _COLUMN_HEADER_CLASS: 'oj-table-column-header',
  _COLUMN_HEADER_TEXT_CLASS: 'oj-table-column-header-text',
  _COLUMN_HEADER_ASC_ICON_CLASS: 'oj-table-column-header-asc-icon',
  _COLUMN_HEADER_DSC_ICON_CLASS: 'oj-table-column-header-dsc-icon',
  _COLUMN_HEADER_DRAG_INDICATOR_BEFORE_CLASS: 'oj-table-column-header-drag-indicator-before',
  _COLUMN_HEADER_DRAG_INDICATOR_AFTER_CLASS: 'oj-table-column-header-drag-indicator-after',
  _COLUMN_HEADER_DRAG_IMAGE: 'oj-table-column-header-cell-drag-image',
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
  _TABLE_DATA_CURRENT_ROW_CLASS: 'oj-table-body-current-row',
  _TABLE_DATA_CELL_CLASS: 'oj-table-data-cell',
  _TABLE_DATA_CELL_ACC_SELECT_CLASS: 'oj-table-data-cell-acc-select',
  _TABLE_DATA_CELL_EDIT_CLASS: 'oj-table-data-cell-edit',
  _TABLE_DATE_CELL_FORM_CONTROL_CLASS: 'oj-form-control-inherit',
  _TABLE_VGRID_LINES_CLASS: 'oj-table-vgrid-lines',
  _TABLE_FOOTER_CELL_CLASS: 'oj-table-footer-cell',
  _TABLE_FOOTER_DROP_EMPTY_CELL_CLASS: 'oj-table-footer-drop-empty-cell',
  _TABLE_STATUS_ACC_NOTIFICATION_CLASS: 'oj-table-status-acc-notification',
  _TABLE_STATUS_MESSAGE_CLASS: 'oj-table-status-message',
  _TABLE_STATUS_MESSAGE_TEXT_CLASS: 'oj-table-status-message-text',
  _TABLE_LOADING_ICON_CLASS: 'oj-table-loading-icon',
  _TABLE_BODY_MESSAGE_CLASS: 'oj-table-body-message',
  _TABLE_BODY_MESSAGE_ROW_CLASS: 'oj-table-body-message-row',
  _ICON_CLASS: 'oj-icon',
  _WIDGET_ICON_CLASS: 'oj-component-icon',
  _HIDDEN_CONTENT_ACC_CLASS: 'oj-helper-hidden-accessible',
  _TEXT_ALIGN_END: 'oj-helper-text-align-end'
};

/**
 * @private
 */
oj.TableDomUtils.CSS_PROP =
{
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
oj.TableDomUtils.CSS_VAL =
{
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
oj.TableDomUtils.DOM_ATTR =
{
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
  _ARIA_HIDDEN: 'aria-hidden'
};

/**
 * @private
 */
oj.TableDomUtils.DOM_ELEMENT =
{
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
oj.TableDomUtils.MARKER_STYLE_CLASSES =
{
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

/**
 * @private
 * @type {string}
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils._COLUMN_HEADER_ROW_SELECT_ID = '_hdrColRowSel';
/**
 * @private
 * @type {string}
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils._OPTION_AUTO = 'auto';
/**
 * @private
 * @type {string}
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils._OPTION_ENABLED = 'enabled';
/**
 * @private
 * @type {string}
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils._OPTION_DISABLED = 'disabled';
/**
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils._OPTION_SELECTION_MODES =
{
  _SINGLE: 'single',
  _MULTIPLE: 'multiple'
};
/**
 * @private
 * @memberof oj.TableDomUtils
 */
oj.TableDomUtils._OPTION_DISPLAY =
{
  _LIST: 'list',
  _GRID: 'grid'
};


/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/* global Components:false */
/**
 * @ignore
 */
oj.TableRendererUtils = {};

/**
 * Column Header Renderer
 * @param {Object} component component instance
 * @param {Object} context renderer context
 * @param {Object|null} options renderer options
 * @param {function(Object)|null} delegateRenderer delegate renderer
 * @memberof oj.TableRendererUtils
 */
oj.TableRendererUtils.columnHeaderDefaultRenderer =
  function (component, context, options, delegateRenderer) {
    var parentElement = context.headerContext.parentElement;
    var headerColumnDiv = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    headerColumnDiv.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CLASS);
    $(parentElement).empty();
    parentElement.appendChild(headerColumnDiv); // @HTMLUpdateOK

    // call the delegateRenderer
    var headerContentDiv = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    headerContentDiv.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_TEXT_CLASS);
    headerColumnDiv.insertBefore(headerContentDiv, headerColumnDiv.firstChild); // @HTMLUpdateOK

    if (delegateRenderer != null) {
      delegateRenderer($(headerContentDiv));
    } else {
      this.columnHeaderDefaultTextRenderer(component, headerContentDiv, context);
    }
  };

/**
 * Column Header with Sort Icons Renderer
 * @param {Object} component component instance
 * @param {Object} context renderer context
 * @param {Object|null} options renderer options
 * @param {function(Object)|null} delegateRenderer delegate renderer
 * @memberof oj.TableRendererUtils
 */
oj.TableRendererUtils.columnHeaderSortableIconRenderer =
  function (component, context, options, delegateRenderer) {
    var parentElement = context.headerContext.parentElement;
    var headerColumnDiv = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    headerColumnDiv.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_CLASS);
    $(parentElement).empty();
    parentElement.appendChild(headerColumnDiv); // @HTMLUpdateOK

    var sortContainer = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    sortContainer.classList.add(oj.TableDomUtils.CSS_CLASSES._TABLE_SORT_ICON_CONTAINER_CLASS);
    headerColumnDiv.appendChild(sortContainer); // @HTMLUpdateOK
    var sortIcon = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    sortIcon.classList.add(oj.TableDomUtils.CSS_CLASSES._WIDGET_ICON_CLASS);
    sortIcon.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_ASC_ICON_CLASS);
    sortIcon.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._DISABLED);
    sortIcon.classList.add(oj.TableDomUtils.MARKER_STYLE_CLASSES._CLICKABLE_ICON);
    component._AddHoverable($(sortIcon));
    sortContainer.appendChild(sortIcon); // @HTMLUpdateOK

    // call the delegateRenderer
    var headerContentDiv = document.createElement(oj.TableDomUtils.DOM_ELEMENT._DIV);
    headerContentDiv.classList.add(oj.TableDomUtils.CSS_CLASSES._COLUMN_HEADER_TEXT_CLASS);
    headerColumnDiv.insertBefore(headerContentDiv, headerColumnDiv.firstChild); // @HTMLUpdateOK

    if (delegateRenderer != null) {
      delegateRenderer($(headerContentDiv));
    } else {
      this.columnHeaderDefaultTextRenderer(component, headerContentDiv, context);
    }
  };

/**
 * Default column header context text renderer
 * @param {Object} component component instance
 * @param {Element} headerContentDiv header content div
 * @param {Object} context context object
 * @memberof oj.TableRendererUtils
 */
oj.TableRendererUtils.columnHeaderDefaultTextRenderer =
  function (component, headerContentDiv, context) {
    var columnIdx = context.columnIndex;
    var column = component._getColumnDefs()[columnIdx];
    var textValue = column.headerText == null ? '' : column.headerText;
    headerContentDiv.appendChild(document.createTextNode(textValue)); // @HTMLUpdateOK
  };

/**
 * Default table body row renderer
 * @param {Object} component component instance
 * @param {number} rowIdx  row index
 * @param {Object} row row
 * @param {Object} context context object
 * @memberof oj.TableRendererUtils
 */
oj.TableRendererUtils.tableBodyRowDefaultRenderer = function (component, rowIdx, row, context) {
  var tableBodyRow = context.rowContext.parentElement;
  var rowHashCode = component._getTableDomUtils().hashCode(row.key);
  var columns = component._getColumnDefs();
  component._getTableDomUtils().setTableBodyRowAttributes(row, tableBodyRow);
  var columnsCount = columns.length;
  for (var j = 0; j < columnsCount; j++) {
    // set the cells in the inserted row with values from the row
    this.tableBodyCellDefaultRenderer(component, rowIdx, j, row, rowHashCode, context);
  }
};

/**
 * Default table body cell renderer
 * @param {Object} component component instance
 * @param {number} rowIdx  row index
 * @param {number} columnIdx  column index
 * @param {Object} row row
 * @param {number} rowHashCode  row hash code
 * @param {Object} context context object
 * @memberof oj.TableRendererUtils
 */
oj.TableRendererUtils.tableBodyCellDefaultRenderer =
  function (component, rowIdx, columnIdx, row, rowHashCode, context) {
    var tableBodyRow = context.rowContext.parentElement;
    var columns = component._getColumnDefs();
    var column = columns[columnIdx];

    var tableBodyCell = component._getTableDomUtils().createTableBodyCell(rowIdx, columnIdx);
    component._getTableDomUtils().styleTableBodyCell(columnIdx, tableBodyCell, true);
    component._getTableDomUtils().insertTableBodyCell(rowIdx, row.key, rowHashCode,
                                                      columnIdx, tableBodyCell,
                                                      tableBodyRow, true);

    var data = null;

    if (column.field != null) {
      data = oj.TableRendererUtils._getObjectPath(row.data, column.field);
    }

    var cellRenderer = component._getColumnRenderer(columnIdx, 'cell');
    var cellSlotTemplate = component._getSlotTemplate(column.template);
    if (cellSlotTemplate == null && component._isDefaultCellTemplateSlotValid()) {
      cellSlotTemplate = component._getSlotTemplate('cellTemplate');
    }

    if (!cellRenderer && !cellSlotTemplate) {
      data = oj.TableRendererUtils._getVal(data);
      var textValue = data == null ? '' : data;
      tableBodyCell.appendChild(document.createTextNode(textValue)); // @HTMLUpdateOK
    } else {
      var cellContext = this.getRendererContextObject(component, tableBodyCell, { row: row });
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
          tableBodyCell = $(tableBodyRow)
            .children(':not(.' +
                      oj.TableDomUtils.CSS_CLASSES._TABLE_DATA_CELL_ACC_SELECT_CLASS +
                      ')')[columnIdx];
          component._getTableDomUtils().setTableBodyCellAttributes(rowIdx, row.key, rowHashCode,
                                                                   columnIdx, tableBodyCell);
          component._getTableDomUtils().styleTableBodyCell(columnIdx, tableBodyCell, false);
        }
      } else {
        var componentElement = component._getRootElement();
        var templateEngine = component._getTemplateEngine();
        if (templateEngine != null) {
          var slotContext =
              oj.TableRendererUtils.getCellSlotTemplateContextObject(component, rendererContext);
          var cellContent =
              templateEngine.execute(componentElement, cellSlotTemplate,
                                     slotContext, component.options.as);
          if (!(cellContent instanceof Array)) {
            cellContent = [cellContent];
          }
          cellContent.map(function (content) {
            tableBodyCell.appendChild(content);
            return undefined;
          });
          // eslint-disable-next-line no-param-reassign
          component._hasCellTemplate = true;
        }
      }
    }
  };

/**
  * Get the context object to pass into the renderer
  * @param {Object} component component
  * @param {Object} parentElement element
  * @param {Object} options options
  * @memberof oj.TableRendererUtils
  */
oj.TableRendererUtils.getRendererContextObject = function (component, parentElement, options) {
  var context = {};
  context.component = Components.__GetWidgetConstructor(component.element, 'ojTable');
  var dataSource = component.options.data;
  // unwrap the datasource if we have a PagingTableDataSource
  if (oj.PagingTableDataSource && dataSource instanceof oj.PagingTableDataSource) {
    dataSource = dataSource.getWrappedDataSource();
  }
  context.datasource = dataSource;
  context.parentElement = parentElement;

  if (options.row != null) {
    var row = options.row;
    var rowKey = row.key;
    context.status = this.getRendererStatusObject(component, row);

    if (component._hasEditableRow()) {
      // Check using the editable row key
      var editableRowKey = component._getEditableRowKey();

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
  return component._FixRendererContext(context);
};

/**
 * Get the status object to pass into the renderer
 * @param {Object} component component
 * @param {Object} row row instance
 * @return {Object} status object
 * @memberof oj.TableRendererUtils
 */
oj.TableRendererUtils.getRendererStatusObject = function (component, row) {
  return {
    rowIndex: row.index,
    rowKey: row.key,
    currentRow: $.extend({}, component._getCurrentRow())
  };
};

/**
  * Get the context object for inline cell templates
  * @param {Object} component component
  * @param {Object} context renderer context
  * @memberof oj.TableRendererUtils
  */
oj.TableRendererUtils.getCellSlotTemplateContextObject = function (component, context) {
  var slotContext = this.getSlotTemplateContextObject(component);
  var rowIndex = context.cellContext.status.rowIndex;
  var rowKey = context.cellContext.status.rowKey;
  var columnIndex = context.columnIndex;
  slotContext[component._CONST_DATA] = context.data;
  slotContext.row = context.row;
  slotContext[component._CONST_INDEX] = rowIndex;
  slotContext.columnIndex = columnIndex;
  slotContext.mode = context.cellContext.mode;
  slotContext[component._CONST_KEY] = rowKey;

  return slotContext;
};

/**
  * Get the context object for inline header templates
  * @param {Object} component component
  * @param {Object} data data
  * @param {number} columnIdx  column index
  * @memberof oj.TableRendererUtils
  */
oj.TableRendererUtils.getHeaderSlotTemplateContextObject = function (component, data, columnIdx) {
  var slotContext = this.getSlotTemplateContextObject(component);
  slotContext[component._CONST_DATA] = data;
  slotContext.columnIndex = columnIdx;

  return slotContext;
};

/**
  * Get the context object for inline templates
  * @param {Object} component component
  * @memberof oj.TableRendererUtils
  */
oj.TableRendererUtils.getSlotTemplateContextObject = function (component) {
  var componentElement = component._getRootElement();
  return { componentElement: componentElement };
};

oj.TableRendererUtils._copyMetadata = function (context, row, dataSource) {
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

oj.TableRendererUtils._getObjectPath = function (obj, path) {
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

oj.TableRendererUtils._getVal = function (val) {
  if (typeof (val) === 'function') {
    return val();
  }
  return val;
};



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @ignore
 * @export
 * @class oj.TableResizeUtils
 * @classdesc Resize Utils for ojTable
 * @param {Object} component ojTable instance
 * @constructor
 */
oj.TableResizeUtils = function (component) {
  this.component = component;
  this.options = component.options;
  this.Init();
};

// Subclass from oj.Object
oj.Object.createSubclass(oj.TableResizeUtils, oj.Object, 'oj.TableResizeUtils');

/**
 * Initializes the instance.
 * @export
 * @memberof oj.TableResizeUtils
 */
oj.TableResizeUtils.prototype.Init = function () {
  oj.TableResizeUtils.superclass.Init.call(this);
};

/**
  * Set resize cursor
  * @param {Event} event Event
  * @memberof oj.TableResizeUtils
  */
oj.TableResizeUtils.prototype.setResizeCursor = function (event) {
  var domUtils = this.component._getTableDomUtils();
  var eventTarget = this.component._getEventTargetElement(event);
  var columnIdx = domUtils.getElementColumnIdx(eventTarget);

  if (columnIdx == null) {
    return false;
  }

  var column = this.component._getColumnDefs()[columnIdx];

  if (column.resizable === this.component._OPTION_DISABLED &&
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

  var headerColumns = domUtils.getTableHeaderColumns();
  if (!headerColumns) {
    return false;
  }

  // move the indicator
  if (columnIdx === this._resizeStartColumnIdx ||
      (this._resizeColumnStart && columnIdx === this._resizeStartColumnIdx - 1) ||
      (!this._resizeColumnStart && columnIdx === this._resizeStartColumnIdx + 1)) {
    var tableHeaderColumnResizeIndicator = domUtils.getTableHeaderColumnResizeIndicator();
    if (tableHeaderColumnResizeIndicator != null) {
      var table = domUtils.getTable();
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
  * @memberof oj.TableResizeUtils
  */
oj.TableResizeUtils.prototype.handleHeaderColumnResizeStart = function (event) {
  var eventTarget = this.component._getEventTargetElement(event);
  var columnIdx = this.component._getTableDomUtils().getElementColumnIdx(eventTarget);

  if (columnIdx != null) {
    var column = this.component._getColumnDefs()[columnIdx];
    this._resizeColumnStart = this._isHeaderColumnResizeStart(event);

    if (column.resizable === this.component._OPTION_ENABLED &&
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
  * @memberof oj.TableResizeUtils
  */
oj.TableResizeUtils.prototype.handleHeaderColumnResizeEnd = function (event) {
  var domUtils = this.component._getTableDomUtils();
  var columnsCount = this.options.columns.length;
  var eventTarget = this.component._getEventTargetElement(event);
  var columnIdx = domUtils.getElementColumnIdx(eventTarget);

  // only resize if we end the resize on the same column or adjacent columns
  if ((columnIdx !== null && columnIdx === this._resizeStartColumnIdx) ||
      (this._resizeColumnStart && columnIdx === this._resizeStartColumnIdx - 1) ||
      (!this._resizeColumnStart && columnIdx === this._resizeStartColumnIdx + 1)) {
    var headerColumn = domUtils.getTableHeaderColumn(this._resizeStartColumnIdx);
    if (headerColumn != null) {
      var headerColumnRect = headerColumn.getBoundingClientRect();
      var headerColumnWidth = headerColumnRect.width;
      // when scrollbar is present, reduce last column width by scrollbar width
      if (this._resizeStartColumnIdx === columnsCount - 1 && domUtils._tableHeightConstrained) {
        headerColumnWidth -= domUtils.getScrollBarWidth();
      }
      var widthChange;
      if ((this.component._GetReadingDirection() === 'rtl' && this._resizeColumnStart) ||
          (this.component._GetReadingDirection() === 'ltr' && !this._resizeColumnStart)) {
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
        if (headerColumnAdjacentIdx === columnsCount - 1 && domUtils._tableHeightConstrained) {
          widthChange += domUtils.getScrollBarWidth();
        }
        var headerColumnAdjacent = domUtils.getTableHeaderColumn(headerColumnAdjacentIdx);
        if (headerColumnAdjacent) {
          var headerColumnAdjacentRect = headerColumnAdjacent.getBoundingClientRect();
          var headerColumnAdjacentWidth = headerColumnAdjacentRect.width;
          clonedColumnsOption[headerColumnAdjacentIdx].width =
            headerColumnAdjacentWidth - widthChange;
        }

        this.component.option('columns', clonedColumnsOption, {
          _context: {
            writeback: true,
            internalSet: true
          }
        });
        this.component._clearCachedMetadata();
        this.component._queueTask(function () {
          // delay the focus to ensure table resize information is not cleared before 'click' handling occurs
          // otherwise, column resizing will lead to selection handling as well
          setTimeout(function () {
            this.clearTableHeaderColumnsResize();
          }.bind(this), 0);
        }.bind(this));
        return true;
      }
    }
  }
  this.clearTableHeaderColumnsResize();
  return false;
};

/**
  * Clear any column resize
  * @memberof oj.TableResizeUtils
  */
oj.TableResizeUtils.prototype.clearTableHeaderColumnsResize = function () {
  this._resizeStartColumnIdx = null;
  this._resizeColumnStart = null;
  this._resizeStartPageX = null;
  this._clearTableHeaderColumnsResizeStyling();
  this.component._getTableDomUtils().removeTableHeaderColumnResizeIndicator();
};

oj.TableResizeUtils.prototype._getPageX = function (event) {
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

oj.TableResizeUtils.prototype._isHeaderColumnResizeStart = function (event) {
  var resizeColumnStart = null;
  var columnsCount = this.options.columns.length;
  var columnIdx = this.component._getTableDomUtils().getElementColumnIdx(event.target);
  var headerColumn = this.component._getTableDomUtils().getTableHeaderColumn(columnIdx);
  if (headerColumn !== null) {
    var readingDir = this.component._GetReadingDirection();
    var columnRect = headerColumn.getBoundingClientRect();
    var distFromLeft = Math.abs(this._getPageX(event) - columnRect.left);
    var distFromRight = Math.abs(this._getPageX(event) - columnRect.right);

    // don't show resize cursor for column dividers at the start and end of the table
    if (distFromLeft <= oj.TableResizeUtils.RESIZE_OFFSET) {
      if (readingDir === 'rtl' && columnIdx !== columnsCount - 1) {
        resizeColumnStart = false;
      } else if (readingDir === 'ltr' && columnIdx !== 0) {
        resizeColumnStart = true;
      }
    } else if (distFromRight <= oj.TableResizeUtils.RESIZE_OFFSET) {
      if (readingDir === 'ltr' && columnIdx !== columnsCount - 1) {
        resizeColumnStart = false;
      } else if (readingDir === 'rtl' && columnIdx !== 0) {
        resizeColumnStart = true;
      }
    }
  }
  return resizeColumnStart;
};

oj.TableResizeUtils.prototype._setTableHeaderColumnResizeIndicator = function (columnIdx) {
  var tableHeaderColumnResizeIndicator =
      this.component._getTableDomUtils().getTableHeaderColumnResizeIndicator();

  if (tableHeaderColumnResizeIndicator == null) {
    tableHeaderColumnResizeIndicator =
      this.component._getTableDomUtils().createTableHeaderColumnResizeIndicator();
  }
  var table = this.component._getTableDomUtils().getTable();
  var tableRect = table.getBoundingClientRect();
  var headerColumn = this.component._getTableDomUtils().getTableHeaderColumn(columnIdx);
  var headerColumnRect = headerColumn.getBoundingClientRect();
  tableHeaderColumnResizeIndicator.style.height = tableRect.height + 'px';

  if (this._resizeColumnStart) {
    if (this.component._GetReadingDirection() === 'rtl') {
      tableHeaderColumnResizeIndicator.style.left =
        ((headerColumnRect.left + headerColumnRect.width) - tableRect.left) + 'px';
    } else {
      tableHeaderColumnResizeIndicator.style.left =
        (headerColumnRect.left - tableRect.left) + 'px';
    }
    tableHeaderColumnResizeIndicator.style.borderLeftWidth = '2px';
    tableHeaderColumnResizeIndicator.style.borderRightWidth = '0';
  } else {
    if (this.component._GetReadingDirection() === 'rtl') {
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

oj.TableResizeUtils.prototype._setTableHeaderColumnsResizeStyling = function () {
  var table = this.component._getTableDomUtils().getTable();
  table.classList.add(oj.TableResizeUtils.CSS_CLASSES._COLUMN_HEADER_RESIZING_CLASS);
};

oj.TableResizeUtils.prototype._clearTableHeaderColumnsResizeStyling = function () {
  var headerColumns = this.component._getTableDomUtils().getTableHeaderColumns();

  if (headerColumns) {
    var i;
    for (i = 0; i < headerColumns.length; i++) {
      headerColumns[i].style.cursor = '';
    }
  }

  var table = this.component._getTableDomUtils().getTable();
  table.classList.remove(oj.TableResizeUtils.CSS_CLASSES._COLUMN_HEADER_RESIZING_CLASS);
};

oj.TableResizeUtils.RESIZE_OFFSET = 10;

/**
 * @private
 */
oj.TableResizeUtils.CSS_CLASSES =
{
  _COLUMN_HEADER_RESIZING_CLASS: 'oj-table-column-header-resizing'
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
 * <p>Most screen readers have specific keyboard commands for interacting with and reading the contents of HTML Tables. When using the JET Table
 * with a screen reader, those keyboard shortcuts may take precedence over the JET Table's default keyboard commands.</p>
 *
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
 * {@ojinclude "name":"ojStylingDocIntro"}
 *
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
 *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-table-data-cell-no-padding</td>
 *       <td><p>Used to style a table cell so that it has no padding. An app developer would likely use
 *       this in the case of editable tables when an editable cell content does not need the default cell padding.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the table cell.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-table-data-cell-padding</td>
 *       <td><p>Used to style a table cell so that it has the default padding. An app developer would likely use
 *       this in the case of editable tables when an editable cell content needs to maintain default cell padding.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the table cell.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>oj-table-hide-vertical-scrollbar</td>
 *       <td><p>Used to explicitly hide the vertical scrollbar when the table body is scrollable.
 *
 *           <p>The class is applied as follows:
 *
 *           <ul>
 *             <li>The class must be applied to the oj-table custom element.</li>
 *           </ul>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
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
 * <p>Table supports a bottom custom element slot where applications can add content such as a paging control.</p>
 *
 *
 * @ojfragment slotDoc - Used in slot section of classdesc
 * @memberof oj.ojTable
 */
/**
 * <p>Named slot for the Table's bottom panel where applications can add content such as a paging control.</p>
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
 * <p>Named slot for the Table's default cell template. The slot content must be a &lt;template> element. The content of the template should not include the &lt;td> element, only what's inside it.
 * If the value of any column's <code class="prettyprint">template</code>, <code class="prettyprint">headerTemplate</code>, or <code class="prettyprint">footerTemplate</code> property conflicts with this named slot, this slot will only be used for that column.
 * Similarly, if a value is supplied for the deprecated <code class="prettyprint">columns-default.template</code> attribute, that named slot will be used as the default cell template slot instead of this named slot.</p>
 *
 * @ojslot cellTemplate
 * @memberof oj.ojTable
 *
 * @example <caption>Initialize the Table with the <code class="prettyprint">cellTemplate</code> slot specified:</caption>
 * &lt;oj-table>
 *   &lt;div slot='cellTemplate'>&lt;oj-bind-text>&lt;/oj-bind-text>&lt;/div>
 * &lt;/oj-table>
 */
/**
 * <p>Named slot for the Table's default footer template. The slot content must be a &lt;template> element. The content of the template should not include the &lt;td> element, only what's inside it.
 * If the value of any column's <code class="prettyprint">template</code>, <code class="prettyprint">headerTemplate</code>, or <code class="prettyprint">footerTemplate</code> property conflicts with this named slot, this slot will only be used for that column.
 * Similarly, if a value is supplied for the deprecated <code class="prettyprint">columns-default.footer-template</code> attribute, that named slot will be used as the default footer template slot instead of this named slot.</p>
 *
 * @ojslot footerTemplate
 * @memberof oj.ojTable
 *
 * @example <caption>Initialize the Table with the <code class="prettyprint">footerTemplate</code> slot specified:</caption>
 * &lt;oj-table>
 *   &lt;div slot='footerTemplate'>&lt;oj-bind-text>&lt;/oj-bind-text>&lt;/div>
 * &lt;/oj-table>
 */
/**
 * <p>Named slot for the Table's default header template. The slot content must be a &lt;template> element. The content of the template should not include the &lt;td> element, only what's inside it.
 * If the value of any column's <code class="prettyprint">template</code>, <code class="prettyprint">headerTemplate</code>, or <code class="prettyprint">footerTemplate</code> property conflicts with this named slot, this slot will only be used for that column.
 * Similarly, if a value is supplied for the deprecated <code class="prettyprint">columns-default.header-template</code> attribute, that named slot will be used as the default header template slot instead of this named slot.</p>
 *
 * @ojslot headerTemplate
 * @memberof oj.ojTable
 *
 * @example <caption>Initialize the Table with the <code class="prettyprint">headerTemplate</code> slot specified:</caption>
 * &lt;oj-table>
 *   &lt;div slot='headerTemplate'>&lt;oj-bind-text>&lt;/oj-bind-text>&lt;/div>
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
  __oj_table_metadata.extension._GLOBAL_TRANSFER_ATTRS = ['aria-label', 'aria-labelledby'];
  __oj_table_metadata.extension._INNER_ELEM = 'table';
  oj.CustomElementBridge.register('oj-table', { metadata: __oj_table_metadata });
}());

});