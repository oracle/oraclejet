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
import 'ojs/ojdvt-base';
import { Sunburst } from 'ojs/ojdvt-treeview';
import { AllKeySetImpl } from 'ojs/ojkeyset';
import { getResourceUrl } from 'ojs/ojconfig';

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
 *     <tr>
 *       <td>Outer Edge</td>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Rotate when <code class="prettyprint">rotation</code> is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojSunburst
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
 *       <td>
 *         Move focus and selection to the first adjacent sector in an inner or outer layer (ring). In
 *         the northern hemisphere of the sunburst, this will move away from the center, while it will move towards the
 *         center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>
 *         Move focus and selection to the first adjacent sector in an inner or outer layer (ring). In
 *         the northern hemisphere of the sunburst, this will move towards the center, while it will move away from the
 *         center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection counterclockwise to adjacent sector in the same layer (ring).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection clockwise to adjacent sector in the same layer (ring).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>
 *         Move focus and extend selection to the first adjacent sector in an inner or outer layer (ring). In
 *         the northern hemisphere of the sunburst, this will move away from the center, while it will move towards the
 *         center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>
 *         Move focus and extend selection to the first adjacent sector in an inner or outer layer (ring). In
 *         the northern hemisphere of the sunburst, this will move towards the center, while it will move away from the
 *         center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and extend selection counterclockwise to adjacent sector in the same layer (ring).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and extend selection clockwise to adjacent sector in the same layer (ring).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>
 *         Move focus to the first adjacent sector in an inner or outer layer (ring), without changing the
 *         current selection. In the northern hemisphere of the sunburst, this will move away from the center, while it
 *         will move towards the center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>
 *         Move focus to the first adjacent sector in an inner or outer layer (ring), without changing the
 *         current selection. In the northern hemisphere of the sunburst, this will move towards the center, while it
 *         will move away from the center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus counterclockwise to adjacent sector in the same layer (ring), without changing the current
 *       selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus clockwise to adjacent sector in the same layer (ring), without changing the current
 *       selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select sectors with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Alt + LeftArrow</kbd></td>
 *       <td>Rotate 5 degrees counterclockwise.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Alt + RightArrow</kbd></td>
 *       <td>Rotate 5 degrees clockwise.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Drill on a node when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>+</kbd></td>
 *       <td>Expand a node when <code class="prettyprint">showDisclosure</code> is enabled and the node is expandable.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>-</kbd></td>
 *       <td>Collapse a node when <code class="prettyprint">showDisclosure</code> is enabled and the node is collapsable.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojSunburst
 */

// PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojSunburst.Node
 * @property {string=} borderColor The border color of the node.
 * @property {number=} borderWidth The border width of the node.
 * @property {Array.<string>=} categories An optional array of category strings corresponding to this data item.
 * This enables highlighting and filtering of individual data items through interactions with the legend and other visualization elements.
 * The categories array of each node is required to be a superset of the categories array of its parent node. If not specified, the ids of the node and its ancestors will be used.
 * @property {string=} color The fill color of the node.
 * @property {("inherit"|"off"|"on")=} [drilling="inherit"] Specifies whether drilling is enabled for the node. Drillable nodes will show a pointer cursor
 * on hover and fire an ojDrill event on click (double click if selection is enabled). To enable drilling for all nodes at once, use the drilling attribute in the top level.
 * @property {any=} id The id of the node. For the DataProvider case, the key for the node will be used as the id.
 * @property {string=} label The label for this node.
 * @property {("auto"|"horizontal"|"off"|"rotated")=} [labelDisplay="auto"] The label display behavior for the nodes. More labels are generally displayed when using rotation,
 * with the trade off of readability. When auto is used, rotated or horizontal labels will be used based on the client browser and platform.
 * @property {("center"|"inner"|"outer")=} [labelHalign="center"] The horizontal alignment for labels displayed within the node. Only applies to rotated text.
 * @property {Object=} labelStyle The CSS style object defining the style of the label. The following style properties are supported: color, cursor, fontFamily, fontSize,
 * fontStyle, fontWeight, textDecoration. The default value comes from the CSS and varies based on theme. The default value comes from the CSS and varies based on theme.
 * @property {Array.<Object>=} nodes An array of objects with properties for the child nodes.
 * @property {("largeChecker"|"largeCrosshatch"|"largeDiagonalLeft"|"largeDiagonalRight"|"largeDiamond"|"largeTriangle"|"none"|"smallChecker"|"smallCrosshatch"|"smallDiagonalLeft"|"smallDiagonalRight"|"smallDiamond"|"smallTriangle")=} [pattern="none"] The pattern used to fill the node.
 * @property {number=} radius The radius of the node relative to the other nodes.
 * @property {("auto"|"off")=} [selectable="auto"] Specifies whether or not the node will be selectable.
 * @property {(string|function)=} shortDesc The description of this element. Will be lazily created if a function is used.  This is used for accessibility and also for customizing the tooltip text.
 * @property {("inherit"|"off"|"on")=} [showDisclosure="inherit"] Specifies whether to display the expand/collapse button on hover for a specific node.
 * If the button is clicked, the expanded attribute is updated with the new array of node ids.
 * @property {string=} svgClassName The CSS style class to apply to the node. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @property {Object=} svgStyle The inline style to apply to the node. The style class and inline style will override any other styling specified through the properties.
 * For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute. Only SVG CSS style properties are supported.
 * The default value comes from the CSS and varies based on theme.
 * @property {number} value The value of the node, which determines the relative size of the node.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "Array.<oj.ojSunburst.Node<K>>=", for: "nodes"},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "labelStyle", jsdocOverride: true},
 *               {target: "Type", value: "Partial<CSSStyleDeclaration>", for: "svgStyle", jsdocOverride: true},
 *               {target: "Type", value: "?(string | ((context: oj.ojSunburst.NodeShortDescContext<K,D>) => string))", jsdocOverride: true, for: "shortDesc"},
 *               {target: "Type", value: "<K,D=any>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojSunburst.RootNodeContext
 * @property {object} outerBounds Object containing information on the rectangle circumscribing the root node area.
 * The x and y coordinates are relative to the top, left corner of the element.
 * @property {number} outerBounds.x The x coordinate relative to the top, left corner of the element.
 * @property {number} outerBounds.y The y coordinate relative to the top, left corner of the element.
 * @property {number} outerBounds.width The width of the rectangle circumscribing the root node area.
 * @property {number} outerBounds.height The height of the rectangle circumscribing the root node area.
 * @property {object} innerBounds Object containing information on the rectangle inscribed in the root node area.
 * The x and y coordinates are relative to the top, left corner of the element.
 * @property {number} innerBounds.x The x coordinate relative to the top, left corner of the element.
 * @property {number} innerBounds.y The y coordinate relative to the top, left corner of the element.
 * @property {number} innerBounds.width The width of the rectangle inscribed in the root node area.
 * @property {number} innerBounds.height The height of the rectangle inscribed in the root node area.
 * @property {any} id The id of the root node.
 * @property {Object} data The data object of the root node.
 * @property {Object} itemData The row data object for the root node. This will only be set if a DataProvider is being used.
 * @property {Element} componentElement The sunburst element.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "ojSunburst.Node<K>", for:"data"},
 *               {target: "Type", value: "D", for: "itemData"},
 *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojSunburst.TooltipContext
 * @property {Element} parentElement The tooltip element. The function can directly modify or append content to this element.
 * @property {any} id The id of the hovered node.
 * @property {string} label The label of the hovered node.
 * @property {number} value The value of the hovered node.
 * @property {number} radius The radius of the hovered node.
 * @property {string} color The color of the hovered node.
 * @property {Object} data The data object of the hovered node.
 * @property {Object} itemData The row data object for the hovered node. This will only be set if a DataProvider is being used.
 * @property {Element} componentElement The sunburst element.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "ojSunburst.Node<K>", for:"data"},
 *               {target: "Type", value: "D", for: "itemData"},
 *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
 */

