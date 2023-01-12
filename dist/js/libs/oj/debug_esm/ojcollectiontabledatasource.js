/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Collection, Events, Model } from 'ojs/ojmodel';
import 'ojs/ojdatasource-common';
import $ from 'jquery';

/**
 * @export
 * @class CollectionTableDataSource
 * @extends TableDataSource
 * @classdesc Object representing data available from an {@link Collection} object, such as an external data source.  This data source can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 *            See the Table - Using Collection demo for an example.<br><br>
 *            Refer to {@link TableDataSource} for other data sources that represent tabular data.
 * @param {Collection} data data supported by the components
 * @param {Object|null} [options] Options for the TableDataSource
 * @param {"enabled"|"disabled"} [options.startFetch] Control whether to start initial fetch when the TableDataSource is bound to a component.  Valid values are:<br><br>
 *          <b>"enabled"</b> (default) - Start initial fetch automatically when the TableDataSource is bound to a component.<br>
 *          <b>"disabled"</b> - Do not start initial fetch automatically.  Application will call the <a href="#fetch">fetch()</a> method to
 *                                                        start the first fetch.
 * @constructor
 * @final
 * @ojdeprecated {since: '6.0.0', description: 'Use CollectionDataProvider instead.'}
 * @ojtsignore
 * @since 1.0
 */
const CollectionTableDataSource = function (data, options) {
  // Initialize
  this.data = {}; // This was put in to keep closure happy...
  if (!(data instanceof Collection)) {
    // we only support Collection
    var errSummary = oj.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_SUMMARY;
    var errDetail = oj.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_DETAIL;
    throw new Error(errSummary + '\n' + errDetail);
  }

  CollectionTableDataSource.superclass.constructor.call(this, data, options);

  this._collection = data;
  this._addCollectionEventListeners();

  this.Init();

  if (
    (options != null && (options.startFetch === 'enabled' || options.startFetch == null)) ||
    options == null
  ) {
    this._startFetchEnabled = true;
  }
};

oj._registerLegacyNamespaceProp('CollectionTableDataSource', CollectionTableDataSource);

// Subclass from oj.DataSource
oj.Object.createSubclass(
  CollectionTableDataSource,
  oj.TableDataSource,
  'oj.CollectionTableDataSource'
);

/**
 * @export
 * @memberof CollectionTableDataSource
 * @desc If set to a function(row1, row2), then this function is called comparing raw row data (see the
 * JavaScript array.sort() for details)
 * @ojsignature {target: "Type",
 *               value: "null|string|((param0: object, param1?: object)=> number|string|object)"}
 */
CollectionTableDataSource.prototype.comparator = null;

/**
 * Initializes the instance.
 * @memberof CollectionTableDataSource
 * @instance
 * @override
 * @protected
 */
CollectionTableDataSource.prototype.Init = function () {
  CollectionTableDataSource.superclass.Init.call(this);
};

/**
 * Return the row data found at the given index.
 *
 * @param {number} index Index for which to return the row data.
 * @param {Object=} options Options to control the at.
 * @return {Promise} Promise resolves to a compound object which has the structure below. If the index is out of range, Promise resolves to null.<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>The raw row data</td></tr>
 * <tr><td><b>index</b></td><td>The index for the row</td></tr>
 * <tr><td><b>key</b></td><td>The key value for the row</td></tr>
 * </tbody>
 * </table>
 * @export
 * @ojsignature {target:"Type",
 *               value: "Promise<null|TableDataSource.RowData>",
 *               for: "returns",
 *               jsdocOverride: true}
 * @expose
 * @memberof CollectionTableDataSource
 * @instance
 */
CollectionTableDataSource.prototype.at = function (index, options) {
  var _options = options || {};
  _options.deferred = true;
  var model = this._collection.at(index, _options);
  var self = this;
  // the at() call can result in fetches
  self._isFetchingForAt = true;
  var row;
  return new Promise(function (resolve, reject) {
    if (model != null) {
      model.then(
        function (resolvedModel) {
          self._isFetchingForAt = false;
          row = { data: resolvedModel.attributes, index: index, key: resolvedModel.id };
          resolve(row);
        },
        function (e) {
          self._isFetchingForAt = false;
          oj.TableDataSource.superclass.handleEvent.call(
            self,
            oj.TableDataSource.EventType.ERROR,
            e
          );
          reject(e);
        }
      );
    } else {
      resolve(null);
    }
  });
};

