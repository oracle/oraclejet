/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { setDefaultOptions, createDynamicPropertyGetter } from 'ojs/ojcomponentcore';
import DvtAttributeUtils from 'ojs/ojdvt-base';
import $ from 'jquery';
import { Legend } from 'ojs/ojlegend-toolkit';
import { AllKeySetImpl } from 'ojs/ojkeyset';

var __oj_legend_metadata = 
{
  "properties": {
    "as": {
      "type": "string",
      "value": ""
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
    "expanded": {
      "type": "KeySet",
      "writeback": true
    },
    "halign": {
      "type": "string",
      "enumValues": [
        "center",
        "end",
        "start"
      ],
      "value": "start"
    },
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true,
      "value": []
    },
    "hideAndShowBehavior": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "off"
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
    "orientation": {
      "type": "string",
      "enumValues": [
        "horizontal",
        "vertical"
      ],
      "value": "vertical"
    },
    "scrolling": {
      "type": "string",
      "enumValues": [
        "asNeeded",
        "off"
      ],
      "value": "asNeeded"
    },
    "sections": {
      "type": "Array<Object>"
    },
    "symbolHeight": {
      "type": "number",
      "value": 0
    },
    "symbolWidth": {
      "type": "number",
      "value": 0
    },
    "textStyle": {
      "type": "object",
      "value": {}
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
        },
        "tooltipCollapse": {
          "type": "string"
        },
        "tooltipExpand": {
          "type": "string"
        }
      }
    },
    "valign": {
      "type": "string",
      "enumValues": [
        "bottom",
        "middle",
        "top"
      ],
      "value": "top"
    }
  },
  "methods": {
    "getContextByNode": {},
    "getItem": {},
    "getPreferredSize": {},
    "getProperty": {},
    "getSection": {},
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
/* global __oj_legend_metadata:false */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  __oj_legend_metadata.extension._WIDGET_NAME = 'ojLegend';
  oj.CustomElementBridge.register('oj-legend', { metadata: __oj_legend_metadata });
})();

var __oj_legend_item_metadata = 
{
  "properties": {
    "borderColor": {
      "type": "string",
      "value": ""
    },
    "categories": {
      "type": "Array<string>",
      "value": []
    },
    "categoryVisibility": {
      "type": "string",
      "enumValues": [
        "hidden",
        "visible"
      ],
      "value": "visible"
    },
    "color": {
      "type": "string"
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
    "lineStyle": {
      "type": "string",
      "enumValues": [
        "dashed",
        "dotted",
        "solid"
      ],
      "value": "solid"
    },
    "lineWidth": {
      "type": "number"
    },
    "markerColor": {
      "type": "string"
    },
    "markerShape": {
      "type": "string",
      "value": "square"
    },
    "markerSvgClassName": {
      "type": "string",
      "value": ""
    },
    "markerSvgStyle": {
      "type": "object"
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
    "shortDesc": {
      "type": "string",
      "value": ""
    },
    "source": {
      "type": "string",
      "value": ""
    },
    "svgClassName": {
      "type": "string",
      "value": ""
    },
    "svgStyle": {
      "type": "object"
    },
    "symbolType": {
      "type": "string",
      "enumValues": [
        "image",
        "line",
        "lineWithMarker",
        "marker"
      ],
      "value": "marker"
    },
    "text": {
      "type": "string",
      "value": ""
    }
  },
  "extension": {}
};
/* global __oj_legend_item_metadata:false */
(function () {
  __oj_legend_item_metadata.extension._CONSTRUCTOR = function () {};
  var _LEGEND_ITEM_SHAPE_ENUMS = {
    circle: true,
    ellipse: true,
    diamond: true,
    triangleUp: true,
    triangleDown: true,
    plus: true,
    human: true,
    rectangle: true,
    star: true,
    square: true
  };
  oj.CustomElementBridge.register('oj-legend-item', {
    metadata: __oj_legend_item_metadata,
    parseFunction: DvtAttributeUtils.shapeParseFunction(
      { 'marker-shape': true },
      _LEGEND_ITEM_SHAPE_ENUMS
    )
  });
})();

var __oj_legend_section_metadata = 
{
  "properties": {
    "collapsible": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "off"
    },
    "text": {
      "type": "string",
      "value": ""
    },
    "textHalign": {
      "type": "string",
      "enumValues": [
        "center",
        "end",
        "start"
      ],
      "value": "start"
    },
    "textStyle": {
      "type": "object",
      "value": {}
    }
  },
  "extension": {}
};
/* global __oj_legend_section_metadata:false */
(function () {
  __oj_legend_section_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-legend-section', {
    metadata: __oj_legend_section_metadata
  });
})();

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
 *       <td rowspan="2">Legend Item</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Filter when <code class="prettyprint">hideAndShowBehavior</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Highlight when <code class="prettyprint">hoverBehavior</code> is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojLegend
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
 *       <td>Move focus to previous item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus to next item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus to previous item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus to next item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Hides or unhides the data associated with the current item.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojLegend
 */

/**
 * Object type that defines a legend section.
 * @typedef {Object} oj.ojLegend.Section
 * @property {"on"|"off"} [collapsible="off"] Whether the section is collapsible. Only applies if the legend orientation is vertical.
 * @property {"off"|"on"} [expanded="on"] Whether the section is initially expanded. Only applies if the section is collapsible.
 * @property {string=} id The id of the legend section. For the DataProvider case, the key for the node will be used as the id.
 * @property {Array.<Object>=} items An array of objects with the following properties defining the legend items. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
 * @property {Array.<Object>=} sections An array of nested legend sections.
 * @property {string=} title The title of the legend section.
 * @property {"center"|"end"|"start"} [titleHalign="start"] The horizontal alignment of the section title. If the section is collapsible or nested, only start alignment is supported.
 * @property {Object=} titleStyle The CSS style object defining the style of the section title. The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "Array.<oj.ojLegend.Item<K>>", for: "items", jsdocOverride: true},
 *               {target: "Type", value: "Array.<oj.ojLegend.Section<K>>", for: "sections", jsdocOverride: true},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "titleStyle", jsdocOverride: true},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
 */

