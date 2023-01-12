/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'jquery', 'knockout', 'ojs/ojdatasource-common'], function (oj, jquery, ko, ojdatasourceCommon) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

  /**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */

  /* jslint browser: true,devel:true*/
  /**
   * Implementation of PagingModel backed by an array of data.  ArrayPagingDataSource
   * provides a window into the array in both standard JavaScript array and Knockout observable array formats.
   * It is designed to feed a Knockout-bound HTML control, for example.
   * @export
   * @class ArrayPagingDataSource
   * @since 1.0
   * @classdesc Implementation of PagingModel using array data
   * @extends DataSource
   * @implements PagingModel
   * @param {Array.<Object>} data
   * @constructor
   * @final
   * @ojdeprecated {since: '9.0.0', description: 'ArrayPagingDataSource has been deprecated, please use DataProviders instead.'}
   * @ojtsignore
   * @ojtsimport knockout
   */
  const ArrayPagingDataSource = function (data) {
    this.data = data;
    // Start at the beginning
    this.current = 0;
    this.Init();
    // Default the page size to 10
    this._setPageSize(10);
  };

  oj._registerLegacyNamespaceProp('ArrayPagingDataSource', ArrayPagingDataSource);
  // Subclass from oj.DataSource
  oj.Object.createSubclass(ArrayPagingDataSource, oj.DataSource, 'oj.ArrayPagingDataSource');

  /**
   * Initializes the instance.
   * @export
   * @memberof ArrayPagingDataSource
   * @ojtsignore
   */
  ArrayPagingDataSource.prototype.Init = function () {
    ArrayPagingDataSource.superclass.Init.call(this);
  };

  ArrayPagingDataSource.prototype._getSize = function () {
    if (!this._hasMore()) {
      // Return a size representing only what's left if we'd go over the bounds
      return this.totalSize() - this.current;
    }
    // Otherwise window size should match the page size
    return this.currentPageSize;
  };

  ArrayPagingDataSource.prototype._refreshDataWindow = function (options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    // Reinit the array
    this.dataWindow = new Array(this._getSize());
    // Copy from the source data
    for (var i = 0; i < this.dataWindow.length; i++) {
      this.dataWindow[i] = this.data[this.current + i];
    }

    // Update the observable array
    this._refreshObservableDataWindow();
    this._endIndex = this._startIndex + this.dataWindow.length - 1;

    if (!options.silent) {
      this.handleEvent('sync', { data: this.dataWindow, startIndex: this.current });
    }
  };

  ArrayPagingDataSource.prototype._refreshObservableDataWindow = function () {
    if (this.observableDataWindow !== undefined) {
      // Manage the observable window array
      this.observableDataWindow.removeAll();
      for (var i = 0; i < this.dataWindow.length; i++) {
        this.observableDataWindow.push(this.dataWindow[i]);
      }
    }
  };

  ArrayPagingDataSource.prototype.handleEvent = function (eventType, event) {
    return ArrayPagingDataSource.superclass.handleEvent.call(this, eventType, event);
  };

  /**
   * @export
   * Return the current set of data in the paging window
   *
   * @returns {Array.<Object>} the current set of data in the paging window
   * @memberof ArrayPagingDataSource
   */
  ArrayPagingDataSource.prototype.getWindow = function () {
    return this.dataWindow;
  };

  /**
   * @export
   * Get the observable array representing the current set of data in the paging window
   *
   * @returns {Object} an observable array representing the current data in the paging window
   * @ojsignature {target: "Type",
   *               value: "KnockoutObservableArray<object>",
   *               for: "returns"}
   * @memberof ArrayPagingDataSource
   */
  ArrayPagingDataSource.prototype.getWindowObservable = function () {
    if (this.observableDataWindow === undefined) {
      this.observableDataWindow = ko.observableArray();
      this._refreshObservableDataWindow();
    }
    return this.observableDataWindow;
  };

  /**
   * Get the current page
   * @return {number} The current page
   * @export
   * @expose
   * @memberof ArrayPagingDataSource
   * @instance
   */
  ArrayPagingDataSource.prototype.getPage = function () {
    return this._page;
  };

  /**
   * Set the current page
   * @param {number} value The current page
   * @param {Object=} options Options<p>
   * @param {number} [options.pageSize] The page size.<p>
   * @return {Promise.<null>} promise object triggering done when complete..
   * @export
   * @expose
   * @memberof ArrayPagingDataSource
   * @instance
   */
  ArrayPagingDataSource.prototype.setPage = function (value, options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    // eslint-disable-next-line no-param-reassign
    value = parseInt(value, 10);
    var handleEvent = ArrayPagingDataSource.superclass.handleEvent;
    try {
      handleEvent.call(this, oj.PagingModel.EventType.BEFOREPAGE, {
        page: value,
        previousPage: this._page
      });
    } catch (err) {
      return Promise.reject(err);
    }
    this.pageSize = options.pageSize != null ? options.pageSize : this.pageSize;
    // eslint-disable-next-line no-param-reassign
    options.startIndex = value * this.pageSize;
    var previousPage = this._page;
    this._page = value;
    this._startIndex = options.startIndex;
    var self = this;

    return new Promise(function (resolve, reject) {
      self._fetchInternal(options).then(
        function () {
          handleEvent.call(self, oj.PagingModel.EventType.PAGE, {
            page: self._page,
            previousPage: previousPage
          });
          resolve(null);
        },
        function (err) {
          // restore old page
          self._page = previousPage;
          self._startIndex = self._page * self.pageSize;
          reject(err);
        }
      );
    });
  };

  /**
   * Get the current page start index
   * @return {number} The current page start index
   * @export
   * @expose
   * @memberof ArrayPagingDataSource
   * @instance
   */
  ArrayPagingDataSource.prototype.getStartItemIndex = function () {
    return this._startIndex;
  };

  /**
   * Get the current page end index
   * @return {number} The current page end index
   * @export
   * @expose
   * @memberof ArrayPagingDataSource
   * @instance
   */
  ArrayPagingDataSource.prototype.getEndItemIndex = function () {
    return this._endIndex;
  };

  /**
   * Get the page count
   * @return {number} The total number of pages
   * @export
   * @expose
   * @memberof ArrayPagingDataSource
   * @instance
   */
  ArrayPagingDataSource.prototype.getPageCount = function () {
    var totalSize = this.totalSize();
    return totalSize === -1 ? -1 : Math.ceil(totalSize / this.pageSize);
  };

  /**
   * Fetch the row data.
   * @param {Object=} options Options to control fetch
   * @param {number} [options.startIndex] The index at which to start fetching records.
   * @param {boolean} [options.silent] If set, do not fire a sync event.
   * @return {Promise.<void>} Promise object resolves to void when done
   * @export
   * @expose
   * @memberof ArrayPagingDataSource
   * @instance
   */
  ArrayPagingDataSource.prototype.fetch = function (options) {
    var opts = options || {};

    if (opts.pageSize !== undefined && opts.startIndex !== undefined) {
      if (!this._hasMore()) {
        // At the limit
        return Promise.resolve();
      }
      this.currentPageSize = opts.startIndex + opts.pageSize;
    }
    this._refreshDataWindow(null);
    return Promise.resolve();
  };

  /**
   * Fetch the row data.
   * @private
   * @memberof ArrayPagingDataSource
   */
  ArrayPagingDataSource.prototype._fetchInternal = function (options) {
    // No fetching, but set up window according to options
    var opts = options || {};
    if (opts.startIndex !== undefined) {
      this.current = opts.startIndex;
    }
    if (opts.pageSize !== undefined) {
      this.pageSize = opts.pageSize;
      this.currentPageSize = opts.pageSize;
    }
    this._refreshDataWindow(options);

    return Promise.resolve({ data: this.dataWindow, startIndex: this.current });
  };

  /**
   * Return whether there is more data which can be fetched.
   * @private
   * @memberof ArrayPagingDataSource
   */
  ArrayPagingDataSource.prototype._hasMore = function () {
    return this.current + this.currentPageSize < this.totalSize();
  };

  /**
   * Set or change the number of models in a page
   *
   * @private
   * @memberof ArrayPagingDataSource
   */
  ArrayPagingDataSource.prototype._setPageSize = function (n) {
    this.pageSize = n;
    this.currentPageSize = n;
    this._refreshDataWindow(null);
  };

  /**
   * Return the total size of data available, including server side if not local.
   * @returns {number} total size of data
   * @expose
   * @memberof ArrayPagingDataSource
   * @instance
   */
  ArrayPagingDataSource.prototype.totalSize = function () {
    return this.data.length;
  };

  /**
   * Returns the confidence for the totalSize value.
   * @return {string} "actual" if the totalSize is the time of the fetch is an exact number
   *                  "estimate" if the totalSize is an estimate
   *                  "atLeast" if the totalSize is at least a certain number
   *                  "unknown" if the totalSize is unknown
   * @ojsignature {target:"Type",
   *               value: "'actual'|'estimate'|'atLeast'|'unknown'",
   *               for: "returns"}
   * @export
   * @expose
   * @memberof ArrayPagingDataSource
   * @instance
   */
  ArrayPagingDataSource.prototype.totalSizeConfidence = function () {
    return 'actual';
  };

  /**
   * Determines whether this data source supports a certain feature.
   * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
   * @return {string|null} the name of the feature.  For sort, the valid return values are: "full", "none".  Returns null if the
   *         feature is not recognized.
   * @export
   * @memberof ArrayPagingDataSource
   */
  // eslint-disable-next-line no-unused-vars
  ArrayPagingDataSource.prototype.getCapability = function (feature) {
    return null;
  };

  return ArrayPagingDataSource;

});