/**
 * Fetch the row data.
 * @param {Object=} options Options to control fetch
 * @param {number} [options.startIndex] The index at which to start fetching records.
 * @param {boolean} [options.silent] If set, do not fire a sync event.
 * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of ids, and the startIndex triggering done when complete.<p>
 *         The structure of the resolved compound object is:<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
 * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
 * <tr><td><b>startIndex</b></td><td>The startIndex for the returned set of rows</td></tr>
 * </tbody>
 * </table>
 * @ojsignature {target:"Type",
 *               value: "Promise<null|TableDataSource.RowDatas>",
 *               for: "returns",
 *               jsdocOverride: true}
 * @export
 * @expose
 * @memberof CollectionTableDataSource
 * @instance
 */
CollectionTableDataSource.prototype.fetch = function (options) {
  var _options = options || {};
  var fetchType = _options.fetchType;

  if (fetchType === 'init' && !this._startFetchEnabled) {
    return Promise.resolve();
  }

  return this._fetchInternal(_options);
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
 * @ojsignature {target:"Type",
 *               value: "Promise<null|TableDataSource.RowData>",
 *               for: "returns",
 *               jsdocOverride: true}
 * @export
 * @expose
 * @memberof CollectionTableDataSource
 * @instance
 */
CollectionTableDataSource.prototype.get = function (id, options) {
  var _options = options || {};
  _options.deferred = true;
  var model = this._collection.get(id, _options);
  var self = this;

  return new Promise(function (resolve, reject) {
    if (model != null) {
      model.then(
        function (resolvedModel) {
          if (resolvedModel) {
            var wrappedRow = self._wrapWritableValue(resolvedModel, resolvedModel.attributes);
            var row = { data: wrappedRow, index: resolvedModel.index, key: resolvedModel.id };
            resolve(row);
          } else {
            resolve(null);
          }
        },
        function (e) {
          oj.TableDataSource.superclass.handleEvent.call(
            self,
            oj.TableDataSource.EventType.ERROR,
            e
          );
          reject(e);
        }
      );
    } else {
      resolve(null);
    }
  });
};

/**
 * Performs a sort on the data source.
 * @param {Object} [criteria] the sort criteria.
 * @param {any} criteria.key The key that identifies which field to sort
 * @param {'ascending'|'descending'|'none'} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @return {Promise.<null>} promise object triggering done when complete.
 * @export
 * @expose
 * @memberof CollectionTableDataSource
 * @instance
 */
CollectionTableDataSource.prototype.sort = function (criteria) {
  if (criteria == null) {
    // eslint-disable-next-line no-param-reassign
    criteria = this.sortCriteria;
  } else {
    this.sortCriteria = criteria;
  }

  var comparator = this.comparator;

  var self = this;
  return new Promise(function (resolve) {
    if (comparator == null) {
      self._collection.comparator = criteria.key;

      if (criteria.direction === 'ascending') {
        self._collection.sortDirection = 1;
      } else {
        self._collection.sortDirection = -1;
      }
    } else {
      self._collection.comparator = comparator;
    }
    self._collection.sort(null);
    var result = { header: criteria.key, direction: criteria.direction };
    resolve(result);
  });
};

/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @export
 * @expose
 * @memberof CollectionTableDataSource
 * @instance
 */
CollectionTableDataSource.prototype.totalSize = function () {
  var totalSize = this._collection.totalResults >= 0 ? this._collection.totalResults : -1;

  if (totalSize > -1) {
    var size = this._collection.size();
    return size > totalSize ? size : totalSize;
  }

  if (this._fetchResultSize > 0) {
    totalSize = this._fetchResultSize;
  } else if (this.totalSizeConfidence() === 'atLeast') {
    return this._collection.size();
  }

  return totalSize;
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
 * @memberof CollectionTableDataSource
 * @instance
 */
CollectionTableDataSource.prototype.totalSizeConfidence = function () {
  if (this._collection.totalResults >= 0) {
    return 'actual';
  } else if (this._collection.hasMore) {
    // if totalResults is unknown but we know we have more then
    // we know we have at least a certain number of rows
    return 'atLeast';
  }
  return 'unknown';
};

/**
 * Add event listeners to the collection
 * @private
 * @memberof CollectionTableDataSource
 */
CollectionTableDataSource.prototype._addCollectionEventListeners = function () {
  var self = this;
  this._collection.on(Events.EventType.SYNC, function (event) {
    if (event instanceof Model) {
      oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType.CHANGE, {
        data: [event.attributes],
        keys: [event.id],
        indexes: [event.index]
      });
    } else if (event instanceof Collection) {
      if (!self._isFetchingForAt && !self._isFetching) {
        var startIndex = event.offset;
        var pageSize = event.lastFetchCount || event.lastFetchSize;

        // Do not call _getRowArray if this datasource is paged,
        // or if the underlying Collection is virtual since _getRowArray
        // assumes collection.at returns Model objects, which is not the case
        // for virtual collection.
        if (pageSize > 0 || self._collection.IsVirtual()) {
          self._startIndex = startIndex;
          self._pageSize = pageSize;
          var endIndex = 0;

          if (self._collection.totalResults > 0 || self._collection.hasMore) {
            endIndex = startIndex + pageSize;
          }

          // paged fetch
          self._isFetchingForAt = true;
          event.IterativeAt(startIndex, endIndex).then(function (modelArray) {
            self._isFetchingForAt = false;
            var rowArray = [];
            var keyArray = [];

            for (var i = 0; i < modelArray.length; i++) {
              if (modelArray[i] != null) {
                var model = modelArray[i];
                var wrappedRow = self._wrapWritableValue(model, model.attributes);
                rowArray.push(wrappedRow);
                keyArray.push(model.id);
              }
            }
            var result = { data: rowArray, keys: keyArray, startIndex: startIndex };
            self._endFetch.call(self, { silent: false }, result);
          });
        } else {
          var result = self._getRowArray();
          self._endFetch.call(self, { silent: false }, result);
        }
      }
    }
  });
  this._collection.on(Events.EventType.ALLADDED, function (event, modelArray) {
    var rowArray = [];
    var keyArray = [];
    var indexArray = [];

    for (var i = 0; i < modelArray.length; i++) {
      var model = modelArray[i];
      var wrappedRow = self._wrapWritableValue(model, model.attributes);
      rowArray.push(wrappedRow);
      keyArray.push(model.id);
      indexArray.push(model.index);
    }
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType.ADD, {
      data: rowArray,
      keys: keyArray,
      indexes: indexArray
    });
  });
  this._collection.on(Events.EventType.ALLREMOVED, function (event, modelArray) {
    var rowArray = [];
    var keyArray = [];
    var indexArray = [];

    for (var i = 0; i < modelArray.length; i++) {
      var model = modelArray[i];
      // no need to wrapWritableValue as we are just deleting
      rowArray.push(model.attributes);
      keyArray.push(model.id);
      indexArray.push(model.index);
    }
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType.REMOVE, {
      data: rowArray,
      keys: keyArray,
      indexes: indexArray
    });
  });
  this._collection.on(Events.EventType.RESET, function (event) {
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType.RESET, event);
  });
  this._collection.on(Events.EventType.SORT, function (event, eventOpts) {
    if (eventOpts == null || !eventOpts.add) {
      var sortCriteria = {};

      if (event != null && !event.comparator != null && !$.isFunction(event.comparator)) {
        sortCriteria.header = event.comparator;
        sortCriteria.direction = event.sortDirection === 1 ? 'ascending' : 'descending';
      }
      oj.TableDataSource.superclass.handleEvent.call(
        self,
        oj.TableDataSource.EventType.SORT,
        sortCriteria
      );
    }
  });
  this._collection.on(Events.EventType.CHANGE, function (event) {
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType.CHANGE, {
      data: [event.attributes],
      keys: [event.id],
      indexes: [event.index]
    });
  });
  this._collection.on(Events.EventType.DESTROY, function (event) {
    oj.TableDataSource.superclass.handleEvent.call(
      self,
      oj.TableDataSource.EventType.DESTROY,
      event
    );
  });
  this._collection.on(Events.EventType.REFRESH, function (event) {
    oj.TableDataSource.superclass.handleEvent.call(
      self,
      oj.TableDataSource.EventType.REFRESH,
      event
    );
  });
  this._collection.on(Events.EventType.ERROR, function (collection, xhr, options) {
    oj.TableDataSource.superclass.handleEvent.call(
      self,
      oj.TableDataSource.EventType.ERROR,
      collection,
      xhr,
      options
    );
  });
  this._collection.on(Events.EventType.REQUEST, function (event) {
    // If this datasource is fetching, it calls setRangeLocal on the collection, which
    // causes the collection to fire the REQUEST event.  In this case we don't want this
    // datasource to fire its own REQUEST event since it has already done that in _startFetch.
    if (!self._isFetching) {
      oj.TableDataSource.superclass.handleEvent.call(
        self,
        oj.TableDataSource.EventType.REQUEST,
        event
      );
    }
  });
};

