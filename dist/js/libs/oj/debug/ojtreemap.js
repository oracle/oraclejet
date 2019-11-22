/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtTreeView', 'ojs/ojkeyset'], function(oj, $, comp, base, dvt, KeySet)
{
  "use strict";
var __oj_treemap_metadata = 
{
  "properties": {
    "animationDuration": {
      "type": "number"
    },
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
    "animationUpdateColor": {
      "type": "string",
      "value": ""
    },
    "as": {
      "type": "string",
      "value": ""
    },
    "colorLabel": {
      "type": "string",
      "value": ""
    },
    "data": {
      "type": "object"
    },
    "displayLevels": {
      "type": "number",
      "value": 1.7976931348623157e+308
    },
    "drilling": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "off"
    },
    "groupGaps": {
      "type": "string",
      "enumValues": [
        "all",
        "none",
        "outer"
      ],
      "value": "outer"
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
    "hoverBehaviorDelay": {
      "type": "number",
      "value": 200
    },
    "isolatedNode": {
      "type": "any",
      "writeback": true,
      "value": ""
    },
    "layout": {
      "type": "string",
      "enumValues": [
        "sliceAndDiceHorizontal",
        "sliceAndDiceVertical",
        "squarified"
      ],
      "value": "squarified"
    },
    "nodeContent": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
    },
    "nodeDefaults": {
      "type": "object",
      "properties": {
        "groupLabelDisplay": {
          "type": "string",
          "enumValues": [
            "header",
            "node",
            "off"
          ],
          "value": "header"
        },
        "header": {
          "type": "object",
          "properties": {
            "backgroundColor": {
              "type": "string"
            },
            "borderColor": {
              "type": "string"
            },
            "hoverBackgroundColor": {
              "type": "string"
            },
            "hoverInnerColor": {
              "type": "string"
            },
            "hoverOuterColor": {
              "type": "string"
            },
            "isolate": {
              "type": "string",
              "enumValues": [
                "off",
                "on"
              ],
              "value": "on"
            },
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
            "selectedBackgroundColor": {
              "type": "string"
            },
            "selectedInnerColor": {
              "type": "string"
            },
            "selectedOuterColor": {
              "type": "string"
            },
            "useNodeColor": {
              "type": "string",
              "enumValues": [
                "off",
                "on"
              ],
              "value": "off"
            }
          }
        },
        "hoverColor": {
          "type": "string"
        },
        "labelDisplay": {
          "type": "string",
          "enumValues": [
            "node",
            "off"
          ],
          "value": "node"
        },
        "labelHalign": {
          "type": "string",
          "enumValues": [
            "center",
            "end",
            "start"
          ],
          "value": "center"
        },
        "labelMinLength": {
          "type": "number",
          "value": 1
        },
        "labelStyle": {
          "type": "object"
        },
        "labelValign": {
          "type": "string",
          "enumValues": [
            "bottom",
            "center",
            "top"
          ],
          "value": "center"
        },
        "selectedInnerColor": {
          "type": "string"
        },
        "selectedOuterColor": {
          "type": "string"
        }
      }
    },
    "nodeSeparators": {
      "type": "string",
      "enumValues": [
        "bevels",
        "gaps"
      ],
      "value": "gaps"
    },
    "nodes": {
      "type": "Array<Object>|Promise"
    },
    "rootNode": {
      "type": "any",
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
    "sizeLabel": {
      "type": "string",
      "value": ""
    },
    "sorting": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "off"
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
        "componentName": {
          "type": "string"
        },
        "labelAndValue": {
          "type": "string"
        },
        "labelClearSelection": {
          "type": "string"
        },
        "labelColor": {
          "type": "string"
        },
        "labelCountWithTotal": {
          "type": "string"
        },
        "labelDataVisualization": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
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
        },
        "tooltipIsolate": {
          "type": "string"
        },
        "tooltipRestore": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getNode": {},
    "getContextByNode": {},
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojBeforeDrill": {},
    "ojDrill": {}
  },
  "extension": {}
};
var __oj_treemap_node_metadata = 
{
  "properties": {
    "categories": {
      "type": "Array<string>",
      "value": []
    },
    "color": {
      "type": "string",
      "value": "#000000"
    },
    "drilling": {
      "type": "string",
      "enumValues": [
        "inherit",
        "off",
        "on"
      ],
      "value": "inherit"
    },
    "groupLabelDisplay": {
      "type": "string",
      "enumValues": [
        "header",
        "node",
        "off"
      ]
    },
    "header": {
      "type": "object",
      "properties": {
        "isolate": {
          "type": "string",
          "enumValues": [
            "off",
            "on"
          ]
        },
        "labelHalign": {
          "type": "string",
          "enumValues": [
            "center",
            "end",
            "start"
          ]
        },
        "labelStyle": {
          "type": "object"
        },
        "useNodeColor": {
          "type": "string",
          "enumValues": [
            "off",
            "on"
          ]
        }
      }
    },
    "label": {
      "type": "string",
      "value": ""
    },
    "labelDisplay": {
      "type": "string",
      "enumValues": [
        "node",
        "off"
      ]
    },
    "labelHalign": {
      "type": "string",
      "enumValues": [
        "center",
        "end",
        "start"
      ]
    },
    "labelStyle": {
      "type": "object",
      "value": {}
    },
    "labelValign": {
      "type": "string",
      "enumValues": [
        "bottom",
        "center",
        "top"
      ]
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
    "selectable": {
      "type": "string",
      "enumValues": [
        "auto",
        "off"
      ],
      "value": "auto"
    },
    "shortDesc": {
      "type": "string",
      "value": ""
    },
    "svgClassName": {
      "type": "string",
      "value": ""
    },
    "svgStyle": {
      "type": "object",
      "value": {}
    },
    "value": {
      "type": "number"
    }
  },
  "extension": {}
};


/* global dvt:false, KeySet:false */
/**
 * @ojcomponent oj.ojTreemap
 * @augments oj.dvtBaseComponent
 * @since 0.7.0
 *
 * @ojshortdesc A tree map is an interactive data visualization in which hierarchical data is represented across two dimensions by the size and color of nested rectangular nodes.
 * @ojrole application
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojTreemap<K, D extends oj.ojTreemap.Node<K>|any> extends dvtBaseComponent<ojTreemapSettableProperties<K, D>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojTreemapSettableProperties<K, D extends oj.ojTreemap.Node<K>|any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["colorLabel", "sizeLabel", "nodeSeparators", "groupGaps", "nodeDefaults.groupLabelDisplay", "nodeDefaults.labelDisplay", "nodeDefaults.labelHalign", "nodeDefaults.labelValign", "layout", "sorting", "animationOnDataChange", "animationOnDisplay", "style"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["data", "selection"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 6
 *
 * @classdesc
 * <h3 id="treemapOverview-section">
 *   JET Treemap
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#treemapOverview-section"></a>
 * </h3>
 *
 * <p>Treemaps are used to display hierarchical data across two dimensions, represented by
 * the size and color of the treemap nodes. Treemaps are generally preferred over sunbursts when emphasizing the data
 * for the leaf nodes.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-treemap
 *    nodes='[{"value": 100, "color": "#FFFF00", "label": "Total Sales",
 *             "nodes": [{"value": 75, "color": "#00FF00", "label": "Candy"},
 *                       {"value": 20, "color": "#FFFF00", "label": "Fruit"},
 *                       {"value": 15, "color": "#FF0000", "label": "Vegetables"}]}]'>
 * &lt;/oj-treemap>
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
 *   Gesture End User Information
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
 * <p>As a rule of thumb, it's recommended that applications only set usable data densities on this element.
 *    Applications can enable progressive reveal of data through drilling or aggregate small nodes to reduce the
 *    displayed data set size.
 * </p>
 *
 * <h4>Styling</h4>
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">nodeDefaults</code>, instead of styling properties
 *    on the individual nodes. The treemap can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojTreemap', $.oj.dvtBaseComponent,
  {
    widgetEventPrefix: 'oj',
    options: {
      /**
       * Specifies the animation duration in milliseconds. For data change animations with multiple stages,
       * this attribute defines the duration of each stage. For example, if an animation contains two stages,
       * the total duration will be two times this attribute's value. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name animationDuration
       * @ojshortdesc Specifies the animation duration in milliseconds. For data change animations with multiple stages, the value specifies the duration of each stage.
       * @memberof oj.ojTreemap
       * @instance
       * @type {number}
       * @ojunits milliseconds
       */
      animationDuration: undefined,

      /**
       * Specifies the animation that is applied on data changes.
       * @expose
       * @name animationOnDataChange
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "auto"
       * @ojvalue {string} "none"
       * @default "none"
       */
      animationOnDataChange: 'none',

      /**
       * Specifies the animation that is shown on initial display.
       * @expose
       * @name animationOnDisplay
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "auto"
       * @ojvalue {string} "none"
       * @default "none"
       */
      animationOnDisplay: 'none',

      /**
       * The color that is displayed during a data change animation when a node is updated.
       * @expose
       * @name animationUpdateColor
       * @ojshortdesc Specifies the color displayed during a data change animation when a node is updated.
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojformat color
       * @default ""
       */
      animationUpdateColor: '',

      /**
       * An alias for the $current context variable passed to slot content for the nodeTemplate slot.
       * @expose
       * @name as
       * @ojshortdesc An alias for the '$current' context variable passed to slot content for the nodeTemplate slot.
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @default ""
       * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
       */
      as: '',

      /**
       * The oj.DataProvider for the nodes of the treemap. It should provide a data tree where each node in the data tree corresponds to a node in the treemap.
       * The row key will be used as the id for treemap nodes. Note that when
       * using this attribute, a template for the <a href="#nodeTemplate">nodeTemplate</a> slot should be provided.
       * The oj.DataProvider can either have an arbitrary data shape, in which case an <oj-treemap-node> element must be specified in the nodeTemplate slot or it can have [oj.oj.ojTreemap.Node]{@link oj.ojTreemap#Node} as its data shape, in which case no template is required.
       * @expose
       * @name data
       * @ojshortdesc Specifies the DataProvider for the treemap. See the Help documentation for more information.
       * @memberof oj.ojTreemap
       * @instance
       * @type {Object|null}
       * @ojsignature {target: "Type", value: "oj.DataProvider<K, D>|null"}
       * @default null
       *
       * @example <caption>Initialize the treemap with the
       * <code class="prettyprint">data</code> attribute specified:</caption>
       * &lt;oj-treemap data='[[dataProvider]]'>&lt;/oj-treemap>
       *
       * @example <caption>Get or set the <code class="prettyprint">data</code>
       * property after initialization:</caption>
       * // getter
       * var value = myTreemap.data;
       *
       * // setter
       * myTreemap.data = dataProvider;
       */
      data: null,

      /**
       * An array of category strings used for filtering. Nodes with any category matching an item in this array will be filtered.
       * @expose
       * @name hiddenCategories
       * @memberof oj.ojTreemap
       * @instance
       * @type {Array.<string>}
       * @default []
       * @ojwriteback
       */
      hiddenCategories: [],

      /**
       * An array of category strings used for highlighting. Nodes matching categories in this array will be highlighted.
       * @expose
       * @name highlightedCategories
       * @memberof oj.ojTreemap
       * @instance
       * @type {Array.<string>}
       * @default []
       * @ojwriteback
       */
      highlightedCategories: [],

      /**
       * The matching condition for the highlightedCategories property. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
       * @expose
       * @name highlightMatch
       * @ojshortdesc The matching condition for the highlightedCategories property. See the Help documentation for more information.
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "any"
       * @ojvalue {string} "all"
       * @default "all"
       */
      highlightMatch: 'all',

      /**
       * Defines the behavior applied when hovering over the nodes.
       * @expose
       * @name hoverBehavior
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "dim"
       * @ojvalue {string} "none"
       * @default "none"
       */
      hoverBehavior: 'none',

      /**
       * Specifies initial hover delay in milliseconds for highlighting nodes.
       * @expose
       * @name hoverBehaviorDelay
       * @memberof oj.ojTreemap
       * @instance
       * @type {number}
       * @default 200
       * @ojunits milliseconds
       */
      hoverBehaviorDelay: 200,

      /**
       * An object defining custom node content for the treemap. Only leaf nodes with no child nodes will have the custom content rendered.
       * @expose
       * @name nodeContent
       * @memberof oj.ojTreemap
       * @instance
       * @type {Object}
       */
      nodeContent: {
        /**
         * A function that returns custom node content. The function takes a <a href="#NodeContentContext">NodeContentContext</a> argument,
         * provided by the treemap. The function should return an Object with the following property:
         * <ul>
         *   <li>insert: HTMLElement - An HTML element, which will be overlaid on top of the treemap.
         *   This HTML element will block interactivity of the treemap by default, but the CSS pointer-events
         *   property can be set to 'none' on this element if the treemap's interactivity is desired.
         *   </li>
         * </ul>
         *
         * @expose
         * @name nodeContent.renderer
         * @ojshortdesc A function that returns custom node content. The function takes a context argument, provided by the treemap. See the Help documentation for more information.
         * @memberof! oj.ojTreemap
         * @instance
         * @type {function(Object):Object|null}
         * @default null
         * @ojsignature {target: "Type", value: "((context: oj.ojTreemap.NodeContentContext<K, D>) => ({insert: Element|string}))", jsdocOverride: true}
         */
        renderer: null
      },

      /**
       * An object containing an optional callback function for tooltip customization.
       * @expose
       * @name tooltip
       * @memberof oj.ojTreemap
       * @instance
       * @type {Object}
       */
      tooltip: {
        /**
         * A function that returns a custom tooltip. The function takes a <a href="#TooltipContext">TooltipContext</a> argument,
         * provided by the treemap. The function should return an Object that contains only one of the two properties:
         * <ul>
         *   <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li>
         *   <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li>
         * </ul>
         *
         * @expose
         * @name tooltip.renderer
         * @ojshortdesc A function that returns a custom tooltip. The function takes a context argument, provided by the treemap. See the Help documentation for more information.
         * @memberof! oj.ojTreemap
         * @instance
         * @type {function(Object):Object|null}
         * @default null
         * @ojsignature {target: "Type", value: "((context: oj.ojTreemap.TooltipContext<K, D>) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
         */
        renderer: null
      },

      /**
       * Specifies whether gaps are displayed between groups. Gaps can be useful for drawing attention to the differences between groups.
       * @expose
       * @name groupGaps
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "all"
       * @ojvalue {string} "none"
       * @ojvalue {string} "outer"
       * @default "outer"
       */
      groupGaps: 'outer',

      /**
       * The number of levels of nodes to display. By default all nodes are displayed.
       * @expose
       * @name displayLevels
       * @memberof oj.ojTreemap
       * @instance
       * @type {number}
       * @default Number.MAX_VALUE
       */
      displayLevels: Number.MAX_VALUE,

      /**
       * Specifies the layout of the treemap. The squarified layout results in nodes that are as square as possible, for easier comparison of node sizes. The sliceAndDice layouts are useful for animation, as the ordering of the data is maintained. SliceAndDice layouts are also useful for small form factor treemaps.
       * @expose
       * @name layout
       * @ojshortdesc Specifies the layout of the treemap. See the Help documentation for more information.
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "sliceAndDiceHorizontal"
       * @ojvalue {string} "sliceAndDiceVertical"
       * @ojvalue {string} "squarified"
       * @default "squarified"
       */
      layout: 'squarified',

      /**
       * An array of objects with the following properties that defines the data for the nodes. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
       * @expose
       * @ojtsignore
       * @name nodes
       * @ojshortdesc An array of objects defining the data for the nodes. Also accepts a Promise for deferred data rendering.
       * @memberof oj.ojTreemap
       * @instance
       * @type {Array.<Object>|Promise|null}
       * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojTreemap.Node<K>>>|null",
       *                                           SetterType: "Array<oj.ojTreemap.Node<K>>|Promise<Array<oj.ojTreemap.Node<K>>>|null"},
       *                                           jsdocOverride: true}
       * @default null
       */
      nodes: null,

      /**
       * An object defining default properties for the nodes. Component CSS classes should be used to set component wide styling.
       * This API should be used only for styling a specific instance of the component. Properties specified on this object may
       * be overridden by specifications on the treemap nodes. Some property default values come from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults
       * @ojshortdesc An object defining default properties for the nodes. See the Help documentation for more information.
       * @memberof oj.ojTreemap
       * @instance
       * @type {Object}
       */
      nodeDefaults: {
        /**
         * The CSS style object defining the style of the label. The CSS white-space property can be defined with value "nowrap" to disable default text wrapping.
         * The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.labelStyle
         * @ojshortdesc The CSS style object defining the style of the label. See the Help documentation for more information.
         * @memberof! oj.ojTreemap
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
         */
        labelStyle: undefined,

        /**
         * The label display behavior for leaf nodes.
         * @expose
         * @name nodeDefaults.labelDisplay
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojvalue {string} "off"
         * @ojvalue {string} "node"
         * @default "node"
         */
        labelDisplay: 'node',

        /**
         * The label display behavior for group nodes.
         * @expose
         * @name nodeDefaults.groupLabelDisplay
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojvalue {string} "node"
         * @ojvalue {string} "off"
         * @ojvalue {string} "header"
         * @default "header"
         */
        groupLabelDisplay: 'header',

        /**
         * The horizontal alignment for labels displayed within the node.
         * @expose
         * @name nodeDefaults.labelHalign
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojvalue {string} "start"
         * @ojvalue {string} "end"
         * @ojvalue {string} "center"
         * @default "center"
         */
        labelHalign: 'center',

        /**
         * The minimum number of visible characters needed in order to render a truncated label. If the minimum is not met when calculating the truncated label then the label is not displayed.
         * @expose
         * @name nodeDefaults.labelMinLength
         * @ojshortdesc The minimum number of visible characters needed to render a truncated label. See the Help documentation for more information.
         * @memberof! oj.ojTreemap
         * @instance
         * @type {number}
         * @default 1
         * @ojunits pixels
         */
        labelMinLength: 1,

        /**
         * The vertical alignment for labels displayed within the node.
         * @expose
         * @name nodeDefaults.labelValign
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojvalue {string} "top"
         * @ojvalue {string} "bottom"
         * @ojvalue {string} "center"
         * @default "center"
         */
        labelValign: 'center',

        /**
         * The color of the node hover feedback. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.hoverColor
         * @ojshortdesc The color of the node hover feedback.
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojformat color
         */
        hoverColor: undefined,

        /**
         * The inner color of the node selection feedback. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.selectedInnerColor
         * @ojshortdesc The inner color of the node selection feedback.
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojformat color
         */
        selectedInnerColor: undefined,

        /**
         * The outer color of the node selection feedback. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.selectedOuterColor
         * @ojshortdesc The outer color of the node selection feedback.
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojformat color
         */
        selectedOuterColor: undefined,

        /**
         * An object defining default properties for the node header. Component CSS classes should be used to set component wide styling.
         * This API should be used only for styling a specific instance of the component. Some property default values come from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header
         * @ojshortdesc An object defining default properties for the node header. See the Help documentation for more information.
         * @memberof! oj.ojTreemap
         * @instance
         * @type {Object}
         */
        header: {
          /**
           * The background color of the node headers. The default value comes from the CSS and varies based on theme.
           * @expose
           * @name nodeDefaults.header.backgroundColor
           * @ojshortdesc The background color of the node headers.
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojformat color
           */
          backgroundColor: undefined,

          /**
           * The border color of the node headers. The default value comes from the CSS and varies based on theme.
           * @expose
           * @name nodeDefaults.header.borderColor
           * @ojshortdesc The border color of the node headers.
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojformat color
           */
          borderColor: undefined,

          /**
           * The background color of the node hover feedback. The default value comes from the CSS and varies based on theme.
           * @expose
           * @name nodeDefaults.header.hoverBackgroundColor
           * @ojshortdesc The background color of the node hover feedback.
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojformat color
           */
          hoverBackgroundColor: undefined,

          /**
           * The inner color of the node hover feedback. The default value comes from the CSS and varies based on theme.
           * @expose
           * @name nodeDefaults.header.hoverInnerColor
           * @ojshortdesc The inner color of the node hover feedback.
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojformat color
           */
          hoverInnerColor: undefined,
          /**
           * The outer color of the node hover feedback. The default value comes from the CSS and varies based on theme.
           * @expose
           * @name nodeDefaults.header.hoverOuterColor
           * @ojshortdesc The outer color of the node hover feedback.
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojformat color
           */
          hoverOuterColor: undefined,

          /**
           * The background color of the node selection feedback. The default value comes from the CSS and varies based on theme.
           * @expose
           * @name nodeDefaults.header.selectedBackgroundColor
           * @ojshortdesc The background color of the node selection feedback.
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojformat color
           */
          selectedBackgroundColor: undefined,

          /**
           * The inner color of the node selection feedback. The default value comes from the CSS and varies based on theme.
           * @expose
           * @name nodeDefaults.header.selectedInnerColor
           * @ojshortdesc The inner color of the node selection feedback.
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojformat color
           */
          selectedInnerColor: undefined,

          /**
           * The outer color of the node selection feedback. The default value comes from the CSS and varies based on theme.
           * @expose
           * @name nodeDefaults.header.selectedOuterColor
           * @ojshortdesc The outer color of the node selection feedback.
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojformat color
           */
          selectedOuterColor: undefined,

          /**
           * The horizontal alignment of the header title.
           * @expose
           * @name nodeDefaults.header.labelHalign
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojvalue {string} "center"
           * @ojvalue {string} "end"
           * @ojvalue {string} "start"
           * @default "start"
           */
          labelHalign: 'start',

          /**
           * The CSS style string defining the style of the header title. The default value comes from the CSS and varies based on theme.
           * @expose
           * @name nodeDefaults.header.labelStyle
           * @ojshortdesc The CSS style string defining the style of the header title.
           * @memberof! oj.ojTreemap
           * @instance
           * @type {Object}
           * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
           */
          labelStyle: undefined,

          /**
           * Specifies whether isolate behavior is enabled on the node.
           * @expose
           * @name nodeDefaults.header.isolate
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojvalue {string} "off"
           * @ojvalue {string} "on"
           * @default "on"
           */
          isolate: 'on',

          /**
           * Specifies whether the node color should be displayed in the header.
           * @expose
           * @name nodeDefaults.header.useNodeColor
           * @memberof! oj.ojTreemap
           * @instance
           * @type {string}
           * @ojvalue {string} "on"
           * @ojvalue {string} "off"
           * @default "off"
           */
          useNodeColor: 'off'
        }
      },

      /**
       * Specifies the visual effect for separating the nodes from each other. This allows for adjacent nodes of the same color to be distinguished.
       * @expose
       * @name nodeSeparators
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "bevels"
       * @ojvalue {string} "gaps"
       * @default "gaps"
       */
      nodeSeparators: 'gaps',

      /**
       * <p>The type of selection behavior that is enabled on the treemap. This attribute controls the number of selections that can be made via selection gestures at any given time.
       *
       * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the treemap's selection styling will be applied to all items specified by the <a href="#selection">selection</a> attribute.
       * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the treemap's selection styling will not be applied to any items specified by the <a href="#selection">selection</a> attribute.
       *
       * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> attribute.
       *
       * @expose
       * @name selectionMode
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "none" Selection is disabled.
       * @ojvalue {string} "single" Only a single item can be selected at a time.
       * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
       * @default "multiple"
       */
      selectionMode: 'multiple',

      /**
       * Specifies whether the nodes are sorted by size. When sorting is enabled, nodes that have the same parent are sorted in order of descending size.
       * @expose
       * @name sorting
       * @ojshortdesc Specifies whether the nodes are sorted by size. Nodes with the same parent are sorted in order of descending size.
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "on"
       * @ojvalue {string} "off"
       * @default "off"
       */
      sorting: 'off',

      /**
       * Specifies the label describing the color metric of the treemap. This label will be used in the legend.
       * @expose
       * @name colorLabel
       * @ojshortdesc Specifies the label displayed in the legend describing the color metric of the treemap.
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @default ""
       */
      colorLabel: '',

      /**
       * Specifies the label describing the size metric of the treemap. This label will be used in the legend.
       * @expose
       * @name sizeLabel
       * @ojshortdesc Specifies the label used in the legend describing the size metric of the treemap.
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @default ""
       */
      sizeLabel: '',

      /**
       * Specifies whether drilling is enabled. Drillable nodes will show a pointer cursor on hover and fire an
       * <code class="prettyprint">ojBeforeDrill</code> and <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). Drilling on a node causes a property change to the rootNode attribute. The displayLevels attribute can be used in conjunction with drilling to display very deep hieracrchies. Use "on" to enable drilling for all nodes. To enable or disable drilling on individual nodes use the drilling attribute in each node.
       * @expose
       * @name drilling
       * @ojshortdesc Specifies whether drilling is enabled. Drillable nodes will show a pointer cursor on hover and fire ojBeforeDrill and ojDrill events on click (double click if selection is enabled). See the Help documentation for more information.
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "on"
       * @ojvalue {string} "off"
       * @default "off"
       */
      drilling: 'off',

      /**
       * The id of the root node. When specified, only the root node and children of the root will be displayed.
       * @expose
       * @name rootNode
       * @memberof oj.ojTreemap
       * @instance
       * @type {any}
       * @default ""
       */
      rootNode: '',

      /**
       * An array containing the ids of the initially selected nodes.
       * @expose
       * @name selection
       * @memberof oj.ojTreemap
       * @instance
       * @type {Array.<any>}
       * @default []
       * @ojwriteback
       * @ojeventgroup common
       */
      selection: [],

      /**
       * The id of the initially isolated node.
       * @expose
       * @name isolatedNode
       * @memberof oj.ojTreemap
       * @instance
       * @type {any}
       * @default ""
       * @ojwriteback
       */
      isolatedNode: '',

      /**
       * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive.
       * For a better user experience, the application can remove the touch and hold delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning.
       * If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if panning is not available for those elements that support the feature.
       * @expose
       * @name touchResponse
       * @ojshortdesc Specifies configuration options for touch and hold delays on mobile devices. See the Help documentation for more information.
       * @memberof oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "touchStart"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      touchResponse: 'auto',

      /**
       * Triggered immediately before any node in the treemap is drilled into. The drill event can be vetoed if the beforeDrill callback returns false.
       *
       * @property {any} id the id of the drilled object
       * @property {Object} data the data object of the drilled node.
       * @property {Object} itemData The row data object for the drilled node. This will only be set if a DataProvider is being used.
       * @ojsignature [{target: "Type", value: "K", for: "id"},
       *               {target: "Type", value: "ojTreemap.Node<K>", for: "data"},
       *               {target: "Type", value: "D", for: "itemData"},
       *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
       * @expose
       * @event
       * @ojshortdesc Triggered immediately before any node in the treemap is drilled into.
       * @memberof oj.ojTreemap
       * @instance
       */
      beforeDrill: null,
      /**
       * Triggered during a drill gesture (double click if selection is enabled, single click otherwise).
       *
       * @property {any} id the id of the drilled object
       * @property {Object} data the data object of the drilled node.
       * @property {Object} itemData The row data object for the drilled node. This will only be set if a DataProvider is being used.
       *
       * @expose
       * @event
       * @memberof oj.ojTreemap
       * @ojsignature [{target: "Type", value: "K", for: "id"},
       *               {target: "Type", value: "ojTreemap.Node<K>", for: "data"},
       *               {target: "Type", value: "D", for: "itemData"},
       *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
       * @instance
       */
      drill: null,
    },

    //* * @inheritdoc */
    _CreateDvtComponent: function (context, callback, callbackObj) {
      return dvt.Treemap.newInstance(context, callback, callbackObj);
    },

    //* * @inheritdoc */
    _GetSimpleDataProviderConfigs: function () {
      return {
        data: {
          templateName: 'nodeTemplate',
          templateElementName: 'oj-treemap-node',
          resultPath: 'nodes',
          // TODO:  - allow lazy loading of data from tree data provider
          // if these become dynamic see example in ojsunburst
          expandedKeySet: new oj.AllKeySetImpl()
        }
      };
    },

    //* * @inheritdoc */
    _OptionChangeHandler: function (options) {
      // If there is a change in the expanded property, the data provider state needs to be cleared
      if (Object.prototype.hasOwnProperty.call(options, 'displayLevels')) {
        this._ClearDataProviderState('data');
      }
      this._super(options);
    },

    //* * @inheritdoc */
    _ConvertLocatorToSubId: function (locator) {
      var subId = locator.subId;

      // Convert the supported locators
      if (subId === 'oj-treemap-node') {
        // node[index0][index1]...[indexN]
        subId = 'node' + this._GetStringFromIndexPath(locator.indexPath);
      } else if (subId === 'oj-treemap-tooltip') {
        subId = 'tooltip';
      }

      // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
      // support for the old subId syntax in 1.2.0.
      return subId;
    },

    //* * @inheritdoc */
    _ConvertSubIdToLocator: function (subId) {
      var locator = {};
      if (subId.indexOf('node') === 0) {
        // node[index0][index1]...[indexN]
        locator.subId = 'oj-treemap-node';
        locator.indexPath = this._GetIndexPath(subId);
      } else if (subId === 'tooltip') {
        locator.subId = 'oj-treemap-tooltip';
      }
      return locator;
    },

    //* * @inheritdoc */
    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-treemap');
      return styleClasses;
    },

    //* * @inheritdoc */
    _GetChildStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses['oj-dvtbase oj-treemap'] =
        { path: 'animationDuration', property: 'ANIM_DUR' };
      styleClasses['oj-treemap-attribute-type-text'] =
        { path: 'styleDefaults/_attributeTypeTextStyle', property: 'TEXT' };
      styleClasses['oj-treemap-attribute-value-text'] =
        { path: 'styleDefaults/_attributeValueTextStyle', property: 'TEXT' };
      styleClasses['oj-treemap-drill-text '] =
        { path: 'styleDefaults/_drillTextStyle', property: 'TEXT' };
      styleClasses['oj-treemap-current-drill-text '] =
        { path: 'styleDefaults/_currentTextStyle', property: 'TEXT' };
      styleClasses['oj-treemap-node'] =
        { path: 'nodeDefaults/labelStyle', property: 'TEXT' };
      styleClasses['oj-treemap-node oj-hover'] =
        { path: 'nodeDefaults/hoverColor', property: 'border-top-color' };
      styleClasses['oj-treemap-node oj-selected'] = [
        { path: 'nodeDefaults/selectedOuterColor', property: 'border-top-color' },
        { path: 'nodeDefaults/selectedInnerColor', property: 'border-bottom-color' }
      ];
      styleClasses['oj-treemap-node-header'] = [
        { path: 'nodeDefaults/header/backgroundColor', property: 'background-color' },
        { path: 'nodeDefaults/header/borderColor', property: 'border-top-color' },
        { path: 'nodeDefaults/header/labelStyle', property: 'TEXT' }
      ];
      styleClasses['oj-treemap-node-header oj-hover'] = [
        { path: 'nodeDefaults/header/hoverBackgroundColor', property: 'background-color' },
        { path: 'nodeDefaults/header/hoverOuterColor', property: 'border-top-color' },
        { path: 'nodeDefaults/header/hoverInnerColor', property: 'border-bottom-color' },
        { path: 'nodeDefaults/header/_hoverLabelStyle', property: 'TEXT' }
      ];
      styleClasses['oj-treemap-node-header oj-selected'] = [
        { path: 'nodeDefaults/header/selectedBackgroundColor', property: 'background-color' },
        { path: 'nodeDefaults/header/selectedOuterColor', property: 'border-top-color' },
        { path: 'nodeDefaults/header/selectedInnerColor', property: 'border-bottom-color' },
        { path: 'nodeDefaults/header/_selectedLabelStyle', property: 'TEXT' }
      ];
      return styleClasses;
    },

    //* * @inheritdoc */
    _GetEventTypes: function () {
      return ['optionChange', 'drill', 'beforeDrill'];
    },

    //* * @inheritdoc */
    _HandleEvent: function (event) {
      var type = event.type;
      if (type === 'isolate') {
        // Keep track of all isolated nodes
        var isolatedNodes = this.options._isolatedNodes;
        if (!isolatedNodes) {
          this.options._isolatedNodes = [];
          isolatedNodes = this.options._isolatedNodes;
        }

        // If event has id, it's an isolate.  If null id, then restore.
        var isolatedNode = event.id;
        if (isolatedNode) {
          isolatedNodes.push(isolatedNode);
          this._UserOptionChange('isolatedNode', isolatedNode);
        } else {
          isolatedNode = isolatedNodes.pop();
          this._UserOptionChange('isolatedNode',
                                 ((isolatedNodes.length > 0)
                                  ? isolatedNodes[isolatedNodes.length]
                                  : null));
        }
      } else if (type === 'drill') {
        var data = event.data;
        var itemData;
        if (data && data._noTemplate) {
          itemData = data._itemData;
          data = data._itemData;
        } else if (data && data._itemData) {
          itemData = data._itemData;
          data = $.extend({}, event.data);
          delete data._itemData;
        }
        var eventData = { id: event.id, data: data, itemData: itemData };
        if (!this._IsCustomElement()) {
          eventData.component = event.component;
        }

        if (event.id && this._trigger('beforeDrill', null, eventData)) {
          this._UserOptionChange('rootNode', event.id);
          this._Render();
          this._trigger('drill', null, eventData);
        }
      } else {
        this._super(event);
      }
    },

    //* * @inheritdoc */
    _GetComponentRendererOptions: function () {
      return [{ path: 'tooltip/renderer', slot: 'tooltipTemplate' },
              { path: 'nodeContent/renderer', slot: 'nodeContentTemplate' }];
    },

    //* * @inheritdoc */
    _ProcessOptions: function () {
      this._super();
      var nodeContent = this.options.nodeContent;
      if (nodeContent && nodeContent._renderer) {
        nodeContent.renderer = this._GetTemplateRenderer(nodeContent._renderer, 'nodeContent');
      }
    },

    //* * @inheritdoc */
    _LoadResources: function () {
      // Ensure the resources object exists
      if (this.options._resources == null) {
        this.options._resources = {};
      }

      var resources = this.options._resources;

      // Add isolate and restore icons
      resources.isolate = 'oj-treemap-isolate-icon';
      resources.isolateOver = 'oj-treemap-isolate-icon oj-hover';
      resources.isolateDown = 'oj-treemap-isolate-icon oj-active';

      resources.restore = 'oj-treemap-restore-icon';
      resources.restoreOver = 'oj-treemap-restore-icon oj-hover';
      resources.restoreDown = 'oj-treemap-restore-icon oj-active';
    },

    /**
     * Returns an object with the following properties for automation testing verification of the node with
     * the specified subid path.
     *
     * @param {Array} subIdPath The array of indices in the subId for the desired node
     * @ojsignature {target: "Type", value: "oj.ojTreemap.DataContext|null", jsdocOverride: true, for: "returns"}
     * @return {Object|null} An object containing properties for the node, or null if none exists.
     * @expose
     * @instance
     * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
     * @ojtsignore
     * @memberof oj.ojTreemap
     * @ojshortdesc Returns information for automation testing verification of a specified node.
     */
    getNode: function (subIdPath) {
      return this._component.getAutomation().getNode(subIdPath);
    },

    /**
     * {@ojinclude "name":"nodeContextDoc"}
     * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
     * @ojsignature {target: "Type", value: "oj.ojTreemap.NodeContext|null", jsdocOverride: true, for: "returns"}
     * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
     *
     * @example {@ojinclude "name":"nodeContextExample"}
     *
     * @expose
     * @instance
     * @memberof oj.ojTreemap
     * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
     */
    getContextByNode: function (node) {
      // context objects are documented with @ojnodecontext
      var context = this.getSubIdByNode(node);
      if (context && context.subId !== 'oj-treemap-tooltip') {
        return context;
      }

      return null;
    },

    //* * @inheritdoc */
    _GetComponentDeferredDataPaths: function () {
      return { root: ['nodes', 'data'] };
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
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojTreemap
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
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move focus and selection up to the nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus and selection down to the nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection to the left to nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection to the right to nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>]</kbd> or <kbd>Alt + UpArrow</kbd></td>
 *       <td>Move focus and selection from tile or header to group header in level above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>[</kbd> or <kbd>Alt + DownArrow</kbd></td>
 *       <td>Move focus and selection from tile or header to group header in level below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>Move focus and extend selection up to the nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>Move focus and extend selection down to the nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and extend selection to the left to nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and extend selection to the right to nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + ]</kbd> or <kbd>Shift + Alt + UpArrow</kbd></td>
 *       <td>Move focus and extend selection from tile or header to group header in level above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + [</kbd> or <kbd>Shift + Alt + DownArrow</kbd></td>
 *       <td>Move focus and extend selection from tile or header to group header in level below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>Move focus up to the nearest tile or header in same level, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>Move focus down to the nearest tile or header in same level, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus to the left to nearest tile or header in same level, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus to the right to nearest tile or header in same level, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + ]</kbd> or <kbd>Ctrl + Alt + UpArrow</kbd></td>
 *       <td>Move focus from tile or header to group header in level above, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + [</kbd> or <kbd>Ctrl + Alt + DownArrow</kbd></td>
 *       <td>Move focus from tile or header to group header in level below, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select tiles or headers with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Enter</kbd></td>
 *       <td>Maximize/Restore on a group header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Drill on a node when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTreemap
 */

 // PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojTreemap.Node
 * @property {Array.<string>=} categories An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend and other visualization elements. The categories array of each node is required to be a superset of the categories array of its parent node. If not specified, the ids of the node and its ancestors will be used.
 * @property {string=} color The fill color of the node.
 * @property {"inherit"|"off"|"on"} [drilling="inherit"] Specifies whether drilling is enabled for the node. Drillable nodes will show a pointer cursor on hover and fire an ojDrill event on click (double click if selection is enabled). To enable drilling for all nodes at once, use the drilling attribute in the top level.
 * @property {string=} groupLabelDisplay The label display behavior for group nodes.
 * @property {Object=} header An object defining the properties for the node header.
 * @property {"off"|"on"} [header.isolate="on"] Specifies whether isolate behavior is enabled on the node.
 * @property {"center"|"end"|"start"} [header.labelHalign="start"] The horizontal alignment of the header title.
 * @property {Object=} header.labelStyle The CSS style object defining the style of the header title.
 * @property {"off"|"on"} [header.useNodeColor="off"] Specifies whether the node color should be displayed in the header.
 * @property {any=} id The id of the node. For the DataProvider case, the key for the node will be used as the id.
 * @property {string=} label The label for this node.
 * @property {"node"|"off"} [labelDisplay="node"] The label display behavior for leaf nodes.
 * @property {"center"|"end"|"start"} [labelHalign="center"] The horizontal alignment for labels displayed within the node.
 * @property {Object=} labelStyle The CSS style object defining the style of the label.
 * @property {"bottom"|"center"|"top"} [labelValign="center"] The vertical alignment for labels displayed within the node.
 * @property {Array.<Object>=} nodes An array of objects with properties for the child nodes.
 * @property {"largeChecker"|"largeCrosshatch"|"largeDiagonalLeft"|"largeDiagonalRight"|"largeDiamond"|"largeTriangle"|"none"|"smallChecker"|"smallCrosshatch"|"smallDiagonalLeft"|"smallDiagonalRight"|"smallDiamond"|"smallTriangle"} [pattern="none"] The pattern used to fill the node.
 * @property {"auto"|"off"} [selectable="auto"] Specifies whether or not the node will be selectable.
 * @property {string=} shortDesc The description of this node. This is used for accessibility and also for customizing the tooltip text.
 * @property {string=} svgClassName The CSS style class to apply to the node. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @property {Object=} svgStyle The inline style to apply to the node. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @property {number=} value The value of the node, which determines the relative size of the node.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "Array.<oj.ojTreemap.Node<K>>=", for: "nodes"},
 *               {target: "Type", value: "CSSStyleDeclaration", for: "svgStyle", jsdocOverride: true},
 *               {target: "Type", value: "CSSStyleDeclaration", for: "header.labelStyle", jsdocOverride: true},
 *               {target: "Type", value: "CSSStyleDeclaration", for: "labelStyle", jsdocOverride: true},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"}] */

 /**
 * @typedef {Object} oj.ojTreemap.NodeContentContext
 * @property {object} bounds Object containing information on the node area. The x and y coordinates are relative to the top, left corner of the element.
 * @property {number} bounds.x The x coordinate relative to the top, left corner of the element.
 * @property {number} bounds.y The y coordinate relative to the top, left corner of the element.
 * @property {number} bounds.width The width of the node area.
 * @property {number} bounds.height The height of the node area.
 * @property {any} id The id of the node.
 * @property {Object} data The data object of the node.
 * @property {Object} itemData The row data object for the node. This will only be set if a DataProvider is being used.
 * @property {Element} componentElement The treemap element.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "ojTreemap.Node<K>", for: "data"},
 *               {target: "Type", value: "D", for: "itemData"},
 *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
 */

 /**
 * @typedef {Object} oj.ojTreemap.TooltipContext
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 * @property {any} id The id of the hovered node.
 * @property {string} label The label of the hovered node.
 * @property {number} value The value of the hovered node.
 * @property {string} color The color of the hovered node.
 * @property {Object} data The data object of the hovered node.
 * @property {Object} itemData The row data object for the hovered node. This will only be set if a DataProvider is being used.
 * @property {Element} componentElement The treemap element.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "ojTreemap.Node<K>", for: "data"},
 *               {target: "Type", value: "D", for: "itemData"},
 *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
 */

 // METHOD TYPEDEFS
 /**
 * @typedef {Object} oj.ojTreemap.NodeContext
 * @property {string} subId The subId string to identify the particular DOM node.
 * @property {Array.<number>} indexPath The array of numerical indices for the node.
 */

 /**
 * @typedef {Object} oj.ojTreemap.DataContext
 * @property {string} color The fill color of the node.
 * @property {string} label The label for this node.
 * @property {boolean} selected True is the node is selected, false otherwise
 * @property {number} size The relative size of the node.
 * @property {string} tooltip The tooltip string.
 */

 // Slots

