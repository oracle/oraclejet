/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojcomponentcore', 'jquery', 'ojs/ojdvt-base', 'ojs/ojtagcloud-toolkit'], function (oj, Components, $, ojdvtBase, ojtagcloudToolkit) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

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
   *    <tr>
   *       <td rowspan="4">Data Item</td>
   *       <td rowspan="2"><kbd>Tap</kbd></td>
   *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
   *     </tr>
   *    <tr>
   *       <td>Open a link when the <code class="prettyprint">url</code> for a data item is set.</td>
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
   * @memberof oj.ojTagCloud
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
   *       <td>Move focus and selection to previous data item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>DownArrow</kbd></td>
   *       <td>Move focus and selection to next data item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>LeftArrow</kbd></td>
   *       <td>Move focus and selection to previous data item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>RightArrow</kbd></td>
   *       <td>Move focus and selection to next data item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift + UpArrow</kbd></td>
   *       <td>Move focus and multi-select previous data item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift + DownArrow</kbd></td>
   *       <td>Move focus and multi-select next data item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift + LeftArrow</kbd></td>
   *       <td>Move focus and multi-select previous data item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Shift + RightArrow</kbd></td>
   *       <td>Move focus and multi-select next data item.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl + UpArrow</kbd></td>
   *       <td>Move focus to previous data item, without changing the current selection.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl + DownArrow</kbd></td>
   *       <td>Move focus to next data item, without changing the current selection.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl + LeftArrow</kbd></td>
   *       <td>Move focus to previous data item, without changing the current selection.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl + RightArrow</kbd></td>
   *       <td>Move focus to next data item, without changing the current selection.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Ctrl + Spacebar</kbd></td>
   *       <td>Multi-select data item with focus.</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Enter</kbd></td>
   *       <td>Open a link when the <code class="prettyprint">url</code> for a data item is set.</td>
   *     </tr>
   *   </tbody>
   * </table>
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojTagCloud
   */

  // PROPERTY TYPEDEFS

  /**
   * @typedef {Object} oj.ojTagCloud.Item
   * @property {Array.<string>=} categories An array of category strings corresponding to the tag cloud items. This allows highlighting and filtering of items.
   * @property {string=} color The color of the text. Will be overridden by any color defined in the style option. The default value comes from the CSS and varies based on theme.
   * @property {any=} id The item id should be set by the application if the DataProvider is not being used. The row key will be used as id in the DataProvider case.
   * @property {string} label The text of the item.
   * @property {(string|function)=} shortDesc The description of the item. This is used for customizing the tooltip text.
   * @property {Object=} svgStyle The CSS style object defining the style of the item text. Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
   * @property {string=} svgClassName The CSS style class defining the style of the item text.
   * @property {string=} url The url this item references.
   * @property {number} value The value of this item which will be used to scale its font-size within the tag cloud.
   * @ojsignature [{target: "Type", value: "K", for: "id"},
   *               {target: "Type", value: "<K>", for: "genericTypeParameters"},
   *               {target: "Type", value: "?(string | ((context: oj.ojTagCloud.ItemShortDescContext<K>) => string))", jsdocOverride: true, for: "shortDesc"},
   *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride:true}]
   */
  /**
   * @typedef {Object} oj.ojTagCloud.TooltipContext
   * @property {string} color The color of the hovered item.
   * @property {Element} componentElement The tag cloud element.
   * @property {any} id The id of the hovered item.
   * @property {string} label The data label of the hovered item.
   * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
   * @property {number} value The value of the hovered item.
   * @ojsignature [{target: "Type", value: "K", for: "id"},
   *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
   */
  /**
   * @typedef {Object} oj.ojTagCloud.ItemShortDescContext
   * @property {any} id The id of the hovered item.
   * @property {string} label The data label of the hovered item.
   * @property {number} value The value of the hovered item.
   * @ojsignature [{target: "Type", value: "K", for: "id"},
   *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
   */
  /**
   * @typedef {Object} oj.ojTagCloud.ItemTemplateContext
   * @property {Element} componentElement The &lt;oj-tag-cloud> custom element.
   * @property {Object} data The data object for the current item.
   * @property {number} index The zero-based index of the current item.
   * @property {any} key The key of the current item.
   * @ojsignature [{target: "Type", value: "K", for: "key"},
   *               {target: "Type", value: "<K>", for: "genericTypeParameters"}]
   */

  // METHOD TYPEDEFS

  /**
   * @typedef {Object} oj.ojTagCloud.ItemContext
   * @property {string} color The color of the item at the given index.
   * @property {string} label The data label of the item at the given index.
   * @property {boolean} selected True if the item at the given index is currently selected and false otherwise.
   * @property {string} tooltip The tooltip of the item at the given index.
   * @property {number} value The value of the item at the given index.
   */
  /**
   * @typedef {Object} oj.ojTagCloud.NodeContext
   * @property {string} subId The subId string identify the particular DOM node.
   * @property {number} index The zero based index of the tag cloud item.
   */

  // KEEP FOR WIDGET SYNTAX

  /**
   * The CSS style string/object defining the style of the text.
   * @expose
   * @name items[].style
   * @memberof! oj.ojTagCloud
   * @instance
   * @type {string|Object}
   * @ignore
   */
  /**
   * The CSS style class defining the style of the text.
   * @expose
   * @name items[].className
   * @memberof! oj.ojTagCloud
   * @instance
   * @type {string}
   * @ignore
   */
  /**
   * The CSS style string/object defining the style of the items.
   * @expose
   * @name styleDefaults.style
   * @memberof! oj.ojTagCloud
   * @instance
   * @type {string|Object}
   * @ignore
   */

  /**
   * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for creating each item of the tag cloud. The slot content must be a single &lt;template> element.
   * <p>When the template is executed for each item, it will have access to the tag cloud's binding context and the following properties:</p>
   * <ul>
   *   <li>$current - an object that contains information for the current item. (See [oj.ojTagCloud.ItemTemplateContext]{@link oj.ojTagCloud.ItemTemplateContext} or the table below for a list of properties available on $current) </li>
   * </li>
   * <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.
   * </li>
   * </ul>
   *
   * <p>The content of the template should only be one &lt;oj-tag-cloud-item> element. See the [oj-tag-cloud-item]{@link oj.ojTagCloudItem} doc for more details.</p>
   *
   *
   * @ojslot itemTemplate
   * @ojshortdesc The itemTemplate slot is used to specify the template for creating each item of the tag cloud. See the Help documentation for more information.
   * @ojmaxitems 1
   * @memberof oj.ojTagCloud
   * @ojtemplateslotprops oj.ojTagCloud.ItemTemplateContext
   * @ojpreferredcontent ["TagCloudItemElement"]
   *
   * @example <caption>Initialize the tag cloud with an inline item template specified:</caption>
   * &lt;oj-tag-cloud data='[[dataProvider]]'>
   *  &lt;template slot='itemTemplate'>
   *    &lt;oj-tag-cloud-item
   *      value='[[$current.item.value]]'
   *      label='[[$current.item.label]]'>
   *    &lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */

  /**
   * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content. The slot content must be a single &lt;template> element.
   * This slot takes precedence over the tooltip.renderer property if specified.
   * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
   * <ul>
   *   <li>$current - an object that contains information for the current item. (See [oj.ojTagCloud.TooltipContext]{@link oj.ojTagCloud.TooltipContext} or the table below for a list of properties available on $current) </li>
   * </ul>
   *
   *
   * @ojslot tooltipTemplate
   * @ojmaxitems 1
   * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
   * @ojtemplateslotprops oj.ojTagCloud.TooltipContext
   * @memberof oj.ojTagCloud
   *
   * @example <caption>Initialize the TagCloud with a tooltip template specified:</caption>
   * &lt;oj-tag-cloud>
   *  &lt;template slot="tooltipTemplate">
   *    &lt;span>&lt;oj-bind-text value="[[$current.label + ': ' + $current.value]]">&lt;/oj-bind-text>&lt;/span>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */
  // SubId Locators **************************************************************

  /**
   * <p>Sub-ID for tag cloud items at a specified index.</p>
   *
   * @property {number} index
   *
   * @ojsubid oj-tagcloud-item
   * @memberof oj.ojTagCloud
   *
   * @example <caption>Gets the first tag cloud item:</caption>
   * var nodes = myTagCloud.getNodeBySubId({'subId': 'oj-tagcloud-item', 'index': 0});
   */

  /**
   * <p>Sub-ID for the the tag cloud tooltip.</p>
   *
   * @ojsubid oj-tagcloud-tooltip
   * @memberof oj.ojTagCloud
   *
   * @example <caption>Get the tooltip object of the tag cloud, if displayed:</caption>
   * var nodes = myTagCloud.getNodeBySubId({'subId': 'oj-tagcloud-tooltip'});
   */

  // Node Context Objects ********************************************************

  /**
   * <p>Context for tag cloud items at a specified index.</p>
   *
   * @property {number} index
   *
   * @ojnodecontext oj-tagcloud-item
   * @memberof oj.ojTagCloud
   */

  /**
   * @ojcomponent oj.ojTagCloudItem
   * @ojshortdesc The oj-tag-cloud-item element is used to declare properties for tag cloud items. See the Help documentation for more information.
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojTagCloudItem<K=any> extends dvtBaseComponent<ojTagCloudItemSettableProperties<K>>",
   *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojTagCloudItemSettableProperties<K=any> extends dvtBaseComponentSettableProperties",
   *                for: "SettableProperties"
   *               }
   *              ]
   * @ojslotcomponent
   * @ojsubcomponenttype data
   * @since 5.2.0
   *
   *
   * @classdesc
   * <h3 id="tagCloudItemOverview-section">
   *   JET Tag Cloud Item
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tagCloudItemOverview-section"></a>
   * </h3>
   *
   * <p>The oj-tag-cloud-item element is used to declare properties for tag cloud items and is only valid as the
   *  child of a template element for the [itemTemplate]{@link oj.ojTagCloud#itemTemplate} slot of oj-tag-cloud.</p>
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-tag-cloud data='[[dataProvider]]'>
   *  &lt;template slot='itemTemplate' data-oj-as='item'>
   *    &lt;oj-tag-cloud-item  label='[[item.data.id]]' value='[[item.data.total]]'>&lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   * </code>
   * </pre>
   */
  /**
   * An array of category strings corresponding to the tag cloud items. This allows highlighting and filtering of items.
   * @expose
   * @name categories
   * @memberof! oj.ojTagCloudItem
   * @instance
   * @type {(Array.<string>)=}
   * @default []
   *
   * @example <caption>Initialize tag cloud item with the
   * <code class="prettyprint">categories</code> attribute specified:</caption>
   * &lt;oj-tag-cloud data='[[dataProvider]]'>
   *  &lt;template slot='itemTemplate' data-oj-as='item'>
   *    &lt;oj-tag-cloud-item categories='[[item.data.categories]]'>&lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */
  /**
   * The color of the text. Will be overridden by any color defined in the style option. The default value comes from the CSS and varies based on theme.
   * @expose
   * @name color
   * @ojshortdesc The color of the text. See the Help documentation for more information.
   * @memberof! oj.ojTagCloudItem
   * @instance
   * @type {string=}
   * @ojformat color
   * @default ''
   *
   * @example <caption>Initialize tag cloud item with the
   * <code class="prettyprint">color</code> attribute specified:</caption>
   * &lt;oj-tag-cloud data='[[dataProvider]]'>
   *  &lt;template slot='itemTemplate' data-oj-as='item'>
   *    &lt;oj-tag-cloud-item color='[[item.data.color]]'>&lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */
  /**
   * The text of the item.
   * @expose
   * @name label
   * @memberof! oj.ojTagCloudItem
   * @instance
   * @type {string=}
   * @default ""
   * @ojtranslatable
   *
   * @example <caption>Initialize tag cloud item with the
   * <code class="prettyprint">label</code> attribute specified:</caption>
   * &lt;oj-tag-cloud data='[[dataProvider]]'>
   *  &lt;template slot='itemTemplate' data-oj-as='item'>
   *    &lt;oj-tag-cloud-item label='[[item.data.id]]'>&lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */
  /**
   * The description of the item. This is used for customizing the tooltip text.
   * @expose
   * @name shortDesc
   * @memberof! oj.ojTagCloudItem
   * @instance
   * @type {(string|function)=}
   * @default ""
   * @ojsignature [{target: "Type", value: "?(string | ((context: oj.ojTagCloud.ItemShortDescContext<K>) => string))", jsdocOverride: true}]
   * @example <caption>Initialize tag cloud item with the
   * <code class="prettyprint">short-desc</code> attribute specified:</caption>
   * &lt;oj-tag-cloud data='[[dataProvider]]'>
   *  &lt;template slot='itemTemplate' data-oj-as='item'>
   *    &lt;oj-tag-cloud-item short-desc='[[item.data.id + ":"" + item.data.total + "% of respondents"]]' label='[[item.data.id]]'>&lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */
  /**
   * The CSS style object defining the style of the item text.
   * Only SVG CSS style properties are supported.
   * @expose
   * @name svgStyle
   * @memberof! oj.ojTagCloudItem
   * @instance
   * @type {Object=}
   * @ojsignature [{target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}]
   * @default {}
   *
   * @example <caption>Initialize tag cloud item with the
   * <code class="prettyprint">svg-style</code> attribute specified:</caption>
   * &lt;oj-tag-cloud data='[[dataProvider]]'>
   *  &lt;template slot='itemTemplate' data-oj-as='item'>
   *    &lt;oj-tag-cloud-item svg-style='[[item.data.svgStyle]]' label='[[item.data.id]]'>&lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */
  /**
   * The CSS style class defining the style of the item text.
   * @expose
   * @name svgClassName
   * @memberof! oj.ojTagCloudItem
   * @instance
   * @type {string=}
   * @default ""
   *
   * @example <caption>Initialize tag cloud item with the
   * <code class="prettyprint">svg-class-name</code> attribute specified:</caption>
   * &lt;oj-tag-cloud data='[[dataProvider]]'  data-oj-as='item'>
   *  &lt;template slot='itemTemplate' data-oj-as='item'>
   *    &lt;oj-tag-cloud-item svg-class-name='[[item.data.svgClassName]]' label='[[item.data.id]]'>&lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */
  /**
   * The url this item references.
   * @expose
   * @name url
   * @memberof! oj.ojTagCloudItem
   * @instance
   * @type {string=}
   * @default ""
   *
   * @example <caption>Initialize tag cloud item with the
   * <code class="prettyprint">url</code> attribute specified:</caption>
   * &lt;oj-tag-cloud data='[[dataProvider]]'>
   *  &lt;template slot='itemTemplate' data-oj-as='item'>
   *    &lt;oj-tag-cloud-item url='[[item.data.url]]' label='[[item.data.id]]'>&lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */
  /**
   * The value of this item is used to scale its font size within the tag cloud.
   * @expose
   * @name value
   * @memberof! oj.ojTagCloudItem
   * @instance
   * @type {(number|null)=}
   * @default null
   *
   * @example <caption>Initialize tag cloud item with the
   * <code class="prettyprint">value</code> attribute specified:</caption>
   * &lt;oj-tag-cloud data='[[dataProvider]]'>
   *  &lt;template slot='itemTemplate' data-oj-as='item'>
   *    &lt;oj-tag-cloud-item value='[[item.data.total]]' label='[[item.data.id]]'>&lt;/oj-tag-cloud-item>
   *  &lt;/template>
   * &lt;/oj-tag-cloud>
   */

