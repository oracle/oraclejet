/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojdatasource-common'], function(oj, $)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/*jslint browser: true,devel:true*/
/**
 * @export
 * @class oj.ArrayTableDataSource
 * @extends oj.TableDataSource
 * @classdesc Object representing data used by table component
 * @param {Array|Object|function():Array} data data supported by the components
 * @param {Object|null} options Array of options for the TableDataSource
 * @constructor
 */
oj.ArrayTableDataSource = function(data, options)
{
  // Initialize
  this.data = data || {};   // This was put in to keep closure happy...
  if (!(data instanceof Array) &&
      (typeof (data) != 'function' &&
       typeof (data['subscribe']) != 'function'))
  {
    // we only support Array or ko.observableArray. To
    // check for observableArray, we can't do instanceof check because it's
    // a function. So we just check if it contains a subscribe function.
    var errSummary = oj.TableDataSource._LOGGER_MSG['_ERR_DATA_INVALID_TYPE_SUMMARY'];
    var errDetail = oj.TableDataSource._LOGGER_MSG['_ERR_DATA_INVALID_TYPE_DETAIL'];
    throw new Error(errSummary + '\n' + errDetail);
  }
  
  if (options == null || options['idAttribute'] == null)
  {
    oj.Logger.info(oj.ArrayTableDataSource._LOGGER_MSG['_INFO_ARRAY_TABLE_DATASOURCE_IDATTR']);
  }

  oj.ArrayTableDataSource.superclass.constructor.call(this, data, options);

  this._eventHandlers = [];
  this._rows = {};

  if (data != null && data !== undefined)
  {
    this._idAttribute = null;
    if (options != null && options['idAttribute'] != null)
    {
      this._idAttribute = options['idAttribute'];
    }
    this._data = (data instanceof Array) ? data : (/** @type {Function} */(data))();
    this._totalSize = this._data.length;
        
    if (!(data instanceof Array))
    {
      var self = this;
      // subscribe to observableArray arrayChange event to get individual updates
      (/** @type {{subscribe: Function}} */(data))['subscribe']
        (
          function(changes) 
          {
            if (!self._isDataLoaded())
            {
              // don't bother with data change notifications
              // if the data hasn't even been loaded yet (e.g. initial 
              // fetch hasn't happened
              return;
            }
            var i, j;
            
            // do two passes, first for deletes and the second for adds
            var rowArray = [];
            var indexArray = [];
            for (i = 0; i < changes.length; i++)
            {
              if (changes[i]['status'] === 'deleted')
              {
                rowArray.push(changes[i].value);
              }
            }
            self.remove(rowArray, null);
            
            rowArray = []; 
            indexArray = [];
            for (i = 0; i < changes.length; i++)
            {
              if (changes[i]['status'] === 'added')
              {
                rowArray.push(changes[i].value);
                indexArray.push(changes[i].index);
              }
            }
            self.add(rowArray, {'at': indexArray});
          }, null, 'arrayChange');
    }
  }

  if ((options != null && (options['startFetch'] == 'enabled' || options['startFetch'] == null))
    || options == null)
  {
    this._startFetchEnabled = true;
  }
};

// Subclass from oj.DataSource 
oj.Object.createSubclass(oj.ArrayTableDataSource, oj.TableDataSource, "oj.ArrayTableDataSource");

/**
 * @export
 * @desc If set to a function(row1, row2), then this function is called comparing raw row data (see the
 * JavaScript array.sort() for details)
 */
oj.ArrayTableDataSource.prototype.comparator = null;

/**
 * @export
 * @desc The sort criteria. Whenever sort() is called with the criteria parameter, that value is copied to this
 * property. If sort() is called with empty sort criteria then the criteria set in this property is used.
 * 
 * @type {Object} criteria the sort criteria.
 * @property {Object} criteria.key The key that identifies which field to sort
 * @property {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 */
oj.ArrayTableDataSource.prototype.sortCriteria = null;

