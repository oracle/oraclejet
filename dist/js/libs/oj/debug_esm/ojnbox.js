/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import 'ojs/ojcomponentcore';
import DvtAttributeUtils from 'ojs/ojdvt-base';
import $ from 'jquery';
import { NBox } from 'ojs/ojnbox-toolkit';

var __oj_n_box_metadata = 
{
  "properties": {
    "animationOnDataChange": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": [
        "auto",
        "none"
      ],
      "value": "none"
    },
    "as": {
      "type": "string",
      "value": ""
    },
    "cellContent": {
      "type": "string",
      "enumValues": [
        "auto",
        "counts"
      ],
      "value": "auto"
    },
    "cellMaximize": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "on"
    },
    "cells": {
      "type": "Array<Object>|Promise"
    },
    "columns": {
      "type": "Array<Object>|Promise"
    },
    "columnsTitle": {
      "type": "string",
      "value": ""
    },
    "countLabel": {
      "type": "function"
    },
    "data": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "unsupported",
              "since": "13.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
        }
      }
    },
    "groupAttributes": {
      "type": "Array<string>",
      "enumValues": [
        "color",
        "indicatorColor",
        "indicatorIconColor",
        "indicatorIconPattern",
        "indicatorIconShape"
      ],
      "value": [
        "color",
        "indicatorColor",
        "indicatorIconShape",
        "indicatorIconColor",
        "indicatorIconPattern"
      ]
    },
    "groupBehavior": {
      "type": "string",
      "enumValues": [
        "acrossCells",
        "none",
        "withinCell"
      ],
      "value": "withinCell"
    },
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true,
      "value": []
    },
    "highlightMatch": {
      "type": "string",
      "enumValues": [
        "all",
        "any"
      ],
      "value": "all"
    },
    "highlightedCategories": {
      "type": "Array<string>",
      "writeback": true,
      "value": []
    },
    "hoverBehavior": {
      "type": "string",
      "enumValues": [
        "dim",
        "none"
      ],
      "value": "none"
    },
    "labelTruncation": {
      "type": "string",
      "enumValues": [
        "ifRequired",
        "on"
      ],
      "value": "on"
    },
    "maximizedColumn": {
      "type": "string",
      "writeback": true,
      "value": ""
    },
    "maximizedRow": {
      "type": "string",
      "writeback": true,
      "value": ""
    },
    "nodes": {
      "type": "Array<Object>|Promise"
    },
    "otherColor": {
      "type": "string"
    },
    "otherThreshold": {
      "type": "number",
      "value": 0
    },
    "rows": {
      "type": "Array<Object>|Promise"
    },
    "rowsTitle": {
      "type": "string",
      "value": ""
    },
    "selection": {
      "type": "Array<any>",
      "writeback": true,
      "value": []
    },
    "selectionMode": {
      "type": "string",
      "enumValues": [
        "multiple",
        "none",
        "single"
      ],
      "value": "multiple"
    },
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDuration": {
          "type": "number"
        },
        "cellDefaults": {
          "type": "object",
          "properties": {
            "labelHalign": {
              "type": "string",
              "enumValues": [
                "center",
                "end",
                "start"
              ],
              "value": "start"
            },
            "labelStyle": {
              "type": "object"
            },
            "maximizedSvgStyle": {
              "type": "object"
            },
            "minimizedSvgStyle": {
              "type": "object"
            },
            "showCount": {
              "type": "string",
              "enumValues": [
                "auto",
                "off",
                "on"
              ],
              "value": "auto"
            },
            "svgStyle": {
              "type": "object"
            }
          }
        },
        "columnLabelStyle": {
          "type": "object"
        },
        "columnsTitleStyle": {
          "type": "object"
        },
        "hoverBehaviorDelay": {
          "type": "number",
          "value": 200
        },
        "nodeDefaults": {
          "type": "object",
          "properties": {
            "borderColor": {
              "type": "string"
            },
            "borderWidth": {
              "type": "number"
            },
            "color": {
              "type": "string"
            },
            "iconDefaults": {
              "type": "object",
              "properties": {
                "background": {
                  "type": "string",
                  "value": "neutral"
                },
                "borderColor": {
                  "type": "string"
                },
                "borderRadius": {
                  "type": "string"
                },
                "borderWidth": {
                  "type": "number"
                },
                "color": {
                  "type": "string",
                  "value": ""
                },
                "height": {
                  "type": "number",
                  "value": 0
                },
                "opacity": {
                  "type": "number",
                  "value": 1
                },
                "pattern": {
                  "type": "string",
                  "enumValues": [
                    "largeChecker",
                    "largeCrosshatch",
                    "largeDiagonalLeft",
                    "largeDiagonalRight",
                    "largeDiamond",
                    "largeTriangle",
                    "none",
                    "smallChecker",
                    "smallCrosshatch",
                    "smallDiagonalLeft",
                    "smallDiagonalRight",
                    "smallDiamond",
                    "smallTriangle"
                  ],
                  "value": "none"
                },
                "shape": {
                  "type": "string",
                  "value": "square"
                },
                "source": {
                  "type": "string",
                  "value": ""
                },
                "width": {
                  "type": "number",
                  "value": 0
                }
              }
            },
            "indicatorColor": {
              "type": "string",
              "value": ""
            },
            "indicatorIconDefaults": {
              "type": "object",
              "properties": {
                "borderColor": {
                  "type": "string"
                },
                "borderRadius": {
                  "type": "string"
                },
                "borderWidth": {
                  "type": "number"
                },
                "color": {
                  "type": "string",
                  "value": ""
                },
                "height": {
                  "type": "number"
                },
                "opacity": {
                  "type": "number",
                  "value": 1
                },
                "pattern": {
                  "type": "string",
                  "enumValues": [
                    "largeChecker",
                    "largeCrosshatch",
                    "largeDiagonalLeft",
                    "largeDiagonalRight",
                    "largeDiamond",
                    "largeTriangle",
                    "none",
                    "smallChecker",
                    "smallCrosshatch",
                    "smallDiagonalLeft",
                    "smallDiagonalRight",
                    "smallDiamond",
                    "smallTriangle"
                  ],
                  "value": "none"
                },
                "shape": {
                  "type": "string",
                  "value": "square"
                },
                "source": {
                  "type": "string"
                },
                "width": {
                  "type": "number"
                }
              }
            },
            "labelStyle": {
              "type": "object"
            },
            "secondaryLabelStyle": {
              "type": "object"
            }
          }
        },
        "rowLabelStyle": {
          "type": "object"
        },
        "rowsTitleStyle": {
          "type": "object"
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
    },
    "touchResponse": {
      "type": "string",
      "enumValues": [
        "auto",
        "touchStart"
      ],
      "value": "auto"
    },
    "trackResize": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "on"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "accessibleContainsControls": {
          "type": "string"
        },
        "componentName": {
          "type": "string"
        },
        "highlightedCount": {
          "type": "string"
        },
        "labelAdditionalData": {
          "type": "string"
        },
        "labelAndValue": {
          "type": "string"
        },
        "labelClearSelection": {
          "type": "string"
        },
        "labelCountWithTotal": {
          "type": "string"
        },
        "labelDataVisualization": {
          "type": "string"
        },
        "labelGroup": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "labelOther": {
          "type": "string"
        },
        "labelSize": {
          "type": "string"
        },
        "stateCollapsed": {
          "type": "string"
        },
        "stateDrillable": {
          "type": "string"
        },
        "stateExpanded": {
          "type": "string"
        },
        "stateHidden": {
          "type": "string"
        },
        "stateIsolated": {
          "type": "string"
        },
        "stateMaximized": {
          "type": "string"
        },
        "stateMinimized": {
          "type": "string"
        },
        "stateSelected": {
          "type": "string"
        },
        "stateUnselected": {
          "type": "string"
        },
        "stateVisible": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getCell": {},
    "getColumn": {},
    "getColumnCount": {},
    "getColumnsTitle": {},
    "getContextByNode": {},
    "getDialog": {},
    "getGroupBehavior": {},
    "getGroupNode": {},
    "getProperty": {},
    "getRow": {},
    "getRowCount": {},
    "getRowsTitle": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/* global __oj_n_box_metadata */

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  __oj_n_box_metadata.extension._WIDGET_NAME = 'ojNBox';
  oj.CustomElementBridge.register('oj-n-box', {
    metadata: __oj_n_box_metadata,
    parseFunction: DvtAttributeUtils.shapeParseFunction({
      'style-defaults.node-defaults.icon-defaults.shape': true,
      'style-defaults.node-defaults.indicator-icon-defaults.shape': true
    })
  });
})();
var __oj_n_box_node_metadata = 
{
  "properties": {
    "borderColor": {
      "type": "string",
      "value": ""
    },
    "borderWidth": {
      "type": "number",
      "value": 0
    },
    "categories": {
      "type": "Array<string>",
      "value": []
    },
    "color": {
      "type": "string",
      "value": ""
    },
    "column": {
      "type": "string",
      "value": ""
    },
    "groupCategory": {
      "type": "string",
      "value": ""
    },
    "icon": {
      "type": "object",
      "properties": {
        "background": {
          "type": "string",
          "value": "neutral"
        },
        "borderColor": {
          "type": "string"
        },
        "borderRadius": {
          "type": "string"
        },
        "borderWidth": {
          "type": "number"
        },
        "color": {
          "type": "string"
        },
        "height": {
          "type": "number"
        },
        "initials": {
          "type": "string",
          "value": ""
        },
        "opacity": {
          "type": "number"
        },
        "pattern": {
          "type": "string",
          "enumValues": [
            "largeChecker",
            "largeCrosshatch",
            "largeDiagonalLeft",
            "largeDiagonalRight",
            "largeDiamond",
            "largeTriangle",
            "mallChecker",
            "none",
            "smallCrosshatch",
            "smallDiagonalLeft",
            "smallDiagonalRight",
            "smallDiamond",
            "smallTriangle"
          ],
          "value": "none"
        },
        "shape": {
          "type": "string"
        },
        "source": {
          "type": "string"
        },
        "svgClassName": {
          "type": "string",
          "value": ""
        },
        "svgStyle": {
          "type": "object"
        },
        "width": {
          "type": "number"
        }
      }
    },
    "indicatorColor": {
      "type": "string",
      "value": ""
    },
    "indicatorIcon": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "borderRadius": {
          "type": "string"
        },
        "borderWidth": {
          "type": "number"
        },
        "color": {
          "type": "string"
        },
        "height": {
          "type": "number"
        },
        "opacity": {
          "type": "number"
        },
        "pattern": {
          "type": "string",
          "enumValues": [
            "largeChecker",
            "largeCrosshatch",
            "largeDiagonalLeft",
            "largeDiagonalRight",
            "largeDiamond",
            "largeTriangle",
            "none",
            "smallChecker",
            "smallCrosshatch",
            "smallDiagonalLeft",
            "smallDiagonalRight",
            "smallDiamond",
            "smallTriangle"
          ]
        },
        "shape": {
          "type": "string"
        },
        "source": {
          "type": "string"
        },
        "svgClassName": {
          "type": "string"
        },
        "svgStyle": {
          "type": "object"
        },
        "width": {
          "type": "number"
        }
      }
    },
    "label": {
      "type": "string",
      "value": ""
    },
    "row": {
      "type": "string",
      "value": ""
    },
    "secondaryLabel": {
      "type": "string",
      "value": ""
    },
    "shortDesc": {
      "type": "string|function",
      "value": ""
    },
    "svgClassName": {
      "type": "string",
      "value": ""
    },
    "svgStyle": {
      "type": "object"
    },
    "xPercentage": {
      "type": "number"
    },
    "yPercentage": {
      "type": "number"
    }
  },
  "extension": {}
};
/* global __oj_n_box_node_metadata:false */
(function () {
  __oj_n_box_node_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-n-box-node', {
    metadata: __oj_n_box_node_metadata,
    parseFunction: DvtAttributeUtils.shapeParseFunction({
      'icon.shape': true,
      'indicator-icon.shape': true
    })
  });
})();

