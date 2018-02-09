/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtTagCloud'], function(oj, $, comp, base, dvt)
{
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
/**
 * Defines the animation that is applied on data changes.
 * @expose
 * @name animationOnDataChange
 * @memberof oj.ojTagCloud
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
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
/**
 * Defines the animation that is shown on initial display.
 * @expose
 * @name animationOnDisplay
 * @memberof oj.ojTagCloud
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
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
/**
 * An array of category strings used for category filtering. Data items with a category 
 * in hiddenCategories will be filtered.
 * @expose
 * @name hiddenCategories
 * @memberof oj.ojTagCloud
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
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
/**
 * An array of category strings used for category highlighting. Data items with a 
 * category in highlightedCategories will be highlighted.
 * @expose
 * @name highlightedCategories
 * @memberof oj.ojTagCloud
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
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
/**
 * The matching condition for the highlightedCategories option. By default, highlightMatch is 'all' 
 * and only items whose categories match all of the values specified in the highlightedCategories 
 * array will be highlighted. If highlightMatch is 'any', then items that match at least one of 
 * the highlightedCategories values will be highlighted.
 * @expose
 * @name highlightMatch
 * @memberof oj.ojTagCloud
 * @instance
 * @type {string}
 * @ojvalue {string} "any"
 * @ojvalue {string} "all"
 * @default <code class="prettyprint">"all"</code>
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
/**
 * Defines the behavior applied when hovering over data items.
 * @expose
 * @name hoverBehavior
 * @memberof oj.ojTagCloud
 * @instance
 * @type {string}
 * @ojvalue {string} "dim"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
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
/**
 * An array of objects with the following properties that defines the data items for the tag cloud items. 
 * Also accepts a Promise or callback function for deferred data rendering. The function should return 
 * one of the following: 
 * <ul>
 *   <li>Promise: A Promise that will resolve with an array of data items. No data will be rendered if the Promise is rejected.</li> 
 *   <li>Array: An array of data items.</li> 
 * </ul> 
 * @expose
 * @name items
 * @memberof oj.ojTagCloud
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
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
/**
 * An array of category strings corresponding to the tag cloud items. This allows highlighting and filtering of items.
 * @expose
 * @name items[].categories
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#items">items</a> attribute for usage examples.</caption>
 */
/**
 * The color of the text. Will be overridden by any color defined in the style option.
 * @expose
 * @name items[].color
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#items">items</a> attribute for usage examples.</caption>
 */
/**
 * The id of the tag.
 * @expose
 * @name items[].id
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#items">items</a> attribute for usage examples.</caption>
 */
/**
 * The text of the tag.
 * @expose
 * @name items[].label
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#items">items</a> attribute for usage examples.</caption>
 */
/**
 * The description of the tag. This is used for customizing the tooltip text.
 * @expose
 * @name items[].shortDesc
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#items">items</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style object defining the style of the text.
 * @expose
 * @name items[].svgStyle
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#items">items</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style string/object defining the style of the text.
 * @expose
 * @name items[].style
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {string|object}
 * @default <code class="prettyprint">null</code>
 * @ignore
 */
/**
 * The CSS style class defining the style of the text.
 * @expose
 * @name items[].svgClassName
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#items">items</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style class defining the style of the text.
 * @expose
 * @name items[].className
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @ignore
 */

/**
 * The url this tag references.
 * @expose
 * @name items[].url
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#items">items</a> attribute for usage examples.</caption>
 */
/**
 * The value of the tag which will be used to scale its font-size within the tag cloud.
 * @expose
 * @name items[].value
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#items">items</a> attribute for usage examples.</caption>
 */
/**
 * The layout to use for tag display.
 * @expose
 * @name layout
 * @memberof oj.ojTagCloud
 * @instance
 * @type {string}
 * @ojvalue {string} "cloud"
 * @ojvalue {string} "rectangular"
 * @default <code class="prettyprint">"rectangular"</code>
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
/**
 * An array of id strings, used to define the selected data items.
 * @expose
 * @name selection
 * @memberof oj.ojTagCloud
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
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
/**
 * The type of selection behavior that is enabled on the tag cloud.
 * @expose
 * @name selectionMode
 * @memberof oj.ojTagCloud
 * @instance
 * @type {string}
 * @ojvalue {string} "single"
 * @ojvalue {string} "multiple"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
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
/**
 * An object containing an optional callback function for tooltip customization. 
 * @expose
 * @name tooltip
 * @memberof oj.ojTagCloud
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
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
/**
 *  A function that returns a custom tooltip. The function takes a dataContext argument, 
 *  provided by the tag cloud, with the following properties: 
 *  <ul> 
 *    <li>color: The color of the hovered item.</li> 
 *    <li>componentElement: The tag cloud element.</li>
 *    <li>id: The id of the hovered item.</li> 
 *    <li>label: The data label of the hovered item.</li> 
 *    <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li>
 *    <li>value: The value of the hovered item.</li> 
 *  </ul>
  *  The function should return an Object that contains only one of the two properties:
 *  <ul>
 *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
 *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
 *  </ul>
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#tooltip">tooltip</a> attribute for usage examples.</caption>
 */
/**
 * An object defining the default styles for the tag cloud. Properties specified on this object may 
 * be overridden by specifications on the data item.
 * @expose
 * @name styleDefaults
 * @memberof oj.ojTagCloud
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>Initialize the tag cloud with the 
 * <code class="prettyprint">style-defaults</code> attribute specified:</caption>
 * <!-- Using dot notation -->
 * &lt;oj-tag-cloud style-defaults.animation-duration='200'>&lt;/oj-tag-cloud>
 * 
 * <!-- Using JSON notation -->
 * &lt;oj-tag-cloud style-defaults='{"animationDuration": 200, "svgStyle": {}'>&lt;/oj-tag-cloud>
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
 * myTagCloud.setProperty('styleDefaults.svgStyle', {'fill': 'url("someURL#filterId")'});
 * 
 * // Set all. Must list every resource key, as those not listed are lost.
 * myTagCloud.styleDefaults={'fill': 'url("someURL#filterId")'};
 */
/**
 * The duration of the animations in milliseconds.
 * @expose
 * @name styleDefaults.animationDuration
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * Specifies initial hover delay in ms for highlighting data items.
 * @expose
 * @name styleDefaults.hoverBehaviorDelay
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style object defining the style of the items.
 * @expose
 * @name styleDefaults.svgStyle
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * 
 * @example <caption>See the <a href="#styleDefaults">styleDefaults</a> attribute for usage examples.</caption>
 */
/**
 * The CSS style string/object defining the style of the items.
 * @expose
 * @name styleDefaults.style
 * @memberof! oj.ojTagCloud
 * @instance
 * @type {string|object}
 * @default <code class="prettyprint">null</code>
 * @ignore
 */
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
 * @memberof oj.ojTagCloud
 * @instance
 * @type {string}
 * @ojvalue {string} "touchStart"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
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

/**This file is generated. Do not edit directly. Actual file located in 3rdparty/dvt/prebuild.**/
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojTagCloud
 * @augments oj.dvtBaseComponent
 * @since 1.1.0
 * @ojstatus preview
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
 *   items='[{"id": "item1", "label": "the", "value": 20}, 
 *           {"id": "item2", "label": "cat", "value": 17}, 
 *           {"id": "item3", "label": "hat", "value": 13}]'>
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
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">styleDefaults.style</code>, instead of styling properties
 *    on the individual data items. The tag cloud can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojTagCloud', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",

  // @inheritdoc
  _CreateDvtComponent : function(context, callback, callbackObj) {
    return dvt.TagCloud.newInstance(context, callback, callbackObj);
  },

  // @inheritdoc
  _ConvertLocatorToSubId : function(locator) {
    var subId = locator['subId'];

    // Convert the supported locators
    if(subId == 'oj-tagcloud-item') {
      // item[index]
      subId = 'item[' + locator['index'] + ']';
    }
    else if(subId == 'oj-tagcloud-tooltip') {
      subId = 'tooltip';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  // @inheritdoc
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId.indexOf('item') == 0) {
      // item[index]
      locator['subId'] = 'oj-tagcloud-item';
      locator['index'] = this._GetFirstIndex(subId);
    }
    else if(subId == 'tooltip') {
      locator['subId'] = 'oj-tagcloud-tooltip';
    }

    return locator;
  },

  // @inheritdoc
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-tagcloud');
    return styleClasses;
  },

  // @inheritdoc
  _GetChildStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses['oj-tagcloud'] = {'path': 'styleDefaults/style', 'property': 'CSS_TEXT_PROPERTIES'};
    return styleClasses;
  },

  // @inheritdoc
  _GetEventTypes : function() {
    return ['optionChange'];
  },

  // @inheritdoc
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.TAG_CLOUD'] = translations['componentName'];
    return ret;
  },

  /**
   * Returns an object with the following properties for automation testing verification of the item at the
   * specified index.

   * @param {number} index The index.
   * @property {string} color
   * @property {string} label
   * @property {boolean} selected
   * @property {string} tooltip
   * @property {number} value
   * @return {Object} An object containing data for the node at the given index, or null if none exists.
   * @expose
   * @memberof oj.ojTagCloud
   * @instance
   */
  getItem: function(index) {
    var auto = this._component.getAutomation();
    return auto.getItem(index);
  },
  /**
   * Returns the number of items in the tag cloud data.
   * @return {number} The number of data items
   * @expose
   * @memberof oj.ojTagCloud
   * @instance
   */
  getItemCount: function() {
    return this._component.getAutomation().getItemCount();
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojTagCloud
   */
  getContextByNode: function(node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context && context['subId'] !== 'oj-tagcloud-tooltip')
      return context;

    return null;
  },

  // @inheritdoc
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['items']};
  }
});

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojTagCloudMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "highlightedCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "highlightMatch": {
      "type": "string",
      "enumValues": ["any", "all"]
    },
    "hoverBehavior": {
      "type": "string",
      "enumValues": ["dim", "none"]
    },
    "items": {
      "type": "Array<object>|Promise"
    },
    "layout": {
      "type": "string",
      "enumValues": ["cloud", "rectangular"]
    },
    "selection": {
      "type": "Array<string>",
      "writeback": true
    },
    "selectionMode": {
      "type": "string",
      "enumValues": ["single", "multiple", "none"]
    },
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDuration": {
          "type": "number"
        },
        "hoverBehaviorDelay": {
          "type": "number"
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "touchResponse": {
      "type": "string",
      "enumValues": ["touchStart", "auto"]
    },
    "translations": {
      "properties": {
        "componentName": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getContextByNode": {},
    "getItem": {},
    "getItemCount": {}
  },
  "extension": {
    _WIDGET_NAME: "ojTagCloud"
  }
};
oj.CustomElementBridge.registerMetadata('oj-tag-cloud', 'dvtBaseComponent', ojTagCloudMeta);
oj.CustomElementBridge.register('oj-tag-cloud', {'metadata': oj.CustomElementBridge.getMetadata('oj-tag-cloud')});
})();
});