/**
 * <p>
 *  The <code class="prettyprint">nodeTemplate</code> slot is used to specify the template for
 *  creating nodes of the treemap. The slot content must be wrapped in a &lt;template>
 *  element. The content of the template should be a single &lt;oj-treemap-node> element.
 *  See the [oj-treemap-node]{@link oj.ojTreemapNode} doc for more details.
 * </p>
 * <p>
 *  When the template is executed for each node, it will have access to the components's
 *  binding context containing the following properties:
 * </p>
 * <ul>
 *   <li>
 *      $current - an object that contains information for the current node.
 *      (See [oj.ojTreemap.NodeTemplateContext]{@link oj.ojTreemap.NodeTemplateContext} or the table below for a list of properties available on $current)
 *   </li>
 *   <li>
 *      alias - if 'as' attribute was specified, the value will be used to provide an
 *      application-named alias for $current.
 *   </li>
 * </ul>
 *
 * @ojslot nodeTemplate
 * @ojshortdesc The nodeTemplate slot is used to specify the template for creating nodes of the treemap. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojTreemap
 * @ojslotitemprops oj.ojTreemap.NodeTemplateContext
 *
 * @example <caption>Initialize the treemap with an inline node template specified:</caption>
 * &lt;oj-treemap data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate'>
 *    &lt;oj-treemap-node value='[[$current.data.value]]' color='[[$current.data.color]]'>
 *    &lt;/oj-treemap-node>
 *  &lt;/template>
 * &lt;/oj-treemap>
 */
