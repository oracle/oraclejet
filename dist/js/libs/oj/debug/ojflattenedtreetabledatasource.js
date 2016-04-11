/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojdatasource-common'], 
      
       function(oj, $)
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
 * @class oj.FlattenedTreeTableDataSource
 * @extends oj.TableDataSource
 * @classdesc Object representing data used by the rowexpander component
 * @param {Object} data
 * @param {Object|null} options Array of options for the TreeTableDataSource
 * @constructor
 */
oj.FlattenedTreeTableDataSource = function(data, options)
{
  // Initialize
  options = options || {};

  if (!(data instanceof oj.FlattenedTreeDataSource))
  {
    var errSummary = oj.TableDataSource._LOGGER_MSG['_ERR_DATA_INVALID_TYPE_SUMMARY'];
    var errDetail = oj.TableDataSource._LOGGER_MSG['_ERR_DATA_INVALID_TYPE_DETAIL'];
    throw new Error(errSummary + '\n' + errDetail);
  }

  this._data = data;
  this._eventHandlers = [];
  this._startIndex = 0;
  this._nodeSetList = [];
  
  // override the fetchSize with -1 if not already specified.
  if (this._data.getOption('fetchSize') == null)
  {
    this._data.getFetchSize = function()
    {
      return -1;
    };
  }
  var self = this;
  // override the insert/removeRows function
  this._data.insertRows = function(insertAtIndex, insertAtKey, nodeSet)
  {
    var i, row, rowIdx, rowKey;
    var rowArray = [];
    var keyArray = [];
    var indexArray = [];
    for (i = 0; i < nodeSet.getCount(); i++)
    {
      row = nodeSet.getData(i);
      rowKey = nodeSet.getMetadata(i)['key'];
      rowIdx = insertAtIndex + i;
      self._nodeSetList[rowIdx] = {};
      self._nodeSetList[rowIdx]['nodeSet'] = nodeSet;
      self._nodeSetList[rowIdx]['startIndex'] = insertAtIndex;
      rowArray.push(row);
      keyArray.push(rowKey);
      indexArray.push(rowIdx);
      self._rows['data'].splice(rowIdx, 0, row);
      self._rows['keys'].splice(rowIdx, 0, rowKey);
      self._rows['indexes'].splice(rowIdx, 0, rowIdx);
    }
    if (!self._pageSize)
    {
      // only publish an add event if we are not paged. If we are paged then we re-fetch later anyway
      oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['ADD'], {'data': rowArray, 'keys': keyArray, 'indexes': indexArray});
    }
    self._realignRowIndices();
    
    if (self._pageSize)
    {
      setTimeout(function(){
        self._data.refresh();
        self._rows = null;
        self.fetch();
      }, 0);
    }
  };
  this._data.removeRows = function(rowKeys)
  {
    var i, row, rowIdx;
    var rowArray = [];
    var keyArray = [];
    var indexArray = [];
    for (i = 0; i < rowKeys.length; i++)
    {
      // indices shift down as we remove
      rowIdx = rowKeys[i].index - i;
      // just create a dummy row for deletion
      rowArray.push('');
      keyArray.push('');
      indexArray.push(rowIdx);
      self._rows['data'].splice(rowIdx, 1);
      self._rows['keys'].splice(rowIdx, 1);
      self._rows['indexes'].splice(rowIdx, 1);
    }
    if (!self._pageSize)
    {
      // only publish an remove event if we are not paged. If we are paged then we re-fetch later anyway
      oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['REMOVE'], {'data': rowArray, 'keys': keyArray, 'indexes': indexArray});
    }
    self._realignRowIndices();
    
    if (self._pageSize)
    {
      setTimeout(function(){
        self._data.refresh();
        self._rows = null;
        self.fetch();
      }, 0);
    }
  };
  
  this.Init();
  
  if ((options != null && (options['startFetch'] == 'enabled' || options['startFetch'] == null))
    || options == null)
  {
    this._startFetchEnabled = true;
  }
};

// Subclass from oj.DataSource 
oj.Object.createSubclass(oj.FlattenedTreeTableDataSource, oj.TableDataSource, "oj.FlattenedTreeTableDataSource");

