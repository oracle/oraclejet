/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'jquery', 'ojs/ojlogger', 'ojs/ojtranslation', 'ojs/ojdatasource-common'], function (oj, $, Logger, Translations, ojdatasourceCommon) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  /**
   * @export
   * @class ArrayTableDataSource
   * @since 1.0
   * @ojtsignore
   * @extends TableDataSource
   * @classdesc Object representing data available from an array.  This data source can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
   *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
   *            See the Table - Base Table demo for an example.<br><br>
   *            Refer to {@link TableDataSource} for other data sources that represent tabular data.
   * @param {Array|Object|function():Array} data data supported by the components
   *                                      <p>This can be either an Array, or a Knockout observableArray.</p>
   *                                      <p>Each array element should be an object representing one row of data, with the property names and values corresponding to column names and values.
   *                                         Array of primitive values such as ["Apple", "Orange"] is not currently supported.</p>
   * @param {Object|null} [options] Options for the TableDataSource
   * @param {string} [options.idAttribute] The column that contains the row key.
   *                 If this is not specified, all the values in a row are used as the key.
   * @param {"enabled"|"disabled"} [options.startFetch] Control whether to start initial fetch when the TableDataSource is bound to a component.  Valid values are:<br><br>
   *                                    <b>"enabled"</b> (default) - Start initial fetch automatically when the TableDataSource is bound to a component.<br>
   *                                    <b>"disabled"</b> - Do not start initial fetch automatically.  Application will call the <a href="#fetch">fetch()</a> method to
   *                                                        start the first fetch.
   * @ojdeprecated {since: '5.0.0', description: 'Use ArrayDataProvider instead.'}
   * @ojsignature {target: "Type",
   *               value: "KnockoutObservableArray<object>|Array<object>",
   *               for: "data"}
   * @constructor
   * @final
   * @ojtsignore
   * @example
   * // First initialize an array
   * var deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
   *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
   *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
   *
   * // Then create an ArrayTableDataSource object with the array
   * var dataSource = new ArrayTableDataSource(deptArray, {idAttribute: 'DepartmentId'});
   */
  const ArrayTableDataSource = function (data, options) {
    // Initialize
    this.data = data || {}; // This was put in to keep closure happy...
    if (!(data instanceof Array) && !this._isObservableArray(data)) {
      // we only support Array or ko.observableArray.
      var errSummary = ojdatasourceCommon.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_SUMMARY;
      var errDetail = ojdatasourceCommon.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_DETAIL;
      throw new Error(errSummary + '\n' + errDetail);
    }

    if (options == null || options.idAttribute == null) {
      Logger.info(ArrayTableDataSource._LOGGER_MSG._INFO_ARRAY_TABLE_DATASOURCE_IDATTR);
    }

    ArrayTableDataSource.superclass.constructor.call(this, data, options);

    this._eventHandlers = [];
    this._rows = {};

    if (data != null) {
      this._idAttribute = null;
      if (options != null && options.idAttribute != null) {
        this._idAttribute = options.idAttribute;
      }
    }

    if (
      (options != null && (options.startFetch === 'enabled' || options.startFetch == null)) ||
      options == null
    ) {
      this._startFetchEnabled = true;
    }
  };

  oj._registerLegacyNamespaceProp('ArrayTableDataSource', ArrayTableDataSource);
  // Subclass from oj.DataSource
  oj.Object.createSubclass(ArrayTableDataSource, ojdatasourceCommon.TableDataSource, 'ArrayTableDataSource');

  /**
   * @export
   * @desc If set to a function(row1, row2), then this function is called comparing raw row data (see the
   * JavaScript array.sort() for details)
   * @memberof ArrayTableDataSource
   * @type {null|string|Function}
   * @ojsignature {target: "Type",
   *               value: "null|string|((param0: object, param1?: object)=> number|string|object)"}
   */
  ArrayTableDataSource.prototype.comparator = null;

  /**
   * @export
   *
   * @type {Object}
   * @property {any} criteria.key The key that identifies which field to sort
   * @property {'ascending'|'descending'|'none'} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
   *
   * @desc The sort criteria. Whenever sort() is called with the criteria parameter, that value is copied to this
   * property. If sort() is called with empty sort criteria then the criteria set in this property is used.
   * @memberof ArrayTableDataSource
   */
  ArrayTableDataSource.prototype.sortCriteria = null;

  /**
   * Initializes the instance.
   * @memberof ArrayTableDataSource
   * @instance
   * @override
   * @protected
   */
  ArrayTableDataSource.prototype.Init = function () {
    ArrayTableDataSource.superclass.Init.call(this);
  };

  /**
   * Add a row (or array of rows) to the end
   *
   * @param {Object|Array.<Object>} m Row object data (or array of rows) to add. These should be sets of attribute/values.
   * @param {Object=} options
   * @param {boolean} [options.silent] if set, do not fire an add event<p>
   * @param {number|Array.<number>} [options.at] splice the new row at the value given (at:index). If an array of rows then this should be an array of indexes <p>
   * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of keys, and an array of indexes which were added triggering done when complete.<p>
   *         The structure of the resolved compound object is:<p>
   * <table>
   * <tbody>
   * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
   * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
   * <tr><td><b>indexes</b></td><td>An array of index values for the rows</td></tr>
   * </tbody>
   * </table>
   * @ojsignature {target:"Type",
   *               value: "Promise<null|ArrayTableDataSource.RowDatas>",
   *               for: "returns",
   *               jsdocOverride: true}
   * @export
   * @expose
   * @memberof ArrayTableDataSource
   * @instance
   */
  ArrayTableDataSource.prototype.add = function (m, options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    this._checkDataLoaded();
    var index = options.at;

    return this._addToRowSet(m, index, options);
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
   * @ojsignature {target:"Type",
   *               value: "Promise<null|TableDataSource.RowData>",
   *               for: "returns",
   *               jsdocOverride: true}
   * @export
   * @expose
   * @memberof ArrayTableDataSource
   * @instance
   */
  // eslint-disable-next-line no-unused-vars
  ArrayTableDataSource.prototype.at = function (index, options) {
    this._checkDataLoaded();
    var row;

    if (index < 0 || index >= this._rows.data.length) {
      row = null;
    } else {
      row = { data: this._rows.data[index], index: index, key: this._getId(this._rows.data[index]) };
    }

    return new Promise(function (resolve) {
      resolve(row);
    });
  };

  /**
   * Change a row (or array of rows), if found.
   * @param {Object|Array.<Object>} m Row object data (or array of rows) to change. These should be sets of attribute/values.
   * @param {Object=} options
   * @param {boolean} [options.silent] if set, do not fire an add event<p>
   * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of keys, and an array of indexes which were changed triggering done when complete.<p>
   *          The structure of the resolved compound object is:<p>
   * <table>
   * <tbody>
   * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
   * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
   * <tr><td><b>indexes</b></td><td>An array of index values for the rows</td></tr>
   * </tbody>
   * </table>
   * @ojsignature {target:"Type",
   *               value: "Promise<null|ArrayTableDataSource.RowDatas>",
   *               for: "returns",
   *               jsdocOverride: true}
   * @export
   * @expose
   * @memberof ArrayTableDataSource
   * @instance
   */
  ArrayTableDataSource.prototype.change = function (m, options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    this._checkDataLoaded();
    var silent = options.silent;
    var rowArray = { data: [], keys: [], indexes: [] };

    if (!(m instanceof Array)) {
      // eslint-disable-next-line no-param-reassign
      m = [m];
    }

    for (var i = 0; i < m.length; i++) {
      var row = m[i];

      if (row != null) {
        var key = this._getId(row);
        var changedRow = this._getInternal(key, false);
        rowArray.data.push(this._wrapWritableValue(row));
        rowArray.keys.push(key);
        rowArray.indexes.push(changedRow.index);
        this._rows.data[changedRow.index] = row;
      }
    }

    if (!silent && rowArray.data.length > 0) {
      ojdatasourceCommon.TableDataSource.superclass.handleEvent.call(this, ojdatasourceCommon.TableDataSource.EventType.CHANGE, rowArray);
    }

    return Promise.resolve(rowArray);
  };

  /**
   * Fetch the row data.
   * @param {Object=} options Options to control fetch
   * @param {number} [options.startIndex] The index at which to start fetching records.
   * @param {boolean} [options.silent] If set, do not fire a sync event.
   * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of ids, and the startIndex triggering done when complete.<p>
   *      The structure of the resolved compound object is:<p>
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
   * @memberof ArrayTableDataSource
   * @instance
   */
  ArrayTableDataSource.prototype.fetch = function (options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    var fetchType = options.fetchType;

    if (fetchType === 'init' && !this._startFetchEnabled) {
      return Promise.resolve();
    }

    return this._fetchInternal(options);
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
   * @memberof ArrayTableDataSource
   * @instance
   */
  // eslint-disable-next-line no-unused-vars
  ArrayTableDataSource.prototype.get = function (id, options) {
    this._checkDataLoaded();
    return Promise.resolve(this._getInternal(id, true));
  };

  /**
   * Determines whether this TableDataSource supports certain feature.
   * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
   * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".
   *         Returns null if the feature is not recognized.
   * @export
   * @expose
   * @memberof ArrayTableDataSource
   * @instance
   */
  // eslint-disable-next-line no-unused-vars
  ArrayTableDataSource.prototype.getCapability = function (feature) {
    return 'full';
  };

  /**
   * Remove a row (or array of rows), if found.
   * @param {Object|Array.<Object>}  m Row object data (or array of rows) to remove. These should be sets of attribute/values.
   * @param {Object=} options
   * @param {boolean} [options.silent] if set, do not fire a remove event
   * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of keys, and an array of indexes which were removed triggering done when complete.<p>
   *      The structure of the resolved compound object is:<p>
   * <table>
   * <tbody>
   * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
   * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
   * <tr><td><b>indexes</b></td><td>An array of index values for the rows</td></tr>
   * </tbody>
   * </table>
   * @ojsignature {target:"Type",
   *               value: "Promise<null|ArrayTableDataSource.RowDatas>",
   *               for: "returns",
   *               jsdocOverride: true}
   * @export
   * @expose
   * @memberof ArrayTableDataSource
   * @instance
   */
  ArrayTableDataSource.prototype.remove = function (m, options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    this._checkDataLoaded();
    return this._removeInternal(m, options);
  };

  /**
   * Remove and replace the entire list of rows with a new set of rows, if provided. Otherwise, empty the datasource. The next fetch
   * call will re-populate the datasource with the original array data. To empty out the data, call reset with an empty array.
   * @param {Array.<Object>=} data Array of row objects with which to replace the data.
   * @param {Object=} options user options, passed to event
   * @return {Promise.<void>} promise object triggering done when complete.
   * @export
   * @expose
   * @memberof ArrayTableDataSource
   * @instance
   */
  ArrayTableDataSource.prototype.reset = function (data, options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    // eslint-disable-next-line no-param-reassign
    options.previousRows = this._rows;
    var silent = options.silent;

    if (data != null) {
      this.data = data;
    }
    this._rows = {};
    this._totalSize = 0;

    // clear any change subscription even if no new data is provided
    // a new subscription will be created on the next data fetch
    if (this._arrayChangeSubscription) {
      this._arrayChangeSubscription.dispose();
      this._arrayChangeSubscription = null;
    }

    if (!silent) {
      ojdatasourceCommon.TableDataSource.superclass.handleEvent.call(this, ojdatasourceCommon.TableDataSource.EventType.RESET, null);
    }
    return Promise.resolve();
  };

  /**
   * Performs a sort on the data source.
   * @param {Object|null} [criteria] the sort criteria.
   * @param {any} criteria.key The key that identifies which field to sort
   * @param {'ascending'|'descending'|'none'} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
   * @return {Promise.<null>} promise object triggering done when complete.
   * @export
   * @expose
   * @memberof ArrayTableDataSource
   * @instance
   */
  ArrayTableDataSource.prototype.sort = function (criteria) {
    if (criteria == null) {
      // eslint-disable-next-line no-param-reassign
      criteria = this.sortCriteria;
    } else {
      this.sortCriteria = criteria;
    }
    // eslint-disable-next-line no-param-reassign
    criteria = criteria || {};

    this._checkDataLoaded();
    var self = this;
    return new Promise(function (resolve) {
      var comparator = self._getComparator();

      self._rows.data.sort(function (a, b) {
        return ArrayTableDataSource._sortFunc(a, b, comparator, self);
      });
      self._sorted = true;
      var result = { header: criteria.key, direction: criteria.direction };
      ojdatasourceCommon.TableDataSource.superclass.handleEvent.call(self, ojdatasourceCommon.TableDataSource.EventType.SORT, result);
      resolve(result);
    });
  };

  /**
   * Return the total size of data available, including server side if not local.
   * @returns {number} total size of data
   * @export
   * @expose
   * @memberof ArrayTableDataSource
   * @instance
   */
  ArrayTableDataSource.prototype.totalSize = function () {
    this._checkDataLoaded();
    return this._totalSize;
  };

  ArrayTableDataSource.prototype._addToRowSet = function (m, index, options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    var silent = options.silent;
    var rowArray = { data: [], keys: [], indexes: [] };

    if (!(m instanceof Array)) {
      // eslint-disable-next-line no-param-reassign
      m = [m];
    }
    if (index != null && !(index instanceof Array)) {
      // eslint-disable-next-line no-param-reassign
      index = [index];
    }

    for (var i = 0; i < m.length; i++) {
      var row = m[i];

      if (row != null) {
        var key = this._getId(row);

        rowArray.data.push(this._wrapWritableValue(row));
        rowArray.keys.push(key);

        if (this._sorted === true && this._rows.data.length > 0) {
          var self = this;
          for (var j = 0; j < this._rows.data.length; j++) {
            if (
              ArrayTableDataSource._sortFunc(row, this._rows.data[j], self._getComparator(), self) < 0
            ) {
              this._rows.data.splice(j, 0, row);
              rowArray.indexes.push(j);
              break;
            } else if (j === this._rows.data.length - 1) {
              this._rows.data.push(row);
              rowArray.indexes.push(j + 1);
              break;
            }
          }
        } else if (index == null) {
          this._rows.data.push(row);
          rowArray.indexes.push(this._rows.data.length - 1);
        } else {
          this._rows.data.splice(index[i], 0, row);
          rowArray.indexes.push(index[i]);
        }
        this._totalSize += 1;
        this._realignRowIndices();
      }
    }

    if (!silent && rowArray.data.length > 0) {
      ojdatasourceCommon.TableDataSource.superclass.handleEvent.call(this, ojdatasourceCommon.TableDataSource.EventType.ADD, rowArray);
    }

    return Promise.resolve(rowArray);
  };

  ArrayTableDataSource.prototype._checkDataLoaded = function () {
    if (!this._isDataLoaded()) {
      var dataArray = [];
      if (this.data instanceof Array) {
        dataArray = this.data;
      } else if (this._isObservableArray(this.data)) {
        dataArray = /** @type {Function} */ (this.data).peek();
        this._subscribeObservableArray(this.data);
      }
      this._rows = this._getRowArray(dataArray);
      this._totalSize = dataArray.length;
    }
  };

  ArrayTableDataSource.prototype._isDataLoaded = function () {
    if (this._rows == null || this._rows.data == null) {
      return false;
    }

    return true;
  };

  ArrayTableDataSource.prototype._fetchInternal = function (options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    this._startFetch(options);
    this._checkDataLoaded();
    var pageSize;
    var rowArray;
    var keyArray;
    var endIndex;
    try {
      pageSize = options.pageSize > 0 ? options.pageSize : -1;
      if (!this._startIndex) {
        this._startIndex = 0;
      }

      this._startIndex = options.startIndex == null ? this._startIndex : options.startIndex;
      endIndex = ArrayTableDataSource._getEndIndex(this._rows, this._startIndex, pageSize);
      rowArray = [];
      keyArray = [];

      for (var i = this._startIndex; i <= endIndex; i++) {
        var key = this._getId(this._rows.data[i]);
        var wrappedRow = this._wrapWritableValue(this._rows.data[i]);
        rowArray[i - this._startIndex] = wrappedRow;
        keyArray[i - this._startIndex] = key;
      }
    } catch (err) {
      this._endFetch(options, null, err);
      return Promise.reject(err);
    }

    if (endIndex < this._startIndex) {
      // this means we have no more rows at the startIndex. So adjust our
      // startIndex down to indicate the last row
      this._startIndex = endIndex + 1;
    }
    // eslint-disable-next-line no-param-reassign
    options.pageSize = pageSize;
    // eslint-disable-next-line no-param-reassign
    options.startIndex = this._startIndex;
    // eslint-disable-next-line no-param-reassign
    options.refresh = true;
    var result = { data: rowArray, keys: keyArray, startIndex: this._startIndex };
    this._endFetch(options, result, null);

    return Promise.resolve(result);
  };

  ArrayTableDataSource.prototype._getInternal = function (id, wrap) {
    var result = null;
    for (var i = 0; i < this._rows.data.length; i++) {
      var row = this._rows.data[i];
      var wrappedRow;

      if (row !== undefined) {
        var key = this._getId(row);
        if ($.isArray(key) && $.isArray(id)) {
          if (key.length === id.length) {
            var equal = true;
            for (var j = 0; j < id.length; j++) {
              if (key[j] !== id[j]) {
                equal = false;
                break;
              }
            }
            if (equal) {
              if (wrap) {
                wrappedRow = this._wrapWritableValue(row);
                result = { data: wrappedRow, key: key, index: this._rows.indexes[i] };
              } else {
                result = { data: row, key: key, index: this._rows.indexes[i] };
              }
              break;
            }
          }
        } else if (key === id) {
          if (wrap) {
            wrappedRow = this._wrapWritableValue(row);
            result = { data: wrappedRow, key: key, index: this._rows.indexes[i] };
          } else {
            result = { data: row, key: key, index: this._rows.indexes[i] };
          }
          break;
        }
      }
    }
    return result;
  };

  ArrayTableDataSource.prototype._getComparator = function () {
    var comparator = this.comparator;

    if (comparator == null) {
      var key = this.sortCriteria.key;
      var direction = this.sortCriteria.direction;

      if (direction === 'ascending') {
        comparator = function (row) {
          if ($.isFunction(row[key])) {
            return row[key]();
          }
          return row[key];
        };
      } else if (direction === 'descending') {
        comparator = function (rowA, rowB) {
          var a;
          var b;
          if ($.isFunction(rowA[key])) {
            a = rowA[key]();
            b = rowB[key]();
          } else {
            a = rowA[key];
            b = rowB[key];
          }

          if (a === b) {
            return 0;
          }
          return a > b ? -1 : 1;
        };
      }
    }
    return comparator;
  };

  // Realign all the indices of the rows (after sort for example)
  ArrayTableDataSource.prototype._realignRowIndices = function () {
    for (var i = 0; i < this._rows.data.length; i++) {
      this._rows.indexes[i] = i;
    }
  };

  ArrayTableDataSource.prototype._removeInternal = function (m, options) {
    var i;
    var self = this;
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    var silent = options.silent;
    var rowArray = { data: [], keys: [], indexes: [] };

    if (!(m instanceof Array)) {
      // eslint-disable-next-line no-param-reassign
      m = [m];
    }

    var sortedRowArray = [];
    for (i = 0; i < m.length; i++) {
      var row = m[i];

      if (row != null) {
        var key = this._getId(row);
        var deletedRow = this._getInternal(key, false);

        if (deletedRow != null) {
          sortedRowArray.push({
            data: deletedRow.data,
            key: deletedRow.key,
            index: deletedRow.index
          });
        }
      }
    }
    sortedRowArray.sort(function (a, b) {
      return a.index - b.index;
    });

    for (i = 0; i < sortedRowArray.length; i++) {
      rowArray.data.push(sortedRowArray[i].data);
      rowArray.keys.push(sortedRowArray[i].key);
      rowArray.indexes.push(sortedRowArray[i].index);
    }

    for (i = rowArray.indexes.length - 1; i >= 0; i--) {
      this._rows.data.splice(rowArray.indexes[i], 1);
      this._rows.indexes.splice(rowArray.indexes[i], 1);
      this._totalSize -= 1;
    }
    this._realignRowIndices();

    if (!silent && rowArray.data.length > 0) {
      ojdatasourceCommon.TableDataSource.superclass.handleEvent.call(self, ojdatasourceCommon.TableDataSource.EventType.REMOVE, rowArray);
    }

    return Promise.resolve(rowArray);
  };

  ArrayTableDataSource.prototype._setRow = function (index, row) {
    this._rows[index] = row;
    // eslint-disable-next-line no-param-reassign
    row.index = index;
  };

  /**
   * Indicate starting fetch
   * @param {Object} options
   * @private
   * @memberof ArrayTableDataSource
   */
  ArrayTableDataSource.prototype._startFetch = function (options) {
    if (!options.silent) {
      ojdatasourceCommon.TableDataSource.superclass.handleEvent.call(this, ojdatasourceCommon.TableDataSource.EventType.REQUEST, {
        startIndex: options.startIndex
      });
    }
  };

  /**
   * Indicate ending fetch
   * @param {Object} options
   * @param {Object} result Result object
   * @param {Object} error Error
   * @private
   * @memberof ArrayTableDataSource
   */
  ArrayTableDataSource.prototype._endFetch = function (options, result, error) {
    if (error != null) {
      ojdatasourceCommon.TableDataSource.superclass.handleEvent.call(this, ojdatasourceCommon.TableDataSource.EventType.ERROR, error);
    } else if (!options.silent) {
      ojdatasourceCommon.TableDataSource.superclass.handleEvent.call(this, ojdatasourceCommon.TableDataSource.EventType.SYNC, result);
    }
  };

  ArrayTableDataSource.prototype._handleRowChange = function (event) {
    // eslint-disable-next-line no-param-reassign
    event.startIndex = this._startIndex;
    ojdatasourceCommon.TableDataSource.superclass.handleEvent.call(this, ojdatasourceCommon.TableDataSource.EventType.CHANGE, event);
  };

  ArrayTableDataSource._compareKeys = function (keyA, keyB, direction) {
    if (direction === 'descending') {
      if (keyA < keyB) {
        return 1;
      }
      if (keyB < keyA) {
        return -1;
      }
    } else {
      if (keyA > keyB) {
        return 1;
      }
      if (keyB > keyA) {
        return -1;
      }
    }
    return 0;
  };

  ArrayTableDataSource._getEndIndex = function (rows, startIndex, pageSize) {
    var endIndex = rows.data.length - 1;

    if (pageSize > 0) {
      endIndex = startIndex + pageSize - 1;
      endIndex = endIndex > rows.data.length - 1 ? rows.data.length - 1 : endIndex;
    }

    return endIndex;
  };

  ArrayTableDataSource._getKey = function (val, attr) {
    if (typeof val[attr] === 'function') {
      return val[attr]();
    }
    return val[attr];
  };

  ArrayTableDataSource.prototype._getRowArray = function (values) {
    var endIndex = values.length - 1;

    var rowArray = { data: [], indexes: [] };
    this._attributes = null;

    for (var i = 0; i <= endIndex; i++) {
      var clonedRowValues = {};
      var rowValues = values[i];

      if (rowValues) {
        var props = Object.keys(rowValues);
        for (var j = 0; j < props.length; j++) {
          var prop = props[j];
          clonedRowValues[prop] = rowValues[prop];
          if (i === 0) {
            if (this._attributes == null) {
              this._attributes = [];
            }
            this._attributes.push(prop);
          }
        }
      } else {
        clonedRowValues = null;
      }
      rowArray.data[i] = clonedRowValues;
      rowArray.indexes[i] = i;
    }

    return rowArray;
  };

  ArrayTableDataSource.prototype._getId = function (row) {
    var id;
    var idAttribute = this._getIdAttr(row);
    var errDetail;

    if (row == null) {
      return null;
    }

    if ($.isArray(idAttribute)) {
      var i;
      id = [];
      for (i = 0; i < idAttribute.length; i++) {
        if (idAttribute[i] in row) {
          id[i] = ArrayTableDataSource._getKey(row, idAttribute[i]);
        } else {
          errDetail = Translations.applyParameters(
            ArrayTableDataSource._LOGGER_MSG._ERR_ARRAY_TABLE_DATASOURCE_IDATTR_NOT_IN_ROW,
            [idAttribute[i]]
          );
          throw new Error(errDetail);
        }
      }
    } else if (idAttribute in row) {
      id = ArrayTableDataSource._getKey(row, idAttribute);
    } else {
      errDetail = Translations.applyParameters(
        ArrayTableDataSource._LOGGER_MSG._ERR_ARRAY_TABLE_DATASOURCE_IDATTR_NOT_IN_ROW,
        [idAttribute]
      );
      throw new Error(errDetail);
    }

    return id;
  };

  ArrayTableDataSource.prototype._getIdAttr = function (row) {
    if (this._idAttribute != null) {
      return this._idAttribute;
    }

    if (this._attributes == null) {
      this._attributes = [];
      var props = Object.keys(row);
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        this._attributes.push(prop);
      }
    }

    if (Object.prototype.hasOwnProperty.call(this._attributes, 'id')) {
      return 'id';
    }

    return this._attributes;
  };

  ArrayTableDataSource._sortFunc = function (a, b, comparator, self) {
    var keyA;
    var keyB;
    var i;
    var retVal;
    var direction = self.sortCriteria.direction;

    if ($.isFunction(comparator)) {
      // How many args?
      if (comparator.length === 1) {
        // "sortBy" comparator option
        keyA = comparator.call(self, a);
        keyB = comparator.call(self, b);
        var attrs1 = oj.StringUtils.isString(keyA) ? keyA.split(',') : [keyA];
        var attrs2 = oj.StringUtils.isString(keyB) ? keyB.split(',') : [keyB];
        for (i = 0; i < attrs1.length; i++) {
          retVal = ArrayTableDataSource._compareKeys(attrs1[i], attrs2[i], direction);
          if (retVal !== 0) {
            return retVal;
          }
        }
        return 0;
      }
      // "sort" comparator option
      return comparator.call(self, a, b);
    }
    // String option
    if (oj.StringUtils.isString(comparator)) {
      var attrs = comparator.split(',');

      for (i = 0; i < attrs.length; i++) {
        keyA = ArrayTableDataSource._getKey(a, attrs[i]);
        keyB = ArrayTableDataSource._getKey(b, attrs[i]);
        retVal = ArrayTableDataSource._compareKeys(keyA, keyB, direction);
        if (retVal !== 0) {
          return retVal;
        }
      }
    }
    return 0;
  };

  ArrayTableDataSource.prototype._subscribeObservableArray = function (data) {
    if (!(data instanceof Array)) {
      var self = this;
      // subscribe to observableArray arrayChange event to get individual updates
      this._arrayChangeSubscription = /** @type {{subscribe: Function}} */ (data).subscribe(
        function (changes) {
          var updatedIndexes = [];
          var removeDuplicate = [];
          var i;
          var j;
          var index;
          var status;
          for (i = 0; i < changes.length; i++) {
            index = changes[i].index;
            status = changes[i].status;
            for (j = 0; j < changes.length; j++) {
              if (
                j !== i &&
                index === changes[j].index &&
                status !== changes[j].status &&
                updatedIndexes.indexOf(i) < 0 &&
                removeDuplicate.indexOf(i) < 0
              ) {
                if (status === 'deleted') {
                  removeDuplicate.push(i);
                  updatedIndexes.push(j);
                } else {
                  removeDuplicate.push(j);
                  updatedIndexes.push(i);
                }
              }
            }
          }
          var rowArray = [];
          for (i = 0; i < changes.length; i++) {
            if (updatedIndexes.indexOf(i) >= 0) {
              var key = self._getId(self._rows.data[changes[i].index]);
              var updatedKey = self._getId(changes[i].value);
              if (updatedKey != null && !oj.Object.compareValues(updatedKey, key)) {
                self._rows.data[changes[i].index] = changes[i].value;
              }
              rowArray.push(changes[i].value);
            }
          }
          self.change(rowArray, null);
          rowArray = [];
          var indexArray = [];
          for (i = 0; i < changes.length; i++) {
            if (
              updatedIndexes.indexOf(i) < 0 &&
              removeDuplicate.indexOf(i) < 0 &&
              changes[i].status === 'deleted'
            ) {
              rowArray.push(changes[i].value);
            }
          }
          self.remove(rowArray, null);

          rowArray = [];
          indexArray = [];
          for (i = 0; i < changes.length; i++) {
            if (
              updatedIndexes.indexOf(i) < 0 &&
              removeDuplicate.indexOf(i) < 0 &&
              changes[i].status === 'added'
            ) {
              rowArray.push(changes[i].value);
              indexArray.push(changes[i].index);
            }
          }
          self.add(rowArray, { at: indexArray });
        },
        null,
        'arrayChange'
      );
    }
  };

  ArrayTableDataSource.prototype._wrapWritableValue = function (m) {
    var returnObj = {};

    if (m) {
      var props = Object.keys(m);

      for (var i = 0; i < props.length; i++) {
        ArrayTableDataSource._defineProperty(returnObj, m, props[i]);
      }
    } else {
      return null;
    }

    return returnObj;
  };

  // To check for observableArray, we can't do instanceof check because it's
  // a function. So we just check if it contains a subscribe function.
  ArrayTableDataSource.prototype._isObservableArray = function (obj) {
    return typeof obj === 'function' && typeof obj.subscribe === 'function';
  };

  ArrayTableDataSource._defineProperty = function (row, m, prop) {
    Object.defineProperty(row, prop, {
      get: function () {
        return m[prop];
      },
      set: function (newValue) {
        // eslint-disable-next-line no-param-reassign
        m[prop] = newValue;
      },
      enumerable: true
    });
  };

  ArrayTableDataSource._LOGGER_MSG = {
    _INFO_ARRAY_TABLE_DATASOURCE_IDATTR:
      "idAttribute option has not been specified. Will default to using 'id' if the field exists. If not, will use all the fields.",
    _ERR_ARRAY_TABLE_DATASOURCE_IDATTR_NOT_IN_ROW:
      'Specified idAttribute {0} not in row data. Please ensure all specified idAttribute fields are in the row data or do not specify idAttribute and all fields will be used as id.'
  };

  /**
   * Shape of Data Info returned by methods like, add/change/remove.
   * @typedef {Object} ArrayTableDataSource.RowDatas
   * @property {Array.<Object>} data An array of raw row data.
   * @property {Array.<any>} keys An array of key values for the rows.
   * @property {Array.<number>} indexes An array of index values for the rows.
   */

});