/**
 * @typedef {Object} oj.ojTreemap.NodeTemplateContext
 * @property {Element} componentElement The &lt;oj-treemap> custom element
 * @property {Object} data The data object of the node
 * @property {number} index The zero-based index of the current node
 * @property {any} key The key of the current node
 * @property {Array} parentData  An array of data objects of the outermost to innermost parents of the node
 * @property {any} parentKey  The key of the parent node
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current node. (See [oj.ojTreemap.TooltipContext]{@link oj.ojTreemap.TooltipContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 * @ojslotitemprops oj.ojTreemap.TooltipContext
 * @memberof oj.ojTreemap
 *
 * @example <caption>Initialize the Treemap with a tooltip template specified:</caption>
 * &lt;oj-treemap>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span>&lt;oj-bind-text value="[[$current.label + ': ' + $current.value]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-treemap>
 */

/**
 * <p>The <code class="prettyprint">nodeContentTemplate</code> slot is used to specify custom node content
 * for leaf nodes of a treemap.  This slot takes precedence over the nodeContent.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current node. (See [oj.ojTreemap.NodeContentContext]{@link oj.ojTreemap.NodeContentContext} or the table below for a list of properties available on $current) </li>
 * </ul>
 *
 *
 * @ojslot nodeContentTemplate
 * @ojshortdesc The nodeContentTemplate slot is used to specify custom node content for leaf nodes of a treemap. See the Help documentation for more information.
 * @ojslotitemprops oj.ojTreemap.NodeContentContext
 * @memberof oj.ojTreemap
 *
 * @example <caption>Initialize the Treemap with a node content template specified:</caption>
 * &lt;oj-treemap>
 *  &lt;template slot="nodeContentTemplate">
 *    &lt;div :style="[[{position: 'absolute',
 *                       top: $current.bounds.y + 'px',
 *                       left: $current.bounds.x + 'px',
 *                       height: $current.bounds.height + 'px',
 *                       width: $current.bounds.width + 'px'}]]">
 *      &lt;span>&lt;oj-bind-text value="[[$current.data.label + ': ' + $current.data.value]]">&lt;/oj-bind-text>&lt;/span>
 *    &lt;/div>
 *  &lt;/template>
 * &lt;/oj-treemap>
 */