/**
 * @ojcomponent oj.ojNBox
 * @augments oj.dvtBaseComponent
 * @since 1.1.0
 * @ojimportmembers oj.ojSharedContextMenu
 * @ojrole application
 * @ojshortdesc NBox is an interactive data visualization (typically found in Human Capital Management applications) in which employees are grouped and compared across two dimensions.  Each dimension can be split into multiple ranges.
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojNBox<K, D extends oj.ojNBox.Node<K>|any> extends dvtBaseComponent<ojNBoxSettableProperties<K, D>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojNBoxSettableProperties<K, D extends oj.ojNBox.Node<K>|any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["rowsTitle", "columnsTitle", "animationOnDataChange", "animationOnDisplay", "style"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["data", "rows", "columns", "cells"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 12
 *
 * @ojoracleicon 'oj-ux-ico-chart-nbox'
 * @ojuxspecs ['data-visualization-nbox']
 *
 * @classdesc
 * <h3 id="nBoxOverview-section">
 *   JET NBox
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#nBoxOverview-section"></a>
 * </h3>
 *
 * <p>NBox elements are used in HCM (Human Capital Management) applications
 * to measure employees across two dimensions (e.g. potential and performance). Each dimension
 * can be split into multiple ranges, whose intersections result in distinct cells which
 * employees can be placed into.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-n-box
 *   columns='[{"id":"low"}, {"id":"high"}]',
 *   rows='[{"id":"low"}, {"id":"high"}]',
 *   data="[[dataProvider]]">
 * &lt;/oj-n-box>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
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
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Animation</h4>
 * <p>Animation should only be enabled for visualizations of small to medium data sets. Alternate visualizations should
 *    be considered if identifying data changes is important, since all nodes will generally move and resize on any data
 *    change.
 * </p>
 *
 * <h4>Data Set Size</h4>
 * <p>Applications should avoid setting very large data densities on this element.
 *    Applications can enable progressive reveal of data through drilling or aggregate small nodes to reduce the
 *    displayed data set size.
 * </p>
 *
 * <h4>Styling</h4>
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">styleDefaults.nodeDefaults</code>, instead of styling properties
 *    on the individual nodes. The NBox can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */

const OJ_NBOX_CELL = 'oj-nbox-cell';
const OJ_NBOX_DIALOG = 'oj-nbox-dialog';
const OJ_NBOX_DIALOG_CLOSE_BUTTON = 'oj-nbox-dialog-close-button';
const OJ_NBOX_GROUP_NODE = 'oj-nbox-group-node';
const OJ_NBOX_NODE = 'oj-nbox-node';
const OJ_NBOX_OVERFLOW = 'oj-nbox-overflow';
const OJ_NBOX_TOOLTIP = 'oj-nbox-tooltip';
const BORDER_COLOR = 'border-color';