/**
 * Initializes the instance.
 * @export
 * @expose
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.Init = function()
{
  oj.ArrayTableDataSource.superclass.Init.call(this);
};

/**
 * Add a row (or array of rows) to the end
 * 
 * @param {Object} m Row object data (or array of rows) to add. These should be sets of attribute/values.
 * @param {Object=} options silent: if set, do not fire an add event<p>
 *                          at: splice the new row at the value given (at:index). If an array of rows then this should be an array of indexes <p>
 * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of keys, and an array of indexes which were added triggering done when complete.<p>
 *         The structure of the resolved compound object is:<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
 * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
 * <tr><td><b>indexes</b></td><td>An array of index values for the rows</td></tr>
 * </tbody>
 * </table> 
 * @export
 * @expose
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.add = function(m, options)
{
  options = options || {};
  this._checkDataLoaded();
  var index = options['at'];

  return this._addToRowSet(m, index, options);
};

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
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.at = function(index, options)
{
  this._checkDataLoaded();
  var row;

  if (index < 0 || index >= this._rows['data'].length)
  {
    row = null;
  }
  else
  {
    row = {'data': this._rows['data'][index], 'index': index, 'key': this._getId(this._rows['data'][index])};
  }

  return new Promise(function(resolve, reject) {
    resolve(row);
  });
};

/**
 * Change a row (or array of rows), if found.
 * @param {Object} m Row object data (or array of rows) to change. These should be sets of attribute/values.
 * @param {Object=} options silent: if set, do not fire a change event<p>
 * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of keys, and an array of indexes which were changed triggering done when complete.<p>
 *         The structure of the resolved compound object is:<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
 * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
 * <tr><td><b>indexes</b></td><td>An array of index values for the rows</td></tr>
 * </tbody>
 * </table> 
 * @export
 * @expose
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.change = function(m, options)
{
  options = options || {};
  this._checkDataLoaded();
  var silent = options['silent'];
  var i, row, key, changedRow, rowArray = {};
  rowArray['data'] = [];
  rowArray['keys'] = [];
  rowArray['indexes'] = [];
  
  if (!(m instanceof Array))
  {
    m = [m];
  }
  
  for (i = 0; i < m.length; i++)
  {
    row = m[i];
    
    if (row != null)
    {
      key = this._getId(row);
      changedRow = this._getInternal(key, null);
      rowArray['data'].push(this._wrapWritableValue(row));
      rowArray['keys'].push(key);
      rowArray['indexes'].push(changedRow['index']);
      this._rows['data'][changedRow['index']] = row;
    }
  }
    
  if (!silent && rowArray['data'].length > 0)
  {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType['CHANGE'], rowArray);
  }
    
  return Promise.resolve(rowArray);
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
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.fetch = function(options)
{
  options = options || {};
  var fetchType = options['fetchType'];
  
  if (fetchType == 'init' && !this._startFetchEnabled)
  {
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
 * @export
 * @expose
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.get = function(id, options)
{
  options = options || {};
  this._checkDataLoaded();
  return Promise.resolve(this._getInternal(id, options));
};

/**
 * Determines whether this TableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".  
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.getCapability = function(feature)
{
  return 'full';
};

/**
 * Remove a row (or array of rows), if found.
 * @param {Object}  m Row object data (or array of rows) to remove. These should be sets of attribute/values.
 * @param {Object=} options silent: if set, do not fire a remove event 
 * @return {Promise} Promise object resolves to a compound object which contains an array of row data objects, an array of keys, and an array of indexes which were removed triggering done when complete.<p>
 *         The structure of the resolved compound object is:<p>
 * <table>
 * <tbody>
 * <tr><td><b>data</b></td><td>An array of raw row data</td></tr>
 * <tr><td><b>keys</b></td><td>An array of key values for the rows</td></tr>
 * <tr><td><b>indexes</b></td><td>An array of index values for the rows</td></tr>
 * </tbody>
 * </table> 
 * @export
 * @expose
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.remove = function(m, options)
{
  options = options || {};
  this._checkDataLoaded();
  return this._removeInternal(m, options);
};

/**
 * Remove and replace the entire list of rows with a new set of rows, if provided. Otherwise, empty the datasource. The next fetch
 * call will re-populate the datasource with the original array data. To empty out the data, call reset with an empty array.
 * @param {Object=} data Array of row objects with which to replace the data. 
 * @param {Object=} options user options, passed to event
 * @return {Promise} promise object triggering done when complete.
 * @export
 * @expose
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.reset = function(data, options)
{
  var i;
  options = options || {};
  options['previousRows'] = this._rows;
  var silent = options['silent'];

  if (data != null)
  {
    this._data = data;
  }
  this._rows = {};
  this._totalSize = 0;

  if (!silent)
  {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType['RESET'], null);
  }
  return Promise.resolve();
};

/**
 * Performs a sort on the data source.
 * @param {Object|null} criteria the sort criteria.
 * @param {Object} criteria.key The key that identifies which field to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @return {Promise} promise object triggering done when complete.
 * @export
 * @expose
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.sort = function(criteria)
{
  if (criteria == null)
  {
    criteria = this['sortCriteria'];
  }
  else
  {
    this['sortCriteria'] = criteria;
  }
  
  this._checkDataLoaded();
  var self = this;
  return new Promise(function(resolve, reject) {
    criteria = criteria || {};
    var comparator = self._getComparator();
    
    self._rows['data'].sort(function(a, b)
    {
      return oj.ArrayTableDataSource._sortFunc(a, b, comparator, self);
    });
    self._sorted = true;
    var result = {'header': criteria['key'], 'direction': criteria['direction']};
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['SORT'], result);
    resolve(result);
  });
};

/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @export
 * @expose
 * @memberof! oj.ArrayTableDataSource
 * @instance
 */