/**
 * Object type that defines a chart data item.
 * @typedef {Object} oj.ojLegend.Item
 * @property {string=} borderColor The border color of the marker. Only applies if symbolType is "marker" or "lineWithMarker".
 * @property {Array.<string>=} categories An array of categories for the legend item. Legend items currently only support a single category. If no category is specified, this defaults to the id or text of the legend item.
 * @property {"hidden"|"visible"} [categoryVisibility="visible"] Defines whether the legend item corresponds to visible data items. A hollow symbol is shown if the value is "hidden".
 * @property {string=} color The color of the legend symbol (line or marker). When symbolType is "lineWithMarker", this attribute defines the line color and the markerColor attribute defines the marker color.
 * @property {"off"|"on"|"inherit"} [drilling="inherit"] Whether drilling is enabled on the legend item. Drillable objects will show a pointer cursor on hover and fire ojDrill event on click. To enable drilling for all legend items at once, use the drilling attribute in the top level.
 * @property {any=} id The id of the legend item, which is provided as part of the context for events fired by the legend. If not specified, the id defaults to the text of the legend item if a DataProvider is not being used. For the DataProvider case, the key for the node will be used as the id.
 * @property {"dashed"|"dotted"|"solid"} [lineStyle="solid"] The line style. Only applies when the symbolType is "line" or "lineWithMarker".
 * @property {number=} lineWidth The line width in pixels. Only applies when the symbolType is "line" or "lineWithMarker".
 * @property {string=} markerColor The color of the marker, if different than the line color. Only applies if the symbolType is "lineWithMarker".
 * @property {"circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string} [markerShape="square"] The shape of the marker. Only applies if symbolType is "marker" or "lineWithMarker". Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
 * @property {string=} markerSvgClassName The CSS style class to apply to the marker. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute.
 * @property {Object=} markerSvgStyle The inline style to apply to the marker. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute. Only SVG CSS style properties are supported.
 * @property {"largeChecker"|"largeCrosshatch"|"largeDiagonalLeft"|"largeDiagonalRight"|"largeDiamond"|"largeTriangle"|"none"|"smallChecker"|"smallCrosshatch"|"smallDiagonalLeft"|"smallDiagonalRight"|"smallDiamond"|"smallTriangle"} [pattern="none"] The pattern used to fill the marker. Only applies if symbolType is "marker" or "lineWithMarker".
 * @property {string=} shortDesc The description of this legend item. This is used for accessibility and for customizing the tooltip text.
 * @property {string=} source The URI of the image of the legend symbol.
 * @property {string=} svgClassName The CSS style class to apply to the legend item. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @property {Object=} svgStyle The inline style to apply to the legend item. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute. Only SVG CSS style properties are supported.
 * @property {"image"|"line"|"lineWithMarker"|"marker"} [symbolType="marker"] The type of legend symbol to display.
 * @property {string} text The legend item text.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride: true},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "markerSvgStyle", jsdocOverride: true},
 *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
 */

// METHOD TYPEDEFS

/**
 * @typedef {Object} oj.ojLegend.SectionContext
 * @ojtsignore
 * @property {string} title The title of the legend section.
 * @property {Array.<object>} sections Array of legend sections.
 * @property {Array.<object>} items Array of legend items.
 * @property {Function(number)} getSection Returns the section with the specified index.
 * @property {string} getSection.title The title of the legend section.
 * @property {string} getSection.sections Array of legend sections.
 * @property {boolean} getSection.items Array of legend items.
 * @property {Function(number)} getItems Returns the item with the specified index.
 * @property {string} getItems.text The text of the legend item.
 */

/**
 * @typedef {Object} oj.ojLegend.ItemContext
 * @ojtsignore
 * @property {string} text The text of the legend item.
 */

/**
 * @typedef {Object} oj.ojLegend.NodeContext
 * @property {number} itemIndex The index of the item within the specified section.
 * @property {Array.<number>} sectionIndexPath The array of numerical indices for the section.
 * @property {string} subId Sub-id string to identify this dom node.
 */

/**
 * @typedef {Object} oj.ojLegend.PreferredSize
 * @property {number} width The available width.
 * @property {number} height The available height.
 */

// Slots
/**
 * <p>
 *  The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for
 *  creating items of the legend. The slot content must be wrapped in a &lt;template>
 *  element. The content of the template should be a single &lt;oj-legend-item> element.
 *  See the [oj-legend-item]{@link oj.ojLegendItem} doc for more details.
 * </p>
 * <p>
 *  When the template is executed for each area, it will have access to the components's
 *  binding context containing the following properties:
 * </p>
 * <ul>
 *   <li>
 *      $current - an object that contains information for the current node. (See [oj.ojLegend.ItemTemplateContext]{@link oj.ojLegend.ItemTemplateContext} or the table below for a list of properties available on $current)
 *   </li>
 *   <li>
 *      alias - if 'as' attribute was specified, the value will be used to provide an
 *      application-named alias for $current.
 *   </li>
 * </ul>
 *
 * @ojslot itemTemplate
 * @ojmaxitems 1
 * @memberof oj.ojLegend
 * @ojshortdesc The itemTemplate slot is used to specify the template for creating each legend item. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojLegend.ItemTemplateContext
 * @ojpreferredcontent ["LegendItemElement"]
 *
 * @example <caption>Initialize the legend with an inline item template specified:</caption>
 * &lt;oj-legend data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate'>
 *    &lt;oj-legend-item text='[[$current.data.text]]' color='[[$current.data.color]]'>
 *    &lt;/oj-legend-item>
 *  &lt;/template>
 * &lt;/oj-legend>
 */

/**
 * @typedef {Object} oj.ojLegend.ItemTemplateContext
 * @property {Element} componentElement The &lt;oj-legend> custom element
 * @property {Object} data The data object of the node
 * @property {number} index The zero-based index of the current node
 * @property {any} key The key of the current node
 * @property {Array} parentData  An array of data objects of the outermost to innermost parents of the node
 * @property {any} parentKey  The key of the parent node
 * @ojsignature [{target:"Type", value:"<K = any, D = any>", for:"genericTypeParameters"},
 * {target:"Type", value:"D", for:"data", jsdocOverride: true},
 * {target:"Type", value:"K", for:"key", jsdocOverride: true},
 * {target:"Type", value:"K", for:"parentKey", jsdocOverride: true},
 * {target:"Type", value:"Array<D>", for:"parentData", jsdocOverride: true}]
 */