oj.__registerWidget('oj.ojNBox', $.oj.dvtBaseComponent, {
  widgetEventPrefix: 'oj',

  options: {
    /**
     * Specifies the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     */
    animationOnDataChange: 'none',

    /**
     * Specifies the animation that is shown on initial display.
     * @expose
     * @name animationOnDisplay
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     */
    animationOnDisplay: 'none',

    /**
     * An alias for the $current context variable when referenced inside nodeTemplate when using a DataProvider.
     * @expose
     * @name as
     * @ojshortdesc Specifies the alias for the current item when referenced inside the nodeTemplate.
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @default ''
     * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
     **/
    as: '',

    /**
     * The content the cells will display. "auto" switches between nodes and cell counts based on available space. "counts" forces the NBox to always render cell counts.
     * @expose
     * @name cellContent
     * @ojshortdesc Specifies the content displayed in cells. See the Help documentation for more information.
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojvalue {string} "counts"
     * @ojvalue {string} "auto"
     * @default "auto"
     */
    cellContent: 'auto',

    /**
     * Whether or not the cell maximize/de-maximize gestures are enabled.
     * @expose
     * @name cellMaximize
     * @ojshortdesc Specifies whether cell maximize/de-maximize gestures are enabled.
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojvalue {string} "off"
     * @ojvalue {string} "on"
     * @default "on"
     */
    cellMaximize: 'on',

    /**
     * The list of cells. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
     * @expose
     * @name cells
     * @ojshortdesc Specifies the list of cells. Also accepts a Promise for deferred data rendering.
     * @memberof oj.ojNBox
     * @instance
     * @type {(Array.<Object>|Promise|null)=}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojNBox.Cell>>|null",
     *                                           SetterType: "Array<oj.ojNBox.Cell>|Promise<Array<oj.ojNBox.Cell>>|null"},
     *                                           jsdocOverride: true}
     * @default null
     * @ojtsexample <caption>set or get
     * <code class="prettyprint">cells</code> property:</caption>
     * let elem = document.getElementById('nbox') as ojNBox<string, object>;
     * //set cells to Promise. Assuming that getCells is a method which returns type Promise<Array<ojNBox.Cell>>
     * elem.cells = getCells();
     * //or
     * elem.set('cells', getCells());
     *
     * //set cells to an array of ojNBox.Cell
     * //elem.cells = [{row: '0', column: '0', label: '(0, 0)'},
     * //              {row: '0', column: '1', label: '(0, 1)'}]; Please note this wont compile. Use the format below
     * elem.set('cells', [{row: '0', column: '0', label: '(0, 0)'},
     *                    {row: '0', column: '1', label: '(0, 1)'}]);
     *
     * //get cells property value
     * let cells = elem.cells; //This is guaranteed to be of the type Promise<Array<ojNBox.Cell>>|null
     *
     * //reset the value of cells to its default,
     * elem.unset('cells');
     */
    cells: null,

    /**
     * The list of columns. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
     * @expose
     * @name columns
     * @ojshortdesc Specifies the list of columns. Also accepts a Promise for deferred data rendering.
     * @memberof oj.ojNBox
     * @instance
     * @type {Array.<Object>|Promise|null}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojNBox.Column>>|null",
     *                                           SetterType: "Array<oj.ojNBox.Column>|Promise<Array<oj.ojNBox.Column>>|null"},
     *                                           jsdocOverride: true}
     * @ojtsexample <caption>set or get
     * <code class="prettyprint">columns</code> property:</caption>
     * let elem = document.getElementById('nbox') as ojNBox<string, object>;
     * //set columns to Promise. Assuming that getColumns is a method which returns type Promise<Array<ojNBox.Column>>
     * elem.columns = getColumns();
     * //or
     * elem.set('columns', getColumns());
     *
     * //set columns to an array of ojNBox.Column
     * //elem.columns = [{id: '0'},{id: '1'}]; Please note this wont compile. Use the format below
     * elem.set('columns', [{id: '0'},{id: '1'}]);
     *
     * //get columns property value
     * let columns = elem.columns; //This is guaranteed to be of the type Promise<Array<ojNBox.Column>>|null
     *
     * //reset the value of columns to its default,
     * elem.unset('columns');
     * @default null
     */
    columns: null,

    /**
     * The text for the title on the column edge.
     * @expose
     * @name columnsTitle
     * @ojtranslatable
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @default ""
     */
    columnsTitle: '',

    /**
     * A function that returns custom text for the cell count labels (extra info displayed after primary labels).
     * @expose
     * @ojshortdesc A function that returns custom text for the cell count labels.
     * @name countLabel
     * @memberof oj.ojNBox
     * @instance
     * @type {(function(Object)|null)=}
     * @default null
     * @ojsignature {target: "Type", value: "((context: oj.ojNBox.CountLabelContext) => (string|null))", jsdocOverride: true}
     */
    countLabel: null,

    /**
     * The DataProvider for the NBox. It should provide rows where each row corresponds to a single NBox node.
     * The DataProvider can either have an arbitrary data shape, in which case an <oj-n-box-node> element must be specified in the itemTemplate slot or it can have [oj.ojNBox.Node]{@link oj.ojNBox.Node} as its data shape, in which case no template is required.
     * @expose
     * @name data
     * @ojshortdesc Specifies the data provider for the NBox. See the Help documentation for more information.
     * @memberof oj.ojNBox
     * @instance
     * @type {Object|null}
     * @ojsignature {target: "Type", value: "DataProvider<K, D>|null", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the NBox with the
     * <code class="prettyprint">data</code> attribute specified:</caption>
     * &lt;oj-n-box data='[[dataProvider]]'>&lt;/oj-n-box>
     *
     * @example <caption>Get or set the <code class="prettyprint">data</code>
     * property after initialization:</caption>
     * // getter
     * var value = myNBox.data;
     *
     * // setter
     * myNBox.data = dataProvider;
     */
    data: null,

    /**
     * Specifies how nodes should be grouped.
     * @expose
     * @name groupBehavior
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojvalue {string} "acrossCells"
     * @ojvalue {string} "none"
     * @ojvalue {string} "withinCell"
     * @default "withinCell"
     */
    groupBehavior: 'withinCell',

    /**
     * An array of attributes to style the group nodes with. Any attributes not listed will be ignored.
     * @expose
     * @name groupAttributes
     * @ojshortdesc An array of attributes for styling the group nodes.
     * @memberof oj.ojNBox
     * @instance
     * @type {Array.<string>=}
     * @ojvalue {string} "color"
     * @ojvalue {string} "indicatorColor"
     * @ojvalue {string} "indicatorIconColor"
     * @ojvalue {string} "indicatorIconPattern"
     * @ojvalue {string} "indicatorIconShape"
     * @default ["color", "indicatorColor", "indicatorIconShape", "indicatorIconColor", "indicatorIconPattern"]
     */
    groupAttributes: [
      'color',
      'indicatorColor',
      'indicatorIconColor',
      'indicatorIconPattern',
      'indicatorIconShape'
    ],

    /**
     * An array of category strings used for category filtering. Data items with a category in hiddenCategories will be filtered.
     * @expose
     * @name hiddenCategories
     * @ojshortdesc An array of category strings used for filtering. Data items with any category matching an item in this array will be filtered.
     * @memberof oj.ojNBox
     * @instance
     * @type {Array.<string>=}
     * @default []
     * @ojwriteback
     */
    hiddenCategories: [],

    /**
     * Defines the behavior applied when hovering over data items.
     * @expose
     * @name hoverBehavior
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojvalue {string} "dim"
     * @ojvalue {string} "none"
     * @default "none"
     */
    hoverBehavior: 'none',

    /**
     * An array of category strings used for category highlighting. Data items matching categories in highlightedCategories will be highlighted.
     * @expose
     * @name highlightedCategories
     * @ojshortdesc An array of category strings used for highlighting. Data items matching categories in this array will be highlighted.
     * @memberof oj.ojNBox
     * @instance
     * @type {Array.<string>=}
     * @default []
     * @ojwriteback
     */
    highlightedCategories: [],

    /**
     * The matching condition for the highlightedCategories property. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     * @expose
     * @name highlightMatch
     * @ojshortdesc The matching condition for the highlightedCategories property. See the Help documentation for more information.
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojvalue {string} "any"
     * @ojvalue {string} "all"
     * @default "all"
     */
    highlightMatch: 'all',

    /**
     * Determines node label truncation behavior. Labels are always truncated if limited by container (e.g. cell, dialog) width. Optionally, NBox can further truncate node labels to increase the number of nodes visible to the user. "on" allows label truncation to increase number of visible nodes. "ifRequired" only allows truncation when limited by container width.
     * @expose
     * @name labelTruncation
     * @ojshortdesc Specifies node label truncation behavior. See the Help documentation for more information.
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojvalue {string} "ifRequired"
     * @ojvalue {string} "on"
     * @default "on"
     */
    labelTruncation: 'on',

    /**
     * The id of the column to be maximized.
     * @expose
     * @name maximizedColumn
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @default ""
     * @ojwriteback
     */
    maximizedColumn: '',

    /**
     * The id of the row to be maximized.
     * @expose
     * @name maximizedRow
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @default ""
     * @ojwriteback
     */
    maximizedRow: '',

    /**
     * The list of nodes. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
     * @expose
     * @ojtsignore
     * @name nodes
     * @ojshortdesc The list of nodes. Also accepts a Promise for deferred data rendering.
     * @memberof oj.ojNBox
     * @instance
     * @type {(Array.<Object>|Promise|null)=}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojNBox.Node<K>>|null",
     *                                           SetterType: "Array<oj.ojNBox.Node<K>>|Promise<Array<oj.ojNBox.Node<K>>>|null"},
     *                                           jsdocOverride: true}
     * @default null
     */
    nodes: null,

    /**
     * The color for the "other" group nodes which aggregate any group nodes that fall below the otherThreshold, if specified.  The default value varies based on theme.
     * @expose
     * @ojshortdesc The color for the "other" group nodes. See the Help documentation for more information.
     * @name otherColor
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojformat color
     */
    otherColor: '#636363',

    /**
     * A percentage (0-1) of the nodes collection size that determines the value beneath which any groups will be aggregated into an "other" node.
     * @expose
     * @ojshortdesc The threshold for aggregating nodes into an "other" group node. See the Help documentation for more information.
     * @name otherThreshold
     * @memberof oj.ojNBox
     * @instance
     * @type {number=}
     * @default 0
     */
    otherThreshold: 0,

    /**
     * The list of rows. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
     * @expose
     * @name rows
     * @ojshortdesc The list of rows. Also accepts a Promise for deferred data rendering.
     * @memberof oj.ojNBox
     * @instance
     * @type {Array.<Object>|Promise|null}
     * @default null
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojNBox.Row>>|null",
     *                                           SetterType: "Array<oj.ojNBox.Row>|Promise<Array<oj.ojNBox.Row>>|null"},
     *                                           jsdocOverride: true}
     * @ojtsexample <caption>set or get
     * <code class="prettyprint">rows</code> property:</caption>
     * let elem = document.getElementById('nbox') as ojNBox<string, object>;
     * //set rows to Promise. Assuming that getRows is a method which returns type Promise<Array<ojNBox.Row>>
     * elem.rows = getRows();
     * //or
     * elem.set('rows', getRows());
     *
     * //set rows to an array of ojNBox.Row
     * //elem.rows = [{id: '0'},{id: '1'}]; Please note this wont compile. Use the format below
     * elem.set('rows', [{id: '0'},{id: '1'}]);
     *
     * //get rows property value
     * let rows = elem.rows; //This is guaranteed to be of the type Promise<Array<ojNBox.Row>>|null
     *
     * //reset the value of rows to its default,
     * elem.unset('rows');
     */
    rows: null,

    /**
     * The text for the title on the row edge.
     * @expose
     * @name rowsTitle
     * @memberof oj.ojNBox
     * @ojtranslatable
     * @instance
     * @type {string=}
     * @default ""
     */
    rowsTitle: '',

    /**
     * An array containing the ids of the selected nodes.
     * @expose
     * @name selection
     * @ojshortdesc Specifies the ids of the selected nodes.
     * @memberof oj.ojNBox
     * @instance
     * @type {Array.<any>=}
     * @ojsignature [{target: "Type", value: "Array<K>"}]
     * @default []
     * @ojwriteback
     * @ojeventgroup common
     */
    selection: [],

    /**
     * <p>The type of selection behavior that is enabled on the NBox. This attribute controls the number of selections that can be made via selection gestures at any given time.
     *
     * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the NBox's selection styling will be applied to all items specified by the <a href="#selection">selection</a> attribute.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the NBox's selection styling will not be applied to any items specified by the <a href="#selection">selection</a> attribute.
     *
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> attribute.
     *
     * @expose
     * @name selectionMode
     * @memberof oj.ojNBox
     * @ojshortdesc Specifies the selection behavior on the NBox. See the Help documentation for more information.
     * @instance
     * @type {string=}
     * @ojvalue {string} "none" Selection is disabled.
     * @ojvalue {string} "single" Only a single item can be selected at a time.
     * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
     * @default "multiple"
     */
    selectionMode: 'multiple',

    /**
     * An object defining the style defaults for this NBox.
     * @expose
     * @name styleDefaults
     * @memberof oj.ojNBox
     * @instance
     * @type {Object=}
     */
    styleDefaults: {
      /**
       * The duration of the animations in milliseconds.  The default value comes from the CSS and varies based on theme.
       * @expose
       * @name styleDefaults.animationDuration
       * @ojshortdesc The duration of the animations in milliseconds.
       * @memberof! oj.ojNBox
       * @instance
       * @type {number=}
       * @ojunits milliseconds
       */
      animationDuration: undefined,

      /**
       * An object defining the style defaults for cells.
       * @expose
       * @name styleDefaults.cellDefaults
       * @memberof! oj.ojNBox
       * @instance
       * @type {Object=}
       */
      cellDefaults: {
        /**
         * The horizontal alignment value for the cell label.
         * @expose
         * @name styleDefaults.cellDefaults.labelHalign
         * @ojdisplayname Label Horizontal Alignment
         * @memberof! oj.ojNBox
         * @instance
         * @type {string=}
         * @ojvalue {string} "center"
         * @ojvalue {string} "end"
         * @ojvalue {string} "start"
         * @default "start"
         */
        labelHalign: 'start',

        /**
         * The CSS style object defining the style of the cell labels.
         * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
         * The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.cellDefaults.labelStyle
         * @ojshortdesc The CSS style object defining the style of the cell labels.
         * @memberof! oj.ojNBox
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         */
        labelStyle: undefined,

        /**
         * The CSS style object defining the styles of the cell background and border when the cell is maximized.
         * Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.cellDefaults.maximizedSvgStyle
         * @ojshortdesc The CSS style object defining the styles of the cell background and border when the cell is maximized.
         * @memberof! oj.ojNBox
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         */
        maximizedSvgStyle: undefined,

        /**
         * The CSS style object defining the styles of the cell background and border when the cell is minimized.
         * Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.cellDefaults.minimizedSvgStyle
         * @ojshortdesc The CSS style object defining the styles of the cell background and border when the cell is minimized.
         * @memberof! oj.ojNBox
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         */
        minimizedSvgStyle: undefined,

        /**
         * Determines when to display the cell count label (extra info displayed after primary cell label). "off" never show the count label. "on" always show the count label. Show countLabel value if specified, otherwise use a simple node count. "auto" show the count label if countLabel attribute is defined.
         * @expose
         * @ojshortdesc Specifies when to display the cell count label. See the Help documentation for more information.
         * @name styleDefaults.cellDefaults.showCount
         * @memberof! oj.ojNBox
         * @instance
         * @type {string=}
         * @ojvalue {string} "on"
         * @ojvalue {string} "off"
         * @ojvalue {string} "auto"
         * @default "auto"
         */
        showCount: 'auto',

        /**
         * The CSS style object defining the styles of the cell background and border.
         * Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.cellDefaults.svgStyle
         * @ojshortdesc The CSS style object defining the styles of the cell background and border.
         * @memberof! oj.ojNBox
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         */
        svgStyle: undefined
      },

      /**
       * The CSS style object defining the style of the column labels.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * The default value comes from the CSS and varies based on theme.
       * @expose
       * @name styleDefaults.columnLabelStyle
       * @ojshortdesc The CSS style object defining the style of the column labels.
       * @memberof! oj.ojNBox
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       */
      columnLabelStyle: undefined,

      /**
       * The CSS style object defining the style of the columns title.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * The default value comes from the CSS and varies based on theme.
       * @expose
       * @name styleDefaults.columnsTitleStyle
       * @ojshortdesc The CSS style object defining the style of the columns title.
       * @memberof! oj.ojNBox
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       */
      columnsTitleStyle: undefined,

      /**
       * Specifies initial hover delay in milliseconds for highlighting data items.
       * @expose
       * @name styleDefaults.hoverBehaviorDelay
       * @memberof! oj.ojNBox
       * @instance
       * @type {number=}
       * @default 200
       * @ojunits milliseconds
       */
      hoverBehaviorDelay: 200,

      /**
       * An object defining the style defaults for nodes.
       * @expose
       * @name styleDefaults.nodeDefaults
       * @memberof! oj.ojNBox
       * @instance
       * @type {Object=}
       */
      nodeDefaults: {
        /**
         * The default color of the node borders.  The default value varies based on theme.
         * @expose
         * @name styleDefaults.nodeDefaults.borderColor
         * @memberof! oj.ojNBox
         * @instance
         * @type {string=}
         * @ojformat color
         */
        borderColor: '',

        /**
         * The default width of the node borders.  The default value varies based on theme.
         * @expose
         * @name styleDefaults.nodeDefaults.borderWidth
         * @memberof! oj.ojNBox
         * @instance
         * @type {number=}
         * @ojunits pixels
         */
        borderWidth: 0,

        /**
         * The default background color of the nodes.  The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.nodeDefaults.color
         * @ojshortdesc The default background color of the nodes.
         * @memberof! oj.ojNBox
         * @instance
         * @type {string=}
         * @ojformat color
         */
        color: undefined,

        /**
         * An object defining the style defaults for the node icons.
         * @expose
         * @name styleDefaults.nodeDefaults.iconDefaults
         * @memberof! oj.ojNBox
         * @instance
         * @type {Object=}
         */
        iconDefaults: {
          /**
           * The default border color of the node icons.  The default value varies based on theme.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.borderColor
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @ojformat color
           */
          borderColor: '#000000',

          /**
           * The default border radius of the node icons. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.  The default value varies based on theme.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.borderRadius
           * @ojshortdesc The default border radius of the node icons. See the Help documentation for more information.
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           */
          borderRadius: 0,

          /**
           * The default border width of the node icons.  The default value varies based on theme.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.borderWidth
           * @memberof! oj.ojNBox
           * @instance
           * @type {number=}
           */
          borderWidth: 0,

          /**
           * The default fill color of the node icons.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.color
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @ojformat color
           * @default ""
           */
          color: '',

          /**
           * The default height of the node icons. If the value is 0, the height will be automatically based on the remaining node contents.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.height
           * @memberof! oj.ojNBox
           * @instance
           * @type {number=}
           * @default 0
           * @ojunits pixels
           */
          height: 0,

          /**
           * The default opacity of the node icons.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.opacity
           * @memberof! oj.ojNBox
           * @instance
           * @type {number=}
           * @default 1
           */
          opacity: 1,

          /**
           * The default fill pattern of the node icons.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.pattern
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @ojvalue {string} "smallChecker"
           * @ojvalue {string} "smallCrosshatch"
           * @ojvalue {string} "smallDiagonalLeft"
           * @ojvalue {string} "smallDiagonalRight"
           * @ojvalue {string} "smallDiamond"
           * @ojvalue {string} "smallTriangle"
           * @ojvalue {string} "largeChecker"
           * @ojvalue {string} "largeCrosshatch"
           * @ojvalue {string} "largeDiagonalLeft"
           * @ojvalue {string} "largeDiagonalRight"
           * @ojvalue {string} "largeDiamond"
           * @ojvalue {string} "largeTriangle"
           * @ojvalue {string} "none"
           * @default "none"
           */
          pattern: 'none',

          /**
           * The default shape of the node icons. Can take the name of a built-in shape or the SVG path commands for a custom shape.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.shape
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @ojvalue {string=} "circle"
           * @ojvalue {string=} "ellipse"
           * @ojvalue {string=} "square"
           * @ojvalue {string=} "plus"
           * @ojvalue {string=} "diamond"
           * @ojvalue {string=} "triangleUp"
           * @ojvalue {string=} "triangleDown"
           * @ojvalue {string=} "human"
           * @ojvalue {string=} "rectangle"
           * @ojvalue {string=} "star"
           * @default "square"
           */
          shape: 'square',

          /**
           * The URL of an image to display by default for the node icons.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.source
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @default ""
           */
          source: '',

          /**
           * The URL of an image to display by default for the node icons.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.background
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @ojvalue {string=} "neutral"
           * @ojvalue {string=} "red"
           * @ojvalue {string=} "orange"
           * @ojvalue {string=} "forest"
           * @ojvalue {string=} "green"
           * @ojvalue {string=} "teal"
           * @ojvalue {string=} "blue"
           * @ojvalue {string=} "slate"
           * @ojvalue {string=} "pink"
           * @ojvalue {string=} "mauve"
           * @ojvalue {string=} "purple"
           * @ojvalue {string=} "lilac"
           * @ojvalue {string=} "gray"
           * @ojdeprecated [{target:'propertyValue', for:"red", since: "10.0.0", description: "This value will be removed in the future. Please use other colors."},
           *                {target:'propertyValue', for:"forest", since: "10.0.0", description: "This value will be removed in the future. Please use other colors."},
           *                {target:'propertyValue', for:"mauve", since: "10.0.0", description: "This value will be removed in the future. Please use other colors."}]
           * @default "neutral"
           */
          background: 'neutral',

          /**
           * The default width of the node icons.  If the value is 0, the width will be automatically based on the remaining node contents.
           * @expose
           * @name styleDefaults.nodeDefaults.iconDefaults.width
           * @memberof! oj.ojNBox
           * @instance
           * @type {number=}
           * @default 0
           */
          width: 0
        },

        /**
         * The default background color of the node indicator sections.
         * @expose
         * @name styleDefaults.nodeDefaults.indicatorColor
         * @memberof! oj.ojNBox
         * @instance
         * @type {string=}
         * @ojformat color
         * @default ""
         */
        indicatorColor: '',

        /**
         * An object defining the style defaults for the node indicator icons.
         * @expose
         * @name styleDefaults.nodeDefaults.indicatorIconDefaults
         * @memberof! oj.ojNBox
         * @instance
         * @type {Object=}
         */
        indicatorIconDefaults: {
          /**
           * The default border color of the node indicator icons.  The default value varies based on theme.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.borderColor
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @ojformat color
           */
          borderColor: '#000000',

          /**
           * The default border radius of the node indicator icons. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.  The default value varies based on theme.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.borderRadius
           * @ojshortdesc The default border radius of the node indicator icons. See the Help documentation for more information.
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           */
          borderRadius: 0,

          /**
           * The default border width of the node indicator icons.  The default value varies based on theme.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.borderWidth
           * @memberof! oj.ojNBox
           * @instance
           * @type {number=}
           */
          borderWidth: 0,

          /**
           * The default fill color of the node indicator icons.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.color
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @ojformat color
           * @default ""
           */
          color: '',

          /**
           * The default height of the node indicator icons.  The default value varies based on theme.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.height
           * @memberof! oj.ojNBox
           * @instance
           * @type {number=}
           * @ojunits pixels
           */
          height: 10,

          /**
           * The default opacity of the node indicator icons.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.opacity
           * @memberof! oj.ojNBox
           * @instance
           * @type {number=}
           * @default 1
           */
          opacity: 1,

          /**
           * The default fill pattern of the node indicator icons.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.pattern
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @ojvalue {string} "smallChecker"
           * @ojvalue {string} "smallCrosshatch"
           * @ojvalue {string} "smallDiagonalLeft"
           * @ojvalue {string} "smallDiagonalRight"
           * @ojvalue {string} "smallDiamond"
           * @ojvalue {string} "smallTriangle"
           * @ojvalue {string} "largeChecker"
           * @ojvalue {string} "largeCrosshatch"
           * @ojvalue {string} "largeDiagonalLeft"
           * @ojvalue {string} "largeDiagonalRight"
           * @ojvalue {string} "largeDiamond"
           * @ojvalue {string} "largeTriangle"
           * @ojvalue {string} "none"
           * @default "none"
           */
          pattern: 'none',

          /**
           * The default shape of the node indicator icons. Can take the name of a built-in shape or the SVG path commands for a custom shape.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.shape
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @ojvalue {string=} "circle"
           * @ojvalue {string=} "ellipse"
           * @ojvalue {string=} "square"
           * @ojvalue {string=} "plus"
           * @ojvalue {string=} "diamond"
           * @ojvalue {string=} "triangleUp"
           * @ojvalue {string=} "triangleDown"
           * @ojvalue {string=} "human"
           * @ojvalue {string=} "rectangle"
           * @ojvalue {string=} "star"
           * @default "square"
           */
          shape: 'square',

          /**
           * The URL of an image to display by default for the node indicator icons.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.source
           * @memberof! oj.ojNBox
           * @instance
           * @type {string=}
           * @default null
           */
          source: '',

          /**
           * The default width of the node indicator icons.  The default value varies based on theme.
           * @expose
           * @name styleDefaults.nodeDefaults.indicatorIconDefaults.width
           * @memberof! oj.ojNBox
           * @instance
           * @type {number=}
           * @ojunits pixels
           */
          width: 10
        },

        /**
         * The CSS style object defining the style of the node labels.
         * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
         * The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.nodeDefaults.labelStyle
         * @ojshortdesc The CSS style object defining the style of the node labels.
         * @memberof! oj.ojNBox
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         */
        labelStyle: undefined,

        /**
         * The CSS style object defining the style of the node secondary labels.
         * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
         * The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.nodeDefaults.secondaryLabelStyle
         * @ojshortdesc The CSS style object defining the style of the node secondary labels.
         * @memberof! oj.ojNBox
         * @instance
         * @type {Object=}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         */
        secondaryLabelStyle: undefined
      },

      /**
       * The CSS style object defining the style of the row labels.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * The default value comes from the CSS and varies based on theme.
       * @expose
       * @name styleDefaults.rowLabelStyle
       * @ojshortdesc The CSS style object defining the style of the row labels.
       * @memberof! oj.ojNBox
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       */
      rowLabelStyle: undefined,

      /**
       * The CSS style object defining the style of the rows title.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * @expose
       * @name styleDefaults.rowsTitleStyle
       * @ojshortdesc The CSS style object defining the style of the rows title.
       * @memberof! oj.ojNBox
       * @instance
       * @type {Object=}
       * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
       * @default null
       */
      rowsTitleStyle: undefined
    },

    /**
     * An object containing an optional callback function for tooltip customization.
     * @expose
     * @name tooltip
     * @memberof oj.ojNBox
     * @instance
     * @type {Object=}
     */
    tooltip: {
      /**
       *
       * A function that returns a custom tooltip for the NBox nodes. The function takes a dataContext argument,
       * provided by the NBox. The function should return an Object that contains only one of the two properties:
       *  <ul>
       *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li>
       *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li>
       *  </ul>
       * @expose
       * @name tooltip.renderer
       * @ojshortdesc A function that returns a custom tooltip. See the Help documentation for more information.
       * @memberof! oj.ojNBox
       * @instance
       * @type {function(Object)|null}
       * @default null
       * @ojsignature {target: "Type", value: "((context: oj.ojNBox.TooltipContext<K>) => ({insert: Element|string}|{preventDefault: boolean}))|null", jsdocOverride: true}
       */
      renderer: null
    },

    /**
     * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events if the element does not require an internal feature that requires a touch start gesture like scrolling. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if panning is not available for those elements that support the feature.
     * @expose
     * @name touchResponse
     * @ojshortdesc Specifies configuration options for touch and hold delays on mobile devices. See the Help documentation for more information.
     * @memberof oj.ojNBox
     * @instance
     * @type {string=}
     * @ojvalue {string} "touchStart"
     * @ojvalue {string} "auto"
     * @default "auto"
     */
    touchResponse: 'auto'
  },

  _CreateDvtComponent: function (context, callback, callbackObj) {
    return new NBox(context, callback, callbackObj);
  },

  _ConvertLocatorToSubId: function (locator) {
    var subId = locator.subId;

    // Convert the supported locators
    if (subId === OJ_NBOX_CELL) {
      // cell[row,column]
      subId = 'cell[' + locator.row + ',' + locator.column + ']';
    } else if (subId === OJ_NBOX_DIALOG) {
      subId = 'dialog';
    } else if (subId === OJ_NBOX_DIALOG_CLOSE_BUTTON) {
      subId = 'dialog#closeButton';
    } else if (subId === OJ_NBOX_GROUP_NODE) {
      // groupNode[groupCategory] or cell[row,column]#groupNode[groupCategory]
      if (locator.row && locator.column) {
        subId = 'cell[' + locator.row + ',' + locator.column + ']#groupNode[';
      } else {
        subId = 'groupNode[';
      }

      subId += locator.groupCategory + ']';
    } else if (subId === OJ_NBOX_NODE) {
      var index;
      subId = '';

      var id = locator.id;
      var auto = this._component.getAutomation();
      index = auto.getNodeIndexFromId(id);
      subId += 'node[' + index + ']';
    } else if (subId === OJ_NBOX_OVERFLOW) {
      // cell[row,col]#overflow
      subId = 'cell[' + locator.row + ',' + locator.column + ']#overflow';
    } else if (subId === OJ_NBOX_TOOLTIP) {
      subId = 'tooltip';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  _ConvertSubIdToLocator: function (subId) {
    var locator = {};

    if (subId.indexOf('node') === 0) {
      locator.subId = OJ_NBOX_NODE;

      var index = this._GetFirstIndex(subId);
      var auto = this._component.getAutomation();
      locator.id = auto.getNodeIdFromIndex(index);
    } else if (subId.indexOf('cell') === 0) {
      // cell[row,column] or cell[row,column]#groupNode[groupCategory] or cell[row,column]#node[index]
      var cellIds = this._GetFirstBracketedString(subId);
      var commaIndex = cellIds.indexOf(',');
      locator.row = cellIds.substring(0, commaIndex);
      locator.column = cellIds.substring(commaIndex + 1);

      var poundIndex = subId.indexOf('#');
      if (subId.indexOf('#groupNode') >= 0) {
        locator.subId = OJ_NBOX_GROUP_NODE;
        locator.groupCategory = this._GetFirstBracketedString(subId.substring(poundIndex));
      } else if (subId.indexOf('#overflow') >= 0) {
        locator.subId = OJ_NBOX_OVERFLOW;
      } else {
        locator.subId = OJ_NBOX_CELL;
      }
    } else if (subId.indexOf('dialog') === 0) {
      if (subId.indexOf('#closeButton') >= 0) {
        // dialog#closeButton
        locator.subId = OJ_NBOX_DIALOG_CLOSE_BUTTON;
      } else {
        locator.subId = OJ_NBOX_DIALOG;
      }
    } else if (subId.indexOf('groupNode') === 0) {
      // groupNode[groupCategory] or cell[row,column]#groupNode[groupCategory]
      locator.subId = OJ_NBOX_GROUP_NODE;
      locator.groupCategory = this._GetFirstBracketedString(subId);
    } else if (subId === 'tooltip') {
      locator.subId = OJ_NBOX_TOOLTIP;
    }

    return locator;
  },

  _GetComponentStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses.push('oj-nbox');
    return styleClasses;
  },

  _GetChildStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses['oj-dvtbase oj-nbox'] = {
      path: 'styleDefaults/animationDuration',
      property: 'ANIM_DUR'
    };
    styleClasses['oj-nbox-container'] = {
      path: '__layout/cellGap',
      property: 'grid-gap'
    };
    styleClasses['oj-nbox-columns-title'] = {
      path: 'styleDefaults/columnsTitleStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-rows-title'] = {
      path: 'styleDefaults/rowsTitleStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-column-label'] = {
      path: 'styleDefaults/columnLabelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-row-label'] = {
      path: 'styleDefaults/rowLabelStyle',
      property: 'TEXT'
    };

    styleClasses[OJ_NBOX_CELL] = [
      {
        path: 'styleDefaults/cellDefaults/_style',
        property: 'BACKGROUND'
      },
      {
        path: 'styleDefaults/cellDefaults/_borderRadius',
        property: 'border-radius'
      },
      {
        path: '__layout/gridGap',
        property: 'grid-gap'
      },
      {
        path: '__layout/cellInnerPadding',
        property: 'padding'
      },
      {
        path: '__layout/minimumCellSize',
        property: 'height'
      }
    ];
    styleClasses['oj-nbox-cell oj-minimized'] = {
      path: 'styleDefaults/cellDefaults/_minimizedStyle',
      property: 'BACKGROUND'
    };
    styleClasses['oj-nbox-cell oj-maximized'] = {
      path: 'styleDefaults/cellDefaults/_maximizedStyle',
      property: 'BACKGROUND'
    };

    styleClasses['oj-nbox-cell-label'] = {
      path: 'styleDefaults/cellDefaults/labelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-cell-label oj-minimized'] = {
      path: 'styleDefaults/cellDefaults/_labelMinimizedStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-cell-label oj-maximized'] = {
      path: 'styleDefaults/cellDefaults/_labelMaximizedStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-cell-countlabel'] = {
      path: 'styleDefaults/cellDefaults/bodyCountLabelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-cell-countlabel oj-nbox-cell-header'] = {
      path: 'styleDefaults/cellDefaults/countLabelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-cell-shadow'] = {
      path: 'styleDefaults/cellDefaults/_panelShadow',
      property: 'box-shadow'
    };
    styleClasses[OJ_NBOX_NODE] = [
      {
        path: 'styleDefaults/nodeDefaults/color',
        property: 'background-color'
      },
      {
        path: 'styleDefaults/nodeDefaults/_borderRadius',
        property: 'border-radius'
      },
      {
        path: '__layout/minimumLabelWidth',
        property: 'min-width'
      },
      {
        path: '__layout/maximumLabelWidth',
        property: 'max-width'
      }
    ];
    styleClasses['oj-nbox-node oj-hover'] = {
      path: 'styleDefaults/nodeDefaults/hoverColor',
      property: BORDER_COLOR
    };
    styleClasses['oj-nbox-node oj-selected'] = {
      path: 'styleDefaults/nodeDefaults/selectionColor',
      property: BORDER_COLOR
    };
    styleClasses['oj-nbox-node-no-label'] = {
      path: 'styleDefaults/nodeDefaults/iconDefaults/preferredSizeNoLabel',
      property: 'height'
    };
    styleClasses['oj-nbox-node-one-label-padding'] = {
      path: '__layout/nodeSingleLabelGap',
      property: 'padding'
    };
    styleClasses['oj-nbox-node-two-label-padding'] = {
      path: '__layout/nodeDualLabelGap',
      property: 'padding'
    };
    styleClasses['oj-nbox-node-label'] = {
      path: 'styleDefaults/nodeDefaults/labelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-node-secondarylabel'] = {
      path: 'styleDefaults/nodeDefaults/secondaryLabelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-node-initials-background'] = {
      path: 'styleDefaults/nodeDefaults/iconDefaults/backgroundSize',
      property: 'width'
    };
    styleClasses['oj-nbox-node-categorylabel'] = {
      path: 'styleDefaults/_categoryNodeDefaults/labelStyle',
      property: 'TEXT'
    };
    styleClasses[OJ_NBOX_DIALOG] = [
      { path: 'styleDefaults/_drawerDefaults/background', property: 'background-color' },
      { path: 'styleDefaults/_drawerDefaults/borderColor', property: BORDER_COLOR }
    ];
    styleClasses['oj-nbox-dialog-label'] = {
      path: 'styleDefaults/_drawerDefaults/labelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-nbox-dialog-countlabel'] = {
      path: 'styleDefaults/_drawerDefaults/countLabelStyle',
      property: 'TEXT'
    };

    return styleClasses;
  },

  _GetEventTypes: function () {
    return ['optionChange'];
  },

  _LoadResources: function () {
    // Ensure the resources object exists
    if (this.options._resources == null) {
      this.options._resources = {};
    }

    var resources = this.options._resources;
    resources.overflow = {
      class: 'oj-fwk-icon oj-fwk-icon-dots-horizontal',
      width: 34,
      height: 9
    };
    resources.close = {
      class: 'oj-fwk-icon oj-fwk-icon-cross',
      width: 16,
      height: 16
    };
    resources.background_neutral = {
      src: 'oj-nbox-node-initials-neutral',
      width: 44,
      height: 44
    };
    resources.background_teal = {
      src: 'oj-nbox-node-initials-teal',
      width: 44,
      height: 44
    };
    resources.background_red = {
      src: 'oj-nbox-node-initials-red',
      width: 44,
      height: 44
    };
    resources.background_green = {
      src: 'oj-nbox-node-initials-green',
      width: 44,
      height: 44
    };
    resources.background_orange = {
      src: 'oj-nbox-node-initials-orange',
      width: 44,
      height: 44
    };
    resources.background_mauve = {
      src: 'oj-nbox-node-initials-mauve',
      width: 44,
      height: 44
    };
    resources.background_pink = {
      src: 'oj-nbox-node-initials-pink',
      width: 44,
      height: 44
    };
    resources.background_forest = {
      src: 'oj-nbox-node-initials-forest',
      width: 44,
      height: 44
    };
    resources.background_purple = {
      src: 'oj-nbox-node-initials-purple',
      width: 44,
      height: 44
    };
    resources.background_blue = {
      src: 'oj-nbox-node-initials-blue',
      width: 44,
      height: 44
    };
    resources.background_slate = {
      src: 'oj-nbox-node-initials-slate',
      width: 44,
      height: 44
    };
    resources.background_lilac = {
      src: 'oj-nbox-node-initials-lilac',
      width: 44,
      height: 44
    };
    resources.background_gray = {
      src: 'oj-nbox-node-initials-gray',
      width: 44,
      height: 44
    };
  },

  _GetComponentNoClonePaths: function () {
    var noClonePaths = this._super();
    noClonePaths.data = true;
    noClonePaths.nodes = true;
    return noClonePaths;
  },

  getNodeBySubId: function (locator) {
    return this._super(locator);
  },

  getSubIdByNode: function (node) {
    return this._super(node);
  },

  /**
   * Get the NBox rows title.
   * @return {String} NBox rows title.
   * @expose
   * @memberof oj.ojNBox
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getRowsTitle: function () {
    var auto = this._component.getAutomation();
    return auto.getData('rowsTitle');
  },

  /**
   * Get the NBox row count.
   * @return {Number} NBox row count.
   * @expose
   * @memberof oj.ojNBox
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getRowCount: function () {
    var auto = this._component.getAutomation();
    return auto.getData('rowCount');
  },

  /**
   * Returns an object with the following properties for automation testing verification of the NBox row at the
   * specified value.
   *
   * @param {string} rowValue The id of the row.
   * @property {string} label The label of the row.
   * @return {Object|null} An object containing properties for the row, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @ojshortdesc Returns information for automation testing verification of a specified NBox row.
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getRow: function (rowValue) {
    var auto = this._component.getAutomation();
    return auto.getData('row', rowValue);
  },

  /**
   * Get the NBox columns title.
   * @return {String} NBox columns title.
   * @expose
   * @memberof oj.ojNBox
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getColumnsTitle: function () {
    var auto = this._component.getAutomation();
    return auto.getData('columnsTitle');
  },

  /**
   * Get the NBox column count.
   * @return {Number} NBox column count.
   * @expose
   * @memberof oj.ojNBox
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getColumnCount: function () {
    var auto = this._component.getAutomation();
    return auto.getData('columnCount');
  },

  /**
   * Returns an object with the following properties for automation testing verification of the NBox column at the
   * specified value.
   *
   * @param {string} columnValue The id of the column.
   * @property {string} label The label of the column.
   * @return {Object|null} An object containing properties for the column, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @ojshortdesc Returns information for automation testing verification of a specified NBox column.
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getColumn: function (columnValue) {
    var auto = this._component.getAutomation();
    return auto.getData('column', columnValue);
  },

  /**
   * Returns an object with the following properties for automation testing verification of the NBox cell at the
   * specified row and column values.
   *
   * @param {string} rowValue The id of the containing row.
   * @param {string} columnValue The id of the containing column.
   * @property {string} background The background of the cell.
   * @property {string} label The label of the cell.
   * @property {Function(string)} getGroupNode A function taking a group category string and returning the corresponding group node.
   * @property {string} getGroupNode.color The color of the group node.
   * @property {string} getGroupNode.indicatorColor The color of the group node indicator section.
   * @property {Object} getGroupNode.indicatorIcon The indicator marker for the group node.
   * @property {string} getGroupNode.indicatorIcon.color The color of the indicator marker.
   * @property {string} getGroupNode.indicatorIcon.shape The shape of the indicator marker.
   * @property {boolean} getGroupNode.selected Whether or not the group node is selected.
   * @property {number} getGroupNode.size The number of nodes the group node represents.
   * @property {string} getGroupNode.tooltip The tooltip of the group node.
   * @property {Function(number)} getNode A function taking the node index that returns an object with properties for the specified node, or null if none exists.
   * @property {string} getNode.color The color of the node.
   * @property {Object} getNode.icon The icon marker for the node.
   * @property {string} getNode.icon.color The color of the icon marker.
   * @property {string} getNode.icon.shape The shape of the icon marker.
   * @property {string} getNode.indicatorColor The color of the node indicator section.
   * @property {Object} getNode.indicatorIcon The indicator marker for the node.
   * @property {string} getNode.indicatorIcon.color The color of the indicator marker.
   * @property {string} getNode.indicatorIcon.shape The shape of the indicator marker.
   * @property {string} getNode.label The label of the node.
   * @property {string} getNode.secondaryLabel The secondary label of the node.
   * @property {boolean} getNode.selected Whether or not the node is selected.
   * @property {string} getNode.tooltip The tooltip of the node.
   * @property {Function} getNodeCount A function that returns the number of nodes in the cell.
   * @return {Object|null} An object containing properties for the cell, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @ojshortdesc Returns information for automation testing verification of a specified NBox cell.
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getCell: function (rowValue, columnValue) {
    var auto = this._component.getAutomation();
    var ret = auto.getCell(rowValue, columnValue);
    if (ret) {
      ret.getGroupNode = function (groupMap) {
        return auto.getCellGroupNode(ret, groupMap);
      };
      ret.getNode = function (nodeIndex) {
        return auto.getCellNode(ret, nodeIndex);
      };
    }
    return ret;
  },

  /**
   * Get the NBox group behavior.
   * @return {String} group behavior The group behavior of the NBox ('withinCell', 'acrossCells', 'none').
   * @expose
   * @memberof oj.ojNBox
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getGroupBehavior: function () {
    var auto = this._component.getAutomation();
    return auto.getData('groupBehavior');
  },

  /**
   * Returns an object with the following properties for automation testing verification of the NBox group node with the
   * specified group category string.
   *
   * @param {String} groupCategory A string corresponding to the groupCategory value of the nodes represented by this group node.
   * @property {string} color The color of the group node.
   * @property {string} indicatorColor The indicator color of the group node.
   * @property {Object} indicatorIcon The indicator marker for the group node, or null if none exists.
   * @property {string} indicatorIcon.color The color of the indicator marker.
   * @property {string} indicatorIcon.shape The shape of the indicator marker.
   * @property {boolean} selected Whether or not the group node is selected.
   * @property {number} size The number of nodes the group node represents.
   * @property {string} tooltip The tooltip of the group node.
   * @return {Object|null} An object containing properties for the group node, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @ojshortdesc Returns information for automation testing verification of a specified NBox group node.
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getGroupNode: function (groupCategory) {
    var auto = this._component.getAutomation();
    return auto.getGroupNode(groupCategory);
  },

  /**
   * Returns an object with the following properties for automation testing verification of the currently active NBox
   * dialog.
   *
   * @property {string} label The label of the dialog.
   * @property {Function(number)} getNode A function taking the node index that returns an object with properties for the specified node, or null if none exists.
   * @property {boolean} getNode.selected
   * @property {string} getNode.color The color of the node.
   * @property {Object} getNode.icon The icon marker for the node, or null if none exists.
   * @property {string} getNode.icon.color The color of the icon marker.
   * @property {string} getNode.icon.shape The shape of the icon marker.
   * @property {string} getNode.indicatorColor The indicator color of the node.
   * @property {Object} getNode.indicatorIcon The indicator icon for the node, or null if none exists.
   * @property {string} getNode.indicatorIcon.color The color of the indicator icon.
   * @property {string} getNode.indicatorIcon.shape The shape of the indicator icon.
   * @property {string} getNode.label The label of the node.
   * @property {string} getNode.secondaryLabel The secondary label of the node.
   * @property {string} getNode.tooltip The tooltip of the node.
   * @property {Function} getNodeCount A function that returns the number of nodes in the cell.
   * @return {Object|null} An object containing properties for the dialog, or null if none exists.
   * @expose
   * @memberof oj.ojNBox
   * @ojshortdesc Returns information for automation testing verification of the currently active NBox dialog.
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getDialog: function () {
    var auto = this._component.getAutomation();
    var ret = auto.getDialog();
    if (ret) {
      ret.getNode = function (nodeIndex) {
        return auto.getDialogNode(nodeIndex);
      };
    }
    return ret;
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @ojsignature {target: "Type", value: "oj.ojNBox.NodeContext<K>|oj.ojNBox.CellContext|oj.ojNBox.DialogContext|oj.ojNBox.GroupNodeContext|null", jsdocOverride: true, for: "returns"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojNBox
   * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
   */
  getContextByNode: function (node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (
      context &&
      context.subId !== OJ_NBOX_TOOLTIP &&
      context.subId !== OJ_NBOX_DIALOG_CLOSE_BUTTON &&
      context.subId !== OJ_NBOX_OVERFLOW
    ) {
      return context;
    }

    return null;
  },

  _GetComponentDeferredDataPaths: function () {
    return { root: ['cells', 'rows', 'columns', 'nodes', 'data'] };
  },

  _GetSimpleDataProviderConfigs: function () {
    return {
      data: {
        templateName: 'nodeTemplate',
        templateElementName: 'oj-n-box-node',
        resultPath: 'nodes'
      }
    };
  }
});

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
 *       <td>Cell</td>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>Maximize/restore cell.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="3">Node</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td>Overflow Indicator</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Maximize cell.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="4">Group Node</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>Open group node dialog.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td>Dialog</td>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>Close dialog.</td>
 *     </tr>
 *     <tr>
 *       <td>Close Button</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Close dialog.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojNBox
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Maximize focused cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Open dialog for focused group node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Escape</kbd></td>
 *       <td>Restore maximized cell.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Escape</kbd></td>
 *       <td>Close dialog.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>[</kbd></td>
 *       <td>Move to first node in cell or dialog</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>]</kbd></td>
 *       <td>Move to containing cell or dialog</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Left Arrow</kbd></td>
 *       <td>When cell focused, move to nearest cell to the left.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Right Arrow</kbd></td>
 *       <td>When cell focused, move to nearest cell to the right.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Up Arrow</kbd></td>
 *       <td>When cell focused, move to nearest cell above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Down Arrow</kbd></td>
 *       <td>When cell focused, move to nearest cell below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Left Arrow or Up Arrow</kbd></td>
 *       <td>When node focused, move to previous node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Right Arrow or Down Arrow</kbd></td>
 *       <td>When node focused, move to previous node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Left Arrow or Ctrl + Up Arrow</kbd></td>
 *       <td>When node focused, move to previous node but do not select.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Right Arrow or Ctrl + Down Arrow</kbd></td>
 *       <td>When node focused, move to previous node but do not select.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Space</kbd></td>
 *       <td>Select or Unselect focused node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Left Arrow or Shift + Up Arrow</kbd></td>
 *       <td>Move focus and multi-select previous node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Right Arrow or Down + Up Arrow</kbd></td>
 *       <td>Move focus and multi-select next node.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojNBox
 */