oj.ArrayTableDataSource.prototype.totalSize = function()
{
  return this._totalSize;
};

oj.ArrayTableDataSource.prototype._addToRowSet = function(m, index, options)
{
  var i, j, row, key;
  options = options || {};
  var silent = options['silent'];
  var rowArray = {};
  rowArray['data'] = [];
  rowArray['keys'] = [];
  rowArray['indexes'] = [];
  
  if (!(m instanceof Array))
  {
    m = [m];
  }
  if (index != null && !(index instanceof Array))
  {
    index = [index];
  }
  
  for (i = 0; i < m.length; i++)
  {
    row = m[i];
    
    if (row != null)
    {
      key = this._getId(row);

      rowArray['data'].push(this._wrapWritableValue(row));
      rowArray['keys'].push(key);

      if (this._sorted == true && this._rows['data'].length > 0)
      {
        var self = this;
        for (j = 0; j < this._rows['data'].length; j++)
        {
          if (oj.ArrayTableDataSource._sortFunc(row, this._rows['data'][j], self._getComparator(), self) < 0)
          {
            this._rows['data'].splice(j, 0, row);
            rowArray['indexes'].push(j);
            break;
          }
          else if (j == this._rows['data'].length - 1)
          {
            this._rows['data'].push(row);
            rowArray['indexes'].push(j + 1);
            break;
          }
        }
      }
      else
      {
        if (index == null)
        { 
          this._rows['data'].push(row);
          rowArray['indexes'].push(this._rows['data'].length - 1);
        }
        else
        {
          this._rows['data'].splice(index[i], 0, row);
          rowArray['indexes'].push(index[i]);
        }
      }
      this._totalSize++;
      this._realignRowIndices();
    }
  }
  
  if (!silent && rowArray['data'].length > 0)
  {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType['ADD'], rowArray);
  }
  
  return Promise.resolve(rowArray);
}

oj.ArrayTableDataSource.prototype._checkDataLoaded = function()
{
  if (!this._isDataLoaded())
  {
    if (!(this.data instanceof Array) &&
        typeof (this.data) == 'function' &&
        typeof (this.data['subscribe']) == 'function')
    {
      // if we have an observableArray, reload just in case it was changed
      this._data = (/** @type {Function} */(this.data))();
    }
    this._rows = this._getRowArray(this._data);
    this._totalSize = this._data.length;
  }
}

oj.ArrayTableDataSource.prototype._isDataLoaded = function()
{
  if (this._rows == null || this._rows['data'] == null)
  {
    return false;
  }
  
  return true;
}

