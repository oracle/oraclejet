/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import 'ojs/ojcomponentcore';
import $ from 'jquery';
import { PictoChart } from 'ojs/ojpictochart-toolkit';
import 'ojs/ojdvt-base';

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
var __oj_picto_chart_metadata = 
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
        "alphaFade",
        "auto",
        "none",
        "popIn",
        "zoom"
      ],
      "value": "none"
    },
    "as": {
      "type": "string",
      "value": ""
    },
    "columnCount": {
      "type": "number"
    },
    "columnWidth": {
      "type": "number"
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
    "drilling": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "off"
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
    "items": {
      "type": "Array<Object>|Promise"
    },
    "layout": {
      "type": "string",
      "enumValues": [
        "horizontal",
        "vertical"
      ],
      "value": "horizontal"
    },
    "layoutOrigin": {
      "type": "string",
      "enumValues": [
        "bottomEnd",
        "bottomStart",
        "topEnd",
        "topStart"
      ],
      "value": "topStart"
    },
    "rowCount": {
      "type": "number"
    },
    "rowHeight": {
      "type": "number"
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
      "value": "none"
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
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
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
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
    "getContextByNode": {},
    "getItem": {},
    "getItemCount": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojDrill": {}
  },
  "extension": {}
};
  __oj_picto_chart_metadata.extension._WIDGET_NAME = 'ojPictoChart';
  oj.CustomElementBridge.register('oj-picto-chart', { metadata: __oj_picto_chart_metadata });
})();

var __oj_picto_chart_item_metadata = 
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
    "columnSpan": {
      "type": "number",
      "value": 1
    },
    "count": {
      "type": "number",
      "value": 1
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
    "name": {
      "type": "string",
      "value": ""
    },
    "rowSpan": {
      "type": "number",
      "value": 1
    },
    "shape": {
      "type": "string",
      "value": "rectangle"
    },
    "shortDesc": {
      "type": "string|function"
    },
    "source": {
      "type": "string",
      "value": ""
    },
    "sourceHover": {
      "type": "string",
      "value": ""
    },
    "sourceHoverSelected": {
      "type": "string",
      "value": ""
    },
    "sourceSelected": {
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
    }
  },
  "extension": {}
};
/* global __oj_picto_chart_item_metadata:false */
(function () {
  __oj_picto_chart_item_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-picto-chart-item', {
    metadata: __oj_picto_chart_item_metadata
  });
})();

