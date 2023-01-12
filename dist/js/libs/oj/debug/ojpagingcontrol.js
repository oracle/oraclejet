/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojinputtext', 'ojs/ojjquery-hammer', 'ojs/ojpagingmodel', 'ojs/ojcore-base', 'jquery', 'ojs/ojdomutils', 'ojs/ojcontext', 'hammerjs', 'ojs/ojlogger', 'ojs/ojconverter-number', 'ojs/ojvalidator-numberrange'], function (ojinputtext, ojjqueryHammer, ojpagingmodel, oj, $, DomUtils, Context, hammerjs, ojlogger, ojconverterNumber, NumberRangeValidator) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;
  NumberRangeValidator = NumberRangeValidator && Object.prototype.hasOwnProperty.call(NumberRangeValidator, 'default') ? NumberRangeValidator['default'] : NumberRangeValidator;

  (function () {
var __oj_paging_control_metadata = 
{
  "properties": {
    "data": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "deprecated",
              "since": "14.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
        }
      }
    },
    "loadMoreOptions": {
      "type": "object",
      "properties": {
        "maxCount": {
          "type": "number",
          "value": 500
        }
      }
    },
    "mode": {
      "type": "string",
      "enumValues": [
        "loadMore",
        "page"
      ],
      "value": "page"
    },
    "overflow": {
      "type": "string",
      "enumValues": [
        "fit",
        "none"
      ],
      "value": "fit"
    },
    "pageOptions": {
      "type": "object",
      "properties": {
        "layout": {
          "type": "Array<string>",
          "enumValues": [
            "all",
            "auto",
            "input",
            "nav",
            "pages",
            "rangeText"
          ],
          "value": [
            "auto"
          ]
        },
        "maxPageLinks": {
          "type": "number",
          "value": 6
        },
        "orientation": {
          "type": "string",
          "enumValues": [
            "horizontal",
            "vertical"
          ],
          "value": "horizontal"
        },
        "type": {
          "type": "string",
          "enumValues": [
            "dots",
            "numbers"
          ],
          "value": "numbers"
        }
      }
    },
    "pageSize": {
      "type": "number",
      "value": 25
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "fullMsgItem": {
          "type": "string"
        },
        "fullMsgItemApprox": {
          "type": "string"
        },
        "fullMsgItemAtLeast": {
          "type": "string"
        },
        "fullMsgItemRange": {
          "type": "string"
        },
        "fullMsgItemRangeApprox": {
          "type": "string"
        },
        "fullMsgItemRangeAtLeast": {
          "type": "string"
        },
        "labelAccNavFirstPage": {
          "type": "string"
        },
        "labelAccNavLastPage": {
          "type": "string"
        },
        "labelAccNavNextPage": {
          "type": "string"
        },
        "labelAccNavPage": {
          "type": "string"
        },
        "labelAccNavPreviousPage": {
          "type": "string"
        },
        "labelAccPageNumber": {
          "type": "string"
        },
        "labelAccPaging": {
          "type": "string"
        },
        "labelLoadMore": {
          "type": "string"
        },
        "labelLoadMoreMaxRows": {
          "type": "string"
        },
        "labelNavInputPage": {
          "type": "string"
        },
        "labelNavInputPageMax": {
          "type": "string"
        },
        "maxPageLinksInvalid": {
          "type": "string"
        },
        "msgItemNoTotal": {
          "type": "string"
        },
        "msgItemRangeCurrent": {
          "type": "string"
        },
        "msgItemRangeCurrentSingle": {
          "type": "string"
        },
        "msgItemRangeItems": {
          "type": "string"
        },
        "msgItemRangeNoTotal": {
          "type": "string"
        },
        "msgItemRangeOf": {
          "type": "string"
        },
        "msgItemRangeOfApprox": {
          "type": "string"
        },
        "msgItemRangeOfAtLeast": {
          "type": "string"
        },
        "pageInvalid": {
          "type": "string"
        },
        "tipNavFirstPage": {
          "type": "string"
        },
        "tipNavInputPage": {
          "type": "string"
        },
        "tipNavLastPage": {
          "type": "string"
        },
        "tipNavNextPage": {
          "type": "string"
        },
        "tipNavPageLink": {
          "type": "string"
        },
        "tipNavPreviousPage": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "firstPage": {},
    "getProperty": {},
    "lastPage": {},
    "loadNext": {},
    "nextPage": {},
    "page": {},
    "previousPage": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
    __oj_paging_control_metadata.extension._WIDGET_NAME = 'ojPagingControl';
    oj.CustomElementBridge.register('oj-paging-control', { metadata: __oj_paging_control_metadata });
  })();

  /**
   * @ojcomponent oj.ojPagingControl
   * @augments oj.baseComponent
   *
   * @since 0.7.0
   * @ojshortdesc A paging control provides paging functionality for data collections.
   * @ojrole navigation
   * @ojrole button
   * @ojtsimport {module: "ojvalidator-numberrange", type: "AMD", importName: "NumberRangeValidator"}
   * @ojtsimport {module: "ojpagingmodel", type: "AMD", imported: ["PagingModel"]}
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["pageOptions.layout", "pageOptions.orientation", "pageOptions.type", "pageOptions.maxPageLinks", "overflow", "pageSize"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["data"]}
   * @ojvbdefaultcolumns 12
   * @ojvbmincolumns 2
   *
   * @ojoracleicon 'oj-ux-ico-paging-control'
   *
   * @classdesc
   * <h3 id="pagingcontrolOverview-section">
   *   JET PagingControl
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pagingcontrolOverview-section"></a>
   * </h3>
   * <p>Description:</p>
   * <p>A JET PagingControl provides the ability to fetch and display a page of data at a time. The paging control will only fetch the items for the currently displayed page so it should be used for large datasets which can be fetched in pages.
   * The number of items per page is uniform and configurable. The paging control can be used with any DataSource which implements the PagingModel interface, such as PagingTableDataSource and oj.PagingDataGridDataSource. That means that the Paging Control can be used with ojTable, ojDataGrid, and ojListView.</p>
   *
   * <pre class="prettyprint"><code>&lt;oj-paging-control
   *   data='{{pagingModel}}'
   *   page-size='10'>
   * &lt;/oj-paging-control></code></pre>
   *
   * <h3 id="keyboard-section">
   *   Keyboard End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"keyboardDoc"}
   *
   * <h3 id="touch-section">
   *   Touch End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"touchDoc"}
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   *
   * <p>Application should specify an id for the paging control to generate an aria-label value.
   *
   * <p>The paging control also uses aria role = "region".
   *
   */

  //-----------------------------------------------------
  //                   Fragments
  //-----------------------------------------------------

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
   *       <td>Page Navigation Bar</td>
   *       <td><kbd>Swipe</kbd></td>
   *       <td>When mode='page', swiping left or right on the page navigation bar will either increment or decrement the page respectively.</td>
   *     </tr>
   *     <tr>
   *       <td>Page Number Input</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Set focus to the input.</td>
   *     </tr>
   *     <tr>
   *       <td>Arrow Page Navigation</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Navigates to the first, previous, next, or last page.</td>
   *     </tr>
   *     <tr>
   *       <td>Numbered Page Links</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Navigates to the page.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch section of classdesc, and standalone gesture doc
   * @memberof oj.ojPagingControl
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
   *       <td>Page Number Input</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the input.</td>
   *     </tr>
   *     <tr>
   *       <td>Arrow Page Navigation</td>
   *       <td><kbd>Tab</kbd></td>
   *       <td>Set focus to the first, previous, next, or last page arrow.</td>
   *     </tr>
   *     <tr>
   *       <td>Numbered Page Links</td>
   *       <td><kbd>Tab</kbd></td>
   *       <td>Set focus to to the page link.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojPagingControl
   */

  //-----------------------------------------------------
  //                   Sub-ids
  //-----------------------------------------------------

  /**
   * <p>Sub-ID for the PagingControl page number navigation input.</p>
   *
   * @ojsubid oj-pagingcontrol-nav-input
   * @memberof oj.ojPagingControl
   *
   * @example <caption>Get the page number navigation input:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-input'} );
   */

  /**
   * <p>Sub-ID for the PagingControl current maximum page text.</p>
   *
   * @ojsubid oj-pagingcontrol-nav-input-max
   * @deprecated 2.0.2 This sub-ID is not needed since it is not an interactive element.
   * @memberof oj.ojPagingControl
   * @ignore
   *
   * @example <caption>Get the current maximum page text:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-input-max'} );
   */

  /**
   * <p>Sub-ID for the PagingControl summary items text.</p>
   *
   * @ojsubid oj-pagingcontrol-nav-input-summary
   * @deprecated 2.0.2 This sub-ID is not needed since it is not an interactive element.
   * @memberof oj.ojPagingControl
   * @ignore
   *
   * @example <caption>Get the summary items text:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-input-summary'} );
   */

  /**
   * <p>Sub-ID for the PagingControl summary current items text.</p>
   *
   * @ojsubid oj-pagingcontrol-nav-input-summary-current
   * @deprecated 2.0.2 This sub-ID is not needed since it is not an interactive element.
   * @memberof oj.ojPagingControl
   * @ignore
   *
   * @example <caption>Get the summary current items text:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-input-summary-current'} );
   */

  /**
   * <p>Sub-ID for the PagingControl summary max items text.</p>
   *
   * @ojsubid oj-pagingcontrol-nav-input-summary-max
   * @deprecated 2.0.2 This sub-ID is not needed since it is not an interactive element.
   * @memberof oj.ojPagingControl
   * @ignore
   *
   * @example <caption>Get the summary max items text:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-input-summary-max'} );
   */

  /**
   * <p>Sub-ID for the PagingControl first page button.</p>
   *
   * @ojsubid oj-pagingcontrol-nav-first
   * @memberof oj.ojPagingControl
   *
   * @example <caption>Get the first page button:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-first'} );
   */

  /**
   * <p>Sub-ID for the PagingControl next page button.</p>
   *
   * @ojsubid oj-pagingcontrol-nav-next
   * @memberof oj.ojPagingControl
   *
   * @example <caption>Get the next page button:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-next'} );
   */

  /**
   * <p>Sub-ID for the PagingControl previous page button.</p>
   *
   * @ojsubid oj-pagingcontrol-nav-previous
   * @memberof oj.ojPagingControl
   *
   * @example <caption>Get the previous page button:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-previous'} );
   */

  /**
   * <p>Sub-ID for the PagingControl previous page button.</p>
   *
   * @ojsubid oj-pagingcontrol-nav-last
   * @memberof oj.ojPagingControl
   *
   * @example <caption>Get the last page button:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-last'} );
   */

  /**
   * <p>Sub-ID for the PagingControl page button.</p>
   * To lookup a page button the locator object should have the following:
   * <ul>
   * <li><b>index</b>zero-based index of page number node</li>
   * </ul>
   *
   * @ojsubid oj-pagingcontrol-nav-page
   * @memberof oj.ojPagingControl
   *
   * @example <caption>Get the page button:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-nav-page', 'index': 1} );
   */

  /**
   * <p>Sub-ID for the PagingControl Show More link.</p>
   *
   * @ojsubid oj-pagingcontrol-load-more-link
   * @memberof oj.ojPagingControl
   * @ojdeprecated {since: '7.0.0', description: 'this option is deprecated and will be removed in the future.
   *                         Please use native component high-water mark scrolling API instead (see Table, ListView, DataGrid).'}
   *
   * @example <caption>Get the Show More link:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-load-more-link'} );
   */

  /**
   * <p>Sub-ID for the PagingControl load more range text.</p>
   *
   * @ojsubid oj-pagingcontrol-load-more-range
   * @deprecated 2.0.2 This sub-ID is not needed since it is not an interactive element.
   * @memberof oj.ojPagingControl
   * @ignore
   *
   * @example <caption>Get the load more range text:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-load-more-range'} );
   */

  /**
   * <p>Sub-ID for the PagingControl load more range current items text.</p>
   *
   * @ojsubid oj-pagingcontrol-load-more-range-current
   * @deprecated 2.0.2 This sub-ID is not needed since it is not an interactive element.
   * @memberof oj.ojPagingControl
   * @ignore
   *
   * @example <caption>Get the load more range current items text:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-load-more-range-current'} );
   */

  /**
   * <p>Sub-ID for the PagingControl load more range max items text.</p>
   *
   * @ojsubid oj-pagingcontrol-load-more-range-max
   * @deprecated 2.0.2 This sub-ID is not needed since it is not an interactive element.
   * @memberof oj.ojPagingControl
   * @ignore
   *
   * @example <caption>Get the load more range max items text:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-load-more-range-max'} );
   */

  /**
   * <p>Sub-ID for the PagingControl load more max message.</p>
   *
   * @ojsubid oj-pagingcontrol-load-more-max-rows
   * @deprecated 2.0.2 This sub-ID is not needed since it is not an interactive element.
   * @memberof oj.ojPagingControl
   * @ignore
   *
   * @example <caption>Get the load more max message:</caption>
   * var node = myPagingControl.getNodeBySubId( {'subId': 'oj-pagingcontrol-load-more-max-rows'} );
   */
  (function () {
    oj.__registerWidget('oj.ojPagingControl', $.oj.baseComponent, {
      version: '1.0.0',
      defaultElement: '<div>',
      widgetEventPrefix: 'oj',
      options: {
        /**
         * The data to bind to the PagingControl.
         * <p>
         * Must implement the PagingModel interface {@link PagingModel}
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojPagingControl
         * @ojshortdesc Specifies the data bound to the Paging Control. See the Help documentation for more information.
         * @type {Object}
         * @ojsignature {target:"Type", value:"PagingModel", jsdocOverride:true}
         * @default null
         * @ojwebelementstatus {type: "deprecated", since: "14.0.0",
         *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
         *
         * @example <caption>Initialize the PagingControl with the <code class="prettyprint">data</code> attribute specified:</caption>
         * &lt;oj-paging-control data='{{pagingDataSource}}'>&lt;/oj-paging-control>
         *
         * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
         * // getter
         * var pagingDataSource = myPagingControl.data;
         *
         * // setter
         * myPagingControl.data = pagingDataSource;
         */
        data: null,
        /**
         * Options for when the PagingControl width is too narrow to accommodate the controls in the paging control
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojPagingControl
         * @ojshortdesc Specifies the options for when the Paging Control width is too narrow.
         * @type {string}
         * @ojvalue {string} "fit" Display as many controls as can fit in the PagingControl width.
         * @ojvalue {string} "none" Display all controls. Controls which cannot fit will be truncated.
         * @default "fit"
         *
         * @example <caption>Initialize the PagingControl with the <code class="prettyprint">overflow</code> attribute specified:</caption>
         * &lt;oj-paging-control overflow='none'>&lt;/oj-paging-control>
         *
         * @example <caption>Get or set the <code class="prettyprint">overflow</code> property after initialization:</caption>
         * // getter
         * var overflowValue = myPagingControl.overflow;
         *
         * // setter
         * myPagingControl.overflow = 'none';
         */
        overflow: 'fit',
        /**
         * Page size.
         * <p>
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojPagingControl
         * @type {number}
         * @default 25
         * @ojmin 1
         *
         * @example <caption>Initialize the PagingControl with the <code class="prettyprint">page-size</code> attribute specified:</caption>
         * &lt;oj-paging-control page-size='50'>&lt;/oj-paging-control>
         *
         * @example <caption>Get or set the <code class="prettyprint">pageSize</code> property after initialization:</caption>
         * // getter
         * var pageSizeValue = myPagingControl.pageSize;
         *
         * // setter
         * myPagingControl.pageSize = 50;
         */
        pageSize: 25,
        /**
         * Options for page mode.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojPagingControl
         * @type {Object}
         *
         * @example <caption>Initialize the PagingControl, overriding some page-options values and leaving the others intact:</caption>
         * &lt;!-- Using dot notation -->
         * &lt;oj-paging-control page-options.some-key='some value' page-options.some-other-key='some other value'>&lt;/oj-paging-control>
         *
         * &lt;!-- Using JSON notation -->
         * &lt;oj-paging-control page-options='{"someKey":"some value", "someOtherKey":"some other value"}'>&lt;/oj-paging-control>
         *
         * @example <caption>Get or set the <code class="prettyprint">pageOptions</code> property after initialization:</caption>
         * // Get one
         * var value = myPagingControl.pageOptions.someKey;
         *
         * // Set one, leaving the others intact. Always use the setProperty API for
         * // subproperties rather than setting a subproperty directly.
         * myPagingControl.setProperty('pageOptions.someKey', 'some value');
         *
         * // Get all
         * var values = myPagingControl.pageOptions;
         *
         * // Set all.  Must list every pageOptions key, as those not listed are lost.
         * myPagingControl.pageOptions = {
         *     someKey: 'some value',
         *     someOtherKey: 'some other value'
         * };
         */
        pageOptions: {
          /**
           * Array of paging navigation controls to be displayed (only applicable for numbers type).
           * <p>This is an array of one or more supported values.</p>
           * <p>See the <a href="#pageOptions">page-options</a> attribute for usage examples.</p>
           * @expose
           * @name pageOptions.layout
           * @ojshortdesc An array of values specifying the navigation controls to display for numeric page links.
           * @public
           * @memberof! oj.ojPagingControl
           * @instance
           * @type {Array.<string>}
           * @ojvalue {string} 'auto' The PagingControl decides which controls to display
           * @ojvalue {string} 'all' Display all controls
           * @ojvalue {string} 'input' Display the page input control
           * @ojvalue {string} 'rangeText' Display the page range text control
           * @ojvalue {string} 'pages' Display the page links
           * @ojvalue {string} 'nav' Display the navigation arrows
           * @default ['auto']
           * @ojsignature { target: "Type",
           *                value: "?['auto'|'all'|'input'|'rangeText'|'pages'|'nav']"}
           */
          layout: ['auto'],
          /**
           * The type of page links.
           * <p>See the <a href="#pageOptions">page-options</a> attribute for usage examples.</p>
           * @expose
           * @name pageOptions.type
           * @ojshortdesc Specifies the type of page links.
           * @public
           * @memberof! oj.ojPagingControl
           * @instance
           * @type {string}
           * @ojvalue {string} 'numbers' Render numeric page links
           * @ojvalue {string} 'dots' Render dots
           * @ojsignature { target: "Type",
           *                value: "?"}
           * @default "numbers"
           */
          type: 'numbers',
          /**
           * The maximum number of page links to display (only applicable for numbers type).
           * An ellipsis '...' will be displayed for pages which exceed the maximum.
           * maxPageLinks must be greater than 4.
           * <p>See the <a href="#pageOptions">page-options</a> attribute for usage examples.</p>
           * @expose
           * @name pageOptions.maxPageLinks
           * @ojshortdesc Specifies the maximum number of numeric page links to display.
           * @public
           * @memberof! oj.ojPagingControl
           * @instance
           * @type {number}
           * @ojsignature { target: "Type",
           *                value: "?"}
           * @default 6
           * @ojmin 5
           */
          maxPageLinks: 6,
          /**
           * The orientation of the page links.
           * <p>See the <a href="#pageOptions">page-options</a> attribute for usage examples.</p>
           * @expose
           * @name pageOptions.orientation
           * @ojshortdesc Specifies the orientation of the page links.
           * @public
           * @memberof! oj.ojPagingControl
           * @instance
           * @type {string}
           * @ojvalue {string} 'horizontal'
           * @ojvalue {string} 'vertical'
           * @ojsignature { target: "Type",
           *                value: "?"}
           * @default "horizontal"
           */
          orientation: 'horizontal'
        },
        /**
         * Options for loadMore mode.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojPagingControl
         * @type {Object}
         * @ojdeprecated {since: '7.0.0', description: 'This option is deprecated and will not get feature updates or support going forward.
         *                         Please use native component high-water mark scrolling API instead (see Table, ListView, DataGrid).
         *                         In addition, "loadMore" is not compatible with Table, Listview, DataGrid default scroll-policy "loadMoreOnScroll".'}
         *
         * @example <caption>Initialize the PagingControl, overriding load-more-options value:</caption>
         * &lt;!-- Using dot notation -->
         * &lt;oj-paging-control load-more-options.max-count='300'>&lt;/oj-paging-control>
         *
         * &lt;!-- Using JSON notation -->
         * &lt;oj-paging-control load-more-options='{"maxCount":300}'>&lt;/oj-paging-control>
         *
         * @example <caption>Get or set the <code class="prettyprint">loadMoreOptions</code> property after initialization:</caption>
         * // Get one
         * var value = myPagingControl.loadMoreOptions.maxCount;
         *
         * // Set one. Always use the setProperty API for
         * // subproperties rather than setting a subproperty directly.
         * myPagingControl.setProperty('loadMoreOptions.maxCount', 300);
         *
         * // Get all
         * var values = myPagingControl.loadMoreOptions;
         *
         * // Set all.  Must list every loadMoreOptions key, as those not listed are lost.
         * myPagingControl.loadMoreOptions = {
         *     maxCount: 300
         * };
         */
        loadMoreOptions: {
          /**
           * The maximum number items to display.
           * <p>See the <a href="#loadMoreOptions">load-more-options</a> attribute for usage examples.</p>
           * @expose
           * @name loadMoreOptions.maxCount
           * @ojshortdesc The maximum number of items to display.
           * @memberof! oj.ojPagingControl
           * @instance
           * @type {number}
           * @ojdeprecated {since: '7.0.0', description: 'This option is deprecated and will not get feature updates or support going forward.
           *                         Please use native component high-water mark scrolling API instead (see Table, ListView, DataGrid).'}
           *
           * @default 500
           * @ojmin 0
           */
          maxCount: 500
        },
        /**
         * Paging mode.
         * @expose
         * @public
         * @instance
         * @memberof! oj.ojPagingControl
         * @ojshortdesc Specifies the paging mode.
         * @type {string}
         * @ojvalue {string} "page" Display paging control in pagination mode.
         * @ojvalue {string} "loadMore"  Display paging control in high-water mark mode.
         * @ojdeprecated [ {target:'propertyValue', for:'loadMore', since: '6.0.0', description: 'This option is deprecated and will not get feature updates or support going forward.
         *                Please use native component high-water mark scrolling API instead (see Table, ListView, DataGrid).
         *                In addition, "loadMore" is not compatible with Table, Listview, DataGrid default scroll-policy "loadMoreOnScroll".'}]
         * @default "page"
         *
         * @example <caption>Initialize the PagingControl with the <code class="prettyprint">mode</code> attribute specified:</caption>
         * &lt;oj-paging-control mode='loadMore'>&lt;/oj-paging-control>
         *
         * @example <caption>Get or set the <code class="prettyprint">mode</code> property after initialization:</caption>
         * // getter
         * var modeValue = myPagingControl.mode;
         *
         * // setter
         * myPagingControl.mode = 'loadMore';
         */
        mode: 'page',
        /**
         * Triggered when the paging control has finished rendering
         *
         * @expose
         * @event
         * @memberof! oj.ojPagingControl
         * @instance
         *
         * @example <caption>Initialize the paging control with the <code class="prettyprint">ready</code> callback specified:</caption>
         * $( ".selector" ).ojPagingControl({
         *     "ready": function() {}
         * });
         *
         * @example <caption>Bind an event listener to the <code class="prettyprint">ojready</code> event:</caption>
         * $( ".selector" ).on( "ojready", function() {} );
         *
         * @ignore
         */
        ready: null
      },
      /**
       * @private
       */
      _BUNDLE_KEY: {
        _LABEL_ACC_PAGING: 'labelAccPaging',
        _LABEL_ACC_PAGE_NUMBER: 'labelAccPageNumber',
        _LABEL_ACC_NAV_FIRST_PAGE: 'labelAccNavFirstPage',
        _LABEL_ACC_NAV_LAST_PAGE: 'labelAccNavLastPage',
        _LABEL_ACC_NAV_NEXT_PAGE: 'labelAccNavNextPage',
        _LABEL_ACC_NAV_PREVIOUS_PAGE: 'labelAccNavPreviousPage',
        _LABEL_ACC_NAV_PAGE: 'labelAccNavPage',
        _LABEL_LOAD_MORE: 'labelLoadMore',
        _LABEL_LOAD_MORE_MAX_ROWS: 'labelLoadMoreMaxRows',
        _LABEL_NAV_INPUT_PAGE: 'labelNavInputPage',
        _LABEL_NAV_INPUT_PAGE_MAX: 'labelNavInputPageMax',
        _LABEL_NAV_INPUT_PAGE_SUMMARY: 'labelNavInputPageSummary',
        _MSG_ITEM_RANGE_CURRENT: 'msgItemRangeCurrent',
        _MSG_ITEM_RANGE_CURRENT_SINGLE: 'msgItemRangeCurrentSingle',
        _MSG_ITEM_RANGE_ITEMS: 'msgItemRangeItems',
        _MSG_ITEM_RANGE_ATLEAST: 'msgItemRangeOfAtLeast',
        _MSG_ITEM_RANGE_APPROX: 'msgItemRangeOfApprox',
        _MSG_ITEM_RANGE_OF: 'msgItemRangeOf',
        _MSG_ITEM_RANGE_NO_TOTAL: 'msgItemRangeNoTotal',
        _FULL_MSG_ITEM_RANGE_ATLEAST: 'fullMsgItemRangeAtLeast',
        _FULL_MSG_ITEM_RANGE_APPROX: 'fullMsgItemRangeApprox',
        _FULL_MSG_ITEM_RANGE: 'fullMsgItemRange',
        _MSG_ITEM_NO_TOTAL: 'msgItemNoTotal',
        _FULL_MSG_ITEM_ATLEAST: 'fullMsgItemAtLeast',
        _FULL_MSG_ITEM_APPROX: 'fullMsgItemApprox',
        _FULL_MSG_ITEM: 'fullMsgItem',
        _TIP_NAV_INPUT_PAGE: 'tipNavInputPage',
        _TIP_NAV_PAGE_LINK: 'tipNavPageLink',
        _TIP_NAV_NEXT_PAGE: 'tipNavNextPage',
        _TIP_NAV_PREVIOUS_PAGE: 'tipNavPreviousPage',
        _TIP_NAV_FIRST_PAGE: 'tipNavFirstPage',
        _TIP_NAV_LAST_PAGE: 'tipNavLastPage',
        _ERR_PAGE_INVALID_SUMMARY: 'pageInvalid.summary',
        _ERR_PAGE_INVALID_DETAIL: 'pageInvalid.detail',
        _ERR_DATA_INVALID_TYPE_SUMMARY: 'dataInvalidType.summary',
        _ERR_DATA_INVALID_TYPE_DETAIL: 'dataInvalidType.detail',
        _ERR_MAXPAGELINKS_INVALID_SUMMARY: 'maxPageLinksInvalid.summary',
        _ERR_MAXPAGELINKS_INVALID_DETAIL: 'maxPageLinksInvalid.detail'
      },
      /**
       * @private
       */
      _MARKER_STYLE_CLASSES: {
        _WIDGET: 'oj-component',
        _ACTIVE: 'oj-active',
        _CLICKABLE_ICON: 'oj-clickable-icon-nocontext',
        _DISABLED: 'oj-disabled',
        _ENABLED: 'oj-enabled',
        _FOCUS: 'oj-focus',
        _FOCUS_HIGHLIGHT: 'oj-focus-highlight',
        _HOVER: 'oj-hover',
        _SELECTED: 'oj-selected'
      },
      /**
       * @private
       */
      _CSS_CLASSES: {
        _PAGING_CONTROL_CLASS: 'oj-pagingcontrol',
        _PAGING_CONTROL_ACC_LABEL_CLASS: 'oj-pagingcontrol-acc-label',
        _PAGING_CONTROL_ACC_PAGE_LABEL_CLASS: 'oj-pagingcontrol-acc-page-label',
        _PAGING_CONTROL_CONTENT_CLASS: 'oj-pagingcontrol-content',
        _PAGING_CONTROL_LOAD_MORE_CLASS: 'oj-pagingcontrol-loadmore',
        _PAGING_CONTROL_LOAD_MORE_LINK_CLASS: 'oj-pagingcontrol-loadmore-link',
        _PAGING_CONTROL_LOAD_MORE_MAX_ROWS_CLASS: 'oj-pagingcontrol-loadmore-max-rows',
        _PAGING_CONTROL_LOAD_MORE_RANGE_CLASS: 'oj-pagingcontrol-loadmore-range',
        _PAGING_CONTROL_LOAD_MORE_RANGE_CURRENT_CLASS: 'oj-pagingcontrol-loadmore-range-current',
        _PAGING_CONTROL_LOAD_MORE_RANGE_MAX_CLASS: 'oj-pagingcontrol-loadmore-range-max',
        _PAGING_CONTROL_NAV_CLASS: 'oj-pagingcontrol-nav',
        _PAGING_CONTROL_NAV_CLASS_STANDARD: 'oj-pagingcontrol-nav-standard',
        _PAGING_CONTROL_NAV_DOTS_VERTICAL_CLASS: 'oj-pagingcontrol-nav-dots-vertical',
        _PAGING_CONTROL_NAV_ARROW_CLASS: 'oj-pagingcontrol-nav-arrow',
        _PAGING_CONTROL_NAV_ARROW_SECTION_CLASS: 'oj-pagingcontrol-nav-arrow-section',
        _PAGING_CONTROL_NAV_PAGE_CLASS: 'oj-pagingcontrol-nav-page',
        _PAGING_CONTROL_NAV_PAGE_ELLIPSIS_CLASS: 'oj-pagingcontrol-nav-page-ellipsis',
        _PAGING_CONTROL_NAV_DOT_CLASS: 'oj-pagingcontrol-nav-dot',
        _PAGING_CONTROL_NAV_DOT_BULLET_CLASS: 'oj-pagingcontrol-nav-dot-bullet',
        _PAGING_CONTROL_NAV_PAGE_ACC_LABEL_CLASS: 'oj-pagingcontrol-nav-page-acc-label',
        _PAGING_CONTROL_NAV_LABEL_CLASS: 'oj-pagingcontrol-nav-label',
        _PAGING_CONTROL_NAV_INPUT_SECTION_CLASS: 'oj-pagingcontrol-nav-input-section',
        _PAGING_CONTROL_NAV_INPUT_CLASS: 'oj-pagingcontrol-nav-input',
        _PAGING_CONTROL_NAV_INPUT_MAX_CLASS: 'oj-pagingcontrol-nav-input-max',
        _PAGING_CONTROL_NAV_INPUT_SUMMARY_CLASS: 'oj-pagingcontrol-nav-input-summary',
        _PAGING_CONTROL_NAV_INPUT_SUMMARY_CURRENT_CLASS: 'oj-pagingcontrol-nav-input-summary-current',
        _PAGING_CONTROL_NAV_INPUT_SUMMARY_MAX_CLASS: 'oj-pagingcontrol-nav-input-summary-max',
        _PAGING_CONTROL_NAV_PAGES_SECTION_CLASS: 'oj-pagingcontrol-nav-pages-section',
        _PAGING_CONTROL_NAV_PAGES_LINKS_CLASS: 'oj-pagingcontrol-nav-pages-links',
        _PAGING_CONTROL_NAV_FIRST_CLASS: 'oj-pagingcontrol-nav-first',
        _PAGING_CONTROL_NAV_FIRST_ACC_LABEL_CLASS: 'oj-pagingcontrol-nav-first-acc-label',
        _PAGING_CONTROL_NAV_PREVIOUS_CLASS: 'oj-pagingcontrol-nav-previous',
        _PAGING_CONTROL_NAV_PREVIOUS_ACC_LABEL_CLASS: 'oj-pagingcontrol-nav-previous-acc-label',
        _PAGING_CONTROL_NAV_NEXT_CLASS: 'oj-pagingcontrol-nav-next',
        _PAGING_CONTROL_NAV_NEXT_ACC_LABEL_CLASS: 'oj-pagingcontrol-nav-next-acc-label',
        _PAGING_CONTROL_NAV_LAST_CLASS: 'oj-pagingcontrol-nav-last',
        _PAGING_CONTROL_NAV_LAST_ACC_LABEL_CLASS: 'oj-pagingcontrol-nav-last-acc-label',
        _PAGING_CONTROL_NAV_FIRST_ICON_CLASS: 'oj-pagingcontrol-nav-first-icon',
        _PAGING_CONTROL_NAV_PREVIOUS_ICON_CLASS: 'oj-pagingcontrol-nav-previous-icon',
        _PAGING_CONTROL_NAV_NEXT_ICON_CLASS: 'oj-pagingcontrol-nav-next-icon',
        _PAGING_CONTROL_NAV_LAST_ICON_CLASS: 'oj-pagingcontrol-nav-last-icon',
        _PAGING_CONTROL_NAV_FIRST_VERTICAL_ICON_CLASS: 'oj-pagingcontrol-nav-first-vertical-icon',
        _PAGING_CONTROL_NAV_PREVIOUS_VERTICAL_ICON_CLASS:
          'oj-pagingcontrol-nav-previous-vertical-icon',
        _PAGING_CONTROL_NAV_NEXT_VERTICAL_ICON_CLASS: 'oj-pagingcontrol-nav-next-vertical-icon',
        _PAGING_CONTROL_NAV_LAST_VERTICAL_ICON_CLASS: 'oj-pagingcontrol-nav-last-vertical-icon',
        _WIDGET_ICON_CLASS: 'oj-component-icon',
        _HIDDEN_CONTENT_ACC_CLASS: 'oj-helper-hidden-accessible'
      },
      /**
       * @private
       * @type {string}
       */
      _DATA_ATTR_PAGE_NUM: 'data-oj-pagenum',
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
       * @type {string}
       */
      _TAB_INDEX: 'tabindex',
      /**
       * @private
       */
      _MODE: {
        _LOAD_MORE: 'loadMore',
        _PAGE: 'page'
      },
      /**
       * @private
       */
      _PAGE_OPTION_LAYOUT: {
        _AUTO: 'auto',
        _ALL: 'all',
        _INPUT: 'input',
        _RANGE_TEXT: 'rangeText',
        _PAGES: 'pages',
        _NAV: 'nav'
      },
      /**
       * @private
       */
      _PAGING_TABLE_DATA_SOURCE_EVENT_TYPE: {
        _ADD: 'add',
        _REMOVE: 'remove',
        _RESET: 'reset',
        _REFRESH: 'refresh',
        _SYNC: 'sync',
        _SORT: 'sort'
      },
      /**
       * @private
       */
      _PAGE_OPTION_DEFAULT_MAX_PAGE_LINKS: 6,
      /**
       * @private
       */
      _TYPE: {
        _NUMBERS: 'numbers',
        _DOTS: 'dots'
      },
      /** ** start Public APIs ****/

      /**
       * Load the first page of data
       * @expose
       * @memberof oj.ojPagingControl
       * @instance
       * @public
       * @return {Promise.<null>} promise object triggering done when complete.
       * @throws {Error}
       * @export
       * @example <caption>Invoke the <code class="prettyprint">firstPage</code> method:</caption>
       * myPagingControl.firstPage();
       */
      firstPage: function () {
        var data = this._getData();
        if (data != null) {
          return this._invokeUserDataPageFetch(0);
        }
        return this._getRejectPromise();
      },
      /**
       * Load the previous page of data
       * @expose
       * @memberof oj.ojPagingControl
       * @instance
       * @public
       * @return {Promise.<null>} promise object triggering done when complete.
       * @throws {Error}
       * @export
       * @example <caption>Invoke the <code class="prettyprint">previousPage</code> method:</caption>
       * myPagingControl.previousPage();
       */
      previousPage: function () {
        var data = this._getData();
        if (data != null) {
          var page = this._getCurrentPage();
          // can only go to previous page if on 2nd page or greater
          if (page > 0) {
            return this._invokeUserDataPageFetch(page - 1);
          }
        }
        return this._getRejectPromise();
      },
      /**
       * Load the next page of data
       * @expose
       * @memberof oj.ojPagingControl
       * @instance
       * @public
       * @return {Promise.<null>} promise object triggering done when complete.
       * @throws {Error}
       * @export
       * @example <caption>Invoke the <code class="prettyprint">nextPage</code> method:</caption>
       * myPagingControl.nextPage();
       */
      nextPage: function () {
        var data = this._getData();
        if (data != null) {
          var page = this._getCurrentPage();
          if (
            (this._isTotalSizeConfidenceActual() && page + 1 <= this._getTotalPages() - 1) ||
            this._getTotalPages() < 0 ||
            !this._isTotalSizeConfidenceActual()
          ) {
            return this._invokeUserDataPageFetch(page + 1);
          }
        }
        return this._getRejectPromise();
      },
      /**
       * Load the last page of data
       * @expose
       * @memberof oj.ojPagingControl
       * @instance
       * @public
       * @return {Promise.<null>} promise object triggering done when complete.
       * @throws {Error}
       * @export
       * @example <caption>Invoke the <code class="prettyprint">lastPage</code> method:</caption>
       * myPagingControl.lastPage();
       */
      lastPage: function () {
        var data = this._getData();
        if (data != null) {
          if (this._getTotalPages() > 0) {
            return this._invokeUserDataPageFetch(this._getTotalPages() - 1);
          }
        }
        return this._getRejectPromise();
      },
      /**
       * Load the specified page of data
       * @expose
       * @memberof oj.ojPagingControl
       * @instance
       * @public
       * @param {number} page  Page number.
       * @return {Promise.<null>} promise object triggering done when complete.
       * @throws {Error}
       * @export
       * @example <caption>Invoke the <code class="prettyprint">page</code> method:</caption>
       * myPagingControl.page(5);
       */
      page: function (page) {
        var data = this._getData();
        if (data != null) {
          if (
            (this._isTotalSizeConfidenceActual() && page <= this._getTotalPages() - 1) ||
            this._getTotalPages() < 0 ||
            !this._isTotalSizeConfidenceActual()
          ) {
            return this._invokeUserDataPageFetch(page);
          }
        }
        return this._getRejectPromise();
      },
      /**
       * Load the next set of data
       * @expose
       * @memberof oj.ojPagingControl
       * @instance
       * @public
       * @return {Promise.<null>} promise object triggering done when complete.
       * @throws {Error}
       * @export
       * @example <caption>Invoke the <code class="prettyprint">loadNext</code> method:</caption>
       * myPagingControl.loadNext();
       */
      loadNext: function () {
        var data = this._getData();
        if (data != null) {
          return this._invokeDataFetchNext();
        }
        return this._getRejectPromise();
      },
      /**
       * Refresh the paging control.
       * @expose
       * @memberof oj.ojPagingControl
       * @instance
       * @public
       * @export
       * @return {void}
       * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
       * myPagingControl.refresh();
       */
      refresh: function () {
        this._super();
        this._refresh();
      },
      // @inheritdoc
      getNodeBySubId: function (locator) {
        if (locator == null) {
          return this.element ? this.element[0] : null;
        }

        var subId = locator.subId;
        var retval = null;

        if (subId === 'oj-pagingcontrol-nav-input') {
          var isCustomElement = this._IsCustomElement();
          if (!isCustomElement) {
            retval = this._getPagingControlContainer().find(
              '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_CLASS
            )[0];
          } else {
            var pagingControlNavInput = this._getPagingControlNavInput();
            if (pagingControlNavInput) {
              retval = pagingControlNavInput[0];
            } else {
              retval = undefined;
            }
          }
        } else if (subId === 'oj-pagingcontrol-nav-input-max') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_MAX_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-nav-input-summary') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-nav-input-summary-current') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_CURRENT_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-nav-input-summary-max') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_MAX_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-nav-first') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_FIRST_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-nav-next') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-nav-previous') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-nav-last') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_LAST_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-nav-page') {
          var index = locator.index;
          retval = this._getPagingControlContainer().find(
            '[' + this._DATA_ATTR_PAGE_NUM + '=' + index + ']'
          )[0];
        } else if (subId === 'oj-pagingcontrol-load-more-link') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_LINK_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-load-more-range') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_RANGE_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-load-more-range-current') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_RANGE_CURRENT_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-load-more-range-max') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_RANGE_MAX_CLASS
          )[0];
        } else if (subId === 'oj-pagingcontrol-load-more-max-rows') {
          retval = this._getPagingControlContainer().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_MAX_ROWS_CLASS
          )[0];
        }

        // Non-null locators have to be handled by the component subclasses
        if (retval === undefined) {
          retval = null;
        }

        return retval;
      },
      // @inheritdoc
      getSubIdByNode: function (node) {
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_CLASS)) {
          return { subId: 'oj-pagingcontrol-nav-input' };
        }
        if (node && node.tagName === 'OJ-INPUT-TEXT') {
          return { subId: 'oj-pagingcontrol-nav-input' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_MAX_CLASS)) {
          return { subId: 'oj-pagingcontrol-nav-input-max' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_CLASS)) {
          return { subId: 'oj-pagingcontrol-nav-input-summary' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_CURRENT_CLASS)) {
          return { subId: 'oj-pagingcontrol-nav-input-summary-current' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_MAX_CLASS)) {
          return { subId: 'oj-pagingcontrol-nav-input-summary-max' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_FIRST_CLASS)) {
          return { subId: 'oj-pagingcontrol-nav-first' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_CLASS)) {
          return { subId: 'oj-pagingcontrol-nav-next' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_CLASS)) {
          return { subId: 'oj-pagingcontrol-nav-previous' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_LAST_CLASS)) {
          return { subId: 'oj-pagingcontrol-nav-last' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_PAGE_CLASS)) {
          return {
            subId: 'oj-pagingcontrol-nav-page',
            index: $(node).attr(this._DATA_ATTR_PAGE_NUM)
          };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_LINK_CLASS)) {
          return { subId: 'oj-pagingcontrol-load-more-link' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_RANGE_CLASS)) {
          return { subId: 'oj-pagingcontrol-load-more-range' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_RANGE_CURRENT_CLASS)) {
          return { subId: 'oj-pagingcontrol-load-more-range-current' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_RANGE_MAX_CLASS)) {
          return { subId: 'oj-pagingcontrol-load-more-range-max' };
        }
        if ($(node).hasClass(this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_MAX_ROWS_CLASS)) {
          return { subId: 'oj-pagingcontrol-load-more-max-rows' };
        }

        return null;
      },
      /** ** end Public APIs ****/

      /** ** start internal widget functions ****/

      /**
       * @override
       * @protected
       * @instance
       * @memberof! oj.ojPagingControl
       */
      _ComponentCreate: function () {
        this._super();
        this._draw();
        this._on(this._events);
      },
      /**
       * Initialize the paging control after creation
       * @protected
       * @override
       * @memberof! oj.ojPagingControl
       */
      _AfterCreate: function () {
        this._super();
        this._isInitFetch = true;
      },
      /**
       * Sets up needed resources for paging control, for example, add
       * listeners.
       * @protected
       * @override
       * @memberof! oj.ojPagingControl
       */
      _SetupResources: function () {
        this._super();
        this._registerSwipeHandler();
        this._registerResizeListener(this._getPagingControlContainer());
        this._registerDataSourceEventListeners();
        if (this._isInitFetch) {
          this._setInitialPage();
          this._isInitFetch = false;
        } else {
          this._refresh();
        }
        // in case component is destroyed then revived.
        this._componentDestroyed = false;
      },
      /**
       * Releases resources for paging control.
       * @protected
       * @override
       * @memberof! oj.ojPagingControl
       */
      _ReleaseResources: function () {
        this._super();
        // unregister the listeners on the datasource
        this._unregisterDataSourceEventListeners();
        this._unregisterResizeListener();
        this._unregisterSwipeHandler();

        // Remove any pending busy states
        if (this._busyStateResolvers) {
          var resolver = this._busyStateResolvers.pop();
          while (resolver) {
            resolver();
            resolver = this._busyStateResolvers.pop();
          }
          this._busyStateResolvers = null;
        }

        // invalidate our refresh/fetch queue
        this._componentDestroyed = true;
      },
      /**
       * Called by component to add a busy state and return the resolve function
       * to call when the busy state can be removed.
       * @private
       */
      _addComponentBusyState: function (msg) {
        var busyContext = Context.getContext(this.element[0]).getBusyContext();
        var options = {
          description: "The component identified by '" + this.element.attr('id') + "' " + msg
        };
        var resolver = busyContext.addBusyState(options);

        // Keep track of the busy state resolvers so that we can clean up later
        if (!this._busyStateResolvers) {
          this._busyStateResolvers = [];
        }
        this._busyStateResolvers.push(resolver);

        return resolver;
      },
      /**
       * Called by component to remove a busy state.
       * @private
       */
      _removeComponentBusyState: function (resolver) {
        // Remove the busy state resolver from tracking
        if (this._busyStateResolvers) {
          var index = this._busyStateResolvers.indexOf(resolver);
          if (index >= 0) {
            this._busyStateResolvers.splice(index, 1);

            // Resolve the busy state only if it's found in the tracking list
            // to avoid busy state getting resolved twice.  e.g. some component
            // code may still be executed after all busy states are cleaned up
            // in _destroy.
            resolver();
          }
        }
      },
      /**
       * @override
       * @private
       */
      _destroy: function () {
        this._unregisterDataSourceEventListeners();
        this._unregisterSwipeHandler();

        // Remove any pending busy states
        if (this._busyStateResolvers) {
          var resolver = this._busyStateResolvers.pop();
          while (resolver) {
            resolver();
            resolver = this._busyStateResolvers.pop();
          }
          this._busyStateResolvers = null;
        }

        // invalidate our refresh/fetch queue
        this._componentDestroyed = true;
      },
      /**
       * @override
       * @private
       */
      _draw: function () {
        var options = this.options;
        // add main css class to element
        this.element.addClass(this._CSS_CLASSES._PAGING_CONTROL_CLASS);
        this.element.addClass(this._MARKER_STYLE_CLASSES._WIDGET);

        this._createAccPageLabel();
        this._createPagingControlAccLabel();
        this._createPagingControlContent();
        this._mode = options.mode;

        if (options.mode === this._MODE._LOAD_MORE) {
          this._createPagingControlLoadMore();
          this._createPagingControlLoadMoreLink();
          this._createPagingControlLoadMoreRange();
        } else {
          this._createPagingControlNav();
        }
      },
      /**
       * @override
       * @private
       */
      _events: {
        /*
         * invoke loading next page of data
         */
        'mouseup .oj-pagingcontrol-loadmore-link': function (event) {
          this.loadNext();
          // we need to listen to mouseup because click is not
          // reliable on MacOS X
          $(event.target).data('_mouseup', true);
          event.preventDefault();
        },
        /*
         * invoke loading next page of data
         */
        'click .oj-pagingcontrol-loadmore-link': function (event) {
          if ($(event.target).data('_mouseup')) {
            $(event.target).data('_mouseup', false);
          } else {
            this.loadNext();
          }
          event.preventDefault();
        },
        /*
         * invoke loading page of data
         */
        'click .oj-pagingcontrol-nav-dot': function (event) {
          this._invokeLoadPageDataFromEvent(event);
        },
        /*
         * invoke loading page of data
         */
        'click .oj-pagingcontrol-nav-page': function (event) {
          this._invokeLoadPageDataFromEvent(event);
        },
        /*
         * invoke loading first page of data
         */
        'click .oj-pagingcontrol-nav-first': function (event) {
          if (!$(event.currentTarget).hasClass(this._MARKER_STYLE_CLASSES._DISABLED)) {
            this.firstPage();
          }
          event.preventDefault();
        },
        /*
         * invoke loading previous page of data
         */
        'click .oj-pagingcontrol-nav-previous': function (event) {
          if (!$(event.currentTarget).hasClass(this._MARKER_STYLE_CLASSES._DISABLED)) {
            this.previousPage();
          }
          event.preventDefault();
        },
        /*
         * invoke loading next page of data
         */
        'click .oj-pagingcontrol-nav-next': function (event) {
          if (!$(event.currentTarget).hasClass(this._MARKER_STYLE_CLASSES._DISABLED)) {
            this.nextPage();
          }
          event.preventDefault();
        },
        /*
         * invoke loading last page of data
         */
        'click .oj-pagingcontrol-nav-last': function (event) {
          if (!$(event.currentTarget).hasClass(this._MARKER_STYLE_CLASSES._DISABLED)) {
            this.lastPage();
          }
          event.preventDefault();
        },
        /*
         * prevent submission of form on enter
         */
        'keypress .oj-pagingcontrol-nav-input': function (event) {
          var keyCode = event.which;

          if (keyCode === 13) {
            event.preventDefault();
          }
        },
        /*
         * Add oj-active
         */
        'mousedown .oj-pagingcontrol-nav-first': function (event) {
          this._setActive(event);
        },
        /*
         * Add oj-active
         */
        'mousedown .oj-pagingcontrol-nav-previous': function (event) {
          this._setActive(event);
        },
        /*
         * Add oj-active
         */
        'mousedown .oj-pagingcontrol-nav-next': function (event) {
          this._setActive(event);
        },
        /*
         * Add oj-active
         */
        'mousedown .oj-pagingcontrol-nav-last': function (event) {
          this._setActive(event);
        },
        /*
         * Remove oj-active
         */
        'mouseup .oj-pagingcontrol-nav-first': function (event) {
          this._removeActive(event);
        },
        /*
         * Remove oj-active
         */
        'mouseup .oj-pagingcontrol-nav-previous': function (event) {
          this._removeActive(event);
        },
        /*
         * Remove oj-active
         */
        'mouseup .oj-pagingcontrol-nav-next': function (event) {
          this._removeActive(event);
        },
        /*
         * Remove oj-active
         */
        'mouseup .oj-pagingcontrol-nav-last': function (event) {
          this._removeActive(event);
        },
        /*
         * Remove oj-active
         */
        'mouseleave .oj-pagingcontrol-nav-first': function (event) {
          this._removeActive(event);
        },
        /*
         * Remove oj-active
         */
        'mouseleave .oj-pagingcontrol-nav-previous': function (event) {
          this._removeActive(event);
        },
        /*
         * Remove oj-active
         */
        'mouseleave .oj-pagingcontrol-nav-next': function (event) {
          this._removeActive(event);
        },
        /*
         * Remove oj-active
         */
        'mouseleave .oj-pagingcontrol-nav-last': function (event) {
          this._removeActive(event);
        }
      },
      /**
       * @private
       */
      _refresh: function () {
        if (this._data !== this.options.data) {
          this._clearCachedDataMetadata();
          this._setInitialPage();
        }

        var size = 0;
        var startIndex = 0;

        if (this._data != null) {
          startIndex = this._data.getStartItemIndex();
        }

        // if totalSize == 0 then size is just 0. If totalSize < 0 then
        // we have unknown row count, if totalSize > 0 then we have a known row count.
        // For non-zero unknown row count and non-zero known row count
        // we need to calculate the rows on the page.
        if (this._data != null && this._data.totalSize() !== 0 && this._data.getEndItemIndex() >= 0) {
          // startIndex = 0 for loadMore mode
          size = this._data.getEndItemIndex() - startIndex + 1;
        }

        this._mode = this.options.mode;

        if (this.options.mode === this._MODE._LOAD_MORE) {
          this._refreshPagingControlLoadMore(size, startIndex);
        } else {
          this._refreshPagingControlNav(size, startIndex);
        }
      },
      /**
       * @override
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _setOption: function (key, value) {
        this._superApply(arguments);
        this._invokeDataPage(0, true);

        if (this.options.mode !== this._MODE._LOAD_MORE && key === 'pageOptions') {
          var pagingControlContent = this._getPagingControlContent();
          if (pagingControlContent != null) {
            this._unregisterChildStateListeners(pagingControlContent);
            this._unregisterSwipeHandler();
            pagingControlContent.empty();
          }
          this._clearCachedDomPagingControlNav();
          this._createPagingControlNav();
          this._registerSwipeHandler();
        }
        this._queueRefresh();
      },
      /** ** end internal widget functions ****/

      /** ** start internal functions ****/
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
      /**
       * Clear cached range text DOM
       * @private
       */
      _clearCachedDomLoadMore: function () {
        this._cachedDomPagingControlLoadMore = null;
        this._cachedDomPagingControlLoadMoreLink = null;
        this._cachedDomPagingControlLoadMoreRange = null;
      },
      /**
       * Clear any cached DOM nav elements
       * @private
       */
      _clearCachedDomPagingControlNav: function () {
        this._cachedDomPagingControlNav = null;
        this._cachedDomPagingControlNavInput = null;
        this._cachedDomPagingControlNavInputSummary = null;
      },
      /**
       * On Page link/dot click
       * @private
       */
      _invokeLoadPageDataFromEvent: function (event) {
        if (!$(event.currentTarget).hasClass(this._MARKER_STYLE_CLASSES._DISABLED)) {
          var pageNum = $(event.currentTarget).attr('data-oj-pagenum');
          this.page(pageNum);
        }
        event.preventDefault();
      },
      /**
       * Helper method to add oj-active
       * @private
       */
      _setActive: function (event) {
        if (!$(event.currentTarget).hasClass(this._MARKER_STYLE_CLASSES._DISABLED)) {
          $(event.target).addClass(this._MARKER_STYLE_CLASSES._ACTIVE);
        }
        event.preventDefault();
      },
      /**
       * Helper method to remove oj-active
       * @private
       */
      _removeActive: function (event) {
        $(event.target).removeClass(this._MARKER_STYLE_CLASSES._ACTIVE);
        event.preventDefault();
      },
      /**
       * Create navigation arrow element
       * @param {string} typeClass  CSS class for the arrow type
       * @param {string} iconClass  CSS class for the arrow icon
       * @param {string} tipKey  Bundle key for the tooltip text
       * @param {string} accLabelKey  Bundle key for the accessibility label text
       * @param {string} accLabelClass  CSS class for the accessibility label
       * @param {boolean} isVertical  Whether the paging control is vertical
       * @return {jQuery} The navigation arrow jQuery object
       * @private
       */
      _createNavArrow: function (
        typeClass,
        iconClass,
        tipKey,
        accLabelKey,
        accLabelClass,
        isVertical
      ) {
        var navArrow = $(document.createElement('a'));

        // JAWS on Firefox does not read aria-disabled state on links, even
        // though Chrome and IE do. Need to add a button role for it to be read.
        navArrow.attr('role', 'button');

        navArrow.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_ARROW_CLASS);
        navArrow.addClass(typeClass);
        navArrow.addClass(iconClass);
        navArrow.addClass(this._CSS_CLASSES._WIDGET_ICON_CLASS);
        navArrow.addClass(this._MARKER_STYLE_CLASSES._CLICKABLE_ICON);
        navArrow.addClass(this._MARKER_STYLE_CLASSES._DISABLED);

        // Use aria-disabled to specify the disabled state because there is
        // no disabled attribute on <a> element.
        navArrow.attr('aria-disabled', 'true');

        var navArrowTip = this.getTranslatedString(tipKey);
        this._AddHoverable(navArrow);
        this._focusable({ element: navArrow, applyHighlight: true });
        navArrow.attr('title', navArrowTip);
        navArrow.attr(this._TAB_INDEX, '0'); // @HTMLUpdateOK
        navArrow.attr('href', '#');
        navArrow[0].oncontextmenu = function () {
          return false;
        };

        var accLabelText = this.getTranslatedString(accLabelKey);

        // Add an aria-label on the button.  Otherwise screen reader will
        // use the text content, which includes the arrow ::before pseudo-element.
        // Even though the arrow is not read, it will be displayed as a non-printable
        // character in things like buttons list in screen reader and interfere
        // with keyboard selection.
        navArrow.attr('aria-label', accLabelText);

        var accLabel = this._createAccLabelSpan(accLabelText, accLabelClass);
        navArrow.append(accLabel); // @HTMLUpdateOK
        if (isVertical) {
          navArrow.css('display', 'block');
        }
        return navArrow;
      },
      /**
       * Disable/enable navigation arrow element
       * @param {jQuery} navArrow  the navigation arrow jQuery object
       * @param {boolean} disable  true to disable; false to enable
       * @private
       */
      _disableNavArrow: function (navArrow, disable) {
        if (disable) {
          navArrow.addClass(this._MARKER_STYLE_CLASSES._DISABLED);
          navArrow.removeClass(this._MARKER_STYLE_CLASSES._ENABLED);
          navArrow.removeClass(this._MARKER_STYLE_CLASSES._FOCUS_HIGHLIGHT);
          navArrow.removeClass(this._MARKER_STYLE_CLASSES._FOCUS);
          navArrow.attr('aria-disabled', 'true');
          navArrow.attr('tabindex', '-1');
        } else {
          navArrow.addClass(this._MARKER_STYLE_CLASSES._ENABLED);
          navArrow.removeClass(this._MARKER_STYLE_CLASSES._DISABLED);
          navArrow.removeAttr('aria-disabled');
          navArrow.attr(this._TAB_INDEX, '0'); // @HTMLUpdateOK
        }
      },
      /**
       * Return the current page
       * @return {number} Current page.
       * @throws {Error}
       * @private
       */
      _getCurrentPage: function () {
        var data = this._getData();
        var page = 0;
        if (data != null) {
          page = data.getPage();
        }
        return page;
      },
      /**
       * Return the datasource object defined for this paging control
       * @return {Object} Datasource object.
       * @throws {Error}
       * @private
       */
      _getData: function () {
        if (!this._data && this.options.data != null) {
          this._data = this.options.data;
          this._dataMetadata = this.options.data;

          // In case we get a delayed setting of the data property--check to rebind the listeners
          this._registerDataSourceEventListeners();
        }
        return this._data;
      },
      /**
       * Return the item range text span
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @return {Object} Item range text span element.
       * @throws {Error}
       * @private
       */
      _getItemRange: function (size, startIndex) {
        var pageFrom = startIndex >= 0 ? startIndex : 0;
        var itemRangeSpan = $(document.createElement('span'));
        var itemRangeCurrentSpan = $(document.createElement('span'));
        if (this.options.mode === this._MODE._LOAD_MORE) {
          itemRangeCurrentSpan.addClass(
            this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_RANGE_CURRENT_CLASS
          );
        } else {
          itemRangeCurrentSpan.addClass(
            this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_CURRENT_CLASS
          );
        }
        itemRangeSpan.append(itemRangeCurrentSpan); // @HTMLUpdateOK
        var data = this._getData();
        var itemRangeCurrentText;
        var pageTo;

        // If the single line translations exist, use those
        // otherwise default to previous method.
        if (
          this.getTranslatedString(this._BUNDLE_KEY._MSG_ITEM_RANGE_NO_TOTAL, {
            pageTo: pageTo,
            pageFrom: 0
          }) !== null
        ) {
          if (data != null && data.totalSize() != null && size != null) {
            pageTo = parseInt(startIndex, 10) + parseInt(size, 10);
            pageFrom = pageTo > 0 ? pageFrom + 1 : 0;
            var isRange = true;
            if (data.totalSize() !== -1) {
              pageTo = pageTo > data.totalSize() ? data.totalSize() : pageTo;
              if (pageFrom === pageTo) {
                isRange = false;
              } else if (pageFrom > pageTo) {
                // this can happen if we go from unknown to known row count and the last page has no rows. In that case don't return anything
                return itemRangeSpan;
              }

              var keyString;
              if (isRange) {
                if (data.totalSizeConfidence() === 'atLeast') {
                  keyString = this._BUNDLE_KEY._FULL_MSG_ITEM_RANGE_ATLEAST;
                } else if (data.totalSizeConfidence() === 'estimate') {
                  keyString = this._BUNDLE_KEY._FULL_MSG_ITEM_RANGE_APPROX;
                } else {
                  keyString = this._BUNDLE_KEY._FULL_MSG_ITEM_RANGE;
                }
                itemRangeCurrentText = this.getTranslatedString(keyString, {
                  pageFrom: pageFrom,
                  pageTo: pageTo,
                  pageMax: data.totalSize()
                });
              } else {
                if (data.totalSizeConfidence() === 'atLeast') {
                  keyString = this._BUNDLE_KEY._FULL_MSG_ITEM_ATLEAST;
                } else if (data.totalSizeConfidence() === 'estimate') {
                  keyString = this._BUNDLE_KEY._FULL_MSG_ITEM_APPROX;
                } else {
                  keyString = this._BUNDLE_KEY._FULL_MSG_ITEM;
                }
                itemRangeCurrentText = this.getTranslatedString(keyString, {
                  pageTo: pageTo,
                  pageMax: data.totalSize()
                });
              }
            } else if (size === 0) {
              itemRangeCurrentText = this.getTranslatedString(this._BUNDLE_KEY._MSG_ITEM_NO_TOTAL, {
                pageTo: 0
              });
            } else {
              itemRangeCurrentText = this.getTranslatedString(
                this._BUNDLE_KEY._MSG_ITEM_RANGE_NO_TOTAL,
                { pageFrom: pageFrom, pageTo: pageTo }
              );
            }
          }
        } else if (data != null && data.totalSize() != null && size != null) {
          pageTo = parseInt(startIndex, 10) + parseInt(size, 10);
          pageFrom = pageTo > 0 ? pageFrom + 1 : 0;

          var itemRangeItemsText;
          var itemRangeItemsSpan;
          if (data.totalSize() !== -1) {
            pageTo = pageTo > data.totalSize() ? data.totalSize() : pageTo;
            if (pageFrom === pageTo) {
              itemRangeCurrentText = this.getTranslatedString(
                this._BUNDLE_KEY._MSG_ITEM_RANGE_CURRENT_SINGLE,
                { pageFrom: pageFrom }
              );
            } else if (pageFrom > pageTo) {
              // this can happen if we go from unknown to known row count and the last page has no rows. In that case don't return anything
              return itemRangeSpan;
            } else {
              itemRangeCurrentText = this.getTranslatedString(
                this._BUNDLE_KEY._MSG_ITEM_RANGE_CURRENT,
                { pageFrom: pageFrom, pageTo: pageTo }
              );
            }
            var itemRangeOfText = this.getTranslatedString(this._BUNDLE_KEY._MSG_ITEM_RANGE_OF);
            var itemRangeConf = null;

            if (data.totalSizeConfidence() === 'atLeast') {
              itemRangeConf = this.getTranslatedString(this._BUNDLE_KEY._MSG_ITEM_RANGE_ATLEAST);
            } else if (data.totalSizeConfidence() === 'estimate') {
              itemRangeConf = this.getTranslatedString(this._BUNDLE_KEY._MSG_ITEM_RANGE_APPROX);
            }

            var itemRangeOfSpan = $(document.createElement('span'));

            if (itemRangeConf == null) {
              itemRangeOfSpan.text(' ' + itemRangeOfText + ' ');
            } else {
              itemRangeOfSpan.text(' ' + itemRangeConf + ' ');
            }
            itemRangeSpan.append(itemRangeOfSpan); // @HTMLUpdateOK
            var itemRangeMaxSpan = $(document.createElement('span'));
            if (this.options.mode === this._MODE._LOAD_MORE) {
              itemRangeMaxSpan.addClass(this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_RANGE_MAX_CLASS);
            } else {
              itemRangeMaxSpan.addClass(
                this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_MAX_CLASS
              );
            }
            itemRangeMaxSpan.text(data.totalSize());
            itemRangeSpan.append(itemRangeMaxSpan); // @HTMLUpdateOK
            itemRangeItemsText = this.getTranslatedString(this._BUNDLE_KEY._MSG_ITEM_RANGE_ITEMS);
            itemRangeItemsSpan = $(document.createElement('span'));
            itemRangeItemsSpan.text(' ' + itemRangeItemsText);
            itemRangeSpan.append(itemRangeItemsSpan); // @HTMLUpdateOK
          } else {
            if (size === 0) {
              itemRangeCurrentText = this.getTranslatedString(
                this._BUNDLE_KEY._MSG_ITEM_RANGE_CURRENT_SINGLE,
                { pageFrom: 0 }
              );
            } else {
              itemRangeCurrentText = this.getTranslatedString(
                this._BUNDLE_KEY._MSG_ITEM_RANGE_CURRENT,
                { pageFrom: pageFrom, pageTo: pageTo }
              );
            }
            itemRangeItemsText = this.getTranslatedString(this._BUNDLE_KEY._MSG_ITEM_RANGE_ITEMS);
            itemRangeItemsSpan = $(document.createElement('span'));
            itemRangeItemsSpan.text(' ' + itemRangeItemsText);
            itemRangeSpan.append(itemRangeItemsSpan); // @HTMLUpdateOK
          }
        }
        itemRangeCurrentSpan.text(itemRangeCurrentText);
        return itemRangeSpan;
      },
      /**
       * Return maximum number of page links
       * @return {number} Max page links.
       * @private
       */
      _getMaxPageLinks: function () {
        var maxPageLinks = this.options.pageOptions.maxPageLinks;

        if (this.options.pageOptions.type === this._TYPE._DOTS) {
          maxPageLinks = Number.MAX_VALUE;
        } else if (!maxPageLinks) {
          maxPageLinks = this._PAGE_OPTION_DEFAULT_MAX_PAGE_LINKS;
        }

        return maxPageLinks;
      },
      /**
       * @param {number} size Number of rows
       * @private
       */
      _getMaxPageVal: function (size) {
        var maxPageVal = 0;

        if (this._getTotalPages() > 0 && this._isTotalSizeConfidenceActual()) {
          maxPageVal = this._getTotalPages();
        } else if (size > 0) {
          var data = this._getData();
          if (
            data != null &&
            (data.totalSizeConfidence() === 'atLeast' || data.totalSizeConfidence() === 'estimate')
          ) {
            maxPageVal = this._getTotalPages() + 1;
          } else {
            maxPageVal = this._getCurrentPage() + 2;
          }
        } else {
          maxPageVal = this._getCurrentPage() + 1;
        }
        return maxPageVal;
      },
      /**
       * Return reject Promise
       * @return {Promise} promise object reject.
       * @private
       */
      _getRejectPromise: function () {
        return Promise.reject();
      },
      /**
       * Return the total number of pages
       * @return {number} Total pages.
       * @throws {Error}
       * @private
       */
      _getTotalPages: function () {
        var data = this._getData();
        var pageCount = 0;
        if (data != null) {
          pageCount = data.getPageCount();
        }
        // if pageCount is not valid then treat it as zero
        pageCount = pageCount >= -1 ? pageCount : 0;
        return pageCount;
      },
      /**
       * Callback handler for fetch completed in the datasource.
       * status message.
       * @param {Object} event
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _handleDataFetchEnd: function (event) {
        this._handleFocusAfterFetch();
        this._queueRefresh();
      },
      /**
       * Set Focus after fetch
       * status message.
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _handleFocusAfterFetch: function () {
        // restore focus
        var activeElement = $(document.activeElement);
        var self = this;

        if (activeElement.hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_PAGE_CLASS)) {
          var pageNum = parseInt(activeElement.attr('data-oj-pagenum'), 10);
          setTimeout(function () {
            if (pageNum >= 0) {
              // try to focus on the next page. If not the previous page
              var nextPageNum = pageNum + 1;
              var prevPageNum = pageNum - 1;
              var nextNavPage = self
                ._getPagingControlContent()
                .find('a[data-oj-pagenum=' + nextPageNum + ']');

              if (nextNavPage != null && nextNavPage.length > 0) {
                nextNavPage.focus();
              } else {
                var prevNavPage = self
                  ._getPagingControlContent()
                  .find('a[data-oj-pagenum=' + prevPageNum + ']');

                if (prevNavPage != null && prevNavPage.length > 0) {
                  prevNavPage.focus();
                }
              }
            }
            pageNum = null;
            self = null;
          }, 100);
        } else if (activeElement.hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_FIRST_CLASS)) {
          setTimeout(function () {
            // since we are already in the first page, focus should be on next arrow.
            var nextArrow = self
              ._getPagingControlContent()
              .find('.' + self._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_CLASS);
            nextArrow.focus();
            self = null;
          }, 100);
        } else if (activeElement.hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_CLASS)) {
          setTimeout(function () {
            var previousArrow = self
              ._getPagingControlContent()
              .find('.' + self._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_CLASS);
            if (!previousArrow.hasClass(self._MARKER_STYLE_CLASSES._DISABLED)) {
              previousArrow.focus();
            } else {
              var nextArrow = self
                ._getPagingControlContent()
                .find('.' + self._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_CLASS);
              nextArrow.focus();
            }
            self = null;
          }, 100);
        } else if (activeElement.hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_CLASS)) {
          setTimeout(function () {
            var nextArrow = self
              ._getPagingControlContent()
              .find('.' + self._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_CLASS);
            if (!nextArrow.hasClass(self._MARKER_STYLE_CLASSES._DISABLED)) {
              nextArrow.focus();
            } else {
              var previousArrow = self
                ._getPagingControlContent()
                .find('.' + self._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_CLASS);
              previousArrow.focus();
            }
            self = null;
          }, 100);
        } else if (activeElement.hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_LAST_CLASS)) {
          setTimeout(function () {
            var previousArrow = self
              ._getPagingControlContent()
              .find('.' + self._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_CLASS);
            previousArrow.focus();
            self = null;
          }, 100);
        } else if (activeElement.hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_CLASS)) {
          setTimeout(function () {
            var navInput = self
              ._getPagingControlContent()
              .find('.' + self._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_CLASS);
            navInput.focus();
            self = null;
          }, 100);
        } else if (activeElement.hasClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_DOT_CLASS)) {
          setTimeout(function () {
            var navInput = self
              ._getPagingControlContent()
              .find('.' + self._CSS_CLASSES._PAGING_CONTROL_NAV_DOT_CLASS);
            var currInputIdx;
            var nextInput;
            navInput.each(function (idx, element) {
              // selected nav dot will be div
              if (element.localName === 'div') {
                currInputIdx = idx;
              }
            });
            if (currInputIdx != null) {
              // if currInputIdx is already last element, set nextInput to previous
              if (currInputIdx === navInput.length - 1) {
                nextInput = navInput[Math.max(currInputIdx - 1, 0)];
              } else {
                nextInput = navInput[currInputIdx + 1];
              }
              nextInput.focus();
            }
            self = null;
          }, 100);
        }
      },
      /**
       * Callback handler for page event in the datasource.
       * status message.
       * @param {Object} event
       * @private
       */
      _handleDataPage: function (event) {
        var pageData = event.detail != null ? event.detail : event;
        var page = pageData.page;
        var previousPage = pageData.previousPage;

        // only refresh if page has changed
        if (page !== previousPage) {
          // handle focus if needed for nav arrow
          this._handleFocusAfterFetch();
          this._queueRefresh();
        }
      },
      /**
       * Callback handler for reset in the datasource.
       * status message.
       * @param {Object} event
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _handleDataReset: function (event) {
        this._invokeDataPage(0, false);
      },
      /**
       * Callback handler for refresh in the datasource.
       * status message.
       * @param {Object} event
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _handleDataRefresh: function (event) {
        // if in loadMoreOnScroll mode, reset the start index.
        this._currentStartIndex = 0;
        this._queueRefresh();
      },
      /**
       * Callback handler for sort in the datasource.
       * status message.
       * @param {Object} event
       * @private
       */
      _handleDataSort: function (event) {
        // Do a reset if the paging mode is loadmore, otherwise just refresh
        if (this.options.mode === this._MODE._LOAD_MORE) {
          this._handleDataReset(event);
        }
      },
      /**
       * Callback handler for row added into the datasource.
       * status message.
       * @param {Object} event
       * @private
       */
      _handleDataRowAdd: function (event) {
        if (this._isOperationOnCurrentPage(event)) {
          if (this.options.mode === this._MODE._PAGE) {
            // this means that the add caused the pages to shift or
            // the row was added to the current page and the first page is full already
            // so we need to re-fetch the current page
            this._invokeDataPage(this._getCurrentPage(), true);
            return;
          }

          this._invokeDataFetchCurrent();
          return;
        }
        this._queueRefresh();
      },
      /**
       * Callback handler for row removed in the datasource.
       * status message.
       * @param {Object} event
       * @private
       */
      _handleDataRowRemove: function (event) {
        if (this.options.mode === this._MODE._PAGE) {
          if (this._getTotalPages() > 0 && this._getCurrentPage() > this._getTotalPages() - 1) {
            // if the number of pages decreased due to the removal, then
            // reset the page
            this._invokeDataPage(this._getTotalPages() - 1, true);
            return;
          } else if (this._isOperationOnCurrentPage(event)) {
            // this means that the remove caused the pages to shift or
            // the row was deleted from the current page
            // so we need to re-fetch the current page
            this._invokeDataPage(this._getCurrentPage(), true);
            return;
          }
        } else if (this._isOperationOnCurrentPage(event)) {
          this._invokeDataFetchCurrent();
          return;
        }
        this._queueRefresh();
      },
      /**
       * Callback handler for page change.
       * @param {Object} event
       * @private
       */
      _handlePageChange: function (event, data) {
        var isCustomElement = this._IsCustomElement();
        if (!isCustomElement) {
          var option = data.option;
          if (option !== 'value') {
            return;
          }
        }
        var page = isCustomElement ? event.detail.value : data.value;
        if (page !== this._getCurrentPage() + 1 && !isNaN(page) && page > 0) {
          page = Math.round(page);
          this.page(page - 1);
        }
      },
      /**
       * User triggered Set page
       * @param {number} page Page
       * @return (Promise} Page Promise
       * @private
       */
      _invokeUserDataPageFetch: function (page) {
        if (this._userDataPageFetching) {
          return Promise.reject('Another user page fetch is ongoing');
        }
        this._userDataPageFetching = true;
        return this._invokeDataPage(page, false);
      },
      /**
       * Set page
       * @param {number} page Page
       * @param {boolean} async Asynchronous
       * @return (Promise} Page Promise
       * @private
       */
      _invokeDataPage: function (page, async) {
        try {
          // eslint-disable-next-line no-param-reassign
          page = parseInt(page, 10);
        } catch (e) {
          this._userDataPageFetching = false;
          return Promise.reject(e);
        }

        this._currentStartIndex = 0;
        var self = this;
        setTimeout(function () {
          self._resetPagingControlNavInput();
        }, 0);

        if (async) {
          // clear stop fetch action flag in case it was set earlier
          this._stopFetchAction = false;
          this._queuePageFetch(page);
          return Promise.resolve();
        }

        return this._invokeDataSetPage(page);
      },
      /**
       * Set the current page in the datasource
       * @param {number} page Page
       * @return (Promise} Page Promise
       * @private
       */
      _invokeDataSetPage: function (page) {
        var data = this._getData();
        var self = this;
        return new Promise(function (resolve, reject) {
          if (data != null) {
            var resolveBusyState = self._addComponentBusyState('is setting page.');
            data.setPage(page, { pageSize: self.options.pageSize }).then(
              function () {
                // update the page label with the new page number
                var accPageLabel = self._getPagingControlAccPageLabel();
                accPageLabel.childNodes[0].nodeValue = self.getTranslatedString(
                  self._BUNDLE_KEY._LABEL_ACC_PAGE_NUMBER,
                  { pageNum: page + 1 }
                );

                self._removeComponentBusyState(resolveBusyState);
                self._userDataPageFetching = false;
                self = null;
                resolveBusyState = null;
                resolve(null);
              },
              function (error) {
                self._removeComponentBusyState(resolveBusyState);
                self._userDataPageFetching = false;
                self = null;
                resolveBusyState = null;
                reject(error);
              }
            );
            data = null;
          } else {
            self._userDataPageFetching = false;
            self = null;
            resolve(null);
          }
        });
      },
      /**
       * Fetch the next set of rows
       * @return (Promise} Promise
       * @private
       */
      _invokeDataFetchNext: function () {
        var pageSize = this.options.pageSize;

        if (!this._currentStartIndex) {
          this._currentStartIndex = pageSize;
        } else {
          this._currentStartIndex += pageSize;
        }

        return this._invokeDataFetch({ startIndex: this._currentStartIndex, pageSize: pageSize });
      },
      /**
       * Fetch data rows using specified options
       * @param {Object} options Options to control fetch
       * @return (Promise} Promise
       * @private
       */
      _invokeDataFetch: function (options) {
        var data = this._getData();

        if (
          !this._isTotalSizeConfidenceActual() ||
          (data.totalSize() > this._currentStartIndex && this._isTotalSizeConfidenceActual())
        ) {
          var self = this;
          // If is dataproviderview, do a setpage with large fetch size instead
          // this should be depreciated for loadmore, so leave it as is for now
          if (data != null && oj.DataProviderFeatureChecker.isDataProvider(data)) {
            return new Promise(function (resolve, reject) {
              var resolveBusyState = self._addComponentBusyState('is setting page.');
              var totalSize = options.pageSize + options.startIndex;
              data.setPage(0, { pageSize: totalSize }).then(
                function () {
                  self._removeComponentBusyState(resolveBusyState);
                  self = null;
                  resolveBusyState = null;
                  resolve(null);
                },
                function (error) {
                  self._removeComponentBusyState(resolveBusyState);
                  self = null;
                  resolveBusyState = null;
                  reject(error);
                }
              );
              data = null;
            });
          }
          return new Promise(function (resolve, reject) {
            var resolveBusyState = self._addComponentBusyState('is fetching data.');
            data.fetch(options).then(
              function (result) {
                self._removeComponentBusyState(resolveBusyState);
                self = null;
                resolveBusyState = null;
                resolve(result);
              },
              function (err) {
                self._removeComponentBusyState(resolveBusyState);
                self = null;
                resolveBusyState = null;
                reject(err);
              }
            );
            data = null;
          });
        }
        return Promise.resolve();
      },
      /**
       * Fetch the current set of rows in loadMore
       * @return (Promise} Promise
       * @private
       */
      _invokeDataFetchCurrent: function () {
        var pageSize = this.options.pageSize;

        return this._invokeDataFetch({
          startIndex: 0,
          pageSize: this._currentStartIndex + pageSize
        });
      },
      /**
       * Check if the rowIdx is for the current page
       * @return {boolean} true or false
       * @private
       */
      _isOperationOnCurrentPage: function (event) {
        if (event == null) {
          return false;
        }

        var data = this._getData();
        var startIndex = data.getStartItemIndex();
        if (this.options.mode === this._MODE._LOAD_MORE) {
          startIndex = 0;
        }

        var endIndex = data.getEndItemIndex();
        var rowIdx;

        // check if one or more
        if (event.index != null) {
          rowIdx = event.index;

          if (rowIdx >= startIndex && rowIdx <= endIndex) {
            return true;
          }
        } else if (event.indexes != null) {
          var i;
          for (i = 0; i < event.indexes.length; i++) {
            rowIdx = event.indexes[i];

            if (rowIdx >= startIndex && rowIdx <= endIndex) {
              return true;
            }
          }
        }
        return false;
      },
      /**
       * Check if the totalSize confidence is "actual"
       * @return {boolean} true or false
       * @private
       */
      _isTotalSizeConfidenceActual: function () {
        var data = this._getData();

        if (data != null && data.totalSizeConfidence() === 'actual') {
          return true;
        }

        return false;
      },
      _queuePageFetch: function (page) {
        var self = this;
        if (!this._pendingPageFetch) {
          this._pageFetchCount = 0;
          this._pendingPageFetch = Promise.resolve();
        }
        this._pageFetchCount += 1;
        // keep track of the latest page. We only do a fetch on the latest page.
        this._pageFetchLatestPage = page;
        this._pendingPageFetch = this._pendingPageFetch.then(
          function () {
            self._pageFetchCount -= 1;
            // If stop fetch action flag is true, skip the postfetch process.
            if (self._stopFetchAction) {
              // Clear stop fetch action flag.
              self._stopFetchAction = false;
              return;
            }
            if (self._pageFetchCount === 0 && !self._componentDestroyed) {
              self._pendingPageFetch = null;
              self
                ._invokeDataSetPage(self._pageFetchLatestPage)
                .catch((ex) => self._queueFetchError(ex));
            }
          },
          (ex) => self._queueFetchError(ex)
        );
      },
      // error on fetching
      _queueFetchError: function (error) {
        this._pageFetchCount -= 1;
        if (this._pageFetchCount <= 0) {
          this._pendingPageFetch = null;
          ojlogger.error(error);
          this._setComponentReady();
        }
      },
      _queueRefresh: function () {
        var self = this;
        if (!this._pendingRefreshes) {
          this._refreshCount = 0;
          this._pendingRefreshes = Promise.resolve();
          this._setComponentNotReady();
        }
        this._refreshCount += 1;
        this._pendingRefreshes = this._pendingRefreshes.then(
          function () {
            self._refreshCount -= 1;
            if (self._refreshCount === 0) {
              self._pendingRefreshes = null;
              if (!self._componentDestroyed) {
                self._refresh();
                self._trigger('ready');
              }
              self._setComponentReady();
              self = null;
            }
          },
          function (error) {
            self._refreshCount -= 1;
            if (self._refreshCount === 0) {
              self._pendingRefreshes = null;
              ojlogger.error(error);
              self._setComponentReady();
              self = null;
            }
          }
        );
      },
      /**
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @private
       */
      _refreshPagingControlLoadMore: function (size, startIndex) {
        var data = this._getData();
        var pagingControlLoadMore = this._getPagingControlLoadMore();
        var rowCount = startIndex + size;
        var needLoadMore = !(
          data != null &&
          ((rowCount === data.totalSize() && this._isTotalSizeConfidenceActual()) ||
            data.totalSize() === 0)
        );

        // Recreate loadMore control if this is the first time or there is more data
        if (!pagingControlLoadMore || needLoadMore) {
          var pagingControlContent = this._getPagingControlContent();
          if (pagingControlContent != null) {
            pagingControlContent.empty();
          }
          this._clearCachedDomLoadMore();
          pagingControlLoadMore = this._createPagingControlLoadMore();
          rowCount = -1;

          if (size != null) {
            rowCount = startIndex + size;
          }

          // Hide the load more details when no data is available
          if (size > 0) {
            if (rowCount < 0 || rowCount < this.options.loadMoreOptions.maxCount) {
              this._createPagingControlLoadMoreLink();
              this._createPagingControlLoadMoreRange(size, startIndex);
            } else {
              this._createPagingControlLoadMoreMaxRows();
            }
          }
        }

        // hide loadMore if there are no more rows to fetch
        if (!needLoadMore) {
          pagingControlLoadMore.css('display', 'none');
        }
      },
      /**
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @private
       */
      _refreshPagingControlNav: function (size, startIndex) {
        var overflowOption = this.options.overflow;
        this._refreshPagingControlNavMaxPageVal(size, startIndex);
        this._refreshPagingControlNavLabel();
        this._refreshPagingControlNavInput();
        this._refreshPagingControlNavSummaryLabel(size, startIndex);
        this._refreshPagingControlNavPages(size, startIndex);
        this._refreshPagingControlNavArrows(size, startIndex);

        if (overflowOption === 'fit') {
          // dynamically hide controls based on available width
          var elementWidth = this.element.width();
          var pagingControlNavArrowSection = this._getPagingControlNavArrowSection();
          var pagingControlNavInputSection = this._getPagingControlNavInputSection();
          var pagingControlNavPageLinks = this._getPagingControlNavPageLinks();
          var pagingControlNavInputSummary = this._getPagingControlNavInputSummary();
          var pagingControlNavArrowSectionWidth =
            pagingControlNavArrowSection != null ? pagingControlNavArrowSection[0].offsetWidth : 0;
          var pagingControlNavInputSectionWidth =
            pagingControlNavInputSection != null ? pagingControlNavInputSection[0].offsetWidth : 0;
          var pagingControlNavPageLinksWidth =
            pagingControlNavPageLinks != null ? pagingControlNavPageLinks.width() : 0;
          var pagingControlNavInputSummaryWidth =
            pagingControlNavInputSummary != null ? pagingControlNavInputSummary.width() : 0;
          var pagingControlNavWidth =
            pagingControlNavArrowSectionWidth +
            pagingControlNavInputSectionWidth +
            pagingControlNavInputSummaryWidth;

          if (pagingControlNavWidth > elementWidth) {
            // hide the page Links
            if (pagingControlNavPageLinks != null) {
              pagingControlNavPageLinks.css('display', 'none');
            }

            if (pagingControlNavWidth - pagingControlNavPageLinksWidth > elementWidth) {
              // hide the range text too
              if (pagingControlNavInputSummary != null) {
                pagingControlNavInputSummary.css('display', 'none');
              }
            }

            if (
              pagingControlNavWidth -
                pagingControlNavPageLinksWidth -
                pagingControlNavInputSummaryWidth >
              elementWidth
            ) {
              // hide the arrows too
              if (pagingControlNavArrowSection != null) {
                pagingControlNavArrowSection.css('display', 'none');
              }
            }
          } else if (pagingControlNavWidth > 0) {
            if (pagingControlNavPageLinks != null) {
              pagingControlNavPageLinks.css('display', '');
            }
            if (pagingControlNavInputSummary != null) {
              pagingControlNavInputSummary.css('display', '');
            }
            if (pagingControlNavArrowSection != null) {
              pagingControlNavArrowSection.css('display', '');
            }
          }
        }
      },
      /**
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _refreshPagingControlNavArrows: function (size, startIndex) {
        var pageSize = this.options.pageSize;
        var pagingControlNavArrowSection = this._getPagingControlNavArrowSection();
        var pagingControlNavFirst = pagingControlNavArrowSection.children(
          '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_FIRST_CLASS
        );
        if (pagingControlNavFirst && pagingControlNavFirst.length > 0) {
          pagingControlNavFirst = $(pagingControlNavFirst[0]);
          var navFirstPageTip = this.getTranslatedString(this._BUNDLE_KEY._TIP_NAV_FIRST_PAGE);
          pagingControlNavFirst.attr('title', navFirstPageTip);

          this._disableNavArrow(pagingControlNavFirst, this._getCurrentPage() === 0);
        }
        var pagingControlNavPrevious = pagingControlNavArrowSection.children(
          '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_CLASS
        );
        if (pagingControlNavPrevious && pagingControlNavPrevious.length > 0) {
          pagingControlNavPrevious = $(pagingControlNavPrevious[0]);
          var navPreviousPageTip = this.getTranslatedString(this._BUNDLE_KEY._TIP_NAV_PREVIOUS_PAGE);
          pagingControlNavPrevious.attr('title', navPreviousPageTip);

          this._disableNavArrow(pagingControlNavPrevious, this._getCurrentPage() === 0);
        }
        var pagingControlNavLast = pagingControlNavArrowSection.children(
          '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_LAST_CLASS
        );
        if (pagingControlNavLast && pagingControlNavLast.length > 0) {
          pagingControlNavLast = $(pagingControlNavLast[0]);
          var navLastPageTip = this.getTranslatedString(this._BUNDLE_KEY._TIP_NAV_LAST_PAGE);
          pagingControlNavLast.attr('title', navLastPageTip);

          this._disableNavArrow(
            pagingControlNavLast,
            this._getCurrentPage() === this._getTotalPages() - 1 ||
              this._getTotalPages() <= 0 ||
              !this._isTotalSizeConfidenceActual()
          );
        }
        var pagingControlNavNext = pagingControlNavArrowSection.children(
          '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_CLASS
        );
        if (pagingControlNavNext && pagingControlNavNext.length > 0) {
          pagingControlNavNext = $(pagingControlNavNext[0]);
          var navNextPageTip = this.getTranslatedString(this._BUNDLE_KEY._TIP_NAV_NEXT_PAGE);
          pagingControlNavNext.attr('title', navNextPageTip);

          this._disableNavArrow(
            pagingControlNavNext,
            (this._getCurrentPage() === this._getTotalPages() - 1 &&
              this._isTotalSizeConfidenceActual()) ||
              this._getTotalPages() === 0 ||
              (this._getTotalPages() < 0 && size === 0) ||
              (this._getTotalPages() < 0 && size < pageSize)
          );
        }
      },
      /**
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @private
       */
      _refreshPagingControlNavPages: function (size, startIndex) {
        var pagingControlNavPagesSection = this._getPagingControlNav().find(
          '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_PAGES_SECTION_CLASS
        );

        if (pagingControlNavPagesSection != null && pagingControlNavPagesSection.length > 0) {
          pagingControlNavPagesSection = $(pagingControlNavPagesSection.get(0));
          this._unregisterChildStateListeners(pagingControlNavPagesSection);
          pagingControlNavPagesSection.empty();
          this._createPagingControlNavPages(
            pagingControlNavPagesSection,
            this._getMaxPageLinks(),
            size,
            startIndex
          );
        }
      },
      /**
       * @private
       */
      _refreshPagingControlNavLabel: function () {
        var pagingControlNavInputSection = this._getPagingControlNavInputSection();

        if (pagingControlNavInputSection != null) {
          var pagingControlNavLabel = pagingControlNavInputSection.children(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_LABEL_CLASS
          );

          if (pagingControlNavLabel != null && pagingControlNavLabel.length > 0) {
            pagingControlNavLabel = $(pagingControlNavLabel[0]);
            var navInputPageLabel = this.getTranslatedString(this._BUNDLE_KEY._LABEL_NAV_INPUT_PAGE);
            pagingControlNavLabel.text(navInputPageLabel);
          }
        }
      },
      /**
       * @private
       */
      _refreshPagingControlNavInput: function () {
        var pagingControlNavInput = this._getPagingControlNavInput();

        if (pagingControlNavInput != null) {
          var navInputPageTip = this.getTranslatedString(this._BUNDLE_KEY._TIP_NAV_INPUT_PAGE);
          pagingControlNavInput.attr('title', navInputPageTip);
          var isCustomElement = this._IsCustomElement();
          if (isCustomElement) {
            pagingControlNavInput.get(0).setAttribute('help.instruction', navInputPageTip);
          } else {
            pagingControlNavInput.ojInputText('option', 'title', navInputPageTip);
          }
        }
      },
      /**
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @private
       */
      _refreshPagingControlNavSummaryLabel: function (size, startIndex) {
        var pagingControlNavSummaryLabel = this._getPagingControlNav().children(
          '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_CLASS
        );

        if (pagingControlNavSummaryLabel != null && pagingControlNavSummaryLabel.length > 0) {
          var itemRange = this._getItemRange(size, startIndex);
          pagingControlNavSummaryLabel = $(pagingControlNavSummaryLabel.get(0));
          pagingControlNavSummaryLabel.empty();

          if (itemRange.text().length > 0) {
            pagingControlNavSummaryLabel.append('('); // @HTMLUpdateOK
            pagingControlNavSummaryLabel.append(itemRange); // @HTMLUpdateOK
            pagingControlNavSummaryLabel.append(')'); // @HTMLUpdateOK
          }
        }
      },
      /**
       * Helper function to set the page input to readonly. We also need to set the aria-labelledby
       * property to make sure the label is pointing to the correct element
       * @param {Element} pagingControlNavInput Nav Input element
       * @private
       */
      _setReadOnlyPageInput: function (pagingControlNavInput) {
        var isCustomElement = this._IsCustomElement();
        if (!isCustomElement) {
          pagingControlNavInput.ojInputText('option', 'readOnly', true);
        } else {
          // eslint-disable-next-line no-param-reassign
          pagingControlNavInput[0].readonly = true;
        }

        // aria-labelledby no longer associated with the right element as the input-text is
        // converted into a textbox (on redwood). Add the attribute to the textbox element to force the labelling
        // on Alta, no change needed
        var textboxElement =
          pagingControlNavInput[0].getElementsByClassName('oj-text-field-readonly');
        if (textboxElement.length > 0) {
          textboxElement[0].setAttribute('aria-labelledby', pagingControlNavInput[0].id + '|label');
        }
      },
      /**
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @private
       */
      _refreshPagingControlNavMaxPageVal: function (size) {
        var maxPageVal = this._getMaxPageVal(size);

        var pagingControlNavMaxLabel = this._getPagingControlNav().find(
          '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_MAX_CLASS
        );
        var navInputPageMaxLabel;

        if (pagingControlNavMaxLabel != null && pagingControlNavMaxLabel.length > 0) {
          pagingControlNavMaxLabel = $(pagingControlNavMaxLabel.get(0));

          if (this._getTotalPages() > 0 && this._isTotalSizeConfidenceActual()) {
            navInputPageMaxLabel = this.getTranslatedString(
              this._BUNDLE_KEY._LABEL_NAV_INPUT_PAGE_MAX,
              { pageMax: maxPageVal }
            );
            pagingControlNavMaxLabel.text(navInputPageMaxLabel);
          } else {
            pagingControlNavMaxLabel.empty();
          }
        } else {
          var pagingControlNavInputSection = this._getPagingControlNavInputSection();

          if (
            pagingControlNavInputSection != null &&
            this._getTotalPages() > 0 &&
            this._isTotalSizeConfidenceActual() &&
            maxPageVal >= this._getCurrentPage() + 1
          ) {
            pagingControlNavMaxLabel = $(document.createElement('span'));
            pagingControlNavMaxLabel.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_MAX_CLASS);
            pagingControlNavMaxLabel.addClass('oj-label-inline');
            pagingControlNavInputSection.append(pagingControlNavMaxLabel); // @HTMLUpdateOK
            navInputPageMaxLabel = this.getTranslatedString(
              this._BUNDLE_KEY._LABEL_NAV_INPUT_PAGE_MAX,
              { pageMax: maxPageVal }
            );
            pagingControlNavMaxLabel.text(navInputPageMaxLabel);
          }
        }

        var pagingControlNavInput;
        var isCustomElement = this._IsCustomElement();

        if (!isCustomElement) {
          pagingControlNavInput = this._getPagingControlNav().find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_CLASS
          );
        } else {
          pagingControlNavInput = this._getPagingControlNavInput();
        }

        if (pagingControlNavInput != null && pagingControlNavInput.length > 0) {
          pagingControlNavInput = $(pagingControlNavInput.get(0));
          var messagesShown;
          var validator = [new NumberRangeValidator({ min: 1, max: maxPageVal })];
          if (!isCustomElement) {
            pagingControlNavInput.ojInputText();
            pagingControlNavInput.ojInputText('option', 'validators', validator);
            messagesShown = pagingControlNavInput.ojInputText('option', 'messagesShown');
            if (messagesShown == null || messagesShown.length === 0) {
              // only reset the value to the current page if there is currently no validation message displayed
              this._resetPagingControlNavInput();
            }

            if (maxPageVal === 1) {
              this._setReadOnlyPageInput(pagingControlNavInput);
            } else {
              pagingControlNavInput.ojInputText('option', 'readOnly', false);
            }
          } else {
            pagingControlNavInput = this._getPagingControlNavInput();
            pagingControlNavInput[0].validators = validator;
            messagesShown = pagingControlNavInput.messagesShown;
            if (messagesShown == null || messagesShown.length === 0) {
              // only reset the value to the current page if there is currently no validation message displayed
              this._resetPagingControlNavInput();
            }
            if (maxPageVal === 1) {
              this._setReadOnlyPageInput(pagingControlNavInput);
            } else {
              pagingControlNavInput[0].readonly = false;
            }
          }
        }
      },
      /**
       * Register event listeners which need to be registered datasource.
       * @private
       */
      _registerDataSourceEventListeners: function () {
        // register the listeners on the datasource
        var data = this._getData();
        if (data != null && oj.DataProviderFeatureChecker.isDataProvider(data)) {
          this._unregisterDataSourceEventListeners();
          this._dataSourceEventHandlers = [];
          this._dataSourceEventHandlers.push({
            eventType: oj.PagingModel.EventType.PAGE,
            eventHandler: this._handleDataPage.bind(this)
          });
          this._dataSourceEventHandlers.push({
            eventType: oj.PagingModel.EventType.PAGECOUNT,
            eventHandler: this._handleDataRefresh.bind(this)
          });
          this._dataSourceEventHandlers.push({
            eventType: 'totalsize',
            eventHandler: this._handleDataRefresh.bind(this)
          });

          this._dataSourceEventHandlers.forEach(function (eventDetail) {
            data.addEventListener(eventDetail.eventType, eventDetail.eventHandler);
          });
        } else if (data != null) {
          this._unregisterDataSourceEventListeners();

          this._dataSourceEventHandlers = [];
          this._dataSourceEventHandlers.push({
            eventType: oj.PagingModel.EventType.PAGE,
            eventHandler: this._handleDataPage.bind(this)
          });
          this._dataSourceEventHandlers.push({
            eventType: oj.PagingModel.EventType.PAGECOUNT,
            eventHandler: this._handleDataRefresh.bind(this)
          });
          this._dataSourceEventHandlers.push({
            eventType: this._PAGING_TABLE_DATA_SOURCE_EVENT_TYPE._ADD,
            eventHandler: this._handleDataRowAdd.bind(this)
          });
          this._dataSourceEventHandlers.push({
            eventType: this._PAGING_TABLE_DATA_SOURCE_EVENT_TYPE._REMOVE,
            eventHandler: this._handleDataRowRemove.bind(this)
          });
          this._dataSourceEventHandlers.push({
            eventType: this._PAGING_TABLE_DATA_SOURCE_EVENT_TYPE._RESET,
            eventHandler: this._handleDataReset.bind(this)
          });
          this._dataSourceEventHandlers.push({
            eventType: this._PAGING_TABLE_DATA_SOURCE_EVENT_TYPE._REFRESH,
            eventHandler: this._handleDataRefresh.bind(this)
          });
          this._dataSourceEventHandlers.push({
            eventType: this._PAGING_TABLE_DATA_SOURCE_EVENT_TYPE._SYNC,
            eventHandler: this._handleDataFetchEnd.bind(this)
          });
          this._dataSourceEventHandlers.push({
            eventType: this._PAGING_TABLE_DATA_SOURCE_EVENT_TYPE._SORT,
            eventHandler: this._handleDataSort.bind(this)
          });

          for (var i = 0; i < this._dataSourceEventHandlers.length; i++) {
            var ev = data.on(
              this._dataSourceEventHandlers[i].eventType,
              this._dataSourceEventHandlers[i].eventHandler
            );
            if (ev) {
              this._dataSourceEventHandlers[i].eventHandler = ev;
            }
          }
        }
      },
      /**
       * Register event listeners for resize the container DOM element.
       * @param {jQuery} element  DOM element
       * @private
       */
      _registerResizeListener: function (element) {
        if (!this._resizeListener) {
          var self = this;
          // eslint-disable-next-line no-unused-vars
          this._resizeListener = function (width, height) {
            self._queueRefresh();
          };
        }
        if (!this._resizeListenerElement) {
          DomUtils.addResizeListener(element[0], this._resizeListener, 50);
          this._resizeListenerElement = element;
        }
      },
      /**
       * Register swipe handler for DOM element.
       * @private
       */
      _registerSwipeHandler: function () {
        if (DomUtils.isTouchSupported()) {
          if (this.options.mode === this._MODE._PAGE) {
            var pagingControlNav = this._getPagingControlNav();
            if (pagingControlNav != null) {
              var hammerDir;
              var self = this;

              if (this.options.pageOptions.orientation === 'vertical') {
                hammerDir = hammerjs.DIRECTION_VERTICAL;
                this._hammerNextPageDir = 'swipeup';
                this._hammerPrevPageDir = 'swipedown';
              } else {
                hammerDir = hammerjs.DIRECTION_HORIZONTAL;
                this._hammerNextPageDir = 'swipeleft';
                this._hammerPrevPageDir = 'swiperight';
              }

              // initialize Hammer Manager instance
              if (this._hammerManager == null) {
                var options = {
                  recognizers: [[hammerjs.Swipe, { direction: hammerDir }]]
                };
                this._hammerManager = new hammerjs.Manager(pagingControlNav[0], options);
              }

              // setup directional swipe handlers
              pagingControlNav.on(this._hammerNextPageDir, function (event) {
                event.preventDefault();
                self.nextPage();
              });
              pagingControlNav.on(this._hammerPrevPageDir, function (event) {
                event.preventDefault();
                self.previousPage();
              });
            }
          }
        }
      },
      /**
       * @private
       */
      _resetPagingControlNavInput: function () {
        var pagingControlNavInput = this._getPagingControlNavInput();
        var isCustomElement = this._IsCustomElement();

        if (
          pagingControlNavInput != null &&
          ((!isCustomElement && pagingControlNavInput.hasClass('oj-component-initnode')) ||
            isCustomElement)
        ) {
          try {
            if (!isCustomElement) {
              pagingControlNavInput.ojInputText('option', 'value', this._getCurrentPage() + 1);
            } else {
              pagingControlNavInput.get(0).value = this._getCurrentPage() + 1;
            }
          } catch (err) {
            // Ignore
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
          this._removeComponentBusyState(this._readyResolveFunc);
          this._readyResolveFunc = null;
        }
      },
      /**
       * Set the initial page.
       * @private
       */
      _setInitialPage: function () {
        var currentPage = this._getCurrentPage();

        if (currentPage > 0) {
          this._invokeDataPage(currentPage, true);
        } else {
          this._invokeDataPage(0, true);
        }
      },
      /**
       * Unregister event listeners which are registered on datasource.
       * @private
       */
      _unregisterDataSourceEventListeners: function () {
        var data = this._getData();
        var i;
        if (
          data != null &&
          oj.DataProviderFeatureChecker.isDataProvider(data) &&
          this._dataSourceEventHandlers != null
        ) {
          for (i = 0; i < this._dataSourceEventHandlers.length; i++) {
            if (this._dataSourceEventHandlers[i].eventType === 'pageCount') {
              data.removeEventListener('pagecount', this._dataSourceEventHandlers[i].eventHandler);
            } else {
              data.removeEventListener(
                this._dataSourceEventHandlers[i].eventType,
                this._dataSourceEventHandlers[i].eventHandler
              );
            }
          }
        } else if (this._dataSourceEventHandlers != null && data != null) {
          // unregister the listeners on the datasource
          for (i = 0; i < this._dataSourceEventHandlers.length; i++) {
            data.off(
              this._dataSourceEventHandlers[i].eventType,
              this._dataSourceEventHandlers[i].eventHandler
            );
          }
        }
      },
      /**
       * Unregister _focusable(), etc, which were added to the child elements
       * @param {jQuery} parent jQuery div DOM element
       * @private
       */
      _unregisterChildStateListeners: function (parent) {
        var self = this;
        parent.find('*').each(function () {
          self._UnregisterChildNode(this);
        });
        self = null;
      },
      /**
       * Unregister event listeners for resize the container DOM element.
       * @private
       */
      _unregisterResizeListener: function () {
        if (this._resizeListenerElement != null) {
          DomUtils.removeResizeListener(this._resizeListenerElement, this._resizeListener);
          this._resizeListenerElement = null;
        }
      },
      /**
       * Unregister swipe handler for DOM element.
       * @private
       */
      _unregisterSwipeHandler: function () {
        if (DomUtils.isTouchSupported()) {
          var pagingControlNav = this._getPagingControlNav();
          if (pagingControlNav != null) {
            if (this._hammerNextPageDir != null) {
              pagingControlNav.off(this._hammerNextPageDir);
              this._hammerNextPageDir = null;
            }
            if (this._hammerPrevPageDir != null) {
              pagingControlNav.off(this._hammerPrevPageDir);
              this._hammerPrevPageDir = null;
            }
            // ensure Hammer Manager instance is destroyed
            if (this._hammerManager != null) {
              this._hammerManager.destroy();
              this._hammerManager = null;
            }
          }
        }
      },
      /** ** end internal functions ****/
      /**
       * Create a span element for acc purposes
       * @param {string} text span text
       * @param {string} className css class
       * @return {jQuery} jQuery div DOM element
       * @private
       */
      _createAccLabelSpan: function (text, className) {
        var accLabel = $(document.createElement('span'));
        accLabel.addClass(className);
        accLabel.addClass(this._CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
        accLabel.text(text);

        return accLabel;
      },
      /** ** start internal DOM functions ****/
      /**
       * Create the helper acc paging control page label to announce page changes
       * @return {jQuery} jQuery div DOM element
       * @private
       */
      _createAccPageLabel: function () {
        var pagingControlContainer = this._getPagingControlContainer();
        var pagingControlAccPageSpan = document.createElement('span');
        var pagingControlAccText = document.createTextNode(
          this.getTranslatedString(this._BUNDLE_KEY._LABEL_ACC_PAGE_NUMBER, {
            pageNum: this._getCurrentPage()
          })
        );
        pagingControlAccPageSpan.appendChild(pagingControlAccText);
        pagingControlAccPageSpan.setAttribute('id', this.element.attr('id') + '_acc_page_label');
        pagingControlAccPageSpan.setAttribute(
          'class',
          this._CSS_CLASSES._PAGING_CONTROL_ACC_PAGE_LABEL_CLASS
        );
        pagingControlAccPageSpan.setAttribute('aria-live', 'assertive');
        pagingControlAccPageSpan.setAttribute('role', 'status');

        // workaround for csp violation
        pagingControlAccPageSpan.style.height = '1px';
        pagingControlAccPageSpan.style.width = '1px';
        pagingControlAccPageSpan.style.overflow = 'hidden';
        pagingControlAccPageSpan.style.position = 'absolute';
        pagingControlAccPageSpan.style.whiteSpace = 'nowrap';
        pagingControlAccPageSpan.style.clip = 'rect(1px, 1px, 1px, 1px)';

        pagingControlContainer.append(pagingControlAccPageSpan); // @HTMLUpdateOK
      },
      /**
       * Create the acc paging control label
       * @return {jQuery} jQuery div DOM element
       * @private
       */
      _createPagingControlAccLabel: function () {
        var pagingControlContainer = this._getPagingControlContainer();
        var pagingControlAccLabelText = this.getTranslatedString(this._BUNDLE_KEY._LABEL_ACC_PAGING);

        // Accessibility label must be unique for role='region'
        // to prevent unique landMarks OAT error
        pagingControlAccLabelText = this.element.attr('id') + pagingControlAccLabelText;

        var pagingControlAccLabel = this._createAccLabelSpan(
          pagingControlAccLabelText,
          this._CSS_CLASSES._PAGING_CONTROL_ACC_LABEL_CLASS
        );
        var pagingControlAccLabelId = this.element.attr('id') + '_oj_pgCtrl_acc_label';
        pagingControlAccLabel.attr('id', pagingControlAccLabelId);
        pagingControlContainer.append(pagingControlAccLabel); // @HTMLUpdateOK

        return pagingControlAccLabel;
      },
      /**
       * Create the acc page link label
       * @return {jQuery} jQuery div DOM element
       * @private
       */
      _createPagingControlAccNavPageLabel: function () {
        var pagingControlAccNavPageLabelText = this.getTranslatedString(
          this._BUNDLE_KEY._LABEL_ACC_NAV_PAGE
        );
        return this._createAccLabelSpan(
          pagingControlAccNavPageLabelText,
          this._CSS_CLASSES._PAGING_CONTROL_NAV_PAGE_ACC_LABEL_CLASS
        );
      },
      /**
       * Create an paging content div
       * @return {jQuery} jQuery div DOM element
       * @private
       */
      _createPagingControlContent: function () {
        var pagingControlContainer = this._getPagingControlContainer();
        var pagingControlContent = $(document.createElement('div'));
        pagingControlContent.addClass(this._CSS_CLASSES._PAGING_CONTROL_CONTENT_CLASS);
        var pagingControlAccLabelId = this._getPagingControlAccLabel().attr('id');
        // Fix bug 34545: use region as role instead of navigation
        // because navigation is reserved as unique landmark
        pagingControlContent.attr('role', 'region');
        pagingControlContent.attr('aria-labelledby', pagingControlAccLabelId);
        pagingControlContainer.append(pagingControlContent); // @HTMLUpdateOK

        return pagingControlContent;
      },
      /**
       * Create an paging load more div
       * @return {jQuery} jQuery div DOM element
       * @private
       */
      _createPagingControlLoadMore: function () {
        var pagingControlContent = this._getPagingControlContent();
        var pagingControlLoadMore = $(document.createElement('div'));
        pagingControlLoadMore.addClass(this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_CLASS);
        pagingControlContent.append(pagingControlLoadMore); // @HTMLUpdateOK

        return pagingControlLoadMore;
      },
      /**
       * Create an paging load more link
       * @return {jQuery} jQuery a DOM element
       * @private
       */
      _createPagingControlLoadMoreLink: function () {
        var pagingControlLoadMore = this._getPagingControlLoadMore();
        var pagingControlLoadMoreLink = $(document.createElement('a'));
        pagingControlLoadMoreLink.addClass(this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_LINK_CLASS);
        var loadMoreText = this.getTranslatedString(this._BUNDLE_KEY._LABEL_LOAD_MORE);
        pagingControlLoadMoreLink.text(loadMoreText);
        pagingControlLoadMoreLink.attr(this._TAB_INDEX, '0'); // @HTMLUpdateOK
        pagingControlLoadMoreLink.attr('href', '#');
        pagingControlLoadMore.append(pagingControlLoadMoreLink); // @HTMLUpdateOK

        return pagingControlLoadMoreLink;
      },
      /**
       * Create an paging load more max page message
       * @return {jQuery} jQuery a DOM element
       * @private
       */
      _createPagingControlLoadMoreMaxRows: function () {
        var pagingControlLoadMore = this._getPagingControlLoadMore();
        var pagingControlLoadMoreMaxRows = $(document.createElement('span'));
        pagingControlLoadMoreMaxRows.addClass(
          this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_MAX_ROWS_CLASS
        );
        var maxRowsText = this.getTranslatedString(this._BUNDLE_KEY._LABEL_LOAD_MORE_MAX_ROWS, {
          maxRows: this.options.loadMoreOptions.maxCount
        });
        pagingControlLoadMoreMaxRows.text(maxRowsText);
        pagingControlLoadMore.append(pagingControlLoadMoreMaxRows); // @HTMLUpdateOK

        return pagingControlLoadMoreMaxRows;
      },
      /**
       * Create an paging load more link
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @return {jQuery} jQuery a DOM element
       * @private
       */
      _createPagingControlLoadMoreRange: function (size, startIndex) {
        var pagingControlLoadMore = this._getPagingControlLoadMore();
        var pagingControlLoadMoreRange = $(document.createElement('span'));
        pagingControlLoadMoreRange.addClass(this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_RANGE_CLASS);
        var loadMoreRange = this._getItemRange(size, startIndex);
        pagingControlLoadMoreRange.append(loadMoreRange); // @HTMLUpdateOK
        pagingControlLoadMore.append(pagingControlLoadMoreRange); // @HTMLUpdateOK

        return pagingControlLoadMoreRange;
      },
      /**
       * Create the paging nav bar div
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @return {jQuery} jQuery div DOM element
       * @private
       */
      _createPagingControlNav: function (size, startIndex) {
        var options = this.options;
        var isCustomElement = this._IsCustomElement();
        var isVertical = this.options.pageOptions.orientation === 'vertical';
        var isDot = this.options.pageOptions.type === 'dots';
        var pageOptionLayout = options.pageOptions.layout;
        if (pageOptionLayout == null) {
          pageOptionLayout = [this._PAGE_OPTION_LAYOUT._AUTO];
        }
        var pagingControlContent = this._getPagingControlContent();
        var pagingControlNav = $(document.createElement('div'));
        pagingControlNav.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_CLASS);
        // add dots vertical class if needed
        if (isDot && isVertical) {
          pagingControlNav.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_DOTS_VERTICAL_CLASS);
        } else {
          pagingControlNav.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_CLASS_STANDARD);
        }

        pagingControlContent.append(pagingControlNav); // @HTMLUpdateOK

        // page input section
        if (
          ($.inArray(this._PAGE_OPTION_LAYOUT._AUTO, pageOptionLayout) !== -1 && !isDot) ||
          $.inArray(this._PAGE_OPTION_LAYOUT._ALL, pageOptionLayout) !== -1 ||
          $.inArray(this._PAGE_OPTION_LAYOUT._INPUT, pageOptionLayout) !== -1
        ) {
          var pagingControlNavInputSection = $(document.createElement('div'));
          pagingControlNavInputSection.addClass(
            this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SECTION_CLASS
          );
          pagingControlNav.append(pagingControlNavInputSection); // @HTMLUpdateOK
          var pagingControlNavLabel = $(document.createElement('label'));
          pagingControlNavLabel.attr('for', this.element.attr('id') + '_nav_input|input');
          pagingControlNavLabel.attr('id', this.element.attr('id') + '_nav_input|label');
          pagingControlNavLabel.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_LABEL_CLASS);
          pagingControlNavLabel.addClass('oj-label-inline');
          var navInputPageLabel = this.getTranslatedString(this._BUNDLE_KEY._LABEL_NAV_INPUT_PAGE);
          pagingControlNavLabel.text(navInputPageLabel);
          pagingControlNavInputSection.append(pagingControlNavLabel); // @HTMLUpdateOK

          var pagingControlNavInput;
          var navInputPageTip = this.getTranslatedString(this._BUNDLE_KEY._TIP_NAV_INPUT_PAGE);
          if (!isCustomElement) {
            pagingControlNavInput = $(document.createElement('input'));
            pagingControlNavInput.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_CLASS);
            pagingControlNavInput.attr('id', this.element.attr('id') + '_nav_input');
            pagingControlNavInput.attr('title', navInputPageTip);
            pagingControlNavInput.attr(this._TAB_INDEX, '0'); // @HTMLUpdateOK
            pagingControlNavInput.val(this._getCurrentPage() + 1);
          } else {
            pagingControlNavInput = document.createElement('oj-input-text');
            pagingControlNavInput.setAttribute('data-oj-binding-provider', 'none');
            pagingControlNavInput.setAttribute('id', this.element.attr('id') + '_nav_input');
            pagingControlNavInput.setAttribute('help.instruction', navInputPageTip);
            pagingControlNavInput.setAttribute(this._TAB_INDEX, '0'); // @HTMLUpdateOK
            pagingControlNavInput.classList.add(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_CLASS);
            pagingControlNavInput.value = this._getCurrentPage() + 1;
          }
          pagingControlNavInputSection.append(pagingControlNavInput); // @HTMLUpdateOK
          var maxPageVal = this._getMaxPageVal(size);

          if (this._getTotalPages() > 0 && this._isTotalSizeConfidenceActual()) {
            var pagingControlNavMaxLabel = $(document.createElement('span'));
            pagingControlNavMaxLabel.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_MAX_CLASS);
            pagingControlNavMaxLabel.addClass('oj-label-inline');
            var navInputPageMaxLabel = this.getTranslatedString(
              this._BUNDLE_KEY._LABEL_NAV_INPUT_PAGE_MAX,
              { pageMax: maxPageVal }
            );
            pagingControlNavMaxLabel.text(navInputPageMaxLabel);
            pagingControlNavInputSection.append(pagingControlNavMaxLabel); // @HTMLUpdateOK
          }
          var displayOptions = {
            messages: ['notewindow'],
            converterHint: ['notewindow'],
            validatorHint: ['notewindow']
          };
          var validator = [new NumberRangeValidator({ min: 1, max: maxPageVal })];

          if (!isCustomElement) {
            pagingControlNavInput
              .ojInputText({
                displayOptions: displayOptions,
                userAssistanceDensity: 'compact',
                converter: new ojconverterNumber.IntlNumberConverter(),
                validators: validator
              })
              .attr('data-oj-internal', '');
            pagingControlNavInput[0].style.width = 'auto';
            pagingControlNavInput[0].style.minWidth = 0;
            // Add the optionChange listener after initializing the input component.
            // Otherwise we get the optionChange event which causes a page change and
            // extra refresh on the associating table.
            pagingControlNavInput.on({ ojoptionchange: this._handlePageChange.bind(this) });
          } else {
            pagingControlNavInput.setAttribute('display-options', JSON.stringify(displayOptions));
            pagingControlNavInput.setAttribute('user-assistance-density', 'compact');
            pagingControlNavInput.style.width = 'auto';
            pagingControlNavInput.style.minWidth = 0;
            var converterOptions = {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              style: 'decimal',
              useGrouping: false
            };
            pagingControlNavInput.converter = new ojconverterNumber.IntlNumberConverter(converterOptions);
            pagingControlNavInput.validators = validator;
            pagingControlNavInput.addEventListener('valueChanged', this._handlePageChange.bind(this));
          }
        }

        if (
          ($.inArray(this._PAGE_OPTION_LAYOUT._AUTO, pageOptionLayout) !== -1 && !isDot) ||
          $.inArray(this._PAGE_OPTION_LAYOUT._ALL, pageOptionLayout) !== -1 ||
          $.inArray(this._PAGE_OPTION_LAYOUT._RANGE_TEXT, pageOptionLayout) !== -1
        ) {
          var pagingControlNavSummaryLabel = $(document.createElement('span'));
          pagingControlNavSummaryLabel.addClass(
            this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_CLASS
          );
          pagingControlNavSummaryLabel.addClass('oj-label-inline');
          var itemRange = this._getItemRange(size, startIndex);
          if (itemRange.text().length > 0) {
            pagingControlNavSummaryLabel.append('('); // @HTMLUpdateOK
            pagingControlNavSummaryLabel.append(itemRange); // @HTMLUpdateOK
            pagingControlNavSummaryLabel.append(')'); // @HTMLUpdateOK
          }
          pagingControlNav.append(pagingControlNavSummaryLabel); // @HTMLUpdateOK
        }

        // nav arrow section
        var pagingControlNavArrowSection = $(document.createElement('div'));
        pagingControlNavArrowSection.addClass(
          this._CSS_CLASSES._PAGING_CONTROL_NAV_ARROW_SECTION_CLASS
        );
        pagingControlNav.append(pagingControlNavArrowSection); // @HTMLUpdateOK

        if (
          ($.inArray(this._PAGE_OPTION_LAYOUT._AUTO, pageOptionLayout) !== -1 && !isDot) ||
          $.inArray(this._PAGE_OPTION_LAYOUT._ALL, pageOptionLayout) !== -1 ||
          $.inArray(this._PAGE_OPTION_LAYOUT._NAV, pageOptionLayout) !== -1
        ) {
          var pagingControlNavFirst = this._createNavArrow(
            this._CSS_CLASSES._PAGING_CONTROL_NAV_FIRST_CLASS,
            isVertical
              ? this._CSS_CLASSES._PAGING_CONTROL_NAV_FIRST_VERTICAL_ICON_CLASS
              : this._CSS_CLASSES._PAGING_CONTROL_NAV_FIRST_ICON_CLASS,
            this._BUNDLE_KEY._TIP_NAV_FIRST_PAGE,
            this._BUNDLE_KEY._LABEL_ACC_NAV_FIRST_PAGE,
            this._CSS_CLASSES._PAGING_CONTROL_NAV_FIRST_ACC_LABEL_CLASS,
            isVertical
          );

          pagingControlNavArrowSection.append(pagingControlNavFirst); // @HTMLUpdateOK

          var pagingControlNavPrevious = this._createNavArrow(
            this._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_CLASS,
            isVertical
              ? this._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_VERTICAL_ICON_CLASS
              : this._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_ICON_CLASS,
            this._BUNDLE_KEY._TIP_NAV_PREVIOUS_PAGE,
            this._BUNDLE_KEY._LABEL_ACC_NAV_PREVIOUS_PAGE,
            this._CSS_CLASSES._PAGING_CONTROL_NAV_PREVIOUS_ACC_LABEL_CLASS,
            isVertical
          );

          pagingControlNavArrowSection.append(pagingControlNavPrevious); // @HTMLUpdateOK
        }

        // nav pages section
        if (
          $.inArray(this._PAGE_OPTION_LAYOUT._AUTO, pageOptionLayout) !== -1 ||
          $.inArray(this._PAGE_OPTION_LAYOUT._ALL, pageOptionLayout) !== -1 ||
          $.inArray(this._PAGE_OPTION_LAYOUT._PAGES, pageOptionLayout) !== -1
        ) {
          var pagingControlNavPagesSection = $(document.createElement('div'));
          pagingControlNavPagesSection.addClass(
            this._CSS_CLASSES._PAGING_CONTROL_NAV_PAGES_SECTION_CLASS
          );
          pagingControlNavArrowSection.append(pagingControlNavPagesSection); // @HTMLUpdateOK
          this._createPagingControlNavPages(
            pagingControlNavPagesSection,
            this._getMaxPageLinks(),
            size,
            startIndex
          );
        }

        if (
          ($.inArray(this._PAGE_OPTION_LAYOUT._AUTO, pageOptionLayout) !== -1 && !isDot) ||
          $.inArray(this._PAGE_OPTION_LAYOUT._ALL, pageOptionLayout) !== -1 ||
          $.inArray(this._PAGE_OPTION_LAYOUT._NAV, pageOptionLayout) !== -1
        ) {
          var pagingControlNavNext = this._createNavArrow(
            this._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_CLASS,
            isVertical
              ? this._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_VERTICAL_ICON_CLASS
              : this._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_ICON_CLASS,
            this._BUNDLE_KEY._TIP_NAV_NEXT_PAGE,
            this._BUNDLE_KEY._LABEL_ACC_NAV_NEXT_PAGE,
            this._CSS_CLASSES._PAGING_CONTROL_NAV_NEXT_ACC_LABEL_CLASS,
            isVertical
          );

          pagingControlNavArrowSection.append(pagingControlNavNext); // @HTMLUpdateOK

          var pagingControlNavLast = this._createNavArrow(
            this._CSS_CLASSES._PAGING_CONTROL_NAV_LAST_CLASS,
            isVertical
              ? this._CSS_CLASSES._PAGING_CONTROL_NAV_LAST_VERTICAL_ICON_CLASS
              : this._CSS_CLASSES._PAGING_CONTROL_NAV_LAST_ICON_CLASS,
            this._BUNDLE_KEY._TIP_NAV_LAST_PAGE,
            this._BUNDLE_KEY._LABEL_ACC_NAV_LAST_PAGE,
            this._CSS_CLASSES._PAGING_CONTROL_NAV_LAST_ACC_LABEL_CLASS,
            isVertical
          );

          pagingControlNavArrowSection.append(pagingControlNavLast); // @HTMLUpdateOK
        }

        return pagingControlNav;
      },
      /**
       * Create the page links
       * @param {jQuery} parentDiv parent element
       * @param {number} numLinks number of page links
       * @param {number} size Number of rows
       * @param {number} startIndex Start index
       * @return {jQuery} jQuery div DOM element
       * @private
       */
      // eslint-disable-next-line no-unused-vars
      _createPagingControlNavPages: function (parentDiv, numLinks, size, startIndex) {
        if (numLinks < 5) {
          var errSummary = this.getTranslatedString(
            this._BUNDLE_KEY._ERR_MAXPAGELINKS_INVALID_SUMMARY
          );
          var errDetail = this.getTranslatedString(this._BUNDLE_KEY._ERR_MAXPAGELINKS_INVALID_DETAIL);

          // Set stop fetch action flag to prevent page fetches.
          this._stopFetchAction = true;
          throw new Error(errSummary + '\n' + errDetail);
        }
        var pagingControlNavPagesLinks = $(document.createElement('div'));
        pagingControlNavPagesLinks.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_PAGES_LINKS_CLASS);
        parentDiv.append(pagingControlNavPagesLinks); // @HTMLUpdateOK
        var totalPages = this._getTotalPages();
        var currentPage = this._getCurrentPage();
        var pageSize = this.options.pageSize;

        var numPagesToAdd = numLinks;
        // this will hold our page list
        var pageList = [];
        var data = this._getData();
        if (currentPage >= 0) {
          var i;
          if (this._isTotalSizeConfidenceActual() && totalPages <= numPagesToAdd) {
            // always add the first page
            pageList[0] = 0;

            // just enumerate the pages
            for (i = 1; i < totalPages; i++) {
              pageList[i] = i;
            }
          } else {
            // add the first, current, and last page
            pageList.push(0);
            if (currentPage !== 0) {
              pageList.push(currentPage);
            }
            // add last page if known row count
            if (currentPage !== totalPages - 1 && this._isTotalSizeConfidenceActual()) {
              pageList.push(totalPages - 1);
            }
            numPagesToAdd -= pageList.length;
            // keep adding before the current page till we get to the
            // first page or we've added numPagesToAdd - 1.
            // If the last page or 2nd to last page then add until numPagesToAdd
            var pageBeforeCurrent = currentPage - 1;
            // number of pages to add after current
            var numPagesAfterCurrent = 1;
            // if at last page or second to last page then don't add any pages
            // after current
            if (
              this._isTotalSizeConfidenceActual() &&
              (currentPage === totalPages - 1 || currentPage === totalPages - 2)
            ) {
              numPagesAfterCurrent = 0;
            }
            while (numPagesToAdd > numPagesAfterCurrent && pageBeforeCurrent >= 1) {
              pageList.push(pageBeforeCurrent);
              pageBeforeCurrent -= 1;
              numPagesToAdd -= 1;
            }
            // keep adding after the current page
            var pageAfterCurrent = currentPage + 1;
            // if unknown row count, only add one page after current if there is data
            if (totalPages === -1) {
              if (size > 0 && size >= pageSize) {
                numPagesToAdd = 1;
              } else {
                numPagesToAdd = 0;
              }
            } else if (data != null) {
              if (data.totalSizeConfidence() === 'atLeast') {
                // partial row mode
                // if we are at the last page, provide the next page as possible data
                // if we are not at the last page, provide up to the last page.
                if (totalPages <= pageAfterCurrent) {
                  numPagesToAdd = 1;
                } else {
                  numPagesToAdd = Math.min(numPagesToAdd, totalPages - pageAfterCurrent);
                }
              } else if (data.totalSizeConfidence() === 'unknown') {
                // we only have totalPages for unknown row count when
                // we are at the end.
                numPagesToAdd = 0;
              }
            }
            while (numPagesToAdd > 0 && (pageAfterCurrent <= totalPages || totalPages === -1)) {
              pageList.push(pageAfterCurrent);
              pageAfterCurrent += 1;
              numPagesToAdd -= 1;
            }
          }

          // sort the pageList array
          var compareNumbers = function (a, b) {
            return a - b;
          };

          pageList.sort(compareNumbers);

          for (i = 0; i < pageList.length; i++) {
            var pageNum = pageList[i];
            this._createPagingControlNavPage(pagingControlNavPagesLinks, pageNum);
            // check if we have a gap
            if (i !== pageList.length - 1) {
              if (pageNum !== pageList[i + 1] - 1) {
                this._createPagingControlNavPage(pagingControlNavPagesLinks, -1);
              }
            }
          }
          if (!this._isTotalSizeConfidenceActual() && size >= pageSize) {
            this._createPagingControlNavPage(pagingControlNavPagesLinks, -1);
          }
        }
        return pagingControlNavPagesLinks;
      },
      /**
       * Create the page link or page gap
       * @param {jQuery} parentDiv parent element
       * @param {number} pageNum page number
       * @return {jQuery} jQuery div DOM element
       * @private
       */
      _createPagingControlNavPage: function (parentDiv, pageNum) {
        var currentPage = this._getCurrentPage();
        var pagingControlNavPage = null;
        var isRTL = this._GetReadingDirection() === 'rtl';
        var isVertical = this.options.pageOptions.orientation === 'vertical';
        var isDot = this.options.pageOptions.type === 'dots';
        if (pageNum === -1) {
          pagingControlNavPage = $(document.createElement('span'));
          pagingControlNavPage.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_PAGE_ELLIPSIS_CLASS);
          pagingControlNavPage.text('...');
          parentDiv.append(pagingControlNavPage); // @HTMLUpdateOK
        } else {
          if (currentPage === pageNum) {
            pagingControlNavPage = $(document.createElement('div'));
            pagingControlNavPage.addClass(this._MARKER_STYLE_CLASSES._SELECTED);
            pagingControlNavPage.addClass(this._MARKER_STYLE_CLASSES._ACTIVE);
            pagingControlNavPage.addClass(this._MARKER_STYLE_CLASSES._DISABLED);
            pagingControlNavPage.removeClass(this._MARKER_STYLE_CLASSES._ENABLED);
          } else {
            pagingControlNavPage = $(document.createElement('a'));
            pagingControlNavPage.removeClass(this._MARKER_STYLE_CLASSES._SELECTED);
            pagingControlNavPage.removeClass(this._MARKER_STYLE_CLASSES._ACTIVE);
            pagingControlNavPage.removeClass(this._MARKER_STYLE_CLASSES._DISABLED);
            pagingControlNavPage.addClass(this._MARKER_STYLE_CLASSES._ENABLED);
            pagingControlNavPage.attr(this._TAB_INDEX, '0'); // @HTMLUpdateOK
            pagingControlNavPage.attr('href', '#');
          }
          pagingControlNavPage.attr('data-oj-pagenum', pageNum);
          if (!isDot) {
            pagingControlNavPage.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_PAGE_CLASS);
          } else {
            pagingControlNavPage.addClass(this._CSS_CLASSES._PAGING_CONTROL_NAV_DOT_CLASS);
          }
          var pageTitle = this.getTranslatedString(this._BUNDLE_KEY._TIP_NAV_PAGE_LINK, {
            pageNum: (pageNum + 1).toString()
          });
          this._AddHoverable(pagingControlNavPage);
          this._focusable({ element: pagingControlNavPage, applyHighlight: true });
          pagingControlNavPage.attr('title', pageTitle);
          pagingControlNavPage[0].oncontextmenu = function () {
            return false;
          };
          // create the acc label for the page link
          var accPageLabel = this._createPagingControlAccNavPageLabel();
          pagingControlNavPage.append(accPageLabel); // @HTMLUpdateOK
          var pagingControlNavPageSpan = $(document.createElement('span'));
          pagingControlNavPageSpan.append((pageNum + 1).toString()); // @HTMLUpdateOK

          if (isDot) {
            // hide the number
            pagingControlNavPageSpan.addClass(this._CSS_CLASSES._HIDDEN_CONTENT_ACC_CLASS);
            // add the dot
            var pagingControlNavPageDotBulletSpan = $(document.createElement('span'));
            pagingControlNavPageDotBulletSpan.addClass(
              this._CSS_CLASSES._PAGING_CONTROL_NAV_DOT_BULLET_CLASS
            );
            this._AddHoverable(pagingControlNavPageDotBulletSpan);

            if (currentPage === pageNum) {
              pagingControlNavPageDotBulletSpan.addClass(this._MARKER_STYLE_CLASSES._SELECTED);
              pagingControlNavPageDotBulletSpan.addClass(this._MARKER_STYLE_CLASSES._ACTIVE);
            }
            pagingControlNavPage.append(pagingControlNavPageDotBulletSpan); // @HTMLUpdateOK
          } else {
            this._AddHoverable(pagingControlNavPage);
          }
          var dirAttrVal = isRTL ? 'rtl' : 'ltr';
          pagingControlNavPageSpan.attr('dir', dirAttrVal);
          pagingControlNavPage.append(pagingControlNavPageSpan); // @HTMLUpdateOK
          if (isVertical) {
            pagingControlNavPage.css('display', 'block');
          }
          parentDiv.append(pagingControlNavPage); // @HTMLUpdateOK
        }
        return pagingControlNavPage;
      },
      /**
       * Return the paging content acc page label
       * @return {jQuery|null} jQuery div DOM element
       * @private
       */
      _getPagingControlAccPageLabel: function () {
        var pagingControlContainer = this._getPagingControlContainer();
        var pagingControlAccPageLabel = null;

        if (pagingControlContainer) {
          pagingControlAccPageLabel = this.element[0].querySelector(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_ACC_PAGE_LABEL_CLASS
          );
        }

        return pagingControlAccPageLabel;
      },
      /**
       * Return the paging content acc label
       * @return {jQuery|null} jQuery div DOM element
       * @private
       */
      _getPagingControlAccLabel: function () {
        var pagingControlContainer = this._getPagingControlContainer();
        var pagingControlContentAccLabel = null;

        if (pagingControlContainer) {
          pagingControlContentAccLabel = pagingControlContainer.find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_ACC_LABEL_CLASS
          );
          if (pagingControlContentAccLabel && pagingControlContentAccLabel.length > 0) {
            pagingControlContentAccLabel = $(pagingControlContentAccLabel.get(0));
          }
        }

        return pagingControlContentAccLabel;
      },
      /**
       * Return the paging container
       * @return {jQuery|null} jQuery div DOM element
       * @private
       */
      _getPagingControlContainer: function () {
        return $(this.element);
      },
      /**
       * Return the paging content
       * @return {jQuery|null} jQuery div DOM element
       * @private
       */
      _getPagingControlContent: function () {
        if (!this._cachedDomPagingControlContent) {
          var pagingControlContainer = this._getPagingControlContainer();
          var pagingControlContent = null;
          if (pagingControlContainer) {
            pagingControlContent = pagingControlContainer.find(
              '.' + this._CSS_CLASSES._PAGING_CONTROL_CONTENT_CLASS
            );
            if (pagingControlContent && pagingControlContent.length > 0) {
              this._cachedDomPagingControlContent = $(pagingControlContent.get(0));
            }
          }
        }

        return this._cachedDomPagingControlContent;
      },
      /**
       * Return the Load More div
       * @return {jQuery|null} jQuery a DOM element
       * @private
       */
      _getPagingControlLoadMore: function () {
        if (!this._cachedDomPagingControlLoadMore) {
          var pagingControlContent = this._getPagingControlContent();
          var pagingControlLoadMore = null;
          if (pagingControlContent) {
            pagingControlLoadMore = pagingControlContent.children(
              '.' + this._CSS_CLASSES._PAGING_CONTROL_LOAD_MORE_CLASS
            );
            if (pagingControlLoadMore && pagingControlLoadMore.length > 0) {
              this._cachedDomPagingControlLoadMore = $(pagingControlLoadMore.get(0));
            }
          }
        }

        return this._cachedDomPagingControlLoadMore;
      },
      /**
       * Return the paging nav bar
       * @return {jQuery|null} jQuery a DOM element
       * @private
       */
      _getPagingControlNav: function () {
        if (!this._cachedDomPagingControlNav) {
          var pagingControlContent = this._getPagingControlContent();
          var pagingControlNav = null;
          if (pagingControlContent) {
            pagingControlNav = pagingControlContent.children(
              '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_CLASS
            );
            if (pagingControlNav && pagingControlNav.length > 0) {
              this._cachedDomPagingControlNav = $(pagingControlNav.get(0));
            }
          }
        }

        return this._cachedDomPagingControlNav;
      },
      /**
       * Return the paging nav input
       * @return {jQuery|null} jQuery input DOM element
       * @private
       */
      _getPagingControlNavInput: function () {
        var isCustomElement = this._IsCustomElement();
        if (!this._cachedDomPagingControlNavInput) {
          var pagingControlNav = this._getPagingControlNav();
          var pagingControlNavInput = null;
          if (pagingControlNav) {
            if (!isCustomElement) {
              pagingControlNavInput = pagingControlNav.find(
                '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_CLASS
              );
              if (pagingControlNavInput && pagingControlNavInput.length > 0) {
                this._cachedDomPagingControlNavInput = $(pagingControlNavInput.get(0));
              }
            } else {
              pagingControlNavInput = pagingControlNav[0].getElementsByTagName('oj-input-text');
              if (pagingControlNavInput && pagingControlNavInput.length > 0) {
                this._cachedDomPagingControlNavInput = $(pagingControlNavInput[0]);
              }
            }
          }
        }

        return this._cachedDomPagingControlNavInput;
      },
      /**
       * Return the paging nav input summary
       * @return {jQuery|null} jQuery input DOM element
       * @private
       */
      _getPagingControlNavInputSummary: function () {
        if (!this._cachedDomPagingControlNavInputSummary) {
          var pagingControlNav = this._getPagingControlNav();
          var pagingControlNavInputSummary = null;
          if (pagingControlNav) {
            pagingControlNavInputSummary = pagingControlNav.find(
              '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SUMMARY_CLASS
            );
            if (pagingControlNavInputSummary && pagingControlNavInputSummary.length > 0) {
              this._cachedDomPagingControlNavInputSummary = $(pagingControlNavInputSummary.get(0));
            }
          }
        }

        return this._cachedDomPagingControlNavInputSummary;
      },
      /**
       * Return the page links
       * @private
       */
      _getPagingControlNavPageLinks: function () {
        var pagingControlNav = this._getPagingControlNav();
        var pagingControlNavPageLinks = null;
        if (pagingControlNav) {
          pagingControlNavPageLinks = pagingControlNav.find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_PAGES_LINKS_CLASS
          );
          if (pagingControlNavPageLinks && pagingControlNavPageLinks.length > 0) {
            pagingControlNavPageLinks = $(pagingControlNavPageLinks.get(0));
          }
        }

        return pagingControlNavPageLinks;
      },
      /**
       * Return the nav arrows
       * @private
       */
      _getPagingControlNavArrowSection: function () {
        var pagingControlNav = this._getPagingControlNav();
        var pagingControlNavArrowSection = null;
        if (pagingControlNav) {
          pagingControlNavArrowSection = pagingControlNav.find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_ARROW_SECTION_CLASS
          );
          if (pagingControlNavArrowSection && pagingControlNavArrowSection.length > 0) {
            pagingControlNavArrowSection = $(pagingControlNavArrowSection.get(0));
          } else {
            return null;
          }
        }

        return pagingControlNavArrowSection;
      },
      /**
       * Return the nav input section
       * @private
       */
      _getPagingControlNavInputSection: function () {
        var pagingControlNav = this._getPagingControlNav();
        var pagingControlNavInputSection = null;
        if (pagingControlNav) {
          pagingControlNavInputSection = pagingControlNav.find(
            '.' + this._CSS_CLASSES._PAGING_CONTROL_NAV_INPUT_SECTION_CLASS
          );
          if (pagingControlNavInputSection && pagingControlNavInputSection.length > 0) {
            pagingControlNavInputSection = $(pagingControlNavInputSection.get(0));
          } else {
            return null;
          }
        }

        return pagingControlNavInputSection;
      }
      /** ** end internal DOM functions ****/
    });
  })();

});