oj.ArrayTableDataSource.prototype._fetchInternal = function(options)
{
  options = options || {};
  this._startFetch(options);
  this._checkDataLoaded();
  var pageSize;
  try
  {
    pageSize = options['pageSize'] > 0 ? options['pageSize'] : -1;
    if (!this._startIndex)
    {
      this._startIndex = 0;
    }
    
    this._startIndex = options['startIndex'] == null ? this._startIndex : options['startIndex'];
    var endIndex = oj.ArrayTableDataSource._getEndIndex(this._rows, this._startIndex, pageSize);
    var rowArray = [];
    var keyArray = [];
    var i, key, wrappedRow;
    for (i = this._startIndex; i <= endIndex; i++)
    {
      key = this._getId(this._rows['data'][i]);
      wrappedRow = this._wrapWritableValue(this._rows['data'][i]);
      rowArray[i - this._startIndex] = wrappedRow;
      keyArray[i - this._startIndex] = key;
    }
  }
  catch (err)
  {
    this._endFetch(options, null, err);
    return Promise.reject(err);
  }
  
  if (endIndex < this._startIndex)
  {
    // this means we have no more rows at the startIndex. So adjust our
    // startIndex down to indicate the last row
    this._startIndex = endIndex + 1;
  }
  options['pageSize'] = pageSize;
  options['startIndex'] = this._startIndex;
  options['refresh'] = true;
  var result = {'data': rowArray, 'keys': keyArray, 'startIndex': this._startIndex};
  this._endFetch(options, result, null);
  
  return Promise.resolve(result);
}

oj.ArrayTableDataSource.prototype._getInternal = function(id, options)
{
  options = options || {};
  var i, j, row, wrappedRow, key;
  var result = null;
  for (i = 0; i < this._rows['data'].length; i++)
  {
    row = this._rows['data'][i];
    if (row !== undefined)
    {
      key = this._getId(row);
      if ($.isArray(key) && $.isArray(id))
      {
        if (key.length == id.length)
        {
          var equal = true;
          for (j = 0; j < id.length; j++)
          {
            if (key[j] != id[j])
            {
              equal = false;
              break;
            }
          }
          if (equal)
          {
            wrappedRow = this._wrapWritableValue(row);
            result = {'data': wrappedRow, 'key': key, 'index': this._rows['indexes'][i]};
          }
        }
      }
      else if (key == id)
      {
        wrappedRow = this._wrapWritableValue(row);
        result = {'data': wrappedRow, 'key': key, 'index': this._rows['indexes'][i]};
      }
    }
  }
  return result;
};

oj.ArrayTableDataSource.prototype._getComparator = function()
{
  var comparator = this['comparator'];
  
  if (comparator == null)
  {
    var key = this['sortCriteria']['key']; 
    var direction = this['sortCriteria']['direction'];
  
    if (direction == 'ascending')
    {
      comparator = function(row) 
      {
        if ($.isFunction(row[key]))
        {
          return row[key]();
        }
        return row[key];
      };
    }
    else if (direction == 'descending')
    {
      comparator = function(rowA, rowB) {
        var a, b;
        if ($.isFunction(rowA[key]))
        {
          a = rowA[key]();
          b = rowB[key]();
        }
        else
        {
          a = rowA[key];
          b = rowB[key];
        }

        if (a === b)
        {
          return 0;
        }
        return a > b ? -1 : 1;
      };
    }
  }
  return comparator;
};

// Realign all the indices of the rows (after sort for example)
oj.ArrayTableDataSource.prototype._realignRowIndices = function()
{
  for (var i = 0; i < this._rows['data'].length; i++)
  {
    this._rows['indexes'][i] = i;
  }
};