/**
 * Initializes the instance.
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.Init = function()
{
  oj.FlattenedTreeTableDataSource.superclass.Init.call(this);
};

/**
 * Determines whether this FlattenedTreeTableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".  
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.getCapability = function(feature)
{
    return 'full';
};

/**
 * Retrieves the underlying DataSource.
 * @return {Object} the underlying oj.DataSource.
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.getWrappedDataSource = function()
{
    return this._data;
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
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.fetch = function(options)
{
  options = options || {};
  var self = this;
  var fetchType = options['fetchType'];
  
  if (fetchType == 'init' && !this._startFetchEnabled)
  {
      return Promise.resolve();
  }

  return self._fetchInternal(options);
};




/**** start delegated functions ****/

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
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.at = function(index, options)
{
  var row;

  if (index < 0 || index >= this._rows.length)
  {
    row = null;
  }
  else
  {
    row = {'data': this._rows['data'][index], 'index': index, 'key': this._rows['keys'][index]};
  }

  return new Promise(function(resolve, reject) {
    resolve(row);
  });
};

/**
 * Collapse the specified row.
 * @param {Object} rowKey the key of the row to collapse
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.collapse = function(rowKey)
{
  this._data.collapse(rowKey);
};


/**
 * Expand the specified row.
 * @param {Object} rowKey the key of the row to expand
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.expand = function(rowKey)
{
  this._data.expand(rowKey);
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
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.get = function(id, options)
{
  oj.Assert.failedInAbstractFunction();
  return null;
};

/**
 * Attach an event handler to the datasource
 * 
 * @param {string} eventType eventType supported by the datasource
 * @param {function(Object)} eventHandler event handler function
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.on = function(eventType, eventHandler)
{
  if (eventType == 'expand' ||
      eventType == 'collapse')
  {
    // expand/collapse listeners should be passed through to the FlattenedTreeDatasource
    this._data.on(eventType, eventHandler);
  }
  else
  {
    oj.FlattenedTreeTableDataSource.superclass.on.call(this, eventType, eventHandler);
  }
};

/**
 * Detach an event handler from the datasource
 * 
 * @param {string} eventType eventType supported by the datasource
 * @param {function(Object)} eventHandler event handler function
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.off = function(eventType, eventHandler)
{
  if (eventType == 'expand' ||
      eventType == 'collapse')
  {
    // expand/collapse listeners should be passed through to the FlattenedTreeDatasource
    this._data.off(eventType, eventHandler);
  }
  else
  {
    oj.FlattenedTreeTableDataSource.superclass.off.call(this, eventType, eventHandler);
  }
};

/**
 * Performs a sort on the data source.
 * @param {Object} criteria the sort criteria.
 * @param {Object} criteria.key The key that identifies which field to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @return {Promise} promise object triggering done when complete.
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.sort = function(criteria)
{
  if (criteria == null)
  {
      return Promise.resolve();
  }
  
  var self = this;
  criteria['axis'] = 'column';
  return new Promise(function(resolve, reject) 
  {
    self._data.getWrappedDataSource().sort(criteria,
      {"success": function(nodeSet)
        {
          setTimeout(function()
          {
            self._data.refresh();
            self._rows = null;
            var result = {'header': criteria['key'], 'direction': criteria['direction']};
            oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['SORT'], result);
            resolve(result);
          }, 0);
        }.bind(this),
        "error": function(status)
        {
          //this._handleFetchRowsError(status, {'start': rowStart, 'count': rowCount}, callbacks, callbackObjects);
          reject(status);
        }.bind(this)
      });
  });
};

/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @export
 * @expose
 * @memberof! oj.FlattenedTreeTableDataSource
 * @instance
 */
oj.FlattenedTreeTableDataSource.prototype.totalSize = function()
{
  return -1;
};

/**
 * Returns the confidence for the totalSize value. 
 * @return {string} "actual" if the totalSize is the time of the fetch is an exact number 
 *                  "estimate" if the totalSize is an estimate 
 *                  "atLeast" if the totalSize is at least a certain number 
 *                  "unknown" if the totalSize is unknown
 * @export
 * @expose
 * @memberof! oj.CollectionTableDataSource
 * @instance 
 */
oj.FlattenedTreeTableDataSource.prototype.totalSizeConfidence = function()
{ 
  return "unknown";
};

/**** end delegated functions ****/

oj.FlattenedTreeTableDataSource.prototype._getMetadata = function(index)
{
    
  return this._nodeSetList[index]['nodeSet'].getMetadata(index - this._nodeSetList[index]['startIndex']);
}

