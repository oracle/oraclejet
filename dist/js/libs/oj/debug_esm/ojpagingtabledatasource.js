/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import 'jquery';
import 'ojs/ojdatasource-common';
import 'ojs/ojpagingmodel';

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @export
 * @class PagingTableDataSource
 * @classdesc Object representing data that supports paging functionality.  This data source can be used by [ListView]{@link oj.ojListView}, [PagingControl]{@link oj.ojPagingControl}, and [Table]{@link oj.ojTable}.
 *            <p>This class implements the {@link PagingModel} interface and
 *            publish all of the PagingModel event types, which can be
 *            listened to using the [on()]{@link PagingTableDataSource#on}
 *            method.</p>
 *            See the Paging Control - Paging Table demo for an example.<br><br>
 *            Refer to {@link TableDataSource} for other data sources that represent tabular data.
 * @extends TableDataSource
 * @implements PagingModel
 * @param {Object} dataSource
 * @param {Object|null} options Options for the PagingTableDataSource.  No option is currently supported.
 * @constructor
 * @final
 * @since 1.0
 * @ojtsignore
 * @ojdeprecated {since: '14.0.0', description: 'PagingTableDataSource has been deprecated,
 * use PagingDataProviderView instead.'}
 */
// eslint-disable-next-line no-unused-vars
const PagingTableDataSource = function (dataSource, options) {
  // Initialize

  if (!(dataSource instanceof oj.TableDataSource)) {
    // we only support Array, oj.Collection, or ko.observableArray. To
    // check for observableArray, we can't do instanceof check because it's
    // a function. So we just check if it contains a subscribe function.
    var errSummary = oj.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_SUMMARY;
    var errDetail = oj.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_DETAIL;
    throw new Error(errSummary + '\n' + errDetail);
  }
  this.dataSource = dataSource;
  this._startIndex = 0;
  this._endIndex = -1;
  this._dataSourceWrappedEventHandlers = [];
  this.Init();

  // PagingTableDataSource doesn't need its own copy of sortCriteria and can
  // just act as a proxy for the underlying dataSource
  Object.defineProperty(this, 'sortCriteria', {
    configurable: false,
    enumerable: true,
    get: function () {
      return this.dataSource.sortCriteria;
    },
    set: function (newValue) {
      this.dataSource.sortCriteria = newValue;
    }
  });
};

oj._registerLegacyNamespaceProp('PagingTableDataSource', PagingTableDataSource);
// Subclass from oj.DataSource
oj.Object.createSubclass(PagingTableDataSource, oj.TableDataSource, 'oj.PagingTableDataSource');

/**
 * Initializes the instance.
 * @memberof PagingTableDataSource
 * @instance
 * @override
 * @protected
 */
PagingTableDataSource.prototype.Init = function () {
  PagingTableDataSource.superclass.Init.call(this);
};

/**
 * Retrieves the underlying DataSource.
 * @return {Object} the underlying oj.DataSource.
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.getWrappedDataSource = function () {
  return this.dataSource;
};

/**
 * Get the current page
 * @return {number} The current page
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.getPage = function () {
  if (this._fetchType === 'loadMore') {
    return 0;
  }
  return this._getPageFromStartIndex();
};

/**
 * Set the current page
 * @param {number} value The current page
 * @param {Object=} options Options<p>
 *                  pageSize: The page size.<p>
 * @return {Promise} promise object triggering done when complete..
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.setPage = function (value, options) {
  // eslint-disable-next-line no-param-reassign
  options = options || {};
  // eslint-disable-next-line no-param-reassign
  value = parseInt(value, 10);

  try {
    PagingTableDataSource.superclass.handleEvent.call(this, oj.PagingModel.EventType.BEFOREPAGE, {
      page: value,
      previousPage: this._getPageFromStartIndex()
    });
  } catch (err) {
    return Promise.reject(err);
  }
  var previousPage = this._getPageFromStartIndex();
  this._pageSize = options.pageSize != null ? options.pageSize : this._pageSize;
  // eslint-disable-next-line no-param-reassign
  options.pageSize = this._pageSize;
  // eslint-disable-next-line no-param-reassign
  options.startIndex = value * this._pageSize;
  this._startIndex = options.startIndex == null ? this._startIndex : options.startIndex;
  this._fetchType = 'page';
  var self = this;
  return new Promise(function (resolve, reject) {
    // we only support paged fetches
    if (self._pageSize > 0) {
      self.dataSource.fetch(options).then(
        function (result) {
          // eslint-disable-next-line no-param-reassign
          result.startIndex = 0;
          if (result.data.length > 0) {
            self._updateEndIndex(self._startIndex + result.data.length - 1, true);
          } else {
            self._updateEndIndex(-1, true);
          }
          PagingTableDataSource.superclass.handleEvent.call(self, oj.PagingModel.EventType.PAGE, {
            page: self._getPageFromStartIndex(),
            previousPage: previousPage
          });
          resolve(null);
        },
        function (e) {
          self._startIndex = previousPage * self._pageSize;
          reject(e);
        }
      );
    } else {
      resolve(null);
    }
  });
};

/**
 * Get the current page start index
 * @return {number} The current page start index
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.getStartItemIndex = function () {
  if (this._fetchType === 'loadMore') {
    return 0;
  }
  return this._startIndex;
};

/**
 * Get the current page end index. If there are no rows in the current page then
 * return -1.
 * @return {number} The current page end index
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.getEndItemIndex = function () {
  return this._endIndex;
};

/**
 * Get the page count
 * @return {number} The total number of pages
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.getPageCount = function () {
  var totalSize = this.totalSize();
  return totalSize === -1 ? -1 : Math.ceil(totalSize / this._pageSize);
};

/** ** start delegated functions ****/

/**
 * Return the row data found at the given index.
 *
 * @param {number} index Index for which to return the row data.
 * @param {Object=} options Options to control the at.
 * @param {number} options.fetchSize fetch size to use if the call needs to fetch more records from the server, if virtualized.  Overrides the overall fetchSize setting <p>
 * @return {Promise} Promise resolves to a compound object which has the structure below. If the index is out of range, Promise resolves to null.<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>The raw row data</td></tr>
 * <tr><td><b>index</b></td><td>The index for the row</td></tr>
 * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
 * </tbody>
 * </table>
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.at = function (index, options) {
  return this.dataSource.at(index, options);
};

/**
 * Fetch the row data.
 * @param {Object=} options Options to control fetch
 * @param {number} options.startIndex The index at which to start fetching records.
 * @param {boolean} options.silent If set, do not fire a sync event.
 * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of ids, and the startIndex triggering done when complete.<p>
 *         The structure of the resolved compound object is:<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
 * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
 * <tr><td><b>startIndex</b></td><td>The startIndex for the returned set of rows</td></tr>
 * </tbody>
 * </table>
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.fetch = function (options) {
  // eslint-disable-next-line no-param-reassign
  options = options || {};
  if (options.startIndex == null) {
    // this is just a refresh call from ojTable. So treat it as a paged fetch
    return this.setPage(this.getPage());
  }

  this._fetchType = 'loadMore';

  this._startIndex = options.startIndex == null ? this._startIndex : options.startIndex;
  var pageSize = options.pageSize == null ? this._pageSize : options.pageSize;

  if (this._pageSize == null) {
    this._pageSize = pageSize;
  }

  // eslint-disable-next-line no-param-reassign
  options.pageSize = pageSize;
  // eslint-disable-next-line no-param-reassign
  options.startIndex = this._startIndex;

  var self = this;
  return new Promise(function (resolve, reject) {
    // we only support paged fetches
    if (pageSize > 0) {
      self.dataSource.fetch(options).then(
        function (result) {
          if (result.data.length > 0) {
            self._updateEndIndex(self._startIndex + result.data.length - 1, true);
          } else {
            self._updateEndIndex(-1, true);
          }
          resolve(result);
        },
        function (e) {
          reject(e);
        }
      );
    } else {
      resolve(null);
    }
  });
};

/**
 * Return the first row data whose id value is the given id
 * @param {string} id ID for which to return the row data, if found.
 * @param {Object=} options Options to control the get.
 * @return {Promise} Promise which resolves to a compound object which has the structure below where the id matches the given id. If none are found, resolves to null.<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>The raw row data</td></tr>
 * <tr><td><b>index</b></td><td>The index for the row</td></tr>
 * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
 * </tbody>
 * </table>
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.get = function (id, options) {
  return this.dataSource.get(id, options);
};

/**
 * Determines whether this TableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.getCapability = function (feature) {
  return this.dataSource.getCapability(feature);
};

/**
 * Attach an event handler to the datasource
 * @param {string} eventType eventType supported by the datasource.
 *        <p>In addition to this class's event types, it can also be one of the
 *           {@link PagingModel} event types.</p>
 * @param {function(Object)} eventHandler event handler function
 * @return {void}
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.on = function (eventType, eventHandler) {
  var self = this;
  var dataSource = /** @type {{on: Function}} */ (this.dataSource);
  var ev;

  if (eventType === oj.TableDataSource.EventType.SYNC) {
    ev = function (event) {
      self._handleSyncEvent(event, eventHandler);
    };
    this._dataSourceWrappedEventHandlers.push({
      eventType: eventType,
      eventHandler: eventHandler,
      wrappedEventHandler: ev
    });
    dataSource.on(eventType, ev);
  } else if (
    eventType === oj.TableDataSource.EventType.ADD ||
    eventType === oj.TableDataSource.EventType.REMOVE ||
    eventType === oj.TableDataSource.EventType.CHANGE
  ) {
    ev = function (event) {
      self._handleRowEvent(event, eventHandler);
    };
    this._dataSourceWrappedEventHandlers.push({
      eventType: eventType,
      eventHandler: eventHandler,
      wrappedEventHandler: ev
    });
    dataSource.on(eventType, ev);
  } else if (
    eventType === oj.TableDataSource.EventType.REFRESH ||
    eventType === oj.TableDataSource.EventType.RESET
  ) {
    ev = function (event) {
      self._startIndex = 0;
      eventHandler(event);
    };
    this._dataSourceWrappedEventHandlers.push({
      eventType: eventType,
      eventHandler: eventHandler,
      wrappedEventHandler: ev
    });
    dataSource.on(eventType, ev);
  } else if (
    eventType === oj.PagingModel.EventType.PAGE ||
    eventType === oj.PagingModel.EventType.BEFOREPAGE ||
    eventType === oj.PagingModel.EventType.PAGECOUNT
  ) {
    PagingTableDataSource.superclass.on.call(this, eventType, eventHandler);
  } else {
    dataSource.on(eventType, eventHandler);
  }
};

/**
 * Detach an event handler from the datasource
 * @param {string} eventType eventType supported by the datasource
 * @param {function(Object)} eventHandler event handler function
 * @return {void}
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.off = function (eventType, eventHandler) {
  if (
    eventType === oj.PagingModel.EventType.PAGE ||
    eventType === oj.PagingModel.EventType.PAGECOUNT
  ) {
    PagingTableDataSource.superclass.off.call(this, eventType, eventHandler);
  }
  var dataSource = /** @type {{off: Function}} */ (this.dataSource);

  if (this._dataSourceWrappedEventHandlers != null) {
    var dataSourceWrappedEventHandlersCount = this._dataSourceWrappedEventHandlers.length;
    var i;
    for (i = 0; i < dataSourceWrappedEventHandlersCount; i++) {
      if (
        this._dataSourceWrappedEventHandlers[i].eventType === eventType &&
        this._dataSourceWrappedEventHandlers[i].eventHandler === eventHandler
      ) {
        dataSource.off(eventType, this._dataSourceWrappedEventHandlers[i].wrappedEventHandler);
        this._dataSourceWrappedEventHandlers.splice(i, 1);
        break;
      }
    }
  }
  dataSource.off(eventType, eventHandler);
};

