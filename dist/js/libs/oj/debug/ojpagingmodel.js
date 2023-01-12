/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'jquery'], function (oj, jquery) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

  /* jslint browser: true,devel:true*/
  /**
   * The interface for PagingModel which should be implemented by all object instances
   * bound to the data parameter for oj.PagingControl. PagingModel implementations should
   * also support event subscription by extending EventSource or DataSource.
   * @export
   * @interface
   * @since 1.1

   */
  const PagingModel = function () {};
  oj._registerLegacyNamespaceProp('PagingModel', PagingModel);

  /**
   * Get the current page
   * @return {number} The current page
   * @export
   * @expose
   * @method
   * @name getPage
   * @memberof PagingModel
   * @instance
   */

  /**
   * Set the current page
   * @param {number} value The current page
   * @param {Object=} options Options<p>
   *                  pageSize: The page size.<p>
   * @return {Promise} promise object triggering done when complete..
   * @export
   * @expose
   * @method
   * @name setPage
   * @memberof PagingModel
   * @instance
   */

  /**
   * Get the current page start index
   * @return {number} The current page start index
   * @export
   * @expose
   * @method
   * @name getStartItemIndex
   * @memberof PagingModel
   * @instance
   */

  /**
   * Get the current page end index
   * @return {number} The current page end index
   * @export
   * @expose
   * @method
   * @name getEndItemIndex
   * @memberof PagingModel
   * @instance
   */

  /**
   * Get the page count
   * @return {number} The total number of pages
   * @export
   * @expose
   * @method
   * @name getPageCount
   * @memberof PagingModel
   * @instance
   */

  /**
   * @export
   * Return the total number of items. Returns -1 if unknown.
   * @returns {number} total number of items
   * @expose
   * @method
   * @name totalSize
   * @memberof PagingModel
   * @instance
   */

  /**
   * Returns the confidence for the totalSize value.
   * @return {string} "actual" if the totalSize is the time of the fetch is an exact number
   *                  "estimate" if the totalSize is an estimate
   *                  "atLeast" if the totalSize is at least a certain number
   *                  "unknown" if the totalSize is unknown
   * @export
   * @expose
   * @method
   * @name totalSizeConfidence
   * @memberof PagingModel
   * @instance
   */

  /**
   * @export
   * Event types
   * @memberof PagingModel
   * @enum {string}
   */
  PagingModel.EventType = {
    /** Triggered before the current page has changed. <p>
     * This event is vetoable.<p>
     * The event payload contains:<p>
     * <b>page</b> The new current page<br>
     * <b>previousPage</b> The old current page
     */
    BEFOREPAGE: 'beforePage',
    /** Triggered when the current page has changed<p>
     * The event payload contains:<p>
     * <b>page</b> The new current page<br>
     * <b>previousPage</b> The old current page
     */
    PAGE: 'page',
    /** Triggered when the page count has changed<p>
     * The event payload contains:<p>
     * <b>pageCount</b> The new page count<br>
     * <b>previousPageCount</b> The old page count
     */
    PAGECOUNT: 'pageCount'
  };

});