// PROPERTY TYPEDEFS
/**
 * @typedef {Object} oj.ojNBox.Node
 * @property {any=} id The node id. The node id should be set by the application if the DataProvider is not being used.
 * @property {string=} borderColor The border color of the node. Does not apply if custom image is specified.
 * @property {number=} borderWidth The border width of the node in pixels. Does not apply if custom image is specified.
 * @property {Array.<string>=} categories An optional array of additional category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with other visualization elements. Defaults to node's id if unspecified.
 * @property {string=} color The color of the node. Does not apply if custom image is specified.
 * @property {string} column The column id for this node.
 * @property {string=} groupCategory The group category this node belongs to. Nodes with the same groupCategory will be grouped together.
 * @property {Object=} icon Defines the primary icon for this node.
 * @property {string=} icon.borderColor The border color of this icon.
 * @property {string=} icon.borderRadius The border radius of this icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
 * @property {number=} icon.borderWidth The border width of this icon.
 * @property {string=} icon.color The fill color of this icon.
 * @property {number=} icon.height The height of this icon.
 * @property {number=} icon.opacity The opacity of this icon.
 * @property {("largeChecker"|"largeCrosshatch"|"largeDiagonalLeft"|"largeDiagonalRight"|"largeDiamond"|"largeTriangle"|"none"|"smallChecker"|"smallCrosshatch"|"smallDiagonalLeft"|"smallDiagonalRight"|"smallDiamond"|"smallTriangle")=} icon.pattern The pattern of this icon.
 * @property {("circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string)=} icon.shape The shape of this icon. Can take the name of a built-in shape or the SVG path commands for a custom shape.
 * @property {string=} icon.source The URL of an image to display for this icon.
 * @property {string=} icon.initials The initials displayed for this icon.
 * @property {("neutral"|"red"|"orange"|"forest"|"green"|"teal"|"mauve"|"purple")=} icon.background The background of initials
 * @property {string=} icon.svgClassName The CSS style class defining the style of this icon.  Will not be applied if initials are specified.
 * @property {Object=} icon.svgStyle The CSS style object defining the style of this icon. Only SVG CSS style properties are supported. Will not be applied if initials are specified.  The default value comes from the CSS and varies based on theme.
 * @property {number=} icon.width The width of this icon.
 * @property {string=} indicatorColor The background color for the indicator section of this node.
 * @property {Object=} indicatorIcon Defines the indicator icon for this node.
 * @property {string=} indicatorIcon.borderColor The border color of this indicator icon.
 * @property {string=} indicatorIcon.borderRadius The border radius of this indicator icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
 * @property {number=} indicatorIcon.borderWidth The border width of this indicator icon.
 * @property {string=} indicatorIcon.color The fill color of this indicator icon.
 * @property {number=} indicatorIcon.height The height of this indicator icon.
 * @property {number=} indicatorIcon.opacity The opacity of this indicator icon.
 * @property {("largeChecker"|"largeCrosshatch"|"largeDiagonalLeft"|"largeDiagonalRight"|"largeDiamond"|"largeTriangle"|"none"|"smallChecker"|"smallCrosshatch"|"smallDiagonalLeft"|"smallDiagonalRight"|"smallDiamond"|"smallTriangle")=} indicatorIcon.pattern The pattern of this indicator icon.
 * @property {("circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string)=} indicatorIcon.shape The shape of this indicator icon. Can take the name of a built-in shape or the SVG path commands for a custom shape.
 * @property {string=} indicatorIcon.source The URL of an image to display for this indicator icon.
 * @property {string=} indicatorIcon.svgClassName The CSS style class defining the style of this indicator icon.
 * @property {Object=} indicatorIcon.svgStyle The CSS style object defining the style of this indicator icon. Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
 * @property {number=} indicatorIcon.width The width of this indicator icon.
 * @property {string} row The row id for this node.
 * @property {string=} label The text for the node label.
 * @property {string=} secondaryLabel The text for the secondary node label.
 * @property {string=} svgClassName The CSS style class defining the style of this node.
 * @property {Object=} svgStyle The CSS style object defining the style of this node. Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
 * @property {number=} xPercentage An optional horizontal position (as a percentage) to be used in the average position calculation when grouping across cells.
 * @property {number=} yPercentage An optional vertical position (as a percentage) to be used in the average position calculation when grouping across cells.
 * @property {(string|function)=} shortDesc The description of this node. This is used for accessibility and also for customizing the tooltip text.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "icon.svgStyle", jsdocOverride:true},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "indicatorIcon.svgStyle", jsdocOverride:true},
 *               {target: "Type", value: "?(string | ((context: oj.ojNBox.NodeShortDescContext<K>) => string))", jsdocOverride: true, for: "shortDesc"},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride:true}]
 */