/**
 * <p>
 *  The <code class="prettyprint">sectionTemplate</code> slot is used to specify the template for
 *  creating sections of the legend. The slot content must be wrapped in a &lt;template>
 *  element. The content of the template should be a single &lt;oj-legend-section> element.
 *  See the [oj-legend-section]{@link oj.ojLegendSection} doc for more details.
 * </p>
 * <p>
 *  When the template is executed for each area, it will have access to the components's
 *  binding context containing the following properties:
 * </p>
 * <ul>
 *   <li>
 *      $current - an object that contains information for the current node.
 *      (See the table below for a list of properties available on $current)
 *   </li>
 *   <li>
 *      alias - if 'as' attribute was specified, the value will be used to provide an
 *      application-named alias for $current.
 *   </li>
 * </ul>
 *
 * @ojslot sectionTemplate
 * @ojmaxitems 1
 * @memberof oj.ojLegend
 * @ojshortdesc The sectionTemplate slot is used to specify the template for creating each legend section. See the Help documentation for more information.
 * @ojpreferredcontent ["LegendSectionElement"]
 *
 * @property {Element} componentElement The &lt;oj-legend> custom element
 * @property {Object} data The data object of the node
 * @property {number} index The zero-based index of the current node
 * @property {any} key The key of the current node
 * @property {Array} parentData  An array of data objects of the outermost to innermost parents of the node
 * @property {any} parentKey  The key of the parent node
 *
 * @example <caption>Initialize the legend with an inline item template specified:</caption>
 * &lt;oj-legend data='[[dataProvider]]'>
 *  &lt;template slot='sectionTemplate'>
 *    &lt;oj-legend-section  collapsible='on' expanded='[[$current.index == 0 ? "on" : "off"]]'>
 *    &lt;/oj-legend-section>
 *  &lt;/template>
 * &lt;/oj-legend>
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for legend items indexed by their section and item indices.</p>
 *
 * @property {Array} sectionIndexPath The array of numerical indices for the section.
 * @property {number} itemIndex The index of the item within the specified section.
 *
 * @ojsubid oj-legend-item
 * @memberof oj.ojLegend
 *
 * @example <caption>Get the second item in the first section:</caption>
 * var nodes = $( ".selector" ).ojLegend( "getNodeBySubId", {'subId': 'oj-legend-item', sectionIndexPath: [0], itemIndex: 1} );
 */

/**
 * <p>Sub-ID for the the legend tooltip.</p>
 *
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 *
 * @ojsubid
 * @member
 * @name oj-legend-tooltip
 * @memberof oj.ojLegend
 * @instance
 *
 * @example <caption>Get the tooltip object of the legend, if displayed:</caption>
 * var nodes = $( ".selector" ).ojLegend( "getNodeBySubId", {'subId': 'oj-legend-tooltip'} );
 */
// Node Context Objects ********************************************************

/**
 * <p>Context for legend items indexed by their section and item indices.</p>
 *
 * @property {Array} sectionIndexPath The array of numerical indices for the section.
 * @property {number} itemIndex The index of the item within the specified section.
 *
 * @ojnodecontext oj-legend-item
 * @memberof oj.ojLegend
 */

/**
 * @ojcomponent oj.ojLegend
 * @augments oj.dvtBaseComponent
 * @since 0.7.0
 * @ojimportmembers oj.ojSharedContextMenu
 * @ojshortdesc A legend displays an interactive description of symbols, colors, etc., used in graphical information representations.
 * @ojrole application
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojLegend<K, D extends oj.ojLegend.Item<K>|oj.ojLegend.Section<K>|any> extends dvtBaseComponent<ojLegendSettableProperties<K, D>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojLegendSettableProperties<K,  D extends oj.ojLegend.Item<K>|oj.ojLegend.Section<K>|any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["orientation", "halign", "valign", "hoverBehavior", "hoverBehaviorDelay", "style"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["data"]}
 * @ojvbdefaultcolumns 2
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-legend'
 * @ojuxspecs ['legend']
 *
 * @classdesc
 * <h3 id="legendOverview-section">
 *   JET Legend
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#legendOverview-section"></a>
 * </h3>
 *
 * <p>A themable, WAI-ARIA compliant legend for JET.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-legend
 *  orientation='vertical'
 *  data='[[dataProvider]]'
 * >
 * &lt;/oj-legend>
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
 * {@ojinclude "name":"rtl"}
 */