// SubId Locators **************************************************************

/**
 * <p>Sub-ID for treemap nodes indexed by their position in the hierarchy.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the node.
 *
 * @ojsubid oj-treemap-node
 * @memberof oj.ojTreemap
 *
 * @example <caption>Get the node at index 0 in the first layer, index 1 in the second:</caption>
 * var nodes = myTreemap.getNodeBySubId( {'subId': 'oj-treemap-node', 'indexPath': [0, 1]} );
 */

/**
 * <p>Sub-ID for the the treemap tooltip.</p>
 *
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 *
 * @ojsubid
 * @member
 * @name oj-treemap-tooltip
 * @memberof oj.ojTreemap
 * @instance
 *
 * @example <caption>Get the tooltip object of the treemap, if displayed:</caption>
 * var nodes =  myTreemap.getNodeBySubId( {'subId': 'oj-treemap-tooltip'} );
 */
// Node Context Objects ********************************************************

/**
 * <p>Context for treemap nodes indexed by their position in the hierarchy.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the node.
 *
 * @ojnodecontext oj-treemap-node
 * @memberof oj.ojTreemap
 */


/**
 * @ojcomponent oj.ojTreemapNode
 * @ojsignature {target: "Type", value:"class ojTreemapNode extends JetElement<ojTreemapNodeSettableProperties>"}
 * @ojslotcomponent
 * @since 6.0.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Treemap Node
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-treemap-node element is used to declare properties for treemap nodes and is only valid as the
 *  child of a template element for the [nodeTemplate]{@link oj.ojTreemapNode#nodeTemplate}
 *  slot of oj-treemap.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-treemap data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate'>
 *    &lt;oj-treemap-node  value='[[$current.data.value]]' color='[[$current.data.color]]'>
 *    &lt;/oj-treemap-node>
 *  &lt;/template>
 * &lt;/oj-treemap>
 * </code>
 * </pre>
 */