/**
 * @typedef {Object} oj.ojSunburst.NodeShortDescContext
 * @property {any} id The id of the hovered node.
 * @property {string} label The label of the hovered node.
 * @property {number} value The value of the hovered node.
 * @property {Object} data The data object of the hovered node.
 * @property {Object} itemData The row data object for the hovered node. This will only be set if a DataProvider is being used.
 * @ojsignature [{target: "Type", value: "K", for: "id"},
 *               {target: "Type", value: "ojSunburst.Node<K>", for:"data"},
 *               {target: "Type", value: "D", for: "itemData"},
 *               {target: "Type", value: "<K,D>", for: "genericTypeParameters"}]
 */

// METHOD TYPEDEFS
/**
 * @typedef {Object} oj.ojSunburst.NodeContext
 * @property {string} subId The subId string to identify the particular DOM node.
 * @property {Array.<number>} indexPath The array of numerical indices for the node.
 */

/**
 * @typedef {Object} oj.ojSunburst.DataContext
 * @property {string} color The fill color of the node.
 * @property {string} label The label for this node.
 * @property {boolean} selected True is the node is selected, false otherwise
 * @property {number} size The relative size of the node.
 * @property {string} tooltip The tooltip string.
 */

/**
 * @typedef {Object} oj.ojSunburst.NodeTemplateContext
 * @property {Element} componentElement The &lt;oj-sunburst> custom element
 * @property {Object} data The data object of the node
 * @property {number} index The zero-based index of the current node
 * @property {any} key The key of the current node
 * @property {Array} parentData  An array of data objects of the outermost to innermost parents of the node
 * @property {any} parentKey  The key of the parent node
 */

// Slots
/**
 * <p>
 *  The <code class="prettyprint">nodeTemplate</code> slot is used to specify the template for
 *  creating nodes of the sunburst. The slot content must be wrapped in a single &lt;template>
 *  element. The content of the template should be a single &lt;oj-sunburst-node> element.
 *  See the [oj-sunburst-node]{@link oj.ojSunburstNode} doc for more details.
 * </p>
 * <p>
 *  When the template is executed for each node, it will have access to the components's
 *  binding context containing the following properties:
 * </p>
 * <ul>
 *   <li>
 *      $current - an object that contains information for the current node. (See [oj.ojSunburst.NodeTemplateContext]{@link oj.ojSunburst.NodeTemplateContext}
 *      or the table below for a list of properties available on $current)
 *   </li>
 *   <li>
 *      alias - if 'as' attribute was specified, the value will be used to provide an
 *      application-named alias for $current.
 *   </li>
 * </ul>
 *
 * @ojslot nodeTemplate
 * @ojshortdesc The nodeTemplate slot is used to specify the template for creating nodes of the sunburst. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojSunburst
 * @ojtemplateslotprops oj.ojSunburst.NodeTemplateContext
 * @ojpreferredcontent ["SunburstNodeElement"]
 *
 * @example <caption>Initialize the sunburst with an inline node template specified:</caption>
 * &lt;oj-sunburst data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate'>
 *    &lt;oj-sunburst-node value='[[$current.data.value]]' color='[[$current.data.color]]'>
 *    &lt;/oj-sunburst-node>
 *  &lt;/template>
 * &lt;/oj-sunburst>
 */

/**
 * <p>The <code class="prettyprint">rootNodeContentTemplate</code> slot is used to specify custom root node content
 * for a sunburst. The slot content must be a single &lt;template> element. This slot takes precedence over the rootNodeContent.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the root node. (See [oj.ojSunburst.RootNodeContext]{@link oj.ojSunburst.RootNodeContext}
 *    or the table below for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 *
 * @ojslot rootNodeContentTemplate
 * @ojmaxitems 1
 * @ojshortdesc The rootNodeContentTemplate slot is used to specify custom root node content for a sunburst. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojSunburst.RootNodeContext
 * @memberof oj.ojSunburst
 *
 * @example <caption>Initialize the Sunburst with a root node content template specified:</caption>
 * &lt;oj-sunburst>
 *  &lt;template slot="rootNodeContentTemplate">
 *    &lt;div :style="[[{position: 'absolute',
 *                       top: $current.innerBounds.y + 'px',
 *                       left: $current.innerBounds.x + 'px',
 *                       height: $current.innerBounds.height + 'px',
 *                       width: $current.innerBounds.width + 'px'}]]">
 *      &lt;span>&lt;oj-bind-text value="[[$current.data.label + ': ' + $current.data.value]]">&lt;/oj-bind-text>&lt;/span>
 *    &lt;/div>
 *  &lt;/template>
 * &lt;/oj-sunburst>
 */

/**
 * <p>The <code class="prettyprint">tooltipTemplate</code> slot is used to specify custom tooltip content. The slot content must be a single &lt;template> element.
 * This slot takes precedence over the tooltip.renderer property if specified.
 * <p>When the template is executed, the component's binding context is extended with the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current node. (See [oj.ojSunburst.TooltipContext]{@link oj.ojSunburst.TooltipContext}
 *   or the table below for a list of properties available on $current)
 *   </li>
 * </ul>
 *
 *
 * @ojslot tooltipTemplate
 * @ojshortdesc The tooltipTemplate slot is used to specify custom tooltip content. See the Help documentation for more information.
 * @ojtemplateslotprops oj.ojSunburst.TooltipContext
 * @ojmaxitems 1
 * @memberof oj.ojSunburst
 *
 * @example <caption>Initialize the Sunburst with a tooltip template specified:</caption>
 * &lt;oj-sunburst>
 *  &lt;template slot="tooltipTemplate">
 *    &lt;span>&lt;oj-bind-text value="[[$current.label + ': ' + $current.value]]">&lt;/oj-bind-text>&lt;/span>
 *  &lt;/template>
 * &lt;/oj-sunburst>
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for sunburst nodes indexed by their position in the hierarchy.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the node.
 *
 * @ojsubid oj-sunburst-node
 * @memberof oj.ojSunburst
 *
 * @example <caption>Get the node at index 0 in the first layer, index 1 in the second:</caption>
 * var nodes = mySunburst.getNodeBySubId( {'subId': 'oj-sunburst-node', 'indexPath': [0, 1]} );
 */