CollectionTableDataSource.prototype._fetchInternal = function (_options) {
  this._startFetch(_options);
  var options = _options || {};
  var self = this;
  this._isPaged = options.pageSize > 0;
  this._startIndex = options.startIndex == null ? this._startIndex : options.startIndex;
  this._pageSize = options.pageSize > 0 ? options.pageSize : -1;
  options.pageSize = this._pageSize;
  options.startIndex = this._startIndex;
  options.refresh = true;

  return new Promise(function (resolve, reject) {
    var pageSize = self._pageSize;

    if (!self._isPaged) {
      // set an arbitrary page size for setRangeLocal. When non-virtual, will fetch everything anyway.
      pageSize = 25;
    }

    self._collection.setRangeLocal(self._startIndex, pageSize).then(
      function (actual) {
        var result;

        // Do not call _getRowArray if this datasource is paged,
        // or if the underlying Collection is virtual since _getRowArray
        // assumes collection.at returns Model objects, which is not the case
        // for virtual collection.
        if (self._isPaged || self._collection.IsVirtual()) {
          var rowArray = [];
          var keyArray = [];

          for (var i = 0; i < actual.models.length; i++) {
            var model = actual.models[i];
            var wrappedRow = self._wrapWritableValue(model, model.attributes);
            rowArray[i] = wrappedRow;
            keyArray[i] = model.id;
          }
          result = { data: rowArray, keys: keyArray, startIndex: self._startIndex };

          if (actual.models.length < self._pageSize) {
            // it returned less than a page of data so we're at the end
            // set the totalSize if unknown
            if (self.totalSize() < 0) {
              self._fetchResultSize = self._startIndex + actual.models.length;
            }
          } else {
            self._fetchResultSize = null;
          }
        } else {
          result = self._getRowArray();
        }

        self._endFetch.call(self, options, result);
        resolve(result);
      },
      function (error) {
        reject(error);
      }
    );
  });
};