/**
 * An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend and other visualization elements. The categories array of each node is required to be a superset of the categories array of its parent node. If not specified, the ids of the node and its ancestors will be used.
 * @expose
 * @name categories
 * @ojshortdesc An optional array of category strings corresponding to this data item. See the Help documentation for more information.
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {Array.<string>=}
 * @default []
 */
/**
 * The value of the node, which determines the relative size of the node.
 * @expose
 * @name value
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {number}
 */
/**
 * The fill color of the node.
 * @expose
 * @name color
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojformat color
 * @default "#000000"
 */
/**
 * The CSS style class to apply to the node. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @expose
 * @name svgClassName
 * @ojshortdesc The CSS style class to apply to the node. See the Help documentation for more information.
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @default ""
 */
/**
 * The inline style to apply to the node. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @expose
 * @name svgStyle
 * @ojshortdesc The inline style to apply to the node. See the Help documentation for more information.
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {Object=}
 * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
 * @default {}
 */
/**
 * The label for this node.
 * @expose
 * @name label
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @default ""
 */
/**
 * Specifies whether drilling is enabled for the node. Drillable nodes will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all nodes at once, use the drilling attribute in the top level.
 * @expose
 * @name drilling
 * @ojshortdesc Specifies whether drilling is enabled for the node. See the Help documentation for more information.
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * The description of this node. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @default ""
 */