/**
 * <p>Sub-ID for the the sunburst tooltip.</p>
 *
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 *
 * @ojsubid
 * @member
 * @name oj-sunburst-tooltip
 * @memberof oj.ojSunburst
 * @instance
 *
 * @example <caption>Get the tooltip object of the sunburst, if displayed:</caption>
 * var nodes = mySunburst.getNodeBySubId( {'subId': 'oj-sunburst-tooltip'} );
 */
// Node Context Objects ********************************************************

/**
 * <p>Context for sunburst nodes indexed by their position in the hierarchy.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the node.
 *
 * @ojnodecontext oj-sunburst-node
 * @memberof oj.ojSunburst
 */

/**
 * @ojcomponent oj.ojSunburstNode
 * @ojshortdesc The oj-sunburst-node element is used to declare properties for sunburst nodes. See the Help documentation for more information.
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojSunburstNode<K=any, D=any> extends dvtBaseComponent<ojSunburstNodeSettableProperties<K, D>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojSunburstNodeSettableProperties<K=any, D=any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @ojslotcomponent
 * @ojsubcomponenttype data
 * @since 6.0.0
 *
 *
 * @classdesc
 * <h3 id="overview">
 *   JET Sunburst Node
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#overview"></a>
 * </h3>
 *
 * <p>
 *  The oj-sunburst-node element is used to declare properties for sunburst nodes and is only valid as the
 *  child of a template element for the [nodeTemplate]{@link oj.ojSunburst#nodeTemplate}
 *  slot of oj-sunburst.
 * </p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-sunburst data='[[dataProvider]]'>
 *  &lt;template slot='nodeTemplate'>
 *    &lt;oj-sunburst-node  value='[[$current.data.value]]' color='[[$current.data.color]]'>
 *    &lt;/oj-sunburst-node>
 *  &lt;/template>
 * &lt;/oj-sunburst>
 * </code>
 * </pre>
 */

/**
 * The border color of the node.
 * @expose
 * @name borderColor
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {string=}
 * @ojformat color
 */
/**
 * The border width of the node.
 * @expose
 * @name borderWidth
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {number=}
 * @ojunits pixels
 */
/**
 * An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through
 * interactions with the legend and other visualization elements. The categories array of each node is required to be a superset of the categories
 * array of its parent node. If not specified, the ids of the node and its ancestors will be used.
 * @expose
 * @name categories
 * @ojshortdesc An optional array of category strings corresponding to this data item. See the Help documentation for more information.
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {Array.<string>=}
 * @default []
 */
/**
 * The value of the node, which determines the relative size of the node.
 * @expose
 * @name value
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {number}
 */
/**
 * The fill color of the node.
 * @expose
 * @name color
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {string=}
 * @ojformat color
 * @default "#000000"
 */
/**
 * The CSS style class to apply to the node. The style class and inline style will override any other styling specified through the properties.
 * For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @expose
 * @name svgClassName
 * @ojshortdesc The CSS style class to apply to the node. See the Help documentation for more information.
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {string=}
 * @default ""
 */
/**
 * The inline style to apply to the node. The style class and inline style will override any other styling specified through the properties.
 * For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * Only SVG CSS style properties are supported. The default value comes from the CSS and varies based on theme.
 * @expose
 * @name svgStyle
 * @ojshortdesc The inline style to apply to the node. See the Help documentation for more information.
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {Object=}
 * @ojsignature [{target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}]
 * @default {}
 */
/**
 * The label for this node.
 * @expose
 * @name label
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {string=}
 * @default ""
 */
/**
 * The horizontal alignment for labels displayed within the node. Only applies to rotated text.
 * @expose
 * @name labelHalign
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "inner"
 * @ojvalue {string} "outer"
 * @ojvalue {string} "center"
 */
/**
 * Specifies whether or not the node will be selectable.
 * @expose
 * @name selectable
 * @ojshortdesc Specifies whether the node will be selectable.
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The description of this element. Will be lazily created if a function is used.  This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name shortDesc
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {(string|function)=}
 * @default ""
 * @ojsignature [{target: "Type", value: "?(string | ((context: oj.ojSunburst.NodeShortDescContext<K,D>) => string))", jsdocOverride: true}]
 */
/**
 * The pattern used to fill the node.
 * @expose
 * @name pattern
 * @memberof! oj.ojSunburstNode
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
 * The CSS style object defining the style of the label.
 * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
 * The default value comes from the CSS and varies based on theme.
 * @expose
 * @name labelStyle
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {Object=}
 * @ojsignature [{target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}]
 */
/**
 * Specifies whether to display the expand/collapse button on hover for a specific node. If the button is clicked, the expanded attribute is updated with the new array of node ids.
 * @expose
 * @name showDisclosure
 * @ojshortdesc Specifies whether to display the expand/collapse button on hover.
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * The label display behavior for the nodes. More labels are generally displayed when using rotation, with the trade off of readability.
 * When auto is used, rotated or horizontal labels will be used based on the client browser and platform.
 * @expose
 * @name labelDisplay
 * @ojshortdesc The label display behavior for the nodes. See the Help documentation for more information.
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "horizontal"
 * @ojvalue {string} "rotated"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 */
/**
 * Specifies whether drilling is enabled for the node. Drillable nodes will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all nodes at once, use the drilling attribute in the top level.
 * @expose
 * @name drilling
 * @ojshortdesc Specifies whether drilling is enabled for the node. See the Help documentation for more information.
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {string=}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * The radius of the node relative to the other nodes.
 * @expose
 * @name radius
 * @memberof! oj.ojSunburstNode
 * @instance
 * @type {number=}
 */

