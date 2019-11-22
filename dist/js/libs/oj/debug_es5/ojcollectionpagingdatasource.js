/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojknockout-model', 'ojs/ojdatasource-common', 'ojs/ojmodel'], function(oj, $, ko, KnockoutUtils)
{
  "use strict";


/* global Promise:false, ko:false, KnockoutUtils:false */

/* jslint browser: true,devel:true*/

/**
 * Implementation of PagingModel backed by an oj.Collection.  CollectionPagingDataSource
 * provides a window into the collection, presenting both a standard JavaScript array and Knockout observable array for consumption.
 * It is designed to feed a Knockout-bound HTML control, for example.
 * @export
 * @class oj.CollectionPagingDataSource
 * @classdesc Implementation of PagingModel using an oj.Collection
 * @extends oj.DataSource
 * @implements oj.PagingModel
 * @param {oj.Collection} collection the collection to use as source data for this paging control
 * @constructor
 * @final
 * @since 1.0
 * @ojtsignore
 * @ojtsimport knockout
 */
oj.CollectionPagingDataSource = function (collection) {
  this.collection = collection; // Start at the beginning

  this.current = 0;
  this.Init(); // Default the page size to 10

  this.dataWindow = [];
  this._noInit = true;

  try {
    this._setPageSize(10);
  } finally {
    this._noInit = false;
  }
}; // Subclass from oj.DataSource


oj.Object.createSubclass(oj.CollectionPagingDataSource, oj.DataSource, 'oj.CollectionPagingDataSource');
/**
 * Initializes the instance.
 * @export
 * @ojtsignore
 * @memberof oj.CollectionPagingDataSource
 */

oj.CollectionPagingDataSource.prototype.Init = function () {
  oj.CollectionPagingDataSource.superclass.Init.call(this);
};

oj.CollectionPagingDataSource.prototype._getSize = function () {
  if (!this._hasMore()) {
    // Return a size representing only what's left if we'd go over the bounds
    return this.totalSize() - this.current;
  } // Otherwise window size should match the page size


  return this.currentPageSize;
};

oj.CollectionPagingDataSource.prototype._refreshDataWindow = function () {
  // Reinit the array
  this.dataWindow = new Array(this._getSize());
  var self = this;
  return this.collection.IterativeAt(this.current, this.current + this.dataWindow.length).then(function (array) {
    // Copy from the source data
    for (var i = 0; i < array.length; i++) {
      self.dataWindow[i] = array[i];
    } // Update the observable array


    self._refreshObservableDataWindow();

    self._endIndex = self._startIndex + (self.dataWindow.length - 1);
  });
};

oj.CollectionPagingDataSource.prototype._refreshObservableDataWindow = function () {
  if (this.observableDataWindow !== undefined) {
    // Manage the observable window array
    this.observableDataWindow.removeAll();

    for (var i = 0; i < this.dataWindow.length; i++) {
      this.observableDataWindow.push(KnockoutUtils.map(this.dataWindow[i]));
    }
  }
};
/**
 * @export
 * Return the current set of data in the paging window
 *
 * @returns {Array.<Object>} the current set of data in the paging window
 * @memberof oj.CollectionPagingDataSource
 */


oj.CollectionPagingDataSource.prototype.getWindow = function () {
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
 * @memberof oj.CollectionPagingDataSource
 */


oj.CollectionPagingDataSource.prototype.getWindowObservable = function () {
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
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */


oj.CollectionPagingDataSource.prototype.getPage = function () {
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
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */


oj.CollectionPagingDataSource.prototype.setPage = function (value, options) {
  // eslint-disable-next-line no-param-reassign
  options = options || {}; // eslint-disable-next-line no-param-reassign

  value = parseInt(value, 10);

  try {
    oj.CollectionPagingDataSource.superclass.handleEvent.call(this, oj.PagingModel.EventType.BEFOREPAGE, {
      page: value,
      previousPage: this._page
    });
  } catch (err) {
    return Promise.reject(err);
  }

  this.pageSize = options.pageSize != null ? options.pageSize : this.pageSize; // eslint-disable-next-line no-param-reassign

  options.startIndex = value * this.pageSize;
  var previousPage = this._page;
  this._page = value;
  this._startIndex = options.startIndex;
  var self = this;
  return new Promise(function (resolve, reject) {
    self._fetchInternal(options).then(function () {
      oj.CollectionPagingDataSource.superclass.handleEvent.call(self, oj.PagingModel.EventType.PAGE, {
        page: self._page,
        previousPage: previousPage
      });
      resolve(null);
    }, function (err) {
      // restore old page
      self._page = previousPage;
      self._startIndex = self._page * self.pageSize;
      reject(err);
    });
  });
};
/**
 * Get the current page start index
 * @return {number} The current page start index
 * @export
 * @expose
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */


oj.CollectionPagingDataSource.prototype.getStartItemIndex = function () {
  return this._startIndex;
};
/**
 * Get the current page end index
 * @return {number} The current page end index
 * @export
 * @expose
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */


oj.CollectionPagingDataSource.prototype.getEndItemIndex = function () {
  return this._endIndex;
};
/**
 * Get the page count
 * @return {number} The total number of pages
 * @export
 * @expose
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */


oj.CollectionPagingDataSource.prototype.getPageCount = function () {
  var totalSize = this.totalSize();
  return totalSize === -1 ? -1 : Math.ceil(totalSize / this.pageSize);
};
/**
 * Fetch the row data.
 * @param {Object=} options Options to control fetch
 * @param {number} options.startIndex The index at which to start fetching records.
 * @param {boolean} options.silent If set, do not fire a sync event.
 * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects and the startIndex triggering done when complete.<p>
 *         The structure of the resolved compound object is:<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
 * <tr><td><b>startIndex</b></td><td>The startIndex for the returned set of rows</td></tr>
 * </tbody>
 * </table>
 * @ojsignature {
 *          target: "Type",
 *          for: "returns",
 *          value: "void|Promise<void|{data: Array<object>, startIndex: number}>"}
 * @export
 * @expose
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */


oj.CollectionPagingDataSource.prototype.fetch = function (options) {
  var opts = options || {};

  if (opts.pageSize !== undefined && opts.startIndex !== undefined) {
    if (!this._hasMore()) {
      // At the limit
      this._processSuccess(null);

      return Promise.resolve();
    }

    this.currentPageSize = opts.startIndex + opts.pageSize;
    var self = this;
    return this._refreshDataWindow().then(function () {
      self._processSuccess(null);
    });
  }

  return this._fetchInternal(options);
};

oj.CollectionPagingDataSource.prototype._fetchInternal = function (options) {
  // No fetching, but set up window according to options
  var opts = options || {};

  if (opts.startIndex !== undefined) {
    this.current = opts.startIndex;
  }

  if (opts.pageSize !== undefined) {
    this.pageSize = opts.pageSize;
    this.currentPageSize = opts.pageSize;
  }

  var self = this;
  return new Promise(function (resolve) {
    // Call collection fetch, and refresh the window on success
    // Allow for the fact that this collection might not be backed by a rest service
    try {
      self.collection.fetch({
        success: function success() {
          self._refreshDataWindow().then(function () {
            self._processSuccess(opts);

            resolve({
              data: self.getWindow(),
              startIndex: self.current
            });
          });
        }
      });
    } catch (e) {
      self._refreshDataWindow().then(function () {
        self._processSuccess(opts);

        resolve({
          data: self.getWindow(),
          startIndex: self.current
        });
      });
    }
  });
};

oj.CollectionPagingDataSource.prototype._processSuccess = function (opts) {
  var options = opts || {};

  if (!options.silent) {
    this.handleEvent('sync', {
      data: this.getWindow(),
      startIndex: this.current
    });
  }

  if (options.success) {
    options.success();
  }
  /*    else if (this.fetchCallback) {
          this.fetchCallback();
      }*/

};

oj.CollectionPagingDataSource.prototype.handleEvent = function (eventType, event) {
  return oj.CollectionPagingDataSource.superclass.handleEvent.call(this, eventType, event);
};
/**
 * Return whether there is more data which can be fetched.
 * @private
 * @memberof oj.CollectionPagingDataSource
 */


oj.CollectionPagingDataSource.prototype._hasMore = function () {
  return this.current + this.currentPageSize < this.totalSize();
};
/**
 * Set or change the number of models in a page
 *
 * @param {number} n page size
 * @private
 * @memberof oj.CollectionPagingDataSource
 */


oj.CollectionPagingDataSource.prototype._setPageSize = function (n) {
  this.pageSize = n;
  this.currentPageSize = n;
  /*  if (!this._noInit) {
      var self = this;
      return this._refreshDataWindow().then(function() {
                  self._processSuccess(null)});
    }*/
};

oj.CollectionPagingDataSource.prototype.setFetchCallback = function (callback) {
  this.fetchCallback = callback;
};
/**
 * @export
 * Return the size of the data locally in the dataSource. -1 if an initial fetch has not been
 * done yet.
 * @returns {number} size of data
 * @expose
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */


oj.CollectionPagingDataSource.prototype.size = function () {
  var w = this.getWindow();
  return w ? w.length : 0;
};
/**
 * @export
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @expose
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */


oj.CollectionPagingDataSource.prototype.totalSize = function () {
  return this.collection.length;
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
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */


oj.CollectionPagingDataSource.prototype.totalSizeConfidence = function () {
  return 'actual';
};
/**
 * Determines whether this data source supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof oj.CollectionPagingDataSource
 * @instance
 */
// eslint-disable-next-line no-unused-vars


oj.CollectionPagingDataSource.prototype.getCapability = function (feature) {
  return null;
};

});