oj.ArrayTableDataSource.prototype._removeInternal = function(m, options)
{
  var i, j, row, key, deletedRow;
  var self = this;
  options = options || {};
  var silent = options['silent'];
  var rowArray = {};
  rowArray['data'] = [];
  rowArray['keys'] = [];
  rowArray['indexes'] = [];
  
  if (!(m instanceof Array))
  {
    m = [m];
  }
  
  var sortedRowArray = [];
  for (i = 0; i < m.length; i++)
  {
    row = m[i];
    
    if (row != null)
    {
      key = this._getId(row);
      deletedRow = this._getInternal(key, null);
      
      if (deletedRow != null)
      {
        sortedRowArray.push({'data': deletedRow['data'], 'key': deletedRow['key'], 'index': deletedRow['index']});
      }
    }
  }
  sortedRowArray.sort(function(a, b) 
  {
    return a['index'] - b['index'];
  });
  
  for (i = 0; i < sortedRowArray.length; i++)
  {
    rowArray['data'].push(sortedRowArray[i]['data']);
    rowArray['keys'].push(sortedRowArray[i]['key']);
    rowArray['indexes'].push(sortedRowArray[i]['index']);
  }
  
  for (i = rowArray['indexes'].length - 1; i >=0; i--)
  {
    this._rows['data'].splice(rowArray['indexes'][i], 1);
    this._rows['indexes'].splice(rowArray['indexes'][i], 1);
    this._totalSize--;
    this._realignRowIndices();
  }
  
  if (!silent && rowArray['data'].length > 0)
  {
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['REMOVE'], rowArray);
  }
      
  return Promise.resolve(rowArray);
};

oj.ArrayTableDataSource.prototype._setRow = function(index, row)
{
  this._rows[index] = row;
  row['index'] = index;
};

/**
 * Indicate starting fetch
 * @param {Object} options
 * @private
 */
oj.ArrayTableDataSource.prototype._startFetch = function(options)
{
  if (!options['silent'])
  {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType['REQUEST'], {'startIndex' : options['startIndex']});
  }
};

/**
 * Indicate ending fetch
 * @param {Object} options
 * @param {Object} result Result object
 * @param {Object} error Error
 * @private
 */
oj.ArrayTableDataSource.prototype._endFetch = function(options, result, error)
{
  if (error != null)
  {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType['ERROR'], error);
  }
  else
  {
    if (!options['silent'])
    {
      oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType['SYNC'],  result);
    }
  }
};

oj.ArrayTableDataSource.prototype._handleRowChange = function(event)
{
  event['startIndex'] = this._startIndex;
  oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType['CHANGE'], event);
};

oj.ArrayTableDataSource._compareKeys = function(keyA, keyB, direction)
{
  if (direction == 'descending')
  {
    if (keyA < keyB)
    {
      return 1;
    }
    if (keyB < keyA)
    {
      return -1;
    }
  }
  else
  {
    if (keyA > keyB)
    {
      return 1;
    }
    if (keyB > keyA)
    {
      return -1;
    }
  }
  return 0;
};

oj.ArrayTableDataSource._getEndIndex = function(rows, startIndex, pageSize)
{
  var endIndex = rows['data'].length - 1;
  
  if (pageSize > 0)
  {
    endIndex = startIndex + pageSize - 1;
    endIndex = endIndex > rows['data'].length - 1 ? rows['data'].length - 1 : endIndex;
  }
  
  return endIndex;
};

oj.ArrayTableDataSource._getKey = function(val, attr) {
  if ($.isFunction(val[attr])) {
    return val[attr]();
  }
  return val[attr];
};

oj.ArrayTableDataSource.prototype._getRowArray = function(values)
{
  var endIndex = values.length - 1;

  var rowArray = {}, i, prop;
  rowArray['data'] = [];
  rowArray['indexes'] = [];
  this._attributes = null;
  
  for (i = 0; i <= endIndex; i++)
  {
    var clonedRowValues = {};
    var rowValues = values[i];

    for (prop in rowValues)
    {
      if (rowValues.hasOwnProperty(prop))
      {
        clonedRowValues[prop] = rowValues[prop];
        if (i == 0)
        {
          if (this._attributes == null)
          {
            this._attributes = [];
          }
          this._attributes.push(prop);
        }
      }
    }
    rowArray['data'][i] = clonedRowValues;
    rowArray['indexes'][i] = i;
  }

  return rowArray;
};