var __oj_sunburst_metadata = 
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
    "expanded": {
      "type": "KeySet",
      "writeback": true
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
    "highlightMode": {
      "type": "string",
      "enumValues": [
        "categories",
        "descendants"
      ],
      "value": "categories"
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
    "nodeDefaults": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "borderWidth": {
          "type": "number",
          "value": 1
        },
        "hoverColor": {
          "type": "string"
        },
        "labelDisplay": {
          "type": "string",
          "enumValues": [
            "auto",
            "horizontal",
            "off",
            "rotated"
          ],
          "value": "auto"
        },
        "labelHalign": {
          "type": "string",
          "enumValues": [
            "center",
            "inner",
            "outer"
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
        "selectedInnerColor": {
          "type": "string"
        },
        "selectedOuterColor": {
          "type": "string"
        },
        "showDisclosure": {
          "type": "string",
          "enumValues": [
            "off",
            "on"
          ],
          "value": "off"
        }
      }
    },
    "nodes": {
      "type": "Array<Object>|Promise"
    },
    "rootNode": {
      "type": "any",
      "value": ""
    },
    "rootNodeContent": {
      "type": "object",
      "properties": {
        "renderer": {
          "type": "function"
        }
      }
    },
    "rotation": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "on"
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
    "startAngle": {
      "type": "number",
      "writeback": true,
      "value": 90
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
        "tooltipCollapse": {
          "type": "string"
        },
        "tooltipExpand": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getContextByNode": {},
    "getNode": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojBeforeCollapse": {},
    "ojBeforeDrill": {},
    "ojBeforeExpand": {},
    "ojCollapse": {},
    "ojDrill": {},
    "ojExpand": {},
    "ojRotateInput": {}
  },
  "extension": {}
};
/* global __oj_sunburst_metadata:false */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  __oj_sunburst_metadata.extension._WIDGET_NAME = 'ojSunburst';
  oj.CustomElementBridge.register('oj-sunburst', { metadata: __oj_sunburst_metadata });
})();