/**
 * @typedef {Object} oj.ojNBox.Cell
 * @property {string=} label The text for the cell label.
 * @property {string} column The id of the column containing this cell.
 * @property {string=} labelHalign The horizontal alignment value for the cell label.
 * @property {Object=} labelStyle The CSS style object defining the style of the cell label. The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration. The default value comes from the CSS and varies based on theme.
 * @property {string=} svgClassName The CSS style class for this cell. Used for customizing the cell background and border.
 * @property {Object=} svgStyle The CSS style object for this cell. Used for customizing the cell background and border. Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
 * @property {Object=} maximizedSvgStyle The CSS style object for this cell. Used for customizing the maximized cell background and border. Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
 * @property {string=} maximizedSvgClassName The CSS style class for this cell. Used for customizing the minimized cell background and border.
 * @property {Object=} minimizedSvgStyle The CSS style object for this cell. Used for customizing the minimized cell background and border. Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
 * @property {string=} minimizedSvgClassName The CSS style class for this cell. Used for customizing the minimized cell background and border.
 * @property {string} row The id of the row containing this cell.
 * @property {"on"|"off"|"auto"} [showCount="auto"] Determines when to display the cell count label (extra info displayed after primary cell label). "off" never show the count label. "on" always show the count label. Show countLabel value if specified, otherwise use a simple node count. "auto" show the count label if countLabel attribute is defined.
 * @property {string=} shortDesc The description of this cell. This is used for accessibility.
 * @ojsignature [{target: "Type", value: "Partial<CSSStyleDeclaration>", for: "labelStyle", jsdocOverride: true},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride: true},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "maximizedSvgStyle", jsdocOverride: true},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "minimizedSvgStyle", jsdocOverride: true}]
 */