oj.ArrayTableDataSource.prototype._getId = function(row)
{
  var id;
  var idAttribute = this._getIdAttr(row);
  
  if ($.isArray(idAttribute))
  {
    var i;
    id = [];
    for (i = 0; i < idAttribute.length; i++)
    {
      if (idAttribute[i] in row)
      {
        id[i] =  oj.ArrayTableDataSource._getKey(row, idAttribute[i]);
      }
      else
      {
        var errDetail = oj.Translations.applyParameters(oj.ArrayTableDataSource._LOGGER_MSG['_ERR_ARRAY_TABLE_DATASOURCE_IDATTR_NOT_IN_ROW'], [idAttribute[i]]);
        throw new Error(errDetail);
      }
    }
  }
  else
  {
    if (idAttribute in row)
    {
      id = oj.ArrayTableDataSource._getKey(row, idAttribute);
    }
    else
    {
        var errDetail = oj.Translations.applyParameters(oj.ArrayTableDataSource._LOGGER_MSG['_ERR_ARRAY_TABLE_DATASOURCE_IDATTR_NOT_IN_ROW'], [idAttribute]);
        throw new Error(errDetail);
    }
  }
  
  return id;
};

oj.ArrayTableDataSource.prototype._getIdAttr = function(row)
{
  if (this._idAttribute != null)
  {
    return this._idAttribute;
  }
  else
  {
    if (this._attributes == null)
    {
      this._attributes = [];
      var prop;
      for (prop in row)
      {
        if (row.hasOwnProperty(prop))
        {
          this._attributes.push(prop);
        }
      }
    }

    if (this._attributes.hasOwnProperty('id'))
    {
      return 'id';
    }
    else
    {
      return this._attributes;
    }
  }
};

oj.ArrayTableDataSource._sortFunc = function(a, b, comparator, self)
{
  var keyA, keyB, i, retVal;
  var direction = self['sortCriteria']['direction'];

  if ($.isFunction(comparator))
  {
    // How many args?
    if (comparator.length === 1)
    {
      // "sortBy" comparator option
      keyA = comparator.call(self, a);
      keyB = comparator.call(self, b);
      var attrs1 = oj.StringUtils.isString(keyA) ? keyA.split(",") : [keyA];
      var attrs2 = oj.StringUtils.isString(keyB) ? keyB.split(",") : [keyB];
      for (i = 0; i < attrs1.length; i++)
      {
        retVal = oj.ArrayTableDataSource._compareKeys(attrs1[i], attrs2[i], direction);
        if (retVal !== 0)
        {
          return retVal;
        }
      }
      return 0;
    }
    // "sort" comparator option
    return comparator.call(self, a, b);
  }
  // String option
  if (oj.StringUtils.isString(comparator))
  {
    var attrs = comparator.split(",");

    for (i = 0; i < attrs.length; i++)
    {
      keyA = oj.ArrayTableDataSource._getKey(a, attrs[i]);
      keyB = oj.ArrayTableDataSource._getKey(b, attrs[i]);
      retVal = oj.ArrayTableDataSource._compareKeys(keyA, keyB, direction);
      if (retVal !== 0)
      {
        return retVal;
      }
    }
  }
  return 0;
};

oj.ArrayTableDataSource.prototype._wrapWritableValue = function(m)
{
  var returnObj = {};
  var i, props = Object.keys(m);
  
  for (i = 0; i < props.length; i++)
  {
    oj.ArrayTableDataSource._defineProperty(returnObj, m, props[i]);
  }
  
  return returnObj;
};

oj.ArrayTableDataSource._defineProperty = function(row, m, prop)
{
  Object.defineProperty(row, prop,
    {
      get: function()
      {
        return m[prop];
      },
      set: function(newValue)
      {
        m[prop] = newValue;
      },
      enumerable: true
    });
};

oj.ArrayTableDataSource._LOGGER_MSG =
  {
    '_INFO_ARRAY_TABLE_DATASOURCE_IDATTR': "idAttribute option has not been specified. Will default to using 'id' if the field exists. If not, will use all the fields.",
    '_ERR_ARRAY_TABLE_DATASOURCE_IDATTR_NOT_IN_ROW': "Specified idAttribute {0} not in row data. Please ensure all specified idAttribute fields are in the row data or do not specify idAttribute and all fields will be used as id."
  };
});