var __oj_sunburst_node_metadata = 
{
  "properties": {
    "borderColor": {
      "type": "string"
    },
    "borderWidth": {
      "type": "number"
    },
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
    "label": {
      "type": "string",
      "value": ""
    },
    "labelDisplay": {
      "type": "string",
      "enumValues": [
        "auto",
        "horizontal",
        "off",
        "rotated"
      ]
    },
    "labelHalign": {
      "type": "string",
      "enumValues": [
        "center",
        "inner",
        "outer"
      ]
    },
    "labelStyle": {
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
    "radius": {
      "type": "number"
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
      "type": "string|function",
      "value": ""
    },
    "showDisclosure": {
      "type": "string",
      "enumValues": [
        "inherit",
        "off",
        "on"
      ],
      "value": "inherit"
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
/* global __oj_sunburst_node_metadata:false */
(function () {
  __oj_sunburst_node_metadata.extension._CONSTRUCTOR = function () {};
  oj.CustomElementBridge.register('oj-sunburst-node', {
    metadata: __oj_sunburst_node_metadata
  });
})();

/**
 * @ojcomponent oj.ojSunburst
 * @augments oj.dvtBaseComponent
 * @since 0.7.0
 * @ojimportmembers oj.ojSharedContextMenu
 * @ojrole application
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
 * @ojtsimport {module: "ojkeyset", imported:["KeySet"], type: "AMD"}
 * @ojshortdesc A sunburst is an interactive data visualization in which hierarchical data is represented in concentric rings.
 * Each ring segment is proportionally sized relative to the other segments at a given level.
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojSunburst<K, D extends oj.ojSunburst.Node<K>|any> extends dvtBaseComponent<ojSunburstSettableProperties<K, D>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojSunburstSettableProperties<K, D extends oj.ojSunburst.Node<K>|any> extends dvtBaseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }
 *              ]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["colorLabel", "sizeLabel", "nodeDefaults.labelDisplay", "nodeDefaults.labelHalign", "animationOnDataChange",
 * "animationOnDisplay", "startAngle", "style"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["data", "selection"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 6
 *
 * @ojoracleicon 'oj-ux-ico-sunburst'
 * @ojuxspecs ['data-visualization-sunburst']
 *
 * @classdesc
 * <h3 id="sunburstOverview-section">
 *   JET Sunburst
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sunburstOverview-section"></a>
 * </h3>
 *
 * <p>Sunbursts are used to display hierarchical data across two dimensions, represented by
 * the size and color of the sunburst nodes.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-sunburst
 *    data='[[treeDataProvider]]'>
 * &lt;/oj-sunburst>
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
 * <p>As a rule of thumb, it's recommended that applications only set usable data densities on this element.
 *    Applications can enable progressive reveal of data through drilling or aggregate small nodes to reduce the
 *    displayed data set size.
 * </p>
 *
 * <h4>Styling</h4>
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">nodeDefaults</code>, instead of styling properties
 *    on the individual nodes. The sunburst can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojSunburst', $.oj.dvtBaseComponent, {
  widgetEventPrefix: 'oj',
  options: {
    /**
     * Specifies the animation duration in milliseconds. For data change animations with multiple stages,
     * this attribute defines the duration of each stage. For example, if an animation contains two stages,
     * the total duration will be two times this attribute's value. The default value comes from the CSS and varies based on theme.
     * @expose
     * @name animationDuration
     * @ojshortdesc Specifies the animation duration in milliseconds. For data change animations with multiple stages, the value specifies the duration of each stage.
     * @memberof oj.ojSunburst
     * @instance
     * @type {number=}
     * @ojunits milliseconds
     */
    animationDuration: undefined,

    /**
     * Specifies the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojSunburst
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
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
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
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @ojformat color
     * @default ""
     */
    animationUpdateColor: '',

    /**
     * An alias for the $current context variable passed to slot content for the nodeTemplate slot.
     * @expose
     * @name as
     * @ojshortdesc An alias for the '$current' context variable passed to slot content for the nodeTemplate slot.
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @default ""
     * @ojdeprecated {since: '6.2.0', description: 'Set the alias directly on the template element using the data-oj-as attribute instead.'}
     */
    as: '',

    /**
     * The DataProvider for the nodes of the sunburst. It should provide a data tree where each node in the data tree corresponds to a node in the sunburst.
     * The row key will be used as the id for sunburst nodes. Note that when
     * using this attribute, a template for the <a href="#nodeTemplate">nodeTemplate</a> slot should be provided.
     * The DataProvider can either have an arbitrary data shape, in which case an <oj-sunburst-node> element must be specified in the itemTemplate slot
     * or it can have [oj.ojSunburst.Node]{@link oj.ojSunburst.Node} as its data shape, in which case no template is required.
     * @expose
     * @name data
     * @ojshortdesc Specifies the DataProvider for the sunburst. See the Help documentation for more information.
     * @memberof oj.ojSunburst
     * @instance
     * @type {Object|null}
     * @ojsignature {target: "Type", value: "DataProvider<K, D>|null", jsdocOverride:true}
     * @default null
     * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
     *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
     *
     * @example <caption>Initialize the sunburst with the
     * <code class="prettyprint">data</code> attribute specified:</caption>
     * &lt;oj-sunburst data='[[dataProvider]]'>&lt;/oj-sunburst>
     *
     * @example <caption>Get or set the <code class="prettyprint">data</code>
     * property after initialization:</caption>
     * // getter
     * var value = mySunburst.data;
     *
     * // setter
     * mySunburst.data = dataProvider;
     */
    data: null,

    /**
     * The number of levels of nodes to display. By default all nodes are displayed.
     * @expose
     * @name displayLevels
     * @memberof oj.ojSunburst
     * @instance
     * @type {number=}
     * @default Number.MAX_VALUE
     */
    displayLevels: Number.MAX_VALUE,

    /**
     * Specifies the key set containing the ids of sunburst nodes that should be expanded on initial render.
     * Use the <a href="KeySetImpl.html">KeySetImpl</a> class to specify nodes to expand.
     * Use the <a href="AllKeySetImpl.html">AllKeySetImpl</a> class to expand all nodes.
     * By default, all sunburst nodes are expanded.
     * @expose
     * @name expanded
     * @ojshortdesc Specifies the key set containing the ids of sunburst nodes that should be expanded on initial render. See the Help documentation for more information.
     * @memberof oj.ojSunburst
     * @instance
     * @type {KeySet=}
     * @ojsignature {target:"Type", value:"oj.KeySet<K>"}
     * @default new AllKeySetImpl()
     * @ojwriteback
     */
    expanded: new AllKeySetImpl(),

    /**
     * An array of category strings used for filtering. Nodes with any category matching an item in this array will be filtered.
     * @expose
     * @name hiddenCategories
     * @memberof oj.ojSunburst
     * @instance
     * @type {Array.<string>=}
     * @default []
     * @ojwriteback
     */
    hiddenCategories: [],

    /**
     * An array of category strings used for highlighting. Nodes matching categories in this array will be highlighted.
     * @expose
     * @name highlightedCategories
     * @memberof oj.ojSunburst
     * @instance
     * @type {Array.<string>=}
     * @default []
     * @ojwriteback
     */
    highlightedCategories: [],

    /**
     * The matching condition for the highlightedCategories property. By default, highlightMatch is 'all'
     * and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted.
     * If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     * @expose
     * @name highlightMatch
     * @ojshortdesc The matching condition for the highlightedCategories property. See the Help documentation for more information.
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @ojvalue {string} "any"
     * @ojvalue {string} "all"
     * @default "all"
     */
    highlightMatch: 'all',

    /**
     * Controls which nodes are highlighted when hoverBehavior is set to 'dim'.
     * If highlight-mode is set to 'categories', nodes with the same category as the hovered node will be highlighted.
     * If highlight-mode is set to 'descendants', descendants of the hovered node will be highlighted; the highlighted-categories attribute will also be ignored in this case.
     * If hover-behavior is set to 'none', highlighting can only be done by setting highlight-mode to 'categories' and populating the highlighted-categories attribute.
     * @expose
     * @name highlightMode
     * @ojshortdesc Specifies whether the highlight-mode should be by category or descendants.
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @ojvalue {string} "categories"
     * @ojvalue {string} "descendants"
     * @default "categories"
     */
    highlightMode: 'categories',

    /**
     * Defines the behavior applied when hovering over the nodes.
     * @expose
     * @name hoverBehavior
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @ojvalue {string} "dim"
     * @ojvalue {string} "none"
     * @default "none"
     */
    hoverBehavior: 'none',

    /**
     * Specifies initial hover delay in milliseconds for highlighting nodes.
     * @expose
     * @name hoverBehaviorDelay
     * @memberof oj.ojSunburst
     * @instance
     * @type {number=}
     * @default 200
     * @ojunits milliseconds
     */
    hoverBehaviorDelay: 200,

    /**
     * An object containing an optional callback function for tooltip customization.
     * @expose
     * @name tooltip
     * @memberof oj.ojSunburst
     * @instance
     * @type {Object=}
     */
    tooltip: {
      /**
       * A function that returns a custom tooltip. The function takes a <a href="#TooltipContext">TooltipContext</a> argument,
       * provided by the sunburst. The function should return an Object that contains only one of the two properties:
       * <ul>
       *   <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li>
       *   <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return
       *    {preventDefault:false} to display tooltip, since this is a default behavior.
       *   </li>
       * </ul>
       *
       * @expose
       * @name tooltip.renderer
       * @ojshortdesc A function that returns a custom tooltip. The function takes a context argument, provided by the sunburst. See the Help documentation for more information.
       * @memberof! oj.ojSunburst
       * @instance
       * @type {function(Object):Object|null}
       * @default null
       * @ojsignature {target: "Type", value: "((context: oj.ojSunburst.TooltipContext<K, D>) => ({insert: Element|string}|{preventDefault: boolean}))", jsdocOverride: true}
       */
      renderer: null
    },
    /**
     * <p>The type of selection behavior that is enabled on the sunburst. This attribute controls the number of selections that can be made via selection
     * gestures at any given time.
     *
     * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled,
     * and the sunburst's selection styling will be applied to all items specified by the <a href="#selection">selection</a> attribute.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the sunburst's selection styling will not be
     * applied to any items specified by the <a href="#selection">selection</a> attribute.
     *
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> attribute.
     *
     * @expose
     * @name selectionMode
     * @memberof oj.ojSunburst
     * @ojshortdesc Specifies the selection behavior on the sunburst. See the Help documentation for more information.
     * @instance
     * @type {string=}
     * @ojvalue {string} "none" Selection is disabled.
     * @ojvalue {string} "single" Only a single item can be selected at a time.
     * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
     * @default "multiple"
     */
    selectionMode: 'multiple',

    /**
     * Specifies whether client side rotation is enabled.
     * @expose
     * @name rotation
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @ojvalue {string} "off"
     * @ojvalue {string} "on"
     * @default "on"
     */
    rotation: 'on',

    /**
     * Specifies whether the nodes are sorted by size. When sorting is enabled, nodes that have the same parent are sorted in order of descending size.
     * @expose
     * @name sorting
     * @ojshortdesc Specifies whether the nodes are sorted by size. Nodes with the same parent are sorted in order of descending size.
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     */
    sorting: 'off',

    /**
     * An object defining custom root node content for the sunburst.
     * @expose
     * @name rootNodeContent
     * @memberof oj.ojSunburst
     * @instance
     * @type {Object=}
     */
    rootNodeContent: {
      /**
       * A function that returns custom root node content. The function takes a <a href="#RootNodeContext">RootNodeContext</a> argument,
       * provided by the sunburst. The function should return an Object with the following property:
       * <ul>
       *    <li>insert: HTMLElement - HTML element, which will be overlaid on top of the sunburst.
       *    This HTML element will block interactivity of the sunburst by default, but the CSS pointer-events
       *    property can be set to 'none' on this element if the sunburst's interactivity is desired.
       *    </li>
       * </ul>
       *
       * @expose
       * @name rootNodeContent.renderer
       * @ojshortdesc A function that returns custom root node content. The function takes a context argument, provided by the sunburst.
       * See the Help documentation for more information.
       * @memberof! oj.ojSunburst
       * @instance
       * @type {function(Object):Object|null}
       * @default null
       * @ojsignature {target: "Type", value: "((context: oj.ojSunburst.RootNodeContext<K, D>) => ({insert: Element|string}))", jsdocOverride: true}
       */
      renderer: null
    },

    /**
     * Specifies the starting angle of the sunburst. Valid values are numbers between 0 and 360.
     * @expose
     * @name startAngle
     * @memberof oj.ojSunburst
     * @instance
     * @type {number=}
     * @default 90
     * @ojunits degrees
     * @ojmin 0
     * @ojmax 360
     * @ojwriteback
     */
    startAngle: 90,

    /**
     * Specifies the label describing the color metric of the sunburst. This label will be used in the legend.
     * @expose
     * @name colorLabel
     * @ojshortdesc Specifies the label displayed in the legend describing the color metric of the sunburst.
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @ojtranslatable
     * @default ""
     */
    colorLabel: '',

    /**
     * Specifies the label describing the size metric of the sunburst. This label will be used in the legend.
     * @expose
     * @name sizeLabel
     * @ojshortdesc Specifies the label used in the legend describing the size metric of the sunburst.
     * @ojtranslatable
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @default ""
     */
    sizeLabel: '',

    /**
     * Specifies whether drilling is enabled. Drillable nodes will show a pointer cursor on hover and fire an <code class="prettyprint">ojBeforeDrill</code>
     * and <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). Drilling on a node causes a property change to the rootNode attribute.
     * The displayLevels attribute can be used in conjunction with drilling to display very deep hieracrchies. Use "on" to enable drilling for all nodes.
     * To enable or disable drilling on individual nodes use the drilling attribute in each node.
     * @expose
     * @name drilling
     * @ojshortdesc Specifies whether drilling is enabled. Drillable nodes will show a pointer cursor on hover and fire ojBeforeDrill and ojDrill
     * events on click (double click if selection is enabled). See the Help documentation for more information.
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     */
    drilling: 'off',

    /**
     * The id of the root node. When specified, only the root node and children of the root will be displayed.
     * @expose
     * @name rootNode
     * @memberof oj.ojSunburst
     * @instance
     * @type {any=}
     * @default ""
     */
    rootNode: '',

    /**
     * An array of objects with the following properties that defines the data for the nodes. Also accepts a Promise for deferred data rendering.
     * No data will be rendered if the Promise is rejected.
     * @expose
     * @ojtsignore
     * @name nodes
     * @ojshortdesc An array of objects defining the data for the nodes. Also accepts a Promise for deferred data rendering.
     * @memberof oj.ojSunburst
     * @instance
     * @type {(Array.<Object>|Promise|null)=}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojSunburst.Node<K>>>|null",
     *                                           SetterType: "Array<oj.ojSunburst.Node<K>>|Promise<Array<oj.ojSunburst.Node<K>>>|null"},
     *                                           jsdocOverride: true}
     * @default null
     */
    nodes: null,

    /**
     * An object defining default properties for the nodes. Component CSS classes should be used to set component wide styling.
     * This API should be used only for styling a specific instance of the component. Properties specified on this object may
     * be overridden by specifications on the sunburst nodes. Some property default values come from the CSS and varies based on theme.
     * @expose
     * @name nodeDefaults
     * @ojshortdesc An object defining default properties for the nodes. See the Help documentation for more information.
     * @memberof oj.ojSunburst
     * @instance
     * @type {Object=}
     */
    nodeDefaults: {
      /**
       * The default border color of the nodes.
       * @expose
       * @name nodeDefaults.borderColor
       * @memberof! oj.ojSunburst
       * @instance
       * @type {string=}
       * @ojformat color
       */
      borderColor: 'rgba(255,255,255,0.3)',

      /**
       * The default border width of the nodes.
       * @expose
       * @name nodeDefaults.borderWidth
       * @memberof! oj.ojSunburst
       * @instance
       * @type {number=}
       * @default 1
       * @ojunits pixels
       */
      borderWidth: 1,

      /**
       * Specifies whether to display the expand/collapse button on hover. If the button is clicked, the expanded attribute is updated with the new array of node ids.
       * @expose
       * @name nodeDefaults.showDisclosure
       * @ojshortdesc Specifies whether to display the expand/collapse button on hover.
       * @memberof! oj.ojSunburst
       * @instance
       * @type {string=}
       * @ojvalue {string} "on"
       * @ojvalue {string} "off"
       * @default "off"
       */
      showDisclosure: 'off',

      /**
       * The horizontal alignment for labels displayed within the node. Only applies to rotated text.
       * @expose
       * @name nodeDefaults.labelHalign
       * @memberof! oj.ojSunburst
       * @instance
       * @type {string=}
       * @ojvalue {string} "inner"
       * @ojvalue {string} "outer"
       * @ojvalue {string} "center"
       * @default "center"
       */
      labelHalign: 'center',

      /**
       * The CSS style object defining the style of the label.
       * The following style properties are supported: color, cursor, fontFamily, fontSize, fontStyle, fontWeight, textDecoration.
       * The default value comes from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults.labelStyle
       * @ojshortdesc The CSS style object defining the style of the label.
       * @memberof! oj.ojSunburst
       * @instance
       * @type {Object=}
       * @ojsignature [{target: "Type", value: "Partial<CSSStyleDeclaration>", jsdocOverride: true}]
       */
      labelStyle: undefined,

      /**
       * The minimum number of visible characters needed in order to render a truncated label.
       * If the minimum is not met when calculating the truncated label then
       * the label is not displayed.
       * @expose
       * @name nodeDefaults.labelMinLength
       * @ojshortdesc The minimum number of visible characters needed to render a truncated label. See the Help documentation for more information.
       * @memberof! oj.ojSunburst
       * @instance
       * @type {number=}
       * @default 1
       */
      labelMinLength: 1,

      /**
       * The label display behavior for the nodes. More labels are generally displayed when using rotation, with the trade off of readability.
       * When auto is used, rotated or horizontal labels will be used based on the client browser and platform.
       * @expose
       * @name nodeDefaults.labelDisplay
       * @ojshortdesc The label display behavior for the nodes. See the Help documentation for more information.
       * @memberof! oj.ojSunburst
       * @instance
       * @type {string=}
       * @ojvalue {string} "horizontal"
       * @ojvalue {string} "rotated"
       * @ojvalue {string} "off"
       * @ojvalue {string} "auto"
       * @default "auto"
       */
      labelDisplay: 'auto',

      /**
       * The color of the node hover feedback. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults.hoverColor
       * @ojshortdesc The color of the node hover feedback.
       * @memberof! oj.ojSunburst
       * @instance
       * @type {string=}
       * @ojformat color
       */
      hoverColor: undefined,

      /**
       * The inner color of the node selection feedback. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults.selectedInnerColor
       * @ojshortdesc The inner color of the node selection feedback.
       * @memberof! oj.ojSunburst
       * @instance
       * @type {string=}
       * @ojformat color
       */
      selectedInnerColor: undefined,

      /**
       * The outer color of the node selection feedback. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults.selectedOuterColor
       * @ojshortdesc The outer color of the node selection feedback.
       * @memberof! oj.ojSunburst
       * @instance
       * @type {string=}
       * @ojformat color
       */
      selectedOuterColor: undefined
    },

    /**
     * An array containing the ids of the initially selected nodes.
     * @expose
     * @name selection
     * @memberof oj.ojSunburst
     * @instance
     * @type {Array.<any>=}
     * @default []
     * @ojwriteback
     * @ojeventgroup common
     */
    selection: [],

    /**
     * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning,
     * but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold delay
     * when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is
     * touchStart the element will instantly trigger the touch gesture and consume the page pan events. If touchResponse is auto, the element will behave like touchStart
     * if it determines that it is not rendered within scrolling content and if panning is not available for those elements that support the feature.
     * @expose
     * @name touchResponse
     * @ojshortdesc Specifies configuration options for touch and hold delays on mobile devices. See the Help documentation for more information.
     * @memberof oj.ojSunburst
     * @instance
     * @type {string=}
     * @ojvalue {string} "touchStart"
     * @ojvalue {string} "auto"
     * @default "auto"
     */
    touchResponse: 'auto',

    /**
     * Triggered during user rotation of the sunburst.
     *
     * @property {number} value the start angle of the sunburst, in degrees
     *
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */
    rotateInput: null,
    /**
     * Triggered immediately before any node in the sunburst is drilled into. The drill event can be vetoed if the beforeDrill event's preventDefault() is called.
     *
     * @property {any} id the id of the drilled node
     * @property {Object} data the data object of the drilled node
     * @property {Object} itemData The row data object for the drilled node. This will only be set if a DataProvider is being used.
     * @ojsignature [{target: "Type", value: "K", for: "id"},
     *               {target: "Type", value: "ojSunburst.Node<K>", for:"data"},
     *               {target: "Type", value: "D", for: "itemData"},
     *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
     * @expose
     * @event
     * @ojshortdesc Triggered immediately before any node in the sunburst is drilled into.
     * @memberof oj.ojSunburst
     * @instance
     */
    beforeDrill: null,
    /**
     * Triggered during a drill gesture (double click if selection is enabled, single click otherwise).
     *
     * @property {any} id the id of the drilled node
     * @property {Object} data the data object of the drilled node
     * @property {Object} itemData The row data object for the drilled node. This will only be set if a DataProvider is being used.
     * @ojsignature [{target: "Type", value: "K", for: "id"},
     *               {target: "Type", value: "ojSunburst.Node<K>", for:"data"},
     *               {target: "Type", value: "D", for: "itemData"},
     *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
     *
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */
    drill: null,
    /**
     * Triggered immediately before any node in the sunburst is expanded. The expand event can be vetoed if the beforeExpand event's preventDefault() is called.
     *
     * @property {any} id the id of the node to expand
     * @property {Object} data the data object of the node to expand
     * @property {Object} itemData The row data object for the node to expand. This will only be set if a DataProvider is being used.
     * @ojsignature [{target: "Type", value: "K", for: "id"},
     *               {target: "Type", value: "ojSunburst.Node<K>", for:"data"},
     *               {target: "Type", value: "D", for: "itemData"},
     *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
     *
     * @expose
     * @event
     * @ojshortdesc Triggered immediately before any node in the sunburst is expanded.
     * @memberof oj.ojSunburst
     * @instance
     * @ojdeprecated {since: '12.1.0', description: 'The oj-before-expand event has been deprecated.  Lazy loading of data can be done through the data provider.'}
     */
    beforeExpand: null,
    /**
     * Triggered when a node has been expanded. The ui object contains one property, "nodeId", which is the id of the node that has been expanded.
     *
     * @property {any} id the id of the expanded node
     * @property {Object} data the data object of the expanded node
     * @property {Object} itemData The row data object for the expanded node. This will only be set if a DataProvider is being used.
     * @ojsignature [{target: "Type", value: "K", for: "id"},
     *               {target: "Type", value: "ojSunburst.Node<K>", for:"data"},
     *               {target: "Type", value: "D", for: "itemData"},
     *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
     * @expose
     * @event
     * @ojshortdesc Triggered when a node has been expanded.
     * @memberof oj.ojSunburst
     * @instance
     * @ojdeprecated {since: '12.1.0', description: 'The oj-expand event has been deprecated.  Use on-expanded-changed instead.'}
     */
    expand: null,
    /**
     * Triggered immediately before any container node in the sunburst is collapsed. The collapse event can be vetoed if the beforeCollapse event's preventDefault() is called.
     *
     * @property {any} id the id of the node to collapse
     * @property {Object} data the data object of the node to collapse
     * @property {Object} itemData The row data object for the node to collapse. This will only be set if a DataProvider is being used.
     * @ojsignature [{target: "Type", value: "K", for: "id"},
     *               {target: "Type", value: "ojSunburst.Node<K>", for:"data"},
     *               {target: "Type", value: "D", for: "itemData"},
     *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
     * @expose
     * @event
     * @ojshortdesc Triggered immediately before any container node in the sunburst is collapsed.
     * @memberof oj.ojSunburst
     * @instance
     * @ojdeprecated {since: '12.1.0', description: 'The oj-before-collapse event has been deprecated.  Lazy loading of data can be done through the data provider.'}
     */
    beforeCollapse: null,
    /**
     * Triggered when a node has been collapsed.
     *
     * @property {any} id the id of the collapsed node
     * @property {Object} data the data object of the collapsed node
     * @property {Object} itemData The row data object for the collapsed node. This will only be set if a DataProvider is being used.
     * @ojsignature [{target: "Type", value: "K", for: "id"},
     *               {target: "Type", value: "ojSunburst.Node<K>", for:"data"},
     *               {target: "Type", value: "D", for: "itemData"},
     *               {target: "Type", value: "<K, D>", for: "genericTypeParameters"}]
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     * @ojdeprecated {since: '12.1.0', description: 'The oj-collapse event has been deprecated.  Use on-expanded-changed instead.'}
     */
    collapse: null
  },

  _CreateDvtComponent: function (context, callback, callbackObj) {
    return new Sunburst(context, callback, callbackObj);
  },

  _GetSimpleDataProviderConfigs: function () {
    var configs = {
      data: {
        templateName: 'nodeTemplate',
        templateElementName: 'oj-sunburst-node',
        resultPath: 'nodes'
      }
    };
    Object.defineProperties(configs.data, {
      expandedKeySet: {
        get: function () {
          return this.options.expanded;
        }.bind(this)
      }
    });
    return configs;
  },

  _OptionChangeHandler: function (options) {
    var hasProperty = Object.prototype.hasOwnProperty.bind(options);
    // If there is a change in the expanded property, the data provider state needs to be cleared
    if (hasProperty('expanded') || hasProperty('displayLevels')) {
      this._ClearDataProviderState('data');
    }
    this._super(options);
  },

  _ConvertLocatorToSubId: function (locator) {
    var subId = locator.subId;

    // Convert the supported locators
    if (subId === 'oj-sunburst-node') {
      // node[index0][index1]...[indexN]
      subId = 'node' + this._GetStringFromIndexPath(locator.indexPath);
    } else if (subId === 'oj-sunburst-tooltip') {
      subId = 'tooltip';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  _ConvertSubIdToLocator: function (subId) {
    var locator = {};
    if (subId.indexOf('node') === 0) {
      // node[index0][index1]...[indexN]
      locator.subId = 'oj-sunburst-node';
      locator.indexPath = this._GetIndexPath(subId);
    } else if (subId === 'tooltip') {
      locator.subId = 'oj-sunburst-tooltip';
    }
    return locator;
  },

  _ProcessOptions: function () {
    this._super();
    var rootNodeContent = this.options.rootNodeContent;
    if (rootNodeContent && rootNodeContent._renderer) {
      rootNodeContent.renderer = this._GetTemplateRenderer(
        rootNodeContent._renderer,
        'rootNodeContent'
      );
    }

    // if expanded not declared, pass default expandAll key set to the toolkit
    if (!this.options.expanded) {
      this.options.expanded = new AllKeySetImpl();
    }

    if (this.options.data) {
      this._fetchDataHandler = this._getFetchDataHandler('data');
    }
  },

  _GetComponentRendererOptions: function () {
    return [
      { path: 'tooltip/renderer', slot: 'tooltipTemplate' },
      { path: 'rootNodeContent/renderer', slot: 'rootNodeContentTemplate' }
    ];
  },

  _GetComponentStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses.push('oj-sunburst');
    return styleClasses;
  },

  _GetChildStyleClasses: function () {
    var styleClasses = this._super();
    styleClasses['oj-dvtbase oj-sunburst'] = {
      path: 'animationDuration',
      property: 'ANIM_DUR'
    };
    styleClasses['oj-sunburst-attribute-type-text'] = {
      path: 'styleDefaults/_attributeTypeTextStyle',
      property: 'TEXT'
    };
    styleClasses['oj-sunburst-attribute-value-text'] = {
      path: 'styleDefaults/_attributeValueTextStyle',
      property: 'TEXT'
    };
    styleClasses['oj-sunburst-drill-text'] = {
      path: 'styleDefaults/_drillTextStyle',
      property: 'TEXT'
    };
    styleClasses['oj-sunburst-current-drill-text'] = {
      path: 'styleDefaults/_currentTextStyle',
      property: 'TEXT'
    };
    styleClasses['oj-sunburst-node'] = {
      path: 'nodeDefaults/labelStyle',
      property: 'TEXT'
    };
    styleClasses['oj-sunburst-node oj-hover'] = {
      path: 'nodeDefaults/hoverColor',
      property: 'border-top-color'
    };
    styleClasses['oj-sunburst-node oj-selected'] = [
      { path: 'nodeDefaults/selectedOuterColor', property: 'border-top-color' },
      { path: 'nodeDefaults/selectedInnerColor', property: 'border-bottom-color' }
    ];
    return styleClasses;
  },

  _GetEventTypes: function () {
    return [
      'optionChange',
      'rotateInput',
      'beforeDrill',
      'drill',
      'beforeExpand',
      'expand',
      'beforeCollapse',
      'collapse'
    ];
  },

  _HandleEvent: function (event) {
    var type = event.type;
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

    if (type === 'rotation') {
      if (event.complete) {
        this._UserOptionChange('startAngle', event.startAngle);
      } else {
        this._trigger('rotateInput', null, { value: event.startAngle });
      }
    } else if (type === 'drill') {
      if (event.id && this._trigger('beforeDrill', null, eventData)) {
        this._UserOptionChange('rootNode', event.id);
        this._Render();
        this._trigger('drill', null, eventData);
      }
    } else if (type === 'expand') {
      if (event.id && this._trigger('beforeExpand', null, eventData)) {
        var self = this;
        this._NotReady(); // Register busy state
        var fetchDataPromise = this.options.data
          ? this._fetchDataHandler(this.options.data, event.expanded, null, eventData.id)
          : Promise.resolve();
        fetchDataPromise.then(function () {
          self._UserOptionChange('expanded', event.expanded);
          self._Render();
          self._trigger('expand', null, eventData);
        });
      }
    } else if (type === 'collapse') {
      if (event.id && this._trigger('beforeCollapse', null, eventData)) {
        this._UserOptionChange('expanded', event.expanded);
        this._Render();
        this._trigger('collapse', null, eventData);
      }
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

    // Add cursors
    resources.rotateCursor = getResourceUrl(
      'resources/internal-deps/dvt/sunburst/rotate.cur'
    );

    resources.expand = 'oj-fwk-icon oj-fwk-icon-plus';
    resources.collapse = 'oj-fwk-icon oj-fwk-icon-minus';
  },

  /**
   * Returns an object with the following properties for automation testing verification of the node with
   * the specified subid path.
   *
   * @param {Array} subIdPath The array of indices in the subId for the desired node
   * @ojsignature {target: "Type", value: "oj.ojSunburst.DataContext|null", jsdocOverride: true, for: "returns"}
   * @return {Object|null} An object containing properties for the node, or null if none exists.
   * @expose
   * @instance
   * @ojdeprecated {since: '7.0.0', description: 'The use of this function is no longer recommended.'}
   * @ojtsignore
   * @memberof oj.ojSunburst
   * @ojshortdesc Returns information for automation testing verification of a specified node.
   */
  getNode: function (subIdPath) {
    return this._component.getAutomation().getNode(subIdPath);
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @ojsignature {target: "Type", value: "oj.ojSunburst.NodeContext|null", jsdocOverride: true, for: "returns"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojSunburst
   * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
   */
  getContextByNode: function (node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context && context.subId !== 'oj-sunburst-tooltip') {
      return context;
    }

    return null;
  },

  _GetComponentDeferredDataPaths: function () {
    return { root: ['nodes', 'data'] };
  }
});