/**
 * @typedef {Object} oj.ojNBox.Column
 * @property {string} id The id of the column. Used to identify this column.
 * @property {string=} label The text for the column label.
 * @property {Object=} labelStyle The CSS style object defining the style of the column label. The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "labelStyle", jsdocOverride: true}
 */

/**
 * @typedef {Object} oj.ojNBox.Row
 * @property {string} id The id of the row. Used to identify this row.
 * @property {string=} label The text for the row label.
 * @property {Object=} labelStyle The CSS style object defining the style of the row label. The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "labelStyle", jsdocOverride: true}
 */

/**
 * @typedef {Object} oj.ojNBox.NodeContext Context for NBox node with specified id.
 * @property {any} id The id of the node.
 * @property {"oj-nbox-node"} subId Identifies the type of the associated DOM node.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojNBox.CellContext Context for NBox cell with specified row and column values.
 * @property {string} row The id of the row.
 * @property {string} column The id of the column.
 * @property {"oj-nbox-cell"} subId Identifies the type of the associated DOM node.
 */

/**
 * @typedef {Object} oj.ojNBox.DialogContext Context for NBox group node dialog.
 * @property {"oj-nbox-dialog"} subId Identifies the type of the associated DOM node.
 */

/**
 * @typedef {Object} oj.ojNBox.GroupNodeContext Context for NBox node with specified id.
 * @property {string} row The id of the row of the associated cell, if one exists.
 * @property {string} column The id of the column of the associated cell, if one exists.
 * @property {string} groupCategory The category represented by the returned group node.
 * @property {"oj-nbox-group-node"} subId Identifies the type of the associated DOM node.
 */