/**
 * @ojcomponent oj.ojPictoChart
 * @augments oj.dvtBaseComponent
 * @since 1.2.0
 * @ojimportmembers oj.ojSharedContextMenu
 * @ojshortdesc A picto chart displays information using icons to visualize an absolute number or the relative sizes of the different parts of a population.
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojPictoChart<K, D extends oj.ojPictoChart.Item<K>|any> extends dvtBaseComponent<ojPictoChartSettableProperties<K, D>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojPictoChartSettableProperties<K, D extends oj.ojPictoChart.Item<K>|any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["columnCount", "rowCount", "layout", "layoutOrigin", "hoverBehavior", "animationOnDataChange", "animationOnDisplay",
 * "style"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["data"]}
 * @ojvbdefaultcolumns 6
 * @ojvbmincolumns 2
 *
 * @ojoracleicon 'oj-ux-ico-chart-pictochart'
 * @ojuxspecs ['data-visualization-picto-chart']
 *
 * @classdesc
 * <h3 id="pictoChartOverview-section">
 *   JET PictoChart
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pictoChartOverview-section"></a>
 * </h3>
 *
 * <p>PictoChart uses icons to visualize an absolute number, or the relative sizes of the different parts of a population.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-picto-chart
 *   data='[[dataProvider]]'>
 * &lt;/oj-picto-chart>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
 *
 * <p>When using colors as a data dimension for PictoChart, the application
 * needs to ensure that they meet minimum contrast requirements. Not all colors
 * in the default value ramp provided by oj.ColorAttributeGroupHandler
 * will meet minimum contrast requirements.</p>
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
 *    be considered if identifying data changes is important, since all data items will generally move and resize on any data
 *    change.
 * </p>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * <h3 id="layout-section">
 *   Layout
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#layout-section"></a>
 * </h3>
 *
 * <h4>Fixed and Flowing Layout</h4>
 * <p>PictoChart supports both fixed and flowing layout. If the element has a fixed width and height
 * (set by the inline style, style class, etc.), then the pictoChart will use a <i>fixed layout</i>, which means that
 * the shapes will be resized to occupy the given space as much as possible. Otherwise, the pictoChart will use a
 * <i>flowing layout</i>, which means that the shapes are rendered at a constant size and the element will take up as
 * much space as necessary. It is possible to fix just one of the two dimensions, and the pictoChart would still
 * use the flowing layout.</p>
 * <p>If fixed layout is used, please avoid using the <code class="prettyprint">rowHeight</code> and <code class="prettyprint">columnWidth</code>
 * attributes as they may cause the shapes to be dropped if the given space is not large enough.</p>
 *
 * <h4>Layout Orientation and Origin</h4>
 * <p>PictoChart currently supports rectangular layouts with two different orientations (<i>horizontal</i> and <i>vertical</i>)
 * and four different origins (<i>topStart</i>, <i>topEnd</i>, <i>bottomStart</i>, and <i>bottomEnd</i>). Please refer to the
 * Pictochart cookbook demo to see how these layout attributes work.</p>
 *
 * <h4>Mixed Sizes</h4>
 * <p>PictoChart supports items that are varying in sizes by specifying the <code class="prettyprint">columnSpan</code> and
 * <code class="prettyprint">rowSpan</code> attributes on the items. To ensure the best layout, it is recommended that the
 * bigger items are ordered first because the layout algorithm is greedy and will position items to the first available space.</p>
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojPictoChart', $.oj.dvtBaseComponent, {
  widgetEventPrefix: 'oj',
  options: {
    /**
     * The duration of the animations in milliseconds. The default value comes from the CSS and varies based on theme.
     * @expose
     * @name animationDuration
     * @ojshortdesc The duration of the animations in milliseconds.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {number=}
     * @ojsignature {target: "Type", value: "?"}
     * @ojunits "milliseconds"
     */
    animationDuration: undefined,

    /**
     * The animation when the data changes.
     * @expose
     * @name animationOnDataChange
     * @ojshortdesc Specifies the animation that is applied on data changes.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     */
    animationOnDataChange: 'none',

    /**
     * The animation that is shown on initial display.
     * @expose
     * @name animationOnDisplay
     * @ojshortdesc Specifies the animation shown on initial display.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {string=}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "popIn"
     * @ojvalue {string} "alphaFade"
     * @ojvalue {string} "zoom"
     * @ojvalue {string} "none"
     * @default "none"
     */
    animationOnDisplay: 'none',

    /**
     * An alias for the $current context variable when referenced inside itemTemplate when using a DataProvider.
     * @expose
     * @name as
     * @ojshortdesc An alias for the '$current' context variable passed to slot content for the itemTemplate slot.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {string=}
     * @default ""
     * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
     */
    as: '',
    /**
     * The number of columns that the picto chart has. The number of columns will be automatically computed if not specified.
     * @expose
     * @name columnCount
     * @ojshortdesc The number of columns in the picto chart. If unspecified, the number of columns will be automatically computed.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {(number|null)=}
     * @default null
     */
    columnCount: null,

    /**
     * The width of a column in pixels. The width of columns will be automatically computed if not specified.  Setting this property in a fixed layout
     * (when the element width and height are defined) may cause items to be truncated.
     * @expose
     * @name columnWidth
     * @ojshortdesc The width of a column in pixels. If unspecified, the column width will be automatically computed. See the Help documentation for more information.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {(number|null)=}
     * @default null
     * @ojunits "pixels"
     */
    columnWidth: null,
    /**
     * The DataProvider for the picto chart. It should provide rows where each row corresponds to a single picto chart item.
     * The DataProvider can either have an arbitrary data shape, in which case an <oj-picto-chart-item> element must be specified
     * in the itemTemplate slot or it can have [oj.ojPictoChart.Item]{@link oj.ojPictoChart.Item} as its data shape, in which case no template is required.
     * @expose
     * @name data
     * @ojshortdesc Specifies the DataProvider for the picto chart. See the Help documentation for more information.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {Object|null}
     * @ojsignature {target: "Type", value: "DataProvider<K, D>|null", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the picto chart with the
     * <code class="prettyprint">data</code> attribute specified:</caption>
     * &lt;oj-picto-chart data='[[dataProvider]]'>&lt;/oj-picto-chart>
     *
     * @example <caption>Get or set the <code class="prettyprint">data</code>
     * property after initialization:</caption>
     * // getter
     * var value = myPictoChart.data;
     *
     * // setter
     * myPictoChart.data = dataProvider;
     */
    data: null,

    /**
     * Whether drilling is enabled. Drillable items will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event
     * on click (double click if selection is enabled). To enable or disable drilling on individual items, use the drilling attribute in each item.
     * @expose
     * @name drilling
     * @ojshortdesc Specifies whether drilling is enabled. Drillable objects will show a pointer cursor on hover and fire an ojDrill event on click (double click if selection is enabled). See the Help documentation for more information.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {string=}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     */
    drilling: 'off',

    /**
     * An array of category strings used for category filtering. Data items with a category in hiddenCategories will be filtered.
     * @expose
     * @name hiddenCategories
     * @ojshortdesc An array of category strings used for filtering. Data items with any category matching an item in this array will be filtered.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {(Array.<string>)=}
     * @default []
     * @ojwriteback
     */
    hiddenCategories: [],

    /**
     * An array of category strings used for category highlighting. Data items with a category in highlightedCategories will be highlighted.
     * @expose
     * @name highlightedCategories
     * @ojshortdesc An array of category strings used for highlighting. Data items matching categories in this array will be highlighted.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {(Array.<string>)=}
     * @default []
     * @ojwriteback
     */
    highlightedCategories: [],

    /**
     * The matching condition for the highlightedCategories property. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the
     * highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     * @expose
     * @name highlightMatch
     * @ojshortdesc The matching condition for the highlightedCategories property. See the Help documentation for more information.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {string=}
     * @ojvalue {string} "any"
     * @ojvalue {string} "all"
     * @default "all"
     */
    highlightMatch: 'all',

    /**
     * The behavior applied when hovering over data items.
     * @expose
     * @name hoverBehavior
     * @ojshortdesc Defines the behavior applied when hovering over data items.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {string=}
     * @ojvalue {string} "dim"
     * @ojvalue {string} "none"
     * @default "none"
     */
    hoverBehavior: 'none',

    /**
     * Specifies initial hover delay in milliseconds for highlighting data items.
     * @expose
     * @name hoverBehaviorDelay
     * @memberof oj.ojPictoChart
     * @instance
     * @type {number=}
     * @ojunits "milliseconds"
     * @default 200
     */
    hoverBehaviorDelay: 200,

    /**
     * An array of objects with the following properties that defines the pictoChart items.
     * @expose
     * @name items
     * @ojshortdesc An array of objects that define the picto chart items. See the Help documentation for more information.
     * @ojtsignore
     * @memberof oj.ojPictoChart
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojPictoChart.Item<K>>|null",
     *                                           SetterType: "Array<oj.ojPictoChart.Item<K>>|Promise<Array<oj.ojPictoChart.Item>>|null"},
     *                                           jsdocOverride: true}
     * @instance
     * @type {Array.<Object>|Promise|null}
     * @default null
     */
    items: null,

    /**
     * The direction in which the items are laid out.
     * @expose
     * @name layout
     * @ojshortdesc Specifies the direction in which items are laid out.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {string=}
     * @ojvalue {string} "vertical"
     * @ojvalue {string} "horizontal"
     * @default "horizontal"
     */
    layout: 'horizontal',

    /**
     * Defines where the first item is rendered. The subsequent items follow the first item according to the layout.
     * @expose
     * @name layoutOrigin
     * @ojshortdesc Specifies where the first item is rendered. Subsequent items follow the first item according to the layout.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {string=}
     * @ojvalue {string} "topEnd"
     * @ojvalue {string} "bottomStart"
     * @ojvalue {string} "bottomEnd"
     * @ojvalue {string} "topStart"
     * @default "topStart"
     */
    layoutOrigin: 'topStart',

    /**
     * The number of rows that the picto chart has. The number of rows will be automatically computed if not specified.
     * @expose
     * @name rowCount
     * @ojshortdesc The number of rows in the picto chart. If unspecified, the number of rows will be automatically computed.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {(number|null)=}
     * @default null
     */
    rowCount: null,

    /**
     * The height of a row in pixels. The height of rows will be automatically computed if not specified. Setting this property in a fixed layout (when the element
     *  width and height are defined) may cause items to be truncated.
     * @expose
     * @name rowHeight
     * @ojshortdesc The height of a row in pixels. If unspecified, the row height will be automatically computed. See the Help documentation for more information.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {(number|null)=}
     * @default null
     * @ojunits "pixels"
     */
    rowHeight: null,

    /**
     * An array of id strings, used to define the selected objects.
     * @expose
     * @name selection
     * @memberof oj.ojPictoChart
     * @instance
     * @type {(Array.<any>)=}
     * @ojsignature [{target: "Type", value: "Array<K>"}]
     * @default []
     * @ojwriteback
     * @ojeventgroup common
     */
    selection: [],

    /**
     * <p>The type of selection behavior that is enabled on the picto chart. This attribute controls the number of selections that can be made via selection gestures
     * at any given time.
     *
     * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the picto
     * chart's selection styling will be applied to all items specified by the <a href="#selection">selection</a> attribute.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the picto chart's selection styling will not be applied to
     * any items specified by the <a href="#selection">selection</a> attribute.
     *
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> attribute.
     *
     * @expose
     * @name selectionMode
     * @ojshortdesc Specifies the selection mode.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {string=}
     * @ojvalue {string} "none" Selection is disabled.
     * @ojvalue {string} "single" Only a single item can be selected at a time.
     * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
     * @default "none"
     */
    selectionMode: 'none',

    /**
     * An object containing an optional callback function for tooltip customization.
     * @expose
     * @name tooltip
     * @ojshortdesc An object containing an optional callback function for tooltip customization.
     * @memberof oj.ojPictoChart
     * @instance
     * @type {Object=}
     */
    tooltip: {
      /**
       * A function that returns a custom tooltip. The function takes a <a href="#TooltipContext">TooltipContext</a> argument,
       * provided by the picto chart. The function should return an Object that contains only one of the two properties:
       * <ul>
       *   <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li>
       *   <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display
       *      tooltip, since this is a default behavior.
       *   </li>
       * </ul>
       *
       * @expose
       * @name tooltip.renderer
       * @ojshortdesc A function that returns a custom tooltip. The function takes a context argument, provided by the picto chart. See the Help documentation for more
       * information.
       * @memberof! oj.ojPictoChart
       * @instance
       * @type {function(Object):Object|null}
       * @ojsignature {target: "Type", value: "((context: oj.ojPictoChart.TooltipContext<K>) => ({insert: Element|string}|{preventDefault: boolean}))|null", jsdocOverride: true}
       * @default null
       */
      renderer: null
    },

    /**
     * Triggered during a drill gesture (double click if selection is enabled, single click otherwise).
     *
     * @property {any} id the id of the drilled object
     *
     * @expose
     * @event
     * @memberof oj.ojPictoChart
     * @instance
     */
    drill: null
  },

  _CreateDvtComponent: function (context, callback, callbackObj) {
    return new PictoChart(context, callback, callbackObj);
  },

  _GetSimpleDataProviderConfigs: function () {
    return {
      data: {
        templateName: 'itemTemplate',
        templateElementName: 'oj-picto-chart-item',
        resultPath: 'items'
      }
    };
  },

  _ConvertLocatorToSubId: function (locator) {
    var subId = locator.subId;

    // Convert the supported locators
    if (subId === 'oj-pictochart-item') {
      // item[index]
      subId = 'item[' + locator.index + ']';
    } else if (subId === 'oj-pictochart-tooltip') {
      subId = 'tooltip';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  _ConvertSubIdToLocator: function (subId) {
    var locator = {};

    if (subId.indexOf('item') === 0) {
      // item[index]
      locator.subId = 'oj-pictochart-item';
      locator.index = this._GetFirstIndex(subId);
    } else if (subId === 'tooltip') {
      locator.subId = 'oj-pictochart-tooltip';
    }

    return locator;
  },

  _GetComponentStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses.push('oj-pictochart');
    return styleClasses;
  },

  _GetChildStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses['oj-pictochart-item'] = { path: '_defaultColor', property: 'background-color' };
    styleClasses['oj-dvtbase oj-pictochart'] = { path: 'animationDuration', property: 'ANIM_DUR' };
    styleClasses['oj-dvt-selectable-inner-shape'] = { path: '_innerColor', property: 'stroke' };
    styleClasses['oj-dvt-selectable oj-selected'] = { path: '_outerColor', property: 'stroke' };
    return styleClasses;
  },

  _GetEventTypes: function () {
    return ['optionChange'];
  },

  _HandleEvent: function (event) {
    var type = event.type;
    if (type === 'drill') {
      this._trigger('drill', null, { id: event.id });
    } else {
      this._super(event);
    }
  },

  /**
     * Returns an object with the following properties for automation testing verification of the item at the
     * specified index.

     * @param {number} index The index.
     * @return {Object|null} An object containing data for the item at the given index, or null if none exists.
     * @ojsignature {target: "Type", value: "oj.ojPictoChart.ItemContext<K>|null", jsdocOverride: true, for: "returns"}
     * @expose
     * @memberof oj.ojPictoChart
     * @instance
     * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
     * @ojtsignore
     * @ojshortdesc Returns information for automation testing verification of a specified item.
     */
  getItem: function (index) {
    var auto = this._component.getAutomation();
    return auto.getItem(index);
  },

  /**
   * Returns the number of items in the pictoChart data.
   * @return {number} The number of data items
   * @expose
   * @memberof oj.ojPictoChart
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   */
  getItemCount: function () {
    return this._component.getAutomation().getItemCount();
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   * @ojsignature {target: "Type", value: "oj.ojPictoChart.NodeContext|null", jsdocOverride: true, for: "returns"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojPictoChart
   * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
   */
  getContextByNode: function (node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context && context.subId !== 'oj-pictochart-tooltip') {
      return context;
    }

    return null;
  },

  _GetComponentDeferredDataPaths: function () {
    return { root: ['items', 'data'] };
  },

  _IsFlowingLayoutSupported: function () {
    return true;
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
 *       <td rowspan="5">Data Item</td>
 *       <td rowspan="2"><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled and <code class="prettyprint">selectionMode</code> is <code class="prettyprint">none</code>.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled and <code class="prettyprint">selectionMode</code> is enabled.</td>
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
 * @memberof oj.ojPictoChart
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
 *       <td>Move focus and selection to previous item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus and selection to next item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection to previous item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection to next item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>Move focus and multi-select previous item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>Move focus and multi-select next item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and multi-select previous item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and multi-select next item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>Move focus to previous item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>Move focus to next item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus to previous item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus to next item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select item with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Drill on item when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojPictoChart
 */

// PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojPictoChart.Item
 * @property {any=} id The item id. The item id should be set by the application if the DataProvider is not being used.
 * @property {string=} name The name of the item. Used for default tooltip and accessibility.
 * @property {"ellipse"|"square"|"circle"|"diamond"|"triangleUp"|"triangleDown"|"star"|"plus"|"human"|"none"|"rectangle"|string}[shape="rectangle"] The shape of the item.
 * Can take the name of a built-in shape or the SVG path commands for a custom shape. "None" will make the item transparent and can be used to create gaps.
 * Does not apply if custom image is specified.
 * @property {string=} color The color of the item. Does not apply if custom image is specified.
 * @property {string=} borderColor The border color of the item. Does not apply if custom image is specified.
 * @property {number=} borderWidth The border width of the item in pixels. Does not apply if custom image is specified.
 * @property {string=} source The URI of the custom image. If specified, it takes precedence over shape.
 * @property {string=} svgClassName The CSS style class to apply to the item. The style class and inline style will override any other styling specified with other properties.
 * For tooltip interactivity, it's recommended to also pass a representative color to the item color attribute. Does not apply if custom image is specified.
 * @property {Object=} svgStyle The inline style to apply to the item. The style class and inline style will override any other styling specified with other
 * properties. For tooltip interactivity, it's recommended to also pass a representative color to the item color attribute. Does not apply if custom image is specified.
 * Only SVG CSS style properties are supported.
 * @property {string=} sourceHover The optional URI for the hover state. If not specified, the source image will be used.
 * @property {string=} sourceSelected The optional URI for the selected state. If not specified, the source image will be used.
 * @property {string=} sourceHoverSelected The optional URI for the hover selected state. If not specified, the source image will be used.
 * @property {number=} count Specifies the number of times that the shape (or custom image) is drawn. Fractional counts (such as 4.5) are supported;
 * however, fractions other than the multiples of 0.5 should be avoided because the fractional rendering ignores the gaps between shapes and the irregularity of the shapes.
 * @property {number=} rowSpan The number of rows each shape (or custom image) spans. Used for creating a pictoChart with mixed item sizes.
 * @property {number=} columnSpan The number of columns each shape (or custom image) spans. Used for creating a pictoChart with mixed item sizes.
 * @property {(string|function)=} shortDesc Short description string for accessibility users.
 * @property {Array.<string>=} categories An array of category strings corresponding to this item. If not specified, defaults to the item id or name. This enables highlighting and filtering of individual data items through interactions with other visualization elements.
 * @property {"inherit"|"off"|"on"} [drilling="inherit"] Whether drilling is enabled for the item. Drillable items will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all items at once, use the drilling attribute in the top level.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"},
 *               {target: "Type", value: "?(string | ((context: oj.ojPictoChart.ItemShortDescContext<K>) => string))", jsdocOverride: true, for: "shortDesc"},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride:true}]
 */

