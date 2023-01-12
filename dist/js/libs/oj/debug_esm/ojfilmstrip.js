/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import Context from 'ojs/ojcontext';
import { subtreeDetached, subtreeAttached, subtreeShown, subtreeHidden } from 'ojs/ojcomponentcore';
import { warn } from 'ojs/ojlogger';
import { isValidIdentifier, isTouchSupported, addResizeListener, removeResizeListener } from 'ojs/ojdomutils';
import FocusUtils from 'ojs/ojfocusutils';
import 'touchr';

var __oj_film_strip_metadata = 
{
  "properties": {
    "arrowPlacement": {
      "type": "string",
      "enumValues": [
        "adjacent",
        "overlay"
      ],
      "value": "adjacent"
    },
    "arrowVisibility": {
      "type": "string",
      "enumValues": [
        "auto",
        "hidden",
        "hover",
        "visible"
      ],
      "value": "auto"
    },
    "currentItem": {
      "type": "object",
      "writeback": true,
      "value": {
        "index": 0
      },
      "properties": {
        "id": {
          "type": "string"
        },
        "index": {
          "type": "number"
        }
      }
    },
    "looping": {
      "type": "string",
      "enumValues": [
        "off",
        "page"
      ],
      "value": "off"
    },
    "maxItemsPerPage": {
      "type": "number",
      "value": 0
    },
    "orientation": {
      "type": "string",
      "enumValues": [
        "horizontal",
        "vertical"
      ],
      "value": "horizontal"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "labelAccArrowNextPage": {
          "type": "string"
        },
        "labelAccArrowPreviousPage": {
          "type": "string"
        },
        "labelAccFilmStrip": {
          "type": "string"
        },
        "tipArrowNextPage": {
          "type": "string"
        },
        "tipArrowPreviousPage": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getItemsPerPage": {},
    "getPagingModel": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/* global __oj_film_strip_metadata:false */
(function () {
  __oj_film_strip_metadata.extension._WIDGET_NAME = 'ojFilmStrip';
  __oj_film_strip_metadata.extension._TRACK_CHILDREN = 'immediate';
  oj.CustomElementBridge.register('oj-film-strip', { metadata: __oj_film_strip_metadata });
})();

/* jslint browser: true*/
/**
 * Implementation of PagingModel used by FilmStrip.
 * @class oj.FilmStripPagingModel
 * @classdesc Implementation of PagingModel used by FilmStrip.
 * @extends EventSource
 * @implements PagingModel
 * @constructor
 * @ignore
 */

const FilmStripPagingModel = function () {
  this.Init();
};

oj._registerLegacyNamespaceProp('FilmStripPagingModel', FilmStripPagingModel);
// Subclass from oj.EventSource
oj.Object.createSubclass(FilmStripPagingModel, oj.EventSource, 'oj.FilmStripPagingModel');

/**
 * Initialize the instance.
 * @return {void}
 * @memberof FilmStripPagingModel
 * @instance
 * @export
 */
FilmStripPagingModel.prototype.Init = function () {
  FilmStripPagingModel.superclass.Init.call(this);

  this._page = -1;
  this._totalSize = 0;
  this._pageSize = -1;
};

/**
 * Set the total size.
 * @param {number} totalSize The total size.
 * @return {void}
 * @memberof FilmStripPagingModel
 * @instance
 */
FilmStripPagingModel.prototype.setTotalSize = function (totalSize) {
  this._totalSize = totalSize;
};

/**
 * Get the page size.
 * @returns {number} The page size.
 * @memberof FilmStripPagingModel
 * @instance
 */
FilmStripPagingModel.prototype.getPageSize = function () {
  return this._pageSize;
};

// start PagingModel interface methods //////////////////////////////////////

/**
 * Get the current page
 * @returns {number} The current page
 * @export
 * @memberof FilmStripPagingModel
 * @instance
 */
FilmStripPagingModel.prototype.getPage = function () {
  return this._page;
};

/**
 * Set the current page
 * @param {number} page The current page
 * @param {Object=} options Options<p>
 *                  pageSize: The page size.<p>
 * @returns {Promise} promise object triggering done when complete
 * @export
 * @memberof FilmStripPagingModel
 * @instance
 */
FilmStripPagingModel.prototype.setPage = function (page, options) {
  // ensure that the page index is an actual number, because the paging control
  // seems to set a string when you click on one of the page dots
  // eslint-disable-next-line no-param-reassign
  page = parseInt(page, 10);

  try {
    var prevPageCount = this.getPageCount();
    var prevPage = this._page;
    var prevPageSize = this._pageSize;
    var pageSize = prevPageSize;
    if (options && options.pageSize) {
      pageSize = options.pageSize;
    }

    // FIX : if the paging model hasn't been initialized yet,
    // just return a resolved promise instead of throwing the invalid page
    // error below
    if (this._totalSize === 0 && pageSize === -1) {
      return Promise.resolve();
    }

    var newPageCount = Math.ceil(this._totalSize / pageSize);
    if (page < 0 || page > newPageCount - 1) {
      throw new Error("JET FilmStrip: Invalid 'page' set: " + page);
    }

    var bFiredBeforePageEvent = false;
    if (page !== prevPage || pageSize !== prevPageSize) {
      var bSuccess = this.handleEvent('beforePage', {
        page: page,
        previousPage: prevPage
      });
      if (bSuccess === false) {
        return Promise.reject();
      }
      bFiredBeforePageEvent = true;
    }

    this._page = page;
    this._pageSize = pageSize;
    var pageCount = this.getPageCount();
    var self = this;

    return new Promise(function (resolve) {
      if (prevPageCount !== pageCount) {
        self.handleEvent('pageCount', { pageCount: pageCount, previousPageCount: prevPageCount });
      }
      if (bFiredBeforePageEvent) {
        var optionsObj = { page: page, previousPage: prevPage };
        if (options && options.loopDirection) {
          optionsObj.loopDirection = options.loopDirection;
        }
        self.handleEvent('page', optionsObj);
      }
      resolve(null);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 * Get the current page start index
 * @returns {number} The current page start index
 * @export
 * @memberof FilmStripPagingModel
 * @instance
 */
FilmStripPagingModel.prototype.getStartItemIndex = function () {
  // FIX : if there is no data yet, explicitly return -1 for
  // start index, because otherwise the calculated value would incorrectly
  // be 1
  if (this._page === -1 && this._pageSize === -1) {
    return -1;
  }

  return this._page * this._pageSize;
};

/**
 * Get the current page end index
 * @returns {number} The current page end index
 * @export
 * @memberof FilmStripPagingModel
 * @instance
 */
FilmStripPagingModel.prototype.getEndItemIndex = function () {
  return Math.min(this.getStartItemIndex() + this._pageSize, this._totalSize) - 1;
};

/**
 * Get the page count
 * @returns {number} The total number of pages
 * @export
 * @memberof FilmStripPagingModel
 * @instance
 */
FilmStripPagingModel.prototype.getPageCount = function () {
  return Math.ceil(this._totalSize / this._pageSize);
};

/**
 * Return the total number of items. Returns -1 if unknown.
 * @returns {number} total number of items
 * @export
 * @memberof FilmStripPagingModel
 * @instance
 */
FilmStripPagingModel.prototype.totalSize = function () {
  return this._totalSize;
};

/**
 * Returns the confidence for the totalSize value.
 * @return {string} "actual" if the totalSize is the time of the fetch is an exact number
 *                  "estimate" if the totalSize is an estimate
 *                  "atLeast" if the totalSize is at least a certain number
 *                  "unknown" if the totalSize is unknown
 * @export
 * @expose
 * @memberof FilmStripPagingModel
 * @instance
 */
FilmStripPagingModel.prototype.totalSizeConfidence = function () {
  return 'actual';
};

// end PagingModel interface methods ////////////////////////////////////////

/**
 * @ojcomponent oj.ojFilmStrip
 * @augments oj.baseComponent
 * @since 1.1.0
 *
 * @ojshortdesc A filmstrip lays out its children in a single row or column across logical pages and allows navigating through them.
 * @ojrole application
 * @class oj.ojFilmStrip
 *
 * @ojtsimport {module: "ojpagingmodel", type: "AMD", imported: ["PagingModel"]}
 * @ojpropertylayout [ {propertyGroup: "common", items: ["orientation", "maxItemsPerPage", "arrowPlacement", "arrowVisibility", "looping"]},
 *                     {propertyGroup: "data", items: ["currentItem"]} ]
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 1
 *
 * @ojoracleicon 'oj-ux-ico-film-strip'
 *
 * @classdesc
 * <h3 id="filmStripOverview-section">
 *   JET FilmStrip
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#filmStripOverview-section"></a>
 * </h3>
 *
 * <p>Description: Container element that lays out its children in a single
 * row or column across logical pages and allows navigating through them.
 *
 * <p>A JET FilmStrip can contain multiple direct child elements and
 * all child elements are expected to be the same size.
 * <p>FilmStrip will layout the child items across multiple logical pages and
 * allow for changing between logical pages.  When the element is resized,
 * relayout will occur and the number of pages and number of items shown per
 * page may change.
 *
 * <p>Note for performance reasons, if the FilmStrip content is expensive to render, you should wrap it in an <code class="prettyprint">oj-defer</code> element (API doc {@link oj.ojDefer}) to defer the rendering of that content until it is shown by the filmstrip.<br/>
 * See the Film Strip - Deferred Rendering demo for an example.</p>
 *
 * <pre class="prettyprint"><code>
 * &lt;oj-film-strip>
 *   &lt;div class='my-filmstrip-item'>Alpha&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Beta&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Gamma&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Delta&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Epsilon&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Zeta&lt;/div>
 * &lt;/oj-film-strip>
 * </code></pre>
 *
 * <p id="filmStrip-conveyorBelt-section">JET FilmStrip and ConveyorBelt look similar, but are intended to be used
 * for different purposes.
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#filmStrip-conveyorBelt-section"></a>
 * <p>Use FilmStrip when you want to:
 * <ul>
 * <li>layout a set of items across discrete logical pages</li>
 * <li>control which and how many items are shown</li>
 * <li>hide items outside the current viewport from tab order and screen reader</li>
 * </ul>
 * <p>Use ConveyorBelt when you want to:
 * <ul>
 * <li>handle overflow without showing a scrollbar</li>
 * <li>keep all items accessible via tabbing and readable by a screen reader</li>
 * </ul>
 *
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 *
 * <h3 id="keyboard-appdev-section">
 *   Keyboard Application Developer Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-appdev-section"></a>
 * </h3>
 *
 * <p>FilmStrip is for layout only.  Providing keyboard support for the child
 * items in the filmstrip is the responsibility of the application developer, if
 * the items do not already support keyboard interaction.  This could be done,
 * for example, by specifying <code class="prettyprint">tabindex</code> on each
 * item to enable tab navigation among them.
 *
 * <p>Only the child items of the FilmStrip that are visible in the current
 * logical page can be tabbed to.  Items outside the current logical page are
 * hidden from the tab order.
 *
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>FilmStrip is for layout only.  It is the responsibility of the
 * application developer to make the items in the filmstrip accessible.  Sighted
 * keyboard-only users need to be able to access the items in the layout just by
 * using the keyboard.  It is up to the child items of the FilmStrip to
 * support keyboard navigation.
 *
 * <p>Only the child items of the FilmStrip that are visible in the current
 * logical page can be read by a screen reader.  Items outside the current
 * logical page are hidden from a screen reader.
 *
 * <p>FilmStrip assigns itself the WAI-ARIA
 * <code class="prettyprint">role</code> of
 * <code class="prettyprint">"application"</code>.  The application <b>must</b>
 * specify a WAI-ARIA label for the FilmStrip element so that screen reader
 * users will understand the purpose of the FilmStrip.
 *
 * <p>The application <b>must</b> provide accessible controls for navigating
 * through the logical pages of the FilmStrip for use by screen reader users,
 * because the arrow keys may be intercepted by the screen reader itself.  The
 * navigation arrows built into FilmStrip can be used, or if they are hidden,
 * then alternative means, such as a paging control, must be provided.
 *
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Lazy Rendering</h4>
 * <p>If there are many items in the FilmStrip or complex content in each item,
 * it is recommended to implement lazy rendering of item content.  The application
 * should keep track of which items have rendered their content.  Items that are
 * initially visible in the FilmStrip should render their content from the start.
 * The application should then listen to events from the FilmStrip's
 * <code class="prettyprint">PagingModel</code> in order to render content for
 * items that are paged into view later.
 *
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>As with any JET element, in the unusual case that the directionality
 * (LTR or RTL) changes post-init, the FilmStrip must be
 * <code class="prettyprint">refresh()</code>ed.
 */

//-----------------------------------------------------
//                   Slots
//-----------------------------------------------------
/**
 * <p>The &lt;oj-film-strip> element lays out its children in a single row or column across logical pages and allows navigating through them.<p>
 *
 * @ojchild Default
 * @memberof oj.ojFilmStrip
 *
 * @example <caption>Initialize the film strip with child content specified:</caption>
 * &lt;oj-film-strip>
 *   &lt;div class='my-filmstrip-item'>Alpha&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Beta&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Gamma&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Delta&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Epsilon&lt;/div>
 *   &lt;div class='my-filmstrip-item'>Zeta&lt;/div>
 * &lt;/oj-film-strip>
 */

//-----------------------------------------------------
//                   Sub-ids
//-----------------------------------------------------
/**
 * <p>Sub-ID for the start navigation arrow of a horizontal FilmStrip.</p>
 *
 * @ojsubid oj-filmstrip-start-arrow
 * @memberof oj.ojFilmStrip
 *
 * @example <caption>Get the start navigation arrow:</caption>
 * var node = myFilmStrip.getNodeBySubId({'subId': 'oj-filmstrip-start-arrow'} );
 */

/**
 * <p>Sub-ID for the end navigation arrow of a horizontal FilmStrip.</p>
 *
 * @ojsubid oj-filmstrip-end-arrow
 * @memberof oj.ojFilmStrip
 *
 * @example <caption>Get the end navigation arrow:</caption>
 * var node = myFilmStrip.getNodeBySubId({'subId': 'oj-filmstrip-end-arrow'} );
 */

/**
 * <p>Sub-ID for the top navigation arrow of a vertical FilmStrip.</p>
 *
 * @ojsubid oj-filmstrip-top-arrow
 * @memberof oj.ojFilmStrip
 *
 * @example <caption>Get the top navigation arrow:</caption>
 * var node = myFilmStrip.getNodeBySubId({'subId': 'oj-filmstrip-top-arrow'} );
 */

/**
 * <p>Sub-ID for the bottom navigation arrow of a vertical FilmStrip.</p>
 *
 * @ojsubid oj-filmstrip-bottom-arrow
 * @memberof oj.ojFilmStrip
 *
 * @example <caption>Get the bottom navigation arrow:</caption>
 * var node = myFilmStrip.getNodeBySubId({'subId': 'oj-filmstrip-bottom-arrow'} );
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
 *       <td>FilmStrip</td>
 *       <td><kbd>Swipe</kbd></td>
 *       <td>Transition to an adjacent logical page of child items.</td>
 *     </tr>
 *     <tr>
 *       <td>Navigation Arrow</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Transition to an adjacent logical page of child items.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojFilmStrip
 */

/**
 * <p>FilmStrip itself is a tabstop and supports the following keyboard interactions:
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
 *     <tr>
 *       <td>FilmStrip</td>
 *       <td><kbd>UpArrow or LeftArrow</kbd> (<kbd>RightArrow</kbd> in RTL)</td>
 *       <td>Transition to the previous logical page of child items.</td>
 *     </tr>
 *     <tr>
 *       <td>FilmStrip</td>
 *       <td><kbd>DownArrow or RightArrow</kbd> (<kbd>LeftArrow</kbd> in RTL)</td>
 *       <td>Transition to the next logical page of child items.</td>
 *     </tr>
 *     <tr>
 *       <td>FilmStrip</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Transition to the first logical page of child items.</td>
 *     </tr>
 *     <tr>
 *       <td>FilmStrip</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Transition to the last logical page of child items.</td>
 *     </tr>
 *     <tr>
 *       <td>Navigation Arrow</td>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
 *       <td>Transition to an adjacent logical page of child items.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojFilmStrip
 */
(function () {
  // start static members and functions //////////////////////////////////////////

  const _ADJACENT = 'adjacent';
  // aria-hidden DOM attribute
  const _ARIA_HIDDEN = 'aria-hidden';
  const _AUTO = 'auto';
  // display CSS attribute
  const _DISPLAY = 'display';

  // threshold to initialize a drag scroll (pixels)
  const _DRAG_SCROLL_INIT_THRESHOLD = 3;
  // drag scroll threshold (percentage of filmStrip size)
  const _DRAG_SCROLL_THRESHOLD = 0.33;
  // drag scroll threshold (max distance, pixels)
  const _DRAG_SCROLL_MAX_THRESHOLD = 100;

  const _EMPTY_STRING = '';
  // throw an error when invalid "currentItem" property set
  const _ERROR_CURRENT_ITEM_NOT_FOUND =
    "JET FilmStrip: Value of 'currentItem' property is invalid. No such item exists: ";
  // throw an error when "orientation" property set to invalid value
  const _ERROR_INVALID_ORIENTATION =
    "JET FilmStrip: Unsupported value set as 'orientation' property: ";
  // throw an error when "arrowPlacement" property set to invalid value
  const _ERROR_INVALID_NAV_ARROW_PLACEMENT =
    "JET FilmStrip: Unsupported value set as 'arrowPlacement' property: ";
  // throw an error when "arrowVisibility" property set to invalid value
  const _ERROR_INVALID_NAV_ARROW_VISIBILITY =
    "JET FilmStrip: Unsupported value set as 'arrowVisibility' property: ";
  // throw an error when "looping" property set to invalid value
  const _ERROR_INVALID_LOOPING = "JET FilmStrip: Unsupported value set as 'looping' property: ";
  const _FLEX_BASIS = 'flex-basis';
  const _HIDDEN = 'hidden';
  // jQuery hidden selector
  const _HIDDEN_SELECTOR = ':hidden';
  const _HORIZONTAL = 'horizontal';
  const _HOVER = 'hover';
  const _CURRENT_ITEM = 'currentItem';
  const _MS_TRANSFORM = '-ms-transform';
  const _NONE = 'none';

  const _OJ_BOTTOM = 'oj-bottom';
  const _OJ_END = 'oj-end';
  const _OJ_FILMSTRIP_ARROW = 'oj-filmstrip-arrow';
  const _OJ_FILMSTRIP_ARROW_CONTAINER = 'oj-filmstrip-arrow-container';
  const _OJ_FILMSTRIP_ARROW_TRANSITION = 'oj-filmstrip-arrow-transition';
  const _OJ_FILMSTRIP_CONTAINER = 'oj-filmstrip-container';
  const _OJ_FILMSTRIP_HOVER = 'oj-filmstrip-hover';
  const _OJ_FILMSTRIP_ITEM = 'oj-filmstrip-item';
  const _OJ_FILMSTRIP_ITEM_CONTAINER = 'oj-filmstrip-item-container';
  const _OJ_FILMSTRIP_PAGE = 'oj-filmstrip-page';
  const _OJ_FILMSTRIP_PAGES_CONTAINER = 'oj-filmstrip-pages-container';
  const _OJ_FILMSTRIP_TRANSITION = 'oj-filmstrip-transition';
  const _OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_FROM = 'oj-filmstrip-transition-next-newpage-from';
  const _OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_FROM = 'oj-filmstrip-transition-next-oldpage-from';
  const _OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_FROM = 'oj-filmstrip-transition-prev-newpage-from';
  const _OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_FROM = 'oj-filmstrip-transition-prev-oldpage-from';
  const _OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_TO = 'oj-filmstrip-transition-next-newpage-to';
  const _OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_TO = 'oj-filmstrip-transition-next-oldpage-to';
  const _OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_TO = 'oj-filmstrip-transition-prev-newpage-to';
  const _OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_TO = 'oj-filmstrip-transition-prev-oldpage-to';
  const _OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_FIRSTPAGE =
    'oj-filmstrip-transition-display-as-firstpage';
  const _OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_LASTPAGE =
    'oj-filmstrip-transition-display-as-lastpage';
  const _OJ_FILMSTRIP_LABELLEDBY = 'aria-labelledby';
  const _OJ_FILMSTRIP_START_ARROW = 'oj-filmstrip-start-arrow';
  const _OJ_FILMSTRIP_END_ARROW = 'oj-filmstrip-end-arrow';
  const _OJ_FILMSTRIP_TOP_ARROW = 'oj-filmstrip-top-arrow';
  const _OJ_FILMSTRIP_BOTTOM_ARROW = 'oj-filmstrip-bottom-arrow';
  const _OJ_FILMSTRIP_VERTICAL = 'oj-filmstrip-vertical';
  const _OJ_START = 'oj-start';
  const _OJ_TOP = 'oj-top';
  const _LOOPING_OFF = 'off';
  const _LOOPING_PAGE = 'page';
  const _LOOPING_DIRECTION_NEXT = 'next';
  const _LOOPING_DIRECTION_PREV = 'prev';

  const _OVERLAY = 'overlay';
  const _PERIOD = '.';
  const _PX = 'px';
  // make sure the collapseEventTimeout param is less than the one used in the unit tests
  // in order to ensure that the filmStrip listener gets the resize event before the unit test
  const _RESIZE_LISTENER_COLLAPSE_EVENT_TIMEOUT = 25;
  const _TRANSFORM = 'transform';
  const _VERTICAL = 'vertical';
  const _VISIBLE = 'visible';
  // jQuery visible selector
  const _VISIBLE_SELECTOR = ':visible';
  const _WEBKIT_FLEX_BASIS = '-webkit-flex-basis';
  const _WEBKIT_TRANSFORM = '-webkit-transform';

  // log warning message when "disabled" property set
  const _WARNING_DISABLED_OPTION = "JET FilmStrip: 'disabled' property not supported";
  // log a warning when filmstrip has no children present
  const _WARNING_FILMSTRIP_EMPTY = 'JET FilmStrip: There are no nested children!';

  /**
   * Apply a CSS transform to the given object.
   * @param {jQuery} jqObj Object to apply transform to.
   * @param {string} transform The transform to apply.
   * @memberof oj.ojFilmStrip
   * @private
   */
  function _applyTransform(jqObj, transform) {
    jqObj
      .css(_WEBKIT_TRANSFORM, transform)
      .css(_MS_TRANSFORM, transform)
      .css(_TRANSFORM, transform);
  }

  /**
   * Remove a CSS transform from the given object.
   * @param {jQuery} jqObj Object to apply transform to.
   * @memberof oj.ojFilmStrip
   * @private
   */
  function _removeTransform(jqObj) {
    jqObj
      .css(_WEBKIT_TRANSFORM, _EMPTY_STRING)
      .css(_MS_TRANSFORM, _EMPTY_STRING)
      .css(_TRANSFORM, _EMPTY_STRING);
  }

  /**
   * Escape an html fragment/text.
   * @param {string} text Text to escape.
   * @returns {string} Escaped text.
   * @memberof oj.ojFilmStrip
   * @private
   */
  function _escapeHtml(text) {
    // let jQuery escape the text
    const jqDiv = $('<div></div>');
    jqDiv.text(text);
    return jqDiv[0].innerHTML; // @HTMLUpdateOK
  }

  // end static members and functions ////////////////////////////////////////////

  function _isInvalidCurrentItemId(id, elem) {
    return id && isValidIdentifier(id) && !elem.find(`#${id}`).length;
  }

  function _isInvalidCurrentItemIndex(index, elem) {
    return index != null && (index < 0 || index >= elem.children().length);
  }

  oj.__registerWidget('oj.ojFilmStrip', $.oj.baseComponent, {
    defaultElement: '<div>',
    widgetEventPrefix: 'oj',

    options: {
      /**
       * Specify the maximum number of child items to show in a logical page.
       * A value of 0 (the default) means that FilmStrip will show as many items
       * per logical page as will fit based on the element and item sizes.
       *
       * <p>FilmStrip may show fewer than the specified number of items when
       * <code class="prettyprint">max-items-per-page</code> is set to a value other
       * than 0 if the element size is smaller than what would be required to
       * show that many items.
       *
       * @expose
       * @memberof oj.ojFilmStrip
       * @instance
       * @type {number}
       * @default 0
       * @see #getItemsPerPage
       * @ojshortdesc Specifies the maximum number of child items shown in a logical page.
       * @ojmin 0
       *
       * @example <caption>Initialize the FilmStrip with the
       * <code class="prettyprint">max-items-per-page</code> attribute specified:</caption>
       * &lt;oj-film-strip max-items-per-page='3'>
       * &lt;/oj-film-strip>
       *
       * @example <caption>Get or set the <code class="prettyprint">maxItemsPerPage</code>
       * property after initialization:</caption>
       * // getter
       * var maxItemsPerPage = myFilmStrip.maxItemsPerPage;
       *
       * // setter
       * myFilmStrip.maxItemsPerPage = 3;
       */
      maxItemsPerPage: 0,

      /**
       * Specify the orientation of the FilmStrip.
       *
       * @expose
       * @memberof oj.ojFilmStrip
       * @instance
       * @type {string}
       * @ojvalue {string} "horizontal" Orient the FilmStrip horizontally.
       * @ojvalue {string} "vertical" Orient the FilmStrip vertically.
       * @default "horizontal"
       * @ojshortdesc Specifies the orientation of the FilmStrip.
       *
       * @example <caption>Initialize the FilmStrip with the
       * <code class="prettyprint">orientation</code> attribute specified:</caption>
       * &lt;oj-film-strip orientation='vertical'>
       * &lt;/oj-film-strip>
       *
       * @example <caption>Get or set the <code class="prettyprint">orientation</code>
       * property after initialization:</caption>
       * // getter
       * var orientation = myFilmStrip.orientation;
       *
       * // setter
       * myFilmStrip.orientation = 'vertical';
       */
      orientation: 'horizontal',

      /**
       * Specify the child item whose logical page should be displayed.  The
       * position of the item on the logical page is not guaranteed.
       *
       * <p>This attribute can be set to an object containing either string id of the item
       * or numeric 0-based index of the item or both.  If the object contains both
       * string id and numeric index, string id takes precedence.
       *
       * <p>FilmStrip will automatically update the value of this attribute when the
       * logical page is changed to be the first item on the new logical page.
       * When the value is updated automatically, it will be an object containing
       * numeric index and string id, if available.
       *
       * <p>When the element is resized, FilmStrip will preserve the value of
       * this attribute to show the new logical page on which the item is located.
       *
       * @property {string} [id] string id of the item
       * @property {number} [index] numeric 0-based index of the item
       *
       * @expose
       * @memberof oj.ojFilmStrip
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "{id?: string, index?: number}", jsdocOverride: true}
       * @default {"index" : 0}
       * @ojwriteback
       * @ojshortdesc Specifies the child item whose logical page should be displayed.
       *
       * @example <caption>Initialize the FilmStrip with the
       * <code class="prettyprint">current-item</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-film-strip current-item.index='3' current-item.id='thirdItemId'>
       * &lt;/oj-film-strip>
       *
       * &lt;!-- Using JSON notation -->
       * &lt;oj-film-strip current-item='{"index" : 3, "id" : "thirdItemId"}'>
       * &lt;/oj-film-strip>
       *
       * @example <caption>Get or set the <code class="prettyprint">currentItem</code>
       * property after initialization:</caption>
       *
       * // Get one
       * var index = myFilmStrip.currentItem.index;
       *
       * // Set one, leaving the others intact. Use the setProperty API for
       * // subproperties so that a property change event is fired.
       * myFilmStrip.setProperty('currentItem.index', 1);
       *
       * // Get all
       * var currentItem = myFilmStrip.currentItem;
       *
       * // Set all
       * myFilmStrip.currentItem = {'index' : 3, 'id' : 'thirdItemId'};
       */
      currentItem: { index: 0 },

      /**
       * Specify the placement of the navigation arrows.
       *
       * @expose
       * @memberof oj.ojFilmStrip
       * @instance
       * @type {string}
       * @ojvalue {string} "adjacent" Arrows are outside, adjacent to the filmStrip
       *          content.  The arrows are still inside the bounds of the filmStrip
       *          element itself.
       * @ojvalue {string} "overlay" Arrows are inside, overlaying the filmStrip content.
       * @default "adjacent"
       * @ojshortdesc Specifies the placement of the navigation arrows.
       *
       * @example <caption>Initialize the FilmStrip with the
       * <code class="prettyprint">arrow-placement</code> attribute specified:</caption>
       * &lt;oj-film-strip arrow-placement='overlay'>
       * &lt;/oj-film-strip>
       *
       * @example <caption>Get or set the <code class="prettyprint">arrowPlacement</code>
       * property after initialization:</caption>
       * // getter
       * var arrowPlacement = myFilmStrip.arrowPlacement;
       *
       * // setter
       * myFilmStrip.arrowPlacement = 'overlay';
       */
      arrowPlacement: 'adjacent',

      /**
       * Specify the visibility of the navigation arrows.
       *
       * @expose
       * @memberof oj.ojFilmStrip
       * @instance
       * @type {string}
       * @ojvalue {string} "visible" Arrows are visible.
       * @ojvalue {string} "hidden" Arrows are hidden.
       * @ojvalue {string} "hover" Arrows are visible when the mouse is over the
       *          filmStrip, and hidden otherwise.
       * @ojvalue {string} "auto" Behaves as if the value were
       *          <code class="prettyprint">visible</code> when the
       *          <code class="prettyprint">arrow-placement</code>
       *          attribute is set to <code class="prettyprint">adjacent</code>, and
       *          <code class="prettyprint">hover</code> when the
       *          <code class="prettyprint">arrow-placement</code>
       *          attribute is set to <code class="prettyprint">overlay</code>.
       * @default "auto"
       * @ojshortdesc Specifies the visibility of the navigation arrows.
       *
       * @example <caption>Initialize the FilmStrip with the
       * <code class="prettyprint">arrow-visibility</code> attribute specified:</caption>
       * &lt;oj-film-strip arrow-visibility='visible'>
       * &lt;/oj-film-strip>
       *
       * @example <caption>Get or set the <code class="prettyprint">arrowVisibility</code>
       * property after initialization:</caption>
       * // getter
       * var arrowVisibility = myFilmStrip.arrowVisibility;
       *
       * // setter
       * myFilmStrip.arrowVisibility = 'visible';
       */
      arrowVisibility: 'auto',

      /**
       * Specify the navigation looping behavior.
       *
       *
       * @expose
       * @memberof oj.ojFilmStrip
       * @instance
       * @type {string}
       * @ojvalue {string} "off"  Navigation is bounded between first and last page and
       *                          can't go any further in the direction of navigation.
       * @ojvalue {string} "page" Navigation is not bounded between first and last page
       *                          and can go further in the direction of navigation.
       *                          This lets the user loop around from first page to last page, or
       *                          from last page to first page.
       * @default "off"
       * @ojshortdesc Specifies the navigation looping behavior
       *
       * @example <caption>Initialize the FilmStrip with the
       * <code class="prettyprint">looping</code> attribute specified:</caption>
       * &lt;oj-film-strip looping='page'>
       * &lt;/oj-film-strip>
       *
       * @example <caption>Get or set the <code class="prettyprint">looping</code>
       * property after initialization:</caption>
       * // getter
       * var looping = myFilmStrip.looping;
       *
       * // setter
       * myFilmStrip.looping = 'page';
       */
      looping: 'off'

      /**
       * FilmStrip inherits the <code class="prettyprint">disabled</code>
       * attribute from its superclass, but does not support it in order to avoid
       * tight coupling between a FilmStrip and its contents.  Setting this
       * attribute on FilmStrip has no effect.
       *
       * <p><b>WARNING:</b> Applications should not depend on this behavior
       * because we reserve the right to change it in the future in order to
       * support <code class="prettyprint">disabled</code> and propagate it to
       * child elements of FilmStrip.
       *
       * @member
       * @name disabled
       * @memberof oj.ojFilmStrip
       * @instance
       * @type {boolean}
       * @default false
       * @ignore
       */
      // disabled attribute declared in superclass, but we still want the above API doc

      // Events

      /**
       * Triggered when the filmStrip is created.
       *
       * @event
       * @name create
       * @memberof oj.ojFilmStrip
       * @instance
       * @ignore
       */
      // create event declared in superclass, but we still want the above API doc
    },

    /**
     * After _ComponentCreate and _AfterCreate,
     * the widget should be 100% set up. this._super should be called first.
     * @return {void}
     * @override
     * @protected
     * @instance
     * @memberof oj.ojFilmStrip
     */
    _ComponentCreate: function () {
      // Override of protected base class method.
      // call superclass first
      this._super();

      const elem = this.element;
      elem.addClass('oj-filmstrip oj-component').attr('tabindex', 0).attr('role', 'application');

      // ensure a unique id for use with aria-labelledby on navigation arrows
      elem.uniqueId();

      this._focusable({ element: elem, applyHighlight: true });

      // log warning message when "disabled" property set
      const options = this.options;
      if (options.disabled) {
        warn(_WARNING_DISABLED_OPTION);
      }

      // throw error if "orientation" property set to invalid value
      if (options.orientation !== _HORIZONTAL && options.orientation !== _VERTICAL) {
        throw new Error(_ERROR_INVALID_ORIENTATION + options.orientation);
      }

      // throw error if "arrowPlacement" property set to invalid value
      if (options.arrowPlacement !== _ADJACENT && options.arrowPlacement !== _OVERLAY) {
        throw new Error(_ERROR_INVALID_NAV_ARROW_PLACEMENT + options.arrowPlacement);
      }

      // throw error if "arrowVisibility" property set to invalid value
      if (
        options.arrowVisibility !== _VISIBLE &&
        options.arrowVisibility !== _HIDDEN &&
        options.arrowVisibility !== _HOVER &&
        options.arrowVisibility !== _AUTO
      ) {
        throw new Error(_ERROR_INVALID_NAV_ARROW_VISIBILITY + options.arrowVisibility);
      }

      // throw error if "looping" property set to invalid value
      if (options.looping !== _LOOPING_OFF && options.looping !== _LOOPING_PAGE) {
        throw new Error(_ERROR_INVALID_LOOPING + options.looping);
      }

      this.touchEventNamespace = this.eventNamespace + 'Touch';
      this.mouseEventNamespace = this.eventNamespace + 'Mouse';
      this.keyEventNamespace = this.eventNamespace + 'Key';
      this.navArrowHoverableEventNamespace = this.eventNamespace + 'NavArrowHoverable';

      // Make sure currentItem is an object of (id, index)
      options.currentItem = this._convertCurrentItemToObj(options.currentItem);

      if (elem.children().length && options.currentItem) {
        if (
          _isInvalidCurrentItemId(options.currentItem.id, elem) ||
          _isInvalidCurrentItemIndex(options.currentItem.index, elem)
        ) {
          throw new Error(_ERROR_CURRENT_ITEM_NOT_FOUND + JSON.stringify(options.currentItem));
        }
      }

      this._setup(true);

      // update the currentItem object in options.
      this._populateCurrentItemObj(options.currentItem);
      this.option(_CURRENT_ITEM, options.currentItem, {
        _context: { internalSet: true, writeback: true }
      });
    },

    // This method currently runs at create, init, and refresh time (since refresh() is called by _init()).
    /**
     * Refreshes the visual state of the FilmStrip. JET elements require a
     * <code class="prettyprint">refresh()</code> after the DOM is
     * programmatically changed underneath the element.
     *
     * <p>This method does not accept any arguments.
     * @return {void}
     *
     * @expose
     * @memberof oj.ojFilmStrip
     * @instance
     * @ojshortdesc Refreshes the visual state of the FilmStrip.
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * myFilmStrip.refresh();
     */
    refresh: function () {
      // Override of public base class method.
      this._super();

      this._setup(false);
    },

    /**
     * Get the actual number of items shown per logical page.
     * <p>The value returned by this method may be different from the value of the
     * <code class="prettyprint">maxItemsPerPage</code> property.
     * @returns {number} The actual number of items shown per logical page.
     *
     * @expose
     * @memberof oj.ojFilmStrip
     * @instance
     * @see #maxItemsPerPage
     * @ojshortdesc Get the actual number of items shown per logical page.
     *
     * @example <caption>Invoke the <code class="prettyprint">getItemsPerPage</code> method:</caption>
     * var itemsPerPage = myFilmStrip.getItemsPerPage();
     */
    getItemsPerPage: function () {
      return this._itemsPerPage;
    },

    /**
     * Get the PagingModel created and used by the FilmStrip.  The PagingModel
     * provides information about the FilmStrip's logical pages and a way to
     * programmatically change pages.
     * @returns {Object} The instance of the PagingModel created and used by the FilmStrip.
     * @ojsignature {target: "Type",
     *               value: "PagingModel",
     *               for: "returns"}
     *
     * @expose
     * @memberof oj.ojFilmStrip
     * @instance
     * @ojshortdesc Get the PagingModel created and used by the FilmStrip.
     *
     * @example <caption>Invoke the <code class="prettyprint">getPagingModel</code> method:</caption>
     * var pagingModel = myFilmStrip.getPagingModel();
     */
    getPagingModel: function () {
      return this._pagingModel;
    },

    /**
     * Notifies the component that its subtree has been made visible
     * programmatically after the component has been created.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @protected
     * @override
     */
    _notifyCommon: function () {
      // perform a deferred layout
      if (this._needsSetup) {
        this._setup(this._needsSetup[0]);
      } else {
        // explicitly handle a resize in case we don't get a notification when shown
        this._handleResize();
      }
    },
    _NotifyShown: function () {
      this._super();
      this._notifyCommon();
    },

    /**
     * Notifies the component that its subtree has been connected to the document
     * programmatically after the component has been created.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @protected
     * @override
     */
    _NotifyAttached: function () {
      this._super();
      this._notifyCommon();
    },

    // isInit is true for init (create and re-init), false for refresh
    /**
     * Setup the filmStrip.
     * @param {boolean} isInit True if _setup is called from _init(), false
     *        if called from refresh().
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _setup: function (isInit) {
      // Private, not an override (not in base class).
      const self = this;

      // FIX : always create paging model, even if filmstrip is
      // detached or hidden, so that it's available for an assocated paging
      // control
      // (Note: Check whether paging model is null, because if the filmstrip
      // was created while detached or hidden, then when it's attached or
      // shown, _setup will be called again with isInit=true, and we don't
      // want to create a different instance of the paging model.)
      if (isInit && !this._pagingModel) {
        this._pagingModel = new FilmStripPagingModel();
      }

      // FIX : when using jquery find() in the filmStrip, filter out any results from
      // nested filmStrips
      if (isInit && !this._filterNestedFilmStripsFunc) {
        this._filterNestedFilmStripsFunc = function (index, elem) {
          return $(elem).closest('.oj-filmstrip')[0] === self.element[0];
        };
      }

      // if filmStrip is detached or hidden, we can't layout correctly, so
      // defer layout until filmStrip is attached or shown
      if (!this._canCalculateSizes()) {
        // want a true value of isInit to take precedence over a false value
        let oldIsInit = false;
        if (this._needsSetup) {
          oldIsInit = this._needsSetup[0];
        }
        this._needsSetup = [isInit || oldIsInit];
        return;
      }
      this._needsSetup = null;

      this._bRTL = this._GetReadingDirection() === 'rtl';
      this._bTouchSupported = isTouchSupported();
      const elem = this.element;
      if (isInit) {
        this._itemsPerPage = 0;
        this._handlePageFunc = function (event) {
          self._handlePage(event);
        };
        this._componentSize = 0;
        this._itemSize = -1;
        // eslint-disable-next-line no-unused-vars
        this._handleTransitionEndFunc = function () {
          self._handleTransitionEnd();
        };
        // eslint-disable-next-line no-unused-vars
        this._handleResizeFunc = function () {
          self._handleResize();
        };

        if (this._bTouchSupported) {
          this._handleTouchStartFunc = function (event) {
            self._handleTouchStart(event);
          };
          this._handleTouchMoveFunc = function (event) {
            self._handleTouchMove(event);
          };
          this._handleTouchEndFunc = function () {
            self._handleTouchEnd();
          };
          this._addTouchListeners();
        }
        this._handleMouseDownFunc = function (event) {
          self._handleMouseDown(event);
        };
        this._handleMouseMoveFunc = function (event) {
          self._handleMouseMove(event);
        };
        this._handleMouseUpFunc = function () {
          self._handleMouseUp();
        };
        this._addMouseListeners();
        this._handleKeyDownFunc = function (event) {
          self._handleKeyDown(event);
        };
        this._addKeyListeners();
      } else {
        this._destroyInternal();
      }

      // notify the original children of the filmStrip that they were detached from
      // the DOM BEFORE actually detaching so that components can save state
      const originalItems = elem.children();

      for (let i = 0; i < originalItems.length; i++) {
        subtreeDetached(originalItems[i]);
      }

      const pagingModel = this._pagingModel;
      if (isInit) {
        // register the page change listener
        pagingModel.on('page', this._handlePageFunc);
      }
      // initialize the paging model with the total number of items
      // FIX : always set total size on paging model in case
      // items have been appended and filmstrip has been refreshed
      pagingModel.setTotalSize(originalItems.length);

      // wrap the original child DOM BEFORE adding the resize listener
      this._wrapChildren();

      this._adjustSizes();

      // notify the original children of the filmStrip that they were attached
      // again after wrapping them
      for (let i = 0; i < originalItems.length; i++) {
        subtreeAttached(originalItems[i]);
      }

      if (originalItems.length === 0) {
        warn(_WARNING_FILMSTRIP_EMPTY);
      }

      // register resize handler, note it has been previously unregistered
      // in _destroyInternal() if isInit==false (JET-49032)
      addResizeListener(
        elem[0],
        this._handleResizeFunc,
        _RESIZE_LISTENER_COLLAPSE_EVENT_TIMEOUT
      );
    },

    /**
     * Destroy the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @override
     * @protected
     */
    _destroy: function () {
      // Override of protected base class method.
      if (this._bTouchSupported) {
        this._removeTouchListeners();
        this._handleTouchStartFunc = null;
        this._handleTouchMoveFunc = null;
        this._handleTouchEndFunc = null;
      }
      this._removeMouseListeners();
      this._handleMouseDownFunc = null;
      this._handleMouseMoveFunc = null;
      this._handleMouseUpFunc = null;
      this._removeKeyListeners();
      this._handleKeyDownFunc = null;

      this._destroyInternal();
      this._pagingModel.off('page', this._handlePageFunc);
      this._handlePageFunc = null;
      this._pagingModel = null;
      this._handleResizeFunc = null;
      this._handleTransitionEndFunc = null;
      this._filterNestedFilmStripsFunc = null;

      const elem = this.element;
      elem
        .removeClass('oj-filmstrip oj-component ' + _OJ_FILMSTRIP_HOVER)
        .removeAttr('tabindex role')
        .removeAttr(_OJ_FILMSTRIP_LABELLEDBY);

      // remove a generated unique id
      elem.removeUniqueId();

      // remove passive listeners if added
      if (this._IsCustomElement()) {
        elem[0].removeEventListener('touchstart', this._delegatedHandleTouchStartFunc, {
          passive: true
        });
        elem[0].removeEventListener('touchmove', this._delegatedHandleTouchMoveFunc, {
          passive: false
        });
        delete this._delegatedHandleTouchStartFunc;
        delete this._delegatedHandleTouchMoveFunc;
      }

      this._super();
    },

    /**
     * Destroy the internal structure of the filmStrip that will be recreated
     * during a refresh.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _destroyInternal: function () {
      // FIX : clear the flag to handle a deferred resize
      this._deferredHandleResize = false;

      // FIX : resolve busy state when destroying
      this._resolveBusyState();

      const elem = this.element;
      removeResizeListener(elem[0], this._handleResizeFunc);
      // reset item size so it will be recalculated at the next layout
      this._itemSize = -1;
      if (this._queuedHandleResize) {
        clearTimeout(this._queuedHandleResize);
        this._queuedHandleResize = null;
      }

      const originalItems = this._getItems();
      let i;
      // notify the original children of the filmStrip that they were detached from
      // the DOM BEFORE actually detaching so that components can save state
      for (i = 0; i < originalItems.length; i++) {
        subtreeDetached(originalItems[i]);
      }

      this._clearCalculatedSizes();
      const itemContainers = this._getItemContainers();
      // remove logical page containers here instead of in _unwrapChildren because
      // they're added in _adjustSizes, not in _wrapChildren
      itemContainers.unwrap();
      this._unwrapChildren();

      // notify the original children of the filmStrip that they were attached
      // again after unwrapping them
      for (i = 0; i < originalItems.length; i++) {
        subtreeAttached(originalItems[i]);
      }
    },

    /**
     * Set an option on the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @override
     * @protected
     */
    _setOption: function (key, value, flags) {
      // Override of protected base class method.
      // Method name needn't be quoted since is in externs.js.
      const options = this.options;
      let bRefresh = false;
      let newPageIndex = -1;
      const pagingModel = this._pagingModel;
      const oldPageIndex = pagingModel.getPage();

      switch (key) {
        case 'disabled':
          // log warning message when "disabled" property set
          warn(_WARNING_DISABLED_OPTION);
          break;
        case 'orientation':
          // throw error if "orientation" property set to invalid value
          if (value !== _HORIZONTAL && value !== _VERTICAL) {
            throw new Error(_ERROR_INVALID_ORIENTATION + value);
          }
          bRefresh = options.orientation !== value;
          break;
        case 'maxItemsPerPage':
          bRefresh = options.maxItemsPerPage !== value;
          break;
        case 'arrowPlacement':
          // throw error if "arrowPlacement" property set to invalid value
          if (value !== _ADJACENT && value !== _OVERLAY) {
            throw new Error(_ERROR_INVALID_NAV_ARROW_PLACEMENT + value);
          }
          bRefresh = options.arrowPlacement !== value;
          break;
        case 'arrowVisibility':
          // throw error if "arrowVisibility" property set to invalid value
          if (value !== _VISIBLE && value !== _HIDDEN && value !== _HOVER && value !== _AUTO) {
            throw new Error(_ERROR_INVALID_NAV_ARROW_VISIBILITY + value);
          }
          bRefresh = options.arrowVisibility !== value;
          break;
        case 'looping':
          // throw error if "looping" property set to invalid value
          if (value !== _LOOPING_OFF && value !== _LOOPING_PAGE) {
            throw new Error(_ERROR_INVALID_LOOPING + value);
          }
          bRefresh = options.looping !== value;
          break;
        case _CURRENT_ITEM:
          // Make sure currentItem value is an object of (id, index)
          // eslint-disable-next-line no-param-reassign
          value = this._convertCurrentItemToObj(value);
          this._populateCurrentItemObj(value);
          var currentItem = options.currentItem;
          if (
            currentItem &&
            value &&
            (currentItem.id !== value.id || currentItem.index !== value.index)
          ) {
            newPageIndex = this._findPage(value);
            // throw error if item not found
            if (newPageIndex < 0 || newPageIndex >= pagingModel.getPageCount()) {
              throw new Error(_ERROR_CURRENT_ITEM_NOT_FOUND + JSON.stringify(value));
            }
          }
          break;
        default:
          break;
      }

      this._super(key, value, flags);

      if (key === _CURRENT_ITEM && newPageIndex > -1 && newPageIndex !== oldPageIndex) {
        pagingModel.setPage(newPageIndex);
      }

      if (bRefresh) {
        this._setup(false);
      }
    },

    /**
     * Handle a component resize.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handleResize: function () {
      // FIX : if we're handling a page change, defer handling the resize
      if (this._busyStateResolveFunc) {
        this._deferredHandleResize = true;
      } else if (!this._bHandlingResize) {
        // handle the resize if not already handling one
        this._bHandlingResize = true;
        this._adjustSizes(true);
        this._bHandlingResize = false;
      } else if (!this._queuedHandleResize) {
        // if already handling a resize, queue another one
        const self = this;
        this._queuedHandleResize = setTimeout(function () {
          self._queuedHandleResize = null;
          self._handleResize();
        }, 0);
      }
    },

    /**
     * Determine whether the filmStrip is oriented horizontally or vertically.
     * @returns {boolean} True if horizontal, false if vertical.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _isHorizontal: function () {
      const options = this.options;
      return options.orientation !== _VERTICAL;
    },

    /**
     * Determine whether the looping behavior is set to page
     * @returns {boolean} True if looping is set to page, false otherwise.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _isLoopingPage: function () {
      const options = this.options;
      return options.looping === _LOOPING_PAGE;
    },

    /**
     * Get the CSS position attribute to use.
     * @returns {string} CSS position attribute name.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _getCssPositionAttr: function () {
      const bHorizontal = this._isHorizontal();
      if (bHorizontal) {
        if (this._bRTL) {
          return 'right';
        }
        return 'left';
      }
      return 'top';
    },

    /**
     * Get the CSS size attribute to use.
     * @returns {string} CSS size attribute name.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _getCssSizeAttr: function () {
      const bHorizontal = this._isHorizontal();
      return bHorizontal ? 'width' : 'height';
    },

    /**
     * Determine whether the filmStrip can calculate sizes (when it is
     * attached to the page DOM and not hidden).
     * @returns {boolean} True if sizes can be calculated, false if not.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _canCalculateSizes: function () {
      const div = document.createElement('div');
      const style = div.style;
      // need to set absolute position in order to get correct offsetwidth when
      // flexbox layout is applied; otherwise the offsetwidth becomes 0
      style.position = 'absolute';
      style.width = '10px';
      style.height = '10px';
      const elem = this.element[0];
      elem.appendChild(div); // @HTMLUpdateOK div is created locally at the beginning of this function
      let bCanCalcSizes = false;
      try {
        bCanCalcSizes = div.offsetWidth > 0 && div.offsetHeight > 0;
      } catch (e) {
        // do nothing
      }
      elem.removeChild(div);
      return bCanCalcSizes;
    },

    /**
     * Wrap the original child items of the filmStrip in internal layout structure.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _wrapChildren: function () {
      const elem = this.element;
      const bHorizontal = this._isHorizontal();
      const originalItems = elem.children();

      // prettier-ignore
      originalItems.addClass(_OJ_FILMSTRIP_ITEM).wrap( // @HTMLUpdateOK
        `<div class="${_OJ_FILMSTRIP_CONTAINER} ${_OJ_FILMSTRIP_ITEM_CONTAINER}"></div>`
      );

      // need to initially specify the position on the pagesWrapper so that we can
      // always get the value later
      const cssAttr = this._getCssPositionAttr();
      // prettier-ignore
      const pagesWrapper = elem
        .children()
        .wrapAll( // @HTMLUpdateOK
          `<div class="${_OJ_FILMSTRIP_CONTAINER} ${_OJ_FILMSTRIP_PAGES_CONTAINER}"></div>`
        )
        .parent()
        .css(cssAttr, '0px');
      this._pagesWrapper = pagesWrapper;

      const options = this.options;
      if (options.arrowVisibility !== _HIDDEN && options.arrowPlacement === _ADJACENT) {
        // FIX : add the oj-filmstrip-container class to the content
        // container so that it is a flexbox layout
        // prettier-ignore
        this._contentWrapper = pagesWrapper
          .wrap( // @HTMLUpdateOK
            `<div class="${_OJ_FILMSTRIP_CONTAINER} oj-filmstrip-content-container"></div>`
          )
          .parent();
      }

      elem.addClass(_OJ_FILMSTRIP_CONTAINER);
      if (!bHorizontal) {
        elem.addClass(_OJ_FILMSTRIP_VERTICAL);
      }

      // Fix  - ACC: FIF TOUR PAGE DOESN'T DESCRIBE WHAT'S WITHIN THE FILMSTRIP
      // Create a page info element that will contain the current page information for accessibility
      const pageInfoElem = this._createPageInfoElem();
      const elementId = elem.attr('id');
      const pageInfoId = pageInfoElem.attr('id');
      elem.append(pageInfoElem); // @HTMLUpdateOK
      elem.attr(_OJ_FILMSTRIP_LABELLEDBY, `${elementId} ${pageInfoId}`); // @HTMLUpdateOK
      this._pageInfoElem = pageInfoElem;

      // FIX : only need to create nav buttons if the filmstrip
      // is not empty
      if (options.arrowVisibility !== _HIDDEN && originalItems.length > 0) {
        this._prevButton = this._createPrevNavArrow();
        this._nextButton = this._createNextNavArrow();

        if (this._navArrowsShownOnHover()) {
          this._setupNavArrowsHoverable();
        }
      }
    },

    /**
     * Unwrap the internal layout structure around the original child items of the
     * filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _unwrapChildren: function () {
      const elem = this.element;
      const originalItems = this._getItems();

      // unregister elem as hoverable
      this._tearDownNavArrowsHoverable();

      // remove navigation arrow containers
      if (this._prevButton) {
        this._UnregisterChildNode(this._prevButton);
        this._prevButton = null;
      }
      if (this._nextButton) {
        this._UnregisterChildNode(this._nextButton);
        this._nextButton = null;
      }
      const navArrowContainers = elem.children(_PERIOD + _OJ_FILMSTRIP_ARROW_CONTAINER);
      if (navArrowContainers) {
        navArrowContainers.remove();
      }

      if (this._pageInfoElem) {
        this._UnregisterChildNode(this._pageInfoElem);
        this._pageInfoElem.remove();
        this._pageInfoElem = null;
      }

      // the individual page containers that were added in _adjustSizes are not
      // removed here; they are expected to have been removed before calling
      // _unwrapChildren
      originalItems
        .removeClass(_OJ_FILMSTRIP_ITEM) // original children
        .unwrap() // remove item containers
        .unwrap(); // remove pages container
      this._pagesWrapper = null;
      if (this._contentWrapper) {
        originalItems.unwrap(); // remove content container
        this._contentWrapper = null;
      }

      elem.removeClass(`${_OJ_FILMSTRIP_CONTAINER} ${_OJ_FILMSTRIP_VERTICAL}`);
    },

    /**
     * Create the page info element to contain the current page information
     * @returns {jQuery} Page Info jQuery object.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _createPageInfoElem: function () {
      const pageInfoElem = $(document.createElement('div'));
      pageInfoElem.uniqueId();
      pageInfoElem.addClass('oj-helper-hidden-accessible oj-filmstrip-liveregion');
      pageInfoElem.attr({ 'aria-live': 'polite', 'aria-atomic': 'true' });
      return pageInfoElem;
    },

    /**
     * Update the page info element that contains the current page information
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _updatePageInfoElem: function () {
      const pagingModel = this._pagingModel;
      const pageIndex = pagingModel.getPage();
      const pageCount = pagingModel.getPageCount();
      const pageInfo = _escapeHtml(
        this.getTranslatedString('labelAccFilmStrip', {
          pageIndex: pageIndex + 1,
          pageCount: pageCount
        })
      );
      const pageInfoElem = this._pageInfoElem;
      if (pageInfoElem) {
        pageInfoElem.text(pageInfo);
      }
    },

    /**
     * Setup events to only show the navigation arrows when the mouse hovers over
     * the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _setupNavArrowsHoverable: function () {
      // Note: Use oj-filmstrip-hover marker instead of standard oj-hover marker
      // because if we use the standard one, then when it's added to the filmStrip
      // root node, all hoverables inside the filmStrip appear as if the mouse
      // were hovering over them.
      // Note: keep this logic updated if superclass _hoverable method changes.
      const elem = this.element;
      elem
        .on('mouseenter' + this.navArrowHoverableEventNamespace, function (event) {
          if (!$(event.currentTarget).hasClass('oj-disabled')) {
            $(event.currentTarget).addClass(_OJ_FILMSTRIP_HOVER);
          }
        })
        .on('mouseleave' + this.navArrowHoverableEventNamespace, function (event) {
          $(event.currentTarget).removeClass(_OJ_FILMSTRIP_HOVER);
        });
    },

    /**
     * Tear down events to only show the navigation arrows when the mouse hovers
     * over the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _tearDownNavArrowsHoverable: function () {
      const elem = this.element;
      elem.off(this.navArrowHoverableEventNamespace);
    },

    /**
     * Determine whether navigation arrows should only be shown on hover.
     * @returns {boolean} True if nav arrows should only be shown on hover, false
     *          otherwise.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _navArrowsShownOnHover: function () {
      const options = this.options;
      const arrowVisibility = options.arrowVisibility;
      return (
        arrowVisibility === _HOVER ||
        (arrowVisibility === _AUTO && options.arrowPlacement === _OVERLAY)
      );
    },

    /**
     * Determine whether there is a previous logical page.
     * @returns {boolean} True if there is a previous logical page, false otherwise.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _hasPrevPage: function () {
      const pagingModel = this._pagingModel;
      return pagingModel.getPage() > 0;
    },

    /**
     * Determine whether there is a next logical page.
     * @returns {boolean} True if there is a next logical page, false otherwise.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _hasNextPage: function () {
      const pagingModel = this._pagingModel;
      return pagingModel.getPage() < pagingModel.getPageCount() - 1;
    },

    /**
     * Go to the previous logical page.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _prevPage: function () {
      const pagingModel = this._pagingModel;
      if (this._hasPrevPage()) {
        pagingModel.setPage(pagingModel.getPage() - 1);
      } else {
        const pageCount = pagingModel.getPageCount();
        // navigate from first page to last page
        if (this._isLoopingPage() && pageCount > 1) {
          pagingModel.setPage(pageCount - 1, { loopDirection: _LOOPING_DIRECTION_PREV });
        }
      }
    },

    /**
     * Go to the next logical page.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _nextPage: function () {
      const pagingModel = this._pagingModel;
      if (this._hasNextPage()) {
        pagingModel.setPage(pagingModel.getPage() + 1);
      } else {
        const pageCount = pagingModel.getPageCount();
        // navigate from last page to first page
        if (this._isLoopingPage() && pageCount > 1) {
          pagingModel.setPage(0, { loopDirection: _LOOPING_DIRECTION_NEXT });
        }
      }
    },

    /**
     * Determine whether there is a next logical page.
     * @param {boolean} bShow True to show the navigation arrow, false to hide it.
     * @param {jQuery} jqNavArrow Navigation arrow jQuery object.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _displayNavigationArrow: function (bShow, jqNavArrow) {
      const options = this.options;
      const navArrowPlacement = options.arrowPlacement;
      if (navArrowPlacement === _ADJACENT) {
        jqNavArrow.css('visibility', bShow ? '' : _HIDDEN);
      } else {
        jqNavArrow.parent().css('display', bShow ? '' : _NONE);
      }
    },

    /**
     * Update whether the navigation arrows are shown.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _updateNavigationArrowsDisplay: function () {
      const options = this.options;
      const navArrowVisibility = options.arrowVisibility;
      if (navArrowVisibility !== _HIDDEN) {
        const pagingModel = this._pagingModel;
        const pageIndex = pagingModel.getPage();
        const pageCount = pagingModel.getPageCount();
        const bLooping = this._isLoopingPage() && pageCount > 1;
        this._displayNavigationArrow(bLooping || pageIndex !== 0, this._prevButton);
        this._displayNavigationArrow(bLooping || pageIndex !== pageCount - 1, this._nextButton);
      }
    },

    /**
     * Create the previous navigation arrow.
     * @returns {jQuery} Navigation arrow jQuery object.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _createPrevNavArrow: function () {
      const elem = this.element;
      const bHorizontal = this._isHorizontal();
      const locationMarker = bHorizontal ? _OJ_START : _OJ_TOP;
      const container = this._createNavigationArrowContainer(locationMarker);

      const options = this.options;
      const navArrowPlacement = options.arrowPlacement;

      // need to append prev button when overlay so that it is in front of the
      // filmstrip items in z-order
      if (navArrowPlacement === _OVERLAY) {
        elem.append(container); // @HTMLUpdateOK
      } else {
        elem.prepend(container); // @HTMLUpdateOK
      }

      const label = _escapeHtml(this.getTranslatedString('labelAccArrowPreviousPage'));
      const tooltip = _escapeHtml(this.getTranslatedString('tipArrowPreviousPage'));
      const navArrow = this._createNavigationArrow(container, locationMarker, label, tooltip);
      const self = this;
      navArrow.on('click', function () {
        self._prevPage();
      });

      return navArrow;
    },

    /**
     * Create the next navigation arrow.
     * @returns {jQuery} Navigation arrow jQuery object.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _createNextNavArrow: function () {
      const elem = this.element;
      const bHorizontal = this._isHorizontal();
      const locationMarker = bHorizontal ? _OJ_END : _OJ_BOTTOM;
      const container = this._createNavigationArrowContainer(locationMarker);
      elem.append(container); // @HTMLUpdateOK

      const label = _escapeHtml(this.getTranslatedString('labelAccArrowNextPage'));
      const tooltip = _escapeHtml(this.getTranslatedString('tipArrowNextPage'));
      const navArrow = this._createNavigationArrow(container, locationMarker, label, tooltip);
      const self = this;
      navArrow.on('click', function () {
        self._nextPage();
      });

      return navArrow;
    },

    /**
     * Create the container around a navigation arrow.
     * @param {string} locationMarker Marker class for the location of the
     *        navigation arrow: oj-top, oj-bottom, oj-start, or oj-end.
     * @returns {jQuery} jQuery object for the container around a navigation arrow.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _createNavigationArrowContainer: function (locationMarker) {
      const container = $(document.createElement('div'));
      container.addClass(_OJ_FILMSTRIP_ARROW_CONTAINER + ' ' + locationMarker);
      const options = this.options;
      const navArrowPlacement = options.arrowPlacement;
      if (navArrowPlacement === _OVERLAY) {
        container.addClass('oj-filmstrip-arrow-container-overlay');

        if (this._navArrowsShownOnHover()) {
          container.addClass(_OJ_FILMSTRIP_ARROW_TRANSITION);
        }
      }
      return container;
    },

    /**
     * Create a navigation arrow.
     * @param {jQuery} parentElem Parent DOM element of the navigation arrow.
     * @param {string} locationMarker Marker class for the location of the
     *        navigation arrow: oj-top, oj-bottom, oj-start, or oj-end.
     * @param {string} label Accessible label for the navigation arrow.
     * @param {string} tooltip Tooltip for the navigation arrow.
     * @returns {jQuery} Navigation arrow jQuery object.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _createNavigationArrow: function (parentElem, locationMarker, label, tooltip) {
      const str = `<div class='${_OJ_FILMSTRIP_ARROW} oj-default oj-enabled ${locationMarker}' role='button' tabindex='-1'><span class='oj-filmstrip-arrow-icon ${locationMarker} oj-component-icon'></span></div>`;

      parentElem.append(str); // @HTMLUpdateOK
      const arrowElem = parentElem.children(_PERIOD + _OJ_FILMSTRIP_ARROW).eq(0);
      arrowElem.uniqueId();
      const arrowId = arrowElem.attr('id');
      if (label) {
        arrowElem.attr('aria-label', label);
      }
      if (tooltip) {
        arrowElem.attr('title', tooltip);
      }
      // Fix  - ACC: FIF TOUR PAGE DOESN'T DESCRIBE WHAT'S WITHIN THE FILMSTRIP
      const pageInfoElem = this._pageInfoElem;
      const pageInfoId = pageInfoElem.attr('id');
      arrowElem.attr(_OJ_FILMSTRIP_LABELLEDBY, `${pageInfoId} ${arrowId}`); // @HTMLUpdateOK

      //  - filmstrip: next/previous oj-hover colors doesn't go away in touch device
      this._AddHoverable(arrowElem);
      this._AddActiveable(arrowElem);

      const options = this.options;
      const navArrowPlacement = options.arrowPlacement;
      if (navArrowPlacement === _ADJACENT) {
        if (this._navArrowsShownOnHover()) {
          arrowElem.addClass(_OJ_FILMSTRIP_ARROW_TRANSITION);
        }
      }

      return arrowElem;
    },

    /**
     * Get the containers around the original child items.
     * @returns {jQuery} The containers around the original child items.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _getItemContainers: function () {
      const pagesWrapper = this._pagesWrapper;
      return pagesWrapper
        .find(_PERIOD + _OJ_FILMSTRIP_ITEM_CONTAINER)
        .filter(this._filterNestedFilmStripsFunc);
    },

    /**
     * Get the original child items.
     * @returns {jQuery} The original child items.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _getItems: function () {
      const pagesWrapper = this._pagesWrapper;
      return pagesWrapper
        .find(_PERIOD + _OJ_FILMSTRIP_ITEM)
        .filter(this._filterNestedFilmStripsFunc);
    },

    /**
     * Get the logical page containers.
     * @returns {jQuery} The logical page containers.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _getPages: function () {
      const pagesWrapper = this._pagesWrapper;
      return pagesWrapper.children(_PERIOD + _OJ_FILMSTRIP_PAGE);
    },

    /**
     * Clear the calculated sizes set on the internal layout DOM structure.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _clearCalculatedSizes: function () {
      const pagesWrapper = this._pagesWrapper;
      const pages = this._getPages();
      pages.css(_FLEX_BASIS, _EMPTY_STRING).css(_WEBKIT_FLEX_BASIS, _EMPTY_STRING);
      const items = this._getItemContainers();
      items.css(_FLEX_BASIS, _EMPTY_STRING).css(_WEBKIT_FLEX_BASIS, _EMPTY_STRING);
      pagesWrapper.css(this._getCssSizeAttr(), _EMPTY_STRING);
    },

    /**
     * Calculate sizes and set them on the internal layout DOM structure.
     * @param {boolean} bNotifyAttach True to notify children when they're
     *        attached to/detached from the DOM, false to not notify them (when
     *        the notification will happen outside of this method).
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _adjustSizes: function (bNotifyAttach) {
      // clear previously calculated values before recalculating
      this._clearCalculatedSizes();

      const options = this.options;
      const bHorizontal = this._isHorizontal();
      let itemsPerPage = options.maxItemsPerPage;
      const bCalcItemsPerPage = itemsPerPage < 1;
      const elem = this.element;

      const itemContainers = this._getItemContainers();
      // if we haven't saved the item size yet, do it now
      if (this._itemSize < 0) {
        const items = this._getItems();
        if (items.length) {
          // use the size of the item specified in the options
          const optionItemIndex = this._getItemIndex(options.currentItem);

          let optionItemContainer;
          if (optionItemIndex > -1 && itemContainers[optionItemIndex]) {
            optionItemContainer = $(itemContainers[optionItemIndex]);
          } else {
            // if size can't be determined from the selected try to use the first one
            optionItemContainer = $(itemContainers[0]);
          }

          // unhide the item, in case the app has initially hidden it
          const optionItem = optionItemContainer.children(_PERIOD + _OJ_FILMSTRIP_ITEM);
          optionItem.css(_DISPLAY, _EMPTY_STRING);
          // notify the item that it's being shown
          subtreeShown(optionItem[0]);

          this._itemSize = bHorizontal ? optionItemContainer.width() : optionItemContainer.height();
        }
      }

      // get component size after itemSize, in case item needed to be unhidden
      let componentSize = bHorizontal ? elem.width() : elem.height();
      if (options.arrowVisibility !== _HIDDEN && options.arrowPlacement === _ADJACENT) {
        const arrowContainers = elem.children(_PERIOD + _OJ_FILMSTRIP_ARROW_CONTAINER);
        const firstArrowContainer = arrowContainers.eq(0);
        const arrowSize = bHorizontal ? firstArrowContainer.width() : firstArrowContainer.height();
        componentSize -= 2 * arrowSize;
      }
      this._componentSize = componentSize;

      // if there are a fixed number of items per page, but the number specified
      // won't fit, then reduce the number to what will fit
      if (!bCalcItemsPerPage) {
        // use min of 1 to prevent browser crash
        const calcFitCount = Math.max(Math.floor(componentSize / this._itemSize), 1);
        if (calcFitCount < itemsPerPage) {
          itemsPerPage = calcFitCount;
        }
      }

      // if calculating fitCount, use min of 1 to prevent browser crash
      const fitCount = bCalcItemsPerPage
        ? Math.max(Math.floor(componentSize / this._itemSize), 1)
        : itemsPerPage;
      const fitItemSize = componentSize / fitCount;
      itemContainers.css(_FLEX_BASIS, fitItemSize + _PX).css(_WEBKIT_FLEX_BASIS, fitItemSize + _PX);

      const newPageCount = Math.ceil(itemContainers.length / fitCount);
      // wrap items in logical page containers
      let pages = this._getPages();
      let bCreatePages = false;
      // need to create logical pages if page layout changed, or if we haven't
      // yet created logical pages
      const pagingModel = this._pagingModel;
      if (
        pagingModel.getPageCount() !== newPageCount ||
        this._itemsPerPage !== fitCount ||
        !pages ||
        pages.length < 1
      ) {
        bCreatePages = true;
        let i;
        if (bNotifyAttach) {
          // notify the original children of the filmStrip that they were detached from
          // the DOM BEFORE actually detaching so that components can save state
          for (i = 0; i < itemContainers.length; i++) {
            subtreeDetached(itemContainers[i]);
          }
        }

        if (pages && pages.length > 0) {
          // remove old logical page containers
          itemContainers.unwrap();
        }

        // create new logical page containers
        for (i = 0; i < itemContainers.length; i += fitCount) {
          const itemsOnPage = itemContainers.slice(i, i + fitCount);
          // initially hide the page container
          // prettier-ignore
          itemsOnPage
            .wrapAll( // @HTMLUpdateOK
              `<div class="${_OJ_FILMSTRIP_CONTAINER} ${_OJ_FILMSTRIP_PAGE}" ${_ARIA_HIDDEN}="true"></div>`
            )
            .parent()
            .css('display', _NONE);
        }

        if (bNotifyAttach) {
          // notify the original children of the filmStrip that they were attached
          // again after wrapping them
          for (i = 0; i < itemContainers.length; i++) {
            subtreeAttached(itemContainers[i]);
          }
        }
      }
      // always need to update size of each page, even if page count doesn't change
      pages = this._getPages();
      pages.css(_FLEX_BASIS, componentSize + _PX).css(_WEBKIT_FLEX_BASIS, componentSize + _PX);

      // always need to update the pages container size
      const pagesWrapper = this._pagesWrapper;
      const contentWrapper = this._contentWrapper;
      // only show a single page at a time
      pagesWrapper.css(this._getCssSizeAttr(), componentSize);
      if (contentWrapper) {
        contentWrapper.css(this._getCssSizeAttr(), componentSize);
      }

      if (itemContainers.length) {
        let newPageIndex = 0;
        if (options.currentItem) {
          newPageIndex = this._findTargetPage(options.currentItem, fitCount);
        }

        if (
          newPageIndex > -1 &&
          (pagingModel.getPageCount() !== newPageCount ||
            this._itemsPerPage !== fitCount ||
            pagingModel.getPage() !== newPageIndex)
        ) {
          pagingModel.setPage(newPageIndex, { pageSize: fitCount });
        } else if (bCreatePages) {
          // if the page layout didn't change, but we recreated the logical page
          // containers, then simply go to the current logical page to make sure that
          // pages and items are hidden or shown as appropriate
          const currPage = pagingModel.getPage();
          this._handlePage({ previousPage: currPage, page: currPage });
        }
      }
    },

    /**
     * Handle a 'page' event from the PagingModel.
     * @param {Object} event Event object.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handlePage: function (event) {
      const pageIndex = event.page;
      const loopDirection = event.loopDirection;
      const prevPageIndex = event.previousPage;
      const pagesWrapper = this._pagesWrapper;
      const pages = this._getPages();
      const pagingModel = this._pagingModel;
      const pageSize = pagingModel.getPageSize();
      const pageCount = pagingModel.getPageCount();
      const bImmediate =
        prevPageIndex < 0 || prevPageIndex === pageIndex || this._itemsPerPage !== pageSize;
      const bLooping = this._isLoopingPage();
      // update _itemsPerPage AFTER using it to initialize bImmediate above
      this._itemsPerPage = pageSize;

      // get the old page, if there is one
      let oldPage = null;
      if (!bImmediate) {
        oldPage = $(pages[prevPageIndex]);
      }

      const cssAttr = this._getCssPositionAttr();

      // unhide the new page
      const newPage = $(pages[pageIndex]);
      const bPageHidden = newPage.is(_HIDDEN_SELECTOR);
      if (bPageHidden) {
        this._unhidePage(newPage);
      }
      // defer the scroll if we're dragging so that we can animate it
      let bDeferScroll = this._bDragInit;
      let bNext;
      if (prevPageIndex > -1 && !bImmediate) {
        bNext = pageIndex > prevPageIndex;
        // if looping is enabled, continue in the direction of the navigation
        if (bLooping && loopDirection) {
          bNext = loopDirection === _LOOPING_DIRECTION_NEXT;
        }

        // check if navigating from first page to last page or from last page to first page
        const bFirstToLast = bLooping && !bNext && pageCount > 1 && prevPageIndex === 0;
        const bLastToFirst = bLooping && bNext && pageCount > 1 && prevPageIndex === pageCount - 1;

        bDeferScroll = true;
        // set size of pages wrapper to show two pages at a time because both of
        // them will temporarily be visible
        pagesWrapper.css(this._getCssSizeAttr(), 2 * this._componentSize);
        // if going to the previous page, initially scroll to show the current page
        // because the previous page will be at the current scroll position
        if (!bNext) {
          // only adjust scroll if the page was hidden (in the case of dragging,
          // the page will already be unhidden and scrolled correctly)
          if (bPageHidden) {
            pagesWrapper.css(cssAttr, -this._componentSize + _PX);
          }
        }

        // set initial transition states on the pages
        if (bNext) {
          if (oldPage) {
            oldPage.addClass(_OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_FROM);
          }
          newPage.addClass(_OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_FROM);
          if (bLastToFirst) {
            newPage.addClass(_OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_LASTPAGE);
          }
        } else {
          if (oldPage) {
            oldPage.addClass(_OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_FROM);
          }
          newPage.addClass(_OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_FROM);
          if (bFirstToLast) {
            newPage.addClass(_OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_FIRSTPAGE);
          }
        }
      }

      // FIX : add busy state before animating a scroll
      this._busyStateResolveFunc = this._addBusyState('scrolling');

      if (bDeferScroll) {
        const self = this;
        const bDragInit = this._bDragInit;
        // if bouncing back because a drag scroll didn't cross the threshold,
        // add the transition class before the timeout because the transforms
        // are removed and reapplied in the timeout
        if (bDragInit && prevPageIndex < 0) {
          const visiblePages = pages.filter(_VISIBLE_SELECTOR);
          visiblePages.addClass(_OJ_FILMSTRIP_TRANSITION);
        }
        // FIX : In Safari on Mac OS X, sometimes when changing pages
        // the new page appears hidden until after the transition.  It seems to be
        // a timing issue where the new page has been made visible in the DOM, but
        // Safari hasn't processed that change before the transition starts.
        // Changing the timeout delay from 0 to 25 seems to help.
        setTimeout(function () {
          self._finishHandlePage(pageIndex, prevPageIndex, bNext, bImmediate, bDragInit);
        }, 25);
      } else {
        this._finishHandlePage(pageIndex, prevPageIndex, bNext, bImmediate);
      }
    },

    /**
     * Finish handling a 'page' event from the PagingModel.
     * @param {number} pageIndex 0-based page index to go to.
     * @param {number} prevPageIndex 0-based old page index.
     * @param {boolean} bNext True if the navigation direction is next.
     * @param {boolean} bImmediate True to change pages immediately with no
     *        transition, false to transition them over time.
     * @param {boolean} bDragInit True if we're currently drag scrolling, false
     *        otherwise.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _finishHandlePage: function (pageIndex, prevPageIndex, bNext, bImmediate, bDragInit) {
      const pagesWrapper = this._pagesWrapper;
      if (!bImmediate) {
        this._bPageChangeTransition = true;
        pagesWrapper.on(
          `transitionend${this.eventNamespace} webkitTransitionEnd${this.eventNamespace}`,
          this._handleTransitionEndFunc
        );
      }

      if (bImmediate) {
        this._handleTransitionEnd();
      } else {
        const pages = this._getPages();
        // if we're currently drag scrolling, remove the transforms that we used
        // to scroll while we were under the drag threshold
        if (bDragInit) {
          _removeTransform(pages);
        }

        // changing pages
        if (prevPageIndex > -1) {
          // remove initial transition states and set destination states, and
          // transition between them
          const oldPage = $(pages[prevPageIndex]);
          const newPage = $(pages[pageIndex]);
          oldPage.addClass(_OJ_FILMSTRIP_TRANSITION);
          newPage.addClass(_OJ_FILMSTRIP_TRANSITION);
          if (bNext) {
            oldPage.removeClass(_OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_FROM);
            newPage.removeClass(_OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_FROM);
            oldPage.addClass(_OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_TO);
            newPage.addClass(_OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_TO);
          } else {
            oldPage.removeClass(_OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_FROM);
            newPage.removeClass(_OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_FROM);
            oldPage.addClass(_OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_TO);
            newPage.addClass(_OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_TO);
          }
        } else if (bDragInit) {
          // bouncing back to current page after drag scrolling under the threshold
          const visiblePages = pages.filter(_VISIBLE_SELECTOR);
          _applyTransform(visiblePages, 'translate3d(0, 0, 0)');
        }
      }
    },

    /**
     * Handle the end of a page change transition.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handleTransitionEnd: function () {
      this._bPageChangeTransition = false;
      const pagesWrapper = this._pagesWrapper;
      const cssAttr = this._getCssPositionAttr();
      pagesWrapper
        .off(this.eventNamespace)
        .css(this._getCssSizeAttr(), this._componentSize)
        .css(cssAttr, '0px');

      // if the filmStrip contains the focus element, we may need to focus a new
      // element if the old one is on a page that's being hidden
      let focusElem = null;
      if (
        FocusUtils.containsFocus(pagesWrapper[0]) ||
        (this._nextButton && FocusUtils.containsFocus(this._nextButton[0])) ||
        (this._prevButton && FocusUtils.containsFocus(this._prevButton[0]))
      ) {
        focusElem = document.activeElement;
      }

      const pagingModel = this._pagingModel;
      const pageIndex = pagingModel.getPage();

      // hide all pages except for current one
      const pages = this._getPages();
      for (let i = 0; i < pages.length; i++) {
        if (i !== pageIndex) {
          this._hidePage($(pages[i]));
        }
      }
      // remove transition classes
      pages.removeClass(
        _OJ_FILMSTRIP_TRANSITION +
          ' ' +
          _OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_TO +
          ' ' +
          _OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_TO +
          ' ' +
          _OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_TO +
          ' ' +
          _OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_TO +
          ' ' +
          _OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_FIRSTPAGE +
          ' ' +
          _OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_LASTPAGE
      );
      // remove transforms left over from drag scrolling
      _removeTransform(pages);

      // update display of the navigation arrows
      this._updateNavigationArrowsDisplay();

      // if the old focus element is being hidden, transfer focus to something visible
      if (focusElem && $(focusElem).is(_HIDDEN_SELECTOR)) {
        const elem = this.element;
        // focus an element in the new logical page if possible, otherwise focus
        // the filmStrip itself
        const firstTabStop = FocusUtils.getFirstTabStop(pages[pageIndex]);
        if (firstTabStop) {
          FocusUtils.focusElement(firstTabStop);
        } else {
          FocusUtils.focusElement(elem[0]);
        }
      }

      // update currentItem property if it's not on the current page
      const options = this.options;
      const currItemPage = this._findPage(options.currentItem);
      if (currItemPage !== pageIndex) {
        const newFirstItem = this._getFirstItemOnPage(pageIndex);
        // FIX : only update currentItem property if the filmstrip is not empty
        if (newFirstItem) {
          this.option(_CURRENT_ITEM, newFirstItem, { _context: { writeback: true } });
        }
      }

      // FIX : if we've deferred handling a resize during a page change, handle it now
      if (this._deferredHandleResize) {
        this._deferredHandleResize = false;

        this._handleResize();
      }

      // Fix  - ACC: FIF TOUR PAGE DOESN'T DESCRIBE WHAT'S WITHIN THE FILMSTRIP
      this._updatePageInfoElem();
      // FIX : resolve busy state after animating a scroll
      this._resolveBusyState();
    },

    /**
     * Get the 0-based index of the specified item.
     * @param {Object} item The item object.
     * @returns {number} The 0-based index of the specified item, or -1 if not found.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _getItemIndex: function (item) {
      let itemIndex = -1;
      if (item) {
        const items = this._getItems();
        // If the item contains both id and index, item id takes precedence.
        if (item.id && isValidIdentifier(item.id)) {
          for (let i = 0; i < items.length; i++) {
            const itemElem = items[i];
            const itemId = itemElem.id;
            if (itemId && itemId.length > 0 && itemId === item.id) {
              itemIndex = i;
              break;
            }
          }
        } else if (item.index != null && item.index >= 0 && item.index < items.length) {
          itemIndex = item.index;
        }
      }
      return itemIndex;
    },

    /**
     * Convert any 0-based numeric item index or string item id to an item object of (id, index).
     * @param {(string|number|Object)} item String item id or numeric item index or an item object of (id, index).
     * @returns {Object} The item object of (id, index).
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _convertCurrentItemToObj: function (item) {
      let itemObj = null;
      if (typeof item === 'object') {
        // copy it to prevent any pollution from other possible attributes
        itemObj = {
          index: item.index,
          id: item.id
        };
      } else if (typeof item === 'number') {
        itemObj = { index: item };
      } else if (typeof item === 'string') {
        itemObj = { id: item };
      }
      return itemObj;
    },

    /**
     * Populates the item object with valid id and index
     * @param {Object} item The item object to populate.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _populateCurrentItemObj: function (item) {
      if (item && this._pagingModel.getPage() >= 0) {
        const index = this._getItemIndex(item);
        // eslint-disable-next-line no-param-reassign
        item.index = index;
        if (item.id == null && index > -1) {
          const items = this._getItems();
          // eslint-disable-next-line no-param-reassign
          item.id = items[index].id;
        }
      }
    },

    /**
     * Find the logical page containing the specified item.
     * @param {Object} item The item object.
     * @param {?number} itemsPerPage The number of items on each logical page.
     * @returns {number} The 0-based index of the logical page containing the item,
     *          or -1 if not found.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _findPage: function (item, itemsPerPage) {
      const itemIndex = this._getItemIndex(item);
      let pageIndex = -1;
      if (itemIndex > -1) {
        if (itemsPerPage === undefined) {
          // eslint-disable-next-line no-param-reassign
          itemsPerPage = this._itemsPerPage;
        }
        pageIndex = Math.floor(itemIndex / itemsPerPage);
      }
      return pageIndex;
    },

    /**
     * Find the logical page containing the specified item.
     * If the item no longer exists, try to find the closest page.
     * @param {Object} item The item object.
     * @param {?number} itemsPerPage The number of items on each logical page.
     * @returns {number} The 0-based index of the logical page containing the item,
     *          or -1 if not found.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _findTargetPage: function (item, itemsPerPage) {
      let pageIndex = this._findPage(item, itemsPerPage);
      if (pageIndex < 0) {
        const items = this._getItems();
        if (items.length > 0 && item && item.index != null && item.index >= items.length) {
          if (itemsPerPage === undefined) {
            // eslint-disable-next-line no-param-reassign
            itemsPerPage = this._itemsPerPage;
          }
          pageIndex = Math.floor((items.length - 1) / itemsPerPage);
        }
      }
      return pageIndex;
    },

    /**
     * Get the first item on the specified logical page.
     * @param {number} pageIndex 0-based index of the logical page.
     * @param {?number} pageCount Number of logical pages.
     * @param {?number} itemsPerPage Number of items on each logical page.
     * @returns {Object} The first item object.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _getFirstItemOnPage: function (pageIndex, pageCount, itemsPerPage) {
      const pagingModel = this._pagingModel;
      if (pageCount === undefined) {
        // eslint-disable-next-line no-param-reassign
        pageCount = pagingModel.getPageCount();
      }
      if (pageIndex >= 0 && pageIndex < pageCount) {
        const items = this._getItems();
        if (itemsPerPage === undefined) {
          // eslint-disable-next-line no-param-reassign
          itemsPerPage = this._itemsPerPage;
        }
        const itemIndex = pageIndex * itemsPerPage;
        if (itemIndex < items.length) {
          const firstItemOnPage = items[itemIndex];
          const firstId = firstItemOnPage.id;
          return { id: firstId, index: itemIndex };
        }
      }
      return null;
    },

    /**
     * Hide the logical page.
     * @param {jQuery} page Page to hide.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _hidePage: function (page) {
      // notify the page that it's being hidden BEFORE actually hiding it so that
      // components can save state
      subtreeHidden(page[0]);

      page.css(_DISPLAY, _NONE).attr(_ARIA_HIDDEN, 'true'); // @HTMLUpdateOK

      // hide the items explicitly; unhiding will unhide them explicitly
      const items = page
        .find(_PERIOD + _OJ_FILMSTRIP_ITEM)
        .filter(this._filterNestedFilmStripsFunc);
      items.css(_DISPLAY, _NONE);
    },

    /**
     * Unhide the logical page.
     * @param {jQuery} page Page to unhide.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _unhidePage: function (page) {
      page.css(_DISPLAY, _EMPTY_STRING).removeAttr(_ARIA_HIDDEN);

      // unhide the items explicitly because the app may have initially hidden them
      const items = page
        .find(_PERIOD + _OJ_FILMSTRIP_ITEM)
        .filter(this._filterNestedFilmStripsFunc);
      items.css(_DISPLAY, _EMPTY_STRING);

      // notify the page that it was shown
      subtreeShown(page[0]);
    },

    /**
     * Add key listeners on the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _addKeyListeners: function () {
      const elem = this.element;
      elem.on(`keydown${this.keyEventNamespace}`, this._handleKeyDownFunc);
    },

    /**
     * Remove key listeners from the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _removeKeyListeners: function () {
      const elem = this.element;
      elem.off(this.keyEventNamespace);
    },

    /**
     * Add mouse listeners on the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _addMouseListeners: function () {
      const elem = this.element;
      elem
        .on(`mousedown${this.mouseEventNamespace}`, this._handleMouseDownFunc)
        .on(`mousemove${this.mouseEventNamespace}`, this._handleMouseMoveFunc)
        .on(`mouseup${this.mouseEventNamespace}`, this._handleMouseUpFunc);
    },

    /**
     * Remove mouse listeners from the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _removeMouseListeners: function () {
      const elem = this.element;
      elem.off(this.mouseEventNamespace);
    },

    /**
     * Add touch listeners on the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _addTouchListeners: function () {
      const elem = this.element;
      if (this._IsCustomElement()) {
        const createDelegatedListener = function (listener) {
          return function (event) {
            listener($.Event(event));
          };
        };
        this._delegatedHandleTouchStartFunc = createDelegatedListener(this._handleTouchStartFunc);
        this._delegatedHandleTouchMoveFunc = createDelegatedListener(this._handleTouchMoveFunc);
        elem[0].addEventListener('touchstart', this._delegatedHandleTouchStartFunc, {
          passive: true
        });
        elem[0].addEventListener('touchmove', this._delegatedHandleTouchMoveFunc, {
          passive: false
        });
        elem
          .on(`touchend${this.touchEventNamespace}`, this._handleTouchEndFunc)
          .on(`touchcancel${this.touchEventNamespace}`, this._handleTouchEndFunc);
      } else {
        elem
          .on(`touchstart${this.touchEventNamespace}`, this._handleTouchStartFunc)
          .on(`touchmove${this.touchEventNamespace}`, this._handleTouchMoveFunc)
          .on(`touchend${this.touchEventNamespace}`, this._handleTouchEndFunc)
          .on(`touchcancel${this.touchEventNamespace}`, this._handleTouchEndFunc);
      }
    },

    /**
     * Remove touch listeners from the filmStrip.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _removeTouchListeners: function () {
      const elem = this.element;
      elem.off(this.touchEventNamespace);
    },

    /**
     * Handle a keydown event.
     * @param {Event} event <code class="prettyprint">jQuery</code> event object.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handleKeyDown: function (event) {
      // ignore the event unless filmstrip is the target
      if (event.target !== this.element[0]) {
        return;
      }
      const pagingModel = this._pagingModel;
      const pageIndex = pagingModel.getPage();
      const pageCount = pagingModel.getPageCount();
      let newPageIndex;
      switch (event.keyCode) {
        case $.ui.keyCode.RIGHT:
          if (this._bRTL) {
            newPageIndex = pageIndex - 1;
          } else {
            newPageIndex = pageIndex + 1;
          }
          break;
        case $.ui.keyCode.LEFT:
          if (this._bRTL) {
            newPageIndex = pageIndex + 1;
          } else {
            newPageIndex = pageIndex - 1;
          }
          break;
        case $.ui.keyCode.DOWN:
          newPageIndex = pageIndex + 1;
          break;
        case $.ui.keyCode.UP:
          newPageIndex = pageIndex - 1;
          break;
        case $.ui.keyCode.HOME:
          newPageIndex = 0;
          break;
        case $.ui.keyCode.END:
          newPageIndex = pageCount - 1;
          break;
        default:
          return;
      }

      if (newPageIndex > -1 && newPageIndex < pageCount) {
        pagingModel.setPage(newPageIndex);
      } else if (this._isLoopingPage() && pageCount > 1) {
        const optionsObj = {};
        // navigate from last page to first page
        if (newPageIndex === pageCount) {
          newPageIndex = 0;
          optionsObj.loopDirection = _LOOPING_DIRECTION_NEXT;
        }
        // navigate from first page to last page
        if (newPageIndex === -1) {
          newPageIndex = pageCount - 1;
          optionsObj.loopDirection = _LOOPING_DIRECTION_PREV;
        }
        pagingModel.setPage(newPageIndex, optionsObj);
      }

      event.preventDefault();
    },

    /**
     * Handle a mousedown event.
     * @param {Event} event <code class="prettyprint">jQuery</code> event object.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handleMouseDown: function (event) {
      const originalEvent = event.originalEvent;
      this._dragScrollStart(originalEvent);
    },

    /**
     * Handle a mousemove event.
     * @param {Event} event <code class="prettyprint">jQuery</code> event object.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handleMouseMove: function (event) {
      const originalEvent = event.originalEvent;
      this._dragScrollMove(event, originalEvent);
    },

    /**
     * Handle a mouseup event.
     * @param {Event} event <code class="prettyprint">jQuery</code> event object.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handleMouseUp: function () {
      this._dragScrollEnd();
    },

    /**
     * Handle a touchstart event.
     * @param {Event} event <code class="prettyprint">jQuery</code> event object.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handleTouchStart: function (event) {
      const originalEvent = event.originalEvent;
      const eventTouches = originalEvent.touches;
      if (eventTouches.length === 1) {
        const firstTouch = eventTouches[0];
        this._dragScrollStart(firstTouch);
      }
    },

    /**
     * Handle a touchmove event.
     * @param {Event} event <code class="prettyprint">jQuery</code> event object.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handleTouchMove: function (event) {
      const originalEvent = event.originalEvent;
      const eventTouches = originalEvent.touches;
      const firstTouch = eventTouches[0];
      this._dragScrollMove(event, firstTouch);

      // FIX : if the drag scroll was started, prevent the page
      // from scrolling also
      // FIX : do this for touchMove events instead of touchStart so
      // that it doesn't prevent clicks/taps from being detected on nav arrows and
      // item content
      if (this._bTouch || this._scrolledForThisTouch) {
        event.preventDefault();
      }
    },

    /**
     * Handle a touchend event.
     * @param {Event} event <code class="prettyprint">jQuery</code> event object.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _handleTouchEnd: function () {
      this._dragScrollEnd();
    },

    /**
     * Start a drag scroll.
     * @param {Event} coordsObj Object that has pageX and pageY properties.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _dragScrollStart: function (coordsObj) {
      const pagingModel = this._pagingModel;
      if (pagingModel.getPageCount() > 1 && !this._bPageChangeTransition) {
        this._bTouch = true;
        this._bDragInit = false;
        this._bFirstToLast = false;
        this._bLastToFirst = false;

        const bHorizontal = this._isHorizontal();
        this._touchStartCoord = bHorizontal ? coordsObj.pageX : coordsObj.pageY;
        this._touchStartCoord2 = bHorizontal ? coordsObj.pageY : coordsObj.pageX;
      }
    },

    /**
     * Initialize a drag scroll.
     * Called after a drag scroll has started if the drag has passed an initial
     * threshold.
     * @param {Object} coordsObj Object that has pageX and pageY properties.
     * @param {boolean} bFirstToLast true if looping from first page to last page.
     * @param {boolean} bLastToFirst true if looping from last page to first page.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _initDragScroll: function (coordsObj, bFirstToLast, bLastToFirst) {
      // save off some initial information at the start of a swipe
      const bHorizontal = this._isHorizontal();
      this._touchStartCoord = bHorizontal ? coordsObj.pageX : coordsObj.pageY;
      this._touchStartCoord2 = bHorizontal ? coordsObj.pageY : coordsObj.pageX;

      const cssAttr = this._getCssPositionAttr();
      const pagesWrapper = this._pagesWrapper;
      const pagingModel = this._pagingModel;
      const pageIndex = pagingModel.getPage();
      const pageCount = pagingModel.getPageCount();

      // unhide adjacent pages (unhide both because we don't know which way user
      // will scroll)
      const pages = this._getPages();
      let pageCountToShow = 1;

      if (bFirstToLast || bLastToFirst) {
        if (bFirstToLast) {
          // unhide last page
          this._unhidePage($(pages[pageCount - 1]));

          // when unhiding previous page, need to adjust current scroll position
          // to continue showing current page
          pagesWrapper.css(cssAttr, -this._componentSize + _PX);

          // increment number of pages we need to show
          pageCountToShow += 1;

          // display last page as first page
          $(pages[pageCount - 1]).addClass(_OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_FIRSTPAGE);
        }
        if (bLastToFirst) {
          // unhide first page
          this._unhidePage($(pages[0]));

          // increment number of pages we need to show
          pageCountToShow += 1;

          // display first page as last page
          $(pages[0]).addClass(_OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_LASTPAGE);
        }
      } else {
        if (pageIndex > 0) {
          this._unhidePage($(pages[pageIndex - 1]));

          // when unhiding previous page, need to adjust current scroll position
          // to continue showing current page
          pagesWrapper.css(cssAttr, -this._componentSize + _PX);

          // increment number of pages we need to show
          pageCountToShow += 1;
        }
        if (pageIndex < pageCount - 1) {
          this._unhidePage($(pages[pageIndex + 1]));

          // increment number of pages we need to show
          pageCountToShow += 1;
        }
      }

      if (pageCountToShow > 1) {
        pagesWrapper.css(this._getCssSizeAttr(), pageCountToShow * this._componentSize);
      }

      this._touchStartScroll = parseInt(pagesWrapper.css(cssAttr), 10);
    },

    /**
     * Process a move during drag scrolling.
     * @param {Event} event <code class="prettyprint">jQuery</code> event object.
     * @param {Object} coordsObj Object that has pageX and pageY properties.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _dragScrollMove: function (event, coordsObj) {
      // do nothing if we haven't started the scroll
      if (!this._bTouch) {
        return;
      }

      const bHorizontal = this._isHorizontal();
      const touchCoord = bHorizontal ? coordsObj.pageX : coordsObj.pageY;
      const diff = touchCoord - this._touchStartCoord;

      //  - cannot scroll vertically in filmstrip component
      const touchCoord2 = bHorizontal ? coordsObj.pageY : coordsObj.pageX;
      const diff2 = touchCoord2 - this._touchStartCoord2;

      // in non-RTL, if swiping left or up, scroll next; otherwise scroll prev
      // in RTL, if swiping right or up, scroll next; otherwise scroll prev
      const bNext = bHorizontal && this._bRTL ? diff > 0 : diff < 0;
      // determine whether the filmStrip can be scrolled in the direction of the swipe
      const pagingModel = this._pagingModel;
      const pageIndex = pagingModel.getPage();
      const pageCount = pagingModel.getPageCount();
      const bLooping = this._isLoopingPage();

      const bFirstToLast = bLooping && !bNext && pageCount > 1 && pageIndex === 0;
      const bLastToFirst = bLooping && bNext && pageCount > 1 && pageIndex === pageCount - 1;

      if (!this._bDragInit) {
        //  - cannot scroll vertically in filmstrip component
        // If the direction of swipe doesn't align with orientation of filmstrip,
        // don't scroll again for this same swipe
        if (Math.abs(diff2) > Math.abs(diff)) {
          this._bTouch = false;

          // set a flag indicating we don't scroll for this touch event
          this._scrolledForThisTouch = false;
        }

        // only initialize the drag once we've passed the initial threshold
        if (Math.abs(diff) > _DRAG_SCROLL_INIT_THRESHOLD) {
          this._initDragScroll(coordsObj, bFirstToLast, bLastToFirst);
          this._bDragInit = true;
        }
        this._bFirstToLast = bFirstToLast;
        this._bLastToFirst = bLastToFirst;

        // return here even if we just initialized the drag so that we'll start
        // processing the drag move on the next event when we have different mouse
        // coords
        return;
      } else if (bFirstToLast !== this._bFirstToLast || bLastToFirst !== this._bLastToFirst) {
        // if the navigation has changed from first page to last page or from last page to first page,
        // reset the pages, because we need to reposition the pages again
        this._dragScrollResetPages();

        // re-initialize the drag scroll based on the current drag coordinates
        this._initDragScroll(coordsObj, bFirstToLast, bLastToFirst);
        this._bFirstToLast = bFirstToLast;
        this._bLastToFirst = bLastToFirst;
      }

      const canScrollInSwipeDirection =
        (bNext && pageIndex < pagingModel.getPageCount() - 1) || (!bNext && pageIndex > 0);
      // only need to do something if we can scroll in the swipe direction
      // if looping is enabled, continue in the direction of the swipe
      if (canScrollInSwipeDirection || bLooping) {
        // only scroll next/prev if the swipe is longer than the threshold; if it's
        // less, then just drag the items with the swipe
        const elem = this.element[0];
        const threshold = Math.min(
          _DRAG_SCROLL_THRESHOLD * (bHorizontal ? elem.offsetWidth : elem.offsetHeight),
          _DRAG_SCROLL_MAX_THRESHOLD
        );
        const cssAttr = this._getCssPositionAttr();
        const pagesWrapper = this._pagesWrapper;
        const pages = this._getPages();

        // if swiping beyond the threshold, scroll to the next/prev page
        if (Math.abs(diff) >= threshold) {
          let newPageIndex;
          let pageToHide;
          const optionsObj = {};

          if (bFirstToLast || bLastToFirst) {
            if (bFirstToLast) {
              newPageIndex = pageCount - 1;
              // Hide only if more than 2 pages are available
              pageToHide = pageCount > 2 ? 1 : -1;
            } else {
              newPageIndex = 0;
              // Hide only if more than 2 pages are available
              pageToHide = pageCount > 2 ? pageCount - 2 : -1;
            }
            optionsObj.loopDirection = bNext ? _LOOPING_DIRECTION_NEXT : _LOOPING_DIRECTION_PREV;
          } else {
            newPageIndex = bNext ? pageIndex + 1 : pageIndex - 1;
            pageToHide = bNext ? pageIndex - 1 : pageIndex + 1;
          }

          // hide the page that we're not scrolling to
          if (pageToHide > -1 && pageToHide < pagingModel.getPageCount()) {
            this._hidePage($(pages[pageToHide]));
          }

          // when hiding previous page, need to adjust current scroll position
          // to continue showing current page
          if (bNext && pageToHide > -1 && !bLastToFirst) {
            const currScroll = parseInt(pagesWrapper.css(cssAttr), 10);
            pagesWrapper.css(cssAttr, currScroll + this._componentSize + _PX);
          }

          // update size to show two pages instead of three
          pagesWrapper.css(this._getCssSizeAttr(), 2 * this._componentSize);

          // don't scroll again for this same swipe
          this._bTouch = false;

          pagingModel.setPage(newPageIndex, optionsObj);
        } else {
          // if swiping under the threshold, just move the conveyor with the swipe
          const scrollVal = diff;
          const transform = bHorizontal
            ? `translate3d(${scrollVal}px, 0, 0)`
            : `translate3d(0, ${scrollVal}px, 0)`;
          _applyTransform(pages.filter(_VISIBLE_SELECTOR), transform);
        }

        // set a flag indicating we've scrolled for this touch event
        this._scrolledForThisTouch = true;
      }

      // if we've scrolled for this touch event, consume the event
      // so that the page doesn't also scroll
      if (this._scrolledForThisTouch) {
        event.preventDefault();
        event.stopPropagation();
      }
    },

    /**
     * Process the end of a drag scroll.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _dragScrollEnd: function () {
      // if a full page swipe hasn't happened, scroll back to the original position
      if (this._bTouch && this._bDragInit) {
        const pagingModel = this._pagingModel;
        const pageIndex = pagingModel.getPage();
        this._handlePage({ previousPage: pageIndex, page: pageIndex });
      }
      this._bTouch = false;
      this._bDragInit = false;
      this._bFirstToLast = false;
      this._bLastToFirst = false;

      // reset the flag indicating if we've scrolled for this touch event
      this._scrolledForThisTouch = false;
    },

    /**
     * Reset the pages during drag scrolling.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _dragScrollResetPages: function () {
      const pagesWrapper = this._pagesWrapper;
      const cssAttr = this._getCssPositionAttr();
      const pagingModel = this._pagingModel;
      const pageIndex = pagingModel.getPage();
      const pageCount = pagingModel.getPageCount();
      // hide all pages except for current one
      const pages = this._getPages();
      for (let i = 0; i < pages.length; i++) {
        if (i !== pageIndex) {
          this._hidePage($(pages[i]));
        }
      }
      pagesWrapper.css(cssAttr, '0px');
      $(pages[0]).removeClass(_OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_LASTPAGE);
      $(pages[pageCount - 1]).removeClass(_OJ_FILMSTRIP_TRANSITION_DISPLAY_AS_FIRSTPAGE);
    },

    /**
     * Add a busy state to the busy context.
     *
     * @param {string} description Additional information about busy state.
     * @returns {Function} Resolve function called by the registrant when the busy state completes.
     *          The resultant function will throw an error if the busy state is no longer registered.
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _addBusyState: function (description) {
      const element = this.element;
      const context = Context.getContext(element[0]);
      const busyContext = context.getBusyContext();

      const id = element.attr('id');
      const desc = `FilmStrip (id='${id}'): ${description}`;

      const busyStateOptions = { description: desc };
      return busyContext.addBusyState(busyStateOptions);
    },

    /**
     * Resolve an outstanding busy state.
     * @return {void}
     * @memberof oj.ojFilmStrip
     * @instance
     * @private
     */
    _resolveBusyState: function () {
      if (this._busyStateResolveFunc) {
        this._busyStateResolveFunc();
        this._busyStateResolveFunc = null;
      }
    },

    // @inheritdoc
    getNodeBySubId: function (locator) {
      if (locator == null) {
        return this.element ? this.element[0] : null;
      }

      const subId = locator.subId;
      if (subId === _OJ_FILMSTRIP_START_ARROW) {
        return this.widget()
          .find(_PERIOD + _OJ_FILMSTRIP_ARROW + _PERIOD + _OJ_START)
          .filter(this._filterNestedFilmStripsFunc)[0];
      }
      if (subId === _OJ_FILMSTRIP_END_ARROW) {
        return this.widget()
          .find(_PERIOD + _OJ_FILMSTRIP_ARROW + _PERIOD + _OJ_END)
          .filter(this._filterNestedFilmStripsFunc)[0];
      }
      if (subId === _OJ_FILMSTRIP_TOP_ARROW) {
        return this.widget()
          .find(_PERIOD + _OJ_FILMSTRIP_ARROW + _PERIOD + _OJ_TOP)
          .filter(this._filterNestedFilmStripsFunc)[0];
      }
      if (subId === _OJ_FILMSTRIP_BOTTOM_ARROW) {
        return this.widget()
          .find(_PERIOD + _OJ_FILMSTRIP_ARROW + _PERIOD + _OJ_BOTTOM)
          .filter(this._filterNestedFilmStripsFunc)[0];
      }

      // Non-null locators have to be handled by the component subclasses
      return null;
    },

    // @inheritdoc
    getSubIdByNode: function (node) {
      const startArrow = this.getNodeBySubId({ subId: _OJ_FILMSTRIP_START_ARROW });
      const endArrow = this.getNodeBySubId({ subId: _OJ_FILMSTRIP_END_ARROW });
      const topArrow = this.getNodeBySubId({ subId: _OJ_FILMSTRIP_TOP_ARROW });
      const bottomArrow = this.getNodeBySubId({ subId: _OJ_FILMSTRIP_BOTTOM_ARROW });
      let currentNode = node;
      const elem = this.element[0];
      while (currentNode && currentNode !== elem) {
        if (currentNode === startArrow) {
          return { subId: _OJ_FILMSTRIP_START_ARROW };
        } else if (currentNode === endArrow) {
          return { subId: _OJ_FILMSTRIP_END_ARROW };
        } else if (currentNode === topArrow) {
          return { subId: _OJ_FILMSTRIP_TOP_ARROW };
        } else if (currentNode === bottomArrow) {
          return { subId: _OJ_FILMSTRIP_BOTTOM_ARROW };
        }

        currentNode = currentNode.parentElement;
      }
      return null;
    },

    // @inheritdoc
    _CompareOptionValues: function (option, value1, value2) {
      if (option === 'currentItem') {
        return oj.Object.compareValues(value1, value2);
      }
      return this._super(option, value1, value2);
    }
  }); // end of oj.__registerWidget
})(); // end of FilmStrip wrapper function

export { FilmStripPagingModel };