/**
 * Indicate starting fetch
 * @param {Object} options
 * @private
 * @memberof CollectionTableDataSource
 */
CollectionTableDataSource.prototype._startFetch = function (options) {
  this._isFetching = true;
  if (!options.silent) {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType.REQUEST, {
      startIndex: options.startIndex
    });
  }
};

/**
 * Indicate ending fetch
 * @param {Object} options
 * @param {Object} result Result object
 * @private
 * @memberof CollectionTableDataSource
 */
CollectionTableDataSource.prototype._endFetch = function (options, result) {
  this._isFetching = false;
  if (!options.silent) {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType.SYNC, result);
  }
};

CollectionTableDataSource.prototype._getRowArray = function () {
  var endIndex = this._collection.size() - 1;
  var rowArray = [];
  var keyArray = [];
  var startIndex = this._startIndex >= 0 ? this._startIndex : 0;
  for (var i = startIndex; i <= endIndex; i++) {
    var model = this._collection.at(i);
    var wrappedRow = this._wrapWritableValue(model, model.attributes);
    rowArray[i] = wrappedRow;
    keyArray[i] = model.id;
  }
  return { data: rowArray, keys: keyArray, startIndex: this._startIndex };
};

/**
 * Determines whether this TableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof CollectionTableDataSource
 * @instance
 */
// eslint-disable-next-line no-unused-vars
CollectionTableDataSource.prototype.getCapability = function (feature) {
  if (feature === 'sort') {
    return 'full';
  }
  return null;
};

CollectionTableDataSource.prototype._wrapWritableValue = function (model, m) {
  var returnObj = {};
  var props = Object.keys(m);

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    (function (localProp) {
      var localModel = model;
      Object.defineProperty(returnObj, localProp, {
        get: function () {
          return localModel.get(localProp);
        },
        set: function (newValue) {
          localModel.set(localProp, newValue, { silent: true });
        },
        enumerable: true
      });
    })(prop);
  }

  return returnObj;
};

export { CollectionTableDataSource };