oj.FlattenedTreeTableDataSource.prototype._fetchInternal = function(options)
{
  options = options || {};
  this._startFetch(options);
  this._startIndex = options['startIndex'] == null ? this._startIndex : options['startIndex'];
  
  // if pageSize is not specified then fetch everything
  var rangeCount = Number.MAX_VALUE;
  
  this._pageSize = options['pageSize'] == null ? this._pageSize : options['pageSize'];
  if (this._pageSize != null)
  {
    rangeCount = this._pageSize;
  }
  
  var startIndex = this._startIndex;
  if (this._rows != null)
  {
    if (this._pageSize != null)
    {
      var endIndex = this._rows['data'].length - 1;

      if (this._startIndex + this._pageSize - 1 <= endIndex)
      {
        endIndex = oj.FlattenedTreeTableDataSource._getEndIndex(this._rows, this._startIndex, this._pageSize);
        var rowArray = [];
        var keyArray = [];
        var i;
        for (i = this._startIndex; i <= endIndex; i++)
        {
          rowArray[i - this._startIndex] = this._rows['data'][i];
          keyArray[i - this._startIndex] = this._getMetadata(i)['key'];
        }
        var result = {'data': rowArray, 'keys': keyArray, 'startIndex': this._startIndex};
        this._endFetch(options, result, null);
        return Promise.resolve(result);
      }
      else if (this._startIndex <= endIndex)
      {
        startIndex = endIndex + 1;
      }
    }
    else
    {
      // we are fetching everything again so clear out the existing cached rows
      this._data.refresh();
      this._rows = null;
    }
  }
  else
  {
    // if we don't have any cached rows then we always need to fetch from the start
    startIndex = 0;
  }
  
  var rangeOption = {'start': startIndex, 'count':  rangeCount};
  var self = this;
  return new Promise(function(resolve, reject) 
  {
    self._data.fetchRows(rangeOption,
    {
      "success": function(nodeSet)
      {
        self._handleFetchRowsSuccess(nodeSet, startIndex);
        options['refresh'] = true;
        var endIndex = oj.FlattenedTreeTableDataSource._getEndIndex(self._rows, self._startIndex, self._pageSize);
        var rowArray = [];
        var keyArray = [];
        var i;
        for (i = self._startIndex; i <= endIndex; i++)
        {
          rowArray[i - self._startIndex] = self._rows['data'][i];
          keyArray[i - self._startIndex] = self._getMetadata(i)['key'];
        }
        var result = {'data': rowArray, 'keys': keyArray, 'startIndex': self._startIndex};
        self._endFetch(options, result, null);
        resolve(result);
      }.bind(this),
      "error": function(error)
      {
        self._endFetch(options, null, error);
        reject(error);
      }.bind(this)
    });
  });
};

oj.FlattenedTreeTableDataSource.prototype._handleFetchRowsSuccess = function(nodeSet, startIndex)
{
  var i, rowIdx;
  for (i = 0; i < nodeSet.getCount(); i++)
  {
    rowIdx = startIndex + i;
    this._nodeSetList[rowIdx] = {};
    this._nodeSetList[rowIdx]['nodeSet'] = nodeSet;
    this._nodeSetList[rowIdx]['startIndex'] = startIndex;
  }

  if (!this._rows)
  {
    this._rows = {};
    this._rows['data'] = [];
    this._rows['keys'] = [];
    this._rows['indexes'] = [];
  }
  oj.FlattenedTreeTableDataSource._getRowArray(nodeSet, this, this._rows);
};

/**
 * Indicate starting fetch
 * @param {Object} options
 * @private
 */
oj.FlattenedTreeTableDataSource.prototype._startFetch = function(options)
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
oj.FlattenedTreeTableDataSource.prototype._endFetch = function(options, result, error)
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

oj.FlattenedTreeTableDataSource._getEndIndex = function(rows, startIndex, pageSize)
{
  var endIndex = rows['data'].length - 1;
  
  if (pageSize > 0)
  {
    endIndex = startIndex + pageSize - 1;
    endIndex = endIndex > rows['data'].length - 1 ? rows['data'].length - 1 : endIndex;
  }
  
  return endIndex;
};

oj.FlattenedTreeTableDataSource._getRowArray = function(nodeSet, rowSet, rows)
{
  var endIndex = nodeSet.getCount() - 1;
  var startIndex = nodeSet.getStart();

  var i;
  for (i = startIndex; i <= endIndex; i++)
  {
    var row = nodeSet.getData(i);
    rows['data'][i] = row;
    rows['keys'][i] = '';
    rows['indexes'][i] = i;
  }
};

// Realign all the indices of the rows (after sort for example)
oj.FlattenedTreeTableDataSource.prototype._realignRowIndices = function()
{
  for (var i = 0; i < this._rows['data'].length; i++)
  {
    this._rows['indexes'][i] = i;
  }
};
});