/**
 * @typedef {Object} oj.ojPictoChart.TooltipContext
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 * @property {any} id The id of the hovered item.
 * @property {string} name The name of the hovered item.
 * @property {number} count The count of the hovered item.
 * @property {string} color The color of the hovered item.
 * @property {Element} componentElement The picto chart HTML element.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojPictoChart.ItemShortDescContext
 * @property {any} id The id of the hovered item.
 * @property {string} name The name of the hovered item.
 * @property {number} count The count of the hovered item.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojPictoChart.ItemTemplateContext
 * @property {Element} componentElement The &lt;oj-picto-chart> custom element.
 * @property {Object} data The data object for the current item.
 * @property {number} index The zero-based index of the current item.
 * @property {any} key The key of the current item.
 */

// METHOD TYPEDEFS

/**
 * @typedef {Object} oj.ojPictoChart.ItemContext
 * @property {string} color
 * @property {number} count
 * @property {any} id
 * @property {string} name
 * @property {boolean} selected
 * @property {string} tooltip
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojPictoChart.NodeContext
 * @property {string} subId The subId string identify the particular DOM node.
 * @property {number} index The zero based index of the picto chart item.
 */

// KEEP FOR WIDGET SYNTAX

// Slots
/**
 *
 * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for creating each item of the picto chart when a DataProvider has been
 * specified with the data attribute. The slot content must be a single &lt;template> element.</p>
 * <p>When the template is executed for each item, it will have access to the picto chart's binding context and the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current item.
 *      (See [oj.ojPictoChart.ItemTemplateContext]{@link oj.ojPictoChart.ItemTemplateContext} or the table below for a list of properties available on $current)
 *   </li>
 * </li>
 * <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.
 * </li>
 * </ul>
 *
 * <p>The content of the template should only be one &lt;oj-picto-chart-item> element. See the [oj-picto-chart-item]{@link oj.ojPictoChartItem} doc for more details.</p>
 *
 *
 * @ojslot itemTemplate
 * @ojshortdesc The itemTemplate slot is used to specify the template for creating each item of the picto chart. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojPictoChart
 * @ojtemplateslotprops oj.ojPictoChart.ItemTemplateContext
 * @ojpreferredcontent ["PictoChartItemElement"]
 *
 * @example <caption>Initialize the PictoChart with an inline item template specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate'>
 *    &lt;oj-picto-chart-item
 *      count='[[$current.item.count]]'
 *      name='[[$current.item.name]]'>
 *    &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content. The slot content must be a single &lt;template> element.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current item.
 *      (See [oj.ojPictoChart.TooltipContext]{@link oj.ojPictoChart.TooltipContext} or the table below for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 * @ojmaxitems 1
 * @ojtemplateslotprops oj.ojPictoChart.TooltipContext
 * @memberof oj.ojPictoChart
 *
 * @example <caption>Initialize the PictoChart with a tooltip template specified:</caption>
 * &lt;oj-picto-chart>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span>&lt;oj-bind-text value="[[$current.name + ': ' + $current.count]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
// SubId Locators **************************************************************

/**
 * <p>Sub-ID for tag cloud items at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojsubid oj-pictochart-item
 * @memberof oj.ojPictoChart
 *
 * @example <caption>Gets the first tag cloud item:</caption>
 * var nodes = myPictoChart.getNodeBySubId({'subId': 'oj-pictochart-item', 'index': 0});
 */