oj.__registerWidget('oj.ojLegend', $.oj.dvtBaseComponent, {
  widgetEventPrefix: 'oj',
  options: {
    /**
     * An alias for the $current context variable passed to slot content for the nodeTemplate slot.
     * @expose
     * @name as
     * @memberof oj.ojLegend
     * @ojshortdesc An alias for the '$current' context variable passed to slot content for the nodeTemplate slot.
     * @instance
     * @type {string=}
     * @default ""
     * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
     */
    as: '',

    /**
     * The DataProvider for the sections and items of the legend. It should provide a data tree where each node in the data tree corresponds to a section or item in the legend.
     * Nodes that are leaves will be treated as items. The row key will be used as the id for legend sections and items. Note that when
     * using this attribute, a template for the <a href="#itemTemplate">itemTemplate</a> and optionally <a href="#sectionTemplate">sectionTemplate</a> slots should be provided.
     * The DataProvider can either have an arbitrary data shape, in which case an <oj-legend-item> element (and an <oj-legend-section> element for hierarchical
     * data) must be specified in the itemTemplate (and sectionTemplate) slot or it can have oj.ojLegend.Item{@link oj.ojLegend.Item}
     * (and oj.ojLegend.Section{@link oj.ojLegend.Section}) as its data shape, in which case no template is required.
     * @expose
     * @name data
     * @memberof oj.ojLegend
     * @ojshortdesc Specifies the DataProvider for the sections and items of the legend. See the Help documentation for more information.
     * @instance
     * @type {Object|null}
     * @ojsignature {target: "Type", value: "DataProvider<K, D>|null", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the legend with the
     * <code class="prettyprint">data</code> attribute specified:</caption>
     * &lt;oj-legend data='[[dataProvider]]'>&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">data</code>
     * property after initialization:</caption>
     * // getter
     * var value = myLegend.data;
     *
     * // setter
     * myLegend.data = dataProvider;
     */
    data: null,

    /**
     * Whether drilling is enabled on all legend items. Drillable objects will show a pointer cursor on hover and fire <code class="prettyprint">ojDrill</code> event on click. To enable or disable drilling on individual legend item, use the drilling attribute in each legend item.
     * @expose
     * @name drilling
     * @memberof oj.ojLegend
     * @ojshortdesc Specifies whether drilling is enabled. Drillable objects will show a pointer cursor on hover and fire an ojDrill event on click. See the Help documentation for more information.
     * @instance
     * @type {string=}
     * @ojvalue {string} "on" Legend items will be drillable.
     * @ojvalue {string} "off" Legend items will not be drillable.
     * @default "off"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">drilling</code> attribute specified:</caption>
     * &lt;oj-legend drilling="on">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">drilling</code> property after initialization:</caption>
     * // getter
     * var drillingValue = myLegend.drilling;
     *
     * // setter
     * myLegend.drilling = 'on';
     */
    drilling: 'off',

    /**
     * Specifies the key set containing the ids of sections that should be expanded on initial render.
     * Use the <a href="KeySetImpl.html">KeySetImpl</a> class to specify sections to expand.
     * Use the <a href="AllKeySetImpl.html">AllKeySetImpl</a> class to expand all sections.
     * By default, all sections are expanded.
     * @expose
     * @name expanded
     * @memberof oj.ojLegend
     * @ojshortdesc Specifies the key set containing the ids of sections that should be expanded on initial render. See the Help documentation for more information.
     * @instance
     * @type {(KeySet|null)=}
     * @ojsignature {target:"Type", value:"oj.KeySet<K>|null"}
     * @ojwriteback
     */
    /**
     * Defines the horizontal alignment of the legend contents.
     * @expose
     * @name halign
     * @memberof oj.ojLegend
     * @instance
     * @type {string=}
     * @ojvalue {string} "center" Legend contents will be center aligned.
     * @ojvalue {string} "end" Legend contents will be end aligned.
     * @ojvalue {string} "start" Legend contents will be start aligned.
     * @default "start"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">halign</code> attribute specified:</caption>
     * &lt;oj-legend halign="center">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">halign</code> property after initialization:</caption>
     * // getter
     * var halignValue = myLegend.halign;
     *
     * // setter
     * myLegend.halign = "center";
     *
     */
    halign: 'start',

    /**
     * An array of categories that will be hidden.
     * @expose
     * @name hiddenCategories
     * @memberof oj.ojLegend
     * @instance
     * @type {Array.<string>=}
     * @default []
     * @ojwriteback
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">hidden-categories</code> attribute specified:</caption>
     * &lt;oj-legend hidden-categories='["Apples", "Bananas"]'>&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">hiddenCategories</code> property after initialization:</caption>
     * // Get one
     * var value = myLegend.hiddenCategories[0];
     *
     * // Get all
     * var hiddenCategoriesValue = myLegend.hiddenCategories;
     *
     * // setter
     * myLegend.hiddenCategories = ["Apples", "Bananas"];
     */
    hiddenCategories: [],

    /**
     * Defines whether the legend can be used to initiate hide and show behavior on referenced data items.
     * @expose
     * @name hideAndShowBehavior
     * @memberof oj.ojLegend
     * @instance
     * @type {string=}
     * @ojvalue {string} "on" Legend can be used to initiate hide and show behavior on referenced data items.
     * @ojvalue {string} "off" legend cannot be used to initiate hide and show behavior on referenced data items
     * @default "off"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">hide-and-show-behavior</code> attribute specified:</caption>
     * &lt;oj-legend hide-and-show-behavior="on">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">hideAndShowBehavior</code> property after initialization:</caption>
     * // getter
     * var hideAndShowValue = myLegend.hideAndShowBehavior;
     *
     * // setter
     * myLegend.hideAndShowBehavior = 'on';
     */
    hideAndShowBehavior: 'off',

    /**
     * An array of categories that will be highlighted.
     * @expose
     * @name highlightedCategories
     * @memberof oj.ojLegend
     * @instance
     * @type {Array.<string>=}
     * @default []
     * @ojwriteback
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">highlighted-categories</code> attribute specified:</caption>
     * &lt;oj-legend highlighted-categories='["Bananas", "Apples"]'>&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">highlightedCategories</code> property after initialization:</caption>
     * // Get one
     * var value = myLegend.highlightedCategories[0];
     *
     * // getter
     * var highlightedCategoriesValue = myLegend.highlightedCategories;
     *
     * // setter
     * myLegend.highlightedCategories = ["Bananas", "Apples"];
     */
    highlightedCategories: [],

    /**
     * Defines the behavior applied when hovering over a legend item.
     * @expose
     * @name hoverBehavior
     * @memberof oj.ojLegend
     * @instance
     * @type {string=}
     * @ojvalue {string} "dim" Dimming hover behavior is applied.
     * @ojvalue {string} "none" No hover behavior will be applied.
     * @default "none"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">hover-behavior</code> attribute specified:</caption>
     * &lt;oj-legend hover-behavior="dim">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">hoverBehavior</code> property after initialization:</caption>
     * // getter
     * var hoverBehaviorValue = myLegend.hoverBehavior;
     *
     * // setter
     * myLegend.hoverBehavior = 'dim';
     */
    hoverBehavior: 'none',

    /**
     * Specifies initial hover delay in ms for highlighting items in legend.
     * @expose
     * @name hoverBehaviorDelay
     * @memberof oj.ojLegend
     * @ojshortdesc Specifies initial hover delay in milliseconds for highlighting items in legend.
     * @instance
     * @type {number=}
     * @ojunits milliseconds
     * @ojmin 0
     * @default 200
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">hover-behavior-delay</code> attribute specified:</caption>
     * &lt;oj-legend hover-behavior-delay="150">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">hoverBehaviorDelay</code> property after initialization:</caption>
     * // getter
     * var delayValue = myLegend.hoverBehaviorDelay;
     *
     * // setter
     * myLegend.hoverBehaviorDelay = 150;
     */
    hoverBehaviorDelay: 200,

    /**
     * Defines the orientation of the legend, which determines the direction in which the legend items are laid out.
     * @expose
     * @name orientation
     * @memberof oj.ojLegend
     * @instance
     * @type {string=}
     * @ojvalue {string} "horizontal" Legend items will be horizontally placed in available space.
     * @ojvalue {string} "vertical" Legend items will be vertically stacked.
     * @default "vertical"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">orientation</code> attribute specified:</caption>
     * &lt;oj-legend orientation="horizontal">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">orientation</code> property after initialization:</caption>
     * // getter
     * var orientationValue = myLegend.orientation;
     *
     * // setter
     * myLegend.orientation = "horizontal";
     */
    orientation: 'vertical',

    /**
     * Defines whether scrolling is enabled for the legend.
     * @expose
     * @name scrolling
     * @memberof oj.ojLegend
     * @instance
     * @type {string=}
     * @ojvalue {string} "off" The legend will not be scrollable.
     * @ojvalue {string} "asNeeded" The legend will be scrollable if legend items cannot fit in the available space.
     * @default "asNeeded"
     * @ojdeprecated {since: '12.1.0', description: 'Setting scrolling to off is not supported in Redwood theme and it is not recommended. As such, this attribute is deprecated.'}
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">scrolling</code> attribute specified:</caption>
     * &lt;oj-legend scrolling="off">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">scrolling</code> property after initialization:</caption>
     * // getter
     * var scrollingValue = myLegend.scrolling;
     *
     * // setter
     * myLegend.scrolling = 'off';
     *
     */
    scrolling: 'asNeeded',

    /**
     * An array of objects with the following properties defining the legend sections.
     * @expose
     * @ojtsignore
     * @name sections
     * @memberof oj.ojLegend
     * @ojshortdesc An array of objects specifying the legend sections.
     * @instance
     * @type {(Array.<Object>|null)=}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojLegend.Section<K>>>|null",
     *                                           SetterType: "Array<oj.ojLegend.Section<K>>|Promise<Array<oj.ojLegend.Section<K>>>|null"},
     *                                           jsdocOverride: true}
     * @default null
     *
     * @example <caption>Initialize the legend with the
     * <code class="prettyprint">sections</code> attribute specified:</caption>
     * &lt;oj-legend sections='[{"title": "Brand", "expanded": "on", "collapsible": "on",
     *                        items: [{"color": "red", "text": "Coke", "id": "Coke"},
     *                                {"color": "blue", "text": "Pepsi", "id": "Pepsi"},
     *                                {"color": "yellow", "text": "Snapple", "id": "Snapple"},
     *                                {"color": "brown", "text": "Nestle", "id": "Nestle"}]}]'>
     * &lt;/oj-legend>
     *
     * &lt;oj-legend sections='[[sectionsPromise]]'>&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">sections</code>
     * property after initialization:</caption>
     * // Get one
     * var value = myLegend.sections[0];
     *
     * // Get all (The items getter always returns a Promise so there is no "get one" syntax)
     * var values = myLegend.sections;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myLegend.sections=[{title: "Brand", expanded: "on", collapsible: "on",
     *                     items: [{color: "red", text: "Coke", id: "Coke"},
     *                             {color: "blue", text: "Pepsi", id: "Pepsi"},
     *                             {color: "yellow", text: "Snapple", id: "Snapple"},
     *                             {color: "brown", text: "Nestle", id: "Nestle"}]}];
     */
    sections: null,

    /**
     * The height of the legend symbol (line or marker) in pixels. If the value is 0, it will take the same value as symbolWidth. If both symbolWidth and symbolHeight are 0, then it will use a default value that may vary based on theme.
     * @expose
     * @name symbolHeight
     * @memberof oj.ojLegend
     * @ojshortdesc The height of the legend symbol in pixels. See the Help documentation for more information.
     * @instance
     * @type {number=}
     * @ojunits pixels
     * @default 0
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">symbol-height</code> attribute specified:</caption>
     * &lt;oj-legend symbol-height="20">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">symbolHeight</code> property after initialization:</caption>
     * // getter
     * var symbolHeightValue = myLegend.symbolHeight;
     *
     * // setter
     * myLegend.symbolHeight = 20;
     */
    symbolHeight: 0,

    /**
     * The width of the legend symbol (line or marker) in pixels. If the value is 0, it will take the same value as symbolWidth. If both symbolWidth and symbolHeight are 0, then it will use a default value that may vary based on theme.
     * @expose
     * @name symbolWidth
     * @memberof oj.ojLegend
     * @ojshortdesc The width of the legend symbol in pixels. See the Help documentation for more information.
     * @instance
     * @type {number=}
     * @ojunits pixels
     * @default 0
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">symbol-width</code> attribute specified:</caption>
     * &lt;oj-legend symbol-width="15">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">symbolWidth</code> property after initialization:</caption>
     * // getter
     * var symbolWidthValue = myLegend.symbolWidth;
     *
     * // setter
     * myLegend.symbolWidth = 15;
     */
    symbolWidth: 0,

    /**
     * The CSS style object defining the style of the legend item text.
     * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
     * @expose
     * @name textStyle
     * @ojshortdesc The CSS style object defining the style of the legend item text.
     * @memberof oj.ojLegend
     * @instance
     * @type {Object=}
     * @default  {}
     * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">text-style</code> attribute specified:</caption>
     * &lt;oj-legend text-style='{"fontSize":"12px"}'>&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">textStyle</code> property after initialization:</caption>
     * // getter
     * var textStyleValue = myLegend.textStyle;
     *
     * // setter
     * myLegend.textStyle = {"fontSize" : "12px"};
     */
    textStyle: {},

    /**
     * Defines the vertical alignment of the legend contents.
     * @expose
     * @name valign
     * @memberof oj.ojLegend
     * @instance
     * @type {string=}
     * @ojvalue {string} "middle" The legend items will be middle aligned.
     * @ojvalue {string} "bottom" The legend items will be bottom aligned.
     * @ojvalue {string} "top" The legend items will be top aligned.
     * @default "top"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">valign</code> attribute specified:</caption>
     * &lt;oj-legend valign="middle">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">valign</code> property after initialization:</caption>
     * // getter
     * var valignValue = myLegend.valign;
     *
     * // setter
     * myLegend.valign = "middle";
     */
    valign: 'top',

    // EVENTS

    /**
     * Triggered during a drill gesture (single click on the legend item).
     * @property {any} id the id of the drilled object
     *
     * @expose
     * @event
     * @memberof oj.ojLegend
     * @instance
     */
    drill: null
  },

  _CreateDvtComponent: function (context, callback, callbackObj) {
    return new Legend(context, callback, callbackObj);
  },

  _InitOptions: function (originalDefaults, constructorOptions) {
    this._super(originalDefaults, constructorOptions);

    // expanded property is dynamically generated
    // so we need to retrieve it here and override the dynamic getter by
    // setting the returned object as the new value.
    var expanded = this.options.expanded;
    this.options.expanded = expanded;
  },

  _ConvertLocatorToSubId: function (locator) {
    var subId = locator.subId;

    if (subId === 'oj-legend-item') {
      // section[sectionIndex0][sectionIndex1]...[sectionIndexN]:item[itemIndex]
      subId = 'section' + this._GetStringFromIndexPath(locator.sectionIndexPath);
      subId += ':item[' + locator.itemIndex + ']';
    } else if (subId === 'oj-legend-tooltip') {
      subId = 'tooltip';
    }
    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  _ConvertSubIdToLocator: function (subId) {
    var locator = {};

    if (subId.indexOf(':item') > 0) {
      // section[sectionIndex0][sectionIndex1]...[sectionIndexN]:item[itemIndex]
      var itemStartIndex = subId.indexOf(':item');
      var sectionSubstr = subId.substring(0, itemStartIndex);
      var itemSubstr = subId.substring(itemStartIndex);

      locator.subId = 'oj-legend-item';
      locator.sectionIndexPath = this._GetIndexPath(sectionSubstr);
      locator.itemIndex = this._GetFirstIndex(itemSubstr);
    } else if (subId === 'tooltip') {
      locator.subId = 'oj-legend-tooltip';
    }
    return locator;
  },

  _GetComponentStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses.push('oj-legend');
    return styleClasses;
  },

  _GetChildStyleClasses: function () {
    var styleClasses = this._super();

    // Should be kept in sync with chart DvtLegend
    styleClasses['oj-legend'] = { path: 'textStyle', property: 'TEXT' };
    styleClasses['oj-legend-section-title'] = { path: '_sectionTitleStyle', property: 'TEXT' };
    styleClasses['oj-legend-hover'] = { path: '_hoverBorderRadius', property: 'border-radius' };
    return styleClasses;
  },

  _GetEventTypes: function () {
    return ['drill', 'expand', 'collapse'];
  },

  _HandleEvent: function (event) {
    var type = event.type;
    if (type === 'drill') {
      this._trigger('drill', null, { id: event.id });
    } else if (type === 'expand' || type === 'collapse') {
      this._UserOptionChange('expanded', event.expanded);
    } else {
      this._super(event);
    }
  },

  _RemoveKeys: function (removedKeys) {
    this._super(removedKeys);
    var expandedChanged;
    var expanded = this.options.expanded;
    if (expanded && !expanded.isAddAll()) {
      removedKeys.forEach(function (keyValue) {
        if (expanded.has(keyValue)) {
          expanded = expanded.delete([keyValue]);
          expandedChanged = true;
        }
      });
      if (expandedChanged) {
        this._UserOptionChange('expanded', expanded);
      }
    }
  },

  _LoadResources: function () {
    // Ensure the resources object exists
    if (this.options._resources == null) {
      this.options._resources = {};
    }

    var resources = this.options._resources;

    // Add images
    var rtl = this._GetReadingDirection() === 'rtl';
    resources.closed = `oj-fwk-icon oj-fwk-icon-arrow-${rtl ? 'w' : 'e'}`;
    resources.open = `oj-fwk-icon oj-fwk-icon-arrow-${rtl ? 'sw' : 'se'}`;
  },

  _GetSimpleDataProviderConfigs: function () {
    var templateName = function (data) {
      if (data && data.children) {
        return 'sectionTemplate';
      }
      return 'itemTemplate';
    };
    var templateElementName = function (data) {
      if (data && data.children) {
        return 'oj-legend-section';
      }
      return 'oj-legend-item';
    };
    var processChildrenData = function (processedParentData, parentData, childrenData) {
      // eslint-disable-next-line no-param-reassign
      processedParentData.sections = [];
      // eslint-disable-next-line no-param-reassign
      processedParentData.items = [];
      for (var j = 0; j < childrenData.length; j++) {
        var childData = childrenData[j];
        var nodeData = parentData.children[j];
        if (nodeData.children) {
          processedParentData.sections.push(childData);
        } else {
          processedParentData.items.push(childData);
        }
      }
    };
    var getAliasedPropertyNames = function (elementName) {
      if (elementName === 'oj-legend-section') {
        return { text: 'title', textHalign: 'titleHalign', textStyle: 'titleStyle' };
      }
      return {};
    };
    var processOptionData = function (optionData) {
      var result = { sections: [], items: [] };
      for (var i = 0; i < optionData.length; i++) {
        if (optionData[i].items || optionData[i].sections) {
          result.sections.push(optionData[i]);
        } else {
          result.items.push(optionData[i]);
        }
      }
      return result.items.length > 0 ? [result] : optionData;
    };

    return {
      data: {
        templateName: templateName,
        templateElementName: templateElementName,
        resultPath: 'sections',
        getAliasedPropertyNames: getAliasedPropertyNames,
        processChildrenData: processChildrenData,
        expandedKeySet: new AllKeySetImpl(), // if this becomes dynamic see example in ojsunburst
        processOptionData: processOptionData
      }
    };
  },

  _Render: function () {
    this._super();
  },

  /**
   * Returns the legend title for automation testing verification.
   * @return {String} The legend title
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @instance
   * @memberof oj.ojLegend
   * @ignore
   */
  getTitle: function () {
    var auto = this._component.getAutomation();
    return auto.getTitle();
  },

  /**
     * Returns an object with the following properties for automation testing verification of the legend section with
     * the specified subid path.
     *
     * @param {Array} subIdPath The array of indices in the subId for the desired legend section.
     * @ojsignature {target: "Type", value: "oj.ojLegend.SectionContext|null", jsdocOverride: true, for: "returns"}
     * @return {Object|null} An object containing properties for the legend section at the given subIdPath, or null if
     *   none exists.
     * @example <caption>Initialize Legend and get items using the <code class="prettyprint">getItem(index)</code> method:</caption>
     * // Returns {title: null, items: [{text: "line"}, {text: "lineWithMarker"}, {text: "marker"}, {text: "marker with pattern fill"}, {text: "image"}], sections: null, getSection: function, getItem: function}
     * &lt;oj-legend id="legend1" sections='[{items: [{"text": "line", "symbolType": "line", "color": "#267db3"},
     {"text": "lineWithMarker", "symbolType": "lineWithMarker", "markerShape": "diamond", "color": "#68c182", "markerColor": "#efdd14", "borderColor": "#68c182"},
     {"text": "marker", "symbolType": "marker", "markerShape": "human", color: "#fad55c"},
     {"text": "marker with pattern fill", "symbolType": "marker", "markerShape": "circle", "color": "#ed6647", "pattern": "smallDiamond"},
     {"text": "image", "symbolType": "image", "source": "css/samples/cookbook/images/dvt/appServer.png"}]}]'>&lt;/oj-legend>
     *  var legend = document.getElementById('legend1');
     *  var section = legend.getSection([0]);
     * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
     * @ojtsignore
     * @instance
     * @memberof oj.ojLegend
     * @ojshortdesc Returns information for automation testing verification of a specified legend section.
     */
  getSection: function (subIdPath) {
    var ret = this._component.getAutomation().getSection(subIdPath);
    if (ret) {
      // Support for getSection(sectionIndex)
      ret.getSection = function (sectionIndex) {
        return ret.sections ? ret.sections[sectionIndex] : null;
      };

      // Support for getSection(itemIndex)
      ret.getItem = function (itemIndex) {
        return ret.items ? ret.items[itemIndex] : null;
      };
    }
    return ret;
  },

  /**
     * Returns an object with the following properties for automation testing verification of the legend item with
     * the specified subid path.
     *
     * @param {Array} subIdPath The array of indices in the subId for the desired legend item.
     * @ojsignature {target: "Type", value: "oj.ojLegend.ItemContext|null", jsdocOverride: true, for: "returns"}
     * @return {Object|null} An object containing properties for the legend item at the given subIdPath, or null if
     *   none exists.
     * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
     * @ojtsignore
     * @instance
     * @example <caption>Initialize Legend and get items using the <code class="prettyprint">getItem(index)</code> method:</caption>
     * // Returns {text: "line"}
     * &lt;oj-legend id="legend1" sections='[{items: [{"text": "line", "symbolType": "line", "color": "#267db3"},
     {"text": "lineWithMarker", "symbolType": "lineWithMarker", "markerShape": "diamond", "color": "#68c182", "markerColor": "#efdd14", "borderColor": "#68c182"},
     {"text": "marker", "symbolType": "marker", "markerShape": "human", color: "#fad55c"},
     {"text": "marker with pattern fill", "symbolType": "marker", "markerShape": "circle", "color": "#ed6647", "pattern": "smallDiamond"},
     {"text": "image", "symbolType": "image", "source": "css/samples/cookbook/images/dvt/appServer.png"}]}]'>&lt;/oj-legend>
     *  var legend = document.getElementById('legend1');
     *  var item = legend.getItem([0, 0]);
     * @memberof oj.ojLegend
     * @ojshortdesc Returns information for automation testing verification of a specified legend item.
     */
  getItem: function (subIdPath) {
    return this._component.getAutomation().getItem(subIdPath);
  },

  /**
   * Returns the preferred size of the legend, given the available width and height.
   * @param {number} width The available width for the legend to render within.
   * @param {number} height The available height for the legend to render within.
   * @ojsignature {target: "Type", value: "oj.ojLegend.PreferredSize|null", jsdocOverride: true, for: "returns"}
   * @return {Object} An object containing the preferred width and height.
   * @expose
   * @instance
   * @memberof oj.ojLegend
   */
  getPreferredSize: function (width, height) {
    // Check if the options has a promise.
    var hasPromise = false;
    if (this.options.data && this._DataProviderHandler.isDataProvider(this.options.data)) {
      hasPromise = true;
    } else {
      var legendSections = this.options.sections ? this.options.sections : [];
      for (var i = 0; i < legendSections.length; i++) {
        var items = legendSections[i].items;
        if (items && items.then) {
          hasPromise = true;
        }
      }
    }

    // If the options has a promise, then use the last options to be rendered rather
    // than passing in a promise that can't be dealt with here. This won't work if the
    // data is provided via a promise and not yet rendered, but this problem will go
    // away once we have flowing layout.
    var options = hasPromise ? null : this.options;
    var dims = this._component.getPreferredSize(options, width, height);
    return { width: dims.w, height: dims.h };
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   * @ojsignature {target: "Type", value: "oj.ojLegend.NodeContext|null", jsdocOverride: true, for: "returns"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojLegend
   * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
   */
  getContextByNode: function (node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context && context.subId !== 'oj-legend-tooltip') {
      return context;
    }

    return null;
  },

  _GetComponentDeferredDataPaths: function () {
    return { sections: ['items'], root: ['data'] };
  },

  _GetComponentNoClonePaths: function () {
    var noClonePaths = this._super();
    noClonePaths.sections = { items: true };
    return noClonePaths;
  }
});

// Conditionally set the defaults for custom element vs widget syntax since we expose different APIs
setDefaultOptions({
  ojLegend: {
    expanded: createDynamicPropertyGetter(function (context) {
      if (context.isCustomElement && context.element.getAttribute('data')) {
        return new AllKeySetImpl();
      }
      return null;
    })
  }
});

/**
 * @ojcomponent oj.ojLegendItem
 * @ojshortdesc The oj-legend-item element is used to declare properties for legend items. See the Help documentation for more information.
 * @ojsignature {target: "Type", value:"class ojLegendItem extends JetElement<ojLegendItemSettableProperties>"}
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 6.0.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Legend Item
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-legend-item element is used to declare properties for legend items and is only valid as the
 *  child of a template element for the [itemTemplate]{@link oj.ojLegend#itemTemplate}
 *  slot of oj-legend.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-legend data='[[dataProvider]]'>
 *  &lt;template slot='itemTemplate'>
 *    &lt;oj-legend-item  text='[[$current.data.text]]' color='[[$current.data.color]]'>
 *    &lt;/oj-legend-item>
 *  &lt;/template>
 * &lt;/oj-legend>
 * </code>
 * </pre>
 */

/**
 * The legend item text.
 * @expose
 * @name text
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string}
 * @default ""
 */
/**
 * An array of categories for the legend item. Legend items currently only support a single category.
 * @expose
 * @name categories
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {Array.<string>=}
 * @default []
 */
/**
 * The type of legend symbol to display.
 * @expose
 * @name symbolType
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string=}
 * @ojvalue {string} "line" The legend symbol will be a line.
 * @ojvalue {string} "lineWithMarker" The legend symbol will be a line and a marker.
 * @ojvalue {string} "image" The legend symbol will be an image.
 * @ojvalue {string} "marker" The legend symbol will be a marker.
 * @default "marker"
 */
/**
 * The URI of the image of the legend symbol.
 * @expose
 * @name source
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string=}
 * @default ""
 */
/**
 * The color of the legend symbol (line or marker). When symbolType is "lineWithMarker", this attribute defines the line color and the markerColor attribute defines the marker color.
 * @expose
 * @name color
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string=}
 * @ojformat color
 */
/**
 * The border color of the marker. Only applies if symbolType is "marker" or "lineWithMarker".
 * @expose
 * @name borderColor
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string=}
 * @ojformat color
 * @default ""
 */
/**
 * The pattern used to fill the marker. Only applies if symbolType is "marker" or "lineWithMarker".
 * @expose
 * @name pattern
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string=}
 * @ojvalue {string} "smallChecker" Small checker pattern is applied to the data item.
 * @ojvalue {string} "smallCrosshatch" Small cross hatch pattern is applied to the data item.
 * @ojvalue {string} "smallDiagonalLeft" Small diagonal left pattern is applied to the data item.
 * @ojvalue {string} "smallDiagonalRight" Small diagonal right pattern is applied to the data item.
 * @ojvalue {string} "smallDiamond" Small diamond pattern is applied to the data item.
 * @ojvalue {string} "smallTriangle" Small triangle pattern is applied to the data item.
 * @ojvalue {string} "largeChecker" Large checker pattern is applied to the data item.
 * @ojvalue {string} "largeCrosshatch" Large cross hatch pattern is applied to the data item.
 * @ojvalue {string} "largeDiagonalLeft" Large diagonal left pattern is applied to the data item.
 * @ojvalue {string} "largeDiagonalRight" Large diagonal right pattern is applied to the data item.
 * @ojvalue {string} "largeDiamond" Large diamond pattern is applied to the data item.
 * @ojvalue {string} "largeTriangle" Large triangle pattern is applied to the data item.
 * @ojvalue {string} "none" No pattern is applied to data item fill.
 * @default "none"
 */
/**
 * The line style. Only applies when the symbolType is "line" or "lineWithMarker".
 * @expose
 * @name lineStyle
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string=}
 * @ojvalue {string} "dotted" Line will have dotted strokes.
 * @ojvalue {string} "dashed" Line will have dashed strokes.
 * @ojvalue {string} "solid" Line will have a solid stroke.
 * @default "solid"
 */
/**
 * The line width in pixels. Only applies when the symbolType is "line" or "lineWithMarker".
 * @expose
 * @name lineWidth
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {number=}
 */
/**
 * The CSS style class to apply to the legend item symbol. This style class and <code> svg-style </code> will override any other styling specified through the options except for <code>marker-svg-style</code> and <code>marker-svg-class-name</code>.
 * For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @name svgClassName
 * @memberof! oj.ojLegendItem
 * @ojshortdesc The CSS style class to apply to the legend item. The style class and inline style will override any other styling specified through the options. See the Help documentation for more information.
 * @instance
 * @type {string=}
 * @default ""
 */
/**
 * The inline style to apply to the legend item symbol. This inline style and <code> svg-class-name </code> will override any other styling specified through the options except for <code>marker-svg-style</code> and <code>marker-svg-class-name</code>.
 * For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * Only SVG CSS style properties are supported.
 * @expose
 * @name svgStyle
 * @memberof! oj.ojLegendItem
 * @ojshortdesc The inline style to apply to the legend item. The style class and inline style will override any other styling specified through the options. See the Help documentation for more information.
 * @instance
 * @type {Object=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
 */
/**
 * The CSS style class to apply to the marker of the legend item symbol. This style class and <code> marker-svg-style </code> will override any other styling specified for the marker. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute.
 * @expose
 * @name markerSvgClassName
 * @memberof! oj.ojLegendItem
 * @ojshortdesc The CSS style class to apply to the marker. The style class and inline style will override any other styling specified through the options. See the Help documentation for more information.
 * @instance
 * @type {string=}
 * @default ""
 */
/**
 * The inline style to apply to the marker of the legend item symbol. This inline style and <code> marker-svg-class-name </code> will override any other styling specified for the marker. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute.
 * Only SVG CSS style properties are supported.
 * @expose
 * @name markerSvgStyle
 * @memberof! oj.ojLegendItem
 * @ojshortdesc The inline style to apply to the marker. The style class and inline style will override any other styling specified through the options. See the Help documentation for more information.
 * @instance
 * @type {Object=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
 */
/**
 * The shape of the marker. Only applies if symbolType is "marker" or "lineWithMarker". Can take the name of a built-in shape or the SVG path commands for a custom shape. Does not apply if a custom image is specified.
 * @expose
 * @name markerShape
 * @memberof! oj.ojLegendItem
 * @ojshortdesc The shape of the marker. Only applies if symbolType is "marker" or "lineWithMarker". See the Help documentation for more information.
 * @instance
 * @type {("circle"|"diamond"|"ellipse"|"human"|"plus"|"rectangle"|"square"|"star"|"triangleDown"|"triangleUp"|string)=}
 * @default "square"
 */
/**
 * The color of the marker, if different than the line color. Only applies if the symbolType is "lineWithMarker".
 * @expose
 * @name markerColor
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string=}
 * @ojformat color
 */
/**
 * Defines whether the legend item corresponds to visible data items. A hollow symbol is shown if the value is "hidden".
 * @expose
 * @name categoryVisibility
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string=}
 * @ojvalue {string} "hidden" Legend item will have a hollow symbol.
 * @ojvalue {string} "visible" Legend item will be filled.
 * @default "visible"
 */
/**
 *  Whether drilling is enabled on the legend item. Drillable objects will show a pointer cursor on hover and fire <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all legend items at once, use the drilling attribute in the top level.
 * @expose
 * @name drilling
 * @memberof! oj.ojLegendItem
 * @ojshortdesc Specifies whether drilling is enabled on the legend item. See the Help documentation for more information.
 * @instance
 * @type {string=}
 * @ojvalue {string} "on" The legend item will be drillable.
 * @ojvalue {string} "off" The legend item will not be drillable.
 * @ojvalue {string} "inherit" The drilling behavior is inherited from legend.
 * @default "inherit"
 */
/**
 * The description of this legend item. This is used for accessibility and for customizing the tooltip text.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojLegendItem
 * @instance
 * @type {string=}
 * @default ""
 */

/**
 * @ojcomponent oj.ojLegendSection
 * @ojshortdesc The oj-legend-section element is used to declare properties for legend sections. See the Help documentation for more information.
 * @ojsignature {target: "Type", value:"class ojLegendSection extends JetElement<ojLegendSectionSettableProperties>"}
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 6.0.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Legend Section
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-legend-section element is used to declare properties for legend sections and is only valid as the
 *  child of a template element for the [sectionTemplate]{@link oj.ojLegend#sectionTemplate}
 *  slot of oj-legend.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-legend data='[[dataProvider]]'>
 *  &lt;template slot='sectionTemplate'>
 *    &lt;oj-legend-section  collapsible='on' expanded='[[$current.index == 0 ? "on" : "off"]]'>
 *    &lt;/oj-legend-section>
 *  &lt;/template>
 * &lt;/oj-legend>
 * </code>
 * </pre>
 */

/**
 * The title of the legend section.
 * @expose
 * @name text
 * @memberof! oj.ojLegendSection
 * @instance
 * @type {string=}
 * @default ""
 */
/**
 * The horizontal alignment of the section title. If the section is collapsible or nested, only start alignment is supported.
 * @expose
 * @name textHalign
 * @memberof! oj.ojLegendSection
 * @instance
 * @type {string=}
 * @ojvalue {string} "center" The section title will be center aligned.
 * @ojvalue {string} "end" The section title will be end aligned.
 * @ojvalue {string} "start" The section title will be start aligned.
 * @default "start"
 */
/**
 * The CSS style object defining the style of the section title.
 * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
 * @expose
 * @name textStyle
 * @memberof! oj.ojLegendSection
 * @instance
 * @type {Object=}
 * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
 * @default {}
 */
/**
 * Whether the section is collapsible. Only applies if the legend orientation is vertical.
 * @expose
 * @name collapsible
 * @memberof! oj.ojLegendSection
 * @instance
 * @type {string=}
 * @ojvalue {string} "on" The legend section will be collapsible.
 * @ojvalue {string} "off" The legend section will not be collapsible.
 * @default "off"
 */