var __oj_tag_cloud_metadata = 
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
    "items": {
      "type": "Array<Object>|Promise"
    },
    "layout": {
      "type": "string",
      "enumValues": [
        "cloud",
        "rectangular"
      ],
      "value": "rectangular"
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
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDuration": {
          "type": "number"
        },
        "hoverBehaviorDelay": {
          "type": "number",
          "value": 200
        },
        "svgStyle": {
          "type": "object",
          "value": {}
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
  "extension": {}
};
  /* global __oj_tag_cloud_metadata:false */

  /**
   * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
   * @ignore
   */
  (function () {
    __oj_tag_cloud_metadata.extension._WIDGET_NAME = 'ojTagCloud';
    oj.CustomElementBridge.register('oj-tag-cloud', { metadata: __oj_tag_cloud_metadata });
  })();
var __oj_tag_cloud_item_metadata = 
{
  "properties": {
    "categories": {
      "type": "Array<string>",
      "value": []
    },
    "color": {
      "type": "string",
      "value": ""
    },
    "label": {
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
      "type": "object",
      "value": {}
    },
    "url": {
      "type": "string",
      "value": ""
    },
    "value": {
      "type": "number"
    }
  },
  "extension": {}
};
  /* global __oj_tag_cloud_item_metadata:false */
  (function () {
    __oj_tag_cloud_item_metadata.extension._CONSTRUCTOR = function () {};
    oj.CustomElementBridge.register('oj-tag-cloud-item', {
      metadata: __oj_tag_cloud_item_metadata
    });
  })();

  /** This file is generated. Do not edit directly. Actual file located in 3rdparty/dvt/prebuild.**/

  /**
   * @ojcomponent oj.ojTagCloud
   * @augments oj.dvtBaseComponent
   * @since 1.1.0
   * @ojimportmembers oj.ojSharedContextMenu
   * @ojrole application
   * @ojshortdesc A tag cloud is an interactive data visualization of textual data, where the importance of each tagged word or phrase is represented by font size or color.
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
   * @ojsignature [{
   *                target: "Type",
   *                value: "class ojTagCloud<K, D extends oj.ojTagCloud.Item<K>|any> extends dvtBaseComponent<ojTagCloudSettableProperties<K, D>>",
   *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
   *               },
   *               {
   *                target: "Type",
   *                value: "ojTagCloudSettableProperties<K, D extends oj.ojTagCloud.Item<K>|any> extends dvtBaseComponentSettableProperties",
   *                for: "SettableProperties"
   *               }
   *              ]
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["layout", "animationOnDataChange", "animationOnDisplay", "style"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["data", "selection"]}
   * @ojvbdefaultcolumns 12
   * @ojvbmincolumns 6
   *
   * @ojoracleicon 'oj-ux-ico-cloud-tag'
   * @ojuxspecs ['tag-cloud']
   *
   * @classdesc
   * <h3 id="tagCloudOverview-section">
   *   JET Tag Cloud
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tagCloudOverview-section"></a>
   * </h3>
   *
   * <p>Tag clouds are used to display text data with
   * the importance of each tag shown with font size or color.</p>
   *
   * {@ojinclude "name":"warning"}
   *
   * <pre class="prettyprint">
   * <code>
   * &lt;oj-tag-cloud
   *   data="[[dataProvider]]">
   * &lt;/oj-tag-cloud>
   * </code>
   * </pre>
   *
   * {@ojinclude "name":"a11yKeyboard"}
   *
   * <p>When using font colors as a data dimension for tag clouds, the application
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
   * <h4>Layout</h4>
   * <p>Rectangular layouts are faster than cloud layouts and are recommended for larger data sets.
   * </p>
   *
   * <h4>Styling</h4>
   * <p>Use the highest level property available. For example, consider setting styling properties using CSS or
   *    <code class="prettyprint">styleDefaults.svgStyle</code>, instead of styling properties
   *    on the individual data items. The tag cloud can take advantage of these higher level properties to apply the style properties on
   *    containers, saving expensive DOM calls.
   * </p>
   *
   * {@ojinclude "name":"fragment_trackResize"}
   *
   * {@ojinclude "name":"rtl"}
   */
  oj.__registerWidget('oj.ojTagCloud', $.oj.dvtBaseComponent, {
    widgetEventPrefix: 'oj',
    options: {
      /**
       * Specifies the animation that is applied on data changes.
       * @expose
       * @name animationOnDataChange
       * @memberof oj.ojTagCloud
       * @instance
       * @type {string=}
       * @ojvalue {string} "auto"
       * @ojvalue {string} "none"
       * @default "none"
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">animation-on-data-change</code> attribute specified:</caption>
       * &lt;oj-tag-cloud animation-on-data-change='auto'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">animationOnDataChange</code>
       * property after initialization:</caption>
       * // getter
       * var value = myTagCloud.animationOnDataChange;
       *
       * // setter
       * myTagCloud.animationOnDataChange="auto";
       */
      animationOnDataChange: 'none',
      /**
       * Specifies the animation that is shown on initial display.
       * @expose
       * @name animationOnDisplay
       * @memberof oj.ojTagCloud
       * @instance
       * @type {string=}
       * @ojvalue {string} "auto"
       * @ojvalue {string} "none"
       * @default "none"
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">animation-on-display</code> attribute specified:</caption>
       * &lt;oj-tag-cloud animation-on-display='auto'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">animationOnDisplay</code>
       * property after initialization:</caption>
       * // getter
       * var value = myTagCloud.animationOnDisplay;
       *
       * // setter
       * myTagCloud.animationOnDisplay="auto";
       */
      animationOnDisplay: 'none',
      /**
       * An alias for the $current context variable when referenced inside itemTemplate when using a DataProvider.
       * @expose
       * @name as
       * @ojshortdesc An alias for the '$current' context variable passed to slot content for the itemTemplate slot.
       * @memberof oj.ojTagCloud
       * @instance
       * @type {string=}
       * @default ''
       * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
       **/
      as: '',
      /**
       * The DataProvider for the tag cloud. It should provide rows where each row corresponds to a single tag cloud item.
       * The DataProvider can either have an arbitrary data shape, in which case an <oj-tag-cloud-item> element must be specified in the itemTemplate slot or it can have [oj.ojTagCloud.Item]{@link oj.ojTagCloud.Item} as its data shape, in which case no template is required.
       * @expose
       * @name data
       * @ojshortdesc Specifies the DataProvider for the tag cloud. See the Help documentation for more information.
       * @memberof oj.ojTagCloud
       * @instance
       * @type {Object|null}
       * @ojsignature {target: "Type", value: "DataProvider<K, D>|null", jsdocOverride:true}
       * @default null
       * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
       *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">data</code> attribute specified:</caption>
       * &lt;oj-tag-cloud data='[[dataProvider]]'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">data</code>
       * property after initialization:</caption>
       * // getter
       * var value = myTagCloud.data;
       *
       * // setter
       * myTagCloud.data = dataProvider;
       */
      data: null,
      /**
       * An array of category strings used for category filtering. Data items with a category
       * in hiddenCategories will be filtered.
       * @expose
       * @name hiddenCategories
       * @memberof oj.ojTagCloud
       * @instance
       * @type {(Array.<string>)=}
       * @default []
       * @ojwriteback
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">hidden-categories</code> attribute specified:</caption>
       * &lt;oj-tag-cloud hidden-categories='["soda", "water"]'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">hiddenCategories</code>
       * property after initialization:</caption>
       * // Get one
       * var value = myTagCloud.hiddenCategories[0];
       *
       * // Get all
       * var values = myTagCloud.hiddenCategories;
       *
       * // Set all (There is no permissible "set one" syntax.)
       * myTagCloud.hiddenCategories=["soda", "water"];
       */
      hiddenCategories: [],
      /**
       * An array of category strings used for highlighting. Data items matching categories in this array will be highlighted.
       * @expose
       * @name highlightedCategories
       * @memberof oj.ojTagCloud
       * @instance
       * @type {(Array.<string>)=}
       * @default []
       * @ojwriteback
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">highlighted-categories</code> attribute specified:</caption>
       * &lt;oj-tag-cloud highlighted-categories='["soda", "water"]'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">highlightedCategories</code>
       * property after initialization:</caption>
       * // Get one
       * var value = myTagCloud.highlightedCategories[0];
       *
       * // Get all
       * var values = myTagCloud.highlightedCategories;
       *
       * // Set all (There is no permissible "set one" syntax.)
       * myTagCloud.highlightedCategories=["soda", "water"];
       */
      highlightedCategories: [],
      /**
       * The matching condition for the highlightedCategories option. By default, highlightMatch is 'all'
       * and only items whose categories match all of the values specified in the highlightedCategories
       * array will be highlighted. If highlightMatch is 'any', then items that match at least one of
       * the highlightedCategories values will be highlighted.
       * @expose
       * @name highlightMatch
       * @ojshortdesc The matching condition for the highlightedCategories property. See the Help documentation for more information.
       * @memberof oj.ojTagCloud
       * @instance
       * @type {string=}
       * @ojvalue {string} "any"
       * @ojvalue {string} "all"
       * @default "all"
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">highlight-match</code> attribute specified:</caption>
       * &lt;oj-tag-cloud highlight-match='all'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">highlightMatch</code>
       * property after initialization:</caption>
       * // getter
       * var value = myTagCloud.highlightMatch;
       *
       * // setter
       * myTagCloud.highlightMatch="all";
       */
      highlightMatch: 'all',
      /**
       * Defines the behavior applied when hovering over data items.
       * @expose
       * @name hoverBehavior
       * @memberof oj.ojTagCloud
       * @instance
       * @type {string=}
       * @ojvalue {string} "dim"
       * @ojvalue {string} "none"
       * @default "none"
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">hover-behavior</code> attribute specified:</caption>
       * &lt;oj-tag-cloud hover-behavior='dim'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">hoverBehavior</code>
       * property after initialization:</caption>
       * // getter
       * var value = myTagCloud.hoverBehavior;
       *
       * // setter
       * myTagCloud.hoverBehavior="dim";
       */
      hoverBehavior: 'none',
      /**
       * An array of objects with the following properties that defines the data items for the tag cloud items.
       * Also accepts a Promise or callback function for deferred data rendering. The function should return
       * one of the following:
       * <ul>
       *   <li>Promise: A Promise that will resolve with an array of data items. No data will be rendered if the Promise is rejected.</li>
       *   <li>Array: An array of data items.</li>
       * </ul>
       * @expose
       * @ojtsignore
       * @name items
       * @ojshortdesc An array of objects defining the data items for the tag cloud items. Also accepts a Promise for deferred data rendering.
       * @memberof oj.ojTagCloud
       * @instance
       * @type {Array.<Object>|Promise|null}
       * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojTagCloud.Item<K>>>|null",
       *                                           SetterType: "Array<oj.ojTagCloud.Item<K>>|Promise<Array<oj.ojTagCloud.Item<K>>>|null"},
       *                                           jsdocOverride: true}
       * @default null
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">items</code> attribute specified:</caption>
       * &lt;oj-tag-cloud items='[{"id": "item1", "label": "the", "value": 20},
       *                          {"id": "item2", "label": "cat", "value": 17},
       *                          {"id": "item3", "label": "hat", "value": 13}]'>&lt;/oj-tag-cloud>
       *
       * &lt;oj-tag-cloud items='[[itemsPromise]]'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">items</code>
       * property after initialization:</caption>
       *
       * // Get all (The items getter always returns a Promise so there is no "get one" syntax)
       * var values = myTagCloud.items;
       *
       * // Set all (There is no permissible "set one" syntax.)
       * myTagCloud.items=[{"id": "item1", "label": "the", "value": 20},
       *                   {"id": "item2", "label": "cat", "value": 17},
       *                   {"id": "item3", "label": "hat", "value": 13}];
       */
      items: null,
      /**
       * The layout to use for tag display.
       * @expose
       * @name layout
       * @memberof oj.ojTagCloud
       * @instance
       * @type {string=}
       * @ojvalue {string} "cloud"
       * @ojvalue {string} "rectangular"
       * @default "rectangular"
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">layout</code> attribute specified:</caption>
       * &lt;oj-tag-cloud layout='cloud'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">layout</code>
       * property after initialization:</caption>
       * // getter
       * var value = myTagCloud.layout;
       *
       * // setter
       * myTagCloud.layout="cloud";
       */
      layout: 'rectangular',
      /**
       * An array containing the ids of the initially selected data items.
       * @expose
       * @name selection
       * @memberof oj.ojTagCloud
       * @instance
       * @type {(Array.<any>)=}
       * @ojsignature [{target: "Type", value: "Array<K>"}]
       * @default []
       * @ojwriteback
       * @ojeventgroup common
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">selection</code> attribute specified:</caption>
       * &lt;oj-tag-cloud selection='["area1", "area2", "marker7"]'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">selection</code>
       * property after initialization:</caption>
       * // Get one
       * var value = myTagCloud.selection[0];
       *
       * // Get all
       * var values = myTagCloud.selection;
       *
       * // Set all (There is no permissible "set one" syntax.)
       * myTagCloud.selection=["tag2", "tag3", "tag12"];
       */
      selection: [],
      /**
       * <p>The type of selection behavior that is enabled on the tag cloud. This attribute controls the number of selections that can be made via selection gestures at any given time.
       *
       * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the tag cloud's selection styling will be applied to all items specified by the <a href="#selection">selection</a> attribute.
       * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the tag cloud's selection styling will not be applied to any items specified by the <a href="#selection">selection</a> attribute.
       *
       * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> attribute.
       *
       * @expose
       * @name selectionMode
       * @ojshortdesc Specifies the selection mode.
       * @memberof oj.ojTagCloud
       * @instance
       * @type {string=}
       * @ojvalue {string} "none" Selection is disabled.
       * @ojvalue {string} "single" Only a single item can be selected at a time.
       * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
       * @default "none"
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">selection-mode</code> attribute specified:</caption>
       * &lt;oj-tag-cloud selection-mode='multiple'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">selectionMode</code>
       * property after initialization:</caption>
       * // getter
       * var value = myTagCloud.selectionMode;
       *
       * // setter
       * myTagCloud.selectionMode="multiple";
       */
      selectionMode: 'none',
      /**
       * An object containing an optional callback function for tooltip customization.
       * @expose
       * @name tooltip
       * @memberof oj.ojTagCloud
       * @instance
       * @type {Object=}
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">tooltip</code> attribute specified:</caption>
       * <!-- Using dot notation -->
       * &lt;oj-tag-cloud tooltip.renderer='[[tooltipFun]]'>&lt;/oj-tag-cloud>
       *
       * &lt;oj-tag-cloud tooltip='[[{"renderer": tooltipFun}]]'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">tooltip</code>
       * property after initialization:</caption>
       * // Get one
       * var value = myTagCloud.tooltip.renderer;
       *
       * // Get all
       * var values = myTagCloud.tooltip;
       *
       * // Set one, leaving the others intact. Always use the setProperty API for
       * // subproperties rather than setting a subproperty directly.
       * myTagCloud.setProperty('tooltip.renderer', tooltipFun);
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myTagCloud.tooltip={'renderer': tooltipFun};
       */
      tooltip: {
        /**
         * A callback function that returns a custom tooltip. The callback function will be called with a <a href="#TooltipContext">TooltipContext</a>
         * object containing information about the item that was clicked.
         * @expose
         * @name tooltip.renderer
         * @ojshortdesc A function that returns a custom tooltip. The function takes a context argument, provided by the tag cloud. See the Help documentation for more information.
         * @memberof! oj.ojTagCloud
         * @instance
         * @type {function(Object):Object|null}
         * @default null
         * @ojsignature {target: "Type", value: "((context: oj.ojTagCloud.TooltipContext<K>) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
         *
         * @example <caption>See the <a href="#tooltip">tooltip</a> attribute for usage examples.</caption>
         */
        renderer: null
      },
      /**
       * Component CSS classes should be used to set component wide styling. This API should be used
       * only for styling a specific instance of the component. Properties specified on this object may
       * be overridden by specifications on the data item. Some property default values come from the CSS
       * and varies based on theme.
       * @expose
       * @name styleDefaults
       * @ojshortdesc An object defining the style defaults for this tag cloud.
       * @memberof oj.ojTagCloud
       * @instance
       * @type {Object=}
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">style-defaults</code> attribute specified:</caption>
       * <!-- Using dot notation -->
       * &lt;oj-tag-cloud style-defaults.animation-duration='200'>&lt;/oj-tag-cloud>
       *
       * <!-- Using JSON notation -->
       * &lt;oj-tag-cloud style-defaults='{"animationDuration": 200, "svgStyle": {"fill": "url(someURL#filterId)"}}'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">styleDefaults</code>
       * property after initialization:</caption>
       * // Get one
       * var value = myTagCloud.styleDefaults.animationDuration;
       *
       * // Get all
       * var values = myTagCloud.styleDefaults;
       *
       * // Set one, leaving the others intact. Always use the setProperty API for
       * // subproperties rather than setting a subproperty directly.
       * myTagCloud.setProperty('styleDefaults.svgStyle', {'fill': 'url(someURL#filterId)'});
       *
       * // Set all. Must list every resource key, as those not listed are lost.
       * myTagCloud.styleDefaults={'fill': 'url(someURL#filterId)'};
       */
      styleDefaults: {
        /**
         * The duration of the animations in milliseconds. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name styleDefaults.animationDuration
         * @ojshortdesc The duration of the animations in milliseconds.
         * @memberof! oj.ojTagCloud
         * @instance
         * @type {number}
         * @ojunits milliseconds
         * @ojsignature {target: "Type", value: "?"}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        animationDuration: undefined,
        /**
         * Specifies initial hover delay in milliseconds for highlighting data items.
         * @expose
         * @name styleDefaults.hoverBehaviorDelay
         * @memberof! oj.ojTagCloud
         * @instance
         * @type {number}
         * @ojunits milliseconds
         * @ojsignature {target: "Type", value: "?"}
         * @default 200
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
        hoverBehaviorDelay: 200
        /**
         * The CSS style object defining the style of the items.
         * Only SVG CSS style properties are supported.
         * @expose
         * @name styleDefaults.svgStyle
         * @ojshortdesc The CSS style object defining the style of the items.
         * @memberof! oj.ojTagCloud
         * @instance
         * @type {Object=}
         * @default {}
         * @ojsignature {target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}
         *
         * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
         */
      },
      /**
       * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on
       * mobile devices to avoid interfering with page panning, but these hold delays can make applications seem
       * slower and less responsive. For a better user experience, the application can remove the touch and hold
       * \delay when data visualizations are used within a non scrolling container or if there is sufficient space
       * outside of the visualization for panning. If touchResponse is touchStart the element will instantly trigger
       * the touch gesture and consume the page pan events. If touchResponse is auto, the element will behave like
       * touchStart if it determines that it is not rendered within scrolling content and if element panning is not
       * available for those elements that support the feature.
       * @expose
       * @name touchResponse
       * @ojshortdesc Specifies configuration options for touch and hold delays on mobile devices. See the Help documentation for more information.
       * @memberof oj.ojTagCloud
       * @instance
       * @type {string=}
       * @ojvalue {string} "touchStart"
       * @ojvalue {string} "auto"
       * @default "auto"
       *
       * @example <caption>Initialize the tag cloud with the
       * <code class="prettyprint">layout</code> attribute specified:</caption>
       * &lt;oj-tag-cloud touch-response='touchStart'>&lt;/oj-tag-cloud>
       *
       * @example <caption>Get or set the <code class="prettyprint">touchResponse</code>
       * property after initialization:</caption>
       * // getter
       * var value = myTagCloud.touchResponse;
       *
       * // setter
       * myTagCloud.touchResponse="touchStart";
       */
      touchResponse: 'auto'
    },

    _CreateDvtComponent: function (context, callback, callbackObj) {
      return new ojtagcloudToolkit.TagCloud(context, callback, callbackObj);
    },

    _ConvertLocatorToSubId: function (locator) {
      var subId = locator.subId;

      // Convert the supported locators
      if (subId === 'oj-tagcloud-item') {
        // item[index]
        subId = 'item[' + locator.index + ']';
      } else if (subId === 'oj-tagcloud-tooltip') {
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
        locator.subId = 'oj-tagcloud-item';
        locator.index = this._GetFirstIndex(subId);
      } else if (subId === 'tooltip') {
        locator.subId = 'oj-tagcloud-tooltip';
      }

      return locator;
    },

    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-tagcloud');
      return styleClasses;
    },

    _GetChildStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses['oj-dvtbase oj-tagcloud'] = {
        path: 'styleDefaults/animationDuration',
        property: 'ANIM_DUR'
      };
      styleClasses['oj-tagcloud'] = { path: 'styleDefaults/svgStyle', property: 'TEXT' };
      return styleClasses;
    },

    _GetEventTypes: function () {
      return ['optionChange'];
    },

    _InitOptions: function (originalDefaults, constructorOptions) {
      this._super(originalDefaults, constructorOptions);

      // styleDefaults subproperty defaults are dynamically generated
      // so we need to retrieve it here and override the dynamic getter by
      // setting the returned object as the new value.
      var styleDefaults = this.options.styleDefaults;
      this.options.styleDefaults = styleDefaults;
    },

    /**
     * Returns an object with the following properties for automation testing verification of the item at the
     * specified index.
     * @param {number} index The index.
     * @return {Object|null} An object containing data for the node at the given index, or null if none exists.
     * @ojsignature {target: "Type", value: "oj.ojTagCloud.ItemContext|null", jsdocOverride: true, for: "returns"}
     * @expose
     * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
     * @ojtsignore
     * @memberof oj.ojTagCloud
     * @instance
     * @ojshortdesc Returns information for automation testing verification of a specified item.
     */
    getItem: function (index) {
      var auto = this._component.getAutomation();
      return auto.getItem(index);
    },
    /**
     * Returns the number of items in the tag cloud data.
     * @return {number} The number of data items
     * @expose
     * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
     * @ojtsignore
     * @memberof oj.ojTagCloud
     * @instance
     */
    getItemCount: function () {
      return this._component.getAutomation().getItemCount();
    },

    /**
     * {@ojinclude "name":"nodeContextDoc"}
     * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
     * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
     * @ojsignature {target: "Type", value: "oj.ojTagCloud.NodeContext|null", jsdocOverride: true, for: "returns"}
     *
     * @example {@ojinclude "name":"nodeContextExample"}
     *
     * @expose
     * @instance
     * @memberof oj.ojTagCloud
     * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
     */
    getContextByNode: function (node) {
      // context objects are documented with @ojnodecontext
      var context = this.getSubIdByNode(node);
      if (context && context.subId !== 'oj-tagcloud-tooltip') {
        return context;
      }

      return null;
    },

    _GetComponentDeferredDataPaths: function () {
      return { root: ['items', 'data'] };
    },

    _GetSimpleDataProviderConfigs: function () {
      return {
        data: {
          templateName: 'itemTemplate',
          templateElementName: 'oj-tag-cloud-item',
          resultPath: 'items'
        }
      };
    }
  });

  // Conditionally set the defaults for custom element vs widget syntax since we expose different APIs
  Components.setDefaultOptions({
    ojTagCloud: {
      styleDefaults: Components.createDynamicPropertyGetter(function (context) {
        if (context.isCustomElement) {
          return { svgStyle: {} };
        }
        return {};
      })
    }
  });

});