/**
 * <p>Sub-ID for the the tag cloud tooltip.</p>
 *
 * @ojsubid oj-pictochart-tooltip
 * @memberof oj.ojPictoChart
 *
 * @example <caption>Get the tooltip object of the tag cloud, if displayed:</caption>
 * var nodes = myPictoChart.getNodeBySubId({'subId': 'oj-pictochart-tooltip'});
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for tag cloud items at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojnodecontext oj-pictochart-item
 * @memberof oj.ojPictoChart
 */

/**
 * @ojcomponent oj.ojPictoChartItem
 * @ojshortdesc The oj-picto-chart-item element is used to declare properties for picto chart items. See the Help documentation for more information.
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojPictoChartItem<K=any> extends dvtBaseComponent<ojPictoChartItemSettableProperties<K>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojPictoChartItemSettableProperties<K=any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 5.2.0
 *
 *
 * @classdesc
 * <h3 id="pictoChartItemOverview-section">
 *   JET PictoChart Item
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pictoChartItemOverview-section"></a>
 * </h3>
 *
 * <p>The oj-picto-chart-item element is used to declare properties for picto chart items and is only valid as the
 *  child of a template element for the [itemTemplate]{@link oj.ojPictoChart#itemTemplate}
 *  slot of oj-picto-chart.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item count='[[item.data.count]]' name='[[item.data.name]]'>
 *    &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 * </code>
 * </pre>
 */