/**
 * Performs a sort on the data source.
 * @param {Object} criteria the sort criteria.
 * @param {Object} criteria.key The key that identifies which field to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @return {Promise} promise object triggering done when complete.
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.sort = function (criteria) {
  return this.dataSource.sort(criteria);
};

/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.totalSize = function () {
  return this.dataSource.totalSize();
};

/**
 * Returns the confidence for the totalSize value.
 * @return {string} "actual" if the totalSize is the time of the fetch is an exact number
 *                  "estimate" if the totalSize is an estimate
 *                  "atLeast" if the totalSize is at least a certain number
 *                  "unknown" if the totalSize is unknown
 * @ojsignature {target: "Type", for: "returns", value: "'actual'|'estimate'|'atLeast'|'unknown'"}
 * @export
 * @expose
 * @memberof PagingTableDataSource
 * @instance
 */
PagingTableDataSource.prototype.totalSizeConfidence = function () {
  return this.dataSource.totalSizeConfidence();
};

/** ** end delegated functions ****/

PagingTableDataSource.prototype._getPageFromStartIndex = function () {
  if (this._pageSize > 0) {
    return Math.floor(this._startIndex / this._pageSize);
  }
  return 0;
};

PagingTableDataSource.prototype._handleRowEvent = function (event, eventHandler) {
  var ignoreRows = [];
  var i;
  for (i = 0; i < event.indexes.length; i++) {
    var rowIdx = event.indexes[i];
    if (rowIdx !== undefined) {
      // adjust by startIndex
      if (this._fetchType === 'page') {
        rowIdx -= this._startIndex;
      }

      if (rowIdx < 0 || rowIdx >= this._startIndex + this._pageSize) {
        // ignore if it's not in our page range
        ignoreRows.push(i);
      }
    }
  }

  if (ignoreRows.length > 0) {
    ignoreRows.sort(function (a, b) {
      return a - b;
    });

    for (i = ignoreRows.length - 1; i >= 0; i--) {
      event.data.splice(ignoreRows[i], 1);
      event.indexes.splice(ignoreRows[i], 1);
      event.keys.splice(ignoreRows[i], 1);
    }
  }

  if (event.indexes.length > 0) {
    this._updateEndIndex(event.indexes[event.indexes.length - 1], false);
  }

  // eslint-disable-next-line no-param-reassign
  event.startIndex = this._startIndex;
  eventHandler(event);
};