/**
 * @typedef {Object} oj.ojNBox.TooltipContext
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 * @property {any} id The id of the hovered node.
 * @property {string} label The label of the hovered node.
 * @property {string} secondaryLabel The secondaryLabel of the hovered node.
 * @property {string} row The id of the row containing the hovered node.
 * @property {string} column The id of the column containing the hovered node.
 * @property {string} color The color of the hovered node.
 * @property {string} indicatorColor The indicator color of the hovered node.
 * @property {Element} componentElement The NBox HTML element.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
 */
/**
 * @typedef {Object} oj.ojNBox.CountLabelContext
 * @property {string} row The row value of the cell.
 * @property {string} column The column value of the cell.
 * @property {number} nodeCount The number of non-hidden nodes in the cell.
 * @property {number} totalNodeCount The number of non-hidden nodes in the NBox.
 * @property {number} highlightedNodeCount The number of highlighted nodes in the cell.
 */

/**
 * @typedef {Object} oj.ojNBox.NodeShortDescContext
 * @property {any} id The id of the hovered node.
 * @property {string} label The label of the hovered node.
 * @property {string} secondaryLabel The secondaryLabel of the hovered node.
 * @property {string} row The id of the row containing the hovered node.
 * @property {string} column The id of the column containing the hovered node.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for NBox cell with specified row and column values.</p>
 *
 * @property {string} row The id of the row.
 * @property {string} column The id of the column.
 *
 * @ojsubid oj-nbox-cell
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the cell with row value 'low' and column value 'high':</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-cell', row: 'low', column: 'high'} );
 */

/**
 * <p>Sub-ID for NBox group node dialog.</p>
 *
 * @ojsubid oj-nbox-dialog
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the group node dialog:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-dialog'} );
 */

/**
 * <p>Sub-ID for NBox group node dialog close button.</p>
 *
 * @ojsubid oj-nbox-dialog-close-button
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the close button for the group node dialog:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-dialog-close-button'} );
 */

/**
 * <p>Sub-ID for NBox group node with specified groupCategory value. When grouping is enabled within cells rather than
 * across cells, the row and column ids of the cell should be provided.</p>
 *
 * @property {string} row The id of the row of the associated cell, if one exists.
 * @property {string} column The id of the column of the associated cell, if one exists.
 * @property {string} groupCategory The category represented by the returned group node.
 *
 * @ojsubid oj-nbox-group-node
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the group node with groupCategory value of 'group1' when grouping across cells:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-group-node', groupCategory: 'group1'} );
 *
 * @example <caption>Get the group node with groupCategory value of 'group1' in the specified cell:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-group-node', row: 'low', column: 'high', groupCategory: 'group1'} );
 */

/**
 * <p>Sub-ID for NBox node with specified id.</p>
 *
 * @property {string} id The id of the node in the specified cell.
 *
 * @ojsubid oj-nbox-node
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the first node in the specified cell:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-node', 'id': 'employee1'} );
 */

/**
 * <p>Sub-ID for NBox overflow button in specified cell.</p>
 *
 * @property {string} row The id of the row of the containing cell.
 * @property {string} column The id of the column of the containing cell.
 *
 * @ojsubid oj-nbox-overflow
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the overflow button in the specified cell:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-overflow', row: 'low', column: 'high'} );
 */

/**
 * <p>Sub-ID for the the NBox tooltip.</p>
 *
 * @ojsubid oj-nbox-tooltip
 * @memberof oj.ojNBox
 *
 * @example <caption>Get the tooltip object of the NBox, if displayed:</caption>
 * var nodes = myNBox.getNodeBySubId( {'subId': 'oj-nbox-tooltip'} );
 */

// Slots
/**
 * <p> The <code class="prettyprint">nodeTemplate</code> slot is used to specify the template for creating each node of the NBox when a DataProvider
 * has been specified with the data attribute. The slot content must be a single &lt;template> element.
 * <p>When the template is executed for each node, it will have access to the NBox's binding context and the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current node. (See [oj.ojNBox.NodeTemplateContext]{@link oj.ojNBox.NodeTemplateContext} or the table below for a list of properties available on $current) </li>
 * </li>
 * <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.
 * </li>
 * </ul>
 *
 * <p>The content of the template should only be one &lt;oj-n-box-node> element. See the [oj-n-box-node]{@link oj.ojNBoxNode.html} doc for more details.</p>
 *
 *
 * @ojslot nodeTemplate
 * @ojmaxitems 1
 * @ojshortdesc The nodeTemplate slot is used to specify the template for creating each node of the NBox. See the Help documentation for more information.
 * @ojpreferredcontent ["NBoxNodeElement"]
 *
 * @memberof oj.ojNBox
 * @ojtemplateslotprops oj.ojNBox.NodeTemplateContext
 * @example <caption>Initialize the NBox with an inline node template specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate'>
 *    &lt;oj-n-box-node
 *        row='[[$current.data.potential]]'
 *        column='[[$current.data.performance]]'
 *        short-desc='[[$current.data.shortDesc]]'
 *        label='[[$current.data.name]]'
 *        secondary-label='[[$current.data.position]]'
 *        icon.source='[[$current.data.image]]'>
 *    &lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * @typedef {Object} oj.ojNBox.NodeTemplateContext
 * @property {Element} componentElement The &lt;oj-n-box> custom element.
 * @property {Object} data The data object for the current node.
 * @property {number} index The zero-based index of the current node.
 * @property {any} key The key of the current node.
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content.  The slot content must be a single &lt;template> element.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current node. (See [oj.ojNBox.TooltipContext]{@link oj.ojNBox.TooltipContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojmaxitems 1
 * @ojtemplateslotprops oj.ojNBox.TooltipContext
 * @memberof oj.ojNBox
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 *
 * @example <caption>Initialize the NBox with a tooltip template specified:</caption>
 * &lt;oj-n-box>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span>&lt;oj-bind-text value="[[$current.label + ' (' + $current.secondaryLabel + ')']]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
// Node Context Objects ********************************************************

/**
 * <p>Context for NBox cell with specified row and column values.</p>
 *
 * @property {string} row The id of the row.
 * @property {string} column The id of the column.
 *
 * @ojnodecontext oj-nbox-cell
 * @memberof oj.ojNBox
 */

/**
 * <p>Context for NBox group node dialog.</p>
 *
 * @ojnodecontext oj-nbox-dialog
 * @memberof oj.ojNBox
 */

/**
 * <p>Context for NBox group node with specified groupCategory value. When grouping is enabled within cells rather than
 * across cells, the row and column ids of the cell should be provided.</p>
 *
 * @property {string} row The id of the row of the associated cell, if one exists.
 * @property {string} column The id of the column of the associated cell, if one exists.
 * @property {string} groupCategory The category represented by the returned group node.
 *
 * @ojnodecontext oj-nbox-group-node
 * @memberof oj.ojNBox
 */

/**
 * <p>Context for NBox node with specified id.</p>
 *
 * @property {string} id The id of the node.
 *
 * @ojnodecontext oj-nbox-node
 * @memberof oj.ojNBox
 * @ojsignature {target: "Type", value: "K", for: "id"}
 */
//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
/**
 * @ojstylevariableset oj-n-box-css-set1
 * @ojstylevariable oj-n-box-cell-bg-color {description: "Nbox cell background color", formats: ["color"], help: "#css-variables"}
 * @ojstylevariable oj-n-box-cell-bg-color-maximized {description: "Nbox maximized cell background color",formats: ["color"], help: "#css-variables"}
 * @memberof oj.ojNBox
 */

/**
 * @ojcomponent oj.ojNBoxNode
 * @ojshortdesc The oj-n-box-node element is used to declare properties for NBox nodes. See the Help documentation for more information.
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojNBoxNode<K=any> extends dvtBaseComponent<ojNBoxNodeSettableProperties<K>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojNBoxNodeSettableProperties<K=any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 6.0.0
 *
 *
 * @classdesc
 * <h3 id="nBoxNodeOverview-section">
 *   JET Tag Cloud Item
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#nBoxNodeOverview-section"></a>
 * </h3>
 *
 * <p>The oj-n-box-node element is used to declare properties for NBox nodes and is only valid as the
 *  child of a template element for the <a href="oj.ojNBox.html#nodeTemplate">nodeTemplate</a>
 *  slot of oj-n-box.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node row='[[$current.data.potential]]'
 *      column='[[$current.data.performance]]'
 *      short-desc='[[$current.data.shortDesc]]'
 *      label='[[$current.data.name]]'
 *      secondary-label='[[$current.data.position]]'
 *      icon.source='[[$current.data.image]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 * </code>
 * </pre>
 */