/**
 * The border color of the item. Does not apply if custom image is specified.
 * @expose
 * @name borderColor
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {string=}
 * @ojformat color
 * @default ''
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">border-color</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item border-color='[[item.data.borderColor]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The border width of the item in pixels. Does not apply if custom image is specified.
 * @expose
 * @name borderWidth
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {number=}
 * @default 0
 * @ojunits pixels
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">border-width</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item border-width='[[item.data.borderWidth]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * An array of category strings corresponding to this picto chart item. This allows highlighting and filtering of items.
 * @expose
 * @name categories
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {(Array.<string>)=}
 * @default []
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">categories</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item categories='[[item.data.categories]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The color of the item. Does not apply if custom image is specified.
 * @expose
 * @name color
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {string=}
 * @ojformat color
 * @default ''
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">color</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item color='[[item.data.color]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The number of columns each shape (or custom image) spans. Used for creating a picto chart with mixed item sizes.
 * @expose
 * @name columnSpan
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {number=}
 * @default 1
 * @ojmin 0
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">column-span</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item column-span='[[item.data.columnSpan]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * Specifies the number of times that the shape (or custom image) is drawn. Fractional counts (such as 4.5) are supported; however, fractions other than the multiples of 0.5
 * should be avoided because the fractional rendering ignores the gaps between shapes and the irregularity of the shapes.
 * @expose
 * @name count
 * @ojshortdesc Specifies the number of times that the shape (or custom image) is drawn. See the Help documentation for more information.
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {number=}
 * @default 1
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">count</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item count='[[item.data.count]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * Whether drilling is enabled on the item. Drillable items will show a pointer cursor on hover and fire an ojDrill event on click (double click if selection is enabled).
 * To enable drilling for all items at once, use the drilling attribute in the top level.
 * @expose
 * @name drilling
 * @ojshortdesc Whether drilling is enabled on the item. Drillable items will show a pointer cursor on hover and fire an ojDrill event on click (double click if selection
 * is enabled). See the Help documentation for more information.
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @ojvalue {string} "inherit"
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @type {string=}
 * @default "inherit"
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">drilling</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item drilling='[[item.data.drilling]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The name of the item. Used for default tooltip and accessibility.
 * @expose
 * @name name
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {string=}
 * @ojtranslatable
 * @default ''
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">name</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item name='[[item.data.name]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The number of rows each shape (or custom image) spans. Used for creating a picto chart with mixed item sizes.
 * @expose
 * @name rowSpan
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {number=}
 * @default 1
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">row-span</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item row-span='[[item.data.rowSpan]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The shape of the item. Can take the name of a built-in shape or the SVG path commands for a custom shape. "None" will make the item transparent and can be used
 * to create gaps. Does not apply if custom image is specified.
 * @expose
 * @name shape
 * @ojshortdesc The shape of the item. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. See the Help documentation
 * for more information.
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {("circle"|"diamond"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|"none"|string)=}
 * @default "rectangle"
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">shape</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item shape='[[item.data.shape]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The description of the item. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {(string|function)=}
 * @ojsignature [{target: "Type", value: "?(string | ((context: oj.ojPictoChart.ItemShortDescContext<K>) => string))", jsdocOverride: true}]
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">short-desc</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item short-desc='[[item.data.shortDesc]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The URI of the custom image. If specified, it takes precedence over shape.
 * @expose
 * @name source
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">source</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item source='[[item.data.source]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The optional URI for the hover state. If not specified, the source image will be used.
 * @expose
 * @name sourceHover
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">source-hover</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item source-hover='[[item.data.sourceHover]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The optional URI for the hover selected state. If not specified, the source image will be used.
 * @expose
 * @name sourceHoverSelected
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">source-hover-selected</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item source-hover-selected='[[item.data.sourceHoverSelected]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The optional URI for the selected state. If not specified, the source image will be used.
 * @expose
 * @name sourceSelected
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">source-selected</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item source-selected='[[item.data.sourceSelected]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The inline style to apply to the item. The style class and inline style will override any other styling specified with other properties. For tooltip interactivity,
 * it's recommended to also pass a representative color to the item color attribute. Does not apply if custom image is specified.
 * Only SVG CSS style properties are supported.
 * @expose
 * @name svgStyle
 * @ojshortdesc The inline style to apply to the item. See the Help documentation for more information.
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {Object=}
 * @ojsignature [{target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}]
 * @default {}
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">svg-style</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item svg-style='[[item.data.svgStyle]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
/**
 * The CSS style class to apply to the item. The style class and inline style will override any other styling specified with other properties. For tooltip interactivity,
 * it's recommended to also pass a representative color to the item color attribute. Does not apply if custom image is specified.
 * @expose
 * @name svgClassName
 * @ojshortdesc The CSS style class to apply to the item. See the Help documentation for more information.
 * @memberof! oj.ojPictoChartItem
 * @instance
 * @type {string=}
 * @default ''
 *
 * @example <caption>Initialize the picto chart item with the
 * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
 * &lt;oj-picto-chart data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate' data-oj-as='item'>
 *    &lt;oj-picto-chart-item svg-class-name='[[item.data.svgClassName]]'> &lt;/oj-picto-chart-item>
 *  &lt;/template>
 * &lt;/oj-picto-chart>
 */
//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
/**
 * @ojstylevariableset oj-picto-chart-item-css-set1
 * @ojstylevariable oj-picto-chart-item-bg-color {description: "Pictochart item background color", formats: ["color"], help: "#css-variables"}
 * @memberof! oj.ojPictoChartItem
 */