PagingTableDataSource.prototype._handleSyncEvent = function (event, eventHandler) {
  var eventStartIndex = event.startIndex;

  if (eventStartIndex !== this._startIndex) {
    this._startIndex = event.startIndex;
  }

  if (event.data.length > 0) {
    this._updateEndIndex(event.startIndex + event.data.length - 1, true);
  } else {
    this._updateEndIndex(-1, true);
  }

  if (this._fetchType === 'page') {
    // For paged fetches, reset the startIndex to zero since we always render
    // starting at 0
    var clonedEvent = {};
    oj.CollectionUtils.copyInto(clonedEvent, event);
    clonedEvent.startIndex = 0;
    eventHandler(clonedEvent);
  } else {
    eventHandler(event);
  }
};

PagingTableDataSource.prototype._updateEndIndex = function (lastRowIdx, reset) {
  if (reset) {
    this._endIndex = lastRowIdx;
  } else {
    // only update if greater
    this._endIndex = lastRowIdx > this._endIndex ? lastRowIdx : this._endIndex;
  }

  var totalSize = this.totalSize();

  if (totalSize > 0) {
    this._endIndex = this._endIndex > totalSize - 1 ? totalSize - 1 : this._endIndex;
  }
};

/**
 * @export
 * Event types
 * @enum {string}
 * @memberof PagingTableDataSource
 */
PagingTableDataSource.EventType = {
  /** Triggered when a Row is added to a PagingDataSource */
  ADD: 'add',
  /** Triggered when a Row is removed from a PagingDataSource */
  REMOVE: 'remove',
  /** Triggered when a PagingDataSource is reset */
  RESET: 'reset',
  /** Triggered when a PagingDataSource has been updated by a fetch */
  SYNC: 'sync',
  /** Triggered when a PagingDataSource has been refreshed */
  REFRESH: 'refresh',
  /** Triggered when a PagingDataSource has been sorted */
  SORT: 'sort',
  /** Triggered when a Row's attributes have been changed */
  CHANGE: 'change',
  /** Triggered when a PagingDataSource has sent a fetch request. */
  REQUEST: 'request',
  /** Triggered when an error occurred on the PagingDataSource */
  ERROR: 'error'
};

export default PagingTableDataSource;