/**
 * The pattern used to fill the node.
 * @expose
 * @name pattern
 * @memberof! oj.ojTreemapNode
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
/**
 * The CSS style object defining the style of the label. The CSS white-space property can be defined with value "nowrap" to disable default text wrapping.
 * @expose
 * @name labelStyle
 * @ojshortdesc The CSS style object defining the style of the label. See the Help documentation for more information.
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {Object=}
 * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
 * @default {}
 */
/**
 * The label display behavior for leaf nodes.
 * @expose
 * @name labelDisplay
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "off"
 * @ojvalue {string} "node"
 */
/**
 * The label display behavior for group nodes.
 * @expose
 * @name groupLabelDisplay
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "node"
 * @ojvalue {string} "off"
 * @ojvalue {string} "header"
 */
/**
 * The horizontal alignment for labels displayed within the node.
 * @expose
 * @name labelHalign
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "start"
 * @ojvalue {string} "end"
 * @ojvalue {string} "center"
 */
/**
 * The vertical alignment for labels displayed within the node.
 * @expose
 * @name labelValign
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "top"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "center"
 */
/**
 * Specifies whether or not the node will be selectable.
 * @expose
 * @name selectable
 * @ojshortdesc Specifies whether the node will be selectable.
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * An object defining the properties for the node header.
 * @expose
 * @name header
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {Object=}
 */
/**
 * The horizontal alignment of the header title.
 * @expose
 * @name header.labelHalign
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 */
/**
 * The CSS style object defining the style of the header title.
 * @expose
 * @name header.labelStyle
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {Object=}
 * @ojsignature {target: "Type", value: "CSSStyleDeclaration", jsdocOverride: true}
 */
/**
 * Specifies whether isolate behavior is enabled on the node.
 * @expose
 * @name header.isolate
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 */
/**
 * Specifies whether the node color should be displayed in the header.
 * @expose
 * @name header.useNodeColor
 * @memberof! oj.ojTreemapNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 */


/* global __oj_treemap_metadata:false */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  __oj_treemap_metadata.extension._WIDGET_NAME = 'ojTreemap';
  oj.CustomElementBridge.register('oj-treemap', { metadata: __oj_treemap_metadata });
}());

/* global __oj_treemap_node_metadata:false */
(function () {
  __oj_treemap_node_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-treemap-node', {
    metadata: __oj_treemap_node_metadata
  });
}());

});