/**
 * The color of the node border.
 * @expose
 * @name borderColor
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(string)=}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">borderColor</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node border-color='[[node.data.borderColor]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The width of the node border.
 * @expose
 * @name borderWidth
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {number=}
 * @default 0
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">borderWidth</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node border-width='[[node.data.borderWidth]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * An optional array of additional category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with other visualization elements.
 * If not defined, the node id is used.
 * @expose
 * @name categories
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {Array.<string>=}
 * @default []
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">categories</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node categories='[[node.data.categories]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The background color of this node.
 * @expose
 * @name color
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">color</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node color='[[node.data.color]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The column id for this node.
 * @expose
 * @name column
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">column</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node column='[[node.data.column]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The group category this node belongs to. Nodes with the same groupCategory will be grouped together.
 * @expose
 * @name groupCategory
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">groupCategory</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node group-category='[[node.data.groupCategory]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * Defines the primary icon for this node.
 * @expose
 * @name icon
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {Object=}
 * @default null
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon='[[node.data.icon]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The border color of this icon.
 * @expose
 * @name icon.borderColor
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.borderColor</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.border-color='[[node.data.icon.borderColor]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The border radius of this icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
 * @expose
 * @name icon.borderRadius
 * @ojshortdesc The border radius of this icon. See the Help documentation for more information.
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.borderRadius</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.border-radius='[[node.data.icon.borderRadius]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The border width of this icon.
 * @expose
 * @name icon.borderWidth
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {number=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.borderWidth</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.border-width='[[node.data.icon.borderWidth]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The fill color of this icon.
 * @expose
 * @name icon.color
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.color</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.color='[[node.data.icon.color]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The height of this icon.
 * @expose
 * @name icon.height
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(number|null)=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.height</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.height='[[node.data.icon.height]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The opacity of this icon.
 * @expose
 * @name icon.opacity
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {number=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.opacity</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.opacity='[[node.data.icon.opacity]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The fill pattern of this icon.
 * @expose
 * @name icon.pattern
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "largeChecker"
 * @ojvalue {string} "largeCrosshatch"
 * @ojvalue {string} "largeDiagonalLeft"
 * @ojvalue {string} "largeDiagonalRight"
 * @ojvalue {string} "largeDiamond"
 * @ojvalue {string} "largeTriangle"
 * @ojvalue {string} "none"
 * @ojvalue {string} "mallChecker"
 * @ojvalue {string} "smallCrosshatch"
 * @ojvalue {string} "smallDiagonalLeft"
 * @ojvalue {string} "smallDiagonalRight"
 * @ojvalue {string} "smallDiamond"
 * @ojvalue {string} "smallTriangle"
 * @default "none"
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.pattern</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.pattern='[[node.data.icon.pattern]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The shape of this icon. Can take the name of a built-in shape or the SVG path commands for a custom shape.
 * @expose
 * @name icon.shape
 * @memberof! oj.ojNBoxNode
 * @type {("circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string)=}
 * @instance
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.shape</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.shape='[[node.data.icon.shape]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The URL of an image to display for this icon.
 * @expose
 * @name icon.source
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.source</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.source='[[node.data.icon.source]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The CSS style class defining the style of this icon.  Will not be applied if initials are specified.
 * @expose
 * @name icon.svgClassName
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.svgClassName</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.svg-class-name='[[node.data.icon.svgClassName]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The background pattern displayed with the initials of this icon.
 * @expose
 * @name icon.background
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @ojvalue {string=} "neutral"
 * @ojvalue {string=} "red"
 * @ojvalue {string=} "orange"
 * @ojvalue {string=} "forest"
 * @ojvalue {string=} "green"
 * @ojvalue {string=} "teal"
 * @ojvalue {string=} "blue"
 * @ojvalue {string=} "slate"
 * @ojvalue {string=} "mauve"
 * @ojvalue {string=} "pink"
 * @ojvalue {string=} "purple"
 * @ojvalue {string=} "lilac"
 * @ojvalue {string=} "gray"
 * @ojdeprecated [{target:'propertyValue', for:"red", since: "10.0.0", description: "This value will be removed in the future. Please use other colors."},
 *                {target:'propertyValue', for:"forest", since: "10.0.0", description: "This value will be removed in the future. Please use other colors."},
 *                {target:'propertyValue', for:"mauve", since: "10.0.0", description: "This value will be removed in the future. Please use other colors."}]
 * @default 'neutral'
 */
/**
 * The initials displayed on this icon if no image source provided.
 * @expose
 * @name icon.initials
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @default ''
 */
/**
 * The CSS style object defining the style of this icon.
 * Only SVG CSS style properties are supported.
 * Will not be applied if initials are specified.
 * The default value comes from the CSS and varies based on theme.
 * @expose
 * @name icon.svgStyle
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {Object=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.svgStyle</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.svg-style='[[node.data.icon.svgStyle]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The width of this icon.
 * @expose
 * @name icon.width
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(number|null)=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">icon.width</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node icon.width='[[node.data.icon.width]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The background color for the indicator section of this node.
 * @expose
 * @name indicatorColor
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorColor</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-color='[[node.data.indicatorColor]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * Defines the indicator icon for this node.
 * @expose
 * @name indicatorIcon
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {Object=}
 * @default null
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon='[[node.data.indicatorIcon]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The border color of this indicator icon.
 * @expose
 * @name indicatorIcon.borderColor
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.borderColor</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.border-color='[[node.data.indicatorIcon.borderColor]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The border radius of this indicator icon. CSS border-radius values accepted. Note that non-% values (including unitless) get interpreted as 'px'.
 * @expose
 * @name indicatorIcon.borderRadius
 * @ojshortdesc The border radius of this indicator icon. See the Help documentation for more information.
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.borderRadius</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.border-radius='[[node.data.indicatorIcon.borderRadius]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The border width of this indicator icon.
 * @expose
 * @name indicatorIcon.borderWidth
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {number=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.borderWidth</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.border-width='[[node.data.indicatorIcon.borderWidth]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The fill color of this indicator icon.
 * @expose
 * @name indicatorIcon.color
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.color</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.color='[[node.data.indicatorIcon.color]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The height of this indicator icon.
 * @expose
 * @name indicatorIcon.height
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(number|null)=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.height</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.height='[[node.data.indicatorIcon.height]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The opacity of this indicator icon.
 * @expose
 * @name indicatorIcon.opacity
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {number=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.opacity</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.opacity='[[node.data.indicatorIcon.opacity]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The fill pattern of this indicator icon.
 * @expose
 * @name indicatorIcon.pattern
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "largeChecker"
 * @ojvalue {string} "largeCrosshatch"
 * @ojvalue {string} "largeDiagonalLeft"
 * @ojvalue {string} "largeDiagonalRight"
 * @ojvalue {string} "largeDiamond"
 * @ojvalue {string} "largeTriangle"
 * @ojvalue {string} "none"
 * @ojvalue {string} "smallChecker"
 * @ojvalue {string} "smallCrosshatch"
 * @ojvalue {string} "smallDiagonalLeft"
 * @ojvalue {string} "smallDiagonalRight"
 * @ojvalue {string} "smallDiamond"
 * @ojvalue {string} "smallTriangle"
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.pattern</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.pattern='[[node.data.indicatorIcon.pattern]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The shape of this indicator icon. Can take the name of a built-in shape or the SVG path commands for a custom shape.
 * @expose
 * @name indicatorIcon.shape
 * @memberof! oj.ojNBoxNode
 * @type {("circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string)=}
 * @instance
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.shape</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.shape='[[node.data.indicatorIcon.shape]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The URL of an image to display for this indicator icon.
 * @expose
 * @name indicatorIcon.source
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(string|null)=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.source</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.source='[[node.data.indicatorIcon.source]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The CSS style class defining the style of this indicator icon.
 * @expose
 * @name indicatorIcon.svgClassName
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.svgClassName</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.svg-class-name='[[node.data.indicatorIcon.svgClassName]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The CSS style object defining the style of this indicator icon.
 * Only SVG CSS style properties are supported.
 * The default value comes from the CSS and varies based on theme.
 * @expose
 * @name indicatorIcon.svgStyle
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(Object|null)=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>|null", jsdocOverride: true}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.svgStyle</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.svg-style='[[node.data.indicatorIcon.svgStyle]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The width of this indicator icon.
 * @expose
 * @name indicatorIcon.width
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(number|null)=}
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">indicatorIcon.width</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node indicator-icon.width='[[node.data.indicatorIcon.width]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The text for the node label.
 * @expose
 * @name label
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">label</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node label='[[node.data.label]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The row id for this node.
 * @expose
 * @name row
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">row</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node row='[[node.data.row]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The text for the secondary node label.
 * @expose
 * @name secondaryLabel
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">secondaryLabel</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node secondary-label='[[node.data.secondaryLabel]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The description of the node. Will be lazily created if a function is used. This is used for customizing the tooltip text.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(string|function)=}
 * @default ''
 * @ojsignature [{target: "Type", value: "?(string | ((context: oj.ojNBox.NodeShortDescContext<K>) => string))", jsdocOverride: true}]
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">short-desc</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node short-desc='[[node.data.id + ":"" + node.data.total + "% of respondents"]]' label='[[node.data.id]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The CSS style object defining the style of the node text.
 * Only SVG CSS style properties are supported.
 * @expose
 * @name svgStyle
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(Object|null)=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>|null", jsdocOverride: true}
 * @default null
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">svg-style</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node svg-style='[[node.data.svgStyle]]' label='[[node.data.id]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * The CSS style class defining the style of the node text.
 * @expose
 * @name svgClassName
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'  data-oj-as='node'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node svg-class-name='[[node.data.svgClassName]]' label='[[node.data.id]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * An optional horizontal position (as a percentage) to be used in the average position calculation when grouping across cells.
 * @expose
 * @name xPercentage
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(number|null)=}
 * @default null
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">xPercentage</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node x-percentage='[[node.data.xPercentage]]' label='[[node.data.id]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
/**
 * An optional vertical position (as a percentage) to be used in the average position calculation when grouping across cells.
 * @expose
 * @name yPercentage
 * @memberof! oj.ojNBoxNode
 * @instance
 * @type {(number|null)=}
 * @default null
 *
 * @example <caption>Initialize NBox node with the
 * <code class="prettyprint">xPercentage</code> attribute specified:</caption>
 * &lt;oj-n-box data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate' data-oj-as='node'>
 *    &lt;oj-n-box-node y-percentage='[[node.data.yPercentage]]' label='[[node.data.id]]'>&lt;/oj-n-box-node>
 *  &lt;/template>
 * &lt;/oj-n-box>
 */
//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
/**
 * @ojstylevariableset oj-n-box-node-css-set1
 * @ojstylevariable oj-n-box-node-bg-color {description: "Nbox node background color", formats: ["color"], help: "#css-variables"}
 * @memberof! oj.ojNBoxNode
 */
